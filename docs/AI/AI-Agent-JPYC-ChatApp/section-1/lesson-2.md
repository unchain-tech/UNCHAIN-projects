---
title: JPYC SDKについて
---

### 🛠 JPYC SDK とは？

JPYC SDK（`@jpyc/sdk-core`）は、JPYCコントラクトと簡単にやり取りできるNodeJS向けのインタフェースです。

ブロックチェーンの複雑な処理を抽象化し、開発者が簡単にJPYC機能を実装できるようになっています。このSDKは[JPYC v2コントラクト](https://github.com/jcam1/JPYCv2)に対応しており、複数のブロックチェーンネットワークをサポートしています。

### ✨ JPYC SDK の今回のプロジェクトでの使用例

**1. 総供給量取得**

JPYCの総供給量を取得します。

```typescript
const totalSupply = await jpyc.totalSupply();
console.log(`総供給量: ${totalSupply.toString()}`);
```

**2. 残高取得**

ユーザーのJPYC残高を取得します。

```typescript
const balance = await jpyc.balanceOf(address);
console.log(`残高: ${balance} JPYC`);
```

**3. 送信処理**

指定したアドレスにJPYCを送信します。

```typescript
const tx = await jpyc.transfer(
  recipientAddress,
  amount
);
console.log(`送信完了: ${tx.hash}`);
```

### 📦 JPYC SDK のインストール

JPYC SDKは、npmまたはyarnを使ってインストールできます：

```bash
# npm
npm i @jpyc/sdk-core

# または yarn
yarn add @jpyc/sdk-core
```

### 🔧 JPYC SDK の初期化

JPYC SDKを使用するには、以下の4ステップで初期化を行います：

```typescript
import { JPYC, SdkClient } from '@jpyc/sdk-core';

// 1. SdkClientインスタンスを初期化
const sdkClient = new SdkClient({
  chainId: 137, // Polygon PoS
  rpcUrl: 'YOUR_RPC_ENDPOINT_URL',
});

// 2. 秘密鍵からEOA（外部所有アカウント）を設定
const account = sdkClient.configurePrivateKeyAccount({
  privateKey: 'YOUR_PRIVATE_KEY',
});

// 3. アカウントを使ってウォレットクライアントを設定
const client = sdkClient.configureClient({
  account,
});

// 4. クライアントを使ってJPYCインスタンスを初期化
const jpyc = new JPYC({
  env: 'prod', // 'prod' または 'local'
  contractType: 'jpyc', // 'jpyc' または 'jpycPrepaid'
  localContractAddress: undefined, // ローカルネットワーク使用時のみ設定
  client,
});
```

**重要なポイント**：

- SDKは環境変数を暗黙的に使用しません。秘密鍵などの機密データは安全にロードしてください
- `chainId`には後述のサポートされているチェーンIDを使用します
- 本番環境では`env: 'prod'`、ローカル開発では`env: 'local'`を指定します

### 🌐 サポートするネットワーク

JPYC SDKは、JPYCが発行されている3つのチェーンとテストネットでサポートされています。
- Ethereum Mainnet
- Ethereum Sepolia Testnet
- Polygon PoS Mainnet
- Polygon Amoy Testnet
- Avalanche Mainnet
- Avalanche Fuji Testnet

このプロジェクトでは、**各テストネット**を使用します。

### 📚 このプロジェクトでの JPYC SDK の役割

このプロジェクトでは、JPYC SDKをMCP（Model Context Protocol）サーバーに統合します。

MCPサーバーがJPYC SDKを使用してブロックチェーン操作を行い、AI Agentがそれを自然言語で制御します。

それではAI AgentやMCPについて次のセクション以降で学んでいきましょう！

### 📖 参考資料

- [JPYC SDK公式ドキュメント](https://jcam1.github.io/sdks/)
- [JPYC SDK GitHub リポジトリ](https://github.com/jcam1/sdks)
- [JPYC v2コントラクト](https://github.com/jcam1/JPYCv2)

### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discordの`#jpyc`で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の4点を記載してください ✨

1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット

---

次のレッスンでは、AI Agentについて学びます！
