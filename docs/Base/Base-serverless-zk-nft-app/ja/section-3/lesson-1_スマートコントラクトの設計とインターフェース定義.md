---
title: "🔗 スマートコントラクトの設計とインターフェース定義"
---

このレッスンでは、ゼロ知識証明を使ってNFTをミントするスマートコントラクト`ZKNFT.sol`の全体像を設計し、証明を検証するための「窓口」となる**インタフェース**を定義します。

## 🏛️ スマートコントラクトのアーキテクチャ

このプロジェクトのバックエンドは、2つの主要なスマートコントラクトが連携して動作します。役割分担が重要です。

1.  **`PasswordHashVerifier.sol` （検証者コントラクト） 🕵️‍♂️**:
    *   これは、前のセクションで`circom`と`snarkjs`を使って**自動生成されたコントラクト**です。私たちはこの中身を直接編集しません。
    *   役割はただ一つ、**「提出されたゼロ知識証明が正しいかどうか」を厳格に検証すること**です。`verifyProof`という関数を持っており、これに証明データを渡すと、有効であれば`true`を、無効であれば`false`を返します。まさに門番のような存在です。

2.  **`ZKNFT.sol` （NFTコントラクト） 🖼️**:
    *   こちらが私たちが**メインで開発するコントラクト**です。
    *   OpenZeppelinの`ERC721`標準を継承しており、NFTとしての基本的な機能（所有権の管理、転送など）を備えています。
    *   NFTをミントするための特別な`safeMint`関数を実装します。この関数の内部で、門番である`PasswordHashVerifier.sol`に「この証明は本物ですか？」と問い合わせます。証明が有効な場合にのみ、NFTのミントが実行される仕組みです。

このように役割を分離することで、**検証ロジック**と**アプリケーションロジック**が明確に分かれ、コードが整理されて読みやすく、メンテナンスしやすい状態になります。

## ✍️ 検証コントラクトのインタフェースを定義する

`ZKNFT.sol`が`PasswordHashVerifier.sol`の`verifyProof`関数を呼び出すためには、その関数の仕様（どのような引数を受け取り、何を返すか）を定義した**「インタフェース」**が必要です。インタフェースは、異なるコントラクト同士が安全に通信するための「共通言語」や「取り決め」のようなものです。

まず、`pkgs/backend/contracts/interface`ディレクトリを作成しましょう。

```bash
mkdir -p pkgs/backend/contracts/interface
```

次に、`pkgs/backend/contracts/interface/IPasswordHashVerifier.sol`というファイルを作成し、以下のコードを記述します。

```solidity
// pkgs/backend/contracts/interface/IPasswordHashVerifier.sol
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

/**
 * @title IPasswordHashVerifier
 * @dev `PasswordHashVerifier.sol`と通信するためのインターフェース。
 * snarkjsによって自動生成された検証コントラクトの`verifyProof`関数を定義します。
 */
interface IPasswordHashVerifier {
    /**
     * @dev Groth16 ZK-SNARKの証明を検証します。
     * @param a 証明のコンポーネント
     * @param b 証明のコンポーネント
     * @param c 証明のコンポーネント
     * @param input 公開入力（このプロジェクトではパスワードのハッシュ値）
     * @return r 検証が成功した場合はtrue、それ以外はfalse
     */
    function verifyProof(
        uint256[2] memory a,
        uint256[2][2] memory b,
        uint256[2] memory c,
        uint256[1] memory input
    ) external view returns (bool r);
}
```

### 🔍 コード解説

-   `interface IPasswordHashVerifier`: これがインタフェースの定義です。`ZKNFT.sol`は、この「取り決め」に従って検証コントラクトと対話します。
-   `function verifyProof(...)`: `snarkjs`が生成した`PasswordHashVerifier.sol`に含まれる`verifyProof`関数の**シグネチャ**（関数名、引数、戻り値の型）を正確に定義しています。
    -   `a`, `b`, `c`: これらは**Groth16証明**を構成する主要なデータです。クライアント（フロントエンド）から証明として提供されます。
    -   `input`: これは証明の**公開入力（public input）**です。私たちの回路では、**パスワードのハッシュ値**がこの`input`に対応します。
    -   `returns (bool r)`: 関数が`bool`型（`true`または`false`）の値を返すことを示します。

このインタフェースを定義することで、`ZKNFT.sol`は`PasswordHashVerifier.sol`の複雑な内部実装を一切知らなくても、`verifyProof`関数を安全に呼び出すことができるようになります。

---

準備は整いました！ 次のレッスンでは、このインタフェースを使って、`ZKNFT.sol`コントラクト本体をステップバイステップで実装していきます。

### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discordの`#zk`で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の3点を記載してください ✨

1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット

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
