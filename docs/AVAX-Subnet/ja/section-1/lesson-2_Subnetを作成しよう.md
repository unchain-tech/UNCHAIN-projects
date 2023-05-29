### 🔥 Avalanche-CLI

このレッスンでは実際にSubnetの作成を行います。

Subnetの作成には[Avalanche CLI](https://github.com/ava-labs/avalanche-cli)というツールを使用します。

> 📓 Avalanche CLI  
> Avalancheで行うあらゆる開発に使用できるコマンドラインツールです。 ローカルネットワークのセットアップやSubnetの作成やカスタマイズなどに使用できます。  
> このツールは日々急速な開発が進められているので、変更がないか定期的にドキュメントをチェックする必要があります。  
> もし本プロジェクトに関連する範囲で変更を見つけた場合、プルリクにて教えて頂けると大変嬉しいです。  

`Avalanche CLI`をインストールするためにターミナル上（任意のディレクトリ）で、以下のコマンドを実行してください。

```
curl -sSfL https://raw.githubusercontent.com/ava-labs/avalanche-cli/main/scripts/install.sh | sh -s
```

ホームディレクトのbin(`~/bin`)内に`avalanche`という実行ファイルがインストールされているので、 
これを任意の場所で実行できるよう、以下を実行して環境変数PATHにこのディレクトリのパスを追加します。

```
export PATH=~/bin:$PATH
```

以下のように`avalanche`コマンドが使用できるはずです。

```
$ avalanche -v
avalanche version 1.0.2
```

このコマンドを今後も使用するように設定する場合、`.zshrc`などに先ほどのexport文を追記してください。

### 🛩️ Subnetの作成

それでは`Avalanche-CLI`を使用して最もシンプルなSubnetを作成していきます。  
([こちら](https://docs.avax.network/subnets/build-first-subnet)を参考にしています。)

以下のコマンドを実行してEVMベースのSubnetを作成していきます。  
`mySubnet`はSubnetの名前です。

```
avalanche subnet create mySubnet
```

実行後、対話形式で設定を求められるので1つずつ答えていきます。

**VM**

`SubnetEVM`を選択します。

**ChainId**

EVM形式のChainID（正の整数）を入力します。

ChainIDはユニークなものなので、実際にSubnetを稼働させる環境では他のチェーンと被らないようにする必要があります。  

ここでは開発環境でSubnetを作成するので自由に入力できますが、1（Ethereum）や43114（Avalanche C-Chain）などの主なchainIDは開発中に障害とならないよう避けましょう。

EVMネットワーク上のChainIDは[こちら](https://chainlist.org/)で確認できます。

ここでは`1111`と入力しました。

**Token Symbol**

作成するSubnetのネイティブトークンのシンボル名を自由に設定できます。

ここでは`TEST`と入力しました。

**Subnet-EVM Version**

`Use latest version`を選択します。

**Fees**

作成するSubnetにどのようにガス代を設定するのかを選択します。

`Low disk use    / Low Throughput    1.5 mil gas/s (C-Chain's setting)`を選択します。

**Airdrop**

`Airdrop 1 million tokens to the default address (do not use in production)`を選択します。

ネイティブトークンをデフォルトアドレスにAirdropしました。

> ⚠️ ここで使用したデフォルトアドレスとは、秘密鍵が公開された開発用のアカウントのものなので、実際のプロダクトの開発では使用しないでください。
> 
> プロダクト段階でSubnetを作成する際は`Customize your airdrop`が選択することで他のアドレスにAirdropを行います。

**Precompiles**

このセクションはSubnetをカスタムする際に使用します。

今は`No`を選択してください。

全ての設定が終了すると`Successfully created subnet configuration`を表示されます。

`avalanche subnet list --deployed`を実行すると以下のような表示がされます。

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

まだどこにもデプロイしていないため`DEPLOYED`の項目が全て`No`になっています。

### 🛫 Subnetのデプロイ

作成したSubnetをローカルネットワークにデプロイします。

以下のコマンドを実行し、その後のプロンプトで`Local Network`を選択します。

```
avalanche subnet deploy mySubnet
```

これよりローカルマシンに5つのノードによるAvalancheネットワークが構築されます。

実行後以下のような出力がされます。

![](/public/images/AVAX-Subnet/section-1/1_2_1.png)

出力の最後にある`Browser Extension connection details (any node URL from above works):`の情報を使用して、Metamaskなどのウォレットと連携することができます。

> Metamaskをお持ちでない方は [こちら](https://MetaMask.io/download.html) からブラウザの拡張機能をダウンロードし、MetaMaskウォレットをあなたのブラウザに設定してください。

> 📓 [Core](https://support.avax.network/en/collections/3391518-core)ウォレットについて  
> Ava Labs(Avalanche エコシステムの開発チーム) がサポートしている Core というウォレットが存在します。  
> Core でのウォレットを使用すると Avalanche に適した処理により、高速なトランザクションが実現する可能性があります。  
> 現在は beta 版ということもありバグや仕様変更が日々改善されているため、ここでは使用しませんが注目なウォレットです。

ブラウザ上でMetamaskを開き、アカウントタブから`アカウントのインポート`を選択しましょう。

![](/public/images/AVAX-Subnet/section-1/1_2_2.png)

こちらに先ほど出力にあった`private key:`に続く情報を入力します。

![](/public/images/AVAX-Subnet/section-1/1_2_3.png)

インポートが成功すると新たなアカウントが作成されます。

⚠️ このアカウントは秘密鍵の公開されたアカウントなので、資金を入れるなどの行為は危険です。

ここでは、他のアカウントと区別がつくようにアカウントの名前を変更します。  
3つのdotマークを選択 -> `アカウントの詳細` -> アカウントの名前を変更します。

![](/public/images/AVAX-Subnet/section-1/1_2_4.png)

![](/public/images/AVAX-Subnet/section-1/1_2_9.png)

次にネットワークの追加を行います。

ネットワークタブを開き、`ネットワークを追加`を選択します。

![](/public/images/AVAX-Subnet/section-1/1_2_5.png)

ネットワークを手動で追加します。

![](/public/images/AVAX-Subnet/section-1/1_2_6.png)

出力にあった情報を入力します。

![](/public/images/AVAX-Subnet/section-1/1_2_7.png)

ネットワークの追加が成功すると、Airdropされたネイティブトークンが表示されます。

![](/public/images/AVAX-Subnet/section-1/1_2_8.png)

以上でSubnetの作成と接続ができました 🎉

ターミナルで`avalanche subnet list --deployed`を実行すると、以下のような表示がされ、`DEPLOYED`の項目の`Local`が`Yes`に変わっています。

```
% avalanche subnet list --deployed           
+----------+----------+----------+-----------+-----------+-------+----------+---------+
|  SUBNET  |  CHAIN   | CHAIN ID |   TYPE    | FROM REPO |       | DEPLOYED |         |
+----------+----------+----------+-----------+-----------+-------+----------+---------+
|          |          |          |           |           | Local | Fuji     | Mainnet |
+----------+----------+----------+-----------+-----------+-------+----------+---------+
| mySubnet | mySubnet |     1111 | SubnetEVM | false     | Yes   | No       | No      |
+----------+----------+----------+-----------+-----------+-------+----------+---------+
```

このように`Avalanche-CLI`を使うことで、簡単にSubnetを作成することができます。

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

次のレッスンではカスタムしたSubnetの作成を行います 🎉