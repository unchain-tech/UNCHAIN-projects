---
title: "スマートコントラクトの設計とインターフェース定義"
---

このレッスンでは、ゼロ知識証明を使ってNFTをミントするスマートコントラクト`ZKNFT.sol`の全体像を設計し、証明を検証するためのインタフェースを定義します。

## 🏛️ スマートコントラクトのアーキテクチャ

このプロジェクトのバックエンドは、2つの主要なスマートコントラクトで構成されます。

1.  **`PasswordHashVerifier.sol`**:
    *   これは、前のセクションで`circom`と`snarkjs`を使って自動生成されたコントラクトです。
    *   役割はただ一つ、「特定の証明が正しいかどうか」を検証することです。`verifyProof`という関数を持っており、これに証明データを渡すと、有効であれば`true`を、無効であれば`false`を返します。
    *   このコントラクトを直接変更することはありません。

2.  **`ZKNFT.sol`**:
    *   こちらが私たちがメインで開発するコントラクトです。
    *   OpenZeppelinの`ERC721`標準を継承して、NFTとしての基本的な機能（所有権、転送など）を持ちます。
    *   NFTをミントする`safeMint`関数を実装します。この関数の内部で、`PasswordHashVerifier.sol`を呼び出し、提出されたゼロ知識証明が正しいことを確認します。証明が有効な場合にのみ、NFTのミントが成功します。

このように役割を分離することで、検証ロジックとアプリケーションロジックが明確に分かれ、コードの可読性と保守性が向上します。

## ✍️ 検証コントラクトのインタフェースを定義する

`ZKNFT.sol`が`PasswordHashVerifier.sol`の`verifyProof`関数を呼び出すためには、その関数の仕様を定義した「インタフェース」が必要です。

まず、`pkgs/backend/contracts/interface`ディレクトリを作成しましょう。

```bash
mkdir -p pkgs/backend/contracts/interface
```

次に、`pkgs/backend/contracts/interface/IPasswordHashVerifier.sol`というファイルを作成し、以下のコードを記述します。

```solidity
// pkgs/backend/contracts/interface/IPasswordHashVerifier.sol
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

interface IPasswordHashVerifier {
    function verifyProof(
        uint256[2] memory a,
        uint256[2][2] memory b,
        uint256[2] memory c,
        uint256[1] memory input
    ) external view returns (bool r);
}
```

### コード解説

- `interface IPasswordHashVerifier`: これがインタフェースの定義です。`ZKNFT.sol`は、このインタフェースを介して検証コントラクトと対話します。
- `function verifyProof(...)`: `snarkjs`が生成した`PasswordHashVerifier.sol`に含まれる`verifyProof`関数のシグネチャ（関数名、引数、戻り値）を定義しています。
    - `a`, `b`, `c`: これらはGroth16証明の主要なコンポーネントです。証明者が提供します。
    - `input`: これは証明の公開入力（public input）です。我々の回路では、パスワードのハッシュ値がこれにあたります。
    - `returns (bool r)`: 関数が`bool`型（`true`または`false`）の値を返すことを示します。

このインタフェースを定義することで、`ZKNFT.sol`は`PasswordHashVerifier.sol`の具体的な実装を知らなくても、`verifyProof`関数を安全に呼び出すことができるようになります。

---

次のレッスンでは、このインタフェースを使って、`ZKNFT.sol`コントラクト本体をステップバイステップで実装していきます。

### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discordの`#zk`で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の3点を記載してください ✨

1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット


    ```bash
    pnpm backend run compile
    ```

2.  **テスト**:
    デプロイする前に、テストを実行してコントラクトが意図通りに動作することを確認します。

    ```bash
    pnpm backend run test
    ```

    テストの中では、有効な証明と無効な証明の両方のケースをシミュレートして、`safeMint`関数が正しく動作するかを検証しています。

3.  **デプロイ**:
    いよいよデプロイです。`Hardhat Ignition`というツールを使って、安全かつ確実にデプロイを行います。

    ```bash
    pnpm backend run deploy:ZKNFT --network base-sepolia
    ```

    このコマンドは、まず`PasswordHashVerifier.sol`をデプロイし、次にそのアドレスをコンストラクタの引数として`ZKNFT.sol`をデプロイします。
    デプロイが成功すると、ターミナルにコントラクトアドレスが表示されます。

4.  **コントラクトの検証**:
    デプロイしたコントラクトのソースコードを、Basescan（ブロックエクスプローラー）に公開して、透明性を高めます。

    ```bash
    pnpm backend run verify chain-84532 --include-unrelated-contracts
    ```

    `chain-84532`はBase SepoliaのチェーンIDです。

これでスマートコントラクトの開発とデプロイは完了です。次のセクションでは、このコントラクトと対話するためのフロントエンドを構築していきます。

## 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discordの`#zk`で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の3点を記載してください ✨

1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット
