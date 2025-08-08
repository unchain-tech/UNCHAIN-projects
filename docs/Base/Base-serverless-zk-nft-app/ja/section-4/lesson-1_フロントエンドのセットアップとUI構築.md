---
title: "🖥️ フロントエンドのセットアップとUI構築"
---

このセクションから、ユーザーが実際に操作する**フロントエンドアプリケーション**を構築していきます。 

バックエンドで準備したスマートコントラクトやゼロ知識証明の仕組みを、ユーザーが直感的に使えるように繋ぎこむ、非常に重要なパートです！

このプロジェクトのフロントエンドは、**Next.js** をベースに、**TypeScript**、**Tailwind CSS**、そしてUIコンポーネントライブラリの **shadcn/ui** を使用して、モダンで洗練されたUIを効率的に構築します。

最初のレッスンでは、フロントエンドプロジェクトの全体像を把握し、基本的なUIコンポーネントがどのように配置されているかを確認します。

## 📂 フロントエンドの構造

まず、`pkgs/frontend`ディレクトリの構造を見て、どこに何が書かれているかを理解しましょう。

```
pkgs/frontend
├── public/              # 画像などの静的アセット
├── src/
│   ├── app/             # Next.jsのApp Router。URLとコンポーネントのマッピングを管理
│   │   ├── layout.tsx   # 全ページ共通のレイアウト（ヘッダー、フッターなど）
│   │   └── page.tsx     # アプリケーションのメインページ（"/"）のUI
│   ├── components/      # 再利用可能なUIコンポーネント（ボタン、ダイアログなど）
│   └── lib/             # 補助的な関数や設定ファイル
├── package.json         # プロジェクトの依存関係と実行スクリプト
└── ...
```

- **`app/layout.tsx`**:   
  アプリケーション全体の「骨格」となるファイルです。  
  
  ヘッダー、フッター、フォント設定、そして後ほど追加する **web3関連のプロバイダー（Privy, Biconomyなど）** はここに配置され、すべてのページで共通して利用されます。

- **`app/page.tsx`**:   
  アプリケーションの「顔」となるメインページ（`https://.../`）のコンテンツを定義する中心的なファイルです。  
  
  ここにNFTのミントボタンやパスワード入力フィールドなどのUI要素を配置していきます。

- **`components/`**:   
  `shadcn/ui`を使って作成したボタンやダイアログなどのUI部品が格納されます。  

  一貫性のあるデザインを保ちながら、効率的に開発を進めるための重要なフォルダです。

## 🎨 UIコンポーネントの構築

このプロジェクトでは、`shadcn/ui`を利用して、モダンで美しいUIを効率的に構築します。

`shadcn/ui`は、単なるライブラリではなく、**コピー&ペーストでプロジェクトに直接追加できる、カスタマイズ性の高いコンポーネント集** です。

メインページである`src/app/page.tsx`を開いて、UIがどのように構築されているかを確認しましょう。

```tsx
// pkgs/frontend/src/app/page.tsx

"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function Home() {
  // ユーザーが入力したパスワードを保持するための状態変数
  const [password, setPassword] = useState<string>("");

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      {/* ... ヘッダー部分のコード ... */}

      <div className="relative z-[-1] flex place-items-center">
        <h1 className="text-5xl font-bold text-center">
          Serverless ZK NFT App
        </h1>
      </div>

      <div className="mb-32 mt-16 grid text-center lg:mb-0 lg:w-full lg:max-w-5xl lg:grid-cols-4 lg:text-left">
        <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30">
          <h2 className="mb-3 text-2xl font-semibold">
            Mint ZK NFT 🔑
          </h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">
            秘密のパスワードを入力して、特別なNFTをミントしよう！
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
      </div>
    </main>
  );
}
```

### 🔍 コード解説

- **`"use client"`**:   
  このディレクティブは、このファイルが**クライアントコンポーネント**であることをNext.jsに伝えます。
  
  ユーザーのブラウザ上で動作し、`useState`や`useEffect`といったReactのフック（インタラクティブな機能）を使用するために不可欠です。


- **`useState`**:   
  `password`という**状態変数**を定義しています。  
  
  これにより、ユーザーがインプットフィールドに入力した値をリアルタイムで保持し、UIに反映させることができます。

- **`<Input />`**:    
  `shadcn/ui`から提供されるインプットコンポーネントです。  

  `type="password"`とすることで、入力内容が隠されるようになっています。ユーザーが秘密のパスワードを入力するための重要なUIです。

- **`<Button />`**:   
  これも`shadcn/ui`のボタンコンポーネントです。  

  ユーザーがNFTのミントを開始するためのアクションの起点（トリガー）となります。

この時点では、UIは表示されるだけで、ボタンをクリックしてもまだ何も起こりません。

しかし、アプリケーションの骨格はすでに完成しています。

次のレッスンから、このUIに命を吹き込んでいきます。以下の機能を段階的に実装していきましょう。

1.  **ユーザー認証 👤**:   
  Privyを使って、ユーザーがEメールやソーシャルアカウントで簡単にログインし、ウォレットを扱えるようにします。

2.  **ZK証明の生成 🧠**:   
  ユーザーが入力したパスワードから、ユーザーのブラウザ上で（クライアントサイドで）ゼロ知識証明を生成します。

3.  **ガスレスミント ⛽️**:   
  Biconomyを使って、ユーザーがガス代を一切支払うことなくNFTをミントできる、魔法のような体験を実現します。

---
次のレッスンでは、最初のステップとして、Privyを導入してユーザー認証機能を実装します。

### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discordの`#zk`で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の3点を記載してください ✨

1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット
