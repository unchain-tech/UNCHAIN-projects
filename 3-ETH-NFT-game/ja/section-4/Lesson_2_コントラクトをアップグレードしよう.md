🙉 Github に関する注意点
--------------------------------

**Githubにコントラクト（ `epic-game` ）のコードをアップロードする際は、秘密鍵を含むハードハット構成ファイルをリポジトリにアップロードしないよう注意しましょう**

秘密鍵などのファイルを隠すために、ターミナルで `epic-game` に移動して、下記を実行してください。

```bash
npm install --save dotenv
```

`dotenv` モジュールに関する詳しい説明は、[こちら](https://maku77.github.io/nodejs/env/dotenv.html)を参照してください。

`dotenv` をインストールしたら、`.env` ファイルを更新します。

ファイルの先頭に `.` がついているファイルは、「不可視ファイル」です。

`.` がついているファイルやフォルダはその名の通り、見ることができないので、「隠しファイル」「隠しフォルダ」とも呼ばれます。

操作されては困るファイルについては、このように「不可視」の属性を持たせて、一般の人が触れられないようにします。

ターミナル上で `epic-game` ディレクトリにいることを確認し、下記を実行しましょう。VS Code から `.env` ファイルを開きます。

```
code .env
```

そして、`.env` ファイルを下記のように更新します。

```
PRIVATE_KEY = hardhad.config.jsにある秘密鍵（accounts）を貼り付ける
STAGING_ALCHEMY_KEY = hardhad.config.js内にあるAlchemyのyURLを貼り付ける
PROD_ALCHEMY_KEY = メインネットにデプロイする際に使用するAlchemyのURLを貼り付ける（今は何も貼り付ける必要はありません）
```

私の `.env` は、下記のようになります。

```javascript
PRIVATE_KEY = 0x...
STAGING_ALCHEMY_KEY = https://...
PROD_ALCHEMY_KEY = ""
```

`.env` を更新したら、 `hardhat.config.js` ファイルを次のように更新してください。

```javascript
// hardhat.config.js
require("@nomiclabs/hardhat-waffle");
require("dotenv").config();

module.exports = {
  solidity: "0.8.4",
  networks: {
    rinkeby: {
      url: process.env.STAGING_ALCHEMY_KEY,
      accounts: [process.env.PRIVATE_KEY],
    },
    mainnet: {
      chainId: 1,
      url: process.env.PROD_ALCHEMY_KEY,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
};
```

最後に ` .gitignore` に `.env` が含まれていることを確認しましょう。

`cat .gitignore` をターミナル上で実行します。

下記のような結果が表示されていれば成功です。
```
node_modules
.env
coverage
coverage.json
typechain

#Hardhat files
cache
artifacts
```

これで、Github にあなたの秘密鍵をアップロードせずに、Github にコントラクトのコードをアップロードすることができます。

🌎 IPFS に 画像を保存する
---

現在、NFT キャラクターとボスの画像は Imgur に保存されています。

しかし、Imgar のサーバーがダウンしたり、終了してしまうと、それらの画像は永久に失われてしまうでしょう。

このようなケースを避けるために、[IPSF](https://docs.ipfs.io/concepts/what-is-ipfs/) に画像を保存する方法を紹介します。

- IPSF は誰にも所有されていない分散型データストレージシステムで、S3 や GCP ストレージなどを提供しています。

- たとえば、動画の NFT をあなたが発行したいと考えたとしましょう。

- オンチェーンでそのデータを保存すると、ガス代が非常に高くなります。

- このような場合、IPFS が役に立ちます。

[Pinata](https://www.pinata.cloud/) というサービスを使用すると、簡単に画像や動画を NFT にできます。

- NFTは、いくつかのメタデータにリンクする単なるJSONファイルであることを思い出してください💡

- このJSONファイルを IPFS に配置できます。

[Pinata](https://www.pinata.cloud/) に向かい、アカウントを作成して、UI からキャラクターの画像ファイルをアップロードしてみましょう。

ファイルをアップロードしたら、UI に表示されている「CID」をコピーしてください。

**CID は IPFS のファイルコンテンツアドレスです。**

下記の画面から、CID をコピーします。

![](/public/images/ETH-NFT-game/section-4/4_2_1.png)

それでは、下記の `https` アドレスに、コピーした CID を貼り付け、ブラウザで中身を見てみましょう。
```
https://cloudflare-ipfs.com/ipfs/あなたのCIDコードを貼り付けます
```

⚠️: 注意
> IPFS がすでに組み込まれている **Brave Browser** を使用している場合は、下記のリンクをブラウザに貼り付けてください。
>
>```
>ipfs://あなたのCIDコードを貼り付けます
>```

下記のように、ブラウザにあなたの画像が表示されいることを確認してください。

![](/public/images/ETH-NFT-game/section-4/4_2_2.png)

次に、`epic-game/scripts/run.js` を開き、 `imgur` リンクを `CID`（＝ IPFS ハッシュ）に変更していきましょう。

```javascript
// run.js
// Hardhat がローカルの Ethereum ネットワークを、コントラクトのためだけに作成します。
const gameContract = await gameContractFactory.deploy(
	// キャラクターの名前
	["FUSHIGIDANE", "HITOKAGE", "ZENIGAME"],
	// キャラクターの画像を IPFS の CID に変更
	["QmXxR67ryeUw4xppPLbF2vJmfj1TCGgzANfiEZPzByM5CT",
	"QmPHX1R4QgvGQrZym5dpWzzopavyNX2WZaVGYzVQQ2QcQL",
	"QmUGjB7oQLBZdCDNJp9V9ZdjsBECjwcneRhE7bHcs9HwxG"],
	[100, 200, 300],
	[100, 50, 25],
	"MYU2", // Bossの名前
	"https://i.imgur.com/3Ikh51a.png", // Bossの画像
	10000, // Bossのhp
	50 // Bossの攻撃力
);
```

次に、`MyEpicGame.sol` を開き、`tokenURI` 関数の中身を編集しましょう。

- `Base64.encode` の中身を更新してください。

```javascript
string memory json = Base64.encode(
      bytes(
        string(
          abi.encodePacked(
            '{"name": "',
            charAttributes.name,
            ' -- NFT #: ',
            Strings.toString(_tokenId),
            '", "description": "An epic NFT", "image": "ipfs://',
            charAttributes.imageURI,
            '", "attributes": [ { "trait_type": "Health Points", "value": ',strHp,', "max_value":',strMaxHp,'}, { "trait_type": "Attack Damage", "value": ',
            strAttackDamage,'} ]}'
          )
        )
      )
    );
```

ここでは、`image` タグの後に `ipfs://` を追加しています。

コントラクトを再度デプロイした後、最終的なメタデータは下記のような形になります。

```javascript
{
	"name": "ZENIGAME -- NFT #: 1",
	"description": "An epic NFT game.",
	"image": "ipfs://QmUGjB7oQLBZdCDNJp9V9ZdjsBECjwcneRhE7bHcs9HwxG",
	"attributes": [{
		"trait_type": "Health Points",
		"value": 300,
		"max_value": 300
	}, {
		"trait_type": "Attack Damage",
		"value": 25
	}]
}
```

最後に、下記のコードを更新します。

1 \. `SelectCharacter/index.js` の中に記載されている `renderCharacters` メソッドの中の `<img src={character.imageURI} alt={character.name} />` を下記に更新しましょう。

```javascript
// SelectCharacter/index.js
<img src={`https://cloudflare-ipfs.com/ipfs/${character.imageURI}`} />
```

2 \. `Arena/index.js` の中に記載されている HTML を出力する `return();` に着目してください。

```javascript
// Arena/index.js
<img
	src={characterNFT.imageURI}
	alt={`Character ${characterNFT.name}`}
/>
```

上記のコードを下記に更新してください。

```javascript
// Arena/index.js
<img
	src={`https://cloudflare-ipfs.com/ipfs/${characterNFT.imageURI}`}
	alt={`Character ${characterNFT.name}`}
/>
```

🤩 WEBアプリをアップグーレドする
---

これであなたのWEBアプリ完成です！

ここからは、WEBアプリを好きにアップグレードしていきましょう。

**🐸: ゲーム内に複数のプレイヤーを表示する**

- 現在、ゲーム上で表示されるのは、あなたの NFT キャラクターとボスだけです。

- マルチプレイヤーの仕様を実装してみるのはいかがでしょうか？

- コントラクトを変更するために必要なすべての情報と、マルチプレイヤーを実現するための基盤はすでにあなたの手の中にあります。

- コントラクトに、`getAllPlayers` 関数を作成し、それをWEBアプリから呼び出してみましょう。

- データをレンダリングする方法もあなたにお任せします。

**🐣: Twitter アカウントをWEBアプリに連携する**

`App.js` の下記をあなたの Twitter ハンドルに更新しましょう。

```javascript
// App.js
const TWITTER_HANDLE = 'あなたのTwitterハンドル';
```

🙋‍♂️ 質問する
-------------------------------------------
ここまでの作業で何かわからないことがある場合は、Discordの `#section-4-help` で質問してください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の3点を記載してください✨
```
1. 何をしようとしていたか
2. エラー文をコピー&ペースト
3. エラー画面のスクリーンショット
```
-------------------------------------------
次のレッスンに進んで、プロジェクトの最後に IPSF に画像をアップロードしていきましょう🎉
