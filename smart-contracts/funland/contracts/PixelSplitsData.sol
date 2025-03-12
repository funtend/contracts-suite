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
import "./PixelLibrary.sol";

contract PixelSplitsData {
  PixelAccessControl public pixelAccessControl;
  string public symbol;
  string public name;
  address[] private _allCurrencies;

  mapping(address => mapping(uint256 => uint256)) private _designerSplits;
  mapping(address => mapping(uint256 => uint256)) private _fulfillerSplits;
  mapping(address => mapping(uint256 => uint256)) private _treasurySplits;
  mapping(address => mapping(uint256 => uint256)) private _fulfillerBases;
  mapping(address => uint256) private _currencyIndex;
  mapping(address => bool) private _currencies;
  mapping(address => uint256) private _weiConversion;
  mapping(address => uint256) private _currencyToRate;

  error AddressNotAdmin();
  error ExistingCurrency();
  error CurrencyDoesntExist();
  error InvalidCurrency();

  event FulfillerSplitSet(address fulfiller, uint256 pixelType, uint256 split);
  event FulfillerBaseSet(address fulfiller, uint256 pixelType, uint256 split);
  event DesignerSplitSet(address designer, uint256 pixelType, uint256 split);
  event TreasurySplitSet(address treasury, uint256 pixelType, uint256 split);
  event CurrencyAdded(address indexed currency);
  event CurrencyRemoved(address indexed currency);
  event OracleUpdated(address indexed currency, uint256 rate);

  modifier onlyAdmin() {
    if (!pixelAccessControl.isAdmin(msg.sender)) {
      revert AddressNotAdmin();
    }
    _;
  }

  constructor(address _pixelAccessControlAddress) {
    pixelAccessControl = PixelAccessControl(_pixelAccessControlAddress);
    symbol = "PSD";
    name = "PixelSplitsData";
  }

  function setFulfillerSplit(
    address _address,
    uint256 _pixelType,
    uint256 _amount
  ) external onlyAdmin {
    _fulfillerSplits[_address][_pixelType] = _amount;

    emit FulfillerSplitSet(_address, _pixelType, _amount);
  }

  function setFulfillerBase(
    address _address,
    uint256 _pixelType,
    uint256 _amount
  ) external onlyAdmin {
    _fulfillerBases[_address][_pixelType] = _amount;
    emit FulfillerBaseSet(_address, _pixelType, _amount);
  }

  function setDesignerSplit(
    address _address,
    uint256 _pixelType,
    uint256 _amount
  ) external onlyAdmin {
    _designerSplits[_address][_pixelType] = _amount;
    emit DesignerSplitSet(_address, _pixelType, _amount);
  }

  function setTreasurySplit(
    address _address,
    uint256 _pixelType,
    uint256 _amount
  ) external onlyAdmin {
    _treasurySplits[_address][_pixelType] = _amount;
    emit TreasurySplitSet(_address, _pixelType, _amount);
  }

  function addCurrency(
    address _currency,
    uint256 _weiAmount
  ) external onlyAdmin {
    if (_currencies[_currency]) {
      revert ExistingCurrency();
    }
    _currencies[_currency] = true;
    _weiConversion[_currency] = _weiAmount;
    _allCurrencies.push(_currency);
    _currencyIndex[_currency] = _allCurrencies.length - 1;
    emit CurrencyAdded(_currency);
  }

  function removeCurrency(address _currency) external onlyAdmin {
    if (!_currencies[_currency]) {
      revert CurrencyDoesntExist();
    }
    uint256 index = _currencyIndex[_currency];
    address lastCurrency = _allCurrencies[_allCurrencies.length - 1];
    _allCurrencies[index] = lastCurrency;
    _currencyIndex[lastCurrency] = index;
    _allCurrencies.pop();
    delete _currencyIndex[_currency];
    _currencies[_currency] = false;
    _weiConversion[_currency] = 0;
    emit CurrencyRemoved(_currency);
  }

  function setOraclePriceDAI(
    address _currencyAddress,
    uint256 _rate
  ) public onlyAdmin {
    if (!_currencies[_currencyAddress]) {
      revert InvalidCurrency();
    }

    _currencyToRate[_currencyAddress] = _rate;
    emit OracleUpdated(_currencyAddress, _rate);
  }

  function getFulfillerBase(
    address _address,
    uint256 _pixelType
  ) public view returns (uint256) {
    return _fulfillerBases[_address][_pixelType];
  }

  function getFulfillerSplit(
    address _address,
    uint256 _pixelType
  ) public view returns (uint256) {
    return _fulfillerSplits[_address][_pixelType];
  }

  function getDesignerSplit(
    address _address,
    uint256 _pixelType
  ) public view returns (uint256) {
    return _designerSplits[_address][_pixelType];
  }

  function getTreasurySplit(
    address _address,
    uint256 _pixelType
  ) public view returns (uint256) {
    return _treasurySplits[_address][_pixelType];
  }

  function setPixelAccessControlAddress(
    address _newPixelAccessControlAddress
  ) public onlyAdmin {
    pixelAccessControl = PixelAccessControl(_newPixelAccessControlAddress);
  }

  function getIsCurrency(address _address) public view returns (bool) {
    return _currencies[_address];
  }

  function getRateByCurrency(address _currency) public view returns (uint256) {
    return _currencyToRate[_currency];
  }

  function getWeiByCurrency(address _currency) public view returns (uint256) {
    return _weiConversion[_currency];
  }

  function getAllCurrencies() public view returns (address[] memory) {
    return _allCurrencies;
  }
}
