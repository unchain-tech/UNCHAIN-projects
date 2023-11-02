## Adding an event

### 🧑🏼‍💻 Adding more events / Subgraph updates 👩🏽‍💻

Now we want to start making some changes to our contract. We will create a new function and a new event for that function.

#### ✅ Add an event to our contract

> Open up YourContract.sol under packages/hardhat/contracts

Add the following new code.

```
    event SendMessage(address _from, address _to, string message);

    function sendMessage(address _to, string calldata message) external {
        emit SendMessage(msg.sender, _to, message);
    }
```

We can save our contract and then deploy those new changes.

```
yarn deploy --reset
```

#### ✅ Test your new function

Navigate over to http://localhost:3000/debug and send vitalik.eth a message. 
