### 📲 　サインイン、ホーム画面を作成しよう

ではここからは実際のメニューを作成していきましょう！

まずサインイン画面を作成していきます。

`lib/view/screens/signin.dart`へ移動して以下のコードに書き換えていきましょう！

[`signin.dart`]

```
import 'package:flutter/material.dart';
import 'package:flutter/src/foundation/key.dart';
import 'package:flutter/src/widgets/framework.dart';
import 'package:hexcolor/hexcolor.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:http/http.dart';
import 'package:mulpay_frontend/model/contract_model.dart';
import 'package:mulpay_frontend/view/screens/home.dart';
import 'package:mulpay_frontend/view/widgets/navbar.dart';
import 'package:provider/provider.dart';
import 'package:web3_connect/web3_connect.dart';
import 'package:web3dart/web3dart.dart';
import 'package:web_socket_channel/io.dart';

class SignIn extends StatelessWidget {
  SignIn({Key? key}) : super(key: key);
  final connection = Web3Connect();
  final String _rpcUrl = "https://testnet.aurora.dev";
  final _client =
      Web3Client("https://testnet.aurora.dev", Client(), socketConnector: () {
    return IOWebSocketChannel.connect("wss://testnet.aurora.dev")
        .cast<String>();
  });

  @override
  Widget build(BuildContext context) {
    final displayHeight = MediaQuery.of(context).size.height;
    final displayWidth = MediaQuery.of(context).size.width;
    var provider = Provider.of<BottomNavigationBarProvider>(context);
    return Scaffold(
      body: SafeArea(
        child: SizedBox.expand(
          child: Container(
            decoration: BoxDecoration(
              image: DecorationImage(
                image: const AssetImage("assets/multiple-coins.jpg"),
                alignment: const Alignment(-0.4, 0.5),
                fit: BoxFit.fitHeight,
                colorFilter: ColorFilter.mode(
                  Colors.black.withOpacity(0.6),
                  BlendMode.dstATop,
                ),
              ),
            ),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.start,
              crossAxisAlignment: CrossAxisAlignment.center,
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
                  width: double.infinity,
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
                  width: displayWidth * 0.7,
                  child: ElevatedButton(
                    onPressed: () async {
                      connection.enterChainId(1313161555);
                      connection.enterRpcUrl(_rpcUrl);
                      await connection.connect();
                      if (connection.account != "") {
                        await context
                            .read<ContractModel>()
                            .setConnection(connection);
                        provider.currentIndex = 0;
                        Navigator.pushReplacementNamed(context, '/home');
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

flutter では`main`関数から走り出します。まず`.env`ファイルを読み込み、その後 javascript でいう props のような`provider`を作成します。

この provider を使用することで他の widget からも情報の共有、監視ができるようになります。

```
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

child として`MyApp`が指定されているので次にこの widget が表示されることになります。

```
class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
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

`MyApp`では`routes`でルートを指定しています。ここでは`/signIn`というルートでは`SignIn`widget が、`/home`というルートでは`BottomNavigationBarWidget`widget が表示されることになります。

`initialRoute`には`/signIn`が指定されているのでまずは`SignIn`widget が表示されます。

ではエミュレータで動かしてみましょう！


その前に、使用しているライブラリの中で android の設定を変えないと動かないものがあるので`android/app/build.gradle`に移動して`compileSdkVersion`を`32`に変更しましょう。

また、`defaultConfig`の中の`minSdkVersion`を`20`にしましょう。

```
android {
    compileSdkVersion 32
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
        applicationId "com.example.mulpay_frontend"
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

下のような画面が表示されていれば成功です。
![](/public/images/NEAR-MulPay/section-2/2_2_1.png)

次にホーム画面を作成していきましょう。`lib/view/screens/home.dart`へ移動して以下のコードを追加していきましょう！

[`home.dart`]

```
import 'package:flutter/material.dart';
import 'package:flutter/src/foundation/key.dart';
import 'package:flutter/src/widgets/framework.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:flutter_svg/svg.dart';
import 'package:hexcolor/hexcolor.dart';
import 'package:mulpay_frontend/model/contract_model.dart';
import 'package:mulpay_frontend/view/widgets/qr_code.dart';
import 'package:mulpay_frontend/view/widgets/coin.dart';
import 'package:provider/provider.dart';
import 'package:qr_flutter/qr_flutter.dart';

class Home extends StatelessWidget {
  const Home({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final displayHeight = MediaQuery.of(context).size.height;
    final displayWidth = MediaQuery.of(context).size.width;
    var contractModel = Provider.of<ContractModel>(context, listen: true);

    return Scaffold(
      body: SafeArea(
        child: Container(
          margin: EdgeInsets.symmetric(horizontal: displayWidth * 0.08),
          child: Column(
            children: [
              SizedBox(
                height: displayHeight * 0.04,
              ),
              SizedBox(
                height: displayHeight * 0.04,
                child: Row(
                  children: [
                    Center(
                      child: Text(
                        'Home',
                        style: Theme.of(context).textTheme.headline1,
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
                                  const Text(
                                    "Balance",
                                    style: TextStyle(
                                        color: Colors.white, fontSize: 13),
                                  ),
                                  FutureBuilder(
                                      future: contractModel.getTotalBalance(),
                                      builder: (context, snapshot) {
                                        if (snapshot.hasData) {
                                          return Text(
                                            "${(snapshot.data.toString())} ETH",
                                            style: TextStyle(
                                                color: Colors.white,
                                                fontSize: 14,
                                                fontWeight: FontWeight.bold),
                                          );
                                        } else {
                                          return Center(
                                            child: CircularProgressIndicator
                                                .adaptive(),
                                          );
                                        }
                                      })
                                ],
                              ),
                              const Spacer(),
                              SizedBox(
                                height: 30,
                                width: 22,
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
                                      contractModel.account,
                                      style: TextStyle(
                                        color: Colors.grey,
                                        fontSize: 13,
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
                                            qrImage: QrImage(
                                          data: contractModel.account,
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
                                        const Text(
                                          ' display QR code',
                                          style: TextStyle(
                                            color: Colors.grey,
                                            fontSize: 12,
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
                                height: 35,
                                width: 35,
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
                                  );
                                });
                          } else {
                            return Center(
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

この画面では上部のメニューの balance に残高全てを ETH で表示しています。また、その下のそれぞれのトークンの残高をコントラクトの関数によって取得しています。

これらの情報の取得は非同期処理で取得しているので、取得するまではインジケーターが回るようになっています。

では再びエミュレータを立ち上げてきちんと動いているかみていきましょう！

正常に動いている場合は下のように表示されているはずです。
![](/public/images/NEAR-MulPay/section-2/2_2_2.png)

トークンのリストは上下にスクロールできるようになっていて、トークンの数が増えてもきちんと動くようになっています！

### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discord の `#section-2` で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の 4 点を記載してください ✨

```
1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット
```

---

section-2-lesson2 の完了おめでとうございます 🎉

これでサインイン画面とホーム画面は完成しました！

次のレッスンでは送金画面、wallet 画面を実装していきます。
