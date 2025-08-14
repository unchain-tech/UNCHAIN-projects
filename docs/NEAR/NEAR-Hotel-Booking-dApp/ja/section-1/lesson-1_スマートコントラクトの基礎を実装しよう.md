### ✈️ スマートコントラクトの基礎を実装しよう

このレッスンでは、NEARブロックチェーン上のデータを読み書きする簡単なスマートコントラクトを実装していきます。
具体的には、以下のような機能を持つスマートコントラクトです。

- 宿泊施設のオーナーが部屋のデータをブロックチェーン上に保存する
- 保存したデータを呼び出す

### 🎓 NEAR のメソッドについて

NEARブロックチェーンには2種類のメソッドがあります。

| 種類 | ブロックチェーン上のデータに対する操作 | 　ガス代 | 実行するアカウントの指定 |
| ---- | -------------------------------------- | -------- | ------------------------ |
| View | 読み取り                               | 無料     | 必要なし                 |
| Call | 読み取り・書き込み                     | 必要     | 必要                     |

`View`メソッドはガス代を支払うアカウントが必要ないので、アカウントを指定する必要はありません。

これから実装する「`宿泊施設のオーナーが部屋のデータをブロックチェーン上に保存する`」メソッドが`Call`メソッド、「`保存したデータを呼び出す`」メソッドが`View`メソッドになります。

### ✏️ ファイルを編集しよう

スマートコントラクトの実装に入る前に、ファイルの編集を行います。
プロジェクトの雛形を作成した際、サンプルとして`greeter`が実装されていました。ここでは、`greeter`と指定されている部分を`near-hotel-booking-dapp`用に、変更したいと思います。

ここからは、先頭の`/`が意味するディレクトリはプロジェクトの**ルートディレクトリ**(`/near-hotel-booking-dapp`)であるとします。


1. `/contract/Cargo.toml`を編集

```diff
[package]
- name = "hello_near"
+ name = "hotel_booking"
```

編集後、スマートコントラクトが問題なくコンパイル・デプロイされるかを確認します。

```
yarn deploy
```

問題がなければ、以下のように表示されます。

```
Transaction Id 2hqDQBHSQ8cuXYBjjs1kkPHarfDPDcoRXB6XfFfEMFEE
To see the transaction in the transaction explorer, please open this url in your browser
https://explorer.testnet.near.org/transactions/2hqDQBHSQ8cuXYBjjs1kkPHarfDPDcoRXB6XfFfEMFEE
Done deploying to dev-1659763331754-22161131880735
✨  Done in 9.29s.
```

これでファイルの編集は終了です！ 実際に、スマートコントラクトを実装していきましょう。
サンプルとして記述されている`greeter`のコードを上書きして、まずは使用するライブラリを宣言してみましょう。

`/contract/src/lib.rs`

```rust
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::LookupMap;
use near_sdk::json_types::U128;
use near_sdk::serde::{Deserialize, Serialize};
use near_sdk::{env, near_bindgen, AccountId, Promise};

use std::collections::HashMap;
```

宣言した内容を見ていきましょう。
最初のブロックでは、[near_sdk](https://docs.rs/near-sdk/latest/near_sdk/)というライブラリから使用したいモジュールやマクロなどを宣言しています。`near_sdk`ライブラリとは、NEARスマートスマートコントラクトを記述するためのRustライブラリです。

```rust
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::LookupMap;
use near_sdk::json_types::U128;
use near_sdk::serde::{Deserialize, Serialize};
use near_sdk::{env, near_bindgen, AccountId, Promise};
```

次の行では、Rustの標準ライブラリから使用したいコレクションを宣言しています。[コレクション](https://doc.rust-jp.rs/book-ja/ch08-00-common-collections.html)とは、データ構造のことです。

```rust
use std::collections::HashMap;
```

続いて、以下のようにコードを追加します。

`/contract/src/lib.rs`

```diff
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::LookupMap;
use near_sdk::json_types::U128;
use near_sdk::serde::{Deserialize, Serialize};
use near_sdk::{env, near_bindgen, AccountId, Promise};

use std::collections::HashMap;

+ type RoomId = String;
+ type CheckInDate = String;
+
+ #[derive(Serialize, Deserialize, Debug, BorshSerialize, BorshDeserialize, PartialEq)]
+ #[serde(crate = "near_sdk::serde")]
+ pub enum UsageStatus {
+     Available,                           // 空室
+     Stay { check_in_date: CheckInDate }, // 滞在中
+ }
+
+ // オーナーが登録した部屋一覧を表示する際に使用
+ #[derive(Serialize, Deserialize, Debug, BorshSerialize, BorshDeserialize)]
+ #[serde(crate = "near_sdk::serde")]
+ pub struct RegisteredRoom {
+     name: String,
+     image: String,
+     beds: u8,
+     description: String,
+     location: String,
+     price: U128,
+     status: UsageStatus,
+ }
+
+ // 実際にブロックチェーン上に保存される部屋のデータ
+ #[derive(BorshDeserialize, BorshSerialize)]
+ pub struct Room {
+     name: String,        // 部屋の名前
+     owner_id: AccountId, // オーナーのアカウントID
+     image: String,       // 部屋の画像（URL）
+     beds: u8,            // ベッドの数
+     description: String, // 部屋の説明
+     location: String,    // 施設の場所
+     price: U128,         // 一泊の宿泊料
+     status: UsageStatus, // 利用状況
+     booked_info: HashMap<CheckInDate, AccountId>, // 予約データ[宿泊日, 宿泊者のアカウントID]
+ }
```

追加した内容を見ていきましょう。

最初のブロックは、既存の型(今回は`String`)に対して別の名前をつける、ということを宣言しています。これを、[型エイリアス](https://doc.rust-jp.rs/book-ja/ch19-04-advanced-types.html?highlight=type#%E5%9E%8B%E3%82%A8%E3%82%A4%E3%83%AA%E3%82%A2%E3%82%B9%E3%81%A7%E5%9E%8B%E5%90%8C%E7%BE%A9%E8%AA%9E%E3%82%92%E7%94%9F%E6%88%90%E3%81%99%E3%82%8B)（type alias）を宣言すると言います。
ここでは、

- 「String型に`RoomId`  という別名をつけます」

と宣言をしています。

```rust
type RoomId = String;
type CheckInDate = String;
```

データ構造にマップを使用しますが、何をキーとしてデータを保存しているのをわかりやすくするために宣言しました。

次のブロックでは、[列挙型](https://doc.rust-jp.rs/book-ja/ch06-00-enums.html)(`Enum`)と呼ばれる型で扱いたいデータを定義しています。リンク先の章では、IPアドレスを用いて列挙型の概念を説明していますが、これを身近な`信号機`に置き換えてみるとよりわかりやすいかと思います。今回は、部屋の利用状況を表すために使用します。

```rust
#[derive(Serialize, Deserialize, Debug, BorshSerialize, BorshDeserialize, PartialEq)]
#[serde(crate = "near_sdk::serde")]
pub enum UsageStatus {
    Available,
    Stay { check_in_date: CheckInDate },
}
```

次の2つのブロックでは、部屋のデータとして扱いたいものを構造体を使用して定義しています。
`RegisteredRoom`構造体は、ブロックチェーン上から部屋のデータを呼び出す際に使用します。

```rust
#[derive(Serialize, Deserialize, Debug, BorshSerialize, BorshDeserialize)]
#[serde(crate = "near_sdk::serde")]
pub struct RegisteredRoom {
    name: String,
    image: String,
    beds: u8,
    description: String,
    location: String,
    price: U128,
    status: UsageStatus,
}
```

`Room`構造体は、実際にフォームから入力される部屋のデータをブロックチェーン上に書き込む際に使用します。

```rust
#[derive(BorshDeserialize, BorshSerialize)]
pub struct Room {
    name: String,        // 部屋の名前
    owner_id: AccountId, // オーナーのアカウントID
    image: String,       // 部屋の画像（URL）
    beds: u8,            // ベッドの数
    description: String, // 部屋の説明
    location: String,    // 施設の場所
    price: U128,         // 一泊の宿泊料
    status: UsageStatus, // 利用状況
    booked_info: HashMap<CheckInDate, AccountId>, // 予約データ[宿泊日, 宿泊者のアカウントID]
}
```

最後に、Enumと構造体の上に書かれていた`#[derive(...)]`と`#[serde(...)]`について説明します。

これは、[アトリビュート](https://doc.rust-jp.rs/rust-by-example-ja/attribute.html)（属性）と呼ばれるものです。何をしているかというと、

- `#[derive]`属性は型に対して特定のトレイトの実装を提供します。
- `#[serde]`属性はシリアライズ・デシリアライズの実装をカスタマイズします。

[トレイト](https://doc.rust-jp.rs/book-ja/ch10-02-traits.html)とは、共通の振る舞いを定義するものです。`#[derive](...)`の`(...)`に記載されているものがトレイトです。

`シリアライズ`とは、データ構造を文字列やバイト列に変換することです。
`デシリアライズ`とは、シリアライズ操作によって変換されたデータを元のデータ構造やオブジェクトに復元する処理のことです。
`#[serde(crate = "near_sdk::serde")]`を使ってデータ構造をどのように変換するかを指定しています。
`near_sdk`がサポートしているシリアライゼーションについては[こちら](https://www.near-sdk.io/contract-interface/serialization-interface)。

最後に、スマートコントラクトの要となる構造体を定義します。

`/contract/src/lib.rs`

```diff
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::LookupMap;
use near_sdk::json_types::U128;
use near_sdk::serde::{Deserialize, Serialize};
use near_sdk::{env, near_bindgen, AccountId};

use std::collections::HashMap;

type RoomId = String;
type CheckInDate = String;

#[derive(Serialize, Deserialize, Debug, BorshSerialize, BorshDeserialize, PartialEq)]
#[serde(crate = "near_sdk::serde")]
pub enum UsageStatus {
    Available,
    Stay { check_in_date: CheckInDate },
}

#[derive(Serialize, Deserialize, Debug, BorshSerialize, BorshDeserialize)]
#[serde(crate = "near_sdk::serde")]
pub struct RegisteredRoom {
    name: String,
    image: String,
    beds: u8,
    description: String,
    location: String,
    price: U128,
    status: UsageStatus,
}

#[derive(BorshDeserialize, BorshSerialize)]
pub struct Room {
    name: String,
    owner_id: AccountId,
    image: String,
    beds: u8,
    description: String,
    location: String,
    price: U128,
    status: UsageStatus,
    booked_info: HashMap<CheckInDate, AccountId>,
}

+ #[near_bindgen]
+ #[derive(BorshSerialize, BorshDeserialize)]
+ pub struct Contract {
+     rooms_per_owner: LookupMap<AccountId, Vec<RoomId>>,
+     rooms_by_id: HashMap<RoomId, Room>,
+ }
```

追加した内容を見ていきましょう。

`Contract`と名前をつけた構造体を追加しました。注目して欲しいのは、`#[near_bindgen]`というライブラリが定義されていることです。`near_bindgen`は、構造体と関数定義に使用されます。これにより、NEARブロックチェーンと互換性のあるスマートコントラクトが生成されます。

続いて、構造体を見ていきます。

```rust
pub struct Contract {
    rooms_per_owner: LookupMap<AccountId, Vec<RoomId>>,
    rooms_by_id: HashMap<RoomId, Room>,
}
```

2つのデータを定義しています。

- `rooms_per_owner`: 部屋のオーナーの`AccountId`とその部屋を紐付けてデータを格納します。
  - `AccountId`とは、near_sdkに定義されている型です。アカウントIDを扱うための様々なメソッドやトレイトを持っています。
  - `LookupMap`とは、near_sdkが定義する特殊なデータ構造です。保存するデータ量が少なく、パフォーマンスも良いとされています。キーから値へのマップしか持っていない。キーのベクトルがなければ、キーを反復する機能はありません。
- `rooms_by_id`: 各部屋の識別子(`RoomId`)と部屋のデータを持つ`Room`構造体を紐付けてデータを格納します。
  - `HashMap`とは、Rustの標準コレクションライブラリが定義するデータ構造です。格納するすべてのデータに対して処理を行う場合に使用します。

`rooms_per_owner`は、`LookupMap`が持つ機能だけで十分なので、データ構造に`LookupMap`を選択しています。

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

次のレッスンに進み、実際に部屋のデータを保存・取得ができるスマートコントラクトを作成しましょう！
