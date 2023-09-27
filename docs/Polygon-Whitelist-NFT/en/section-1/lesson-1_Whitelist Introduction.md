## Implementing whitelist in a smart contract.

### 🎓 What is whitelist?

Typically, a whitelist refers to a list of entities that are allowed access, such as a list of IP addresses that can access a particular website, a list of software that is allowed to be installed, a list of email domain names that are allowed to be used, etc. In this lesson, we'll use Solidity (one of Ethereum's smart contract programming languages) to write a simple whitelist function, allowing users on the whitelist to have the permission to mint NFTs.

### 📝 Ways to implement whitelist

Usually we have three ways,

1 By using arrays and mapping to store and determine whether an address is in the whitelist.

2 By using a Merkle tree to determine whether an address is in the whitelist.

3 By using a signature to grant an address whitelist permissions.

For beginners, Method 1 is the easiest way to understand, so in this course, we will use Solidity to store and determine whether an address is in the whitelist by using arrays and mapping.

### 🙋‍♂️ Asking Questions
If you have any questions or uncertainties up to this point, please ask in the `#polygon` channel on Discord.