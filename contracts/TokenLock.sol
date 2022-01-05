// SPDX-License-Identifier: LGPL-3.0-only
pragma solidity ^0.8.6;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TokenLock is OwnableUpgradeable {
  event TokenLockSetup(
    address indexed creator,
    address indexed owner,
    address token,
    uint256 depositEnd,
    uint256 lockEnd
  );
  event TokenDeposited(address indexed holder, uint256 amount);
  event TokenWithdrawn(address indexed holder, uint256 amount);

  /// Deposit amount exceeds sender's balance
  error ExceedsBalance();
  /// Deposit is not possible anymore because the deposit period is over
  error DepositPeriodOver();
  /// Withdraw is not possible because the lock period is not over yet
  error WithdrawLocked();

  ERC20 public token;
  uint256 public depositEnd;
  uint256 public lockEnd;

  /// @dev Allows looking up the amount of locked tokens for the given address
  mapping(address => uint256) public lockedAmounts;

  constructor(
    address _owner,
    address _token,
    uint256 _depositEnd,
    uint256 _lockEnd
  ) {
    bytes memory initParams = abi.encode(_owner, _token, _depositEnd, _lockEnd);
    setUp(initParams);
  }

  function setUp(bytes memory initializeParams) public {
    (
      address _owner,
      address _token,
      uint256 _depositEnd,
      uint256 _lockEnd
    ) = abi.decode(initializeParams, (address, address, uint256, uint256));
    __Ownable_init();
    transferOwnership(_owner);
    token = ERC20(_token);
    depositEnd = _depositEnd;
    lockEnd = _lockEnd;

    emit TokenLockSetup(msg.sender, _owner, _token, _depositEnd, _lockEnd);
  }

  /// @dev Deposit tokens to be locked until the end of the locking period
  /// @param amount The amount of tokens to deposit
  function deposit(uint256 amount) public {
    if (block.timestamp > depositEnd) {
      revert DepositPeriodOver();
    }
    if (token.balanceOf(msg.sender) < amount) {
      revert ExceedsBalance();
    }

    token.transferFrom(msg.sender, address(this), amount);
    lockedAmounts[msg.sender] += amount;

    emit TokenDeposited(msg.sender, amount);
  }

  /// @dev Withdraw tokens after the end of the locking period
  function withdraw() public {
    if (block.timestamp < lockEnd) {
      revert WithdrawLocked();
    }

    uint256 amount = lockedAmounts[msg.sender];

    lockedAmounts[msg.sender] -= amount;
    token.transferFrom(address(this), msg.sender, amount);

    emit TokenWithdrawn(msg.sender, amount);
  }
}
