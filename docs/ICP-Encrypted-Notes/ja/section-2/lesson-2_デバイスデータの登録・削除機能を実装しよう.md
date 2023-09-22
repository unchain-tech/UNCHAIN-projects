### 🛠 バックエンドキャニスターの実装

バックエンドキャニスターにデバイスデータの登録・削除機能を実装しましょう。デバイスデータの削除機能は、ノートを共有しているデバイス一覧からあるデバイスを削除したいときに使います。

まずは、コードを記述するファイルを用意しましょう。`encrypted_notes_backend/src/`下に`devices.rs`を作成します。

```diff
encrypted_notes_backend/
└── src/
+   ├── devices.rs
    ├── lib.rs
    └── notes.rs
```

作成した`devices.rs`の先頭に、useキーワードでファイル内で使用したい機能をインポートします。

```rust
use candid::{CandidType, Principal};
use serde::{Deserialize, Serialize};
use std::collections::hash_map::Entry;
use std::collections::HashMap;
```

その下に、type文を使用して、既存の型に新しい名前（[エイリアス](https://doc.rust-jp.rs/rust-by-example-ja/types/alias.html)）を付けます。

```rust
/// devicesモジュール内のエラーを表す列挙型です。
#[derive(CandidType, Deserialize, Eq, PartialEq)]
pub enum DeviceError {
    AlreadyRegistered,
    DeviceNotRegistered,
    KeyNotSynchronized,
    UnknownPublicKey,
}

/// 型のエイリアスです。
pub type DeviceAlias = String;
pub type PublicKey = String;
pub type EncryptedSymmetricKey = String;
pub type RegisterKeyResult = Result<(), DeviceError>;
pub type SynchronizeKeyResult = Result<EncryptedSymmetricKey, DeviceError>;
```

エイリアスは、複雑な型名を簡単な名前に置き換えたり、コードの意図を明確にするためなどに使用します。[enum](https://doc.rust-jp.rs/book-ja/ch06-01-defining-an-enum.html)を使用して、エラーの種類を定義しています。`DeviceError`列挙型は、[Result](https://doc.rust-jp.rs/rust-by-example-ja/error/result.html)型のエラーの種類を表現するために使用します。

では、`pub type SynchronizeKeyResult = Result<EncryptedSymmetricKey, DeviceError>;`の下にデバイスデータを管理する構造体を定義します。

```rust
/// デバイスのエイリアスと鍵を紐付けて保存する構造体です。
#[derive(CandidType, Clone, Serialize, Deserialize)]
pub struct DeviceData {
    pub aliases: HashMap<DeviceAlias, PublicKey>,
    pub keys: HashMap<PublicKey, EncryptedSymmetricKey>,
}

/// devicesモジュール内のデータを管理する構造体です。
/// * `devices` - Principalとデバイスデータを紐づけて保存します。
#[derive(Default)]
pub struct Devices {
    pub devices: HashMap<Principal, DeviceData>,
}
```

`Devices`構造体は、プリンシパルとデバイスデータを紐づけて保存するための構造体です。ここでマッピングの値には、`DeviceData`構造体を使用しています。`DeviceData`構造体は、デバイスエイリアスと公開鍵を紐づける`aliases`と公開鍵と暗号化された対称鍵を紐づける`keys`をメンバーに持ちます。

次に、Devices構造体の下に下記のコードを記述しましょう。

```rust
impl Devices {
    /// 指定したPrincipalとデバイスデータを紐付けて登録します。
    pub fn register_device(
        &mut self,
        caller: Principal,
        alias: DeviceAlias,
        public_key: PublicKey,
    ) {
        match self.devices.entry(caller) {
            // 既にプリンシパルが登録されている場合は、デバイスデータを追加します。
            Entry::Occupied(mut device_data_entry) => {
                let device_data = device_data_entry.get_mut();
                match device_data.aliases.entry(alias) {
                    // 既にデバイスエイリアスが登録されている場合は、何もしません。
                    Entry::Occupied(_) => {}
                    // デバイスエイリアスが登録されていない場合は、デバイスエイリアスと公開鍵を紐づけて保存します。
                    Entry::Vacant(alias_entry) => {
                        alias_entry.insert(public_key);
                    }
                }
            }
            // 初めて登録する場合は、プリンシパルとデバイスデータを紐づけて保存します。
            Entry::Vacant(empty_device_data_entry) => {
                let mut device_data = DeviceData {
                    aliases: HashMap::new(),
                    keys: HashMap::new(),
                };
                // デバイスエイリアスと公開鍵を紐づけて保存します。
                device_data.aliases.insert(alias, public_key);
                empty_device_data_entry.insert(device_data);
            }
        }
    }

    /// 指定したPrincipalが持つデバイスエイリアス一覧を取得します。
    pub fn get_device_aliases(&self, caller: Principal) -> Vec<DeviceAlias> {
        self.devices
            .get(&caller)
            .map(|device_data| device_data.aliases.keys().cloned().collect())
            .unwrap_or_default()
    }

    /// 指定したPrincipalのデバイスから、エイリアスが一致するデバイスを削除します。
    pub fn delete_device(&mut self, caller: Principal, alias: DeviceAlias) {
        if let Some(device_data) = self.devices.get_mut(&caller) {
            // プリンシパルは、必ず1つ以上のデバイスエイリアスが紐づいているものとします。
            assert!(device_data.aliases.len() > 1);

            let public_key = device_data.aliases.remove(&alias);
            if let Some(public_key) = public_key {
                device_data.keys.remove(&public_key);
            }
        }
    }
}
```

追加したコードを確認しましょう。最初に、デバイスデータを登録する`register_device`関数を定義しました。この関数は、プリンシパルとデバイスデータを紐づけて保存します。プリンシパルが既に登録されている場合は、デバイスデータを追加します。プリンシパルが初めて登録される場合は、マッピングを新たに作成して保存します。

次に、デバイスデータを取得する`get_device_aliases`関数を定義しました。この関数は、プリンシパルに紐づいているデバイスエイリアスを取得します。プリンシパルが登録されていない場合は、空のベクターを返します。

最後に、デバイスデータを削除する`delete_device`関数を定義しました。この関数は、引数に受け取ったデバイスエイリアスをマッピングから削除します。ただし、プリンシパルに紐づいているデバイスエイリアスが1つの場合は、削除を行いません。

```rust
            // プリンシパルは、必ず1つ以上のデバイスエイリアスが紐づいているものとします。
            assert!(device_data.aliases.len() > 1);
```

removeは削除した値を返すので、公開鍵と暗号化された対称鍵を紐づけるマッピングからも削除します。

```rust
            let public_key = device_data.aliases.remove(&alias);
            if let Some(public_key) = public_key {
                device_data.keys.remove(&public_key);
            }
```

では、`lib.rs`を更新してdevices.rsの機能を呼び出すようにしましょう。

`use crate::notes::*;`の上に、下記のコードを追加します。

```rust
use crate::devices::*;
```

`mod notes;`の上に、下記のコードを追加します。

```rust
mod devices;
```

`thread_local!{}`を、下記のように更新します。

```rust
thread_local! {
    static DEVICES: RefCell<Devices> = RefCell::default();
    static NOTES: RefCell<Notes> = RefCell::default();
}
```

`fn caller() -> Principal {}`の下に、下記の関数を追加します。

```rust
#[update(name = "registerDevice")]
fn register_device(alias: DeviceAlias, public_key: PublicKey) {
    let caller = caller();

    DEVICES.with(|devices| {
        devices
            .borrow_mut()
            .register_device(caller, alias, public_key)
    })
}

#[query(name = "getDeviceAliases")]
fn get_device_aliases() -> Vec<DeviceAlias> {
    let caller = caller();

    DEVICES.with(|devices| devices.borrow().get_device_aliases(caller))
}

#[update(name = "deleteDevice")]
fn delete_device(alias: DeviceAlias) {
    let caller = caller();

    DEVICES.with(|devices| {
        devices.borrow_mut().delete_device(caller, alias);
    })
}
```

最後に、デバイスデータを登録したプリンシパルのみがアプリケーションの機能を利用できるようにします。登録をしていないプリンシパルに、データを共有してしまうことがないようにするためです。そのためには、プリンシパルが`DEVICES`に保存されているかを確認する必要があります。下記の関数を`register_device`関数の上に定義しましょう。

```rust
fn is_caller_registered(caller: Principal) -> bool {
    DEVICES.with(|devices| devices.borrow().devices.contains_key(&caller))
}
```

is_caller_registered関数を、**register_device関数以外のすべての関数**で呼び出します。register_device以外の各関数に定義されている`let caller = caller();`の下に、アサーションを追加しましょう。

例）

```rust
#[query(name = "getDeviceAliases")]
fn get_device_aliases() -> Vec<DeviceAlias> {
    let caller = caller();
    // `is_caller_registered`を追加して、関数を呼び出したプリンシパルが登録されているかを確認します。
    assert!(is_caller_registered(caller));

    DEVICES.with(|devices| devices.borrow().get_device_aliases(caller))
}
```

ここまでで、`lib.rs`はこのようになっているでしょう。

```rust
// lib.rs
use crate::devices::*;
use crate::notes::*;
use candid::Principal;
use ic_cdk::api::caller as caller_api;
use ic_cdk_macros::{export_candid, query, update};
use std::cell::RefCell;

mod devices;
mod notes;

thread_local! {
    static DEVICES: RefCell<Devices> = RefCell::default();
static NOTES: RefCell<Notes> = RefCell::default();
}

// 関数をコールしたユーザーPrincipalを取得します。
fn caller() -> Principal {
    let caller = caller_api();

    // 匿名のPrincipalを禁止します(ICキャニスターの推奨されるデフォルトの動作)。
    if caller == Principal::anonymous() {
        panic!("Anonymous principal is not allowed");
    }
    caller
}

fn is_caller_registered(caller: Principal) -> bool {
    DEVICES.with(|devices| devices.borrow().devices.contains_key(&caller))
}

#[update(name = "registerDevice")]
fn register_device(alias: DeviceAlias, public_key: PublicKey) {
    let caller = caller();

    DEVICES.with(|devices| {
        devices
            .borrow_mut()
            .register_device(caller, alias, public_key)
    })
}

#[query(name = "getDeviceAliases")]
fn get_device_aliases() -> Vec<DeviceAlias> {
    let caller = caller();
    assert!(is_caller_registered(caller));

    DEVICES.with(|devices| devices.borrow().get_device_aliases(caller))
}

#[update(name = "deleteDevice")]
fn delete_device(alias: DeviceAlias) {
    let caller = caller();
    assert!(is_caller_registered(caller));

    DEVICES.with(|devices| {
        devices.borrow_mut().delete_device(caller, alias);
    })
}

#[query(name = "getNotes")]
fn get_notes() -> Vec<EncryptedNote> {
    let caller = caller();
    assert!(is_caller_registered(caller));

    NOTES.with(|notes| notes.borrow().get_notes(caller))
}

#[update(name = "addNote")]
fn add_note(data: String) {
    let caller = caller();
    assert!(is_caller_registered(caller));

    NOTES.with(|notes| {
        notes.borrow_mut().add_note(caller, data);
    })
}

#[update(name = "deleteNote")]
fn delete_note(id: u128) {
    let caller = caller();
    assert!(is_caller_registered(caller));

    NOTES.with(|notes| {
        notes.borrow_mut().delete_note(caller, id);
    })
}

#[update(name = "updateNote")]
fn update_note(new_note: EncryptedNote) {
    let caller = caller();
    assert!(is_caller_registered(caller));

    NOTES.with(|notes| {
        notes.borrow_mut().update_note(caller, new_note);
    })
}

// .didファイルを生成します。
export_candid!();

```

### 🤝 インタフェースを更新しよう

関数を新しく追加したので、インタフェースを更新しましょう。下記のコマンドを実行します。

```
npm run generate:did
```

ファイルに関数の定義が追加されたことを確認しましょう。

### ✅ 動作確認をしよう

現在のテストスクリプトを実行すると、下のようなエラーが発生するかと思います。addNote関数を実行した際に、アサーションエラーが発生しています。

```
# 実行例
===== addNote =====
2023-09-11 07:46:06.904263 UTC: [Canister bkyz2-fmaaa-aaaaa-qaaaq-cai] Panicked at 'assertion failed: is_caller_registered(caller)', src/encrypted_notes_backend/src/lib.rs:70:5
Error: Failed update call.
Caused by: Failed update call.
  The Replica returned an error: code 5, message: "Canister bkyz2-fmaaa-aaaaa-qaaaq-cai trapped explicitly: Panicked at 'assertion failed: is_caller_registered(caller)', src/encrypted_notes_backend/src/lib.rs:70:5"
Return none: ERR
1c1
< ()
---
>
```

これは、プリンシパルが登録済みかどうかのチェックを追加したためです。エラーを回避するには、register_device関数を最初に呼び出す必要があります。

では、テストスクリプトを更新します。下記の内容を`FUNCTION='addNote'`の上に記述しましょう。

```
# ===== テスト =====
FUNCTION='registerDevice'
echo -e "\n===== $FUNCTION ====="
EXPECT='()'
RESULT=`dfx canister call encrypted_notes_backend $FUNCTION '('\"$TEST_DEVICE_ALIAS_01\"', '\"$TEST_PUBLIC_KEY_01\"')'`
compare_result "Return none" "$EXPECT" "$RESULT" || TEST_STATUS=1

EXPECT='()'
RESULT=`dfx canister call encrypted_notes_backend $FUNCTION '('\"$TEST_DEVICE_ALIAS_02\"', '\"$TEST_PUBLIC_KEY_02\"')'`
compare_result "Return none" "$EXPECT" "$RESULT" || TEST_STATUS=1

FUNCTION='deleteDevice'
echo -e "\n===== $FUNCTION ====="
EXPECT='()'
RESULT=`dfx canister call encrypted_notes_backend $FUNCTION '('\"$TEST_DEVICE_ALIAS_01\"')'`
compare_result "Return none" "$EXPECT" "$RESULT" || TEST_STATUS=1

FUNCTION='getDeviceAliases'
echo -e "\n===== $FUNCTION ====="
EXPECT='(vec { '\"$TEST_DEVICE_ALIAS_02\"' })'
RESULT=`dfx canister call encrypted_notes_backend $FUNCTION`
compare_result "Return deviceAliases list $FUNCTION" "$EXPECT" "$RESULT" || TEST_STATUS=1
```

次に、テストで使用するデバイスデータを定義します。下記を`TEST_STATUS=0`の下に追加してください。

```
TEST_DEVICE_ALIAS_01='TEST_DEVICE_ALIAS_01'
TEST_DEVICE_ALIAS_02='TEST_DEVICE_ALIAS_02'
TEST_PUBLIC_KEY_01='TEST_PUBLIC_KEY_01'
TEST_PUBLIC_KEY_02='TEST_PUBLIC_KEY_02'
TEST_ENCRYPTED_SYMMETRIC_KEY_01='TEST_ENCRYPTED_SYMMETRIC_KEY_01'
TEST_ENCRYPTED_SYMMETRIC_KEY_02='TEST_ENCRYPTED_SYMMETRIC_KEY_02'
```

テストスクリプトを実行してみましょう。

```
npm run test
```

全てのテストにパスしたら、バックエンドキャニスターの準備は完了です。

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

次のレッスンに進み、デバイスエイリアスを生成しましょう！
