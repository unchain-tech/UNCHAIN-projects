### 📜 スマートコントラクト実装の下準備をしよう

早速実装に入りたいところですが、その前に必要なファイルの作成などの準備をしましょう。

フォルダ構成は下のようになっているはずです。

```
contract/
├── README.md
├── artifacts/
├── cache/
├── contracts/
├── hardhat.config.ts
├── package.json
├── scripts/
├── test/
├── tsconfig.json
└── typechain-types/
```

この中の`contracts`フォルダに`ERC20Tokens.sol`と`Swap.sol`というファイルを作成してください。元々あった`Lock.sol`は削除してください。

また、`test`フォルダには`swap.test.ts`を作成してください。元々あった`Lock.ts`は削除してください。

これらのファイルにはそれぞれ下のようなことを記述していきます。

`ERC20Tokens.sol`:MulPayアプリの中で使うERC20規格のトークンを複数種類発行する。
`Swap.sol`:任意のトークンのペアに対してswapができる、送金ができる。
`swap.test.ts`:swapが機能しているかをテストする。

次に`contract`直下に`.env`ファイルを作成してください。そのファイルに以下の内容を追記してください。

`YOUR_WALLET_PRIVATE_KEY`には自分の持っているウォレットのprivate keyを入れてください。ここには先ほどmetamaskで作成したwalletのprivate keyを入れてください。

[`.env`]

```
AURORA_PRIVATE_KEY="YOUR_WALLET_PRIVATE_KEY"
```

最後に`hardhat.config.ts`を下のように編集しましょう。

ここにはauroraテストネットとデプロイするアドレスの情報を書いていきます。

[`hardhat.config.ts`]

```ts
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "dotenv/config";

const config: HardhatUserConfig = {
  solidity: "0.8.19",
  networks: {
    testnet_aurora: {
      url: "https://testnet.aurora.dev",
      accounts:
        process.env.AURORA_PRIVATE_KEY !== undefined
          ? [process.env.AURORA_PRIVATE_KEY]
          : [],
    },
  },
};

export default config;
```

ここでaccountsの欄を下のようにしたのはテストに関係するからです。

.envファイルはGit管理の対象外ですが、テストやCI実行の際に読み込みが発生すると参照が存在しないので、エラーが起きてしまいます。ジョブの中断を防ぐために、このようにundifinedの時には何も入らないようにしています！

これで下準備は完了です。

### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discordの`#near`で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の4点を記載してください ✨

```
1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット
```

---

section-1-lesson-1の完了おめでとうございます！

では次のセクションではいよいよスマートコントラクトの実装に移っていきましょう！
