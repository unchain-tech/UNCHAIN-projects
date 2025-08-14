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

それでは、`pkgs/circuit/src/PasswordHash.circom`ファイルを作成し、以下のコードを記述しましょう。

この回路の目的は、**「私は、ある秘密のパスワードを知っています。そして、そのパスワードをハッシュ化すると、公開されているこのハッシュ値になります」** ということを、パスワードそのものを見せることなく証明することです。

```circom
// pkgs/circuit/src/PasswordHash.circom
pragma circom 2.0.0;

include "../node_modules/circomlib/circuits/poseidon.circom";

/**
 * ハッシュ値を生成するメソッド
 */
template PasswordCheck() {
  // 入力値を取得
  signal input password;      
  signal input hash;    

  component poseidon = Poseidon(1);
  poseidon.inputs[0] <== password;
  hash === poseidon.out;  // ハッシュ値の一致を検証(true or falseを返す)
}

// パブリック入力： パスワードのハッシュ値
// プライベート入力： パスワード
component main {public [hash]} = PasswordCheck();
```

### 🔍 コード解説

-   `signal input password`:   
    **証明者（Prover）**、つまりパスワードを知っている人だけが持つ秘密の入力です。  
    この値は証明を生成するために使われますが、外部には一切公開されません。
-   `signal output hash`:   
    **証明者（Prover）** と **検証者（Verifier）** の両方が知っている公開情報です。  
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

このスクリプトは、`pkgs/circuit/package.json`に定義されたスクリプトを実行し、`pkgs/circuit/src/PasswordHash.circom`を読み込みます。

そして、`pkgs/circuit/build`ディレクトリ内に`PasswordHash.r1cs`と`PasswordHash_js/PasswordHash.wasm`という2つの重要なファイルを出力します。

最終的に以下のような出力結果になっていればOKです！ ！

```bash
template instances: 71
non-linear constraints: 216
linear constraints: 199
public inputs: 1
private inputs: 1
public outputs: 0
wires: 417
labels: 583
Written successfully: ./PasswordHash.r1cs
Written successfully: ./PasswordHash.sym
Written successfully: ./PasswordHash_cpp/PasswordHash.cpp and ./PasswordHash_cpp/PasswordHash.dat
Written successfully: ./PasswordHash_cpp/main.cpp, circom.hpp, calcwit.hpp, calcwit.cpp, fr.hpp, fr.cpp, fr.asm and Makefile
Written successfully: ./PasswordHash_js/PasswordHash.wasm
Everything went okay
```

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

    以下のような出力結果が得られればOKです！

    ```bash
    InputData: {
      input: 'serverless',
      inputNumber: '544943514572763559195507',
      hash: '15164376112847237158131942621891884356916177189690069125192984001689200900025'
    }
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

以下のような出力結果が出ていればOKです！ ！

```bash
----- Export the verification key -----
[INFO]  snarkJS: EXPORT VERIFICATION KEY STARTED
[INFO]  snarkJS: > Detected protocol: groth16
[INFO]  snarkJS: EXPORT VERIFICATION KEY FINISHED
----- Generate zk-proof -----
----- Verify the proof -----
[INFO]  snarkJS: OK!
----- Generate Solidity verifier -----
[INFO]  snarkJS: EXPORT VERIFICATION KEY STARTED
[INFO]  snarkJS: > Detected protocol: groth16
[INFO]  snarkJS: EXPORT VERIFICATION KEY FINISHED
----- Generate and print parameters of call -----
["0x15ae6792cbe82731dfdcef2012a32cf9e2d1d81d6a71086ad14afd229bbab166", "0x1e5fade2062037da2c5309da71a6d5fd7da656274e358e71603579720fde74ee"],[["0x110f6f6bc5846e31b20b1e1cacb8a431759640644e56a342d90fee20b51d961f", "0x204970c9f05d739f5ae4b20d0b086c779cbfa69a3fc23acfb3df558d2fb6abb9"],["0x10b3a650597a08686299d817a1f7868a26d0eb1699117deb01cbb052d7262755", "0x02ca1580581ed8b05f10db03aaaa3479b1b50024574bc1cb894d58ec535b634d"]],["0x0dc789b08391b6a5150a4435b9fa0193baffb7a63ef01780b0a4c89da576e587", "0x19c5d7b33a7b1a14eb61d8147b3bab95d25abaee0b830ef8c34ad110093ee85b"],["0x2186bb937db8faf41e671589c116c1f8491df908baaf0da11aedd7fedb5437b9"]
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

5.  **証明データの生成**:  
    `proof.json`（証明データ）と`public.json`（公開シグナル）を生成します。  
    さらに、Solidityコントラクトでの検証に使用できる形式の`calldata.json`も出力します。

6.  **Solidity Verifierの生成**:   
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

以下のような出力結果が出ていればOKです！ ！

```bash
template instances: 71
non-linear constraints: 216
linear constraints: 199
public inputs: 1
private inputs: 1
public outputs: 0
wires: 417
labels: 583
Written successfully: ./PasswordHash.r1cs
Written successfully: ./PasswordHash.sym
Written successfully: ./PasswordHash_cpp/PasswordHash.cpp and ./PasswordHash_cpp/PasswordHash.dat
Written successfully: ./PasswordHash_cpp/main.cpp, circom.hpp, calcwit.hpp, calcwit.cpp, fr.hpp, fr.cpp, fr.asm and Makefile
Written successfully: ./PasswordHash_js/PasswordHash.wasm
Everything went okay
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

ターミナルに以下のような内容が出力されていればOKです！ ！

```bash
Verification OK
```

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
