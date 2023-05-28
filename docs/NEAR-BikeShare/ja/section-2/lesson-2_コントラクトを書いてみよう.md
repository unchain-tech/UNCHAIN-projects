### 🛫 Rust の新規プロジェクトを作成しよう

お気に入りのコードエディタ（お持ちでない方はVSCodeをインストールしましょう）で`near_bike_share_dapp`を開きましょう。
`contract`ディレクトリには簡単なコントラクトである`greetingプロジェクト`が既に入っています。
今回は0からコントラクトを書くので`contract`ディレクトリごと削除しましょう。

```
$ rm -r contract
```

Rustで新しいプロジェクトを作成する下記のコマンドを`near_bike_share_dapp`直下で実行しましょう！

```
$ cargo new bike_share --lib
```

`bike_share`はプロジェクト名です。
`--lib`はライブラリを作成するという指定です。
デフォルトでは`--bin`が設定されていて、これはバイナリファイル（実行可能ファイル）の作成を指定します。
NEARのコントラクトはライブラリ形式で作成するので`--lib`を指定します。

`bike_share`という名前のディレクトリが作成されましたが,
`frontend`との対比がわかりやすいように今回はディレクトリ名を`contract`に変更しましょう。

```
$ mv bike_share contract
```

`frontend`ディレクトリと`contract`ディレクトリが同じ階層にいることを確認してください。

それでは`contract`ディレクトリの中身を見ていきます。
階層はこのようになっています。

```
.
├── Cargo.toml
└── src
    └── lib.rs
```

`Cargo.toml`はこのプロジェクトの情報（プロジェクト名や依存ファイル情報など）が記入されています。
実際のコードは`src`ディレクトリの中に配置します。
`Cargo.toml`の中身をこのように書き換えます。
(詳細は[Cargo.toml について](https://doc.rust-jp.rs/book-ja/ch01-03-hello-cargo.html#cargo%E3%81%A7%E3%83%97%E3%83%AD%E3%82%B8%E3%82%A7%E3%82%AF%E3%83%88%E3%82%92%E4%BD%9C%E6%88%90%E3%81%99%E3%82%8B)や
[NEAR 開発での Cargo.toml の書き方](https://docs.near.org/sdk/rust/building/basics)を参照してください)

```rust
// Cargo.toml

[package]
authors = ["Near Inc <hello@near.org>"]
edition = "2021"
name = "bike_share"
version = "1.0.0"

[lib]
crate-type = ["cdylib", "rlib"]

[dependencies]
near-sdk = "4.0.0"
uint = {version = "0.9.3", default-features = false}

[profile.release]
codegen-units = 1
debug = false
lto = true
opt-level = "z"
overflow-checks = true
panic = "abort"

[workspace]
members = []
```

また`.gitignore`ファイルを追加しましょう。
中身は以下を記述してください

```
/target
/Cargo.lock
```

`contract`ディレクトリの構成をチェックします。

```
.
├── .gitignore
├── Cargo.toml
└── src
    └── lib.rs
```

### 🚀 コントラクトを書きましょう

`contract/src/lib.rs`の中身を以下のように書き換えてください！

```rust
// lib.rs

use near_sdk::{
    borsh::{self, BorshDeserialize, BorshSerialize},
    near_bindgen,
};

const DEFAULT_NUM_OF_BIKES: usize = 5;

/// コントラクトを定義します。
#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize)]
pub struct Contract {
    num_of_bikes: usize,
}

/// デフォルト処理を定義します。
impl Default for Contract {
    fn default() -> Self {
        Self {
            num_of_bikes: DEFAULT_NUM_OF_BIKES,
        }
    }
}

/// メソッドの実装です。
#[near_bindgen]
impl Contract {
    pub fn num_of_bikes(&self) -> usize {
        self.num_of_bikes
    }
}

/// テストの実装です。
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn check_default() {
        let contract = Contract::default();

        assert_eq!(contract.num_of_bikes(), DEFAULT_NUM_OF_BIKES);
    }
}
```

コードを上から見ていきましょう。

まずこのコード内で必要になるライブラリ(`near_sdk`とその中のいくつかのライブラリ)を`use`を使ってスコープ内に取り込んでいます。

```rust
use near_sdk::{
    borsh::{self, BorshDeserialize, BorshSerialize},
    near_bindgen,
};
```

バイクの総数のデフォルト値を定義しています。
データ型に関しては[こちら](https://doc.rust-jp.rs/book-ja/ch03-02-data-types.html)を参照してください。

```rust
const DEFAULT_NUM_OF_BIKES: usize = 5;
```

コントラクトの核となるストラクトを定義しています。

```rust
#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize)]
pub struct Contract {
    num_of_bikes: usize,
}
```

ストラクト名は任意ですが今回は`Contract`とします。
Rustでコントラクトを書くには、`#[near_bindgen]`という注釈を付与したメインのストラクトを1つ用意します。
メインのストラクトはコントラクトのステート（状態）を表す役目を担います。
例えば`Contract`フィールドの`num_of_bikes`を読み込むだけ(`viewメソッド`)ならコントラクトのステートは変更しません。
逆に変更する(`changeメソッド`)のならコントラクトのステートを変更するということになります。

> `#[near_bindgen]`とは
> Rust において`#[]`は注釈を与える構文です。
> 注釈なのであらゆる意味がありますが,
> `#[near_bindgen]`をつけておくとコードがコントラクトとして成立するように処理をしてくれます。
> そして外部から呼び出されるよう意図されたメソッドを外部に公開してくれます。

> `#[derive(BorshDeserialize, BorshSerialize)]`とは
> ブロックチェーンネットワーク上のデータ転送で行われるシリアライズ・デシリアライズに関わるものです。
> ノードがブロックチェーン上のデータを読み込む際にはバイトコードから適したデータ構造へデシリアライズが行われ,
> ブロックチェーン上にデータを書き込む場合はデータ構造をバイトコードへとシリアライズします。
> データ構造に`#[derive(BorshDeserialize, BorshSerialize)]`をつけると,
> [borsh シリアライズ](https://borsh.io/)(バイナリ形式でのシリアライズ)を利用することを明示します。
> データをフロントエンドで読み取りやすくするために json 形式のシリアライズを利用する場合もあります。
> `borsh シリアライズ`はバイナリ形式であり変換のオーバーヘッドが少ないため処理を早くすることができます。
> データ構造をブロックチェーン上でやり取りをするのみなら`borsh シリアライズ`の指定をすれば良いでしょう。
> `borshシリアライズ`を実装しているストラクトは`borshシリアライズ`を実装しているデータ構造のみフィールドに含むことができます。
> 詳しくは以下はご覧ください。
> [serialization protocols](https://www.near-sdk.io/contract-interface/serialization-interface) > [Byte Serialization in Blockchains](https://medium.com/whiteblock/byte-serialization-in-blockchain-e147347ab578) > [Does NEAR need both Serialize and BorshSerialize?](https://stackoverflow.com/questions/65362360/does-near-need-both-serialize-and-borshserialize)

次にコントラクトの初期化をする`default関数`を用意します。
先ほど定義した`DEFAULT_NUM_OF_BIKES`によりメンバー変数を初期化しています。

```rust
impl Default for Contract {
    fn default() -> Self {
        Self {
            num_of_bikes: DEFAULT_NUM_OF_BIKES,
        }
    }
}
```

ここではいくつかRustの書き方について確認する必要があるので1つずつ触れていきましょう。

**関数の定義**
構文はこのようになっています。

```rust
fn 関数名(引数...) -> 返り値 {
    実装
}
```

上記コード内で出てきた

```rust
fn default() -> Self {
    Self {
        num_of_bikes: DEFAULT_NUM_OF_BIKES,
    }
}
```

という部分は、`default`という名前の関数を引数なしで、返り値は`Self`で定義していました。
`Self`とは呼び出しているオブジェクト自体の型を表します。
つまりここでは`Self`は`Contract`になり、`Contract`型のオブジェクトを中身を詰めて返却しています。

**トレイト**
`トレイト`とは他の言語での`インターフェース`に類似しているRustの概念です。
`トレイト`は「共通の振る舞い」を定義します。 上記にある`Default`も`トレイト`です。
例えば`Default`トレイトの定義（ライブラリの中身なのでコントラクト内にはありません）を覗くとこのようになっています。

```rust
pub trait Default: Sized {
    // ...

    fn default() -> Self;
}
```

`trait Default`の宣言の`{}`内に`fn default() -> Self;`という記述がありますね。
`Default`トレイトは「名前が`default` 、引数なし、返り値は呼び出しているオブジェクトの型」という関数（振る舞い）を定義しています。

そして標準では全てのコントラクトのメインとなるストラクトは`Defaultトレイト`を実装することが期待されています。
(後に出てきますが`init関数`により代替することも可能です)
なのでコントラクト内ではこのように`Default`トレイトを実装していました。
`impl Default for Contract`は`Contract`に`Default`トレイトを実装するという宣言です。

```rust
impl Default for Contract {
    fn default() -> Self {
        Self {
            num_of_bikes: DEFAULT_NUM_OF_BIKES,
        }
    }
}
```

`トレイト`の何が嬉しいのかというと、オブジェクトの振る舞いを抽象化できることです。
実際、コントラクトのメインストラクトは`Defaultトレイト`を実装することが期待されていても、そのストラクトの中身までは縛られていません。
決まった振る舞いをしていれば型も実装の中身もなんでも良いです。
つまり様々なコントラクトに対して「初期化で使うので`Defaultトレイト`を実装しておいてください」というような共通の決め事ができ、固定の型に依存せず一貫性を持てます。
`トレイト`について詳しくは[こちら](https://doc.rust-jp.rs/book-ja/ch10-02-traits.html)を参照してください。

次にメソッド実装しています。

```rust
#[near_bindgen]
impl Contract {
    pub fn num_of_bikes(&self) -> usize {
        self.num_of_bikes
    }
}
```

下記のような構文でストラクトにメソッドを定義できます。

```rust
impl ストラクトの型名 {
    メソッド
}
```

ここではバイクの総数を返す`num_of_bikes`メソッドを定義しました。
引数`self`については次のセクションでお話しします。

最後に簡単なテストを書いています。

```rust
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn check_default() {
        let contract = Contract::default();

        assert_eq!(contract.num_of_bikes(), DEFAULT_NUM_OF_BIKES);
    }
}
```

`#[test]`で`check_default`関数がテスト関数であることを示します（テストコマンド実行時に識別するためです）。
そしてデフォルト関数を呼び出し、オブジェクトがしっかり`DEFAULT_NUM_OF_BIKES`を保持できているか確認しています。
`assert`系マクロは引数に渡したものが期待するものでなければパニックします。

> パニック
> パニックはプログラムを終了させます。
> テスト時のパニックはテストの失敗を知らせます。
> コントラクト内のパニックはメソッド呼び出しを中断します。

`assert_eq`は引数に渡した2つの値が同じものかを判断します。
[マクロ](https://doc.rust-jp.rs/book-ja/ch19-06-macros.html)はここでは関数と捉えましょう。

> `let`について
> `let`は変数であることを宣言し、デフォルトでは不変になります。
> 一度定義したら値を書き換えることができません。
> 可変な変数を宣言する場合は`let mut`を使用します。

- その他の構文について
  `#[cfg(test)]`は`cargo test`というテストコマンドを実行した時のみコードをコンパイルし走らせるよう指示します。
  `mod tests`でテストモジュール（モジュールはコードをひとかたまりにまとめたもの）を宣言しています。
  モジュールの中から1階層上(`Contract`の階層)を参照するため`use super::*;`を使用しています。
  この辺りは後からの理解でも充分です。🙆‍♀️

unitテストはテスト対象コードと同じファイルにこのように書くのが慣習です。

それでは`contract`ディレクトリに移動し以下のコマンドでテストを実行してください！

```
$ cargo test
```

テストが成功すれば以下のような表示がされます。

![](/public/images/NEAR-BikeShare/section-2/2_2_1.png)

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
Rustでコードを記述し、テストを実行できました 🎉
次のレッスンではさらに機能を増やしていきます！
