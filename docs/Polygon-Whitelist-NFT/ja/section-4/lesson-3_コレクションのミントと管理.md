### 🦄 ホワイトリストユーザー向けのNFT生成

コーディング部分がついに完了しました、おめでとうございます！ これで結果を楽しむ時が来ました。

それでは、フロントエンドを立ち上げてみましょう。`client/`下にいることを確認し、下記のコマンドを実行します。

```
yarn install
yarn dev
```

![](/public/images/Polygon-Whitelist-NFT/section-4/4_3_9.png)

次に、「Port Manager」を開き、「Add Port」クリックします。

![](/public/images/Polygon-Whitelist-NFT/section-4/4_3_10.png)

Select Sandboxに`Polygon（Ubuntu）`を選択し、Portには`3000`（Sandbox上に表示されたポート番号）を入力します。設定が完了したら「Add」をクリックしましょう。

![](/public/images/Polygon-Whitelist-NFT/section-4/4_3_11.png)

ポートの情報が追加されたことを確認したら、下記アイコンをクリックしてアプリケーションにアクセスしてみましょう。新しいタブが開きます。

![](/public/images/Polygon-Whitelist-NFT/section-4/4_3_12.png)

⚠️ ブラウザからアクセスできるまで数分時間がかかることがあります。下記のようなエラーが表示された場合は、しばらく待ってから再度アクセスしてみてください。

![](/public/images/Polygon-Whitelist-NFT/section-4/4_3_13.png)

アプリケーションにアクセスできたら、まずは、「`connect`」をクリックしてMetamaskアカウントをリンクします（ホワイトリストに登録されていることを確認してください）。

![image-20230223160640040](/public/images/Polygon-Whitelist-NFT/section-4/4_3_1.png)

次に「`mint`」をクリックすると、MetaMaskからのポップアップが表示されます。「`Confirm`」をクリックしてください。

![image-20230223160943332](/public/images/Polygon-Whitelist-NFT/section-4/4_3_2.png)

成功したら、オーナーであれば「`withdraw`」をクリックしてコントラクトからトークンを引き出すことができます。

さて、OpenSeaで作成したNFTコレクションをチェックする時間です。ブラウザで次のURLを入力します：`https://testnets.opensea.io/assets/mumbai/0x86b5cf393100cf895b3371a4ccaa1bc95d486a56/1`

「`0x86b5cf393100cf895b3371a4ccaa1bc95d486a56`」をあなたのコントラクトアドレスに置き換えると、コレクション内の最初のNFTを見ることができます。

![image-20230223163340534](/public/images/Polygon-Whitelist-NFT/section-4/4_3_3.png)

上の「`ChainIDE Shields`」をクリックすると、コレクションの全内容を見ることができます。

![image-20230223163620536](/public/images/Polygon-Whitelist-NFT/section-4/4_3_4.png)

### 🛠 最後のステップ、コレクションの設定

あなたがオーナーである場合、完了する必要があるいくつかの追加のステップがあるかもしれません。これらのステップにより、コレクションの外観が向上し、収益が増加する可能性があります。

オーナーアカウントを使って、コレクションページを開き、手順に従って「`Edit collection`」をクリックしてください。

![image-20230223164251804](/public/images/Polygon-Whitelist-NFT/section-4/4_3_5.png)

このセクション内で、ロゴ画像、説明、Twitterリンクなどの詳細を設定することができます。

![image-20230223164355425](/public/images/Polygon-Whitelist-NFT/section-4/4_3_6.png)

特に興味深いのは、「Creator earnings」です。ユーザーがOpenSeaでコレクションのアイテムを販売するたびに、販売価格の一定割合を稼ぐことができます。

![image-20230223164704695](/public/images/Polygon-Whitelist-NFT/section-4/4_3_7.png)

何か変更を加えた場合は「`Save collection`」をクリックするのを忘れないでください。何度でも変更できるので、心配はいりません。

![image-20230223164753042](/public/images/Polygon-Whitelist-NFT/section-4/4_3_8.png)

### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discordの`#polygon`で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の4点を記載してください ✨

```
1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット
```