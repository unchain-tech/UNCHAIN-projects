### ⚔️ `cross contract call` の `event pattern` を実装しよう

まだ実装していない残りの機能は以下です！

**バイクを使用するためにユーザがコントラクトへ ft を支払う**  
 処理の流れを整理します。

1. ユーザがバイクを使用するために`bikeコントラクト`へ ft を送信する。
2. `bikeコントラクト`は ft の受信を確認する
3. `bikeコントラクト`は ft の送信者によるバイクの使用手続きを進める

これを実現するには以下の処理を同期的に行う必要があります。

1. ユーザが`ftコントラクト`の ft 転送メソッドを呼ぶ。
2. `ftコントラクト`が`bikeコントラクト`へ ft の転送をするメソッドを実行。
3. ft 転送のメソッドをトリガーに,  
   `bikeコントラクト`は受信した ft の確認, バイクの使用手続きをするメソッドを実行。

あるコントラクトのメソッドの実行が, 他のコントラクトのメソッドの実行に繋がるような機能を  
`cross contract call`の`event pattern`で実装することができます。  
2 つのコントラクトにそのように動作するメソッドをあらかじめ用意しておくのです。  
例えば`ftコントラクト`には`ft_transfer_call`というメソッドが存在します。  
このメソッドは ft の転送を行いますが, 同時に ft の転送をする相手のアカウントに  
`ft_on_transfer`というメソッドを実装したコントラクトがあることを期待します。  
そして ft の転送と共に`ft_on_transfer`の実行を`cross contract call`で行います。  
つまり先ほどの処理フローはこのように書き換えることができます。

1. ユーザが`ftコントラクト`の `ft_transfer_call` メソッドを呼ぶ。
2. `ftコントラクト`が`bikeコントラクト`へ `ft_transfer_call` メソッドを実行。
3. `bikeコントラクト`は`ft_on_transfer`にて ft の確認, バイクの使用手続きを進めます。

`ft_transfer_call`について詳しくは[こちら](https://nomicon.io/Standards/Tokens/FungibleToken/Core)をご覧ください。  
それでは`bikeコントラクト`に`ft_on_transfer`を実装しましょう！  
`src/lib.rs`内をこのように書き換えてください！

```rs
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

    /* use_bikeを削除して, 以降のコードを挿入してください！
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
    // コントラクト内の変数にアクセスしていませんが, viewメソッドにするためには&selfを明記します.
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
            AMOUNT_TO_USE_BIKE.to_string()
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
        // 受信したFTは全て受け取るので, 返却する残金は0.
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
- `ft_on_transfer`を実装し, `use_bike`はそのヘルパー関数として編集。

`ft_on_transfer`のプロトタイプ宣言を[ドキュメント](https://nomicon.io/Standards/Tokens/FungibleToken/Core#reference-level-explanation)や[ソースコード](https://github.dev/near-examples/FT)を参考に実装しています。  
`ft_on_transfer`の引数について整理しましょう。

- `sender_id`: `ft_transfer_call`を呼び出した(つまりユーザの)アカウント ID
- `amount` : ft の量
- `msg` : 何かを伝えるためのメッセージ, オプション

`msg`は`ft_transfer_call`によって実行したい関数が複数存在する場合にどれを実行するのかを指定するなど用途は自由です。  
今回は実行する関数が`use_bike`と決まっているので,  
`msg`を`use_bike`に渡すバイクの index 番号の指定に使用することにします。

`ft_on_transfer`の実装ができたのでテストを書きましょう！  
`integration-tests/rs/src/tests.rs`内に以下のコードを追加しましょう！

```rs
// ...

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    // ...

    // テストに使うアカウントを用意
    let owner = worker.root_account().unwrap();
    let bob = owner
        .create_subaccount(&worker, "bob")
        .initial_balance(parse_near!("100 N"))
        .transact()
        .await?
        .into_result()?;
    // aliceアカウントを追加
    let alice = owner
        .create_subaccount(&worker, "alice")
        .initial_balance(parse_near!("100 N"))
        .transact()
        .await?
        .into_result()?;

    // コントラクトの初期化
    // ...

    // テスト実施
    test_transfer_ft_to_user_inspected_bike(&owner, &bob, &ft_contract, &bike_contract, &worker).await?;
    test_transfer_call_to_use_bike(&owner, &alice, &ft_contract, &bike_contract, &worker).await?; // <- 追加!
    Ok(())
}

// async fn pull_contract ...

// async fn test_transfer_ft_to_user_inspected_bike ...

/// バイクを使用する際にftの転送ができているか確認します。
async fn test_transfer_call_to_use_bike(
    owner: &Account,
    user: &Account,
    ft_contract: &Contract,
    bike_contract: &Contract,
    worker: &Worker<Sandbox>,
) -> anyhow::Result<()> {
    let user_initial_amount = 100;
    let test_bike_index = 0;

    //あらかじめbikeコントラクトのテスト開始時の残高を取得。
    let bike_contract_initial_balance: U128 = ft_contract
        .call(&worker, "ft_balance_of")
        .args_json(json!({"account_id": bike_contract.id()}))?
        .transact()
        .await?
        .json()?;

    // バイクの使用に必要なftの量を取得
    let amount_to_use_bike: U128 = bike_contract
        .call(&worker, "amount_to_use_bike")
        .transact()
        .await?
        .json()?;

    // userのストレージ登録
    user.call(&worker, ft_contract.id(), "storage_deposit")
        .args_json(serde_json::json!({
            "account_id": user.id()
        }))?
        .deposit(1250000000000000000000)
        .gas(300000000000000)
        .transact()
        .await?;

    // userのftの用意
    // ownerからユーザへftを転送
    owner
        .call(&worker, ft_contract.id(), "ft_transfer")
        .args_json(serde_json::json!({
            "receiver_id": user.id(),
            "amount": user_initial_amount.to_string()
        }))?
        .deposit(1)
        .transact()
        .await?;

    // bike_contractへft送信し, バイクの使用を申請します
    user.call(&worker, ft_contract.id(), "ft_transfer_call")
        .args_json(serde_json::json!({
            "receiver_id": bike_contract.id(),
            "amount": amount_to_use_bike.0.to_string(),
            "msg": test_bike_index.to_string(),
        }))?
        .deposit(1)
        .gas(300000000000000)
        .transact()
        .await?;

    // バイクの使用者がuserであるか確認
    let bike_user_id: AccountId = bike_contract
        .call(&worker, "who_is_using")
        .args_json(json!({"index": test_bike_index}))?
        .transact()
        .await?
        .json()?;
    assert_eq!(user.id().clone(), bike_user_id);

    // ユーザはバイクを返却
    user.call(&worker, bike_contract.id(), "return_bike")
        .args_json(serde_json::json!({
            "index": test_bike_index,
        }))?
        .gas(300000000000000)
        .transact()
        .await?;

    // バイク返却後のuserの残高の確認
    let user_balance: U128 = ft_contract
        .call(&worker, "ft_balance_of")
        .args_json(json!({"account_id": user.id()}))?
        .transact()
        .await?
        .json()?;
    assert_eq!(user_balance.0, user_initial_amount - amount_to_use_bike.0);

    // bike_contractの残高の確認
    let bike_contract_balance: U128 = ft_contract
        .call(&worker, "ft_balance_of")
        .args_json(json!({"account_id": bike_contract.id()}))?
        .transact()
        .await?
        .json()?;
    assert_eq!(bike_contract_balance.0, bike_contract_initial_balance.0 + amount_to_use_bike.0);

    println!("      Passed ✅ test_transfer_call_to_use_bike");
    Ok(())
}
//ファイル終端
```

`main`関数の中では新しいテストに使用するアカウントオブジェクト`alice`の作成を追加しています。  
`test_transfer_call_to_use_bike`に今レッスンで実装した内容を確認する新しいテストを実装しております。

それでは`near_bike_share_dapp`内で以下の 2 つを実行しましょう。  
(`m1 mac`の方, または環境を揃えたい方は`git pod`上で実行しましょう。)

```
$ cd integration-tests/rs && cargo run --example integration-tests
```

テストが成功すれば以下のような出力がされます！

![](/public/images/403-NEAR-Sharing-Economy/section-3/3_4_1.png)

### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discord の `#near-sharing-dapp` で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の 3 点を記載してください ✨

```

1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット

```

---

おめでとうございます！  
コントラクトの機能を全て実装し, 結合テストを実行することができました！  
テスト結果を `#near-sharing-dapp` に投稿して、あなたの成功をコミュニティで祝いましょう 🎉  
次のレッスンではさらに機能を増やしていきます！
