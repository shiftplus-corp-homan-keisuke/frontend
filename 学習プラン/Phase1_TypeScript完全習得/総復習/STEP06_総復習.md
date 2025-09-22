# STEP06 総復習：ユーティリティ型による型変換と高度な型操作

## 📋 概要

このファイルは、STEP06「ユーティリティ型による型変換と高度な型操作」の理論学習内容を総復習するためのドキュメントです。既存のセッションファイルで学習した内容を体系的に整理し、理論的な理解を深めることを目的としています。

## 🎯 学習目標

- [ ] オブジェクト型変換ユーティリティの完全理解と実践的活用
- [ ] Extract・Exclude型による型の抽出・除外パターンの習得
- [ ] 関数型ユーティリティによる関数の型操作の理解
- [ ] 高度なユーティリティ型の組み合わせパターンの習得

---

## 1. オブジェクト型の変換ユーティリティ

### 1.1 Partial<T> - 部分的な更新用

**概念**: 型Tの全てのプロパティをオプショナル（`?:`）にする型

```typescript
interface User {
  id: number;
  name: string;
  email: string;
}

type PartialUser = Partial<User>;
// { id?: number; name?: string; email?: string; }

// 実践例：フォームの部分更新
function updateUser(id: number, updates: Partial<User>): User {
  const existingUser = getUserById(id);
  return { ...existingUser, ...updates };
}

updateUser(1, { name: "新しい名前" }); // nameだけ更新
```

### 1.2 Required<T> - 全プロパティを必須に

**概念**: 型Tの全てのオプショナルプロパティを必須にする型

```typescript
interface Config {
  apiUrl?: string;
  timeout?: number;
  retries?: number;
}

type RequiredConfig = Required<Config>;
// { apiUrl: string; timeout: number; retries: number; }

// 実践例：設定の初期化
function initializeApp(config: Required<Config>): void {
  console.log(`API URL: ${config.apiUrl}`);
  console.log(`Timeout: ${config.timeout}ms`);
}
```

### 1.3 Readonly<T> - 読み取り専用

**概念**: 型Tの全てのプロパティを読み取り専用（`readonly`）にする型

```typescript
interface GameState {
  score: number;
  level: number;
  lives: number;
}

type ReadonlyGameState = Readonly<GameState>;
// { readonly score: number; readonly level: number; readonly lives: number; }

// 実践例：イミュータブルな状態管理
function createImmutableState(state: GameState): Readonly<GameState> {
  return Object.freeze({ ...state });
}
```

### 1.4 Pick<T, K> - 必須プロパティの選択

**概念**: 型Tから指定したキーKのプロパティのみを選択して新しい型を作成

```typescript
interface FullProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  internalNotes: string;
}

// 公開API用の型
type PublicProduct = Pick<FullProduct, "id" | "name" | "description" | "price">;
// { id: string; name: string; description: string; price: number; }

// 商品一覧表示用の型
type ProductListItem = Pick<FullProduct, "id" | "name" | "price">;
// { id: string; name: string; price: number; }
```

### 1.5 Omit<T, K> - プロパティの除外

**概念**: 型Tから指定したキーKのプロパティを除外して新しい型を作成

```typescript
interface DatabaseUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
}

// 認証レスポンス用（機密情報を除外）
type AuthUser = Omit<DatabaseUser, "passwordHash">;
// { id: string; name: string; email: string; createdAt: Date; }

// ユーザー作成リクエスト用（自動生成フィールドを除外）
type CreateUserRequest = Omit<DatabaseUser, "id" | "createdAt">;
// { name: string; email: string; passwordHash: string; }
```

### 1.6 Record<K, T> - キーと値の型を指定したオブジェクト

**概念**: キーの型がK、値の型がTのオブジェクト型を作成

```typescript
type UserRole = "admin" | "editor" | "viewer";
type Permissions = Record<UserRole, string[]>;
// { admin: string[]; editor: string[]; viewer: string[]; }

// 実践例：権限設定
const permissions: Record<UserRole, string[]> = {
  admin: ["read", "write", "delete"],
  editor: ["read", "write"],
  viewer: ["read"]
};

// 多言語対応
type LanguageCode = "ja" | "en" | "zh";
const translations: Record<string, Record<LanguageCode, string>> = {
  welcome: {
    ja: "ようこそ",
    en: "Welcome",
    zh: "欢迎"
  }
};
```

---

## 2. Extract・Exclude型の詳細活用

### 2.1 Extract<T, U> - ユニオンから特定の型を抽出

**概念**: ユニオン型Tから、型Uに代入可能な型のみを抽出

```typescript
type AllTypes = "admin" | "user" | "guest" | 123 | true;
type StringTypes = Extract<AllTypes, string>;
// "admin" | "user" | "guest"

// 実践例：管理者系ロールの抽出
type UserRole = "admin" | "superAdmin" | "user" | "guest" | "moderator";
type AdminRoles = Extract<UserRole, "admin" | "superAdmin" | "moderator">;
// "admin" | "superAdmin" | "moderator"

function handleAdminAction(role: AdminRoles, action: string): void {
  console.log(`${role}が${action}を実行しました`);
}
```

### 2.2 Exclude<T, U> - ユニオンから特定の型を除外

**概念**: ユニオン型Tから、型Uに代入可能な型を除外

```typescript
type AllPermissions = "read" | "write" | "delete" | "admin" | "super";
type UserPermissions = Exclude<AllPermissions, "admin" | "super">;
// "read" | "write" | "delete"

// 実践例：状態管理
type AllStatus = "pending" | "processing" | "completed" | "failed" | "cancelled";
type ActiveStatus = Exclude<AllStatus, "completed" | "failed" | "cancelled">;
// "pending" | "processing"

function processActiveTask(status: ActiveStatus): string {
  switch (status) {
    case "pending":
      return "タスクは待機中です";
    case "processing":
      return "タスクを処理中です";
  }
}
```

### 2.3 NonNullable<T> - null/undefinedを除外

**概念**: 型Tから`null`と`undefined`を除外

```typescript
type MaybeString = string | null | undefined;
type DefiniteString = NonNullable<MaybeString>;
// string

// 実践例：配列のフィルタリング
function filterNonNullable<T>(array: (T | null | undefined)[]): NonNullable<T>[] {
  return array.filter((item): item is NonNullable<T> => item != null);
}

const mixedArray = ["hello", null, "world", undefined, "!"];
const cleanArray = filterNonNullable(mixedArray);
// string[] 型で、null/undefined が除外される
```

---

## 3. 関数型ユーティリティ

### 3.1 Parameters<T> - 引数の型を取得

**概念**: 関数型Tの引数の型をタプル型として取得

```typescript
function createUser(name: string, age: number, email: string): User {
  return { id: generateId(), name, age, email };
}

type CreateUserParams = Parameters<typeof createUser>;
// [string, number, string]

// 実践例：関数のラッパー作成
function logAndExecute<T extends (...args: any[]) => any>(
  fn: T,
  ...args: Parameters<T>
): ReturnType<T> {
  console.log(`関数 ${fn.name} を実行中...`, args);
  return fn(...args);
}
```

### 3.2 ReturnType<T> - 戻り値の型を取得

**概念**: 関数型Tの戻り値の型を取得

```typescript
function getUser(id: number): { id: number; name: string; email: string } {
  return { id, name: "太郎", email: "taro@example.com" };
}

type User = ReturnType<typeof getUser>;
// { id: number; name: string; email: string }

// 実践例：API結果の型安全な処理
async function processApiResult<T extends (...args: any[]) => Promise<any>>(
  apiFunction: T,
  processor: (result: Awaited<ReturnType<T>>) => void,
  ...args: Parameters<T>
): Promise<void> {
  const result = await apiFunction(...args);
  processor(result);
}
```

### 3.3 ConstructorParameters<T> - コンストラクタ引数の型

**概念**: コンストラクタ関数Tの引数の型をタプル型として取得

```typescript
class User {
  constructor(public name: string, public age: number, public email: string) {}
}

type UserConstructorParams = ConstructorParameters<typeof User>;
// [string, number, string]

// ファクトリーパターンでの活用
function createUser(...args: UserConstructorParams): User {
  return new User(...args);
}
```

### 3.4 InstanceType<T> - インスタンスの型

**概念**: コンストラクタ関数Tのインスタンスの型を取得

```typescript
class ApiClient {
  constructor(private baseUrl: string) {}
  async get(path: string): Promise<any> {
    return fetch(`${this.baseUrl}${path}`);
  }
}

type ApiClientInstance = InstanceType<typeof ApiClient>;
// ApiClient

// 抽象ファクトリーでの活用
abstract class ServiceFactory {
  abstract createApiClient(): InstanceType<typeof ApiClient>;
}
```

### 3.5 ThisParameterType<T> & OmitThisParameter<T>

**概念**: 関数型の`this`パラメータの型を取得・除外

```typescript
interface EventHandler {
  handleClick(this: HTMLElement, event: MouseEvent): void;
}

type UserThisType = ThisParameterType<EventHandler['handleClick']>;
// HTMLElement

type ClickHandler = OmitThisParameter<EventHandler['handleClick']>;
// (event: MouseEvent) => void
```

---

## 4. 高度なユーティリティ型の組み合わせ

### 4.1 複数のユーティリティ型の連鎖

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  isActive: boolean;
}

// 複数のユーティリティ型を組み合わせた高度な型変換
type UserUpdateRequest = Partial<Pick<User, "name" | "email" | "isActive">>;
// { name?: string; email?: string; isActive?: boolean; }

type SafeUserResponse = Required<Omit<User, "password" | "createdAt">>;
// { id: number; name: string; email: string; isActive: boolean; }

// 条件付きの型変換
type ConditionalUserData<T extends "public" | "private"> = T extends "public"
  ? Pick<User, "id" | "name">
  : T extends "private"
  ? Omit<User, "password">
  : never;

type PublicUser = ConditionalUserData<"public">;
// { id: number; name: string; }
```

### 4.2 カスタムユーティリティ型の作成

```typescript
// 深い階層のPartial
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// 特定の型のプロパティのみを選択
type PickByType<T, U> = {
  [P in keyof T as T[P] extends U ? P : never]: T[P];
};

// 最低1つのプロパティが必須
type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = 
  Pick<T, Exclude<keyof T, Keys>> & 
  {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>;
  }[Keys];

// 実用例
interface MixedTypes {
  id: number;
  name: string;
  isActive: boolean;
  createdAt: Date;
}

type StringProperties = PickByType<MixedTypes, string>;
// { name: string; }

type SearchCriteria = RequireAtLeastOne<{
  name?: string;
  email?: string;
  id?: number;
}>;

function searchUsers(criteria: SearchCriteria): User[] {
  // 最低1つの検索条件が必須
  return [];
}
```
