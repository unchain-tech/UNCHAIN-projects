### 🔓 ノートを復号する

前回のレッスンで、ノートを暗号化する機能を実装しました。

このレッスンでは、暗号化されたノートを復号してみましょう！

それでは実際に、暗号化されたノートを復号するためのコードを書いていきましょう。

`lib/cryptoService.ts`内に定義されている`decryptNote`関数を更新します。

```typescript
  public async decryptNote(data: string): Promise<string> {
    if (this.symmetricKey === null) {
      throw new Error('Not found symmetric key');
    }

    // テキストデータとIVを分離します。
    const base64IvLength: number = (CryptoService.INIT_VECTOR_LENGTH / 3) * 4;
    const decodedIv = data.slice(0, base64IvLength);
    const decodedEncryptedNote = data.slice(base64IvLength);

    // 一文字ずつ`charCodeAt()`で文字コードに変換します。
    const encodedIv = this.base64ToArrayBuffer(decodedIv);
    const encodedEncryptedNote = this.base64ToArrayBuffer(decodedEncryptedNote);

    const decryptedNote: ArrayBuffer = await window.crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: encodedIv,
      },
      this.symmetricKey,
      encodedEncryptedNote,
    );

    const decodedDecryptedNote: string = new TextDecoder().decode(
      decryptedNote,
    );

    return decodedDecryptedNote;
  }
```

<!-- TODO: 最初に説明した仕組みに沿って、簡単にコードを確認していく -->

定義した`decryptNote`関数をコンポーネントから呼び出してみましょう。ノートを復号するタイミングは、ユーザーがノートを取得するときです。

`routes/notes/index.tsx`のNotesコンポーネントに定義された`getNotes`関数を更新します。

```tsx
  const getNotes = async () => {
    if (auth.status !== 'SYNCED') {
      console.error(`CryptoService is not synced.`);
      return;
    }

    try {
      const decryptedNotes = new Array<EncryptedNote>();
      const notes = await auth.actor.getNotes();
      // 暗号化されたノートを復号します。
      for (const note of notes) {
        const decryptedData = await auth.cryptoService.decryptNote(note.data);
        decryptedNotes.push({
          id: note.id,
          data: decryptedData,
        });
      }
      setNotes(decryptedNotes);
    } catch (err) {
      showMessage({
        title: 'Failed to get notes',
        status: 'error',
      });
    }
  };
```

復号の機能が完成しました！ 実際にノートを取得してみましょう。

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