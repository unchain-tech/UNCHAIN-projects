### 🖥 このレッスンの参考動画URL
[Dapp University](https://youtu.be/CgXQC4dbGUE?t=343)

### ✅ 環境構築を行う

このプロジェクトの全体像は次のとおりです。

1 \. **スマートコントラクトを作成します。**

- ユーザーが自分のトークンをステーキングする処理方法に関するすべてのロジックを実装します。
- スマートコントラクトは**サーバーコード**のようなものです。

2 \. **スマートコントラクトをブロックチェーン上にデプロイします。**

- 世界中の誰もがあなたのスマートコントラクトにアクセスできます。
- **ブロックチェーンは、サーバーの役割を果たします。**

3 \. **Web アプリケーション（dApp）を構築します**。

- ユーザーはWebサイトを介して、ブロックチェーン上に展開されているあなたのスマートコントラクトと簡単にやりとりできます。
- スマートコントラクトの実装 + フロントエンドユーザー・インタフェースの作成 👉 dAppの完成を目指しましょう 🎉

まず、`node` / `yarn`を取得する必要があります。お持ちでない場合は、[こちら](https://hardhat.org/tutorial/setting-up-the-environment.html)にアクセスしてください。

`node v16`をインストールすることを推奨しています。

### 🍽 Git リポジトリをあなたの GitHub にフォークする

まだGitHubのアカウントをお持ちでない方は、[こちら](https://qiita.com/okumurakengo/items/848f7177765cf25fcde0) の手順に沿ってアカウントを作成してください。

GitHubのアカウントをお持ちの方は、下記の手順に沿ってプロジェクトの基盤となるリポジトリをあなたのGitHubに[フォーク](https://denno-sekai.com/github-fork/)しましょう。

1. [こちら](https://github.com/unchain-tech/ETH-Yield-Farm)からETH-Yield-Farmリポジトリにアクセスをして、ページ右上の`Fork`ボタンをクリックします。

![](/public/images/ETH-Yield-Farm/section-1/1_1_3.png)

2. Create a new forkページが開くので、「Copy the `main` branch only」という項目に**チェックが入っていることを確認します**。

![](/public/images/ETH-Yield-Farm/section-1/1_1_4.png)


設定が完了したら`Create fork`ボタンをクリックします。あなたのGitHubアカウントに`ETH-Yield-Farm`リポジトリのフォークが作成されたことを確認してください。

それでは、フォークしたリポジトリをローカル環境にクローンしましょう。

まず、下図のように、`Code`ボタンをクリックして`SSH`を選択し、Gitリンクをコピーしましょう。

![](/public/images/ETH-Yield-Farm/section-1/1_1_5.png)

ターミナル上で作業を行う任意のディレクトリに移動し、先ほどコピーしたリンクを用いて下記を実行してください。

```
git clone コピーした_github_リンク
```

無事に複製されたらローカル開発環境の準備は完了です。

### 🔍 フォルダ構成を確認する

実装に入る前に、フォルダ構成を確認しておきましょう。クローンしたスタータープロジェクトは下記のようになっているはずです。

```
ETH-Yield-Farm
├── .git/
├── .gitignore
├── LICENSE
├── README.md
├── package.json
├── packages/
│   ├── client/
│   └── contract/
└── yarn.lock
```

スタータープロジェクトは、モノレポ構成となっています。モノレポとは、コントラクトとクライアント（またはその他構成要素）の全コードをまとめて1つのリポジトリで管理する方法です。

packagesディレクトリの中には、`client`と`contract`という2つのディレクトリがあります。

`package.json`ファイルの内容を確認してみましょう。

モノレポを作成するにあたり、パッケージマネージャーの機能である[Workspaces](https://classic.yarnpkg.com/lang/en/docs/workspaces/)を利用しています。

**workspaces**の定義をしている部分は以下になります。

```json
"workspaces": {
  "packages": [
    "packages/*"
  ]
},
```

この機能により、yarn installを一度だけ実行すれば、すべてのパッケージ（今回はコントラクトのパッケージとクライアントのパッケージ）を一度にインストールできるようになります。

では早速`yarn install`をターミナルで実行して必要なパッケージをインストールしましょう。

### 📺 フロントエンドの動きを確認する

次に、下記を実行してみましょう。

```
yarn client start
```

あなたのローカル環境で、Webサイトのフロントエンドが立ち上がりましたか？

例)ローカル環境で表示されているWebサイト

![](/public/images/ETH-Yield-Farm/section-1/1_1_1.png)

上記のような形でフロントエンドが確認できれば成功です。

これからフロントエンドの表示を確認したい時は、ターミナルに向かい、`ETH-Yield-Farm`ディレクトリ上で、`yarn client start`を実行します。これからも必要となる作業ですので、よく覚えておいてください。

ターミナルを閉じるときは、以下のコマンドが使えます ✍️

- Mac: `ctrl + c`
- Windows: `ctrl + shift + w`

### 👏 コントラクトを作成する準備をする

本プロジェクトではコントラクトを作成する際に`Hardhat`というフレームワークを使用します。

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
✔ Hardhat project root: · /ETH-Yield-Farm/packages/contract
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
ETH-Yield-Farm
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
+    "test": "npx hardhat test"
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

```
 Lock
    Deployment
      ✔ Should set the right unlockTime (1636ms)
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


  9 passing (2s)
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

### 🦊 MetaMask をダウンロードする

次に、イーサリアムウォレットをダウンロードしましょう。

このプロジェクトではMetaMaskを使用します。

- [こちら](https://MetaMask.io/download.html) からブラウザの拡張機能をダウンロードし、MetaMaskウォレットをあなたのブラウザに設定します。

すでに別のウォレットをお持ちの場合でも、今回はMetaMaskを使用してください。

> ✍️: MetaMask が必要な理由
> ユーザーが、スマートコントラクトを呼び出すとき、本人のイーサリアムアドレスと秘密鍵を備えたウォレットが必要となります。
>
> - これは、認証作業のようなものです。

### 💎 Alchemy でネットワークを作成する

Alchemyのアカウントを作成したら、`CREATE APP`ボタンを押してください。
![](/public/images/ETH-Yield-Farm/section-1/1_1_6.png)
次に、下記の項目を埋めていきます。下図を参考にしてください。
![](/public/images/ETH-Yield-Farm/section-1/1_1_7.png)

- `NAME` : プロジェクトの名前(例: `Yield-Farm`)
- `DESCRIPTION` : プロジェクトの概要（任意）
- `CHAIN` : `Ethereum`を選択。
- `NETWORK` : `Sepolia`を選択。
  それから、作成したAppの`VIEW DETAILS`をクリックします。
  ![](/public/images/ETH-Yield-Farm/section-1/1_1_8.png)
  プロジェクトを開いたら、`VIEW KEY`ボタンをクリックします。
  ![](/public/images/ETH-Yield-Farm/section-1/1_1_9.png)
  ポップアップが開くので、`HTTP`のリンクをコピーしてください。
  これがあなたが本番環境のネットワークに接続する際に使用する`API Key`になります。

- **`API Key`は、今後必要になるので、PC 上のわかりやすいところに保存しておきましょう。**

### 💻 ネットワーク情報の編集

では`contract`ディレクトリにある`hardhat.config.js`というファイルを下のように編集しましょう。

```js
require('@nomicfoundation/hardhat-toolbox');
require('dotenv').config();

const { PRIVATE_KEY, STAGING_ALCHEMY_KEY } = process.env;

module.exports = {
  solidity: '0.8.18',
  networks: {
    sepolia: {
      url: STAGING_ALCHEMY_KEY || '',
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : ['0'.repeat(64)],
      allowUnlimitedContractSize: true,
    },
  },
};
```
次に`contract`ディレクトリに`.env`ファイルを作成し下の変数を追加しましょう。

`PRIVATE_KEY`にはmetamaskで作成したウォレットのPrivate Keyを、`STAGING_ALCHEMY_KEY`にはAlchemyのHTTP Keyを代入しましょう！

```
PRIVATE_KEY=
STAGING_ALCHEMY_KEY=
```

これでSepoliaのテストネットをdeployする準備ができました!

### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discordの`#ethereum`で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の3点を記載してください ✨

```
1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット
```

---

環境設定が完了したら、次のレッスンに進んでください 🎉
