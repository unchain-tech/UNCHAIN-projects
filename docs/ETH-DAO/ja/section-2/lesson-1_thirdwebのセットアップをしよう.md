### 🍪 thirdweb のセットアップをしよう

前回までのLessonでユーザーのウォレット接続ができるようになりました。

つまり、ユーザーがDAOに参加しているかどうかをチェックできるようになったということです。

一般的に、ユーザーがDAOに参加するためにはメンバーシップNFTを所有する必要があります。

もし、メンバーシップNFTを持っていなければ、メンバーシップNFTをミントし、DAOに参加するよう促しましょう。

ただし、NFTをミントするためには、独自のNFTスマートコントラクトを作成し、デプロイする必要がでてきます。

**そこで [thirdweb](https://thirdweb.com/) の出番となるわけ**です。

[thirdweb](https://thirdweb.com/) は、Solidityを一切書かずにスマートコントラクトを作成するためのツール一式を提供してくれるのです。

このプロジェクトでは、Solidityを書きません。

必要なのは、コントラクトを作成し、デプロイするためにTypeScriptで書かれたスクリプトを記述することだけです。

[thirdweb](https://thirdweb.com/) は、作成された安全で標準的な[コントラクト](https://github.com/thirdweb-dev/contracts)を使用します。

興味のある方はぜひ覗いてみてください。

thirdwebを利用してコントラクトをデプロイすると、クライアントサイドSDKを通してフロントエンドから簡単にそれらのコントラクトとやりとりができます。

Solidityのコードを書くのに比べて、thirdwebでスマートコントラクトを作るのがいかに簡単であるかは明らかです。

では、さっそくコードを書いていきましょう。

[thirdweb のダッシュボード](https://thirdweb.com/dashboard)から、コードを書かずにコントラクトを作成することもできますが、このプロジェクトではTypeScriptを使って実装していくことにします。

※ thirdwebはデータベースを持っておらず、あなたのデータはすべてオンチェーンに保存されます。


### 📝 環境変数を設定しよう

thirdwebを使ってSepoliaにコントラクトを作成し、デプロイするためにはスクリプトをいくつか作成する必要があります。

その前に、まずはプロジェクトのルートに以下の`.env.local`ファイルを作成し以下のように編集しましょう。

```plaintext
PRIVATE_KEY=YOUR_PRIVATE_KEY_HERE
CLIENT_ID=YOUR_CLIENT_ID
SECRET_KEY=YOUR_SECRET_KEY
```

ここに記載する情報は誰にも教えてはならない情報なので、取り扱いには十分に注意しましょう。

> ⚠️ 注意：thirdweb は、あなたに代わってコントラクトをデプロイするために、これらすべての環境変数を必要とします。
>
> 秘密鍵を盗まれてしまう恐れがあるので、**`.env.local`ファイルを GitHub にコミットしないよう気をつけてください**。.gitignoreファイルに`.env.local`が含まれていることを確認してください。

`YOUR_PRIVATE_KEY_HERE`にはMetamaskのPrivate Keyを、`YOUR_CLIENT_ID`にはthirdweb APIキーのClient IDを、`YOUR_SECRET_KEY`にはthirdweb APIキーのSecret Keyを設定していきましょう。

PRIVATE_KEYの取得方法は、[こちら](https://metamask.zendesk.com/hc/en-us/articles/360015289632-How-to-Export-an-Account-Private-Key)を参照してください。

※ CLIENT_IDとSECRET_KEYの取得方法については以下で解説していきます。

### 🔑 APIキーを作成する

SDKでthirdwebのインフラサービスを利用するには、APIキーが必要になります。APIキーは、thirdwebのダッシュボードから無料で作成することができます。

[こちら](https://thirdweb.com/dashboard/settings/api-keys)からthirdwebのダッシュボードにアクセスをして、ウォレット接続を行いSign inしましょう。

![](/public/images/ETH-DAO/section-2/2_1_1.png)

Sign inが完了したら、ダッシュボード右上の「+ Create API Key」をクリックします。

![](/public/images/ETH-DAO/section-2/2_1_2.png)

APIキーに任意の名前をつけて、「Next」をクリックします。

![](/public/images/ETH-DAO/section-2/2_1_3.png)

次に、APIキーの設定を行います。下記画像のようにサービス有効化とアクセス制限の設定を行い、最後に「Create」をクリックします。

![](/public/images/ETH-DAO/section-2/2_1_4.png)

画面上に作成したAPIキーの`Client ID`と`Secret Key`が表示されます。これらの値をコピーして、`.env.local`の`YOUR_CLIENT_ID`と`YOUR_SECRET_KEY`にそれぞれ設定しましょう。注意書きにもありますが、Secret Keyは表示されている画面を閉じると二度と取得することはできないので、大切に保管してください。設定と保管が完了したら、「I have stored the Secret Key securely」をクリックして画面を閉じます。

![](/public/images/ETH-DAO/section-2/2_1_5.png)

### 🐣 テストネットから始める

今回のプロジェクトでは、コスト（＝ 本物のETH）が発生するイーサリアムメインネットではなく、**テストネットにコントラクトをデプロイします。**

テストネットはイーサリアムメインネットを模しています。

- イーサリアムメインネットにコントラクトをデプロイした際に発生するイベントのテストを行うのに最適です。
- テストネットは偽のETHを使用しているため、いくらでもトランザクションのテストを行えます。

今回は、以下のイベントをテストしていきます。

1. トランザクションの発生を世界中のマイナーたちに知らせる
2. あるマイナーがトランザクションを発見する
3. そのマイナーがトランザクションを承認する
4. そのマイナーがトランザクションを承認したことをほかのマイナーたちに知らせ、トランザクションのコピーを更新する

このセクションでは、コードを書きながら、これらのイベントについての理解を深めていきます。


### 🚰 偽の ETH を取得する

今回は、`Sepolia`というイーサリアム財団によって運営されているテストネットを使用します。

`Sepolia`にコントラクトをデプロイし、コードのテストを行うために、偽のETHを取得しましょう。ユーザーが偽のETHを取得するために用意されたインフラは、「フォーセット（＝蛇口）」と呼ばれています。

フォーセットを使用する前に、あなたのMetaMaskウォレットを`Sepolia Test Network`に設定してください。

> ✍️: MetaMask で`Sepolia Test Network`を設定する方法
>
> 1 \. MetaMask ウォレットのネットワークトグルを開く。
>
> ![](/public/images/ETH-DAO/section-2/2_1_6.png)
>
> 2 \. `Show/hide test networks`をクリック。
>
> ![](/public/images/ETH-DAO/section-2/2_1_7.png)
>
> 3 \. `Show test networks`を`ON`にする。
>
> ![](/public/images/ETH-DAO/section-2/2_1_8.png)
>
> 4 \. `Sepolia Test Network`を選択する。
>
> ![](/public/images/ETH-DAO/section-2/2_1_9.png)

MetaMaskウォレットに`Sepolia Test Network`が設定されたら、下記のリンクの中から条件に合うものを選んで、少量の偽ETHを取得しましょう。

- [Alchemy](https://sepoliafaucet.com/) - 1 Sepolia ETH（24時間に1度もらうことができる）
  - ウォレットアドレスを入力して`Send Me ETH`ボタンを押下するとその場でもらえます


### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discordの`#ethereum`で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の4点を記載してください ✨

```
1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット
```

---

次のレッスンでは、実際にthirdwebスクリプトを書きメンバーシップNFTをデプロイします！
