### ⚔️ `cross contract call`の`event pattern`を実装しよう

まだ実装していない残りの機能は以下です！

**バイクを使用するためにユーザがコントラクトへ ft を支払う**
処理の流れを整理します。

1. ユーザがバイクを使用するために`bikeコントラクト`へftを送信する。
2. `bikeコントラクト`はftの受信を確認する
3. `bikeコントラクト`はftの送信者によるバイクの使用手続きを進める

これを実現するには以下の処理を同期的に行う必要があります。

1. ユーザが`ftコントラクト`のft転送メソッドを呼ぶ。
2. `ftコントラクト`が`bikeコントラクト`へftの転送をするメソッドを実行。
3. ft転送のメソッドをトリガーに,
   `bikeコントラクト`は受信したftの確認、バイクの使用手続きをするメソッドを実行。

あるコントラクトのメソッドの実行が、他のコントラクトのメソッドの実行に繋がるような機能を
`cross contract call`の`event pattern`で実装することができます。
2つのコントラクトにそのように動作するメソッドをあらかじめ用意しておくのです。
例えば`ftコントラクト`には`ft_transfer_call`というメソッドが存在します。
このメソッドはftの転送を行いますが、同時にftの転送をする相手のアカウントに
`ft_on_transfer`というメソッドを実装したコントラクトがあることを期待します。
そしてftの転送と共に`ft_on_transfer`の実行を`cross contract call`で行います。
つまり先ほどの処理フローはこのように書き換えることができます。

1. ユーザが`ftコントラクト`の`ft_transfer_call`メソッドを呼ぶ。
2. `ftコントラクト`が`bikeコントラクト`へ`ft_transfer_call`メソッドを実行。
3. `bikeコントラクト`は`ft_on_transfer`にてftの確認、バイクの使用手続きを進めます。

`ft_transfer_call`について詳しくは[こちら](https://nomicon.io/Standards/Tokens/FungibleToken/Core)をご覧ください。
それでは`bikeコントラクト`に`ft_on_transfer`を実装しましょう！
`src/lib.rs`内をこのように書き換えてください！

```rust
use near_sdk::{
    borsh::{self, BorshDeserialize, BorshSerialize},
    env, ext_contract,
    json_types::{self, U128},
    log, near_bindgen, AccountId, Gas, PanicOnDefault, Promise, PromiseOrValue, PromiseResult,
};

const FT_CONTRACT_ACCOUNT: &str = "sub.ft_account.testnet"; // <- あなたのftコントラクトをデプロイしたアカウントに変更してください！
const AMOUNT_REWARD_FOR_INSPECTIONS: u128 = 15;
const AMOUNT_TO_USE_BIKE: u128 = 30; // <- 追加！

/// 外部コントラクト(ftコントラクト)に実装されているメソッドをトレイトで定義
// ...

/// バイクの状態遷移を表します。
// ...

/// コントラクトを定義します
// ...

/// メソッドの実装です。
#[near_bindgen]
impl Contract {
    // ...

    /* use_bikeを削除して、以降のコードを挿入してください！
    pub fn use_bike(&mut self, index: usize) {
        // env::predecessor_account_id(): このメソッドを呼び出しているアカウント名を取得
        let user_id = env::predecessor_account_id();
        log!("{} uses bike", &user_id);

        match &self.bikes[index] {
            Bike::Available => self.bikes[index] = Bike::InUse(user_id),
            _ => panic!("Bike is not available"),
        }
    }
    */

    /// AMOUNT_TO_USE_BIKEを返却します。
    // コントラクト内の変数にアクセスしていませんが、viewメソッドにするためには&selfを明記します.
    pub fn amount_to_use_bike(&self) -> U128 {
        json_types::U128::from(AMOUNT_TO_USE_BIKE)
    }

    /// 他のコントラクトのft_transfer_call()によるftの転送がトリガーとなって呼び出されるメソッドです.
    /// ft_transfer_call()は転送先のコントラクトにft_on_transfer()があることを期待しています.
    pub fn ft_on_transfer(
        &mut self,
        sender_id: String,
        amount: String,
        msg: String,
    ) -> PromiseOrValue<U128> {
        assert_eq!(
            amount,
            AMOUNT_TO_USE_BIKE.to_string(),
            "Require {} ft to use the bike",
            AMOUNT_TO_USE_BIKE
        );

        log!(
            "in ft_on_transfer: sender:{}, amount:{}, msg:{}",
            sender_id,
            amount,
            msg
        );

        // 使用するバイク: msgによってindexを指定してもらうことを期待
        // sender_id.try_into().unwrap(): String型からAccountId型へ変換しています。
        self.use_bike(msg.parse().unwrap(), sender_id.try_into().unwrap());
        // 受信したFTは全て受け取るので、返却する残金は0.
        PromiseOrValue::Value(U128::from(0))
    }

    /// バイク 使用可 -> 使用中
    fn use_bike(&mut self, index: usize, user_id: AccountId) {
        log!("{} uses bike", &user_id);
        match &self.bikes[index] {
            Bike::Available => self.bikes[index] = Bike::InUse(user_id),
            _ => panic!("Bike is not available"),
        }
    }

    // ...
}
```

主な変更点は以下です。

- `AMOUNT_TO_USE_BIKE`という定数を用意。
  フロント側からその値を取得できるように`amount_to_use_bike`メソッドを実装。
- `ft_on_transfer`を実装し、`use_bike`はそのヘルパー関数として編集。

`ft_on_transfer`のプロトタイプ宣言を[ドキュメント](https://nomicon.io/Standards/Tokens/FungibleToken/Core#reference-level-explanation)や[ソースコード](https://github.dev/near-examples/FT)を参考に実装しています。
`ft_on_transfer`の引数について整理しましょう。

- `sender_id`: `ft_transfer_call`を呼び出した（つまりユーザの）アカウントID
- `amount` : ftの量
- `msg` : 何かを伝えるためのメッセージ、オプション

`msg`は`ft_transfer_call`によって実行したい関数が複数存在する場合にどれを実行するのかを指定するなど用途は自由です。
今回は実行する関数が`use_bike`と決まっているので,
`msg`を`use_bike`に渡すバイクのindex番号の指定に使用することにします。

### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discordの`#near`で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の3点を記載してください ✨

```

1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット

```

---

おめでとうございます！

コントラクトの機能を全て実装することができました！

次のレッスンではさらに機能を増やしていきます！
