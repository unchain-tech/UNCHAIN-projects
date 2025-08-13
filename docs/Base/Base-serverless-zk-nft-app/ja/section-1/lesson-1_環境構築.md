---
title: "🛠️ 環境構築"
---

このセクションでは、`serverless-zk-nft-app`プロジェクトをあなたのローカルマシンで動かすための準備をします。

## 必要なツール

開発を始める前に、お使いのコンピュータに以下のツールがインストールされていることを確認してください。これらは、モダンなWeb開発に不可欠なものです。

- ****Node.js****:   
    v22以上。JavaScriptの実行環境です。
- ****pnpm****:    
    高速で効率的なパッケージマネージャーです。
- ****Git****:   
    ソースコードのバージョンを管理するための必須ツールです。

もしpnpmがインストールされていない場合は以下のコマンドで簡単にインストールできます！

```bash
npm install -g pnpm
```

## 📂 プロジェクトのクローンとセットアップ

準備が整ったら、早速プロジェクトのソースコードを手元に持ってきましょう。

1.  **リポジトリのクローン 📥**:  
    ターミナルを開き、作業したいディレクトリで以下のコマンドを実行して、プロジェクトのテンプレートをクローンします。

    ```bash
    git clone https://github.com/unchain-tech/Base-serverless-zk-nft-app.git
    ```

2.  **ディレクトリへ移動 ➡️**:  
    クローンしたプロジェクトのディレクトリに移動します。  
    ここが私たちの開発の拠点となります。

    ```bash
    cd Base-serverless-zk-nft-app
    ```

3.  **依存関係のインストール 📦**:    
    `pnpm`を使って、プロジェクト全体の依存関係をインストールします。
    これには、`circuit`、`backend`、`frontend`の各コンポーネントで必要なライブラリがすべて含まれます。

    ```bash
    pnpm i
    ```

    このコマンド一発で、pnpmが`pnpm-lock.yaml`ファイルに基づいて、必要なパッケージをすべて効率的にインストールしてくれます。

## 🔑 環境変数の設定

次に、プロジェクトを動かすために必要な「鍵」となる環境変数を設定します。

`.env.example`ファイルが各パッケージに用意されているので、それを参考に`.env`または`.env.local`ファイルを作成していきましょう。

****環境変数****は、APIキーや秘密鍵など、ソースコードに直接書き込みたくない大切な情報を安全に管理するための仕組みです。

### Backend (`pkgs/backend`)の環境変数の設定

`pkgs/backend`ディレクトリに`.env`ファイルを作成し、以下の内容を記述します。

```
PRIVATE_KEY="YOUR_PRIVATE_KEY"
ALCHMEY_API_KEY="YOUR_ALCHEMY_API_KEY"
BASESCAN_API_KEY="YOUR_BASESCAN_API_KEY"
```

- ****`PRIVATE_KEY`****:   
    スマートコントラクトをデプロイするウォレットの秘密鍵です。 

    **⚠️ 必ず開発用のウォレットを使用し、メインの資産を保管しているウォレットの秘密鍵は絶対に使用しないでください。**

- ****`ALCHMEY_API_KEY`****:  
    [Alchemy](https://www.alchemy.com/)のAPIキーです。 

     Alchemyは、私たちが開発するアプリケーションを`Base Sepolia`テストネットに接続するための中継役（RPCプロバイダー）等を提供するweb3インフラプロバイダーです。

- ****`BASESCAN_API_KEY`****:  
    Base用のブロックチェーンエクスプローラーである[Basescan](https://basescan.org/)のAPIキーです。  
    
    デプロイしたスマートコントラクトのソースコードを自動で認証・公開するために使用します。

### Frontend (`pkgs/frontend`)の環境変数の設定

`pkgs/frontend`ディレクトリに`.env.local`ファイルを作成し、以下の内容を記述します。

```
NEXT_PUBLIC_PRIVY_APP_ID="YOUR_PRIVY_APP_ID"
NEXT_PUBLIC_BICONOMY_BUNDLER_API_KEY="YOUR_BICONOMY_BUNDLER_API_KEY"
NEXT_PUBLIC_BICONOMY_PAYMASTER_API_KEY="YOUR_BICONOMY_PAYMASTER_API_KEY"
PASSWORD_HASH="YOUR_PASSWORD_HASH"
```

- ****`NEXT_PUBLIC_PRIVY_APP_ID`****:  
    web3ウォレットプロバイダー[Privy](https://www.privy.io/)のApp IDです。  

    Eメールやソーシャルアカウントでのログイン機能をアプリケーションに組み込むために使用します。

- ****`NEXT_PUBLIC_BICONOMY_BUNDLER_API_KEY`**** & ****`NEXT_PUBLIC_BICONOMY_PAYMASTER_API_KEY`****:   
    [Biconomy](https://www.biconomy.io/)のAPIキーです。  

    これらを使うことで、ユーザーがガス代（手数料）を支払うことなくNFTをミントできる、いわゆる「ガスレス」な体験を実現します。

- ****`PASSWORD_HASH`****:   
    ゼロ知識証明用のProofを生成するための「秘密の合言葉」のハッシュ値です。  
    この値は後のセクションで生成するので、**現時点では空のままで問題ありません。**

## ✅ セットアップの確認

お疲れ様でした！ 以上で基本的な環境構築は完了です。  
これで、ゼロ知識証明を使ったdAppを開発する準備が整いました。

次のセクションから、いよいよ各コンポーネントのコードに触れていきます。

## 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discordの`#zk`で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の3点を記載してください ✨

1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット
