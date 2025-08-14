### 🖋 予約機能を完成させよう

このレッスンでは、予約機能を完成させるために`Change`メソッドを追加していきます。

まずは、宿泊者が部屋を予約するためのメソッドを実装していきます。

以下のコードを追加しましょう。`exists`メソッドの下に追加すると良いでしょう。

`/contract/src/lib.rs`

```diff
    pub fn exists(&self, owner_id: AccountId, room_name: String) -> bool {
        ...
    }

+     // 部屋を予約する
+     #[payable]
+     pub fn book_room(&mut self, room_id: RoomId, check_in_date: CheckInDate) {
+         let room = self
+             .rooms_by_id
+             .get_mut(&room_id)
+             .expect("ERR_NOT_FOUND_ROOM");
+ 
+         let account_id = env::signer_account_id();
+ 
+         // 関数コール時に送付されたNEARを取得
+         let deposit = env::attached_deposit();
+         // 送付されたNEARと実際の宿泊料（NEAR）を比較するためにキャストをする
+         let room_price: u128 = room.price.into();
+         assert_eq!(deposit, room_price, "ERR_DEPOSIT_IS_INCORRECT");
+ 
+         // 予約が入った日付, 宿泊者IDを登録
+         room.booked_info
+             .insert(check_in_date.clone(), account_id.clone());
+ 
+         // 宿泊者に予約データを保存
+         let owner_id = room.owner_id.clone();
+         self.add_booking_to_guest(account_id, room_id, check_in_date);
+ 
+         // 宿泊料を部屋のオーナーへ支払う
+         Promise::new(owner_id).transfer(deposit);
+     }

    pub fn get_rooms_registered_by_owner(&self, owner_id: AccountId) -> Vec<ResigteredRoom> {
    ...
    }
```

追加した内容を見ていきましょう。

`book_room`メソッドでは、宿泊データを保存し実際に宿泊料をオーナーへ送信します。このメソッドには、`#[payable]`アノテーションが指定されています。これをメソッドに指定することで、呼び出しとトークンの転送ができるようになります。

まずは、予約される部屋のデータを取得します。ここで、データの取得に`get_mut()`を使用していることに注目してください。`mut`は`mutable`の意味で、変更可能な`room`が取得できます。予約データを追加し、`room`を更新したいので可変のデータが取得できる`get_mut()`を使います。

```rust
        let room = self
            .rooms_by_id
            .get_mut(&room_id)
            .expect("ERR_NOT_FOUND_ROOM");
```

`env::attached_deposit()`メソッドで、宿泊者が支払うNEARを取得します。

```rust
        // 関数コール時に送付されたNEARを取得
        let deposit = env::attached_deposit();
        // 送付されたNEARと実際の宿泊料（NEAR）を比較するためにキャストをする
        let room_price: u128 = room.price.into();
        assert_eq!(deposit, room_price, "ERR_DEPOSIT_IS_INCORRECT");
```

取得した`deposit`の型は[`U128`](https://www.near-sdk.io/contract-interface/serialization-interface#json-wrapper-types)です。`deposit`がオーナーの掲載する宿泊料と等しいか比較をするために、`u128`に型変換をしています。変換には`into()`メソッドを使用しています。
`assert_eq!()`メソッドで比較をし、もし等しくなければエラーとなります。

次に、予約データをブロックチェーン上へ保存します。中で呼んでいる`add_booking_to_guest`メソッドは、後ほど実装します。

```rust
        // 予約が入った日付, 宿泊者IDを登録
        room.booked_info
            .insert(check_in_date.clone(), account_id.clone());

        // 宿泊者に予約データを保存
        let owner_id = room.owner_id.clone();
        self.add_booking_to_guest(account_id, room_id, check_in_date);
```

最後に、宿泊料をオーナーへ支払います。`transfer()`メソッドは、引数に受け取ったトークンを`Promise`が動作するアカウントに転送します。`Promise`は、オーナーのアカウントIDを指定して作成されていることに注目してください。ここでは、「`Promise`が動作するアカウント」が部屋を登録したオーナーとなります。よって、部屋のオーナーにトークンが転送されます。

```rust
        // 宿泊料を部屋のオーナーへ支払う
        Promise::new(owner_id).transfer(deposit);
```

次に、オーナーがチェックイン・チェックアウトの操作をするためのメソッドを実装します。各操作の定義は、以下とします。

- チェックイン : 部屋の利用状況を`Stay`にする。
- チェックアウト : 部屋の利用状況を`Available`に戻し、対象の予約データを削除する。

それでは、以下のコードを追加しましょう。

`/contract/src/lib.rs`

```diff
    pub fn exists(&self, owner_id: AccountId, room_name: String) -> bool {
        ...
    }

    // 部屋を予約する
    #[payable]
    pub fn book_room(&mut self, room_id: RoomId, check_in_date: CheckInDate) {
        let room = self
            .rooms_by_id
            .get_mut(&room_id)
            .expect("ERR_NOT_FOUND_ROOM");

        let account_id = env::signer_account_id();

        // 関数コール時に送付されたNEARを取得
        let deposit = env::attached_deposit();
        // 送付されたNEARと実際の宿泊料（NEAR）を比較するためにキャストをする
        let room_price: u128 = room.price.into();
        assert_eq!(deposit, room_price, "ERR_DEPOSIT_IS_INCORRECT");

        // 予約が入った日付, 宿泊者IDを登録
        room.booked_info
            .insert(check_in_date.clone(), account_id.clone());

        // 宿泊者に予約データを保存
        let owner_id = room.owner_id.clone();
        self.add_booking_to_guest(account_id, room_id, check_in_date);

        // 宿泊料を部屋のオーナーへ支払う
        Promise::new(owner_id).transfer(deposit);
    }
 
+     // 部屋の利用状況を`Stay -> Available`に変更する
+     pub fn change_status_to_available(
+         &mut self,
+         room_id: RoomId,
+         check_in_date: CheckInDate,
+         guest_id: AccountId,
+     ) {
+         let mut room = self
+             .rooms_by_id
+             .get_mut(&room_id)
+             .expect("ERR_NOT_FOUND_ROOM");
+ 
+         // 部屋が持つ予約データの削除
+         room.booked_info
+             .remove(&check_in_date)
+             .expect("ERR_NOT_FOUND_DATE");
+ 
+          // 利用状況を`Available`に変更
+         room.status = UsageStatus::Available;
+ 
+         // 宿泊者が持つ予約データを削除
+         self.remove_booking_from_guest(guest_id, check_in_date);
+     }
+ 
+     // 部屋の利用状況を`Available -> Stay` に変更する
+     pub fn change_status_to_stay(&mut self, room_id: RoomId, check_in_date: CheckInDate) {
+         let mut room = self
+             .rooms_by_id
+             .get_mut(&room_id)
+             .expect("ERR_NOT_FOUND_ROOM");
+ 
+          // 利用状況を`Stay`に変更
+         room.status = UsageStatus::Stay { check_in_date };
+     }
+ 
+     // changeメソッドの`change_status_to_stay`を実行する前に、部屋の利用状況を確認する
+     pub fn is_available(&self, room_id: RoomId) -> bool {
+         let room = self.rooms_by_id.get(&room_id).expect("ERR_NOT_FOUND_ROOM");
+ 
+         if room.status != UsageStatus::Available {
+             // 利用状況が既に`Stay`の時
+             return false;
+         }
+         // 利用状況が`Available`の時
+         true
+     }

    pub fn get_rooms_registered_by_owner(&self, owner_id: AccountId) -> Vec<ResigteredRoom> {
    ...
    }
```

追加した内容を見ていきましょう。

オーナーが部屋の利用状況を変更できる機能を追加しました。これらは、Webアプリケーション上でオーナーがボタンを操作することにより実現されます。

`change_status_to_available`メソッドは、オーナーが**Check Out**ボタンを押した際に、部屋の利用状況を`Stay` → `Available`に変更します。
利用状況を変更したい部屋のIDが引数として渡されるので、データからIDに紐づく部屋を取得します。次に、取得した部屋の`status`を変更します。これは、宿泊者がチェックアウトをしたことを意味するので、予約データから`remove()`というメソッドを使用して`check_in_date`を削除します。

```rust
        // 部屋が持つ予約データの削除
        room.booked_info
            .remove(&check_in_date)
            .expect("ERR_NOT_FOUND_DATE");

        // 利用状況を`Available`に変更
        room.status = UsageStatus::Available;
```

最後に、宿泊者の予約データを削除します。この操作は、`Contract`構造体が持つ`bookings_per_guest`データに対して行われます。`remove_booking_from_guest`メソッドは後ほど追加します。

```rust
        // 宿泊者が持つ予約データを削除
        self.remove_booking_from_guest(guest_id, check_in_date);
```

`change_status_to_stay`メソッドは、オーナーが**Check In**ボタンを押した際に、部屋の利用状況を`Available` → `Stay`に変更します。IDから部屋を取得する部分は、`change_status_to_available`メソッドと同じです。違いは、以下の部分です。

```rust
         // 利用状況を`Stay`に変更
        room.status = UsageStatus::Stay { check_in_date };
```

`status`を変更する際に、どの宿泊データ（宿泊日）が使用されているのかを周知するために、`check_in_date`を保存します。

`is_available`メソッドは、オーナーが誤って**Check In**ボタンを押してしまわないように確認をするためのものです。フロントエンドを実装する際に、`change_status_to_stay`メソッドを呼び出す前にこのメソッドを使用します。
確認したい部屋のIDが引数として渡されるので、IDに紐づく部屋を取得して`status`を確認します。

```rust
        if room.status != UsageStatus::Available {
            // 利用状況が既に`Stay`の時
            return false;
        }
        // 利用状況が`Available`の時
        true
```

戻り値は`bool`型で、`Stay`なら`false`を、`Available`なら`true`を返します。

では最後に、不足していたメソッドを実装しましょう。ここで追加するメソッドは、

```rust
#[near_bindgen]
impl Contract {
    ...
}
```

このスコープの外に定義します。
定義する場所に注意して、以下のコードを追加しましょう。
`/contract/src/lib.rs`

```diff
#[near_bindgen]
impl Contract {
    ...
}

+ // Private functions
+ impl Contract {
+     // 予約データを宿泊者用に保存する
+     fn add_booking_to_guest(
+         &mut self,
+         guest_id: AccountId,
+         room_id: RoomId,
+         check_in_date: CheckInDate,
+     ) {
+         match self.bookings_per_guest.get_mut(&guest_id) {
+             // 宿泊者が既に別の予約データを所有している時
+             Some(booked_date) => {
+                 booked_date.insert(check_in_date, room_id);
+             }
+             // 初めて予約データを保存する時
+             None => {
+                 let mut new_guest_date = HashMap::new();
+                 new_guest_date.insert(check_in_date, room_id);
+                 self.bookings_per_guest.insert(guest_id, new_guest_date);
+             }
+         }
+     }
+ 
+     // 宿泊者の持つ予約データから、宿泊済みのデータを削除する
+     fn remove_booking_from_guest(&mut self, guest_id: AccountId, check_in_date: CheckInDate) {
+         // 宿泊者が持っている予約データのmapを取得
+         let book_info = self
+             .bookings_per_guest
+             .get_mut(&guest_id)
+             .expect("ERR_NOT_FOUND_GUEST");
+ 
+         book_info
+             .remove(&check_in_date)
+             .expect("ERR_NOT_FOUND_BOOKED");
+ 
+         // 予約データが空になった場合、`bookings_per_guest`からゲストを削除する
+         if book_info.is_empty() {
+             self.bookings_per_guest.remove(&guest_id);
+         }
+     }
+ }
```

追加した内容を見ていきましょう。

`add_booking_to_guest`メソッドは、宿泊者が予約をした際に宿泊データを登録するためのものです。これは、`book_room`メソッド内で呼ばれます。中で行っていることは、`add_room_to_owner`と一緒で、`match`文を使用して既に宿泊データが保存されているか、初めて保存されるのかに応じて処理を分けています。

`remove_booking_from_guest`メソッドは、引数で削除したい宿泊データの日付`check_in_date`が渡されます。このデータを`Contract`構造体が所有する`bookings_per_guest`から削除します。これは、`change_status_to_available`メソッド内で呼ばれます。

2つのメソッドには、`fn`キーワードの前に`pub`キーワードがありません。これは、`lib.rs`内部でのみ呼ばれる([プライベート](https://doc.rust-jp.rs/rust-by-example-ja/mod/visibility.html))メソッドであるためです。

```rust
    fn add_booking_to_guest(
```

```rust
    fn remove_booking_from_guest(&mut self, guest_id: AccountId, check_in_date: CheckInDate) {
```

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

長かったですが、これでスマートコントラクトの予約機能が完成しました！

次のレッスンに進み、予約機能をテストしてみましょう！
