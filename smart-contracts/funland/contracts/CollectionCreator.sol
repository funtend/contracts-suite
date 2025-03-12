// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.16;

//////////////////////////////////////////////////////////////////////////////////////
// @title   Funtend
// @notice  More at: https://funtend.xyz
// @version 1.0.0
// @author  MOKA Land
//////////////////////////////////////////////////////////////////////////////////////
//
//   ____  __  __  _  _  ____  ____  _  _  ____
//  ( ___)(  )(  )( \( )(_  _)( ___)( \( )(  _ \
//   )__)  )(__)(  )  (   )(   )__)  )  (  )(_) )
//  (__)  (______)(_)\_) (__) (____)(_)\_)(____/
//
//////////////////////////////////////////////////////////////////////////////////////

import "./NFTCreator.sol";
import "./PixelDesignData.sol";
import "./PixelAccessControl.sol";
import "./PixelLibrary.sol";
import "./PixelSplitsData.sol";

contract CollectionCreator {
  PixelDesignData public pixelDesignData;
  PixelAccessControl public pixelAccessControl;
  NFTCreator public nftCreator;
  PixelSplitsData public pixelSplitsData;
  string public symbol;
  string public name;
  address public marketCreator;

  error AddressNotMarket();
  error AddressNotDesigner();
  error AddressNotAdmin();
  error InvalidUpdate();
  error InvalidCurrency();
  error InvalidRemoval();

  modifier onlyAdmin() {
    if (!pixelAccessControl.isAdmin(msg.sender)) {
      revert AddressNotAdmin();
    }
    _;
  }

  modifier onlyDesigner() {
    if (!pixelAccessControl.isDesigner(msg.sender)) {
      revert AddressNotDesigner();
    }
    _;
  }

  constructor(
    address _nftCreatorAddress,
    address _pixelDesignDataAddress,
    address _pixelAccessControlAddress,
    address _pixelSplitsDataAddress
  ) {
    nftCreator = NFTCreator(_nftCreatorAddress);
    pixelDesignData = PixelDesignData(_pixelDesignDataAddress);
    pixelAccessControl = PixelAccessControl(_pixelAccessControlAddress);
    pixelSplitsData = PixelSplitsData(_pixelSplitsDataAddress);
    symbol = "CCR";
    name = "CollectionCreator";
  }

  function createCollection(
    PixelLibrary.MintParams memory _params
  ) external returns (uint256) {
    if (
      !pixelAccessControl.isDesigner(msg.sender) &&
      !pixelAccessControl.isOpenAction(msg.sender) &&
      !pixelAccessControl.isDesigner(_params.creator)
    ) {
      revert AddressNotDesigner();
    }

    for (uint256 k = 0; k < _params.acceptedTokens.length; k++) {
      if (!pixelSplitsData.getIsCurrency(_params.acceptedTokens[k])) {
        revert InvalidCurrency();
      }
    }

    uint256 _amount = _params.amount;
    if (_params.unlimited) {
      _amount = type(uint256).max;
    }
    PixelLibrary.Collection memory newCollection = PixelLibrary.Collection({
      collectionId: pixelDesignData.getCollectionSupply() + 1,
      prices: _params.prices,
      acceptedTokens: _params.acceptedTokens,
      communityIds: _params.communityIds,
      amount: _amount,
      pubId: _params.pubId,
      profileId: _params.profileId,
      dropId: _params.dropId,
      tokenIds: new uint256[](0),
      mintedTokens: 0,
      fulfiller: _params.fulfiller,
      creator: _params.creator,
      uri: _params.uri,
      pixelType: _params.pixelType,
      origin: _params.origin,
      unlimited: _params.unlimited,
      encrypted: _params.encrypted
    });

    uint256 _collectionId = pixelDesignData.setCollection(newCollection);
    string memory _uri = pixelDesignData.getDropURI(_params.dropId);
    uint256[] memory _collectionIds = pixelDesignData.getDropCollectionIds(
      _params.dropId
    );
    uint256[] memory _newCollectionIds = new uint256[](
      _collectionIds.length + 1
    );
    for (uint i = 0; i < _collectionIds.length; i++) {
      _newCollectionIds[i] = _collectionIds[i];
    }
    _newCollectionIds[_collectionIds.length] = _collectionId;

    _internalUpdate(_newCollectionIds, _uri, _params.creator, _params.dropId);

    return _collectionId;
  }

  function purchaseAndMintToken(
    uint256[] memory _collectionIds,
    uint256[] memory _amounts,
    uint256[] memory _chosenIndexes,
    address _purchaserAddress,
    address _chosenCurrency
  ) external {
    if (msg.sender != marketCreator) {
      revert AddressNotMarket();
    }
    uint256 _initialSupply = pixelDesignData.getTokenSupply();

    for (uint256 i = 0; i < _collectionIds.length; i++) {
      nftCreator.mintBatch(
        pixelDesignData.getCollectionURI(_collectionIds[i]),
        _purchaserAddress,
        _chosenCurrency,
        _amounts[i],
        _collectionIds[i],
        _chosenIndexes[i]
      );

      uint256[] memory _newTokenIds = new uint256[](_amounts[i]);
      uint256 _mintedTokens = 0;
      for (uint256 j = 0; j < _amounts[i]; j++) {
        uint256 tokenId = _initialSupply + j + 1;
        _newTokenIds[j] = tokenId;
        _mintedTokens++;
      }

      pixelDesignData.setCollectionMintedTokens(
        _collectionIds[i],
        _mintedTokens
      );
      pixelDesignData.setCollectionTokenIds(_collectionIds[i], _newTokenIds);
    }
  }

  function removeCollection(uint256 _collectionId) public onlyDesigner {
    if (pixelDesignData.getCollectionCreator(_collectionId) != msg.sender) {
      revert AddressNotDesigner();
    }

    if (pixelDesignData.getCollectionTokensMinted(_collectionId) > 0) {
      revert InvalidRemoval();
    }

    uint256 _dropId = pixelDesignData.getCollectionDropId(_collectionId);
    uint256[] memory _collectionIds = pixelDesignData.getDropCollectionIds(
      _dropId
    );
    string memory _uri = pixelDesignData.getDropURI(_dropId);
    uint256[] memory _newIds = new uint256[](_collectionIds.length - 1);
    uint256 j = 0;

    for (uint256 i = 0; i < _collectionIds.length; i++) {
      if (_collectionIds[i] != _collectionId) {
        _newIds[j] = _collectionIds[i];
        j++;
      }
    }

    pixelDesignData.modifyCollectionsInDrop(_newIds, _uri, _dropId);

    pixelDesignData.deleteCollection(_collectionId);
  }

  function createDrop(string memory _uri) public onlyDesigner {
    pixelDesignData.createDrop(_uri, msg.sender);
  }

  function updateDrop(
    uint256[] memory _collectionIds,
    string memory _uri,
    uint256 _dropId
  ) public {
    if (bytes(pixelDesignData.getDropURI(_dropId)).length == 0) {
      revert InvalidUpdate();
    }

    if (pixelDesignData.getDropCreator(_dropId) != msg.sender) {
      revert InvalidUpdate();
    }

    for (uint256 i = 0; i < _collectionIds.length; i++) {
      if (
        pixelDesignData.getCollectionCreator(_collectionIds[i]) != msg.sender
      ) {
        revert AddressNotDesigner();
      }
    }

    pixelDesignData.modifyCollectionsInDrop(_collectionIds, _uri, _dropId);
  }

  function removeDrop(uint256 _dropId) public onlyDesigner {
    if (
      bytes(pixelDesignData.getDropURI(_dropId)).length == 0 ||
      pixelDesignData.getDropCreator(_dropId) != msg.sender
    ) {
      revert InvalidUpdate();
    }
    pixelDesignData.deleteDrop(_dropId);
  }

  function setPixelDesignDataAddress(
    address _newPixelDesignDataAddress
  ) public onlyAdmin {
    pixelDesignData = PixelDesignData(_newPixelDesignDataAddress);
  }

  function setPixelAccessControlAddress(
    address _newPixelAccessControlAddress
  ) public onlyAdmin {
    pixelAccessControl = PixelAccessControl(_newPixelAccessControlAddress);
  }

  function setPixelSplitsDataAddress(
    address _newPixelSplitsDataAddress
  ) public onlyAdmin {
    pixelSplitsData = PixelSplitsData(_newPixelSplitsDataAddress);
  }

  function setNFTCreatorAddress(
    address _newNFTCreatorAddress
  ) public onlyAdmin {
    nftCreator = NFTCreator(_newNFTCreatorAddress);
  }

  function setMarketCreatorAddress(
    address _newMarketCreatorAddress
  ) public onlyAdmin {
    marketCreator = _newMarketCreatorAddress;
  }

  function _internalUpdate(
    uint256[] memory _collectionIds,
    string memory _uri,
    address _caller,
    uint256 _dropId
  ) internal {
    if (bytes(pixelDesignData.getDropURI(_dropId)).length == 0) {
      revert InvalidUpdate();
    }
    if (pixelDesignData.getDropCreator(_dropId) != _caller) {
      revert InvalidUpdate();
    }

    for (uint256 i = 0; i < _collectionIds.length; i++) {
      if (pixelDesignData.getCollectionCreator(_collectionIds[i]) != _caller) {
        revert AddressNotDesigner();
      }
    }

    pixelDesignData.modifyCollectionsInDrop(_collectionIds, _uri, _dropId);
  }
}
