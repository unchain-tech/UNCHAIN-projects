---
title: Build a Web App on the Ethereum Network
---
### 👋 Welcome to the dApp Development Project!

In this project, we will implement a smart contract on the Ethereum network and build a custom web application that can interact with the smart contract.

To proceed with this project, you will need the following skills:

- [Terminal operations](https://qiita.com/ryouzi/items/f9dee1540a04a0bfb9a3)
- [Javascript](https://developer.mozilla.org/en/docs/Web/JavaScript)
- [React.js](https://reactjs.org/)

You don't need to understand everything right now.
If you have any questions, search the internet or ask in the community as you work through the project!
If you're new to development, we recommend starting with this project ☺️

### ⛓ What is Blockchain?

Blockchain is a peer-to-peer network of computers (nodes) that communicate with each other.

It's a decentralized network where all participants share responsibility for operating the network, so each network participant maintains a copy of the code and data on the blockchain.

All this data is contained in bundles of records called "blocks," which are "chained" together to form a blockchain.

Every node on the network ensures that this data is secure and immutable, unlike centralized applications where code and data can be changed at any time. This is what makes blockchain powerful ✨

Because blockchain is responsible for storing data, it is fundamentally a database.

And since it's a network of computers talking to each other, it's a network. You can think of it as a unified combination of network and database.

Another fundamental difference between traditional web applications and blockchain applications is that the application does not manage any user data. User data is managed by the blockchain.

### 🥫 What is a Smart Contract?

A smart contract is a mechanism that automatically executes contracts on the blockchain.

A common analogy is a vending machine. A vending machine has a program that says "when 100 yen is inserted and a button is pressed, drop a drink," and doesn't require the process of "a clerk receiving money and handing over a drink."

The reason smart contracts are called "smart" is precisely because they eliminate human intervention and execute programs automatically.

In practice, smart contracts consist of programs that are replicated and processed across all computers on the Ethereum network.

Due to Ethereum's versatility, you can build applications on its network.

All smart contract code is immutable, meaning it **cannot be changed**.

In other words, once you deploy a smart contract to the blockchain, you cannot change or update the code.

This is a design feature to ensure code reliability and security.

I often compare smart contracts to microservices on the web. They function as an interface for reading and writing data from the blockchain and executing business logic. They are publicly accessible, meaning anyone who can access the blockchain can access that interface.

### 📱 What are dApps?

dApps stands for **decentralized Applications**.

dApps refer to applications that combine smart contracts built on the blockchain with a frontend user interface (such as a website).

dApps are built on Solidity, Ethereum's programming language.

In Ethereum, smart contracts are accessible to anyone like open APIs. Therefore, you can call smart contracts written by others from your web application. And vice versa.

### 🛠 What Will We Build?

We will build a **decentralized web application (dApp)** called WavePortal.

WavePortal will implement the following features:

1. Anyone on the internet can send you a "👋 + message".
2. That data will be stored on the blockchain via an Ethereum smart contract.
3. Users who wave to you might get lucky and win a small amount of ETH from your site 🎉

In this project, we will specifically implement:

- Connecting users' wallets to your WavePortal.
- Implementing functionality that allows users to interact with smart contracts through the web application.

We'll implement the backend in Solidity and build the frontend in React.

### 🌍 Upgrading this Project

This learning content is operated under [Attribution-ShareAlike 4.0 International](https://creativecommons.org/licenses/by-sa/4.0/) © 2022 buildspace license and [UNCHAIN License](https://github.com/unchain-tech/UNCHAIN-projects/blob/main/LICENSE).

If you're participating in the project and think, "This could be clearer if done this way!" or "This is incorrect!", please feel free to send a `pull request`.

For instructions on how to edit code directly from GitHub and send a `pull request` directly, see [here](https://docs.github.com/en/repositories/working-with-files/managing-files/editing-files#editing-files-in-another-users-repository).

Any requests are welcome 🎉

You can also `Fork` the project to your own GitHub account, edit the contents, and send a `pull request`.

- For instructions on how to `Fork` a project, see [here](https://docs.github.com/en/get-started/quickstart/fork-a-repo).
- For instructions on how to create a `pull request` from a `Fork`, see [here](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request-from-a-fork).

**👋 Send a `pull request` to `UNCHAIN-projects`! ⏩ Visit [UNCHAIN's GitHub](https://github.com/unchain-tech/UNCHAIN-projects)!**

### ⚡️ Create an `Issue`

If you feel that you don't need to send a `pull request` but want to leave a suggestion, you can create an `Issue` [here](https://github.com/unchain-tech/UNCHAIN-projects/issues).

For instructions on how to create an `Issue`, see [here](https://docs.github.com/en/issues/tracking-your-work-with-issues/creating-an-issue).

Creating `pull requests` and `issues` are important tasks when actually developing as a team, so please give it a try.

Let's make UNCHAIN projects better together ✨

---

Let's move on to the next lesson and set up your programming environment 🎉

---

Attribution: This learning content is licensed under [Attribution-ShareAlike 4.0 International](https://creativecommons.org/licenses/by-sa/4.0/) © 2022 buildspace. 
Sharelike: Translations and modifications to markdown documents.

Documentation created by [yukis4san](https://github.com/yukis4san)（UNCHAIN discord ID: yshimura#7617）

