💫 UIの仕上げ
---

NFT キャラクターを Mint したり、ボスのデータを取得したりするときに、ローディングマークを UI に表示していきましょう。

これから、下記のケースにローディングマーク実装していきます。

1. `App.js` : ユーザーが NFT キャラクターを持っているかフロントエンドが確認している状況

2. `SelectCharacter` コンポーネント : ユーザーが NFT キャラクターを Mint するのをフロントエンドが待機している状況

3. `Arena` コンポーネント : 攻撃が終了するのをフロントエンドが待機している状況

`nft-game-starter-project/src/Components` フォルダに `LoadingIndicator` コンポーネントが格納されています。

このレッスンでは、この `LoadingIndicator` コンポーネントを使っていきます。

🔁 `App.js` にローディングマークを追加する
---

一つ目のケース、「ユーザーが NFT キャラクターを持っているかフロントエンドが確認している状況」で、WEBアプリにローディングマークを表示していきましょう。

まず、`App.js` を開き、`const [characterNFT, setCharacterNFT] = useState(null);` の直下に下記を追加しましょう。

```javascript
// App.js
// ロード状態を初期化します。
const [isLoading, setIsLoading] = useState(false);
```

次に、コントラクトから `checkIfUserHasNFT` 関数を呼び出すなど、非同期操作を実行している際に、ロード状態を設定する実装を行います。

`setIsLoading(true);` を、下記二つの `useEffects` に追加しましょう。

```javascript
// App.js
// ページがロードされたときに useEffect()内の関数が呼び出されます。
useEffect(() => {
	// ページがロードされたら、即座にロード状態を設定するようにします。
	setIsLoading(true);
	checkIfWalletIsConnected();
}, []);

// ページがロードされたときに useEffect()内の関数が呼び出されます。
useEffect(() => {
	// スマートコントラクトを呼び出す関数です。
	const fetchNFTMetadata = async () => {
		console.log('Checking for Character NFT on address:', currentAccount);

		const provider = new ethers.providers.Web3Provider(window.ethereum);
		const signer = provider.getSigner();
		const gameContract = new ethers.Contract(
		CONTRACT_ADDRESS,
		myEpicGame.abi,
		signer
		);

	const txn = await gameContract.checkIfUserHasNFT();
	if (txn.name) {
		console.log('User has character NFT');
		setCharacterNFT(transformCharacterData(txn));
	} else {
		console.log('No character NFT found');
	}
	// ユーザーが保持しているNFTの確認が完了したら、ロード状態を false に設定します。
	setIsLoading(false);
};
```
<!-- ```javascript
// App.js
// UseEffects
useEffect(() => {
  // ページがロードされたら、即座にロード状態を設定するようにします。
  setIsLoading(true);
  checkIfWalletIsConnected();
}, []);

useEffect(() => {
  const fetchNFTMetadata = async () => {
    console.log('Checking for Character NFT on address:', currentAccount);
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const gameContract = new ethers.Contract(
      CONTRACT_ADDRESS,
      myEpicGame.abi,
      signer
    );
    const characterNFT = await gameContract.checkIfUserHasNFT();
    if (characterNFT.name) {
      console.log('User has character NFT');
      setCharacterNFT(transformCharacterData(characterNFT));
    }
    // ユーザーが保持しているNFTの確認が完了したら、ロード状態を false に設定します。
    setIsLoading(false);
  };
  if (currentAccount) {
    console.log('CurrentAccount:', currentAccount);
    fetchNFTMetadata();
  }
}, [currentAccount]);
``` -->

次に、`App.js` の先頭に下記を追加して、`LoadingIndicator` をインポートしてください。

```javascript
// App.js
import LoadingIndicator from './Components/LoadingIndicator';
```

次に、`renderContent` 関数の先頭に、下記を追加しましょう。

```javascript
// App.js
// アプリがロード中の場合は、LoadingIndicatorをレンダリングします。
if (isLoading) {
	return <LoadingIndicator />;
}
```

この処理により、WEBアプリがコントラクトからデータを読み込んでいる間は、ローディングマークが表示されます。

次に、`checkIfWalletIsConnected` に下記のように更新して、フロントエンドがユーザーがメタマクスを持っているか確認している際に、ローディングマークを表示させましょう。

```javascript
// Actions
// ユーザーがメタマクスを持っているか確認します。
const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        console.log('Make sure you have MetaMask!');

        // 次の行でreturnを使用するため、ここでisLoadingを設定します。
        setIsLoading(false);
        return;

      } else {

        console.log('We have the ethereum object', ethereum);

        // accountsにWEBサイトを訪れたユーザーのウォレットアカウントを格納します。
        // （複数持っている場合も加味、よって account's' と変数を定義している）
        const accounts = await ethereum.request({ method: 'eth_accounts' });

        // もしアカウントが一つでも存在したら、以下を実行。
        if (accounts.length !== 0) {

          // accountという変数にユーザーの1つ目（=Javascriptでいう0番目）のアドレスを格納
          const account = accounts[0];
          console.log('Found an authorized account:', account);

          // currentAccountにユーザーのアカウントアドレスを格納
          setCurrentAccount(account);
        } else {
          console.log('No authorized account found');
        }

      }
    } catch (error) {
      console.log(error);
    }
    //すべての関数ロジックの後に、state プロパティを解放します。
    setIsLoading(false);
};
```

🔁 `SelectCharacter` コンポーネントにローディングマークを追加する
---

二つ目のケース、「ユーザーが NFT キャラクターを Mint するのをフロントエンドが待機している状況」で、WEBアプリにローディングマークを表示していきましょう。


まず、`nft-game-starter-project/src/Components/SelectCharacter/index.js` の先頭に、下記を追加しましょう。

```javascript
// SelectCharacter/index.js
import LoadingIndicator from '../../Components/LoadingIndicator';
```

次に、`SelectCharacter/index.js` の中に記載された `const [gameContract, setGameContract] = useState(null);` の直下に、`const [mintingCharacter, setMintingCharacter] = useState(false);` を追加しましょう。

- 下記を参照してください。

```javascript
// SelectCharacter/index.js
//NFT キャラクターのメタデータを保存する状態変数を初期化します。
const [characters, setCharacters] = useState([]);

// コントラクトのデータを保有する状態変数を初期化します。
const [gameContract, setGameContract] = useState(null);

// Minting の状態保存する状態変数を初期化します。
const [mintingCharacter, setMintingCharacter] = useState(false);
```

ここでは、`App.js` で `isLoading` を初期化した時と同様に、 NFT の Minting 状態を保存する `mintingCharacter` という状態変数を初期化しています。

次に、`mintCharacterNFTAction` の中に、`setMintingCharacter` を3つ設置していきます。

- 下記を参考にしてください。

```javascript
// SelectCharacter/index.js
// NFT を Mint します。
const mintCharacterNFTAction = (characterId) => async () => {
	try {
		if (gameContract) {
		// Mint が開始されたら、ローディングマークを表示する。
		setMintingCharacter(true);

		console.log('Minting character in progress...');
		const mintTxn = await gameContract.mintCharacterNFT(characterId);
		await mintTxn.wait();
		console.log('mintTxn:', mintTxn);
		// Mint が終了したら、ローディングマークを消す。
		setMintingCharacter(false);
		}
	} catch (error) {
		console.warn('MintCharacterAction Error:', error);
		// エラーが発生した場合も、ローディングマークを消す。
		setMintingCharacter(false);
	}
};
```

最後に、NFT が Mint されている間にローディングマークを表示する HTML を実装しましょう。

- `SelectCharacter/index.js` の中にある `return();` の中身を下記のように更新してください。

```javascript
// SelectCharacter/index.js
return (
  <div className="select-character-container">
	<h2>⏬ 一緒に戦う NFT キャラクターを選択 ⏬</h2>
    {characters.length > 0 && (
      <div className="character-grid">{renderCharacters()}</div>
    )}
    {/* mintingCharacter = trueの場合のみ、ローディングマークを表示します。*/}
    {mintingCharacter && (
      <div className="loading">
        <div className="indicator">
          <LoadingIndicator />
          <p>Minting In Progress...</p>
        </div>
        <img
          src="https://i.imgur.com/JjXJ4Hf.gif"
          alt="Minting loading indicator"
        />
      </div>
    )}
  </div>
);
```

`SelectedCharacter.css` にも下記のCSSを追加しましょう。

- `nft-game-starter-project/src/Components/SelectCharacter` フォルダの中に `SelectedCharacter.css`が格納されています。

```javascript
// SelectedCharacter.css
.select-character-container .loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 75px;
}
.select-character-container .loading .indicator {
  display: flex;
}
.select-character-container .loading .indicator p {
  font-weight: bold;
  font-size: 28px;
  padding-left: 5px;
}
.select-character-container .loading img {
  width: 450px;
  padding-top: 25px;
}
```

上記の実装はフロントエンドに下記のように反映されます。

![](/public/images/ETH-NFT-game/section-4/4_1_1.png)


🔁 `Arena` コンポーネントにローディングマークを追加する
---

三つ目のケース、「攻撃が終了するのをフロントエンドが待機している状況」で、WEBアプリにローディングマークを表示していきましょう。


まず、`nft-game-starter-project/src/Components/Arena/index.js` の先頭に、下記を追加しましょう。

```javascript
// Arena/index.js
import LoadingIndicator from '../../Components/LoadingIndicator';
```

次に、`Arena/index.js` に記載されている `return();` の中身に着目し、`{boss ..}` の中身を下記のように更新してください。

```javascript
  {boss && (
    <div className="boss-container">
	  {/* attackState 追加します */}
      <div className={`boss-content  ${attackState}`}>
        <h2>🔥 {boss.name} 🔥</h2>
        <div className="image-content">
          <img src={boss.imageURI} alt={`Boss ${boss.name}`} />
          <div className="health-bar">
            <progress value={boss.hp} max={boss.maxHp} />
            <p>{`${boss.hp} / ${boss.maxHp} HP`}</p>
          </div>
        </div>
      </div>
      <div className="attack-container">
        <button className="cta-button" onClick={runAttackAction}>
          {`💥 Attack ${boss.name}`}
        </button>
      </div>
      {/* Attack ボタンの下にローディングマークを追加します*/}
      {attackState === 'attacking' && (
        <div className="loading-indicator">
          <LoadingIndicator />
          <p>Attacking ⚔️</p>
        </div>
      )}
    </div>
  )}
```

最後に、下記のCSSを、`Arena.css` ファイルに追加してください。

- `nft-game-starter-project/src/Components/Arena` フォルダの中に `Arena.css` が格納されています。

```javascript
// Arena.css
.boss-container .loading-indicator {
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 25px;
}
.boss-container .loading-indicator p {
  font-weight: bold;
  font-size: 28px;
}
```

上記のコードを実装したら、WEBアプリを確認してみましょう。
![](/public/images/ETH-NFT-game/section-4/4_1_2.png)

上記のようにローディングマークが `Arena` ページに表示されているでしょうか？✨

🚨 `Arena` ページに攻撃アラートを追加する

最後に、ボスに与えたダメージをフロントエンド上に表示するコードを実装していきましょう。

まず、下記のCSSを `Arena.css`  ファイルに追加しましょう。

```javascript
// nft-game-starter-project/src/Components/Arena/Arena.css
/* Toast */
#toast {
  visibility: hidden;
  max-width: 500px;
  height: 90px;
  margin: auto;
  background-color: gray;
  color: #fff;
  text-align: center;
  border-radius: 10px;
  position: fixed;
  z-index: 1;
  left: 0;
  right: 0;
  bottom: 30px;
  font-size: 17px;
  white-space: nowrap;
}
#toast #desc {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 28px;
  font-weight: bold;
  height: 90px;
  overflow: hidden;
  white-space: nowrap;
}
#toast.show {
  visibility: visible;
  -webkit-animation: fadein 0.5s, expand 0.5s 0.5s, stay 3s 1s, shrink 0.5s 2s,
    fadeout 0.5s 2.5s;
  animation: fadein 0.5s, expand 0.5s 0.5s, stay 3s 1s, shrink 0.5s 4s,
    fadeout 0.5s 4.5s;
}
@-webkit-keyframes fadein {
  from {
    bottom: 0;
    opacity: 0;
  }
  to {
    bottom: 30px;
    opacity: 1;
  }
}
@keyframes fadein {
  from {
    bottom: 0;
    opacity: 0;
  }
  to {
    bottom: 30px;
    opacity: 1;
  }
}
@-webkit-keyframes expand {
  from {
    min-width: 50px;
  }
  to {
    min-width: 350px;
  }
}
@keyframes expand {
  from {
    min-width: 50px;
  }
  to {
    min-width: 350px;
  }
}
@-webkit-keyframes stay {
  from {
    min-width: 350px;
  }
  to {
    min-width: 350px;
  }
}
@keyframes stay {
  from {
    min-width: 350px;
  }
  to {
    min-width: 350px;
  }
}
@-webkit-keyframes shrink {
  from {
    min-width: 350px;
  }
  to {
    min-width: 50px;
  }
}
@keyframes shrink {
  from {
    min-width: 350px;
  }
  to {
    min-width: 50px;
  }
}
@-webkit-keyframes fadeout {
  from {
    bottom: 30px;
    opacity: 1;
  }
  to {
    bottom: 60px;
    opacity: 0;
  }
}
@keyframes fadeout {
  from {
    bottom: 30px;
    opacity: 1;
  }
  to {
    bottom: 60px;
    opacity: 0;
  }
}
```

次に、`nft-game-starter-project/src/Components/Arena/index.js` を開き、HTML が記載されている `return();` の中身を下記のように更新しましょう。

```javascript
return (
  <div className="arena-container">
    {/* 攻撃ダメージの通知を追加します */}
    {boss && characterNFT && (
      <div id="toast" className={showToast ? 'show' : ''}>
        <div id="desc">{`💥 ${boss.name} was hit for ${characterNFT.attackDamage}!`}</div>
      </div>
    )}
    {/* ボスをレンダリングします */}
    {boss && (
      <div className="boss-container">
        <div className={`boss-content  ${attackState}`}>
          <h2>🔥 {boss.name} 🔥</h2>
          <div className="image-content">
            <img src={boss.imageURI} alt={`Boss ${boss.name}`} />
            <div className="health-bar">
              <progress value={boss.hp} max={boss.maxHp} />
              <p>{`${boss.hp} / ${boss.maxHp} HP`}</p>
            </div>
          </div>
        </div>
        <div className="attack-container">
          <button className="cta-button" onClick={runAttackAction}>
            {`💥 Attack ${boss.name}`}
          </button>
        </div>
		{/* Attack ボタンの下にローディングマークを追加します*/}
        {attackState === 'attacking' && (
          <div className="loading-indicator">
            <LoadingIndicator />
            <p>Attacking ⚔️</p>
          </div>
        )}
      </div>
    )}
	{/* NFT キャラクター をレンダリングします*/}
    {characterNFT && (
      <div className="players-container">
        <div className="player-container">
          <h2>Your Character</h2>
          <div className="player">
            <div className="image-content">
              <h2>{characterNFT.name}</h2>
              <img
                src={characterNFT.imageURI}
                alt={`Character ${characterNFT.name}`}
              />
              <div className="health-bar">
                <progress value={characterNFT.hp} max={characterNFT.maxHp} />
                <p>{`${characterNFT.hp} / ${characterNFT.maxHp} HP`}</p>
              </div>
            </div>
            <div className="stats">
              <h4>{`⚔️ Attack Damage: ${characterNFT.attackDamage}`}</h4>
            </div>
          </div>
        </div>
        {/* <div className="active-players">
          <h2>Active Players</h2>
          <div className="players-list">{renderActivePlayersList()}</div>
        </div> */}
      </div>
    )}
  </div>
);
```

最後に、`Arena/index.js` を更新して、攻撃ダメージの表示と非表示の設定を行います。

`Arena.css` の中に下記のような `show` クラスが存在することを確認してください。

```javascript
// nft-game-starter-project/src/Components/Arena/Arena.css
#toast.show {
  visibility: visible;
  -webkit-animation: fadein 0.5s, expand 0.5s 0.5s, stay 3s 1s, shrink 0.5s 2s,
    fadeout 0.5s 2.5s;
  animation: fadein 0.5s, expand 0.5s 0.5s, stay 3s 1s, shrink 0.5s 4s,
    fadeout 0.5s 4.5s;
}
```

`show` クラスを `Arena/index.js` 上で排除すると、攻撃メッセージが非表示になります。

これから、動的に `show` クラスの表示と非表示を変更するロジックを実装していきましょう。

まず、`const [attackState, setAttackState] = useState('');` の直下に下記を追加しましょう。

```javascript
// Arena/index.js
// 攻撃ダメージの表示形式を保存する変数を初期化します。
const [showToast, setShowToast] = useState(false);
```

次に、下記のように、`runAttackAction` 関数に `setShowToast` を設定していきましょう。

```javascript
// Arena/index.js
const runAttackAction = async () => {
  try {
	// コントラクトが呼び出されたことを確認します。
	if (gameContract) {
	  // attackState の状態を attacking に設定します。
	  setAttackState('attacking');
	  console.log('Attacking boss...');

	  // NFT キャラクターがボスを攻撃します。
	  const attackTxn = await gameContract.attackBoss();

	  // トランザクションがマイニングされるまで待ちます。
	  await attackTxn.wait();
	  console.log('attackTxn:', attackTxn);

	  // attackState の状態を hit に設定します。
	  setAttackState('hit');

      // 攻撃ダメージの表示をtrueに設定し（表示）、5秒後にfalseに設定する（非表示）
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 5000);

    }
  } catch (error) {
    console.error('Error attacking boss:', error);
    setAttackState('');
  }
};
```

ここでは、`setTimeout` を使用して、攻撃メッセージを5秒間表示した後に、非表示にするロジックを追加しています。

上記の実装が成功した場合、WEBアプリ上でボスを攻撃すると、下記のような攻撃ダメージが表示されます✨

![](/public/images/ETH-NFT-game/section-4/4_1_3.png)

🙋‍♂️ 質問する
-------------------------------------------
ここまでの作業で何かわからないことがある場合は、Discordの `#section-4-help` で質問してください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の3点を記載してください✨
```
1. 何をしようとしていたか
2. エラー文をコピー&ペースト
3. エラー画面のスクリーンショット
```
-------------------------------------------
次のレッスンに進んで、WEBアプリを Vercel にデプロイしましょう🎉
