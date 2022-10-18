### 👋 dApp 開発プロジェクトへようこそ!

このプロジェクトでは, `Avalanche` にスマートコントラクトを実装して, スマートコントラクトとやりとりできる独自の Web アプリケーションを構築します。

このプロジェクトでは以下の技術が必要です。

- Terminal 基本操作
- Solidity
- HTML/CSS
- [TypeScript](https://typescriptbook.jp/overview/features)
- [React.js](https://ja.reactjs.org/)

いますべてを理解している必要はありません。  
わからないことがあったらインターネットで検索したり,コミュニティで質問しながらプロジェクトを進めていきましょう!

`Avalanche`での開発が初めての方や, `hardhat`でスマートコントラクトのテストを書いたご経験の無い方は [AVAX-messenger](https://app.unchain.tech/learn/AVAX-messenger) により詳しく解説がありますので先にそちらを進めるとスムーズかと思います。

### 🛠 何を構築するのか？

`Miniswap` という **分散型 Web アプリケーション（dApp）** を構築します。

`Miniswap` は `AMM` の機能を搭載したスマートコントラクトと, スマートコントラクトとユーザの仲介をするフロントエンドのコードによって作成します。

スマートコントラクトに `Solidity`,  
フロントエンドに`TypeScript` + `React.js` + `Next.js` を使用します。

今回は作成したスマートコントラクトを, [FUJI C-Chain](https://docs.avax.network/quickstart/fuji-workflow)へデプロイします。

Avalanche と C-Chain に関する概要は[こちら](https://app.unchain.tech/learn/AVAX-messenger/section-0_lesson-1)をご覧ください。

### 🪙 Defi と DEX と AMM

🐦 Defi (分散型金融)

ブロックチェーンのネットワーク上に構築される, 中心となる管理者がいない金融のエコシステムです。

DeFi の主なメリットとして, コードで管理されたシステムであることやユーザが資産を自身で管理するという点から,  
既存金融にあったコストやシステム上の摩擦を軽減することができます。

暗号通貨が貨幣として正常に機能する場合,  
Defi がオープンで低価格な点は, 現在の金融システムを利用できない低所得者も利用できるなどのメリットにも繋がります。

一方, 手数料の高騰が起こり得ることや, ユーザーは資産を自身で管理しなければいけず責任の所在はユーザーにある点などはデメリットとして挙げられます。

[参考記事](https://academy.binance.com/ja/articles/the-complete-beginners-guide-to-decentralized-finance-defi)

🦏 DEX(分散型取引所)

DEX は, AVAX-USDC ペアのような 2 つのトークン間で取引を行うことにより, 誰でもブロックチェーン上で暗号通貨トークンを交換することができる取引所です。  
Defi の 1 種です。

Binance などの中央集権型の取引所（CEX）は, 買い手と売り手のマッチングに注文書を使用するオンライン取引プラットフォームです。  
オンライン証券口座と似たような仕組みで, 投資家に人気があります。

PancakeSwap や Uniswap などの分散型取引所（DEX）は, 暗号通貨トレーダーが保有資産を変換できるスマートコントラクトを搭載した自己完結型の金融プロトコルです。

分散型取引所はメンテナンスの作業を減らすことができるので, 中央集権型の取引所よりも一般的に取引手数料が安価です。

🐅 AMM(自動マーケットメーカー)

AMM とは数式に基づいて自動化されたトレードシステムで, 多くの DEX が採用しています。

詳細は実装に依存しますが, 最も有名な DEX の 1 つである Uniswap の実装を参考に本プロジェクトを進めます。

### 🚀 Avalanche と Defi

DeFi は大きく成長している領域ですが, 高騰した手数料にユーザーが苦しめられるなどの課題もあります。

Avalanche で Defi を構築することは以下のようなメリットを与えます。

以下, [medium Avalanche: 新しい DeFi ブロックチェーンを解説](https://medium.com/ava-labs-jp/avalanche-%E6%96%B0%E3%81%97%E3%81%84defi%E3%83%96%E3%83%AD%E3%83%83%E3%82%AF%E3%83%81%E3%82%A7%E3%83%BC%E3%83%B3%E3%82%92%E8%A7%A3%E8%AA%AC-fdf231906e4d)より抜粋

アクセス性 — Avalanche でのトランザクションコストが低いことは, 小規模取引の方が資金的に有利であることを意味し, 小規模なプレイヤーやエントリーレベルの投資家に DeFi のエコシステムを開放します。  
ユーザーエクスペリエンスはまだ複雑で, 新規参入にとって大きな障壁となっていますが, この分野の改善により DeFi 領域でより広範な参加者の流入につなげられる可能性があります。

低スリッページ — Ethereum ブロックチェーンの速度は遅くオンチェーン取引を行う際には、大きなスリッページや処理の失敗が発生します。  
Avalanche ネットワークの高速なトランザクションレートと高いスループットは, 最小限の価格スリッページとインスタント取引への扉を開き, DEX でのトレードエクスペリエンスを中央集権型の取引のそれに近づけます。

### 🌍 プロジェクトをアップグレードする

[UNCHAIN](https://app.shiftbase.xyz) のプロジェクトはすべてオープンソース（[MIT ライセンス](https://wisdommingle.com/mit-license/)）で運用されています。

プロジェクトに参加していて,「こうすればもっと分かりやすいのに!」「これは間違っている!」と思ったら,ぜひ `pull request` を送ってください。

GitHub から直接コードを編集して直接 `pull request` を送る方法は,[こちら](https://docs.github.com/ja/repositories/working-with-files/managing-files/editing-files#editing-files-in-another-users-repository)を参照してください。

どんなリクエストでも大歓迎です 🎉

また,プロジェクトを自分の GitHub アカウントに `Fork` して,中身を編集してから `pull request` を送ることもできます。

- プロジェクトを `Fork` する方法は,[こちら](https://docs.github.com/ja/get-started/quickstart/fork-a-repo) を参照してください。
- `Fork` から `pull request` を作成する方法は,[こちら](https://docs.github.com/ja/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request-from-a-fork) です。

**👋 `UNCHAIN-projects` に `pull request` を送る! ⏩ [UNCHAIN の GitHub](https://github.com/shiftbase-xyz/UNCHAIN-projects) にアクセス!**

### ⚡️ `Issue` を作成する

`pull request` 送るほどでもないけど,提案を残したい!　と思ったら,[こちら](https://github.com/shiftbase-xyz/UNCHAIN-projects/issues) に `Issue` を作成してみましょう。

`Issue` の作成方法に関しては,[こちら](https://docs.github.com/ja/issues/tracking-your-work-with-issues/creating-an-issue)を参照してください。

`pull request` や `issue` の作成は実際にチームで開発する際,重要な作業になるので,ぜひトライしてみてください。

UNCHAIN のプロジェクトをみんなでより良いものにしていきましょう ✨

> Windows を使用している方へ  
> Windows をお使いの場合は,[Git for Windows](https://gitforwindows.org/) をダウンロードし,それに付属する Git Bash を使うことをお勧めします。  
> 本手順では UNIX 固有のコマンドをサポートしています。  
> [Windows Subsystem for Linux (WSL)](https://docs.microsoft.com/en-us/windows/wsl/install) も選択肢の一つです。

---

次のレッスンに進んでプログラミングの環境構築しましょう 🎉
