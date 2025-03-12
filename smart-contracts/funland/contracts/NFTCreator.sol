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

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "./PixelDesignData.sol";
import "./CollectionCreator.sol";
import "./PixelAccessControl.sol";
import "./PixelLibrary.sol";

contract NFTCreator is ERC721Enumerable {
  CollectionCreator public collectionCreator;
  PixelDesignData public pixelData;
  PixelAccessControl public pixelAccessControl;

  error OnlyCollectionCreator();
  error AddressNotAdmin();

  event BatchTokenMinted(address indexed to, uint256[] tokenIds);

  modifier onlyAdmin() {
    if (!pixelAccessControl.isAdmin(msg.sender)) {
      revert AddressNotAdmin();
    }
    _;
  }

  constructor(
    address _pixelDataAddress,
    address _pixelAccessControlAddress
  ) ERC721("NFTCreator", "NFTC") {
    pixelData = PixelDesignData(_pixelDataAddress);
    pixelAccessControl = PixelAccessControl(_pixelAccessControlAddress);
  }

  function mintBatch(
    string memory _uri,
    address _purchaserAddress,
    address _chosenCurrency,
    uint256 _amount,
    uint256 _collectionId,
    uint256 _chosenIndex
  ) public {
    if (msg.sender != address(collectionCreator)) {
      revert OnlyCollectionCreator();
    }
    uint256[] memory tokenIds = new uint256[](_amount);
    uint256 _supply = pixelData.getTokenSupply();
    for (uint256 i = 0; i < _amount; i++) {
      PixelLibrary.Token memory newToken = PixelLibrary.Token({
        uri: _uri,
        chosenCurrency: _chosenCurrency,
        tokenId: _supply + i + 1,
        collectionId: _collectionId,
        index: _chosenIndex
      });
      _safeMint(_purchaserAddress, _supply + i + 1);
      pixelData.setNFT(newToken);
      tokenIds[i] = _supply + i + 1;
    }

    emit BatchTokenMinted(_purchaserAddress, tokenIds);
  }

  function burnBatch(uint256[] memory _tokenIds) public {
    for (uint256 i = 0; i < _tokenIds.length; i++) {
      require(
        msg.sender == ownerOf(_tokenIds[i]),
        "ERC721Metadata: Only token owner can burn tokens"
      );
    }

    for (uint256 i = 0; i < _tokenIds.length; i++) {
      burn(_tokenIds[i]);
    }
  }

  function burn(uint256 _tokenId) public {
    require(
      msg.sender == ownerOf(_tokenId),
      "ERC721Metadata: Only token owner can burn token"
    );
    _burn(_tokenId);
  }

  function tokenURI(
    uint256 _tokenId
  ) public view virtual override returns (string memory) {
    return pixelData.getTokenURI(_tokenId);
  }

  function setPixelDesignDataAddress(
    address _newPixelDesignDataAddress
  ) public onlyAdmin {
    pixelData = PixelDesignData(_newPixelDesignDataAddress);
  }

  function setCollectionCreatorAddress(
    address _newCollectionCreatorAddress
  ) public onlyAdmin {
    collectionCreator = CollectionCreator(_newCollectionCreatorAddress);
  }

  function setPixelAccessControlAddress(
    address _newPixelAccessControlAddress
  ) public onlyAdmin {
    pixelAccessControl = PixelAccessControl(_newPixelAccessControlAddress);
  }
}
