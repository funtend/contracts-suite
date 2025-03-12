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
import "./KleponNFTCreator.sol";
import "./KleponMissionData.sol";
import "./KleponErrors.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract KleponEscrow {
  string public name;
  string public symbol;
  KleponAccessControl public kleponAccess;
  KleponMissionData public kleponMissionData;
  KleponNFTCreator public kleponNFTCreator;
  address public kleponOpenAction;

  mapping(uint256 => mapping(uint256 => mapping(address => uint256)))
    private _missionMilestoneERC20Deposit;
  mapping(uint256 => mapping(uint256 => mapping(uint256 => string)))
    private _missionMilestoneERC721Deposit;

  modifier onlyOpenAction() {
    if (msg.sender != kleponOpenAction) {
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

  event ERC20Deposited(
    address tokenAddress,
    uint256 amount,
    uint256 missionId,
    uint256 milestone
  );
  event ERC721URISet(string uri, uint256 missionId, uint256 milestone);
  event ERC20Withdrawn(address toAddress, uint256 missionId, uint256 milestone);
  event EmergencyERC20Withdrawn(address toAddress, uint256 missionId);
  event ERC721Minted(
    address playerAddress,
    uint256 missionId,
    uint256 milestone
  );

  function initialize(
    address _kleponAccessAddress,
    address _kleponMissionDataAddress,
    address _kleponNFTCreatorAddress,
    address _kleponOpenActionAddress
  ) external {
    if (address(kleponAccess) != address(0)) {
      revert KleponErrors.AlreadyInitialized();
    }
    name = "KleponEscrow";
    symbol = "KES";
    kleponAccess = KleponAccessControl(_kleponAccessAddress);
    kleponMissionData = KleponMissionData(_kleponMissionDataAddress);
    kleponNFTCreator = KleponNFTCreator(_kleponNFTCreatorAddress);
    kleponOpenAction = _kleponOpenActionAddress;
  }

  function depositERC20(
    address _tokenAddress,
    uint256 _amount,
    uint256 _missionId,
    uint256 _milestone
  ) external onlyOpenAction {
    IERC20(_tokenAddress).transferFrom(
      address(kleponOpenAction),
      address(this),
      _amount
    );

    _missionMilestoneERC20Deposit[_missionId][_milestone][
      _tokenAddress
    ] = _amount;

    emit ERC20Deposited(_tokenAddress, _amount, _missionId, _milestone);
  }

  function withdrawERC20(
    address _toAddress,
    uint256 _missionId,
    uint256 _milestone,
    uint256 _rewardIndex
  ) external onlyOpenAction {
    if (
      kleponMissionData.getMissionStatus(_missionId) !=
      KleponLibrary.Status.Open
    ) {
      revert KleponErrors.MissionClosed();
    }

    uint256 _amount = kleponMissionData.getMilestoneRewardTokenAmount(
      _missionId,
      _rewardIndex,
      _milestone
    );

    address _tokenAddress = kleponMissionData.getMilestoneRewardTokenAddress(
      _missionId,
      _rewardIndex,
      _milestone
    );

    IERC20(_tokenAddress).transfer(_toAddress, _amount);

    _missionMilestoneERC20Deposit[_missionId][_milestone - 1][
      _tokenAddress
    ] -= _amount;

    emit ERC20Withdrawn(_toAddress, _missionId, _milestone);
  }

  function emergencyWithdrawERC20(
    address _toAddress,
    uint256 _missionId
  ) public {
    if (
      kleponMissionData.getMissionEnvoker(_missionId) != msg.sender &&
      msg.sender != address(this)
    ) {
      revert KleponErrors.InvalidAddress();
    }

    if (kleponMissionData.getMissionEnvoker(_missionId) == address(0)) {
      revert KleponErrors.MissionDoesntExist();
    }

    uint256 _milestoneCount = kleponMissionData.getMilestoneCount(_missionId);

    for (uint256 i = 0; i < _milestoneCount; i++) {
      uint256 _rewardLength = kleponMissionData.getMilestoneRewardsLength(
        _missionId,
        i + 1
      );

      uint256 _counterSize = 0;
      for (uint256 j = 0; j < _rewardLength; j++) {
        if (
          kleponMissionData.getMilestoneRewardType(_missionId, j, i + 1) ==
          KleponLibrary.RewardType.ERC20
        ) {
          _counterSize++;
        }
      }

      address[] memory _uniqueAddresses = new address[](_counterSize);

      uint256 _counter = 0;
      for (uint256 j = 0; j < _rewardLength; j++) {
        if (
          kleponMissionData.getMilestoneRewardType(_missionId, j, i + 1) ==
          KleponLibrary.RewardType.ERC20
        ) {
          _uniqueAddresses[_counter] = kleponMissionData
            .getMilestoneRewardTokenAddress(_missionId, j, i + 1);
          _counter++;
        }
      }

      for (uint256 k = 0; k < _uniqueAddresses.length; k++) {
        IERC20(_uniqueAddresses[k]).transfer(
          _toAddress,
          _missionMilestoneERC20Deposit[_missionId][i][_uniqueAddresses[k]]
        );
        _missionMilestoneERC20Deposit[_missionId][i][_uniqueAddresses[k]] = 0;
      }
    }

    kleponMissionData.updateMissionStatus(_missionId);

    emit EmergencyERC20Withdrawn(_toAddress, _missionId);
  }

  function depositERC721(
    string memory _uri,
    uint256 _missionId,
    uint256 _milestone,
    uint256 _rewardIndex
  ) external onlyOpenAction {
    _missionMilestoneERC721Deposit[_missionId][_milestone][_rewardIndex] = _uri;

    emit ERC721URISet(_uri, _missionId, _milestone);
  }

  function mintERC721(
    address _playerAddress,
    uint256 _missionId,
    uint256 _milestone,
    uint256 _rewardIndex
  ) external onlyOpenAction {
    if (
      kleponMissionData.getMissionStatus(_missionId) !=
      KleponLibrary.Status.Open
    ) {
      revert KleponErrors.MissionClosed();
    }
    kleponNFTCreator.mintToken(
      _missionMilestoneERC721Deposit[_missionId][_milestone - 1][_rewardIndex],
      _playerAddress
    );

    emit ERC721Minted(_playerAddress, _missionId, _milestone);
  }

  function deleteMission(uint256 _missionId) public {
    if (kleponMissionData.getMissionEnvoker(_missionId) == address(0)) {
      revert KleponErrors.MissionDoesntExist();
    }
    if (kleponMissionData.getMissionEnvoker(_missionId) != msg.sender) {
      revert KleponErrors.InvalidAddress();
    }

    if (
      kleponMissionData.getMissionStatus(_missionId) ==
      KleponLibrary.Status.Open
    ) {
      emergencyWithdrawERC20(msg.sender, _missionId);
    }

    kleponMissionData.deleteMission(_missionId);
  }

  function getMissionMilestoneERC20TotalDeposit(
    address _tokenAddress,
    uint256 _missionId,
    uint256 _milestone
  ) public view returns (uint256) {
    return
      _missionMilestoneERC20Deposit[_missionId][_milestone - 1][_tokenAddress];
  }

  function getMissionMilestoneERC721URI(
    uint256 _missionId,
    uint256 _milestone,
    uint256 _rewardIndex
  ) public view returns (string memory) {
    return
      _missionMilestoneERC721Deposit[_missionId][_milestone - 1][_rewardIndex];
  }

  function setKleponMissionDataContract(
    address _newMissionDataContract
  ) external onlyMaintainer {
    kleponMissionData = KleponMissionData(_newMissionDataContract);
  }

  function setKleponAccessContract(
    address _newAccessContract
  ) external onlyMaintainer {
    kleponAccess = KleponAccessControl(_newAccessContract);
  }

  function setKleponNFTCreatorContract(
    address _newNFTCreatorContract
  ) external onlyMaintainer {
    kleponNFTCreator = KleponNFTCreator(_newNFTCreatorContract);
  }

  function setKleponOpenActionContract(
    address _newOpenActionContract
  ) external onlyMaintainer {
    kleponOpenAction = _newOpenActionContract;
  }

  function getKleponMissionDataAddress() public view returns (address) {
    return address(kleponMissionData);
  }
}
