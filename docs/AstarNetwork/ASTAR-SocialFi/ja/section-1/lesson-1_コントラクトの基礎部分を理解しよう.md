## 🖊 コントラクトの基礎知識を習得しよう

今回のwasmコントラクト開発では`ink!`というrustをベースにした言語を用いて行います。この言語を用いた開発における基礎知識を学んでいきましょう！

では`packages/contract`にある`lib.rs`のデフォルトのコードを例にして見ていきましょう！

[`lib.rs`]

```rust
#![cfg_attr(not(feature = "std"), no_std)]

use ink_lang as ink;

#[ink::contract]
mod contract {

   /// コントラクトの状態変数を定義
   #[ink(storage)]
   pub struct AstarSnsContract {
       /// Stores a single `bool` value on the storage.
       value: bool,
   }

   impl AstarSnsContract {
       /// Constructor that initializes the `bool` value to the given `init_value`.
       // コンストラクタはnew関数で初期値を設定できる。
       #[ink(constructor)]
       pub fn new(init_value: bool) -> Self {
           Self { value: init_value }
       }

       // 初期値は false に設定
       #[ink(constructor)]
       pub fn default() -> Self {
           Self::new(Default::default())
       }

       //  #[ink(message)]がついているものはインスタンス化されたコントラクトから呼び出し可能
       #[ink(message)]
       pub fn flip(&mut self) {
           self.value = !self.value;
       }

       // 単純に状態変数をを返す
       #[ink(message)]
       pub fn get(&self) -> bool {
           self.value
       }
   }

   　// 状態変数の値をひっくり返す
   mod tests {
       // Imports all the definitions from the outer scope so we can use them here.
       use super::*;

       // #[ink::test] が使用できるように ink_lang をインポートしている
       use ink_lang as ink;

       // デフォルトのコンストラクタが動いているか確認
       #[ink::test]
       fn default_works() {
           let contract = AstarSnsContract::default();
           assert_eq!(contract.get(), false);
       }

       // コントラクトの関数がきちんと動いているかを確認
       #[ink::test]
       fn it_works() {
           let mut contract = AstarSnsContract::new(false);
           assert_eq!(contract.get(), false);
           contract.flip();
           assert_eq!(contract.get(), true);
       }
   }
}

```

最初の３行はこのようになっています。

1行目ではrustで基本的なライブラリを提供する`std`がもし存在しない場合は使用しないことを示しています。

2行目ではライブラリとして使用している`ink_lang`を`ink`として使用することを宣言しています。

3行目では`ink!`のうちどのようなプロパティを使うかを宣言しています。

ink!では、コントラクトを記述する際に始めに3行目のように記述します。

```rust
#![cfg_attr(not(feature = "std"), no_std)]

use ink_lang as ink;

#[ink::contract]
```

次の部分ではコントラクトの名前と状態変数を宣言しています。

状態変数を宣言するために`#[ink(storage)]`を最初に記述しておき、その後に構造体としてコントラクトを宣言します。

```rust
mod contract {

   /// Defines the storage of your contract.
   /// Add new fields to the below struct in order
   /// to add new static storage fields to your contract.
   #[ink(storage)]
   pub struct AstarSnsContract {
       /// Stores a single `bool` value on the storage.
       value: bool,
   }
```

次の部分では`AstarSnsContract`という名前で宣言したコントラクト内において使用できる関数を宣言しています。

` #[ink(constructor)]`から始まっているのでコンストラクタ、つまりコントラクトがデプロイされた時に一度だけ起動される関数が宣言されます。

ここでは`init_value`という引数にbool型の値が入れられ、それが状態変数に入るということが書かれています。

`-> Self`はコントラクト自身を返り値として返すことを示しています。

その後の`default`関数もコンストラクタの1つです。

ここでrustの基本的な記述方法に触れておきます。ここでみられる`Self::new`というのは、Self（AstarSnsContractコントラクト）の中で宣言されている`new`という関数を使用することを表しています。

なのでnew関数の引数の中の`Default::default()`というのは、Defaultというものの中にあるdefaultという関数を使用することを表しています。これはそれぞれの方に与えられているデフォルトの値が返ってくるというものです。bool型に対しては`false`が返ってきます。

```rust
impl AstarSnsContract {
       /// Constructor that initializes the `bool` value to the given `init_value`.
       #[ink(constructor)]
       pub fn new(init_value: bool) -> Self {
           Self { value: init_value }
       }

       /// Constructor that initializes the `bool` value to `false`.
       ///
       /// Constructors can delegate to other constructors.
       #[ink(constructor)]
       pub fn default() -> Self {
           Self::new(Default::default())
       }
```

次の部分に書かれている関数には`#[ink(message)]`が添えられています。これはコントラクトで宣言されている関数のうち、外部から呼び出すことができることが示されています。

逆に言うとこの記述がされていないものはコントラクト内でしか使用できないということになります。

`flip関数`はbool型の状態変数`value`をひっくり返す関数となっています。ここで引数に`&mut self`と記述されていますが、これはコントラクトの中身が書き換えられること（mutable）を示しています。

`get関数`では状態変数`value`を返されます。

```rust
       /// A message that can be called on instantiated contracts.
       /// This one flips the value of the stored `bool` from `true`
       /// to `false` and vice versa.
       #[ink(message)]
       pub fn flip(&mut self) {
           self.value = !self.value;
       }

       /// Simply returns the current value of our `bool`.
       #[ink(message)]
       pub fn get(&self) -> bool {
           self.value
       }
```

最後の部分にはテストコードが書かれています。この中の関数には`#[ink::test]`という記述が添えられていますね。

`default_works関数`ではAstarSnsContractコントラクトのコンストラクタ`default関数`の返り値を`contract`という変数に入れることでコントラクトがデプロイされていることを再現します。

このコントラクトに対して作成した関数を実行して、意図した通りの動きをしているかを確認します。

この関数ではget関数によって状態変数`value`に`false`が入っているかを確認しています。
`it_works関数`ではflip関数によって状態変数`value`がひっくり返されて`true`に変わっているかを確認しています。

```rust
/// module and test functions are marked with a `#[test]` attribute.
   /// The below code is technically just normal Rust code.
   #[cfg(test)]
   mod tests {
       /// Imports all the definitions from the outer scope so we can use them here.
       use super::*;

       /// Imports `ink_lang` so we can use `#[ink::test]`.
       use ink_lang as ink;

       /// We test if the default constructor does its job.
       #[ink::test]
       fn default_works() {
           let contract = AstarSnsContract::default();
           assert_eq!(contract.get(), false);
       }

       /// We test a simple use case of our contract.
       #[ink::test]
       fn it_works() {
           let mut contract = AstarSnsContract::new(false);
           assert_eq!(contract.get(), false);
           contract.flip();
           assert_eq!(contract.get(), true);
       }
   }
```

これで`ink!`の基礎知識の紹介は終了です。

ここからも新しい事柄が出てきますが、その都度説明していきますので頑張って学んでいきましょう！

### 🙋‍♂️ 質問する

わからないことがあれば、Discordの`#astar`でsection・Lesson名とともに質問をしてください 👋

---

次のレッスンでは、いよいよSNS dAppの投稿、フォロー機能を実装していきます！ 🎉
