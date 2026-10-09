---
slug: yield
title: USDB Yield Mechanics — 365 Days of Daily Treasury Airdrops
description: USDBOND distributes yield through a constant $1.00 NAV plus daily airdrops of newly minted USDB, covering snapshot timing, airdrop formula, and eligibility.
h1: Yield Distribution Mechanics
lead: USDBOND distributes yield as newly minted USDB tokens airdropped to eligible holder wallets, running 365 days a year including weekends and holidays. Every USDB maintains a constant $1.00 NAV, Treasury interest does not change the token price, and holders need not stake, lock, or claim anything.
nav: Yield Mechanics
order: 3
updated: 2026-10-09
schema: Article
keywords: [USDB yield, daily airdrop, 365-day distribution, snapshot mechanism, eligible holders, Treasury yield distribution, constant NAV]
---

## Core Design: Constant $1.00 Plus New-Token Airdrops

USDBOND distributes yield using a **constant NAV plus newly minted USDB airdrop** model. Every USDB remains pegged at $1.00; Treasury interest does not change the token price but is distributed by minting new USDB tokens daily and airdropping them to eligible holder wallets.

This means USDB **does not** adopt any of the following common models:

| Model | Adopted by USDBOND | Explanation |
| - | :-: | - |
| **Rebasing (elastic supply)** | No | Does not alter the relationship between the token balance in a holder's wallet and the unit price |
| **NAV appreciation (rising share price)** | No | The share price is constant at $1.00 and does not rise as yield accrues |
| **Staking / lock-up yield** | No | No staking, lock-up, or manual claim required |
| **Manual claim** | No | Yield arrives in the wallet automatically |
| **New-token airdrops** | **Yes** | New USDB is minted daily and airdropped to eligible holder addresses |

### Consistency With Franklin Templeton BENJI

USDBOND's mechanism is identical to BENJI's:

- BENJI distributes yield by **minting new BENJI tokens daily and airdropping them directly to shareholder wallets**, not through NAV changes.
- BENJI's **daily on-chain dividend distributions run 365 days a year, including weekends and holidays**.
- BENJI yield **accrues on a per-second basis** as tokens are transferred.
- BENJI is the only tokenized money market fund currently capable of daily on-chain dividend distribution 365 days a year.

WisdomTree's WTGXX has also introduced **continuous dividend accrual**, allowing shares to allocate daily income according to how long each verified wallet has held tokens, using blockchain timestamps to track intraday transfers.

## The Three Prerequisites for 365-Day Continuous Operation

Traditional money market funds generally distribute dividends on **business days**. USDBOND is designed to **distribute every day, 365 days a year**, including weekends and holidays. This requires the following three mechanisms to hold simultaneously:

| Mechanism | Requirement |
| - | - |
| **Daily accrual of off-chain yield** | Treasury interest accrues daily; even on non-trading days the interest continues to accrue (Treasury interest is calculated on an actual-days basis, including weekends and holidays) |
| **Daily execution of on-chain minting** | The smart contract executes one minting and airdrop operation each day, unrestricted by the traditional financial market trading calendar |
| **Daily synchronization of rate data** | Accrued yield rates are synchronized on-chain daily through an oracle or an off-chain calculation engine |

## Airdrop Calculation Formula

The quantity of USDB airdropped each day is calculated as follows:

**Daily airdrop USDBᵢ = Holding USDBᵢ × (Fund daily net income ÷ Total fund shares outstanding) × (1 − Management fee rate)**

The terms in the formula mean:

| Variable | Definition |
| - | - |
| **Holding USDBᵢ** | The USDB balance of eligible address i at the snapshot |
| **Fund daily net income** | The fund's Treasury interest income for the day less operating expenses |
| **Total fund shares outstanding** | The total quantity of USDB outstanding at the snapshot |
| **Management fee rate** | The annualized management fee (e.g., 0.15%), deducted on a daily pro-rata basis |

### Yield Illustration

Based on a current short-term US Treasury yield of approximately **3.5%** and an annualized management fee of **0.15%**:

| Principal | Net annualized yield | Annual income | Versus USDT/USDC |
| - | :-: | :-: | :-: |
| $10,000 | ~3.35% | ~$335 | +$335 |
| $100,000 | ~3.35% | ~$3,350 | +$3,350 |
| $1,000,000 | ~3.35% | ~$33,500 | +$33,500 |
| $10,000,000 | ~3.35% | ~$335,000 | +$335,000 |

Holding USDT or USDC over the same period yields **0%**. The table above is an illustration based on a fixed yield rate; actual yield varies daily with Treasury yields and fund net income and does not constitute a yield commitment.

## Definition of Eligible Holders

**The eligible users for airdrops are the USDB holding addresses that are eligible at the time of the airdrop.** Eligibility is determined by status at the snapshot time, not by the time of subscription or the length of the holding history.

### Snapshot Time

A snapshot of on-chain USDB holding addresses is taken daily at **UTC 00:00** (or another fixed time determined by protocol governance).

### Eligibility Conditions

An address must satisfy all of the following conditions simultaneously:

1. It has completed **KYC/AML verification** with the transfer agent and has been **whitelisted**.
2. It holds a USDB token balance at the snapshot time (balance > 0).
3. It is not under a **lock-up, freeze, or sanctions list** designation.
4. It is not located in a restricted jurisdiction.

### Treatment of Ineligible Addresses

Wallet addresses that have not passed KYC, sanctioned addresses, and addresses expressly excluded by protocol governance are not eligible for airdrops. **USDB held by ineligible addresses remains redeemable at principal ($1.00 per token) but earns no yield airdrop.**

> **Why it is designed this way**: USDB is a registered investment company share under the Investment Company Act of 1940 and is a security. Yield can be distributed only to eligible holders that have completed KYC/AML verification; this is a component of the securities law compliance architecture, not an optional operating policy.

## Airdrop Execution Process

The daily airdrop is completed through coordination of off-chain yield calculation and on-chain execution, in five steps:

| Step | Environment | Detail |
| - | - | - |
| **1. Yield calculation** | Off-chain | The fund administrator calculates the day's accrued Treasury interest and deducts the management fee to arrive at distributable net income |
| **2. Snapshot** | On-chain | At the scheduled snapshot time, the smart contract records the USDB balances of all eligible addresses |
| **3. Minting** | On-chain | Based on the yield calculation and snapshot results, the smart contract calls the `mint` function to mint the corresponding quantity of new USDB into a pool of addresses pending distribution |
| **4. Airdrop** | On-chain | The smart contract distributes the new USDB to eligible holder wallets in proportion to each address's holdings, by batch transfer or Merkle distribution |
| **5. Record update** | On-chain | The transfer agent updates the official shareholder register to reflect the newly issued shares |

The airdrop is executed by **batch transfer** or **Merkle distribution** to optimize gas costs.

## Smart Contract Interface

```
function dailySnapshot() external onlyOperator {
    // Record eligible address balances at UTC 00:00
    // Generate snapshot data for use by the airdrop
}

function mintAndAirdrop(uint256 dailyYield, bytes32 snapshotRoot) external onlyOperator {
    // Mint new USDB into the distribution pool
    // Batch airdrop to eligible addresses using the snapshot data
}

function isEligible(address account) public view returns (bool) {
    // Check whether the address is whitelisted
    // Check whether the address is sanctioned
    // Check whether the address is in a restricted jurisdiction
}
```

## Airdrop Execution Risk

The daily airdrop depends on coordination between off-chain yield calculation and on-chain execution. **Oracle delays, data deviations, or technical failures at the snapshot time can result in inaccurate airdrop quantities or failed distributions.** The airdrop contract must undergo a third-party security audit. The complete risk list appears on the [Risk Factors](/en/risks/) page.

## Frequently Asked Questions

### Q: How much yield does holding USDB earn?

Based on a 3.5% short-term US Treasury yield less a 0.15% annualized management fee, net annualized yield is approximately 3.35%. Actual yield varies with Treasury yields and the fund's daily net income and does not constitute a yield commitment.

### Q: Does USDB yield require staking or locking?

No. Holders need not stake, lock, or claim anything; yield arrives in the wallet automatically as newly minted USDB tokens airdropped daily. USDB uses neither staking-based yield nor a manual claim model.

### Q: When does the USDB airdrop occur each day?

A snapshot of on-chain USDB holding addresses is taken daily at **UTC 00:00**, followed by yield calculation, minting, and the airdrop. Distributions run 365 days a year, including weekends and holidays.

### Q: Is yield distributed on weekends and holidays?

Yes. USDBOND is designed to distribute every day, 365 days a year. Treasury interest is calculated on an actual-days basis, including weekends and holidays, so interest continues to accrue even on non-trading days, and on-chain minting is not restricted by the traditional financial market trading calendar.

### Q: What is the difference between rebasing and an airdrop?

Rebasing changes the token price or the relationship between a holder's balance and the price; USDBOND keeps every USDB pegged at a constant $1.00 and airdrops yield to eligible holders in the form of **newly minted** tokens, leaving both the quantity and the unit price of existing tokens unchanged.

### Q: If I do not complete KYC, can I still hold USDB?

USDB held by ineligible addresses remains redeemable at principal ($1.00 per token) but earns no yield airdrop. Airdrop eligibility requires that the address has completed KYC/AML verification at the snapshot, been whitelisted, not be under a lock-up, freeze, or sanctions designation, and not be located in a restricted jurisdiction.

### Q: How is airdrop yield calculated?

Daily airdrop USDBᵢ = Holding USDBᵢ × (Fund daily net income ÷ Total fund shares outstanding) × (1 − Management fee rate). That is, the qualified address's share of total fund shares outstanding at the snapshot is applied to the day's net income after the management fee.
