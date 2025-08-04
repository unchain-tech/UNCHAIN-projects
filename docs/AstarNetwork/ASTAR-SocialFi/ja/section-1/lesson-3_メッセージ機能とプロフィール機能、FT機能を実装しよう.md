## 📧 メッセージ機能とプロフィール機能、FT 機能を実装しよう

では前回に引き続きメッセージ機能、プロフィール機能、そしてFT（Fungible Token）の配布機能を実装していきましょう！

まずはメッセージ機能からです。`message.rs`を下のように編集しましょう。

[`message.rs`]

```rust
use crate::metadata::*;
use ink_env::AccountId;
use ink_prelude::string::String;
use ink_prelude::vec::Vec;

use crate::astar_sns_contract::AstarSnsContract;

impl AstarSnsContract {
    // メッセージ送信関数
    pub fn send_message_fn(
        &mut self,
        message: String,
        message_list_id: u128,
        sender_id: AccountId,
        created_time: String,
    ) {
        // 指定したメッセージリストのidに紐づいたメッセージリストを取得
        let mut message_list: Vec<Message> = self
            .message_list_map
            .get(&message_list_id)
            .unwrap_or(Vec::default());

        // メッセージの内容を↑に追加
        message_list.push(Message {
            message,
            sender_id,
            created_time,
        });

        // ↑で追加した新しいメッセージリストでコントラクトの状態変数を上書き
        self.message_list_map
            .insert(&message_list_id, &message_list);
    }

    // メッセージリストを取得`
    pub fn get_message_list_fn(&self, message_list_id: u128, num: usize) -> Vec<Message> {
        // 指定したメッセージリストのidに紐づいたメッセージリストを取得
        let self_message_list: Vec<Message> = self.message_list_map.get(&message_list_id).unwrap();

        // 返り値用のメッセージリストを生成
        let mut message_list: Vec<Message> = Vec::new();

        // どれくらいの量の投稿を取得するかを指定
        let amount_index: usize = 5;

        // メッセージリストの長さを取得
        let list_length: usize = self_message_list.len();

        // コントラクトに格納された投稿の量が指定された量の投稿より多いか判定。
        // それによって取得方法が異なるため
        if list_length < amount_index + 1 {
            for m in 0..(list_length) {
                // 取得した内容を返り値用のメッセージリストに追加
                message_list.push(self_message_list[m].clone());
            }
        } else {
            for n in (amount_index * (num - 1))..(amount_index * num) {
                // 取得した内容を返り値用のメッセージリストに追加
                message_list.push(self_message_list[n].clone());
            }
        }
        message_list
    }

    // 指定したメッセージリストのIDに紐づいたメッセージリストの最後のメッセージを取得
    pub fn get_last_message_fn(&self, message_list_id: u128) -> Message {
        let last_message: Message = self
            .message_list_map
            .get(&message_list_id)
            .unwrap()
            .last()
            .unwrap()
            .clone();
        last_message
    }
}
```

ではそれぞれの関数でどのようにメッセージを送信するかやメッセージリストの取得方法を説明したいと思います。また、フォローに伴ってメッセージ機能の説明もして行きます。

メッセージの送信は`send_message_fn関数`で行っています。メッセージの内容や送り主のウォレットアドレスを状態変数`message_list_map`へメッセージリストのidとともに追加します。

メッセージリストの取得は`get_message_list_fn関数`で行っています。ここでも投稿の取得でも利用した論理を使ってメッセージの量と最新度を指定できるようになっています。

指定したメッセージリストの最後のメッセージの取得は`get_last_message_fn関数`で行っています。ここで使用している`lastメソッド`はVec型に定義されているもので、リストの最後の要素を取得することができます。

これでメッセージ機能の実装は完了です。

では次にプロフィール作成機能を実装しましょう。`profile.rs`を下のように編集しましょう。

[`profile.rs`]

```rust
use crate::metadata::*;
use ink_env::AccountId;
use ink_prelude::string::String;
use ink_prelude::vec::Vec;

use crate::astar_sns_contract::AstarSnsContract;

impl AstarSnsContract {
    // 新しいユーザーのウォレットに接続した際に自動的に実行されるプロフィール作成関数
    // フロントでは最初はプロフィールの名前はunknown, imgUrlも指定されることになる。
    pub fn create_profile_fn(&mut self, account_id: AccountId) {
        // 既にアカウントが作成されていないか確認
        let is_already_connected = self.profile_map.contains(&account_id);
        if !is_already_connected {
            self.profile_map.insert(
                &(account_id),
                &Profile {
                    following_list: Vec::new(),
                    follower_list: Vec::new(),
                    friend_list: Vec::new(),
                    user_id: account_id,
                    name: None,
                    img_url: None,
                    message_list_id_list: Vec::new(),
                    post_id_list: Vec::new(),
                },
            );
        }
    }

    // プロフィールの名前と画像のURLを設定
    pub fn set_profile_info_fn(&mut self, account_id: AccountId, name: String, img_url: String) {
        let mut profile: Profile = self.profile_map.get(&account_id).unwrap();
        profile.name = Some(name);
        profile.img_url = Some(img_url);
        self.profile_map.insert(&account_id, &profile);
    }

    // get profile info
    pub fn get_profile_info_fn(&self, account_id: AccountId) -> Profile {
        let profile: Profile = self.profile_map.get(&account_id).unwrap();
        profile
    }

    pub fn check_created_profile_fn(&self, account_id: AccountId) -> bool {
        let is_already_connected = self.profile_map.contains(&account_id);
        is_already_connected
    }
}
```

プロフィールの作成と編集がどのように行われているのかを説明していきます。

プロフィールの作成は`create_profile_fn関数`で行われます。これはウォレットが初めて接続された時に行われるものです。Mapping型には`containsメソッド`が定義されており、指定されたkeyがそのマッピング内に存在するかを確認できます。存在しない場合のみプロファイルが作成されて、状態変数`profile_map`にウォレットアドレスをkeyとして格納されます。

プロフィールの編集は`set_profile_info_fn関数`で行われます。状態変数`profile_map`を上書きする形で行われます。

これでプロフィール機能の実装は完了です。

では最後に`FT.rs`を下のように書き換えていきましょう！

ここではFT（Fungible Token）持つ`balanceOf(残高確認)`、`transfer(送金)`、`distribute(配布)`の3つの機能が実装されています。

本来のトークンは`発行数の制限`や`symbol`の設定ができますが、ここでは一番簡略化してこれら3つの機能を実装していこうと思います！ この中で`transfer機能`は本教材では使いませんが、自分なりにカスタマイズしてアカウント間で移動できるようにフロントエンドを書き換えるのも面白いですね！

[`FT.rs`]

```rust
use crate::astar_sns_contract::AstarSnsContract;
use ink_env::AccountId;

impl AstarSnsContract {
    // トークン残高を確認する関数
    pub fn balance_of_fn(&self, account_id: AccountId) -> u128 {
        let asset = self.asset_mapping.get(&account_id).unwrap_or(0 as u128);
        asset
    }

    // 送信者と受信者を指定してトークンを送信
    pub fn transfer_fn(&mut self, from_id: AccountId, to_id: AccountId, amount: u128) {
        let mut to_asset = self.asset_mapping.get(&to_id).unwrap_or(0 as u128);
        let mut from_asset = self.asset_mapping.get(&from_id).unwrap_or(0 as u128);
        if from_asset < amount {
            return;
        }
        to_asset = to_asset + amount;
        from_asset = from_asset - amount;
        self.asset_mapping.insert(&to_id, &to_asset);
        self.asset_mapping.insert(&from_id, &from_asset);
    }

    // コントラクトから指定されたアカウントへトークンを送信
    pub fn distribute_fn(&mut self, to_id: AccountId, amount: u128) {
        let mut to_asset = self.asset_mapping.get(&to_id).unwrap_or(0 as u128);
        to_asset = to_asset + amount;
        self.asset_mapping.insert(&to_id, &to_asset);
    }
}

```

ここまででコントラクトに実装すべき機能の実装は終了しました。次のレッスンではコントラクトのテストとデプロイを行いましょう！

### 🙋‍♂️ 質問する

わからないことがあれば、Discordの`#astar`でsection・Lesson名とともに質問をしてください 👋

---

次のレッスンでは、コントラクトのテストをしていきます！ 🎉
