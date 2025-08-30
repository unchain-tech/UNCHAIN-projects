# 4.3 SuiとSupabaseのクライアントインスタンスの実装

ここまで実装した機能でほぼ完成ですがまだやることが2つ残っています！

それはSuiとSupabaseのクライアントインスタンスの実装です。

これがないとSuiやSupabaseと通信することができないので追加していきましょう！

## Suiクライアントインスタンスの実装

`src/lib/suiClient.ts`ファイルを開いて以下のコードをコピー&ペーストしてください。

`@mysten/sui.js`が提供する`SuiClient`を使ってクライアントインスタンスを初期化しています。

```ts
import { SuiClient } from "@mysten/sui.js/client";
import { FULLNODE_URL } from "../utils/constant";

// Sui Clientの初期化（全プロジェクト共通で利用）
export const suiClient = new SuiClient({ url: FULLNODE_URL });
```

## Supabaseクライアントインスタンスの実装

`src/lib/supabaseClient.ts`ファイルを開いて以下のコードをコピー&ペーストしてください

`@supabase/supabase-js`が提供する`createClient`を使ってクライアントインスタンスを初期化しています。

```ts
import { createClient } from "@supabase/supabase-js";

const requiredEnvVars = {
  VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
  VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
};

Object.entries(requiredEnvVars).forEach(([key, value]) => {
  if (!value) {
    throw new Error(`Environment variable ${key} is required but not defined`);
  }
});

// Supabase用のクライアントインスタンスを作成
export const supabase = createClient(
  requiredEnvVars.VITE_SUPABASE_URL,
  requiredEnvVars.VITE_SUPABASE_ANON_KEY,
);
```

これでOKです！

## 完成したアプリの動かし方

お疲れ様でした！

これで実装は終わりです！

最後にちゃんと実装できたかチェックしてみましょう！

### ビルド

```bash
bun run build
```

問題なければ正常にコンパイルされるはずです！

### 起動

ではアプリを立ち上げてみましょう！

```bash
bun run dev
```

[http://localhost:5173](http://localhost:5173)にアクセスして以下のような画面が立ち上がればOKです！

![](/images/Sui-zklogin/section-0/0.png)

### 動作確認

`Execute Transaction`と`Mint a Test NFT`ボタンを押して送金処理とNFTミントが問題なく実行されるか確認しましょう！

正常に動いているのであればSUIの残高は減り、NFTの残高は1つずつ増えていくはずです！

---

おめでとうございます！

これで`unchain-tech/sui-zklogin-app`の`complete`ブランチと同等の機能を持つdAppが完成しました！

あなたはzkLoginの認証フローから、Suiブロックチェーン上でのトランザクション実行、NFTミントまでの一連の流れを実装することができました！

今後Suiを使ってプロダクトを開発する際にはぜひzkloginを使ってみてくださいね！ 

この学習コンテンツに挑戦してみてもっと良くするための提案を思いついた方はぜひイシューやプルリクエストを作ってみてください！

ここまで本当にお疲れ様でした！
