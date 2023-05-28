このセクションの全体像は次のとおりです。

- ベースとなる`dappプロジェクト`を作成する
- バイクを管理するコントラクトを作成する
- フロントエンドからコントラクトにアクセスする

### 🥮 `dappプロジェクト`を作成しよう

`create-near-app`というパッケージを利用して、ベースとなる`dappプロジェクト`を作成することができます。

あなたの作業したいディレクトリへ移動して以下のコマンドを実行しましょう！

> - フロントエンド作成に`react`、コントラクト作成 に`rust`を使用することを明示してます
> - 本手順作成時点での安定版`3.1.0`バージョンを利用しています。
> - プロジェクト名はお好きな名前で良いですが、ここでは`near_bike_share_dapp`として進めていきます 🚀

```
$ npx create-near-app@3.1.0 --frontend=react --contract=rust near_bike_share_dapp
```

実行後、必要なパッケージのインストール許可を求められるのでenterを押します。
成功すると以下のような表示がされます。

![](/public/images/NEAR-BikeShare/section-2/2_1_1.png)

作成したリポジトリへ移動し、`yarn dev`を実行しましょう！

> `yarn`をお持ちでない方は以下のコマンドでインストールしてください。
>
> ```
> $ npm install -g yarn
> ```
>
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

しばらく待つとあなたのローカル環境で、Webサイトのフロントエンドが立ち上がりましたか？

ローカル環境で表示されているWebサイト。

![](/public/images/NEAR-BikeShare/section-2/2_1_2.png)

サインインボタンを押して、既存のアカウントでサインインしてみましょう。

![](/public/images/NEAR-BikeShare/section-2/2_1_3.png)

接続完了したらこのようなサイトが表示されるはずです。

![](/public/images/NEAR-BikeShare/section-2/2_1_4.png)

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
それぞれフロントエンドを構成するコードのファイル、コントラクトを構成するコードのファイルが入っています。

### 🐊 `github`にソースコードをアップロードしよう

本プロジェクトの最後では、アプリをデプロイするために`github`へソースコードをアップロードする必要があります。

**near_bike_share_dapp**全体を対象としてアップロードしましょう。

今後の開発にも役に立つと思いますので、今のうちに以下にアップロード方法をおさらいしておきます。

`GitHub`のアカウントをお持ちでない方は,[こちら](https://qiita.com/okumurakengo/items/848f7177765cf25fcde0) の手順に沿ってアカウントを作成してください。

`GitHub`へソースコードをアップロードをしたことがない方は以下を参考にしてください。

[新しいレポジトリを作成](https://docs.github.com/ja/get-started/quickstart/create-a-repo)（リポジトリ名などはご自由に）した後、 
手順に従いターミナルからアップロードを済ませます。  
以下ターミナルで実行するコマンドの参考です。(`near_bike_share_dapp`直下で実行することを想定しております)

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

ここまでの作業で何かわからないことがある場合は、Discordの`#near`で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の3点を記載してください ✨

```
1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット
```

---

ブラウザでの確認ができたら次のレッスンでコントラクトを書いていきましょう 🎉
