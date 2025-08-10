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
├── public/              # 静的アセット
│   ├── logo.png         # アプリケーションロゴ
│   └── zk/              # ゼロ知識証明関連ファイル
│       ├── PasswordHash.wasm      # コンパイルされた回路
│       └── PasswordHash_final.zkey # 証明鍵
├── app/                 # Next.js App Router - URLルーティングとページの定義
│   ├── api/             # API Routes
│   │   ├── generateProof/    # ZK証明生成API
│   │   │   └── route.ts
│   │   └── hash-password/    # パスワードハッシュAPI
│   │       └── route.ts
│   ├── dashboard/       # ダッシュボードページ（"/dashboard"）
│   │   └── page.tsx     # ダッシュボードのメインコンポーネント
│   ├── layout.tsx       # アプリケーション全体のレイアウト
│   ├── page.tsx         # ルートページ（"/"）のコンポーネント
│   └── globals.css      # グローバルスタイルとTailwind CSSのインポート
├── components/          # 再利用可能なUIコンポーネント
│   ├── ui/              # shadcn/uiの基本コンポーネント
│   │   ├── button.tsx   # ボタンコンポーネント
│   │   ├── card.tsx     # カードコンポーネント
│   │   ├── input.tsx    # インプットコンポーネント
│   │   ├── label.tsx    # ラベルコンポーネント
│   │   └── loading.tsx  # ローディングコンポーネント
│   └── layout/          # レイアウト関連コンポーネント
│       └── header.tsx   # ヘッダーコンポーネント
├── providers/           # React Context Providers
│   ├── privy-providers.tsx    # Privyプロバイダー
│   └── toaster-provider.tsx   # トーストプロバイダー
├── hooks/               # カスタムReactフック
│   └── useBiconomy.ts   # Biconomyフック
├── lib/                 # ユーティリティ関数とライブラリ設定
│   ├── utils.ts         # 汎用ユーティリティ関数
│   ├── abi.ts           # スマートコントラクトABI
│   └── zk-utils.ts      # ゼロ知識証明関連のユーティリティ
├── types/               # TypeScript型定義ファイル
│   └── snarkjs.d.ts     # snarkjs型定義
├── components.json      # shadcn/ui設定ファイル
├── package.json         # プロジェクトの依存関係と実行スクリプト
├── next.config.js       # Next.js設定ファイル
├── postcss.config.js    # PostCSS設定
├── tailwind.config.js   # Tailwind CSS設定
├── tsconfig.json        # TypeScript設定
└── next-env.d.ts        # Next.js型定義
```

- **`app/layout.tsx`**:   
  アプリケーション全体の「骨格」となるファイルです。  
  
  全ページで共通するレイアウト、メタデータ、そして **web3関連のプロバイダー（Privy, Biconomyなど）** はここに配置され、すべてのページで利用されます。

- **`app/page.tsx`**:   
  アプリケーションのランディングページ（`/`）のコンテンツを定義します。  
  
  ユーザーがアプリケーションに初めてアクセスした際の認証とメイン機能への導線を提供します。

- **`app/dashboard/page.tsx`**:   
  認証後のメインダッシュボードページ（`/dashboard`）です。  
  
  ここにNFTのミントボタンやパスワード入力フィールドなどのUI要素を配置していきます。

- **`components/`**:   
  `shadcn/ui`を使って作成したボタンやカードなどのUI部品が格納されます。
  
  `ui/`フォルダには基本的なUIコンポーネント、`layout/`フォルダにはヘッダーなどのレイアウトコンポーネントを配置します。

- **`providers/`**:   
  React Context Providersを配置するフォルダです。
  
  Privyによる認証プロバイダーや、トースト通知のプロバイダーなどを管理します。

- **`hooks/`**:   
  カスタムReactフックを配置するフォルダです。
  
  Biconomyとの連携など、複雑なロジックを再利用可能な形でカプセル化します。

## 🎨 UIコンポーネントの構築

このプロジェクトでは、`shadcn/ui`を利用して、モダンで美しいUIを効率的に構築します。

`shadcn/ui`は、単なるライブラリではなく、**コピー&ペーストでプロジェクトに直接追加できる、カスタマイズ性の高いコンポーネント集** です。

メインページである`app/page.tsx`を開いて、ランディングページがどのように構築されているかを確認しましょう。

```tsx
// pkgs/frontend/app/page.tsx

"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* メインのランディングカード */}
        <Card className="glass-effect border-white/20 shadow-2xl">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <div className="text-3xl font-bold text-white">ZK</div>
            </div>
            <CardTitle className="text-2xl font-bold text-white">
              Welcome to ZK NFT App
            </CardTitle>
            <CardDescription className="text-gray-300">
              秘密のパスワードでゼロ知識証明を生成し、特別なNFTをミントしよう！
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* 次のレッスンで認証機能を追加します */}
            <Button
              className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-300"
              size="lg"
              disabled
            >
              Coming Soon: Connect Wallet & Login
            </Button>

            {/* 機能説明 */}
            <div className="text-center space-y-3">
              <div className="text-sm text-gray-400">
                次のレッスンで実装予定:
              </div>
              <div className="flex justify-center space-x-4 text-xs text-gray-500">
                <span>• Email認証</span>
                <span>• ウォレット連携</span>
                <span>• ZK証明生成</span>
              </div>
            </div>

            {/* セキュリティ情報 */}
            <div className="bg-blue-900/30 rounded-lg p-4 border border-blue-500/30">
              <div className="text-sm text-blue-200">
                <div className="font-semibold mb-1">🔒 Secure & Private</div>
                <div className="text-xs">
                  Powered by Zero-Knowledge Technology
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
```

次に、認証後のメイン機能を提供する`app/dashboard/page.tsx`を確認しましょう。

```tsx
// pkgs/frontend/app/dashboard/page.tsx

"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePrivy } from "@privy-io/react-auth";
import { useState } from "react";

export default function Dashboard() {
  const { user, logout } = usePrivy();
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const handleMint = async () => {
    if (!password) return;
    
    setIsLoading(true);
    try {
      // ZK証明生成とNFTミントのロジックは後のレッスンで実装
      console.log("Minting NFT with password:", password);
    } catch (error) {
      console.error("Mint failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="w-full max-w-md">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <Button variant="outline" onClick={logout}>
            Logout
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Mint ZK NFT 🔑</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              秘密のパスワードを入力して、特別なNFTをミントしよう！
            </p>
            <div className="flex w-full items-center space-x-2">
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
              <Button 
                onClick={handleMint}
                disabled={!password || isLoading}
              >
                {isLoading ? "Minting..." : "Mint"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
```

### 🔍 コード解説

#### ランディングページ（`app/page.tsx`）

- **`usePrivy`**:   
  Privyが提供するReactフックで、認証状態や認証関連の関数にアクセスできます。
  
- **`useRouter`**:   
  Next.js App Routerのナビゲーション機能を提供し、プログラムでページ遷移を制御できます。

- **認証ガード**:   
  `useEffect`を使って、認証済みユーザーを自動的にダッシュボードにリダイレクトする実装です。

#### ダッシュボードページ（`app/dashboard/page.tsx`）

- **`"use client"`**:   
  このディレクティブは、このファイルが**クライアントコンポーネント**であることをNext.jsに伝えます。
  
  ユーザーのブラウザ上で動作し、`useState`や`useEffect`といったReactのフック（インタラクティブな機能）を使用するために不可欠です。

- **`useState`**:   
  `password`と`isLoading`という**状態変数**を定義しています。  
  
  これにより、ユーザーがインプットフィールドに入力した値とローディング状態をリアルタイムで保持し、UIに反映させることができます。

- **`<Card />`コンポーネント**:    
  `shadcn/ui`から提供されるカードコンポーネントで、関連するUIを美しくグループ化します。

- **`<Input />`**:    
  `shadcn/ui`から提供されるインプットコンポーネントです。  

  `type="password"`とすることで、入力内容が隠されるようになっています。ユーザーが秘密のパスワードを入力するための重要なUIです。

- **`<Button />`**:   
  これも`shadcn/ui`のボタンコンポーネントです。  

  `disabled`プロパティを使って、適切な条件でのみボタンが押せるようになっています。

この時点では、UIは表示されるだけで、ボタンをクリックしてもまだ何も起こりません。

しかし、アプリケーションの骨格はすでに完成しています。

### 🔧 プロバイダー設定の重要性

実際のアプリケーションでは、`app/layout.tsx`で以下のプロバイダーが設定されている必要があります：

```tsx
// pkgs/frontend/app/layout.tsx (概要)

import { PrivyClientProvider } from '@/providers/privy-providers';
import { ToasterProvider } from '@/providers/toaster-provider';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>
        <PrivyClientProvider>
          <ToasterProvider>
            {children}
          </ToasterProvider>
        </PrivyClientProvider>
      </body>
    </html>
  );
}
```

これらのプロバイダーにより、アプリケーション全体でweb3認証、トースト通知、ガスレス取引の機能が利用可能になります。

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
