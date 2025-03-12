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

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./CanvasAccessControl.sol";

contract CanvasPayment {
  CanvasAccessControl private _accessControl;
  address[] private _verifiedPaymentTokens;
  string public symbol;
  string public name;

  mapping(address => bool) private isVerifiedPaymentToken;

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

  event PaymentTokensUpdated(address[] newPaymentTokens);

  constructor(
    address _accessControlAddress,
    string memory _name,
    string memory _symbol
  ) {
    _accessControl = CanvasAccessControl(_accessControlAddress);
    symbol = _symbol;
    name = _name;
  }

  function setVerifiedPaymentTokens(
    address[] memory _paymentTokens
  ) public onlyAdmin {
    for (uint256 i = 0; i < _verifiedPaymentTokens.length; i++) {
      isVerifiedPaymentToken[_verifiedPaymentTokens[i]] = false;
    }
    delete _verifiedPaymentTokens;

    for (uint256 i = 0; i < _paymentTokens.length; i++) {
      isVerifiedPaymentToken[_paymentTokens[i]] = true;
      _verifiedPaymentTokens.push(_paymentTokens[i]);
    }

    emit PaymentTokensUpdated(_verifiedPaymentTokens);
  }

  function getVerifiedPaymentTokens() public view returns (address[] memory) {
    return _verifiedPaymentTokens;
  }

  function updateAccessControl(
    address _newAccessControlAddress
  ) external onlyAdmin {
    address oldAddress = address(_accessControl);
    _accessControl = CanvasAccessControl(_newAccessControlAddress);
    emit AccessControlUpdated(oldAddress, _newAccessControlAddress, msg.sender);
  }

  function checkIfAddressVerified(address _address) public view returns (bool) {
    return isVerifiedPaymentToken[_address];
  }

  function getAccessControlContract() public view returns (address) {
    return address(_accessControl);
  }
}
