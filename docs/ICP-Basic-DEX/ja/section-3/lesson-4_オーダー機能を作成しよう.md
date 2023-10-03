### 📖 オーダー機能を作成しよう

このレッスンでは、ユーザーボード下に表示するオーダー機能を作成してUIを完成させたいと思います。

![](/public/images/ICP-Basic-DEX/section-3/3_4_1.png)

まずは、オーダー機能を実装するファイルを追加します。

```
touch ./src/icp_basic_dex_frontend/src/components/PlaceOrder.jsx ./src/icp_basic_dex_frontend/src/components/ListOrder.jsx
```

ここまでで、`icp_basic_dex_frontend/src`ディレクトリ下のフォルダ構成が以下のようになっているでしょう。

```diff
 src/
 ├── App.css
 ├── App.jsx
 ├── components/
 │   ├── Header.jsx
+│   ├── ListOrder.jsx
+│   ├── PlaceOrder.jsx
 │   └── UserBoard.js
 ├── utils/
 │   └── token.js
 ├── index.html
 └── index.js
```

### 📝 オーダーを入力する機能を実装しよう

それでは、オーダーを入力するフォームを作成していきましょう。具体的には、以下の機能を実装します。

- トークンの種類と量を入力する
- ボタンを押してオーダーを登録する

先ほど作成した`PlaceOrder.jsx`ファイルに、以下のコードを記述しましょう。

[PlaceOrder.jsx]

```javascript
import {
  canisterId as DEXCanisterId,
  createActor,
} from '../../../declarations/icp_basic_dex_backend';
import { tokens } from '../utils/token';
import { Principal } from '@dfinity/principal';
import { useState } from 'react';

export const PlaceOrder = (props) => {
  const { agent, updateOrderList } = props;

  // フォームに入力されたオーダーのデータを保存する
  const [order, setOrder] = useState({
    from: "",
    fromAmount: 0,
    to: "",
    toAmount: 0,
  });

  // フォームに入力されたデータを取得して、`order`に保存する
  const handleChangeOrder = (event) => {
    setOrder((prevState) => {
      return {
        ...prevState,
        [event.target.name]: event.target.value,
      };
    });
  };

  // ユーザーが入力したオーダーをDEXに登録する
  const handleSubmitOrder = async (event) => {
    // フォームが持つデフォルトの動作（フォームの内容をURLに送信）をキャンセルする
    event.preventDefault();
    console.log(`order: ${order}`);

    try {
      // ログインしているユーザーがDEXとやりとりを行うためにアクターを作成する
      const options = {
        agent,
      };
      const DEXActor = createActor(DEXCanisterId, options);

      // `from`に入力されたトークンシンボルに一致するトークンデータを、`tokens[]`から取得
      const fromToken = tokens.find((e) => e.tokenSymbol === order.from);
      const fromPrincipal = fromToken.canisterId;
      // `to`に入力されたトークンシンボルに一致するトークンデータを、`tokens[]`から取得
      const toToken = tokens.find((e) => e.tokenSymbol === order.to);
      const toPrincipal = toToken.canisterId;

      const resultPlace = await DEXActor.placeOrder(
        Principal.fromText(fromPrincipal),
        Number(order.fromAmount),
        Principal.fromText(toPrincipal),
        Number(order.toAmount)
      );
      if (!resultPlace.Ok) {
        alert(`Error: ${Object.keys(resultPlace.Err)[0]}`);
        return;
      }
      console.log(`Created order:  ${resultPlace.Ok[0].id}`);

      // オーダーが登録されたので、一覧を更新する
      updateOrderList();
    } catch (error) {
      console.log(`handleSubmitOrder: ${error} `);
    }
  };

  return (
    <>
      <div className="place-order">
        <p>PLACE ORDER</p>
        {/* オーダーを入力するフォームを表示 */}
        <form className="form" onSubmit={handleSubmitOrder}>
          <div>
            <div>
              <label>From</label>
              <select
                name="from"
                type="from"
                onChange={handleChangeOrder}
                required
              >
                <option value="">Select token</option>
                <option value="TGLD">TGLD</option>
                <option value="TSLV">TSLV</option>
              </select>
            </div>
            <div>
              <label>Amount</label>
              <input
                name="fromAmount"
                type="number"
                onChange={handleChangeOrder}
                required
              />
            </div>
            <div>
              <span>→</span>
            </div>
            <div>
              <label>To</label>
              <select name="to" type="to" onChange={handleChangeOrder} required>
                <option value="">Select token</option>
                <option value="TGLD">TGLD</option>
                <option value="TSLV">TSLV</option>
              </select>
            </div>
            <div>
              <label>Amount</label>
              <input
                name="toAmount"
                type="number"
                onChange={handleChangeOrder}
                required
              />
            </div>
          </div>
          <button className="btn-green" type="submit">
            Submit Order
          </button>
        </form>
      </div>
    </>
  );
};
```

### 📚 オーダーを表示する機能を実装しよう

続いて、オーダーを一覧表示する部分を作成していきましょう。具体的には以下の機能を実装します。

- 登録されたオーダーを一覧表示する
- 各オーダーに対する操作（Buy / Cancel）のボタンを表示する

[ListOrder.jsx]

```javascript
import {
  canisterId as DEXCanisterId,
  createActor,
} from '../../../declarations/icp_basic_dex_backend';

export const ListOrder = (props) => {
  const { agent, userPrincipal, orderList, updateOrderList, updateUserTokens } =
    props;

  const createDEXActor = () => {
    // ログインしているユーザーを設定する
    const options = {
      agent,
    };
    return createActor(DEXCanisterId, options);
  };

  // オーダーの購入を実行する
  const handleBuyOrder = async (order) => {
    try {
      const DEXActor = createDEXActor();
      // オーダーのデータを`placeOrder()`に渡す
      const resultPlace = await DEXActor.placeOrder(
        order.to,
        Number(order.toAmount),
        order.from,
        Number(order.fromAmount)
      );
      if (!resultPlace.Ok) {
        alert(`Error: ${Object.keys(resultPlace.Err)[0]}`);
        return;
      }
      // 取引が実行されたため、オーダー一覧を更新する
      updateOrderList();
      // ユーザーボード上のトークンデータを更新する
      updateUserTokens(userPrincipal);

      console.log("Trade Successful!");
    } catch (error) {
      console.log(`handleBuyOrder: ${error} `);
    }
  };

  // オーダーのキャンセルを実行する
  const handleCancelOrder = async (id) => {
    try {
      const DEXActor = createDEXActor();
      // キャンセルしたいオーダーのIDを`cancelOrder()`に渡す
      const resultCancel = await DEXActor.cancelOrder(id);
      if (!resultCancel.Ok) {
        alert(`Error: ${Object.keys(resultCancel.Err)}`);
        return;
      }
      // キャンセルが実行されたため、オーダー一覧を更新する
      updateOrderList();

      console.log(`Canceled order ID: ${resultCancel.Ok}`);
    } catch (error) {
      console.log(`handleCancelOrder: ${error}`);
    }
  };

  return (
    <div className="list-order">
      <p>Order</p>
      <table>
        <tbody>
          <tr>
            <th>From</th>
            <th>Amount</th>
            <th></th>
            <th>To</th>
            <th>Amount</th>
            <th>Action</th>
          </tr>
          {/* オーダー一覧を表示する */}
          {orderList.map((order, index) => {
            return (
              <tr key={`${index}: ${order.token} `}>
                <td data-th="From">{order.fromSymbol}</td>
                <td data-th="Amount">{order.fromAmount.toString()}</td>
                <td>→</td>
                <td data-th="To">{order.toSymbol}</td>
                <td data-th="Amount">{order.toAmount.toString()}</td>
                <td data-th="Action">
                  <div>
                    {/* オーダーに対して操作（Buy, Cancel）を行うボタンを表示 */}
                    <button
                      className="btn-green"
                      onClick={() => handleBuyOrder(order)}
                    >
                      Buy
                    </button>
                    <button
                      className="btn-red"
                      onClick={() => handleCancelOrder(order.id)}
                    >
                      Cancel
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
```

機能の実装が完了したので、最後に`App.jsx`を編集したいと思います。

まずは、作成したオーダー機能を読み込むためにインポート文に以下の2行を追加しましょう。

[App.jsx]

```diff
import { Header } from './components/Header';
+import { ListOrder } from './components/ListOrder';
+import { PlaceOrder } from './components/PlaceOrder';
import { UserBoard } from './components/UserBoard';
import { tokens } from './utils/token';
```

最後に、`return`文の中を更新しましょう。`<UserBoard />`下にオーダー機能が表示されるよう以下のように追記しましょう。

[App.jsx]

```diff
return (
  <>
    <Header
      updateOrderList={updateOrderList}
      updateUserTokens={updateUserTokens}
      setAgent={setAgent}
      setUserPrincipal={setUserPrincipal}
    />
    {/* ログイン認証していない時 */}
    {!userPrincipal &&
      <div className='title'>
        <h1>Welcome!</h1>
        <h2>Please push the login button.</h2>
      </div>
    }
    {/* ログイン認証済みの時 */}
    {userPrincipal &&
      <main className="app">
        <UserBoard
          agent={agent}
          userPrincipal={userPrincipal}
          userTokens={userTokens}
          setUserTokens={setUserTokens}
        />
+        <PlaceOrder
+          agent={agent}
+          updateOrderList={updateOrderList}
+        />
+        <ListOrder
+          agent={agent}
+          userPrincipal={userPrincipal}
+          orderList={orderList}
+          updateOrderList={updateOrderList}
+          updateUserTokens={updateUserTokens}
+        />
      </main>
    }
  </>
)
```

それでは、ブラウザ上で表示の確認をしてみたいと思います。webpackを起動したままの方は、そのまま画面を更新してみましょう。停止した方は、再度`npm start`で起動してURLにアクセスをしましょう。画像のように、フォームとオーダー一覧を表示するリストのタイトルが表示されていたら完成です！

![](/public/images/ICP-Basic-DEX/section-3/3_4_2.png)

ここまでで、UIが完成しました。次のレッスンで実際に操作をしてみましょう！

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

次のレッスンに進んで、 機能をテストしてみましょう 🎉
