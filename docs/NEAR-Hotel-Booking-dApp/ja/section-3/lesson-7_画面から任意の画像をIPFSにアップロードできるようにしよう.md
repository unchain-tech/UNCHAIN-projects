### 🦄 画面から任意の画像を IPFS にアップロードできるようにしよう (credit: [mashharuki](https://github.com/mashharuki))

このレッスンでは、任意の画像データをIPFSにアップロードする画面を開発します。

🖼 IPFSについては、[ETH-NFT-Maker の Section2-Lesson1](https://unchain-portal.netlify.app/projects/103-ETH-NFT-Maker/section-2-lesson-1)で解説しているのでそちらをご覧ください！

IPFSへのファイルアップロードについては、デスクトップアプリをダウンロードして、手動でも行うことができるのですが、もし画面からボタンを押すだけでアップロードすることができたら使いやすくて便利ですよね！ このレッスンではそのための画面を作成していきます！

今回は、IPFSにアクセスするためのAPIを提供している[Pinata](https://www.pinata.cloud/)を利用します！
![](/public/images/NEAR-Hotel-Booking-dApp/section-4/4_7_1.png)
もしアカウントを作成していない場合は、[Pinata](https://www.pinata.cloud/)にアクセスしてアカウントを作成してください！

アカウントを作成したらいよいよ開発に移ります！
まずは、開発に必要なモジュールを追加でインストールしましょう！
※コマンドは`frontend`配下で実行してください！

```
yarn add --dev axios form-data
```

### axios とは

axiosとは、HTTP通信（データの更新・取得）を簡単に行うことができる、JavaScriptのライブラリです。公開されているAPIの機能を利用してデータを送受信する際に良く使用されるライブラリとなります。

### form-data とは

API等を利用してデータを送信したい場合に、ファイルデータなどの情報を格納したオブジェクトを用意する必要がありますがその際によく利用されるJavaScriptライブラリとなります。今回は画像データを送信する際に使用します。

では、Uoload画面用のコンポーネントファイルを追加していきましょう！
まずは、下記のディレクトリ構造に従ってファイルを追加してください！

```diff
frontend/
  ├─ __mocks__/
  ├─ assets/
  │  ├─ css/
  │  ├─ img/
  │  └─ js/
  │     ├─ components/
+ │     │  ├─ UploadButton.js
  │     ├─ near/
  │     └─ pages/
+ │　　　　　├─ Upload.js
  ├─ App.js
  ├─ index.html
  └─ index.js
```

### 🔑API クレデンシャル情報を取得しよう

さて、コンポーネントを作成していきたいのですがもう一点事前に準備が必要なことがあります！

今回はPinataのAPIを利用するのですが、その際認証情報が必要となります！ その情報を取得して`dev-account.env`ファイルに登録する必要があるのでまずはこの認証情報を取得しましょう！

流れは至ってシンプルです！

```
1. Pinataのサイトにログインする。
2. APIクレデンシャル情報を作成する。
3. クレデンシャル情報をコピー＆ペーストする
```

#### 1. Pinata のサイトにログインする。

事前にアカウントを作成して[https://www.pinata.cloud/](https://www.pinata.cloud/)にアクセスしましょう！

![](/public/images/NEAR-Hotel-Booking-dApp/section-4/4_7_1.png)

#### 2. API クレデンシャル情報を作成する。

次にAPI用のクレデンシャル情報を作成しましょう！
ログイン後のページの右上のメニューボタンから「API Keys」を選択してクリックします！

![](/public/images/NEAR-Hotel-Booking-dApp/section-4/4_7_2.png)

次に表示される画面でAPIのクレデンシャル情報を作成できます。
左上の「+ New Key」ボタンをクリックしましょう！

![](/public/images/NEAR-Hotel-Booking-dApp/section-4/4_7_3.png)

うまくいけば下のような画面が表示されるはずなので必要事項を入力しましょう。
特に制限がなければ全てONにて最後に名前を決めましょう！

![](/public/images/NEAR-Hotel-Booking-dApp/section-4/4_7_4.png)

クレデンシャル情報の作成に成功したら下記の様な画面が出てくるはずです！

![](/public/images/NEAR-Hotel-Booking-dApp/section-4/4_7_5.png)

おめでとうございます！ これでPinataのAPIを利用するためのクレデンシャル情報を作成することができました！

#### 3. クレデンシャル情報をコピー&ペーストする

次に利用するのはここで表示されているAPI KeyとAPI Secretなのでこの2つをコピーしてしまいましょう！
**ここで注意点なのですが、この情報は一度しか表示されないため閉じてしまった場合は作り直す必要があるので忘れずにコピーしてください！**

コピーした情報は、`frontend/neardev/dev-account.env`ファイルに貼り付けます。

```
CONTRACT_NAME=<YOUR_CONTRACT_NAME>
PINATA_API_Key=<YOUR_API_KEY>
PINATA_API_Secret=<YOUR_API_SECRET>
```

ここまで完了したら準備万端です！ いよいよコンポーネントを実装していきます！

### 🔘 ファイルをアップロードするフォームとボタンを実装しよう

次に、ファイルをアップロードするためのフォームとボタンのコンポーネントを作成しましょう！

新しく追加した`UploadButton.js`に以下のコードを追加してください！ ！

```js
import axios from 'axios';
import FormData from 'form-data';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Spinner from 'react-bootstrap/Spinner';

// APIにアクセスするためのベースとなるURL
const baseAPIUrl = 'https://api.pinata.cloud';

// dev-account.envファイルから読み込む環境変数
const { PINATA_API_Key, PINATA_API_Secret } = process.env;

/**
 * UploadButton コンポーネント
 */
const UploadButton = () => {
  // ファイル名を格納するステート変数
  const [fileName, setFileName] = useState('select a file');
  // ファイル本体のデータを格納するステート変数
  const [file, setFile] = useState({});
  // 画像アップロード中であるかどうかを保持するためのフラグ用のステート変数
  const [pendingFlg, setPendingFlg] = useState(false);

  /**
   * ファイル名とファイル本体を保存するための関数
   */
  const saveFile = (e) => {
    setFile(e.target.files[0]);
    setFileName(e.target.files[0].name);
  };

  /**
   * PinataのAPIを利用してIPFSに画像をアップロードするメソッド
   * @param {*} event
   */
  const pinataUploadFile = async (event) => {
    // FormDataオブジェクトを生成
    let postData = new FormData();
    // APIを使って送信するリクエストパラメータを作成する。
    postData.append('file', file);
    postData.append('pinataOptions', '{"cidVersion": 1}');
    postData.append(
      'pinataMetadata',
      `{"name": "${fileName}", "keyvalues": {"company": "nearHotel"}}`,
    );

    try {
      // フラグ ON
      setPendingFlg(true);
      // POSTメソッドでデータを送信する
      const res = await axios.post(
        // APIのURL
        baseAPIUrl + '/pinning/pinFileToIPFS',
        // リクエストパラメータ
        postData,
        // ヘッダー情報
        {
          headers: {
            accept: 'application/json',
            pinata_api_key: `${PINATA_API_Key}`,
            pinata_secret_api_key: `${PINATA_API_Secret}`,
            'Content-Type': `multipart/form-data; boundary=${postData}`,
          },
        },
      );
      console.log(res);
      // CIDを取得
      console.log('CID:', res.data.IpfsHash);
      // フラグ OFF
      setPendingFlg(false);
      // CIDを出力
      alert(`upload Successfull!! CID:${res.data.IpfsHash}`);
    } catch (e) {
      console.error('upload failfull.....：', e);
      alert('upload failfull.....');
    }
  };

  return (
    <>
      {pendingFlg ? (
          {/* 画像データアップロード中に表示するSpinnerコンポーネント */}
          <Spinner animation="border" role="status">
              <span className="visually-hidden">Please wait...</span>
          </Spinner>
      ):(
          <>
            {/* Formコンポーネント */}
            <Form.Group
              controlId="formFile"
              className="mb-3"
              onChange={(e) => saveFile(e)}
            >
              <Form.Label>Please drop or select</Form.Label>
              <Form.Control type="file" />
            </Form.Group>
            {/* Buttonコンポーネント */}
            <Button
              onClick={(e) => pinataUploadFile(e)}
              variant='info'
            >
              Upload Image
            </Button>
          </>
      )}
    </>
  );
}

export default UploadButton;

```

下記のようなフォームとボタンが表示される様になります！

![](/public/images/NEAR-Hotel-Booking-dApp/section-4/4_7_6.png)

追加した内容を見ていきましょう！

ファイルの冒頭で先ほど`dev-account.env`ファイルに設定した環境変数を読み込んでいます。

```js
// dev-account.envファイルから読み込む環境変数
const { PINATA_API_Key, PINATA_API_Secret } = process.env;
```

フォームとボタンの作成、画像アップロード中に表示するスピナーについては全てReact Bootstrapのものを使用しました。`pendingFlg`というステート変数によって画面表示を切り替えるようにしています!

ボタンの色などはお好みで変更できるので自分の一番お気に入りの色に変えてみてください！`variant='info'`の部分をsuccessに変えると緑色になります！

```js
<>
  {pendingFlg ? (
      {/* 画像データアップロード中に表示するSpinnerコンポーネント */}
      <Spinner animation="border" role="status">
          <span className="visually-hidden">Please wait...</span>
      </Spinner>
  ):(
      <>
        {/* Formコンポーネント */}
        <Form.Group
          controlId="formFile"
          className="mb-3"
          onChange={(e) => saveFile(e)}
        >
          <Form.Label>Please drop or select</Form.Label>
          <Form.Control type="file" />
        </Form.Group>
        {/* Buttonコンポーネント */}
        <Button
          onClick={(e) => pinataUploadFile(e)}
          variant='info'
        >
          Upload Image
        </Button>
      </>
  )}
</>
```

**Upload Image**ボタンを押すと、PinataのAPIを呼び出して画像をアップロードするメソッドを実行する様にしています。

呼び出される`pinataUploadFile`メソッドを見ていきましょう。

```js
/**
 * PinataのAPIを利用してIPFSに画像をアップロードするメソッド
 * @param {*} event
 */
const pinataUploadFile = async (event) => {
  // FormDataオブジェクトを生成
  let postData = new FormData();
  // APIを使って送信するリクエストパラメータを作成する。
  postData.append('file', file);
  postData.append('pinataOptions', '{"cidVersion": 1}');
  postData.append(
    'pinataMetadata',
    `{"name": "${fileName}", "keyvalues": {"company": "nearHotel"}}`,
  );
  try {
    // フラグ ON
    setPendingFlg(true);
    // POSTメソッドでデータを送信する
    const res = await axios.post(
      // APIのURL
      baseAPIUrl + '/pinning/pinFileToIPFS',
      // リクエストパラメータ
      postData,
      // ヘッダー情報
      {
        headers: {
          accept: 'application/json',
          pinata_api_key: `${PINATA_API_Key}`,
          pinata_secret_api_key: `${PINATA_API_Secret}`,
          'Content-Type': `multipart/form-data; boundary=${postData}`,
        },
      },
    );
    console.log(res);
    // CIDを取得
    console.log('CID:', res.data.IpfsHash);
    // フラグ OFF
    setPendingFlg(false);
    // CIDを出力
    alert(`upload Successfull!! CID:${res.data.IpfsHash}`);
  } catch (e) {
    console.error('upload failfull.....：', e);
    alert('upload failfull.....');
  }
};
```

このメソッドは、[Pinata の API 公式ドキュメント](https://docs.pinata.cloud/pinata-api/pinning/pin-file-or-directory)を参考にして作成しました。

呼び出すAPIエンドポイントの情報、フォームデータ、ヘッダー情報を定義して、最後に`axios`ライブラリの`post`メソッドを利用してAPI機能を実行する様になっています！

そして成功した場合には、画面上にアップロードした画像の`CID`を表示する様にしています！

これで画面から画像をアップロードできるフォームとボタンのコンポーネントは準備ができました！

### Upload 画面を作成しよう

次は、前の部分で作成した`UploadButton`コンポーネントを使って`Upload`画面を作成していきます！

`frontend/assets/js/pages/Upload.js`を開いて次のように実装してみてください！

```js
import React from "react";
import UploadButton from "../components/UploadButton";

/**
 * Uplaodコンポーネント
 */
const Upload = () => {
  return (
    <>
      <div className="text-center" style={{ margin: "200px" }}>
        <h1>You can upload Room image!!</h1>
        <UploadButton />
      </div>
    </>
  );
};

export default Upload;
```

内容としては至ってシンプルでファイルの先頭で先ほど作成した`UploadButton`コンポーネントを読み込んで画面の見出しの下に配置しただけになります！

これでUpload画面が実装できました！ 画面は次の様に表示されます！

![](/public/images/NEAR-Hotel-Booking-dApp/section-4/4_7_8.png)

### 画面遷移の機能を拡張しよう

さてUpload画面用のコンポーネントは作成しましたが、完成まであと一歩です！

今のままではUpload画面に遷移できないので`NavBar`コンポーネントに設定を追加してあげる必要があります。

設定は、`App.js`と`NavBar.js`の2ヶ所を変更するだけです！

まずは、`NavBar.js`から修正します！ 次のように修正してください。

```diff
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
+                 {/* UPLOADへのリンク */}
+                 <NavDropdown.Item href="/upload">Upload</NavDropdown.Item>
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

次に`App.js`を修正しましょう！
importの部分と`Routes`コンポーネントを次の様に修正してください。

```diff
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import NavBar from './assets/js/components/NavBar';
import GuestBookedList from './assets/js/pages/GuestBookedList';
import Home from './assets/js/pages/Home';
import ManageBookings from './assets/js/pages/ManageBookings';
import ManageRooms from './assets/js/pages/ManageRooms';
import Search from './assets/js/pages/Search';
+import Upload from "./assets/js/pages/Upload";

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
+       <Route path="/upload" element={<Upload />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
```

これで修正は完了です！ お疲れ様でした!! 🚀🚀🚀🚀🚀🚀
これで画面から好きな画像をIPFSにアップロードできる様になりました！ このアプリで使用してみたい画像があればぜひこの機能を利用して画像をアップロードし、ホテルの部屋を追加してみてください!!

### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discordの`#near`で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の3点を記載してください ✨

```
1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット
```
