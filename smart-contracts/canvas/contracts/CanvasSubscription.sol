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
import "./CanvasPKPs.sol";

contract CanvasSubscription {
  CanvasAccessControl private _accessControl;
  CanvasPKPs private _canvasPKPs;
  address private _pkpAddress;
  string public symbol;
  string public name;
  uint256 private _subscriberCountTotal;
  uint256 private _currentSubscribers;

  struct Subscriber {
    uint256 subscriptionId;
    uint256 subscribedTimestamp;
    uint256 unSubscribedTimestamp;
    uint256 resubscribedTimestamp;
    bool isSubscribed;
    string pkpTokenId;
  }

  mapping(string => Subscriber) private _subscribers;

  modifier onlyAdmin() {
    require(
      _accessControl.isAdmin(msg.sender),
      "CanvasAccessControl: Only admin can perform this action"
    );
    _;
  }

  modifier userExists(string memory _tokenId) {
    require(
      _canvasPKPs.userExists(_tokenId),
      "CanvasPKPs: User does not yet have an account."
    );
    _;
  }

  modifier onlyPKPOrAdmin() {
    require(
      _accessControl.isAdmin(msg.sender) || msg.sender == _pkpAddress,
      "CanvasPKPs: Only admin or PKP address can add a user."
    );
    _;
  }

  event AccessControlUpdated(
    address indexed oldAccessControl,
    address indexed newAccessControl,
    address updater
  );
  event CanvasPKPsUpdated(
    address indexed oldCanvasPKPs,
    address indexed newCanvasPKPs,
    address updater
  );
  event PKPAddressUpdated(
    address indexed oldPKPAddress,
    address indexed newPKPAddress,
    address updater
  );
  event SubscriberAdded(
    uint256 indexed subscriberId,
    string tokenId,
    address updater
  );
  event SubscriberRemoved(
    uint256 indexed subscriberId,
    string tokenId,
    address updater
  );
  event SubscriberReactivated(
    uint256 indexed subscriberId,
    string tokenId,
    address updater
  );

  constructor(
    address _accessControlAddress,
    address _canvasPKPsAddress,
    address _pkpAddressAccount,
    string memory _name,
    string memory _symbol
  ) {
    _accessControl = CanvasAccessControl(_accessControlAddress);
    _canvasPKPs = CanvasPKPs(_canvasPKPsAddress);
    symbol = _symbol;
    name = _name;
    _pkpAddress = _pkpAddressAccount;
    _subscriberCountTotal = 0;
    _currentSubscribers = 0;
  }

  function subscribeWithPKP(
    string memory _tokenId
  ) external userExists(_tokenId) onlyPKPOrAdmin {
    _subscriberCountTotal++;
    _currentSubscribers++;
    Subscriber memory newSubscriber = Subscriber({
      subscriptionId: _subscriberCountTotal,
      subscribedTimestamp: block.timestamp,
      unSubscribedTimestamp: 0,
      resubscribedTimestamp: 0,
      pkpTokenId: _tokenId,
      isSubscribed: true
    });
    _subscribers[_tokenId] = newSubscriber;
    emit SubscriberAdded(_subscriberCountTotal, _tokenId, msg.sender);
  }

  function unsubscribeWithPKP(
    string memory _tokenId
  ) external userExists(_tokenId) onlyPKPOrAdmin {
    require(
      _subscribers[_tokenId].isSubscribed,
      "CanvasSubscription: User is not yet subscribed."
    );
    require(
      _currentSubscribers > 0,
      "CanvasSubscription: Underflow prevented."
    );
    _currentSubscribers--;
    _subscribers[_tokenId].isSubscribed = false;
    _subscribers[_tokenId].unSubscribedTimestamp = block.timestamp;
    emit SubscriberRemoved(
      _subscribers[_tokenId].subscriptionId,
      _tokenId,
      msg.sender
    );
  }

  function reactivateWithPKP(
    string memory _tokenId
  ) external userExists(_tokenId) onlyPKPOrAdmin {
    require(
      !_subscribers[_tokenId].isSubscribed,
      "CanvasSubscription: User is not yet unsubscribed."
    );
    require(
      _subscribers[_tokenId].subscriptionId > 0,
      "CanvasSubscription: User does not exist."
    );
    _currentSubscribers++;
    _subscribers[_tokenId].isSubscribed = true;
    _subscribers[_tokenId].resubscribedTimestamp = block.timestamp;
    emit SubscriberReactivated(
      _subscribers[_tokenId].subscriptionId,
      _tokenId,
      msg.sender
    );
  }

  function updateAccessControl(
    address _newAccessControlAddress
  ) external onlyAdmin {
    address oldAddress = address(_accessControl);
    _accessControl = CanvasAccessControl(_newAccessControlAddress);
    emit AccessControlUpdated(oldAddress, _newAccessControlAddress, msg.sender);
  }

  function updateCanvasPKPs(address _newCanvasPKPsAddress) external onlyAdmin {
    address oldAddress = address(_canvasPKPs);
    _canvasPKPs = CanvasPKPs(_newCanvasPKPsAddress);
    emit CanvasPKPsUpdated(oldAddress, _newCanvasPKPsAddress, msg.sender);
  }

  function updatePKPAddress(address _newPKPAddress) external onlyAdmin {
    address oldAddress = _pkpAddress;
    _pkpAddress = _newPKPAddress;
    emit PKPAddressUpdated(oldAddress, _newPKPAddress, msg.sender);
  }

  function getAccessControlContract() public view returns (address) {
    return address(_accessControl);
  }

  function getCanvasPKPsContract() public view returns (address) {
    return address(_canvasPKPs);
  }

  function getPKPAddress() public view returns (address) {
    return _pkpAddress;
  }

  function getIsUserSubscribed(
    string memory _tokenId
  ) public view returns (bool) {
    return _subscribers[_tokenId].isSubscribed;
  }

  function getSubscribedUserSubscriptionId(
    string memory _tokenId
  ) public view returns (uint256) {
    return _subscribers[_tokenId].subscriptionId;
  }

  function getSubscribedUserDate(
    string memory _tokenId
  ) public view returns (uint256) {
    return _subscribers[_tokenId].subscribedTimestamp;
  }

  function getUnsubscribedUserDate(
    string memory _tokenId
  ) public view returns (uint256) {
    return _subscribers[_tokenId].unSubscribedTimestamp;
  }

  function getResubscribedUserDate(
    string memory _tokenId
  ) public view returns (uint256) {
    return _subscribers[_tokenId].resubscribedTimestamp;
  }

  function getSubscriberCountTotal() public view returns (uint256) {
    return _subscriberCountTotal;
  }

  function getSubscriberCountCurrent() public view returns (uint256) {
    return _currentSubscribers;
  }
}
