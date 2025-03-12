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

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "./CanvasFGOEscrow.sol";
import "./CanvasAccessControl.sol";
import "./CanvasParentFGO.sol";

contract CanvasChildFGO is ERC1155 {
  string public name;
  string public symbol;
  uint256 private _tokenIdPointer;
  CanvasAccessControl private _accessControl;
  CanvasFGOEscrow private _fgoEscrow;
  CanvasParentFGO private _parentFGO;

  struct ChildTemplate {
    uint256 _tokenId;
    string[] _tokenURIs;
    string _posterURI;
    uint256 _amount;
    uint256 _parentId;
    uint256 _fulfillerId;
    uint256 _price;
    address _creator;
  }

  mapping(uint256 => ChildTemplate) private _tokenIdToTemplate;

  event ChildTemplateCreated(
    uint256 indexed tokenId,
    string[] tokenURI,
    string posterURI
  );
  event ChildTemplateUpdated(
    uint256 indexed tokenId,
    string[] newTokenURI,
    string newPosterURI
  );
  event ParentIdAdded(uint256 indexed tokenId, uint256 parentId);
  event ChildBurned(uint256 childTokenId);

  modifier onlyAdmin() {
    require(
      _accessControl.isAdmin(msg.sender),
      "CanvasAccessControl: Only admin can perform this action"
    );
    _;
  }

  modifier onlyEscrow() {
    require(
      msg.sender == address(_fgoEscrow),
      "CanvasAccessControl: Only the Escrow contract can perform this action"
    );
    _;
  }

  modifier onlyParent() {
    require(
      msg.sender == address(_parentFGO),
      "CanvasAccessControl: Only the Parent contract can perform this action"
    );
    _;
  }

  constructor(
    string memory _name,
    string memory _symbol,
    address _accessControlContract
  ) ERC1155("") {
    name = _name;
    symbol = _symbol;
    _tokenIdPointer = 0;
    _accessControl = CanvasAccessControl(_accessControlContract);
  }

  function mint(
    uint256 _amount,
    uint256 _fulfillerId,
    uint256 _price,
    uint256 _parentId,
    string[] memory _tokenURIs,
    string memory _posterURI,
    address _creator
  ) public onlyParent {
    ++_tokenIdPointer;
    _tokenIdToTemplate[_tokenIdPointer] = ChildTemplate({
      _tokenId: _tokenIdPointer,
      _tokenURIs: _tokenURIs,
      _posterURI: _posterURI,
      _amount: _amount,
      _parentId: _parentId,
      _fulfillerId: _fulfillerId,
      _price: _price,
      _creator: _creator
    });

    _mint(address(_fgoEscrow), _tokenIdPointer, _amount, "");
    _fgoEscrow.depositChild(_tokenIdPointer);
    emit ChildTemplateCreated(_tokenIdPointer, _tokenURIs, _posterURI);
  }

  function updateChildTemplate(
    uint256 _childId,
    uint256 _newAmount,
    uint256 _newFulfillerId,
    uint256 _newPrice,
    string[] memory _newTokenURIs,
    string memory _newPosterURI,
    address _newCreator
  ) external onlyParent {
    _tokenIdToTemplate[_childId]._amount = _newAmount;
    _tokenIdToTemplate[_childId]._fulfillerId = _newFulfillerId;
    _tokenIdToTemplate[_childId]._price = _newPrice;
    _tokenIdToTemplate[_childId]._tokenURIs = _newTokenURIs;
    _tokenIdToTemplate[_childId]._posterURI = _newPosterURI;
    _tokenIdToTemplate[_childId]._creator = _newCreator;

    emit ChildTemplateUpdated(_childId, _newTokenURIs, _newPosterURI);
  }

  function burn(uint256 _id, uint256 _amount) public onlyEscrow {
    delete _tokenIdToTemplate[_id];

    _burn(msg.sender, _id, _amount);

    emit ChildBurned(_id);
  }

  function tokenURI(uint256 _id) public view returns (string[] memory) {
    return _tokenIdToTemplate[_id]._tokenURIs;
  }

  function tokenExists(
    uint256 _childTokenId
  ) public view returns (bool success) {
    if (_childTokenId > _tokenIdPointer || _childTokenId == 0) {
      return false;
    } else {
      return true;
    }
  }

  function setParentId(
    uint256 _tokenId,
    uint256 _parentId
  ) external onlyEscrow {
    _tokenIdToTemplate[_tokenId]._parentId = _parentId;

    emit ParentIdAdded(_tokenId, _parentId);
  }

  function setFGOEscrow(address _newEscrowAddress) public onlyAdmin {
    _fgoEscrow = CanvasFGOEscrow(_newEscrowAddress);
  }

  function setParentFGO(address _newParentAddress) public onlyAdmin {
    _parentFGO = CanvasParentFGO(_newParentAddress);
  }

  function updateAccessControl(address _newAccessControl) public onlyAdmin {
    _accessControl = CanvasAccessControl(_newAccessControl);
  }

  function getFGOParent() public view returns (address) {
    return address(_parentFGO);
  }

  function getFGOEscrow() public view returns (address) {
    return address(_fgoEscrow);
  }

  function getAccessControl() public view returns (address) {
    return address(_accessControl);
  }

  function getChildTokenURIs(
    uint256 _tokenId
  ) public view returns (string[] memory) {
    return _tokenIdToTemplate[_tokenId]._tokenURIs;
  }

  function getChildPosterURI(
    uint256 _tokenId
  ) public view returns (string memory) {
    return _tokenIdToTemplate[_tokenId]._posterURI;
  }

  function getChildTokenAmount(uint256 _tokenId) public view returns (uint256) {
    return _tokenIdToTemplate[_tokenId]._amount;
  }

  function getChildFulfillerId(uint256 _tokenId) public view returns (uint256) {
    return _tokenIdToTemplate[_tokenId]._fulfillerId;
  }

  function getChildCreator(uint256 _tokenId) public view returns (address) {
    return _tokenIdToTemplate[_tokenId]._creator;
  }

  function getChildPrice(uint256 _tokenId) public view returns (uint256) {
    return _tokenIdToTemplate[_tokenId]._price;
  }

  function getChildTokenParentId(
    uint256 _tokenId
  ) public view returns (uint256) {
    return _tokenIdToTemplate[_tokenId]._parentId;
  }

  function getTokenPointer() public view returns (uint256) {
    return _tokenIdPointer;
  }
}
