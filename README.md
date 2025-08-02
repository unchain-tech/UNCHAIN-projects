# UNCHAIN-projects

The project is in fact a simple markdown filesystem that is deployed as a static website using docusaurus.

## Local Development

```
$ yarn start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

### ✅ textlint について

文中の表記揺れや誤字を防ぐため、[textlint](https://github.com/textlint/textlint) という校正チェックツールを入れています。commit する前、PR に更新があった際に GitHub Actions にて textlint を走らせています。ルールや定義の変更がある際は、下記ファイルを変更してください。

- 表記揺れの定義： `prh.yml`
  - see: https://github.com/prh/prh
- textlint のルール定義： `.textlintrc`

## Build

```
$ yarn build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

# Contributors

<a href="https://github.com/unchain-dev/UNCHAIN-projects/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=unchain-dev/UNCHAIN-projects" />
</a>
