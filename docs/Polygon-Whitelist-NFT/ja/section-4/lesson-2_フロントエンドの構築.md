## ウェブフロントエンドページを作成する

### 🛠 プロジェクトの生成

ChainIDEの画面下にある、ターミナルパネルを操作していきます。

まずは「Sandbox」を選択し、「Click to add Sandbox +」をクリックします。

![](/public/images/Polygon-Whitelist-NFT/section-4/4_2_7.png)

Sandboxが立ち上がったことを確認しましょう。

![](/public/images/Polygon-Whitelist-NFT/section-4/4_2_8.png)

`node`のバージョンが18.17.0以上になっていることを確認します。

```
node -v
```

それより古かった場合、安定バージョンをインストールして、新しくインストールしたバージョンを確認します。

```
# Node.js バージョン管理のため n をインストール
npm install -g n

# Node.js を安定バージョンをインストールして有効にする
n stable

# バージョンが18.17.0以上になっているか確認
node -v
```

プロジェクトのルートディレクトリにいることを確認して、下記のコマンドを実行します。

```
yarn create next-app
```

プロジェクト名は`client`とし、以下のように選択肢を選んでプロジェクトを作成しましょう。

```
✔ What is your project named? … client
✔ Would you like to use TypeScript? … [Yes]
✔ Would you like to use ESLint? … [Yes]
✔ Would you like to use Tailwind CSS? … [No]
✔ Would you like to use `src/` directory? … [No]
✔ Would you like to use App Router? (recommended) … [No]
✔ Would you like to customize the default import alias? … [No]
```

`client/`が作成されたことを確認しましょう。

![](/public/images/Polygon-Whitelist-NFT/section-4/4_2_9.png)

clientフォルダに移動して、必要なパッケージをインストールします。

```
cd client
yarn add @metamask/providers@^13.0.0 ethers@^5
```

ファイルの整理をしましょう。

`pages/api/`を削除します。

![](/public/images/Polygon-Whitelist-NFT/section-4/4_2_10.png)

それでは、ファイルの更新をしていきます。

`styles/global.css`を下記のコードで上書きしましょう。

```css
html,
body {
  width: 100%;
  height: 100%;
}

body {
  display: flex;
  align-items: center;
  justify-content: center;
}

```

`styles/Home.module.css`を下記のコードで上書きしましょう。

```css
.container {
  width: 100%;
  max-width: 500px;
}

.container label {
  font-size: 1.5rem;
  margin-right: 0.5rem;
}

.container input {
  width: 70%;
  font-size: 1.25rem;
  padding: 10px;
  border-radius: 5px;
}

.container button {
  width: 100%;
  font-size: 1.25rem;
  padding: 12px 20px;
  margin-right: 0.5rem;
  border-radius: 5px;
}

.container button:hover {
  background-color: #ddd;
}

```

clientフォルダの中に、`@types/global.d.ts`を作成します。

![](/public/images/Polygon-Whitelist-NFT/section-4/4_2_11.png)

![](/public/images/Polygon-Whitelist-NFT/section-4/4_2_12.png)

下記のコードを記述しましょう。

```typescript
import { MetaMaskInpageProvider } from '@metamask/providers';

declare global {
  interface Window {
    ethereum: MetaMaskInpageProvider;
  }
}
```

### 🚗 コード生成

clientフォルダの中にある、`pages/index.tsx`に完全なコードを貼り付けましょう。

```tsx
import Head from 'next/head';
import { Inter } from 'next/font/google';
import styles from '@/styles/Home.module.css';
import { useState } from 'react';
import { ethers, ContractTransaction } from 'ethers';

const inter = Inter({ subsets: ['latin'] });
const contractAddress = "";
const abi = ;

export default function Home() {
  const [amount] = useState('0.01');
  const [connectStatus, setConnectStatus] = useState('connect');

  const connect = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        await window.ethereum.request({
          method: 'eth_requestAccounts',
        });
      } catch (error) {
        console.log(error);
      }
      await switchToMumbai();
      setConnectStatus('connected');
    } else {
      setConnectStatus('Please install MetaMask');
    }
  };

  const mint = async () => {
    console.log(`Mint...`);
    if (typeof window.ethereum !== 'undefined') {
      // @ts-expect-error: ethereum as ethers.providers.ExternalProvider
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        contractAddress,
        abi,
        signer,
      );

      try {
        const transactionResponse = await contract.mint({
          value: ethers.utils.parseEther(amount),
        });
        await waitForTransaction(transactionResponse, provider);
        console.log('Mint succeed!');
      } catch (error) {
        console.log(error);
      }
    } else {
      setConnectStatus('Please install MetaMask');
    }
  };

  const withdraw = async () => {
    console.log(`Withdraw...`);
    if (typeof window.ethereum !== 'undefined') {
      // @ts-expect-error: ethereum as ethers.providers.ExternalProvider
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        contractAddress,
        abi,
        signer,
      );
      try {
        const transactionResponse = await contract.withdraw();
        await waitForTransaction(transactionResponse, provider);
        console.log('withdraw succeed!');
      } catch (error) {
        console.log(error);
      }
    } else {
      setConnectStatus('Please install MetaMask');
    }
  };

  const switchToMumbai = async () => {
    const chainId = '0x13881'; // Mumbai

    const currentChainId = await window.ethereum.request({
      method: 'eth_chainId',
    });
    if (currentChainId !== chainId) {
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [
            {
              chainId: chainId,
            },
          ],
        });
        /* eslint-disable @typescript-eslint/no-explicit-any */
      } catch (err: any) {
        // This error code indicates that the chain has not been added to MetaMask
        if (err.code === 4902) {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainName: 'Mumbai',
                chainId: chainId,
                nativeCurrency: {
                  name: 'MATIC',
                  decimals: 18,
                  symbol: 'MATIC',
                },
                rpcUrls: [
                  'https://endpoints.omniatech.io/v1/matic/mumbai/public',
                ],
              },
            ],
          });
        }
      }
    }
  };

  const waitForTransaction = async (
    transactionResponse: ContractTransaction,
    provider: ethers.providers.Web3Provider,
  ) => {
    console.log(`Mining ${transactionResponse.hash}`);
    return new Promise<void>((resolve, reject) => {
      try {
        provider.once(transactionResponse.hash, (transactionReceipt) => {
          console.log(
            `Completed with ${transactionReceipt.confirmations} confirmations. `,
          );
          resolve();
        });
      } catch (error) {
        reject(error);
      }
    });
  };

  return (
    <>
      <Head>
        <title>mint demo</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={inter.className}>
        <div className={styles.container}>
          <div>
            <label htmlFor="value">value:</label>
            <input id="value" value={amount} readOnly />
          </div>
          <div>
            <button id="connectButton" onClick={connect}>
              {connectStatus}
            </button>
            <button id="mintButton" onClick={mint}>
              mint
            </button>
            <button id="withdrawButton" onClick={withdraw}>
              withdraw
            </button>
          </div>
        </div>
      </main>
    </>
  );
}

```

急がないでください。まだいくつかの情報を入力する必要があります。

```tsx
 const contractAddress = "";
```

ここに、Deploy & Interactionパネルからコピーできる`Shield`コントラクトのアドレスを入力する必要があります。

![image-20230223155653780](/public/images/Polygon-Whitelist-NFT/section-4/4_2_3.png)

```tsx
const abi = ;
```

ABIは、ブロックチェーンとのやりとりに使用されるインタフェースファイルです。こちらからコピーできます。

![image-20230223155913909](/public/images/Polygon-Whitelist-NFT/section-4/4_2_4.png)

したがって、完成した`pages/index.tsx`は次のようになります。ただし、`contractAddress`は人によって異なるため、皆さんのファイル内容はそれぞれ異なることを忘れないでください。

```tsx
import Head from 'next/head';
import { Inter } from 'next/font/google';
import styles from '@/styles/Home.module.css';
import { useState } from 'react';
import { ethers, ContractTransaction } from 'ethers';

const inter = Inter({ subsets: ['latin'] });
const contractAddress = "0x77ce10F3598c93A7eECa697Da6652994b6878Cb2";
const abi = [{ "inputs": [{ "internalType": "string", "name": "baseURI", "type": "string" }, { "internalType": "address", "name": "whitelistContract", "type": "address" }], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "owner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "approved", "type": "address" }, { "indexed": true, "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": "Approval", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "owner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "operator", "type": "address" }, { "indexed": false, "internalType": "bool", "name": "approved", "type": "bool" }], "name": "ApprovalForAll", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "previousOwner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "newOwner", "type": "address" }], "name": "OwnershipTransferred", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": true, "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": "Transfer", "type": "event" }, { "inputs": [], "name": "paused", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "price", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": "approve", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }], "name": "balanceOf", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": "getApproved", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "address", "name": "operator", "type": "address" }], "name": "isApprovedForAll", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "maxTokenIds", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "mint", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [], "name": "name", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "owner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": "ownerOf", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "renounceOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "from", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": "safeTransferFrom", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "from", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "tokenId", "type": "uint256" }, { "internalType": "bytes", "name": "data", "type": "bytes" }], "name": "safeTransferFrom", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "operator", "type": "address" }, { "internalType": "bool", "name": "approved", "type": "bool" }], "name": "setApprovalForAll", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "bool", "name": "val", "type": "bool" }], "name": "setPaused", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "bytes4", "name": "interfaceId", "type": "bytes4" }], "name": "supportsInterface", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "symbol", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "index", "type": "uint256" }], "name": "tokenByIndex", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "tokenIds", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "uint256", "name": "index", "type": "uint256" }], "name": "tokenOfOwnerByIndex", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": "tokenURI", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "totalSupply", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "from", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": "transferFrom", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "newOwner", "type": "address" }], "name": "transferOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "withdraw", "outputs": [], "stateMutability": "nonpayable", "type": "function" }];

export default function Home() {
    const [amount] = useState('0.01');
    const [connectStatus, setConnectStatus] = useState('connect');

    const connect = async () => {
        if (typeof window.ethereum !== 'undefined') {
            try {
                await window.ethereum.request({
                    method: 'eth_requestAccounts',
                });
            } catch (error) {
                console.log(error);
            }
            await switchToMumbai();
            setConnectStatus('connected');
        } else {
            setConnectStatus('Please install MetaMask');
        }
    };

    const mint = async () => {
        console.log(`Mint...`);
        if (typeof window.ethereum !== 'undefined') {
            // @ts-expect-error: ethereum as ethers.providers.ExternalProvider
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(
                contractAddress,
                abi,
                signer,
            );

            try {
                const transactionResponse = await contract.mint({
                    value: ethers.utils.parseEther(amount),
                });
                await waitForTransaction(transactionResponse, provider);
                console.log('Mint succeed!');
            } catch (error) {
                console.log(error);
            }
        } else {
            setConnectStatus('Please install MetaMask');
        }
    };

    const withdraw = async () => {
        console.log(`Withdraw...`);
        if (typeof window.ethereum !== 'undefined') {
            // @ts-expect-error: ethereum as ethers.providers.ExternalProvider
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(
                contractAddress,
                abi,
                signer,
            );
            try {
                const transactionResponse = await contract.withdraw();
                await waitForTransaction(transactionResponse, provider);
                console.log('withdraw succeed!');
            } catch (error) {
                console.log(error);
            }
        } else {
            setConnectStatus('Please install MetaMask');
        }
    };

    const switchToMumbai = async () => {
        const chainId = '0x13881'; // Mumbai

        const currentChainId = await window.ethereum.request({
            method: 'eth_chainId',
        });
        if (currentChainId !== chainId) {
            try {
                await window.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [
                        {
                            chainId: chainId,
                        },
                    ],
                });
                /* eslint-disable @typescript-eslint/no-explicit-any */
            } catch (err: any) {
                // This error code indicates that the chain has not been added to MetaMask
                if (err.code === 4902) {
                    await window.ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [
                            {
                                chainName: 'Mumbai',
                                chainId: chainId,
                                nativeCurrency: {
                                    name: 'MATIC',
                                    decimals: 18,
                                    symbol: 'MATIC',
                                },
                                rpcUrls: [
                                    'https://endpoints.omniatech.io/v1/matic/mumbai/public',
                                ],
                            },
                        ],
                    });
                }
            }
        }
    };

    const waitForTransaction = async (
        transactionResponse: ContractTransaction,
        provider: ethers.providers.Web3Provider,
    ) => {
        console.log(`Mining ${transactionResponse.hash}`);
        return new Promise<void>((resolve, reject) => {
            try {
                provider.once(transactionResponse.hash, (transactionReceipt) => {
                    console.log(
                        `Completed with ${transactionReceipt.confirmations} confirmations. `,
                    );
                    resolve();
                });
            } catch (error) {
                reject(error);
            }
        });
    };

  return (
    <>
      <Head>
        <title>mint demo</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={inter.className}>
        <div className={styles.container}>
          <div>
            <label htmlFor="value">value:</label>
            <input id="value" value={amount} readOnly />
          </div>
          <div>
            <button id="connectButton" onClick={connect}>
              {connectStatus}
            </button>
            <button id="mintButton" onClick={mint}>
              mint
            </button>
            <button id="withdrawButton" onClick={withdraw}>
              withdraw
            </button>
          </div>
        </div>
      </main>
    </>
  );
}

```

これは[`React`](https://ja.react.dev/)、[`CSS`](https://developer.mozilla.org/ja/docs/Web/CSS)、[`TypeScript`](https://www.typescriptlang.org/ja/)という3つのフロントエンド言語で構成された`TSX`ファイルです。

基本的に`return`文の中は`"value: 0.01"`、`"Connect"`、`"Mint"`などの要素の構造を形成します。

`CSS`はこれらの要素をページの中央に配置します。

一方、`TypeScript`はこれらのボタンがクリックされたときに発生するアクションを定義するために使用されます。

![](/public/images/Polygon-Whitelist-NFT/section-4/4_2_6.png)

次に、`"Connect"`と`"Mint"`の機能がどのように実装されているかを説明しましょう。他の機能についても同様のアプローチを推定できるはずです。

```tsx
import { ethers } from 'ethers';
```

まず、[ether.js](https://docs.ethers.org/v5/)をインポートしました。簡単に言うと、`ether.js`を使えば、`JavaScript（TypeScript）`のコードはEthereum、Polygon、その他のEVM互換のブロックチェーンとやりとりできます。

```tsx
    const [connectStatus, setConnectStatus] = useState('connect');

    const connect = async () => {
        if (typeof window.ethereum !== 'undefined') {
            try {
                await window.ethereum.request({
                    method: 'eth_requestAccounts',
                });
            } catch (error) {
                console.log(error);
            }
            await switchToMumbai();
            setConnectStatus('connected');
        } else {
            setConnectStatus('Please install MetaMask');
        }
    };

	...
    
  const switchToMumbai = async () => {
    const chainId = '0x13881'; // Mumbai

    const currentChainId = await window.ethereum.request({
      method: 'eth_chainId',
    });
    if (currentChainId !== chainId) {
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [
            {
              chainId: chainId,
            },
          ],
        });
        /* eslint-disable @typescript-eslint/no-explicit-any */
      } catch (err: any) {
        // This error code indicates that the chain has not been added to MetaMask
        if (err.code === 4902) {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainName: 'Mumbai',
                chainId: chainId,
                nativeCurrency: {
                  name: 'MATIC',
                  decimals: 18,
                  symbol: 'MATIC',
                },
                rpcUrls: [
                  'https://endpoints.omniatech.io/v1/matic/mumbai/public',
                ],
              },
            ],
          });
        }
      }
    }
  };

```

ユーザーが`"Connect"`ボタンをクリックすると、`connect`関数が起動します。まず、MetaMaskにアカウントを要求します。次に、チェーンIDをチェックしてMumbaiテストネットに接続されているかどうかを判断します（各チェーンには通常、ユニークなチェーンIDがあり、Ethereumのメインネットは1、Mumbaiは4902となっています）。Mumbaiが設定されていない場合は、自動的に設定します。このプロセス中にエラーが発生した場合は、対応するエラーメッセージが表示されます。

```tsx
  const mint = async () => {
    console.log(`Mint...`);
    if (typeof window.ethereum !== 'undefined') {
      // @ts-expect-error: ethereum as ethers.providers.ExternalProvider
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        contractAddress,
        abi,
        signer,
      );

      try {
        const transactionResponse = await contract.mint({
          value: ethers.utils.parseEther(amount),
        });
        await waitForTransaction(transactionResponse, provider);
        console.log('Mint succeed!');
      } catch (error) {
        console.log(error);
      }
    } else {
      setConnectStatus('Please install MetaMask');
    }
  };
```

ユーザーが`"Mint"`ボタンをクリックすると、入力フィールドから配列を取得することから始めます。そして、コンソールに`"Mint..."`と出力します。続いて、MetaMask拡張子を使用してトランザクションに署名するようユーザーに求めます。スクリプトはコントラクトの`mint`関数を呼び出し、対応する量のetherを送信します。ミント処理が成功すると、コンソールに`"Mint succeed!"`と表示されます。そうでない場合は、対応するエラーメッセージが表示されます。

`"withdraw"`関数の機能は、ここから推測できると思いますので、詳しく説明しません。

### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discordの`#polygon`で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の4点を記載してください ✨

```
1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット
```