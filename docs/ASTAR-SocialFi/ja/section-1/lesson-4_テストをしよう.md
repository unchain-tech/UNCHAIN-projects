## 👀 コントラクトのテストをしよう

前回のレッスンでコントラクトの作成は完了したので、ここからはコントラクトのテストとデプロイを行いましょう！

まずテストですが、このセクションの序盤でも述べたようにlib.rsに`#[ink::test]`とともに関数を定義することで記述できます。

今回のテストではきちんとメッセージのやり取りやフォローができているかを可視化するためにターミナルに表示させる形式をとっています。

では早速`lib.rs`を下のように編集しましょう。

[`lib.rs`]

```rust
#![cfg_attr(not(feature = "std"), no_std)]

mod FT;
mod follow;
mod message;
mod metadata;
mod post;
mod profile;

use ink_lang as ink;

#[ink::contract]
mod astar_sns_contract {
    use ink_env::debug_println;
    use ink_lang::codegen::Env;
    use ink_prelude::string::String;
    use ink_prelude::vec::Vec;
    use openbrush::storage::Mapping;
    use openbrush::test_utils::*;

    pub use crate::follow::*;
    pub use crate::message::*;
    pub use crate::metadata::*;
    pub use crate::post::*;

    #[ink(storage)]
    pub struct AstarSnsContract {
        pub profile_map: Mapping<AccountId, Profile>,
        pub post_map: Mapping<u128, Post>,
        pub post_map_counter: u128,
        pub message_list_map: Mapping<u128, Vec<Message>>,
        pub message_list_map_counter: u128,
        pub asset_mapping: Mapping<AccountId, u128>,
    }

    impl AstarSnsContract {
        /// Constructor that initializes the `bool` value to the given `init_value`.
        #[ink(constructor, payable)]
        pub fn new() -> Self {
            Self {
                profile_map: Mapping::default(),
                post_map: Mapping::default(),
                post_map_counter: 0,
                message_list_map: Mapping::default(),
                message_list_map_counter: 0,
                asset_mapping: Mapping::default(),
            }
        }

        // 投稿関数
        #[ink(message)]
        pub fn release_post(
            &mut self,
            description: String,
            created_time: String,
            post_img_url: String,
        ) {
            let caller: AccountId = self.env().caller();
            self.release_post_fn(caller, description, created_time, post_img_url);
        }

        // 全体の投稿を取得する関数
        #[ink(message)]
        pub fn get_general_post(&self, num: u128) -> Vec<Post> {
            let general_post_list = self.get_general_post_fn(num);
            general_post_list
        }

        // 指定したアカウントの投稿を取得
        #[ink(message)]
        pub fn get_individual_post(&self, num: u128, account_id: AccountId) -> Vec<Post> {
            let individual_post_list = self.get_individual_post_fn(num, account_id);
            individual_post_list
        }

        // いいねを加える関数
        #[ink(message)]
        pub fn add_likes(&mut self, post_id: u128) {
            self.add_likes_fn(post_id);
        }

        // メッセージ送信関数
        #[ink(message)]
        pub fn send_message(
            &mut self,
            message: String,
            message_list_id: u128,
            created_time: String,
        ) {
            let caller: AccountId = self.env().caller();
            self.send_message_fn(message, message_list_id, caller, created_time);
        }

        // 指定されたidに紐づくメッセージリストの取得関数
        #[ink(message)]
        pub fn get_message_list(&self, message_list_id: u128, num: u128) -> Vec<Message> {
            let message_list: Vec<Message> =
                self.get_message_list_fn(message_list_id, num as usize);
            message_list
        }

        // 指定されたidに紐づくメッセージリストの最後のメッセージを取得する関数
        #[ink(message)]
        pub fn get_last_message(&self, message_list_id: u128) -> Message {
            let message: Message = self.get_last_message_fn(message_list_id);
            message
        }

        // プロフィール作成関数
        #[ink(message)]
        pub fn create_profile(&mut self) {
            let caller: AccountId = self.env().caller();
            self.create_profile_fn(caller);
        }

        // プロフィールの名前と画像を設定する関数
        #[ink(message)]
        pub fn set_profile_info(&mut self, name: String, img_url: String) {
            let caller: AccountId = self.env().caller();
            self.set_profile_info_fn(caller, name, img_url);
        }

        // フォロー関数
        #[ink(message)]
        pub fn follow(&mut self, followed_account_id: AccountId) {
            let caller: AccountId = self.env().caller();
            self.follow_fn(caller, followed_account_id);
        }

        // 自分がフォローしているアカウントのリストを取得する関数
        #[ink(message)]
        pub fn get_following_list(&self, account_id: AccountId) -> Vec<AccountId> {
            let following_list: Vec<AccountId> = self.get_following_list_fn(account_id);
            following_list
        }

        // 自分をフォローしているアカウントのリストを取得する関数
        #[ink(message)]
        pub fn get_follower_list(&self, account_id: AccountId) -> Vec<AccountId> {
            let follower_list: Vec<AccountId> = self.get_follower_list_fn(account_id);
            follower_list
        }

        // プロフィール情報を取得する
        #[ink(message)]
        pub fn get_profile_info(&self, account_id: AccountId) -> Profile {
            let profile: Profile = self.get_profile_info_fn(account_id);
            profile
        }

        // 既にプロフィールが作成されているか確認する関数
        #[ink(message)]
        pub fn check_created_info(&self, account_id: AccountId) -> bool {
            let is_already_connected: bool = self.check_created_profile_fn(account_id);
            is_already_connected
        }

        // 指定のアカウントの投稿に対するいいねの総数を取得する関数
        #[ink(message)]
        pub fn get_total_likes(&self, account_id: AccountId) -> u128 {
            let num_of_likes = self.get_total_likes_fn(account_id);
            num_of_likes
        }

        // 指定のアカウントのトークン保有量を取得
        #[ink(message)]
        pub fn balance_of(&self, account_id: AccountId) -> u128 {
            let asset = self.balance_of_fn(account_id);
            asset
        }

        // トークンを送信する関数
        #[ink(message)]
        pub fn transfer(&mut self, to_id: AccountId, amount: u128) {
            let caller: AccountId = self.env().caller();
            self.transfer_fn(caller, to_id, amount);
        }

        // いいね数に応じてトークンを配布する関数
        #[ink(message)]
        pub fn distribute_refer_likes(&mut self) {
            let caller: AccountId = self.env().caller();
            let total_likes = self.get_total_likes_fn(caller);
            let asset = self.balance_of_fn(caller);
            let calculated_amount = total_likes * 20;
            if asset < calculated_amount {
                self.distribute_fn(caller, calculated_amount - asset);
            }
        }
    }

    #[cfg(test)]
    mod tests {

        // 他のファイルで宣言している内容をインポート
        use super::*;

        use ink_env::debug_println;

        use ink_lang as ink;

        // profile creation and setting function
        #[ink::test]
        fn test_profile_fn_works() {
            // コントラクトのインスタンス化
            let mut astar_sns_contract = AstarSnsContract::new();

            // 新しいアカウントを取得
            let alice_account_id = accounts().alice;
            ink_env::test::set_caller::<ink_env::DefaultEnvironment>(alice_account_id);

            // プロフィール作成
            astar_sns_contract.create_profile();

            // プロフィール情報を設定
            astar_sns_contract
                .set_profile_info("Tony Stark".to_string(), "https//ff...".to_string());

            // プロフィール情報の確認
            debug_println!(
                "profile_list: {:?}",
                astar_sns_contract
                    .profile_map
                    .get(&alice_account_id)
                    .unwrap()
            );
        }

        // // 投稿機能の確認
        // #[ink::test]
        // fn test_post_release_fn_works() {
        //     // コントラクトのインスタンス化
        //     let mut astar_sns_contract = AstarSnsContract::new();

        //     // 新しいアカウントを取得
        //     let alice_account_id = accounts().alice;

        //     // プロフィール作成
        //     ink_env::test::set_caller::<ink_env::DefaultEnvironment>(alice_account_id);
        //     astar_sns_contract.create_profile();

        //     // プロフィール情報を設定
        //     astar_sns_contract.set_profile_info("Alice".to_string(), "https//ff...".to_string());

        //     // 投稿
        //     astar_sns_contract.release_post(
        //         "Today, it was so rainy!".to_string(),
        //         "12:30".to_string(),
        //         "https://sdfds...".to_string(),
        //     );

        //     // 投稿情報の確認
        //     let post_info: Post = astar_sns_contract
        //         .post_map
        //         .get(&(astar_sns_contract.post_map_counter - 1))
        //         .unwrap();
        //     debug_println!("post :{:?}\n", post_info);
        // }

        // // ユーザー全体の投稿を取得機能のテスト
        // #[ink::test]
        // fn test_general_post_get_fn_works() {
        //     // コントラクトのインスタンス化
        //     let mut astar_sns_contract = AstarSnsContract::new();

        //     // 新しいアカウントを取得
        //     let alice_account_id = accounts().alice;
        //     let bob_account_id = accounts().bob;
        //     let charlie_account_id = accounts().charlie;

        //     // プロフィール作成
        //     ink_env::test::set_caller::<ink_env::DefaultEnvironment>(alice_account_id);
        //     astar_sns_contract.create_profile();

        //     ink_env::test::set_caller::<ink_env::DefaultEnvironment>(bob_account_id);
        //     astar_sns_contract.create_profile();

        //     ink_env::test::set_caller::<ink_env::DefaultEnvironment>(charlie_account_id);
        //     astar_sns_contract.create_profile();

        //     // プロフィール情報を設定
        //     ink_env::test::set_caller::<ink_env::DefaultEnvironment>(alice_account_id);
        //     astar_sns_contract.set_profile_info("Alice".to_string(), "https//ff...".to_string());

        //     // 複数投稿
        //     astar_sns_contract.release_post(
        //         "Today, it was so rainy!".to_string(),
        //         "12:30".to_string(),
        //         "https://sdfds...".to_string(),
        //     );
        //     astar_sns_contract.release_post(
        //         "I come to Thailand".to_string(),
        //         "12:35".to_string(),
        //         "https://gsdef...".to_string(),
        //     );
        //     astar_sns_contract.release_post(
        //         "Hello YouTube".to_string(),
        //         "12:40".to_string(),
        //         "https://fafds...".to_string(),
        //     );
        //     astar_sns_contract.release_post(
        //         "Oh baby, come on!".to_string(),
        //         "12:45".to_string(),
        //         "https://fsdfee...".to_string(),
        //     );
        //     astar_sns_contract.release_post(
        //         "Don't mention it!".to_string(),
        //         "12:50".to_string(),
        //         "https://fasee...".to_string(),
        //     );
        //     astar_sns_contract.release_post(
        //         "Do what you want".to_string(),
        //         "12:55".to_string(),
        //         "https://fasdfgeg...".to_string(),
        //     );

        //     // 全体の投稿情報を確認
        //     let post_list: Vec<Post> = astar_sns_contract.get_general_post(1);
        //     debug_println!("General post get test\n",);
        //     for n in 0..(post_list.len()) {
        //         debug_println!("{:?}\n", post_list[n]);
        //     }
        // }

        // #[ink::test]
        // fn test_individual_post_get_fn_works() {
        //     // コントラクトのインスタンス化
        //     let mut astar_sns_contract = AstarSnsContract::new();

        //     // 新しいアカウントを取得
        //     let alice_account_id = accounts().alice;
        //     let bob_account_id = accounts().bob;
        //     let charlie_account_id = accounts().charlie;

        //     // プロフィール作成
        //     ink_env::test::set_caller::<ink_env::DefaultEnvironment>(alice_account_id);
        //     astar_sns_contract.create_profile();

        //     ink_env::test::set_caller::<ink_env::DefaultEnvironment>(bob_account_id);
        //     astar_sns_contract.create_profile();

        //     ink_env::test::set_caller::<ink_env::DefaultEnvironment>(charlie_account_id);
        //     astar_sns_contract.create_profile();

        //     // プロフィール情報を設定
        //     ink_env::test::set_caller::<ink_env::DefaultEnvironment>(alice_account_id);
        //     astar_sns_contract.set_profile_info("Alice".to_string(), "https//ff...".to_string());

        //     ink_env::test::set_caller::<ink_env::DefaultEnvironment>(bob_account_id);
        //     astar_sns_contract.set_profile_info("Bob".to_string(), "https//ff...".to_string());

        //     ink_env::test::set_caller::<ink_env::DefaultEnvironment>(charlie_account_id);
        //     astar_sns_contract.set_profile_info("Charlie".to_string(), "https//ff...".to_string());

        //     // 複数のアカウントからの投稿
        //     ink_env::test::set_caller::<ink_env::DefaultEnvironment>(alice_account_id);
        //     astar_sns_contract.release_post(
        //         "Today, it was so rainy!".to_string(),
        //         "12:30".to_string(),
        //         "https://sdfds...".to_string(),
        //     );
        //     astar_sns_contract.release_post(
        //         "Oh baby, come on!".to_string(),
        //         "12:45".to_string(),
        //         "https://fsdfee...".to_string(),
        //     );

        //     ink_env::test::set_caller::<ink_env::DefaultEnvironment>(bob_account_id);
        //     astar_sns_contract.release_post(
        //         "I come to Thailand".to_string(),
        //         "12:35".to_string(),
        //         "https://gsdef...".to_string(),
        //     );
        //     astar_sns_contract.release_post(
        //         "Don't mention it!".to_string(),
        //         "12:50".to_string(),
        //         "https://fasee...".to_string(),
        //     );

        //     ink_env::test::set_caller::<ink_env::DefaultEnvironment>(charlie_account_id);
        //     astar_sns_contract.release_post(
        //         "Hello YouTube".to_string(),
        //         "12:40".to_string(),
        //         "https://fafds...".to_string(),
        //     );
        //     astar_sns_contract.release_post(
        //         "Do what you want".to_string(),
        //         "12:55".to_string(),
        //         "https://fasdfgeg...".to_string(),
        //     );

        //     // それぞれのアカウントの個別の投稿取得を確認
        //     let alice_post_list: Vec<Post> =
        //         astar_sns_contract.get_individual_post(1, alice_account_id);
        //     let bob_post_list: Vec<Post> =
        //         astar_sns_contract.get_individual_post(1, bob_account_id);
        //     let charlie_post_list: Vec<Post> =
        //         astar_sns_contract.get_individual_post(1, charlie_account_id);
        //     debug_println!("Individual post get test");
        //     for n in 0..(alice_post_list.len()) {
        //         debug_println!("{:?}", alice_post_list[n]);
        //     }
        //     for n in 0..(bob_post_list.len()) {
        //         debug_println!("{:?}", bob_post_list[n]);
        //     }
        //     for n in 0..(charlie_post_list.len()) {
        //         debug_println!("{:?}", charlie_post_list[n]);
        //     }
        // }

        // #[ink::test]
        // fn test_add_likes_fn_works() {
        //     // コントラクトのインスタンス化
        //     let mut astar_sns_contract = AstarSnsContract::new();

        //     // 新しいアカウントを取得
        //     let alice_account_id = accounts().alice;
        //     ink_env::test::set_caller::<ink_env::DefaultEnvironment>(alice_account_id);

        //     // プロフィール作成
        //     astar_sns_contract.create_profile();

        //     // プロフィール情報を設定
        //     astar_sns_contract.set_profile_info("Alice".to_string(), "https//ff...".to_string());

        //     // 投稿
        //     astar_sns_contract.release_post(
        //         "Today, it was so rainy!".to_string(),
        //         "12:30".to_string(),
        //         "https://sdfds...".to_string(),
        //     );

        //     astar_sns_contract.release_post(
        //         "Today, it was so rainy!".to_string(),
        //         "12:30".to_string(),
        //         "https://sdfds...".to_string(),
        //     );

        //     astar_sns_contract.release_post(
        //         "Today, it was so rainy!".to_string(),
        //         "12:30".to_string(),
        //         "https://sdfds...".to_string(),
        //     );

        //     // 指定した投稿にいいねができているいるか確認
        //     astar_sns_contract.add_likes(0);
        //     debug_println!(
        //         "Number of likes: {}",
        //         astar_sns_contract.post_map.get(&0).unwrap().num_of_likes
        //     );
        //     astar_sns_contract.add_likes(0);
        //     astar_sns_contract.add_likes(1);
        //     astar_sns_contract.add_likes(2);
        //     debug_println!(
        //         "Number of likes: {}",
        //         astar_sns_contract.post_map.get(&0).unwrap().num_of_likes
        //     );

        //     // 指定したユーザーの投稿に対するいいねの総数取得を確認
        //     let total_likes = astar_sns_contract.get_total_likes(alice_account_id);
        //     debug_println!("alice total num of likes: {}", total_likes)
        // }

        // #[ink::test]
        // fn test_follow_fn_works() {
        //     // コントラクトのインスタンス化
        //     let mut astar_sns_contract = AstarSnsContract::new();

        //     // 新しいアカウントを取得
        //     let alice_account_id = accounts().alice;
        //     let bob_account_id = accounts().bob;
        //     let charlie_account_id = accounts().charlie;

        //     // プロフィール作成
        //     ink_env::test::set_caller::<ink_env::DefaultEnvironment>(alice_account_id);
        //     astar_sns_contract.create_profile();

        //     ink_env::test::set_caller::<ink_env::DefaultEnvironment>(bob_account_id);
        //     astar_sns_contract.create_profile();

        //     ink_env::test::set_caller::<ink_env::DefaultEnvironment>(charlie_account_id);
        //     astar_sns_contract.create_profile();

        //     // メッセージリストのidカウンターの確認
        //     debug_println!(
        //         "message_list_map_counter: {}",
        //         astar_sns_contract.message_list_map_counter
        //     );

        //     // フォロー機能の確認
        //     ink_env::test::set_caller::<ink_env::DefaultEnvironment>(alice_account_id);
        //     astar_sns_contract.follow(bob_account_id);
        //     debug_println!(
        //         "following_list: {:?}\nfollower_list: {:?}",
        //         astar_sns_contract.get_following_list(alice_account_id),
        //         astar_sns_contract.get_follower_list(bob_account_id)
        //     );

        //     // メッセージリストのidカウンターの確認
        //     debug_println!(
        //         "message_list_map_id: {}",
        //         astar_sns_contract.message_list_map_counter
        //     );

        //     // フォロー機能の確認(bob -> alice)
        //     ink_env::test::set_caller::<ink_env::DefaultEnvironment>(bob_account_id);
        //     astar_sns_contract.follow(alice_account_id);
        //     // メッセージリストのidカウンターの確認
        //     debug_println!(
        //         "message_list_map_counter: {}",
        //         astar_sns_contract.message_list_map_counter
        //     );

        //     // フォロー機能の確認(alice -> bob)
        //     ink_env::test::set_caller::<ink_env::DefaultEnvironment>(alice_account_id);
        //     astar_sns_contract.follow(bob_account_id);
        //     // メッセージリストのidカウンターの確認
        //     // フォローバックではメッセージリストidが増えないことを確認
        //     debug_println!(
        //         "message_list_map_counter: {}",
        //         astar_sns_contract.message_list_map_counter
        //     );

        //     // フォロー機能の確認(alice -> charlie)
        //     ink_env::test::set_caller::<ink_env::DefaultEnvironment>(alice_account_id);
        //     astar_sns_contract.follow(charlie_account_id);
        //     debug_println!(
        //         "following_list: {:?}\nfollower_list: {:?}",
        //         astar_sns_contract.get_following_list(alice_account_id),
        //         astar_sns_contract.get_follower_list(charlie_account_id)
        //     );

        //     // メッセージリストのidカウンターの確認
        //     debug_println!(
        //         "message_list_map_counter: {}",
        //         astar_sns_contract.message_list_map_counter
        //     );
        // }

        // #[ink::test]
        // fn test_message_fn_works() {
        //     // コントラクトのインスタンス化
        //     let mut astar_sns_contract = AstarSnsContract::new();

        //     // 新しいアカウントを取得
        //     let alice_account_id = accounts().alice;
        //     let bob_account_id = accounts().bob;
        //     let charlie_account_id = accounts().charlie;

        //     // プロフィール作成
        //     ink_env::test::set_caller::<ink_env::DefaultEnvironment>(alice_account_id);
        //     astar_sns_contract.create_profile();

        //     ink_env::test::set_caller::<ink_env::DefaultEnvironment>(bob_account_id);
        //     astar_sns_contract.create_profile();

        //     ink_env::test::set_caller::<ink_env::DefaultEnvironment>(charlie_account_id);
        //     astar_sns_contract.create_profile();

        //     // プロフィール情報を設定
        //     ink_env::test::set_caller::<ink_env::DefaultEnvironment>(alice_account_id);
        //     astar_sns_contract.set_profile_info("Alice".to_string(), "https//ff...".to_string());

        //     ink_env::test::set_caller::<ink_env::DefaultEnvironment>(bob_account_id);
        //     astar_sns_contract.set_profile_info("Bob".to_string(), "https//ff...".to_string());

        //     ink_env::test::set_caller::<ink_env::DefaultEnvironment>(charlie_account_id);
        //     astar_sns_contract.set_profile_info("Charlie".to_string(), "https//ff...".to_string());

        //     // メッセージリスト作成のためフォローを実行
        //     ink_env::test::set_caller::<ink_env::DefaultEnvironment>(alice_account_id);
        //     astar_sns_contract.follow(bob_account_id);
        //     astar_sns_contract.follow(charlie_account_id);

        //     // メッセージ送信
        //     ink_env::test::set_caller::<ink_env::DefaultEnvironment>(alice_account_id);
        //     astar_sns_contract.send_message(
        //         "Sorry Bro, I can't go today.".to_string(),
        //         0,
        //         "12:30".to_string(),
        //     );
        //     astar_sns_contract.send_message(
        //         "Why don't we go there tomorrow?".to_string(),
        //         0,
        //         "12:33".to_string(),
        //     );
        //     astar_sns_contract.send_message(
        //         "Hey, Charlie will come!".to_string(),
        //         0,
        //         "12:35".to_string(),
        //     );
        //     astar_sns_contract.send_message(
        //         "He seems so muscular, so he would teach us.".to_string(),
        //         0,
        //         "12:36".to_string(),
        //     );
        //     astar_sns_contract.send_message(
        //         "Why don't we go there tomorrow?".to_string(),
        //         0,
        //         "12:37".to_string(),
        //     );
        //     ink_env::test::set_caller::<ink_env::DefaultEnvironment>(bob_account_id);
        //     astar_sns_contract.send_message(
        //         "I'm so looking forward that!".to_string(),
        //         0,
        //         "12:38".to_string(),
        //     );
        //     astar_sns_contract.send_message(
        //         "Hey bro! Tomorrow I and Bob go to gym. Don't you join us?".to_string(),
        //         1,
        //         "12:34".to_string(),
        //     );

        //     // メッセージリストと最後のメッセージの取得を確認
        //     debug_println!(
        //         "message_list_alice_bob: {:?}\n",
        //         astar_sns_contract.get_message_list(0, 1)
        //     );
        //     debug_println!(
        //         "last_message_alice_bob: {:?}\n",
        //         astar_sns_contract.get_last_message(0)
        //     );
        //     debug_println!(
        //         "message_list_alice_charlie: {:?}",
        //         astar_sns_contract.get_message_list(1, 1)
        //     );
        // }

        // #[ink::test]
        // fn FT_fn_works() {
        //     // コントラクトのインスタンス化
        //     let mut astar_sns_contract = AstarSnsContract::new();

        //     // 新しいアカウントの作成
        //     let alice_account_id = accounts().alice;
        //     let bob_account_id = accounts().bob;
        //     let charlie_account_id = accounts().charlie;

        //     // alice, bob, charlieのアカウントへそれぞれ100トークンを配布
        //     astar_sns_contract.distribute_fn(alice_account_id, 100);
        //     astar_sns_contract.distribute_fn(bob_account_id, 100);
        //     astar_sns_contract.distribute_fn(charlie_account_id, 100);

        //     // alice, charlieからbobへそれぞれ50トークンの送金
        //     ink_env::test::set_caller::<ink_env::DefaultEnvironment>(alice_account_id);
        //     astar_sns_contract.transfer(bob_account_id, 50);

        //     ink_env::test::set_caller::<ink_env::DefaultEnvironment>(charlie_account_id);
        //     astar_sns_contract.transfer(bob_account_id, 50);

        //     // alice, bob, charlieの残高を確認
        //     let alice_asset = astar_sns_contract.balance_of(alice_account_id);
        //     let bob_asset = astar_sns_contract.balance_of(bob_account_id);
        //     let charlie_asset = astar_sns_contract.balance_of(charlie_account_id);
        //     debug_println!("alice_asset:{}", alice_asset);
        //     debug_println!("bob_asset:{}", bob_asset);
        //     debug_println!("charlie_asset:{}", charlie_asset);
        // }
    }
}
```

今回のテストではターミナルで意図した返り値が返ってきているかを確認するのですが、全てのテストを一気に行うと返り値が多すぎて確認しにくいので指定の関数以外はコメントアウトすることで1つずつ順番に行っていきましょう。

まずは`test_profile_fn_works関数`です。ここではプロファイルの編集がきちんと行えるかを確認して行きます。

```rust
 // プロフィールの作成と設定する関数をテスト
        #[ink::test]
        fn test_profile_fn_works() {
            // コントラクトの初期化
            let mut astar_sns_contract = AstarSnsContract::new();

            //　新しいアカウントをインスタンス化
            let alice_account_id = accounts().alice;

            // ↑用のプロフィールを作成
            astar_sns_contract.create_profile(alice_account_id);

            // プロフィール情報を設定
            astar_sns_contract.set_profile_info(
                alice_account_id,
                "Tony Stark".to_string(),
                "https//ff...".to_string(),
            );

            // ターミナルにプロフィール情報を出力
            debug_println!(
                "profile_list: {:?}",
                astar_sns_contract.profile_map.get(&alice_account_id).unwrap()
            );
        }
```

では下のコマンドをターミナルで実行してテストを行いましょう。

```
cargo test -- --nocapture
```

結果が下のようになっていれば成功です。

きちんとプロフィールの情報が入っていれば成功です。

[`test_profile_fn_works`]

```
running 1 test
profile_list: Profile { following_list: [], follower_list: [], user_id: AccountId([1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]), name: Some("Tony Stark"), img_url: Some("https//ff..."), message_list_id_list: [], post_id_list: [] }
test astar_sns_contract::tests::test_profile_fn_works ... ok

test result: ok. 1 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s
```

これと同じように他の関数についても結果を見ていきましょう。

投稿機能をテストします。

投稿に関する情報が格納できていれば成功です。

ちなみに関数内ではプロフィールが設定されていなければ名前が`unknown`となるようにしてあります。

[`test_post_release_fn_works`]

```
running 1 test
post :Post { name: "unknown", user_id: AccountId([1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]), created_time: "12:30", img_url: "https://sdfds...", description: "Today, it was so rainy!", num_of_likes: 0 }

test astar_sns_contract::tests::test_post_release_fn_works ... ok

test result: ok. 1 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s
```

次は投稿リスト全体から最新の投稿を取得できているかをテストします。

6つの投稿がされていいますが、`get_general_post関数`内では5つまでと指定してあるのでその通り5つの投稿しか返ってきていないはずです。このようになっていれば成功です。

[`test_general_post_get_fn_works`]

```
running 1 test
General post get test

Post { name: "Alice", user_id: AccountId([1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]), created_time: "12:55", img_url: "https://fasdfgeg...", description: "Do what you want", num_of_likes: 0 }

Post { name: "Alice", user_id: AccountId([1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]), created_time: "12:50", img_url: "https://fasee...", description: "Don't mention it!", num_of_likes: 0 }

Post { name: "Alice", user_id: AccountId([1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]), created_time: "12:45", img_url: "https://fsdfee...", description: "Oh baby, come on!", num_of_likes: 0 }

Post { name: "Alice", user_id: AccountId([1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]), created_time: "12:40", img_url: "https://fafds...", description: "Hello YouTube", num_of_likes: 0 }

Post { name: "Alice", user_id: AccountId([1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]), created_time: "12:35", img_url: "https://gsdef...", description: "I come to Thailand", num_of_likes: 0 }

test astar_sns_contract::tests::test_general_post_get_fn_works ... ok

test result: ok. 1 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s
```

次は個人の投稿を取得をテストします。

個人の投稿についてはそれぞれ指定したアカウントの投稿が取得できていれば成功です。

[`test_individual_post_get_fn_works`]

```
running 1 test
Individual post get test
Post { name: "Alice", user_id: AccountId([1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]), created_time: "12:30", img_url: "https://sdfds...", description: "Today, it was so rainy!", num_of_likes: 0 }
Post { name: "Alice", user_id: AccountId([1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]), created_time: "12:45", img_url: "https://fsdfee...", description: "Oh baby, come on!", num_of_likes: 0 }
Post { name: "Bob", user_id: AccountId([2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2]), created_time: "12:35", img_url: "https://gsdef...", description: "I come to Thailand", num_of_likes: 0 }
Post { name: "Bob", user_id: AccountId([2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2]), created_time: "12:50", img_url: "https://fasee...", description: "Don't mention it!", num_of_likes: 0 }
Post { name: "Charlie", user_id: AccountId([3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3]), created_time: "12:40", img_url: "https://fafds...", description: "Hello YouTube", num_of_likes: 0 }
Post { name: "Charlie", user_id: AccountId([3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3]), created_time: "12:55", img_url: "https://fasdfgeg...", description: "Do what you want", num_of_likes: 0 }
test astar_sns_contract::tests::test_individual_post_get_fn_works ... ok

test result: ok. 1 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s
```

次は指定した投稿に対していいねが追加できているかのテストをします。

個人の投稿についてはそれぞれ指定したアカウントの投稿が取得できていれば成功です。

[`test_add_likes_fn_works`]

```
running 1 test
Number of likes: 1
Number of likes: 2
test astar_sns_contract::tests::test_add_likes_fn_works ... ok

test result: ok. 1 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s
```

次はフォロー機能をテストしましょう。

相互フォローしてもmessage_list_map_counterが増えていなければ成功です。

[`test_follow_fn_works`]

```
running 1 test
message_list_map_counter: 0
following_list: [AccountId([2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2])]
follower_list: [AccountId([1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1])]
message_list_map_id: 1
message_list_map_counter: 1
message_list_map_counter: 1
following_list: [AccountId([2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2]), AccountId([2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2]), AccountId([3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3])]
follower_list: [AccountId([1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1])]
message_list_map_counter: 2
test astar_sns_contract::tests::test_follow_fn_works ... ok

test result: ok. 1 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s
```

次はメッセージ機能をテストしていきましょう。

それぞれのメッセージリストidごとのメッセージリストとラストメッセージを取得できていれば成功です。

[`test_message_fn_works`]

```
running 1 test
message_list_alice_bob: [Message { message: "Sorry Bro, I can't go today.", sender_id: AccountId([1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]), created_time: "12:30" }, Message { message: "Why don't we go there tomorrow?", sender_id: AccountId([1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]), created_time: "12:33" }, Message { message: "Hey, charlie will come!", sender_id: AccountId([1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]), created_time: "12:35" }, Message { message: "He seems so muscular, so he would teach us.", sender_id: AccountId([1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]), created_time: "12:36" }, Message { message: "Why don't we go there tomorrow?", sender_id: AccountId([1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]), created_time: "12:37" }]

last_message_alice_bob: Message { message: "I'm so looking forward that!", sender_id: AccountId([2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2]), created_time: "12:38" }

message_list_alice_charlie: [Message { message: "Hey bro! Tomorrow I and Bob go to gym. Don't you join us?", sender_id: AccountId([1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]), created_time: "12:34" }]
test astar_sns_contract::tests::test_message_fn_works ... ok

test result: ok. 1 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s
```

最後にFT機能のテストです。ここでは`transfer機能`,`balanceOf機能`, `distribute機能`がきちんと動いているかを見てみます。

[`FT_fn_works`]

```
running 1 test
alice_asset:50
bob_asset:200
charlie_asset:50
test astar_sns_contract::tests::FT_fn_works ... ok

test result: ok. 1 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s
```

お疲れ様です！ これでテストは完了しました！

しかしこれはあくまでコード上で完成しただけで、実際にコントラクト上で動くwasmファイルとmetadata.jsonファイルは修正されていません 😥

なのでここでsection-0 lesson-1で行ったように下のコマンドを実行してこの2つのファイルを更新していきましょう！

```
cargo contract build
```

このようなメッセージが返ってきていればOKです！

```
  - astar_sns_contract.contract (code + metadata)
  - astar_sns_contract.wasm (the contract's code)
  - metadata.json (the contract's metadata)
```

最後に、後でデプロイに使用するためにウォレットを作成する必要があるためウォレットを作成しましょう。

[こちら](https://chrome.google.com/webstore/detail/polkadot%7Bjs%7D-extension/mopnmbcafieddcagagdcbnhejhlodfdd)から`Google Chrome`の拡張機能として`polkadot,js`をインストールしましょう。

ほとんどmetamaskと同じような手順で新しいウォレットを作成できますが、不安な方は[こちら](https://meddoctorlife.com/polkadotjs/1397/)を参考にしながら作成してみてください。chainは特定のものを選択する必要はありません。

下の画像のように`extention`としてアドレスが`Polkadot.js`で認識されていればOKです！

![](/public/images/ASTAR-SocialFi/section-1/1_1_1.png)

コントラクトの作成が終わりました。

わからないことがあれば、Discordの`#astar`でsection・Lesson名とともに質問をしてください 👋

### 🙋‍♂️ 質問する

---

次のセクションではではフロントを実装しましょう！ 🎉
