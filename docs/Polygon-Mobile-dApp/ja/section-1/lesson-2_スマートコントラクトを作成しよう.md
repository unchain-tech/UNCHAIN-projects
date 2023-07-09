### 👏 スマートコントラクトを作成する

コーディングの前に今回作成するto-doアプリに必要となる機能を整理しておきましょう。

1. to-doを作成する機能

2. to-doを更新する機能

3. to-doの完了・未完了を切り替える機能

4. to-doを削除する機能

それでは、以上の４点を意識しながら、コーディングに進みましょう。

`contracts`フォルダの中に`TodoContract.sol`ファイルを作成してください。

`TodoContract.sol`のファイル内に以下のコードを記載します。

```js
// TodoContract.sol
// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.9;

contract TodoContract {
    uint256 public taskCount = 0;

    struct Task {
        uint256 index;
        string taskName;
        bool isComplete;
    }

    mapping(uint256 => Task) public todos;
    //1.to-doを作成する機能
    event TaskCreated(string task, uint256 taskNumber);
    //2.to-doを更新する機能
    event TaskUpdated(string task, uint256 taskId);
    //3.to-doの完了・未完了を切り替える機能
    event TaskIsCompleteToggled(string task, uint256 taskId, bool isComplete);
    //4.to-doを削除する機能
    event TaskDeleted(uint256 taskNumber);
}

```

では、コードを詳しく見ていきましょう。

```js
// TodoContract.sol
// SPDX-License-Identifier: GPL-3.0
```

これは「SPDXライセンス識別子」と呼ばれます。

詳細については、[こちら](https://www.skyarch.net/blog/?p=15940)を参照してみてください。

```js
// TodoContract.sol
pragma solidity ^0.8.9;
```

これは、コントラクトで使用するSolidityコンパイラのバージョンです。

上記の場合「このコントラクトを実行するときは、Solidityコンパイラのバージョン0.8.6のみを使用し、それ以下のものは使用しません」という意味です。

```js
// TodoContract.sol
contract TodoContract {
  ...
}
```

`contract`は、ほかの言語でいうところの「[class](https://wa3.i-3-i.info/word1120.html)」のようなものなのです。

```js
// TodoContract.sol
    uint256 public taskCount = 0;
```

`taskCount`は、スマートコントラクト内のToDoアイテムの総数を格納する符号なしpublic整数です。

```js
// TodoContract.sol
    struct Task {
        uint256 index;
        string taskName;
        bool isComplete;
    }
```

`struct Task`は、各ToDoに関する情報（メタデータ）を格納するためのデータ構造です。これには、To-doの`id`、`taskName`、`isComplete`のブール値などが含まれています。
- `id` : To-doを識別するためのid
- `taskName` : To-doのタイトル
- `isComplete` : To-doが完了したかどうかの状態(完了したら`true`、完了してないなら`false`)

```js
// TodoContract.sol
    mapping(uint256 => Task) public todos;
```

`mapping(uint256 => Task) public todos;`は、すべてのToDoを格納するマッピングで、キーは`id`で、値は上記の`Task`です。

```js
// TodoContract.sol
    //1.to-doを作成する機能
    event TaskCreated(string task, uint256 taskNumber);
    //2.to-doを更新する機能
    event TaskUpdated(string task, uint256 taskId);
    //3.to-doの完了・未完了を切り替える機能
    event TaskIsCompleteToggled(string task, uint256 taskId, bool isComplete);
    //4.to-doを削除する機能
    event TaskDeleted(uint256 taskNumber);
```
`TaskCreated`、`TaskUpdated`、`TaskIsCompleteToggled`、`TaskDeleted`は、ブロックチェーン上に発生するイベントで、dAppはこれをリスニングし、それに応じて機能することができます。



次に以下のコードを`TodoContract`内の`event TaskDeleted(uint256 taskNumber);`下に追加してください。

1\. to-doを作成する機能

```js
// TodoContract.sol
    function createTask(string memory _taskName) public {
        todos[taskCount] = Task(taskCount, _taskName, false);
        taskCount++;
        emit TaskCreated(_taskName, taskCount - 1);
    }
```

では、コードを詳しく見ていきましょう。

```js
// TodoContract.sol
    function createTask(string memory _taskName) public {
    　...
    }
```

`createTask`関数は、to-doの`_taskName`を受け取ります。

```js
// TodoContract.sol
        todos[taskCount] = Task(taskCount, _taskName, false);
```

`taskCount`と`_taskName`で新しい`Task`構造を作成し、`todos`マップの現在の`taskCount`の値に代入することができます。

```js
// TodoContract.sol
        taskCount++;
```

to-doが作成されるたびに`taskCount`が１ずつ増えるようにしています。

```js
// TodoContract.sol
        emit TaskCreated(_taskName, taskCount - 1);
```

すべてが完了したら、`TaskCreated`イベントを`emit`する必要があります。

次に以下のコードを`TodoContract`内の`createTask`関数の下に追加してください。

2\.to-doを更新する機能

```js
// TodoContract.sol
    function updateTask(uint256 _taskId, string memory _taskName) public {
        Task memory currTask = todos[_taskId];
        todos[_taskId] = Task(_taskId, _taskName, currTask.isComplete);
        emit TaskUpdated(_taskName, _taskId);
    }
```

では、コードを詳しく見ていきましょう。

```js
// TodoContract.sol
    function updateTask(uint256 _taskId, string memory _taskName) public {
      ...
    }
```

`updateTask`関数は、更新されるto-doの`_taskId`と更新された`taskName`を受け取ります。

```js
// TodoContract.sol
        Task memory currTask = todos[_taskId];
        todos[_taskId] = Task(_taskId, _taskName, currTask.isComplete);
```

- これらの値で新しい`Task`構造を作成し、受け取った`_taskId`に対応する`todos`マップに割り当てることができます。

- 更新中に、そのto-doの`isComplete`の値を保持しておく必要があります。まず、マップから現在のタスクを取得し、それを変数に格納し、その`isComplete`値を新しいタスク・オブジェクトに使用します。

```js
// TodoContract.sol
        emit TaskUpdated(_taskName, _taskId);
```

すべてが完了したら、`TaskUpdated`イベントを`emit`する必要があります。

次に以下のコードを`TodoContract`内の`updateTask`関数の下に追加してください。

3\.to-doの完了・未完了を切り替える機能

```js
// TodoContract.sol
    function toggleComplete(uint256 _taskId) public {
        Task memory currTask = todos[_taskId];
        todos[_taskId] = Task(_taskId, currTask.taskName, !currTask.isComplete);

        emit TaskIsCompleteToggled(
            currTask.taskName,
            _taskId,
            !currTask.isComplete
        );
    }
```

では、コードを詳しく見ていきましょう。

```js
// TodoContract.sol
    function toggleComplete(uint256 _taskId) public {
      ...
    }
```

`toggleComplete`関数には、更新するto-doの`_taskId`を受け取ります。

```js
// TodoContract.sol
        Task memory currTask = todos[_taskId];
        todos[_taskId] = Task(_taskId, currTask.taskName, !currTask.isComplete);
```
- `todos`マップから`Task`オブジェクトを取得し、その値で新しい`Task`オブジェクトを作成します。

- `isComplete`を現在の`isComplete`の反対の値として設定します。

```js
// TodoContract.sol
        emit TaskIsCompleteToggled(
            currTask.taskName,
            _taskId,
            !currTask.isComplete
        );
```

すべてが完了したら、`TaskIsCompleteToggled`イベントを`emit`する必要があります。

最後に以下のコードを`TodoContract`内の`toggleComplete`関数の下に追加してください。

4\.to-doを削除する機能

```js
// TodoContract.sol
    function deleteTask(uint256 _taskId) public {
        delete todos[_taskId];
        emit TaskDeleted(_taskId);
    }
```

では、コードを詳しく見ていきましょう。

```js
// TodoContract.sol
    function deleteTask(uint256 _taskId) public {
  ...
    }
```

`deleteTask`は、削除するto-doの`_task`をパラメータとして受け取ります。

```js
// TodoContract.sol
        delete todos[_taskId];
```

受け取った`_task`に対応する`todos`マップから`Task`オブジェクトを削除します。

```js
// TodoContract.sol
        emit TaskDeleted(_taskId);
```

すべてが完了したら、`TaskDeleted`イベントを`emit`する必要があります。

スマートコントラクトの開発は以上で完了です。

あとは、コンパイルとデプロイの作業を進めるだけです。頑張っていきましょう！

### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discordの`#polygon`で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の3点を記載してください ✨

```
1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット
```

---

次のレッスンに進んで、スマートコントラクトのコンパイルとデプロイの作業を開始しましょう 🎉
