---
title: Create a Smart Contract with Solidity
---
### 👩‍💻 Creating a Contract

We'll create a smart contract that tracks the total number of "👋 (waves)". The smart contract we create here can be freely modified later to suit your use case.

Create a file named `WavePortal.sol` under the `contracts` directory.

When using Hardhat, the file structure is very important, so you need to be careful. If your file structure looks like the following, you're good to go 😊

```
packages/
└── contract/
    └── contracts/
        └── WavePortal.sol
```

Next, open the project code in your code editor.

We recommend using VS Code. You can download it from [here](https://azure.microsoft.com/en-us/products/visual-studio-code/).

See [here](https://maku.blog/p/f5iv9kx/) for how to launch VS Code from the terminal.

- Run the `code` command in your terminal

This will make it much easier to launch VS Code in the future, so please give it a try.

As a coding support tool, we recommend downloading the Solidity extension on VS Code.

You can download it from [here](https://marketplace.visualstudio.com/items?itemName=JuanBlanco.solidity).

Now, let's create the contents of `WavePortal.sol`.

Open `WavePortal.sol` in VS Code and enter the following:

```solidity
// SPDX-License-Identifier: MIT

pragma solidity ^0.8.19;

import "hardhat/console.sol";

contract WavePortal {
    constructor() {
        console.log("Here is my first smart contract!");
    }
}
```

Let's look at the code in detail.

```solidity
// SPDX-License-Identifier: MIT
```

This is called an "SPDX License Identifier" and is an identifier that makes the type of software license immediately recognizable.

For more details, please refer to [here](https://www.skyarch.net/blog/?p=15940).

```solidity
pragma solidity ^0.8.19;
```

This is the version of the Solidity compiler used by the contract.

The above code declares that we will only use compiler version `0.8.19` or higher and below version `0.9.0`, and will not use any other versions.

Make sure the compiler version is the same as what's listed in `hardhat.config.js`.

If the Solidity version listed in `hardhat.config.js` is not `0.8.19`, change the contents of `WavePortal.sol` to match the version listed in `hardhat.config.js`.

```solidity
import "hardhat/console.sol";
```

We're importing Hardhat's `console.sol` file to output console logs to the terminal when executing the contract.

This is a very useful tool for debugging smart contracts in the future.

```solidity
contract WavePortal {
    constructor() {
        console.log("Here is my first smart contract!");
    }
}
```

`contract` is like a "[class](https://wa3.i-3-i.info/word1120.html)" in other languages.

When you initialize this `contract`, the `constructor` is executed and the contents of `console.log` are displayed in the terminal.

For more on the concept of classes, refer to [here](https://aiacademy.jp/media/?p=131).

### 🔩 What is a Constructor?

`constructor` is an optional function used to initialize the state variables of a `contract`.

We'll explain this in more detail later, so for now, please understand the following characteristics of `constructor`:

- A `contract` can only have one `constructor`.
- The `constructor` is executed only once when the smart contract is created and is used to initialize the state of the `contract`.
- After the `constructor` is executed, the code is deployed to the blockchain.

### 🙋‍♂️ Asking Questions

If you have any questions about the work so far, please ask in Discord's `#ethereum` channel.

To help the process of providing assistance flow smoothly, please include the following 3 points in your error report ✨

```
1. Section number and lesson number related to the question
2. What you were trying to do
3. Copy & paste the error message
4. Screenshot of the error screen
```

---

In the next lesson, we'll run the smart contract.
