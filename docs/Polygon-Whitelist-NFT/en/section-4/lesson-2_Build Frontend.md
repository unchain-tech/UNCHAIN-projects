## Create a web frontend page

### 🛠 Generate Project

The terminal panel, located at the bottom of the ChainIDE screen, will be manipulated.

First, select "Sandbox" and click "Click to add Sandbox +".

![](/public/images/Polygon-Whitelist-NFT/section-4/4_2_7.png)

Make sure Sandbox is up and running.

![](/public/images/Polygon-Whitelist-NFT/section-4/4_2_8.png)

Make sure you have `node` 18.17.0 or newer.

```
node -v
```

If you don't, install the stable version and check the newly activated version.

```
# Install n to manage your Node.js versions
npm install -g n

# Install and activate the stable version of Node.js
n stable

# Confirm Node.js version 18.17.0 or newer
node -v
```

Make sure you are in the root directory of the project and execute the following command.

```
yarn create next-app
```

Let's name the project `client` and create the project by selecting the following options.

```
✔ What is your project named? … client
✔ Would you like to use TypeScript? … [Yes]
✔ Would you like to use ESLint? … [Yes]
✔ Would you like to use Tailwind CSS? … [No]
✔ Would you like to use `src/` directory? … [No]
✔ Would you like to use App Router? (recommended) … [No]
✔ Would you like to customize the default import alias? … [No]
```

Make sure that `client/` has been created.

![](/public/images/Polygon-Whitelist-NFT/section-4/4_2_9.png)

Go to the client folder and install the necessary packages.

```
cd client
yarn add @metamask/providers@^13.0.0 ethers@^5
```

Clean up your files.

Delete `pages/api/`.

![](/public/images/Polygon-Whitelist-NFT/section-4/4_2_10.png)

Now, let's update the files.

Let's overwrite `styles/global.css` with the following code.

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

Overwrite `styles/Home.module.css` with the following code.

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

Create `@types/global.d.ts` in the client folder.

![](/public/images/Polygon-Whitelist-NFT/section-4/4_2_11.png)

![](/public/images/Polygon-Whitelist-NFT/section-4/4_2_12.png)

Write the following code.

```typescript
import { MetaMaskInpageProvider } from '@metamask/providers';

declare global {
  interface Window {
    ethereum: MetaMaskInpageProvider;
  }
}
```

### 🚗 Generate Code

Paste the complete code into `pages/index.tsx` in the client folder.

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

Don't rush, we still need to fill in some information.

```tsx
const contractAddress = "";
```

Here, you need to fill in your `Shield` contract address, which you can copy from the `Deploy` panel.

![image-20230223155653780](/public/images/Polygon-Whitelist-NFT/section-4/4_2_3.png)

```tsx
const abi = ;
```

The ABI is the interface file used for interacting with the blockchain. You can copy it from here.

![image-20230223155913909](/public/images/Polygon-Whitelist-NFT/section-4/4_2_4.png)

Therefore, our complete `pages/index.tsx` looks like this. Remember, each person's version will be different because the `contractAddress` will certainly vary.

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

This is a `TSX` file consisting of [`React`](https://react.dev/), [`CSS`](https://developer.mozilla.org/en-US/docs/Web/CSS), and [`TypeScript`](https://www.typescriptlang.org/).

Basically, the `return` statement forms a structure of elements such as `"value: 0.01"`, `"Connect"`, `"Mint"`, etc.

`CSS` is responsible for centering these elements on the page.

`TypeScript`, on the other hand, is used to define the actions that occur when these buttons are clicked.

![](/public/images/Polygon-Whitelist-NFT/section-4/4_2_6.png)

Next, let me explain how the `"Connect"` and `"Mint"` functionalities are implemented. You should be able to extrapolate similar approaches for the other functionalities.

```tsx
import { ethers } from 'ethers';
```

Firstly, we have imported [ether.js](https://docs.ethers.org/v5/). In simple terms, with `ether.js`, `JavaScript(TypeScript)` code can interact with Ethereum, Polygon, and other EVM-compatible blockchains.

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

When a user clicks the `"Connect"` button, it triggers the `connect` function. Firstly, it requests the account from MetaMask. Then, it checks the chainID to determine if it's connected to the Mumbai testnet (each chain typically has a unique chain ID, like Ethereum's mainnet is 1, and Mumbai's is 4902). If Mumbai is not configured, it will automatically set it up for you. If there are any errors during this process, corresponding error messages will be displayed.

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

When a user clicks the `"Mint"` button, the script first fetches the array from the input field. It then outputs `"Mint..."` to the console. Subsequently, it prompts the user to sign the transaction using their MetaMask extension. The script calls the `mint` function of the contract and sends the corresponding amount of ether. If the minting process is successful, the console will display "Mint succeed!". Otherwise, it will show the corresponding error message.

I believe you can deduce the functionality of the `"withdraw"` function from here, so I won't elaborate further.

### 🙋‍♂️ Asking Questions

If you have any uncertainties or issues with the work done so far, please ask in the `#polygon` channel on Discord.

To streamline the assistance process, kindly include the following 4 points in your error report ✨:

```
1. Section and lesson number related to the question
2. What you were trying to do
3. Copy & paste the error message
4. Screenshot of the error screen
```