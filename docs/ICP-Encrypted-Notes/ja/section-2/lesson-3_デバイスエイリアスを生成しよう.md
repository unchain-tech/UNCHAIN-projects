### 📝 デバイスエイリアスを生成しよう

それでは早速、デバイスエイリアスを生成する機能を実装していきましょう。ここからはフロントエンドキャニスターのコードを更新していきます。下記のコマンドを実行して、アプリケーションを起動しましょう。

```bash
dfx start --clean --background
dfx deploy
npm run start
```

デバイスエイリアスは、[UUID](https://github.com/uuidjs/uuid#readme)でランダムに生成します。新しくターミナルを開き、以下のコマンドを実行してライブラリをインストールします。

```bash
npm install uuid@9.0.0
npm install --save-dev @types/uuid@9.0.2
```

`lib/cryptoService.ts`を更新していきましょう。まずは、下記のインポート文を追加します。

```ts
import { v4 as uuidV4 } from 'uuid';
```

`/** STEP4: コンストラクタを定義します。 */`の箇所に、下記のコードを記述します。

```ts
　/** STEP4: コンストラクタを定義します。 */
  constructor(actor: ActorSubclass<_SERVICE>) {
    this.actor = actor;

    this.deviceAlias = window.localStorage.getItem('deviceAlias');
    if (!this.deviceAlias) {
      this.deviceAlias = uuidV4();
      window.localStorage.setItem('deviceAlias', this.deviceAlias);
    }
  }
```

constructorとは、クラスのインスタンスが生成された際に呼び出される関数です。この関数内で、デバイスエイリアスを生成します。[window.localStorage](https://developer.mozilla.org/ja/docs/Web/API/Window/localStorage)は、ブラウザのローカルストレージを操作するためのオブジェクトです。`getItem`関数で、deviceAliasというキーで保存されている値を取得します。まだ保存されていない場合は新たに生成して、`setItem`関数で保存します。

では、`hooks/authContext.ts`を更新して、CryptoServiceクラスを呼び出してみましょう。

`/** STEP5: CryptoServiceクラスのインスタンスを生成します。 */`の部分を下記のコードに更新します。

```ts
    /** STEP5: CryptoServiceクラスのインスタンスを生成します。 */
    const cryptoService = new CryptoService(actor);
```

これで、デバイスエイリアスを生成する機能が実装できました。

### ✅ 動作確認をしよう

ログイン操作を行なった後、ブラウザのローカルストレージにデバイスエイリアスが保存されているかを確認してみましょう。

<!-- TODO：ブラウザの画像を追加 -->

この時、ノート一覧の取得に失敗してエラーが発生していますが、これは`registerDevice`関数をまだ呼び出していないためです。このまま進みましょう。

ブラウザのローカルストレージを確認してみましょう。
Application -> Storage -> Local Storage -> http://localhost:8000 -> key, valueのペアが表示されていることを確認します。

<!-- TODO：ブラウザの画像を追加 -->

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

次のレッスンに進み、キーペアを生成しましょう。