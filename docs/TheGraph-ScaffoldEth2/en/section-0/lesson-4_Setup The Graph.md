## Setup The Graph (Docker)

### 🚀 Setup The Graph Integration

Now that we have spun up our blockchain, started our frontend application and deployed our smart contract, we can start setting up our subgraph and utilize The Graph!

First run the following to clean up any old data. Do this if you need to reset everything.

```
yarn clean-node
```

> We can now spin up a graph node by running the following command… 🧑‍🚀

```
yarn run-node
```

![](/public/images/TheGraph-ScaffoldEth2/section-0/0_4_1.png)

This will spin up all the containers for The Graph using docker-compose. You will know this is complete when it reads "Downloading latest blocks from Ethereum..."

> As stated before, be sure to keep this window open so that you can see any log output from Docker. 🔎
