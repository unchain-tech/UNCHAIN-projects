---
title: "🧠 ZK回路の構築"
---

このセクションでは、プロジェクトの心臓部である **ゼロ知識証明の「回路（Circuit）」** を実装します！

`Circom`という特別な言語を使って、「ある秘密のパスワードを知っている」という事実を証明するためのロジックを設計図のように定義し、証明と検証に必要なファイルを生成していきます。

## 📜 Circomとは？

[Circom](https://docs.circom.io/)は、ゼロ知識証明の回路を記述するために作られた、いわば **「証明の設計図」を作成するための言語**　です。

算術回路（足し算や掛け算などの組み合わせ）を定義し、それを **R1CS（Rank-1 Constraint System）** という、多くの **ZK-SNARKs** プロトコルが理解できる標準形式に変換（コンパイル）することができます。

このプロジェクトでは、`PasswordHash.circom`というファイルで、**「秘密のパスワード」をハッシュ化する計算が正しく行われたこと** を検証する回路を定義します。

## ✍️ 回路の設計と実装

それでは、`pkgs/circuit/circuits/PasswordHash.circom`ファイルを作成し、以下のコードを記述しましょう。

この回路の目的は、**「私は、ある秘密のパスワードを知っています。そして、そのパスワードをハッシュ化すると、公開されているこのハッシュ値になります」** ということを、パスワードそのものを見せることなく証明することです。

```circom
// pkgs/circuit/circuits/PasswordHash.circom
pragma circom 2.0.0;

// circomlibライブラリからPoseidonハッシュ関数の回路をインポート
include "../../node_modules/circomlib/circuits/poseidon.circom";

// PasswordHashという名前の回路テンプレートを定義
template PasswordHash() {
    // === 入力の定義 ===
    // Private input: 証明者（Prover）だけが知っている秘密のパスワード
    signal input password;
    // Public input: 検証者（Verifier）も知っている、比較対象となるハッシュ値
    signal output hash; // `output`ですが、ここでは公開情報として扱います

    // === 回路のロジック ===
    // Poseidonハッシュ関数コンポーネントを初期化
    // 1つの入力を受け取り、1つの出力を生成する設定
    component hasher = Poseidon(1);

    // パスワードをハッシュ関数の入力に接続
    hasher.inputs[0] <== password;

    // === 制約の定義 ===
    // ハッシュ関数の出力が、公開されているハッシュ値と一致することを制約として設定
    hash <== hasher.out;
}

// メインコンポーネントとしてPasswordHashをインスタンス化
component main = PasswordHash();
```

### 🔍 コード解説

-   `signal input password`:   
    ****証明者（Prover）****、つまりパスワードを知っている人だけが持つ秘密の入力です。  
    この値は証明を生成するために使われますが、外部には一切公開されません。
-   `signal output hash`:   
    ****証明者（Prover）****と****検証者（Verifier）****の両方が知っている公開情報です。  
    この回路は、 **「`password`をハッシュ化した結果が、この`hash`の値とピッタリ一致する」** ことを保証します。
-   `component hasher = Poseidon(1)`:   
    `circomlib`という便利なライブラリから、`Poseidon`ハッシュ関数の機能を持つ部品（コンポーネント）を呼び出しています。  
    Poseidonは、ゼロ知識証明と非常に相性が良い（ZKフレンドリーな）ハッシュ関数として広く使われています。
-   `hasher.inputs[0] <== password`:   
    秘密の入力`password`を、Poseidonハッシュ関数の入力としてセットしています。
-   `hash <== hasher.out`:   
    これが回路の最も重要な部分、**「制約（Constraint）」** です。  
    
    ハッシュ関数の計算結果（`hasher.out`）が、公開されている`hash`と等しくなければならない、というルールを課しています。この制約を満たす`password`を知っていることこそが、この回路が証明したい内容そのものなのです。

## 🔢 回路のコンパイル

設計図が完成したので、次はこの`PasswordHash.circom`ファイルをコンパイルします。  

コンパイルすることで、**証明を生成するために必要な`wasm`ファイル** と、**回路の制約を数学的に記述した`r1cs`ファイル** が生成されます。

ターミナルで以下のコマンドを実行してください。

```bash
pnpm circuit run compile
```

ここでは以下の様なスクリプトを実行することになります。

```bash
#!/bin/bash

# Variable to store the name of the circuit
CIRCUIT=PasswordHash

# In case there is a circuit name as input
if [ "$1" ]; then
    CIRCUIT=$1
fi

# Compile the circuit
circom ./src/${CIRCUIT}.circom --r1cs --wasm --sym --c
```

このスクリプトは、`pkgs/circuit/package.json`に定義されたスクリプトを実行し、`pkgs/circuit/circuits/PasswordHash.circom`を読み込みます。

そして、`pkgs/circuit/build`ディレクトリ内に`PasswordHash.r1cs`と`PasswordHash_js/PasswordHash.wasm`という2つの重要なファイルを出力します。

## 🔐 パスワードの設定と入力データの生成

次に、証明したい「秘密のパスワード」を具体的に設定し、それを回路への入力データとしてJSON形式で生成します。

### スクリプトの役割

`pkgs/circuit/scripts/generateInput.js`は、私たちが設定したパスワードをPoseidonハッシュ関数で計算し、回路への入力となる`input.json`ファイルを自動で作成してくれる便利なヘルパースクリプトです。

```javascript
// pkgs/circuit/scripts/generateInput.js
const { buildPoseidon } = require("circomlibjs");
const fs = require("fs");
const path = require("path");

async function main() {
    // Poseidonハッシュ関数を使えるように準備
    const poseidon = await buildPoseidon();
    // これが今回の「秘密の合言葉」
    const input = "serverless";

    // パスワードを回路が扱える数値（BigInt）に変換
    // 注意: 実際のアプリケーションでは、より安全な方法で文字列をフィールド要素に変換することが推奨されます
    const passwordNumber = BigInt(
        Buffer.from(input).toString("hex"),
        16
    ).toString();

    // パスワードのハッシュ値を計算
    const hash = poseidon.F.toString(poseidon([passwordNumber]));

    console.log(`Input (passwordNumber): ${passwordNumber}`);
    console.log(`Hash: ${hash}`);

    // input.jsonファイルを作成するためのデータ構造
    const inputs = {
        password: passwordNumber,
        hash: hash,
    };

    fs.writeFileSync(
        path.join(__dirname, "../data/input.json"),
        JSON.stringify(inputs, null, 2)
    );
}

main().catch(console.error);
```

### 入力データの生成手順

1.  **パスワードの編集**（任意）:  
    `pkgs/circuit/scripts/generateInput.js`ファイルを開き、`input`変数の値を好きなパスワード（英数字）に変更できます。

    ```javascript
    const input = "serverless"; // 👈 ここを好きなパスワードに変更
    ```

2.  **入力データの生成**:
    スクリプトを実行して、`input.json`を生成します。

    ```bash
    pnpm circuit run generateInput
    ```

    このコマンドは`generateInput.js`を実行し、`pkgs/circuit/data/input.json`に以下のような内容を書き込みます。

    ```json
    {
      "password": "YOUR_GENERATED_PASSWORD_NUMBER",
      "hash": "YOUR_GENERATED_HASH_VALUE"
    }
    ```

    ターミナルに出力される`hash`の値は、後でフロントエンドの環境変数`PASSWORD_HASH`に設定しますので、控えておいてください。

## 🔑 証明キーと検証キーの生成（Groth16）

次に、`Groth16`というZK-SNARKsプロトコルを使って、証明キー（Proving Key）と検証キー（Verification Key）を生成します。

このプロセスは **「Trusted Setup」** とも呼ばれます。

以下のコマンドを実行してください。

```bash
pnpm circuit run executeGroth16
```

実行されるスクリプトは次のような内容です。

```bash
#!/bin/bash

# Variable to store the name of the circuit
CIRCUIT=PasswordHash

# Variable to store the number of the ptau file
PTAU=14

# In case there is a circuit name as an input
if [ "$1" ]; then
    CIRCUIT=$1
fi

# In case there is a ptau file number as an input
if [ "$2" ]; then
    PTAU=$2
fi

# Check if the necessary ptau file already exists. If it does not exist, it will be downloaded from the data center
if [ -f ./ptau/powersOfTau28_hez_final_${PTAU}.ptau ]; then
    echo "----- powersOfTau28_hez_final_${PTAU}.ptau already exists -----"
else
    echo "----- Download powersOfTau28_hez_final_${PTAU}.ptau -----"
    wget -P ./ptau https://hermez.s3-eu-west-1.amazonaws.com/powersOfTau28_hez_final_${PTAU}.ptau
fi

# Compile the circuit
circom ./src/${CIRCUIT}.circom --r1cs --wasm --sym --c

# Generate the witness.wtns
node ${CIRCUIT}_js/generate_witness.js ${CIRCUIT}_js/${CIRCUIT}.wasm ./data/input.json ${CIRCUIT}_js/witness.wtns

echo "----- Generate .zkey file -----"
# Generate a .zkey file that will contain the proving and verification keys together with all phase 2 contributions
snarkjs groth16 setup ${CIRCUIT}.r1cs ptau/powersOfTau28_hez_final_${PTAU}.ptau ./zkey/${CIRCUIT}_0000.zkey

echo "----- Contribute to the phase 2 of the ceremony -----"
# Contribute to the phase 2 of the ceremony
snarkjs zkey contribute ./zkey/${CIRCUIT}_0000.zkey ./zkey/${CIRCUIT}_final.zkey --name="1st Contributor Name" -v -e="some random text"

echo "----- Export the verification key -----"
# Export the verification key
snarkjs zkey export verificationkey ./zkey/${CIRCUIT}_final.zkey ./zkey/verification_key.json

echo "----- Generate zk-proof -----"
# Generate a zk-proof associated to the circuit and the witness. This generates proof.json and public.json
snarkjs groth16 prove ./zkey/${CIRCUIT}_final.zkey ${CIRCUIT}_js/witness.wtns ./data/proof.json ./data/public.json

echo "----- Verify the proof -----"
# Verify the proof
snarkjs groth16 verify ./zkey/verification_key.json ./data/public.json ./data/proof.json

echo "----- Generate Solidity verifier -----"
# Generate a Solidity verifier that allows verifying proofs on Ethereum blockchain
snarkjs zkey export solidityverifier ./zkey/${CIRCUIT}_final.zkey ${CIRCUIT}Verifier.sol

# Update the solidity version in the Solidity verifier
sed 's/0.6.11;/0.8.20;/g' ${CIRCUIT}Verifier.sol > ${CIRCUIT}Verifier2.sol
# Update the contract name in the Solidity verifier
sed "s/contract Verifier/contract ${CIRCUIT}Verifier/g" ${CIRCUIT}Verifier2.sol > ${CIRCUIT}Verifier.sol
rm ${CIRCUIT}Verifier2.sol

echo "----- Generate and print parameters of call -----"
# Generate and print parameters of call
snarkjs generatecall data/public.json data/proof.json | tee ./data/calldata.json
```

このスクリプトは、内部でいくつかのステップを実行します。

1.  **Powers of Tau**:   
    一般的なセットアップファイルをダウンロードします。

2.  **Proving Keyの生成**:  
    `PasswordHash_final.zkey`という証明キーを生成します。  
    これは、証明を生成する際に必要となります。

3.  **Verification Keyの生成**:   
    `verification_key.json`という検証キーを生成します。  
    これは、証明を検証する際に必要となります。

4.  **Solidity Verifierの生成**:   
    `PasswordHashVerifier.sol`という、オンチェーンで証明を検証するためのスマートコントラクトを生成します。

## 🧾 Witnessの計算

`Witness`は、特定の入力（我々の場合はパスワード）に対する回路の中間状態をすべて含んだデータです。

証明を生成するために必要となります。

以下のコマンドで`witness.wtns`ファイルを生成します。

```bash
pnpm circuit run generateWitness
```

ここでは以下のようなスクリプトが実行されます

```bash
#!/bin/bash

# Variable to store the name of the circuit
CIRCUIT=PasswordHash

# In case there is a circuit name as input
if [ "$1" ]; then
    CIRCUIT=$1
fi

# Compile the circuit
circom ./src/${CIRCUIT}.circom --r1cs --wasm --sym --c

# Generate the witness.wtns
node ${CIRCUIT}_js/generate_witness.js ${CIRCUIT}_js/${CIRCUIT}.wasm ./data/input.json ${CIRCUIT}_js/witness.wtns
```

## ✅ 回路のテスト

ここまでのステップが正しく完了したかを確認するために、テストを実装しましょう

`pkgs/circuit/test/verify.test.js`を作成して以下のコードをコピー&ペーストしてください。

```js
const snarkjs = require("snarkjs");
const fs = require("fs");

/**
 * 検証用のサンプルスクリプト
 */
async function run() {
  // 各ファイルまでのパス
  const WASM_PATH = "./PasswordHash_js/PasswordHash.wasm";
  const ZKEY_PATH = "./zkey/PasswordHash_final.zkey";
  const VKEY_PATH = "./zkey/verification_key.json";
  // input data
  const inputData = JSON.parse(fs.readFileSync("./data/input.json"));

  console.log("Input Data: ");
  console.log(inputData);

  const { proof, publicSignals } = await snarkjs.groth16.fullProve(
    inputData,
    WASM_PATH,
    ZKEY_PATH,
  );

  console.log("Proof: ");
  console.log(JSON.stringify(proof, null, 1));

  const vKey = JSON.parse(fs.readFileSync(VKEY_PATH));
  // 検証
  const res = await snarkjs.groth16.verify(vKey, publicSignals, proof);

  if (res === true) {
    console.log("Verification OK");
  } else {
    console.log("Invalid proof");
  }
}

run().then(() => {
  process.exit(0);
});
```

このテストは、生成したキーとWitnessを使って、実際に証明が正しく生成・検証できるかを確認します。

以下のコマンドでテストを実行します。

```bash
pnpm circuit run test
```

ターミナルに`Verification OK`と表示されれば成功です。

## 📦 アーティファクトのコピー

最後に、生成されたアーティファクト（`PasswordHashVerifier.sol`、`PasswordHash.wasm`、`PasswordHash_final.zkey`）を、`backend`と`frontend`の各コンポーネントから参照できる場所にコピーします。

```bash
# 検証コントラクトをbackendにコピー
pnpm circuit run cp:verifier

# ZK関連ファイルをbackendとfrontendにコピー
pnpm circuit run cp:zk
```

これで、ゼロ知識証明回路の構築は完了です！

次のセクションでは、ここで生成した`PasswordHashVerifier.sol`を使って、スマートコントラクトを開発していきます。

## 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discordの`#zk`で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の3点を記載してください ✨

1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット
