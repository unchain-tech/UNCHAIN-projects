#### Creating a Smart Contract with Whitelist Functionality

> Note, this course here may be a bit lengthy, please be patient.

The basic knowledge about smart contracts is ready. Let's update the `Whitelist.sol` contract. Here's what it looks like after the update:

```solidity
//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

contract Whitelist {
    // The address that can operate addAddressToWhitelist function
    address public owner;
    
    // Create a mapping of whitelistedAddresses
    // if an address is whitelisted, we would set it to true, it is false by default for all other addresses.
    mapping(address => bool) private isWhitelisted;

    //Event: record the addresses added to the whitelist
    event AddToWhitelist(address indexed account);
    //Event: record whitelisted excluded addresses
    event RemoveFromWhitelist(address indexed account);

    // Setting the initial whitelisted addresses
    // Setting the address that can operate addAddressToWhitelist function
    // User will put the value at the time of deployment
    constructor(address[] memory initialAddresses) {
        owner =msg.sender;
        for (uint256 i = 0; i < initialAddresses.length; i++) {
            addToWhitelist(initialAddresses[i]);
        }
    }

    /**
        addToWhitelist - This function adds the address of the sender to the
        whitelist
     */

    function addToWhitelist(address _address) public {
        // Check if the user is the owner
        require(owner == msg.sender, "Caller is not the owner");
        // Check if the user has already been whitelisted
        require(!isWhitelisted[_address], "Address already whitelisted");
        // Add the address which called the function to the whitelistedAddress array
        isWhitelisted[_address] = true;
        // Triggers AddToWhitelist event
        emit AddToWhitelist(_address);
    }

    /**
        removeFromWhitelist - This function removes the address of the sender to the
        whitelist
     */

    function removeFromWhitelist(address _address) public {
        // Check if the user is the owner
        require(owner == msg.sender, "Caller is not the owner");
        // Check if the user has not already been whitelisted    
        require(isWhitelisted[_address], "Address not in whitelist");
        // Remove the address which called the function to the whitelistedAddress array
        isWhitelisted[_address] = false;
        // Triggers RemoveFromWhitelist event
        emit RemoveFromWhitelist(_address);
    }

    /**
        whitelistedAddresses - This function gives feedback on whether the input address belongs to the whitelist
     */

    function whitelistedAddresses(address _address) public view returns (bool) {
        return isWhitelisted[_address];
    }
}
```

Let's take it step by step and understand what's happening with this code.

```solidity
    // The address that can operate addAddressToWhitelist function
    address public owner;
```
First, we've set up a state [variable](https://solidity-by-example.org/variables/) called `owner`, with the `data type` address, which refers to the type of wallet address `(e.g., "0xa323A54987cE8F51A648AF2826beb49c368B8bC6")`. The visibility of this variable is set to public, allowing any contract and account to access it. By default, the `owner` is set to 0, but we will configure it later.

```solidity
    // Create a mapping of whitelistedAddresses
    // if an address is whitelisted, we would set it to true, it is false by default for all other addresses.
    mapping(address => bool) private isWhitelisted;
```

`isWhitelisted` is used to determine whether an address is in the whitelist, and it has been set to a [mapping](https://solidity-by-example.org/app/iterable-mapping/) type. If the address is in the whitelist, the corresponding bool is set to true; otherwise, it's false. By default, the bool is false. (Why do we do this? Because it allows us to know which addresses are in the whitelist without using an array, saving a significant amount of gas).

```solidity
    //Event: record the addresses added to the whitelist
    event AddToWhitelist(address indexed account);
    //Event: record whitelisted excluded addresses
    event RemoveFromWhitelist(address indexed account);
```


[Events](https://solidity-by-example.org/events/) allow users to log on the Ethereum network, enabling them to keep track of which addresses have been added to or removed from the whitelist at any time.

```solidity
    // Setting the initial whitelisted addresses
    // Setting the address that can operate addAddressToWhitelist function
    // User will put the value at the time of deployment
    constructor(address[] memory initialAddresses) {
        owner =msg.sender;
        for (uint256 i = 0; i < initialAddresses.length; i++) {
            addToWhitelist(initialAddresses[i]);
        }
    }
```

The [constructor](https://solidity-by-example.org/constructor/) is a function allowed at the time of contract deployment (Note: the constructor is not mandatory). In this case, the constructor takes an initial array of whitelisted addresses and uses a [loop](https://solidity-by-example.org/loop/) to call the addTowhitelist method to set these addresses as whitelisted (don't worry, this will be explained later). At the same time, the owner is set to msg.sender (one of the EVM's unique [global](https://solidity-by-example.org/variables/) variables, which represents the initiator of the call, in this case, the deployer of the contract). This lays the groundwork for permissions to be managed later on.

```solidity
    /**
        addToWhitelist - This function adds the address of the sender to the
        whitelist
     */

    function addToWhitelist(address _address) public {
        // Check if the user is the owner
        require(owner == msg.sender, "Caller is not the owner");
        // Check if the user has already been whitelisted
        require(!isWhitelisted[_address], "Address already whitelisted");
        // Add the address which called the function to the whitelistedAddress array
        isWhitelisted[_address] = true;
        // Triggers AddToWhitelist event
        emit AddToWhitelist(_address);
    }
```

The `function` keyword indicates that `addTowhitelist` is a function, and the `public` visibility specifier shows that this function can be called by any account or contract.

**Call contract**

The first require checks whether the owner is equal to msg.sender (the caller of the function). If not, it will throw an error stating "Caller is not the owner," and the function execution will fail. This way, it restricts the successful call of this function to the owner only.

The second require checks whether the address is already whitelisted. If it is, the function will throw an error stating `"Address already whitelisted"`, and the execution will fail.

If both require statements pass, the address will be set as whitelisted in `isWhitelisted`.

Then, the event is triggered, logging the addition of this address to the whitelist.

This function effectively implements the functionality of adding a new address to the whitelist.

```solidity
    /**
        removeFromWhitelist - This function removes the address of the sender to the
        whitelist
     */

    function removeFromWhitelist(address _address) public {
        // Check if the user is the owner
        require(owner == msg.sender, "Caller is not the owner");
        // Check if the user has not already been whitelisted    
        require(isWhitelisted[_address], "Address not in whitelist");
        // Remove the address which called the function to the whitelistedAddress array
        isWhitelisted[_address] = false;
        // Triggers RemoveFromWhitelist event
        emit RemoveFromWhitelist(_address);
    }
```

This function's functionality is the opposite of the one above, and I believe you can deduce this conclusion by reasoning through it.

```solidity
    /**
        whitelistedAddresses - This function gives feedback on whether the input address belongs to the whitelist
     */

    function whitelistedAddresses(address _address) public view returns (bool) {
        return isWhitelisted[_address];
    }

```

Finally, we need a function to return whether an address belongs to the whitelist.

[view](https://solidity-by-example.org/view-and-pure-functions/) This signifies that the function will not cause a change in state variables, so calling this function in the EVM will not consume gas. The "return" indicates that this function will return a value, with the value being of the bool type.

Alright, next we'll compile and deploy this contract using JS VM.

![image-20230222180958479](/public/images/Polygon-Whitelist-NFT/section-1/1_3_1.png)

Here, we need to enter an array of addresses, which can be obtained from the JS VM accounts below, and switch accounts as needed.

Like: `["0x5B38Da6a701c568545dCfcB03FcB875f56beddC4","0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2"]`

![image-20230222180944652](/public/images/Polygon-Whitelist-NFT/section-1/1_3_2.png)

After deployment is complete, you can call the contract. Try entering some addresses to test it.

![image-20230222181353308](/public/images/Polygon-Whitelist-NFT/section-1/1_3_3.png)

Alright, the whitelist contract is now complete. Next, we will move on to the smart contract writing module for the NFT (Non-Fungible Token) part.