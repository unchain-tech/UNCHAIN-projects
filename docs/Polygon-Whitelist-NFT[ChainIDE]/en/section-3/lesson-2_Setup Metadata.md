#### Build a NFT Metadata

Alright, feeling a bit excited? Now, I'll guide you through the process of creating your own metadata step by step.

Firstly, we need to prepare some images. Here, I've prepared four images of ChainIDE Shields. Of course, you can also use your own images.

Bronze Shield

![image-20230223101752414](../resource/Images/image-20230223101752414.png)

Silver Shield

![image-20230223101816151](../resource/Images/image-20230223101816151.png)

Gold Shield

![image-20230223101836025](../resource/Images/image-20230223101836025.png)

Platinum Shield

![image-20230223101907097](../resource/Images/image-20230223101907097.png)

Let's start by saving these images to your local device.

![image-20230223102231474](../resource/Images/image-20230223102231474.png)

Then, create four new files in another folder, naming them 1, 2, 3, and 4. Fill in the following content (the IPFS links for the images are not complete; come back to complete them after uploading the images to IPFS).

1

```json
{
    "name": "Bronze Shield",
    "description": "As a token of appreciation, ChainIDE is gifting its users with this rare Bronze Shield.",
    "image": "ipfs://",
    "attributes": [{
        "trait_type": "Rarity",
        "value": "Rare"
    }]
}
```

2

```json
{
    "name": "Silver Shield",
    "description": "To show our gratitude to ChainIDE users, we're offering this mythical Silver Shield as a gift.",
    "image": "ipfs://",
    "attributes": [{
        "trait_type": "Rarity",
        "value": "Mythical"
    }]
}
```

3

```json
{
    "name": "Gold Shield",
    "description": "As a gesture of thanks, ChainIDE is presenting its users with this legendary Gold Shield.",
    "image": "ipfs://",
    "attributes": [{
        "trait_type": "Rarity",
        "value": "Legendary"
    }]
}
```

4

```json
{
    "name": "Platinum Shield",
    "description": "ChainIDE is honored to gift its users with this immortal Platinum Shield as a symbol of our appreciation.",
    "image": "ipfs://",
    "attributes": [{
        "trait_type": "Rarity",
        "value": "Immortal"
    }]
}
```

![image-20230223103510159](../resource/Images/image-20230223103510159.png)

#### Upload NFT images and metadata via IPFS.

As mentioned earlier, uploading files to IPFS requires nodes, and running your own IPFS node might seem challenging.


[NFT Storage](https://nft.storage/) and [Textile](https://textile.io/) are popular IPFS node providers. Here, we will use [NFT Storage]((https://nft.storage/)) for demonstration purposes.

Click Login

![image-20230223103835432](../resource/Images/image-20230223103835432.png)

Click Upload

![image-20230223104125770](../resource/Images/image-20230223104125770.png)

Click "CAR files supported! What is a CAR?" (CAR allows multiple files to be uploaded together to IPFS, obtaining the same root CID. This functionality is needed for `baseURI` and also makes it convenient to upload images all at once.)

![image-20230223104827000](../resource/Images/image-20230223104827000.png)

Click https://car.ipfs.io

Click Open file picker

![image-20230223104942040](../resource/Images/image-20230223104942040.png)

Select all the images together and click "Open".

![image-20230223105028884](../resource/Images/image-20230223105028884.png)

Click Download .car file

![image-20230223105114628](../resource/Images/image-20230223105114628.png)

Return to [NFT.Storage](https://nft.storage/new-file/) and click "Choose File" to select the CAR file you downloaded earlier. Then, click "Upload".

![image-20230223105418010](../resource/Images/image-20230223105418010.png)

Click on the generated CID.

![image-20230223105546864](../resource/Images/image-20230223105546864-16771209472582.png)

Click on the CID corresponding to "Bronze".

![image-20230223110400663](../resource/Images/image-20230223110400663.png)

Copy the CID of this image, which is the portion before the address bar in the URL.

![image-20230223110602486](../resource/Images/image-20230223110602486.png)

Paste it into the corresponding Metadata on your local computer.

Here's mine

1

```json
{
    "name": "Bronze Shield",
    "description": "As a token of appreciation, ChainIDE is gifting its users with this rare Bronze Shield.",
    "image": "ipfs://bafybeid25fu5kqfwhy67hryylwiuerobvutztmm24g2yimkpezhf2i76vq",
    "attributes": [{
        "trait_type": "Rarity",
        "value": "Rare"
    }]
}
```

Apply the same process for the remaining three images to obtain the metadata for the other three images.

2

```json
{
    "name": "Silver Shield",
    "description": "To show our gratitude to ChainIDE users, we're offering this mythical Silver Shield as a gift.",
    "image": "ipfs://bafybeigpqjtc6dg2aw7up7b6k6lou2rn5vmqnce3sslhgukq4jexwjpuha",
    "attributes": [{
        "trait_type": "Rarity",
        "value": "Mythical"
    }]
}
```

3

```json
{
    "name": "Gold Shield",
    "description": "As a gesture of thanks, ChainIDE is presenting its users with this legendary Gold Shield.",
    "image": "ipfs://bafybeifj4zvhyegddyerjwwhmzrepa5ogsuo2r73sor2utwjjdkilcdw24",
    "attributes": [{
        "trait_type": "Rarity",
        "value": "Legendary"
    }]
}
```

4

```json
{
    "name": "Platinum Shield",
    "description": "ChainIDE is honored to gift its users with this immortal Platinum Shield as a symbol of our appreciation.",
    "image": "ipfs://bafybeifmjxhldqtvpy2dd26l7syfbhafiqyyylovupvljnqgcmfin2mzsm",
    "attributes": [{
        "trait_type": "Rarity",
        "value": "Immortal"
    }]
}
```

After making the necessary modifications, let's follow the process of uploading the metadata as a CAR file once again.

![image-20230223120843152](../resource/Images/image-20230223120843152.png)

Copy the CID of this Metadata CAR: `bafybeihuwmkxnqban2ukneymhwctxfqec5ywrdiqyc7vmyegftrrllf7gq`

Convert it to an IPFS baseURI: `ipfs://bafybeihuwmkxnqban2ukneymhwctxfqec5ywrdiqyc7vmyegftrrllf7gq/`