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

import "./BlankonNFT.sol";
import "./AccessControl.sol";
import "./BlankonPayment.sol";
import "./BlankonDrop.sol";
import "./BlankonEscrow.sol";

contract BlankonCollection {
  BlankonNFT public blankonNFT;
  AccessControl public accessControl;
  BlankonPayment public blankonPayment;
  BlankonDrop public blankonDrop;
  BlankonEscrow public blankonEscrow;
  uint256 public collectionSupply;
  string public symbol;
  string public name;

  struct Collection {
    uint256 collectionId;
    address[] acceptedTokens;
    uint256[] basePrices;
    uint256[] tokenIds;
    uint256 amount;
    address creator;
    string name;
    string uri;
    bool isBurned;
    uint256 timestamp;
    bool fulfillment;
  }

  mapping(uint256 => Collection) private collections;

  event CollectionMinted(
    uint256 indexed collectionId,
    string name,
    string uri,
    uint256 amount,
    address owner
  );

  event CollectionBurned(address indexed burner, uint256 indexed collectionId);

  event CollectionValuesUpdated(
    uint256 indexed collectionId,
    string newName,
    string newURI,
    uint256[] newPrices,
    address[] newAcceptedTokens,
    address updater
  );

  event AccessControlUpdated(
    address indexed oldAccessControl,
    address indexed newAccessControl,
    address updater
  );

  event BlankonNFTUpdated(
    address indexed oldBlankonNFT,
    address indexed newBlankonNFT,
    address updater
  );

  event BlankonPaymentUpdated(
    address indexed oldBlankonPayment,
    address indexed newBlankonPayment,
    address updater
  );

  event BlankonEscrowUpdated(
    address indexed oldBlankonEscrow,
    address indexed newBlankonEscrow,
    address updater
  );

  event BlankonDropUpdated(
    address indexed oldBlankonDrop,
    address indexed newBlankonDrop,
    address updater
  );

  event CollectionFulfillmentUpdated(
    uint256 indexed collectionId,
    address updater
  );

  modifier onlyCreator(uint256 _collectionId) {
    require(
      msg.sender == collections[_collectionId].creator,
      "BlankonCollection: Only the creator can edit this collection"
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
    address _blankonNFTAddress,
    address _accessControlAddress,
    address _blankonPaymentAddress,
    string memory _symbol,
    string memory _name
  ) {
    blankonNFT = BlankonNFT(_blankonNFTAddress);
    accessControl = AccessControl(_accessControlAddress);
    blankonPayment = BlankonPayment(_blankonPaymentAddress);
    collectionSupply = 0;
    symbol = _symbol;
    name = _name;
  }

  function mintCollection(
    string memory _uri,
    uint256 _amount,
    string memory _collectionName,
    address[] memory _acceptedTokens,
    uint256[] memory _basePrices
  ) external {
    require(
      _basePrices.length == _acceptedTokens.length,
      "BlankonCollection: Invalid input"
    );
    require(
      accessControl.isAdmin(msg.sender) || accessControl.isWriter(msg.sender),
      "BlankonCollection: Only admin or writer can perform this action"
    );
    for (uint256 i = 0; i < _acceptedTokens.length; i++) {
      require(
        blankonPayment.checkIfAddressVerified(_acceptedTokens[i]),
        "BlankonCollection: Payment Token is Not Verified"
      );
    }

    collectionSupply++;

    uint256[] memory tokenIds = new uint256[](_amount);

    for (uint256 i = 0; i < _amount; i++) {
      tokenIds[i] = blankonNFT.totalSupplyCount() + i + 1;
    }

    Collection memory newCollection = Collection({
      collectionId: collectionSupply,
      acceptedTokens: _acceptedTokens,
      basePrices: _basePrices,
      tokenIds: tokenIds,
      amount: _amount,
      creator: msg.sender,
      name: _collectionName,
      uri: _uri,
      isBurned: false,
      timestamp: block.timestamp,
      fulfillment: false
    });

    collections[collectionSupply] = newCollection;

    blankonNFT.mintBatch(
      _uri,
      _amount,
      collectionSupply,
      msg.sender,
      _acceptedTokens,
      _basePrices
    );

    emit CollectionMinted(
      collectionSupply,
      _collectionName,
      _uri,
      _amount,
      msg.sender
    );
  }

  function burnCollection(
    uint256 _collectionId
  ) external onlyCreator(_collectionId) {
    require(
      !collections[_collectionId].isBurned,
      "BlankonCollection: This collection has already been burned"
    );
    blankonDrop.removeCollectionFromDrop(_collectionId);
    for (uint256 i = 0; i < collections[_collectionId].tokenIds.length; i++) {
      if (
        address(blankonEscrow) ==
        blankonNFT.ownerOf(collections[_collectionId].tokenIds[i])
      ) {
        blankonEscrow.release(
          collections[_collectionId].tokenIds[i],
          true,
          address(0)
        );
      }
    }

    collections[_collectionId].isBurned = true;
    emit CollectionBurned(msg.sender, _collectionId);
  }

  function updateAccessControl(
    address _newAccessControlAddress
  ) external onlyAdmin {
    address oldAddress = address(accessControl);
    accessControl = AccessControl(_newAccessControlAddress);
    emit AccessControlUpdated(oldAddress, _newAccessControlAddress, msg.sender);
  }

  function updateBlankonNFT(address _newBlankonNFTAddress) external onlyAdmin {
    address oldAddress = address(blankonNFT);
    blankonNFT = BlankonNFT(_newBlankonNFTAddress);
    emit BlankonNFTUpdated(oldAddress, _newBlankonNFTAddress, msg.sender);
  }

  function updateBlankonPayment(
    address _newBlankonPaymentAddress
  ) external onlyAdmin {
    address oldAddress = address(blankonPayment);
    blankonPayment = BlankonPayment(_newBlankonPaymentAddress);
    emit BlankonPaymentUpdated(
      oldAddress,
      _newBlankonPaymentAddress,
      msg.sender
    );
  }

  function setBlankonEscrow(
    address _newBlankonEscrowAddress
  ) external onlyAdmin {
    address oldAddress = address(blankonEscrow);
    blankonEscrow = BlankonEscrow(_newBlankonEscrowAddress);
    emit BlankonEscrowUpdated(oldAddress, _newBlankonEscrowAddress, msg.sender);
  }

  function setBlankonDrop(address _newBlankonDropAddress) external onlyAdmin {
    address oldAddress = address(blankonDrop);
    blankonDrop = BlankonDrop(_newBlankonDropAddress);
    emit BlankonDropUpdated(oldAddress, _newBlankonDropAddress, msg.sender);
  }

  function getCollectionCreator(
    uint256 _collectionId
  ) public view returns (address) {
    return collections[_collectionId].creator;
  }

  function getCollectionURI(
    uint256 _collectionId
  ) public view returns (string memory) {
    return collections[_collectionId].uri;
  }

  function getCollectionAmount(
    uint256 _collectionId
  ) public view returns (uint256) {
    return collections[_collectionId].amount;
  }

  function getCollectionAcceptedTokens(
    uint256 _collectionId
  ) public view returns (address[] memory) {
    return collections[_collectionId].acceptedTokens;
  }

  function getCollectionBasePrices(
    uint256 _collectionId
  ) public view returns (uint256[] memory) {
    return collections[_collectionId].basePrices;
  }

  function getCollectionFulfillment(
    uint256 _collectionId
  ) public view returns (bool) {
    return collections[_collectionId].fulfillment;
  }

  function getCollectionName(
    uint256 _collectionId
  ) public view returns (string memory) {
    return collections[_collectionId].name;
  }

  function getCollectionIsBurned(
    uint256 _collectionId
  ) public view returns (bool) {
    return collections[_collectionId].isBurned;
  }

  function getCollectionTimestamp(
    uint256 _collectionId
  ) public view returns (uint256) {
    return collections[_collectionId].timestamp;
  }

  function getCollectionTokenIds(
    uint256 _collectionId
  ) public view returns (uint256[] memory) {
    return collections[_collectionId].tokenIds;
  }

  function updateCollectionValues(
    uint256 _collectionId,
    string memory _collectionName,
    string memory _newURI,
    uint256[] memory _newPrices,
    address[] memory _newAcceptedTokens
  ) external onlyCreator(_collectionId) {
    uint256[] memory tokenIds = collections[_collectionId].tokenIds;
    require(
      _newAcceptedTokens.length == _newPrices.length,
      "BlankonCollection: Base prices and Accepted Tokens must share the same length"
    );
    for (uint256 i = 0; i < tokenIds.length; i++) {
      require(
        blankonNFT.ownerOf(tokenIds[i]) == address(blankonEscrow),
        "BlankonCollection: The entire collection must be owned by Escrow to update"
      );
    }

    for (uint256 i = 0; i < tokenIds.length; i++) {
      blankonNFT.setTokenURI(tokenIds[i], _newURI);
      blankonNFT.setBasePrices(tokenIds[i], _newPrices);
      blankonNFT.setTokenAcceptedTokens(tokenIds[i], _newAcceptedTokens);
    }
    collections[_collectionId].name = _collectionName;
    collections[_collectionId].uri = _newURI;
    collections[_collectionId].basePrices = _newPrices;
    collections[_collectionId].acceptedTokens = _newAcceptedTokens;

    emit CollectionValuesUpdated(
      _collectionId,
      collections[_collectionId].name,
      collections[_collectionId].uri,
      collections[_collectionId].basePrices,
      collections[_collectionId].acceptedTokens,
      msg.sender
    );
  }

  function setCollectionFulfillment(
    uint256 _collectionId
  ) external onlyCreator(_collectionId) {
    uint256[] memory tokenIds = collections[_collectionId].tokenIds;
    for (uint256 i = 0; i < tokenIds.length; i++) {
      blankonNFT.setTokenFulfilled(tokenIds[i]);
    }
    collections[_collectionId].fulfillment = true;
    emit CollectionFulfillmentUpdated(_collectionId, msg.sender);
  }
}
