### ♻️ 対称鍵を同期しよう

このレッスンでは、対称鍵の同期処理を実装します。同期処理は、3つのケースに応じて行う処理が異なります。

1. ユーザーが初めてログインをしたとき
2. ユーザーが再ログインをしたとき
3. ユーザーが別のデバイスで初めてログインをしたとき

**1. ユーザーが初めてログインをしたとき**

このとき、初めて対称鍵の生成が行われる（init関数を参照）ので、自身のみが対称鍵を持っている状態です。そのため、新たなデバイスが追加されたときは対称鍵をそのデバイスに同期してあげる必要があります。具体的には以下の3つの処理を行います。

1. バックエンドキャニスターから、公開鍵の一覧を取得する
2. 取得した公開鍵を用いて、自身の所有する対称鍵を暗号化する
3. 暗号化された対称鍵を、暗号化に用いた公開鍵とペアにしてバックエンドキャニスターにアップロードする

上記の処理を行う関数の雛形が、cryptoService.ts内に`syncSymmetricKey`という名前で定義されています。順番に処理を実装していき、この関数を完成させましょう！

まずは、バックエンドキャニスターから公開鍵を取得しましょう。syncSymmetricKey関数内`const unsyncedPublicKeys: string[] = [];`の右辺を、下記のように更新します。

```ts
    // 暗号化された対称鍵を持たない公開鍵一覧を取得します。
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
    // 公開鍵と暗号化された対称鍵のペアをアップロードします。
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

これで、対称鍵を同期するsyncSymmetricKey関数が完成しました！ それでは、完成したsyncSymmetricKey関数をinit関数から呼び出しましょう。init関数内、`/** STEP10: 対称鍵を同期します。 */`の部分に下記のコードを記述します。

```ts
      /** STEP10: 対称鍵を同期します。 */
      console.log('Synchronizing symmetric keys...');
      if (this.intervalId === null) {
        this.intervalId = window.setInterval(
          () => this.syncSymmetricKey(),
          5000,
        );
      }
```

では、追加したコードを確認しましょう。syncSymmetricKey関数を`window.setInterval`という関数内で呼び出しました。セクション2でも登場しましたが、[setInterval](https://developer.mozilla.org/en-US/docs/Web/API/setInterval)は一定の時間ごとに指定した関数を実行してくれます。今回は5秒ごとにsyncSymmetricKey関数を実行するように設定しました。setIntervalは、作成されたタイマーを識別する数値であるIDを返します。このIDが既に設定されているときは、条件式を通過しないので重複してタイマーが設定されないようになっています。

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

上記の処理を行う関数の雛形が、`trySyncSymmetricKey`という名前で定義されています。まずはこの関数を完成させましょう！

最初に、インタフェースで定義した型をインポートします。

```ts
import {
  _SERVICE,
  Result_1,
  Result,
} from '../../../declarations/encrypted_notes_backend/encrypted_notes_backend.did';
```

次に、trySyncSymmetricKey関数を下記のコードで更新しましょう。

```ts
  public async trySyncSymmetricKey(): Promise<boolean> {
    // 対称鍵が同期されているか確認します。
    const syncedSymmetricKey: Result =
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
    const syncedSymmetricKey: Result =
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

最後に、対称鍵を同期する処理を加えます。次のコードを上記のコードの下、`return true;`の上に追加してください。

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

それでは、init関数からtrySyncSymmetricKey関数を呼び出しましょう。下記のコードを、`/** STEP11: 対称鍵を取得します。 */`の部分に記述します。

```ts
      /** STEP11: 対称鍵を取得します。 */
      console.log('Get symmetric key...');
      const synced = await this.trySyncSymmetricKey();

      return synced;
```

これで、再ログインをした場合に行う取得処理が完成しました。

**3. ユーザーが別のデバイスで初めてログインをしたとき**

このとき、他のデバイスが自身の公開鍵を使用して対称鍵を暗号化し、バックエンドキャニスターにアップロードするまで待つ必要があります。具体的には以下の3つの処理を行います。

1. バックエンドキャニスターに暗号化された対称鍵がアップロードされるのを待つ
2. 暗号化された対称鍵を復号する
3. 対称鍵を同期する

「2. ユーザーが再ログインをしたとき」で実装したtrySyncSymmetricKey関数を思い出してください。`this.actor.getEncryptedSymmetricKey`の戻り値がエラーの時、1つだけエラーをスローするのではなくfalseを返す条件分岐がありました。ユーザーが別のデバイスで初めてログインをしたとき、この条件分岐が実行されます。

```ts
    const syncedSymmetricKey: Result =
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
      /** STEP11: 対称鍵を取得します。 */
      console.log('Get symmetric key...');
      const synced = await this.trySyncSymmetricKey();

      return synced; // ユーザーが別のデバイスで初めてログインをしたとき`false`が返ります。
```

このinit関数の戻り値をチェックして、`false`の場合には暗号化された対称鍵がアップロードされるのを待つという処理を実装しましょう。`hooks/authContext.ts`の中でinit関数を呼び出している`/** STEP7: デバイスデータの設定を行います。 */`の部分を下記のように更新します。

```ts
    /** STEP7: デバイスデータの設定を行います。 */
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

### ✅ 動作確認をしよう

現在、1つのデバイスのみが対称鍵を持っているはずです。つまり「1. ユーザーが初めてログインをしたとき」の状態です。前のレッスンで対称鍵の生成を実装して動作確認を行ったためです。ブラウザのコンソールには`Syncing symmetric keys...`が繰り返し出力されているでしょう（Check device data...という出力は今は気にしないでください）。これは、「1. ユーザーが初めてログインをしたとき」で実装したsyncSymmetricKey関数が定期的に呼び出されていることを意味します。期待する結果となっていますね！

では、別のデバイスを追加してみましょう。シークレットブラウザを開き、認証を行います。このとき、すでに対称鍵を持っているデバイスは起動したままにしておきます。

シークレットブラウザの方では、下記のような出力が確認できるはずです。

![](/public/images/ICP-Encrypted-Notes/section-3/3_3_1.png)

`Symmetric key is not synchronized`が出力された後、`Waiting for key sync...`と出力されています。これは、対称鍵が同期されるのを待っている状態です。少し待つと、`Try syncing symmetric keys.`が出力されます。これはtrySyncSymmetricKey関数が呼び出されたことを示します。対称鍵が同期されると、今度は自分が同期処理を行う側になっていることもわかります。「3. ユーザーが別のデバイスで初めてログインをしたとき」で実装した部分がきちんと動作していますね！

最後に、「2. ユーザーが再ログインをしたとき」の場合を確認してみましょう。どちらか一方のブラウザで`http://localhost:8080/`にアクセスしなおして、再度ログインをしてみましょう。

![](/public/images/ICP-Encrypted-Notes/section-3/3_3_2.png)

このとき、対称鍵はバックエンドキャニスターに保存されたままなので、すぐに対称鍵が取得できるはずです。

### 📝 このレッスンで追加したコード

コードの全体像を提示します。

- `lib/cryptoService.ts`

init関数、trySyncSymmetricKey関数、syncSymmetricKey関数を追加・更新しました。

```ts
  public async init(): Promise<boolean> {
    /** STEP2: 公開鍵・秘密鍵を生成します。 */
    // データベースから公開鍵・秘密鍵を取得します。
    this.publicKey = await loadKey('publicKey');
    this.privateKey = await loadKey('privateKey');

    if (!this.publicKey || !this.privateKey) {
      // 公開鍵・秘密鍵が存在しない場合は、生成します。
      const keyPair: CryptoKeyPair = await this.generateKeyPair();

      // 生成した鍵をデータベースに保存します。
      await storeKey('publicKey', keyPair.publicKey);
      await storeKey('privateKey', keyPair.privateKey);

      this.publicKey = keyPair.publicKey;
      this.privateKey = keyPair.privateKey;
    }

    /** STEP8: デバイスデータを登録します。 */
    // publicKeyをexportしてBase64に変換します。
    const exportedPublicKey = await window.crypto.subtle.exportKey(
      'spki',
      this.publicKey,
    );
    this.exportedPublicKeyBase64 = this.arrayBufferToBase64(exportedPublicKey);

    // バックエンドキャニスターにデバイスエイリアスと公開鍵を登録します。
    await this.actor.registerDevice(
      this.deviceAlias,
      this.exportedPublicKeyBase64,
    );

    /** STEP9: 対称鍵を生成します。 */
    const isSymKeyRegistered =
      await this.actor.isEncryptedSymmetricKeyRegistered();
    if (!isSymKeyRegistered) {
      console.log('Generate symmetric key...');
      // 対称鍵を生成します。
      this.symmetricKey = await this.generateSymmetricKey();
      // 対称鍵を公開鍵で暗号化します。
      const wrappedSymmetricKeyBase64: string = await this.wrapSymmetricKey(
        this.symmetricKey,
        this.publicKey,
      );
      // 暗号化した対称鍵をバックエンドキャニスターに登録します。
      const result: Result_1 =
        await this.actor.registerEncryptedSymmetricKey(
          this.exportedPublicKeyBase64,
          wrappedSymmetricKeyBase64,
        );
      if ('Err' in result) {
        if ('UnknownPublicKey' in result.Err) {
          throw new Error('Unknown public key');
        }
        if ('AlreadyRegistered' in result.Err) {
          throw new Error('Already registered');
        }
        if ('DeviceNotRegistered' in result.Err) {
          throw new Error('Device not registered');
        }
      }

      /** STEP10: 対称鍵を同期します。 */
      console.log('Synchronizing symmetric keys...');
      if (this.intervalId === null) {
        this.intervalId = window.setInterval(
          () => this.syncSymmetricKey(),
          5000,
        );
      }

      return true;
    } else {
      /** STEP11: 対称鍵を取得します。 */
      console.log('Get symmetric key...');
      const synced = await this.trySyncSymmetricKey();

      return synced;
    }
  }

  public async trySyncSymmetricKey(): Promise<boolean> {
    // 対称鍵が同期されているか確認します。
    const syncedSymmetricKey: Result =
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
      // 対称鍵が取得できたので、このデバイスでも鍵の同期処理を開始します。
      if (this.intervalId === null) {
        console.log('Try syncing symmetric keys...');
        this.intervalId = window.setInterval(
          () => this.syncSymmetricKey(),
          5000,
        );
      }
      return true;
    }
  }

  private async syncSymmetricKey(): Promise<void> {
    console.log('Syncing symmetric keys...');
    if (this.symmetricKey === null) {
      throw new Error('Symmetric key is not generated');
    }

    // 同期されていないデバイスの公開鍵を取得します。
    const unsyncedPublicKeys: string[] =
      await this.actor.getUnsyncedPublicKeys();
    const symmetricKey = this.symmetricKey;
    const encryptedKeys: Array<[string, string]> = [];

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
      // 公開鍵と暗号化した対称鍵をペアにして保存します。
      encryptedKeys.push([unsyncedPublicKey, wrappedSymmetricKeyBase64]);
    }
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
  }
```

- `hooks/authContext.ts`

setupService関数を更新しました。

```ts
  const setupService = async (authClient: AuthClient) => {
    /** STEP2: 認証したユーザーのデータを取得します。 */
    const identity = authClient.getIdentity();

    /** STEP3: バックエンドキャニスターを呼び出す準備をします。 */
    // 取得した`identity`を使用して、ICと対話する`agent`を作成します。
    const newAgent = new HttpAgent({ identity });
    if (process.env.DFX_NETWORK === 'local') {
      newAgent.fetchRootKey();
    }
    // 認証したユーザーの情報で`actor`を作成します。
    const options = { agent: newAgent };
    const actor = createActor(canisterId, options);

    /** STEP5: CryptoServiceクラスのインスタンスを生成します。 */
    const cryptoService = new CryptoService(actor);
    /** STEP12: デバイスデータの設定を行います。 */
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
  };
```

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

次のレッスンに進み、フロントエンドからデバイスを削除できるようにしましょう 🎉
