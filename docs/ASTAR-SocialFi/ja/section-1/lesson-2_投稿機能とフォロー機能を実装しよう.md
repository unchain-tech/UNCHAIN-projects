## 📪 投稿機能とフォロー機能を実装しよう

ではここからはdAppの機能を実装していきます。

しかしその前に今回使用するライブラリを下のように`Cargo.tomlファイル`に記述していきましょう！

[`Cargo.toml`]

```rust
[package]
name = "astar_sns_contract"
version = "0.1.0"
authors = ["[your_name] <[your_email]>"]
edition = "2021"

[dependencies]
ink_primitives = { version = "=3.3.0", default-features = false }
ink_metadata = { version = "=3.3.0", default-features = false, features = ["derive"], optional = true }
ink_env = { version = "=3.3.0", default-features = false }
ink_storage = { version = "=3.3.0", default-features = false }
ink_lang = { version = "=3.3.0", default-features = false }
ink_prelude = { version = "~3.3.0", default-features = false }
ink_engine = { version = "~3.3.0", default-features = false, optional = true }
ink_lang_codegen = { version = "=3.3.0", default-features = false }
ink_lang_ir = { version = "=3.3.0", default-features = false }

scale = { package = "parity-scale-codec", version = "3", default-features = false, features = ["derive"] }
scale-info = { version = "2", default-features = false, features = ["derive"], optional = true }

openbrush = { version = "2.2.0", default-features = false, features = ["ownable"]  }

[lib]
name = "astar_sns_contract"
path = "lib.rs"
crate-type = [
	# Used for normal contract Wasm blobs.
	"cdylib",
]

[features]
default = ["std"]
std = [
    "ink_metadata/std",
    "ink_metadata",
    "ink_env/std",
    "ink_storage/std",
    "ink_primitives/std",
    "ink_lang/std",
    "scale/std",
    "scale-info",
    "scale-info/std",

    "openbrush/std",
]
ink-as-dependency = []

```

これでこのコードからwasmファイル（コントラクトで実行できるようにしたファイル）を作成する際に、ライブラリが読み込まれるようになります。

次に下のようになるように空のファイルを追加していきましょう。

```
astar_sns_contract/
├── Cargo.lock
├── Cargo.toml*
├── astar-collator*
├── astar-collator-v4.24.0-macOS-x86_64.tar.gz
├── follow.rs
├── FT.rs
├── lib.rs*
├── message.rs
├── metadata.rs
├── post.rs
├── profile.rs
└── target/
    ├── CACHEDIR.TAG
    ├── debug/
    ├── dylint/
    └── ink/

```

ここからいろんな関数を記述していくのですが、関数の末尾に`_fn`という記述をしているのはコントラクト外から直接呼ばれるものではないものです。

コントラクト外から呼ばれるためには`#[ink(message)]`を関数の上に添える必要があるのですが、これは`#[ink::contract]`が添えられたコントラクト以外の場所(`lib.rs`以外のファイル)では宣言できないので、最終的には`lib.rs`内で使用される関数であるという認識で大丈夫です。

ではまず`metadata.rs`を下のように編集していきます。このファイルには本プロジェクトで使う構造体を定義していきます。

[`metadata.rs`]

```rust
use ink_env::AccountId;
use ink_prelude::string::String;
use ink_prelude::vec::Vec;
use ink_storage::traits::{PackedLayout, SpreadLayout, StorageLayout};

// 投稿用の構造体
#[derive(Debug, Clone, scale::Encode, scale::Decode, SpreadLayout, PartialEq, PackedLayout)]
#[cfg_attr(feature = "std", derive(scale_info::TypeInfo, StorageLayout))]
pub struct Post {
    pub name: String,
    pub user_id: AccountId,
    pub created_time: String,
    pub img_url: String,
    pub user_img_url: String,
    pub description: String,
    pub num_of_likes: u128,
    pub post_id: u128,
}

// プロフィール用の構造体
#[derive(Debug, Clone, scale::Encode, scale::Decode, SpreadLayout, PartialEq, PackedLayout)]
#[cfg_attr(feature = "std", derive(scale_info::TypeInfo, StorageLayout))]
pub struct Profile {
    pub following_list: Vec<AccountId>,
    pub follower_list: Vec<AccountId>,
    pub friend_list: Vec<AccountId>,
    pub user_id: AccountId,
    pub name: Option<String>,
    pub img_url: Option<String>,
    pub message_list_id_list: Vec<u128>,
    pub post_id_list: Vec<u128>,
}

// メッセージ用の構造体
#[derive(Debug, Clone, scale::Encode, scale::Decode, SpreadLayout, PartialEq, PackedLayout)]
#[cfg_attr(feature = "std", derive(scale_info::TypeInfo, StorageLayout))]
pub struct Message {
    pub message: String,
    pub sender_id: AccountId,
    pub created_time: String,
}

```

まずは最初の4行で宣言している部分を解説して行きます。

上の3行は今回使用する型を宣言しています。

`AccountId`は32文字で表されるアドレスの型です。もしおかしなアドレス（文字数が違うなど）がこの型に入ることになるとエラーとなります。

`Vec`はJavaScriptでいう`List`と同じようなものでVec <type>の`type`に入る型の値がリスト状に格納されることになります。

`String`は文字列の型です。

`PackedLayout, SpreadLayout, StorageLayout`については`metadata.rs`で宣言されるオリジナルの型がコントラクトの関数内で操作を行えるようにするために使われます。

型を宣言するときに`#[derive(Debug, Clone, scale::Encode, scale::Decode, SpreadLayout, StorageLayout, PartialEq)]`というように宣言することでこれらの特徴（rustではtrait）を使用することができます。

```rust
use ink_env::AccountId;
use ink_prelude::string::String;
use ink_prelude::vec::Vec;
use ink_storage::traits::{PackedLayout, SpreadLayout, StorageLayout};
```

下の部分では`Post`という構造体が宣言されています。ここで宣言されているプロパティは下のような意味があります。

name: 投稿をしたユーザーの名前

user_id: 投稿をしたユーザーのウォレットアドレス

created_time:　投稿が作成された時間

img_url:　投稿に添付された画像のURL

description:　投稿内容

num_of_likes: いいねの数

post_id: 投稿に割り振られたID

```rust
#[derive(
Debug, Clone, scale::Encode, scale::Decode, SpreadLayout, StorageLayout, PartialEq, PackedLayout,
)] #[cfg_attr(feature = "std", derive(scale_info::TypeInfo))]
pub struct Post {
pub name: String,
pub user_id: AccountId,
pub created_time: String,
pub img_url: String,
pub description: String,
pub num_of_likes: u128,
}
```

下の部分では`Profile`という構造体が宣言されています。ここで宣言されているプロパティは下のような意味があります。

following_list: 自分がフォローしているユーザーのウォレットアドレスのリスト

follower_list: 自分がフォローされているユーザーのウォレットアドレスのリスト

follower_list: 自分がフォローしているまたはされているユーザーのウォレットのアドレスのリスト

user_id:　ユーザーのウォレットアドレス

name:　ユーザーの名前

img_url:　ユーザーのプロフィール用の画像のURL

message_list_id_list: フォローしているのユーザーとのメッセージを格納しているリストのidを格納しているリスト

post_id_list:　自分が投稿した投稿のidを格納しているリスト

```rust
#[derive(
Debug, Clone, scale::Encode, scale::Decode, SpreadLayout, StorageLayout, PartialEq, PackedLayout,
)] #[cfg_attr(feature = "std", derive(scale_info::TypeInfo))]
pub struct Profile {
pub following_list: Vec<AccountId>,
pub follower_list: Vec<AccountId>,
pub user_id: AccountId,
pub name: Option<String>,
pub img_url: Option<String>,
pub message_list_id_list: Vec<u128>,
pub post_id_list: Vec<u128>,
}

```

ここでは`Message`という構造体が宣言されています。ここで宣言されているプロパティは下のような意味があります。

message:　メッセージの内容

sender_id:　送信者のウォレットアドレス

created_time:　メッセージを送信した時間

```rust
#[derive(
Debug, Clone, scale::Encode, scale::Decode, SpreadLayout, StorageLayout, PartialEq, PackedLayout,
)] #[cfg_attr(feature = "std", derive(scale_info::TypeInfo))]
pub struct Message {
pub message: String,
pub sender_id: AccountId,
pub created_time: String,
}
```

次に`post.rs`を下のように編集しましょう。

[`post.rs`]

```rust
use crate::metadata::*;
use ink_env::AccountId;
use ink_prelude::string::String;
use ink_prelude::string::ToString;
use ink_prelude::vec::Vec;

use crate::astar_sns_contract::AstarSnsContract;

impl AstarSnsContract {
    // 投稿するための関数
    pub fn release_post_fn(
        &mut self,
        account_id: AccountId,
        description: String,
        created_time: String,
        post_img_url: String,
    ) {
        // 指定されたウォレットアドレスに紐づいたプロフィール
        let profile_info: Profile = self.profile_map.get(&account_id).unwrap();

        // 投稿IDに紐づいた投稿情報を追加
        self.post_map.insert(
            &(self.post_map_counter),
            &Post {
                name: profile_info.name.unwrap_or("unknown".to_string()),
                user_id: profile_info.user_id,
                created_time,
                img_url: post_img_url,
                user_img_url: profile_info.img_url.unwrap(),
                description: description,
                num_of_likes: 0,
                post_id: self.post_map_counter,
            },
        );

        // 指定されたウォレットアドレスに紐づいたプロフィール
        let mut profile: Profile = self.profile_map.get(&account_id).unwrap();

        // 上で追加した時に使用した投稿IDをプロフィールに追加
        profile.post_id_list.push(self.post_map_counter);

        // プロフィールのマッピングを上書き
        self.profile_map.insert(&account_id, &profile);

        // 投稿IDを１大きくする
        self.post_map_counter = &self.post_map_counter + 1;
    }

    // 全ての投稿から指定の最新度の投稿を取得
    pub fn get_general_post_fn(&self, num: u128) -> Vec<Post> {
        // 返す投稿のリスト用のリストを生成
        let mut post_list: Vec<Post> = Vec::new();

        // 投稿マッピングの大きさを取得
        let length: u128 = self.post_map_counter;

        // どれくらいの量の投稿を取得するかを指定
        let amount_index: u128 = 5;

        // コントラクトに格納された投稿の量が指定された量の投稿より多いか判定。
        // それによって取得方法が異なるため
        if length < amount_index + 1 {
            for m in 0..(length + 1) {
                // get specified post and add to returning list
                let post: Option<Post> = self.post_map.get(&m);
                if post.is_some() {
                    post_list.push(post.unwrap());
                }
            }
        } else {
            for n in (amount_index * (num - 1))..(amount_index * num) {
                // get specified post and add to returning list
                // this is done from latest posts
                let post: Option<Post> = self.post_map.get(&(length - n - 1));
                if post.is_some() {
                    post_list.push(post.unwrap());
                }
            }
        }
        // 返り値用のリストを返す。returnは省略可能
        post_list
    }

    // 個人の投稿を取得
    pub fn get_individual_post_fn(&self, num: u128, account_id: AccountId) -> Vec<Post> {
        // 返す投稿のリスト用のリストを生成
        let mut post_list: Vec<Post> = Vec::new();

        // 指定したユーザーのウォレットアドレスに紐づいた投稿IDを取得する
        let post_id_list: Vec<u128> = self.profile_map.get(&account_id).unwrap().post_id_list;

        // どれくらいの量の投稿を取得するかを指定
        let amount_index: u128 = 5;

        // 投稿IDのリストの長さを取得
        let length: u128 = post_id_list.len() as u128;

        // コントラクトに格納された投稿の量が指定された量の投稿より多いか判定。
        // それによって取得方法が異なるため
        if length < amount_index + 1 {
            for m in 0..(length) {
                // 指定された投稿を取得して、最初に生成されたリストに格納
                let post: Option<Post> = self.post_map.get(&post_id_list[m as usize]);
                if post.is_some() {
                    post_list.push(post.unwrap());
                }
            }
        } else {
            for n in (amount_index * (num - 1))..(amount_index * num) {
                // 指定された投稿を取得して、最初に生成されたリストに格納
                let post: Option<Post> =
                    self.post_map.get(&post_id_list[(length - n - 1) as usize]);
                if post.is_some() {
                    post_list.push(post.unwrap());
                }
            }
        }
        // 返り値用のリストを返す。returnは省略可能
        post_list
    }

    // 指定された投稿にいいねを追加
    pub fn add_likes_fn(&mut self, post_id: u128) {
        // 指定された投稿の情を取得
        let mut post: Post = self.post_map.get(&post_id).unwrap();

        // 投稿のいいね数を１大きくする
        post.num_of_likes = &post.num_of_likes + 1;

        // 指定した投稿の情報を上書き
        self.post_map.insert(&post_id, &post);
    }

    // 指定されたアカウントの投稿に含まれているいいねの総数を取得する関数
    pub fn get_total_likes_fn(&self, account_id: AccountId) -> u128 {
        // 指定したアカウントに紐づく投稿idのリストを取得
        let post_id_list = self.profile_map.get(&account_id).unwrap().post_id_list;

        // 返り値となるいいね数の総数を格納する変数
        let mut num_of_likes = 0;

        // 取得した投稿idリストの各要素となるidに紐づく投稿が獲得したいいね数を合計する
        for id in post_id_list {
            let likes_of_post = self.post_map.get(&id).unwrap().num_of_likes;
            num_of_likes = num_of_likes + likes_of_post;
        }

        // いいねの総数を返す
        num_of_likes
    }

}
```

最初に記述している部分から見ていきましょう。

`*`はそのファイルの全てのものを使えることを示します。なので1行目はmetadata.rsの全てのものを使えるように宣言しています。

4行目はAstarSnsContractというコントラクトを参照できることを示しています。

```rust
use crate::metadata::*;
use ink_env::AccountId;
use ink_prelude::vec::Vec;
use crate::astar_sns_contract::AstarSnsContract;
```

ではそれぞれの関数の説明に入りたいところですが、その前にどのように投稿内容を保存し、どのように投稿を取得するかを説明したいと思います。

まず投稿情報の保存方法ですが`release_post関数`で行われます。後で宣言するコントラクトの状態変数`post_map`というMapping型のものに保存していきます。Mapping型とはSolidityでの`mapping`と全く同じでkeyとなる値とvalueとなる値を紐づける型です。

`post_map`には投稿id ->投稿情報というように紐付けられます。また、u128型（符号のない2の128乗の桁まで格納できる型）の状態変数`post_map_counter`で投稿idを管理します。

投稿内容が`post_map`に保存されたら`post_map_counter`が1プラスされるようにしています。また、このとき投稿者のプロフィール情報を格納している状態変数`profile_map`に投稿idが格納されます。

次に投稿情報の取り出し方についてです。これには2つの関数が用意されており、`get_general_post関数`と`get_individual_post関数`です。関数を分けている理由は、全体の投稿リストから最新のものを取得するか個人のユーザーの投稿のみを取得するかで関数内で行われることが分かれるからです。

流れとしては全体の投稿から最新の投稿を取得する場合は、状態変数`post_map`からidが新しいものから取得します。個人の投稿の取得は、状態変数`profile_map`に格納してある投稿idのリストからidを取り出して状態変数`post_map`から取得するというものです。

また、このふたつの関数に共通しているのがどのくらいの投稿数と最新度のものを取得するかが設定できることです。関数内の`amount_index`が取得する投稿数を決め、引数として受け取る`num`が最新度を決めます。詳細は`get_general_post関数`の解説部分で説明します。

ではそれぞれの関数の簡単な説明と、使われているメソッドの説明をして行きます。

最初に宣言しているのは`release_post関数`です。投稿するための関数で引数には

- account_id: 投稿者のウォレットアドレス
- description: 投稿内容
- created_time: 投稿時間
- post_img_url: 投稿に添付された画像URL

が設定されています。

ここで使用されているいくつかのメソッドを説明します。

Mapping型に用意してある`get`というメソッドはkeyを引数として入れると、それに対応する値が返ってきます。

Mapping型に用意してある`insert`というメソッドはx->yというマッピングを保存したいときに、このペアを保存するというメソッドです。

もしkeyとして設定してあるものが既にある（ここで言えばx->z）状態で、同じkeyを用いて違うvalue（x->y）をinsertした場合は内部の情報が上書きされます。

```rust
    pub fn release_post_fn(
        &mut self,
        account_id: AccountId,
        description: String,
        created_time: String,
        post_img_url: String,
    ) {
        // 指定されたウォレットアドレスに紐づいたプロフィール
        let profile_info: Profile = self.profile_map.get(&account_id).unwrap();

        // 投稿IDに紐づいた投稿情報を追加
        self.post_map.insert(
            &(self.post_map_counter),
            &Post {
                name: profile_info.name.unwrap_or("unknown".to_string()),
                user_id: profile_info.user_id,
                created_time,
                img_url: post_img_url,
                user_img_url: profile_info.img_url.unwrap(),
                description: description,
                num_of_likes: 0,
                post_id: self.post_map_counter,
            },
        );

        // 指定されたウォレットアドレスに紐づいたプロフィール
        let mut profile: Profile = self.profile_map.get(&account_id).unwrap();

        // 上で追加した時に使用した投稿IDをプロフィールに追加
        profile.post_id_list.push(self.post_map_counter);

        // プロフィールのマッピングを上書き
        self.profile_map.insert(&account_id, &profile);

        // 投稿IDを１大きくする
        self.post_map_counter = &self.post_map_counter + 1;
    }
```

次に宣言しているのは`get_general_post_fn関数`です。投稿するための関数で引数には

- num: 投稿情報が格納されているマッピングからどのくらい最新のものを取得するか決めるための値

が設定されています。

まずは先ほど述べた取得する投稿数と最新度の設定方法について説明します。

下の部分が取得のメソッドで、if部分でそもそもの投稿リストの要素数が取得したい数より少ない時はfor文でリスト内の要素を全部取得します。

そうでない場合は投稿リストのうち取得したい部分をnumによって指定してその部分を取得します。例えば10個の要素があって3つだけ取得したいときには最後の3つかその前の3つか...をnumで指定します。

```rust
// 全ての投稿から指定の最新度の投稿を取得
    pub fn get_general_post_fn(&self, num: u128) -> Vec<Post> {
        // 返す投稿のリスト用のリストを生成
        let mut post_list: Vec<Post> = Vec::new();

        // 投稿マッピングの大きさを取得
        let length: u128 = self.post_map_counter;

        // どれくらいの量の投稿を取得するかを指定
        let amount_index: u128 = 5;

        // コントラクトに格納された投稿の量が指定された量の投稿より多いか判定。
        // それによって取得方法が異なるため
        if length < amount_index + 1 {
            for m in 0..(length + 1) {
                // 指定された投稿を取得して、最初に生成されたリストに格納
                let post: Option<Post> = self.post_map.get(&m);
                if post.is_some() {
                    post_list.push(post.unwrap());
                }
            }
        } else {
            for n in (amount_index * (num - 1))..(amount_index * num) {
                // 指定された投稿を取得して、最初に生成されたリストに格納
                let post: Option<Post> = self.post_map.get(&(length - n - 1));
                if post.is_some() {
                    post_list.push(post.unwrap());
                }
            }
        }
        // 返り値用のリストを返す。returnは省略可能
        post_list
    }
```

ここで使用されているいくつかのメソッドを説明します。

まずOption型について解説します。Option型とは値が存在するときは`Some(x)`（xが中身）、存在しないnullの状態の時には`None()`となります。これはnull、つまりデータが存在しない部分にアクセスしてエラーがおきないようにするためです。

このようなOption型に用意してある`unwrap`というメソッドは、Some（x）の場合にデータの中身であるxを取り出すためのメソッドです。

また、最後に`post_list`が単独で記述されていますが、これは`post_list`が返り値として返されることを表しています。

次の`get_individual_post_fn関数`は`get_general_post関数`とほとんど同じなので解説は省略します

```rust
    // 個人の投稿を取得
    pub fn get_individual_post_fn(&self, num: u128, account_id: AccountId) -> Vec<Post> {
        // 返す投稿のリスト用のリストを生成
        let mut post_list: Vec<Post> = Vec::new();

        // 指定したユーザーのウォレットアドレスに紐づいた投稿IDを取得する
        let post_id_list: Vec<u128> = self.profile_map.get(&account_id).unwrap().post_id_list;

        // どれくらいの量の投稿を取得するかを指定
        let amount_index: u128 = 5;

        // 投稿IDのリストの長さを取得
        let length: u128 = post_id_list.len() as u128;

        // コントラクトに格納された投稿の量が指定された量の投稿より多いか判定。
        // それによって取得方法が異なるため
        if length < amount_index + 1 {
            for m in 0..(length) {
                // 指定された投稿を取得して、最初に生成されたリストに格納
                let post: Option<Post> = self.post_map.get(&post_id_list[m as usize]);
                if post.is_some() {
                    post_list.push(post.unwrap());
                }
            }
        } else {
            for n in (amount_index * (num - 1))..(amount_index * num) {
                // 指定された投稿を取得して、最初に生成されたリストに格納
                let post: Option<Post> =
                    self.post_map.get(&post_id_list[(length - n - 1) as usize]);
                if post.is_some() {
                    post_list.push(post.unwrap());
                }
            }
        }
        // 返り値用のリストを返す。returnは省略可能
        post_list
```

次に`add_likes_fn関数`は指定した投稿にlikeを追加するための関数です。

```rust
    // 指定された投稿にいいねを追加
    pub fn add_likes_fn(&mut self, post_id: u128) {
        // 指定された投稿の情を取得
        let mut post: Post = self.post_map.get(&post_id).unwrap();

        // 投稿のいいね数を１大きくする
        post.num_of_likes = &post.num_of_likes + 1;

        // 指定した投稿の情報を上書き
        self.post_map.insert(&post_id, &post);
    }
```

最後に`get_total_likes_fn関数`は指定されたアカウントの投稿に含まれているいいねの総数を取得する関数です。

これはトークンを配布する時に使用されることになります。

```rust
    // 指定されたアカウントの投稿に含まれているいいねの総数を取得する関数
    pub fn get_total_likes_fn(&self, account_id: AccountId) -> u128 {
        // 指定したアカウントに紐づく投稿 id のリストを取得
    let post_id_list = self.profile_map.get(&account_id).unwrap().post_id_list;

        // 返り値となるいいね数の総数を格納する変数
        let mut num_of_likes = 0;

        // 取得した投稿idリストの各要素となるidに紐づく投稿が獲得したいいね数を合計する
        for id in post_id_list {
            let likes_of_post = self.post_map.get(&id).unwrap().num_of_likes;
            num_of_likes = num_of_likes + likes_of_post;
        }

        // いいねの総数を返す
        num_of_likes
    }
```

これで`post.rs`の実装は完了です。

では次にlib.rsを下のように編集してpost.rsのエラーを無くしましょう。

[`lib.rs`]

```rust
#![cfg_attr(not(feature = "std"), no_std)]

mod follow;
mod message;
mod metadata;
mod post;
mod profile;

use ink_lang as ink;

#[ink::contract]
mod astar_sns_contract {
use ink_env::debug_println;
use ink_lang::codegen::Env;
use ink_prelude::vec::Vec;
use openbrush::storage::Mapping;
use openbrush::test_utils::accounts;

    pub use crate::follow::*;
    pub use crate::message::*;
    pub use crate::metadata::*;
    pub use crate::post::*;

    #[ink(storage)]
    pub struct AstarSnsContract {
        pub profile_map: Mapping<AccountId, Profile>,
        pub post_map: Mapping<u128, Post>,
        pub post_map_counter: u128,
        pub message_list_map: Mapping<u128, Vec<Message>>,
        pub message_list_map_counter: u128,
    }

    impl AstarSnsContract {
        #[ink(constructor)]
        pub fn new() -> Self {
            Self {
                profile_map: Mapping::default(),
                post_map: Mapping::default(),
                post_map_counter: 0,
                message_list_map: Mapping::default(),
                message_list_map_counter: 0,
            }
        }

        #[ink(constructor)]
        pub fn default() -> Self {
            Self::new()
        }

        #[ink(message)]
        pub fn debug(&self) {
            debug_println!("Hello World!");
        }
    }

}

```

下の部分にエラーが発生して最後まで消えない方もいるかもしれませんが、wasmファイルの作成などには問題ないので大丈夫です。

```rust
    pub struct AstarSnsContract {
        pub profile_map: Mapping<AccountId, Profile>,
        pub post_map: Mapping<u128, Post>,
        pub post_map_counter: u128,
        pub message_list_map: Mapping<u128, Vec<Message>>,
        pub message_list_map_counter: u128,
    }
```

これで投稿機能の作成は完了です。

次に下のようにfollow.rsを編集してフォロー機能を実装して行きましょう！

[`follow.rs`]

```rust
use crate::metadata::*;
use ink_env::AccountId;
use ink_prelude::vec::Vec;

use crate::astar_sns_contract::AstarSnsContract;

impl AstarSnsContract {
    // フォロー関数
    pub fn follow_fn(&mut self, following_account_id: AccountId, followed_account_id: AccountId) {
        // 関数を読んだユーザーがフォローしているユーザーのプロフィール情報を取得
        let mut following_user_profile: Profile =
            self.profile_map.get(&following_account_id).unwrap();

        // 関数を読んだユーザーがフォローされているユーザーのプロフィール情報を取得
        let mut followed_user_profile: Profile =
            self.profile_map.get(&followed_account_id).unwrap();

        // 自分のフォローするユーザーのウォレットアドレスを自分のフォローリストに追加
        if !following_user_profile
            .following_list
            .contains(&followed_account_id)
        {
            following_user_profile
                .following_list
                .push(followed_account_id);
        }

        // 自分のウォレットアドレスを、自分のフォローするユーザーのフォロワーリストに追加
        if !followed_user_profile
            .follower_list
            .contains(&followed_account_id)
        {
            followed_user_profile
                .follower_list
                .push(following_account_id);
        }

        // 自分のメッセージリストのIDのリストの長さを取得
        let length: usize = following_user_profile.message_list_id_list.len();

        // 自分かフォローするアカウントのどちらかがメッセージリストを持っていないか確認
        if followed_user_profile.message_list_id_list.len() == 0
            && following_user_profile.message_list_id_list.len() == 0
        {
            // 二人のメッセージ用のメッセージリストのIDをそれぞれに追加
            followed_user_profile
                .message_list_id_list
                .push(self.message_list_map_counter);
            following_user_profile
                .message_list_id_list
                .push(self.message_list_map_counter);
            following_user_profile.friend_list.push(followed_account_id);
            followed_user_profile.friend_list.push(following_account_id);

            // メッセージリストのIDカウンターを１大きくする
            self.message_list_map_counter = &self.message_list_map_counter + 1;
        }

        for n in 0..length {
            // 自分の持っているメッセージリストのIDを、フォローする相手が持っていない
            // 既に二人用のメッセージリストが作成されていないかを確認
            let is_contained = followed_user_profile
                .message_list_id_list
                .contains(&following_user_profile.message_list_id_list[n]);

            // もし含まれていなければ(メッセージリストが作成されていなければ)メッセージリストのIDを追加
            if !is_contained {
                followed_user_profile
                    .message_list_id_list
                    .push(self.message_list_map_counter);
                following_user_profile
                    .message_list_id_list
                    .push(self.message_list_map_counter);
                following_user_profile.friend_list.push(followed_account_id);
                followed_user_profile.friend_list.push(following_account_id);
                self.message_list_map_counter = &self.message_list_map_counter + 1;
            }
        }

        // それぞれのプロフィール情報を上書き
        self.profile_map
            .insert(&following_account_id, &following_user_profile);
        self.profile_map
            .insert(&followed_account_id, &followed_user_profile);
    }

    // get following list of specified account
    pub fn get_following_list_fn(&self, account_id: AccountId) -> Vec<AccountId> {
        let following_list: Vec<AccountId> =
            self.profile_map.get(&account_id).unwrap().following_list;
        following_list
    }

    // 指定したユーザーがフォローしているアカウントのフォローワーリストを取得
    pub fn get_follower_list_fn(&self, account_id: AccountId) -> Vec<AccountId> {
        let follower_list: Vec<AccountId> =
            self.profile_map.get(&account_id).unwrap().follower_list;
        follower_list
    }
}
```

ではそれぞれの関数でどのようにフォローするかやフォローリストの取得方法を説明したいと思います。また、フォローに伴ってメッセージ機能の説明もしていきます。

フォローについては`follow関数`で行われます。説明をわかりすくするためにフォローするユーザーをA、フォローされるユーザーをBとします。状態変数`profile_map`の中でAのプロフィール情報の中の`following_list`にBのウォレットアドレスを追加します。また、状態変数`profile_map`の中でBのプロフィール情報の中の`follower_list`にAのウォレットアドレスを追加します。

ここでフォローをしたときにそれぞれのユーザーのプロフィール情報にメッセージリスト（メッセージを格納したリスト）のidを追加します。

それがこの部分です。

まずフォローリスト、またはフォロワーリストにidがない場合はidの追加を行います。次に既にメッセージリストのidが作成されていないかを確認して、作成されていない場合にのみidを作成します。

これがないとお互いにフォローした時に1つのユーザーのペアでトークリストが複数存在することになります。

また、idが追加された時状態変数`message_list_map_counter`に1加えます。

```rust
// 自分のメッセージリストのIDのリストの長さを取得
        let length: usize = following_user_profile.message_list_id_list.len();

        // 自分かフォローするアカウントのどちらかがメッセージリストを持っていないか確認
        if followed_user_profile.message_list_id_list.len() == 0
            && following_user_profile.message_list_id_list.len() == 0
        {
            // 二人のメッセージ用のメッセージリストのIDをそれぞれに追加
            followed_user_profile
                .message_list_id_list
                .push(self.message_list_map_counter);
            following_user_profile
                .message_list_id_list
                .push(self.message_list_map_counter);

            // メッセージリストのIDカウンターを１大きくする
            self.message_list_map_counter = &self.message_list_map_counter + 1;
        }

        for n in 0..length {
            // 自分の持っているメッセージリストのIDを、フォローする相手が持っていないかの値を取得
            // 既に二人用のメッセージリストが作成されていないかを確認
            let is_contained = followed_user_profile
                .message_list_id_list
                .contains(&following_user_profile.message_list_id_list[n]);

            // もし含まれていなければ(メッセージリストが作成されていなければ)メッセージリストのIDを追加
            if !is_contained {
                followed_user_profile
                    .message_list_id_list
                    .push(self.message_list_map_counter);
                following_user_profile
                    .message_list_id_list
                    .push(self.message_list_map_counter);
                self.message_list_map_counter = &self.message_list_map_counter + 1;
            }
        }

        // それぞれのプロフィール情報を上書き
        self.profile_map
            .insert(&following_account_id, &following_user_profile);
        self.profile_map
            .insert(&followed_account_id, &followed_user_profile);
    }
```

フォローリスト、フォロワーリストの取得は`get_following_list関数`、`get_follower_list関数`で行われます。状態変数`profile_map`から指定のユーザーのものを取得するというものです。

これでフォロー機能の実装は完了です。

次のレッスンではメッセージ機能とプロフィール機能を作成しましょう！

### 🙋‍♂️ 質問する

わからないことがあれば、Discordの`#astar`でsection・Lesson名とともに質問をしてください 👋

---

次のレッスンでは、メッセージ機能、プロフィール作成機能を実装していきます！ 🎉
