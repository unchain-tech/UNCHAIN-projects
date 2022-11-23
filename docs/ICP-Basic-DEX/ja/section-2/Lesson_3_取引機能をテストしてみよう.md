### ✅ 取引機能をテストしてみよう

それでは、前回のレッスンで実装した取引機能をテストしてみたいと思います。現在`test.sh`に記載している`# ===== TEST withdraw =====`からの部分を、以下の内容で上書きしてください。

[test.sh]

```bash
# ===== TEST trading =====
echo -e '\n\n#------ trading ------------'
# オーダーを出すユーザーに切り替え
dfx identity use user1
echo -n "placeOrder  >  " \
  && dfx canister call icp_basic_dex_backend placeOrder '(principal '\"$GoldDIP20_PRINCIPAL\"', 100, principal '\"$SilverDIP20_PRINCIPAL\"', 100)'
echo -n "getOrders   >  " \
  && dfx canister call icp_basic_dex_backend getOrders

echo -e '#----- trading (check { Err = variant { OrderBookFull } } -----'
dfx canister call icp_basic_dex_backend placeOrder '(principal '\"$GoldDIP20_PRINCIPAL\"', 100, principal '\"$SilverDIP20_PRINCIPAL\"', 100)'

# オーダーを購入するユーザーに切り替え
echo -e
dfx identity use user2
dfx canister call icp_basic_dex_backend placeOrder '(principal '\"$SilverDIP20_PRINCIPAL\"', 100, principal '\"$GoldDIP20_PRINCIPAL\"', 100)'
# 取引が成立してオーダーが削除されていることを確認
echo -n "getOrders   >  " \
  && dfx canister call icp_basic_dex_backend getOrders

# トレード後のユーザー残高を確認
echo -n "getBalance(user2, G)  >  " \
  && dfx canister call icp_basic_dex_backend getBalance '(principal '\"$USER2_PRINCIPAL\"', principal '\"$GoldDIP20_PRINCIPAL\"')'
echo -n "getBalance(user2, S)  >  " \
  && dfx canister call icp_basic_dex_backend getBalance '(principal '\"$USER2_PRINCIPAL\"', principal '\"$SilverDIP20_PRINCIPAL\"')'

echo -e
dfx identity use user1
echo -n "getBalance(user1, G)  >  " \
  && dfx canister call icp_basic_dex_backend getBalance '(principal '\"$USER1_PRINCIPAL\"', principal '\"$GoldDIP20_PRINCIPAL\"')'
echo -n "getBalance(user1, S)  >  " \
  && dfx canister call icp_basic_dex_backend getBalance '(principal '\"$USER1_PRINCIPAL\"', principal '\"$SilverDIP20_PRINCIPAL\"')'

# ===== TEST withdraw =====
echo -e '\n\n#------ withdraw & delete order ------'
dfx canister call icp_basic_dex_backend placeOrder '(principal '\"$GoldDIP20_PRINCIPAL\"', 500, principal '\"$SilverDIP20_PRINCIPAL\"', 500)'
echo -n "getOrders   >  " \
  && dfx canister call icp_basic_dex_backend getOrders
dfx identity use user1
echo -n "withdraw    >  " \
  && dfx canister call icp_basic_dex_backend withdraw '(principal '\"$GoldDIP20_PRINCIPAL\"', 500)'
echo -n "getOrders   >  " \
  && dfx canister call icp_basic_dex_backend getOrders

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

取引を行うテストを追加しました。また、DEX内のユーザー残高が出金操作で減少した際に、オーダーがきちんと削除されることを確認するテストを`# ===== TEST withdraw =====`に追加しています。

それでは実行してみましょう。

[Terminal A]

```bash
# control+C
^C
rm -rf .dfx
```

実行環境を起動します。

```bash
dfx start --clean
```

[Terminal B]

別のターミナルでテストを実行します。

```bash
bash ./scripts/test.sh
```

実行結果を確認してみましょう。`#------ trading ------------`以降に注目してください。

[Terminal B]

```bash
#------ trading ------------
Using identity: "user1".
placeOrder  >  (
  variant {
    Ok = opt record {
      id = 1 : nat32;
      to = principal "r7inp-6aaaa-aaaaa-aaabq-cai";
      fromAmount = 100 : nat;
      owner = principal "267ch-vdug5-e5w5l-fn4jl-2cv54-yh6fj-eqqgs-nxnjl-uz57r-7k7av-mqe";
      from = principal "rrkah-fqaaa-aaaaa-aaaaq-cai";
      toAmount = 100 : nat;
    }
  },
)
getOrders   >  (
  vec {
    record {
      id = 1 : nat32;
      to = principal "r7inp-6aaaa-aaaaa-aaabq-cai";
      fromAmount = 100 : nat;
      owner = principal "267ch-vdug5-e5w5l-fn4jl-2cv54-yh6fj-eqqgs-nxnjl-uz57r-7k7av-mqe";
      from = principal "rrkah-fqaaa-aaaaa-aaaaq-cai";
      toAmount = 100 : nat;
    };
  },
)
#----- trading (check { Err = variant { OrderBookFull } } -----
(variant { Err = variant { OrderBookFull } })

Using identity: "user2".
(variant { Ok = null })
getOrders   >  (vec {})
getBalance(user2, G)  >  (100 : nat)
getBalance(user2, S)  >  (900 : nat)

Using identity: "user1".
getBalance(user1, G)  >  (900 : nat)
getBalance(user1, S)  >  (100 : nat)
```

user1が作成したオーダーをuser2が購入するシナリオです。取引が成立した後、それぞれの残高が更新されていることを確認することができます。

また、user1がオーダーを作成した交換元のトークンと同じトークンで再度オーダーを作成しようとすると、エラーが出ていることが確認できます。

次に、`#------ withdraw & delete order ------`以降を確認してみましょう。user1がオーダーを作成した後に、出金操作を行なっています。その結果、提出しているオーダーに対してDEX内のuser1のトークン残高が不足したためオーダーが削除されていることがわかります。

```bash
#------ withdraw & delete order ------
(
  variant {
    Ok = opt record {
      id = 3 : nat32;
      to = principal "r7inp-6aaaa-aaaaa-aaabq-cai";
      fromAmount = 500 : nat;
      owner = principal "267ch-vdug5-e5w5l-fn4jl-2cv54-yh6fj-eqqgs-nxnjl-uz57r-7k7av-mqe";
      from = principal "rrkah-fqaaa-aaaaa-aaaaq-cai";
      toAmount = 500 : nat;
    }
  },
)
getOrders   >  (
  vec {
    record {
      id = 3 : nat32;
      to = principal "r7inp-6aaaa-aaaaa-aaabq-cai";
      fromAmount = 500 : nat;
      owner = principal "267ch-vdug5-e5w5l-fn4jl-2cv54-yh6fj-eqqgs-nxnjl-uz57r-7k7av-mqe";
      from = principal "rrkah-fqaaa-aaaaa-aaaaq-cai";
      toAmount = 500 : nat;
    };
  },
)
Using identity: "user1".
withdraw    >  (variant { Ok = 500 : nat })
getOrders   >  (vec {})
balanceOf   >  (500 : nat)
DEX balanceOf>  (2_500 : nat)
#----- withdraw (check { Err = variant { BalanceLow } } -----
(variant { Err = variant { BalanceLow } })
```

お疲れ様でした！
これでバックエンドの機能が実装できました！

### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discordの`#icp-basic-dex`で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の4点を記載してください ✨

```
1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット
```

---

次のレッスンに進んで、フロントエンドの環境構築を行いましょう 🎉
