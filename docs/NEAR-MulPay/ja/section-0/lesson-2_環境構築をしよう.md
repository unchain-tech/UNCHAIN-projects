### 🏭 環境構築をしよう

このプロジェクトは上級者向けということで、GitHubからある程度出来上がったプロジェクトをcloneするのではなく`1 からプロジェクトを作成`していきます！

スマートコントラクトの作成に使う言語は`Solidity`です。

フロントエンドでは`Dart`という言語を用いた`Flutter`というフレームワークで開発していきます。Flutterを用いることによる最大の利点はios,android,webアプリを全て同じコード（一部変える必要有り）で記述できるという特徴があります。

なじみのない方も多いかもしれませんが、現在Flutterは使用者数が急増しておりライブラリの数も豊富で自由度の高いUIを作成することできることが魅力です。

では早速環境構築をしていきましょう！

**Flutter の開発環境構築**

Windows版の方は[こちら](https://blog.css-net.co.jp/entry/2022/05/30/133942)を、Macの方は[こちら](https://zenn.dev/kboy/books/ca6a9c93fd23f3/viewer/5232dc)を参照して環境構築を行なってください。

ここからはエミュレータを用意するための説明が記述されています。しかし、flutterを使うことでデスクトップ版のwebアプリとしても動作するアプリを開発することができます！ これがflutterのすごいところです。なので無理にエミュレータを用意する必要はありません。モバイル上でアプリをデバッグしたい方はここからの説明に従ってエミュレータの用意をしてみてください。

Androidのデバイスがない方は、デバッグで使うエミュレータのセットアップを[こちら](https://docs.flutter.dev/get-started/install/macos#set-up-the-android-emulator)で行ってください。

上記までが完了したら、次にGoogle Play Storeでmetamaskをインストールした後に、metamaskをセットアップをしましょう。エミュレータの方もエミュレータ内のGoogle Play Storeでmetamaskのインストール＋セットアップ

エミュレータの方はmetamaskをインストールできないエラーにあうかもしれません。その時は[こちら](https://www.youtube.com/watch?v=oZlO1SxJmg8)の動画を参考にしてみてください。

エミュレータはこのようになります！
![](/public/images/NEAR-MulPay/section-0/0_2_1.png)

metamaskのセットアップではアカウントを２つ（受信用・送金用）作成して、Aurora Testnetを追加しましょう。[こちら](https://docs.alchemy.com/docs/how-to-add-near-aurora-to-metamask)を参考にするとスムーズにAurora Testnetを追加できます！
追加できたらこのようになります。
![](/public/images/NEAR-MulPay/section-0/0_2_2.png)

Flutterの環境構築はそれぞれのPCによって予期しないエラーが出ることがよくある（筆者の経験）ので何か問題があれば気軽にdiscordで質問してみてください！

次に、コントラクトとやり取りする仲介役をしてくれる`Infura`でアカウントを作って、Aurora Testnet用のhttp keyを[こちら](https://infura.io/)で取得しましょう。
手順は下の通りです。

1. アカウントを作成（作成済みの人は2から）
2. アカウントを作成したら右上の`Create New Key`ボタンを押す
3. web3 API（Formerly Ethereum）を選択して、プロジェクトの名前を記入して`Create`ボタンを押す
4. dashboardの`Manage Key`ボタンを押して下の画面が出てきたら成功！
   ![](/public/images/NEAR-MulPay/section-0/0_2_3.png)

下にスクロールして`Aurora`用のhttp keyがあります。

drop down buttonを押すとテストネット用のものがあります。これは後で使います！
![](/public/images/NEAR-MulPay/section-0/0_2_4.png)

最後に、web3ウォレットとdAppsを連携してくれる[WalletConnect](https://walletconnect.com/)のSDKを使用するために必要なProject IDを取得しましょう。[こちら](https://cloud.walletconnect.com/)にアクセスをしてください。
手順は下の通りです。

1. アカウントを作成
2. アカウントを作成したら右上の`+ New Project`ボタンを押す
3. 任意のプロジェクト名を入力して`Create`ボタンを押す
4. プロジェクトが作成されたら完了！
   ![](/public/images/NEAR-MulPay/section-0/0_2_5.png)

Project IDは、後ほどフロントエンドを構築する際に必要となります。

ここからは実際にファイルを作成していきます。まずは`Node.js`を取得する必要があります。お持ちでない場合は、[こちら](https://hardhat.org/tutorial/setting-up-the-environment#installing-node.js)にアクセスしてください。このプロジェクトで推奨するバージョンはv20です。

インストールが完了したら、ターミナルで以下のコマンドを実行し、バージョンを確認してください。

```
$ node -v
v20.5.0
```

それでは本プロジェクトで使用するフォルダーを作成してきましょう。作業を始めるディレクトリに移動したら、次のコマンドを実行します。

```
mkdir NEAR-MulPay
cd NEAR-MulPay
yarn init -w
```

⚠️ `command not found: yarn`が発生した場合は、以下のコマンドを実行後、再度`yarn init -w`を実行してください（[参照](https://yarnpkg.com/getting-started/install)）。

```
corepack enable
```

NEAR-MulPayディレクトリ内の構成を確認してみましょう。

```
NEAR-MulPay/
├── .git/
├── .gitignore
├── README.md
├── package.json
├── packages/
└── yarn.lock
```

`package.json`ファイルの内容を確認してみましょう。

モノレポを作成するにあたり、パッケージマネージャーの機能である[Workspaces](https://classic.yarnpkg.com/lang/en/docs/workspaces/)を利用しています。

この機能により、yarn installを一度だけ実行すれば、すべてのパッケージ（今回はコントラクトのパッケージとクライアントのパッケージ）を一度にインストールできるようになります。

**workspaces**の定義をしている部分は以下になります。

```json
  "workspaces": [
    "packages/*"
  ],
```

それでは、`package.json`ファイルにワークスペース内の各パッケージにアクセスするためのコマンドを記述しましょう。下記のように`"scripts"`を追加してください。

```json
{
  "name": "NEAR-MulPay",
  "version": "1.0.0",
  "description": "Token swap dapp",
  "private": true,
  "workspaces": [
    "packages/*"
  ],
  "scripts": {
    "contract": "yarn workspace contract",
    "client": "yarn workspace client",
    "test": "yarn workspace contract test"
  }
}
```

これにより、各パッケージのディレクトリへ階層を移動しなくてもプロジェクトのルート直下から以下のようにコマンドを実行することが可能となります（ただし、各パッケージ内に`package.json`ファイルが存在し、その中にコマンドが定義されていないと実行できません。そのため、現在は実行してもエラーとなります。ファイルは後ほど作成します）。

```
yarn <パッケージ名> <実行したいコマンド>
```

次に、Nodeパッケージのインストール方法を定義しましょう。プロジェクトのルートに`.yarnrc.yml`ファイルを作成し、以下の内容を記述してください。

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
NEAR-MulPay
├── .git/
├── .gitignore
├── .yarnrc.yml
├── README.md
├── package.json
├── packages/
└── yarn.lock
```

これでモノレポの雛形が完成しました！

### ✨ Hardhat をインストールする

スマートコントラクトをすばやくコンパイルし、ローカル環境にてテストを行うために、**Hardhat** というツールを使用します。

- Hardhatにより、ローカル環境でイーサリアムネットワークを簡単に起動し、テストネットでイーサリアムを利用できます。

- 「サーバー」がブロックチェーンであることを除けば、Hardhatはローカルサーバーと同じです。

それでは、先ほど準備をしたワークスペースにスマートコントラクトを構築するためのパッケージを作成していきましょう。`NEAR-MulPay/packages`ディレクトリ中に`contract`ディレクトリを作成してください。

```diff
 NEAR-MulPay
 └── packages/
+    └── contract/
```

次に、`package.json`ファイルを作成します。ターミナルに向かい、`packages/contract`ディレクトリ内で以下のコマンドを実行します。

```
yarn init -p
```

必要なパッケージをインストールしましょう。

```
yarn add @openzeppelin/contracts@4.8.2 dotenv@16.3.1 && yarn add --dev @nomicfoundation/hardhat-chai-matchers@1.0.6 @nomicfoundation/hardhat-network-helpers@1.0.8 @nomicfoundation/hardhat-toolbox@2.0.2 @nomiclabs/hardhat-ethers@2.2.3 @nomiclabs/hardhat-etherscan@3.1.7 @typechain/ethers-v5@11.1.2 @typechain/hardhat@7.0.0 @types/chai@4.3.8 @types/mocha@10.0.2 chai@4.3.10 ethers@5.7.2 hardhat@2.18.1 hardhat-gas-reporter@1.0.9 solidity-coverage@0.8.5 ts-node@10.9.1 typechain@8.3.2 typescript@5.2.2
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
・What do you want to do? →「Create a TypeScript project」を選択
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

✔ What do you want to do? · Create a TypeScript project
✔ Hardhat project root: · /NEAR-MulPay/packages/contract
✔ Do you want to add a .gitignore? (Y/n) · y

✨ Project created ✨

See the README.md file for some example tasks you can run

Give Hardhat a star on Github if you're enjoying it! ⭐️✨

     https://github.com/NomicFoundation/hardhat
```

> ⚠️: 注意
>
> Windows で Git Bash を使用してハードハットをインストールしている場合、このステップ (HH1) でエラーが発生する可能性があります。問題が発生した場合は、WindowsCMD（コマンドプロンプト）を使用して HardHat のインストールを実行してみてください。

この段階で、フォルダー構造は下記のようになっていることを確認してください。

```diff
 NEAR-MulPay
 └── packages/
     └── contract/
+        ├── .gitignore
+        ├── README.md
+        ├── contracts/
+        ├── hardhat.config.ts
+        ├── package.json
+        ├── scripts/
+        ├── test/
+        └── tsconfig.json
```

package.jsonファイルに`"scripts"`を追加しましょう。

```json
{
  "name": "contract",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "deploy":"npx hardhat run scripts/deploy.ts --network testnet_aurora",
    "test": "npx hardhat test"
  },
  "dependencies": {
    ...
```

test/Lock.tsファイルを下の内容で上書きしてください。ethers v6ベースのToolboxで生成された初期コードを、ethers v5ベースのコードに置き換えます。このプロジェクトではethers v5を使用するためです。

修正箇所は2箇所です。まず初めに、ファイルの先頭でインポートしている`@nomicfoundation/hardhat-toolbox/network-helpers`を`@nomicfoundation/hardhat-network-helpers`に変更します。

**（変更前）**

```typescript
import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
```

**（変更後）**

```typescript
import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-network-helpers";
```

次に、47行目の`lock.target`を`lock.address`に変更します。

**（変更前）**

```typescript
      expect(await ethers.provider.getBalance(lock.target)).to.equal(
        lockedAmount
      );
```

**（変更後）**

```typescript
      expect(await ethers.provider.getBalance(lock.address)).to.equal(
        lockedAmount
      );
```

### ⭐️ 実行する

すべてが機能していることを確認するには、以下を実行します。

```
yarn test
```

次のように表示されます。

```
  Lock
    Deployment
      ✔ Should set the right unlockTime (1257ms)
      ✔ Should set the right owner
      ✔ Should receive and store the funds to lock
      ✔ Should fail if the unlockTime is not in the future
    Withdrawals
      Validations
        ✔ Should revert with the right error if called too soon
        ✔ Should revert with the right error if called from another account
        ✔ Shouldn't fail if the unlockTime has arrived and the owner calls it
      Events
        ✔ Should emit an event on withdrawals
      Transfers
        ✔ Should transfer the funds to the owner


  9 passing (1s)

```

ターミナル上で`ls`と入力してみて、下記のフォルダーとファイルが表示されていたら成功です。

```
README.md         artifacts         cache             contracts         hardhat.config.ts package.json      scripts           test              tsconfig.json     typechain-types
```

### ☀️ Hardhat の機能について

Hardhatは段階的に下記を実行しています。

1\. **Hardhat は、スマートコントラクトを Solidity からバイトコードにコンパイルしています。**

- バイトコードとは、コンピュータが読み取れるコードの形式のことです。

2\. **Hardhat は、あなたのコンピュータ上でテスト用の「ローカルイーサリアムネットワーク」を起動しています。**

3\. **Hardhat は、コンパイルされたスマートコントラクトをローカルイーサリアムネットワークに「デプロイ」します。**

**フロントエンドのプロジェクト作成**

次にフロントエンドのプロジェクトを作成していきます。

`NEAR-MulPay/packages`ディレクトリに移動して下のコマンドをターミナルで実行しましょう。

```
flutter create client
```

次に、作成された`client`ディレクトリに移動して下のコマンドを実行しましょう。

```
yarn init -p
```

その後作成されたpackage.jsonファイルに`"scripts"`を追加しましょう。

```json
{
  "name": "client",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "flutter:install": "flutter pub get",
    "flutter:run": "flutter run"
  }
}
```

プロジェクトが完成したら`client`ディレクトリの構造が以下のようになっていることを確認してください。

末尾が`/`となっているものはディレクトリ、それ以外はファイルであることを示しています

```
client
├── README.md
├── analysis_options.yaml
├── android/
├── client.iml
├── ios/
├── lib/
├── linux/
├── macos/
├── package.json
├── pubspec.lock
├── pubspec.yaml
├── test/
├── web/
└── windows/
```

下のコマンドをターミナルで実行し確認することができます。

```
tree -L 1 -F
```

ではこの中の`lib`ディレクトリの中身を編集して以下のような構造にしてください。

```
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

```
tree -L 3 -F
```

最後に、プロジェクトのルートにある`yarn.lock`ファイルを更新したいと思います。これは、clientワークスペースに新たなpackage.jsonが追加されたことを反映するためです。プロジェクトルートで以下のコマンドを実行しましょう。

```
yarn install
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
