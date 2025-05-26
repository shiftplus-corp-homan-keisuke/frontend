# Step 5: ジェネリクス基礎

> 💡 **補足資料**: 詳細な解説は以下の補足資料を見てね 🐰
>
> - 📖 [専門用語集](./Step05_補足_専門用語集.md) - ジェネリクス・型制約・高度な型機能の重要な概念と用語の詳細解説
> - 💻 [実践コード例](./Step05_補足_実践コード例.md) - 段階的な学習用コード集
> - 🚨 [トラブルシューティング](./Step05_補足_トラブルシューティング.md) - よくあるエラーと解決方法
> - 📚 [参考リソース](./Step05_補足_参考リソース.md) - 学習に役立つリンク集

## 📅 学習期間・目標

**期間**: Step 5  
**総学習時間**: 3 時間  
**学習スタイル**: 理論 20% + 実践コード 50% + 演習 30%

### 🎯 Step 5 到達目標

- [ ] ジェネリクスの基本概念と活用方法の完全理解
- [ ] ジェネリック制約の実践的活用
- [ ] ジェネリック関数・クラスの設計と実装
- [ ] 型推論とジェネリクスの組み合わせ活用
- [ ] 再利用可能なライブラリの基礎設計

## 📚 理論学習内容

### Section 1: ジェネリクスの基本概念

#### 🔍 ジェネリクスの基本と他言語との比較

##### 1. 基本的なジェネリクス

```typescript
// Java: <T> T identity(T arg) { return arg; }
// C#: T Identity<T>(T arg) { return arg; }
// Rust: fn identity<T>(arg: T) -> T { arg }
// TypeScript: より柔軟な型推論
// 💡 詳細解説: ジェネリクス → Step05_補足_専門用語集.md#ジェネリクスgenerics

function identity<T>(arg: T): T {
  return arg;
}

// 使用例
const stringResult = identity<string>("hello"); // 明示的な型指定
const numberResult = identity<number>(42); // 明示的な型指定
const autoInferred = identity("world"); // 型推論でstring
const boolInferred = identity(true); // 型推論でboolean
```

##### 2. 複数の型パラメータ

```typescript
function pair<T, U>(first: T, second: U): [T, U] {
  return [first, second];
}

const stringNumberPair = pair("hello", 42); // [string, number]
const booleanArrayPair = pair(true, [1, 2, 3]); // [boolean, number[]]
```

##### 3. ジェネリック配列操作

```typescript
function getFirst<T>(array: T[]): T | undefined {
  return array.length > 0 ? array[0] : undefined;
}

function getLast<T>(array: T[]): T | undefined {
  return array.length > 0 ? array[array.length - 1] : undefined;
}

function reverse<T>(array: T[]): T[] {
  return [...array].reverse();
}

// 使用例
const numbers = [1, 2, 3, 4, 5];
const firstNumber = getFirst(numbers); // number | undefined
const lastNumber = getLast(numbers); // number | undefined
const reversedNumbers = reverse(numbers); // number[]

const strings = ["apple", "banana", "cherry"];
const firstString = getFirst(strings); // string | undefined
const reversedStrings = reverse(strings); // string[]
```

#### 🎯 ジェネリック制約の活用

##### 1. extends 制約

```typescript
// 💡 詳細解説: ジェネリック制約 → Step05_補足_専門用語集.md#ジェネリック制約generic-constraints
interface Lengthwise {
  length: number;
}

function loggingIdentity<T extends Lengthwise>(arg: T): T {
  console.log(arg.length); // lengthプロパティが保証される
  return arg;
}

// 使用例
loggingIdentity("hello"); // OK: string has length
loggingIdentity([1, 2, 3]); // OK: array has length
loggingIdentity({ length: 10, value: 3 }); // OK: object has length
// loggingIdentity(3);                       // Error: number doesn't have length
```

##### 2. keyof 制約

```typescript
// 💡 詳細解説: keyof演算子 → Step05_補足_専門用語集.md#keyof演算子keyof-operator
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
```

##### 3. 条件付き制約

```typescript
// 💡 詳細解説: 条件付き制約 → Step05_補足_専門用語集.md#条件付き制約conditional-constraints
function processValue<T extends string | number>(value: T): string {
  if (typeof value === "string") {
    return value.toUpperCase();
  } else {
    return value.toString();
  }
}
```

##### 4. 複数制約

```typescript
interface Serializable {
  serialize(): string;
}

interface Timestamped {
  timestamp: Date;
}

// 💡 詳細解説: インターセクション型 → Step05_補足_専門用語集.md#インターセクション型intersection-types
function processEntity<T extends Serializable & Timestamped>(
  entity: T
): string {
  const serialized = entity.serialize();
  const time = entity.timestamp.toISOString();
  return `${serialized} at ${time}`;
}
```

### Section 2: ジェネリッククラスの設計

#### 🔧 基本的なジェネリッククラス

##### 1. 基本的なジェネリッククラス

```typescript
// 💡 詳細解説: ジェネリッククラス → Step05_補足_専門用語集.md#ジェネリッククラスgeneric-classes
class Box<T> {
  private value: T;

  constructor(value: T) {
    this.value = value;
  }

  getValue(): T {
    return this.value;
  }

  setValue(value: T): void {
    this.value = value;
  }

  map<U>(mapper: (value: T) => U): Box<U> {
    return new Box(mapper(this.value));
  }
}

// 使用例
// 💡 詳細解説: 型推論 → Step05_補足_専門用語集.md#型推論type-inference
const stringBox = new Box("hello");
const numberBox = stringBox.map((str) => str.length); // Box<number>
const upperBox = stringBox.map((str) => str.toUpperCase()); // Box<string>
```

##### 2. 複数型パラメータのクラス

```typescript
class Pair<T, U> {
  constructor(private first: T, private second: U) {}

  getFirst(): T {
    return this.first;
  }

  getSecond(): U {
    return this.second;
  }

  swap(): Pair<U, T> {
    return new Pair(this.second, this.first);
  }

  map<V, W>(
    firstMapper: (value: T) => V,
    secondMapper: (value: U) => W
  ): Pair<V, W> {
    return new Pair(firstMapper(this.first), secondMapper(this.second));
  }
}

// 使用例
const stringNumberPair = new Pair("hello", 42);
const swapped = stringNumberPair.swap(); // Pair<number, string>
const mapped = stringNumberPair.map(
  (str) => str.length,
  (num) => num.toString()
); // Pair<number, string>
```

### Section 3: 実用的なジェネリック活用

#### 🔧 型安全な API クライアント

##### 1. API エンドポイントの型定義

```typescript
// 型安全なAPIクライアント
interface ApiEndpoint {
  method: "GET" | "POST" | "PUT" | "DELETE";
  path: string;
  requestBody?: unknown;
  responseBody: unknown;
  queryParams?: Record<string, string | number | boolean>;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}
```

##### 2. 型安全な API クライアントクラス

```typescript
class TypeSafeApiClient<TEndpoints extends Record<string, ApiEndpoint>> {
  constructor(private baseUrl: string, private endpoints: TEndpoints) {}

  async request<K extends keyof TEndpoints>(
    endpoint: K,
    options?: {
      body?: TEndpoints[K]["requestBody"];
      params?: TEndpoints[K]["queryParams"];
    }
  ): Promise<ApiResponse<TEndpoints[K]["responseBody"]>> {
    const config = this.endpoints[endpoint];
    const url = new URL(config.path, this.baseUrl);

    // クエリパラメータの追加
    if (options?.params) {
      Object.entries(options.params).forEach(([key, value]) => {
        url.searchParams.append(key, String(value));
      });
    }

    const requestInit: RequestInit = {
      method: config.method,
      headers: {
        "Content-Type": "application/json",
      },
    };

    if (options?.body && config.method !== "GET") {
      requestInit.body = JSON.stringify(options.body);
    }

    try {
      const response = await fetch(url.toString(), requestInit);
      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: {
            code: `HTTP_${response.status}`,
            message: data.message || response.statusText,
          },
        };
      }

      return {
        success: true,
        data,
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: "NETWORK_ERROR",
          message: error instanceof Error ? error.message : "Unknown error",
        },
      };
    }
  }
}
```

## 🎯 実践演習

### 演習 5-1: ジェネリック関数ライブラリ 🔰

```typescript
// 配列操作ユーティリティの実装

function chunk<T>(array: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}

function groupBy<T, K extends string | number | symbol>(
  array: T[],
  keySelector: (item: T) => K
): Record<K, T[]> {
  return array.reduce((groups, item) => {
    const key = keySelector(item);
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(item);
    return groups;
  }, {} as Record<K, T[]>);
}

function unique<T>(array: T[], keySelector?: (item: T) => unknown): T[] {
  if (!keySelector) {
    return [...new Set(array)];
  }

  const seen = new Set();
  return array.filter((item) => {
    const key = keySelector(item);
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

// 使用例
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const chunked = chunk(numbers, 3); // number[][]

const users = [
  { id: 1, name: "Alice", department: "Engineering" },
  { id: 2, name: "Bob", department: "Marketing" },
  { id: 3, name: "Charlie", department: "Engineering" },
];

const byDepartment = groupBy(users, (user) => user.department);
// Record<string, User[]>
```

### 演習 5-2: 型安全なキャッシュシステム 🔶

```typescript
// 型安全なキャッシュシステムの実装

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
  accessCount: number;
  createdAt: number;
  lastAccessed: number;
}

class TypeSafeCache<TSchema extends Record<string, unknown>> {
  private cache = new Map<keyof TSchema, CacheEntry<TSchema[keyof TSchema]>>();
  private stats = {
    hits: 0,
    misses: 0,
  };

  constructor(private defaultTtl: number = 60000) {} // デフォルト1分

  set<K extends keyof TSchema>(
    key: K,
    value: TSchema[K],
    ttl: number = this.defaultTtl
  ): void {
    const now = Date.now();
    const entry: CacheEntry<TSchema[K]> = {
      value,
      expiresAt: now + ttl,
      accessCount: 0,
      createdAt: now,
      lastAccessed: now,
    };

    this.cache.set(key, entry as CacheEntry<TSchema[keyof TSchema]>);
  }

  get<K extends keyof TSchema>(key: K): TSchema[K] | null {
    const entry = this.cache.get(key);

    if (!entry) {
      this.stats.misses++;
      return null;
    }

    const now = Date.now();

    if (now > entry.expiresAt) {
      this.cache.delete(key);
      this.stats.misses++;
      return null;
    }

    entry.accessCount++;
    entry.lastAccessed = now;
    this.stats.hits++;

    return entry.value as TSchema[K];
  }

  has<K extends keyof TSchema>(key: K): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  clear(): void {
    this.cache.clear();
    this.stats.hits = 0;
    this.stats.misses = 0;
  }
}

// 使用例
interface AppCacheSchema {
  "user:profile": { id: number; name: string; email: string };
  "user:preferences": { theme: "light" | "dark"; language: string };
  "api:users": Array<{ id: number; name: string }>;
}

const cache = new TypeSafeCache<AppCacheSchema>(300000); // 5分TTL

// 型安全な使用
cache.set("user:profile", { id: 1, name: "Alice", email: "alice@example.com" });
const profile = cache.get("user:profile"); // { id: number; name: string; email: string } | null
```

## 📊 Step 5 評価基準

### 理解度チェックリスト

#### ジェネリクス基礎 (30%)

- [ ] 基本的なジェネリック関数を作成できる
- [ ] 型推論とジェネリクスの関係を理解している
- [ ] 複数の型パラメータを適切に使用できる
- [ ] ジェネリック型エイリアスを定義できる

#### ジェネリック制約 (25%)

- [ ] extends 制約を適切に使用できる
- [ ] keyof 制約を活用できる
- [ ] 条件付き制約を実装できる
- [ ] 複雑な制約の組み合わせを理解している

#### ジェネリッククラス (25%)

- [ ] 基本的なジェネリッククラスを設計できる
- [ ] 制約付きジェネリッククラスを実装できる
- [ ] 実用的なデザインパターンを適用できる
- [ ] 型安全なライブラリを設計できる

#### 実践応用 (20%)

- [ ] 再利用可能なユーティリティ関数を作成できる
- [ ] 型安全な API クライアントを実装できる
- [ ] 複雑なジェネリックシステムを設計できる
- [ ] パフォーマンスを考慮した実装ができる

### 成果物チェックリスト

- [ ] **ジェネリック関数ライブラリ**: 再利用可能な関数群
- [ ] **型安全キャッシュシステム**: 実用的なキャッシュ実装
- [ ] **API クライアント**: 型安全な HTTP クライアント
- [ ] **ユーティリティクラス**: 汎用的なジェネリッククラス

## 🔄 Step 6 への準備

### 次週学習内容の予習

```typescript
// Step 6で学習するユーティリティ型の基礎概念
// 以下のコードを読んで理解しておくこと

// 1. 組み込みユーティリティ型
type PartialUser = Partial<User>;
type RequiredUser = Required<User>;
type UserEmail = Pick<User, "email">;
type UserWithoutId = Omit<User, "id">;

// 2. カスタムユーティリティ型
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// 3. 条件付きユーティリティ型
type NonNullable<T> = T extends null | undefined ? never : T;
```

### 環境準備

- [ ] type-challenges の練習問題準備
- [ ] TypeScript Playground での実験継続
- [ ] 実践プロジェクトでのジェネリクス活用
- [ ] パフォーマンス測定ツールの準備

### 学習継続のコツ

1. **段階的理解**: 簡単なジェネリクスから複雑なパターンへ
2. **実践重視**: 実際のプロジェクトでの活用を意識
3. **パターン学習**: 良いジェネリック設計パターンの蓄積
4. **型推論活用**: 明示的型指定と型推論のバランス

---

**📌 重要**: Step 5 は TypeScript の再利用性と型安全性を両立させる重要な技術を学習します。ジェネリクスにより、柔軟で保守性の高いコードが書けるようになります。

**🌟 次週は、ユーティリティ型を使った高度な型操作について学習します！**
