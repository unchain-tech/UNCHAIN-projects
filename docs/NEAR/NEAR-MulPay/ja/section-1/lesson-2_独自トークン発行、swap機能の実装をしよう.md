### 🪙 独自トークンを発行するコントラクトを作成しよう

ではいよいよスマートコントラクトの実装に移ります。まずはこの送金アプリで使うトークンを発行するためのコントラクトを作成しましょう。

今回はOpenZepplinが公開しているライブラリを使用するのでとても簡略化できます。このライブラリを使用することによってトークンの授受や指定したアドレスの残高照会のための関数を簡単かつ安全に使用することができます。

1つ前のレッスンで作成した`ERC20Tokens.sol`ファイルに以下の内容を追記しましょう。

[`ERC20Tokens.sol`]

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

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

まずは下の一行によってOpenZepplinが発行している`ERC20`のライブラリが使用できるようにします。

```solidity
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
```

全て同じように書いているので、その中の1つを見ていきましょう。一番最初に書いてある`DaiToken`というコントラクトの内容は以下のようになっています。

```solidity
contract DaiToken is ERC20 {
    constructor(address contractAddress) ERC20('Dai Token', "DAI") {
        _mint(contractAddress, 1000000 ether);
    }
}
```

`ERC20`という規格を継承しており、引数として`contractAddress`を持っていることがわかります。

その次に名前、symbolを記述しています。constructorはコントラクトがdeployされた時に一度だけ最初に呼ばれる関数で、その中に`_mint`関数が呼ばれています。

ここでは引数として受け取る`contractAddress`と発行数として`1000000 ether`を指定しています。この`ether`というのは`10の18乗`を示しており、100万ether分発行することを表しています。

etherの最小単位`wei`は`10の-18乗`であり、発行数の単位はweiなので気をつけるようにしましょう。

このように

1. トークンの名前
2. トークンのsymbol（ETH等）
3. トークンの初期オーナー
4. 発行枚数

を指定したものをそれぞれコントラクトとして記述しています。

`_mint`関数の中で引数として取っている数字はトークンの発行数です。この値によって次に実装するswap機能を備えた送金機能が動きます。

例えば1ETHに対して10AOAが同等な価値を持っているとすれば、10ETHをスマートコントラクトに送ると100AOAが送金先に届くということです。

このswap機能がうまく働いていることを理解するために、発行数は上記で書いた通り、つまりETHだけ10万x10の18乗で他のトークンは100万x10の18乗にしておくのがいいと思います。

アプリが完成してから発行数を変えてもう一度デプロイしてもいいですね！

### 💥 swap 機能を備えた送金コントラクトを実装しよう

次はメインである` swap 機能`を含んだトークンの送金機能を作成していきます。

実装に入る前に今回のプロジェクトの概要を把握しておきましょう。まず送金者は

（1）送金したいトークン

（2）送金したい量

を決めることができます。

また、受け取り手のトークンの種類を指定することができます。

ここで必要となってくる機能がswap機能です。スマートコントラクトが仲介役となって送金者からトークンを受け取り、それと同等の価値を持った量のトークンを受信者に送るというものです。

これがこのコントラクトの概要となります。では早速実装に移っていきましょう。`Swap.sol`の中身を以下のようにしましょう。

[`Swap.sol`]

```solidity
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

// Import this file to use console.log
import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract SwapContract{
    address public deployerAddress;

    constructor() payable{
        deployerAddress = msg.sender;
    }

    // calculate value between two tokens
    function calculateValue(address tokenSendAddress, address tokenReceiveMesureAddress) public view returns (uint256 value){
        value = (1 ether) * IERC20(tokenSendAddress).balanceOf(address(this)) / ERC20(tokenReceiveMesureAddress).balanceOf(address(this));
    }

    // distribute token to users
    function distributeToken(address tokenAddress, uint256 amount, address recipientAddress) public {
        require(msg.sender == deployerAddress, "Anyone but deployer can distribute token!");
        IERC20 token = IERC20(tokenAddress);
        token.transfer(recipientAddress, amount);
    }

    // swap tokens between two users
    function swap(address sendTokenAddress, address measureTokenAddress, address receiveTokenAddress, uint256 amount, address recipientAddress) public payable{
        IERC20 sendToken = IERC20(sendTokenAddress);
        IERC20 receiveToken = IERC20(receiveTokenAddress);

        uint256 sendTokenValue = calculateValue(sendTokenAddress, measureTokenAddress);
        uint256 receiveTokenValue = calculateValue(receiveTokenAddress, measureTokenAddress);
        uint256 sendAmount = amount * sendTokenValue / (1 ether);
        uint256 receiveAmount = amount * receiveTokenValue / (1 ether);

        require(sendToken.balanceOf(msg.sender) >= sendAmount, "Your asset is smaller than amount you want to send");
        require(receiveToken.balanceOf(address(this)) >= receiveAmount, "Contract asset of the currency recipient want is smaller than amount you want to send");

        sendToken.transferFrom(msg.sender, address(this), sendAmount);
        receiveToken.transfer(recipientAddress, receiveAmount);
    }
}
```

では順番に見ていきましょう。

まず最初にOpenZepplinのERC20規格のライブラリをインポートすることを宣言しています。

```solidity
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
```

次にコントラクトの状態変数を宣言します。

```solidity
address public deployerAddress;
```

`deployerAddress`はこのコントラクトをdeployした人のアドレスが格納されます。このアドレスはトークンの配布などの管理権限がある人のみが行えるような関数を作る時に必要となります。

```solidity
// calculate value between two tokens
    function calculateValue(address tokenSendAddress, address tokenReceiveMesureAddress) public view returns (uint256 value){
        value = (1 ether) * IERC20(tokenSendAddress).balanceOf(address(this)) / ERC20(tokenReceiveMesureAddress).balanceOf(address(this));
    }
```

この関数では2つのトークンの相対的な価値を算出しています。計算方法は単純で、このスマートコントラクトが所持しているトークンの総量のうち、一方を他方のそれで割って価値を決めています。

`value`という変数が算出された価値になるのですが、solidityでは小数点以下は扱うことができないので最初に1 ether（10^18）をかけることで小数点以下が消えることを回避しています。しかし後でこの1ether分掛け合わせる必要があるので覚えておいてください。

```solidity
// distribute token to users
    function distributeToken(address tokenAddress, uint256 amount, address recipientAddress) public {
        require(msg.sender == deployerAddress, "Anyone but depoyer can distribute token!");
        IERC20 token = IERC20(tokenAddress);
        token.transfer(recipientAddress, amount);
    }
```

次にスマートコントラクトが所持しているトークンを配布する関数です。この関数では、関数を呼び出しているアドレスがコントラクトをdeployしたアドレスと一致しているのかを確認した後に指定された量のトークンを送金します。

関数の中で宣言されている`token`は送りたいトークンのアドレスから生成されたコントラクトのことで、tokenはそのトークンの送金や残高照会ができるようになります。

```solidity
// swap tokens between two users
    function swap(address sendTokenAddress, address measureTokenAddress, address receiveTokenAddress, uint256 amount, address recipientAddress) public payable{
        IERC20 sendToken = IERC20(sendTokenAddress);
        IERC20 receiveToken = IERC20(receiveTokenAddress);

        uint256 sendTokenValue = calculateValue(sendTokenAddress, measureTokenAddress);
        uint256 receiveTokenValue = calculateValue(receiveTokenAddress, measureTokenAddress);
        uint256 sendAmount = amount * sendTokenValue / (1 ether);
        uint256 receiveAmount = amount * receiveTokenValue / (1 ether);

        require(sendToken.balanceOf(msg.sender) >= sendAmount, "Your asset is smaller than amount you want to send");
        require(receiveToken.balanceOf(address(this)) >= receiveAmount, "Contract asset of the currency recipient want is smaller than amount you want to send");

        sendToken.transferFrom(msg.sender, address(this), sendAmount);
        receiveToken.transfer(recipientAddress, receiveAmount);
    }
```

最後にswap機能を実装した部分ですが、これは複雑なので丁寧に説明していきます。まず引数としては以下のものをとっています。

```
sendTokenAddress: 送金者が送りたいトークンのアドレス
measureTokenAddress: 送金者が送りたい価値を表すためのトークンのアドレス
receiveTokenAddress: 受領者が受け取りたいトークンのアドレス
recipientAddress: 受領者のウォレットアドレス
amount: measureTokenAddressで決める価値の量
```

次に送金者が送りたいトークンと、受領者が受け取りたいトークンのアドレスからそれぞれコントラクトを呼び出します。

```solidity
IERC20 sendToken = IERC20(sendTokenAddress);
IERC20 receiveToken = IERC20(receiveTokenAddress);
```

次に`calculateValue`関数を用いることで`sendTokenAddress/measureTokenAddress`、`receiveTokenAddress/measureTokenAddress`の両方の相対的な価値を算出します。

```solidity
uint256 sendTokenValue = calculateValue(sendTokenAddress, measureTokenAddress);
uint256 receiveTokenValue = calculateValue(receiveTokenAddress, measureTokenAddress);
```

次に相対的な価値に引数である`amount`を掛け合わせることで送金者が送るトークン量と受領者が受け取るトークン量を算出します。

```solidity
uint256 sendAmount = amount * sendTokenValue / (1 ether);
uint256 receiveAmount = amount * receiveTokenValue / (1 ether);
```

ここで気をつけておかないといけないことは、先ほども言ったように価値を算出するときに1 etherかけているので、1 etherで割って相殺しないといけないということです。

次に送金者、このコントラクトの両方が十分なトークンを保有しているのかを確認しています。

```solidity
require(sendToken.balanceOf(msg.sender) >= sendAmount, "Your asset is smaller than amount you want to send");
require(receiveToken.balanceOf(address(this)) >= receiveAmount, "Contract asset of the currency recipient want is smaller than amount you want to send");
```

最後に送信者、このコントラクトの両方からそれぞれ指定されたトークン量（sendAmount,receiveAmount）をtransferします。

```solidity
sendToken.transferFrom(msg.sender, address(this), sendAmount);
receiveToken.transfer(recipientAddress, receiveAmount);
```

ここで注意しておいてほしいことは、ERC20のもつメソッドの1つである`transferFrom`関数はあらかじめ`approve`関数によって指定されたアドレスに指定された量のトークンを承認しないと使用することができません。

しかしここでapprove関数を使用するとこのコントラクトが承認したことになってしまい、送信者が承認したことにはならなりません。なのでここでは呼ばず、実際に使用する際にこの関数を呼ぶ前に送金者が直接approve関数を呼ぶようにします。

これでswap機能を持った送金コントラクトは完成です。

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

section-1-lesson2の完了おめでとうございます！

これでコントラクトの作成は達成できたので、次のレッスンでコントラクトのテスト、deployをしていきましょう!
