# Translation Status

This document tracks the progress of translating UNCHAIN learning content from Japanese to English.

**Last Updated**: 2025-11-08

## Overview

- **Total Projects**: 25
- **Completed**: 3 (12%)
- **In Progress**: 1 (4%)
- **Pending**: 21 (84%)

## Translation Infrastructure

✅ **Translation Guide**: [`docs/TRANSLATION_GUIDE.md`](./TRANSLATION_GUIDE.md)
- Comprehensive step-by-step guide for contributors
- Common terms glossary
- AI translation tool tips
- Quality checklist

✅ **Helper Script**: [`scripts/prepare-translation.sh`](../scripts/prepare-translation.sh)
- Automates directory structure creation
- Shows translation progress
- Provides next steps guidance

✅ **Linting Configuration**: Updated for English content
- `.textlintignore` excludes English files
- `.lintstagedrc.js` skips Japanese rules for English content

## Project Status

### ✅ Completed (3)

| ID | Project | Chain | Files | Link |
|----|---------|-------|-------|------|
| 204 | Polygon-Whitelist-NFT | Polygon | All | [View](https://buidl.unchain.tech/Polygon-Whitelist-NFT/en/) |
| 502 | AVAX-AMM | Avalanche | All | [View](https://buidl.unchain.tech/AVAX-AMM/en/) |
| 901 | TheGraph-ScaffoldEth2 | TheGraph | All | [View](https://buidl.unchain.tech/TheGraph-ScaffoldEth2/en/) |

### 🔄 In Progress (1)

| ID | Project | Chain | Progress | Notes |
|----|---------|-------|----------|-------|
| 101 | ETH-dApp | Ethereum | 3/14 files | Sample translations as examples |

### 📋 Pending (21)

#### Ethereum (5)
- [ ] 102 - ETH-NFT-Collection
- [ ] 103 - ETH-NFT-Maker
- [ ] 104 - ETH-NFT-Game
- [ ] 105 - ETH-Yield-Farm
- [ ] 106 - ETH-DAO

#### Polygon (3)
- [ ] 201 - Polygon-Generative-NFT
- [ ] 202 - Polygon-ENS-Domain
- [ ] 203 - Polygon-Mobile-dApp

#### Solana (4)
- [ ] 301 - Solana-dApp
- [ ] 302 - Solana-NFT-Drop
- [ ] 303 - Solana-Online-Store
- [ ] 304 - Solana-Wallet

#### NEAR (4)
- [ ] 401 - NEAR-Election-dApp
- [ ] 402 - NEAR-Hotel-Booking-dApp
- [ ] 403 - NEAR-BikeShare
- [ ] 404 - NEAR-MulPay

#### Avalanche (3)
- [ ] 501 - AVAX-Messenger
- [ ] 503 - AVAX-Asset-Tokenization
- [ ] 504 - AVAX-Subnet

#### Other Chains (2)
- [ ] 601 - ICP-Static-Site (ICP)
- [ ] 701 - ASTAR-SocialFi (Astar)
- [ ] 801 - XRPL-NFT-Maker (XRPL)

## How to Contribute

1. **Choose a project** from the pending list above
2. **Comment on [issue #3526](https://github.com/unchain-tech/UNCHAIN-projects/issues/3526)** to claim it
3. **Follow the guide** in [`docs/TRANSLATION_GUIDE.md`](./TRANSLATION_GUIDE.md)
4. **Use the helper script**: `./scripts/prepare-translation.sh docs/[Chain]/[Project]`
5. **Translate** the markdown files
6. **Test**: `yarn build`
7. **Submit a PR**

## Translation Workflow

```
1. Select Project → 2. Claim in Issue → 3. Prepare Structure
         ↓
4. Translate Files → 5. Review & Test → 6. Submit PR
```

## Quality Standards

All translations should:
- ✅ Maintain markdown structure and formatting
- ✅ Keep code blocks unchanged
- ✅ Preserve image URLs and link URLs
- ✅ Translate link text and alt text
- ✅ Use consistent technical terminology
- ✅ Pass build without errors
- ✅ Follow existing translation examples

## Resources

- **Translation Guide**: [`docs/TRANSLATION_GUIDE.md`](./TRANSLATION_GUIDE.md)
- **Issue Tracker**: [#3526](https://github.com/unchain-tech/UNCHAIN-projects/issues/3526)
- **Example Translations**:
  - [Polygon-Whitelist-NFT](https://github.com/unchain-tech/UNCHAIN-projects/tree/main/i18n/en/docusaurus-plugin-content-docs/current/Polygon/Polygon-Whitelist-NFT)
  - [TheGraph-ScaffoldEth2](https://github.com/unchain-tech/UNCHAIN-projects/tree/main/i18n/en/docusaurus-plugin-content-docs/current/TheGraph/TheGraph-ScaffoldEth2)
  - [AVAX-AMM](https://github.com/unchain-tech/UNCHAIN-projects/tree/main/i18n/en/docusaurus-plugin-content-docs/current/Avalanche/AVAX-AMM)
- **Discord**: UNCHAIN Community

## Notes for Translators

- **AI Translation Tools**: You can use ChatGPT, Claude, DeepL, etc. to speed up translation, but **always review and edit** the output for accuracy and natural English.
- **Technical Terms**: Refer to the glossary in the Translation Guide for consistency.
- **Questions**: Ask in Discord or comment on the issue.

---

Let's make UNCHAIN learning content accessible to English speakers worldwide! 🌍✨
