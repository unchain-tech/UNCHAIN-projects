### 🚀 作成した投票の dApp を使ってみよう

前回まででコントラクト、フロントエンドを完成させましたね！

ここからはどのように機能するのかを確認して、自分が実装してきた機能を使ってみましょう。

まずは`Add Voter画面`に移動して投票者を追加してみましょう。これはコントラクトを deploy した人しかできないので、コントラクトを　deploy した wallet の id でサインインしているかを確認してください。

前のセクションで作成したコントラクトをdeployした　wallet id　とは別の wallet id に対して投票券を配布(mint)してみましょう。

配布先に使う　wallet id を入力欄に入れて add　　ボタンを押してください。下のようなメッセージが返ってきていれば OK です！

![](/public/images/401-NEAR-Election-dApp/section-4/4_1_1.png)
![](/public/images/401-NEAR-Election-dApp/section-4/4_1_2.png)

次に候補者を追加してみましょう。

`Add Candidate画面`へ移動して`Image URI, Name, Manifest`の入力欄を埋めて Add ボタンを押しましょう。 `Image URI`については IPFS で保存されたものの CID であればなんでもいいです。

[こちら](https://www.pinata.cloud/)は有名な IPFS で保存できるサービスの一つである`pinata`です。特にこだわりがない方はこちらで画像をアップロードしてみてください。

候補者の NFT の mint ができたら`Home画面`に移ってみましょう。
下のように追加した候補者の情報が追加されていれば成功です！
![](/public/images/401-NEAR-Election-dApp/section-4/4_1_3.png)
![](/public/images/401-NEAR-Election-dApp/section-4/4_1_4.png)
![](/public/images/401-NEAR-Election-dApp/section-4/4_1_5.png)

では次に投票をしてみましょう。

先ほど投票券を配布した wallet の id でサインインし直してみてください。

画面右上の`Sign Outボタン`を押せば`Sign In画面`に行くことができます。

投票券の配布先に指定した wallet の id でサインインできたら、まずはコントラクトを作成した wallet の id でしか投票券を配布（mint）できないかをテストしてみましょう。

`Add Voter画面`へ移り先ほどと同じように別の wallet の id を入力欄に入れて`Addボタン`を押してみてください。下のようなメッセージが返ってきていれば成功です。

![](/public/images/401-NEAR-Election-dApp/section-4/4_1_6.png)

では`Home画面`に移動して実際に投票をしてみましょう。

得票数が`1`になっている候補者に投票してみましょう！`vote`ボタンを押して確認メッセージが出たら OK を押してトランザクションの画面に移って approve ボタンを押しましょう。

下のように得票数が変化していれば成功です！

![](/public/images/401-NEAR-Election-dApp/section-4/4_1_7.png)

また、もう一度`Voteボタン`を押してみましょう。次のようにすでに投票していることがメッセージで来ていたら成功です！

![](/public/images/401-NEAR-Election-dApp/section-4/4_1_8.png)

### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discord の `#near-election-dapp` で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の 4 点を記載してください ✨

```
1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット
```

これで投票アプリが機能できていることが確認できました！

では最後に次のレッスンで netlify に deploy して誰でも使えるようにしましょう！
