### コントラクトの関数を呼び出して election-dApp を完成させよう

ではいよいよコントラクトで作成した関数を呼び出して投票アプリを完成させましょう！

まずは`pages/voter.js`に移動して下のように書き換えましょう。

[voter.js]

```javascript
// 以下のように書き換えましょう
import React, { useState } from "react";
import Title from "../components/title";
import Input from "../components/input_form";
import { nft_mint, check_voter_has_been_added } from '../js/near/utils'

// Adding voter screen
const Voter = () => {
    // valuable of input ID for receiving vote ticket
    const [inputId, setInputId] = useState("");

    // mint function
    const mint = async () => {
        // check if user is deployer
        if (window.accountId !== process.env.CONTRACT_NAME) {
            alert("You are not contract deployer, so you can't add voter")
            return
        }

        // check if a ticket minted to user before
        const isMinted = await check_voter_has_been_added(`${inputId}`);
        if (isMinted !== 0) {
            alert("You've already got vote ticket or voted and used it!")
            return
        }

        // mint vote ticket to user
        await nft_mint("Vote Ticket", "", "https://gateway.pinata.cloud/ipfs/QmUs5K3LwdvbhKA58bH9C6FX5Q7Bhsvvg9GRAhr9aVKLyx", "QmUs5K3LwdvbhKA58bH9C6FX5Q7Bhsvvg9GRAhr9aVKLyx", "Vote Ticket", "You can vote with this ticket! But remember that you can do it just once.", "vote", `${inputId}`);
        alert(`Vote ticket is minted to ${inputId}!`);
        setInputId("");
    }

    return (
        <div className="grid place-items-center w-full">
            <Title name="Add Voter" />
            <div className="text-lg">※Only contract deployer can add voter.</div>
            <div className="mb-24"></div>
            <Input title="Wallet ID" hint="0x..." input={inputId} type="text" setInput={(event) => setInputId(event.target.value)} />
            <div className="mb-24"></div>
            <button className="button" onClick={() => mint()}>Add</button>
        </div>
    )
}
export default Voter;
```

まず`nft_mint, check_voter_has_been_added`の2つの関数をインポートしましょう。

```javascript
import { nft_mint, check_voter_has_been_added } from '../js/near/utils'
```

この部分では`useState`を使って入力値を取得できるようにします。

```javascript
const [inputId, setInputId] = useState("");
```

次に`mint関数`の中身を確認してみましょう。

まず操作しているユーザーがコントラクトをdeployした人かどうかを確認します。

その次に`check_voter_has_been_added`を呼び出して、すでに投票券を付与していないかを確認します。

```javascript
if (window.accountId !== process.env.CONTRACT_NAME) {
    alert("You are not contract deployer, so you can't add voter")
    return
}

// check if a ticket minted to user before
const isMinted = await check_voter_has_been_added(`${inputId}`);
if (isMinted !== 0) {
    alert("You've already got vote ticket or voted and used it!")
    return
}
```

これら2つをクリアした場合に`nft_mint関数`を呼び出して、投票券を入力されたWallet Idが所有者になるようにmintして、mint後にユーザーにmintされたことを表示します。

最後に入力フォームを空にします。

```javascript
await nft_mint("Vote Ticket", "", "https://gateway.pinata.cloud/ipfs/QmUs5K3LwdvbhKA58bH9C6FX5Q7Bhsvvg9GRAhr9aVKLyx", "QmUs5K3LwdvbhKA58bH9C6FX5Q7Bhsvvg9GRAhr9aVKLyx", "Vote Ticket", "You can vote with this ticket! But remember that you can do it just once.", "vote", `${inputId}`);
        alert(`Vote ticket is minted to ${inputId}!`);
        setInputId("");
```

描画するUIはreturnする以下のものです。

一番下のボタンを押した時に`mint関数`が走るようになっています。

```javascript
<div className="grid place-items-center w-full">
    <Title name="Add Voter" />
    <div className="text-lg">※Only contract deployer can add voter.</div>
    <div className="mb-24"></div>
    <Input title="Wallet ID" hint="0x..." input={inputId} type="text" setInput={(event) => setInputId(event.target.value)} />
    <div className="mb-24"></div>
    <button className="button" onClick={() => mint()}>Add</button>
</div>
```

これで`Add Voter画面`は完成です。

次に`pages/candidate.js`に移動して以下のように書き換えてください。

[candidate.js]

```javascript
// 以下のように書き換えましょう
import React, { useState } from 'react';
import Title from "../components/title";
import Input from "../components/input_form";
import { nft_mint } from '../js/near/utils'

// add candidate screen
function Candidate() {
    // set input valuable of candidate image CID, candidate name, candidate manifest
    const [inputCID, setInputCID] = useState("");
    const [inputName, setInputName] = useState("");
    const [inputManifest, setInputManifest] = useState("");

    // function that add candidate info to home screen
    const addCandidate = async () => {
        // mint candidate nft
        await nft_mint(`${inputName}(candidate)`, "", `https://gateway.pinata.cloud/ipfs/${inputCID}`, inputCID, inputName, inputManifest, "candidate", process.env.CONTRACT_NAME);
        setInputCID("");
        setInputName("");
        setInputManifest("");
        alert("Candidate's NFT has minted! Let's Check it at Home screen!")
    }

    return (
        <div className="grid place-items-center w-full">
            <Title name="Add Candidate" />
            <div className="my-3 text-2xl text-red-400">Add candidate who you think must be a leader!</div>
            <Input title="Image URI(IPFS Content CID)" hint="QmT..." className="mb-3" input={inputCID} setInput={(event) => setInputCID(event.target.value)} />
            <div className="mb-6"></div>
            <Input title="Name" hint="Robert Downey Jr." input={inputName} setInput={(event) => setInputName(event.target.value)} />
            <div className="mb-6"></div>
            <Input title="Manifest" hint="I'm gonna prosper this city with web3 tech!" input={inputManifest} setInput={(event) => setInputManifest(event.target.value)} />
            <div className="mb-6"></div>
            <button className="button" onClick={async () => addCandidate()}>Add</button>
        </div>

    )
}
export default Candidate;
```

まず`nft_mint関数`をインポートしています。

```javascript
import { nft_mint } from '../js/near/utils'
```

`addCandidate関数`では入力されたCIDや候補者の名前を取得して候補者NFTをmintします。

```javascript
const addCandidate = async () => {
    // mint candidate nft
    await nft_mint(`${inputName}(candidate)`, "", `https://gateway.pinata.cloud/ipfs/${inputCID}`, inputCID, inputName, inputManifest, "candidate", process.env.CONTRACT_NAME);
    setInputCID("");
    setInputName("");
    setInputManifest("");
    alert("Candidate's NFT has minted! Let's Check it at Home screen!")
}
```

最後にreturn内がUIとなります。

```javascript
<div className="grid place-items-center w-full">
    <Title name="Add Candidate" />
    <div className="my-3 text-2xl text-red-400">Add candidate who you think must be a leader!</div>
    <Input title="Image URI(IPFS Content CID)" hint="QmT..." className="mb-3" input={inputCID} setInput={(event) => setInputCID(event.target.value)} />
    <div className="mb-6"></div>
    <Input title="Name" hint="Robert Downey Jr." input={inputName} setInput={(event) => setInputName(event.target.value)} />
    <div className="mb-6"></div>
    <Input title="Manifest" hint="I'm gonna prosper this city with web3 tech!" input={inputManifest} setInput={(event) => setInputManifest(event.target.value)} />
    <div className="mb-6"></div>
    <button className="button" onClick={async () => addCandidate()}>Add</button>
</div>
```

これで`Add Candidate画面`は完成です。

最後に`pages/home.js`に移動して下のように編集しましょう。

[home.js]

```javascript
// 以下のように書き換えましょう
import React, { useEffect, useState } from "react";
import {
    nft_transfer,
    nft_add_likes_to_candidate,
    nft_tokens_for_kind,
    nft_return_candidate_likes,
    check_voter_has_been_added,
    check_voter_has_voted,
    voter_voted,
    close_election,
    if_election_closed,
    reopen_election
} from '../js/near/utils'
import CandidateCard from "../components/candidate_card";
import LikeIcon from '../img/like_icon.png'

// Home screen(user can vote here)
const Home = () => {
    // set valuable for candidate NFT info, num of likes for each candidate, state
    const [candidateInfoList, setCandidateInfoList] = useState();
    const [candidateLikesList] = useState([]);
    const [state, setState] = useState("fetching");

    // enum of state
    const State = {
        Fetching: "fetching",
        Fetched: "fetched",
        Open: "open",
        Closed: "closed"
    }

    // fetch candidate nft info
    useEffect(async () => {
        await nft_tokens_for_kind("candidate").then(value => {
            setCandidateInfoList(value);
            setState("fetched");
        });
    }, [])

    // vote function
    const vote = (token_id) => {
        //check if user has already voted
        check_voter_has_voted(window.accountId).then(value => {
            if (Boolean(value)) {
                alert("You have already voted!")
                return
            }

            // check if user has vote ticket
            check_voter_has_been_added(window.accountId).then(value => {
                let tokenIdOfVoter = parseFloat(value);
                if (tokenIdOfVoter == 0) {
                    alert("You don't have vote ticket! Please ask deployer to give it to you.")
                    return
                }
                // confirm if user really vote to specified candidate(because even if they cancel transaction, contract judge user voted)
                let isSure = confirm("Once you vote, you can't change selected candidate. Are you OK?");
                if (!isSure) {
                    return
                }
                // transfer vote ticket from user to contract(get rid of vote ticket)
                nft_transfer(process.env.CONTRACT_NAME, tokenIdOfVoter);
                // add vote to specified candidate
                nft_add_likes_to_candidate(token_id);

                //add user ID to voted-list
                voter_voted(window.accountId);
            })
        })

    }

    // body(in case election is open)
    const cardsInCaseOpen = () => {
        let candidateCardList = [];
        for (let i = 0; i < candidateInfoList.length; i++) {
            // format data for rendering
            candidateCardList.push(
                <div className="items-center">
                    <CandidateCard
                        CID={candidateInfoList[i].metadata.media_CID}
                        name={candidateInfoList[i].metadata.candidate_name}
                        manifest={candidateInfoList[i].metadata.candidate_manifest}
                    />
                    <div className="center text-xl items-center">
                        <img src={LikeIcon} className="object-cover h-5 w-5 mr-2" />
                        <p className="mr-2">{(candidateLikesList[i])}</p>
                        <button value={candidateInfoList[i].metadata.token_id} onClick={(event) => vote(parseInt(event.target.value))} className="vote_button hover:skew-1">Vote!</button>
                    </div>
                </div>

            )

        }
        return candidateCardList
    }

    // body(in case election is closed)
    const cardsInCaseClosed = () => {
        let candidateCardList = [];
        let mostVotedNum = candidateLikesList.reduce((a, b) => { return Math.max(a, b) });
        // format data for rendering
        for (let i = 0; i < candidateInfoList.length; i++) {
            if (candidateLikesList[i] == mostVotedNum) {
                // for winner candidate rendering
                candidateCardList.push(
                    <div className="items-center">
                        <div className="text-2xl shadow-rose-600 center font-semibold text-red-700">Won!</div>
                        <CandidateCard
                            CID={candidateInfoList[i].metadata.media_CID}
                            name={candidateInfoList[i].metadata.candidate_name}
                            manifest={candidateInfoList[i].metadata.candidate_manifest}
                        />
                        <div className="center text-xl items-center">
                            <img src={LikeIcon} className="object-cover h-5 w-5 mr-2" />
                            <p className="mr-2">{(candidateLikesList[i])}</p>
                        </div>
                    </div>

                )
            } else {
                // for other candidate rendering
                candidateCardList.push(
                    <div className="items-center opacity-20">
                        <div className="pt-7"></div>
                        <CandidateCard
                            CID={candidateInfoList[i].metadata.media_CID}
                            name={candidateInfoList[i].metadata.candidate_name}
                            manifest={candidateInfoList[i].metadata.candidate_manifest}
                        />
                        <div className="center text-xl items-center">
                            <img src={LikeIcon} className="object-cover h-5 w-5 mr-2" />
                            <p className="mr-2">{(candidateLikesList[i])}</p>
                        </div>
                    </div>

                )
            }

        }
        return candidateCardList
    }

    // fetching like method
    const getCandidateLikes = async () => {
        // get num of likes for each candidate
        for (let i = 0; i < candidateInfoList.length; i++) {
            await nft_return_candidate_likes(candidateInfoList[i].metadata.token_id).then(value => {
                candidateLikesList.push(value);
            })
        }

        // check if election is closed
        let isClosed = await if_election_closed();
        console.log(isClosed);
        if (isClosed) {
            setState("closed");
        } else {
            setState("open")
        }
    }

    // close button function(display to only contract deployer)
    const closeButton = () => {
        // check if user is contract deployer
        if (window.accountId !== process.env.CONTRACT_NAME) {
            return
        }
        return <button className="close_button hover:skew-1 h-10 bg-red-600 mb-3" onClick={() => {
            // confirm that user really close this election
            let isSureToClose = confirm("Are you sure to close this election?");
            if (isSureToClose) {
                // close this election
                close_election()

                // change state to closed
                setState("closed")
            }
        }}>Close Election</button>
    }

    // reopen button function(display to only contract deployer)
    const reopenButton = () => {
        // check if user is contract deployer
        if (window.accountId !== process.env.CONTRACT_NAME) {
            return
        }
        return <button className="close_button hover:skew-1 h-10 bg-red-600 mb-3" onClick={() => {
            let isSureToClose = confirm("Are you sure to reopen this election?");
            if (isSureToClose) {
                // reopen this election
                reopen_election()

                // change state to open
                setState("open")
            }
        }}>Reopen Election</button>
    }

    // message to wait for fetching data
    const messageToWait = () => {
        return <div className="grid h-screen place-items-center text-3xl">Fetching NFTs of candidates...</div>
    }

    switch (state) {
        // in case fetching candidate NFTs info
        case State.Fetching:
            return <div>{messageToWait()}</div>

        // in case fetching number of likes for each candidate
        case State.Fetched:
            getCandidateLikes();
            return <div>{messageToWait()}</div>

        // in case all data is fetched(election is open)
        case State.Open:
            return (
                < div >
                    <div className="center">{closeButton()}</div>
                    <div className="grid grid-cols-3 gap-10">
                        {cardsInCaseOpen()}
                    </div>
                </ div>
            )

        // in case all data is fetched(election is closed)
        case State.Closed:
            return (
                < div >
                    <div className="center">{reopenButton()}</div>
                    <div className="grid grid-cols-3 gap-10">
                        {cardsInCaseClosed()}
                    </div>
                </ div>
            )
    }

}
export default Home;
```

このようにコントラクトから関数をインポートします。

```javascript
import {
    nft_transfer,
    nft_add_likes_to_candidate,
    nft_tokens_for_kind,
    nft_return_candidate_likes,
    check_voter_has_been_added,
    check_voter_has_voted,
    voter_voted, close_election,
    if_election_closed,
    reopen_election
} from '../js/near/utils'
```

次に更新する変数を定義します。`candidateInfoList`は候補者の情報を入れるリスト、`candidateLikesList`はそれぞれの候補者の得票数を入れるリスト、`state`はデータの取得・投票の締切の真偽の状態を管理するための変数です。

```javascript
const [candidateInfoList, setCandidateInfoList] = useState();
const [candidateLikesList] = useState([]);
const [state, setState] = useState("fetching");
```

こちらは状態を管理するための`enum`型という型で宣言されたものです。これによって描画のところで`if文`をいくつも使ってデータが取得できているかなどを確認する必要がなくなり可読性が上がります。

```javascript
const State = {
    Fetching: "fetching",
    Fetched: "fetched",
    Open: "open",
    Closed: "closed"
}
```

ここでは`useEffect`で`nft_tokens_for_kind関数`を引数（candidate）をとることで候補者の情報を取得しています。

取得した値は`setCandidateInfoList`によって`candidateInfoList`というリストに格納されます。また、`setState`によって`state`という変数は`fetched`に変わります。これによって次はそれぞれの候補者の得票数を取りにいくという次の段階に移ることができます。

```javascript
useEffect(async () => {
    await nft_tokens_for_kind("candidate").then(value => {
        setCandidateInfoList(value);
        setState("fetched");
    });
}, [])
```

次の`vote関数`ではtokenのidを引数にしています。この`token_id`にはユーザーが取得した投票券のtokenのidが入ることになります。このtokenのidは投票する候補者のNFTのidが入ることになります。

```javascript
const vote = (token_id) => {
    //check if user has already voted
    check_voter_has_voted(window.accountId).then(value => {
        if (Boolean(value)) {
            alert("You have already voted!")
            return
        }

        // check if user has vote ticket
        check_voter_has_been_added(window.accountId).then(value => {
            let tokenIdOfVoter = parseFloat(value);
            if (tokenIdOfVoter == 0) {
                alert("You don't have vote ticket! Please ask deployer to give it to you.")
                return
            }
            // confirm if user really vote to specified candidate(because even if they cancel transaction, contract judge user voted)
            let isSure = confirm("Once you vote, you can't change selected candidate. Are you OK?");
            if (!isSure) {
                return
            }
            // transfer vote ticket from user to contract(get rid of vote ticket)
            nft_transfer(process.env.CONTRACT_NAME, tokenIdOfVoter);
            // add vote to specified candidate
            nft_add_likes_to_candidate(token_id);

            //add user ID to voted-list
            voter_voted(window.accountId);
        })
    })
}
```

まずは`check_voter_has_voted関数`を走らせることでユーザーがすでに投票していないかをチェックします。投票済みであれば`alert()`でそのことを知らせます。

引数として受け取っている`window.accountId`とはサインインしているユーザーのwalletのidのことです。

```javascript
check_voter_has_voted(window.accountId)
```

次に`check_voter_has_been_added関数`で投票者が投票券を保有しているかを確認します。ここで重要になってくるのがwalletのidと一緒に格納している値です。

`check_voter_has_voted関数`で確認のために使われるコントラクト内のベクター`voted_voter_list`ではwalletのidに紐づいて0という値を格納しています。なぜなら投票済みかどうかを確認するだけでいいからです。

一方で`check_voter_has_been_added関数`ではで確認のために使われるコントラクト内のベクター`added_voter_list`ではwalletのidに紐づいてそれぞれのユーザーに配布した`投票券のid`が返ってくるようになっています。これによって投票時にその投票券をコントラクトに返す`nft_transfer関数`を使うときにtokenのidを受け取ることができます。

もし投票券を持っていなければ投票券を配布してもらうよう`alert()`でしらせます。

その後`confirm()`関数で1度投票したら2度とできないことを確認します。

```javascript
check_voter_has_been_added(window.accountId)
```

`cardsInCaseOpen関数`では投票が開いているときの候補者それぞれのカードのUIを作成します。投票が閉じているときとの違いは後ほど説明します。

この中では取得した候補者の情報のリスト`candidateInfoList`の長さだけカードを作成しており、そのカードの下には投票ボタンをつけています。そのボタンを押すと先ほど説明した`vote関数`が走り投票が完了します。

最後にコントラクト内にある全ての候補者についてUIの作成が完了できたらそのリストを返し描画に反映されます。

```javascript
const cardsInCaseOpen = () => {
    let candidateCardList = [];
    for (let i = 0; i < candidateInfoList.length; i++) {
        // format data for rendering
        candidateCardList.push(
            <div className="items-center">
                <CandidateCard
                    CID={candidateInfoList[i].metadata.media_CID}
                    name={candidateInfoList[i].metadata.candidate_name}
                    manifest={candidateInfoList[i].metadata.candidate_manifest}
                />
                <div className="center text-xl items-center">
                    <img src={LikeIcon} className="object-cover h-5 w-5 mr-2" />
                    <p className="mr-2">{(candidateLikesList[i])}</p>
                    <button value={candidateInfoList[i].metadata.token_id} onClick={(event) => vote(parseInt(event.target.value))} className="vote_button hover:skew-1">Vote!</button>
                </div>
            </div>
        )
    }
    return candidateCardList
}
```

次の`cardsInCaseClosed関数`では投票が閉じているときの候補者のUIを作成しています。上の`cardsInCaseOpen関数`との違いは、投票による勝者が確定するのでその候補者の上に`Win!`という文字を載せて他の候補者についてはカードを薄くしています。

```javascript
const cardsInCaseClosed = () => {
    let candidateCardList = [];
    let mostVotedNum = candidateLikesList.reduce((a, b) => { return Math.max(a, b) });
    // format data for rendering
    for (let i = 0; i < candidateInfoList.length; i++) {
        if (candidateLikesList[i] == mostVotedNum) {
            // for winner candidate rendering
            candidateCardList.push(
                <div className="items-center">
                    <div className="text-2xl shadow-rose-600 center font-semibold text-red-700">Won!</div>
                    <CandidateCard CID={candidateInfoList[i].metadata.media_CID} name={candidateInfoList[i].metadata.candidate_name} manifest={candidateInfoList[i].metadata.candidate_manifest} />
                    <div className="center text-xl items-center">
                        <img src={LikeIcon} className="object-cover h-5 w-5 mr-2" />
                        <p className="mr-2">{(candidateLikesList[i])}</p>
                    </div>
                </div>

            )
        } else {
            // for other candidate rendering
            candidateCardList.push(
                <div className="items-center opacity-20">
                    <div className="pt-7"></div>
                    <CandidateCard CID={candidateInfoList[i].metadata.media_CID} name={candidateInfoList[i].metadata.candidate_name} manifest={candidateInfoList[i].metadata.candidate_manifest} />
                    <div className="center text-xl items-center">
                        <img src={LikeIcon} className="object-cover h-5 w-5 mr-2" />
                        <p className="mr-2">{(candidateLikesList[i])}</p>
                    </div>
                </div>

            )
        }

    }
    return candidateCardList
}
```

選挙の勝者は`mostVotedNum`という変数に`candidateLikesList`というリストの得票数の最大値をいれ、それと同値である候補者とそうでない候補者のUIを変えるようにしています。

```javascript
let mostVotedNum = candidateLikesList.reduce((a, b) => { return Math.max(a, b) });
```

次の`getCandidateLikes関数`では`nft_tokens_for_kind関数`で取得したそれぞれの候補者のNFTの情報の内tokenのidを引数として受け取り`nft_return_candidate_likes関数`を呼ぶことで得票数を取得しています。

全候補者について得票数の取得が終了したら`if_election_closed関数`を呼ぶことで投票が終了しているかを確認して、それによって`state`の値を変化させて実際に描画させるUIを変えています。

```javascript
const getCandidateLikes = async () => {
    // get num of likes for each candidate
    for (let i = 0; i < candidateInfoList.length; i++) {
        await nft_return_candidate_likes(candidateInfoList[i].metadata.token_id).then(value => {
            candidateLikesList.push(value);
        })
    }

    // check if election is closed
    let isClosed = await if_election_closed();
    console.log(isClosed);
    if (isClosed) {
        setState("closed");
    } else {
        setState("open")
    }
}
```

次の`closeButton関数`はまず最初にコントラクトをdeployしたユーザーとサインインしているユーザーのwalletのidが一致していることを確認しています。誰でも締め切れるのは選挙として成り立ちませんからね。

それがクリアしていればボタンを表示するようにして、ボタンを押すと`confirm()`で本当に投票を締め切るのかを確認してOKならば`close_election関数`を呼ぶようにしています。

この後は投票が締め切っているようにしてUIを変更させます。

```javascript
const closeButton = () => {
    // check if user is contract deployer
    if (window.accountId !== process.env.CONTRACT_NAME) {
        return
    }
    return <button className="close_button hover:skew-1 h-10 bg-red-600 mb-3" onClick={() => {
        // confirm that user really close this election
        let isSureToClose = confirm("Are you sure to close this election?");
        if (isSureToClose) {
            // close this election
            close_election()

            // change state to closed
            setState("closed")
        }
    }}>Close Election</button>
}
```

次の`reopenButton関数`は上で説明した`closeButton関数`とほとんど同じなので説明は割愛します。違っている点はボタンを押して確認が取れた後に`reopen_election関数`を呼んでいることです。

```javascript
const reopenButton = () => {
    // check if user is contract deployer
    if (window.accountId !== process.env.CONTRACT_NAME) {
        return
    }
    return <button className="close_button hover:skew-1 h-10 bg-red-600 mb-3" onClick={() => {
        let isSureToClose = confirm("Are you sure to reopen this election?");
        if (isSureToClose) {
            // reopen this election
            reopen_election()

            // change state to open
            setState("open")
        }
    }}>Reopen Election</button>
}
```

次の`messageToWait関数`は情報の取得中に表示するUIを返しているだけです。

```javascript
const messageToWait = () => {
    return <div className="grid h-screen place-items-center text-3xl">Fetching NFTs of candidates...</div>
}
```

最後の`switch`文では`state`の値によって表示するUIが変更されるように呼び込む関数を変えています。

```javascript
switch (state) {
    // in case fetching candidate NFTs info
    case State.Fetching:
        return <div>{messageToWait()}</div>

    // in case fetching number of likes for each candidate
    case State.Fetched:
        getCandidateLikes();
        return <div>{messageToWait()}</div>

    // in case all data is fetched(election is open)
    case State.Open:
        return (
            < div >
                <div className="center">{closeButton()}</div>
                <div className="grid grid-cols-3 gap-10">
                    {cardsInCaseOpen()}
                </div>
            </ div>
        )

    // in case all data is fetched(election is closed)
    case State.Closed:
        return (
            < div >
                <div className="center">{reopenButton()}</div>
                <div className="grid grid-cols-3 gap-10">
                    {cardsInCaseClosed()}
                </div>
            </ div>
        )
}
```

これでフロントエンドは完成です!

ではここでUIの確認の前に`frontend/neardev/dev-account.env`にある変数を以下のように書き換えましょう。

`YOUR_WALLET_ID`というのは変数にあなたがdeployしたWalletのIdを入れましょう。

[dev-account.env]

```
CONTRACT_NAME=YOUR_WALLET_ID
```

では早速下のコマンドを実行して,UIを見てみましょう！

```
yarn client dev
```

下のように表示されていたら成功です！
section-2でコントラクト内から`nft_add_likes_to_candidate関数`を走らせたのでどれか1つの候補者の得票数が`1`になっているはずです。
![](/public/images/NEAR-Election-dApp/section-3/3_3_1.png)
![](/public/images/NEAR-Election-dApp/section-3/3_3_2.png)
![](/public/images/NEAR-Election-dApp/section-3/3_3_3.png)
![](/public/images/NEAR-Election-dApp/section-3/3_3_4.png)

### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discordの`#near`で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の4点を記載してください ✨

```
1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット
```

これでコントラクト、フロントエンドは完成してアプリとして完成しました！

投票により、得票数が1になっているフロントエンドのスクリーンショットを`#near`に投稿してください 😊

あなたの成功をコミュニティで祝いましょう 🎉

では最後のsection-4でどのように機能しているのかを確認し、netlifyにdeployしてあなたのアプリを公開しましょう！
