### 🔥 流動性の提供を実装しましょう

このレッスンではトークンを保有したユーザが, 流動性を提供する際に動かす関数をコントラクトに実装します。

以下に実装の要点を整理します。

- ユーザは 2 つのトークンをコントラクトに預けることができます。

- 預けるトークンはお互い同価値の量を預てもらうというルールを設けます。
  例) プールにトークン X と Y が 1:2 の割合で存在する場合, トークン X を 10 預ける場合、トークン Y は 20 必要なことになります。

- コントラクト内では, ユーザが預けたトークンの量が全体のどれくらいの割合であるか(シェア)を数値として保持します。

それでは実装に入りますが, まずは `AMM.sol` 内が以下になるようにコンストラクタの下にコードを追加してください。

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "hardhat/console.sol";

contract AMM {
    IERC20 tokenX; // ERC20を実装したコントラクト
    IERC20 tokenY; // ERC20を実装したコントラクト
    uint256 public totalShare; // シェアの総量
    mapping(address => uint256) public share; // 各ユーザのシェア
    mapping(IERC20 => uint256) public totalAmount; // プールにロックされた各トークンの量

    uint256 public constant PRECISION = 1_000_000; // シェアの精度に使用する定数(= 6桁)

    // プールに使えるトークンを指定します。
    constructor(IERC20 _tokenX, IERC20 _tokenY) {
        tokenX = _tokenX;
        tokenY = _tokenY;
    }

    // プールに流動性があり, 使用可能であることを確認します。
    modifier activePool() {
        require(totalShare > 0, "Zero Liquidity");
        _;
    }

    // スマートコントラクトが扱えるトークンであることを確認します。
    modifier validToken(IERC20 _token) {
        require(
            _token == tokenX || _token == tokenY,
            "Token is not in the pool"
        );
        _;
    }

    // スマートコントラクトが扱えるトークンであることを確認します。
    modifier validTokens(IERC20 _tokenX, IERC20 _tokenY) {
        require(
            _tokenX == tokenX || _tokenY == tokenY,
            "Token is not in the pool"
        );
        require(
            _tokenY == tokenX || _tokenY == tokenY,
            "Token is not in the pool"
        );
        require(_tokenX != _tokenY, "Tokens should be different!");
        _;
    }

    // 引数のトークンとペアのトークンのコントラクトを返します。
    function pairToken(IERC20 token)
        private
        view
        validToken(token)
        returns (IERC20)
    {
        if (token == tokenX) {
            return tokenY;
        }
        return tokenX;
    }
}
```

ここで追加したものはこれから実装する関数で必要になってくるものです。

次に, 以下の関数をコントラクトの最後の行に追加してください。

```solidity
    // 引数のトークンの量に値するペアのトークンの量を返します。
    function getEquivalentToken(IERC20 _inToken, uint256 _amountIn)
        public
        view
        activePool
        validToken(_inToken)
        returns (uint256)
    {
        IERC20 outToken = pairToken(_inToken);

        return (totalAmount[outToken] * _amountIn) / totalAmount[_inToken];
    }
```

ここではユーザが流動性を提供する前に, 片方の預けるトークンの量から, もう片方の同価値の量を返却する関数を実装しています。

トークン X と Y に関してプールにある総量をそれぞれ x, y, 流動性提供によりプールに増える量をそれぞれ x', y'で表すとすると次の式が成り立ちます。

$$
x : y = x' : y'
$$

上記のような比の関係において $x * y' = y * x'$ とも考えることができるため,
y'について量を求めたい場合は以下の式により求めることができます。

$$
y' = \frac{y*x'}{x}
$$

この計算を先ほど実装した関数内では行っています。
引数で渡されたトークンとその量から, ペアのトークンとその同価値の量(返り値)を求めています。

次に実際に流動性を提供する関数を実装します。
コントラクトの最後の行に以下の関数を追加してください。

```solidity
    // プールに流動性を提供します。
    function provide(
        IERC20 _tokenX,
        uint256 _amountX,
        IERC20 _tokenY,
        uint256 _amountY
    ) external validTokens(_tokenX, _tokenY) returns (uint256) {
        require(_amountX > 0, "Amount cannot be zero!");
        require(_amountY > 0, "Amount cannot be zero!");

        uint256 newshare;
        if (totalShare == 0) {
            // 初期は100
            newshare = 100 * PRECISION;
        } else {
            uint256 shareX = (totalShare * _amountX) / totalAmount[_tokenX];
            uint256 shareY = (totalShare * _amountY) / totalAmount[_tokenY];
            require(
                shareX == shareY,
                "Equivalent value of tokens not provided..."
            );
            newshare = shareX;
        }

        require(
            newshare > 0,
            "Asset value less than threshold for contribution!"
        );

        _tokenX.transferFrom(msg.sender, address(this), _amountX);
        _tokenY.transferFrom(msg.sender, address(this), _amountY);

        totalAmount[_tokenX] += _amountX;
        totalAmount[_tokenY] += _amountY;

        totalShare += newshare;
        share[msg.sender] += newshare;

        return newshare;
    }
```

引数には預けるトークンコントラクトとその量を受け取ります。
modifier や require を使って各値が正常か確認しています。

預けられたトークンのシェアを求め, `newShare`に格納します。
ここでは条件分岐があります。

```solidity
uint256 newshare;
if (totalShare == 0) {
    // 初期は100
    newshare = 100 * PRECISION;
} else {
    uint256 shareX = (totalShare * _amountX) / totalAmount[_tokenX];
    uint256 shareY = (totalShare * _amountY) / totalAmount[_tokenY];
    require(
        shareX == shareY,
        "Equivalent value of tokens not provided..."
    );
    newshare = shareX;
}
```

`totalShare == 0` の時, つまりプールにまだトークンが存在しない場合は, シェアの初期値を 100 とします。

`totalShare != 0` の場合は, それぞれのトークンに関して, 預けられたトークンの全体のトークンに対するシェアを求めます。
計算式は以下を基にしています。

$$
シェア = シェアの総量 * \frac{増えるトークンの量}{トークンの総量}
$$

各トークンは同価値の量だけ渡されているはずなので, それぞれのシェアも同じになるはずです。

シェアの計算後の処理について見ていきましょう。

```solidity
_tokenX.transferFrom(msg.sender, address(this), _amountX);
_tokenY.transferFrom(msg.sender, address(this), _amountY);
```

ここでは流動性を提供するユーザから実際にトークンをコントラクトへ引き出します。

`IERC20` の中にある関数 `transferFrom` は以下のような引数に従って, トークンの移動(送金)を行うことができます。

- 引数 1: トークンの送金元のアドレス。今回は流動性の提供者であるため msg.sender。
- 引数 2: トークンの送金先のアドレス。今回はコントラクトであるため address(this)。
- 引数 3: 送金するトークンの量。今回は預けるトークンの量。

`transferFrom` に関してはこの後さらに詳しく理解していきます。

```solidity
totalAmount[_tokenX] += _amountX;
totalAmount[_tokenY] += _amountY;
```

ここではプールにあるトークンの総量を増やしています。

```solidity
totalShare += newshare;
share[msg.sender] += newshare;
```

ここではプール内に増えたトークンのシェアを, シェア総量と流動性提供者のシェアに加えます。

### 🏦 `transferFrom` と `approve`

先ほど `transferFrom` という関数を使用しましたが, この関数は `approve` という関数とセットで使います。

`approve` という関数は, あるアカウントまたはスマートコントラクトが, 自分の所有するトークンを移動することを許可する関数です。

このように使います。

```
ERC20TokenContract.approve(移動を実行するアカウントまたはコントラクトのアドレス, 移動するトークンの量);
```

例えば, アカウント A が TokenX を所有していて, アカウント B が A の持つ TokenX を 30 だけ移動する許可を与えたいとします。
そのためには, A はこのようにして TokenX の `approve` を呼び出します。

```
TokenX.approve(Bのアドレス, 30);
```

すると, B は TokenX の `transferFrom` を呼び出すことで A の持つ TokenX を自身に移動することができます。

```
TokenX.transferFrom(Aのアドレス, Bのアドレス, 30);
```

この `approve`, `transferFrom` の一連の流れを経て B は A の持つトークンを自身へ移動することができました。
`approve` なしに `transferFrom` が使えてしまうと, B は好き勝手に A の持つトークンを移動できてしまうのでトークンの機能として成り立ちません。

`AMMコントラクト` の `provide` 関数内では `transferFrom` を使用していますが, これは流動性提供者が `provide` を呼び出す前に
各トークンの `approve` の実行を済ませていることが前提です。
`approve` が行われていない場合は `transferFrom` の呼び出しは失敗します。

📓 `approve`/`transferFrom` を使う理由

上記の話は, トークンを直接 `AMMコントラクト` へ送信(`transfer`を使用)してから, `provide` を呼び出すという流れでも成立しそうですが
なぜ `approve`/`transferFrom` を使用するのかについても考えてみます。

トークンを直接 `AMMコントラクト` へ送信してから`provide` を呼び出す場合は以下のような流れになります。

1. A はトークンコントラクトの `transfer` を呼び出して, AMM へトークンを送信する
2. A は AMM コントラクトの `provide` を呼び出して流動性を提供する
   - AMM はプールの状態を確認しシェア算出などの処理をする
   - シェアなどの状態変数を変更する

この 1 と 2 を独立した処理として順番に実行したとすると, 以下の問題が起きます。

- 1 と 2 の処理の合間にプールの状態が変更する可能性がある
- 2 のトランザクションが何らかの理由で失敗すると, 1 の返金処理をする必要がある
- AMM から見て, 1 が A から流動性提供で実行されたものだということがわからない

つまり, 1 と 2 は同時に行う必要があります。

ここで transferFrom と approve の出番です。

実際に行う処理の流れを整理します。

1.  A はトークンコントラクトの `approve` を呼び出すことで, AMM コントラクトがトークンを移動することを許可する
2.  A は AMM コントラクトの `provide` を呼び出して流動性を提供する
    - AMM はプールの状態を確認しシェア算出などの処理をする
    - AMM は流動性提供者からトークンを自身へ移動
    - シェアなどの状態変数を変更する

後に実装する swap の際にも, 同じような理由で
トークンの送受信と AMM コントラクト内での処理(レートの計算など)を同じトランザクションで行いたいので `approve`/`transferFrom` を使用します。

### 🧪 テストを追加しましょう

追加した機能に対するテストを追加しましょう。
`test/AMM.ts` ファイル内の `init` テストを以下のように `provide` テストに書き換えてください。

- 変更すると環境によって赤の波線が表示される箇所があるかもしれませんが、テストを実行すると消えますので、一旦気にせず進めてください。

```ts
describe("provide", function () {
  it("Token should be moved", async function () {
    const { amm, token0, token1, owner } = await loadFixture(deployContract);

    const ownerBalance0Before = await token0.balanceOf(owner.address);
    const ownerBalance1Before = await token1.balanceOf(owner.address);

    const ammBalance0Before = await token0.balanceOf(amm.address);
    const ammBalance1Before = await token1.balanceOf(amm.address);

    // 今回使用する2つのトークンはETHと同じ単位を使用するとしているので,
    // 100 ether (= 100 * 10^18) 分をprovideするという意味です。
    const amountProvide0 = ethers.utils.parseEther("100");
    const amountProvide1 = ethers.utils.parseEther("200");

    await token0.approve(amm.address, amountProvide0);
    await token1.approve(amm.address, amountProvide1);
    await amm.provide(
      token0.address,
      amountProvide0,
      token1.address,
      amountProvide1
    );

    expect(await token0.balanceOf(owner.address)).to.eql(
      ownerBalance0Before.sub(amountProvide0)
    );
    expect(await token1.balanceOf(owner.address)).to.eql(
      ownerBalance1Before.sub(amountProvide1)
    );

    expect(await token0.balanceOf(amm.address)).to.eql(
      ammBalance0Before.add(amountProvide0)
    );
    expect(await token1.balanceOf(amm.address)).to.eql(
      ammBalance1Before.add(amountProvide1)
    );
  });
});
```

`provide` を実行する前後でトークンの移動が正常にされているかをテストしています。

テストの冒頭では `provide` を実行する前の owner や amm の残高, `provide` で預けるトークンの量を変数に格納しています。

次に以下の部分で, `approve` をしてから `provide` を実行しています。

```ts
await token0.approve(amm.address, amountProvide0);
await token1.approve(amm.address, amountProvide1);
await amm.provide(
  token0.address,
  amountProvide0,
  token1.address,
  amountProvide1
);
```

最後に `provide` 後の各残高の確認をしています。

例えば以下の部分では, owner の token0 の残高が
`provide` 実行前の残高(`ownerBalance0Before`)から　`provide` した token0 の量(`amountProvide0`)だけ減っていることを確認しています。

```ts
expect(await token0.balanceOf(owner.address)).to.eql(
  ownerBalance0Before.sub(amountProvide0)
);
```

次に以下のコードを `provide` テストの後に追加してください。

```ts
async function deployContractWithLiquidity() {
  const { amm, token0, token1, owner, otherAccount } = await loadFixture(
    deployContract
  );

  const amountOwnerProvided0 = ethers.utils.parseEther("100");
  const amountOwnerProvided1 = ethers.utils.parseEther("200");

  await token0.approve(amm.address, amountOwnerProvided0);
  await token1.approve(amm.address, amountOwnerProvided1);
  await amm.provide(
    token0.address,
    amountOwnerProvided0,
    token1.address,
    amountOwnerProvided1
  );

  const amountOtherProvided0 = ethers.utils.parseEther("10");
  const amountOtherProvided1 = ethers.utils.parseEther("20");

  await token0.connect(otherAccount).approve(amm.address, amountOtherProvided0);
  await token1.connect(otherAccount).approve(amm.address, amountOtherProvided1);
  await amm
    .connect(otherAccount)
    .provide(
      token0.address,
      amountOtherProvided0,
      token1.address,
      amountOtherProvided1
    );

  return {
    amm,
    token0,
    amountOwnerProvided0,
    amountOtherProvided0,
    token1,
    amountOwnerProvided1,
    amountOtherProvided1,
    owner,
    otherAccount,
  };
}

// deployContractWithLiquidity 後の初期値のチェックをします。
describe("Deploy with liquidity", function () {
  it("Should set the right number of amm details", async function () {
    const {
      amm,
      token0,
      amountOwnerProvided0,
      amountOtherProvided0,
      token1,
      amountOwnerProvided1,
      amountOtherProvided1,
      owner,
      otherAccount,
    } = await loadFixture(deployContractWithLiquidity);

    const precision = await amm.PRECISION();
    const BN100 = BigNumber.from("100"); // ownerのシェア: 最初の流動性提供者なので100
    const BN10 = BigNumber.from("10"); // otherAccountのシェア: ownerに比べて10分の1だけ提供しているので10

    expect(await amm.totalShare()).to.equal(BN100.add(BN10).mul(precision));
    expect(await amm.share(owner.address)).to.equal(BN100.mul(precision));
    expect(await amm.share(otherAccount.address)).to.equal(BN10.mul(precision));
    expect(await amm.totalAmount(token0.address)).to.equal(
      amountOwnerProvided0.add(amountOtherProvided0)
    );
    expect(await amm.totalAmount(token1.address)).to.equal(
      amountOwnerProvided1.add(amountOtherProvided1)
    );
  });
});
```

プールにトークンが存在する状態の AMM をテスト内では流用したいため,
`deployContractWithLiquidity` にて, 各コントラクトのデプロイから amm のプールにトークンが存在する状態までを関数にしています。
仕組みは先ほど行った `provide` と同じですが, owner に加え otherAccount も流動性を提供しています。
各アカウントが提供したトークンの量は関数の返り値に含めています。

その下に続く `Deploy with liquidity` のテストでは,
`deployContractWithLiquidity` を実行後の amm コントラクト内状態変数の初期値を確認しています。

---

📓 PRECISION について

先ほどのテストから抜粋。

```ts
expect(await amm.share(owner.address)).to.equal(BN100.mul(precision));
```

amm から取得した owner のシェアは PRECISION の値だけ大きいので,
100(owner のシェア)に precision をかけた値を比較しています。

---

最後に以下のコードを `Deploy with liquidity` テストの後に追加してください。

```ts
describe("getEquivalentToken", function () {
  it("Should get the right number of equivalent token", async function () {
    const { amm, token0, token1 } = await loadFixture(
      deployContractWithLiquidity
    );

    const totalToken0 = await amm.totalAmount(token0.address);
    const totalToken1 = await amm.totalAmount(token1.address);
    const amountProvide0 = ethers.utils.parseEther("10");
    // totalToken0 : totalToken1 = amountProvide0 : equivalentToken1
    const equivalentToken1 = amountProvide0.mul(totalToken1).div(totalToken0);

    expect(
      await amm.getEquivalentToken(token0.address, amountProvide0)
    ).to.equal(equivalentToken1);
  });
});
```

ここでは `getEquivalentToken` 関数の計算が合っているのかをテストしています。

token0 10ether 分(`amountProvide0`)と同価値の token1 の量(`equivalentToken1`)を関数の返り値と比較して正しいか確かめています。

計算式自体は AMM コントラクトの `getEquivalentToken` 関数の中で行なっているロジックと同じです。

### ⭐ テストを実行しましょう

`contract`ディレクトリ直下で以下のコマンドを実行してください。

```

$ npx hardhat test

```

以下のような表示がされたらテスト成功です！

![](/public/images/AVAX-amm/section-1/1_3_1.png)

### 🌔 参考リンク

> [こちら](https://github.com/unchain-dev/avalanche-amm-dapp)に本プロジェクトの完成形のレポジトリがあります。
>
> コードがうまく動かない場合は参考にしてみてください。
> `contract` はリンク先のレポジトリ内の `package/contract` を。
> `client` はリンク先のレポジトリ内の `package/client` を参照してください。

### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は, Discord の `#avax-amm` で質問をしてください。

ヘルプをするときのフローが円滑になるので, エラーレポートには下記の 3 点を記載してください ✨

```

1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット

```

---

テストが通ったら, 次のレッスンに進んでください 🎉
