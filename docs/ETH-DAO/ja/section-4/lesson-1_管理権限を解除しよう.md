### 😡 トークン発行権を手放す

あなたはまだ、このDAOのERC-20トークンの発行権を持っています。

つまり、このDAOはまだあなたのモノといっても過言ではありません。

これではあまりにも中央集権的なので、ここであなたの持つトークン発行権を完全に放棄してしまいましょう。

そうすることにより、ガバナンスコントラクトだけがトークンを発行できるようになります。

それでは早速、`src/scripts/11-revoke-roles.ts`を作成し、以下のとおりコードを変更します。

```typescript
import sdk from './1-initialize-sdk';
import { ERCTokenAddress } from './module';

const token = sdk.getContract(ERCTokenAddress, 'token');

(async () => {
  try {
    // 現在のロールを記録します
    const allRoles = await (await token).roles.getAll();

    console.log('👀 Roles that exist right now:', allRoles);

    // ERC-20 のコントラクトに関して、あなたのウォレットが持っている権限をすべて取り消します
    await (await token).roles.setAll({ admin: [], minter: [] });
    console.log(
      '🎉 Roles after revoking ourselves',
      await (await token).roles.getAll(),
    );
    console.log(
      '✅ Successfully revoked our superpowers from the ERC-20 contract',
    );
  } catch (error) {
    console.error('Failed to revoke ourselves from the DAO treasury', error);
  }
})();

```

それでは、ターミナルに移動し、下記コマンドを実行してみましょう。

```
yarn node --loader ts-node/esm src/scripts/11-revoke-roles.ts
```

以下のような表示がされたら、成功です。

```
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
import { AddressZero } from '@ethersproject/constants';
import { Sepolia } from '@thirdweb-dev/chains';
import {
  ConnectWallet,
  useAddress,
  useChain,
  useContract,
} from '@thirdweb-dev/react';
import { Proposal } from '@thirdweb-dev/sdk';
import type { NextPage } from 'next';
import { useEffect, useMemo, useState} from 'react';

import styles from '../styles/Home.module.css';

const Home: NextPage = () => {
  const address = useAddress();
  console.log('👋Wallet Address: ', address);

  const chain = useChain();

  // editionDrop コントラクトを初期化
  const editionDrop = useContract(
    'INSERT_EDITION_DROP_ADDRESS',
    'edition-drop',
  ).contract;

  // トークンコントラクトの初期化
  const token = useContract(
    'INSERT_TOKEN_ADDRESS',
    'token',
  ).contract;

  // 投票コントラクトの初期化
  const vote = useContract(
    'INSERT_VOTE_ADDRESS',
    'vote',
  ).contract;

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
    return str.substring(0, 6) + '...' + str.substring(str.length - 4);
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
        console.log('🚀 Members addresses', memberAddresses);
      } catch (error) {
        console.error('failed to get member list', error);
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
        console.log('👜 Amounts', amounts);
      } catch (error) {
        console.error('failed to get member balances', error);
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
      const member = memberTokenAmounts?.find(
        ({ holder }: {holder: string}) => holder === address,
      );

      return {
        address,
        tokenAmount: member?.balance.displayValue || '0',
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
          console.log('🌟 this user has a membership NFT!');
        } else {
          setHasClaimedNFT(false);
          console.log("😭 this user doesn't have a membership NFT.");
        }
      } catch (error) {
        setHasClaimedNFT(false);
        console.error('Failed to get balance', error);
      }
    };
    // 関数を実行
    checkBalance();
  }, [address, editionDrop]);

  const mintNft = async () => {
    try {
      setIsClaiming(true);
      await editionDrop!.claim('0', 1);
      console.log(
        `🌊Successfully Minted! Check it out on etherscan: https://sepolia.etherscan.io/address/${editionDrop!.getAddress()}/0`
      );
      setHasClaimedNFT(true);
    } catch (error) {
      setHasClaimedNFT(false);
      console.error('Failed to mint NFT', error);
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
  else if (chain && chain.chainId !== Sepolia.chainId) {
    console.log('wallet address: ', address);
    console.log('chain name: ', chain.name);

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
                      proposalId: proposal.proposalId,
                      vote: 2,
                    };
                    proposal.votes.forEach((vote) => {
                      const elem = document.getElementBychainId(
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
                            chainId={proposal.proposalId + '-' + type}
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
  }
  // ウォレットと接続されていたら Mint ボタンを表示
  else {
    return (
      <div className={styles.container}>
        <main className={styles.main}>
          <h1 className={styles.title}>Mint your free 🍪DAO Membership NFT</h1>
          <button disabled={isClaiming} onClick={mintNft}>
            {isClaiming ? 'Minting...' : 'Mint your nft (FREE)'}
          </button>
        </main>
      </div>
    );
  }
};

export default Home;
```

### 🧙‍♂️ テストを作成・実行する

ここまでの作業でコントラクトには基本機能として以下の機能が追加されました。
* NFTをmintする機能
* トークン,ガバナンストークンをデプロイする機能
* NFT,トークン,ガバナンストークンの情報を取得する機能
* NFT,トークン,ガバナンストークンに操作を加える機能

これらの基本機能をテストスクリプトとして記述していきましょう。
ではsrcディレクトリの中に`test`ディレクトリを作成し、その中に`test.ts`という名前でファイルを作成して、以下のように記述しましょう。

```typescript
import { AddressZero } from '@ethersproject/constants';
import { ThirdwebSDK } from '@thirdweb-dev/sdk';
import assert from 'assert';
import ethers from 'ethers';
import { describe, it } from 'node:test';

import {
  editionDropAddress,
  ERCTokenAddress,
  governanceAddress,
  ownerWalletAddress,
} from '../scripts/module.js';

describe('ETH-DAO test', function () {
  // テスト用のウォレットを作成
  const demoWallet = ethers.Wallet.createRandom();
  // テスト用のPublic RPC Endpointを設定
  const demoAlchemyRPCEndpoint = 'https://eth-sepolia.g.alchemy.com/v2/demo';

  const sdk = new ThirdwebSDK(
    new ethers.Wallet(
      demoWallet.privateKey,
      ethers.getDefaultProvider(demoAlchemyRPCEndpoint),
    ),
  );

  // 1-initialize-sdk.tsのテスト
  it('sdk is working', async function () {
    // sdkからアドレスを取得
    const address = await sdk.getSigner()?.getAddress();

    // sdkを初期化したアドレスがテスト用に生成したウォレットアドレスと一致しているか確認
    assert.equal(address, demoWallet.address);
  });

  // edition-drop, ERC1155-token, governance-tokenの3つのコントラクトを取得
  const editionDrop = sdk.getContract(editionDropAddress, 'edition-drop');
  const token = sdk.getContract(ERCTokenAddress, 'token');
  const vote = sdk.getContract(governanceAddress, 'vote');

  // 2-deploy-drop.tsのテスト
  it('metadata is set', async function () {
    // メタデータを取得
    const metadata = await (await editionDrop).metadata.get();

    // メタデータがsetされているかテスト
    assert.notEqual(metadata, null);

    // メタデータの内容の一部が一致しているかチェック
    assert.equal(metadata.fee_recipient, AddressZero);
  });

  // 3-config-nft.tsのテスト
  it('NFT is minted', async function () {
    // 最初にmintされたNFTの情報を取得する
    const NFTInfo = await (await editionDrop).get(0);

    // NFTの情報が空ではないことを確認する
    assert.notEqual(NFTInfo, null);
  });

  // 4-set-claim-condition.tsのテスト
  it('NFT condition is set', async function () {
    // トークンに与えられた条件を取得する
    const condition = await (
      await editionDrop
    ).erc1155.claimConditions.getActive('0');

    // 条件として与えられたものの一つであるNFTの価格が0であることを確認する
    assert.equal(condition.price.toNumber(), 0);
  });

  // 5-deploy-token.tsのテスト
  it('token contract is deployed', async function () {
    // トークンに与えられた情報を取得する
    const tokenInfo = await (await token).balance();

    // トークンのシンボルがTSCとなっているか確認する
    assert.equal(tokenInfo.symbol, 'TSC');
  });

  // 6-print-money.tsのテスト
  it('token is minted', async function () {
    // トークンの情報を取得する
    const tokenInfo = await (await token).totalSupply();

    // トークンの合計が1e+24となっているか確認する
    assert.equal(Number(tokenInfo.value).toString(), '1e+24');
  });

  // 7-airdrop-token.tsのテスト
  it('token is transfered', async function () {
    // このコントラクトのオーナーに与えられているトークンの合計を確認する
    const balance = await (await token).balanceOf(ownerWalletAddress);

    // コントラクトのトークンの合計を10進数に変換する
    const fixedBalance = Number(balance.value).toString();

    // コントラクトのトークンの合計が1e+22となっているか確認
    assert.equal(fixedBalance, '1e+22');
  });

  // 8-deploy-vote.tsのテスト
  it('vote contract has right info', async function () {
    // 投票コントラクトのメタデータを取得
    const metadata = await (await vote).metadata.get();

    // 投票コントラクトに正しく情報が入っているか確認
    assert.equal(metadata.name, 'My amazing DAO');
  });

  // 9-setup-vote.tsのテスト
  it('vote contract has as 9 times much tokens as owner has', async function () {
    // ウォレットのトークン残高を取得します
    const ownedTokenBalance = (
      await (await token).balanceOf(ownerWalletAddress)
    ).value;

    // ウォレットのトークン残高を取得します
    const contractTokenBalance = (
      await (await token).balanceOf((await vote).getAddress())
    ).value;

    // オーナーが所有するトークンの9倍のトークン量をコントラクトが所有していることを確認
    assert.equal(Number(ownedTokenBalance) * 9, Number(contractTokenBalance));
  });

  // 10-create-vote-proposals.tsのテスト
  it('vote contract has proposal', async function () {
    // 投票コントラクトに挙げられた提案を取得します
    const proposal = (await (await vote).getAll())[0];

    // 投票コントラクトへ提案がされているか確認する
    assert.equal(
      proposal.description,
      'Should the DAO mint an additional 420000 tokens into the treasury?',
    );
  });

  // 11-revoke-roles.tsのテスト
  it('token role is passed to contract', async function () {
    // 投票コントラクトに挙げられた提案を取得します
    const roles = await (await token).roles.getAll();

    // adminの権限が誰にも与えられていないlことを確認する。
    assert.equal(roles.admin, [].toString());
  });

  console.log('test');
});
```

では下のコマンドを実行することでコントラクトのテストをしていきましょう！

```
yarn test
```

下のような結果がでいれば成功です！

```
▶ ETH-DAO test
  ✔ sdk is working (2.805292ms)
  ✔ metadata is set (4997.410834ms)
  ✔ NFT is minted (1001.915459ms)
  ✔ NFT condition is set (3716.073667ms)
  ✔ token contract is deployed (1979.918625ms)
  ✔ token is minted (1944.507292ms)
  ✔ token is transfered (4742.419958ms)
  ✔ vote contract has right info (1089.866375ms)
  ✔ vote contract has as 9 times much tokens as owner has (1798.956209ms)
  ✔ vote contract has proposal (2365.098833ms)
  ✔ token role is passed to contract (2495.2875ms)
▶ ETH-DAO test (26136.361542ms)

ℹ tests 11
ℹ suites 1
ℹ pass 11
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 0.058375
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
