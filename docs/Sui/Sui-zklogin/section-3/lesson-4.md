# 3.4 グローバルステート管理の実装

これまでに作成した`useZKLogin`と`useSui`フックを実際に機能させるためには、アプリケーション全体で状態を共有し、ロジックを連携させる仕組みが必要です。

その中核を担うのが`GlobalProvider`です。

このレッスンでは、ReactのContext APIを利用して、ユーザーアカウント情報、ログイン状態、エフェメラルキー（一時鍵）などを管理する`GlobalProvider`を実装します。

## ファイルの更新

`src/context/GlobalProvider.tsx`のファイルを開いて以下のコードをコピー&ペーストしてください。

## コードの実装

```typescript
import { Ed25519Keypair } from "@mysten/sui.js/keypairs/ed25519";
import {
  generateNonce,
  generateRandomness,
  getExtendedEphemeralPublicKey,
  jwtToAddress,
} from "@mysten/zklogin";
import type { Session, User } from "@supabase/supabase-js";
import axios from "axios";
import { Buffer } from "buffer";
import type { JwtPayload } from "jwt-decode";
import { jwtDecode } from "jwt-decode";
import { enqueueSnackbar } from "notistack";
import queryString from "query-string";
import type { ReactNode } from "react";
import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { suiClient } from "../lib/suiClient";
import { supabase } from "../lib/supabaseClient";
import type {
  GlobalContextType,
  PartialZkLoginSignature,
} from "../types/globalContext";
import { GlobalContext } from "../types/globalContext";
import {
  CLIENT_ID,
  KEY_PAIR_SESSION_STORAGE_KEY,
  RANDOMNESS_SESSION_STORAGE_KEY,
  REDIRECT_URI,
  SUI_PROVER_DEV_ENDPOINT,
} from "../utils/constant";

// Provider Props の型定義
interface GlobalProviderProps {
  children: ReactNode;
}

/**
 * Global Provider コンポーネント
 * zkLogin関連の共通状態とロジックを管理
 */
export function GlobalProvider({ children }: GlobalProviderProps) {
  // State
  const [currentEpoch, setCurrentEpoch] = useState("");
  const [nonce, setNonce] = useState("");
  const [oauthParams, setOauthParams] =
    useState<queryString.ParsedQuery<string>>();
  const [zkLoginUserAddress, setZkLoginUserAddress] = useState("");
  const [decodedJwt, setDecodedJwt] = useState<JwtPayload>();
  const [jwtString, setJwtString] = useState("");
  const [ephemeralKeyPair, setEphemeralKeyPair] = useState<Ed25519Keypair>();
  const [userSalt, setUserSalt] = useState<string>();
  const [zkProof, setZkProof] = useState<PartialZkLoginSignature>();
  const [extendedEphemeralPublicKey, setExtendedEphemeralPublicKey] =
    useState("");
  const [maxEpoch, setMaxEpoch] = useState(0);
  const [randomness, setRandomness] = useState("");
  const [activeStep] = useState(0);

  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchingZKProof, setFetchingZKProof] = useState(false);
  const [executingTxn, setExecutingTxn] = useState(false);
  const [executeDigest, setExecuteDigest] = useState("");

  const location = useLocation();
  const navigate = useNavigate();

  /**
   * 一時的な鍵ペアを生成するメソッド
   */
  const generateEphemeralKeyPair = () => {
    const newEphemeralKeyPair = Ed25519Keypair.generate();
    // リダイレクト後にも保持するためにセッションストレージに保管
    window.sessionStorage.setItem(
      KEY_PAIR_SESSION_STORAGE_KEY,
      newEphemeralKeyPair.export().privateKey,
    );
    setEphemeralKeyPair(newEphemeralKeyPair);
  };

  /**
   * 一時的な鍵ペアをクリアするメソッド
   */
  const clearEphemeralKeyPair = () => {
    window.sessionStorage.removeItem(KEY_PAIR_SESSION_STORAGE_KEY);
    setEphemeralKeyPair(undefined);
  };

  /**
   * 現在のエポックを取得するメソッド
   */
  const fetchCurrentEpoch = async () => {
    // Sui ClientのgetLatestSuiSystemStateメソッドを呼び出す
    const { epoch } = await suiClient.getLatestSuiSystemState();
    setCurrentEpoch(epoch);
    setMaxEpoch(Number(epoch) + 10);
  };

  /**
   * ランダムネス値を生成するメソッド
   */
  const generateRandomnessValue = () => {
    const newRandomness = generateRandomness();
    // リダイレクト後にも保持するためにセッションストレージに保管
    window.sessionStorage.setItem(
      RANDOMNESS_SESSION_STORAGE_KEY,
      newRandomness,
    );
    setRandomness(newRandomness);
  };

  /**
   * ナンス値を生成するメソッド
   * @returns
   */
  const generateNonceValue = () => {
    if (!ephemeralKeyPair) return;
    const newNonce = generateNonce(
      ephemeralKeyPair.getPublicKey(),
      maxEpoch,
      randomness,
    );
    setNonce(newNonce);
  };

  useEffect(() => {
    // セッションストレージから一時鍵ペアのデータを取得
    const keypairFromSession = window.sessionStorage.getItem(
      KEY_PAIR_SESSION_STORAGE_KEY,
    );
    if (keypairFromSession) {
      const secretKey = Buffer.from(keypairFromSession, "base64");
      const newEphemeralKeyPair = Ed25519Keypair.fromSecretKey(secretKey);
      setEphemeralKeyPair(newEphemeralKeyPair);
    }

    // セッションストレージからランダムネスの値を取得する
    const randomnessFromSession = window.sessionStorage.getItem(
      RANDOMNESS_SESSION_STORAGE_KEY,
    );
    if (randomnessFromSession) {
      setRandomness(randomnessFromSession);
    }
  }, []);

  // nonce生成: 鍵ペア・maxEpoch・randomnessが揃ったら自動生成
  useEffect(() => {
    const hasIdToken = window.location.hash.includes("id_token=");
    if (!hasIdToken && ephemeralKeyPair && maxEpoch && randomness) {
      // ナンスを生成する
      const newNonce = generateNonce(
        ephemeralKeyPair.getPublicKey(),
        maxEpoch,
        randomness,
      );
      setNonce(newNonce);
    }
  }, [ephemeralKeyPair, maxEpoch, randomness]);

  // Google OAuthリダイレクト: nonceが生成されたら自動実行
  useEffect(() => {
    // id_tokenパラメータが含まれているか確認nする。
    const hasIdToken = window.location.hash.includes("id_token=");
    // 含まれていない場合は / にリダイレクトする
    if (!hasIdToken && nonce && window.location.pathname === "/") {
      const params = new URLSearchParams({
        client_id: CLIENT_ID,
        redirect_uri: REDIRECT_URI,
        response_type: "id_token",
        scope: "openid",
        nonce: nonce,
      });
      // ログインURLを生成してリダイレクトする
      const loginURL = `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
      // 新しいウィンドウでOAuthプロバイダー側の認証処理を行う。
      window.location.replace(loginURL);
    }
  }, [nonce]);

  // ZKLoginアドレス生成: jwtStringとuserSaltが揃ったら自動生成
  useEffect(() => {
    if (jwtString && userSalt) {
      // JWTとユーザーソルトを使ってZKLogin 用のウォレットアドレスを生成
      const zkLoginAddress = jwtToAddress(jwtString, userSalt);
      setZkLoginUserAddress(zkLoginAddress);
    }
  }, [jwtString, userSalt]);

  /**
   * ephemeralKeyPairがセットされたら拡張公開鍵を自動生成するコールバック関数
   */
  const generateExtendedEphemeralPublicKeyCallback = useCallback(() => {
    if (!ephemeralKeyPair) return;
    // 拡張公開鍵を生成
    const extendedKey = getExtendedEphemeralPublicKey(
      ephemeralKeyPair.getPublicKey(),
    );
    setExtendedEphemeralPublicKey(extendedKey);
  }, [ephemeralKeyPair]);

  useEffect(() => {
    if (ephemeralKeyPair) {
      generateExtendedEphemeralPublicKeyCallback();
    }
  }, [ephemeralKeyPair, generateExtendedEphemeralPublicKeyCallback]);

  // ephemeralKeyPairがセットされたら拡張公開鍵を自動生成
  useEffect(() => {
    if (ephemeralKeyPair) {
      generateExtendedEphemeralPublicKeyCallback();
    }
  }, [ephemeralKeyPair, generateExtendedEphemeralPublicKeyCallback]);

  /**
   * ZKProof自動取得するコールバック関数
   * 必要な情報が揃ったらfetchZkProofを呼び出す
   */
  const fetchZkProofCallback = useCallback(async () => {
    if (
      jwtString &&
      userSalt &&
      maxEpoch &&
      ephemeralKeyPair &&
      extendedEphemeralPublicKey &&
      randomness
    ) {
      setFetchingZKProof(true);

      try {
        // ZK Prover APIにリクエストを送信してZKProofを生成する
        const zkProofResult = await axios.post(
          SUI_PROVER_DEV_ENDPOINT,
          {
            // JWT、拡張公開鍵、エポック数、ランダムネス、ユーザーソルトを詰めてAPIを呼び出す
            jwt: oauthParams?.id_token as string,
            extendedEphemeralPublicKey,
            maxEpoch,
            jwtRandomness: randomness,
            salt: userSalt,
            keyClaimName: "sub",
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          },
        );
        setZkProof(zkProofResult.data as PartialZkLoginSignature);
      } catch (error) {
        console.error(error);
      } finally {
        setFetchingZKProof(false);
      }
    }
  }, [
    jwtString,
    userSalt,
    maxEpoch,
    ephemeralKeyPair,
    extendedEphemeralPublicKey,
    randomness,
    oauthParams,
  ]);

  useEffect(() => {
    console.log("ZKProof auto-fetch check:", {
      jwtString: !!jwtString,
      userSalt: !!userSalt,
      maxEpoch,
      ephemeralKeyPair: !!ephemeralKeyPair,
      extendedEphemeralPublicKey: !!extendedEphemeralPublicKey,
      randomness: !!randomness,
      zkProof: !!zkProof,
    });

    if (
      jwtString &&
      userSalt &&
      maxEpoch &&
      ephemeralKeyPair &&
      extendedEphemeralPublicKey &&
      randomness &&
      !zkProof
    ) {
      console.log("Triggering ZKProof fetch...");
      fetchZkProofCallback();
    }
  }, [
    jwtString,
    userSalt,
    maxEpoch,
    ephemeralKeyPair,
    extendedEphemeralPublicKey,
    randomness,
    zkProof,
    fetchZkProofCallback,
  ]);

  useEffect(() => {
    setLoading(true);
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  /**
   * zkLoginデータをSupabaseに保存する関数
   * @param userId
   * @returns
   */
  const saveZkLoginData = useCallback(
    async (userId: string, userSalt: string, maxEpoch: number) => {
      console.log("zkLoginデータをSupabaseに保存/更新する関数開始");
      // Supabaseにデータを保存/更新
      const { error } = await supabase.from("profiles").upsert(
        {
          id: crypto.randomUUID(),
          sub: userId,
          user_salt: userSalt,
          max_epoch: maxEpoch,
        },
        {
          onConflict: "sub",
          ignoreDuplicates: false,
        },
      );

      if (error) {
        console.error("Failed to save zkLogin data:", error);
        throw new Error(`Failed to save zkLogin data: ${error.message}`);
      }
    },
    [],
  );

  /**
   * zkLoginデータをSupabaseから取得する関数
   * @param userId
   * @returns
   */
  const fetchZkLoginData = useCallback(
    async (
      userId: string,
    ): Promise<{ user_salt: string; max_epoch: number } | null> => {
      try {
        console.log("supabaseへの登録処理開始");
        // Supabaseからデータを取得
        // ここではユーザーソルトとmaxEpochを取得する
        const { data, error } = await supabase
          .from("profiles")
          .select("user_salt, max_epoch")
          .eq("sub", userId)
          .single();

        console.log("Fetched zkLogin data:", data);

        // データを取得できなかった場合は新規に登録する
        if (!data) {
          const { epoch } = await suiClient.getLatestSuiSystemState();
          const newMaxEpoch = Number(epoch) + 10;
          const newUserSalt = generateRandomness();
          // supabase側にデータを登録する
          await saveZkLoginData(userId, newUserSalt, newMaxEpoch);
          return { user_salt: newUserSalt, max_epoch: newMaxEpoch };
        }

        if (error) {
          if (error === "PGRST116") {
            // データなし
            return null;
          }
          throw new Error(`Database error: ${error}`);
        }

        return data;
      } catch (error) {
        console.error("Failed to fetch zkLogin data:", error);
        throw error;
      }
    },
    [saveZkLoginData],
  );

  // Location の監視（OAuth パラメータの取得）
  useEffect(() => {
    const res = queryString.parse(location.hash.replace(/^#/, ""));
    setOauthParams(res);
  }, [location]);

  // JWT トークンの処理
  useEffect(() => {
    /**
     * zkLoginの認証処理に必要なデータを処理するためのメソッド
     * @param userId
     */
    const initializeZkLoginData = async (userId: string) => {
      try {
        // supabaseからユーザーソルトとmaxEpochを取得
        const fetchedData = await fetchZkLoginData(userId);

        let currentSalt = "";
        if (fetchedData?.user_salt) {
          // 既存のデータがある場合
          currentSalt = fetchedData.user_salt;
          setMaxEpoch(fetchedData.max_epoch);
        } else {
          // ユーザーソルトを新規生成
          currentSalt = generateRandomness();
          // エポック数を取得
          const { epoch } = await suiClient.getLatestSuiSystemState();
          const newMaxEpoch = Number(epoch) + 10;

          // supabaseに保存する
          await saveZkLoginData(userId, currentSalt, newMaxEpoch);
          setMaxEpoch(newMaxEpoch);
        }
        setUserSalt(currentSalt);
      } catch (error) {
        console.error("Failed to initialize zkLogin data:", error);
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        enqueueSnackbar(`Failed to initialize zkLogin data: ${errorMessage}`, {
          variant: "error",
        });
      }
    };

    if (oauthParams?.id_token) {
      // 既存のJWTデコード処理など
      const decodedJwt = jwtDecode(oauthParams.id_token as string);
      setJwtString(oauthParams.id_token as string);
      setDecodedJwt(decodedJwt);

      console.log("Decoded JWT:", decodedJwt);

      // supabaseへ認証情報を保管する
      if (decodedJwt.sub) {
        // initializeZkLoginDataメソッドを呼び出す(zkLoginの認証処理に必要なデータを取得/保存する - Supabaseと連携)。
        initializeZkLoginData(decodedJwt.sub);
      }
    }
  }, [oauthParams, fetchZkLoginData, saveZkLoginData]);

  /**
   * ログアウトしてステート変数の値をリセットするメソッド
   */
  const resetState = () => {
    setCurrentEpoch("");
    setNonce("");
    setOauthParams(undefined);
    setZkLoginUserAddress("");
    setDecodedJwt(undefined);
    setJwtString("");
    setEphemeralKeyPair(undefined);
    setUserSalt(undefined);
    setZkProof(undefined);
    setExtendedEphemeralPublicKey("");
    setMaxEpoch(0);
    setRandomness("");
    0;
    setFetchingZKProof(false);
    setExecutingTxn(false);
    setExecuteDigest("");
  };

  /**
   * signOutするための関数
   */
  const signOut = async () => {
    // stateのリセット
    resetState();
    // sessionStorageのクリア
    window.sessionStorage.clear();
    navigate("/");
  };

  /**
   * JWTからウォレットアドレレスを生成するメソッド
   * @returns
   */
  const generateZkLoginAddress = () => {
    if (!userSalt || !jwtString) return;

    // JWTからウォレットアドレスを生成
    const zkLoginAddress = jwtToAddress(jwtString, userSalt);
    console.log("ZKLoginAddress:", zkLoginAddress);
    setZkLoginUserAddress(zkLoginAddress);
  };

  // GlobalContextProviderから提供する変数・メソッド一覧を定義
  const contextValue: GlobalContextType = {
    // State
    currentEpoch,
    nonce,
    oauthParams,
    zkLoginUserAddress,
    decodedJwt,
    jwtString,
    ephemeralKeyPair,
    userSalt,
    zkProof,
    extendedEphemeralPublicKey,
    maxEpoch,
    randomness,
    activeStep,
    fetchingZKProof,
    executingTxn,
    executeDigest,
    user,
    session,
    loading,

    // State setters
    setCurrentEpoch,
    setNonce,
    setOauthParams,
    setZkLoginUserAddress,
    setDecodedJwt,
    setJwtString,
    setEphemeralKeyPair,
    setUserSalt,
    setZkProof,
    setExtendedEphemeralPublicKey,
    setMaxEpoch,
    setRandomness,
    setFetchingZKProof,
    setExecutingTxn,
    setExecuteDigest,
    setUser,
    setSession,
    setLoading,

    // Methods
    resetState,
    signOut,
    generateEphemeralKeyPair,
    clearEphemeralKeyPair,
    fetchCurrentEpoch,
    generateRandomnessValue,
    generateNonceValue,
    generateZkLoginAddress,
    generateExtendedEphemeralPublicKey:
      generateExtendedEphemeralPublicKeyCallback,
  };

  return (
    <GlobalContext.Provider value={contextValue}>
      {children}
    </GlobalContext.Provider>
  );
}
```

### コードの解説

この`GlobalProvider`は、アプリケーションの心臓部として機能し、zkLoginの複雑な認証フロー全体の状態管理とロジックの実行を担います。

単一の関数を呼び出すのではなく、Reactの`useEffect`フックを連鎖的に使用して、必要なデータが揃うと次のステップが自動的に実行されるリアクティブな仕組みを構築しています。

以下に、主要な機能と処理の流れを解説します。

#### 1. 状態管理 (`useState`)

コンポーネントの先頭では、`useState`を用いて多数の状態変数が定義されています。

これらは、zkLoginプロセスの各ステップで必要となるデータ（`ephemeralKeyPair`, `nonce`, `jwtString`, `userSalt`, `zkProof`など）や、UIの状態（`loading`, `executingTxn`など）を保持するために使用されます。

#### 2. zkLogin認証フロー

このプロバイダーが実装する認証フローは、複数の`useEffect`によって自動的に進行します。

- **ステップ 1: 認証の準備**
  - `generateEphemeralKeyPair`, `fetchCurrentEpoch`, `generateRandomnessValue`といった関数が、ログインの初期ステップとして手動で（または他のコンポーネントから）呼び出されることを想定しています。
  - 生成された一時鍵ペアやランダムネスは、OAuthによるリダイレクト後も値を保持できるよう、`sessionStorage`に保存されます。

- **ステップ 2: Nonce生成とOAuthリダイレクト**
  - `useEffect`フックが、`ephemeralKeyPair`, `maxEpoch`, `randomness`の準備が整うのを監視しています。
  - データが揃うと、`generateNonce`を使って`nonce`が自動的に生成されます。
  - 別の`useEffect`が`nonce`の生成を検知し、Googleの認証ページへユーザーを自動的にリダイレクトさせます。

- **ステップ 3: OAuthコールバック処理とSupabase連携**
  - ユーザーがGoogle認証後にリダイレクトされると、`useEffect`がURLから`id_token`（JWT）を取得します。
  - JWTからユーザーの識別子 (`sub`) を取り出し、`fetchZkLoginData`を呼び出してSupabaseデータベースに問い合わせます。
    - **既存ユーザーの場合**: データベースから永続化された`userSalt`を取得します。これにより、ユーザーは常に同じSuiアドレスを利用できます。
    - **新規ユーザーの場合**: 新しい`userSalt`を生成し、`saveZkLoginData`を使ってSupabaseに保存します。
  - このようにSupabaseを利用して`salt`を管理することが、zkLoginにおいて非常に重要な役割を果たします。

- **ステップ 4: ZK Proofの取得**
  - 認証フローの最終段階として、`useEffect`がJWT、`userSalt`、`maxEpoch`といった全ての情報が揃うのを待ちます。
  - `fetchZkProofCallback`関数がトリガーされ、Sui ProverサーバーにAPIリクエストを送信します。
  - Proverは受け取った情報を検証し、トランザクションの署名に必要となる`zkProof`（部分的なZK署名）を返します。このProofが`zkProof`状態に保存されると、ユーザーはログイン済みと見なされ、オンチェーン操作が可能になります。

#### 3. コンテキストの提供

`GlobalContext.Provider`を通じて、これら全ての状態変数と制御用の関数（`signOut`, `generateEphemeralKeyPair`など）が、アプリケーション内の任意の子コンポーネントからアクセスできるようになります。

---

`GlobalProvider`の実装により、zkLoginの複雑なステップが自動化され、アプリケーション全体で一貫した状態管理が実現できました。
