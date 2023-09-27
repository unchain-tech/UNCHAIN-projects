### 🍃 Tailwind CSS のセットアップをしよう

このレッスンでは、Tailwind CSSを使用するための準備を行います。

`icp-static-site/`にいることを確認して、以下のコマンドを実行します。

```
npm install -D tailwindcss@3.1.8 postcss@8.4.16 autoprefixer@10.4.8
```

次に、設定ファイルを作成します。

```
npx tailwindcss init  -p
```

2つのファイルが作成されます。

```
Created Tailwind CSS config file: tailwind.config.cjs
Created PostCSS config file: postcss.config.cjs
```

作成された`tailwind.config.cjs`ファイルに、パスを追加します。以下のように書き換えてください。

[tailwind.config.cjs]

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

最後に、CSSにTailwindの設定を追加します。`./src/app.css`ファイルを以下のように上書きしてください。

[app.css]

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

これでTailwind CSSの設定は完了です。きちんと機能しているか確認してみましょう。

`./src/App.svelte`ファイルの15行目`h1`タグを、以下のように書き換えます。

[App.svelte]

```javascript
<h1 class='text-red-600'>Vite + Svelte</h1>
```

`Vite + Svelte`の部分が赤字に変わっていたら成功です！
`app.css`を上書きしたことにより、表示が崩れてしまいますが気にせず進みましょう。

![](/public/images/ICP-Static-Site/section-2/2_2_1.png)

この時点でのファイル構成を`tree`コマンドで確認してみましょう。最後に指定した`.`は、現在自分がいるディレクトリ（カレントディレクトリ）を意味します。

```
tree -L 1 -F -a .
```

以下のような構成になっていることを確認してください。

```
./
├── .gitignore
├── .vscode/
├── README.md
├── index.html
├── jsconfig.json
├── node_modules/
├── package-lock.json
├── package.json
├── postcss.config.cjs
├── public/
├── src/
├── tailwind.config.cjs
└── vite.config.js
```

### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discordの`#icp`で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の4点を記載してください ✨

```
1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット
```

---

次のレッスンに進み、Webサイトのコンポーネントを作成していきましょう！
