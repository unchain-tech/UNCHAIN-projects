---
title: "Farcaster Mini Appのメタデータを実装する"
---

# Lesson 3: Farcaster Mini Appのメタデータを実装する

このレッスンでは、私たちのWebアプリケーションが`Farcaster`上で`Mini App`として正しく認識され、表示されるようにするための「メタデータ」を設定します。

Farcasterのクローラーは、URLが投稿（Cast）された際にそのページのHTMLを読み取り、特定の`<meta>`タグを探します。

これらのタグにMini Appとしての情報が記述されていると、フィード上でアプリが展開される仕組みです。

## 📦 `app/.well-known/farcaster.json/route.ts`の実装

FarcasterにMini Appの情報を提供するため、`app/.well-known/farcaster.json/route.ts`というファイルを作成し、以下の内容を記述します。

```bash
touch app/.well-known/farcaster.json/route.ts
```

次に以下のJSONを記述します。

```ts
//app/.well-known/farcaster.json/route.ts

/**
 * オブジェクトから未定義(undefined)、空文字、空配列のプロパティを取り除くためのヘルパー関数です。
 * Farcasterのフレームメタデータなど、不要なプロパティを含めないようにするために使用します。
 * @param properties - クリーニング対象のプロパティを持つオブジェクト
 * @returns - 有効なプロパティのみを持つ新しいオブジェクト
 */
function withValidProperties(properties: Record<string, undefined | string | string[]>) {
  return Object.fromEntries(
    Object.entries(properties).filter(([key, value]) => {
      if (Array.isArray(value)) {
        return value.length > 0;
      }
      return !!value;
    })
  );
}

/**
 * Farcasterアプリケーションのメタデータを返すAPIエンドポイントです。
 * `.well-known/farcaster.json` としてFarcasterに認識されます。
 * アプリケーションの名前、説明、アイコン、Webhook URLなどの情報を提供します。
 * @see https://docs.farcaster.xyz/reference/app-metadata
 */
export async function GET() {
  const URL = process.env.NEXT_PUBLIC_URL;

  return Response.json({
    // Farcasterアカウントの関連付け情報
    accountAssociation: {
      header: process.env.FARCASTER_HEADER,
      payload: process.env.FARCASTER_PAYLOAD,
      signature: process.env.FARCASTER_SIGNATURE,
    },
    // Farcasterフレームのメタデータ
    frame: withValidProperties({
      version: '1',
      name: process.env.NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME,
      subtitle: process.env.NEXT_PUBLIC_APP_SUBTITLE,
      description: process.env.NEXT_PUBLIC_APP_DESCRIPTION,
      screenshotUrls: [],
      iconUrl: process.env.NEXT_PUBLIC_APP_ICON,
      splashImageUrl: process.env.NEXT_PUBLIC_APP_SPLASH_IMAGE,
      splashBackgroundColor: process.env.NEXT_PUBLIC_SPLASH_BACKGROUND_COLOR,
      homeUrl: URL,
      webhookUrl: `${URL}/api/webhook`,
      primaryCategory: process.env.NEXT_PUBLIC_APP_PRIMARY_CATEGORY,
      tags: [],
      heroImageUrl: process.env.NEXT_PUBLIC_APP_HERO_IMAGE,
      tagline: process.env.NEXT_PUBLIC_APP_TAGLINE,
      ogTitle: process.env.NEXT_PUBLIC_APP_OG_TITLE,
      ogDescription: process.env.NEXT_PUBLIC_APP_OG_DESCRIPTION,
      ogImageUrl: process.env.NEXT_PUBLIC_APP_OG_IMAGE,
    }),
    // Base Builderに登録する際に必要となる情報
    baseBuilder: {
      // Base Buildに登録する際に必要となる(自分のFarcasterアカウントのウォレットアドレスを設定する)
      // このアプリを編集・管理できるFarcasterアカウントに紐づくウォレットアドレス
      allowedAddresses: ['<ここにFarcasterアカウントに紐づくウォレットアドレスを記載する>'],
    },
  });
}
```

> 上記の`allowedAddresses`はセクション1で作成した`Farcaster Account`のウォレットアドレスを記載してください。

> 上記の`accountAssociation`の3つのプロパティはこの後のセクションにて設定します。

## 📖 コード解説

この`route.ts`ファイルは、FarcasterのFrame仕様（Mini Appの前身であり、互換性を持つ）に基づいて、アプリケーションの基本的な情報を提供します。

このファイルを用意することで、Farcasterのクローラーは`https://<あなたのドメイン>/.well-known/farcaster/frame.json`というパスでこの情報にアクセスできるようになります。

---

この設定により、あなたのアプリケーションのURLがFarcasterで共有された際に、Mini Appとして展開される準備が整いました。

次のレッスンでは、ゲームのトランザクション結果を表示するコンポーネントを実装します。

### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discordの`#base`で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の3点を記載してください ✨

1.  質問が関連しているセクション番号とレッスン番号
2.  何をしようとしていたか
3.  エラー文をコピー&ペースト
4.  エラー画面のスクリーンショット
