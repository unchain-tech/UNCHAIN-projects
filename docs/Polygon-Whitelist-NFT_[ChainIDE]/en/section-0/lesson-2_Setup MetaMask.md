## Preparation

### Setup MetaMask wallet

#### Install MetaMask

When we deploy a smart contract to the blockchain or interact with a deployed smart contract, we need to pay for gas. Therefore, we need a Web3 wallet, such as MetaMask. Click here to install MetaMask.[here](https://metamask.io/)

#### Add Polygon Mumbai to MetaMask

Polygon is a decentralized Ethereum Layer 2 blockchain that enables developers to build scalable, user-friendly dApps with low transaction fees without sacrificing security. Major NFT platforms such as Opensea and Rarible also support the Polygon Mumbai testnet, so we choose Mumbai to deploy our smart contract.

Open [ChainIDE](https://chainide.com/), and click the "Try Now" button on the front page as shown in the figure below. 

![image-20230816160925822](/public/images/Polygon-Whitelist-NFT_[ChainIDE]/section-0/0_2_1.png)

Next, you will select your preferred login method. The login prompt offers two options: "Sign in with GitHub" and "Continue as Guest". For the purposes of this tutorial, we will select "Sign in with GitHub" because the Sandbox feature is not available in Guest mode.

![image-20230816161111357](/public/images/Polygon-Whitelist-NFT_[ChainIDE]/section-0/0_2_2.png)

To create a new Polygon project, click the 'New Project' button and choose 'Polygon' on the left side of the screen. Next, on the right side, select ”Blank Template“.

![image-20230816161348702](/public/images/Polygon-Whitelist-NFT_[ChainIDE]/section-0/0_2_3.png)


Click "Connect wallet" on the right side of the screen, select "Injected Web3 Provider," and then click on MetaMask to connect the wallet (Polygon Mainnet is the main network, while Mumbai is the testnet - we choose to Connect to Mumbai).  

![image-20230114120433122](/public/images/Polygon-Whitelist-NFT_[ChainIDE]/section-0/0_2_4.png)


#### Claim testnet tokens
Once Mumbai is added to MetaMask, click on [Polygon Faucet](https://faucet.polygon.technology/) to receive testnet tokens. On the faucet page, we choose Mumbai as the network and MATIC as the token and then paste your MetaMask wallet address. Next, click submit, and the faucet will send you some test MATIC within a minute.

<img src="/public/images/Polygon-Whitelist-NFT_[ChainIDE]/section-0/0_1_1.pngPolygon_PR_get_tokens.png" width="100%" height="100%" />
