### 📬 transfer 機能を実装しよう

前回のレッスンではmint機能を実装しましたね！

本レッスンではtransfer機能を実装した後に、投票システムに必要な機能を実装していきます。まずは`nft_core.rs`ファイルを下のように書き換えましょう。

[nft_core.rs]

```diff
use crate::*;

pub trait NonFungibleTokenCore {
    fn nft_token(&self, token_id: TokenId) -> Option<JsonToken>;
+   fn nft_transfer(&mut self, receiver_id: AccountId, token_id: TokenId,);
}

#[near_bindgen]
impl NonFungibleTokenCore for Contract {
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

+   #[payable]
+   // transfer token
+   fn nft_transfer(&mut self, receiver_id: AccountId, token_id: TokenId,) {
+       assert!(
+           !(&self.is_election_closed),
+           "You can no longer vote because it's been closed!"
+       );
+       assert_one_yocto();
+       let sender_id = env::predecessor_account_id();
+
+       self.internal_transfer(&sender_id, &receiver_id, &token_id);
+   }
}

```

追加した`nft_transfer関数`は引数として、送る相手のWallet Idと送るNFTのIdを受け取ります。

関数の内容としては投票が終わっているかどうかを確認します。その後`assert_one_yocto関数`で1yoctoNEARがattachされているかを確認します。`yocto`とはNEARにおける単位でEthereumのweiと同じようなものです。確認する理由はプログラムの安全性の問題があるからです。

その後NFTの送信者のアドレスと一緒に`internal_transfer関数`への引数として渡してtransferします。

```
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
```

では`internal.rs`に移動してtransferの本質的な処理を実装していきます。下のコードに書き換えてください。

[internal.rs]

```diff
use crate::*;
use near_sdk::CryptoHash;

// hash account id
pub(crate) fn hash_account_id(account_id: &AccountId) -> CryptoHash {
    let mut hash = CryptoHash::default();

    hash.copy_from_slice(&env::sha256(account_id.as_bytes()));
    hash
}

+ // confirm caller attached one yoctoNEAR
+ pub(crate) fn assert_one_yocto() {
+   assert_eq!(
+        env::attached_deposit(),
+        1,
+        "Requires attached deposit of exactly 1 yoctoNEAR",
+    )
+ }

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

impl Contract {
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

+   pub(crate) fn internal_remove_token_from_owner(
+       &mut self,
+       account_id: &AccountId,
+       token_id: &TokenId,
+   ) {
+       let mut tokens_set = self
+           .tokens_per_owner
+           .get(account_id)
+           //if there is no set of tokens for the owner, we panic with the following message:
+           .expect("Token should be owned by the sender");
+
+       tokens_set.remove(token_id);
+
+       if tokens_set.is_empty() {
+           self.tokens_per_owner.remove(account_id);
+       } else {
+           self.tokens_per_owner.insert(account_id, &tokens_set);
+       }
+   }
+
+   // transfer token
+   pub(crate) fn internal_transfer(
+       &mut self,
+       sender_id: &AccountId,
+       receiver_id: &AccountId,
+       token_id: &TokenId,
+   ) -> TokenOwner {
+       let token = self.tokens_by_id.get(token_id).expect("No token");
+
+       if sender_id != &token.owner_id {
+           env::panic_str("Unauthorized");
+       }
+
+       assert_ne!(
+           &token.owner_id, receiver_id,
+           "The token owner and the receiver should be different"
+       );
+
+       self.internal_remove_token_from_owner(&token.owner_id, token_id);
+
+       self.internal_add_token_to_owner(receiver_id, token_id);
+
+       let new_token = TokenOwner {
+           owner_id: receiver_id.clone(),
+       };
+
+       self.tokens_by_id.insert(token_id, &new_token);
+       token
+   }
+}

```

順番に見ていきましょう

こちらは1yoctoNEARがattachされていることを確認しています。

```
pub(crate) fn assert_one_yocto() {
    assert_eq!(
        env::attached_deposit(),
        1,
        "Requires attached deposit of exactly 1 yoctoNEAR",
    )
}
```

この関数では引数として取りいれたユーザーのidと送りたいtokenのidを用いて、そのユーザーがもっているNFTをリストから削除します。

```
pub(crate) fn internal_remove_token_from_owner(
        &mut self,
        account_id: &AccountId,
        token_id: &TokenId,
    ) {
        let mut tokens_set = self
            .tokens_per_owner
            .get(account_id)
            //if there is no set of tokens for the owner, we panic with the following message:
            .expect("Token should be owned by the sender");

        tokens_set.remove(token_id);

        if tokens_set.is_empty() {
            self.tokens_per_owner.remove(account_id);
        } else {
            self.tokens_per_owner.insert(account_id, &tokens_set);
        }
    }
```

次のこの関数では送り主、受け取るユーザーそれぞれのWallet Idを受け取ります。

まずは送り主と受取人のidが一致していないことを確認します。

これをクリアしたら`tokens_per_owner`というmapから元の所有者のtokenのidと所有者のmapを消し、新しい所有者のtokenのidと所有者のmapを追加します。

```
// transfer token
    pub(crate) fn internal_transfer(
        &mut self,
        sender_id: &AccountId,
        receiver_id: &AccountId,
        token_id: &TokenId,
    ) -> TokenOwner {
        let token = self.tokens_by_id.get(token_id).expect("No token");

        if sender_id != &token.owner_id {
            env::panic_str("Unauthorized");
        }

        assert_ne!(
            &token.owner_id, receiver_id,
            "The token owner and the receiver should be different"
        );

        self.internal_remove_token_from_owner(&token.owner_id, token_id);

        self.internal_add_token_to_owner(receiver_id, token_id);

        let new_token = TokenOwner {
            owner_id: receiver_id.clone(),
        };

        self.tokens_by_id.insert(token_id, &new_token);
        token
    }
```

これでNFTのtransfer機能が完成しました！

ではmintした後にそのNFTをtransferしてみましょう！

### 📝 transfer のテスト

transferの実装は成功したので、それが機能しているのかテストしてみましょう。

まずはNFTを送る別のwalletを作成しましょう。NEARの管理画面の右上のAccont IDの部分をクリックすると`+ Create New Account`というボタンがあると思います。そこから新しいWallet IDを作成してください。

次に、編集したコードを反映させるためにコードのコンパイル＋デプロイでコントラクトを更新してみましょう。

下のコマンドを`NEAR-Election-dApp`にいる状態で実行してください（うまくいかない場合は新しくwalletを作ってそのアドレスを使ってdeployしてみましょう）。


```
yarn contract build
yarn contract deploy
```

コントラクトの更新ができたので、次は`packages/contract`へ移動して下のコマンドを実行し新しくNFTをmintしてみましょう。

```
near call $NFT_CONTRACT_ID nft_mint '{"metadata": {"title": "Tonny(candidate)", "description": "Fifth Token", "media": "https://gateway.pinata.cloud/ipfs/QmTGtuh3c1qaMdiBUnbiF9k2M3Yr4gZn8yixtAQuVvZueW", "media_CID": "QmTGtuh3c1qaMdiBUnbiF9k2M3Yr4gZn8yixtAQuVvZueW", "candidate_name": "Tonny", "candidate_manifest": "Be yourself everyone else is already taken.", "token_kind": "candidate"}, "receiver_id": "'$NFT_CONTRACT_ID'"}' --accountId $NFT_CONTRACT_ID --amount 0.1
```

次にdeloyするために下のコマンドをターミナルで実行し、必要なtokenのidを確かめましょう。

```
near view $NFT_CONTRACT_ID nft_tokens
```

下のようなメッセージが返ってくるはずです。

`owner_id`の部分は自分の作ったwalletのidになっているはずです。

```
[
  {
    owner_id: 'dev_account_46.testnet',
    metadata: {
      title: 'Vote Ticket',
      description: 'First Token',
      media: 'https://gateway.pinata.cloud/ipfs/QmUs5K3LwdvbhKA58bH9C6FX5Q7Bhsvvg9GRAhr9aVKLyx',
      media_CID: 'QmUs5K3LwdvbhKA58bH9C6FX5Q7Bhsvvg9GRAhr9aVKLyx',
      candidate_name: null,
      candidate_manifest: null,
      token_kind: 'vote',
      token_id: 0
    }
  },
  {
    owner_id: 'dev_account_46.testnet',
    metadata: {
      title: 'Tonny(candidate)',
      description: 'Fifth Token',
      media: 'https://gateway.pinata.cloud/ipfs/QmTGtuh3c1qaMdiBUnbiF9k2M3Yr4gZn8yixtAQuVvZueW',
      media_CID: 'QmTGtuh3c1qaMdiBUnbiF9k2M3Yr4gZn8yixtAQuVvZueW',
      candidate_name: 'Tonny',
      candidate_manifest: 'Be yourself everyone else is already taken.',
      token_kind: 'candidate',
      token_id: 1
    }
  }
]
```

では2つ目のトークンを新しく作ったwalletに送ってみましょう！

下のコマンドの`NEW_WALLET_ID`に新しいWallet Idを入れて実行させてみましょう。

```
near call $NFT_CONTRACT_ID nft_transfer '{"receiver_id": "NEW_WALLET_ID", "token_id": 1}' --accountId $NFT_CONTRACT_ID --depositYocto 1
```

成功していれば下のように新しいwalletで見ることができます。
![](/public/images/NEAR-Election-dApp/section-2/2_1_1.png)

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

これでtransfer機能が実装できたので、次のレッスンで投票に必要な関数を実装しいきましょう！
