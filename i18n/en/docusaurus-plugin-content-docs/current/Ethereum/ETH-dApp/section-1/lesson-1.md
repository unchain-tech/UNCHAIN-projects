---
title: Launch an Ethereum Network in Your Local Environment
---
### ✅ Setting Up the Environment

Here's the overall picture of this project:

1\. **Create a smart contract.**

- Implement all the logic for how users can send you a "👋 (wave)" on the smart contract.
- A smart contract is like **server code**.

2\. **Deploy the smart contract onto the blockchain.**

- Anyone in the world can access your smart contract.
- **The blockchain acts as a server.**

3\. **Build a web application (dApp)**.

- Users can easily interact with your smart contract deployed on the blockchain through a website.
- Smart contract implementation + frontend user interface creation 👉 Let's aim to complete the dApp 🎉

First, you need to have `Node.js`. If you don't have it, visit [here](https://hardhat.org/tutorial/setting-up-the-environment#installing-node.js) to install it. The recommended version for this project is `v20`.

Once the installation is complete, run the following command in your terminal to check the version:

```
$ node -v
v20.5.0
```

### 🍽 Fork the Git Repository to Your GitHub

If you don't have a GitHub account yet, follow the steps [here](https://qiita.com/okumurakengo/items/848f7177765cf25fcde0) to create one.

If you already have a GitHub account, follow the steps below to [fork](https://denno-sekai.com/github-fork/) the repository that will serve as the foundation for the project to your GitHub.

1. Access the ETH-dApp repository from [here](https://github.com/unchain-tech/ETH-dApp) and click the `Fork` button at the top right of the page.

![](/images/ETH-dApp/section-1/1_1_1.png)

2. The Create a new fork page will open, so **make sure the item "Copy the `main` branch only" is checked**.

![](/images/ETH-dApp/section-1/1_1_2.png)

Once the settings are complete, click the `Create fork` button. Confirm that a fork of the `ETH-dApp` repository has been created in your GitHub account.

Now, let's clone the forked repository to your local environment.

First, as shown in the figure below, click the `Code` button, select `SSH`, and copy the Git link.

![](/images/ETH-dApp/section-1/1_1_3.png)

Navigate to any directory where you want to work in your terminal and execute the following using the link you just copied:

```
git clone copied_github_link
```

Once it's successfully cloned, you're ready for local development.

### 🔍 Checking the Folder Structure

Before diving into implementation, let's check the folder structure. The cloned starter project should look like this:

```
ETH-dApp
├── .git/
├── .gitignore
├── .yarnrc.yml
├── LICENSE
├── README.md
├── package.json
├── packages/
│   ├── client/
│   └── contract/
└── yarn.lock
```

The starter project uses a monorepo structure. A monorepo is a method of managing all code for contracts and clients (or other components) together in a single repository.
