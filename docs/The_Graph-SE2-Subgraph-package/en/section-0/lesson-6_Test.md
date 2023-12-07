## Test

### ✅ Test your Subgraph

Go ahead and head over to your subgraph endpoint and take a look!

> Here is an example query…

```
  {
    greetings(first: 25, orderBy: createdAt, orderDirection: desc) {
      id
      greeting
      premium
      value
      createdAt
      sender {
        address
        greetingCount
      }
    }
  }
```

![](/public/images/The_Graph-SE2-Subgraph-package/section-0/0_6_1.png)

> If all is well and you’ve sent a transaction to your smart contract then you will see a similar data output!

Next up we will dive into a bit more detail on how The Graph works so that as you start adding events to your smart contract you can start indexing and parsing the data you need for your front end application.