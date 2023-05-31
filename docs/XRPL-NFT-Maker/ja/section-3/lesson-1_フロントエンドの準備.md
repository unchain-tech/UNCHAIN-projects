### 💻 Webアプリケーションを設定する

このセクションでは、Webサイトの構築を通して、WebアプリとXummの連携方法について学びます。

実装は下記をイメージしてください。

Webアプリ（フロントエンド）↔︎ Xumm（ウォレット）↔︎ XRP Ledger（バックエンド）

それでは、始めましょう 🚀

### 🍽 Git リポジトリをあなたの GitHub にフォークする

まだGitHubのアカウントをお持ちでない方は、[こちら](https://qiita.com/okumurakengo/items/848f7177765cf25fcde0) の手順に沿ってアカウントを作成してください。

GitHubのアカウントをお持ちの方は、下記の手順に沿ってプロジェクトの基盤となるリポジトリをあなたのGitHubに[フォーク](https://denno-sekai.com/github-fork/)しましょう。

1\. [こちら](https://github.com/unchain-tech/XRPL-NFT-Maker)からunchain-tech/XRPL-NFT-Makerリポジトリにアクセスをして、ページ右上の`Fork`ボタンをクリックします。

![](/public/images/XRPL-NFT-Maker/section-3/3_1_2.png)

2\. Create a new forkページが開くので、「Copy the `main` branch only」という項目に**チェックが入っていることを確認します**。

![](/public/images/XRPL-NFT-Maker/section-3/3_1_3.png)

3\. 設定が完了したら`Create fork`ボタンをクリックします。あなたのGitHubアカウントに`XRPL-NFT-Maker`リポジトリのフォークが作成されたことを確認してください。

それでは、フォークしたリポジトリをローカル環境にクローンしましょう。

まず、下図のように、`Code`ボタンをクリックして`SSH`を選択し、Gitリンクをコピーしましょう。

![](/public/images/XRPL-NFT-Maker/section-3/3_1_4.png)

ターミナルで任意のディレクトリに移動し、先ほどコピーしたリンクを貼り付け、下記を実行してください。

```bash
git clone コピーした_github_リンク
```

ターミナル上で`XRPL-NFT-Maker`に移動して下記を実行しましょう。

```bash
npm install
```

`npm`コマンドを実行することで、JavaScriptライブラリのインストールが行われます。

次に、下記を実行してみましょう。

```bash
npm start
```

次のような形でフロントエンドが確認できれば成功です。

例)ローカル環境で表示されているWebサイト
![](/public/images/XRPL-NFT-Maker/section-3/3_1_1.png)


これからフロントエンドの表示を確認したい時は、`XRPL-NFT-Maker`ディレクトリ上で、`npm start`を実行します。これからも必要となる作業ですので、よく覚えておいてください。

ターミナルを閉じるときは、以下のコマンドが使えます ✍️

- Mac: `ctrl + c`
- Windows: `ctrl + shift + w`


### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discordの`#xrpl`で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の3点を記載してください ✨

```
1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット
```
