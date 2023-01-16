### ✅ 環境構築を行う

このプロジェクトの全体像は次のとおりです。

1 \. **スマートコントラクトを作成します。**

- ユーザーがメッセージをスマートコントラクト上でやり取りのするための処理方法に関するすべてのロジックを実装します。
- 開発は`Ethereum`のローカルチェーンを利用して作成します。

2 \. **スマートコントラクトをブロックチェーン上にデプロイします。**

- スマートコントラクトを`Avalanche`の`C-Chain`（のテストネット）へデプロイします。
- 世界中の誰もがあなたのスマートコントラクトにアクセスできます。
- **ブロックチェーンは,サーバーの役割を果たします。**

3 \. **Web アプリケーション（dApp）を構築します**。

- ユーザーはWebサイトを介して,ブロックチェーン上に展開されているあなたのスマートコントラクトと簡単にやりとりできます。
- スマートコントラクトの実装 + フロントエンドユーザー・インタフェースの作成 👉 dAppの完成を目指しましょう 🎉

### ✨ Hardhat をインストールする

スマートコントラクトをすばやくコンパイルし,ローカル環境でテストするために,**Hardhat** というツールを使用します。

- Hardhatにより,ローカル環境でイーサリアムネットワークを簡単に起動し,テストネットでethereumを利用できます。
- 「サーバー」がブロックチェーンであることを除けば,Hardhatはローカルサーバーと同じです。

まず,`node` / `npm`を取得する必要があります。
お持ちでない場合は,[こちら](https://hardhat.org/tutorial/setting-up-the-environment#installing-node.js) にアクセスし`Node.js`をインストールしてください。
`Node.js`をインストールすると, そのパッケージ管理ツールである`npm`も同時にインストールされます。

> 動作確認。
>
> ```
> $ node -v
> v18.6.0
> ```
>
> ```
> $ npm -v
> 8.13.2
> ```
>
> 併せて本プロジェクトの実行環境(上記のバージョン)もトラブル時の参考にしてください。

続いて, `typescript`を使用するのでターミナルで以下を実行しましょう。
`$`で始まる行はターミナル上で実行していることを表していて, `$`を除いたものが実行コマンドです。

```
$ npm install -g typescript
```

> 動作確認。
>
> ```
> $ tsc -v
> Version 4.7.4
> ```
>
> `tsc`は`typescript`のコマンドです。

### 🛫 プロジェクトを作成しよう

作業したいディレクトリに移動したら,次のコマンドを実行します。

```bash
$ mkdir Avax-Messenger
$ cd Avax-Messenger
$ mkdir contract
$ cd contract
$ npm init -y
$ npm install --save-dev hardhat @openzeppelin/test-helpers
$ npm install dotenv
```

dapp全体のディレクトリ(`Avax-Messenger`)とコントラクト実装に使用するディレクトリ(`contract`)を用意しました。
次に`npm init`によりnpmパッケージを管理するための環境をセットアップを行いました。
最後にスマートコントラクトの開発に必要な以下のパッケージを`npm`コマンドを利用してインストールしています。

- `hardhat`
- `dotenv`: 環境変数の設定で必要になります。コントラクトをデプロイする際に利用します。
- `@openzeppelin/test-helpers`: テストを支援するライブラリです。コントラクトのテストを書く際に利用します。

> `--save-dev`とは
> アプリの開発時のみ必要なパッケージ(テストツールなど)のインストールに使用するオプション指定です。
> アプリ自体が動くのに必要なパッケージのインストールには`--save`または何も指定せずに`npm install`を使用します。
> [こちら](https://stackoverflow.com/questions/22891211/what-is-the-difference-between-save-and-save-dev)を参考にしてください。

### 👏 サンプルプロジェクトを開始する

次に,Hardhatを実行します。

ターミナルで`contract`に移動し,下記を実行します。
`npx hardhat`を実行すると対話形式で指示を求められるので下記のように回答します。
`Create a TypeScript project`を選択するところ以外は`enter`を押せば例通りになるはずです。

```
$ npx hardhat
...
✔ What do you want to do? · Create a TypeScript project
✔ Hardhat project root: · path/to/contract /contract
✔ Do you want to add a .gitignore? (Y/n) · y
✔ Do you want to install this sample project's dependencies with npm (@nomicfoundation/hardhat-toolbox)? (Y/n) · y
```

### ⭐️ 実行する

すべてが機能していることを確認するには,以下を実行します。

```
$ npx hardhat compile
```

次に,以下を実行します。

```
$ npx hardhat test
```

次のように表示されたら成功です！ 🎉

![](/public/images/AVAX-Messenger/section-1/1_1_1.png)

ここまできたら,フォルダーの中身を整理しましょう。

`contract`内は以下のようなフォルダ構成になっているはずです。

```
contract
├── README.md
├── artifacts
├── cache
├── contracts
├── hardhat.config.ts
├── node_modules
├── package-lock.json
├── package.json
├── scripts
├── test
├── tsconfig.json
└── typechain-types
```

まず,`test`の下のファイル`Lock.ts`を削除します。

1. `test`フォルダーに移動: `cd test`
2. `Lock.ts`を削除: `rm Lock.ts`

次に,上記の手順を参考にして`contracts`の下の`Lock.sol`を削除してください。実際のフォルダは削除しないように注意しましょう。

### 🐊 `github`にソースコードをアップロードしよう

本プロジェクトの最後では, アプリをデプロイするために`github`へソースコードをアップロードする必要があります。

**Avax-Messenger**全体を対象としてアップロードしましょう。

今後の開発にも役に立つと思いますので, 今のうちに以下にアップロード方法をおさらいしておきます。

`GitHub`のアカウントをお持ちでない方は,[こちら](https://qiita.com/okumurakengo/items/848f7177765cf25fcde0) の手順に沿ってアカウントを作成してください。

`GitHub`へソースコードをアップロードをしたことがない方は以下を参考にしてください。

[新しいレポジトリを作成](https://docs.github.com/ja/get-started/quickstart/create-a-repo)（リポジトリ名などはご自由に）した後,  
手順に従いターミナルからアップロードを済ませます。  
以下ターミナルで実行するコマンドの参考です。(`Avax-Messenger`直下で実行することを想定しております)

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
> Github のレポジトリをクローン・プッシュする際に,SSHKey を作成し,GitHub に公開鍵を登録する必要があります。
>
> SSH（Secure SHell）はネットワークを経由してマシンを遠隔操作する仕組みのことで,通信が暗号化されているのが特徴的です。
>
> 主にクライアント（ローカル）からサーバー（リモート）に接続をするときに使われます。この SSH の暗号化について,仕組みを見ていく上で重要になるのが秘密鍵と公開鍵です。
>
> まずはクライアントのマシンで秘密鍵と公開鍵を作り,公開鍵をサーバーに渡します。そしてサーバー側で「この公開鍵はこのユーザー」というように,紐付けを行っていきます。
>
> 自分で管理して必ず見せてはいけない秘密鍵と,サーバーに渡して見せても良い公開鍵の 2 つが SSH の通信では重要になってきます。
> Github における SSH の設定は,[こちら](https://docs.github.com/ja/authentication/connecting-to-github-with-ssh) を参照してください!

### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は,Discordの`#avalanche`で質問をしてください。

ヘルプをするときのフローが円滑になるので,エラーレポートには下記の3点を記載してください ✨

```
1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット
```

---

環境設定が完了したら,次のレッスンに進んでください 🎉
