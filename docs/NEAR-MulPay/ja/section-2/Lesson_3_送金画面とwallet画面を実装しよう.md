###　 🍵 　送金画面と wallet 画面を実装しよう

まずは送金画面を作成していきますが、その前に QR コードを読み取る時の画面を作っていきましょう！

`lib/view/screens/qr_code_scan.dart`に移動して以下のコードを追加していきましょう。

[`qr_code_scan.dart`]

```
import 'dart:io';

import 'package:flutter/material.dart';
import 'package:flutter/src/foundation/key.dart';
import 'package:flutter/src/widgets/framework.dart';
import 'package:hexcolor/hexcolor.dart';
import 'package:qr_code_scanner/qr_code_scanner.dart';

class QRCodeScan extends StatefulWidget {
  const QRCodeScan({Key? key}) : super(key: key);

  @override
  State<QRCodeScan> createState() => _QRCodeScanState();
}

class _QRCodeScanState extends State<QRCodeScan> {
  final qrKey = GlobalKey(debugLabel: "QR");

  Widget buildQrView(BuildContext context) => QRView(
        key: qrKey,
        onQRViewCreated: onQRViewCreated,
        overlay: QrScannerOverlayShape(
          borderColor: HexColor("#0C9DB0"),
          borderRadius: 10,
          borderLength: 20,
          borderWidth: 10,
          cutOutSize: MediaQuery.of(context).size.width * 0.8,
        ),
      );

  void onQRViewCreated(QRViewController controller) {
    setState(
      () {
        this.controller = controller;
      },
    );
    controller.scannedDataStream.listen((barcode) {
      setState(() {
        this.barcode = barcode;
      });
    });
  }

  Barcode? barcode;
  QRViewController? controller;
  @override
  void dispose() {
    controller?.dispose();
    super.dispose();
  }

  @override
  void reassemble() async {
    super.reassemble();

    if (Platform.isAndroid) {
      await controller!.pauseCamera();
    }
    controller!.resumeCamera();
  }

  @override
  Widget build(BuildContext context) {
    final displayHeight = MediaQuery.of(context).size.height;
    final displayWidth = MediaQuery.of(context).size.width;
    return SafeArea(
      child: Scaffold(
        body: Stack(
          alignment: Alignment.center,
          children: [
            buildQrView(context),
            Positioned(
              bottom: 10,
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  Container(
                    height: displayHeight * 0.035,
                    decoration: BoxDecoration(
                        color: Colors.white24,
                        borderRadius: BorderRadius.circular(5)),
                    child: Center(
                      child: Row(
                        children: [
                          Text(
                            barcode != null
                                ? "Recipient Address : "
                                : "Scan a QR code!",
                          ),
                          SizedBox(
                            width: displayWidth * 0.1,
                            child: Text(
                              barcode != null ? "${barcode!.code}" : "",
                              overflow: TextOverflow.ellipsis,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                  SizedBox(
                    width: 5,
                  ),
                  ElevatedButton(
                    onPressed: () {
                      barcode != null
                          ? Navigator.pop(context, barcode!.code)
                          : Navigator.pop(context);
                    },
                    child: Center(
                      child: Text(
                        barcode != null ? "get address!" : "back screen",
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
```

この widget では QR コードから文字列を読み取ることができます。

読み取れた時にはその文字列を送金画面の widget に送り、読み取れなかったときには null を送信することになります。

では送金画面を実装していきます。`lib/view/screens/send.dart`へ移動して以下のコードを追加していきましょう。

[`send.dart`]

```
import 'package:dropdown_button2/dropdown_button2.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter/src/foundation/key.dart';
import 'package:flutter/src/widgets/framework.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:hexcolor/hexcolor.dart';
import 'package:mulpay_frontend/view/screens/qr_code_scan.dart';
import 'package:provider/provider.dart';

import '../../model/contract_model.dart';

class Send extends StatefulWidget {
  const Send({Key? key}) : super(key: key);

  @override
  State<Send> createState() => _SendState();
}

class _SendState extends State<Send> {
  Token dropdownValueOfSecond = ContractModel().tokenList[2];
  Token dropdownValueOfThird = ContractModel().tokenList[2];
  List<Token> tokenList = ContractModel().tokenList;
  TextEditingController addressController = TextEditingController();
  final amountController = TextEditingController();

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
                    Text(
                      'Send',
                      style: Theme.of(context).textTheme.headline1,
                    ),
                  ],
                ),
              ),
              SizedBox(
                height: displayHeight * 0.01,
              ),
              Expanded(
                child: SingleChildScrollView(
                  child: ConstrainedBox(
                    constraints:
                        BoxConstraints(maxHeight: displayHeight * 0.82),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Column(
                          children: [
                            Row(
                              mainAxisAlignment: MainAxisAlignment.start,
                              children: [
                                Text(
                                  "①Input receiver's wallet address",
                                  style: GoogleFonts.roboto(
                                    fontWeight: FontWeight.bold,
                                    fontSize: 17,
                                    color: Colors.black,
                                  ),
                                ),
                              ],
                            ),
                            SizedBox(
                              height: displayHeight * 0.015,
                            ),
                            Container(
                              margin: EdgeInsets.symmetric(
                                  horizontal: displayWidth * 0.05),
                              color: Colors.white,
                              child: TextFormField(
                                decoration: InputDecoration(
                                  enabledBorder: OutlineInputBorder(
                                    borderRadius: BorderRadius.circular(3),
                                    borderSide: BorderSide(
                                      color: Colors.grey,
                                      width: 1.0,
                                    ),
                                  ),
                                  focusedBorder: OutlineInputBorder(
                                    borderRadius: BorderRadius.circular(3),
                                    borderSide: BorderSide(
                                      color: HexColor('#19667E'),
                                      width: 2.0,
                                    ),
                                  ),
                                  labelText: 'ex) 0x96324xv029...',
                                ),
                                controller: addressController,
                              ),
                            ),
                            GestureDetector(
                              onTap: () async {
                                final result = await Navigator.of(context).push(
                                  MaterialPageRoute(
                                    builder: (context) => QRCodeScan(),
                                  ),
                                );

                                if (!mounted) return;

                                if (result == null) {
                                  Fluttertoast.showToast(
                                    msg: "Couldn\'t get recipient address",
                                    toastLength: Toast.LENGTH_SHORT,
                                    timeInSecForIosWeb: 1,
                                    backgroundColor: Colors.black,
                                    textColor: Colors.white,
                                    fontSize: 16.0,
                                  );
                                } else {
                                  addressController.text = result;
                                }
                                setState(() {});
                              },
                              child: Row(
                                mainAxisAlignment: MainAxisAlignment.start,
                                children: [
                                  SizedBox(width: 18),
                                  SizedBox(
                                    height: 22,
                                    width: 22,
                                    child: SvgPicture.asset(
                                      'assets/pop.svg',
                                      color: Colors.grey,
                                    ),
                                  ),
                                  const Text(
                                    ' scan QR code',
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
                        Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Row(
                              mainAxisAlignment: MainAxisAlignment.start,
                              children: [
                                Text(
                                  "②Select coin you want to transfer \n and input amount",
                                  style: GoogleFonts.roboto(
                                    fontWeight: FontWeight.bold,
                                    fontSize: 17,
                                    color: Colors.black,
                                  ),
                                ),
                              ],
                            ),
                            SizedBox(
                              height: 10,
                            ),
                            Row(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Container(
                                  decoration: BoxDecoration(
                                    borderRadius: const BorderRadius.all(
                                      Radius.circular(15),
                                    ),
                                    color: HexColor('#D9D9D9'),
                                  ),
                                  width: displayWidth * 0.4,
                                  height: displayHeight * 0.12,
                                  child: DropdownButtonHideUnderline(
                                    child: DropdownButton2(
                                      buttonWidth: 20,
                                      buttonHeight: 20,
                                      customButton: Container(
                                          child: Row(
                                        children: [
                                          SizedBox(
                                            width: 5,
                                          ),
                                          Container(
                                            width: displayWidth * 0.13,
                                            child: Column(
                                              mainAxisAlignment:
                                                  MainAxisAlignment.center,
                                              children: [
                                                SizedBox(
                                                  height: 50,
                                                  width: 50,
                                                  child: Image.asset(
                                                      dropdownValueOfSecond
                                                          .imagePath),
                                                ),
                                              ],
                                            ),
                                          ),
                                          SizedBox(
                                            width: 5,
                                          ),
                                          SizedBox(
                                            height: displayHeight * 0.12,
                                            width: displayWidth * 0.14,
                                            child: Column(
                                              mainAxisAlignment:
                                                  MainAxisAlignment.center,
                                              crossAxisAlignment:
                                                  CrossAxisAlignment.start,
                                              children: [
                                                SizedBox(
                                                  height: 10,
                                                ),
                                                Text(
                                                  dropdownValueOfSecond.symbol,
                                                  style: TextStyle(
                                                    fontWeight: FontWeight.bold,
                                                    color: Colors.black,
                                                    fontSize: 14,
                                                  ),
                                                ),
                                                SizedBox(
                                                  height: 5,
                                                ),
                                                Text(
                                                  dropdownValueOfSecond.name,
                                                  style: TextStyle(
                                                      fontWeight:
                                                          FontWeight.bold,
                                                      color: Colors.grey,
                                                      fontSize: 12),
                                                ),
                                                SizedBox(
                                                  height: 20,
                                                ),
                                              ],
                                            ),
                                          ),
                                          SizedBox(
                                            width: 10,
                                          ),
                                          SizedBox(
                                            height: displayHeight * 0.12,
                                            width: 20,
                                            child: SvgPicture.asset(
                                              "assets/triangle.svg",
                                              color: HexColor("#628A8A"),
                                            ),
                                          ),
                                        ],
                                      )),
                                      icon: Icon(
                                        Icons.arrow_drop_down,
                                        size: 30,
                                        color: HexColor("#628A8A"),
                                      ),
                                      onChanged: (Token? newValue) {
                                        setState(() {
                                          dropdownValueOfSecond = newValue!;
                                        });
                                      },
                                      items: tokenList
                                          .map<DropdownMenuItem<Token>>(
                                              (Token value) {
                                        return DropdownMenuItem<Token>(
                                          value: value,
                                          child: Row(
                                            children: [
                                              SizedBox(
                                                height: 30,
                                                width: 30,
                                                child: Image.asset(
                                                    value.imagePath),
                                              ),
                                              SizedBox(
                                                width: 10,
                                              ),
                                              Text(value.symbol)
                                            ],
                                          ),
                                        );
                                      }).toList(),
                                    ),
                                  ),
                                ),
                                Container(
                                  margin: EdgeInsets.symmetric(horizontal: 20),
                                  height: displayHeight * 0.12,
                                  width: displayWidth * 0.32,
                                  decoration: BoxDecoration(
                                    borderRadius: const BorderRadius.all(
                                      Radius.circular(15),
                                    ),
                                    color: HexColor('#D9D9D9'),
                                  ),
                                  child: Row(
                                    children: [
                                      Container(
                                        margin: EdgeInsets.symmetric(
                                            horizontal: 15,
                                            vertical: displayHeight * 0.026),
                                        width: displayWidth * 0.12,
                                        color: Colors.white,
                                        child: TextFormField(
                                          decoration: InputDecoration(
                                            enabledBorder: OutlineInputBorder(
                                              borderRadius:
                                                  BorderRadius.circular(3),
                                              borderSide: BorderSide(
                                                color: Colors.grey,
                                                width: 1.0,
                                              ),
                                            ),
                                            focusedBorder: OutlineInputBorder(
                                              borderRadius:
                                                  BorderRadius.circular(3),
                                              borderSide: BorderSide(
                                                color: HexColor('#19667E'),
                                                width: 2.0,
                                              ),
                                            ),
                                          ),
                                          keyboardType: TextInputType.number,
                                          inputFormatters: [
                                            LengthLimitingTextInputFormatter(3),
                                          ],
                                          controller: amountController,
                                        ),
                                      ),
                                      Container(
                                        height: double.infinity,
                                        child: Column(
                                          mainAxisAlignment:
                                              MainAxisAlignment.end,
                                          children: [
                                            Text(
                                              dropdownValueOfSecond.symbol,
                                              style: TextStyle(
                                                fontSize: 20,
                                                fontWeight: FontWeight.bold,
                                              ),
                                            ),
                                            SizedBox(
                                              height: displayHeight * 0.026,
                                            )
                                          ],
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              ],
                            ),
                          ],
                        ),
                        Column(
                          children: [
                            Row(
                              mainAxisAlignment: MainAxisAlignment.start,
                              children: [
                                Text(
                                  "③Select coin recipient want",
                                  style: GoogleFonts.roboto(
                                    fontWeight: FontWeight.bold,
                                    fontSize: 17,
                                    color: Colors.black,
                                  ),
                                ),
                              ],
                            ),
                            SizedBox(
                              height: 20,
                            ),
                            Container(
                              decoration: BoxDecoration(
                                borderRadius: const BorderRadius.all(
                                  Radius.circular(15),
                                ),
                                color: HexColor('#D9D9D9'),
                              ),
                              width: displayWidth * 0.7,
                              height: displayHeight * 0.12,
                              child: DropdownButtonHideUnderline(
                                child: DropdownButton2(
                                  buttonWidth: 20,
                                  buttonHeight: 20,
                                  customButton: Container(
                                      child: Row(
                                    mainAxisAlignment: MainAxisAlignment.center,
                                    children: [
                                      SizedBox(
                                        width: 5,
                                      ),
                                      Container(
                                        width: displayWidth * 0.13,
                                        child: Column(
                                          mainAxisAlignment:
                                              MainAxisAlignment.center,
                                          children: [
                                            SizedBox(
                                              height: 50,
                                              width: 50,
                                              child: Image.asset(
                                                  dropdownValueOfThird
                                                      .imagePath),
                                            ),
                                          ],
                                        ),
                                      ),
                                      SizedBox(
                                        width: 15,
                                      ),
                                      SizedBox(
                                        height: displayHeight * 0.12,
                                        width: displayWidth * 0.14,
                                        child: Column(
                                          mainAxisAlignment:
                                              MainAxisAlignment.center,
                                          crossAxisAlignment:
                                              CrossAxisAlignment.start,
                                          children: [
                                            SizedBox(
                                              height: 10,
                                            ),
                                            Text(
                                              dropdownValueOfThird.symbol,
                                              style: TextStyle(
                                                fontWeight: FontWeight.bold,
                                                color: Colors.black,
                                                fontSize: 14,
                                              ),
                                            ),
                                            SizedBox(
                                              height: 5,
                                            ),
                                            Text(
                                              dropdownValueOfThird.name,
                                              style: TextStyle(
                                                  fontWeight: FontWeight.bold,
                                                  color: Colors.grey,
                                                  fontSize: 12),
                                            ),
                                            SizedBox(
                                              height: 20,
                                            ),
                                          ],
                                        ),
                                      ),
                                      SizedBox(
                                        width: 70,
                                      ),
                                      SizedBox(
                                        height: displayHeight * 0.12,
                                        width: 20,
                                        child: SvgPicture.asset(
                                          "assets/triangle.svg",
                                          color: HexColor("#628A8A"),
                                        ),
                                      ),
                                    ],
                                  )),
                                  icon: Icon(
                                    Icons.arrow_drop_down,
                                    size: 30,
                                    color: HexColor("#628A8A"),
                                  ),
                                  onChanged: (Token? newValue) {
                                    setState(() {
                                      dropdownValueOfThird = newValue!;
                                    });
                                  },
                                  items: tokenList.map<DropdownMenuItem<Token>>(
                                      (Token value) {
                                    return DropdownMenuItem<Token>(
                                      value: value,
                                      child: Row(
                                        children: [
                                          SizedBox(
                                            height: 30,
                                            width: 30,
                                            child: Image.asset(value.imagePath),
                                          ),
                                          SizedBox(
                                            width: 10,
                                          ),
                                          Text(value.symbol)
                                        ],
                                      ),
                                    );
                                  }).toList(),
                                ),
                              ),
                            ),
                          ],
                        ),
                        Container(
                          margin: EdgeInsets.only(bottom: displayHeight * 0.02),
                          child: SizedBox(
                            height: displayHeight * 0.1,
                            width: displayWidth * 0.7,
                            child: ElevatedButton(
                              onPressed: () async {
                                await contractModel.sendToken(
                                  dropdownValueOfSecond.contractName,
                                  dropdownValueOfSecond.address,
                                  dropdownValueOfThird.address,
                                  addressController.text,
                                  int.parse(amountController.text),
                                );
                                setState(() {
                                  dropdownValueOfSecond = tokenList[2];
                                });
                                dropdownValueOfThird = tokenList[2];
                                addressController.clear();
                                amountController.clear();
                              },
                              child: Text(
                                'Transfer',
                                style: GoogleFonts.patuaOne(
                                  fontWeight: FontWeight.w500,
                                  fontSize: 27,
                                  color: Colors.black,
                                ),
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              )
            ],
          ),
        ),
      ),
    );
  }
}
```

では早速エミュレータを起動して動かしていきましょう！

正常に動いていれば以下のように表示されるはずです。
![](/public/images/NEAR-MulPay/section-2/2_3_1.png)

この画面では先ほど作成した QR コードから受け取った文字列を Form に入れられるようになります。

受け取れなかった場合は文字列が受け取れなかったことがポップアップ表示で見られるようになっています。

また、トークンの種類とその量を選択できるようになっていて一番下のボタンを押すと metamask へ移動して許可を 2 回すると送金が完了します。

では最後に wallet 画面を実装していきましょう。`lib/view/screens/wallet.dart`へ移動して以下のコードを追加していきましょう。

[`wallet.dart`]

```
import 'package:dropdown_button2/dropdown_button2.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter/src/foundation/key.dart';
import 'package:flutter/src/widgets/framework.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:flutter_svg/svg.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:hexcolor/hexcolor.dart';
import 'package:mulpay_frontend/model/contract_model.dart';
import 'package:mulpay_frontend/view/widgets/qr_code.dart';
import 'package:mulpay_frontend/view/widgets/navbar.dart';
import 'package:provider/provider.dart';
import 'package:qr_flutter/qr_flutter.dart';
import 'package:web3dart/credentials.dart';

class Wallet extends StatefulWidget {
  const Wallet({Key? key}) : super(key: key);

  @override
  State<Wallet> createState() => _WalletState();
}

class _WalletState extends State<Wallet> {
  Token dropdownValue = ContractModel().tokenList[2];
  List<Token> tokenList = ContractModel().tokenList;
  TextEditingController addressController = TextEditingController();
  final amountController = TextEditingController();
  @override
  Widget build(BuildContext context) {
    final displayHeight = MediaQuery.of(context).size.height;
    final displayWidth = MediaQuery.of(context).size.width;
    var provider = Provider.of<BottomNavigationBarProvider>(context);
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
                height: displayHeight * 0.05,
                child: Row(
                  children: [
                    Text(
                      'Wallet',
                      style: Theme.of(context).textTheme.headline1,
                    ),
                  ],
                ),
              ),
              SizedBox(
                height: displayHeight * 0.02,
              ),
              Expanded(
                child: Column(
                  children: [
                    Container(
                      decoration: BoxDecoration(
                        border: Border.all(
                          color: Colors.black,
                          width: 2,
                        ),
                        borderRadius: const BorderRadius.all(
                          Radius.circular(15),
                        ),
                        color: HexColor('#D9D9D9'),
                      ),
                      width: double.infinity,
                      height: displayHeight * 0.12,
                      padding: EdgeInsets.only(left: 10, top: 5),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            "wallet address",
                            style: TextStyle(
                                fontWeight: FontWeight.bold, fontSize: 16),
                          ),
                          Container(
                            padding: EdgeInsets.symmetric(vertical: 1),
                            child: Text(
                              contractModel.account,
                              overflow: TextOverflow.ellipsis,
                              maxLines: 1,
                              style: TextStyle(
                                fontSize: 35,
                                color: HexColor("#56CCC5"),
                              ),
                            ),
                          ),
                          SizedBox(
                            height: displayHeight * 0.01,
                          )
                        ],
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
                        mainAxisAlignment: MainAxisAlignment.start,
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
                    SizedBox(
                      height: displayHeight * 0.1,
                    ),
                    SizedBox(
                      height: displayHeight * 0.19,
                      child: SvgPicture.asset("assets/wallet_screen_img.svg"),
                    ),
                    Expanded(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                        children: [
                          Column(
                            children: [
                              Row(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  Text(
                                    "Select coin and push the right button",
                                    style: GoogleFonts.roboto(
                                      fontWeight: FontWeight.bold,
                                      fontSize: 17,
                                      color: Colors.black,
                                    ),
                                  ),
                                ],
                              ),
                              SizedBox(
                                height: 10,
                              ),
                              Row(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  Container(
                                    decoration: BoxDecoration(
                                      borderRadius: const BorderRadius.all(
                                        Radius.circular(15),
                                      ),
                                      color: HexColor('#D9D9D9'),
                                    ),
                                    width: displayWidth * 0.4,
                                    height: displayHeight * 0.12,
                                    child: DropdownButtonHideUnderline(
                                      child: DropdownButton2(
                                        buttonWidth: 20,
                                        buttonHeight: 20,
                                        customButton: Container(
                                            child: Row(
                                          children: [
                                            SizedBox(
                                              width: 5,
                                            ),
                                            Container(
                                              width: displayWidth * 0.13,
                                              child: Column(
                                                mainAxisAlignment:
                                                    MainAxisAlignment.center,
                                                children: [
                                                  SizedBox(
                                                    height: 50,
                                                    width: 50,
                                                    child: Image.asset(
                                                        dropdownValue
                                                            .imagePath),
                                                  ),
                                                ],
                                              ),
                                            ),
                                            SizedBox(
                                              width: 5,
                                            ),
                                            SizedBox(
                                              height: displayHeight * 0.12,
                                              width: displayWidth * 0.14,
                                              child: Column(
                                                mainAxisAlignment:
                                                    MainAxisAlignment.center,
                                                crossAxisAlignment:
                                                    CrossAxisAlignment.start,
                                                children: [
                                                  SizedBox(
                                                    height: 10,
                                                  ),
                                                  Text(
                                                    dropdownValue.symbol,
                                                    style: TextStyle(
                                                      fontWeight:
                                                          FontWeight.bold,
                                                      color: Colors.black,
                                                      fontSize: 14,
                                                    ),
                                                  ),
                                                  SizedBox(
                                                    height: 5,
                                                  ),
                                                  Text(
                                                    dropdownValue.name,
                                                    style: TextStyle(
                                                        fontWeight:
                                                            FontWeight.bold,
                                                        color: Colors.grey,
                                                        fontSize: 12),
                                                  ),
                                                  SizedBox(
                                                    height: 20,
                                                  ),
                                                ],
                                              ),
                                            ),
                                            SizedBox(
                                              width: 10,
                                            ),
                                            SizedBox(
                                              height: displayHeight * 0.12,
                                              width: 20,
                                              child: SvgPicture.asset(
                                                "assets/triangle.svg",
                                                color: HexColor("#628A8A"),
                                              ),
                                            ),
                                          ],
                                        )),
                                        icon: Icon(
                                          Icons.arrow_drop_down,
                                          size: 30,
                                          color: HexColor("#628A8A"),
                                        ),
                                        onChanged: (Token? newValue) {
                                          setState(() {
                                            dropdownValue = newValue!;
                                          });
                                        },
                                        items: tokenList
                                            .map<DropdownMenuItem<Token>>(
                                                (Token value) {
                                          return DropdownMenuItem<Token>(
                                            value: value,
                                            child: Row(
                                              children: [
                                                SizedBox(
                                                  height: 30,
                                                  width: 30,
                                                  child: Image.asset(
                                                      value.imagePath),
                                                ),
                                                SizedBox(
                                                  width: 10,
                                                ),
                                                Text(value.symbol)
                                              ],
                                            ),
                                          );
                                        }).toList(),
                                      ),
                                    ),
                                  ),
                                  SizedBox(
                                    width: displayWidth * 0.05,
                                  ),
                                  Container(
                                    child: SizedBox(
                                      height: displayHeight * 0.08,
                                      width: displayWidth * 0.37,
                                      child: ElevatedButton(
                                        onPressed: () async {
                                          await contractModel.sendTransaction(
                                            dotenv.env["SWAP_CONTRACT_NAME"]!,
                                            dotenv
                                                .env["SWAP_CONTRACT_ADDRESS"]!,
                                            "distributeToken",
                                            [
                                              EthereumAddress.fromHex(
                                                  dropdownValue.address),
                                              BigInt.from(100),
                                              EthereumAddress.fromHex(
                                                  contractModel.account),
                                            ],
                                          );
                                        },
                                        child: Text(
                                          'Get 100 ${dropdownValue.symbol}!',
                                          style: GoogleFonts.patuaOne(
                                            fontWeight: FontWeight.w500,
                                            fontSize: 18,
                                            color: Colors.black,
                                          ),
                                        ),
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                            ],
                          ),
                          Container(
                            child: SizedBox(
                              height: displayHeight * 0.1,
                              width: displayWidth * 0.7,
                              child: ElevatedButton(
                                onPressed: () {
                                  Navigator.pushReplacementNamed(
                                      context, '/signIn');
                                },
                                child: Text(
                                  'Disconnect',
                                  style: GoogleFonts.patuaOne(
                                    fontWeight: FontWeight.w500,
                                    fontSize: 27,
                                    color: Colors.black,
                                  ),
                                ),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

```

これで wallet 画面は完成したので早速エミュレータを起動して動かしてみましょう。

正常に動いていれば以下のように表示されるはずです！

![](/public/images/NEAR-MulPay/section-2/2_3_2.png)

wallet address 欄には自分の wallet address の一部が表示されているはずです。また、`display QR code`をタッチするとそのアドレスを表す QR コードが表示されることになります。

下の方にあるトークンを選択して、その右のボタンを押すと metamask へ移動してガス代の消費許可を求める画面に移動して許可すれば選択したトークンを 100 トークン分取得できます！

ただし、一応セキュリテイを考えてこのボタンを押すことでトークンを手に入れられるのはコントラクトを deploy した人のみとなっています。

home 画面に移動すれば指定したトークンが 100 トークン分増えていることが確認できるでしょう。

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

section-2-lesson3 の完了おめでとうございます 🎉

これでフロントの実装は全て完成し、アプリは完成しました！

section3 ではこのアプリで実際に送金をしてみて、きちんと swap 機能を通じたより自由な送金が実現されているかを確認していきましょう 💥
