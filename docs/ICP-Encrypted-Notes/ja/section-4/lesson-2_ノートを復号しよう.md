### 🔓 ノートを復号する

前回のレッスンで、ノートを暗号化する機能を実装しました。このレッスンでは、暗号化されたノートを復号します。

それでは、コードを書いていきましょう。`lib/cryptoService.ts`内に定義されている`decryptNote`関数を下記の内容に更新します。

```ts
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

追加したコードを確認しましょう。

バックエンドキャニスターには、Base64エンコーディングをしたiv（initialization vector）を一緒に保存しました。ノートの復号を行う前に、ivを切り離して元のデータ型に戻す必要があります。

Base64エンコーディングは、3バイトのバイナリデータを4文字のASCII文字列に変換します。そのため、下記のように計算を行い"iv"と"暗号化したノート"に分けます。

```ts
    // テキストデータとIVを分離します。
    const base64IvLength: number = (CryptoService.INIT_VECTOR_LENGTH / 3) * 4;
    const decodedIv = data.slice(0, base64IvLength);
    const decodedEncryptedNote = data.slice(base64IvLength);
```

それぞれを元のデータ型（バイナリデータ）に戻します。

```ts
    // 一文字ずつ`charCodeAt()`で文字コードに変換します。
    const encodedIv = this.base64ToArrayBuffer(decodedIv);
    const encodedEncryptedNote = this.base64ToArrayBuffer(decodedEncryptedNote);
```

[decrypt](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/decrypt)メソッドを使用して、復号を行います。

```ts
    const decryptedNote: ArrayBuffer = await window.crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: encodedIv,
      },
      this.symmetricKey,
      encodedEncryptedNote,
    );
```

これで、ノートの復号を行うdecryptNote関数が完成しました。では、この関数をコンポーネントから呼び出してみましょう。ノートを復号するタイミングは、ユーザーがノートを取得したときです。

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

復号の機能が完成しました！ 

✅ 動作確認をしよう

前のレッスンで暗号化されたまま表示されていたノートが、復号されていますか？

![](/public/images/ICP-Encrypted-Notes/section-4/4_2_1.png)

また、デバイス間でノートが共有されていることも確認しておきましょう。

![](/public/images/ICP-Encrypted-Notes/section-4/4_2_2.png)

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

アプリケーションの機能が完成しました！ お疲れ様でした 🎉