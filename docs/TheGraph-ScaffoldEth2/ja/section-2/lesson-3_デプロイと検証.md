## デプロイと検証

### ✅ デプロイ！

これで、私たちは選択したテストネットにデプロイできます... この例では、sepoliaにデプロイします。

```
yarn deploy --network sepolia
```

![](/public/images/TheGraph-ScaffoldEth2/section-2/2_3_1.png)

問題がなければ、以下のような成功の出力が表示されるはずです。

```
deploying "YourContract" (tx: 0xf404021d736271a7a0a84d124ed35250c533efe37c1775367b6510a8836bf0bd)...: deployed at 0x541D469C06990B7F0bd5103b57997cE8a39C050c with 605281 gas
📝 Updated TypeScript contract definition file on ../nextjs/generated/deployedContracts.ts
```

#### ✅ 検証

```
yarn verify --network sepolia
```

![](/public/images/TheGraph-ScaffoldEth2/section-2/2_3_2.png)

以下のような成功の出力が表示されるはずです...

```
verifying YourContract (0x541D469C06990B7F0bd5103b57997cE8a39C050c) ...
waiting for result...
 => contract YourContract is now verified
```

また、etherscanでコントラクトが正常にデプロイされたことも確認できます。[こちら](https://sepolia.etherscan.io/address/0x541D469C06990B7F0bd5103b57997cE8a39C050c#code)は私がデプロイして検証したものです。
