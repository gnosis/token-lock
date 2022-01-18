# Token Lock

Lock ERC-20 token for a pre-defined amount of time

This is a mono-repo including two packages: [contract](#contract) and [app](#app)

---

## Contract

[![Build Status](https://github.com/gnosis/token-lock/actions/workflows/ci.yml/badge.svg)](https://github.com/gnosis/token-lock/actions/workflows/ci.yml)
[![Coverage Status](https://coveralls.io/repos/github/gnosis/token-lock/badge.svg?branch=master)](https://coveralls.io/github/gnosis/token-lock)

A contract for locking balances of a designated ERC-20 token for a pre-defined amount of time after a deposit period.

1. **Deposit period:** Anyone can deposit the designated token, receiving an equivalent balance of non-transferrable lock claim token. Withdrawals are possible.
2. **Lock period:** No more deposits and withdrawals are possible.
3. **After the lock period:** Tokens can be withdrawn in redemption for lock claim tokens.

### Setup

We deploy the contract via the @openzeppelin/hardhat-upgrades plugin so it can be upgraded to modify its code, while preserving the address, state, and balances.

#### Configuration

The contract is initialized with the following set of parameters:

- `owner`: Address of the owner
- `token`: Address of the token to lock
- `depositDeadline`: Unix timestamp (seconds) of the deposit deadline,
- `lockDuration`: Lock duration in seconds, period starts after the deposit deadline
- `name`: Name of the token representing the claim on the locked token, e.g.: "Locked Gnosis"
- `symbol`: Symbol of the token representing the claim on the locked token, e.g.: "LGNO"

Before running any of the hardhat tasks below, make sure to create a .env file based on the provided .env.template file.

#### Initial deployment

Deploys the implementation contract and an upgradable proxy.
When run multiple times, it will create multiple proxies sharing the same implementation contract.

```
cd packages/contracts
yarn build
yarn deploy rinkeby \
  --owner <OWNER> \
  --token 0xd0dab4e640d95e9e8a47545598c33e31bdb53c7c \
  --deposit-deadline 1642498466 \
  --lock-duration 31536000 \
  --name 'Locked Gnosis' \
  --symbol LGNO
```

The task prints the addresses of the proxy and the implementation contracts, which you'll need for verification and future upgrades.
You can also find these values in .openzeppelin/<network>.json.

#### Verification

Verifies the implementation contract at the specified address in Etherscan.

```
cd packages/contracts
yarn verify rinkeby --implementation <IMPLEMENTATION_CONTRACT>
```

You still need to manually mark the proxy contract as a proxy on Etherscan.
This is done with a [simple click on a button](https://medium.com/etherscan-blog/and-finally-proxy-contract-support-on-etherscan-693e3da0714b) in Etherscan.

#### Upgrade

Deploys the latest version of the implementation contract (if necessary) and upgrades the existing proxy contract to use this one.

```
cd packages/contracts
yarn run upgrade rinkeby --proxy <PROXY_CONTRACT>
```

(Note that you must not omit `run`, because `upgrade` is also the name of a yarn command.)

### Solidity Compiler

The contracts have been developed with [Solidity 0.8.6](https://github.com/ethereum/solidity/releases/tag/v0.8.6). This version of Solidity made all arithmetic checked by default, therefore eliminating the need for explicit overflow or underflow (or other arithmetic) checks. This version of solidity was chosen as it allows to easily cast bytes to bytes4 and bytes32.

### Security and Liability

All contracts are WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.

---

## App

A front-end for the token lock contract based on next.js.

### Setup

#### Config

In local development you might want to connect the app to different contract instances on Rinkeby. To do this edit `CONTRACT_ADDRESSES` map in ./packages/app/config.ts

#### Start local dev server

```
cd packages/app
yarn install
yarn dev
```

---

## License

Created under the [LGPL-3.0+ license](LICENSE).
