## 🥃 コントラクトの関数を呼び出せるようにしよう！

ここからはフロントエンドを開発していきましょう！

本教材の主眼はコントラクトの作成なので、UI部分の解説は簡略化していることをご了承ください 😔

まずはフロントエンドの開発に必要なライブラリをインポートしましょう。次のコマンドを`packages/client`ディレクトリへ移動した後、ターミナルで実行してください。

```
yarn add react-icons --save
```

```
yarn add --save react-modal @types/react-modal
```

次に環境変数として必要な値を登録しましょう。

ディレクトリ構造において一番上階層(`pages`と同じ階層)に`.env`ファイルを作成して、内容を下のように記述しましょう。

ここではコントラクトアドレスとまだプロフィールを作成していないユーザーのプロフィール画像のURLでそれぞれ`NEXT_PUBLIC_CONTRACT_ADDRESS`, `NEXT_PUBLIC_UNKNOWN_IMAGE_URL`という名前で登録することになります。

取得したコントラクトアドレスをcontract_addressへ代入します（こちら動作確認のためにデプロイした際に行います）。

unknown_imageにはユーザーがデフォルトで設定するプロフィールの画像のURLを記述してください。

ここで注意点ですが、今回使用できるのは[こちら](https://unsplash.com/)にある画像のみです。また、`NEXT_PUBLIC_UNKNOWN_IMAGE_URL`に代入するURLは下のように`https`から全てのURLを記述しましょう！

```
NEXT_PUBLIC_UNKNOWN_IMAGE_URL="https://images.unsplash.com/..."
```

[`.env`]

```
NEXT_PUBLIC_CONTRACT_ADDRESS=contract_address
NEXT_PUBLIC_UNKNOWN_IMAGE_URL=unknown_image
```

下のように代入してみてください。

![](/public/images/ASTAR-SocialFi/section-2/2_1_10.png)

次にさきほどコントラクトを実装して後に更新した`metadata.json`を一番上の階層(`pages`と同じ階層)に加えましょう。

![](/public/images/ASTAR-SocialFi/section-2/2_1_9.png)

次に`linter`の設定をしましょう。linterをきちんと設定しないと無駄な部分にエラーが発生してアプリのデプロイ時に問題があるように写りデプロイができないようになります。

一番上の階層(`pages`と同じ階層)に`.eslintrc.json`ファイルがあるので下のように編集しましょう。

[`eslintrc.json`]

```json
{
  "extends": [
    "plugin:@typescript-eslint/recommended",
    "next",
    "prettier",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended"
  ],
  "rules": {
    "import/order": [
      "error",
      {
        "alphabetize": {
          "order": "asc"
        }
      }
    ]
  }
}
```

その後コードのエディター（vscodeなど）を一度閉じて、再度開いてみましょう。きちんとlinterが動くようになります。

次に環境構築で作成したプロジェクトの一番上の階層に`hooks`と`components`というディレクトリを作成してください。

その後`pages`、`hooks`、`components`を下のようなディレクトリ構造にしてください。

[`pages`]

```
pages/
├── _app.tsx
├── api/
│   └── hello.ts
├── home.tsx
├── index.tsx
├── message.tsx
└── profile.tsx
```

[`hooks`]

```
hooks/
├── connect.tsx
├── FT.tsx
├── messageFunction.tsx
├── postFunction.tsx
└── profileFunction.tsx
```

[`components`]

```
./
├── atoms/
│   ├── appLogo.tsx
│   ├── balance.tsx
│   ├── bigInput.tsx
│   ├── biggerProfileIcon.tsx
│   ├── bottomLogo.tsx
│   ├── closeButton.tsx
│   ├── disconnectButton.tsx
│   ├── inputBox.tsx
│   ├── postButton.tsx
│   ├── profileTitle.tsx
│   ├── sendButton.tsx
│   ├── smallInput.tsx
│   ├── smallerProfileIcon.tsx
│   ├── submitButton.tsx
│   └── walletAddressSelection.tsx
├── bottomNavigation.tsx
├── message.tsx
├── messageRoom.tsx
├── message_member.tsx
├── molecules/
│   ├── formBox.tsx
│   ├── headerProfile.tsx
│   └── profileList.tsx
├── organisms/
│   ├── footer.tsx
│   ├── header.tsx
│   ├── inputGroup.tsx
│   └── messageBar.tsx
├── post.tsx
├── postModal.tsx
├── profileSettingModal.tsx
├── profileSubTopBar.tsx
└── topBar.tsx
```

これらがUIを構成するパーツやフロントで使用する関数を含んだものになります。

では順番にそれぞれのディレクトリについて説明して行きます。

`pages`にはそれぞれの画面全体を記述することになります。ファイルの名前（.tsxを除く）が直接URLの名前となるので、URLがそのファイル名変更されるとそのページが表示されることになります。

`hooks`にはコントラクトで作成した関数をフロントで使用できるようにしたものが記述されます。ウォレットと接続するための関数は`connect.tsx`に記述することになり、他のファイルにはコントラクトの関数が記述することになります。

`components`にはUIで使用するパーツを記述して行きます。今回のプロジェクトでは`アトミックデザイン`という考え方を採用しており、完全ではありませんがこの考え方に沿って構成されています。

アトミックデザインとはアプリを構成するパーツの単位を5つの段階に分けるというもので`Atoms(原子)`,`Molecules(分子)`,`Organism(生体)`,`Template(テンプレート)`,`Pages(ページ)`に分けられ`Atoms(原子)`に近いほど小さく、`Pages`に近いほど大きなパーツになります。

今回はTemplate以外のものを採用して作成しています。詳しくは[こちら](https://spice-factory.co.jp/web/about-atmicdesign/)の記事を参考にしてください。

こんなことをしたらファイルが多すぎて逆にわかりにいのでは？　と思われる方もいるかもしれないんですが、特に`Atoms(原子)`などの小さい単位のものは使い回しができるので重複してコードを書く必要はありませんし、また何処かでエラーが発生した場合にどのパーツでエラーが発生しているか追っていけばいいだけなので対処しやすいというメリットがあります。

次に、フロントエンドで使用する画像をプロジェクトの中に入れておきましょう。

下の画像を添えられている名前の通りに、ディレクトリ構造の一番上の階層にある`public`に保存してください。

[`Astar_logo.png`]

![](/public/images/ASTAR-SocialFi/section-2/2_1_1.png)

[`cross_mark_2_logo-removebg.png`]

![](/public/images/ASTAR-SocialFi/section-2/2_1_2.png)

[`cross_star_2_logo-removebg.png`]

![](/public/images/ASTAR-SocialFi/section-2/2_1_3.png)

[`cross_star_6_logo-removebg.png`]

![](/public/images/ASTAR-SocialFi/section-2/2_1_4.png)

[`unchain_logo.png`]

![](/public/images/ASTAR-SocialFi/section-2/2_1_5.png)

次にNext.jsではURLの画像を参照するためには`next.config.js`に参照したいURLの頭の部分を登録する必要があるので下のように書き換えましょう。

[`next.config.js`]

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["images.unsplash.com", "plus.unsplash.com"],
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
```

これで[unsplash](https://unsplash.com/)の画像やインターネット上にある画像を参照できるようになりました！

それでは早速コントラクトの関数を呼び出す部分である`hooks`ディレクトリの中身を下のように編集して行きましょう。

[`connect.tsx`]

このファイルではコントラクトとの接続に関わるものに関する記述をしていきます。

```ts
import { ApiPromise, WsProvider } from "@polkadot/api";
import { InjectedAccountWithMeta } from "@polkadot/extension-inject/types";
import { Dispatch } from "react";

// コントラクトとの接続を行うために使用するtype
type Props = {
  api: ApiPromise | undefined;
  accountList: InjectedAccountWithMeta[];
  actingAccount: InjectedAccountWithMeta;
  isSetup: boolean;
  setApi: Dispatch<React.SetStateAction<ApiPromise | undefined>>;
  setAccountList: Dispatch<React.SetStateAction<InjectedAccountWithMeta[]>>;
  setActingAccount: Dispatch<
    React.SetStateAction<InjectedAccountWithMeta | undefined>
  >;
  setIsSetup: React.Dispatch<React.SetStateAction<boolean>>;
};

// コントラクトとの接続を行うための関数
export const connectToContract = async (props: Props) => {
  // rpcのURL
  const blockchainUrl = "ws://127.0.0.1:9944";

  // この関数でアカウント情報を取得する
  const extensionSetup = async () => {
    const { web3Accounts, web3Enable } = await import(
      "@polkadot/extension-dapp"
    );
    const extensions = await web3Enable("Polk4NET");
    if (extensions.length === 0) {
      return;
    }
    const accounts = await web3Accounts();
    props.setAccountList(accounts);
    props.setActingAccount(accounts[0]);
    props.setIsSetup(true);
  };

  // この部分でコントラクトに接続
  const wsProvider = new WsProvider(blockchainUrl);
  const connectedApi = await ApiPromise.create({ provider: wsProvider });
  props.setApi(connectedApi);
  await extensionSetup();
};
```

まずは必要なライブラリをインストールしましょう。

`packages/client`ディレクトリへ移動して下記のコマンドを実行しましょう。

```
yarn add @polkadot/api @polkadot/extension-inject @polkadot/extension-dapp
```

順番に見て行きましょう。

下の部分ではコントラクト接続に使用するための引数を`Props`で受け取る値の型を指定しています。

`api`はチェーンと接続した時に取得するもので、これはコントラクトから関数を呼び出す時にも使用します。

`accountList`,`actingAccount`については、それぞれ存在が確認されているアカウント情報のリストと現在接続しているアカウントが入ることになります。

`isSetup`には接続がされているかを確認するための`bool`型の値が入りまします。

それ以降の値は`useState`で取得する`set○○`のような関数で、値をセットするための関数が入ります。

```ts
// コントラクトとの接続を行うために使用するtype
type Props = {
  api: ApiPromise | undefined;
  accountList: InjectedAccountWithMeta[];
  actingAccount: InjectedAccountWithMeta;
  isSetup: boolean;
  setApi: Dispatch<React.SetStateAction<ApiPromise | undefined>>;
  setAccountList: Dispatch<React.SetStateAction<InjectedAccountWithMeta[]>>;
  setActingAccount: Dispatch<
    React.SetStateAction<InjectedAccountWithMeta | undefined>
  >;
  setIsSetup: React.Dispatch<React.SetStateAction<boolean>>;
};
```

ここではブロックチェーンとのやりとりを仲介してくれるRPCのURLを定義しています。

今回はテストネットではなくローカルのRPCを使用するので下のように記述しましょう。

```ts
// rpcのURL
const blockchainUrl = "ws://127.0.0.1:9944";
```

次の部分でアカウント情報を取得しています。それらの取得したアカウントを、この関数を使用するページにおいて`useState`によってセットします。

そして最後に接続が完了したことを伝えるために`setIsSetup`に`true`を入れます。

```ts
// この関数でアカウント情報を取得する
const extensionSetup = async () => {
  const { web3Accounts, web3Enable } = await import("@polkadot/extension-dapp");
  const extensions = await web3Enable("Polk4NET");
  if (extensions.length === 0) {
    return;
  }
  const accounts = await web3Accounts();
  props.setAccountList(accounts);
  props.setActingAccount(accounts[0]);
  props.setIsSetup(true);
};
```

上の`extensionSetup`関数の前にチェーンと接続します。

```ts
// この部分でコントラクトに接続
const wsProvider = new WsProvider(blockchainUrl);
const connectedApi = await ApiPromise.create({ provider: wsProvider });
props.setApi(connectedApi);
await extensionSetup();
```

では次にコントラクトから呼び出す関数の定義を行なっていきましょう！

[`messageFunction.tsx`]

```ts
import { ApiPromise } from "@polkadot/api";
import { ContractPromise } from "@polkadot/api-contract";
import { InjectedAccountWithMeta } from "@polkadot/extension-inject/types";

import abi from "../metadata.json";

// コントラクトの`Message`構造体の型
export type MessageType = {
  message: string;
  senderId: string;
  createdTime: string;
};

// sendMessage関数用の型
type PropsSM = {
  api: ApiPromise | undefined;
  actingAccount: InjectedAccountWithMeta;
  message: string;
  id: string;
};

// getMessage関数用の型
type PropsGML = {
  api: ApiPromise | undefined;
  id: number;
};

// lastMessage関数用の型
type PropsGLM = {
  api: ApiPromise | undefined;
  id: number;
};

// コントラクトアドレスをenvファイルから抽出
const contractAddress: string = process.env
  .NEXT_PUBLIC_CONTRACT_ADDRESS as string;

// メッセージ送信関数
export const sendMessage = async (props: PropsSM) => {
  const { web3FromSource } = await import("@polkadot/extension-dapp");
  const contract = new ContractPromise(props.api!, abi, contractAddress);
  const performingAccount = props.actingAccount;
  const injector = await web3FromSource(performingAccount.meta.source);
  const date = new Date();
  const add_likes = await contract.tx.sendMessage(
    {
      value: 0,
      gasLimit: 18850000000,
    },
    props.message,
    props.id,
    [date.getMonth() + 1, date.getDate()].join("-") +
      " " +
      [
        date.getHours().toString().padStart(2, "0"),
        date.getMinutes().toString().padStart(2, "0"),
      ].join(":")
  );
  if (injector !== undefined) {
    add_likes.signAndSend(
      performingAccount.address,
      { signer: injector.signer },
      (result) => {}
    );
  }
};

// メッセージリストを取得する関数
export const getMessageList = async (props: PropsGML) => {
  const contract = new ContractPromise(props.api!, abi, contractAddress);
  const { gasConsumed, result, output } = await contract.query.getMessageList(
    "",
    {
      value: 0,
      gasLimit: -1,
    },
    props.id,
    1
  );
  if (output !== undefined && output !== null) {
    return output;
  }
  return [];
};

// それぞれのメッセージリストの最後のメッセージを取得する関数
export const getLastMessage = async (props: PropsGLM) => {
  const contract = new ContractPromise(props.api!, abi, contractAddress);
  const { gasConsumed, result, output } = await contract.query.getLastMessage(
    "",
    {
      value: 0,
      gasLimit: -1,
    },
    props.id
  );
  if (output !== undefined && output !== null) {
    return output.toHuman()?.message.toString() ?? "";
  }
};
```

まずは必要なライブラリを下のコマンドをターミナルで実行することによってインストールしましょう。

```
yarn add @polkadot/api-contract
```

次に`metadata.json`については先ほど作成した`astar_sns_contract`プロジェクトの`metadata.json`をディレクトリ構造の一番上の階層にコピー&ペーストしましょう。

ではコードを順番に見て行きましょう。

まずは初めに定義している`type`についてです。

`MessageType`はコントラクトで定義している`Message`という構造体のそれぞれの値の型を定義しています。

それ以降はそれぞれ関数の略称（ex: sendMessage->PropsSM）をPropsにつけて型を定義しています。

```ts
export type MessageType = {
  message: string;
  senderId: string;
  createdTime: string;
};

// type for sendMessage function
type PropsSM = {
  api: ApiPromise | undefined;
  actingAccount: InjectedAccountWithMeta;
  message: string;
  id: string;
};

// type for getMessage function
type PropsGML = {
  api: ApiPromise | undefined;
  id: number;
};

// type for lastMessage function
type PropsGLM = {
  api: ApiPromise | undefined;
  id: number;
};

const contractAddress: string = process.env
  .NEXT_PUBLIC_CONTRACT_ADDRESS as string;
```

次にコントラクトから呼び出す関数についてです。コントラクトには2種類あり、`コントラクトに情報を書き込む関数`と`コントラクトから情報を引き出す関数`があります。

まず前者の関数では下のように記述します。ガス代と引数を指定する必要があります。

```ts
export const sendMessage = async (props: PropsSM) => {
  const { web3FromSource } = await import("@polkadot/extension-dapp");
  const contract = new ContractPromise(props.api!, abi, contractAddress);
  const performingAccount = props.actingAccount;
  const injector = await web3FromSource(performingAccount.meta.source);
  const date = new Date();
  const add_likes = await contract.tx.sendMessage(
    {
      value: 0,
      gasLimit: 18850000000,
    },
    props.message,
    props.id,
    [date.getMonth() + 1, date.getDate()].join("-") +
      " " +
      [
        date.getHours().toString().padStart(2, "0"),
        date.getMinutes().toString().padStart(2, "0"),
      ].join(":")
  );
  if (injector !== undefined) {
    add_likes.signAndSend(
      performingAccount.address,
      { signer: injector.signer },
      (result) => {}
    );
  }
};
```

後でも注意するのですが、ガス代が足りなかったり多すぎたりするときちんとしたコードが書けていてもきちんとトランザクションが行われないという不具合が起きます。

ではどれくらいのガス代に設定すればいいのかということですが方法は2つあります。

1つはプロジェクト内で計算するというものでもう1つは`Polkadot.jsサイト`で確かめるというものです。

今回は後者で行います。下のように情報を書き込む関数には`exec`ボタンがあるのでそれを押せばガス代の最大値が出てくるので、それと同じ値を入れましょう。

![](/public/images/ASTAR-SocialFi/section-2/2_1_6.png)
![](/public/images/ASTAR-SocialFi/section-2/2_1_7.png)

次の2つはコントラクトから情報を引き出すタイプの関数です。こちらはガス代を消費することはないのでガス代の欄は`-1`に設定しておけばOKです。

最終的な結果は`output`という変数に入るのでそれをフロントに反映させることになります。

```ts
export const getMessageList = async (props: PropsGML) => {
  const contract = new ContractPromise(props.api!, abi, contractAddress);
  const { gasConsumed, result, output } = await contract.query.getMessageList(
    "",
    {
      value: 0,
      gasLimit: -1,
    },
    props.id,
    1
  );
  if (output !== undefined && output !== null) {
    return output;
  }
  return [];
};

// それぞれのメッセージリストの最後のメッセージを取得する関数
export const getLastMessage = async (props: PropsGLM) => {
  const contract = new ContractPromise(props.api!, abi, contractAddress);
  const { gasConsumed, result, output } = await contract.query.getLastMessage(
    "",
    {
      value: 0,
      gasLimit: -1,
    },
    props.id
  );
  if (output !== undefined && output !== null) {
    return output.toHuman()?.message.toString() ?? "";
  }
};
```

次にFT（Fungible Token）機能に関するファイル`FT.tsx`,投稿機能に関するファイル`postFunction.tsx`,プロフィールに関するファイル`profileFunction.tsx`も同様に記述していきましょう。

基本は`messageFunction.tsx`に記述したものと書き方は同じなので説明は省略します。

[`FT.tsx`]

```ts
import { ApiPromise } from "@polkadot/api";
import { ContractPromise } from "@polkadot/api-contract";
import { InjectedAccountWithMeta } from "@polkadot/extension-inject/types";
import { Dispatch } from "react";

import abi from "../metadata.json";

type PropsBO = {
  api: ApiPromise | undefined;
  actingAccount: InjectedAccountWithMeta;
  setBalance: Dispatch<React.SetStateAction<string>>;
};

type PropsTF = {
  api: ApiPromise | undefined;
  actingAccount: InjectedAccountWithMeta;
  amount: number;
};

type PropsDRL = {
  api: ApiPromise | undefined;
  actingAccount: InjectedAccountWithMeta;
};

const contractAddress: string = process.env
  .NEXT_PUBLIC_CONTRACT_ADDRESS as string;

export const balanceOf = async (props: PropsBO) => {
  const contract = new ContractPromise(props.api!, abi, contractAddress);
  const { gasConsumed, result, output } = await contract.query.balanceOf(
    "",
    {
      value: 0,
      gasLimit: -1,
    },
    props.actingAccount.address
  );
  if (output !== undefined && output !== null) {
    props.setBalance(output.toHuman()?.toString());
  }
};

export const transfer = async (props: PropsTF) => {
  const { web3FromSource } = await import("@polkadot/extension-dapp");
  const contract = new ContractPromise(props.api!, abi, contractAddress);
  const performingAccount = props.actingAccount;
  const injector = await web3FromSource(performingAccount.meta.source);
  const transfer = await contract.tx.transfer(
    {
      value: 0,
      gasLimit: 31518000000,
    },
    props.amount
  );
  if (injector !== undefined) {
    transfer.signAndSend(
      performingAccount.address,
      { signer: injector.signer },
      (result) => {}
    );
  }
};

export const distributeReferLikes = async (props: PropsDRL) => {
  const { web3FromSource } = await import("@polkadot/extension-dapp");
  const contract = new ContractPromise(props.api!, abi, contractAddress);
  const performingAccount = props.actingAccount;
  const injector = await web3FromSource(performingAccount.meta.source);
  const transfer = await contract.tx.distributeReferLikes({
    value: 0,
    gasLimit: 31518000000,
  });
  if (injector !== undefined) {
    transfer.signAndSend(
      performingAccount.address,
      { signer: injector.signer },
      (result) => {}
    );
  }
};
```

[`postFunction.tsx`]

```ts
import { ApiPromise } from "@polkadot/api";
import { ContractPromise } from "@polkadot/api-contract";
import { InjectedAccountWithMeta } from "@polkadot/extension-inject/types";
import { Dispatch } from "react";

import abi from "../metadata.json";

// type for post in contract
export type PostType = {
  name: string;
  userId: string;
  createdTime: string;
  imgUrl: string;
  userImgUrl: string;
  description: string;
  numOfLikes: number;
  postId: number;
};

// type for releasePost function
type PropsRP = {
  api: ApiPromise;
  actingAccount: InjectedAccountWithMeta;
  description: string;
  imgUrl: string;
};

// type for getGeneralPost function
type PropsGGP = {
  api: ApiPromise;
  setGeneralPostList: Dispatch<React.SetStateAction<PostType[]>>;
};

// type for addLikes function
type PropsAL = {
  api: ApiPromise;
  actingAccount: InjectedAccountWithMeta;
  postId: number;
};

// type for getIndividualPost function
type PropsGIP = {
  api: ApiPromise | undefined;
  actingAccount: InjectedAccountWithMeta | undefined;
  setIndividualPostList: Dispatch<React.SetStateAction<PostType[]>>;
};

const contractAddress: string = process.env
  .NEXT_PUBLIC_CONTRACT_ADDRESS as string;

// release post function
export const releasePost = async (props: PropsRP) => {
  const { web3FromSource } = await import("@polkadot/extension-dapp");
  const contract = new ContractPromise(props.api, abi, contractAddress);
  const performingAccount = props.actingAccount;
  const injector = await web3FromSource(performingAccount.meta.source);
  const date = new Date();
  const release_post = await contract.tx.releasePost(
    {
      value: 0,
      gasLimit: 50000000000,
    },
    props.description,
    [date.getFullYear(), date.getMonth() + 1, date.getDate()].join("-") +
      " " +
      [
        date.getHours().toString().padStart(2, "0"),
        date.getMinutes().toString().padStart(2, "0"),
      ].join(":"),
    props.imgUrl
  );
  if (injector !== undefined) {
    release_post.signAndSend(
      performingAccount.address,
      { signer: injector.signer },
      (result) => {}
    );
  }
};

// get general post function
export const getGeneralPost = async (props: PropsGGP) => {
  const contract = new ContractPromise(props.api, abi, contractAddress);
  const { gasConsumed, result, output } = await contract.query.getGeneralPost(
    "",
    {
      value: 0,
      gasLimit: -1,
    },
    1
  );
  if (output !== undefined && output !== null) {
    props.setGeneralPostList(
      output.toHuman() == null ? [] : output.toHuman()
    );
  }
};

// add like to post function
export const addLikes = async (props: PropsAL) => {
  const { web3FromSource } = await import("@polkadot/extension-dapp");
  const contract = new ContractPromise(props.api, abi, contractAddress);
  const performingAccount = props.actingAccount;
  const injector = await web3FromSource(performingAccount!.meta.source);
  const add_likes = await contract.tx.addLikes(
    {
      value: 0,
      gasLimit: 18850000000,
    },
    props.postId
  );
  if (injector !== undefined) {
    add_likes.signAndSend(
      performingAccount!.address,
      { signer: injector.signer },
      (result) => {}
    );
  }
};

// get individual post function
export const getIndividualPost = async (props: PropsGIP) => {
  const contract = new ContractPromise(props.api!, abi, contractAddress!);
  const { gasConsumed, result, output } =
    await contract.query.getIndividualPost(
      "",
      {
        value: 0,
        gasLimit: -1,
      },
      1,
      props.actingAccount?.address
    );
  if (output !== undefined && output !== null) {
    props.setIndividualPostList(
      output.toHuman() == null ? [] : output.toHuman()
    );
  }
};
```

[`profileFunction.tsx`]

```ts
import { ApiPromise } from "@polkadot/api";
import { ContractPromise } from "@polkadot/api-contract";
import { InjectedAccountWithMeta } from "@polkadot/extension-inject/types";
import { Dispatch } from "react";

import abi from "../metadata.json";

// type of profile in contract
export type ProfileType = {
  followingList: Array<string>;
  followerList: Array<string>;
  friendList: Array<string>;
  userId: string;
  name: string;
  imgUrl: string;
  messageListIdList: Array<number>;
  postIdList: Array<number>;
};

// type for createCheckInfo function
type PropsCCI = {
  api: ApiPromise | undefined;
  userId: string | undefined;
  setIsCreatedProfile: Dispatch<React.SetStateAction<boolean>>;
};

// type for createProject function
type PropsCP = {
  api: ApiPromise | undefined;
  actingAccount: InjectedAccountWithMeta;
};

// type for getProfileForHome function
type PropsGPFH = {
  api: ApiPromise;
  userId: string;
  setImgUrl: Dispatch<React.SetStateAction<string>>;
};

// type for getProfileForProfile function
type PropsGPFP = {
  api: ApiPromise | undefined;
  userId: string | undefined;
  setImgUrl: Dispatch<React.SetStateAction<string>>;
  setName: Dispatch<React.SetStateAction<string>>;
};

// type for getProfileForMessage function
type PropsGPFM = {
  api: ApiPromise | undefined;
  userId: string | undefined;
  setImgUrl: Dispatch<React.SetStateAction<string>>;
  setMyImgUrl: Dispatch<React.SetStateAction<string>>;
  setFriendList: Dispatch<React.SetStateAction<never[]>>;
  setProfile: Dispatch<React.SetStateAction<ProfileType | undefined>>;
};

// type for getSimpleProfileForMessage function
type PropsGSPFM = {
  api: ApiPromise | undefined;
  userId: string | undefined;
};

// type for follow function
type PropsF = {
  api: ApiPromise;
  actingAccount: InjectedAccountWithMeta;
  followedId: string;
};

// type for setProfileInfo function
type PropSPI = {
  api: ApiPromise;
  actingAccount: InjectedAccountWithMeta;
  name: string;
  imgUrl: string;
};

// type for getFollowingList function
type PropsGFIL = {
  api: ApiPromise | undefined;
  userId: string | undefined;
  setFollowingList: Dispatch<React.SetStateAction<string[]>>;
};

// type for getFollowedList function
type PropsGFEL = {
  api: ApiPromise | undefined;
  userId: string | undefined;
  setFollowerList: Dispatch<React.SetStateAction<string[]>>;
};

const contractAddress: string = process.env
  .NEXT_PUBLIC_CONTRACT_ADDRESS as string;
const imageUrlForUnknown = process.env.NEXT_PUBLIC_UNKNOWN_IMAGE_URL as string;

// check if already create profile in contract function
export const checkCreatedInfo = async (props: PropsCCI) => {
  const contract = new ContractPromise(props.api, abi, contractAddress);
  const { gasConsumed, result, output } = await contract.query.checkCreatedInfo(
    "",
    {
      value: 0,
      gasLimit: -1,
    },
    props.userId
  );
  if (output !== undefined && output !== null) {
    props.setIsCreatedProfile(output.toHuman());
  }
};

// create profile function
export const createProfile = async (props: PropsCP) => {
  console.log(props.actingAccount);
  const { web3FromSource } = await import("@polkadot/extension-dapp");
  const contract = new ContractPromise(props.api!, abi, contractAddress);
  const performingAccount = props.actingAccount;
  const injector = await web3FromSource(performingAccount.meta.source);
  const create_profile = await contract.tx.createProfile({
    value: 0,
    gasLimit: 18750000000,
  });
  if (injector !== undefined) {
    create_profile.signAndSend(
      performingAccount.address,
      { signer: injector.signer },
      (result) => {}
    );
  }
};

// get profile for home screen function
export const getProfileForHome = async (props: PropsGPFH) => {
  const contract = new ContractPromise(props.api, abi, contractAddress);
  const { gasConsumed, result, output } = await contract.query.getProfileInfo(
    "",
    {
      value: 0,
      gasLimit: -1,
    },
    props.userId
  );
  if (output !== undefined && output !== null) {
    props.setImgUrl(
      output.toHuman()?.imgUrl == null
        ? imageUrlForUnknown
        : output.toHuman()?.imgUrl.toString()
    );
  }
};

// get profile for profile screen function
export const getProfileForProfile = async (props: PropsGPFP) => {
  const contract = new ContractPromise(props.api!, abi, contractAddress);
  const { gasConsumed, result, output } = await contract.query.getProfileInfo(
    "",
    {
      value: 0,
      gasLimit: -1,
    },
    props.userId
  );
  if (output !== undefined && output !== null) {
    props.setImgUrl(
      output.toHuman()?.imgUrl == null
        ? imageUrlForUnknown
        : output.toHuman()?.imgUrl.toString()
    );
    props.setName(
      output.toHuman()?.name == null
        ? "unknown"
        : output.toHuman()?.name.toString()
    );
  }
};

// get profile for message screen function
export const getProfileForMessage = async (props: PropsGPFM) => {
  const contract = new ContractPromise(props.api!, abi, contractAddress);
  const { gasConsumed, result, output } = await contract.query.getProfileInfo(
    "",
    {
      value: 0,
      gasLimit: -1,
    },
    props.userId
  );
  if (output !== undefined && output !== null) {
    props.setMyImgUrl(
      output.toHuman()?.imgUrl == null
        ? imageUrlForUnknown
        : output.toHuman()?.imgUrl.toString()
    );
    props.setImgUrl(
      output.toHuman()?.imgUrl == null
        ? imageUrlForUnknown
        : output.toHuman()?.imgUrl.toString()
    );
    props.setFriendList(
      output.toHuman()?.friendList == null ? [] : output.toHuman()?.friendList
    );
    props.setProfile(output.toHuman());
  }
};

// get simple profile for message screen function
export const getSimpleProfileForMessage = async (props: PropsGSPFM) => {
  const contract = new ContractPromise(props.api!, abi, contractAddress);
  const { gasConsumed, result, output } = await contract.query.getProfileInfo(
    "",
    {
      value: 0,
      gasLimit: -1,
    },
    props.userId
  );
  if (output !== undefined && output !== null) {
    return output.toHuman();
  }
  return;
};

// follow another account function
export const follow = async (props: PropsF) => {
  const { web3FromSource } = await import("@polkadot/extension-dapp");
  const contract = new ContractPromise(props.api, abi, contractAddress);
  const performingAccount = props.actingAccount;
  const injector = await web3FromSource(performingAccount!.meta.source);
  const follow = await contract.tx.follow(
    {
      value: 0,
      gasLimit: 200000000000,
    },
    props.followedId
  );
  if (injector !== undefined) {
    follow.signAndSend(
      performingAccount!.address,
      { signer: injector.signer },
      (result) => {}
    );
  }
};

export const setProfileInfo = async (props: PropSPI) => {
  const { web3FromSource } = await import("@polkadot/extension-dapp");
  const contract = new ContractPromise(props.api!, abi, contractAddress!);
  const performingAccount = props.actingAccount;
  const injector = await web3FromSource(performingAccount!.meta.source);
  const set_profile_info = await contract.tx.setProfileInfo(
    {
      value: 0,
      gasLimit: 187500000000,
    },
    props.name,
    props.imgUrl
  );
  if (injector !== undefined) {
    set_profile_info.signAndSend(
      performingAccount!.address,
      { signer: injector.signer },
      (result) => {}
    );
  }
};

// get following list function
export const getFollowingList = async (props: PropsGFIL) => {
  const contract = new ContractPromise(props.api!, abi, contractAddress);
  const { gasConsumed, result, output } = await contract.query.getFollowingList(
    "",
    {
      value: 0,
      gasLimit: -1,
    },
    props.userId
  );
  if (output !== undefined && output !== null) {
    props.setFollowingList(output.toHuman());
    console.log(output.toHuman());
  }
  return;
};

// get follower list function
export const getFollowerList = async (props: PropsGFEL) => {
  const contract = new ContractPromise(props.api!, abi, contractAddress);
  const { gasConsumed, result, output } = await contract.query.getFollowerList(
    "",
    {
      value: 0,
      gasLimit: -1,
    },
    props.userId
  );
  if (output !== undefined && output !== null) {
    props.setFollowerList(output.toHuman());
  }
  return;
};
```

`profile.tsxFunction`の`imageUrlForUnknown`には初めてのユーザーの画像のURLが入るのでご自分の好きな画像URLを入れてみてください。

ここではURLが長いので`imageUrlForUnknown`に置き換えておきます。こちらの変数は環境変数から取得することになります。

これでコントラクト上の関数を呼び出せるようになりました。

### 🙋‍♂️ 質問する

わからないことがあれば、Discordの`#astar`でsection・Lesson名とともに質問をしてください 👋

---

次のセクションではUIで使用するパーツを記述して行きましょう！ 🎉
