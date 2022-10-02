### 🍽 フロントエンドを作成しよう

このセクションでは,Web サイトの構築を通して,フロントエンドがスマートコントラクトとどのように関連するのかを学びます。

今回は`typescript` + `React` + `Next.js`を使ってフロントエンド開発を進めていきます。

- `typescript`: プログラミング言語
- `React.js`: ライブラリ
- `Next.js`: `React.js`のフレームワーク

### 🏙️ `Typescript`

`TypeScript` は Microsoft が中心となって開発を進めているオープンソースのプログラミング言語です。

`TypeScript` のコードはコンパイルにより `JavaScript` のコードに変換されてから実行されます。  
最終的には `JavaScript` のコードとなるので, 処理能力など `JavaScript` と変わることはありません。  
ですが `TypeScript` には静的型付け機能を搭載しているという特徴があります。

静的型付けとは, ソースコード内の値やオブジェクトの型をコンパイル時に解析し, 安全性が保たれているかを検証するシステム・方法のことです。  
`JavaScript` では明確に型を指定する必要がないため, コード内で型の違う値を誤って操作している場合は実行時にそのエラーが判明することがあります。  
`TypeScript` はそれらのエラーはコンパイル時に判明するためバグの早期発見に繋がります。  
バグの早期発見は開発コストを下げることにつながります。

`TypeScript` のコンパイラは今回使う `Next.js` を使用する上で標準でインストールや実行がされるので気にする機会は少ないです。

### 🎢 `React.js` と `Next.js`

`React.js` は,インタラクティブなユーザーインターフェイスを構築するための JavaScript ライブラリです。  
ライブラリなので便利な機能が揃っていますが, どこでどのように使うのかは開発者に委ねられています。

`Next.js` は, Web アプリケーションを作成するための `React.js` フレームワークです。  
フレームワークとは, `React.js` に必要なツールや設定を `Next.js` が行い,  
アプリケーションに追加の構造, 機能, 最適化を提供することを意味します。  
`Next.js` が設定とアプリ構成の多くを処理し,`React.js` アプリケーションの構築を支援する追加機能を備えていることです。

今回は `Next.js` の大きな特徴であるサーバーサイドでのレンダリングなどについては触れませんが,  
`Next.js` を使用した開発を知るきっかけになればと思います。

本セクションでは一つずつコードを作成してきますが,  
これらを体系的に学びたい方のためにいくつか参考リンクを載せておきます。

- [サバイバル TypeScript](https://typescriptbook.jp/overview)
- [React 導入](https://ja.reactjs.org/tutorial/tutorial.html)
- [React Docs BETA](https://beta.reactjs.org/learn)
- [Next.js チュートリアル](https://nextjs.org/learn/foundations/about-nextjs)

### 🛠️ 　フロントエンドのセットアップをしよう

プロジェクトのルートディレクトリである`Avalanche-dApp` ディレクトリに移動し,以下のコードを実行して下さい。

```
$ npx create-next-app messenger-client  --ts --use-npm
```

ここでは`create-next-app`というパッケージを利用して`messenger-client`という名前のプロジェクトを作成しました。  
`--ts`は`typescript`を使用することの指定, `--use-npm`は`npm`を使用してアプリの立ち上げを行うこと指定しています。  
`messenger-client`ディレクトリには`Next.js`を使ったプロジェクト開発に最低限必要なものがあらかじめ作成されます。

この段階で,フォルダ構造は下記のようになっているはずです。

```
Avalanche-dApp
   |_ messenger-client
   |_ messenger-contract
```

ターミナル上で `messenger-client` に移動して下記を実行しましょう。

```bash
$ cd messenger-client
$ npm run dev
```

あなたのお使いのブラウザで  
`http://localhost:3000`
へアクセスすると Web サイトのフロントエンドが表示されるはずです。

⚠️ 本手順では`Chromeブラウザ`を使用しておりますので, 何か不具合が生じた場合はブラウザを合わせるのも一つの解決策かもしれません。

例）ローカル環境で表示されている Web サイト

![](/public/images/AVAX-messenger/section-2/2_1_1.png)

上記のような形でフロントエンドが確認できれば成功です。

これからフロントエンドの表示を確認する際は,`messenger-client` ディレクトリ上で,`npm run dev` を実行します。

ターミナルを閉じるときは,以下のコマンドが使えます ✍️

- Mac: `ctrl + c`
- Windows: `ctrl + shift + w`

`messenger-client`ディレクトリのフォルダ構造は以下のようになっています。  
※`node_modules`は内部ファイルの表示を省略しています。

```
messenger-client
├── README.md
├── next-env.d.ts
├── next.config.js
├── node_modules
├── package-lock.json
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

続いて`messenger-client`ディレクトリ直下で以下のコマンドを実行して必要なパッケージをインストールしてください。

```
$ npm install ethers
$ npm install @metamask/providers
```

- `ethers`: スマートコントラクトとの連携に使用します。
- `@metamask/providers`: metamask との連携の際にオブジェクトの型を取得するために使用します。

### 🐊 `github` にソースコードをアップロードしよう

本プロジェクトの最後では, アプリをデプロイするために `github` へソースコードをアップロードする必要があります。  
今後の開発にも役に立つと思いますので, 今のうちにアップロード方法をおさらいしておきましょう。

GitHub のアカウントをお持ちでない方は,[こちら](https://qiita.com/okumurakengo/items/848f7177765cf25fcde0) の手順に沿ってアカウントを作成してください。

GitHub へアップロードをしたことがない方は以下を参考にしてください。

[新しいレポジトリを作成](https://docs.github.com/ja/get-started/quickstart/create-a-repo) (レポジトリ名などはご自由に)した後,  
手順に従いターミナルからアップロードを済ませます。  
以下ターミナルで実行するコマンドの参考です。(`messenger-client`直下で実行することを想定しております)

```
$ git init
$ git add .
$ git commit -m "first commit"
$ git branch -M main
$ git remote add origin [作成したレポジトリの SSH URL]
$ git push -u origin main
```

> ✍️: SSH の設定を行う
>
> Github のレポジトリをクローン・プッシュする際に,SSHKey を作成し,GitHub に公開鍵を登録する必要があります。
>
> SSH（Secure SHell）はネットワークを経由してマシンを遠隔操作する仕組みのことで,通信が暗号化されているのが特徴的です。
>
> 主にクライアント（ローカル）からサーバー（リモート）に接続をするときに使われます。この SSH の暗号化について,仕組みを見ていく上で重要になるのが秘密鍵と公開鍵です。
>
> まずはクライアントのマシンで秘密鍵と公開鍵を作り,公開鍵をサーバーに渡します。そしてサーバー側で「この公開鍵はこのユーザー」というように,紐付けを行っていきます。
>
> 自分で管理して必ず見せてはいけない秘密鍵と,サーバーに渡して見せても良い公開鍵の 2 つが SSH の通信では重要になってきます。
> Github における SSH の設定は,[こちら](https://docs.github.com/ja/authentication/connecting-to-github-with-ssh) を参照してください!

### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は,Discord の `#messenger-dapp` で質問をしてください。

ヘルプをするときのフローが円滑になるので,エラーレポートには下記の 3 点を記載してください ✨

```
1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット
```

---

フロントエンドの環境構築が完了したら次のレッスンに進みましょう 🎉
