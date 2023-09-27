### 🎩 `mintToken`関数を実装する

[Mint NFT]ボタンが押されたときに実行するミント機能を実装していきましょう。

Solanaではプログラムで状態を保持しません。コントラクトで状態を保持するEthereumとは大きく異なります。詳細は [こちら](https://docs.solana.com/developing/programming-model/accounts) をご覧ください。

Solanaでは、トランザクションの中に命令をひとまとめにしています。Metaplexは、トランザクションを作成するためのメソッドをモジュールとして提供しており、既に複数のメソッドが`CandyMachine/index.tsx`にインポートされています。それらの機能を確認しながら、ミントを行うためのトランザクションを作成していきましょう。

前回のレッスンで登場した`Umi`ライブラリは、トランザクションの構築を容易にするためのクラス[`TransactionBuilder`](https://umi-docs.vercel.app/classes/umi.TransactionBuilder.html)を提供しています。ここでは、このクラスを用いてトランザクションを構築していきたいと思います。

TransactionBuilderクラスには`add`というメソッドがあり、これにより命令をトランザクションに追加することができます。

```javascript
const transaction = transactionBuilder()
  .add(/* トランザクションに追加したい命令 */)
  .add(/* ... */)
  .add(/* ... */)
```

ここで追加する命令は2つあります。1つはミントの実行、もう1つは計算ユニット（Compute unit）の上限設定です。

Solanaは現在、計算ユニットのデフォルト値を200k（200,000）と設定しています（[参照](https://docs.solana.com/developing/programming-model/runtime#prioritization-fees)）。しかし、NFTのミントのような複雑なトランザクションでは許容されたリソースを超えてしまう可能性があります。試しに計算ユニットの上限設定を行わずにミントを実行すると、下記のようなエラーが発生すると思います。後ほど試してみてください。

**[Phantom Walletの表示]**

![無題](/public/images/Solana-NFT-Drop/section-3/3_2_4.png)

**[Approve後のコンソール出力]**

```
Error: failed to send transaction: Transaction simulation failed: Error processing Instruction 0: Computational budget exceeded
```

それでは、計算ユニットの上限設定を行いましょう。Metaplexの[公式ドキュメント](https://docs.metaplex.com/programs/candy-machine/minting)でミント機能の実装を確認すると、`setComputeUnitLimit`というメソッドが使用されています。こちらは`mpl-essentials`ライブラリが提供するメソッドです。

今回は`600_000`と設定したいと思います。

```javascript
const transaction = transactionBuilder()
        .add(setComputeUnitLimit(umi, { units: 600_000 }))
```

続いて、ミントの実行を追加しましょう。再度Metaplexの公式ドキュメントを確認してみると、[`mintV2`](https://mpl-candy-machine-js-docs.vercel.app/functions/mintV2.html)というメソッドが使用されています。`mpl-candy-machine`ライブラリが提供するメソッドで、Candy Machineのデータを用いてミントを行います。

mintV2メソッドの引数を確認すると、`MintV2InstructionAccounts`というオブジェクトを受け取ることがわかります。オブジェクトの中にはたくさんのプロパティが定義されていますが、ここでは必須のものとCandy Guardの設定を指定したいと思います。

```javascript
const transaction = transactionBuilder()
        .add(setComputeUnitLimit(umi, { units: 600_000 }))
        .add(
          mintV2(umi, {
            candyGuard: candyGuard.publicKey,
            candyMachine: candyMachine.publicKey,
            collectionMint: candyMachine.collectionMint,
            collectionUpdateAuthority: candyMachine.authority,
            mintArgs: {
              solPayment: some({ destination: destination }),
            },
            nftMint: nftSigner,
          }),
        );
```

`solPayment`は、Candy GuardにNFTの価格とその受け取るアドレスを設定した場合に必須の設定となります。

これで、トランザクションをどのように構築するか確認ができました。次に、トランザクションの送信方法を確認してみましょう。

再度[`TransactionBuilder`](https://umi-docs.vercel.app/classes/umi.TransactionBuilder.html)クラスのメソッドを見てみます。すると、`sendAndConfirm`というメソッドが提供されていることが確認できます。このメソッドを使ってトランザクションの送信と結果の確認を行うのが良さそうです。

```javascript
await transaction.sendAndConfirm(umi).then((response) => {
  const transactionResult = response.result.value;
  if (transactionResult.err) {
    throw new Error(`Failed mint: ${transactionResult.err}`);
  }
})
```

戻り値の定義を見てみると、Promiseで2つの値が返ってくることがわかります。そのうち`result`の方を確認してみると、トランザクションで何かしらエラーが発生した場合は`string`型のデータが返ってくるようです。そのため、sendAndConfirmメソッドの戻り値を取得してエラーチェックを行うようにします。

それでは、ここまでの情報をもとに実際に`mintToken`関数を実装していきましょう。下記のコードを`getCandyMachineState`関数の下に追加すると良いでしょう。

```jsx
// CandyMachine/index.tsx
const mintToken = async (
  candyMachine: CandyMachineType,
  candyGuard: CandyGuardType,
) => {
  try {
    if (umi === undefined) {
      throw new Error('Umi context was not initialized.');
    }
    if (candyGuard.guards.solPayment.__option === 'None') {
      throw new Error('Destination of solPayment is not set.');
    }

    const nftSigner = generateSigner(umi);
    const destination = candyGuard.guards.solPayment.value.destination;

    // トランザクションの構築を行います。
    const transaction = transactionBuilder()
      .add(setComputeUnitLimit(umi, { units: 600_000 }))
      .add(
        mintV2(umi, {
          candyGuard: candyGuard.publicKey,
          candyMachine: candyMachine.publicKey,
          collectionMint: candyMachine.collectionMint,
          collectionUpdateAuthority: candyMachine.authority,
          mintArgs: {
            solPayment: some({ destination: destination }),
          },
          nftMint: nftSigner,
        }),
      );

    // トランザクションを送信して、ネットワークによる確認を待ちます。
    await transaction.sendAndConfirm(umi).then((response) => {
      const transactionResult = response.result.value;
      if (transactionResult.err) {
        console.error(`Failed mint: ${transactionResult.err}`);
      }
    })
  } catch (error) {
    console.error(error);
  }
};
```

`try`文の最初に、ステート変数に値が保存されていることを確認します。値が保存されていない場合は、ミントが実行できないのでエラーとして処理をします。

ここで、mintToken関数を少し更新して関数の実行が終わるまで[Mint NFT]ボタンを押せないようにしたいと思います。`button`タグに`disable`属性を指定することで解決しましょう。関数の実行中は`true`、そうでない場合は`false`として実行中かどうかをステートで管理し、その値をdisable属性に渡しましょう。

まずは、Booleanを保持するステートを定義します。これまでに定義してきたステートの下に追加しましょう。

```jsx
// CandyMachine/index.tsx
const CandyMachine = (props: CandyMachineProps) => {

  // mintToken関数が実行中かどうかを管理するステートを追加する。
  const [isMinting, setIsMinting] = useState(false);
```

次に、mintToken関数の最初と最後に`setIsMinting`を呼んで実行中かどうかを設定します。try-catch文の最後に`finally`を追加しましょう。正常に処理が進んだ場合とエラーが発生してcatch文に進んでしまった場合、どちらの場合でも`setIsMinting(false)`が実行されるようにします。

```jsx
const mintToken = async (
  candyMachine: CandyMachineType,
  candyGuard: CandyGuardType,
) => {
  // 関数実行中なので`true`を設定します。
  setIsMinting(true);
  try {

  } catch (error) {
      console.error(error);
  } finally {
    // 関数が終了するので`false`を設定します。
    setIsMinting(false);
  }
};
```

### ✨ NFT をミントしよう!

`CandyMachine`コンポーネントで、[Mint NFT]ボタンをクリックしたときに`mintToken`関数を呼び出すよう設定します。return文を下記の通り修正してください。

```jsx
// CandyMachine/index.tsx
return candyMachine && candyGuard ? (
  <div className={candyMachineStyles.machineContainer}>
    <p>{`Drop Date: ${startDateString}`}</p>
    <p>
      {`Items Minted: ${candyMachine.itemsRedeemed} / ${candyMachine.data.itemsAvailable}`}
    </p>
    <button
      className={`${styles.ctaButton} ${styles.mintButton}`}
      onClick={() => mintToken(candyMachine, candyGuard)}
      disabled={isMinting}
    >
      Mint NFT
    </button>
  </div>
) : null;
```

`Mint NFT`をクリックする前に、PhantomWalletにDevnetSOLがあることを確認する必要があります。これはとても簡単です。

まず、Phantom Walletのパブリックアドレスを取得します。

![無題](/public/images/Solana-NFT-Drop/section-3/3_2_1.png)

次に、Devnetでトークンを得るためにターミナルで次のコマンドを実行します。

```txt
solana airdrop 2 INSERT_YOUR_PHANTOM_WALLET_ADDRESS
```

トークンが取得できたら、ブラウザを操作してみましょう。`Mint NFT`をクリックすると、次のようなポップアップが表示されます。

![無題](/public/images/Solana-NFT-Drop/section-3/3_2_2.png)

[承認]をクリックして取引手数料を支払うと、Candy MachineにNFTを作成するように指示されます。

NFTが正常にミントされると、アプリケーションに表示されている`Items Minted`の数が更新されます。また、この値はコンソールのログ出力からも確認できるでしょう。

Phantom Walletを開き、所有NFT一覧に表示されるかどうかを確認します。

Phantom Walletの左から2つ目のタブに切り替えてみましょう 👀

![無題](/public/images/Solana-NFT-Drop/section-3/3_2_3.png)

### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discordの`#solana`で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の3点を記載してください ✨

```
1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット
```

---

おめでとうございます!　セクション3は終了です!

ぜひ、あなたのNFT画像をコミュニティに投稿してください!

あなたのNFTが気になります ✨

次のレッスンに進んで、ほかの機能をWebアプリケーションに実装していきましょう 🎉
