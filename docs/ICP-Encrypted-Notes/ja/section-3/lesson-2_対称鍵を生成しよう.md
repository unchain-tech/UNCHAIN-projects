### 対称鍵を生成しよう

前回のレッスンでバックエンドキャニスターを更新したので、改めてデプロイを行いましょう。

```bash
dfx deploy
npm run start
```

cryptoService.tsファイルの`init`関数に対称鍵の生成と登録を行うコードを追加します。`await this.actor.registerDevice()`の下に、下記のコードを追加しましょう。

```ts
    /** Section3 Lesson2: 対称鍵を生成します */
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
      const result: RegisterKeyResult =
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

      /** Section3 Lesson3: 対称鍵を同期します */

      return true;
    } else {
      /** Section3 Lesson3: 対称鍵が同期されるのを待ちます */
      return false;
    }
  }
```

追加したコードを確認していきましょう。

まず、`isEncryptedSymmetricKeyRegistered`関数を呼び出して、対称鍵が登録されているかを確認します。登録されていない場合は、対称鍵を生成して登録します。

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

wrapSymmetricKey関数を簡単に解説します。鍵を暗号化するには、[SubtleCrypto](https://developer.mozilla.org/ja/docs/Web/API/SubtleCrypto)オブジェクトの[wrapKey](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/wrapKey)メソッドを使用します。wrapKeyメソッドは、暗号化する鍵の種類によって引数の指定方法が異なります。今回は対称鍵を暗号化するので、第一引数（format）には[raw](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/importKey#raw)、第二引数（key）にはラップしたい鍵の対称鍵、第三引数（wrappingKey）には暗号化に使用する鍵の公開鍵、第四引数（wrapAlgo）には暗号化アルゴリズム[RSA-OAEP](https://developer.mozilla.org/en-US/docs/Web/API/RsaOaepParams)を指定します。

```ts
// wrapSymmetricKey()
    const wrappedSymmetricKey = await window.crypto.subtle.wrapKey(
      'raw',
      symmetricKey,
      wrappingKey,
      {
        name: 'RSA-OAEP',
      },
    );
```

### ✅ 動作確認をしよう

ログインボタンを押して認証を行うと、以下のようなログが出力されることを確認しましょう。

```console
Generate symmetric key...
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