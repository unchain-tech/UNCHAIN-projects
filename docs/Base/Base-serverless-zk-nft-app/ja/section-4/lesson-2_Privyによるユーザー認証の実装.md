---
title: "👤 Privyによるユーザー認証の実装"
---

このレッスンでは、**Privy** を導入して、ユーザーがEメールやソーシャルアカウントで簡単にログインできるようにし、各ユーザーに専用のウォレット（**Embedded Wallet**）を自動的に提供する機能を実装します！

これにより、web3に馴染みのないユーザーでも、まるで普段使っているWebサービスのように、シームレスに私たちのdAppを利用開始できるようになります！

## 🔑 Privyとは？

[Privy](https://www.privy.io/)は、web3アプリケーションの **オンボーディング（新規ユーザー登録・利用開始プロセス）** を劇的に簡単にするための強力なツールキットです。主な機能は以下の通りです。

- **柔軟な認証方法**:   
  Eメール、SMS、Google、X（旧Twitter）などの**ソーシャルログイン**を提供し、ユーザーが好きな方法で認証できるようにします。

- **Embedded Wallets**:   
  ユーザーがログインすると、バックグラウンドで自動的に**スマートコントラクトウォレット**が作成・管理されます。  
  
  ユーザーは**秘密鍵やシードフレーズを意識する必要が一切ありません**。  
  
  これがweb3のマスアダプション（大衆化）への鍵となります。

- **外部ウォレット連携**:   
  もちろん、MetaMaskやPhantomなど、ユーザーがすでに持っている既存のウォレットを接続することもサポートしています。

このプロジェクトでは、Privyを使ってユーザー認証とウォレット管理を驚くほどシンプルに実装します。

## 🛠 Privyのセットアップ

まず、フロントエンドプロジェクトでPrivyを利用するためのパッケージをインストールします。

```bash
cd pkgs/frontend
pnpm install @privy-io/react-auth @privy-io/export-wallets
```

次に、Privyの管理画面であなたのアプリケーションを登録し、**App ID** を取得する必要があります。

1.  [Privyの公式サイト](https://www.privy.io/)にアクセスし、サインアップまたはログインします。
2.  ダッシュボードで新しいアプリケーションを作成します。
3.  作成したアプリケーションのページで、`APP ID`と書かれた文字列をコピーします。

取得した`App ID`を、`pkgs/frontend/.env.local`ファイルに保存します。

```
NEXT_PUBLIC_PRIVY_APP_ID="YOUR_PRIVY_APP_ID"
```
※ `YOUR_PRIVY_APP_ID`の部分は、実際に取得したご自身のIDに置き換えてください。

## 🔌 PrivyProviderの組み込み

Privyの機能をアプリケーション全体で利用できるようにするため、ルートコンポーネントを`PrivyProvider`でラップします。

この設定はクライアントサイドでのみ有効にする必要があるため、専用のプロバイダーコンポーネントを作成するのがベストプラクティスです。

`pkgs/frontend/app/providers/privy-providers.tsx";`というファイルを作成し、以下のコードを記述します。

```tsx
// pkgs/frontend/app/providers/privy-providers.tsx";
"use client";

import { PrivyProvider } from "@privy-io/react-auth";
import type React from "react";

interface PrivyProvidersProps {
  children: React.ReactNode;
}

/**
 * Privyプロバイダーのラッパーコンポーネント
 */
export const PrivyProviders: React.FC<PrivyProvidersProps> = ({ children }) => {
  // 環境変数からPrivy設定を取得
  const privyAppId = process.env.NEXT_PUBLIC_PRIVY_APP_ID || "test-app-id";

  return (
    <PrivyProvider
      appId={privyAppId}
      config={{
        // ログイン方法の設定
        loginMethods: ["email", "wallet", "google"],
        // 外観の設定
        appearance: {
          theme: "dark",
          accentColor: "#3B82F6",
        },
        // エンベデッドウォレットの設定
        embeddedWallets: {
          createOnLogin: "users-without-wallets",
        },
      }}
    >
      {children}
    </PrivyProvider>
  );
};
```

## React Hot Toastの組み込み

ここでもう一つアプリ全体で Toasterを使えるようにするためのProviderコンポーネントを追加します。

`pkgs/frontend/app/providers/toaster-provider.tsx";`というファイルを作成し、以下のコードを記述します。

```ts
import type React from "react";
import { Toaster } from "react-hot-toast";

interface ToasterProviderProps {
  children: React.ReactNode;
}

/**
 * React Hot Toastの設定コンポーネント
 * @param children 子要素
 */
export const ToasterProvider: React.FC<ToasterProviderProps> = ({
  children,
}) => {
  return (
    <>
      {children}
      <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={8}
        containerClassName=""
        containerStyle={{}}
        toastOptions={{
          // デフォルトの設定
          className: "",
          duration: 4000,
          style: {
            background: "#363636",
            color: "#fff",
            borderRadius: "8px",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            boxShadow:
              "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
          },

          // 成功時の設定
          success: {
            duration: 3000,
            style: {
              background: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
              color: "#fff",
            },
            iconTheme: {
              primary: "#fff",
              secondary: "#10B981",
            },
          },

          // エラー時の設定
          error: {
            duration: 5000,
            style: {
              background: "linear-gradient(135deg, #EF4444 0%, #DC2626 100%)",
              color: "#fff",
            },
            iconTheme: {
              primary: "#fff",
              secondary: "#EF4444",
            },
          },

          // 読み込み中の設定
          loading: {
            duration: Number.POSITIVE_INFINITY,
            style: {
              background: "linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)",
              color: "#fff",
            },
            iconTheme: {
              primary: "#fff",
              secondary: "#3B82F6",
            },
          },
        }}
      />
    </>
  );
};
```

### 🔍 コード解説

- `PrivyProvider`:   
  このコンポーネントでアプリケーション全体をラップすることで、どのコンポーネントからでも`usePrivy`という便利なフックを使って、ユーザーの認証情報やウォレットの状態にアクセスできるようになります。

- `appId`:   
  環境変数ファイル（`.env.local`）から先ほど設定したApp IDを安全に読み込みます。`!`は、この値が必ず存在することをTypeScriptに伝えています。

- `config`:   
  ログインモーダルの詳細設定です。

    - `loginMethods`:   
      ユーザーに提示するログイン方法を配列で指定します。  
      ここではEメールと外部ウォレットでのログインを許可しています。

    - `embeddedWallets`:   
      ウォレットを持っていないユーザー（例：Eメールでログインしたユーザー）には、ログイン時に自動でEmbedded Walletを作成するように設定しています。

## 🌐 アプリケーションへの適用

作成した`Providers`コンポーネントを、アプリケーションのルートレイアウトに適用します。

これにより、すべてのページでPrivyの機能が有効になります。

`pkgs/frontend/app/layout.tsx`を以下のように修正してください。

```tsx
// pkgs/frontend/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { PrivyProviders } from "./../providers/privy-providers";   // 👈 インポート
import { ToasterProvider } from "./../providers/toaster-provider"; // 👈 インポート

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Serverless ZK NFT App",
  description: "Mint a ZK NFT with a secret password.",
};

/**
 * RootLayout コンポーネント
 * @param param0
 * @returns
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <PrivyProviders>
          <ToasterProvider>{children}</ToasterProvider>
        </PrivyProviders>
      </body>
    </html>
  );
}
```

## 👤 ログインボタンとユーザー情報の表示

最後に、`page.tsx`を更新して、実際にログイン・ログアウトボタンとユーザー情報を表示するUIを追加します。

`pkgs/frontend/app/page.tsx`を以下のように修正します。

```tsx
// pkgs/frontend/app/page.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePrivy } from "@privy-io/react-auth"; // 👈 インポート
import { useState } from "react";

export default function Home() {
  const [password, setPassword] = useState<string>("");
  // Privyフックを使って認証情報を取得
  const {
    ready,
    authenticated,
    user,
    login,
    logout,
  } = usePrivy();

  // Privyが初期化されるまでローディング表示
  if (!ready) {
    return <p>Loading...</p>;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          UNCHAIN Serverless ZK NFT
        </p>
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:size-auto lg:bg-none">
          {/* 認証状態でボタンを切り替え */}
          {authenticated ? (
            <Button onClick={logout}>Logout</Button>
          ) : (
            <Button onClick={login}>Login</Button>
          )}
        </div>
      </div>

      {/* ... 中央のタイトル部分 ... */}

      <div className="mb-32 mt-16 grid text-center lg:mb-0 lg:w-full lg:max-w-5xl lg:grid-cols-4 lg:text-left">
        {/* ログインしている場合のみミントUIを表示 */}
        {authenticated && user && (
          <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30">
            <h2 className="mb-3 text-2xl font-semibold">
              Mint ZK NFT 🔑
            </h2>
            <p className="m-0 max-w-[30ch] text-sm opacity-50">
              Your wallet: {user.wallet?.address}
            </p>
            <div className="flex w-full max-w-sm items-center space-x-2 mt-4">
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button type="submit">Mint</Button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
```

### 🔍 コード解説

- `usePrivy()`:   

  Privyの魔法のフックです。
  
  これ1つで、`login`関数、`logout`関数、ユーザーの認証状態（`authenticated`）、ユーザー情報（`user`）などを簡単に取得できます。

- `if (!ready)`:   
  `usePrivy`がユーザー情報を読み込んでいる間は`ready`が`false`になるため、その間はローディング表示を出すことで、UIのチラつきを防ぎます。

- `authenticated ? <Button onClick={logout}>Logout</Button> : <Button onClick={login}>Login</Button>`:   
  **条件レンダリング**を使い、ユーザーがログインしているかどうかに応じて、表示するボタンを動的に切り替えています。

- `{authenticated && user && ...}`:   
  ユーザーがログインしている場合にのみ、NFTのミントセクションを表示するようにしています。  
  `user.wallet?.address`で、Privyが管理しているユーザーのウォレットアドレスを表示できます。

---

お疲れ様でした！ これで、あなたのdAppに最新のweb3ログイン機能が実装されました。

アプリケーションを起動して、実際にログイン・ログアウトを試してみてください。Eメールでログインすると、自動的にウォレットアドレスが表示されるはずです。

```bash
pnpm frontend run dev
```

次のレッスンでは、いよいよこのフロントエンドで **ゼロ知識証明を生成する** ロジックを実装していきます。


### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discordの`#zk`で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の3点を記載してください ✨

1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット
