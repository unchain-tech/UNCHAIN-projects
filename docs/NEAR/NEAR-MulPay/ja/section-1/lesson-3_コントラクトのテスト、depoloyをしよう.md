### ✍️ 作成したコントラクトをテストしよう

コントラクトが完成したので次はそれらがきちんと機能しているのかテストしていきましょう！

`test`フォルダにある`swap.test.ts`ファイルの中身を下のように書き換えていきましょう。

`SwapContract.address`の部分に赤線が出ている人もいるかもしれませんが、これはlinterが過剰に反応しているだけでテストはきちんと行うことができるので気にする必要はありません。

[`swap.test.ts`]

```ts
import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { expect } from 'chai';
import { ethers } from 'hardhat';

describe('Swap Contract', function () {
  async function deployTokenFixture() {
    const [owner, addr1] = await ethers.getSigners();

    const swapFactory = await ethers.getContractFactory('SwapContract');
    const auroraToken = await ethers.getContractFactory('AuroraToken');
    const daiToken = await ethers.getContractFactory('DaiToken');
    const ethToken = await ethers.getContractFactory('EthToken');
    const polygonToken = await ethers.getContractFactory('PolygonToken');
    const shibainuToken = await ethers.getContractFactory('ShibainuToken');
    const solanaToken = await ethers.getContractFactory('SolanaToken');
    const tetherToken = await ethers.getContractFactory('TetherToken');
    const uniswapToken = await ethers.getContractFactory('UniswapToken');

    const SwapContract = await swapFactory.deploy();
    const AoaToken = await auroraToken.deploy(SwapContract.address);
    const DaiToken = await daiToken.deploy(SwapContract.address);
    const EthToken = await ethToken.deploy(SwapContract.address);
    const MaticToken = await polygonToken.deploy(SwapContract.address);
    const ShibToken = await shibainuToken.deploy(SwapContract.address);
    const SolToken = await solanaToken.deploy(SwapContract.address);
    const UniToken = await uniswapToken.deploy(SwapContract.address);
    const UsdtToken = await tetherToken.deploy(SwapContract.address);

    return {
      owner,
      addr1,
      SwapContract,
      AoaToken,
      DaiToken,
      EthToken,
      MaticToken,
      ShibToken,
      SolToken,
      UniToken,
      UsdtToken,
    };
  }
  describe('Deployment', function () {
    // check if the owner of DAI token is smart contract
    it('ERC20 token is minted from smart contract', async function () {
      const { DaiToken, SwapContract } = await loadFixture(deployTokenFixture);

      const balanceOfDai = await DaiToken.balanceOf(SwapContract.address);
      // convert expected value `1000000 Ether` to Wei units
      const expectedValue = ethers.utils.parseUnits('1000000', 18);

      expect(balanceOfDai).to.equal(expectedValue);
    });

    // get the value between DAI and ETH
    it('Get value between DAI and ETH', async function () {
      const { DaiToken, EthToken, SwapContract } = await loadFixture(
        deployTokenFixture,
      );

      const value = await SwapContract.calculateValue(
        EthToken.address,
        DaiToken.address,
      );
      // convert expected value `0.1 Ether` to Wei units
      const expectedValue = ethers.utils.parseUnits('0.1', 18);

      expect(value).to.equal(expectedValue);
    });

    // check swap function works
    it('Swap function', async function () {
      const { owner, addr1, DaiToken, EthToken, UniToken, SwapContract } =
        await loadFixture(deployTokenFixture);

      await DaiToken.approve(
        SwapContract.address,
        ethers.utils.parseEther('200'),
      );
      await SwapContract.distributeToken(
        DaiToken.address,
        ethers.utils.parseEther('100'),
        owner.address,
      );

      const ethAmountBefore = await DaiToken.balanceOf(addr1.address);
      expect(ethAmountBefore).to.equal(0);

      await SwapContract.swap(
        DaiToken.address,
        UniToken.address,
        EthToken.address,
        ethers.utils.parseEther('1'),
        addr1.address,
      );

      const ethAmountAfter = await EthToken.balanceOf(addr1.address);
      const expectedValue = ethers.utils.parseUnits('0.1', 18);
      expect(ethAmountAfter).to.equal(expectedValue);
    });
  });
});
```

最初に宣言している`deployTokenFixture`関数はそれぞれのコントラクトをデプロイを行うための関数で、それぞれのテストを行う前に走らせる必要があります。

```ts
  async function deployTokenFixture() {
    const [owner, addr1] = await ethers.getSigners();

    const swapFactory = await ethers.getContractFactory('SwapContract');
    const auroraToken = await ethers.getContractFactory('AuroraToken');
    const daiToken = await ethers.getContractFactory('DaiToken');
    const ethToken = await ethers.getContractFactory('EthToken');
    const polygonToken = await ethers.getContractFactory('PolygonToken');
    const shibainuToken = await ethers.getContractFactory('ShibainuToken');
    const solanaToken = await ethers.getContractFactory('SolanaToken');
    const tetherToken = await ethers.getContractFactory('TetherToken');
    const uniswapToken = await ethers.getContractFactory('UniswapToken');

    const SwapContract = await swapFactory.deploy();
    const AoaToken = await auroraToken.deploy(SwapContract.address);
    const DaiToken = await daiToken.deploy(SwapContract.address);
    const EthToken = await ethToken.deploy(SwapContract.address);
    const MaticToken = await polygonToken.deploy(SwapContract.address);
    const ShibToken = await shibainuToken.deploy(SwapContract.address);
    const SolToken = await solanaToken.deploy(SwapContract.address);
    const UniToken = await uniswapToken.deploy(SwapContract.address);
    const UsdtToken = await tetherToken.deploy(SwapContract.address);

    return {
      owner,
      addr1,
      SwapContract,
      AoaToken,
      DaiToken,
      EthToken,
      MaticToken,
      ShibToken,
      SolToken,
      UniToken,
      UsdtToken,
    };
  }
```

最初の部分ではERC20規格のトークンがきちんとdeployされているかをテストしています。

```ts
    // check if the owner of DAI token is smart contract
    it('ERC20 token is minted from smart contract', async function () {
      const { DaiToken, SwapContract } = await loadFixture(deployTokenFixture);

      const balanceOfDai = await DaiToken.balanceOf(SwapContract.address);
      // convert expected value `1000000 Ether` to Wei units
      const expectedValue = ethers.utils.parseUnits('1000000', 18);

      expect(balanceOfDai).to.equal(expectedValue);
    });
```

ここではERC20規格に搭載されている、残高を確認するためのメソッドである`blanceOf`関数が機能しているか、SwapContractに全てのトークンが入っているのかを確認しています。

次に`DAI/ETH`の価値を算出しています。SwapContractが保有しているそれぞれのトークン量によって変動します。

`ERC20Tokens.sol`ではETHの発行量はDAIのそれより1/10の量なので0.1 etherになるはずです。

```ts
    // get the value between DAI and ETH
    it('Get value between DAI and ETH', async function () {
      const { DaiToken, EthToken, SwapContract } = await loadFixture(
        deployTokenFixture,
      );

      const value = await SwapContract.calculateValue(
        EthToken.address,
        DaiToken.address,
      );
      // convert expected value `0.1 Ether` to Wei units
      const expectedValue = ethers.utils.parseUnits('0.1', 18);

      expect(value).to.equal(expectedValue);
    });
```

最後にswap機能がきちんと動くかをチェックしています。送金者と仮定するアドレス（owner）に`200DAI`をSwapContractから送金します。

その後受領者の残高をswap前後で確認しています。

```ts
    // check swap function works
    it('Swap function', async function () {
      const { owner, addr1, DaiToken, EthToken, UniToken, SwapContract } =
        await loadFixture(deployTokenFixture);

      await DaiToken.approve(
        SwapContract.address,
        ethers.utils.parseEther('200'),
      );
      await SwapContract.distributeToken(
        DaiToken.address,
        ethers.utils.parseEther('100'),
        owner.address,
      );

      const ethAmountBefore = await DaiToken.balanceOf(addr1.address);
      expect(ethAmountBefore).to.equal(0);

      await SwapContract.swap(
        DaiToken.address,
        UniToken.address,
        EthToken.address,
        ethers.utils.parseEther('1'),
        addr1.address,
      );

      const ethAmountAfter = await EthToken.balanceOf(addr1.address);
      const expectedValue = ethers.utils.parseUnits('0.1', 18);
      expect(ethAmountAfter).to.equal(expectedValue);
    });
```

これでtestのためのコードは書けたので、下のコマンドを実行しチェックしてみましょう。

```
yarn test
```

これによって以下のような結果が返ってくるはずです。

```
  Swap Contract
    Deployment
      ✔ ERC20 token is minted from smart contract (1083ms)
      ✔ Get value between DAI and ETH
      ✔ Swap function


  3 passing (1s)
```

1. SwapContractにきちんとERC20トークンが発行されている
2. ETH/DAIの相対的な価値が0.1となっている
3. address_1の残高が0ETH→0.1ETHに変わっている

これらのことが確認できたのでtest成功です！

では次に、作成したコントラクトをデプロイしましょう！

### ⬆️ 作成したコントラクトを deploy しよう

コントラクトがきちんと動いていることが確認できたので実際にAuroraのテストネットにdeployしましょう。

では`scripts`フォルダにある`deploy.ts`ファイルに下のように記述していきましょう！

[`deploy.ts`]

```ts
import 'dotenv/config';
import hre from 'hardhat';

async function main() {
  if (process.env.AURORA_PRIVATE_KEY === undefined) {
    throw Error('AURORA_PRIVATE_KEY is not set');
  }

  const provider = hre.ethers.provider;
  const deployerWallet = new hre.ethers.Wallet(
    process.env.AURORA_PRIVATE_KEY,
    provider
  );

  console.log('Deploying contracts with the account:', deployerWallet.address);

  console.log(
    'Account balance:',
    (await deployerWallet.getBalance()).toString()
  );

  const swapFactory = await hre.ethers.getContractFactory('SwapContract');
  const aoaToken = await hre.ethers.getContractFactory('AuroraToken');
  const daiToken = await hre.ethers.getContractFactory('DaiToken');
  const ethToken = await hre.ethers.getContractFactory('EthToken');
  const maticToken = await hre.ethers.getContractFactory('PolygonToken');
  const shibToken = await hre.ethers.getContractFactory('ShibainuToken');
  const solToken = await hre.ethers.getContractFactory('SolanaToken');
  const uniToken = await hre.ethers.getContractFactory('UniswapToken');
  const usdtToken = await hre.ethers.getContractFactory('TetherToken');

  const SwapContract = await swapFactory.connect(deployerWallet).deploy();
  await SwapContract.deployed();

  const [deployer] = await hre.ethers.getSigners();
  console.log(`deployer address is ${deployer.address}`);

  const AoaToken = await aoaToken.deploy(SwapContract.address);
  const DaiToken = await daiToken.deploy(SwapContract.address);
  const EthToken = await ethToken.deploy(SwapContract.address);
  const MaticToken = await maticToken.deploy(SwapContract.address);
  const ShibToken = await shibToken.deploy(SwapContract.address);
  const SolToken = await solToken.deploy(SwapContract.address);
  const UniToken = await uniToken.deploy(SwapContract.address);
  const UsdtToken = await usdtToken.deploy(SwapContract.address);
  await AoaToken.deployed();
  await DaiToken.deployed();
  await EthToken.deployed();
  await MaticToken.deployed();
  await ShibToken.deployed();
  await SolToken.deployed();
  await UniToken.deployed();
  await UsdtToken.deployed();

  console.log('Swap Contract is deployed to:', SwapContract.address);
  console.log('AoaToken is deployed to:', AoaToken.address);
  console.log('DaiToken is deployed to:', DaiToken.address);
  console.log('EthToken is deployed to:', EthToken.address);
  console.log('MaticToken is deployed to:', MaticToken.address);
  console.log('ShibToken is deployed to:', ShibToken.address);
  console.log('SolToken is deployed to:', SolToken.address);
  console.log('UniToken is deployed to:', UniToken.address);
  console.log('UsdtToken is deployed to:', UsdtToken.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
```

記述が完了したら早速deployを行なっていきたいところですが、その前に[こちら](https://aurora.dev/faucet)から`Aurora Testnet`用のトークンを取得しましょう！

これがないとAurora Testnetにdeployする時のガス代を支払うことができなくなります 😭

faucetでトークンをてにいれたら、下のコマンドを実行することでdeployを行いましょう！

```
yarn contract deploy
```

deployが正常に完了していたら下のようなメッセージが返ってくるはずです。

こちらのアドレスは後で使用するのでコピー&ペーストしてメモ帳か何かへ貼り付けておいてください！ ！

```
Deploying contracts with the account: 0xa9eD1748Ffcda5442dCaEA242603E7e3FF09dD7F
Account balance: 232110043450000000
deployer address is 0xa9eD1748Ffcda5442dCaEA242603E7e3FF09dD7F
Swap Contract is deployed to: 0x45e2189eFbF087b11D806c01CBb3DE2eE0596421
toshi@ToshiBook payment_dapp_contract % npx hardhat run scripts/deploy.ts --network testnet_aurora
Deploying contracts with the account: 0xa9eD1748Ffcda5442dCaEA242603E7e3FF09dD7F
Account balance: 232046724600000000
deployer address is 0xa9eD1748Ffcda5442dCaEA242603E7e3FF09dD7F
Swap Contract is deployed to: 0xC678d76a12Dd7f87FF1f952B6bEEd2c0fd308CF8
AoaToken is deployed to: 0x10E9C13e9f73A35d4a0C8AA8328b84EF9747b7a8
DaiToken is deployed to: 0x48a6b4beAeB3a959Cd358e3365fc9d178eB0B2D9
EthToken is deployed to: 0x395A1065eA907Ab366807d68bbe21Df83169bA6c
MaticToken is deployed to: 0x4A8c0C9f9f2444197cE78b672F0D98D1Fe47bdA6
ShibToken is deployed to: 0xa11e679EE578B32d12Dbe2882FcC387A86C8f887
SolToken is deployed to: 0x30E198301969fDeddDCb84cE2C284dF58d4AB944
UniToken is deployed to: 0xC73F7cBD464aC7163D03dE669dedc3d1fA6Af5E4
UsdtToken is deployed to: 0x44734B834364c37d35e6E4253779e9459c93B5F4
```

これでコントラクトのdeployは成功したので、コントラクトの実装は完了です！

### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discordの`#near`で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の4点を記載してください ✨

```
1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット
```

---

section-1 Lesson-3の完了おめでとうございます 🎉

これでコントラクトに関する実装は全て完了しました！ ！

次のレッスンからはフロントエンドの作成、フロントエンドとコントラクトの接続をしていきましょう。
