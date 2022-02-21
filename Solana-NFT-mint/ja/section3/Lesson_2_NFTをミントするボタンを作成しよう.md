ボタンをクリックしたときに1つのNFTをmintできる機能を実装します。

###  🎩`mintToken`関数を実装します。

`CandyMachine`コンポーネントには、` mintToken`という名前の関数があります。これはMetaplexのフロントエンドライブラリの一部です。

この関数はかなり複雑なため、ここでは詳細な説明は省きますが、一度コードを読んでみてください。おすすめとして、commandキー（MacOS）やCTRLキー（Windows）を使って関数をクリックし、その関数がどのように動作するか確認してみてください。

ではざっくりとチャンクごとにコードを見ていきます。

```jsx
const mint = web3.Keypair.generate();

const userTokenAccountAddress = (
  await getAtaForMint(mint.publicKey, walletAddress.publicKey)
)[0];
```

ここでは、NFTのアカウントを作成しています。Solanaではプログラムで状態を保持しません。コントラクトで状態を保持するEthereumとは大きく異なります。の詳細はこちら[こちら](https://docs.solana.com/developing/programming-model/accounts)をご覧ください。

```jsx
const userPayingAccountAddress = candyMachine.state.tokenMint
  ? (await getAtaForMint(candyMachine.state.tokenMint, walletAddress.publicKey))[0]
  : walletAddress.publicKey;

const candyMachineAddress = candyMachine.id;
const remainingAccounts = [];
const signers = [mint];
```

Candy MachineがNFTを作成するために必要なすべてのパラメーターです。`userPayingAccountAddress`(NFT費用を支払い、受け取りを行う人)から、作成するNFTのアカウントアドレスである` mint`(mintするNFTアカウントアドレス)まですべて必要です。

```jsx
const instructions = [
  web3.SystemProgram.createAccount({
    fromPubkey: walletAddress.publicKey,
    newAccountPubkey: mint.publicKey,
    space: MintLayout.span,
    lamports:
      await candyMachine.program.provider.connection.getMinimumBalanceForRentExemption(
        MintLayout.span,
      ),
    programId: TOKEN_PROGRAM_ID,
  }),
  Token.createInitMintInstruction(
    TOKEN_PROGRAM_ID,
    mint.publicKey,
    0,
    walletAddress.publicKey,
    walletAddress.publicKey,
  ),
  createAssociatedTokenAccountInstruction(
    userTokenAccountAddress,
    walletAddress.publicKey,
    walletAddress.publicKey,
    mint.publicKey,
  ),
  Token.createMintToInstruction(
    TOKEN_PROGRAM_ID,
    mint.publicKey,
    userTokenAccountAddress,
    walletAddress.publicKey,
    [],
    1,
  ),
];
```

Solanaでは、トランザクションの中に命令をひとまとめにしています。ここではいくつかの命令をまとめていますが、私たちが作成したCandy Machineに存在する関数であり、Metaplexの標準関数です。
そのため、1から関数を書く必要はありません。

```jsx
    if (candyMachine.state.gatekeeper) {
    }

    if (candyMachine.state.whitelistMintSettings) {
    }

    if (candyMachine.state.tokenMint) {
    }
```
ここでは、キャンディマシンがボットを防ぐためにキャプチャーを使用しているかどうか（`gatekeeper`）、ホワイトリストが設定されているかどうか、ミントがトークンゲートであるかどうかをチェックしています。これらはユーザーのアカウントごとにパスすべきチェック項目が異なります。if文を抜けると次の処理に進みます。

```jsx
const metadataAddress = await getMetadata(mint.publicKey);
const masterEdition = await getMasterEdition(mint.publicKey);

const [candyMachineCreator, creatorBump] = await getCandyMachineCreator(
  candyMachineAddress,
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
  }),
);
```
最後に、すべてのチェックを通過した後、実際にNFTをミントするための命令を行います。

```jsx
  try {
    return (
      await sendTransactions(
        candyMachine.program.provider.connection,
        candyMachine.program.provider.wallet,
        [instructions, cleanupInstructions],
        [signers, []],
      )
    ).txs.map(t => t.txid);
  } catch (e) {
    console.log(e);
  }
```
プロバイダー、ウォレット、すべての命令を用いて、ブロックチェーンと対話する関数である`sendTransactions`を呼び出します。私たちが実際にキャンディマシンを叩き、NFTをミントするように指示する、おまじないコードです。

ざっくりとした説明は以上です。できる限り自分で読み解いてみてくださいね。メンバーと一緒に読み合わせするのもいいかもしれません。また、誰かがこのコードを素敵なnpmモジュールにしてくれることを夢見ています...。

###  ✨NFTをミントします！

`CandyMachine`コンポーネントで、" Mint "ボタンをクリックしたときに` mintToken`関数を呼び出すよう設定します。`index.js`を下記の通り修正してください。

```jsx
return (
    // Only show this if machineStats is available
    machineStats && (
      <div className="machine-container">
        <p>{`Drop Date: ${machineStats.goLiveDateTimeString}`}</p>
        <p>{`Items Minted: ${machineStats.itemsRedeemed} / ${machineStats.itemsAvailable}`}</p>
        <button className="cta-button mint-button" onClick={mintToken}>
            Mint NFT
        </button>
      </div>
    )
  );
```

[Mint NFT]をクリックする前に、PhantomWalletにDevnetSOLがあることを確認する必要があります。これはとても簡単です。

まず、ファントムウォレットのパブリックアドレスを取得します。

![無題](/public/images/Solana-NFT-mint/section3/3_2_1.png)

次に、Devnetでトークンを得るためにターミナルで次のコマンドを実行します。

```txt
solana airdrop 2 INSERT_YOUR_PHANTOM_WALLET_ADDRESS
```

[Mint NFT]をクリックすると、次のようなポップアップが表示されます。

![無題](/public/images/Solana-NFT-mint/section3/3_2_2.png)

[承認]をクリックして取引手数料を支払うと、キャンディーマシンにNFTを作成するように指示されます。

ログを確認するために、ブラウザのコンソールを開いたままにしておきましょう。3〜10秒ほどかかります。

NFTが正常にミントすると、コンソールに次のようなものが表示されます。

![無題](/public/images/Solana-NFT-mint/section3/3_2_3.png)

NFTに**成功**しました。

ファントムウォレットを開き、[]セクションに表示されるかどうかを確認します。

![無題](/public/images/Solana-NFT-mint/section3/3_2_4.png)


