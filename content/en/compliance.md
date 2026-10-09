---
slug: compliance
title: USDBOND Compliance — 1940 Act Shares, KYC/AML, Transfer Limits
description: USDBOND's compliance framework rests on 1940 Act registered fund shares, Securities Act registration, Bank Secrecy Act KYC/AML and OFAC sanctions screening.
h1: Compliance Architecture
lead: USDBOND's compliance foundation is the characterization of its token shares as registered investment company shares under the Investment Company Act of 1940. That securities characterization keeps USDBOND outside the GENIUS Act's yield prohibition for payment stablecoin issuers, while requiring issuance to comply with the registration or exemption requirements of the Securities Act of 1933, transfers to comply with securities law transfer restrictions, and the issuer to meet KYC/AML and OFAC sanctions screening obligations under the Bank Secrecy Act.
nav: Compliance
order: 5
updated: 2026-10-09
schema: Article
keywords: [USDBOND compliance, Investment Company Act of 1940, GENIUS Act yield prohibition, KYC AML, OFAC sanctions screening, transfer agent, Securities Act Section 5, Form 1099-DA]
---

## Why the 1940 Act Registered Fund Structure

The US GENIUS Act (signed in July 2025) explicitly prohibits payment stablecoin issuers from paying interest or yield to holders. The Act requires stablecoin issuers to maintain reserve assets on at least a **1:1** basis, with reserves limited to US dollars, Federal Reserve notes, funds held by insured depository institutions, specified short-term Treasuries and Treasury-collateralized reverse repurchase agreements, and money market funds.

The GENIUS Act prohibits issuers from paying any form of interest or yield on the holding of payment stablecoins, but **does not explicitly prohibit affiliated parties or third-party arrangements from offering yield-bearing products**.

USDBOND's legal characterization is that of a **registered investment company share under the Investment Company Act of 1940**, not a payment stablecoin. Regulatory practice has already validated the viability of this path:

- Through a **no-action letter**, the SEC permitted a registered fund within the Franklin Templeton complex to use the on-chain BENJI system for cash management, relying on **Section 17(f)** of the 1940 Act and **Rule 17f-2**, allowing a registered fund to hold on-chain money market fund shares without satisfying certain physical vault requirements.
- The SEC also recognized Franklin's **hybrid transfer agent arrangement** — off-chain books combined with on-chain records, with an affiliated transfer agent controlling the private keys, the administrative functions, and the official shareholder register.
- The BENJI/FOBXX funds, as **Subchapter M** regulated investment companies taxed under **IRC §852** with dividend character determined under **§854**, have already demonstrated the viability of this path in live operation.

## Fund Structure

| Layer | Entity / Component | Function |
| - | - | - |
| **Fund layer** | USDBOND Government Money Market Fund (registered investment company) | Holds short-term US Treasuries and generates interest income |
| **Token layer** | USDB token | Represents fund shares; 1 USDB = 1 fund share |
| **Transfer agent layer** | Licensed transfer agent | Maintains the official shareholder register and administers on-chain share registration |
| **Custody layer** | Qualified custodian bank | Holds the underlying Treasury assets, segregated from fund operations |

## Compliance Boundaries of the Payment Function

Because every USDB maintains a constant $1.00 NAV under the Rule 2a-7 amortized cost method and therefore has value stability characteristics, USDB can be used for payments and settlement between eligible whitelisted addresses. USDB's payment function is a **secondary application** of a security share within a restricted-transfer framework and does not change its characterization as a security.

The statement "because the value is stable, it can also be used for payments" holds technically, but the following constraints must be attached, or regulators may recharacterize the instrument as a payment stablecoin:

| Boundary | Requirement |
| - | - |
| **Transfer scope** | Payments occur only between eligible addresses that have completed KYC/AML and been whitelisted |
| **Public access** | No permissionless payment or circulation is opened to unverified addresses |
| **Redemption commitment** | No unconditional commitment is made to any holder to redeem at $1.00 for fiat; redemption occurs only through the fund's formal redemption process |
| **Marketing language** | USDB is not marketed as an everyday payment instrument or a general-purpose stablecoin, so as to avoid triggering the payment stablecoin definition |
| **Securities law compliance** | Payment transfers remain subject to securities law transfer restrictions; the smart contract whitelist is the enforcement tool |
| **Yield airdrops** | Airdrops are directed only to holding addresses eligible at the snapshot; ineligible addresses may hold or redeem principal but receive no yield airdrop |

## Legal Characterization Risk

The GENIUS Act's definition of a "payment stablecoin" turns centrally on **whether the instrument serves as a means of payment or settlement, and whether the issuer promises redemption at a fixed monetary value**. If USDB is widely used for public payments and regulators conclude that it in fact constitutes a payment stablecoin, the daily airdrop yield mechanism could be prohibited.

**OCC implementation proposal (NPRM)**: The GENIUS Act implementation rulemaking proposal published by the OCC on **February 25, 2026** adopts a **broad reading** of the GENIUS Act's yield prohibition, taking the view that arrangements in which affiliates or third parties provide yield indirectly are inconsistent with the prohibition and effectively closing the so-called "affiliate loophole." Accordingly, "can also be used for payments" must be designed as a **limited, compliant, whitelist-only securities transfer function**, not a public, permissionless payment instrument available to everyone.

**Definitional uncertainty**: The term "holder" is not defined in the GENIUS Act, which leaves uncertainty in regulatory interpretation. A discussion draft of the **CLARITY Act** proposes a possible compromise: retaining the core prohibition on yield for passive holding of payment stablecoins while permitting rewards tied to specific payment or platform activity. USDBOND must continue to monitor changes in regulatory interpretation closely.

## Securities Law Compliance

USDB shares are registered investment company shares under the 1940 Act and **are securities**.

- Issuance must comply with the registration requirements of the **Securities Act of 1933** or an applicable exemption.
- Transfers must comply with securities law transfer restrictions.
- The whitelist mechanism at the smart contract level is **a core component of the Section 5 securities law compliance architecture** — permitting transfers only between eligible addresses and enforcing the conditions of the issuance exemption at the protocol layer.
- Tokenized money market funds are generally classified as securities and are subject to securities law requirements including registration, disclosure, reporting obligations, and transfer restrictions.

## KYC/AML Compliance

USDBOND must comply with customer identification program requirements under the **Bank Secrecy Act (BSA)**:

| Requirement | Detail |
| - | - |
| **Identity verification** | Identify and verify each investor's identity |
| **Beneficial ownership identification** | Identify the actual beneficial owners of legal entities |
| **Enhanced due diligence** | Perform EDD for high-risk customers |
| **Ongoing monitoring** | Monitor transactions and relationships on an ongoing basis |
| **Sanctions screening** | **OFAC sanctions screening** for all addresses, matched against the SDN list in real time, with blocking and reporting for sanctioned addresses |

The OCC implementation proposal leaves Bank Secrecy Act, anti-money laundering, and OFAC sanctions requirements to **separate rulemaking coordinated by the Treasury Department**.

## Transfer Agent

USDBOND must appoint a **licensed transfer agent** responsible for maintaining the official shareholder register and administering issuance, redemption, and dividend records for shares.

In the BENJI no-action letter, the SEC recognized a **hybrid transfer agent arrangement**: the transfer agent controls the permission list, the smart contract administrative privileges, and the final records, and can correct erroneous transactions, freeze or migrate wallet records, and restore ownership after the loss of a private key.

BENJI's specific approach is as follows: the transfer agent records transaction activity on public blockchains through a proprietary Benji platform; its internal systems hold private information such as names and dates of birth, while the public blockchain records anonymized data on subscriptions, redemptions, dividends, NAV, and transaction history, and the two parts are linked in real time to form the formal register of holders.

USDBOND's transfer agent must likewise possess the **dual capabilities of on-chain recordkeeping and off-chain compliance administration**.

## Tax Treatment

As a **Subchapter M** regulated investment company, USDBOND is taxed under **IRC §852**, with dividend character determined under **§854**.

In most jurisdictions, the newly minted USDB from daily airdrops may be treated as a **continuing taxable event** — each airdrop creates new token units whose value may be treated as taxable income. USDBOND must provide holders with annual tax reporting (such as **Form 1099-DA**) stating the amount and character of airdrop income.

> **Note**: Holders' tax treatment varies by jurisdiction, and daily airdrops significantly increase filing complexity. Prospective investors should consult a professional tax adviser about their own tax situation.

## Technical Enforcement of Compliance

Compliance requirements are enforced at the protocol layer through smart contracts:

```
function isEligible(address account) public view returns (bool) {
    // Check whether the address is whitelisted
    // Check whether the address is sanctioned
    // Check whether the address is in a restricted jurisdiction
}
```

The whitelist is controlled by the transfer agent. Addresses that have not passed KYC, sanctioned addresses, and addresses expressly excluded by protocol governance are not eligible for airdrops and cannot transfer USDB outside the restricted-transfer framework.

## Frequently Asked Questions

### Q: Is USDB a security?

Yes. USDB is a registered investment company share under the Investment Company Act of 1940 and is a security. Its issuance must comply with the registration requirements of the Securities Act of 1933 or an applicable exemption, and its transfers must comply with securities law transfer restrictions.

### Q: Why is USDB's yield distribution not subject to the GENIUS Act's yield prohibition?

The GENIUS Act prohibits **payment stablecoin issuers** from paying interest or yield to holders. USDB is not a payment stablecoin but a 1940 Act registered investment company share, and its yield distribution is a lawful fund dividend, so it does not fall within the prohibition. This path has been validated by the live operation of the Franklin Templeton BENJI/FOBXX funds.

### Q: How does the OCC implementation proposal affect USDBOND?

The GENIUS Act implementation rulemaking proposal (NPRM) published by the OCC on February 25, 2026 adopts a broad reading of the yield prohibition, taking the view that arrangements in which affiliates or third parties provide yield indirectly are inconsistent with the prohibition and effectively closing the "affiliate loophole." USDB's payment function must therefore be designed as a limited, compliant, whitelist-only securities transfer function rather than a public, permissionless payment instrument.

### Q: Why must KYC be completed to receive yield?

USDB is a security, and yield can be distributed only to eligible holders that have completed KYC/AML verification and been whitelisted. The smart contract whitelist is a core component of the Section 5 securities law compliance architecture, enforcing the conditions of the issuance exemption at the protocol layer. USDB held by ineligible addresses remains redeemable at principal but earns no yield airdrop.

### Q: Can USDB be transferred freely?

No. As a security, USDB's transfers are subject to securities law transfer restrictions and occur only between eligible addresses that have completed KYC/AML and been whitelisted. No permissionless payment or circulation is opened to unverified addresses.

### Q: Is tax owed on the daily airdrops?

In most jurisdictions, daily airdrops may be treated as a continuing taxable event — each airdrop creates new token units whose value may be treated as taxable income. USDBOND must provide annual tax reporting (such as Form 1099-DA), and holders' specific filing obligations vary by jurisdiction and should be discussed with a professional tax adviser.
