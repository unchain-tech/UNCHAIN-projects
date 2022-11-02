### 🔥 トークンの引き出し機能を実装しましょう

前回のレッスンではトークンの提供機能を実装しましたが,  
このレッスンでは流動性の提供者が預けたトークンを引き出す機能を実装します。

ユーザは自身のシェアの分だけプールに預けたトークンを引き出すことができます。

それでは`AMM.sol`のAMMコントラクトの最後の行に以下の2つの関数を追加してください。

```solidity
    // ユーザのシェアから引き出せるトークンの量を算出します。
    function getWithdrawEstimate(IERC20 _token, uint256 _share)
        public
        view
        activePool
        validToken(_token)
        returns (uint256)
    {
        require(_share <= totalShare, "Share should be less than totalShare");
        return (_share * totalAmount[_token]) / totalShare;
    }

    function withdraw(uint256 _share)
        external
        activePool
        returns (uint256, uint256)
    {
        require(_share > 0, "share cannot be zero!");
        require(_share <= share[msg.sender], "Insufficient share");

        uint256 amountTokenX = getWithdrawEstimate(tokenX, _share);
        uint256 amountTokenY = getWithdrawEstimate(tokenY, _share);

        share[msg.sender] -= _share;
        totalShare -= _share;

        totalAmount[tokenX] -= amountTokenX;
        totalAmount[tokenY] -= amountTokenY;

        tokenX.transfer(msg.sender, amountTokenX);
        tokenY.transfer(msg.sender, amountTokenY);

        return (amountTokenX, amountTokenY);
    }
```

`getWithdrawEstimate`関数では, 指定されたシェアの分に応じたトークンの量を算出します。

シェアの総量(`totalShare`)に対する指定されたシェア(`share`)の割合は$\frac{share}{totalShare}$で表されるので,  
シェアの分に応じたトークンの量は $\frac{share}{totalShare} * totalAmount[\_token](トークンの総量)$で算出することができます。

`withdraw`関数では実際に引き出し処理を実装しています。

初めに`getWithdrawEstimate`により各トークンのAMMから引き出す量を算出します。

引き出す分だけシェアとトークン量の状態変数の調整を行い, トークンを関数を呼び出したユーザへ送信します。

ここではAMMコントラクトからユーザへトークンを送信するので, `transfer`関数を使用すれば良いです。

### 🧪 テストを追加しましょう

それでは追加した機能に対してテストを書いていきます。  
`test/AMM.ts`内のテストの最後の行に以下のコードを追加してください。

```ts
describe("getWithdrawEstimate", function () {
  it("Should get the right number of estimated amount", async function () {
    const {
      amm,
      token0,
      amountOtherProvided0,
      token1,
      amountOtherProvided1,
      otherAccount,
    } = await loadFixture(deployContractWithLiquidity);

    // otherAccountのシェアの取得
    let share = await amm.share(otherAccount.address);

    expect(await amm.getWithdrawEstimate(token0.address, share)).to.eql(
      amountOtherProvided0
    );
    expect(await amm.getWithdrawEstimate(token1.address, share)).to.eql(
      amountOtherProvided1
    );
  });
});
```

`getWithdrawEstimate`テストではotherAccountのシェアを引数に指定した場合の  
`getWithdrawEstimate`関数の返り値をテストしています。

otherAccountは`amountOtherProvided0`と`amountOtherProvided1`だけそれぞれプールに預けているので, シェアの分だけ引き出せる量を計算すると  
預けている量と同じ量が返ってくるはずです。

続いてその下に以下のテストを追加しましょう。

```ts
describe("withdraw", function () {
  it("Token should be moved", async function () {
    const {
      amm,
      token0,
      amountOwnerProvided0,
      token1,
      amountOwnerProvided1,
      owner,
    } = await loadFixture(deployContractWithLiquidity);

    const ownerBalance0Before = await token0.balanceOf(owner.address);
    const ownerBalance1Before = await token1.balanceOf(owner.address);

    const ammBalance0Before = await token0.balanceOf(amm.address);
    const ammBalance1Before = await token1.balanceOf(amm.address);

    let share = await amm.share(owner.address);
    await amm.withdraw(share);

    expect(await token0.balanceOf(owner.address)).to.eql(
      ownerBalance0Before.add(amountOwnerProvided0)
    );
    expect(await token1.balanceOf(owner.address)).to.eql(
      ownerBalance1Before.add(amountOwnerProvided1)
    );

    expect(await token0.balanceOf(amm.address)).to.eql(
      ammBalance0Before.sub(amountOwnerProvided0)
    );
    expect(await token1.balanceOf(amm.address)).to.eql(
      ammBalance1Before.sub(amountOwnerProvided1)
    );
  });

  it("Should set the right number of amm details", async function () {
    const {
      amm,
      token0,
      amountOwnerProvided0,
      token1,
      amountOwnerProvided1,
      owner,
      otherAccount,
    } = await loadFixture(deployContractWithLiquidity);

    // otherAccountが全てのシェア分引き出し
    let share = await amm.share(otherAccount.address);
    await amm.connect(otherAccount).withdraw(share);

    const precision = await amm.PRECISION();
    const BN100 = BigNumber.from("100");

    expect(await amm.totalShare()).to.equal(BN100.mul(precision));
    expect(await amm.share(owner.address)).to.equal(BN100.mul(precision));
    expect(await amm.share(otherAccount.address)).to.equal(0);
    expect(await amm.totalAmount(token0.address)).to.equal(
      amountOwnerProvided0
    );
    expect(await amm.totalAmount(token1.address)).to.equal(
      amountOwnerProvided1
    );
  });
});
```

`Token should be moved`テストでは, `withdraw`関数を実行する前後でトークンが正しく移動しているかを確認しています。  
ロジックは`provide`に関するテストで行ったトークンの移動の確認と同じです。

続く`Should set the right number of amm details`テストでは, otherAccountが自身のシェアの分トークンを引き出した場合に,  
AMMコントラクトの状態変数が正しく変更されているかを確認しています。

### ⭐ テストを実行しましょう

`contract`ディレクトリ直下で以下のコマンドを実行してください。

```

$ npx hardhat test

```

以下のような表示がされたらテスト成功です！

![](/public/images/AVAX-amm/section-1/1_4_1.png)

### 🌔 参考リンク

> [こちら](https://github.com/unchain-dev/avalanche-amm-dapp)に本プロジェクトの完成形のレポジトリがあります。
>
> コードがうまく動かない場合は参考にしてみてください。  
> `contract`はリンク先のレポジトリ内の`package/contract`を。  
> `client`はリンク先のレポジトリ内の`package/client`を参照してください。

### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は,Discordの`#avax-amm`で質問をしてください。

ヘルプをするときのフローが円滑になるので,エラーレポートには下記の3点を記載してください ✨

```
1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット
```

---

おめでとうございます!  
セクション1が終了しました!

次のセクションではAMMコントラクトにswap機能を実装していきます 🏄‍♂️
