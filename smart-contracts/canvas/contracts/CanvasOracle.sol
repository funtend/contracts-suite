// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.9;

//////////////////////////////////////////////////////////////////////////////////////
// @title   Funtend
// @notice  More at: https://funtend.xyz
// @version 1.2.0
// @author  MOKA Land
//////////////////////////////////////////////////////////////////////////////////////
//
//   ____  __  __  _  _  ____  ____  _  _  ____
//  ( ___)(  )(  )( \( )(_  _)( ___)( \( )(  _ \
//   )__)  )(__)(  )  (   )(   )__)  )  (  )(_) )
//  (__)  (______)(_)\_) (__) (____)(_)\_)(____/
//
//////////////////////////////////////////////////////////////////////////////////////

import "./CanvasAccessControl.sol";

contract CanvasOracle {
  CanvasAccessControl private _accessControl;
  string public symbol;
  string public name;
  uint256 private _rupiahPrice;
  uint256 private _bonsaiPrice;
  uint256 private _maticPrice;
  uint256 private _daiPrice;
  address private _rupiahAddress;
  address private _bonsaiAddress;
  address private _daiAddress;
  address private _maticAddress;

  mapping(address => uint256) private _addressToRate;

  modifier onlyAdmin() {
    require(
      _accessControl.isAdmin(msg.sender),
      "CanvasAccessControl: Only admin can perform this action"
    );
    _;
  }

  event AccessControlUpdated(
    address indexed oldAccessControl,
    address indexed newAccessControl,
    address updater
  );

  event OracleUpdated(
    uint256 bonsaiPrice,
    uint256 rupiahPrice,
    uint256 maticPrice,
    uint256 daiPrice
  );

  constructor(
    address _accessControlContract,
    address _bonsaiTokenAddress,
    address _rupiahTokenAddress,
    address _maticTokenAddress,
    address _daiTokenAddress,
    string memory _symbol,
    string memory _name
  ) {
    _accessControl = CanvasAccessControl(_accessControlContract);
    symbol = _symbol;
    name = _name;
    _bonsaiAddress = _bonsaiTokenAddress;
    _rupiahAddress = _rupiahTokenAddress;
    _maticAddress = _maticTokenAddress;
    _daiAddress = _daiTokenAddress;
  }

  function setOraclePricesDAI(
    uint256 _newBonsaiPrice,
    uint256 _newRupiahPrice,
    uint256 _newMaticPrice,
    uint256 _newDaiPrice
  ) public onlyAdmin {
    _rupiahPrice = _newRupiahPrice;
    _bonsaiPrice = _newBonsaiPrice;
    _daiPrice = _newDaiPrice;
    _maticPrice = _newMaticPrice;

    _addressToRate[_rupiahAddress] = _newRupiahPrice;
    _addressToRate[_bonsaiAddress] = _newBonsaiPrice;
    _addressToRate[_daiAddress] = _newDaiPrice;
    _addressToRate[_maticAddress] = _newMaticPrice;

    emit OracleUpdated(
      _newBonsaiPrice,
      _newRupiahPrice,
      _newMaticPrice,
      _newDaiPrice
    );
  }

  function updateAccessControl(
    address _newAccessControlAddress
  ) external onlyAdmin {
    address oldAddress = address(_accessControl);
    _accessControl = CanvasAccessControl(_newAccessControlAddress);
    emit AccessControlUpdated(oldAddress, _newAccessControlAddress, msg.sender);
  }

  function getDaiAddress() public view returns (address) {
    return _daiAddress;
  }

  function getBonsaiAddress() public view returns (address) {
    return _bonsaiAddress;
  }

  function getRupiahAddress() public view returns (address) {
    return _rupiahAddress;
  }

  function getMaticAddress() public view returns (address) {
    return _maticAddress;
  }

  function getBonsaiPriceDAI() public view returns (uint256) {
    return _bonsaiPrice;
  }

  function getRupiahPriceDAI() public view returns (uint256) {
    return _rupiahPrice;
  }

  function getDaiPriceDAI() public view returns (uint256) {
    return _daiPrice;
  }

  function getMaticPriceDAI() public view returns (uint256) {
    return _maticPrice;
  }

  function getRateByAddress(
    address _tokenAddress
  ) public view returns (uint256) {
    return _addressToRate[_tokenAddress];
  }

  function getAccessControlContract() public view returns (address) {
    return address(_accessControl);
  }

  function setBonsaiAddress(address _address) public onlyAdmin {
    _bonsaiAddress = _address;
  }

  function setRupiahAddress(address _address) public onlyAdmin {
    _rupiahAddress = _address;
  }

  function setMaticAddress(address _address) public onlyAdmin {
    _maticAddress = _address;
  }

  function setDaiAddress(address _address) public onlyAdmin {
    _daiAddress = _address;
  }
}
