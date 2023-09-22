### 🍽 フロントエンドを作成しよう

このセクションでは、Webサイトの構築を通して、フロントエンドがスマートコントラクトとどのように関連するのかを学びます。

今回は`typescript` + `React` + `Next.js`を使ってフロントエンド開発を進めていきます。

- `typescript`: プログラミング言語
- `React.js`: ライブラリ
- `Next.js`: `React.js`のフレームワーク

### 🏙️ `Typescript`

`TypeScript`はMicrosoftが中心となって開発を進めているオープンソースのプログラミング言語です。

`TypeScript`のコードはコンパイルにより`JavaScript`のコードに変換されてから実行されます。
最終的には`JavaScript`のコードとなるので、処理能力など`JavaScript`と変わることはありません。
ですが`TypeScript`には静的型付け機能を搭載しているという特徴があります。

静的型付けとは、ソースコード内の値やオブジェクトの型をコンパイル時に解析し、安全性が保たれているかを検証するシステム・方法のことです。
`JavaScript`では明確に型を指定する必要がないため、コード内で型の違う値を誤って操作している場合は実行時にそのエラーが判明することがあります。
`TypeScript`はそれらのエラーはコンパイル時に判明するためバグの早期発見に繋がります。
バグの早期発見は開発コストを下げることにつながります。

`TypeScript`のコンパイラは今回使う`Next.js`に標準でインストールされるので気にする機会は少ないです。

### 🎢 `React.js`と`Next.js`

`React.js`は、インタラクティブなユーザーインタフェースを構築するためのJavaScriptライブラリです。
ライブラリなので便利な機能が揃っていますが、どこでどのように使うのかは開発者に委ねられています。

`Next.js`は、Webアプリケーションを作成するための`React.js`フレームワークです。
フレームワークとは、`React.js`に必要なツールや設定を`Next.js`が行い、
アプリケーションに追加の構造、機能、最適化を提供することを意味します。
`Next.js`が設定とアプリ構成の多くを処理し、`React.js`アプリケーションの構築を支援する追加機能を備えていることです。

今回は`Next.js`の大きな特徴であるサーバーサイドでのレンダリングなどについては触れませんが、
`Next.js`を使用した開発を知るきっかけになればと思います。

本セクションでは1つずつコードを作成してきますが、
これらを体系的に学びたい方のためにいくつか参考リンクを載せておきます。

- [サバイバル TypeScript](https://typescriptbook.jp/overview)
- [React 導入](https://ja.reactjs.org/tutorial/tutorial.html)
- [React Docs BETA](https://beta.reactjs.org/learn)
- [Next.js チュートリアル](https://nextjs.org/learn/foundations/about-nextjs)

### 🛠️ 　フロントエンドのセットアップをしよう

`packages`ディレクトリに移動し、以下のコードを実行して下さい。

```
yarn create next-app client --ts
```

ここでは`create-next-app`というパッケージを利用して`client`という名前のプロジェクトを作成しました。
`--ts`は`typescript`を使用することを指定しています。
`client`ディレクトリには`Next.js`を使ったプロジェクト開発に最低限必要なものがあらかじめ作成されます。

ターミナル上で`AVAX-Messenger/`直下にいることを確認して、下記を実行しましょう。

```
yarn client dev
```

あなたのお使いのブラウザで
`http://localhost:3000`
へアクセスするとWebサイトのフロントエンドが表示されるはずです。

⚠️ 本手順では`Chromeブラウザ`を使用しておりますので、何か不具合が生じた場合はブラウザを合わせるのも1つの解決策かもしれません。

例)ローカル環境で表示されているWebサイト

![](/public/images/AVAX-Messenger/section-2/2_1_1.png)

上記のような形でフロントエンドが確認できれば成功です。

これからフロントエンドの表示を確認する際は、`AVAX-Messenger/`直下で、`yarn client dev`を実行します。

ターミナルを閉じるときは、以下のコマンドが使えます ✍️

- Mac: `ctrl + c`
- Windows: `ctrl + shift + w`

`client`ディレクトリのフォルダ構造は以下のようになっています。
※`node_modules`は内部ファイルの表示を省略しています。

```
client
├── README.md
├── next-env.d.ts
├── next.config.js
├── node_modules
├── package.json
├── pages
│   ├── _app.tsx
│   ├── api
│   │   └── hello.ts
│   └── index.tsx
├── public
│   ├── favicon.ico
│   └── vercel.svg
├── styles
│   ├── Home.module.css
│   └── globals.css
└── tsconfig.json
```

続いて`packages/client`ディレクトリ直下で以下のコマンドを実行して必要なパッケージをインストールしてください。

```
yarn add ethers@5.7.2
yarn add @metamask/providers@9.1.0
```

- `ethers`: スマートコントラクトとの連携に使用します。
- `@metamask/providers`: metamaskとの連携の際にオブジェクトの型を取得するために使用します。

### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discordの`#avalanche`で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の3点を記載してください ✨

```
1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット
```

---

フロントエンドの環境構築が完了したら次のレッスンに進みましょう 🎉
