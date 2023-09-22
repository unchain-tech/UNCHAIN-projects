### 🛠 環境構築をしていこう

まずはアプリの雛形であるソースコードをもとに、ローカル環境を作成します。

まだ`GitHub`のアカウントをお持ちでない方は、[こちら](https://qiita.com/okumurakengo/items/848f7177765cf25fcde0) の手順に沿ってアカウントを作成してください。

`GitHub`のアカウントをお持ちの方は、下記の手順に沿ってフロントエンドの基盤となるリポジトリをあなたのGitHubに[フォーク](https://denno-sekai.com/github-fork/)しましょう。

1\. [こちら](https://github.com/unchain-tech/Solana-Wallet.git)からunchain-tech/Solana-Walletリポジトリにアクセスをして、ページ右上の`Fork`ボタンをクリックします。

![](/public/images/Solana-Wallet/section-0/0_2_2.png)

2\. Create a new forkページが開くので、「Copy the `main` branch only」という項目に**チェックが入っていることを確認します**。

![](/public/images/Solana-Wallet/section-0/0_2_3.png)

3\. 設定が完了したら`Create fork`ボタンをクリックします。あなたのGitHubアカウントに`Solana-Wallet`リポジトリのフォークが作成されたことを確認してください。

それでは、フォークしたリポジトリをローカル環境にクローンしましょう。

`Code`ボタンをクリックして`SSH`を選択し、Gitリンクをコピーしましょう。

![](/public/images/Solana-Wallet/section-0/0_2_4.png)

ターミナルで任意の作業ディレクトリに移動し、先ほどコピーしたリンクを貼り付け、下記を実行してください。

```
git clone コピーした_github_リンク
```

ターミナル上で`Solana-Wallet`に移動して下記を実行しましょう。

```
npm install
```

`npm`コマンドを実行することで、 `JavaScript`ライブラリのインストールが行われます。

次に、下記を実行してみましょう。

```
npm run dev
```

あなたのローカル環境で、Webサイトのフロントエンドが立ち上がりましたか？

**ローカル環境で表示されている Web サイト**

![](/public/images/Solana-Wallet/section-0/0_2_1.png)

上記のような形でフロントエンドが確認できれば成功です。

これからフロントエンドの表示を確認したい時は、ターミナルに向かい、`Solana-Wallet`ディレクトリ上で、`npm run dev`を実行します。これからも必要となる作業ですので、よく覚えておいてください。

ターミナルを閉じるときは、以下のコマンドが使えます ✍️

- Mac: `ctrl + c`
- Windows: `ctrl + shift + w`

### 🎁 雛形のソースコードについて

雛形ではすでに [`@solana/web3.js`](https://solana-labs.github.io/solana-web3.js/index.html) というライブラリがインストールされるようになっています。 この`Javascript`で記述されたライブラリは、 `Solana`のプログラムと対話するプログラムを書くのに役立ちます。

また [`Tailwind CSS`](https://tailwindcss.com/) というUtility Firstを掲げて設計されたCSSフレームワークも導入しています。

これからウォレット開発を進めていく上で変更されるファイルは以下になります。

- `pages/index.js`および`components/各コンポーネント/index.js`: メインで変更を加えていくファイル
- `package.json`および`package-lock.json`: ライブラリを新しく追加した際に変更されるファイル

### ✅ テストスクリプトについて

このプロジェクトには、各コンポーネントのテストスクリプトが`components/各コンポーネント/index.test.js`として格納されています。これらは、期待するMVPの機能が実装されているかをテストする内容となっており、テストフレームワークとして[Jest](https://jestjs.io/ja/)を、UIコンポーネントのテストを行うために[Testing Library](https://testing-library.com/)を導入しています。Solanaネットワークとやり取りを行う機能をモック（模擬）しているため、ブラウザ上で実際に動作確認を行うよりもより迅速に機能テストを行うことが可能です。ただし、あくまでも模擬的なので、各コンポーネントの実装ができたら実際にSolanaネットワークを使用した動作確認をブラウザ上で行いましょう！

### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discordの`#solana`で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の3点を記載してください ✨

```
1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット
```
---

ターミナルで`npm run dev`を実行した出力結果をDiscordの`#solana`にシェアしてください!✨ 他の人たちとアウトプットが一致しているか確認したら、次のレッスンに進みましょう!
