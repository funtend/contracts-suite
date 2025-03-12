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

import "./KleponLibrary.sol";
import "./KleponErrors.sol";
import "./KleponEscrow.sol";
import "./KleponMetrics.sol";
import "./KleponAccessControl.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract KleponMissionData {
  KleponAccessControl public kleponAccess;
  KleponMetrics public kleponMetrics;
  KleponEscrow public kleponEscrow;
  string public name;
  string public symbol;
  address public kleponOpenAction;
  uint256 private _missionCount;
  uint256 private _playerCount;

  mapping(uint256 => KleponLibrary.Player) private _allPlayers;
  mapping(uint256 => KleponLibrary.Mission) private _allMissions;
  mapping(string => uint256[]) private _idsToMissions;
  mapping(string => KleponLibrary.VideoPost) private _idsToVideos;
  mapping(uint256 => mapping(uint256 => string)) private _postToPlayback;
  mapping(address => uint256) private _addressToProfile;
  mapping(uint256 => mapping(uint256 => uint256)) _missionIdFromLensData;

  event MissionInstantiated(uint256 missionId, uint256 milestoneCount);
  event PlayerJoinedMission(uint256 missionId, uint256 playerProfileId);
  event PlayerMetricsUpdated(
    uint256 playerProfileId,
    uint256 videoPubId,
    uint256 videoProfileId
  );
  event MissionDeleted(uint256 missionId);
  event MissionStatusUpdated(uint256 missionId, KleponLibrary.Status status);
  event MilestoneCompleted(
    uint256 missionId,
    uint256 playerProfileId,
    uint256 milestone
  );
  event MissionCompleted(uint256 missionId, uint256 playerProfileId);
  event PlayerEligibleToClaimMilestone(
    uint256 playerProfileId,
    uint256 missionId,
    uint256 milestone,
    bool eligibility
  );

  modifier onlyKleponOpenAction() {
    if (kleponOpenAction != msg.sender) {
      revert KleponErrors.InvalidContract();
    }
    _;
  }
  modifier onlyKleponEscrow() {
    if (address(kleponEscrow) != msg.sender) {
      revert KleponErrors.InvalidContract();
    }
    _;
  }
  modifier onlyKleponMetrics() {
    if (address(kleponMetrics) != msg.sender) {
      revert KleponErrors.InvalidContract();
    }
    _;
  }
  modifier onlyMaintainer() {
    if (!kleponAccess.isEnvoker(msg.sender)) {
      revert KleponErrors.InvalidAddress();
    }
    _;
  }
  modifier onlyMaintainerOrOpenAction() {
    if (!kleponAccess.isEnvoker(msg.sender) && msg.sender != kleponOpenAction) {
      revert KleponErrors.InvalidAddress();
    }
    _;
  }

  function initialize(
    address _kleponAccessAddress,
    address _kleponOpenActionAddress
  ) external {
    if (address(kleponAccess) != address(0)) {
      revert KleponErrors.AlreadyInitialized();
    }
    name = "KleponMissionData";
    symbol = "KMD";
    _missionCount = 0;
    _playerCount = 0;
    kleponAccess = KleponAccessControl(_kleponAccessAddress);
    kleponOpenAction = _kleponOpenActionAddress;
  }

  function configureNewMission(
    KleponLibrary.NewMissionParams memory _params
  ) external onlyKleponOpenAction {
    _missionCount++;
    KleponLibrary.Mission storage newMission = _allMissions[_missionCount];
    newMission.missionId = _missionCount;
    newMission.pubId = _params.pubId;
    newMission.profileId = _params.profileId;
    newMission.envoker = _params.envokerAddress;
    newMission.maxPlayerCount = _params.maxPlayerCount;
    newMission.status = KleponLibrary.Status.Open;
    newMission.gated = _params.gateLogic;
    newMission.milestoneCount = _params.milestones.length;
    newMission.uri = _params.uri;

    _setMilestones(_params.milestones, newMission, _missionCount);

    _missionIdFromLensData[_params.profileId][_params.pubId] = _missionCount;

    emit MissionInstantiated(_missionCount, _params.milestones.length);
  }

  function joinMission(
    address _playerAddress,
    uint256 _missionId,
    uint256 _playerProfileId
  ) external onlyKleponOpenAction {
    if (_allPlayers[_playerProfileId].activeSince == 0) {
      _playerCount++;
      _allPlayers[_playerProfileId].playerAddress = _playerAddress;
      _allPlayers[_playerProfileId].activeSince = block.timestamp;
      _addressToProfile[_playerAddress] = _playerProfileId;
    }

    _allPlayers[_playerProfileId].missionsJoined.push(_missionId);
    _allPlayers[_playerProfileId].joinedMission[_missionId] = true;

    _allMissions[_missionId].players.push(_playerProfileId);

    emit PlayerJoinedMission(_missionId, _playerProfileId);
  }

  function playerEligibleToClaim(
    uint256 _playerProfileId,
    uint256 _missionId,
    uint256 _milestone,
    bool _eligible
  ) external onlyKleponMetrics {
    _allPlayers[_playerProfileId].eligibleToClaimMilestone[_missionId][
      _milestone - 1
    ] = _eligible;

    emit PlayerEligibleToClaimMilestone(
      _playerProfileId,
      _missionId,
      _milestone,
      _eligible
    );
  }

  function completeMilestone(
    uint256 _missionId,
    uint256 _playerProfileId
  ) external onlyKleponOpenAction {
    uint256 _milestone = _allPlayers[_playerProfileId]
      .milestonesCompletedPerMission[_missionId] + 1;

    _allPlayers[_playerProfileId].milestonesCompletedPerMission[
      _missionId
    ] = _milestone;

    emit MilestoneCompleted(_missionId, _playerProfileId, _milestone);

    if (_milestone == _allMissions[_missionId].milestoneCount) {
      _allPlayers[_playerProfileId].missionsCompleted.push(_missionId);
      emit MissionCompleted(_missionId, _playerProfileId);
    }
  }

  function setKleponMetricsContract(
    address _newMetricsContract
  ) external onlyMaintainerOrOpenAction {
    kleponMetrics = KleponMetrics(_newMetricsContract);
  }

  function setKleponOpenActionContract(
    address _newOpenActionContract
  ) external onlyMaintainer {
    kleponOpenAction = _newOpenActionContract;
  }

  function setKleponAccessContract(
    address _newAccessContract
  ) external onlyMaintainer {
    kleponAccess = KleponAccessControl(_newAccessContract);
  }

  function setKleponEscrowContract(
    address _newEscrowContract
  ) external onlyMaintainerOrOpenAction {
    kleponEscrow = KleponEscrow(_newEscrowContract);
  }

  function updateMissionStatus(uint256 _missionId) external onlyKleponEscrow {
    _allMissions[_missionId].status = KleponLibrary.Status.Closed;

    emit MissionStatusUpdated(_missionId, _allMissions[_missionId].status);
  }

  function updatePlayerMetrics(
    KleponLibrary.PlayerVideoMetrics memory _metrics,
    uint256 _playerProfileId
  ) external onlyKleponMetrics {
    if (_allPlayers[_playerProfileId].activeSince == 0) {
      revert KleponErrors.PlayerNotEligible();
    }

    if (
      _allPlayers[_playerProfileId]
      .videoMetrics[_metrics.profileId][_metrics.pubId].profileId ==
      0 &&
      _allPlayers[_playerProfileId]
      .videoMetrics[_metrics.profileId][_metrics.pubId].pubId ==
      0
    ) {
      string memory _playback = _postToPlayback[_metrics.profileId][
        _metrics.pubId
      ];

      _allPlayers[_playerProfileId].videoBytes.push(
        _idsToVideos[_playback].videoBytes
      );
    }

    _allPlayers[_playerProfileId].videoMetrics[_metrics.profileId][
      _metrics.pubId
    ] = _metrics;

    emit PlayerMetricsUpdated(
      _playerProfileId,
      _metrics.pubId,
      _metrics.profileId
    );
  }

  function _setMilestones(
    KleponLibrary.MilestoneParameter[] memory _milestones,
    KleponLibrary.Mission storage _newMission,
    uint256 _missionId
  ) private {
    for (uint256 i = 0; i < _milestones.length; i++) {
      KleponLibrary.Milestone storage _newMilestone = _newMission
        .milestones
        .push();
      _newMilestone.milestone = i + 1;
      _newMilestone.gated = _milestones[i].gated;
      _newMilestone.videoLength = _milestones[i].videos.length;
      _newMilestone.rewardsLength = _milestones[i].rewards.length;
      _newMilestone.uri = _milestones[i].uri;

      _setRewards(_newMilestone, _milestones[i]);
      _setVideos(_newMilestone, _milestones[i], _missionId);
    }
  }

  function _setRewards(
    KleponLibrary.Milestone storage _newMilestone,
    KleponLibrary.MilestoneParameter memory _paramsMilestone
  ) private {
    for (uint j = 0; j < _paramsMilestone.rewards.length; j++) {
      KleponLibrary.Reward memory rewardMemory = _paramsMilestone.rewards[j];
      KleponLibrary.Reward storage rewardStorage = _newMilestone.rewards.push();
      rewardStorage.rewardType = rewardMemory.rewardType;
      rewardStorage.uri = rewardMemory.uri;
      rewardStorage.tokenAddress = rewardMemory.tokenAddress;
      rewardStorage.amount = rewardMemory.amount;
    }
  }

  function _setVideos(
    KleponLibrary.Milestone storage _newMilestone,
    KleponLibrary.MilestoneParameter memory _paramsMilestone,
    uint256 _missionId
  ) private {
    string[] memory _videoBytes = new string[](_paramsMilestone.videos.length);

    for (uint j = 0; j < _paramsMilestone.videos.length; j++) {
      KleponLibrary.Video memory video = _paramsMilestone.videos[j];
      _newMilestone.videos[video.profileId][video.pubId] = video;
      _idsToMissions[video.playerId].push(_missionId);
      _idsToVideos[video.playerId] = KleponLibrary.VideoPost({
        pubId: video.pubId,
        profileId: video.profileId,
        videoBytes: video.videoBytes
      });
      _postToPlayback[video.profileId][video.pubId] = video.playerId;
      _videoBytes[j] = video.videoBytes;
    }

    _newMilestone.videoBytes = _videoBytes;
  }

  function deleteMission(uint256 _missionId) external onlyKleponEscrow {
    delete _allMissions[_missionId];

    emit MissionDeleted(_missionId);
  }

  function getTotalMissionCount() public view returns (uint256) {
    return _missionCount;
  }

  function getTotalPlayerCount() public view returns (uint256) {
    return _playerCount;
  }

  function getPlayerMissionsCompleted(
    uint256 _playerProfileId
  ) public view returns (uint256[] memory) {
    return _allPlayers[_playerProfileId].missionsCompleted;
  }

  function getPlayerVideoAVD(
    uint256 _playerProfileId,
    uint256 _videoPubId,
    uint256 _videoProfileId
  ) public view returns (uint256) {
    return
      _allPlayers[_playerProfileId]
      .videoMetrics[_videoProfileId][_videoPubId].avd;
  }

  function getPlayerVideoSecondaryCommentOnComment(
    uint256 _playerProfileId,
    uint256 _videoPubId,
    uint256 _videoProfileId
  ) public view returns (uint256) {
    return
      _allPlayers[_playerProfileId]
      .videoMetrics[_videoProfileId][_videoPubId].secondaryCommentOnComment;
  }

  function getPlayerVideoSecondaryReactOnComment(
    uint256 _playerProfileId,
    uint256 _videoPubId,
    uint256 _videoProfileId
  ) public view returns (uint256) {
    return
      _allPlayers[_playerProfileId]
      .videoMetrics[_videoProfileId][_videoPubId].secondaryReactOnComment;
  }

  function getPlayerVideoSecondaryCollectOnComment(
    uint256 _playerProfileId,
    uint256 _videoPubId,
    uint256 _videoProfileId
  ) public view returns (uint256) {
    return
      _allPlayers[_playerProfileId]
      .videoMetrics[_videoProfileId][_videoPubId].secondaryCollectOnComment;
  }

  function getPlayerVideoSecondaryMirrorOnComment(
    uint256 _playerProfileId,
    uint256 _videoPubId,
    uint256 _videoProfileId
  ) public view returns (uint256) {
    return
      _allPlayers[_playerProfileId]
      .videoMetrics[_videoProfileId][_videoPubId].secondaryMirrorOnComment;
  }

  function getPlayerVideoSecondaryQuoteOnComment(
    uint256 _playerProfileId,
    uint256 _videoPubId,
    uint256 _videoProfileId
  ) public view returns (uint256) {
    return
      _allPlayers[_playerProfileId]
      .videoMetrics[_videoProfileId][_videoPubId].secondaryQuoteOnComment;
  }

  function getPlayerVideoSecondaryCollectOnQuote(
    uint256 _playerProfileId,
    uint256 _videoPubId,
    uint256 _videoProfileId
  ) public view returns (uint256) {
    return
      _allPlayers[_playerProfileId]
      .videoMetrics[_videoProfileId][_videoPubId].secondaryCollectOnQuote;
  }

  function getPlayerVideoSecondaryReactOnQuote(
    uint256 _playerProfileId,
    uint256 _videoPubId,
    uint256 _videoProfileId
  ) public view returns (uint256) {
    return
      _allPlayers[_playerProfileId]
      .videoMetrics[_videoProfileId][_videoPubId].secondaryReactOnQuote;
  }

  function getPlayerVideoSecondaryMirrorOnQuote(
    uint256 _playerProfileId,
    uint256 _videoPubId,
    uint256 _videoProfileId
  ) public view returns (uint256) {
    return
      _allPlayers[_playerProfileId]
      .videoMetrics[_videoProfileId][_videoPubId].secondaryMirrorOnQuote;
  }

  function getPlayerVideoSecondaryCommentOnQuote(
    uint256 _playerProfileId,
    uint256 _videoPubId,
    uint256 _videoProfileId
  ) public view returns (uint256) {
    return
      _allPlayers[_playerProfileId]
      .videoMetrics[_videoProfileId][_videoPubId].secondaryCommentOnQuote;
  }

  function getPlayerVideoSecondaryQuoteOnQuote(
    uint256 _playerProfileId,
    uint256 _videoPubId,
    uint256 _videoProfileId
  ) public view returns (uint256) {
    return
      _allPlayers[_playerProfileId]
      .videoMetrics[_videoProfileId][_videoPubId].secondaryQuoteOnQuote;
  }

  function getPlayerVideoMostReplayedArea(
    uint256 _playerProfileId,
    uint256 _videoPubId,
    uint256 _videoProfileId
  ) public view returns (string memory) {
    return
      _allPlayers[_playerProfileId]
      .videoMetrics[_videoProfileId][_videoPubId].mostReplayedArea;
  }

  function getPlayerVideoDuration(
    uint256 _playerProfileId,
    uint256 _videoPubId,
    uint256 _videoProfileId
  ) public view returns (uint256) {
    return
      _allPlayers[_playerProfileId]
      .videoMetrics[_videoProfileId][_videoPubId].duration;
  }

  function getPlayerVideoBytes(
    uint256 _playerProfileId
  ) public view returns (string[] memory) {
    return _allPlayers[_playerProfileId].videoBytes;
  }

  function getPlayerVideoBookmark(
    uint256 _playerProfileId,
    uint256 _videoPubId,
    uint256 _videoProfileId
  ) public view returns (bool) {
    return
      _allPlayers[_playerProfileId]
      .videoMetrics[_videoProfileId][_videoPubId].hasBookmarked;
  }

  function getPlayerVideoComment(
    uint256 _playerProfileId,
    uint256 _videoPubId,
    uint256 _videoProfileId
  ) public view returns (bool) {
    return
      _allPlayers[_playerProfileId]
      .videoMetrics[_videoProfileId][_videoPubId].hasCommented;
  }

  function getPlayerVideoQuote(
    uint256 _playerProfileId,
    uint256 _videoPubId,
    uint256 _videoProfileId
  ) public view returns (bool) {
    return
      _allPlayers[_playerProfileId]
      .videoMetrics[_videoProfileId][_videoPubId].hasQuoted;
  }

  function getPlayerVideoMirror(
    uint256 _playerProfileId,
    uint256 _videoPubId,
    uint256 _videoProfileId
  ) public view returns (bool) {
    return
      _allPlayers[_playerProfileId]
      .videoMetrics[_videoProfileId][_videoPubId].hasMirrored;
  }

  function getPlayerVideoReact(
    uint256 _playerProfileId,
    uint256 _videoPubId,
    uint256 _videoProfileId
  ) public view returns (bool) {
    return
      _allPlayers[_playerProfileId]
      .videoMetrics[_videoProfileId][_videoPubId].hasReacted;
  }

  function getPlayerVideoPlayCount(
    uint256 _playerProfileId,
    uint256 _videoPubId,
    uint256 _videoProfileId
  ) public view returns (uint256) {
    return
      _allPlayers[_playerProfileId]
      .videoMetrics[_videoProfileId][_videoPubId].playCount;
  }

  function getPlayerMilestonesCompletedPerMission(
    uint256 _playerProfileId,
    uint256 _missionId
  ) public view returns (uint256) {
    return
      _allPlayers[_playerProfileId].milestonesCompletedPerMission[_missionId];
  }

  function getPlayerEligibleToClaimMilestone(
    uint256 _playerProfileId,
    uint256 _missionId,
    uint256 _milestone
  ) public view returns (bool) {
    return
      _allPlayers[_playerProfileId].eligibleToClaimMilestone[_missionId][
        _milestone - 1
      ];
  }

  function getPlayerActiveSince(
    uint256 _playerProfileId
  ) public view returns (uint256) {
    return _allPlayers[_playerProfileId].activeSince;
  }

  function getPlayerAddress(
    uint256 _playerProfileId
  ) public view returns (address) {
    return _allPlayers[_playerProfileId].playerAddress;
  }

  function getPlayerMissionsJoined(
    uint256 _playerProfileId
  ) public view returns (uint256[] memory) {
    return _allPlayers[_playerProfileId].missionsJoined;
  }

  function getPlayerHasJoinedMission(
    uint256 _playerProfileId,
    uint256 _missionId
  ) public view returns (bool) {
    return _allPlayers[_playerProfileId].joinedMission[_missionId];
  }

  function getMissionEnvoker(uint256 _missionId) public view returns (address) {
    return _allMissions[_missionId].envoker;
  }

  function getMissionPlayers(
    uint256 _missionId
  ) public view returns (uint256[] memory) {
    return _allMissions[_missionId].players;
  }

  function getMissionMaxPlayerCount(
    uint256 _missionId
  ) public view returns (uint256) {
    return _allMissions[_missionId].maxPlayerCount;
  }

  function getMissionStatus(
    uint256 _missionId
  ) public view returns (KleponLibrary.Status) {
    return _allMissions[_missionId].status;
  }

  function getMilestoneCount(uint256 _missionId) public view returns (uint256) {
    return _allMissions[_missionId].milestoneCount;
  }

  function getMissionPubId(uint256 _missionId) public view returns (uint256) {
    return _allMissions[_missionId].pubId;
  }

  function getMissionProfileId(
    uint256 _missionId
  ) public view returns (uint256) {
    return _allMissions[_missionId].profileId;
  }

  function getMissionURI(
    uint256 _missionId
  ) public view returns (string memory) {
    return _allMissions[_missionId].uri;
  }

  function getMissionGatedERC721Addresses(
    uint256 _missionId
  ) public view returns (address[] memory) {
    return _allMissions[_missionId].gated.erc721Addresses;
  }

  function getMissionGatedERC721TokenIds(
    uint256 _missionId
  ) public view returns (uint256[][] memory) {
    return _allMissions[_missionId].gated.erc721TokenIds;
  }

  function getMissionGatedERC721TokenURIs(
    uint256 _missionId
  ) public view returns (string[][] memory) {
    return _allMissions[_missionId].gated.erc721TokenURIs;
  }

  function getMissionGatedOneOf(uint256 _missionId) public view returns (bool) {
    return _allMissions[_missionId].gated.oneOf;
  }

  function getMissionGatedERC20Addresses(
    uint256 _missionId
  ) public view returns (address[] memory) {
    return _allMissions[_missionId].gated.erc20Addresses;
  }

  function getMissionGatedERC20Thresholds(
    uint256 _missionId
  ) public view returns (uint256[] memory) {
    return _allMissions[_missionId].gated.erc20Thresholds;
  }

  function getMilestoneURI(
    uint256 _missionId,
    uint256 _milestone
  ) public view returns (string memory) {
    return _allMissions[_missionId].milestones[_milestone - 1].uri;
  }

  function getMilestoneGatedERC721Addresses(
    uint256 _missionId,
    uint256 _milestone
  ) public view returns (address[] memory) {
    return
      _allMissions[_missionId].milestones[_milestone - 1].gated.erc721Addresses;
  }

  function getMilestoneGatedERC721TokenIds(
    uint256 _missionId,
    uint256 _milestone
  ) public view returns (uint256[][] memory) {
    return
      _allMissions[_missionId].milestones[_milestone - 1].gated.erc721TokenIds;
  }

  function getMilestoneGatedERC721TokenURIs(
    uint256 _missionId,
    uint256 _milestone
  ) public view returns (string[][] memory) {
    return
      _allMissions[_missionId].milestones[_milestone - 1].gated.erc721TokenURIs;
  }

  function getMilestoneVideoLength(
    uint256 _missionId,
    uint256 _milestone
  ) public view returns (uint256) {
    return _allMissions[_missionId].milestones[_milestone - 1].videoLength;
  }

  function getMilestoneRewardsLength(
    uint256 _missionId,
    uint256 _milestone
  ) public view returns (uint256) {
    return _allMissions[_missionId].milestones[_milestone - 1].rewardsLength;
  }

  function getMilestoneVideos(
    uint256 _missionId,
    uint256 _milestone
  ) public view returns (string[] memory) {
    return _allMissions[_missionId].milestones[_milestone - 1].videoBytes;
  }

  function getMilestoneVideoMinPlayCount(
    uint256 _missionId,
    uint256 _milestone,
    uint256 _videoProfileId,
    uint256 _videoPubId
  ) public view returns (uint256) {
    return
      _allMissions[_missionId]
      .milestones[_milestone - 1]
      .videos[_videoProfileId][_videoPubId].minPlayCount;
  }

  function getMilestoneVideoMinDuration(
    uint256 _missionId,
    uint256 _milestone,
    uint256 _videoProfileId,
    uint256 _videoPubId
  ) public view returns (uint256) {
    return
      _allMissions[_missionId]
      .milestones[_milestone - 1]
      .videos[_videoProfileId][_videoPubId].minDuration;
  }

  function getMilestoneVideoMinSecondaryQuoteOnQuote(
    uint256 _missionId,
    uint256 _milestone,
    uint256 _videoProfileId,
    uint256 _videoPubId
  ) public view returns (uint256) {
    return
      _allMissions[_missionId]
      .milestones[_milestone - 1]
      .videos[_videoProfileId][_videoPubId].minSecondaryQuoteOnQuote;
  }

  function getMilestoneVideoMinSecondaryCollectOnQuote(
    uint256 _missionId,
    uint256 _milestone,
    uint256 _videoProfileId,
    uint256 _videoPubId
  ) public view returns (uint256) {
    return
      _allMissions[_missionId]
      .milestones[_milestone - 1]
      .videos[_videoProfileId][_videoPubId].minSecondaryCollectOnQuote;
  }

  function getMilestoneVideoMinSecondaryCommentOnQuote(
    uint256 _missionId,
    uint256 _milestone,
    uint256 _videoProfileId,
    uint256 _videoPubId
  ) public view returns (uint256) {
    return
      _allMissions[_missionId]
      .milestones[_milestone - 1]
      .videos[_videoProfileId][_videoPubId].minSecondaryCommentOnQuote;
  }

  function getMilestoneVideoMinSecondaryReactOnQuote(
    uint256 _missionId,
    uint256 _milestone,
    uint256 _videoProfileId,
    uint256 _videoPubId
  ) public view returns (uint256) {
    return
      _allMissions[_missionId]
      .milestones[_milestone - 1]
      .videos[_videoProfileId][_videoPubId].minSecondaryReactOnQuote;
  }

  function getMilestoneVideoMinSecondaryMirrorOnQuote(
    uint256 _missionId,
    uint256 _milestone,
    uint256 _videoProfileId,
    uint256 _videoPubId
  ) public view returns (uint256) {
    return
      _allMissions[_missionId]
      .milestones[_milestone - 1]
      .videos[_videoProfileId][_videoPubId].minSecondaryMirrorOnQuote;
  }

  function getMilestoneVideoMinSecondaryCommentOnComment(
    uint256 _missionId,
    uint256 _milestone,
    uint256 _videoProfileId,
    uint256 _videoPubId
  ) public view returns (uint256) {
    return
      _allMissions[_missionId]
      .milestones[_milestone - 1]
      .videos[_videoProfileId][_videoPubId].minSecondaryCommentOnComment;
  }

  function getMilestoneVideoMinSecondaryMirrorOnComment(
    uint256 _missionId,
    uint256 _milestone,
    uint256 _videoProfileId,
    uint256 _videoPubId
  ) public view returns (uint256) {
    return
      _allMissions[_missionId]
      .milestones[_milestone - 1]
      .videos[_videoProfileId][_videoPubId].minSecondaryMirrorOnComment;
  }

  function getMilestoneVideoMinSecondaryQuoteOnComment(
    uint256 _missionId,
    uint256 _milestone,
    uint256 _videoProfileId,
    uint256 _videoPubId
  ) public view returns (uint256) {
    return
      _allMissions[_missionId]
      .milestones[_milestone - 1]
      .videos[_videoProfileId][_videoPubId].minSecondaryQuoteOnComment;
  }

  function getMilestoneVideoMinSecondaryReactOnComment(
    uint256 _missionId,
    uint256 _milestone,
    uint256 _videoProfileId,
    uint256 _videoPubId
  ) public view returns (uint256) {
    return
      _allMissions[_missionId]
      .milestones[_milestone - 1]
      .videos[_videoProfileId][_videoPubId].minSecondaryReactOnComment;
  }

  function getMilestoneVideoMinSecondaryCollectOnComment(
    uint256 _missionId,
    uint256 _milestone,
    uint256 _videoProfileId,
    uint256 _videoPubId
  ) public view returns (uint256) {
    return
      _allMissions[_missionId]
      .milestones[_milestone - 1]
      .videos[_videoProfileId][_videoPubId].minSecondaryCollectOnComment;
  }

  function getMilestoneVideoQuote(
    uint256 _missionId,
    uint256 _milestone,
    uint256 _videoProfileId,
    uint256 _videoPubId
  ) public view returns (bool) {
    return
      _allMissions[_missionId]
      .milestones[_milestone - 1]
      .videos[_videoProfileId][_videoPubId].quote;
  }

  function getMilestoneVideoMirror(
    uint256 _missionId,
    uint256 _milestone,
    uint256 _videoProfileId,
    uint256 _videoPubId
  ) public view returns (bool) {
    return
      _allMissions[_missionId]
      .milestones[_milestone - 1]
      .videos[_videoProfileId][_videoPubId].mirror;
  }

  function getMilestoneVideoBookmark(
    uint256 _missionId,
    uint256 _milestone,
    uint256 _videoProfileId,
    uint256 _videoPubId
  ) public view returns (bool) {
    return
      _allMissions[_missionId]
      .milestones[_milestone - 1]
      .videos[_videoProfileId][_videoPubId].bookmark;
  }

  function getMilestoneVideoReact(
    uint256 _missionId,
    uint256 _milestone,
    uint256 _videoProfileId,
    uint256 _videoPubId
  ) public view returns (bool) {
    return
      _allMissions[_missionId]
      .milestones[_milestone - 1]
      .videos[_videoProfileId][_videoPubId].react;
  }

  function getMilestoneVideoComment(
    uint256 _missionId,
    uint256 _milestone,
    uint256 _videoProfileId,
    uint256 _videoPubId
  ) public view returns (bool) {
    return
      _allMissions[_missionId]
      .milestones[_milestone - 1]
      .videos[_videoProfileId][_videoPubId].comment;
  }

  function getMilestoneVideoMinAVD(
    uint256 _missionId,
    uint256 _milestone,
    uint256 _videoProfileId,
    uint256 _videoPubId
  ) public view returns (uint256) {
    return
      _allMissions[_missionId]
      .milestones[_milestone - 1]
      .videos[_videoProfileId][_videoPubId].minAVD;
  }

  function getMilestoneVideoFactoryIds(
    uint256 _missionId,
    uint256 _milestone,
    uint256 _videoProfileId,
    uint256 _videoPubId
  ) public view returns (uint256[] memory) {
    return
      _allMissions[_missionId]
      .milestones[_milestone - 1]
      .videos[_videoProfileId][_videoPubId].factoryIds;
  }

  function getMilestoneGatedOneOf(
    uint256 _missionId,
    uint256 _milestone
  ) public view returns (bool) {
    return _allMissions[_missionId].milestones[_milestone - 1].gated.oneOf;
  }

  function getMilestoneGatedERC20Addresses(
    uint256 _missionId,
    uint256 _milestone
  ) public view returns (address[] memory) {
    return
      _allMissions[_missionId].milestones[_milestone - 1].gated.erc20Addresses;
  }

  function getMilestoneGatedERC20Thresholds(
    uint256 _missionId,
    uint256 _milestone
  ) public view returns (uint256[] memory) {
    return
      _allMissions[_missionId].milestones[_milestone - 1].gated.erc20Thresholds;
  }

  function getMilestoneRewardType(
    uint256 _missionId,
    uint256 _rewardIndex,
    uint256 _milestone
  ) public view returns (KleponLibrary.RewardType) {
    return
      _allMissions[_missionId]
        .milestones[_milestone - 1]
        .rewards[_rewardIndex]
        .rewardType;
  }

  function getMilestoneRewardTokenAddress(
    uint256 _missionId,
    uint256 _rewardIndex,
    uint256 _milestone
  ) public view returns (address) {
    return
      _allMissions[_missionId]
        .milestones[_milestone - 1]
        .rewards[_rewardIndex]
        .tokenAddress;
  }

  function getMilestoneRewardTokenAmount(
    uint256 _missionId,
    uint256 _rewardIndex,
    uint256 _milestone
  ) public view returns (uint256) {
    return
      _allMissions[_missionId]
        .milestones[_milestone - 1]
        .rewards[_rewardIndex]
        .amount;
  }

  function getMilestoneRewardURI(
    uint256 _missionId,
    uint256 _rewardIndex,
    uint256 _milestone
  ) public view returns (string memory) {
    return
      _allMissions[_missionId]
        .milestones[_milestone - 1]
        .rewards[_rewardIndex]
        .uri;
  }

  function getMissionIdsToVideoPlaybackId(
    string memory _playbackId
  ) public view returns (uint256[] memory) {
    return _idsToMissions[_playbackId];
  }

  function getVideoPubIdFromPlaybackId(
    string memory _playbackId
  ) public view returns (uint256) {
    return _idsToVideos[_playbackId].pubId;
  }

  function getVideoProfileIdFromPlaybackId(
    string memory _playbackId
  ) public view returns (uint256) {
    return _idsToVideos[_playbackId].profileId;
  }

  function getVideoBytesFromPlaybackId(
    string memory _playbackId
  ) public view returns (string memory) {
    return _idsToVideos[_playbackId].videoBytes;
  }

  function getVideoPlaybackId(
    uint256 _pubId,
    uint256 _profileId
  ) public view returns (string memory) {
    return _postToPlayback[_profileId][_pubId];
  }

  function getAddressToProfileId(
    address _playerAddress
  ) public view returns (uint256) {
    return _addressToProfile[_playerAddress];
  }

  function getMissionIdFromLensData(
    uint256 _profileId,
    uint256 _pubId
  ) public view returns (uint256) {
    return _missionIdFromLensData[_profileId][_pubId];
  }

  function getLensDataFromMissionId(
    uint256 _missionId
  ) public view returns (uint256, uint256) {
    return (_allMissions[_missionId].profileId, _allMissions[_missionId].pubId);
  }
}
