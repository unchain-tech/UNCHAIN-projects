### DEX 内のトークンを管理するモジュールを実装しよう

このレッスンでは、ユーザーが取引のためにDEXへ入金したトークンを管理する`BalanceBook`モジュールを実装していきます。

`BalanceBook`モジュールが持つ機能は、以下になります。

- ユーザーとDEXに入金されたトークンのデータを紐付けて保存する
- 取引・出金時にトークン残高が十分か確認をする

それでは、実装をしていきましょう。

まずは、Faucetキャニスターを実装した時と同様に`types.mo`ファイルを作成します。場所は、サンプルプロジェクトの`main.mo`ファイルと同じ階層になります。

```
touch src/icp_basic_dex_backend/types.mo
```

[types.mo]

```javascript
module {
  public type Token = Principal;
}
```

続いて、`BalanceBook`モジュールを実装するファイルを作成します。こちらも、サンプルプロジェクトの`main.mo`ファイルと同じ階層に作成します。

```
touch src/icp_basic_dex_backend/balance_book.mo
```

作成した`balance_book.mo`ファイルに、まずはライブラリのインポート文とデータを保存する変数を記述します。

[balance_book.mo]

```javascript
import Iter "mo:base/Iter";
import Principal "mo:base/Principal";
import HashMap "mo:base/HashMap";

import T "types";

module {
  public class BalanceBook() {

    // ユーザーとトークンの種類・量をマッピング
    var balance_book = HashMap.HashMap<Principal, HashMap.HashMap<T.Token, Nat>>(10, Principal.equal, Principal.hash);
  };
};
```

ユーザーとトークンを紐づけて保存する`balance_book`は、HashMapの入れ子になっています。少し複雑ですが、Faucetキャニスターを実装した際のデータ構造と比較すると、配列部分がHashMapになった構造をしています。以下のようなイメージとなります。

```
{
  user1 : {
    {tokenA : 100},
    {tokenB : 100},
  },
  user2 : {
    {tokenA : 200},
  },
  user3 : {
    {tokenB : 50},
    {tokenC : 100},
  },
}
```

```javascript
var balance_book = HashMap.HashMap<Principal, HashMap.HashMap<T.Token, Nat>>(10, Principal.equal, Principal.hash);
```

続いて、関数を定義していきます。以下のように関数を`balance_book`変数の下に追加してください。

[balance_book.mo]

```diff
module {
  public class BalanceBook() {

    // ユーザーとトークンの種類・量をマッピング
    var balance_book = HashMap.HashMap<Principal, HashMap.HashMap<T.Token, Nat>>(10, Principal.equal, Principal.hash);

+    // ユーザーに紐づいたトークンと残高を取得
+    public func get(user : Principal) : ?HashMap.HashMap<T.Token, Nat> {
+      return balance_book.get(user);
+    };
+
+    // ユーザーの預け入れを記録する
+    public func addToken(user : Principal, token : T.Token, amount : Nat) {
+      // ユーザーのデータがあるかどうか
+      switch (balance_book.get(user)) {
+        case null {
+          var new_data = HashMap.HashMap<Principal, Nat>(2, Principal.equal, Principal.hash);
+          new_data.put(token, amount);
+          balance_book.put(user, new_data);
+        };
+        case (?token_balance) {
+          // トークンが記録されているかどうか
+          switch (token_balance.get(token)) {
+            case null {
+              token_balance.put(token, amount);
+            };
+            case (?balance) {
+              token_balance.put(token, balance + amount);
+            };
+          };
+        };
+      };
+    };
+
+    // DEXからトークンを引き出す際にコールされる
+    // トークンがあれば更新された残高を返し、なければ`null`を返す
+    public func removeToken(user : Principal, token : T.Token, amount : Nat) : ?Nat {
+      // ユーザーのデータがあるかどうか
+      switch (balance_book.get(user)) {
+        case null return (null);
+        case (?token_balance) {
+          // トークンが記録されているかどうか
+          switch (token_balance.get(token)) {
+            case null return (null);
+            case (?balance) {
+              if (balance < amount) return (null);
+
+              // 残高と引き出す量が等しい時はトークンのデータごと削除
+              if (balance == amount) {
+                token_balance.delete(token);
+                // 残高の方が多い時は差し引いた分を再度保存
+              } else {
+                token_balance.put(token, balance - amount);
+              };
+              return ?(balance - amount);
+            };
+          };
+        };
+      };
+    };
+
+    // ユーザーが`balance_book`内に`amount`分のトークンを保有しているかを確認する
+    public func hasEnoughBalance(user : Principal, token : T.Token, amount : Nat) : Bool {
+      // ユーザーデータがあるかどうか
+      switch (balance_book.get(user)) {
+        case null return (false);
+        case (?token_balance) {
+          // トークンが記録されているかどうか
+          switch (token_balance.get(token)) {
+            case null return (false);
+            case (?balance) {
+              // `amount`以上残高ありで`true`、なしで`false`を返す
+              return (balance >= amount);
+            };
+          };
+        };
+      };
+    };
  };
};
```

4つの`public`関数を定義しました。順番に見ていきましょう。

最初の`get`関数は、ユーザーがDEX内に預けているトークンの情報を取得して返す関数です。ポイントは戻り値`?HashMap.HashMap<T.Token, Nat>`です。**?**をつけた型は`Option`型と呼ばれ、この場合、何かしらのエラーとなった場合には`null`を返し、それ以外の場合は指定した型の値を返すことができるようになります。

```javascript
public func get(user : Principal) : ?HashMap.HashMap<T.Token, Nat>
```

HashMapが持つ[`get`関数](https://internetcomputer.org/docs/current/developer-docs/build/cdks/motoko-dfinity/base/HashMap#function-get)自体がOption型を返します。トークンの情報が取得できた場合はトークンPrincipalとトークン量のマップを返し、取得できなかった場合はそのまま`null`を返します。

```javascript
return balance_book.get(user);
```

2つ目の`addToken`関数は、入金を記録する関数になります。引数にユーザー Principal、トークンキャニスター Principal、トークン量を受け取ります。ユーザーデータが既に記録されているかどうか、トークンデータが既に記録されているかどうがで場合分けを行い`balance_book`のデータを更新します。

3つ目の`removeToken`関数は、出金の際`balance_book`内のデータを更新する関数になります。ポイントは戻り値`?Nat`です。最初に定義した`get`関数同様に、Option型を返します。

```javascript
public func removeToken(user : Principal, token : T.Token, amount : Nat) : ?Nat
```

ユーザーがトークンを引き出す際、残高が0または不足する場合にはエラーとして`null`を返します。問題がなければ、出金後の残高を返します。出金後にトークン残高が0になるようであれば、トークンデータを`balance_book`から削除します。

```javascript
// 残高と引き出す量が等しい時はトークンのデータごと削除
if (balance == amount) {
  token_balance.delete(token);
  // 残高の方が多い時は差し引いた分を再度保存
} else {
  token_balance.put(token, balance - amount);
}
```

最後の`hasEnoughBalance`関数は、DEX内に入金されているユーザーのトークン量が十分かどうかを確認したい際にコールされる関数です。

```javascript
public func hasEnoughBalance(user : Principal, token : T.Token, amount : Nat) : Bool
```

戻り値は`Bool`型で、引数`amount`分のトークンがあれば`true`を返し、なければ`false`を返します。

ここまでで、DEX内に入金されたトークンを管理する機能ができました！

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

次のレッスンに進んで、DEXに入金・出金をする機能を実装していきましょう！
