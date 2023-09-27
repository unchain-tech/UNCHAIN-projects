###  🖥 このレッスンの参考動画URL
[Dapp University](https://youtu.be/CgXQC4dbGUE?t=5089)

### 🧙‍♂️ テストを作成・実行する

ここまでの作業でコントラクトには基本機能として以下の機能が追加されました。

* ２種類のトークンの作成
* トークンをステーキングする機能
* トークンをアンステーキングする機能

これらの基本機能をテストスクリプトとして記述していきましょう。

ではpackages/contract/testに`test.js`という名前でファイルを作成して、以下のように記述しましょう。

```javascript
const hre = require('hardhat');
const { assert, expect } = require('chai');
const web3 = require('web3');
const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');

function tokens(n) {
  return web3.utils.toWei(n, 'ether');
}

// eslint-disable-next-line no-undef
describe('TokenFarm', () => {
  async function deployTokenFixture() {
    const [owner, investor] = await hre.ethers.getSigners();

    // コントラクトのdeploy
    const daitokenContractFactory = await hre.ethers.getContractFactory(
      'DaiToken',
    );
    const dapptokenContractFactory = await hre.ethers.getContractFactory(
      'DappToken',
    );
    const tokenfarmContractFactory = await hre.ethers.getContractFactory(
      'TokenFarm',
    );
    const daiToken = await daitokenContractFactory.deploy();
    const dappToken = await dapptokenContractFactory.deploy();
    const tokenFarm = await tokenfarmContractFactory.deploy(
      dappToken.address,
      daiToken.address,
    );

    // 全てのDappトークンをファームに移動する(1 million)
    await dappToken.transfer(tokenFarm.address, tokens('1000000'));

    await daiToken.transfer(investor.address, tokens('100'));

    return {
      owner,
      investor,
      daiToken,
      dappToken,
      tokenFarm,
    };
  }

  // テスト1
  describe('Mock DAI deployment', () => {
    it('has a name', async () => {
      const { daiToken } = await loadFixture(deployTokenFixture);
      const name = await daiToken.name();
      assert.equal(name, 'Mock DAI Token');
    });
  });
  // テスト2
  describe('Dapp Token deployment', async () => {
    it('has a name', async () => {
      const { dappToken } = await loadFixture(deployTokenFixture);
      const name = await dappToken.name();
      assert.equal(name, 'DApp Token');
    });
  });

  describe('Token Farm deployment', async () => {
    // テスト3
    it('has a name', async () => {
      const { tokenFarm } = await loadFixture(deployTokenFixture);
      const name = await tokenFarm.name();
      assert.equal(name, 'Dapp Token Farm');
    });
    // テスト4
    it('contract has tokens', async () => {
      const { dappToken, tokenFarm } = await loadFixture(deployTokenFixture);
      const balance = await dappToken.balanceOf(tokenFarm.address);
      assert.equal(balance.toString(), tokens('1000000'));
    });
  });

  describe('Farming tokens', async () => {
    it('rewards investors for staking mDai tokens', async () => {
      const { daiToken, dappToken, tokenFarm, investor, owner } =
        await loadFixture(deployTokenFixture);
      let result;

      // テスト5. ステーキングの前に投資家の残高を確認する
      result = await daiToken.balanceOf(investor.address);
      assert.equal(
        result.toString(),
        tokens('100'),
        'investor Mock DAI wallet balance correct before staking',
      );

      // テスト6. 偽のDAIトークンを確認する
      await daiToken
        .connect(investor)
        .approve(tokenFarm.address, tokens('100'));
      await tokenFarm.connect(investor).stakeTokens(tokens('100'));

      // テスト7. ステーキング後の投資家の残高を確認する
      result = await daiToken.balanceOf(investor.address);
      assert.equal(
        result.toString(),
        tokens('0'),
        'investor Mock DAI wallet balance correct after staking',
      );

      // テスト8. ステーキング後のTokenFarmの残高を確認する
      result = await daiToken.balanceOf(tokenFarm.address);
      assert.equal(
        result.toString(),
        tokens('100'),
        'Token Farm Mock DAI balance correct after staking',
      );

      // テスト9. 投資家がTokenFarmにステーキングした残高を確認する
      result = await tokenFarm.stakingBalance(investor.address);
      assert.equal(
        result.toString(),
        tokens('100'),
        'investor staking balance correct after staking',
      );

      // テスト10. ステーキングを行った投資家の状態を確認する
      result = await tokenFarm.isStaking(investor.address);
      assert.equal(
        result.toString(),
        'true',
        'investor staking status correct after staking',
      );

      // ----- 追加するテストコード ------ //

      // トークンを発行する
      await tokenFarm.issueTokens();

      // トークンを発行した後の投資家の Dapp 残高を確認する
      result = await dappToken.balanceOf(investor.address);
      assert.equal(
        result.toString(),
        tokens('100'),
        'investor DApp Token wallet balance correct after staking',
      );

      // あなた（owner）のみがトークンを発行できることを確認する（もしあなた以外の人がトークンを発行しようとした場合、却下される）
      await expect(tokenFarm.connect(investor).issueTokens()).to.be.reverted;

      // トークンをアンステーキングする
      await tokenFarm.connect(investor).unstakeTokens(tokens('60'));

      // テスト11. アンステーキングの結果を確認する
      result = await daiToken.balanceOf(investor.address);
      assert.equal(
        result.toString(),
        tokens('60'),
        'investor Mock DAI wallet balance correct after staking',
      );

      // テスト12.投資家がアンステーキングした後の Token Farm 内に存在する偽の Dai 残高を確認する
      result = await daiToken.balanceOf(tokenFarm.address);
      assert.equal(
        result.toString(),
        tokens('40'),
        'Token Farm Mock DAI balance correct after staking',
      );

      // テスト13. 投資家がアンステーキングした後の投資家の残高を確認する
      result = await tokenFarm.stakingBalance(investor.address);
      assert.equal(
        result.toString(),
        tokens('40'),
        'investor staking status correct after staking',
      );

      // テスト14. 投資家がアンステーキングした後の投資家の状態を確認する
      result = await tokenFarm.isStaking(investor.address);
      assert.equal(
        result.toString(),
        'false',
        'investor staking status correct after staking',
      );
    });
  });
});
```

`追加するテストコード`の中身をよく見てみてください。

ここでのポイントは、`approve`関数を呼び出して、`investor`を`TokenFarm`の承認済みユーザとして登録している点です。
- `approve`関数について復習したい方は、section 1のlesson 2を参照してください!

`approve`関数が実行されることにより、`investor`は自身のトークンをToken Farmにステークできるようになります。
### 🔥 テストを実行する

それでは、ターミナルで下記のコマンドを実行しすることでテストしていきましょう！

```
yarn test
```

以下のような結果がターミナルに出力されていれば成功です🎉

```
Contract: TokenFarm
    Mock DAI deployment
      ✓ has a name (39ms)
    Dapp Token deployment
      ✓ has a name (43ms)
    Token Farm deployment
      ✓ has a name (40ms)
      ✓ contract has tokens (51ms)
    Farming tokens
      ✓ rewards investors for staking mDai tokens (467ms)


  5 passing (1s)
```

### コントラクトをデプロイしよう

コントラクト編の最後に、作成したコントラクトをデプロイしましょう！

ではpackages/contract/scriptsに`deploy.js`という名前でファイルを作成して、以下のように記述しましょう。

```javascript
const hre = require('hardhat');
const web3 = require('web3');

async function main() {
  // コントラクトをdeployしているアドレスの取得
  const [deployer] = await hre.ethers.getSigners();

  // コントラクトのdeploy
  const daitokenContractFactory = await hre.ethers.getContractFactory(
    'DaiToken',
  );
  const dapptokenContractFactory = await hre.ethers.getContractFactory(
    'DappToken',
  );
  const tokenfarmContractFactory = await hre.ethers.getContractFactory(
    'TokenFarm',
  );
  const daiToken = await daitokenContractFactory.deploy();
  const dappToken = await dapptokenContractFactory.deploy();
  const tokenFarm = await tokenfarmContractFactory.deploy(
    dappToken.address,
    daiToken.address,
  );

  // 全てのDappトークンをファームに移動する(1 million)
  await dappToken.transfer(
    tokenFarm.address,
    web3.utils.toWei('1000000', 'ether'),
  );

  console.log('Deploying contracts with account: ', deployer.address);
  console.log('Dai Token Contract has been deployed to: ', daiToken.address);
  console.log('Dapp Token Contract has been deployed to: ', dappToken.address);
  console.log('TokenFarm Contract has been deployed to: ', tokenFarm.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
```

ここで行っていることは単純なことで、各コントラクトをデプロイしたのちにトークンファームにdApp用のトークンを全て移動しているというものです。

dApp用のトークンはアンステーキングのときに投資家の方に自動的に配布される必要があるのでコントラクトに移されています。

ここで、`packages/contract/package.json`の`script`部分を以下のように編集してください。

```json
"scripts": {
    "test": "npx hardhat test",
    "deploy": "npx hardhat run scripts/deploy.js --network sepolia"
  },
```
その後ルートディレクトリにいることを確認して、ターミナル上で下記を実行してみましょう。

では下記のコマンドを実行してコントラクトをdeployしましょう！

```
yarn contract deploy
```

ターミナルには下のような結果が返ってきているはずです。

```
Compiled 3 Solidity files successfully
Deploying contracts with account:  0x04CD057E4bAD766361348F26E847B546cBBc7946
Dai Token Contract has been deployed to:  0x899277E309A644554da3977d5C509Feb93D3A627
Dapp Token Contract has been deployed to:  0xe2c10c09d9F0DCaab07678054B13a8837B99f612
TokenFarm Contract has been deployed to:  0x3f8237063F68F034BF25Cf096B164486eCD043ad
```

これらのコントラクトアドレスは後ほど使用するのでどこかに保存しておきましょう。

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
これでバックエンドの作成は完了です!お疲れ様でした🎉
ターミナルの出力結果を`#ethereum`にシェアしましょう!
次のセクションではフロントエンドの作成に取り掛かっていきます。Token Farmの完成まで後少しです!頑張っていきましょう💪
