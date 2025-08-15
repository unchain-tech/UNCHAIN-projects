# UNCHAIN-projects

This builder's book for web3 developers is a simple markdown filesystem that is deployed as a static website using docusaurus. Generally, you do not need to install this project to use it, as it is already [publically accessible on the web](https://buidl.unchain.tech/). 

However, as this book is open for anyone to edit and add new pages to, below are steps for anyone who wish to contribute.

## Local Development

Fetch book source.
```
git clone https://github.com/unchain-tech/UNCHAIN-projects.git
```
Install dependencies. Since the project itself is mostly a collection of markdown file documentation, this is minimal and is mostly automated proofreading related stuff.
```
yarn install 
```

Set precommit hooks. Ensures that basic proofreading check runs before each commit.
```
npx simple-git-hooks
```

Launch book locally. Most changes are reflected live without having to restart the server.
```
yarn start
```

Generates static content into the `build` directory. This output can be served using any static contents hosting service.
```
$ yarn build
```

### ✅ textlint について

文中の表記揺れや誤字を防ぐため、[textlint](https://github.com/textlint/textlint) という校正チェックツールを入れています。commit する前、PR に更新があった際に GitHub Actions にて textlint を走らせています。ルールや定義の変更がある際は、下記ファイルを変更してください。

- 表記揺れの定義： `prh.yml`
  - see: https://github.com/prh/prh
- textlint のルール定義： `.textlintrc`



# Contributors

<a href="https://github.com/unchain-tech/UNCHAIN-projects/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=unchain-tech/UNCHAIN-projects" />
</a>
