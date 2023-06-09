### 🚅 フロントエンドのベースを実装しましょう

コード量が多く貼り付ける作業が大変になってしまうのを防ぐため、[本プロジェクト](https://github.com/unchain-dev/AVAX-Subnet)の`packages/client`ディレクトリからファイルやディレクトリごとコピーしてフロントエンドを構築していきます。

[本レポジトリ](https://github.com/unchain-dev/AVAX-Subnet/tree/main)自体をローカルにクローンしてからコピーしたほうが作業が楽かもしれません。

### 📁 `styles`ディレクトリ

`styles`ディレクトリにはcssのコードが入っています。  
全てのページに適用されるよう用意された`global.css`と、ホームページ用の`Home.module.css`があります。

今回はtailwindを使用するので、`Home.module.css`を削除してください。

```
client
└── styles
    └── globals.css
```

### 📁 `public`ディレクトリ

`Next.js`はルートディレクトリ直下の`public`ディレクトリを静的なリソース（画像やテキストデータなど）の配置場所と認識します。  
そのためソースコード内で画像のURLを`/image.png`と指定した場合、 
`Next.js`は自動的に`public`ディレクトリをルートとした`プロジェクトルート/public/image.png`を参照してくれます。

このディレクトリを[本プロジェクト](https://github.com/unchain-dev/AVAX-Subnet)の`packages/client/public`ディレクトリと置き換えてください。

`favicon.ico`: ファビコンになります。お好きな画像で設定したい場合は同じファイル名で保存するとファビコンに設定できます。

あなたのアプリのファビコンをお好きな画像で設定したい場合は、`favicon.ico`という名前で`public/favicon.ico`と置き換えてください。

`background.png`: ホームページの背景画像になります。

tailwindで画像を扱えるように`tailwind.config.js`を以下の内容に書き換えてください。

vscodeがエラーを出す可能性もありますが、気にせず進めて問題ありません。

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        home: "url('../public/background.png')",
      },
    },
  },
  plugins: [],
};
```

```
client
└── public
    ├── background.png
    └── favicon.ico
```

### 📁 `types`ディレクトリ

`types`ディレクトリを[本プロジェクト](https://github.com/unchain-dev/AVAX-Subnet)の`packages/client`ディレクトリからコピーして貼り付けてください。

中身に関しては次のセクションで触れます。

```
client
└── types
    └── ...
```

### 📁 `artifacts`ディレクトリ

`artifacts`ディレクトリを[本プロジェクト](https://github.com/unchain-dev/AVAX-Subnet)の`packages/client`ディレクトリからコピーして貼り付けてください。

中身に関しては次のセクションで触れます。

```
client
└── artifacts
    ├── Bank.json
    └── IAllowList.json
```

### 📁 `utils`ディレクトリ

`utils`ディレクトリを[本プロジェクト](https://github.com/unchain-dev/AVAX-Subnet)の`packages/client`ディレクトリからコピーして貼り付けてください。

🐬 `ethereum.ts`

型定義に厳格なtypescriptで`window.ethereum`を使用するためには、`window`に`ethereum`オブジェクトがあるということを明示する必要があります。  
`MetaMaskInpageProvider`は環境設定時にインストールした`@metamask/providers`から取得した`ethereum`の型定義です。

> 📓 `window.ethereum`とは  
> Web アプリケーション上でユーザーがブロックチェーンネットワークと通信するためには、Web アプリケーションはユーザーのウォレット情報を取得する必要があります。
>
> `window.ethereum`は MetaMask が`window`(JavaScript にデフォルトで存在するグローバル変数)の直下に用意するオブジェクトであり API です。  
> この API を使用して、ウェブサイトはユーザーのイーサリアムアカウントを要求し、ユーザーが接続しているブロックチェーンからデータを読み取り、ユーザーがメッセージや取引に署名するよう求めることができます。

また、`getEthereum`関数を呼び出すと`window`から取り出した`ethereum`オブジェクトを取得できるようにしています。

🐬 `formatter.ts`

`weiToAvax`(or `avaxToWei`)は`wei`と`AVAX`の単位変換を行なっています。  
※ APIでは「1 AVAX = 10^18 wei」で単位変換がされているため、`formatEther`(or `parseEther`)を使用できます。

また、`blockTimeStampToDate`はsolidity内の`block.timestamp`から、フロントエンドで使用する`Date`への変換を行なっています。  
`block.timestamp`は単位がミリ秒で、`Date`は秒単位の時間を元に作成するので`* 1000`を行なっています。

🐬 `compare.ts`

ここでは2つのアドレスを比較する関数を用意しています。

```
client
└── utils
    ├── compare.ts
    ├── ethereum.ts
    └── formatter.ts
```

### 📁 `hooks`ディレクトリ

`hooks`ディレクトリを[本プロジェクト](https://github.com/unchain-dev/AVAX-Subnet)の`packages/client`ディレクトリからコピーして貼り付けてください。

ウォレットやコントラクトの状態を扱うようなカスタムフック(独自で作った[フック](https://ja.reactjs.org/docs/hooks-overview.html))を実装したファイルを保存します。

🐬 `useWallet.ts`

ここでは、ユーザがMetamaskを持っていることの確認とウォレットへの接続機能を実装します。

`connectWallet`はWebアプリがユーザのウォレットにアクセスすることを求める関数です。  
この後の実装でUIにユーザのウォレット接続ボタンを用意し、そのボタンとこの関数を連携します。  
そのため外部で使用できるように返り値の中に含めています。

`checkIfWalletIsConnected`は既にユーザのウォレットとWebアプリが接続しているかを確認する関数です。

また、それぞれの関数内で使用している`eth_requestAccounts`と`eth_accounts`は,空の配列または単一のアカウントアドレスを含む配列を返す特別なメソッドです。  
ユーザーがウォレットに複数のアカウントを持っている場合を考慮して、プログラムはユーザーの1つ目のアカウントアドレスを取得することにしています。

🐬 `useWallet.ts`

ユーザがMetamaskを持っていることの確認とウォレットへの接続機能を実装しています。
 
`connectWallet`はWebアプリがユーザのウォレットにアクセスすることを求める関数です。  
この後の実装でUIにユーザのウォレット接続ボタンを用意し、そのボタンとこの関数を連携します。  
そのため外部で使用できるように返り値の中に含めています。

`checkIfWalletIsConnected`は既にユーザのウォレットとWebアプリが接続しているかを確認する関数です。

また、それぞれの関数内で使用している`eth_requestAccounts`と`eth_accounts`は,空の配列または単一のアカウントアドレスを含む配列を返す特別なメソッドです。  
ユーザーがウォレットに複数のアカウントを持っている場合を考慮して、プログラムはユーザーの1つ目のアカウントアドレスを取得することにしています。

🐬 `useContract.ts`

コントラクトとの接続を行います。

ファイル冒頭には、今回フロントエンドから接続する2つのコントラクトのアドレス`BankAddress`と`TxAllowListAddress`が記載されています。  

`BankAddress`は`Bank`コントラクトのアドレスに後ほど変更します。

`TxAllowListAddress`は（section-1のLesson_3で設定したPreCompileの）`TransactionAllowList`のアドレスになります。  
このアドレス値は固定です。

その下には型の定義があり、その下に`useContract`が定義されています。

主な関数は`getContract`で、接続している`currentAccount`やコントラクトのアドレス・ABIを元にコントラクトに接続し、stateに保存します。

`getBills`関数は、接続した`Bank`コントラクトから全てのBillデータを取得しています。  
取得したBillはフロントエンド内で扱う`BillType`に変換して、`bills`というstateに保存しています。

```
client
└── hooks
    ├── useContract.ts
    └── useWallet.ts
```

### 📁 `context`ディレクトリ

`context`ディレクトリを[本プロジェクト](https://github.com/unchain-dev/AVAX-Subnet)の`packages/client`ディレクトリからコピーして貼り付けてください。

🐬 `CurrentAccountProvider.tsx`

コンテキストを用意しています。  
コンテキストは複数のコンポーネント間を跨いで値を渡せるもので、値にはstateも渡せます。

はじめに以下の部分で先ほど作成した`useWallet()`を使用してウォレット接続に関わるオブジェクトを取得しています。

```ts
const { currentAccount, connectWallet } = useWallet();
```

重要なのは以下です。  
valueに、取得したオブジェクトを渡します。  

```ts
    <CurrentAccountContext.Provider value={[currentAccount, connectWallet]}>
      {children}
    </CurrentAccountContext.Provider>
```

するとこのコンポーネントの子となるコンポーネント(`children`)以下ではどのコンポーネントでもコンテキストからvalueを取得することができます。  
複数のコンポーネント間でstateを共有できます。

後ほどこのコンテキストを使用する実装を他のファイルで行います。

```
client
└── context
    └── CurrentAccountProvider.tsx
```

### 📁 `components`ディレクトリ

`components`ディレクトリを[本プロジェクト](https://github.com/unchain-dev/AVAX-Subnet)の`packages/client`ディレクトリからコピーして貼り付けてください。

こちらにはコンポーネントを実装したファイルを保存していきます。

> 📓 コンポーネントとは  
> UI（ユーザーインターフェイス）を形成する一つの部品のことです。  
> コンポーネントはボタンのような小さなものから,ページ全体のような大きなものまであります。  
> レゴブロックのようにコンポーネントのブロックで UI を作ることで、機能の追加・削除などの変更を容易にすることができます。

📁 `Button`ディレクトリ

🐬 `NavButton.tsx`

ページへリンクするナビゲートボタンを実装しています。

🐬 `AdminButton.tsx`

管理者ページへ進むボタンを実装しています。  

`txAllowList`コントラクトに`readAllowList`を呼び出し、接続しているアカウント`currentAccount`がどの権限を持っているかを確認しています。

`currentAccount`が管理者権限を持っていた場合、管理者ページへリンクしたボタンを表示します。

また、`currentAccount`の権限を表示します。

🐬 `ConnectWalletButton.tsx`

ウォレットへの接続ボタンを実装しています。  
接続されていれば、そのアカウント名を表示します。

🐬 `SubmitButton.tsx`

引数で渡された関数を実行するボタンを実装しています。  

```
client
└── components
    └── Button
        ├── AdminButton.tsx
        ├── ConnectWalletButton.tsx
        ├── NavButton.tsx
        └── SubmitButton.tsx
```

📁 `Card`ディレクトリ

🐬 `ViewBillCard.tsx`

1つのBillの情報を表示するコンポーネントです。  
ボタンが押下された際に引数で渡された関数を実行します。

🐬 `RecipientBillCards.tsx`

`bills`に対してmap関数を実行します。  

関数`callBackFn`内では、billの受取人が`currentAccount`でなかった場合は空のコンポーネントを返却し、そうであった場合はbillの情報を返却します。  
こうすることで`currentAccount`が受取人のbill情報のみ表示するようにしています。

`callBackFn`内ではボタン押下時に`onClickCash`を実行するようにしているため、bill情報に付加されたボタンをユーザが押下すると`onClickCash`内の`cashBill`が呼び出されます。

🐬 `IssuerBillCards.tsx`

`RecipientBillCards`と同じ構成です。  
`currentAccount`が発行者のbill情報のみ表示するようにしています。

🐬 `AllBillCards.tsx`

`RecipientBillCards`と同じ構成です。  
全てのbillの情報を表示します。

🐬 `DishonoredCards.tsx`

不渡りを起こしたアカウントのアドレスをリスト表示するコンポーネントです。

```
client
└── components
    └── Card
        ├── AllBillCards.tsx
        ├── DishonoredCards.tsx
        ├── IssuerBillCards.tsx
        ├── RecipientBillCards.tsx
        └── ViewBillCard.tsx
```

📁 `Field`ディレクトリ

🐬 `InputField.tsx`

入力フォーム内の１つの入力欄を構成するコンポーネントです。

```
client
└── components
    └── Field
        └── InputField.tsx
```

📁 `Form`ディレクトリ

🐬 `IssueBillForm.tsx`

Billを発行する入力フォームを構成するコンポーネントです。

🐬 `AdminForm.tsx`

ネットワーク管理者が使用するフォームを構成するコンポーネントです。  
アドレス値の入力フォームと、そのアドレスに対してトランザクションを提出する権限を付与する関数と剥奪する関数をそれぞれ用意しボタンに実装しています。

```
client
└── components
    └── Form
        ├── AdminForm.tsx
        └── IssueBillForm.tsx
```

📁 `Layout`ディレクトリ

🐬 `Layout.tsx`

レイアウトを構成するコンポーネントです。  
画面左上にナビゲーションボタン、右上にウォレット接続ボタンを表示します。

```
client
└── components
    └── Layout
        └── Layout.tsx
```

### 📁 `pages`ディレクトリ

`pages`ディレクトリの中にはページ単位のコンポーネントが入ります。

このディレクトリを[本プロジェクト](https://github.com/unchain-dev/AVAX-Subnet)の`packages/client`ディレクトリからコピーして貼り付けてください。

🐬 `_app.tsx`

`_app.tsx`ファイルは標準で全てのページの親コンポーネントとなります。  

ここで`CurrentAccountProvider`を使用し、全てのコンポーネントが`CurrentAccountProvider`の子コンポーネントとなります。

つまり本プロジェクトで作成する全てのコンポーネントで、`currentAccount`の参照と`connectWallet`の実行ができます。

🐬 `index.tsx`

本プロジェクトのルートにアクセスすると表示されるページです。  
ホームページを構成します。

🐬 `IssueBill.tsx`、`ViewBills.tsx`、`Admin.tsx`

それぞれ、Bill発行・Bill閲覧・管理者ページを構成します。

```
client
└── pages
    ├── Admin.tsx
    ├── IssueBill.tsx
    ├── ViewBills.tsx
    ├── _app.tsx
    └── index.tsx
```

🖥️ 画面で確認しましょう

それでは`AVAX-Subnet`ディレクトリ直下で以下のコマンドを実行してください！

```
yarn client dev
```

そしてブラウザで`http://localhost:3000 `へアクセスしてください。

以下のような画面が表示されれば成功です！  

![](/public/images/AVAX-Subnet/section-3/3_2_1.png)

画面右上の`Connect to wallet`ボタンを押下するとウォレットと接続することができます。  
⚠️ section-1で設定したネットワークの管理者アカウントで接続してください。ネットワークに`mySubnet`を選択した状態で行ってください。

MetaMaskの承認が終わると、`Connect to wallet`ボタンの部分があなたの接続しているウォレットのアドレスの表示に変更されます。  
今はアラートが表示されるかと思いますが、無視してokを押下してください。

![](/public/images/AVAX-Subnet/section-3/3_2_4.png)

その他各ページはこのようになっております。

![](/public/images/AVAX-Subnet/section-3/3_2_2.png)

![](/public/images/AVAX-Subnet/section-3/3_2_3.png)

![](/public/images/AVAX-Subnet/section-3/3_2_5.png)

### 🌔 参考リンク

> [こちら](https://github.com/unchain-dev/AVAX-Subnet)に本プロジェクトの完成形のレポジトリがあります。  
> 期待通り動かない場合は参考にしてみてください。  

### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discordの`#avalanche`で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の3点を記載してください ✨

```
1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット
```

---

フロントエンドのベースとなるコードが出来ました！  
次のレッスンではコントラクトとフロントエンドを連携する作業に入ります！
