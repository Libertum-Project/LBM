# Libertum (LBM) Contracts

## Installation and Setup

This repository was built using Hardhat [v2.19.4](https://www.npmjs.com/package/hardhat/v/2.19.4). To install the required dependencies:

```sh
npm i
```

To run the unit tests for the primary LBM contract and accompanying vesting contracts:

```sh
npx hardhat test
```

## Compiler and Inherited Contracts

All contracts compiled and tested using Solidity [v0.8.23](https://github.com/ethereum/solidity/releases/tag/v0.8.23). The `optimizer` is currently set to 1,000 runs in anticipation of medium-high frequency of runtime execution (in exchange for higher deployment costs) over this contract's lifespan.

Primary LBM contract inherits OpenZeppelin's (v5.0.1) [ERC-20](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/ERC20.sol) token contract. All vesting contracts inherit OpenZeppelin's (v5.0.1) [VestingWallet](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/finance/VestingWallet.sol) contract.

## Tokenomics

LBM tokens are minted and vested according to the following tokenomics:

| **Purpose**         | **Type**                                                   | **Token Proportion** | **Token Allocation** | **Vesting**                                        |
| ------------------- | ---------------------------------------------------------- | -------------------- | -------------------- | -------------------------------------------------- |
| Treasury Reserve    | Wallet                                                     | 35%                  | 70,000,000           | Fully unlocked                                     |
| Core Team           | Vesting Contract                                           | 25%                  | 50,000,000           | 12 month cliff, linear unlock over 48 months after |
| Presale             | Wallet (before being sent to Presale Exchange contract)    | 6%                   | 12,000,000           | Fully unlocked                                     |
| CEX Listing         | Wallet                                                     | 10%                  | 20,000,000           | Fully unlocked                                     |
| Liquidity           | Wallet (before being sent to and locked in liquidity pool) | 1%                   | 2,000,000            | Fully unlocked                                     |
| Staking Rewards     | Wallet (before being sent to Staking contract)             | 4%                   | 8,000,000            | Fully unlocked                                     |
| Ambassador Program  | Vesting Contract                                           | 3%                   | 6,000,000            | 6 month cliff, linear unlock over 24 months after  |
| Marketing           | Vesting Contract                                           | 2%                   | 4,000,000            | 6 month cliff, linear unlock over 24 months after  |
| Airdrop             | Vesting Contract                                           | 1%                   | 2,000,000            | 1 month cliff, 100% unlocked after                 |
| Advisors            | Vesting Contract                                           | 1%                   | 2,000,000            | 6 month cliff, linear unlock over 36 months after  |
| Project Development | Wallet                                                     | 2%                   | 4,000,000            | Fully unlocked                                     |
| Private Investment  | Vesting Contract                                           | 10%                  | 20,000,000           | 12 month cliff, linear unlock over 36 months after |

There is a total supply of **200,000,000** LBM tokens.
