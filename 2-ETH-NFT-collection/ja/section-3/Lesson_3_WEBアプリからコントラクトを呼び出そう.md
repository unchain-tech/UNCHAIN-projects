☘️ WEBアプリから NFT を Mint する
--------------------------------

前回のレッスンでは、WEBアプリを立ち上げました。

**これから、WEBアプリから `MyEpicNFT.sol` コントラクトにアクセスして、NFT を発行する `makeAnEpicNFT` 関数を呼び出していきましょう。**
- 以前のレッスンで `makeAnEpicNFT` 関数は `MyEpicNFT.sol` に実装しました。

1 \. まず、`App.js` の1行目に、下記のコードを追加してください。
```javascript
// App.js
import { ethers } from "ethers";
```

ここでは、フロントエンドとコントラクトを連携させるライブラリ `ethers` をインポートしています。

2. 次に、下記のコードを `App.js` の `connectWallet` 関数の下に `askContractToMintNft` 関数を追加してください。

- フロントエンドに実装する `askContractToMintNft` 関数が、コントラクトとWEBサイトを連動させ、`makeAnEpicNFT` 関数を呼び出します。

```javascript
// App.js
const askContractToMintNft = async () => {
  const CONTRACT_ADDRESS = "ここに Rinkbey Test Network にデプロイしたコントラクトのアドレスを貼り付けてください";
  try {
    const { ethereum } = window;
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myEpicNft.abi, signer);
      console.log("Going to pop wallet now to pay gas...")
      let nftTxn = await connectedContract.makeAnEpicNFT();
      console.log("Mining...please wait.")
      await nftTxn.wait();

      console.log(`Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`);
    } else {
      console.log("Ethereum object doesn't exist!");
    }
  } catch (error) {
    console.log(error)
  }
}
```

1行ずつ、コードを見ていきましょう。

```javascript
// App.js
const CONTRACT_ADDRESS = "ここに Rinkbey Test Network にデプロイしたコントラクトのアドレスを貼り付けてください";
```
ここでは、コントラクトのアドレスを `CONTRACT_ADDRESS` に格納しています。

**`epic-nfts` ディレクトリ上で、もう一度下記を実行し、コントラクトのアドレスを取得してください。**

```bash
npx hardhat run scripts/deploy.js --network rinkeby
```

貼り付けるアドレスの例は、以下のようになります。
```
Contract deployed to: 0x88a0e9c2F3939598c402eccb7Ae1612e45448C04
```

上記のアドレスを `"ここに ... 貼り付けてください"` の中身と入れ替えてください。

次に、追加されたコードを見ながら、新しい概念について学びましょう。

1. `provider`
> ```javascript
> // App.js
> const provider = new ethers.providers.Web3Provider(ethereum);
> ```
>
> `provider` を介して、ユーザーはブロックチェーン上に存在するイーサリアムノードに接続することができます。
> Metamask が提供するイーサリアムノードを使用して、デプロイされたコントラクトからデータを送受信するために上記の実装を行いました。
>
> `ethers` のライブラリにより `provider` のインスタンスを新規作成しています。

2. `signer`
> ```javascript
> // App.js
>const signer = provider.getSigner();
>```
>
> `signer` は、ユーザーのウォレットアドレスを抽象化したものです。
>
> `provider` を作成し、`provider.getSigner()` を呼び出すだけで、、ユーザーはウォレットアドレスを使用してトランザクションに署名し、そのデータをイーサリアムネットワークに送信することができます。
>
> `provider.getSigner()` は新しい `signer` インスタンスを返すので、それを使って署名付きトランザクションを送信することができます。

3. コントラクトインスタンス
> ```javascript
> // App.js
>  const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myEpicNft.abi, signer);
> ```
>
> ここで、**コントラクトへの接続を行っています。**
>
>新しいコントラクトインスタンス（＝ `connectedContract` ）を作成するには、以下3つの変数を `ethers.Contract` 関数に渡す必要があります。
>
> 1. `CONTRACT_ADDRESS`: コントラクトのデプロイ先のアドレス（ローカル、テストネット、またはメインネット）
>
> 2. `myEpicNft.abi`: コントラクトの ABI
>
> 3. `signer` もしくは `provider`
>
> コントラクトインスタンスでは、コントラクトに格納されているすべての関数を呼び出すことができます。
>
> もしこのコントラクトインスタンスに `provider` を渡すと、そのインスタンスは**読み取り専用の機能しか実行できなくなります**。
>
> 一方、`signer` を渡すと、そのインスタンスは**読み取りと書き込みの両方の機能を実行できるようになります**。
>
> ※ ABIについてはこのレッスンの終盤にて詳しく説明します。

次に、下記のコードを見ていきましょう。

```javascript
// App.js
console.log("Going to pop wallet now to pay gas...")
```

ここでは、`ethers.Contract` でコントラクトとの接続を行った後、承認が開始されることを通知しています。

次に、下記のコードを見ていきましょう。

```javascript
// App.js
let nftTxn = await connectedContract.makeAnEpicNFT();
console.log("Mining...please wait.")
```

ここでは、`makeAnEpicNFT` 関数をコントラクトから呼び出し、`await` を使用して、NFT の発行が承認（＝マイニング）されるまで、処理を止めています。

`console.log` では、 NFT を発行するためのトランザクションが「承認中」であることを通知しています。

次に、下記のコードを見ていきましょう。

```javascript
await nftTxn.wait();
console.log(`Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`);
```

承認が終わったら、`await nftTxn.wait()` が実行され、トランザクションの結果を取得します。コードが冗長に感じるかもしれませんが、大事な処理です。

`console.log` では、取得したトランザクションの結果を、Etherscan URL として出力しています。

最後に、ユーザーが `Mint NFT` ボタンをクリックしたときに、`askContractToMintNft` 関数を呼び出すコードを見ていきましょう。

```javascript
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
すべての変更を `App.js` に反映させた後、ターミナルで`nft-collection-starter-project` ディレクトリに移動して下記を実行しみてください。

```bash
npm run start
```

ローカルサーバーで、WEBサイトが立ち上がり、下記のようなエラーがターミナルに出力されていれば、ここまでの実装は成功です。

```plaintext
Failed to compile.

src/App.js
  Line 78:73:  'myEpicNft' is not defined  no-undef

Search for the keywords to learn more about each error.
```

これから、ABIファイルを取得して、`myEpicNft` 変数を定義していきます。

📂 ABIファイルを取得する
---------------------------

ABI (Application Binary Interface) はコントラクトの取り扱い説明書のようなものです。

WEBアプリがコントラクトと通信するために必要な情報が、ABIファイルに含まれています。

コントラクト一つ一つにユニークな ABI ファイルが紐づいており、その中には下記の情報が含まれています。
1. そのコントラクトに使用されている関数の名前
2. それぞれの関数にアクセスするために必要なパラメータとその型
3. 関数の実行結果に対して返るデータ型の種類

ABI ファイルは、コントラクトがコンパイルされた時に生成され、`epic-nfts/artifacts` ディレクトリに自動的に格納されます。

ターミナルで `epic-nfts` ディレクトリに移動し、`ls` を実行しましょう。

`artifacts` ディレクトリの存在を確認してください。

ABIファイルの中身は、`MyEpicNFT.json` というファイルに格納されいます。

下記を実行して、ABIファイルをコピーしましょう。

1. ターミナル上で `epic-nfts` にいることを確認する（もしくは移動する）。
2. ターミナル上で下記を実行する。
> ```
> code artifacts/contracts/MyEpicNFT.sol/MyEpicNFT.json
> ```
3. VS Codeで `MyEpicNFT.json` ファイルが開かれるので、中身を全てコピーしましょう。

	※ VS Codeのファインダーを使って、直接 `MyEpicNFT.json` を開くことも可能です。

次に、下記を実行して、ABIファイルをWEBアプリから呼び出せるようにしましょう。
1. ターミナル上で `nft-collection-starter-project` にいることを確認する（もしくは移動する）。
2. 下記を実行して、`nft-collection-starter-project/src/` の中に `utils` ディレクトリを作成する。
> ```bash
> mkdir src/utils
>```
3. 下記を実行して、`utils` ディレクトリに `MyEpicNFT.json` ファイルを作成する。
>```bash
> touch src/utils/MyEpicNFT.json
>```
4. 下記を実行して、`MyEpicNFT.json` ファイルを VS Code で開く。
>```bash
> code nft-collection-starter-project/src/utils/MyEpicNFT.json
>```
5. **先ほどコピーした `epic-nfts/artifacts/contracts/MyEpicNFT.sol/MyEpicNFT.json` の中身を新しく作成した `nft-collection-starter-project/src/utils/MyEpicNFT.json` の中に貼り付けてください。**

ABI ファイルの準備ができたので、`App.js` にインポートしましょう。

下記を `App.js` の1行目に追加しましょう。

```javascript
import myEpicNft from './utils/MyEpicNFT.json';
```

ここでは、先ほど取得した、ABI ファイルを含む `MyEpicNFT.json` ファイルをインポートしています。

🥳 NFT を Mint する
----------

それでは、ターミナル上で`nft-collection-starter-project` ディレクトリに移動して下記を実行し、ローカル環境でWEBアプリをホストしてみましょう。

```bash
npm run start
```

WEBアプリの `Mint NFT` ボタンを押して、下記のようなポップアップが立ち上がったら、`Confirm` を押してください。

![](/public/images/ETH-NFT-collection/section-3/3_3_1.png)

ここで請求される少量の ETH（テストネットなので実際は偽 ETH ）は、通称**ガス代**と呼ばれます。

- ブロックチェーンは、AWS のようなクラウド上にデータを保存できるサーバーのようなものです。

- しかし、誰もそのデータを所有していません。

- 世界中に、ブロックチェーン上にデータを保存する作業を行う「マイナー」と呼ばれる人々が存在します。この作業に対して、わたしたちは代金を支払います。

- その代金が、**ガス代**です。

- イーサリアムのブロックチェーン上にデータを書き込む際、わたしたちは代金として `$ETH` を「マイナー」に支払う必要があります。

WEBアプリ上で `Inspect` を選択して、`Console` を確認してみましょう。

下記のような結果が出力されていれば、あなたの NFT は正常に Mint されています。
```
Found an authorized account: 0x3a0a49fb3cf930e599f0fa7abe554dc18bd1f135
currentAccount:  0x3a0a49fb3cf930e599f0fa7abe554dc18bd1f135
Going to pop wallet now to pay gas...
Mining...please wait.
Mined, see transaction: https://rinkeby.etherscan.io/tx/0x5a08f3e66852b5c1833f3a20fc292816bc2ec5a25eee1e8c83c3755000aa773a
```

`Console` に出力された `https://rinkeby.etherscan.io/...` のアドレスをクリックしてみましょう。
- あなたの Rinkeby Test Network 上のトランザクションの履歴が参照できます。

次に、[rinkeby.rarible.com](https://rinkeby.rarible.com/) にアクセスして、Mint した NFT があなたの Rinkeby Test Network のアドレスに紐づいているか確認してみましょう。

`Console` に出力された `currentAccount:` に続く、`0x..` のアドレスを Rarible のWEBサイトに貼り付けて、結果が表示されたら、`Items` タブを選択してください

![](/public/images/ETH-NFT-collection/section-3/3_3_2.png)

上図のように、あなたが Mint した NFT があなたのアドレスと紐づいていることが確認できたら、このプロジェクトはほぼ完成です。

🚨 コントラクトを再びデプロイする際の注意点
--------------------------------

コントラクトの中身を更新する場合、必ず下記3つのステップを実行することを忘れないようにしましょう。

**1 \. 再度、コントラクトをデプロイする。**

 - `npx hardhat run scripts/deploy.js --network rinkeby` を実行する必要があります。

2 \. フロントエンド（ `App.js` ）の `CONTRACT_ADDRESS` を更新する。

3 \. ABIファイルを更新する。

- `epic-nfts/artifacts/contracts/MyEpicNFT.sol/MyEpicNFT.json` の中身を新しく作成する `nft-collection-starter-project/src/utils/MyEpicNFT.json` の中に貼り付ける必要があります。

**コントラクトを更新する際、必ずこの3つのステップを実行してください。**

- 一度デプロイされたスマートコントラクトを変更することはできません。

- コントラクトを変更するには、完全に再デプロイする必要があります。

- 新しくデプロイされたスマートコントラクトは、ブロックチェーン上で新しいコントラクトとして扱われるため、すべての変数は**リセット**されます。

- **つまり、コントラクトのコードを更新したい場合、すべての NFT データが失われます。**

上記の点に注意しながら、コントラクトの更新を行ってください。

🙋‍♂️ 質問する
-------------------------------------------
ここまでの作業で何かわからないことがある場合は、Discordの`#section-3-help`で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の3点を記載してください✨
```
1. 何をしようとしていたか
2. エラー文をコピー&ペースト
3. エラー画面のスクリーンショット
```
-------------------------------------------
おめでとうございます！NFT を Mint できる WEBアプリはほぼ完成です。次のレッスンに進みましょう🎉
