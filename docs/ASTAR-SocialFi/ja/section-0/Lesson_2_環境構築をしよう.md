## 🧞‍♂️ 環境構築しよう

ではプロジェクトを作成するにあたって環境構築をしていきましょう！

### 🌚 バックエンドの環境構築

まずはスマートコントラクトを作成するための環境を整えていきましょう！

では下のコマンドをターミナルで実行してrustを使用できるようにしていきます。(Windows OSの場合は`https://rust.sh/`からインストール用のinit.exeをダウンロードし実行しましょう。)

```
curl --proto '=https' --tlsv1.2 -sSf `https://sh.rustup.rs` | sh
```

下のようなメッセージが帰ってくるはずです。

```
1) Proceed with installation (default)
2) Customize installation
3) Cancel installation
>
```

処理が終わったら下のコマンドを実行して環境変数を設定します。

```
source "$HOME/.cargo/env"
```

これらが終わったら下のコマンドを順番にターミナルで実行します

```
rustup default stable
rustup update
rustup update nightly
rustup target add wasm32-unknown-unknown --toolchain nightly
```

次に`cargo-contracts CLI`を使用できるようにするための準備をします。下のコマンドを順番にターミナルで実行してください。

その前にmacで開発をされる方は[こちら](https://qiita.com/zaburo/items/29fe23c1ceb6056109fd)を参考に`Homebrew`をインストールしてください。こちらはパッケージをインストールするのに使用します。

```
rustup component add rust-src
(Macの場合のみ)brew install openssl
cargo install cargo-dylint dylint-link
cargo install --force --locked cargo-contract
```

では次に下の３つのコマンドを順番にターミナルで実行することによって`rust nightly`を最新版にしましょう。
※もし新たに最新版が出ている場合はそちらをインストールする必要があるかも知れません 😥

```
rustup toolchain install nightly-2022-08-15
```

```
rustup target add wasm32-unknown-unknown --toolchain nightly-2022-08-15
```

```
rustup component add rust-src --toolchain nightly-2022-08-15
```

これでコントラクトをデプロイする準備が完了しました！

では下のコマンドを使用することで新しくプロジェクトを作成して行きましょう。

コマンドの実行はプロジェクトを保存したいディレクトリに移動してから行いましょう。

```
cargo contract new astar_sns_contract
```

作成が完了したら、`astar_sns_contract`ディレクトリに移動しましょう。

では作成されたコントラクトをローカルのチェーンにデプロイしてみましょう。

最初に、作成したプロジェクトのabiファイルとwasm形式で記述されたファイルを作成していきます。

下のコマンドを実行してみましょう。

```
cargo +nightly-2022-08-15 contract build
```

このようなメッセージが返ってきていればOKです！

```
  - astar_sns_contract.contract (code + metadata)
  - astar_sns_contract.wasm (the contract's code)
  - metadata.json (the contract's metadata)
```

これで`astar-sns-contract/target/ink`の直下に`metadata.json`と`astar_sns_contract.wasm`が作成されていれば成功です。

次にローカルのノードを立ててローカルでコントラクトのデプロイができる環境を作っていくのですが、そのために必要なツールを下のコマンドをターミナルで実行してインストールしていきましょう。

```
brew install wget
```

次に行うコマンドを行う時に、最新のバージョンのものをインストールするために[こちら](https://github.com/AstarNetwork/Astar/releases)を確認して最新のものを最後の部分（`v4.24.0/astar-collator-4.24.0-macOS-x86_64.tar.gz`）と入れ替えて下さい

![](/public/images/ASTAR-SocialFi/section-0/0_2_1.png)

```
wget https://github.com/AstarNetwork/Astar/releases/download/v4.24.0/astar-collator-v4.24.0-macOS-x86_64.tar.gz
```

```
tar xvf astar-collator-v4.24.0-macOS-x86_64.tar.gz
```

次に下のコマンドをターミナルで実行してローカルのノードを立てましょう。

```
./astar-collator --dev
```

ターミナルで下のようなメッセージが返ってくればきちんとノードが立てられているということです！

```
2022-11-03 11:52:42 🎁 Prepared block for proposing at 3 (2 ms) [hash: 0x52f9668c6355a0f4576b9f6c9f97fee7d76053400b235633521e8d521f326af9; parent_hash: 0x5776…b064; extrinsics (1): [0x4d38…cff5]]
2022-11-03 11:52:42 🔖 Pre-sealed block for proposal at 3. Hash now 0xf5f639ff7eb5a57fdcc7fd08c3024e6b595cf37784ebc6a403cc9b225682f8e3, previously 0x52f9668c6355a0f4576b9f6c9f97fee7d76053400b235633521e8d521f326af9.
2022-11-03 11:52:42 ✨ Imported #3 (0xf5f6…f8e3)
2022-11-03 11:52:42 Accepting new connection 2/100
2022-11-03 11:52:44 🙌 Starting consensus session on top of parent 0xf5f639ff7eb5a57fdcc7fd08c3024e6b595cf37784ebc6a403cc9b225682f8e3
```

次に[こちら](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Frpc.polkadot.io#/explorer)のurlへ飛びます。

これはpolkadot.jsというサイトで、etherscanのpolkadot版です。

このサイトでまずはローカルのノードに切り替えます。手順は以下の通りです。

（1）左上の`polkadot`をクリック

（2）下にスクロールして`DEVELPMENT`をクリック

（3）`DEVELPMENT`直下の`Local Node`をクリック

（4）左上の`Switch`をクリック

下の画像を参考に行なってください。
![](/public/images/ASTAR-SocialFi/section-0/0_2_2.png)
![](/public/images/ASTAR-SocialFi/section-0/0_2_3.png)
![](/public/images/ASTAR-SocialFi/section-0/0_2_4.png)
![](/public/images/ASTAR-SocialFi/section-0/0_2_5.png)

すると下のような画面が出てくるはずです

![](/public/images/ASTAR-SocialFi/section-0/0_2_6.png)
この画面ではすでにデプロイがされているので`recent block`という部分にblockのハッシュ値がありますが、みなさんの画面には何もないかもしれません。

ではヘッダーにある`Developer`直下の`contract`をクリックしてみましょう。
![](/public/images/ASTAR-SocialFi/section-0/0_2_7.png)

すると下のような画面が出てくるので`Upload & deploy code`をクリックしてみましょう。
![](/public/images/ASTAR-SocialFi/section-0/0_2_8.png)

これで下のようなモーダルが出てくるはずなのでそこにさきほどデプロイで取得したコントラクトアドレス、コントラクト名を書き、一番下の部分には`astar-sns-contract/contracts/astar_sns/target/ink`直下に生成されている`metadata.json`を選択して追加してます。
![](/public/images/ASTAR-SocialFi/section-0/0_2_9.png)

その後モーダルの中の入力欄が増えるので`astar_sns_constract.wasm`を追加しましょう。
![](/public/images/ASTAR-SocialFi/section-0/0_2_10.png)

するとデプロイされたコントラクトのところに`ASTAR-SNS-CONTRACT`というのが見えると思います。
![](/public/images/ASTAR-SocialFi/section-0/0_2_11.png)

では下のようにデプロイしたコントラクトの`Messages`という部分をクリックしてexecを押してみましょう。

`current value`という部分は初期値の`false`になっているはずです。

その後右下に現れる`Execute`, `Sign and Submit`というボタンを押すと下のようにコントラクト内の状態変数が`true`に変わっていることがわかると思います！
![](/public/images/ASTAR-SocialFi/section-0/0_2_12.png)

これでコントラクトがきちんと機能していてかつpolkadot.jsから操作できることが確認できたのでバックエンドの環境構築は終了となります！

開発する上でRustでの開発を行うときにエラーや候補を表示してくれる拡張機能があるととても便利です！

なのでvscodeを使っている方はぜひ下の画像の拡張機能`rust-analyzer`を入れることをおすすめします。
![](/public/images/ASTAR-SocialFi/section-0/0_2_13.png)

お疲れ様でした 💥

これでバックエンドの環境構築は完了です。

### 🌝 フロントエンドの環境構築

次にフロントエンドに取り掛かっていきます

#### `Next,js`

今回フロントで使用するのは`Next.js`です。Next.jsとは、JavaScriptでwebアプリを開発できるフレームワークです。

特徴としては、通常のようにクライアント側でHTMLを生成するのではなくサーバー側でHTMLを作成していることです。

これによってより良いパフォーマンスを実現しています。

では早速下のコマンドをターミナルで実行して新しいnext.jsのプロジェクトを作成していきましょう。

今回はtypescriptを使用していくのでその指定もしておきます。

```
npx create-next-app@latest astar-sns-frontend --typescript
```

次に`Tailwind CSS`を導入していきます。Tailwind CSSを使用することで簡単に自由なCSSを記述することができます。

まずは先ほど作成したプロジェクトの一番上のディレクトリにいることを確認して下のコマンドをターミナルで実行しましょう。

```
npm install -D tailwindcss@latest postcss@latest autoprefixer@latest
```

```
npx tailwindcss init -p
```

次に作成されたtailwind.config.jsのファイルを下のように書き換えていきましょう。

[`tailwind.config.js`]

```js
module.exports = {
  mode: "jit",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./utils/**/*.{js,ts,jsx,tsx}",
    "./hooks/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

次に`style/globals.css`を下のように書き換えましょう。

[`style/globals.css`]

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

では下のコマンドをターミナルで実行してローカルでアプリを動かせるか確認しましょう。

```
yarn dev
```

下のようにターミナルに表示されていればきちんとノードが立てられているので、 ターミナルに表示されているローカルのページurlをブラウザにコピー&ペーストしてみてみましょう。

```
ready - started server on 0.0.0.0:3000, url: http://localhost:3000
info  - Loaded env from /Users/toshi/Programming_Work/Unchain/Astar-Project/astar-sns-dapp/.env
event - compiled client and server successfully in 806 ms (150 modules)
```

下のように見えていればOKです。
![](/public/images/ASTAR-SocialFi/section-0/0_2_14.png)

では`index.tsx`の7行目の`className`を少し改良してきちんとTailwind CSSが機能しているかを確認してみましょう。

[`index.tsx`]

```ts
<div className="bg-[#D083EB]">
```

次に変更内容を保存してみましょう。自動的に変更内容が反映されるはずです。

下のように背景色が変更されていれば成功です！
![](/public/images/ASTAR-SocialFi/section-0/0_2_15.png)

ここまで完了すればフロントエンドの環境構築は成功です！
お疲れ様でした 🤞

### 🙋‍♂️ 質問する

わからないことがあれば、Discordの`#astar-network`でsection ・ Lesson名とともに質問をしてください 👋

---

次のレッスンでは、Rustを用いたスマートコントラクト作成をしていきます！ 🎉
