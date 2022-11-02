### 🍽 フロントエンドを作成しよう

このセクションでは, スマートコントラクトと連携するフロントエンドを構築します。

今回は`typescript` + `React` + `Next.js`を使ってフロントエンド開発を進めていきます。

- `typescript`: プログラミング言語
- `React.js`: ライブラリ
- `Next.js`: `React.js`のフレームワーク

それぞれの概要については[こちら](https://app.unchain.tech/learn/AVAX-messenger/section-2_lesson-1)に説明を載せていますので,  
初めて触れる方はご参照ください 💁

### 🛠️ 　フロントエンドのセットアップをしよう

プロジェクトのルートディレクトリである`Avalanche-AMM`ディレクトリに移動し,以下のコードを実行して下さい。

```
npx create-next-app client --ts --use-npm
```

ここでは`create-next-app`というパッケージを利用して`client`という名前のプロジェクトを作成しました。  
`--ts`は`typescript`を使用することの指定, `--use-npm`は`npm`を使用してアプリの立ち上げを行うこと指定しています。  
`client`ディレクトリには`Next.js`を使ったプロジェクト開発に最低限必要なものがあらかじめ作成されます。

この段階で,フォルダ構造は下記のようになっているはずです。

```
Avalanche-AMM
   |_ client
   |_ contract
```

ターミナル上で`client`に移動して下記を実行しましょう。

```
cd client
npm run dev
```

あなたのお使いのブラウザで  
`http://localhost:3000`
へアクセスするとWebサイトのフロントエンドが表示されるはずです。

⚠️ 本手順では`Chromeブラウザ`を使用しておりますので, 何か不具合が生じた場合はブラウザを合わせるのも1つの解決策かもしれません。

例)ローカル環境で表示されているWebサイト

![](/public/images/AVAX-amm/section-3/3_1_1.png)

上記のような形でフロントエンドが確認できれば成功です。

これからフロントエンドの表示を確認する際は,`client`ディレクトリ上で,`npm run dev`を実行します。

webサイトの立ち上げを終了する場合は以下のコマンドが使えます ✍️

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

続いて`client`ディレクトリ直下で以下のコマンドを実行して必要なパッケージをインストールしてください。

```
npm install ethers @metamask/providers react-icons
```

- `ethers`: スマートコントラクトとの連携に使用します。
- `@metamask/providers`: metamaskとの連携の際にオブジェクトの型を取得するために使用します。
- `react-icons`: reactが用意するアイコンを使用できます。

### 🐊 `github`にソースコードをアップロードしよう

本プロジェクトの最後では, アプリをデプロイするために`github`へソースコードをアップロードする必要があります。  
今後の開発にも役に立つと思いますので, 今のうちにアップロード方法をおさらいしておきましょう。

GitHubのアカウントをお持ちでない方は,[こちら](https://qiita.com/okumurakengo/items/848f7177765cf25fcde0) の手順に沿ってアカウントを作成してください。

GitHubへアップロードをしたことがない方は以下を参考にしてください。

[新しいレポジトリを作成](https://docs.github.com/ja/get-started/quickstart/create-a-repo) (リポジトリ名などはご自由に)した後,  
手順に従いターミナルからアップロードを済ませます。  
以下ターミナルで実行するコマンドの参考です。(`client`直下で実行することを想定しております)

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

### 🦊 MetaMask をダウンロードする

あなたのwebアプリケーションと接続するウォレットをダウンロードしましょう。

このプロジェクトではMetaMaskを使用します。

> 📓 [Core](https://support.avax.network/en/collections/3391518-core) ウォレット について  
> Ava Labs(Avalanche エコシステムの開発チーム) がサポートしている Core というウォレットが存在します。  
> Core でのウォレットを使用すると Avalanche に適した処理により, 高速なトランザクションが実現する可能性があります。  
> 現在は beta 版ということもありバグや仕様変更が日々改善されているため, ここでは使用しませんが注目なウォレットです。

- [こちら](https://MetaMask.io/download.html) からブラウザの拡張機能をダウンロードし,MetaMaskウォレットをあなたのブラウザに設定します。

> ✍️: MetaMask が必要な理由
> ユーザーが,スマートコントラクトを呼び出すとき,本人のアドレスと秘密鍵を備えたウォレットが必要となります。
> これは,認証作業のようなものです。

MetaMaskを設定できたら, Avalancheのテストネットワークを追加しましょう。

MetaMaskの上部のネットワークタブを開き, `Add Network`をクリックします。

![](/public/images/AVAX-amm/section-3/3_1_2.png)

開いた設定ページ内で以下の情報を入力して保存をクリックしましょう。

```
Network Name: Avalanche FUJI C-Chain
New RPC URL: https://api.avax-test.network/ext/bc/C/rpc
ChainID: 43113
Symbol: AVAX
Explorer: https://testnet.snowtrace.io/
```

![](/public/images/AVAX-amm/section-3/3_1_3.png)

登録が成功したらAvalancheのテストネットである`Avalanche Fuji C-Chain`が選択できるはずです。

![](/public/images/AVAX-amm/section-3/3_1_4.png)

### 🚰 `Faucet`を利用して`AVAX`をもらう

続いて, [Avalanche Faucet](https://faucet.avax.network/)で`AVAX`を取得します。

テストネットでのみ使用できる偽の`AVAX`です。

上記リンクへ移動して, あなたのウォレットのアドレスを入力してavaxを受け取ってください。  
💁 アドレスはMetaMask上部のアカウント名の部分をクリックするとコピーができます。

### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は,Discordの`#avax-amm`で質問をしてください。

ヘルプをするときのフローが円滑になるので,エラーレポートには下記の3点を記載してください ✨

```
1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット
```

---

フロントエンドの環境構築が完了したら次のレッスンに進みましょう 🎉
