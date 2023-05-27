### 🐣 自動実行を実装しましょう

chainlinkの自動化には以下の2つの起動方法があります。

- `Time-based trigger`: あらかじめ指定した時間でコントラクトを実行します。定期実行です。
- `Custom logic trigger`: あらかじめ用意した条件に合致した場合にコントラクトを実行します。

今回は,「有効期限が切れた`farmNft`がないかどうかの確認, あった場合は削除処理をする」ので`Custom logic trigger`を使用します。

### `Custom logic trigger`の実装

ここで行うことは, `Custom logic trigger`に必要な実装を`AssetTokenization`コントラクトに実装します。
そしてchainlinkに`Custom logic trigger`で実行してもらう旨をタスクとして登録します。
このタスクのことを`Upkeep`と呼びます。

`AssetTokenization.sol`の中に以下のimport文を追加し, さらに`AutomationCompatibleInterface`を継承するようにしてください。
※ 継承を記述した時点ではコードエディタにより`AutomationCompatibleInterface`を実装できていない警告が出るかもしれませんが, この時点では無視して構いません。

```solidity
import "@chainlink/contracts/src/v0.8/AutomationCompatible.sol";
```

```solidity
contract AssetTokenization is AutomationCompatibleInterface {
    ...
```

`AutomationCompatibleInterface`はchainlinkが用意したインタフェースで, これを実装することによりUpkeepはどの条件を確認し, 何を実行するのか判別することができます。

次に`AssetTokenization`の最後の行に以下の関数を貼り付けてください。

```solidity
    // For upkeep that chainlink automation function.
    // Check whether there are expired contracts.
    // If checkUpkeep() returns true, chainlink automatically runs performUpkeep() that follows below.
    function checkUpkeep(
        bytes calldata /* optional data. don't use in this code */
    )
        external
        view
        override
        returns (
            bool upkeepNeeded,
            bytes memory /* optional data. return initial value in this code */
        )
    {
        for (uint256 index = 0; index < _farmers.length; index++) {
            address farmer = _farmers[index];
            if (!availableContract(farmer)) {
                continue;
            }
            if (_farmerToNftContract[farmer].isExpired()) {
                return (true, "");
            }
        }
        return (false, "");
    }

    // For chainlink.
    // Burn expired NFT and delete NFT Contract.
    function performUpkeep(
        bytes calldata /* optional data. don't use in this code */
    ) external override {
        for (uint256 index = 0; index < _farmers.length; index++) {
            address farmer = _farmers[index];
            if (!availableContract(farmer)) {
                continue;
            }
            if (_farmerToNftContract[farmer].isExpired()) {
                _farmerToNftContract[farmer].burnNFT();
                delete _farmerToNftContract[farmer];
            }
        }
    }
```

`checkUpkeep`と`performUpkeep`をにより`AutomationCompatibleInterface`を実装することができました。

`checkUpkeep`は条件に合致したかどうかの論理値を返却します。
今回は期限切れの`farmNft`があるかどうかを条件とし, ある場合は`true`を返却します。

`performUpkeep`は`checkUpkeep`が`true`を返却した場合に何を実行するのかを記述します。
今回は期限切れの`farmNft`に対して`burnNFT`を実行し, マッピングからdeleteします。

### 🧪 テストを追加しましょう

`AssetTokenization.ts`のimport文のところにtimeを追加してください。

```ts
import { time, loadFixture } from '@nomicfoundation/hardhat-network-helpers';
```

次に、テストの最後の行に以下のコードを貼り付けてください。
※ この時点ではコードエディタにより実装していない関数を実行しているという警告が出るかもしれませんが無視して構いません。

```ts
describe('upkeep', function () {
  it('checkUpkeep and performUpkeep', async function () {
    const { userAccounts, assetTokenization } = await loadFixture(
      deployContract,
    );

    // 定数用意
    const farmer = userAccounts[0];
    const farmerName = 'farmer';
    const description = 'description';
    const totalMint = BigNumber.from(5);
    const price = BigNumber.from(100);
    const expirationDate = BigNumber.from(Date.now())
      .div(1000) // in second
      .add(oneWeekInSecond); // one week later

    // nftコントラクトをデプロイ
    await assetTokenization
      .connect(farmer)
      .generateNftContract(
        farmerName,
        description,
        totalMint,
        price,
        expirationDate,
      );

    const [return1] = await assetTokenization.checkUpkeep('0x00');

    // この時点では期限切れのnftコントラクトがないのでfalse
    expect(return1).to.equal(false);

    // ブロックチェーンのタイムスタンプを変更(期限の1s後のタイムスタンプを含んだブロックを生成)し, nftコントラクトの期限が切れるようにします。
    await time.increaseTo(expirationDate.add(1));

    const [return2] = await assetTokenization.checkUpkeep('0x00');

    // 期限切れのnftコントラクトがあるのでtrue
    expect(return2).to.equal(true);

    await assetTokenization.performUpkeep('0x00');

    // 期限切れのnftコントラクトの情報は取得できない
    await expect(assetTokenization.getNftContractDetails(farmer.address)).to.be
      .reverted;
  });
});
```

新しく実装した`checkUpkeep`と`performUpkeep`について正しく動作しているかを確認しています。

### ⭐ テストを実行しましょう

`packages/contract`ディレクトリ直下で以下のコマンドを実行してください。

⚠️ 追加したテストコードではテストヘルパーパッケージのtimeを使用しています。
timeの使用はテスト環境全体の時間に影響するため, 複数のテストファイルを同時にテストすると予期せぬ挙動を起こす場合があります。よって以下のコマンドではテストをする対象ファイルを引数によって指定しています。

```
$ npx hardhat test test/AssetTokenization.ts
```

以下のような表示がされたらテスト成功です！

![](/public/images/AVAX-Asset-Tokenization/section-3/2_1_12.png)

### 🌔 参考リンク

> [こちら](https://github.com/unchain-dev/AVAX-Asset-Tokenization)に本プロジェクトの完成形のレポジトリがあります。
> 期待通り動かない場合は参考にしてみてください。

### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は,Discordの`#avax-asset-tokenization`で質問をしてください。

ヘルプをするときのフローが円滑になるので,エラーレポートには下記の3点を記載してください ✨

```
1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット
```

次のレッスンで今回作成した関数を自動実行する設定とその挙動を確認します！ 🔥
