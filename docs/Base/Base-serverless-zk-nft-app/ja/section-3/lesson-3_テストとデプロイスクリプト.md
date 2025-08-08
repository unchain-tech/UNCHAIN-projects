---
title: "🧪 テストとデプロイスクリプト"
---

このレッスンでは、実装した`ZKNFT.sol`コントラクトが正しく動作するかを保証するための**テスト**を作成し、実際にブロックチェーン（Base Sepoliaテストネット）に公開（**デプロイ**）するためのスクリプトとタスクを準備します。

## テストの作成

スマートコントラクト開発において、テストは非常に重要です。  

Hardhatが提供するテスト環境を利用して、コントラクトの堅牢性を保証し、予期せぬバグを防ぎましょう。

`pkgs/backend/test/ZKNFT.ts`ファイルを作成し、以下のテストコードを記述します。

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

すべてのテストが緑のチェックマークでパスすれば、あなたのコントラクトは期待通りに動作している証拠です！ ✅

## 🚀 デプロイスクリプトの作成

テストが成功したので、いよいよコントラクトを`Base Sepolia`テストネットにデプロイします。そのためのスクリプトを作成しましょう。

`pkgs/backend/scripts/deploy.ts`ファイルを作成し、以下のコードを記述します。

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

最後に、デプロイやNFTのミントを簡単に行うためのHardhatタスクを定義します。  

`pkgs/backend/tasks/zknft/write.ts`ファイルを作成します。

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
pnpm backend run deploy --network base_sepolia
```

デプロイが成功すると、ターミナルに`PasswordHashVerifier`と`ZKNFT`のコントラクトアドレスが出力されます。  

`ZKNFT`のアドレスをコピーし、`pkgs/backend/.env`ファイルの`ZKNFT_CONTRACT_ADDRESS`に設定してください。

これで、スマートコントラクトの開発、テスト、デプロイが完了しました。  

次のセクションでは、いよいよフロントエンドを構築し、ユーザーが実際にNFTをミントできるWebアプリケーションを作成します。

### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discordの`#zk`で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の3点を記載してください ✨

1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット
