# Libertum (LBM) Contracts

## Installation and Setup

This repository was built using Hardhat [v2.22.2](https://www.npmjs.com/package/hardhat/v/2.22.2). To install the required dependencies:

```sh
npm i
```

To run the unit tests for the primary LBM contract and accompanying vesting contracts:

```sh
npx hardhat test
```

## Compiler and Inherited Contracts

All contracts compiled and tested using Solidity [v0.8.25](https://github.com/ethereum/solidity/releases/tag/v0.8.25). The `optimizer` is currently set to 1,000 runs in anticipation of medium-high frequency of runtime execution (in exchange for higher deployment costs) over this contract's lifespan.

Primary LBM contract inherits OpenZeppelin's (v5.0.1) [ERC-20](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/ERC20.sol) token contract. All vesting contracts inherit OpenZeppelin's (v5.0.1) [VestingWallet](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/finance/VestingWallet.sol) contract.

## Tokenomics

LBM tokens are minted and vested according to the following tokenomics:

| **Purpose**      | **Type**         | **Token Proportion** | **Token Allocation** | **Vesting**                                  |
| ---------------- | ---------------- | -------------------- | -------------------- | -------------------------------------------- |
| Core Team        | Vesting Contract | 25%                  | 50,000,000           | 12 month cliff, linear unlock over 48 months |
| Treasury Reserve | Wallet           | 25%                  | 50,000,000           | Unvested                                     |
| Staking Rewards  | Wallet           | 4%                   | 8,000,000            | Unvested                                     |
| Marketing        | Wallet           | 3%                   | 6,000,000            | Unvested                                     |
| Ecosystem        | Wallet           | 14%                  | 28,000,000           | Unvested                                     |
| Token Sale       | Wallet           | 29%                  | 58,000,000           | Unvested                                     |

There is a total supply of **200,000,000** LBM tokens.
