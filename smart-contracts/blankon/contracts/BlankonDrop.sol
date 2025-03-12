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

import "./BlankonCollection.sol";
import "./AccessControl.sol";

contract BlankonDrop {
  AccessControl public accessControl;
  BlankonCollection public blankonCollection;
  uint256 public dropSupply;
  string public symbol;
  string public name;

  struct Drop {
    uint256 dropId;
    uint256[] collectionIds;
    string dropURI;
    address creator;
    uint256 timestamp;
  }

  mapping(uint256 => Drop) private drops;
  mapping(uint256 => uint256) private collectionIdToDrop;

  event DropCreated(
    uint256 indexed dropId,
    uint256[] collectionIds,
    address creator
  );

  event CollectionAddedToDrop(uint256 indexed dropId, uint256[] collectionId);

  event CollectionRemovedFromDrop(uint256 indexed dropId, uint256 collectionId);

  event DropURIUpdated(uint256 indexed dropId, string dropURI);

  event AccessControlUpdated(
    address indexed oldAccessControl,
    address indexed newAccessControl,
    address updater
  );

  event BlankonCollectionUpdated(
    address indexed oldBlankonCollection,
    address indexed newBlankonCollection,
    address updater
  );

  event DropDeleted(uint256 indexed dropId, address deleter);

  modifier onlyCreator(uint256 _collectionId) {
    require(
      blankonCollection.getCollectionCreator(_collectionId) == msg.sender,
      "BlankonDrop: Only the owner of a collection can add it to a drop"
    );
    _;
  }

  modifier onlyAdmin() {
    require(
      accessControl.isAdmin(msg.sender),
      "AccessControl: Only admin can perform this action"
    );
    _;
  }

  constructor(
    address _blankonCollectionAddress,
    address _accessControlAddress,
    string memory _symbol,
    string memory _name
  ) {
    blankonCollection = BlankonCollection(_blankonCollectionAddress);
    accessControl = AccessControl(_accessControlAddress);
    dropSupply = 0;
    symbol = _symbol;
    name = _name;
  }

  function createDrop(
    uint256[] memory _collectionIds,
    string memory _dropURI
  ) external {
    for (uint256 i = 0; i < _collectionIds.length; i++) {
      require(
        blankonCollection.getCollectionCreator(_collectionIds[i]) ==
          msg.sender &&
          (accessControl.isWriter(msg.sender) ||
            accessControl.isAdmin(msg.sender)),
        "BlankonDrop: Only the owner of a collection can add it to a drop"
      );
      require(
        _collectionIds[i] != 0 &&
          _collectionIds[i] <= blankonCollection.collectionSupply(),
        "BlankonDrop: Collection does not exist"
      );
      require(
        collectionIdToDrop[_collectionIds[i]] == 0,
        "BlankonDrop: Collection is already part of another existing drop"
      );
    }

    dropSupply++;

    Drop memory newDrop = Drop({
      dropId: dropSupply,
      collectionIds: _collectionIds,
      dropURI: _dropURI,
      creator: msg.sender,
      timestamp: block.timestamp
    });

    for (uint256 i = 0; i < _collectionIds.length; i++) {
      collectionIdToDrop[_collectionIds[i]] = dropSupply;
    }

    drops[dropSupply] = newDrop;

    emit DropCreated(dropSupply, _collectionIds, msg.sender);
  }

  function addCollectionToDrop(
    uint256 _dropId,
    uint256[] memory _collectionIds
  ) external {
    for (uint256 i = 0; i < _collectionIds.length; i++) {
      require(
        blankonCollection.getCollectionCreator(_collectionIds[i]) == msg.sender,
        "BlankonDrop: Only the owner of a collection can add it to a drop"
      );
      require(drops[_dropId].dropId != 0, "BlankonDrop: Drop does not exist");
      require(
        collectionIdToDrop[_collectionIds[i]] == 0,
        "BlankonDrop: Collection is already part of another existing drop"
      );
    }

    for (uint256 i = 0; i < _collectionIds.length; i++) {
      drops[_dropId].collectionIds.push(_collectionIds[i]);
      collectionIdToDrop[_collectionIds[i]] = _dropId;
    }

    emit CollectionAddedToDrop(_dropId, _collectionIds);
  }

  function removeCollectionFromDrop(uint256 _collectionId) external {
    uint256 dropId = collectionIdToDrop[_collectionId];
    require(
      blankonCollection.getCollectionCreator(_collectionId) == msg.sender ||
        address(blankonCollection) == msg.sender,
      "BlankonDrop: Only creator or collection contract can remove collection"
    );

    uint256[] storage collectionIds = drops[dropId].collectionIds;
    uint256 collectionIndex = findIndex(collectionIds, _collectionId);

    collectionIds[collectionIndex] = collectionIds[collectionIds.length - 1];
    collectionIds.pop();

    collectionIdToDrop[_collectionId] = 0;

    emit CollectionRemovedFromDrop(dropId, _collectionId);
  }

  function findIndex(
    uint256[] storage array,
    uint256 value
  ) internal view returns (uint256) {
    for (uint256 i = 0; i < array.length; i++) {
      if (array[i] == value) {
        return i;
      }
    }
    revert("BlankonDrop: Value not found in array.");
  }

  function deleteDrop(uint256 _dropId) external {
    require(drops[_dropId].dropId != 0, "BlankonDrop: Drop does not exist");
    for (uint256 i = 0; i < drops[_dropId].collectionIds.length; i++) {
      require(
        blankonCollection.getCollectionCreator(
          drops[_dropId].collectionIds[i]
        ) ==
          msg.sender &&
          (accessControl.isWriter(msg.sender) ||
            accessControl.isAdmin(msg.sender)),
        "BlankonDrop: Only the owner of a collection can add it to a drop"
      );
    }

    uint256[] memory collectionIds = drops[_dropId].collectionIds;
    for (uint256 i = 0; i < collectionIds.length; i++) {
      collectionIdToDrop[collectionIds[i]] = 0;
    }
    delete drops[_dropId];

    emit DropDeleted(_dropId, msg.sender);
  }

  function updateAccessControl(
    address _newAccessControlAddress
  ) external onlyAdmin {
    address oldAddress = address(accessControl);
    accessControl = AccessControl(_newAccessControlAddress);
    emit AccessControlUpdated(oldAddress, _newAccessControlAddress, msg.sender);
  }

  function updateBlankonCollection(
    address _newBlankonCollectionAddress
  ) external onlyAdmin {
    address oldAddress = address(blankonCollection);
    blankonCollection = BlankonCollection(_newBlankonCollectionAddress);
    emit BlankonCollectionUpdated(
      oldAddress,
      _newBlankonCollectionAddress,
      msg.sender
    );
  }

  function getCollectionIdToDrop(
    uint256 _collectionId
  ) public view returns (uint256) {
    return collectionIdToDrop[_collectionId];
  }

  function getCollectionsInDrop(
    uint256 _dropId
  ) public view returns (uint256[] memory) {
    return drops[_dropId].collectionIds;
  }

  function getDropURI(uint256 _dropId) public view returns (string memory) {
    return drops[_dropId].dropURI;
  }

  function getDropCreator(uint256 _dropId) public view returns (address) {
    return drops[_dropId].creator;
  }

  function getDropTimestamp(uint256 _dropId) public view returns (uint256) {
    return drops[_dropId].timestamp;
  }

  function setDropURI(uint256 _dropId, string memory _dropURI) external {
    for (uint256 i = 0; i < drops[_dropId].collectionIds.length; i++) {
      require(
        blankonCollection.getCollectionCreator(
          drops[_dropId].collectionIds[i]
        ) ==
          msg.sender &&
          (accessControl.isWriter(msg.sender) ||
            accessControl.isAdmin(msg.sender)),
        "BlankonDrop: Only the owner of a drop can edit a drop"
      );
    }
    drops[_dropId].dropURI = _dropURI;
    emit DropURIUpdated(_dropId, _dropURI);
  }
}
