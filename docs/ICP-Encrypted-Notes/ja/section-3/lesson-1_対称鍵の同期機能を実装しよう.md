### 🛠 バックエンドキャニスターの実装

バックエンドキャニスターに、対称鍵を同期するために必要な関数を実装します。

まずは、対称鍵を同期するための手順を再確認しましょう。

1. 公開鍵のアップロード
2. 対称鍵を保有するブラウザが、バックエンドキャニスターから公開鍵を取得
3. 公開鍵で対称鍵を暗号化
4. 暗号化された対称鍵をバックエンドキャニスターにアップロード
5. バックエンドキャニスターから暗号化された対称鍵を取得

このうち、「1. 公開鍵のアップロード」は既に実装済みです（register_device関数）。「3. 公開鍵で対称鍵を暗号化」はフロントエンド側で行います。

また、対称鍵を同期する前に対称鍵の生成が必要ですが、対称鍵はプリンシパルごとに1つしか生成しないため、生成の判断材料として対称鍵が登録されているかどうかを確認する必要もあります。よって、このレッスンで実装する関数は次のようになります。

1. 対称鍵が登録されているかどうかを確認する関数
2. 最初に対称鍵を保存する関数
3. 公開鍵を取得する関数
4. 暗号化された対称鍵を保存する関数
5. 暗号化された対称鍵を取得する関数

では、devices.rs内に定義している`delete_device`関数の下に、下記の関数を記述しましょう。

```rust
    /// 指定した公開鍵に紐づいている対称鍵を取得します。
    ///
    /// # Returns
    /// * `Ok(EncryptedSymmetricKey)` - 対称鍵が登録されている場合
    /// * `DeviceError::UnknownPublicKey` - 公開鍵が登録されていない場合
    /// * `DeviceError::KeyNotSynchronized` - 対称鍵が登録されていない場合
    /// * `DeviceError::DeviceNotRegistered` - Principalが登録されていない場合
    pub fn get_encrypted_symmetric_key(
        &mut self,
        caller: Principal,
        public_key: &PublicKey,
    ) -> SynchronizeKeyResult {
        match self.devices.get_mut(&caller) {
            Some(device_data) => {
                // 公開鍵が登録されているものであるかどうかを確認します。
                if !Self::is_registered_public_key(device_data, public_key) {
                    return Err(DeviceError::UnknownPublicKey);
                }
                match device_data.keys.get(public_key) {
                    // 対称鍵が登録されている場合は、暗号化された対称鍵を返します。
                    Some(encrypted_symmetric_key) => Ok(encrypted_symmetric_key.clone()),
                    // 対称鍵が登録されていない場合は、エラーとします。
                    None => Err(DeviceError::KeyNotSynchronized),
                }
            }
            // プリンシパルが登録されていない場合は、エラーとします。
            None => Err(DeviceError::DeviceNotRegistered),
        }
    }

    /// 対称鍵を持っていない公開鍵の一覧を取得します。
    pub fn get_unsynced_public_keys(&mut self, caller: Principal) -> Vec<PublicKey> {
        match self.devices.get_mut(&caller) {
            // 登録されている公開鍵のうち、対称鍵が登録されていないものをベクターで返します。
            Some(device_data) => device_data
                .aliases
                .values()
                .filter(|public_key| !device_data.keys.contains_key(*public_key))
                .cloned()
                .collect(),
            None => Vec::new(),
        }
    }

    /// 指定したPrincipalが対称鍵を持っているかどうかを確認するための関数です。
    /// この関数は、`register_encrypted_symmetric_key`が呼ばれる前に呼ばれることを想定しています。
    ///
    /// # Returns
    /// * `true` - 既に対称鍵が登録されている場合
    /// * `false` - 対称鍵が登録されていない場合
    pub fn is_encrypted_symmetric_key_registered(&self, caller: Principal) -> bool {
        self.devices
            .get(&caller)
            .map_or(false, |device_data| !device_data.keys.is_empty())
    }

    /// 指定したPrincipalのデバイスデータに、対称鍵を登録します。
    /// この関数は、Principal1つにつき、ただ一度だけ呼ばれることを想定しています。
    ///
    /// # Returns
    /// * `Ok(())` - 登録に成功した場合
    /// * `DeviceError::UnknownPublicKey` - 公開鍵が登録されていない場合
    /// * `DeviceError::AlreadyRegistered` - 既に対称鍵が登録されている場合
    /// * `DeviceError::DeviceNotRegistered` - Principalが登録されていない場合
    pub fn register_encrypted_symmetric_key(
        &mut self,
        caller: Principal,
        public_key: PublicKey,
        encrypted_symmetric_key: EncryptedSymmetricKey,
    ) -> RegisterKeyResult {
        match self.devices.get_mut(&caller) {
            Some(device_data) => {
                // 登録しようとしている公開鍵が、デバイスデータの登録時に既に登録されているものかどうかを確認します。
                if !Self::is_registered_public_key(device_data, &public_key) {
                    return Err(DeviceError::UnknownPublicKey);
                }
                // 既に対称鍵が登録されている場合は、エラーとします。
                if !device_data.keys.is_empty() {
                    return Err(DeviceError::AlreadyRegistered);
                }
                device_data.keys.insert(public_key, encrypted_symmetric_key);
                Ok(())
            }
            // プリンシパルが登録されていない場合は、エラーとします。
            None => Err(DeviceError::DeviceNotRegistered),
        }
    }

    /// 指定したPrincipalのデバイスデータに、公開鍵と対称鍵のペアを登録します。
    ///
    /// # Returns
    /// * `Ok(())` - 登録に成功した場合
    /// * `DeviceError::UnknownPublicKey` - 公開鍵が登録されていない場合
    /// * `DeviceError::DeviceNotRegistered` - Principalが登録されていない場合
    pub fn upload_encrypted_symmetric_keys(
        &mut self,
        caller: Principal,
        keys: Vec<(PublicKey, EncryptedSymmetricKey)>,
    ) -> RegisterKeyResult {
        match self.devices.get_mut(&caller) {
            Some(device_data) => {
                for (public_key, encrypted_symmetric_key) in keys {
                    if !Self::is_registered_public_key(device_data, &public_key) {
                        return Err(DeviceError::UnknownPublicKey);
                    }
                    device_data.keys.insert(public_key, encrypted_symmetric_key);
                }
                Ok(())
            }
            None => Err(DeviceError::DeviceNotRegistered),
        }
    }

    /// 指定したデバイスデータに、公開鍵が登録されているかどうかを確認するための関数です。
    /// この関数は、引数に`PublicKey`を受け取る関数内で使用します。
    fn is_registered_public_key(device_data: &DeviceData, public_key: &PublicKey) -> bool {
        device_data.aliases.values().any(|key| key == public_key)
    }
```

5つのpublic関数と1つのprivate関数を追加しました。定義した順序とは前後しますが、実際に呼び出す順番にコードを確認していきましょう。

1\. 対称鍵が登録されているかどうかを確認する関数：`is_encrypted_symmetric_key_registered`関数

この関数は、DeviceData構造体の`keys`が空かどうかを確認します。`keys`はHashMapなので、空かどうかを確認するには`is_empty`関数を使用します。

2\. 最初に対称鍵を保存する関数：`register_encrypted_symmetric_key`関数

この関数は、引数で受け取った公開鍵と暗号化された対称鍵を`keys`に保存します。この関数は、上記is_encrypted_symmetric_key_registered関数がfalseを返す場合にのみただ一度だけ呼び出されることを想定しています（1つのプリンシパルが複数の対称鍵を保存してしまわないようにするため）。そのため、keysが空でない場合はエラーを返します。

```rust
                // 既に対称鍵が登録されている場合は、エラーとします。
                if !device_data.keys.is_empty() {
                    return Err(DeviceError::AlreadyRegistered);
                }
```

3\. 公開鍵を取得する関数：`get_unsynced_public_keys`関数

この関数は、まだ暗号化された対称鍵と一緒に保存されていない公開鍵をベクターで返す関数です。

4\. 暗号化された対称鍵を保存する関数：`upload_encrypted_symmetric_keys`関数

この関数は、引数で受け取った公開鍵と暗号化された対称鍵をDeviceData構造体のkeysに保存します。

5\. 暗号化された対称鍵を取得する関数：`get_encrypted_symmetric_key`関数

この関数は、引数で受け取った公開鍵に対応する暗号化された対称鍵を返します。まだ同期処理が行われていない場合は、エラーを返します。

```rust
                match device_data.keys.get(public_key) {
                    // 対称鍵が登録されている場合は、暗号化された対称鍵を返します。
                    Some(encrypted_symmetric_key) => Ok(encrypted_symmetric_key.clone()),
                    // 対称鍵が登録されていない場合は、エラーとします。
                    None => Err(DeviceError::KeyNotSynchronized),
                }
```

`is_registered_public_key`関数は、引数で受け取った公開鍵がデバイスデータの登録時に既に登録されているものかどうかを確認する関数です。引数に公開鍵を受け取る関数内で使用して、未知の公開鍵が扱われてしまうことを防ぎます。

```rust
    fn is_registered_public_key(device_data: &DeviceData, public_key: &PublicKey) -> bool {
        device_data.aliases.values().any(|key| key == public_key)
    }
```

次に、`lib.rs`を更新します。下記のコードを`fn delete_device(alias: DeviceAlias) {}`の下に追加しましょう。

```rust
#[query(name = "getEncryptedSymmetricKey")]
fn get_encrypted_symmetric_key(public_key: PublicKey) -> SynchronizeKeyResult {
    let caller = caller();
    assert!(is_caller_registered(caller));

    DEVICES.with(|devices| {
        devices
            .borrow_mut()
            .get_encrypted_symmetric_key(caller, &public_key)
    })
}

#[query(name = "getUnsyncedPublicKeys")]
fn get_unsynced_public_keys() -> Vec<PublicKey> {
    let caller = caller();
    assert!(is_caller_registered(caller));

    DEVICES.with(|devices| devices.borrow_mut().get_unsynced_public_keys(caller))
}

#[query(name = "isEncryptedSymmetricKeyRegistered")]
fn is_encrypted_symmetric_key_registered() -> bool {
    let caller = caller();
    assert!(is_caller_registered(caller));

    DEVICES.with(|devices| {
        devices
            .borrow()
            .is_encrypted_symmetric_key_registered(caller)
    })
}

#[update(name = "registerEncryptedSymmetricKey")]
fn register_encrypted_symmetric_key(
    public_key: PublicKey,
    encrypted_symmetric_key: EncryptedSymmetricKey,
) -> RegisterKeyResult {
    let caller = caller();
    assert!(is_caller_registered(caller));

    DEVICES.with(|devices| {
        devices.borrow_mut().register_encrypted_symmetric_key(
            caller,
            public_key,
            encrypted_symmetric_key,
        )
    })
}

#[update(name = "uploadEncryptedSymmetricKeys")]
fn upload_encrypted_symmetric_keys(
    keys: Vec<(PublicKey, EncryptedSymmetricKey)>,
) -> RegisterKeyResult {
    let caller = caller();
    assert!(is_caller_registered(caller));

    DEVICES.with(|devices| {
        devices
            .borrow_mut()
            .upload_encrypted_symmetric_keys(caller, keys)
    })
}
```

### ✅ 動作確認をしよう

`test.sh`を更新します。`# ===== テスト =====`の部分を下記の内容で上書きしてください。

```bash
# ===== テスト =====
FUNCTION='registerDevice'
echo -e "\n===== $FUNCTION ====="
EXPECT='()'
RESULT=`dfx canister call encrypted_notes_backend $FUNCTION '('\"$TEST_DEVICE_ALIAS_01\"', '\"$TEST_PUBLIC_KEY_01\"')'`
compare_result "Return none" "$EXPECT" "$RESULT" || TEST_STATUS=1

FUNCTION='getDeviceAliases'
echo -e "\n===== $FUNCTION ====="
EXPECT='(vec { '\"$TEST_DEVICE_ALIAS_01\"' })'
RESULT=`dfx canister call encrypted_notes_backend $FUNCTION`
compare_result "Return device list" "$EXPECT" "$RESULT" || TEST_STATUS=1

FUNCTION='isEncryptedSymmetricKeyRegistered'
echo -e "\n===== $FUNCTION ====="
EXPECT='(false)'
RESULT=`dfx canister call encrypted_notes_backend $FUNCTION`
compare_result "Return false" "$EXPECT" "$RESULT" || TEST_STATUS=1

FUNCTION='registerEncryptedSymmetricKey'
echo -e "\n===== $FUNCTION ====="
EXPECT='(variant { Ok })'
RESULT=`dfx canister call encrypted_notes_backend $FUNCTION '('\"$TEST_PUBLIC_KEY_01\"', '\"$TEST_ENCRYPTED_SYMMETRIC_KEY_01\"')'`
compare_result "Return Ok" "$EXPECT" "$RESULT" || TEST_STATUS=1
# 確認
FUNCTION='registerEncryptedSymmetricKey'
EXPECT='(variant { Err = variant { AlreadyRegistered } })'
RESULT=`dfx canister call encrypted_notes_backend $FUNCTION '('\"$TEST_PUBLIC_KEY_01\"', '\"$TEST_ENCRYPTED_SYMMETRIC_KEY_01\"')'`
compare_result "Return Err(AlreadyRegistered)" "$EXPECT" "$RESULT" || TEST_STATUS=1
# 確認
FUNCTION='isEncryptedSymmetricKeyRegistered'
EXPECT='(true)'
RESULT=`dfx canister call encrypted_notes_backend $FUNCTION`
compare_result "Check with $FUNCTION" "$EXPECT" "$RESULT" || TEST_STATUS=1

# 鍵の同期処理
## 別のデバイスを登録する
echo -e "\n===== Register other device & check unsynced ====="
UNUSED_RESULR=`dfx canister call encrypted_notes_backend registerDevice '('\"$TEST_DEVICE_ALIAS_02\"', '\"$TEST_PUBLIC_KEY_02\"')'`
FUNCTION='getEncryptedSymmetricKey'
EXPECT='(variant { Err = variant { KeyNotSynchronized } })'
RESULT=`dfx canister call encrypted_notes_backend $FUNCTION '('\"$TEST_PUBLIC_KEY_02\"')'`
compare_result "Return Err(KeyNotSynchronized)" "$EXPECT" "$RESULT" || TEST_STATUS=1

FUNCTION='getUnsyncedPublicKeys'
echo -e "\n===== $FUNCTION ====="
EXPECT='(vec { '\"$TEST_PUBLIC_KEY_02\"' })'
RESULT=`dfx canister call encrypted_notes_backend $FUNCTION`
compare_result "Return unsynced public key list" "$EXPECT" "$RESULT" || TEST_STATUS=1

FUNCTION='uploadEncryptedSymmetricKeys'
echo -e "\n===== $FUNCTION ====="
EXPECT='(variant { Ok })'
RESULT=`dfx canister call encrypted_notes_backend $FUNCTION '(vec { record { '\"$TEST_PUBLIC_KEY_02\"'; '\"$TEST_ENCRYPTED_SYMMETRIC_KEY_02\"' } })'`
compare_result "Return Ok" "$EXPECT" "$RESULT" || TEST_STATUS=1

FUNCTION='getEncryptedSymmetricKey'
echo -e "\n===== $FUNCTION ====="
EXPECT='(variant { Ok = '\"$TEST_ENCRYPTED_SYMMETRIC_KEY_02\"' })'
RESULT=`dfx canister call encrypted_notes_backend $FUNCTION '('\"$TEST_PUBLIC_KEY_02\"')'`
compare_result "Return Ok" "$EXPECT" "$RESULT" || TEST_STATUS=1

FUNCTION='deleteDevice'
echo -e "\n===== $FUNCTION ====="
EXPECT='()'
RESULT=`dfx canister call encrypted_notes_backend $FUNCTION '('\"$TEST_DEVICE_ALIAS_01\"')'`
compare_result "Return none" "$EXPECT" "$RESULT" || TEST_STATUS=1
# 確認
FUNCTION='getDeviceAliases'
EXPECT='(vec { '\"$TEST_DEVICE_ALIAS_02\"' })'
RESULT=`dfx canister call encrypted_notes_backend $FUNCTION`
compare_result "Check with $FUNCTION" "$EXPECT" "$RESULT" || TEST_STATUS=1

FUNCTION='addNote'
echo -e "\n===== $FUNCTION ====="
EXPECT='()'
RESULT=`dfx canister call encrypted_notes_backend $FUNCTION '("First text!")'`
compare_result "Return none" "$EXPECT" "$RESULT" || TEST_STATUS=1

FUNCTION='getNotes'
echo -e "\n===== $FUNCTION ====="
EXPECT='(vec { record { id = 0 : nat; data = "First text!" } })'
RESULT=`dfx canister call encrypted_notes_backend $FUNCTION`
compare_result "Return note list" "$EXPECT" "$RESULT" || TEST_STATUS=1

FUNCTION='updateNote'
echo -e "\n===== $FUNCTION ====="
EXPECT='()'
RESULT=`dfx canister call encrypted_notes_backend $FUNCTION '(
  record {
    id = 0;
    data = "Updated first text!"
  }
)'`
compare_result "Return none" "$EXPECT" "$RESULT" || TEST_STATUS=1
# 確認
FUNCTION='getNotes'
EXPECT='(vec { record { id = 0 : nat; data = "Updated first text!" } })'
RESULT=`dfx canister call encrypted_notes_backend $FUNCTION`
compare_result "Check with $FUNCTION" "$EXPECT" "$RESULT" || TEST_STATUS=1

FUNCTION='deleteNote'
echo -e "\n===== $FUNCTION ====="
EXPECT='()'
RESULT=`dfx canister call encrypted_notes_backend $FUNCTION '(0)'`
compare_result "Return none" "$EXPECT" "$RESULT" || TEST_STATUS=1
# 確認
FUNCTION='getNotes'
EXPECT='(vec {})'
RESULT=`dfx canister call encrypted_notes_backend $FUNCTION`
compare_result "Check with $FUNCTION" "$EXPECT" "$RESULT" || TEST_STATUS=1
```

テストスクリプトを実行して、`PASS`が表示されていたら確認は完了です。

### インタフェースを定義しよう

新しい関数を定義したので、`encrypted_notes_backend.did`を下記の内容で更新しましょう。

```javascript
type DeviceAlias = text;
type PublicKey = text;
type EncryptedSymmetricKey = text;

type EncryptedNote = record {
  "id" : nat;
  "data" : text;
};

type DeviceError = variant {
  AlreadyRegistered;
  DeviceNotRegistered;
  KeyNotSynchronized;
  UnknownPublicKey;
};

type RegisterKeyResult = variant {
  Ok;
  Err : DeviceError;
};

type SynchronizeKeyResult = variant {
  Ok : EncryptedSymmetricKey;
  Err : DeviceError;
};

service : {
  "deleteDevice" : (DeviceAlias) -> ();
  "getDeviceAliases" : () -> (vec DeviceAlias) query;
  "getEncryptedSymmetricKey" : (PublicKey) -> (SynchronizeKeyResult) query;
  "getUnsyncedPublicKeys" : () -> (vec PublicKey) query;
  "isEncryptedSymmetricKeyRegistered" : () -> (bool) query;
  "registerDevice" : (DeviceAlias, PublicKey) -> ();
  "registerEncryptedSymmetricKey" : (PublicKey, EncryptedSymmetricKey) -> (RegisterKeyResult);
  "uploadEncryptedSymmetricKeys" : (vec record { PublicKey; EncryptedSymmetricKey }) -> (RegisterKeyResult);
  "addNote" : (text) -> ();
  "deleteNote" : (nat) -> ();
  "getNotes" : () -> (vec EncryptedNote) query;
  "updateNote" : (EncryptedNote) -> ();
};
```

お疲れ様です！ 長かったですが、これで対称鍵を同期するための準備ができました。次は、フロントエンドキャニスターで実際に対称鍵の同期処理を行なっていきましょう。

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

次のレッスンに進み、対称鍵を生成しましょう！
