### 🖋 フロントエンドからノートを編集・削除しよう

前回のレッスンに引き続き、`routes/notes/index.tsx`のNotesコンポーネントを更新していきましょう。

`updateNote`関数内でログ出力をしている`console.log('update note');`の部分を下記のように更新します。

```tsx
  const updateNote = async () => {
    if (auth.status !== 'SYNCED') {
      console.error(`CryptoService is not synced.`);
      return;
    }

    setIsLoading(true);

    try {
      // バックエンドキャニスターにノートを追加します。
      await auth.actor.updateNote(currentNote);
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

updateNote関数は、前回のレッスンで定義したaddNote関数と仕組みが一緒なので、説明は省略します。

続いて、`deleteNote`関数内でログ出力をしている`console.log('delete note');`の部分を下記のように更新します。

```tsx
  const deleteNote = async () => {
    if (auth.status !== 'SYNCED') {
      console.error(`CryptoService is not synced.`);
      return;
    }

    setIsLoading(true);

    try {
      // ノートを削除します。
      await auth.actor.deleteNote(deleteId);
      await getNotes();
    } catch (err) {
      showMessage({
        title: 'Failed to delete note',
        status: 'error',
      });
    } finally {
      onCloseDeleteDialog();
      setIsLoading(false);
    }
  };
```

各ノートには、一意なIDが割り当てられています。このID(`deleteId`)を用いて、バックエンドキャニスターの`deleteNote`関数を呼び出します。deleteIdは、`useState`で定義されたステート変数です。`setDeleteId`関数を辿って、どのタイミングでdeleteIdが更新されるか確認してみましょう。

```tsx
const [deleteId, setDeleteId] = useState<bigint | undefined>(undefined);
```

### ✅ 動作確認をしよう

まずは、ノートを編集してみましょう。編集アイコンをクリックすると、モーダルが開きます。

![](/public/images/ICP-Encrypted-Notes/section-1/1_5_1.png)

テキストを編集して「Save」ボタンをクリックします。

![](/public/images/ICP-Encrypted-Notes/section-1/1_5_2.png)

ノートが編集されていることを確認しましょう。

同様の流れで、今度はノートを削除してみましょう。削除アイコンをクリックします。

![](/public/images/ICP-Encrypted-Notes/section-1/1_5_3.png)

確認のダイアログが表示されるので、「Delete」ボタンをクリックします。

![](/public/images/ICP-Encrypted-Notes/section-1/1_5_4.png)

ノートが削除されたら実装は完成です！

### 📝 このレッスンで追加したコード

- `src/routes/notes/index.tsx`

```diff
export const Notes = () => {

  ...

  const deleteNote = async () => {
    if (auth.status !== 'SYNCED') {
      console.error(`CryptoService is not synced.`);
      return;
    }

    setIsLoading(true);

    try {
      // ノートを削除します。
-      console.log('delete note');
+      await auth.actor.deleteNote(deleteId);
+      await getNotes();
    } catch (err) {
      showMessage({
        title: 'Failed to delete note',
        status: 'error',
      });
    } finally {
      onCloseDeleteDialog();
      setIsLoading(false);
    }
  };

  ...

  const updateNote = async () => {
    if (auth.status !== 'SYNCED') {
      console.error(`CryptoService is not synced.`);
      return;
    }

    setIsLoading(true);

    try {
      // バックエンドキャニスターにノートを追加します。
-      console.log('update note');
+      await auth.actor.updateNote(currentNote);
+      await getNotes();
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

...

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

次のセクションに進み、ノートを暗号化する方法について考えましょう 🎉