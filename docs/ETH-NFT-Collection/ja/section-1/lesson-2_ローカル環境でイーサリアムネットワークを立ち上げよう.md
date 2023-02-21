### ✨ Hardhat をインストールする

スマートコントラクトをすばやくコンパイルし、ローカル環境にてテストを行うために、**Hardhat** というツールを使用します。

- Hardhatにより、ローカル環境でイーサリアムネットワークを簡単に起動し、テストネットでイーサリアムを利用できます。

- 「サーバー」がブロックチェーンであることを除けば、Hardhatはローカルサーバーと同じです。

まず、`node` / `npm`を取得する必要があります。お持ちでない場合は、[こちら](https://hardhat.org/tutorial/setting-up-the-environment.html)にアクセスしてください。

`node v16`をインストールすることを推奨しています。

次に、ターミナルに向かいましょう。

作業を始めるディレクトリに移動したら、次のコマンドを実行します。

```bash
mkdir ETH-NFT-collection
cd ETH-NFT-collection
mkdir epic-nfts
cd epic-nfts
npm init -y
npm install --save-dev hardhat
```

この段階で、フォルダ構造は下記のようになっていることを確認してください。

```
ETH-NFT-collection
	|_ epic-nfts
```

`epic-nfts`の中にスマートコントラクトを構築するためのファイルを作成していきます。

> ✍️: `warning`について
> 最後のコマンドを実行して Hardhat をインストールすると、脆弱性に関するメッセージが表示される場合があります。
>
> 基本的に`warning`は無視して問題ありません。
>
> NPM から何かをインストールするたびに、インストールしているライブラリに脆弱性が報告されているかどうかを確認するためにセキュリティチェックが行われます。

### 👏 サンプルプロジェクトを開始する

次に、Hardhatを実行します。

ターミナルで`epic-nfts`ディレクトリに移動し、下記を実行します：

```bash
npx hardhat
```

> ⚠️: 注意 #1
>
> Windows で Git Bash を使用してハードハットをインストールしている場合、このステップ (HH1) でエラーが発生する可能性があります。問題が発生した場合は、WindowsCMD（コマンドプロンプト）を使用して HardHat のインストールを実行してみてください。

> ⚠️: 注意 #2
>
> `npm`と一緒に`yarn`をインストールしている場合、`npm ERR! could not determine executable to run`などのエラーが発生する可能性があります。
>
> - この場合、`yarn add hardhat`のコマンドを実行しましょう。

> ⚠️: 注意 #3
>
> `npx hardhat`が実行されなかった場合、以下をターミナルで実行してください。
>
> ```bash
> npm install --save-dev @nomicfoundation/hardhat-toolbox
> ```

`hardhat`がターミナル上で立ち上がったら、`Create a JavaScript project`を選択します。

- プロジェクトのルートディレクトリを設定し、`.gitignore`を追加する選択肢で`yes`を選んでください。

次に、安全なスマートコントラクトを開発するために使用されるライブラリ **OpenZeppelin** をインストールします。

ターミナル上で下記を実行してください。

```bash
npm install @openzeppelin/contracts
```

[OpenZeppelin](https://github.com/OpenZeppelin/openzeppelin-contracts) はイーサリアムネットワーク上で安全なスマートコントラクトを実装するためのフレームワークです。

OpenZeppelinには非常に多くの機能が実装されておりインポートするだけで安全にその機能を使うことができます。

### ⭐️ 実行する

すべてが機能していることを確認するには、以下を実行します。

```
npx hardhat compile
```

次に、以下を実行します。

> ⚠️: 注意 #1
>
> `npx hardhat compile`が実行されなかった場合、以下をターミナルで実行してください。
>
> ```bash
> npm install --save-dev @nomicfoundation/hardhat-toolbox
> ```

```
npx hardhat test
```

次のように表示されます。

![](/public/images/ETH-NFT-Collection/section-1/1_2_2.png)

ターミナル上で`epic-nfts`に移動し、`ls`と入力してみて、下記のフォルダーとファイルが表示されていたら成功です。

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


### ☀️ Hardhat の機能について

Hardhatは段階的に下記を実行しています。

1\. **Hardhat は、スマートコントラクトを Solidity からバイトコードにコンパイルしています。**

- バイトコードとは、コンピュータが読み取れるコードの形式のことです。

2\. **Hardhat は、あなたのコンピュータ上でテスト用の「ローカルイーサリアムネットワーク」を起動しています。**

3\. **Hardhat は、コンパイルされたスマートコントラクトをローカルイーサリアムネットワークに「デプロイ」します。**

ターミナルに出力されたアドレスを確認してみましょう。

```bash
Greeter deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3
```

これは、イーサリアムネットワークのテスト環境でデプロイされたスマートコントラクトのアドレスです。

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

次のレッスンに進んで、独自のNFTコントラクトの実装を開始しましょう 🎉
