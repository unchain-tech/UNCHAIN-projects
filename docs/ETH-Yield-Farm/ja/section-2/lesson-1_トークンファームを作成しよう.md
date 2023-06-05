###  🖥 このレッスンの参考動画URL
[Dapp University](https://youtu.be/CgXQC4dbGUE?t=1744)

### 👀 プロジェクトの概要を復習しよう

プロジェクトでは3つのスマートコントラクトを使用します。

`packages/contract/contracts`フォルダを参照してください。

1. MockDaiToken.sol
   - 偽のDaiトークンを作成するコントラクト
2. DappToken.sol
   - 投資家が私たちのプロジェクトで獲得できるコミュニティトークンDappを作成するコントラクト
3. TokenFarm.sol
   - 偽のDaiトークンが保管されるデジタルバンク機能を持つスマートコントラクト。
   - TokenFarmコントラクトを呼び出した投資家（ユーザー）が、Daiトークンをステークすることを想定している。
   - 定期的な間隔で、ステーキングを行った投資家はDappトークンを獲得することができる。
   - また、最初のDaiトークンを引き戻すこともできる。

それでは、実装に進みましょう!

### 🪙　TokenFarmコントラクトに Dai と Dapp トークンを導入する

`TokenFarm`コントラクトで`Dai`トークンと`Dapp`トークンが使えるようにするために`TokenFarm.sol`を次のように更新しましょう。

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "./DappToken.sol";
import "./MockDaiToken.sol";

contract TokenFarm{
    string public name = "Dapp Token Farm";
    DappToken public dappToken;
    DaiToken public daiToken;

    constructor(DappToken _dappToken, DaiToken _daiToken){
        dappToken = _dappToken;
        daiToken = _daiToken;
    }
}
```

まず`DappToken`と`MockDaiToken`をインポートすることで`DappToken`と`DaiToken`を使えるようにします。

```solidity
import "./DappToken.sol";
import "./MockDaiToken.sol";
```

次にそれらを`constructor`で呼び出します。
- `constructor`は、スマートコントラクトがネットワークにデプロイされるたびに、一度だけ実行される特別な関数です。
- `constructor`の中にコードを入れることができ、関数が呼び出されるたびに、中のコードが実行されます。

DaiTokenとDappTokenはネットワークにすでにデプロイされていると仮定しているので、あとはTokenFarmのコントラクトが作成されるたびにDaiTokenとDappTokenのコントラクトアドレスを取得し、`constructor`に渡すだけです。

```solidity
constructor(DappToken _dappToken, DaiToken _daiToken){
        dappToken = _dappToken;
        daiToken = _daiToken;
}
```
`constructor()`の中にある`DappToken`と`DaiToken`は実際のスマートコントラクトである「型」です。

`_dappToken`と`_daiToken`は、それぞれコントラクトのアドレスです。
そして、これらの変数を取り出して、それぞれ状態変数である`dappToken`と`daiToken`に代入しています。

* `_dappToken`と`_daiToken`はローカル変数であり、他の関数からアクセスすることはできません。これらの変数がスマートコントラクトの外部からアクセスできるようにするには、状態変数として保存する必要があります。

### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discordの`#ethereum`で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の3点を記載してください ✨

```
1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット
```

---
これでトークンを送れることが確認できました!次はより実践的なことをテストするということをしていきます。
