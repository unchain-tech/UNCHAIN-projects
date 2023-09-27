今のところ、作成したプログラムでは何も起こりません。

データを保存するための変更を加えていきましょう!

今回作成するWebアプリケーションは、誰でもGIFを投稿することができます。

そのため、`total_gifs`でGIFの投稿数の管理ができるとかなり便利です。


### 🥞 GIF カウントを保存する　

GIFの投稿数を保存するための変数`total_gifs`を定義し、誰かが新しくGIFを投稿した際に、`total_gifs`の数値を`+1`すれば良いだけです。

しかし、SolanaはEthereumとは異なり、「ステートレス」であるため、データを永久に保持することはできません。

ただし、Solanaは「アカウント」とやり取りができます。

Solanaの「アカウント」は「プログラムが読み書きできるファイル」のことを指します。

「ウォレットでアカウントを作成する」といった際に利用される「アカウント」とは異なるので、紛らわしいですが注意しましょう。

アカウントについての詳細は[こちら](https://docs.solana.com/developing/programming-model/accounts)を参照してください。

それでは、`lib.rs`を以下のとおり修正していきましょう。

```rust
use anchor_lang::prelude::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod myepicproject {
  use super::*;
  pub fn start_stuff_off(ctx: Context<StartStuffOff>) -> Result <()> {
    // アカウントへのリファレンスを取得します。
    let base_account = &mut ctx.accounts.base_account;
    // total_gifsを初期化します。
    base_account.total_gifs = 0;
    Ok(())
  }
}

// StartStuffOffコンテキストに特定の変数をアタッチします。
#[derive(Accounts)]
pub struct StartStuffOff<'info> {
    #[account(init, payer = user, space = 9000)]
    pub base_account: Account<'info, BaseAccount>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program <'info, System>,
}

// 指定のアカウントに何を保存したいかをSolanaに伝えます。
#[account]
pub struct BaseAccount {
    pub total_gifs: u64,
}
```

以下でコードの中身を詳しく説明していきます。


### 🤠アカウントを初期化する

```rust
#[account]
pub struct BaseAccount {
    pub total_gifs: u64,
}
```

ここでは、どんな種類のアカウントを作成し、その中に何を保持するかを定義しています。

今回は`BaseAccount`が`total_gifs`という名前の整数を保持することになります。

```rust
#[derive(Accounts)]
pub struct StartStuffOff<'info> {
    #[account(init, payer = user, space = 9000)]
    pub base_account: Account<'info, BaseAccount>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program <'info, System>,
}
```

ここでは、`StartStuffOff`コンテキストで初期化する方法と保持する変数を実際に実際に指定しています。

`[account(init, payer = user, space = 9000)]`では、`BaseAccount`の初期化方法をSolanaに指示しています。

詳細は以下のとおりです。

1\. `init`では、Solanaにプログラムの新しいアカウントを作成するよう指示しています。

2\. `payer = user`では、アカウントの利用料金を誰が支払うかをプログラム側に指示しています（今回はこの関数を呼び出したユーザーです）。

3\. `space = 9000`では、9000バイトのスペースがアカウントに割り当てています（今回は9000バイトで十分です）。

なぜアカウントにお金を支払う必要があるのでしょうか？

実は、データの保存は無料ではないのです。

Solanaの仕組み上、ユーザーがアカウントの「レンタル料」を支払う必要があります。

ちなみに、「レンタル料」を支払わない場合は、バリデータのよってアカウントが削除されます。

これらの詳細については[こちら](https://docs.solana.com/developing/programming-model/accounts#rent)を参照してください。

`pub user:Signer <'info>`　はプログラムに渡されるデータで、プログラムを呼び出したユーザーが、ウォレットアカウントを所有していることを証明するものです。

`pub system_program:Program`はSolanaを実行するプログラム[SystemProgram](https://docs.solana.com/developing/runtime-facilities/programs#system-program)への参照です。

`SystemProgram`では多くのことができますが、主な役割はSolanaアカウントを作成することです。

```rust
pub fn start_stuff_off(ctx: Context<StartStuffOff>) -> Result <()> {
	// アカウントへのリファレンスを取得します。
  let base_account = &mut ctx.accounts.base_account;
	// total_gifsを初期化します。
  base_account.total_gifs = 0;
  Ok(())
}
```

最後に、`start_stuff_off`関数内で`Context<StartStuffOff>`を実行して、`StartStuffOff`コンテキストから`base_account`を取得する処理を実行します。


### 👋 アカウントデータを取得する

JavaScriptの世界でもアカウントデータを取得できるようになったので、`myepicproject.js`を以下のとおり更新しましょう。

```javascript
const anchor = require('@project-serum/anchor');

// 以下の処理に必要なSystemProgramモジュールを用意します。
const { SystemProgram } = anchor.web3;

const main = async() => {
  console.log("🚀 Starting test...")

  // フロントエンドと通信するためにプロバイダを再度作成して設定します。
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Myepicproject;

  // プログラムが使用するアカウントのキーペアを作成します。
  const baseAccount = anchor.web3.Keypair.generate();

  // start_stuff_off を呼び出し、必要なパラメータを渡します。
  let tx = await program.rpc.startStuffOff({
    accounts: {
      baseAccount: baseAccount.publicKey,
      user: provider.wallet.publicKey,
      systemProgram: SystemProgram.programId,
    },
    signers: [baseAccount],
  });

  console.log("📝 Your transaction signature", tx);

  // アカウントからデータを取得します。
  let account = await program.account.baseAccount.fetch(baseAccount.publicKey);
  console.log('👀 GIF Count', account.totalGifs.toString())
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

`anchor.web3.Keypair.generate()`では、`BaseAccount`用の認証情報を作成しています。

`program.rpc.startStuffOff`では、`lib.rs`で指定した`pub struct StartStuffOff`のパラメータを渡しています。

```javascript
await program.account.baseAccount.fetch(baseAccount.publicKey)
console.log('👀 GIF Count', account.totalGifs.toString())
```

ここでは、作成したアカウントを取得して、`totalGifs`にアクセスしています。

`anchor test`コマンドを実行すると以下のように表示されます。

```
🚀 Starting test...
📝 Your transaction signature 44Ufkfyq56kHkYeahViFrJPwBV5w99kMLLRY9NbRfRWA7PjBcLVfC9GLvsceW9YhSc39QwrHcWaBMmoEHhdkcaCx
👀 GIF Count 0
```

`GIF Count`が0になっていますね。

これで、実際にプログラムを呼び出し、Solanaチェーン上にデータを保存することができました。


### 👷‍♀️ GIF カウンターを更新する関数を作成する

それでは、GIFカウンターをインクリメントする`add_gif`関数を作成しましょう。

`lib.rs`を以下のとおり更新します。

```rust
use anchor_lang::prelude::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod myepicproject {
  use super::*;
  pub fn start_stuff_off(ctx: Context<StartStuffOff>) -> Result <()> {
    let base_account = &mut ctx.accounts.base_account;
    base_account.total_gifs = 0;
    Ok(())
  }

	// アカウントを参照し、total_gifsをインクリメントします。
  pub fn add_gif(ctx: Context<AddGif>) -> Result <()> {
    let base_account = &mut ctx.accounts.base_account;
    base_account.total_gifs += 1;
    Ok(())
  }
}

#[derive(Accounts)]
pub struct StartStuffOff<'info> {
  #[account(init, payer = user, space = 9000)]
  pub base_account: Account<'info, BaseAccount>,
  #[account(mut)]
  pub user: Signer<'info>,
  pub system_program: Program <'info, System>,
}

// AddGif Contextに対して欲しいデータを指定します。
#[derive(Accounts)]
pub struct AddGif<'info> {
  #[account(mut)]
  pub base_account: Account<'info, BaseAccount>,
}

#[account]
pub struct BaseAccount {
    pub total_gifs: u64,
}
```

以下でコードの中身を詳しく説明していきます。

```rust
#[derive(Accounts)]
pub struct AddGif<'info> {
  #[account(mut)]
  pub base_account: Account<'info, BaseAccount>,
}
```

ここでは、`AddGif`という名前の`Context`を作成し、`base_account`へアクセス（変更可能）できるようにしています。

つまり、`BaseAccount`に保存されている`total_gifs`の値を実際に変更できるようになったということになります。

単純な関数内でのデータ更新ではアカウントの値は変更されないので、この記述はアカウントの値を変更するために必要な記述となります。

```rust
pub fn add_gif(ctx: Context<AddGif>) -> Result <()> {
    let base_account = &mut ctx.accounts.base_account;
    base_account.total_gifs += 1;
    Ok(())
}
```

`add_gif`関数では、`Context<AddGif>`を介して関数に渡された`base_account`を取得し、カウンターをインクリメントしています。


### 🌈 テストスクリプトを更新する

プログラムを更新するたびに、テストスクリプトを更新してテストを実行する必要があります。

`myepicproject.js`を以下のとおり更新して`add_gif`を呼び出してみましょう。

```javascript
const anchor = require('@project-serum/anchor');
const { SystemProgram } = anchor.web3;

const main = async() => {
  console.log("🚀 Starting test...")

  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Myepicproject;
  const baseAccount = anchor.web3.Keypair.generate();
  let tx = await program.rpc.startStuffOff({
    accounts: {
      baseAccount: baseAccount.publicKey,
      user: provider.wallet.publicKey,
      systemProgram: SystemProgram.programId,
    },
    signers: [baseAccount],
  });
  console.log("📝 Your transaction signature", tx);

  let account = await program.account.baseAccount.fetch(baseAccount.publicKey);
  console.log('👀 GIF Count', account.totalGifs.toString())

  // add_gif関数を呼び出します。
  await program.rpc.addGif({
    accounts: {
      baseAccount: baseAccount.publicKey,
    },
  });

  // もう一度アカウントを取得してtotal_gifsを確認します。
  account = await program.account.baseAccount.fetch(baseAccount.publicKey);
  console.log('👀 GIF Count', account.totalGifs.toString())
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

以下のコマンドを実行してみましょう。

```
anchor test
```

以下のように表示されればOKです。

```
🚀 Starting test...
📝 Your transaction signature 2MdxhYHDDnhuJ9wr2LYqTL8t39qb8FeTU9iffUXyYdUBRYB1yU9XZYBayUk2usPV9tCyLmoutfuSokx8Pn6Lc8Tf
👀 GIF Count 0
👀 GIF Count 1
```

ここまでで、Solanaプログラムにデータを保存し、そのデータを変更することができました。

> ⚠️ 注意
>
> `anchor test`を再度実行すると GIF カウンターが 0 から始まります。
>
> これは、`anchor.web3.Keypair.generate()`によって、`anchor test`のたびにアカウントのキーペアが生成されるためです。
>
> Web アプリケーションではこの対処を行いますが、テスト時には毎回はじめから確認できるので便利です。


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

次のレッスンでは、SolanaプログラムにGIFデータの連携部分を実装します!
