---
title: "テストとデプロイスクリプト"
---

このレッスンでは、実装した`ZKNFT.sol`コントラクトが正しく動作するかを確認するためのテストを作成し、テストネットにデプロイするためのスクリプトとタスクを準備します。

## 🧪 テストの作成

Hardhat環境でのテストは、コントラクトの堅牢性を保証するために不可欠です。`pkgs/backend/test/ZKNFT.ts`ファイルを作成し、以下のテストコードを記述します。

```typescript
// pkgs/backend/test/ZKNFT.ts
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers }s from "hardhat";
import { ZKNFT } from "../typechain-types";
// ZK証明のテストデータをインポート
import { calldata } from "../../../circuit/data/calldata.json";

describe("ZKNFT", function () {
    async function deployZKNFTFixture() {
        // アカウントを取得
        const [owner, otherAccount] = await ethers.getSigners();

        // PasswordHashVerifierモックをデプロイ
        const Verifier = await ethers.getContractFactory("PasswordHashVerifier");
        const verifier = await Verifier.deploy();

        // ZKNFTコントラクトをデプロイ
        const ZKNFT = await ethers.getContractFactory("ZKNFT");
        const zknft: ZKNFT = await ZKNFT.deploy(await verifier.getAddress());

        return { zknft, owner, otherAccount };
    }

    describe("Deployment", function () {
        it("Should set the right verifier", async function () {
            const { zknft } = await loadFixture(deployZKNFTFixture);
            // PasswordHashVerifierモックが正しく設定されているかテスト
            expect(await zknft.verifier()).to.not.equal(ethers.ZeroAddress);
        });
    });

    describe("Minting", function () {
        it("Should mint a new token for the owner", async function () {
            const { zknft, owner } = await loadFixture(deployZKNFTFixture);

            // ZK証明を使ってNFTをミント
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

        it("Should fail to mint with invalid proof", async function () {
            const { zknft, owner } = await loadFixture(deployZKNFTFixture);

            // 不正な公開情報でミントを試みる
            const invalidPubSignals = ["0"];
            await expect(
                zknft.safeMint(
                    owner.address,
                    calldata.pA,
                    calldata.pB,
                    calldata.pC,
                    invalidPubSignals
                )
            ).to.be.revertedWith("Invalid proof");
        });
    });
});
```

### テストコード解説
- `deployZKNFTFixture`: テストの前にクリーンな状態でコントラクトをデプロイするための`fixture`関数です。`PasswordHashVerifier`と`ZKNFT`の両方をデプロイします。
- `import { calldata } ...`: `section-2`で生成した証明データ（`calldata.json`）をインポートして、テストに使用します。
- `Deployment`テスト: `ZKNFT`コントラクトがデプロイされた際に、`verifier`アドレスが正しく設定されているかを確認します。
- `Minting`テスト:
    - 正しい証明データを使って`safeMint`を呼び出し、NFTが正常にミントされることを確認します。
    - 意図的に不正な公開情報（`invalidPubSignals`）を使って`safeMint`を呼び出し、`"Invalid proof"`というエラーでトランザクションがリバート（失敗）することを確認します。

### テストの実行
ターミナルで以下のコマンドを実行して、テストを実行します。

```bash
pnpm backend test
```

すべてのテストがパスすれば、コントラクトは期待通りに動作しています。

## 🚀 デプロイスクリプトの作成

次に、コントラクトを`Base Sepolia`テストネットにデプロイするためのスクリプトを作成します。`pkgs/backend/scripts/deploy.ts`ファイルを作成し、以下のコードを記述します。

```typescript
// pkgs/backend/scripts/deploy.ts
import { ethers } from "hardhat";

async function main() {
    // PasswordHashVerifierをデプロイ
    const verifier = await ethers.deployContract("PasswordHashVerifier");
    await verifier.waitForDeployment();
    console.log(`PasswordHashVerifier deployed to ${await verifier.getAddress()}`);

    // ZKNFTをデプロイ（Verifierのアドレスを渡す）
    const zknft = await ethers.deployContract("ZKNFT", [await verifier.getAddress()]);
    await zknft.waitForDeployment();
    console.log(`ZKNFT deployed to ${await zknft.getAddress()}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
```

このスクリプトは、`PasswordHashVerifier`と`ZKNFT`の両方をデプロイし、それぞれのアドレスをコンソールに出力します。

## タスクの定義

最後に、デプロイやNFTのミントを簡単に行うためのHardhatタスクを定義します。`pkgs/backend/tasks/zknft/write.ts`ファイルを作成します。

```typescript
// pkgs/backend/tasks/zknft/write.ts
import { task } from "hardhat/config";
import { ZKNFT } from "../../typechain-types";
import { calldata } from "../../../circuit/data/calldata.json";

// `mint`タスクを定義
task("mint", "Mints a new ZKNFT").setAction(async (_, { ethers }) => {
    const { ZKNFT_CONTRACT_ADDRESS } = process.env;
    if (!ZKNFT_CONTRACT_ADDRESS) {
        throw new Error("ZKNFT_CONTRACT_ADDRESS is not set");
    }

    const zknft: ZKNFT = await ethers.getContractAt(
        "ZKNFT",
        ZKNFT_CONTRACT_ADDRESS
    );

    const [signer] = await ethers.getSigners();
    console.log(`Minting a new ZKNFT for ${signer.address}...`);

    // safeMintを呼び出す
    const tx = await zknft.safeMint(
        signer.address,
        calldata.pA,
        calldata.pB,
        calldata.pC,
        calldata.pubSignals
    );

    console.log(`Transaction hash: ${tx.hash}`);
    await tx.wait();
    console.log("Minted a new ZKNFT");
});
```

### タスク解説
- `task("mint", ...)`: `mint`という名前の新しいHardhatタスクを定義します。
- `process.env.ZKNFT_CONTRACT_ADDRESS`: 環境変数からデプロイ済みの`ZKNFT`コントラクトのアドレスを取得します。
- `ethers.getContractAt(...)`: デプロイ済みコントラクトのインスタンスを取得します。
- `zknft.safeMint(...)`: `calldata.json`の証明データを使って、`safeMint`関数を呼び出します。

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

すべての準備が整いました。以下のコマンドで、コントラクトを`Base Sepolia`テストネットにデプロイしましょう。

```bash
pnpm backend run deploy --network base_sepolia
```

デプロイが成功すると、ターミナルに`PasswordHashVerifier`と`ZKNFT`のコントラクトアドレスが出力されます。`ZKNFT`のアドレスをコピーし、`pkgs/backend/.env`ファイルの`ZKNFT_CONTRACT_ADDRESS`に設定してください。

これで、スマートコントラクトの開発、テスト、デプロイが完了しました。次のセクションでは、いよいよフロントエンドを構築し、ユーザーが実際にNFTをミントできるWebアプリケーションを作成します。

### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discordの`#zk`で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の3点を記載してください ✨

1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット
