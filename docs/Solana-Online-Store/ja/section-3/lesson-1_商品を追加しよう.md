### 🐱 商品を追加しよう!

オンラインショップの完成は間近です!

さいごに、ショップのオーナーであるあなたが **フロントエンドから** ショップにアイテムを追加できる機能を追加します。

まず、プロジェクトのルートディレクトリに`.env`ファイルを作成し、そこにアドレスを追加します。

私の場合、`.env`ファイルは以下のようになります。

```code
// .env
NEXT_PUBLIC_OWNER_PUBLIC_KEY=2TmQsWGFh5vhqJdDrG6uA2MRstGrUwUCiiThyHL9HaMe
```

> ⚠️ 注意
>
> Next.js には [dotenv](https://www.dotenv.org/) が組み込まれていますが、env 変数名を`NEXT_PUBLIC`からはじめる必要があります。
>
> また、`.env`への変更を反映させるためには、Next.js を再起動（`CTR + C`で一旦停止させ、`yarn dev`で再び立ち上げる）する必要があることに注意してください。

それでは、`components`フォルダに`CreateProduct.js`ファイルを作成して以下のコードを貼り付けてください。

```jsx
// CreateProduct.js

import { useState } from "react";
import { create } from "ipfs-http-client";
import styles from "../styles/CreateProduct.module.css";

const client = create("https://ipfs.infura.io:5001/api/v0");

const CreateProduct = () => {

  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    image_url: "",
    description: "",
  });
  const [file, setFile] = useState({});
  const [uploading, setUploading] = useState(false);

  async function onChange(e) {
    setUploading(true);
    const files = e.target.files;
    try {
      console.log(files[0]);
      const added = await client.add(files[0]);
      setFile({ filename: files[0].name, hash: added.path });
    } catch (error) {
      console.log("Error uploading file: ", error);
    }
    setUploading(false);
  }

  const createProduct = async () => {
    try {
      // 商品データとfile.nameを結合します。
      const product = { ...newProduct, ...file };
      console.log("Sending product to api",product);
      const response = await fetch("../api/addProduct", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
      });
      if (response.status === 200) {
        alert("Product added!");
      }
      else{
        const data = await response.json();
        alert("Unable to add product: ", data.error);
      }

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={styles.background_blur}>
      <div className={styles.create_product_container}>
        <div className={styles.create_product_form}>
          <header className={styles.header}>
            <h1>Create Product</h1>
          </header>

          <div className={styles.form_container}>
            <input
              type="file"
              className={styles.input}
              accept=".jpg,.png"
              placeholder="Images"
              onChange={onChange}
            />
            {file.name != null && <p className="file-name">{file.filename}</p>}
            <div className={styles.flex_row}>
              <input
                className={styles.input}
                type="text"
                placeholder="Product Name"
                onChange={(e) => {
                  setNewProduct({ ...newProduct, name: e.target.value });
                }}
              />
              <input
                className={styles.input}
                type="text"
                placeholder="0.01 USDC"
                onChange={(e) => {
                  setNewProduct({ ...newProduct, price: e.target.value });
                }}
              />
            </div>

            <div className={styles.flex_row}>
              <input
                className={styles.input}
                type="url"
                placeholder="Image URL ex: https://media.giphy.com/media/FWAcpJsFT9mvrv0e7a/giphy.gif"
                onChange={(e) => {
                  setNewProduct({ ...newProduct, image_url: e.target.value });
                }}
              />
            </div>
            <textarea
              className={styles.text_area}
              placeholder="Description here..."
              onChange={(e) => {
                setNewProduct({ ...newProduct, description: e.target.value });
              }}
            />

            <button
              className={styles.button}
              onClick={() => {
                createProduct();
              }}
              disabled={uploading}
            >
              Create Product
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateProduct;
```

次に、`index.js`を以下のとおり更新して、登録したアドレスとメッセージ送信者のアドレスが一致するのを確認できるようにしましょう（ここでショップのオーナーを確認します）。

```jsx
// index.js

import { useState, useEffect} from "react";
import CreateProduct from "../components/CreateProduct";
import Product from "../components/Product";
import HeadComponent from '../components/Head';

import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

// 定数を宣言します。
const TWITTER_HANDLE = "あなたのTwitterハンドル";
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {
  const { publicKey } = useWallet();
  const isOwner = ( publicKey ? publicKey.toString() === process.env.NEXT_PUBLIC_OWNER_PUBLIC_KEY : false );
  const [creating, setCreating] = useState(false);
  const [products, setProducts] = useState([]);

  const renderNotConnectedContainer = () => (
    <div>
      <img src="https://media.giphy.com/media/FWAcpJsFT9mvrv0e7a/giphy.gif" alt="anya" />

      <div className="button-container">
        <WalletMultiButton className="cta-button connect-wallet-button" />
      </div>
    </div>
  );

  useEffect(() => {
    if (publicKey) {
      fetch(`/api/fetchProducts`)
        .then(response => response.json())
        .then(data => {
          setProducts(data);
          console.log("Products", data);
        });
    }
  }, [publicKey]);

  const renderItemBuyContainer = () => (
    <div className="products-container">
      {products.map((product) => (
        <Product key={product.id} product={product} />
      ))}
    </div>
  );

  return (
    <div className="App">
      <HeadComponent/>
      <div className="container">
        <header className="header-container">
          <p className="header"> 😳 UNCHAIN Image Store 😈</p>
          <p className="sub-text">The only Image store that accepts shitcoins</p>

          {isOwner && (
            <button className="create-product-button" onClick={() => setCreating(!creating)}>
              {creating ? "Close" : "Create Product"}
            </button>
          )}
        </header>

        <main>
          {creating && <CreateProduct />}
          {publicKey ? renderItemBuyContainer() : renderNotConnectedContainer()}
        </main>

        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src="twitter-logo.svg" />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built on @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
```

これで、オーナーと同じウォレットで接続すると、右上に`Create Product`ボタンが表示されるはずです。

最後に、データベースにAPIエンドポイントを追加しましょう。

`pages/api`フォルダに`addProduct.js`ファイルを作成して以下のコードを貼り付けてください。

```jsx
// addProduct.js

import products from './products.json';
import fs from "fs";

export default function handler(req, res){
  if (req.method === "POST"){
    try {
      console.log("body is ", req.body)
      const { name, price, image_url, description, filename, hash } = req.body;

      // 前回のプロダクトIDを元に新しいプロダクトIDを作成します。
      const maxID = products.reduce((max, product) => Math.max(max, product.id), 0);
      products.push({
        id: maxID + 1,
        name,
        price,
        image_url,
        description,
        filename,
        hash,
      });
      fs.writeFileSync("./pages/api/products.json", JSON.stringify(products, null, 2));
      res.status(200).send({ status: "ok" });
    } catch (error) {
      console.error(error);
      res.status(500).json({error: "error adding product"});
    }
  }
  else {
    res.status(405).send(`Method ${req.method} not allowed`);
  }
}
```

これでアイテムを追加することができるようになりました!

※値段の欄には数字だけを入れるよう、注意してください。

![Create Product](/public/images/Solana-Online-Store/section-3/3_1_1.jpg)


### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discordの`#solana`で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の4点を記載してください ✨

```
1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット
```

---

おめでとうございます!

セクション3は終了です!

ぜひ、新しく追加した商品が表示されている状態のWebアプリケーションの画面をコミュニティに投稿してください!

あなたの成功をコミュニティで祝いましょう 🎉

次のセクションでは、最後の仕上げを行っていきます!
