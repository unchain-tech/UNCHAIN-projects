### 👩‍💻 コントラクトを作成する

メッセージを管理するスマートコントラクトを作成します。
ここで作成するスマートコントラクトは、後でユースケースに合わせて自由に変更できます。

`packages/contract/contracts`ディレクトリの下に`Messenger.sol`という名前のファイルを作成します。

Hardhatを使用する場合、ファイル構造は非常に重要ですので、注意する必要があります。ファイル構造が下記のようになっていれば大丈夫です 😊

```bash
contract/
└── contracts/
    └── Messenger.sol
```

次に、コードエディタでプロジェクトのコードを開きます。

ここでは、VS Codeの使用をお勧めします。ダウンロードは [こちら](https://azure.microsoft.com/ja-jp/products/visual-studio-code/) から。

VS Codeをターミナルから起動する方法は [こちら](https://maku.blog/p/f5iv9kx/) をご覧ください。

- ターミナル上で、`code`コマンドを実行

今後VS Codeを起動するのが一段と楽になるので、ぜひ導入してみてください。

コーディングのサポートツールとして、VS Code上でSolidityの拡張機能をダウンロードすることをお勧めします。

ダウンロードは [こちら](https://marketplace.visualstudio.com/items?itemName=JuanBlanco.solidity) から。

それでは、これから`Messenger.sol`の中身の作成していきます。

`Messenger.sol`をVS Codeで開き、下記を入力します。

```solidity
// Messenger.sol
// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

import "hardhat/console.sol";

contract Messenger {
    uint256 public state;

    constructor() {
        console.log("Here is my first smart contract!");

        state = 1;
    }
}
```

コードを詳しくみていきましょう。

```solidity
// Messenger.sol
// SPDX-License-Identifier: MIT
```

これは「SPDXライセンス識別子」と呼ばれ、ソフトウェア・ライセンスの種類が一目でわかるようにするための識別子です。

詳細については、[こちら](https://www.skyarch.net/blog/?p=15940) を参照してみてください。

```solidity
// Messenger.sol
pragma solidity ^0.8.17;
```

これは、コントラクトで使用するSolidityコンパイラのバージョンです。

上記のコードでは、このコントラクトを実行するときはSolidityコンパイラのバージョンが`0.8.17`以上`1.0.0`未満を使用しそれ以外のものは使用しません、という宣言をしています。

Solidityは [Semantic Versioning](https://semver.org/) を採用しているため、バージョン表記の見方は

```
MAJOR.MINOR.PATCH
```

となり、MAJOR（一番左の番号）は互換性がない修正・変更がSolidityに加わった場合に変わります。
つまり、`0.8.17`から`1.0.0`未満までの範囲は修正が加わっても互換性がある（コンパイルが可能）変更なので、`^`を先頭につけることで、
その範囲のバージョンの違いは許容するということです。

`0.8.17`が`hardhat.config.ts`でも記載されていることを確認してください。

もし、`hardhat.config.ts`の中に記載されているSolidityのバージョンが`0.8.17`でなかった場合は、`Messenger.sol`の中身を`hardhat.config.ts`に記載されているバージョンに変更しましょう。

```solidity
// Messenger.sol
import "hardhat/console.sol";
```

コントラクトを実行する際、コンソールログをターミナルに出力するためにHardhatの`console.sol`のファイルをインポートしています。

これは、今後スマートコントラクトのデバッグが発生した場合に、とても役立つツールです。

```solidity
// Messenger.sol
contract Messenger {
    uint256 public state;

    constructor() {
        console.log("Here is my first smart contract!");

        state = 1;
    }
}
```

`contract`に続けて定義するコントラクトの名前を記述します。
コントラクトはほかの言語でいうところの「[class](https://wa3.i-3-i.info/word1120.html)」のように考えることができます。
classの概念については、[こちら](https://aiacademy.jp/media/?p=131) を参照してください。

コントラクト内では状態変数の`state`を定義しています。
`state`は`uint256`型で`public`というアクセス修飾子をつけています。

> `uint256`は非常に大きな数を扱うことができる「符号なし整数のデータ型」を意味します。

アクセス修飾子に関しては後のレッスンで扱いますが、
`public`の指定により、`state`は**コントラクトの外部からアクセスできる**ということだけここでは理解しておきましょう。

次に`constructor`を実装しています。
`Messenger`をデプロイすると、`constructor`が実行されます。
`console.log`の中身がターミナル上に表示され、`state`が1に設定されます(uintのデフォルト初期値は`0`です)。

### 🔩 constructor とは

`constructor`はオプションの関数で、`Messenger`コントラクトの状態変数を初期化するために使用されます。

`constructor`に関しては、まず以下の特徴をおさえましょう。

- `Messenger`コントラクトは1つの`constructor`しか持つことができません。
- `constructor`は、スマートコントラクトの作成時に一度だけ実行され、`Messenger`コントラクトの状態を初期化するために使用されます。
- `constructor`が実行された後、コードがブロックチェーンにデプロイされます。

### 🧪 テストを実装する

最低限のコントラクトを実装したので、今度はテストを書きましょう。
`test`ディレクトリの中に`Messenger.ts`ファイルを作成し`typescript`を使用してテストを記入します。
これから書くテストコードはフロントエンド側のコードであると考えて、
フロントエンド側からコントラクトの関数を呼び出しテストをしているという認識で行うと各ファイルの対応関係と、後のフロントエンド開発がわかりやすくなると思います。

`Messenger.ts`に以下のコードを記述してください。

```ts
import { expect } from 'chai';
import hre from 'hardhat';

describe('Messenger', function () {
  it('construct', async function () {
    const Messenger = await hre.ethers.getContractFactory('Messenger');
    const messenger = await Messenger.deploy();

    expect(await messenger.state()).to.equal(1);
  });
});
```

中身を見ていきましょう。

```ts
import { expect } from 'chai';
import hre from 'hardhat';
```

テストに必要なライブラリをimportしています。

```ts
describe('Messenger', function () {
  it('construct', async function () {
    // テストコード
  });
});
```

`it`と`describe`を使用してテストを記入していきます。
これらは`Mocha`というテストフレームワークの機能を利用しています。
`Mocha`について詳しくは[こちら](https://mochajs.org/#getting-started)をご覧ください。

`it`の引数にテスト名とテスト関数を渡します。
さらに複数の`it`関数を`describe`の引数（の関数）内に渡すことで、個々のテストを1つの`describe`でグループ化します。

```ts
it('construct', async function () {
  const Messenger = await hre.ethers.getContractFactory('Messenger');
  const messenger = await Messenger.deploy();

  expect(await messenger.state()).to.equal(1);
});
```

実際のテストコードです。

`hre.ethers.getContractFactory('Messenger')`で`Messenger`コントラクトとデプロイをサポートするライブラリの連携を行い、
`Messenger.deploy()`でデプロイを行っています。

`expect`は [chai](https://www.chaijs.com/) ライブラリの機能で、
以下のように使用することで`Messenger`コントラクトの`state`がデプロイ後に`1`になっていることを確認しています。

```ts
expect(await 関数呼び出し).to.equal(期待する値);
```

> 📓: `messenger.state()`の意味
> `public`により公開されたコントラクトの状態変数(今回でいう`state`)は、自動的に`getter`関数がコンパイラにより作られます。
> つまり`コントラクトオブジェクト.変数名()`のように実行することで値を読み取ることができます。

> ✍️: `async function ()`と`await`について
> Javascript(Typescript も同様に) でコードを書いていると、コードの上から順に実行されなくて困ることがあります。
> これを非同期処理に関する問題といいます。
>
> 解決法の一つとして、ここでは`async` / `await`を使用します。
>
> これを使うと、`await`が先頭についている処理が終わるまで、関数内の他の処理は行われません。
> `await`を使用する関数は`async`をつける必要があります。
>
> つまり、`hre.ethers.getContractFactory('Messenger')`の処理が終わるまで、`async function`関数の中に記載されている他の処理は実行されないということです。

💁 hardhatで行うテストに関して詳しくは[こちら](https://hardhat.org/hardhat-runner/docs/guides/test-contracts)を参考にしてください。

### ⭐ テストを実行しましょう

`AVAX-Messenger/`直下から次のコマンドを実行しましょう。

```
yarn test
```

以下のような表示がされます。
実行したテスト名とそのテストがパスしたことがわかります。
また、コンストラクタの出力結果なども確認できます。

![](/public/images/AVAX-Messenger/section-1/1_2_1.png)

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

コントラクトの作成とテストまでの流れを知ることができました 🎉
次のレッスンでは、スマートコントラクトに機能を追加していきます。
