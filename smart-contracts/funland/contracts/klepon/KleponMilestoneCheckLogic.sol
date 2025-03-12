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

import "./KleponMissionData.sol";
import "./KleponAccessControl.sol";
import "./../actions/KleponOpenAction.sol";

contract KleponMilestoneCheckLogic {
  string public symbol;
  string public name;
  KleponOpenAction public kleponOpenAction;

  constructor() {
    name = "KleponMilestoneCheckLogic";
    symbol = "KMCL";
  }

  function freezeSetKleponOpenAction(address _kleponOpenActionAddress) public {
    if (address(kleponOpenAction) != address(0)) {
      revert KleponErrors.InvalidAddress();
    }

    kleponOpenAction = KleponOpenAction(_kleponOpenActionAddress);
  }

  function checkMilestoneLogic(
    address _kmd,
    uint256 _milestone,
    uint256 _missionId,
    uint256 _playerProfileId,
    uint256 _videoPubId,
    uint256 _videoProfileId
  ) external view {
    uint256[] memory _factoryIds = KleponMissionData(_kmd)
      .getMilestoneVideoFactoryIds(
        _missionId,
        _milestone,
        _videoProfileId,
        _videoPubId
      );

    if (_factoryIds.length < 1) {
      _checkEligibilityLoopLocal(
        _kmd,
        _missionId,
        _milestone,
        _playerProfileId,
        _videoPubId,
        _videoProfileId
      );
    } else {
      KleponLibrary.AggregateParams memory _agParams = _aggregateGlobalMetrics(
        _factoryIds,
        _kmd,
        _playerProfileId,
        _videoPubId,
        _videoProfileId
      );

      _checkEligibilityLoopGlobal(
        _agParams,
        _kmd,
        _missionId,
        _milestone,
        _playerProfileId,
        _videoPubId,
        _videoProfileId
      );
    }
  }

  function _aggregateGlobalMetrics(
    uint256[] memory _factoryIds,
    address _kmd,
    uint256 _playerProfileId,
    uint256 _videoPubId,
    uint256 _videoProfileId
  ) private view returns (KleponLibrary.AggregateParams memory) {
    KleponLibrary.AggregateParams memory _agged;

    for (uint256 h = 0; h <= _factoryIds.length; h++) {
      KleponMissionData kleponMissionDataContract;
      if (h == _factoryIds.length) {
        kleponMissionDataContract = KleponMissionData(_kmd);
      } else {
        kleponMissionDataContract = KleponMissionData(
          KleponAccessControl(
            kleponOpenAction.getContractFactoryMap(_factoryIds[h])
          ).getKleponMissionData()
        );
      }

      _agged.avd += kleponMissionDataContract.getPlayerVideoAVD(
        _playerProfileId,
        _videoPubId,
        _videoProfileId
      );
      _agged.playCount += kleponMissionDataContract.getPlayerVideoPlayCount(
        _playerProfileId,
        _videoPubId,
        _videoProfileId
      );
      _agged.secondaryQuoteOnQuote += kleponMissionDataContract
        .getPlayerVideoSecondaryQuoteOnQuote(
          _playerProfileId,
          _videoPubId,
          _videoProfileId
        );
      _agged.secondaryMirrorOnQuote += kleponMissionDataContract
        .getPlayerVideoSecondaryMirrorOnQuote(
          _playerProfileId,
          _videoPubId,
          _videoProfileId
        );
      _agged.secondaryReactOnQuote += kleponMissionDataContract
        .getPlayerVideoSecondaryReactOnQuote(
          _playerProfileId,
          _videoPubId,
          _videoProfileId
        );
      _agged.secondaryCommentOnQuote += kleponMissionDataContract
        .getPlayerVideoSecondaryCommentOnQuote(
          _playerProfileId,
          _videoPubId,
          _videoProfileId
        );
      _agged.secondaryCollectOnQuote += kleponMissionDataContract
        .getPlayerVideoSecondaryCollectOnQuote(
          _playerProfileId,
          _videoPubId,
          _videoProfileId
        );
      _agged.secondaryQuoteOnComment += kleponMissionDataContract
        .getPlayerVideoSecondaryQuoteOnComment(
          _playerProfileId,
          _videoPubId,
          _videoProfileId
        );
      _agged.secondaryMirrorOnComment += kleponMissionDataContract
        .getPlayerVideoSecondaryMirrorOnComment(
          _playerProfileId,
          _videoPubId,
          _videoProfileId
        );
      _agged.secondaryReactOnComment += kleponMissionDataContract
        .getPlayerVideoSecondaryReactOnComment(
          _playerProfileId,
          _videoPubId,
          _videoProfileId
        );
      _agged.secondaryCommentOnComment += kleponMissionDataContract
        .getPlayerVideoSecondaryCommentOnComment(
          _playerProfileId,
          _videoPubId,
          _videoProfileId
        );
      _agged.secondaryCollectOnComment += kleponMissionDataContract
        .getPlayerVideoSecondaryCollectOnComment(
          _playerProfileId,
          _videoPubId,
          _videoProfileId
        );
      _agged.duration += kleponMissionDataContract.getPlayerVideoDuration(
        _playerProfileId,
        _videoPubId,
        _videoProfileId
      );

      if (!_agged.hasQuoted) {
        _agged.hasQuoted = kleponMissionDataContract.getPlayerVideoQuote(
          _playerProfileId,
          _videoPubId,
          _videoProfileId
        );
      }

      if (!_agged.hasReacted) {
        _agged.hasReacted = kleponMissionDataContract.getPlayerVideoReact(
          _playerProfileId,
          _videoPubId,
          _videoProfileId
        );
      }

      if (!_agged.hasBookmarked) {
        _agged.hasBookmarked = kleponMissionDataContract.getPlayerVideoBookmark(
          _playerProfileId,
          _videoPubId,
          _videoProfileId
        );
      }

      if (!_agged.hasCommented) {
        _agged.hasCommented = kleponMissionDataContract.getPlayerVideoComment(
          _playerProfileId,
          _videoPubId,
          _videoProfileId
        );
      }

      if (!_agged.hasMirrored) {
        _agged.hasMirrored = kleponMissionDataContract.getPlayerVideoMirror(
          _playerProfileId,
          _videoPubId,
          _videoProfileId
        );
      }
    }

    return _agged;
  }

  function _checkEligibilityLoopGlobal(
    KleponLibrary.AggregateParams memory _agParams,
    address _kmd,
    uint256 _missionId,
    uint256 _milestone,
    uint256 _playerProfileId,
    uint256 _videoPubId,
    uint256 _videoProfileId
  ) private view {
    if (
      _agParams.avd <
      KleponMissionData(_kmd).getMilestoneVideoMinAVD(
        _missionId,
        _milestone,
        _videoProfileId,
        _videoPubId
      ) ||
      _agParams.playCount <
      KleponMissionData(_kmd).getMilestoneVideoMinPlayCount(
        _missionId,
        _milestone,
        _videoProfileId,
        _videoPubId
      ) ||
      _agParams.duration <
      KleponMissionData(_kmd).getMilestoneVideoMinDuration(
        _missionId,
        _milestone,
        _videoProfileId,
        _videoPubId
      ) ||
      _agParams.secondaryQuoteOnQuote <
      KleponMissionData(_kmd).getMilestoneVideoMinSecondaryQuoteOnQuote(
        _missionId,
        _milestone,
        _videoProfileId,
        _videoPubId
      ) ||
      _agParams.secondaryMirrorOnQuote <
      KleponMissionData(_kmd).getMilestoneVideoMinSecondaryMirrorOnQuote(
        _missionId,
        _milestone,
        _videoProfileId,
        _videoPubId
      ) ||
      _agParams.secondaryReactOnQuote <
      KleponMissionData(_kmd).getMilestoneVideoMinSecondaryReactOnQuote(
        _missionId,
        _milestone,
        _videoProfileId,
        _videoPubId
      ) ||
      _agParams.secondaryCommentOnQuote <
      KleponMissionData(_kmd).getMilestoneVideoMinSecondaryCommentOnQuote(
        _missionId,
        _milestone,
        _videoProfileId,
        _videoPubId
      ) ||
      _agParams.secondaryCollectOnQuote <
      KleponMissionData(_kmd).getMilestoneVideoMinSecondaryCollectOnQuote(
        _missionId,
        _milestone,
        _videoProfileId,
        _videoPubId
      ) ||
      _agParams.secondaryQuoteOnComment <
      KleponMissionData(_kmd).getMilestoneVideoMinSecondaryQuoteOnComment(
        _missionId,
        _milestone,
        _videoProfileId,
        _videoPubId
      ) ||
      _agParams.secondaryMirrorOnComment <
      KleponMissionData(_kmd).getMilestoneVideoMinSecondaryMirrorOnComment(
        _missionId,
        _milestone,
        _videoProfileId,
        _videoPubId
      ) ||
      _agParams.secondaryReactOnComment <
      KleponMissionData(_kmd).getMilestoneVideoMinSecondaryReactOnComment(
        _missionId,
        _milestone,
        _videoProfileId,
        _videoPubId
      ) ||
      _agParams.secondaryCommentOnComment <
      KleponMissionData(_kmd).getMilestoneVideoMinSecondaryCommentOnComment(
        _missionId,
        _milestone,
        _videoProfileId,
        _videoPubId
      ) ||
      _agParams.secondaryCollectOnComment <
      KleponMissionData(_kmd).getMilestoneVideoMinSecondaryCollectOnComment(
        _missionId,
        _milestone,
        _videoProfileId,
        _videoPubId
      )
    ) {
      revert KleponErrors.MilestoneInvalid();
    }

    if (
      KleponMissionData(_kmd).getMilestoneVideoBookmark(
        _missionId,
        _milestone,
        _videoProfileId,
        _videoPubId
      ) &&
      _agParams.hasBookmarked !=
      KleponMissionData(_kmd).getMilestoneVideoBookmark(
        _missionId,
        _milestone,
        _videoProfileId,
        _videoPubId
      )
    ) {
      revert KleponErrors.MilestoneInvalid();
    }

    if (
      KleponMissionData(_kmd).getMilestoneVideoComment(
        _missionId,
        _milestone,
        _videoProfileId,
        _videoPubId
      ) &&
      _agParams.hasCommented !=
      KleponMissionData(_kmd).getMilestoneVideoComment(
        _missionId,
        _milestone,
        _videoProfileId,
        _videoPubId
      )
    ) {
      revert KleponErrors.MilestoneInvalid();
    }

    if (
      KleponMissionData(_kmd).getMilestoneVideoReact(
        _missionId,
        _milestone,
        _videoProfileId,
        _videoPubId
      ) &&
      _agParams.hasReacted !=
      KleponMissionData(_kmd).getMilestoneVideoReact(
        _missionId,
        _milestone,
        _videoProfileId,
        _videoPubId
      )
    ) {
      revert KleponErrors.MilestoneInvalid();
    }

    if (
      KleponMissionData(_kmd).getMilestoneVideoQuote(
        _missionId,
        _milestone,
        _videoProfileId,
        _videoPubId
      ) &&
      _agParams.hasQuoted !=
      KleponMissionData(_kmd).getMilestoneVideoQuote(
        _missionId,
        _milestone,
        _videoProfileId,
        _videoPubId
      )
    ) {
      revert KleponErrors.MilestoneInvalid();
    }

    if (
      KleponMissionData(_kmd).getMilestoneVideoMirror(
        _missionId,
        _milestone,
        _videoProfileId,
        _videoPubId
      ) &&
      _agParams.hasMirrored !=
      KleponMissionData(_kmd).getMilestoneVideoMirror(
        _missionId,
        _milestone,
        _videoProfileId,
        _videoPubId
      )
    ) {
      revert KleponErrors.MilestoneInvalid();
    }
  }

  function _checkEligibilityLoopLocal(
    address _kmd,
    uint256 _missionId,
    uint256 _milestone,
    uint256 _playerProfileId,
    uint256 _videoPubId,
    uint256 _videoProfileId
  ) private view {
    if (
      KleponMissionData(_kmd).getPlayerVideoAVD(
        _playerProfileId,
        _videoPubId,
        _videoProfileId
      ) <
      KleponMissionData(_kmd).getMilestoneVideoMinAVD(
        _missionId,
        _milestone,
        _videoProfileId,
        _videoPubId
      ) ||
      KleponMissionData(_kmd).getPlayerVideoPlayCount(
        _playerProfileId,
        _videoPubId,
        _videoProfileId
      ) <
      KleponMissionData(_kmd).getMilestoneVideoMinPlayCount(
        _missionId,
        _milestone,
        _videoProfileId,
        _videoPubId
      ) ||
      KleponMissionData(_kmd).getPlayerVideoDuration(
        _playerProfileId,
        _videoPubId,
        _videoProfileId
      ) <
      KleponMissionData(_kmd).getMilestoneVideoMinDuration(
        _missionId,
        _milestone,
        _videoProfileId,
        _videoPubId
      ) ||
      KleponMissionData(_kmd).getPlayerVideoSecondaryQuoteOnQuote(
        _playerProfileId,
        _videoPubId,
        _videoProfileId
      ) <
      KleponMissionData(_kmd).getMilestoneVideoMinSecondaryQuoteOnQuote(
        _missionId,
        _milestone,
        _videoProfileId,
        _videoPubId
      ) ||
      KleponMissionData(_kmd).getPlayerVideoSecondaryMirrorOnQuote(
        _playerProfileId,
        _videoPubId,
        _videoProfileId
      ) <
      KleponMissionData(_kmd).getMilestoneVideoMinSecondaryMirrorOnQuote(
        _missionId,
        _milestone,
        _videoProfileId,
        _videoPubId
      ) ||
      KleponMissionData(_kmd).getPlayerVideoSecondaryReactOnQuote(
        _playerProfileId,
        _videoPubId,
        _videoProfileId
      ) <
      KleponMissionData(_kmd).getMilestoneVideoMinSecondaryReactOnQuote(
        _missionId,
        _milestone,
        _videoProfileId,
        _videoPubId
      ) ||
      KleponMissionData(_kmd).getPlayerVideoSecondaryCommentOnQuote(
        _playerProfileId,
        _videoPubId,
        _videoProfileId
      ) <
      KleponMissionData(_kmd).getMilestoneVideoMinSecondaryCommentOnQuote(
        _missionId,
        _milestone,
        _videoProfileId,
        _videoPubId
      ) ||
      KleponMissionData(_kmd).getPlayerVideoSecondaryCollectOnQuote(
        _playerProfileId,
        _videoPubId,
        _videoProfileId
      ) <
      KleponMissionData(_kmd).getMilestoneVideoMinSecondaryCollectOnQuote(
        _missionId,
        _milestone,
        _videoProfileId,
        _videoPubId
      ) ||
      KleponMissionData(_kmd).getPlayerVideoSecondaryQuoteOnComment(
        _playerProfileId,
        _videoPubId,
        _videoProfileId
      ) <
      KleponMissionData(_kmd).getMilestoneVideoMinSecondaryQuoteOnComment(
        _missionId,
        _milestone,
        _videoProfileId,
        _videoPubId
      ) ||
      KleponMissionData(_kmd).getPlayerVideoSecondaryMirrorOnComment(
        _playerProfileId,
        _videoPubId,
        _videoProfileId
      ) <
      KleponMissionData(_kmd).getMilestoneVideoMinSecondaryMirrorOnComment(
        _missionId,
        _milestone,
        _videoProfileId,
        _videoPubId
      ) ||
      KleponMissionData(_kmd).getPlayerVideoSecondaryReactOnComment(
        _playerProfileId,
        _videoPubId,
        _videoProfileId
      ) <
      KleponMissionData(_kmd).getMilestoneVideoMinSecondaryReactOnComment(
        _missionId,
        _milestone,
        _videoProfileId,
        _videoPubId
      ) ||
      KleponMissionData(_kmd).getPlayerVideoSecondaryCommentOnComment(
        _playerProfileId,
        _videoPubId,
        _videoProfileId
      ) <
      KleponMissionData(_kmd).getMilestoneVideoMinSecondaryCommentOnComment(
        _missionId,
        _milestone,
        _videoProfileId,
        _videoPubId
      ) ||
      KleponMissionData(_kmd).getPlayerVideoSecondaryCollectOnComment(
        _playerProfileId,
        _videoPubId,
        _videoProfileId
      ) <
      KleponMissionData(_kmd).getMilestoneVideoMinSecondaryCollectOnComment(
        _missionId,
        _milestone,
        _videoProfileId,
        _videoPubId
      )
    ) {
      revert KleponErrors.MilestoneInvalid();
    }

    if (
      KleponMissionData(_kmd).getMilestoneVideoBookmark(
        _missionId,
        _milestone,
        _videoProfileId,
        _videoPubId
      ) &&
      KleponMissionData(_kmd).getPlayerVideoBookmark(
        _playerProfileId,
        _videoPubId,
        _videoProfileId
      ) !=
      KleponMissionData(_kmd).getMilestoneVideoBookmark(
        _missionId,
        _milestone,
        _videoProfileId,
        _videoPubId
      )
    ) {
      revert KleponErrors.MilestoneInvalid();
    }

    if (
      KleponMissionData(_kmd).getMilestoneVideoComment(
        _missionId,
        _milestone,
        _videoProfileId,
        _videoPubId
      ) &&
      KleponMissionData(_kmd).getPlayerVideoComment(
        _playerProfileId,
        _videoPubId,
        _videoProfileId
      ) !=
      KleponMissionData(_kmd).getMilestoneVideoComment(
        _missionId,
        _milestone,
        _videoProfileId,
        _videoPubId
      )
    ) {
      revert KleponErrors.MilestoneInvalid();
    }

    if (
      KleponMissionData(_kmd).getMilestoneVideoReact(
        _missionId,
        _milestone,
        _videoProfileId,
        _videoPubId
      ) &&
      KleponMissionData(_kmd).getPlayerVideoReact(
        _playerProfileId,
        _videoPubId,
        _videoProfileId
      ) !=
      KleponMissionData(_kmd).getMilestoneVideoReact(
        _missionId,
        _milestone,
        _videoProfileId,
        _videoPubId
      )
    ) {
      revert KleponErrors.MilestoneInvalid();
    }

    if (
      KleponMissionData(_kmd).getMilestoneVideoQuote(
        _missionId,
        _milestone,
        _videoProfileId,
        _videoPubId
      ) &&
      KleponMissionData(_kmd).getPlayerVideoQuote(
        _playerProfileId,
        _videoPubId,
        _videoProfileId
      ) !=
      KleponMissionData(_kmd).getMilestoneVideoQuote(
        _missionId,
        _milestone,
        _videoProfileId,
        _videoPubId
      )
    ) {
      revert KleponErrors.MilestoneInvalid();
    }

    if (
      KleponMissionData(_kmd).getMilestoneVideoMirror(
        _missionId,
        _milestone,
        _videoProfileId,
        _videoPubId
      ) &&
      KleponMissionData(_kmd).getPlayerVideoMirror(
        _playerProfileId,
        _videoPubId,
        _videoProfileId
      ) !=
      KleponMissionData(_kmd).getMilestoneVideoMirror(
        _missionId,
        _milestone,
        _videoProfileId,
        _videoPubId
      )
    ) {
      revert KleponErrors.MilestoneInvalid();
    }
  }
}
