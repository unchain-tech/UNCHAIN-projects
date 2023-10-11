### 📝 ドメインレコードの更新

スマートコントラクトではドメインレコードを更新可能にしましたが、アプリでその機能を構築していません。これを実装してみましょう。`App.js`の`mintDomain`関数の次にこの関数を追加しましょう。

```javascript
const updateDomain = async () => {
  if (!record || !domain) { return }
  setLoading(true);
  console.log('Updating domain', domain, 'with record', record);
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(CONTRACT_ADDRESS, contractAbi.abi, signer);

        let tx = await contract.setRecord(domain, record);
        await tx.wait();
        console.log('Record set https://mumbai.polygonscan.com/tx/'+tx.hash);

        fetchMints();
        setRecord('');
        setDomain('');
      }
    } catch(error) {
      console.log(error);
    }
  setLoading(false);
}
```

ここでは特に新しいトピックはないでしょう。これは`mintDomain`関数と共通するところも多いですね。 皆さんはこれまでの学習で十分習熟しているので理解できるでしょう😀

これを実際に呼び出すには、`renderInputForm`関数にさらにいくつかの変更を加えて`Set record`ボタンを表示する必要があります。

また、状態変数を使用して、Editモードであるかどうかを検出します。

下のコードでは`editing`として定義しています。



```javascript
  const App = () => {
  // 新しい状態変数を定義しています。これまでのものの下に追加しましょう。
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  // renderInputForm関数を変更します。
  const renderInputForm = () =>{
    if (network !== 'Polygon Mumbai Testnet') {
      return (
        <div className="connect-wallet-container">
          <p>Please connect to Polygon Mumbai Testnet</p>
          <button className='cta-button mint-button' onClick={switchNetwork}>Click here to switch</button>
        </div>
      );
    }

    return (
      <div className="form-container">
        <div className="first-row">
          <input
            type="text"
            value={domain}
            placeholder='domain'
            onChange={e => setDomain(e.target.value)}
          />
          <p className='tld'> {tld} </p>
        </div>

        <input
          type="text"
          value={record}
          placeholder='whats ur ninja power?'
          onChange={e => setRecord(e.target.value)}
        />
          {/* editing 変数が true の場合、"Set record" と "Cancel" ボタンを表示します。 */}
          {editing ? (
            <div className="button-container">
              {/* updateDomain関数を呼び出します。 */}
              <button className='cta-button mint-button' disabled={loading} onClick={updateDomain}>
                Set record
              </button>
              {/* editing を false にしてEditモードから抜けます。*/}
              <button className='cta-button mint-button' onClick={() => {setEditing(false)}}>
                Cancel
              </button>
            </div>
          ) : (
            // editing 変数が true でない場合、Mint ボタンが代わりに表示されます。
            <button className='cta-button mint-button' disabled={loading} onClick={mintDomain}>
              Mint
            </button>
          )}
      </div>
    );
  }
```

### 🎞 ミントレコードを取得する

さぁユーザーが購入してくれたドメインを世界に公開できます。

それを行うための関数をコントラクトに追加しました。

```javascript
// 状態を管理する mints を定義します。初期状態は空の配列です。
const [mints, setMints] = useState([]);

// mintDomain関数のあとに追加するのがわかりやすいでしょう。
const fetchMints = async () => {
  try {
    const { ethereum } = window;
    if (ethereum) {
      // もう理解できていますね。
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, contractAbi.abi, signer);

      // すべてのドメインを取得します。
      const names = await contract.getAllNames();

      // ネームごとにレコードを取得します。マッピングの対応を理解しましょう。
      const mintRecords = await Promise.all(names.map(async (name) => {
      const mintRecord = await contract.records(name);
      const owner = await contract.domains(name);
      return {
        id: names.indexOf(name),
        name: name,
        record: mintRecord,
        owner: owner,
      };
    }));

    console.log('MINTS FETCHED ', mintRecords);
    setMints(mintRecords);
    }
  } catch(error){
    console.log(error);
  }
}

// currentAccount, network が変わるたびに実行されます。
useEffect(() => {
  if (network === 'Polygon Mumbai Testnet') {
    fetchMints();
  }
}, [currentAccount, network]);
```

1. コントラクトからすべてのドメイン名
2. 取得した各ドメインのレコード
3. 取得した各ドメインの所有者のアドレス

これらを配列に入れ、配列を`mints`として設定します。

`mintDomain`関数の下部にも追加したので、ドメインを自分で作成するとアプリが更新されます。 トランザクションがマイニングされていることを確認するために2秒待っています。 これで、ユーザーは自分のミントをリアルタイムで見ることができます。

```javascript
const mintDomain = async () => {
  // domain の存在確認です。
  if (!domain) { return }
  // ドメインが短すぎる場合アラートを出します。
  if (domain.length < 3) {
    alert('Domain must be at least 3 characters long');
    return;
  }

  // ドメインの文字数で価格を計算します。
  // 3文字 = 0.005 MATIC, 4文字 = 0.003 MATIC, 5文字以上 = 0.001 MATIC
  // ご自分で設定を変えても構いませんが、現在ウォレットには少量しかないはずです。。。
  const price = domain.length === 3 ? '0.005' : domain.length === 4 ? '0.003' : '0.001';
  console.log('Minting domain', domain, 'with price', price);
  try {
      const { ethereum } = window;
      if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, contractAbi.abi, signer);

      console.log('Going to pop wallet now to pay gas...')
          let tx = await contract.register(domain, {value: ethers.utils.parseEther(price)});
      // トランザクションを待ちます
      const receipt = await tx.wait();

      // トランザクションの成功の確認です。
      if (receipt.status === 1) {
        console.log('Domain minted! https://mumbai.polygonscan.com/tx/'+tx.hash);

        // domain の record をセットします。
        tx = await contract.setRecord(domain, record);
        await tx.wait();

        console.log('Record set! https://mumbai.polygonscan.com/tx/'+tx.hash);

        // fetchMints関数実行後2秒待ちます。
        setTimeout(() => {
          fetchMints();
        }, 2000);

        setRecord('');
        setDomain('');
      } else {
        alert('Transaction failed! Please try again');
      }
      }
    } catch(error) {
      console.log(error);
    }
}
```

### 🧙 ミントされたドメインをレンダリングする

ほぼ完了です。レンダリング関数を設定します。

```javascript
// 他のレンダリング関数の次に追加しましょう。
const renderMints = () => {
  if (currentAccount && mints.length > 0) {
    return (
      <div className="mint-container">
        <p className="subtitle"> Recently minted domains!</p>
        <div className="mint-list">
          { mints.map((mint, index) => {
            return (
              <div className="mint-item" key={index}>
                <div className='mint-row'>
                  <a className="link" href={`https://testnets.opensea.io/assets/mumbai/${CONTRACT_ADDRESS}/${mint.id}`} target="_blank" rel="noopener noreferrer">
                    <p className="underlined">{' '}{mint.name}{tld}{' '}</p>
                  </a>
                  {/* mint.owner が currentAccount なら edit ボタンを追加します。 */}
                  { mint.owner.toLowerCase() === currentAccount.toLowerCase() ?
                    <button className="edit-button" onClick={() => editRecord(mint.name)}>
                      <img className="edit-icon" src="https://img.icons8.com/metro/26/000000/pencil.png" alt="Edit button" />
                    </button>
                    :
                    null
                  }
                </div>
          <p> {mint.record} </p>
        </div>)
        })}
      </div>
    </div>);
  }
};

// edit モードを設定します。
const editRecord = (name) => {
  console.log('Editing record for', name);
  setEditing(true);
  setDomain(name);
}
```

`mints.map`部分では、`mints`配列内の各アイテムを取得し、そのためのHTMLをレンダリングします。 実際のHTMLの項目の値を`mint.name`と`mint.id`で使用します。この関数は、他のすべてのレンダリング関数で呼び出すことができます。

レンダリングセクションはまとめれば次のようなロジックです。

```javascript
{!currentAccount && renderNotConnectedContainer()}
{currentAccount && renderInputForm()}
{mints && renderMints()}
```

複数ミントされている場合、画面は次のようなものになります。

![](/public/images/Polygon-ENS-Domain/section-4/4_1_4.png)

いい感じですね。

鉛筆の箇所をクリックすると編集できます。


所有する各ドメインのレコードを編集できます。

![](/public/images/Polygon-ENS-Domain/section-4/4_1_5.png)

更新しようとするとトランザクションが発生します。

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
おつかれさまでした!! あなたのフロントエンドをスクリーンショットして、Discordの`polygon-ens-domain`にシェアしてください✨

次のレッスンでは、あなたのWebアプリをVercelにデプロイしていきます!
