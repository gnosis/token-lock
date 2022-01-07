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

  mapping(address => uint256) private balance;

  event Deposit(address indexed holder, uint256 amount);
  event Withdrawal(address indexed holder, uint256 amount);

  /// Withdraw amount exceeds sender's balance of the locked token
  error ExceedsBalance();
  /// Deposit is not possible anymore because the deposit period is over
  error DepositPeriodOver();
  /// Withdraw is not possible because the lock period is not over yet
  error LockPeriodOngoing();

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
  }

  /// @dev Deposit tokens to be locked until the end of the locking period
  /// @param amount The amount of tokens to deposit
  function deposit(uint256 amount) public {
    if (block.timestamp > depositDeadline) {
      revert DepositPeriodOver();
    }

    token.transferFrom(msg.sender, address(this), amount);
    balance[msg.sender] += amount;
    totalSupply += amount;

    emit Deposit(msg.sender, amount);
  }

  /// @dev Withdraw tokens after the end of the locking period
  /// @param amount The amount of tokens to withdraw
  function withdraw(uint256 amount) public {
    if (
      block.timestamp >= depositDeadline &&
      block.timestamp < depositDeadline + lockDuration
    ) {
      revert LockPeriodOngoing();
    }
    if (balance[msg.sender] < amount) {
      revert ExceedsBalance();
    }

    balance[msg.sender] -= amount;
    totalSupply -= amount;
    token.transfer(msg.sender, amount);

    emit Withdrawal(msg.sender, amount);
  }

  /// @dev Returns the number of decimals of the locked token
  function decimals() public view returns (uint8) {
    return token.decimals();
  }

  /// @dev Returns the balance of a given address
  /// @param _owner The address whose balance should be checked
  function balanceOf(address _owner) public view returns (uint256) {
    return balance[_owner];
  }
}
