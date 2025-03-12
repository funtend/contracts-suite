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

contract CanvasPreludePoints {
  CanvasAccessControl private _accessControl;
  address private _pkpAddress;
  string public symbol;
  string public name;
  uint256 private _totalMissions;
  uint256 private _totalMissionParticipants;

  modifier onlyAdmin() {
    require(
      _accessControl.isAdmin(msg.sender),
      "CanvasAccessControl: Only admin can perform this action"
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
  modifier participantExists(address _participantAddress) {
    require(
      _missionParticipants[_participantAddress].participantId > 0,
      "CanvasMissionPrelude: Participant must exist."
    );
    _;
  }

  struct Participant {
    address participantAddress;
    uint256[] missionsCompletedIds;
    uint256 participantId;
    uint256 pointScore;
    uint256 missionsCompleted;
    uint256 missionStartTime;
    bool withPKP;
  }

  mapping(address => Participant) private _missionParticipants;
  mapping(uint256 => uint256) private _pointsPerMission;

  event AccessControlUpdated(
    address indexed oldAccessControl,
    address indexed newAccessControl,
    address updater
  );
  event NewMissionSignUp(
    uint256 indexed participantId,
    address participantAddress
  );
  event PKPAddressUpdated(
    address indexed oldPKPAddress,
    address indexed newPKPAddress,
    address updater
  );
  event ParticipantMissionReference(
    address participantAddress,
    uint256 missionsCompleted,
    uint256 totalPoints
  );
  event TotalMissionsSet(uint256 missionNumber);
  event PointsPerMissionSet(uint256[] missionNumbers, uint256[] pointScores);

  constructor(
    address _accessControlAddress,
    string memory _name,
    string memory _symbol,
    address _pkpAddressAccount
  ) {
    _accessControl = CanvasAccessControl(_accessControlAddress);
    symbol = _symbol;
    name = _name;
    _pkpAddress = _pkpAddressAccount;
    _totalMissions = 0;
    _totalMissionParticipants = 0;
  }

  function signUpForMission(
    address _participantAddress,
    uint256[] memory _missionsCompletedIds,
    uint256 _initialPointScore,
    uint256 _initialMissionsCompleted,
    bool _withPKP
  ) external onlyPKPOrAdmin {
    require(
      _missionsCompletedIds.length == _initialMissionsCompleted,
      "CanvasPreludePoints: Mission Ids length and initial Missions completed must match."
    );
    _totalMissionParticipants++;
    Participant memory newParticipant = Participant({
      participantAddress: _participantAddress,
      participantId: _totalMissionParticipants,
      pointScore: _initialPointScore,
      missionsCompleted: _initialMissionsCompleted,
      missionsCompletedIds: _missionsCompletedIds,
      missionStartTime: block.timestamp,
      withPKP: _withPKP
    });
    _missionParticipants[_participantAddress] = newParticipant;

    emit NewMissionSignUp(_totalMissionParticipants, _participantAddress);
  }

  function updateParticipantMissionReference(
    address _participantAddress,
    uint256[] memory _missionsCompletedIds,
    uint256 _missionsCompletedCount
  ) external onlyPKPOrAdmin participantExists(_participantAddress) {
    uint256 _totalPoints = 0;
    for (uint256 i = 0; i < _missionsCompletedIds.length; i++) {
      _totalPoints += _pointsPerMission[_missionsCompletedIds[i]];
    }

    _missionParticipants[_participantAddress]
      .missionsCompleted += _missionsCompletedCount;
    _missionParticipants[_participantAddress].pointScore += _totalPoints;
    for (uint256 i = 0; i < _missionsCompletedIds.length; i++) {
      _missionParticipants[_participantAddress].missionsCompletedIds.push(
        _missionsCompletedIds[i]
      );
    }

    emit ParticipantMissionReference(
      _participantAddress,
      _missionsCompletedCount,
      _totalPoints
    );
  }

  function lowerParticipantMissionReference(
    address _participantAddress,
    uint256[] memory _missionsCompletedIds,
    uint256 _missionsCompleted
  ) external onlyPKPOrAdmin participantExists(_participantAddress) {
    uint256 _totalPoints = 0;
    for (uint256 i = 0; i < _missionsCompletedIds.length; i++) {
      _totalPoints += _pointsPerMission[_missionsCompletedIds[i]];
    }

    _missionParticipants[_participantAddress]
      .missionsCompleted = _missionsCompleted;
    _missionParticipants[_participantAddress].pointScore = _totalPoints;
    _missionParticipants[_participantAddress]
      .missionsCompletedIds = _missionsCompletedIds;

    emit ParticipantMissionReference(
      _participantAddress,
      _missionsCompleted,
      _totalPoints
    );
  }

  function updatePKPAddress(address _newPKPAddress) external onlyAdmin {
    address oldAddress = _pkpAddress;
    _pkpAddress = _newPKPAddress;
    emit PKPAddressUpdated(oldAddress, _newPKPAddress, msg.sender);
  }

  function updateAccessControl(
    address _newAccessControlAddress
  ) external onlyAdmin {
    address oldAddress = address(_accessControl);
    _accessControl = CanvasAccessControl(_newAccessControlAddress);
    emit AccessControlUpdated(oldAddress, _newAccessControlAddress, msg.sender);
  }

  function setTotalMissions(uint256 _missionNumber) external onlyAdmin {
    _totalMissions = _missionNumber;
    emit TotalMissionsSet(_missionNumber);
  }

  function setPointsPerMission(
    uint256[] memory _missionNumbers,
    uint256[] memory _pointScores
  ) external onlyAdmin {
    for (uint256 i = 0; i < _missionNumbers.length; i++) {
      _pointsPerMission[_missionNumbers[i]] = _pointScores[i];
    }

    emit PointsPerMissionSet(_missionNumbers, _pointScores);
  }

  function getMissionStartTime(
    address _participantAddress
  ) public view returns (uint256) {
    return _missionParticipants[_participantAddress].missionStartTime;
  }

  function getPointsPerMission(
    uint256 _missionIndex
  ) public view returns (uint256) {
    return _pointsPerMission[_missionIndex];
  }

  function getMissionsCompleted(
    address _participantAddress
  ) public view returns (uint256) {
    return _missionParticipants[_participantAddress].missionsCompleted;
  }

  function getMissionWithPKP(
    address _participantAddress
  ) public view returns (bool) {
    return _missionParticipants[_participantAddress].withPKP;
  }

  function getMissionsPointScore(
    address _participantAddress
  ) public view returns (uint256) {
    return _missionParticipants[_participantAddress].pointScore;
  }

  function getMissionsParticipantId(
    address _participantAddress
  ) public view returns (uint256) {
    return _missionParticipants[_participantAddress].participantId;
  }

  function participantMissionExists(
    address _participantAddress
  ) public view returns (bool) {
    return _missionParticipants[_participantAddress].participantId > 0;
  }

  function getParticipantMissionsCompletedIds(
    address _participantAddress
  ) public view returns (uint256[] memory) {
    return _missionParticipants[_participantAddress].missionsCompletedIds;
  }

  function getTotalMissions() public view returns (uint256) {
    return _totalMissions;
  }

  function getTotalMissionParticipants() public view returns (uint256) {
    return _totalMissionParticipants;
  }

  function getAccessControlContract() public view returns (address) {
    return address(_accessControl);
  }

  function getPKPAddress() public view returns (address) {
    return _pkpAddress;
  }
}
