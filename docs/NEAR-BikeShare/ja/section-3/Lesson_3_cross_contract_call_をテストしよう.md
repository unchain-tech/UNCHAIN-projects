### 🧪 結合テストの書き方を知ろう

`cross contract call`のテストはユニットテストでは難しいため,  
別のファイルに統合テストとして用意します。  
`near_bike_share_dapp` 直下の `integration-tests`ディレクトリ内を編集していきます。

結合テストを記述するために`integration-tests`内に`rs`という`Rust`プロジェクトを作成します。  
既に`integration-tests`内に`rs`ディレクトリが存在する場合は削除しましょう。

```
$ rm -r rs
```

`integration-tests`ディレクトリ直下で以下のコマンドを実行し, 新たな`Rust`プロジェクトを作成します。

```
$ cargo new rs
```

`rs`ディレクトリへ移動し, `.gitignore`ファイルを追加します。

```
$ cd rs
$ touch .gitignore
```

`.gitignore`の中身は以下を記述してください。

```
/target
```

次に`rs/src`ディレクトリ内の`main.rs`のファイル名を`tests.rs`に変更します。

```
$ mv src/main.rs src/tests.rs
```

フォルダ構成は以下のようになります。  
(`rs`ディレクトリに関連したもののみ表示しています)。

```
integration-tests
└── rs
    ├── .gitignore
    ├── Cargo.toml
    └── src
        └── tests.rs
```

`Cargo.toml`ファイルを以下のように書き換えてください。

```js
[package]
edition = "2018"
name = "integration-tests"
publish = false
version = "1.0.0"

[dev-dependencies]
anyhow = "1.0"
borsh = "0.9"
maplit = "1.0"
near-sdk = "4.0.0"
near-units = "0.2.0"
# arbitrary_precision enabled for u128 types that workspaces requires for Balance types
pkg-config = "0.3.1"
serde_json = {version = "1.0", features = ["arbitrary_precision"]}
tokio = {version = "1.18.1", features = ["full"]}
tracing = "0.1"
tracing-subscriber = {version = "0.3.11", features = ["env-filter"]}
workspaces = "0.4.0"

[[example]]
name = "integration-tests"
path = "src/tests.rs"
```

`src/tests.rs`ファイルを以下のように書き換えてください。

```rs
use near_sdk::json_types::U128;
use near_units::{parse_near};
use serde_json::json;
use workspaces::prelude::*;
use workspaces::{network::Sandbox, Account, Contract, Worker, AccountId};

const BIKE_WASM_FILEPATH: &str = "../../out/main.wasm";
const FT_CONTRACT_ACCOUNT: &str = "sub.ft_account.testnet"; // <- あなたのftコントラクトをデプロイしたアカウント名に変更してください

const FT_TOTAL_SUPPLY: u128 = 1000;

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    // テスト環境の初期化
    let worker = workspaces::sandbox().await?;

    // 各コントラクトの用意
    let bike_wasm = std::fs::read(BIKE_WASM_FILEPATH)?;
    let bike_contract = worker.dev_deploy(&bike_wasm).await?;
    let ft_contract = pull_contract(&worker).await?;

    // テストに使うアカウントを用意
    let owner = worker.root_account().unwrap();
    let bob = owner
        .create_subaccount(&worker, "bob")
        .initial_balance(parse_near!("100 N"))
        .transact()
        .await?
        .into_result()?;

    // コントラクトの初期化
    ft_contract
        .call(&worker, "new_default_meta")
        .args_json(serde_json::json!({
            "owner_id": owner.id(),
            "total_supply": FT_TOTAL_SUPPLY.to_string(),
        }))?
        .transact()
        .await?;
    bike_contract
        .call(&worker, "new")
        .args_json(serde_json::json!({
            "num_of_bikes": 5
        }))?
        .transact()
        .await?;
    bike_contract
        .as_account()
        .call(&worker, ft_contract.id(), "storage_deposit")
        .args_json(serde_json::json!({
            "account_id": bike_contract.id()
        }))?
        .deposit(1250000000000000000000)
        .gas(300000000000000)
        .transact()
        .await?;

    // テスト実施
    test_transfer_ft_to_user_inspected_bike(&owner, &bob, &ft_contract, &bike_contract, &worker).await?;
    Ok(())
}

/// 既にデプロイされているコントラクトを取得します。
async fn pull_contract(worker: &Worker<Sandbox>) -> anyhow::Result<Contract> {
    let testnet = workspaces::testnet_archival().await?;
    let contract_id: AccountId = FT_CONTRACT_ACCOUNT.parse()?;

    let contract = worker
        .import_contract(&contract_id, &testnet)
        .initial_balance(parse_near!("1000 N"))
        .transact()
        .await?;

    Ok(contract)
}

/// バイクを点検をしてくれたユーザへ報酬を支払えているかのテストを行います。
async fn test_transfer_ft_to_user_inspected_bike(
    owner: &Account,
    user: &Account,
    ft_contract: &Contract,
    bike_contract: &Contract,
    worker: &Worker<Sandbox>,
) -> anyhow::Result<()> {
    let remuneration_amount = 15;
    let test_bike_index = 0;

    // userのストレージ登録
    user.call(&worker, ft_contract.id(), "storage_deposit")
        .args_json(serde_json::json!({
            "account_id": user.id()
        }))?
        .deposit(1250000000000000000000)
        .gas(300000000000000)
        .transact()
        .await?;

    // bike_contractのFTの用意
    // ownerからbike_contractへftを転送
    owner
        .call(&worker, ft_contract.id(), "ft_transfer")
        .args_json(serde_json::json!({
            "receiver_id": bike_contract.id(),
            "amount": "50".to_string()
        }))?
        .deposit(1)
        .transact()
        .await?;

    // この時点でのuserの残高確認
    let user_balance: U128 = ft_contract
        .call(&worker, "ft_balance_of")
        .args_json(json!({"account_id": user.id()}))?
        .transact()
        .await?
        .json()?;
    assert_eq!(user_balance.0, 0);

    // ユーザによってバイクを点検
    user.call(&worker, bike_contract.id(), "inspect_bike")
        .args_json(serde_json::json!({
            "index": test_bike_index,
        }))?
        .gas(300000000000000)
        .transact()
        .await?;

    // 点検中のuserの残高確認
    let user_balance: U128 = ft_contract
        .call(&worker, "ft_balance_of")
        .args_json(json!({"account_id": user.id()}))?
        .transact()
        .await?
        .json()?;
    assert_eq!(user_balance.0, 0);

    // バイクを返却
    user.call(&worker, bike_contract.id(), "return_bike")
        .args_json(serde_json::json!({
            "index": test_bike_index,
        }))?
        .gas(300000000000000)
        .transact()
        .await?;

    // バイク返却後のuserの残高が増えていることを確認
    let user_balance: U128 = ft_contract
        .call(&worker, "ft_balance_of")
        .args_json(json!({"account_id": user.id()}))?
        .transact()
        .await?
        .json()?;
    assert_eq!(user_balance.0, remuneration_amount);

    println!("      Passed ✅ test_transfer_ft_to_user_inspected_bike");
    Ok(())
}
```

統合テストでは[workspaces](https://github.com/near/workspaces-rs)というライブラリを使用してテスト環境を使用することができます。  
簡単に流れを見ていきましょう。

**コントラクトオブジェクトの用意**  
`main`関数内に注目すると, テストで使用するコントラクトオブジェクトをそれぞれ用意しています。  
コントラクトオブジェクトは wasm ファイル, または既にデプロイされているコントラクトから取得することができます。
今回は 2 通りで行っています。

- `bikeコントラクト`: wasm ファイルから
- `ftコントラクト` : 既にデプロイされているコントラクトを testnet から(`pull_contract`関数内)

コード内該当箇所

```rs
const BIKE_WASM_FILEPATH: &str = "../../out/main.wasm";
const FT_CONTRACT_ACCOUNT: &str = "sub.ft_account.testnet"; // <- あなたのftコントラクトをデプロイしたアカウント名に変更してください

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    // テスト環境の初期化
    let worker = workspaces::sandbox().await?;

    // 各コントラクトの用意
    let bike_wasm = std::fs::read(BIKE_WASM_FILEPATH)?;
    let bike_contract = worker.dev_deploy(&bike_wasm).await?;

    let ft_contract = pull_contract(&worker).await?;

    // ...
}

/// 既にデプロイされているコントラクトを取得します。
async fn pull_contract(worker: &Worker<Sandbox>) -> anyhow::Result<Contract> {
    let testnet = workspaces::testnet_archival().await?;
    let contract_id: AccountId = FT_CONTRACT_ACCOUNT.parse()?;

    let contract = worker
        .import_contract(&contract_id, &testnet)
        .initial_balance(parse_near!("1000 N"))
        .transact()
        .await?;

    Ok(contract)
}

// ...
```

その他`main`関数内でセットアップをした後, 実際のテストは`test_transfer_ft_to_user_inspected_bike`関数内で定義しています。  
テスト自体は簡単で, ユーザがバイクを点検・返却のアクションの中でしっかり ft を報酬として受け取れているかを確認しています。

> `U128`という型について  
> フロントエンドとのデータのやり取りの部分でよく出てくる型です。  
> javascript の数字は `2^53-1` よりも大きくできません。  
> そして ft の量を扱うときには Rust 側で`u128`型を使うことが一般的です。(yoctoNEAR が存在するので)  
> つまり`u128`型を返却するメソッドをフロントエンド側から呼び出した時,  
> JSON から javascript へのデシリアライズの際に精度が落ちる可能性があります。  
> そこで`U128`を使用すると`u128`型を 10 進文字列としてシリアライズします。  
> `U128` を入力とする関数は、呼び出し側が数値を文字列で指定する必要があることを意味し、  
> `near-sdk-rs` はそれを `U128` 型にキャストし、Rust のネイティブ `u128` をラップします。  
> 基礎となる `u128` は`.0`を語尾につけることで取り出すことができます。

それではテストの実行部分へ移ります。

`m1 mac`を使用している方(その他にも環境を合わせたい方)は注意が必要です。  
新しいバージョンのライブラリは `m1 mac` に対応していないので  
[git pod](https://gitpod.io/workspaces)というクラウド上で開発ができるサービスを利用します。  
`git pod`を使用するにあたって次のステップを踏んでください。

1. `near_bike_share_dapp`直下にある`.gitpod.yml`ファイル(無ければ作成してください)を以下の内容で上書きしてください。  
   `.gitpod.yml`

```
tasks:
  - init: yarn install && mkdir out
    command: yarn build
```

2. `near_bike_share_dapp`をレポジトリとして`git hub`上にアップロードしてください。
   > `git hub` へのアップロードの仕方  
   > [新しいレポジトリを作成](https://docs.github.com/ja/get-started/quickstart/create-a-repo)した後,  
   > 手順に従いターミナルからアップロードを済ませます。  
   > 以下ターミナルで実行するコマンドの参考です。(`near_bike_share_dapp`直下で実行してください)
   >
   > ```
   > $ git init
   > $ git add .
   > $ git commit -m "first commit"
   > $ git branch -M main
   > $ git remote add origin [作成したレポジトリの SSH URL]
   > $ git push -u origin main
   > ```
3. `git pod`でレポジトリを開く  
   [git pod](https://gitpod.io/workspaces)へアクセスし, `git hub`と連携します。  
   リポジトリを選択します。

   ![](/public/images/NEAR-BikeShare/section-3/3_3_1.png)

   ![](/public/images/NEAR-BikeShare/section-3/3_3_2.png)

   レポジトリの連携が完了すると`git pod`上でターミナルが立ち上がり,  
   `.gitpod.yml`内に記載したコマンドが実行されます。  
   コマンド実行終了後は以下のような画面となります。

   ![](/public/images/NEAR-BikeShare/section-3/3_3_3.png)

それではローカルまたは`git pod`上のターミナルで  
以下のコマンドを実行しましょう( `near_bike_share_dapp`直下で実行してください)。

```
$ cd integration-tests/rs && cargo run --example integration-tests
```

テストが成功すれば以下のような出力がされます！

![](/public/images/NEAR-BikeShare/section-3/3_3_4.png)

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
ユニットテストに加え統合テストも実装することができました！  
次のレッスンでは最後の機能を実装していきます！
