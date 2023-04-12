### 🛏 部屋の掲載ができるようにしよう

前のレッスンでは、各コンポーネントが完成しました。このレッスンでは、オーナーが部屋の追加・確認できるように部屋のデータ一覧が表示される`ManageRooms画面`を完成させます。

以下のコードで、`ManageRooms.js`を更新しましょう。

`frontend/asserts/js/pages/ManageRooms.js`

```js
import { formatNearAmount } from 'near-api-js/lib/utils/format';
import { useEffect, useState } from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';

import AddRoom from '../components/AddRoom';
import {
  add_room_to_owner,
  exists,
  get_rooms_registered_by_owner,
} from '../near/utils';

const ManageRooms = () => {
  const [registeredRooms, setRegisteredRooms] = useState([]);

  const getRooms = async () => {
    try {
      setRegisteredRooms(await get_rooms_registered_by_owner(window.accountId));
    } catch (error) {
      console.log(error);
    }
  };

  const addRoom = async (data) => {
    // 同じ名前の部屋を登録しないかチェック
    const exist = await exists(window.accountId, data.name);
    if (exist === true) {
      alert('Error: ' + data.name + ' is already registered.');
      return;
    }
    await add_room_to_owner(data);
    getRooms();
  };

  useEffect(() => {
    getRooms();
  }, []);

  // NEAR Walletに接続されていない時
  if (!window.accountId) {
    return (
      <>
        <h2>Please connect NEAR wallet.</h2>
      </>
    );
  }
  // NEAR Walletに接続されている時
  // // 登録した部屋を表示
  return (
    <>
      <Row>
        <Col>
          <h2>ROOM LIST</h2>
        </Col>
        <Col xs={1} style={{ marginTop: '5px' }}>
          <div>
            <AddRoom save={addRoom} />
          </div>
        </Col>
      </Row>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th scope="col">Room Name</th>
            <th scope="col">Image</th>
            <th scope="col">Beds</th>
            <th scope="col">Description</th>
            <th scope="col">Location</th>
            <th scope="col">Price per night</th>
            <th scope="col">Status</th>
          </tr>
        </thead>
        {registeredRooms.map((_room) => (
          <tbody key={`${_room.name}`}>
            {/* 部屋が空室の時 */}
            {_room.status === 'Available' && (
              <tr>
                <td>{_room.name}</td>
                <td>
                  <img src={_room.image} width="100" />
                </td>
                <td>{_room.beds}</td>
                <td>{_room.description}</td>
                <td>{_room.location}</td>
                <td>{formatNearAmount(_room.price)} NEAR</td>
                <td>{_room.status}</td>
              </tr>
            )}
            {/* 部屋が滞在中の時、背景を赤で表示 */}
            {_room.status !== 'Available' && (
              <tr style={{ backgroundColor: '#FFC0CB' }}>
                <td>{_room.name}</td>
                <td>
                  <img src={_room.image} width="100" />
                </td>
                <td>{_room.beds}</td>
                <td>{_room.description}</td>
                <td>{_room.location}</td>
                <td>{formatNearAmount(_room.price)} NEAR</td>
                <td>Stay</td>
              </tr>
            )}
          </tbody>
        ))}
      </Table>
    </>
  );
};

export default ManageRooms;

```

追加した内容を見ていきましょう。

`utils.js`内で定義したメソッドをインポートします。

```javascript
import {
  add_room_to_owner,
  exists,
  get_rooms_registered_by_owner,
} from '../near/utils';
```

`get_rooms_registered_by_owner()`にNEAR Walletに接続しているアカウントIDを渡します。これで、アカウントIDに紐づいて保存されている部屋のデータを取得します。

```javascript
// オーナーが登録した部屋のデータを取得
const getRooms = async () => {
  try {
    setRegisteredRooms(await get_rooms_registered_by_owner(window.accountId));
  } catch (error) {
    console.log(error);
  }
};
```

次に、部屋を追加するための関数を定義します。`addRoom`は前回のレッスンで作成した`AddRoom`コンポーネントに渡される関数です。`AddRoom`コンポーネント内のフォームに入力されたデータを受け取ったら、まず`exists`メソッドで既に登録されている部屋の名前かどうかを確認します。登録されていたら`alert()`で通知を出し、未登録であれば`add_room_to_owner`メソッドを実行します。

```javascript
const addRoom = async (data) => {
  // 同じ名前の部屋を登録しないかチェック
  let exist = await exists(window.accountId, data.name);
  if (exist == true) {
    alert('Error: ' + data.name + ' is already registered.');
    return;
  }
  await add_room_to_owner(data);
  getRooms();
};
```

次は表示する内容を実装していますが、NEAR Walletに接続されているかどうかで表示を変えます。接続されていない場合はメッセージのみを表示させます。

```javascript
// NEAR Walletに接続されていない時
if (!window.accountId) {
  return (
    <>
      <h2>Please connect NEAR wallet.</h2>
    </>
  );
}
```

接続されていたら、部屋を追加する**POST**ボタンと部屋のデータを表示します。

データの表示には、`React Bootstrap`の[Table](https://react-bootstrap.github.io/components/table/)を使用します。表示する際に、オーナーが利用状況を把握しやすいようステータスが`Available`なら白（デフォルト）、`Stay`なら赤を背景色にします。

```javascript
{/* 部屋が空室の時 */}
{_room.status === 'Available' && (
  <tr>
    <td>{_room.name}</td>
    <td>
      <img src={_room.image} width="100" />
    </td>
    <td>{_room.beds}</td>
    <td>{_room.description}</td>
    <td>{_room.location}</td>
    <td>{formatNearAmount(_room.price)} NEAR</td>
    <td>{_room.status}</td>
  </tr>
)}
{/* 部屋が滞在中の時、背景を赤で表示 */}
{_room.status !== 'Available' && (
  <tr style={{ backgroundColor: '#FFC0CB' }}>
    <td>{_room.name}</td>
    <td>
      <img src={_room.image} width="100" />
    </td>
    <td>{_room.beds}</td>
    <td>{_room.description}</td>
    <td>{_room.location}</td>
    <td>{formatNearAmount(_room.price)} NEAR</td>
    <td>Stay</td>
  </tr>
)}
```

では、動作確認をします。`Section2`で部屋を追加したアカウントIDでNEAR Walletに接続します。接続後、ナビゲーションバーから`ManageRooms画面`に移動します。

![](/public/images/NEAR-Hotel-Booking-dApp/section-3/3_4_1.png)

アカウントが追加した部屋のデータが表示されているでしょう。

![](/public/images/NEAR-Hotel-Booking-dApp/section-3/3_4_2.png)

**POST**ボタンを押してみましょう。前回のレッスンで作成した、入力フォームが表示されるでしょう。

![](/public/images/NEAR-Hotel-Booking-dApp/section-3/3_4_3.png)

部屋を追加してみましょう。部屋のデータを入力後、**Save room**ボタンを押します。
以下のように、追加した部屋のデータが表示されたら成功です！

![](/public/images/NEAR-Hotel-Booking-dApp/section-3/3_4_4.png)

最後に、NEAR Walletの接続を解除してみましょう。ナビゲーションバーのメニュー**Disconnect**から実行できます。

以下のように、メッセージのみが表示されるでしょう。

![](/public/images/NEAR-Hotel-Booking-dApp/section-3/3_4_5.png)

これで、オーナーが部屋の追加・確認ができるようになりました！

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

次のレッスンに進み、宿泊者が部屋の検索・予約をする画面を実装しましょう！
