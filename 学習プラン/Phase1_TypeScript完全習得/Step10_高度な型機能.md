# Step 10: 高度な型機能

> 💡 **補足資料**: 詳細な解説は以下の補足資料を見てね 🐰
>
> - 📖 [専門用語集](./Step10_補足_専門用語集.md) - 高度な型機能・型レベルプログラミング・パフォーマンス・実用パターンの重要な概念と用語の詳細解説
> - 💻 [実践コード例](./Step10_補足_実践コード例.md) - 段階的な学習用コード集
> - 🚨 [トラブルシューティング](./Step10_補足_トラブルシューティング.md) - よくあるエラーと解決方法
> - 📚 [参考リソース](./Step10_補足_参考リソース.md) - 学習に役立つリンク集

## 📅 学習期間・目標

**期間**: Step 10  
**総学習時間**: 6 時間  
**学習スタイル**: 理論 40% + 実践コード 40% + 演習 20%

### 🎯 Step 10 到達目標

- [ ] 条件付き型と infer の完全理解
- [ ] マップ型の高度な活用
- [ ] テンプレートリテラル型の実践
- [ ] 再帰的型定義の習得
- [ ] 型レベルプログラミングの基礎確立

## 📚 理論学習内容

### Section 1: 条件付き型と infer

#### 🔍 条件付き型の実践的価値

**💡 なぜ高度な型機能が重要なのか**

高度な型機能は、TypeScript の型システムを最大限に活用し、型レベルプログラミングによる表現力豊かなライブラリ設計を可能にします。型レベルプログラミングの価値、実際のライブラリ設計での効果、型安全性と表現力の向上を実現します。特に条件付き型、infer、マップ型、テンプレートリテラル型により、コンパイル時の型計算と推論を活用した高度な型操作が可能になります。

**🎯 どういう場面で使うのか**

- **ライブラリ・フレームワーク設計**: 型安全で表現力豊かな API 設計
- **型レベルプログラミング**: コンパイル時の型計算と推論
- **メタプログラミング**: 型情報を活用した動的な型生成
- **高度な型操作**: 複雑な型変換と型推論が必要な場面
- **API 設計**: 型安全性を極限まで高める設計手法
- **型安全性の極限追求**: 既存ライブラリの型安全性向上

##### 1. 条件付き型による柔軟な型システム構築

```typescript
// 💡 詳細解説: 条件付き型 → Step10_補足_専門用語集.md#条件付き型conditional-types

// 基本的な条件付き型
type IsString<T> = T extends string ? true : false;

type Test1 = IsString<string>; // true
type Test2 = IsString<number>; // false
type Test3 = IsString<"hello">; // true

// 実際のライブラリ設計での活用例
// API レスポンス型の条件付き生成
type ApiResponse<T, TError = never> = T extends never
  ? { success: false; error: TError }
  : { success: true; data: T };

// 使用例
type UserResponse = ApiResponse<User, "USER_NOT_FOUND">;
// { success: true; data: User } | { success: false; error: 'USER_NOT_FOUND' }

type EmptyResponse = ApiResponse<never, "VALIDATION_ERROR">;
// { success: false; error: 'VALIDATION_ERROR' }

// 関数オーバーロードの型安全な実装
type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

type RequestConfig<M extends HttpMethod> = {
  method: M;
  url: string;
  headers?: Record<string, string>;
} & (M extends "GET" | "DELETE" ? { body?: never } : { body: unknown });

// 使用例
const getConfig: RequestConfig<"GET"> = {
  method: "GET",
  url: "/api/users",
  // body: {} // ❌ GET リクエストには body は不要
};

const postConfig: RequestConfig<"POST"> = {
  method: "POST",
  url: "/api/users",
  body: { name: "Alice" }, // ✅ POST リクエストには body が必要
};

// 型安全なイベントハンドラー設計
type EventMap = {
  click: MouseEvent;
  keydown: KeyboardEvent;
  custom: CustomEvent<{ data: string }>;
};

type EventHandler<K extends keyof EventMap> = K extends "custom"
  ? (event: EventMap[K] & { detail: { data: string } }) => void
  : (event: EventMap[K]) => void;

// 使用例
const clickHandler: EventHandler<"click"> = (event) => {
  console.log(event.clientX, event.clientY); // MouseEvent のプロパティ
};

const customHandler: EventHandler<"custom"> = (event) => {
  console.log(event.detail.data); // CustomEvent の detail プロパティ
};

// フォーム型の条件付き生成
type FormField<T> = T extends string
  ? { type: "text"; value: string; placeholder?: string }
  : T extends number
  ? { type: "number"; value: number; min?: number; max?: number }
  : T extends boolean
  ? { type: "checkbox"; checked: boolean; label: string }
  : T extends Date
  ? { type: "date"; value: string; min?: string; max?: string }
  : { type: "unknown"; value: T };

// 使用例
type NameField = FormField<string>;
// { type: 'text'; value: string; placeholder?: string }

type AgeField = FormField<number>;
// { type: 'number'; value: number; min?: number; max?: number }

type ActiveField = FormField<boolean>;
// { type: 'checkbox'; checked: boolean; label: string }
```

##### 2. ネストした条件付き型

```typescript
// 💡 詳細解説: ネストした条件付き型 → Step10_補足_専門用語集.md#ネストした条件付き型nested-conditional-types
type TypeName<T> = T extends string
  ? "string"
  : T extends number
  ? "number"
  : T extends boolean
  ? "boolean"
  : T extends undefined
  ? "undefined"
  : T extends Function
  ? "function"
  : "object";

type Example1 = TypeName<string>; // "string"
type Example2 = TypeName<() => void>; // "function"
type Example3 = TypeName<{}>; // "object"
```

##### 3. 分散条件付き型

```typescript
// 💡 詳細解説: 分散条件付き型 → Step10_補足_専門用語集.md#分散条件付き型distributive-conditional-types
type ToArray<T> = T extends any ? T[] : never;

type StringOrNumberArray = ToArray<string | number>;
// string[] | number[] (分散される)

// 分散を防ぐ場合
// 💡 詳細解説: 分散防止パターン → Step10_補足_専門用語集.md#分散防止パターンnon-distributive-patterns
type ToArrayNonDistributive<T> = [T] extends [any] ? T[] : never;

type Combined = ToArrayNonDistributive<string | number>;
// (string | number)[] (分散されない)
```

##### 4. 実用的な条件付き型

```typescript
type NonNullable<T> = T extends null | undefined ? never : T;
type Flatten<T> = T extends (infer U)[] ? U : T;
type Awaited<T> = T extends Promise<infer U> ? U : T;

// 使用例
type CleanString = NonNullable<string | null | undefined>; // string
type ArrayElement = Flatten<string[]>; // string
type PromiseValue = Awaited<Promise<number>>; // number
```

#### 🎯 infer キーワードの活用

##### 1. 関数の戻り値型とパラメータ型を取得

```typescript
// 💡 詳細解説: infer キーワード → Step10_補足_専門用語集.md#infer-キーワードinfer-keyword
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

function getUserData(): { id: number; name: string } {
  return { id: 1, name: "Alice" };
}

type UserData = ReturnType<typeof getUserData>;
// { id: number; name: string }

// 💡 詳細解説: パラメータ型抽出 → Step10_補足_専門用語集.md#パラメータ型抽出parameter-type-extraction
type Parameters<T> = T extends (...args: infer P) => any ? P : never;

function createUser(name: string, age: number, email: string): void {}

type CreateUserParams = Parameters<typeof createUser>;
// [string, number, string]
```

##### 2. 配列の要素型を取得

```typescript
type ElementType<T> = T extends (infer U)[] ? U : never;
type Head<T> = T extends [infer H, ...any[]] ? H : never;
type Tail<T> = T extends [any, ...infer T] ? T : never;

type Numbers = ElementType<number[]>; // number
type FirstElement = Head<[string, number]>; // string
type RestElements = Tail<[string, number, boolean]>; // [number, boolean]
```

##### 3. オブジェクトのプロパティ型を取得

```typescript
type PropertyType<T, K> = K extends keyof T ? T[K] : never;

interface User {
  id: number;
  name: string;
  email: string;
}

type UserName = PropertyType<User, "name">; // string
type UserId = PropertyType<User, "id">; // number
```

##### 4. 複雑な infer パターン

```typescript
type ExtractArrayType<T> = T extends Promise<infer U>[]
  ? U
  : T extends (infer U)[]
  ? U
  : never;

type PromiseArrayElement = ExtractArrayType<Promise<string>[]>; // string
type RegularArrayElement = ExtractArrayType<number[]>; // number

// 関数のthis型を取得
type ThisType<T> = T extends (this: infer U, ...args: any[]) => any ? U : never;

function greetUser(this: User, message: string): string {
  return `${this.name}: ${message}`;
}

type GreetThisType = ThisType<typeof greetUser>; // User
```

### Section 2: マップ型の高度な活用

#### 🔧 高度なマップ型パターン

##### 1. 基本的なマップ型の復習

```typescript
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};

type Partial<T> = {
  [P in keyof T]?: T[P];
};

// 条件付きマップ型
type NullableProperties<T> = {
  [P in keyof T]: T[P] | null;
};

type RequiredProperties<T> = {
  [P in keyof T]-?: T[P];
};
```

##### 2. キーの変換

```typescript
type PrefixedKeys<T, Prefix extends string> = {
  [P in keyof T as `${Prefix}${string & P}`]: T[P];
};

type SuffixedKeys<T, Suffix extends string> = {
  [P in keyof T as `${string & P}${Suffix}`]: T[P];
};

interface User {
  id: number;
  name: string;
  email: string;
}

type PrefixedUser = PrefixedKeys<User, "user_">;
// { user_id: number; user_name: string; user_email: string; }

type SuffixedUser = SuffixedKeys<User, "_prop">;
// { id_prop: number; name_prop: string; email_prop: string; }
```

##### 3. フィルタリングマップ型

```typescript
type PickByType<T, U> = {
  [P in keyof T as T[P] extends U ? P : never]: T[P];
};

type OmitByType<T, U> = {
  [P in keyof T as T[P] extends U ? never : P]: T[P];
};

interface MixedInterface {
  id: number;
  name: string;
  active: boolean;
  tags: string[];
  count: number;
}

type StringProperties = PickByType<MixedInterface, string>;
// { name: string; }

type NonArrayProperties = OmitByType<MixedInterface, any[]>;
// { id: number; name: string; active: boolean; count: number; }
```

##### 4. 深い変換と関数型の変換

```typescript
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

interface NestedUser {
  id: number;
  profile: {
    name: string;
    settings: {
      theme: string;
      notifications: boolean;
    };
  };
}

type ReadonlyNestedUser = DeepReadonly<NestedUser>;
// 全てのプロパティがreadonlyになる

type FunctionPropertyNames<T> = {
  [K in keyof T]: T[K] extends Function ? K : never;
}[keyof T];

type FunctionProperties<T> = Pick<T, FunctionPropertyNames<T>>;

type NonFunctionPropertyNames<T> = {
  [K in keyof T]: T[K] extends Function ? never : K;
}[keyof T];

type NonFunctionProperties<T> = Pick<T, NonFunctionPropertyNames<T>>;

interface UserService {
  id: number;
  name: string;
  getUser(): User;
  updateUser(user: User): void;
  deleteUser(id: number): boolean;
}

type ServiceMethods = FunctionProperties<UserService>;
// { getUser(): User; updateUser(user: User): void; deleteUser(id: number): boolean; }

type ServiceData = NonFunctionProperties<UserService>;
// { id: number; name: string; }
```

### Section 3: テンプレートリテラル型と再帰的型

#### 🔧 テンプレートリテラル型の実践

##### 1. 基本的なテンプレートリテラル型と文字列操作

```typescript
// 基本的なテンプレートリテラル型
type Greeting<T extends string> = `Hello, ${T}!`;
type PersonalGreeting = Greeting<"Alice">; // "Hello, Alice!"

// 文字列操作ユーティリティ
type Uppercase<S extends string> = Intrinsic;
type Lowercase<S extends string> = Intrinsic;
type Capitalize<S extends string> = Intrinsic;
type Uncapitalize<S extends string> = Intrinsic;

type UpperName = Uppercase<"alice">; // "ALICE"
type LowerName = Lowercase<"ALICE">; // "alice"
type CapitalName = Capitalize<"alice">; // "Alice"
type UncapitalName = Uncapitalize<"Alice">; // "alice"
```

##### 2. イベント名と API エンドポイントの生成

```typescript
// イベント名の生成
type EventName<T extends string> = `on${Capitalize<T>}`;
type EventHandler<T extends string> = `handle${Capitalize<T>}`;

type ClickEvent = EventName<"click">; // "onClick"
type ClickHandler = EventHandler<"click">; // "handleClick"

// API エンドポイントの型生成
type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";
type ApiEndpoint<
  Method extends HttpMethod,
  Path extends string
> = `${Method} ${Path}`;

type UserEndpoints =
  | ApiEndpoint<"GET", "/users">
  | ApiEndpoint<"POST", "/users">
  | ApiEndpoint<"PUT", "/users/:id">
  | ApiEndpoint<"DELETE", "/users/:id">;
```

##### 3. CSS プロパティとパスの型安全性

```typescript
// CSS プロパティの型生成
type CSSProperty<
  Property extends string,
  Value extends string | number
> = `${Property}: ${Value}`;

type ColorProperty = CSSProperty<"color", "red" | "blue" | "green">;
// "color: red" | "color: blue" | "color: green"

// パスの型安全性
type Join<T extends string[], Separator extends string = "/"> = T extends [
  infer First,
  ...infer Rest
]
  ? First extends string
    ? Rest extends string[]
      ? Rest["length"] extends 0
        ? First
        : `${First}${Separator}${Join<Rest, Separator>}`
      : never
    : never
  : "";

type ApiPath = Join<["api", "v1", "users", "profile"]>; // "api/v1/users/profile"

// 文字列の分割
type Split<
  S extends string,
  Delimiter extends string
> = S extends `${infer Head}${Delimiter}${infer Tail}`
  ? [Head, ...Split<Tail, Delimiter>]
  : [S];

type PathSegments = Split<"api/v1/users", "/">; // ["api", "v1", "users"]
```

#### 🎯 再帰的型定義の実践

##### 1. 配列の長さと要素操作

```typescript
// 配列の長さを型レベルで計算
type Length<T extends readonly any[]> = T["length"];

type ArrayLength = Length<[1, 2, 3, 4]>; // 4

// 配列の要素を型レベルで操作
type Head<T extends readonly any[]> = T extends readonly [infer H, ...any[]]
  ? H
  : never;
type Tail<T extends readonly any[]> = T extends readonly [any, ...infer T]
  ? T
  : never;

type FirstElement = Head<[1, 2, 3]>; // 1
type RestElements = Tail<[1, 2, 3]>; // [2, 3]
```

##### 2. 配列の反転と型レベル計算

```typescript
// 配列の反転
type Reverse<T extends readonly any[]> = T extends readonly [
  ...infer Rest,
  infer Last
]
  ? [Last, ...Reverse<Rest>]
  : [];

type ReversedArray = Reverse<[1, 2, 3, 4]>; // [4, 3, 2, 1]

// 型レベルでの数値計算（制限あり）
type Add<A extends number, B extends number> = [
  ...Array<A>,
  ...Array<B>
]["length"] extends number
  ? [...Array<A>, ...Array<B>]["length"]
  : never;

type Sum = Add<2, 3>; // 5 (小さな数値のみ)

// 5. オブジェクトのパス型
type Paths<T> = T extends object
  ? {
      [K in keyof T]: K extends string
        ? T[K] extends object
          ? K | `${K}.${Paths<T[K]>}`
          : K
        : never;
    }[keyof T]
  : never;

interface NestedObject {
  user: {
    profile: {
      name: string;
      settings: {
        theme: string;
      };
    };
    id: number;
  };
  config: {
    api: string;
  };
}

type ObjectPaths = Paths<NestedObject>;
// "user" | "config" | "user.profile" | "user.id" | "user.profile.name" |
// "user.profile.settings" | "user.profile.settings.theme" | "config.api"

// 6. 型安全なget関数
type GetByPath<T, P extends string> = P extends keyof T
  ? T[P]
  : P extends `${infer K}.${infer Rest}`
  ? K extends keyof T
    ? GetByPath<T[K], Rest>
    : never
  : never;

function get<T, P extends Paths<T>>(obj: T, path: P): GetByPath<T, P> {
  const keys = path.split(".");
  let result: any = obj;

  for (const key of keys) {
    result = result[key];
  }

  return result;
}

// 使用例
const nestedObj: NestedObject = {
  user: {
    profile: {
      name: "Alice",
      settings: {
        theme: "dark",
      },
    },
    id: 1,
  },
  config: {
    api: "https://api.example.com",
  },
};

const userName = get(nestedObj, "user.profile.name"); // string型
const theme = get(nestedObj, "user.profile.settings.theme"); // string型

// 7. 型レベルでのJSON解析
type ParseJSON<T extends string> = T extends `{${infer Content}}`
  ? ParseObject<Content>
  : T extends `[${infer Content}]`
  ? ParseArray<Content>
  : T extends `"${infer Content}"`
  ? Content
  : T extends "true"
  ? true
  : T extends "false"
  ? false
  : T extends "null"
  ? null
  : T extends `${number}`
  ? number
  : never;

type ParseObject<T extends string> = {
  // 簡略化された実装
  [K in string]: any;
};

type ParseArray<T extends string> = any[];

// 使用例（概念的）
type JSONResult = ParseJSON<'{"name": "Alice", "age": 30}'>;
```

## 📊 Step 10 評価基準

### 理解度チェックリスト

#### 条件付き型・infer (35%)

- [ ] 条件付き型の基本構文を理解している
- [ ] infer キーワードを適切に使用できる
- [ ] 分散条件付き型を理解している
- [ ] 複雑な型推論を実装できる

#### マップ型 (30%)

- [ ] 高度なマップ型パターンを実装できる
- [ ] キー変換を適切に行える
- [ ] フィルタリングマップ型を作成できる
- [ ] 深い変換を実装できる

#### テンプレートリテラル型 (20%)

- [ ] テンプレートリテラル型の基本を理解している
- [ ] 文字列操作ユーティリティを活用できる
- [ ] 実用的な文字列型を生成できる
- [ ] 型安全な文字列処理を実装できる

#### 再帰的型定義 (15%)

- [ ] 再帰的型定義の概念を理解している
- [ ] 型レベルでの計算を実装できる
- [ ] 複雑なデータ構造を型で表現できる
- [ ] 実用的な再帰型を設計できる

### 成果物チェックリスト

- [ ] **高度な型ライブラリ**: 条件付き型・infer 活用
- [ ] **型変換システム**: マップ型の実践活用
- [ ] **文字列型システム**: テンプレートリテラル型活用
- [ ] **型レベル計算**: 再帰的型定義の実装

## 🔄 Step 11 への準備

### 次週学習内容の予習

```typescript
// Step 11で学習するツール開発の基礎概念
// 以下のコードを読んで理解しておくこと

// 1. ESLint ルールの基本
module.exports = {
  rules: {
    "custom-rule": "error",
  },
};

// 2. TypeScript Compiler API
import * as ts from "typescript";

// 3. AST操作の基本
function visitNode(node: ts.Node): ts.Node {
  return ts.visitEachChild(node, visitNode, undefined);
}
```

---

**📌 重要**: Step 10 は TypeScript の型システムの最も高度な機能を学習する重要な週です。これらの技術により、型レベルでの複雑な操作が可能になり、極めて安全で表現力豊かなコードが書けるようになります。

**🌟 次週は、TypeScript ツール開発の入門について学習します！**
