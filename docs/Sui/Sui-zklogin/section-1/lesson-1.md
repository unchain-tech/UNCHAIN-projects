# 1.1 環境構築・セットアップ 🛠

このセクションでは、Sui zkLoginアプリの開発環境を構築します。

## 必要なツール
- Node.js（推奨:v23以上）
- Bun
- Git

## リポジトリのクローン

```bash
# リポジトリをクローン
git clone https://github.com/unchain-tech/sui-zklogin-app.git
cd sui-zklogin-app

# チェックアウト
git checkout main
bun install
```

## 環境変数の設定

`.env.example`をコピーして`.env.local`を作成し、必要な値を設定します。

```bash
cp .env.example .env.local
```


主な環境変数：

```txt
VITE_GOOGLE_CLIENT_ID=
VITE_SUI_NETWORK_NAME=devnet
VITE_SUI_FULLNODE_URL=https://fullnode.devnet.sui.io
VITE_SUI_DEVNET_FAUCET=https://faucet.devnet.sui.io
VITE_SUI_PROVER_DEV_ENDPOINT=https://prover-dev.mystenlabs.com/v1
VITE_REDIRECT_URI=http://localhost:5173/
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

## Supabaseのセットアップ

- [Supabase](https://supabase.com/)でアカウント作成

  ![](/images/Sui-zklogin/section-1/1_0.png)

- アカウント作成後はプロジェクトを作成しSQLエディターを開く

  ![](/images/Sui-zklogin/section-1/1_1.png)

  以下のSQLを実行して`profiles`テーブル作成する

  ```sql
  -- ユーザープロフィールを保存するテーブル
  CREATE TABLE profiles (
    -- ランダムに生成されたUUIDをキーとする
    id uuid PRIMARY KEY,
    -- Googleから取得するsub ID（重複を許可しない）
    sub text UNIQUE NOT NULL,
    name text,
    email text,
    user_salt text NOT NULL,
    max_epoch integer NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
  );

  -- インデックスの追加（subカラムでの検索性能向上のため）
  CREATE INDEX idx_profiles_sub ON profiles(sub);
  ```

  以下のSQLを実行してトリガー・関数も同時に設定する

  ```sql
  -- updated_atカラムの自動更新関数の作成
  CREATE OR REPLACE FUNCTION update_updated_at_column() 
  RETURNS TRIGGER AS $$
  BEGIN
      NEW.updated_at = now();
      RETURN NEW;
  END;
  $$ LANGUAGE plpgsql;

  -- updated_atカラムの自動更新トリガー
  CREATE TRIGGER update_profiles_updated_at
      BEFORE UPDATE ON profiles
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  ```

- 環境変数の取得

  - `VITE_SUPABASE_ANON_KEY`の取得

    `Project Settings`から`API Keys`ページに遷移して`Publishable key`の値をコピー&ペーストする

    ![](/images/Sui-zklogin/section-1/1_2.png)

  - `VITE_SUPABASE_URL`の取得

    `Project Settings`から`Data API`ページに遷移して`Project URL`の値をコピー&ペーストする

    ![](/images/Sui-zklogin/section-1/1_3.png)

## Google Cloudのセットアップ

- [Google Cloud](https://cloud.google.com)でアカウントを持っていない場合は新規作成すること。

  ![](/images/Sui-zklogin/section-1/1_4.jpg)

- [Google Cloud コンソール - APIとサービス 認証情報](https://console.cloud.google.com/apis/credentials)にアクセスする

  ![](/images/Sui-zklogin/section-1/1_5.png)

  OAuthクライアントの設定例

  - **認証情報を作成**をクリックし、クライアントIDを選択する
  - 以下の設定で新しい認証情報を作成する
    - アプリケーションの種類: ウェブアプリケーション
    - 名前： sui-zklogin
    - 承認済みのリダイレクトURI
      - http://localhost:5173/

    ![](/images/Sui-zklogin/section-1/1_6.png)

  - するとクライアントIDとクライアントシークレットが表示されるはずなのでクライアントIDを環境変数に設定する

    ```text
    VITE_GOOGLE_CLIENT_ID=
    ```

## NFTコントラクトのデプロイ

次にアプリで使用するNFTコントラクトをデプロイします！

ローカルで`SUI CLI`を使って開発することもできますが、今回はより簡単にデプロイできる[Chain IDE](https://chainide.com)を利用します！

[Chain IDE](https://chainide.com/s/sui/461d77b23e934de4bad422db11cf3d0d)でテンプレートから`Non Fousible Token`を選択します。

![](/images/Sui-zklogin/section-1/1_7.png)

すると以下のような画面になるはずです！

![](/images/Sui-zklogin/section-1/1_8.png)

ウォレット接続してコントラクトをデプロイしましょう！  

もしdevnet用のトークンを持っていない場合は[https://faucet.sui.io/?network=devnet](https://faucet.sui.io/?network=devnet)でトークンがもらえます！

![](/images/Sui-zklogin/section-1/1_9.png)

テンプレートなのでそのまま何もしなくてもデプロイできるはずです！

```bash
[info] [13:32:47] Package published to chain with digest:  AUDnuK4PyW1tnzPk1ySarQSNTz9p87vw7PYfQehEF2MR
[info] [13:32:47] https://suiscan.xyz/devnet/tx/AUDnuK4PyW1tnzPk1ySarQSNTz9p87vw7PYfQehEF2MR
[info] [13:32:47] Executed successfully
[info] [13:32:49] Uploaded file [deploy/0x1d...d876-published.json] successfully!
```

SuiScanの方を確認するとパッケージIDが表示されるはずなのでその値を`src/utils/constant.ts`に設定しましょう！

![](/images/Sui-zklogin/section-1/1_10.png)

```ts
// NFTのパッケージID(Chain IDEを使って事前にデプロイしておく！)
export const NFT_PACKAGE_ID = "<ここにデプロイしたコントラクトのパッケージIDを貼り付ける>";
```

ここまでで実装を始める前の事前準備が完了しました！

---

### 🙋‍♂️ 質問する

セットアップで困った場合はDiscord `#zk`で質問してください。
