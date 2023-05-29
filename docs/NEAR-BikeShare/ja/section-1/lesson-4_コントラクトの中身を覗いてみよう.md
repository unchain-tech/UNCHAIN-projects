### 👀 コントラクトの中身を覗いてみましょう

最後にコントラクトに何が書かれているのかと簡単に見ていきたいと思います。
詳細に関しては次のセクションから触れてゆくので、ここでわからないことは次のセクションを終えた後に改めて理解しに戻りましょう。

NEARのコントラクトを書く上で、Rustの基本的なコードはこのようになります。

```rust
pub struct struct_name {
	// ブロックチェーン上に保持する値
}

impl struct_name {
    pub fn method_name() {
		// メソッド実装
    }
}
```

`pub struct`という構文でストラクト（構造体）を用意し、その中にコントラクト内で扱う値を保持します。
`impl`という構文でストラクトに関するメソッドを定義してゆきます。

それでは実際の中身を見ます。
お気に入りのコードエディタ（お持ちでない方はVSCodeをインストールしましょう）でプロジェクトのディレクトリを開きます。
そして`ft/src/lib.rs`を開きます。
コードを上から見てゆくと、ストラクトの定義が途中に見つけられます。

```rust
// lib.rs

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize, PanicOnDefault)]
pub struct Contract {
    token: FungibleToken,
    metadata: LazyOption<FungibleTokenMetadata>,
}
```

ストラクトの中にはトークンやメタデータに関するオブジェクトが定義されているのがわかります。
次にこのような実装が見つけられるはずです。
※ コード内で省略する部分に関しては`// ...`で表しています。

```rust
// lib.rs

#[near_bindgen]
impl Contract {
	// ...

    #[init]
    pub fn new(
        owner_id: AccountId,
        total_supply: U128,
        metadata: FungibleTokenMetadata,
    ) -> Self {
        assert!(!env::state_exists(), "Already initialized");
        metadata.assert_valid();
        let mut this = Self {
            token: FungibleToken::new(b"a".to_vec()),
            metadata: LazyOption::new(b"m".to_vec(), Some(&metadata)),
        };
        this.token.internal_register_account(&owner_id);
        this.token.internal_deposit(&owner_id, total_supply.into());
        near_contract_standards::fungible_token::events::FtMint {
            owner_id: &owner_id,
            amount: &total_supply,
            memo: Some("Initial tokens supply is minted"),
        }
        .emit();
        this
    }

	// ...
}
```

ここではトークンの発行時に使用した`new`メソッドが実装されていることがわかります。
引数に`owner_id`、`total_supply`、`metadata`をとっています。

それでは、前レッスンで呼び出していた`ft_transfer`や`storage_deposit`メソッドはどこで実装されているのでしょう。
答えはコード内のこの部分です。

```rust
// lib.rs

// ...

near_contract_standards::impl_fungible_token_core!(Contract, token, on_tokens_burned);
near_contract_standards::impl_fungible_token_storage!(Contract, token, on_account_closed);

// ...
```

短いですね。
NEARが用意したライブラリ(`near_contract_standards`)を使用しています。

- `impl_fungible_token_core`
  [NEP-141](https://nomicon.io/Standards/Tokens/FungibleToken/Core#reference-level-explanation)（fungible tokenの規約）に則ったメソッドをストラクトに実装します。
  例えば`ft_transfer`、`ft_balance_of`メソッドなどです。
- `impl_fungible_token_storage`
  [NEP-145](https://nomicon.io/Standards/StorageManagement)（ストレージマネジメントの規約）に則ったメソッドをストラクトに実装します。
  例えば`storage_deposit`メソッドなどです。

ざっくりとでしたが`ftコントラクト`の中で何が記述されているのかを見ることができました。

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
セクション1は終了です！
ここまででも初めて触れる概念が多く大変だったのではないでしょうか！
次のセクションからはコントラクトを実際に書いていくのでより実践的な内容になります 🔥
