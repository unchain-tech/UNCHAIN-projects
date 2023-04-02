### 👋 Web アプリケーションからスマートコントラクトを呼び出す

これまでのレッスンでは、スマートコントラクトのロジックの設定を行いました。

これからは、スマートコントラクトをWebアプリケーションから呼び出す機能を実装していきます。

下記のステップに沿って、Sepolia Test Networkにデプロイされたスマートコントラクトに、Webアプリケーションを接続させていきます。

1\. デプロイされた最新のコントラクトアドレスをコピーし、Webアプリケーションに貼り付けます。

2\. 最新のABIファイルをコピーして、Webアプリケーションのディレクトリに貼り付けます。ABIとは何かについては、のちほど詳しく説明します。

3\. クライアント（＝フロントエンド）からスマートコントラクト（＝バックエンド）にアクセスするために、`ethers.js`をインポートします。

### 🏠 最新のスマートコントラクトアドレスを取得する

あなたのスマートコントラクトのデプロイ先のアドレス（＝スマートコントラクトアドレス）を`App.js`でも使用します。

`deploy.js`スクリプトを実行するたびに、ターミナルに出力されていたアドレス(`Contract deployed to: 0x..`)を覚えていますか？

`0x..`が、あなたがデプロイしたスマートコントラクトアドレスになります。

ブロックチェーン上には、何百万ものコントラクトが存在しています。

クライアント（＝ Webアプリケーションのフロントエンド）に対して、どのコントラクトに接続するかを伝えるために、スマートコントラクトアドレスが必要です。

このアドレスは、さまざまなタイミングで使用する予定ですので、簡単にアクセスできるようにしましょう。

`nft-game-starter-project/src`の中に`constants.js`ファイルを作成し、以下のコードを追加してください。

```javascript
// constants.js
const CONTRACT_ADDRESS = "YOUR_CONTRACT_ADDRESS_GOES_HERE";

export { CONTRACT_ADDRESS };
```

**`YOUR_CONTRACT_ADDRESS_GOES_HERE`の部分にあなたのスマートコントラクトアドレスを貼り付けてください。**

次に、`App.js`ファイルに戻り、ファイルの先頭に下記をインポートして、`constants.js`にアクセスできるようにしましょう。

```javascript
// App.js
import { CONTRACT_ADDRESS } from "./constants";
```

### 📁 最新の ABI ファイルを取得します。

ABI（Application Binary Interface）はコントラクトの取り扱い説明書のようなものです。

Webアプリケーションがコントラクトと通信するために必要な情報が、ABIファイルに含まれています。

コントラクト1つ1つにユニークなABIファイルが紐づいており、その中には下記の情報が含まれています。

1\. そのコントラクトに使用されている関数の名前

2\. それぞれの関数にアクセスするために必要なパラメータとその型

3\. 関数の実行結果に対して返るデータ型の種類

ABIファイルは、コントラクトがコンパイルされた時に生成され、`epic-game/artifacts`ディレクトリに自動的に格納されます。

ターミナルで`epic-game`ディレクトリに移動し、`ls`を実行しましょう。

`artifacts`ディレクトリの存在を確認してください。

ABIファイルの中身は、`MyEpicGame.json`というファイルに格納されいます。

下記を実行して、ABIファイルをコピーしましょう。

1\. ターミナル上で`epic-game`にいることを確認する（もしくは移動する）。

2\. ターミナル上で下記を実行する。

> ```
> code artifacts/contracts/MyEpicGame.sol/MyEpicGame.json
> ```

3\. VS Codeで`MyEpicGame.json`ファイルが開かれるので、中身をすべてコピーしましょう。

    ※ VS Codeのファインダーを使って、直接 `MyEpicGame.json` を開くことも可能です。

次に、下記を実行して、ABIファイルをWebアプリケーションから呼び出せるようにしましょう。

1\. ターミナル上で`nft-game-starter-project`にいることを確認する（もしくは移動する）。

2\. 下記を実行して、`nft-game-starter-project/src/`の中に`utils`ディレクトリを作成する。

> ```bash
> mkdir src/utils
> ```

3\. 下記を実行して、`utils`ディレクトリに`MyEpicGame.json`ファイルを作成する。

> ```bash
> touch src/utils/MyEpicGame.json
> ```

4\. 下記を実行して、`MyEpicGame.json`ファイルをVS Codeで開く。

> ```bash
> code nft-game-starter-project/src/utils/MyEpicGame.json
> ```

5\. **先ほどコピーした`epic-game/artifacts/contracts/MyEpicGame.sol/MyEpicGame.json`の中身を新しく作成した`nft-game-starter-project/src/utils/MyEpicGame.json`の中に貼り付けてください。**

ABIファイルの準備ができたので、`App.js`にインポートしましょう。

下記を`App.js`の1行目に追加しましょう。

```javascript
// App.js
import myEpicGame from "./utils/MyEpicGame.json";
```

ここでは、先ほど取得した、ABIファイルを含む`MyEpicGame.json`ファイルをインポートしています。

### 🚨 コントラクトを再びデプロイする際の注意点

コントラクトの中身を更新する場合、必ず下記3つのステップを実行することを忘れないようにしましょう。

1\. 再度、コントラクトをデプロイする。

- `npx hardhat run scripts/deploy.js --network sepolia`を実行する必要があります。

2\. フロントエンド(`App.js`)の`CONTRACT_ADDRESS`を更新する。

3\. ABIファイルを更新する。

`epic-game/artifacts/contracts/MyEpicGame.sol/MyEpicGame.json`の中身を新しく作成する`nft-game-starter-project/src/utils/MyEpicGame.json`の中に貼り付ける必要があります。

**コントラクトを更新する際、必ずこの 3 つのステップを実行してください。**

- 一度デプロイされたスマートコントラクトを変更することはできません。

- コントラクトを変更するには、完全に再デプロイする必要があります。

- 新しくデプロイされたスマートコントラクトは、ブロックチェーン上で新しいコントラクトとして扱われるため、すべての変数は**リセット**されます。

- **つまり、コントラクトのコードを更新したい場合、すべての NFT データが失われます。**

### 📞 ethers.js を使用する

スマートコントラクトをWBEアプリケーションに接続するために、必要なものがすべてそろいました。

これから、スマートコントラクトを呼び出すため、JavaScriptでオブジェクトを設定していきます。

まず、[ethers.js](https://github.com/ethers-io/ethers.js) が提供するライブラリを`App.js`にインポートします。

- `import { CONTRACT_ADDRESS } from './constants'`の直下に下記を追加しましょう。

```javascript
// App.js
import { ethers } from "ethers";
```

ここでは、フロントエンドとコントラクトを連携させるライブラリ`ethers`をインポートしています。

### 🌐 ネットワークを確認する

次に、ユーザーがSepolia Test Networkに接続しているか確認し、そうでない場合は、フロントエンド上でアラートを出す関数を実装していきます。

`checkNetwork`関数を`const [characterNFT, setCharacterNFT] = useState(null);`の直下に追加してください。

```javascript
// App.js
// ユーザーがSepolia Network に接続されているか確認します。
// '11155111' は Sepolia のネットワークコードです。
const checkNetwork = async () => {
  try {
    if (window.ethereum.networkVersion !== "11155111") {
      alert("Sepolia Test Network に接続してください!");
    } else {
      console.log("Sepolia に接続されています.");
    }
  } catch (error) {
    console.log(error);
  }
};
```

`window.ethereum.networkVersion`では、ユーザーがどのイーサリアムネットワークを使用しているか確認しています。

イーサリアムネットワークには異なるチェーン IDが付与されており、SepoliaチェーンのIDは`11155111`です。

したがって、ユーザーがSepolia Test Networkに接続されてないことをWebアプリケーションが検知したら、「Sepolia Test Networkに接続してください!」というアラートがフロントエンドに表示されます。

次に、`App.js`を下記のように変更していきましょう。

- `checkNetwork()`を`checkIfWalletIsConnected`関数の中の`setCurrentAccount(account);`の直下に追加する。

- `connectWalletAction`関数を下記のように更新します。

> ```javascript
> // App.js
> // connectWallet メソッドを実装します。
> const connectWalletAction = async () => {
>   try {
>     const { ethereum } = window;
>     if (!ethereum) {
>       alert("MetaMask を ダウンロードしてください!");
>       return;
>     }
>
>     // ユーザーがウォレットを持っているか確認します。
>     checkIfWalletIsConnected();
>
>     // ウォレットアドレスに対してアクセスをリクエストしています。
>     const accounts = await ethereum.request({
>       method: "eth_requestAccounts",
>     });
>
>     // ウォレットアドレスを currentAccount に紐付けます。
>     console.log("Connected", accounts[0]);
>     setCurrentAccount(accounts[0]);
>
>     // ユーザーが Sepolia に接続されているか確認します。
>     checkNetwork();
>   } catch (error) {
>     console.log(error);
>   }
> };
> ```

### ⛰ ページがロードされたらスマートコントラクトを呼び出す

スマートコントラクトで`checkIfUserHasNFT`メソッドを作成したのを覚えていますか？

> ✍️: `checkIfUserHasNFT`メソッドの機能
>
> ユーザーがすでに NFT キャラクターを持っているかどうかを確認する。
>
> プレーヤーがすでに NFT キャラクターを Mint している場合、`checkIfUserHasNFT`メソッドはその NFT キャラクターのメタデータを返します。
>
> プレーヤーがまだ NFT キャラクターを Mint していない場合、空白の`CharacterAttributes`構造体を返します。

これからフロントエンドで、`checkIfUserHasNFT`メソッドを呼び出すコードを作成していきます。

まず、シナリオ2を振り返りましょう。

**シナリオ 2. ユーザーは Web アプリケーションにログインしており、かつ NFT キャラクターを持っていない場合**

    👉 WEBアプリ上に、`SelectCharacter` コンポーネントを表示します。

シナリオ2を実装するには、Webアプリケーションがフロントエンドにロードされたら、すぐに`checkIfUserHasNFT`メソッドを呼び出す必要があります。

上記を実装するために、`App.js`の中に、もう1つ`useEffect()`関数を作成しましょう。

- `checkIfWalletIsConnected();`を呼び出している`useEffect()`関数の直下に、新しい`useEffect()`関数（下記）を追加してください。

```javascript
// App.js
// ページがロードされたときに useEffect()内の関数が呼び出されます。
useEffect(() => {
  // スマートコントラクトを呼び出す関数です。
  const fetchNFTMetadata = async () => {
    console.log("Checking for Character NFT on address:", currentAccount);

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const gameContract = new ethers.Contract(
      CONTRACT_ADDRESS,
      myEpicGame.abi,
      signer
    );

    const txn = await gameContract.checkIfUserHasNFT();
    if (txn.name) {
      console.log("User has character NFT");
      setCharacterNFT(transformCharacterData(txn));
    } else {
      console.log("No character NFT found");
    }
  };

  // 接続されたウォレットがある場合のみ、下記を実行します。
  if (currentAccount) {
    console.log("CurrentAccount:", currentAccount);
    fetchNFTMetadata();
  }
}, [currentAccount]);
```

ここでは、Webアプリケーションがロードされると同時に、スマートコントラクトを呼び出しています。

> ⚠️: 注意
>
> ブラウザ上の Console に`transformCharacterData`が未定義であるというエラーが発生していても、すぐに解決していくので、このまま進んでください。

追加されたコードを見ながら、新しい概念について学びましょう。

```javascript
// App.js
const provider = new ethers.providers.Web3Provider(window.ethereum);
```

`provider`を介して、ユーザーはブロックチェーン上に存在するイーサリアムノードに接続できます。

MetaMaskが提供するイーサリアムノードを使用して、デプロイされたコントラクトからデータを送受信するために上記の実装を行いました。

`ethers`のライブラリにより`provider`のインスタンスを新規作成しています。

次に、下記のコードを見ていきましょう。

```javascript
// App.js
const signer = provider.getSigner();
```

`signer`は、ユーザーのウォレットアドレスを抽象化したものです。

`provider`を作成し`provider.getSigner()`を呼び出すだけで、ユーザーはウォレットアドレスを使用してトランザクションに署名し、そのデータをイーサリアムネットワークに送信できます。

`provider.getSigner()`は新しい`signer`インスタンスを返すので、それを使って署名付きトランザクションを送信できます。

次に、下記のコードを見ていきましょう。

```javascript
// App.js
const gameContract = new ethers.Contract(
  CONTRACT_ADDRESS,
  myEpicGame.abi,
  signer
);
```

`provider`と`signer`を作成したら、コントラクトインスタンス(＝ `gameContract`)を作成する準備が整います。

新しいコントラクトインスタンスを作成するには、以下3つの変数を`ethers.Contract`関数に渡す必要があります。

1\. `CONTRACT_ADDRESS`: コントラクトのデプロイ先のアドレス（ローカル、テストネット、またはイーサリアムメインネット）

2\. `myEpicGame.abi`: コントラクトのABI

3\. `signer`もしくは`provider`

`gameContract`が設定されたら、`checkIfUserHasNFT`メソッドを呼び出すことができます。

```javascript
// App.js
const txn = await gameContract.checkIfUserHasNFT();
```

この処理により、ブロックチェーン上のコントラクトにアクセスし、`checkIfUserHasNFT()`メソッドを呼び出します。

`MyEpicGame.sol`に記載されている`checkIfUserHasNFT()`メソッドは、下記のような内容になります。

```solidity
// MyEpicGame.sol

// ユーザーがすでに NFT キャラクターを持っているかどうかを確認します。
// ユーザーのウォレットに NFT キャラクターがすでに存在する場合は、その属性を取得情報（ HP など）を取得します。
function checkIfUserHasNFT() public view returns (CharacterAttributes memory) {
	// ユーザーの tokenId を取得します。
	uint256 userNftTokenId = nftHolders[msg.sender];

	// ユーザーがすでにtokenIdを持っている場合、そのキャラクターの属性情報を返します。
	if (userNftTokenId > 0) {
		return nftHolderAttributes[userNftTokenId];
	}
	// それ以外の場合は、空文字を返します。
	else {
		CharacterAttributes memory emptyStruct;
		return emptyStruct;
	}
}
```

次に、下記のコードを見ていきましょう。

```javascript
// App.js
if (txn.name) {
  console.log("User has character NFT");
  setCharacterNFT(transformCharacterData(txn));
} else {
  console.log("No character NFT found!");
}
```

コントラクトからデータ(`txn`)を受信したら、下記を実行します。

- ユーザーがNFTキャラクターを持っているか否か確認する。

- ユーザーがNFTキャラクターを持っている場合は、そのNFTのデータの中身を確認する。

`txn.name`でユーザーが所有するNFTキャラクターの名前を取得します。

`if (txn.name) ... else`は、もし`txn.name`が存在した場合は、ユーザーはNFTキャラクターを持っていると判断します。そうでない場合は、まだNFTをユーザーがMintしていないと判断するロジックです。

それでは、このデータ(`txn`)を使用して、`characterNFT`の状態を設定し、アプリケーションで使用できるようにしていきましょう。

次に、下記のコードを見ていきましょう。

```javascript
// App.js
if (currentAccount) {
  console.log("CurrentAccount:", currentAccount);
  fetchNFTMetadata();
}
```

ユーザーのウォレットアドレスがWebアプリケーションに接続されている場合にのみ(`if (currentAccount)`)、`fetchNFTMetadata()`関数を呼び出します。

`useEffect`を実行するときはいつでも、**ユーザーのウォレットアドレスが接続されていること**を確認する必要があります。

最後に下記のコードを見ていきましょう。

```javascript
// App.js
useEffect(() => {
	...
}, [currentAccount]);
```

`[currentAccount]`は、MetaMaskから取得するユーザーのパブリックウォレットアドレスです。

**`currentAccount`の値が変更されると、この`useEffect`が起動されます。**

たとえば、`currentAccount`が`null`から新しいウォレットアドレスに変更されると、`useEffect`のロジックが実行されます。

### ⏫ `constants.js`を更新する

それでは、`nft-game-starter-project/src`に移動し、コントラクトアドレスを保持するために作成した`constants.js`ファイルの中身を下記のように更新しましょう。

```javascript
// constants.js
// CONTRACT_ADDRESSに、コントラクトアドレスを保存します。
const CONTRACT_ADDRESS = "YOUR_CONTRACT_ADDRESS_GOES_HERE";

//NFT キャラクター の属性をフォーマットしてオブジェクトとして返します。
const transformCharacterData = (characterData) => {
  return {
    name: characterData.name,
    imageURI: characterData.imageURI,
    hp: characterData.hp.toNumber(),
    maxHp: characterData.maxHp.toNumber(),
    attackDamage: characterData.attackDamage.toNumber(),
  };
};

// 変数を constants.js 以外の場所でも使えるようにします。
export { CONTRACT_ADDRESS, transformCharacterData };
```

`transformCharacterData`により、スマートコントラクトのデータが、`App.js`でも使用できる優れたオブジェクトになります。

次に、`App.js`に向かい、`import { ethers } from 'ethers';`の直下に下記を追加してください。

```javascript
// App.js
import { CONTRACT_ADDRESS, transformCharacterData } from "./constants";
```

この処理により、`constants.js`で宣言された`CONTRACT_ADDRESS`と`transformCharacterData`が`App.js`でも使えます。

- `constants.js`上で`transformCharacterData`を`export`し、`App.js`上で`import`したので、Console上の`transformCharacterData`が未定義であるというエラーは解消します。

### ⭕️ レンダリングをテストする

最後に、すべてのロジックが正確にWebアプリケーションにレンダリングされているかテストしていきましょう。

ターミナルに向かい、`nft-game-starter-project`上で下記を実行し、ローカルサーバーでWebサイトを立ち上げてください。

```
npm run start
```

次に、ブラウザのMetaMaskのプラグインをクリックし、あなたのウォレットアドレスの接続状況を確認しましょう。

もし、下図のように`Connected`と表示されている場合は、`Connected`の文字をクリックします。
![](/public/images/ETH-NFT-Game/section-3/3_4_1.png)

そこで、Webサイトとあなたのウォレットアドレスの接続を一度解除します。

- `Disconnect this account`を選択してください。

![](/public/images/ETH-NFT-Game/section-3/3_4_2.png)

ページをリフレッシュして、下記のように、`Connect Wallet to Get Started`ボタンが画面の中央に表示されていることを確認してください。

![](/public/images/ETH-NFT-Game/section-3/3_4_3.png)

次に、`Connect Wallet to Get Started`ボタンを押して、ウォレットを接続しましょう。

さらに、Webアプリケーション上で右クリックを行い、`Inspect`をクリックしたら、Consoleに向かいましょう。

![](/public/images/ETH-NFT-Game/section-3/3_4_4.png)

Consoleに下記のアウトプットが表示されていることを確認してください。

```
No character NFT found
```

ここまで実行できたら、テストは成功です。

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

次のレッスンに進んで、NFTキャラクターの作成を行いましょう 🤘!
