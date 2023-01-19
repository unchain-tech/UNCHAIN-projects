### 🍽 フロントエンドを作成しよう

このセクションでは, スマートコントラクトと連携するフロントエンドを構築します。

今回は`typescript` + `React` + `Next.js`を使ってフロントエンド開発を進めていきます。

- `typescript`: プログラミング言語
- `React.js`: ライブラリ
- `Next.js`: `React.js`のフレームワーク

それぞれの概要については[LEARNコンテンツ](https://app.unchain.tech/learn)内の`AVAX-Messenger/section2/lesson1`説明を載せていますので, 初めて触れる方はご参照ください 💁

### 🛠️ 　フロントエンドのセットアップをしよう

プロジェクトのルートディレクトリである`AVAX-AssetTokenization`ディレクトリに移動し,以下のコードを実行して下さい。

```
npx create-next-app client --ts --use-npm
```

ここでは`create-next-app`というパッケージを利用して`client`という名前のプロジェクトを作成しました。  
`--ts`は`typescript`を使用することの指定, `--use-npm`は`npm`を使用してアプリの立ち上げを行うこと指定しています。  
`client`ディレクトリには`Next.js`を使ったプロジェクト開発に最低限必要なものがあらかじめ作成されます。

この段階で, フォルダ構造は下記のようになっているはずです。

```
AVAX-AssetTokenization
   |_ client
   |_ contract
```

ターミナル上で`client`に移動して下記を実行しましょう。

```
cd client
npm run dev
```

あなたのお使いのブラウザで`http://localhost:3000`へアクセスするとWebサイトのフロントエンドが表示されるはずです。

⚠️ 本手順では`Chromeブラウザ`を使用しておりますので, 何か不具合が生じた場合はブラウザを合わせるのも1つの解決策かもしれません。

例)ローカル環境で表示されているWebサイト

![](/public/images/AVAX-AssetTokenization/section-2/3_1_1.png)

上記のような形でフロントエンドが確認できれば成功です。

これからフロントエンドの表示を確認する際は,`client`ディレクトリ上で,`npm run dev`を実行します。

Webサイトの立ち上げを終了する場合は以下のコマンドが使えます ✍️

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

### 🦊 MetaMask をダウンロードする

あなたのWebアプリケーションと接続するウォレットをダウンロードしましょう。

このプロジェクトではMetaMaskを使用します。

> 📓 [Core](https://support.avax.network/en/collections/3391518-core) ウォレット について  
> Ava Labs(Avalanche エコシステムの開発チーム) がサポートしている Core というウォレットが存在します。  
> Core でのウォレットを使用すると Avalanche に適した処理により, 高速なトランザクションが実現する可能性があります。  
> 現在は beta 版ということもありバグや仕様変更が日々改善されているため, ここでは使用しませんが注目なウォレットです。

- [こちら](https://MetaMask.io/download.html) からブラウザの拡張機能をダウンロードし, MetaMaskウォレットをあなたのブラウザに設定します。

> ✍️: MetaMask が必要な理由
> ユーザーが,スマートコントラクトを呼び出すとき,本人のアドレスと秘密鍵を備えたウォレットが必要となります。
> これは,認証作業のようなものです。

MetaMaskを設定できたら, Avalancheのテストネットワークを追加しましょう。

MetaMaskの上部のネットワークタブを開き, `Add Network`をクリックします。

![](/public/images/AVAX-AssetTokenization/section-2/3_1_2.png)

開いた設定ページ内で以下の情報を入力して保存をクリックしましょう。

```
Network Name: Avalanche FUJI C-Chain
New RPC URL: https://api.avax-test.network/ext/bc/C/rpc
ChainID: 43113
Symbol: AVAX
Explorer: https://testnet.snowtrace.io/
```

![](/public/images/AVAX-AssetTokenization/section-2/3_1_3.png)

登録が成功したらAvalancheのテストネットである`Avalanche Fuji C-Chain`が選択できるはずです。

![](/public/images/AVAX-AssetTokenization/section-2/3_1_4.png)

### 🚰 `Faucet`を利用して`AVAX`をもらう

続いて, [Avalanche Faucet](https://faucet.avax.network/)で`AVAX`を取得します。

テストネットでのみ使用できる偽の`AVAX`です。

上記リンクへ移動して, あなたのウォレットのアドレスを入力してAVAXを受け取ってください。  
💁 アドレスはMetaMask上部のアカウント名の部分をクリックするとコピーができます。

### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は, Discordの`#avax-asset-tokenization`で質問をしてください。

ヘルプをするときのフローが円滑になるので, エラーレポートには下記の3点を記載してください ✨

```
1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット
```

---

フロントエンドの環境構築が完了したら次のレッスンに進みましょう 🎉
