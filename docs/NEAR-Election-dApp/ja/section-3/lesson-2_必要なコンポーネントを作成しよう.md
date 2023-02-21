### フロントエンドに必要なコンポーネントを作成しよう

前回のレッスンではコントラクトとやりとりできる準備と画面遷移ができるようにしましたね。

このレッスンでは`Home画面、Add Candidate画面、Add Voter画面`に必要なコンポーネントを作成していきます。

まずは`components/candidate_card.js`に移動して以下のコードを追加しましょう！

[candidate_card.js]

```javascript
// 以下のように追加してください
import React from "react";
import { IpfsImage } from 'react-ipfs-image';

// template  candidate card template
const CandidateCard = (props) => {
    return (
        <div className="max-w-sm rounded overflow-hidden shadow-lg w-64 h-96">
            <IpfsImage className="w-full h-3/5" hash={props.CID} gatewayUrl='https://gateway.pinata.cloud/ipfs/' alt="Sunset in the mountains" />
            <div className="px-6 py-4">
                <div className="font-bold text-xl mb-2">{props.name}</div>
                <p className="text-gray-700 text-base">
                    {props.manifest}
                </p>
            </div>
        </div>
    )

}

export default CandidateCard;
```

このインポートによってIPFSという分散化した画像保存の技術によって保存された画像をすばやく読み込むことができるようになります。

```javascript
import { IpfsImage } from 'react-ipfs-image';
```

`return`以下で下のようなそれぞれの候補者のカードのUIを示しています。

![](/public/images/NEAR-Election-dApp/section-3/3_2_1.png)

次に`components/input_form.js`に移動して下のコードを追加しましょう。

[input_form.js]

```javascript
// 以下のように追加してください
import React from "react";

// template input component
const Input = (props) => {
    return (
        <form className="w-3/5" onSubmit={e => { e.preventDefault(); }}>
            <label className="block">
                <span className="block text-3xl font-medium text-slate-700">{props.title}</span>
                <input value={props.input} placeholder={props.hint} onChange={props.setInput}
                    className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm
                shadow-sm placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500
                disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none
                invalid:border-pink-500 invalid:text-pink-600 focus:invalid:border-pink-500 focus:invalid:ring-pink-500"/>
            </label>
        </form>
    )
}

export default Input;
```

ここで`preventDefault()`としているのは、デフォルトでのEnterキーを押した時に自動的に送信されることを防ぐためで

```javascript
<form className="w-3/5" onSubmit={e => { e.preventDefault(); }}>
```

以上のように編集することで下のような入力フォームができます。

![](/public/images/NEAR-Election-dApp/section-3/3_2_2.png)

最後に`components/title.js`でtitleコンポーネントを作成しましょう！

[title.js]

```javascript
// 以下のように追加してください
import React from "react";

// template title component
const Title = (props) => {
    return (
        <span className="box-content h-7 w-1/3 p-4 border-4 m4 center text-4xl items-center">
            {props.name}
        </span>

    )
}

export default Title;
```

これによって`Add Candidate画面, Add Voter画面`のタイトルが下のようになります。
![](/public/images/NEAR-Election-dApp/section-3/3_2_3.png)

### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discordの`#near`で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の4点を記載してください ✨

```
1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット
```

これで必要なコンポーネントは完成しました！

次のレッスンではいよいよコントラクトの関数を呼び出してこのwebアプリを完成させましょう！
