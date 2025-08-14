### 💻 部屋を登録・取得する機能をテストしてみよう

前回までのレッスンで、部屋を登録・取得するスマートコントラクトが作成できました。このレッスンでは、実際に機能しているかターミナル上で確認をしていきます。

テストは以下の2つの方法があります。

1. テスト用の関数を走らせて、思った通りの挙動をするか一気にテストする
2. 実際にデプロイをしてターミナル上から関数を動かして確認する

ここでは、スマートコントラクト内のメソッドがどのように呼び出され、結果が返ってくるのかを実感するために、2. の方法でテストを行いたいと思います。

### 👤 NEAR testnet のアカウントを作成する

デプロイをするには、NEAR testnetのアカウントが必要です。[こちら](https://wallet.testnet.near.org/create)から作成してください。既にお持ちの方は、こちらのステップを飛ばしていただいて構いません。

### ✅ 　デプロイをしてテストする

ここからは、ターミナルで操作をしていきます。コマンドを実行する階層は、`near-hotel-booking-dapp/contract`になります。

まずは、`Rust`で書かれたスマートコントラクトをコンパイルして`Wasm`のファイルを生成します。

以下のコマンドをターミナルで実行しましょう。

```
cargo build --target wasm32-unknown-unknown --release
```

このような出力があると、成功です。

```
    Finished release [optimized] target(s) in 0.83s
```

実際にファイルが生成されているかを確認します。

```
ls ./target/wasm32-unknown-unknown/release | grep hotel_booking.wasm
```

ファイル名が表示されるはずです。

```
hotel_booking.wasm
```

次に、スマートコントラクトのデプロイを行います。ここからは、環境構築時にインストールをした`NEAR CLI`を使ってターミナルから直接NEARネットワークを操作していきます。

まずは、ログインをします。ターミナルで以下のコマンドを実行します。

```
near login
```

今回は、サブアカウントにスマートコントラクトをデプロイしてテストを行いたいと思います。サブアカウントを使用するメリットとしては、スマートコントラクトを更新した際にサブアカウントを簡単に消去・再作成して、ゼロから始めることができるためです。ゼロから始める理由は、後ほど説明します。

サブアカウントを作成します。

```
near create-account ${SUBACCOUNT_ID}.${ACCOUNT_ID} --masterAccount ${ACCOUNT_ID} --initialBalance 5
```

例えば、このように実行します。

```
near create-account contract.hotel_booking.testnet --masterAccount hotel_booking.testnet --initialBalance 5
```

⚠️ 以降では、下記のように実際のアカウントIDを指定してコマンドを実行します。適宜ご自身のアカウントIDに読み替えてください。

- スマートコントラクトをデプロイするサブアカウント : `contract.hotel_booking.testnet`
- 部屋のオーナーアカウント : `hotel_booking.testnet`

サブアカウントにスマートコントラクトをデプロイします。

```
near deploy --wasmFile target/wasm32-unknown-unknown/release/hotel_booking.wasm --accountId contract.hotel_booking.testnet
```

以下のように表示されたらデプロイは成功です！

```
Transaction Id 4QjCzpcZZ3Yj28wqCUEVtbV313duUXMN5nnWXBHM5GC7
To see the transaction in the transaction explorer, please open this url in your browser
https://explorer.testnet.near.org/transactions/4QjCzpcZZ3Yj28wqCUEVtbV313duUXMN5nnWXBHM5GC7
Done deploying to contract.hotel_booking.testnet
```

### 🎓 NEAR CLI でメソッドを呼び出す方法について

`View`メソッドと`Change`メソッドで、引数の指定やオプションの種類が異なります。以下はコマンドの例になります(詳しくは[こちら](https://docs.near.org/tools/near-cli#near-call))

`View`メソッド

```
near view [contractName] [method_name] [{ args ]]
```

`Change`メソッド

```
near call [contractName] [method_name] [{ args }] [--accountId]
```

### 📣 スマートコントラクトのメソッドを呼び出す

では、メソッドを呼び出してみましょう。
まずは、`get_rooms_registered_by_owner`メソッドを呼んでみます。

```
near view contract.hotel_booking.testnet get_rooms_registered_by_owner '{"owner_id": "hotel_booking.testnet"}' --accountId hotel_booking.testnet
```

以下のような出力が返されます。

```
View call: contract.hotel_booking.testnet.get_rooms_registered_by_owner({"owner_id": "hotel_booking.testnet"})
[]
```

オーナーの`hotel_booking.testnet`は部屋を登録していないので`[]`が返ってきます。

次に、`add_room_to_owner`メソッドを呼んで部屋のデータを登録してみます。

💡 このプロジェクトでは、部屋の画像に`URL`を用います。`"image": "URL"`には、お好きな画像のURLを指定してみてください。

```
near call contract.hotel_booking.testnet add_room_to_owner '{"name": "Sun Room", "image": "URL", "beds": 1, "description": "This is Sun room.", "location": "Tokyo", "price": "1000000000000000000000000"}' --accountId hotel_booking.testnet
```

以下のようなものが表示されます。

```
Scheduling a call: contract.hotel_booking.testnet.add_room_to_owner({"name": "Sun Room", "image": "n URL", "beds": 1, "description": "This is Sun room.", "location": "Tokyo", "price": "1000000000000000000000000"})
Doing account.functionCall()
Transaction Id FaBHfU7UZraj8TMc8pbycoADfaoevhB3zQWzT2vb4qT6
To see the transaction in the transaction explorer, please open this url in your browser
https://explorer.testnet.near.org/transactions/FaBHfU7UZraj8TMc8pbycoADfaoevhB3zQWzT2vb4qT6
''
```

再度`get_rooms_registered_by_owner`メソッドを呼んでみます。

```
near view contract.hotel_booking.testnet get_rooms_registered_by_owner '{"owner_id": "hotel_booking.testnet"}' --accountId hotel_booking.testnet
```

以下のようなものが表示されます。

```
View call: contract.hotel_booking.testnet.get_rooms_registered_by_owner({"owner_id": "hotel_booking.testnet"})
[
  {
    name: 'Sun Room',
    image: 'none',
    beds: 1,
    description: 'This is Sun room.',
    location: 'Tokyo',
    price: '1000000000000000000000000',
    status: 'Available'
  }
]
```

登録した部屋のデータが取得できました！

最後に、`exists`メソッドを確認します。

```
near view contract.hotel_booking.testnet exists '{"owner_id": "hotel_booking.testnet", "room_name": "Sun Room"}' --accountId hotel_booking.testnet
```

`true`が返ってきます。

```
View call: contract.hotel_booking.testnet.exists({"owner_id": "hotel_booking.testnet", "room_name": "Sun Room"})
true
```

では、未登録のデータを指定してみます。

```
near view contract.hotel_booking.testnet exists '{"owner_id": "hotel_booking.testnet", "room_name": "Moon Room"}' --accountId hotel_booking.testnet
```

Moon Roomという名前の部屋は登録していないので、`false`が返ってきます。

```
View call: contract.hotel_booking.testnet.exists({"owner_id": "hotel_booking.testnet", "room_name": "Moon Room"})
false
```

ここまでで、`get_rooms_registered_by_owner`メソッド、`add_room_to_owner`メソッド、`exists`メソッドはきちんと機能することが確認できました！

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

おめでとうございます！ セクション1は終了です ✨

`near view contract.hotel_booking.testnet exists '{"owner_id": "hotel_booking.testnet", "room_name": "Sun Room"}' --accountId hotel_booking.testnet`の結果を`#near`に投稿して、あなたの成功をコミュニティで祝いましょう 🎉

次のセクションに進み、スマートコントラクトの機能を拡張しましょう 🚀
