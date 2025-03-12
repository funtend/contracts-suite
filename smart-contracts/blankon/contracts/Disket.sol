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

import "./AccessControl.sol";
import "./BlankonNFT.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Disket {
  uint256 public count;
  AccessControl public accessControl;
  string public name;
  string public symbol;

  mapping(uint256 => string) private mirrorers;
  mapping(uint256 => string) private collectors;
  mapping(uint256 => string) private posters;
  mapping(uint256 => string) private unique;
  mapping(uint256 => string) private amountToCollect;
  mapping(uint256 => string) private amountToCollect72;
  mapping(uint256 => string) private spendHighest72;
  mapping(uint256 => string) private topFollowedAccounts48;
  mapping(uint256 => string) private revenueChange2448;
  mapping(uint256 => string) private graph;

  modifier onlyAdmin() {
    require(
      accessControl.isAdmin(msg.sender),
      "AccessControl: Only admin can perform this action"
    );
    _;
  }

  event AccessControlUpdated(
    address _oldAccessControl,
    address _newAccessControl,
    address admin
  );

  event DailyMappingsAdded(
    string _topMirrorers,
    string _topCollectors,
    string _topPosters,
    string _unique,
    string _highestSpend,
    string _amountToCollect,
    string _amountToCollect72,
    string _topFollowed,
    string _revenueChange,
    string _graph,
    uint256 _count,
    address admin
  );

  constructor(
    address _accessControlAddress,
    string memory _symbol,
    string memory _name
  ) {
    accessControl = AccessControl(_accessControlAddress);
    symbol = _symbol;
    name = _name;
    count = 0;
  }

  function addDailyMappings(
    string memory _topMirrorers,
    string memory _topCollectors,
    string memory _topPosters,
    string memory _unique,
    string memory _highestSpend,
    string memory _amountToCollect,
    string memory _amountToCollect72,
    string memory _topFollowed,
    string memory _revenueChange,
    string memory _graph
  ) external onlyAdmin {
    count++;

    mirrorers[count] = _topMirrorers;
    collectors[count] = _topCollectors;
    posters[count] = _topPosters;
    unique[count] = _unique;
    amountToCollect[count] = _amountToCollect;
    amountToCollect72[count] = _amountToCollect72;
    topFollowedAccounts48[count] = _topFollowed;
    revenueChange2448[count] = _revenueChange;
    spendHighest72[count] = _highestSpend;
    graph[count] = _graph;

    emit DailyMappingsAdded(
      _topMirrorers,
      _topCollectors,
      _topPosters,
      _unique,
      _highestSpend,
      _amountToCollect,
      _amountToCollect72,
      _topFollowed,
      _revenueChange,
      _graph,
      count,
      msg.sender
    );
  }

  function getTopMirrorersByDay(
    uint256 _dayCount
  ) public view returns (string memory) {
    return mirrorers[_dayCount];
  }

  function getTopCollectorsByDay(
    uint256 _dayCount
  ) public view returns (string memory) {
    return collectors[_dayCount];
  }

  function getTopPostersByDay(
    uint256 _dayCount
  ) public view returns (string memory) {
    return posters[_dayCount];
  }

  function getTopFollowedAccountsByDay(
    uint256 _dayCount
  ) public view returns (string memory) {
    return topFollowedAccounts48[_dayCount];
  }

  function getUniqueCollectsByDay(
    uint256 _dayCount
  ) public view returns (string memory) {
    return unique[_dayCount];
  }

  function getAmountToCollectByDay(
    uint256 _dayCount
  ) public view returns (string memory) {
    return amountToCollect[_dayCount];
  }

  function getAmountToCollect72ByDay(
    uint256 _dayCount
  ) public view returns (string memory) {
    return amountToCollect72[_dayCount];
  }

  function getHighestSpendByDay(
    uint256 _dayCount
  ) public view returns (string memory) {
    return spendHighest72[_dayCount];
  }

  function getRevenueChangeByDay(
    uint256 _dayCount
  ) public view returns (string memory) {
    return revenueChange2448[_dayCount];
  }

  function getGraphByDay(
    uint256 _dayCount
  ) public view returns (string memory) {
    return revenueChange2448[_dayCount];
  }

  function updateAccessControl(address _newAccessControl) external onlyAdmin {
    address _oldAccessControl = address(accessControl);
    accessControl = AccessControl(_newAccessControl);
    emit AccessControlUpdated(_oldAccessControl, _newAccessControl, msg.sender);
  }
}
