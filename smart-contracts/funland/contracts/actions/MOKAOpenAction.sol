// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.16;

//////////////////////////////////////////////////////////////////////////////////////
// @title   Funtend
// @notice  More at: https://funtend.xyz
// @version 1.1.0
// @author  MOKA Land
//////////////////////////////////////////////////////////////////////////////////////
//
//   ____  __  __  _  _  ____  ____  _  _  ____
//  ( ___)(  )(  )( \( )(_  _)( ___)( \( )(  _ \
//   )__)  )(__)(  )  (   )(   )__)  )  (  )(_) )
//  (__)  (______)(_)\_) (__) (____)(_)\_)(____/
//
//////////////////////////////////////////////////////////////////////////////////////

import {HubRestricted} from "./../lens/v2/base/HubRestricted.sol";
import {Types} from "./../lens/v2/libraries/constants/Types.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {IPublicationActionModule} from "./../lens/v2/interfaces/IPublicationActionModule.sol";
import {ILensModule} from "./../lens/v2/interfaces/ILensModule.sol";
import {IModuleRegistry} from "./../lens/v2/interfaces/IModuleRegistry.sol";
import "./../MarketCreator.sol";
import "./../CollectionCreator.sol";
import "./../PixelAccessControl.sol";
import "./../PixelDesignData.sol";
import "./../PixelCommunityData.sol";

contract MOKAOpenAction is
  HubRestricted,
  ILensModule,
  IPublicationActionModule
{
  MarketCreator public marketCreator;
  CollectionCreator public collectionCreator;
  PixelAccessControl public pixelAccessControl;
  PixelSplitsData public pixelSplitsData;
  PixelDesignData public pixelDesignData;
  PixelCommunityData public pixelCommunityData;
  string private _metadata;

  error CurrencyNotWhitelisted();
  error InvalidAddress();
  error InvalidAmounts();
  error InvalidCommunityMember();
  error ExceedAmount();

  mapping(uint256 => mapping(uint256 => uint256)) _collectionGroups;

  modifier onlyAdmin() {
    if (!pixelAccessControl.isAdmin(msg.sender)) {
      revert InvalidAddress();
    }
    _;
  }

  IModuleRegistry public immutable MODULE_GLOBALS;

  event MOKAPurchased(
    address buyerAddress,
    uint256 collectionId,
    uint256 pubId,
    uint256 profileId,
    uint256 totalAmount
  );
  event MOKAInitialized(
    uint256 collectionId,
    uint256 profileId,
    uint256 pubId,
    address creatorAddress,
    uint256 numberOfCollections
  );

  constructor(
    string memory _metadataDetails,
    address _hub,
    address _moduleGlobals,
    address _pixelAccessControlAddress,
    address _pixelSplitsDataAddress,
    address _pixelDesignDataAddress,
    address _marketCreatorAddress,
    address _collectionCreatorAddress,
    address _pixelCommunityDataAddress
  ) HubRestricted(_hub) {
    MODULE_GLOBALS = IModuleRegistry(_moduleGlobals);
    marketCreator = MarketCreator(_marketCreatorAddress);
    collectionCreator = CollectionCreator(_collectionCreatorAddress);
    pixelAccessControl = PixelAccessControl(_pixelAccessControlAddress);
    pixelSplitsData = PixelSplitsData(_pixelSplitsDataAddress);
    pixelDesignData = PixelDesignData(_pixelDesignDataAddress);
    pixelCommunityData = PixelCommunityData(_pixelCommunityDataAddress);
    _metadata = _metadataDetails;
  }

  function initializePublicationAction(
    uint256 _profileId,
    uint256 _pubId,
    address _executor,
    bytes calldata _data
  ) external override onlyHub returns (bytes memory) {
    (
      PixelLibrary.CollectionValuesParams memory _collectionCreator,
      uint256 _pixelType
    ) = abi.decode(_data, (PixelLibrary.CollectionValuesParams, uint256));

    if (!pixelAccessControl.isDesigner(_executor)) {
      revert InvalidAddress();
    }

    uint256 _collectionId = _configureCollection(
      _collectionCreator,
      _executor,
      _pixelType,
      _pubId,
      _profileId
    );

    _collectionGroups[_profileId][_pubId] = _collectionId;

    emit MOKAInitialized(
      _collectionId,
      _profileId,
      _pubId,
      _executor,
      _collectionCreator.prices.length
    );

    return
      abi.encode(
        _collectionCreator.prices,
        _collectionCreator.acceptedTokens,
        _collectionCreator.uri
      );
  }

  function processPublicationAction(
    Types.ProcessActionParams calldata _params
  ) external override onlyHub returns (bytes memory) {
    (
      uint256[] memory _chosenIndexes,
      uint256[] memory _quantities,
      string memory _encryptedFulfillment,
      address _currency,
      bool _fiat
    ) = abi.decode(
        _params.actionModuleData,
        (uint256[], uint256[], string, address, bool)
      );

    if (
      !MODULE_GLOBALS.isErc20CurrencyRegistered(_currency) ||
      !pixelSplitsData.getIsCurrency(_currency)
    ) {
      revert CurrencyNotWhitelisted();
    }

    uint256 _collectionId = _collectionGroups[
      _params.publicationActedProfileId
    ][_params.publicationActedId];

    (uint256 _grandTotal, bool _isVerified) = _managePurchase(
      _params,
      _currency,
      _chosenIndexes,
      _quantities,
      _collectionId,
      _fiat
    );

    PixelLibrary.BuyTokensParams memory _buyTokensParams = PixelLibrary
      .BuyTokensParams({
        collectionIds: _fillCollection(_collectionId, _quantities.length),
        collectionAmounts: _quantities,
        collectionIndexes: _chosenIndexes,
        details: _encryptedFulfillment,
        buyerAddress: _params.actorProfileOwner,
        chosenCurrency: _currency,
        pubId: _params.publicationActedId,
        profileId: _params.publicationActedProfileId,
        buyerProfileId: _params.actorProfileId,
        pkpAddress: address(0),
        withPKP: _isVerified
      });

    marketCreator.buyTokens(_buyTokensParams);

    emit MOKAPurchased(
      _params.actorProfileOwner,
      _collectionId,
      _params.publicationActedId,
      _params.publicationActedProfileId,
      _grandTotal
    );

    return abi.encode(_collectionId, _currency, _chosenIndexes);
  }

  function _transferTokens(
    uint256 _collectionId,
    uint256 _chosenIndex,
    uint256 _chosenAmount,
    address _chosenCurrency,
    address _designer,
    address _buyer
  ) internal returns (uint256) {
    address _fulfiller = pixelDesignData.getCollectionFulfiller(_collectionId);
    uint256 _pixelType = pixelDesignData.getCollectionPixelType(_collectionId);

    uint256 _fulfillerBase = pixelSplitsData.getFulfillerBase(
      _fulfiller,
      _pixelType
    );
    uint256 _fulfillerSplit = pixelSplitsData.getFulfillerSplit(
      _fulfiller,
      _pixelType
    );

    uint256 _totalPrice = pixelDesignData.getCollectionPrices(_collectionId)[
      _chosenIndex
    ] * _chosenAmount;

    uint256 _calculatedPrice = _calculateAmount(_chosenCurrency, _totalPrice);
    uint256 _calculatedBase = _calculateAmount(
      _chosenCurrency,
      _fulfillerBase * _chosenAmount
    );

    uint256 _fulfillerAmount = _calculatedBase +
      ((_fulfillerSplit * _calculatedPrice) / 1e20);

    if (_fulfillerAmount > 0) {
      IERC20(_chosenCurrency).transferFrom(
        _buyer,
        _fulfiller,
        _fulfillerAmount
      );
    }

    if ((_calculatedPrice - _fulfillerAmount) > 0) {
      IERC20(_chosenCurrency).transferFrom(
        _buyer,
        _designer,
        _calculatedPrice - _fulfillerAmount
      );
    }

    return _calculatedPrice;
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

  function setPixelCommunityDataAddress(
    address _newPixelCommunityDataAddress
  ) public onlyAdmin {
    pixelCommunityData = PixelCommunityData(_newPixelCommunityDataAddress);
  }

  function setMarketCreatorAddress(
    address _newMarketCreatorAddress
  ) public onlyAdmin {
    marketCreator = MarketCreator(_newMarketCreatorAddress);
  }

  function setCollectionCreatorAddress(
    address _newCollectionCreatorAddress
  ) public onlyAdmin {
    collectionCreator = CollectionCreator(_newCollectionCreatorAddress);
  }

  function _configureCollection(
    PixelLibrary.CollectionValuesParams memory _collectionCreator,
    address _executor,
    uint256 _pixelType,
    uint256 _pubId,
    uint256 _profileId
  ) internal returns (uint256) {
    uint256 _collectionId = collectionCreator.createCollection(
      PixelLibrary.MintParams({
        prices: _collectionCreator.prices,
        acceptedTokens: _collectionCreator.acceptedTokens,
        communityIds: _collectionCreator.communityIds,
        uri: _collectionCreator.uri,
        fulfiller: _collectionCreator.fulfiller,
        pubId: _pubId,
        profileId: _profileId,
        dropId: _collectionCreator.dropId,
        creator: _executor,
        pixelType: _pixelType,
        origin: 4,
        amount: _collectionCreator.amount,
        unlimited: _collectionCreator.unlimited,
        encrypted: _collectionCreator.encrypted
      })
    );

    return _collectionId;
  }

  function _checkCommunity(
    uint256 _collectionId,
    uint256 _profileId
  ) internal view returns (bool) {
    uint256[] memory _communityIds = pixelDesignData.getCollectionCommunityIds(
      _collectionId
    );
    bool _validMember = true;

    if (_communityIds.length > 0) {
      _validMember = false;
      for (uint256 j = 0; j < _communityIds.length; j++) {
        if (
          pixelCommunityData.getIsCommunityMember(_communityIds[j], _profileId)
        ) {
          return _validMember = true;
        }
      }
    }

    return _validMember;
  }

  function _calculateAmount(
    address _currency,
    uint256 _amountInWei
  ) internal view returns (uint256) {
    uint256 _exchangeRate = pixelSplitsData.getRateByCurrency(_currency);

    if (_exchangeRate == 0) {
      revert InvalidAmounts();
    }

    uint256 _weiDivisor = pixelSplitsData.getWeiByCurrency(_currency);
    uint256 _tokenAmount = (_amountInWei * _weiDivisor) / _exchangeRate;

    return _tokenAmount;
  }

  function _checkAndSend(
    address _currency,
    address _buyer,
    uint256[] memory _quantities,
    uint256[] memory _chosenIndexes,
    uint256 _collectionId,
    uint256 _profileId,
    bool _isVerified
  ) internal returns (uint256) {
    uint256 _total = 0;
    for (uint256 i = 0; i < _chosenIndexes.length; i++) {
      if (
        !pixelDesignData.getIsCollectionTokenAccepted(_collectionId, _currency)
      ) {
        revert CurrencyNotWhitelisted();
      }

      if (!_checkCommunity(_collectionId, _profileId)) {
        revert InvalidCommunityMember();
      }

      if (
        pixelDesignData.getCollectionTokensMinted(_collectionId) +
          _quantities[i] >
        pixelDesignData.getCollectionAmount(_collectionId)
      ) {
        revert ExceedAmount();
      }

      if (!_isVerified) {
        _total = _transferTokens(
          _collectionId,
          _chosenIndexes[i],
          _quantities[i],
          _currency,
          pixelDesignData.getCollectionCreator(_collectionId),
          _buyer
        );
      }
    }

    return _total;
  }

  function _managePurchase(
    Types.ProcessActionParams calldata _params,
    address _currency,
    uint256[] memory _chosenIndexes,
    uint256[] memory _quantities,
    uint256 _collectionId,
    bool _fiat
  ) internal returns (uint256, bool) {
    bool _isVerified = false;

    if (_fiat) {
      _isVerified = pixelAccessControl.isVerifiedFiat(
        _params.actorProfileOwner,
        _params.publicationActedProfileId,
        _params.publicationActedId
      );
    }

    return (
      _checkAndSend(
        _currency,
        _params.actorProfileOwner,
        _quantities,
        _chosenIndexes,
        _collectionId,
        _params.actorProfileId,
        _isVerified
      ),
      _isVerified
    );
  }

  function _fillCollection(
    uint256 _collectionId,
    uint256 _quantitiesLength
  ) internal pure returns (uint256[] memory) {
    uint256[] memory collectionIds = new uint256[](_quantitiesLength);
    for (uint256 i = 0; i < _quantitiesLength; i++) {
      collectionIds[i] = _collectionId;
    }
    return collectionIds;
  }

  function supportsInterface(
    bytes4 interfaceId
  ) external view override returns (bool) {
    return
      interfaceId == bytes4(keccak256(abi.encodePacked("LENS_MODULE"))) ||
      interfaceId == type(IPublicationActionModule).interfaceId;
  }

  function getModuleMetadataURI()
    external
    view
    override
    returns (string memory)
  {
    return _metadata;
  }
}
