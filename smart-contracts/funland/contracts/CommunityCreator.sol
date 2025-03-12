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

import "./PixelAccessControl.sol";
import "./PixelCommunityData.sol";
import "./PixelOrderData.sol";
import "./PixelDesignData.sol";

contract CommunityCreator {
  PixelAccessControl public pixelAccessControl;
  PixelCommunityData public pixelCommunityData;
  PixelDesignData public pixelDesignData;
  PixelOrderData public pixelOrderData;
  string public symbol;
  string public name;

  error InvalidAddress();
  error RequirementsNotMet();

  modifier onlyCommunitySteward() {
    if (!pixelAccessControl.isCommunitySteward(msg.sender)) {
      revert InvalidAddress();
    }
    _;
  }

  modifier onlyAdmin() {
    if (!pixelAccessControl.isAdmin(msg.sender)) {
      revert InvalidAddress();
    }
    _;
  }

  constructor(
    address _pixelOrderDataAddress,
    address _pixelAccessControlAddress,
    address _pixelDesignDataAddress
  ) {
    pixelAccessControl = PixelAccessControl(_pixelAccessControlAddress);
    pixelOrderData = PixelOrderData(_pixelOrderDataAddress);
    pixelDesignData = PixelDesignData(_pixelDesignDataAddress);

    symbol = "CCR";
    name = "CollectionCreator";
  }

  function createNewCommunity(
    PixelLibrary.CreateCommunityParams memory _params
  ) public onlyCommunitySteward {
    pixelCommunityData.createCommunity(_params);
  }

  function updateExistingCommunity(
    PixelLibrary.CreateCommunityParams memory _params,
    uint256 _communityId
  ) public {
    if (pixelCommunityData.getCommunitySteward(_communityId) != msg.sender) {
      revert InvalidAddress();
    }

    pixelCommunityData.updateCommunity(_params, _communityId);
  }

  function joinCommunity(
    address _memberAddress,
    uint256 _communityId,
    uint256 _memberProfileId
  ) public {
    uint256[] memory _tokenIds = pixelOrderData.getAddressToTokenIds(
      _memberAddress
    );

    bool _isValid = false;

    for (uint256 i = 0; i < _tokenIds.length; i++) {
      address _creator = pixelDesignData.getCollectionCreator(_tokenIds[i]);
      uint256 _origin = pixelDesignData.getCollectionOrigin(_tokenIds[i]);
      uint256 _pixel = pixelDesignData.getCollectionPixelType(_tokenIds[i]);

      if (
        pixelCommunityData.getCommunityIsValidCreator(_creator, _communityId) &&
        pixelCommunityData.getCommunityIsValidOrigin(_origin, _communityId) &&
        pixelCommunityData.getCommunityIsValidPixelType(_pixel, _communityId)
      ) {
        _isValid = true;
        break;
      }
    }

    if (!_isValid) {
      revert RequirementsNotMet();
    }

    address[] memory _valid20AddressKeys = pixelCommunityData
      .getCommunityValid20AddressKeys(_communityId);

    _isValid = false;

    for (uint256 i = 0; i < _valid20AddressKeys.length; i++) {
      if (
        IERC20(_valid20AddressKeys[i]).balanceOf(_memberAddress) >=
        pixelCommunityData.getCommunityValid20Threshold(
          _valid20AddressKeys[i],
          _communityId
        )
      ) {
        _isValid = true;
        break;
      }
    }

    if (!_isValid) {
      revert RequirementsNotMet();
    }

    pixelCommunityData.addCommunityMember(
      _memberAddress,
      _communityId,
      _memberProfileId
    );
  }

  function leaveCommunity(
    uint256 _communityId,
    uint256 _memberProfileId
  ) public {
    if (
      !pixelCommunityData.getIsCommunityMember(
        _communityId,
        _memberProfileId
      ) ||
      !pixelCommunityData.getIsValidCommunityAddress(msg.sender, _communityId)
    ) {
      revert InvalidAddress();
    }

    pixelCommunityData.removeCommunityMember(
      msg.sender,
      _communityId,
      _memberProfileId
    );
  }

  function setPixelAccessControlAddress(
    address _newPixelAccessControlAddress
  ) public onlyAdmin {
    pixelAccessControl = PixelAccessControl(_newPixelAccessControlAddress);
  }

  function setPixelCommunityDataAddress(
    address _newPixelCommunityDataAddress
  ) public onlyAdmin {
    pixelCommunityData = PixelCommunityData(_newPixelCommunityDataAddress);
  }

  function setPixelOrderDataAddress(
    address _newPixelOrderDataAddress
  ) public onlyAdmin {
    pixelOrderData = PixelOrderData(_newPixelOrderDataAddress);
  }

  function setPixelDesignDataAddress(
    address _newPixelDesignDataAddress
  ) public onlyAdmin {
    pixelDesignData = PixelDesignData(_newPixelDesignDataAddress);
  }
}
