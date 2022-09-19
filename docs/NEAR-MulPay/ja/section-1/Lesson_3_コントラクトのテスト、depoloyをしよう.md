### ✍️ 作成したコントラクトをテストしよう

コントラクトが完成したので次はそれらがきちんと機能しているのかテストしていきましょう！

`test`フォルダにある`swap.test.ts`ファイルの中身を下のように書き換えていきましょう。

`SwapContract.address`の部分に赤線が出ている人もいるかもしれませんが、これは linter が過剰に反応しているだけでテストはきちんと行うことができるので気にする必要はありません。

[`swap.test.ts`]

```
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
import { ethers } from "hardhat";

describe("Swap Contract", function () {
  async function deployTokenFixture() {
    const [owner, addr1] = await ethers.getSigners();

    const daiToken = await ethers.getContractFactory("DaiToken");
    const ethToken = await ethers.getContractFactory("EthToken");
    const auroraToken = await ethers.getContractFactory("AuroraToken");
    const shibainuToken = await ethers.getContractFactory("ShibainuToken");
    const solanaToken = await ethers.getContractFactory("SolanaToken");
    const tetherToken = await ethers.getContractFactory("TetherToken");
    const uniswapToken = await ethers.getContractFactory("UniswapToken");
    const polygonToken = await ethers.getContractFactory("PolygonToken");
    const swapFactory = await ethers.getContractFactory("SwapContract");

    const SwapContract = await swapFactory.deploy();
    const DaiToken = await daiToken.deploy(SwapContract.address);
    const EthToken = await ethToken.deploy(SwapContract.address);
    const AoaToken = await auroraToken.deploy(SwapContract.address);
    const ShibToken = await shibainuToken.deploy(SwapContract.address);
    const SolToken = await solanaToken.deploy(SwapContract.address);
    const UsdtToken = await tetherToken.deploy(SwapContract.address);
    const UniToken = await uniswapToken.deploy(SwapContract.address);
    const MaticToken = await polygonToken.deploy(SwapContract.address);

    return {
      owner,
      addr1,
      DaiToken,
      EthToken,
      AoaToken,
      ShibToken,
      SolToken,
      UsdtToken,
      UniToken,
      MaticToken,
      SwapContract,
    };
  }
  describe("Deployment", function () {
    // check if the owner of DAI token is smart contract
    it("ERC20 token is minted from smart contract", async function () {
      const { DaiToken, SwapContract } = await loadFixture(deployTokenFixture);
      const balanceOfDai = await DaiToken.balanceOf(SwapContract.address);
      console.log(balanceOfDai.toString());
    });

    // get the value between DAI and ETH
    it("Get value between DAI and ETH", async function () {
      const { DaiToken, EthToken, SwapContract } = await loadFixture(
        deployTokenFixture
      );
      const value = await SwapContract.calculateValue(
        EthToken.address,
        DaiToken.address
      );
      console.log(
        `value of ETH/DAI is ${
          value / parseInt(ethers.utils.parseEther("1").toString())
        }`
      );
    });

    // check swap function works
    it("swap function", async function () {
      const { owner, addr1, DaiToken, EthToken, UniToken, SwapContract } =
        await loadFixture(deployTokenFixture);

      await DaiToken.approve(
        SwapContract.address,
        ethers.utils.parseEther("200")
      );
      await SwapContract.distributeToken(
        DaiToken.address,
        ethers.utils.parseEther("100"),
        owner.address
      );
      const ethAmountBefore = await DaiToken.balanceOf(addr1.address);
      console.log(
        `Before transfer, address_1 has ${ethAmountBefore.toString()} ETH`
      );

      await SwapContract.swap(
        DaiToken.address,
        UniToken.address,
        EthToken.address,
        ethers.utils.parseEther("1"),
        addr1.address
      );

      const ethAmountAfter = ethers.utils.formatEther(
        await EthToken.balanceOf(addr1.address)
      );
      console.log(`After transfer, address_1 has ${ethAmountAfter} ETH`);
    });
  });
});
```

最初に宣言している`deployTokenFixture`関数はそれぞれのコントラクトをデプロイを行うための関数で、それぞれのテストを行う前に走らせる必要があります。

```
async function deployTokenFixture() {
    const [owner, addr1] = await ethers.getSigners();

    const daiToken = await ethers.getContractFactory("DaiToken");
    const ethToken = await ethers.getContractFactory("EthToken");
    const auroraToken = await ethers.getContractFactory("AuroraToken");
    const shibainuToken = await ethers.getContractFactory("ShibainuToken");
    const solanaToken = await ethers.getContractFactory("SolanaToken");
    const tetherToken = await ethers.getContractFactory("TetherToken");
    const uniswapToken = await ethers.getContractFactory("UniswapToken");
    const polygonToken = await ethers.getContractFactory("PolygonToken");
    const swapFactory = await ethers.getContractFactory("SwapContract");

    const SwapContract = await swapFactory.deploy();
    const DaiToken = await daiToken.deploy(SwapContract.address);
    const EthToken = await ethToken.deploy(SwapContract.address);
    const AoaToken = await auroraToken.deploy(SwapContract.address);
    const ShibToken = await shibainuToken.deploy(SwapContract.address);
    const SolToken = await solanaToken.deploy(SwapContract.address);
    const UsdtToken = await tetherToken.deploy(SwapContract.address);
    const UniToken = await uniswapToken.deploy(SwapContract.address);
    const MaticToken = await polygonToken.deploy(SwapContract.address);

    return {
      owner,
      addr1,
      DaiToken,
      EthToken,
      AoaToken,
      ShibToken,
      SolToken,
      UsdtToken,
      UniToken,
      MaticToken,
      SwapContract,
    };
  }
```

最初の部分では ERC20 規格のトークンがきちんと deploy されているかをテストしています。

```
it("ERC20 token is minted from smart contract", async function () {
      const { DaiToken, SwapContract } = await loadFixture(deployTokenFixture);
      const balanceOfDai = await DaiToken.balanceOf(SwapContract.address);
      console.log(balanceOfDai.toString());
    });
```

ここでは ERC20 規格に搭載されている、残高を確認するためのメソッドである`blanceOf`関数が機能しているか、SwapContract に全てのトークンが入っているのかを確認しています。

次に`DAI/ETH`の価値を算出しています。SwapContract が保有しているそれぞれのトークン量によって変動します。

`ERC20Tokens.sol`では ETH の発行量は DAI のそれより 1/10 の量なので 0.1 になるはずです。

```
it("Get value ETH/DAI", async function () {
      const { DaiToken, EthToken, SwapContract } = await loadFixture(
        deployTokenFixture
      );
      const value = await SwapContract.calculateValue(
        EthToken.address,
        DaiToken.address
      );
      console.log(
        `value of ETH/DAI is ${
          value / parseInt(ethers.utils.parseEther("1").toString())
        }`
      );
    });
```

次に symbol と token のアドレスのペアをセットして、それが正しく格納されているかをチェックしています。

```
// check list up function token symbol => token address
    it("List up token address with that of symbol", async function () {
      const {
        DaiToken,
        EthToken,
        AoaToken,
        ShibToken,
        SolToken,
        UsdtToken,
        UniToken,
        MaticToken,
        SwapContract,
      } = await loadFixture(deployTokenFixture);
      const DAI = ethers.utils.formatBytes32String("DAI");
      const ETH = ethers.utils.formatBytes32String("ETH");
      const AOA = ethers.utils.formatBytes32String("AOA");
      const SHIB = ethers.utils.formatBytes32String("SHIB");
      const SOL = ethers.utils.formatBytes32String("SOL");
      const USDT = ethers.utils.formatBytes32String("USDT");
      const UNI = ethers.utils.formatBytes32String("UNI");
      const MATIC = ethers.utils.formatBytes32String("MATIC");

      const tokenSymbolList = [DAI, ETH, AOA, SHIB, SOL, USDT, UNI, MATIC];
      const tokenAddressList = [
        DaiToken.address,
        EthToken.address,
        AoaToken.address,
        ShibToken.address,
        SolToken.address,
        UsdtToken.address,
        UniToken.address,
        MaticToken.address,
      ];

      for (let i = 0; i < tokenSymbolList.length; i++) {
        await SwapContract.listUpTokenAddress(
          tokenSymbolList[i],
          tokenAddressList[i]
        );
        const tokenAddress = await SwapContract.returnTokenAddress(
          tokenSymbolList[i]
        );
        const tokenSymbol = ethers.utils.parseBytes32String(tokenSymbolList[i]);
        console.log(`${tokenSymbol} token address :${tokenAddress}`);
      }
    });
```

最後に swap 機能がきちんと動くかをチェックしています。送金者と仮定するアドレス(owner)に`200DAI`を SwapContract から送金します。

その後受領者の残高を swap 前後で確認しています。

```
// check swap function works
    it("swap function", async function () {
      const { owner, addr1, DaiToken, EthToken, UniToken, SwapContract } =
        await loadFixture(deployTokenFixture);

      await DaiToken.approve(
        SwapContract.address,
        ethers.utils.parseEther("200")
      );
      await SwapContract.distributeToken(
        DaiToken.address,
        ethers.utils.parseEther("100"),
        owner.address
      );
      const ethAmountBefore = await DaiToken.balanceOf(addr1.address);
      console.log(
        `Before transfer, address_1 has ${ethAmountBefore.toString()} ETH`
      );

      await SwapContract.swap(
        DaiToken.address,
        UniToken.address,
        EthToken.address,
        ethers.utils.parseEther("1"),
        addr1.address
      );

      const ethAmountAfter = ethers.utils.formatEther(
        await EthToken.balanceOf(addr1.address)
      );
      console.log(`After transfer, address_1 has ${ethAmountAfter} ETH`);
    });
```

これで test のためのコードは書けたので、下のコマンドをターミナルで実行することでチェックしてみましょう。

```
npx hardhat test
```

これによって以下のような結果が返ってくるはずです。

```
 Swap Contract
    Deployment
1000000000000000000000000
      ✔ ERC20 token is minted from smart contract (1241ms)
value of ETH/DAI is 0.1
      ✔ Get value between DAI and ETH
Before transfer, address_1 has 0 ETH
After transfer, address_1 has 0.1 ETH
      ✔ swap function (50ms)


  3 passing (1s)
```

1. SwapContract にきちんと ERC20 トークンが発行されている
2. ETH/DAI の相対的な価値が 0.1 となっている
3. address_1 の残高が 0ETH→0.1ETH に変わっている

これらのことが確認できたので test 成功です！

では次に、作成したコントラクトをデプロイしましょう！

### ⬆️ 作成したコントラクトを deploy しよう

コントラクトがきちんと動いていることが確認できたので実際に Aurora のテストネットに deploy しましょう。

では`scripts`フォルダにある`deploy.ts`ファイルに下のように記述していきましょう！

[`deploy.ts`]

```
require("dotenv").config();
const hre = require("hardhat");

const provider = hre.ethers.provider;
const deployerWallet = new hre.ethers.Wallet(
  process.env.AURORA_PRIVATE_KEY,
  provider
);

async function main() {
  console.log("Deploying contracts with the account:", deployerWallet.address);

  console.log(
    "Account balance:",
    (await deployerWallet.getBalance()).toString()
  );

  const swapFactory = await hre.ethers.getContractFactory("SwapContract");
  const daiToken = await hre.ethers.getContractFactory("DaiToken");
  const ethToken = await hre.ethers.getContractFactory("EthToken");
  const aoaToken = await hre.ethers.getContractFactory("AuroraToken");
  const shibToken = await hre.ethers.getContractFactory("ShibainuToken");
  const solToken = await hre.ethers.getContractFactory("SolanaToken");
  const usdtToken = await hre.ethers.getContractFactory("TetherToken");
  const uniToken = await hre.ethers.getContractFactory("UniswapToken");
  const maticToken = await hre.ethers.getContractFactory("PolygonToken");

  const SwapContract = await swapFactory.connect(deployerWallet).deploy();
  await SwapContract.deployed();

  const [deployer] = await hre.ethers.getSigners();
  console.log(`deployer address is ${deployer.address}`);

  const DaiToken = await daiToken.deploy(SwapContract.address);
  const EthToken = await ethToken.deploy(SwapContract.address);
  const AoaToken = await aoaToken.deploy(SwapContract.address);
  const ShibToken = await shibToken.deploy(SwapContract.address);
  const SolToken = await solToken.deploy(SwapContract.address);
  const UsdtToken = await usdtToken.deploy(SwapContract.address);
  const UniToken = await uniToken.deploy(SwapContract.address);
  const MaticToken = await maticToken.deploy(SwapContract.address);
  await DaiToken.deployed();
  await EthToken.deployed();
  await AoaToken.deployed();
  await ShibToken.deployed();
  await SolToken.deployed();
  await UsdtToken.deployed();
  await UniToken.deployed();
  await MaticToken.deployed();

  console.log("Swap Contract is deployed to:", SwapContract.address);
  console.log("DaiToken is deployed to:", DaiToken.address);
  console.log("EthToken is deployed to:", EthToken.address);
  console.log("AoaToken is deployed to:", AoaToken.address);
  console.log("ShibToken is deployed to:", ShibToken.address);
  console.log("SolToken is deployed to:", SolToken.address);
  console.log("UsdtToken is deployed to:", UsdtToken.address);
  console.log("UniToken is deployed to:", UniToken.address);
  console.log("MaticToken is deployed to:", MaticToken.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
```

記述が完了したら早速 deploy を行なっていきたいところですが、その前に[こちら](https://aurora.dev/faucet)から`Aurora Testnet`用のトークンを取得しましょう！

これがないと Aurora Testnet に deploy する時のガス代を支払うことができなくなります 😭

faucet でトークンをてにいれたら、下のコマンドを実行することで deploy を行いましょう！

```
npx hardhat run scripts/deploy.ts --network testnet_aurora
```

deploy が正常に完了していたら下のようなメッセージが返ってくるはずです。

こちらのアドレスは後で使用するのでコピペしてメモ帳か何かへ貼り付けておいてください！！

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
DaiToken is deployed to: 0x48a6b4beAeB3a959Cd358e3365fc9d178eB0B2D9
EthToken is deployed to: 0x395A1065eA907Ab366807d68bbe21Df83169bA6c
AoaToken is deployed to: 0x10E9C13e9f73A35d4a0C8AA8328b84EF9747b7a8
ShibToken is deployed to: 0xa11e679EE578B32d12Dbe2882FcC387A86C8f887
SolToken is deployed to: 0x30E198301969fDeddDCb84cE2C284dF58d4AB944
UsdtToken is deployed to: 0x44734B834364c37d35e6E4253779e9459c93B5F4
UniToken is deployed to: 0xC73F7cBD464aC7163D03dE669dedc3d1fA6Af5E4
MaticToken is deployed to: 0x4A8c0C9f9f2444197cE78b672F0D98D1Fe47bdA6
```

これでコントラクトの deploy は成功したので、コントラクトの実装は完了です！

### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discord の `#section-1` で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の 4 点を記載してください ✨

```
1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット
```

---

section-1 Lesson-3 の完了おめでとうございます 🎉

これでコントラクトに関する実装は全て完了しました！！

次のレッスンからはフロントエンドの作成、フロントエンドとコントラクトの接続をしていきましょう。
