---
title: "クライアントサイドでのZK証明生成"
---

このレッスンでは、ユーザーが入力したパスワードを基に、ブラウザ上でゼロ知識証明を生成する機能を実装します。`snarkjs`をクライアントサイドで利用し、バックエンドで生成した回路（`.wasm`）と証明鍵（`.zkey`）を使って証明を計算します。

## 🛠 準備: 回路ファイルの配置

まず、`section-2`で生成した`circuit.wasm`と`circuit.zkey`を、フロントエンドからアクセスできる`public`ディレクトリにコピーする必要があります。

`pkgs/frontend/public`ディレクトリを作成し、その中に`zk`というサブディレクトリを作成します。

```bash
mkdir -p pkgs/frontend/public/zk
```

次に、`circuit`ディレクトリから必要なファイルをコピーします。

```bash
cp circuit/build/circuit.wasm pkgs/frontend/public/zk/
cp circuit/build/circuit.zkey pkgs/frontend/public/zk/
```

これにより、フロントエンドのコードから`/zk/circuit.wasm`と`/zk/circuit.zkey`というパスでこれらのファイルにアクセスできるようになります。

## 🧠 証明生成ロジックの実装

証明生成のロジックをカプセル化するためのカスタムフック`useZKNFT`を作成します。`pkgs/frontend/src/hooks/useZKNFT.ts`というファイルを作成し、以下のコードを記述します。

```typescript
// pkgs/frontend/src/hooks/useZKNFT.ts
import { useState } from "react";
import { buildPoseidon } from "circomlibjs";
// snarkjsの型定義がないため、anyとしてインポート
const snarkjs = (window as any).snarkjs;

// 証明と公開シグナルを整形するためのインターフェース
interface Calldata {
  pA: string[];
  pB: string[][];
  pC: string[];
  pubSignals: string[];
}

// パスワードを受け取り、証明を生成する関数
export const useZKNFT = () => {
  const [isProofLoading, setIsProofLoading] = useState<boolean>(false);

  // 証明生成関数
  const generateProof = async (password: string): Promise<Calldata | null> => {
    setIsProofLoading(true);
    try {
      // 1. パスワードから入力データを準備する
      const poseidon = await buildPoseidon();
      const passwordNumber = BigInt(
        Buffer.from(password).toString("hex"),
        16
      ).toString();
      const hash = poseidon.F.toString(poseidon([passwordNumber]));

      const inputs = {
        password: passwordNumber,
        hash: hash,
      };

      // 2. ZK証明を生成する
      // section-2で生成し、publicディレクトリにコピーしたファイルを使用
      const { proof, publicSignals } = await snarkjs.groth16.fullProve(
        inputs,
        "/zk/circuit.wasm",
        "/zk/circuit.zkey"
      );

      // 3. スマートコントラクトに渡せる形式にデータを整形する
      const calldata = await snarkjs.groth16.exportSolidityCallData(
        proof,
        publicSignals
      );

      // 不要な部分を削除し、整形
      const argv = calldata
        .replace(/["[\]\s]/g, "")
        .split(",")
        .map((x: string) => BigInt(x).toString());

      const pA = argv.slice(0, 2);
      const pB = [
        argv.slice(2, 4),
        argv.slice(4, 6),
      ];
      const pC = argv.slice(6, 8);
      const pubSignals = argv.slice(8, 9);

      return { pA, pB, pC, pubSignals };
    } catch (error) {
      console.error("Error generating proof:", error);
      return null;
    } finally {
      setIsProofLoading(false);
    }
  };

  return { isProofLoading, generateProof };
};
```

### コード解説
- `useZKNFT()`:
    - カスタムフックを呼び出し、`isLoading`（`isProofLoading`にリネーム）と`generateProof`関数を取得します。
- `handleMint`:
    - パスワードが空でないことを確認します。
    - `generateProof(password)`を呼び出して、証明を生成します。
    - 証明が生成されたら、コンソールに出力します（次のレッスンで実際のミント処理に置き換えます）。
- **UIの更新**:
    - `isProofLoading`が`true`の間、入力欄とボタンを無効化します。
    - ボタンのテキストを`"Generating Proof..."`に変更し、ユーザーに処理中であることを伝えます。

これで、クライアントサイドでのゼロ知識証明の生成機能が実装できました。アプリケーションを実行し、任意のパスワードを入力して`Mint ZK NFT`ボタンをクリックすると、ブラウザのコンソールに生成された証明データが表示されるはずです。

次のレッスンでは、Biconomyを導入し、この証明データを使ってガスレスでNFTをミントする機能を完成させます。
