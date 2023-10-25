## 完成したアプリをデプロイしよう！

ここからは完成したアプリをデプロイしていきましょう！

デプロイするというのはアプリが自律的に稼働することができるということです。そのため、コントラクトをテストネットにデプロイする必要があるのですが、ASTARが用意しているテストネット`Shibuya`は本アプリが機能するにはスペックが足りていません。

しかし結果を公開するという意味でデプロイしていきましょう！

まずは先ほど行なったのと同じようにコントラクトを`Shibuya Network`にデプロイしましょう！ ただし、今回deployするのはテストネットですのでいくつかするべきことがあります。

最初に[こちら](https://portal.astar.network/#/astar/assets)にアクセスして`Shibuya Network`へ接続しましょう！

![](/public/images/ASTAR-SocialFi/section-3/3_2_1.png)

接続ができたら右上の'connect'ボタンを押してpolkadot.jsのウォレットを接続しましょう！

![](/public/images/ASTAR-SocialFi/section-3/3_2_2.png)
![](/public/images/ASTAR-SocialFi/section-3/3_2_3.png)

その後下のようにShibuya Networkで使用できるトークンSBYが0であることが確認できると思います。

![](/public/images/ASTAR-SocialFi/section-3/3_2_4.png)

その記載の右側にある`faucet`ボタンを押してSBYを取得しましょう！

ロボットかどうかのチェックを終えて`verify`ボタンを押しましょう！ その後画面をリロードすればつなげているウォレットのSBYが10に増えているはずです。

![](/public/images/ASTAR-SocialFi/section-3/3_2_5.png)
![](/public/images/ASTAR-SocialFi/section-3/3_2_6.png)

これでdepoloyに使うためのトークンが取得できました！ では次に[こちら](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Frpc.shibuya.astar.network#/explorer)へ移動してShibuya Networkへコントラクトをデプロイしましょう！

デプロイの手順はローカルでやったものと同じですが、下の画像のように`deployment account`を先ほどトークンを取得したアカウントに切り替えましょう。そうでないとデプロイする時のガス代を支払うことができず失敗してしまいます。

![](/public/images/ASTAR-SocialFi/section-3/3_2_7.png)

すると下のように新しいコントラクトがデプロイされているはずです！ しかし先述したようにShibuya Networkはローカルに比べてとても遅いのでデプロイにもかなり時間がかかります。筆者がデプロイした時も1分以上かかりました 😅
なのでデプロイをしてからしばらく待ってみましょう。

![](/public/images/ASTAR-SocialFi/section-3/3_2_8.png)
![](/public/images/ASTAR-SocialFi/section-3/3_2_9.png)

また、`hooks/connect.tsx`の中に格納してある`blockchainUrl`を`Blast: wss://shibuya.public.blastapi.io`に置き換えましょう。

これによってコントラクトとのやりとりをローカルで立てることなく自律的に行わせる環境は整えることができました。

最後に、[Vercel](https://vercel.com/) にWebアプリケーションをホストする方法を学びます。

Vercelはサーバーレス機能のホスティングを提供するクラウドプラットフォームです。

スケーリングやサーバーの監視はVercelが行うため、開発者はVercelへデプロイするだけでアプリケーションを公開・運用できます。

Vercelに関する詳しい説明は、[こちら](https://zenn.dev/lollipop_onl/articles/eoz-vercel-pricing-2020)をご覧ください。

まず、GitHubの`Astar-SocialFi`にローカルファイルをアップロードしていきます。

ターミナル上で`Astar-SocialFi`に移動して、下記を実行しましょう。

```
git add .
git commit -m "upload to github"
git push
```

次に、GitHub上の`Astar-SocialFi`にローカル環境に存在する`Astar-SocialFi`のファイルとディレクトリが反映されていることを確認してください。

Vercelのアカウントを取得したら、下記を実行しましょう。

1\. `Dashboard`へ進んで、`New Project`を選択してください。

2\. `Import Git Repository`で自分のGitHubアカウントを接続したら、`Astar-SocialFi`を選択し、`Import`してください。

3\. プロジェクトを作成します。

`Environment Variable`に下記を追加します。
contract_addressには先ほど`Shibuya Testnet`へデプロイした時に取得したアドレスを、imgUrlForUnknownには初めてのアカウント用の画像URL入れましょう。

- `NAME`＝`NEXT_PUBLIC_CONTRACT_ADDRESS`
- `VALUE`＝`contract_address`

- `NAME`＝`NEXT_PUBLIC_UNKNOWN_IMAGE_URL`
- `VALUE`＝`imgUrlForUnknown`

また、`Root Directory`が「packages/client」となっていることを確認してください。

![](/public/images/ASTAR-SocialFi/section-3/3_2_15.png)

4\. `Deploy`ボタンを推しましょう。

VercelはGitHubと連動しているので、GitHubが更新されるたびに自動でデプロイを行ってくれます。

下記のように、`Building`ログが出力されます。
基本的に`warning`は無視して問題ありません。

![](/public/images/ASTAR-SocialFi/section-3/3_2_16.png)

これでデプロイは成功しました！

アプリとしては機能してないかもしれませんが、アプリを完成させたということを示す証となります！

先述しましたが、Shibuya Networkではアプリが機能せず完成が実質確認できないので下のようにローカルで作成した

1. Connect Wallet画面
2. Home画面
3. Profile画面
4. Message画面
5. Message Room画面

の5つをdiscordの`🔥｜completed-projects`チャンネルで共有しましょう！

![](/public/images/ASTAR-SocialFi/section-3/3_2_10.png)
![](/public/images/ASTAR-SocialFi/section-3/3_2_11.png)
![](/public/images/ASTAR-SocialFi/section-3/3_2_12.png)
![](/public/images/ASTAR-SocialFi/section-3/3_2_13.png)
![](/public/images/ASTAR-SocialFi/section-3/3_2_14.png)

---

### 🎫 NFT を取得しよう!

NFTを取得する条件は、以下のようになります。

1. MVPの機能がすべて実装されている（実装OK）

2. WebアプリケーションでMVPの機能が問題なく実行される（テストOK）

3. このページの最後にリンクされているProject Completion Formに記入する

4. Discordの`🔥｜completed-projects`チャンネルに、あなたのWebサイトをシェアしてください 😉🎉 Discordに投稿する際に、追加実装した機能とその概要も教えていただけると幸いです!

プロジェクトを完成させていただいた方には、NFTをお送りします。

### 🎉 おつかれさまでした!

あなたのオリジナルのdAppが完成しました。

あなたは、コントラクトをデプロイし、コントラクトと通信するWebプリケーションを立ち上げました。

これらは、分散型Webアプリケーションがより一般的になる社会の中で、世界を変える2つの重要なスキルです。

UIのデザインや機能をアップグレードしたら、ぜひコミュニティにシェアしてください!　 😊

---

Project Completion Formは[こちら](https://airtable.com/shrf1cCtTx0iQuszX)です。
