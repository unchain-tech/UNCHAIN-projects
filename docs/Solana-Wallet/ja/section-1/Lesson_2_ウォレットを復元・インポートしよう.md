### 🔐 アカウントへのアクセス

従来のアプリケーションにとってアカウントへのアクセスは重要な機能ですが、今回学ぶアーキテクチャでは、ログインとログアウトのためにパスワードの暗号化と復号化について心配する必要はありません。

公開鍵暗号方式の優れた点は、秘密鍵が事実上、従来のパスワードであることです。暗号アプリケーションのセキュリティは、秘密鍵をパスワードとして使用するよりも高度ですが、特に産業用の強力なウォレットでは、前セクションで学んだウォレット作成の知識を活用して、ウォレットにアクセスする基本機能を実現することができます。

### ⏫ ニーモニックフレーズによるウォレットのインポート

前セクションで`HDウォレット`と呼ばれるタイプのウォレットを作成しました。つまり、12単語のニーモニックフレーズをシードにマッピングすることができます。

アカウントを作成するキーペアはこのシードから派生するので、ニーモニックフレーズ（リカバリフレーズとも言う）さえあれば、ウォレットをインポート、つまりアカウントにアクセスすることができます。

この機能を実現するには、フレーズを使ってシードを生成し、そのシードを使ってキーペアを取得する機能を実装する必要があります。

前セクションでは、`BIP39`ライブラリの`generateMnemonic`関数を用いて、ニーモニックフレーズを生成しました。次に、キーペアを生成するために、そのフレーズを`@solana/web3.js`の`Keypair`クラスが使用できるシードに変換して、アカウントへのアクセスを許可するキーペアを生成する必要がありました。

### 🌱 ニーモニックフレーズを使ってシードを生成する

前セクションで生成したニーモニックフレーズを覚えていれば、それをシードに変換し、`Keypair`の`fromSeed`メソッドを利用してアカウントにアクセスすることができます。

※ニーモニックフレーズを忘れた場合は、ウォレットを生成ボタンを押下し、フレーズを取得しましょう。

```javascript
const inputMnemonic = "ニーモニックフレーズ（12語）";
const seed = Bip39.mnemonicToSeedSync(inputMnemonic).slice(0, 32);
const importedAccount = Keypair.fromSeed(seed);
```

この数行のコードで、ニーモニックフレーズさえあれば、ユーザーがどのデバイスからでも自分のアカウントにアクセスできるようになります。

実際には、ニーモニックフレーズはフォームから入力します。以下のように`handleImport`関数を定義して、フォームから入力されたフレーズをもとに、ウォレットをインポートできるようにしましょう。

```javascript
const handleImport = (e) => {
  e.preventDefault();
  const inputMnemonic = e.target[0].value.trim().toLowerCase();
  console.log('inputMnemonic', inputMnemonic);

  const seed = Bip39.mnemonicToSeedSync(inputMnemonic).slice(0, 32);

  const importedAccount = Keypair.fromSeed(seed);
  setAccount(importedAccount);
};
```

そして、ニーモニックフレーズを入力するフォームと、インポートボタンをレンダリングします。
フォームの`onSubmit`では、上記で定義した`handleImport`関数を実行するようにしましょう。

```javascript
<form onSubmit={handleImport} className="my-6">
  <div className="flex items-center border-b border-indigo-500 py-2">
    <input
      type="text"
      className="w-full text-gray-700 mr-3 p-1 focus:outline-none"
      placeholder="シークレットリカバリーフレーズ"
    />
    <input
      type="submit"
      className="p-2 text-white bg-indigo-500 focus:ring focus:ring-indigo-300 rounded-lg cursor-pointer"
      value="インポート"
    />
  </div>
</form>
```

### ✅ 動作確認

おめでとうございます!これでウォレットのインポート機能が完成しました。

実際にニーモニックフレーズを入力して`インポート`ボタンを押下してみてください。
`My Wallet`の下にインポートしたウォレットのアドレスが表示されたら成功です!

### 📝 このセクションで追加したコード

```diff
     setAccount(newAccount);
   };

+  const handleImport = (e) => {
+    e.preventDefault();
+    const inputMnemonic = e.target[0].value.trim().toLowerCase();
+    console.log('inputMnemonic', inputMnemonic);
+
+    const seed = Bip39.mnemonicToSeedSync(inputMnemonic).slice(0, 32);
+
+    const importedAccount = Keypair.fromSeed(seed);
+    setAccount(importedAccount);
+  };
+
   return (
     <div className="p-10">
       <h1 className="text-5xl font-extrabold tracking-tight text-gray-900">
@@ -61,6 +72,20 @@ export default function Home() {

       <div>
         <h2 className="p-2 border-dotted border-l-4 border-l-indigo-400">STEP2: 既存のウォレットをインポートする</h2>
+        <form onSubmit={handleImport} className="my-6">
+          <div className="flex items-center border-b border-indigo-500 py-2">
+            <input
+              type="text"
+              className="w-full text-gray-700 mr-3 p-1 focus:outline-none"
+              placeholder="シークレットリカバリーフレーズ"
+            />
+            <input
+              type="submit"
+              className="p-2 text-white bg-indigo-500 focus:ring focus:ring-indigo-300 rounded-lg cursor-pointer"
+              value="インポート"
+            />
+          </div>
+        </form>
       </div>

       <hr className="my-6" />
```

### ☕️ 豆知識

みなさんが良く知っているイーサリアム対応の`MetaMask`やSolana対応の`Phantom`のようなウォレットは、初回のアクセスはニーモニックーフレーズを使い、その後のログインはローカルでパスワードを設定する方式になっています🥭 ブラウザを変えたときなどに、再度パスワードを設定する必要があるのは、こういった理由からですね!

### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discordの`#solana-wallet`で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の3点を記載してください ✨

```
1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット
```
---

`My Wallet`の下に表示されているウォレットアドレスをDiscordの`#solana-wallet`にシェアしましょう🎉 次のレッスンでは、フロントエンドに残高を取得する機能を実装します😊
