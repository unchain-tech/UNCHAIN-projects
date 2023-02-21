### 🔥 swap を実装しましょう

前回のレッスンでは, あるトークンのswapによって, ユーザに送信するトークンの量を求める計算式について理解しました。

このレッスンでは実際にコントラクトにswapを実装します。

`AMM.sol`のAMMコントラクトの最後の行に以下の2つの関数を追加してください。

```solidity
    // swap元のトークン量からswap先のトークン量を算出
    function getSwapEstimateOut(IERC20 _inToken, uint256 _amountIn)
        public
        view
        activePool
        validToken(_inToken)
        returns (uint256)
    {
        IERC20 outToken = pairToken(_inToken);

        uint256 amountInWithFee = _amountIn * 997;

        uint256 numerator = amountInWithFee * totalAmount[outToken];
        uint256 denominator = totalAmount[_inToken] * 1000 + amountInWithFee;
        uint256 amountOut = numerator / denominator;

        return amountOut;
    }

    // swap先のトークン量からswap元のトークン量を算出
    function getSwapEstimateIn(IERC20 _outToken, uint256 _amountOut)
        public
        view
        activePool
        validToken(_outToken)
        returns (uint256)
    {
        require(
            _amountOut < totalAmount[_outToken],
            "Insufficient pool balance"
        );
        IERC20 inToken = pairToken(_outToken);

        uint256 numerator = 1000 * totalAmount[inToken] * _amountOut;
        uint256 denominator = 997 * (totalAmount[_outToken] - _amountOut);
        uint256 amountIn = numerator / denominator;

        return amountIn;
    }
```

`getSwapEstimateOut`関数では前回のレッスンの`シチュエーション 1`を実装しています。

引数で渡されたswapをする元のトークン(`_inToken`)と, その量(`_amountIn`)から, swapによりプールからユーザに送信されるswap先のトークンの量を返却します。

ここ使われているoutという言葉はプールから出ていくトークンに関するものであることを表し, inはプールに入ってくるトークンに関するものであることを表します。

内部で行っている計算式は前回のレッスンで求めたもの使用しています。

`getSwapEstimateIn`関数についても同様で, 前回のレッスンの`シチュエーション 2`を実装しています。

スワップ先のトークンの量からプールに必要なスワップ元のトークンの量を返却します。

さらにその下の行に以下の関数を追加し, コントラクトを完成させてください。

```solidity
    function swap(
        IERC20 _inToken,
        IERC20 _outToken,
        uint256 _amountIn
    ) external activePool validTokens(_inToken, _outToken) returns (uint256) {
        require(_amountIn > 0, "Amount cannot be zero!");

        uint256 amountOut = getSwapEstimateOut(_inToken, _amountIn);

        _inToken.transferFrom(msg.sender, address(this), _amountIn);
        totalAmount[_inToken] += _amountIn;
        totalAmount[_outToken] -= amountOut;
        _outToken.transfer(msg.sender, amountOut);
        return amountOut;
    }
```

`swap`関数はシンプルで, `getSwapEstimateOut`によりユーザに送信するトークンの量を取得したら,
`_inToken`をユーザからコントラクトへ移動させ`_outToken`をコントラクトからユーザへ送信します。

### 🧪 テストを追加しましょう

それでは追加した機能に対してテストを書いていきます。
`test/AMM.ts`内のテストの最後の行に以下のコードを追加してください。

```ts
describe("getSwapEstimateOut", function () {
  it("Should get the right number of token", async function () {
    const { amm, token0, token1 } = await loadFixture(
      deployContractWithLiquidity
    );

    const totalToken0 = await amm.totalAmount(token0.address);
    const totalToken1 = await amm.totalAmount(token1.address);

    const amountInToken0 = ethers.utils.parseEther("10");
    // basic formula: k = x * y
    // fee = 0.3%
    const amountInToken0WithFee = amountInToken0.mul(997);
    const amountReceiveToken1 = amountInToken0WithFee
      .mul(totalToken1)
      .div(totalToken0.mul(1000).add(amountInToken0WithFee));

    expect(await amm.getSwapEstimateOut(token0.address, amountInToken0)).to.eql(
      amountReceiveToken1
    );
  });
});

describe("getSwapEstimateIn", function () {
  it("Should get the right number of token", async function () {
    const { amm, token0, token1 } = await loadFixture(
      deployContractWithLiquidity
    );

    const totalToken0 = await amm.totalAmount(token0.address);
    const totalToken1 = await amm.totalAmount(token1.address);

    const amountOutToken1 = ethers.utils.parseEther("10");
    // basic formula: k = x * y
    // fee = 0.3%
    const amountInToken0 = totalToken0
      .mul(amountOutToken1)
      .mul(1000)
      .div(totalToken1.sub(amountOutToken1).mul(997));

    expect(await amm.getSwapEstimateIn(token1.address, amountOutToken1)).to.eql(
      amountInToken0
    );
  });

  it("Should revert if the amount of out token exceed the total", async function () {
    const { amm, token1, amountOwnerProvided1, amountOtherProvided1 } =
      await loadFixture(deployContractWithLiquidity);

    const amountSendToken1 = amountOwnerProvided1
      .add(amountOtherProvided1)
      .add(1);

    await expect(
      amm.getSwapEstimateIn(token1.address, amountSendToken1)
    ).to.be.revertedWith("Insufficient pool balance");
  });
});
```

`getSwapEstimateOut`, `getSwapEstimateIn`テストは共に先ほど実装した
getSwapEstimateOut/getSwapEstimateInが正しく値を返しているかをテスト側でも計算することで確かめています。

また, `getSwapEstimateIn`テストでは`getSwapEstimateIn`を呼び出す際に指定するトークンの量がプール内の総量を超えていた場合にトランザクションがキャンセルされることを確かめています。

続いてその下に以下のテストを追加しましょう。

```ts
describe("swap", function () {
  it("Should set the right number of amm details", async function () {
    const {
      amm,
      token0,
      amountOwnerProvided0,
      amountOtherProvided0,
      token1,
      amountOwnerProvided1,
      amountOtherProvided1,
    } = await loadFixture(deployContractWithLiquidity);

    const amountSendToken0 = ethers.utils.parseEther("10");
    const amountReceiveToken1 = await amm.getSwapEstimateOut(
      token0.address,
      amountSendToken0
    );

    await token0.approve(amm.address, amountSendToken0);
    await amm.swap(token0.address, token1.address, amountSendToken0);

    expect(await amm.totalAmount(token0.address)).to.equal(
      amountOwnerProvided0.add(amountOtherProvided0).add(amountSendToken0)
    );
    expect(await amm.totalAmount(token1.address)).to.equal(
      amountOwnerProvided1.add(amountOtherProvided1).sub(amountReceiveToken1)
    );
  });

  it("Token should be moved", async function () {
    const { amm, token0, token1, owner } = await loadFixture(
      deployContractWithLiquidity
    );

    const ownerBalance0Before = await token0.balanceOf(owner.address);
    const ownerBalance1Before = await token1.balanceOf(owner.address);

    const ammBalance0Before = await token0.balanceOf(amm.address);
    const ammBalance1Before = await token1.balanceOf(amm.address);

    const amountSendToken0 = ethers.utils.parseEther("10");
    const amountReceiveToken1 = await amm.getSwapEstimateOut(
      token0.address,
      amountSendToken0
    );

    await token0.approve(amm.address, amountSendToken0);
    await amm.swap(token0.address, token1.address, amountSendToken0);

    expect(await token0.balanceOf(owner.address)).to.eql(
      ownerBalance0Before.sub(amountSendToken0)
    );
    expect(await token1.balanceOf(owner.address)).to.eql(
      ownerBalance1Before.add(amountReceiveToken1)
    );

    expect(await token0.balanceOf(amm.address)).to.eql(
      ammBalance0Before.add(amountSendToken0)
    );
    expect(await token1.balanceOf(amm.address)).to.eql(
      ammBalance1Before.sub(amountReceiveToken1)
    );
  });
});
```

`swap`のテストを追加しました。

swapによりammの状態変数が正しく変更されているか, トークンの移動が正しく行われているかをそれぞれテストを記述しています。

### ⭐ テストを実行しましょう

`contract`ディレクトリ直下で以下のコマンドを実行してください。

```

$ npx hardhat test

```

以下のような表示がされたらテスト成功です！

![](/public/images/AVAX-AMM/section-2/2_1_4.png)

### 🌔 参考リンク

> [こちら](https://github.com/unchain-dev/avalanche-amm-dapp)に本プロジェクトの完成形のレポジトリがあります。
>
> 期待通り動かない場合は参考にしてみてください。


### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は,Discordの`#avalanche`で質問をしてください。

ヘルプをするときのフローが円滑になるので,エラーレポートには下記の3点を記載してください ✨

```
1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット
```

---

おめでとうございます!
セクション2が終了しました。 コントラクトの完成です！

次のセクションではフロントエンドを作成します 🏌️‍♀️
