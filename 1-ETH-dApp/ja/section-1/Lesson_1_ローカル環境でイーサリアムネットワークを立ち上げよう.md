### ✅ 環境構築を行う
このプロジェクトの全体像は次のとおりです。

1 \. **スマートコントラクトを作成します。**
* ユーザーが「👋（wave）」をスマートコントラクト上であなたに送るための処理方法に関するすべてのロジックを実装します。
* スマートコントラクトは**サーバーコード**のようなものです。

2 \. **スマートコントラクトをブロックチェーン上にデプロイします。**
* 世界中の誰もがあなたのスマートコントラクトにアクセスできるようになります。
* **ブロックチェーンは、サーバーの役割を果たします。**

3 \. **WEBアプリ（dApp）を構築します**。
* ユーザーはWEBサイトを介して、ブロックチェーン上に展開されているあなたのスマートコントラクトと簡単にやり取りできるようになります。
* スマートコントラクトの実装 + フロントエンドユーザー・インターフェースの作成 👉 dApp の完成を目指しましょう🎉

### ✨ Hardhat をインストールする
スマートコントラクトを素早くコンパイルし、ローカル環境でテストするために、**Hardhat** というツールを使用します。
* Hardhat により、ローカル環境でイーサリアムネットワークを簡単に起動し、テストネットでイーサリアムを利用できるようになります。
* 「サーバー」がブロックチェーンであることを除けば、Hardhat はローカルサーバーと同じです。

まず、`node` / `npm` を取得する必要があります。お持ちでない場合は、[こちら](https://hardhat.org/tutorial/setting-up-the-environment.html) にアクセスし、`node v16` をインストールしてください。
- 例として使われているバージョン `12` を `16` に変更することをお忘れなく！

次に、ターミナルに向かいましょう。

作業したいディレクトリに移動したら、次のコマンドを実行します。

```bash
mkdir ETH-dApp
cd ETH-dApp
mkdir my-wave-portal
cd my-wave-portal
npm init -y
npm install --save-dev hardhat
```

この段階で、フォルダ構造は下記のようになっていることを確認してください。

```
ETH-dApp
  |_ my-wave-portal
```

`my-wave-portal` の中にスマートコントラクトを構築するためのファイルを作成していきます。
### 👏 サンプルプロジェクトを開始する

次に、Hardhat を実行します。

ターミナルで `my-wave-portal` に移動し、下記を実行します:

```bash
npx hardhat
```

注：`npm` と一緒に `yarn` をインストールしている場合、`npm ERR! could not determine executable to run` などのエラーが発生する可能性があります。
* この場合、`yarn add hardhat` のコマンドを実行しましょう。

`hardhat` がターミナル上で立ち上がったら、`Create a basic sample project` を選択します。
* すべての選択肢で `yes` を選んでください。

サンプルプロジェクトでは、`hardhat-waffle` と `hardhat-ethers` をインストールするように求められます。

`npx hardhat` が実行されなかった場合、以下をターミナルで実行してください。

```bash
npm install --save-dev @nomiclabs/hardhat-waffle ethereum-waffle chai @nomiclabs/hardhat-ethers ethers
```

最後に、`npx hardhat accounts` を実行すると、次のような文字列が複数出力されます。

```
0xa0Ee7A142d267C1f36714E4a8F75612F20a79720
```

このアドレスは、Hardhatがブロックチェーン上のユーザーを特定するために生成するイーサリアムアドレスです。イーサリアムアドレスに関しては、あとで詳しく説明します。
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

![](/public/images/1-ETH-dApp/section-1/1_1_1.png)

ターミナル上で `my-wave-portal` に移動し、`ls` と入力してみて、下記のフォルダーとファイルが表示されていたら成功です。

```
README.md		hardhat.config.js	scripts
artifacts		node_modules		test
cache			package-lock.json
contracts		package.json
```

ここまできたら、フォルダーの中身を整理しましょう。

まず、`test` の下のファイル `sample-test.js` を削除します。
1. `test` フォルダーに移動: `cd test`
2. `sample-test.js` を削除: `rm sample-test.js`

また、`scripts` の下の `sample-script.js` を削除します。
1. 一つ上の階層のフォルダー（ `my-wave-portal` ）に移動: `cd ..`
2. `cd scripts` フォルダーに移動: `cd scripts`
3. `sample-script.js` を削除: `rm sample-script.js`

次に、上記の手順を参考にして `contracts` の下の `Greeter.sol` を削除してください。実際のフォルダは削除しないように注意しましょう。
### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discord の `#section-1` で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の3点を記載してください✨

```
1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット
```
---
環境設定が完了したら、次のレッスンに進んでください🎉
