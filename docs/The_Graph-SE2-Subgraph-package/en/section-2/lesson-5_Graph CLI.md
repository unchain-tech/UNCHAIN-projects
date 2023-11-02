## Graph CLI

###  ✅ Install the Graph CLI 

You can install the Graph CLI globally using the following command.

```
yarn global add @graphprotocol/graph-cli
```

#### ✅ Init your Subgraph 

This can be done in a separate folder of your choosing, since it will initiate a yarn package. You will need to fill in the required configuration during the initialization process.The Start Block - Can be found on Etherescan if needed so you don't have to index the entire previous blocks.

```
graph init --studio name_of_your_subgraph
```

It should looks something like this...

```
✔ Protocol · ethereum
✔ Subgraph slug · sendmessage
✔ Directory to create the subgraph in · sendmessage
✔ Ethereum network · sepolia
✔ Contract address · 0x541D469C06990B7F0bd5103b57997cE8a39C050c
✔ Fetching ABI from Etherscan
✖ Failed to fetch Start Block: Failed to fetch contract creation transaction hash
  
✔ Start Block · 4089059
✔ Contract Name · Contract
✔ Index contract events as entities (Y/n) · true
  Generate subgraph
  Write subgraph to directory
✔ Create subgraph scaffold
✔ Initialize networks config
✔ Initialize subgraph repository
✔ Install dependencies with yarn
✔ Generate ABI and schema types with yarn codegen
Add another contract? (y/n): 
Subgraph sendmessage created in sendmessage
```

#### ✅ Authenticate to Studio

Grab your authentication string from Auth & Deploy on Subgraph Studio.

```
graph auth --studio auth_key_here
```

Success looks like this:

```
Deploy key set for https://api.studio.thegraph.com/deploy/
```

#### ✅ Run codegen and build your subgraph 

You will need to change into the directory where the subgraph was created in the previous step.

```
cd sendmessage
graph codegen && graph build
```

Success will look something like the following!

```
✔ Apply migrations
✔ Load subgraph from subgraph.yaml
  Load contract ABI from abis/Contract.json
✔ Load contract ABIs
  Generate types for contract ABI: Contract (abis/Contract.json)
  Write types to generated/Contract/Contract.ts
✔ Generate types for contract ABIs
✔ Generate types for data source templates
✔ Load data source template ABIs
✔ Generate types for data source template ABIs
✔ Load GraphQL schema from schema.graphql
  Write types to generated/schema.ts
✔ Generate types for GraphQL schema

Types generated successfully

  Skip migration: Bump mapping apiVersion from 0.0.1 to 0.0.2
  Skip migration: Bump mapping apiVersion from 0.0.2 to 0.0.3
  Skip migration: Bump mapping apiVersion from 0.0.3 to 0.0.4
  Skip migration: Bump mapping apiVersion from 0.0.4 to 0.0.5
  Skip migration: Bump mapping apiVersion from 0.0.5 to 0.0.6
  Skip migration: Bump manifest specVersion from 0.0.1 to 0.0.2
  Skip migration: Bump manifest specVersion from 0.0.2 to 0.0.4
✔ Apply migrations
✔ Load subgraph from subgraph.yaml
  Compile data source: Contract => build/Contract/Contract.wasm
✔ Compile subgraph
  Copy schema file build/schema.graphql
  Write subgraph file build/Contract/abis/Contract.json
  Write subgraph manifest build/subgraph.yaml
✔ Write compiled subgraph to build/

Build completed: build/subgraph.yaml

```

#### ✅ Deploy

Now we are ready to deploy to the Studio

```
graph deploy --studio name_of_your_subgraph
```

Choose a version and fire away!

```
Which version label to use? (e.g. "v0.0.1"): 0.0.1
  Skip migration: Bump mapping apiVersion from 0.0.1 to 0.0.2
  Skip migration: Bump mapping apiVersion from 0.0.2 to 0.0.3
  Skip migration: Bump mapping apiVersion from 0.0.3 to 0.0.4
  Skip migration: Bump mapping apiVersion from 0.0.4 to 0.0.5
  Skip migration: Bump mapping apiVersion from 0.0.5 to 0.0.6
  Skip migration: Bump manifest specVersion from 0.0.1 to 0.0.2
  Skip migration: Bump manifest specVersion from 0.0.2 to 0.0.4
✔ Apply migrations
✔ Load subgraph from subgraph.yaml
  Compile data source: Contract => build/Contract/Contract.wasm
✔ Compile subgraph
  Copy schema file build/schema.graphql
  Write subgraph file build/Contract/abis/Contract.json
  Write subgraph manifest build/subgraph.yaml
✔ Write compiled subgraph to build/
  Add file to IPFS build/schema.graphql
                .. QmTLSV6vUwnPYyi9oqMJ3Ds3TkgE1A8PEaYa5yhbd3y73b
  Add file to IPFS build/Contract/abis/Contract.json
                .. QmT5j3kGMkVjUVaW8MhMKRSnZXdTDrTSUcf5MC9hFKNHYf
  Add file to IPFS build/Contract/Contract.wasm
                .. QmeuaTgxLJKp8N2R2RCiQFvJa1fPz81tytc4xECBoRCpjv
✔ Upload subgraph to IPFS

Build completed: QmUqgKBRWxFGNG6oPZuZxuCwJbEvKe6UbKCe8WTcDJvusk
```

#### ✅ Send a transaction and verify in Subgraph Playground 

On Etherscan you can send a transaction directly to your contract on the Contract -> Write Contract tab.

Our Query:

```
{
  sendMessages(first: 5) {
    id
    _from
    _to
    message
  }
}
```

Our data object response: 

```
{
  "data": {
    "sendMessages": [
      {
        "id": "0x053e32f85f9f485334119585abfc73e507a4ce86e968130b90410df70eb3a66e71000000",
        "_from": "0x142cd5d7ac1ea8919f1644af1870792b9f77d44a",
        "_to": "0x007e483cf6df009db5ec571270b454764d954d95",
        "message": "I love you"
      }
    ]
  }
}
```

