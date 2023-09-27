### 🌏 テストネットにホワイトリストとNFTのコントラクトをデプロイする

> テストネットでのコントラクトのデプロイ前に、ガスを必要とせず、デプロイが迅速なため、`JS VM`を使用してコントラクトを徹底的にテストできます。

最初に`Polygon Mumbai`テストネットでテストトークンを受け取ったことを覚えていますか？ 次に、このテストネットへ`Whitelist.sol`と`Shield.sol`のコントラクトをデプロイします。

右上の「`Connected`」ボタンをクリックし、「`Disconnect`」を選択します。

![image-20230223133803703](/public/images/Polygon-Whitelist-NFT/section-4/4_1_1.png)

「`Injected Web3 Provider`」を選択します。

![image-20230223133842606](/public/images/Polygon-Whitelist-NFT/section-4/4_1_2.png)

「`Metamask`」をクリックします。

![image-20230223134000225](/public/images/Polygon-Whitelist-NFT/section-4/4_1_3.png)

「`Mumbai`」を選択します。

![image-20230223134208657](/public/images/Polygon-Whitelist-NFT/section-4/4_1_4.png)

### 📝 Whitelist.solをデプロイする

まず`Whitelis.sol`をコンパイルします。

![image-20230223134424725](/public/images/Polygon-Whitelist-NFT/section-4/4_1_5.png)

Deploy & Interactionパネルに移動し、最大4つの異なるホワイトリストアドレスを配列で入力します。例：`["0xa323A54987cE8F51A648AF2826beb49c368B8bC6","0x4f2249958655e1b78064cc3d1F1b8a0B12D1dbDE","0x03692A0187c6D8Be757Be0f0775b94B484fFC15D","0x643AAe9DA7f3542f370FD87ea1781bD54D541578"]`

「`Deploy`」をクリックします。

![image-20230223135017015](/public/images/Polygon-Whitelist-NFT/section-4/4_1_6.png)

次のステップは、JS VMを使うのとは異なり、コントラクトを検証することです。コントラクトを検証した後、Etherscanのようなプラットフォームでオープンソース化され、他の人がソースコードをレビューできるようになり、コントラクトの公正さと正確さが保証されます。

ChainIDEは便利なVerifyプラグインを提供しています。ユーザーは対応するScan API Keyを取得するだけで、素早くコントラクトを検証することができます。

Scan Verifierパネルに切り替え、「Polygon API Key」の隣にあるリダイレクトリンクをクリックします。

![image-20230223135415733](/public/images/Polygon-Whitelist-NFT/section-4/4_1_7.png)

ログインページで、「`Login`」または「`Click to sign up`」のいずれかを選択します。

![image-20230114122015922](/public/images/Polygon-Whitelist-NFT/section-4/4_1_8.png)

「`API Keys`」を選択します。

![image-20230114122844649](/public/images/Polygon-Whitelist-NFT/section-4/4_1_9.png)

「`Add`」選択します。

![image-20230114122902739](/public/images/Polygon-Whitelist-NFT/section-4/4_1_10.png)

`AppName`に好きな名前を入力し、「`Continue`」をクリックします。

![image-20230114122923433](/public/images/Polygon-Whitelist-NFT/section-4/4_1_11.png)

その後、`API Key`が生成されます（APIキーは他の人と共有しないでください。キーの使用速度には制限があります。私のキーの1つは`98TSWD2C57949VSZVFCZ15WKYDVSCMJKQM`です）。生成されたキーをコピーします。

![image-20230114122953738](/public/images/Polygon-Whitelist-NFT/section-4/4_1_12.png)

ChainIDEに貼り付けます。

![image-20230223140212926](/public/images/Polygon-Whitelist-NFT/section-4/4_1_13.png)

また、`INTERACT`セクションで、対応するコンストラクタとコントラクトのアドレスをコピーします。

![image-20230223140319580](/public/images/Polygon-Whitelist-NFT/section-4/4_1_14.png)

Scan Verifierパネルに貼り付け、「`Verify`」をクリックします。

![image-20230223140526416](/public/images/Polygon-Whitelist-NFT/section-4/4_1_15.png)

おめでとうございます、検証成功です！

![image-20230223141313801](/public/images/Polygon-Whitelist-NFT/section-4/4_1_16.png)

### 🛡 Shield.solのデプロイ

`Shield.sol`のコンパイルから始めましょう。

![image-20230223141704965](/public/images/Polygon-Whitelist-NFT/section-4/4_1_17.png)

デプロイページに切り替えます。コンストラクタで

* `baseURI`には、メタデータセクションで生成されたIPFS URIを指定します。私の場合はこちらです： `ipfs://bafybeihuwmkxnqban2ukneymhwctxfqec5ywrdiqyc7vmyegftrllf7gq/`
* `whitelistContract`には、今デプロイしたホワイトリストのアドレスを指定します。私のはこちらです：` 0x78dd3EA257535E08BA0Ee5d2eB5E5c8C64304AFf`

![image-20230223142123752](/public/images/Polygon-Whitelist-NFT/section-4/4_1_18.png)

デプロイ後、再びScan Verifierパネルに移動します。検証のために同じ`baseURI`と`whitelistContract`を入力します。また、デプロイしたばかりの`Shield.sol`コントラクトのアドレスも入力します。「`Verify`」をクリックし、検証が成功するのを待ちましょう。

![image-20230223142357545](/public/images/Polygon-Whitelist-NFT/section-4/4_1_19.png)

素晴らしい、コントラクトに関する部分はほぼ完了しました。次は、ホワイトリストに登録されたユーザーがミント操作を行うためのフロントエンドページを開発する必要があります。

### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discordの`#polygon`で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の4点を記載してください ✨

```
1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット
```