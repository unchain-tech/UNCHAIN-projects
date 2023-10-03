### 🗂 環境構築をしよう

まず、`node` / `npm`を取得する必要があります。
お持ちでない場合は、下記のリンクにアクセスをしてインストールしてください。

- [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)

なお、本プロジェクトは以下のバージョンを推奨しています。

```
$ node -v
v18.17.0

$ npm -v
9.6.7
```

### 🦀 Rustの環境構築をする

[Rustインストール手順](https://doc.rust-lang.org/book/ch01-01-installation.html)を参考に、RustとCargoのインストールを行いましょう。

```
curl --proto '=https' --tlsv1.2 https://sh.rustup.rs -sSf | sh
```

次に、プログラムをWebAssemblyにコンパイルするためのビルドターゲットを追加しましょう。

```
rustup target add wasm32-unknown-unknown
```

### 🧰 IC SDKをインストールする

IC SDKは、Internet Computerブロックチェーン上でキャニスタースマートコントラクトを作成・管理するためのソフトウェア開発キットです。

[IC SDKのインストール](https://internetcomputer.org/docs/current/developer-docs/setup/install/)を参考に、IC SDKをインストールをしましょう。下記のように、バージョン`0.14.1`を指定してください。

```
DFX_VERSION=0.14.1 sh -ci "$(curl -sSL https://internetcomputer.org/install.sh)"
```

下記を実行してバージョンを確認してみましょう。

```
$ dfx --version
dfx 0.14.1
```

### 🍽 Git リポジトリをあなたの GitHub にフォークする

まだGitHubのアカウントをお持ちでない方は、[こちら](https://qiita.com/okumurakengo/items/848f7177765cf25fcde0) の手順に沿ってアカウントを作成してください。

GitHubのアカウントをお持ちの方は、下記の手順に沿ってプロジェクトの基盤となるリポジトリをあなたのGitHubに[フォーク](https://denno-sekai.com/github-fork/)しましょう。

1\. [ICP-Encrypted-Notes](https://github.com/unchain-tech/ICP-Encrypted-Notes)にアクセスをして、ページ右上の`Fork`ボタンをクリックします。

![](/public/images/ICP-Encrypted-Notes/section-0/0_2_1.png)

2\. Create a new forkページが開くので、「Copy the `main` branch only」という項目に**チェックが入っていることを確認します**。

![](/public/images/ICP-Encrypted-Notes/section-0/0_2_2.png)

設定が完了したら`Create fork`ボタンをクリックします。あなたのGitHubアカウントに`ICP-Encrypted-Notes`リポジトリのフォークが作成されたことを確認してください。

それでは、フォークしたリポジトリをローカル環境にクローンしましょう。

まず、下図のように、`Code`ボタンをクリックして`SSH`を選択し、Gitリンクをコピーしましょう。

![](/public/images/ICP-Encrypted-Notes/section-0/0_2_3.png)

ターミナル上で作業を行う任意のディレクトリに移動し、先ほどコピーしたリンクを用いて下記を実行してください。

```
git clone コピーした_github_リンク
```

無事に複製されたらローカル開発環境の準備は完了です。

### 📦 パッケージをインストールする

下記のコマンドを実行して、パッケージのインストールをしましょう。

```
npm install
```

問題なくインストールが行われることを確認します。

#### アプリケーションを立ち上げるには

必要な実装が不足しているため、今の状態でアプリケーションを立ち上げると失敗してしまいます。そのため、ここでは実際に実行しませんが、手順のみ提示しておきます。

1\. バックグラウンドでローカル実行環境を起動します。

```
dfx start --clean --background
```

2\. プロジェクトの登録・ビルド・デプロイを行います。

```
npm run deploy:local
```

3\. 開発サーバーを立ち上げ、アプリケーションを起動します。

```
npm run start
```

4\. `Loopback:`に表示されたURLにアクセスをします。

ローカルの実行環境を停止するには、下記のコマンドを実行します。

```
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

次のセクションに進み、ノートを管理する機能を実装しましょう 🎉
