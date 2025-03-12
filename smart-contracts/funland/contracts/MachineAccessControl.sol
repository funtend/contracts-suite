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

contract MachineAccessControl {
  string public symbol;
  string public name;

  mapping(address => bool) private _admins;
  mapping(address => bool) private _machines;

  event AdminAdded(address indexed admin);
  event AdminRemoved(address indexed admin);
  event MachineAdded(address indexed machine);
  event MachineRemoved(address indexed machine);

  error AddressInvalid();
  error Existing();
  error CantRemoveSelf();

  modifier onlyAdmin() {
    if (!_admins[msg.sender]) {
      revert AddressInvalid();
    }
    _;
  }

  constructor() {
    _admins[msg.sender] = true;
    symbol = "MAC";
    name = "MachineAccessControl";
  }

  function addAdmin(address _admin) external onlyAdmin {
    if (_admins[_admin] || _admin == msg.sender) {
      revert Existing();
    }
    _admins[_admin] = true;
    emit AdminAdded(_admin);
  }

  function removeAdmin(address _admin) external onlyAdmin {
    if (_admin == msg.sender) {
      revert CantRemoveSelf();
    }
    if (!_admins[_admin]) {
      revert AddressInvalid();
    }
    _admins[_admin] = false;
    emit AdminRemoved(_admin);
  }

  function addMachine(address _machine) external onlyAdmin {
    if (_machines[_machine]) {
      revert Existing();
    }
    _machines[_machine] = true;
    emit MachineAdded(_machine);
  }

  function removeMachine(address _machine) external onlyAdmin {
    if (!_machines[_machine]) {
      revert AddressInvalid();
    }
    _machines[_machine] = false;
    emit MachineRemoved(_machine);
  }

  function isAdmin(address _address) public view returns (bool) {
    return _admins[_address];
  }

  function isMachine(address _address) public view returns (bool) {
    return _machines[_address];
  }
}
