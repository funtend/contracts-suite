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

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "./CanvasChildFGO.sol";
import "./CanvasAccessControl.sol";
import "./CanvasFGOEscrow.sol";
import "./CanvasFulfillment.sol";

contract CanvasParentFGO is ERC721 {
  uint256 private _totalSupply;
  CanvasChildFGO private _childFGO;
  CanvasAccessControl private _accessControl;
  CanvasFGOEscrow private _fgoEscrow;
  CanvasFulfillment private _fulfillment;

  struct ParentTemplate {
    uint256 _tokenId;
    uint256 _fulfillerId;
    uint256[] _childTokenIds;
    uint256[] _prices;
    string _tokenURI;
    string _pixelType;
    address _creator;
  }

  mapping(uint256 => ParentTemplate) private _tokenIdToTemplate;

  event FGOTemplateCreated(
    uint256 indexed parentTokenId,
    string parentURI,
    uint256[] childTokenIds
  );
  event FGOTemplateUpdated(
    uint256 indexed parentTokenId,
    string newParentURI,
    uint256[] childTokenIds
  );

  event ParentBurned(uint256 parentTokenId);

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

  constructor(
    address _childContract,
    address _fulfillmentContract,
    address _accessControlContract
  ) ERC721("CanvasParentFGO", "CVPFGO") {
    _totalSupply = 0;
    _childFGO = CanvasChildFGO(_childContract);
    _fulfillment = CanvasFulfillment(_fulfillmentContract);
    _accessControl = CanvasAccessControl(_accessControlContract);
  }

  function mintFGO(
    string memory _parentURI,
    string memory _pixelType,
    string[][] memory _childURIs,
    string[] memory _childPosterURI,
    uint256[] memory _prices,
    uint256[] memory _childPrices,
    uint256 _fulfillerId
  ) public onlyAdmin {
    require(
      _childPrices.length == _childURIs.length,
      "CanvasParentFGO: Prices and URIs Tokens must be the same length."
    );
    require(
      _fulfillment.getFulfillerAddress(_fulfillerId) != address(0),
      "CanvasFulfillment: Fulfiller Id is not valid."
    );

    ++_totalSupply;

    uint256 tokenPointer = _childFGO.getTokenPointer();
    uint256[] memory _childTokenIds = new uint256[](_childURIs.length);

    for (uint256 i = 0; i < _childURIs.length; i++) {
      _childTokenIds[i] = tokenPointer + i + 1;
    }

    _tokenIdToTemplate[_totalSupply] = ParentTemplate({
      _tokenId: _totalSupply,
      _fulfillerId: _fulfillerId,
      _tokenURI: _parentURI,
      _childTokenIds: _childTokenIds,
      _prices: _prices,
      _pixelType: _pixelType,
      _creator: msg.sender
    });

    for (uint256 i = 0; i < _childURIs.length; i++) {
      _childFGO.mint(
        1,
        _fulfillerId,
        _childPrices[i],
        _totalSupply,
        _childURIs[i],
        _childPosterURI[i],
        msg.sender
      );
    }

    _safeMint(address(_fgoEscrow), _totalSupply);
    _fgoEscrow.depositParent(_totalSupply);

    emit FGOTemplateCreated(_totalSupply, _parentURI, _childTokenIds);
  }

  function updateFGO(
    uint256 _parentId,
    uint256[] memory _newPrices,
    uint256[] memory _newChildPrices,
    uint256 _newFulfillerId,
    string memory _newParentURI,
    string memory _newPixelType,
    string[][] memory _newChildURIs,
    string[] memory _newChildPosterURI,
    address _newCreator
  ) external onlyAdmin {
    require(
      _newChildPrices.length == _newChildURIs.length,
      "CanvasParentFGO: Prices and URIs Tokens must be the same length."
    );
    require(
      _fulfillment.getFulfillerAddress(_newFulfillerId) != address(0),
      "CanvasFulfillment: Fulfiller Id is not valid."
    );
    _tokenIdToTemplate[_parentId]._prices = _newPrices;
    _tokenIdToTemplate[_parentId]._pixelType = _newPixelType;
    _tokenIdToTemplate[_parentId]._fulfillerId = _newFulfillerId;
    _tokenIdToTemplate[_parentId]._tokenURI = _newParentURI;
    _tokenIdToTemplate[_parentId]._creator = _newCreator;

    for (
      uint256 i = 0;
      i < _tokenIdToTemplate[_parentId]._childTokenIds.length;
      i++
    ) {
      _childFGO.updateChildTemplate(
        _tokenIdToTemplate[_parentId]._childTokenIds[i],
        1,
        _newFulfillerId,
        _newChildPrices[i],
        _newChildURIs[i],
        _newChildPosterURI[i],
        _newCreator
      );
    }

    emit FGOTemplateUpdated(
      _parentId,
      _newParentURI,
      _tokenIdToTemplate[_parentId]._childTokenIds
    );
  }

  function burn(uint256 _tokenId) public onlyEscrow {
    delete _tokenIdToTemplate[_tokenId];
    _burn(_tokenId);
    emit ParentBurned(_tokenId);
  }

  function setChildTokenIds(
    uint256 _parentTokenId,
    uint256[] memory _childTokenIds
  ) public onlyEscrow {
    _tokenIdToTemplate[_parentTokenId]._childTokenIds = _childTokenIds;
  }

  function tokenURI(
    uint256 _tokenId
  ) public view virtual override returns (string memory) {
    return _tokenIdToTemplate[_tokenId]._tokenURI;
  }

  function getParentChildTokens(
    uint256 _tokenId
  ) public view virtual returns (uint256[] memory) {
    return _tokenIdToTemplate[_tokenId]._childTokenIds;
  }

  function getParentCreator(
    uint256 _tokenId
  ) public view virtual returns (address) {
    return _tokenIdToTemplate[_tokenId]._creator;
  }

  function getParentFulfillerId(
    uint256 _tokenId
  ) public view virtual returns (uint256) {
    return _tokenIdToTemplate[_tokenId]._fulfillerId;
  }

  function getParentPrice(
    uint256 _tokenId
  ) public view virtual returns (uint256[] memory) {
    return _tokenIdToTemplate[_tokenId]._prices;
  }

  function getParentPixelType(
    uint256 _tokenId
  ) public view virtual returns (string memory) {
    return _tokenIdToTemplate[_tokenId]._pixelType;
  }

  function getTotalSupply() public view returns (uint256) {
    return _totalSupply;
  }

  function setFGOEscrow(address _newEscrowAddress) public onlyAdmin {
    _fgoEscrow = CanvasFGOEscrow(_newEscrowAddress);
  }

  function updateChildFGO(address _newChildAddress) public onlyAdmin {
    _childFGO = CanvasChildFGO(_newChildAddress);
  }

  function updateAccessControl(address _newAccessControl) public onlyAdmin {
    _accessControl = CanvasAccessControl(_newAccessControl);
  }

  function updateFulfillment(address _newFulfillment) public onlyAdmin {
    _fulfillment = CanvasFulfillment(_newFulfillment);
  }

  function getFGOChild() public view returns (address) {
    return address(_childFGO);
  }

  function getFGOEscrow() public view returns (address) {
    return address(_fgoEscrow);
  }

  function getAccessControl() public view returns (address) {
    return address(_accessControl);
  }

  function getFulfiller() public view returns (address) {
    return address(_fulfillment);
  }
}
