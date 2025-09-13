---
title: プロジェクトの概要を掴もう
---
### ✨ NEAR Election dApp 開発プロジェクトへようこそ!

このプロジェクトではNEARというチェーン上で投票アプリの作成を行なっていきます！

プロジェクトを進めるには以下の技術が必要です。

- [Terminal 操作](https://qiita.com/ryouzi/items/f9dee1540a04a0bfb9a3)
- [Javascript](https://developer.mozilla.org/ja/docs/Web/JavaScript)
- [React.js](https://ja.reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Rust](https://www.rust-lang.org/)

### 🧐 NEAR とは何か？

NEARはブロックチェーンの1つで、Ethereumに取って替わるともいわれています。

特徴としては、独自の`シャーディング技術`によって他のチェーンと比べて低い手数料での取引が可能だったり、トランザクションの完了が素早いという特徴があります。

このシャーディング技術は複数のトランザクションを1つのブロックチェーンで処理するのではなく、「シャード」と呼ばれる単位の複数のチェーンで処理を分散化することで並行処理ができるようにする技術のことです。

また、環境への配慮もされており従来の通貨に比べて約1/1300の電気しか使用しないそうです。

開発者に対する配慮もされています。`Rust`や`AssemblyScript`（JavaScriptっぽい言語）など比較的広く利用されているプログラミング言語を利用して開発が行えるようになっています。

加えて、NEARが公式的に「grant」という`報酬システム`を用意してくれています。NEAR上での面白いアイデアやプロダクトを提出して承認されるとNEARという暗号通貨で報酬をもらえるというものです。詳しくは[こちら](https://near.org/grants/)をご覧ください。

このようにユーザーにも開発者にとっても素晴らしい環境を用意してくれているNEARの世界へ飛び込んでみましょう！

### 🛠 何を開発するのか？

今回開発するものは、ブロックチェーンの大きな特徴の1つである対改ざん性を生かした`投票dApp`です。このdAppでは主に以下の機能を実装します

- 投票券の付与
- 候補者の追加
- 投票
- 投票結果の開示

完成した`投票dApp`は以下のような見た目になります 💪

NEARのwalletと接続することでログインする画面になります！

`Sign in`ボタンを押すことでNEARが用意しているwallet接続画面に移動することでwallet接続してホーム画面に移動します。
![](/images/NEAR-Election-dApp/section-0/0_1_1.png)

追加された候補者情報と、得票数が表示されます。

投票は一人1回できるようになっていてそれぞれの投票者の下にある`vote`ボタンを押すと確認画面が出てきて、指定の候補者に投票することができます。具体的にいうと、NEARが用意しているトランザクション画面に移動してトランザクションを承認することになります。

また、コントラクトをdeployしたウォレットでログインした場合に限り下の画像のような`Close Election`ボタンが表示されることになります。

このボタンを押すことによって投票を締め切ることができます。
![](/images/NEAR-Election-dApp/section-0/0_1_4.jpg)

一番上の入力欄にはIPFSのURIを入れ、その下には候補者の名前を、一番下には政策を入れることになります。

そしてAddボタンを押すと候補者NFTを発行できることになります。
![](/images/NEAR-Election-dApp/section-0/0_1_2.png)

ここには追加する投票者のアドレスを入れることで、そのwalletに投票券を送ることができます。ただし、この操作はコントラクトをdeployした人しかできないようになっています。

![](/images/NEAR-Election-dApp/section-0/0_1_3.png)

### 🌍 プロジェクトをアップグレードする

[UNCHAIN](https://app.shiftbase.xyz) のプロジェクトは [UNCHAIN License](https://github.com/unchain-tech/UNCHAIN-projects/blob/main/LICENSE) により運用されています。

プロジェクトに参加していて、「こうすればもっと分かりやすいのに！」「これは間違っている！」と思ったら、ぜひ`pull request`を送ってください。

GitHubから直接コードを編集して直接`pull request`を送る方法は、[こちら](https://docs.github.com/ja/repositories/working-with-files/managing-files/editing-files#editing-files-in-another-users-repository)を参照してください。

どんなリクエストでも大歓迎です 🎉

また、プロジェクトを自分のGitHubアカウントに`Fork`して、中身を編集してから`pull request`を送ることもできます。

- プロジェクトを`Fork`する方法は、[こちら](https://docs.github.com/ja/get-started/quickstart/fork-a-repo) を参照してください。
- `Fork`から`pull request`を作成する方法は、[こちら](https://docs.github.com/ja/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request-from-a-fork) です。

### ⚡️ `Issue`を作成する

`pull request`送るほどでもないけど、提案を残したい！　と思ったら、[こちら](https://github.com/shiftbase-xyz/UNCHAIN-projects/issues) に`Issue`を作成してみましょう。

`Issue`の作成方法に関しては、[こちら](https://docs.github.com/ja/issues/tracking-your-work-with-issues/creating-an-issue)を参照してください。

`pull request`や`issue`の作成は実際にチームで開発する際、重要な作業になるので、ぜひトライしてみてください。

UNCHAINのプロジェクトをみんなでより良いものにしていきましょう ✨

---

## 環境構築をしよう

### 🏭 環境構築をしよう

このプロジェクトは中級者向けということで、GitHubからある程度出来上がったプロジェクトをcloneするのではなく`1 からプロジェクトを作成`していきます！

スマートコントラクトの作成に使う言語は`Rust`です。比較的低水準の言語でsolidityと比べると注意しないといけない部分が多かったりしますが、その分後々起きるかもしれないバグを予防してくれているのでとても優秀な言語だと言えます。

ではRustでスマートコントラクトを作成するための環境を整えていきましょう。

**Rust のインストール**

まずは下のコマンドをターミナルで実行しRustをインストールしてください

```
$ curl --proto '=https' --tlsv1.2 https://sh.rustup.rs -sSf | sh
```

1. Proceed with installation（default）
2. Customize installation
3. Cancel installation
   このようなメッセージが出てきたら、1のdefaultを選択してください。
   インストールが成功していれば下のようなメッセージが表示されているでしょう

```
Rust is installed now. Great!
```

また、環境変数を設定するために下のコマンドをターミナルで実行させましょう([環境変数とは？](https://wa3.i-3-i.info/word11027.html))

```
source $HOME/.cargo/env
```

```
export PATH="$HOME/.cargo/bin:$PATH"
```

ここまでの設定が完了していることを確認するために下のコマンドをターミナルで実行させましょう

```
$ rustc --version
```

完了していれば以下のような形式のメッセージが表示されるはずです

```
rustc x.y.z (abcabcabc yyyy-mm-dd)
```

次にコンピュータからnearに接続するためのツールである`near-cli`をどのディレクトリでも使えるように下のコマンドを実行することでグローバルにインストールしましょう！

```
npm install -g near-cli
```

これで環境構築は完了です！

ここからはプロジェクトを作成していきます。

まず、`node` / `yarn`を取得する必要があります。お持ちでない場合は、[こちら](https://hardhat.org/tutorial/setting-up-the-environment.html)にアクセスしてください。

`node v16`をインストールすることを推奨しています。

それでは本プロジェクトで使用するフォルダーを作成してきましょう。作業を始めるディレクトリに移動したら、次のコマンドを実行します。

```
mkdir NEAR-Election-dApp
cd NEAR-Election-dApp
yarn init --private -y
```

NEAR-Election-dAppディレクトリ内に、package.jsonファイルが生成されます。

```
NEAR-Election-dApp
 └── package.json
```

それでは、`package.json`ファイルを以下のように更新してください。

```json
{
  "name": "NEAR-Election-dApp",
  "version": "1.0.0",
  "description": "Create election dapp",
  "private": true,
  "workspaces": {
    "packages": ["packages/*"]
  },
  "scripts": {
    "contract": "yarn workspace contract",
    "client": "yarn workspace client",
    "test": "yarn workspace contract test"
  }
}
```

`package.json`ファイルの内容を確認してみましょう。

モノレポを作成するにあたり、パッケージマネージャーの機能である[Workspaces](https://classic.yarnpkg.com/lang/en/docs/workspaces/)を利用しています。

この機能により、yarn installを一度だけ実行すれば、すべてのパッケージ（今回はコントラクトのパッケージとクライアントのパッケージ）を一度にインストールできるようになります。

**workspaces**の定義をしている部分は以下になります。

```json
"workspaces": {
  "packages": [
    "packages/*"
  ]
},
```

また、ワークスペース内の各パッケージにアクセスするためのコマンドを以下の部分で定義しています。

```json
"scripts": {
  "contract": "yarn workspace contract",
  "client": "yarn workspace client",
  "test": "yarn workspace contract test"
}
```

これにより、各パッケージのディレクトリへ階層を移動しなくてもプロジェクトのルート直下から以下のようにコマンドを実行することが可能となります（ただし、各パッケージ内に`package.json`ファイルが存在し、その中にコマンドが定義されていないと実行できません。そのため、現在は実行してもエラーとなります。ファイルは後ほど作成します）。

```
yarn <パッケージ名> <実行したいコマンド>
```

最後に、NEAR-Election-dAppディレクトリ下に`.gitignore`ファイルを作成して以下の内容を書き込みます。

```
**/yarn-error.log*

# dependencies
**/node_modules

# misc
**/.DS_Store
```

最終的に以下のようなフォルダー構成となっていることを確認してください。

```
NEAR-Election-dApp
 ├── .gitignore
 ├── package.json
 └── packages/
```

これでモノレポの雛形が完成しました！

### 🗂 プロジェクトを作成しよう

**コントラクト用のディレクトリ作成**

`packages`のディレクトリに移動して下のコマンドをターミナルで実行させましょう。

```
cargo new contract --lib
```

始めの`cargo`はrustのパッケージを管理してくれるもので、JavaScriptで使っていたnpmのrust版と考えていただければOKです。

最後の`--lib`はライブラリということを意味しています。これは、スマートコントラクトがライブラリだからです。これを付け忘れるとスマートコントラクトとして機能しないので忘れないように気をつけてください！

**フロントエンドのディレクトリ作成**

次にフロントエンドのセッティングもしていきます。`packages`ディレクトリにいることを確認して以下のコードを実行しましょう。

```
npx create-near-app@3.1.0 --frontend=react --contract=rust client
```

コードを入力すると、2回ほどYes、Noを問われると思うので、全てYesを選択するで大丈夫です。

これによってコントラクトとフロントの接続をすでにコーディングしてくれている状態のプロジェクトを作成してくれます。

ではフロントエンド用のファイルが格納された`client`ディレクトリ内にある`package.json`の中の`name`欄を以下のように変更しましょう。

```
"name": "client",
```

このコードが意味しているのは`フロント=react`で、`コントラクト=Rust `で記述されているプロジェクトであるということです。

ここまででファイル構造は下のようなものになっているはずです。

下のコマンドをターミナルで実行すると確認できます。`-L 2`は２つ下の階層まで、`-F`はディレクトリを`/`で表現するという意味です。

```
tree -L 2 -F
```

末尾が`/`となっているものはディレクトリ、それ以外はファイルであることを示しています

```
NEAR-Election-dApp/
├── contract/
│   ├── Cargo.toml
│   └── src/
└── client/
    ├── README.md
    ├── ava.config.cjs
    ├── contract/
    ├── frontend/
    ├── integration-tests/
    ├── neardev/
    ├── node_modules/
    ├── out/
    ├── package.json
    └── yarn.lock
```

もしも、`command not found: tree`とエラーが出てしまった方は、以下の記事を参考にしてみてください。
https://dot-blog.jp/news/mac-zsh-tree/
https://dot-blog.jp/news/homebrew-how-to-install/

下のコマンドをターミナルで実行すると、あらかじめ用意されているコントラクトのコンパイルとデプロイがされた後にフロントエンドが起動されます！

```
yarn client dev
```

その結果下のようになっているはずです。

背景は時間帯によって変化するようなCSSが適用されているため、白くなっている可能性がありますが問題はありません。

![](/images/NEAR-Election-dApp/section-0/0_2_1.png)

もし、`command not found: yarn`とエラーが出てしまった方は、以下の記事を参考にしてみてください。
https://asapoon.com/error/2795/command-not-found-yarn/

次に`Tailwind`の設定をしていきましょう

まずは`client`ディレクトリに移動して下のコマンドをターミナルで実行し、Tailwindのインストールとconfigファイルの生成をします。

```
yarn add -D tailwindcss postcss &&  npx tailwindcss init
```

次に上のディレクトリのclient/frontend/assets/css/global.cssの一番上に下のコードを追加してください

[global.css]

```diff
+ @tailwind base;
+ @tailwind components;
+ @tailwind utilities;
```

次に生成された`tailwind.config.js`というファイルの中身を下のように書き換えてください。

[tailwind.config.js]

```js
module.exports = {
  content: ["./frontend/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

最後に`.postcssrc`というファイルを`tailwind.config.js`と同じ階層に作成して、以下を追加しましょう。

[.PostCSSrc]

```
{
  "plugins": {
    "tailwindcss": {},
    "autoprefixer": {}
  }
}

```

これでtailwindの設定は完了したのできちんと機能しているか確認してみましょう。

まずclient/frontend/App.jsの58行目を下のようにかえます。

次にターミナル上で`client`に移動して、`yarn dev`を実行してみましょう！

[App.js]

```js
<p className="text-red-600">
```

下のように一部分が赤字に変わっていれば成功です！
![](/images/NEAR-Election-dApp/section-0/0_2_2.png)

では最後に、コントラクトのディレクトリ（ここではclient）内にある`contract`というディレクトリは削除してください。

先ほど`npx create-near-app@3.1.0 --frontend=react --contract=rust client`を実行させることによってコントラクトも同時に作られましたが、一からスマートコントラクトを作る練習ということでフロントとコントラクトを別々に作っており、ややこしくなる可能性があるのでこの作業を行います。

最終的なファイル構造は以下のようになっていればOKです

末尾が`/`となっているものはディレクトリ、それ以外はファイルであることを示しています

```
contract/
├── contract-contract/
│   ├── Cargo.toml
│   ├── src/
└── client/
    ├── README.md
    ├── ava.config.cjs
    ├── dist/
    ├── frontend/
    ├── integration-tests/
    ├── neardev/
    ├── node_modules/
    ├── out/
    ├── package-lock.json
    ├── package.json
    ├── tailwind.config.js
    └── yarn.lock
```

これで環境構築＋ディレクトリ構造の作成は完了です。

**拡張機能**
Rust、Tailwindで開発を行うときにエラーや候補を表示してくれる機能があるととても便利です！

なのでvscodeを使っている方はぜひ下の2つの拡張機能を入れることをおすすめします。
![](/images/NEAR-Election-dApp/section-0/0_2_3.png)
![](/images/NEAR-Election-dApp/section-0/0_2_4.png)

### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discordの`#near`で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の4点を記載してください ✨

```
1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット
```

---

おめでとうございます！

レッスン0は終了です！

次のレッスンではいよいよコントラクトの作成に移ります。

rustはほとんどの人にとって不慣れな言語だとは思いますが、一度習得できれば一生ものです！

頑張っていきましょう 🚀


Documentation created by [honganji](https://github.com/honganji)（UNCHAIN discord ID: Tonny#5693）

