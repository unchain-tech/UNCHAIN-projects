###  ✨NFTを作成する

Metaplex CLIは、candy machineに利用可能な、NFTを発行するための簡単なツールです。

まずはすべてのNFTデータを格納するフォルダを作成することから始めましょう。

`app`が含まれているフォルダを開き、` assets`という名前の新しいディレクトリを作成します。ディレクトリ構造の一例です。

![無題](/public/images/Solana-NFT-mint/section2/2_2_1.png)

*※**Replit**を使用している場合は、ローカルで`assets`という名前のディレクトリをどこかに作成するだけで機能します。どこに置いてもかまいません。*


`assets`の中には、実際のNFTのアセット（ここでは画像）と、Metaplexが設定を行う際に必要となる特定のNFTのメタデータを記述したjsonファイルという、互いに関連付けられたファイルのペアがあります。

ここにはいくつでもNFTをロードすることができますが、まずは3つのNFTをロードして、必要なものをすべて理解してもらいます。

どのアセットが各jsonメタデータに対応しているかを把握するために、数字でシンプルな命名規則を設けます。
それぞれのPNGは、それぞれのJSONファイルとペアになっています。注意すべき点が2つあります。
1. 0から始めなければなりません。
2. ネーミングに空白があってはいけません。

`assets`ディレクトリに、下記の通りファイルを作成してください。

```txt
// NFT #1
0.png
0.json

// NFT #2
1.png
1.json

// NFT #3
2.png
2.json
```

![無題](/public/images/Solana-NFT-mint/section2/2_2_2.png)

`0.json`は` 0.png`に、 `1.json`は` 1.png`にというようにです。
これらの`json`ファイルに何を入れるか気になりますよね。

以下をコピーして`0.json`に貼り付けましょう。

```json
{
  "name": "NAME_OF_NFT",
  "symbol": "",
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

これは、各NFTを立ち上げるために必要となる基本情報です。Metaplexはこのデータを、あなたに代わってオンチェーンで保存します。jsonファイルには、`name`, `image`, `uri`などの属性があります。

上記と同様に、`1.json`、`2.json`にも貼り付けましょう。"name"、  "image" 、"uri"、 "address"を変更することをお忘れなく！

さて、ここからはクリエイティブな作業が必要になります。コレクションを作成するため、3つのランダムなNFTを考えてみてください。
まずは、あなたが好きなPNGを3枚選んでみてください。好きなアルバムのカバー、好きなアニメのキャラクター、好きな映画のポスターなど、何でも構いません。

**お気に入りのものを3つ選んでください。**


※現在、CLIでサポートされているのはPNGのみです。MP4、MP3、HTMLなどの他のファイルタイプについては、カスタムスクリプトを作成する必要があります。Github issue[ここ](https://github.com/metaplex-foundation/metaplex/issues/511)を参照してください。

最後に、`INSERT_YOUR_WALLET_ADDRESS_HERE`をあなたのPhantom walletアドレスに置き換えてください（引用符「""」を忘れずに）。これはNFTビューに表示され、Solana Name Service経由で接続されている場合はtwitterハンドルにて名前解決されます。`creators`配列には複数のcreatorを設定できます。`share`属性は、各クリエイターが受け取るロイヤリティの割合を表します。本プロジェクトではあなたが唯一のクリエイターなので、ロイヤリティのすべてを得られる設定です。
