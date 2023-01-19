### ✅ 環境構築を行う

このsectionではスマートコントラクトを実装していきます。

まずはそのための環境構築をしましょう！

### ✨ Hardhat をインストールする

スマートコントラクトをすばやくコンパイルし,ローカル環境でテストするために,**Hardhat** というツールを使用します。

`Hardhat`により,ローカル環境でイーサリアムネットワークを簡単に構築し, テストを行えます。

デプロイ先の`Avalanche Fuji C-Chain`は`EVM`互換なので, テストを(`Hardhat`の)イーサリアムネットワークで行っても問題ありません。

`Hardhat`を使って開発・テスト -> `Avalanche Fuji C-Chain`へデプロイ
という流れです。

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

### 🛫 プロジェクトを作成しよう

作業したいディレクトリに移動したら,次のコマンドを実行します。

```bash
mkdir AVAX-AssetTokenization
cd AVAX-AssetTokenization
mkdir contract
cd contract
npm init -y
npm install --save-dev hardhat @openzeppelin/test-helpers
npm install dotenv @openzeppelin/contracts @chainlink/contracts
```

`dapp`全体のディレクトリ(`AVAX-AssetTokenization`)とコントラクト実装に使用するディレクトリ(`contract`)を用意しました。
次に`npm init`により`npmパッケージ`を管理するための環境セットアップを行いました。
最後にスマートコントラクトの開発に必要な以下のパッケージを`npm`コマンドを利用してインストールしています。

- `hardhat`: `solidity`を使った開発をサポートします。
- `@openzeppelin/test-helpers`: テストを支援するライブラリです。コントラクトのテストを書く際に利用します。
- `dotenv`: 環境変数の設定で必要になります。コントラクトをデプロイする際に利用します。
- `@openzeppelin/contracts`: [openzeppelin](https://www.openzeppelin.com/)が提供するコードを使用します。主にNFTのスマートコントラクト実装で使用します。
- `@chainlink/contracts`: [chainlink](https://chain.link/)が提供するコードを使用します。スマートコントラクトの自動実行を実装する際に使用します。

### 👏 サンプルプロジェクトを開始する

次に, `Hardhat`を実行します。

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

---

📓 `TypeScript`について

初めて`TypeScript`を触れる方向けに少し解説を入れさせて頂きます。

`TypeScript`のコードはコンパイルにより`JavaScript`のコードに変換されてから実行されます。

最終的には`JavaScript`のコードとなるので, 処理能力など`JavaScript`と変わることはありません。
ですが`TypeScript`には静的型付け機能を搭載しているという特徴があります。

静的型付けとは, ソースコード内の値やオブジェクトの型をコンパイル時に解析し, 安全性が保たれているかを検証するシステム・方法のことです。

`JavaScript`では明確に型を指定する必要がないため, コード内で型の違う値を誤って操作している場合は実行時にそのエラーが判明することがあります。

`TypeScript`はそれらのエラーはコンパイル時に判明するためバグの早期発見に繋がります。
バグの早期発見は開発コストを下げることにつながります。

本プロジェクトでは, コントラクトのテストとフロントエンドの構築に`TypeScript`を使用します。
フロントエンドの実装の方では自ら型の指定をする部分が多いのでより型について認識できるかもしれません。
（コントラクのテスト実装の方では, 自動的に型を判別する機能を使用しているので自ら型を指定する部分が少ないです）。

ひとまず, オブジェクトの型がわかっていないと実行できないような`JavaScript`コード, という認識でまずは進めてみてください。

---

### ⭐️ 実行する

すべてが機能していることを確認するには,以下を実行します。

```
$ npx hardhat test
```

次のように表示されたら成功です! 🎉

![](/public/images/AVAX-AssetTokenization/section-1/1_1_1.png)

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

`test`の下のファイル`Lock.ts`と
`contracts`の下のファイル`Lock.sol`を削除してください。

ディレクトリ自体は削除しないように注意しましょう。

### 🐊 `github`にソースコードをアップロードしよう

本プロジェクトの最後では, アプリをデプロイするために`github`へソースコードをアップロードする必要があります。

**AVAX-AssetTokenization**全体を対象としてアップロードしましょう。

今後の開発にも役に立つと思いますので, 今のうちに以下にアップロード方法をおさらいしておきます。

`GitHub`のアカウントをお持ちでない方は,[こちら](https://qiita.com/okumurakengo/items/848f7177765cf25fcde0) の手順に沿ってアカウントを作成してください。

`GitHub`へソースコードをアップロードをしたことがない方は以下を参考にしてください。

[新しいレポジトリを作成](https://docs.github.com/ja/get-started/quickstart/create-a-repo)（リポジトリ名などはご自由に）した後,
手順に従いターミナルからアップロードを済ませます。
以下ターミナルで実行するコマンドの参考です。(`AVAX-AssetTokenization`直下で実行することを想定しております)

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

### 🌔 参考リンク

> [こちら](https://github.com/unchain-dev/AVAX-Asset-Tokenization)に本プロジェクトの完成形のレポジトリがあります。
> 期待通り動かない場合は参考にしてみてください。


### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は, `Discord`の`#avax-asset-tokenization`で質問をしてください。

ヘルプをするときのフローが円滑になるので, エラーレポートには下記の三点を記載してください ✨

```
1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット
```

---

環境設定が完了したら,次のレッスンに進んでください 🎉
