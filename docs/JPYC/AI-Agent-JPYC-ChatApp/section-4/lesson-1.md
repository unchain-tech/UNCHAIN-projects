---
title: LLMモデルの設定
---

### 🤖 LLM モデルの設定

このレッスンでは、AI Agentが使用するLLM（大規模言語モデル）を設定します。

このプロジェクトでは、Claude、OpenAI、Geminiの3つのLLMプロバイダーをサポートします。

環境変数に応じて、いずれかのモデルを選択できるようになっています。

### 📝 実装するファイル

`src/lib/mastra/model/index.ts`ファイルを作成し、以下のコードを記述します。

まず、ファイルを作成します：

```bash
cd jpyc-ai-agent

mkdir -p src/lib/mastra/model
touch src/lib/mastra/model/index.ts
```

以下のコードを記述します：

```typescript
import { anthropic } from "@ai-sdk/anthropic";
import { google } from "@ai-sdk/google";
import { createOpenAI } from "@ai-sdk/openai";

// Claude 3.5 Sonnetモデルを使用
const claude = anthropic("claude-sonnet-4-0");

// Mastra用のOpenAIプロバイダーを作成
const openai = createOpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

// gpt-4o-miniモデルを使用（安価で高速、推論トークンなし）
const gpt4oMiniModel = openai("gpt-4o-mini");
const gemini = google("gemini-2.5-pro");

export { claude, gemini, gpt4oMiniModel };
```

### 💡 コードの解説

このファイルは、AI Agentが使用するLLMモデルを設定します。  

主要なポイントを見ていきましょう。

#### 1. ai-sdkパッケージ

```typescript
import { anthropic } from "@ai-sdk/anthropic";
import { google } from "@ai-sdk/google";
import { createOpenAI } from "@ai-sdk/openai";
```

`ai-sdk`は、Vercel社が開発した統一LLM APIライブラリです。  
複数のLLMプロバイダー（Claude、OpenAI、Geminiなど）を同じインタフェースで扱えるようにします。

Mastraは、内部で`ai-sdk`を使用してLLMと通信します。

#### 2. Anthropic Claude

```typescript
const claude = anthropic("claude-sonnet-4-0");
```

Anthropic社のClaude Sonnet 4.0モデルを使用します。  
**このプロジェクトでは、Claudeを推奨モデルとして設定しています。**

#### 3. OpenAI GPT-4o-mini

```typescript
const openai = createOpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

const gpt4oMiniModel = openai("gpt-4o-mini");
```

OpenAI社のGPT-4o-miniモデルを使用します。

#### 4. Google Gemini

```typescript
const gemini = google("gemini-2.5-pro");
```

Google社のGemini 2.5 Proモデルを使用します。

#### 5. エクスポート

```typescript
export { claude, gemini, gpt4oMiniModel };
```

3つのモデルをエクスポートすることで、次のレッスンでAI Agentを作成する際に好きなモデルを選択できるようにします。

**※このプロジェクトでは、Claudeを推奨モデルとして設定しています。**

### 🔑 環境変数の設定

各LLMモデルを使用するには、対応するAPIキーを`.env.local`ファイルに設定する必要があります。

```.env
# 環境変数の例
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-proj-...
GOOGLE_GENERATIVE_AI_API_KEY=...
```

> **重要：** 環境変数は、Next.jsアプリケーションの起動時に読み込まれます。
> 
> 環境変数を変更した場合は、アプリケーションを再起動してください。

このプロジェクトでは、次のレッスンでAI Agentを作成する際に、`claude`を使用します。

### 🧪 動作確認

この段階では、まだAI Agentが完成していないため、動作確認はできません。

次のレッスンでMCPクライアントを作成し、その後AI Agentを実装することで、LLMモデルが動作することを確認できます。

### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discordの`#jpyc`で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の4点を記載してください ✨

1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット

---

次のレッスンでは、MCPサーバーと通信するためのMCPクライアントを作成します！
