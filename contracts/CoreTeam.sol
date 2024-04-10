// SPDX-License-Identifier: MIT
pragma solidity 0.8.25;

import "@openzeppelin/contracts/finance/VestingWallet.sol";

contract CoreTeam is VestingWallet {
    constructor(
        address beneficiary
    )
        VestingWallet(
            beneficiary,
            uint64(block.timestamp) + 12 * 30 days,
            uint64(48 * 30 days)
        )
    {}
}
