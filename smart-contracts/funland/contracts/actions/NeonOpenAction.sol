// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.19;

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

import {HubRestricted} from "./../lens/v2/base/HubRestricted.sol";
import {Types} from "./../lens/v2/libraries/constants/Types.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {IPublicationActionModule} from "./../lens/v2/interfaces/IPublicationActionModule.sol";
import {ILensModule} from "./../lens/v2/interfaces/ILensModule.sol";
import {IModuleRegistry} from "./../lens/v2/interfaces/IModuleRegistry.sol";
import "./../MarketCreator.sol";
import "./../PixelSplitsData.sol";
import "./../PixelDesignData.sol";
import "./../neon/NeonData.sol";
import "./../neon/NeonMilestoneEscrow.sol";
import "./../neon/NeonAccessControl.sol";
import "./../neon/NeonLibrary.sol";

contract NeonOpenAction is
  HubRestricted,
  ILensModule,
  IPublicationActionModule
{
  MarketCreator public marketCreator;
  NeonAccessControl public neonAccessControl;
  PixelSplitsData public pixelSplitsData;
  PixelDesignData public pixelDesignData;
  NeonData public neonData;
  NeonMilestoneEscrow public neonMilestone;
  string private _metadata;

  modifier onlyAdmin() {
    if (!neonAccessControl.isAdmin(msg.sender)) {
      revert NeonErrors.InvalidAddress();
    }
    _;
  }

  IModuleRegistry public immutable MODULE_GLOBALS;

  mapping(uint256 => mapping(uint256 => mapping(uint8 => NeonLibrary.LevelInfo))) _grantGroups;
  mapping(uint256 => mapping(uint256 => address)) _granteeReceiver;

  event GrantContributed(
    address granteeAddress,
    uint256 level,
    uint256 pubId,
    uint256 profileId,
    uint256 amount
  );
  event LevelsAdded(uint256 profileId, uint256 pubId, address granteeAddress);

  constructor(
    string memory _metadataDetails,
    address _hub,
    address _moduleGlobals,
    address _neonAccessControlAddress,
    address _pixelSplitsDataAddress,
    address _pixelDesignDataAddress,
    address _marketCreatorAddress,
    address _neonMilestoneAddress,
    address _neonDataAddress
  ) HubRestricted(_hub) {
    MODULE_GLOBALS = IModuleRegistry(_moduleGlobals);
    marketCreator = MarketCreator(_marketCreatorAddress);
    neonAccessControl = NeonAccessControl(_neonAccessControlAddress);
    pixelSplitsData = PixelSplitsData(_pixelSplitsDataAddress);
    pixelDesignData = PixelDesignData(_pixelDesignDataAddress);
    neonData = NeonData(_neonDataAddress);
    neonMilestone = NeonMilestoneEscrow(_neonMilestoneAddress);
    _metadata = _metadataDetails;
  }

  function initializePublicationAction(
    uint256 _profileId,
    uint256 _pubId,
    address _executor,
    bytes calldata _data
  ) external override onlyHub returns (bytes memory) {
    if (!neonAccessControl.isGrantee(_executor)) {
      revert NeonErrors.InvalidAddress();
    }
    NeonLibrary.RegisterProps memory _register = abi.decode(
      _data,
      (NeonLibrary.RegisterProps)
    );

    for (uint8 i = 0; i < 3; i++) {
      if (
        _register.acceptedCurrencies.length !=
        _register.goalToCurrency[i].length
      ) {
        revert NeonErrors.InvalidLengths();
      }
    }

    _grantGroups[_profileId][_pubId][0] = _register.levelInfo[0];
    _grantGroups[_profileId][_pubId][1] = _register.levelInfo[1];
    _grantGroups[_profileId][_pubId][2] = _register.levelInfo[2];
    _grantGroups[_profileId][_pubId][3] = _register.levelInfo[3];
    _grantGroups[_profileId][_pubId][4] = _register.levelInfo[4];
    _grantGroups[_profileId][_pubId][5] = _register.levelInfo[5];

    neonData.registerGrant(
      NeonLibrary.CreateGrant({
        levelInfo: _register.levelInfo,
        goalToCurrency: _register.goalToCurrency,
        acceptedCurrencies: _register.acceptedCurrencies,
        granteeAddresses: _register.granteeAddresses,
        splitAmounts: _register.splitAmounts,
        submitBys: _register.submitBys,
        uri: _register.uri,
        pubId: _pubId,
        profileId: _profileId
      })
    );

    _granteeReceiver[_profileId][_pubId] = _executor;

    emit LevelsAdded(_profileId, _pubId, _executor);

    return abi.encode(_profileId, _pubId, _executor);
  }

  function processPublicationAction(
    Types.ProcessActionParams calldata _params
  ) external override onlyHub returns (bytes memory) {
    (
      uint256[] memory _chosenIndexes,
      string memory _encryptedFulfillment,
      address _currency,
      uint8 _level
    ) = abi.decode(
        _params.actionModuleData,
        (uint256[], string, address, uint8)
      );

    address _granteeReceiverAddress = _granteeReceiver[
      _params.publicationActedProfileId
    ][_params.publicationActedId];
    uint256 _grantId = neonData.getGrantId(
      _params.publicationActedProfileId,
      _params.publicationActedId
    );

    if (
      !MODULE_GLOBALS.isErc20CurrencyRegistered(_currency) ||
      !pixelSplitsData.getIsCurrency(_currency) ||
      !neonData.getIsGrantAcceptedCurrency(_currency, _grantId)
    ) {
      revert NeonErrors.CurrencyNotWhitelisted();
    }

    uint256 _grantAmount = 0;

    if (_level != 1) {
      uint256[] memory _collectionIds = _grantGroups[
        _params.publicationActedProfileId
      ][_params.publicationActedId][_level - 2].collectionIds;
      uint256[] memory _chosenAmounts = _grantGroups[
        _params.publicationActedProfileId
      ][_params.publicationActedId][_level - 2].amounts;

      _grantAmount = _processLevels(
        _collectionIds,
        _chosenIndexes,
        _chosenAmounts,
        _currency,
        _params.actorProfileOwner
      );

      PixelLibrary.BuyTokensParams memory _buyTokensParams = PixelLibrary
        .BuyTokensParams({
          collectionIds: _collectionIds,
          collectionAmounts: _chosenAmounts,
          collectionIndexes: _chosenIndexes,
          details: _encryptedFulfillment,
          buyerAddress: _params.actorProfileOwner,
          chosenCurrency: _currency,
          pubId: _params.publicationActedId,
          profileId: _params.publicationActedProfileId,
          buyerProfileId: _params.actorProfileId,
          pkpAddress: address(0),
          withPKP: false
        });

      marketCreator.buyTokens(_buyTokensParams);
    } else {
      _grantAmount =
        (10 ** 18 * pixelSplitsData.getWeiByCurrency(_currency)) /
        pixelSplitsData.getRateByCurrency(_currency);
    }

    IERC20(_currency).transferFrom(
      _params.actorProfileOwner,
      address(this),
      _grantAmount
    );
    IERC20(_currency).approve(address(neonMilestone), _grantAmount);
    neonMilestone.fundGrant(_currency, _grantAmount, _grantId);

    neonData.setGrantAmountFunded(
      _encryptedFulfillment,
      _currency,
      _params.actorProfileOwner,
      _grantId,
      _grantAmount,
      _level
    );

    emit GrantContributed(
      _granteeReceiverAddress,
      _level,
      _params.publicationActedId,
      _params.publicationActedProfileId,
      _grantAmount
    );

    return abi.encode(_level, _currency, _chosenIndexes);
  }

  function _processLevels(
    uint256[] memory _collectionIds,
    uint256[] memory _chosenIndexes,
    uint256[] memory _chosenAmounts,
    address _currency,
    address _buyer
  ) internal returns (uint256) {
    uint256 _grantAmount = 0;

    for (uint256 i = 0; i < _collectionIds.length; i++) {
      if (
        !pixelDesignData.getIsCollectionTokenAccepted(
          _collectionIds[i],
          _currency
        )
      ) {
        revert NeonErrors.CurrencyNotWhitelisted();
      }

      address _fulfiller = pixelDesignData.getCollectionFulfiller(
        _collectionIds[i]
      );
      uint256 _pixelType = pixelDesignData.getCollectionPixelType(
        _collectionIds[i]
      );

      _grantAmount += _transferTokens(
        NeonLibrary.TransferTokens({
          collectionId: _collectionIds[i],
          chosenIndex: _chosenIndexes[i],
          chosenAmount: _chosenAmounts[i],
          fulfillerSplit: pixelSplitsData.getFulfillerSplit(
            _fulfiller,
            _pixelType
          ),
          fulfillerBase: pixelSplitsData.getFulfillerBase(
            _fulfiller,
            _pixelType
          ),
          fulfiller: _fulfiller,
          designer: pixelDesignData.getCollectionCreator(_collectionIds[i]),
          chosenCurrency: _currency,
          buyer: _buyer
        })
      );
    }

    return _grantAmount;
  }

  function _transferTokens(
    NeonLibrary.TransferTokens memory _params
  ) internal returns (uint256) {
    uint256 _totalPrice = pixelDesignData.getCollectionPrices(
      _params.collectionId
    )[_params.chosenIndex] * _params.chosenAmount;

    uint256 _calculatedPrice = _calculateAmount(
      _params.chosenCurrency,
      _totalPrice
    );

    uint256 _calculatedBase = _calculateAmount(
      _params.chosenCurrency,
      _params.fulfillerBase * _params.chosenAmount
    );
    uint256 _fulfillerAmount = _calculatedBase +
      ((_params.fulfillerSplit * _calculatedPrice) / 1e20);

    if (_fulfillerAmount > 0) {
      IERC20(_params.chosenCurrency).transferFrom(
        _params.buyer,
        _params.fulfiller,
        _fulfillerAmount
      );
    }

    uint256 _finalAmount = _calculatedPrice - _fulfillerAmount;

    if ((_calculatedPrice - _fulfillerAmount) > 0) {
      uint256 _designerAmount = ((_calculatedPrice - _fulfillerAmount) * 30) /
        100;

      IERC20(_params.chosenCurrency).transferFrom(
        _params.buyer,
        _params.designer,
        _designerAmount
      );

      _finalAmount = _finalAmount - _designerAmount;
    }

    return _finalAmount;
  }

  function setPixelSplitsDataAddress(
    address _newPixelSplitsDataAddress
  ) public onlyAdmin {
    pixelSplitsData = PixelSplitsData(_newPixelSplitsDataAddress);
  }

  function setPixelDesignDataAddress(
    address _newPixelDesignDataAddress
  ) public onlyAdmin {
    pixelDesignData = PixelDesignData(_newPixelDesignDataAddress);
  }

  function setNeonAccessControlAddress(
    address _newNeonAccessControlAddress
  ) public onlyAdmin {
    neonAccessControl = NeonAccessControl(_newNeonAccessControlAddress);
  }

  function setMarketCreatorAddress(
    address _newMarketCreatorAddress
  ) public onlyAdmin {
    marketCreator = MarketCreator(_newMarketCreatorAddress);
  }

  function setNeonDataAddress(address _newNeonDataAddress) public onlyAdmin {
    neonData = NeonData(_newNeonDataAddress);
  }

  function setNeonMilestoneAddress(
    address _newNeonMilestoneAddress
  ) public onlyAdmin {
    neonMilestone = NeonMilestoneEscrow(_newNeonMilestoneAddress);
  }

  function _calculateAmount(
    address _currency,
    uint256 _amountInWei
  ) internal view returns (uint256) {
    uint256 _exchangeRate = pixelSplitsData.getRateByCurrency(_currency);

    if (_exchangeRate == 0) {
      revert NeonErrors.InvalidAmounts();
    }

    uint256 _weiDivisor = pixelSplitsData.getWeiByCurrency(_currency);
    uint256 _tokenAmount = (_amountInWei * _weiDivisor) / _exchangeRate;

    return _tokenAmount;
  }

  function getGranteeReceiverAddress(
    uint256 _pubId,
    uint256 _profileId
  ) public view returns (address) {
    return _granteeReceiver[_profileId][_pubId];
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
