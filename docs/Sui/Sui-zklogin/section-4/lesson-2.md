# 4.2 NFTミント機能の実装

基本的な送金機能が実装できたので、次はこのdAppの中核機能である「NFTミント機能」を実装します。ユーザーが自分だけのNFTを発行できるようにする機能です。

実装の流れはトランザクション実行機能の時と似ています。
1.  `useSui`フックに、NFTをミントするロジックを追加します。
2.  トランザクション実行のためのUIコンポーネントを追加します。


## 1. `useSui`フックの更新

`src/hooks/useSui.ts`に、NFTをミントする`executeMintNft`関数を追加します。

```typescript
// ... (useSuiフックの定義内)

  /**
   * NFTをミントするメソッド
   */
  const mintNFT = useCallback(async (params: MintNFTParams) => {
    const {
      ephemeralKeyPair,
      zkProof,
      decodedJwt,
      userSalt,
      zkLoginUserAddress,
      maxEpoch,
      name,
      description,
      imageUrl,
      setExecutingTxn,
      setExecuteDigest,
    } = params;

    try {
      if (!ephemeralKeyPair || !zkProof || !decodedJwt || !userSalt) {
        enqueueSnackbar("必要なパラメータが不足しています", {
          variant: "error",
        });
        return;
      }

      if (!name || !description || !imageUrl) {
        enqueueSnackbar("NFTの名前、説明、画像URLを入力してください", {
          variant: "error",
        });
        return;
      }

      setExecutingTxn(true);
      const txb = new TransactionBlock();

      // NFTをミントする関数を呼び出し
      txb.moveCall({
        target: `${NFT_PACKAGE_ID}::testnet_nft::mint_to_sender`,
        arguments: [
          txb.pure.string(name),
          txb.pure.string(description),
          txb.pure.string(imageUrl),
        ],
      });

      txb.setSender(zkLoginUserAddress);

      // 署名済みトランザクションデータを作成する
      const { bytes, signature: userSignature } = await txb.sign({
        client: suiClient,
        signer: ephemeralKeyPair,
      });

      console.log("Transaction bytes:", bytes);

      if (!decodedJwt?.sub || !decodedJwt.aud) {
        enqueueSnackbar("JWT情報が不正です", {
          variant: "error",
        });
        return;
      }

      // アドレスシードを生成する
      const addressSeed: string = genAddressSeed(
        BigInt(userSalt),
        "sub",
        decodedJwt.sub,
        decodedJwt.aud as string,
      ).toString();

      // ZKLoginを利用したトランザクション署名データを生成する
      const zkLoginSignature: SerializedSignature = getZkLoginSignature({
        inputs: {
          ...zkProof,
          addressSeed,
        },
        maxEpoch,
        userSignature,
      });

      // トランザクションを送信する
      const executeRes = await suiClient.executeTransactionBlock({
        transactionBlock: bytes,
        signature: zkLoginSignature,
      });

      console.log(`NFTミントが成功しました: ${executeRes.digest}`);

      enqueueSnackbar(`NFTミントが成功しました: ${executeRes.digest}`, {
        variant: "success",
      });
      setExecuteDigest(executeRes.digest);

      return executeRes;
    } catch (error) {
      console.error("NFTミントエラー:", error);
      enqueueSnackbar(`NFTミントに失敗しました: ${String(error)}`, {
        variant: "error",
      });
      throw error;
    } finally {
      setExecutingTxn(false);
    }
  }, []);

  return {
    executeTransaction,
    mintNFT, // 追加
  };
```

### 解説

このコードは、`useSui`フック内に`mintNFT`という非同期関数を追加します。この関数は、ユーザーが自分自身のNFTをミント（発行）するためのロジックをカプセル化しています。

- **`useCallback`**: `executeTransaction`と同様に、関数の再生成を防ぐために`useCallback`でラップされています。

- **引数`params`**: 送金時とほぼ同じ引数に加え、NFTのメタデータとなる`name`, `description`, `imageUrl`を受け取ります。

- **`TransactionBlock`の構築**:
  - `txb.moveCall`を使用して、オンチェーンにデプロイされたスマートコントラクトの関数を呼び出します。
  - `target`: `${NFT_PACKAGE_ID}::testnet_nft::mint_to_sender`という形式で、呼び出すパッケージ、モジュール、関数を正確に指定します。
  - `arguments`: スマートコントラクトの関数に渡す引数を配列で指定します。ここでは、NFTの名前、説明、画像URLを`txb.pure.string()`でラップして渡しています。

- **署名と実行プロセス**:
  - `txb.setSender`で送信者を設定した後の一連の署名プロセス（一時鍵での署名、`addressSeed`の生成、`zkLoginSignature`の生成）と、`suiClient.executeTransactionBlock`でのトランザクション実行の流れは、前回のレッスンで実装した`executeTransaction`関数と全く同じです。これにより、zkLoginを利用したあらゆるオンチェーン操作が可能になります。
  
- **`return`文**:
  - `useSui`フックの戻り値オブジェクトに`mintNFT`を追加することで、この関数をUIコンポーネントから呼び出せるようにします。



## 2. `NFTMintButton`と`TransactionExecuteButton`の追加

ここまで実際にトランザクションを実行する2つのメソッドを実行しましたが、UIコンポーネント側にその機能を呼び出すためのボタンがありません。

なので`App.tsx`を以下のように更新してください！

```typescript
import { Box, Container, Grid, Stack } from "@mui/material";
import AccountInformationCard from "./components/AccountInformationCard";
import ActionsCard from "./components/ActionsCard";
import { Header } from "./components/Header";
import { TransactionSuccessAlert } from "./components/TransactionSuccessAlert";
import "./style/App.css";

/**
 * App コンポーネント
 * @returns
 */
function App() {
  return (
    <Box sx={{ bgcolor: "grey.100", minHeight: "100vh" }}>
      <Header />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container justifyContent="center">
          <Grid item xs={12} md={8} lg={6}>
            <Stack spacing={4}>
              <AccountInformationCard />
              <ActionsCard />
            </Stack>
          </Grid>
        </Grid>
      </Container>
      <TransactionSuccessAlert />
    </Box>
  );
}

export default App;
```

### 解説

`<AccountInformationCard />`と`<ActionsCard />`というあらかじめ用意してあった2つのコンポーネントを追加しました。

それぞれ

`<AccountInformationCard />`はSUIやNFTの残高を表示するコンポーネント

`<ActionsCard />`は送金処理やNFTミントボタンのためのコンポーネント

となります。

各コンポーネントの中身について解説します。

- `<AccountInformationCard />`

  ```ts
  import { Card, CardContent, Stack, Typography } from "@mui/material";
  import { useGlobalContext } from "../hooks/useGlobalContext";
  import { useGetBalance } from "../hooks/useSui";
  import { NFTBalance, ShowBalance } from "./Balance";
  import { FaucetLinkButton } from "./FaucetLinkButton";

  /**
   * AccountInformationCard コンポーネント
   */
  const AccountInformationCard = () => {
    const { zkLoginUserAddress } = useGlobalContext();
    const { addressBalance } = useGetBalance(zkLoginUserAddress);

    return (
      <>
        {zkLoginUserAddress && (
          <Card elevation={3}>
            <CardContent>
              <Stack spacing={2}>
                <Typography variant="h5" component="div">
                  Account
                </Typography>
                {/* SUIの残高を表示するコンポーネント */}
                <ShowBalance
                  zkLoginUserAddress={zkLoginUserAddress}
                  addressBalance={addressBalance}
                />
                {/* NFTの残高を表示するコンポーネント */}
                <NFTBalance zkLoginUserAddress={zkLoginUserAddress} />
                <FaucetLinkButton />
              </Stack>
            </CardContent>
          </Card>
        )}
      </>
    );
  };

  export default AccountInformationCard;
  ```

- `<ActionsCard />`

  ```ts
  import { Card, CardContent, Stack, Typography } from "@mui/material";
  import { useGlobalContext } from "./../hooks/useGlobalContext";
  import { useSui } from "./../hooks/useSui";
  import { useZKLogin } from "./../hooks/useZKLogin";
  import { GoogleLoginButton } from "./GoogleLoginButton";
  import { NFTMintButton } from "./NFTMintButton";
  import { TransactionExecuteButton } from "./TransactionExecuteButton";

  /**
   * ActionsCard コンポーネント
   */
  const ActionsCard = () => {
    const {
      zkLoginUserAddress,
      decodedJwt,
      ephemeralKeyPair,
      userSalt,
      zkProof,
      maxEpoch,
      executingTxn,
      setExecutingTxn,
      setExecuteDigest,
    } = useGlobalContext();

    const { executeTransaction, mintNFT } = useSui();
    const { startLogin } = useZKLogin();

    return (
      <Card elevation={3}>
        <CardContent>
          <Stack spacing={2}>
            <Typography variant="h5" component="div">
              Actions
            </Typography>
            {!zkLoginUserAddress ? (
              <GoogleLoginButton login={startLogin} />
            ) : (
              <>
                {/* 送金処理のトランザクションを実行するコンポーネント */}
                <TransactionExecuteButton
                  executingTxn={executingTxn}
                  decodedJwt={decodedJwt}
                  ephemeralKeyPair={ephemeralKeyPair}
                  zkProof={zkProof}
                  userSalt={userSalt}
                  zkLoginUserAddress={zkLoginUserAddress}
                  maxEpoch={maxEpoch}
                  executeTransaction={executeTransaction}
                  setExecutingTxn={setExecutingTxn}
                  setExecuteDigest={setExecuteDigest}
                />
                {/* NFTミントのトランザクションを実行するコンポーネント */}
                <NFTMintButton
                  executingTxn={executingTxn}
                  decodedJwt={decodedJwt}
                  ephemeralKeyPair={ephemeralKeyPair}
                  zkProof={zkProof}
                  userSalt={userSalt}
                  zkLoginUserAddress={zkLoginUserAddress}
                  maxEpoch={maxEpoch}
                  mintNFT={mintNFT}
                  setExecutingTxn={setExecutingTxn}
                  setExecuteDigest={setExecuteDigest}
                />
              </>
            )}
          </Stack>
        </CardContent>
      </Card>
    );
  };

  export default ActionsCard;
  ```

---

これでNFTミント機能が完成しました。最後のレッスンでは、`GlobalProvider`に残された認証完了後の処理や、zkProofの取得といった高度なロジックを実装し、アプリケーションを完成させます。
