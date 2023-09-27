### 👶 基本的なプログラムを作成する

> ⚠️ 注意
>
> Windows 環境の場合は以下の手順をすべて WSL 上で行うことになります。
>
> WSL にインストールされたファイル等は、 `windows キー + R`で`RUN`ボックスを開き、`\\wsl $ \ Ubuntu`を入力すると確認できます。
>
> `home`フォルダ下の`username`フォルダ内に`myepicproject`があるはずです。

VS Codeで`myepicproject`を開きましょう。

そして、`programs/myepicproject/src/lib.rs`と`tests/myepicproject.js`の中身を **削除** します。

実際にファイルを削除するのではなく、ファイルの中のコードだけを削除してください。

そして、以下のとおり`lib.rs`ファイルの中身を追加します。

```rust
use anchor_lang::prelude::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod myepicproject {
  use super::*;
  pub fn start_stuff_off(ctx: Context<StartStuffOff>) -> Result <()> {
    Ok(())
  }
}

#[derive(Accounts)]
pub struct StartStuffOff {}
```

Rustが分からなくても大丈夫です。

以下で簡単に説明していきます。

```rust
use anchor_lang::prelude::*;
```

`use`宣言はSolidityの`import`文のようなものです。

Solanaプログラムを書きやすくするために、Anchorが提供してくれる優秀なツールをインポートしています。

```rust
declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");
```

これは、Anchorが自動生成した「プログラムID」と呼ばれるものです。

SolanaがWebアプリケーションを実行するための情報を持っています。

あとで変更するので、詳細はその時に説明します。

```rust
#[program]
```

この記述により、フロントエンドからフェッチリクエストを経由してSolanaプログラムを実際に呼び出すことができるようになります。

これは[マクロ](http://web.mit.edu/rust-lang_v1.25/arch/amd64_ubuntu1404/share/doc/rust/html/book/first-edition/macros.html)と呼ばれるもので、基本的にはモジュールにコードを追加するものです。

クラスを継承するイメージで使います。

```rust
pub mod myepicproject {
  use super::*;
  pub fn start_stuff_off(ctx: Context<StartStuffOff>) -> Result <()> {
    Ok(())
  }
}
```

`pub mod`により、以下の記述がRustの[module](https://stevedonovan.github.io/rust-gentle-intro/4-modules.html)であると宣言できます。

これは、関数や変数のコレクションを定義する最も簡単な方法です。

ちなみに、今回宣言したモジュールの名前は`myepicproject`と定義しています。

`myepicproject`モジュールの中では、`start_stuff_off`関数を定義し、`Context`を受け取り、`Result <()>`を出力しています。

`Result`タイプについての詳細は、[こちら](https://doc.rust-lang.org/std/result)で確認してみてください。

この関数は`Ok(())`を呼び出す以外は何もしていません。

つまり、`start_stuff_off`関数は、他の誰かが呼び出すことができる関数なのです。

今は何もしませんが、後ほど変更を加えます。

```rust
#[derive(Accounts)]
pub struct StartStuffOff {}
```

これは別の「マクロ」で、アカウントの制約を指定できます。

実際にこれらを実行してみて、何が起こるか見てみましょう。


### 💎 スクリプトを記述してローカルで機能することを確認する

プログラムをどのように実行し、どの関数を呼び出したいかをAnchorに指示する必要があります。

そのために、`tests/myepicproject.js`を以下のとおり変更します。

```javascript
const anchor = require('@project-serum/anchor');

const main = async() => {
  console.log("🚀 Starting test...")

  anchor.setProvider(anchor.AnchorProvider.env());
  const program = anchor.workspace.Myepicproject;
  const tx = await program.rpc.startStuffOff();

  console.log("📝 Your transaction signature", tx);
}

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

runMain();
```

以下でコードの中身を説明していきます。

```javascript
anchor.setProvider(anchor.AnchorProvider.env());
const program = anchor.workspace.Myepicproject;
const tx = await program.rpc.startStuffOff();
```

まず、`anchor.setProvider`で`solana config get`からAnchorにプロバイダーを設定するように指示します。

このように記述することで、Anchorはプログラムをローカル上で実行することができるようになります（devnetでコードをテストできるようになります）。

次に、`anchor.workspace.Myepicproject`を取得します。

これは、Anchorが提供している非常に優れた機能で、`lib.rs`でコードを自動的にコンパイルし、ローカル上のバリデータがデプロイしてくれるというものです。

最後に、`program.rpc.startStuffOff()`関数を呼び出し、ローカル上のバリデータが命令を「マイニング」するのを待ちます。

なお、`runMain`は、`main`　関数を非同期で実行するための記述です。

続いて、`myepicproject/Anchor.toml`の`[scripts]`タグを少し変更します。

```
[scripts]
test = "node tests/myepicproject.js"
```

最後に、以下のコマンドを実行してみましょう。

※ VS Codeを使用している場合は、変更したファイルを全て保存してから実行してください。

```
anchor test
```

以下のように出力されていればOKです。

```
🚀 Starting test...
📝 Your transaction signature 4D5hbvQKADe6zxmB6qsnG5LRcfkYYCug3sAfbuKs94UdY1B4Hmj85DvnNLbagUxXQPqAJQDLocECEPtNa6RPayuS
```


**ここまで無事に完了しました!**

出力された`Your transaction signature`は`startStuffOff`関数が正常に呼び出されたことを意味します。

ここまでで、Solanaプログラムを作成し、**ローカル上の Solana ノードにデプロイすることができました**。

つまり、ローカル上に構築されたSolanaネットワークにデプロイされたプログラムと通信できるようになったということです。

これでSolanaプログラムとWebアプリケーションを繋ぐ準備がすべて整いました。

このAnchorの基本的なフローに慣れるため、以下のサイクルを覚えておきましょう。

1\. `lib.rs`にコードを書く。

2\. `tests/myepicproject.js`を使用してテストする。


### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discordの`#solana`で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の4点を記載してください ✨

```
1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット
```

---

次のレッスンでは、SolanaプログラムにGIFカウンターを実装します!
