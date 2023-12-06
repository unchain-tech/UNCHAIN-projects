### ✅ 環境構築を行う

このsectionではスマートコントラクトを実装していきます。

まずはそのための環境構築をしましょう！

まず、`node` / `yarn`を取得する必要があります。
お持ちでない場合は、下記のリンクにアクセスをしてインストールしてください。

- [Node.js](https://hardhat.org/tutorial/setting-up-the-environment#installing-node.js)
- [yarn](https://classic.yarnpkg.com/lang/en/docs/install/#mac-stable)

> 動作確認。
>
> ```
> $ node -v
> v18.6.0
> ```
>
> ```
> $ yarn -v
> 1.22.19
> ```
>
> 併せて本プロジェクトの実行環境(上記のバージョン)もトラブル時の参考にしてください。

それでは本プロジェクトで使用するフォルダを作成してきましょう。作業を始めるディレクトリに移動したら、次のコマンドを実行します。

```
mkdir AVAX-Asset-Tokenization
cd AVAX-Asset-Tokenization
yarn init --private -y
```

AVAX-Asset-Tokenizationディレクトリ内に、package.jsonファイルが生成されます。

```
AVAX-Asset-Tokenization
└── package.json
```

それでは、`package.json`ファイルを以下のように更新してください。

```json
// package.json
{
  "name": "avax-asset-tokenization",
  "version": "1.0.0",
  "description": "Asset tokenization",
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
//package.json
"workspaces": {
  "packages": [
    "packages/*"
  ]
},
```

また、ワークスペース内の各パッケージにアクセスするためのコマンドを以下の部分で定義しています。

```json
//package.json
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

それでは、AVAX-Asset-Tokenizationディレクトリ直下にいることを確認し、下記のコマンドを実行しましょう。

```
tsc --init
```

`tsconfig.json`ファイルが生成されたことを確認してください。設定はデフォルトのままにしておきます。

それでは、ワークスペースのパッケージを格納するディレクトリを作成しましょう。

以下のようなフォルダー構成となるように、`packages`ディレクトリとその中に`contract`ディレクトリを作成してください（`client`ディレクトリは、後ほどのレッスンでフロントエンド構築の際に作成したいと思います）。

```diff
 AVAX-Asset-Tokenization
 ├── package.json
+├── packages/
+│   └── contract/
 └── tsconfig.json
```

`contract`ディレクトリには、スマートコントラクトを構築するためのファイルを作成していきます。

`client`ディレクトには、フロントエンドを構築するためのファイルを作成していきます。

最後に、AVAX-Asset-Tokenizationディレクトリ下に`.gitignore`ファイルを作成して以下の内容を書き込みます。

```
**/yarn-error.log*

# dependencies
**/node_modules

# misc
**/.DS_Store
```

最終的に以下のようなフォルダー構成となっていることを確認してください。

```
AVAX-Asset-Tokenization
├── .gitignore
├── package.json
├── packages/
│   └── contract/
└── tsconfig.json
```

これでモノレポの雛形が完成しました！

### ✨ Hardhat をインストールする

スマートコントラクトをすばやくコンパイルし、ローカル環境でテストするために、**Hardhat** というツールを使用します。

`Hardhat`により、ローカル環境でイーサリアムネットワークを簡単に構築し、 テストを行えます。

デプロイ先の`Avalanche Fuji C-Chain`は`EVM`互換なので、 テストを(`Hardhat`の)イーサリアムネットワークで行っても問題ありません。

`Hardhat`を使って開発・テスト -> `Avalanche Fuji C-Chain`へデプロイ
という流れです。

それでは、先ほど作成した`packages/contract`ディレクトリ内にファイルを作成します。ターミナルに向かい、`packages/contract`ディレクトリへ移動して以下のコマンドを実行します。

```
# yarnパッケージを管理するための環境セットアップ
yarn init --private -y

# Hardhatとスマートコントラクトの開発に必要なプラグインのインストール
yarn add --dev @nomicfoundation/hardhat-chai-matchers@^1.0.6 @nomicfoundation/hardhat-network-helpers@^1.0.8 @nomicfoundation/hardhat-toolbox@^2.0.0 @nomiclabs/hardhat-ethers@^2.2.3 @nomiclabs/hardhat-etherscan@^3.1.7 @openzeppelin/test-helpers@^0.5.16 @typechain/ethers-v5@^11.0.0 @typechain/hardhat@^7.0.0 @types/chai@^4.3.5 @types/mocha@^10.0.1 hardhat@^2.12.2 hardhat-gas-reporter@^1.0.8 solidity-coverage@^0.8.1 ts-node@^10.9.1 typechain@^8.1.0

yarn add dotenv @openzeppelin/contracts@^4.7.3 @chainlink/contracts@^0.5.1
```

以下は主要なパッケージの説明です。

- `hardhat`: `solidity`を使った開発をサポートします。
- `@openzeppelin/test-helpers`: テストを支援するライブラリです。コントラクトのテストを書く際に利用します。
- `dotenv`: 環境変数の設定で必要になります。コントラクトをデプロイする際に利用します。
- `@openzeppelin/contracts`: [openzeppelin](https://www.openzeppelin.com/)が提供するコードを使用します。主にNFTのスマートコントラクト実装で使用します。
- `@chainlink/contracts`: [chainlink](https://chain.link/)が提供するコードを使用します。スマートコントラクトの自動実行を実装する際に使用します。

### 👏 サンプルプロジェクトを開始する

次に、 `Hardhat`を実行します。

`packages/contract`ディレクトリにいることを確認し、次のコマンドを実行します。

```
npx hardhat init
```

実行すると対話形式で指示を求められるので、それぞれを以下のように答えていきます。

```text
・What do you want to do?
→「Create a TypeScript project」を選択

・Hardhat project root:
→「'Enter'を押す」 (自動で現在いるディレクトリが設定されます。)

・Do you want to add a .gitignore? (Y/n)
→ y

・Do you want to install this sample project's dependencies with npm (@nomicfoundation/hardhat-toolbox)? (Y/n)
→ n
```

（例）

```
$npx hardhat init

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
✔ Hardhat project root: · /任意のディレクトリ/AVAX-Asset-Tokenization/packages/contract
✔ Do you want to add a .gitignore? (Y/n) · y
✔ Do you want to install this sample project's dependencies with npm (hardhat @nomicfoundation/hardhat-toolbox)? (Y/n) · n

You need to install these dependencies to run the sample project:
  npm install --save-dev "hardhat@^2.12.6" "@nomicfoundation/hardhat-toolbox@^2.0.0"

✨ Project created ✨

See the README.md file for some example tasks you can run

Give Hardhat a star on Github if you're enjoying it! 💞✨

     https://github.com/NomicFoundation/hardhat
```

この段階で、フォルダー構造は下記のようになっていることを確認してください。

```diff
AVAX-Asset-Tokenization
 ├── .gitignore
 ├── package.json
 ├── packages/
 │   └── contract/
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
  "private": true,
  "devDependencies": {
    "@nomicfoundation/hardhat-chai-matchers": "^1.0.6",
    "@nomicfoundation/hardhat-network-helpers": "^1.0.8",
    "@nomicfoundation/hardhat-toolbox": "^2.0.0",
    "@nomiclabs/hardhat-ethers": "^2.2.3",
    "@nomiclabs/hardhat-etherscan": "^3.1.7",
    "@openzeppelin/test-helpers": "^0.5.16",
    "@typechain/ethers-v5": "^11.0.0",
    "@typechain/hardhat": "^7.0.0",
    "@types/chai": "^4.3.5",
    "@types/mocha": "^10.0.1",
    "@typescript-eslint/eslint-plugin": "^5.59.7",
    "@typescript-eslint/parser": "^5.59.7",
    "eslint": "^8.41.0",
    "eslint-plugin-node": "^11.1.0",
    "hardhat": "^2.12.2",
    "hardhat-gas-reporter": "^1.0.8",
    "solidity-coverage": "^0.8.1",
    "ts-node": "^10.9.1",
    "typechain": "^8.1.0"
  },
  "dependencies": {
    "@chainlink/contracts": "^0.5.1",
    "@openzeppelin/contracts": "^4.7.3",
    "dotenv": "^16.0.3"
  }
+  "scripts": {
+    "deploy": "npx hardhat run scripts/deploy.ts --network fuji",
+    "cp": "cp typechain-types/contracts/AssetTokenization.ts ../client/types/ && cp artifacts/contracts/AssetTokenization.sol/AssetTokenization.json ../client/artifacts/",
+    "test": "npx hardhat test"
+  },
}
```

不要な定義を削除し、scriptsに複数のコマンドを定義しました。hardhatによる自動テストの実行やデプロイを行うためのコマンドを定義しています。

---

📓 `TypeScript`について

初めて`TypeScript`を触れる方向けに少し解説を入れさせて頂きます。

`TypeScript`のコードはコンパイルにより`JavaScript`のコードに変換されてから実行されます。

最終的には`JavaScript`のコードとなるので、 処理能力など`JavaScript`と変わることはありません。
ですが`TypeScript`には静的型付け機能を搭載しているという特徴があります。

静的型付けとは、 ソースコード内の値やオブジェクトの型をコンパイル時に解析し、 安全性が保たれているかを検証するシステム・方法のことです。

`JavaScript`では明確に型を指定する必要がないため、 コード内で型の違う値を誤って操作している場合は実行時にそのエラーが判明することがあります。

`TypeScript`はそれらのエラーはコンパイル時に判明するためバグの早期発見に繋がります。
バグの早期発見は開発コストを下げることにつながります。

本プロジェクトでは、 コントラクトのテストとフロントエンドの構築に`TypeScript`を使用します。
フロントエンドの実装の方では自ら型の指定をする部分が多いのでより型について認識できるかもしれません。
（コントラクのテスト実装の方では、 自動的に型を判別する機能を使用しているので自ら型を指定する部分が少ないです）。

ひとまず、 オブジェクトの型がわかっていないと実行できないような`JavaScript`コード、 という認識でまずは進めてみてください。

---

### ⭐️ 実行する

すべてが機能していることを確認するには、AVAX-Asset-Tokenization/直下から以下を実行します。

```
yarn test
```

次のように表示されたら成功です! 🎉

![](/public/images/AVAX-Asset-Tokenization/section-1/1_1_1.png)

これからテストを行う際は、`AVAX-Asset-Tokenization/`直下で`yarn test`を実行します。

ここまできたら、フォルダーの中身を整理しましょう。

`test`の下のファイル`Lock.ts`と
`contracts`の下のファイル`Lock.sol`を削除してください。

ディレクトリ自体は削除しないように注意しましょう。

### 🐊 `github`にソースコードをアップロードしよう

本プロジェクトの最後では、 アプリをデプロイするために`github`へソースコードをアップロードする必要があります。

**AVAX-Asset-Tokenization**全体を対象としてアップロードしましょう。

今後の開発にも役に立つと思いますので、 今のうちに以下にアップロード方法をおさらいしておきます。

`GitHub`のアカウントをお持ちでない方は、[こちら](https://qiita.com/okumurakengo/items/848f7177765cf25fcde0) の手順に沿ってアカウントを作成してください。

`GitHub`へソースコードをアップロードをしたことがない方は以下を参考にしてください。

[新しいレポジトリを作成](https://docs.github.com/ja/get-started/quickstart/create-a-repo)（リポジトリ名などはご自由に）した後、
手順に従いターミナルからアップロードを済ませます。
以下ターミナルで実行するコマンドの参考です。(`AVAX-Asset-Tokenization`直下で実行することを想定しております)

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

### 🌔 参考リンク

> [こちら](https://github.com/unchain-dev/AVAX-Asset-Tokenization)に本プロジェクトの完成形のレポジトリがあります。
> 期待通り動かない場合は参考にしてみてください。

### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、 `Discord`の`#avalanche`で質問をしてください。

ヘルプをするときのフローが円滑になるので、 エラーレポートには下記の三点を記載してください ✨

```
1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット
```

---

環境設定が完了したら、次のレッスンに進んでください 🎉
