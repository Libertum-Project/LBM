// SPDX-License-Identifier: MIT
pragma solidity 0.8.25;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract LBM is ERC20 {
    constructor(
        address coreTeam, // VestingWallet Contract
        address treasuryReserve, // Treasury Wallet
        address stakingRewards, // Staking Rewards Wallet
        address marketing, // Marketing Wallet
        address ecosystem, // Ecosystem Wallet
        address tokenSale // Token Sale
    ) ERC20("Libertum", "LBM") {
        _mint(coreTeam, 50_000_000 * 10 ** decimals());
        _mint(treasuryReserve, 50_000_000 * 10 ** decimals());
        _mint(stakingRewards, 8_000_000 * 10 ** decimals());
        _mint(marketing, 6_000_000 * 10 ** decimals());
        _mint(ecosystem, 28_000_000 * 10 ** decimals());
        _mint(tokenSale, 58_000_000 * 10 ** decimals());
    }
}
