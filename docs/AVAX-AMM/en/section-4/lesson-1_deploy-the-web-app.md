### 🌍 Let’s Host on a Server

Finally, let’s host your web application on [Vercel](https://vercel.com/).

Vercel is a cloud platform that provides serverless hosting capabilities.

Since Vercel handles scaling and server monitoring, developers can simply deploy to Vercel to make an application public and operational.

For a detailed explanation of Vercel, please see [this article](https://zenn.dev/lollipop_onl/articles/eoz-vercel-pricing-2020).

First, upload your local files to GitHub.

If you have not yet uploaded them, open your terminal, move to the `AVAX-AMM` directory, and run the following:
⚠️ Make sure that `.env` is listed in your `.gitignore` file.

```
git add .
git commit -m "upload to github"
git push
```

Next, confirm that the files and directories from your local `AVAX-AMM` are reflected in the GitHub `AVAX-AMM` repository.

After creating a Vercel account, follow these steps:

1\. Go to the `Dashboard` and select `New Project`.

![](/images/AVAX-AMM/section-4/4_1_1.png)

2\. In `Import Git Repository`, connect your GitHub account, select your repository, and click `Import`.

![](/images/AVAX-AMM/section-4/4_1_2.png)

3\. Create the project.

Ensure that:

- `Framework Preset` is set to `Next.js`
- `Root Directory` is `packages/client`

![](/images/AVAX-AMM/section-4/4_1_3.png)

4\. Click the `Deploy` button.

Vercel is linked with GitHub, so it will automatically redeploy whenever GitHub is updated.

After a short while, once the build is complete, you will see a message and a home screen like this:

![](/images/AVAX-AMM/section-4/4_1_4.png)

The displayed home screen section is a link — click it to open your dApp in the browser 🎉

### 🙋‍♂️ Asking Questions

If anything is unclear at this point, ask in the Discord `#avalanche` channel.

To make the help process smoother, please include the following in your error report:

```
1. The section and lesson number related to your question
2. What you were trying to do
3. The error message (copy & paste)
4. A screenshot of the error screen
```

### 🎫 Claim Your NFT

The conditions for receiving an NFT are as follows:

1. All MVP features are implemented (Implementation OK)
2. The MVP features run without issues in the web application (Testing OK)
3. Fill out the Project Completion Form linked at the end of this page
4. Share your website in the Discord `🔥｜completed-projects` channel

😉🎉 When posting to Discord, please also tell us about any additional features you implemented and their details!

NFTs will be sent to those who have completed the project.

### 🎉 Otsukaresama!

You have deployed your contract to the Avalanche Fuji C-Chain and launched an AMM web application that communicates with the contract.

Now, try adding your own unique features to the dApp 💪

We hope this project has helped you learn more about Avalanche and AMMs 🤗

We look forward to seeing your future work! 🚀

---

Project Completion Form: [Here](https://airtable.com/shrf1cCtTx0iQuszX)
