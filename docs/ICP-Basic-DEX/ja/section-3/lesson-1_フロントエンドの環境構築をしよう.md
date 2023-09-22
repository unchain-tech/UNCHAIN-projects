### 🎨 React.js の準備をしよう

`dfx`コマンドを使用して、セクション0で作成したサンプルプロジェクトの設定のままでは`React.js`を使用することができません。そのため、このレッスンではフロントエンドの環境を整えます。

まずは必要なパッケージのインストールから行っていきましょう。プロジェクトのルートディレクトリにいることを確認して、以下のコマンドを実行します。

```
npm install --save react@18.2.0 react-dom@18.2.0
```

続いて、以下のコマンドを実行しましょう。

```
npm install --save-dev @babel/core@^7.19.6 babel-loader@^9.0.0 @babel/preset-react@^7.18.6 style-loader@^3.3.1 css-loader@^6.7.1
```

次に、`icp_basic_dex_frontend/src`ディレクトリ内のファイルを編集していきます。

`index.js`ファイルを以下のように書き換えます。

[index.js]

```js
import App from './App';
import React from 'react';
import ReactDOM from 'react-dom/client';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

```

`index.js`ファイルがインポートをする`App.jsx`ファイルとスタイルをあてるCSSファイルを作成します。

```
touch ./icp_basic_dex_frontend/src/App.jsx ./icp_basic_dex_frontend/src/App.css
```

デフォルトで用意されている`icp_basic_dex_frontend/assets`ディレクトリ内の`main.css`ファイルは今回使用しないため、削除しておきます。

```
rm ./icp_basic_dex_frontend/assets/main.css
```

それでは、作成した`App.css`ファイルに以下のコードを記述しましょう。CSSの詳しい説明は割愛させていただきます。

[App.css]

```css
body {
  font-family: sans-serif;
  font-size: 1.5rem;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: rgb(178, 178, 178);
  background: rgb(39, 35, 75);
}

img {
  max-width: 50vw;
  max-height: 25vw;
  display: block;
  margin: auto;
}

ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
  overflow: hidden;
  background: rgb(8, 2, 38);
}

li {
  float: left;
  display: block;
  text-align: center;
  padding: 14px 16px;
  text-decoration: none;
}

button {
  padding: 0.4rem 1rem;
  border-radius: 10px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
}

button:hover {
  background: rgb(178, 178, 178);
  border: 1px solid rgb(8, 2, 38);
  color: rgb(8, 2, 38);
}

th,
td {
  padding: 8px;
  text-align: left;
  border-bottom: 1px solid rgb(59, 62, 106);
}

.title {
  text-align: center;
}

.title h1 {
  margin-top: 10pc;
}

.app {
  max-width: 1000px;
  margin: 4rem auto;
}

.btn-login {
  float: right;
}

.btn-green {
  border: 1px solid rgb(0, 170, 105);
  color: rgb(0, 170, 105);
  margin-right: 1rem;
}

.btn-red {
  border: 1px solid rgb(202, 0, 0);
  color: rgb(202, 0, 0);
  margin-right: 1rem;
}

.btn-blue {
  border: 1px solid rgb(19, 94, 208);
  color: rgb(19, 94, 208);
}

.user-board {
  background: rgb(41, 49, 79);
  padding: 8px;
  margin-bottom: 30px;
  border-radius: 10px;
}

.user-board table {
  border-collapse: collapse;
  width: 100%;
}

.user-board button {
  background: rgb(41, 49, 79);
}

.user-board button:hover {
  background: rgb(178, 178, 178);
}

.place-order {
  background: rgb(8, 2, 38);
  padding: 8px;
  border-radius: 10px;
  margin-bottom: 30px;
}

.place-order span {
  margin-left: 15px;
  margin-right: 30px;
}

.form {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 10px;
}

.form button {
  background: rgb(8, 2, 38);
}

.form button:hover {
  background: rgb(178, 178, 178);
}

.form > div {
  display: flex;
  justify-content: center;
  align-items: center;
}

.form input {
  padding: 0.5rem 1rem;
  border-radius: 10px;
  display: block;
  margin: 0.3rem 1rem 0 0;
  font-size: 1rem;
}

.form select {
  padding: 0.5rem 1rem;
  border-radius: 10px;
  display: block;
  margin: 0.3rem 1rem 0 0;
  font-size: 1rem;
}

.form select:invalid {
  color: rgb(178, 178, 178);
}

.form select option {
  color: black;
}

.form select option:first-child {
  color: #bbb;
}

.list-order {
  background: rgb(8, 2, 38);
  padding: 8px;
  border-radius: 10px;
  margin-bottom: 30px;
}

.list-order table {
  border-collapse: collapse;
  width: 100%;
}

.list-order button {
  background: rgb(8, 2, 38);
}

.list-order button:hover {
  background: rgb(178, 178, 178);
}
```

最後に、これまでに作成したファイルがきちんとブラウザへ反映されるように`index.html`ファイルを編集します。以下のコードで書き換えてください。

[index.html]

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width" />
    <title>icp_basic_dex</title>
    <base href="/" />
    <link rel="icon" href="favicon.ico" />
  </head>

  <body>
    <div id="root"></div>
  </body>
</html>
```

ここまでで、`icp_basic_dex_frontend`ディレクトリ下のフォルダ構成が以下のようになっているでしょう。

```diff
 icp_basic_dex_frontend/
 ├── assets/
 │   ├── favicon.ico
 │   ├── logo2.svg
-│   ├── main.css
 │   └── sample-asset.txt
 └── src/
+    ├── App.css
+    ├── App.jsx
     ├── index.html
     └── index.js
```

### 🛠 webpack.config.js を編集しよう

このレッスンの最初にインストールしたパッケージが使用できるように、また、必要なデータを環境変数としてフロントエンド側で受け取れるように`webpack.config.js`を以下の内容で上書きしてください。

```js
const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

let localEnv = true;
let network = "local";

function initCanisterEnv() {
  let localCanisters, prodCanisters;

  try {
    localCanisters = require(path.resolve(
      ".dfx",
      "local",
      "canister_ids.json"
    ));
  } catch (error) {
    console.log("No local canister_ids.json found. Continuing production");
  }
  try {
    prodCanisters = require(path.resolve("canister_ids.json"));
    localEnv = false;
  } catch (error) {
    console.log("No production canister_ids.json found. Continuing with local");
  }

  network = process.env.NODE_ENV === "production" && !localEnv ? "ic" : "local";

  const canisterConfig = network === "local" ? localCanisters : prodCanisters;

  return Object.entries(canisterConfig).reduce((prev, current) => {
    const [canisterName, canisterDetails] = current;
    prev[canisterName.toUpperCase() + "_CANISTER_ID"] =
      canisterDetails[network];
    return prev;
  }, {});
}
const canisterEnvVariables = initCanisterEnv();

const isDevelopment = process.env.NODE_ENV !== "production";

const frontendDirectory = "icp_basic_dex_frontend";

const frontend_entry = path.join("src", frontendDirectory, "src", "index.html");

module.exports = {
  target: "web",
  mode: isDevelopment ? "development" : "production",
  entry: {
    // The frontend.entrypoint points to the HTML file for this build, so we need
    // to replace the extension to `.js`.
    index: path.join(__dirname, frontend_entry).replace(/\.html$/, ".js"),
  },
  devtool: isDevelopment ? "source-map" : false,
  optimization: {
    minimize: !isDevelopment,
    minimizer: [new TerserPlugin()],
  },
  resolve: {
    extensions: [".js", ".ts", ".jsx", ".tsx"],
    fallback: {
      assert: require.resolve("assert/"),
      buffer: require.resolve("buffer/"),
      events: require.resolve("events/"),
      stream: require.resolve("stream-browserify/"),
      util: require.resolve("util/"),
    },
  },
  output: {
    filename: "index.js",
    path: path.join(__dirname, "dist", frontendDirectory),
  },

  // Depending in the language or framework you are using for
  // front-end development, add module loaders to the default
  // webpack configuration. For example, if you are using React
  // modules and CSS as described in the "Adding a stylesheet"
  // tutorial, uncomment the following lines:
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-react"],
          },
        },
      },
      //    { test: /\.(ts|tsx|jsx)$/, loader: "ts-loader" },
      { test: /\.css$/, use: ["style-loader", "css-loader"] },
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, frontend_entry),
      cache: false,
    }),
    new webpack.EnvironmentPlugin({
      DFX_NETWORK: network,
      NODE_ENV: "development",
      ...canisterEnvVariables,
    }),
    new webpack.ProvidePlugin({
      Buffer: [require.resolve("buffer/"), "Buffer"],
      process: require.resolve("process/browser"),
    }),
  ],
  // proxy /api to port 4943 during development.
  // if you edit dfx.json to define a project-specific local network, change the port to match.
  devServer: {
    historyApiFallback: true,
    proxy: {
      "/api": {
        target: "http://127.0.0.1:4943",
        changeOrigin: true,
        pathRewrite: {
          "^/api": "/api",
        },
      },
    },
    static: path.resolve(__dirname, "src", frontendDirectory, "assets"),
    hot: true,
    watchFiles: [path.resolve(__dirname, "src", frontendDirectory)],
    liveReload: true,
  },
};
```

### 🤖 package.json ファイルを編集しよう

フロントエンドの環境構築時に実行される`generate`コマンドを編集しましょう。このコマンドは、`dfx.json`ファイルに定義したキャニスターのインタフェースを生成します。生成されたファイルをフロントエンドのキャニスターが読み込むことで、バックエンド側のキャニスターとやり取りすることが可能になります。

それでは、`package.json`ファイルの`generate`コマンドを以下のように変更しましょう。

```diff
  "scripts": {
    "build": "webpack",
    "prebuild": "npm run generate",
    "start": "webpack serve --mode development --env development",
    "prestart": "npm run generate",
-    "generate": "dfx generate icp_basic_dex_backend"
+    "generate": "dfx generate GoldDIP20 && dfx generate SilverDIP20 && dfx generate faucet && dfx generate internet_identity_div && dfx generate icp_basic_dex_backend"
  },
```

### 🗂 IC のためのパッケージをインストールしよう

**dfinity**が提供する、パッケージをインストールしておきます。これらは、以降のレッスンでIC上のキャニスターとやり取りを行うフロントエンドの機能を実装するために使われます。

```
npm install --save-dev @dfinity/auth-client@^0.14.0
```

ここまでで、フロントエンドの環境構築が完了しました！

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

次のレッスンに進んで、ユーザー認証の実装を行いましょう！
