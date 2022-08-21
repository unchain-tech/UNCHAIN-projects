このセクションの全体像は次のとおりです。

- ベースとなる`dappプロジェクト`を作成する
- バイクを管理するコントラクトを作成する
- フロントエンドからコントラクトにアクセスする

### 🥮 `dappプロジェクト`を作成しよう

`create-near-app`という`npm`パッケージを利用して, ベースとなる`dappプロジェクト`を作成することができます。  
あなたの作業したいディレクトリへ移動して以下のコマンドを実行しましょう！  
(フロントエンド作成に `react`, コントラクト作成 に `rust` を使用することを明示してます。)  
プロジェクト名はお好きな名前で良いですが, ここでは`near_bike_share_dapp`として進めていきます 🚀

```
$ npx create-near-app@3.1.0 --frontend=react --contract=rust near_bike_share_dapp
```

実行後, 必要なパッケージのインストール許可を求められるので enter を押します。  
成功すると以下のような表示がされます。
![](/public/images/403-NEAR-Sharing-Economy/section-2/2_1_1.png)

作成したレポジトリへ移動し, `yarn dev`を実行しましょう！

> `yarn`をお持ちでない方は`npm run dev`で進めるか, 
> 
> ```
> $ npm install -g yarn
> ```
> 
> で`yarn`を取得後再実行してください。  
> 実行環境のバージョンは以下です。
>
> ```
> $ yarn -v
> 1.22.19
> ```

```
$ cd near_bike_share_dapp
$ yarn dev
```

しばらく待つとあなたのローカル環境で、Web サイトのフロントエンドが立ち上がりましたか？

ローカル環境で表示されている Web サイト。  
![](/public/images/403-NEAR-Sharing-Economy/section-2/2_1_2.png)

サインインボタンを押して, 既存のアカウントでサインインしてみましょう。  
![](/public/images/403-NEAR-Sharing-Economy/section-2/2_1_3.png)

接続完了したらこのようなサイトが表示されるはずです。  
![](/public/images/403-NEAR-Sharing-Economy/section-2/2_1_4.png)

上記のような形でフロントエンドが確認できれば成功です。

終了する時はターミナルで以下のコマンドが使えます。

- Mac: `ctrl + c`
- Windows: `ctrl + shift + w`

最後に作成した`near_bike_share_dapp`のフォルダ構成を確認しましょう。  
ディレクトリには末尾に`/`をつけて表示しています。

```
near_bike_share_dapp/
├── README.md
├── ava.config.cjs
├── contract/
├── dist/
├── frontend/
├── integration-tests/
├── neardev/
├── node_modules/
├── out/
├── package.json
└── yarn.lock
```

`frontend`と`contract`ディレクトリが見えるでしょうか。  
それぞれフロントエンドを構成するコードのファイル, コントラクトを構成するコードのファイルが入っています。

### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discord の `#section-2` で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の 3 点を記載してください ✨

```
1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット
```

---

ブラウザでの確認ができたら次のレッスンでコントラクトを書いていきましょう 🎉
