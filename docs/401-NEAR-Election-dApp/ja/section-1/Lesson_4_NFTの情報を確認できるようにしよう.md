### 🫣 NFT の情報を確認できるようにしよう

まずは NFT1 つ 1 つの情報を見るための関数をつくります。nft_core.rs に移動して下のコードを追加しましょう。

[nft_core.rs]

```diff
+ // 以下のコードを追加して下さい
use crate::*;

pub trait NonFungibleTokenCore {
    fn nft_token(&self, token_id: TokenId) -> Option<JsonToken>;
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
}

```

ひとつずつ見ていきましょう。まずは`NonFungibleTokenCore`というトレイトに`nft_token`という関数があることを宣言する。ここでは引き数と返り値だけで大丈夫です。

```bash
pub trait NonFungibleTokenCore {
    fn nft_token(&self, token_id: TokenId) -> Option<JsonToken>;
}
```

次の部分では`nft_token関数`の中身を記述します。ここでは引数である token の id に対して metadata が存在するのかを確かめて、ある場合はそれを返すという処理をしています。

```bash
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
}
```

これによってそれぞれの token の metadata を見れるようになりましたが、wallet が NFT を表示できるようにするための関数である`nft_tokens_for_owner関数`がまだ実装できていないので`enumeration.rs`に移動して下のコードを追加しましょう。

[enumeration.rs]

```diff
+ // 以下を追加してください
use crate::*;

#[near_bindgen]
impl Contract {
    pub fn nft_total_supply(&self) -> U128 {
        U128(self.token_metadata_by_id.len() as u128)
    }

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

    pub fn nft_tokens_for_owner(
        &self,
        account_id: AccountId,
        from_index: Option<U128>,
        limit: Option<u64>,
    ) -> Vec<JsonToken> {
        let tokens_for_owner_set = self.tokens_per_owner.get(&account_id);
        let tokens = if let Some(tokens_for_owner_set) = tokens_for_owner_set {
            tokens_for_owner_set
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
}


```

最初の`nft_total_supply関数`ではコントラクトに保存されている NFT の数を取得できます。

次の`nft_tokens`ではコントラクトに保管されている全ての NFT の metadata が得られます。

```bash
pub fn nft_total_supply(&self) -> U128 {
        U128(self.token_metadata_by_id.len() as u128)
    }

    pub fn nft_tokens(&self, from_index: Option<U128>, limit: Option<u64>) -> Vec<JsonToken> {
        let start = u128::from(from_index.unwrap_or(U128(0)));
        self.token_metadata_by_id
            .keys()
            .skip(start as usize)
            .take(limit.unwrap_or(50) as usize)
            .map(|token_id| self.nft_token(token_id.clone()).unwrap())
            .collect()
    }
```

この関数では特定の所有者が持つ NFT の数を取得できます。これは wallet 上での表示にも関わってくるので書き漏れのないように特に気をつけてください。

```bash
pub fn nft_supply_for_owner(&self, account_id: AccountId) -> U128 {
        let tokens_for_kind_set = self.tokens_per_owner.get(&account_id);
        if let Some(tokens_for_kind_set) = tokens_for_kind_set {
            U128(tokens_for_kind_set.len() as u128)
        } else {
            U128(0)
        }
    }
```

引数としてはユーザーの Wallet Id をとります。`from_index、limit` は対象のユーザーがたくさん NFT を持っているときに NFT のリストのどこからどこまでを取得するかを指定するために用意されています。

返り値として metadata と owner の id が入っている`JsonToken`型のベクターが返ってきます。

```bash
pub fn nft_tokens_for_owner(
        &self,
        account_id: AccountId,
        from_index: Option<U128>,
        limit: Option<u64>,
    )-> Vec<JsonToken>
```

内容としてはまず所有者の token の id から token の id がリスト化されたベクターをとってきます。

その次の処理で token の id のリストの中身が無い場合は新しくインスタンス化します。

最後に先ほど作成した`nft_token関数`を利用して token の metadata とその所有者を紐づけた情報を返します。

```bash
    pub fn nft_tokens_for_owner(
        &self,
        account_id: AccountId,
        from_index: Option<U128>,
        limit: Option<u64>,
    ) -> Vec<JsonToken> {
        let tokens_for_owner_set = self.tokens_per_owner.get(&account_id);
        let tokens = if let Some(tokens_for_owner_set) = tokens_for_owner_set {
            tokens_for_owner_set
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

これでやっと mint 機能とそれを wallet とターミナル上で確認できるようになったので次は実際にコントラクトを deploy して、mint してみましょう！

### 🤞 mint してみよう

mint をしたいところですが、mint ができているかを確認するためにまずは NEAR の Testnet で自分の Wallet を作成する必要があります。
[こちら](https://wallet.testnet.near.org/)から作成してください。

作成が完了したら、まずターミナルでコントラクトのディレクトリ(ここでは`near-election-dapp-contract`)に移動しましょう。

wallet の id をコピーして下のコマンドの`YOUR_WALLET_ID`に入れてターミナルで実行させてください。

```bash
export NFT_CONTRACT_ID=YOUR_WALLET_ID
```

下のコマンドをターミナルを実行させてきちんと`NFT_CONTRACT_ID`という変数にあなたの Wallet Id が入っているかを確認してみましょう。

```bash
echo $NFT_CONTRACT_ID
```

確認ができたら、下のコマンドをターミナルを実行させてログインしましょう。

```bash
near login
```

次に下のコマンドをターミナルを実行させてコードのコンパイルと deploy をしましょう。

ただし、コントラクトディレクトリの名前を変えた方は`near_election_dapp_contract`の部分を自分が変えたディレクトリの名前に変えないとエラーがでてしまいますので気をつけてください！

```bash
set -e && RUSTFLAGS='-C link-arg=-s' cargo build --target wasm32-unknown-unknown --release && near deploy --wasm-file target/wasm32-unknown-unknown/release/near_election_dapp_contract.wasm --accountId $NFT_CONTRACT_ID
```

では初期化するために作った`new_default_meta`を下のコマンドをターミナルを実行させましょう。

```bash
near call $NFT_CONTRACT_ID new_default_meta '{"owner_id": "'$NFT_CONTRACT_ID'"}' --accountId $NFT_CONTRACT_ID
```

これでコントラクトのメタデータを更新できました。最後に下のコマンドをターミナルを実行させて mint をしてみましょう。

コードの`nft_mint`以下では、この関数が必要とする引数を記述しています。他にいい画像などがあればその URL を`media`に入れてもできます！

```bash
near call $NFT_CONTRACT_ID nft_mint '{"metadata": {"title": "Vote Ticket", "description": "First Token", "media": "https://gateway.pinata.cloud/ipfs/QmUs5K3LwdvbhKA58bH9C6FX5Q7Bhsvvg9GRAhr9aVKLyx", "media_CID": "QmUs5K3LwdvbhKA58bH9C6FX5Q7Bhsvvg9GRAhr9aVKLyx","token_kind": "vote"}, "receiver_id": "'$NFT_CONTRACT_ID'"}' --accountId $NFT_CONTRACT_ID --amount 0.1
```

これによって投票券の NFT を mint できました！先ほど作成した Wallet の`Collectibles`を確認してみましょう！下のような NFT が mint できているはずです。
![](/public/images/401-NEAR-Election-dApp/1_1_2.png)

### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discord の `#section-1` で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の 4 点を記載してください ✨

```
1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット
```

---

おめでとうございます！これで mint 機能が完成しました！

セクション 1 は終了です！

ぜひ、mint した投票権 NFT が表示されている Wallet 画面のスクリーンショットを `#section-1` に投稿してください 😊

あなたの成功をコミュニティで祝いましょう 🎉

次のセクションではもう一つのコア機能である`transfer機能`や投票に必要な機能を実装してコントラクトのコーディングは完了になりますので頑張っていきましょう！
