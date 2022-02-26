⚛️ SVG を作成してみよう
--------------------

下記のブラックボックス SVG を NFT として保存していきましょう。

```html
<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet" viewBox="0 0 350 350">
    <style>.base { fill: white; font-family: serif; font-size: 14px; }</style>
    <rect width="100%" height="100%" fill="black" />
    <text x="50%" y="50%" class="base" dominant-baseline="middle" text-anchor="middle">EpicNftCreator</text>
</svg>
```

NFT としてこのデータを取得するために [こちら](https://www.utilities-online.info/base64) のWEBサイトにアクセスしてください。

上記の SVG コードを貼り付けて、`encode`ボタンをクリックしてください。

`base64` でエンコードされた SVG データが出力されたら、そのデータをコピーしましょう。
- `base64` は、データを文字列にエンコードするために使用する標準規格です。

![](/public/images/ETH-NFT-collection/section-2/2_2_1.png)

枠で囲んだ部分を、下記に貼り付けてください。

```plaintext
data:image/svg+xml;base64,ここにあなたのSVGデータを貼り付けます
```

下図のように、使用しているブラウザで新しいタブを開いて、上記のリンクを貼り付け、実行してみましょう。

![](/public/images/ETH-NFT-collection/section-2/2_2_2.png)

SVG データがあなたのブラウザでも表示されていれば成功です。

わたしの使用したデータは、次のようになります。

```plaintext
data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHByZXNlcnZlQXNwZWN0UmF0aW89InhNaW5ZTWluIG1lZXQiIHZpZXdCb3g9IjAgMCAzNTAgMzUwIj4KICAgIDxzdHlsZT4uYmFzZSB7IGZpbGw6IHdoaXRlOyBmb250LWZhbWlseTogc2VyaWY7IGZvbnQtc2l6ZTogMTRweDsgfTwvc3R5bGU+CiAgICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJibGFjayIgLz4KICAgIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBjbGFzcz0iYmFzZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+RXBpY05mdENyZWF0b3I8L3RleHQ+Cjwvc3ZnPg==
```

これで、NFT データを永続的かつ永久に利用できるようになりました。

世界中のすべてのデータセンターが焼失したとしても、この `base64` でエンコードされた文字列があるため、コンピューターとブラウザーがあれば、常に SVG データを表示することができます。

☠️ JSON メタデータを削除する
--------------------

下記のように、前回のレッスンで作成した JSON ファイルの中にある `image` へのリンクを `base64` でエンコードされた SVG データに変更しましょう。

```json
{
    "name": "EpicNftCreator",
    "description": "The highly acclaimed square collection",
    "image": "data:image/svg+xml;base64,ここにbase64でエンコードされたSVGデータを貼り付けます"
}
```

わたしの JSON ファイルは、次のようになります。

```json
{
    "name": "EpicNftCreator",
    "description": "The highly acclaimed square collection",
    "image": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHByZXNlcnZlQXNwZWN0UmF0aW89InhNaW5ZTWluIG1lZXQiIHZpZXdCb3g9IjAgMCAzNTAgMzUwIj4KICAgIDxzdHlsZT4uYmFzZSB7IGZpbGw6IHdoaXRlOyBmb250LWZhbWlseTogc2VyaWY7IGZvbnQtc2l6ZTogMTRweDsgfTwvc3R5bGU+CiAgICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJibGFjayIgLz4KICAgIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBjbGFzcz0iYmFzZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+RXBpY05mdENyZWF0b3I8L3RleHQ+Cjwvc3ZnPg=="
}
```

次に、**JSON ファイルを `base64` でエンコードしていきます。**

[こちら](https://www.utilities-online.info/base64) のWEBサイトにアクセスしてください。

あなたの JSON ファイルを貼り付け、`Encode` ボタンをクリックしてください。


使用しているブラウザで、新しくタブを開き、URLバーに下記を貼り付け、実行してみましょう。

```plaintext
data:application/json;base64,ここにあなたのJSONデータを貼り付けます
```

あなたのブラウザで、下記のような結果が出力されていれば成功です。

![](/public/images/ETH-NFT-collection/section-2/2_2_3.png)

わたしの `base64` でエンコードした JSON ファイルは、次のようになります。

```plaintext
data:application/json;base64,ewogICAgIm5hbWUiOiAiRXBpY05mdENyZWF0b3IiLAogICAgImRlc2NyaXB0aW9uIjogIlRoZSBoaWdobHkgYWNjbGFpbWVkIHNxdWFyZSBjb2xsZWN0aW9uIiwKICAgICJpbWFnZSI6ICJkYXRhOmltYWdlL3N2Zyt4bWw7YmFzZTY0LFBITjJaeUI0Yld4dWN6MGlhSFIwY0RvdkwzZDNkeTUzTXk1dmNtY3ZNakF3TUM5emRtY2lJSEJ5WlhObGNuWmxRWE53WldOMFVtRjBhVzg5SW5oTmFXNVpUV2x1SUcxbFpYUWlJSFpwWlhkQ2IzZzlJakFnTUNBek5UQWdNelV3SWo0S0lDQWdJRHh6ZEhsc1pUNHVZbUZ6WlNCN0lHWnBiR3c2SUhkb2FYUmxPeUJtYjI1MExXWmhiV2xzZVRvZ2MyVnlhV1k3SUdadmJuUXRjMmw2WlRvZ01UUndlRHNnZlR3dmMzUjViR1UrQ2lBZ0lDQThjbVZqZENCM2FXUjBhRDBpTVRBd0pTSWdhR1ZwWjJoMFBTSXhNREFsSWlCbWFXeHNQU0ppYkdGamF5SWdMejRLSUNBZ0lEeDBaWGgwSUhnOUlqVXdKU0lnZVQwaU5UQWxJaUJqYkdGemN6MGlZbUZ6WlNJZ1pHOXRhVzVoYm5RdFltRnpaV3hwYm1VOUltMXBaR1JzWlNJZ2RHVjRkQzFoYm1Ob2IzSTlJbTFwWkdSc1pTSStSWEJwWTA1bWRFTnlaV0YwYjNJOEwzUmxlSFErQ2p3dmMzWm5QZz09Igp9
```

⚠️: 注意
> エンコードとコピー&ペーストを行う際、手動によるエラーが発生する可能性が高いです。
> エラーが発生した場合は、すべての手順をもう一度実行してください。


🚀 コントラクトを変更し、デプロイしよう
--------------------

それでは、`base64` でエンコードした JSON ファイルをコピーして `MyEpicNFT.sol` に追加しましょう。

変更する部分は、下記の2点です。

**1 \. `base64` でエンコードした JSON ファイルを貼り付ける**

```javascript
// MyEpicNFT.sol
_setTokenURI(newItemId, "data:application/json;base64,ここにbase64でエンコードされたJSONファイルを貼り付けます");
```

私のコードは、次のようになります。

```javascript
// MyEpicNFT.sol
_setTokenURI(newItemId, "data:application/json;base64,ewogICAgIm5hbWUiOiAiRXBpY05mdENyZWF0b3IiLAogICAgImRlc2NyaXB0aW9uIjogIlRoZSBoaWdobHkgYWNjbGFpbWVkIHNxdWFyZSBjb2xsZWN0aW9uIiwKICAgICJpbWFnZSI6ICJkYXRhOmltYWdlL3N2Zyt4bWw7YmFzZTY0LFBITjJaeUI0Yld4dWN6MGlhSFIwY0RvdkwzZDNkeTUzTXk1dmNtY3ZNakF3TUM5emRtY2lJSEJ5WlhObGNuWmxRWE53WldOMFVtRjBhVzg5SW5oTmFXNVpUV2x1SUcxbFpYUWlJSFpwWlhkQ2IzZzlJakFnTUNBek5UQWdNelV3SWo0S0lDQWdJRHh6ZEhsc1pUNHVZbUZ6WlNCN0lHWnBiR3c2SUhkb2FYUmxPeUJtYjI1MExXWmhiV2xzZVRvZ2MyVnlhV1k3SUdadmJuUXRjMmw2WlRvZ01UUndlRHNnZlR3dmMzUjViR1UrQ2lBZ0lDQThjbVZqZENCM2FXUjBhRDBpTVRBd0pTSWdhR1ZwWjJoMFBTSXhNREFsSWlCbWFXeHNQU0ppYkdGamF5SWdMejRLSUNBZ0lEeDBaWGgwSUhnOUlqVXdKU0lnZVQwaU5UQWxJaUJqYkdGemN6MGlZbUZ6WlNJZ1pHOXRhVzVoYm5RdFltRnpaV3hwYm1VOUltMXBaR1JzWlNJZ2RHVjRkQzFoYm1Ob2IzSTlJbTFwWkdSc1pTSStSWEJwWTA1bWRFTnlaV0YwYjNJOEwzUmxlSFErQ2p3dmMzWm5QZz09Igp9");
```

**2 \. トークンの名前とシンボルを変更する**
  // NFT トークンの名前とそのシンボルを渡します。
  constructor() ERC721 ("SquareNFT", "SQUARE") {
    console.log("This is my NFT contract.");
  }

トークンの名前を `"SquareNFT"` に、トークンのシンボルを `"SQUARE"` に変更しましょう。

次に、ターミナル上で下記を実行してみましょう。

- 実行する際は、ターミナル上で `epic-nfts` ディレクトリにいることを確認してください。

```bash
npx hardhat run scripts/deploy.js --network rinkeby
```

ターミナルに下記のような結果が表示されていたら、デプロイ成功です。

```
Compiling 1 file with 0.8.4
Solidity compilation finished successfully
Contract deployed to: 0xFDCA9fED387344A6a11c3022bCa0669964c237Db
Minted NFT #1
Minted NFT #2
```

最後に、コントラクトのアドレス（`Contract deployed to` に続く `0x..` ）をターミナルからコピーして、[`rinkeby.rarible.com`](https://rinkeby.rarible.com/) に貼り付け、検索してみてください。

- [テストネット用の OpenSea](https://testnets.opensea.io/) でも同じように確認することができますが、NF が OpenSea に反映されるまでに時間がかかるので、Rarible で検証することをおすすめします。

下記のように、あなたの SquareNFT が Rarible で確認できたでしょうか？

![](/public/images/ETH-NFT-collection/section-2/2_2_4.png)

🙋‍♂️ 質問する
-------------------------------------------
ここまでの作業で何かわからないことがある場合は、Discord の `#section-2-help` で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の3点を記載してください✨
```
1. 何をしようとしていたか
2. エラー文をコピー&ペースト
3. エラー画面のスクリーンショット
```

-----
それでは、次のレッスンに進みましょう🎉
