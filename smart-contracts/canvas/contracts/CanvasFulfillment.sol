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
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract CanvasFulfillment {
  CanvasAccessControl private _accessControl;
  uint256 private _fullfillerCount;
  uint256 private _activeFulfillers;
  string public symbol;
  string public name;

  struct Fulfiller {
    uint256 fulfillerId;
    uint256 fulfillerPercent;
    address fulfillerAddress;
  }

  mapping(uint256 => Fulfiller) private _fulfillers;

  event AccessControlUpdated(
    address indexed oldAccessControl,
    address indexed newAccessControl,
    address updater
  );

  event FulfillerAddressUpdated(
    uint256 indexed fulfillerId,
    address newFulfillerAddress
  );

  event FulfillerCreated(
    uint256 indexed fulfillerId,
    uint256 fulfillerPercent,
    address fulfillerAddress
  );

  event FulfillerPercentUpdated(
    uint256 indexed fulfillerId,
    uint256 newFulfillerPercent
  );

  modifier onlyAdmin() {
    require(
      _accessControl.isAdmin(msg.sender),
      "CanvasAccessControl: Only admin can perform this action"
    );
    _;
  }

  modifier onlyFulfiller(uint256 _fulfillerId) {
    require(
      msg.sender == _fulfillers[_fulfillerId].fulfillerAddress,
      "CanvasFulfillment: Only the fulfiller can update."
    );
    _;
  }

  constructor(
    address _accessControlContract,
    string memory _symbol,
    string memory _name
  ) {
    _accessControl = CanvasAccessControl(_accessControlContract);
    symbol = _symbol;
    name = _name;
    _fullfillerCount = 0;
  }

  function createFulfiller(
    uint256 _fulfillerPercent,
    address _fulfillerAddress
  ) external onlyAdmin {
    require(
      _fulfillerPercent < 100,
      "CanvasFulfillment: Percent can not be greater than 100."
    );
    _fullfillerCount++;
    _activeFulfillers++;

    Fulfiller memory newFulfiller = Fulfiller({
      fulfillerId: _fullfillerCount,
      fulfillerPercent: _fulfillerPercent,
      fulfillerAddress: _fulfillerAddress
    });

    _fulfillers[_fullfillerCount] = newFulfiller;

    emit FulfillerCreated(
      _fullfillerCount,
      _fulfillerPercent,
      _fulfillerAddress
    );
  }

  function updateAccessControl(
    address _newAccessControlAddress
  ) external onlyAdmin {
    address oldAddress = address(_accessControl);
    _accessControl = CanvasAccessControl(_newAccessControlAddress);
    emit AccessControlUpdated(oldAddress, _newAccessControlAddress, msg.sender);
  }

  function updateFulfillerPercent(
    uint256 _fulfillerId,
    uint256 _fulfillerPercent
  ) public onlyFulfiller(_fulfillerId) {
    require(
      _fulfillerId <= _fullfillerCount,
      "CanvasFulfillment: Fulfiller does not exist."
    );
    _fulfillers[_fulfillerId].fulfillerPercent = _fulfillerPercent;
    emit FulfillerPercentUpdated(_fulfillerId, _fulfillerPercent);
  }

  function updateFulfillerAddress(
    uint256 _fulfillerId,
    address _newFulfillerAddress
  ) public onlyFulfiller(_fulfillerId) {
    require(
      _fulfillers[_fulfillerId].fulfillerId != 0,
      "CanvasFulfillment: Fulfiller does not exist."
    );
    _fulfillers[_fulfillerId].fulfillerAddress = _newFulfillerAddress;
    emit FulfillerAddressUpdated(_fulfillerId, _newFulfillerAddress);
  }

  function removeFulfiller(uint256 _fulfillerId) public onlyAdmin {
    delete _fulfillers[_fulfillerId];
    _activeFulfillers -= 1;
  }

  function getFulfillerAddress(
    uint256 _fulfillerId
  ) public view returns (address) {
    return _fulfillers[_fulfillerId].fulfillerAddress;
  }

  function getFulfillerCount() public view returns (uint256) {
    return _activeFulfillers;
  }

  function getFulfillerPercent(
    uint256 _fulfillerId
  ) public view returns (uint256) {
    return _fulfillers[_fulfillerId].fulfillerPercent;
  }

  function getAccessControlContract() public view returns (address) {
    return address(_accessControl);
  }
}
