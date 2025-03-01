## 公開

### ✅ YOLO Vercel！

最後のステップは、フロントエンドをvercelにプッシュすることです！ これは、次のコマンドで簡単に行うことができます。このコマンドラインスイッチ「vercel --build-env NEXT_PUBLIC_IGNORE_BUILD_ERROR=true」は、基本的にビルドエラーをスキップします。

少し時間がかかるかもしれませんので、コーヒーを飲みながら待ちましょう。☕

```
yarn vercel:yolo
```

以下のプロンプトが表示されるはずです。

```
Vercel CLI 28.20.0
? Set up and deploy “~/projects/ethereum/scaffold-eth-2-subgraph-package-workshop/packages/nextjs”? [Y/n] 
y
? Which scope do you want to deploy to? myscope
? Link to existing project? [y/N] n
? What’s your project’s name? sendmessage
? In which directory is your code located? ./
Local settings detected in vercel.json:
Auto-detected Project Settings (Next.js):
- Build Command: next build
- Development Command: next dev --port $PORT
- Install Command: `yarn install`, `pnpm install`, or `npm install`
- Output Directory: Next.js default
? Want to modify these settings? [y/N] n
🔗  Linked to kevin-kevinjonescr/testing (created .vercel)
🔍  Inspect: https://vercel.com/kevin-kevinjonescr/testing/E2rfnyzC4ud5DskrwhybQ4Hiicjx [2s]
✅  Production: https://testing-red.vercel.app [3m]
📝  Deployed to production. Run `vercel --prod` to overwrite later (https://vercel.link/2F).
💡  To change the domain or build command, go to https://vercel.com/kevin-kevinjonescr/testing/settings
```

Scaffold-ETHとThe Graphについて学んでいただき、ありがとうございます。このチュートリアルを楽しんでいただけたか、また、フィードバックがあればぜひお聞かせください。The GraphのDiscordに参加して、web3の旅での質問や問題があれば気軽にご連絡ください！ 友達よ、ブロックチェーン開発（BUIDLing）を続けよう！