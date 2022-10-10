### 🪙 独自トークンを発行するコントラクトを作成しよう

ではいよいよスマートコントラクトの実装に移ります。まずはこの送金アプリで使うトークンを発行するためのコントラクトを作成しましょう。

とその前に、使用するライブラリを npm を使用することでインストールしていきましょう。下のコードを実行することによって行います。

```
npm install @openzeppelin/contracts
npm install dotenv
```

今回は OpenZepplin が公開しているライブラリを使用するのでとても簡略化できます。このライブラリを使用することによってトークンの授受や指定したアドレスの残高照会のための関数を簡単かつ安全に使用することができます。

一つ前のレッスンで作成した`ERC20Tokens.sol`ファイルに以下の内容を追記しましょう。

[`ERC20Tokens.sol`]

```
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract DaiToken is ERC20 {
    constructor(address contractAddress) ERC20('Dai Token', "DAI") {
        _mint(contractAddress, 1000000 ether);
    }
}

contract EthToken is ERC20 {
    constructor(address contractAddress) ERC20('Ethereum Token', "ETH") {
        _mint(contractAddress, 100000 ether);
    }
}

contract AuroraToken is ERC20 {
    constructor(address contractAddress) ERC20('Aurora Token', "AOA") {
        _mint(contractAddress, 1000000 ether);
    }
}

contract ShibainuToken is ERC20 {
    constructor(address contractAddress) ERC20('Shibainu Token', "SHIB") {
        _mint(contractAddress, 1000000 ether);
    }
}
contract SolanaToken is ERC20 {
    constructor(address contractAddress) ERC20('Solana Token', "SOL") {
        _mint(contractAddress, 1000000 ether);
    }
}
contract TetherToken is ERC20 {
    constructor(address contractAddress) ERC20('Tether Token', "USDT") {
        _mint(contractAddress, 1000000 ether);
    }
}
contract UniswapToken is ERC20 {
    constructor(address contractAddress) ERC20('Uniswap Token', "UNI") {
        _mint(contractAddress, 1000000 ether);
    }
}

contract PolygonToken is ERC20 {
    constructor(address contractAddress) ERC20('Polygon Token', "Matic") {
        _mint(contractAddress, 1000000 ether);
    }
}
```

まずは下の一行によって OpenZepplin が発行している`ERC20`のライブラリが使用できるようにします。

```
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
```

全て同じように書いているので、その中の一つを見ていきましょう。一番最初に書いてある`DaiToken`というコントラクトの内容は以下のようになっています。

```
contract DaiToken is ERC20 {
    constructor(address contractAddress) ERC20('Dai Token', "DAI") {
        _mint(contractAddress, 1000000 ether);
    }
}
```

`ERC20`という規格を継承しており、引数として`contractAddress`を持っていることがわかります。

その次に名前、symbol を記述しています。constructor はコントラクトが deploy された時に一度だけ最初に呼ばれる関数で、その中に`_mint`関数が呼ばれています。

ここでは引数として受け取る`contractAddress`と発行数として`1000000 ether`を指定しています。この`ether`というのは`10の18乗`を示しており、100 万 ether 分発行することを表しています。

ether の最小単位`wei`は`10の-18乗`であり、発行数の単位は wei なので気をつけるようにしましょう。

このように

1. トークンの名前
2. トークンの symbol(ETH 等)
3. トークンの初期オーナー
4. 発行枚数

を指定したものをそれぞれコントラクトとして記述しています。

`_mint`関数の中で引数として取っている数字はトークンの発行数です。この値によって次に実装する swap 機能を備えた送金機能が動きます。

例えば 1ETH に対して 10AOA が同等な価値を持っているとすれば、10ETH をスマートコントラクトに送ると 100AOA が送金先に届くということです。

この swap 機能がうまく働いていることを理解するために、発行数は上記で書いた通り、つまり ETH だけ 10 万 x10 の 18 乗で他のトークンは 100 万 x10 の 18 乗にしておくのがいいと思います。

アプリが完成してから発行数を変えてもう一度デプロイしてもいいですね！

### 💥 swap 機能を備えた送金コントラクトを実装しよう

次はメインである` swap 機能`を含んだトークンの送金機能を作成していきます。

実装に入る前に今回のプロジェクトの概要を把握しておきましょう。まず送金者は

① 送金したいトークン

② 送金したい量

を決めることができます。

また、受け取り手のトークンの種類を指定することができます。

ここで必要となってくる機能が swap 機能です。スマートコントラクトが仲介役となって送金者からトークンを受け取り、それと同等の価値を持った量のトークンを受信者に送るというものです。

これがこのコントラクトの概要となります。では早速実装に移っていきましょう。`Swap.sol`の中身を以下のようにしましょう。

[`Swap.sol`]

```
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

// Import this file to use console.log
import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract SwapContract{
    address public deployerAddress;

    constructor() payable{
        deployerAddress = msg.sender;
    }

    // calculate value between two tokens
    function calculateValue(address tokenSendAddress, address tokenRecieveMesureAddress) public view returns (uint256 value){
        value = (1 ether) * IERC20(tokenSendAddress).balanceOf(address(this)) / ERC20(tokenRecieveMesureAddress).balanceOf(address(this));
    }

    // distribute toke to users
    function distributeToken(address tokenAddress, uint256 amount, address recipientAddress) public {
        require(msg.sender == deployerAddress, "Anyone but depoyer can distribute token!");
        IERC20 token = IERC20(tokenAddress);
        token.transfer(recipientAddress, amount);
    }

    // swap tokens between two users
    function swap(address sendTokenAddress, address measureTokenAddress, address receiveTokenAddress, uint256 amount, address recipientAddress) public payable{
        IERC20 sendToken = IERC20(sendTokenAddress);
        IERC20 receiveToken = IERC20(receiveTokenAddress);

        uint256 sendTokenValue = calculateValue(sendTokenAddress, measureTokenAddress);
        uint256 recieveTokenValue = calculateValue(receiveTokenAddress, measureTokenAddress);
        uint256 sendAmount = amount * sendTokenValue / (1 ether);
        uint256 recieveAmount = amount * recieveTokenValue / (1 ether);

        require(sendToken.balanceOf(msg.sender) >= sendAmount, "Your asset is smaller than amount you want to send");
        require(receiveToken.balanceOf(address(this)) >= recieveAmount, "Contract asset of the currency recipient want is smaller than amount you want to send");

        sendToken.transferFrom(msg.sender, address(this), sendAmount);
        receiveToken.transfer(recipientAddress, recieveAmount);
    }
}
```

では順番に見ていきましょう。

まず最初に OpenZepplin の ERC20 規格のライブラリをインポートすることを宣言しています。

```
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
```

次にコントラクトの状態変数を宣言します。

```
address public deployerAddress;
```

`deployerAddress`はこのコントラクトを deploy した人のアドレスが格納されます。このアドレスはトークンの配布などの管理権限がある人のみが行えるような関数を作る時に必要となります。

```
// calculate value between two tokens
    function calculateValue(address tokenSendAddress, address tokenRecieveMesureAddress) public view returns (uint256 value){
        value = (1 ether) * IERC20(tokenSendAddress).balanceOf(address(this)) / ERC20(tokenRecieveMesureAddress).balanceOf(address(this));
    }
```

この関数では二つのトークンの相対的な価値を算出しています。計算方法は単純で、このスマートコントラクトが所持しているトークンの総量で一方を他方のそれで割ることで価値を決めています。

`value`という変数が算出された価値になるのですが、solidity では小数点以下は扱うことができないので最初に 1 ether(10^18)をかけることで小数点以下が消えることを回避しています。しかし後でこの 1ether 分掛け合わせる必要があるので覚えておいてください。

```
// distribute token to users
    function distributeToken(address tokenAddress, uint256 amount, address recipientAddress) public {
        require(msg.sender == deployerAddress, "Anyone but depoyer can distribute token!");
        IERC20 token = IERC20(tokenAddress);
        token.transfer(recipientAddress, amount);
    }
```

次にスマートコントラクトが所持しているトークンを配布する関数です。この関数では、関数を呼び出しているアドレスがコントラクトを deploy したアドレスと一致しているのかを確認した後に指定された量のトークンを送金します。

関数の中で宣言されている`token`は送りたいトークンのアドレスから生成されたコントラクトのことで、token はそのトークンの送金や残高照会ができるようになります。

```
// swap tokens between two users
    function swap(address sendTokenAddress, address measureTokenAddress, address receiveTokenAddress, uint256 amount, address recipientAddress) public payable{
        IERC20 sendToken = IERC20(sendTokenAddress);
        IERC20 receiveToken = IERC20(receiveTokenAddress);

        uint256 sendTokenValue = calculateValue(sendTokenAddress, measureTokenAddress);
        uint256 recieveTokenValue = calculateValue(receiveTokenAddress, measureTokenAddress);
        uint256 sendAmount = amount * sendTokenValue / (1 ether);
        uint256 recieveAmount = amount * recieveTokenValue / (1 ether);

        require(sendToken.balanceOf(msg.sender) >= sendAmount, "Your asset is smaller than amount you want to send");
        require(receiveToken.balanceOf(address(this)) >= recieveAmount, "Contract asset of the currency recipient want is smaller than amount you want to send");

        sendToken.transferFrom(msg.sender, address(this), sendAmount);
        receiveToken.transfer(recipientAddress, recieveAmount);
    }
```

最後に swap 機能を実装した部分ですが、これは複雑なので丁寧に説明していきます。まず引数としては以下のものをとっています。

```
sendTokenAddress: 送金者が送りたいトークンのアドレス
measureTokenAddress: 送金者が送りたい価値を表すためのトークンのアドレス
receiveTokenAddress: 受領者が受け取りたいトークンのアドレス
recipientAddress: 受領者のウォレットアドレス
amount: measureTokenAddressで決める価値の量
```

次に送金者が送りたいトークンと、受領者が受け取りたいトークンのアドレスからそれぞれコントラクトを呼び出します。

```
IERC20 sendToken = IERC20(sendTokenAddress);
IERC20 receiveToken = IERC20(receiveTokenAddress);
```

次に`calculateValue`関数を用いることで`sendTokenAddress/measureTokenAddress`、`receiveTokenAddress/measureTokenAddress`の両方の相対的な価値を算出します。

```
uint256 sendTokenValue = calculateValue(sendTokenAddress, measureTokenAddress);
        uint256 recieveTokenValue = calculateValue(receiveTokenAddress, measureTokenAddress);
```

次に相対的な価値に引数である`amount`を掛け合わせることで送金者が送るトークン量と受領者が受け取るトークン量を算出します。

```
uint256 sendAmount = amount * sendTokenValue / (1 ether);
        uint256 recieveAmount = amount * recieveTokenValue / (1 ether);
```

ここで気をつけておかないといけないことは、先ほども言ったように価値を算出するときに 1 ether かけているのでここで 1 ether で割って相殺しないといけないということです。

次に送金者、このコントラクトの両方が十分なトークンを保有しているのかを確認しています。

```
require(sendToken.balanceOf(msg.sender) >= sendAmount, "Your asset is smaller than amount you want to send");
        require(receiveToken.balanceOf(address(this)) >= recieveAmount, "Contract asset of the currency recipient want is smaller than amount you want to send");
```

最後に送信者、このコントラクトの両方からそれぞれ指定されたトークン量(sendAmount,recieveAmount)を transfer します。

```
sendToken.transferFrom(msg.sender, address(this), sendAmount);
        receiveToken.transfer(recipientAddress, recieveAmount);
```

ここで注意しておいてほしいことは、ERC20 のもつメソッドの一つである`transferFrom`関数はあらかじめ`approve`関数によって指定されたアドレスに指定された量のトークンを承認しないと使用することができません。

しかしここで approve 関数を使用するとこのコントラクトが承認したことになってしまい、送信者が承認したことにはならなりません。なのでここでは呼ばず、実際に使用する際にこの関数を呼ぶ前に送金者が直接 approve 関数を呼ぶようにします。

これで swap 機能を持った送金コントラクトは完成です。

### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discord の `#section-1` で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の 4 点を記載してください ✨

```
1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット
```

---

section-1-lesson2 の完了おめでとうございます！

これでコントラクトの作成は達成できたので、次のレッスンでコントラクトのテスト、deploy をしていきましょう!
