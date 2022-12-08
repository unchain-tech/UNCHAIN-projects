### ✨ Flutter でフロントを開発する（ロジック編）

※ 今回のプロジェクトではAndroid Emulatorを用いて開発します。

※ Flutterはメインではないので1行1行解説はしていきません。詳しく知りたい方は各自での学習をお願い致します。

UIとデータコントローラを構築するのに、`lib`ディレクトリに3つのファイルを作成します。

1. `TodoListModel.dart` : データモデル、コントラクト関数、UIを更新するためのノーティファイクラスが含まれます。

2. `TodoList.dart` : アプリのメインUIが含まれます。

3. `TodoBottomSheet.dart` : ToDoの作成・更新フォームが含まれます。

それではまず、Flutterのロジック部分を構築するために、1. `TodoListModel.dart`ファイルから中身を作成していきます。

`TodoListModel.dart`ファイルに、下記を追加してください。

```dart
//TodoListModel.dart
//パッケージをインポートする。
import 'dart:convert';
import 'dart:core';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:http/http.dart';
import 'package:web3dart/web3dart.dart';
import 'package:web_socket_channel/io.dart';

class TodoListModel extends ChangeNotifier {
  List<Task> todos = [];
  bool isLoading = true;
  int? taskCount;
  final String _rpcUrl = "http://127.0.0.1:7545";
  final String _wsUrl = "ws://127.0.0.1:7545/";

  //自分のPRIVATE_KEYを追加してください。
  final String _privateKey =
      "YOUR_PRIVATE_KEY";

  Web3Client? _client;
  String? _abiCode;

  Credentials? _credentials;
  EthereumAddress? _contractAddress;
  EthereumAddress? _ownAddress;
  DeployedContract? _contract;

  ContractFunction? _taskCount;
  ContractFunction? _todos;
  ContractFunction? _createTask;
  ContractFunction? _updateTask;
  ContractFunction? _deleteTask;
  ContractFunction? _toggleComplete;
}
```

`List<Task> todos = [];`の`Task`に赤波線が引かれていますが、後で定義していくので今は無視してください。

それでは、詳しく見ていきましょう。

```dart
//TodoListModel.dart
import 'dart:convert';
import 'dart:core';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:http/http.dart';
import 'package:web3dart/web3dart.dart';
import 'package:web_socket_channel/io.dart';
```

ファイルの冒頭で、必要なパッケージをインポートします。

```dart
//TodoListModel.dart
class TodoListModel extends ChangeNotifier {
   ...
}
```

`Provider`パッケージの`ChangeNotifier`クラスを継承した`TodoListModel`クラスを作成しています。

`Provider`パッケージの詳細については[こちら](https://pub.dev/packages/provider)をご覧ください。

```dart
  final String _rpcUrl = "http://127.0.0.1:7545";
  final String _wsUrl = "ws://127.0.0.1:7545/";
```

Ganacheの`_rpcUrl`と`_wsUrl`をローカル環境用に設定しています。
* Android向けにEmulatorを使ってDebugビルドをする場合は_rpcUrlを`http://10.0.2.2:7545`に変更する必要があります
> また、開発マシンのアドレス 127.0.0.1 は、エミュレータ固有のループバック インターフェースと一致することになります。開発マシンのループバック インターフェース（マシン上の別名 127.0.0.1）で実行されているサービスにアクセスする場合は、代わりに特殊アドレス 10.0.2.2 を使用する必要があります。
(参照: https://developer.android.com/studio/run/emulator-networking)


```dart
  final String _privateKey =
      "YOUR_PRIVATE_KEY";
```

Ganacheから任意のアカウントの秘密鍵を設定する（Ganache UIで鍵アイコンをクリックすると取得できますので貼り付けてください）。下記参考。

![](/public/images/Polygon-Mobile-dApp/section-2/2_2_1.jpg)

![](/public/images/Polygon-Mobile-dApp/section-2/2_2_2.png)


次に、`TodoListModel`クラス内の`ContractFunction? _toggleComplete;`の直下に下記を追加してください。

```dart
//TodoListModel.dart
  TodoListModel() {
    init();
  }

  Future<void> init() async {
    _client = Web3Client(_rpcUrl, Client(), socketConnector: () {
      return IOWebSocketChannel.connect(_wsUrl).cast<String>();
    });

    await getAbi();
    await getCredentials();
    await getDeployedContract();
  }

  //スマートコントラクトの`ABI`を取得し、デプロイされたコントラクトのアドレスを取り出す。
  Future<void> getAbi() async {
    String abiStringFile = await rootBundle
        .loadString("smartcontract/TodoContract.json");
    var jsonAbi = jsonDecode(abiStringFile);
    _abiCode = jsonEncode(jsonAbi["abi"]);
    _contractAddress =
        EthereumAddress.fromHex(jsonAbi["networks"]["5777"]["address"]);
  }

  //秘密鍵を渡して`Credentials`クラスのインスタンスを生成する。
  Future<void> getCredentials() async {
    _credentials = await _client!.credentialsFromPrivateKey(_privateKey);
    _ownAddress = await _credentials!.extractAddress();
  }

  //`_abiCode`と`_contractAddress`を使用して、スマートコントラクトのインスタンスを作成する。
  Future<void> getDeployedContract() async {
    _contract = DeployedContract(
        ContractAbi.fromJson(_abiCode!, "TodoList"), _contractAddress!);
    _taskCount = _contract!.function("taskCount");
    _updateTask = _contract!.function("updateTask");
    _createTask = _contract!.function("createTask");
    _deleteTask = _contract!.function("deleteTask");
    _toggleComplete = _contract!.function("toggleComplete");
    _todos = _contract!.function("todos");
    await getTodos();
  }
}
```

`await getTodos();`の`getTodos`に赤波線が引かれていますが、後で定義していくので今は無視してください。

それでは、詳しく見ていきましょう。

```dart
//TodoListModel.dart
  TodoListModel() {
    init();
  }

  Future<void> init() async {
    _client = Web3Client(_rpcUrl, Client(), socketConnector: () {
      return IOWebSocketChannel.connect(_wsUrl).cast<String>();
    });

    await getAbi();
    await getCredentials();
    await getDeployedContract();
  }
```

`TodoListModel`クラスのコンストラクタでは、非同期の`init`関数を呼び出しています。

`init`関数には、`_client`オブジェクトの初期化に続いて、`getAbi`、`getCredentials`、`getDeployedContract`関数を呼び出しています。

```dart
//TodoListModel.dart
  Future<void> getAbi() async {
    String abiStringFile = await rootBundle
        .loadString("smartcontract/TodoContract.json");
    var jsonAbi = jsonDecode(abiStringFile);
    _abiCode = jsonEncode(jsonAbi["abi"]);
    _contractAddress =
        EthereumAddress.fromHex(jsonAbi["networks"]["5777"]["address"]);
  }
```

`getAbi`関数では、スマートコントラクトの`ABI`を取得し、デプロイされたコントラクトのアドレスを取り出しています。

```dart
//TodoListModel.dart
  Future<void> getCredentials() async {
    _credentials = await _client!.credentialsFromPrivateKey(_privateKey);
    _ownAddress = await _credentials!.extractAddress();
  }
```

`getCredentials`関数では、秘密鍵を渡して`Credentials`クラスのインスタンスを生成しています。

※秘密鍵は暗号化して保存することが推奨されています。今回の学習では重要ではないので、簡略化するためにも、秘密鍵は文字列形式で保存しています。

```dart
//TodoListModel.dart
  Future<void> getDeployedContract() async {
    _contract = DeployedContract(
        ContractAbi.fromJson(_abiCode!, "TodoList"), _contractAddress!);
    _taskCount = _contract!.function("taskCount");
    _updateTask = _contract!.function("updateTask");
    _createTask = _contract!.function("createTask");
    _toggleComplete = _contract!.function("toggleComplete");
    _deleteTask = _contract!.function("deleteTask");
    _todos = _contract!.function("todos");
    await getTodos();
  }
```

`getDeployedContract`関数では、`_abiCode`と`_contractAddress`を使用して、スマートコントラクトのインスタンスを作成しています。

コントラクトのインスタンスができれば、上記のコードのように、スマートコントラクトにあるすべての関数のインスタンスを作成することができます。

これですべての変数を初期化できたので、次は`CRUD`操作を実装します。以下の4つを思い出してください。

1. to-doを作成する機能

2. to-doを更新する機能

3. to-doの完了・未完了を切り替える機能

4. to-doを削除する機能

`TodoListModel`クラス内の`getDeployedContract`関数の下に下記を追加してください。

```dart
//TodoListModel.dart
  //すべてのto-do項目を取得してリストに追加する。
  getTodos() async {
    List totalTaskList = await _client!
        .call(contract: _contract!, function: _taskCount!, params: []);

    BigInt totalTask = totalTaskList[0];
    taskCount = totalTask.toInt();
    todos.clear();
    for (var i = 0; i < totalTask.toInt(); i++) {
      var temp = await _client!.call(
          contract: _contract!, function: _todos!, params: [BigInt.from(i)]);
      if (temp[1] != "")
        todos.add(
          Task(
            id: (temp[0] as BigInt).toInt(),
            taskName: temp[1],
            isCompleted: temp[2],
          ),
        );
    }
    isLoading = false;
    todos = todos.reversed.toList();

    notifyListeners();
  }

  //1.to-doを作成する機能
  addTask(String taskNameData) async {
    isLoading = true;
    notifyListeners();
    await _client!.sendTransaction(
      _credentials!,
      Transaction.callContract(
        contract: _contract!,
        function: _createTask!,
        parameters: [taskNameData],
      ),
    );
    await getTodos();
  }

  //2.to-doを更新する機能
  updateTask(int id, String taskNameData) async {
    isLoading = true;
    notifyListeners();
    await _client!.sendTransaction(
      _credentials!,
      Transaction.callContract(
        contract: _contract!,
        function: _updateTask!,
        parameters: [BigInt.from(id), taskNameData],
      ),
    );
    await getTodos();
  }

  //3.to-doの完了・未完了を切り替える機能
  toggleComplete(int id) async {
    isLoading = true;
    notifyListeners();
    await _client!.sendTransaction(
      _credentials!,
      Transaction.callContract(
        contract: _contract!,
        function: _toggleComplete!,
        parameters: [BigInt.from(id)],
      ),
    );
    await getTodos();
  }

  //4.to-doを削除する機能
  deleteTask(int id) async {
    isLoading = true;
    notifyListeners();
    await _client!.sendTransaction(
      _credentials!,
      Transaction.callContract(
        contract: _contract!,
        function: _deleteTask!,
        parameters: [BigInt.from(id)],
      ),
    );
    await getTodos();
  }
```

詳しく見ていきましょう。

```dart
//TodoListModel.dart
  getTodos() async {
    List totalTaskList = await _client!
        .call(contract: _contract!, function: _taskCount!, params: []);

    BigInt totalTask = totalTaskList[0];
    taskCount = totalTask.toInt();
    todos.clear();
    for (var i = 0; i < totalTask.toInt(); i++) {
      var temp = await _client!.call(
          contract: _contract!, function: _todos!, params: [BigInt.from(i)]);
      if (temp[1] != "")
        todos.add(
          Task(
            id: (temp[0] as BigInt).toInt(),
            taskName: temp[1],
            isCompleted: temp[2],
          ),
        );
    }
    isLoading = false;
    todos = todos.reversed.toList();

    notifyListeners();
  }
```

`getTodos`では、`_taskCount`関数を呼び出してto-doの総数を取得し、ループを使ってすべてのto-do項目を取得してリストに追加しています。

すべてのto-doを取得したら、`isLoading`を`false`に設定し、Providerパッケージから`notifyListeners`を呼び出してUIを更新しています。

```dart
//TodoListModel.dart
  addTask(String taskNameData) async {
    isLoading = true;
    notifyListeners();
    await _client!.sendTransaction(
      _credentials!,
      Transaction.callContract(
        contract: _contract!,
        function: _createTask!,
        parameters: [taskNameData],
      ),
    );
    await getTodos();
  }
```

`addTask`では、タスク名をパラメータとして受け取り、`isLoading`を`true`に設定し、 `_contract`オブジェクトを使用して 、`taskNameData`をパラメータとして渡し、`_createTask`関数を呼び出すようにしています。

```dart
//TodoListModel.dart
  updateTask(int id, String taskNameData) async {
    isLoading = true;
    notifyListeners();
    await _client!.sendTransaction(
      _credentials!,
      Transaction.callContract(
        contract: _contract!,
        function: _updateTask!,
        parameters: [BigInt.from(id), taskNameData],
      ),
    );
    await getTodos();
  }
```

`updateTask`はタスクの`id`と更新された`taskNameData`を受け取り、スマートコントラクトにクレデンシャルを使用してトランザクションを作成しています。

`web3dart`パッケージは`BigInt`形式のすべての数値を必要とするため、`id`を`BigInt`のインスタンスとして送信していることに注意してください。

```dart
//TodoListModel.dart
  toggleComplete(int id) async {
    isLoading = true;
    notifyListeners();
    await _client!.sendTransaction(
      _credentials!,
      Transaction.callContract(
        contract: _contract!,
        function: _toggleComplete!,
        parameters: [BigInt.from(id)],
      ),
    );
    await getTodos();
  }
```

`toggleComplete`関数はタスクの`id`を受け取り、スマートコントラクトの`isComplete`ブール値の値を切り替えています。

```dart
//TodoListModel.dart
  deleteTask(int id) async {
    isLoading = true;
    notifyListeners();
    await _client!.sendTransaction(
      _credentials!,
      Transaction.callContract(
        contract: _contract!,
        function: _deleteTask!,
        parameters: [BigInt.from(id)],
      ),
    );
    await getTodos();
  }
```

`deleteTask`関数は、削除するタスクの`id`を受け取り、スマートコントラクトの`todos`マッピングからその特定のタスクを削除するために、コントラクトの`_deleteTask`関数を呼び出します。

`addTask`、`updateTask`、`toggleComplete`、`deleteTask`関数の最後で、`getTodos`を呼び出して、更新されたto-doリストを取得し、UIを更新しています。

また、スマートコントラクト関数を呼び出す前にローカルのto-doリストを更新して、結果を即座に表示し、バックグラウンドでリストを更新することも可能です。

ここまでで、`Task`に赤波線がいかれているかと思いますが、その`Task`を定義していきます。

`Task`は、`TodoListModel`でto-doのリストを格納するモデルクラスでです。

それでは、以下のコードを`TodoListModel.dart`ファイルの一番下に追加してください。

```dart
//TodoListModel.dart
//to-doのリストを格納するモデルクラス
class Task {
  final int? id;
  final String? taskName;
  final bool? isCompleted;
  Task({this.id, this.taskName, this.isCompleted});
}
```

以上で、Flutterのロジック部分が終わったので、次にアプリのUIを作成していきます。

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

次のレッスンに進んで、フロント側の実装（UI編）を開始しましょう 🎉
