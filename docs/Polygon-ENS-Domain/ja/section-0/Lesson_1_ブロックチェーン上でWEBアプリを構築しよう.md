### 👋 Polygon ENS Domain 開発プロジェクトへようこそ!

このプロジェクトでは、イーサリアムサイドチェーンのPolygon上に支払い機能を持ったドメインネームサービスアプリを実装し、実際にミントして使いこなすことを目的とします。

プロジェクトを進めるには以下の技術が必要です。

- [Terminal 操作](https://qiita.com/ryouzi/items/f9dee1540a04a0bfb9a3)
- [Javascript](https://developer.mozilla.org/ja/docs/Web/JavaScript)
- [React.js](https://ja.reactjs.org/)

いますべてを理解している必要はありません。
わからないことがあったらインターネットで検索したり、コミュニティで質問しながらプロジェクトを進めていきましょう!

### ⛓ ブロックチェーンとは何か？

ブロックチェーンとは、互いに通信するコンピュータ（ノード）のピアツーピア・ネットワークです。

参加者全員がネットワークの運営を分担する分散型ネットワークですので、各ネットワークの参加者は、ブロックチェーン上のコードとデータのコピーを維持します。

これらのデータはすべて、「ブロック」と呼ばれる記録の束に含まれており、それらが「連鎖」してブロックチェーンを構成しています。

ネットワーク上のすべてのノードは、コードとデータがいつでも変更可能な中央集権型のアプリケーションとは異なり、このデータが安全で変更不可能であることを保証しています。これがブロックチェーンを強力なものにしているのです ✨

ブロックチェーンはデータの保存を担っているため、根本的にはデータベースです。

そして、互いに会話するコンピュータのネットワークですから、ネットワークとなります。ネットワークとデータベースが一体化したものと考えればよいでしょう。

また、従来のWebアプリケーションとブロックチェーンアプリケーションの根本的な違いとして、アプリケーションは、ユーザーのデータを一切管理しません。ユーザーのデータは、ブロックチェーンによって管理されています。

### 🥫 スマートコントラクトとは何か？

スマートコントラクトとは、ブロックチェーン上でコントラクト（＝契約）を自動的に実行するしくみです。

よくたとえられるのは、自動販売機です。自動販売機には「100円が投下され、ボタンが押されたら、飲み物を落とす」というプログラムが搭載されており、「店員さんがお金を受け取って飲み物を渡す」というプロセスを必要としません。

人の介在を省き、自動的にプログラムが実行される点こそ、スマートコントラクトが、「スマート」と呼ばれる理由です。

実際には、スマートコントラクトのしくみは、イーサリアムネットワーク上のすべてのコンピュータに複製され、処理されるプログラムにより成り立っています。

イーサリアムの汎用性により、そのネットワーク上にアプリケーションを構築できます。

スマートコントラクトのコードはすべてイミュータブル（不変）、つまり**変更不可**能です。

つまり、スマートコントラクトをブロックチェーンにデプロイすると、コードを変更したり更新できなくなるのです。

これは、コードの信頼性と安全性を確保するための設計上の特徴です。

私はよくスマートコントラクトをWeb上のマイクロサービスにたとえます。ブロックチェーンからデータを読み書きしたり、ビジネスロジックを実行したりするためのインタフェースとして機能するのです。これらはパブリックにアクセス可能で、ブロックチェーンにアクセスできる人なら誰でもそのインタフェースにアクセスできることを意味します。

### 📱 dApps とは何か？

dAppsは、**分散型アプリケーション（decentralized Application）** の略です。

dAppsは、ブロックチェーン上に構築されたスマートコントラクトと、フロントエンドであるユーザーインタフェース（Webサイトなど）を組み合わせたアプリケーションのことを指します。

dAppsは、イーサリアムのプログラミング言語であるSolidityを基盤に構築されています。

イーサリアムでは、スマートコントラクトはオープンAPIのように誰でもアクセスできます。よって、ほかの人が書いたスマートコントラクトも、あなたのWebアプリケーションから呼び出すことができます。逆も然りです。

### 🛠 何を構築するのか？

CoolDomainsと呼ばれる **ブロックチェーン上でドメインネームサービス** を構築します。

CoolDomainsでは、以下の機能を実装します。

**ドメインネームサービスを通して、ユーザーがスマートコントラクトとやりとりし独自ドメインを発行できる機能を実装します。**

Solidityでバックエンドを実装し、Reactでフロントエンドを構築します。

### 🌍 プロジェクトをアップグレードする

この学習コンテンツは、[Attribution-ShareAlike 4.0 International](https://creativecommons.org/licenses/by-sa/4.0/) © 2022 buildspaceのライセンス及び [UNCHAIN License](https://github.com/unchain-dev/UNCHAIN-projects/blob/main/LICENSE) のもとで運用されています。

プロジェクトに参加していて、「こうすればもっと分かりやすいのに!」「これは間違っている!」と思ったら、ぜひ`pull request`を送ってください。

GitHubから直接コードを編集して直接`pull request`を送る方法は、[こちら](https://docs.github.com/ja/repositories/working-with-files/managing-files/editing-files#editing-files-in-another-users-repository)を参照してください。

どんなリクエストでも大歓迎です 🎉

また、プロジェクトを自分のGitHubアカウントに`Fork`して、中身を編集してから`pull request`を送ることもできます。

- プロジェクトを`Fork`する方法は、[こちら](https://docs.github.com/ja/get-started/quickstart/fork-a-repo) を参照してください。
- `Fork`から`pull request`を作成する方法は、[こちら](https://docs.github.com/ja/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request-from-a-fork) です。

### ⚡️ `Issue`を作成する

`pull request`送るほどでもないけど、提案を残したい!　と思ったら、[こちら](https://github.com/shiftbase-xyz/UNCHAIN-projects/issues) に`Issue`を作成してみましょう。

`Issue`の作成方法に関しては、[こちら](https://docs.github.com/ja/issues/tracking-your-work-with-issues/creating-an-issue)を参照してください。

`pull request`や`issue`の作成は実際にチームで開発する際、重要な作業になるので、ぜひトライしてみてください。

UNCHAINのプロジェクトをみんなでより良いものにしていきましょう ✨

---

それでは次のレッスンに進みましょう!

---

Attribution: This learning content is licensed under [Attribution-ShareAlike 4.0 International](https://creativecommons.org/licenses/by-sa/4.0/) © 2022 buildspace. 
Sharelike: Translations and modifications to markdown documents.

Documentation created by [teruj](https://github.com/teruj)（UNCHAIN discord ID: takotaro#8346）
