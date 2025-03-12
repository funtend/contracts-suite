// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.16;

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

import {HubRestricted} from "./../lens/v2/base/HubRestricted.sol";
import {Types} from "./../lens/v2/libraries/constants/Types.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {IPublicationActionModule} from "./../lens/v2/interfaces/IPublicationActionModule.sol";
import "./../klepon/KleponLibrary.sol";
import "./../klepon/KleponEscrow.sol";
import "./../klepon/KleponErrors.sol";
import "./../klepon/KleponAccessControl.sol";
import "./../klepon/KleponMetrics.sol";
import "./../klepon/KleponAccessControl.sol";
import "./../klepon/KleponMissionData.sol";
import "./../klepon/KleponMilestoneCheckLogic.sol";
import {ILensModule} from "./../lens/v2/interfaces/ILensModule.sol";
import {IModuleRegistry} from "./../lens/v2/interfaces/IModuleRegistry.sol";
import "@openzeppelin/contracts/proxy/Clones.sol";

contract KleponOpenAction is
  HubRestricted,
  ILensModule,
  IPublicationActionModule
{
  KleponMilestoneCheckLogic private kleponMilestoneCheckLogic;
  string private _metadata;
  address public kleponEscrowI;
  address public kleponAccessControlI;
  address public kleponMissionDataI;
  address public kleponMetricsI;
  address public kleponNFTCreatorI;
  uint256 private _factoryCounter;
  mapping(uint256 => mapping(uint256 => mapping(uint256 => uint256))) _missionGroups;
  mapping(uint256 => mapping(uint256 => uint256)) _factoryGroups;
  mapping(uint256 => address) _factoryMap;

  IModuleRegistry public immutable MODULE_GLOBALS;

  event PlayerCompletedMilestone(
    uint256 missionId,
    uint256 milestoneId,
    address playerAddress
  );
  event PlayerCompletedMission(
    uint256 missionId,
    uint256 pubId,
    uint256 profileId,
    address envokerAddress
  );
  event PlayerJoinedMission(uint256 playerProfileId, uint256 missionId);
  event NewFactoryDeployment(
    address kac,
    address ke,
    address kmd,
    address km,
    address knc
  );
  event MissionInitialized(
    uint256 missionId,
    uint256 pubId,
    uint256 profileId,
    address envokerAddress
  );

  constructor(
    string memory _metadataDetails,
    address _kleponEscrow,
    address _kleponMissionData,
    address _kleponAccess,
    address _kleponMetrics,
    address _kleponNFTCreator,
    address _hub,
    address _moduleGlobals,
    address _kleponMilestoneCheckLogic
  ) HubRestricted(_hub) {
    MODULE_GLOBALS = IModuleRegistry(_moduleGlobals);
    kleponAccessControlI = _kleponAccess;
    kleponEscrowI = _kleponEscrow;
    kleponMissionDataI = _kleponMissionData;
    kleponMetricsI = _kleponMetrics;
    kleponNFTCreatorI = _kleponNFTCreator;
    kleponMilestoneCheckLogic = KleponMilestoneCheckLogic(
      _kleponMilestoneCheckLogic
    );

    _metadata = _metadataDetails;
    _factoryCounter = 0;
  }

  function initializePublicationAction(
    uint256 _profileId,
    uint256 _pubId,
    address _address,
    bytes calldata _data
  ) external override onlyHub returns (bytes memory) {
    (KleponLibrary.ActionParameters memory _params, uint256 _factoryId) = abi
      .decode(_data, (KleponLibrary.ActionParameters, uint256));

    if (_params.gateLogic.erc721Addresses.length > 0) {
      for (uint256 k = 0; k < _params.gateLogic.erc721Addresses.length; k++) {
        if (!_functionExists(_params.gateLogic.erc721Addresses[k])) {
          revert KleponErrors.InvalidContract();
        }
      }
    }

    for (uint256 i = 0; i < _params.milestones.length; i++) {
      for (uint256 j = 0; j < _params.milestones[i].rewards.length; j++) {
        if (
          _params.milestones[i].rewards[j].rewardType ==
          KleponLibrary.RewardType.ERC20
        ) {
          if (
            !MODULE_GLOBALS.isErc20CurrencyRegistered(
              _params.milestones[i].rewards[j].tokenAddress
            )
          ) {
            revert KleponErrors.CurrencyNotWhitelisted();
          }

          if (_params.milestones[i].rewards[j].amount <= 0) {
            revert KleponErrors.InvalidRewardAmount();
          }
        }
      }

      if (_params.milestones[i].gated.erc721Addresses.length > 0) {
        for (
          uint256 k = 0;
          k < _params.milestones[i].gated.erc721Addresses.length;
          k++
        ) {
          if (
            !_functionExists(_params.milestones[i].gated.erc721Addresses[k])
          ) {
            revert KleponErrors.InvalidContract();
          }
        }
      }
    }

    (address _newKE, address _newKMD) = _createFactory(
      _address,
      _factoryId,
      true
    );

    uint256 _missionId = KleponMissionData(_newKMD).getTotalMissionCount() + 1;

    _missionConfigure(
      _params,
      _address,
      _newKE,
      _newKMD,
      _profileId,
      _pubId,
      _missionId
    );
    return abi.encode(_missionId, _profileId, _pubId);
  }

  function processPublicationAction(
    Types.ProcessActionParams calldata _params
  ) external override onlyHub returns (bytes memory) {
    uint256 _factoryId = _factoryGroups[_params.publicationActedProfileId][
      _params.publicationActedId
    ];
    uint256 _missionId = _missionGroups[_factoryId][
      _params.publicationActedProfileId
    ][_params.publicationActedId];

    (address _ke, address _kmd) = _createFactory(address(0), _factoryId, false);

    if (KleponMissionData(_kmd).getMissionEnvoker(_missionId) == address(0)) {
      revert KleponErrors.MissionDoesntExist();
    }

    bool _playerJoined = KleponMissionData(_kmd).getPlayerHasJoinedMission(
      _params.actorProfileId,
      _missionId
    );

    if (_playerJoined) {
      uint256 _playerMilestone = KleponMissionData(_kmd)
        .getPlayerMilestonesCompletedPerMission(
          _params.actorProfileId,
          _missionId
        );
      string[] memory _videoBytes = KleponMissionData(_kmd).getMilestoneVideos(
        _missionId,
        _playerMilestone + 1
      );

      if (
        !KleponMissionData(_kmd).getPlayerEligibleToClaimMilestone(
          _params.actorProfileId,
          _missionId,
          _playerMilestone + 1
        ) ||
        _playerMilestone ==
        KleponMissionData(_kmd).getMilestoneCount(_missionId)
      ) {
        revert KleponErrors.PlayerNotEligible();
      }

      _checkMilestoneLogic(
        _videoBytes,
        _kmd,
        _playerMilestone + 1,
        _missionId,
        _params.actorProfileId
      );

      _checkMilestoneGate(
        _params.actorProfileOwner,
        _kmd,
        _missionId,
        _playerMilestone + 1
      );

      uint256 _rewardLength = KleponMissionData(_kmd).getMilestoneRewardsLength(
        _missionId,
        _playerMilestone + 1
      );

      for (uint256 k = 0; k < _rewardLength; k++) {
        if (
          KleponMissionData(_kmd).getMilestoneRewardType(
            _missionId,
            k,
            _playerMilestone + 1
          ) == KleponLibrary.RewardType.ERC20
        ) {
          KleponEscrow(_ke).withdrawERC20(
            _params.actorProfileOwner,
            _missionId,
            _playerMilestone + 1,
            k
          );
        } else {
          KleponEscrow(_ke).mintERC721(
            _params.actorProfileOwner,
            _missionId,
            _playerMilestone + 1,
            k
          );
        }
      }

      KleponMissionData(_kmd).completeMilestone(
        _missionId,
        _params.actorProfileId
      );

      emit PlayerCompletedMilestone(
        _missionId,
        _playerMilestone + 1,
        _params.actorProfileOwner
      );
    } else {
      if (
        KleponMissionData(_kmd).getMissionMaxPlayerCount(_missionId) ==
        KleponMissionData(_kmd).getMissionPlayers(_missionId).length
      ) {
        revert KleponErrors.MaxPlayerCountReached();
      }

      if (
        KleponMissionData(_kmd).getMissionStatus(_missionId) ==
        KleponLibrary.Status.Closed
      ) {
        revert KleponErrors.MissionClosed();
      }

      _checkJoinEligibility(_params.actorProfileOwner, _kmd, _missionId);

      KleponMissionData(_kmd).joinMission(
        _params.actorProfileOwner,
        _missionId,
        _params.actorProfileId
      );

      emit PlayerJoinedMission(_params.actorProfileId, _missionId);
    }

    return abi.encode(_missionId);
  }

  function _checkMilestoneLogic(
    string[] memory _videoBytes,
    address _kmd,
    uint256 _milestone,
    uint256 _missionId,
    uint256 _playerProfileId
  ) private {
    for (uint256 i = 0; i < _videoBytes.length; i++) {
      (uint256 _videoProfileId, uint256 _videoPubId) = _splitString(
        _videoBytes[i]
      );

      kleponMilestoneCheckLogic.checkMilestoneLogic(
        _kmd,
        _milestone,
        _missionId,
        _playerProfileId,
        _videoPubId,
        _videoProfileId
      );
    }
  }

  function _missionConfigure(
    KleponLibrary.ActionParameters memory _params,
    address _address,
    address _newKE,
    address _newKMD,
    uint256 _profileId,
    uint256 _pubId,
    uint256 _missionId
  ) private {
    _configureRewardEscrow(
      _params.milestones,
      _address,
      _newKE,
      _missionId,
      _params.maxPlayerCount
    );

    KleponMissionData(_newKMD).configureNewMission(
      KleponLibrary.NewMissionParams({
        maxPlayerCount: _params.maxPlayerCount,
        gateLogic: _params.gateLogic,
        milestones: _params.milestones,
        uri: _params.uri,
        envokerAddress: _address,
        pubId: _pubId,
        profileId: _profileId
      })
    );

    _missionGroups[_factoryCounter][_profileId][_pubId] = _missionId;
    _factoryGroups[_profileId][_pubId] = _factoryCounter;
    emit MissionInitialized(_missionId, _profileId, _pubId, _address);
  }

  function _configureRewardEscrow(
    KleponLibrary.MilestoneParameter[] memory _milestones,
    address _envokerAddress,
    address _newKE,
    uint256 _missionId,
    uint256 _maxPlayerCount
  ) private {
    for (uint256 i = 0; i < _milestones.length; i++) {
      if (_milestones[i].rewards.length > 0) {
        for (uint256 j = 0; j < _milestones[i].rewards.length; j++) {
          if (
            _milestones[i].rewards[j].rewardType ==
            KleponLibrary.RewardType.ERC20
          ) {
            IERC20(_milestones[i].rewards[j].tokenAddress).approve(
              _newKE,
              _milestones[i].rewards[j].amount * _maxPlayerCount
            );
            IERC20(_milestones[i].rewards[j].tokenAddress).transferFrom(
              _envokerAddress,
              address(this),
              _milestones[i].rewards[j].amount * _maxPlayerCount
            );

            KleponEscrow(_newKE).depositERC20(
              _milestones[i].rewards[j].tokenAddress,
              _milestones[i].rewards[j].amount * _maxPlayerCount,
              _missionId,
              i
            );
          } else {
            KleponEscrow(_newKE).depositERC721(
              _milestones[i].rewards[j].uri,
              _missionId,
              i,
              j
            );
          }
        }
      }
    }
  }

  function _checkMilestoneGate(
    address _playerAddress,
    address _kmd,
    uint256 _missionId,
    uint256 _milestone
  ) private view {
    bool _isOneOf = KleponMissionData(_kmd).getMilestoneGatedOneOf(
      _missionId,
      _milestone
    );
    address[] memory _erc20Addresses = KleponMissionData(_kmd)
      .getMilestoneGatedERC20Addresses(_missionId, _milestone);
    uint256[] memory _erc20Thresholds = KleponMissionData(_kmd)
      .getMilestoneGatedERC20Thresholds(_missionId, _milestone);
    address[] memory _erc721Addresses = KleponMissionData(_kmd)
      .getMilestoneGatedERC721Addresses(_missionId, _milestone);
    uint256[][] memory _erc721TokenIds = KleponMissionData(_kmd)
      .getMilestoneGatedERC721TokenIds(_missionId, _milestone);
    string[][] memory _erc721TokenUris = KleponMissionData(_kmd)
      .getMilestoneGatedERC721TokenURIs(_missionId, _milestone);
    if (
      !_gateChecker(
        _erc721TokenUris,
        _erc721TokenIds,
        _erc20Addresses,
        _erc721Addresses,
        _erc20Thresholds,
        _playerAddress,
        _isOneOf
      )
    ) {
      revert KleponErrors.PlayerNotEligible();
    }
  }

  function _checkJoinEligibility(
    address _playerAddress,
    address _kmd,
    uint256 _missionId
  ) private view {
    bool _isOneOf = KleponMissionData(_kmd).getMissionGatedOneOf(_missionId);
    address[] memory _erc20Addresses = KleponMissionData(_kmd)
      .getMissionGatedERC20Addresses(_missionId);
    uint256[] memory _erc20Thresholds = KleponMissionData(_kmd)
      .getMissionGatedERC20Thresholds(_missionId);
    address[] memory _erc721Addresses = KleponMissionData(_kmd)
      .getMissionGatedERC721Addresses(_missionId);
    uint256[][] memory _erc721TokenIds = KleponMissionData(_kmd)
      .getMissionGatedERC721TokenIds(_missionId);
    string[][] memory _erc721TokenUris = KleponMissionData(_kmd)
      .getMissionGatedERC721TokenURIs(_missionId);

    if (
      !_gateChecker(
        _erc721TokenUris,
        _erc721TokenIds,
        _erc20Addresses,
        _erc721Addresses,
        _erc20Thresholds,
        _playerAddress,
        _isOneOf
      )
    ) {
      revert KleponErrors.PlayerNotEligible();
    }
  }

  function _gateChecker(
    string[][] memory _erc721TokensUris,
    uint256[][] memory _erc721TokenIds,
    address[] memory _erc20Addresses,
    address[] memory _erc721Addresses,
    uint256[] memory _erc20Thresholds,
    address _playerAddress,
    bool _isOneOf
  ) private view returns (bool) {
    bool _oneERC20ConditionMet = false;
    if (_erc20Addresses.length > 0) {
      for (uint i = 0; i < _erc20Addresses.length; i++) {
        uint256 _playerBalance = IERC20(_erc20Addresses[i]).balanceOf(
          _playerAddress
        );
        if (_playerBalance >= _erc20Thresholds[i]) {
          if (_isOneOf) {
            return true;
          }
          _oneERC20ConditionMet = true;
        } else if (!_isOneOf) {
          return false;
        }
      }
    }

    if (_isOneOf && _oneERC20ConditionMet) {
      return true;
    }

    bool _oneERC721ConditionMet = _erc721Check(
      _erc721TokensUris,
      _erc721TokenIds,
      _erc721Addresses,
      _playerAddress,
      _isOneOf
    );

    if (_isOneOf && (_oneERC20ConditionMet || _oneERC721ConditionMet)) {
      return true;
    } else if (!_isOneOf && _oneERC20ConditionMet && _oneERC721ConditionMet) {
      return true;
    } else if (_erc721Addresses.length < 1 && _erc20Addresses.length < 1) {
      return true;
    }
    return false;
  }

  function _erc721Check(
    string[][] memory _erc721TokensUris,
    uint256[][] memory _erc721TokenIds,
    address[] memory _erc721Addresses,
    address _playerAddress,
    bool _isOneOf
  ) private view returns (bool) {
    bool _oneERC721ConditionMet = false;
    if (_erc721Addresses.length > 0) {
      for (uint i = 0; i < _erc721Addresses.length; i++) {
        if (i < _erc721TokensUris.length) {
          if (_erc721TokensUris[i].length > 0) {
            uint256 _balance = IERC721(_erc721Addresses[i]).balanceOf(
              _playerAddress
            );
            bool _ownsMatchingURI = false;
            for (uint256 j = 0; j < _balance; j++) {
              uint256 _tokenId = _fetchTokenIdByIndex(
                _erc721Addresses[i],
                _playerAddress,
                j
              );
              string memory _tokenURI = IERC721Metadata(_erc721Addresses[i])
                .tokenURI(_tokenId);
              for (uint256 k = 0; k < _erc721TokensUris[i].length; k++) {
                if (
                  keccak256(abi.encodePacked(_tokenURI)) ==
                  keccak256(abi.encodePacked(_erc721TokensUris[i][k]))
                ) {
                  _ownsMatchingURI = true;
                  break;
                }
              }
              if (_ownsMatchingURI) {
                if (_isOneOf) {
                  return true;
                }
                _oneERC721ConditionMet = true;
                break;
              }
            }
          }
        }

        if (i < _erc721TokenIds.length) {
          if (_erc721TokenIds[i].length > 0) {
            for (uint j = 0; j < _erc721TokenIds[i].length; j++) {
              if (_erc721Addresses[i] != address(0)) {
                if (
                  IERC721(_erc721Addresses[i]).ownerOf(_erc721TokenIds[i][j]) ==
                  _playerAddress
                ) {
                  if (_isOneOf) {
                    return true;
                  }
                  _oneERC721ConditionMet = true;
                  break;
                }
              }
            }
          }

          if (_oneERC721ConditionMet && !_isOneOf) {
            break;
          }
        }
      }
    }

    return _oneERC721ConditionMet;
  }

  function _fetchTokenIdByIndex(
    address _erc721Address,
    address _owner,
    uint256 _index
  ) private view returns (uint256) {
    return
      IERC721Enumerable(_erc721Address).tokenOfOwnerByIndex(_owner, _index);
  }

  function _splitString(
    string memory str
  ) public pure returns (uint256, uint256) {
    bytes memory strBytes = bytes(str);
    uint delimiterIndex;

    for (uint i = 0; i < strBytes.length; i++) {
      if (strBytes[i] == bytes1("-")) {
        delimiterIndex = i;
        break;
      }
    }

    bytes memory part1Bytes = new bytes(delimiterIndex);
    for (uint i = 0; i < delimiterIndex; i++) {
      part1Bytes[i] = strBytes[i];
    }

    bytes memory part2Bytes = new bytes(strBytes.length - delimiterIndex - 1);
    for (uint i = 0; i < part2Bytes.length; i++) {
      part2Bytes[i] = strBytes[i + delimiterIndex + 1];
    }

    string memory part1 = string(part1Bytes);
    string memory part2 = string(part2Bytes);

    return (_hexStringToUint(part1), _hexStringToUint(part2));
  }

  function _hexStringToUint(
    string memory hexString
  ) internal pure returns (uint) {
    bytes memory b = bytes(hexString);
    uint result = 0;
    for (uint i = 0; i < b.length; i++) {
      uint c = uint(uint8(b[i]));

      if (48 <= c && c <= 57) {
        result = result * 16 + (c - 48);
      } else if (65 <= c && c <= 70) {
        result = result * 16 + (c - 55);
      } else if (97 <= c && c <= 102) {
        result = result * 16 + (c - 87);
      }
    }
    return result;
  }

  function _functionExists(address _contract) private view returns (bool) {
    bytes4 selector = bytes4(
      keccak256(bytes("tokenOfOwnerByIndex(address,uint256)"))
    );

    bytes memory data = abi.encodeWithSelector(
      selector,
      address(0),
      uint256(0)
    );

    (, bytes memory returnedData) = _contract.staticcall(data);

    return returnedData.length > 0;
  }

  function _createFactory(
    address _envokerAddress,
    uint256 _factoryId,
    bool _initialize
  ) private returns (address, address) {
    if (_factoryId == 0) {
      address _newKAC = Clones.clone(kleponAccessControlI);
      address _newKE = Clones.clone(kleponEscrowI);
      address _newKMD = Clones.clone(kleponMissionDataI);
      address _newKM = Clones.clone(kleponMetricsI);
      address _newKNC = Clones.clone(kleponNFTCreatorI);

      KleponAccessControl(_newKAC).initialize(_envokerAddress, address(this));
      KleponMissionData(_newKMD).initialize(_newKAC, address(this));
      KleponMetrics(_newKM).initialize(_newKAC, _newKMD);
      KleponNFTCreator(_newKNC).initialize(_newKAC, address(this));
      KleponEscrow(_newKE).initialize(_newKAC, _newKMD, _newKNC, address(this));
      KleponAccessControl(_newKAC).setRelatedContract(
        _newKE,
        _newKMD,
        _newKM,
        _newKNC
      );
      KleponNFTCreator(_newKNC).setKleponEscrowContract(_newKE);
      KleponMissionData(_newKMD).setKleponEscrowContract(_newKE);
      KleponMissionData(_newKMD).setKleponMetricsContract(_newKM);

      _factoryCounter++;

      _factoryMap[_factoryCounter] = _newKAC;
      emit NewFactoryDeployment(_newKAC, _newKE, _newKMD, _newKM, _newKNC);

      return (_newKE, _newKMD);
    } else {
      address _kac = _factoryMap[_factoryCounter];
      if (
        !KleponAccessControl(_kac).isEnvoker(_envokerAddress) && _initialize
      ) {
        revert KleponErrors.InvalidAddress();
      }
      address _ke = KleponAccessControl(_kac).getKleponEscrow();
      address _kmd = KleponAccessControl(_kac).getKleponMissionData();
      KleponAccessControl(_kac).getKleponMetrics();
      KleponAccessControl(_kac).getKleponNFTCreator();

      return (_ke, _kmd);
    }
  }

  function supportsInterface(
    bytes4 interfaceId
  ) external view override returns (bool) {
    return
      interfaceId == bytes4(keccak256(abi.encodePacked("LENS_MODULE"))) ||
      interfaceId == type(IPublicationActionModule).interfaceId;
  }

  function getModuleMetadataURI()
    external
    view
    override
    returns (string memory)
  {
    return _metadata;
  }

  function getContractFactoryMap(
    uint256 _factoryId
  ) public view returns (address) {
    return _factoryMap[_factoryId];
  }

  function getMissionId(
    uint256 _factoryId,
    uint256 _profileId,
    uint256 _pubId
  ) public view returns (uint256) {
    return _missionGroups[_factoryId][_profileId][_pubId];
  }

  function getContractFactoryId(
    uint256 _profileId,
    uint256 _pubId
  ) public view returns (uint256) {
    return _factoryGroups[_profileId][_pubId];
  }

  function getTotalContractFactoryCount() public view returns (uint256) {
    return _factoryCounter;
  }

  function getKleponMilestoneCheckLogicAddress() public view returns (address) {
    return address(kleponMilestoneCheckLogic);
  }
}
