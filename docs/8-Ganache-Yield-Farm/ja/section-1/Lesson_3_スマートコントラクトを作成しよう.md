###  🖥 このレッスンの参考動画URL
[Dapp University](https://youtu.be/CgXQC4dbGUE?t=1047)

### 📂 プロジェクトコードを確認する

1 \. `package.json`

`yield-farm-starter-project` フォルダの中に、`package.json` というファイルが存在します。

`package.json` は、プロジェクトで使用するすべての依存関係（dependencies）を保持するファイルです。

`package.json` ファイルには、アプリケーションとブロックチェーンを接続するための `web3.js` と `truffle` 、クライアント側のアプリケーションを構築するための `react` など、このプロジェクトの構築に必要な様々なパッケージの依存関係のリストが含まれています。

2 \. `truffle-config.js`

`yield-farm-starter-project` フォルダの中にある Truffle 設定ファイル（`truffle-config.js`）は、実際に Truffle プロジェクトをブロックチェーンに接続するファイルです。

`truffle-config.js` の 4-11 行目に注目してください。

```javascript
module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" // Match any network id
    },
  }
  :
```

ここでは、「本プロジェクトを Ganache に接続する」と定義しています。

下の図からわかるように、Ganache は localhost 上で、`host: "127.0.0.1"` と `port: 7545`で実行されていることがわかります。

![](/public/images/8-Ganache-Yield-Farm/section-1/12_1_2.png)

`truffle-config.js` にはそれらの情報が記載されています。

### ⛏ `TokenFarm.sol` を作成する

いよいよここからは実際にスマートコントラクトを作成していきます。`src/contracts` に `TokenFarm.sol` というファイルを新規作成します。

ターミナルを開いて `yield-farm-starter-project` にいることを確認してから下記のコードを実行しましょう。

```bash
touch src/contracts/TokenFarm.sol
```

これから、本プロジェクトのコアとなるイールドファーミング機能を `TokenFarm.sol` に実装していきます。

`TokenFarm.sol` によって、ユーザーは利子を得て、Dappトークンという新しいトークンを獲得することができるようになります。

まず、`TokenFarm.sol` にステーキングに使う関数を定義していきます。

`TokenFarm.sol` を以下のように更新していきます。

```javascript
// TokenFarm.sol
pragma solidity ^0.5.0;

contract TokenFarm{
    string public name = "Dapp Token Farm";
}
```

ここでは `TokenFarm` コントラクトで `string` 型の `name` という変数に値を代入しています。　

イーサリアム仮想マシン（EVM）である Ganache が機能しているかを確認するために非常に簡単なスマートコントラクトを作成しました。

次にスマートコントラクトをブロックチェーン上にデプロイするための `js` ファイルを作成しましょう。

ターミナルを開いて、`yield-farm-starter-project` にいることを確認し、以下のコードを実行して、`migrations` フォルダに `2_deploy_contracts.js` ファイルを作成します。

```bash
touch migrations/2_deploy_contracts.js
```

`2_deploy_contracts.js` を以下のように更新してください。

```javascript
// 2_deploy_contracts.js
const TokenFarm = artifacts.require("TokenFarm");

module.exports = function(deployer) {
  deployer.deploy(TokenFarm);
};
```

このマイグレーションファイル（ `2_deploy_contracts.js` ）が実行されると、取引を生み出す新しいスマートコントラクトがブロックチェーン上に配置されます。

それでは、ターミナルを開き `yield-farm-starter-project` にいることを確認したら、次のコードを実行してください。

```bash
truffle compile
```

`truffle compile` によりスマートコントラクトがコンパイルされます。

下のようになっていれば成功です。

```bash
Compiling your contracts...
===========================
> Compiling ./src/contracts/DaiToken.sol
> Compiling ./src/contracts/DappToken.sol
> Compiling ./src/contracts/Migrations.sol
> Compiling ./src/contracts/TokenFarm.sol
> Compiled successfully using:
   - solc: 0.5.16+commit.9c3226ce.Emscripten.clang
```

また、`src` ディレクトリの中に `abis` ディレクトリの中にそれぞれの `.sol` ファイルに対してabiファイルが作られていることを確認しましょう。

### 📂 ABI ファイルとは？

ABI (Application Binary Interface) はコントラクトの取り扱い説明書のようなものです。

Web アプリケーションがコントラクトと通信するために必要な情報が、ABI ファイルに含まれています。

コントラクト 1 つ 1 つにユニークな ABI ファイルが紐づいており、その中には下記の情報が含まれています。

1. そのコントラクトに使用されている関数の名前

2. それぞれの関数にアクセスするために必要なパラメータとその型

3. 関数の実行結果に対して返るデータ型の種類

### 🍫 Ganache が機能しているかを確認する

それでは次に Ganache が機能しているか確認するためにローカルネットワークにスマートコントラクトをデプロイしていきましょう！

ターミナルを開いいて `yield-farm-starter-project` にいることを確認してから下記のコードを実行してみてください。

```bash
truffle migrate
```

スマートコントラクトをブロックチェーン上に新しく配置し、マイグレーションを実行するには、`truffle migrate` コマンドを使用します。

ターミナルに、以下のような出力結果が返ってきていればデプロイは成功です。

```bash

  > Saving migration to chain.
   > Saving artifacts
   -------------------------------------
   > Total cost:          0.00450474 ETH

Summary
=======
> Total deployments:   1
> Final cost:          0.00450474 ETH
```

> 👀: **Ganache 内で ETH 残高が減ったことにお気づきでしょうか？**
>
> ブロックチェーン上にスマートコントラクトを展開することは、トランザクションを作成すること（ブロックチェーンにデータを書き込むこと）でもあります。そのため、`migration` を行う際にはガス代が必要です。
>
> Ganache の一番上に表示されているアカウントは、truffle のデフォルトアカウントです。
>
> 基本的にこのアカウントは、マイグレーションを実行するたびにスマートコントラクトをデプロイするユーザーをシミュレートしています。
>
>したがって、このアカウントの残高は減少しています。

次に Ganache 上でスマートコントラクトが正常にデプロイされているかを確認します。

### 💻 `truffle console` を使用する

ターミナルを開いいて `yield-farm-starter-project` ディレクトリにいることを確認してから下記のコードを実行してみてください。

```bash
truffle console
```

`truffle(development)>` がターミナルに表示されているはずです。この状態で、直接スマートコントラクトとターミナル上でやりとりすることができます。

そこで以下のコードを実行してください。

```bash
truffle(development)> tokenFarm = await TokenFarm.deployed()
```

ここでは、`TokenFarm.deployed()` により、ネットワークから `TokenFarm` のコントラクトを取得し、`tokenFarm` という変数に格納しています。


- `2_deploy_contracts.js` で、`TokenFarm` を定義しています。
- `TokenFarm.deployed()` は関数で、ブロックチェーンとのやりとりは非同期なので、 `await` キーワードを使っています。
- `deployed()` は実際に解決するために関数呼び出しの終了を約束したものを返し、それを変数に代入しています。


`tokenFarm = await TokenFarm.deployed()` を実行すると、`undefined` とターミナルに出力されるはずです。

次に、スマートコントラクトの中身を確認するためには、ターミナルで以下を実行して、変数値 `tokenFarm` を呼び出すしましょう。

```bash
truffle(development)> tokenFarm
```

ターミナルには、以下のような結果が出力されるはずです。

```bash
name: [Function (anonymous)] {
    call: [Function (anonymous)],
    sendTransaction: [Function (anonymous)],
    estimateGas: [Function (anonymous)],
    request: [Function (anonymous)]
  },
  sendTransaction: [Function (anonymous)],
  send: [Function (anonymous)],
  allEvents: [Function (anonymous)],
  getPastEvents: [Function (anonymous)]
}
:
```

この出力結果は、`tokenFarm` という変数に格納されているスマートコントラクトの中身を意味しています。

- truffle コンソール（ `truffle(development)>` ）は、ブロックチェーンを使用するためのJavaScript 実行環境です。

- truffle コンソールから Ganache 開発ブロックチェーン上に作成されたすべてのトランザクションにアクセスすることができます。

ターミナルで `tokenFarm.address` と入力すると、コントラクトのアドレスが表示されるので、確認してみましょう。

```bash
truffle(development)> tokenFarm.address
```

出力結果（`0x..`）が、ネットワーク上に存在する `tokenFarm` コントラクトのアドレスです。

また、コントラクトの名前も確認することができます。以下を実行してみましょう。


```bash
truffle(development)> name = await tokenFarm.name()
```
```bash
truffle(development)> name
```

`Dapp Token Farm` というコントラクトの名前が返ってくることを確認しましょう。

以上で `truffle console` を使ったコントラクトとのやり取りは終了です。

これで、あなたのスマートコントラクトがブロックチェーン上に存在することが確認できました！

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
あなたは、簡単なスマートコントラクトを作成し、ブロックチェーン上にアップしたことを確認しました🎉

あなたのコントラクトのアドレスをDiscordの `#section-1`☺️ でシェアしてください！

次の section-2 ではいよいよ本格的なスマートコントラクトを作成していくので楽しんでいきましょう！
