### 🐏 IPFS に画像をアップロードする

前回のレッスンでは、希少性を持つGenerative Artコレクションを作成する方法を学びました。

これから、下記3つのステップを実行して、生成したコレクションをスマートコントラクトに組み込める形に形成していきます。

1\. IPFSに画像をアップロードする

2\. スマートコントラクトに読み込めるJSONメタデータを生成する

3\. メタデータファイルをIPFSにアップロードする

### ☘️ NFT を Mint するしくみ

まず、NFTをMint（発行する）ということは、技術的にどういうことか理解していきましょう。

たとえば、**10,000 個の NFT コレクションを作成する**場合、最初にブロックチェーン上で以下3つの情報をいつでも書き込んだり、呼び出したりできるテーブルを作成します。

- NFTの識別子(`ID`)

- NFTの所有者(`owner`)

- NFTに関連付けられたメタデータ(`Metadata`)

このテーブルを記載するコードこそが、**スマートコントラクト**です。

下記のテーブルを見ていきましょう。

![](/public/images/Polygon-Generative-NFT/section-1/1_2_1.png)

ここで、`ID`は特定のNFTを識別する一意の正の整数にすぎないことがわかります。

`owner`の列には、各NFTの所有者に紐づいたウォレットアドレスを格納できます。

そして、`Metadata`の列には、NFTまたはNFTに関するデータを格納できます。

しかし、ブロックチェーンにデータを保存するにはコストがかかります。

たとえば、10,000体の「Scrappy Squirrels」アバターをブロックチェーン上に保存する場合、600 MBのディスクスペースが必要です。

600 MB相当のデータをイーサリアムブロックチェーンに保存したい場合、100万ドルの費用がかかります 🤯

このようなケースを避けるため、画像データの代わりに、NFTに関するメタデータをブロックチェーン上に保存するのが、現在のベストプラクティスです。

また、このメタデータは、JSONと呼ばれる形式で保存する必要があります。

- JSONファイルには、NFTの名前(`name`)、説明(`description`)、画像のURL、属性などのNFTに関する情報が含まれます。

OpenSeaなどのNFTマーケットプレイスでJSONファイルの内容を表示させるためには、下記のように標準に準拠した方法でJSONファイルを形成する必要があります。

```json
{
   "description"： "Friendly OpenSea Creature",
   "image"： "https://opensea-prod.appspot.com/puffs/3.png",
   "name"： "Dave Starbelly",
   "attributes"：[
       { "trait_type"： "Base"、 "value"： "Starfish"},
       {"trait_type"： "Eyes"、 "value"： "Big"},
       {"trait_type"： "Mouth"、 "value"： "Surprise"},
   ]
}
```

ですが、メタデータを上記の形式でブロックチェーンに保存すると、依然として非常にコストがかかります 🤯

したがって、このJSONファイルもIPFSにアップロードして、JSONファイルを指すURLをブロックチェーンに保存していきます。

- NFTは、いくつかのメタデータにリンクする単なるJSONファイルであることを思い出してください 💡

- このJSONファイルをIPFSに配置します。

### 🌎 IPFS に 画像を保存する

Googleドライブ、GitHub、AWSなどのサービスを使用すれば、インターネットへの画像のアップロードは非常に簡単です。

しかし、NFTを作成する上では、このような一元化されたサービスに画像をアップロードすることは、主に以下2つの理由から推奨されていません。

1 \. **データが変更されるリスク**

- `dog.jpeg`と呼ばれる犬の画像を一元化されたストレージサービスにアップロードして、`https://mystorage.com/dog.jpeg`のようなURLにアクセスすれば、インターネット上で簡単に犬の画像を見ることができます。

- ただし、この画像を別の画像と交換するのは非常に簡単です。

- 同じ名前（dog.JPEG）の別の画像をアップロードすれば良いのです。

- 画像を差し替えた後、以前と同じURLにアクセスすると、別の画像が表示されます。

2 \. **サーバーがダウンするリスク**

- たとえば、GoogleドライブまたはAWSに画像をアップロードするとします。

- これらのサービス自体がシャットダウンした場合、画像を指すURLは壊れてしまいます。

NFTには数千ドルもの資産が投下されているため、データの中身が勝手に変更されていたり、空になるようなことがあれば、大きな問題になります。

このリスクを避けるため、一流のNFTプロジェクトは、IPFS（Interplanetary File System）と呼ばれるサービスを使用しています。

IPFSは、分散型で、コンテンツベースのアドレス指定を使用する、ピアツーピアのファイル共有システムです。

上記の言葉の意味がわからなくても、心配しないでください。

ここで知る必要があるのは以下2点だけです：

1 \. **データを変更することはできない**

- IPFSネットワークでは、ファイルのアドレス（URL）はファイルのコンテンツに依存します。

- **つまり、ファイルの内容を変更すると、IPFS 上のファイルのアドレスも変更されます。**

- したがって、IPFSネットワークでは、1つのURLが2つの異なる画像を指すことはできません。

2 \. **IPFS がダウンすることはない**

- ブロックチェーンのような、ほとんどの分散型システムと同様に、IPFSがダウンすることはありません。

- つまり、ファイル（または画像）をIPFSにアップロードすると、ネットワーク内の少なくとも1つのノードにファイルがある限り、そのファイルは常に使用可能になります。

[Pinata](https://www.pinata.cloud/) に向かい、アカウントを作成して、UIから前回のレッスンで作成したコレクションをアップロードしてみましょう。

`Upload`から`Folder`を選択します。
![](/public/images/Polygon-Generative-NFT/section-1/1_2_2.png)

先ほど作成したコレクションを選択し、`images`フォルダーをアップロードします。
![](/public/images/Polygon-Generative-NFT/section-1/1_2_3.png)

ファイルをアップロードしたら、UIに表示されている「CID」をコピーしてください。

**CID は IPFS のファイルコンテンツアドレスです。**

このCIDは、フォルダーの内容にもとづいて生成されました。

フォルダの内容が変更された場合（画像が削除された場合、同じ名前の別の画像と交換された場合など）、CIDも変更されます。

たとえば、私のフォルダーのCIDは`QmRvSoppQ5MKfsT4p5Snheae1DG3Af2NhYXWpKNZBvz2Eo`です。

したがって、このフォルダーのIPFS URLは`ipfs://QmRvSoppQ5MKfsT4p5Snheae1DG3Af2NhYXWpKNZBvz2Eo`です。

このURLはブラウザで開けません。

IPFS URLの中身をブラウザで確認する場合は、下記のリンクのようなリンクを使用します。

`https://ipfs.io/ipfs/QmRvSoppQ5MKfsT4p5Snheae1DG3Af2NhYXWpKNZBvz2Eo/00001.png`

これにより、私のフォルダーにアップロードされた`00001.png`という名前の画像がブラウザに表示されます。

### 😲 JSON ファイル（メタデータ）を作成する

次に、画像ごとにJSONファイルを作成し、OpenSeaなどのプラットフォームに準拠した形式にデータを形成していきます。

`packages/library`に向かい、`metadata.py`を開き下記のように中身を更新してください。

```python
BASE_IMAGE_URL = "ipfs://ここにあなたのCIDを貼り付けます"
BASE_NAME = "ここにあなたのコレクションの名前を記入します"
```

私の`metadata.py`は下記のようになります。

```python
BASE_IMAGE_URL = "ipfs://Qman4YbTQHsLDSJvjV5MMnGmF7kmWujVeFhAxUoisHifZF"
BASE_NAME = "First Collection #"

BASE_JSON = {
  name: BASE_NAME,
  description: "A collection of Scrappy Squirrel.",
  image: BASE_IMAGE_URL,
  attributes: [],
}
```

`BASE_NAME`に、`First Collection #`とつけると、NFTには、`First Collection #1`、`First Collection #2`のようなIDが付与されます。

`description`にはあなたのコレクションの説明を記載しましょう。

`metadata.py`の更新が完了したら、ターミナルを開き、`Polygon-Generative-NFT`ディレクトリ上で、次のコマンドを実行してください。

```
yarn library generate:JSON
```

プログラムは、メタデータを生成する`edition`を要求します。

- `edition`は前回のレッスンで指定したコレクションの名前です。

あなたが作成したコレクションの`edition`の名前をターミナルに入力してください。

> ✍️: わたしの場合、`first-collection`と入力します。

プログラムが完了したら、`library/output/あなたのedition/json`フォルダに移動して中身を確認しましょう。

下記のように、NFT画像それぞれに対してJSONファイルが生成されていれば成功です。

![](/public/images/Polygon-Generative-NFT/section-1/1_2_4.png)

### 💫 JSON ファイルを IPFS にアップロードする

最後に、生成されたJSONファイルをIPFSにアップロードしていきましょう。

`library/output/あなたのedition/json`フォルダを、`images`フォルダをアップロードしたときと同じ要領でIPFSにアップロードしてください。

PinataにアップロードされたJSONファイルは下記のように表示されます。
![](/public/images/Polygon-Generative-NFT/section-1/1_2_5.png)

私の`#0 `番目のNFTコレクションのデータは以下のようになります。

```json
{"name": "First Collection #0", "description": "A collection of Scrappy Squirrel.", "image": "ipfs://Qman4YbTQHsLDSJvjV5MMnGmF7kmWujVeFhAxUoisHifZF/00.png", "attributes": [{"trait_type": "Background", "value": "white"}, {"trait_type": "Body", "value": "maroon"}, {"trait_type": "Eyes", "value": "standard"}, {"trait_type": "Clothes", "value": "blue_dot"}, {"trait_type": "Held Item", "value": "nut"}, {"trait_type": "Hands", "value": "standard"}]}
```

このJSONファイルのフォーマットは、OpenSeaなどのプラットフォームに準拠しています。

したがって、メタデータをスマートコントラクトに組み込んだ後も、オンライン上で画像を表示できます。

これでNFTメタデータのセットアップが完了です。

### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discordの`#polygon`で質問してください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の3点を記載してください ✨

```
1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット
```

---

おつかれさまです!　セクション1は終了です!

ぜひ、あなたのIPSFのリンクを`#polygon`に貼り付けて、成功をコミュニティにシェアしてください 😊

次のレッスンに進んで、スマートコントラクトを作成していきましょう 🎉
