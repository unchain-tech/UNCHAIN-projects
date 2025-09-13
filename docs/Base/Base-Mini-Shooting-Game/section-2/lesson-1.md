---
title: "スマートコントラクトをデプロイする"
---

# Lesson 1: スマートコントラクトをデプロイする

このレッスンでは、ゲームの結果を記録し、NFTをミントするためのスマートコントラクトをBase Sepoliaテストネットにデプロイします。

## 🎮 ゲームコントラクトの概要

今回使用するスマートコントラクト`ShootingGameNFT.sol`は、ERC1155規格に準拠したNFTコントラクトです。

主な機能は以下の通りです。

-   **NFTのミント**:   
    プレイヤーがゲームで倒した敵の数だけ、対応するIDのNFTをミントします。

-   **所有権**:   
    OpenZeppelinの`Ownable`を継承しており、コントラクトのオーナーのみがURIの設定や一括ミントなどの管理者機能を実行できます。

-   **供給量の追跡**:   
    `ERC1155Supply`を継承しており、各NFTの総供給量を追跡できます。

スタータープロジェクトの`packages/contract/src/ShootingGameNFT.sol`にコードが用意されています。

```solidity
// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.4.0
pragma solidity ^0.8.27;

import {ERC1155} from "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import {ERC1155Burnable} from "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";
import {ERC1155Supply} from "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/**
 * シューティングゲームNFT
 * 倒した敵の数だけERC1155のNFTがミントされる
 */
contract ShootingGameNFT is ERC1155, Ownable, ERC1155Burnable, ERC1155Supply {

    /**
     * コンストラクター 
     */
    constructor(address initialOwner) ERC1155("") Ownable(initialOwner) {}

    /**
     * トークンURIを変更するメソッド
     */
    function setURI(string memory newuri) public onlyOwner {
        _setURI(newuri);
    }

    /**
     * NFTをミントするメソッド 
     */
    function mint(address account, uint256 id, uint256 amount, bytes memory data)
        public
    {
        _mint(account, id, amount, data);
    }

    /**
     * 複数のNFTをまとめて一括でミントするメソッド 
     */
    function mintBatch(address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data)
        public
        onlyOwner
    {
        _mintBatch(to, ids, amounts, data);
    }

    // The following functions are overrides required by Solidity.

    function _update(address from, address to, uint256[] memory ids, uint256[] memory values)
        internal
        override(ERC1155, ERC1155Supply)
    {
        super._update(from, to, ids, values);
    }
}
```

## 🔧 Remix IDEでのデプロイ

スマートコントラクトのデプロイには、ブラウザで利用できる[Remix IDE](https://remix.ethereum.org/)を使用します。

![](/images/Base-Mini-Shooting-Game/section-2/lesson-1/0.png)

### 1. ファイルの準備

まず、Remix IDEにコントラクトのコードを貼り付けます。

1.  [Remix IDE](https://remix.ethereum.org/)を開きます。
2.  `File Explorers`パネルの`contracts`フォルダ内に、`ShootingGameNFT.sol`という名前で新しいファイルを作成します。
3.  上記のソースコードをすべてコピーし、Remixの`ShootingGameNFT.sol`に貼り付けます。

### 2. コントラクトのコンパイル

次に、SolidityのコードをEVMが実行できる形式にコンパイル（変換）します。

1.  左のメニューから「**Solidity Compiler**」タブを選択します。
2.  `COMPILER`のバージョンが`0.8.27`以降になっていることを確認します。
3.  `ShootingGameNFT.sol`が開かれている状態で、「**Compile ShootingGameNFT.sol**」ボタンをクリックします。
4.  コンパイラタブのアイコンに緑色のチェックマークが表示されれば、コンパイル成功です。

![](/images/Base-Mini-Shooting-Game/section-2/lesson-1/1.png)

### 3. Base Sepoliaへの接続

デプロイ先をBase Sepoliaテストネットに設定します。これにはMetaMaskのようなブラウザウォレットが必要です。

1.  ウォレットに[Base Sepoliaテストネット](https://chainlist.org/chain/84532)を追加し、ネットワークを切り替えます。
2.  [Coinbase Faucet](https://ethglobal.com/faucet/base-sepolia-84532)などから、テスト用のETHを取得しておきます。
3.  Remixの左メニューから「**Deploy & run transactions**」タブを選択します。
4.  `ENVIRONMENT`のドロップダウンから「**Injected Provider - （ウォレット名）**」を選択します。ウォレットがポップアップし、接続を求められたら許可してください。接続先がbase sepoliaになっていればOKです！

![](/images/Base-Mini-Shooting-Game/section-2/lesson-1/2.png)

### 4. デプロイの実行

いよいよコントラクトをデプロイします。

1.  `CONTRACT`のドロップダウンで`ShootingGameNFT - contracts/ShootingGameNFT.sol`が選択されていることを確認します。
2.  `Deploy`ボタンの横にあるテキストフィールドに、`initialOwner`としてあなた自身のウォレットアドレスを入力します。
3.  「**Deploy**」ボタンをクリックします。
4.  ウォレットがポップアップし、トランザクションの確認を求められます。内容を確認し、「**確認**」をクリックしてガス代を支払います。
5.  デプロイが完了すると、Remixの下部にあるターミナルに成功ログが表示され、`Deployed Contracts`セクションにコントラクトが表示されます。

## 📝 コントラクトアドレスの設定

デプロイしたコントラクトをフロントエンドから利用するために、コントラクトアドレスを設定します。

1.  Remixの`Deployed Contracts`セクションに表示されている`SHOOTINGGAMENFT`コントラクトの横にあるコピーアイコンをクリックして、コントラクトアドレスをコピーします。
2.  `utils/constants.ts`ファイルを開きます。
3.  `GAME_NFT_CONTRACT_ADDRESS`の値を、先ほどコピーしたあなた自身のコントラクトアドレスに書き換えてください。

```typescript
// utils/constants.ts

// base sepoliaにデプロイしたシューティングゲームNFT
export const NFT_ADDRESS = '<ここにコントラクトアドレスを貼り付ける>';
```

これで、スマートコントラクトのデプロイとフロントエンドへの設定が完了しました。

次のセクションでは、いよいよフロントエンドアプリケーションの実装に入ります。

---

### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discordの`#base`で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の3点を記載してください ✨

1.  質問が関連しているセクション番号とレッスン番号
2.  何をしようとしていたか
3.  エラー文をコピー&ペースト
4.  エラー画面のスクリーンショット
