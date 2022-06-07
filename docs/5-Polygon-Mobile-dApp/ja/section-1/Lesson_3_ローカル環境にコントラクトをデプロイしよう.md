### 🐣 ローカル環境でコントラクトをコンパイルしてデプロイする

前のセクションでスマートコントラクトが書けたので、次はそれをコンパイルします。

ターミナルを `todo-dApp-contract` ディレクトリで開き、以下のコマンドを実行します。

```bash
truffle compile
```

`truffle compile` でエラーが出た場合は下記をお試しください。

```bash
npx truffle compile
```

下のようにターミナルに表示されていれば成功です。

![](/public/images/5-Polygon-Mobile-dApp/section-1/1_3_01.png)

ブロックチェーンにコントラクトを移行します。`migrations` ディレクトリに移動し、`2_todo_contract_migration.js` というファイルを新規作成し、以下のコードを追加してください。

```js
// 2_todo_contract_migration.js
const TodoContract = artifacts.require("TodoContract");

module.exports = function (deployer) {
    deployer.deploy(TodoContract);
};
```

移行作業を開始する前に、`Ganache` がインストールされていることを確認してください。システムで `Ganache GUI` アプリを起動します。

`truffle-config.js` の既存の内容をすべて削除し、以下のコードに置き換えてください。

```js
//truffle-config.js
module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 7545,
      network_id: "*",
    },
  },
  contracts_directory: "./contracts",
  compilers: {
    solc: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },

  db: {
    enabled: false,
  },
};
```

少し説明します。

`truffle-config.js` では、Truffleの基本的な構成を定義しています。

```js
//truffle-config.js
  networks: {
    development: {
      host: "localhost",
      port: 7545,
      network_id: "*",
    },
  },
```

現在、Ganacheブロックチェーンが稼働している `localhost:7545` にスマートコントラクトをデプロイするよう指定しています。

それでは、Ganache上にスマートコントラクトをデプロイするために、コマンドを実行していきます。

```bash
truffle migrate
```

`truffle migrate` でエラーが出た場合は下記をお試しください。

```bash
npx truffle migrate
```

こちらでもエラーが出た場合は、`truffle-config.js` ファイルを下記に変更して、もう一度上記のコマンドを実行してください。

```js
//truffle-config.js
module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 7545,
      network_id: "*",
    },
  },
  contracts_directory: "./contracts",

  compilers: {
    solc: {
      version: "0.8.11",
      optimizer: {
        enabled: true,
        runs: 200,
      },
    }
  },
  db: {
    enabled: false,
  },
};
```

上記でもエラーになった場合は、`truffle-config.js` ファイルを下記に変更して、もう一度上記のコマンドを実行してください。

```js
//truffle-config.js
const HDWalletProvider = require("@truffle/hdwallet-provider");
const fs = require("fs");
const mnemonic = fs.readFileSync(".secret").toString().trim();

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1", // Localhost (default: none)
      port: 8545, // Standard Ethereum port (default: none)
      network_id: "*", // Any network (default: none)
    },
  },

  // コンパイラの設定
  compilers: {
    solc: {},
  },
  plugins: ["truffle-plugin-verify"],
};
```

下のようにターミナルに表示されていれば成功です。

![](/public/images/5-Polygon-Mobile-dApp/section-1/1_3_02.png)

ローカルネットワークへのコンパイルとデプロイの作業は以上で完了です。
次は、Flutterアプリケーションへ接続していきましょう。
### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discord の `#section-1` で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の 3 点を記載してください ✨

```
1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット
```

---
ターミナルの出力結果を Discord の `#section-1` に投稿して、コミュニティにシェアしてください!

次のセクションに進んで、Flutterアプリケーションへの接続を開始しましょう 🎉
