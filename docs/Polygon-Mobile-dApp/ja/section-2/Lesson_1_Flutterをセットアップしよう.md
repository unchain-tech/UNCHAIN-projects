### ✨ Flutter の環境構築をする

今回は、Flutterプロジェクトフォルダの中にスマートコントラクトのフォルダを作成して開発していきますので先にFlutterの環境構築を済ませます。既に環境構築できている方は飛ばしてください。

では、お手持ちのデバイスに合わせてインストールしてください。

- [macOS](https://hara-chan.com/it/programming/how-to-setup-flutter/)（sdkダウンロード後は「Visual Studio Codeのセットアップ」をご参照ください）。

- [Windows](https://qiita.com/apricotcomic/items/7ff53950e10fcff212d2)

次に、ターミナルに向かいましょう。

`todo-dApp`ディレクトリに移動して、次のコマンドを実行します。

```bash
flutter create todo_dapp_front
```

Flutterでは、プロジェクトの名前に`-`や大文字を入れることができない事に注意してください。詳しくは、[こちら](https://dart.dev/tools/pub/pubspec#name)をご覧ください。

この段階で、フォルダ構造は下記のようになっていることを確認してください。

![](/public/images/Polygon-Mobile-dApp/section-2/2_1_1.png)

### ✨ Flutterプロジェクトのセットアップをする。

まず、開発に必要なパッケージをダウンロードをします。

`todo_dapp_front`フォルダ直下の`pubspec.yaml`ファイルを開いて、下記を追加してください。

```yaml
//pubspec.yaml
dependencies:
  flutter:
    sdk: flutter
//以下を追加
  http: ^0.13.4
  web3dart: ^2.3.5
  web_socket_channel: ^2.2.0
  provider: ^6.0.2
```

Flutterのパッケージについて詳しく知りたい方は、[こちら](https://pub.dev/)から検索してみてください。

次に、前のセクションでコンパイルした、ブロックチェーンに接続するための`TodoContract.json`ファイルを`todo_dapp_front`の中に持ってきます。

`todo_dapp_front`フォルダ直下に、`smartcontract`フォルダを作成してください。

その`smartcontract`フォルダの直下に、`TodoContract.json`ファイルを作成してください。

この`TodoContract.json`ファイルに、前のセクションでコンパイルした、`todo-dApp-contract/build/contracts`内にある`TodoContract.json`ファイルの中身をコピー&ペーストしてください。

※この操作は、コンパイルしてデプロイするたびに行う必要があります。

では、`TodoContract.json`ファイルを認識してもらうために、`todo_dapp_front`フォルダ直下の`pubspec.yaml`ファイルを開いて、ファイルの１番下を下記の様にしてください。
※ pubspec.yamlでは、インデントが大きな意味を持ちますので必ず下の様にしてください!

```yaml
//pubspec.yaml
# The following section is specific to Flutter.
flutter:
  uses-material-design: true
  assets:
    - smartcontract/TodoContract.json
```

最後に、必要ないので、`test`フォルダ内の`widget_test.dart`ファイルは削除してください。

これでFlutterプロジェクトのセットアップは完了しました。
### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discordの`#polygon`で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の3点を記載してください ✨

```
1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット
```

---

次のレッスンに進んで、フロント側の実装（ロジック編）を開始しましょう 🎉
