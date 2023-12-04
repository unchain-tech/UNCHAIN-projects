## 💎環境構築をしよう

まず、`node` / `npm`を取得する必要があります。お持ちでない場合は、[こちら](https://hardhat.org/tutorial/setting-up-the-environment.html)にアクセスしてください（Hardhatのためのサイトですが気にしないでください）

それでは本プロジェクトで使用するフォルダーを作成してきましょう。作業を始めるディレクトリに移動したら、次のコマンドを実行します。

```
mkdir Polygon-Mobile-dApp
cd Polygon-Mobile-dApp
yarn init --private -y
```

Polygon-Mobile-dAppディレクトリ内に、package.jsonファイルが生成されます。

```
Polygon-Mobile-dApp
 └── package.json
```

それでは、`package.json`ファイルを以下のように更新してください。

```json
{
  "name": "Polygon-Mobile-dApp",
  "version": "1.0.0",
  "description": "Maken mobile dapp",
  "private": true,
  "workspaces": {
    "packages": [
      "packages/*"
    ]
  },
  "scripts": {
    "contract": "yarn workspace contract",
    "client": "yarn workspace client",
    "test": "yarn workspace contract test"
  }
}
```

`package.json`ファイルの内容を確認してみましょう。

モノレポを作成するにあたり、パッケージマネージャーの機能である[Workspaces](https://classic.yarnpkg.com/lang/en/docs/workspaces/)を利用しています。

この機能により、yarn installを一度だけ実行すれば、すべてのパッケージ（今回はコントラクトのパッケージとクライアントのパッケージ）を一度にインストールできるようになります。

**workspaces**の定義をしている部分は以下になります。

```json
"workspaces": {
  "packages": [
    "packages/*"
  ]
},
```

また、ワークスペース内の各パッケージにアクセスするためのコマンドを以下の部分で定義しています。

```json
"scripts": {
  "contract": "yarn workspace contract",
  "client": "yarn workspace client",
  "test": "yarn workspace contract test"
}
```

これにより、各パッケージのディレクトリへ階層を移動しなくてもプロジェクトのルート直下から以下のようにコマンドを実行することが可能となります（ただし、各パッケージ内に`package.json`ファイルが存在し、その中にコマンドが定義されていないと実行できません。そのため、現在は実行してもエラーとなります。ファイルは後ほど作成します）。

```
yarn <パッケージ名> <実行したいコマンド>
```

それでは、ワークスペースのパッケージを格納するディレクトリを作成しましょう。

以下のようなフォルダー構成となるように、`packages`ディレクトリとその中に`contract`ディレクトリを作成してください（`client`ディレクトリは、後ほどのレッスンでスターターコードをクローンする際に作成したいと思います）。

```diff
Polygon-Mobile-dApp
 ├── package.json
+└── packages/
+    └── contract/
```

`contract`ディレクトリには、スマートコントラクトを構築するためのファイルを作成していきます。

最後に、Polygon-Mobile-dAppディレクトリ下に`.gitignore`ファイルを作成して以下の内容を書き込みます。

```
**/yarn-error.log*

# dependencies
**/node_modules

# misc
**/.DS_Store
```

最終的に以下のようなフォルダー構成となっていることを確認してください。

```
Polygon-Mobile-dApp
 ├── .gitignore
 ├── package.json
 └── packages/
     └── contract/
```

これでモノレポの雛形が完成しました！

<!-- TODO change how to install hardhat -->
### ✨ Hardhat をインストールする

スマートコントラクトをすばやくコンパイルし、ローカル環境にてテストを行うために、**Hardhat** というツールを使用します。

- Hardhatにより、ローカル環境でイーサリアムネットワークを簡単に起動し、テストネットでイーサリアムを利用できます。

- 「サーバー」がブロックチェーンであることを除けば、Hardhatはローカルサーバーと同じです。

それでは、先ほど作成した`packages/contract`ディレクトリ内に`package.json`ファイルを作成します。そして以下のように編集しましょう。

```json
{
  "name": "contract",
  "version": "1.0.0",
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
  "scripts": {
    "test": "npx hardhat test",
    "deploy":"npx hardhat run scripts/deploy.ts --network testnet_aurora",
  }
}
```

次にターミナルに向かい、packages/contract`ディレクトリ内で以下のコマンドを実行します。

```
yarn install
```

> ✍️: `warning`について
> Hardhat をインストールすると、脆弱性に関するメッセージが表示される場合があります。
>
> 基本的に`warning`は無視して問題ありません。
>
> YARN から何かをインストールするたびに、インストールしているライブラリに脆弱性が報告されているかどうかを確認するためにセキュリティチェックが行われます。

### 👏 サンプルプロジェクトを開始する

次に、Hardhatを実行します。

`packages/contract`ディレクトリにいることを確認し、次のコマンドを実行します。

```
npx hardhat init
```

`hardhat`がターミナル上で立ち上がったら、それぞれの質問を以下のように答えていきます。

```
・What do you want to do? →「Create a JavaScript project」を選択
・Hardhat project root: →「'Enter'を押す」 (自動で現在いるディレクトリが設定されます。)
・Do you want to add a .gitignore? (Y/n) → 「y」
```

（例）
```
$ npx hardhat init

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
✔ Hardhat project root: · /Polygon-Mobile-dApp/packages/contract
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
> `npx hardhat init`が実行されなかった場合、以下をターミナルで実行してください。
>
> ```
> yarn add --dev @nomicfoundation/hardhat-toolbox
> ```

この段階で、フォルダー構造は下記のようになっていることを確認してください。

```diff
Polygon-Mobile-dApp
 ├── .gitignore
 ├── package.json
 └── packages/
     ├── client/
     └── contract/
+        ├── .gitignore
+        ├── README.md
+        ├── contracts/
+        ├── hardhat.config.js
+        ├── package.json
+        ├── scripts/
+        └── test/
```

不要な定義を削除し、hardhatの自動テストを実行するためのコマンドを追加しました。

次に、安全なスマートコントラクトを開発するために使用されるライブラリ **OpenZeppelin** をインストールします。

`packages/contract`ディレクトリにいることを確認し、以下のコマンドを実行してください。

```
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

![](/public/images/Polygon-Mobile-dApp/section-1/1_2_2.png)

ターミナル上で`ls`と入力してみて、下記のフォルダーとファイルが表示されていたら成功です。

```
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

```
Greeter deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3
```

これは、イーサリアムネットワークのテスト環境でデプロイされたスマートコントラクトのアドレスです。

**フロントエンドのプロジェクト作成**

次にフロントエンドのプロジェクトを作成していきます。

### ✨ Flutter の環境構築をする

今回は、Flutterプロジェクトフォルダの中にスマートコントラクトのフォルダを作成して開発していきますので先にFlutterの環境構築を済ませます。既に環境構築できている方は飛ばしてください。

では、お手持ちのデバイスに合わせてインストールしてください。

- [macOS](https://hara-chan.com/it/programming/how-to-setup-flutter/)（sdkダウンロード後は「Visual Studio Codeのセットアップ」をご参照ください）。

- [Windows](https://qiita.com/apricotcomic/items/7ff53950e10fcff212d2)

次に、ターミナルに向かいましょう。

`packages`ディレクトリに移動して、次のコマンドを実行します。

```
flutter create client
```

Flutterでは、プロジェクトの名前に`-`や大文字を入れることができない事に注意してください。詳しくは、[こちら](https://dart.dev/tools/pub/pubspec#name)をご覧ください。

この段階で、フォルダ構造は下記のようになっていることを確認してください。

![](/public/images/Polygon-Mobile-dApp/section-2/2_1_1.png)

### ✨ Flutterプロジェクトのセットアップをする。

まず、開発に必要なパッケージをダウンロードをします。

`client`フォルダ直下の`pubspec.yaml`ファイルを開いて、下記を追加してください。

```yaml
//pubspec.yaml
dependencies:
  flutter:
    sdk: flutter
//以下を追加
  http: ^0.13.4
  web3dart: ^2.3.5
  web_socket_channel: ^2.2.0
  provider: ^6.0.2
```

Flutterのパッケージについて詳しく知りたい方は、[こちら](https://pub.dev/)から検索してみてください。

次に、前のセクションでコンパイルした、ブロックチェーンに接続するための`TodoContract.json`ファイルを`client`の中に持ってきます。

`client`フォルダ直下に、`smartcontract`フォルダを作成してください。

その`smartcontract`フォルダの直下に、`TodoContract.json`ファイルを作成してください。

この`TodoContract.json`ファイルに、前のセクションでコンパイルした、`contract/build/contracts`内にある`TodoContract.json`ファイルの中身をコピー&ペーストしてください。

※この操作は、コンパイルしてデプロイするたびに行う必要があります。

では、`TodoContract.json`ファイルを認識してもらうために、`client`フォルダ直下の`pubspec.yaml`ファイルを開いて、ファイルの１番下を下記の様にしてください。
※ pubspec.yamlでは、インデントが大きな意味を持ちますので必ず下の様にしてください!

```yaml
//pubspec.yaml
# The following section is specific to Flutter.
flutter:
  uses-material-design: true
  assets:
    - smartcontract/TodoContract.json
```

最後に、必要ないので、`test`フォルダ内の`widget_test.dart`ファイルは削除してください。

これでFlutterプロジェクトのセットアップは完了しました。

### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discordの`#polygon`で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の3点を記載してください ✨

```
1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット
```

---

次のレッスンに進んで、スマートコントラクトの実装を開始しましょう 🎉
