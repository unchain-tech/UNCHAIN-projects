### ✅ 機能テストを作成しよう

ここまでのレッスンで、予約機能を実装しました。

`section-1 Lesson 3 - スマートコントラクトをテストしてみよう`で、テストには2つの方法があると紹介しました。

1. テスト用の関数を走らせて、思った通りの挙動をするか一気にテストする
2. 実際にdeployしてターミナル上から関数を動かして確認する

このレッスンでは、1. の方法でテストを行います。
他の人がすぐにコードのテストができるという意味でも重要なので機能テストを入れることを癖づけていきましょう！

以下のコードを、`lib.rs`の一番下に追加しましょう。

`/contract/src/lib.rs`

```diff
// Private functions
impl Contract {
    ...
}

+ #[cfg(test)]
+ mod tests {
+     use super::*;
+     use near_sdk::test_utils::{accounts, VMContextBuilder};
+     use near_sdk::testing_env;
+
+     // トランザクションを実行するテスト環境を設定
+     fn get_context(is_view: bool) -> VMContextBuilder {
+         let mut builder = VMContextBuilder::new();
+         builder
+             .current_account_id(accounts(0))
+             .predecessor_account_id(accounts(0))
+             .signer_account_id(accounts(1))
+             // 使用するメソッドをbooleanで指定(viewメソッドはtrue, changeメソッドはfalse)
+             .is_view(is_view);
+         builder
+     }
+
+     #[test]
+     fn add_then_get_registered_rooms() {
+         let context = get_context(false);
+         testing_env!(context.build());
+
+         let mut contract = Contract::default();
+         contract.add_room_to_owner(
+             "101".to_string(),
+             "test.img".to_string(),
+             1,
+             "This is 101 room".to_string(),
+             "Tokyo".to_string(),
+             U128(10),
+         );
+         contract.add_room_to_owner(
+             "201".to_string(),
+             "test.img".to_string(),
+             1,
+             "This is 201 room".to_string(),
+             "Tokyo".to_string(),
+             U128(10),
+         );
+
+         // add_room_to_owner関数をコールしたアカウントIDを取得
+         let owner_id = env::signer_account_id();
+
+         let all_rooms = contract.get_rooms_registered_by_owner(owner_id);
+         assert_eq!(all_rooms.len(), 2);
+     }
+
+     #[test]
+     fn no_registered_room() {
+         let context = get_context(true);
+         testing_env!(context.build());
+         let contract = Contract::default();
+
+         let no_registered_room = contract.get_rooms_registered_by_owner(accounts(0));
+         assert_eq!(no_registered_room.len(), 0);
+     }
+
+     #[test]
+     fn add_then_get_available_rooms() {
+         let mut context = get_context(false);
+         testing_env!(context.build());
+
+         let mut contract = Contract::default();
+         contract.add_room_to_owner(
+             "101".to_string(),
+             "test.img".to_string(),
+             1,
+             "This is 101 room".to_string(),
+             "Tokyo".to_string(),
+             U128(10),
+         );
+         contract.add_room_to_owner(
+             "201".to_string(),
+             "test.img".to_string(),
+             1,
+             "This is 201 room".to_string(),
+             "Tokyo".to_string(),
+             U128(10),
+         );
+
+         // `get_available_rooms`をコールするアカウントを設定
+         testing_env!(context.signer_account_id(accounts(2)).build());
+         let available_rooms = contract.get_available_rooms("2222-01-01".to_string());
+         assert_eq!(available_rooms.len(), 2);
+     }
+
+     #[test]
+     fn no_available_room() {
+         let context = get_context(true);
+         testing_env!(context.build());
+         let contract = Contract::default();
+
+         let available_rooms = contract.get_available_rooms("2222-01-01".to_string());
+         assert_eq!(available_rooms.len(), 0);
+     }
+
+     // Room Owner   : bob(accounts(1))
+     // Booking Guest: charlie(accounts(2))
+     #[test]
+     fn book_room_then_change_status() {
+         let mut context = get_context(false);
+
+         // 宿泊料を支払うため、NEARを設定
+         context.account_balance(10);
+         context.attached_deposit(10);
+
+         testing_env!(context.build());
+
+         let owner_id = env::signer_account_id();
+         let mut contract = Contract::default();
+         contract.add_room_to_owner(
+             "101".to_string(),
+             "test.img".to_string(),
+             1,
+             "This is 101 room".to_string(),
+             "Tokyo".to_string(),
+             U128(10),
+         );
+
+         ///////////////////
+         // CHECK BOOKING //
+         ///////////////////
+         // `get_available_rooms`と`book_room`をコールするアカウントを設定
+         testing_env!(context.signer_account_id(accounts(2)).build());
+
+         let check_in_date: String = "2222-01-01".to_string();
+         let available_rooms = contract.get_available_rooms(check_in_date.clone());
+
+         // 予約を実行
+         contract.book_room(available_rooms[0].room_id.clone(), check_in_date.clone());
+
+         // オーナー用の予約データの中身を確認
+         let booked_rooms = contract.get_booking_info_for_owner(owner_id.clone());
+         assert_eq!(booked_rooms.len(), 1);
+         assert_eq!(booked_rooms[0].check_in_date, check_in_date);
+         assert_eq!(booked_rooms[0].guest_id, accounts(2));
+
+         // 宿泊者用の予約データの中身を確認
+         let guest_booked_rooms = contract.get_booking_info_for_guest(accounts(2));
+         assert_eq!(guest_booked_rooms.len(), 1);
+         assert_eq!(guest_booked_rooms[0].owner_id, owner_id);
+
+         /////////////////////////
+         // CHECK CHANGE STATUS //
+         /////////////////////////
+         // 'change_status_to_stay'をコールするアカウントを部屋のオーナーに設定
+         testing_env!(context.signer_account_id(accounts(1)).build());
+
+         // 部屋のステータスを確認
+         let is_available = contract.is_available(booked_rooms[0].room_id.clone());
+         assert_eq!(is_available, true);
+
+         // 部屋のステータスを変更（Available -> Stay）
+         contract.change_status_to_stay(booked_rooms[0].room_id.clone(), check_in_date.clone());
+         let booked_rooms = contract.get_booking_info_for_owner(owner_id.clone());
+         assert_ne!(booked_rooms[0].status, UsageStatus::Available);
+
+         // 再度ステータスを確認
+         let is_available = contract.is_available(booked_rooms[0].room_id.clone());
+         assert_eq!(is_available, false);
+
+         // 部屋のステータスを変更（Stay -> Available）
+         contract.change_status_to_available(
+             available_rooms[0].room_id.clone(),
+             check_in_date.clone(),
+             booked_rooms[0].guest_id.clone(),
+         );
+         // 予約データから削除されたかチェック
+         let booked_rooms = contract.get_booking_info_for_owner(owner_id.clone());
+         assert_eq!(booked_rooms.len(), 0);
+
+         // 宿泊者の予約データから消えたかチェック
+         let guest_booked_info = contract.get_booking_info_for_guest(accounts(2));
+         assert_eq!(guest_booked_info.len(), 0);
+     }
+ }
```

テスト環境を構築する関数と、スマートコントラクト内のメソッドを呼び出して結果を確認する関数を5つ定義しました。
内容を見ていきましょう。

最初に定義した関数が、環境を構築します。これは、テストをするための仮想的なチェーン（Virtual Machine）をビルドするためのものです。

```rust
    // トランザクションを実行するテスト環境を設定
    fn get_context(is_view: bool) -> VMContextBuilder {
        let mut builder = VMContextBuilder::new();
        builder
            .current_account_id(accounts(0))
            .predecessor_account_id(accounts(0))
            .signer_account_id(accounts(1))
            // 使用するメソッドをbooleanで指定(viewメソッドはtrue, changeメソッドはfalse)
            .is_view(is_view);
        builder
    }
```

次の関数は、`add_room_to_owner`メソッドを2回呼び出し部屋のデータを登録します。最後に`get_rooms_registered_by_owner`メソッドの返り値から、データが2つ登録されているかを`assert_eq!()`メソッドで確認しています。

```rust
    #[test]
    fn add_then_get_registered_rooms() {
        let context = get_context(false);
        testing_env!(context.build());

        let mut contract = Contract::default();
        contract.add_room_to_owner(
            "101".to_string(),
            "test.img".to_string(),
            1,
            "This is 101 room".to_string(),
            "Tokyo".to_string(),
            U128(10),
        );
        contract.add_room_to_owner(
            "201".to_string(),
            "test.img".to_string(),
            1,
            "This is 201 room".to_string(),
            "Tokyo".to_string(),
            U128(10),
        );

        // add_room_to_owner関数をコールしたアカウントIDを取得
        let owner_id = env::signer_account_id();

        let all_rooms = contract.get_rooms_registered_by_owner(owner_id);
        assert_eq!(all_rooms.len(), 2);
    }
```

次は、`get_rooms_registered_by_owner`メソッドのみを呼び出して、空のデータが返ってくるかを確認しています。

```rust
    #[test]
    fn no_registered_room() {
        let context = get_context(true);
        testing_env!(context.build());
        let contract = Contract::default();

        let no_registered_room = contract.c(accounts(0));
        assert_eq!(no_registered_room.len(), 0);
    }
```

次は、宿泊者が指定した日付で予約できる部屋のデータ一覧が取得できるかを確認しています。
`get_available_rooms`メソッドの機能を確かめています。

```rust
    #[test]
    fn add_then_get_available_rooms() {
        let mut context = get_context(false);
        testing_env!(context.build());

        let mut contract = Contract::default();
        contract.add_room_to_owner(
            "101".to_string(),
            "test.img".to_string(),
            1,
            "This is 101 room".to_string(),
            "Tokyo".to_string(),
            U128(10),
        );
        contract.add_room_to_owner(
            "201".to_string(),
            "test.img".to_string(),
            1,
            "This is 201 room".to_string(),
            "Tokyo".to_string(),
            U128(10),
        );

        // `get_available_rooms`をコールするアカウントを設定
        testing_env!(context.signer_account_id(accounts(2)).build());
        let available_rooms = contract.get_available_rooms("2222-01-01".to_string());
        assert_eq!(available_rooms.len(), 2);
    }
```

次は、`get_available_rooms`メソッドのみを呼び出して、予約できる部屋がない時に空のデータが返されるかを確認しています。

```rust
    #[test]
    fn no_available_room() {
        let context = get_context(true);
        testing_env!(context.build());
        let contract = Contract::default();

        let available_rooms = contract.get_available_rooms("2222-01-01".to_string());
        assert_eq!(available_rooms.len(), 0);
    }
```

最後は長いのですが、予約機能の一連の流れがきちんと実行できるかを確認しています。

宿泊者が部屋を検索・予約 → オーナが予約データを取得 → 宿泊者が自身の予約データを取得 → オーナーが**Check In**/**Check Out**ボタンを押す → 予約データが削除される

```rust
    // Room Owner   : bob(accounts(1))
    // Booking Guest: charlie(accounts(2))
    #[test]
    fn book_room_then_change_status() {
        let mut context = get_context(false);

        // 宿泊料を支払うため、NEARを設定
        context.account_balance(10);
        context.attached_deposit(10);

        testing_env!(context.build());

        let owner_id = env::signer_account_id();
        let mut contract = Contract::default();
        contract.add_room_to_owner(
            "101".to_string(),
            "test.img".to_string(),
            1,
            "This is 101 room".to_string(),
            "Tokyo".to_string(),
            U128(10),
        );

        ///////////////////
        // CHECK BOOKING //
        ///////////////////
        // `get_available_rooms`と`book_room`をコールするアカウントを設定
        testing_env!(context.signer_account_id(accounts(2)).build());

        let check_in_date: String = "2222-01-01".to_string();
        let available_rooms = contract.get_available_rooms(check_in_date.clone());

        // 予約を実行
        contract.book_room(available_rooms[0].room_id.clone(), check_in_date.clone());

        // オーナー用の予約データの中身を確認
        let booked_rooms = contract.get_booking_info_for_owner(owner_id.clone());
        assert_eq!(booked_rooms.len(), 1);
        assert_eq!(booked_rooms[0].check_in_date, check_in_date);
        assert_eq!(booked_rooms[0].guest_id, accounts(2));

        // 宿泊者用の予約データの中身を確認
        let guest_booked_rooms = contract.get_booking_info_for_guest(accounts(2));
        assert_eq!(guest_booked_rooms.len(), 1);
        assert_eq!(guest_booked_rooms[0].owner_id, owner_id);

        /////////////////////////
        // CHECK CHANGE STATUS //
        /////////////////////////
        // 'change_status_to_stay'をコールするアカウントを部屋のオーナーに設定
        testing_env!(context.signer_account_id(accounts(1)).build());

        // 部屋のステータスを確認
        let is_available = contract.is_available(booked_rooms[0].room_id.clone());
        assert_eq!(is_available, true);

        // 部屋のステータスを変更（Available -> Stay）
        contract.change_status_to_stay(booked_rooms[0].room_id.clone(), check_in_date.clone());
        let booked_rooms = contract.get_booking_info_for_owner(owner_id.clone());
        assert_ne!(booked_rooms[0].status, UsageStatus::Available);

        // 再度ステータスを確認
        let is_available = contract.is_available(booked_rooms[0].room_id.clone());
        assert_eq!(is_available, false);

        // 部屋のステータスを変更（Stay -> Available）
        contract.change_status_to_available(
            available_rooms[0].room_id.clone(),
            check_in_date.clone(),
            booked_rooms[0].guest_id.clone(),
        );
        // 予約データから削除されたかチェック
        let booked_rooms = contract.get_booking_info_for_owner(owner_id.clone());
        assert_eq!(booked_rooms.len(), 0);

        // 宿泊者の予約データから消えたかチェック
        let guest_booked_info = contract.get_booking_info_for_guest(accounts(2));
        assert_eq!(guest_booked_info.len(), 0);
    }
```

それでは、以下のコマンドをターミナルで実行してみましょう。

```
cargo test
```

このような結果が返ってきたら、機能テストは成功です！

```
    Finished test [unoptimized + debuginfo] target(s) in 1.19s
     Running unittests src/lib.rs (target/debug/deps/hotel_booking-bf7ec22a09582a46)

running 5 tests
test tests::add_then_get_registered_rooms ... ok
test tests::add_then_get_available_rooms ... ok
test tests::no_available_room ... ok
test tests::book_room_then_change_status ... ok
test tests::no_registered_room ... ok

test result: ok. 5 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.01s

   Doc-tests hotel-booking

running 0 tests

test result: ok. 0 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s

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

次のレッスンに進み、実際のtestnetにデプロイをして動作を確認してみましょう！
