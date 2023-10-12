### ✅ Create an automated test

Create an automated test for your contract. This is to verify that the contract is behaving as expected.

Update your packages/contract/test folder. Delete `Lock.ts` and create `Whitelist.test.ts` and `Shield.test.ts`.

![](/public/images/Polygon-Whitelist-NFT/section-5/5_2_1.png)

Write your test in the file you have created.

`Whitelist.test.ts`：

```typescript
import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { expect } from 'chai';
import { ethers } from 'hardhat';

describe('Whitelist', function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployWhitelistFixture() {
    // Contracts are deployed using the first signer/account by default.
    const [owner, alice, bob] = await ethers.getSigners();

    const whitelistFactory = await ethers.getContractFactory('Whitelist');
    const whitelist = await whitelistFactory.deploy([
      owner.address,
      alice.address,
    ]);

    return { whitelist, owner, alice, bob };
  }

  // Test case
  describe('addToWhitelist', function () {
    context('when user is not owner', function () {
      it('reverts', async function () {
        // Setup
        const { whitelist, alice, bob } = await loadFixture(
          deployWhitelistFixture,
        );

        // Execution and Verification
        // Verify that if an account that is not the owner of the contract tries to execute the addToWhitelist function, it will result in an error.
        await expect(
          whitelist.connect(alice).addToWhitelist(bob.address),
        ).to.be.revertedWith('Caller is not the owner');
      });
    });
    context('when address is already added', function () {
      it('reverts', async function () {
        const { whitelist, alice } = await loadFixture(deployWhitelistFixture);

        // Verify that attempting to add an alice that has already been added to the whitelist will result in an error.
        await expect(
          whitelist.addToWhitelist(alice.address),
        ).to.be.revertedWith('Address already whitelisted');
      });
    });
    context('when adding a new address', function () {
      it('emit a AddToWhitelist event', async function () {
        const { whitelist, bob } = await loadFixture(deployWhitelistFixture);

        // Verify that the AddToWhitelist event is emitted.
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

        // Verify that if an account that is not the owner of the contract tries to execute the removeFromWhitelist function, it will result in an error.
        await expect(
          whitelist.connect(alice).removeFromWhitelist(bob.address),
        ).to.be.revertedWith('Caller is not the owner');
      });
    });
    context('when an address is not in whitelist', function () {
      it('reverts', async function () {
        const { whitelist, bob } = await loadFixture(deployWhitelistFixture);

        // Verify that any attempt to delete a bob that does not exist in the whitelist will result in an error.
        await expect(
          whitelist.removeFromWhitelist(bob.address),
        ).to.be.revertedWith('Address not in whitelist');
      });
    });
    context('when removing an address', function () {
      it('emit a RemoveFromWhitelist event', async function () {
        const { whitelist, alice } = await loadFixture(deployWhitelistFixture);

        // Verify that the RemoveFromWhitelist event is emitted.
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

        // Verify that a bob that does not exist in the whitelist will return false.
        expect(await whitelist.whitelistedAddresses(bob.address)).to.be.false;
      });
    });
    context('when an address is in whitelist', function () {
      it('returns true', async function () {
        const { whitelist, alice } = await loadFixture(deployWhitelistFixture);

        // Verify that given an alice that exists in the whitelist, true is returned.
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

    // Get public variables from the Shield contract.
    const price = await shield.price();
    const maxTokenIds = await shield.maxTokenIds();

    return { shield, price, maxTokenIds, owner, alice, bob };
  }

  describe('setPaused', function () {
    context('when user is not owner', function () {
      it('reverts', async function () {
        const { shield, alice } = await loadFixture(deployWhitelistFixture);

        // Verify that an account that is not the owner of the contract will get an error if it tries to execute the setPaused function.
        await expect(shield.connect(alice).setPaused(true))
          .to.be.revertedWithCustomError(shield, 'OwnableUnauthorizedAccount')
          .withArgs(alice.address);
      });
    });
    context('when set to true', function () {
      it('paused variable is true', async function () {
        const { shield } = await loadFixture(deployWhitelistFixture);

        // Execution
        await shield.setPaused(true);

        // Verification
        // Verify that the paused variable is set to true.
        expect(await shield.paused()).to.equal(true);
      });
    });
    context('when set to false', function () {
      it('paused variable is false', async function () {
        const { shield } = await loadFixture(deployWhitelistFixture);
        // The initial value of boolean is false, so set it to true once.
        await shield.setPaused(true);

        await shield.setPaused(false);

        // Verify that the paused variable is false.
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

        // Verify that if the paused variable is true, executing the mint function will result in an error.
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

        // Verify that a bob that does not exist in the whitelist causes an error when the mint function is executed.
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
          // Execute as many mint functions as maxTokenIds.
          for (let id = 0; id < maxTokenIds; id++) {
            await shield.mint({ value: price });
          }

          // Verify that executing the mint function beyond the number of maxTokenIds results in an error.
          await expect(shield.mint({ value: price })).to.be.revertedWith(
            'Exceeded maximum Shields supply',
          );
        });
      },
    );
    context('when msg.value is less than price', function () {
      it('reverts', async function () {
        const { shield, alice } = await loadFixture(deployWhitelistFixture);

        // Verify that when executing the mint function, an error occurs if msg.value is less than price.
        await expect(
          shield.connect(alice).mint({ value: 0 }),
        ).to.be.revertedWith('Ether sent is not correct');
      });
    });
    context('when mint is successful', function () {
      it('Shield balance increases', async function () {
        const { shield, price } = await loadFixture(deployWhitelistFixture);
        // Get the current Shield contract balance.
        const shieldBalance = ethers.utils.formatEther(
          await ethers.provider.getBalance(shield.address),
        );
        // Calculates the expected Shield contract balance after the mint function is executed.
        const expectedShieldBalance =
          parseFloat(shieldBalance) +
          parseFloat(ethers.utils.formatEther(price));

        await shield.mint({ value: price });

        // Get the balance of the Shield contract after the mint function is executed.
        const shieldBalanceAfterMint = ethers.utils.formatEther(
          await ethers.provider.getBalance(shield.address),
        );

        // Verify that the balance of the Shield contract after the mint function is executed matches the expected value.
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

        // Verify that an error occurs when an account that is not the owner of the contract tries to execute the withdraw function.
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

        // Get the current balance of the owner.
        const ownerBalanceBeforeWithdraw = await owner.getBalance();

        // Calculate the gas cost of executing the transaction.
        const tx = await shield.withdraw();
        const receipt = await tx.wait();
        const txCost = receipt.gasUsed.mul(tx.gasPrice);

        // Calculates the expected balance of the owner after execution of the withdraw function.
        const expectedOwnerBalance = ownerBalanceBeforeWithdraw
          .add(price)
          .sub(txCost);

        // Get the balance of the OWNER after the WITHDRAW function is executed.
        const ownerBalanceAfterWithdraw = await owner.getBalance();

        // Verify that the balance of the owner after executing the withdraw function matches the expected value.
        expect(ownerBalanceAfterWithdraw).to.equal(expectedOwnerBalance);
      });
    });
  });
});

```

Let's review the code using the Whitelist contract test as an example. The test is to verify that each function in the contract performs as expected, and that any function with a require condition will generate an error when it should. The test is organized into three sections: preparation, execution, and verification.

The preparation section creates the conditions necessary to run the test. Here we deploy the Whitelist contract and add the owner and alice addresses to the whitelist.

```typescript
describe('Whitelist', function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployWhitelistFixture() {
    // Contracts are deployed using the first signer/account by default.
    const [owner, alice, bob] = await ethers.getSigners();

    const whitelistFactory = await ethers.getContractFactory('Whitelist');
    const whitelist = await whitelistFactory.deploy([
      owner.address,
      alice.address,
    ]);

    return { whitelist, owner, alice, bob };
  }

  // Test case
  describe('addToWhitelist', function () {
    context('when user is not owner', function () {
      it('reverts', async function () {
        // Setup
        const { whitelist, alice, bob } = await loadFixture(
          deployWhitelistFixture,
        );

        ...
```

In the Execution and Verification section, the function under test is actually executed to see if the expected results are returned.

```typescript
        // Execution and Verification
        // Verify that if an account that is not the owner of the contract tries to execute the addToWhitelist function, it will result in an error.
        await expect(
          whitelist.connect(alice).addToWhitelist(bob.address),
        ).to.be.revertedWith('Caller is not the owner');
      });
    });
```

As for the other tests, please refer to the comments to see what tests are being performed!

Now let's run the tests. Run the following command in the root of your project.

```
yarn test
```

If all tests pass, you are done!

### 🙋‍♂️ Asking Questions

If you have any uncertainties or issues with the work done so far, please ask in the `#polygon` channel on Discord.

To streamline the assistance process, kindly include the following 4 points in your error report ✨:

```
1. Section and lesson number related to the question
2. What you were trying to do
3. Copy & paste the error message
4. Screenshot of the error screen
```