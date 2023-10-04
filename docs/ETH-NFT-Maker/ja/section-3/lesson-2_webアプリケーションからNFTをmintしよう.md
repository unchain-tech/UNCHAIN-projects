### ☘️ Web アプリケーションから NFT を Mint する

前回のレッスンでは、Webアプリケーションを立ち上げました。

**これから、Web アプリケーションから`Web3Mint.sol`コントラクトにアクセスして、NFT を発行する`mintIpfsNFT`関数を呼び出していきましょう。**

- 以前のレッスンで`mintIpfsNFT`関数は`Web3Mint.sol`に実装しました。

まず、`NftUploader.jsx`内`import { Button } from '@mui/material';`の下に、下記のコードを追加してください。

```javascript
// NftUploader.jsx
import { ethers } from 'ethers';
```

ここでは、フロントエンドとコントラクトを連携させるライブラリ`ethers`をインポートしています。

まだ`ethers`のライブラリをインストールしてなかったので、プロジェクトのルートで以下のコマンドを実行してください。

```
yarn workspace client add ethers@5.7.2
```

ethersをもっと詳しく知りたい方は、[こちら](https://www.npmjs.com/package/ethers)をどうぞ。

次に、下記のコードを`NftUploader.jsx`の`connectWallet`関数の下に`askContractToMintNft`関数を追加してください。

- フロントエンドに実装する`askContractToMintNft`関数が、コントラクトとWebサイトを連動させ、`mintIpfsNFT`関数を呼び出します。

```javascript
// NftUploader.jsx
const askContractToMintNft = async (ipfs) => {
  const CONTRACT_ADDRESS =
    'ここに Sepolia Test Network にデプロイしたコントラクトのアドレスを貼り付けてください';
  try {
    const { ethereum } = window;
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const connectedContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        Web3Mint.abi,
        signer
      );
      console.log('Going to pop wallet now to pay gas...');
      let nftTxn = await connectedContract.mintIpfsNFT('sample',ipfs);
      console.log('Mining...please wait.');
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
// NftUploader.jsx
const CONTRACT_ADDRESS =
  'ここに Sepolia Test Network にデプロイしたコントラクトのアドレスを貼り付けてください';
```

ここでは、コントラクトのアドレスを`CONTRACT_ADDRESS`に格納しています。

**ルーディレクトリでもう一度下記を実行し、コントラクトのアドレスを取得してください。**

```
yarn contract deploy
```

貼り付けるアドレスの例は、以下のようになります。

```
Contract deployed to: 0x88a0e9c2F3939598c402eccb7Ae1612e45448C04
```

上記のアドレスを`'ここに ... 貼り付けてください'`の中身と入れ替えてください。

`provider`や`signer`の概念がわからない方は、[Project2-section3-lesson3](https://unchain-portal.netlify.app/projects/102-ETH-NFT-Collection/section-3-Lesson-3)を見て復習してみてください。

では、コントラクトインスタンスの説明から始めます。

> ```javascript
> // NftUploader.jsx
> const connectedContract = new ethers.Contract(
>   CONTRACT_ADDRESS,
>   Web3Mint.abi,
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
> 2. `Web3Mint.abi`: コントラクトの ABI
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
// NftUploader.jsx
let nftTxn = await connectedContract.mintIpfsNFT('sample',ipfs);
console.log('Mining...please wait.');
```

ここでは、`mintIpfsNFT`関数をコントラクトから呼び出し、`await`を使用して、NFTの発行が承認（＝マイニング）されるまで、処理をやめています。

`console.log`では、NFTを発行するためのトランザクションが「承認中」であることを通知しています。

次に、下記のコードを見ていきましょう。

```javascript
// NftUploader.jsx
await nftTxn.wait();
console.log(
  `Mined, see transaction: https://sepolia.etherscan.io/tx/${nftTxn.hash}`
);
```

承認が終わったら、`await nftTxn.wait()`が実行され、トランザクションの結果を取得します。コードが冗長に感じるかもしれませんが、大事な処理です。

`console.log`では、取得したトランザクションの結果を、Etherscan URLとして出力しています。

`askContractToMintNft`関数を呼び出すコードはこの後実装していくので、今は気にしないでください。


すべての変更を`NftUploader.jsx`に反映させた後、ターミナルで下記を実行しみてください。

```
yarn client start
```

ローカルサーバーで、Webサイトが立ち上がり、下記のようなエラーがターミナルに出力されていれば、ここまでの実装は成功です。

```plaintext
Failed to compile.
src/App.js
  Line 78:73:  'Web3Mint' is not defined  no-undef
Search for the keywords to learn more about each error.
```

これから、ABIファイルを取得して、`Web3Mint`変数を定義していきます。

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

ABIファイルの中身は、`Web3Mint.json`というファイルに格納されいます。

下記を実行して、ABIファイルをコピーしましょう。

1\. ターミナル上で`packges/contract`にいることを確認する（もしくは移動する）。

2\. ターミナル上で下記を実行する。

> ```
> code artifacts/contracts/Web3Mint.sol/Web3Mint.json
> ```
3\. VS Codeで`Web3Mint.json`ファイルが開かれるので、中身をすべてコピーしましょう。※ VS Codeのファインダーを使って、直接`Web3Mint.json`を開くことも可能です。

次に、下記を実行して、ABIファイルをWebアプリケーションから呼び出せるようにしましょう。

1\. ターミナル上で`client`にいることを確認する（もしくは移動する）。

2\. 下記を実行して、`client/src/`の中に`utils`ディレクトリを作成する。

> ```
> mkdir src/utils
> ```
3\. 下記を実行して、`utils`ディレクトリに`Web3Mint.json`ファイルを作成する。

> ```
> touch src/utils/Web3Mint.json
> ```
4\. 下記を実行して、`Web3Mint.json`ファイルをVS Codeで開く。

> ```
> code client/src/utils/Web3Mint.json
> ```
5\. **先ほどコピーした`packages/contract/artifacts/contracts/Web3Mint.sol/Web3Mint.json`の中身を新しく作成した`packages/client/src/utils/Web3Mint.json`の中に貼り付けてください。**

ABIファイルの準備ができたので、`NftUploader.jsx`にインポートしましょう。

下記を`NftUploader.jsx`内`import ImageLogo from './image.svg';`の上に追加しましょう。

```javascript
// NftUploader.jsx
import Web3Mint from '../../utils/Web3Mint.json';
```

ここでは、先ほど取得した、ABIファイルを含む`Web3Mint.json`ファイルをインポートしています。


### 🛠 `Web3.storage`を使用する

これで、NFTをMintする準備はほとんど終わりましたが、まだ足りないものがありますね。
そうです!受け取った画像をIPFSにアップロードしてCIDを返してもらう機能が足りませんね。

まずは、`Web3.storage`のライブラリをインストールしましょう!このライブラリを使うことで先ほど手作業で行ったIPFSに画像をアップロードする作業をプログラムで実装できるようになります。

プロジェクトのルートで下記を実行してください。

```
yarn workspace client add web3.storage@^4.5.4
```

そして`NftUploader.jsx`の中`import { useEffect, useState } from 'react';`の下に一行を加えましょう。

```javascript
// NftUploader.jsx
import { Web3Storage } from 'web3.storage'
```

では、この`Web3Storage`を使った関数を実装していきましょう。

`NftUploader.jsx`に`imageToNFT`関数を実装しましょう。

```javascript
// NftUploader.jsx
const imageToNFT = async (e) => {
        const client = new Web3Storage({ token: API_KEY })
        const image = e.target
        console.log(image)

        const rootCid = await client.put(image.files, {
            name: 'experiment',
            maxRetries: 3
        })
        const res = await client.get(rootCid) // Web3Response
        const files = await res.files() // Web3File[]
        for (const file of files) {
          console.log('file.cid:',file.cid)
          askContractToMintNft(file.cid)
        }
    }
```

この関数は画像を受け取る`input`タグの`onClick`プロパティに実装します。これで`input`が画像を受け取るたびにNFTが発行されることになります。変更する箇所が二箇所あるので、注意してください。

```javascript
// NftUploader.jsx
<input className="nftUploadInput" multiple name="imageURL" type="file" accept=".jpg , .jpeg , .png" onChange={imageToNFT}/>
      </div>
      <p>または</p>
      <Button variant="contained">
        ファイルを選択
        <input className="nftUploadInput" type="file" accept=".jpg , .jpeg , .png" onChange={imageToNFT} />
      </Button>
```

`imageToNFT`関数について解説していきます!

```javascript
// NftUploader.jsx
const imageToNFT = async (e) => {
        const client = new Web3Storage({ token: API_KEY })
        const image = e.target
        console.log(image)
```
ここでは、`input`から受け取った画像を`e`で受け取って、画像のオブジェクトを`e.target`で`image`に代入しています。

`e`という合成イベントについては、[公式の説明](https://ja.reactjs.org/docs/events.html)や[こちら](https://react.keicode.com/basics/synthetic-events.php)が役に立つと思います。

そして`Web3Storage`にアップロードするために、APIを取得する必要があります。

`web3.storage`のアカウント画面に行き、`create a token`のボタンを押してください。

![](/public/images/ETH-NFT-Maker/section-3/3_3_1.png)

すると、`Name your token`という記入画面があると思うので、そこに好きな名前をいれて`api_key`を作りましょう。

名前を入れてenterを押すと、しばらくまって下の画面にkeyがでてくるはずなので、それをコピーしましょう

`NftUploader.jsx`に戻って、API_KEYを定義しましょう。

```javascript
// NftUploader.jsx
const API_KEY ='あなたのKEYをいれてください';
```


次は、下記のコードを解説します。
```javascript
// NftUploader.jsx
const rootCid = await client.put(image.files, {
            name: 'experiment',
            maxRetries: 3
        })
```
ここで、画像をIPFSで保存しています。画像のデータと、名前などを設定しています。さらに返り値の`CID`が`rootCid`に代入されています。

詳しく知りたい方は、[公式doc](https://web3.storage/docs/reference/js-client-library/)を参考にしてみてください。

次は、下記のコードを解説します。

```javascript
// NftUploader.jsx
        const res = await client.get(rootCid) // Web3Response
        const files = await res.files() // Web3File[]
        for (const file of files) {
          console.log("file.cid:",file.cid)
          askContractToMintNft(file.cid)
        }
```

先程の返り値をつかって、今度は保存したファイルのデータを取りに行っています。

この`file.cid`が送った画像のIPFSになります。気になる方は、console.logで出たものをブラウザに表示させてみてください。
そのfile.cidを引数にして、`askContractToMintNft`関数を使いましょう。
これで、mintするための準備はすべて整ったはずです。


### 🥳 NFT を Mint する

それでは、ターミナル上で`client`ディレクトリに移動して下記を実行し、ローカル環境でWebアプリケーションをホストしてみましょう。

```
yarn client start
```

Webアプリケーションで画像を選択して、下記のようなポップアップが立ち上がったら、`Confirm`を押してください。

![](/public/images/ETH-NFT-Maker/section-3/3_3_2.png)

ここで請求される少量のETHは、通称**ガス代**と呼ばれます。

- ブロックチェーンは、AWSのようなクラウド上にデータを保存できるサーバーのようなものです。

- しかし、誰もそのデータを所有していません。

- 世界中に、ブロックチェーン上にデータを保存する作業する「マイナー」と呼ばれる人々が存在します。この作業に対して、私たちは代金を支払います。

- その代金が、**ガス代**です。

- イーサリアムのブロックチェーン上にデータを書き込む際、私たちは代金として`$ETH`を「マイナー」に支払う必要があります。

Webアプリケーション上で`Inspect`を選択して、Consoleを確認してみましょう。

下記のような結果が出力されていれば、あなたのNFTは正常にMintされています。

```
file.cid: bafkreifhw5rc2vbtpupbdughvz35niquk6bjx6uh6gilyflkh7ao76rwlm
Going to pop wallet now to pay gas...
Mining...please wait.
Mined, see transaction: https://sepolia.etherscan.io/tx/0x5fbe47b7c0fd658f5866d10c70bfa4616d7f26f438dcade022cbff930400f175
```
Consoleに出力された`https://sepolia.etherscan.io/...`のアドレスをクリックしてみましょう。

- あなたのSepolia Test Network上のトランザクションの履歴が参照できます。

次に、[gemcase(NFTで閲覧できるサービス)](https://gemcase.vercel.app/) にアクセスして、MintしたNFTがあなたのSepolia Test Networkのアドレスに紐づいているか確認してみましょう。


Consoleに出力された`currentAccount:`に続く、`0x..`のアドレスをgemcaseのWebサイトに貼り付けて、結果が表示されたら、画面右上の`Profile`メニューを選択してください。それから、ご自身のアカウントを開いて、NFTを確認してみましょう。

### 🚨 コントラクトを再びデプロイする際の注意点

コントラクトの中身を更新する場合、必ず下記3つのステップを実行することを忘れないようにしましょう。

**1 \. 再度、コントラクトをデプロイする。**

- `yarn contract deploy`を実行する必要があります。

2 \. フロントエンド(`App.js`)の`CONTRACT_ADDRESS`を更新する。

3 \. ABIファイルを更新する。

- `packages/contract/artifacts/contracts/Web3Mint.sol/Web3Mint.json`の中身を、`packages/client/src/utils/Web3Mint.sol`の中に貼り付ける必要があります。

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
