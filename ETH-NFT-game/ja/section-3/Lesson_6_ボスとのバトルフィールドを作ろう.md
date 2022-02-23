💥 ボスと戦う
---

前回のレッスンで、シナリオの 1 と 2 を実装しました。

✅ **シナリオ1. ユーザーがWEBアプリにログインしていない場合**

	👉 WEBアプリ上に、"Connect Wallet to Get Started" ボタンを表示します。

✅ **シナリオ2. ユーザーはWEBアプリにログインしており、かつ NFT キャラクターを持っていない場合**

	👉 WEBアプリ上に、`SelectCharacter` コンポーネントを表示します。

これから、ボスとのバトルフィールド「 `Arina` 」を作成し、シナリオ 3 を実装していきます。

🔥 **シナリオ3. ユーザーはWEBアプリにログインしており、かつ NFT キャラクターを持っている場合**

	👉 WEBアプリ上に、「Arena Component」を表示します。

		- 「Arena Component」は、プレイヤーがボスと戦う場所です。

まず、ターミナル上で `nft-game-starter-project/src/Components/Arena` フォルダに移動して、`index.js`という名前の新しいファイルを作成しましょう。

`Arena` フォルダには `Arena.css` ファイルが含まれています。

WEBアプリの構築が完了したら、CSSのスタイリングを楽しんでください✨

⚔️ `Arena` を作成する

次に、`nft-game-starter-project/src/Components/Arena/index.js` を開き、下記のコードを貼り付けましょう。

```javascript
import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, transformCharacterData } from '../../constants';
import myEpicGame from '../../utils/MyEpicGame.json';
import './Arena.css';
// フロントエンドにNFTキャラクターを表示するため、characterNFTのメタデータを渡します。
const Arena = ({ characterNFT }) => {
  // コントラクトのデータを保有する状態変数を初期化します。
  const [gameContract, setGameContract] = useState(null);
  // ページがロードされると下記が実行されます。
  useEffect(() => {
    const { ethereum } = window;
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const gameContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        myEpicGame.abi,
        signer
      );
      setGameContract(gameContract);
    } else {
      console.log('Ethereum object not found');
    }
  }, []);
  return (
    <div className="arena-container">
      {/* ボス */}
      <p>ボスを表示します。</p>
      {/* NFT キャラクター */}
      <p>NFT キャラクターを表示します。</p>
    </div>
  );
};
export default Arena;
```

`Arena` コンポーネント準備ができたので、`App.js` に戻って、シナリオ 3 を実装していきます。

**シナリオ3. ユーザーはWEBアプリにログインしており、かつ NFT キャラクターを持っている場合**

	👉 WEBアプリ上に、「Arena Component」を表示します。

		- 「Arena Component」は、プレイヤーがボスと戦う場所です。

まず、`Arena` をインポートするため、`App.js` の先頭に、下記を追加しましょう。

```javascript
// App.js
import Arena from './Components/Arena';
```

次に、`renderContent` 関数を下記のように更新しましょう。

```javascript
// レンダリングメソッド
const renderContent = () => {
	// シナリオ1.
	// ユーザーがWEBアプリにログインしていない場合、WEBアプリ上に、"Connect Wallet to Get Started" ボタンを表示します。
	if (!currentAccount) {
		return (
		<div className="connect-wallet-container">
			<img
				src="https://i.imgur.com/yMocj5x.png"
				alt="Pickachu"
			/>
			<button
			className="cta-button connect-wallet-button"
			onClick={connectWalletAction}
			>
			Connect Wallet to Get Started
			</button>
		</div>
		);
	// シナリオ2.
	// ユーザーはWEBアプリにログインしており、かつ NFT キャラクターを持っていない場合、WEBアプリ上に、"SelectCharacter Component" を表示します。
	} else if (currentAccount && !characterNFT) {
		return <SelectCharacter setCharacterNFT={setCharacterNFT} />;
	// シナリオ3.
	// ーザーはWEBアプリにログインしており、かつ NFT キャラクターを持っている場合、
	// Area でボスと戦います。
	} else if (currentAccount && characterNFT) {
		return <Arena characterNFT={characterNFT} />;
	}
};
```

WEBアプリを更新すると、「アリーナ」コンポーネントに直接移動します。

フロントエンドが下記のように表示されていれば、ここまでの実装は成功です。

![](/public/images/ETH-NFT-game/section-3/3_6_1.png)

😈 スマートコントラクトからボスを取得する
----

それでは、`Area` コンポーネントに、ボスのデータを取得していきましょう。

- `SelectCharacter` コンポーネントで、NFT キャラクターのデータを取得した方法と同じ要領で進めていきます。

まず、`Arena` コンポーネントの中の `const [gameContract, setGameContract] = useState(null);` の直下に下記を追記してください。

```javascript
// Arena/index.js
// ボスのメタデータを保存する状態変数を初期化します。
const [boss, setBoss] = useState(null);

// ページがロードされると下記が実行されます。
useEffect(() => {
  // コントラクトからボスのメタデータを取得し、bossを設定する非同期関数 fetchBoss を設定します。
  const fetchBoss = async () => {
    const bossTxn = await gameContract.getBigBoss();
    console.log('Boss:', bossTxn);
    setBoss(transformCharacterData(bossTxn));
  };
  if (gameContract) {
    // コントラクトの準備ができたら、ボスのメタデータを取得します。
    fetchBoss();
  }
}, [gameContract]);
```

上記の実装が完了したら、WEBアプリ上で、`Console` を開いて、ボスのデータが読み込まれていることを確認しましょう。

`Console` に下記のような結果が出力されていれば、実装は成功です。

![](/public/images/ETH-NFT-game/section-3/3_6_2.png)


🙀 ボスをフロントエンドにレンダリングする
---

まず、`Arena/index.js` に向かい、`const [boss, setBoss] = useState(null);` の直下に下記を追加しましょう。

```javascript
// Arena/index.js
// NFTキャラクターがボスを攻撃する際に使用する関数を定義します。
const  runAttackAction  =  async()=> {};
```

次に、`Arena/index.js` の `return();` の中身を下記のように更新しましょう。

```javascript
// Arena/index.js

return (
  <div className="arena-container">
    {/* ボスをレンダリングします */}
    {boss && (
      <div className="boss-container">
        <div className={`boss-content`}>
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
      </div>
    )}
    {/* NFT キャラクター */}
    <p>NFT キャラクターを表示します。</p>
  </div>
);
```

ローカルサーバーで、WEBアプリを開き、下記のようにボスが `Arena` にレンダリングされていることを確認してください。

![](/public/images/ETH-NFT-game/section-3/3_6_3.png)


🛡 NFT キャラクターを `Arena` にレンダリングする
---

ボスとのバトルフィールドである `Arena` に、NFT キャラクターをレンダリングしましょう。

`Arena/index.js` の `return();` の中身を下記のように更新しましょう。

```javascript
return (
  <div className="arena-container">
    {/* ボスをレンダリングします */}
    {boss && (
      <div className="boss-container">
        <div className={`boss-content`}>
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
      </div>
    )}
  </div>
);
```

ローカルサーバーで、WEBアプリを開き、下記のようにあなたの NFT キャラクターが `Arena` にレンダリングされていることを確認してください。

![](/public/images/ETH-NFT-game/section-3/3_6_4.png)

⚔ ボスとのバトルを実装する
---

これから、ボスとのバトルを実装していきます。

`Arena/index.js` を下記のように更新していきましょう。

```javascript
// Arena/index.js

// コントラクトのデータを保有する状態変数を初期化します。
const [gameContract, setGameContract] = useState(null);

// ボスのメタデータを保存する状態変数を初期化します。
const [boss, setBoss] = useState(null);

// 攻撃の状態を保存する変数を初期化します。
const [attackState, setAttackState] = useState('');

// ボスを攻撃する関数を設定します。
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
    }
  } catch (error) {
    console.error('Error attacking boss:', error);
    setAttackState('');
  }
};
```

更新したのは、以下の2点です。

**1 \. `const [boss, setBoss] = useState(null);` の直下に、下記を追加。**

```javascript
// Arena/Index.js
// 攻撃の状態を保存する変数を初期化します。
const [attackState, setAttackState] = useState('');
```

`attackState` はバトル中にアニメーションを発生させるために追加しています。

`setAttackState` を使用すると、`attackState` に、下記3つの状態のいずれかを保存することができます。

- `attacking` : 攻撃をした後、トランザクションが完了するのを待っている状態

- `hit` : ボスに攻撃がヒットした状態

- `''` : デフォルトの状態

`nft-game-starter-project/src/Components/Arena/Arena.css` を開いて、`attacking` や `hit` を調べてみてください。

- アニメーションのための CSS が設定されています✨

**2 \. `runAttackAction` 関数の中身を更新。**

これから、WEBアプリに上記の実装を連携させていきます。

`Arena/index.js` の中の `return();` の中身を見ていきましょう。

- `{boss ..}` の中身を下記のように更新しましょう。

```javascript
return (
  <div className="arena-container">
    {/* ボスをレンダリングします */}
    {boss && (
      <div className="boss-container">
        {/* attackState 追加します */}
        <div className={`boss-content ${attackState}`}>
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
      </div>
    )}
	{/* ここまでを更新 */}
    ...
  </div>
);
```

✊ テストを実行する
---

1 \. WEBアプリで `Attack MYU2` ボタンを押してください。

- MetaMask がポップアップして、攻撃の承認が求められます。

- `Confirm` を押して攻撃を行いましょう。

2 \. `Consol` に「`Attacking boss ...`」で始まるログが表示されることを確認しましょう。

3 \. 攻撃が完了すると、トランザクションハッシュ（ `attackTxn:` ）が `Console` に表示されます。

![](/public/images/ETH-NFT-game/section-3/3_6_5.png)

ここまで、完了したら、テストは成功です。

🩹 攻撃によるダメージを反映させる
---

それでは、NFT キャラクターとボスのダメージをWEBアプリに反映させていきましょう。

`MyEpicGame.sol` に記載した `event AttackComplete` をWEBアプリで受信するコードを実装していきます。

まず、`Arena/index.js` の中にある `Arena` コンポーネントを下記のように更新してください。

```javascript
// Arena/index.js
// NFT キャラクターの情報を更新するため、setCharacterNFT を引数として追加します。
const Arena = ({ characterNFT, setCharacterNFT }) => {
```

次に、`fetchBoss` 関数が記載されている `useEffect` の中身を下記のように更新しましょう。

```javascript
// Arena/index.js
// ページがロードされると下記が実行されます。
useEffect(() => {
	// ボスのデータをコントラクトから読み込む関数を設定します。
	const fetchBoss = async () => {
		//ボスのメタデータをコントラクトをから呼び出します。
		const bossTxn = await gameContract.getBigBoss();
		console.log('Boss:', bossTxn);
		// ボスの状態を設定します。
		setBoss(transformCharacterData(bossTxn));
	};

	// AttackCompleteイベントを受信したときに起動するコールバックメソッドを追加します。
	const onAttackComplete = (newBossHp, newPlayerHp) => {
		// ボスの新しいHPを取得します。
		const bossHp = newBossHp.toNumber();
		// NFT キャラクターの新しいHPを取得します。
		const playerHp = newPlayerHp.toNumber();
		console.log(`AttackComplete: Boss Hp: ${bossHp} Player Hp: ${playerHp}`);

		// NFT キャラクターとボスのHPを更新します。
		setBoss((prevState) => {
			return { ...prevState, hp: bossHp };
		});
		setCharacterNFT((prevState) => {
			return { ...prevState, hp: playerHp };
		});
	};

	// コントラクトが呼び出されていたら、下記を実行します。
	if (gameContract) {
		fetchBoss();
		// リスナーの設定：ボスが攻撃された通知を受け取ります。
		gameContract.on('AttackComplete', onAttackComplete);
	}

	// コンポーネントがマウントされたら、リスナーを停止する。
	return () => {
		if (gameContract) {
			gameContract.off('AttackComplete', onAttackComplete);
		}
	}
}, [gameContract]);
```

また、`App.js` を開き、`Arena` コンポーネントを下記のよう更新してください。

- `Arena/index.js` で `Arena` コンポーネントの引数に、`setCharacterNFT` を追加したので、`App.js` にも更新を反映させます。

```javascript
// App.js
<Arena characterNFT={characterNFT} setCharacterNFT={setCharacterNFT} />
```
新しく追加したコードは、ほぼ `SelectCharacter` コンポーネントを設定したロジックと同じです。

一つだけ React の手法 [`prevState`](https://ratio.ym-tane.com/development/react-prevstate/) を使用したので、下記のコードを見ていきましょう。

```javascript
// Arena/index.js
setBoss((prevState) => {
  return { ...prevState, hp: bossHp };
});
setCharacterNFT((prevState) => {
  return { ...prevState, hp: playerHp };
});
```

ここでは、下記が行われています。

上記のように `prevState` を使用すると、変数の以前の状態にアクセス照して、値を変更することができます。

ここでは、以下の処理が行われています。

- `setBoss` で `boss` の `hp` 値を新しい値（ `bossHp` ）に更新

- `setCharacterNFT` で `characterNFT` の `hp` 値を新しい値（ `playerHp` ）に更新

😼 もう一度攻撃してみる

もう一度ミュウツーに攻撃を仕掛けてみましょう。

下記のようにボスと NFT キャラクターの HP が更新されていれば成功です。

![](/public/images/ETH-NFT-game/section-3/3_6_6.png)


🙋‍♂️ 質問する
-------------------------------------------
ここまでの作業で何かわからないことがある場合は、Discord の `#section-3-help` で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の3点を記載してください✨
```
1. 何をしようとしていたか
2. エラー文をコピー&ペースト
3. エラー画面のスクリーンショット
```
--------------
次のレッスンに進んで、UIを完成させましょう🎉
