### 📞 バックエンドキャニスターと通信する準備をしよう

前回のレッスンで、認証機能が完成しました。ここからは、実際にバックエンドキャニスターの関数を呼び出してノートを取得・追加する処理を実装していきましょう！ ノートの暗号化はまだ行わないので、データはそのまま保存します。

`hooks/authContext.ts`のsetupService関数`/** STEP3: バックエンドキャニスターを呼び出す準備をします。 */`の下に、コードを追加します。

```ts
    /** STEP3: バックエンドキャニスターを呼び出す準備をします。 */
    // 取得した`identity`を使用して、ICと対話する`agent`を作成します。
    const newAgent = new HttpAgent({ identity });
    if (process.env.DFX_NETWORK === 'local') {
      newAgent.fetchRootKey();
    }
    // 認証したユーザーの情報で`actor`を作成します。
    const options = { agent: newAgent };
    const actor = createActor(canisterId, options);
```

更新したコードを確認していきましょう。

バックエンドキャニスターと通信を行うためには、仲介者が必要です。その役割を果たすのが[HttpAgent](https://agent-js.icp.xyz/agent/classes/HttpAgent.html)と呼ばれるクラスです。

Internet Identityによる認証で取得したユーザーの情報（identity）を元に、HttpAgentを初期化します。初期化に用いたデータが、バックエンドキャニスターへのメッセージ送信に使用されるプリンシパルとなります。

```ts
    // 取得した`identity`を使用して、ICと対話する`agent`を作成します。
    const newAgent = new HttpAgent({ identity });
```

デプロイ先のネットワークがローカルの時、[`fetchRootKey`](https://agent-js.icp.xyz/agent/interfaces/Agent.html#fetchRootKey)関数を呼び出します。デフォルトでは、エージェントはメインネットと通信するように設定されており、ハードコードされた公開鍵を使用してレスポンスを検証します。そのため、ローカルネットワークにデプロイしたキャニスターと通信する際には、この関数を呼び出してキャニスターの公開鍵を取得する必要があります（⚠️この関数はメインネットと通信していない時のみに使用します）。

```ts
    if (process.env.DFX_NETWORK === 'local') {
      newAgent.fetchRootKey();
    }
```

最後に、アクターを作成します。アクターは、キャニスター間の通信でやり取りされるメッセージを処理するオブジェクトのことで、非同期にメッセージを処理します。アクターを作成するには、[`createActor`](https://agent-js.icp.xyz/agent/classes/Actor.html)関数を使用します。

```ts
    // 認証したユーザーの情報で`actor`を作成します。
    const options = { agent: newAgent };
    const actor = createActor(canisterId, options);
```

なお、createActor関数はバックエンドキャニスターをデプロイした際に生成されるIDLファイルから取得します。

```ts
import {
  canisterId,
  createActor,
} from '../../../declarations/encrypted_notes_backend';
```

最後に、setupService関数の一番下に定義している`setAuth({ status: 'SYNCHRONIZING' });`を下記のコードに更新しましょう。`setAuth`関数に取得したデータを設定して、認証状態を更新します。

```ts
    setAuth({ actor, authClient, cryptoService, status: 'SYNCED' });
```

### 🎤 バックエンドキャニスターの関数を呼び出そう

バックエンドキャニスターと通信する準備ができたので、実際にバックエンドキャニスターの関数を呼び出してみましょう。

`routes/notes/index.tsx`のNotesコンポーネントを更新します。まずは、`getNotes`関数内で空配列を設定している`setNotes([]);`の部分を、下記のように更新しましょう。

```tsx
  const getNotes = async () => {
    if (auth.status !== 'SYNCED') {
      console.error(`CryptoService is not synced.`);
      return;
    }

    try {
      // バックエンドキャニスターからノート一覧を取得します。
      const notes = await auth.actor.getNotes();
      setNotes(notes);
    } catch (err) {
      showMessage({
        title: 'Failed to get notes',
        status: 'error',
      });
    }
  };
```

getNotes関数は、はじめに`auth.status`を確認しています。この値が`SYNCED`ではない時、つまり認証が未完了の時はすぐに終了します。認証が完了している時は`auth.actor`を用いて、バックエンドキャニスターの`getNotes`関数を呼び出します。取得したノート一覧は、`setNotes`関数を用いて`notes`にセットします。実行中にエラーが発生した場合は、`showMessage`関数を用いてエラーメッセージを表示します。

次に、`addNote`関数内でログ出力をしている`console.log('add note');`の部分を下記のように更新しましょう。

```tsx
  const addNote = async () => {
    if (auth.status !== 'SYNCED') {
      console.error(`CryptoService is not synced.`);
      return;
    }

    setIsLoading(true);

    try {
      // バックエンドキャニスターにノートを追加します。
      await auth.actor.addNote(currentNote.data);
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
  }
```

バックエンドキャニスターのaddNote関数を呼び出します。実行中にエラーが発生した場合の処理も、getNotes関数と同様です。auth.actor.addNote関数には、`currentNote.data`を引数として渡しています。この変数は、`useState`で定義されたステート変数です。

```tsx
const [currentNote, setCurrentNote] = useState<EncryptedNote | undefined>(
  undefined,
);
```

このステート変数の値は`components/NoteModal/index.tsx`に定義されているNoteModalコンポーネントで更新されます。`setCurrentNote`関数を辿ってみてください！

### ✅ 動作確認をしよう

まずは、ノートを追加してみましょう。ノートを追加するには、右上の「＋ New Note」をクリックします。

![](/public/images/ICP-Encrypted-Notes/section-1/1_4_1.png)

モーダルが開いたら、テキストを入力して「Save」をクリックします。

![](/public/images/ICP-Encrypted-Notes/section-1/1_4_2.png)

追加したノートが表示されていたら実装は完成です！

![](/public/images/ICP-Encrypted-Notes/section-1/1_4_3.png)

### 📝 このレッスンで追加したコード

- `src/hooks/authContext.ts`

```diff
  const setupService = async (authClient: AuthClient) => {
    /** STEP2: 認証したユーザーのデータを取得します。 */
    const identity = authClient.getIdentity();

    /** STEP3: バックエンドキャニスターを呼び出す準備をします。 */
+    // 取得した`identity`を使用して、ICと対話する`agent`を作成します。
+    const newAgent = new HttpAgent({ identity });
+    if (process.env.DFX_NETWORK === 'local') {
+      newAgent.fetchRootKey();
+    }
+    // 認証したユーザーの情報で`actor`を作成します。
+    const options = { agent: newAgent };
+    const actor = createActor(canisterId, options);
+
    /** STEP5: CryptoServiceクラスのインスタンスを生成します。 */
    const cryptoService = new CryptoService();

    /** STEP7: デバイスデータの設定を行います。 */

-    setAuth({ status: 'SYNCHRONIZING' });
+    setAuth({ actor, authClient, cryptoService, status: 'SYNCED' });
  };
```

- `src/routes/notes/index.tsx`

```diff
export const Notes = () => {

  ...

  const addNote = async () => {
    if (auth.status !== 'SYNCED') {
      console.error(`CryptoService is not synced.`);
      return;
    }

    setIsLoading(true);

    try {
-      // バックエンドキャニスターにノートを追加します。
-      console.log('add note');
+      await auth.actor.addNote(currentNote.data);
+      await getNotes();
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

  ...

  const getNotes = async () => {
    if (auth.status !== 'SYNCED') {
      console.error(`CryptoService is not synced.`);
      return;
    }

    try {
      // バックエンドキャニスターからノート一覧を取得します。
-      setNotes([]);
+      const notes = await auth.actor.getNotes();
+      setNotes(notes);
    } catch (err) {
      showMessage({
        title: 'Failed to get notes',
        status: 'error',
      });
    }
  };

  ...

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

次のレッスンに進み、ノートの編集・削除機能を完成させましょう！