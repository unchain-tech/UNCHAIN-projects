### 📝 　設定ファイルを編集しよう

ここからはフロントエンドの作成になりますが、まずは、前回のセクションまでで完成したスマートスマートコントラクトをデプロイしているアカウントIDが使用されるようにします。

`near-hotel-booking-dapp/contract/neardev/dev-account.env`内の`CONTRACT_NAME`を書き換えます。

`near-hotel-booking-dapp/contract/neardev/dev-account.env`

```
CONTRACT_NAME=YOUR_CONNTRACT_ID
```

例えばこのようになるでしょう。

```
CONTRACT_NAME=contract.hotel_booking.testnet
```

### 🔌 スマートコントラクトとの接続を実装しよう

`frontend/near-api.js`に、NEAR Walletのデータやスマートコントラクトのメソッドを設定するための実装を行います。以下のように書き換えてください

`frontend/assets/js/near/utils.js`

```javascript
import { connect, Contract, keyStores, WalletConnection } from 'near-api-js';
import {
  formatNearAmount,
  parseNearAmount,
} from 'near-api-js/lib/utils/format';

import getConfig from './config';

// トランザクション実行時に使用するGASの上限を設定
const GAS = 100000000000000;

const nearConfig = getConfig(process.env.NODE_ENV || 'development');

// コントラクトの初期化とグローバル変数を設定
export async function initContract() {
  // NEARテストネットへの接続を初期化する
  const near = await connect(
    Object.assign(
      { deps: { keyStore: new keyStores.BrowserLocalStorageKeyStore() } },
      nearConfig,
    ),
  );

  // ウォレットベースのアカウントを初期化
  // // `https://wallet.testnet.near.org`でホストされている NEAR testnet ウォレットで動作させることができる
  window.walletConnection = new WalletConnection(near);

  // アカウントIDを取得する
  // // まだ未承認の場合は、空文字列が設定される
  window.accountId = window.walletConnection.getAccountId();

  // コントラクトAPIの初期化
  window.contract = await new Contract(
    window.walletConnection.account(),
    nearConfig.contractName,
    {
      viewMethods: [
        'get_available_rooms',
        'get_rooms_registered_by_owner',
        'get_booking_info_for_owner',
        'get_booking_info_for_guest',
        'exists',
        'is_available',
      ],
      changeMethods: [
        'add_room_to_owner',
        'book_room',
        'change_status_to_available',
        'change_status_to_stay',
      ],
    },
  );
}

export function logout() {
  window.walletConnection.signOut();
  // ページをリロード
  window.location.replace(window.location.origin + window.location.pathname);
}

export function login() {
  window.walletConnection.requestSignIn(nearConfig.contractName);
}

export async function accountBalance() {
  return formatNearAmount(
    (await window.walletConnection.account().getAccountBalance()).total,
    2,
  );
}

// コールするメソッドの処理を定義
// // 実際に引数を渡す処理は全てここに実装
export async function get_available_rooms(check_in_date) {
  const availableRooms = await window.contract.get_available_rooms({
    check_in_date,
  });
  return availableRooms;
}

export async function get_rooms_registered_by_owner(owner_id) {
  const registeredRooms = await window.contract.get_rooms_registered_by_owner({
    owner_id,
  });
  return registeredRooms;
}

export async function get_booking_info_for_owner(owner_id) {
  const bookedRooms = await window.contract.get_booking_info_for_owner({
    owner_id,
  });
  return bookedRooms;
}

export async function get_booking_info_for_guest(guest_id) {
  const guestBookedRooms = await window.contract.get_booking_info_for_guest({
    guest_id,
  });
  return guestBookedRooms;
}

export async function exists(owner_id, room_name) {
  const ret = await window.contract.exists({
    owner_id,
    room_name,
  });
  return ret;
}

export async function is_available(room_id) {
  const ret = await window.contract.is_available({
    room_id,
  });
  return ret;
}

export async function add_room_to_owner(room) {
  // NEAR -> yoctoNEARに変換
  room.price = parseNearAmount(room.price);

  await window.contract.add_room_to_owner({
    name: room.name,
    image: room.image,
    beds: Number(room.beds),
    description: room.description,
    location: room.location,
    price: room.price,
  });
}

export async function book_room({ room_id, date, price }) {
  await window.contract.book_room(
    {
      room_id,
      check_in_date: date,
    },
    GAS,
    price,
  );
}

export async function change_status_to_available(
  room_id,
  check_in_date,
  guest_id,
) {
  await window.contract.change_status_to_available({
    room_id,
    check_in_date,
    guest_id,
  });
}

export async function change_status_to_stay(room_id, check_in_date) {
  await window.contract.change_status_to_stay({
    room_id,
    check_in_date,
  });
}

```

最初に、`near-api-js`からインポートをしています。

```javascript
import { connect, Contract, keyStores, WalletConnection } from 'near-api-js';
import {
  formatNearAmount,
  parseNearAmount,
} from 'near-api-js/lib/utils/format';
```

NEARトランザクションの内部で扱う単位と、人が扱う単位の変換は[こちらの関数](https://docs.near.org/tools/near-api-js/utils)で実行できます。

- `formatNearAmount()` : YoctoNEAR => NEAR
- `parseNearAmount()` : NEAR => yoctoNEAR

次に、各定数の設定と初期化を行なっています。

以下の部分に注目してください。
スマートコントラクトから呼び出したいメソッドは、このように定義します。

```javascript
// スマートコントラクトAPIの初期化
window.contract = await new Contract(
  window.walletConnection.account(),
  nearConfig.contractName,
  {
    viewMethods: [
      'get_available_rooms',
      'get_rooms_registered_by_owner',
      'get_booking_info_for_owner',
      'get_booking_info_for_guest',
      'exists',
      'is_available',
    ],
    changeMethods: [
      'add_room_to_owner',
      'book_room',
      'change_status_to_available',
      'change_status_to_stay',
    ],
  },
);
```

- `viewMethods` : ブロックチェーン上のデータを読み込むメソッド（ガス代は無料）
- `changeMethods` : ブロックチェーン上にデータを書き込むメソッド（ガス代が必要）

次に、使用するメソッドの処理を定義し`export`します。

```javascript
// コールするメソッドの処理を定義
// // 実際に引数を渡す処理は全てここに実装
export async function get_available_rooms(check_in_date) {
  const availableRooms = await window.contract.get_available_rooms({
    check_in_date,
  });
  return availableRooms;
}

export async function get_rooms_registered_by_owner(owner_id) {
  const registeredRooms = await window.contract.get_rooms_registered_by_owner({
    owner_id,
  });
  return registeredRooms;
}

export async function get_booking_info_for_owner(owner_id) {
  const bookedRooms = await window.contract.get_booking_info_for_owner({
    owner_id,
  });
  return bookedRooms;
}

export async function get_booking_info_for_guest(guest_id) {
  const guestBookedRooms = await window.contract.get_booking_info_for_guest({
    guest_id,
  });
  return guestBookedRooms;
}

export async function exists(owner_id, room_name) {
  const ret = await window.contract.exists({
    owner_id,
    room_name,
  });
  return ret;
}

export async function is_available(room_id) {
  const ret = await window.contract.is_available({
    room_id,
  });
  return ret;
}

export async function add_room_to_owner(room) {
  // NEAR -> yoctoNEARに変換
  room.price = parseNearAmount(room.price);

  await window.contract.add_room_to_owner({
    name: room.name,
    image: room.image,
    beds: Number(room.beds),
    description: room.description,
    location: room.location,
    price: room.price,
  });
}

export async function book_room({ room_id, date, price }) {
  await window.contract.book_room(
    {
      room_id,
      check_in_date: date,
    },
    GAS,
    price,
  );
}

export async function change_status_to_available(
  room_id,
  check_in_date,
  guest_id,
) {
  await window.contract.change_status_to_available({
    room_id,
    check_in_date,
    guest_id,
  });
}

export async function change_status_to_stay(room_id, check_in_date) {
  await window.contract.change_status_to_stay({
    room_id,
    check_in_date,
  });
}
```

トークンの転送処理が行われる`book_room`メソッドには、第二引数にガスの上限、第三引数に量（ここでは宿泊料）を指定します。

```javascript
await window.contract.book_room(
  {
    room_id,
    check_in_date: date,
  },
  GAS,
  price,
);
```

これで、スマートコントラクトのメソッドを呼び出す準備ができました。

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

次のレッスンに進み、画面遷移を実装してきましょう！
