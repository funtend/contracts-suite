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

contract KleponErrors {
  error OnlyAdmin();
  error InvalidLength();
  error InvalidAddress();
  error InvalidContract();
  error AlreadyInitialized();
  error OnlyCoreEnvoker();
  error UserNotMaintainer();
  error MissionClosed();
  error MissionDoesntExist();
  error InsufficientBalance();
  error PlayerNotEligible();
  error MaxPlayerCountReached();
  error MilestoneInvalid();
  error CurrencyNotWhitelisted();
  error InvalidRewardAmount();
}
