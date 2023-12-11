## Graph CLI

### ✅ CLIを使用したサブグラフのデプロイ

#### ✅ Graph CLIを使ってデプロイを完了する

![Studio6](/public/images/The_Graph-SE2-Subgraph-package/section-2/2_5_1.png)

以下のコマンドを使用して、Graph CLIをグローバルにインストールできます。

```
yarn global add @graphprotocol/graph-cli
```

![](/public/images/The_Graph-SE2-Subgraph-package/section-2/2_5_2.png)

#### ✅ サブグラフの初期化

これは、yarnパッケージを初期化するために、お好きな別のフォルダで行うことができます。初期化プロセス中に必要な設定を入力する必要があります。スタートブロックは、必要に応じてEtherescanで見つけることができ、以前のブロック全体をインデックスする必要がありません。

```
graph init --studio name_of_your_subgraph
```

このようになります...

![](/public/images/The_Graph-SE2-Subgraph-package/section-2/2_5_3.png)

#### ✅ Studioへの認証

Subgraph StudioのAuth & Deployから認証文字列を取得します。

```
graph auth --studio auth_key_here
```

成功するとこのようになります：

```
Deploy key set for https://api.studio.thegraph.com/deploy/
```

#### ✅ codegenを実行し、サブグラフをビルドする

前のステップでサブグラフが作成されたディレクトリに移動する必要があります。

```
cd sendmessage
graph codegen && graph build
```

成功すると以下のようになります！

![](/public/images/The_Graph-SE2-Subgraph-package/section-2/2_5_4.png)

#### ✅ デプロイ

これでStudioにデプロイする準備が整いました。

```
graph deploy --studio name_of_your_subgraph
```

バージョンを選択して、実行しましょう！

![](/public/images/The_Graph-SE2-Subgraph-package/section-2/2_5_5.png)

サブグラフがスタジオにデプロイされるまで、5分ほどかかることがあります。デプロイされたら、完全に同期されていてエラーがないことを確認してください。デプロイに成功すると、以下のようになります。

![Studio7](/public/images/The_Graph-SE2-Subgraph-package/section-2/2_5_6.png)

#### ✅ トランザクションを送信し、Subgraph Playgroundで確認する

Etherscanで、Contract -> Write Contractタブから直接コントラクトにトランザクションを送信できます。

私たちのクエリ：

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

データオブジェクトのレスポンス：

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