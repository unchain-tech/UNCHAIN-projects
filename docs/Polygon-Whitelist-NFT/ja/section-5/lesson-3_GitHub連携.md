### 🐱 GitHubにプロジェクトをアップロードしよう

#### コントラクトアドレスとABIの設定

ShieldコントラクトのアドレスとABIを直接記載していましたが、コントラクトアドレスは`.env.local`ファイルから、ABIはビルド時に生成される`artifacts`フォルダからそれぞれ参照するようにしましょう。

まずは`packages/client`フォルダ内に`.env.local`ファイルを作成しましょう。

![](/public/images/Polygon-Whitelist-NFT/section-5/5_3_1.png)

作成したファイルに、下記を記述しましょう。`ADDRESS_OF_SHIELD_CONTRACT`には自身のShieldコントラクトアドレスを設定してください。

```
NEXT_PUBLIC_CONTRACT_ADDRESS=ADDRESS_OF_SHIELD_CONTRACT
```

Section5 Lesson1でhardhat.config.tsを更新した際に、artifactsフォルダの生成先を`../client/artifacts`に設定したことを覚えていますか？ モノレポの動作確認で`yarn contract compile`を実行しているので、既に`packages/client`フォルダ内に生成されていることが確認できます。ABIはここからインポートするようにしましょう。

![](/public/images/Polygon-Whitelist-NFT/section-5/5_3_2.png)

それでは、`pages/index.tsx`を更新しましょう。下記のimport文を追加して、`contractAddress`と`abi`を下記のように更新しましょう。

```tsx
import ShieldArtifact from '@/artifacts/contracts/Shield.sol/Shield.json';

const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as string;
const abi = ShieldArtifact.abi;
```

#### .gitignoreファイルの設定

GitHub上へアップロードしないファイルを指定するために、`.gitignore`ファイルを設定しましょう。

プロジェクトのルートに`.gitignore`ファイルを作成します。

![](/public/images/Polygon-Whitelist-NFT/section-5/5_3_3.png)

下記をファイルに記載しましょう。

```
**/yarn-error.log*

# dependencies
**/node_modules

# chainIDE
**/.deps
**/.build
```

`packages/client`フォルダの.gitignoreファイルに下記を追加しましょう。

```
# Hardhat files
artifacts
```

お疲れ様でした！ これでGitHubにアップロードするための準備が完了しました。では、実際にアップロードをしてみましょう。

#### GitHubにアップロード

Git Managerを開き、「`Create a new repo`」を選択します。

![](/public/images/Polygon-Whitelist-NFT/section-5/5_3_4.png)

OwnerがChainIDEのログインに使用した自身のGitHubアカウントであることを確認しましょう。Repository nameには`Polygon-Whitelist-NFT`と入力し、「`Create repository`」をクリックします。

![](/public/images/Polygon-Whitelist-NFT/section-5/5_3_5.png)

Git Manager上に、Commit & Push画面が表示されます。GitHubへプッシュを行うファイルを選択しましょう。.gitignoreファイルを設定しましたが、アップロードしたくないファイルが含まれていないかを確認することをお勧めします。ファイルを1つずつ確認しながら横にある「＋」でステージングを変更しても良いですし、全てのファイルを確認し終わったら一括でステージングを変更することもできます（CHANGESにカーソルを当てると＋ボタンが出現します）。

![](/public/images/Polygon-Whitelist-NFT/section-5/5_3_6.png)

全てのファイルをステージングしたら、コミットメッセージを入力し、「`Commit & Push`」をクリックします。

![](/public/images/Polygon-Whitelist-NFT/section-5/5_3_7.png)

自身のGitHubアカウントにアクセスをして、Polygon-Whitelist-NFTリポジトリにファイルがアップロードされていることを確認しましょう。

### 🤟 VercelにWebアプリケーションをデプロイする
Vercelにアプリケーションをデプロイする場合は、[VercelでWebアプリケーションをデプロイする](https://app.unchain.tech/learn/Solana-NFT-Drop/ja/4/2/)を参考にしてみてください。

### 🎊 やったね！

おめでとうございます！ ホワイトリストに登録されたユーザーだけがミントできるNFTコレクションのフルスタックプロジェクトが完成しました。web3の旅に向けて大きな一歩を踏み出しました。この達成感を心から共有します。

しかし、私が学生時代に授業後の宿題と向き合っていたように、今のあなたにもその挑戦を渡すかもしれません😁。というわけで、少し休憩して、次の質問について考えてみてください：

* Shieldコントラクトのmint関数は、オーナーがコントラクトをデプロイした後、ホワイトリストに登録されたユーザーが直接ミントできるようになっています。オーナーが許可を設定した後にのみ、ホワイトリストのユーザーがミントできるようにする方法はありますか？
* Shieldコントラクトのmint関数は、ホワイトリストに登録されたユーザーごとのミントの数を制限していません。ユーザー1人あたりのミント数を1回のみとするには、どのようにコードを修正したら良いですか？
* ホワイトリストに登録されたユーザーがShieldコントラクトを通じてミントを行った後、全員にミントの許可を与えたい場合、コードはどのように設計すればよいですか?
* Whitelistコントラクトは、ホワイトリストのアドレスを記録するためにマッピングを使用します。アドレスの数が1000を超えると、多くのガスを消費する可能性があります。これを解決するにはどうすればよいでしょうか？

これらの質問は少し難しいかもしれませんが、このコンテンツ内にヒントが含まれています。諦めずに取り組んでみてください。私は、あなたの知恵が解決策を見つける手助けをしてくれると信じています。もし困った時は、遠慮なく私たちをフォローしてください。これからのコンテンツで答えが明らかになるでしょう！

それでは！

### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discordの`#polygon`で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の4点を記載してください ✨

```
1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット
```

### 🎫 NFT を取得しよう!

NFTを取得する条件は、以下のようになります。

1. MVPの機能がすべて実装されている（実装OK）

2. WebアプリケーションでMVPの機能が問題なく実行される（テストOK）

3. このページの最後にリンクされているProject Completion Formに記入する

4. Discordの`🔥｜completed-projects`チャンネルに、あなたのOpenSeaのリンクをシェアしてください 😉🎉 Discordに投稿する際に、追加実装した機能とその概要も教えていただけると幸いです!

プロジェクトを完成させていただいた方には、NFTをお送りします。

---

Project Completion Formは[こちら](https://airtable.com/shrf1cCtTx0iQuszX)です。