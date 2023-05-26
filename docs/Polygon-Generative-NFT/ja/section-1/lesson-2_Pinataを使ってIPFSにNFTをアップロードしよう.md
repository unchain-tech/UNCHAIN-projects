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

## 🔥環境構築をしよう

### 🍽 Git リポジトリをあなたの GitHub にフォークする

まだGitHubのアカウントをお持ちでない方は、[こちら](https://qiita.com/okumurakengo/items/848f7177765cf25fcde0) の手順に沿ってアカウントを作成してください。

GitHubのアカウントをお持ちの方は、[スターターキット](https://github.com/unchain-tech/Polygon-Generative-NFT) から、フロントエンドの基盤となるリポジトリをあなたのGitHubにフォークしましょう。フォークの方法は、[こちら](https://denno-sekai.com/github-fork/) を参照してください。

あなたのGitHubアカウントにフォークした`Polygon-Generative-NFT`リポジトリを、ローカル環境にクローンしてください。

まず、`Code`ボタンをクリックして`SSH`を選択し、Gitリンクをコピーしましょう。

ターミナル上で`Polygon-Generative-NFT/packages`ディレクトリに移動し、先ほどコピーしたリンクを用いて下記を実行してください。

```bash
git clone コピーした_github_リンク
```

ターミナル上で`Polygon-Generative-NFT`ディレクトリ下に移動して下記を実行しましょう。

```bash
yarn install
```

`yarn`コマンドを実行することで、JavaScriptライブラリのインストールが行われます。

次に、下記を実行してみましょう。

```bash
yarn client start
```

あなたのローカル環境で、Webサイトのフロントエンドが立ち上がりましたか？

例)ローカル環境で表示されているWebサイト

![](/public/images/Polygon-Generative-NFT/section-1/1_2_6.png)

上記のような形でフロントエンドが確認できれば成功です。

これからフロントエンドの表示を確認したい時は、ターミナルに向かい、`Polygon-Generative-NFT`ディレクトリ上で、`npm start`を実行します。これからも必要となる作業ですので、よく覚えておいてください。

ターミナルを閉じるときは、以下のコマンドが使えます ✍️

- Mac: `ctrl + c`
- Windows: `ctrl + shift + w`

### 👏 Hardhatのサンプルプロジェクトを開始する

次に、Hardhatを実行します。

`packages/contract`ディレクトリにいることを確認し、次のコマンドを実行します。

```bash
npx hardhat
```

`hardhat`がターミナル上で立ち上がったら、それぞれの質問を以下のように答えていきます。

```
・What do you want to do? →「Create a JavaScript project」を選択
・Hardhat project root: →「'Enter'を押す」 (自動で現在いるディレクトリが設定されます。)
・Do you want to add a .gitignore? (Y/n) → 「y」
```

（例）
```bash
$ npx hardhat

888    888                      888 888               888
888    888                      888 888               888
888    888                      888 888               888
8888888888  8888b.  888d888 .d88888 88888b.   8888b.  888888
888    888     "88b 888P"  d88" 888 888 "88b     "88b 888
888    888 .d888888 888    888  888 888  888 .d888888 888
888    888 888  888 888    Y88b 888 888  888 888  888 Y88b.
888    888 "Y888888 888     "Y88888 888  888 "Y888888  "Y888

👷 Welcome to Hardhat v2.13.0 👷‍

✔ What do you want to do? · Create a JavaScript project
✔ Hardhat project root: · /Polygon-Generative-NFT/packages/contract
✔ Do you want to add a .gitignore? (Y/n) · y

✨ Project created ✨

See the README.md file for some example tasks you can run

Give Hardhat a star on Github if you're enjoying it! 💞✨

     https://github.com/NomicFoundation/hardhat
```

> ⚠️: 注意 #1
>
> Windows で Git Bash を使用してハードハットをインストールしている場合、このステップ (HH1) でエラーが発生する可能性があります。問題が発生した場合は、WindowsCMD（コマンドプロンプト）を使用して HardHat のインストールを実行してみてください。

> ⚠️: 注意 #2
>
> `npx hardhat`が実行されなかった場合、以下をターミナルで実行してください。
>
> ```bash
> yarn add --dev @nomicfoundation/hardhat-toolbox
> ```

この段階で、フォルダー構造は下記のようになっていることを確認してください。

```diff
Polygon-Generative-NFT
 ├── .gitignore
 ├── package.json
 └── packages/
     ├── client/
     ├── library/
     └── contract/
+        ├── .gitignore
+        ├── README.md
+        ├── contracts/
+        ├── hardhat.config.js
+        ├── package.json
+        ├── scripts/
+        └── test/
```

それでは、`contract`ディレクトリ内の`package.json`ファイルを以下を参考に更新をしましょう。

```diff
{
  "name": "contract",
  "version": "1.0.0",
-  "main": "index.js",
-  "license": "MIT",
  "private": true,
  "devDependencies": {
    "@nomicfoundation/hardhat-chai-matchers": "^1.0.6",
    "@nomicfoundation/hardhat-network-helpers": "^1.0.8",
    "@nomicfoundation/hardhat-toolbox": "^2.0.2",
    "@nomiclabs/hardhat-ethers": "^2.2.2",
    "@nomiclabs/hardhat-etherscan": "^3.1.7",
    "@typechain/ethers-v5": "^10.2.0",
    "@typechain/hardhat": "^6.1.5",
    "chai": "^4.3.7",
    "ethers": "^6.1.0",
    "hardhat": "^2.13.0",
    "hardhat-gas-reporter": "^1.0.9",
    "solidity-coverage": "^0.8.2",
    "typechain": "^8.1.1"
  },
+  "scripts": {
+    "test": "npx hardhat test"
+  }
}
```

不要な定義を削除し、hardhatの自動テストを実行するためのコマンドを追加しました。

次に、安全なスマートコントラクトを開発するために使用されるライブラリ **OpenZeppelin** をインストールします。

`packages/contract`ディレクトリにいることを確認し、以下のコマンドを実行してください。

```bash
yarn add --dev @openzeppelin/contracts
```

[OpenZeppelin](https://github.com/OpenZeppelin/openzeppelin-contracts) はイーサリアムネットワーク上で安全なスマートコントラクトを実装するためのフレームワークです。

OpenZeppelinには非常に多くの機能が実装されておりインポートするだけで安全にその機能を使うことができます。

### ⭐️ 実行する

すべてが機能していることを確認するには、以下を実行します。

```
npx hardhat compile
```

次に、以下を実行します。

```
npx hardhat test
```

次のように表示されます。

![](/public/images/Polygon-Generative-NFT/section-1/1_2_1.png)

ターミナル上で`ls`と入力してみて、下記のフォルダーとファイルが表示されていたら成功です。

```bash
README.md         cache             hardhat.config.js package.json      test
artifacts         contracts         node_modules      scripts
```

ここまできたら、フォルダーの中身を整理しましょう。

まず、`test`の下のファイル`Lock.js`を削除します。

1. `test`フォルダーに移動: `cd test`

2. `Lock.js`を削除: `rm Lock.js`

次に、上記の手順を参考にして`contracts`の下の`Lock.sol`を削除してください。実際のフォルダは削除しないように注意しましょう。


### ☀️ Hardhat の機能について

Hardhatは段階的に下記を実行しています。

1\. **Hardhat は、スマートコントラクトを Solidity からバイトコードにコンパイルしています。**

- バイトコードとは、コンピュータが読み取れるコードの形式のことです。

2\. **Hardhat は、あなたのコンピュータ上でテスト用の「ローカルイーサリアムネットワーク」を起動しています。**

3\. **Hardhat は、コンパイルされたスマートコントラクトをローカルイーサリアムネットワークに「デプロイ」します。**

ターミナルに出力されたアドレスを確認してみましょう。

```bash
Greeter deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3
```

これは、イーサリアムネットワークのテスト環境でデプロイされたスマートコントラクトのアドレスです。

### 😲 JSON ファイル（メタデータ）を作成する

次に、画像ごとにJSONファイルを作成し、OpenSeaなどのプラットフォームに準拠した形式にデータを形成していきます。

`packages/library`に向かい、`metadata.py`を開き下記のように中身を更新してください。

```javascript
// metadata.py
BASE_IMAGE_URL = "ipfs://ここにあなたのCIDを貼り付けます";
BASE_NAME = "ここにあなたのコレクションの名前を記入します";
```

私の`metadata.py`は下記のようになります。

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

`BASE_NAME`に、`First Collection #`とつけると、NFTには、`First Collection #1`、`First Collection #2`のようなIDが付与されます。

`description`にはあなたのコレクションの説明を記載しましょう。

`metadata.py`の更新が完了したら、ターミナルを開き、`library`ディレクトリ上で、次のコマンドを実行してください。

```
yarn library generate:JSON
```

プログラムは、メタデータを生成する`edition`を要求します。

- `edition`は前回のレッスンで指定したコレクションの名前です。

あなたが作成したコレクションの`edition`の名前をターミナルに入力してください。

> ✍️: わたしの場合、`first collection`と入力します。

プログラムが完了したら、`library/output/あなたのedition/json`フォルダに移動して中身を確認しましょう。

下記のように、NFT画像それぞれに対してJSONファイルが生成されていれば成功です。

![](/public/images/Polygon-Generative-NFT/section-1/1_2_4.png)

### 💫 JSON ファイルを IPFS にアップロードする

最後に、生成されたJSONファイルをIPFSにアップロードしていきましょう。

`library/output/あなたのedition/json`フォルダを`images`フォルダをアップロードしたときと同じ要領で、IPFSにアップロードしてください。

PinataにアップロードされたJSONファイルは下記のように表示されます。
![](/public/images/Polygon-Generative-NFT/section-1/1_2_5.png)

私の`#0 `番目のNFTコレクションのデータは以下のようになります。

```
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
