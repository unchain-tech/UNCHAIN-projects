### 💻 クライアントを設定する

このセクションでは、Web サイトの構築を通して、クライアントとスマートコントラクトの連携方法について学びます。

実装は下記をイメージしてください。

- クライアント＝フロントエンド

- スマートコントラクト＝バックエンド

それでは、始めましょう 🚀

### 🍽 Git リポジトリをあなたの GitHub にフォークする

まだ GitHub のアカウントをお持ちでない方は、[こちら](https://qiita.com/okumurakengo/items/848f7177765cf25fcde0) の手順に沿ってアカウントを作成してください。

GitHub のアカウントをお持ちの方は、[こちら](https://github.com/shiftbase-xyz/nft-collection-starter-project) から、フロントエンドの基盤となるリポジトリをあなたの GitHub にフォークしましょう。フォークの方法は、[こちら](https://denno-sekai.com/github-fork/) を参照してください。

あなたの GitHub アカウントにフォークした `nft-collection-starter-project` リポジトリを、ローカル環境にクローンしてください。

まず、下図のように、`Code` ボタンをクリックして `SSH` を選択し、Git リンクをコピーしましょう。

![](/public/images/ETH-NFT-Collection/section-3/3_1_1.png)

ターミナルで先ほど作成した `ETH-NFT-collection` ディレクトリに移動し、先ほどコピーしたリンクを貼り付け、下記を実行してください。

```bash
git clone コピーした_github_リンク
```

この段階で、フォルダ構造は下記のようになっているはずです。

```
ETH-NFT-collection
	|_ epic-nfts
	|_ nft-collection-starter-project
```

ターミナル上で `nft-collection-starter-project` に移動して下記を実行しましょう。

```bash
npm install
```

`npm` コマンドを実行することで、JavaScript ライブラリのインストールが行われます。

次に、下記を実行してみましょう。

```bash
npm run start
```

あなたのローカル環境で、Web サイトのフロントエンドが立ち上がりましたか？

例）ローカル環境で表示されている Web サイト

![](/public/images/ETH-NFT-Collection/section-3/3_1_2.png)

上記のような形でフロントエンドが確認できれば成功です。

これからフロントエンドの表示を確認したい時は、ターミナルに向かい、`nft-collection-starter-project` ディレクトリ上で、`npm run start` を実行します。これからも必要となる作業ですので、よく覚えておいてください。

ターミナルを閉じるときは、以下のコマンドが使えます ✍️

- Mac: `ctrl + c`
- Windows: `ctrl + shift + w`

### 🦊 MetaMask をダウンロードする

次に、イーサリアムウォレットをダウンロードしましょう。

このプロジェクトでは MetaMask を使用します。

- [こちら](https://MetaMask.io/download.html) からブラウザの拡張機能をダウンロードし、MetaMask ウォレットをあなたのブラウザに設定します。

すでに別のウォレットをお持ちの場合でも、今回は MetaMask を使用してください。

> ✍️: MetaMask が必要な理由
> ユーザーが、スマートコントラクトを呼び出すとき、イーサリアムアドレスと秘密鍵を備えたウォレットが必要となります。
>
> - これは、認証作業のようなものです。

### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discord の `#eth-nft-collection` で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の 3 点を記載してください ✨

```
1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット
```

---

MetaMask のダウンロードが完了したら次のレッスンに進みましょう 🎉
