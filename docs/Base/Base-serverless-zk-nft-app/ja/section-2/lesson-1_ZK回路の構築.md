---
title: "🧠 ZK回路の構築"
---

このセクションでは、プロジェクトの心臓部である**ゼロ知識証明の「回路（Circuit）」**を構築します。`Circom`という特別な言語を使って、「ある秘密のパスワードを知っている」という事実を証明するためのロジックを設計図のように定義し、証明と検証に必要なファイルを生成していきます。

## 📜 Circomとは？

[Circom](https://docs.circom.io/)は、ゼロ知識証明の回路を記述するために作られた、いわば**「証明の設計図」を作成するための言語**です。算術回路（足し算や掛け算などの組み合わせ）を定義し、それを**R1CS（Rank-1 Constraint System）**という、多くのZK-SNARKsプロトコルが理解できる標準形式に変換（コンパイル）することができます。

このプロジェクトでは、`PasswordHash.circom`というファイルで、**「秘密のパスワード」をハッシュ化する計算が正しく行われたこと**を検証する回路を定義します。

## ✍️ 回路の設計と実装

それでは、`pkgs/circuit/circuits/PasswordHash.circom`ファイルを作成し、以下のコードを記述しましょう。この回路の目的は、**「私は、ある秘密のパスワードを知っています。そして、そのパスワードをハッシュ化すると、公開されているこのハッシュ値になります」**という主張を、パスワードそのものを見せることなく証明することです。

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

-   `signal input password`: ****証明者（Prover）****、つまりパスワードを知っている人だけが持つ秘密の入力です。この値は証明を生成するために使われますが、外部には一切公開されません。
-   `signal output hash`: ****証明者（Prover）****と****検証者（Verifier）****の両方が知っている公開情報です。この回路は、「`password`をハッシュ化した結果が、この`hash`の値とピッタリ一致する」ことを保証します。
-   `component hasher = Poseidon(1)`: `circomlib`という便利なライブラリから、`Poseidon`ハッシュ関数の機能を持つ部品（コンポーネント）を呼び出しています。Poseidonは、ゼロ知識証明と非常に相性が良い（ZKフレンドリーな）ハッシュ関数として広く使われています。
-   `hasher.inputs[0] <== password`: 秘密の入力`password`を、Poseidonハッシュ関数の入力としてセットしています。
-   `hash <== hasher.out`: これが回路の最も重要な部分、**「制約（Constraint）」**です。ハッシュ関数の計算結果（`hasher.out`）が、公開されている`hash`と等しくなければならない、というルールを課しています。この制約を満たす`password`を知っていることこそが、この回路が証明したい内容そのものなのです。

## 🔢 回路のコンパイル

設計図が完成したので、次はこの`PasswordHash.circom`ファイルをコンパイルします。コンパイルすることで、証明を生成するために必要な**`wasm`ファイル**と、回路の制約を数学的に記述した**`r1cs`ファイル**が生成されます。

ターミナルで以下のコマンドを実行してください。

```bash
pnpm circuit run compile
```

このコマンドは、`pkgs/circuit/package.json`に定義されたスクリプトを実行し、`pkgs/circuit/circuits/PasswordHash.circom`を読み込みます。そして、`pkgs/circuit/build`ディレクトリ内に`PasswordHash.r1cs`と`PasswordHash_js/PasswordHash.wasm`という2つの重要なファイルを出力します。

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
