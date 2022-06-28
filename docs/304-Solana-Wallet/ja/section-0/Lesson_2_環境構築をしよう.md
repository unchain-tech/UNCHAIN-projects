### 🛠 環境構築をしていこう

まずはアプリの雛形であるソースコードをもとに、ローカル環境を作成します。

まだ `GitHub` のアカウントをお持ちでない方は、[こちら](https://qiita.com/okumurakengo/items/848f7177765cf25fcde0) の手順に沿ってアカウントを作成してください。

`GitHub` のアカウントをお持ちの方は、[こちら](https://github.com/unchain-dev/solana-wallet-starter-project) から、フロントエンドの基盤となるリポジトリをあなたの `GitHub` にフォークしましょう。フォークの方法は、[こちら](https://denno-sekai.com/github-fork/) を参照してください。

あなたの `GitHub` アカウントにフォークした `solana-wallet-starter-frontend` リポジトリを、ローカル環境にクローンしてください。

`Code` ボタンをクリックして `SSH` を選択し、Git リンクをコピーしましょう。

ターミナルで任意の作業ディレクトリに移動し、先ほどコピーしたリンクを貼り付け、下記を実行してください。

```bash
git clone コピーした_github_リンク
```

ターミナル上で `solana-wallet-starter-frontend` に移動して下記を実行しましょう。

```bash
npm install
```

`npm` コマンドを実行することで、 `JavaScript` ライブラリのインストールが行われます。

次に、下記を実行してみましょう。

```bash
npm run dev
```

あなたのローカル環境で、Web サイトのフロントエンドが立ち上がりましたか？

**ローカル環境で表示されている Web サイト**

![](/public/images/304-Solana-Wallet/0_2_1.png)

上記のような形でフロントエンドが確認できれば成功です。

これからフロントエンドの表示を確認したい時は、ターミナルに向かい、`solana-wallet-starter-frontend` ディレクトリ上で、`npm run dev` を実行します。これからも必要となる作業ですので、よく覚えておいてください。

ターミナルを閉じるときは、以下のコマンドが使えます ✍️

- Mac: `ctrl + c`
- Windows: `ctrl + shift + w`

### 🎁 雛形のソースコードについて

雛形ではすでに [`@solana/web3.js`](https://solana-labs.github.io/solana-web3.js/index.html) というライブラリがインストールされるようになっています。 これは `Javascript` で書かれたライブラリで、 `Solana` のプログラムと対話するプログラムを書くのに役立ちます。

また [`Tailwind CSS`](https://tailwindcss.com/) というUtility Firstを掲げて設計されたCSSフレームワークも導入しています。

これからウォレット開発を進めていく上で変更されるファイルは以下の３つのみになります。

- `pages/index.js` メインで変更を加えていくファイル
- `package.json` および `package-lock.json` ライブラリを新しく追加した際に変更されるファイル
### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discord の `#section-1` で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の 3 点を記載してください ✨

```
1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット
```
---

ターミナルで `npm run dev` を実行した出力結果を Discord の `#section-1` にシェアしてください!✨ 他の人たちとアウトプットが一致しているか確認したら、次のレッスンに進みましょう!
