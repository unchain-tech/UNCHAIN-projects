### 🔑 対称鍵を生成しよう

前回のレッスンでバックエンドキャニスターを更新したので、改めてデプロイを行いましょう。

```
dfx start --clean --background
npm run deploy:local
npm run start
```

ここからは、`encrypted_notes_frontend/`内のファイルを更新していきます。

まずは、cryptoService.tsファイルを更新しましょう。インタフェースに定義した型をクラス内で使用したいのでインポートします。

```ts
import {
  _SERVICE,
  Result_1,
} from '../../../declarations/encrypted_notes_backend/encrypted_notes_backend.did';
```

init関数に対称鍵の生成と登録を行うコードを追加します。`/** STEP9: 対称鍵を生成します。 */`の下を下記のコードで更新しましょう。

```ts
    /** STEP9: 対称鍵を生成します。 */
    // 対称鍵が生成されているかどうかを確認します。
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

      return true;
    } else {
      /** STEP11: 対称鍵を取得します。 */
      return false;
    }
  }
```

追加したコードを確認していきましょう。

まず、`isEncryptedSymmetricKeyRegistered`関数を呼び出して、対称鍵が登録されているかを確認します。登録されていない場合は対称鍵を生成し、既に登録されている場合は何もせずに、今はfalseを返して終了します。

```ts
    const isSymKeyRegistered =
      await this.actor.isEncryptedSymmetricKeyRegistered();
    if (!isSymKeyRegistered) {
      console.log('Generate symmetric key...');

      ...

      return true;
    } else {
      return false;
    }
```

対称鍵の生成は、private関数として定義されている`generateSymmetricKey`関数で行います。内部でどのような処理を行なっているか目を通してみてください。生成した対称鍵はそのまま扱わずに、先に生成している公開鍵で暗号化します。対称鍵の暗号化もprivate関数として既に定義されている`wrapSymmetricKey`関数で行います。

```ts
      // 対称鍵を生成します。
      this.symmetricKey = await this.generateSymmetricKey();
      // 対称鍵を公開鍵で暗号化します。
      const wrappedSymmetricKeyBase64: string = await this.wrapSymmetricKey(
        this.symmetricKey,
        this.publicKey,
      );
```

wrapSymmetricKey関数を簡単に解説します。鍵を暗号化するには、[SubtleCrypto](https://developer.mozilla.org/ja/docs/Web/API/SubtleCrypto)オブジェクトの[wrapKey](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/wrapKey)メソッドを使用します。wrapKeyメソッドは、暗号化する鍵の種類によって引数の指定方法が異なります。今回は対称鍵を暗号化するので、第一引数（format）には[raw](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/importKey#raw)、第二引数（key）にはラップしたい鍵：対称鍵、第三引数（wrappingKey）には暗号化に使用する鍵：公開鍵、第四引数（wrapAlgo）には暗号化アルゴリズム[RSA-OAEP](https://developer.mozilla.org/en-US/docs/Web/API/RsaOaepParams)を指定します。

```ts
// lib/cryptoService.ts, wrapSymmetricKey()
    const wrappedSymmetricKey = await window.crypto.subtle.wrapKey(
      'raw',
      symmetricKey,
      wrappingKey,
      {
        name: 'RSA-OAEP',
      },
    );
```

init関数に戻り、最後は暗号化された対称鍵をバックエンドキャニスターに登録します。登録時にエラーが返されたら、対応するエラーをスローします。

```ts
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
```

ここまでで、対称鍵の生成を行うコードが実装できました。

### ✅ 動作確認をしよう

ブラウザのコンソールを開いておき、改めて認証を行いましょう。認証が完了してアプリケーションに戻ると、以下のようなログが出力されていることを確認しましょう。

```console
Generate symmetric key...
initialized: true
```

### 📝 このレッスンで追加したコード

- `lib/cryptoService.ts`

```diff
import {
  _SERVICE,
+  Result_1,
} from '../../../declarations/encrypted_notes_backend/encrypted_notes_backend.did';

...

  public async init(): Promise<boolean> {
    /** STEP6: 公開鍵・秘密鍵を生成します。 */
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
+    // 対称鍵が生成されているかどうかを確認します。
+    const isSymKeyRegistered =
+      await this.actor.isEncryptedSymmetricKeyRegistered();
+    if (!isSymKeyRegistered) {
+      console.log('Generate symmetric key...');
+      // 対称鍵を生成します。
+      this.symmetricKey = await this.generateSymmetricKey();
+      // 対称鍵を公開鍵で暗号化します。
+      const wrappedSymmetricKeyBase64: string = await this.wrapSymmetricKey(
+        this.symmetricKey,
+        this.publicKey,
+      );
+      // 暗号化した対称鍵をバックエンドキャニスターに登録します。
+      const result: Result_1 =
+        await this.actor.registerEncryptedSymmetricKey(
+          this.exportedPublicKeyBase64,
+          wrappedSymmetricKeyBase64,
+        );
+      if ('Err' in result) {
+        if ('UnknownPublicKey' in result.Err) {
+          throw new Error('Unknown public key');
+        }
+        if ('AlreadyRegistered' in result.Err) {
+          throw new Error('Already registered');
+        }
+        if ('DeviceNotRegistered' in result.Err) {
+          throw new Error('Device not registered');
+        }
+      }
+
+      /** STEP10: 対称鍵を同期します。 */
+
+      return true;
+    } else {
+      /** STEP11: 対称鍵を取得します。 */
+      return false;
+    }
-    return true;
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

次のレッスンに進み、対称鍵の同期を行いましょう！
