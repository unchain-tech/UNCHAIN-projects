### 入金・出金の機能を実装しよう

このレッスンでは、ユーザーがDEXに入金・出金をするための機能を実装していきます。

まずは、DIP20キャニスターからコールしたい関数・扱う型と、DEXが使用するユーザー定義の型を追加します。

`icp_basic_dex_backend/types.mo`ファイルを以下のように更新しましょう。

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

  public type Metadata = {
    logo : Text;
    name : Text;
    symbol : Text;
    decimals : Nat8;
    totalSupply : Nat;
    owner : Principal;
    fee : Nat;
  };

  public type DIPInterface = actor {
    allowance : (owner : Principal, spender : Principal) -> async Nat;
    balanceOf : (who : Principal) -> async Nat;
    getMetadata : () -> async Metadata;
    mint : (to : Principal, value : Nat) -> async TxReceipt;
    transfer : (to : Principal, value : Nat) -> async TxReceipt;
    transferFrom : (from : Principal, to : Principal, value : Nat) -> async TxReceipt;
  };

  public type Token = Principal;

  // ====== DEPOSIT / WITHDRAW =====
  public type DepositReceipt = {
    #Ok : Nat;
    #Err : {
      #BalanceLow;
      #TransferFailure;
    };
  };

  public type WithdrawReceipt = {
    #Ok : Nat;
    #Err : {
      #BalanceLow;
      #TransferFailure;
      #DeleteOrderFailure;
    };
  };

  public type Balance = {
    owner : Principal;
    token : Principal;
    amount : Nat;
  };
};
```

それでは、機能を実装していきます。`icp_basic_dex_backend/main.mo`ファイルを以下のコードに書き換えてください。

[main.mo]

```javascript
import Array "mo:base/Array";
import Iter "mo:base/Iter";
import HashMap "mo:base/HashMap";
import Principal "mo:base/Principal";

import BalanceBook "balance_book";
import T "types";

actor class Dex() = this {

  // DEXのユーザートークンを管理するモジュール
  private var balance_book = BalanceBook.BalanceBook();
};
```

ここでは、これまでと同様にインポート文を定義しています。加えて、前回のレッスンで作成した`BalanceBook`モジュールをインポートしています。以下のように`BalanceBook`をインスタンス化することで、実際に関数を呼び出すことが可能になります。

```javascript
private var balance_book = BalanceBook.BalanceBook();
```

次に、関数を実装していきます。以下のように関数を`balance_book`変数の下に追加してください。

[main.mo]

```diff
actor class Dex() = this {

  // DEXのユーザートークンを管理するモジュール
  private var balance_book = BalanceBook.BalanceBook();

+  // ===== DEPOSIT / WITHDRAW =====
+  // ユーザーがDEXにトークンを預ける時にコールする
+  // 成功すると預けた量を、失敗するとエラー文を返す
+  public shared (msg) func deposit(token : T.Token) : async T.DepositReceipt {
+    let dip20 = actor (Principal.toText(token)) : T.DIPInterface;
+
+    // トークンに設定された`fee`を取得
+    let dip_fee = await fetch_dif_fee(token);
+
+    // ユーザーが保有するトークン量を取得
+    let balance = await dip20.allowance(msg.caller, Principal.fromActor(this));
+    if (balance <= dip_fee) {
+      return #Err(#BalanceLow);
+    };
+
+    // DEXに転送
+    let token_receipt = await dip20.transferFrom(msg.caller, Principal.fromActor(this), balance - dip_fee);
+    switch token_receipt {
+      case (#Err e) return #Err(#TransferFailure);
+      case _ {};
+    };
+
+    // `balance_book`にユーザーPrincipalとトークンデータを記録
+    balance_book.addToken(msg.caller, token, balance - dip_fee);
+
+    return #Ok(balance - dip_fee);
+  };
+
+  // DEXからトークンを引き出す時にコールされる
+  // 成功すると引き出したトークン量が、失敗するとエラー文を返す
+  public shared (msg) func withdraw(token : T.Token, amount : Nat) : async T.WithdrawReceipt {
+    if (balance_book.hasEnoughBalance(msg.caller, token, amount) == false) {
+      return #Err(#BalanceLow);
+    };
+
+    let dip20 = actor (Principal.toText(token)) : T.DIPInterface;
+
+    // `transfer`でユーザーにトークンを転送する
+    let txReceipt = await dip20.transfer(msg.caller, amount);
+    switch txReceipt {
+      case (#Err e) return #Err(#TransferFailure);
+      case _ {};
+    };
+
+    let dip_fee = await fetch_dif_fee(token);
+
+    // `balance_book`のトークンデータを修正する
+    switch (balance_book.removeToken(msg.caller, token, amount + dip_fee)) {
+      case null return #Err(#BalanceLow);
+      case _ {};
+    };
+
+    return #Ok(amount);
+  };
+
+  // ===== INTERNAL FUNCTIONS =====
+  // トークンに設定された`fee`を取得する
+  private func fetch_dif_fee(token : T.Token) : async Nat {
+    let dip20 = actor (Principal.toText(token)) : T.DIPInterface;
+    let metadata = await dip20.getMetadata();
+    return (metadata.fee);
+  };
+
+  // ===== DEX STATE FUNCTIONS =====
+  // 引数で渡されたトークンPrincipalの残高を取得する
+  public shared query func getBalance(user : Principal, token : T.Token) : async Nat {
+    // ユーザーのデータがあるかどうか
+    switch (balance_book.get(user)) {
+      case null return 0;
+      case (?token_balances) {
+        // トークンのデータがあるかどうか
+        switch (token_balances.get(token)) {
+          case null return (0);
+          case (?amount) {
+            return (amount);
+          };
+        };
+      };
+    };
+  };
};
```

実装した関数を順番に見ていきましょう。

最初の`deposit`関数は、ユーザーがDEXにトークンを入金する際にコールされます。

ポイントは、トークンの転送処理です。この関数が行いたいのは、DEX内（icp_basic_dex_backendキャニスター）にユーザーのトークンを転送することです。ですが、`Faucet`キャニスターで実装したように`transfer`メソッドで転送することはできません。トークンの所有者はユーザーであるためです。使用するメソッドは`transferFrom`です。

トークンの転送を行う前に、ユーザーのトークン残高を`allowance`メソッドで取得します。取得した残高がトークンに設定されている手数料（fee）に満たない場合はエラーを返して終了します。手数料は、DIP20キャニスターをデプロイする際に初期値として設定することができる値です。

問題がなければ`transferFrom`メソッドでユーザーからDEX内にトークンを転送します。この時転送されるトークン量は、手数料を差し引いた分になります。

```javascript
// ユーザーが保有するトークン量を取得
let balance = await dip20.allowance(msg.caller, Principal.fromActor(this));
if (balance <= dip_fee) {
  return #Err(#BalanceLow);
};

// DEXに転送
let token_receipt = await dip20.transferFrom(msg.caller, Principal.fromActor(this), balance - dip_fee);
  switch token_receipt {
    case (#Err e) return #Err(#TransferFailure);
    case _ {};
  };
```

転送が完了した場合、`BalanceBook`モジュールの`addToken`メソッドを呼び出して、DEX内のトークンデータを更新します。

```javascript
// `balance_book`にユーザーPrincipalとトークンデータを記録
balance_book.addToken(msg.caller, token, balance - dip_fee);

return #Ok(balance - dip_fee);
```

次の`withdraw`関数は、ユーザーがDEXからトークンを出金する際にコールされます。

最初に、DEX内にユーザーが保有するトークン量と引き出したい量を比較します。不足するようであれば、エラーを返して終了します。

```javascript
if (balance_book.hasEnoughBalance(msg.caller, token, amount) == false) {
  return #Err(#BalanceLow);
};
```

問題がなければ、転送を行います。ここで使用するメソッドは`transfer`になります。

```javascript
// `transfer`でユーザーにトークンを転送する
let txReceipt = await dip20.transfer(msg.caller, amount);
  switch txReceipt {
    case (#Err e) return #Err(#TransferFailure);
    case _ {};
};
```

転送が完了した場合、`balance_book`のデータを更新します。

```javascript
let dip_fee = await fetch_dif_fee(token);

// `balance_book`のトークンデータを修正する
switch (balance_book.removeToken(msg.caller, token, amount + dip_fee)) {
  case null return #Err(#BalanceLow);
  case _ {};
};

return #Ok(amount);
```

3つ目の関数`fetch_dif_fee`は内部関数で、転送を行うトークンの手数料を取得します。`getMetadata`メソッドをコールすることでデータの取得ができます。このメソッドが返すデータの型は`types.mo`に定義されています。

```javascript
let metadata = await dip20.getMetadata();
```

4つ目の`getBalance`関数は、引数で渡されたユーザーがDEX内に保有するトークンの量を返します。

長かったですが、ここまでのレッスンで入金・出金を行うための機能が実装できました！

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

次のレッスンに進んで、入金・出金機能をテストしてみましょう！
