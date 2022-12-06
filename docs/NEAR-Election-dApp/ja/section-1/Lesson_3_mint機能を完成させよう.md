### 🍵 mint 機能を完成させよう

ではmint機能を完成させてさせましょう。

internal.rsに移動して下のコードを追加しましょう

[internal.rs]

```diff
+ use crate::*;
+ use near_sdk::CryptoHash;
+
+ pub(crate) fn hash_account_id(account_id: &AccountId) -> CryptoHash {
+     let mut hash = CryptoHash::default();
+     hash.copy_from_slice(&env::sha256(account_id.as_bytes()));
+     hash
+ }
+
+ pub(crate) fn refund_deposit(storage_used: u64) {
+     let required_cost = env::storage_byte_cost() * Balance::from(storage_used);
+     let attached_deposit = env::attached_deposit();
+
+     assert!(
+         required_cost <= attached_deposit,
+         "Must attach {} yoctoNear to cover storage",
+         required_cost,
+     );
+
+     let refund = attached_deposit - required_cost;
+
+     if refund > 1 {
+         Promise::new(env::predecessor_account_id()).transfer(refund);
+     }
+ }

+ impl Contract {
+     pub(crate) fn internal_add_token_to_owner(
+         &mut self,
+         account_id: &AccountId,
+         token_id: &TokenId,
+     ) {
+         let mut tokens_set = self.tokens_per_owner.get(account_id).unwrap_or_else(|| {
+             UnorderedSet::new(
+                 StorageKey::TokensPerOwnerInner {
+                     account_id_hash: hash_account_id(&account_id),
+                 }
+                 .try_to_vec()
+                 .unwrap(),
+             )
+         });
+         tokens_set.insert(token_id);
+         self.tokens_per_owner.insert(account_id, &tokens_set);
+     }
+
+     pub(crate) fn internal_add_token_to_kind_map(
+         &mut self,
+         token_id: &TokenId,
+         token_kind: TokenKind,
+     ) {
+         let token_kind_clone = token_kind.clone();
+         let mut tokens_set = self
+             .tokens_per_kind
+             .get(&token_kind_clone)
+             .unwrap_or_else(|| {
+                 UnorderedSet::new(
+                     StorageKey::TokensPerKindInner {
+                         token_kind: token_kind,
+                     }
+                     .try_to_vec()
+                     .unwrap(),
+                 )
+             });
+         tokens_set.insert(&token_id);
+         self.tokens_per_kind.insert(&token_kind_clone, &tokens_set);
+     }
+ }

```

では順番に説明していきます。

`CryptoHash`は32bytesのハッシュ値の型のことです。こちらでアカウントをハッシュ化します。

```rust
use near_sdk::CryptoHash;
```

この関数ではWallet Idをハッシュ化して返してくれます。

ここで使われている`pub(crate)`とは、このファイル内だけで使用できる関数であることを示しています。

```rust
pub(crate) fn hash_account_id(account_id: &AccountId) -> CryptoHash {
    let mut hash = CryptoHash::default();

    hash.copy_from_slice(&env::sha256(account_id.as_bytes()));
    hash
}
```

この関数では引数として受け取った`storage_used`をガス代に換算して、`required_cost`という変数に代入します。

次に`attached_deposit`にユーザーからdepositされたNEARを取得して、`assert`関数でdepositされたNEARの方が大きいことを確認します。

最後に`refund`という変数に返金するべきNEARの量を代入してユーザーにtransferして返金します。ここで使われているPromiseとは非同期処理を行うもので、その中の`predecessor_account_id`とはユーザーのアカウントのことを表しています。

```rust
pub(crate) fn refund_deposit(storage_used: u64) {
    let required_cost = env::storage_byte_cost() * Balance::from(storage_used);
    let attached_deposit = env::attached_deposit();

    assert!(
        required_cost <= attached_deposit,
        "Must attach {} yoctoNear to cover storage",
        required_cost,
    );

    let refund = attached_deposit - required_cost;

    if refund > 1 {
        Promise::new(env::predecessor_account_id()).transfer(refund);
    }
}
```

次のこの関数ではまず`tokens_set`という変数に、引数である`account_id`に対するtokenの値が紐づいている`tokens_per_owner`というmapを入れます。

`tokens_set`の前についている`mut`は`mutable`のことで変更可能であることを示しています。

`unwrap_or_else`というメソッドはもし引数である`account_id`に対するtokenの値（ベクター型）が存在していなければ新しくベクターを作るというものです。

`UnorderedSet`の`{}`では引数である`account_id`をハッシュ化した値によってユニークなストレージの接頭辞を作り出す目的がある。

その後変数`tokens_set`に引数である`token_id`を追加する

最後に`tokens_per_owner`に引数である`account_id`に紐付いた`token_set`のmapを追加する。

```rust
pub(crate) fn internal_add_token_to_owner(
    &mut self,
    account_id: &AccountId,
    token_id: &TokenId,
) {
    let mut tokens_set = self.tokens_per_owner.get(account_id).unwrap_or_else(|| {
        UnorderedSet::new(
            StorageKey::TokensPerOwnerInner {
                account_id_hash: hash_account_id(&account_id),
            }
            .try_to_vec()
            .unwrap(),
        )
    });
    tokens_set.insert(token_id);
    self.tokens_per_owner.insert(account_id, &tokens_set);
}
```

この関数で行われていることは`internal_add_token_to_owner`関数で行われていることと同じで、tokenのidとそのtokenの種類が紐づいているということだけが違うだけなので説明は割愛します。

```rust
pub(crate) fn internal_add_token_to_kind_map(
    &mut self,
    token_id: &TokenId,
    token_kind: TokenKind,
) {
    let token_kind_clone = token_kind.clone();
    let mut tokens_set = self
        .tokens_per_kind
        .get(&token_kind_clone)
        .unwrap_or_else(|| {
            UnorderedSet::new(
                StorageKey::TokensPerKindInner {
                    token_kind: token_kind,
                }
                .try_to_vec()
                .unwrap(),
            )
        });

    tokens_set.insert(&token_id);
    self.tokens_per_kind.insert(&token_kind_clone, &tokens_set);
}
```

### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discordの`#near`で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の4点を記載してください ✨

```
1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット
```

これでやっとmintの準備は完了しました！

しかし今の状態ではmintしたNFTの情報をwallet上で見ることができません。なぜなら、nearのwalletでは決められた名前の関数(`nft_tokens_for_owner関数`)をコントラクトから呼ぶことでNFTのmetadataの1つである`media`の値から画像をwalletに表示するからです。

なので次はmintしたNFTの情報をみることができるような実装をしましょう！
