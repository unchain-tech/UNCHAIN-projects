### 🏭 環境構築をしよう

このプロジェクトは上級者向けということで、github からある程度出来上がったプロジェクトを clone するのではなく `1 からプロジェクトを作成`していきます！

スマートコントラクトの作成に使う言語は `Solidity` です。

フロントエンドでは`Dart`という言語を用いた`Flutter`というフレームワークで開発していきます。Flutter を用いることによる最大の利点は ios,android,web アプリを全て同じコード（一部変える必要有り）で記述できるという特徴があります。

なじみのない方も多いかもしれませんが、現在 Flutter は使用者数が急増しておりライブラリの数も豊富で自由度の高い UI を作成することできることが魅力です。

では早速環境構築をしていきましょう！

**Flutter の開発環境構築**

Windows 版の方は[こちら](https://blog.css-net.co.jp/entry/2022/05/30/133942)を、Mac の方は[こちら](https://zenn.dev/kboy/books/ca6a9c93fd23f3/viewer/5232dc)を参照して環境構築を行なってください。

また Android のデバイスがない方は、デバッグで使うエミュレータのセットアップを[こちら](https://docs.flutter.dev/get-started/install/macos#set-up-the-android-emulator)で行ってください。

上記までが完了したら、次に Google Play Store で metamask をインストールした後に、metamask をセットアップをしましょう。エミュレータの方もエミュレータ内の Google Play Store で metamask のインストール＋セットアップ

エミュレータの方は metamask をインストールできないエラーにあうかもしれません。その時は[こちら](https://www.youtube.com/watch?v=oZlO1SxJmg8)の動画を参考にしてみてください。

エミュレータはこのようになります！
![](/public/images/NEAR-MulPay/section-0/0_2_1.png)

metamask のセットアップではアカウントを２つ(受信用・送金用)作成して、Aurora Testnet を追加しましょう。[こちら](https://docs.alchemy.com/docs/how-to-add-near-aurora-to-metamask)を参考にするとスムーズに Aurora Testnet を追加できます！
追加できたらこのようになります。
![](/public/images/NEAR-MulPay/section-0/0_2_2.png)

Flutter の環境構築はそれぞれの PC によって予期しないエラーが出ることがよくある（筆者の経験）ので何か問題があれば気軽に discord で質問してみてください！

最後にコントラクトとやり取りする仲介役をしてくれる`Infura`でアカウントを作って、Aurora Testnet 用の http key を[こちら](https://infura.io/)で取得しましょう。
手順は下の通りです。

1. アカウントを作成（作成済みの人は 2 から）
2. アカウントを作成したら右上の`Create New Key`ボタンを押す
3. Web3 API(Formerly Ethereum)を選択して、プロジェクトの名前を記入して`Create`ボタンを押す
4. dashboard の`Manage Key`ボタンを押して下の画面が出てきたら成功！
   ![](/public/images/NEAR-MulPay/section-0/0_2_3.png)

下にスクロールして`Aurora`用の http key があります。

drop down button を押すとテストネット用のものがあります。これは後で使います！
![](/public/images/NEAR-MulPay/section-0/0_2_4.png)

### 🗂 プロジェクトを作成しよう

**コントラクト用のディレクトリ作成**

それでは新しいプロジェクトを作成していきましょう。

まずは任意の場所にプロジェクト用のディレクトリを作成します。このプロジェクトでは`Aurora-MulPay`というディレクトリを作成します。

```bash
mkdir Aurora-MulPay
cd  Aurora-MulPay
```

このディレクトリ内に`mulpay_contract`というディレクトリを作成しましょう。そのディレクトリに移動して下のコマンドをターミナルで実行させましょう。

```
npm install hardhat
```

次に下のコマンドをターミナルで実行させて新しいプロジェクトを作成しましょう。

```
npx hardhat
```

ここでプロジェクトに関しての仕様をどのようにするか選択できるので`Create a TypeScript project`を選択しましょう。

これでコントラクトを実装する上での環境構築は完了です。次はフロントのプロジェクトを作成しましょう。

**フロントエンドのプロジェクト作成**

次にフロントエンドのプロジェクトを作成していきます。

`Aurora-MulPay`ディレクトリに移動して下のコマンドをターミナルで実行しましょう。

`MulPay_frontend`はプロジェクト名を示しています。

```bash
flutter create mulpay_frontend
```

プロジェクトが完成したら`mulpay_frontend`ディレクトリに移動して、ディレクトリ構造が以下のようになっていることを確認してください。

末尾が`/`となっているものはディレクトリ、それ以外はファイルであることを示しています

```
MulPay_frontend
├── README.md
├── analysis_options.yaml
├── android/
├── ios/
├── lib/
├── linux/
├── macos/
├── payment_dapp.iml
├── pubspec.lock
├── pubspec.yaml
├── test/
├── web/
└── windows/
```

下のコマンドをターミナルで実行することで確認することができます。

```bash
tree -L 1 -F
```

ではこの中の`lib`ディレクトリの中身を編集して以下のような構造にしてください。

その結果下のようになっているはずです。

```bash
lib/
├── main.dart
├── model/
│   └── contract_model.dart
└── view/
    ├── screens/
    │   ├── home.dart
    │   ├── qr_code_scan.dart
    │   ├── send.dart
    │   ├── signin.dart
    │   └── wallet.dart
    └── widgets/
        ├── coin.dart
        ├── navbar.dart
        └── qr_code.dart
```

下のコマンドを`lib`ディレクトリに移動してターミナルで実行することで確認することができます。

```bash
tree -L 3 -F
```

これで環境構築＋ディレクトリ構造の作成は完了です。

### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discord の `#section-0` で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の 4 点を記載してください ✨

```
1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット
```

---

おめでとうございます！

section-0 は終了です！

次のセクションではいよいよコントラクトの作成に移ります。

頑張っていきましょう 🚀
