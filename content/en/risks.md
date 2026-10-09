---
slug: risks
title: USDBOND Risk Factors — Regulatory, Liquidity and Peg Limits
description: Full risk disclosure for USDBOND covering possible recharacterization as a payment stablecoin, tokenized fund liquidity mismatch, and smart contract risk.
h1: Risk Factors
lead: Investing in USDB involves risk, including the possible loss of all principal. The principal risks are regulatory characterization risk, liquidity mismatch risk, the limits of the $1.00 peg, smart contract risk, airdrop execution risk, and tax risk. $1.00 is a NAV commitment at redemption, not a price guarantee in the secondary market.
nav: Risks
order: 6
updated: 2026-10-09
schema: Article
keywords: [USDBOND risks, stablecoin regulatory risk, tokenized fund liquidity mismatch, money market fund loss, smart contract risk, GENIUS Act risk]
---

> **Risk statement**: Investing involves risk, including the possible loss of all principal. SEC filings state explicitly: "It is possible to lose money by investing in a money market fund that seeks to maintain a stable share price." The risks listed on this page are not exhaustive; prospective investors should read the complete offering documents and consult professional advisers.

## Regulatory Characterization Risk

**If regulators characterize USDBOND as a "payment stablecoin" rather than a security, the GENIUS Act's yield prohibition would apply directly and the airdrop mechanism could be prohibited.**

The OCC implementation proposal adopts a broad reading of the yield prohibition, taking the view that arrangements in which affiliates or third parties provide yield indirectly may violate the GENIUS Act's prohibition. USDBOND must continuously ensure the compliance basis for its characterization as a security and closely monitor changes in regulatory interpretation.

In addition, the term "holder" is not defined in the GENIUS Act and the CLARITY Act discussion draft continues to evolve, leaving substantive uncertainty in the regulatory framework. Detailed compliance boundaries appear on the [Compliance](/en/compliance/) page.

## Liquidity Mismatch Risk

A tokenized fund permits daily redemption, but the underlying Treasuries still settle on a **T+1 basis**. Under market stress, the fund may face a timing gap between redemption pressure and asset liquidation.

BENJI's redemption mechanism is as follows: the holder sends tokens to a burn address and receives funds back, with the underlying assets held by the custodian and accounted for on a parallel basis.

**The Bank for International Settlements (BIS) has identified liquidity mismatch as a principal risk of tokenized money market funds.**

## Limits of the $1 Peg

**$1.00 is a NAV commitment at redemption, not a price guarantee in the secondary market.**

- USDB's secondary market price on decentralized exchanges may **deviate temporarily from $1.00** due to supply and demand.
- Rule 2a-7 permits the fund to take remedial action when the deviation between shadow NAV and amortized cost NAV exceeds **0.5%**, but under extreme market conditions a stable $1.00 net asset value is **not an absolute guarantee**.
- Remedial actions may include: shortening the average portfolio maturity, realizing gains and losses, withholding dividends, calculating NAV at market value, or, if necessary, **reducing the number of shares outstanding**. These measures affect holders differently.
- SEC filings state explicitly: "It is possible to lose money by investing in a money market fund that seeks to maintain a stable share price."

## Smart Contract Risk

On-chain congestion, smart contract vulnerabilities, and private key management issues in multi-signature custody can threaten asset security along dimensions that do not exist in traditional fund operations.

| Risk point | Explanation |
| - | - |
| **Contract vulnerabilities** | Logic flaws in the minting, snapshot, airdrop, or whitelist contracts can cause asset loss or erroneous distribution |
| **Private key management** | Loss or theft of a private key in multi-signature custody can result in loss of administrative control |
| **On-chain congestion** | Network congestion can delay transactions or cause gas costs to spike |
| **Cross-chain consistency** | Under multi-chain deployment, transfer agent records must remain consistent across chains, and cross-chain bridging introduces additional attack surface |

The airdrop contract **must undergo a third-party security audit**.

## Airdrop Execution Risk

The daily airdrop depends on **coordination between off-chain yield calculation and on-chain execution**. Oracle delays, data deviations, or technical failures at the snapshot time can result in:

- Inaccurate airdrop quantities
- Failed or delayed distributions
- A mismatch between the snapshot time and actual balances

## Tax Risk

**Daily airdrops may trigger continuing taxable events in most jurisdictions**, making holders' tax treatment complex.

- Each airdrop creates new token units whose value may be treated as taxable income.
- Daily distribution means **365 potential taxable events each year**, significantly increasing filing complexity.
- USDBOND's tax reporting obligations and holders' filing obligations must be disclosed clearly in the offering documents.

## Commercial and Market Risk

**Insufficient liquidity depth**: As a yield-bearing instrument, USDB's token may see far less secondary market trading demand than USDT/USDC — holders are more likely to hold it as a "savings instrument" than as a "medium of exchange," which limits trading volume and liquidity.

**Falling rates compress the value proposition**: If the Federal Reserve continues to cut rates and Treasury yields fall below 2%, USDB's net yield after the management fee may be only around 1.5%, and its appeal relative to zero-yield stablecoins would decline significantly.

**Distribution limits on a security token**: USDB's transfers are restricted by securities law and occur only between whitelisted addresses, which limits its access to public liquidity pools on decentralized exchanges and its integration with DeFi protocols that do not perform KYC verification.

**The scale threshold of the earnings model**: USDB earns through a management fee; at a 0.15% management fee, generating $10 million in annual revenue requires roughly **$6.7 billion** in assets under management. Its earnings efficiency will be far lower than that of USDT and USDC at early scale.

## Risk Factors at a Glance

| Risk category | Core content | Possible consequence |
| - | - | - |
| **Regulatory characterization** | Recharacterization as a payment stablecoin | The yield prohibition applies directly; the airdrop mechanism could be prohibited |
| **Liquidity mismatch** | Daily redemption versus T+1 Treasury settlement | Redemption delays under market stress |
| **$1 peg** | Secondary market price may deviate from $1.00 | Sale at a discount; loss of principal |
| **Smart contract** | Vulnerabilities, private key management, on-chain congestion | Asset loss or failed distribution |
| **Airdrop execution** | Oracle delays, data deviations, snapshot failures | Inaccurate or failed airdrops |
| **Tax** | Daily airdrops constitute continuing taxable events | Complex filing; uncertain tax burden |
| **Market** | Insufficient liquidity depth, falling rates | Narrowing value proposition; difficulty exiting |
| **Distribution limits** | Securities transfer restrictions, limited DeFi integration | Restricted use cases and usability |

## Risk Questions

### Q: Can holding USDB result in a loss of principal?

Yes, it is possible. $1.00 is a NAV commitment at redemption, not a price guarantee in the secondary market. USDB's secondary market price may deviate temporarily from $1.00 due to supply and demand, and under extreme market conditions a stable $1.00 net asset value is not an absolute guarantee. SEC filings state explicitly: "It is possible to lose money by investing in a money market fund that seeks to maintain a stable share price."

### Q: What is the biggest risk for USDBOND?

Regulatory characterization risk. If regulators characterize USDBOND as a "payment stablecoin" rather than a security, the GENIUS Act's yield prohibition would apply directly and the daily airdrop mechanism could be prohibited. The OCC implementation proposal adopts a broad reading of the yield prohibition, effectively closing the "affiliate loophole."

### Q: Do the daily airdrops create tax problems?

Yes. In most jurisdictions, daily airdrops may be treated as continuing taxable events — each airdrop creates new token units whose value may be treated as taxable income, producing 365 potential taxable events each year. Holders' filing obligations vary by jurisdiction and should be discussed with a professional tax adviser.

### Q: Can USDB be redeemed at any time?

A tokenized fund permits daily redemption, but the underlying Treasuries settle on a T+1 basis. Under market stress, the fund may face a timing gap between redemption pressure and asset liquidation. The Bank for International Settlements (BIS) has identified liquidity mismatch as a principal risk of tokenized money market funds.

### Q: Can USDB be traded on decentralized exchanges?

Only to a very limited extent. As a 1940 Act registered fund share, USDB's transfers are restricted by securities law and occur only between eligible addresses that have completed KYC/AML and been whitelisted. This limits its access to public liquidity pools on decentralized exchanges and its integration with DeFi protocols that do not perform KYC verification.

## Disclaimer

This whitepaper is provided for informational purposes only and does not constitute an offer to sell securities or investment advice. The offer and sale of USDB shares are subject to applicable securities laws and regulations. Prospective investors should read the offering documents carefully and consult professional advisers before making any investment decision.
