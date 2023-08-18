## Create a web frontend page.

### Code generation

Create a new `Frontend` folder in the root directory on the left.

![image-20230223143555437](/public/images/Polygon-Whitelist-NFT_[ChainIDE]/section-4/4_2_1.png)

Create a new "index.html` file within the `frontend` directory.

![image-20230223143709220](/public/images/Polygon-Whitelist-NFT_[ChainIDE]/section-4/4_2_2.png)

​	Let's start by pasting the complete code inside it.

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

Don't rush, we still need to fill in some information.

```javascript
 const contractAddress = ;
```

Here, you need to fill in your `shield` contract address, which you can copy from the `Deploy` panel.

![image-20230223155653780](/public/images/Polygon-Whitelist-NFT_[ChainIDE]/section-4/4_2_3.png)

```javascript
const abi = ;
```

The ABI is the interface file used for interacting with the blockchain. You can copy it from here.

![image-20230223155913909](/public/images/Polygon-Whitelist-NFT_[ChainIDE]/section-4/4_2_4.png)

Therefore, our complete `index.html` looks like this. Remember, each person's version will be different because the `contractAddress` will certainly vary.

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

This is an `HTML` file composed of `HTML`, `CSS`, and `JavaScript`, three frontend languages. You can delve deeper into these three frontend languages on [MDN](https://developer.mozilla.org/en-US/).

Let's start by clicking the "Preview" button in the upper-right corner to preview the `HTML` page.

![image-20230223145857748](/public/images/Polygon-Whitelist-NFT_[ChainIDE]/section-4/4_2_5.png)

Basically, `HTML` forms the structure of elements like `"value: 0.01"`, `"Connect"`, `"Mint"`, and so on.

`CSS` is responsible for centering these elements on the page.

`JavaScript`, on the other hand, is used to define the actions that occur when these buttons are clicked.

![image-20230223150000311](/public/images/Polygon-Whitelist-NFT_[ChainIDE]/section-4/4_2_6.png)

Next, let me explain how the `"Connect"` and `"Mint"` functionalities are implemented. You should be able to extrapolate similar approaches for the other functionalities.

```html
 <script src="https://cdnjs.cloudflare.com/ajax/libs/ethers/5.7.2/ethers.umd.min.js"
    integrity="sha512-FDcVY+g7vc5CXANbrTSg1K5qLyriCsGDYCE02Li1tXEYdNQPvLPHNE+rT2Mjei8N7fZbe0WLhw27j2SrGRpdMg=="
    crossorigin="anonymous" referrerpolicy="no-referrer"></script>
```

Firstly, we have imported [ether.js](https://docs.ethers.org/v5/). In simple terms, with `ether.js`, `JavaScript` code can interact with Ethereum, Polygon, and other EVM-compatible blockchains.

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

When a user clicks the `"Connect"` button, it triggers the `connect` function. Firstly, it requests the account from MetaMask. Then, it checks the chainID to determine if it's connected to the Mumbai testnet (each chain typically has a unique chain ID, like Ethereum's mainnet is 1, and Mumbai's is 4902). If Mumbai is not configured, it will automatically set it up for you. If there are any errors during this process, corresponding error messages will be displayed.

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

When a user clicks the `"Mint"` button, the script first fetches the array from the input field. It then outputs `"Mint..."` to the console. Subsequently, it prompts the user to sign the transaction using their MetaMask extension. The script calls the `mint` function of the contract and sends the corresponding amount of ether. If the minting process is successful, the console will display "Mint succeed!". Otherwise, it will show the corresponding error message.

I believe you can deduce the functionality of the `"withdraw"` function from here, so I won't elaborate further.
