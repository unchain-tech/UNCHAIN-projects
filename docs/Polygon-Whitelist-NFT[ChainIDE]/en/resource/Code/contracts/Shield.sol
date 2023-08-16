// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/IWhitelist.sol";

contract Shield is ERC721Enumerable, Ownable {
    /**
      * @dev _baseTokenURI for computing {tokenURI}. If set, the resulting URI for each
      * token will be the concatenation of the `baseURI` and the `tokenId`.
      */
    string _baseTokenURI;

    //  _price is the price of one Shield NFT
    uint256 public _price = 0.01 ether;

    // _paused is used to pause the contract in case of an emergency
    bool public _paused;

    // max number of Shield NFT
    uint256 public maxTokenIds = 4;

    // total number of tokenIds minted
    uint256 public tokenIds;

    // Whitelist contract instance
    IWhitelist whitelist;

    modifier onlyWhenNotPaused {
        require(!_paused, "Contract currently paused");
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
        whitelist = IWhitelist(whitelistContract);
    }


    /**
      * @dev presaleMint allows a user to mint one NFT per transaction during the presale.
      */
    function mint() public payable onlyWhenNotPaused {
        require(whitelist.whitelistedAddresses(msg.sender), "You are not whitelisted");
        require(tokenIds < maxTokenIds, "Exceeded maximum Shields supply");
        require(msg.value >= _price, "Ether sent is not correct");
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
        _paused = val;
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