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
import "./KleponAccessControl.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract KleponNFTCreator is ERC721Enumerable {
  KleponAccessControl public kleponAccess;
  address public kleponEscrow;
  address public kleponOpenAction;
  uint256 private _tokenSupply;

  mapping(uint256 => string) private _tokenIdURI;

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
  modifier onlyKleponEscrow() {
    if (kleponEscrow != msg.sender) {
      revert KleponErrors.InvalidContract();
    }
    _;
  }

  event TokenMinted(address playerAddress, uint256 tokenId);

  constructor() ERC721("KleponNFTCreator", "KNC") {}

  function initialize(
    address _kleponAccessAddress,
    address _kleponOpenActionAddress
  ) external {
    if (address(kleponAccess) != address(0)) {
      revert KleponErrors.AlreadyInitialized();
    }
    kleponAccess = KleponAccessControl(_kleponAccessAddress);
    kleponOpenAction = _kleponOpenActionAddress;
    _tokenSupply = 0;
  }

  function mintToken(
    string memory _uri,
    address _playerAddress
  ) public onlyKleponEscrow {
    _tokenSupply++;

    _tokenIdURI[_tokenSupply] = _uri;

    _safeMint(_playerAddress, _tokenSupply);

    emit TokenMinted(_playerAddress, _tokenSupply);
  }

  function tokenURI(
    uint256 _tokenId
  ) public view virtual override returns (string memory) {
    return _tokenIdURI[_tokenId];
  }

  function getTokenSupply() public view returns (uint256) {
    return _tokenSupply;
  }

  function setKleponEscrowContract(
    address _newEscrowContract
  ) external onlyMaintainerOrOpenAction {
    kleponEscrow = _newEscrowContract;
  }

  function setKleponAccessContract(
    address _newAccessContract
  ) external onlyMaintainer {
    kleponAccess = KleponAccessControl(_newAccessContract);
  }
}
