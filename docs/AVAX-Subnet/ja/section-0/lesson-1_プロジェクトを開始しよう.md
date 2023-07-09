### 👋 dApp 開発プロジェクトへようこそ!

このプロジェクトでは、独自ブロックチェーン+スマートコントラクト+フロントエンドを実装し、Webアプリケーションを構築します。

> ⚠️ 本プロジェクトはWindowsをサポートしておりません。  
> 本プロジェクトで使用するツール`Avalanche-CLI`はLinuxとMacの環境で使用可能であり、現在Windowsはサポートされておりません。  
> Windowsをご使用は[こちら](https://app.stackup.dev/quest_page/beginner-quest-4-create-evm-subnet-on-local-network)のチュートリアルにある、Windowsの方向け(GitPodの使用)の`Avalanche-CLI`の使い方が載っていますので参考になるかもしれません。

このプロジェクトでは以下の技術が必要です。

- `Terminal`基本操作
- Solidity
- HTML/CSS
- [TypeScript](https://typescriptbook.jp/overview/features)
- [React.js](https://ja.reactjs.org/)

いますべてを理解している必要はありません。  
わからないことがあったらインターネットで検索したり、コミュニティで質問しながらプロジェクトを進めていきましょう!

`Avalanche`での開発が初めての方や、`hardhat`でスマートコントラクトのテストを書いたご経験の無い方は [AVAX-Messenger](https://app.unchain.tech/learn/AVAX-Messenger) により詳しく解説がありますので先にそちらを進めるとスムーズかと思います。

### 🛠 何を構築するのか？

**ブロックチェーンの作成**

AvalancheのSubnetという機能を利用して、独自ブロックチェーンをローカルマシン上に構築します。

Avalancheの用意するテンプレートVMを使用して、管理者がネットワークへのユーザアクセス（コントラクトのデプロイやトランザクションの提出など）を制限できるようなブロックチェーンネットワークを作成します。

**dappの作成**

銀行の行っている手形取引をスマートコントラクトで管理するアプリを作成します。

スマートコントラクトは独自ブロックチェーン上にデプロイします。

フロントエンドは独自ブロックチェーンに接続し、スマートコントラクトとデータをやり取りします。

スマートコントラクトに`Solidity`、 
フロントエンドに`TypeScript` + `React.js` + `Next.js`を使用します。

今回は作成したスマートコントラクトを、[FUJI C-Chain](https://docs.avax.network/quickstart/fuji-workflow)へデプロイします。

AvalancheとC-Chainに関する概要は[こちら](https://app.unchain.tech/learn/AVAX-Messenger/ja/0/1/)をご覧ください。  

### 🌍 プロジェクトをアップグレードする

[UNCHAIN](https://unchain.tech/) のプロジェクトは [UNCHAIN License](https://github.com/unchain-dev/UNCHAIN-projects/blob/main/LICENSE) により運用されています。

プロジェクトに参加していて,「こうすればもっと分かりやすいのに!」「これは間違っている!」と思ったら,ぜひ`pull request`を送ってください。

`GitHub`から直接コードを編集して直接`pull request`を送る方法は,[こちら](https://docs.github.com/ja/repositories/working-with-files/managing-files/editing-files#editing-files-in-another-users-repository)を参照してください。

どんなリクエストでも大歓迎です 🎉

また、プロジェクトを自分の`GitHub`アカウントに`Fork`して,中身を編集してから`pull request`を送ることもできます。

- プロジェクトを`Fork`する方法は,[こちら](https://docs.github.com/ja/get-started/quickstart/fork-a-repo) を参照してください。
- `Fork`から`pull request`を作成する方法は,[こちら](https://docs.github.com/ja/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request-from-a-fork) です。

**👋 `UNCHAIN-projects`に`pull request`を送る! ⏩ [UNCHAIN の GitHub](https://github.com/shiftbase-xyz/UNCHAIN-projects) にアクセス!**

### ⚡️ `Issue`を作成する

`pull request`送るほどでもないけど,提案を残したい!　と思ったら,[こちら](https://github.com/unchain-tech/UNCHAIN-projects/issues) に`Issue`を作成してみましょう。

`Issue`の作成方法に関しては,[こちら](https://docs.github.com/ja/issues/tracking-your-work-with-issues/creating-an-issue)を参照してください。

`pull request`や`issue`の作成は実際にチームで開発する際,重要な作業になるので,ぜひトライしてみてください。

`UNCHAIN`のプロジェクトをみんなでより良いものにしていきましょう ✨

---

次のレッスンに進んでプログラミングの環境構築しましょう 🎉

---

Documentation created by [ryojiroakiyama](https://github.com/ryojiroakiyama)（UNCHAIN discord ID: rakiyama#8051）
