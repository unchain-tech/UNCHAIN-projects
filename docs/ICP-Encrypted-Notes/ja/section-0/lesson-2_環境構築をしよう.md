### 🗂 環境構築をしよう

まず、`node` / `npm`を取得する必要があります。
お持ちでない場合は、下記のリンクにアクセスをしてインストールしてください。

- [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)

なお、本プロジェクトは以下のバージョンを推奨しています。

```bash
$ node -v
v18.17.0

$ npm -v
9.6.7
```

### 🦀 Rustの環境構築をする

[Rustインストール手順](https://doc.rust-lang.org/book/ch01-01-installation.html)を参考に、RustとCargoのインストールを行いましょう。

```bash
curl --proto '=https' --tlsv1.2 https://sh.rustup.rs -sSf | sh
```

次に、プログラムをWebAssemblyにコンパイルするためのビルドターゲットを追加しましょう。

```bash
rustup target add wasm32-unknown-unknown
```

### 🧰 IC SDKをインストールする

IC SDKは、Internet Computerブロックチェーン上でキャニスタースマートコントラクトを作成・管理するためのソフトウェア開発キットです。

[IC SDKのインストール](https://internetcomputer.org/docs/current/developer-docs/setup/install/)を参考に、IC SDKをインストールをしましょう。下記のように、バージョン`0.14.1`を指定してください。

```bash
DFX_VERSION=0.14.1 sh -ci "$(curl -sSL https://internetcomputer.org/install.sh)"
```

下記を実行してバージョンを確認してみましょう。

```bash
$ dfx --version
dfx 0.14.1
```

### 🍽 Git リポジトリをあなたの GitHub にフォークする

まだGitHubのアカウントをお持ちでない方は、[こちら](https://qiita.com/okumurakengo/items/848f7177765cf25fcde0) の手順に沿ってアカウントを作成してください。

GitHubのアカウントをお持ちの方は、下記の手順に沿ってプロジェクトの基盤となるリポジトリをあなたのGitHubに[フォーク](https://denno-sekai.com/github-fork/)しましょう。

1\. [ICP-Encrypted-Notes](https://github.com/unchain-tech/ICP-Encrypted-Notes)にアクセスをして、ページ右上の`Fork`ボタンをクリックします。

![](/public/images/ICP-Encrypted-Notes/section-0/0_1_1.png)

2\. Create a new forkページが開くので、「Copy the `main` branch only」という項目に**チェックが入っていることを確認します**。

![](/public/images/ICP-Encrypted-Notes/section-0/0_1_2.png)

設定が完了したら`Create fork`ボタンをクリックします。あなたのGitHubアカウントに`ICP-Encrypted-Notes`リポジトリのフォークが作成されたことを確認してください。

それでは、フォークしたリポジトリをローカル環境にクローンしましょう。

まず、下図のように、`Code`ボタンをクリックして`SSH`を選択し、Gitリンクをコピーしましょう。

![](/public/images/ICP-Encrypted-Notes/section-0/0_1_3.png)

ターミナル上で作業を行う任意のディレクトリに移動し、先ほどコピーしたリンクを用いて下記を実行してください。

```bash
git clone コピーした_github_リンク
```

無事に複製されたらローカル開発環境の準備は完了です。

### 🔍 フォルダ構成を確認する
<!-- TODO: 必要に応じて記述する -->

### ⭐️ 実行する

実際にアプリケーションを立ち上げてみましょう。

```bash
npm install
```

バックグラウンドでローカル実行環境を起動します。

```bash
dfx start --clean --background
```

プロジェクトの登録・ビルド・デプロイを行います。

```bash
npm run deploy:local
```

アプリケーションを起動しましょう。

```bash
npm run start
```

`Loopback:`に表示されたURLにアクセスをして、ブラウザで下記のようなアプリケーションが立ち上がることを確認しましょう。

<!-- TODO: 画像を追加する -->

URLを直接入力して、それぞれのページを表示してみましょう。

http://localhost:8080/notes

<!-- TODO: ノート一覧ページの画像を追加する -->

http://localhost:8080/devices

<!-- TODO: デバイス一覧ページの画像を追加する -->

確認が終わったら、一度実行環境を停止しましょう。

```bash
dfx stop
```

### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discordの`#icp`で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の4点を記載してください ✨

```
1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット
```

---

次のセクションに進み、ノートを管理する機能を実装していきましょう。