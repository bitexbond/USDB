---
slug: whitepaper
title: USDBOND Whitepaper — Legal Architecture and Yield Design
description: The full USDBOND whitepaper covering 1940 Act registered investment company shares, Rule 2a-7 amortized cost, constant $1.00 NAV, and 365-day daily airdrops.
h1: USDBOND Whitepaper
lead: This whitepaper sets out the design of USDBOND (token ticker USDB) — the legal characterization of a registered investment company share under the Investment Company Act of 1940, a value stability mechanism based on the Rule 2a-7 amortized cost method, and on-chain yield distribution through daily airdrops of newly minted USDB.
nav: Whitepaper
order: 2
updated: 2026-10-09
schema: Article
keywords: [USDBOND whitepaper, USDB, Investment Company Act of 1940, Rule 2a-7, amortized cost method, registered investment company shares, Treasury yield, daily airdrop]
---

**Version 1.2 | October 2026**

## 1. Summary

USDBOND (token ticker: USDB) is an innovative on-chain stable equity. It is an on-chain yield-bearing instrument backed by short-term US Treasuries whose token shares are characterized as registered investment company shares. Every USDB maintains a constant $1.00 NAV under the Rule 2a-7 amortized cost method, giving it value stability characteristics that allow it to be used for payments and settlement between eligible whitelisted addresses. USDBOND mints new USDB daily and airdrops it to the holding addresses that are eligible at the snapshot, distributing Treasury yield 365 days a year, including weekends and holidays.

USDBOND is not a payment stablecoin. USDB is a registered investment company share under the Investment Company Act of 1940 and is a security. Its payment function is a secondary application of a security share within a restricted-transfer framework; it does not change its characterization as a security, nor does it trigger the GENIUS Act's prohibition on yield paid by payment stablecoin issuers.

Rather than using rebasing or NAV appreciation to change token balances or prices, USDBOND keeps every USDB pegged at a constant $1.00 and distributes Treasury yield to the eligible addresses holding USDB at the airdrop snapshot by **airdropping newly minted USDB**. Holders need not stake, lock, or claim anything; yield arrives in the wallet automatically.

This whitepaper follows the operating model of the Franklin Templeton BENJI/FOBXX funds and adopts a registered investment company structure under the Investment Company Act of 1940, giving the token shares the attributes of a security so that Treasury yield can lawfully be distributed to holders.

## 2. Legal Architecture: Registered Investment Company Share Characterization

### 2.1 Why the 1940 Act Registered Fund Structure

The US GENIUS Act (signed in July 2025) explicitly prohibits payment stablecoin issuers from paying interest or yield to holders. The Act requires stablecoin issuers to maintain reserve assets on at least a 1:1 basis, with reserves limited to US dollars, Federal Reserve notes, funds held by insured depository institutions, specified short-term Treasuries and Treasury-collateralized reverse repurchase agreements, and money market funds. The GENIUS Act prohibits issuers from paying any form of interest or yield on the holding of payment stablecoins, but it does not explicitly prohibit affiliated parties or third-party arrangements from offering yield-bearing products.

USDBOND's legal characterization is that of a **registered investment company share under the Investment Company Act of 1940**, not a payment stablecoin. The SEC has permitted a registered fund within the Franklin Templeton complex to use the on-chain BENJI system for cash management through a no-action letter, relying on Section 17(f) of the 1940 Act and Rule 17f-2, which allows a registered fund to hold on-chain money market fund shares without satisfying certain physical vault requirements. The SEC also recognized Franklin's hybrid transfer agent arrangement — off-chain books combined with on-chain records, with an affiliated transfer agent controlling the private keys, the administrative functions, and the official shareholder register.

This legal characterization places USDBOND outside the scope of the GENIUS Act's yield prohibition. The BENJI/FOBXX funds, as Subchapter M regulated investment companies taxed under IRC §852 with dividend character determined under §854, have already demonstrated the viability of this path in live operation.

### 2.2 Fund Structure

USDBOND's fund structure comprises the following layers:

| Layer | Entity / Component | Function |
| - | - | - |
| **Fund layer** | USDBOND Government Money Market Fund (registered investment company) | Holds short-term US Treasuries and generates interest income |
| **Token layer** | USDB token | Represents fund shares; 1 USDB = 1 fund share |
| **Transfer agent layer** | Licensed transfer agent | Maintains the official shareholder register and administers on-chain share registration |
| **Custody layer** | Qualified custodian bank | Holds the underlying Treasury assets, segregated from fund operations |

The fund portfolio must satisfy the Rule 2a-7 definition of a "government money market fund," meaning that **more than 99.5%** of total assets are invested in cash, government securities, or repurchase agreements collateralized by government securities. BENJI's prospectus discloses that at least 99.5% of its assets are invested in US government securities, cash, and repurchase agreements fully collateralized by government securities or cash, with no bitcoin or ether underneath.

## 3. Value Stability Mechanism: Rule 2a-7 and the Amortized Cost Method

### 3.1 Amortized Cost Method

The USDBOND fund values assets using the **amortized cost method** permitted by Rule 2a-7. Under this method, securities are carried at acquisition cost and any premium or discount is amortized on a constant basis over the holding period, **without being affected by market price movements caused by interest rate fluctuations**.

The central objective of this valuation is to **facilitate maintenance of a constant $1.00 NAV per share**. Rule 2a-7 expressly permits government money market funds to use the amortized cost method or penny-rounding method of valuation and to maintain a constant NAV.

### 3.2 Daily Net Income Declaration and Dividends

Money market fund net income **is declared as a dividend each time it is determined**. Once the dividend is declared, NAV per share immediately returns to $1.00. Rule 2a-7 provides that the NAV per share of retail money market funds and government money market funds is ordinarily maintained at $1.00 after income determination and dividend declaration. USDBOND follows this mechanism: the fund calculates net income daily, declares it as a dividend, and NAV stays constant at $1.00.

### 3.3 Shadow NAV and Deviation Monitoring

To monitor the accuracy of the amortized cost method, the fund calculates a **shadow NAV** (a NAV based on market quotations) daily and compares it with the $1.00 amortized cost NAV. Rule 2a-7 requires that, **when the deviation between the two valuation methods exceeds 0.5%**, the fund's board of directors must promptly consider taking remedial action.

Remedial actions include, without limitation: shortening the average portfolio maturity, realizing gains and losses, withholding dividends, calculating NAV at market value, or, if necessary, **reducing the number of shares outstanding**. These procedures are intended to eliminate material dilution or other unfair results.

### 3.4 Asset Eligibility

The USDBOND fund portfolio concentrates in **short-term US Treasuries maturing within 93 days** and Treasury-collateralized repurchase agreements. As a government money market fund under Rule 2a-7, the portfolio must satisfy the following conditions:

- Dollar-weighted average portfolio maturity of no more than **60 days**
- Weighted average life of no more than **120 days**
- Purchase only instruments with a remaining maturity of no more than **397 days**
- Satisfy applicable daily liquidity, weekly liquidity, and general liquidity requirements
- Invest only in high-quality securities determined to present minimal credit risk under methods approved by the trustees

## 4. Yield Distribution: The Daily Airdrop Mechanism

### 4.1 Core Design: Constant $1.00 Plus New-Token Airdrops

USDBOND distributes yield using a **constant NAV plus newly minted USDB airdrop** model. Every USDB remains pegged at $1.00; Treasury interest does not change the token price but is distributed by minting new USDB tokens daily and airdropping them to eligible holder wallets.

This model is identical to the Franklin Templeton BENJI mechanism: BENJI distributes yield by **minting new BENJI tokens daily and airdropping them directly to shareholder wallets**, not through NAV changes. BENJI's **daily on-chain dividend distributions run 365 days a year, including weekends and holidays**. BENJI yield **accrues on a per-second basis** as tokens are transferred.

### 4.2 The 365-Day Operating Mechanism

Traditional money market funds generally distribute dividends on **business days**. USDBOND is designed to **distribute every day, 365 days a year**, including weekends and holidays. This requires:

- **Daily accrual of off-chain yield**: Treasury interest accrues daily; even on non-trading days the interest continues to accrue (Treasury interest is calculated on an actual-days basis, including weekends and holidays).
- **Daily execution of on-chain minting**: The smart contract executes one minting and airdrop operation each day, unrestricted by the traditional financial market trading calendar.
- **Daily synchronization of rate data**: Accrued yield rates are synchronized on-chain daily through an oracle or an off-chain calculation engine.

BENJI has already demonstrated the engineering feasibility of this design: its **daily on-chain dividend distributions run 365 days a year**, making it the only tokenized money market fund currently capable of this. WisdomTree's WTGXX has also introduced **continuous dividend accrual**, allowing shares to allocate daily income according to how long each verified wallet has held tokens, using blockchain timestamps to track intraday transfers.

### 4.3 Airdrop Calculation Formula

The quantity of USDB airdropped each day is calculated as follows:

**Daily airdrop USDBᵢ = Holding USDBᵢ × (Fund daily net income ÷ Total fund shares outstanding) × (1 − Management fee rate)**

Where:

- **Holding USDBᵢ**: the USDB balance of eligible address i at the snapshot.
- **Fund daily net income**: the fund's Treasury interest income for the day less operating expenses.
- **Total fund shares outstanding**: the total quantity of USDB outstanding at the snapshot.
- **Management fee rate**: the annualized management fee (e.g., 0.15%), deducted on a daily pro-rata basis.

### 4.4 Definition of Eligible Holders

**The eligible users for airdrops are the USDB holding addresses that are eligible at the time of the airdrop.** Specifically:

- **Snapshot time**: a snapshot of on-chain USDB holding addresses is taken daily at UTC 00:00 (or another fixed time determined by protocol governance).
- **Eligibility conditions**: an address must satisfy all of the following:
  1. It has completed **KYC/AML verification** with the transfer agent and has been **whitelisted**.
  2. It holds a USDB token balance at the snapshot time (balance > 0).
  3. It is not under a **lock-up, freeze, or sanctions list** designation.
  4. It is not located in a restricted jurisdiction.
- **Ineligible addresses**: wallet addresses that have not passed KYC, sanctioned addresses, and addresses expressly excluded by protocol governance are not eligible for airdrops. USDB held by ineligible addresses remains redeemable at principal ($1.00 per token) but earns no yield airdrop.

### 4.5 Airdrop Execution Process

The daily airdrop is executed as follows:

**Step one: yield calculation (off-chain).** The fund administrator calculates the day's accrued Treasury interest and deducts the management fee to arrive at distributable net income.

**Step two: snapshot (on-chain).** At the scheduled snapshot time, the smart contract records the USDB balances of all eligible addresses.

**Step three: minting (on-chain).** Based on the yield calculation and snapshot results, the smart contract calls the `mint` function to mint the corresponding quantity of new USDB tokens into a pool of addresses pending distribution.

**Step four: airdrop (on-chain).** The smart contract distributes the newly minted USDB tokens to eligible holder wallets in proportion to each address's holdings. The airdrop is executed by **batch transfer** or **Merkle distribution** to optimize gas costs.

**Step five: record update (on-chain).** The transfer agent updates the official shareholder register to reflect the newly issued shares.

## 5. Payment Function and Compliance Boundaries

### 5.1 Positioning of the Payment Function

Because every USDB maintains a constant $1.00 NAV under the Rule 2a-7 amortized cost method and therefore has value stability characteristics, USDB can be used for payments and settlement between eligible whitelisted addresses. USDB's payment function is a secondary application of a security share within a restricted-transfer framework and does not change its characterization as a security.

### 5.2 Compliance Boundaries of the Payment Function

The statement "because the value is stable, it can also be used for payments" holds technically, but the following constraints must be attached, or regulators may recharacterize the instrument as a payment stablecoin:

| Boundary | Requirement |
| - | - |
| **Transfer scope** | Payments occur only between eligible addresses that have completed KYC/AML and been whitelisted |
| **Public access** | No permissionless payment or circulation is opened to unverified addresses |
| **Redemption commitment** | No unconditional commitment is made to any holder to redeem at $1.00 for fiat; redemption occurs only through the fund's formal redemption process |
| **Marketing language** | USDB is not marketed as an everyday payment instrument or a general-purpose stablecoin, so as to avoid triggering the payment stablecoin definition |
| **Securities law compliance** | Payment transfers remain subject to securities law transfer restrictions; the smart contract whitelist is the enforcement tool |
| **Yield airdrops** | Airdrops are directed only to holding addresses eligible at the snapshot; ineligible addresses may hold or redeem principal but receive no yield airdrop |

### 5.3 Legal Characterization Risk Notice

The GENIUS Act's definition of a "payment stablecoin" turns centrally on **whether the instrument serves as a means of payment or settlement, and whether the issuer promises redemption at a fixed monetary value**. If USDB is widely used for public payments and regulators conclude that it in fact constitutes a payment stablecoin, the daily airdrop yield mechanism could be prohibited.

The GENIUS Act implementation rulemaking proposal (NPRM) published by the OCC on February 25, 2026 adopts a broad reading of the GENIUS Act's yield prohibition, taking the view that arrangements in which affiliates or third parties provide yield indirectly are inconsistent with the prohibition and effectively closing the so-called "affiliate loophole." Accordingly, "can also be used for payments" must be designed as a **limited, compliant, whitelist-only securities transfer function**, not a public, permissionless payment instrument available to everyone.

In addition, the term "holder" is not defined in the GENIUS Act, which leaves uncertainty in regulatory interpretation. A discussion draft of the CLARITY Act proposes a possible compromise: retaining the core prohibition on yield for passive holding of payment stablecoins while permitting rewards tied to specific payment or platform activity. USDBOND must continue to monitor changes in regulatory interpretation closely.

## 6. Technical Architecture

### 6.1 System Layers

USDBOND's technical architecture is divided into four layers:

**Underlying asset layer**: short-term US Treasuries and repurchase agreements, held by a qualified custodian bank and bankruptcy-remote from the fund operating entity. The custody arrangement follows the BENJI model, with third-party auditors periodically verifying asset sufficiency.

**Fund operations layer**: the fund administrator calculates daily net income, accrued yield, and management fees. The transfer agent maintains the official shareholder register and administers issuance, redemption, and dividend records for shares. BENJI's transfer agent records transaction activity on public blockchains through a proprietary Benji platform; its internal systems hold private information such as names and dates of birth, while the public blockchain records anonymized data on subscriptions, redemptions, dividends, NAV, and transaction history, and the two parts are linked in real time to form the formal register of holders.

**Smart contract layer**:

| Contract | Function |
| - | - |
| **USDB token contract** | ERC-20 compatible token implementing whitelist transfer restrictions, daily minting, and batch airdrop functionality |
| **Snapshot contract** | Records eligible address balances at the scheduled snapshot time |
| **Airdrop contract** | Executes daily minting and distribution logic, supporting Merkle distribution or batch transfer |
| **Oracle / data feed contract** | Receives off-chain yield calculation data and triggers the airdrop process |

**User access layer**: access through a web platform or API, allowing eligible investors to complete KYC, subscribe, redeem, and view airdrop records.

### 6.2 Key Smart Contract Functions

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

### 6.3 Multi-Chain Deployment

USDBOND plans to deploy across multiple public blockchains, including Ethereum mainnet, Solana, Polygon, and Base. BENJI is already deployed on networks including Stellar, Ethereum, Polygon, Solana, Arbitrum, Avalanche, Aptos, Base, and BNB Smart Chain. Multi-chain deployment requires that transfer agent records remain consistent across chains and that KYC/whitelist rules be applied uniformly.

## 7. Compliance Framework

### 7.1 Securities Law Compliance

USDB shares are registered investment company shares under the 1940 Act and are securities. Issuance must comply with the registration requirements of the Securities Act of 1933 or an applicable exemption. Transfers must comply with securities law transfer restrictions. The whitelist mechanism at the smart contract level is **a core component of the Section 5 securities law compliance architecture** — permitting transfers only between eligible addresses and enforcing the conditions of the issuance exemption at the protocol layer. Tokenized money market funds are generally classified as securities and are subject to securities law requirements including registration, disclosure, reporting obligations, and transfer restrictions.

### 7.2 KYC/AML Compliance

USDBOND must comply with customer identification program requirements under the Bank Secrecy Act (BSA), including identity verification, beneficial ownership identification, enhanced due diligence for high-risk customers, and ongoing monitoring. All addresses must undergo **OFAC sanctions screening**, matched against the SDN list in real time, with blocking and reporting obligations for sanctioned addresses. The OCC implementation proposal leaves Bank Secrecy Act, anti-money laundering, and OFAC sanctions requirements to separate rulemaking coordinated by the Treasury Department.

### 7.3 Transfer Agent

USDBOND must appoint a licensed transfer agent responsible for maintaining the official shareholder register and administering issuance, redemption, and dividend records for shares. In the BENJI no-action letter, the SEC recognized a hybrid transfer agent arrangement: the transfer agent controls the permission list, the smart contract administrative privileges, and the final records, and can correct erroneous transactions, freeze or migrate wallet records, and restore ownership after the loss of a private key. USDBOND's transfer agent must likewise possess the dual capabilities of on-chain recordkeeping and off-chain compliance administration.

### 7.4 Tax Treatment

As a Subchapter M regulated investment company, USDBOND is taxed under IRC §852, with dividend character determined under §854. In most jurisdictions, the newly minted USDB from daily airdrops may be treated as a **continuing taxable event**: each airdrop creates new token units whose value may be treated as taxable income. USDBOND must provide holders with annual tax reporting (such as Form 1099-DA) stating the amount and character of airdrop income.

## 8. Risk Factors

**Regulatory characterization risk**: If regulators characterize USDBOND as a "payment stablecoin" rather than a security, the GENIUS Act's yield prohibition would apply directly and the airdrop mechanism could be prohibited. The OCC implementation proposal adopts a broad reading of the yield prohibition, taking the view that arrangements in which affiliates or third parties provide yield indirectly may violate the GENIUS Act's prohibition. USDBOND must continuously ensure the compliance basis for its characterization as a security and closely monitor changes in regulatory interpretation.

**Liquidity mismatch risk**: A tokenized fund permits daily redemption, but the underlying Treasuries still settle on a T+1 basis. Under market stress, the fund may face a timing gap between redemption pressure and asset liquidation. BENJI's redemption mechanism is as follows: the holder sends tokens to a burn address and receives funds back, with the underlying assets held by the custodian and accounted for on a parallel basis. The Bank for International Settlements (BIS) has identified liquidity mismatch as a principal risk of tokenized money market funds.

**Limits of the $1 peg**: $1.00 is a **NAV commitment at redemption**, not a price guarantee in the secondary market. USDB's secondary market price on decentralized exchanges may deviate from $1.00 temporarily due to supply and demand. Rule 2a-7 permits the fund to take remedial action when the deviation exceeds 0.5%, but under extreme market conditions a stable $1.00 net asset value is not an absolute guarantee. SEC filings state explicitly: "It is possible to lose money by investing in a money market fund that seeks to maintain a stable share price."

**Smart contract risk**: On-chain congestion, smart contract vulnerabilities, and private key management issues in multi-signature custody can threaten asset security along dimensions that do not exist in traditional fund operations. The airdrop contract must undergo a third-party security audit.

**Airdrop execution risk**: The daily airdrop depends on coordination between off-chain yield calculation and on-chain execution. Oracle delays, data deviations, or technical failures at the snapshot time can result in inaccurate airdrop quantities or failed distributions.

**Tax risk**: Daily airdrops may trigger continuing taxable events in most jurisdictions, making holders' tax treatment complex. USDBOND's tax reporting obligations and holders' filing obligations must be disclosed clearly in the offering documents.

## 9. Conclusion

USDBOND (token ticker: USDB) is an innovative on-chain stable equity. It combines the legal characterization of a registered investment company share under the 1940 Act, the Rule 2a-7 amortized cost method of value stabilization, and on-chain yield distribution through daily airdrops of newly minted USDB. USDBOND's legal characterization distinguishes it from payment stablecoins under the GENIUS Act, allowing it to lawfully distribute Treasury yield to holders. Its ability to run daily airdrops 365 days a year follows BENJI's proven model, ensuring continuity and automation in yield distribution. The definition of eligible holders turns on KYC verification and whitelist status at the snapshot, unifying compliance and enforceability.

USDBOND's objective is to become a **compliant, transparent, automated on-chain Treasury yield instrument** that keeps every USDB pegged at $1.00 while providing eligible holders with daily Treasury yield requiring no active action. USDB's value stability characteristics allow it to be used for payments and settlement between eligible whitelisted addresses, but that payment function is a secondary application of a security share within a restricted-transfer framework and does not change its characterization as a security.

*This whitepaper is provided for informational purposes only and does not constitute an offer to sell securities or investment advice. The offer and sale of USDB shares are subject to applicable securities laws and regulations. Prospective investors should read the offering documents carefully and consult professional advisers before making any investment decision.*
