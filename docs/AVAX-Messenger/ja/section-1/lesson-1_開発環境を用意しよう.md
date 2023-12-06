### ✅ 環境構築を行う

このプロジェクトの全体像は次のとおりです。

1 \. **スマートコントラクトを作成します。**

- ユーザーがメッセージをスマートコントラクト上でやり取りのするための処理方法に関するすべてのロジックを実装します。
- 開発は`Ethereum`のローカルチェーンを利用して作成します。

2 \. **スマートコントラクトをブロックチェーン上にデプロイします。**

- スマートコントラクトを`Avalanche`の`C-Chain`（のテストネット）へデプロイします。
- 世界中の誰もがあなたのスマートコントラクトにアクセスできます。
- **ブロックチェーンは、サーバーの役割を果たします。**

3 \. **Web アプリケーション（dApp）を構築します**。

- ユーザーはWebサイトを介して、ブロックチェーン上に展開されているあなたのスマートコントラクトと簡単にやりとりできます。
- スマートコントラクトの実装 + フロントエンドユーザー・インタフェースの作成 👉 dAppの完成を目指しましょう 🎉

まず、`node` / `yarn`を取得する必要があります。
お持ちでない場合は、下記のリンクにアクセスをしてインストールしてください。

`node v16`をインストールすることを推奨しています。

- [Node.js](https://hardhat.org/tutorial/setting-up-the-environment#installing-node.js)
- [yarn](https://classic.yarnpkg.com/lang/en/docs/install/#mac-stable)


それでは本プロジェクトで使用するフォルダーを作成してきましょう。作業を始めるディレクトリに移動したら、次のコマンドを実行します。

```
mkdir AVAX-Messenger
cd AVAX-Messenger
yarn init --private -y
```

AVAX-Messengerディレクトリ内に、package.jsonファイルが生成されます。

```
AVAX-Messenger
 └── package.json
```

それでは、`package.json`ファイルを以下のように更新してください。

```json
{
  "name": "avax-messenger",
  "version": "1.0.0",
  "description": "Message dapp that allows text and tokens (AVAX) to be exchanged.",
  "private": true,
  "workspaces": {
    "packages": [
      "packages/*"
    ]
  },
  "scripts": {
    "contract": "yarn workspace contract",
    "client": "yarn workspace client",
    "test": "yarn contract test"
  }
}
```

`package.json`ファイルの内容を確認してみましょう。

このプロジェクトはモノレポ構成となるようにフォルダを構成してきます。モノレポとは、コントラクトとクライアント（またはその他構成要素）の全コードをまとめて1つのリポジトリで管理する方法です。

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
  "test": "yarn contract test"
}
```

これにより、各パッケージのディレクトリへ階層を移動しなくてもプロジェクトのルート直下から以下のようにコマンドを実行することが可能となります（ただし、各パッケージ内に`package.json`ファイルが存在し、その中にコマンドが定義されていないと実行できません。そのため、現在は実行してもエラーとなります。ファイルは後ほど作成します）。

```
yarn <パッケージ名> <実行したいコマンド>
```

次に、TypeScriptの設定ファイル`tsconfig.json`を作成しましょう。今回のプロジェクトは、contractとclientどちらもTypeScriptを使用するため、それぞれのパッケージにtsconfig.jsonが存在します。そのため、ルートディレクトリにもtsconfig.jsonを配置することでパッケージ間で共通したい設定を記述することができます。

それでは、AVAX-Messengerディレクトリ直下にいることを確認し、下記のコマンドを実行しましょう。

```
tsc --init
```

`tsconfig.json`ファイルが生成されたことを確認してください。設定はデフォルトのままにしておきます。

それでは、ワークスペースのパッケージを格納するディレクトリを作成しましょう。

以下のようなフォルダー構成となるように、`packages`ディレクトリとその中に`contract`ディレクトリを作成してください（`client`ディレクトリは、後ほどのレッスンでフロントエンド構築の際に作成したいと思います）。

```diff
AVAX-Messenger
 ├── package.json
+├── packages/
+│   └── contract/
 └── tsconfig.json
```

`contract`ディレクトリには、スマートコントラクトを構築するためのファイルを作成していきます。

最後に、AVAX-Messengerディレクトリ下に`.gitignore`ファイルを作成して以下の内容を書き込みます。

```
**/yarn-error.log*

# dependencies
**/node_modules

# misc
**/.DS_Store
```

最終的に以下のようなフォルダー構成となっていることを確認してください。

```
AVAX-Messenger
 ├── .gitignore
 ├── package.json
 ├── packages/
 │   └── contract/
 └── tsconfig.json
```

これでモノレポの雛形が完成しました！

### ✨ Hardhat をインストールする

スマートコントラクトをすばやくコンパイルし、ローカル環境にてテストを行うために、**Hardhat** というツールを使用します。

- Hardhatにより、ローカル環境でイーサリアムネットワークを簡単に起動し、テストネットでイーサリアムを利用できます。

- 「サーバー」がブロックチェーンであることを除けば、Hardhatはローカルサーバーと同じです。

それでは、先ほど作成した`packages/contract`ディレクトリ内にファイルを作成します。ターミナルに向かい、packages/contract`ディレクトリ内で以下のコマンドを実行します。

```
cd packages/contract

yarn init --private -y

# Hardhatのインストール
yarn add --dev hardhat@^2.10.2

# スマートコントラクトの開発に必要なプラグインのインストール
yarn add --dev @nomicfoundation/hardhat-network-helpers@^1.0.0 @nomicfoundation/hardhat-chai-matchers@^1.0.0 @nomicfoundation/hardhat-toolbox@^1.0.2 @nomiclabs/hardhat-ethers@^2.0.0 @nomiclabs/hardhat-etherscan@^3.0.0 @types/chai@^4.2.0 @types/mocha@^9.1.0 @typechain/ethers-v5@^10.1.0 @typechain/hardhat@^6.1.2 hardhat-gas-reporter@^1.0.8 solidity-coverage@^0.7.21  ts-node@^10.9.1 typechain@^8.1.0
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
・Do you want to install this sample project's dependencies with npm (hardhat @nomicfoundation/hardhat-toolbox)? (Y/n) → 「n」
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

👷 Welcome to Hardhat v2.12.6 👷‍

✔ What do you want to do? · Create a TypeScript project
✔ Hardhat project root: · /任意のディレクトリ/AVAX-Messenger/packages/contract
✔ Do you want to add a .gitignore? (Y/n) · y
✔ Do you want to install this sample project's dependencies with npm (hardhat @nomicfoundation/hardhat-toolbox)? (Y/n) · n


You need to install these dependencies to run the sample project:
  npm install --save-dev "hardhat@^2.12.6" "@nomicfoundation/hardhat-toolbox@^2.0.0"

✨ Project created ✨

See the README.md file for some example tasks you can run

Give Hardhat a star on Github if you're enjoying it! 💞✨

     https://github.com/NomicFoundation/hardhat
```

> ⚠️: 注意
>
> Windows で Git Bash を使用してハードハットをインストールしている場合、このステップ (HH1) でエラーが発生する可能性があります。問題が発生した場合は、WindowsCMD（コマンドプロンプト）を使用して HardHat のインストールを実行してみてください。

この段階で、フォルダー構造は下記のようになっていることを確認してください。

```diff
AVAX-Messenger
 ├── .gitignore
 ├── package.json
 ├── packages/
 │  └── contract/
+│       ├── .gitignore
+│       ├── README.md
+│       ├── contracts/
+│       ├── hardhat.config.ts
+│       ├── package.json
+│       ├── scripts/
+│       ├── test/
+│       └── tsconfig.json
 └── tsconfig.json
```

それでは、`contract`ディレクトリ内に生成された`package.json`ファイルを以下を参考に更新をしましょう。

```diff
{
  "name": "contract",
  "version": "1.0.0",
-  "main": "index.js",
-  "license": "MIT",
+  "scripts": {
+    "test": "npx hardhat test",
+    "deploy": "npx hardhat run scripts/deploy.ts --network fuji",
+    "cp": "cp -r typechain-types ../client/typechain-types && cp artifacts/contracts/Messenger.sol/Messenger.json ../client/utils/Messenger.json "
  },
  "private": true,
  "devDependencies": {
    "@nomicfoundation/hardhat-chai-matchers": "^1.0.0",
    "@nomicfoundation/hardhat-network-helpers": "^1.0.0",
    "@nomicfoundation/hardhat-toolbox": "^1.0.2",
    "@nomiclabs/hardhat-ethers": "^2.0.0",
    "@nomiclabs/hardhat-etherscan": "^3.0.0",
    "@typechain/ethers-v5": "^10.1.0",
    "@typechain/hardhat": "^6.1.2",
    "@types/chai": "^4.2.0",
    "@types/mocha": "^9.1.0",
    "hardhat": "^2.10.2",
    "hardhat-gas-reporter": "^1.0.8",
    "solidity-coverage": "^0.7.21",
    "ts-node": "^10.9.1",
    "typechain": "^8.1.0"
  },
}
```

不要な定義を削除し、packages/contractに対してルートディレクトリから実行したいコマンドを追加しました。

### ⭐️ 実行する

すべてが機能していることを確認するには、AVAX-Messenger直下から以下を実行します。

```
yarn test
```

次のように表示されます。

![](/public/images/AVAX-Messenger/section-1/1_2_2.png)


ここまできたら、`packages/contract`フォルダーの中身を整理しましょう。

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

### 🐊 `GitHub`にソースコードをアップロードしよう

本プロジェクトの最後では、アプリをデプロイするために`GitHub`へソースコードをアップロードする必要があります。

**AVAX-Messenger**全体を対象としてアップロードしましょう。

今後の開発にも役に立つと思いますので、今のうちに以下にアップロード方法をおさらいしておきます。

`GitHub`のアカウントをお持ちでない方は、[こちら](https://qiita.com/okumurakengo/items/848f7177765cf25fcde0) の手順に沿ってアカウントを作成してください。

`GitHub`へソースコードをアップロードをしたことがない方は以下を参考にしてください。

[新しいレポジトリを作成](https://docs.github.com/ja/get-started/quickstart/create-a-repo)（リポジトリ名などはご自由に）した後、
手順に従いターミナルからアップロードを済ませます。
以下ターミナルで実行するコマンドの参考です。(`AVAX-Messenger`直下で実行することを想定しております)

```
$ git init
$ git add .
$ git commit -m "first commit"
$ git branch -M main
$ git remote add origin [作成したレポジトリの SSH URL]
$ git push -u origin main
```

> ✍️: SSH の設定を行う
>
> Github のレポジトリをクローン・プッシュする際に、SSHKey を作成し、GitHub に公開鍵を登録する必要があります。
>
> SSH（Secure SHell）はネットワークを経由してマシンを遠隔操作する仕組みのことで、通信が暗号化されているのが特徴的です。
>
> 主にクライアント（ローカル）からサーバー（リモート）に接続をするときに使われます。この SSH の暗号化について、仕組みを見ていく上で重要になるのが秘密鍵と公開鍵です。
>
> まずはクライアントのマシンで秘密鍵と公開鍵を作り、公開鍵をサーバーに渡します。そしてサーバー側で「この公開鍵はこのユーザー」というように、紐付けを行っていきます。
>
> 自分で管理して必ず見せてはいけない秘密鍵と、サーバーに渡して見せても良い公開鍵の 2 つが SSH の通信では重要になってきます。
> Github における SSH の設定は、[こちら](https://docs.github.com/ja/authentication/connecting-to-github-with-ssh) を参照してください!

### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discordの`#avalanche`で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の3点を記載してください ✨

```
1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット
```

---

環境設定が完了したら、次のレッスンに進んでください 🎉
