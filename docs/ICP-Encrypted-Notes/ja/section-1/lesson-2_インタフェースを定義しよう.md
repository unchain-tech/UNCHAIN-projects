### 🤝 インタフェースを定義しよう

実装した機能をフロントエンドから呼び出す前に、インタフェースを定義する必要があります。ICPでは、キャニスターのインタフェースはCandidという言語で記述します。

#### Candidとは

Candidは、サービスのパブリック・インタフェースを記述することを主な目的としたインタフェース記述言語です。Candidの主な利点のひとつは、言語にとらわれず、[Motoko](https://internetcomputer.org/docs/current/motoko/main/about-this-guide)、Rust、JavaScriptなどの異なるプログラミング言語で書かれたサービスとフロントエンド間の相互運用を可能にすることです。詳細は[こちら](https://internetcomputer.org/docs/current/developer-docs/backend/candid/candid-concepts)をご覧ください。

Motokoでキャニスターを記述した場合、プログラムをコンパイルする際にコンパイラが自動的にCandidで記述されたファイル`.did`を生成してくれます。しかし、Rustでは2023年9月時点でそのような機能は組み込まれておらず、Candidインタフェースを自動生成するためには設定が必要です。

まずは、`src/encrypted_notes/backend/lib.rs`を更新します。`export_candid`マクロをインポートして、ファイルの一番下に追加してください。

```rust
use ic_cdk_macros::{export_candid, query, update};

...

// ===== ファイルの一番下に定義してください。 =====
// .didファイルを生成します。
export_candid!();
```

次に、[candid-extractor](https://crates.io/crates/candid-extractor)をインストールします。これは、Rustファイルをコンパイルした際に生成されるWASMファイルから、Candidの定義を抽出するCLIツールです。

```
cargo install candid-extractor
```

最後に、Candidファイルを生成するためのスクリプトを追加します。プロジェクトのルートディレクトに`scripts`ディレクトリを作成し、その中に`did.sh`というファイルを作成してください。

```diff
 ICP-Encrypted-Notes/
+├── scripts/
+│   └── did.sh
 ├── src/
 ├── dfx.json
 ├── LICENSE
 ├── README.md
 └── dfx.json
```

`did.sh`に、下記を記述してください。先ほどインストールしたcandid-extractorを使用して、WASMファイルからCandidインタフェースを生成するスクリプトとなります。

```
#!/bin/bash

function generate_did() {
  local canister=$1
  canister_root="src/$canister"

  cargo build --manifest-path="$canister_root/Cargo.toml" \
      --target wasm32-unknown-unknown \
      --release --package "$canister"

  candid-extractor "target/wasm32-unknown-unknown/release/$canister.wasm" > "$canister_root/$canister.did"
}

# The list of canisters of your project
CANISTERS=encrypted_notes_backend

for canister in $(echo $CANISTERS | sed "s/,/ /g")
do
    generate_did "$canister"
done
```

これで、Candidインタフェースを自動生成する準備ができました！ それでは、実際に生成してみましょう。下記のコマンドをプロジェクトのルートディレクトリで実行してください。

```
npm run generate:did
```

`src/encrypted_notes_backend/encrypted_notes_backend.did`を確認してみましょう。

```javascript
type EncryptedNote = record { id : nat; data : text };
service : {
  addNote : (text) -> ();
  deleteNote : (nat) -> ();
  getNotes : () -> (vec EncryptedNote) query;
  updateNote : (EncryptedNote) -> ();
};
```

`type`から始まる部分は、バックエンドキャニスターで定義した**型**が記述されています。`service`から始まる部分は、バックエンドキャニスターの**関数**が記述されます。関数は`"関数名": (引数の型) -> (戻り値の型)`という形式となり、引数や戻り値がない場合は、`()`を指定します。型は、Candidがサポートする型となります（例：RustのString型はtextを指定）。型に関する詳細は、[こちら](https://internetcomputer.org/docs/current/references/candid-ref)をご覧ください。

### 📝 テストスクリプトの作成

インタフェースが定義されたので、前回のレッスンで実装したバックエンドキャニスターの関数が正しく動作するかを確認するためのテストスクリプトを作成します。

`scripts/`の中に`test.sh`というファイルを作成してください。

```diff
 ICP-Encrypted-Notes/
 ├── scripts/
 │   ├── did.sh
+│   └── test.sh
 ├── src/
 ├── dfx.json
 ├── LICENSE
 ├── README.md
 └── dfx.json
```

`test.sh`に、下記を記述してください。

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

# テストで使用するユーザーを作成する
dfx identity new test-user --storage-mode=plaintext || true
dfx identity use test-user

# キャニスターのデプロイ
dfx deploy encrypted_notes_backend

# ===== テスト =====
FUNCTION='addNote'
echo -e "\n===== $FUNCTION ====="
EXPECT='()'
RESULT=`dfx canister call encrypted_notes_backend $FUNCTION '("First text!")'`
compare_result "Return none" "$EXPECT" "$RESULT" || TEST_STATUS=1

FUNCTION='getNotes'
echo -e "\n===== $FUNCTION ====="
EXPECT='(vec { record { id = 0 : nat; data = "First text!" } })'
RESULT=`dfx canister call encrypted_notes_backend $FUNCTION`
compare_result "Return note list" "$EXPECT" "$RESULT" || TEST_STATUS=1

FUNCTION='updateNote'
echo -e "\n===== $FUNCTION ====="
EXPECT='()'
RESULT=`dfx canister call encrypted_notes_backend $FUNCTION '(
  record {
    id = 0;
    data = "Updated first text!"
  }
)'`
compare_result "Return none" "$EXPECT" "$RESULT" || TEST_STATUS=1
# 確認
FUNCTION='getNotes'
EXPECT='(vec { record { id = 0 : nat; data = "Updated first text!" } })'
RESULT=`dfx canister call encrypted_notes_backend $FUNCTION`
compare_result "Check with $FUNCTION" "$EXPECT" "$RESULT" || TEST_STATUS=1

FUNCTION='deleteNote'
echo -e "\n===== $FUNCTION ====="
EXPECT='()'
RESULT=`dfx canister call encrypted_notes_backend $FUNCTION '(0)'`
compare_result "Return none" "$EXPECT" "$RESULT" || TEST_STATUS=1
# 確認
FUNCTION='getNotes'
EXPECT='(vec {})'
RESULT=`dfx canister call encrypted_notes_backend $FUNCTION`
compare_result "Check with $FUNCTION" "$EXPECT" "$RESULT" || TEST_STATUS=1

# ===== 後始末 =====
dfx identity use default
dfx identity remove test-user
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

テストスクリプトの内容を簡単に確認していきましょう。

キャニスター実行環境を立ち上げて、encrypted_notes_backendをデプロイします。テストで使用するユーザーを`dfx identity new`で作成することができます。

```
# ===== 準備 =====
dfx stop
rm -rf .dfx
dfx start --clean --background

# テストで使用するユーザーを作成する
dfx identity new test-user --storage-mode=plaintext || true
dfx identity use test-user

# キャニスターのデプロイ
dfx deploy encrypted_notes_backend
```

`dfx canister call`でencrypted_notes_backendキャニスターの関数を呼び出します。関数の実行結果（`RESULT`）と期待する値（`EXPECT`）をcompare_resultに渡します。

```
# ===== テスト =====
FUNCTION='addNote'
echo -e "\n===== $FUNCTION ====="
EXPECT='()'
RESULT=`dfx canister call encrypted_notes_backend $FUNCTION '("First text!")'`
compare_result "Return none" "$EXPECT" "$RESULT" || TEST_STATUS=1

...

```

テストスクリプトの上部に定義されている`compare_result()`は、関数の戻り値と期待する値を比較して一致しているかどうかを確認します。一致している場合は`OK`を出力して`0`を返します。一致していない場合は`ERR`と差分を表示して`1`を返します。

```
# scripts/test.sh
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
```

compare_resultを呼び出す部分で、`compare_result "Return ..." "$EXPECT" "$RESULT" || TEST_STATUS=1`と定義していました。これは、compare_resultの戻り値が`0`でない場合（つまり、実行結果と期待値が一致していない場合）には`TEST_STATUS`へ`1`を代入するという意味です。`TEST_STATUS`は、テストの結果を格納する変数です。初期値は`0`で、テストがすべて成功した場合は`0`、失敗した場合は`1`が格納されます。

最後に、テスト用に作成したidentityを削除してテスト結果を出力します。`TEST_STATUS`が`0`の場合は`PASS`、`1`の場合は`FAIL`が出力されます。

```
# ===== 後始末 =====
dfx identity use default
dfx identity remove test-user
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

それではテストスクリプトを実行してみましょう。

```
npm run test
```

全てのテストにパスし、最後に`"PASS"`が出力されたら成功です。

```
# デプロイに関する出力...

===== addNote =====
Return none: OK

===== getNotes =====
Return note list: OK

===== updateNote =====
Return none: OK
Check with getNotes: OK

===== deleteNote =====
Return none: OK
Check with getNotes: OK

# 後始末に関する出力...

===== Result =====
"PASS"
```

バックエンドキャニスターに定義した関数が問題なく機能することを確認できました！

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

次のレッスンに進み、フロントエンドキャニスターに認証機能を実装しましょう！
