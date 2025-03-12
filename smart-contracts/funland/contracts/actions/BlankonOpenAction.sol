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

library BlankonOpenActionLibrary {
  struct CollectionValues {
    uint256[][] prices;
    string[] uris;
    address[] fulfillers;
    uint256[] amounts;
    bool[] unlimiteds;
  }
}

contract BlankonOpenAction is
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
  error InvalidCommunityMember();
  error InvalidAddress();
  error InvalidAmounts();
  error ExceedAmount();

  mapping(uint256 => mapping(uint256 => uint256)) _collectionGroups;

  modifier onlyAdmin() {
    if (!pixelAccessControl.isAdmin(msg.sender)) {
      revert InvalidAddress();
    }
    _;
  }

  IModuleRegistry public immutable MODULE_GLOBALS;

  event BlankonPurchased(
    address buyerAddress,
    uint256 collectionId,
    uint256 pubId,
    uint256 profileId,
    uint256 totalAmount
  );
  event BlankonInitialized(
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
    PixelLibrary.CollectionValuesParams memory _collectionCreator = abi.decode(
      _data,
      (PixelLibrary.CollectionValuesParams)
    );

    if (!pixelAccessControl.isDesigner(_executor)) {
      revert InvalidAddress();
    }

    uint256 _collectionId = _configureCollection(
      _collectionCreator,
      _executor,
      _pubId,
      _profileId
    );

    _collectionGroups[_profileId][_pubId] = _collectionId;

    emit BlankonInitialized(
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
    (address _currency, uint256 _quantity) = abi.decode(
      _params.actionModuleData,
      (address, uint256)
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

    if (
      !pixelDesignData.getIsCollectionTokenAccepted(_collectionId, _currency)
    ) {
      revert CurrencyNotWhitelisted();
    }

    if (!_checkCommunity(_collectionId, _params.actorProfileId)) {
      revert InvalidCommunityMember();
    }

    if (
      pixelDesignData.getCollectionTokensMinted(_collectionId) + _quantity >
      pixelDesignData.getCollectionAmount(_collectionId)
    ) {
      revert ExceedAmount();
    }

    address _designer = pixelDesignData.getCollectionCreator(_collectionId);

    uint256 _grandTotal = _transferTokens(
      _currency,
      _designer,
      _params.actorProfileOwner,
      _collectionId,
      _quantity
    );
    PixelLibrary.BuyTokensOnlyNFTParams memory _buyTokensParams = PixelLibrary
      .BuyTokensOnlyNFTParams({
        collectionId: _collectionId,
        quantity: _quantity,
        buyerAddress: _params.actorProfileOwner,
        chosenCurrency: _currency,
        pubId: _params.publicationActedId,
        profileId: _params.publicationActedProfileId,
        buyerProfileId: _params.actorProfileId
      });

    marketCreator.buyTokensOnlyNFT(_buyTokensParams);

    emit BlankonPurchased(
      _params.actorProfileOwner,
      _collectionId,
      _params.publicationActedId,
      _params.publicationActedProfileId,
      _grandTotal
    );

    return abi.encode(_collectionId, _currency);
  }

  function _transferTokens(
    address _chosenCurrency,
    address _designer,
    address _buyer,
    uint256 _collectionId,
    uint256 _quantity
  ) internal returns (uint256) {
    uint256 _totalPrice = pixelDesignData.getCollectionPrices(_collectionId)[0];

    uint256 _calculatedPrice = _calculateAmount(
      _chosenCurrency,
      _totalPrice * _quantity
    );

    IERC20(_chosenCurrency).transferFrom(_buyer, _designer, _calculatedPrice);

    return _calculatedPrice;
  }

  function setPixelDesignDataAddress(
    address _newPixelDesignDataAddress
  ) public onlyAdmin {
    pixelDesignData = PixelDesignData(_newPixelDesignDataAddress);
  }

  function setPixelCommunityDataAddress(
    address _newPixelCommunityDataAddress
  ) public onlyAdmin {
    pixelCommunityData = PixelCommunityData(_newPixelCommunityDataAddress);
  }

  function setPixelAccessControlAddress(
    address _newPixelAccessControlAddress
  ) public onlyAdmin {
    pixelAccessControl = PixelAccessControl(_newPixelAccessControlAddress);
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
        pixelType: 6,
        origin: 1,
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
    if (_amountInWei == 0) {
      revert InvalidAmounts();
    }

    uint256 _exchangeRate = pixelSplitsData.getRateByCurrency(_currency);

    uint256 _weiDivisor = pixelSplitsData.getWeiByCurrency(_currency);
    uint256 _tokenAmount = (_amountInWei * _weiDivisor) / _exchangeRate;

    return _tokenAmount;
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
