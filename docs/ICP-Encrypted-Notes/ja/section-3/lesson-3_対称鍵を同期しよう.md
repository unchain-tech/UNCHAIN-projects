### 対称鍵を同期しよう

このレッスンでは、対称鍵の同期処理を実装します。同期処理に関して、対称鍵を持っている場合と持っていない場合で行う処理が異なります。

- 対称鍵を持っている場合は、対称鍵を同期する
- 対称鍵を持っていない場合は、対称鍵が同期されるのを待つ

ふたつのケースを順番に実装していきましょう。

**対称鍵を持っている場合**

このとき、行うことは以下の3つです。

1. バックエンドキャニスターから、公開鍵の一覧を取得する
2. 取得した公開鍵を用いて、対称鍵を暗号化する
3. 暗号化された対称鍵をバックエンドキャニスターにアップロードする

では、実装していきましょう。cryptoService.tsファイルの`init`関数を更新しましょう。`/** Section3 Lesson3: 対称鍵を同期します */`の部分に下記のコードを記述します。

```ts
      console.log('Synchronizing symmetric keys...');
      if (this.intervalId === null) {
        this.intervalId = window.setInterval(
          () => this.syncSymmetricKey(),
          5000,
        );
      }
```

追加したコードを確認しましょう。private関数として既に定義されている`syncSymmetricKey`関数を呼び出しています。syncSymmetricKey関数では、最初にバックエンドキャニスターから公開鍵の一覧を取得します。

```ts
    // 同期されていないデバイスの公開鍵を取得する
    const unsyncedPublicKeys: string[] =
      await this.actor.getUnsyncedPublicKeys();
```

続いて、取得した公開鍵で自身が持っている対称鍵を暗号化していきます。バックエンドキャニスターに公開鍵を登録する際、鍵をエクスポートしてbase64に変換しました。対称鍵を暗号化するためには、元のCryptoKeyオブジェクトに戻す必要があります。そのため、[importKey](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/importKey)関数を使用して、base64に変換した鍵をCryptoKeyオブジェクトに変換します。

```ts
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
```

公開鍵をCryptoKeyオブジェクトに戻したら、`wrapSymmetricKey`関数を呼び出して対称鍵を暗号化します。

```ts
      const wrappedSymmetricKeyBase64: string = await this.wrapSymmetricKey(
        symmetricKey,
        publicKey,
      );
```

対称鍵の暗号化が完了したので、バックエンドキャニスターにアップロードします。

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

先ほど追加した、syncSymmetricKey関数の呼び出し部分に戻りますが、この関数は`window.setInterval`という関数内で呼び出されています。[setInterval](https://developer.mozilla.org/en-US/docs/Web/API/setInterval)は、一定の時間ごとに指定した関数を実行してくれます。今回は5秒ごとにsyncSymmetricKey関数を実行するように設定しています。setIntervalは、作成されたタイマーを識別する数値であるIDを返します。このIDが既に設定されているときは、条件式を通過しないので重複してタイマーが設定されないようになっています。

```ts
      if (this.intervalId === null) {
        this.intervalId = window.setInterval(
          () => this.syncSymmetricKey(),
          5000,
        );
      }
```

**対称鍵を持っていない場合**

このとき、行うことは以下の3つです。

1. 対称鍵が同期されたかどうかを定期的に確認する
2. 対称鍵が同期されたら、バックエンドキャニスターから暗号化された対称鍵を取得する
3. 今度は対称鍵を同期する側になる

それでは、init関数を更新します。下記のコードを、`/** Section3 Lesson3: 対称鍵が同期されるのを待ちます */`の部分に記述します。

```ts
      console.log('Get symmetric key...');
      const synced = await this.trySyncSymmetricKey();

      return synced;
```

追加したコードを確認しましょう。このコードはelse文の中、つまり、`await this.actor.isEncryptedSymmetricKeyRegistered();`の結果がtrueだった場合に実行されます。

続いて、init関数の下に下記のコードを追加します。

```ts
  public async trySyncSymmetricKey(): Promise<boolean> {
    // 対称鍵が同期されているか確認します。
    const syncedSymmetricKey: SynchronizeKeyResult =
      await this.actor.getEncryptedSymmetricKey(this.exportedPublicKeyBase64);
    if ('Err' in syncedSymmetricKey) {
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

次のセクションに進み、ノートの暗号化・復号処理を実装しましょう 🎉
