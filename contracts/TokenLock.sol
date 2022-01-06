// SPDX-License-Identifier: LGPL-3.0-only
pragma solidity ^0.8.6;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TokenLock is OwnableUpgradeable {
  ERC20 public token;
  uint256 public depositDeadline;
  uint256 public lockDuration;

  string public name;
  string public symbol;
  uint256 public totalSupply;
  mapping(address => uint256) public balanceOf;

  event Deposit(address indexed holder, uint256 amount);
  event Withdrawal(address indexed holder, uint256 amount);

  event Setup(
    address indexed creator,
    address indexed owner,
    address token,
    uint256 depositDeadline,
    uint256 lockDuration,
    string name,
    string symbol
  );

  /// Deposit amount exceeds sender's balance of the token to lock or withdraw amount exceeds sender's balance of the locked token
  error ExceedsBalance();
  /// Deposit is not possible anymore because the deposit period is over
  error DepositPeriodOver();
  /// Withdraw is not possible because the lock period is not over yet
  error WithdrawLocked();

  function initialize(
    address _owner,
    address _token,
    uint256 _depositDeadline,
    uint256 _lockDuration,
    string memory _name,
    string memory _symbol
  ) public initializer {
    __Ownable_init();
    transferOwnership(_owner);
    token = ERC20(_token);
    depositDeadline = _depositDeadline;
    lockDuration = _lockDuration;
    name = _name;
    symbol = _symbol;
    totalSupply = 0;

    emit Setup(
      msg.sender,
      _owner,
      _token,
      _depositDeadline,
      _lockDuration,
      _name,
      _symbol
    );
  }

  /// @dev Deposit tokens to be locked until the end of the locking period
  /// @param amount The amount of tokens to deposit
  function deposit(uint256 amount) public {
    if (block.timestamp > depositDeadline) {
      revert DepositPeriodOver();
    }
    if (token.balanceOf(msg.sender) < amount) {
      revert ExceedsBalance();
    }

    token.transferFrom(msg.sender, address(this), amount);
    balanceOf[msg.sender] += amount;
    totalSupply += amount;

    emit Deposit(msg.sender, amount);
  }

  /// @dev Withdraw tokens after the end of the locking period
  function withdraw(uint256 amount) public {
    if (block.timestamp < depositDeadline + lockDuration) {
      revert WithdrawLocked();
    }
    if (balanceOf[msg.sender] < amount) {
      revert ExceedsBalance();
    }

    balanceOf[msg.sender] -= amount;
    token.transferFrom(address(this), msg.sender, amount);
    totalSupply -= amount;

    emit Withdrawal(msg.sender, amount);
  }

  /// @dev Returns the number of decimals of the locked token
  function decimals() public view returns (uint8) {
    return token.decimals();
  }
}
