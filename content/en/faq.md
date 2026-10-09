---
slug: faq
title: USDB FAQ — What USDB Is, How Yield Is Calculated, Compliance
description: USDBOND (USDB) FAQ covering product definition, differences from USDT and USDC, daily airdrop yield, KYC whitelist eligibility, and GENIUS Act compliance.
h1: Frequently Asked Questions
lead: This page collects 27 frequently asked questions about USDBOND (USDB), covering product definition, yield mechanics, compliance eligibility, differences from stablecoins, and risk disclosure. Every answer leads with the conclusion for quick reference.
nav: FAQ
order: 7
updated: 2026-10-09
schema: FAQPage
keywords: [USDBOND FAQ, USDB FAQ, what is USDB, yield-bearing stablecoin, tokenized Treasury yield, how to buy USDB, USDB yield calculation]
---

## Product Definition

### Q: What is USDBOND?

USDBOND (token ticker USDB) is an **on-chain stable equity** — an on-chain yield-bearing instrument backed by short-term US Treasuries whose shares are characterized as registered investment company shares under the Investment Company Act of 1940. Every USDB maintains a constant $1.00 NAV under the Rule 2a-7 amortized cost method and airdrops Treasury yield to eligible holders every day, 365 days a year.

### Q: Is USDB a stablecoin?

**No.** USDB is a registered investment company share under the Investment Company Act of 1940 and is a **security**, not a payment stablecoin. It has the characteristics of a constant $1.00 net asset value and can be used for payments and settlement between whitelisted addresses that have completed KYC/AML, but that payment function is a secondary application of a security share within a restricted-transfer framework and does not change its characterization as a security.

### Q: How does USDB differ from USDT and USDC?

The core difference is **yield ownership**. USDT and USDC allocate user deposits to short-term Treasuries and capture all of the interest, distributing **0%** to holders. USDB reverses that relationship: Treasury yield (approximately **3.35%** after a roughly 0.15% management fee) is airdropped daily to holders, and the issuer earns through a management fee rather than the reserve spread. The full comparison appears on the [Comparison](/en/comparison/) page.

### Q: Is USDB a replacement for or a complement to stablecoins?

It is a **direct replacement**, but with a different positioning. USDB does not need to beat USDT or USDC on payment functionality — it only needs to become the **"yield-bearing parking place"** for on-chain dollar holders rather than an "everyday payment instrument." USDT and USDC together control more than 82% of the stablecoin market with roughly $257.7 billion in circulating supply, and almost all of those funds earn zero yield.

### Q: What are USDBOND's underlying assets?

The underlying assets are **short-term US Treasuries with a remaining maturity of 93 days or less** and Treasury-collateralized repurchase agreements, held by a qualified custodian bank and bankruptcy-remote from the fund operating entity. As a government money market fund under Rule 2a-7, the portfolio must satisfy: government securities at ≥ 99.5% of assets, weighted average maturity (WAM) ≤ 60 days, weighted average life (WAL) ≤ 120 days, and remaining maturity of any single instrument ≤ 397 days.

### Q: What does "on-chain stable equity" mean?

"On-chain" means the shares are issued and recorded as tokens on public blockchains; "stable" means each share maintains a constant $1.00 NAV under the Rule 2a-7 amortized cost method; "equity" means its legal characterization is that of a **registered investment company share** under the Investment Company Act of 1940 — a security, not a deposit, a debt claim, or a payment instrument. Together the three terms describe an on-chain instrument with a stable price whose legal nature is a security and which distributes Treasury yield daily.

## Yield Mechanics

### Q: How much yield does holding USDB earn?

Based on a 3.5% short-term US Treasury yield less a 0.15% annualized management fee, net annualized yield is approximately **3.35%**. On $1 million in principal, that produces approximately **$33,500** in additional income each year. Actual yield varies with Treasury yields and the fund's daily net income and does not constitute a yield commitment.

### Q: How is USDB yield paid?

Yield is airdropped to eligible holder wallets as **newly minted USDB tokens each day**, running **365 days** a year including weekends and holidays. Holders need not stake, lock, or claim anything; yield arrives in the wallet automatically.

### Q: Why does USDB not use rebasing or NAV appreciation?

Because USDBOND keeps every USDB pegged at a constant $1.00. Rebasing changes the relationship between a holder's balance and the price, and NAV appreciation makes the share price rise as yield accrues. USDBOND takes a third path: the price stays constant and yield is airdropped in the form of **newly minted tokens**, leaving both the quantity and the unit price of existing tokens unchanged.

### Q: Is yield distributed on weekends and holidays?

**Yes.** Treasury interest is calculated on an actual-days basis, including weekends and holidays, so interest continues to accrue even on non-trading days, and on-chain minting is not restricted by the traditional financial market trading calendar. USDBOND is designed to distribute every day, 365 days a year, a capability validated by the Franklin Templeton BENJI fund, whose daily on-chain dividend distributions run 365 days a year.

### Q: How is the daily airdrop quantity calculated?

The formula is: **Daily airdrop USDBᵢ = Holding USDBᵢ × (Fund daily net income ÷ Total fund shares outstanding) × (1 − Management fee rate)**. That is, the qualified address's share of total fund shares outstanding at the snapshot is applied to the day's net income after the management fee. See the [Yield Mechanics](/en/yield/) page for details.

### Q: When does the snapshot occur?

A snapshot of on-chain USDB holding addresses is taken daily at **UTC 00:00** (or another fixed time determined by protocol governance). Airdrop eligibility is determined by **status at the snapshot time**, not by the time of subscription or the length of the holding history.

## Compliance and Eligibility

### Q: Who is eligible for airdrops?

The eligible users for airdrops are the **USDB holding addresses that are eligible at the time of the airdrop**. An address must simultaneously: have completed **KYC/AML verification** with the transfer agent and be **whitelisted**; hold a USDB balance greater than zero at the snapshot; not be in a lock-up period, frozen status, or on a sanctions list; and not be located in a restricted jurisdiction.

### Q: What happens to USDB held by ineligible addresses?

USDB held by ineligible addresses **remains redeemable at principal ($1.00 per token) but earns no yield airdrop**. Wallet addresses that have not passed KYC, sanctioned addresses, and addresses expressly excluded by protocol governance are not eligible for airdrops.

### Q: Why is USDB's yield distribution not subject to the GENIUS Act's yield prohibition?

Because the GENIUS Act prohibits **payment stablecoin issuers** from paying interest or yield to holders, and USDB is not a payment stablecoin but a 1940 Act registered investment company share. Its yield distribution is a **lawful fund dividend** and does not fall within the prohibition. This path has been validated by the live operation of the Franklin Templeton BENJI / FOBXX funds, and the SEC has recognized its on-chain system and hybrid transfer agent arrangement through a no-action letter.

### Q: How does the OCC implementation proposal affect USDBOND?

The GENIUS Act implementation rulemaking proposal (NPRM) published by the OCC on **February 25, 2026** adopts a **broad reading** of the yield prohibition, taking the view that arrangements in which affiliates or third parties provide yield indirectly are inconsistent with the prohibition and effectively closing the so-called "affiliate loophole." USDB's payment function must therefore be designed as a **limited, compliant, whitelist-only securities transfer function** rather than a public, permissionless payment instrument.

### Q: Can USDB be transferred freely or traded on a DEX?

**No.** As a security, USDB's transfers are subject to securities law transfer restrictions and occur only between eligible addresses that have completed KYC/AML and been whitelisted; no permissionless payment or circulation is opened to unverified addresses. This limits its access to public liquidity pools on decentralized exchanges.

### Q: How do the smart contracts enforce compliance requirements?

Through a whitelist mechanism enforced at the protocol layer. The contract exposes an `isEligible(address)` query that checks whether an address is whitelisted, whether it is sanctioned, and whether it is located in a restricted jurisdiction. The whitelist is controlled by the licensed transfer agent, which also controls the permission list, the smart contract administrative privileges, and the final records.

### Q: What securities law requirements apply to the issuance of USDB?

USDB shares are registered investment company shares under the 1940 Act and are securities. Issuance must comply with the registration requirements of the **Securities Act of 1933** or an applicable exemption, and transfers must comply with securities law transfer restrictions. The whitelist mechanism at the smart contract level is **a core component of the Section 5 securities law compliance architecture** — permitting transfers only between eligible addresses and enforcing the conditions of the issuance exemption at the protocol layer.

## Redemption, Tax and Risk

### Q: Can USDB be redeemed at any time?

A tokenized fund **permits daily redemption**, but the underlying Treasuries still settle on a **T+1 basis**. Under market stress, the fund may face a timing gap between redemption pressure and asset liquidation. The Bank for International Settlements (BIS) has identified liquidity mismatch as a principal risk of tokenized money market funds.

### Q: Is the $1.00 price guaranteed?

**$1.00 is a NAV commitment at redemption, not a price guarantee in the secondary market.** USDB's secondary market price on decentralized exchanges may deviate temporarily from $1.00 due to supply and demand. Rule 2a-7 permits the fund to take remedial action when the deviation between shadow NAV and amortized cost NAV exceeds 0.5%, but under extreme market conditions a stable $1.00 net asset value is not an absolute guarantee. SEC filings state explicitly: "It is possible to lose money by investing in a money market fund that seeks to maintain a stable share price."

### Q: What is shadow NAV?

Shadow NAV is the NAV the fund calculates daily based on **market quotations**, used for comparison against the **amortized cost NAV** of $1.00 in order to monitor the accuracy of the amortized cost method. Rule 2a-7 requires that, when the deviation between the two valuation methods exceeds **0.5%**, the fund's board of directors must promptly consider remedial action, including shortening the average portfolio maturity, realizing gains and losses, withholding dividends, calculating NAV at market value, or reducing the number of shares outstanding if necessary.

### Q: Is tax owed on the daily airdrops?

**In most jurisdictions, yes.** Daily airdrops may be treated as a **continuing taxable event** — each airdrop creates new token units whose value may be treated as taxable income, producing 365 potential taxable events each year. As a Subchapter M regulated investment company, USDBOND is taxed under IRC §852 with dividend character determined under §854, and must provide holders with annual tax reporting (such as Form 1099-DA). Holders' specific filing obligations vary by jurisdiction.

### Q: What is the biggest risk for USDBOND?

**Regulatory characterization risk.** If regulators characterize USDBOND as a "payment stablecoin" rather than a security, the GENIUS Act's yield prohibition would apply directly and the daily airdrop mechanism could be prohibited. Other principal risks include liquidity mismatch, the limits of the $1 peg, smart contract risk, airdrop execution risk, and tax risk. The full list appears on the [Risk Factors](/en/risks/) page.

### Q: Which chains does USDB plan to deploy on?

USDBOND **plans** to deploy across multiple public blockchains, including **Ethereum mainnet, Solana, Polygon, and Base**. For reference, BENJI is already deployed on networks including Stellar, Ethereum, Polygon, Solana, Arbitrum, Avalanche, Aptos, Base, and BNB Smart Chain. Multi-chain deployment requires that transfer agent records remain consistent across chains and that KYC/whitelist rules be applied uniformly.

### Q: How does USDBOND's issuer earn revenue?

Through a **management fee** (e.g., 0.15% annualized) rather than the reserve spread. This means USDB's earnings model is **closer to that of an asset manager** (such as BlackRock's BUIDL, which charges a management fee) than to that of a payments company. At a 0.15% management fee, every $10 billion in scale generates $15 million in annual revenue; generating $10 million in annual revenue requires roughly $6.7 billion in assets under management.

### Q: Where can I buy USDB?

USDB shares are securities and are offered only to eligible investors that have completed **KYC/AML verification**, issued through the fund's formal subscription process, and are not circulated permissionlessly on public markets. This page is provided for informational purposes only and does not constitute an offer to sell securities or investment advice. Prospective investors should read the complete offering documents and consult professional advisers.
