---
title: "ZK回路の構築"
---

このセクションでは、プロジェクトの核心部分であるゼロ知識証明の「回路（Circuit）」を構築します。`Circom`という言語を使って、パスワードを知っていることを証明するためのロジックを定義し、証明と検証に必要なファイルを生成します。

## 📜 Circomとは？

[Circom](https://docs.circom.io/)は、ゼロ知識証明の回路を記述するためのドメイン固有言語（DSL）です。算術回路を定義し、それをR1CS（Rank-1 Constraint System）という形式にコンパイルすることができます。R1CSは、多くのZK-SNARKsプロトコルで使われる標準的な形式です。

このプロジェクトでは、`PasswordHash.circom`というファイルで、パスワードのハッシュ計算を検証する回路を定義します。

## ✍️ 回路の設計と実装

まず、`pkgs/circuit/circuits/PasswordHash.circom`ファイルを作成し、以下のコードを記述します。この回路の目的は、「**ある秘密のパスワードを知っていて、そのパスワードをハッシュ化すると特定の公開されたハッシュ値になること**」を証明することです。

```circom
// pkgs/circuit/circuits/PasswordHash.circom
pragma circom 2.0.0;

include "../../node_modules/circomlib/circuits/poseidon.circom";

template PasswordHash() {
    // Private input: 証明者だけが知っている秘密のパスワード
    signal input password;
    // Public input: 検証者も知っている公開されたハッシュ値
    signal output hash;

    // Poseidonハッシュ関数コンポーネントを初期化
    // 1つの入力を受け取り、1つの出力を生成します
    component hasher = Poseidon(1);

    // パスワードをハッシュ関数の入力に接続
    hasher.inputs[0] <== password;

    // ハッシュ関数の出力が、公開されているハッシュ値と一致することを制約として設定
    hash <== hasher.out;
}

// メインコンポーネントとしてPasswordHashをインスタンス化
component main = PasswordHash();
```

### コード解説

- `signal input password`: 証明者（Prover）だけが知っている秘密の入力です。この値は証明の過程で使われますが、外部には公開されません。
- `signal output hash`: 証明者と検証者（Verifier）の両方が知っている公開の入力です。この回路が「パスワードをハッシュ化した結果がこの`hash`と一致する」ことを保証します。
- `component hasher = Poseidon(1)`: `circomlib`ライブラリから`Poseidon`ハッシュ関数を呼び出しています。PoseidonはZKフレンドリーなハッシュ関数として広く使われています。
- `hasher.inputs[0] <== password`: 秘密の入力`password`をPoseidonハッシュ関数の入力として設定しています。
- `hash <== hasher.out`: 回路の最も重要な部分です。ハッシュ関数の計算結果（`hasher.out`）が、公開されている`hash`と等しくなければならない、という「制約（Constraint）」を課しています。この制約を満たす`password`を知っていること」が、この回路が証明する内容になります。

## 🔢 回路のコンパイル

次に、作成した`PasswordHash.circom`をコンパイルします。これにより、証明生成に必要な`wasm`ファイルと、回路の制約を記述した`r1cs`ファイルが生成されます。

ターミナルで以下のコマンドを実行してください。

```bash
pnpm circuit run compile
```

このコマンドは、`pkgs/circuit/circuits/PasswordHash.circom`を読み込み、`pkgs/circuit/build`ディレクトリ内に`PasswordHash.r1cs`と`PasswordHash_js/PasswordHash.wasm`を出力します。

## 🔐 パスワードの設定と入力データの生成

次に、証明の対象となる「秘密のパスワード」を設定し、それを回路への入力データとしてJSON形式で生成します。

### スクリプトの役割

`pkgs/circuit/scripts/generateInput.js`は、設定したパスワードをPoseidonハッシュ関数で計算し、回路への入力となる`input.json`ファイルを作成するためのヘルパースクリプトです。

```javascript
// pkgs/circuit/scripts/generateInput.js
const { buildPoseidon } = require("circomlibjs");
const fs = require("fs");
const path = require("path");

async function main() {
    // Poseidonハッシュ関数をビルド
    const poseidon = await buildPoseidon();
    // これが秘密のパスワード
    const input = "serverless";

    // パスワードを数値（BigInt）に変換
    // 注意: 実際のアプリケーションでは、より安全な方法で文字列をフィールド要素に変換する必要があります
    const passwordNumber = BigInt(
        Buffer.from(input).toString("hex"),
        16
    ).toString();

    // パスワードのハッシュ値を計
    const hash = poseidon.F.toString(poseidon([passwordNumber]));

    console.log(`Input (passwordNumber): ${passwordNumber}`);
    console.log(`Hash: ${hash}`);

    // input.jsonファイルを作成
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

次に、`Groth16`というZK-SNARKsプロトコルを使って、証明キー（Proving Key）と検証キー（Verification Key）を生成します。このプロセスは「Trusted Setup」とも呼ばれます。

以下のコマンドを実行してください。

```bash
pnpm circuit run executeGroth16
```

このコマンドは、内部でいくつかのステップを実行します。

1.  **Powers of Tau**: 一般的なセットアップファイルをダウンロードします。
2.  **Proving Keyの生成**: `PasswordHash_final.zkey`という証明キーを生成します。これは、証明を生成する際に必要となります。
3.  **Verification Keyの生成**: `verification_key.json`という検証キーを生成します。これは、証明を検証する際に必要となります。
4.  **Solidity Verifierの生成**: `PasswordHashVerifier.sol`という、オンチェーンで証明を検証するためのスマートコントラクトを生成します。

## 🧾 Witnessの計算

`Witness`は、特定の入力（我々の場合はパスワード）に対する回路の中間状態をすべて含んだデータです。証明を生成するために必要となります。

以下のコマンドで`witness.wtns`ファイルを生成します。

```bash
pnpm circuit run generateWitness
```

## ✅ 回路のテスト

ここまでのステップが正しく完了したかを確認するために、テストを実行します。このテストは、生成したキーとWitnessを使って、実際に証明が正しく生成・検証できるかを確認します。

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

これで、ゼロ知識証明回路の構築は完了です。次のセクションでは、ここで生成した`PasswordHashVerifier.sol`を使って、スマートコントラクトを開発していきます。

## 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discordの`#zk`で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の3点を記載してください ✨

1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット
