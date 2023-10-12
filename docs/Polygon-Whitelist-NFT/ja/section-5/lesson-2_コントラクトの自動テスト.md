### ✅ 自動テストを作成する

コントラクトの自動テストを作成しましょう。これは、コントラクトが期待する動作をしているかを確認するためのものです。

packages/contract/testフォルダを更新しましょう。`Lock.ts`を削除し、`Whitelist.test.ts`と`Shield.test.ts`を作成します。

![](/public/images/Polygon-Whitelist-NFT/section-5/5_2_1.png)

作成したファイルに、テストを記述しましょう。

`Whitelist.test.ts`：

```typescript
import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { expect } from 'chai';
import { ethers } from 'hardhat';

describe('Whitelist', function () {
  // すべてのテストで同じセットアップを再利用するために、フィクスチャを定義します。
  // loadFixture を使ってこのセットアップを一度実行し、その状態をスナップショットします。
  // そして、すべてのテストで Hardhat Network をそのスナップショットにリセットします。
  async function deployWhitelistFixture() {
    // コントラクトは、デフォルトで最初のsigner/accountを使用してデプロイされます。
    const [owner, alice, bob] = await ethers.getSigners();

    const whitelistFactory = await ethers.getContractFactory('Whitelist');
    const whitelist = await whitelistFactory.deploy([
      owner.address,
      alice.address,
    ]);

    return { whitelist, owner, alice, bob };
  }

  // テストケース
  describe('addToWhitelist', function () {
    context('when user is not owner', function () {
      it('reverts', async function () {
        // 準備
        const { whitelist, alice, bob } = await loadFixture(
          deployWhitelistFixture,
        );

        // 実行と検証
        // コントラクトのオーナーではないアカウントがaddToWhitelist関数を実行しようとすると、エラーとなることを確認します。
        await expect(
          whitelist.connect(alice).addToWhitelist(bob.address),
        ).to.be.revertedWith('Caller is not the owner');
      });
    });
    context('when address is already added', function () {
      it('reverts', async function () {
        const { whitelist, alice } = await loadFixture(deployWhitelistFixture);

        // 既にホワイトリストに追加されているaliceを追加しようとすると、エラーとなることを確認します。
        await expect(
          whitelist.addToWhitelist(alice.address),
        ).to.be.revertedWith('Address already whitelisted');
      });
    });
    context('when adding a new address', function () {
      it('emit a AddToWhitelist event', async function () {
        const { whitelist, bob } = await loadFixture(deployWhitelistFixture);

        // AddToWhitelistイベントが発生することを確認します。
        await expect(whitelist.addToWhitelist(bob.address))
          .to.emit(whitelist, 'AddToWhitelist')
          .withArgs(bob.address);
      });
    });
  });

  describe('removeFromWhitelist', function () {
    context('when user is not owner', function () {
      it('reverts', async function () {
        const { whitelist, alice, bob } = await loadFixture(
          deployWhitelistFixture,
        );

        // コントラクトのオーナーではないアカウントが、removeFromWhitelist関数を実行しようとすると、エラーとなることを確認します。
        await expect(
          whitelist.connect(alice).removeFromWhitelist(bob.address),
        ).to.be.revertedWith('Caller is not the owner');
      });
    });
    context('when an address is not in whitelist', function () {
      it('reverts', async function () {
        const { whitelist, bob } = await loadFixture(deployWhitelistFixture);

        // ホワイトリストに存在しないbobを削除しようとすると、エラーとなることを確認します。
        await expect(
          whitelist.removeFromWhitelist(bob.address),
        ).to.be.revertedWith('Address not in whitelist');
      });
    });
    context('when removing an address', function () {
      it('emit a RemoveFromWhitelist event', async function () {
        const { whitelist, alice } = await loadFixture(deployWhitelistFixture);

        // RemoveFromWhitelistイベントが発生することを確認します。
        await expect(whitelist.removeFromWhitelist(alice.address))
          .to.emit(whitelist, 'RemoveFromWhitelist')
          .withArgs(alice.address);
      });
    });
  });

  describe('whitelistedAddresses', function () {
    context('when an address is not in whitelist', function () {
      it('returns false', async function () {
        const { whitelist, bob } = await loadFixture(deployWhitelistFixture);

        // ホワイトリストに存在しないbobを指定すると、falseが返されることを確認します。
        expect(await whitelist.whitelistedAddresses(bob.address)).to.be.false;
      });
    });
    context('when an address is in whitelist', function () {
      it('returns true', async function () {
        const { whitelist, alice } = await loadFixture(deployWhitelistFixture);

        // ホワイトリストに存在するaliceを指定すると、trueが返されることを確認します。
        expect(await whitelist.whitelistedAddresses(alice.address)).to.be.true;
      });
    });
  });
});

```

`Shield.test.ts`：

```typescript
import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { expect } from 'chai';
import { ethers } from 'hardhat';

describe('Shield', function () {
  async function deployWhitelistFixture() {
    const dummyBaseURI = 'ipfs://dummyBaseURI';

    const [owner, alice, bob] = await ethers.getSigners();

    const whitelistFactory = await ethers.getContractFactory('Whitelist');
    const whitelist = await whitelistFactory.deploy([
      owner.address,
      alice.address,
    ]);
    const shieldFactory = await ethers.getContractFactory('Shield');
    const shield = await shieldFactory.deploy(dummyBaseURI, whitelist.address);

    // Shieldコントラクトからpublic変数を取得します。
    const price = await shield.price();
    const maxTokenIds = await shield.maxTokenIds();

    return { shield, price, maxTokenIds, owner, alice, bob };
  }

  describe('setPaused', function () {
    context('when user is not owner', function () {
      it('reverts', async function () {
        const { shield, alice } = await loadFixture(deployWhitelistFixture);

        // コントラクトのオーナーではないアカウントが、setPaused関数を実行しようとするとエラーとなることを確認します。
        await expect(shield.connect(alice).setPaused(true))
          .to.be.revertedWithCustomError(shield, 'OwnableUnauthorizedAccount')
          .withArgs(alice.address);
      });
    });
    context('when set to true', function () {
      it('paused variable is true', async function () {
        const { shield } = await loadFixture(deployWhitelistFixture);

        // 実行
        await shield.setPaused(true);

        // 検証
        // paused変数がtrueになることを確認します。
        expect(await shield.paused()).to.equal(true);
      });
    });
    context('when set to false', function () {
      it('paused variable is false', async function () {
        const { shield } = await loadFixture(deployWhitelistFixture);
        // booleanの初期値はfalseなので、一度trueにします。
        await shield.setPaused(true);

        await shield.setPaused(false);

        // paused変数がfalseになることを確認します。
        expect(await shield.paused()).to.equal(false);
      });
    });
  });

  describe('mint', function () {
    context('when paused is true', function () {
      it('reverts', async function () {
        const { shield, alice, price } = await loadFixture(
          deployWhitelistFixture,
        );
        await shield.setPaused(true);

        // paused変数がtrueの場合、mint関数を実行するとエラーとなることを確認します。
        await expect(
          shield.connect(alice).mint({ value: price }),
        ).to.be.revertedWith('Contract currently paused');
      });
    });
    context('when user is not in whitelist', function () {
      it('reverts', async function () {
        const { shield, bob, price } = await loadFixture(
          deployWhitelistFixture,
        );

        // ホワイトリストに存在しないbobがmint関数を実行するとエラーとなることを確認します。
        await expect(
          shield.connect(bob).mint({ value: price }),
        ).to.be.revertedWith('You are not whitelisted');
      });
    });
    context(
      'when the number of maxTokenIds has already been minted',
      function () {
        it('reverts', async function () {
          const { shield, price, maxTokenIds } = await loadFixture(
            deployWhitelistFixture,
          );
          // maxTokenIdsの数だけmint関数を実行します。
          for (let id = 0; id < maxTokenIds; id++) {
            await shield.mint({ value: price });
          }

          // maxTokenIdsの数を超えてmint関数を実行するとエラーとなることを確認します。
          await expect(shield.mint({ value: price })).to.be.revertedWith(
            'Exceeded maximum Shields supply',
          );
        });
      },
    );
    context('when msg.value is less than price', function () {
      it('reverts', async function () {
        const { shield, alice } = await loadFixture(deployWhitelistFixture);

        // mint関数を実行する際にmsg.valueがpriceより少ない場合、エラーとなることを確認します。
        await expect(
          shield.connect(alice).mint({ value: 0 }),
        ).to.be.revertedWith('Ether sent is not correct');
      });
    });
    context('when mint is successful', function () {
      it('Shield balance increases', async function () {
        const { shield, price } = await loadFixture(deployWhitelistFixture);
        // 現在のShieldコントラクトの残高を取得します。
        const shieldBalance = ethers.utils.formatEther(
          await ethers.provider.getBalance(shield.address),
        );
        // mint関数実行後に期待されるShieldコントラクトの残高を計算します。
        const expectedShieldBalance =
          parseFloat(shieldBalance) +
          parseFloat(ethers.utils.formatEther(price));

        await shield.mint({ value: price });

        // mint関数実行後のShieldコントラクトの残高を取得します。
        const shieldBalanceAfterMint = ethers.utils.formatEther(
          await ethers.provider.getBalance(shield.address),
        );

        // mint関数実行後のShieldコントラクトの残高が、期待する値と一致することを確認します。
        expect(parseFloat(shieldBalanceAfterMint)).to.equal(
          expectedShieldBalance,
        );
      });
    });
  });

  describe('withdraw', function () {
    context('when user is not owner', function () {
      it('reverts', async function () {
        const { shield, alice } = await loadFixture(deployWhitelistFixture);

        // コントラクトのオーナーではないアカウントが、withdraw関数を実行しようとするとエラーとなることを確認します。
        await expect(shield.connect(alice).withdraw())
          .to.be.revertedWithCustomError(shield, 'OwnableUnauthorizedAccount')
          .withArgs(alice.address);
      });
    });
    context('when owner executes', function () {
      it("owner's balance increases", async function () {
        const { shield, price, owner, alice } = await loadFixture(
          deployWhitelistFixture,
        );

        await shield.connect(alice).mint({ value: price });

        // 現在のownerの残高を取得します。
        const ownerBalanceBeforeWithdraw = await owner.getBalance();

        // トランザクションの実行にかかったガス代を計算します。
        const tx = await shield.withdraw();
        const receipt = await tx.wait();
        const txCost = receipt.gasUsed.mul(tx.gasPrice);

        // withdraw関数実行後に期待されるownerの残高を計算します。
        const expectedOwnerBalance = ownerBalanceBeforeWithdraw
          .add(price)
          .sub(txCost);

        // withdraw関数実行後のownerの残高を取得します。
        const ownerBalanceAfterWithdraw = await owner.getBalance();

        // withdraw関数実行後のownerの残高が、期待する値と一致することを確認します。
        expect(ownerBalanceAfterWithdraw).to.equal(expectedOwnerBalance);
      });
    });
  });
});

```

Whitelistコントラクトのテストを例に、コードを確認しましょう。テストの内容は、コントラクトの各関数が期待する動作を行うかどうかを確認しています。requireが設定されている関数には、エラーが発生すべき条件下ではきちんとエラーが発生するかも確認しています。テストの構成は、準備・実行・検証の3つのセクションに分かれています。

準備のセクションでは、テストを実行するために必要な状態を作成します。ここでは、Whitelistコントラクトをデプロイし、ownerとaliceのアドレスをホワイトリストに追加しています。

```typescript
describe('Whitelist', function () {
  // すべてのテストで同じセットアップを再利用するために、フィクスチャを定義します。
  // loadFixture を使ってこのセットアップを一度実行し、その状態をスナップショットします。
  // そして、すべてのテストで Hardhat Network をそのスナップショットにリセットします。
  async function deployWhitelistFixture() {
    // コントラクトは、デフォルトで最初のsigner/accountを使用してデプロイされます。
    const [owner, alice, bob] = await ethers.getSigners();

    const whitelistFactory = await ethers.getContractFactory('Whitelist');
    const whitelist = await whitelistFactory.deploy([
      owner.address,
      alice.address,
    ]);

    return { whitelist, owner, alice, bob };
  }

  // テストケース
  describe('addToWhitelist', function () {
    context('when user is not owner', function () {
      it('reverts', async function () {
        // 準備
        const { whitelist, alice, bob } = await loadFixture(
          deployWhitelistFixture,
        );

        ...
```

実行・検証のセクションでは、実際にテスト対象の関数を実行し、期待する結果が得られるかどうかを確認します。

```typescript
        // 実行と検証
        // コントラクトのオーナーではないアカウントがaddToWhitelist関数を実行しようとすると、エラーとなることを確認します。
        await expect(
          whitelist.connect(alice).addToWhitelist(bob.address),
        ).to.be.revertedWith('Caller is not the owner');
      });
    });
```

そのほかのテストに関しては、コメントを参照しながらどのようなテストを行っているかを確認してみてください！

それではテストを実行してみましょう。下記のコマンドをプロジェクトのルートで実行します。

```
yarn test
```

全てのテストにパスしたら完了です！

### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discordの`#polygon`で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の4点を記載してください ✨

```
1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット
```