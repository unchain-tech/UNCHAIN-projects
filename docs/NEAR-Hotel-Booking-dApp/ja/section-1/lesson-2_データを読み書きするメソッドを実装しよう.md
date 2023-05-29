### 📝 データを読み書きするメソッドを実装しよう

前回のレッスンでは、部屋を登録・取得するためのデータを定義しました。

ここからは、データの初期化、オーナーが部屋を登録・取得するための機能を実装していきます！

まずは、前回のレッスンで最後に追加した`Contract`構造体の下に、以下のコードを追加しましょう。

`/contract/src/lib.rs`

```diff
#[near_bindgen]
#[derive(BorshSerialize, BorshDeserialize)]
pub struct Contract {
    rooms_per_owner: LookupMap<AccountId, Vec<RoomId>>,
    rooms_by_id: HashMap<RoomId, Room>,
}

+ impl Default for Contract {
+     fn default() -> Self {
+         Self {
+             rooms_per_owner: LookupMap::new(b"m"),
+             rooms_by_id: HashMap::new(),
+         }
+     }
+ }
```

追加した内容を見ていきましょう。

`impl`というキーワードを使用しています。これはimplementのことで、以下は「Contract型にDefaultというトレイトを実装します」という意味になります。

```rust
impl Default for Contract
```

関数の中では、`rooms_per_owner`と`rooms_by_id`のインスタンスを`new()`で生成しています。

`LookupMap`は`new()`に`b"m"`を引数に渡します。これは、`new()`が`LookupMap`のインスタンスを生成する際に、キーの一意なプレフィックスを設置するためです。`b"..."`は、バイト文字列リテラルを生成する`Rust`のキーワードです。

```rust
impl Default for Contract {
    fn default() -> Self {
        Self {
            rooms_per_owner: LookupMap::new(b"m"),
            rooms_by_id: HashMap::new(),
        }
    }
}
```

これで、スマートコントラクトを初期化する機能が実装できました！

次は、部屋のデータを受け取り保存をする機能を追加します。
以下のコードを追加してください。
`/contract/src/lib.rs`

```diff
impl Default for Contract {
    fn default() -> Self {
        Self {
            rooms_per_owner: LookupMap::new(b"m"),
            rooms_by_id: HashMap::new(),
        }
    }
}

+ #[near_bindgen]
+ impl Contract {
+     pub fn add_room_to_owner(
+         &mut self,
+         name: String,
+         image: String,
+         beds: u8,
+         description: String,
+         location: String,
+         price: U128,
+     ) {
+         // 関数をコールしたアカウントIDを取得
+         let owner_id = env::signer_account_id();
+ 
+         // 部屋のIDをオーナーのアカウントIDと部屋の名前で生成
+         let room_id = format!("{}{}", owner_id, name);
+ 
+         // Room構造体を、データを入れて生成
+         let new_room = Room {
+             owner_id: owner_id.clone(),
+             name,
+             image,
+             beds,
+             description,
+             location,
+             price,
+             status: UsageStatus::Available,
+             booked_info: HashMap::new(),
+         };
+ 
+         // 部屋のデータを`RoomId`と紐付けて保存
+         self.rooms_by_id.insert(room_id.clone(), new_room);
+ 
+         // オーナーのアカウントIDと`RoomId`のVectorを紐付けて保存
+         match self.rooms_per_owner.get(&owner_id) {
+             // オーナーが既に別の部屋を登録済みの時
+             Some(mut rooms) => {
+                 rooms.push(room_id);
+                 self.rooms_per_owner.insert(&owner_id, &rooms);
+             }
+             // オーナーが初めて部屋を登録する時
+             None => {
+                 // `room_id`を初期値にVectorを生成する
+                 let new_rooms = vec![room_id];
+                 self.rooms_per_owner.insert(&owner_id, &new_rooms);
+             }
+         }
+     }
+ }
```

追加した内容を見ていきましょう。

`impl`キーワードが再度登場しました。以下は、`Contract`構造体に`{}`内のメソッドを持たせるよ、ということを意味しています。

```rust
impl Contract {

}
```

追加したメソッドを確認します。

```rust
pub fn add_room_to_owner(
    &mut self,
    name: String,
    image: String,
    beds: u8,
    description: String,
    location: String,
    price: U128,
) {
```

`add_room_to_owner`メソッドは、部屋のデータを受け取り、そのデータを保存します。このメソッドは戻り値がありません。

メソッドの中を確認します。まずは受け取ったデータをもとに3つの変数を生成します。

```rust
// 関数をコールしたアカウントIDを取得
let owner_id = env::signer_account_id();

// 部屋のIDをオーナーのアカウントIDと部屋の名前で生成
let room_id = format!("{}{}", owner_id, name);

// Room構造体を、データを入れて生成
let new_room = Room {
    owner_id: owner_id.clone(),
    name,
    image,
    beds,
    description,
    location,
    price,
    status: UsageStatus::Available,
    booked_info: HashMap::new(),
};
```

1. `owner_id` : 部屋のオーナーのID。
   - `env`はスマートコントラクトで利用可能なライブラリです。ここでは`env`が実装する`signer_account_id()`というメソッドを使用して、関数を呼び出したアカウントIDを取得しています。
2. `room_id` : 各部屋に割り当てる一意なID。
   - `owner_id`と`name`を繋げたデータをIDとします(例: `owner.testnet101`)
3. `new_room` : データをひとまとめに持つ`Room`構造体。

次に、生成した変数を`Contract`構造体が持つ2つのデータ構造に保存します。どちらもマップなので、`insert()`というメソッドで[key, value]をセットにして保存します。

```rust
// 部屋のデータを`RoomId`と紐付けて保存
self.rooms_by_id.insert(room_id.clone(), new_room);

// オーナーのアカウントIDと`RoomId`のVectorを紐付けて保存
match self.rooms_per_owner.get(&owner_id) {
    // オーナーが既に別の部屋を登録済みの時
    Some(mut rooms) => {
        rooms.push(room_id);
        self.rooms_per_owner.insert(&owner_id, &rooms);
    }
    // オーナーが初めて部屋を登録する時
    None => {
        // `room_id`を初期値にVectorを生成する
        let new_rooms = vec![room_id];
        self.rooms_per_owner.insert(&owner_id, &new_rooms);
    }
}
```

どちらも行っていることは同じなのですが、`rooms_per_owner`は処理が多いですね。こちらはマップのvalueにVectorを使用していたことを思い出してください。一人のオーナーが複数の部屋を登録することを想定しています。

`insert()`で保存する前に、`match`という[制御フロー演算子](https://doc.rust-jp.rs/book-ja/ch06-02-match.html)を使用してオーナーが既に他の部屋を登録しているか、初めて登録するかに応じて処理を分けています。`get()`は、引数にkeyを渡すと、対応するvalueを返す関数です。(厳密には、`Option`型というものを返します。([Option 型とは](https://qiita.com/take4s5i/items/c890fa66db3f71f41ce7)))

- 別の部屋を登録済み → Some → 保存されているVectorに新しく要素（RoomId）を`push()`で追加する。 → `insert()`でマップに保存する。
- 初めて登録 → None → Vectorのインスタンスを、 `RoomId`を要素に生成する → `insert()`でマップに保存する。

今回追加した`add_room_to_owner`メソッドが、ブロックチェーン上にデータを書き込むメソッドです。

先ほど追加したメソッドでは、部屋に一意なIDをつけていました。このプロジェクトでは、一人のオーナーが同じ名前の部屋を重複して登録することは想定しません。そこで、部屋の名前を事前にチェックするメソッドを追加します。

以下のコードを、`add_room_to_owner`メソッドの下に追加してください。

`/contract/src/lib.rs`

```diff
impl Contract {
    pub fn add_room_to_owner(
    {
        ...
    }

+     // `room_id`が既に存在するかを確認する
+     // 同じ部屋名を複数所有することは想定しないため、`add_room_to_owner`を実行する前にコールされる
+     pub fn exists(&self, owner_id: AccountId, room_name: String) -> bool {
+         let room_id = format!("{}{}", owner_id, room_name);
+ 
+         self.rooms_by_id.contains_key(&room_id)
+     }
}
```

追加した内容を見ていきます。
`exists`メソッドは、オーナーのアカウントIDと部屋の名前を引数にとり、既に登録された部屋の名前でないかチェックをします。`contains_key()`は、引数にマップのkeyを受け取ります。そして、そのkeyに紐づくデータが保存されていたら`true`を、なければ`false`を返すメソッドです。これを使用して確認をします。なお、`exists`メソッドは、`add_room_to_owner`メソッドを呼び出す前に実行し、重複を防ぎます。

最後は、保存された部屋のデータを取得する機能を追加します。
以下のコードを追加してください。

`/contract/src/lib.rs`

```diff
// `room_id`が既に存在するかを確認する
// 同じ部屋名を複数所有することは想定しないため、`add_room_to_owner`を実行する前にコールされる
pub fn exists(&self, owner_id: AccountId, room_name: String) -> bool {
    let room_id = format!("{}{}", owner_id, room_name);
    self.rooms_by_id.contains_key(&room_id)
}

+ pub fn get_rooms_registered_by_owner(&self, owner_id: AccountId) -> Vec<RegisteredRoom> {
+     // 空のVectorを生成する
+     let mut registered_rooms = vec![];
+ 
+     match self.rooms_per_owner.get(&owner_id) {
+         // オーナーが部屋のデータを保存していた時
+         Some(rooms) => {
+             // 保存されている全ての部屋のデータに対し、一つずつ処理を行う
+             for room_id in rooms {
+                 // `room_id`をkeyとして、マップされている`Room`構造体のデータを取得
+                 let room = self.rooms_by_id.get(&room_id).expect("ERR_NOT_FOUND_ROOM");
+ 
+                 // 部屋のステータスを複製する
+                 let status: UsageStatus = match room.status {
+                     // ステータスが`Available`の時
+                     UsageStatus::Available => UsageStatus::Available,
+                     // ステータスが`Stay`の時
+                     UsageStatus::Stay { ref check_in_date } => UsageStatus::Stay {
+                         check_in_date: check_in_date.clone(),
+                     },
+                　};
+ 
+                 // 取得した部屋のデータをもとに、`RegisteredRoom`構造体を生成
+                 let registered_room = RegisteredRoom {
+                     name: room.name.clone(),
+                     beds: room.beds,
+                     image: room.image.clone(),
+                     description: room.description.clone(),
+                     location: room.location.clone(),
+                     price: room.price,
+                     status: room_status,
+                 };
+                 // Vectorに追加
+                 registered_rooms.push(registered_room);
+             }
+             registered_rooms
+         }
+         // 部屋のデータが存在しない時
+         None => registered_rooms,
+     }
+ }
```

追加した内容を見ていきましょう。

```rust
pub fn get_rooms_registered_by_owner(&self, owner_id: AccountId) -> Vec<RegisteredRoom> {
```

`get_rooms_registered_by_owner`メソッドは、オーナーのアカウントIDを受け取り、そのアカウントIDに紐づいて保存されている部屋のデータをVectorで返します。

前に追加した`add_room_to_owner`メソッドは、`env::signer_account_id()`でオーナーのアカウントIDを取得していましたが、今回は引数で渡されます。
前回のレッスンで、`View`メソッドは実行するアカウントの指定が必要ないと説明しました。そのため、`env::signer_account_id`が存在しないのです。

メソッドの中を確認します。まずは戻り値となるVectorを空で生成します。

```rust
        // 空のVectorを生成する
        let mut registered_rooms = vec![];
```

次に、`match`制御フロー演算子を使用してオーナーが部屋を登録しているかどうかに応じて処理を分けます。

```rust
        match self.rooms_per_owner.get(&owner_id) {
```

部屋が登録されていたら`Some`に入り、部屋を1つずつ処理していきます。

```rust
            // オーナーが部屋のデータを保存していた時
            Some(rooms) => {
                // 保存されている全ての部屋のデータに対し、一つずつ処理を行う
                for room_id in rooms {
                    // `room_id`をkeyとして、マップされている`Room`構造体のデータを取得
                    let room = self.rooms_by_id.get(&room_id).expect("ERR_NOT_FOUND_ROOM");
```

`rooms_by_id`からデータを取得する際`get()`を使用していますが、戻り値は`match`文で処理をしていません。ここでは、`expect()`というメソッドを使っています。`get()`で値が取得できなかった時に、引数として渡された文字列をエラーメッセージに追加して
プログラムを終了させます。`room_id`で紐づく部屋のデータを取得できることが前提のため、もし取得できなかった場合には、予期せぬエラーとして処理をします。

次に、取得した部屋のデータをもとにステータスを複製します。

```rust
                    // 部屋のステータスを複製する
                    let status: UsageStatus = match room.status {
                        // ステータスが`Available`の時
                        UsageStatus::Available => UsageStatus::Available,
                        // ステータスが`Stay`の時
                        UsageStatus::Stay { ref check_in_date } => UsageStatus::Stay {
                            check_in_date: check_in_date.clone(),
                        },
                    };
```

続いて、`RegisteredRoom`構造体を生成します。生成したデータは、`push()`で戻り値となるVectorに追加します。

```rust
                    // 取得した部屋のデータをもとに、`RegisteredRoom`構造体を生成
                    let registered_room = RegisteredRoom {
                        name: room.name.clone(),
                        beds: room.beds,
                        image: room.image.clone(),
                        description: room.description.clone(),
                        location: room.location.clone(),
                        price: room.price,
                        status: room_status,
                    };
                    // Vectorに追加
                    registered_rooms.push(registered_room);
                }
                registered_rooms
            }
```

Someスコープの最後に、`registered_rooms`がコードされています。`Rust`では`return`というキーワードが必要なく、`;`をつけていない部分を戻り値と解釈します。

最後に、オーナーが部屋のデータを登録していない時は空のVectorが返ります。

```rust
            // 部屋のデータが存在しない時
            None => registered_rooms,
        }
    }
```

これで、データを読み書きするメソッドが実装できました！

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

次のレッスンに進み、スマートコントラクトをデプロイして実際にデータの読み書きをしてみましょう！
