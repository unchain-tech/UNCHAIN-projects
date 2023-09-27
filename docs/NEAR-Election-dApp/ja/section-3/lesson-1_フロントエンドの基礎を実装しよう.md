### フロントエンドを編集しよう

ここからはいよいよフロントエンドを編集していくのですが、まずは必要なファイルを追加していきましょう。

注意してほしいところは次の2つです

1. `client/frontend`というディレクトリの中に作成
2. `AppRouter.js`はpagesの中ではなくassetsの中に作成

です。import時のPATHに関わってくるのでこれと同じように作らないと動かなくなります（もし実行時エラーなどが起きたときはこのファイルのPATHが正しいか確認してみてください）。

次にフロントエンドで使う画像（下の4つの画像）をダウンロードしてclient/frontend/assets/imgの中にそれぞれ画像の上に示してある名前で保存しましょう。

`cross.png`

![](/public/images/NEAR-Election-dApp/section-3/3_1_1.png)

`like_icon.png`

![](/public/images/NEAR-Election-dApp/section-3/3_1_2.png)

`top_img.avif`

![](/public/images/NEAR-Election-dApp/section-3/3_1_3.avif)

`unchain_logo.png`

![](/public/images/NEAR-Election-dApp/section-3/3_1_4.png)

最終的に以下のようなファイル構造になっていればOKです！

```diff
  frontend/
  ├── App.js
  ├── __mocks__/
  │   └── fileMock.js
  ├── assets/
+ │   ├── AppRouter.js
+ │   ├── components/
+ │   │   ├── candidate_card.js
+ │   │   ├── input_form.js
+ │   │   └── title.js
  │   ├── css/
  │   │   └── global.css
  │   ├── img/
+ │   │   ├── cross.png
  │   │   ├── favicon.ico
+ │   │   ├── like_icon.png
  │   │   ├── logo-black.svg
  │   │   ├── logo-white.svg
+ │   │   ├── top_img.avif
+ │   │   └── unchain_logo.png
  │   ├── js/
  │   │   └── near/
+ │   └── pages/
+ │       ├── candidate.js
+ │       ├── home.js
+ │       └── voter.js
  ├── index.html
  └── index.js
```

ディレクトリ構造が整理できたら次は下のコマンドで必要なライブラリをインストールしましょう。

この時、フロントエンドのディレクトリ(ここでは`client`)にいることを確認して行ってください。

```
yarn add react-ipfs-image react-router-dom
```

その後`frontend/neardev/dev-account.env`にある変数を以下のように書き換えましょう。`YOUR_WALLET_ID`というのは変数にあなたがdeployしたWalletのIdを入れましょう。

[dev-account.env]

```
CONTRACT_NAME=YOUR_WALLET_ID
```

次に`frontend/assets/js/near/utils.js`に移動して下のように追加してください。

[utils.js]

```javascript
// 以下のように書き換えてください
import { connect, Contract, keyStores, WalletConnection } from 'near-api-js'
import getConfig from './config'
const BN = require("bn.js");

const nearConfig = getConfig(process.env.NODE_ENV || 'development')

// Initialize contract & set global variables
export async function initContract() {
  // Initialize connection to the NEAR testnet
  const near = await connect(Object.assign({ deps: { keyStore: new keyStores.BrowserLocalStorageKeyStore() } }, nearConfig))

  // Initializing Wallet based Account. It can work with NEAR testnet wallet that
  // is hosted at https://wallet.testnet.near.org
  window.walletConnection = new WalletConnection(near)

  window.accountId = window.walletConnection.getAccountId()

  // Initializing our contract APIs by contract name and configuration
  window.contract = await new Contract(window.walletConnection.account(), nearConfig.contractName, {
    viewMethods: ['nft_metadata', 'nft_tokens_for_kind', 'nft_return_candidate_likes', 'check_voter_has_been_added', 'check_voter_has_voted', 'if_election_closed'],

    changeMethods: ['new_default_meta', 'nft_mint', 'nft_transfer', 'nft_add_likes_to_candidate', 'voter_voted', 'close_election', 'reopen_election'],
  })
}

export function logout() {
  window.walletConnection.signOut()
  // reload page
  window.location.replace(window.location.origin + window.location.pathname)
}

export function login() {
  window.walletConnection.requestSignIn(nearConfig.contractName)
}

export async function new_default_meta() {
  await window.contract.new_default_meta(
    { owner_id: window.accountId }
  )
}

export async function nft_mint(title, description, media, media_CID, candidate_name, candidate_manifest, token_kind, receiver_id) {
  await window.contract.nft_mint(
    {
      metadata: {
        title: title,
        description: description,
        media: media,
        media_CID: media_CID,
        candidate_name: candidate_name,
        candidate_manifest: candidate_manifest,
        token_kind: token_kind
      },
      receiver_id: receiver_id,
    },
    300000000000000, // attached GAS (optional)
    new BN("1000000000000000000000000")
  )
}

export async function nft_transfer(receiver_id, token_id) {
  await window.contract.nft_transfer(
    {
      receiver_id: receiver_id,
      token_id: token_id
    },
    300000000000000, // attached GAS (optional)
    new BN("1")// deposit yoctoNEAR
  )
}

export async function nft_add_likes_to_candidate(token_id) {
  await window.contract.nft_add_likes_to_candidate(
    { token_id: token_id }
  )
}

export async function nft_metadata() {
  let contract_metadata = await window.contract.nft_metadata()
  return contract_metadata;
}

export async function nft_tokens_for_kind(token_kind) {
  let tokens_list = await window.contract.nft_tokens_for_kind(
    {
      token_kind: token_kind
    }
  )
  return tokens_list
}

export async function nft_return_candidate_likes(token_id) {
  let num_of_likes = await window.contract.nft_return_candidate_likes(
    {
      token_id: token_id
    }
  )

  return num_of_likes
}

export async function check_voter_has_been_added(voter_id) {
  return await window.contract.check_voter_has_been_added(
    { voter_id: voter_id }
  )
}

export async function check_voter_has_voted(voter_id) {
  return await window.contract.check_voter_has_voted(
    { voter_id: voter_id }
  )
}

export async function voter_voted(voter_id) {
  return await window.contract.voter_voted(
    { voter_id: voter_id }
  )
}

export async function if_election_closed() {
  return await window.contract.if_election_closed()
}

export async function close_election() {
  await window.contract.close_election()
}
export async function reopen_election() {
  await window.contract.reopen_election()
}
```

こちらに使用する関数を書いておきます。

`viewMethods`は返り値を得るだけの関数で、`changeMethods`はコントラクトに格納されているデータを書き換える関数が入ります。

```javascript
contractName, {
    viewMethods: ['nft_metadata', 'nft_tokens_for_kind', 'nft_return_candidate_likes', 'check_voter_has_been_added', 'check_voter_has_voted', 'if_election_closed'],

    changeMethods: ['new_default_meta', 'nft_mint', 'nft_transfer', 'nft_add_likes_to_candidate', 'voter_voted', 'close_election', 'reopen_election'],
  }
```

次に使用する関数をexportします。それぞれ名前を一致させ引数も同じように設定します。

そうすることで関数を使用する時に混乱することがなくなります！

```javascript
export async function new_default_meta() {
  await window.contract.new_default_meta(
    { owner_id: window.accountId }
  )
}

export async function nft_mint(title, description, media, media_CID, candidate_name, candidate_manifest, token_kind, receiver_id) {
  await window.contract.nft_mint(
    {
      metadata: {
        title: title,
        description: description,
        media: media,
        media_CID: media_CID,
        candidate_name: candidate_name,
        candidate_manifest: candidate_manifest,
        token_kind: token_kind
      },
      receiver_id: receiver_id,
    },
    300000000000000, // attached GAS (optional)
    new BN("1000000000000000000000000")
  )
}

export async function nft_transfer(receiver_id, token_id) {
  await window.contract.nft_transfer(
    {
      receiver_id: receiver_id,
      token_id: token_id
    },
    300000000000000, // attached GAS (optional)
    new BN("1")// deposit yoctoNEAR
  )
}

export async function nft_add_likes_to_candidate(token_id) {
  await window.contract.nft_add_likes_to_candidate(
    { token_id: token_id }
  )
}

export async function nft_metadata() {
  let contract_metadata = await window.contract.nft_metadata()
  return contract_metadata;
}

export async function nft_tokens_for_kind(token_kind) {
  let tokens_list = await window.contract.nft_tokens_for_kind(
    {
      token_kind: token_kind
    }
  )
  return tokens_list
}

export async function nft_return_candidate_likes(token_id) {
  let num_of_likes = await window.contract.nft_return_candidate_likes(
    {
      token_id: token_id
    }
  )

  return num_of_likes
}

export async function check_voter_has_been_added(voter_id) {
  return await window.contract.check_voter_has_been_added(
    { voter_id: voter_id }
  )
}

export async function check_voter_has_voted(voter_id) {
  return await window.contract.check_voter_has_voted(
    { voter_id: voter_id }
  )
}

export async function voter_voted(voter_id) {
  return await window.contract.voter_voted(
    { voter_id: voter_id }
  )
}

export async function if_election_closed() {
  return await window.contract.if_election_closed()
}

export async function close_election() {
  await window.contract.close_election()
}
export async function reopen_election() {
  await window.contract.reopen_election()
}
```

いくつか下のような値がついていますが、これらは上がガス代、下はコントラクトにdepositするNEARの値を示しています。

```javascript
    300000000000000,
    new BN("1000000000000000000000000")
```

これでコントラクトの関数を使用できるようになりました。

では次に`App.js`を以下のように書き換えてください。

[App.js]

```javascript
// 以下のように書き換えてください
import 'regenerator-runtime/runtime'
import React from 'react'

import './assets/css/global.css'

import NEARLogo from './assets/img/logo-black.svg'
import UNCHLogo from './assets/img/unchain_logo.png'
import crossLogo from './assets/img/cross.png'
import TopImage from './assets/img/top_img.avif'

import AppRouter from './assets/AppRouter'

import { login, logout } from './assets/js/near/utils'


export default function App() {

  // check if signed in
  if (!window.walletConnection.isSignedIn()) {
    return (
      // sign in screen
      <div className='grid h-3/4 place-items-center'>
        <div className="flex items-center">
          <img src={NEARLogo} className="object-cover h-16 w-16" />
          <img src={crossLogo} className="object-cover h-6 w-6" />
          <img src={UNCHLogo} className="object-cover h-12 w-12 mx-2" />
          <span className="self-center text-3xl font-semibold whitespace-nowrap app_title">Election Dapp</span>
        </div>
        <div className="text-3xl">Have a liberate and fair election!</div>
        <img src={TopImage} className="mb-4 h-5/6 w-1/2" />
        <button className='text-white w-2/5 h-12 bg-gradient-to-r from-rose-500 via-rose-600 to-rose-800 hover:bg-gradient-to-br focus:ring-4 focus:outline-none font-medium rounded-lg text-3xl text-center ' onClick={login}>Sign In</button>
      </div>
    )
  }

  // in case user signed in
  return (
    // home screen
    <div className="bg-white min-h-screen">
      {/* header */}
      <nav className="bg-white pt-2.5">
        <div className="container flex flex-wrap justify-between items-center mx-auto">
          <div className="flex items-center">
            <img src={NEARLogo} className="object-cover h-12 w-12" />
            <img src={crossLogo} className="object-cover h-4 w-4" />
            <img src={UNCHLogo} className="object-cover h-9 w-9 mx-2" />
            <span className="self-center text-3xl font-semibold whitespace-nowrap app_title">Election Dapp</span>
          </div>
          <div className="md:block md:w-auto pt-1">
            <ul className='flex md:flex-row md:space-x-8 md:text-xl md:font-medium'>
              {/* change url as being pushed button */}
              <li><a href='http://localhost:1234/'> Home </a></li>
              <li><a href='http://localhost:1234/candidate'> Add Candidate </a></li>
              <li><a href='http://localhost:1234/voter'> Add Voter </a></li>
              <button className="link text-red-500" style={{ float: 'right' }} onClick={logout}>
                Sign out
              </button>
            </ul>
          </div>
        </div>
      </nav>
      {/* body(change depending on url) */}
      <div className='center'>
        <AppRouter />
      </div>

    </div>
  )
}

```

最初の部分で必要なライブラリや画像のPATHをインポートしています。

一番下の部分では`login, logout`という関数をコントラクトからインポートしています。

```javascript
import 'regenerator-runtime/runtime'
import React from 'react'

import './assets/css/global.css'

import NEARLogo from './assets/img/logo-black.svg'
import UNCHLogo from './assets/img/unchain_logo.png'
import crossLogo from './assets/img/cross.png'
import TopImage from './assets/img/top_img.avif'

import AppRouter from './assets/AppRouter'

import { login, logout } from './assets/js/near/utils'
```

この部分はサインインされていない場合に表示されるUIを記述しています。

`className=""`で書かれている部分は`Tailwind`で書かれているCSSです。

気になるCSSがあればれば[こちら](https://tailwindcss.com/docs/responsive-design)で随時検索してみてください。

この部分の最後のところのボタンは押すとサインインの関数が走るようになっています。

```javascript
if (!window.walletConnection.isSignedIn()) {
    return (
      // sign in screen
      <div className='grid h-3/4 place-items-center'>
        <div className="flex items-center">
          <img src={NEARLogo} className="object-cover h-16 w-16" />
          <img src={crossLogo} className="object-cover h-6 w-6" />
          <img src={UNCHLogo} className="object-cover h-12 w-12 mx-2" />
          <span className="self-center text-3xl font-semibold whitespace-nowrap app_title">Election Dapp</span>
        </div>
        <div className="text-3xl">Have a liberate and fair election!</div>
        <img src={TopImage} className="mb-4 h-5/6 w-1/2" />
        <button className='text-white w-2/5 h-12 bg-gradient-to-r from-rose-500 via-rose-600 to-rose-800 hover:bg-gradient-to-br focus:ring-4 focus:outline-none font-medium rounded-lg text-3xl text-center ' onClick={login}>Sign In</button>
      </div>
    )
  }
```

その次の部分ではほとんどがホームバーのデザインを記述しています。

ホームバーには４つの文字列`Home, Add Candidate, Add Voter, Sign Out`があり、それぞれがURLを変更するようになっています。

最後の`<AppRouter />`がボディの部分のUIとなり、URLによって画面が遷移するようになっています。

```javascript
return (
    // home screen
    <div className="bg-white min-h-screen">
      {/* header */}
      <nav className="bg-white pt-2.5">
        <div className="container flex flex-wrap justify-between items-center mx-auto">
          <div className="flex items-center">
            <img src={NEARLogo} className="object-cover h-12 w-12" />
            <img src={crossLogo} className="object-cover h-4 w-4" />
            <img src={UNCHLogo} className="object-cover h-9 w-9 mx-2" />
            <span className="self-center text-3xl font-semibold whitespace-nowrap app_title">Election Dapp</span>
          </div>
          <div className="md:block md:w-auto pt-1">
            <ul className='flex md:flex-row md:space-x-8 md:text-xl md:font-medium'>
              {/* change url as being pushed button */}
              <li><a href='http://localhost:1234/'> Home </a></li>
              <li><a href='http://localhost:1234/candidate'> Add Candidate </a></li>
              <li><a href='http://localhost:1234/voter'> Add Voter </a></li>
              <button className="link text-red-500" style={{ float: 'right' }} onClick={logout}>
                Sign out
              </button>
            </ul>
          </div>
        </div>
      </nav>
      {/* body(change depending on url) */}
      <div className='center'>
        <AppRouter />
      </div>

    </div>
  )
```

次に`AppRouter.js`を下のように書き換えましょう。

`react-router-dom`というライブラリを使うことでURLによって画面が遷移するようにできます。

`<Router>`というコンポーネント内にあるコンポーネントが`path`のURLに従って表示されることになります。

[AppRouter.js]

```javascript
// 以下を追加してください
import React from "react";
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Home from "./pages/home";
import Candidate from "./pages/candidate";
import Voter from "./pages/voter";

// Change with url
const AppRouter = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={
                    <Home />
                } />
                <Route path="/candidate" element={
                    <Candidate />
                } />
                <Route path="/voter" element={
                    <Voter />
                } />
            </Routes>
        </BrowserRouter>
    )
}

export default AppRouter;
```

ではURLによって変わる３つのコンポーネント`<Home />, <Candidate />, <Voter />`を適当に編集して画面遷移がきちんとされていることを確認しましょう。

pagesにある`home.js, candidate.js, voter.js`を下のように編集しましょう。

[home.js]

```javascript
// 以下のように書き換えてください
import React from "react";

const Home = () => {
    return (
        <div className="text-xl text-green-500">
            Home Screen
        </div>
    )
}

export default Home;
```

[candidate.js]

```javascript
// 以下のように書き換えてください
import React from "react";

const Candidate = () => {
    return (
        <div className="text-xl text-red-500">
            Add Candidate Screen
        </div>
    )
}

export default Candidate;
```

[voter.js]

```javascript
// 以下のように書き換えてください
import React from "react";

const Voter = () => {
    return (
        <div className="text-xl text-blue-500">
            Vote Screen
        </div>
    )
}

export default Voter;
```

次に`Tailwind`の設定をしていきましょう。`frontend/assets/css/global.css`を下のように変えます。

[global.css]

```css
// 以下のように書き換えてください
@tailwind base;
@tailwind components;
@tailwind utilities;

/* global css */
@layer components {
  .title {
    @apply font-semibold text-black text-transparent text-5xl bg-clip-text bg-gradient-to-b py-3;
  }

  .app_title {
    @apply font-extrabold text-transparent text-8xl bg-clip-text bg-gradient-to-r from-red-500 to-yellow-400;
  }

  .center {
    @apply flex justify-center;
  }
  .button {
    @apply bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded;
  }
  .vote_button {
    @apply h-8 px-3 py-0 my-2 font-sans text-xl font-semibold text-white transition ease-in-out bg-rose-600 border-rose-800 rounded shadow-lg drop-shadow-xl shadow-rose-600/50 hover:border-red-600;
  }

  .close_button {
    @apply h-8 px-3 py-0 mt-2 mb-3 font-sans text-xl font-semibold text-white transition ease-in-out bg-rose-900 border-red-800 rounded shadow-lg shadow-rose-600/50 hover:border-purple-600;
  }
}

html {
  font-size: calc(0.9em + 0.5vw);
}

```

ではここでwebアプリを起動させて画面遷移の様子をみていきたいところですが、今のままではもともとあったコントラクトをコンパイル・deployして起動するようになります。

なので`package.json`に移動して以下のように編集しましょう。

その後下のコマンドを実行することによって必要なパッケージをインストールしましょう。

```
yarn install
```

これにより`yarn client dev`が呼び出すコマンドが変わり、`neardev/dev-account.env`に記載したwallet idにdeployされているコントラクトを読みにいけるようになりました

```diff
{
  "name": "client",
  "version": "1.0.0",
  "license": "(MIT AND Apache-2.0)",

  "scripts": {
    "start": "env-cmd -f ./neardev/dev-account.env parcel frontend/index.html --open",
    "dev": "nodemon --watch contract -e ts --exec \"npm run start\""
  },
  "devDependencies": {
    "@babel/core": "~7.18.2",
    "@babel/preset-env": "~7.18.2",
    "@babel/preset-react": "~7.17.12",
    "autoprefixer": "^10.4.7",
    "ava": "^4.2.0",
    "env-cmd": "~10.1.0",
    "near-cli": "~3.3.0",
    "nodemon": "~2.0.16",
    "parcel": "^2.6.0",
    "postcss": "^8.4.14",
    "process": "^0.11.10",
    "react-test-renderer": "~18.1.0",
    "tailwindcss": "^3.1.6",
    "ts-node": "^10.8.0",
    "typescript": "^4.7.2"
  },
  "dependencies": {
    "near-api-js": "~0.44.2",
    "react": "~18.1.0",
    "react-dom": "~18.1.0",
    "react-ipfs-image": "^0.6.0",
    "react-router-dom": "^6.3.0",
    "regenerator-runtime": "~0.13.9"
  },
  "resolutions": {
    "@babel/preset-env": "7.13.8"
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  }
}

```

それでは準備は整ったので下のコマンドをターミナルで実行させてみましょう

```
yarn client dev
```

![](/public/images/NEAR-Election-dApp/section-3/3_1_5.png)
![](/public/images/NEAR-Election-dApp/section-3/3_1_6.png)
![](/public/images/NEAR-Election-dApp/section-3/3_1_7.png)

このように画面がきちんと遷移していれば成功です！

### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discordの`#near`で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の4点を記載してください ✨

```
1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット
```

これで画面遷移とヘッダーのデザインが完成しました。

次のレッスンでは必要なコンポーネントのデザインを準備していきましょう。
