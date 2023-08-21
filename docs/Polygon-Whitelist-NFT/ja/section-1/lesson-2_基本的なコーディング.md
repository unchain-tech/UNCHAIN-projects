### ホワイトリスト機能付きのスマートコントラクトをデプロイする

#### 最初の試み

準備はできましたか？ それでは始めましょう！

まず、左側のExplorerで`Contracts`というフォルダを作成しましょう。

![image-20230222151853564](/public/images/Polygon-Whitelist-NFT/section-1/1_2_1.png)

次に、`Contracts`フォルダの下に`Whitelist.sol`という新しいスマートコントラクトファイルを作成します。

![image-20230222152021342](/public/images/Polygon-Whitelist-NFT/section-1/1_2_2.png)

`Whitelist.sol`では、シンプルなコードのブロックから始めましょう。

```solidity
// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.4;

contract Whitelist {
    constructor() {
    }
}
```

コードを一行ずつ解説します。

```solidity
// SPDX-License-Identifier: UNLICENSED
```

この行は`SPDXライセンス識別子`と呼ばれ、その後に続くコードの著作権の問題に対処します。一般的には、`UNLICENSED`と`MIT`が最もよく使われる接尾辞で、これは以下のコードが誰でも使ってよいことを示します。言い換えれば、皆さんは自由にコピー&ペーストすることができます。詳細は[こちら](https://spdx.org/licenses/?utm_source=buildspace.so&utm_medium=buildspace_project)で確認できます。

```solidity
pragma solidity ^0.8.4;
```

これは、コントラクトに使用するSolidityコンパイラのバージョンを指定します。`0.8.4`から`0.9.0`の間のバージョンのSolidityコンパイラのみが使用できることを意味します。

```solidity
contract Whitelist {
    constructor() {

    }
}
```

これがSolidityコードの本体です。`.sol`ファイルには複数のコントラクトを含めることができますが、プライマリコントラクトの名前はファイル名と同じでなければなりません。この場合は`Whitelist`です。ここでは、1つのコントラクトのみを含めています。コンストラクタは、コントラクトがデプロイされたときに実行される関数です。さらに、最初の中括弧`{}`には状態変数や関数などが含まれ、これらは一般的にコードの約85~95％を占めます。

#### コードの実行方法

右側のSolidity Compilerパネルをクリックすると、ChainIDEが自動的にコンパイラのバージョンを選択してくれているのがわかります。「Optimization」を選択すると、コンパイルされたバイトコードが最適化され、デプロイ時のガスが削減されます。今はチェックする必要はないので、そのまま「`Compile Whitelist.sol`」をクリックしてください。

![image-20230222154237333](/public/images/Polygon-Whitelist-NFT/section-1/1_2_3.png)

下部にABIとBYTE CODEが生成されているのがわかります。一般的に、ABIはスマートコントラクトと他のアプリケーションとの間の通信プロトコルを定義し、それらが相互に呼び出しや対話を行うことを可能にします。実際、これはスマートコントラクトがフロントエンドとどのように対話するかの点で非常に役立ちます。BYTE CODEはバイナリエンコーディングであり、EVMベースのチェーン（ETH、Polygon、BNB Chain、Conflux、EVMを基盤として使用する他のチェーン）にコントラクトをデプロイするための基本原理は、BYTE CODEをアップロードすることで実現します。

![image-20230222155740298](/public/images/Polygon-Whitelist-NFT/section-1/1_2_4.png)

Deploy & Interactionパネルに切り替え、JS VMに接続し（JS VMはJavaScriptで実装されたEVMで、ブラウザサイドのテストに非常に便利です）、「`Deploy`」をクリックします。

![image-20230222155859096](/public/images/Polygon-Whitelist-NFT/section-1/1_2_5.png)

下の`INTERACT`セクションで、今デプロイしたスマートコントラクトを見ることができます。まだ関数も状態変数もないので、完全に空っぽです。次に、スマートコントラクトをより充実したものにするために、これらの要素を追加していきます。

![image-20230222160157031](/public/images/Polygon-Whitelist-NFT/section-1/1_2_6.png)