## Write an NFT contract that only allows addresses within the whitelist to mint.

### 🎓　What is NFT

NFT (Non-Fungible Token) is a type of digital asset, typically used to store and trade unique digital content on the blockchain, such as digital art, audio, video, game items, etc. Unlike traditional currency or cryptocurrency, NFTs are unique and non-interchangeable, as each NFT has its unique identifier, giving it individuality.

NFTs use smart contracts to record and verify ownership and transaction history on the blockchain, providing transparency and traceability. This has made NFTs increasingly popular in the digital art market and considered as an emerging collectible and investment asset.

![image-20230222182919997](/public/images/Polygon-Whitelist-NFT/section-2/2_1_1.png)

BAYC (Bored Ape Yacht Club) is currently a standout in the NFT world. It was launched in April 2021, created by a group of artists and developers. At the initial release, BAYC's price was relatively low, only at 0.08 ETH, but as its popularity and heat continued to rise on social media and the NFT market, its price also experienced explosive growth. Currently, BAYC's holders have formed an active community. They share their avatars on social media and participate in various activities, becoming a highly-attended part of the digital art market.

So, are you interested in creating your own NFT piece? Follow my lead, and let's understand how NFTs are generated together.

### NFT Protocol on ETH

There are now many different NFT protocol standards on ETH, and let me introduce them to you in order:

1. [ERC-721](https://eips.ethereum.org/EIPS/eip-721), one of the earliest NFT standards on Ethereum, was released in 2018. ERC-721 stands for "Non-Fungible Token," a unique digital asset. Each ERC-721 token has a distinct identifier (Token ID) to differentiate various tokens. ERC-721 tokens can be used to represent digital art, virtual items in games, collectibles, and more.

2. [ERC-1155](https://eips.ethereum.org/EIPS/eip-1155) is a new NFT standard, released by Enjin in 2018. ERC-1155 represents "Fungible/Non-Fungible Tokens," merging both fungible and non-fungible tokens into one standard. This standard allows the creation of a single smart contract to manage multiple types of tokens, which can be either fungible or non-fungible. ERC-1155 tokens can be used to represent digital items, such as weapons, equipment, ornaments in games, and so on.

3. Subsequent NFT protocols such as [ERC-3525](https://eips.ethereum.org/EIPS/eip-3525), [ERC-4907](https://eips.ethereum.org/EIPS/eip-4907) were also developed from the above two NFT standards.

### 🙋‍♂️ Asking Questions
If you have any questions or uncertainties up to this point, please ask in the `#polygon` channel on Discord.