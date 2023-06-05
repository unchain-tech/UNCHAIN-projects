### 🔁 取引機能を完成させよう

前回のレッスンで実装した`Exchange`モジュールを`main.mo`からコールして、ユーザーが取引を実行できるようにします。

まずは、`src/icp_basic_dex_backend`ディレクトリにある`types.mo`ファイルを編集します。以下のように、オーダーに関するデータ型を追加してください。

[types.mo]

```diff
module {
  // 省略

  // ====== ORDER =====
  public type OrderId = Nat32;

  public type Order = {
    id : OrderId;
    owner : Principal;
    from : Token;
    fromAmount : Nat;
    to : Token;
    toAmount : Nat;
  };
+
+  public type PlaceOrderReceipt = {
+    #Ok : ?Order;
+    #Err : {
+      #InvalidOrder;
+      #OrderBookFull;
+    };
+  };
+
+  public type CancelOrderReceipt = {
+    #Ok : OrderId;
+    #Err : {
+      #NotAllowed;
+      #NotExistingOrder;
+    };
+  };
};
```

次に、`main.mo`ファイルを編集していきます。まずは、`Exchange`モジュールを使用できるように追加します。以下のように追加をしてください。

[main.mo]

```diff
import Array "mo:base/Array";
import Iter "mo:base/Iter";
import HashMap "mo:base/HashMap";
import Principal "mo:base/Principal";

import BalanceBook "balance_book";
+import Exchange "exchange";
import T "types";

actor class Dex() = this {

  private var balance_book = BalanceBook.BalanceBook();

+  // オーダーのIDを管理する変数
+  private var last_id : Nat32 = 0;

+  // オーダーを管理するモジュール
+  private var exchange = Exchange.Exchange(balance_book);
```

続いて、オーダーを扱う関数を定義していきます。以下のように`withdraw`関数の下に定義するとよいでしょう。

[main.mo]

```diff
  public shared (msg) func withdraw(token : T.Token, amount : Nat) : async T.WithdrawReceipt {
  };

+  // ===== ORDER =====
+  // ユーザーがオーダーを作成する時にコールされる
+  // 成功するとオーダーの内容が、失敗するとエラー文を返す
+  public shared (msg) func placeOrder(
+    from : T.Token,
+    fromAmount : Nat,
+    to : T.Token,
+    toAmount : Nat,
+  ) : async T.PlaceOrderReceipt {
+
+    // ユーザーが`from`トークンで別のオーダーを出していないことを確認
+    for (order in exchange.getOrders().vals()) {
+      if (msg.caller == order.owner and from == order.from) {
+        return (#Err(#OrderBookFull));
+      };
+    };
+
+    // ユーザーが十分なトークン量を持っているか確認
+    if (balance_book.hasEnoughBalance(msg.caller, from, fromAmount) == false) {
+      return (#Err(#InvalidOrder));
+    };
+
+    // オーダーのIDを取得する
+    let id : Nat32 = nextId();
+    // `placeOrder`を呼び出したユーザーPrincipalを変数に格納する
+    // msg.callerのままだと、下記の構造体に設定できないため
+    let owner = msg.caller;
+
+    // オーダーを作成する
+    let order : T.Order = {
+      id;
+      owner;
+      from;
+      fromAmount;
+      to;
+      toAmount;
+    };
+    exchange.addOrder(order);
+
+    return (#Ok(exchange.getOrder(id)));
+  };
+
+  // ユーザーがオーダーを削除する時にコールされる
+  // 成功したら削除したオーダーのIDを、失敗したらエラー文を返す
+  public shared (msg) func cancelOrder(order_id : T.OrderId) : async T.CancelOrderReceipt {
+    // オーダーがあるかどうか
+    switch (exchange.getOrder(order_id)) {
+      case null return (#Err(#NotExistingOrder));
+      case (?order) {
+        // キャンセルしようとしているユーザーが、売り注文を作成したユーザー（所有者）と一致するかどうかをチェックする
+        if (msg.caller != order.owner) {
+          return (#Err(#NotAllowed));
+        };
+        // `cancleOrder`を実行する
+        switch (exchange.cancelOrder(order_id)) {
+          case null return (#Err(#NotExistingOrder));
+          case (?cancel_order) {
+            return (#Ok(cancel_order.id));
+          };
+        };
+      };
+    };
+  };
+
+  // Get all sell orders
+  public query func getOrders() : async ([T.Order]) {
+    return (exchange.getOrders());
+  };
```

オーダーのIDを扱う`private`関数を追加します。`fetch_dif_fee`関数の直下に追加するとよいでしょう。

[main.mo]

```diff
  // ===== INTERNAL FUNCTIONS =====
  // トークンに設定された`fee`を取得する
  private func fetch_dif_fee(token : T.Token) : async Nat {
    let dip20 = actor (Principal.toText(token)) : T.DIPInterface;
    let metadata = await dip20.getMetadata();
    return (metadata.fee);
  };

+  // オーダーのIDを更新して返す
+  private func nextId() : Nat32 {
+    last_id += 1;
+    return (last_id);
+  };

```

最後に、`withdraw`関数を編集します。出金を行う際に、ユーザーが出しているオーダーに対してDEX内のトークンが不足した場合、オーダーを削除するためです。以下のように処理を追加してください。

[main.mo]

```diff
  // DEXからトークンを引き出す時にコールされる
  public shared (msg) func withdraw(token : T.Token, amount : Nat) : async T.WithdrawReceipt {
    if (balance_book.hasEnoughBalance(msg.caller, token, amount) == false) {
      return #Err(#BalanceLow);
    };

    let dip20 = actor (Principal.toText(token)) : T.DIPInterface;

    // `transfer`でユーザーにトークンを転送する
    let txReceipt = await dip20.transfer(msg.caller, amount);

    switch txReceipt {
      case (#Err e) return #Err(#TransferFailure);
      case _ {};
    };

    let dip_fee = await fetch_dif_fee(token);

    // `balance_book`のトークンデータを修正する
    switch (balance_book.removeToken(msg.caller, token, amount + dip_fee)) {
      case null return #Err(#BalanceLow);
      case _ {};
    };

+    for (order in exchange.getOrders().vals()) {
+      if (msg.caller == order.owner and token == order.from) {
+        // ユーザの預金残高とオーダーの`fromAmount`を比較する
+        if (balance_book.hasEnoughBalance(msg.caller, token, order.fromAmount) == false) {
+          // `cancelOrder()`を実行する
+          switch (exchange.cancelOrder(order.id)) {
+            case null return (#Err(#DeleteOrderFailure));
+            case (?cancel_order) return (#Ok(amount));
+          };
+        };
+      };
+    };

    return #Ok(amount);
  };
```

追加したコードを確認します。

全てのオーダーから、ユーザーが出したオーダーと出金したいトークンが`from`として保存されているものを探します。

```javascript
for (order in exchange.getOrders().vals()) {
  if (msg.caller == order.owner and token == order.from) {
```

一致したものがあれば、次に残高を調べます。引き出した後のトークン量が、オーダーで出しているトークン量に満たない場合は、オーダーを削除します。もし、`cancelOrder`関数を実行した際に何かしらのエラーが生じて`null`が返ってきてしまったら、エラーを返します。

```javascript
if (balance_book.hasEnoughBalance(msg.caller, token, order.fromAmount) == false) {
  // `cancelOrder()`を実行する
  switch (exchange.cancelOrder(order.id)) {
    case null return (#Err(#DeleteOrderFailure));
    case (?cancel_order) return (#Ok(amount));
  };
};
```

ここまでで、ユーザーがオーダーを作成・キャンセルする機能を追加することができました！

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

次のレッスンに進んで、取引機能をテストしてみましょう！
