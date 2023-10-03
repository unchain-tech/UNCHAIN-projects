## 準備

### 🛠 MetaMaskウォレットの設定

#### MetaMaskをインストールする

スマートコントラクトをブロックチェーンにデプロイしたり、デプロイされたスマートコントラクトとやり取りしたりする際には、ガス代が必要になります。そのため、MetaMaskのようなweb3ウォレットが必要です。MetaMaskのインストールは[こちら](https://metamask.io/)。

#### MetaMaskにPolygon Mumbaiを追加する

Polygonは、セキュリティを犠牲にすることなく、スケーラブルでユーザーフレンドリーなdAppsを低い取引手数料で構築できる分散型のEthereum Layer 2ブロックチェーンです。OpenseaやRaribleなどの主要なNFTプラットフォームもPolygon Mumbaiテストネットをサポートしているため、私たちはスマートコントラクトのデプロイ先にMumbaiを選択します。

[ChainIDE](https://chainide.com/)を開き、下図に示すようにフロントページの「`Try Now`」ボタンをクリックします。

![image-20230816160925822](/public/images/Polygon-Whitelist-NFT/section-0/0_2_1.png)

次に、希望するログイン方法を選択します。ログインプロンプトには2つの選択肢があります：「Sign in with GitHub」と「Continue as Guest」です。このチュートリアルでは「`Sign in with GitHub`」を選択します。Guestモードではサンドボックス機能が使えないからです。

![image-20230816161111357](/public/images/Polygon-Whitelist-NFT/section-0/0_2_2.png)

新しいPolygonプロジェクトを作成するには、「`New Project`」ボタンをクリックし、画面左側の「Polygon」を選択します。次に、右側の「Blank Template」を選択します。

![image-20230816161348702](/public/images/Polygon-Whitelist-NFT/section-0/0_2_3.png)


画面右側の「`Connect Wallet`」をクリックし、「`Injected Web3 Provider`」を選択し、Metamaskをクリックしてウォレットを接続します（Polygon Mainnetがメインネットワークで、Mumbaiがテストネットであるため、接続先はMumbaiを選択します）。 

![image-20230114120433122](/public/images/Polygon-Whitelist-NFT/section-0/0_2_4.png)

#### テストネットのトークンを要求する

MumbaiがMetaMaskに追加されたら、[Polygon Faucet](https://faucet.polygon.technology/)をクリックしてテストネットのトークンを受け取りましょう。Faucetのページで、ネットワークとしてMumbai、トークンとしてMATICを選択し、MetaMaskウォレットアドレスを貼り付けます。最後に送信ボタンをクリックすると、Faucetから数分以内にMATICが送られてきます。

![image-2023011412043342](/public/images/Polygon-Whitelist-NFT/section-0/0_2_5.png)

### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discordの`#polygon`で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の4点を記載してください ✨

```
1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット
```