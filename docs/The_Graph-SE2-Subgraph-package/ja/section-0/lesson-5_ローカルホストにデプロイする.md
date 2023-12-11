## The Graph のセットアップ (Docker)

### 🚀 The Graph 統合のセットアップ

ブロックチェーンを起動し、フロントエンドアプリケーションを始動し、スマートコントラクトをデプロイしたので、次はサブグラフを設定し、The Graphを利用しましょう！

まず、古いでデータをクリアするために以下のコマンドを実行します。すべてをリセットしたい場合にこれを行ってください。

```
yarn clean-node
```

> これでグラフノードを起動する準備ができました。以下のコマンドを実行しましょう… 🧑‍🚀

```
yarn run-node
```

![](/public/images/The_Graph-SE2-Subgraph-package/section-0/0_4_1.png)

これにより、docker-composeを使用してThe Graphのすべてのコンテナが起動します。「Downloading latest blocks from Ethereum...」と表示されたら、完了です。

> 前述のように、Dockerからのログ出力を確認するために、このウィンドウを開いたままにしておいてください。 🔎