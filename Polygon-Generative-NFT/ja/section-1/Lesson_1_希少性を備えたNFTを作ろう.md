💠 希少性を備えたジェネレーティブNFTアートを作成する
---

[Cryptopunks](https://www.larvalabs.com/cryptopunks) （クリプトパンクス）や [Bored Ape Yacht Club](https://boredapeyachtclub.com/#/)（BAYC：ボアードエイプ・ヨットクラブ）などの NFT プロジェクト を知っていますか？

これらのプロジェクトは、数億ドルの収益を生み出し、所有者の一部は億万長者となっています。

[Cryptopunks](https://www.larvalabs.com/cryptopunks) （クリプトパンクス）
![](https://i.imgur.com/ERhPTqc.jpg)

[Bored Ape Yacht Club](https://boredapeyachtclub.com/#/)（BAYC：ボアードエイプ・ヨットクラブ）
![](https://i.imgur.com/CLOwGX4.jpg)

これらは、数量が限られたアバターのコレクションです。

各アバターは一意（ユニーク）であり、一連の特徴（肌の色、髪型など）を持っています。

**さまざまな特徴を画像として作成した後、コードよってそれらを組み合わせ生成する NFT のことを Generative Art NFT と呼びます。**

今回のレッスンでは、Cryptopunk や BAYC のような希少性を備えた Generative Art の NFT コレクションを作成する方法を学びます。

✍️: NFT に関する詳しい説明は、[こちら](https://github.com/yukis4san/Intro-NFT/blob/main/section-1/NFT-S1-lesson-1.md) をご覧ください。

💻 Python と pip をインストールする
---

Generative Art を作成するために、[こちら](https://github.com/yukis4san/generative-nft-library) のライブラリを使用します。

このライブラリは Python で書かれているので、あなたのコンピュータに Python をインストールする必要があります。また、Python で使用するパッケージをインストールしてくれる pip も必要です。

🤩: 注意
> **このレッスンを進めるのに、Python やその他のプログラミング言語を知る必要はありません。**

まず、[こちら](https://and-engineer.com/articles/YcJyaRAAACMAl3BX) のウェブサイトを参考に、最新版の Python3 をダウンロードしてください。

ダウンロードが完了したら、ターミナルで下記を行して、Python3 のバージョンを確認してください。

```javascript
// Python のバージョンを確認
python3 -V
```

下記のようにターミナルに出力されていれば、Python のダウンロードは成功です。

```
Python 3.10.2
```
- 最新のバージョンでない場合は、`warning` が表示されるので、指示に従って、Python3 を最新版に更新しましょう。

次に、ターミナルで下記を行して、pip のバージョンを確認してください。

```javascript
// pip のバージョンを確認
python3 -m pip list
```

下記のようにターミナルに出力されていれば、pip のダウンロードは成功です。

```
Package    Version
---------- ---------
certifi    2021.10.8
pip        22.0.3
setuptools 58.1.0
```
- 最新のバージョンでない場合は、`warning` が表示されるので、指示に従って、pip を最新版に更新しましょう。

次に、ターミナルで下記を実行して、Generative Art を生成する際に使用するライブラリをインストールしてください。

```
pip install Pillow pandas progressbar2
```

この処理により、`generative-nft-library` ライブラリを動かすのに必要な下記 3 つの Python3 パッケージがあなたの環境にインストールされます。

- Pillow: 画像処理ライブラリで、特徴的な画像を合成するのに役立ちます。

- Pandas: データ解析ライブラリで、画像のメタデータの生成と保存を支援します。

- Progressbar: 画像生成の進捗状況を表示するライブラリです。


🍽 Git レポジトリをあなたの Github にフォークする
------------------

まだ Github のアカウントをお持ちでない方は、[こちら](https://qiita.com/okumurakengo/items/848f7177765cf25fcde0) の手順に沿ってアカウントを作成してください。

Github のアカウントをお持ちの方は、[こちら](https://github.com/yukis4san/generative-nft-library) から、`generative-nft-library` リポジトリをあなたの Github にフォークしましょう。

あなたの Github アカウントにフォークした `generative-nft-library` レポジトリを、あなたのローカル環境にクローンしてください。

まず、下図のように、`Code` ボタンをクリックして、`SSH` を選択し、git リンクをコピーしましょう。
![](https://i.imgur.com/wQWXafW.png)

ターミナルで任意のディレクトリに移動し、先ほどコピーしたリンクを貼り付け、下記を実行してください。

```bash
git clone コピーした_github_リンク
```

下記のように、あなたのローカル環境に、ライブラリがクローンされたことが確認できたら、次のステップに進みましょう。

![](https://i.imgur.com/e8JTSdG.png)

🐿 Scrappy Squirrels を生成する
----

今回は、「Scrappy Squirrels」プロジェクトに使用されたデータを使って、Generative Art を生成していきます。

「Scrappy Squirrels」は 85 以上の特徴を用いて生成されています。

以下はそのサンプルです。

![](https://i.imgur.com/p0GSVIR.png)

「Scrappy Squirrels」は、下記のような PNG 画像を重ねて生成されます。

![](https://i.imgur.com/ICPIusw.png)

上図の右上から時計回りに、画像を順番に重ねていくと、中央の画像が作成されます。

この処理を実行する上で、下記の点に注意しましょう。

- 各特徴画像は（最終的なアバターも）同じ大きさである必要があります。

- 背景の特徴（左上の画像）以外の特徴画像は、背景が透明である必要があります。

- 正しいアバターを作るには、右上から時計回りに特徴画像を重ねる必要があります。

- 特徴画像は、他の特徴画像とうまく重なるように描かれている必要があります。

- どの特徴も同じカテゴリの他の特徴と入れ替えることができます（例えば、青い服を赤い服と入れ替える）。したがって、各カテゴリの特徴が10個ずつあれば、理論的には1億匹の異なるアバターを作り出すことができます。

オリジナルで画像を作成する場合、さまざまな特徴カテゴリを作成し、それに付随する画像を複数作成します。

ただし、特徴カテゴリの数が増えると、可能な組み合わせの数も指数関数的に増えていくことに注意してください。

「Scrappy Squirrels」プロジェクトでは、下記のように 8 つの特徴カテゴリを作成します。

![](https://i.imgur.com/9iXXjCT.png)

各特徴のカテゴリごとに、特徴的な画像の数は様々です。

例えば、特徴のカテゴリ「Shirt（シャツ）」には下記のように、複数の種類の画像を格納することができます。

※ 現在のサンプルでは、簡単のため `blue_dot.png` のみが格納されています。

![](https://i.imgur.com/On0m7lA.png)

今回使用する特徴カテゴリとそれに付随する画像は、あなたのローカル環境に `git clone` した `generative-nft-library` の `asset` フォルダの中にあります。

下記のディレクトリ構造を参考に、中身を確認してみてください。

```
generative-nft-library
		|_ assets
			  |_ Background
			  |_ Expressions
			  |_ Head
			  	   :
```

🪄 `config.py` ファイルを設定する
----

アバターコレクションを生成する最後のステップです。`generative-nft-library/config.py` を開き、以下の説明に従ってファイルを埋めていきましょう。

まず、`config.py` の中身が下記のように始まることを確認してください。

```py
CONFIG = [
    {
        'id': 1,
        'name': 'background',
        'directory': 'Background',
        'required': True,
        'rarity_weights': None,
    },
    :
```

`config.py` ファイルは `CONFIG` という 1 つの Python 変数により作成されます。

`CONFIG` は `[]` でカプセル化されている Python のリストです。

積み重ねる特徴カテゴリの順番に沿って、カテゴリそれぞれのリストが含まれています。

順番は、`assets` フォルダに格納されている特徴カテゴリフォルダの順番に起因しています。

![](https://i.imgur.com/cuHe2Vj.png)


**ここでの順序は非常に重要です。**

それでは、以下のように、`config.py` を新しく設定していきましょう。

```javascript
// config.py
CONFIG = [
    {
        'id': 1,
        'name': 'background',
        'directory': 'Background',
        'required': True,
        'rarity_weights': None,
    },
    {
        'id': 2,
        'name': 'body',
        'directory': 'Body',
        'required': True,
        'rarity_weights': None
    },
    {
        'id': 3,
        'name': 'eyes',
        'directory': 'Expressions',
        'required': True,
        'rarity_weights': None
    },
    {
        'id': 4,
        'name': 'head_gear',
        'directory': 'Head Gear',
        'required': False,
        'rarity_weights': 'random'
    },
    {
        'id': 5,
        'name': 'clothes',
        'directory': 'Shirt',
        'required': False,
        'rarity_weights': None
    },
    {
        'id': 6,
        'name': 'held_item',
        'directory': 'Misc',
        'required': True,
        'rarity_weights': None,
    },
    {
        'id': 7,
        'name': 'hands',
        'directory': 'Hands',
        'required': True,
        'rarity_weights': None,
    },
    {
        'id': 8,
        'name': 'wristband',
        'directory': 'Wristband',
        'required': False,
        'rarity_weights': [100, 5, 5, 5, 15, 5, 1]
    },
]
```

各特徴カテゴリ（例: `Background` ）は `{}` でカプセル化された Python の `dictionary`として記載されています。

ここでは、特性カテゴリ `dictionary` を `CONFIG` リストで順番に定義しています。

特性カテゴリ `dictionary` には 5 つのキーが必要です。

これらは、`id`、`name`、`directory`、`required`、および`rarity_weights`です。

各キーについて詳しく見ていきましょう。


- `id` : 重ねる画像レイヤーを識別する番号です。例えば、`Background` が 1 番目に重ねる特性カテゴリ（＝レイヤー）であれば、`id` は `1`となります。 **なお、レイヤーは `assets` フォルダに格納されている特徴カテゴリの並び順に沿って定義されるる必要があります。**

- `name` : 特性カテゴリの名前です。任意の名前を付けることができます。メタデータに表示されます。`directory` の名前と一致される必要はありません。

- `directory`: `assets` 内のフォルダ名です。その特徴カテゴリに付随する画像が格納されています。

- `required` : 任意の特徴カテゴリがすべての画像に必要である場合は `True` 、そうでない場合は、`False` を設定します。

	特定の特徴カテゴリ（ `Background`、`Body`、など）はすべてのアバターに表示する必要があるので、`True` と設定しています。

	その他のカテゴリ（`Head Gear`、`Wristband`、など）はオプションなので、`False` と設置しています。**1番目のレイヤーの `required` の値を `True` に設定することを強くお勧めします。**

- `rarity_weights`: 任意の特徴カテゴリがどの程度「希少」であるかを決定します。後に詳しく説明していきます。

⚠️: 注意
> オリジナルで特徴カテゴリや画像を設定する場合、新しいレイヤーを作成するとき（または、既存のレイヤーを置き換えるとき）は、これらの 5 つのキーがすべて定義されていることを確認しましょう。

💎 特徴の希少性を設定する
---

`rarity_weights` キーは下記 3 つの値を取ることができます。

- `None`、`'random'`、Python リスト

それぞれの値を一つずつ見ていきましょう。

1 \. **`None`**

- `rarity_weights` の値を `None` に設定すると、**各特徴に等しい重みが割り当てられます。**

- したがって、8 つの特徴カテゴリが存在する場合、`required` を `False`、`rarity_weights` を `None` とした特徴カテゴリはおよそ全体の 12.5% のアバターに現れることになります。

		100 (%) / 8 （特徴カテゴリ）= 12.5 (特徴カテゴリの反映率)

- `required` が `False` の場合、その特定の特徴を全く得られない可能性も等しくなります。

- 先ほどのケースで、`required` を `False`、`rarity_weights` を `None` とした特徴カテゴリはおよそ 11.1 %のアバターに出現することになります。

- さらに 11.1% のアバターには、その特徴が全くないことになります。

2 \.**`'random'`**

`rarity_weights` に `'random'`（ `''` は必須）を設定すると、**各特徴カテゴリにランダムに重みが付けられます。**

**この機能は使用しないことを強くお勧めします。**

⚠️: 注意
>ここでは、ライブラリの仕様として `'random'` が存在することだけ紹介しています。
>
>`config.py` では、ライブラリの動作を確認するために、特徴カテゴリー `Head Gear` に `'random'` を設定しています。

3 \. **Python リスト**

Python リストは、`rarity_weights` の重みを割り当てる最も一般的な方法です。

それでは、`assets` の中の特徴カテゴリフォルダ `Wristbands` に下記のような 6 つの画像が格納されているのを確認しましょう。

**これらの画像を `Name` で昇順（アルファベット順）にソートすると、次のようになります。**

![](https://i.imgur.com/7N7OgJ1.png)


次に、`config.py` の `Wristbands` に定義した `rarity_weights` を見てみましょう。

```javascript
// config.py
{
	'id': 8,
	'name': 'wristband',
	'directory': 'Wristband',
	'required': False,
    'rarity_weights': [100, 5, 5, 5, 15, 5, 1]
},
```

`'rarity_weights'` に設定されているリスト `[100, .., , 1]` では、各数値（＝重み）が、特徴カテゴリー `Wristband` の中の画像に昇順で割り当てられています。

`required` が `True` の場合、重みの数は、特徴カテゴリー `Wristband` の画像の数と同じする必要があります。

> ✍️: `required` が `True` の場合
> 特徴カテゴリー `Wristband` の画像の数は 6 枚なので、
> ```
> 'rarity_weights': [リストの中には 6 つの重みが設定される]
> ```

`required` が `False` に設定されている場合、重みの数は特徴の数に 1 を足した数になります。

- `'required': False` の場合、最初の重みは、 **`Wristbands` を持たない場合の希少性を示す重みとなります。**

✍️: 要約

>リストバンドが必須であれば（ `'required': True` ）、リスト内に 6 個の重みを定義し、必須でなければ（ `'required': False` ）、7 個の重みを定義することになります。

今回の例では、`Wristband` は、`'required': False` と設定されているので、**この特徴カテゴリーは最終的に画像を生成する際、必須で表示される必要はありません。**

よって、下記のように、7 個の重み（ 6 種類のリストバンド ＋ 1 ）を設定しました。

```
'rarity_weights': [100, 5, 5, 5, 15, 5, 1]
```

最初の重み（ `100` ）は、リストバンドをつけない場合の重みになります。

2 つ目の重みは黒（ `black.png` ）のバンド、3 つ目の重みは白のバンド（ `white.png` ）、といった具合に関連付けを行なっています。

![](https://i.imgur.com/7N7OgJ1.png)

**重みの値が大きいほど、特定の特徴がよく見られます。**

✍️: 重みと希少性の感性は以下のようになります。

	特徴画像の重みの値が大きけ ＝ その特徴を持つ画像の希少性が低い

この例では、「黒のバンド」は `5`、「リストバンドなし」は `100` の重みを持っています。

**つまり、アバターが黒のリストバンドを持つことは、持たないことの 20 倍の希少価値があるということになります。**

🍳 Generative Art を生成する
---

`config.py` ファイルの中身を更新したら、Generative Art を生成しましょう。

まず、ターミナル（またはコマンドプロンプト）を開き、`generative-nft-library` フォルダに移動してください。

ここで、以下のコマンドを実行します。

```
python3 nft.py
```

このコマンドを実行すると、画像生成プログラムが起動します。

このプログラムは、まずユーザーに作成したいアバターの数をターミナルに入力してもらいます。

その後、指定の数のアバターを生成したら、重複するものを排除します。

最終的には、ユニークなアバターのみを `output` フォルダに格納します。

以下のステップでプログラムが実行されるので、ターミナルに表示される指示に従いながら、アバターの生成を行なってください。

- まず、`nft.py` が `config.py` が有効かどうかをチェックします。

- 次に、可能な組み合わせの総数が表示されます。

- 次に、作成したいアバターの数を入力します。

- 作成したいアバターの数より20％大きい数を入力すると、重複を排除した後でも十分余るのでおすすめです。

- コレクションに任意の名前をつけます。これにより、アバターの生成プロセスが開始されます。

ターミナルに下記のような結果が表示されているのを確認しましょう。

```
Checking assets...
Assets look great! We are good to go!

You can create a total of 56 distinct avatars

How many avatars would you like to create? Enter a number greater than 0: 100
What would you like to call this edition?: first-collection
Starting task...
100% (100 of 100) |######################| Elapsed Time: 0:00:10 Time:  0:00:10
Generated 100 images, 30 are distinct
Removing 70 images...
Saving metadata...
Task complete!
```

ここでは、まず、100 体のアバターを生成することをターミナルに入力し、最終的に30 体のユニークなアバターを取得しています。

70 体のアバターは重複していたため、排除されました。

⚠️: 注意
> 下記のいずれかの数が増えるほど、画像生成プログラムの処理時間が長くなります。
>
>- 特徴カテゴリの
>- それぞれのカテゴリに格納する画像
>- 生成するアバター
>
> 1200 体のアバターを生成する場合は、約 30 分かかります。

👀 生成されたアバターを確認する
---

`generative-nft-library` に向かい、新しく作成された `output` フォルダを見ていきましょう。

`What would you like to call this edition?` で命名した `edition` は下記のように保存されています。

![](https://i.imgur.com/hr2pPKZ.png)


`edition` フォルダの中の `images` フォルダを開き、下記のように、ユニークな「Scrappy Squirrels」のアバターが格納されていることを確認しましょう。

![](https://i.imgur.com/UOVRYiu.png)

あなたのコレクションの中に `metadata.csv` が存在しているかと思います。

このCSVファイルは、下記のようになっています。

```
	,background	,body	,eyes		,head_gear, ...
0	,white		,maroon	,standard	,none,		...
1	,white		,maroon	,standard	,none,		...
2	,blue		,maroon	,standard	,std_lord,	...
3	,blue		,maroon	,standard	,std_lord,	...
:
```

`metadata.csv` を使えば、特徴カテゴリごとに、それぞれのアバターにどんな画像が紐づいているか調べることができます。

- どの特徴が一番希少性が高いか、どの特徴の組み合わせが最も多いかなど、生成されたアバターを分析する際に役立ちます。

🙋‍♂️ 質問する
-------------------------------------------
ここまでの作業で何かわからないことがある場合は、Discord の `#section-1-help` で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の3点を記載してください✨
```
1. 何をしようとしていたか
2. エラー文をコピー&ペースト
3. エラー画面のスクリーンショット
```
-------------------------------------------
Generative Art が作成できたら、次のレッスンに進みましょう🎉
