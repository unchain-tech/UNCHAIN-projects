### 👤 ユーザーの認証機能を実装しよう

前回までのレッスンで、ノートを管理する機能が準備できました。フロントエンドキャニスターでこの機能を呼び出す前に、ユーザーの認証機能を実装する必要があります。ノートはプリンシパルと紐づけて管理するためです。このレッスンでは、アプリケーションのホーム画面にログインボタンを実装します。

### 📁 internet identity キャニスターを準備しよう

ユーザーの認証に使用する`Internet Identity`を設定していきましょう。

#### Internet Identity とは

Internet Identityは、Internet Computer上で稼働するweb3サービスに匿名で認証できるフレームワークです。

Web上では、主にユーザー名とパスワードによる認証が用いられますが、管理が難しいことや、セキュリティの脆弱性が度々問題になります。これらの問題を解決するため、Internet Computerブロックチェーンは、よりセキュアな認証法であるInternet Identityを導入しました。

ユーザーはFaceIDや指紋センサー、またはYubiKeyを使用したデバイスの認証を活用することで、Internet Computer上のさまざまなアプリケーションにサインアップすることができます（認証の手順に関する詳細はこちらの[ドキュメント](https://internetcomputer.org/how-it-works/web-authentication-identity/)を参照してください）。

それでは早速、認証機能を構築していきましょう！

Internet Identity用のキャニスター（Wasmモジュール）をGitHubの[リリースページ](https://github.com/dfinity/internet-identity/releases)から取得することができます。今回は、`dfx.json`ファイル内にモジュールへのパスを直接指定してInternet Identityキャニスターをデプロイしようと思います。

新たなキャニスターを追加するので、`dfx.json`を編集します。`"canisters": {}`の中に、`internet_identity`というキャニスター名とその設定を追加しましょう。

```json
{
  "canisters": {
    "encrypted_notes_backend": {
      ...
    },
    "encrypted_notes_frontend": {
      ...
    },
    "internet_identity": {
      "candid": "https://github.com/dfinity/internet-identity/releases/latest/download/internet_identity.did",
      "wasm": "https://github.com/dfinity/internet-identity/releases/latest/download/internet_identity_dev.wasm.gz",
      "remote": {
        "id": {
          "ic": "rdmx6-jaaaa-aaaaa-aaadq-cai"
        }
      },
      "type": "custom"
    }
  },
  "defaults": {
```

これで、Internet Identityキャニスターの準備は完了です。

### 🤖 ログインボタンを実装しよう

それでは、ログインボタンを実装していきましょう。実装には[`@dfinity/auth-client`](https://agent-js.icp.xyz/auth-client/index.html)というライブラリを使用します。

@dfinity/auth-clientは、WebアプリケーションをInternet Identityで認証するためのインタフェースを提供しています。ライブラリの[ドキュメント](https://agent-js.icp.xyz/auth-client/index.html)で、"login"と検索すると[`AuthClient.login`](https://agent-js.icp.xyz/auth-client/classes/AuthClient.html#login)が出てきます。

![](/public/images/ICP-Encrypted-Notes/section-1/1_3_1.png)

参照してみると、これはAuthClientクラスから提供されるメソッドで「Internet Identityで認証するための新しいウィンドウを開く」とあります。ログインボタンが押されたときに呼び出すことで、ユーザーの認証機能に接続することができそうです。

![](/public/images/ICP-Encrypted-Notes/section-1/1_3_2.png)

exampleのコードを確認すると、loginの前に[`AuthClient.create`](https://agent-js.icp.xyz/auth-client/classes/AuthClient.html#create)を呼び出しています。createメソッドもドキュメントに記載がありますが、「認証とアイデンティティを管理する`AuthClient`を作成する」メソッドのようです。

createメソッドを実行することで、`AuthClient`というオブジェクトが作成されてloginなどのメソッドを呼び出すことができるようになります。

![](/public/images/ICP-Encrypted-Notes/section-1/1_3_3.png)

![](/public/images/ICP-Encrypted-Notes/section-1/1_3_4.png)

ですのでloginメソッドの例にあったように、まずはcreateメソッドを呼び出してAuthClientを作成し、loginメソッドを呼び出すという流れになります。

```tsx
const authClient = await AuthClient.create();
authClient.login({
  onSuccess: async () => {
    // 認証が成功したときの処理
  },
  onError: (error) => {
    // 認証が失敗したときの処理
  },
});
```

loginメソッドに戻って引数を確認してみましょう。すべてがオプションですが、`identityProvider`という引数にデフォルト値が設定されています。新しいウィンドウが開かれる際に、この引数で指定したURLにアクセスします。

![](/public/images/ICP-Encrypted-Notes/section-1/1_3_5.png)

ローカル環境にデプロイをする開発用のInternet Identityを使用したいので、下記のようにURLを設定します。

```tsx
const iiUrl = `http://${process.env.INTERNET_IDENTITY_CANISTER_ID}.localhost:4943`;
```

最後に、loginメソッドが成功したときと失敗したときの処理を考えます。成功時にはInternet Identityの値を取得したいので、利用できそうなメソッドを探してみると[`getIdentity`](https://agent-js.icp.xyz/auth-client/classes/AuthClient.html#getIdentity)メソッドが見つかります。

![](/public/images/ICP-Encrypted-Notes/section-1/1_3_6.png)

```tsx
const identity = authClient.getIdentity();
```

それでは、ここまでの内容をフロントエンドキャニスターに実装していきましょう！ ここからは、`src/encrypted_notes_frontend`ディレクトリ内のファイルを編集していきます。

まずは`src/hooks/`内の`authContext.ts`を更新します。このファイルには、ユーザーの情報を管理するためのステートや関数が[Context](https://react.dev/learn/passing-data-deeply-with-context)を用いて定義されています。

`login`関数の`/** STEP1: 認証機能を実装します。 */`を下記のように更新しましょう。

```tsx
  const login = async (): Promise<void> => {
    /** STEP1: 認証機能を実装します。 */
    const iiUrl = `http://${process.env.INTERNET_IDENTITY_CANISTER_ID}.localhost:4943`;

    return new Promise((resolve, reject) => {
      // AuthClientオブジェクトを作成します。
      AuthClient.create()
        .then((authClient) => {
          // 認証画面を開きます。
          authClient.login({
            identityProvider: iiUrl,
            onSuccess: async () => {
              try {
                await setupService(authClient);
                resolve();
              } catch (err) {
                reject(err);
              }
            },
            onError: (err) => {
              reject(err);
            },
          });
        })
        .catch(reject);
    });
  };
```

続いて、`authClient.login`が成功した際に呼び出す`setupService`関数を更新しましょう。この関数はlogin関数の上に定義されています。認証が成功したときに行いたいことは、ユーザーのデータを取得することです。`/** STEP2: 認証したユーザーのデータを取得します。 */`の下に下記のコードを追加します。

```tsx
    /** STEP2: 認証したユーザーのデータを取得します。 */
    const identity = authClient.getIdentity();
```

認証に成功したユーザーのデータ（identity）を取得します。これは後にInternet Computerとの対話で用います。

この戻り値identityは[Identityインタフェース](https://github.com/dfinity/agent-js/blob/b7abf4a9ab43b12e0d0c5d810dbc0336e11c29f4/packages/agent/src/auth.ts#L38-L51)のオブジェクトとなっており、Identityが表すプリンシパルを取得できる`getPrincipal`メソッドを提供しています。下記のようにして、認証したユーザーのプリンシパルを取得することもできます。

```tsx
// 例）
    const principal = identity.getPrincipal();
    console.log(`User principal: ${principal.toString()}`);
```

login関数が実装できました。では、ログインボタンを押したらこの関数が呼び出されるようにしましょう。

`routes/home/index.tsx`の`Home`コンポーネントを更新します。このコンポーネントは、アプリケーションを立ち上げた際に最初に表示されるページ（'/'）を提供します。まずは下記のインポート文を追加しましょう。

```tsx
import { useAuthContext } from '../../hooks/authContext';
```

次に、login関数を呼び出すためにHomeコンポーネント内に下記を追加します。

```tsx
export const Home = () => {
  // ===== 下記を追加します。=====
  const { login } = useAuthContext();
```

では、`handleLogin`関数を更新しましょう。

```tsx
  const handleLogin = async () => {
    setIsLoading(true);
    try {
      await login();
      showMessage({
        title: 'Authentication succeeded',
        duration: 2000,
        status: 'success',
      });
      navigate('/notes');
    } catch (err) {
      showMessage({ title: 'Failed to authenticate', status: 'error' });
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
```

login関数を呼び出して認証が成功したら、`showMessage()`関数を用いてメッセージを表示します（showMessage()はhooks/useMessage.tsに定義されたカスタムフックです）。その後`navigate()`で`/notes`に移動します。認証に失敗した場合、エラーメッセージを表示します。

これで認証ボタンの機能が実装できました。

### ✅ 動作確認をしよう

それでは、動作確認をしてみましょう。キャニスターをデプロイして、プロジェクトを起動します。

```
dfx start --clean --background
npm run deploy:local
npm run start
```

Loopbackに表示されたURLにアクセスします。ここでは、ブラウザに[Brave](https://brave.com/ja/)を使用します。

![](/public/images/ICP-Encrypted-Notes/section-1/1_3_7.png)

ホーム画面の「Login with Internet Identity」をクリックします。

![](/public/images/ICP-Encrypted-Notes/section-1/1_3_8.png)

Internet Identityの認証画面が表示されます。ここで、「Create New」をクリックします。

![](/public/images/ICP-Encrypted-Notes/section-1/1_3_9.png)

「Create Passkey」をクリックします。

![](/public/images/ICP-Encrypted-Notes/section-1/1_3_10.png)

表示されている文字を入力し、「Next」をクリックします。

![](/public/images/ICP-Encrypted-Notes/section-1/1_3_11.png)

Internet Identityが表示されます。開発用のIdentityは、10000からとなります。

![](/public/images/ICP-Encrypted-Notes/section-1/1_3_12.png)

これで認証が完了しました。アプリケーションに戻る（または自動で切り替わる）と、ログイン成功のメッセージが表示されて`/notes`に移動していることを確認しましょう。

![](/public/images/ICP-Encrypted-Notes/section-1/1_3_13.png)

### 📝 このレッスンで追加したコード

- `src/hooks/authContext.ts`

```diff
export const useAuthProvider = (): AuthState => {
  const { showMessage } = useMessage();
  const [auth, setAuth] = useState<Auth>(initialize.auth);

  const setupService = async (authClient: AuthClient) => {
    /** STEP2: 認証したユーザーのデータを取得します。 */
+    const identity = authClient.getIdentity();

    /** STEP3: バックエンドキャニスターを呼び出す準備をします。 */

    /** STEP5: CryptoServiceクラスのインスタンスを生成します。 */
    const cryptoService = new CryptoService();

    /** STEP12: デバイスデータの設定を行います。 */

    setAuth({ status: 'SYNCHRONIZING' });
  };

  const login = async (): Promise<void> => {
    /** STEP1: 認証機能を実装します。 */
+    const iiUrl = `http://${process.env.INTERNET_IDENTITY_CANISTER_ID}.localhost:4943`;
+
+    return new Promise((resolve, reject) => {
+      // AuthClientオブジェクトを作成します。
+      AuthClient.create()
+        .then((authClient) => {
+          // 認証画面を開きます。
+          authClient.login({
+            identityProvider: iiUrl,
+            onSuccess: async () => {
+              try {
+                await setupService(authClient);
+                resolve();
+              } catch (err) {
+                reject(err);
+              }
+            },
+            onError: (err) => {
+              reject(err);
+            },
+          });
+        })
+        .catch(reject);
    });
  };
```

- `src/routes/home/index.tsx`

```diff
import { Box, Button, Heading, Text } from '@chakra-ui/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useMessage } from '../../hooks';
+import { useAuthContext } from '../../hooks/authContext';

export const Home = () => {
  const navigate = useNavigate();
+  const { login } = useAuthContext();
  const { showMessage } = useMessage();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
+    setIsLoading(true);
+    try {
+      await login();
+      showMessage({
+        title: 'Authentication succeeded',
+        duration: 2000,
+        status: 'success',
+      });
+      navigate('/notes');
+    } catch (err) {
+      showMessage({ title: 'Failed to authenticate', status: 'error' });
+      console.error(err);
+    } finally {
+      setIsLoading(false);
+    }
+  };

...

```

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

次のレッスンに進み、フロントエンドからノートを追加・取得する機能を実装しましょう！
