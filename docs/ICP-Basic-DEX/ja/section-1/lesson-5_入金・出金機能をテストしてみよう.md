### ✅ 入金・出金機能をテストしてみよう

テストを行うために、Lesson2で作成した`test.sh`ファイルを更新したいと思います。`./scripts/test.sh`ファイルの中を以下のコードに書き換えてください。

[test.sh]

```
#!/bin/bash

compare_result() {
    local label=$1
    local expect=$2
    local result=$3

    if [ "$expect" = "$result" ]; then
        echo "$label: OK"
        return 0
    else
        echo "$label: ERR"
        diff <(echo $expect) <(echo $result)
        return 1
    fi
}

TEST_STATUS=0

# ===== 準備 =====
dfx stop
rm -rf .dfx
dfx start --clean --background

# ユーザーの準備
dfx identity use default
export ROOT_PRINCIPAL=$(dfx identity get-principal)

# `||（OR演算子）`：左側のコマンドが失敗（終了ステータス0以外）した場合、右側のコマンドが実行される
## 既にuser1が存在する場合、`dfx identity new user1`コマンドは実行エラーとなってしまうので、対策として`|| true`を使用
dfx identity new user1 --storage-mode=plaintext || true
dfx identity use user1
export USER1_PRINCIPAL=$(dfx identity get-principal)

dfx identity new user2 --storage-mode=plaintext || true
dfx identity use user2
export USER2_PRINCIPAL=$(dfx identity get-principal)

dfx identity use default

# Tokenキャニスターの準備
dfx deploy GoldDIP20 --argument='("Token Gold Logo", "Token Silver", "TGLD", 8, 10_000_000_000_000_000, principal '\"$ROOT_PRINCIPAL\"', 0)'
dfx deploy SilverDIP20 --argument='("Token Silver Logo", "Token Silver", "TSLV", 8, 10_000_000_000_000_000, principal '\"$ROOT_PRINCIPAL\"', 0)'
export GoldDIP20_PRINCIPAL=$(dfx canister id GoldDIP20)
export SilverDIP20_PRINCIPAL=$(dfx canister id SilverDIP20)

# Faucetキャニスターの準備
dfx deploy faucet
export FAUCET_PRINCIPAL=$(dfx canister id faucet)

## トークンをfaucetキャニスターにプールする
dfx canister call GoldDIP20 mint '(principal '\"$FAUCET_PRINCIPAL\"', 100_000)'
dfx canister call SilverDIP20 mint '(principal '\"$FAUCET_PRINCIPAL\"', 100_000)'

# icp_basic_dex_backendキャニスターの準備
dfx deploy icp_basic_dex_backend
export DEX_PRINCIPAL=$(dfx canister id icp_basic_dex_backend)

dfx identity use user1

# ===== テスト =====
# user1がトークンを取得する
echo '===== getToken ====='
EXPECT="(variant { Ok = 1_000 : nat })"
RESULT=`dfx canister call faucet getToken '(principal '\"$GoldDIP20_PRINCIPAL\"')'`
compare_result "return 1_000" "$EXPECT" "$RESULT" || TEST_STATUS=1

EXPECT="(variant { Err = variant { AlreadyGiven } })"
RESULT=`dfx canister call faucet getToken '(principal '\"$GoldDIP20_PRINCIPAL\"')'`
compare_result "return Err AlreadyGiven" "$EXPECT" "$RESULT" || TEST_STATUS=1

echo '===== deposit ====='
# approveをコールして、DEXがuser1の代わりにdepositすることを許可する
dfx canister call GoldDIP20 approve '(principal '\"$DEX_PRINCIPAL\"', 1_000)' > /dev/null
EXPECT="(variant { Ok = 1_000 : nat })"
RESULT=`dfx canister call icp_basic_dex_backend deposit '(principal '\"$GoldDIP20_PRINCIPAL\"')'`
compare_result "return 1_000" "$EXPECT" "$RESULT" || TEST_STATUS=1

EXPECT="(variant { Err = variant { BalanceLow } })"
RESULT=`dfx canister call icp_basic_dex_backend deposit '(principal '\"$GoldDIP20_PRINCIPAL\"')'`
compare_result "return Err BalanceLow" "$EXPECT" "$RESULT" || TEST_STATUS=1

echo '===== withdraw ====='
EXPECT="(variant { Ok = 500 : nat })"
RESULT=`dfx canister call icp_basic_dex_backend withdraw '(principal '\"$GoldDIP20_PRINCIPAL\"', 500)'`
compare_result "return 500" "$EXPECT" "$RESULT" || TEST_STATUS=1

EXPECT="(variant { Err = variant { BalanceLow } })"
RESULT=`dfx canister call icp_basic_dex_backend withdraw '(principal '\"$GoldDIP20_PRINCIPAL\"', 1000)'`
compare_result "return Err BalanceLow" "$EXPECT" "$RESULT" || TEST_STATUS=1

# ===== 後始末 =====
dfx identity use default
dfx identity remove user1
dfx identity remove user2
dfx stop

# ===== テスト結果の確認 =====
echo '===== Result ====='
if [ $TEST_STATUS -eq 0 ]; then
  echo '"PASS"'
  exit 0
else
  echo '"FAIL"'
  exit 1
fi
```

新たに入金・出金をコールするテストを追加しました。それでは、実行してみましょう。

```
bash ./scripts/test.sh
```

`deposit`と`withdraw`の結果を見てみましょう。

```
# キャニスターデプロイの出力結果は省略しています...

Using identity: "user1".
===== getToken =====
return 1_000: OK
return Err AlreadyGiven: OK
===== deposit =====
return 1_000: OK
return Err BalanceLow: OK
===== withdraw =====
return 500: OK
return Err BalanceLow: OK
Using identity: "default".
Removed identity "user1".
Removed identity "user2".
Using the default definition for the 'local' shared network because /任意のパス/.config/dfx/networks.json does not exist.
Stopping canister http adapter...
Stopped.
Stopping the replica...
Stopped.
Stopping icx-proxy...
Stopped.
===== Result =====
"PASS"
```

各テストに通過し、期待する結果が得られていることを確認しましょう。

ここまでで、入金・出金機能のテストは完了です！

### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discordの`#icp`で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の4点を記載してください ✨

```
1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット
```

---

次のレッスンに進んで、ユーザー間でトークンを取引する機能を実装していきましょう 🎉
