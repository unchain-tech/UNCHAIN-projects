---
title: "🧠 ZK証明生成APIの実装"
---

このレッスンでは、ユーザーが入力したパスワードを基に、**サーバーサイド（APIルート）**でゼロ知識証明を生成する機能を実装します。

`snarkjs`をサーバーサイドで利用し、バックエンドでコンパイルした回路（`.wasm`）と証明鍵（`.zkey`）を使って、効率的に証明を計算します。

## 🛠 準備: 回路ファイルの配置

まず、`section-2`で生成した、証明の生成に不可欠な2つのファイル（`circuit.wasm`と`circuit.zkey`）を、フロントエンドからアクセスできる`public`ディレクトリに配置する必要があります。

`pkgs/frontend/public`ディレクトリ内に、`zk`という名前のサブディレクトリを作成します。

```bash
mkdir -p pkgs/frontend/public/zk
```

次に、`circuit`パッケージの`build`ディレクトリから、生成されたファイルをコピーします。

```bash
cp pkgs/circuit/zkey/PasswordHash.wasm pkgs/frontend/public/zk/PasswordHash.wasm
cp pkgs/circuit/zkey/PasswordHash_final.zkey pkgs/frontend/public/zk/PasswordHash_final.zkey
```

`public`ディレクトリに置かれたファイルは、Webサーバーのルートパスとして扱われます。

これにより、フロントエンドのコードから`/zk/PasswordHash.wasm`や`/zk/PasswordHash_final.zkey`といったURLでこれらのファイルに直接アクセスできるようになります。

## 🧠 ZK証明生成APIの実装

ゼロ知識証明の生成は計算量が多いため、**APIルート**として実装し、サーバーサイドで処理するのが効率的です。

`app/api/generateProof/route.ts`を作成し、以下のコードを記述します：

```typescript
// pkgs/frontend/app/api/generateProof/route.ts
import { NextRequest, NextResponse } from "next/server";
import { buildPoseidon } from "circomlibjs";

const snarkjs = require("snarkjs");

// スマートコントラクトの関数に渡すためのデータ構造を定義
export interface Calldata {
  pA: string[];
  pB: string[][];
  pC: string[];
  pubSignals: string[];
}

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();

    if (!password) {
      return NextResponse.json(
        { error: "Password is required" },
        { status: 400 }
      );
    }

    // --- ステップ1: パスワードから回路への入力データを準備 ---
    const poseidon = await buildPoseidon();
    // パスワードを16進数に変換し、BigIntとして扱う
    const passwordNumber = BigInt(
      Buffer.from(password).toString("hex"),
      16
    ).toString();
    // パスワードのハッシュ値を計算
    const hash = poseidon.F.toString(poseidon([passwordNumber]));

    const inputs = {
      password: passwordNumber,
      hash: hash,
    };

    // --- ステップ2: ZK証明（Proof）と公開シグナル（Public Signals）を生成 ---
    // publicディレクトリに配置した.wasmと.zkeyファイルを使用
    const { proof, publicSignals } = await snarkjs.groth16.fullProve(
      inputs,
      "/zk/PasswordHash.wasm",
      "/zk/PasswordHash_final.zkey"
    );

    // --- ステップ3: スマートコントラクトに渡せる形式にデータを整形 ---
    // Groth16証明データを直接使用して、スマートコントラクト用の形式に変換
    const calldata: Calldata = {
      pA: [proof.pi_a[0], proof.pi_a[1]],
      pB: [
        [proof.pi_b[0][1], proof.pi_b[0][0]], // Groth16のpB形式は転置が必要
        [proof.pi_b[1][1], proof.pi_b[1][0]],
      ],
      pC: [proof.pi_c[0], proof.pi_c[1]],
      pubSignals: publicSignals,
    };

    return NextResponse.json({ calldata });
  } catch (error) {
    console.error("Proof generation failed:", error);
    return NextResponse.json(
      { error: "Failed to generate proof" },
      { status: 500 }
    );
  }
}
```

### 🔍 コード解説

- **APIルートパターン**:   
  Next.js 13+のApp Routerでは、`app/api/`ディレクトリ内に`route.ts`ファイルを配置することでAPIエンドポイントを作成できます。

- **`Calldata`インタフェース**:   
  スマートコントラクトの`safeMint`関数が期待する引数の型に合わせて、証明データを整形するためのデータ構造を定義します。

- **証明生成プロセス**:  

    1. **入力データの準備**:   
      ユーザーが入力した`password`文字列を、回路が理解できる数値（`passwordNumber`）に変換し、そのハッシュ値（`hash`）を計算します。

    2. **証明の生成**:   
      `snarkjs.groth16.fullProve`を呼び出します。これが魔法の核心部分です。
      
      回路の入力（`inputs`）、コンパイルされた回路（`.wasm`）、そして証明鍵（`.zkey`）を渡すことで、 **`proof`** と **`publicSignals`** を生成します。

    3. **データ整形**:   
      生成された`proof`と`publicSignals`を直接使用して、スマートコントラクトの`safeMint`関数が期待する形式に変換します。
      
      Groth16証明の`pi_b`要素は、Solidityコントラクトでの使用時に転置（transpose）が必要なため、配列の順序を調整しています。

- **エラーハンドリング**:   
  証明生成に失敗した場合は、適切なエラーレスポンスを返します。

## 📜 snarkjsの依存関係設定

サーバーサイドで`snarkjs`を使用するため、`package.json`にライブラリを追加します。

```bash
cd pkgs/frontend
pnpm install snarkjs circomlibjs
```

## � ZKユーティリティライブラリの実装

ゼロ知識証明に関連する共通機能をライブラリとして実装します。

`lib/zk-utils.ts`を作成し、以下のコードを記述します：

```typescript
// pkgs/frontend/lib/zk-utils.ts
import { buildPoseidon } from "circomlibjs";

/**
 * パスワードをハッシュ化する関数
 * @param password ユーザーが入力したパスワード
 * @returns ハッシュ化されたパスワード情報
 */
export async function hashPassword(password: string): Promise<{
  success: boolean;
  data?: {
    passwordNumber: string;
    hashedPassword: string;
  };
  error?: string;
}> {
  try {
    // Poseidonハッシュ関数を構築
    const poseidon = await buildPoseidon();

    // パスワードを数値に変換（文字コードの配列に変換してから結合）
    const passwordBytes = new TextEncoder().encode(password);
    const passwordNumber = BigInt(
      "0x" + Array.from(passwordBytes)
        .map(b => b.toString(16).padStart(2, "0"))
        .join("")
    );

    // Poseidonハッシュを計算
    const hashedPassword = poseidon([passwordNumber]);

    return {
      success: true,
      data: {
        passwordNumber: passwordNumber.toString(),
        hashedPassword: poseidon.F.toString(hashedPassword),
      },
    };
  } catch (error) {
    console.error("Error hashing password:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * ZK証明を生成する関数
 * @param passwordNumber ハッシュ化されたパスワード番号
 * @returns 生成された証明データ
 */
export async function generateProof(passwordNumber: string): Promise<{
  success: boolean;
  data?: {
    proof: any;
    publicSignals: any;
  };
  error?: string;
}> {
  try {
    // @ts-expect-error snarkjs types are not fully compatible
    const snarkjs = await import("snarkjs");

    // 証明の入力データを準備
    const input = {
      password: passwordNumber,
    };

    console.log("Generating proof with input:", input);

    // ZK証明を生成
    const { proof, publicSignals } = await snarkjs.groth16.fullProve(
      input,
      "/zk/PasswordHash.wasm",
      "/zk/PasswordHash_final.zkey"
    );

    console.log("Proof generated successfully:", { proof, publicSignals });

    return {
      success: true,
      data: {
        proof,
        publicSignals,
      },
    };
  } catch (error) {
    console.error("Error generating proof:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
```

### 🔍 コード解説

#### `hashPassword`関数

- **Poseidonハッシュ**: ZK回路で使用される効率的なハッシュ関数
- **文字列変換**: パスワード文字列を適切な数値形式に変換
- **エラーハンドリング**: 失敗時の適切なエラー処理

#### `generateProof`関数

- **回路ファイル読み込み**: publicフォルダからWASMファイルと証明鍵を読み込み
- **証明生成**: snarkjsを使用してGroth16証明を生成
- **型安全性**: TypeScriptの型エラーを適切に処理

## �🔗 フロントエンドとの連携

ダッシュボードページで証明生成APIを呼び出すように実装します。

**重要**: この実装では、`snarkjs.groth16.fullProve`で生成される`proof`と`publicSignals`オブジェクトを直接使用してスマートコントラクト互換の形式に変換しています。これにより、回路で生成されるデータ形式と完全に一致します。

`app/dashboard/page.tsx`を以下のように修正します：

```tsx
// pkgs/frontend/app/dashboard/page.tsx
"use client";

import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { Header } from "../../components/layout/header";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { LoadingSpinner } from "../../components/ui/loading";
import { generateProof, hashPassword } from "./../../lib/zk-utils";

// 動的レンダリングを強制してプリレンダリングエラーを回避
export const dynamic = "force-dynamic";

/**
 * ダッシュボード（NFTミント画面）コンポーネント
 */
export default function DashboardPage() {
  const router = useRouter();
  const { ready, authenticated } = usePrivy();

  // 未認証の場合はログイン画面にリダイレクト
  useEffect(() => {
    if (ready && !authenticated) {
      router.push("/");
    }
  }, [ready, authenticated, router]);

  // Privyが初期化中の場合はローディング表示
  if (!ready) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // 未認証の場合は何も表示しない（リダイレクト中）
  if (!authenticated) {
    return null;
  }

  // 認証済みの場合にのみダッシュボードコンテンツを表示
  return <AuthenticatedDashboard />;
}

/**
 * 認証済みユーザー向けのダッシュボードコンテンツ
 */
function AuthenticatedDashboard() {
  // NFTミント用のstate
  const [password, setPassword] = useState("");
  const [isMinting, setIsMinting] = useState(false);
  const [mintedTokens, setMintedTokens] = useState<
    Array<{
      tokenId: string;
      tokenURI: string;
      transactionHash: string;
    }>
  >([]);

  /**
   * NFTをミントするハンドラーメソッド（基本版）
   * 次のレッスンでBiconomyとの統合を実装します
   */
  const handleMintNFT = async () => {
    if (!password.trim()) {
      toast.error("パスワードを入力してください");
      return;
    }

    setIsMinting(true);

    try {
      toast.loading("ZK Proofを生成中...", { id: "minting" });

      // パスワードからinputデータを生成
      const result = await hashPassword(password);
      const passwordNumber = result.data?.passwordNumber;
      
      if (!passwordNumber) {
        throw new Error("Failed to hash password");
      }

      // ZK Proofを生成
      // @ts-expect-error this is a workaround for the type error
      const proofResult = await generateProof(passwordNumber);

      if (!proofResult.success || !proofResult.data) {
        throw new Error(proofResult.error || "failed to generate proof");
      }

      console.log("Proof generated successfully:", proofResult.data);
      
      // 次のレッスンでBiconomyを使ったミント処理を実装
      toast.success("ZK証明の生成が完了しました！次のレッスンでNFTミントを実装します", { id: "minting" });
      setPassword("");
    } catch (error) {
      console.error("Proof generation error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      toast.error(`エラーが発生しました: ${errorMessage}`, { id: "minting" });
    } finally {
      setIsMinting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* ユーザー情報セクション */}
          <Card className="glass-effect border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Welcome back!</CardTitle>
            </CardHeader>
          </Card>

          {/* NFTミントセクション */}
          <Card className="glass-effect border-white/20">
            <CardHeader>
              <CardTitle className="text-white">🎨 Mint ZKNFT</CardTitle>
              <CardDescription className="text-gray-300">
                Create a new NFT protected by zero-knowledge proof
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* パスワード入力 */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">
                  Secret Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your secret password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="glass-input"
                  disabled={isMinting}
                />
                <p className="text-xs text-gray-400">
                  This password will be used to generate a zero-knowledge proof
                </p>
              </div>

              {/* ミントボタン */}
              <Button
                onClick={handleMintNFT}
                disabled={isMinting || !password.trim()}
                className="w-full h-12 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold rounded-lg neon-glow transition-all duration-300"
                size="lg"
              >
                {isMinting ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Generating Proof...
                  </>
                ) : (
                  "Generate ZK Proof"
                )}
              </Button>
            </CardContent>
          </Card>

          {/* 注意事項 */}
          <Card className="glass-effect border-white/20">
            <CardContent className="p-4">
              <div className="text-sm text-gray-300">
                <div className="font-semibold mb-2">📝 次のレッスンで実装予定</div>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>Biconomyによるガスレストランザクション</li>
                  <li>NFTの実際のミント処理</li>
                  <li>ミント済みNFTの一覧表示</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
```

### 🔍 コード解説

- **`lib/zk-utils`からの直接インポート**:   
  サーバーサイドAPIの代わりに、ライブラリ関数を直接使用してクライアントサイドでZK証明を生成します。

- **認証ガードとリダイレクト**:   
  未認証ユーザーを自動的にログインページへリダイレクトし、認証済みユーザーのみダッシュボードを表示します。

- **コンポーネント分離**:   
  `AuthenticatedDashboard`という別コンポーネントに分離して、認証状態の管理を明確化しています。

- **LoadingSpinnerの活用**:   
  処理中の視覚的フィードバックとして、カスタムLoadingSpinnerコンポーネントを使用しています。

- **Headerコンポーネント**:   
  ユーザー情報の表示とログアウト機能を提供する専用ヘッダーコンポーネントを統合しています。

- **エラーハンドリング**:   
  react-hot-toastを使用して、ユーザーフレンドリーなエラー通知を表示します。

---

お疲れ様でした！ これで、クライアントサイドでゼロ知識証明を生成する仕組みが完成しました。

アプリケーションを起動し、任意のパスワードを入力して「Generate ZK Proof」ボタンをクリックしてみてください。  

ブラウザのコンソールに、生成された証明データが表示されるはずです。

次のレッスンでは、この生成された証明データを **Biconomy** に渡し、ユーザーにガス代を負担させることなくNFTをミントする、最終ステップに進みます。

---

### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discordの`#zk`で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の3点を記載してください ✨

1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット
