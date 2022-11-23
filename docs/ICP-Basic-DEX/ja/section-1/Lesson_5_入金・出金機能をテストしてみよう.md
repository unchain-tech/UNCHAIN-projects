### ✅ 入金・出金機能をテストしてみよう

テストを行うために、Lesson2で作成した`test.sh`ファイルを更新したいと思います。`./scripts/test.sh`ファイルの中を以下のコードに書き換えてください。

[test.sh]

```bash
#!/bin/bash

dfx identity use default

export ROOT_PRINCIPAL=$(dfx identity get-principal)

# ===== CREATE demo user =====
dfx identity new --disable-encryption user1
dfx identity use user1
export USER1_PRINCIPAL=$(dfx identity get-principal)

dfx identity new --disable-encryption user2
dfx identity use user2
export USER2_PRINCIPAL=$(dfx identity get-principal)

# Set default user
dfx identity use default

# ===== SETUP Token Canister =====
dfx deploy GoldDIP20 --argument='("Token Gold Logo", "Token Silver", "TGLD", 8, 10_000_000_000_000_000, principal '\"$ROOT_PRINCIPAL\"', 0)'
dfx deploy SilverDIP20 --argument='("Token Silver Logo", "Token Silver", "TSLV", 8, 10_000_000_000_000_000, principal '\"$ROOT_PRINCIPAL\"', 0)'

export GoldDIP20_PRINCIPAL=$(dfx canister id GoldDIP20)
export SilverDIP20_PRINCIPAL=$(dfx canister id SilverDIP20)

# ===== SETUP faucet Canister =====
dfx deploy faucet
export FAUCET_PRINCIPAL=$(dfx canister id faucet)

# Pooling tokens
dfx canister call GoldDIP20 mint '(principal '\"$FAUCET_PRINCIPAL\"', 100_000)'
dfx canister call SilverDIP20 mint '(principal '\"$FAUCET_PRINCIPAL\"', 100_000)'

# ===== SETUP icp_basic_dex_backend
dfx deploy icp_basic_dex_backend
export DEX_PRINCIPAL=$(dfx canister id icp_basic_dex_backend)

# ===== TEST faucet =====
echo -e '\n\n#------ faucet ------------'
dfx identity use user1
echo -n "getToken    >  " \
  && dfx canister call faucet getToken '(principal '\"$GoldDIP20_PRINCIPAL\"')'
echo -n "balanceOf   >  " \
  && dfx canister call GoldDIP20 balanceOf '(principal '\"$USER1_PRINCIPAL\"')'

echo -e '#------ faucet { Err = variant { AlreadyGiven } } ------------'
dfx canister call faucet getToken '(principal '\"$GoldDIP20_PRINCIPAL\"')'

echo -e
dfx identity use user2
echo -n "getTOken    >  " \
  && dfx canister call faucet getToken '(principal '\"$SilverDIP20_PRINCIPAL\"')'
echo -n "balanceOf   >  " \
  && dfx canister call SilverDIP20 balanceOf '(principal '\"$USER2_PRINCIPAL\"')'

# ===== TEST deposit =====
echo -e '\n\n#------ deposit ------------'
dfx identity use user1
# approveをコールして、DEXがユーザーの代わりにdepositすることを許可する
dfx canister call GoldDIP20 approve '(principal '\"$DEX_PRINCIPAL\"', 1_000)'
echo -n "deposit     >  " \
  && dfx canister call icp_basic_dex_backend deposit '(principal '\"$GoldDIP20_PRINCIPAL\"')'
# user1がDEXに預けたトークンのデータを確認
echo -n "getBalance  >  " \
  && dfx canister call icp_basic_dex_backend getBalance '(principal '\"$USER1_PRINCIPAL\"', principal '\"$GoldDIP20_PRINCIPAL\"')'

# depositをコールするuser2に切り替え
echo -e
dfx identity use user2
dfx canister call SilverDIP20 approve '(principal '\"$DEX_PRINCIPAL\"', 1_000)'
echo -n "deposit     >  " \
  && dfx canister call icp_basic_dex_backend deposit '(principal '\"$SilverDIP20_PRINCIPAL\"')'
echo -n "getBalance  >  " \
  && dfx canister call icp_basic_dex_backend getBalance '(principal '\"$USER2_PRINCIPAL\"', principal '\"$SilverDIP20_PRINCIPAL\"')'

# ===== TEST withdraw =====
echo -e '\n\n#------ withdraw ------'
# withdrawをコールするuser1に切り替え
dfx identity use user1
echo -n "withdraw    >  " \
  && dfx canister call icp_basic_dex_backend withdraw '(principal '\"$GoldDIP20_PRINCIPAL\"', 500)'

# user1の残高チェック
echo -n "balanceOf   >  " \
  && dfx canister call GoldDIP20 balanceOf '(principal '\"$USER1_PRINCIPAL\"')'

# DEXの残高チェック
echo -n "DEX balanceOf>  " \
  && dfx canister call GoldDIP20 balanceOf '(principal '\"$DEX_PRINCIPAL\"')'

echo -e '#----- withdraw (check { Err = variant { BalanceLow } } -----'
dfx canister call icp_basic_dex_backend withdraw '(principal '\"$GoldDIP20_PRINCIPAL\"', 1000)'

# ===== 後始末 =====
echo -e '\n\n#------ clean user ------'
dfx identity use default
dfx identity remove user1
dfx identity remove user2
```

新たに入金・出金をコールするテストを追加しました。それでは、実行してみましょう。前回のテストと同様に手順は一緒で、ターミナルを2つ使用します。

[Terminal A]

まずは、リセットされた状態を作ります。`control + C`(または[Terminal B]で`dfx stop`コマンド)を実行して一度環境を停止し、`.dfx`ディレクトリを削除します。

```bash
# control+C
^C
rm -rf .dfx
```

つぎに、実行環境を起動します。

```bash
dfx start --clean
```

[Terminal B]

別のターミナルでテストを実行します。

```bash
bash ./scripts/test.sh
```

`deposit`と`withdraw`の結果を見てみましょう。

[Terminal B]

```bash
#------ deposit ------------
Using identity: "user1".
(variant { Ok = 8 : nat })
deposit     >  (variant { Ok = 1_000 : nat })
getBalance  >  (1_000 : nat)
------ deposit { Err = variant { BalanceLow } } ------------
(variant { Err = variant { BalanceLow } })

Using identity: "user2".
(variant { Ok = 8 : nat })
deposit     >  (variant { Ok = 1_000 : nat })
getBalance  >  (1_000 : nat)


#------ withdraw ------
Using identity: "user1".
withdraw    >  (variant { Ok = 500 : nat })
balanceOf   >  (500 : nat)
DEX balanceOf>  (1_500 : nat)
#----- withdraw (check { Err = variant { BalanceLow } } -----
(variant { Err = variant { BalanceLow } })
```

`approve`関数でユーザーが許可をした`1_000`トークンが入金されていることと、出金後にトークンの残高が更新されていることがわかります。また、エラーがきちんと出ていることも確認しましょう。

ここまでで、入金・出金機能のテストは完了です！

### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discordの`#icp-dex`で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の4点を記載してください ✨

```
1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット
```

---

次のレッスンに進んで、ユーザー間でトークンを取引する機能を実装していきましょう 🎉
