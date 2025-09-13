---
title: "メインページを実装する"
---

# Lesson 2: メインページを実装する

このレッスンでは、アプリケーションの顔となるメインページ`app/page.tsx`を実装します。

ゲームコンポーネントを配置し、ウォレットの接続状態に応じてUIが変化するようにします。

## 📦 `app/page.tsx`の実装

`app/page.tsx`を以下の内容で書き換えます。

```tsx
// app/page.tsx

'use client';

// MiniKit の各種フックを用いたメインの画面コンポーネント。
// - フレームの保存（addFrame）
// - Wallet 連携 UI（OnchainKit）
// - 簡易的なタブ切り替え（Home / Features）

import { Footer, Header } from '@/components/common';
import { Home } from '@/components/DemoComponents';
import { useMiniKit } from '@coinbase/onchainkit/minikit';
import { useEffect } from 'react';

/**
 * App コンポーネント
 * @returns
 */
export default function App() {
  // MiniKit のコンテキスト（フレーム準備完了フラグやクライアント状態）
  const { setFrameReady, isFrameReady } = useMiniKit();

  useEffect(() => {
    if (!isFrameReady) {
      setFrameReady();
    }
  }, [setFrameReady, isFrameReady]);

  return (
    <div className="mini-app-theme flex min-h-screen flex-col from-[var(--app-background)] to-[var(--app-gray)] font-sans text-[var(--app-foreground)]">
      <div className="mx-auto w-full max-w-md px-4 py-3">
        {/* ヘッダー */}
        <Header />
        {/* メインコンポーネント */}
        <main className="flex-1">
          <Home />
        </main>
        {/* フッター */}
        <Footer />
      </div>
    </div>
  );
}
```

## 📖 コード解説

### `useMiniKit`フック

`@coinbase/onchainkit/minikit`が提供するReactフックです。

このフックを呼び出すことで、MiniAppに関する処理を簡単に実行することができるようになります。

```tsx
const { setFrameReady, isFrameReady } = useMiniKit();
```

今回は`frame`に対応したアプリになっているかどうかチェックするためのステート変数を取得しています。

### `<Home />`コンポーネント

このアプリでメインに使用するHomeコンポーネントになります。

`<Home />`コンポーネントの中身は以下の通りです！

```ts
import ShootingGame from '@/components/Game';

/**
 * Home コンポーネント
 * @param param0
 * @returns
 */
export function Home() {
  return (
    <div className="animate-fade-in space-y-6">
      {/* シューティングゲーム コンポーネント */}
      <ShootingGame />
    </div>
  );
}
```

## 📦 `components/Game/ShootingGame.tsx`の実装

シューティングゲーム部分のコンポーネントである`ShootingGame`コンポーネントを実装していきます。

以下の内容をコピー&ペーストしてください。

```ts
// components/Game/ShootingGame.tsx

'use client';

import { Card } from '@/components/common';
import { SHOOTING_GAME_NFT_ABI } from '@/utils/abis';
import { NFT_ADDRESS } from '@/utils/constants';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAccount } from 'wagmi';
import { TransactionCard } from '../TransactionCard';

type Vec = { x: number; y: number };
type Rect = Vec & { w: number; h: number };

function intersects(a: Rect, b: Rect) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

/**
 * シューティングゲーム コンポーネント
 * @returns
 */
export function ShootingGame() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastTickRef = useRef<number | undefined>(undefined);

  // Logical canvas size (scaled for DPR)
  const BASE_W = 360;
  const BASE_H = 540;

  const [running, setRunning] = useState(false);
  const runningRef = useRef(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [high, setHigh] = useState(0);

  // Game state kept in refs to avoid re-renders per frame
  const playerRef = useRef<Rect>({ x: BASE_W / 2 - 15, y: BASE_H - 40, w: 30, h: 14 });
  const bulletsRef = useRef<Rect[]>([]);
  const enemiesRef = useRef<(Rect & { vy: number })[]>([]);
  const keyRef = useRef<Record<string, boolean>>({});
  const cooldownRef = useRef(0);
  const spawnRef = useRef({ t: 0, interval: 1000 });

  const { address } = useAccount();

  // Resize canvas to parent width with DPR scaling
  const fitCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const dpr = Math.max(1, Math.floor(window.devicePixelRatio || 1));
    const width = Math.min(container.clientWidth, 480); // cap width
    const height = Math.round((BASE_H / BASE_W) * width);

    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
  }, []);

  // Game loop
  const loop = useCallback(
    (now: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const dpr = Math.max(1, Math.floor(window.devicePixelRatio || 1));
      const scaleX = canvas.width / (BASE_W * dpr);
      const scaleY = canvas.height / (BASE_H * dpr);
      const scale = Math.min(scaleX, scaleY);
      // clear in device pixels, then draw with logical scale
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.setTransform(scale * dpr, 0, 0, scale * dpr, 0, 0);

      // time delta (ms)
      const last = lastTickRef.current ?? now;
      const dt = Math.min(32, now - last);
      lastTickRef.current = now;

      const speedMul = 1 + Math.min(1.5, score / 50) * 0.5; // slightly speed up with score

      // Update only while running
      const player = playerRef.current;
      const bullets = bulletsRef.current;
      const enemies = enemiesRef.current;

      if (runningRef.current) {
        const move = 0.28 * dt * speedMul;
        if (keyRef.current['ArrowLeft'] || keyRef.current['a']) player.x -= move;
        if (keyRef.current['ArrowRight'] || keyRef.current['d']) player.x += move;
        player.x = Math.max(6, Math.min(BASE_W - player.w - 6, player.x));

        cooldownRef.current -= dt;
        if ((keyRef.current[' '] || keyRef.current['Space']) && cooldownRef.current <= 0) {
          bullets.push({ x: player.x + player.w / 2 - 2, y: player.y - 8, w: 4, h: 8 });
          cooldownRef.current = 180 / speedMul; // fire rate
        }

        // bullets
        for (let i = bullets.length - 1; i >= 0; i--) {
          bullets[i].y -= 0.6 * dt * speedMul;
          if (bullets[i].y + bullets[i].h < 0) bullets.splice(i, 1);
        }

        // spawn enemies
        spawnRef.current.t += dt;
        if (spawnRef.current.t >= spawnRef.current.interval) {
          spawnRef.current.t = 0;
          spawnRef.current.interval = Math.max(350, 1000 - score * 10); // faster spawns over time
          const w = 20 + Math.random() * 16;
          const x = 8 + Math.random() * (BASE_W - w - 16);
          const vy = 0.08 + Math.random() * 0.18 + Math.min(0.12, score * 0.002);
          enemies.push({ x, y: -24, w, h: w, vy });
        }

        // enemies move
        for (let i = enemies.length - 1; i >= 0; i--) {
          enemies[i].y += enemies[i].vy * dt * speedMul;
          if (enemies[i].y > BASE_H + 40) enemies.splice(i, 1);
        }

        // collisions bullet-enemy
        outer: for (let i = enemies.length - 1; i >= 0; i--) {
          for (let j = bullets.length - 1; j >= 0; j--) {
            if (intersects(enemies[i], bullets[j])) {
              enemies.splice(i, 1);
              bullets.splice(j, 1);
              setScore((s) => s + 1);
              break outer;
            }
          }
        }

        // collisions player-enemy
        for (let i = 0; i < enemies.length; i++) {
          if (intersects(player, enemies[i])) {
            setGameOver(true);
            setRunning(false);
            if (score + 0 > high) {
              const next = score;
              setHigh(next);
              try {
                localStorage.setItem('shooting_highscore', String(next));
              } catch {}
            }
            break;
          }
        }
      }

      // Draw
      ctx.clearRect(0, 0, BASE_W, BASE_H);

      // background
      ctx.fillStyle = '#0a0a0a20';
      ctx.fillRect(0, 0, BASE_W, BASE_H);

      // player
      ctx.fillStyle = '#0052ff';
      ctx.fillRect(player.x, player.y, player.w, player.h);
      ctx.fillStyle = '#2b6bff';
      ctx.fillRect(player.x + 8, player.y - 6, player.w - 16, 6); // small "cockpit"

      // bullets
      ctx.fillStyle = '#22c55e';
      bullets.forEach((b) => ctx.fillRect(b.x, b.y, b.w, b.h));

      // enemies
      ctx.fillStyle = '#f59e0b';
      enemies.forEach((e) => ctx.fillRect(e.x, e.y, e.w, e.h));

      // score
      ctx.fillStyle = '#ffffffcc';
      ctx.font = 'bold 16px system-ui, -apple-system, Segoe UI, Roboto';
      ctx.fillText(`Score: ${score}`, 10, 22);
      ctx.fillText(`High: ${high}`, 10, 40);

      // overlays when idle or game over
      if (!running && !gameOver) {
        ctx.fillStyle = '#ffffffdd';
        ctx.font = 'bold 18px system-ui, -apple-system, Segoe UI, Roboto';
        ctx.textAlign = 'center';
        ctx.fillText('Tap / Space to Start', BASE_W / 2, BASE_H / 2);
        ctx.textAlign = 'start';
      }
      if (gameOver) {
        ctx.fillStyle = '#ef4444';
        ctx.font = 'bold 22px system-ui, -apple-system, Segoe UI, Roboto';
        ctx.textAlign = 'center';
        ctx.fillText('Game Over', BASE_W / 2, BASE_H / 2 - 12);
        ctx.fillStyle = '#ffffffdd';
        ctx.font = 'bold 16px system-ui, -apple-system, Segoe UI, Roboto';
        ctx.fillText('Press Restart', BASE_W / 2, BASE_H / 2 + 12);
        ctx.textAlign = 'start';
      }

      rafRef.current = requestAnimationFrame(loop);
    },
    [BASE_W, BASE_H, gameOver, high, running, score]
  );

  /**
   * ゲームを開始するコールバックメソッド
   */
  const startGame = useCallback(() => {
    // reset
    playerRef.current = { x: BASE_W / 2 - 15, y: BASE_H - 40, w: 30, h: 14 };
    bulletsRef.current = [];
    enemiesRef.current = [];
    cooldownRef.current = 0;
    spawnRef.current = { t: 0, interval: 1000 };
    lastTickRef.current = undefined;
    setScore(0);
    setGameOver(false);
    setRunning(true);
    rafRef.current = requestAnimationFrame(loop);
  }, [BASE_W, BASE_H, loop]);

  // lifecycle
  useEffect(() => {
    // keep ref in sync to avoid stale closure in RAF loop
    runningRef.current = running;

    // highscore
    try {
      const hs = localStorage.getItem('shooting_highscore');
      if (hs) setHigh(Number(hs) || 0);
    } catch {}

    fitCanvas();
    const onResize = () => fitCanvas();
    window.addEventListener('resize', onResize);

    const down = (e: KeyboardEvent) => {
      keyRef.current[e.key] = true;
      if ((e.key === ' ' || e.key === 'Space') && !running && !gameOver) {
        // allow quick start with space
        startGame();
      }
    };
    const up = (e: KeyboardEvent) => {
      keyRef.current[e.key] = false;
    };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);

    /**
     * touch/click to shoot & move
     * @param ev
     * @returns
     */
    const handlePointer = (ev: MouseEvent | TouchEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const clientX = 'touches' in ev ? ev.touches[0]?.clientX : (ev as MouseEvent).clientX;
      if (clientX != null) {
        const x = clientX - rect.left;
        // move player towards tap position
        const width = rect.width;
        const targetX = (x / width) * BASE_W - playerRef.current.w / 2;
        playerRef.current.x = Math.max(6, Math.min(BASE_W - playerRef.current.w - 6, targetX));
      }
      // fire
      keyRef.current[' '] = true;
      setTimeout(() => (keyRef.current[' '] = false), 60);
      if (!running) startGame();
    };
    // capture canvas element to ensure stable cleanup references
    const canvasEl = canvasRef.current;
    canvasEl?.addEventListener('mousedown', handlePointer);
    canvasEl?.addEventListener('touchstart', handlePointer, { passive: true });

    // kick off passive render loop for initial frame
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
      canvasEl?.removeEventListener('mousedown', handlePointer);
      canvasEl?.removeEventListener('touchstart', handlePointer);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [BASE_W, BASE_H, fitCanvas, running, gameOver, startGame, loop]);

  // NFTを発行するためのコールデータ
  // 倒した敵の数分をNFTとして発行する
  const calls = useMemo(
    () =>
      address && score > 0
        ? [
            {
              address: NFT_ADDRESS as `0x${string}`,
              abi: SHOOTING_GAME_NFT_ABI,
              functionName: 'mint',
              args: [address as `0x${string}`, 0, score, '0x'] as [string, number, number, string],
            },
          ]
        : [],
    [address, score]
  );

  console.log('calls', calls);

  return (
    <Card title="Mini Shooting Game">
      <div ref={containerRef} className="flex w-full flex-col items-center">
        <canvas
          ref={canvasRef}
          className="rounded-lg border border-[var(--app-card-border)] bg-[var(--app-background)]"
        />
        {!running && !gameOver && (
          <button
            onClick={startGame}
            className="mt-4 rounded-md bg-[var(--app-accent)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--app-accent-hover)] active:bg-[var(--app-accent-active)]"
          >
            Tap / Space to Start
          </button>
        )}
        {gameOver && score > 0 && <TransactionCard calls={calls} />}
        {gameOver && score === 0 && (
          <p className="mt-3 text-sm text-yellow-400">Score is 0 — nothing to mint. Try again!</p>
        )}
      </div>
    </Card>
  );
}

export default ShootingGame;
```

## 📖 コード解説

### NFTコントラクトメソッドを呼び出すためのデータの作成

NFTをミントするためのデータは以下の部分で実装しています。 

`useMemo`でメモ化しており、倒した敵の数だけ`ERC1155`規格のNFTがミントできるようになっています。

```ts
// NFTを発行するためのコールデータ
// 倒した敵の数分をNFTとして発行する
const calls = useMemo(
  () =>
    address && score > 0
      ? [
          {
            address: NFT_ADDRESS as `0x${string}`,
            abi: SHOOTING_GAME_NFT_ABI,
            functionName: 'mint',
            args: [address as `0x${string}`, 0, score, '0x'] as [string, number, number, string],
          },
        ]
      : [],
  [address, score]
);
```

そしてこのコールデータを`<TransactionCard>`コンポーネントに渡しています。

`<TransactionCard>`コンポーネントは後のレッスンで実装します！

```ts
{gameOver && score > 0 && <TransactionCard calls={calls} />}
```

### UIの表示

-   `<canvas>`: ゲームが描画される領域です。
-   ゲームオーバー時のモーダル: `isGameOver`が`true`になると表示されます。最終スコアとNFTミントボタンが表示されます。
-   `<TransactionCard />`: 渡されたコールデータを実行するトランザクションを送信するための一覧のコンポーネントです（次のレッスンで実装予定）。

---

これで、アプリケーションの基本的なレイアウトとウォレット接続のロジックが完成しました。

次のレッスンでは、このアプリを`Farcaster`の`Mini App`として認識させるための設定ファイルを作成します。

### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discordの`#base`で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の3点を記載してください ✨

1.  質問が関連しているセクション番号とレッスン番号
2.  何をしようとしていたか
3.  エラー文をコピー&ペースト
4.  エラー画面のスクリーンショット
