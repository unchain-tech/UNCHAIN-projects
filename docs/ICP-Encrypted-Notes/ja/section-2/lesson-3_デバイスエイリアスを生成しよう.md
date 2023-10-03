### 📝 デバイスエイリアスを生成しよう

デバイスエイリアスは、[UUID](https://github.com/uuidjs/uuid#readme)でランダムに生成します。以下のコマンドを実行してライブラリをインストールしましょう。

```
npm install uuid@9.0.0
npm install --save-dev @types/uuid@9.0.2
```

次に、下記のコマンドを実行して、キャニスターのデプロイを行いアプリケーションを再度起動します。

```
dfx start --clean --background
npm run deploy:local
npm run start
```

それでは、コードを実装していきましょう。ここからは`encrypted_notes_frontend/`内のファイルを更新していきます。

デバイスデータを扱うクラス`CryptoService`を、`lib/cryptoService.ts`に定義しています。このクラスはまだ未完成のため、これから実装を追加していき完成させましょう。

まずは、下記のインポート文を追加します。

```ts
import { v4 as uuidV4 } from 'uuid';
```

次に、`/** STEP4: コンストラクタを定義します。 */`の箇所に下記のコードを記述します。

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

constructorとは、クラスのインスタンスが生成された際に呼び出される関数です。この関数内で、デバイスエイリアスを生成します。[window.localStorage](https://developer.mozilla.org/ja/docs/Web/API/Window/localStorage)は、ブラウザのローカルストレージを操作するためのオブジェクトです。`getItem`関数で、deviceAliasというキーで保存されている値を取得します。まだ保存されていない場合は新たに生成して、`setItem`関数で保存します。また、constructorの引数に、`actor`を指定しました。クラス内でバックエンドキャニスターの関数を呼ぶために、CryptoServiceクラスのインスタンスを生成するタイミングでactorを渡します。

デバイスエイリアスを生成するコードを追加したので、`hooks/authContext.ts`を更新してCryptoServiceクラスを呼び出してみましょう。

`/** STEP5: CryptoServiceクラスのインスタンスを生成します。 */`の部分を下記のコードに更新します。

```ts
    /** STEP5: CryptoServiceクラスのインスタンスを生成します。 */
    const cryptoService = new CryptoService(actor);
```

これで、デバイスエイリアスを生成する機能が実装できました。

### ✅ 動作確認をしよう

ログイン操作を行なった後、ブラウザのローカルストレージにデバイスエイリアスが保存されているかを確認してみましょう。

認証時に画像のような画面が表示された場合は、「More options」をクリックするとSection1 Lesson3で操作した画面に戻ることができます。

![](/public/images/ICP-Encrypted-Notes/section-2/2_3_1.png)

認証後、アプリケーションに戻るとノート一覧の取得に失敗してエラーが発生しますが、これは`registerDevice`関数を呼び出していないためです。気にせずこのまま進みましょう。

では、ブラウザのローカルストレージを確認してみましょう。ブラウザのデベロッパーツールを開き、
1\. Applicationをクリック
2\. Storage → Local Storage → http://localhost:8000 をクリック
3\. Keyが`deviceAlias`の列を見つける

このとき、ValueにはUUIDで生成されたデバイスエイリアスが保存されていることを確認しましょう。

![](/public/images/ICP-Encrypted-Notes/section-2/2_3_2.png)

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
