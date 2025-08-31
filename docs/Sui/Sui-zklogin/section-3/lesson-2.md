# 3.2 zkLoginフックの実装

完成形に近づけるため、最初のステップとしてzkLoginの認証フローを開始するためのカスタムフック`useZKLogin`を実装していきます！

このフックは、ユーザーがログインボタンをクリックした際の一連の処理をカプセル化し、コンポーネントの責務をUIの表示に集中させる役割を担います。

## ファイルの作成

まず、`src/hooks`ディレクトリにある`useZKLogin.ts`という名前のファイルを開いて以下のコードをコピー&ペーストしてください。

## コードの実装

```typescript
import { useCallback, useContext } from "react";
import { GlobalContext } from "../types/globalContext";

/**
 * zkLogin関連の状態とメソッドを使用するためのカスタムフック
 */
export function useZKLogin() {
  const context = useContext(GlobalContext);
  if (context === undefined) {
    throw new Error("useZKLogin must be used within a GlobalProvider");
  }

  const {
    generateEphemeralKeyPair,
    generateRandomnessValue,
    fetchCurrentEpoch,
  } = context;

  /**
   * Starts the zkLogin process by generating the necessary initial values.
   * The rest of the flow is handled by useEffects in GlobalProvider.
   */
  const startLogin = useCallback(async () => {
    // 一時鍵ペア、エポック数取得、ランダムネス生成を行う
    generateEphemeralKeyPair();
    await fetchCurrentEpoch();
    generateRandomnessValue();
  }, [generateEphemeralKeyPair, fetchCurrentEpoch, generateRandomnessValue]);

  return {
    startLogin,
  };
}
```

### コードの解説

- **`import { useCallback, useContext } from "react";`**
  - Reactから、メモ化されたコールバックを返す`useCallback`と、コンテキストの現在の値を読み取る`useContext`をインポートします。
- **`import { GlobalContext } from "../types/globalContext";`**
  - アプリケーションのグローバルな状態とロジックを共有するために定義された`GlobalContext`をインポートします。

- **`export function useZKLogin() { ... }`**
  - `useZKLogin`というカスタムフックを定義しています。このフックはzkLoginに関連するロジックをカプセル化します。

- **`const context = useContext(GlobalContext);`**
  - `useContext`フックを使って`GlobalContext`から値を取得します。この値には、グローバルな状態と、それを更新するための関数が含まれています。

- **`const { ... } = context;`**
  - コンテキストから、zkLoginプロセスの開始に必要な3つの関数 (`generateEphemeralKeyPair`, `generateRandomnessValue`, `fetchCurrentEpoch`) を取り出しています。

- **`const startLogin = useCallback(async () => { ... });`**
  - `startLogin`関数を定義しています。この関数がログインプロセスのトリガーとなります。
  - `useCallback`を使うことで、依存する関数 (`generate...`など) が変更されない限り、`startLogin`関数の再生成を防ぎ、パフォーマンスを最適化しています。
  - 関数内では、zkLoginの準備として「一時鍵ペアの生成」「現在のエポック数の取得」「ランダムな値の生成」を順に呼び出しています。
  
- **`return { startLogin };`**
  - `startLogin`関数を返すことで、UIコンポーネント（例: ログインボタン）からこのフックを通じてログイン処理を開始できるようになります。

---

次のレッスンでは、Suiブロックチェーンとのやり取りを担当する`useSui`フックを実装していきます。
