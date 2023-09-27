### Deploy a smart contract with whitelist function
#### First attempt

Are you ready? Let's get started!

First, let's create a folder called `contracts` in the explorer in the left side.

![image-20230222151853564](/public/images/Polygon-Whitelist-NFT/section-1/1_2_1.png)

Then, create a new smart contract file called `Whitelist.sol` under folder `contracts`

![image-20230222152021342](/public/images/Polygon-Whitelist-NFT/section-1/1_2_2.png)

In `Whitelist.sol`, let's start with a simple block of code.

```solidity
// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.4;

contract Whitelist {
    constructor() {
    }
}
```

Let's talk about the code line by line.

```solidity
// SPDX-License-Identifier: UNLICENSED
```

This line is referred to `SPDX license identifier`, which addresses the copyright issues of the code that follows. Generally speaking, `UNLICENSED` and `MIT` are the most common suffixes, indicating that the following code is permitted for anyone to use. In other words, you all can freely copy and paste it. You can find more information [here](https://spdx.org/licenses/?utm_source=buildspace.so&utm_medium=buildspace_project).

```solidity
pragma solidity ^0.8.4;
```

This specifies the version of the Solidity compiler that we want the contract to use. It means that only a Solidity compiler with a version between `0.8.4` and `0.9.0` can be used to compile the code.

```solidity
contract Whitelist {
    constructor() {

    }
}
```

This is the main body of the Solidity code. A `.sol` file can contain multiple contracts, but the name of the primary contract must be the same as the file name, which is `Whitelist` in this case. Here we only include one contract. The constructor is a function that will run when the contract is deployed. Additionally, the first set of curly braces `{}` will contain state variables, functions, etc., and these generally make up about 85~95% of the code.

#### How to run the code

Click on the Compile panel on the right, and you'll see that ChainIDE has automatically selected the Compiler verison for us. Selecting Optimization will optimize the compiled bytecode, and it can save more Gas when deploying. We won't need to tick that for now so just click on `Compile Whitelist.sol`.

![image-20230222154237333](/public/images/Polygon-Whitelist-NFT/section-1/1_2_3.png)

You can see that the ABI and BYTE CODE have been generated below. Generally speaking, the ABI defines the communication protocol between the smart contract and other applications, enabling them to call and interact with each other. In fact, this is very helpful for how the smart contract interacts with the frontend. BYTE CODE is a binary encoding, and the underlying principle for deploying contracts on EVM-based chains (such as ETH, Polygon, BNB Chain, Conflux, and other chains that use EVM as a foundation) is achieved through uploading BYTE CODE.

![image-20230222155740298](/public/images/Polygon-Whitelist-NFT/section-1/1_2_4.png)

Switch to the Deploy & Interaction panel, connect to JS VM (JS VM is an EVM implemented in JavaScript, very convenient for browser-side testing), and click Deploy

![image-20230222155859096](/public/images/Polygon-Whitelist-NFT/section-1/1_2_5.png)

In the `INTERACT` section below, you can see the smart contract we've just deployed. Since there are no functions and state variables yet, it's completely empty. Next, we'll start adding those elements to make the smart contract more substantial.

![image-20230222160157031](/public/images/Polygon-Whitelist-NFT/section-1/1_2_6.png)
