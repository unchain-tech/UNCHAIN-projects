### 📲 　サインイン、ホーム画面を作成しよう

ではここからは実際のメニューを作成していきましょう！

まずサインイン画面を作成していきます。

`lib/view/screens/signin.dart`へ移動して以下のコードに書き換えていきましょう！

[`signin.dart`]

```dart
import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:hexcolor/hexcolor.dart';
import 'package:provider/provider.dart';
import 'package:responsive_framework/responsive_framework.dart';
import 'package:url_launcher/url_launcher_string.dart';
import 'package:walletconnect_flutter_v2/walletconnect_flutter_v2.dart';

import '../../model/contract_model.dart';
import '../widgets/navbar.dart';

class SignIn extends StatelessWidget {
  const SignIn({Key? key}) : super(key: key);

  static Web3App? _walletConnect;
  static String? _url;
  static SessionData? _sessionData;

  String get deepLinkUrl => 'metamask://wc?uri=$_url';

  Future<void> _initWalletConnect() async {
    _walletConnect = await Web3App.createInstance(
      projectId: dotenv.env["WALLETCONNECT_PROJECT_ID"]!,
      metadata: const PairingMetadata(
        name: 'NEAR MulPay',
        description: 'Mobile Payment dApp with Swap Feature',
        url: 'https://walletconnect.com/',
        icons: [
          'https://walletconnect.com/walletconnect-logo.png',
        ],
      ),
    );
  }

  Future<void> connectWallet() async {
    if (_walletConnect == null) {
      await _initWalletConnect();
    }

    try {
      // セッション（dAppとMetamask間の接続）を開始します。
      final ConnectResponse connectResponse = await _walletConnect!.connect(
        requiredNamespaces: {
          'eip155': const RequiredNamespace(
              chains: ['eip155:1313161555'],
              methods: ['eth_signTransaction', 'eth_sendTransaction'],
              events: ['chainChanged']),
        },
      );
      final Uri? uri = connectResponse.uri;
      if (uri == null) {
        throw Exception('Invalid URI');
      }
      final String encodedUri = Uri.encodeComponent('$uri');
      _url = encodedUri;

      // Metamaskを起動します。
      await launchUrlString(deepLinkUrl, mode: LaunchMode.externalApplication);

      // セッションが確立されるまで待機します。
      final Completer<SessionData> session = connectResponse.session;
      _sessionData = await session.future;
    } catch (e) {
      rethrow;
    }
  }

  @override
  Widget build(BuildContext context) {
    final displayHeight = MediaQuery.of(context).size.height;
    final displayWidth = MediaQuery.of(context).size.width;
    final isDeskTop = ResponsiveBreakpoints.of(context).largerThan(MOBILE);

    var provider = Provider.of<BottomNavigationBarProvider>(context);

    return Scaffold(
      body: SafeArea(
        child: SizedBox.expand(
          child: Container(
            alignment: Alignment.center,
            decoration: BoxDecoration(
              image: DecorationImage(
                image: const AssetImage("assets/multiple-coins.jpg"),
                alignment: Alignment(isDeskTop ? 0 : -0.3, 0.5),
                fit: BoxFit.fitHeight,
                colorFilter: ColorFilter.mode(
                  Colors.black.withOpacity(0.6),
                  BlendMode.dstATop,
                ),
              ),
            ),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.start,
              children: [
                SizedBox(
                  height: displayHeight * 0.1,
                ),
                ShaderMask(
                  blendMode: BlendMode.modulate,
                  shaderCallback: (size) => LinearGradient(
                    colors: [HexColor("#7AD6FE"), HexColor("#04494E")],
                    begin: Alignment.topCenter,
                    end: Alignment.bottomCenter,
                  ).createShader(
                    Rect.fromLTWH(0, 0, size.width, size.height),
                  ),
                  child: const Text(
                    "MulPay",
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 60.0,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
                SizedBox(
                  height: displayHeight * 0.03,
                ),
                Container(
                  width: isDeskTop ? displayWidth * 0.4 : displayWidth,
                  padding:
                      const EdgeInsets.symmetric(horizontal: 10, vertical: 15),
                  margin: const EdgeInsets.symmetric(horizontal: 20),
                  alignment: Alignment.center,
                  decoration: BoxDecoration(
                    color: Colors.white.withOpacity(0.15),
                    borderRadius: BorderRadius.circular(5),
                  ),
                  child: const Text(
                    'You can make a payment\n with multiple kinds of coin',
                    textAlign: TextAlign.center,
                    style: TextStyle(fontSize: 25),
                  ),
                ),
                SizedBox(
                  height: displayHeight * 0.5,
                ),
                SizedBox(
                  height: displayHeight * 0.1,
                  width: isDeskTop ? displayWidth * 0.4 : displayWidth * 0.7,
                  child: ElevatedButton(
                    onPressed: () async {
                      try {
                        await connectWallet();
                        await context.read<ContractModel>().setConnection(
                            deepLinkUrl, _walletConnect!, _sessionData!);
                        provider.currentIndex = 0;
                        Navigator.pushReplacementNamed(context, '/home');
                      } catch (error) {
                        debugPrint('error $error');
                      }
                    },
                    child: Text(
                      'Connect Wallet',
                      style: GoogleFonts.patuaOne(
                          fontWeight: FontWeight.w500,
                          fontSize: 27,
                          color: Colors.black),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
```

では次に`main.dart`へ移動して下のように変更しましょう。

[`main.dart`]
```dart
import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:hexcolor/hexcolor.dart';
import 'package:provider/provider.dart';
import 'package:responsive_framework/responsive_framework.dart';

import 'model/contract_model.dart';
import 'view/screens/signin.dart';
import 'view/widgets/navbar.dart';

Future main() async {
  await dotenv.load(fileName: ".env");
  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider<BottomNavigationBarProvider>(
          create: (BuildContext context) => BottomNavigationBarProvider(),
        ),
        ChangeNotifierProvider(
          create: (context) => ContractModel(),
        ),
      ],
      child: const MyApp(),
    ),
  );
}

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      builder: (context, child) => ResponsiveBreakpoints.builder(
        child: child!,
        breakpoints: [
          const Breakpoint(start: 0, end: 450, name: MOBILE),
          const Breakpoint(start: 451, end: double.infinity, name: DESKTOP),
        ],
      ),
      title: 'Flutter Demo',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        primarySwatch: Colors.blue,
        elevatedButtonTheme: ElevatedButtonThemeData(
          style: ElevatedButton.styleFrom(
            primary: HexColor("#57A8BA"),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(30.0),
            ),
            shadowColor: Colors.black,
            elevation: 10,
          ),
        ),
        fontFamily: GoogleFonts.plusJakartaSans().fontFamily,
        textTheme: TextTheme(
          headlineSmall: TextStyle(
            fontFamily: GoogleFonts.baloo2().fontFamily,
            fontSize: 36,
            height: 1.0,
            color: Colors.black,
          ),
        ),
        scaffoldBackgroundColor: HexColor('#C1E3F5'),
      ),
      routes: {
        '/signIn': (context) => SignIn(),
        '/home': (context) => const BottomNavigationBarWidget(),
      },
      initialRoute: '/signIn',
    );
  }
}
```

flutterでは`main`関数から走り出します。まず`.env`ファイルを読み込み、その後JavaScriptでいうpropsのような`provider`を作成します。

このproviderを使用することで他のウィジェットからも情報の共有、監視ができるようになります。

```dart
Future main() async {
  await dotenv.load(fileName: ".env");
  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider<BottomNavigationBarProvider>(
          create: (BuildContext context) => BottomNavigationBarProvider(),
        ),
        ChangeNotifierProvider(
          create: (context) => ContractModel(),
        ),
      ],
      child: const MyApp(),
    ),
  );
}
```

childとして`MyApp`が指定されているので次にこのウィジェットが表示されることになります。

```dart
class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      builder: (context, child) => ResponsiveBreakpoints.builder(
        child: child!,
        breakpoints: [
          const Breakpoint(start: 0, end: 450, name: MOBILE),
          const Breakpoint(start: 451, end: double.infinity, name: DESKTOP),
        ],
      ),
      title: 'Flutter Demo',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        primarySwatch: Colors.blue,
        elevatedButtonTheme: ElevatedButtonThemeData(
          style: ElevatedButton.styleFrom(
            primary: HexColor("#57A8BA"),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(30.0),
            ),
            shadowColor: Colors.black,
            elevation: 10,
          ),
        ),
        fontFamily: GoogleFonts.plusJakartaSans().fontFamily,
        textTheme: TextTheme(
          headline1: TextStyle(
            fontFamily: GoogleFonts.baloo2().fontFamily,
            fontSize: 36,
            height: 1.0,
            color: Colors.black,
          ),
        ),
        scaffoldBackgroundColor: HexColor('#C1E3F5'),
      ),
      routes: {
        '/signIn': (context) => SignIn(),
        '/home': (context) => const BottomNavigationBarWidget(),
      },
      initialRoute: '/signIn',
    );
  }
}
```

このコードによって画面の横のサイズが450ピクセル以下のものをモバイル、それ以上をデスクトップとして指定しています。
```dart
builder: (context, child) => ResponsiveBreakpoints.builder(
        child: child!,
        breakpoints: [
          const Breakpoint(start: 0, end: 450, name: MOBILE),
          const Breakpoint(start: 451, end: double.infinity, name: DESKTOP),
        ],
      ),
```

`MyApp`では`routes`でルートを指定しています。ここでは`/signIn`というルートでは`SignIn`ウィジェットが、`/home`というルートでは`BottomNavigationBarWidget`ウィジェットが表示されることになります。

`initialRoute`には`/signIn`が指定されているのでまずは`SignIn`ウィジェットが表示されます。

ではエミュレータで動かしてみましょう！


その前に、使用しているライブラリの中でandroidの設定を変えないと動かないものがあるので`android/app/build.gradle`に移動して`defaultConfig`の中の`minSdkVersion`を`20`にしましょう。

```dart
android {
    compileSdkVersion flutter.compileSdkVersion
    ndkVersion flutter.ndkVersion

    compileOptions {
        sourceCompatibility JavaVersion.VERSION_1_8
        targetCompatibility JavaVersion.VERSION_1_8
    }

    kotlinOptions {
        jvmTarget = '1.8'
    }

    sourceSets {
        main.java.srcDirs += 'src/main/kotlin'
    }

    defaultConfig {
        // TODO: Specify your own unique Application ID (https://developer.android.com/studio/build/application-id.html).
        applicationId "com.example.client"
        // You can update the following values to match your application needs.
        // For more information, see: https://docs.flutter.dev/deployment/android#reviewing-the-build-configuration.
        minSdkVersion 20
        targetSdkVersion flutter.targetSdkVersion
        versionCode flutterVersionCode.toInteger()
        versionName flutterVersionName
    }

    buildTypes {
        release {
            // TODO: Add your own signing config for the release build.
            // Signing with the debug keys for now, so `flutter run --release` works.
            signingConfig signingConfigs.debug
        }
    }
}
```

ここまでで一度UIを確認してみましょう！

まずは環境構築で準備したエミュレータまたは実機を起動してPCと接続します。その後、下のコマンドを実行することでアプリを起動しましょう。

これ以降も、UIを確認する際は同じ手順で行います。

```
yarn client flutter:run
```

エミュレータであれば下のような画面が表示されていれば成功です。
![](/public/images/NEAR-MulPay/section-2/2_2_1.png)

デスクトップ版であれば下のような画面が表示されていれば成功です。
![](/public/images/NEAR-MulPay/section-2/2_2_6.png)

**👀 Wallet接続時のトラブルシューティング**

`Wallet Connect`ボタンを押した際、walletconnect_flutter_v2ライブラリやMetaMaskに関するエラーが発生していないにも関わらずMetaMaskの接続要求のポップアップが開かない場合は、以下の対処法を試してみてください。

1\. **Wallet Connectの再試行**

MetaMaskがパスワード入力後に立ち上がるが、接続要求のポップアップが表示されない場合、Swapアプリケーションに戻りもう一度Wallet Connectボタンを押してください。

2\. **システムの再起動**

上記のステップを試してもポップアップが表示されない場合、エミュレータの再起動、またはPCの再起動を試してください。

次にホーム画面を作成していきましょう。`lib/view/screens/home.dart`へ移動して以下のコードを追加していきましょう！

[`home.dart`]

```dart
import 'package:flutter/material.dart';
import 'package:flutter_svg/svg.dart';
import 'package:hexcolor/hexcolor.dart';
import 'package:provider/provider.dart';
import 'package:qr_flutter/qr_flutter.dart';
import 'package:responsive_framework/responsive_framework.dart';

import '/model/contract_model.dart';
import '/view/widgets/coin.dart';
import '/view/widgets/qr_code.dart';

class Home extends StatelessWidget {
  const Home({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final displayHeight = MediaQuery.of(context).size.height;
    final displayWidth = MediaQuery.of(context).size.width;
    var contractModel = Provider.of<ContractModel>(context, listen: true);
    final isDeskTop = ResponsiveBreakpoints.of(context).largerThan(MOBILE);

    return Scaffold(
      body: SafeArea(
        child: Container(
          margin: EdgeInsets.symmetric(horizontal: displayWidth * 0.08),
          child: Column(
            children: [
              SizedBox(
                height:
                    isDeskTop ? (displayHeight * 0.01) : (displayHeight * 0.04),
              ),
              SizedBox(
                height:
                    isDeskTop ? (displayHeight * 0.06) : (displayHeight * 0.04),
                child: Row(
                  children: [
                    Center(
                      child: Text(
                        'Home',
                        style: isDeskTop
                            ? const TextStyle(fontSize: 50)
                            : (Theme.of(context).textTheme.headlineSmall),
                      ),
                    ),
                  ],
                ),
              ),
              Expanded(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Container(
                      height: displayHeight * 0.23,
                      width: displayWidth,
                      padding: const EdgeInsets.symmetric(horizontal: 10),
                      decoration: BoxDecoration(
                        borderRadius: const BorderRadius.all(
                          Radius.circular(30),
                        ),
                        gradient: LinearGradient(
                          begin: Alignment.topLeft,
                          end: Alignment.bottomRight,
                          colors: [
                            HexColor("3FA1C0"),
                            HexColor("000405"),
                            HexColor("19667E")
                          ],
                        ),
                      ),
                      child: Column(
                        children: [
                          Row(
                            children: [
                              SizedBox(
                                width: displayWidth * 0.03,
                              ),
                              Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  SizedBox(
                                    height: displayHeight * 0.027,
                                  ),
                                  Text(
                                    "Balance",
                                    style: TextStyle(
                                      color: Colors.white,
                                      fontSize: isDeskTop ? 35 : 13,
                                    ),
                                  ),
                                  FutureBuilder(
                                      future: contractModel.getTotalBalance(),
                                      builder: (context, snapshot) {
                                        if (snapshot.hasData) {
                                          return Text(
                                            "${(snapshot.data.toString())} ETH",
                                            style: TextStyle(
                                                color: Colors.white,
                                                fontSize: isDeskTop ? 28 : 13,
                                                fontWeight: FontWeight.bold),
                                          );
                                        } else {
                                          return const Center(
                                            child: CircularProgressIndicator
                                                .adaptive(),
                                          );
                                        }
                                      })
                                ],
                              ),
                              const Spacer(),
                              SizedBox(
                                height: isDeskTop ? 55 : 30,
                                width: isDeskTop ? 45 : 22,
                                child: SvgPicture.asset(
                                  'assets/three-dots.svg',
                                  color: Colors.white,
                                ),
                              ),
                              const SizedBox(
                                width: 10,
                              )
                            ],
                          ),
                          const Spacer(),
                          Row(
                            children: [
                              SizedBox(
                                width: displayWidth * 0.03,
                              ),
                              Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  SizedBox(
                                    width: displayWidth * 0.2,
                                    child: Text(
                                      contractModel.getAccount(),
                                      style: TextStyle(
                                        color: Colors.grey,
                                        fontSize: isDeskTop ? 28 : 13,
                                        fontWeight: FontWeight.w600,
                                      ),
                                      overflow: TextOverflow.ellipsis,
                                      maxLines: 1,
                                    ),
                                  ),
                                  GestureDetector(
                                    onTap: () async {
                                      await showDialog(
                                        context: context,
                                        builder: (_) => QRCode(
                                            qrImage: QrImageView(
                                          data: contractModel.getAccount(),
                                          size: 200,
                                        )),
                                      );
                                    },
                                    child: Row(
                                      mainAxisAlignment:
                                          MainAxisAlignment.start,
                                      children: [
                                        SizedBox(
                                          height: 22,
                                          width: 22,
                                          child: SvgPicture.asset(
                                            'assets/pop.svg',
                                            color: Colors.grey,
                                          ),
                                        ),
                                        Text(
                                          ' display QR code',
                                          style: TextStyle(
                                            color: Colors.grey,
                                            fontSize: isDeskTop ? 25 : 12,
                                            fontWeight: FontWeight.w600,
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                ],
                              ),
                              const Spacer(),
                              SizedBox(
                                height: isDeskTop ? 55 : 35,
                                width: isDeskTop ? 55 : 35,
                                child: Image.asset(
                                  'assets/unchain_logo.png',
                                ),
                              ),
                              const SizedBox(
                                width: 3,
                              )
                            ],
                          ),
                          SizedBox(
                            height: displayHeight * 0.02,
                          ),
                        ],
                      ),
                    ),
                    Expanded(
                      child: FutureBuilder(
                        future: contractModel.getTokensInfo(),
                        builder: (context, snapshot) {
                          if (snapshot.hasData) {
                            var coinsList = contractModel.tokenList;
                            return ListView.builder(
                                itemCount: coinsList.length,
                                itemBuilder: (context, index) {
                                  return Coins(
                                      displayWidth,
                                      displayHeight,
                                      coinsList[index].imagePath,
                                      coinsList[index].symbol,
                                      coinsList[index].name,
                                      coinsList[index].balance,
                                      (coinsList[index].ethBalance),
                                      isDeskTop);
                                });
                          } else {
                            return const Center(
                                child: CircularProgressIndicator.adaptive());
                          }
                        },
                      ),
                    )
                  ],
                ),
              ),
              const SizedBox(
                height: 5,
              )
            ],
          ),
        ),
      ),
    );
  }
}
```

この画面では上部のメニューの残高に残高全てをETHで表示しています。また、その下のそれぞれのトークンの残高をコントラクトの関数によって取得しています。

これらの情報の取得は非同期処理で取得しているので、取得するまではインジケーターが回るようになっています。

では再びエミュレータを立ち上げてきちんと動いているかみていきましょう！

正常に動いている場合は、エミュレータであれば下のように表示されているはずです。
![](/public/images/NEAR-MulPay/section-2/2_2_2.png)

デスクトップ版であれば下のような画面が表示されていれば成功です。
![](/public/images/NEAR-MulPay/section-2/2_2_3.png)

トークンのリストは上下にスクロールできるようになっていて、トークンの数が増えてもきちんと動くようになっています！

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

section-2-lesson2の完了おめでとうございます 🎉

これでサインイン画面とホーム画面は完成しました！

次のレッスンでは送金画面、wallet画面を実装していきます。
