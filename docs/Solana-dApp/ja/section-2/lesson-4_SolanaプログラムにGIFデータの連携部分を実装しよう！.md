Solanaプログラム上にデータを保存することができました。

次は、より多くのデータを保存できるように設定しましょう。

例えば、GIFへのリンクや投稿者のアドレスなど、必要なデータを構造体の配列に格納しましょう。

そして、それらのデータをクライアントで取得できるようにします。


### 💎 Vector を設定する

`lib.js`を以下のとおり更新します。

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

  // add_gif関数はgif_linkを受け取れるようになりました。
  pub fn add_gif(ctx: Context<AddGif>, gif_link: String) -> Result <()> {
    let base_account = &mut ctx.accounts.base_account;
    let user = &mut ctx.accounts.user;

	// gif_linkとuser_addressを格納するための構造体を作成します。
    let item = ItemStruct {
      gif_link: gif_link.to_string(),
      user_address: *user.to_account_info().key,
    };

	// gif_listにitemを追加します。
    base_account.gif_list.push(item);
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

// AddGifメソッドを呼び出した署名者を構造体に追加し、保存できるようにします。
#[derive(Accounts)]
pub struct AddGif<'info> {
  #[account(mut)]
  pub base_account: Account<'info, BaseAccount>,
  #[account(mut)]
  pub user: Signer<'info>,
}

// カスタム構造体を作成します。
#[derive(Debug, Clone, AnchorSerialize, AnchorDeserialize)]
pub struct ItemStruct {
    pub gif_link: String,
    pub user_address: Pubkey,
}

#[account]
pub struct BaseAccount {
    pub total_gifs: u64,
	// ItemStruct型のVectorをアカウントにアタッチします。
    pub gif_list: Vec<ItemStruct>,
}
```

下から順に説明していきます。

`BaseAccount`に`gif_list`パラメータが追加され、`ItemStruct`型の配列が格納されています。

`gif_list`は`Vector`の略である`Vec`型です(詳細については[こちら](https://doc.rust-lang.org/std/vec/struct.Vec.html)を参照してください)。

```rust
#[derive(Debug, Clone, AnchorSerialize, AnchorDeserialize)]
pub struct ItemStruct {
    pub gif_link: String,
    pub user_address: Pubkey,
}
```

ここでは、`ItemStruct`を宣言しています。

`gif_link`は`String`を、`user_address`は`PubKey`を保持しています。

```rust
#[derive(Debug, Clone, AnchorSerialize, AnchorDeserialize)]
```

データをアカウントに保存するためには、データをバイナリ形式にシリアル化する必要があり、保存されたデータを取得する際には、今度は元に戻してあげる必要があります。

ここでは、構造体をシリアル化したり、元に戻したりする方法をAnchorに指示しています。

カスタム構造体を適切にシリアライズ / デシリアライズされていることを確認するために、この処理を行っているというわけです。


### 🤯 テストスクリプトを更新する

では、テストを行う前に`myepicproject.js`を以下のとおり更新しておきましょう。

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

  // GIFリンクと送信ユーザーのアドレスを渡します。
  await program.rpc.addGif("insert_a_gif_link_here", {
    accounts: {
      baseAccount: baseAccount.publicKey,
      user: provider.wallet.publicKey,
    },
  });

  // アカウントを呼び出します。
  account = await program.account.baseAccount.fetch(baseAccount.publicKey);
  console.log('👀 GIF Count', account.totalGifs.toString())

  // アカウントでgif_listにアクセスします。
  console.log('👀 GIF List', account.gifList)
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

テスト実行前に、`addGif`メソッドの`insert_a_gif_link_here`にGIFのリンクを張り付ける必要があります。

忘れずにリンクを更新しましょう。

それでは、以下のコマンドを実行してテストを行いましょう。

```
anchor test
```

以下のように表示されていればOKです。

```
🚀 Starting test...
📝 Your transaction signature 3bVdunNLAHN78rYERyTkZaTzD9Bd9DPAw8c6kipywCD1wgHS3fFkaQWDmUrGNggxzKxwSoY7PGhA4ZHCpfofLwZR
👀 GIF Count 0
👀 GIF Count 1
👀 GIF List [
  {
    gifLink: 'insert_a_gif_link_here',
    userAddress: PublicKey {
      _bn: <BN: f7b50263adfa281e3460f455e8c5fa3527b84a3b9d2bcc0fedaf69cc7786cbc>
    }
  }
]
```

ここまでで、Solanaプログラムの実装部分はほとんど完了しました。


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

おめでとうございます!

セクション2は終了です!

ぜひ、ターミナルの出力結果をコミュニティに投稿してください!

あなたの成功をコミュニティで祝いましょう 🎉

次のレッスンでは、作成したSolanaプログラムをDevnetにデプロイします!
