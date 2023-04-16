### 😡 トークン発行権を手放す

あなたはまだ、このDAOのERC-20トークンの発行権を持っています。

つまり、このDAOはまだあなたのモノといっても過言ではありません。

これではあまりにも中央集権的なので、ここであなたの持つトークン発行権を完全に放棄してしまいましょう。

そうすることにより、ガバナンスコントラクトだけがトークンを発行できるようになります。

それでは早速、`src/scripts/11-revoke-roles.ts`を作成し、以下のとおりコードを変更します。

※ あなたのアドレスを設定することを忘れないでください！

```typescript
import sdk from "./1-initialize-sdk.js";

const token = sdk.getContract("INSERT_TOKEN_ADDRESS", "token");

(async () => {
  try {
    // 現在のロールを記録します
    const allRoles = await (await token).roles.getAll();

    console.log("👀 Roles that exist right now:", allRoles);

    // ERC-20 のコントラクトに関して、あなたのウォレットが持っている権限をすべて取り消します
    await (await token).roles.setAll({ admin: [], minter: [] });
    console.log(
      "🎉 Roles after revoking ourselves",
      await (await token).roles.getAll()
    );
    console.log("✅ Successfully revoked our superpowers from the ERC-20 contract");

  } catch (error) {
    console.error("Failed to revoke ourselves from the DAO treasury", error);
  }
})();
```

それでは、ターミナルに移動し、下記コマンドを実行してみましょう。

```bash
yarn node --loader ts-node/esm src/scripts/11-revoke-roles.ts
```

以下のような表示がされたら、成功です。

```bash
SDK initialized by address: 0x8cB688A30D5Fd6f2e5025d8915eD95e770832933
👀 Roles that exist right now: {
  admin: [ '0x8cB688A30D5Fd6f2e5025d8915eD95e770832933' ],
  minter: [
    '0x8cB688A30D5Fd6f2e5025d8915eD95e770832933',
    '0xCA7D13D6A51141D04C3fC05cFE4EBeE9f9ac6Bc2'
  ],
  transfer: [
    '0x8cB688A30D5Fd6f2e5025d8915eD95e770832933',
    '0x0000000000000000000000000000000000000000'
  ]
}
🎉 Roles after revoking ourselves {
  admin: [],
  minter: [],
  transfer: [
    '0x8cB688A30D5Fd6f2e5025d8915eD95e770832933',
    '0x0000000000000000000000000000000000000000' 
  ]
}
✅ Successfully revoked our superpowers from the ERC-20 contract
Done in 44.18s.
```

私のウォレットアドレス`0x8cB688A30D5Fd6f2e5025d8915eD95e770832933`がトークンに関して多くの権利を有していました。

そのため、ここで`(await token).roles.setAll({ admin: [], minter: [] })`を実行してminterの役割をガバナンスコントラクトのみとしました。

なお、`transfer`に存在するゼロアドレス（0×0...）は誰もがトークンを転送できることを意味しています。

これで無事、DAOを分散化させることに成功しました！

参考までに、ここまで修正を重ねた`src/pages/index.tsx`は以下のとおりとなっております。

```typescript
import { useState, useEffect, useMemo } from "react";
import type { NextPage } from "next";
// 接続中のネットワークを取得するため useNetwork を新たにインポートします。
import { ConnectWallet, useNetwork, useAddress, useContract } from "@thirdweb-dev/react";
import styles from "../styles/Home.module.css";
import { Proposal } from "@thirdweb-dev/sdk";
import { AddressZero } from "@ethersproject/constants";

const Home: NextPage = () => {
  const address = useAddress();
  console.log("👋Wallet Address: ", address);

  const [network, switchNetwork] = useNetwork();

  // editionDrop コントラクトを初期化
  const editionDrop = useContract("INSERT_EDITION_DROP_ADDRESS", "edition-drop").contract;

  // トークンコントラクトの初期化
  const token = useContract("INSERT_TOKEN_ADDRESS", "token").contract;

  // 投票コントラクトの初期化
  const vote = useContract("INSERT_VOTE_ADDRESS", "vote").contract;

  // ユーザーがメンバーシップ NFT を持っているかどうかを知るためのステートを定義
  const [hasClaimedNFT, setHasClaimedNFT] = useState(false);

  // NFT をミンティングしている間を表すステートを定義
  const [isClaiming, setIsClaiming] = useState(false);

  // メンバーごとの保有しているトークンの数をステートとして宣言
  const [memberTokenAmounts, setMemberTokenAmounts] = useState<any>([]);
  
  // DAO メンバーのアドレスをステートで宣言
  const [memberAddresses, setMemberAddresses] = useState<string[] | undefined>([]);

  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [isVoting, setIsVoting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);

  // アドレスの長さを省略してくれる便利な関数
  const shortenAddress = (str: string) => {
    return str.substring(0, 6) + "..." + str.substring(str.length - 4);
  };

  // コントラクトから既存の提案を全て取得します
  useEffect(() => {
    if (!hasClaimedNFT) {
      return;
    }

    // vote!.getAll() を使用して提案を取得します
    const getAllProposals = async () => {
      try {
        const proposals = await vote!.getAll();
        setProposals(proposals);
        console.log("🌈 Proposals:", proposals);
      } catch (error) {
        console.log("failed to get proposals", error);
      }
    };
    getAllProposals();
  }, [hasClaimedNFT, vote]);

  // ユーザーがすでに投票したかどうか確認します
  useEffect(() => {
    if (!hasClaimedNFT) {
      return;
    }

    // 提案を取得し終えない限り、ユーザーが投票したかどうかを確認することができない
    if (!proposals.length) {
      return;
    }

    const checkIfUserHasVoted = async () => {
      try {
        const hasVoted = await vote!.hasVoted(proposals[0].proposalchainId.toString(), address);
        setHasVoted(hasVoted);
        if (hasVoted) {
          console.log("🥵 User has already voted");
        } else {
          console.log("🙂 User has not voted yet");
        }
      } catch (error) {
        console.error("Failed to check if wallet has voted", error);
      }
    };
    checkIfUserHasVoted();

  }, [hasClaimedNFT, proposals, address, vote]);

  // メンバーシップを保持しているメンバーの全アドレスを取得します
  useEffect(() => {
    if (!hasClaimedNFT) {
      return;
    }

    // 先ほどエアドロップしたユーザーがここで取得できます（発行された tokenchainID 0 のメンバーシップ NFT）
    const getAllAddresses = async () => {
      try {
        const memberAddresses = await editionDrop?.history.getAllClaimerAddresses(
          0
        );
        setMemberAddresses(memberAddresses);
        console.log("🚀 Members addresses", memberAddresses);
      } catch (error) {
        console.error("failed to get member list", error);
      }
    };
    getAllAddresses();
  }, [hasClaimedNFT, editionDrop?.history]);

  // 各メンバーが保持するトークンの数を取得します
  useEffect(() => {
    if (!hasClaimedNFT) {
      return;
    }

    const getAllBalances = async () => {
      try {
        const amounts = await token?.history.getAllHolderBalances();
        setMemberTokenAmounts(amounts);
        console.log("👜 Amounts", amounts);
      } catch (error) {
        console.error("failed to get member balances", error);
      }
    };
    getAllBalances();
  }, [hasClaimedNFT, token?.history]);

  // memberAddresses と memberTokenAmounts を 1 つの配列に結合します
  const memberList = useMemo(() => {
    return memberAddresses?.map((address) => {
      // memberTokenAmounts 配列でアドレスが見つかっているかどうかを確認します
      // その場合、ユーザーが持っているトークンの量を返します
      // それ以外の場合は 0 を返します
      const member = memberTokenAmounts?.find(({ holder }: {holder: string}) => holder === address);

      return {
        address,
        tokenAmount: member?.balance.displayValue || "0",
      };
    });
  }, [memberAddresses, memberTokenAmounts]);

  useEffect(() => {
    // もしウォレットに接続されていなかったら処理をしない
    if (!address) {
      return;
    }
    // ユーザーがメンバーシップ NFT を持っているかどうかを確認する関数を定義
    const checkBalance = async () => {
      try {
        const balance = await editionDrop!.balanceOf(address, 0);
        if (balance.gt(0)) {
          setHasClaimedNFT(true);
          console.log("🌟 this user has a membership NFT!");
        } else {
          setHasClaimedNFT(false);
          console.log("😭 this user doesn't have a membership NFT.");
        }
      } catch (error) {
        setHasClaimedNFT(false);
        console.error("Failed to get balance", error);
      }
    };
    // 関数を実行
    checkBalance();
  }, [address, editionDrop]);

  const mintNft = async () => {
    try {
      setIsClaiming(true);
      await editionDrop!.claim("0", 1);
      console.log(
        `🌊 Successfully Minted! Check it out on OpenSea: https://testnets.opensea.io/assets/${editionDrop!.getAddress()}/0`
      );
      setHasClaimedNFT(true);
    } catch (error) {
      setHasClaimedNFT(false);
      console.error("Failed to mint NFT", error);
    } finally {
      setIsClaiming(false);
    }
  };
  
  // ウォレットと接続していなかったら接続を促す
  if (!address) {
    return (
      <div className={styles.container}>
        <main className={styles.main}>
          <h1 className={styles.title}>
            Welcome to Tokyo Sauna Collective !!
          </h1>
          <div className={styles.connect}>
            <ConnectWallet />
          </div>
        </main>
      </div>
    );
  }
  // テストネットが Sepolia ではなかった場合に警告を表示
  else if (address && network && network?.data?.chain?.chainId !== 11155111) {
    console.log("wallet address: ", address);
    console.log("network: ", network?.data?.chain?.chainId);

    return (
      <div className={styles.container}>
        <main className={styles.main}>
          <h1 className={styles.title}>Sepolia に切り替えてください⚠️</h1>
          <p>この dApp は Sepolia テストネットのみで動作します。</p>
          <p>ウォレットから接続中のネットワークを切り替えてください。</p>
        </main>
      </div>
    );
  }
  // ユーザーがすでに NFT を要求している場合は、内部 DAO ページを表示します
  // これは DAO メンバーだけが見ることができ、すべてのメンバーとすべてのトークン量をレンダリングします
  else if (hasClaimedNFT){
    return (
      <div className={styles.container}>
        <main className={styles.main}>
        <h1 className={styles.title}>🍪DAO Member Page</h1>
        <p>Congratulations on being a member</p>
          <div>
            <div>
              <h2>■ Member List</h2>
              <table className="card">
                <thead>
                  <tr>
                    <th>Address</th>
                    <th>Token Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {memberList!.map((member) => {
                    return (
                      <tr key={member.address}>
                        <td>{shortenAddress(member.address)}</td>
                        <td>{member.tokenAmount}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div>
              <h2>■ Active Proposals</h2>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  e.stopPropagation();

                  // ダブルクリックを防ぐためにボタンを無効化します
                  setIsVoting(true);

                  // フォームから値を取得します
                  const votes = proposals.map((proposal) => {
                    const voteResult = {
                      proposalchainId: proposal.proposalchainId,
                      vote: 2,
                    };
                    proposal.votes.forEach((vote) => {
                      const elem = document.getElementBychainId(
                        proposal.proposalchainId + "-" + vote.type
                      ) as HTMLInputElement;

                      if (elem!.checked) {
                        voteResult.vote = vote.type;
                        return;
                      }
                    });
                    return voteResult;
                  });

                  // ユーザーが自分のトークンを投票に委ねることを確認する必要があります
                  try {
                    // 投票する前にウォレットがトークンを委譲する必要があるかどうかを確認します
                    const delegation = await token!.getDelegationOf(address);
                    // トークンを委譲していない場合は、投票前に委譲します
                    if (delegation === AddressZero) {
                      await token!.delegateTo(address);
                    }
                    // 提案に対する投票を行います
                    try {
                      await Promise.all(
                        votes.map(async ({ proposalchainId, vote: _vote }) => {
                          // 提案に投票可能かどうかを確認します
                          const proposal = await vote!.get(proposalchainId);
                          // 提案が投票を受け付けているかどうかを確認します
                          if (proposal.state === 1) {
                            return vote!.vote(proposalchainId.toString(), _vote);
                          }
                          return;
                        })
                      );
                      try {
                        // 提案が実行可能であれば実行する
                        await Promise.all(
                          votes.map(async ({ proposalchainId }) => {
                            const proposal = await vote!.get(proposalchainId);

                            // state が 4 の場合は実行可能と判断する
                            if (proposal.state === 4) {
                              return vote!.execute(proposalchainId.toString());
                            }
                          })
                        );
                        // 投票成功と判定する
                        setHasVoted(true);
                        console.log("successfully voted");
                      } catch (err) {
                        console.error("failed to execute votes", err);
                      }
                    } catch (err) {
                      console.error("failed to vote", err);
                    }
                  } catch (err) {
                    console.error("failed to delegate tokens");
                  } finally {
                    setIsVoting(false);
                  }
                }}
              >
                {proposals.map((proposal) => (
                  <div key={proposal.proposalchainId.toString()} className="card">
                    <h5>{proposal.description}</h5>
                    <div>
                      {proposal.votes.map(({ type, label }) => (
                        <div key={type}>
                          <input
                            type="radio"
                            chainId={proposal.proposalchainId + "-" + type}
                            name={proposal.proposalchainId.toString()}
                            value={type}
                            // デフォルトで棄権票をチェックする
                            defaultChecked={type === 2}
                          />
                          <label htmlFor={proposal.proposalchainId + "-" + type}>
                            {label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                <p></p>
                <button disabled={isVoting || hasVoted} type="submit">
                  {isVoting
                    ? "Voting..."
                    : hasVoted
                      ? "You Already Voted"
                      : "Submit Votes"}
                </button>
                <p></p>
                {!hasVoted && (
                  <small>
                    This will trigger multiple transactions that you will need to
                    sign.
                  </small>
                )}
              </form>
            </div>
          </div>
        </main>
      </div>
    );
  }
  // ウォレットと接続されていたら Mint ボタンを表示
  else {
    return (
      <div className={styles.container}>
        <main className={styles.main}>
          <h1 className={styles.title}>Mint your free 🍪DAO Membership NFT</h1>
          <button disabled={isClaiming} onClick={mintNft}>
            {isClaiming ? "Minting..." : "Mint your nft (FREE)"}
          </button>
        </main>
      </div>
    );
  }
};

export default Home;
```


### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discordの`#ethereum`で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の4点を記載してください ✨

```
1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット
```

---

次のレッスンでWebアプリをアップグレードしてVercelにアップロードしていきましょう！
