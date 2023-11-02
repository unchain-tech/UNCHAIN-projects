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

This will spin up all the containers for The Graph using docker-compose. You will want to keep this window open at all times so that you can see log output from Docker.

> As stated before, be sure to keep this window open so that you can see any log output from Docker. 🔎