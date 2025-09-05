---
title: Course Introduction
---
## GETTING STARTED

### 🎉 Course Introduction

This workshop is built around Scaffold-ETH 2 and The Graph. You will learn how to:

1. Setup a development environment for your dapp using Scaffold-ETH 2 and The Graph
2. Update and deploy your smart contract
3. Create and deploy a Subgraph to The Graph
4. Edit your frontend to interact with both your smart contract and Subgraph

### 🏗 What is Scaffold-ETH 2 🏗

🧪 An open-source, up-to-date toolkit for building decentralized applications（dApps）on the Ethereum blockchain. It's designed to make it easier for developers to create and deployスマートコントラクトand build user interfaces that interact with those contracts.

⚙️ Built using NextJS, RainbowKit, Hardhat, Wagmi, and Typescript.

- ✅ **Contract Hot Reload**: Your frontend auto-adapts to your smart contract as you edit it.
- 🔥 **Burner Wallet & Local Faucet**: Quickly test your application with a burner wallet and local faucet.
- 🔐 **Integration with Wallet Providers**: Connect to different wallet providers and interact with the Ethereum network.

![](/images/TheGraph-ScaffoldEth2/section-0/0_1_1.png)

![](/images/TheGraph-ScaffoldEth2/section-0/0_1_2.png)

![](/images/TheGraph-ScaffoldEth2/section-0/0_1_3.png)

![](/images/TheGraph-ScaffoldEth2/section-0/0_1_4.png)

To learn more about Scaffold-ETH checkout the [Github repository](https://github.com/scaffold-eth/scaffold-eth-2) or [Scaffoldeth.io](https://scaffoldeth.io).

### 🧑🏼‍🚀 What is The Graph?

[The Graph](https://thegraph.com/) is a protocol for building decentralized applications（dApps）quickly on Ethereum and IPFS using GraphQL.

- 🗃️ **Decentralized Indexing**: The Graph enables open APIs（"subgraphs"）to efficiently index and organize blockchain data.
- 🔎 **Efficient Querying**: The protocol uses GraphQL for streamlined querying blockchain data.
- 🙌 **Community Ecosystem**: The Graph fosters collaboration by empowering developers to build, deploy, and share subgraphs!

For detailed instructions and more context, check out the [Getting Started Guide](https://thegraph.com/docs/en/cookbook/quick-start).

### 🧱 What we are building

We are building an example smart contract and front end that utilizes The Graph protocol for data storage of event data.

https://sendmessage-tau.vercel.app

![](/images/TheGraph-ScaffoldEth2/section-0/0_1_5.png)

### 🌍 Upgrading this project

This learning content is operated under[UNCHAIN License](https://github.com/unchain-tech/UNCHAIN-projects/blob/main/LICENSE).

If you're participating in the project and think, 'This could be clearer if done this way!' or 'This is incorrect!', please feel free to send a `pull request`.

To edit code directly from GitHub and send a `pull request` directly, see [here](https://docs.github.com/en/repositories/working-with-files/managing-files/editing-files#editing-files-in-another-users-repository).

Any requests are welcome 🎉.

You can also `Fork` the project to your own GitHub account, edit the contents, and send a `pull request`.

- See [here](https://docs.github.com/en/get-started/quickstart/fork-a-repo) for instructions on how to `Fork` a project.
- How to create a `pull request` from a `Fork` is [here](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request-from-a-fork).

**👋 Send a `pull request` to `UNCHAIN-projects`! ⏩ Visit [UNCHAIN's GitHub](https://github.com/unchain-tech/UNCHAIN-projects)!**

### ⚡️ Create an `Issue`

If you feel that you want to leave a suggestion but not enough to send a `pull request`, you can create an `Issue` at [here](https://github.com/unchain-tech/UNCHAIN-projects/issues).

See [here](https://docs.github.com/en/issues/tracking-your-work-with-issues/creating-an-issue) for information on how to create an `Issue`.

Creating `pull request` and `issues` is an important task when actually developing as a team, so please try it.

Let's make the UNCHAIN project better together ✨.

### 🙋‍♂️ Asking Questions

If you have any questions or uncertainties up to this point, please ask in the `#thegraph` channel on Discord.

## Requirements

### ✅ What you will need

Before you begin, you need to install the following tools:

- [Node.js](https://nodejs.org/en/download/)
- Yarn ([v1](https://classic.yarnpkg.com/en/docs/install/) or [v2+](https://yarnpkg.com/getting-started/install))
- [Git](https://git-scm.com/downloads)
- [Docker](https://docs.docker.com/get-docker/)

## Setup Scaffold-ETH 2

### 🖥️ Setup Subgraph Package

First, we will start out with a special build of Scaffold-ETH 2 written by Simon from Edge and Node… Thanks Simon! 🫡

We will need a total of four different Windows to setup Scaffold-ETH 2 and The Graph.

![](/images/TheGraph-ScaffoldEth2/section-0/0_3_1.png)

```
git clone -b subgraph-package \
  https://github.com/scaffold-eth/scaffold-eth-2.git \
  scaffold-eth-2-subgraph-package
```

Once you have this checked out on your machine, navigate into the directory and install all of the dependencies using yarn.

```
cd scaffold-eth-2-subgraph-package && \
  yarn install
```

![](/images/TheGraph-ScaffoldEth2/section-0/0_3_2.png)

Next, we will want to start up our local blockchain so that we can eventually deploy and test ourスマートコントラクト. Scaffold-ETH 2 comes with Hardhat by default. To spin up the chain just type the following yarn command…

```
yarn chain
```

![](/images/TheGraph-ScaffoldEth2/section-0/0_3_3.png)

> You will keep this window up and available so that you can see any output from hardhat console. 🖥️

Next we are going to spin up our frontend application. Scaffold-ETH 2 comes with NextJS by default and also can be started with a simple yarn command. You will need to open up a new command line and type the following…

```
yarn start
```

![](/images/TheGraph-ScaffoldEth2/section-0/0_3_4.png)

> You will also want to keep this window up at all times so that you can debug any code changes you make to NextJS, debug performance or just check that the server is running properly.

Next, you will want to open up a third window where you can deploy your smart contract, along with some other useful commands found in Scaffold-ETH. To do a deploy you can simply run the following…

```
yarn deploy
```

![](/images/TheGraph-ScaffoldEth2/section-0/0_3_5.png)

> You should get a tx along with an address and amount of gas spent on the deploy. ⛽

If you navigate to http://localhost:3000 you should see the NextJS application. Explore the menus and features of Scaffold-ETH 2! Someone call in an emergency, cause hot damn that is fire! 🔥

You can test by sending an update to the setGreeting function. In order to do this you will need to get some gas by clicking cash icon in the top right hand corner next to the burner wallet address. This will send you 1 ETH from the faucet.

Then you can simply navigate to "Debug Contracts", click the string field under setGreeting and type something fun and then click "SEND"

![](/images/TheGraph-ScaffoldEth2/section-0/0_3_6.png)

After this is complete you should also get a transaction receipt that you can expand below to verify it was successful.

## Setup The Graph （Docker）

### 🚀 Setup The Graph Integration

Now that we have spun up our blockchain, started our frontend application and deployed our smart contract, we can start setting up our subgraph and utilize The Graph!

First run the following to clean up any old data. Do this if you need to reset everything.

```
yarn clean-node
```

> We can now spin up a graph node by running the following command… 🧑‍🚀

```
yarn run-node
```

![](/images/TheGraph-ScaffoldEth2/section-0/0_4_1.png)

This will spin up all the containers for The Graph using docker-compose. You will know this is complete when it reads "Downloading latest blocks from Ethereum..."

> As stated before, be sure to keep this window open so that you can see any log output from Docker. 🔎

## Deploy

### ✅ Create and ship our Subgraph

Now we can open up a fourth window to finish setting up The Graph. 😅 In this forth window we will create our local subgraph!

> Note: You will only need to do this once.

```
yarn local-create
```

![](/images/TheGraph-ScaffoldEth2/section-0/0_5_1.png)

> You should see some output stating your Subgraph has been created along with a log output on your graph-node inside docker.

Next we will ship our subgraph! You will need to give your subgraph a version after executing this command.（e.g. 0.0.1）.

```
yarn local-ship
```

![](/images/TheGraph-ScaffoldEth2/section-0/0_5_2.png)

> This command does the following all in one… 🚀🚀🚀

- Copies the contracts ABI from the hardhat/deployments folder
- Generates the networks.json file
- Generates AssemblyScript types from the subgraph schema and the contract ABIs.
- Compiles and checks the mapping functions.
- … and deploy a local subgraph!

> If you get an error ts-node you can install it with the following command

```
npm install -g ts-node
```

If your subgraph deployment was successful it will look something like this:

![](/images/TheGraph-ScaffoldEth2/section-0/0_5_3.png)

You should get a build completed output along with the address of your Subgraph endpoint.

```
Build completed: QmYdGWsVSUYTd1dJnqn84kJkDggc2GD9RZWK5xLVEMB9iP

Deployed to http://localhost:8000/subgraphs/name/scaffold-eth/your-contract/graphql

Subgraph endpoints:
Queries (HTTP):     http://localhost:8000/subgraphs/name/scaffold-eth/your-contract
```

## Test

### ✅ Test your Subgraph

Go ahead and head over to your subgraph endpoint and take a look!

> Here is an example query…

```
  {
    greetings(first: 25, orderBy: createdAt, orderDirection: desc) {
      id
      greeting
      premium
      value
      createdAt
      sender {
        address
        greetingCount
      }
    }
  }
```

![](/images/TheGraph-ScaffoldEth2/section-0/0_6_1.png)

> If all is well and you’ve sent a transaction to your smart contract then you will see a similar data output!

Next up we will dive into a bit more detail on how The Graph works. As you start adding events to your smart contract, you can start indexing and parsing the data you need for your front end application.
