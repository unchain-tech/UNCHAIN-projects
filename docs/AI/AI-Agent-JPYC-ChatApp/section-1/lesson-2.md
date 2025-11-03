---
title: JPYC SDKについて
---

### 🛠 JPYC SDK とは？

JPYC SDKは、JPYCを簡単に操作するためのTypeScript/JavaScriptライブラリです。

ブロックチェーンの複雑な処理を抽象化し、開発者が簡単にJPYC機能を実装できるようにします。

### ✨ JPYC SDK の主な機能

**1. 残高照会**

ユーザーのJPYC残高を取得します。

```typescript
const balance = await jpycClient.getBalance(address);
console.log(`残高: ${balance} JPYC`);
```

**2. 送金処理**

指定したアドレスにJPYCを送金します。

```typescript
const tx = await jpycClient.transfer(
  recipientAddress,
  amount
);
console.log(`送金完了: ${tx.hash}`);
```

**3. トランザクション履歴の取得**

過去の取引履歴を取得します。

```typescript
const transactions = await jpycClient.getTransactionHistory(
  address
);
```

**4. 承認（Approve）処理**

スマートコントラクトがJPYCを操作できるように承認します。

```typescript
const approveTx = await jpycClient.approve(
  spenderAddress,
  amount
);
```

### 📦 JPYC SDK のインストール

JPYC SDKは、npmまたはyarnを使ってインストールできます：

```bash
npm install @jpyc/sdk
```

または

```bash
yarn add @jpyc/sdk
```

### 🔧 JPYC SDK の初期化

JPYC SDKを使用するには、まず初期化が必要です：

```typescript
import { JPYCClient } from '@jpyc/sdk';
import { ethers } from 'ethers';

// ウォレットプロバイダーを作成
const provider = new ethers.JsonRpcProvider(RPC_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

// JPYC クライアントを初期化
const jpycClient = new JPYCClient({
  network: 'polygon', // 使用するネットワーク
  signer: wallet,     // 署名用のウォレット
});
```

### 🌐 サポートするネットワーク

JPYC SDKは、複数のブロックチェーンネットワークに対応しています：

- `ethereum` - イーサリアムメインネット
- `polygon` - Polygon（旧Matic）ネットワーク
- `avalanche` - Avalanche C-Chain
- `gnosis` - Gnosis Chain

このプロジェクトでは、**Polygonネットワーク**を使用します。

### 💰 残高確認の詳細

残高確認は、最も基本的な操作です：

```typescript
// 残高を取得（Wei単位）
const balanceWei = await jpycClient.getBalance(userAddress);

// 人間が読める形式に変換（JPYC単位）
const balanceJPYC = ethers.formatUnits(balanceWei, 18);

console.log(`残高: ${balanceJPYC} JPYC`);
```

JPYCは18桁の小数点精度を持つため、`formatUnits`関数で変換します。

### 📤 送金処理の詳細

送金処理では、以下のパラメータを指定します：

```typescript
const tx = await jpycClient.transfer(
  recipientAddress,  // 送金先アドレス
  amount            // 送金額（Wei単位）
);

// トランザクションの完了を待つ
await tx.wait();

console.log(`送金完了: ${tx.hash}`);
```

**注意点**：
- `amount`はWei単位で指定する必要があります
- 送金には少額のMATIC（Polygonの手数料用トークン）が必要です

### 📊 トランザクション履歴の取得

過去の取引履歴を取得し、分析することができます：

```typescript
const transactions = await jpycClient.getTransactionHistory(
  userAddress,
  {
    startBlock: 0,        // 検索開始ブロック
    endBlock: 'latest',   // 検索終了ブロック
    limit: 100            // 取得件数の上限
  }
);

transactions.forEach(tx => {
  console.log(`
    日時: ${new Date(tx.timestamp * 1000).toLocaleString()}
    送信元: ${tx.from}
    送信先: ${tx.to}
    金額: ${ethers.formatUnits(tx.value, 18)} JPYC
  `);
});
```

### 🔐 セキュリティのベストプラクティス

**1. 秘密鍵の管理**

秘密鍵は絶対に公開してはいけません：

```typescript
// ❌ 悪い例：秘密鍵をハードコーディング
const PRIVATE_KEY = "0x1234...";

// ✅ 良い例：環境変数から読み込む
const PRIVATE_KEY = process.env.PRIVATE_KEY;
```

**2. 送金額の検証**

送金前に金額を検証します：

```typescript
// 残高を確認
const balance = await jpycClient.getBalance(senderAddress);

if (balance < amount) {
  throw new Error('残高不足です');
}

// 送金処理
await jpycClient.transfer(recipientAddress, amount);
```

**3. エラーハンドリング**

ブロックチェーン操作は失敗する可能性があるため、適切なエラーハンドリングが重要です：

```typescript
try {
  const tx = await jpycClient.transfer(recipientAddress, amount);
  await tx.wait();
  console.log('送金成功');
} catch (error) {
  console.error('送金失敗:', error.message);
  // エラーに応じた適切な処理
}
```

### 🧪 テストネット環境

開発中は、テストネット環境を使用することを推奨します：

```typescript
// Polygon Mumbai テストネット
const jpycClient = new JPYCClient({
  network: 'polygon-mumbai',
  signer: wallet,
});
```

テストネットでは、実際の資産を使わずに開発・テストができます。

### 📚 このプロジェクトでの JPYC SDK の役割

このプロジェクトでは、JPYC SDKをMCP（Model Context Protocol）サーバーに統合します。

MCPサーバーがJPYC SDKを使用してブロックチェーン操作を行い、AI Agentがそれを自然言語で制御します。

具体的な統合方法は、セクション3とセクション4で詳しく学びます。

### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discordの`#ai`で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の4点を記載してください ✨

1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット

---

次のレッスンでは、AI Agentについて学びます！
