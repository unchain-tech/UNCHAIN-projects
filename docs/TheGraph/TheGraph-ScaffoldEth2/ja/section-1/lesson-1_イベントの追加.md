## イベントの追加

### 🧑🏼‍💻 さらなるイベントの追加・サブグラフの更新 👩🏽‍💻

それでは、コントラクトに変更を加えましょう。新しい関数と、その関数のためのイベントを作成します。

#### ✅ コントラクトにイベントを追加する

> packages/hardhat/contracts の YourContract.sol を開きます。

以下の新しいコード行を追加します。

```solidity
    event SendMessage(address _from, address _to, string message);

    function sendMessage(address _to, string calldata message) external {
        emit SendMessage(msg.sender, _to, message);
    }
```

このイベントと関数はコントラクト内のどこにでも追加できますが、ベストプラクティスは、修飾子やコンストラクタの下に配置することです。

![](/images/TheGraph-ScaffoldEth2/section-1/1_1_1.png)

コントラクトを保存して、新しい変更をデプロイします。

> プロのヒント: --reset フラグを使用すると、ソースの更新に関係なく、常に新しいコントラクトがデプロイされます。

```
yarn deploy --reset
```

以下の出力が表示されるはずです：

![](/images/TheGraph-ScaffoldEth2/section-1/1_1_2.png)

#### ✅ 新しい関数をテストする

http://localhost:3000/debug に移動し、vitalik.ethにメッセージを送信します。

![](/images/TheGraph-ScaffoldEth2/section-1/1_1_3.png)
