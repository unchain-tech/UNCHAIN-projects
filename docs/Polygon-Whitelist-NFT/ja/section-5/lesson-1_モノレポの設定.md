### 📦 モノレポの設定

ファイル構成をモノレポ構成に更新しましょう。モノレポとは、コントラクトとクライアント（またはその他構成要素）の全コードをまとめて1つのリポジトリで管理する方法です。

プロジェクトのルートに`package.json`を作成します。

![](/public/images/Polygon-Whitelist-NFT/section-5/5_1_1.png)

作成したpackage.jsonに下記を記述してください。

```json
{
  "name": "polygon-whitelist-nft",
  "version": "1.0.0",
  "license": "MIT",
  "private": true,
  "workspaces": {
    "packages": [
      "packages/*"
    ]
  },
  "scripts": {
    "contract": "yarn workspace contract",
    "client": "yarn workspace client",
    "test": "yarn contract test"
  }
}

```

次に、`workspaces`を構成していきましょう。プロジェクトのルートに`packages`フォルダを作成します。

![](/public/images/Polygon-Whitelist-NFT/section-5/5_1_2.png)

#### client

`client`フォルダを`packages`フォルダの中に移動しましょう。

![](/public/images/Polygon-Whitelist-NFT/section-5/5_1_3.png)

clientフォルダ内の`yarn.lock`ファイルを削除しましょう。モノレポ構成にする場合、プロジェクトのルートで一元管理されるため、各workspace内のyarn.lockファイルは不要になります。

![](/public/images/Polygon-Whitelist-NFT/section-5/5_1_4.png)

#### contract

作成したコントラクトの自動テストを追加するため、[Hardhat](https://hardhat.org/)を使用して`packages/contract`フォルダを構成していきたいと思います。

`packages`フォルダの中に`contract`フォルダを作成しましょう。

![](/public/images/Polygon-Whitelist-NFT/section-5/5_1_5.png)

contractフォルダの中に`package.json`ファイルを作成します。

![](/public/images/Polygon-Whitelist-NFT/section-5/5_1_6.png)

作成したpackage.jsonファイルに、下記を記述してください。

```json
{
    "name": "contract",
    "version": "1.0.0",
    "private": true,
    "scripts": {
      "clean": "npx hardhat clean",
      "compile": "hardhat compile",
      "coverage": "hardhat coverage",
      "test": "hardhat test"
    }
}
```

Hardhatを使ってプロジェクトを構築しましょう。プロジェクトのルートで下記のコマンドを実行してください。

```
yarn workspace contract add --dev hardhat@^2.14.0
```

packages/contract/package.jsonにhardhatが追加されていることを確認しましょう。インストールが成功したにも関わらず、hardhatが追加されていない場合はブラウザをリロードしてみてください。

次に必要なツールをインストールします。先ほどと同様に、プロジェクトのルートで下記のコマンドを実行してください。

```
yarn workspace contract add @openzeppelin/contracts@^5.0.0 && yarn workspace contract add --dev @nomicfoundation/hardhat-chai-matchers@^1.0.0 @nomicfoundation/hardhat-network-helpers@^1.0.8 @nomicfoundation/hardhat-toolbox@^2.0.1 @nomiclabs/hardhat-ethers@^2.0.0 @nomiclabs/hardhat-etherscan@^3.0.0 @typechain/ethers-v5@^10.1.0 @typechain/hardhat@^6.1.2 @types/chai@^4.2.0 @types/mocha@^9.1.0 chai@^4.3.7 hardhat-gas-reporter@^1.0.8 solidity-coverage@^0.8.1 ts-node@^8.0.0 typechain@^8.1.0 typescript@^4.5.0
```

ここまでで、packages/contract/package.jsonは下記のようになっているはずです。

```json
{
    "name": "contract",
    "version": "1.0.0",
    "private": true,
    "devDependencies": {
        "@nomicfoundation/hardhat-chai-matchers": "^1.0.0",
        "@nomicfoundation/hardhat-network-helpers": "^1.0.8",
        "@nomicfoundation/hardhat-toolbox": "^2.0.1",
        "@nomiclabs/hardhat-ethers": "^2.0.0",
        "@nomiclabs/hardhat-etherscan": "^3.0.0",
        "@typechain/ethers-v5": "^10.1.0",
        "@typechain/hardhat": "^6.1.2",
        "@types/chai": "^4.2.0",
        "@types/mocha": "^9.1.0",
        "chai": "^4.3.7",
        "hardhat": "^2.14.0",
        "hardhat-gas-reporter": "^1.0.8",
        "solidity-coverage": "^0.8.1",
        "ts-node": "^8.0.0",
        "typechain": "^8.1.0",
        "typescript": "^4.5.0"
    },
    "dependencies": {
        "@openzeppelin/contracts": "^4.8.2"
    }
}
```

それでは、Hardhatを使用してプロジェクトを生成しましょう。packages/contract/下に移動して、下記のコマンドを実行してください。

```
npx hardhat init
```

下記のようにプロジェクトの設定を行いましょう。

```
✔ What do you want to do? · Create a TypeScript project
✔ Hardhat project root: · (Enterを押すと自動で設定されます)
✔ Do you want to add a .gitignore? (Y/n) · y
```

⚠️ うまく表示されない（選択肢が表示されない、表示が詰まってしまう等）場合があります。そのような場合には、先にSection5 Lesson3に取り組み、GitHub上へアップロード後にローカル環境へクローンしてから再度残りのレッスンを再開することをおすすめします。

プロジェクトの生成に成功した場合、現時点でこのような構成となっていることを確認しましょう。

![](/public/images/Polygon-Whitelist-NFT/section-5/5_1_7.png)

それでは、`packages/contract`フォルダ内のファイルを更新していきましょう。

まずは、プロジェクトのルートにあるcontractsフォルダを`packages/contract`フォルダ内に移動しましょう。下記のコマンドは、プロジェクトのルートで実行してください。

```
rm -r ./packages/contract/contracts/ && mv ./contracts/ ./packages/contract/
```

次に、`hardhat.config.ts`を下記のように更新しましょう。

```typescript
import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';

const config: HardhatUserConfig = {
  solidity: '0.8.20',
  paths: {
    artifacts: '../client/artifacts',
  },
};

export default config;

```

solidityのコンパイラバージョンを修正し、ABIが格納される`artifacts`フォルダの生成先を設定しました。

それでは、ここで動作確認をしてみましょう。下記のコマンドをプロジェクトのルートで実行してください。

```
yarn install
```

パッケージのインストールが完了したら、コントラクトをコンパイルしてみましょう。

```
yarn contract compile
```

次に、フロントエンドを立ち上げてみましょう。

```
yarn client dev
```

問題なく実行されたら、モノレポの設定は完了です！

### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discordの`#polygon`で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の4点を記載してください ✨

```
1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット
```