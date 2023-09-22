### 📁 internet identity キャニスターを準備しよう

今回のプロジェクトでは、ユーザーの認証に`Internet Identity`を使用します。

**Internet Identity とは？**

Internet Identityは、ICPがサポートするユーザー認証のフレームワークです。ユーザーは、認証にラップトップの指紋センサーや顔認証システムなどのデバイスと**アンカー（Anchor）**と呼ばれる数字を紐付けることができます。その後、アンカーに紐づけたデバイスを利用して、さまざまなアプリケーションにサインアップし認証を行うことができます。詳しくはこちらの[ドキュメント](https://internetcomputer.org/docs/current/tokenomics/identity-auth/what-is-ic-identity)を参照してください。

それでは、準備をしていきましょう！

`Internet Identity`用のキャニスター（Wasmモジュール）をGithubの[リリースページ](https://github.com/dfinity/internet-identity/releases)から取得することができます。今回は、`dfx.json`ファイル内にモジュールへのパスを直接指定し、`Internet Identity`キャニスターをデプロイしようと思います。

新たなキャニスターを追加するので、`dfx.json`ファイルを編集しましょう。以下を参考に、`internet_identity_div`というキャニスター名と読み込むファイルのパスを指定しましょう。ここでは、`"SilverDIP20"`と`"icp_basic_dex_frontend"`の間に追記しています。

[dfx.json]

```json
"SilverDIP20": {
  "main": "src/DIP20/motoko/src/token.mo",
  "type": "motoko"
},
"internet_identity_div": {
  "type": "custom",
  "wasm": "https://github.com/dfinity/internet-identity/releases/latest/download/internet_identity_dev.wasm.gz",
  "candid": "https://github.com/dfinity/internet-identity/releases/latest/download/internet_identity.did"
},
"icp_basic_dex_frontend": {
```

### 👤 認証ボタンを実装しよう

さて、ここからUIの作成を行なっていきましょう。まずは以下のようなヘッダーを作成します。ボタンを押したときに先ほど設定をしたInternet IdentityキャニスターにアクセスをしてユーザーのIDが取得できるようにします。

![](/public/images/ICP-Basic-DEX/section-3/3_2_1.png)

ここで実装する機能は、2つあります。

- ボタンが押されたときに、`Internet Identity`キャニスターを呼び出す
- 認証したユーザーのIDを取得する

まずは、機能を実装するファイルを作成します。

```
mkdir ./src/icp_basic_dex_frontend/src/components && touch ./src/icp_basic_dex_frontend/src/components/Header.jsx
```

`icp_basic_dex_frontend/src`ディレクトリ下に、`components`ディレクトリと`Header.jsx`ファイルが作成されます。

```diff
 src/
 ├── App.css
 ├── App.jsx
+├── components/
+│   └── Header.jsx
 ├── index.html
 └── index.js
```

それでは、以下のコードを`Header.jsx`ファイルに記述しましょう。

[Header.jsx]

```javascript
import { canisterId as IICanisterID } from '../../../declarations/internet_identity_div';
import { HttpAgent } from '@dfinity/agent';
import { AuthClient } from '@dfinity/auth-client';

export const Header = (props) => {
  const { setUserPrincipal } = props;

  const handleSuccess = async (authClient) => {
    // 認証したユーザーの`identity`を取得
    const identity = await authClient.getIdentity();

    // 認証したユーザーの`principal`を取得
    const principal = identity.getPrincipal();
    setUserPrincipal(principal);

    console.log(`User Principal: ${principal.toString()}`);
  };

  const handleLogin = async () => {
    // アプリケーションが接続しているネットワークに応じて、
    // ユーザー認証に使用するInternet IdentityのURLを決定する
    let iiUrl;
    if (process.env.DFX_NETWORK === "local") {
      iiUrl = `http://localhost:4943/?canisterId=${IICanisterID}`;
    } else if (process.env.DFX_NETWORK === "ic") {
      iiUrl = "https://identity.ic0.app/#authorize";
    } else {
      iiUrl = `https://${IICanisterID}.dfinity.network`;
    }
    // ログイン認証を実行
    const authClient = await AuthClient.create();
    authClient.login({
      identityProvider: iiUrl,
      onSuccess: async () => {
        handleSuccess(authClient);
      },
      onError: (error) => {
        console.error(`Login Failed: , ${error}`);
      },
    });
  };

  return (
    <ul>
      <li>SIMPLE DEX</li>
      <li className="btn-login">
        <button onClick={handleLogin}>Login Internet Identity</button>
      </li>
    </ul>
  );
};
```

ここからは、キャニスターとの接続部分に焦点を当てて説明をしていきます。それでは、コードを見ていきましょう。

ここで重要なのは`handleLogin`関数です。最初に、デプロイを行ったネットワークに応じてアクセスするURLを指定します。

- `local`であれば、デプロイをしたInternet Identityを指定
- `ic`であれば、メインネット専用の認証URLを指定
- 上記以外は、dfinityのウェブサイトを指定します。

URLを設定したら、`AuthClient`の関数を実行していきます。これは`@dfinity/auth-client`から提供される、webアプリケーションをInternet Identity Serviceで認証させるためのシンプルなインタフェースです。`login`関数にURLと、認証が成功・失敗した時の処理をそれぞれ指定することができます。

それでは、次に`Header.jsx`を呼び出す`App.jsx`のファイルを編集します。以下のコードを記述しましょう。

[App.jsx]

```javascript
import "./App.css";
import { useState } from "react";
import { Header } from "./components/Header";

const App = () => {
  const [userPrincipal, setUserPrincipal] = useState();

  return (
    <>
      <Header setUserPrincipal={setUserPrincipal} />
      {/* ログイン認証していない時 */}
      {!userPrincipal && (
        <div className="title">
          <h1>Welcome!</h1>
          <h2>Please push the login button.</h2>
        </div>
      )}
    </>
  );
};

export default App;
```

それでは、実際にデプロイをしてブラウザ上でログイン認証を確認してみたいと思います。

📝 シェルスクリプトを作成しよう

複数のキャニスターをスムーズにデプロイするために、デプロイコマンドをファイルに記述したいと思います。`scripts`ディレクトリ内に新しいファイルを作成します。

```
touch ./scripts/deploy_local.sh
```

作成した`deploy_local.sh`ファイルに以下のコマンドを記述しましょう。

[deploy_local.sh]

```
#!/bin/bash

# 古いコンテンツを削除
dfx stop
rm -rf .dfx

# デプロイを行うユーザーを指定
dfx identity use default
export ROOT_PRINCIPAL=$(dfx identity get-principal)

# ローカルの実行環境を起動
dfx start --clean --background

# キャニスターをデプロイ
# ===== DIP20キャニスター =====
dfx deploy GoldDIP20 --argument='("Token Gold Logo", "Token Silver", "TGLD", 8, 10000000000000000, principal '\"$ROOT_PRINCIPAL\"', 0)'
dfx deploy SilverDIP20 --argument='("Token Silver Logo", "Token Silver", "TSLV", 8, 10000000000000000, principal '\"$ROOT_PRINCIPAL\"', 0)'
export GoldDIP20_PRINCIPAL=$(dfx canister id GoldDIP20)
export SilverDIP20_PRINCIPAL=$(dfx canister id SilverDIP20)

# ===== Internet Identityキャニスター =====
dfx deploy internet_identity_div

# ===== faucetキャニスター =====
dfx deploy faucet
export FAUCET_PRINCIPAL=$(dfx canister id faucet)
# トークンをプールする
dfx canister call GoldDIP20 mint '(principal '\"$FAUCET_PRINCIPAL\"', 100_000)'
dfx canister call SilverDIP20 mint '(principal '\"$FAUCET_PRINCIPAL\"', 100_000)'

# ===== icp_basic_dex_backend =====
dfx deploy icp_basic_dex_backend

# ===== icp_basic_dex_frontend =====
dfx deploy icp_basic_dex_frontend
```

では、スクリプトを実行したいと思います。プロジェクトのルートディレクトリにいることを確認して、以下のコマンドを実行しましょう。

```
bash ./scripts/deploy_local.sh
```

`GoldDIP20`キャニスターから順番に、デプロイされていく様子がターミナル上で確認できます。全てのキャニスターがデプロイされると、以下のように各キャニスターのUIにアクセスするためのURL一覧が出力されます。

```
Deployed canisters.
URLs:
  Frontend canister via browser
    icp_basic_dex_frontend: http://127.0.0.1:4943/?canisterId=rdmx6-jaaaa-aaaaa-aaadq-cai
  Backend canister via Candid interface:
    GoldDIP20: http://127.0.0.1:4943/?canisterId=ryjl3-tyaaa-aaaaa-aaaba-cai&id=rrkah-fqaaa-aaaaa-aaaaq-cai
    SilverDIP20: http://127.0.0.1:4943/?canisterId=ryjl3-tyaaa-aaaaa-aaaba-cai&id=r7inp-6aaaa-aaaaa-aaabq-cai
    faucet: http://127.0.0.1:4943/?canisterId=ryjl3-tyaaa-aaaaa-aaaba-cai&id=rno2w-sqaaa-aaaaa-aaacq-cai
    icp_basic_dex_backend: http://127.0.0.1:4943/?canisterId=ryjl3-tyaaa-aaaaa-aaaba-cai&id=renrk-eyaaa-aaaaa-aaada-cai
    internet_identity_div: http://127.0.0.1:4943/?canisterId=ryjl3-tyaaa-aaaaa-aaaba-cai&id=rkp4c-7iaaa-aaaaa-aaaca-cai
```

一番上に表示されている`icp_basic_dex_frontend:`のURLにアクセスしてみましょう。

![](/public/images/ICP-Basic-DEX/section-3/3_2_2.png)

ヘッダーとメッセージが確認できたらコンソールを立ち上げておき、右上のログインボタンを押してみましょう。

![](/public/images/ICP-Basic-DEX/section-3/3_2_3.png)

このレッスンの最初で設定をしたInternet Identityキャニスターに接続され、自動でInternet Identityと表示された画面が立ち上がります。それでは、認証を行なっていきたいと思います。

`Create Anchor`をクリックしましょう。

![](/public/images/ICP-Basic-DEX/section-3/3_2_4.png)

任意のデバイス名を入力し、`Create`ボタンを押します。

![](/public/images/ICP-Basic-DEX/section-3/3_2_5.png)

数秒待つと、表示された文字を入力するように要求されます。入力後`Confirm`ボタンを押して次に進みます。

![](/public/images/ICP-Basic-DEX/section-3/3_2_6.png)

新しい`Identity Anchor`の作成が完了したと表示されます。それでは、`Continue`ボタンを押して次に進みましょう。

![](/public/images/ICP-Basic-DEX/section-3/3_2_7.png)

リカバリー方法の選択画面が表示されます。作成された`Anchor`に紐づくデバイスを無くしてしまった時の復元方法を選択する画面になります。`Seed Phrase`を選択します。

![](/public/images/ICP-Basic-DEX/section-3/3_2_8.png)

画面が切り替わり、`Seed Phrase`が表示されます。下のチェックボックスにマークをして、`Continue`ボタンを押します。

![](/public/images/ICP-Basic-DEX/section-3/3_2_9.png)

ボタンを押すと自動でブラウザの画面がDEXアプリケーションに切り替わります。メッセージが消えていることと`console.log()`の結果を確認してみましょう。
以下のようなログが確認できたら、ユーザー IDの取得成功です！

```
User Principal: 42iew-bwtbo-6ug3n-k7vur-fzjgy-b33z5-ctdd7-kcqby-3lwee-hsd2s-rqe
```

![](/public/images/ICP-Basic-DEX/section-3/3_2_10.png)

このレッスンで、ユーザー認証機能が実装できました！

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

次のレッスンに進んで、ユーザーのトークン情報を表示する機能を実装しましょう！
