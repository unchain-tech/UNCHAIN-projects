#### NFTメタデータの構築

さあ、少しわくわくしてきましたか？ これから、自分自身のメタデータを作成する手順を順に説明しましょう。

まず、画像を準備する必要があります。ここでは、ChainIDEのシールド画像を4枚用意しました。もちろん、自分で用意した画像を使ってもOKです。

ブロンズ・シールド

![image-20230223101752414](/public/images/Polygon-Whitelist-NFT/section-3/3_2_1.png)

シルバー・シールド

![image-20230223101816151](/public/images/Polygon-Whitelist-NFT/section-3/3_2_2.png)

ゴールド・シールド

![image-20230223101836025](/public/images/Polygon-Whitelist-NFT/section-3/3_2_3.png)

プラチナ・シールド

![image-20230223101907097](/public/images/Polygon-Whitelist-NFT/section-3/3_2_4.png)

これらの画像をローカルデババイスに保存しましょう。

![image-20230223102231474](/public/images/Polygon-Whitelist-NFT/section-3/3_2_5.png)

次に、別のフォルダへ新しいファイルを4つ作成し、それぞれ1、2、3、4と名前をつけます。以下の内容を記入してください（画像のIPFSリンクは未完成です。画像をIPFSにアップロードした後、再度記入してください）。

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

![image-20230223103510159](/public/images/Polygon-Whitelist-NFT/section-3/3_2_6.png)

#### IPFS経由でNFT画像とメタデータをアップロード

前述の通り、IPFSにファイルをアップロードするにはノードが必要であり、自身でIPFSノードを実行することは難しいと感じるかもしれません。


[NFT Storage](https://nft.storage/)や[Textile](https://textile.io/)はよく使われるIPFSノードプロバイダです。ここでは、デモ用に[NFT Storage](https://nft.storage/)を使用します。

「`Login`」をクリックします。

![image-20230223103835432](/public/images/Polygon-Whitelist-NFT/section-3/3_2_7.png)

「`Upload`」をクリックします。

![image-20230223104125770](/public/images/Polygon-Whitelist-NFT/section-3/3_2_8.png)

「CAR files supported! What is a CAR?」をクリックします（CARは、複数のファイルで同じルートCIDを取得してIPFSへ一度にアップロードすることを可能にします。これは`baseURI`に必要な機能であり、また、一度に画像をアップロードするのに便利です）。

![image-20230223104827000](/public/images/Polygon-Whitelist-NFT/section-3/3_2_9.png)

https://car.ipfs.io をクリックします。

「`Open file picker`」クリックします。

![image-20230223104942040](/public/images/Polygon-Whitelist-NFT/section-3/3_2_10.png)

すべての画像をまとめて選択し、「`Open`」をクリックします。

![image-20230223105028884](/public/images/Polygon-Whitelist-NFT/section-3/3_2_11.png)

「`Download .car file`」をクリックします。

![image-20230223105114628](/public/images/Polygon-Whitelist-NFT/section-3/3_2_12.png)

[NFT.Storage](https://nft.storage/new-file/)に戻り、「`Choose File`」をクリックして、先ほどダウンロードしたCARファイルを選択します。次に「`Upload`」をクリックします。

![image-20230223105418010](/public/images/Polygon-Whitelist-NFT/section-3/3_2_13.png)

生成されたCIDをクリックします。

![image-20230223105546864](/public/images/Polygon-Whitelist-NFT/section-3/3_2_14.png)

「Bronze」に対応するCIDをクリックします。

![image-20230223110400663](/public/images/Polygon-Whitelist-NFT/section-3/3_2_15.png)

この画像のCIDをコピーします。これはURLのアドレスバーの前の部分です。

![image-20230223110602486](/public/images/Polygon-Whitelist-NFT/section-3/3_2_16.png)

コピーしたCIDを、ローカルコンピュータの対応するメタデータに貼り付けます。

以下は私のものです。

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

残りの3枚の画像についても同様の処理を行い、メタデータを取得します。

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

必要な変更を加えた後、もう一度メタデータをCARファイルとしてアップロードする手順を追ってみましょう。

![image-20230223120843152](/public/images/Polygon-Whitelist-NFT/section-3/3_2_17.png)

このメタデータCARのCIDをコピーします：`bafybeihuwmkxnqban2ukneymhwctxfqec5ywrdiqyc7vmyegftrrllf7gq`.

IPFSのbaseURIに変換します：`ipfs://bafybeihuwmkxnqban2ukneymhwctxfqec5ywrdiqyc7vmyegftrrllf7gq/`.