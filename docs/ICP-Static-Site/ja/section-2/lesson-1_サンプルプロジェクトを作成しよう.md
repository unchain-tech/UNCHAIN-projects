### 🗂 サンプルプロジェクトを作成しよう

```
npm create vite@3
```

いくつかの質問に答えて、プロジェクトの設定を行います。

最初にプロジェクト名は、好きな名前に変えていただいて大丈夫です（ただし、この後もここで使った名前を使うので同じ名前にしておいた方がスムーズに進めることができるかと思います）。

```
? Project name: › icp-static-site
```

パッケージ名はデフォルトでプロジェクト名が入るので、そのままEnterを押します。

```
? Package name: › icp-static-site
```

フレームワークは`svelte`を選択します。

```
? Select a framework: › - Use arrow-keys. Return to submit.
    vanilla
    vue
    react
    preact
    lit
❯   svelte
```

最後に言語の選択をします。このプロジェクトでは`JavaScript`を選択しています。

```
? Select a variant: › - Use arrow-keys. Return to submit.
❯   svelte
    svelte-ts
```

ターミナルに以下のような出力があり、プロジェクトが作成されます。

```
✔ Project name: … icp-static-site
✔ Package name: … icp-static-site
✔ Select a framework: › svelte
✔ Select a variant: › svelte

Scaffolding project in /Users/user/Desktop/div/IC-static-website...

Done. Now run:

  cd icp-static-website
  npm install
  npm run dev

```

作成されたプロジェクトのファイル構成を確認します。

ここでは、`tree`コマンドを実行して確認したいと思います。`-L 1`は1つ下の階層まで、`-F`はディレクトリを`/`で表現する、`-a`は隠しファイル（.ファイル）を表示するという意味です。

```
tree -L 1 -F -a icp-static-site
```

以下のような構成になっていることを確認してください。

```
icp-static-site/
├── .gitignore
├── .vscode/
├── README.md
├── index.html
├── jsconfig.json
├── package.json
├── public/
├── src/
└── vite.config.js
```

それでは、プロジェクトへ移動して実際に起動してみましょう。

```
cd icp-static-site
npm install
npm run dev
```

以下のように表示されます。

```

  VITE v3.0.9  ready in 1233 ms

  ➜  Local:   http://localhost:5174/
  ➜  Network: use --host to expose
```

`Local:`に表示されたURLにアクセスすると、ブラウザでサンプルプロジェクトが確認できます。

![](/public/images/ICP-Static-Site/section-2/2_1_1.png)

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

次のレッスンに進み、Tailwind CSSのセットアップをしていきましょう！
