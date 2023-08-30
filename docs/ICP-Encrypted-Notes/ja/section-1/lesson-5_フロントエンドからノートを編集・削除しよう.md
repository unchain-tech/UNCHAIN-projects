### フロントエンドからノートを編集・削除しよう

前回のレッスンに引き続き、Notesコンポーネントを更新していきましょう。

`updateNote`関数を、下記のように更新します。

```tsx
  const updateNote = async () => {
    if (auth.status !== 'SYNCED') {
      console.error(`CryptoService is not synced.`);
      return;
    }

    setIsLoading(true);
    try {
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

続いて、`deleteNote`関数を下記のように更新します。

```tsx
  const deleteNote = async () => {
    if (auth.status !== 'SYNCED') {
      console.error(`CryptoService is not synced.`);
      return;
    }

    setIsLoading(true);
    try {
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

各ノートには、一意なIDが割り当てられています。このID(`deleteId`)を用いて、バックエンドキャニスターの`deleteNote`関数を呼び出します。deleteIdは、`useState`で定義された状態変数です。

```tsx
// routes/notes/index.tsx
const [deleteId, setDeleteId] = useState<bigint | undefined>(undefined);
```

ノート一つ一つは、`NoteCard`コンポーネントで表示されています。NoteCardコンポーネントを見てみると、削除アイコンボタンが押されたときにノートのIDを`handleOpenDeleteDialog`関数に渡しています。これにより、削除対象となるノートのIDを保持してNotesコンポーネント内で使用することができます。

```tsx
// routes/notes/index.tsx
// 削除するノートのIDを受け取り、ダイアログの操作を行う関数です。
const openDeleteDialog = (id: bigint) => {
  setDeleteId(id);
  onOpenDeleteDialog();
};
```

```tsx
// routes/notes/index.tsx
{notes.map((note) => (
  <NoteCard
    key={note.id}
    note={note}
    handleOpenDeleteDialog={openDeleteDialog} // `openDeleteDialog`関数を渡します。
    handleOpenEditModal={openEditNoteModal}
  />
))}
```

```tsx
// components/NoteCard/index.tsx
<IconButton
  aria-label="Trash note"
  icon={<FiTrash2 />}
  onClick={() => handleOpenDeleteDialog(note.id)} // 削除するノートのIDを渡します。
/>
```

### ✅ 動作確認をしよう

まずは、ノートを編集してみましょう。

<!-- TODO: 画像を追加 -->

モーダルが開いたら、テキストを編集して「Save」ボタンをクリックします。

<!-- TODO: 画像を追加 -->

ノートが編集されたことを確認しましょう。

同様の流れで、今度はノートを削除してみましょう。選択したノートが削除されていたら実装は完了です。

<!-- TODO: 画像を追加 -->

<!-- TOOD: 画像を追加 -->

### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discordの`#icp`で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の4点を記載してください ✨

```
1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット
```