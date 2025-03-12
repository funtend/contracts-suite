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

import "./../MachineAccessControl.sol";
import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract NeonMachineCreditSwap {
  MachineAccessControl public machineAccessControl;
  ISwapRouter public immutable swapRouter;
  string public symbol;
  string public name;
  address public neonEscrow;
  address public bonsaiAddress;
  uint24 public poolFee;

  error InvalidAddress();

  event SwapCredits(address currency, uint256 amount);
  event CreditsSwapped(
    address fromCurrency,
    address caller,
    uint256 amountIn,
    uint256 amountOut
  );
  event CreditsMoved(address moveAddress, address caller, uint256 amount);

  modifier onlyNeonEscrow() {
    if (msg.sender != neonEscrow) {
      revert InvalidAddress();
    }
    _;
  }

  modifier onlyAdminOrMachine() {
    if (
      !machineAccessControl.isAdmin(msg.sender) &&
      !machineAccessControl.isMachine(msg.sender)
    ) {
      revert InvalidAddress();
    }
    _;
  }

  constructor(address _machineAccessControlAddress, address _routerAddress) {
    machineAccessControl = MachineAccessControl(_machineAccessControlAddress);
    swapRouter = ISwapRouter(_routerAddress);
    symbol = "NMCS";
    name = "NeonMachineCreditSwap";
    poolFee = 3000;
  }

  function receiveAndSwapCredits(
    address _currency,
    uint256 _amount
  ) external onlyNeonEscrow {
    IERC20(_currency).transferFrom(neonEscrow, address(this), _amount);

    uint256 _amountOut = _amount;

    if (_currency != bonsaiAddress) {
      _amountOut = _swapCreditsToBonsai(_currency, _amount);
    }

    emit CreditsSwapped(_currency, neonEscrow, _amount, _amountOut);
  }

  function moveCredits(
    address _moveAddress,
    uint256 _amount
  ) external onlyAdminOrMachine {
    IERC20(bonsaiAddress).transferFrom(address(this), _moveAddress, _amount);

    emit CreditsMoved(_moveAddress, msg.sender, _amount);
  }

  function _swapCreditsToBonsai(
    address _currency,
    uint256 _amount
  ) private returns (uint256) {
    IERC20(_currency).approve(address(swapRouter), _amount);

    ISwapRouter.ExactInputSingleParams memory params = ISwapRouter
      .ExactInputSingleParams({
        tokenIn: _currency,
        tokenOut: bonsaiAddress,
        fee: poolFee,
        recipient: msg.sender,
        deadline: block.timestamp,
        amountIn: _amount,
        amountOutMinimum: 0,
        sqrtPriceLimitX96: 0
      });

    return swapRouter.exactInputSingle(params);
  }

  function setNeonEscrowAddress(
    address _neonEscrowAddress
  ) public onlyAdminOrMachine {
    neonEscrow = _neonEscrowAddress;
  }

  function setBonsaiAddress(address _bonsaiAddress) public onlyAdminOrMachine {
    bonsaiAddress = _bonsaiAddress;
  }

  function setMachineAccessControl(
    address _machineAccessControlAddress
  ) public onlyAdminOrMachine {
    machineAccessControl = MachineAccessControl(_machineAccessControlAddress);
  }

  function changePoolFee(uint24 _newPoolFee) public onlyAdminOrMachine {
    poolFee = _newPoolFee;
  }
}
