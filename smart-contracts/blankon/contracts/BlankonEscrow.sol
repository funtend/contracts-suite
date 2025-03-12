// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.9;

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

import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "./BlankonCollection.sol";
import "./BlankonMarketplace.sol";
import "./AccessControl.sol";
import "./BlankonNFT.sol";

contract BlankonEscrow is ERC721Holder {
  AccessControl public accessControl;
  BlankonCollection public blankonCollection;
  BlankonMarketplace public blankonMarketplace;
  BlankonNFT public blankonNFT;
  string public symbol;
  string public name;

  mapping(uint256 => bool) private _deposited;

  event BlankonMarketplaceUpdated(
    address indexed oldBlankonMarketplace,
    address indexed newBlankonMarketplace,
    address updater
  );
  event BlankonCollectionUpdated(
    address indexed oldBlankonCollection,
    address indexed newBlankonCollection,
    address updater
  );
  event AccessControlUpdated(
    address indexed oldAccessControl,
    address indexed newAccessControl,
    address updater
  );
  event BlankonNFTUpdated(
    address indexed oldBlankonNFT,
    address indexed newBlankonNFT,
    address updater
  );

  constructor(
    address _blankonCollectionContract,
    address _blankonMarketplaceContract,
    address _accessControlContract,
    address _blankonNFTContract,
    string memory _symbol,
    string memory _name
  ) {
    blankonCollection = BlankonCollection(_blankonCollectionContract);
    blankonMarketplace = BlankonMarketplace(_blankonMarketplaceContract);
    accessControl = AccessControl(_accessControlContract);
    blankonNFT = BlankonNFT(_blankonNFTContract);
    symbol = _symbol;
    name = _name;
  }

  modifier onlyAdmin() {
    require(
      accessControl.isAdmin(msg.sender),
      "AccessControl: Only admin can perform this action"
    );
    _;
  }

  modifier onlyDepositer() {
    require(
      msg.sender == address(blankonCollection) ||
        msg.sender == address(blankonNFT),
      "BlankonEscrow: Only the Blankon Collection or NFT contract can call this function"
    );
    _;
  }

  modifier onlyReleaser(bool _isBurn, uint256 _tokenId) {
    require(
      msg.sender == address(blankonMarketplace) ||
        msg.sender == address(blankonCollection) ||
        msg.sender == address(blankonNFT),
      "BlankonEscrow: Only the Blankon Marketplace contract can call this function"
    );
    if (_isBurn) {
      require(
        blankonNFT.getTokenCreator(_tokenId) == msg.sender ||
          address(blankonCollection) == msg.sender,
        "BlankonEscrow: Only the creator of the token can transfer it to the burn address"
      );
    }
    _;
  }

  function deposit(uint256 _tokenId, bool _bool) external onlyDepositer {
    require(
      blankonNFT.ownerOf(_tokenId) == address(this),
      "BlankonEscrow: Token must be owned by escrow contract or Owner"
    );
    _deposited[_tokenId] = _bool;
  }

  function release(
    uint256 _tokenId,
    bool _isBurn,
    address _to
  ) external onlyReleaser(_isBurn, _tokenId) {
    require(_deposited[_tokenId], "BlankonEscrow: Token must be in escrow");
    _deposited[_tokenId] = false;
    if (_isBurn) {
      blankonNFT.burn(_tokenId);
    } else {
      blankonNFT.safeTransferFrom(address(this), _to, _tokenId);
    }
  }

  function updateBlankonMarketplace(
    address _newBlankonMarketplace
  ) external onlyAdmin {
    address oldAddress = address(blankonMarketplace);
    blankonMarketplace = BlankonMarketplace(_newBlankonMarketplace);
    emit BlankonMarketplaceUpdated(
      oldAddress,
      _newBlankonMarketplace,
      msg.sender
    );
  }

  function updateBlankonCollection(
    address _newBlankonCollection
  ) external onlyAdmin {
    address oldAddress = address(blankonCollection);
    blankonCollection = BlankonCollection(_newBlankonCollection);
    emit BlankonCollectionUpdated(
      oldAddress,
      _newBlankonCollection,
      msg.sender
    );
  }

  function updateAccessControl(
    address _newAccessControlAddress
  ) external onlyAdmin {
    address oldAddress = address(accessControl);
    accessControl = AccessControl(_newAccessControlAddress);
    emit AccessControlUpdated(oldAddress, _newAccessControlAddress, msg.sender);
  }

  function updateBlankonNFT(address _newBlankonNFTAddress) external onlyAdmin {
    address oldAddress = address(blankonNFT);
    blankonNFT = BlankonNFT(_newBlankonNFTAddress);
    emit BlankonNFTUpdated(oldAddress, _newBlankonNFTAddress, msg.sender);
  }
}
