### 🧱 コンポーネントを作成しよう

今回作成するWebサイトは、以下の要素で構成されます。

- ナビゲーションバー
- ホーム
- プロフィール
- ポートフォリオ
- フッター

このレッスンでは、ナビゲーションバーとフッターを作成していきます。

その前に不要なファイルを削除しておきましょう。サンプルプロジェクトに準備されていた`Counter.svelte`ファイルを削除します。

```
rm ./src/lib/Counter.svelte
```

それでは、ナビゲーションバーから作成していきましょう！

### 🧱 ナビゲーションバーを作成しよう

`src/lib/`フォルダに`Nav.svelte`ファイルを作成します。

```
touch ./src/lib/Nav.svelte
```

ナビゲーションバーを実装するためのコードを、作成したファイルに書き込みます。

[Nav.svelte]

```javascript
<header class="bg-blue-400 p-4 sticky top-0">
  <nav class="container flex justify-between items-center mx-auto">
    <!-- Webサイトのタイトル -->
    <div class="text-2xl">MY WEBSITE</div>
    <div class="space-x-12">
      <!-- 各要素へのページ内リンク -->
      <a href="#home" class="hover:text-gray-500">HOME</a>
      <a href="#about" class="hover:text-gray-500">ABOUT</a>
      <a href="#portfolio" class="hover:text-gray-500">PORTFOLIO</a>
    </div>
  </nav>
</header>
```

コードを見てみましょう。

各要素へのリンクに、`href=#xxx`と設定しています。`href=section_name`、同一ページ内の`section_name`へリンクをするという意味になります。指定している各セクションについては、次のレッスンで作成します。

また、各タグの中に`class`属性が指定されています。このように、Tailwind CSSの提供するクラスを指定することで簡単にCSSの設定が行えます。

VS Codeの拡張機能をインストールした方は、クラスにカーソルを当てることでプロパティを確認することができます。下の例では、1行目の`sticky`というクラスのプロパティが表示されています。これは、ナビゲーションバーをページの一番上に固定します。

![](/public/images/ICP-Static-Site/section-2/2_3_1.png)

また、Tailwind CSSの[公式ドキュメント](https://tailwindcss.com/docs/position#sticky-positioning-elements)でも確認できます。ぜひ、コンテンツの最後にカスタマイズしてみましょう！

次に、実装したナビゲーションバーを表示するために、`./src/App.svelte`ファイルを以下のように書き換えます。

```javascript
<script>
  import Nav from './lib/Nav.svelte';
</script>

<main>
  <div>
    <Nav />
  </div>
</main>
```

コードを見ていきましょう。

`Svelte`では、`<script></script>`の中にファイルのインポート文を書きます。ここでは、`Nav.svelte`ファイルを`Nav`という名前をつけてインポートしています。

```javascript
<script>import Nav from './lib/Nav.svelte';</script>
```

次のブロックで、実際にブラウザ上に表示する内容を実装しています。ここで、先ほどインポートをした`Nav`を呼びます。

```javascript
<main>
  <div>
    <Nav />
  </div>
</main>
```

では、動作確認をしてみましょう。プロジェクトを止めてしまった方は以下のコマンドを実行して起動しましょう。

```
npm run dev
```

ナビゲーションバーが表示されていたら完了です！

![](/public/images/ICP-Static-Site/section-2/2_3_2.png)

### 🧱 フッターを作成しよう

Webサイトの最下部を構成するフッターを実装しましょう。手順は、ナビゲーションバーを実装した時と同じです。

まず、`src/lib/`フォルダに`Footer.svelte`ファイルを作成します。

```
touch ./src/lib/Footer.svelte
```

フッターを実装するためのコードを、作成したファイルに書き込みます。

[Footer.svelte]

```javascript
<footer class='bg-blue-400 p-12 absolute bottom-0 w-full'>
  <div class='container text-center mx-auto'>
    <p class='text-sm'>built by YOUR_NAME</p>
  </div>
</footer>
```

`YOUR_NAME`の部分は自由に書き換えてください。

次に、`./src/App.svelte`ファイルを編集します。

[App.svelte]

```diff
<script>
  import Nav from './lib/Nav.svelte';
+ import Footer from './lib/Footer.svelte';
</script>

<main>
  <div>
    <Nav />
+   <Footer />
  </div>
</main>
```

では、ブラウザで表示を確認してみましょう。

ナビゲーションバーの下にフッターが表示されていたら完成です！

![](/public/images/ICP-Static-Site/section-2/2_3_3.png)


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

次のレッスンに進み、Webサイトを完成させましょう！
