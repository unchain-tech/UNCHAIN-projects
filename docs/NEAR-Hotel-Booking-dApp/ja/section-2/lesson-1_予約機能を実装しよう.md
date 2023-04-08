### 📞 予約機能を実装しよう

ここからは、予約機能を実装していきます。

最終的には、以下の機能が実行できるようにします。

- 宿泊者が宿泊希望日に予約できる、部屋の一覧を表示する。
- 宿泊者が部屋を予約する。
- 宿泊者が予約データを確認できる。
- オーナーが予約の確認・チェックイン・チェックアウトの操作をする。

Lesson1では上記の内、データ取得に関する機能を実装します。

### 📝 必要なデータを定義しよう

まずは、予約機能で使用するデータ・初期化機能を追加していきます。
以下のコードを`lib.rs`に追加してください。

`/contract/src/lib.rs`

```diff
pub struct ResigteredRoom {
    ...
}

+ // 予約が入った部屋一覧を表示する際に使用
+ #[derive(BorshDeserialize, BorshSerialize, Deserialize, Serialize, Debug)]
+ #[serde(crate = "near_sdk::serde")]
+ pub struct BookedRoom {
+     room_id: RoomId,
+     name: String,
+     check_in_date: CheckInDate,
+     guest_id: AccountId,
+     status: UsageStatus,
+ }
+ 
+ // 宿泊者が予約を確認する際に使用
+ #[derive(Serialize, Deserialize, Debug, BorshSerialize, BorshDeserialize)]
+ #[serde(crate = "near_sdk::serde")]
+ pub struct GuestBookedRoom {
+     owner_id: AccountId,
+     name: String,
+     check_in_date: CheckInDate,
+ }
+ 
+ // 予約できる部屋一覧を表示する際に使用
+ #[derive(BorshDeserialize, BorshSerialize, Deserialize, Serialize, PartialEq, Debug)]
+ #[serde(crate = "near_sdk::serde")]
+ pub struct AvailableRoom {
+     room_id: RoomId,
+     owner_id: AccountId,
+     name: String,
+     image: String,
+     beds: u8,
+     description: String,
+     location: String,
+     price: U128,
+ }

pub struct Room {
    ...
}

#[near_bindgen]
#[derive(BorshSerialize, BorshDeserialize)]
pub struct Contract {
    // オーナーと所有する部屋のIDを紐付けて保持
    rooms_per_owner: LookupMap<AccountId, Vec<RoomId>>,

    // 部屋のIDと部屋のデータを紐付けて保持
    rooms_by_id: HashMap<RoomId, Room>,

+     // 宿泊者のアカウントIDと予約データを紐付けて保持
+     bookings_per_guest: HashMap<AccountId, HashMap<CheckInDate, RoomId>>,
}

impl Default for Contract {
    fn default() -> Self {
        Self {
            rooms_per_owner: LookupMap::new(b"m"),
            rooms_by_id: HashMap::new(),
+             bookings_per_guest: HashMap::new(),
        }
    }
}
```

追加した内容を見ていきましょう。

最初に3つの構造体を定義しました。

- `BookedRoom`構造体 : 予約が入った部屋の一覧を、オーナーが確認する画面で使用されます。
- `GuestBookedRoom`構造体 : 宿泊者が予約を確認する際に使用されます。
- `AvailableRoom`構造体 : 宿泊希望日に予約できる部屋の一覧を、表示する際に使用されます。

次に、`Contract`構造体の中に`bookings_per_guest`というデータを追加しました。これは、宿泊者の予約データをブロック
チェーン上に保存する際に使用されます。

```rust
// 宿泊者のアカウントIDと予約データを紐付けて保持
    bookings_per_guest: HashMap<AccountId, HashMap<CheckInDate, RoomId>>,
```

最後に、`default()`の中に初期化する処理を追加しました。これで、予約機能で使用するデータ・初期化機能が定義できました。

次に、データを取得するメソッドを実装します。
以下のコードを`get_rooms_registered_by_owner`メソッドの下に追加しましょう。`impl Contract {}`の中に追加するよう注意してください。

`/contract/src/lib.rs`

```diff
    pub fn get_rooms_registered_by_owner(&self, owner_id: AccountId) -> Vec<ResigteredRoom> {
    ...
    }

+     // 予約一覧を取得する
+     pub fn get_booking_info_for_owner(&self, owner_id: AccountId) -> Vec<BookedRoom> {
+         let mut booked_rooms = vec![];
+ 
+         match self.rooms_per_owner.get(&owner_id) {
+             Some(rooms) => {
+                 for room_id in rooms.iter() {
+                     let room = self.rooms_by_id.get(room_id).expect("ERR_NOT_FOUND_ROOM");
+                     // 予約がなければ何もしない
+                     if room.booked_info.is_empty() {
+                         continue;
+                     }
+                     // 予約された日付ごとに予約データを作成
+                     for (date, guest_id) in room.booked_info.clone() {
+                         // UsageStatusを複製
+                         let status: UsageStatus;
+                         match &room.status {
+                             UsageStatus::Available => {
+                                 status = UsageStatus::Available;
+                             }
+                             UsageStatus::Stay { check_in_date } => {
+                                 if date == check_in_date.clone() {
+                                     status = UsageStatus::Stay {
+                                         check_in_date: check_in_date.clone(),
+                                     };
+                                 } else {
+                                     status = UsageStatus::Available;
+                                 }
+                             }
+                         }
+                         let booked_room = BookedRoom {
+                             room_id: room_id.to_string(),
+                             name: room.name.clone(),
+                             check_in_date: date,
+                             guest_id,
+                             status,
+                         };
+                         booked_rooms.push(booked_room);
+                     }
+                 }
+                 booked_rooms
+             }
+             // 部屋を登録していない場合は空が返る
+             None => booked_rooms,
+         }
+     }
+ 
+     // 宿泊者に表示する予約データを取得
+     pub fn get_booking_info_for_guest(&self, guest_id: AccountId) -> Vec<GuestBookedRoom> {
+         let mut guest_info: Vec<GuestBookedRoom> = vec![];
+         match self.bookings_per_guest.get(&guest_id) {
+             Some(save_booked_info) => {
+                 for (check_in_date, room_id) in save_booked_info {
+                     let room = self.rooms_by_id.get(room_id).expect("ERR_NOT_FOUND_ROOM");
+                     let info = GuestBookedRoom {
+                         owner_id: room.owner_id.clone(),
+                         name: room.name.clone(),
+                         check_in_date: check_in_date.clone(),
+                     };
+                     guest_info.push(info);
+                 }
+                 guest_info
+             }
+             // 部屋を登録していない場合は空が返る
+             None => guest_info,
+         }
+     }
+ 
+     // 宿泊希望日に予約できる部屋一覧を取得する
+     pub fn get_available_rooms(&self, check_in_date: CheckInDate) -> Vec<AvailableRoom> {
+         let mut available_rooms = vec![];
+ 
+         for (room_id, room) in self.rooms_by_id.iter() {
+             match room.booked_info.get(&check_in_date) {
+                 // 宿泊希望日に既に予約が入っていたら何もしない
+                 Some(_) => {
+                     continue;
+                 }
+                 // 予約が入っていなかったら、部屋のデータを作成
+                 None => {
+                     let available_room = AvailableRoom {
+                         room_id: room_id.clone(),
+                         owner_id: room.owner_id.clone(),
+                         name: room.name.clone(),
+                         beds: room.beds,
+                         image: room.image.clone(),
+                         description: room.description.clone(),
+                         location: room.location.clone(),
+                         price: room.price,
+                     };
+                     available_rooms.push(available_room);
+                 }
+             }
+         }
+         available_rooms
+     }
```

追加した内容を見ていきましょう。

`get_booking_info_for_owner`メソッドは、オーナーが予約データ一覧を取得するために呼び出されます。
前回のセクションで実装した、`get_rooms_registered_by_owner`メソッドと基本的な仕組みは一緒ですが、予約データごとにデータを作成する点が異なります。
`rooms_by_id`から`get()`で取得した部屋が持つ`booked_info`変数は、要素が存在しないかどうかを`is_empty()`で確認します。要素が0であれば予約データが存在しないので、以降の処理をスキップしループ処理の先頭へ戻ります。

```rust
                    let room = self.rooms_by_id.get(room_id).expect("ERR_NOT_FOUND_ROOM");
                    // 予約がなければ何もしない
                    if room.booked_info.is_empty() {
                        continue;
                    }
                    // 予約された日付ごとに予約データを作成
                    for (date, guest_id) in room.booked_info.clone() {
```

次の`get_booking_info_for_guest`メソッドは、宿泊者が自身の予約データ一覧を取得するために呼び出されます。

`bookings_per_guest`からアカウントIDに紐づく宿泊データを`get()`で取得します。得られたデータは`HashMap`で、[`CheckInDate`, `RoomId`]がペアで保存されています。

```rust
        match self.bookings_per_guest.get(&guest_id) {
```

予約データが存在する場合、予約データごとにデータを作成します。`GuestBookedRoom`構造体を作成する際に、部屋のオーナーと名前が必要なので、`RoomId`を使って`rooms_by_id.get(room_id)`で取得します。

```rust
            Some(save_booked_info) => {
                for (check_in_date, room_id) in save_booked_info {
                    let room = self.rooms_by_id.get(room_id).expect("ERR_NOT_FOUND_ROOM");
                    let info = GuestBookedRoom {
                        owner_id: room.owner_id.clone(),
                        name: room.name.clone(),
                        check_in_date: check_in_date.clone(),
                    };
                    guest_info.push(info);
                }
                guest_info
            }
```

`get_available_rooms`メソッドは、 宿泊希望日が入力された際その日に予約ができる部屋の一覧を返すために呼び出されます。

引数で渡された日付と、保存されている部屋の予約データを比較します。

```rust
        for (room_id, room) in self.rooms_by_id.iter() {
            match room.booked_info.get(&check_in_date) {
                ...
            }
        }
```

`get()`でデータが取得できれば`Some`に、取得できなければ`None`の処理が実行されます。予約データが存在しなければ、`AvailableRoom`構造体を作成して、返すVectorに追加します。

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

次のレッスンに進み、宿泊者が部屋を予約する・オーナーがチェックイン・チェックアウトの操作をするための実装を追加していきましょう！
