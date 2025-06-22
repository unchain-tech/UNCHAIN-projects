---
title: ホワイトリスト機能
---
### 📃 ホワイトリスト機能を持つスマートコントラクトの作成

> このレッスンは少し長くなるかもしれません。

スマートコントラクトに関する基本的な知識は準備できました。`Whitelist.sol`コントラクトを更新してみましょう。更新後のコードはこんな感じです：

```solidity
//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.20;

contract Whitelist {
    // The address that can operate addAddressToWhitelist function
    address public owner;

    // Create a mapping of whitelistedAddresses
    // if an address is whitelisted, we would set it to true, it is false by default for all other addresses.
    mapping(address => bool) private _isWhitelisted;

    //Event: record the addresses added to the whitelist
    event AddToWhitelist(address indexed account);
    //Event: record whitelisted excluded addresses
    event RemoveFromWhitelist(address indexed account);

    // Setting the initial whitelisted addresses
    // Setting the address that can operate addAddressToWhitelist function
    // User will put the value at the time of deployment
    constructor(address[] memory initialAddresses) {
        owner =msg.sender;
        for (uint256 i = 0; i < initialAddresses.length; i++) {
            addToWhitelist(initialAddresses[i]);
        }
    }

    /**
        addToWhitelist - This function adds the address of the sender to the
        whitelist
     */

    function addToWhitelist(address _address) public {
        // Check if the user is the owner
        require(owner == msg.sender, "Caller is not the owner");
        // Check if the user has already been whitelisted
        require(!_isWhitelisted[_address], "Address already whitelisted");
        // Add the address which called the function to the whitelistedAddress array
        _isWhitelisted[_address] = true;
        // Triggers AddToWhitelist event
        emit AddToWhitelist(_address);
    }

    /**
        removeFromWhitelist - This function removes the address of the sender to the
        whitelist
     */

    function removeFromWhitelist(address _address) public {
        // Check if the user is the owner
        require(owner == msg.sender, "Caller is not the owner");
        // Check if the user has not already been whitelisted
        require(_isWhitelisted[_address], "Address not in whitelist");
        // Remove the address which called the function to the whitelistedAddress array
        _isWhitelisted[_address] = false;
        // Triggers RemoveFromWhitelist event
        emit RemoveFromWhitelist(_address);
    }

    /**
        whitelistedAddresses - This function gives feedback on whether the input address belongs to the whitelist
     */

    function whitelistedAddresses(address _address) public view returns (bool) {
        return _isWhitelisted[_address];
    }
}
```

このコードがどのように機能しているのかを順を追って理解しましょう。

```solidity
    // The address that can operate addAddressToWhitelist function
    address public owner;
```

まず、`owner`と呼ばれる状態[変数](https://solidity-by-example.org/variables/)を設定します。この変数は`address`型で、ウォレットアドレス`(例："0xa323A54987cE8F51A648AF2826beb49c368B8bC6")`を指します。この変数の可視性はpublicに設定されており、任意のコントラクトやアカウントからアクセスできるようになります。デフォルトでは`owner`は0に設定されていますが、後でこれを設定します。

```solidity
    // Create a mapping of whitelistedAddresses
    // if an address is whitelisted, we would set it to true, it is false by default for all other addresses.
    mapping(address => bool) private _isWhitelisted;
```

`_isWhitelisted`は、アドレスがホワイトリストに含まれているかどうかを判断するために使用され、[mapping](https://solidity-by-example.org/app/iterable-mapping/)型に設定されています。もしアドレスがホワイトリストに含まれていれば、対応するboolはtrueに設定され、そうでなければfalseに設定されます。デフォルトでは、boolはfalseです（なぜこんなことをするのか？ これにより、配列を使用せずにホワイトリストにあるアドレスを知ることができ、かなりの量のガスを節約できるからです）。

```solidity
    //Event: record the addresses added to the whitelist
    event AddToWhitelist(address indexed account);
    //Event: record whitelisted excluded addresses
    event RemoveFromWhitelist(address indexed account);
```

[Events](https://solidity-by-example.org/events/)は、Ethereumネットワーク上でログを記録することができ、ユーザーがいつでもホワイトリストに追加または削除されたアドレスを追跡することができます。

```solidity
    // Setting the initial whitelisted addresses
    // Setting the address that can operate addAddressToWhitelist function
    // User will put the value at the time of deployment
    constructor(address[] memory initialAddresses) {
        owner = msg.sender;
        for (uint256 i = 0; i < initialAddresses.length; i++) {
            addToWhitelist(initialAddresses[i]);
        }
    }
```

[constructor](https://solidity-by-example.org/constructor/)は、コントラクトのデプロイ時に許可される関数です（注：コンストラクタは必須ではありません）。この場合、コンストラクタはホワイトリストに登録されたアドレスの初期配列を受け取り、[loop](https://solidity-by-example.org/loop/)を使用してaddTowhitelistメソッドを呼び出し、これらのアドレスをホワイトリストに登録します（後で説明するのでご安心を）。同時に、ownerはmsg.sender（この場合、コントラクトのデプロイヤーを表すEVMの特有の[global](https://solidity-by-example.org/variables/)変数）に設定されます。これによって、後で管理する権限の基礎ができあがります。

```solidity
    /**
        addToWhitelist - This function adds the address of the sender to the
        whitelist
     */

    function addToWhitelist(address _address) public {
        // Check if the user is the owner
        require(owner == msg.sender, "Caller is not the owner");
        // Check if the user has already been whitelisted
        require(!_isWhitelisted[_address], "Address already whitelisted");
        // Add the address which called the function to the whitelistedAddress array
        _isWhitelisted[_address] = true;
        // Triggers AddToWhitelist event
        emit AddToWhitelist(_address);
    }
```

`function`キーワードは`addTowhitelist`が関数であることを示しており、`public`可視性指定子はこの関数が任意のアカウントやコントラクトから呼び出されることを示します。

**コール・コントラクト**

最初のrequireは、ownerがmsg.sender（関数の呼び出し元）と等しいかどうかをチェックします。そうでない場合、"Caller is not the owner"というエラーがスローされ、関数の実行は失敗します。これにより、この関数の呼び出しが成功するのはownerのみに制限されます。

2つ目のrequireは、アドレスがすでにホワイトリストに追加されているかどうかをチェックします。もし追加されていれば、関数は"Address already whitelisted"というエラーがスローされ、実行は失敗します。

両方のrequire文を通過した場合、アドレスは`_isWhitelisted`でホワイトリストに追加されます。

そして、イベントがトリガーされ、このアドレスがホワイトリストに追加されたことが記録されます。

この関数は、新しいアドレスをホワイトリストに追加する機能を効果的に実装しています。

```solidity
    /**
        removeFromWhitelist - This function removes the address of the sender to the
        whitelist
     */

    function removeFromWhitelist(address _address) public {
        // Check if the user is the owner
        require(owner == msg.sender, "Caller is not the owner");
        // Check if the user has not already been whitelisted
        require(_isWhitelisted[_address], "Address not in whitelist");
        // Remove the address which called the function to the whitelistedAddress array
        _isWhitelisted[_address] = false;
        // Triggers RemoveFromWhitelist event
        emit RemoveFromWhitelist(_address);
    }
```

この関数の機能は、上記のものと正反対ですが、推論すればこの結論が導き出せると思います。

```solidity
    /**
        whitelistedAddresses - This function gives feedback on whether the input address belongs to the whitelist
     */

    function whitelistedAddresses(address _address) public view returns (bool) {
        return _isWhitelisted[_address];
    }

```

最後に、アドレスがホワイトリストに追加されているかどうかを返す関数が必要です。

[view](https://solidity-by-example.org/view-and-pure-functions/)は、この関数が状態変数の変化を引き起こさないことを意味し、EVMでこの関数を呼び出してもガスは消費されません。"return"は、この関数がbool型の値を返すことを示します。

さて、次にJS VMを使ってこのコントラクトをコンパイルし、デプロイしてみましょう。

![image-20230222180958479](/images/Polygon-Whitelist-NFT/section-1/1_3_1.png)

ここでは、アドレスの配列を入力する必要があります。これは下記のJS VMアカウントから取得できます。必要に応じてアカウントを切り替えてください。

例：`["0x5B38Da6a701c568545dCfcB03FcB875f56beddC4","0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2"]`

![image-20230222180944652](/images/Polygon-Whitelist-NFT/section-1/1_3_2.png)

デプロイが完了したら、コントラクトを呼び出すことができます。テストのためにいくつかのアドレスを入力してみてください。

![image-20230222181353308](/images/Polygon-Whitelist-NFT/section-1/1_3_3.png)

さて、これでホワイトリストのコントラクトは完成しました。次は、NFT（Non-Fungible Token）部分のスマートコントラクト作成モジュールに移ります。

### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discordの`#polygon`で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の4点を記載してください ✨

```
1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット
```

