### 🔍 検索ができるようにしよう

このレッスンでは、宿泊希望日で部屋の検索・予約ができるようにします。

まずは、`Home画面`を完成させます。
表示するメッセージと日付入力のフォームを追加するために、以下のコードで`Home.js`を更新しましょう。

`frontend/asserts/js/pages/Home.js`

```js
import FormDate from '../components/FormDate';

const Home = () => {
  return (
    <>
      <div className="text-center" style={{ margin: '200px' }}>
        <h1>Welcome.</h1>
        <h1>Select your stay dates and find a hotel!</h1>
        <FormDate />
      </div>
      <div className="text-center">
        <p>
          Owners who wish to list their rooms should connect to the NEAR Wallet.
        </p>
      </div>
    </>
  );
};

export default Home;

```

`import`の追加、`return文`の書き換えを行いました。
これにより、ユーザーに向けたメッセージと日付を入力するフォームが表示できるようになりました！

確認のため、`Home`画面を表示してみましょう。

![](/public/images/NEAR-Hotel-Booking-dApp/section-3/3_5_1.png)

試しに、日付を入力して`Search`ボタンを押してみましょう。
`Search画面`に遷移ができれば`Home画面`は完成です！

![](/public/images/NEAR-Hotel-Booking-dApp/section-3/3_5_2.png)

ここで、`Search`画面への遷移を設定した部分を振り返ります。

`App.js`

```javascript
<Route path="/search/:date" element={<Search />} />
```

`/search`のパスに`:date`というキーワードを追加していました。

`Search`画面に遷移したブラウザのURLを見てみましょう。パスの最後に、検索をした日付が追加されているはずです。

```
localhost:1234/search/2022-08-09
```

実際に値を渡す部分は、`FormDate`コンポーネント内に実装しました。

`FormDate.js`

```javascript
// URLに入力された日付を入れて遷移先へ渡す
onClick={() => navigate(`/search/${date}`)}
```

このように、検索された日付を遷移先に渡します。

次に、`Search画面`を完成させます。

この画面では検索結果の表示と、再度検索ができるように日付入力フォームを表示します。
以下のコードで、`Search.js`を更新しましょう。

`frontend/asserts/js/pages/Search.js`

```js
import { useEffect, useState } from 'react';
import Row from 'react-bootstrap/Row';
import { useParams } from 'react-router-dom';

import FormDate from '../components/FormDate';
import Room from '../components/Room';
import { book_room, get_available_rooms } from '../near/utils';

const Search = () => {
  // URLから検索する日付を取得する
  const { date } = useParams();
  // 予約できる部屋のデータを設定する
  const [availableRooms, setAvailableRooms] = useState([]);

  const getAvailableRooms = async () => {
    setAvailableRooms(await get_available_rooms(date));
  };

  const booking = async (room_id, price) => {
    book_room({
      room_id,
      date,
      price,
    });
    getAvailableRooms();
  };

  // 検索する日付が更新されるたびに`getAvailableRooms`を実行する
  useEffect(() => {
    getAvailableRooms();
  }, [date]);

  return (
    <>
      {/* 日付を入力するフォームを表示 */}
      <FormDate />
      <div className="text-center" style={{ margin: '20px' }}>
        <h2>{date}</h2>
        {availableRooms.length === 0 ? (
          <h3>Sorry, no rooms found.</h3>
        ) : (
          <>
            {/* NEAR Walletに接続されている時 */}
            {window.accountId && <h3>{availableRooms.length} found.</h3>}
            {/* NEAR Walletに接続していない時 */}
            {!window.accountId && (
              <h3>
                {availableRooms.length} found. To book, you must be connected to
                the NEAR Wallet.
              </h3>
            )}
          </>
        )}
      </div>
      {/* 予約可能な部屋を表示する */}
      <Row>
        {availableRooms.map((_room) => (
          <Room room={{ ..._room }} key={_room.room_id} booking={booking} />
        ))}
      </Row>
    </>
  );
};

export default Search;

```

内容を見ていきましょう。

以下の部分で日付を受け取っています。注意点として、変数名は`App.js`で指定したキーワードと同じ名前を指定します。`:date`と設定したので`date`を受け取ります。

```javascript
// URLから検索する日付を取得する
const { date } = useParams();
```

パスから受け取った`date`を`get_available_rooms`メソッドに渡し、部屋のデータを取得します。

```javascript
// 予約できる部屋のデータを設定する
const [availableRooms, setAvailableRooms] = useState([]);

const getAvailableRooms = async () => {
  setAvailableRooms(await get_available_rooms(date));
};
```

次に定義しているのは、**予約**ボタンが押された際に実行される関数です。中では`book_room`メソッドを呼んでいます。

```javascript
const booking = async (room_id, price) => {
  book_room({
    room_id,
    date,
    price,
  });
  getAvailableRooms();
};
```

次の`useEffect`には、`date`を指定しています。`Search`画面には再度検索ができるように日付入力フォームを表示させます。検索が実行される度にパスが変更され、`date`の値も更新されます。そこで、`date`が更新されたら再度部屋のデータを取得して、検索結果を更新するために指定します。

```javascript
// 検索する日付が更新されるたびに`getAvailableRooms`を実行する
useEffect(() => {
  getAvailableRooms();
}, [date]);
```

`return`文では、NEAR Walletに接続されているかどうかで表示するメッセージを変える実装をしています。`get_available_rooms`の結果を1つずつ`Room`コンポーネントへ渡し、部屋を表示します。

では、実際に確認してみましょう。ブラウザの更新ボタン押して、`Search`画面を更新します。

登録されている部屋の一覧が表示され、NEAR Walletの接続状況によって表示が変わることが確認できたらOKです。接続されていない時には、**予約**ボタンが押せないことも確認しましょう！

NEAR Walletに接続していない時

![](/public/images/NEAR-Hotel-Booking-dApp/section-3/3_5_3.png)

NEAR Walletに接続している時

![](/public/images/NEAR-Hotel-Booking-dApp/section-3/3_5_4.png)

### 💰 トークンの転送を確認しよう

予約ボタンが押せるようになったので、実際に予約をして宿泊料がオーナーへ転送されることを確認してみましょう。任意のアカウントでNEAR Walletに接続をして**予約**ボタンを押します。

トークン転送を承認後、Webアプリケーションに戻ると予約した部屋が消えているでしょう。

![](/public/images/NEAR-Hotel-Booking-dApp/section-3/3_5_5.png)

ナビゲーションバーのメニューから、`NEAR Explorer`へ移動します。

![](/public/images/NEAR-Hotel-Booking-dApp/section-3/3_5_6.png)

トランザクション一覧から、先ほど実行された`book_room`メソッドのトランザクションを確認してみます。

![](/public/images/NEAR-Hotel-Booking-dApp/section-3/3_5_7.png)

ハッシュ値のリンクから詳細を開き、Transaction Execution Planの項目を見ると、オーナーへ宿泊料が転送されていたらOKです。

![](/public/images/NEAR-Hotel-Booking-dApp/section-3/3_5_8.png)

最後に、オーナーのWalletを確認します。先ほど確認した項目に`Receiver ID:`があります。オーナーのアカウントIDをクリックしましょう。オーナーアカウントのトランザクションページが表示されるので、`Ⓝ BALANCE PROFILE`欄のリンクからアカウントページに移動します。

![](/public/images/NEAR-Hotel-Booking-dApp/section-3/3_5_9.png)

`Wallet`のページを表示し、右下の`Recent activity`で宿泊料を受け取っていたら確認完了です！

![](/public/images/NEAR-Hotel-Booking-dApp/section-3/3_5_10.png)
![](/public/images/NEAR-Hotel-Booking-dApp/section-3/3_5_11.png)

これで部屋の検索・予約ができるようになりました！

### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discordの`#near`で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の4点を記載してください ✨

```
1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット
```

---

次のレッスンに進み、予約を確認する画面を完成させましょう！
