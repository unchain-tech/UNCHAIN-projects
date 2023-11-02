## Test 

### ✅ Test your newly deployed Subgraph

Next, lets see if our data is in The Graph. Here is an example query that shows us the first message.

```
{
  sendMessages(first: 1, orderBy: blockTimestamp, orderDirection: desc) {
    message
    _from
    _to
  }
}
```

Data is such a beautiful thing huh? 
