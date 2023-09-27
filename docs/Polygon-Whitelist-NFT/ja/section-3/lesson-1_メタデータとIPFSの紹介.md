### 🤖 IPFSを使用したNFTメタデータのアップロード

#### IPFSとは

前述のとおり、メタデータは中央集権的に保存することもでき、例えば`AWS S3`に保存される場合、ゲームタイプのNFTがメタデータ内のコンテンツを簡単に拡張するのに便利です。一方、メタデータは`IPFS`や`Ar`のような分散型ストレージに保存することもでき、これによりメタデータの不変性が強化されます。このレッスンでは、`IPFS`上で必要なメタデータを生成する方法を学びます。

![pngVGb7Gkv](/public/images/Polygon-Whitelist-NFT/section-3/3_1_1.png)

IPFSは**InterPlanetary** File Systemの略で、ファイル、ウェブサイト、アプリケーションなどの保存と共有に使用される分散型ピアツーピアネットワークです。2015年に初めてリリースされ、[Protocol Labs](https://protocol.ai/)によって開発されました。

IPFSは、ファイルの保存と共有のために設計された分散型ノードネットワークとして動作します。IPFS上の各ファイルは、その内容に基づくコンテンツハッシュによって識別されます。このコンテンツハッシュは **CID**、すなわち`Content ID`として知られています。簡単に言うと、IPFSにファイルをアップロードすると、IPFSネットワーク上のさまざまなノードがすでに同じコンテンツをアップロードしていないかどうかをチェックします。もし一致するものがあれば、ノードは前回のCIDを返します。一致しなければ、ノードはファイルを保存して新しいCIDを提供します。

CIDがあれば、IPFSに保存されているファイルの内容にアクセスできます。Bored Ape Yacht Club（BAYC）のCIDはQmeSjSinHpPnmXspMjwiXyN6zS4E9zccariGR3jxcaWtqです（注：CIDは必ずしも単一のファイルを指すわけではありません。アップロードを容易にするために「car」として知られる、バンドルされた複数のファイルを含むフォルダを指すこともできます。BAYCはバンドルされた複数ファイルのCIDを使用します）。

標準のIPFSリンクフォーマットは`IPFS://+CID`で、このようになります：
`IPFS://QmeSjSinHpPnmXmspMjwiXyN6zS4E9zccariGR3jxcaWtq`

ただし、このフォーマットは、IPFSをサポートしている一部のブラウザ（Braveなど）で、アドレスバーに直接`IPFS`アドレスを入力して使用する場合にのみ有効です。Chromeのような他のブラウザはこのフォーマットをサポートしていません。

したがって、IPFSコンテンツにアクセスするにはIPFSゲートウェイが必要です。例として以下のようなものがあります：

https://cloudflare-ipfs.com/ipfs/+CID

このようにして、Bored Ape Yacht Club（BAYC）のメタデータ・コンテンツに簡単にアクセスできます。

https://cloudflare-ipfs.com/ipfs/QmeSjSinHpPnmXmspMjwiXyN6zS4E9zccariGR3jxcaWtq/

![image-20230223094941448](/public/images/Polygon-Whitelist-NFT/section-3/3_1_2.png)

しかし、IPFSにファイルをアップロードするにはノードが必要であり、自分のIPFSノードを実行するのは難しいと思われるかもしれません。

[NFT Storage](https://nft.storage/)や[Textile](https://textile.io/)は、人気のあるIPFSノードプロバイダーです。Ethereumのノードプロバイダーと同様に、これらのプラットフォームでアカウントを作成することで、ネットワーク上に保存されたデータを保存および取得するためのIPFSノードにアクセスすることができます。

#### メタデータとは

一般的に、メタデータは標準フォーマットを確立するために設計された`JSON`コードの一部であり、主要なNFTプラットフォームがNFTの名前、説明、画像などの属性を簡単に認識できるようにします。これが`ERC721`メタデータのJSONスキーマです。

```json
{
    "title": "Asset Metadata",
    "type": "object",
    "properties": {
        "name": {
            "type": "string",
            "description": "Identifies the asset to which this NFT represents"
        },
        "description": {
            "type": "string",
            "description": "Describes the asset to which this NFT represents"
        },
        "image": {
            "type": "string",
            "description": "A URI pointing to a resource with mime type image/* representing the asset to which this NFT represents. Consider making any images at a width between 320 and 1080 pixels and aspect ratio between 1.91:1 and 4:5 inclusive."
        }
    }
}
```

しかし、これは最も基本的な`JSONスキーマ`に過ぎません。NFTの作成者の中には、NFTに属性などの追加機能を加えることを好む人もいます。以下はBored Ape Yacht Club #0の[メタデータコンテンツ](https://cloudflare-ipfs.com/ipfs/QmeSjSinHpPnmXmspMjwiXyN6zS4E9zccariGR3jxcaWtq/0)です。

```json
{
    "image": "ipfs://QmRRPWG96cmgTn2qSzjwr2qvfNEuhunv6FNeMFGa9bx6mQ",
    "attributes": [{
        "trait_type": "Earring",
        "value": "Silver Hoop"
    }, {
        "trait_type": "Background",
        "value": "Orange"
    }, {
        "trait_type": "Fur",
        "value": "Robot"
    }, {
        "trait_type": "Clothes",
        "value": "Striped Tee"
    }, {
        "trait_type": "Mouth",
        "value": "Discomfort"
    }, {
        "trait_type": "Eyes",
        "value": "X Eyes"
    }]
}
```

### 🙋‍♂️ 質問する
ここまで何かわからないことがある場合は、Discordの`#polygon`で質問をしてください。