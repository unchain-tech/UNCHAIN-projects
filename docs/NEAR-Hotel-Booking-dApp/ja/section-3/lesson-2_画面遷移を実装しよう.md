### 📄 ファイルを追加しよう

このレッスンでは、ナビゲーションバーの作成と画面遷移の実装を行います。
以下のようなファイル構造になるよう、ディレクトリとファイルを追加しましょう。

```diff
  frontend/
  ├─ __mocks__/
  ├─ assets/
  │  ├─ css/
  │  ├─ img/
  │  └─ js/
+ │     ├─ components/
+ │     │  ├─ NavBar.js
  │     ├─ near/
+ │     └─ pages/
+ │　　　　　├─ GuestBookedList.js
+ │　　　　　├─ Home.js
+ │　　　　　├─ ManageBookings.js
+ │　　　　　├─ ManageRooms.js
+ │　　　　　└─ Search.js
  ├─ App.js
  ├─ index.html
  └─ index.js
```

### 📁 　ライブラリをインストールしよう

ナビゲーションバーを作成するためのフレームワークと、画面遷移を実行するためのライブラリを以下のコマンドでインストールします。

```
yarn add --dev react-bootstrap bootstrap bootstrap-icons react-router-dom　
```

### 🖥 画面遷移を実装しよう

まずは、`frontend/index.js`を以下のように書き換えます。

`frontend/index.js`

```javascript
import 'bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from './App';
import { initContract } from './assets/js/near/utils';

const container = document.querySelector('#root');
const root = createRoot(container);

window.nearInitPromise = initContract()
  .then(() => {
    <BrowserRouter>
      <App />
    </BrowserRouter>;
    root.render(<App tab="home" />);
  })
  .catch(console.error);

```

画面遷移を実行するためのライブラリと、フレームワークをインポートしています。

```javascript
import 'bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
```

次に、`frontend/App.js`を以下のように書き換えます。
`frontend/App.js`

```javascript
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import NavBar from './assets/js/components/NavBar';
import GuestBookedList from './assets/js/pages/GuestBookedList';
import Home from './assets/js/pages/Home';
import ManageBookings from './assets/js/pages/ManageBookings';
import ManageRooms from './assets/js/pages/ManageRooms';
import Search from './assets/js/pages/Search';

const App = () => {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search/:date" element={<Search />} />
        <Route path="/booked-list" element={<GuestBookedList />} />
        <Route path="/manage-rooms" element={<ManageRooms />} />
        <Route path="/manage-bookings" element={<ManageBookings />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;

```

return文の中で、ナビゲーションバーを実装する`<NavBar />`を呼び出しています。各ルートの設定の前に呼び出すことで、どのページに遷移しても必ずナビゲーションバーが表示されるようになります。

次に、画面遷移のための詳細な設定を行なっています。
遷移時に使用するデータを、`path`と`element`で設定します。

```javascript
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/search/:date" element={<Search />} />
  <Route path="/booked-list" element={<GuestBookedList />} />
  <Route path="/manage-rooms" element={<ManageRooms />} />
  <Route path="/manage-bookings" element={<ManageBookings />} />
</Routes>
```

例えば、`Home画面`は「`http://localhost:1234/`を表示するために`Home.js`を使用します」となります。

次に、ナビゲーションバーを実装します。
以下のコードを`frontend/asserts/js/components/NavBar.js`に追加してください。

`frontend/assets/js/components/NavBar.js`

```javascript
import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { useNavigate } from 'react-router-dom';

import { accountBalance, login, logout } from '../near/utils';

const NavBar = () => {
  const navigate = useNavigate();
  const [balance, setBalance] = useState('0');

  const getBalance = async () => {
    if (window.accountId) {
      setBalance(await accountBalance());
    }
  };

  useEffect(() => {
    getBalance();
  });

  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Container>
        <Navbar.Brand href="/">HOTEL BOOKING</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto"></Nav>
          <Nav>
            {/* NEAR Walletに接続されていない時 */}
            {!window.accountId && (
              <Button onClick={login} variant="outline-light">
                Connect Wallet
              </Button>
            )}
            {/* NEAR Walletに接続されている時 */}
            {window.accountId && (
              <>
                {/* 残高を表示 */}
                <NavDropdown
                  title={`${balance} NEAR`}
                  id="collasible-nav-dropdown"
                >
                  {/* NEAR testnet アカウントページへのリンク */}
                  <NavDropdown.Item
                    href={`https://explorer.testnet.near.org/accounts/${window.accountId}`}
                  >
                    {window.accountId}
                  </NavDropdown.Item>
                  {/* 予約一覧へのページ遷移 */}
                  <NavDropdown.Item onClick={() => navigate(`/booked-list`)}>
                    Booked List
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item
                    onClick={() => {
                      logout();
                    }}
                  >
                    Disconnect
                  </NavDropdown.Item>
                </NavDropdown>

                {/* ホテルのオーナー向けのメニューを表示 */}
                <NavDropdown
                  title="For hotel owners"
                  id="collasible-nav-dropdown"
                >
                  {/* 部屋を管理するページへ遷移 */}
                  <NavDropdown.Item onClick={() => navigate(`/manage-rooms`)}>
                    Manage Rooms
                  </NavDropdown.Item>
                  {/* 予約を管理するページへ遷移 */}
                  <NavDropdown.Item
                    onClick={() => navigate(`/manage-bookings`)}
                  >
                    Manage Bookings
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  {/* HOMEへのリンク */}
                  <NavDropdown.Item href="/">Home</NavDropdown.Item>
                </NavDropdown>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;

```

内容を見ていきましょう。

NEAR Walletへの接続や残高を取得する関数をインポートします。

```javascript
import { accountBalance, login, logout } from '../near/utils';
```

NEAR Walletに接続をすると、`window.accountId`にアカウントIDが設定されます。ここでは、if文でチェックをして設定されていたらアカウントの残高を取得しています。

```javascript
// ログインしたアカウントのNEAR残高を取得
const getBalance = async () => {
  if (window.accountId) {
    setBalance(await accountBalance());
  }
};
```

returnの中では、表示するナビゲーションバーの設定をしています。NEAR Walletに接続されているかどうかで、表示を切り替えます。

接続されていない時

![](/public/images/NEAR-Hotel-Booking-dApp/section-3/3_2_1.png)

接続されている時

![](/public/images/NEAR-Hotel-Booking-dApp/section-3/3_2_2.png)

画面への遷移はメニューをクリックした時に実行されます。`navigate()`の中に遷移したいパスを設定します。設定するパスは、`App.js`内で`path=`に指定したものになります。

```javascript
<NavDropdown.Item onClick={() => navigate(`/booked-list`)}>
  Booked List
</NavDropdown.Item>
```

最後に、画面遷移が確認できるよう遷移先のページを簡単に実装します。

`frontend/assets/js/pages/GuestBookedList.js`

```javascript
import React from "react";

const GuestBookedList = () => {
    return (
        <div>
            <h1>GuestBookedList</h1>
        </div>
    )
}

export default GuestBookedList;
```

`frontend/asserts/js/pages/Home.js`

```js
import React from "react";

const Home = () => {
    return (
        <div>
            <h1>Home</h1>
        </div>
    )
}

export default Home;
```

`frontend/assets/js/pages/ManageBookings.js`

```js
import React from "react";

const ManageBookings = () => {
    return (
        <div>
            <h1>ManageBookings</h1>
        </div>
    )
}

export default ManageBookings;
```

`frontend/assets/js/pages/ManageRooms.js`

```js
import React from "react";

const ManageRooms = () => {
    return (
        <div>
            <h1>ManageRooms</h1>
        </div>
    )
}

export default ManageRooms;
```

`frontend/assets/js/pages/Search.js`

```js
import React from "react";

const Search = () => {
    return (
        <div>
            <h1>Search</h1>
        </div>
    )
}

export default Search;
```

### ✅ 動作確認をしてみよう

ではここでwebアプリケーションを起動し、画面遷移がきちんと実行できるかを確認してみましょう。

以下のコマンドを実行してwebアプリケーションを起動します。

```
yarn dev
```

最初に`Home`が表示されます。

![](/public/images/NEAR-Hotel-Booking-dApp/section-3/3_2_3.png)
右上のボタンから、NEAR Walletに接続してみましょう。アカウントは任意のもので大丈夫です。

ナビゲーションバーの表示が変わったら、メニューから画面遷移を確認してみましょう！
![](/public/images/NEAR-Hotel-Booking-dApp/section-3/3_2_4.png)
![](/public/images/NEAR-Hotel-Booking-dApp/section-3/3_2_5.png)
![](/public/images/NEAR-Hotel-Booking-dApp/section-3/3_2_6.png)

このように画面がきちんと遷移していれば成功です！

なお、`Search画面`への遷移は、このセクションの`Lesson 5 - 部屋の検索・予約ができるようにしよう`で確認します。

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

次のレッスンに進み、必要なコンポーネントのデザインを準備していきましょう！
