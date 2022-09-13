### 🏭 環境構築をしよう

このプロジェクトは中級者向けということで、github からある程度出来上がったプロジェクトを clone するのではなく `1 からプロジェクトを作成`していきます！

スマートコントラクトの作成に使う言語は `Rust` です。比較的低水準の言語で solidity と比べると注意しないといけない部分が多かったりしますが、その分後々起きるかもしれないバグを予防してくれているのでとても優秀な言語だと言えます。

では Rust でスマートコントラクトを作成するための環境を整えていきましょう。

**Rust のインストール**

まずは下のコマンドをターミナルで実行することで Rust をインストールしてください

```bash
$ curl --proto '=https' --tlsv1.2 https://sh.rustup.rs -sSf | sh
```

1) Proceed with installation (default)
2) Customize installation
3) Cancel installation
このようなメッセージが出てきたら、1のdefaultを選択してください。
インストールが成功していれば下のようなメッセージが表示されているでしょう

```bash
Rust is installed now. Great!
```

また、環境変数を設定するために下のコマンドをターミナルで実行させましょう（[環境変数とは？](https://wa3.i-3-i.info/word11027.html)）

```bash
source $HOME/.cargo/env
```

```bash
export PATH="$HOME/.cargo/bin:$PATH"
```

ここまでの設定が完了していることを確認するために下のコマンドをターミナルで実行させましょう

```bash
$ rustc --version
```

完了していれば以下のような形式のメッセージが表示されるはずです

```bash
rustc x.y.z (abcabcabc yyyy-mm-dd)
```

次にコンピュータから near に接続するためのツールである`near-cli`をどのディレクトリでも使えるように下のコマンドを実行することでグローバルにインストールしましょう！

```bash
npm install -g near-cli
```

これで環境構築は完了です！

### 🗂 ディレクトリを作成しよう

**コントラクト用のディレクトリ作成**

それでは新しいプロジェクトを作成していきましょう。まずは任意の場所にプロジェクト用のディレクトリを作成します。

このプロジェクトでは`near-election-dapp`というディレクトリを作成します。

```bash
mkdir near-election-dapp
cd  near-election-dapp
```
`near-election-dapp`のディレクトリに移動して下のコマンドをターミナルで実行させましょう。

```bash
cargo new near-election-dapp-contract --lib
```

始めの`cargo`は rust のパッケージを管理してくれるもので、javascript で使っていた npm の rust 版と考えていただければ OK です。

次の`new`は新しいプロジェクトということを表しており、その次の`near-election-dapp-contract`はプロジェクト名を表しています。ここは自分の好きな名前に変えてもらって大丈夫です。（ただし、この後もここで使った名前を使うので、同じ名前にしておいた方がスムーズに進めることができるかと思います。）

最後の`--lib`はライブラリということを意味しています。これは、スマートコントラクトがライブラリだからです。これを付け忘れるとスマートコントラクトとして機能しないので忘れないように気をつけてください！

**フロントエンドのディレクトリ作成**

次にフロントエンドのセッティングもしていきます。`near-election-dapp`ディレクトリにいることを確認して以下のコードを実行しましょう。

```bash
npx create-near-app near-election-dapp-frontend --contract rust --frontend react --t
ests js
```

これによってコントラクトとフロントの接続をすでにコーディングしてくれている状態のプロジェクトを作成してくれます。

このコードが意味しているのは`フロントは react` で、`コントラクトは Rust `で記述されているプロジェクトであるということです。

最後の`near-election-dapp-frontend`はプロジェクト名なので自分の好きな名前に変えてもらって大丈夫です。（ただし、この後もここで使った名前を使うので同じ名前にしておいた方がスムーズに進めることができるかと思います。）

ここまででファイル構造は下のようなものになっているはずです。

下のコマンドをターミナルで実行することで確認できます。`-L 2`は２つ下の階層まで、`-F`はディレクトリを`/`で表現するという意味です。

```bash
tree -L 2 -F
```

末尾が`/`となっているものはディレクトリ、それ以外はファイルであることを示しています

```
near-election-dapp/
├── near-election-dapp-contract/
│   ├── Cargo.toml
│   └── src/
└── near-election-dapp-frontend/
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


ここで`near-election-dapp-frontend`へ移って下のコマンドをターミナルで実行すると、あらかじめ用意されているコントラクトのコンパイルとデプロイがされた後にフロントエンドが起動されます！

```bash
yarn build
yarn deploy
yarn start
```

その結果下のようになっているはずです。

背景は時間帯によって変化するような CSS が適用されているため、白くなっている可能性がありますが問題はありません。

![](/public/images/401-NEAR-Election-dApp/section-0/0_2_1.png)

もし、`command not found: yarn`とエラーが出てしまった方は、以下の記事を参考にしてみてください。
https://asapoon.com/error/2795/command-not-found-yarn/


次に`Tailwind`の設定をしていきましょう

まずは下のコマンドをターミナルで実行することで Tailwind のインストールと config ファイルの生成をします。

注意点として、このコマンドをターミナルで実行するのは先ほど作成したフロントエンドのディレクトリである`near-election-dapp-frontend`です（名前を変えた方はその名前）。

```bash
npm install -D tailwindcss postcss &&  npx tailwindcss init
```

次に上のディレクトリの near-election-dapp-frontend/frontend/assets/css/global.css の一番上に下のコードを追加してください

[global.css]

```diff
+ @tailwind base;
+ @tailwind components;
+ @tailwind utilities;
```

次に生成された`tailwind.config.js`というファイルの中身を下のように書き換えてください。

[tailwind.config.js]

```javascript
module.exports = {
  content: [
    "./frontend/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

最後に`.postcssrc`というファイルを`tailwind.config.js`と同じ階層に作成して、以下を追加しましょう。

[.postcssrc]

```
{
  "plugins": {
    "tailwindcss": {},
    "autoprefixer": {}
  }
}

```

これで tailwind の設定は完了したのできちんと機能しているか確認してみましょう。

まず near-election-dapp-frontend/frontend/App.js の 58 行目を下のようにかえます。

次にターミナル上で`near-election-dapp-frontend`に移動して、`yarn dev`を実行してみましょう！

[App.js]

```javascript
<p className="text-red-600">
```

下のように一部分が赤字に変わっていれば成功です！
![](/public/images/401-NEAR-Election-dApp/section-0/0_2_2.png)

では最後に、コントラクトのディレクトリ（ここでは near-election-dapp-frontend）内にある `contract` というディレクトリは削除してください。

先ほど`npx create-near-app --frontend=react --contract=rust near-election-dapp-frontend`を実行させることによってコントラクトも同時に作られましたが、一からスマートコントラクトを作る練習ということでフロントとコントラクトを別々に作っており、ややこしくなる可能性があるのでこの作業を行います。

最終的なファイル構造は以下のようになっていれば OK です

末尾が`/`となっているものはディレクトリ、それ以外はファイルであることを示しています

```bash
near-election-dapp/
├── near-election-dapp-contract/
│   ├── Cargo.toml
│   ├── src/
└── near-election-dapp-frontend/
    ├── README.md
    ├── ava.config.cjs
    ├── contract/
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
Rust、Tailwind で開発を行うときにエラーや候補を表示してくれる機能があるととても便利です！

なので vscode を使っている方はぜひ下の二つの拡張機能を入れることをおすすめします。
![](/public/images/401-NEAR-Election-dApp/section-0/0_2_3.png)
![](/public/images/401-NEAR-Election-dApp/section-0/0_2_4.png)

### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discord の `#near-election-dapp` で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の 4 点を記載してください ✨

```
1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット
```

---

おめでとうございます！

セクション 0 は終了です！

次のセクションではいよいよコントラクトの作成に移ります。

rust はほとんどの人にとって不慣れな言語だとは思いますが、一度習得できれば一生ものです！

頑張っていきましょう 🚀
