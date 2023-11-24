### 🪄 MVP = web3Mint.sol × NftUploader.jsx
今回のプロジェクトのMVP（＝最小限の機能を備えたプロダクト）を構築するweb3Mint.solとNftUploader.jsxのスクリプトを共有します。

見やすいように少し整理整頓してあります 🧹✨
もしコードにエラーが発生してデバッグが困難な場合は、下記のコードを使用してみてください。

**`Web3Mint.sol`はこちら:**

```solidity
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
//OpenZeppelinが提供するヘルパー機能をインポートします。
import "@openzeppelin/contracts/utils/Counters.sol";
import "./libraries/Base64.sol";

contract Web3Mint is ERC721 {
    struct NftAttributes {
        string name;
        string imageURL;
    }

    using Counters for Counters.Counter;
    // tokenIdはNFTの一意な識別子で、0, 1, 2, .. N のように付与されます。
    Counters.Counter private _tokenIds;

    NftAttributes[] Web3Nfts;

    constructor() ERC721("NFT", "nft") {}

    // ユーザーが NFT を取得するために実行する関数です。

    function mintIpfsNFT(string memory name, string memory imageURI) public {
        uint256 newItemId = _tokenIds.current();
        _safeMint(msg.sender, newItemId);
        Web3Nfts.push(NftAttributes({name: name, imageURL: imageURI}));
        _tokenIds.increment();
    }

    function tokenURI(
        uint256 _tokenId
    ) public view override returns (string memory) {
        string memory json = Base64.encode(
            bytes(
                string(
                    abi.encodePacked(
                        '{"name": "',
                        Web3Nfts[_tokenId].name,
                        " -- NFT #: ",
                        Strings.toString(_tokenId),
                        '", "description": "An epic NFT", "image": "ipfs://',
                        Web3Nfts[_tokenId].imageURL,
                        '"}'
                    )
                )
            )
        );
        string memory output = string(
            abi.encodePacked("data:application/json;base64,", json)
        );
        return output;
    }
}
```
**`NftUploader.jsx`はこちら:**

```javascript
import { Button } from '@mui/material';
import { ethers } from 'ethers';
import React from 'react';
import { useEffect, useState } from 'react'
import { Web3Storage } from 'web3.storage'

import Web3Mint from '../../utils/Web3Mint.json';
import ImageLogo from './image.svg';
import './NftUploader.css';

const NftUploader = () => {
  /*
   * ユーザーのウォレットアドレスを格納するために使用する状態変数を定義します。
   */
  const [currentAccount, setCurrentAccount] = useState('');
  /*この段階でcurrentAccountの中身は空*/
  console.log('currentAccount: ', currentAccount);
  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;
    if (!ethereum) {
      console.log('Make sure you have MetaMask!');
      return;
    } else {
      console.log('We have the ethereum object', ethereum);
    }

    const accounts = await ethereum.request({ method: 'eth_accounts' });

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log('Found an authorized account:', account);
      setCurrentAccount(account);
    } else {
      console.log('No authorized account found');
    }
  };
  const connectWallet = async () =>{
    try {
      const { ethereum } = window;
      if (!ethereum) {
        alert('Get MetaMask!');
        return;
      }
      /*
       * ウォレットアドレスに対してアクセスをリクエストしています。
       */
      const accounts = await ethereum.request({
        method: 'eth_requestAccounts',
      });
      console.log('Connected', accounts[0]);
      /*
       * ウォレットアドレスを currentAccount に紐付けます。
       */
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const askContractToMintNft = async (ipfs) => {
    const CONTRACT_ADDRESS =
      '0x35558364D864EAAcE19c10d84437969F133eDf12';
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


  const renderNotConnectedContainer = () => (
      <button onClick={connectWallet} className="cta-button connect-wallet-button">
        Connect to Wallet
      </button>
    );
  /*
   * ページがロードされたときに useEffect()内の関数が呼び出されます。
   */
  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweGU4MTQxMmVkYTk5NUI5NjMzMDIwNTYxRDkzMTRhNGE5NEQyMDIyNTQiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NDkzMTE5NzIxNjYsIm5hbWUiOiJzYW1wbGUifQ.1q2qbS-4FgjREAr_wVE0QtRI68QLEfPQdPO-B-7ixjg';

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

  return (
    <div className="outerBox">
      {currentAccount === '' ? (
        renderNotConnectedContainer()
      ) : (
        <p>If you choose image, you can mint your NFT</p>
      )}
      <div className="title">
        <h2>NFTアップローダー</h2>
      </div>
      <div className="nftUplodeBox">
        <div className="imageLogoAndText">
          <img src={ImageLogo} alt="imagelogo" />
          <p>ここにドラッグ＆ドロップしてね</p>
        </div>
        <input className="nftUploadInput" multiple name="imageURL" type="file" accept=".jpg , .jpeg , .png" onChange={imageToNFT}  />
      </div>
      <p>または</p>
      <Button variant="contained">
        ファイルを選択
        <input className="nftUploadInput" type="file" accept=".jpg , .jpeg , .png" onChange={imageToNFT} />
      </Button>
    </div>
  );
};

export default NftUploader;
```

### 😎 Web アプリケーションをアップグレードする

MVPを起点にWebアプリケーションを自分の好きなようにアップグレードしましょう。

**1\. ミントされた NFT の数に制限を設定する**

- `Web3Mint.sol`を変更して、あらかじめ設定された数のNFTのみをミントできるようにすることをお勧めします。
- `NftUploader.jsx`を更新して、Webアプリケーション上でMintカウンタを表示してみましょう!（例、「これまでに作成された4/50 NFT」）

**2\. ユーザーが間違ったネットワーク上にいるときアラートを出す**

- あなたのWebサイトはSepolia Test Networkで**のみ**機能します。
- ユーザーが、Sepolia以外のネットワークにログインしている状態で、あなたのWebサイトに接続しようとしたら、それを知らせるアラートを出しましょう。
- `ethereum.request`と`eth_accounts`と`eth_requestAccounts`というメソッドを使用して、アラートを作成できます。
- `eth_chainId`を使ってブロックチェーンを識別するIDを取得します。

下記のコードを`NftUploader.jsx`に組み込んでみましょう。

```javascript
// NftUploader.jsx
let chainId = await ethereum.request({ method: 'eth_chainId' });
console.log('Connected to chain ' + chainId);

if (chainId !== '11155111') {
  alert('You are not connected to the sepolia Test Network!');
}
```

他のブロックチェーンIDは [こちら](https://docs.MetaMask.io/guide/ethereum-provider.html#chain-ids) から見つけることができます。

**3\. マイニングアニメーションを作成する**

- 一部のユーザーは、Mintをクリックした後、15秒以上何も起こらないと、混乱してしまう可能性があるでしょう。
- "Loading ..." のようなアニメーションを追加して、ユーザーに安心してもらいましょう。

**4\. あなたのコレクション Web アプリケーションをリンクさせる**

- あなたのコレクションを見にいけるボタンをWebアプリケーション上に作成して、ユーザーがいつでもあなたのNFTコレクションを見に行けるようにしましょう。
- あなたのWebサイトに、「gemcaseでコレクションを表示」という小さなボタンを追加します。
- ユーザーがそれをクリックすると、コレクションのページに行けるようにしましょう。
- gemcaseへのリンクは`NftUploader.jsx`にハードコーディングする必要があります。

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

それでは、最後のレッスンに進みましょう 🎉
