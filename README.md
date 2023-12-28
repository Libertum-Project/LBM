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

## Version

All contracts compiled and tested using Solidity [v0.8.23](https://github.com/ethereum/solidity/releases/tag/v0.8.23). Primary LBM contract inherits OpenZeppelin v5.0.1's [ERC-20](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/ERC20.sol) token contract. All vesting contracts inherit OpenZeppelin v5.0.1's [VestingWallet](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/finance/VestingWallet.sol) contract.