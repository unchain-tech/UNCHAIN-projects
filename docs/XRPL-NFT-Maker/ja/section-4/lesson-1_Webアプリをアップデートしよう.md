### 🪄 最小限のプロダクトを完成させよう！
今回のプロジェクトのMVP（＝最小限の機能を備えたプロダクト）を構築するNftUploader.jsxを共有します。

見やすいように少し整理整頓してあります 🧹✨
もしコードにエラーが発生してデバッグが困難な場合は、下記のコードを使用してみてください。

**`NftUploader.jsx`**

```javascript
import { Button } from "@mui/material";
import { Xumm } from "xumm";
import "./index.css";
import { useEffect, useState } from "react";
import { Buffer } from "buffer";
import { XrplClient } from 'xrpl-client'
import { NFTStorage } from "nft.storage";

const xumm = new Xumm("apikey");
const nftStorage = new NFTStorage({ token: 'token' });

export const NftMinter = () => {
  const [account, setAccount] = useState(undefined);
  const [file, setFile] = useState(undefined);

  useEffect(() => {
    xumm.on("success", async () => {
      setAccount(await xumm.user.account);
    });
  }, []);

  const connect = () => {
    xumm.authorize();
  };

  const uploadImage = (e) => {
    const files = e.target.files;
    setFile(files[0])
  };

  const mint = async () => {
    if (!file) {
      alert("画像ファイルを選択してください！");
      return;
    }
    const { url } = await nftStorage.store({
      schema: "ipfs://QmNpi8rcXEkohca8iXu7zysKKSJYqCvBJn3xJwga8jXqWU",
      nftType: "art.v0",
      image: file,
      name: "some name",
      description: "some description",
    });
    const payload = await xumm.payload.createAndSubscribe({
      TransactionType: "NFTokenMint",
      NFTokenTaxon: 0,
      Flags: 8,
      URI: Buffer.from(url).toString("hex"),
    });
    payload.websocket.onmessage = (msg) => {
      const data = JSON.parse(msg.data.toString());
      if (typeof data.signed === "boolean") {
        payload.resolve({ signed: data.signed, txid: data.txid });
      }
    };
    const { signed, txid } = await payload.resolved;
    if (!signed) {
      alert("トランザクションへの署名は拒否されました！");
      return;
    }
    const client = new XrplClient("wss://testnet.xrpl-labs.com");
    const txResponse = await client.send({
      command: "tx",
      transaction: txid,
    });
    const nftokenId = txResponse.meta.nftoken_id
    alert("NFTトークンが発行されました！");
    window.open(`https://test.bithomp.com/nft/${nftokenId}`, "_blank");
  };

  return (
    <div className="nft-minter-box">
      <div className="title">XRP NFT</div>
      <div className="account-box">
        <div className="account">{account}</div>
        <Button variant="contained" onClick={connect}>
          connect
        </Button>
      </div>
      <div className="image-box">
        <Button variant="contained" onChange={uploadImage}>
          ファイルを選択
          <input
            className="imageInput"
            type="file"
            accept=".jpg , .jpeg , .png"
          />
        </Button>
      </div>
      {file && (
          <img
            src={window.URL.createObjectURL(file)}
            alt="nft"
            className="nft-image"
          />
      )}
      {account && (
        <div>
          <Button variant="outlined" onClick={mint}>
            mint
          </Button>
        </div>
      )}
    </div>
  );
};

```

### 😎 Web アプリケーションをアップグレードする

MVPを起点にWebアプリケーションを自分の好きなようにアップグレードしましょう。

**1\. ロイヤリティを設定する**

- NFTokenMintトランザクションで`TransferFee`フィールドを追加し、ロイヤリティを設定できるようにしましょう
- tfTransferフラグ（8）が有効な場合のみロイヤリティが設定できることに注意してください
- 設定するロイヤリティの値は、入力ボックスから入力できるようにすると良いですね

**2\. SBTを発行する**

- NFTokenMintトランザクションで`Flags`フィールドからtfTransferフラグを削除し、SBTを発行できるようにしましょう。
- tfTransferフラグを切り替えるチェックボックスがあると良いですね。

**3\. メタデータ情報を入力する**

- 現在NFTのメタデータ情報（name, description）はハードコーディングされています。これをMint時に入力できるようにしましょう。


### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discordの`#xrpl`で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の3点を記載してください ✨

```
1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット
```

---

それでは、最後のレッスンに進みましょう 🎉
