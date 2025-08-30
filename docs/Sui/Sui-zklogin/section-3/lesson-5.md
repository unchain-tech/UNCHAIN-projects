# 3.5 トランザクション実行機能の実装

ログインフローの基礎ができたので、次はいよいよSuiブロックチェーン上で実際にアクションを起こす「トランザクション実行機能」を実装します。

このレッスンでは、`useSui`フックに、SUIトークンを送信するロジックを追加します。

## `useSui`フックの更新

`src/hooks/useSui.ts`ファイルを開き、`useSui`フックに`executeTransaction`関数を追加し、`return`文にも追加してください。

```typescript
// ... (useSuiフックの定義内)

  /**
   * 送金用のトランザクションを実行するメソッド
   */
  const executeTransaction = useCallback(
    async (params: ExecuteTransactionParams) => {
      const {
        ephemeralKeyPair,
        zkProof,
        decodedJwt,
        userSalt,
        zkLoginUserAddress,
        maxEpoch,
        setExecutingTxn,
        setExecuteDigest,
      } = params;

      try {
        if (!ephemeralKeyPair || !zkProof || !decodedJwt || !userSalt) {
          return;
        }

        setExecutingTxn(true);
        const txb = new TransactionBlock();
        // 送金用の額を指定
        const [coin] = txb.splitCoins(txb.gas, [MIST_PER_SUI * 1n]);
        // 検証用のコインオブジェクトを作成
        txb.transferObjects(
          [coin],
          "0x6c1aa061d0495b71eefd97e7d0a1cef0092f5c64d1b751decdc7b5ad0d039c02",
        );
        txb.setSender(zkLoginUserAddress);

        // トランザクションに署名する
        const { bytes, signature: userSignature } = await txb.sign({
          client: suiClient,
          // This must be the same ephemeral key pair used in the ZKP requests
          signer: ephemeralKeyPair,
        });

        if (!decodedJwt?.sub || !decodedJwt.aud) {
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

        enqueueSnackbar(`Execution successful: ${executeRes.digest}`, {
          variant: "success",
        });
        setExecuteDigest(executeRes.digest);
      } catch (error) {
        console.error(error);
        enqueueSnackbar(String(error), {
          variant: "error",
        });
      } finally {
        setExecutingTxn(false);
      }
    },
    [],
  );

  return {
    executeTransaction,
  };

```

### 解説

このコードは、`useSui`フック内に`executeTransaction`という非同期関数を定義しています。この関数がzkLoginを利用したトランザクション実行の心臓部です。

- **`useCallback`**: 関数の再生成を抑制し、パフォーマンスを最適化するために`useCallback`でラップされています。

- **引数`params`**: トランザクションの組み立てと署名に必要な全ての情報（一時鍵ペア、ZK Proof、デコード済みJWT、ユーザーソルトなど）をオブジェクトとして受け取ります。

- **`TransactionBlock`の構築**:
  - `const txb = new TransactionBlock()`: 新しいトランザクションブロックを作成します。
  - `txb.splitCoins`と`txb.transferObjects`: 1 SUIを送信するための命令をトランザクションに追加します。
  - `txb.setSender(zkLoginUserAddress)`: トランザクションの送信者を、zkLoginで導出されたユーザーのアドレスに設定します。

- **署名プロセス**:
  1.  **`txb.sign`**: まず、`ephemeralKeyPair`（一時鍵ペア）を使ってトランザクションに署名します。これにより`userSignature`（ユーザー署名）が得られます。
  2.  **`genAddressSeed`**: ユーザーの`salt`とJWTの`sub`（subject）および`aud`（audience）クレームから`addressSeed`を計算します。これはSuiアドレスの導出に使われたものと同じ計算です。
  3.  **`getZkLoginSignature`**: ZK Proof (`zkProof`)、先ほど計算した`addressSeed`、そして一時鍵による`userSignature`の3つを組み合わせ、最終的なzkLogin署名 (`zkLoginSignature`) を生成します。

- **トランザクションの実行**:
  - `suiClient.executeTransactionBlock`を呼び出し、トランザクションのバイトデータと生成した`zkLoginSignature`をSuiネットワークに送信します。

- **UIフィードバック**:
  - `enqueueSnackbar`を使って、トランザクションの成功または失敗をユーザーにトースト通知で知らせます。
  - `setExecutingTxn(false)`を`finally`ブロックで呼び出し、処理が完了したら必ずローディング状態を解除します。

---

これで、zkLoginで認証したユーザーがSui上でトランザクションを実行するための基本的な流れが完成しました。Section 4では、NFTミント機能の追加など、より高度な実装に進みます。
