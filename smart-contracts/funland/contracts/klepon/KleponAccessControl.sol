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

import "./KleponErrors.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract KleponAccessControl {
  string public symbol;
  string public name;
  address private _kleponEscrow;
  address private _kleponMissionData;
  address private _kleponMetrics;
  address private _kleponNFTCreator;
  address private _coreEnvoker;
  address public kleponOpenAction;

  mapping(address => bool) private _envokers;

  event EnvokerAdded(address indexed envoker);
  event EnvokerRemoved(address indexed envoker);
  event CoreEnvokerChanged(address indexed newEnvoker);

  modifier onlyCoreEnvoker() {
    if (msg.sender != _coreEnvoker) {
      revert KleponErrors.OnlyCoreEnvoker();
    }
    _;
  }

  function initialize(
    address _coreEnvokerAddress,
    address _kleponOpenActionAddress
  ) external {
    if (kleponOpenAction != address(0)) {
      revert KleponErrors.AlreadyInitialized();
    }
    symbol = "KAC";
    name = "KleponAccessControl";
    kleponOpenAction = _kleponOpenActionAddress;
    _envokers[_coreEnvokerAddress] = true;
    _coreEnvoker = _coreEnvokerAddress;
  }

  function setRelatedContract(
    address _kleponEscrowAddress,
    address _kleponMissionDataAddress,
    address _kleponMetricsAddress,
    address _kleponNFTCreatorAddress
  ) external {
    if (msg.sender != kleponOpenAction) {
      revert KleponErrors.InvalidAddress();
    }

    _kleponEscrow = _kleponEscrowAddress;
    _kleponMissionData = _kleponMissionDataAddress;
    _kleponMetrics = _kleponMetricsAddress;
    _kleponNFTCreator = _kleponNFTCreatorAddress;
  }

  function addEnvoker(address _envoker) external onlyCoreEnvoker {
    if (_envoker == msg.sender || _envokers[_envoker]) {
      revert KleponErrors.InvalidAddress();
    }

    _envokers[_envoker] = true;
    emit EnvokerAdded(_envoker);
  }

  function removeEnvoker(address _envoker) external onlyCoreEnvoker {
    if (_envoker == msg.sender || !_envokers[_envoker]) {
      revert KleponErrors.InvalidAddress();
    }
    delete _envokers[_envoker];
    emit EnvokerRemoved(_envoker);
  }

  function changeCoreEnvoker(address _newEnvoker) external onlyCoreEnvoker {
    _envokers[_coreEnvoker] = false;
    _coreEnvoker = _newEnvoker;
    _envokers[_newEnvoker] = true;
    emit CoreEnvokerChanged(_newEnvoker);
  }

  function isEnvoker(address _address) public view returns (bool) {
    return _envokers[_address];
  }

  function isCoreEnvoker() public view returns (address) {
    return _coreEnvoker;
  }

  function getKleponEscrow() public view returns (address) {
    return _kleponEscrow;
  }

  function getKleponMetrics() public view returns (address) {
    return _kleponMetrics;
  }

  function getKleponMissionData() public view returns (address) {
    return _kleponMissionData;
  }

  function getKleponNFTCreator() public view returns (address) {
    return _kleponNFTCreator;
  }
}
