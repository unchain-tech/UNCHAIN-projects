### 🐏 IPFS に画像をアップロードする

前回のレッスンでは、希少性を持つ Generative Art コレクションを作成する方法を学びました。

これから、下記 3 つのステップを実行して、生成したコレクションをスマートコントラクトに組み込める形に形成していきます。

1\. IPFS に画像をアップロードする

2\. スマートコントラクトに読み込める JSON メタデータを生成する

3\. メタデータファイルを IPFS にアップロードする

### ☘️ NFT を Mint するしくみ

まず、NFT を Mint（発行する）ということは、技術的にどういうことか理解していきましょう。

たとえば、**10,000 個の NFT コレクションを作成する**場合、最初にブロックチェーン上で以下 3 つの情報をいつでも書き込んだり、呼び出したりできるテーブルを作成します。

- NFT の識別子（`ID`）

- NFT の所有者（`owner`）

- NFT に関連付けられたメタデータ（`Metadata`）

このテーブルを記載するコードこそが、**スマートコントラクト**です。

下記のテーブルを見ていきましょう。

![](/public/images/Polygon-Generative-NFT/section-1/1_2_1.png)

ここで、`ID` は特定の NFT を識別する一意の正の整数にすぎないことがわかります。

`owner` の列には、各 NFT の所有者に紐づいたウォレットアドレスを格納できます。

そして、`Metadata` の列には、NFT または NFT に関するデータを格納できます。

しかし、ブロックチェーンにデータを保存するにはコストがかかります。

たとえば、10,000 体の「Scrappy Squirrels」アバターをブロックチェーン上に保存する場合、600 MB のディスクスペースが必要です。

600 MB 相当のデータをイーサリアムブロックチェーンに保存したい場合、100 万ドルの費用がかかります 🤯

このようなケースを避けるため、画像データの代わりに、NFT に関するメタデータをブロックチェーン上に保存するのが、現在のベストプラクティスです。

また、このメタデータは、JSON と呼ばれる形式で保存する必要があります。

- JSON ファイルには、NFT の名前（`name`）、説明（`description`）、画像の URL、属性などの NFT に関する情報が含まれます。

OpenSea などの NFT マーケットプレイスで JSON ファイルの内容を表示させるためには、下記のように標準に準拠した方法で JSON ファイルを形成する必要があります。

```
{
   "description"： "Friendly OpenSea Creature"、
   "image"： "https://opensea-prod.appspot.com/puffs/3.png"、
   "name"： "Dave Starbelly"、
   "attributes"：[
       { "trait_type"： "Base"、 "value"： "Starfish"}、
       {"trait_type"： "Eyes"、 "value"： "Big"}、
       {"trait_type"： "Mouth"、 "value"： "Surprise"}、
   ]
}
```

ですが、メタデータを上記の形式でブロックチェーンに保存すると、依然として非常にコストがかかります 🤯

したがって、この JSON ファイルも IPFS にアップロードして、JSON ファイルを指す URL をブロックチェーンに保存していきます。

- NFT は、いくつかのメタデータにリンクする単なる JSON ファイルであることを思い出してください 💡

- この JSON ファイルを IPFS に配置します。

### 🌎 IPFS に 画像を保存する

Google ドライブ、GitHub、AWS などのサービスを使用すれば、インターネットへの画像のアップロードは非常に簡単です。

しかし、NFT を作成する上では、このような一元化されたサービスに画像をアップロードすることは、主に以下 2 つの理由から推奨されていません。

1 \. **データが変更されるリスク**

- `dog.jpeg` と呼ばれる犬の画像を一元化されたストレージサービスにアップロードして、`https://mystorage.com/dog.jpeg` のような URL にアクセスすれば、インターネット上で簡単に犬の画像を見ることができます。

- ただし、この画像を別の画像と交換するのは非常に簡単です。

- 同じ名前（dog.JPEG）の別の画像をアップロードすれば良いのです。

- 画像を差し替えた後、以前と同じ URL にアクセスすると、別の画像が表示されます。

2 \. **サーバがダウンするリスク**

- たとえば、Google ドライブまたは AWS に画像をアップロードするとします。

- これらのサービス自体がシャットダウンした場合、画像を指す URL は壊れてしまいます。

NFT には数千ドルもの資産が投下されているため、データの中身が勝手に変更されていたり、空になるようなことがあれば、大きな問題になります。

このリスクを避けるため、一流の NFT プロジェクトは、IPFS（Interplanetary File System）と呼ばれるサービスを使用しています。

IPFS は、分散型で、コンテンツベースのアドレス指定を使用する、ピアツーピアのファイル共有システムです。

上記の言葉の意味がわからなくても、心配しないでください。

ここで知る必要があるのは以下 2 点だけです：

1 \. **データを変更することはできない**

- IPFS ネットワークでは、ファイルのアドレス（URL）はファイルのコンテンツに依存します。

- **つまり、ファイルの内容を変更すると、IPFS 上のファイルのアドレスも変更されます。**

- したがって、IPFS ネットワークでは、1 つの URL が 2 つの異なる画像を指すことはできません。

2 \. **IPFS がダウンすることはない**

- ブロックチェーンのような、ほとんどの分散型システムと同様に、IPFS がダウンすることはありません。

- つまり、ファイル（または画像）を IPFS にアップロードすると、ネットワーク内の少なくとも 1 つのノードにファイルがある限り、そのファイルは常に使用可能になります。

[Pinata](https://www.pinata.cloud/) に向かい、アカウントを作成して、UI から前回のレッスンで作成したコレクションをアップロードしてみましょう。

`Upload` から `Folder` を選択します。
![](/public/images/Polygon-Generative-NFT/section-1/1_2_2.png)

先ほど作成したコレクションを選択し、`images` フォルダーをアップロードします。
![](/public/images/Polygon-Generative-NFT/section-1/1_2_3.png)

ファイルをアップロードしたら、UI に表示されている「CID」をコピーしてください。

**CID は IPFS のファイルコンテンツアドレスです。**

この CID は、フォルダーの内容にもとづいて生成されました。

フォルダの内容が変更された場合（画像が削除された場合、同じ名前の別の画像と交換された場合など）、CID も変更されます。

たとえば、私のフォルダーの CID は `QmRvSoppQ5MKfsT4p5Snheae1DG3Af2NhYXWpKNZBvz2Eo` です。

したがって、このフォルダーの IPFS URL は `ipfs://QmRvSoppQ5MKfsT4p5Snheae1DG3Af2NhYXWpKNZBvz2Eo` です。

この URL はブラウザで開けません。

IPFS URL の中身をブラウザで確認する場合は、下記のリンクのようなリンクを使用します。

`https://ipfs.io/ipfs/QmRvSoppQ5MKfsT4p5Snheae1DG3Af2NhYXWpKNZBvz2Eo/00001.png`

これにより、私のフォルダーにアップロードされた `00001.png` という名前の画像がブラウザに表示されます。

### 😲 JSON ファイル（メタデータ）を作成する

次に、画像ごとに JSON ファイルを作成し、OpenSea などのプラットフォームに準拠した形式にデータを形成していきます。

`generative-nft-library` に向かい、`metadata.py` を開き下記のように中身を更新してください。

```javascript
// metadata.py
BASE_IMAGE_URL = "ipfs://ここにあなたのCIDを貼り付けます";
BASE_NAME = "ここにあなたのコレクションの名前を記入します";
```

私の `metadata.py` は下記のようになります。

```javascript
// metadata.py
BASE_IMAGE_URL = "ipfs://Qman4YbTQHsLDSJvjV5MMnGmF7kmWujVeFhAxUoisHifZF";
BASE_NAME = "First Collection #";

BASE_JSON = {
  name: BASE_NAME,
  description: "A collection of Scrappy Squirrel.",
  image: BASE_IMAGE_URL,
  attributes: [],
};
```

`BASE_NAME` に、`First Collection #` とつけると、NFT には、`First Collection #1`、`First Collection #2` のような ID が付与されます。

`description` にはあなたのコレクションの説明を記載しましょう。

`metadata.py` の更新が完了したら、ターミナルを開き、`generative-nft-library` ディレクトリ上で、次のコマンドを実行してください。

```
python3 metadata.py
```

プログラムは、メタデータを生成する `edition` を要求します。

- `edition` は前回のレッスンで指定したコレクションの名前です。

あなたが作成したコレクションの `edition` の名前をターミナルに入力してください。

> ✍️: わたしの場合、`first collection` と入力します。

プログラムが完了したら、`generative-nft-library/output/あなたのedition/json` フォルダに移動して中身を確認しましょう。

下記のように、NFT 画像それぞれに対して JSON ファイルが生成されていれば成功です。

![](/public/images/Polygon-Generative-NFT/section-1/1_2_4.png)

### 💫 JSON ファイルを IPFS にアップロードする

最後に、生成された JSON ファイルを IPFS にアップロードしていきましょう。

`generative-nft-library/output/あなたのedition/json` フォルダを `images` フォルダをアップロードしたときと同じ要領で、IPFS にアップロードしてください。

Pinata にアップロードされた JSON ファイルは下記のように表示されます。
![](/public/images/Polygon-Generative-NFT/section-1/1_2_5.png)

私の `#0 ` 番目の NFT コレクションのデータは以下のようになります。

```
{"name": "First Collection #0", "description": "A collection of Scrappy Squirrel.", "image": "ipfs://Qman4YbTQHsLDSJvjV5MMnGmF7kmWujVeFhAxUoisHifZF/00.png", "attributes": [{"trait_type": "Background", "value": "white"}, {"trait_type": "Body", "value": "maroon"}, {"trait_type": "Eyes", "value": "standard"}, {"trait_type": "Clothes", "value": "blue_dot"}, {"trait_type": "Held Item", "value": "nut"}, {"trait_type": "Hands", "value": "standard"}]}
```

この JSON ファイルのフォーマットは、OpenSea などのプラットフォームに準拠しています。

したがって、メタデータをスマートコントラクトに組み込んだ後も、オンライン上で画像を表示できます。

これで NFT メタデータのセットアップが完了です。

### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discord の `#polygon-generative-nft` で質問してください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の 3 点を記載してください ✨

```
1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット
```

---

おつかれさまです!　セクション 1 は終了です!

ぜひ、あなたの IPSF のリンクを `#polygon-generative-nft` に貼り付けて、成功をコミュニティにシェアしてください 😊

次のレッスンに進んで、スマートコントラクトを作成していきましょう 🎉
