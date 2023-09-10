### ♻️ 対称鍵を同期しよう

このレッスンでは、対称鍵の同期処理を実装します。同期処理は、3つのケースに応じて行う処理が異なります。

1. ユーザーが初めてログインをしたとき
2. ユーザーが再ログインをしたとき
3. ユーザーが別のデバイスで初めてログインをしたとき

**1. ユーザーが初めてログインをしたとき**

このとき、初めて対称鍵の生成が行われる（init関数を参照）ので、自身のみが対称鍵を持っている状態です。そのため、対称鍵を別のデバイスに同期する必要があります。具体的には以下の3つの処理を行います。

1. バックエンドキャニスターから、公開鍵の一覧を取得する
2. 取得した公開鍵を用いて、自身の所有する対称鍵を暗号化する
3. 暗号化された対称鍵を、暗号化に用いた公開鍵とペアにしてバックエンドキャニスターにアップロードする

上記の処理を行う関数の雛形が、`syncSymmetricKey`という名前で定義されています。順番に処理を実装していき、この関数を完成させましょう！

まずは、バックエンドキャニスターから公開鍵を取得しましょう。syncSymmetricKey関数内`const unsyncedPublicKeys: string[] = [];`の右辺を、下記のように更新します。

```ts
    const unsyncedPublicKeys: string[] =
      await this.actor.getUnsyncedPublicKeys();
```

次に、取得した公開鍵を使って対称鍵を暗号化していきます。この処理は既に実装されているので、コードの確認だけ行いましょう。

受け取った公開鍵を1つずつ使用して、自身の保有する対称鍵を暗号化していきます。バックエンドキャニスターに公開鍵を登録する際、鍵をエクスポートしてbase64に変換したことを覚えていますか？ つまり今受け取った公開鍵は、string型（base64）になっています。このままでは、対称鍵の暗号化に使用できません。もとのCryptoKeyオブジェクトに戻す必要があります。そのため、今度は逆の変換（base64 → バイナリデータ → CryptoKey）を行います。base64からバイナリデータへの変換は`base64ToArrayBuffer`関数が、バイナリデータからCryptoKeyオブジェクトへの変換は[importKey](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/importKey)メソッドが行います。暗号化された対称鍵は、公開鍵と一緒に保存しておきます。

```ts
    // 自身が保有する対称鍵を公開鍵で暗号化します。
    for (const unsyncedPublicKey of unsyncedPublicKeys) {
      const publicKey: CryptoKey = await window.crypto.subtle.importKey(
        'spki',
        this.base64ToArrayBuffer(unsyncedPublicKey),
        {
          name: 'RSA-OAEP',
          hash: 'SHA-256',
        },
        true,
        ['wrapKey'],
      );
      const wrappedSymmetricKeyBase64: string = await this.wrapSymmetricKey(
        symmetricKey,
        publicKey,
      );
      // 公開鍵と暗号化された対称鍵をペアにして保存します。
      encryptedKeys.push([unsyncedPublicKey, wrappedSymmetricKeyBase64]);
    }
```

すべての公開鍵で暗号化の処理が終わったら、バックエンドキャニスターに公開鍵と暗号化された対称鍵のペアをアップロードします。下記のコードをfor文の下に追加しましょう。

```ts
    // `encryptedKeys`をバックエンドキャニスターにアップロードします。
    const result = await this.actor.uploadEncryptedSymmetricKeys(encryptedKeys);
    if ('Err' in result) {
      if ('UnknownPublicKey' in result.Err) {
        throw new Error('Unknown public key');
      }
      if ('DeviceNotRegistered' in result.Err) {
        throw new Error('Device not registered');
      }
    }
```

これで、対称鍵を同期するsyncSymmetricKey関数が完成しました！ それでは、完成したsyncSymmetricKey関数をinit関数から呼び出しましょう。cryptoService.tsファイルのinit関数内、`/** STEP5: 対称鍵を同期します。 */`の部分に下記のコードを記述します。

```ts
      /** STEP5: 対称鍵を同期します。 */
      console.log('Synchronizing symmetric keys...');
      if (this.intervalId === null) {
        this.intervalId = window.setInterval(
          () => this.syncSymmetricKey(),
          5000,
        );
      }
```

では、追加したコードを確認しましょう。syncSymmetricKey関数を`window.setInterval`という関数内で呼び出しました。[setInterval](https://developer.mozilla.org/en-US/docs/Web/API/setInterval)は、一定の時間ごとに指定した関数を実行してくれます。今回は5秒ごとにsyncSymmetricKey関数を実行するように設定しました。setIntervalは、作成されたタイマーを識別する数値であるIDを返します。このIDが既に設定されているときは、条件式を通過しないので重複してタイマーが設定されないようになっています。

```ts
      if (this.intervalId === null) {
        this.intervalId = window.setInterval(
          () => this.syncSymmetricKey(),
          5000,
        );
      }
```

これで、初めてログインをしたときに行う同期処理が完成しました。

**2. ユーザーが再ログインをしたとき**

このとき、既にバックエンドキャニスターには自身の公開鍵で暗号化された対称鍵がアップロードされているはずです。具体的には以下の3つの処理を行います。

1. バックエンドキャニスターから暗号化された対称鍵を取得する
2. 暗号化された対称鍵を復号する
3. 対称鍵を同期する

上記の処理を行う関数の雛形が、`trySyncSymmetricKey`という名前で定義されています。まずはこの関数を完成させましょう！ trySyncSymmetricKey関数を下記のコードで更新しましょう。

```ts
  public async trySyncSymmetricKey(): Promise<boolean> {
    // 対称鍵が同期されているか確認します。
    const syncedSymmetricKey: SynchronizeKeyResult =
      await this.actor.getEncryptedSymmetricKey(this.exportedPublicKeyBase64);
    if ('Err' in syncedSymmetricKey) {
      // エラー処理を行います。
      if ('UnknownPublicKey' in syncedSymmetricKey.Err) {
        throw new Error('Unknown public key');
      }
      if ('DeviceNotRegistered' in syncedSymmetricKey.Err) {
        throw new Error('Device not registered');
      }
      if ('KeyNotSynchronized') {
        console.log('Symmetric key is not synchronized');
        return false;
      }
    } else {
      // 暗号化された対称鍵を取得して復号します。
      this.symmetricKey = await this.unwrapSymmetricKey(
        syncedSymmetricKey.Ok,
        this.privateKey,
      );
      return true;
    }
  }
```

追加したコードを確認しましょう。`getEncryptedSymmetricKey`関数を実行して、自身の公開鍵で暗号化された対称鍵がバックエンドキャニスターにアップロードされているかを確認します。

```ts
    const syncedSymmetricKey: SynchronizeKeyResult =
      await this.actor.getEncryptedSymmetricKey(this.exportedPublicKeyBase64);
```

取得した戻り値を確認して、エラー（'Err'）の場合はその内容を確認してエラー処理を行います。`'KeyNotSynchronized'`が返ってきた時はまだ同期処理ができていないだけなので、エラーをスローせずに`false`を返して終了します。

```ts
      if ('KeyNotSynchronized') {
        console.log('Symmetric key is not synchronized');
        return false;
      }
```

鍵が取得できた場合はその鍵を復号します。

```ts
      // 暗号化された対称鍵を取得して復号します。
      this.symmetricKey = await this.unwrapSymmetricKey(
        syncedSymmetricKey.Ok,
        this.privateKey,
      );
```

最後に、対称鍵を同期する処理を加えます。次のコードを上記のコードの下に追加してください。

```ts
      // 対称鍵が取得できたので、このデバイスでも鍵の同期処理を開始します。
      if (this.intervalId === null) {
        console.log('Try syncing symmetric keys...');
        this.intervalId = window.setInterval(
          () => this.syncSymmetricKey(),
          5000,
        );
      }
```

これで、trySyncSymmetricKey関数は完成です！ 

それでは、init関数からtrySyncSymmetricKey関数を呼び出しましょう。を更新します。下記のコードを、`/** STEP6: 対称鍵を取得します。 */`の部分に記述します。

```ts
      /** STEP6: 対称鍵を取得します。 */
      console.log('Get symmetric key...');
      const synced = await this.trySyncSymmetricKey();

      return synced;
```

これで、再ログインをした場合に行う取得処理が完成しました。

**3. ユーザーが別のデバイスで初めてログインをしたとき**

このとき、他のデバイスが自身の公開鍵を使用して対称鍵を暗号化し、バックエンドキャニスターにアップロードされるまで待つ必要があります。具体的には以下の3つの処理を行います。

1. バックエンドキャニスターに暗号化された対称鍵がアップロードされるのを待つ
2. 暗号化された対称鍵を復号する
3. 対称鍵を同期する

「2. ユーザーが再ログインをしたとき」で実装したtrySyncSymmetricKey関数を思い出してください。`this.actor.getEncryptedSymmetricKey`の戻り値がエラーの時、1つだけエラーをスローするのではなくfalseを返す条件分岐がありました。ユーザーが別のデバイスで初めてログインをしたとき、この条件分岐が実行されます。

```ts
    const syncedSymmetricKey: SynchronizeKeyResult =
      await this.actor.getEncryptedSymmetricKey(this.exportedPublicKeyBase64);
    if ('Err' in syncedSymmetricKey) {
      // エラー処理を行います。
      if ('UnknownPublicKey' in syncedSymmetricKey.Err) {
        throw new Error('Unknown public key');
      }
      if ('DeviceNotRegistered' in syncedSymmetricKey.Err) {
        throw new Error('Device not registered');
      }
      // ===== 期待する結果 =====
      if ('KeyNotSynchronized') {
        console.log('Symmetric key is not synchronized');
        return false;
      }
```

その結果、init関数はfalseを返します。

```ts
      /** STEP6: 対称鍵を取得します。 */
      console.log('Get symmetric key...');
      const synced = await this.trySyncSymmetricKey();

      return synced; // ユーザーが別のデバイスで初めてログインをしたとき`false`が返ります。
```

このinit関数の戻り値をチェックして、`false`の場合には暗号化された対称鍵がアップロードされるのを待つという処理を実装しましょう。`hooks/authContext.ts`の中でinit関数を呼び出している`/** STEP5: デバイスデータの設定を行います。 */`の部分を下記のように更新します。

```ts
    /** STEP5: デバイスデータの設定を行います。 */
    const initialized = await cryptoService.init();
    if (initialized) {
      setAuth({ actor, authClient, cryptoService, status: 'SYNCED' });
    } else {
      setAuth({ status: 'SYNCHRONIZING' });
      // 対称鍵が同期されるまで待機します。
      while (true) {
        // 1秒待機します。
        await new Promise((resolve) => setTimeout(resolve, 1000));
        try {
          console.log('Waiting for key sync...');
          const synced = await cryptoService.trySyncSymmetricKey();
          if (synced) {
            console.log('Key sync completed.');
            setAuth({
              actor,
              authClient,
              cryptoService,
              status: 'SYNCED',
            });
            break;
          }
        } catch (err) {
          throw new Error('Failed to synchronize symmetric key');
        }
      }
    }
```

追加したコードを確認しましょう。

`cryptoService.init()`の戻り値が`true`の場合は対称鍵の同期処理が完了しているので、これまでに取得したデータをステート変数に保存します。このとき、ステータスは`SYNCED`に設定します。

```ts
    if (initialized) {
      setAuth({ actor, authClient, cryptoService, status: 'SYNCED' });
```

一方で、`false`の場合は対称鍵の同期処理が完了するまで待機します。具体的には、trySyncSymmetricKey関数がfalseを返す間、1秒ごとにtrySyncSymmetricKey関数の実行を行います。

```ts
      while (true) {
        // 1秒待機します。
        await new Promise((resolve) => setTimeout(resolve, 1000));
        try {
          console.log('Waiting for key sync...');
          const synced = await cryptoService.trySyncSymmetricKey();
```

trySyncSymmetricKey関数がtrueを返した時、対称鍵の同期が完了したことを意味します。ステート変数に必要な保存して、ステータスは`SYNCED`に設定してループを抜けます。

```ts
          if (synced) {
            console.log('Key sync completed.');
            setAuth({
              actor,
              authClient,
              cryptoService,
              status: 'SYNCED',
            });
            break;
          }
```

`while`文の中で、`trySyncSymmetricKey`関数を呼び出して対称鍵の同期処理を行います。`trySyncSymmetricKey`関数の戻り値が`true`の場合は、対称鍵の同期処理が完了しているので、`setAuth`関数を呼び出して認証状態を更新します。`false`の場合は、`while`文の先頭に戻って対称鍵の同期処理が完了するまで待機します。

これで、ユーザーが別のデバイスで初めてログインをしたときに行う取得処理が完成しました！

✅ 動作確認をしよう

<!-- TODO: 画像を追加 -->

### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discordの`#icp`で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の4点を記載してください ✨

```
1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット
```

---

次のセクションに進み、ノートの暗号化・復号処理を実装しましょう 🎉
