### ✨ Truffle をインストールする

スマートコントラクトをすばやくコンパイルし、ローカル環境にて開発やテストを行うために、**Truffle** というツールを使用します。

- Truffle により、ローカル環境でイーサリアムネットワークを簡単に起動し、テストネットでイーサリアムを利用できます。

- 「サーバ」がブロックチェーンであることを除けば、Truffle はローカルサーバと同じです。

まず、`node` / `npm` を取得する必要があります。お持ちでない場合は、[こちら](https://hardhat.org/tutorial/setting-up-the-environment.html)にアクセスしてください。(Hardhat のためのサイトですが気にしないでください)

`node v16` をインストールすることを推奨しています。

次に、ターミナルに向かいましょう。

作業を始めるディレクトリに移動したら、次のコマンドを実行します。

```bash
mkdir todo-dApp
cd todo-dApp

mkdir todo-dApp-contract
cd todo-dApp-contract

npm install -g truffle

truffle init
```

`npm install -g truffle` でエラーが出た場合は下記をお試しください。

```bash
npm install -g truffle@5.4.29
```

`truffle init` コマンドは下記のディレクトリを構築します。

- `contracts` : すべてのスマートコントラクトは、このディレクトリに格納されます。

- `migrations` : スマートコントラクトとしてデプロイする Truffle が使用するすべてのスクリプトは、このディレクトリに格納されます。

- `test` : スマートコントラクトのテスト用スクリプトはすべてこのディレクトリに格納されます。

- `truffle-config.js` : Truffle の構成設定が含まれています。

この段階で、フォルダ構造は下記のようになっていることを確認してください。

![](/public/images/Polygon-Mobile-dApp/section-1/1_1_1.png)

### ✨ Ganache をインストールする

今回のプロジェクトでは、ローカル環境にイーサリアムチェーンを構築するのに `Ganache` を用います。

インストールされてない方は、[こちら](https://trufflesuite.com/ganache/)からインストールしてください。
### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discord の `#polygon-mobile-dapp` で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の 3 点を記載してください ✨

```
1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット
```

---

次のレッスンに進んで、スマートコントラクトの実装を開始しましょう 🎉
