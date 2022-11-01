### ✅ 環境構築を行う

このプロジェクトの全体像は次のとおりです。

1 \. **スマートコントラクトを作成します。**

- ユーザーがトークンをスマートコントラクト上で交換するための AMM ロジックを実装します。
- 開発は `Ethereum` のローカルチェーンを利用して作成します。

2 \. **スマートコントラクトをブロックチェーン上にデプロイします。**

- スマートコントラクトを `Avalanche` の `Fuji C-Chain` へデプロイします。
- 世界中の誰もがあなたのスマートコントラクトにアクセスできます。
- **ブロックチェーンは,サーバの役割を果たします。**

3 \. **Web アプリケーション（dApp）を構築します**。

- ユーザーは Web サイトを介して,ブロックチェーン上に展開されているあなたのスマートコントラクトと簡単にやりとりできます。
- スマートコントラクトの実装 + フロントエンドユーザー・インタフェースの作成 👉 dApp の完成を目指しましょう 🎉

### ✨ Hardhat をインストールする

スマートコントラクトをすばやくコンパイルし,ローカル環境でテストするために,**Hardhat** というツールを使用します。

- Hardhat により,ローカル環境でイーサリアムネットワークを簡単に起動し,テストネットで ethereum を利用できます。
- 「サーバ」がブロックチェーンであることを除けば,Hardhat はローカルサーバと同じです。

まず,`node` / `npm` を取得する必要があります。
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
mkdir Avalanche-AMM
cd Avalanche-AMM
mkdir contract
cd contract
npm init -y
npm install --save-dev hardhat @openzeppelin/test-helpers
npm install dotenv @openzeppelin/contracts
```

dapp 全体のディレクトリ(`Avalanche-AMM`)とコントラクト実装に使用するディレクトリ(`contract`)を用意しました。
次に`npm init`により npm パッケージを管理するための環境をセットアップを行いました。
最後にスマートコントラクトの開発に必要な以下のパッケージを`npm`コマンドを利用してインストールしています。

- `hardhat`: solidity を使った開発をサポートします。
- `dotenv`: 環境変数の設定で必要になります。コントラクトをデプロイする際に利用します。
- `@openzeppelin/test-helpers`: テストを支援するライブラリです。コントラクトのテストを書く際に利用します。
- `@openzeppelin/contracts`: `ERC20`が実装されています。コントラクトの実装時に`ERC20`を利用します。

### 👏 サンプルプロジェクトを開始する

次に,Hardhat を実行します。

ターミナルで `contract` に移動し,下記を実行します。
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

📓 `TypeScript` について

初めて `TypeScript` を触れる方向けに少し解説を入れさせて頂きます。

`TypeScript` のコードはコンパイルにより `JavaScript` のコードに変換されてから実行されます。

最終的には `JavaScript` のコードとなるので, 処理能力など `JavaScript` と変わることはありません。
ですが `TypeScript` には静的型付け機能を搭載しているという特徴があります。

静的型付けとは, ソースコード内の値やオブジェクトの型をコンパイル時に解析し, 安全性が保たれているかを検証するシステム・方法のことです。

`JavaScript` では明確に型を指定する必要がないため, コード内で型の違う値を誤って操作している場合は実行時にそのエラーが判明することがあります。

`TypeScript` はそれらのエラーはコンパイル時に判明するためバグの早期発見に繋がります。
バグの早期発見は開発コストを下げることにつながります。

本プロジェクトでは, コントラクトのテストとフロントエンドの構築に `TypeScript` を使用します。
フロントエンドの実装の方では自ら型の指定をする部分が多いのでより型について認識できるかもしれません。
(コントラクのテスト実装の方では, 自動的に型を判別する機能を使用しているので自ら型を指定する部分が少ないです。)

ひとまず, オブジェクトの型がわかっていないと実行できないような `JavaScript` コード, という認識でまずは進めてみてください。

---

### ⭐️ 実行する

すべてが機能していることを確認するには,以下を実行します。

```
$ npx hardhat test
```

次のように表示されたら成功です! 🎉

![](/public/images/AVAX-amm/section-1/1_1_1.png)

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

`test` の下のファイル `Lock.ts` と
`contracts` の下のファイル `Lock.sol`を削除してください。

実際のフォルダは削除しないように注意しましょう。

### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は,Discord の `#avax-amm` で質問をしてください。

ヘルプをするときのフローが円滑になるので,エラーレポートには下記の 3 点を記載してください ✨

```
1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット
```

---

環境設定が完了したら,次のレッスンに進んでください 🎉
