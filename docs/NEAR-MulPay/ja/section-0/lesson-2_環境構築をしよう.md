### 🏭 環境構築をしよう

このプロジェクトは上級者向けということで、GitHubからある程度出来上がったプロジェクトをcloneするのではなく`1 からプロジェクトを作成`していきます！

スマートコントラクトの作成に使う言語は`Solidity`です。

フロントエンドでは`Dart`という言語を用いた`Flutter`というフレームワークで開発していきます。Flutterを用いることによる最大の利点はios,android,webアプリを全て同じコード（一部変える必要有り）で記述できるという特徴があります。

なじみのない方も多いかもしれませんが、現在Flutterは使用者数が急増しておりライブラリの数も豊富で自由度の高いUIを作成することできることが魅力です。

では早速環境構築をしていきましょう！

**Flutter の開発環境構築**

Windows版の方は[こちら](https://blog.css-net.co.jp/entry/2022/05/30/133942)を、Macの方は[こちら](https://zenn.dev/kboy/books/ca6a9c93fd23f3/viewer/5232dc)を参照して環境構築を行なってください。

またAndroidのデバイスがない方は、デバッグで使うエミュレータのセットアップを[こちら](https://docs.flutter.dev/get-started/install/macos#set-up-the-android-emulator)で行ってください。

上記までが完了したら、次にGoogle Play Storeでmetamaskをインストールした後に、metamaskをセットアップをしましょう。エミュレータの方もエミュレータ内のGoogle Play Storeでmetamaskのインストール＋セットアップ

エミュレータの方はmetamaskをインストールできないエラーにあうかもしれません。その時は[こちら](https://www.youtube.com/watch?v=oZlO1SxJmg8)の動画を参考にしてみてください。

エミュレータはこのようになります！
![](/public/images/NEAR-MulPay/section-0/0_2_1.png)

metamaskのセットアップではアカウントを２つ（受信用・送金用）作成して、Aurora Testnetを追加しましょう。[こちら](https://docs.alchemy.com/docs/how-to-add-near-aurora-to-metamask)を参考にするとスムーズにAurora Testnetを追加できます！
追加できたらこのようになります。
![](/public/images/NEAR-MulPay/section-0/0_2_2.png)

Flutterの環境構築はそれぞれのPCによって予期しないエラーが出ることがよくある（筆者の経験）ので何か問題があれば気軽にdiscordで質問してみてください！

最後にコントラクトとやり取りする仲介役をしてくれる`Infura`でアカウントを作って、Aurora Testnet用のhttp keyを[こちら](https://infura.io/)で取得しましょう。
手順は下の通りです。

1. アカウントを作成（作成済みの人は2から）
2. アカウントを作成したら右上の`Create New Key`ボタンを押す
3. web3 API（Formerly Ethereum）を選択して、プロジェクトの名前を記入して`Create`ボタンを押す
4. dashboardの`Manage Key`ボタンを押して下の画面が出てきたら成功！
   ![](/public/images/NEAR-MulPay/section-0/0_2_3.png)

下にスクロールして`Aurora`用のhttp keyがあります。

drop down buttonを押すとテストネット用のものがあります。これは後で使います！
![](/public/images/NEAR-MulPay/section-0/0_2_4.png)

では次に、`node` / `yarn`を取得する必要があります。お持ちでない場合は、[こちら](https://hardhat.org/tutorial/setting-up-the-environment.html)にアクセスしてください。

`node v16`をインストールすることを推奨しています。

それでは本プロジェクトで使用するフォルダーを作成してきましょう。作業を始めるディレクトリに移動したら、次のコマンドを実行します。

```bash
mkdir NEAR-Mulpay
cd NEAR-Mulpay
yarn init --private -y
```

NEAR-Mulpayディレクトリ内に、package.jsonファイルが生成されます。

```bash
NEAR-Mulpay
 └── package.json
```

それでは、`package.json`ファイルを以下のように更新してください。

```json
{
  "name": "NEAR-Mulpay",
  "version": "1.0.0",
  "description": "Token swap dapp",
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

```bash
yarn <パッケージ名> <実行したいコマンド>
```

それでは、ワークスペースのパッケージを格納するディレクトリを作成しましょう。

以下のようなフォルダー構成となるように、`packages`ディレクトリとその中に`contract`ディレクトリを作成してください（`client`ディレクトリは、後ほどのレッスンでスターターコードをクローンする際に作成したいと思います）。

```diff
NEAR-Mulpay
 ├── package.json
+└── packages/
+    └── contract/
```

`contract`ディレクトリには、スマートコントラクトを構築するためのファイルを作成していきます。

最後に、NEAR-Mulpayディレクトリ下に`.gitignore`ファイルを作成して以下の内容を書き込みます。

```bash
**/yarn-error.log*

# dependencies
**/node_modules

# miscpackages
**/.DS_Store
```

最終的に以下のようなフォルダー構成となっていることを確認してください。

```bash
NEAR-Mulpay
 ├── .gitignore
 ├── package.json
 └── packages/
     └── contract/
```

これでモノレポの雛形が完成しました！

### ✨ Hardhat をインストールする

スマートコントラクトをすばやくコンパイルし、ローカル環境にてテストを行うために、**Hardhat** というツールを使用します。

- Hardhatにより、ローカル環境でイーサリアムネットワークを簡単に起動し、テストネットでイーサリアムを利用できます。

- 「サーバー」がブロックチェーンであることを除けば、Hardhatはローカルサーバーと同じです。

それでは、先ほど作成した`packages/contract`ディレクトリ内にファイルを作成します。ターミナルに向かい、`packages/contract`ディレクトリ内で以下のコマンドを実行します。

```bash
cd packages/contract
yarn init --private -y
```

`package.json`の内容を以下のように書き換えてください。

```
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
  "dependencies": {
    "@openzeppelin/contracts": "^4.8.2",
    "dotenv": "^16.0.3"
  },
}
```

その後以下のコマンドを実行して必要なパッケージをインストールしてください。

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

```bash
npx hardhat
```

`hardhat`がターミナル上で立ち上がったら、それぞれの質問を以下のように答えていきます。

```
・What do you want to do? →「Create a TypeScript project」を選択
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
✔ Hardhat project root: · /NEAR-Mulpay/packages/contract
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
NEAR-Mulpay
 ├── .gitignore
 ├── package.json
 └── packages/
     └── contract/
+        ├── .gitignore
+        ├── README.md
+        ├── contracts/
+        ├── hardhat.config.ts
+        ├── package.json
+        ├── scripts/
+        └── test/
```

それでは、`contract`ディレクトリ内に生成された`package.json`ファイルを以下を参考に更新をしましょう。

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
+    "test": "npx hardhat test",
+    "deploy":"npx hardhat run scripts/deploy.ts --network testnet_aurora",
+  }
}
```

不要な定義を削除し、hardhatの自動テストを実行するためのコマンドを追加しました。

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

![](/public/images/NEAR-Mulpay/section-1/1_2_2.png)

ターミナル上で`ls`と入力してみて、下記のフォルダーとファイルが表示されていたら成功です。

```bash
README.md         cache             hardhat.config.ts package.json      test
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

`NEAR-Mulpay/packages`ディレクトリに移動して下のコマンドをターミナルで実行しましょう。

```bash
flutter create client
```

次に下のコマンドを実行して`package.json`を作成してください。

```bash
yarn init --private -y
```

その後作成したpackage.jsonファイルを下のように編集してください。

```
{
  "name": "client",
  "version": "1.0.0",
  "scripts":{
    "start": "flutter run"
  }
}
```

プロジェクトが完成したら`client`ディレクトリに移動して、ディレクトリ構造が以下のようになっていることを確認してください。

末尾が`/`となっているものはディレクトリ、それ以外はファイルであることを示しています

```
client
├── README.md
├── analysis_options.yaml
├── android/
├── ios/
├── lib/
├── linux/
├── macos/
├── payment_dapp.iml
├── package.json
├── pubspec.lock
├── pubspec.yaml
├── test/
├── web/
└── windows/
```

下のコマンドをターミナルで実行し確認することができます。

```bash
tree -L 1 -F
```

ではこの中の`lib`ディレクトリの中身を編集して以下のような構造にしてください。

```bash
lib/
├── main.dart
├── model/
│   └── contract_model.dart
└── view/
    ├── screens/
    │   ├── home.dart
    │   ├── qr_code_scan.dart
    │   ├── send.dart
    │   ├── signin.dart
    │   └── wallet.dart
    └── widgets/
        ├── coin.dart
        ├── navbar.dart
        └── qr_code.dart
```

下のコマンドを`lib`ディレクトリに移動して実行し確認することができます。

```bash
tree -L 3 -F
```

これで環境構築＋ディレクトリ構造の作成は完了です。

### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discordの`#near`で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の4点を記載してください ✨

```
1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット
```

---

おめでとうございます！

section-0は終了です！

次のセクションではいよいよコントラクトの作成に移ります。

頑張っていきましょう 🚀
