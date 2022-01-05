# Token Lock Contract

[![Build Status](https://github.com/gnosis/token-lock/actions/workflows/ci.yml/badge.svg)](https://github.com/gnosis/token-lock/actions/workflows/ci.yml)
[![Coverage Status](https://coveralls.io/repos/github/gnosis/token-lock/badge.svg?branch=main)](https://coveralls.io/github/gnosis/token-lock)

Lock ERC-20 tokens for a pre-defined amount of time

1. Deposit period that ends at the configured `depositEnd` timestamp.
2. Deposited tokens are locked until the configured `lockEnd` timestamp.
3. After the end of the lock period, depositors can withdraw their tokens.

### Solidity Compiler

The contracts have been developed with [Solidity 0.8.6](https://github.com/ethereum/solidity/releases/tag/v0.8.6). This version of Solidity made all arithmetic checked by default, therefore eliminating the need for explicit overflow or underflow (or other arithmetic) checks. This version of solidity was chosen as it allows to easily cast bytes to bytes4 and bytes32.

### Security and Liability

All contracts are WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.

### License

Created under the [LGPL-3.0+ license](LICENSE).
