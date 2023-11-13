### 🤘🏽 UI の基礎を作成しよう

ではここからはフロント側を開発していきます。ただし、本レッスンはスマートコントラクトの作成がメインのものなのでコントラクトの説明と比べて説明が大まかになっていますがご了承ください。

まずは使用する画像やファイルを追加していきます。

一番上の階層(`lib`ディレクトリと同じ階層)に`assets`, `smartcontracts`というディレクトリと`.env`ファイルを追加しましょう。

追加後は下のようなディレクトリ構造になります。

```
client/
├── README.md
├── analysis_options.yaml
├── android/
├── assets/
├── build/
├── ios/
├── lib/
├── linux/
├── macos/
├── package.json
├── pubspec.lock
├── pubspec.yaml
├── smartcontracts/
├── test/
├── web/
└── windows/
```

`.env`ファイルは隠しファイルになっているので表示はされていません。このファイルはGitに上げないために.gitignoreファイルに追加しておいてください。

次にassetsディレクトリに本dappに必要な画像を追加していきます。以下の画像をassetsディレクトリにコピー&ペーストしてください。

[assets]

[MulPay_Icon_2_foreground.png]
![](/public/images/NEAR-MulPay/section-2/2_1_1.png)

[MulPay_Icon_2.png]
![](/public/images/NEAR-MulPay/section-2/2_1_2.png)

[aurora-aoa-logo.png]
![](/public/images/NEAR-MulPay/section-2/2_1_3.png)

[dai-dai-logo.png]
![](/public/images/NEAR-MulPay/section-2/2_1_4.png)

[ethereum-eth-logo.png]
![](/public/images/NEAR-MulPay/section-2/2_1_5.png)

[polygon-matic-logo.png]
![](/public/images/NEAR-MulPay/section-2/2_1_6.png)

[shib-logo.png]
![](/public/images/NEAR-MulPay/section-2/2_1_7.png)

[solana-sol-logo.png]
![](/public/images/NEAR-MulPay/section-2/2_1_8.png)

[tether-usdt-logo.png]
![](/public/images/NEAR-MulPay/section-2/2_1_9.png)

[uniswap-uni-logo.png]
![](/public/images/NEAR-MulPay/section-2/2_1_10.png)

[unchain_logo.png]
![](/public/images/NEAR-MulPay/section-2/2_1_11.png)

[multiple-coins.jpg]
![](/public/images/NEAR-MulPay/section-2/2_1_12.jpg)

[pop.svg]
![](/public/images/NEAR-MulPay/section-2/2_1_13.svg)

[pay.svg]
![](/public/images/NEAR-MulPay/section-2/2_1_14.svg)

[home.svg]
![](/public/images/NEAR-MulPay/section-2/2_1_15.svg)

[three-dots.svg]
![](/public/images/NEAR-MulPay/section-2/2_1_16.svg)

[triangle.svg]
![](/public/images/NEAR-MulPay/section-2/2_1_17.svg)

[wallet_screen_img.svg]
![](/public/images/NEAR-MulPay/section-2/2_1_18.svg)

[wallet.svg]
![](/public/images/NEAR-MulPay/section-2/2_1_19.svg)

次に`smartcontracts`ディレクトリにsection-1で作成したコントラクトのabiファイルを追加します。

MulPay-contractディレクトリの`artifacts/contracts/`にあるそれぞれのコントラクトのabiファイルをコピー&ペーストします。例えば`ERC20Tokens.sol/AuraraToken.json`などです。

少し面倒ですが、これらを用いてコントラクトとやりとりをするので必要な過程です。

smarcontractsディレクトリの中身は下のようになります。

```
smartcontracts/
├── AuroraToken.json
├── DaiToken.json
├── EthToken.json
├── PolygonToken.json
├── ShibainuToken.json
├── SolanaToken.json
├── SwapContract.json
├── TetherToken.json
└── UniswapToken.json
```

次にこれらの使用するファイルや画像があることを宣言していきます。

flutterでは`pubspec.yaml`というファイルに必要なライブラリや使用するファイルを記述します。

下のように`pubspec.yaml`ファイルの中の`dependencies:`直下を下のように書き換えましょう。

ここで注意なのが、`pubspec.yaml`ファイルではスペースが一行でもずれてしまうとライブラリが使用できなくなるのでそこに注意してください。

なのでUIを作成しているときにエラーがでた際は`pubspec.yaml`ファイルに記述しているライブラリが正しいスペースで記述されているかを確認しながら行ってください。デフォルトで記述してある通りのスペースで記述できているかを確認していきながら行っていけばOKです！

[`pubspec.yaml`]

```
dependencies:
  flutter:
    sdk: flutter

  # The following adds the Cupertino Icons font to your application.
  # Use with the CupertinoIcons class for iOS style icons.
  cupertino_icons: 1.0.6
  dropdown_button2: 1.9.4
  fluid_bottom_nav_bar: 1.3.0
  flutter_dotenv: 5.1.0
  flutter_svg: 0.22.0
  fluttertoast: 8.2.2
  google_fonts: 4.0.4
  hexcolor: 3.0.1
  http: 0.13.6
  provider: 6.0.5
  qr_code_scanner: 1.0.0
  qr_flutter: 4.1.0
  responsive_framework: 1.1.1
  url_launcher: 6.2.1
  walletconnect_flutter_v2: 2.1.8
  web_socket_channel: 2.4.0
  web3dart: 2.6.1
```

次に使用する画像やファイルの宣言、アイコンを変更するための記述をしていきます。先ほどの記述の下に書いてあるものを以下のように書き換えましょう。

[`pubspec.yaml`]

```yaml
dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_launcher_icons: ^0.10.0

flutter_icons:
  android: true
  ios: true
  image_path: "assets/MulPay_Icon_2.png"
  adaptive_icon_background: "#ffffff"
  adaptive_icon_foreground: "assets/MulPay_Icon_2_foreground.png"
  # The "flutter_lints" package below contains a set of recommended lints to
  # encourage good coding practices. The lint set provided by the package is
  # activated in the `analysis_options.yaml` file located at the root of your
  # package. See that file for information about deactivating specific lint
  # rules and activating additional ones.
  flutter_lints: ^2.0.0

flutter:
  # The following line ensures that the Material Icons font is
  # included with your application, so that you can use the icons in
  # the material Icons class.
  uses-material-design: true

  # To add assets to your application, add an assets section, like this:
  assets:
    - assets/
    - .env
    - smartcontracts/
```

スペースについては下のようになっていればOKです。
![](/public/images/NEAR-MulPay/section-2/2_1_20.png)
![](/public/images/NEAR-MulPay/section-2/2_1_21.png)

その後、`client`ディレクトリに移動して下のコマンドをターミナルで実行しましょう。

```
flutter pub get
flutter pub run flutter_launcher_icons:main
```

最後に下のメッセージが表示されていれば成功です！

```
✓ Successfully generated launcher icons
```

これで画像やファイルの宣言、アイコンを変更のための記述は完了しました！

ではここからはいよいよUIを作成していきます。

まずはdeployしたコントラクトのアドレスやそのコントラクトの名前を.envファイルに追加していきましょう。

[`.env`]

```
SWAP_CONTRACT_ADDRESS = "0xC678d76a12Dd7f87FF1f952B6bEEd2c0fd308CF8"
AOA_CONTRACT_ADDRESS = "0x10E9C13e9f73A35d4a0C8AA8328b84EF9747b7a8"
DAI_CONTRACT_ADDRESS = "0x48a6b4beAeB3a959Cd358e3365fc9d178eB0B2D9"
ETH_CONTRACT_ADDRESS = "0x395A1065eA907Ab366807d68bbe21Df83169bA6c"
MATIC_CONTRACT_ADDRESS = "0x4A8c0C9f9f2444197cE78b672F0D98D1Fe47bdA6"
SHIB_CONTRACT_ADDRESS = "0xa11e679EE578B32d12Dbe2882FcC387A86C8f887"
SOL_CONTRACT_ADDRESS = "0x30E198301969fDeddDCb84cE2C284dF58d4AB944"
UNI_CONTRACT_ADDRESS = "0xC73F7cBD464aC7163D03dE669dedc3d1fA6Af5E4"
USDT_CONTRACT_ADDRESS = "0x44734B834364c37d35e6E4253779e9459c93B5F4"

SWAP_CONTRACT_NAME = "SwapContract"
AOA_CONTRACT_NAME = "AuroraToken"
DAI_CONTRACT_NAME = "DaiToken"
ETH_CONTRACT_NAME = "EthToken"
MATIC_CONTRACT_NAME = "PolygonToken"
SHIB_CONTRACT_NAME = "ShibainuToken"
SOL_CONTRACT_NAME = "SolanaToken"
UNI_CONTRACT_NAME = "UniswapToken"
USDT_CONTRACT_NAME = "TetherToken"

AURORA_TESTNET_INFURA_KEY = "Infura's aurora testnet http key"

WALLETCONNECT_PROJECT_ID = "WalletConnect's project id"
```

`XXX_CONTRACT_ADDRESS`にはsection-1のlesson-2で行ったdeployから返ってきたそれぞれのアドレスを入れます。

`AURORA_TESTNET_INFURA_KEY`にはsection-0のlesson-2で行った環境構築時に作成したinfuraアカウントの、aurora testnet用のhttp keyを入れます。下のような形式になっているものです。

```
INFURA_KEY_TEST = "https://aurora-testnet.infura.io/v3/4b5...."
```

`WALLETCONNECT_PROJECT_ID`には同じくsection-0のlesson-2で作成したWalletConnectのproject idを入れます。

ではいよいよ基礎となるmodelやウィジェットを作成していきたいところですが、その前にホーム画面などのそれぞれの画面を簡単に作っておきます。

最終的には画面遷移を想定して作るので、その遷移先がなければエラーが出てしまい動かないという事態が起きかねないので簡単な画面を作っておきます。

`lib/view/screens/`にあるファイルにそれぞれ以下のようにコードを記述しておきましょう。

[`home.dart`]

```dart
import 'package:flutter/material.dart';

class Home extends StatefulWidget {
  const Home({Key? key}) : super(key: key);

  @override
  State<Home> createState() => _HomeState();
}

class _HomeState extends State<Home> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Home Screen")),
    );
  }
}

```

[`qr_code_scan.dart`]

```dart
import 'package:flutter/material.dart';

class QRCodeScan extends StatefulWidget {
  const QRCodeScan({Key? key}) : super(key: key);

  @override
  State<QRCodeScan> createState() => _HomeState();
}

class _HomeState extends State<QRCodeScan> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("QRCodeScan Screen")),
    );
  }
}
```

[`send.dart`]

```dart
import 'package:flutter/material.dart';

class Send extends StatefulWidget {
  const Send({Key? key}) : super(key: key);

  @override
  State<Send> createState() => _HomeState();
}

class _HomeState extends State<Send> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Send Screen")),
    );
  }
}
```

[`signin.dart`]

```dart
import 'package:flutter/material.dart';

class SignIn extends StatefulWidget {
  const SignIn({Key? key}) : super(key: key);

  @override
  State<SignIn> createState() => _HomeState();
}

class _HomeState extends State<SignIn> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("SignIn Screen")),
    );
  }
}
```

[`wallet.dart`]

```dart
import 'package:flutter/material.dart';

class Wallet extends StatefulWidget {
  const Wallet({Key? key}) : super(key: key);

  @override
  State<Wallet> createState() => _HomeState();
}

class _HomeState extends State<Wallet> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Wallet Screen")),
    );
  }
}
```

ではmodelやウィジェットを作成していきましょう。

`lib/model/contract_model.dart`に移動して以下のコードを追加しましょう。

[`contract_model.dart`]

```dart
import 'dart:convert';
import 'dart:core';
import 'dart:math';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:http/http.dart';
import 'package:url_launcher/url_launcher_string.dart';
import 'package:walletconnect_flutter_v2/walletconnect_flutter_v2.dart';
import 'package:web3dart/crypto.dart';
import 'package:web3dart/web3dart.dart';

class ContractModel extends ChangeNotifier {
  List<Token> tokenList = [
    Token(
      address: dotenv.env["AOA_CONTRACT_ADDRESS"]!,
      contractName: dotenv.env["AOA_CONTRACT_NAME"]!,
      name: "Aurora",
      symbol: "AOA",
      imagePath: "assets/aurora-aoa-logo.png",
    ),
    Token(
        address: dotenv.env["DAI_CONTRACT_ADDRESS"]!,
        contractName: dotenv.env["DAI_CONTRACT_NAME"]!,
        name: "Dai",
        symbol: "DAI",
        imagePath: "assets/dai-dai-logo.png"),
    Token(
        address: dotenv.env["ETH_CONTRACT_ADDRESS"]!,
        contractName: dotenv.env["ETH_CONTRACT_NAME"]!,
        name: "Ethereum",
        symbol: "ETH",
        imagePath: "assets/ethereum-eth-logo.png"),
    Token(
        address: dotenv.env["MATIC_CONTRACT_ADDRESS"]!,
        contractName: dotenv.env["MATIC_CONTRACT_NAME"]!,
        name: "Polygon",
        symbol: "MATIC",
        imagePath: "assets/polygon-matic-logo.png"),
    Token(
        address: dotenv.env["SHIB_CONTRACT_ADDRESS"]!,
        contractName: dotenv.env["SHIB_CONTRACT_NAME"]!,
        name: "Shibainu",
        symbol: "SHIB",
        imagePath: "assets/shib-logo.png"),
    Token(
        address: dotenv.env["SOL_CONTRACT_ADDRESS"]!,
        contractName: dotenv.env["SOL_CONTRACT_NAME"]!,
        name: "Solana",
        symbol: "SOL",
        imagePath: "assets/solana-sol-logo.png"),
    Token(
        address: dotenv.env["UNI_CONTRACT_ADDRESS"]!,
        contractName: dotenv.env["UNI_CONTRACT_NAME"]!,
        name: "Uniswap",
        symbol: "UNI",
        imagePath: "assets/uniswap-uni-logo.png"),
    Token(
        address: dotenv.env["USDT_CONTRACT_ADDRESS"]!,
        contractName: dotenv.env["USDT_CONTRACT_NAME"]!,
        name: "Tether",
        symbol: "USDT",
        imagePath: "assets/tether-usdt-logo.png"),
  ];

  final SWAP_CONTRACT_ADDRESS = dotenv.env["SWAP_CONTRACT_ADDRESS"];
  final SWAP_CONTRACT_NAME = dotenv.env["SWAP_CONTRACT_NAME"];

  String? _deepLinkUrl;
  String? _account;
  Web3App? _wcClient;
  SessionData? _sessionData;

  late Web3Client auroraClient;
  int ethBalance = 0;

  DeployedContract? _contract;

  ContractModel() {
    init();
  }

  Future<void> init() async {
    var httpClient = Client();

    auroraClient =
        Web3Client(dotenv.env["AURORA_TESTNET_INFURA_KEY"]!, httpClient);
  }

  getAccount() {
    return _account;
  }

  Future<DeployedContract> getContract(
      String contractName, String contractAddress) async {
    String abi =
        await rootBundle.loadString('smartcontracts/$contractName.json');
    DeployedContract contract = DeployedContract(
      ContractAbi.fromJson(jsonEncode(jsonDecode(abi)["abi"]), contractName),
      EthereumAddress.fromHex(contractAddress),
    );
    return contract;
  }

  // This is called for read-only function of contract
  Future<List<dynamic>> query(String contractName, String contractAddress,
      String functionName, List<dynamic> args) async {
    DeployedContract contract =
        await getContract(contractName, contractAddress);
    ContractFunction function = contract.function(functionName);
    List<dynamic> result = await auroraClient.call(
      contract: contract,
      function: function,
      params: args,
    );
    return result;
  }

  Future<EthereumTransaction> generateTransaction(
      String contractName,
      String contractAddress,
      String functionName,
      List<dynamic> parameters) async {
    _contract = await getContract(contractName, contractAddress);

    ContractFunction function = _contract!.function(functionName);

    // web3dartを使用して、トランザクションを作成します。
    final Transaction transaction = Transaction.callContract(
        contract: _contract!, function: function, parameters: parameters);

    // walletconnect_flutter_v2を使用して、Ethereumトランザクションを作成します。
    final EthereumTransaction ethereumTransaction = EthereumTransaction(
      from: _account!,
      to: contractAddress,
      value: '0x${transaction.value?.getInWei.toRadixString(16) ?? '0'}',
      data: transaction.data != null ? bytesToHex(transaction.data!) : null,
    );

    return ethereumTransaction;
  }

  Future<String> sendTransaction(EthereumTransaction transaction) async {
    // Metamaskアプリケーションを起動します。
    await launchUrlString(_deepLinkUrl!, mode: LaunchMode.externalApplication);

    // 署名をリクエストします。
    final String signResponse = await _wcClient?.request(
      topic: _sessionData?.topic ?? "",
      chainId: 'eip155:1313161555',
      request: SessionRequestParams(
        method: 'eth_sendTransaction',
        params: [transaction.toJson()],
      ),
    );

    return signResponse;
  }

  Future<void> setConnection(
      String deepLinkUrl, Web3App wcClient, SessionData sessionData) async {
    _deepLinkUrl = deepLinkUrl;
    _wcClient = wcClient;
    _sessionData = sessionData;
    // セッションを認証したアカウントを取得します。
    _account = NamespaceUtils.getAccount(
        sessionData.namespaces.values.first.accounts.first);

    notifyListeners();
  }

  Future<String> getBalance(
      String tokenContractName, String tokenAddress) async {
    List<dynamic> result = await query(tokenContractName, tokenAddress,
        'balanceOf', [EthereumAddress.fromHex(_account!)]);
    return result[0].toString();
  }

  Future<String> getEthBalance(String tokenContractName) async {
    List<dynamic> result = await query(
        SWAP_CONTRACT_NAME!, SWAP_CONTRACT_ADDRESS!, 'calculateValue', [
      EthereumAddress.fromHex(dotenv.env["ETH_CONTRACT_ADDRESS"]!),
      EthereumAddress.fromHex(tokenContractName)
    ]);
    return result[0].toString();
  }

  Future<bool> getTokensInfo() async {
    for (int i = 0; i < tokenList.length; i++) {
      final balance =
          await getBalance(tokenList[i].contractName, tokenList[i].address);
      final ethValue = await getEthBalance(tokenList[i].address);
      final ethBalance =
          ((double.parse(ethValue) * double.parse(balance) / (pow(10, 18)))
                  .ceil())
              .toString();
      tokenList[i]
        ..balance = balance
        ..ethBalance = ethBalance;
    }
    return true;
  }

  Future<void> sendToken(String sendTokenContractName, String sendTokenAddress,
      String receiveTokenAddress, String recipientAddress, int amount) async {
    try {
      // トークンの送信を承認します。
      final EthereumTransaction ethereumTransactionOfApprove =
          await generateTransaction(
              sendTokenContractName, sendTokenAddress, "approve", [
        EthereumAddress.fromHex(dotenv.env['SWAP_CONTRACT_ADDRESS']!),
        BigInt.from(amount),
      ]);

      final String signResponseOfApprove =
          await sendTransaction(ethereumTransactionOfApprove);
      debugPrint('=== signResponseOfApprove: $signResponseOfApprove');

      final EthereumTransaction ethereumTransactionOfSwap =
          await generateTransaction(
        dotenv.env['SWAP_CONTRACT_NAME']!,
        dotenv.env['SWAP_CONTRACT_ADDRESS']!,
        "swap",
        [
          // measureToken is got rid of
          EthereumAddress.fromHex(sendTokenAddress),
          EthereumAddress.fromHex(sendTokenAddress),
          EthereumAddress.fromHex(receiveTokenAddress),
          BigInt.from(amount),
          EthereumAddress.fromHex(recipientAddress),
        ],
      );

      final String signResponseOfSwap =
          await sendTransaction(ethereumTransactionOfSwap);
      debugPrint('=== signResponseOfSwap: $signResponseOfSwap');
    } catch (error) {
      rethrow;
    } finally {
      notifyListeners();
    }
  }

  Future<void> distributeToken(String tokenAddress) async {
    try {
      final EthereumTransaction ethereumTransaction = await generateTransaction(
        dotenv.env["SWAP_CONTRACT_NAME"]!,
        dotenv.env["SWAP_CONTRACT_ADDRESS"]!,
        "distributeToken",
        [
          EthereumAddress.fromHex(tokenAddress),
          BigInt.from(100),
          EthereumAddress.fromHex(_account!),
        ],
      );

      final String signResponse = await sendTransaction(ethereumTransaction);
      debugPrint('=== signResponse: $signResponse');
    } catch (error) {
      rethrow;
    } finally {
      notifyListeners();
    }
  }

  Future<double> getTotalBalance() async {
    double total = 0;
    for (int i = 0; i < tokenList.length; i++) {
      var balance =
          await getBalance(tokenList[i].contractName, tokenList[i].address);
      var ethValue = await getEthBalance(tokenList[i].address);
      var ethBalance =
          ((double.parse(ethValue) * double.parse(balance) / (pow(10, 18)))
                  .ceil())
              .toString();
      total += double.parse(ethBalance);
    }
    return total;
  }
}

class Token {
  final String address;
  final String contractName;
  final String name;
  final String symbol;
  final String imagePath;
  String? balance;
  String? ethBalance;

  Token({
    required this.address,
    required this.contractName,
    required this.name,
    required this.symbol,
    required this.imagePath,
  }) {
    this.balance = "0";
    this.ethBalance = "0";
  }
}

// Ethereumトランザクションを作成するためのモデルクラス
class EthereumTransaction {
  const EthereumTransaction({
    required this.from,
    required this.to,
    required this.value,
    this.data,
  });

  final String from;
  final String to;
  final String value;
  final String? data;

  Map<String, dynamic> toJson() => {
        'from': from,
        'to': to,
        'value': value,
        'data': data,
      };
}

```

最初の`import`の部分で必要なライブラリを宣言しています。

```dart
import 'dart:convert';
import 'dart:core';
import 'dart:math';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:http/http.dart';
import 'package:url_launcher/url_launcher_string.dart';
import 'package:web3_connect/web3_connect.dart';
import 'package:web3dart/web3dart.dart';
import 'package:web_socket_channel/io.dart';
import 'package:http/http.dart' as http;
```

次の`ContractModel`の中に必要なプロパティやメソッドを入れています。

序盤ではそれぞれのTokenについてアドレスやコントラクトの名前などをリスト化したものやAurora上のコントラクトとやり取りするためのプロパティを宣言しています。

```dart
class ContractModel extends ChangeNotifier {
  List<Token> tokenList = [
    Token(
      address: dotenv.env["AOA_CONTRACT_ADDRESS"]!,
      contractName: dotenv.env["AOA_CONTRACT_NAME"]!,
      name: "Aurora",
      symbol: "AOA",
      imagePath: "assets/aurora-aoa-logo.png",
    ),
    Token(
        address: dotenv.env["DAI_CONTRACT_ADDRESS"]!,
        contractName: dotenv.env["DAI_CONTRACT_NAME"]!,
        name: "Dai",
        symbol: "DAI",
        imagePath: "assets/dai-dai-logo.png"),
    Token(
        address: dotenv.env["ETH_CONTRACT_ADDRESS"]!,
        contractName: dotenv.env["ETH_CONTRACT_NAME"]!,
        name: "Ethereum",
        symbol: "ETH",
        imagePath: "assets/ethereum-eth-logo.png"),
    Token(
        address: dotenv.env["MATIC_CONTRACT_ADDRESS"]!,
        contractName: dotenv.env["MATIC_CONTRACT_NAME"]!,
        name: "Polygon",
        symbol: "MATIC",
        imagePath: "assets/polygon-matic-logo.png"),
    Token(
        address: dotenv.env["SHIB_CONTRACT_ADDRESS"]!,
        contractName: dotenv.env["SHIB_CONTRACT_NAME"]!,
        name: "Shibainu",
        symbol: "SHIB",
        imagePath: "assets/shib-logo.png"),
    Token(
        address: dotenv.env["SOL_CONTRACT_ADDRESS"]!,
        contractName: dotenv.env["SOL_CONTRACT_NAME"]!,
        name: "Solana",
        symbol: "SOL",
        imagePath: "assets/solana-sol-logo.png"),
    Token(
        address: dotenv.env["UNI_CONTRACT_ADDRESS"]!,
        contractName: dotenv.env["UNI_CONTRACT_NAME"]!,
        name: "Uniswap",
        symbol: "UNI",
        imagePath: "assets/uniswap-uni-logo.png"),
    Token(
        address: dotenv.env["USDT_CONTRACT_ADDRESS"]!,
        contractName: dotenv.env["USDT_CONTRACT_NAME"]!,
        name: "Tether",
        symbol: "USDT",
        imagePath: "assets/tether-usdt-logo.png"),
  ];

  final SWAP_CONTRACT_ADDRESS = dotenv.env["SWAP_CONTRACT_ADDRESS"];
  final SWAP_CONTRACT_NAME = dotenv.env["SWAP_CONTRACT_NAME"];

  String? _deepLinkUrl;
  String? _account;
  Web3App? _wcClient;
  SessionData? _sessionData;

  late Web3Client auroraClient;
  int ethBalance = 0;

  DeployedContract? _contract;
```

後半の部分ではコントラクトにあるメソッドを呼び出すためのメソッドが書かれています。

最初に書いている`init`関数はこのコントラクトが作成された時に最初に走るメソッドで、infuraを通じてAuroraのTestnet上にデプロイしたコントラクトとやりとりができるための準備をしています。

```dart
ContractModel() {
    init();
  }

  Future<void> init() async {
    var httpClient = Client();

    auroraClient =
        Web3Client(dotenv.env["AURORA_TESTNET_INFURA_KEY"]!, httpClient);
  }
```

そして`getContract`メソッドはそれぞれのコントラクトの情報を取得して、メソッドを呼ぶためのものです。

```dart
Future<DeployedContract> getContract(
    String contractName, String contractAddress) async {
  String abi =
      await rootBundle.loadString('smartcontracts/$contractName.json');
  DeployedContract contract = DeployedContract(
    ContractAbi.fromJson(jsonEncode(jsonDecode(abi)["abi"]), contractName),
    EthereumAddress.fromHex(contractAddress),
  );
  return contract;
}
```

`query`関数は読み取り専用の関数を呼ぶ際に使うものです。これはwalletとのやり取りをする必要（walletの許可を必要）がない関数に使われるものです。この関数ではブロックチェーン状の値を書き換えたり、追加したりすることはできせん。

```dart
Future<List<dynamic>> query(String contractName, String contractAddress,
    String functionName, List<dynamic> args) async {
  DeployedContract contract =
      await getContract(contractName, contractAddress);
  ContractFunction function = contract.function(functionName);
  List<dynamic> result = await auroraClient.call(
    contract: contract,
    function: function,
    params: args,
  );
  return result;
}
```

`generateTransaction`関数は、その次に定義されている`sendTransaction`関数で使用するトランザクションを作成します。`sendTransaction`関数はブロックチェーン上の値を書き換えるような関数を呼び出すことができます。ただし、毎回walletの許可が必要となります。

```dart
Future<EthereumTransaction> generateTransaction(
    String contractName,
    String contractAddress,
    String functionName,
    List<dynamic> parameters) async {
  _contract = await getContract(contractName, contractAddress);

  ContractFunction function = _contract!.function(functionName);

  // web3dartを使用して、トランザクションを作成します。
  final Transaction transaction = Transaction.callContract(
      contract: _contract!, function: function, parameters: parameters);

  // walletconnect_flutter_v2を使用して、Ethereumトランザクションを作成します。
  final EthereumTransaction ethereumTransaction = EthereumTransaction(
    from: _account!,
    to: contractAddress,
    value: '0x${transaction.value?.getInWei.toRadixString(16) ?? '0'}',
    data: transaction.data != null ? bytesToHex(transaction.data!) : null,
  );

  return ethereumTransaction;
}

Future<String> sendTransaction(EthereumTransaction transaction) async {
  // Metamaskアプリケーションを起動します。
  await launchUrlString(_deepLinkUrl!, mode: LaunchMode.externalApplication);

  // 署名をリクエストします。
  final String signResponse = await _wcClient?.request(
    topic: _sessionData?.topic ?? "",
    chainId: 'eip155:1313161555',
    request: SessionRequestParams(
      method: 'eth_sendTransaction',
      params: [transaction.toJson()],
    ),
  );

  return signResponse;
}
```

`setConnection`関数はwalletと接続した情報をインスタンス化したこのmodelに保存するための関数です。

```dart
Future<void> setConnection(
    String deepLinkUrl, Web3App wcClient, SessionData sessionData) async {
  _deepLinkUrl = deepLinkUrl;
  _wcClient = wcClient;
  _sessionData = sessionData;
  // セッションを認証したアカウントを取得します。
  _account = NamespaceUtils.getAccount(
      sessionData.namespaces.values.first.accounts.first);

  notifyListeners();
}
```

それ以降はコントラクトに存在する関数を呼び出すもので、指定のトークンの残高を参照したり、swapを行うなどsection-1で作成した関数を呼び出すことができます。

```dart
Future<String> getBalance(
    String tokenContractName, String tokenAddress) async {
  List<dynamic> result = await query(tokenContractName, tokenAddress,
      'balanceOf', [EthereumAddress.fromHex(_account!)]);
  return result[0].toString();
}

Future<String> getEthBalance(String tokenContractName) async {
  List<dynamic> result = await query(
      SWAP_CONTRACT_NAME!, SWAP_CONTRACT_ADDRESS!, 'calculateValue', [
    EthereumAddress.fromHex(dotenv.env["ETH_CONTRACT_ADDRESS"]!),
    EthereumAddress.fromHex(tokenContractName)
  ]);
  return result[0].toString();
}

Future<bool> getTokensInfo() async {
  for (int i = 0; i < tokenList.length; i++) {
    final balance =
        await getBalance(tokenList[i].contractName, tokenList[i].address);
    final ethValue = await getEthBalance(tokenList[i].address);
    final ethBalance =
        ((double.parse(ethValue) * double.parse(balance) / (pow(10, 18)))
                .ceil())
            .toString();
    tokenList[i]
      ..balance = balance
      ..ethBalance = ethBalance;
  }
  return true;
}

Future<void> sendToken(String sendTokenContractName, String sendTokenAddress,
    String receiveTokenAddress, String recipientAddress, int amount) async {
  try {
    // トークンの送信を承認します。
    final EthereumTransaction ethereumTransactionOfApprove =
        await generateTransaction(
            sendTokenContractName, sendTokenAddress, "approve", [
      EthereumAddress.fromHex(dotenv.env['SWAP_CONTRACT_ADDRESS']!),
      BigInt.from(amount),
    ]);

    final String signResponseOfApprove =
        await sendTransaction(ethereumTransactionOfApprove);
    debugPrint('=== signResponseOfApprove: $signResponseOfApprove');

    final EthereumTransaction ethereumTransactionOfSwap =
        await generateTransaction(
      dotenv.env['SWAP_CONTRACT_NAME']!,
      dotenv.env['SWAP_CONTRACT_ADDRESS']!,
      "swap",
      [
        // measureToken is got rid of
        EthereumAddress.fromHex(sendTokenAddress),
        EthereumAddress.fromHex(sendTokenAddress),
        EthereumAddress.fromHex(receiveTokenAddress),
        BigInt.from(amount),
        EthereumAddress.fromHex(recipientAddress),
      ],
    );

    final String signResponseOfSwap =
        await sendTransaction(ethereumTransactionOfSwap);
    debugPrint('=== signResponseOfSwap: $signResponseOfSwap');
  } catch (error) {
    rethrow;
  } finally {
    notifyListeners();
  }
}

Future<void> distributeToken(String tokenAddress) async {
  try {
    final EthereumTransaction ethereumTransaction = await generateTransaction(
      dotenv.env["SWAP_CONTRACT_NAME"]!,
      dotenv.env["SWAP_CONTRACT_ADDRESS"]!,
      "distributeToken",
      [
        EthereumAddress.fromHex(tokenAddress),
        BigInt.from(100),
        EthereumAddress.fromHex(_account!),
      ],
    );

    final String signResponse = await sendTransaction(ethereumTransaction);
    debugPrint('=== signResponse: $signResponse');
  } catch (error) {
    rethrow;
  } finally {
    notifyListeners();
  }
}

Future<double> getTotalBalance() async {
  double total = 0;
  for (int i = 0; i < tokenList.length; i++) {
    var balance =
        await getBalance(tokenList[i].contractName, tokenList[i].address);
    var ethValue = await getEthBalance(tokenList[i].address);
    var ethBalance =
        ((double.parse(ethValue) * double.parse(balance) / (pow(10, 18)))
                .ceil())
            .toString();
    total += double.parse(ethBalance);
  }
  return total;
}
```

一番下にはclassを定義しています。`Token`というクラスはトークンの情報を保存するためのclassになります。`EthereumTransaction`というクラスは、walletconnect_flutter_v2を使用してEthereumトランザクションを作成するためのclassになります。

```dart
class Token {
  final String address;
  final String contractName;
  final String name;
  final String symbol;
  final String imagePath;
  String? balance;
  String? ethBalance;

  Token({
    required this.address,
    required this.contractName,
    required this.name,
    required this.symbol,
    required this.imagePath,
  }) {
    this.balance = "0";
    this.ethBalance = "0";
  }
}

// Ethereumトランザクションを作成するためのモデルクラス
class EthereumTransaction {
  const EthereumTransaction({
    required this.from,
    required this.to,
    required this.value,
    this.data,
  });

  final String from;
  final String to;
  final String value;
  final String? data;

  Map<String, dynamic> toJson() => {
        'from': from,
        'to': to,
        'value': value,
        'data': data,
      };
}s
```

では次にhome画面に表示する、それぞれのコインの残高情報を示すリスト一つ一つの元となるUIを作成していきます。

![](/public/images/NEAR-MulPay/section-2/2_1_22.png)

`lib/view/widgets/coin.dart`に移動して下のコードを追加していきましょう。

[`coin.dart`]

```dart
import 'package:flutter/material.dart';
import 'package:hexcolor/hexcolor.dart';

Widget Coins(double displayWidth, displayHeight, String imagePath, symbol, name,
    depo, value, bool isDeskTop) {
  return Container(
    height: displayHeight * 0.08,
    width: displayWidth,
    padding: const EdgeInsets.symmetric(horizontal: 10),
    margin: EdgeInsets.symmetric(vertical: displayHeight * 0.008),
    decoration: BoxDecoration(
      borderRadius: const BorderRadius.all(
        Radius.circular(20),
      ),
      color: HexColor('#054C74'),
    ),
    child: Row(
      children: [
        Row(
          children: [
            SizedBox(
              height: isDeskTop ? 55 : 37,
              width: isDeskTop ? 55 : 37,
              child: Image.asset(imagePath),
            ),
            const SizedBox(
              width: 13,
            ),
            Column(
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  symbol,
                  style: TextStyle(
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                    fontSize: isDeskTop ? 20 : 14,
                  ),
                ),
                Text(
                  name,
                  style: TextStyle(
                    fontWeight: FontWeight.bold,
                    color: Colors.grey,
                    fontSize: isDeskTop ? 17 : 12,
                  ),
                ),
              ],
            ),
          ],
        ),
        const Expanded(
          child: SizedBox(),
        ),
        SizedBox(
          width: displayWidth * 0.18,
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                '$depo $symbol',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: isDeskTop ? 20 : 13,
                ),
              ),
              Text(
                '$value ETH',
                style: TextStyle(
                  fontWeight: FontWeight.bold,
                  color: Colors.white,
                  fontSize: isDeskTop ? 18 : 12,
                ),
              ),
            ],
          ),
        ),
      ],
    ),
  );
}
```

これでそれぞれのトークンについて、ロゴや名前、残高とETH換算した時の価値を表示できるようになりました！

最初の環境構築で、エミュレータとwebのどちらのでも動作すると説明しましたね。flutterでは動作はするのですがそれをUIにも反映させる必要があります。

そこで引数として受け取っている`isDeskTop`で、このアプリが使用されているデバイスの画面がデスクトップの画面なのか、モバイルの画面なのかをこちらのコードで判定しています。

この値をもとに例えばしたのようにトークンのロゴの大きさが変わるようにしています。

```dart
SizedBox(
              height: isDeskTop ? 55 : 37,
              width: isDeskTop ? 55 : 37,
              child: Image.asset(imagePath),
            ),
```

この`isDesktop`は次のセクションの`main.dart`で記述されている部分で値を取得して、様々な画面で使用することとなります。

次に下に置くナビゲーションバーの実装を行なっていきましょう。

今回は動きのあるものを作成していこうと思うので`fluid_bottom_nav_bar`というライブラリを使用しています。

では`lib/view/widgets/navbar.dart`へ移動して下のコードを追加しましょう。

[`navbar.dart`]

```dart
import 'package:fluid_bottom_nav_bar/fluid_bottom_nav_bar.dart';
import 'package:flutter/material.dart';
import 'package:hexcolor/hexcolor.dart';
import 'package:provider/provider.dart';

import '/view/screens/home.dart';
import '/view/screens/send.dart';
import '/view/screens/wallet.dart';

class BottomNavigationBarProvider with ChangeNotifier {
  int _currentIndex = 0;

  int get currentIndex => _currentIndex;

  set currentIndex(int index) {
    _currentIndex = index;
    notifyListeners();
  }
}

class BottomNavigationBarWidget extends StatefulWidget {
  const BottomNavigationBarWidget({Key? key}) : super(key: key);

  @override
  State<BottomNavigationBarWidget> createState() => _BottomNavigationBarState();
}

class _BottomNavigationBarState extends State<BottomNavigationBarWidget> {
  var currentTab = [
    const Home(),
    const Send(),
    const Wallet(),
  ];

  @override
  Widget build(BuildContext context) {
    var provider = Provider.of<BottomNavigationBarProvider>(context);
    return Scaffold(
      body: currentTab[provider.currentIndex],
      bottomNavigationBar: FluidNavBar(
        icons: [
          FluidNavBarIcon(
            svgPath: "assets/home.svg",
            extras: {"label": "home"},
            backgroundColor:
                provider.currentIndex == 0 ? HexColor("#0C9DB0") : Colors.black,
          ),
          FluidNavBarIcon(
            svgPath: "assets/pay.svg",
            extras: {"label": "send"},
            backgroundColor:
                provider.currentIndex == 1 ? HexColor("#0C9DB0") : Colors.black,
          ),
          FluidNavBarIcon(
            svgPath: "assets/wallet.svg",
            extras: {"label": "wallet"},
            backgroundColor:
                provider.currentIndex == 2 ? HexColor("#0C9DB0") : Colors.black,
          )
        ],
        onChange: (index) => {
          provider.currentIndex = index,
        },
        style: const FluidNavBarStyle(
          iconUnselectedForegroundColor: Colors.grey,
          iconSelectedForegroundColor: Colors.white,
          barBackgroundColor: Colors.black,
        ),
        scaleFactor: 5,
        defaultIndex: 0,
        itemBuilder: (icon, item) => Semantics(
          label: icon.extras!["label"],
          child: item,
        ),
        animationFactor: 0.7,
      ),
    );
  }
}

```

最初の部分ではナビゲーションバーで使用するクラスを宣言しています。このクラスによって今どこのメニューを選択しているのかを管理します。

```dart
class BottomNavigationBarProvider with ChangeNotifier {
  int _currentIndex = 0;

  int get currentIndex => _currentIndex;

  set currentIndex(int index) {
    _currentIndex = index;
    notifyListeners();
  }
}
```

次の部分で実際に下に置かれるナビゲーションバーのUIを記述しています。

```dart
class _BottomNavigationBarState extends State<BottomNavigationBarWidget> {
  var currentTab = [
    const Home(),
    const Send(),
    const Wallet(),
  ];

  @override
  Widget build(BuildContext context) {
    var provider = Provider.of<BottomNavigationBarProvider>(context);
    return Scaffold(
      body: currentTab[provider.currentIndex],
      bottomNavigationBar: FluidNavBar(
        icons: [
          FluidNavBarIcon(
            svgPath: "assets/home.svg",
            extras: {"label": "home"},
            backgroundColor:
                provider.currentIndex == 0 ? HexColor("#0C9DB0") : Colors.black,
          ),
          FluidNavBarIcon(
            svgPath: "assets/pay.svg",
            extras: {"label": "send"},
            backgroundColor:
                provider.currentIndex == 1 ? HexColor("#0C9DB0") : Colors.black,
          ),
          FluidNavBarIcon(
            svgPath: "assets/wallet.svg",
            extras: {"label": "wallet"},
            backgroundColor:
                provider.currentIndex == 2 ? HexColor("#0C9DB0") : Colors.black,
          )
        ],
        onChange: (index) => {
          provider.currentIndex = index,
        },
        style: const FluidNavBarStyle(
          iconUnselectedForegroundColor: Colors.grey,
          iconSelectedForegroundColor: Colors.white,
          barBackgroundColor: Colors.black,
        ),
        scaleFactor: 5,
        defaultIndex: 0,
        itemBuilder: (icon, item) => Semantics(
          label: icon.extras!["label"],
          child: item,
        ),
        animationFactor: 0.7,
      ),
    );
  }
}

```

今回は`home, send, wallet`の3つのメニューを用意しています。それぞれのメニューには下のような機能を備えています。

`home`: ユーザーのアドレスと、ウォレットアドレスをQRコードで表示できる。残高を参照できる

`send`:送金先、送金するトークンとその額、受け取るトークンの種類を選択して送金できる。送金先はQRコードから取得可能。

`wallet`:ユーザーのウォレットアドレスの参照、QRコードでの参照が可能。また、それぞれのトークンを100wei獲得できるボタンがある。ウォレットをdisconnectすることもできる。

次にユーザーのウォレットアドレスをQRコード化して表示するためのウィジェットを実装していきましょう。

`lib/view/widgets/qr_code.dart`に以下のコードを記述しましょう。

[`qr_code.dart`]

```dart
import 'package:flutter/material.dart';

class QRCode extends StatefulWidget {
  const QRCode({Key? key, this.qrImage}) : super(key: key);
  final qrImage;
  @override
  State<QRCode> createState() => _QRCodeState();
}

class _QRCodeState extends State<QRCode> {
  @override
  Widget build(BuildContext context) {
    return Dialog(
      child: Container(
        width: 300,
        height: 300,
        child: Center(
          child: widget.qrImage,
        ),
      ),
    );
  }
}
```

これは非常に単純で、前の画面でQRコード化されたものをmodalの形で画面上に表示するだけなので説明は省略します。

これでそれぞれの画面で必要なものは作成できました！

### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discordの`#near`で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の4点を記載してください ✨

```
1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット
```

---

section-2-lesson1の完了おめでとうございます 🎉

これでコントラクトに関する実装は全て完了しました！ ！

次のレッスンからはフロントエンドの作成、フロントエンドとコントラクトの接続をしていきましょう。

ここまではコード上の実装だけで実際に目に見えたものがまだありませんでしたが、次からは実機またはエミュレータを使いながらの実装になるので楽しくなってきます。

次のLesson2でそれぞれの画面のUI, UXを実装していきましょう！
