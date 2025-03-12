// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.9;

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

contract AccessControl {
  string public symbol;
  string public name;

  mapping(address => bool) private admins;
  mapping(address => bool) private writers;

  event AdminAdded(address indexed admin);
  event AdminRemoved(address indexed admin);
  event WriterAdded(address indexed writer);
  event WriterRemoved(address indexed writer);

  modifier onlyAdmin() {
    require(admins[msg.sender], "Only admins can perform this action");
    _;
  }

  modifier onlyWrite() {
    require(
      writers[msg.sender],
      "Only authorized writers can perform this action"
    );
    _;
  }

  constructor(string memory _name, string memory _symbol) {
    symbol = _symbol;
    name = _name;
    admins[msg.sender] = true;
  }

  function addAdmin(address _admin) external onlyAdmin {
    require(
      !admins[_admin] && _admin != msg.sender,
      "Cannot add existing admin or yourself"
    );
    admins[_admin] = true;
    emit AdminAdded(_admin);
  }

  function removeAdmin(address _admin) external onlyAdmin {
    require(_admin != msg.sender, "Cannot remove yourself as admin");
    admins[_admin] = false;
    emit AdminRemoved(_admin);
  }

  function addWriter(address _writer) external onlyAdmin {
    writers[_writer] = true;
    emit WriterAdded(_writer);
  }

  function removeWriter(address _writer) external onlyAdmin {
    writers[_writer] = false;
    emit WriterRemoved(_writer);
  }

  function isAdmin(address _admin) public view returns (bool) {
    return admins[_admin];
  }

  function isWriter(address _writer) public view returns (bool) {
    return writers[_writer];
  }
}
