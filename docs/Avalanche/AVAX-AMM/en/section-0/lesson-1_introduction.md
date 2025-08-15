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

If you're new to development on `Avalanche` or have no experience writing smart contract tests with `hardhat`, [AVAX-Messenger](https://buidl.unchain.tech/AVAX-Messenger/ja/section-0/lesson-1_Avalanche%E3%83%8D%E3%83%83%E3%83%88%E3%83%AF%E3%83%BC%E3%82%AF%E4%B8%8A%E3%81%A7WEB%E3%82%A2%E3%83%97%E3%83%AA%E3%82%92%E6%A7%8B%E7%AF%89%E3%81%97%E3%82%88%E3%81%86/) offers a more detailed explanation, so starting there may help things go more smoothly.

### 🛠 What Will We Build?

We’ll be building a **decentralized web application （dApp）** called `Miniswap`.

`Miniswap` consists of a smart contract that has `AMM` functionality, and a frontend codebase that acts as an interface for users to interact with the smart contract.

We’ll use `Solidity` for the smart contract,
and `TypeScript` + `React.js` + `Next.js` for the frontend.

The completed smart contract will be deployed to [FUJI C-Chain](https://build.avax.network/docs/quick-start/networks/fuji-testnet).

For an overview of Avalanche and the C-Chain, please refer to [this link]([https://app.unchain.tech/learn/AVAX-Messenger/ja/0/1/](https://buidl.unchain.tech/AVAX-Messenger/ja/section-0/lesson-1_Avalanche%E3%83%8D%E3%83%83%E3%83%88%E3%83%AF%E3%83%BC%E3%82%AF%E4%B8%8A%E3%81%A7WEB%E3%82%A2%E3%83%97%E3%83%AA%E3%82%92%E6%A7%8B%E7%AF%89%E3%81%97%E3%82%88%E3%81%86/)).

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

Projects on [UNCHAIN](https://unchain.tech/) are maintained under the [UNCHAIN License](https://github.com/unchain-dev/UNCHAIN-projects/blob/main/LICENSE).

If you're participating in the project and think, “This could be clearer!” or “This is incorrect!”
Feel free to send a `pull request`.

To edit the code directly on GitHub and send a `pull request`, refer to [this guide](https://docs.github.com/en/repositories/working-with-files/managing-files/editing-files).

All kinds of requests are welcome 🎉

You can also `Fork` the project to your own GitHub account, edit it there, and send a `pull request`.

* To `Fork` a project, see [this guide](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/fork-a-repo)
* To create a `pull request` from a `Fork`, see [this guide](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request-from-a-fork)

**👋 Send a `pull request` to `UNCHAIN-projects`! ⏩ Access [UNCHAIN’s GitHub](https://github.com/unchain-tech/UNCHAIN-projects)!**

### ⚡️ Create an `Issue`

If it’s not quite worth a `pull request` but you still want to leave a suggestion,
create an `Issue` [here](https://github.com/unchain-tech/UNCHAIN-projects/issues).

For how to create an `Issue`, refer to [this guide](https://docs.github.com/en/issues/tracking-your-work-with-issues/using-issues/creating-an-issue).

Creating `pull requests` or `issues` is a key part of real-world team development, so be sure to give it a try!

Let’s work together to make UNCHAIN’s projects even better ✨

> For Windows users
> If you're using Windows, we recommend downloading [Git for Windows](https://gitforwindows.org/) and using the included Git Bash.
> This guide supports UNIX-specific commands.
> [Windows Subsystem for Linux (WSL)](https://docs.microsoft.com/en-us/windows/wsl/install) is also an option.

---

Let’s move on to the next lesson and set up your programming environment 🎉

---

Documentation created by [ryojiroakiyama](https://github.com/ryojiroakiyama)（UNCHAIN Discord ID: rakiyama#8051）

---
