---
title: "🧠 クライアントサイドでのZK証明生成"
---

このレッスンでは、ユーザーが入力したパスワードを基に、ユーザーの**ブラウザ上（クライアントサイド）**でゼロ知識証明を生成する機能を実装します。

`snarkjs`をフロントエンドで直接利用し、バックエンドでコンパイルした回路（`.wasm`）と証明鍵（`.zkey`）を使って、プライバシーを守りながら証明を計算します。

## 🛠 準備: 回路ファイルの配置

まず、`section-2`で生成した、証明の生成に不可欠な2つのファイル（`circuit.wasm`と`circuit.zkey`）を、フロントエンドからアクセスできる`public`ディレクトリに配置する必要があります。

`pkgs/frontend/public`ディレクトリ内に、`zk`という名前のサブディレクトリを作成します。

```bash
mkdir -p pkgs/frontend/public/zk
```

次に、`circuit`パッケージの`build`ディレクトリから、生成されたファイルをコピーします。

```bash
cp pkgs/circuit/zkey/PasswordHash_final.wasm pkgs/frontend/public/zk/
cp pkgs/circuit/zkey/PasswordHash.zkey pkgs/frontend/public/zk/
```

`public`ディレクトリに置かれたファイルは、Webサーバーのルートパスとして扱われます。

これにより、フロントエンドのコードから`/zkey/PasswordHash_final.wasm`や`/zkey/PasswordHash.zkey`といったURLでこれらのファイルに直接アクセスできるようになります。

## 🧠 証明生成ロジックの実装

証明を生成する複雑なロジックを、再利用可能な **カスタムフック** としてカプセル化します。

これにより、メインのUIコンポーネントをクリーンに保つことができます。

`pkgs/frontend/hooks/useZKNFT.ts`というファイルを作成し、以下のコードを記述します。

```typescript
// pkgs/frontend/hooks/useZKNFT.ts
import { useState } from "react";
import { buildPoseidon } from "circomlibjs";
// snarkjsはブラウザ環境でグローバルに読み込まれるため、型定義がない場合はanyとして扱う
const snarkjs = (window as any).snarkjs;

// スマートコントラクトの関数に渡すためのデータ構造を定義
export interface Calldata {
  pA: string[];
  pB: string[][];
  pC: string[];
  pubSignals: string[];
}

// ZKNFTに関連するロジックをまとめたカスタムフック
export const useZKNFT = () => {
  const [isProofLoading, setIsProofLoading] = useState<boolean>(false);
  const [calldata, setCalldata] = useState<Calldata | null>(null);

  // パスワードを受け取り、証明を生成する非同期関数
  const generateProof = async (password: string): Promise<Calldata | null> => {
    setIsProofLoading(true);
    setCalldata(null);
    try {
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
        "/zk/circuit.wasm",
        "/zk/circuit.zkey"
      );

      // --- ステップ3: スマートコントラクトに渡せる形式にデータを整形 ---
      const rawCalldata = await snarkjs.groth16.exportSolidityCallData(
        proof,
        publicSignals
      );

      // 不要な文字を削除し、カンマで分割して配列に変換
      const argv = rawCalldata
        .replace(/["[\]\s]/g, "")
        .split(",")
        .map((x: string) => BigInt(x).toString());

      // 整形されたデータをCalldataインターフェースの形に再構築
      const pA = argv.slice(0, 2);
      const pB = [argv.slice(2, 4), argv.slice(4, 6)];
      const pC = argv.slice(6, 8);
      const pubSignals = argv.slice(8, 9);

      const calldataResult = { pA, pB, pC, pubSignals };
      setCalldata(calldataResult);
      return calldataResult;
    } catch (error) {
      console.error("Error generating proof:", error);
      return null;
    } finally {
      setIsProofLoading(false);
    }
  };

  return { isProofLoading, calldata, generateProof };
};
```

### 🔍 コード解説

- **`snarkjs`のインポート**:   
  `snarkjs`は、`layout.tsx`で`<Script>`タグを使ってグローバルに読み込むため、ここでは`window`オブジェクトから直接参照します。

- **`Calldata`インタフェース**:   
  スマートコントラクトの`safeMint`関数が期待する引数の型に合わせて、証明データを整形するためのデータ構造を定義します。

- **`generateProof`関数**:  

    1. **入力データの準備**:   
      ユーザーが入力した`password`文字列を、回路が理解できる数値（`passwordNumber`）に変換し、そのハッシュ値（`hash`）を計算します。

    2. **証明の生成**:   
      `snarkjs.groth16.fullProve`を呼び出します。これが魔法の核心部分です。
      
      回路の入力（`inputs`）、コンパイルされた回路（`.wasm`）、そして証明鍵（`.zkey`）を渡すことで、 **`proof`** と **`publicSignals`** を生成します。この処理は計算量が多いですが、ユーザーのブラウザ内で完結します。

    3. **データ整形**:   
      `snarkjs.groth16.exportSolidityCallData`を使って、生成された証明をSolidityのコントラクトが直接受け取れる形式の文字列に変換します。
      
      その後、文字列をパースして、`Calldata`インタフェースに合わせたオブジェクトに再構築します。

- **状態管理**:   
  `isProofLoading`で証明生成中のローディング状態を、`calldata`で生成された証明データを管理します。

## 📜 snarkjsの読み込み

`snarkjs`をブラウザで利用するために、`layout.tsx`に`<Script>`タグを追加します。

`pkgs/frontend/src/app/layout.tsx`を以下のように修正してください。

```tsx
// pkgs/frontend/src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import Script from "next/script"; // 👈 インポート

// ... (略) ...

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <Providers>{children}</Providers>
        {/* snarkjsをグローバルに読み込む */}
        <Script src="https://cdn.jsdelivr.net/npm/snarkjs@0.7.0/build/snarkjs.min.js" />
      </body>
    </html>
  );
}
```

`next/script`コンポーネントを使うことで、`snarkjs`ライブラリが効率的に読み込まれ、アプリケーションのパフォーマンスへの影響を最小限に抑えることができます。

## 🔗 UIとの連携

最後に、作成した`useZKNFT`フックをメインページの`page.tsx`に組み込み、証明生成ボタンのアクションと連携させます。

`pkgs/frontend/src/app/page.tsx`を以下のように修正します。

```tsx
// pkgs/frontend/src/app/page.tsx
"use client";

// ... (既存のインポート) ...
import { useZKNFT } from "@/hooks/useZKNFT"; // 👈 カスタムフックをインポート
import { Loader2 } from "lucide-react"; // 👈 ローディングアイコン

export default function Home() {
  // ... (既存のフック) ...
  const { isProofLoading, generateProof } = useZKNFT(); // 👈 useZKNFTフックを利用

  const handleMint = async () => {
    if (!password) {
      alert("Please enter a password.");
      return;
    }
    const calldata = await generateProof(password);
    if (calldata) {
      console.log("Proof generated successfully:", calldata);
      // ここでBiconomyを使ったミント処理を呼び出す (次のレッスン)
    }
  };

  // ... (return文の前まで) ...

  return (
    <main /* ... */>
      {/* ... (略) ... */}
      <div className="flex w-full max-w-sm items-center space-x-2 mt-4">
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isProofLoading} // 👈 ローディング中は無効化
        />
        <Button
          type="submit"
          onClick={handleMint}
          disabled={isProofLoading} // 👈 ローディング中は無効化
        >
          {isProofLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            "Mint"
          )}
        </Button>
      </div>
      {/* ... (略) ... */}
    </main>
  );
}
```

### 🔍 コード解説

- `useZKNFT()`:   
  カスタムフックを呼び出し、証明生成関数`generateProof`とローディング状態`isProofLoading`を取得します。

- `handleMint`:   
  Mintボタンがクリックされたときに実行される関数です。

    - `generateProof(password)`を呼び出して、証明生成プロセスを開始します。

    - `isProofLoading`の状態に応じて、入力フィールドとボタンを無効化し、ボタン内にローディングスピナーを表示します。これにより、ユーザー体験が向上します。

    - 現時点では、生成された証明データ（`calldata`）はコンソールに出力するだけです。

---

お疲れ様でした！ これで、フロントエンドアプリケーションの内部で、ユーザーのプライバシーを守りながらゼロ知識証明を生成する、非常に高度な機能が実装できました。

アプリケーションを起動し、任意のパスワードを入力して「Mint」ボタンをクリックしてみてください。  

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
