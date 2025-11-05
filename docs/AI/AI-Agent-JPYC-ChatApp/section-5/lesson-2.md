---
title: ローカルストレージの実装
---

### 💾 ローカルストレージの実装

このレッスンでは、ユーザーのプロフィールと友達リストをブラウザのlocalStorageに保存する機能を実装します。

これにより、ユーザーは名前とアドレスを登録し、友達の名前を使ってJPYC送信ができるようになります。

### 📝 実装するファイル

まず、型定義ファイル`src/lib/storage/types.ts`を作成します：

```typescript
import type { Hex } from "viem";

export type UserProfile = {
	name: string;
	address: Hex;
	updatedAt: string;
};

export type Friend = {
	id: string;
	name: string;
	address: Hex;
	createdAt: string;
};

export type StorageData = {
	profile: UserProfile | null;
	friends: Friend[];
};
```

次に、`src/lib/storage/localStorage.ts`ファイルを作成し、以下のコードを記述します：

```typescript
import type { Friend, UserProfile, StorageData } from "./types";
import { type Hex } from "viem";

export type { Friend, UserProfile } from "./types";

const STORAGE_KEY = "jpyc-ai-agent-data";

function getStorageData(): StorageData {
	if (typeof window === "undefined") {
		return { profile: null, friends: [] };
	}

	const data = localStorage.getItem(STORAGE_KEY);
	if (!data) {
		return { profile: null, friends: [] };
	}

	try {
		return JSON.parse(data);
	} catch {
		return { profile: null, friends: [] };
	}
}

function setStorageData(data: StorageData): void {
	if (typeof window === "undefined") return;
	localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// Profile管理
export function getProfile(): UserProfile | null {
	return getStorageData().profile;
}

export function setProfile(name: string, address: Hex): UserProfile {
	const data = getStorageData();
	const profile: UserProfile = {
		name,
		address,
		updatedAt: new Date().toISOString(),
	};
	data.profile = profile;
	setStorageData(data);
	return profile;
}

export function deleteProfile(): void {
	const data = getStorageData();
	data.profile = null;
	setStorageData(data);
}

// Friends管理
export function getFriends(): Friend[] {
	return getStorageData().friends;
}

export function getFriendByName(name: string): Friend | undefined {
	const friends = getFriends();
	return friends.find((f) => f.name.toLowerCase() === name.toLowerCase());
}

export function getFriendById(id: string): Friend | undefined {
	const friends = getFriends();
	return friends.find((f) => f.id === id);
}

export function addFriend(name: string, address: Hex): Friend {
	const data = getStorageData();

	// 同じ名前が既に存在するかチェック
	const existingFriend = data.friends.find(
		(f) => f.name.toLowerCase() === name.toLowerCase(),
	);
	if (existingFriend) {
		throw new Error(`友達リストに「${name}」は既に登録されています`);
	}

	const friend: Friend = {
		id: crypto.randomUUID(),
		name,
		address,
		createdAt: new Date().toISOString(),
	};

	data.friends.push(friend);
	setStorageData(data);
	return friend;
}

export function updateFriend(id: string, name: string, address: Hex): Friend {
	const data = getStorageData();
	const index = data.friends.findIndex((f) => f.id === id);

	if (index === -1) {
		throw new Error("友達が見つかりません");
	}

	// 他の友達と名前が重複しないかチェック
	const duplicateFriend = data.friends.find(
		(f, i) => i !== index && f.name.toLowerCase() === name.toLowerCase(),
	);
	if (duplicateFriend) {
		throw new Error(`友達リストに「${name}」は既に登録されています`);
	}

	const friend: Friend = {
		...data.friends[index],
		name,
		address,
	};

	data.friends[index] = friend;
	setStorageData(data);
	return friend;
}

export function deleteFriend(id: string): void {
	const data = getStorageData();
	data.friends = data.friends.filter((f) => f.id !== id);
	setStorageData(data);
}
```

### 💡 コードの解説

このファイルでは、ブラウザのlocalStorageを使って、ユーザーデータを永続化します。主要なポイントを見ていきましょう。

#### 1. ストレージキー

```typescript
const STORAGE_KEY = "jpyc-ai-agent-data";
```

localStorageに保存する際のキー名を定義します。このキーで、プロフィールと友達リストの両方を1つのオブジェクトとして保存します。

#### 2. SSRへの対応

```typescript
if (typeof window === "undefined") {
	return { profile: null, friends: [] };
}
```

Next.jsはサーバーサイドレンダリング（SSR）を行うため、`window`オブジェクトが存在しない場合があります。この条件分岐により、サーバーサイドでの実行時にエラーが発生しないようにします。

#### 3. データの読み込み

```typescript
function getStorageData(): StorageData {
	const data = localStorage.getItem(STORAGE_KEY);
	if (!data) {
		return { profile: null, friends: [] };
	}

	try {
		return JSON.parse(data);
	} catch {
		return { profile: null, friends: [] };
	}
}
```

localStorageからデータを取得し、JSONとしてパースします。データが存在しない場合やパースに失敗した場合は、空のデータを返します。

#### 4. プロフィール管理

**プロフィールの取得**
```typescript
export function getProfile(): UserProfile | null {
	return getStorageData().profile;
}
```

現在のプロフィールを取得します。未設定の場合は`null`を返します。

**プロフィールの設定**
```typescript
export function setProfile(name: string, address: Hex): UserProfile {
	const data = getStorageData();
	const profile: UserProfile = {
		name,
		address,
		updatedAt: new Date().toISOString(),
	};
	data.profile = profile;
	setStorageData(data);
	return profile;
}
```

プロフィールを設定します。`updatedAt`に現在時刻を記録します。

**プロフィールの削除**
```typescript
export function deleteProfile(): void {
	const data = getStorageData();
	data.profile = null;
	setStorageData(data);
}
```

プロフィールを削除します。

#### 5. 友達リスト管理

**友達の追加**
```typescript
export function addFriend(name: string, address: Hex): Friend {
	const data = getStorageData();

	// 同じ名前が既に存在するかチェック
	const existingFriend = data.friends.find(
		(f) => f.name.toLowerCase() === name.toLowerCase(),
	);
	if (existingFriend) {
		throw new Error(`友達リストに「${name}」は既に登録されています`);
	}

	const friend: Friend = {
		id: crypto.randomUUID(),
		name,
		address,
		createdAt: new Date().toISOString(),
	};

	data.friends.push(friend);
	setStorageData(data);
	return friend;
}
```

友達を追加します。重複チェックを行い、既に同じ名前が存在する場合はエラーを投げます。

**友達の検索**
```typescript
export function getFriendByName(name: string): Friend | undefined {
	const friends = getFriends();
	return friends.find((f) => f.name.toLowerCase() === name.toLowerCase());
}
```

名前で友達を検索します。大文字小文字を区別しないため、`toLowerCase()`で正規化します。

**友達の更新**
```typescript
export function updateFriend(id: string, name: string, address: Hex): Friend {
	// 重複チェック
	const duplicateFriend = data.friends.find(
		(f, i) => i !== index && f.name.toLowerCase() === name.toLowerCase(),
	);
	if (duplicateFriend) {
		throw new Error(`友達リストに「${name}」は既に登録されています`);
	}
	// 更新処理
}
```

友達の情報を更新します。他の友達と名前が重複しないかチェックします。

**友達の削除**
```typescript
export function deleteFriend(id: string): void {
	const data = getStorageData();
	data.friends = data.friends.filter((f) => f.id !== id);
	setStorageData(data);
}
```

指定したIDの友達を削除します。

### 🔄 AI Agentとの連携

このローカルストレージは、前のレッスンで作成したチャットAPIと連携します：

```
1. ユーザーが「太郎に100JPYC送って」と入力
   ↓
2. フロントエンドがgetFriends()で友達リストを取得
   ↓
3. APIリクエストに友達リストを含めて送信
   {
     "message": "太郎に100JPYC送って",
     "profile": { "name": "花子", "address": "0x..." },
     "friends": [{ "name": "太郎", "address": "0x..." }]
   }
   ↓
4. AI Agentが友達リストから太郎のアドレスを検索
   ↓
5. jpyc_transferツールで送信実行
```

次のレッスンでは、これらの関数を使用するチャットインタフェースを実装します。

### 🙋‍♂️ 質問する

ここまでの作業で何かわからないことがある場合は、Discordの`#jpyc`で質問をしてください。

ヘルプをするときのフローが円滑になるので、エラーレポートには下記の4点を記載してください ✨

1. 質問が関連しているセクション番号とレッスン番号
2. 何をしようとしていたか
3. エラー文をコピー&ペースト
4. エラー画面のスクリーンショット

---

次のレッスンでは、チャットインタフェースの前半を実装します！
