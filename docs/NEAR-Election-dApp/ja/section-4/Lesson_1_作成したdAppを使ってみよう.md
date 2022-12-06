### 🚀 作成した投票の dApp を使ってみよう

前回まででコントラクト、フロントエンドを完成させましたね！

ここからはどのように機能するのかを確認して、自分が実装してきた機能を使ってみましょう。

まずは`Add Voter画面`に移動して投票者を追加してみましょう。これはコントラクトをdeployした人しかできないので、コントラクトをdeployしたwalletのidでサインインしているかを確認してください。

前のセクションで作成したコントラクトをdeployしたwallet idとは別のwallet idに対して投票券を配布（mint）してみましょう。

配布先に使うwallet idを入力欄に入れてaddボタンを押してください。下のようなメッセージが返ってきていればOKです！

![](/public/images/NEAR-Election-dApp/section-4/4_1_1.png)
![](/public/images/NEAR-Election-dApp/section-4/4_1_2.png)

次に候補者を追加してみましょう。

`Add Candidate画面`へ移動して`Image URI, Name, Manifest`の入力欄を埋めてAddボタンを押しましょう。 `Image URI`についてはIPFSで保存されたもののCIDであればなんでもいいです。

[こちら](https://www.pinata.cloud/)は有名なIPFSで保存できるサービスの1つである`pinata`です。特にこだわりがない方はこちらで画像をアップロードしてみてください。

候補者のNFTのmintができたら`Home画面`に移ってみましょう。
下のように追加した候補者の情報が追加されていれば成功です！
![](/public/images/NEAR-Election-dApp/section-4/4_1_3.png)
![](/public/images/NEAR-Election-dApp/section-4/4_1_4.png)
![](/public/images/NEAR-Election-dApp/section-4/4_1_5.png)

では次に投票をしてみましょう。

先ほど投票券を配布したwalletのidでサインインし直してみてください。

画面右上の`Sign Outボタン`を押せば`Sign In画面`に行くことができます。

投票券の配布先に指定したwalletのidでサインインできたら、まずはコントラクトを作成したwalletのidでしか投票券を配布（mint）できないかをテストしてみましょう。

`Add Voter画面`へ移り先ほどと同じように別のwalletのidを入力欄に入れて`Addボタン`を押してみてください。下のようなメッセージが返ってきていれば成功です。

![](/public/images/NEAR-Election-dApp/section-4/4_1_6.png)

では`Home画面`に移動して実際に投票をしてみましょう。

得票数が`1`になっている候補者に投票してみましょう！`vote`ボタンを押して確認メッセージが出たらOKを押してトランザクションの画面に移ってapproveボタンを押しましょう。

下のように得票数が変化していれば成功です！

![](/public/images/NEAR-Election-dApp/section-4/4_1_7.png)

また、もう一度`Voteボタン`を押してみましょう。次のようにすでに投票していることがメッセージで来ていたら成功です！

![](/public/images/NEAR-Election-dApp/section-4/4_1_8.png)

### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discordの`#near`で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の4点を記載してください ✨

```
1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット
```

これで投票アプリが機能できていることが確認できました！

では最後に次のレッスンでnetlifyにdeployして誰でも使えるようにしましょう！
