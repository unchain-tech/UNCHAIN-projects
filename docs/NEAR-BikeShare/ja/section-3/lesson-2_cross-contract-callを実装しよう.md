### ⚔️ `cross contract call`を実装しよう

これまでのレッスンの中で
アカウントが他のアカウントにftを転送するには`ftコントラクト`のメソッドを呼び出せばよいことがわかりました。
そして本プロジェクトではいくつか必要な機能がまだ残っています。
そのうちの１つが
**`bikeコントラクト`からバイクの点検をしてくれたユーザへ報酬として ft を支払う**
という機能です。
この場合の処理の流れを整理します。

1. バイクを点検中のユーザがバイクの返却を`bikeコントラクト`に申請する。
2. `bikeコントラクト`はユーザのアカウントIDを照合し報酬としてftをユーザへ転送。
3. `bikeコントラクト`はftの転送後、バイクの返却手続きを進める。

これを実現するには以下の処理を同期的に行う必要があります。

1. ユーザが`bikeコントラクト`のバイク返却メソッドを呼ぶ。
2. `bikeコントラクト`が`ftコントラクト`のft転送メソッドを呼ぶ。
3. **ft の転送が成功していれば**`bikeコントラクト`の返却処理を進める。

`cross contract call`と`callback`関数という機能を使用してこの機能を実装します。
`cross contract call`はあるコントラクトから別のコントラクトのメソッドを呼び出す仕組みです。
`callback`関数は`cross contract call`の結果に対応した処理を行う際に使用します。
まずはコントラクト内に下記のコードを追加してください！

```rust
// lib.rs

use near_sdk::{
    borsh::{self, BorshDeserialize, BorshSerialize},
    env, ext_contract, log, near_bindgen, AccountId, Gas, Promise, PromiseResult,
};

const FT_CONTRACT_ACCOUNT: &str = "sub.ft_account.testnet"; // <- あなたのftコントラクトをデプロイしたアカウントに変更してください！
const AMOUNT_REWARD_FOR_INSPECTIONS: u128 = 15;

/// 外部コントラクト(ftコントラクト)に実装されているメソッドをトレイトで定義
#[ext_contract(ext_ft)]
trait FungibleToken {
    fn ft_transfer(&mut self, receiver_id: String, amount: String, memo: Option<String>);
}

const DEFAULT_NUM_OF_BIKES: usize = 5;

/// バイクの状態遷移を表します。
// ...

/// コントラクトを定義します
#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize)]
pub struct Contract {
    bikes: Vec<Bike>,
}

/// デフォルト処理を定義します。
// ...

/// メソッドの実装です。
#[near_bindgen]
impl Contract {
    // ...
    pub fn inspect_bike(&mut self, index: usize) {
        // ...
    }

    // バイク 使用中or点検中 -> 使用可
    pub fn return_bike(&mut self, index: usize) {
        let user_id = env::predecessor_account_id();
        log!("{} returns bike", &user_id);

        match &self.bikes[index] {
            Bike::Available => panic!("Bike is already available"),
            Bike::InUse(user) => {
                assert_eq!(user.clone(), user_id, "Fail due to wrong account");
                self.bikes[index] = Bike::Available
            }
            Bike::Inspection(inspector) => {
                assert_eq!(inspector.clone(), user_id, "Fail due to wrong account");
                Self::return_inspected_bike(index); // <- 関数実行に変更！
            }
        };
    }

    /// 点検中から返却に変更する際の挙動を定義します。
    /// 点検をしてくれたユーザに報酬(ft)を支払い、コールバックで返却処理をします。
    pub fn return_inspected_bike(index: usize) -> Promise {
        let contract_id = FT_CONTRACT_ACCOUNT.parse().unwrap();
        let amount = AMOUNT_REWARD_FOR_INSPECTIONS.to_string();
        let receiver_id = env::predecessor_account_id().to_string();

        log!(
            "{} transfer to {}: {} FT",
            env::current_account_id(),
            &receiver_id,
            &amount
        );

        // cross contract call (contract_idのft_transfer()メソッドを呼び出す)
        ext_ft::ext(contract_id)
            .with_attached_deposit(1)
            .ft_transfer(receiver_id, amount, None)
            .then(
                // callback (自身のcallback_return_bike()メソッドを呼び出す)
                Self::ext(env::current_account_id())
                    .with_static_gas(Gas(3_000_000_000_000))
                    .callback_return_bike(index),
            )
    }

    /// cross contract call の結果を元に処理を条件分岐します。
    // #[private]: predecessor(このメソッドを呼び出しているアカウント)とcurrent_account(このコントラクトのアカウント)が同じことをチェックするマクロです.
    // callbackの場合、コントラクトが自身のメソッドを呼び出すことを期待しています.
    #[private]
    pub fn callback_return_bike(&mut self, index: usize) {
        assert_eq!(env::promise_results_count(), 1, "This is a callback method");
        match env::promise_result(0) {
            PromiseResult::NotReady => unreachable!(),
            PromiseResult::Failed => panic!("Fail cross-contract call"),
            // 成功時のみBikeを返却(使用可能に変更)
            PromiseResult::Successful(_) => self.bikes[index] = Bike::Available,
        }
    }
}

// ...
```

変更点を見ていきましょう。
`cross contract call`を使用するには、呼び出す外部コントラクトのメソッドをトレイトで定義しておきます。
今回はftコントラクトの`ft_transfer`メソッドを呼び出すので[ドキュメント](https://nomicon.io/Standards/Tokens/FungibleToken/Core#reference-level-explanation)や[ソースコード](https://github.com/near-examples/FT)を参考に`ft_transfer`のプロトタイプ宣言をここで記述します。
トレイトの注釈には`#[ext_contract(ext_ft)]`をつけます。
`ext_ft`は後でメソッド呼び出しに使用する略称で任意の名前です。
また`FungibleToken`も任意の名前です。
文法に関して詳しくは[こちら](https://www.near-sdk.io/cross-contract/callbacks)を参照してください。

```rust
/// 外部コントラクト(ftコントラクト)に実装されているメソッドをトレイトで定義
#[ext_contract(ext_ft)]
trait FungibleToken {
    fn ft_transfer(&mut self, receiver_id: String, amount: String, memo: Option<String>);
}
```

続いて`return_bike`メソッドに新たに追加された関数を見ていきましょう。

```rust
/// メソッドの実装です。
#[near_bindgen]
impl Contract {
    // ...

    // バイク 使用中or点検中 -> 使用可
    pub fn return_bike(&mut self, index: usize) {
      // ...

        match &self.bikes[index] {
            // ...
            Bike::Inspection(inspector) => {
                assert_eq!(inspector.clone(), user_id, "Fail due to wrong account");
                Self::return_inspected_bike(index); // <- 関数実行に変更！
            }
        };
    }

    /// 点検中から返却に変更する際の挙動を定義します。
    /// 点検をしてくれたユーザに報酬(ft)を支払い、コールバックで返却処理をします。
    pub fn return_inspected_bike(index: usize) -> Promise {
        let contract_id = FT_CONTRACT_ACCOUNT.parse().unwrap();
        let amount = AMOUNT_REWARD_FOR_INSPECTIONS.to_string();
        let receiver_id = env::predecessor_account_id().to_string();

        log!(
            "{} transfer to {}: {} FT",
            env::current_account_id(),
            &receiver_id,
            &amount
        );

        // cross contract call (contract_idのft_transfer()メソッドを呼び出す)
        ext_ft::ext(contract_id)
            .with_attached_deposit(1)
            .ft_transfer(receiver_id, amount, None)
            .then(
                // callback (自身のcallback_return_bike()メソッドを呼び出す)
                Self::ext(env::current_account_id())
                    .with_static_gas(Gas(3_000_000_000_000))
                    .callback_return_bike(index),
            )
    }

    // ...
}
```

`return_inspected_bike`関数は`cross contract call`によってftをreceiver_idへ送信,
その後の処理を`callback`関数で行っています。
`cross contract call`を実行するためには先ほど定義した`ext_ft`を使用して外部メソッドの呼び出しを行います。
そして`then`で、外部コントラクトのメソッド呼び出し後に実行するアクションとして`callback`関数を待機させます。

> `cross contract call`の裏で起きていることについて
> コントラクト A での`cross contract call`の呼び出しを受け付けたランタイム(コントラクトを実行するレイヤ)は,
> `callback`関数のアクションを待機させつつ、外部コントラクト B のメソッドを呼び出すことを[receipt](https://nomicon.io/RuntimeSpec/Receipts)を通して次のブロックに知らせます。
> 次のブロックでは`receipt`により(コントラクト B を含んだシャードにて)メソッドが実行されます。
> そしてその実行結果はまた`receipt`を通して次のブロックへ伝えられます。
> 次のブロックでは(コントラクト A を含んだシャードにて)待機されていた`callback`関数の実行が行われます。

文法に関して詳しくは[こちら](https://www.near-sdk.io/cross-contract/callbacks)を参照してください。

最後に、`callback`関数では`cross contract call`の結果をenvを通して取得し処理をしています。

### 💁 コントラクトをアップデートしよう

ここで、コントラクトを少しアップデートします。
今までコントラクトの初期化には`default`関数を使用していました。
コード内該当箇所。

```rust
// lib.rs

const DEFAULT_NUM_OF_BIKES: usize = 5;

/// コントラクトを定義します
#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize)]
pub struct Contract {
    bikes: Vec<Bike>,
}

/// デフォルト処理を定義します。
impl Default for Contract {
    fn default() -> Self {
      //　...
    }
}
```

ですが、初期値を引数で渡したい時もあります。
その時は`#[init]`の注釈をつけたメソッドをストラクトに定義することで可能です。
用意していた`Default`の実装を削除し、以下のようなメソッドを追加します。
(`PanicOnDefault`は`Default`の実装をしないことを明記するものです)

```rust
/// コントラクトを定義します
#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize, PanicOnDefault)] // <- PanicOnDefault 追加
pub struct Contract {
    bikes: Vec<Bike>,
}

/* Defaultの実装を削除してください
impl Default for Contract {
    fn default() -> Self {
        Self {
            bikes: {
                let mut bikes = Vec::new();
                for _i in 0..DEFAULT_NUM_OF_BIKES {
                    bikes.push(Bike::Available);
                }
                bikes
            },
        }
    }
}
*/

/// メソッドの実装です。
#[near_bindgen]
impl Contract {
    /// init関数の実装です。
    #[init]
    pub fn new(num_of_bikes: usize) -> Self {
        log!("initialize Contract with {} bikes", num_of_bikes);
        Self {
            bikes: {
                let mut bikes = Vec::new();
                for _i in 0..num_of_bikes {
                    bikes.push(Bike::Available);
                }
                bikes
            },
        }
    }

  // ...
}
```

テストコードで使用していた`default`を`new`に変更しましょう！

```rust
#[cfg(test)]
mod tests {
    // ...

    #[test]
    fn check_default() {
        let mut context = get_context(accounts(1));
        testing_env!(context.build());
        let init_num = 5; // <- 初期値を用意
        let contract = Contract::new(init_num); // <- newへ変更！

        // view関数の実行のみ許可する環境に初期化
        testing_env!(context.is_view(true).build());

        assert_eq!(contract.num_of_bikes(), init_num);
        for i in 0..init_num {
            assert!(contract.is_available(i))
        }
    }

    #[test]
    fn check_inspecting_account() {
        // ...
        let mut contract = Contract::new(5); // <- newへ変更！
        // ...
    }

    #[test]
    fn return_by_other_account() {
        // ...
        let mut contract = Contract::new(5); // <- newへ変更！
        // ...
    }
}
```

`DEFAULT_NUM_OF_BIKES`は使用しなくなったので削除しましょう。

これまでの編集の結果、ファイルの中身はこのようになります。

```rust
// lib.rs

use near_sdk::{
    borsh::{self, BorshDeserialize, BorshSerialize},
    env, ext_contract, log, near_bindgen, AccountId, Gas, PanicOnDefault, Promise, PromiseResult,
};

const FT_CONTRACT_ACCOUNT: &str = "sub.ft_account.testnet"; // <- あなたのftコントラクトをデプロイしたアカウントに変更してください！
const AMOUNT_REWARD_FOR_INSPECTIONS: u128 = 15;

/// 外部コントラクト(ftコントラクト)に実装されているメソッドをトレイトで定義
#[ext_contract(ext_ft)]
trait FungibleToken {
    fn ft_transfer(&mut self, receiver_id: String, amount: String, memo: Option<String>);
}

/// バイクの状態遷移を表します。
#[derive(BorshDeserialize, BorshSerialize)]
enum Bike {
    Available,             // 使用可能
    InUse(AccountId),      // AccountIdによって使用中
    Inspection(AccountId), // AccountIdによって点検中
}

/// コントラクトを定義します
#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize, PanicOnDefault)]
pub struct Contract {
    bikes: Vec<Bike>,
}

/// メソッドの実装です。
#[near_bindgen]
impl Contract {
    /// init関数の実装です。
    #[init]
    pub fn new(num_of_bikes: usize) -> Self {
        log!("initialize Contract with {} bikes", num_of_bikes);
        Self {
            bikes: {
                let mut bikes = Vec::new();
                for _i in 0..num_of_bikes {
                    bikes.push(Bike::Available);
                }
                bikes
            },
        }
    }

    /// バイクの数を返却します。
    pub fn num_of_bikes(&self) -> usize {
        self.bikes.len()
    }

    /// indexで指定されたバイクが使用可能かどうかを判別します。
    pub fn is_available(&self, index: usize) -> bool {
        matches!(self.bikes[index], Bike::Available)
    }

    /// indexで指定されたバイクが使用中の場合は使用者のアカウントidを返却します。
    pub fn who_is_using(&self, index: usize) -> Option<AccountId> {
        match &self.bikes[index] {
            Bike::InUse(user_id) => Some(user_id.clone()),
            _ => None,
        }
    }

    /// indexで指定されたバイクが点検中の場合は点検者のアカウントidを返却します。
    pub fn who_is_inspecting(&self, index: usize) -> Option<AccountId> {
        match &self.bikes[index] {
            Bike::Inspection(inspector_id) => Some(inspector_id.clone()),
            _ => None,
        }
    }

    // バイク 使用可 -> 使用中
    pub fn use_bike(&mut self, index: usize) {
        // env::predecessor_account_id(): このメソッドを呼び出しているアカウント名を取得
        let user_id = env::predecessor_account_id();
        log!("{} uses bike", &user_id);

        match &self.bikes[index] {
            Bike::Available => self.bikes[index] = Bike::InUse(user_id),
            _ => panic!("Bike is not available"),
        }
    }

    // バイク 使用可 -> 点検中
    pub fn inspect_bike(&mut self, index: usize) {
        let user_id = env::predecessor_account_id();
        log!("{} inspects bike", &user_id);

        match &self.bikes[index] {
            Bike::Available => self.bikes[index] = Bike::Inspection(user_id),
            _ => panic!("Bike is not available"),
        }
    }

    // バイク 使用中or点検中 -> 使用可
    pub fn return_bike(&mut self, index: usize) {
        let user_id = env::predecessor_account_id();
        log!("{} returns bike", &user_id);

        match &self.bikes[index] {
            Bike::Available => panic!("Bike is already available"),
            Bike::InUse(user) => {
                assert_eq!(user.clone(), user_id, "Fail due to wrong account");
                self.bikes[index] = Bike::Available
            }
            Bike::Inspection(inspector) => {
                assert_eq!(inspector.clone(), user_id, "Fail due to wrong account");
                Self::return_inspected_bike(index);
            }
        };
    }

    /// 点検中から返却に変更する際の挙動を定義します。
    /// 点検をしてくれたユーザに報酬(ft)を支払い、コールバックで返却処理をします。
    pub fn return_inspected_bike(index: usize) -> Promise {
        let contract_id = FT_CONTRACT_ACCOUNT.parse().unwrap();
        let amount = AMOUNT_REWARD_FOR_INSPECTIONS.to_string();
        let receiver_id = env::predecessor_account_id().to_string();

        log!(
            "{} transfer to {}: {} FT",
            env::current_account_id(),
            &receiver_id,
            &amount
        );

        // cross contract call (contract_idのft_transfer()メソッドを呼び出す)
        ext_ft::ext(contract_id)
            .with_attached_deposit(1)
            .ft_transfer(receiver_id, amount, None)
            .then(
                // callback (自身のcallback_return_bike()メソッドを呼び出す)
                Self::ext(env::current_account_id())
                    .with_static_gas(Gas(3_000_000_000_000))
                    .callback_return_bike(index),
            )
    }

    /// cross contract call の結果を元に処理を条件分岐します。
    // #[private]: predecessor(このメソッドを呼び出しているアカウント)とcurrent_account(このコントラクトのアカウント)が同じことをチェックするマクロです.
    // callbackの場合、コントラクトが自身のメソッドを呼び出すことを期待しています.
    #[private]
    pub fn callback_return_bike(&mut self, index: usize) {
        assert_eq!(env::promise_results_count(), 1, "This is a callback method");
        match env::promise_result(0) {
            PromiseResult::NotReady => unreachable!(),
            PromiseResult::Failed => panic!("Fail cross-contract call"),
            // 成功時のみBikeを返却(使用可能に変更)
            PromiseResult::Successful(_) => self.bikes[index] = Bike::Available,
        }
    }
}

#[cfg(test)]
mod tests {
    // テスト環境の構築に必要なものをインポート
    use near_sdk::test_utils::{accounts, VMContextBuilder};
    use near_sdk::testing_env;

    // Contractのモジュールをインポート
    use super::*;

    // VMContextBuilderのテンプレートを用意
    // VMContextBuilder: テスト環境(モックされたブロックチェーン)をcontext(テスト材料)をもとに変更できるインターフェース
    fn get_context(predecessor_account_id: AccountId) -> VMContextBuilder {
        let mut builder = VMContextBuilder::new();
        builder
            .current_account_id(accounts(0)) // accounts(0): テスト用のアカウントリストの中の0番アカウントを取得します.
            .signer_account_id(predecessor_account_id.clone())
            .predecessor_account_id(predecessor_account_id);
        builder
    }

    #[test]
    fn check_default() {
        let mut context = get_context(accounts(1)); // 0以外の番号のアカウントでコントラクトを呼び出します.
        testing_env!(context.build()); // テスト環境を初期化
        let init_num = 5;
        let contract = Contract::new(init_num);

        // view関数の実行のみ許可する環境に初期化
        testing_env!(context.is_view(true).build());

        assert_eq!(contract.num_of_bikes(), init_num);
        for i in 0..init_num {
            assert!(contract.is_available(i))
        }
    }

    // accounts(1)がバイクを点検した後,
    // バイクはaccounts(1)によって点検中になっているかを確認
    #[test]
    fn check_inspecting_account() {
        let mut context = get_context(accounts(1));
        testing_env!(context.build());
        let mut contract = Contract::new(5);

        let test_index = contract.bikes.len() - 1;
        contract.inspect_bike(test_index);

        testing_env!(context.is_view(true).build());

        for i in 0..contract.num_of_bikes() {
            if i == test_index {
                assert_eq!(accounts(1), contract.who_is_inspecting(i).unwrap());
            } else {
                assert!(contract.is_available(i))
            }
        }
    }

    // 別のアカウントが点検中に使用可能に変更->パニックを起こすか確認
    #[test]
    // パニックを起こすべきテストであることを示す注釈
    // expectedを追加することでパニック時のメッセージもテストできる
    #[should_panic(expected = "Fail due to wrong account")]
    fn return_by_other_account() {
        let mut context = get_context(accounts(1));
        testing_env!(context.build());
        let mut contract = Contract::new(5);

        contract.inspect_bike(0);

        testing_env!(context.predecessor_account_id(accounts(2)).build());
        contract.return_bike(0);
    }
}
```

init関数と共にコントラクトをデプロイする際はオプションをつけて指定することができます。
その時の構文は以下のようになります。

```
$ near deploy [contractID] --wasmFile [wasm file path] --initFunction '[func name]'  --initArgs '{"arg_name": "arg_value"}'
```

また、ftをやり取りする機能を`bikeコントラクト`に搭載したので、`bikeコントラクト`はアプリ起動前にftをある程度持っている必要があります。
以上を踏まえて`near_bike_share_dapp`内の`package.json`を編集します。
`package.json`の以下

```js
  "scripts": {
    // ...
    "deploy": "npm run build:contract && near dev-deploy",
    "start": "npm run deploy && echo The app is starting! It will automatically open in your browser when ready && env-cmd -f ./neardev/dev-account.env parcel frontend/index.html --open",
    // ...
  }
```

`deploy`、`start`の2行を以下の4行に変更しましょう。

```js
 "deploy": "npm run build:contract && near dev-deploy --initFunction 'new' --initArgs '{\"num_of_bikes\": 5}'",
  "reset": "rm -f ./neardev/dev-account.env ",
  "init": "export $(cat ./neardev/dev-account.env | xargs) FT_CONTRACT=sub.ft_account.testnet FT_OWNER=ft_account.testnet && near call $FT_CONTRACT storage_deposit '' --accountId $CONTRACT_NAME --amount 0.00125 && near call $FT_CONTRACT ft_transfer '{\"receiver_id\": \"'$CONTRACT_NAME'\", \"amount\": \"100\"}' --accountId $FT_OWNER --amount 0.000000000000000000000001",
  "start": "npm run reset && npm run deploy && npm run init && env-cmd -f ./neardev/dev-account.env parcel frontend/index.html --open",
```

> `near dev-deploy`コマンドは開発用に任意のアカウントを作成しそこにデプロイします。
> そのためデプロイ用のアカウントを作る手間が省けます。
> そして作成されたアカウントの名前は`./neardev/dev-account.env`ファイル内に記載されます。

変更点について

- `deploy`: init関数の実行を追加
- `reset` : 既存の開発アカウントを削除
  init関数を2度実行しようとするとパニックを起こすので、毎度新しいアカウントを作るようにするために使用します。
- `init` : `bikeコントラクト`に100ftを用意(`FT_OWNER`から`CONTRACT_NAME`にftを転送)
  `FT_CONTRACT`を`ftコントラクト`のデプロイされているアカウント名に変更してください。
  `FT_OWNER`をftのowner_idに指定したアカウントに変更してください。
- `start` : reset -> deploy -> init -> parcelの順番に実行

それでは最後に動作確認を行います。
`near_bike_share_dapp`内で下記を実行しましょう。

ユニットテスト(`lib.rs`内に書いたファイル)を実行し確認しましょう。

```
$ yarn test:unit
```

テストが成功すれば、次にブラウザ上で確認します。

```
$ yarn dev
```

適当なユーザでサインインしてから、バイクの点検によってftが支払われているかを確かめましょう。

点検前

![](/public/images/NEAR-BikeShare/section-3/3_2_1.png)

点検後

![](/public/images/NEAR-BikeShare/section-3/3_2_2.png)

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

`cross contract call`を実装してその挙動を確認できました 🎉

次のレッスンではコントラクトを完成させます！
