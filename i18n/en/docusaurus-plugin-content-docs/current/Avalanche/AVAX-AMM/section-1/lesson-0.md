---
title: Introduction
---
### 👋 Welcome to the dApp Development Project!

In this project, we will implement a smart contract on `Avalanche` and build a custom web application that interacts with the smart contract.

The following technologies are required for this project:

* Basic Terminal operations
* Solidity
* HTML/CSS
* [TypeScript](https://www.typescriptlang.org/docs/handbook/typescript-from-scratch.html)
* [React.js](https://react.dev/learn)

You don’t need to fully understand everything right now.
If you encounter something you don’t know, feel free to search the internet or ask questions in the community as you move forward with the project!

If you're new to development on `Avalanche` or have no experience writing smart contract tests with `hardhat`, [AVAX-Messenger](/Avalanche/AVAX-Messenger/section-0/lesson-1) offers a more detailed explanation, so starting there may help things go more smoothly.

### 🛠 What Will We Build?

We’ll be building a **decentralized web application （dApp）** called `Miniswap`.

`Miniswap` consists of a smart contract that has `AMM` functionality, and a frontend codebase that acts as an interface for users to interact with the smart contract.

We’ll use `Solidity` for the smart contract,
and `TypeScript` + `React.js` + `Next.js` for the frontend.

The completed smart contract will be deployed to [FUJI C-Chain](https://build.avax.network/docs/quick-start/networks/fuji-testnet).

For an overview of Avalanche and the C-Chain, please refer to [this link](https://buidl.unchain.tech/Avalanche/AVAX-Messenger).

### 🪙 Defi, DEX, and AMM

🐦 Defi（Decentralized Finance）

This is a financial ecosystem built on blockchain networks, without a central administrator.

One major advantage of DeFi is that it’s managed by code and allows users to control their own assets, which reduces costs and friction in traditional financial systems.

If cryptocurrencies function properly as currency,
the openness and low cost of DeFi can also benefit low-income individuals who currently don’t have access to traditional financial systems.

On the other hand, rising fees and the need for users to manage their own assets can be considered drawbacks.

[Reference Article](https://academy.binance.com/en/articles/the-complete-beginners-guide-to-decentralized-finance-defi)

🦏 DEX（Decentralized Exchange）

A DEX is an exchange that allows anyone to swap cryptocurrency tokens on the blockchain, such as an AVAX-USDC pair.
It is a type of DeFi.

Centralized exchanges（CEX）like Binance use order books to match buyers and sellers on an online trading platform,
similar to online brokerage accounts, which are popular among investors.

Decentralized exchanges（DEX）like PancakeSwap and Uniswap are self-contained financial protocols powered byスマートコントラクトthat allow crypto traders to convert their assets.

Since DEXs reduce the need for maintenance, their transaction fees are generally cheaper than centralized exchanges.

🐅 AMM（Automated Market Maker）

An AMM is an automated trading system based on mathematical formulas, and is used by many DEXs.

We’ll reference Uniswap’s implementation, one of the most well-known DEXs, as we proceed with the project.

### 🚀 Avalanche and DeFi

While DeFi is a rapidly growing field, high transaction fees have been a problem for users.

Building DeFi on Avalanche offers several advantages:

The following is quoted from [Avalanche: The New DeFi Blockchain Explained](https://insights.glassnode.com/avalanche-the-new-defi-blockchain-explained/)

Accessibility - The low cost of transactions on Avalanche means that smaller trades are more financially viable, opening up the DeFi ecosystem to smaller players and entry-level investors. While the user experience is still complex and represents a significant barrier to entry, improvements in this area could lead to a wider range of participants in the world of DeFi.  

Low slippage - The slow speed of the Ethereum blockchain often leads to significant slippage and failed transactions when conducting on-chain trades. The faster transaction rate and higher throughput of the Avalanche network opens the door to minimal price slippage and instant trades, bringing the experience of trading on DEXs closer to that of their centralized counterparts.

### 🌍 Upgrade the Project

