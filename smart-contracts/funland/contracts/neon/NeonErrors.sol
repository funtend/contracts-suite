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

contract NeonErrors {
  error GranteeNotRegistered();
  error InvalidClaim();
  error AlreadyClaimed();
  error AddressNotAdmin();
  error InvalidMilestoneUpdate();
  error InvalidLengths();
  error InvalidAddress();
  error InvalidContract();
  error CurrencyNotWhitelisted();
  error InvalidAmounts();
  error Existing();
  error CantRemoveSelf();
  error InvalidDelete();
}
