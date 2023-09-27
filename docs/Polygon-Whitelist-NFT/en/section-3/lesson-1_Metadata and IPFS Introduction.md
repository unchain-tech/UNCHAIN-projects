### 🤖　Upload NFT Metadata using IPFS

#### What is IPFS

As mentioned earlier, Metadata can be both centralized, such as stored on `AWS S3`, which is convenient for game-type NFTs to easily expand content within the Metadata. It can also be decentralized, stored on `IPFS`, `Ar`, which enhances the immutability of Metadata. In this lesson, I will teach you how to generate the required Metadata on `IPFS`.

![pngVGb7Gkv](/public/images/Polygon-Whitelist-NFT/section-3/3_1_1.png)

IPFS stands for the **InterPlanetary** File System. It's a distributed peer-to-peer network used for storing and sharing files, websites, applications, and more. Originally released in 2015, it was developed by [Protocol Labs](https://protocol.ai/).

IPFS operates as a decentralized node network designed for storing and sharing files. Each file on IPFS is identified by a content hash based on its content. This content hash is known as a **CID** - a `Content ID`. In simpler terms, when you upload a file to IPFS, the various nodes on the IPFS network check if a node has already uploaded the same content. If they find a match, they return the previous CID to you; if not, the nodes store the file and provide you with a new CID.

With a CID, you can access the content of the file stored on IPFS. The Metadata CID for Bored Ape Yacht Club (BAYC) is QmeSjSinHpPnmXmspMjwiXyN6zS4E9zccariGR3jxcaWtq (Note: A CID doesn't necessarily refer to a single file; it can represent a folder containing multiple files bundled together, known as a "car" to facilitate uploading. BAYC uses a bundled multi-file CID).

The standard IPFS link format is `IPFS://+CID`, like: `IPFS://QmeSjSinHpPnmXmspMjwiXyN6zS4E9zccariGR3jxcaWtq`.

However, this format is only effective when used in some IPFS-supported browsers (such as Brave) by directly entering the `IPFS` address in the address bar. Other browsers, like Chrome, do not support this format.

Consequently, we need an IPFS gateway to access its IPFS content. Examples include:

https://cloudflare-ipfs.com/ipfs/+CID

In this way, we can easily access the Metadata content of Bored Ape Yacht Club (BAYC).


https://cloudflare-ipfs.com/ipfs/QmeSjSinHpPnmXmspMjwiXyN6zS4E9zccariGR3jxcaWtq/

![image-20230223094941448](/public/images/Polygon-Whitelist-NFT/section-3/3_1_2.png)

However, uploading files to IPFS requires nodes, and running your own IPFS node might seem challenging.


[NFT Storage](https://nft.storage/) and [Textile](https://textile.io/) are some popular IPFS node providers. Similar to Ethereum node providers, you can create an account on these platforms to access IPFS nodes for storing and retrieving data stored on the network.

#### What is Metadata

In general, Metadata is a piece of `JSON` code designed to establish a standard format, making it easy for major NFT platforms to recognize attributes such as the NFT's name, description, image, and other characteristics. This is the `ERC721` Metadata JSON Schema.

```json
{
    "title": "Asset Metadata",
    "type": "object",
    "properties": {
        "name": {
            "type": "string",
            "description": "Identifies the asset to which this NFT represents"
        },
        "description": {
            "type": "string",
            "description": "Describes the asset to which this NFT represents"
        },
        "image": {
            "type": "string",
            "description": "A URI pointing to a resource with mime type image/* representing the asset to which this NFT represents. Consider making any images at a width between 320 and 1080 pixels and aspect ratio between 1.91:1 and 4:5 inclusive."
        }
    }
}
```
However, this is just the most basic `JSON Schema`. Some NFT creators prefer to add additional features to their NFTs, such as attributes, which are supported as long as the NFT marketplace allows it. Here is the [metadata content](https://cloudflare-ipfs.com/ipfs/QmeSjSinHpPnmXmspMjwiXyN6zS4E9zccariGR3jxcaWtq/0) for Bored Ape Yacht Club #0.

```json
{
    "image": "ipfs://QmRRPWG96cmgTn2qSzjwr2qvfNEuhunv6FNeMFGa9bx6mQ",
    "attributes": [{
        "trait_type": "Earring",
        "value": "Silver Hoop"
    }, {
        "trait_type": "Background",
        "value": "Orange"
    }, {
        "trait_type": "Fur",
        "value": "Robot"
    }, {
        "trait_type": "Clothes",
        "value": "Striped Tee"
    }, {
        "trait_type": "Mouth",
        "value": "Discomfort"
    }, {
        "trait_type": "Eyes",
        "value": "X Eyes"
    }]
}
```

### 🙋‍♂️ Asking Questions
If you have any questions or uncertainties up to this point, please ask in the `#polygon` channel on Discord.