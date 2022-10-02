### 🤖 ツールをインストールしよう

このレッスンでは、開発の準備をしていきます。
それでは早速、ターミナルを開いて始めていきましょう！

### 🦄 DFX をインストールする

DFX とは DFINITY が提供する、開発したプロジェクトを IC にデプロイ、管理するための主要なツールです。

以下のコマンドを実行し、インストールをします。

```bash
sh -ci "$(curl -fsSL https://smartcontracts.org/install.sh)"
```

正しくインストールされたことを確認するために、以下を実行します。

```bash
dfx --version
```

ターミナルにインストール時の最新バージョンが表示されたら完了です[（SDK リリースノートを参照）](https://internetcomputer.org/docs/current/developer-docs/updates/release-notes/)。

```bash
dfx 0.11.1
```

### 🛠 VS Code の拡張機能をインストールする

このプロジェクトでは、開発に`Svelte`と`Tailwind CSS`を使用します。

`Svelte`とは、React や Vue などの JavaScript フレームワークに変わるツールです。`Svelte`の特徴としては、アプリケーションの実行時にコードを解釈するのではなく、ビルド時に行います。また、他のフレームワークと比較しコードの記述量が少ないことも特徴です。これは、バグの発生を抑えたり、コードの管理がしやすくなることにつながります。DFINITY が提供するサンプルプロジェクトでも`Svelte`が利用されていることから、今回採用しました。

コーディングのサポートツールとして、二つの拡張機能のインストールをお勧めします。

**Svelte for VS Code**

![](/public/images/ICP-Static-Site/section-1/1_2_1.png)

**Tailwind CSS IntelliSense**

![](/public/images/ICP-Static-Site/section-1/1_2_2.png)

### ✨ Node.js の確認をする

`node` / `npm` がインストールされている必要があります。お持ちでない場合は、[こちら](https://hardhat.org/tutorial/setting-up-the-environment.html)にアクセスし、インストールをしてください（Hardhat のためのサイトですが気にしないでください）。

`node v16` をインストールすることを推奨しています。

### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discord の `#icp-static-site` で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の 4 点を記載してください ✨

```
1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット
```

---

おめでとうございます！セクション 1 は終了です！

次のセクションに進み、プロジェクトの作成を開始しましょう 🚀
