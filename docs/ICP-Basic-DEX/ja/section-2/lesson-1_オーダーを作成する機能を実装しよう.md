### 📖 オーダーを作成する機能を実装しよう

このレッスンでは、ユーザーが取引のために作成するオーダー（売り注文）を扱う機能を実装していきます。この機能は`Exchange`メソッドとして定義します。

`Exchange`メソッドは、以下の機能を持ちます。

- ユーザーが出したオーダー（売り注文）を保存する
- オーダーをキャンセル（データから削除）する

また、オーダーを保存する際に、既に保存されているオーダーの中で取引が成立するものがあれば、取引を実行するようにしたいと思います。

それでは実装していきましょう。

まずは、`src/icp_basic_dex_backend`ディレクトリにある`types.mo`ファイルを編集します。

以下のように、`Exchange`メソッドで使用するデータ型を追加してください。ここでは、`public type Balance = {...};`の直下に追加しています。

[types.mo]

```diff
module {
  // 省略

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

+  // ====== ORDER =====
+  public type OrderId = Nat32;
+
+  public type Order = {
+    id : OrderId;
+    owner : Principal;
+    from : Token;
+    fromAmount : Nat;
+    to : Token;
+    toAmount : Nat;
+  };
};

次に、`Exchange`メソッドを定義する`exchange.mo`ファイルを作成します。

```
touch ./src/icp_basic_dex_backend/exchange.mo
```

作成された`exchange.mo`ファイルに、以下のコードを記述しましょう。

[exchange.mo]

```javascript
import Buffer "mo:base/Buffer";
import HashMap "mo:base/HashMap";

import BalanceBook "balance_book";
import T "types";

module {

  public class Exchange(balance_book : BalanceBook.BalanceBook) {

    // 売り注文のIDと注文内容をマッピング
    var orders = HashMap.HashMap<T.OrderId, T.Order>(
      0,
      func(order_id_x, order_id_y) { return (order_id_x == order_id_y) },
      func(order_id_x) { return (order_id_x) },
    );
  };
};
```

最初にインポート文を定義しました。ポイントは`BalanceBook`モジュールをインポートしている点です。レッスンの最初に、「取引が成立するものがあれば、取引を実行する」と説明しましたが、取引を実行する際に`DEX`内のトークンデータを書き換える必要があります。そのためには、`BalanceBook`モジュール内の関数をコールしたいのでインポートをしています。

```javascript
import BalanceBook "balance_book";
```

オーダーは、マップ構造で保存します。各オーダーに割り振られるIDでオーダーの検索が簡単にできるようにするためです。

```javascript
var orders = HashMap.HashMap<T.OrderId, T.Order>(
      0,
      func(order_id_x, order_id_y) { return (order_id_x == order_id_y) },
      func(order_id_x) { return (order_id_x) },
    );
```

次に、関数を定義しましょう。以下のように関数を`orders`変数の下に追加してください。

[exchange.mo]

```diff
module {

  public class Exchange(balance_book : BalanceBook.BalanceBook) {

    // 売り注文のIDと注文内容をマッピング
    var orders = HashMap.HashMap<T.OrderId, T.Order>(
      0,
      func(order_id_x, order_id_y) { return (order_id_x == order_id_y) },
      func(order_id_x) { return (order_id_x) },
    );
+
+    // 保存されているオーダー一覧を配列で返す
+    public func getOrders() : [T.Order] {
+      let buff = Buffer.Buffer<T.Order>(10);
+
+      // `orders`の値をエントリー毎に取得し、`buff`に追加
+      for (order in orders.vals()) {
+        buff.add(order);
+      };
+      // `Buffer`から`Array`に変換して返す
+      return (Buffer.toArray<T.Order>(buff));
+    };
+
+    // 引数に渡されたIDのオーダーを返す
+    public func getOrder(id : Nat32) : ?T.Order {
+      return (orders.get(id));
+    };
+
+    // 引数に渡されたIDのオーダーを削除する
+    public func cancelOrder(id : T.OrderId) : ?T.Order {
+      return (orders.remove(id));
+    };
+
+    // オーダーを追加する
+    // 追加する際、取引が成立するオーダーがあるかを検索して見つかったら取引を実行する
+    public func addOrder(new_order : T.Order) {
+      orders.put(new_order.id, new_order);
+      detectMatch(new_order);
+    };
+
+    private func detectMatch(new_order : T.Order) {
+      // 全ての売り注文から、from<->toが一致するものを探す
+      for (order in orders.vals()) {
+        if (
+          order.id != new_order.id
+          and order.from == new_order.to
+          and order.to == new_order.from
+          and order.fromAmount == new_order.toAmount
+          and order.toAmount == new_order.fromAmount,
+        ) {
+          processTrade(order, new_order);
+        };
+      };
+    };
+
+    private func processTrade(order_x : T.Order, order_y : T.Order) {
+      // 取引の内容で`order_x`の作成者のトークン残高を更新
+      let _removed_x = balance_book.removeToken(order_x.owner, order_x.from, order_x.fromAmount);
+      balance_book.addToken(order_x.owner, order_x.to, order_x.toAmount);
+      // 取引の内容で`order_y`のトークン残高を更新
+      let _removed_y = balance_book.removeToken(order_y.owner, order_y.from, order_y.fromAmount);
+      balance_book.addToken(order_y.owner, order_y.to, order_y.toAmount);
+
+      // 取引が成立した注文を削除
+      let _removed_order_x = orders.remove(order_x.id);
+      let _removed_order_y = orders.remove(order_y.id);
+    };
  };
};
```

4つの`public`関数と、2つの`private`関数を定義しました。順番に見ていきましょう。

最初の2つの`getOrders`関数と`getOrder`関数は、保存されているオーダーを取得する関数です。前回のセクションで`main.mo`ファイルに定義した`getBalance`関数同様に、`getOrder`関数は引数に渡されたオーダーのIDに応じてデータを返します。

次の2つの`cancelOrder`関数と`addOrder`関数は、オーダーを削除・追加する関数になります。ポイントは`addOrder`関数で、中で`detectMatch`関数をコールしています。

```javascript
public func addOrder(new_order : T.Order) {
  orders.put(new_order.id, new_order);
  detectMatch(new_order);
};
```

`detectMatch`関数は、成立する取引があるかどうかを確認する関数になります。例えば、

```
userX
[ from : TGLD, 100 -> to : TSLV, 100 ]
```

というオーダーを出しており、別のユーザーが

```
userY
[ from : TSLV, 100 -> to : TGLD, 100 ]
```

を希望する場合、取引が成立します。`for`文ですべてのオーダーを確認し、取引が成立する`if`文の条件に一致した場合は`processTrade`関数をコールします。

```javascript
for (order in orders.vals()) {
  if (
    order.id != new_order.id
    and order.from == new_order.to
    and order.to == new_order.from
    and order.fromAmount == new_order.toAmount
    and order.toAmount == new_order.fromAmount,
  ) {
    processTrade(order, new_order);
  };
};
```

`processTrade`関数で、実際にトークンの保有データを更新していきます。先ほどの例を使用すると、

```
userX
[ TGLD -100, TSLV + 100]
```

となるようにまずは更新を行います。

```javascript
// 取引の内容で`order_x`の作成者のトークン残高を更新
let _removed_x = balance_book.removeToken(
  order_x.owner,
  order_x.from,
  order_x.fromAmount
);
balance_book.addToken(order_x.owner, order_x.to, order_x.toAmount);
```

続いて、

```
userY
[ TSLV -100, TGLD +100]
```

となるように更新を行います。

```javascript
// 取引の内容で`order_y`のトークン残高を更新
let _removed_y = balance_book.removeToken(
  order_y.owner,
  order_y.from,
  order_y.fromAmount
);
balance_book.addToken(order_y.owner, order_y.to, order_y.toAmount);
```

最後に取引が完了したオーダーを削除して、終了します。

```javascript
// 取引が成立した注文を削除
let _removed_order_x = orders.remove(order_x.id);
let _removed_order_y = orders.remove(order_y.id);
```

ここまでで、オーダーを作成して取引を行う部分が実装できました！

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

次のレッスンに進んで、取引機能を完成させましょう！
