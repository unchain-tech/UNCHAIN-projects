### 🌻 genesis file

このレッスンではSubnetをカスタムします。

`genesis file`を作成し、それを元にSubnetを作成することで独自のカスタムを加えることができます。

> 📓 genesis file
> Subnetの初期設定を含むファイルです。
> Subnetを作成する際、Avalancheはパラメータに基づいてジェネシスファイルを自動で生成します。
> また、独自のgenesis fileを作成することもできます。これにより、Subnetの構成をより詳細に制御することができます。

前回のレッスンで作成したmySubnetのgenesis fileは以下のコマンドで内容を確認することができます。

```
cat ~/.avalanche-cli/subnets/mySubnet/genesis.json
```

または

```
avalanche subnet describe mySubnet --genesis
```

出力結果

```
% avalanche subnet describe mySubnet --genesis
{
    "config": {
        "chainId": 1111,
        "feeConfig": {
            "gasLimit": 8000000,
            "targetBlockRate": 2,
            "minBaseFee": 25000000000,
            "targetGas": 15000000,
            "baseFeeChangeDenominator": 36,
            "minBlockGasCost": 0,
            "maxBlockGasCost": 1000000,
            "blockGasCostStep": 200000
        },
        "homesteadBlock": 0,
        "eip150Block": 0,
        "eip150Hash": "0x2086799aeebeae135c246c65021c82b4e15a2c451340993aacfd2751886514f0",
        "eip155Block": 0,
        "eip158Block": 0,
        "byzantiumBlock": 0,
        "constantinopleBlock": 0,
        "petersburgBlock": 0,
        "istanbulBlock": 0,
        "muirGlacierBlock": 0,
        "subnetEVMTimestamp": 0
    },
    "nonce": "0x0",
    "timestamp": "0x0",
    "extraData": "0x",
    "gasLimit": "0x7a1200",
    "difficulty": "0x0",
    "mixHash": "0x0000000000000000000000000000000000000000000000000000000000000000",
    "coinbase": "0x0000000000000000000000000000000000000000",
    "alloc": {
        "8db97c7cece249c2b98bdc0226cc4c2a57bf52fc": {
            "balance": "0xd3c21bcecceda1000000"
        }
    },
    "airdropHash": "0x0000000000000000000000000000000000000000000000000000000000000000",
    "airdropAmount": null,
    "number": "0x0",
    "gasUsed": "0x0",
    "parentHash": "0x0000000000000000000000000000000000000000000000000000000000000000",
    "baseFeePerGas": null
}
```

以下、主要部分にコメントをつけたので簡単にgenesis fileの中身を確認します。

```
{
    "config": {
        "chainId": チェーンID。
        "feeConfig": {
            "gasLimit": 1つのブロックで使用できるガスの総量。
            "targetBlockRate": ブロックの生成間隔時間(秒)。
            "minBaseFee": トランザクションで使用できる最小の基本料金。
            "targetGas": 10秒間隔で消費するガスの目標量。利用量と目標量の比較で基本料金が増減されます。
            "baseFeeChangeDenominator": 利用量と目標量の差を割る分母値。基本料金の増減具合を決定します。
            "minBlockGasCost": ブロックの生産に課金するガスの最小量。
            "maxBlockGasCost": ブロックの生産に課金するガスの最大量。
            "blockGasCostStep": ブロックのガスコストの変化量を求める際に使用する値。
        },
    },
    "gasLimit": feeConfig内のgasLimitと同じである必要があります。0x7a1200は8,000,000の16進数表記です。
    "alloc": {
        アドレスとその初期残高を定義します。
        残高は10進数でも16進数でも定義可能です。
    },
}
```

genesis fileの中身について、詳しくは[こちら](https://docs.avax.network/subnets/customize-a-subnet)、または[こちら](https://docs.avax.network/community/tutorials-contest/2022/avax-subnet-customization)をご覧ください。


### ✅ 環境構築を行う

genesis fileを作成する前に作業用ディレクトリを用意しましょう。

あなたのコンピュータのお好きな場所に`AVAX-Subnet`というディレクトリを作成してください。

⚠️ 本プロジェクトは全てのレッスンを終えたら、この`AVAX-Subnet`ディレクトリをルートとしたリポジトリを提出します。
今後ディレクトリ構成をレッスンと同じ構成にするよう気をつけてください。 💁

また、前回作成したmySubnetがローカルネットワーク上で起動している場合、`avalanche network status`をターミナルで実行すると以下のような表示がされると思います。

![](/public/images/AVAX-Subnet/section-1/1_3_1.png)

`Avalanche-CLI`の操作に慣れるためにもう一度mySubnetを削除します。

まずはローカルネットワークからmySubnetを削除します。
`avalanche network clean`を実行するとローカルネットワーク上のサブネット情報を永久的に削除します。

```
% avalanche network clean
Process terminated.
```

再び`avalanche network status`を実行し、ローカルネットワーク上にサブネットがなければ以下のような表示がされます。

```
% avalanche network status
Requesting network status...
Error: timed out trying to contact backend controller、it is most probably not running
```

次に`avalanche subnet list --deployed`を実行すると以下のように作成されたsubnetの状態が表示されます。

```
% avalanche subnet list --deployed
+----------+----------+----------+-----------+-----------+-------+----------+---------+
|  SUBNET  |  CHAIN   | CHAIN ID |   TYPE    | FROM REPO |       | DEPLOYED |         |
+----------+----------+----------+-----------+-----------+-------+----------+---------+
|          |          |          |           |           | Local | Fuji     | Mainnet |
+----------+----------+----------+-----------+-----------+-------+----------+---------+
| mySubnet | mySubnet |     1111 | SubnetEVM | false     | No    | No       | No      |
+----------+----------+----------+-----------+-----------+-------+----------+---------+
```

先ほどローカルネットワークから削除したので、`DEPLOYED`項目の`Local`が`No`になっています。

さらに、`avalanche subnet delete mySubnet`を実行して作成したサブネットを削除してください。

```
% avalanche subnet delete mySubnet
```

 `avalanche subnet list`を実行すると、`mySubnet`が削除されてる事が確認できます。

```
% avalanche subnet list
+--------+-------+---------+------+------+-----------+
| SUBNET | CHAIN | CHAINID | VMID | TYPE | FROM REPO |
+--------+-------+---------+------+------+-----------+
+--------+-------+---------+------+------+-----------+
```


これから新しくmySubnetを作っていきます。

### 🦀 genesis fileの作成

`AVAX-Subnet`ディレクトリ直下に`genesis`というディレクトリを作成し、その中に`mygenesis.json`という名前のファイルを作成してください。

ディレクトリ構成。

```
AVAX-Subnet
└── genesis
    └── mygenesis.json
```

`mygenesis.json`の中にベースとなる以下の内容を貼り付けてください。

```
{
    "config": {
      "chainId": "change me",
      "homesteadBlock": 0,
      "eip150Block": 0,
      "eip150Hash": "0x2086799aeebeae135c246c65021c82b4e15a2c451340993aacfd2751886514f0",
      "eip155Block": 0,
      "eip158Block": 0,
      "byzantiumBlock": 0,
      "constantinopleBlock": 0,
      "petersburgBlock": 0,
      "istanbulBlock": 0,
      "muirGlacierBlock": 0,
      "SubnetEVMTimestamp": 0,
      "feeConfig": {}
    },
    "alloc": {},
    "nonce": "0x0",
    "timestamp": "0x0",
    "extraData": "0x00",
    "gasLimit": "change me",
    "difficulty": "0x0",
    "mixHash": "0x0000000000000000000000000000000000000000000000000000000000000000",
    "coinbase": "0x0000000000000000000000000000000000000000",
    "number": "0x0",
    "gasUsed": "0x0",
    "parentHash": "0x0000000000000000000000000000000000000000000000000000000000000000"
  }
```

🦌 `chainId`の定義

`chainId`の項目を以下のように変更してください。

文字列`"321123"`にならないように気をつけてください。

```
      "chainId": 321123,
```

🦌 `feeConfig`の定義

`feeConfig`の項目を以下のように変更してください。

```
      "feeConfig": {
        "gasLimit": 8000000,
        "minBaseFee": 25000000000,
        "targetGas": 15000000,
        "baseFeeChangeDenominator": 36,
        "minBlockGasCost": 0,
        "maxBlockGasCost": 1000000,
        "targetBlockRate": 2,
        "blockGasCostStep": 200000
      }
```

🦌 `gasLimit`の定義

`gasLimit`の項目を以下のように変更してください。
※`feeConfig`内の`gasLimit`と同じ値（16進数表記）になります。

```
    "gasLimit": "0x7A1200",
```

🦌 `alloc`の定義

`alloc`の項目を以下のように変更してください。

```
    "alloc": {
        "あなたのアカウントのアドレス": {
          "balance": "0x3635C9ADC5DEA00000"
        }
    },
```

ここでは、Subnetのデプロイ時にネイティブトークンを送信するアカウントを定義しています。

`balance`は送信するトークンの量（16進数表記）を表しています。

本プロジェクトでは、アドレス`0x9726A1976148789be35a4EEb6AEfBBF4927b04AC`を使用するため以下のようになります。
⚠️ 接頭辞の`0x`を除いてください。

```
    "alloc": {
        "9726A1976148789be35a4EEb6AEfBBF4927b04AC": {
          "balance": "0x3635C9ADC5DEA00000"
        }
    },
```

🦌 **PreCompile**の定義

最後にPreCompileの定義を追加します。

PreCompileとは、Avalancheが事前に用意したコンパイル済みのコントラクトであり、ネットワークへのアクセス制限などに利用できます。

PreCompileは以下の3つが用意されています。

`ContractNativeMinter`: ネイティブトークンをmintできるアカウントを制御できます。

`ContractDeployerAllowList`: コントラクトをデプロイできるアカウントを制御できます。

`TransactionAllowList`: トランザクションを提出できるアカウントを制御できます。

全てのPreCompileは以下のインタフェースを実装しているので、コントラクトを使用する場合は以下のインタフェースにある関数を呼び出すことで可能です。

```
//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IAllowList {
  // addrを管理者アカウントに設定します。
  function setAdmin(address addr) external;

  // addrに権限を与えます。(例：ContractNativeMinterの場合はmintする権限を与えます)。
  function setEnabled(address addr) external;

  // addrの権限を無くします。
  function setNone(address addr) external;

  // addrのロールを取得します。
  function readAllowList(address addr) external view returns (uint256 role);
}
```

roleは以下のenumで管理されています。

```
enum BillStatus {
    None,
    Enabled,
    Admin
}
```

PreCompileを使用するには、genesis fileに定義する必要があります。

以下のように`feeConfig`の下に各PreCompileを使用する定義を追加してください。

```
      "feeConfig": {

      },
      "contractNativeMinterConfig": {
        "blockTimestamp": 0,
        "adminAddresses": ["管理者に使用するアカウントのアドレス"]
      },
      "contractDeployerAllowListConfig": {
        "blockTimestamp": 0,
        "adminAddresses": ["管理者に使用するアカウントのアドレス"]
      },
      "txAllowListConfig": {
        "blockTimestamp": 0,
        "adminAddresses": ["管理者に使用するアカウントのアドレス"]
      }
```

本プロジェクトでは、アドレス`0x9726A1976148789be35a4EEb6AEfBBF4927b04AC`を使用するため、`adminAddress`の項目はそれぞれ以下のようになります。

```
"adminAddresses": ["0x9726A1976148789be35a4EEb6AEfBBF4927b04AC"]
```

genesis fileの完成形は以下のようになっています。
（`管理者に使用するアカウントのアドレス`・`トークンを送信するアカウントのアドレス`の部分をご自身の使用するアカウントのアドレスに書き換えてください）。

```json
{
    "config": {
      "chainId": 321123,
      "homesteadBlock": 0,
      "eip150Block": 0,
      "eip150Hash": "0x2086799aeebeae135c246c65021c82b4e15a2c451340993aacfd2751886514f0",
      "eip155Block": 0,
      "eip158Block": 0,
      "byzantiumBlock": 0,
      "constantinopleBlock": 0,
      "petersburgBlock": 0,
      "istanbulBlock": 0,
      "muirGlacierBlock": 0,
      "SubnetEVMTimestamp": 0,
      "feeConfig": {
        "gasLimit": 8000000,
        "minBaseFee": 25000000000,
        "targetGas": 15000000,
        "baseFeeChangeDenominator": 36,
        "minBlockGasCost": 0,
        "maxBlockGasCost": 1000000,
        "targetBlockRate": 2,
        "blockGasCostStep": 200000
      },
      "contractNativeMinterConfig": {
        "blockTimestamp": 0,
        "adminAddresses": ["管理者に使用するアカウントのアドレス"]
      },
      "contractDeployerAllowListConfig": {
        "blockTimestamp": 0,
        "adminAddresses": ["管理者に使用するアカウントのアドレス"]
      },
      "txAllowListConfig": {
        "blockTimestamp": 0,
        "adminAddresses": ["管理者に使用するアカウントのアドレス"]
      }
    },
    "alloc": {
        "トークンを送信するアカウントのアドレス(※接頭辞の`0x`を除いてください)": {
          "balance": "0x3635C9ADC5DEA00000"
        }
    },
    "nonce": "0x0",
    "timestamp": "0x0",
    "extraData": "0x00",
    "gasLimit": "0x7A1200",
    "difficulty": "0x0",
    "mixHash": "0x0000000000000000000000000000000000000000000000000000000000000000",
    "coinbase": "0x0000000000000000000000000000000000000000",
    "number": "0x0",
    "gasUsed": "0x0",
    "parentHash": "0x0000000000000000000000000000000000000000000000000000000000000000"
  }
```

### 🚜 カスタムSubnetの作成

※ どこかしらでエラーが発生し、Subnetを作り直す時には下にあるTipsのセクションをご参照ください。

それではgenesis fileを使ってSubnetを作成します。

`AVAX-Subnet`ディレクトリ直下で以下のコマンドを実行してください。

```avalanche subnet create mySubnet --genesis genesis/mygenesis.json```

その後のプロンプトで`SubnetEVM`、`Use latest version`を選択します。

```
% avalanche subnet create mySubnet --genesis genesis/mygenesis.json
✔ SubnetEVM
Importing genesis
✔ Use latest version
Successfully created subnet configuration
```

### 🛫 Subnetのデプロイ

以下のコマンドを実行して`mySubnet`をローカルネットワークにデプロイします。

```
avalanche subnet deploy mySubnet
```

```
% avalanche subnet deploy mySubnet
✔ Local Network
Deploying [mySubnet] to Local Network
Backend controller started, pid: 31209, output at: /Users/ryojiro/.avalanche-cli/runs/server_20221209_175948/avalanche-cli-backend
VMs ready.
Starting network...
.........
Blockchain has been deployed. Wait until network acknowledges...
......
Network ready to use. Local network node endpoints:
+-------+----------+-------------------------------------------------------------------------------------+
| NODE  |    VM    |                                         URL                                         |
+-------+----------+-------------------------------------------------------------------------------------+
| node2 | mySubnet | http://127.0.0.1:9652/ext/bc/2vVjEw8dH2SVtkuC75CgofJNj5DKqJBfoc1ez3cYnvyu5kywWH/rpc |
+-------+----------+-------------------------------------------------------------------------------------+
| node3 | mySubnet | http://127.0.0.1:9654/ext/bc/2vVjEw8dH2SVtkuC75CgofJNj5DKqJBfoc1ez3cYnvyu5kywWH/rpc |
+-------+----------+-------------------------------------------------------------------------------------+
| node4 | mySubnet | http://127.0.0.1:9656/ext/bc/2vVjEw8dH2SVtkuC75CgofJNj5DKqJBfoc1ez3cYnvyu5kywWH/rpc |
+-------+----------+-------------------------------------------------------------------------------------+
| node5 | mySubnet | http://127.0.0.1:9658/ext/bc/2vVjEw8dH2SVtkuC75CgofJNj5DKqJBfoc1ez3cYnvyu5kywWH/rpc |
+-------+----------+-------------------------------------------------------------------------------------+
| node1 | mySubnet | http://127.0.0.1:9650/ext/bc/2vVjEw8dH2SVtkuC75CgofJNj5DKqJBfoc1ez3cYnvyu5kywWH/rpc |
+-------+----------+-------------------------------------------------------------------------------------+

Browser Extension connection details (any node URL from above works):
RPC URL:          http://127.0.0.1:9654/ext/bc/2vVjEw8dH2SVtkuC75CgofJNj5DKqJBfoc1ez3cYnvyu5kywWH/rpc
Funded address:   0x9726A1976148789be35a4EEb6AEfBBF4927b04AC with 1000
Network name:     mySubnet
Chain ID:         321123
Currency Symbol:  TEST
```

💁 前回のレッスンでMetamaskに追加したmySubnetのネットワークを削除し、同じステップで新たに今回のネットワークをMetamaskに追加してください。

上記のデータの中にあるRPC URLは後ほど使うのでどこかに保存しておいてください。

```
RPC URL: http://127.0.0.1:9654/ext/bc/2vVjEw8dH2SVtkuC75CgofJNj5DKqJBfoc1ez3cYnvyu5kywWH/rpc
```

### 📓 Tips

Subnetを作り直す時の手順

1. `avalanche network clean`
2. `avalanche subnet delete mySubnet`
3. `avalanche subnet create mySubnet --genesis genesis/mygenesis.json`
4. `avalanche subnet deploy mySubnet`
5. Metamaskの以前のネットワークを削除し、新たなネットワークを接続
6. コントラクトを再デプロイする場合は`hardhat.config`のRPC URLを更新（この先のsectionで扱います）

以下にavalancheコマンドの一覧をまとめます。

詳しくは[こちら](https://docs.avax.network/subnets/create-evm-subnet-config)をはじめとした`How to Use Avalanche-CLI`カテゴリーをご覧ください。

```
# subnetの作成
avalanche subnet create <subnetName>

# subnetのデプロイ
avalanche subnet deploy <subnetName>

# 作成したSubnetのリスト表示
avalanche subnet list

# Subnetの詳細表示
avalanche subnet describe <subnetName>

# Subnetの削除
avalanche subnet delete mySubnet
```

```
# ネットワーク ステータス確認
avalanche network status

# ネットワーク停止
avalanche network stop

# ネットワーク起動
avalanche network start

# データを永久的に削除
avalanche network clean
```

本プロジェクトはローカルネットワークにデプロイしましたが、テストネットやメインネットへのデプロイ方法は[こちら](https://docs.avax.network/subnets/create-a-fuji-subnet)や[こちら](https://docs.avax.network/subnets/create-a-mainnet-subnet)をご覧ください。

また、プライベートブロックチェーン（特定のバリデータのみがブロックチェーン上の情報を読み取ることができる）の作成については[こちら](https://docs.avax.network/nodes/maintain/subnet-configs#private-subnet)をご覧ください。

### 🐊 `GitHub`にソースコードをアップロードしよう

本プロジェクトは全てのレッスンを終えたら、完成物を提出するために`GitHub`へソースコードをアップロードする必要があります。

**AVAX-Subnet**全体を対象としてアップロードしましょう。

今後の開発にも役に立つと思いますので、今のうちに以下にアップロード方法をおさらいしておきます。

`GitHub`のアカウントをお持ちでない方は,[こちら](https://qiita.com/okumurakengo/items/848f7177765cf25fcde0) の手順に沿ってアカウントを作成してください。

`GitHub`へソースコードをアップロードをしたことがない方は以下を参考にしてください。

[新しいレポジトリを作成](https://docs.github.com/ja/get-started/quickstart/create-a-repo)（リポジトリ名などはご自由に）した後、
手順に従いターミナルからアップロードを済ませます。
以下ターミナルで実行するコマンドの参考です。(`AVAX-Subnet`直下で実行することを想定しております)

```
$ git init
$ git add .
$ git commit -m "first commit"
$ git branch -M main
$ git remote add origin [作成したレポジトリの SSH URL]
$ git push -u origin main
```

> ✍️: SSH の設定を行う
>
> Github のレポジトリをクローン・プッシュする際に,SSHKey を作成し,GitHub に公開鍵を登録する必要があります。
>
> SSH（Secure SHell）はネットワークを経由してマシンを遠隔操作する仕組みのことで,通信が暗号化されているのが特徴的です。
>
> 主にクライアント（ローカル）からサーバー（リモート）に接続をするときに使われます。この SSH の暗号化について,仕組みを見ていく上で重要になるのが秘密鍵と公開鍵です。
>
> まずはクライアントのマシンで秘密鍵と公開鍵を作り,公開鍵をサーバーに渡します。そしてサーバー側で「この公開鍵はこのユーザー」というように,紐付けを行っていきます。
>
> 自分で管理して必ず見せてはいけない秘密鍵と,サーバーに渡して見せても良い公開鍵の 2 つが SSH の通信では重要になってきます。
> Github における SSH の設定は,[こちら](https://docs.github.com/ja/authentication/connecting-to-github-with-ssh) を参照してください!

### 🌔 参考リンク

> [こちら](https://github.com/unchain-dev/AVAX-Subnet)に本プロジェクトの完成形のレポジトリがあります。
> 期待通り動かない場合は参考にしてみてください。

### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、`Discord`の`#avalanche`で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の三点を記載してください ✨

```
1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット
```

---

カスタムSubnetの作成が完了しました 🎉

次のレッスンではスマートコントラクトを実装していきます！
