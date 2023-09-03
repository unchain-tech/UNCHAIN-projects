### 📊 デバイスデータを登録しよう

デバイスエイリアスとキーペアの生成ができたので、これらをバックエンドキャニスターに登録しましょう。

`cryptoService.ts`内のinit関数を更新します。`/** STEP3: デバイスデータの登録をします。 */`の部分に下記のコードを追加しましょう。

```tsx
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
```

追加したコードを確認します。

キーペアを生成する際、`'extractable'`に`true`を指定していたことを覚えていますか（前回のレッスンを参照）？ ここでは、[exportKey](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/exportKey)関数を使用して実際に鍵をエクスポートしています。第一引数にフォーマットを指定します。エクスポートしたい鍵の種類によって指定できるフォーマットが異なります。今回は公開鍵をエクスポートするため、[spki](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/exportKey#parameters)（SubjectPublicKeyInfo）を指定します。

```typescript
    const exportedPublicKey = await window.crypto.subtle.exportKey(
      'spki',
      this.publicKey,
    );
```

エクスポートされた公開鍵はバイナリデータですが、そのままでは扱いづらいためbase64に変換します。`arrayBufferToBase64`関数は、既に定義されているprivate関数です。

```typescript
    this.exportedPublicKeyBase64 = this.arrayBufferToBase64(exportedPublicKey);
```

**base64とは**

データを他の形式へ変換する方法（エンコード方式）の1つです。全てのデータを「a~z, A~Z」「0~1」「+, /」と末尾の「=」で表現します。バイナリデータは特殊文字を含む可能性があります。これをそのまま扱うと、データをやり取りする間にシステムによっては正しく解釈できない可能性があり、データ破損の原因となり得ます。バックエンドキャニスターに保存し、再度取り出した時に元の公開鍵と違う値になっていたら困りますよね。そこで、多くのシステムやプログラミング言語がサポートしているbase64エンコーディングを使用することで、データを安全に扱うことができます。

公開鍵の型変換が完了したら、デバイスエイリアスと一緒にバックエンドキャニスターに登録します。

```typescript
    await this.actor.registerDevice(
      this.deviceAlias,
      this.exportedPublicKeyBase64,
    );
```

デバイスデータの登録機能が実装できたので、次は登録したデバイスデータを取得しましょう。

`routes/devices/`内の`index.tsx`を更新します。このファイルは、デバイス一覧を表示するページのコンポーネントです。`getDevices`関数を、下記のように更新しましょう。

```tsx
  const getDevices = async () => {
    if (auth.status !== 'SYNCED') {
      console.error(`CryptoService is not synced.`);
      return;
    }
    try {
      const deviceAliases = await auth.actor.getDeviceAliases();
      setDeviceAliases(deviceAliases);
    } catch (err) {
      showMessage({
        title: 'Failed to get devices',
        status: 'error',
      });
    }
  };
```

バックエンドキャニスターの`getDeviceAliases`関数を呼び出し、取得したデータを`setDeviceAliases`関数でステートに保存します。

### 🗑 デバイスデータを削除しよう

最後に、デバイスデータの削除機能を実装しましょう。同じコンポーネント内の`deleteDevice`関数を、下記のように更新しましょう。

```tsx
  const deleteDevice = async () => {
    if (auth.status !== 'SYNCED') {
      console.error(`CryptoService is not synced.`);
      return;
    }
    setIsLoading(true);
    try {
      await auth.actor.deleteDevice(deleteAlias);
      await getDevices();
    } catch (err) {
      console.error(err);
      showMessage({
        title: 'Failed to delete device',
        status: 'error',
      });
    } finally {
      onCloseDeleteDialog();
      setIsLoading(false);
    }
  };
```

バックエンドキャニスターの`deleteDevice`関数に、削除したいデバイスエイリアスを渡して呼び出します。この時渡される`deleteAlias`は、ステート変数です。どのように更新されるかは、`setDeleteAlias`関数を辿って確認してみてください！

```tsx
  const [deleteAlias, setDeleteAlias] = useState<string | undefined>(undefined);
```

### ✅ 動作確認をしよう

実際に、デバイスデータの登録・削除機能が正しく動作するか確認してみましょう。

まずは、現在の状態を確認します。サイドバーの「Devices」をクリックします。

<!-- TODO: 画像を追加 -->

デバイス一覧ページに、デバイスエイリアスが1つ表示されていることを確認します。

<!-- TODO: 画像を追加 -->

シークレットブラウザで、同じInternet Identity（開発モードでは10000）で認証します。

<!-- TODO: 画像を追加 -->

デバイス一覧ページを更新して、デバイスエイリアスが2つ表示されていることを確認します。

<!-- TODO: 画像を追加 -->

どちらか一方のデバイスを削除します。

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

次のセクションに進み、ノートの共有機能を完成させましょう 🎉