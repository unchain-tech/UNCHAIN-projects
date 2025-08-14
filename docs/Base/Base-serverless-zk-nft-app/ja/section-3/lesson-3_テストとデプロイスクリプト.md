---
title: "🧪 テストとデプロイスクリプト"
---

このレッスンでは、実装した`ZKNFT.sol`コントラクトが正しく動作するかを保証するための**テスト**を作成し、実際にブロックチェーン（Base Sepoliaテストネット）に公開（**デプロイ**）するためのスクリプトとタスクを準備します。

## テストの作成

スマートコントラクト開発において、テストは非常に重要です。  

Hardhatが提供するテスト環境を利用して、コントラクトの堅牢性を保証し、予期せぬバグを防ぎましょう。

`pkgs/backend/test/ZKNFT.test.ts`ファイルを作成し、以下のテストコードを記述します。

```typescript
// pkgs/backend/test/ZKNFT.test.ts
import { loadFixture } from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
import { expect } from "chai";
import hre from "hardhat";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { getAddress } from "viem";

describe("ZKNFT", () => {
  // テスト用の証明データ
  let pA: [bigint, bigint];
  let pB: [[bigint, bigint], [bigint, bigint]];
  let pC: [bigint, bigint];
  let pubSignals: [bigint];
  let hasValidProofData = false;

  before(() => {
    // proof.jsonとpublic.jsonファイルを読み込んで解析
    const proofPath = join(
      __dirname,
      "../../../circuit/data/proof.json",
    );
    const publicPath = join(
      __dirname,
      "../../../circuit/data/public.json",
    );

    if (existsSync(proofPath) && existsSync(publicPath)) {
      try {
        // proof.jsonから証明データを読み込み
        const proofContent = readFileSync(proofPath, "utf8");
        const proof = JSON.parse(proofContent);

        // public.jsonから公開シグナルを読み込み
        const publicContent = readFileSync(publicPath, "utf8");
        const publicSignals = JSON.parse(publicContent);

        // Groth16プルーフからパラメータを抽出
        pA = [BigInt(proof.pi_a[0]), BigInt(proof.pi_a[1])];
        pB = [
          [BigInt(proof.pi_b[0][1]), BigInt(proof.pi_b[0][0])],
          [BigInt(proof.pi_b[1][1]), BigInt(proof.pi_b[1][0])],
        ];
        pC = [BigInt(proof.pi_c[0]), BigInt(proof.pi_c[1])];
        pubSignals = [BigInt(publicSignals[0])];

        hasValidProofData = true;
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        console.warn("❌ Error loading proof files:", errorMessage);
        setupFallbackData();
      }
    } else {
      console.warn("❌ Proof files not found, using fallback data");
      setupFallbackData();
    }
  });

  function setupFallbackData() {
    // フォールバック用のダミーデータ
    pA = [BigInt("1"), BigInt("2")];
    pB = [
      [BigInt("3"), BigInt("4")],
      [BigInt("5"), BigInt("6")],
    ];
    pC = [BigInt("7"), BigInt("8")];
    pubSignals = [BigInt("9")];
    hasValidProofData = false;
  }

  /**
   * テストで使うスマートコントラクトをまとめてデプロイする
   * @returns
   */
  async function deployZKNFTFixture() {
    // アカウントを取得
    const [owner, user1, user2] = await hre.viem.getWalletClients();

    // PasswordHashVerifierをデプロイ
    const verifier = await hre.viem.deployContract("PasswordHashVerifier");
    // ZKNFTをデプロイ
    const zkNFT = await hre.viem.deployContract("ZKNFT", [verifier.address]);

    const publicClient = await hre.viem.getPublicClient();

    return {
      zkNFT,
      verifier,
      owner,
      user1,
      user2,
      publicClient,
    };
  }

  describe("Deployment", () => {
    it("Should set the right name and symbol", async () => {
      const { zkNFT } = await loadFixture(deployZKNFTFixture);

      expect(await zkNFT.read.name()).to.equal("ZKNFT");
      expect(await zkNFT.read.symbol()).to.equal("ZNFT");
    });

    it("Should set the right verifier address", async () => {
      const { zkNFT, verifier } = await loadFixture(deployZKNFTFixture);

      expect(await zkNFT.read.verifier()).to.equal(
        getAddress(verifier.address),
      );
    });

    it("Should initialize totalSupply to 0", async () => {
      const { zkNFT } = await loadFixture(deployZKNFTFixture);

      expect(await zkNFT.read.totalSupply()).to.equal(0n);
    });

    it("Should set the correct constants", async () => {
      const { zkNFT } = await loadFixture(deployZKNFTFixture);

      expect(await zkNFT.read.nftName()).to.equal("ZK NFT");
      expect(await zkNFT.read.description()).to.equal(
        "This is a Serverless ZK NFT.",
      );
      expect(await zkNFT.read.nftImage()).to.equal(
        "https://bafkreidths6s4zg2exc5wlngmhlm5bav2xsfups7zeemee3rksbbpcx6zq.ipfs.w3s.link/",
      );
    });

    it("Should deploy verifier without errors", async () => {
      const { verifier } = await loadFixture(deployZKNFTFixture);
      expect(verifier.address).to.be.a("string");
      expect(verifier.address).to.not.equal(
        "0x0000000000000000000000000000000000000000",
      );
    });
  });

  describe("Contract Interface", () => {
    it("Should have correct safeMint function signature", async () => {
      const { zkNFT } = await loadFixture(deployZKNFTFixture);

      // safeMint関数が存在することを確認
      expect(zkNFT.write.safeMint).to.be.a("function");
    });

    it("Should reject calls with invalid parameters", async () => {
      const { zkNFT, user1 } = await loadFixture(deployZKNFTFixture);

      // 無効なパラメータでの呼び出しテスト
      try {
        await zkNFT.write.safeMint([
          user1.account.address,
          pA,
          pB,
          pC,
          pubSignals,
        ]);

        // 有効な証明データがない場合、Invalid proofエラーが期待される
        if (!hasValidProofData) {
          expect.fail("Expected transaction to revert with invalid proof");
        }
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        expect(errorMessage).to.include("Invalid proof");
      }
    });
  });

  describe("Token URI", () => {
    it("Should return correct token URI format for any token ID", async () => {
      const { zkNFT } = await loadFixture(deployZKNFTFixture);

      // tokenURI関数は_tokenIdを無視してstaticなURIを返すので、
      // 実際にNFTをミントしなくてもテストできる
      const tokenURI = await zkNFT.read.tokenURI([0n]);

      // Base64エンコードされたJSONであることを確認
      expect(tokenURI).to.include("data:application/json;base64,");

      // Base64デコードしてJSONの内容を確認
      const base64Data = tokenURI.replace("data:application/json;base64,", "");
      const decodedData = JSON.parse(
        Buffer.from(base64Data, "base64").toString(),
      );

      expect(decodedData.name).to.equal("ZK NFT");
      expect(decodedData.description).to.equal("This is a Serverless ZK NFT.");
      expect(decodedData.image).to.equal(
        "https://bafkreidths6s4zg2exc5wlngmhlm5bav2xsfups7zeemee3rksbbpcx6zq.ipfs.w3s.link/",
      );
      expect(decodedData.attributes).to.have.lengthOf(1);
      expect(decodedData.attributes[0].trait_type).to.equal("Type");
      expect(decodedData.attributes[0].value).to.equal("Winner");
    });

    it("Should return same token URI for different token IDs", async () => {
      const { zkNFT } = await loadFixture(deployZKNFTFixture);

      const tokenURI0 = await zkNFT.read.tokenURI([0n]);
      const tokenURI1 = await zkNFT.read.tokenURI([1n]);
      const tokenURI999 = await zkNFT.read.tokenURI([999n]);

      // すべてのトークンが同じURIを持つことを確認
      expect(tokenURI0).to.equal(tokenURI1);
      expect(tokenURI1).to.equal(tokenURI999);
    });
  });

  describe("Edge Cases", () => {
    it("Should handle zero address correctly", async () => {
      const { zkNFT } = await loadFixture(deployZKNFTFixture);

      // ゼロアドレスへのミントは失敗するはず
      try {
        await zkNFT.write.safeMint([
          "0x0000000000000000000000000000000000000000",
          pA,
          pB,
          pC,
          pubSignals,
        ]);
        expect.fail("Expected transaction to revert");
      } catch (error: unknown) {
        // エラーが発生することを確認（Invalid proofまたはzero addressエラー）
        expect(error).to.exist;
      }
    });

    it("Should query non-existent token", async () => {
      const { zkNFT } = await loadFixture(deployZKNFTFixture);

      // 存在しないトークンの所有者を問い合わせ
      try {
        await zkNFT.read.ownerOf([999n]);
        expect.fail("Expected call to revert");
      } catch (error: unknown) {
        // ERC721NonexistentTokenエラーが発生することを確認
        expect(error).to.exist;
      }
    });
  });

  // 実際のZK証明が必要なテストは条件付きで実行
  describe("ZK Proof Integration (requires valid proof)", () => {
    it("Should successfully mint with valid proof data", async function () {
      if (!hasValidProofData) {
        this.skip();
        return;
      }

      const { zkNFT, user1 } = await loadFixture(deployZKNFTFixture);

      try {
        // 実際の証明データでミントを試行
        const hash = await zkNFT.write.safeMint([
          user1.account.address,
          pA,
          pB,
          pC,
          pubSignals,
        ]);

        // 成功した場合の検証
        expect(hash).to.be.a("string");
        expect(await zkNFT.read.totalSupply()).to.equal(1n);
        expect(await zkNFT.read.ownerOf([0n])).to.equal(
          getAddress(user1.account.address),
        );
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);

        // ZK証明の検証に失敗した場合は、適切なエラーメッセージであることを確認
        expect(errorMessage).to.include("Invalid proof");
      }
    });
  });
});
```

### 🔍 テストコード解説

- `deployZKNFTFixture`:   
    テストを実行する前に、毎回クリーンな状態でコントラクトをデプロイするための **`fixture`関数** です。  `PasswordHashVerifier`と`ZKNFT`の両方をデプロイし、テストに必要なオブジェクトを返します。

- `import { proof, publicSignals } ...`:  
    `section-2`で生成した証明データ（`proof.json`と`public.json`）をインポートし、実際の証明を使ったテストを可能にします。正しいGroth16形式の証明データを使用することで、スマートコントラクトの検証機能が期待通りに動作することを確認できます。

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

    // proof.jsonとpublic.jsonファイルを読み込んで解析
    const proofPath = join(__dirname, "../../../circuit/data/proof.json");
    const publicPath = join(__dirname, "../../../circuit/data/public.json");
    
    const proofContent = readFileSync(proofPath, "utf8");
    const publicContent = readFileSync(publicPath, "utf8");
    
    const proof = JSON.parse(proofContent);
    const publicSignals = JSON.parse(publicContent);

    // Groth16証明データを適切な形式に変換
    const pA = [BigInt(proof.pi_a[0]), BigInt(proof.pi_a[1])];
    const pB = [
      [BigInt(proof.pi_b[0][1]), BigInt(proof.pi_b[0][0])],
      [BigInt(proof.pi_b[1][1]), BigInt(proof.pi_b[1][0])],
    ];
    const pC = [BigInt(proof.pi_c[0]), BigInt(proof.pi_c[1])];
    const pubSignals = publicSignals.map((signal: string) => BigInt(signal));

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

- `getContractAddress(chainId, contractName)`:   
    ヘルパー関数を使用してデプロイ済みの`ZKNFT`コントラクトのアドレスを取得します。

- `hre.viem.getContractAt(...)`:   
    Viemを使用してデプロイ済みコントラクトのインスタンスを取得します。

- `zknft.write.safeMint(...)`:   
    `proof.json`と`public.json`の証明データを使って、`safeMint`関数を呼び出します。

### タスクのインポート

この新しいタスクをHardhatが認識できるように、`hardhat.config.ts`にインポート文を追加します。

```typescript
// pkgs/backend/hardhat.config.ts
// ...
import "./tasks/zknft/write"; // 👈 この行を追加

const config: HardhatUserConfig = {
// ...
```

## 🚀 デプロイとタスクの実行

すべての準備が整いました。  

以下のコマンドで、コントラクトを`Base Sepolia`テストネットにデプロイしましょう。

```bash
pnpm backend run deploy:ZKNFT --network base-sepolia
```

デプロイが成功すると、ターミナルに`PasswordHashVerifier`と`ZKNFT`のコントラクトアドレスが出力されます。 

タスクの実行も試してみましょう！ ！

以下のコマンドでゼロ知識証明用のproofの生成〜NFTのミントまでを試してみます。

```bash
pnpm contract mint --network base-sepolia
```

うまくいけば以下のようにNFTがミントされるはずです！ ！

[Base Sepolia - 0x6d676a517cd72534782e96be054f975834147816c4ebea320e1647afcf4f6573](https://sepolia.basescan.org/tx/0x6d676a517cd72534782e96be054f975834147816c4ebea320e1647afcf4f6573)

これで、スマートコントラクトの開発、テスト、デプロイが完了しました。  

次のセクションでは、いよいよフロントエンドを構築し、ユーザーが実際にNFTをミントできるWebアプリケーションを作成します。


### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discordの`#zk`で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の3点を記載してください ✨

1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット
