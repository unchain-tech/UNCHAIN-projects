### 📜 プロポーザルを作成する

トレジャリーと投票の準備ができたので、早速提案を作成してみましょう！

まず、`src/scripts/10-create-vote-proposals.ts`を作成し、以下のとおりコードを変更します。

```typescript
import { ethers } from 'ethers';

import sdk from './1-initialize-sdk';
import { ERCTokenAddress, governanceAddress } from './module';

// 投票コントラクトのアドレスを設定します
const vote = sdk.getContract(governanceAddress, 'vote');

// ERC-20 コントラクトのアドレスを設定します。
const token = sdk.getContract(ERCTokenAddress, 'token');

(async () => {
  try {
    // トレジャリーに 420,000 のトークンを新しく鋳造する提案を作成します
    const amount = 420_000;
    const description =
      'Should the DAO mint an additional ' +
      amount +
      ' tokens into the treasury?';
    const executions = [
      {
        // mint を実行するトークンのコントラクトアドレスを設定します
        toAddress: (await token).getAddress(),
        // DAO のネイティブトークンが ETH であるため、プロポーザル作成時に送信したい ETH の量を設定します（今回はトークンを新しく発行するため 0 を設定します）
        nativeTokenValue: 0,
        // ガバナンスコントラクトのアドレスに mint するために、金額を正しい形式（wei）に変換します
        transactionData: (await token).encoder.encode('mintTo', [
          (await vote).getAddress(),
          ethers.utils.parseUnits(amount.toString(), 18),
        ]),
      },
    ];

    await (await vote).propose(description, executions);

    console.log('✅ Successfully created proposal to mint tokens');
  } catch (error) {
    console.error('failed to create first proposal', error);
  }

  try {
    // 6,900 のトークンを自分たちに譲渡するための提案を作成します
    const amount = 6_900;
    const description =
      'Should the DAO transfer ' +
      amount +
      ' tokens from the treasury to ' +
      process.env.WALLET_ADDRESS +
      ' for being awesome?';
    const executions = [
      {
        nativeTokenValue: 0,
        transactionData: (await token).encoder.encode(
          // トレジャリーからウォレットへの送金を行います。
          'transfer',
          [
            process.env.WALLET_ADDRESS!,
            ethers.utils.parseUnits(amount.toString(), 18),
          ],
        ),
        toAddress: (await token).getAddress(),
      },
    ];

    await (await vote).propose(description, executions);

    console.log(
      "✅ Successfully created proposal to reward ourselves from the treasury, let's hope people vote for it!",
    );
  } catch (error) {
    console.error('failed to create second proposal', error);
  }
})();
```

ここでは会員に投票してもらうために、2つの新しい提案を作成しています。

1. トレジャリーが42万個の新しいトークンを鋳造（mint）できるようにする提案を作成しています。

   これはとても民主的なトレジャリーであるため、もしメンバーの大多数がこの提案を不賛成とした場合、この提案は否決される可能性があります。

2. トレジャリーから自分のウォレットに6,900トークンを送金する提案を作成しています。

   既存のDAOでは、DAOに貢献してくれた人などのウォレットにトークンを送る際、今回のようにプロポーザルを作成するのが一般的です。

`nativeTokenValue`は、ガバナンストークンの他にETHを送るための設定です。

ただし、ETHを送りたい場合はDAOのトレジャリーに送金分のETHがなければなりません。

それでは、ターミナルに移動し、下記コマンドを実行してみましょう。

```
yarn node --loader ts-node/esm src/scripts/10-create-vote-proposals.ts
```

以下のような表示がされたら、成功です。

```
SDK initialized by address: 0x8cB688A30D5Fd6f2e5025d8915eD95e770832933
✅ Successfully created proposal to mint tokens
✅ Successfully created proposal to reward ourselves from the treasury, let's hope people vote for it!
Done in 54.29s.
```

> ⚠️注意
> `proposal_token_threshold > 0`のように設定した場合、エラーとなる可能性があるため、提案を作成する前にトークンをガバナンスコントラクトに移動させたうえで動作させる必要があるかもしれません。
>


### ✍️ ダッシュボードから提案に投票できるようにする

私たちの提案はスマートコントラクト上で公開されています。

このままでは簡単に投票できないので、DAO（ダッシュボード）からユーザーが提案に投票できるようにしていきましょう。

では、`src/pages/index.tsx`へ移動し、以下のとおりコードを変更します。

まず、`Proposal`をインポートします。

```typescript
import { Proposal } from '@thirdweb-dev/sdk';
```

続いて、`const token = useContract...`の下に投票コントラクトを初期化するコードを追加します。

※ あなたのアドレスを設定することを忘れないでください！

```typescript
  // 投票コントラクトの初期化
  const vote = useContract(
    'INSERT_VOTE_ADDRESS',
    'vote',
  ).contract;
```

さらに、`const [memberAddresses, setMemberAddresses] = useState...`の下に新しい`useState`を追加します。

```typescript
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [isVoting, setIsVoting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
```

さいごに、`shortenAddress`関数の下に以下のコードを追加します。

```typescript
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
        console.log('🌈 Proposals:', proposals);
      } catch (error) {
        console.log('failed to get proposals', error);
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
        const hasVoted = await vote!.hasVoted(proposals[0].proposalId.toString(), address);
        setHasVoted(hasVoted);
        if (hasVoted) {
          console.log('🥵 User has already voted');
        } else {
          console.log('🙂 User has not voted yet');
        }
      } catch (error) {
        console.error('Failed to check if wallet has voted', error);
      }
    };
    checkIfUserHasVoted();

  }, [hasClaimedNFT, proposals, address, vote]);
```

ここでは、以下の2つのことを行っています。

1. 最初の`useEffect`では、`vote!.getAll()`を実行して、ガバナンスコントラクトに存在するすべての提案を取得し、`setProposals`を実行して、後でそれらをレンダリングできるようにしています。

2. 2つ目の`useEffect`では、`vote!.hasVoted(properties[0].proposalId.toString(), address)`を実行して、このアドレスが最初の提案に投票しているかどうかを確認しています。

   もし投票済みだった場合は、`setHasVoted`を実行して、ユーザが再び投票できないようにします。

   ただし、もしこの処理がなかったとしても、ユーザが二重投票をしようとしたら、私たちのコントラクトがトランザクションを拒否することでしょう！

ページを更新すると、🌈 の横に先ほどあなたが提案した2つの提案が表示され、すべての提案データを閲覧することができるはずです。

![](/public/images/ETH-DAO/section-3/3_4_1.png)

なお、既に投票済みの場合は以下のように表示されます。

![](/public/images/ETH-DAO/section-3/3_4_2.png)

さて、それではこれからユーザーが投票する際、賛成・反対・棄権の中から選択肢を選べるようにしていきましょう。

まず、以下の`AddressZero`をインポートします。

```typescript
import { AddressZero } from '@ethersproject/constants';
```

続いて、DAOダッシュボード画面を表示している`else if (hasClaimedNFT) {...}`の中身を以下のコードに置き換えます。

```typescript
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
                      proposalId: proposal.proposalId,
                      vote: 2,
                    };
                    proposal.votes.forEach((vote) => {
                      const elem = document.getElementById(
                        proposal.proposalId + '-' + vote.type
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
                        votes.map(async ({ proposalId, vote: _vote }) => {
                          // 提案に投票可能かどうかを確認します
                          const proposal = await vote!.get(proposalId);
                          // 提案が投票を受け付けているかどうかを確認します
                          if (proposal.state === 1) {
                            return vote!.vote(proposalId.toString(), _vote);
                          }
                          return;
                        })
                      );
                      try {
                        // 提案が実行可能であれば実行する
                        await Promise.all(
                          votes.map(async ({ proposalId }) => {
                            const proposal = await vote!.get(proposalId);

                            // state が 4 の場合は実行可能と判断する
                            if (proposal.state === 4) {
                              return vote!.execute(proposalId.toString());
                            }
                          })
                        );
                        // 投票成功と判定する
                        setHasVoted(true);
                        console.log('successfully voted');
                      } catch (err) {
                        console.error('failed to execute votes', err);
                      }
                    } catch (err) {
                      console.error('failed to vote', err);
                    }
                  } catch (err) {
                    console.error('failed to delegate tokens');
                  } finally {
                    setIsVoting(false);
                  }
                }}
              >
                {proposals.map((proposal) => (
                  <div key={proposal.proposalId.toString()} className="card">
                    <h5>{proposal.description}</h5>
                    <div>
                      {proposal.votes.map(({ type, label }) => (
                        <div key={type}>
                          <input
                            type="radio"
                            id={proposal.proposalId + '-' + type}
                            name={proposal.proposalId.toString()}
                            value={type}
                            // デフォルトで棄権票をチェックする
                            defaultChecked={type === 2}
                          />
                          <label htmlFor={proposal.proposalId + '-' + type}>
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
                    ? 'Voting...'
                    : hasVoted
                      ? 'You Already Voted'
                      : 'Submit Votes'}
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
```

この変更により、以下のような画面が表示され、実際に投票を行えるようになりました。

![](/public/images/ETH-DAO/section-3/3_4_3.png)

今回は、24時間後に投票を受付できなくなるように設定しています。

24時間後に「提案への賛成票＞提案への反対票」となった場合は、どのメンバーもガバナンスコントラクトを通じて提案を実行することができるようになります。

ちなみに、ここで2つの提案に対し`For`を選択して`Submit Votes`ボタンを押下するとMetaMaskが立ち上がり確認を求められます。

確認後、正常に動作すると以下のようにボタンが`You Already Voted`となり、コンソールに`successfuly voted`と表示されます。

![](/public/images/ETH-DAO/section-3/3_4_4.png)


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

ぜひ、コンソールに`successfuly voted`と表示されたフロントエンド画面のスクリーンショットを`#ethereum`に投稿してください 😊

あなたの成功をコミュニティで祝いましょう 🎉

次のレッスンでは、DAOをより分散化させるために管理権限の排除をしていきます！
