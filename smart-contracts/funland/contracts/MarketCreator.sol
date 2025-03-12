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

import "./PixelAccessControl.sol";
import "./PixelOrderData.sol";
import "./CollectionCreator.sol";
import "./PixelSplitsData.sol";
import "./PixelDesignData.sol";

contract MarketCreator {
  PixelAccessControl public pixelAccessControl;
  PixelOrderData public pixelOrderData;
  CollectionCreator public collectionCreator;
  PixelSplitsData public pixelSplitsData;
  PixelDesignData public pixelDesignData;
  string public symbol;
  string public name;
  address public fiatPKPAddress;

  error InvalidAddress();

  modifier onlyAdmin() {
    if (!pixelAccessControl.isAdmin(msg.sender)) {
      revert InvalidAddress();
    }
    _;
  }

  constructor(
    address _pixelAccessControlAddress,
    address _pixelSplitsDataAddress,
    address _pixelOrderDataAddress,
    address _collectionCreatorAddress,
    address _pixelDesignDataAddress,
    address _fiatPKPAddress
  ) {
    pixelAccessControl = PixelAccessControl(_pixelAccessControlAddress);
    pixelOrderData = PixelOrderData(_pixelOrderDataAddress);
    collectionCreator = CollectionCreator(_collectionCreatorAddress);
    pixelSplitsData = PixelSplitsData(_pixelSplitsDataAddress);
    pixelDesignData = PixelDesignData(_pixelDesignDataAddress);
    fiatPKPAddress = _fiatPKPAddress;
    symbol = "MCR";
    name = "MarketCreator";
  }

  function setPixelAccessControlAddress(
    address _newPixelAccessControlAddress
  ) public onlyAdmin {
    pixelAccessControl = PixelAccessControl(_newPixelAccessControlAddress);
  }

  function setPixelOrderDataAddress(
    address _newPixelOrderDataAddress
  ) public onlyAdmin {
    pixelOrderData = PixelOrderData(_newPixelOrderDataAddress);
  }

  function setPixelDesignDataAddress(
    address _newPixelDesignDataAddress
  ) public onlyAdmin {
    pixelDesignData = PixelDesignData(_newPixelDesignDataAddress);
  }

  function setCollectionCreatorAddress(
    address _newCollectionCreatorAddress
  ) public onlyAdmin {
    collectionCreator = CollectionCreator(_newCollectionCreatorAddress);
  }

  function setFiatPKPAddress(address _newFiatPKPAddress) public onlyAdmin {
    fiatPKPAddress = _newFiatPKPAddress;
  }

  function setPixelSplitsDataAddress(
    address _newPixelSplitsDataAddress
  ) public onlyAdmin {
    pixelSplitsData = PixelSplitsData(_newPixelSplitsDataAddress);
  }

  function buyTokens(PixelLibrary.BuyTokensParams memory _params) external {
    if (
      !pixelAccessControl.isOpenAction(msg.sender) &&
      msg.sender != fiatPKPAddress
    ) {
      revert InvalidAddress();
    }

    uint256[] memory _prices = new uint256[](_params.collectionIds.length);

    address _buyerAddress = _params.buyerAddress;
    if (msg.sender == fiatPKPAddress && _params.withPKP) {
      _buyerAddress = _params.pkpAddress;
    }

    collectionCreator.purchaseAndMintToken(
      _params.collectionIds,
      _params.collectionAmounts,
      _params.collectionIndexes,
      _buyerAddress,
      _params.chosenCurrency
    );

    for (uint256 i = 0; i < _params.collectionIds.length; i++) {
      uint256[] memory _tokenIds = pixelDesignData.getCollectionTokenIds(
        _params.collectionIds[i]
      );

      uint256[] memory _tokenIdsOrder = new uint256[](
        _params.collectionAmounts[i]
      );
      for (uint256 j = 0; j < _params.collectionAmounts[i]; j++) {
        _tokenIdsOrder[j] = _tokenIds[
          _tokenIds.length - _params.collectionAmounts[i] + j
        ];
      }

      uint256 _price = pixelDesignData.getCollectionPrices(
        _params.collectionIds[i]
      )[_params.collectionIndexes[i]] * _params.collectionAmounts[i];

      address _fulfiller = pixelDesignData.getCollectionFulfiller(
        _params.collectionIds[i]
      );

      pixelOrderData.createSubOrder(
        _tokenIdsOrder,
        _fulfiller,
        _buyerAddress,
        _params.collectionAmounts[i],
        pixelOrderData.getOrderSupply() + 1,
        _price,
        _params.collectionIds[i]
      );

      _prices[i] = _price;
    }

    uint256 _totalPrice = 0;

    for (uint256 i = 0; i < _prices.length; i++) {
      _totalPrice += _prices[i];
    }

    uint256[] memory _subOrderIds = new uint256[](_params.collectionIds.length);
    for (uint256 i = 0; i < _params.collectionIds.length; i++) {
      _subOrderIds[i] = pixelOrderData.getSubOrderSupply() - i;
    }

    pixelOrderData.createOrder(
      _subOrderIds,
      _params.details,
      _params.chosenCurrency,
      _buyerAddress,
      _params.pubId,
      _params.profileId,
      _params.buyerProfileId,
      _totalPrice,
      _params.withPKP
    );
  }

  function buyTokensOnlyNFT(
    PixelLibrary.BuyTokensOnlyNFTParams memory _params
  ) external {
    if (!pixelAccessControl.isOpenAction(msg.sender)) {
      revert InvalidAddress();
    }

    collectionCreator.purchaseAndMintToken(
      _oneItem(_params.collectionId),
      _oneItem(_params.quantity),
      new uint256[](1),
      _params.buyerAddress,
      _params.chosenCurrency
    );

    uint256 _price = pixelDesignData.getCollectionPrices(_params.collectionId)[
      0
    ] * _params.quantity;

    uint256[] memory _tokenIds = pixelDesignData.getCollectionTokenIds(
      _params.collectionId
    );

    uint256[] memory _tokenIdsOrder = new uint256[](_params.quantity);
    for (uint256 j = 0; j < _params.quantity; j++) {
      _tokenIdsOrder[j] = _tokenIds[_tokenIds.length - _params.quantity + j];
    }

    pixelOrderData.createNFTOnlyOrder(
      _tokenIdsOrder,
      _params.chosenCurrency,
      _params.buyerAddress,
      _params.pubId,
      _params.profileId,
      _params.buyerProfileId,
      _price,
      _params.collectionId,
      _params.quantity
    );
  }

  function _oneItem(uint256 _value) private pure returns (uint256[] memory) {
    uint256[] memory _arr = new uint256[](1);
    _arr[0] = _value;

    return _arr;
  }
}
