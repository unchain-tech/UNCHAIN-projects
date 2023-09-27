### 🦄 Minting NFTs for Whitelisted Users

The coding part is finally complete, congratulations! Now it's time to enjoy the results.

Now let's start up the front end. Make sure you are under `client/` and execute the following command:

```
yarn install
yarn dev
```

![](/public/images/Polygon-Whitelist-NFT/section-4/4_3_9.png)

Next, open "Port Manager" and click "Add Port".

![](/public/images/Polygon-Whitelist-NFT/section-4/4_3_10.png)

Select `Polygon (Ubuntu)` for Select Sandbox and enter `3000` (the port number displayed on the Sandbox) for Port. After completing the settings, click "Add".

![](/public/images/Polygon-Whitelist-NFT/section-4/4_3_11.png)

After confirming that the port information has been added, click on the icon below to access the application. A new tab will open.

![](/public/images/Polygon-Whitelist-NFT/section-4/4_3_12.png)

⚠️ It may take a few minutes before you can access the site from your browser. If you receive an error message similar to the one below, please wait a few minutes and try accessing the site again.

![](/public/images/Polygon-Whitelist-NFT/section-4/4_3_13.png)

If you have access to the application, start by clicking "connect" to link your Metamask account (make sure it's whitelisted).

![image-20230223160640040](/public/images/Polygon-Whitelist-NFT/section-4/4_3_1.png)

Next, click "mint" and a pop-up from MetaMask will appear. Click "Confirm".

![image-20230223160943332](/public/images/Polygon-Whitelist-NFT/section-4/4_3_2.png)

After successfully minting, if you are the owner, you can click "withdraw" to retrieve the tokens from the contract.

Alright, it's time to check out the NFT Collection you've created on OpenSea. Enter the following URL in your browser: `https://testnets.opensea.io/assets/mumbai/0x86b5cf393100cf895b3371a4ccaa1bc95d486a56/1`. Replace "`0x86b5cf393100cf895b3371a4ccaa1bc95d486a56`" with your contract address, and you'll be able to see the first NFT in your Collection.

![image-20230223163340534](/public/images/Polygon-Whitelist-NFT/section-4/4_3_3.png)

Click on the "ChainIDE Shields" above, and you'll be able to view the entire content of the Collection.

![image-20230223163620536](/public/images/Polygon-Whitelist-NFT/section-4/4_3_4.png)

### 🛠 Final step, configure the Collection.

If you're the owner, there might be a few additional steps you need to complete. These steps can enhance the appearance of your collection and potentially increase your earnings.

Using the owner account, open the collection page and follow the steps to click on "Edit collection".

![image-20230223164251804](/public/images/Polygon-Whitelist-NFT/section-4/4_3_5.png)

You can configure details such as the logo image, description, Twitter link, and more within this section.

![image-20230223164355425](/public/images/Polygon-Whitelist-NFT/section-4/4_3_6.png)

One particularly interesting aspect is the "Creator Earnings." Every time a user sells an item from your collection on OpenSea, you can earn a certain percentage of the sale price.

![image-20230223164704695](/public/images/Polygon-Whitelist-NFT/section-4/4_3_7.png)

Remember to click "Save collection" if you have made any changes. You can make multiple changes, so there's no need to worry.

![image-20230223164753042](/public/images/Polygon-Whitelist-NFT/section-4/4_3_8.png)

### 🙋‍♂️ Asking Questions

If you have any uncertainties or issues with the work done so far, please ask in the `#polygon` channel on Discord.

To streamline the assistance process, kindly include the following 4 points in your error report ✨:

```
1. Section and lesson number related to the question
2. What you were trying to do
3. Copy & paste the error message
4. Screenshot of the error screen
```