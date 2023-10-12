### 💳　Write an NFT contract that only allows addresses within the whitelist to MINT.

For our dApp smart contract, we choose the ERC 721 contract which is the same as BAYC. We will modify it by adding a whitelist restriction feature.

```solidity
    address public owner;

    constructor(address[] memory initialAddresses) {
        owner = msg.sender;
		...
    }
    
    function addToWhitelist(address _address) public {
        // Check if the user is the owner
        require(owner == msg.sender, "Caller is not the owner");
        ...
    }
```


In the whitelist contract, we set the owner address and use the `require` method to ensure that the functionality to add or remove from the whitelist can only be invoked by the contract deployer.

Here, we'll use a more secure and efficient way — the [OpenZeppelin](https://www.openzeppelin.com/about) smart contract library.

We will use [OpenZeppelin](https://www.openzeppelin.com/about)'s `Ownable.sol` to help us implement the owner privilege functionality.

* By default, the owner of the Ownable contract is the account that deploys it.
- Ownable also allows you to:
  - Transfer ownership of the owner's account to a new account, and
  - Renounce ownership: The owner gives up this administrative privilege, a common pattern after the initial management phase of the contract, making the contract more decentralized.

Additionally, we will use an extension of the ERC721 contract called [ERC721 Enumerable](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/extensions/ERC721Enumerable.sol), which includes all the features of ERC721 along with some additional implementations.

- ERC721 Enumerable helps you keep track of all tokenIds within a contract and the tokensIds held by a given address within the contract.
- It implements various helpful [functions](https://docs.openzeppelin.com/contracts/4.x/api/token/erc721#ERC721Enumerable) such as `tokenOfOwnerByIndex`. 

We will create a folder named "`interfaces`" under the "`contracts`" directory.

![image-20230222235209219](/public/images/Polygon-Whitelist-NFT/section-2/2_2_1.png)

Within the "`interfaces`" folder, we'll create a contract named `IWhitelist.sol`.

> Note: Solidity files that contain only interfaces typically have a prefix `I` to indicate that they are just an [interface](https://solidity-by-example.org/interface/).

![image-20230222235330497](/public/images/Polygon-Whitelist-NFT/section-2/2_2_2.png)

We'll insert the following code into the `IWhitelist.sol`.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IWhitelist {
    function whitelistedAddresses(address) external view returns (bool);
}
```
This is an interface file. It makes it convenient for other smart contracts to call the `whitelistedAddresses` function in `Whitelist.sol`. Which in turn verifies whether an address is in the whitelist.

Next, we will create `Shield.sol` under the folder `contracts`.

![image-20230223091938319](/public/images/Polygon-Whitelist-NFT/section-2/2_2_3.png)

We insert the code below in `Shield.sol`.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/IWhitelist.sol";

contract Shield is ERC721Enumerable, Ownable {
    /**
      * @dev _baseTokenURI for computing {tokenURI}. If set, the resulting URI for each
      * token will be the concatenation of the `baseURI` and the `tokenId`.
      */
    string private _baseTokenURI;

    // price is the price of one Shield NFT
    uint256 public price = 0.01 ether;

    // paused is used to pause the contract in case of an emergency
    bool public paused;

    // max number of Shield NFT
    uint256 public maxTokenIds = 4;

    // total number of tokenIds minted
    uint256 public tokenIds;

    // Whitelist contract instance
    IWhitelist private _whitelist;

    modifier onlyWhenNotPaused {
        require(!paused, "Contract currently paused");
        _;
    }

    /**
      * @dev ERC721 constructor takes in a `name` and a `symbol` to the token collection.
      * name in our case is `Shields` and symbol is `CS`.
      * Constructor for Shields takes in the baseURI to set _baseTokenURI for the collection.
      * It also initializes an instance of whitelist interface.
      */
    constructor (string memory baseURI, address whitelistContract) ERC721("ChainIDE Shields", "CS") {
        _baseTokenURI = baseURI;
        _whitelist = IWhitelist(whitelistContract);
    }


    /**
      * @dev presaleMint allows a user to mint one NFT per transaction during the presale.
      */
    function mint() public payable onlyWhenNotPaused {
        require(_whitelist.whitelistedAddresses(msg.sender), "You are not whitelisted");
        require(tokenIds < maxTokenIds, "Exceeded maximum Shields supply");
        require(msg.value >= price, "Ether sent is not correct");
        tokenIds += 1;
        //_safeMint is a safer version of the _mint function as it ensures that
        // if the address being minted to is a contract, then it knows how to deal with ERC721 tokens
        // If the address being minted to is not a contract, it works the same way as _mint
        _safeMint(msg.sender, tokenIds);
    }

    /**
    * @dev _baseURI overides the Openzeppelin's ERC721 implementation which by default
    * returned an empty string for the baseURI
    */
    function _baseURI() internal view virtual override returns (string memory) {
        return _baseTokenURI;
    }

    /**
    * @dev setPaused makes the contract paused or unpaused
      */
    function setPaused(bool val) public onlyOwner {
        paused = val;
    }

    /**
    * @dev withdraw sends all the ether in the contract
    * to the owner of the contract
      */
    function withdraw() public onlyOwner  {
        address _owner = owner();
        uint256 amount = address(this).balance;
        (bool sent, ) =  _owner.call{value: amount}("");
        require(sent, "Failed to send Ether");
    }
}
```
Don't worry, lets talk about this contract step by step.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/IWhitelist.sol";

contract Shield is ERC721Enumerable, Ownable {
	...
	}
```
A lot is happening here like `ERC721Enumerable` and `Ownable`. First, you'll notice that when declaring the contract, I "inherit" from two OpenZeppelin contracts. You can read more about inheritance [here](https://solidity-by-example.org/inheritance/?utm_source=buildspace.so&utm_medium=buildspace_project), but essentially, this means that our Shield contract's code includes the code from two contracts, ERC721Enumerable and Ownable. This saves us from having to rewrite the code to implement these two functionalities.

Let's explain a few of the more significant state variables below.

```solidity
    /**
      * @dev _baseTokenURI for computing {tokenURI}. If set, the resulting URI for each
      * token will be the concatenation of the `baseURI` and the `tokenId`.
      */
    string _baseTokenURI;
    // total number of tokenIds minted
    uint256 public tokenIds;
```

`_baseTokenURI` is the root link for our `NFT Metadata`, for example: `ipfs://QmeSjSinHpPnmXmspMjwiXyN6zS4E9zccariGR3jxcaWtq/` (IPFS is a decentralized storage protocol, which we will discuss later), or it can also be a centralized address, such as: `https://xxxxxxxxxxxx/`.

`tokenIds` represent the numerical IDs for each NFT, and these IDs are unique. When combined with `_baseTokenURI`, they form the Metadata for each NFT. (We'll talk about Metadata shortly. For now, just remember that having Metadata allows your NFT to be displayed on various NFT platforms.)

```solidity
    // price is the price of one Shield NFT
    uint256 public price = 0.01 ether;
    
    // max number of Shield NFT
    uint256 public maxTokenIds = 4;
```

`price` sets the price for each NFT. In Ethereum (ETH), it refers to ETH itself, while in Polygon, it refers to Matic. Apart from ether, there are other units as well: 1 ether = 10^9 gwei, and 1 gwei = 10^9 wei.

`maxTokenIds` indicates the maximum quantity of NFTs. Here, it's set to 4, which means you need to prepare metadata for four NFTs.

```solidity
    /**
      * @dev ERC721 constructor takes in a `name` and a `symbol` to the token collection.
      * name in our case is `Shields` and symbol is `CS`.
      * Constructor for Shields takes in the baseURI to set _baseTokenURI for the collection.
      * It also initializes an instance of whitelist interface.
      */
    constructor (string memory baseURI, address whitelistContract) ERC721("ChainIDE Shields", "CS") {
        _baseTokenURI = baseURI;
        _whitelist = IWhitelist(whitelistContract);
    }
```

When deploying the contract, we need to input the `_baseTokenURI` and the address of the `_whitelist` contract. Simultaneously, we also set the name of this NFT as "ChainIDE Shields," with the symbol "CS".

```solidity
     /**
      * @dev presaleMint allows a user to mint one NFT per transaction during the presale.
      */
    function mint() public payable onlyWhenNotPaused {
        require(_whitelist.whitelistedAddresses(msg.sender), "You are not whitelisted");
        require(tokenIds < maxTokenIds, "Exceeded maximum Shields supply");
        require(msg.value >= price, "Ether sent is not correct");
        tokenIds += 1;
        //_safeMint is a safer version of the _mint function as it ensures that
        // if the address being minted to is a contract, then it knows how to deal with ERC721 tokens
        // If the address being minted to is not a contract, it works the same way as _mint
        _safeMint(msg.sender, tokenIds);
    }
```

Let's focus on explaining the `mint` function:

1. The keyword `payable` indicates that this function can receive tokens directly, as the price of an NFT is 0.01 ether. The usage of onlyWhenNotPaused employs a [modifier](https://solidity-by-example.org/function-modifier/), which signifies that the function can only proceed when `paused` is `false`. (Note: The contract starts with paused being false, allowing whitelist users to directly mint after contract deployment.)

```solidity
    modifier onlyWhenNotPaused {
        require(!paused, "Contract currently paused");
        _;
    }
```

2. `require(_whitelist.whitelistedAddresses(msg.sender), "You are not whitelisted");` This effectively restricts participation in the minting process to users who are on the whitelist.

3. `require(tokenIds < maxTokenIds, "Exceeded maximum Shields supply");` Here, the maximum quantity of `tokenIds` is restricted to not exceed the set `maxTokenIds`, which is 4.

4. `require(msg.value >= price, "Ether sent is not correct"); ` It requires that the incoming tokens must be greater than or equal to 0.01 ether. If they are greater than 0.01 ether, that's also perfectly fine! 😄

5. `tokenIds += 1;` After all the aforementioned conditions are met, `tokenIds` will be incremented by 1. Remember, the default value of `tokenIds` is 0, so our `tokenIds` range becomes 1, 2, 3, 4.

6.  `_safeMint(msg.sender, tokenIds);` This is the functionality implemented by `"@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol"`. You can explore the specific functionalities by opening that contract. For now, we only need to understand that this will result in minting an NFT to the caller of this function.

```solidity
    /**
    * @dev setPaused makes the contract paused or unpaused
      */
    function setPaused(bool val) public onlyOwner {
        paused = val;
    }
```

Setting the minting of the contract to be paused is achieved through the `paused` variable, which is of type bool and is initially set to `false`. Therefore, only the `owner` needs to invoke this function before users can start minting.

```solidity
    /**
    * @dev withdraw sends all the ether in the contract
    * to the owner of the contract
      */
    function withdraw() public onlyOwner  {
        address _owner = owner();
        uint256 amount = address(this).balance;
        (bool sent, ) =  _owner.call{value: amount}("");
        require(sent, "Failed to send Ether");
    }
```

To withdraw the `ether` from the contract, the `withdraw()` function comes into play. This piece of code's purpose is to transfer the funds within the contract to the `owner`. There are multiple ways to handle token transfers, as illustrated in various implementations outlined [here](https://solidity-by-example.org/sending-ether/). In this case, we're using a `call` method.

Next, let's compile and deploy this smart contract using the `JS VM`. (You can simply stick with the compiler automatically chosen by ChainIDE.)

![image-20230223092112169](/public/images/Polygon-Whitelist-NFT/section-2/2_2_4.png)

You can observe that on the `Deploy` page, we are required to input the `baseURI` (the root link for Metadata) and `whitelistContract` (the previous whitelist address). Therefore, the next task is to determine how to generate the root link for Metadata.

![image-20230223092203406](/public/images/Polygon-Whitelist-NFT/section-2/2_2_5.png)

### 🙋‍♂️ Asking Questions

If you have any uncertainties or issues with the work done so far, please ask in the `#polygon` channel on Discord.

To streamline the assistance process, kindly include the following 4 points in your error report ✨:

```
1. Section and lesson number related to the question
2. What you were trying to do
3. Copy & paste the error message
4. Screenshot of the error screen
```