### ☘️ Web アプリケーションから NFT を Mint する

前回のレッスンでは、Webアプリケーションを立ち上げました。

**これから、Web アプリケーションから`MyEpicNFT.sol`コントラクトにアクセスして、NFT を発行する`makeAnEpicNFT`関数を呼び出していきましょう。**

- 以前のレッスンで`makeAnEpicNFT`関数は`MyEpicNFT.sol`に実装しました。

まず、`App.js`の1行目に、下記のコードを追加してください。

```javascript
// App.js
import { ethers } from "ethers";
```

ここでは、フロントエンドとコントラクトを連携させるライブラリ`ethers`をインポートしています。

次に、下記のコードを`App.js`の`connectWallet`関数の下に`askContractToMintNft`関数を追加してください。

- フロントエンドに実装する`askContractToMintNft`関数が、コントラクトとWebサイトを連動させ、`makeAnEpicNFT`関数を呼び出します。

```javascript
// App.js
const askContractToMintNft = async () => {
  const CONTRACT_ADDRESS =
    "ここに Sepolia Test Network にデプロイしたコントラクトのアドレスを貼り付けてください";
  try {
    const { ethereum } = window;
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const connectedContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        myEpicNft.abi,
        signer
      );
      console.log("Going to pop wallet now to pay gas...");
      let nftTxn = await connectedContract.makeAnEpicNFT();
      console.log("Mining...please wait.");
      await nftTxn.wait();

      console.log(
        `Mined, see transaction: https://sepolia.etherscan.io/tx/${nftTxn.hash}`
      );
    } else {
      console.log("Ethereum object doesn't exist!");
    }
  } catch (error) {
    console.log(error);
  }
};
```

1行ずつ、コードを見ていきましょう。

```javascript
// App.js
const CONTRACT_ADDRESS =
  "ここに Sepolia Test Network にデプロイしたコントラクトのアドレスを貼り付けてください";
```

ここでは、コントラクトのアドレスを`CONTRACT_ADDRESS`に格納しています。

**`ETH-NFT-Collection`ディレクトリ直下で、もう一度下記を実行し、コントラクトのアドレスを取得してください。**

```
yarn contract deploy:sepolia
```

貼り付けるアドレスの例は、以下のようになります。

```
Contract deployed to: 0x88a0e9c2F3939598c402eccb7Ae1612e45448C04
```

上記のアドレスを`"ここに ... 貼り付けてください"`の中身と入れ替えてください。

次に、追加されたコードを見ながら、新しい概念について学びましょう。

I\. `provider`

> ```javascript
> // App.js
> const provider = new ethers.providers.Web3Provider(ethereum);
> ```
>
> `provider`を介して、ユーザーはブロックチェーン上に存在するイーサリアムノードに接続することができます。
> MetaMask が提供するイーサリアムノードを使用して、デプロイされたコントラクトからデータを送受信するために上記の実装を行いました。
>
> `ethers`のライブラリにより`provider`のインスタンスを新規作成しています。

II\. `signer`

> ```javascript
> // App.js
> const signer = provider.getSigner();
> ```
>
> `signer`は、ユーザーのウォレットアドレスを抽象化したものです。
>
> `provider`を作成し、`provider.getSigner()`を呼び出すだけで、ユーザーはウォレットアドレスを使用してトランザクションに署名し、そのデータをイーサリアムネットワークに送信することができます。
>
> `provider.getSigner()`は新しい`signer`インスタンスを返すので、それを使って署名付きトランザクションを送信することができます。

III\. コントラクトインスタンス

> ```javascript
> // App.js
> const connectedContract = new ethers.Contract(
>   CONTRACT_ADDRESS,
>   myEpicNft.abi,
>   signer
> );
> ```
>
> ここでは、**コントラクトへの接続を行っています。**
>
> 新しいコントラクトインスタンス（＝ `connectedContract` ）を作成するには、以下 3 つの変数を`ethers.Contract`関数に渡す必要があります。
>
> 1. `CONTRACT_ADDRESS`: コントラクトのデプロイ先のアドレス（ローカル、テストネット、またはイーサリアムメインネット）
>
> 2. `myEpicNft.abi`: コントラクトの ABI
>
> 3. `signer`もしくは`provider`
>
> コントラクトインスタンスでは、コントラクトに格納されているすべての関数を呼び出すことができます。
>
> もしこのコントラクトインスタンスに`provider`を渡すと、そのインスタンスは**読み取り専用の機能しか実行できなくなります**。
>
> 一方、`signer`を渡すと、そのインスタンスは**読み取りと書き込みの両方の機能を実行できるようになります**。
>
> ※ ABI についてはこのレッスンの終盤にて詳しく説明します。

次に、下記のコードを見ていきましょう。

```javascript
// App.js
console.log("Going to pop wallet now to pay gas...");
```

ここでは、`ethers.Contract`でコントラクトとの接続を行った後、承認が開始されることを通知しています。

次に、下記のコードを見ていきましょう。

```javascript
// App.js
let nftTxn = await connectedContract.makeAnEpicNFT();
console.log("Mining...please wait.");
```

ここでは、`makeAnEpicNFT`関数をコントラクトから呼び出し、`await`を使用して、NFTの発行が承認（＝マイニング）されるまで、処理をやめています。

`console.log`では、NFTを発行するためのトランザクションが「承認中」であることを通知しています。

次に、下記のコードを見ていきましょう。

```javascript
// App.js
await nftTxn.wait();
console.log(
  `Mined, see transaction: https://sepolia.etherscan.io/tx/${nftTxn.hash}`
);
```

承認が終わったら、`await nftTxn.wait()`が実行され、トランザクションの結果を取得します。コードが冗長に感じるかもしれませんが、大事な処理です。

`console.log`では、取得したトランザクションの結果を、Etherscan URLとして出力しています。

ユーザーが`Mint NFT`ボタンをクリックしたときに、`askContractToMintNft`関数を呼び出すコードを見ていきましょう。

```javascript
// App.js
return (
  {currentAccount === ""
    ? renderNotConnectedContainer()
    : (
      /* ユーザーが Mint NFT ボタンを押した時に、askContractToMintNft 関数を呼び出します　*/
      <button onClick={askContractToMintNft} className="cta-button connect-wallet-button">
        Mint NFT
      </button>
    )
  }
);
```

条件付きレンダリングについて復習していきましょう。

`currentAccount === ""`は、`currentAccount`にユーザーのウォレットアドレスが紐づいているかどうか判定しています。

条件付きレンダリングは、下記のように実行されます。

```javascript
{ currentAccount === "" ? ( currentAccount にアドレスが紐づいてなければ、A を実行 ) : ( currentAccount にアドレスが紐づいれば B を実行 )}
```

`App.js`の場合、`A`並ばは、`renderNotConnectedContainer()`を実行し、`B`ならば、`Mint NFT`ボタンをフロントエンドに反映させています。

最後に、`onClick={null}`を`onClick={askContractToMintNft}`に変更することをお忘れなく!

すべての変更を`App.js`に反映させた後、ターミナルで下記を実行してみてください。

```
yarn client start
```

ローカルサーバーで、Webサイトが立ち上がり、下記のようなエラーがターミナルに出力されていれば、ここまでの実装は成功です。

```plaintext
Failed to compile.

src/App.js
  Line 78:73:  'myEpicNft' is not defined  no-undef

Search for the keywords to learn more about each error.
```

これから、ABIファイルを取得して、`myEpicNft`変数を定義していきます。

### 📂 ABI ファイルを取得する

ABI（Application Binary Interface）はコントラクトの取り扱い説明書のようなものです。

Webアプリケーションがコントラクトと通信するために必要な情報が、ABIファイルに含まれています。

コントラクト1つ1つにユニークなABIファイルが紐づいており、その中には下記の情報が含まれています。

1. そのコントラクトに使用されている関数の名前

2. それぞれの関数にアクセスするために必要なパラメータとその型

3. 関数の実行結果に対して返るデータ型の種類

ABIファイルは、コントラクトがコンパイルされた時に生成され、`packages/contract/artifacts`ディレクトリに自動的に格納されます。

ターミナルで`packages/contract`ディレクトリに移動し、`ls`を実行しましょう。

`artifacts`ディレクトリの存在を確認してください。

ABIファイルの中身は、`MyEpicNFT.json`というファイルに格納されいます。

下記を実行して、ABIファイルをコピーしましょう。

1\. ターミナル上で`packages/contract`ディレクトリにいることを確認する（もしくは移動する）。

2\. ターミナル上で下記を実行する。

> ```
> code artifacts/contracts/MyEpicNFT.sol/MyEpicNFT.json
> ```

3\. VS Codeで`MyEpicNFT.json`ファイルが開かれるので、中身をすべてコピーしましょう。※ VS Codeのファインダーを使って、直接`MyEpicNFT.json`を開くことも可能です。

次に、下記を実行して、ABIファイルをWebアプリケーションから呼び出せるようにしましょう。

1\. ターミナル上で`packages/client`ディレクトリにいることを確認する（もしくは移動する）。

2\. 下記を実行して、`packages/client/src/`の中に`utils`ディレクトリを作成する。

> ```
> mkdir src/utils
> ```

3\. 下記を実行して、`utils`ディレクトリに`MyEpicNFT.json`ファイルを作成する。

> ```
> touch src/utils/MyEpicNFT.json
> ```

4\. 下記を実行して、`MyEpicNFT.json`ファイルをVS Codeで開く。

> ```
> code src/utils/MyEpicNFT.json
> ```

5\. **先ほどコピーした`contract/artifacts/contracts/MyEpicNFT.sol/MyEpicNFT.json`の中身を新しく作成した`client/src/utils/MyEpicNFT.json`の中に貼り付けてください。**

ABIファイルの準備ができたので、`App.js`にインポートしましょう。

下記を`App.js`の1行目に追加しましょう。

```javascript
// App.js
import myEpicNft from "./utils/MyEpicNFT.json";
```

ここでは、先ほど取得した、ABIファイルを含む`MyEpicNFT.json`ファイルをインポートしています。

### 🥳 NFT を Mint する

それでは、ターミナル上で`ETH-NFT-Collection`ディレクトリ直下に移動して下記を実行し、ローカル環境でWebアプリケーションをホストしてみましょう。

```
yarn client start
```

Webアプリケーションの`Mint NFT`ボタンを押して、下記のようなポップアップが立ち上がったら、`Confirm`を押してください。

![](/public/images/ETH-NFT-Collection/section-3/3_3_1.png)

ここで請求される少量のETHは、通称**ガス代**と呼ばれます。

- ブロックチェーンは、AWSのようなクラウド上にデータを保存できるサーバーのようなものです。

- しかし、誰もそのデータを所有していません。

- 世界中に、ブロックチェーン上にデータを保存する作業する「マイナー」と呼ばれる人々が存在します。この作業に対して、私たちは代金を支払います。

- その代金が、**ガス代**です。

- イーサリアムのブロックチェーン上にデータを書き込む際、私たちは代金として`$ETH`を「マイナー」に支払う必要があります。

Webアプリケーション上で`Inspect`を選択して、Consoleを確認してみましょう。

下記のような結果が出力されていれば、あなたのNFTは正常にMintされています。

```
Found an authorized account: 0x3a0a49fb3cf930e599f0fa7abe554dc18bd1f135
currentAccount:  0x3a0a49fb3cf930e599f0fa7abe554dc18bd1f135
Going to pop wallet now to pay gas...
Mining...please wait.
Mined, see transaction: https://sepolia.etherscan.io/tx/0x5a08f3e66852b5c1833f3a20fc292816bc2ec5a25eee1e8c83c3755000aa773a
```
Consoleに出力された`https://sepolia.etherscan.io/...`のアドレスをクリックしてみましょう。

- あなたのSepolia Test Network上のトランザクションの履歴が参照できます。

![](/public/images/ETH-NFT-Collection/section-3/3_3_2.png)

次に、MintしたNFTがあなたのSepolia Test Networkのアドレスに紐づいているか確認してみましょう。上記画像の赤枠で囲まれている部分が、トークンの転送情報です。転送先のアドレス（`To xxx...`）があなたのウォレットアドレスになっていたら大丈夫です。

それでは、[gemcase](https://gemcase.vercel.app/)にアクセスをして確認をしてみましょう。これまでは`Address`にデプロイをしたコントラクトのアドレスを入力していましたが、今度はあなたのウォレットアドレスを入力して`View`をクリックしてみましょう。

![](/public/images/ETH-NFT-Collection/section-3/3_3_3.png)

これまでにあなたのアドレスへミントされたNFTの一覧が取得できます。

ステップ通りに進んできた場合は、一番左上のNFTがアプリケーション上の`Mint NFT`をクリックしてミントされたNFTとなります。NFTをクリックして詳細を確認すると、NFTをミントしたアドレスがApp.jsファイルの
`const CONTRACT_ADDRESS`に設定したコントラクトのアドレスとなっているはずです！

![](/public/images/ETH-NFT-Collection/section-3/3_3_4.png)

![](/public/images/ETH-NFT-Collection/section-3/3_3_5.png)

### 🚨 コントラクトを再びデプロイする際の注意点

コントラクトの中身を更新する場合、必ず下記3つのステップを実行することを忘れないようにしましょう。

**1 \. 再度、コントラクトをデプロイする。**

- `yarn contract deploy:sepolia`を実行する必要があります。

2 \. フロントエンド(`App.js`)の`CONTRACT_ADDRESS`を更新する。

3 \. ABIファイルを更新する。

- `packages/contract/artifacts/contracts/MyEpicNFT.sol/MyEpicNFT.json`の中身を新しく作成する`packages/client/src/utils/MyEpicNFT.json`の中に貼り付ける必要があります。

**コントラクトを更新する際、必ずこの 3 つのステップを実行してください。**

- 一度デプロイされたスマートコントラクトを変更することはできません。

- コントラクトを変更するには、完全に再デプロイする必要があります。

- 新しくデプロイされたスマートコントラクトは、ブロックチェーン上で新しいコントラクトとして扱われるため、すべての変数は**リセット**されます。

- **つまり、コントラクトのコードを更新したい場合、すべての NFT データが失われます。**

上記の点に注意しながら、コントラクトの更新を行ってください。

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

おめでとうございます!

NFTをMintできるWebアプリケーションはほぼ完成です!

gemcaseのリンクを`#ethereum`に貼り付けて、あなたのNFTをシェアしてください 😊

あなたの作ったNFTがどんなものなのか気になります ✨

次のレッスンに進みましょう 🎉
