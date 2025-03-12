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

import "./AccessControl.sol";
import "./BlankonCollection.sol";
import "./BlankonEscrow.sol";
import "./BlankonNFT.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract BlankonMarketplace {
  BlankonCollection public blankonCollection;
  BlankonEscrow public blankonEscrow;
  BlankonNFT public blankonNFT;
  AccessControl public accessControl;
  string public symbol;
  string public name;

  mapping(uint256 => uint256) private tokensSold;
  mapping(uint256 => uint256[]) private tokenIdsSold;

  modifier onlyAdmin() {
    require(
      accessControl.isAdmin(msg.sender),
      "AccessControl: Only admin can perform this action"
    );
    _;
  }

  event AccessControlUpdated(
    address indexed oldAccessControl,
    address indexed newAccessControl,
    address updater
  );
  event BlankonCollectionUpdated(
    address indexed oldBlankonCollection,
    address indexed newBlankonCollection,
    address updater
  );
  event BlankonNFTUpdated(
    address indexed oldBlankonNFT,
    address indexed newBlankonNFT,
    address updater
  );
  event BlankonEscrowUpdated(
    address indexed oldBlankonEscrow,
    address indexed newBlankonEscrow,
    address updater
  );
  event TokensBought(
    uint256[] tokenIds,
    uint256 totalPrice,
    address buyer,
    address chosenAddress
  );

  constructor(
    address _collectionContract,
    address _accessControlContract,
    address _NFTContract,
    string memory _symbol,
    string memory _name
  ) {
    blankonCollection = BlankonCollection(_collectionContract);
    accessControl = AccessControl(_accessControlContract);
    blankonNFT = BlankonNFT(_NFTContract);
    symbol = _symbol;
    name = _name;
  }

  function buyTokens(
    uint256[] memory _tokenIds,
    address _chosenTokenAddress
  ) external {
    uint256 totalPrice = 0;
    uint256[] memory prices = new uint256[](_tokenIds.length);

    for (uint256 i = 0; i < _tokenIds.length; i++) {
      require(
        blankonNFT.ownerOf(_tokenIds[i]) == address(blankonEscrow),
        "BlankonMarketplace: Token must be owned by Escrow"
      );
      bool isAccepted = false;
      address[] memory acceptedTokens = blankonNFT.getTokenAcceptedTokens(
        _tokenIds[i]
      );
      for (uint256 j = 0; j < acceptedTokens.length; j++) {
        if (acceptedTokens[j] == _chosenTokenAddress) {
          isAccepted = true;
          break;
        }
      }
      require(
        isAccepted,
        "BlankonMarketplace: Chosen token address is not an accepted token for the collection"
      );
    }

    for (uint256 i = 0; i < _tokenIds.length; i++) {
      address[] memory acceptedTokens = blankonNFT.getTokenAcceptedTokens(
        _tokenIds[i]
      );
      for (uint256 j = 0; j < acceptedTokens.length; j++) {
        if (acceptedTokens[j] == _chosenTokenAddress) {
          prices[i] = blankonNFT.getBasePrices(_tokenIds[i])[j];
          totalPrice += prices[i];
          break;
        }
      }
    }

    uint256 allowance = IERC20(_chosenTokenAddress).allowance(
      msg.sender,
      address(this)
    );

    require(
      allowance >= totalPrice,
      "BlankonMarketplace: Insufficient Approval Allowance"
    );

    for (uint256 i = 0; i < _tokenIds.length; i++) {
      IERC20(_chosenTokenAddress).transferFrom(
        msg.sender,
        blankonNFT.getTokenCreator(_tokenIds[i]),
        prices[i]
      );
      blankonEscrow.release(_tokenIds[i], false, msg.sender);
    }

    for (uint256 i = 0; i < _tokenIds.length; i++) {
      tokensSold[blankonNFT.getTokenCollection(_tokenIds[i])] += 1;
      tokenIdsSold[blankonNFT.getTokenCollection(_tokenIds[i])].push(
        _tokenIds[i]
      );
    }

    emit TokensBought(_tokenIds, totalPrice, msg.sender, _chosenTokenAddress);
  }

  function updateAccessControl(
    address _newAccessControlAddress
  ) external onlyAdmin {
    address oldAddress = address(accessControl);
    accessControl = AccessControl(_newAccessControlAddress);
    emit AccessControlUpdated(oldAddress, _newAccessControlAddress, msg.sender);
  }

  function updateBlankonCollection(
    address _newBlankonCollectionAddress
  ) external onlyAdmin {
    address oldAddress = address(blankonCollection);
    blankonCollection = BlankonCollection(_newBlankonCollectionAddress);
    emit BlankonCollectionUpdated(
      oldAddress,
      _newBlankonCollectionAddress,
      msg.sender
    );
  }

  function updateBlankonNFT(address _newBlankonNFTAddress) external onlyAdmin {
    address oldAddress = address(blankonNFT);
    blankonNFT = BlankonNFT(_newBlankonNFTAddress);
    emit BlankonNFTUpdated(oldAddress, _newBlankonNFTAddress, msg.sender);
  }

  function setBlankonEscrow(
    address _newBlankonEscrowAddress
  ) external onlyAdmin {
    address oldAddress = address(blankonEscrow);
    blankonEscrow = BlankonEscrow(_newBlankonEscrowAddress);
    emit BlankonEscrowUpdated(oldAddress, _newBlankonEscrowAddress, msg.sender);
  }

  function getCollectionSoldCount(
    uint256 _collectionId
  ) public view returns (uint256) {
    return tokensSold[_collectionId];
  }

  function getTokensSoldCollection(
    uint256 _collectionId
  ) public view returns (uint256[] memory) {
    return tokenIdsSold[_collectionId];
  }
}
