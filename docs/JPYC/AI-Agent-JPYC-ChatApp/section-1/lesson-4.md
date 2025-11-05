---
title: MCPについて
---

### 🔌 MCP（Model Context Protocol）とは？

MCP（Model Context Protocol）は、**AI Agentとツールやデータソースをつなぐための標準化されたプロトコル**です。

Anthropic社によって発表され、AI Agentが外部のツールやサービスを統一的な方法で利用できるようにします。  

その後、Google CloudがAgent 2 Agentプロトコルを発表したこともあり、デファクトスタンダードとなりました。

### 🤔 なぜMCPが必要なのか？

AI Agentを開発する際、以下のような課題がありました：

**課題1：ツール統合の複雑さ**

各ツールやAPIごとに異なる実装方法を学ぶ必要がありました。

```typescript
// それぞれのツールで異なる実装が必要だった
await weatherAPI.getCurrentWeather(location);
await databaseClient.query(sql);
await blockchainRPC.sendTransaction(tx);
```

**課題2：再利用性の低さ**

ツールを別のプロジェクトで使いたい場合、コードを大幅に書き直す必要がありました。

**課題3：標準化の欠如**

AI Agentとツール間のインタフェースに統一性がなく、開発者ごとに異なる実装がされていました。

### ✨ MCPが解決すること

MCPは**統一されたインタフェース**を提供し、すべてのツールが同じプロトコルで通信できるようにします。

これにより：

- **一度作成したツールを複数のAI Agentで再利用できる**
- **新しいツールを追加する際の学習コストが低い**
- **AI Agentフレームワーク間でツールを共有できる**
   - Mastraで利用
   - Agent Development Kitで利用
   - Strands Agentで利用

### 🏗 MCP のアーキテクチャ

MCPは、**サーバー**と**クライアント**の2つのコンポーネントで構成されます：

#### MCPサーバー（Server）

ツールやデータソースを提供する側です。

**役割：**
- ツールの定義と実装（具体的な処理内容）
- ツールのメタデータ（名前、説明、パラメータ）の公開
- ツールの実行と結果の返却

#### MCPクライアント（Client）

AI Agentからツールを利用する側です。

**役割：**
- MCPサーバーへの接続
- 利用可能なツールの取得
- ツールの呼び出しリクエスト送信
- 実行結果の受け取り

### 📡 MCP の通信フロー

MCPの典型的な通信フローは以下の通りです：

```bash
1. ユーザー → AI Agent
   「残高を教えて」

2. AI Agent → MCP Client
   適切なツールを選択

3. MCP Client → MCP Server
   ツール呼び出しリクエスト
   {
     "tool": "jpyc_balance",
     "parameters": { "address": "0x123..." }
   }

4. MCP Server
   ツールを実行して結果を返す
   {
     "balance": "1000",
     "chainName": "Ethereum Sepolia"
   }

5. AI Agent → ユーザー
   「Ethereum Sepoliaチェーンの残高は1,000 JPYCです」
```

### 🛠 ツールの構成要素

MCPのツールは、以下の要素で構成されます：

**1. 識別子（ID）**
- ツールを一意に識別する名前
- 例：`jpyc_balance`、`jpyc_transfer`

**2. 説明（Description）**
- AI Agentがツールの用途を理解するための説明文
- 例：「指定したアドレスのJPYC残高を照会します」

**3. 入力スキーマ（Input Schema）**
- ツールが受け取るパラメータの定義
- データ型、必須/任意、説明などを含む

**4. 実行ロジック（Execute）**
- 実際の処理を行う関数
- パラメータを受け取り、結果を返す

### 💡 MCP の利点

**開発者にとって**
- ツールを一度実装すれば、複数のプロジェクトで再利用できる
- 標準化されたインタフェースで開発が容易
- テストとデバッグがしやすい

**AI Agentにとって**
- 多様なツールに統一的な方法でアクセスできる
- ツールの機能を自動的に理解できる
- エラーハンドリングが統一される

**ユーザーにとって**
- より多機能なAI Agentを利用できる
- 信頼性の高いサービスを受けられる

### 🌐 MCP のエコシステム

MCPは、様々なAI Agentフレームワークで利用できます：

- **Mastra**:   
   TypeScriptベースのモダンなフレームワーク
- **LangChain**:   
   Python/TypeScriptの人気フレームワーク
- **Agent Development Kit**:   
   Google製のマルチAI Agentに対応したフレームワーク
- **Strands Agent**:   
   AWS製のフレームワーク
- **AutoGPT**:   
   自律型Agentフレームワーク

また、様々なLLMプロバイダーと組み合わせて使用できます：
- Claude（Anthropic）
- GPT-4（OpenAI）
- Gemini（Google）

### 📝 このプロジェクトでの MCP

このプロジェクトでは、以下のような構成でMCPを活用します：

**MCPサーバー**
- JPYC操作のためのツールを提供
- HTTP/SSEで通信
- ポート3001で起動

**MCPクライアント**（Mastraのレッスンで実装）
- Mastraフレームワーク経由でMCPサーバーに接続
- AI Agentにツールを提供

**提供するツール：**
1. `jpyc_balance` - 残高照会
2. `jpyc_transfer` - 送信
3. `jpyc_switch_chain` - チェーン切り替え
4. `jpyc_get_current_chain` - 現在のチェーン取得
5. `jpyc_total_supply` - 総供給量照会

### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discordの`#jpyc`で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の4点を記載してください ✨

1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット

---

次のレッスンでは、Mastraについて学びます！
