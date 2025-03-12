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

import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "./CanvasChildFGO.sol";
import "./CanvasParentFGO.sol";
import "./CanvasAccessControl.sol";

contract CanvasFGOEscrow is ERC721Holder, ERC1155Holder {
  CanvasAccessControl private _accessControl;
  CanvasParentFGO private _parentFGO;
  CanvasChildFGO private _childFGO;
  string public symbol;
  string public name;

  mapping(uint256 => bool) private _childDeposited;
  mapping(uint256 => bool) private _parentDeposited;

  event AccessControlUpdated(
    address indexed oldAccessControl,
    address indexed newAccessControl,
    address updater
  );
  event ParentReleased(uint256 parentTokenId);
  event ChildrenReleased(uint256[] childTokenIds);

  constructor(
    address _parentFGOContract,
    address _childFGOContract,
    address _accessControlContract,
    string memory _symbol,
    string memory _name
  ) {
    _accessControl = CanvasAccessControl(_accessControlContract);
    _parentFGO = CanvasParentFGO(_parentFGOContract);
    _childFGO = CanvasChildFGO(_childFGOContract);
    symbol = _symbol;
    name = _name;
  }

  modifier onlyAdmin() {
    require(
      _accessControl.isAdmin(msg.sender),
      "CanvasAccessControl: Only admin can perform this action"
    );
    _;
  }

  modifier onlyDepositer() {
    require(
      msg.sender == address(_parentFGO) || msg.sender == address(_childFGO),
      "CanvasFGOEscrow: Only a verified depositer contract can call this function"
    );
    _;
  }

  function depositParent(uint256 _parentTokenId) external onlyDepositer {
    _parentDeposited[_parentTokenId] = true;
  }

  function depositChild(uint256 _childTokenId) external onlyDepositer {
    _childDeposited[_childTokenId] = true;
  }

  function releaseParent(uint256 _parentTokenId) external onlyAdmin {
    require(
      _parentDeposited[_parentTokenId],
      "CanvasFGOEscrow: Token must be in escrow"
    );
    _parentDeposited[_parentTokenId] = false;
    uint256[] memory _childTokens = _parentFGO.getParentChildTokens(
      _parentTokenId
    );

    for (uint256 i = 0; i < _childTokens.length; i++) {
      _childFGO.setParentId(_childTokens[i], 0);
    }
    _parentFGO.burn(_parentTokenId);

    emit ParentReleased(_parentTokenId);
  }

  function releaseChildren(uint256[] memory _childTokenIds) external onlyAdmin {
    for (uint256 i = 0; i < _childTokenIds.length; i++) {
      require(
        _childDeposited[_childTokenIds[i]],
        "CanvasFGOEscrow: Token must be in escrow"
      );
    }

    for (uint256 i = 0; i < _childTokenIds.length; i++) {
      _childDeposited[_childTokenIds[i]] = false;

      uint256 parentId = _childFGO.getChildTokenParentId(_childTokenIds[i]);

      uint256[] memory childTokens = _parentFGO.getParentChildTokens(parentId);

      uint256[] memory newChildTokens = new uint256[](childTokens.length);
      uint256 index = 0;

      for (uint256 j = 0; j < childTokens.length; j++) {
        if (childTokens[j] != _childTokenIds[i]) {
          newChildTokens[index] = childTokens[j];
          index++;
        }
      }

      uint256[] memory finalChildTokens = new uint256[](index);
      for (uint256 k = 0; k < index; k++) {
        finalChildTokens[k] = newChildTokens[k];
      }

      _parentFGO.setChildTokenIds(parentId, finalChildTokens);

      _childFGO.burn(_childTokenIds[i], 1);
    }

    emit ChildrenReleased(_childTokenIds);
  }

  function updateAccessControl(
    address _newAccessControlAddress
  ) external onlyAdmin {
    address oldAddress = address(_accessControl);
    _accessControl = CanvasAccessControl(_newAccessControlAddress);
    emit AccessControlUpdated(oldAddress, _newAccessControlAddress, msg.sender);
  }

  function getAccessControlAddress() public view returns (address) {
    return address(_accessControl);
  }

  function getChildFGOAddress() public view returns (address) {
    return address(_childFGO);
  }

  function getParentFGOAddress() public view returns (address) {
    return address(_parentFGO);
  }

  function getChildDeposited(uint256 _childId) public view returns (bool) {
    return _childDeposited[_childId];
  }

  function getParentDeposited(uint256 _parentId) public view returns (bool) {
    return _parentDeposited[_parentId];
  }
}
