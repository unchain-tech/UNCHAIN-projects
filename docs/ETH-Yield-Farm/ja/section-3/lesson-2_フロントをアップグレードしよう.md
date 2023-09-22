###  🖥 このレッスンの参考動画URL
[Dapp University](https://youtu.be/CgXQC4dbGUE?t=7594)

### 🔥 コントラクトとフロントエンドの接続部分の残りを完成させる

前のレッスンで作成させたものに加えてコントラクトとフロントエンドの接続部分を完成させましょう!

次に`App.js`を以下のように更新してください。

23~25行目の部分には、コントラクトのデプロイ時に出てくるアドレスをそれぞれ対応する変数に代入してください。

```javascript
import { ethers } from 'ethers';
import React, { useEffect, useState } from 'react';

/* ABIファイルをインポートする */
import daiAbi from './abis/DaiToken.json';
import dappAbi from './abis/DappToken.json';
import tokenfarmAbi from './abis/TokenFarm.json';
import './App.css';

function App() {
  /* ユーザーのパブリックウォレットを保存するために使用する状態変数を定義 */
  const [currentAccount, setCurrentAccount] = useState('');

  // 各トークンの残高を保存するために使用する状態変数を定義
  const [currentDaiBalance, setDaiBalance] = useState('0');
  const [currentDappBalance, setDappBalance] = useState('0');

  // フォームの入力値を保存するために使用する状態変数を定義
  const [stakedToken, setStakedToken] = useState('0');
  const [transferAddress, setTransferAddress] = useState('');

  // コントラクトアドレスを記載
  const daiTokenAddress = '0x30F80dd46e82Ec3A3cd0fe5aF29b378525F7e693';
  const dappTokenAddress = '0xe9eF0ccF59a3A5E255d6270A8BAF8e9bC5502756';
  const tokenfarmAddress = '0xb17c21AFD8775357b4a65b234081bddd87F825f7';

  //ウォレットアドレス(コントラクトの保持者)を記載
  const walletAddress = '0x04CD057E4bAD766361348F26E847B546cBBc7946';

  /* ABIの内容を参照する変数を作成 */
  const daiTokenABI = daiAbi.abi;
  const dappTokenABI = dappAbi.abi;
  const tokenfarmABI = tokenfarmAbi.abi;

  // コントラクトのインスタンスを格納する変数
  let daiContract;
  let dappContract;
  let tokenfarmContract;

  // ETHに変換する関数
  function convertToEth(n) {
    return n / 10 ** 18;
  }

  // WEIに変換する関数
  function convertToWei(n) {
    return n * 10 ** 18;
  }

  // 各トークンの残高を取得する関数
  const getBalance = async () => {
    const { ethereum } = window;
    try {
      if (ethereum) {
        // コントラクトのインスタンスを作成
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        console.log(signer);

        daiContract = new ethers.Contract(daiTokenAddress, daiTokenABI, signer);
        dappContract = new ethers.Contract(
          dappTokenAddress,
          dappTokenABI,
          signer,
        );
        tokenfarmContract = new ethers.Contract(
          tokenfarmAddress,
          tokenfarmABI,
          signer,
        );

        // 各トークンの残高を格納
        let daiBalance = await daiContract.balanceOf(currentAccount);
        let dappBalance = await dappContract.balanceOf(currentAccount);
        setDaiBalance(convertToEth(daiBalance));
        setDappBalance(convertToEth(dappBalance));
      }
    } catch (error) {
      console.log(error);
    }
  };

  // stakeする値を格納する関数
  const handleStakeChange = (event) => {
    setStakedToken(event.target.value);
    console.log('staked token is:', event.target.value);
  };

  // stake関数
  const stake = async () => {
    try {
      if (currentAccount !== '') {
        await daiContract.approve(
          tokenfarmContract.address,
          convertToWei(stakedToken).toString(),
        );
        await tokenfarmContract.stakeTokens(
          convertToWei(stakedToken).toString(),
        );
        console.log('value is:', stakedToken);
      }
      console.log('Connect Wallet');
    } catch (error) {
      console.log(error);
    }
  };

  // unstake関数
  const unStake = async () => {
    try {
      if (currentAccount !== '') {
        await tokenfarmContract.unstakeTokens(
          convertToWei(stakedToken).toString(),
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  // transferする先のアドレスを格納する関数
  const handleTransferChange = (event) => {
    setTransferAddress(event.target.value);
    console.log('staked token is:', event.target.value);
  };

  // transfer関数
  const transfer = async (event) => {
    try {
      if (currentAccount !== '') {
        await daiContract.transfer(
          transferAddress,
          convertToWei(100).toString(),
        );
        console.log('Successed to transfer DAI token to:', transferAddress);
      }
      console.log('Connect Wallet');
    } catch (error) {
      console.log(error);
    }
  };

  // ウォレット接続を確認する関数
  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        console.log('Make sure you have MetaMask!');
        return;
      } else {
        console.log('We have the ethereum object', ethereum);
      }
      /* ユーザーのウォレットへのアクセスが許可されているかどうかを確認 */
      const accounts = await ethereum.request({ method: 'eth_accounts' });
      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log('Found an authorized account:', account);
        setCurrentAccount(account);
        getBalance();
      } else {
        console.log('No authorized account found');
      }
    } catch (error) {
      console.log(error);
    }
  };

  // ウォレットに接続する関数
  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        console.error('Get MetaMask!');
        return;
      }
      const accounts = await ethereum.request({
        method: 'eth_requestAccounts',
      });
      console.log('Connected: ', accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  // リロードごとにウォレット接続を確認する
  useEffect(() => {
    checkIfWalletIsConnected();
  });

  return (
    <div className="h-screen w-screen flex-col flex">
      <div className="text-ellipsis h-20 w-full flex items-center justify-between bg-black">
        <div className="flex items-center">
          <img src={'farmer.png'} alt="Logo" className="px-5" />;
          <div className="text-white text-3xl">ETH Yield Farm</div>
        </div>
        {currentAccount === '' ? (
          <button
            className="text-white mr-10 px-3 py-1 text-2xl border-solid border-2 border-white flex items-center justify-center"
            onClick={connectWallet}
          >
            Connect Wallet
          </button>
        ) : (
          <div className="text-gray-400 text-lg pr-5">{currentAccount}</div>
        )}
      </div>
      <div className=" w-screen h-full flex-1 items-center justify-center flex flex-col">
        <div className="w-1/2 h-1/3 flex justify-center items-center pt-36">
          <div className="w-1/2 h-1/2 flex justify-center items-center flex-col">
            <div>Staking Balance</div>
            <div>{currentDaiBalance} DAI</div>
          </div>
          <div className="w-1/2 h-1/2 flex justify-center items-center flex-col">
            <div>Reward Balance</div>
            <div>{currentDappBalance} DAPP</div>
          </div>
        </div>
        <div className="h-1/2 w-1/2 flex justify-start items-center flex-col">
          <div className="flex-row flex justify-between items-end w-full px-20">
            <div className="text-xl">Stake Tokens</div>
            <div className="text-gray-300">
              Balance: {currentDaiBalance} DAI
            </div>
          </div>
          <div className="felx-row w-full flex justify-between items-end px-20 py-3">
            <input
              placeholder="0"
              className="flex items-center justify-start border-solid border-2 border-black w-full h-10 pl-3"
              type="text"
              id="stake"
              name="stake"
              value={stakedToken}
              onChange={handleStakeChange}
            />
            <div className="flex-row flex justify-between items-end">
              <img src={'dai.png'} alt="Logo" className="px-5 h-9 w-18" />
              <div>DAI</div>
            </div>
          </div>
          <div
            className="w-full h-14 bg-blue-500 text-white m-3 flex justify-center items-center"
            onClick={stake}
          >
            Stake!
          </div>
          <div className="text-blue-400" onClick={unStake}>
            UN-STAKE..
          </div>
          {currentAccount.toUpperCase() === walletAddress.toUpperCase() ? (
            <>
              <div className="text-xl pt-20">Transfer 100 DAI</div>
              <div className="felx-row w-full flex justify-between items-end px-20 py-3">
                <input
                  placeholder="0x..."
                  className="flex items-center justify-start border-solid border-2 border-black w-full h-10 pl-3"
                  type="text"
                  id="transfer"
                  name="transfer"
                  value={transferAddress}
                  onChange={handleTransferChange}
                />
              </div>
              <div
                className="w-full h-14 bg-blue-500 text-white m-3 flex justify-center items-center"
                onClick={transfer}
              >
                Transfer!
              </div>
            </>
          ) : (
            <></>
          )}
        </div>
        <div className="flex-1"></div>
      </div>
    </div>
  );
}

export default App;
```

これでコントラクトとフロントの接続が完成しました！

次の部分でフロントから動作確認をしてみましょう。

### 動作確認をしよう

まずはブラウザ上でのmetamaskのアカウントをコントラクトをdeployするときに使用したアドレスに変更してください。

ではフロントを立ち上げてみて、機能しているかを確認してみましょう。

```
yarn client start
```

するとしたのような画面が出てくるはずです。
![](/public/images/ETH-Yield-Farm/section-3/3_3_6.png)

deployの時にDAIトークンを100万トークン作成したので、残高もそのようになっています。

ではまず他のアドレスにトークンを送信しましょう。Metamaskで2つ以上アドレスがない方は作成してみてください。またそのアドレスでsepoliaテストネットのトークンを取得しておいてください。

コントラクトをdeployしたアドレス以外のアドレスを下の入力欄にコピぺしてしてtranserボタンを押してみてください。

![](/public/images/ETH-Yield-Farm/section-3/3_3_7.png)

すると下のように100DAIトークン送るようにMetamask上で許可を求められるのでそれに従ってください。

では次にアドレスを変更してリロードしてみてください。そうすると下の画像のようにDAIトークンの残高が100になっているはずです。

トークンを送信するための欄はコントラクトアドレスに接続していない場合は表示されないようになっています。

![](/public/images/ETH-Yield-Farm/section-3/3_3_8.png)

ではこのアドレスでステーキングしてみましょう。10を入力欄に入力して、`STAKE!`ボタンを押してみましょう。

Metamaskが起動して数字を入力するように出てくるので、下の画像のように10以上かつ自分がその時点で所有しているトークン量以下の値を入力してウォレットからDAIトークンが送信されることを許可します。

![](/public/images/ETH-Yield-Farm/section-3/3_3_12.png)

その後stake関数を実行するための許可を求められるので許可しましょう。

その後しばらく待ちリロードすると下のような画像になっているはずです。

DAIトークンの残高が20減っているでしょう。

![](/public/images/ETH-Yield-Farm/section-3/3_3_9.png)

では最後にインステーキングをしてみましょう。

20と入力欄に入力して、`UN-STAKE`ボタンを押してみましょう。そしてMetamask上で許可をしてしばらく待ち、リロードすると下のようにDAIトークンが返金されていて、かつ報酬としてDAPPトークンが貰えているはずです。

![](/public/images/ETH-Yield-Farm/section-3/3_3_11.png)

これで動作確認が完了しました。

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
これでフロントエンドが完成しました!あなたのフロントエンドのスクリーンショットを`#ethereum`にシェアしてください😊

次のレッスンで作ったWebアプリケーションをネット上に上げましょう!
