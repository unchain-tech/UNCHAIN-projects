---
title: "環境構築"
---

このセクションでは、`serverless-zk-nft-app`プロジェクトの開発環境をセットアップする手順を説明します。

## 🛠️ 必要なツール

開発を始める前に、以下のツールがインストールされていることを確認してください。

- **Node.js**: v22以上
- **pnpm**: パッケージマネージャー
- **Git**: バージョン管理システム

お使いのPCにpnpmがインストールされていない場合は、以下のコマンドでインストールできます。

```bash
npm install -g pnpm
```

## 📂 プロジェクトのクローンとセットアップ

まず、プロジェクトのリポジトリをクローンし、必要な依存関係をインストールします。

1.  **リポジトリのクローン**:
    ターミナルを開き、任意のディレクトリで以下のコマンドを実行します。

    ```bash
    git clone https://github.com/mashharuki/serverless_zk_nft_app.git
    ```

2.  **ディレクトリの移動**:
    クローンしたプロジェクトのディレクトリに移動します。

    ```bash
    cd serverless_zk_nft_app
    ```

3.  **依存関係のインストール**:
    `pnpm`を使って、プロジェクト全体の依存関係をインストールします。これには、`circuit`、`backend`、`frontend`の各コンポーネントのパッケージが含まれます。

    ```bash
    pnpm i
    ```

    このコマンドにより、`pnpm-lock.yaml`に基づいてすべてのパッケージがインストールされ、ワークスペース内のコンポーネントがリンクされます。

## 🔑 環境変数の設定

次に、プロジェクトで必要となる環境変数を設定します。`.env.example`ファイルを参考に、各コンポーネントのルートディレクトリに`.env`または`.env.local`ファイルを作成します。

### Backend (`pkgs/backend`)

`pkgs/backend`ディレクトリに`.env`ファイルを作成し、以下の内容を記述します。

```
PRIVATE_KEY="YOUR_PRIVATE_KEY"
ALCHMEY_API_KEY="YOUR_ALCHEMY_API_KEY"
BASESCAN_API_KEY="YOUR_BASESCAN_API_KEY"
```

- `PRIVATE_KEY`: スマートコントラクトをデプロイするウォレットの秘密鍵です。**テスト用のウォレットを使用してください。**
- `ALCHMEY_API_KEY`: [Alchemy](https://www.alchemy.com/)のAPIキーです。Base Sepoliaテストネットへの接続に使用します。
- `BASESCAN_API_KEY`: [Basescan](https://basescan.org/)のAPIキーです。コントラクトの自動検証に使用します。

### Frontend (`pkgs/frontend`)

`pkgs/frontend`ディレクトリに`.env.local`ファイルを作成し、以下の内容を記述します。

```
NEXT_PUBLIC_PRIVY_APP_ID="YOUR_PRIVY_APP_ID"
NEXT_PUBLIC_BICONOMY_BUNDLER_API_KEY="YOUR_BICONOMY_BUNDLER_API_KEY"
NEXT_PUBLIC_BICONOMY_PAYMASTER_API_KEY="YOUR_BICONOMY_PAYMASTER_API_KEY"
PASSWORD_HASH="YOUR_PASSWORD_HASH"
```

- `NEXT_PUBLIC_PRIVY_APP_ID`: [Privy](https://www.privy.io/)のApp IDです。ユーザー認証に使用します。
- `NEXT_PUBLIC_BICONOMY_BUNDLER_API_KEY` & `NEXT_PUBLIC_BICONOMY_PAYMASTER_API_KEY`: [Biconomy](https://www.biconomy.io/)のAPIキーです。ガスレス取引を実現するために使用します。
- `PASSWORD_HASH`: ZK証明を生成するためのパスワードのハッシュ値です。後のセクションで生成しますので、現時点では空でも構いません。

## ✅ セットアップの確認

以上で基本的な環境構築は完了です。次のセクションでは、各コンポーネントを個別にビルドし、アプリケーションを実際に動かしていきます。

## 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discordの`#zk`で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の3点を記載してください ✨

1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット
