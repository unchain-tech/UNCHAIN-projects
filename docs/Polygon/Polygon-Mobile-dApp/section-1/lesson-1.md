---
title: プロジェクトのセットアップをしよう
---
## 💎 環境構築をしよう

まず、`Node.js`を取得する必要があります。お持ちでない場合は、[こちら](https://hardhat.org/tutorial/setting-up-the-environment#installing-node.js)にアクセスをしてインストールしてください。このプロジェクトで推奨するバージョンは`v20`です。

インストールが完了したら、ターミナルで以下のコマンドを実行し、バージョンを確認してください。

```
$ node -v
v20.5.0
```

それでは本プロジェクトで使用するフォルダを作成してきましょう。作業を始めるディレクトリに移動したら、次のコマンドを実行します。

```
mkdir Polygon-Mobile-dApp
cd Polygon-Mobile-dApp
```

Polygon-Mobile-dApp内に移動したら、[ドキュメント](https://yarnpkg.com/getting-started/install)を参考にYarnの設定を行いましょう。以下のコマンドを実行して、インストールを行います。

```
corepack enable
yarn set version 3.6.4
```

次に、以下のコマンドを実行して[Workspaces](https://yarnpkg.com/features/workspaces)を設定します。これは、プロジェクトをモノレポ構成にするためです。モノレポに関しては「[ETH dApp Section 1 - Lesson 1 🔍 フォルダ構成を確認する](/Ethereum/ETH-dApp/section-1/lesson-1)」を参照して下さい。

```
yarn init -w
```

package.jsonファイルが更新され、新たにpackagesというディレクトリが作成されます。

![](/images/Polygon-Mobile-dApp/section-1/1_1_1.png)

それでは、`package.json`ファイルを更新します。以下のように`"scripts"`を追加してください。ワークスペース内の各パッケージにアクセスするためのコマンドを定義します。

```json
{
  "name": "Polygon-Mobile-dApp",
  "packageManager": "yarn@3.6.4",
  "private": true,
  "workspaces": {
    "packages": ["packages/*"]
  },
  "scripts": {
    "contract": "yarn workspace contract",
    "client": "yarn workspace client",
    "test": "yarn workspace contract test"
  }
}
```

次に、Nodeパッケージのインストール方法を定義しましょう。`.yarnrc.yml`ファイルに以下の内容を追加してください。

```yml
nodeLinker: node-modules
```

最後に、`.gitignore`ファイルを下記の内容に更新しましょう。

```
# yarn
.yarn/*
!.yarn/patches
!.yarn/plugins
!.yarn/releases
!.yarn/sdks
!.yarn/versions

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
    "deploy": "npx hardhat run scripts/deploy.ts --network testnet_aurora"
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

`Hardhat`がターミナル上で立ち上がったら、それぞれの質問を以下のように答えていきます。

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

👷 Welcome to Hardhat v2.18.1 👷‍

✔ What do you want to do? · Create a JavaScript project
✔ Hardhat project root: · /Polygon-Mobile-dApp/packages/contract
✔ Do you want to add a .gitignore? (Y/n) · y

✨ Project created ✨

See the README.md file for some example tasks you can run

Give Hardhat a star on Github if you're enjoying it! ⭐️✨

     https://github.com/NomicFoundation/hardhat
```

> ⚠️: 注意
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
yarn test
```

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

**フロントエンドのプロジェクト作成**

次にフロントエンドのプロジェクトを作成していきます。

### ✨ Flutter の環境構築をする

今回は、Flutterプロジェクトフォルダの中にスマートコントラクトのフォルダを作成して開発していきますので先にFlutterの環境構築を済ませます。既に環境構築できている方は飛ばしてください。

では、お手持ちのデバイスに合わせてインストールしてください。

- [macOS](https://zenn.dev/kboy/books/ca6a9c93fd23f3/viewer/5232dc)

- [Windows](https://qiita.com/apricotcomic/items/7ff53950e10fcff212d2)

VS Codeをお使いの方は、コーディングのサポートツールとしてFlutterの拡張機能をダウンロードすることをお勧めします。ダウンロードは [こちら](https://marketplace.visualstudio.com/items?itemName=Dart-Code.flutter) から。

次に、ターミナルに向かいましょう。

`packages`ディレクトリに移動して、次のコマンドを実行します。

```
flutter create client
```

Flutterでは、プロジェクトの名前に`-`や大文字を入れることができない事に注意してください。詳しくは、[こちら](https://dart.dev/tools/pub/pubspec#name)をご覧ください。

`client`ディレクトリが作成されたことを確認してください。

![](/images/Polygon-Mobile-dApp/section-2/2_1_1.png)

### ✨ Flutter プロジェクトのセットアップをする。

まず、開発に必要なパッケージをダウンロードをします。

`client`フォルダ直下の`pubspec.yaml`ファイルを開いて、下記を追加してください。

```yaml
//pubspec.yaml
dev_dependencies:
  flutter_test:
    sdk: flutter

  # The "flutter_lints" package below contains a set of recommended lints to
  # encourage good coding practices. The lint set provided by the package is
  # activated in the `analysis_options.yaml` file located at the root of your
  # package. See that file for information about deactivating specific lint
  # rules and activating additional ones.
  flutter_lints: ^2.0.0
  // ===== 以下を追加 =====
  http: ^0.13.4
  web3dart: ^2.3.5
  web_socket_channel: ^2.2.0
  provider: ^6.0.2
```

Flutterのパッケージについて詳しく知りたい方は、[こちら](https://pub.dev/)から検索してみてください。

<!-- TODO: 下記は、TodoContractを作成した後に移動する。 -->
<!-- 次に、前のセクションでコンパイルした、ブロックチェーンに接続するための`TodoContract.json`ファイルを`client`の中に持ってきます。

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
``` -->

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

