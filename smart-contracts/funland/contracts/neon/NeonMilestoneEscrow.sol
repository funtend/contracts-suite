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

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./NeonData.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "./NeonAccessControl.sol";
import "./NeonData.sol";
import "./NeonErrors.sol";
import "./NeonMachineCreditSwap.sol";

contract NeonMilestoneEscrow {
  using Strings for uint256;
  NeonAccessControl public neonAccessControl;
  NeonData public neonData;
  NeonMachineCreditSwap public machineCreditSwap;
  string public symbol;
  string public name;
  address public neonOpenAction;

  modifier onlyGrantee(uint256 _grantId) {
    if (neonData.getGranteeSplitAmount(msg.sender, _grantId) == 0) {
      revert NeonErrors.GranteeNotRegistered();
    }
    _;
  }

  modifier onlyOpenAction() {
    if (msg.sender != neonOpenAction) {
      revert NeonErrors.InvalidAddress();
    }
    _;
  }

  modifier onlyAdmin() {
    if (!neonAccessControl.isAdmin(msg.sender)) {
      revert NeonErrors.AddressNotAdmin();
    }
    _;
  }

  constructor(
    address _neonDataAddress,
    address _neonAccessControlAddress,
    address _machineCreditSwapAddress
  ) {
    neonData = NeonData(_neonDataAddress);
    neonAccessControl = NeonAccessControl(_neonAccessControlAddress);
    machineCreditSwap = NeonMachineCreditSwap(_machineCreditSwapAddress);
    symbol = "NME";
    name = "NeonMilestoneEscrow";
  }

  function fundGrant(
    address _currency,
    uint256 _amount,
    uint256 _grantId
  ) external onlyOpenAction {
    IERC20(_currency).transferFrom(neonOpenAction, address(this), _amount);

    uint256 _idleAmount = 0;

    if (
      block.timestamp >
      neonData.getMilestoneSubmitBy(_grantId, 3) + neonData.getPeriodClaim()
    ) {
      _idleAmount = _amount;
    }

    if (_idleAmount == 0) {
      uint256 _totalFunded = neonData.getGrantAmountFundedByCurrency(
        _currency,
        _grantId
      ) + _amount;

      uint256 _goal = 0;
      for (uint8 i = 0; i < 3; i++) {
        _goal += neonData.getMilestoneGoalToCurrency(
          _currency,
          _grantId,
          i + 1
        );
      }

      if (_totalFunded > _goal) {
        _idleAmount += _totalFunded - _goal;
      }
      if (_idleAmount > 0) {
        IERC20(_currency).approve(address(machineCreditSwap), _idleAmount);

        machineCreditSwap.receiveAndSwapCredits(_currency, _idleAmount);
      }
    }
  }

  function initiateMilestoneClaim(
    uint256 _grantId,
    uint8 _milestone
  ) public onlyGrantee(_grantId) {
    if (
      neonData.getMilestoneStatus(_grantId, _milestone) !=
      NeonLibrary.MilestoneStatus.NotClaimed ||
      block.timestamp >
      neonData.getMilestoneSubmitBy(_grantId, _milestone) +
        neonData.getPeriodClaim() ||
      block.timestamp <
      neonData.getMilestoneSubmitBy(_grantId, _milestone) -
        neonData.getPeriodClaim()
    ) {
      revert NeonErrors.InvalidClaim();
    }
    if (neonData.getGranteeClaimedMilestone(msg.sender, _grantId, _milestone)) {
      revert NeonErrors.AlreadyClaimed();
    } else {
      address[] memory _currencies = neonData.getGrantAcceptedCurrencies(
        _grantId
      );
      uint256 _splitAmount = neonData.getGranteeSplitAmount(
        msg.sender,
        _grantId
      );

      for (uint8 i = 0; i < _currencies.length; i++) {
        uint256 _totalFunded = neonData.getGrantAmountFundedByCurrency(
          _currencies[i],
          _grantId
        );
        uint256 _milestoneAmount = neonData.getMilestoneGoalToCurrency(
          _currencies[i],
          _grantId,
          _milestone
        );

        if (_totalFunded >= _milestoneAmount) {
          if (_milestoneAmount > 0) {
            IERC20(_currencies[i]).transfer(
              msg.sender,
              (_milestoneAmount * _splitAmount) / 1e20
            );
          }
        }
      }

      neonData.setGranteeClaimedMilestone(msg.sender, _grantId, _milestone);
    }

    address[] memory _addresses = neonData.getGrantAddresses(_grantId);

    if (!neonData.getAllClaimedMilestone(_grantId, _milestone)) {
      uint256 _hasAllClaimed = 0;

      for (uint256 i; i < _addresses.length; i++) {
        if (
          neonData.getGranteeClaimedMilestone(
            _addresses[i],
            _grantId,
            _milestone
          )
        ) {
          _hasAllClaimed++;
        }
      }

      if (_hasAllClaimed == _addresses.length) {
        neonData.setAllClaimedMilestone(_grantId, _milestone);

        neonData.updateMilestoneStatus(
          msg.sender,
          NeonLibrary.MilestoneStatus.Claimed,
          _grantId,
          _milestone
        );
      }
    }
  }

  function grantRecallCheck(uint256 _grantId) public onlyAdmin {
    address[] memory _allCurrencies = neonData.getGrantAcceptedCurrencies(
      _grantId
    );

    for (uint256 i = 0; i < _allCurrencies.length; i++) {
      uint256 _totalFunded = neonData.getGrantAmountFundedByCurrency(
        _allCurrencies[i],
        _grantId
      );

      uint256 _goal = 0;
      for (uint8 j = 0; j < 3; j++) {
        _goal += neonData.getMilestoneGoalToCurrency(
          _allCurrencies[i],
          _grantId,
          j + 1
        );
      }

      if (
        _totalFunded < _goal &&
        block.timestamp >
        neonData.getMilestoneSubmitBy(_grantId, 1) + neonData.getPeriodClaim()
      ) {
        IERC20(_allCurrencies[i]).approve(
          address(machineCreditSwap),
          _totalFunded
        );

        machineCreditSwap.receiveAndSwapCredits(
          _allCurrencies[i],
          _totalFunded
        );
      }
    }
  }

  function setNeonAccessControlAddress(
    address _newNeonAccessControlAddress
  ) public onlyAdmin {
    neonAccessControl = NeonAccessControl(_newNeonAccessControlAddress);
  }

  function setNeonDataAddress(address _newNeonDataAddress) public onlyAdmin {
    neonData = NeonData(_newNeonDataAddress);
  }

  function setMachineCreditSwapAddress(
    address _newMachineCreditSwapAddress
  ) public onlyAdmin {
    machineCreditSwap = NeonMachineCreditSwap(_newMachineCreditSwapAddress);
  }

  function setNeonOpenActionAddress(
    address _newNeonOpenActionAddress
  ) public onlyAdmin {
    neonOpenAction = (_newNeonOpenActionAddress);
  }
}
