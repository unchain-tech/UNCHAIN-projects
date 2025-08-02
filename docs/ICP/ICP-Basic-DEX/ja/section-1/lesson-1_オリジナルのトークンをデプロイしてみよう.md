### 🪙 プロジェクトで使用するオリジナルのトークンを準備しよう

このプロジェクトでは、取引に使用するオリジナルのFungible token（FT）を2種類発行します。

- Token Gold（TGLD）
- Token Silver（TSLV）

トークン規格は[DIP20](https://github.com/Psychedelic/DIP20)というものを用います。

**DIP20 とは？**

[Psychedelic](https://psychedelic.ooo/)という組織が作成したトークン標準になります。これは、ERC-20のトークン標準をICP上でも利用できるようにMotokoとRustで実装されています。

インターネット・コンピュータのLedger & Tokenizationワーキンググループによって開発されているFTの規格[ICRC-1](https://github.com/dfinity/ICRC-1/blob/main/standards/ICRC-1/README.md)も存在するのですが、現在の`ICRC-1`では、今回のプロジェクトに使用したい機能(`Approve, Transfer From`)が実装されていません。ICRC-1を拡張した次の標準[ICRC-2](https://github.com/dfinity/ICRC-1/tree/main/standards/ICRC-2)では実装予定なのですが、2023年6月現在ではまだDraft中のため使用を見送ることにします。

今回は、GithubのサブモジュールとしてDIP20をプロジェクトに組み込み、オリジナルのトークンキャニスターをデプロイしたいと思います。

それでは始めていきましょう！

### 🐈‍⬛ DIP20 のサブモジュールを取り込もう

ターミナルで`icp_basic_dex/src/`下に移動し、DIP20リポジトリをサブモジュールとして取り込みましょう。

```
cd src/
git submodule add https://github.com/Psychedelic/DIP20.git
```

src/化にDIP20が追加され、プロジェクトのルートディレクトリに`.gitmodules`ファイルが生成されたら準備完了です。

[.gitmodules](https://git-scm.com/docs/gitmodules)は、サブモジュールのプロパティを定義するファイルです。

```diff
 icp_basic_dex/
 ├── .env
 ├── .git/
 ├── .gitignore
+├── .gitmodules
 ├── README.md
 ├── dfx.json
 ├── node_modules/
 ├── package-lock.json
 ├── package.json
 ├── src/
+│   ├── DIP20/
 │   ├── declarations/
 │   ├── icp_basic_dex_backend/
 │   └── icp_basic_dex_frontend/
 └── webpack.config.js
```

### 📝 設定ファイル dfx.json を編集しよう

取り込んだDIP20を使用してトークンキャニスターをデプロイするために、設定ファイルの編集を行います。
ファイルは`dfx.json`という名前で、このファイルに記載された情報をもとにキャニスターが作成されます。

プロジェクトのルートディレクトリに存在する`dfx.json`を、以下のように編集します。
ここでは、`GoldDIP20`と`SilverDIP20`というキャニスターを追加しています。

[dfx.json]

```json
{
  "canisters": {
    "icp_basic_dex_backend": {
      "main": "src/icp_basic_dex_backend/main.mo",
      "type": "motoko"
    },
    "GoldDIP20": {
      "main": "src/DIP20/motoko/src/token.mo",
      "type": "motoko"
    },
    "SilverDIP20": {
      "main": "src/DIP20/motoko/src/token.mo",
      "type": "motoko"
    },
    "icp_basic_dex_frontend": {
      "dependencies": [
        "icp_basic_dex_backend"
      ],
      "frontend": {
        "entrypoint": "src/icp_basic_dex_frontend/src/index.html"
      },
      "source": [
        "src/icp_basic_dex_frontend/assets",
        "dist/icp_basic_dex_frontend/"
      ],
      "type": "assets"
    }
  },
  "defaults": {
    "build": {
      "args": "",
      "packtool": ""
    }
  },
  "output_env_file": ".env",
  "version": 1
}
```

`"canisters": {}`の中に、作成したいキャニスターの情報を記述します。

`"GoldDIP20":`、`"SilverDIP20:"`はキャニスターにつける名前です。キャニスターが作成される際`mlsv7-lyaaa-aaaag-aatla-cai`のような一意なIDが割り振られますが、これを扱いやすくするために名前をつけることができます。DFXを通じて開発者が実際にキャニスターとやりとりをする際に活用されます。

`"type":`はキャニスターのタイプを指定します。例えば、上記ではMotoko言語で実装されたキャニスターであるため、タイプにMotokoと指定しています。
`"main":`はキャニスターのソースコードパスを指定します。DIP20のMotokoで作成されたインタフェースを使用するため、このようなパスを指定しています。

### トークンキャニスターをデプロイしてみよう

`dfx`を使用して、ターミナルからデプロイをしてみたいと思います。

それでは、プロジェクトのルートディレクトリで以下のコマンドを実行していきましょう。最初に、環境を立ち上げます。

```
dfx start --clean --background
```

次に、デプロイをするユーザプリンシパル（識別子）を変数に登録しておきます。これは、以降のコマンドを実行しやすくするためです。

```
export ROOT_PRINCIPAL=$(dfx identity get-principal)
```

最後に、`GoldDIP20`キャニスターをデプロイしてみましょう。`dfx deploy`の後ろに、デプロイしたいキャニスターの名前を指定します。これは、`dfx.json`ファイルに記述した名前です。`--argument=`で作成するトークンの情報を初期値として渡します。

```
dfx deploy GoldDIP20 --argument='("Token Gold Logo", "Token Gold", "TGLD", 8, 10_000_000_000_000_000, principal '\"$ROOT_PRINCIPAL\"', 0)'
```

`GoldDIP20`キャニスターが生成されたことを確認するために、キャニスターとやりとりをしてみたいと思います。以下のコマンドを実行して、初期値として渡したメタデータを取得してみます。`dfx canister call`の後ろに、キャニスターの名前と実行したいメソッドを指定します。

```
dfx canister call GoldDIP20 getMetadata
```

このような出力が返されたらデプロイ成功です！

```
(
  record {
    fee = 0 : nat;
    decimals = 8 : nat8;
    owner = principal "hcctz-gzgbz-vlfb3-3ppbp-rzq45-sbk5l-eqlpo-d7ejs-eejpz-l5cva-aqe";
    logo = "Token Gold Logo";
    name = "Token Gold";
    totalSupply = 10_000_000_000_000_000 : nat;
    symbol = "TGLD";
  },
)
```

SilverDIP20も同様に、デプロイとメソッドのコールを実行してみましょう。

```
dfx deploy SilverDIP20 --argument='("Token Silver Logo", "Token Silver", "TSLV", 8, 10_000_000_000_000_000, principal '\"$ROOT_PRINCIPAL\"', 0)'
```

```
dfx canister call SilverDIP20 getMetadata
```

GoldDIP20と同様にメタデータが取得できるでしょう。

```
(
  record {
    fee = 0 : nat;
    decimals = 8 : nat8;
    owner = principal "hcctz-gzgbz-vlfb3-3ppbp-rzq45-sbk5l-eqlpo-d7ejs-eejpz-l5cva-aqe";
    logo = "Token Silver Logo";
    name = "Token Silver";
    totalSupply = 10_000_000_000_000_000 : nat;
    symbol = "TSLV";
  },
)
```

これで、トークンキャニスターの設定がきちんと行われていることを確認できました。

### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discordの`#icp`で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の4点を記載してください ✨

```
1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット
```

---

次のレッスンに進んで、Faucet機能を実装していきましょう！
