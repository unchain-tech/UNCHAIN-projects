### 📝 キャニスターの設定ファイルを作成しよう

このレッスンでは、IC上にデプロイをするキャニスターの設定ファイルを作成します。

以下のコマンドを実行し、`dfx.json`ファイルを作成します。必ず、`icp-static-site/`下(`package.json`と同じ階層)に作成してください。

```
touch dfx.json
```

作成されたファイルに、以下を書き込みます。

[dfx.json]

```json
{
  "canisters": {
    "website": {
      "type": "assets",
      "source": ["dist"]
    }
  }
}
```

設定ファイルは`JSON`形式で記述され、この設定をもとにキャニスターが作成されます。

`"website":`はキャニスターにつける名前です。キャニスターが作成される際`mlsv7-lyaaa-aaaag-aatla-cai`のような一意なIDが割り振られますが、これを扱いやすくするために名前をつけることができます。DFXを通じて開発者が実際にキャニスターとやりとりをする際に活用されます。

`"type:`は、キャニスターがどのようなタイプであるかを指定します。ICが解釈するためのもので、今回は静的Webサイトを構築する画像やファイルをホストするので、`assets`というタイプを指定しています。他には、バックエンドのコードを記述したキャニスターには`rust`や`motoko`といったタイプを指定します。

`"source":`は、実際にアップロードしたいフォルダを指定します。ここでは、デプロイコマンドを実行した際に作成される、index.htmlやアセットを格納したフォルダ`dist`を指定します。

### 🤖 ローカル環境にデプロイしてみよう

それでは、ここまでのプロジェクトの構築が正しくできているかを、本番環境にデプロイする前にローカル環境へデプロイをして確認してみたいと思います。

`icp-static-site`ディレクトリ直下で、下記のコマンドを実行しましょう。

```
# バックグラウンドでローカル環境を立ち上げます（数秒かかります）
dfx start --clean --background

# 環境の立ち上げが終わったらデプロイをします
dfx deploy
```

（出力例）
```
Deploying all canisters.
Creating a wallet canister on the local network.
The wallet canister on the "local" network for user "default" is "bnz7o-iuaaa-aaaaa-qaaaa-cai"
Creating canisters...
Creating canister website...
website canister created with canister id: bkyz2-fmaaa-aaaaa-qaaaq-cai
Building canisters...
Building frontend...
Installing canisters...
Creating UI canister on the local network.
The UI canister on the "local" network is "bd3sg-teaaa-aaaaa-qaaba-cai"
Installing code for canister website, with canister ID bkyz2-fmaaa-aaaaa-qaaaq-cai
Uploading assets to asset canister...
Fetching properties for all assets in the canister.
Starting batch.
Staging contents of new and changed assets in batch 1:
  /index.html 1/1 (367 bytes) sha 162d9a885ddad425d1e682e436a5fa6d3ba0455f2aac94b2971521e867fb9ad4
  /assets/index.6eafe1ac.css 1/1 (6321 bytes) sha 6eafe1ac7fb4037eb205b8a865a9c9c3800dbc63caaca80dcee1a1490070a6c9
  /assets/index.6eafe1ac.css (gzip) 1/1 (1975 bytes) sha 3ce3680a96865423f96753a305e6a159e25f9b5e9bc4e3cc607cf075de52759b
  /vite.svg 1/1 (1497 bytes) sha 4a748afd443918bb16591c834c401dae33e87861ab5dbad0811c3a3b4a9214fb
  /assets/unchain_logo.9fc9ba05.png 1/1 (11126 bytes) sha 9fc9ba059ecdc2fc1e35f0b6083c10bb80bc1170c744999c076f3e75f0274581
  /assets/index.02ce13a8.js 1/1 (8726 bytes) sha af17fea9c836f8e2b90d0cbcea12e1e41fafc288aee722753e33457e11a5b9e9
  /assets/index.02ce13a8.js (gzip) 1/1 (3376 bytes) sha 12ccec78eca1fcd5f15ac08507e2a3466f7f8a34a3e77fe63e011b01a757e224
  /index.html (gzip) 1/1 (273 bytes) sha 48c939c1335d5c580283aa15755b80ddfa635bbbda93822dcac20e6a4c69d5cb
Committing batch.
Deployed canisters.
```

デプロイが完了し、プロジェクト内に`.dfx/local`フォルダ、`dist`フォルダが生成したことを確認しましょう。

.dfxフォルダには、実際にキャニスター内へコピーされるコンパイルされたソースコードや、キャニスターIDを定義したファイルなどが格納されます。

それでは、ブラウザ上で確認をしてみましょう。デプロイされたキャニスターのIDが必要なので、`.dfx/local/canister_ids.json内の"website:"`の値、または下記のコマンドを実行して取得しましょう。

```
dfx canister id website
```

キャニスターIDをコピーして、下記のようにURLを指定してブラウザで表示します。

```
http://127.0.0.1:4943?canisterId=YOUR_CANISTER_ID
```

（実行例）

![](/public/images/ICP-Static-Site/section-3/3_1_1.png)

作成したサイトが問題なく表示されることを確認します。

ローカル環境へのデプロイが成功したら、動作しているdfxを止めます。

```
dfx stop
```

### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discordの`#icp`で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の4点を記載してください ✨

```
1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット
```

---

次のレッスンに進み、デプロイの準備を完了しましょう！
