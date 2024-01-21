## Updating your subgraph

### ✅ Update the GraphQL schema

After you add an event to your smart contract, you will need to first update the GraphQL schema to include the entities you want to store on your Graph node. If you want to catch up on entities [here](https://thegraph.com/docs/en/developing/creating-a-subgraph/#defining-entities) is a good link to the docs for that.

In the code below we will update the existing schema to a new naming convention that matches the event name.

> The schema file is located in packages/subgraph/src/schema.graphql

```
type GreetingChange @entity(immutable: true) {
  id: Bytes!
  greetingSetter: Bytes! # address
  newGreeting: String! # string
  premium: Boolean! # bool
  value: BigInt! # uint256
  blockNumber: BigInt!
  blockTimestamp: BigInt!
  transactionHash: Bytes!
}

type SendMessage @entity(immutable: true) {
  id: Bytes!
  _from: Bytes! # address
  _to: Bytes! # address
  message: String! # string
  blockNumber: BigInt!
  blockTimestamp: BigInt!
  transactionHash: Bytes!
}

```

![](/public/images/TheGraph-ScaffoldEth2/section-1/1_2_1.png)

#### ✅ Update the Subgraph manifest

You will also need to add these entities to the Subgraph YAML configuration and also add the event handlers as well.

> This file is located in packages/subgraph/subgraph.yaml

```
entities:
        - GreetingChange
        - SendMessage
```

```
      eventHandlers:
        - event: GreetingChange(indexed address,string,bool,uint256)
          handler: handleGreetingChange
        - event: SendMessage(address,address,string)
          handler: handleSendMessage
```

![](/public/images/TheGraph-ScaffoldEth2/section-1/1_2_2.png)

If you are following along, next you will need to copy over your new abi and regenerate the code.

```
yarn abi-copy && yarn codegen
```

![](/public/images/TheGraph-ScaffoldEth2/section-1/1_2_3.png)

#### ✅ Update the mapping script

Next you will need to update the mappings for the files we have edited above.

> The file is located under packages/subgraph/src/mapping.ts

```
import {
  YourContract,
  GreetingChange as GreetingChangeEvent,
  SendMessage as SendMessageEvent
} from "../generated/YourContract/YourContract";
```

As well as the schema.

```
import { GreetingChange, SendMessage } from "../generated/schema"
```

Lastly, we will need to add the mapping functions for each event.

```
export function handleGreetingChange(event: GreetingChangeEvent): void {
  let entity = new GreetingChange(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.greetingSetter = event.params.greetingSetter
  entity.newGreeting = event.params.newGreeting
  entity.premium = event.params.premium
  entity.value = event.params.value

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleSendMessage(event: SendMessageEvent): void {
  let entity = new SendMessage(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity._from = event.params._from
  entity._to = event.params._to
  entity.message = event.params.message

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

```

Your changes should be accepted inside of your editor without any linting errors.

![](/public/images/TheGraph-ScaffoldEth2/section-1/1_2_4.png)

After that is done, you are almost done… time to ship it!
