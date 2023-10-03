### 🚰 Faucet 機能を実装しよう

このプロジェクトでは、DEX上で扱うオリジナルのトークンをユーザー自身が簡単に取得できるように、便宜上Faucet機能をつけたいと思います。

まずは、Faucetの役割をするキャニスターを作成します。作成後、DIP20キャニスターとFaucetキャニスターをデプロイしてDIP20キャニスターの`mint`メソッドをコールします。Faucetキャニスターに対しミントを行うことで、一定量のトークンを保持させます。

Faucetキャニスター自身の機能としては以下になります。

- ユーザーにトークンを転送する
- トークンを渡したユーザーのデータを保持する

データを保持する目的としては、トークンの配布を一人のユーザーに対し一度だけと制限するためです。

それでは、実装していきましょう。まずは、Faucetキャニスターのコードを置く`faucet`ディレクトリを作成して、中に2つのファイル`main.mo`と`types.mo`作成します。`src`ディレクトリのフォルダ構成を以下のように更新しましょう。

```diff
src/
 ├── DIP20/
 ├── declarations/
+├── faucet/
+│   ├── main.mo
+│   └── types.mo
 ├── icp_basic_dex_backend/
 └── icp_basic_dex_frontend/
```

では、実際にコードを書いていきます。

Motokoでは、モジュール間で共通して使用したいユーザー定義の型や、別のキャニスターのメソッドを呼び出すためのインタフェースを特定のファイルにまとめて定義し、インポートして使用する方法が一般的にとられます。まずは、`types.mo`ファイルにDIP20キャニスターから呼び出したいメソッドやfaucetキャニスターが使用するユーザー定義の型を記述します。

以下のコードを、`faucet/types.mo`に記述します。

[types.mo]

```javascript
module {

  // ===== DIP20 TOKEN INTERFACE =====
  public type TxReceipt = {
    #Ok : Nat;
    #Err : {
      #InsufficientAllowance;
      #InsufficientBalance;
      #ErrorOperationStyle;
      #Unauthorized;
      #LedgerTrap;
      #ErrorTo;
      #Other : Text;
      #BlockUsed;
      #AmountTooSmall;
    };
  };

  public type DIPInterface = actor {
    balanceOf : (who : Principal) -> async Nat;
    transfer : (to : Principal, value : Nat) -> async TxReceipt;
  };

  // ===== FAUCET =====
  public type FaucetReceipt = {
    #Ok : Nat;
    #Err : {
      #AlreadyGiven;
      #FaucetFailure;
      #InsufficientToken;
    };
  };
};

```

コードを確認します。

`module{}`の中に、3つの型を定義しました。1つ目の`type TxReceipt`は、DIP20キャニスターが使用している型です。この型は、後述している2つ目の`type DIPInterface`の中で戻り値の型として使用されています。

`type DIPInterface`には、DIP20キャニスターからコールしたい関数を定義しています。

`[ 関数名 ] : [ (引数) ] -> [ 戻り値 ]`という形式で記述します。

```javascript
public type DIPInterface = actor {
  balanceOf : (who : Principal) -> async Nat;
  transfer : (to : Principal, value : Nat) -> async TxReceipt;
};
```

3つ目の`type FaucetReceipt`は、faucetキャニスターが使用する型になります。

次に、`main.mo`ファイルにFaucetキャニスターのコードを記述しましょう。まずは、必要なライブラリのインポートとデータを定義します。

[main.mo]

```javascript
import Array "mo:base/Array";
import Buffer "mo:base/Buffer";
import HashMap "mo:base/HashMap";
import Principal "mo:base/Principal";

import T "types";

shared (msg) actor class Faucet() = this {
  private type Token = Principal;

  private let FAUCET_AMOUNT : Nat = 1_000;

  // ユーザーとトークンをマッピング
  // トークンは、複数を想定して配列にする
  private var faucet_book = HashMap.HashMap<Principal, [Token]>(
    10,
    Principal.equal,
    Principal.hash,
  );
}
```

コードを見ていきましょう。

最初に、型のライブラリをインポートしています。Motokoでは、型が持つ関数を使用したいときにはインポートする必要があります。`mo:base`は、Motokoの[ベースライブラリ](https://github.com/dfinity/motoko-base)を指しています。

`Principal`型とは、ICP上でユーザーとキャニスターに付与されるIDを示す型です。

最後のインポート文は、先ほど実装した`types.mo`を`faucet.mo`内で使用するためのものです。

```javascript
import Array "mo:base/Array";
import Buffer "mo:base/Buffer";
import HashMap "mo:base/HashMap";
import Principal "mo:base/Principal";

import T "types";
```

次に、`Faucet`を定義しています。

最初に、内部で使用する型を定義しています。`Principal`型は先ほど紹介したように、ユーザーだけではなくキャニスターにも割り振られます。そのため、コード内でユーザーとDIP20キャニスター（トークンキャニスター）を区別しやすいように`Token`という別名をつけています。

```javascript
shared (msg) actor class Faucet() = this {
  private type Token = Principal;
```

次に、ユーザー一人に渡すトークンの量を定義しています。Motokoでは、`let`キーワードが不変（イミュータブル）、`var`キーワードが可変（ミュータブル）の変数を定義します。

```javascript
private let FAUCET_AMOUNT : Nat = 1_000;
```

次に、トークンを受け取ったユーザーとそのトークンを記録する`faucet_book`変数を定義しています。`Principal`型として受け取るのがユーザー ID、`[Token]`は配列になっており、複数のトークンをユーザに紐づけて保存できるようにしています。

```javascript
// ユーザーとトークンをマッピング
// トークンは、複数を想定して配列にする
var faucet_book = HashMap.HashMap<Principal, [Token]>(
  10,
  Principal.equal,
  Principal.hash,
);
```

このような構造になるイメージです。

```
{
  user1 : [tokenA, tokenB],
  user2 : [tokenA],
  user3 : [tokenB, tokenC],
}
```

また、`hashMap`は3つの引数を取ります。第一引数に初期のサイズ、第二引数にHashMapの`key`同士を比較するために使用する関数、第三引数に`key`をハッシュ化するために使用する関数を指定します。`Principal`型には[`equal`](https://internetcomputer.org/docs/current/developer-docs/build/cdks/motoko-dfinity/base/Principal#function-equal)と[`hash`](https://internetcomputer.org/docs/current/developer-docs/build/cdks/motoko-dfinity/base/Principal#function-hash)がそれぞれ定義されているので、ここではその関数を指定しています。

続いて、関数を定義しましょう。以下のように関数を`faucet_book`変数の下に追加してください。

[main.mo]

```diff
shared (msg) actor class Faucet() = this {
  private type Token = Principal;

  private let FAUCET_AMOUNT : Nat = 1_000;

  // ユーザーとトークンをマッピング
  // トークンは、複数を想定して配列にする
  private var faucet_book = HashMap.HashMap<Principal, [Token]>(
    10,
    Principal.equal,
    Principal.hash,
  );

+  public shared (msg) func getToken(token : Token) : async T.FaucetReceipt {
+    let faucet_receipt = await checkDistribution(msg.caller, token);
+    switch (faucet_receipt) {
+      case (#Err e) return #Err(e);
+      case _ {};
+    };
+
+    // `Token` PrincipalでDIP20アクターのインスタンスを生成
+    let dip20 = actor (Principal.toText(token)) : T.DIPInterface;
+
+    // トークンを転送する
+    let txReceipt = await dip20.transfer(msg.caller, FAUCET_AMOUNT);
+    switch txReceipt {
+      case (#Err e) return #Err(#FaucetFailure);
+      case _ {};
+    };
+
+    // 転送に成功したら、`faucet_book`に保存する
+    addUser(msg.caller, token);
+    return #Ok(FAUCET_AMOUNT);
+  };
+
+  // トークンを配布したユーザーとそのトークンを保存する
+  private func addUser(user : Principal, token : Token) {
+    // 配布するトークンをユーザーに紐づけて保存する
+    switch (faucet_book.get(user)) {
+      case null {
+        let new_data = Array.make<Token>(token);
+        faucet_book.put(user, new_data);
+      };
+      case (?tokens) {
+        let buff = Buffer.Buffer<Token>(2);
+        for (token in tokens.vals()) {
+          buff.add(token);
+        };
+        // ユーザーの情報を上書きする
+        faucet_book.put(user, Buffer.toArray<Token>(buff));
+      };
+    };
+  };
+
+  // Faucetとしてトークンを配布しているかどうかを確認する
+  // 配布可能なら`#Ok`、不可能なら`#Err`を返す
+  private func checkDistribution(user : Principal, token : Token) : async T.FaucetReceipt {
+    // `Token` PrincipalでDIP20アクターのインスタンスを生成
+    let dip20 = actor (Principal.toText(token)) : T.DIPInterface;
+    let balance = await dip20.balanceOf(Principal.fromActor(this));
+
+    if (balance == 0) {
+      return (#Err(#InsufficientToken));
+    };
+
+    switch (faucet_book.get(user)) {
+      case null return #Ok(FAUCET_AMOUNT);
+      case (?tokens) {
+        switch (Array.find<Token>(tokens, func(x : Token) { x == token })) {
+           case null return #Ok(FAUCET_AMOUNT);
+          case (?token) return #Err(#AlreadyGiven);
+        };
+      };
+    };
+  };
};
```

ここでは、外部から呼び出し可能な`public`関数を1つ、内部で使用する`private`関数を2つ実装しています。
順番に見ていきましょう。

最初の関数は、ユーザーがトークンを受け取るためにコールする関数です。引数にトークンキャニスターのPrincipal（ID）を受け取り、戻り値は`types.mo`で定義した`FaucetReceipt`を返します。

```javascript
public shared (msg) func getToken(token : Token) : async FaucetReceipt
```

内部では、最初に配布可能かどうかの確認を行います。後述する内部関数`checkDistribution`からエラーが返ってきたらその時点で`return`をして終了します。

```javascript
let faucet_receipt = await checkDistribution(msg.caller, token);
  switch (faucet_receipt) {
    case (#Err e) return #Err(e);
    case _ {};
  };
```

エラーでなければ、トークンの転送を行います。ここで、DIP20トークンキャニスターの`transfer`メソッドをコールします。

まずは、キャニスター Principalを使用してキャニスターのインスタンス（実体）を生成します。このとき、`actor`は`Text`型（文字列）を引数に受け取るので、`toText()`で変換します。インスタンスの型には、`types.mo`で定義した型`DIPInterface`を明示的に指定しています。

インスタンスが生成されたら、実際に`transfer`をコールします。`msg.caller`には、`getToken`関数を呼び出したユーザーのPrincipalが格納されています。`transfer`からエラーが返ってきたら`return`をして終了します。

```javascript
// DIP20のインスタンスを生成
  let dip20 = actor (Principal.toText(token)) : T.DIPInterface;

  // トークンを転送する
  let txReceipt = await dip20.transfer(msg.caller, FAUCET_AMOUNT);
  switch txReceipt {
    case (#Err e) return #Err(#FaucetFailure);
    case _ {};
  };
```

`transfer`に成功した場合、トークンを付与したことを記録するためにユーザー Principalとトークンをデータ(`faucet_book`)に保存します。

```javascript
// 転送に成功したら、`faucet_book`に保存する
addUser(msg.caller, token);
return #Ok(FAUCET_AMOUNT);
```

最後の2つは、内部でのみ使用する`private`関数になります。

`checkDistribution`関数は、トークンの残高が十分か・ユーザーが既に受け取っていないかを確認する関数になります。

まずは、Faucetキャニスター内にトークンが残っているかを`balanceOf`メソッドをコールして確認します。このとき渡すPrincipalは`this`を変換したもので、`this`はFaucet自身を指すキーワードです。`Principal.fromActor()`を使うことにより、値を`balanceOf`が受け取れるPrincipalに変換することができます。

残高が配布する量より少ない場合は、エラーを返して終了します。

```javascript
// `Token` PrincipalでDIP20アクターのインスタンスを生成
let dip20 = actor (Principal.toText(token)) : T.DIPInterface;
let balance = await dip20.balanceOf(Principal.fromActor(this));

if (balance < FAUCET_AMOUNT) {
  return (#Err(#InsufficientToken));
};
```

次に、ユーザーがトークンをまだ受け取っていないかを確認します。ポイントは2つ目の`switch`文です。トークンの有無を`Array.find`関数を使用して検索しています。HashMapの初期化に`key`に対して行う処理の関数を渡す必要がありましたが、`Array.find`にも比較を行う関数を渡す必要があります。HashMapとの違いは内部で扱う型にあります。`Array.find`では、扱う型がユーザー定義型`Token`の配列です。そのため、比較関数を自分で定義して渡す必要があります。

```javascript
// ユーザーのデータがあるか
switch (faucet_book.get(user)) {
  case null return #Ok(FAUCET_AMOUNT);
  case (?tokens) {
    // トークンが既に配布されているか
    switch (Array.find<Token>(tokens, func(x : Token) { x == token })) {
      case null return #Ok(FAUCET_AMOUNT);
      case (?token) return #Err(#AlreadyGiven);
    };
  };
};
```

最後の`addUser`関数は、配布したユーザーのデータを保存するための関数です。

ユーザー自体のデータがない場合は、新しく配列を生成して`faucet_book`変数に追加します。

```javascript
case null {
  let new_data = Array.make<Token>(token);
  faucet_book.put(user, new_data);
};
```

ユーザーのデータが存在する場合は、今回配布したトークンのデータを[Token]配列に追加します。ここで使用している`Buffer`とは、任意の要素数まで拡張可能な汎用・可変なものになります。そのため、初期化時にサイズが決定し変更不可能な`Array`（配列）を補完してくれます。

```javascript
case (?tokens) {
  let buff = Buffer.Buffer<Token>(2);
  for (token in tokens.vals()) {
    buff.add(token);
  };
  // ユーザーの情報を上書きする
  faucet_book.put(user, Buffer.toArray<Token>(buff));
};
```

### 📝 設定ファイル dfx.json を編集しよう

それでは、作成したFaucetキャニスターの情報を`dfx.json`に追加します。`dfx.json`ファイルの`"icp_basic_dex_backend"`下に、以下を参考に`"faucet"{...}`を追記しましょう。

[dfx.json]

```json
{
  "canisters": {
    "icp_basic_dex_backend": {
      "main": "src/icp_basic_dex_backend/main.mo",
      "type": "motoko"
    },
    "faucet": {
      "main": "src/faucet/main.mo",
      "type": "motoko"
    },
```

### ✅ Faucet 機能をテストしよう

それでは、実装したFaucetキャニスターをデプロイして機能をテストしてみましょう。

`dfx`を用いて、ターミナルからキャニスターとやり取りすることができます。しかし、デプロイから実際に`getToken`を呼び出すまでに多くのコマンドを打つ必要があるので、テストにシェルスクリプトを使用したいと思います。

まずは、プロジェクトのルート直下に`scripts`ディレクトリを作成します。

```
mkdir scripts
```

次に、コマンドを記述する`test.sh`ファイルを作成します。

```
touch ./scripts/test.sh
```

作成されたら、ファイル内に以下のコマンドを記述してください。

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

このプロジェクトでは、テストに3人のユーザーを使用します。

- `default` : 全てのキャニスターをデプロイする（キャニスターの所有者）
- `user1`, `user2` : DEXアプリケーションを使用する

スクリプトの処理を簡単に説明します。テストで使用するユーザーを作成してキャニスターをデプロイし、`getToken`関数をコールしてトークンを取得します。関数を実行した際に発生した結果と、期待する値を比較して`TEST_STATUS`の値を決定しています。値が一致していたらステータスは0のままです。値が違う場合（エラー）は、ステータスが1に設定されます。

値を比較しているのは、`compare_result`関数です。

全てのテストを実行し終えた時、最後に結果の確認を行ないます。`TEST_STATUS`の値をチェックして["PASS"]または["FAIL"]を出力します。

スクリプトの詳しい文法の説明は省略させていただきますので、ぜひご自身で調べてみてください。出力結果を色分けする方法などもあるので、カスタマイズしてみるのも楽しいでしょう！

では、実際にテストを実行してみましょう。ターミナルを開き、作成したスクリプトを走らせます。

```
bash ./scripts/test.sh
```

実行結果は以下のように出力されるでしょう。

```
# キャニスターデプロイの出力結果は省略しています...

===== getToken =====
return 1_000: OK
return Err AlreadyGiven: OK
Using identity: "default".
Removed identity "user1".
Removed identity "user2".
Using the default definition for the 'local' shared network because /User/user/.config/dfx/networks.json does not exist.
Stopping canister http adapter...
Stopped.
Stopping the replica...
Stopped.
Stopping icx-proxy...
Stopped.
===== Result =====
"PASS"
```

ユーザーがトークンを取得できること、また再度取得しようとするとエラーができることが確認できます。全てのテストを通過し、最後に`"PASS"`と出力されていることを確認しましょう。これで、Faucetキャニスターからユーザーがトークンを受け取ることができるのを確認できました！

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

次のレッスンに進んで、DEX内のトークンを管理する機能を実装していきましょう！
