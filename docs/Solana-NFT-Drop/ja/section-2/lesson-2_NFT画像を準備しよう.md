### ✨ NFT を作成する

Metaplex CLIは、Candy Machineに利用可能な、NFTを発行するための簡単なツールです。

まずはすべてのNFTデータを格納するフォルダを作成することから始めましょう。

`Solana-NFT-Drop`の中に、`assets`という名前の新しいディレクトリを作成します。

```diff
 Solana-NFT-Drop/
+└── assets/
```

`assets`の中には、実際のNFTのアセット（ここでは画像）と、Metaplexが設定する際に必要となる特定のNFTのメタデータを記述したjsonファイルという、互いに関連付けられたファイルのペアを格納していきます。

ここにはいくつでもNFTをロードできますが、まずは3つのNFTをロードして、必要なものをすべて理解していきましょう。

どのアセットが各jsonメタデータに対応しているかを把握するために、数字でシンプルな命名規則を設けます。

それぞれのPNGファイルは、それぞれのjsonファイルとペアになっています。以下2点に注意してください。

- ゼロから始めなければなりません。

- ネーミングに空白があってはいけません。

`assets`ディレクトリに、下記の通りファイルを作成してください。`0.json`は`0.png`に、 `1.json`は`1.png`にというようにです。ここで、ゼロから始まる3つのNFTの他に、`collection`という名前のファイルのペアが必要なことに注意してください。

```diff
 Solana-NFT-Drop/
 └── assets/
+    ├── collection.json
+    ├── collection.png
+    ├── 0.json
+    ├── 0.png
+    ├── 1.json
+    ├── 1.png
+    ├── 2.json
+    └── 2.png
```

コレクションNFTとその他の3つのNFTの違いは、前者がNFTのグループを定義するために使用されるのに対し、後者はNFTそのものを定義するために使用されることです。コレクションNFTによりグループ化されたNFTは、以下のメリットを持ちます。

- オンチェーンコールを追加することなく、任意のNFTがどのコレクションに属しているかを簡単に特定できる。
- 特定のコレクションに属するすべてのNFTを検索することが可能。
- コレクション名、説明、画像などのメタデータを容易に管理できる。

それでは、`json`ファイルを実際に作っていきましょう。

以下をコピーして`collection.json`に貼り付けてください。

```json
// collection.json
{
  "name": "NAME_OF_NFT",
  "symbol": "SYMBOL_OF_NFT",
  "description": "Collection of NFT.",
  "image": "collection.png",
  "properties": {
    "files": [
      {
        "uri": "collection.png",
        "type": "image/png"
      }
    ],
    "creators": [
      {
        "address": "INSERT_YOUR_WALLET_ADDRESS_HERE",
        "share": 100
      }
    ]
  }
}

```

以下をコピーして`0.json`に貼り付けてください。

```json
// 0.json
{
  "name": "NAME_OF_NFT",
  "symbol": "SYMBPL_OF_NFT",
  "description": "Collection of NFT.",
  "image": "0.png",
  "properties": {
    "files": [
      {
        "uri": "0.png",
        "type": "image/png"
      }
    ],
    "creators": [
      {
        "address": "INSERT_YOUR_WALLET_ADDRESS_HERE",
        "share": 100
      }
    ]
  }
}
```

これは、各NFTを立ち上げるために必要となる基本情報です。

Metaplexはこのデータを、あなたに代わってオンチェーンで保存します。jsonファイルには、`name`, `image`, `uri`などの属性があります。

上記と同様に、`1.json`、`2.json`にも貼り付けましょう。

"name"、"symbol"、"description" を変更することをお忘れなく!

さて、ここからはクリエイティブな作業が必要になります。

コレクションを作成するため、3つのランダムなNFTとコレクションNFTを考えてみてください。

まずは、あなたが好きなPNGを3枚選んでみてください。

好きなアルバムのカバー、好きなアニメのキャラクター、好きな映画のポスターなど、何でもかまいません。

**お気に入りのものを 3 つ選んでください。**

次に、それらを象徴するようなPNGを1枚選んでみてください（難しい場合は、PNGを4つ選びそのうち1つをコレクションNFTとしてみてください）。

※ 現在、CLIでは様々なカテゴリーのデジタルデータに対応しています。画像（PNG, GIF, JPG）以外のカテゴリーに関しては下記ドキュメントを参照してください。
- [URI JSON Schema - Metaplex Docs](https://docs.metaplex.com/programs/token-metadata/changelog/v1.0#uri-json-schema)
- [Verifying assets - Metaplex Docs](https://docs.metaplex.com/deprecated/candy-machine-js-cli/preparing-assets#verifying-assets)

最後に、`INSERT_YOUR_WALLET_ADDRESS_HERE`をあなたのPhantom walletアドレスに置き換えてください(引用符「`""`」を忘れずに)。

`creators`配列には複数のcreatorを設定できます。

これはNFTビューに表示され、Solana Name Service経由で接続されている場合は、Twitterハンドル変わります。

🌟: Solana Name Serviceを利用する場合

- ウォレットアドレスとTwitterハンドルを紐づけることができます。
- `INSERT_YOUR_WALLET_ADDRESS_HERE`にTwitterハンドルを代入しましょう。※ Twitterハンドルとウォレットアドレスを紐づけるのには0.01 SOLほどかかります!

`share`属性は、各クリエイターが受け取るロイヤリティの割合を表します。本プロジェクトではあなたが唯一のクリエイターですので、ロイヤリティのすべてを得られる設定です。

### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discordの`#solana`で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の3点を記載してください ✨

```
1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット
```

---

次のレッスンに進んで、NFTをdevnetにデプロイしていきましょう 🎉
