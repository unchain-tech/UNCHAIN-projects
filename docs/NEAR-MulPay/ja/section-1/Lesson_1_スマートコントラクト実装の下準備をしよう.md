### 📜 スマートコントラクト実装の下準備をしよう

早速実装に入りたいところですが、その前に必要なファイルの作成などの準備をしましょう。

フォルダ構成は下のようになっているはずです。

```
MulPay_contract/
├── README.md
├── artifacts/
├── cache/
├── contracts/
├── hardhat.config.ts
├── node_modules/
├── package-lock.json
├── package.json
├── scripts/
├── src/
├── test/
├── tsconfig.json
├── typechain-types/
└── yarn.lock
```

この中の`contracts`フォルダに`ERC20Tokens.sol`と`Swap.sol`というファイルを作成してください。

また、`test`フォルダには`swap.test.ts`を作成してください。元々あった`Lock.ts`は削除してください。

これらのファイルにはそれぞれ下のようなことを記述していきます。

`ERC20Tokens.sol`:MulPay アプリの中で使う ERC20 規格のトークンを複数種類発行する。
`Swap.sol`:任意のトークンのペアに対して swap ができる、送金ができる。
`swap.test.ts`:swap が機能しているかをテストする。

次に`MulPay_contract`直下に`.env`ファイルを作成してください。そのファイルに以下の内容を追記してください。

`YOUR_WALLET_PRIVATE_KEY`には自分の持っているウォレットの private key を入れてください。ここには先ほど metamask で作成した wallet の private key を入れてください。

[`.env`]

```
AURORA_PRIVATE_KEY="YOUR_WALLET_PRIVATE_KEY"
```

最後に`hardhat.config.ts`を下のように編集しましょう。

ここには aurora テストネットとデプロイするアドレスの情報を書いていきます。

[`hardhat.config.ts`]

```
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@typechain/hardhat";
require("dotenv").config();

const config: HardhatUserConfig = {
  solidity: "0.8.0",
  networks: {
    testnet_aurora: {
      url: "https://testnet.aurora.dev",
      accounts: [process.env.AURORA_PRIVATE_KEY!],
    },
  },
};

export default config;
```

これで下準備は完了です。

### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discord の `#section-1` で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の 4 点を記載してください ✨

```
1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット
```

---

section-1-Lesson-1 の完了おめでとうございます！

では次のセクションではいよいよスマートコントラクトの実装に移っていきましょう！
