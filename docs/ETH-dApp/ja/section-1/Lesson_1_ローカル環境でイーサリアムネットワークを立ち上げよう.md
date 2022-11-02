### ✅ 環境構築を行う

このプロジェクトの全体像は次のとおりです。

1 \. **スマートコントラクトを作成します。**

- ユーザーが「👋(wave)」をスマートコントラクト上であなたに送るための処理方法に関するすべてのロジックを実装します。
- スマートコントラクトは**サーバーコード**のようなものです。

2 \. **スマートコントラクトをブロックチェーン上にデプロイします。**

- 世界中の誰もがあなたのスマートコントラクトにアクセスできます。
- **ブロックチェーンは、サーバーの役割を果たします。**

3 \. **Web アプリケーション(dApp)を構築します**。

- ユーザーはWebサイトを介して、ブロックチェーン上に展開されているあなたのスマートコントラクトと簡単にやりとりできます。
- スマートコントラクトの実装 + フロントエンドユーザー・インタフェースの作成 👉 dAppの完成を目指しましょう 🎉

### ✨ Hardhat をインストールする

スマートコントラクトをすばやくコンパイルし、ローカル環境でテストするために、**Hardhat** というツールを使用します。

- Hardhatにより、ローカル環境でイーサリアムネットワークを簡単に起動し、テストネットでイーサリアムを利用できます。
- 「サーバー」がブロックチェーンであることを除けば、Hardhatはローカルサーバーと同じです。

まず、`node` / `npm`を取得する必要があります。お持ちでない場合は、[こちら](https://hardhat.org/tutorial/setting-up-the-environment.html) にアクセスし、`node v16`をインストールしてください。

- 例として使われているバージョンを`16`に変更することをお忘れなく!

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

`my-wave-portal`の中にスマートコントラクトを構築するためのファイルを作成していきます。

### 👏 サンプルプロジェクトを開始する

次に、Hardhatを実行します。

ターミナルで`my-wave-portal`に移動し、下記を実行します:

```bash
npx hardhat
```

注：`npm`と一緒に`yarn`をインストールしている場合、`npm ERR! could not determine executable to run`などのエラーが発生する可能性があります。

- この場合、`yarn add hardhat`のコマンドを実行しましょう。

`hardhat`がターミナル上で立ち上がったら、`Create a JavaScript project`を選択します。

- プロジェクトのルートディレクトリを設定し、`.gitignore`を追加する選択肢で`yes`を選んでください。

サンプルプロジェクトでは、`hardhat-toolbox`をインストールするように求められます。

`npx hardhat`が実行されなかった場合、以下をターミナルで実行してください。

```bash
npm install --save-dev @nomicfoundation/hardhat-toolbox
```

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

![](/public/images/ETH-dApp/section-1/1_1_2.png)

ターミナル上で`my-wave-portal`に移動し、`ls`と入力してみて、下記のフォルダーとファイルが表示されていたら成功です。

```
README.md		hardhat.config.js	scripts
artifacts		node_modules		test
cache			package-lock.json .gitignore
contracts		package.json
```

ここまできたら、フォルダーの中身を整理しましょう。

まず、`test`の下のファイル`Lock.js`を削除します。

1. `test`フォルダーに移動: `cd test`
2. `Lock.js`を削除: `rm Lock.js`

次に、上記の手順を参考にして`contracts`の下の`Lock.sol`を削除してください。実際のフォルダは削除しないように注意しましょう。

### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discordの`#eth-dapp`で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の3点を記載してください ✨

```
1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット
```

---

環境設定が完了したら、次のレッスンに進んでください 🎉
