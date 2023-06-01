### 🚀 コントラクトに機能を追加しましょう

このセクションではコントラクトに機能を追加していきましょう！
以下の機能を追加します。

- バイクの状態（使用可・使用中・点検中）を管理
- バイクの状態の変更
- テスト

`contract/src/lib.rs`を以下のように書き換えましょう。

```rust
// lib.rs

use near_sdk::{
    borsh::{self, BorshDeserialize, BorshSerialize},
    env, log, near_bindgen, AccountId,
};

const DEFAULT_NUM_OF_BIKES: usize = 5;

/// バイクの状態遷移を表します。
#[derive(BorshDeserialize, BorshSerialize)]
enum Bike {
    Available,             // 使用可能
    InUse(AccountId),      // AccountIdによって使用中
    Inspection(AccountId), // AccountIdによって点検中
}

/// コントラクトを定義します
#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize)]
pub struct Contract {
    bikes: Vec<Bike>,
}

/// デフォルト処理を定義します。
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

/// メソッドの実装です。
#[near_bindgen]
impl Contract {
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
                self.bikes[index] = Bike::Available;
            }
        };
    }
}
```

変更点を上から見ていきましょう。

まず初めに、[enum](https://doc.rust-jp.rs/book-ja/ch06-01-defining-an-enum.html)を利用して`Bike`型を定義しています。
`Bike`はバイクの状態を表します。
※`AccountId`は`near-sdk`ライブラリにあるNEARアカウントID用の型です。

```rust
#[derive(BorshDeserialize, BorshSerialize)]
enum Bike {
    Available,             // 使用可能
    InUse(AccountId),      // AccountIdによって使用中
    Inspection(AccountId), // AccountIdによって点検中
}
```

`enum`は取りうる値を列挙する型です。
すると状態遷移が明瞭、かつコード内にある`Bike`型の値は必ず列挙されている内のどれかの状態であるという保証ができます。
また、関連するデータを保持することができるため`InUse(AccountId)`のように,
`InUse`に紐づくアカウントID（誰が使用しているのか）も一緒に表現することができます。

次に`Contract`と初期化処理を変更しました。

```rust
#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize)]
pub struct Contract {
    bikes: Vec<Bike>,
}

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
```

`Contract`は`Bike`の集合を`bikes`フィールドで保持しています。
`Vec`は[ベクタ](https://doc.rust-jp.rs/book-ja/ch08-01-vectors.html)型で配列のようなものです。
そして`default`関数では`DEFAULT_NUM_OF_BIKES `の数だけ`Bike`をベクタへ格納し、`bikes`にセットしています。

次にメソッドの定義について見ていきます。

```rust
	// ...

    pub fn is_available(&self, index: usize) -> bool {
        matches!(self.bikes[index], Bike::Available)
    }

    pub fn who_is_using(&self, index: usize) -> Option<AccountId> {
        match &self.bikes[index] {
            Bike::InUse(user_id) => Some(user_id.clone()),
            _ => None,
        }
    }

	// ...
```

`enum`は [match](https://doc.rust-jp.rs/book-ja/ch06-02-match.html)という制御文を利用して条件分岐が可能です。
条件にマッチした場合の処理を`=>`の後に記述します。

ですが、`is_available`メソッドはmatch文ではなく、[`matches!`](https://doc.rust-lang.org/std/macro.matches.html#)マクロを利用しています。match文は、条件に応じてbooleanを返すだけの場合には、`matches!`マクロを利用すると、より簡潔に書くことができます(この書き方は、[Clippy](https://rust-lang.github.io/rust-clippy/master/index.html#match_like_matches_macro)というRustの静的解析ツールも推奨しています)。`is_available`メソッドでは指定されたindexの`bike`が`Available`であれば`true`を返し、そうでなければ`false`を返します。よって、ここでは`matches!`マクロで実装を行なっています。

また、`Option<AccountId>`という型が登場しました。
[Option](https://doc.rust-jp.rs/book-ja/ch06-02-match.html#optiont%E3%81%A8%E3%81%AE%E3%83%9E%E3%83%83%E3%83%81)は何か値を保持している(`Some`)か何も保持していない(`None`)の2つの状態を表します。
例えば`who_is_using`メソッドでは指定されたindexの`bike`が使用中であればそのアカウントIDを`Some`に詰めて返却し、そうでなければ`None`を返します。
また`所有権`の観点からアカウントIDは`clone`しています(`user_id.clone()`)。

> `return 値`は書かなくても値を返却するのか?
> Rust では関数の終了時点の文末に`;`をつけなければそのまま返却値とすることができます。

> `所有権`とは
> Rust の大きな特徴の一つに所有権があります。
> ここでは簡単に触れます。
> 値は所有者と呼ばれる変数と対応していて、所有者はいかなる時も 1 つです。
> `A`から`B`に値をコピーした場合、`A`にあった値の所有者は`B`に移ります。
> 先ほどの`user_id.clone()`は行っていたことは、`user_id`の値が`Some`に奪われてしまわないように
> `clone`というメソッドを利用して値を複製して`Some`に渡していたのです。
> 所有権はメモリ管理においてとても重要で素晴らしい概念なので、是非[こちら](https://doc.rust-jp.rs/book-ja/ch04-01-what-is-ownership.html)からその内容を読んでみてください！

次にバイクの状態を変更するコードについて見ていきます。

```rust
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

	// ...

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
                self.bikes[index] = Bike::Available;
            }
        };
    }
```

ここでも`match`を利用して処理を分岐しています。
ユーザがバイクを使用・点検する際は各メソッドを呼び出し,
メソッド内では呼び出し元のアカウントIDをコントラクト内に保持するようにしてバイクの状態を変更します。
これで使用・点検の手続きが済みます。
返却はその逆です。
バイクの状態が期待するものでない場合は、なるべく**早い段階でパニックさせます**。
そうすることでメソッド呼び出しを中断し、余計なトランザクションとその手数料を抑えることができます。

> メソッドの引数`self`について
> メソッドの第一引数には`self`をとります。 `self`は`Contract`オブジェクト自身を表します。
> `Self`は型でしたが、`self`はオブジェクトそのものなので`self.bikes`のような使い方をします。
> `&`については所有権に関わることで、[こちら](https://doc.rust-jp.rs/book-ja/ch04-02-references-and-borrowing.html)をご覧ください。
> 重要な点はメソッドの引数として`&self`と`&mut self`があることです。
> これは`let`と`let mut`の違いで`&self`は不変、`&mut self`は可変です。
> つまりメソッドが`viewメソッド`か`changeメソッド`かはこの引数の違いで決まります。

> `env::predecessor_account_id()`とは
> コントラクト内では、`env`ライブラリを利用して 3 つの id を取得することができます。
>
> - `predecessor_account_id`: このコントラクトを直接呼び出しているアカウントの id
> - `signer_account_id`: 複数のコントラクトを跨いでこのコントラクトが呼ばれている場合に、最初のコントラクトを呼び出したアカウント id (一連のコントラクト呼び出しをドミノ倒しに例えると最初のドミノを倒した人)
> - `current_account_id`: このコントラクトのアカウント id

### 🧪 ユニットテストを書こう

このコントラクトの挙動を確かめるためにユニットテストを追加しましょう。
テストモジュールを以下のように書き換えてください。

```rust
// contract/src/lib.rs

// コントラクトコード ...

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
        let contract = Contract::default();

        // view関数の実行のみ許可する環境に初期化
        testing_env!(context.is_view(true).build());

        assert_eq!(contract.num_of_bikes(), DEFAULT_NUM_OF_BIKES);
        for i in 0..DEFAULT_NUM_OF_BIKES {
            assert!(contract.is_available(i))
        }
    }

	// accounts(1)がバイクを点検した後,
	// バイクはaccounts(1)によって点検中になっているかを確認
    #[test]
    fn check_inspecting_account() {
        let mut context = get_context(accounts(1));
        testing_env!(context.build());
        let mut contract = Contract::default();

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
        let mut contract = Contract::default();

        contract.inspect_bike(0);

        testing_env!(context.predecessor_account_id(accounts(2)).build());
        contract.return_bike(0);
    }
}
// ファイル終端
```

テスト内容がアップグレードし、テストケースも増えています。
ここで実装したものは例なので、足りないテストケースは適宜増やして下さい!🕺
(`use_bike`メソッドと`return_bike`メソッドに関しては次のセクションで内容が変更されます)

`VMContextBuilder`というインタフェースを使用して,
トランザクションが実行される環境をシミュレーションすることができます！
コード内の以下の部分はテスト関数が使用するヘルパー関数です。(そのため`#[test]`がついていません)

```rust
    fn get_context(predecessor_account_id: AccountId) -> VMContextBuilder {
        let mut builder = VMContextBuilder::new();
        builder
            .current_account_id(accounts(0)) // accounts(0): テスト用のアカウントリストの中の0番アカウントを取得します.
            .signer_account_id(predecessor_account_id.clone())
            .predecessor_account_id(predecessor_account_id);
        builder
    }
```

`get_context`は`VMContextBuilder`を初期化しています。
初期化の内容は少し前に出てきた3つのidを事前にセットしています。

各テスト関数では`get_context`により`VMContextBuilder`を取得し,
`testing_env!`マクロに`context`を渡すことでテスト環境（モックされたブロックチェーン）を初期化しています。
この部分。

```rust
#[test]
fn check_default() {
	let mut context = get_context(accounts(1)); // 0以外の番号のアカウントでコントラクトを呼び出します.
	testing_env!(context.build()); // テスト環境を初期化
	let contract = Contract::default();

	// ...
}
```

あとはそれぞれ正しい挙動をしているかをチェックしています。

それではテストを実行しましょう!
`contract`ディレクトリに移動し以下のコマンドでテストを実行してください！

```
$ cargo test
```

テストが成功すれば以下のような表示がされます。

![](/public/images/NEAR-BikeShare/section-2/2_3_1.png)

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
コントラクトを拡大し、テストを実行できました 🎉
次のレッスンではフロントエンドとの接続を行います！
