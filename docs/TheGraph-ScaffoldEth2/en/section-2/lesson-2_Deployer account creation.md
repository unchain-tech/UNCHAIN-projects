## Deployer account

### ⛵ Ship to a testnet

Next we want to take our smart contract and deploy it to a testnet! At the time this workshop was written, The Graph supports many testnets but for this example we will use sepolia.

## If you need some testnet funds you can try the following faucets:

[Ethereum Sepolia Faucet - Alchemy](https://sepoliafaucet.com/)

#### ✅ Create a deployer account

```
yarn run generate
```

![](/public/images/TheGraph-ScaffoldEth2/section-2/2_2_1.png)

You should see the following saved to your hardhats environment variable file

```
👛 Generating new Wallet
📄 Private Key saved to packages/hardhat/.env file
```

#### ✅ Fund the account

```
yarn account
```

![](/public/images/TheGraph-ScaffoldEth2/section-2/2_2_2.png)

This should display your public address along with a fancy QR code. And balances?!? Woooowwwww that is slick! <3

```

 ▄▄▄▄▄▄▄ ▄  ▄  ▄▄▄▄▄▄▄ ▄▄▄▄▄▄▄
 █ ▄▄▄ █ █▀▀▄ █▀█▄ ▄▄█ █ ▄▄▄ █
 █ ███ █ ▄▄██▀▄█ ▀ ███ █ ███ █
 █▄▄▄▄▄█ ▄▀▄▀▄▀▄▀▄ █ ▄ █▄▄▄▄▄█
 ▄  ▄▄▄▄▄▄▀█▄▀▄█▄▄ ▄█▀▄  ▄ ▄▄▄
 ▄▀▀█ █▄██▀▀▀▀▄█▀▀▄█▄██▀▄▄█▀█
   ▀▄▄ ▄█▄▄▄▀ █▀▄▀▀▄▄█ ██▀█ ▄▀
 ▄█▀▀██▄ ▀▄   █ ▀  ▀█ ▀▄▀█▄███
 ▄█▀██ ▄▄▄ ▀ ▄ █▄▀▄▄  ██▄▀▄▀▄█
 █▄ █▄ ▄█▄█▄▀▀▀ ▄█▄█▀▄ █▀▀▄▄▀▄
 ███▄█▀▄   █ ▀▄█▀ █████▄▄█▀█▄▄
 ▄▄▄▄▄▄▄ █▄ █▄ ██▀ █ █ ▄ █ ██
 █ ▄▄▄ █ █ ▀██▄██▀▀▄ █▄▄▄██▄▄
 █ ███ █ ▀▄▀▄ ▀▄▄ ▄█▀▀ ▄▄▄██▄▄
 █▄▄▄▄▄█ ▄█ ▄█  ▄▀▄█ ▄▀ ▄▄▄▀ ▀
▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀

Public address: 0x87f00B2c39F97CD00BC6d09777BC4327aCA39180

-- localhost -- 📡
   balance: 0
   nonce: 0

```

Send over some testnet ETH from the chain of your choice. I would suggest sepolia as its fairly easy to get some testnet ETH from various sources. In the output below you can see I now have a sepolia balance.

![](/public/images/TheGraph-ScaffoldEth2/section-2/2_2_3.png)
