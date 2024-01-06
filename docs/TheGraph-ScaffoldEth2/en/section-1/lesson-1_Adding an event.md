## Adding an event

### 🧑🏼‍💻 Adding more events / Subgraph updates 👩🏽‍💻

Now we want to start making some changes to our contract. We will create a new function and a new event for that function.

#### ✅ Add an event to our contract

> Open up YourContract.sol under packages/hardhat/contracts

Add the following new line of code.

```
    event SendMessage(address _from, address _to, string message);

    function sendMessage(address _to, string calldata message) external {
        emit SendMessage(msg.sender, _to, message);
    }
```

You can drop this event and function anywhere inside the contract, but best practice is to drop it below any modifiers or the constructor.

![](/public/images/TheGraph-ScaffoldEth2/section-1/1_1_1.png)

We can save our contract and then deploy those new changes.

> Pro tip, if you use the --reset flag you will ALWAYS get a fresh contract deployed, regardless of any updates to the source.

```
yarn deploy --reset
```

You should see the following output:

![](/public/images/TheGraph-ScaffoldEth2/section-1/1_1_2.png)

#### ✅ Test your new function

Navigate over to http://localhost:3000/debug and send vitalik.eth a message.

![](/public/images/TheGraph-ScaffoldEth2/section-1/1_1_3.png)
