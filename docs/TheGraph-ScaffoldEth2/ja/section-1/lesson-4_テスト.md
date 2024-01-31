## テスト

### ✅ 新しくデプロイされたサブグラフのテスト

次に、私たちのデータがThe Graphにあるかどうかを確認しましょう。こちらは最初のメッセージを表示するクエリの例です。

```
{
  sendMessages(first: 1, orderBy: blockTimestamp, orderDirection: desc) {
    message
    _from
    _to
  }
}
```

このような素晴らしいレスポンスが得られるはずです：

![](/public/images/TheGraph-ScaffoldEth2/section-1/1_4_1.png)

データとは素晴らしいものですね？
