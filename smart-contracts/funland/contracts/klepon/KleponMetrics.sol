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

import "./KleponAccessControl.sol";
import "./KleponLibrary.sol";
import "./KleponMissionData.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract KleponMetrics {
  string public symbol;
  string public name;
  KleponAccessControl public kleponAccess;
  KleponMissionData public kleponMissionData;

  event AddPlayerMetrics(
    uint256 videoPubId,
    uint256 videoProfileId,
    uint256 playerProfileId
  );
  event PlayerEligibleToClaimMilestone(
    uint256 missionId,
    uint256 milestone,
    uint256 playerProfileId
  );

  modifier onlyPlayer() {
    uint256 _playerProfileId = kleponMissionData.getAddressToProfileId(
      msg.sender
    );
    if (kleponMissionData.getPlayerActiveSince(_playerProfileId) == 0) {
      revert KleponErrors.PlayerNotEligible();
    }
    _;
  }

  modifier onlyMissionEnvoker(uint256 _missionId) {
    if (kleponMissionData.getMissionEnvoker(_missionId) != msg.sender) {
      revert KleponErrors.InvalidAddress();
    }
    _;
  }

  modifier onlyMaintainer() {
    if (!kleponAccess.isEnvoker(msg.sender)) {
      revert KleponErrors.InvalidAddress();
    }
    _;
  }

  function initialize(
    address _kleponAccessAddress,
    address _kleponMissionDataAddress
  ) external {
    if (address(kleponAccess) != address(0)) {
      revert KleponErrors.AlreadyInitialized();
    }
    name = "KleponMetrics";
    symbol = "KME";
    kleponAccess = KleponAccessControl(_kleponAccessAddress);
    kleponMissionData = KleponMissionData(_kleponMissionDataAddress);
  }

  function addPlayerMetrics(
    KleponLibrary.PlayerVideoMetrics memory _metrics
  ) public onlyPlayer {
    uint256 _playerProfileId = kleponMissionData.getAddressToProfileId(
      msg.sender
    );
    kleponMissionData.updatePlayerMetrics(_metrics, _playerProfileId);

    emit AddPlayerMetrics(_metrics.pubId, _metrics.profileId, _playerProfileId);
  }

  function playerEligibleToClaimMilestone(
    uint256 _missionId,
    uint256 _milestone,
    uint256 _playerProfileId,
    bool _eligibility
  ) public onlyMissionEnvoker(_missionId) {
    kleponMissionData.playerEligibleToClaim(
      _playerProfileId,
      _missionId,
      _milestone,
      _eligibility
    );

    emit PlayerEligibleToClaimMilestone(
      _missionId,
      _milestone,
      _playerProfileId
    );
  }

  function setKleponMissionData(
    address _newMissionDataContract
  ) external onlyMaintainer {
    kleponMissionData = KleponMissionData(_newMissionDataContract);
  }

  function setKleponAccess(address _newAccessContract) external onlyMaintainer {
    kleponAccess = KleponAccessControl(_newAccessContract);
  }
}
