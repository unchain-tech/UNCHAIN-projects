## テスト

### ✅ サブグラフのテスト

サブグラフのエンドポイントに移動し、確認してみましょう！

> 以下はクエリの例です...

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

![](/public/images/TheGraph-ScaffoldEth2/section-0/0_6_1.png)

> すべてがうまくいっていて、スマートコントラクトにトランザクションを送信した場合は、同様のデータ出力が表示されるはずです！

次に、The Graphがどのように機能するかをもう少し詳しく説明します。これにより、スマートコントラクトにイベントを追加する際に、フロントエンドアプリケーションに必要なデータのインデックス作成や解析ができるようになります。
