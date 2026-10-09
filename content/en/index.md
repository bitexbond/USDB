---
slug: index
title: USDBOND (USDB) — On-Chain Stable Equity, Daily Treasury Yield
description: USDBOND (USDB) is a registered investment company share backed by short-term US Treasuries, holding a constant $1.00 NAV and airdropping T-bill yield daily.
h1: On-Chain Stable Equity
lead: USDBOND (token ticker USDB) is an on-chain stable equity — an instrument backed by short-term US Treasuries whose shares are characterized as registered investment company shares under the Investment Company Act of 1940, each maintaining a constant $1.00 NAV under the Rule 2a-7 amortized cost method and airdropping Treasury yield to eligible holder wallets every day, 365 days a year.
nav: Home
order: 1
updated: 2026-10-09
schema: WebPage
keywords: [USDBOND, USDB, on-chain stable equity, tokenized Treasuries, yield-bearing stablecoin, Investment Company Act of 1940, Rule 2a-7, daily airdrop]
heroStats:
  - value: $1.00
    label: Constant NAV
    note: Rule 2a-7 amortized cost method
  - value: 365 days
    label: Annual daily distributions
    note: Including weekends and holidays
  - value: ~3.35%
    label: Net annualized yield
    note: Based on a 3.5% Treasury yield less a 0.15% management fee
  - value: 0.15%
    label: Annualized management fee
    note: The issuer's only source of revenue
---

## What Is USDBOND?

USDBOND is an **on-chain stable equity**. It combines three things in a single token: the legal characterization of a registered investment company share under the Investment Company Act of 1940, a constant $1.00 net asset value maintained under the Rule 2a-7 amortized cost method, and on-chain yield distribution through daily airdrops of newly minted tokens.

> **One-sentence definition**: USDBOND is an on-chain yield-bearing instrument backed by short-term US Treasuries, whose shares are characterized as registered investment company shares, each pegged at a constant $1.00, and which airdrops Treasury yield to eligible holders every day.

USDBOND is **not a payment stablecoin**. USDB is a registered investment company share under the Investment Company Act of 1940 and is therefore a security. Its payment function is a secondary application of a security share within a restricted-transfer framework; it does not change its characterization as a security, nor does it trigger the GENIUS Act's prohibition on yield paid by payment stablecoin issuers.

## Core Mechanism: Constant $1.00 Plus New-Token Airdrops

USDBOND uses neither rebasing nor NAV appreciation. Every USDB is permanently pegged to $1.00; Treasury yield does not change the token price but is distributed by **minting new USDB daily and airdropping it to eligible holder wallets**.

| Step | Mechanism |
| - | - |
| **NAV maintenance** | Rule 2a-7 amortized cost method; NAV is constant at $1.00 per share |
| **Yield source** | Short-term US Treasuries maturing within 93 days and Treasury-collateralized repurchase agreements |
| **Yield distribution** | New USDB minted daily and airdropped to eligible addresses in proportion to holdings |
| **Distribution frequency** | 365 days a year, including weekends and holidays |
| **Holder action required** | No staking, no lock-up, no manual claim |
| **Issuer revenue** | Management fee (e.g., 0.15% annualized) rather than the reserve spread |
| **Eligibility** | Holding addresses that have completed KYC/AML and been whitelisted at the snapshot |

Yield is distributed using the following formula:

**Daily airdrop USDBᵢ = Holding USDBᵢ × (Fund daily net income ÷ Total fund shares outstanding) × (1 − Management fee rate)**

## Key Facts

| Item | Detail |
| - | - |
| **Token ticker** | USDB |
| **Legal characterization** | Registered investment company share under the Investment Company Act of 1940 (a security) |
| **Valuation method** | Rule 2a-7 amortized cost method |
| **Target NAV** | Constant $1.00 NAV |
| **Underlying assets** | Short-term US Treasuries with remaining maturity of 93 days or less; Treasury-collateralized repurchase agreements |
| **Government securities requirement** | ≥ 99.5% of total assets |
| **Weighted average maturity (WAM)** | ≤ 60 days |
| **Weighted average life (WAL)** | ≤ 120 days |
| **Remaining maturity of a single instrument** | ≤ 397 days |
| **Shadow NAV remediation threshold** | The board must consider remedial action when the deviation from $1.00 exceeds 0.5% |
| **Snapshot time** | Daily at UTC 00:00 |
| **Management fee rate** | 0.15% annualized (illustrative) |
| **Planned deployment networks** | Ethereum, Solana, Polygon, Base |
| **Reference precedents** | Franklin Templeton BENJI / FOBXX, BlackRock BUIDL |

## Why Yield Ownership Has Been Flipped

The USDT and USDC business models are essentially two variants of one logic: **the issuer allocates user-deposited dollars to yield-bearing assets such as short-term Treasuries, captures all of the interest income, and distributes none of it to holders.** Users receive a payment instrument, not an investment instrument.

USDBOND flips this relationship:

| Dimension | USDT (Tether) | USDC (Circle) | USDB (USDBOND) |
| - | :-: | :-: | :-: |
| **Core revenue model** | Retains the full reserve spread | Reserve spread, with roughly 60%+ paid to distribution channels | Management fee (e.g., 0.15% annualized); yield belongs to holders |
| **Yield distributed to holders** | 0% | 0% | ~3.35% (after the management fee) |
| **Distribution cost as a share of revenue** | Minimal | ~62% | Minimal (direct holdings within the whitelist) |
| **Regulatory characterization** | Offshore entity; high regulatory uncertainty | US compliance benchmark; NYSE-listed | Registered investment company share under the 1940 Act |

USDT and USDC together control more than 82% of the stablecoin market, with roughly $257.7 billion in circulating supply. Almost all of those funds earn zero yield. USDB does not need to beat the duopoly on payment functionality — it only needs to become the **yield-bearing parking place** for on-chain dollar holders.

## The Regulatory Window: GENIUS Act and CLARITY Act

The US GENIUS Act (signed in July 2025) explicitly prohibits payment stablecoin issuers from paying interest or yield to holders, but that prohibition **does not apply to 1940 Act registered fund shares**. The CLARITY Act now under consideration extends the yield prohibition further to intermediaries such as exchanges, banning rewards that are "economically or functionally equivalent to interest on a bank deposit."

This means the room for USDT and USDC to pass yield to users through exchange "rewards" is narrowing, while USDB, as a registered fund share, distributes yield as a lawful fund dividend.

> **Risk notice**: The GENIUS Act's definition of "payment stablecoin" turns on whether the instrument serves as a means of payment or settlement and whether the issuer promises redemption at a fixed monetary value. If regulators characterize USDBOND as a payment stablecoin, the yield prohibition would apply directly. See [Risk Factors](/en/risks/) for details.

## Consistency With Proven Precedents

USDBOND's mechanism follows the operating model of the Franklin Templeton BENJI / FOBXX funds:

- BENJI distributes yield by **minting new BENJI tokens daily and airdropping them directly to shareholder wallets**, not through NAV changes.
- BENJI's **daily on-chain dividend distributions run 365 days a year, including weekends and holidays**.
- BENJI's minimum investment is only **$20**, with a 7-day annualized yield of **3.55%**; BlackRock BUIDL yields approximately **3.42%**.
- The SEC permitted that registered fund to use the on-chain BENJI system for cash management through a no-action letter, relying on Section 17(f) of the 1940 Act and Rule 17f-2, and recognized a hybrid transfer agent arrangement combining off-chain books with on-chain records.

## Getting Started

- [Read the full whitepaper](/en/whitepaper/) — legal architecture, value stability mechanism, yield distribution, technical architecture, and compliance framework
- [Understand the daily airdrop mechanism](/en/yield/) — snapshots, the calculation formula, the definition of eligible holders, and the execution process
- [Compare USDT / USDC / USDB](/en/comparison/) — business models and value comparison across three dollar tokens
- [Review the FAQ](/en/faq/) — 27 high-frequency questions and answers about USDBOND

## Frequently Asked Questions

### Q: What is USDBOND?

USDBOND (token ticker USDB) is an on-chain stable equity — an on-chain yield-bearing instrument backed by short-term US Treasuries whose shares are characterized as registered investment company shares under the Investment Company Act of 1940. Every USDB maintains a constant $1.00 NAV under the Rule 2a-7 amortized cost method and airdrops Treasury yield to eligible holders daily.

### Q: Is USDB a stablecoin?

No. USDB is a registered investment company share under the Investment Company Act of 1940 and is a security, not a payment stablecoin. It has the characteristics of a constant $1.00 net asset value and can be used for payments and settlement between whitelisted addresses that have completed KYC/AML, but that payment function is a secondary application of a security share within a restricted-transfer framework and does not change its characterization as a security.

### Q: How much yield does holding USDB earn?

Based on a 3.5% short-term US Treasury yield less a 0.15% annualized management fee, net annualized yield is approximately **3.35%**. By comparison, holding USDT or USDC earns **0%**. On a $1 million principal, USDB generates approximately $33,500 in additional income each year.

### Q: How is yield paid?

Yield is airdropped to eligible holder wallets as **newly minted USDB tokens each day**, running 365 days a year including weekends and holidays. Holders need not stake, lock, or claim anything; yield arrives in the wallet automatically.

### Q: Who is eligible for airdrops?

The eligible users for airdrops are the USDB holding addresses that are eligible at the time of the airdrop. An address must simultaneously: have completed KYC/AML verification with the transfer agent and be whitelisted; hold a USDB balance greater than zero at the daily UTC 00:00 snapshot; not be in a lock-up period, frozen status, or on a sanctions list; and not be located in a restricted jurisdiction. USDB held by ineligible addresses remains redeemable at principal ($1.00 per token) but earns no airdrop.

### Q: What are the risks of USDBOND?

The principal risks are regulatory characterization risk (if characterized as a payment stablecoin, the yield prohibition would apply directly), liquidity mismatch risk, the fact that the $1 peg is not an absolute guarantee in the secondary market, smart contract risk, airdrop execution risk, and tax risk, since daily airdrops may constitute a continuing taxable event in most jurisdictions. The full list appears on the [Risk Factors](/en/risks/) page.
