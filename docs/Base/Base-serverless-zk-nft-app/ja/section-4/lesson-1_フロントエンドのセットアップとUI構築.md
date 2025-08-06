---
title: "フロントエンドのセットアップとUI構築"
---

このセクションから、ユーザーが実際に操作するフロントエンドアプリケーションを構築していきます。このプロジェクトのフロントエンドは、**Next.js** をベースに、**TypeScript**、**Tailwind CSS**、そしてUIコンポーネントライブラリの **shadcn/ui** を使用して構築されています。

最初のレッスンでは、フロントエンドプロジェクトの全体像を把握し、基本的なUIをセットアップします。

## 📂 フロントエンドの構造

まず、`pkgs/frontend`ディレクトリの構造を見てみましょう。

```
pkgs/frontend
├── public/              # 画像などの静的ファイル
├── src/
│   ├── app/             # Next.jsのApp Router
│   │   ├── layout.tsx   # 全ページ共通のレイアウト
│   │   └── page.tsx     # メインページのUI
│   ├── components/      # 再利用可能なUIコンポーネント
│   └── lib/             # 補助的な関数や設定
├── package.json         # 依存関係とスクリプト
└── ...
```

- **`app/layout.tsx`**: アプリケーション全体のレイアウトを定義します。ヘッダー、フッター、フォント設定、そして後ほど追加する各種プロバイダー（Privy, Biconomyなど）はここに配置されます。
- **`app/page.tsx`**: アプリケーションのメインページ（`/`）のコンテンツを定義する中心的なファイルです。ここにNFTのミントボタンやUI要素を配置します。
- **`components/`**: `shadcn/ui`を使って作成したボタンやダイアログなどのUIコンポーネントが格納されます。

## 🎨 UIコンポーネントの構築

このプロジェクトでは、`shadcn/ui`を利用して、モダンで美しいUIを効率的に構築します。`shadcn/ui`は、コピー&ペーストでプロジェクトに追加できる、再利用可能でアクセシブルなコンポーネント集です。

メインページである`src/app/page.tsx`を見て、UIがどのように構築されているかを確認しましょう。

```tsx
// pkgs/frontend/src/app/page.tsx

"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function Home() {
  const [password, setPassword] = useState<string>("");

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          Get started by editing&nbsp;
          <code className="font-mono font-bold">src/app/page.tsx</code>
        </p>
        {/* ログインボタンやユーザー情報をここに表示 */}
      </div>

      <div className="relative z-[-1] flex place-items-center">
        <h1 className="text-5xl font-bold text-center">
          Serverless ZK NFT App
        </h1>
      </div>

      <div className="mb-32 mt-16 grid text-center lg:mb-0 lg:w-full lg:max-w-5xl lg:grid-cols-4 lg:text-left">
        <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30">
          <h2 className="mb-3 text-2xl font-semibold">
            Mint ZK NFT
          </h2>
          <div className="flex w-full max-w-sm items-center space-x-2">
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit">Mint</Button>
          </div>
        </div>
      </div>
    </main>
  );
}
```

### コード解説

- **`"use client"`**: このファイルがクライアントコンポーネントであることを示します。`useState`などのReactフックを使用するために必要です。
- **`useState`**: `password`という状態変数を定義し、ユーザーがインプットフィールドに入力した値を保持します。
- **`<Input />`**: `shadcn/ui`のインプットコンポーネントです。ユーザーが秘密のパスワードを入力するために使用します。
- **`<Button />`**: `shadcn/ui`のボタンコンポーネントです。ユーザーがNFTのミントを開始するためのトリガーとなります。

この時点では、UIは表示されるだけで、ボタンをクリックしても何も起こりません。
次のレッスンから、以下の機能を段階的に実装していきます。

1.  **ユーザー認証**: Privyを使って、ユーザーがウォレットでログインできるようにします。
2.  **ZK証明の生成**: ユーザーが入力したパスワードから、クライアントサイドでZK証明を生成します。
3.  **ガスレスミント**: Biconomyを使って、ユーザーがガス代を支払うことなくNFTをミントできるようにします。

---

次のレッスンでは、最初のステップとして、Privyを導入してユーザー認証機能を実装します。

### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discordの`#zk`で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の3点を記載してください ✨

1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット
