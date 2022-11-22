### 🎩 `mintToken`関数を実装する

`CandyMachine`コンポーネントには、`mintToken`という名前の関数があります。これはMetaplexのフロントエンドライブラリの一部です。

この関数はかなり複雑なため、ここでは詳細な説明は省きますが、一度コードを読んでみてください。

お勧めとして、commandキー（macOS）やCTRLキー（Windows）を使って関数をクリックし、その関数がどのように動作するか確認してみてください。

ではざっくりとチャンクごとにコードを見ていきます。

```jsx
const mint = web3.Keypair.generate();

const userTokenAccountAddress = (
  await getAtaForMint(mint.publicKey, walletAddress.publicKey)
)[0];
```

ここでは、NFTのアカウントを作成しています。

Solanaではプログラムで状態を保持しません。

コントラクトで状態を保持するEthereumとは大きく異なります。詳細は [こちら](https://docs.solana.com/developing/programming-model/accounts) をご覧ください。

> ✍️: `Cannot read properties of undefined`エラーが発生した場合
>
> 下記のコードを`const mint = web3.Keypair.generate();`の直下に追加してみてください。
>
> ```
> if (!mint || !candyMachine?.state) return;
> ```
>
> これにより`mint`や`candyMachine`が未定義の場合でも、問題なくコードが走ります。

```jsx
const userPayingAccountAddress = candyMachine.state.tokenMint
  ? (
      await getAtaForMint(candyMachine.state.tokenMint, walletAddress.publicKey)
    )[0]
  : walletAddress.publicKey;

const candyMachineAddress = candyMachine.id;
const remainingAccounts = [];
const signers = [mint];
```

Candy MachineがNFTを作成するために必要なすべてのパラメータです。

`userPayingAccountAddress`（NFT費用を支払い、受け取りを行う人）から、作成するNFTのアカウントアドレスである`mint`（mintするNFTアカウントアドレス）まですべて必要です。

```jsx
const instructions = [
  web3.SystemProgram.createAccount({
    fromPubkey: walletAddress.publicKey,
    newAccountPubkey: mint.publicKey,
    space: MintLayout.span,
    lamports:
      await candyMachine.program.provider.connection.getMinimumBalanceForRentExemption(
        MintLayout.span
      ),
    programId: TOKEN_PROGRAM_ID,
  }),
  Token.createInitMintInstruction(
    TOKEN_PROGRAM_ID,
    mint.publicKey,
    0,
    walletAddress.publicKey,
    walletAddress.publicKey
  ),
  createAssociatedTokenAccountInstruction(
    userTokenAccountAddress,
    walletAddress.publicKey,
    walletAddress.publicKey,
    mint.publicKey
  ),
  Token.createMintToInstruction(
    TOKEN_PROGRAM_ID,
    mint.publicKey,
    userTokenAccountAddress,
    walletAddress.publicKey,
    [],
    1
  ),
];
```

Solanaでは、トランザクションの中に命令をひとまとめにしています。ここではいくつかの命令をまとめていますが、私たちが作成したCandy Machineに存在する関数であり、Metaplexの標準関数です。
そのため、ゼロから関数を書く必要はありません。

```jsx
if (candyMachine.state.gatekeeper) {
}

if (candyMachine.state.whitelistMintSettings) {
}

if (candyMachine.state.tokenMint) {
}
```

ここでは、キャンディマシンがbotを防ぐためにキャプチャーを使用しているかどうか(`gatekeeper`)、ホワイトリストが設定されているかどうか、ミントがトークンゲートであるかどうかをチェックしています。

これらはユーザーのアカウントごとにパスすべきチェック項目が異なります。if文を抜けると次の処理に進みます。

```jsx
const metadataAddress = await getMetadata(mint.publicKey);
const masterEdition = await getMasterEdition(mint.publicKey);

const [candyMachineCreator, creatorBump] = await getCandyMachineCreator(
  candyMachineAddress
);

instructions.push(
  await candyMachine.program.instruction.mintNft(creatorBump, {
    accounts: {
      candyMachine: candyMachineAddress,
      candyMachineCreator,
      payer: walletAddress.publicKey,
      wallet: candyMachine.state.treasury,
      mint: mint.publicKey,
      metadata: metadataAddress,
      masterEdition,
      mintAuthority: walletAddress.publicKey,
      updateAuthority: walletAddress.publicKey,
      tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
      tokenProgram: TOKEN_PROGRAM_ID,
      systemProgram: SystemProgram.programId,
      rent: web3.SYSVAR_RENT_PUBKEY,
      clock: web3.SYSVAR_CLOCK_PUBKEY,
      recentBlockhashes: web3.SYSVAR_RECENT_BLOCKHASHES_PUBKEY,
      instructionSysvarAccount: web3.SYSVAR_INSTRUCTIONS_PUBKEY,
    },
    remainingAccounts:
      remainingAccounts.length > 0 ? remainingAccounts : undefined,
  })
);
```

最後に、すべてのチェックを通過した後、実際にNFTをミントするための命令をします。

```jsx
try {
  return (
    await sendTransactions(
      candyMachine.program.provider.connection,
      candyMachine.program.provider.wallet,
      [instructions, cleanupInstructions],
      [signers, []]
    )
  ).txs.map((t) => t.txid);
} catch (e) {
  console.log(e);
}
```

プロバイダ、ウォレット、すべての命令を用いて、ブロックチェーンと対話する関数である`sendTransactions`を呼び出します。

私たちが実際にキャンディマシンをたたき、NFTをミントするように指示する、おまじないコードです。

ざっくりとした説明は以上です。できる限り自分で読み解いてみてくださいね。メンバーと一緒に読み合わせするのもよいでしょう。また、誰かがこのコードを素敵な`npm`モジュールにしてくれることを夢見ています...。

### ✨ NFT をミントしよう!

`CandyMachine`コンポーネントで、"Mint" ボタンをクリックしたときに`mintToken`関数を呼び出すよう設定します。`index.js`を下記の通り修正してください。

```jsx
// index.js
return (
  // candyMachineが利用可能な場合のみ表示されます
  candyMachine && candyMachine.state ? (
      <div className="machine-container">
        <p>{`Drop Date: ${candyMachine.state.goLiveDateTimeString}`}</p>
        <p>{`Items Minted: ${candyMachine.state.itemsRedeemed} / ${candyMachine.state.itemsAvailable}`}</p>
        <button className="cta-button mint-button" onClick={mintToken}>
            Mint NFT
        </button>
      </div>
    ) : null
  );
```

`Mint NFT`をクリックする前に、PhantomWalletにDevnetSOLがあることを確認する必要があります。これはとても簡単です。

まず、Phantom Walletのパブリックアドレスを取得します。

![無題](/public/images/Solana-NFT-Drop/section-3/3_2_1.png)

次に、Devnetでトークンを得るためにターミナルで次のコマンドを実行します。

```txt
solana airdrop 2 INSERT_YOUR_PHANTOM_WALLET_ADDRESS
```

`Mint NFT`をクリックすると、次のようなポップアップが表示されます。

![無題](/public/images/Solana-NFT-Drop/section-3/3_2_2.png)

[承認]をクリックして取引手数料を支払うと、キャンディーマシンにNFTを作成するように指示されます。

ログを確認するために、ブラウザのコンソールを開いたままにしておきましょう。3〜10秒ほどかかります。

NFTが正常にミントすると、コンソールに次のようなものが表示されます。

![無題](/public/images/Solana-NFT-Drop/section-3/3_2_3.png)

NFTをmintできました!

Phantom Walletを開き、`[]`セクションに表示されるかどうかを確認します。

Phantom Walletの左から2つ目のタブに切り替えてみましょう 👀

![無題](/public/images/Solana-NFT-Drop/section-3/3_2_4.png)

### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discordの`#solana-nft-drop`で質問をしてください。

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
