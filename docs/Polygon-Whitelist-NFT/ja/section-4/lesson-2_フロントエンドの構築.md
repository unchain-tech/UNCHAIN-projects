## ウェブフロントエンドページを作成する

### コード生成

左側のルートディレクトリに新しい`frontend`フォルダを作成します。

![image-20230223143555437](/public/images/Polygon-Whitelist-NFT/section-4/4_2_1.png)

`frontend`ディレクトリ内に新しい`index.html`ファイルを作成します。

![image-20230223143709220](/public/images/Polygon-Whitelist-NFT/section-4/4_2_2.png)

まずは、その中に完全なコードを貼り付けましょう。

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>mint demo</title>
  <style>
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

    button {
      width: 100%;
    }
  </style>
</head>

<body>
  <div class="container">
    <div>
      <label for="value">value:</label>
      <input id="value" value="0.01" />
    </div>
    <div>
      <button id="connectButton">connect</button>
      <button id="mintButton">mint</button>
      <button id="withdrawButton">withdraw</button>
    </div>
  </div>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/ethers/5.7.2/ethers.umd.min.js"
    integrity="sha512-FDcVY+g7vc5CXANbrTSg1K5qLyriCsGDYCE02Li1tXEYdNQPvLPHNE+rT2Mjei8N7fZbe0WLhw27j2SrGRpdMg=="
    crossorigin="anonymous" referrerpolicy="no-referrer"></script>
  <script>
    const connectButton = document.getElementById("connectButton");
    const mintButton = document.getElementById("mintButton");
    const withdrawButton = document.getElementById("withdrawButton");
    connectButton.onclick = connect;
    mintButton.onclick = mint;
    withdrawButton.onclick = withdraw;

    async function connect() {
      if (typeof window.ethereum !== "undefined") {

        try {
          await ethereum.request({
            method: "eth_requestAccounts"
          });
        } catch (error) {
          console.log(error);
        }
        await switchToMumbai()
        connectButton.innerHTML = "connected";
        const accounts = await ethereum.request({
          method: "eth_accounts"
        });
      } else {
        connectButton.innerHTML = "Please install MetaMask";
      }
    }

    async function mint() {
      const amount = document.getElementById("value").value;
      console.log(`Mint...`);
      if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, abi, signer);
        try {
          const transactionResponse = await contract.mint({
            value: ethers.utils.parseEther(amount),
          });
          await waitForTransaction(transactionResponse, provider);
          console.log("Mint succeed!")
        } catch (error) {
          console.log(error);
        }
      } else {
        fundButton.innerHTML = "Please install MetaMask";
      }
    }

    async function withdraw() {
      console.log(`Withdraw...`);
      if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, abi, signer);
        try {
          const transactionResponse = await contract.withdraw();
          await waitForTransaction(transactionResponse, provider);
          console.log("withdraw succeed!")
        } catch (error) {
          console.log(error);
        }
      } else {
        fundButton.innerHTML = "Please install MetaMask";
      }
    }

    async function switchToMumbai() {
      const chainId = "0x13881" // Mumbai

      const currentChainId = await ethereum.request({
        method: 'eth_chainId'
      });
      if (currentChainId !== chainId) {
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{
              chainId: chainId
            }]
          });
        } catch (err) {
          // This error code indicates that the chain has not been added to MetaMask
          if (err.code === 4902) {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainName: 'Mumbai',
                chainId: chainId,
                nativeCurrency: {
                  name: 'MATIC',
                  decimals: 18,
                  symbol: 'MATIC'
                },
                rpcUrls: ['https://rpc.ankr.com/polygon_mumbai']
              }]
            });
          }
        }
      }
    }

    function waitForTransaction(transactionResponse, provider) {
      console.log(`Mining ${transactionResponse.hash}`);
      return new Promise((resolve, reject) => {
        try {
          provider.once(transactionResponse.hash, (transactionReceipt) => {
            console.log(
              `Completed with ${transactionReceipt.confirmations} confirmations. `
            );
            resolve();
          });
        } catch (error) {
          reject(error);
        }
      });
    }

    const contractAddress = ;
    const abi = ;
  </script>
</body>

</html>
```

急がないでください。まだいくつかの情報を入力する必要があります。

```javascript
 const contractAddress = ;
```

ここに、Deploy & Interactionパネルからコピーできる`Shield`コントラクトのアドレスを入力する必要があります。

![image-20230223155653780](/public/images/Polygon-Whitelist-NFT/section-4/4_2_3.png)

```javascript
const abi = ;
```

ABIは、ブロックチェーンとのやりとりに使用されるインタフェースファイルです。こちらからコピーできます。

![image-20230223155913909](/public/images/Polygon-Whitelist-NFT/section-4/4_2_4.png)

したがって、完成した`index.html`は次のようになります。ただし、`contractAddress`は人によって異なるため、皆さんのファイル内容はそれぞれ異なることを忘れないでください。

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>mint demo</title>
    <style>
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

        button {
            width: 100%;
        }
    </style>
</head>

<body>
    <div class="container">
        <div>
            <label for="value">value:</label>
            <input id="value" value="0.01" />
        </div>
        <div>
            <button id="connectButton">connect</button>
            <button id="mintButton">mint</button>
            <button id="withdrawButton">withdraw</button>
        </div>
    </div>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/ethers/5.7.2/ethers.umd.min.js"
        integrity="sha512-FDcVY+g7vc5CXANbrTSg1K5qLyriCsGDYCE02Li1tXEYdNQPvLPHNE+rT2Mjei8N7fZbe0WLhw27j2SrGRpdMg=="
        crossorigin="anonymous" referrerpolicy="no-referrer"></script>
    <script>
        const connectButton = document.getElementById("connectButton");
    const mintButton = document.getElementById("mintButton");
    const withdrawButton = document.getElementById("withdrawButton");
    connectButton.onclick = connect;
    mintButton.onclick = mint;
    withdrawButton.onclick = withdraw;

    async function connect() {
      if (typeof window.ethereum !== "undefined") {

        try {
          await ethereum.request({
            method: "eth_requestAccounts"
          });
        } catch (error) {
          console.log(error);
        }
        await switchToMumbai()
        connectButton.innerHTML = "connected";
        const accounts = await ethereum.request({
          method: "eth_accounts"
        });
      } else {
        connectButton.innerHTML = "Please install MetaMask";
      }
    }

    async function mint() {
      const amount = document.getElementById("value").value;
      console.log(`Mint...`);
      if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, abi, signer);
        try {
          const transactionResponse = await contract.mint({
            value: ethers.utils.parseEther(amount),
          });
          await waitForTransaction(transactionResponse, provider);
          console.log("Mint succeed!")
        } catch (error) {
          console.log(error);
        }
      } else {
        fundButton.innerHTML = "Please install MetaMask";
      }
    }

    async function withdraw() {
      console.log(`Withdraw...`);
      if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, abi, signer);
        try {
          const transactionResponse = await contract.withdraw();
          await waitForTransaction(transactionResponse, provider);
          console.log("withdraw succeed!")
        } catch (error) {
          console.log(error);
        }
      } else {
        fundButton.innerHTML = "Please install MetaMask";
      }
    }

    async function switchToMumbai() {
      const chainId = "0x13881" // Mumbai

      const currentChainId = await ethereum.request({
        method: 'eth_chainId'
      });
      if (currentChainId !== chainId) {
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{
              chainId: chainId
            }]
          });
        } catch (err) {
          // This error code indicates that the chain has not been added to MetaMask
          if (err.code === 4902) {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainName: 'Mumbai',
                chainId: chainId,
                nativeCurrency: {
                  name: 'MATIC',
                  decimals: 18,
                  symbol: 'MATIC'
                },
                rpcUrls: ['https://endpoints.omniatech.io/v1/matic/mumbai/public']
              }]
            });
          }
        }
      }
    }

    function waitForTransaction(transactionResponse, provider) {
      console.log(`Mining ${transactionResponse.hash}`);
      return new Promise((resolve, reject) => {
        try {
          provider.once(transactionResponse.hash, (transactionReceipt) => {
            console.log(
              `Completed with ${transactionReceipt.confirmations} confirmations. `
            );
            resolve();
          });
        } catch (error) {
          reject(error);
        }
      });
    }

    const contractAddress = "0x86b5cf393100cF895B3371a4ccAa1BC95D486a56";
    const abi = [{"inputs":[{"internalType":"string","name":"baseURI","type":"string"},{"internalType":"address","name":"whitelistContract","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"approved","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":false,"internalType":"bool","name":"approved","type":"bool"}],"name":"ApprovalForAll","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[],"name":"_paused","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_price","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"approve","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"getApproved","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"operator","type":"address"}],"name":"isApprovedForAll","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"maxTokenIds","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"mint","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"ownerOf","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"operator","type":"address"},{"internalType":"bool","name":"approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bool","name":"val","type":"bool"}],"name":"setPaused","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"tokenByIndex","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"tokenIds","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"uint256","name":"index","type":"uint256"}],"name":"tokenOfOwnerByIndex","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"tokenURI","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"transferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"withdraw","outputs":[],"stateMutability":"nonpayable","type":"function"}]
    </script>
</body>

</html>
```

これは`HTML`、`CSS`、`JavaScript`という3つのフロントエンド言語で構成された`HTML`ファイルです。この3つのフロントエンド言語については[MDN](https://developer.mozilla.org/en-US/)で詳しく解説されています。

それでは、右上の「`Preview`」ボタンをクリックして、`HTML`ページをプレビューしてみましょう。

![image-20230223145857748](/public/images/Polygon-Whitelist-NFT/section-4/4_2_5.png)

基本的に`HTML`は`"value: 0.01"`、`"Connect"`、`"Mint"`などの要素の構造を形成する。

`CSS`はこれらの要素をページの中央に配置します。

一方、`JavaScript`はこれらのボタンがクリックされたときに発生するアクションを定義するために使用されます。

![image-20230223150000311](/public/images/Polygon-Whitelist-NFT/section-4/4_2_6.png)

次に、`"Connect"`と`"Mint"`の機能がどのように実装されているかを説明しましょう。他の機能についても同様のアプローチを推定できるはずです。

```html
 <script src="https://cdnjs.cloudflare.com/ajax/libs/ethers/5.7.2/ethers.umd.min.js"
    integrity="sha512-FDcVY+g7vc5CXANbrTSg1K5qLyriCsGDYCE02Li1tXEYdNQPvLPHNE+rT2Mjei8N7fZbe0WLhw27j2SrGRpdMg=="
    crossorigin="anonymous" referrerpolicy="no-referrer"></script>
```

まず、[ether.js](https://docs.ethers.org/v5/)をインポートしました。簡単に言うと、`ether.js`を使えば、`JavaScript`のコードはEthereum、Polygon、その他のEVM互換のブロックチェーンとやりとりできます。

```javascript
    const connectButton = document.getElementById("connectButton");
    connectButton.onclick = connect;
	...
    async function connect() {
      if (typeof window.ethereum !== "undefined") {

        try {
          await ethereum.request({
            method: "eth_requestAccounts"
          });
        } catch (error) {
          console.log(error);
        }
        await switchToMumbai()
        connectButton.innerHTML = "connected";
        const accounts = await ethereum.request({
          method: "eth_accounts"
        });
      } else {
        connectButton.innerHTML = "Please install MetaMask";
      }
    }

	...
    
      async function switchToMumbai() {
      const chainId = "0x13881" // Mumbai

      const currentChainId = await ethereum.request({
        method: 'eth_chainId'
      });
      if (currentChainId !== chainId) {
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{
              chainId: chainId
            }]
          });
        } catch (err) {
          // This error code indicates that the chain has not been added to MetaMask
          if (err.code === 4902) {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainName: 'Mumbai',
                chainId: chainId,
                nativeCurrency: {
                  name: 'MATIC',
                  decimals: 18,
                  symbol: 'MATIC'
                },
                rpcUrls: ['https://endpoints.omniatech.io/v1/matic/mumbai/public']
              }]
            });
          }
        }
      }
    }


```

ユーザーが`"Connect"`ボタンをクリックすると、`connect`関数が起動します。まず、MetaMaskにアカウントを要求します。次に、チェーンIDをチェックしてMumbaiテストネットに接続されているかどうかを判断します（各チェーンには通常、ユニークなチェーンIDがあり、Ethereumのメインネットは1、Mumbaiは4902となっています）。Mumbaiが設定されていない場合は、自動的に設定します。このプロセス中にエラーが発生した場合は、対応するエラーメッセージが表示されます。

```javascript
    async function mint() {
      const amount = document.getElementById("value").value;
      console.log(`Mint...`);
      if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, abi, signer);
        try {
          const transactionResponse = await contract.mint({
            value: ethers.utils.parseEther(amount),
          });
          await waitForTransaction(transactionResponse, provider);
          console.log("Mint succeed!")
        } catch (error) {
          console.log(error);
        }
      } else {
        fundButton.innerHTML = "Please install MetaMask";
      }
    }
```

ユーザーが`"Mint"`ボタンをクリックすると、入力フィールドから配列を取得することから始めます。そして、コンソールに`"Mint..."`と出力します。続いて、MetaMask拡張子を使用してトランザクションに署名するようユーザーに求めます。スクリプトはコントラクトの`mint`関数を呼び出し、対応する量のetherを送信します。ミント処理が成功すると、コンソールに`"Mint succeed!"`と表示されます。そうでない場合は、対応するエラーメッセージが表示されます。

`"withdraw"`関数の機能は、ここから推測できると思いますので、詳しく説明しません。