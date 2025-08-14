### 💻 NEAR testnet で動作確認をしてみよう

完成したスマートコントラクトをNEAR testnetにデプロイをして、動作確認をしたいと思います。
`NEAR CLI`を使って、ターミナルからメソッドを呼び出してみましょう！

まずは、スマートコントラクトを再度コンパイルして`Wasm`のファイルを更新します。

以下のコマンドをターミナルで実行しましょう。

```
cargo build --target wasm32-unknown-unknown --release
```

次に、前回のテストで使用したサブアカウントにデプロイを行いたいのですが、ここでサブアカウントを作り直すという作業を挟みます。

### 👥 サブアカウントを作り直す

作り直す理由としては、予期せぬエラーを防ぐためです。
そのままデプロイをして、何かしらのメソッドを呼び出した際におそらく以下のようなパニックエラーが起こるでしょう。

```
Cannot deserialize the contract state.
```

詳しい説明は[こちら](https://docs.near.org/sdk/rust/building/prototyping#2-deleting--recreating-contract-account)を確認してください。予期せぬエラーに何時間も時間を割くよりも一度デプロイするアカウントをリセットする方が良いこともあります。

ここで、開発中はデプロイするアカウントにサブアカウントを採用するメリットがあります。ターミナルから簡単に削除・再作成ができるためです！

では、以下のコマンドを実行し、サブアカウントを削除します。この時、サブアカウントに残っているトークンは全て`${ACCOUNT_ID}`に戻ります。

```
near delete ${SUBACCOUNT_ID}.${ACCOUNT_ID} ${ACCOUNT_ID}
```

以下のコマンドを実行し、サブアカウントを再作成します。これで、更新されたスマートコントラクトを安心してデプロイできます！

```
near create-account ${SUBACCOUNT_ID}.${ACCOUNT_ID} --masterAccount ${ACCOUNT_ID} --initialBalance 5
```

### ✅ 　デプロイをしてテストする

では、デプロイをしてメソッドを呼び出してみましょう。
まずは、`section-1 Lesson 3 - スマートコントラクトをテストしてみよう`で実行したように部屋を1つ登録しておきます。続いて、予約機能をテストしていきます。

⚠️ 以降では、下記のように実際のアカウントIDを指定してコマンドを実行します。適宜ご自身のアカウントIDに読み替えてください。

- スマートコントラクトをデプロイするサブアカウント : `contract.hotel_booking.testnet`
- 部屋のオーナーアカウント : `hotel_booking.testnet`
- 宿泊者のアカウント : `guest.hotel_booking.testnet`

1. 宿泊者が、宿泊希望日で部屋を検索します。

```
near call contract.hotel_booking.testnet get_available_rooms '{"room_id": "hotel_booking.testnetSun Room", "check_in_date": "2222-01-01"}' --accountId guest.hotel_booking.testnet
```

以下のようなものが表示されます。

```
Transaction Id ByZawjJLaaa6UpyF9oGM7kAVqU4G7Fi7AeWKkLZh49L2
To see the transaction in the transaction explorer, please open this url in your browser
https://explorer.testnet.near.org/transactions/ByZawjJLaaa6UpyF9oGM7kAVqU4G7Fi7AeWKkLZh49L2
[
  {
    room_id: 'hotel_booking.testnetSun Room',
    owner_id: 'hotel_booking.testnet',
    name: 'Sun Room',
    image: 'none',
    beds: 1,
    description: 'This is Sun room.',
    location: 'Tokyo',
    price: '1000000000000000000000000'
  }
]
```

2. 部屋を予約をします。

```
near call contract.hotel_booking.testnet book_room '{"room_id": "hotel_booking.testnetSun Room", "check_in_date": "2222-01-01"}' --depositYocto=1000000000000000000000000 --accountId guest.hotel_booking.testnet
```

以下のようなものが表示されます。

```
To see the transaction in the transaction explorer, please open this url in your browser
https://explorer.testnet.near.org/transactions/4H9q6fjmf6HqopR9tXzLeBcoV2HNWqHG5EZ7ymMj9Nwq
''
```

3. オーナーが予約データを確認します

```
near view contract.hotel_booking.testnet get_booking_info_for_owner '{"owner_id": "hotel_booking.testnet"}'
```

以下のようなものが表示されます。

```
View call: contract.hotel_booking.testnet.get_booking_info_for_owner({"owner_id": "hotel_booking.testnet"})
[
  {
    room_id: 'hotel_booking.testnetSun Room',
    name: 'Sun Room',
    check_in_date: '2222-01-01',
    guest_id: 'guest.hotel_booking.testnet',
    status: 'Available'
  }
]
```

4. 宿泊者が自身の予約データを確認します

```
near view contract.hotel_booking.testnet get_booking_info_for_guest '{"guest_id": "guest.hotel_booking.testnet"}'
```

以下のようなものが表示されます。

```
View call: contract.hotel_booking.testnet.get_booking_info_for_guest({"guest_id": "guest.hotel_booking.testnet"})
[
  {
    owner_id: 'hotel_booking.testnet',
    name: 'Sun Room',
    check_in_date: '2222-01-01'
  }
]
```

5. オーナーが**Check In**/**Check Out**を行います

Check In

```
near call contract.hotel_booking.testnet change_status_to_stay '{"room_id": "hotel_booking.testnetSun Room", "check_in_date": "2222-01-01"}' --accountId hotel_booking.testnet
```

Check Out

```
near call contract.hotel_booking.testnet change_status_to_available '{"room_id": "hotel_booking.testnetSun Room", "check_in_date": "2222-01-01", "guest_id": "guest.hotel_booking.testnet"}' --accountId hotel_booking.testnet
```

6. 予約データが削除されているかを確認します。

   `3.`と`4.`で実行したコマンドを再実行してみてください。
   どちらも空のデータ`[]`が返ってきていれば成功です！

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

おめでとうございます！ 予約機能がきちんと実装できていることが確認できました ✨

ターミナルに出力されたアウトプットを`#near`に投稿して、あなたの成功をコミュニティで祝いましょう 🎉

次のセクションからはいよいよフロントエンドでスマートコントラクトとの接続+UIの作成を行なっていきます。

楽しんでいきましょう 🚀
