### 📖 ノートの管理機能を実装しよう

このセクションでは、ユーザーがノートの追加・取得・更新・削除を行うための機能を実装していきます。

### 🛠 バックエンドキャニスターの実装

まずはノートを管理するデータ構造を考えたいと思います。

各ユーザーはノートを任意の数保存できるものとします。よって、ノートは配列で保存することにしましょう。

```rust
Vec<EncryptedNote>
```

さらに、各ユーザーごとにノートを管理したいので、ユーザーの識別情報とノートをマッピングで紐付けるようにしましょう。ユーザーの識別情報には、プリンシパルを使用します。プリンシパルはInternet Computer上のアドレスのようなもので、ユーザーを一意に識別するために使用します。

```rust
HashMap<Principal, Vec<EncryptedNote>>
```

それでは、実際にコードを記述していきましょう。

まずは、`encrypted_notes_backend/src/`下に`notes.rs`を作成します。

```diff
encrypted_notes_backend/
└── src/
    ├── lib.rs
+   └── notes.rs
```

作成した`notes.rs`の先頭に、[useキーワード](https://doc.rust-lang.org/std/keyword.use.html)でファイル内で使用したい機能をインポートします。

```rust
use candid::CandidType;
use ic_cdk::export::Principal;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
```

その下に、ノートを管理する構造体を定義します。

```rust
#[derive(CandidType, Clone, Serialize, Deserialize)]
pub struct EncryptedNote {
    pub id: u128,
    pub data: String,
}

#[derive(Default)]
pub struct Notes {
    pub notes: HashMap<Principal, Vec<EncryptedNote>>,
    pub counter: u128,
}
```

ここまでのコードを確認していきましょう。

最初に、様々な機能をインポートしています。
- [candid](https://docs.rs/candid/0.8.0/candid/index.html)は、Rustの値とCandidとの間で、データをシームレスに変換するためのモジュールです。
- [ic_cdk](https://docs.rs/ic-cdk/0.7.0/ic_cdk/index.html)は、Internet Computerのキャニスターを開発するための基本的なライブラリを提供します。ここでは、[Principal](https://docs.rs/ic-cdk/0.7.0/ic_cdk/export/struct.Principal.html)（Internet Computer上のID）を扱うための機能をインポートしています。
- [serde](https://docs.rs/serde/1.0.174/serde/index.html)は、Rustのデータ構造をシリアライズおよびデシリアライズするためのフレームワークです。シリアライズとは、データ構造を適切なフォーマットに変換することで、デシリアライズとはその逆の操作です。データを変換することは、異なるプログラミング言語間でデータの整合性を維持するためにとても大切です。

[#[derive()]](https://doc.rust-jp.rs/rust-by-example-ja/trait/derive.html)は、Rustの構造体やenumといった型にトレイト（機能）を自動的に実装するための構文です。例えばCandidTypeをderiveに設定することで、CandidとRust間のデータの変換に必要なコードを手間なく、かつ型安全に自動生成できるため、開発効率が向上します。

それでは、Notes構造体の下に[impl](https://doc.rust-lang.org/std/keyword.impl.html)キーワードを使用して、Notes構造体を操作する関数を定義しましょう。

```rust
impl Notes {
    pub fn get_notes(&self, caller: Principal) -> Vec<EncryptedNote> {
        self.notes.get(&caller).cloned().unwrap_or_default()
    }

    pub fn add_note(&mut self, caller: Principal, data: String) {
        let notes_of_caller = self.notes.entry(caller).or_default();

        notes_of_caller.push(EncryptedNote {
            id: self.counter,
            data,
        });
        self.counter += 1;
    }

    pub fn delete_note(&mut self, caller: Principal, id: u128) {
        if let Some(notes_of_caller) = self.notes.get_mut(&caller) {
            notes_of_caller.retain(|n| n.id != id); // 条件式がtrueのものだけ残します。
        }
    }

    pub fn update_note(&mut self, caller: Principal, new_note: EncryptedNote) {
        if let Some(current_note) = self
            .notes
            .get_mut(&caller)
            .and_then(|notes_of_caller| notes_of_caller.iter_mut().find(|n| n.id == new_note.id))
        {
            current_note.data = new_note.data;
        }
    }
}
```

定義した関数を順番に確認していきましょう。

まずは、`get_notes`関数です。この関数は、ユーザーのプリンシパルを引数として受け取り、そのユーザーが保存しているノート一覧を返します。[get](https://doc.rust-lang.org/stable/std/collections/struct.HashMap.html#method.get)メソッドにHashMapのキー（ここではプリンシパル）を渡すことで、キーに紐づく値（ノート）を取得することができます。HashMapにユーザーがノートを保存していない場合は、空の配列を返します。

```rust
// notes.rs
    pub fn get_notes(&self, caller: Principal) -> Vec<EncryptedNote> {
        self.notes.get(&caller).cloned().unwrap_or_default()
    }
```

次に、`add_note`関数です。この関数は、ユーザーが保存する`Vec<EncryptedNote>`に新たなノートを追加します。[entry](https://doc.rust-lang.org/stable/std/collections/struct.HashMap.html#method.entry)メソッドを使用することで、既存の値への変更可能な参照を取得したり、ユーザーがノートをまだ1つも保存していない場合は、[or_default](https://doc.rust-lang.org/stable/std/collections/hash_map/enum.Entry.html#method.or_default)メソッドでデフォルト値（ここでは空の配列）を取得することができます。ノートを追加した後に、カウンターをインクリメントして次のノートのIDを準備します。

```rust
// notes.rs
    pub fn add_note(&mut self, caller: Principal, data: String) {
        let notes_of_caller = self.notes.entry(caller).or_default();

        notes_of_caller.push(EncryptedNote {
            id: self.counter,
            data,
        });
        self.counter += 1;
    }
```

次に、`delete_note`関数です。この関数は、ユーザーのプリンシパルとノートのIDを引数として受け取り、ノートを削除します。[get_mut](https://doc.rust-lang.org/stable/std/collections/struct.HashMap.html#method.get_mut)メソッドを使用することで、ユーザーが保存する`Vec<EncryptedNote>`への変更可能な参照を取得することができます。[retain](https://doc.rust-lang.org/stable/std/collections/struct.HashMap.html#method.retain)メソッドは、指定された要素のみを保持します。つまり、ここでは削除したいノートのIDと**一致しない**ノートのみを保持します。

```rust
// notes.rs
    pub fn delete_note(&mut self, caller: Principal, id: u128) {
        if let Some(notes_of_caller) = self.notes.get_mut(&caller) {
            notes_of_caller.retain(|n| n.id != id); // 条件式がtrueのものだけ残します。
        }
    }
```

最後に、`update_note`関数です。この関数は、保存されているノートを引数で受け取ったノートで更新します。更新するノートは[find](https://doc.rust-lang.org/std/iter/trait.Iterator.html#method.find)メソッドを使用して、IDをもとに探します。

```rust
// notes.rs
    pub fn update_note(&mut self, caller: Principal, new_note: EncryptedNote) {
        if let Some(current_note) = self
            .notes
            .get_mut(&caller)
            .and_then(|notes_of_caller| notes_of_caller.iter_mut().find(|n| n.id == new_note.id))
        {
            current_note.data = new_note.data;
        }
    }
```

ここまでで、ノートを管理する構造体とそれを操作する関数が定義できました。

次は`lib.rs`を更新して、notesモジュールの関数を呼び出しましょう。

```rust
use crate::notes::*;
use ic_cdk::api::caller as caller_api;
use ic_cdk::export::Principal;
use ic_cdk_macros::*;
use std::cell::RefCell;

mod notes;

thread_local! {
    static NOTES: RefCell<Notes> = RefCell::default();
}

// 関数をコールしたユーザーのプリンシパルを取得します。
fn caller() -> Principal {
    let caller = caller_api();

    // 匿名のプリンシパルを禁止します(ICキャニスターの推奨されるデフォルトの動作)。
    if caller == Principal::anonymous() {
        panic!("Anonymous principal is not allowed");
    }
    caller
}

#[query(name = "getNotes")]
fn get_notes() -> Vec<EncryptedNote> {
    let caller = caller();
    NOTES.with(|notes| notes.borrow().get_notes(caller))
}

#[update(name = "addNote")]
fn add_note(encrypted_text: String) {
    let caller = caller();
    NOTES.with(|notes| {
        notes.borrow_mut().add_note(caller, encrypted_text);
    })
}

#[update(name = "deleteNote")]
fn delete_note(id: u128) {
    let caller = caller();
    NOTES.with(|notes| {
        notes.borrow_mut().delete_note(caller, id);
    })
}

#[update(name = "updateNote")]
fn update_note(new_note: EncryptedNote) {
    let caller = caller();
    NOTES.with(|notes| {
        notes.borrow_mut().update_note(caller, new_note);
    })
}

```

順番にコードを確認していきましょう。

useキーワードを使用してnotesモジュールをインポートしています。これは、notesモジュール内で定義された構造体や関数をlib.rsから呼び出すために必要です。

```rust
use crate::notes::*;
```

その下に、modキーワードを使用してnotesモジュールを定義しています。これは、notesモジュールが別ファイルに定義されていることをコンパイラに伝えるために必要です。

```rust
mod notes;
```

次に、thread_localマクロを使用して、Notes構造体を格納するRefCellを定義しています。RefCellは、可変性を持つ値を格納するためのコンテナです。RefCellを使用することで、Notes構造体を可変にすることができます。

```rust
thread_local! {
    static NOTES: RefCell<Notes> = RefCell::default();
}
```

その下に、caller関数を定義しています。caller関数は、関数を呼び出したユーザーのプリンシパルを取得するために使用します。プリンシパルは、ユーザーを一意に識別するためのアドレスのようなものです。`caller_api`関数で取得したプリンシパルが匿名である場合は、エラーを返します。

<!-- TODO: 匿名のプリンシパルについて説明を加える -->

```rust
fn caller() -> Principal {
    let caller = caller_api();

    // 匿名のプリンシパルを禁止します(ICキャニスターの推奨されるデフォルトの動作)。
    if caller == Principal::anonymous() {
        panic!("Anonymous principal is not allowed");
    }
    caller
}
```

最後に、各関数の中でNotes構造体を操作する関数を呼び出しています。

```rust
#[query(name = "getNotes")]
fn get_notes() -> Vec<EncryptedNote> {
    let caller = caller();
    NOTES.with(|notes| notes.borrow().get_notes(caller))
}
```

ここまでで、ノートを管理するバックエンドキャニスターの実装は完了です。

### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discordの`#icp`で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の4点を記載してください ✨

```
1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット
```

---

次のレッスンに進み、フロントエンドから呼び出すためにインタフェースを作成しましょう！