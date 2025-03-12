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

contract CanvasPKPs {
  CanvasAccessControl private _accessControl;
  address[] private _verifiedPaymentTokens;
  address private _pkpAddress;
  string public symbol;
  string public name;

  modifier onlyAdmin() {
    require(
      _accessControl.isAdmin(msg.sender),
      "CanvasAccessControl: Only admin can perform this action"
    );
    _;
  }

  modifier onlyPKPOrAdmin() {
    require(
      _accessControl.isAdmin(msg.sender) || msg.sender == _pkpAddress,
      "CanvasPKPs: Only admin or PKP address can add a user."
    );
    _;
  }

  event AccessControlUpdated(
    address indexed oldAccessControl,
    address indexed newAccessControl,
    address updater
  );
  event PKPAddressUpdated(
    address indexed oldPKPAddress,
    address indexed newPKPAddress,
    address updater
  );
  event UserAdded(string indexed tokenId, address updater);
  event UserRemoved(string indexed tokenId, address updater);

  mapping(string => bool) private _canvasUsers;

  constructor(
    address _accessControlAddress,
    address _pkpAddressAccount,
    string memory _name,
    string memory _symbol
  ) {
    _accessControl = CanvasAccessControl(_accessControlAddress);
    symbol = _symbol;
    name = _name;
    _pkpAddress = _pkpAddressAccount;
  }

  function createUserPKPAccount(
    string memory _tokenId
  ) external onlyPKPOrAdmin {
    _canvasUsers[_tokenId] = true;
    emit UserAdded(_tokenId, msg.sender);
  }

  function removeUserPKPAccount(
    string memory _tokenId
  ) external onlyPKPOrAdmin {
    _canvasUsers[_tokenId] = false;
    emit UserRemoved(_tokenId, msg.sender);
  }

  function updateAccessControl(
    address _newAccessControlAddress
  ) external onlyAdmin {
    address oldAddress = address(_accessControl);
    _accessControl = CanvasAccessControl(_newAccessControlAddress);
    emit AccessControlUpdated(oldAddress, _newAccessControlAddress, msg.sender);
  }

  function updatePKPAddress(address _newPKPAddress) external onlyAdmin {
    address oldAddress = _pkpAddress;
    _pkpAddress = _newPKPAddress;
    emit PKPAddressUpdated(oldAddress, _newPKPAddress, msg.sender);
  }

  function userExists(string memory _tokenId) public view returns (bool) {
    return _canvasUsers[_tokenId];
  }

  function getAccessControlContract() public view returns (address) {
    return address(_accessControl);
  }

  function getPKPAddress() public view returns (address) {
    return _pkpAddress;
  }
}
