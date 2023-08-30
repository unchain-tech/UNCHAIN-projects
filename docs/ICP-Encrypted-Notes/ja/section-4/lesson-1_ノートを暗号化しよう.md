### 🔐 ノートを暗号化する

ここまでのセクションで、アプリケーションの要となる鍵の管理機能が実装できました。

このレッスンでは、実際にノートを暗号化してみましょう！

それでは実際に、ノートを暗号化するためのコードを書いていきましょう。

`lib/cryptoService.ts`内に定義されている`encryptNote`関数を更新します。

```typescript
  public async encryptNote(data: string): Promise<string> {
    if (this.symmetricKey === null) {
      throw new Error('Not found symmetric key');
    }

    // 12バイトのIV（初期化ベクター）を生成します。
    // // 同じ鍵で繰り返し暗号化を行う際に、それぞれの暗号文が同じにならないようにするためです。
    const iv = window.crypto.getRandomValues(
      new Uint8Array(CryptoService.INIT_VECTOR_LENGTH),
    );

    // ノートをUTF-8のバイト配列に変換します。
    const encodedNote: Uint8Array = new TextEncoder().encode(data);

    // 対称鍵を使ってノートを暗号化します。
    const encryptedNote: ArrayBuffer = await window.crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv,
      },
      this.symmetricKey,
      encodedNote,
    );

    // テキストデータとIVを結合します。
    // // IVは、復号時に再度使う必要があるためです。
    const decodedIv: string = this.arrayBufferToBase64(iv);
    const decodedEncryptedNote: string =
      this.arrayBufferToBase64(encryptedNote);

    return decodedIv + decodedEncryptedNote;
  }
```

<!-- TODO: 最初に説明した仕組みに沿って、簡単にコードを確認していく -->

定義した`encryptNote`関数をコンポーネントから呼び出してみましょう。ノートを暗号化するタイミングは、ユーザーがノートを追加・更新するときです。

まずは、`routes/notes/index.tsx`のNotesコンポーネントに定義された`addNote`関数を更新します。

```tsx
  const addNote = async () => {
    if (auth.status !== 'SYNCED') {
      console.error(`CryptoService is not synced.`);
      return;
    }
    setIsLoading(true);
    try {
      // テキストの暗号化を行います。
      const encryptedNote = await auth.cryptoService.encryptNote(
        currentNote.data,
      );
      await auth.actor.addNote(encryptedNote);
      await getNotes();
    } catch (err) {
      showMessage({
        title: 'Failed to add note',
        status: 'error',
      });
    } finally {
      onCloseNoteModal();
      setIsLoading(false);
    }
  };
```

続いて、`updateNote`関数を更新します。

```tsx
  const updateNote = async () => {
    if (auth.status !== 'SYNCED') {
      console.error(`CryptoService is not synced.`);
      return;
    }
    setIsLoading(true);
    try {
      // テキストの暗号化を行います。
      const encryptedData = await auth.cryptoService.encryptNote(
        currentNote.data,
      );
      const encryptedNote = {
        id: currentNote.id,
        data: encryptedData,
      };
      await auth.actor.updateNote(encryptedNote);
      await getNotes();
    } catch (err) {
      showMessage({
        title: 'Failed to update note',
        status: 'error',
      });
    } finally {
      onCloseNoteModal();
      setIsLoading(false);
    }
  };
```

暗号化の機能が完成しました！ 実際にノートを追加・更新してみましょう。

<!-- TODO: 実際にやってみた画像を追加する -->

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