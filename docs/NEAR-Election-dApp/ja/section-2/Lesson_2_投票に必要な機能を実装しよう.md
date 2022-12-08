### 🐜 投票に必要な機能を実装しよう

前回までのレッスンでNFTのmint、transfer機能の実装は完了したについては完了しました！

ここからは投票に必要な以下の機能を実装していきます。

- 投票
- 候補者ごとの得票数のカウント
- 投票の締切
- 投票済みかどうかの判定

投票機能については、それぞれの候補者に対応したNFTとは別のベクターである`likes_per_candidate`のデータを書き換える処理をします。

具体的にはそれぞれの候補者NFTのtokenのidに紐づいた得票数をインクリメント（1大きくします）。

では、`nft_core.rs`へ移動して下のように書き換えていきましょう！

[nft_core.rs]

```diff
use crate::*;
use near_sdk::ext_contract;
pub trait NonFungibleTokenCore {
    fn nft_transfer(&mut self, receiver_id: AccountId, token_id: TokenId);
    fn nft_token(&self, token_id: TokenId) -> Option<JsonToken>;
+   fn nft_add_likes_to_candidate(&mut self, token_id: TokenId);
}
#[ext_contract(ext_non_fungible_token_receiver)]
trait NonFungibleTokenReceiver {
    fn nft_on_transfer(
        &mut self,
        sender_id: AccountId,
        previous_owner_id: AccountId,
        token_id: TokenId,
        msg: String,
    ) -> Promise;
}

#[near_bindgen]
impl NonFungibleTokenCore for Contract {
    #[payable]
    // transfer token
    fn nft_transfer(&mut self, receiver_id: AccountId, token_id: TokenId) {
        assert!(
            !(&self.is_election_closed),
            "You can no longer vote because it's been closed!"
        );
        assert_one_yocto();
        let sender_id = env::predecessor_account_id();

        self.internal_transfer(&sender_id, &receiver_id, &token_id);
    }

    // get specified token info
    fn nft_token(&self, token_id: TokenId) -> Option<JsonToken> {
        if let Some(token) = self.tokens_by_id.get(&token_id) {
            let metadata = self.token_metadata_by_id.get(&token_id).unwrap();
            Some(JsonToken {
                owner_id: token.owner_id,
                metadata,
            })
        } else {
            None
        }
    }

+   fn nft_add_likes_to_candidate(&mut self, token_id: TokenId) {
+       if self.likes_per_candidate.get(&token_id).is_some() {
+           let mut likes = self.likes_per_candidate.get(&token_id);
+           likes.replace(likes.unwrap() + 1 as Likes);
+           self.likes_per_candidate.insert(&token_id, &likes.unwrap());
+       }
+   }
}
```

まず最初の追加部分では`NonFungibleTokenCore`というトレイトの中に`nft_add_likes_to_candidate`という関数があることを宣言しています。

```rust
fn nft_add_likes_to_candidate(&mut self, token_id: TokenId);
```

次の追加部分で宣言した`nft_add_likes_to_candidate`という関数の内容を説明しています。

この中ではそれぞれの候補者NFTのidがkeyのmapが存在すれば、それに紐づいた値（初期値は0）をインクリメントするというという処理をしています。

シンプルですね。

```rust
fn nft_add_likes_to_candidate(&mut self, token_id: TokenId) {
        if self.likes_per_candidate.get(&token_id).is_some() {
            let mut likes = self.likes_per_candidate.get(&token_id);
            likes.replace(likes.unwrap() + 1 as Likes);
            self.likes_per_candidate.insert(&token_id, &likes.unwrap());
        }
    }
```

次に`enumeration.rs`へ移動して下のように書き換えましょう。

[enumeration.rs]

```diff
use crate::*;

#[near_bindgen]
impl Contract {
    // get number of tokens
    pub fn nft_total_supply(&self) -> U128 {
        U128(self.token_metadata_by_id.len() as u128)
    }

    // get tokens(caller can select how many tokens to get)
    pub fn nft_tokens(&self, from_index: Option<U128>, limit: Option<u64>) -> Vec<JsonToken> {
        let start = u128::from(from_index.unwrap_or(U128(0)));
        self.token_metadata_by_id
            .keys()
            .skip(start as usize)
            .take(limit.unwrap_or(50) as usize)
            .map(|token_id| self.nft_token(token_id.clone()).unwrap())
            .collect()
    }

    // get number of tokens for specified owner
    pub fn nft_supply_for_owner(&self, account_id: AccountId) -> U128 {
        let tokens_for_kind_set = self.tokens_per_owner.get(&account_id);
        if let Some(tokens_for_kind_set) = tokens_for_kind_set {
            U128(tokens_for_kind_set.len() as u128)
        } else {
            U128(0)
        }
    }

    // get token info for specified owner
    pub fn nft_tokens_for_owner(
        &self,
        account_id: AccountId,
        from_index: Option<U128>,
        limit: Option<u64>,
    ) -> Vec<JsonToken> {
        let tokens_for_owner_set = self.tokens_per_owner.get(&account_id);
        let tokens = if let Some(tokens_for_kind_set) = tokens_for_owner_set {
            tokens_for_kind_set
        } else {
            return vec![];
        };

        let start = u128::from(from_index.unwrap_or(U128(0)));
        tokens
            .iter()
            .skip(start as usize)
            .take(limit.unwrap_or(50) as usize)
            .map(|token_id| self.nft_token(token_id.clone()).unwrap())
            .collect()
    }

+   pub fn nft_tokens_for_kind(
+       &self,
+       token_kind: TokenKind,
+       from_index: Option<U128>,
+       limit: Option<u64>,
+   ) -> Vec<JsonToken> {
+       let tokens_for_kind_set = self.tokens_per_kind.get(&token_kind);
+       let tokens = if let Some(tokens_for_kind_set) = tokens_for_kind_set {
+           tokens_for_kind_set
+       } else {
+           return vec![];
+       };
+
+       let start = u128::from(from_index.unwrap_or(U128(0)));
+       tokens
+           .iter()
+           .skip(start as usize)
+           .take(limit.unwrap_or(50) as usize)
+           .map(|token_id| self.nft_token(token_id.clone()).unwrap())
+           .collect()
+   }
}

```

ここで追加した`nft_tokens_for_kind`は前のレッスンで追加した`nft_tokens_for_owner`とほとんど同じ内容の処理なので説明は割愛します。

この関数によってNFTのkind（候補者か投票券か）を判別してNFTの情報をとってくることができます。

この関数は主に候補者の一覧をフロントで表示するときに使うのですが、もし投票券をもらったのに投票できないだとかすでにもらっているのか確認したいとうい場合にはmintした投票券一覧を取得できます！

```rust
pub fn nft_tokens_for_kind(
        &self,
        token_kind: TokenKind,
        from_index: Option<U128>,
        limit: Option<u64>,
    ) -> Vec<JsonToken> {
        let tokens_for_kind_set = self.tokens_per_kind.get(&token_kind);
        let tokens = if let Some(tokens_for_kind_set) = tokens_for_kind_set {
            tokens_for_kind_set
        } else {
            return vec![];
        };

        let start = u128::from(from_index.unwrap_or(U128(0)));
        tokens
            .iter()
            .skip(start as usize)
            .take(limit.unwrap_or(50) as usize)
            .map(|token_id| self.nft_token(token_id.clone()).unwrap())
            .collect()
    }
```

では最後に`vote.rs`へ移動してしたのように書き換えましょう。

[vote.rs]

```diff
+ use crate::*;
+
+ #[near_bindgen]
+ impl Contract {
+    // check if election is closed
+    pub fn if_election_closed(&self) -> bool {
+        self.is_election_closed
+    }
+
+    // close election
+    pub fn close_election(&mut self) {
+        self.is_election_closed = true;
+    }
+
+    // reopen election
+    pub fn reopen_election(&mut self) {
+        self.is_election_closed = false;
+    }
+    // get number of likes of specified candidate
+    pub fn nft_return_candidate_likes(&self, token_id: TokenId) -> Likes {
+        if self.tokens_by_id.get(&token_id).is_some() {
+            self.likes_per_candidate.get(&token_id).unwrap()
+        } else {
+            0 as Likes
+        }
+    }
+
+    // add info(key: receiver id, value: number ) to map(-> this list is for check voter has already voted)
+    pub fn voter_voted(&mut self, voter_id: AccountId) {
+        self.voted_voter_list.insert(&voter_id, &(0 as u128));
+    }
+
+    // check if voter id is in added-list
+    pub fn check_voter_has_been_added(&self, voter_id: AccountId) -> TokenId {
+        if self.added_voter_list.get(&voter_id).is_some() {
+            return self.added_voter_list.get(&voter_id).unwrap();
+        } else {
+            0
+        }
+    }
+
+    // check if voter id is in voted-list
+    pub fn check_voter_has_voted(&self, voter_id: AccountId) -> bool {
+        if self.voted_voter_list.get(&voter_id).is_some() {
+            return true;
+        } else {
+            false
+        }
+    }
+ }

```

最初の関数はすでに投票が締め切られているかを確認するものです。

```rust
pub fn if_election_closed(&self) -> bool {
        self.is_election_closed
    }
```

次の関数では投票を締め切ったことを示す変数`is_election_closed`を`true`にして投票を締め切った状態にします。

```rust
pub fn close_election(&mut self) {
        self.is_election_closed = true;
    }
```

この関数では投票を締め切ったことを示す変数`is_election_closed`を逆に`false`にして投票を再開することができます。

```rust
pub fn reopen_election(&mut self) {
        self.is_election_closed = false;
    }
```

この関数ではそれぞれの候補者の得票数を個別に呼び出すことができます。

```rust
pub fn nft_return_candidate_likes(&self, token_id: TokenId) -> Likes {
        if self.tokens_by_id.get(&token_id).is_some() {
            self.likes_per_candidate.get(&token_id).unwrap()
        } else {
            0 as Likes
        }
    }
```

この関数は投票が行われた際に、投票を行ったとしてベクターに追加されます。

```rust
pub fn voter_voted(&mut self, voter_id: AccountId) {
        self.voted_voter_list.insert(&voter_id, &(0 as u128));
    }
```

この関数では投票券がmintされているかを確認することができます。

`is_some()`というメソッドはnullではないかという判別をしてくれるものです。

```rust
pub fn check_voter_has_been_added(&self, voter_id: AccountId) -> TokenId {
        if self.added_voter_list.get(&voter_id).is_some() {
            return self.added_voter_list.get(&voter_id).unwrap();
        } else {
            0
        }
    }
```

最後の関数では投票者が投票を行っているかを確認することができます。

ここで最初に`added_voter_list`, `voted_voter_list`と投票券のmintしたユーザーリストと投票をしたユーザーリストを分けた理由を説明すると、

1. 投票券を受け取ってはいるが投票していないユーザー
2. 投票済みのユーザー

を区別して、フロントで返すメッセージを変えるためです。

```rust
pub fn check_voter_has_voted(&self, voter_id: AccountId) -> bool {
        if self.voted_voter_list.get(&voter_id).is_some() {
            return true;
        } else {
            false
        }
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

---

これで投票に関する機能の実装が完了したので、次のセクションで実際に機能しているかを試してみましょう！
