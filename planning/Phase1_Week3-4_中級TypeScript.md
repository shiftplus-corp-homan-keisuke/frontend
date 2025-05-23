# Phase 1: Week 3-4 中級 TypeScript - ジェネリクス・ユーティリティ型完全習得

## 📅 学習期間・目標

**期間**: Week 3-4（2 週間）  
**総学習時間**: 40 時間（週 20 時間）

### 🎯 Week 3-4 到達目標

- [ ] ジェネリクスの完全理解と実践的活用
- [ ] ユーティリティ型の組み合わせ活用
- [ ] 条件付き型・マップ型の基礎実装
- [ ] 型推論の最適化テクニック習得
- [ ] 中規模アプリケーションでの型設計能力

## 📖 理論学習内容

### Day 15-18: ジェネリクス完全理解

#### 基本的なジェネリクス

```typescript
// 1. 基本的なジェネリック関数
function identity<T>(arg: T): T {
  return arg;
}

// 使用例
const stringResult = identity<string>("hello"); // string型
const numberResult = identity<number>(42); // number型
const autoInferred = identity("world"); // 型推論でstring

// 2. 複数の型パラメータ
function pair<T, U>(first: T, second: U): [T, U] {
  return [first, second];
}

const stringNumberPair = pair("hello", 42); // [string, number]
const booleanArrayPair = pair(true, [1, 2, 3]); // [boolean, number[]]

// 3. ジェネリック制約
interface Lengthwise {
  length: number;
}

function loggingIdentity<T extends Lengthwise>(arg: T): T {
  console.log(arg.length); // lengthプロパティが保証される
  return arg;
}

loggingIdentity("hello"); // OK: string has length
loggingIdentity([1, 2, 3]); // OK: array has length
loggingIdentity({ length: 10, value: 3 }); // OK: object has length
// loggingIdentity(3);        // Error: number doesn't have length
```

#### 高度なジェネリクスパターン

```typescript
// 4. keyof制約を使ったジェネリクス
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

interface Person {
  name: string;
  age: number;
  email: string;
}

const person: Person = { name: "Alice", age: 30, email: "alice@example.com" };

const name = getProperty(person, "name"); // string型
const age = getProperty(person, "age"); // number型
// const invalid = getProperty(person, "invalid"); // Error

// 5. 条件付きジェネリクス
type ApiResponse<T> = T extends string ? { message: T } : { data: T };

type StringResponse = ApiResponse<string>; // { message: string }
type NumberResponse = ApiResponse<number>; // { data: number }

// 6. ジェネリッククラス
class GenericRepository<T, K extends keyof T> {
  private items: T[] = [];

  add(item: T): void {
    this.items.push(item);
  }

  findById(id: T[K]): T | undefined {
    return this.items.find((item) => item[this.idKey] === id);
  }

  constructor(private idKey: K) {}

  getAll(): readonly T[] {
    return [...this.items];
  }

  update(id: T[K], updates: Partial<T>): boolean {
    const index = this.items.findIndex((item) => item[this.idKey] === id);
    if (index !== -1) {
      this.items[index] = { ...this.items[index], ...updates };
      return true;
    }
    return false;
  }

  delete(id: T[K]): boolean {
    const index = this.items.findIndex((item) => item[this.idKey] === id);
    if (index !== -1) {
      this.items.splice(index, 1);
      return true;
    }
    return false;
  }
}

// 使用例
interface User {
  id: number;
  name: string;
  email: string;
}

const userRepo = new GenericRepository<User, "id">("id");
userRepo.add({ id: 1, name: "Alice", email: "alice@example.com" });
const user = userRepo.findById(1); // User | undefined
```

### Day 19-21: ユーティリティ型の組み合わせ活用

#### 基本的なユーティリティ型

```typescript
// 1. Pick - 特定のプロパティを選択
interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

type PublicUser = Pick<User, "id" | "name" | "email">;
// { id: number; name: string; email: string; }

type UserCredentials = Pick<User, "email" | "password">;
// { email: string; password: string; }

// 2. Omit - 特定のプロパティを除外
type CreateUserRequest = Omit<User, "id" | "createdAt" | "updatedAt">;
// { name: string; email: string; password: string; }

type UpdateUserRequest = Omit<
  User,
  "id" | "createdAt" | "updatedAt" | "password"
>;
// { name: string; email: string; }

// 3. Partial - 全てのプロパティをオプショナルに
type PartialUser = Partial<User>;
// { id?: number; name?: string; email?: string; ... }

function updateUser(id: number, updates: Partial<User>): User {
  // 部分的な更新が可能
  const existingUser = getUserById(id);
  return { ...existingUser, ...updates };
}

// 4. Required - 全てのプロパティを必須に
interface OptionalConfig {
  apiUrl?: string;
  timeout?: number;
  retries?: number;
}

type RequiredConfig = Required<OptionalConfig>;
// { apiUrl: string; timeout: number; retries: number; }

// 5. Record - キーと値の型を指定
type UserRoles = "admin" | "editor" | "viewer";
type Permissions = Record<UserRoles, string[]>;
// { admin: string[]; editor: string[]; viewer: string[]; }

const permissions: Permissions = {
  admin: ["read", "write", "delete"],
  editor: ["read", "write"],
  viewer: ["read"],
};
```

### Day 22-28: 条件付き型・マップ型の基礎

#### 条件付き型の基本

```typescript
// 1. 基本的な条件付き型
type IsString<T> = T extends string ? true : false;

type Test1 = IsString<string>; // true
type Test2 = IsString<number>; // false

// 2. infer キーワード
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

function getString(): string {
  return "hello";
}
function getNumber(): number {
  return 42;
}

type StringReturn = ReturnType<typeof getString>; // string
type NumberReturn = ReturnType<typeof getNumber>; // number

// 3. 配列要素の型抽出
type ArrayElement<T> = T extends (infer U)[] ? U : never;

type StringArrayElement = ArrayElement<string[]>; // string
type NumberArrayElement = ArrayElement<number[]>; // number

// 4. Promise の値型抽出
type Awaited<T> = T extends Promise<infer U> ? U : T;

type PromiseString = Awaited<Promise<string>>; // string
type DirectString = Awaited<string>; // string

// 5. 関数パラメータの型抽出
type Parameters<T> = T extends (...args: infer P) => any ? P : never;

function example(a: string, b: number, c: boolean): void {}

type ExampleParams = Parameters<typeof example>; // [string, number, boolean]
```

## 🎯 実践演習

### 演習 3-1: 型安全な API クライアント実装 🔶

**目標**: ジェネリクスを活用した実用的な API クライアント

```typescript
// 以下の要件を満たすAPIクライアントを実装せよ

interface ApiEndpoint {
  method: "GET" | "POST" | "PUT" | "DELETE";
  path: string;
  requestBody?: unknown;
  responseBody: unknown;
  queryParams?: Record<string, string | number | boolean>;
}

interface ApiClientConfig {
  baseUrl: string;
  defaultHeaders?: Record<string, string>;
  timeout?: number;
  retries?: number;
}

// 要件:
// 1. 型安全なメソッド生成
// 2. エラーハンドリング
// 3. リクエスト/レスポンスの型推論
// 4. クエリパラメータの型安全性
// 5. 認証ヘッダーの自動付与

class TypeSafeApiClient<TEndpoints extends Record<string, ApiEndpoint>> {
  constructor(private config: ApiClientConfig, private endpoints: TEndpoints) {}

  // 実装すべきメソッド:
  // - request<K extends keyof TEndpoints>(...)
  // - get<K extends keyof TEndpoints>(...)
  // - post<K extends keyof TEndpoints>(...)
  // - put<K extends keyof TEndpoints>(...)
  // - delete<K extends keyof TEndpoints>(...)
}

// 使用例
interface MyApiEndpoints {
  getUsers: {
    method: "GET";
    path: "/users";
    responseBody: User[];
    queryParams: { page?: number; limit?: number };
  };
  createUser: {
    method: "POST";
    path: "/users";
    requestBody: Omit<User, "id">;
    responseBody: User;
  };
  updateUser: {
    method: "PUT";
    path: "/users/:id";
    requestBody: Partial<User>;
    responseBody: User;
  };
}

const client = new TypeSafeApiClient(
  { baseUrl: "https://api.example.com" },
  {} as MyApiEndpoints
);

// 型安全な使用
const users = await client.get("getUsers", {
  queryParams: { page: 1, limit: 10 },
});
const newUser = await client.post("createUser", {
  body: { name: "Alice", email: "alice@example.com" },
});
```

**評価基準**:

- [ ] 完全な型安全性が確保されている
- [ ] エラーハンドリングが適切に実装されている
- [ ] 型推論が正しく動作する
- [ ] 実用的な機能が含まれている

### 演習 3-2: 高度な型変換システム 🔥

**目標**: ユーティリティ型の組み合わせによる複雑な型変換

```typescript
// 以下の型変換システムを実装せよ

// 1. DeepPick - ネストしたオブジェクトから特定のパスを抽出
type DeepPick<T, K extends string> = /* 実装 */;

// 2. DeepOmit - ネストしたオブジェクトから特定のパスを除外
type DeepOmit<T, K extends string> = /* 実装 */;

// 3. PathsToProperty - オブジェクト内の全パスを文字列で取得
type PathsToProperty<T> = /* 実装 */;

// 4. GetByPath - パス文字列でネストしたプロパティの型を取得
type GetByPath<T, P extends string> = /* 実装 */;

// テストケース
interface ComplexObject {
  user: {
    profile: {
      name: string;
      age: number;
      address: {
        street: string;
        city: string;
        country: {
          code: string;
          name: string;
        };
      };
    };
    preferences: {
      theme: 'light' | 'dark';
      notifications: boolean;
    };
  };
  posts: Array<{
    id: number;
    title: string;
    content: string;
    tags: string[];
  }>;
}

// 期待される結果
type UserProfile = DeepPick<ComplexObject, 'user.profile'>;
// { user: { profile: { name: string; age: number; address: {...} } } }

type WithoutAddress = DeepOmit<ComplexObject, 'user.profile.address'>;
// address プロパティが除外されたオブジェクト

type AllPaths = PathsToProperty<ComplexObject>;
// 'user' | 'user.profile' | 'user.profile.name' | ... (全てのパス)

type CountryName = GetByPath<ComplexObject, 'user.profile.address.country.name'>;
// string
```

**評価基準**:

- [ ] 全ての型変換が正しく動作する
- [ ] 複雑なネスト構造に対応している
- [ ] 型推論が適切に機能する
- [ ] 実装関数が型安全に動作する

## 📊 Week 3-4 評価基準

### 理解度チェックリスト

#### ジェネリクス (35%)

- [ ] 基本的なジェネリック関数を作成できる
- [ ] ジェネリック制約を適切に使用できる
- [ ] keyof 制約を活用した型安全な関数を実装できる
- [ ] ジェネリッククラスを設計できる
- [ ] 条件付きジェネリクスを理解している

#### ユーティリティ型 (30%)

- [ ] 基本的なユーティリティ型を組み合わせて使用できる
- [ ] カスタムユーティリティ型を作成できる
- [ ] 複雑な型変換を実装できる
- [ ] 実践的な場面でユーティリティ型を活用できる

#### 条件付き型・マップ型 (25%)

- [ ] 基本的な条件付き型を理解している
- [ ] infer キーワードを適切に使用できる
- [ ] マップ型でプロパティを変換できる
- [ ] 再帰的な型定義を実装できる

#### 実践応用 (10%)

- [ ] 中規模アプリケーションの型設計ができる
- [ ] 型安全なライブラリを設計できる
- [ ] パフォーマンスを考慮した型設計ができる

### 成果物チェックリスト

- [ ] **型安全 API クライアント**: 実用的なジェネリック活用例
- [ ] **型変換ライブラリ**: ユーティリティ型の組み合わせ活用
- [ ] **ジェネリックコンポーネント**: 再利用可能な型安全設計
- [ ] **型推論最適化例**: パフォーマンスを考慮した実装

## 🔄 Week 5-6 への準備

### 次週学習内容の予習

```typescript
// Week 5-6で学習する上級TypeScriptの基礎概念
// 以下のコードを読んで理解しておくこと

// 1. テンプレートリテラル型
type EventName<T extends string> = `on${Capitalize<T>}`;
type MouseEvents = "click" | "hover" | "focus";
type MouseEventHandlers = EventName<MouseEvents>;
// Result: "onClick" | "onHover" | "onFocus"

// 2. 再帰的な型定義
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

// 3. 高度な条件付き型
type ReturnTypeOfPromise<T> = T extends Promise<infer U> ? U : T;
type ArrayElementType<T> = T extends (infer U)[] ? U : never;
```

### 環境準備

- [ ] type-challenges リポジトリのクローン
- [ ] TypeScript Playground の活用準備
- [ ] パフォーマンス測定ツールの準備

### 学習継続のコツ

1. **理論と実践のバランス**: 概念学習後は必ず実装で確認
2. **段階的な理解**: 複雑な型から簡単な部分に分解して理解
3. **コミュニティ活用**: TypeScript Discord での質問・議論
4. **アウトプット継続**: 学習内容のブログ記事作成

---

**📌 重要**: Week 3-4 は TypeScript の中級レベルを確実に習得する重要な期間です。ジェネリクスとユーティリティ型の組み合わせにより、実用的で型安全なコードが書けるようになります。
