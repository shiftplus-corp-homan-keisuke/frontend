# Step06 専門用語集

> 💡 **このファイルについて**: Step06で出てくるユーティリティ型関連の重要な専門用語と概念の詳細解説集です。

## 📋 目次
1. [ユーティリティ型基本用語](#ユーティリティ型基本用語)
2. [組み込みユーティリティ型](#組み込みユーティリティ型)
3. [カスタムユーティリティ型](#カスタムユーティリティ型)
4. [型レベルプログラミング](#型レベルプログラミング)

---

## ユーティリティ型基本用語

### ユーティリティ型（Utility Types）
**定義**: 既存の型から新しい型を生成するための組み込み型操作

**基本概念**:
```typescript
// 基本的なユーティリティ型の使用
interface User {
  id: number;
  name: string;
  email: string;
  password: string;
}

// Partial: 全プロパティをオプショナルに
type PartialUser = Partial<User>;
// { id?: number; name?: string; email?: string; password?: string; }

// Pick: 特定のプロパティのみ選択
type PublicUser = Pick<User, 'id' | 'name' | 'email'>;
// { id: number; name: string; email: string; }

// Omit: 特定のプロパティを除外
type UserWithoutPassword = Omit<User, 'password'>;
// { id: number; name: string; email: string; }
```

### 型変換（Type Transformation）
**定義**: 既存の型を別の形に変換する操作

**コード例**:
```typescript
// 型変換の例
type StringToNumber<T extends string> = T extends `${infer N extends number}` ? N : never;

type Result1 = StringToNumber<"123">; // 123
type Result2 = StringToNumber<"abc">; // never

// オブジェクトの型変換
type Stringify<T> = {
  [K in keyof T]: string;
};

type StringifiedUser = Stringify<User>;
// { id: string; name: string; email: string; password: string; }
```

---

## 組み込みユーティリティ型

### Partial<T>
**定義**: 型Tの全プロパティをオプショナルにする

**実装**:
```typescript
type Partial<T> = {
  [P in keyof T]?: T[P];
};

// 使用例
interface Config {
  host: string;
  port: number;
  ssl: boolean;
}

function updateConfig(config: Config, updates: Partial<Config>): Config {
  return { ...config, ...updates };
}

const config: Config = { host: "localhost", port: 3000, ssl: false };
const updated = updateConfig(config, { port: 8080 }); // portのみ更新
```

### Required<T>
**定義**: 型Tの全プロパティを必須にする

**実装**:
```typescript
type Required<T> = {
  [P in keyof T]-?: T[P];
};

// 使用例
interface PartialUser {
  id?: number;
  name?: string;
  email?: string;
}

type CompleteUser = Required<PartialUser>;
// { id: number; name: string; email: string; }
```

### Readonly<T>
**定義**: 型Tの全プロパティを読み取り専用にする

**実装**:
```typescript
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};

// 使用例
interface MutableUser {
  id: number;
  name: string;
}

type ImmutableUser = Readonly<MutableUser>;
// { readonly id: number; readonly name: string; }

const user: ImmutableUser = { id: 1, name: "Alice" };
// user.name = "Bob"; // Error: Cannot assign to 'name'
```

### Pick<T, K>
**定義**: 型Tから特定のプロパティKのみを選択

**実装**:
```typescript
type Pick<T, K extends keyof T> = {
  [P in K]: T[P];
};

// 使用例
interface Article {
  id: number;
  title: string;
  content: string;
  authorId: number;
  createdAt: Date;
  updatedAt: Date;
}

type ArticlePreview = Pick<Article, 'id' | 'title' | 'createdAt'>;
// { id: number; title: string; createdAt: Date; }
```

### Omit<T, K>
**定義**: 型Tから特定のプロパティKを除外

**実装**:
```typescript
type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;

// 使用例
type CreateArticleRequest = Omit<Article, 'id' | 'createdAt' | 'updatedAt'>;
// { title: string; content: string; authorId: number; }
```

### Record<K, T>
**定義**: キーKと値Tを持つオブジェクト型を作成

**実装**:
```typescript
type Record<K extends keyof any, T> = {
  [P in K]: T;
};

// 使用例
type UserRole = 'admin' | 'user' | 'guest';
type Permissions = Record<UserRole, string[]>;
// { admin: string[]; user: string[]; guest: string[]; }

const permissions: Permissions = {
  admin: ['read', 'write', 'delete'],
  user: ['read', 'write'],
  guest: ['read']
};
```

### Exclude<T, U>
**定義**: 型Tから型Uに代入可能な型を除外

**実装**:
```typescript
type Exclude<T, U> = T extends U ? never : T;

// 使用例
type AllColors = 'red' | 'green' | 'blue' | 'yellow';
type PrimaryColors = 'red' | 'green' | 'blue';
type SecondaryColors = Exclude<AllColors, PrimaryColors>; // 'yellow'
```

### Extract<T, U>
**定義**: 型Tから型Uに代入可能な型のみを抽出

**実装**:
```typescript
type Extract<T, U> = T extends U ? T : never;

// 使用例
type StringOrNumber = string | number | boolean;
type OnlyStringOrNumber = Extract<StringOrNumber, string | number>; // string | number
```

### NonNullable<T>
**定義**: 型Tからnullとundefinedを除外

**実装**:
```typescript
type NonNullable<T> = T extends null | undefined ? never : T;

// 使用例
type MaybeString = string | null | undefined;
type DefinitelyString = NonNullable<MaybeString>; // string
```

---

## カスタムユーティリティ型

### DeepPartial<T>
**定義**: ネストしたオブジェクトも含めて全プロパティをオプショナルにする

**実装**:
```typescript
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// 使用例
interface NestedConfig {
  database: {
    host: string;
    port: number;
    credentials: {
      username: string;
      password: string;
    };
  };
  cache: {
    enabled: boolean;
    ttl: number;
  };
}

type PartialNestedConfig = DeepPartial<NestedConfig>;
// 全てのプロパティがオプショナルになる
```

### DeepReadonly<T>
**定義**: ネストしたオブジェクトも含めて全プロパティを読み取り専用にする

**実装**:
```typescript
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

// 使用例
type ImmutableNestedConfig = DeepReadonly<NestedConfig>;
// 全てのプロパティがreadonlyになる
```

### Mutable<T>
**定義**: 読み取り専用プロパティを可変にする

**実装**:
```typescript
type Mutable<T> = {
  -readonly [P in keyof T]: T[P];
};

// 使用例
interface ReadonlyUser {
  readonly id: number;
  readonly name: string;
}

type MutableUser = Mutable<ReadonlyUser>;
// { id: number; name: string; }
```

---

## 型レベルプログラミング

### 型レベル関数（Type-Level Functions）
**定義**: 型を引数として受け取り、型を返す操作

**コード例**:
```typescript
// 型レベルでの条件分岐
type If<C extends boolean, T, F> = C extends true ? T : F;

type Result1 = If<true, string, number>; // string
type Result2 = If<false, string, number>; // number

// 型レベルでの配列操作
type Head<T extends readonly any[]> = T extends readonly [infer H, ...any[]] ? H : never;
type Tail<T extends readonly any[]> = T extends readonly [any, ...infer T] ? T : [];

type FirstElement = Head<[1, 2, 3]>; // 1
type RestElements = Tail<[1, 2, 3]>; // [2, 3]
```

### 型レベル演算（Type-Level Arithmetic）
**定義**: 型レベルでの数値演算

**コード例**:
```typescript
// 型レベルでの長さ計算
type Length<T extends readonly any[]> = T['length'];

type ArrayLength = Length<[1, 2, 3, 4]>; // 4

// 型レベルでの加算（簡単な例）
type Add<A extends number, B extends number> = 
  [...Array<A>, ...Array<B>]['length'];

// 実際の使用は制限があるが、概念として理解
```

### 型レベル文字列操作
**定義**: テンプレートリテラル型を使った文字列操作

**コード例**:
```typescript
// 文字列の結合
type Concat<A extends string, B extends string> = `${A}${B}`;

type Result = Concat<"Hello", "World">; // "HelloWorld"

// 文字列の分割
type Split<S extends string, D extends string> = 
  S extends `${infer L}${D}${infer R}` ? [L, ...Split<R, D>] : [S];

type Parts = Split<"a,b,c", ",">; // ["a", "b", "c"]

// ケース変換
type Capitalize<S extends string> = S extends `${infer F}${infer R}` 
  ? `${Uppercase<F>}${R}` 
  : S;

type CapitalizedString = Capitalize<"hello">; // "Hello"
```

### 型レベルパターンマッチング
**定義**: 型の構造に基づく条件分岐

**コード例**:
```typescript
// 関数型の分解
type Parameters<T extends (...args: any) => any> = 
  T extends (...args: infer P) => any ? P : never;

type ReturnType<T extends (...args: any) => any> = 
  T extends (...args: any) => infer R ? R : any;

function example(a: string, b: number): boolean {
  return true;
}

type ExampleParams = Parameters<typeof example>; // [string, number]
type ExampleReturn = ReturnType<typeof example>; // boolean

// Promise型の展開
type Awaited<T> = T extends Promise<infer U> ? Awaited<U> : T;

type PromiseString = Awaited<Promise<string>>; // string
type NestedPromise = Awaited<Promise<Promise<number>>>; // number
```

---

## 📚 実用的なパターン

### APIレスポンス型の生成
```typescript
type ApiResponse<T> = {
  data: T;
  status: number;
  message: string;
};

type PaginatedResponse<T> = ApiResponse<{
  items: T[];
  total: number;
  page: number;
  limit: number;
}>;

type UserListResponse = PaginatedResponse<User>;
```

### フォーム型の生成
```typescript
type FormData<T> = {
  [K in keyof T]: {
    value: T[K];
    error?: string;
    touched: boolean;
  };
};

type UserForm = FormData<Pick<User, 'name' | 'email'>>;
```

### イベント型の生成
```typescript
type EventMap = {
  'user:created': User;
  'user:updated': { id: number; changes: Partial<User> };
  'user:deleted': { id: number };
};

type EventHandler<T extends keyof EventMap> = (data: EventMap[T]) => void;
```

---

## 📚 参考リンク

- [TypeScript Handbook - Utility Types](https://www.typescriptlang.org/docs/handbook/utility-types.html)
- [TypeScript Handbook - Mapped Types](https://www.typescriptlang.org/docs/handbook/mapped-types.html)
- [TypeScript Handbook - Template Literal Types](https://www.typescriptlang.org/docs/handbook/template-literal-types.html)

---

**📌 重要**: ユーティリティ型は TypeScript の型システムの真価を発揮する機能です。これらの概念を理解することで、より表現力豊かで保守性の高いコードを書けるようになります。