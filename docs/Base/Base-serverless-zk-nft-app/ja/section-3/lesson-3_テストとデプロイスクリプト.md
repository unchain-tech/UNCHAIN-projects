---
title: "🧪 テストとデプロイスクリプト"
---

このレッスンでは、実装した`ZKNFT.sol`コントラクトが正しく動作するかを保証するための**テスト**を作成し、実際にブロックチェーン（Base Sepoliaテストネット）に公開（**デプロイ**）するためのスクリプトとタスクを準備します。

## テストの作成

スマートコントラクト開発において、テストは非常に重要です。  

Hardhatが提供するテスト環境を利用して、コントラクトの堅牢性を保証し、予期せぬバグを防ぎましょう。

`pkgs/backend/test/ZKNFT.test.ts`ファイルを作成し、以下のテストコードを記述します。

```typescript
// pkgs/backend/test/ZKNFT.ts
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { ZKNFT } from "../typechain-types";
// `section-2`で生成したZK証明のテストデータをインポート
import { calldata } from "../../../circuit/data/calldata.json";

describe("ZKNFT", function () {
    // テスト環境を初期化するためのfixture関数
    async function deployZKNFTFixture() {
        // テスト用のアカウントを取得
        const [owner, otherAccount] = await ethers.getSigners();

        // `PasswordHashVerifier`コントラクトをデプロイ
        const Verifier = await ethers.getContractFactory("PasswordHashVerifier");
        const verifier = await Verifier.deploy();

        // `ZKNFT`コントラクトをデプロイし、検証コントラクトのアドレスを渡す
        const ZKNFT = await ethers.getContractFactory("ZKNFT");
        const zknft: ZKNFT = await ZKNFT.deploy(await verifier.getAddress());

        return { zknft, owner, otherAccount, verifier };
    }

    describe("Deployment", function () {
        it("Should set the right verifier address", async function () {
            const { zknft, verifier } = await loadFixture(deployZKNFTFixture);
            // ZKNFTコントラクトに保存されているverifierのアドレスが正しいかテスト
            expect(await zknft.verifier()).to.equal(await verifier.getAddress());
        });
    });

    describe("Minting", function () {
        it("Should mint a new token for the owner with a valid proof", async function () {
            const { zknft, owner } = await loadFixture(deployZKNFTFixture);

            // 正しいZK証明データを使ってNFTをミント
            await zknft.safeMint(
                owner.address,
                calldata.pA,
                calldata.pB,
                calldata.pC,
                calldata.pubSignals
            );

            // オーナーがNFTを1つ所有していることを確認
            expect(await zknft.balanceOf(owner.address)).to.equal(1);
        });

        it("Should fail to mint with an invalid proof", async function () {
            const { zknft, owner } = await loadFixture(deployZKNFTFixture);

            // 不正な公開情報（ハッシュ値）でミントを試みる
            const invalidPubSignals = ["0"];
            // トランザクションが"ZKNFT: Invalid proof"というエラーでリバートされることを期待
            await expect(
                zknft.safeMint(
                    owner.address,
                    calldata.pA,
                    calldata.pB,
                    calldata.pC,
                    invalidPubSignals
                )
            ).to.be.revertedWith("ZKNFT: Invalid proof");
        });
    });
});
```

### 🔍 テストコード解説

- `deployZKNFTFixture`:   
    テストを実行する前に、毎回クリーンな状態でコントラクトをデプロイするための **`fixture`関数** です。  `PasswordHashVerifier`と`ZKNFT`の両方をデプロイし、テストに必要なオブジェクトを返します。

- `import { calldata } ...`:  
    `section-2`で生成した証明データ（`calldata.json`）をインポートし、実際の証明を使ったテストを可能にします。

- **`Deployment`テスト**:   
    `ZKNFT`コントラクトがデプロイされた際に、コンストラクタに渡した`verifier`のアドレスが正しく設定されているかを確認します。

- **`Minting`テスト**:  
    - **成功ケース**: 
        正しい証明データを使って`safeMint`を呼び出し、NFTが正常にミントされることを確認します。
    - **失敗ケース**:   
        意図的に不正な公開情報（`invalidPubSignals`）を使って`safeMint`を呼び出し、コントラクトに設定したエラーメッセージ`"ZKNFT: Invalid proof"`でトランザクションが正しく失敗（リバート）することを確認します。

### テストの実行

ターミナルで以下のコマンドを実行して、テストを開始します。

```bash
pnpm backend test
```

以下のようにすべてのテストが緑のチェックマークでパスすれば、あなたのコントラクトは期待通りに動作している証拠です！ ✅

```bash
  ZKNFT
    Deployment
      ✔ Should set the right name and symbol (248ms)
      ✔ Should set the right verifier address
      ✔ Should initialize totalSupply to 0
      ✔ Should set the correct constants
      ✔ Should deploy verifier without errors
    Contract Interface
      ✔ Should have correct safeMint function signature
      ✔ Should reject calls with invalid parameters
    Token URI
      ✔ Should return correct token URI format for any token ID
      ✔ Should return same token URI for different token IDs
    Edge Cases
      ✔ Should handle zero address correctly
      ✔ Should query non-existent token
    ZK Proof Integration (requires valid proof)
      ✔ Should successfully mint with valid proof data


  12 passing (297ms)

··············································································································
|  Solidity and Network Configuration                                                                        │
·························|··················|···············|················|································
|  Solidity: 0.8.28      ·  Optim: false    ·  Runs: 200    ·  viaIR: true   ·     Block: 30,000,000 gas     │
·························|··················|···············|················|································
|  Methods                                                                                                   │
·························|··················|···············|················|················|···············
|  Contracts / Methods   ·  Min             ·  Max          ·  Avg           ·  # calls       ·  usd (avg)   │
·························|··················|···············|················|················|···············
|  Deployments                              ·                                ·  % of limit    ·              │
·························|··················|···············|················|················|···············
|  PasswordHashVerifier  ·               -  ·            -  ·     1,879,190  ·         6.3 %  ·           -  │
·························|··················|···············|················|················|···············
|  ZKNFT                 ·               -  ·            -  ·     2,099,006  ·           7 %  ·           -  │
·························|··················|···············|················|················|···············
|  Key                                                                                                       │
··············································································································
|  ◯  Execution gas for this method does not include intrinsic gas overhead                                  │
··············································································································
|  △  Cost was non-zero but below the precision setting for the currency display (see options)               │
··············································································································
|  Toolchain:  hardhat                                                                                       │
··············································································································
```

## 🚀 デプロイスクリプトの作成

テストが成功したので、いよいよコントラクトを`Base Sepolia`テストネットにデプロイします。そのためのスクリプトを作成しましょう。

`pkgs/backend/ignition/modules/ZKNFT.ts`ファイルを作成し、以下のコードを記述します。

```typescript
// pkgs/backend/ignition/modules/ZKNFT.ts
import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const ZKNFTModule = buildModule("ZKNFTModule", (m) => {
  // First deploy the PasswordHashVerifier contract
  const passwordHashVerifier = m.contract("PasswordHashVerifier", []);

  // Then deploy the ZKNFT contract with the verifier address
  const zknft = m.contract("ZKNFT", [passwordHashVerifier]);

  return {
    passwordHashVerifier,
    zknft,
  };
});

export default ZKNFTModule;
```

このスクリプトは、`PasswordHashVerifier`と`ZKNFT`の両方をデプロイし、それぞれのアドレスをコンソールに出力します。

## タスクの定義

最後に、デプロイやNFTのミントを簡単に行うためのHardhatタスクを定義します。  

`pkgs/backend/tasks/zknft/write.ts`ファイルを作成します。

```typescript
// pkgs/backend/tasks/zknft/write.ts
import { task } from "hardhat/config";
import type { HardhatRuntimeEnvironment } from "hardhat/types";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { getContractAddress } from "../../helpers/contractJsonHelper";

/**
 * 【Task】call mint method of ZKNFT contract
 */
task("mint", "call mint method of ZKNFT contract").setAction(
  async (taskArgs, hre: HardhatRuntimeEnvironment) => {
    console.log(
      "################################### [START] ###################################",
    );

    // get public client
    const publicClient = await hre.viem.getPublicClient();
    // get chain ID
    const chainId = (await publicClient.getChainId()).toString();
    // get wallet client
    const [signer] = await hre.viem.getWalletClients();
    // get contract name
    const contractName = "ZKNFTModule#ZKNFT";
    // get contract address
    const contractAddress = getContractAddress(chainId, contractName);

    // create contract instance
    const zkNFT = await hre.viem.getContractAt("ZKNFT", contractAddress, {
      client: signer,
    });

    // calldataファイルを読み込んで解析
    const calldataPath = join(__dirname, "../../../circuit/data/calldata.json");
    const calldataContent = readFileSync(calldataPath, "utf8");
    // JSONの解析（配列形式）
    const callData = JSON.parse(`[${calldataContent}]`);

    // calldataから証明パラメータを抽出
    const pA = [BigInt(callData[0][0]), BigInt(callData[0][1])];
    const pB = [
      [BigInt(callData[1][0][0]), BigInt(callData[1][0][1])],
      [BigInt(callData[1][1][0]), BigInt(callData[1][1][1])],
    ];
    const pC = [BigInt(callData[2][0]), BigInt(callData[2][1])];
    const pubSignals = [BigInt(callData[3][0])];

    // call safeMint method
    const hash = await zkNFT.write.safeMint([
      signer.account.address,
      pA,
      pB,
      pC,
      pubSignals,
    ]);

    console.log(`hash: ${hash}`);

    console.log(
      "################################### [END] ###################################",
    );
  },
);
```

### タスク解説

- `task("mint", ...)`:   
    `mint`という名前の新しいHardhatタスクを定義します。

- `process.env.ZKNFT_CONTRACT_ADDRESS`:   
    環境変数からデプロイ済みの`ZKNFT`コントラクトのアドレスを取得します。

- `ethers.getContractAt(...)`:   
    デプロイ済みコントラクトのインスタンスを取得します。

- `zknft.safeMint(...)`:   
    `calldata.json`の証明データを使って、`safeMint`関数を呼び出します。

### タスクのインポート

この新しいタスクをHardhatが認識できるように、`hardhat.config.ts`にインポート文を追加します。

```typescript
// pkgs/backend/hardhat.config.ts
// ...
import "./tasks/zknft/write"; // 👈 この行を追加

const config: HardhatUserConfig = {
// ...
```

## 🚀 デプロイの実行

すべての準備が整いました。  

以下のコマンドで、コントラクトを`Base Sepolia`テストネットにデプロイしましょう。

```bash
pnpm backend run deploy:ZKNFT --network base-sepolia
```

デプロイが成功すると、ターミナルに`PasswordHashVerifier`と`ZKNFT`のコントラクトアドレスが出力されます。  

これで、スマートコントラクトの開発、テスト、デプロイが完了しました。  

次のセクションでは、いよいよフロントエンドを構築し、ユーザーが実際にNFTをミントできるWebアプリケーションを作成します。

### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discordの`#zk`で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の3点を記載してください ✨

1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット
