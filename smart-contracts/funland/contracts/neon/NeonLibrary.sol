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

contract NeonLibrary {
  struct TransferTokens {
    uint256 collectionId;
    uint256 chosenIndex;
    uint256 chosenAmount;
    uint256 fulfillerSplit;
    uint256 fulfillerBase;
    address fulfiller;
    address designer;
    address chosenCurrency;
    address buyer;
  }

  struct LevelInfo {
    uint256[] collectionIds;
    uint256[] amounts;
    uint8 level;
  }

  struct CreateGrant {
    LevelInfo[6] levelInfo;
    uint256[][3] goalToCurrency;
    address[] acceptedCurrencies;
    address[] granteeAddresses;
    uint256[] splitAmounts;
    uint256[3] submitBys;
    string uri;
    uint256 pubId;
    uint256 profileId;
  }

  struct Milestone {
    mapping(address => uint256) currencyToGoal;
    mapping(address => bool) hasClaimedMilestone;
    uint256 submitBy;
    MilestoneStatus status;
    bool allClaimed;
  }

  struct Grant {
    LevelInfo[6] levelInfo;
    Milestone[3] milestones;
    mapping(address => bool) currencyAccepted;
    mapping(address => uint256) splitAmounts;
    mapping(address => uint256) amountFundedToCurrency;
    address[] acceptedCurrencies;
    address[] granteeAddresses;
    string uri;
    uint256 grantId;
    uint256 pubId;
    uint256 profileId;
  }

  struct RegisterProps {
    LevelInfo[6] levelInfo;
    uint256[][3] goalToCurrency;
    address[] acceptedCurrencies;
    address[] granteeAddresses;
    uint256[] splitAmounts;
    uint256[3] submitBys;
    string uri;
  }

  enum MilestoneStatus {
    NotClaimed,
    Claimed
  }

  struct Order {
    string encryptedFulfillment;
    address funder;
    address currency;
    uint256 orderId;
    uint256 level;
    uint256 amountFunded;
    uint256 grantId;
  }
}
