###  🖥 このレッスンの参考動画URL
[Dapp University](https://youtu.be/CgXQC4dbGUE?t=6654)

### 🔥フロントエンドのセットアップをしよう

ではここからはフロントエンドの開発をしていきます.

`packages`ディレクトリへ移動して以下のコマンドを実行してください。

```
npx create-react-app client
```

その後ルートディレクトリに移動して下のコマンドを実行してみてください。

```
yarn client start
```

下のようなUIがローカルホストで立ち上がれば成功です！

![](/public/images/ETH-Yield-Farm/section-3/3_1_8.png)

では次にTailwindの設定をしていきましょう！

`packages/client`に移動して下のコマンドを実行してみてください。

```
yarn add -D tailwindcss
npx tailwindcss init
```

その後作成された`tailwind.config.js`を下のように編集してみましょう。

```
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

最後に`index.css`の一番上に以下の3行を追加してみましょう。

```
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discordの`#ethereum`で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の3点を記載してください ✨

```
1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット
```

---
これでフロントのコードを書く準備は整ったので次のレッスンでフロントの作成に映っていきます。
