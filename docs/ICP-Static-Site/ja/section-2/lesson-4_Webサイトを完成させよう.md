### 🖍 Web サイトを完成させよう

このレッスンでは、

- ホーム
- プロフィール
- ポートフォリオ

を作成してWebサイトを完成させたいと思います。

先に、プロフィール欄で表示する画像を準備しましょう。ここでは以下の画像を使用しますが、お好きな画像を準備していただいて大丈夫です！

`unchain_logo.png`

![](/public/images/ICP-Static-Site/section-2/2_4_1.png)

準備した画像を、`./src/assets/`フォルダに入れます。

次に、3つのファイルを作成します。

```
touch ./src/lib/Home.svelte ./src/lib/About.svelte ./src/lib/Portfolio.svelte
```

ここまでで、以下のように4つのファイルが追加されます。

```diff
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
 │   ├── App.svelte
 │   ├── app.css
 │   ├── assets/
 │   │   ├── svelte.svg
+│   │   └── unchain_logo.png
 │   ├── lib/
+│   │   ├── About.svelte
 │   │   ├── Footer.svelte
+│   │   ├── Home.svelte
 │   │   ├── Nav.svelte
+│   │   └── Portfolio.svelte
 │   ├── main.js
 │   └── vite-env.d.ts
 ├── tailwind.config.cjs
 └── vite.config.js
```

### 🚪 ホームを作成しよう

`./src/lib/Home.svelte`ファイルに、以下のコードを書き込みます。

[Home.svelte]

```javascript
<!-- Nav.svelteの`href="#home"`と紐づく`id`を指定する -->
<section id='home'>
  <div class='container mx-auto'>
    <div class='py-96'>
      <h1 class='text-center text-gray-600 font-medium text-5xl sm:text-7xl'>
        MY WEBSITE
      </h1>
    </div>
  </div>
</section>
```

`<section>`に`id`属性が指定されている点に注目してください。`id='home'`と、前回のレッスンで実装した`Nav.svelte`ファイル内の`href='#home'`が紐づきます。これにより、ページ内リンクが実装されます。

### 👤 プロフィールを作成しよう

`./src/lib/About.svelte`ファイルに、以下のコードを書き込みます。

[About.svelte]

```javascript
<script>
  import profileImage from '../assets/unchain_logo.png';
</script>

<!-- Nav.svelteの`href="#about"`と紐づく`id`を指定する -->
<section id="about">
  <div class="py-32 text-gray-600">
    <h1 class="text-center mb-10 font-medium text-3xl">ABOUT ME</h1>
    <div class="flex flex-wrap lg:w-4/5 sm:mx-auto">
      <div class="p-2 md:w-1/2 w-full">
        <img src={profileImage} alt="" class="mx-auto mt-24 md:mt-0" />
      </div>
      <div class="flex flex-col text-center p-2 md:w-1/2 w-full">
        <h1 class="text-gray-900 mb-10 font-medium">YOUR_NAME</h1>
        <p class="mb-8 leading-relaxed">
          YOUR_MESSAGE
        </p>
      </div>
    </div>
  </div>
</section>
```

`<script></script>`に、準備していただいたプロフィール画像のインポート文を書きます。ファイル名は適宜書き換えてください。また、13行目の`YOUR_NAME`と、14行目の`YOUR_MESSAGE`は自由に書き換えてください。

### 📄 ポートフォリオを作成しよう

`./src/lib/Portfolio.svelte`ファイルに、以下のコードを書き込みます。

[Portfolio.svelte]

```javascript
<script>
  let projects = [
    { name: 'ETH dApp', url: 'YOUR_PROJECT_URL' },
    { name: 'ETH NFT Collection', url: 'YOUR_PROJECT_URL' },
    { name: 'ETH NFT Maker', url: 'YOUR_PROJECT_URL' },
    { name: 'ETH NFT Game', url: 'YOUR_PROJECT_URL' },
  ];
</script>

<!-- Nav.svelteの`href="#portfolio"`と紐づく`id`を指定する -->
<section id="portfolio">
  <div class="container mx-auto">
    <div class="py-32">
      <h1 class="text-center mb-10 font-medium text-3xl">PORTFOLIO</h1>
      <div class="flex flex-wrap lg:w-4/5 sm:mx-auto">
        <!-- `each`ブロックでループ処理を行う -->
        {#each projects as project}
          <div class="p-2 md:w-1/3 w-full">
            <div
              class="bg-gray-400 text-white hover:bg-gray-800 cursor-pointer rounded p-4 text-center "
            >
              <a href={project.url}>{project.name}</a>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </div>
</section>
```

`<script></script>`の中は、これまでUNCHAINで取り組んだコンテンツなど、ご自身の作品を自由に設定してください。ここでは、各プロジェクトの名前とURLを要素として持つデータ構造を、`projects`という変数に代入しています。

```javascript
<script>
  let projects = [
    { name: 'ETH dApp', url: 'YOUR_PROJECT_URL' },
    { name: 'ETH NFT Collection', url: 'YOUR_PROJECT_URL' },
    { name: 'ETH NFT Maker', url: 'YOUR_PROJECT_URL' },
    { name: 'ETH NFT Game', url: 'YOUR_PROJECT_URL' },
  ];
</script>
```

データ構造は、`each`ブロックを用いることでループ処理ができます。

```javascript
<!-- `each`ブロックでループ処理を行う -->
{#each projects as project}
  <div class="p-2 md:w-1/3 w-full">
    <div
      class="bg-gray-400 text-white hover:bg-gray-800 cursor-pointer rounded p-4 text-center "
    >
      <a href={project.url}>{project.name}</a>
    </div>
  </div>
{/each}
```

最後に、`./src/App.svelte`ファイルを編集してブラウザに反映させましょう。

````diff
[App.svelte]

```diff
<script>
  import Nav from './lib/Nav.svelte';
+ import Home from './lib/Home.svelte';
+ import About from './lib/About.svelte';
+ import Portfolio from './lib/Portfolio.svelte';
  import Footer from './lib/Footer.svelte';
</script>

<main>
  <div>
    <Nav />
+   <Home />
+   <About />
+   <Portfolio />
    <Footer />
  </div>
</main>
````

スクロールやナビゲーションバーを操作して、Webサイトを確認してみましょう。

![](/public/images/ICP-Static-Site/section-2/2_4_2.png)

![](/public/images/ICP-Static-Site/section-2/2_4_3.png)

![](/public/images/ICP-Static-Site/section-2/2_4_4.png)

### ✂️ ファイルを整理しよう

仕上げに、ファイルの編集・削除を行います。

タイトルを変更するため、`./index.html`ファイルを以下のコードに書き換えます。

[index.html]

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>MY WEBSITE</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.js"></script>
  </body>
</html>
```

サンプルプロジェクトで使用されていたアイコンのリンク`<link />`を削除し、タイトル`<title></title>`を変更しました。

次に、不要となったタイトルのアイコン・ロゴを削除します。以下のコマンドで実行できます（ロゴを残しておきたい方はここをとばしてください）。

```
rm -r ./public ./src/assets/svelte.svg
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

おめでとうございます！ セクション2は終了です！

次のセクションに進み、IC上にデプロイする準備をしていきましょう 🚀
