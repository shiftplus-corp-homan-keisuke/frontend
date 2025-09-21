# STEP06 総復習：ユーティリティ型による型変換と高度な型操作

## 📋 概要

このファイルは、STEP06「ユーティリティ型による型変換と高度な型操作」の理論学習内容を総復習するためのドキュメントです。既存のセッションファイルで学習した内容を体系的に整理し、理論的な理解を深めることを目的としています。

## 🎯 学習目標

- [ ] オブジェクト型変換ユーティリティの完全理解と実践的活用
- [ ] Extract・Exclude型による型の抽出・除外パターンの習得
- [ ] 関数型ユーティリティによる関数の型操作の理解
- [ ] 高度なユーティリティ型の組み合わせパターンの習得
- [ ] 実践での活用場面の把握と適切な使い分け

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

---

## 5. 実践での活用場面

### 5.1 フォーム処理（Partial型を使った段階的なデータ入力）

```typescript
interface CompleteRegistration {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  preferences: {
    newsletter: boolean;
    theme: "light" | "dark";
  };
}

// 各ステップの型定義
type Step1Data = Pick<CompleteRegistration, "email" | "password">;
type Step2Data = Pick<CompleteRegistration, "firstName" | "lastName">;
type Step3Data = Pick<CompleteRegistration, "preferences">;

// 段階的フォーム管理
class MultiStepForm {
  private step1: Partial<Step1Data> = {};
  private step2: Partial<Step2Data> = {};
  private step3: Partial<Step3Data> = {};

  updateStep1(data: Partial<Step1Data>): void {
    this.step1 = { ...this.step1, ...data };
  }

  isComplete(): boolean {
    return this.isStep1Complete() && this.isStep2Complete() && this.isStep3Complete();
  }

  private isStep1Complete(): boolean {
    return !!(this.step1.email && this.step1.password);
  }

  getCompleteData(): CompleteRegistration | null {
    if (!this.isComplete()) return null;
    return {
      ...this.step1 as Step1Data,
      ...this.step2 as Step2Data,
      ...this.step3 as Step3Data,
    };
  }
}
```

### 5.2 API設計（Pick/Omit型を使ったリクエスト・レスポンス型の生成）

```typescript
interface FullBlogPost {
  id: string;
  title: string;
  content: string;
  authorId: string;
  publishedAt: Date | null;
  createdAt: Date;
  viewCount: number;
  internalNotes: string;
}

// API用の型定義
namespace BlogPostAPI {
  // 一覧表示用（最小限の情報）
  export type ListItem = Pick<FullBlogPost, "id" | "title" | "publishedAt" | "viewCount">;

  // 詳細表示用（内部情報を除外）
  export type Detail = Omit<FullBlogPost, "internalNotes" | "authorId">;

  // 作成リクエスト用（自動生成フィールドを除外）
  export type CreateRequest = Omit<FullBlogPost, "id" | "createdAt" | "viewCount">;

  // 更新リクエスト用（変更不可フィールドを除外）
  export type UpdateRequest = Partial<Omit<FullBlogPost, "id" | "createdAt" | "viewCount">>;
}

// API実装
class BlogPostService {
  async getPosts(): Promise<BlogPostAPI.ListItem[]> {
    const fullPosts = await this.fetchPosts();
    return fullPosts.map(post => ({
      id: post.id,
      title: post.title,
      publishedAt: post.publishedAt,
      viewCount: post.viewCount,
    }));
  }

  async createPost(data: BlogPostAPI.CreateRequest): Promise<BlogPostAPI.Detail> {
    const fullPost: FullBlogPost = {
      id: this.generateId(),
      ...data,
      createdAt: new Date(),
      viewCount: 0,
    };
    await this.savePost(fullPost);
    const { internalNotes, authorId, ...detail } = fullPost;
    return detail;
  }
}
```

### 5.3 状態管理での型変換

```typescript
// Redux風の状態管理
interface AppState {
  user: User | null;
  posts: BlogPost[];
  loading: boolean;
}

type Action<T extends string, P = void> = P extends void 
  ? { type: T } 
  : { type: T; payload: P };

type AppAction = 
  | Action<'SET_USER', User>
  | Action<'SET_POSTS', BlogPost[]>
  | Action<'SET_LOADING', boolean>
  | Action<'CLEAR_USER'>;

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_POSTS':
      return { ...state, posts: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'CLEAR_USER':
      return { ...state, user: null };
    default:
      return state;
  }
}
```

---

## 📚 学習のポイント

### 重要な概念の整理

1. **オブジェクト型変換ユーティリティ**
   - `Partial<T>`: フォーム処理や部分更新で活用
   - `Required<T>`: 設定の初期化で全プロパティを必須に
   - `Readonly<T>`: イミュータブルなデータ構造の作成
   - `Pick<T, K>`: API設計で必要な情報のみを選択
   - `Omit<T, K>`: 機密情報や不要なプロパティを除外
   - `Record<K, T>`: 設定オブジェクトやマッピングデータの型定義

2. **Extract・Exclude型の活用**
   - `Extract<T, U>`: ユニオン型から特定の型のみを抽出
   - `Exclude<T, U>`: ユニオン型から特定の型を除外
   - `NonNullable<T>`: null/undefinedを除外して型安全性を確保

3. **関数型ユーティリティ**
   - `Parameters<T>`: 関数の引数型を取得してラッパー関数作成
   - `ReturnType<T>`: 関数の戻り値型を取得して型の再利用
   - `ConstructorParameters<T>`: コンストラクタ引数型でファクトリーパターン
   - `InstanceType<T>`: インスタンス型で抽象ファクトリー実装

4. **高度な組み合わせパターン**
   - 複数のユーティリティ型の連鎖による複雑な型変換
   - 条件付き型との組み合わせで動的な型生成
   - カスタムユーティリティ型の作成で独自の型操作

5. **実践での活用場面**
   - フォーム処理での段階的なデータ入力
   - API設計でのリクエスト・レスポンス型の生成
   - 状態管理での型安全な状態変換

### 次のステップへの準備

- 高度な型操作の習得
- 実際のプロジェクトでの応用
- パフォーマンスを考慮した設計
- テンプレートリテラル型の理解

---

## 🔗 関連リソース

- [TypeScript Handbook - Utility Types](https://www.typescriptlang.org/docs/handbook/utility-types.html)
- 既存のセッションファイル：Session1_オブジェクト型ユーティリティマスター.md、Session2_Extract・Exclude・関数型ユーティリティ.md
- Step06_ユーティリティ型入門.md