# Phase 1: Week 5-6 上級理論学習プラン

## 📚 Week 5-6: 上級 TypeScript 理論学習コンテンツ

### 6. 条件付き型・マップ型理論.md

#### 🎯 学習目標

- 条件付き型の設計パターンを完全理解する
- マップ型による型変換を自在に操る
- 再帰的型定義の理論と実践を身につける
- 型レベルプログラミングの基礎を確立する
- パフォーマンス考慮事項を理解する

#### 📚 理論基礎

**条件付き型（Conditional Types）の概念**

```typescript
// 基本構文: T extends U ? X : Y
type IsString<T> = T extends string ? true : false;

type Test1 = IsString<string>; // true
type Test2 = IsString<number>; // false
type Test3 = IsString<"hello">; // true
```

**マップ型（Mapped Types）の概念**

```typescript
// 基本構文: { [K in keyof T]: T[K] }
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};

type Optional<T> = {
  [P in keyof T]?: T[P];
};
```

#### 🔍 詳細解説

**パターン 1: 条件付き型の高度な活用**

```typescript
// 1. 分散条件付き型（Distributive Conditional Types）
type ToArray<T> = T extends any ? T[] : never;

type StringOrNumberArray = ToArray<string | number>;
// string[] | number[] (分散される)

// 分散を防ぐ方法
type ToArrayNonDistributive<T> = [T] extends [any] ? T[] : never;

type StringOrNumberArrayNonDist = ToArrayNonDistributive<string | number>;
// (string | number)[] (分散されない)

// 2. infer キーワードの活用
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : any;

type FunctionReturnType = ReturnType<() => string>; // string
type ArrayElementType<T> = T extends (infer U)[] ? U : never;

type ElementType = ArrayElementType<string[]>; // string

// 3. 複雑な条件分岐
type DeepReadonly<T> = T extends any[]
  ? DeepReadonlyArray<T[number]>
  : T extends object
  ? DeepReadonlyObject<T>
  : T;

type DeepReadonlyArray<T> = ReadonlyArray<DeepReadonly<T>>;

type DeepReadonlyObject<T> = {
  readonly [P in keyof T]: DeepReadonly<T[P]>;
};

// 使用例
interface User {
  name: string;
  hobbies: string[];
  address: {
    street: string;
    city: string;
  };
}

type ReadonlyUser = DeepReadonly<User>;
// {
//     readonly name: string;
//     readonly hobbies: ReadonlyArray<string>;
//     readonly address: {
//         readonly street: string;
//         readonly city: string;
//     };
// }
```

**パターン 2: マップ型の高度なパターン**

```typescript
// 1. キー再マッピング（Key Remapping）
type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
};

type Setters<T> = {
  [K in keyof T as `set${Capitalize<string & K>}`]: (value: T[K]) => void;
};

interface Person {
  name: string;
  age: number;
}

type PersonGetters = Getters<Person>;
// {
//     getName: () => string;
//     getAge: () => number;
// }

type PersonSetters = Setters<Person>;
// {
//     setName: (value: string) => void;
//     setAge: (value: number) => void;
// }

// 2. 条件付きキー選択
type PickByType<T, U> = {
  [K in keyof T as T[K] extends U ? K : never]: T[K];
};

type OmitByType<T, U> = {
  [K in keyof T as T[K] extends U ? never : K]: T[K];
};

interface Mixed {
  name: string;
  age: number;
  isActive: boolean;
  tags: string[];
  count: number;
}

type StringProperties = PickByType<Mixed, string>;
// { name: string; }

type NonStringProperties = OmitByType<Mixed, string>;
// { age: number; isActive: boolean; tags: string[]; count: number; }

// 3. 複雑な型変換
type CamelToSnake<S extends string> = S extends `${infer T}${infer U}`
  ? `${T extends Capitalize<T> ? "_" : ""}${Lowercase<T>}${CamelToSnake<U>}`
  : S;

type SnakeCaseKeys<T> = {
  [K in keyof T as CamelToSnake<string & K>]: T[K];
};

interface CamelCaseObject {
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

type SnakeCaseObject = SnakeCaseKeys<CamelCaseObject>;
// {
//     first_name: string;
//     last_name: string;
//     phone_number: string;
// }
```

**パターン 3: 再帰的型定義**

```typescript
// 1. JSON型の定義
type JSONValue = string | number | boolean | null | JSONObject | JSONArray;

interface JSONObject {
  [key: string]: JSONValue;
}

interface JSONArray extends Array<JSONValue> {}

// 2. 深いオブジェクトのパス型
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
        notifications: boolean;
      };
    };
    posts: Array<{
      title: string;
      content: string;
    }>;
  };
  config: {
    apiUrl: string;
  };
}

type ObjectPaths = Paths<NestedObject>;
// "user" | "config" | "user.profile" | "user.posts" | "config.apiUrl" |
// "user.profile.name" | "user.profile.settings" | "user.profile.settings.theme" |
// "user.profile.settings.notifications"

// 3. 型レベルでの計算
type Length<T extends readonly any[]> = T["length"];

type Head<T extends readonly any[]> = T extends readonly [infer H, ...any[]]
  ? H
  : never;

type Tail<T extends readonly any[]> = T extends readonly [any, ...infer Rest]
  ? Rest
  : [];

type Reverse<T extends readonly any[]> = T extends readonly [
  ...infer Rest,
  infer Last
]
  ? [Last, ...Reverse<Rest>]
  : [];

// 使用例
type Numbers = [1, 2, 3, 4, 5];
type NumbersLength = Length<Numbers>; // 5
type FirstNumber = Head<Numbers>; // 1
type RestNumbers = Tail<Numbers>; // [2, 3, 4, 5]
type ReversedNumbers = Reverse<Numbers>; // [5, 4, 3, 2, 1]
```

#### ⚠️ パフォーマンス考慮事項

**型計算の複雑度管理**

```typescript
// 悪い例: 深すぎる再帰
type BadDeepType<T, Depth extends number = 0> = Depth extends 50
  ? never // 制限なしだとコンパイラがクラッシュ
  : T extends object
  ? {
      [K in keyof T]: BadDeepType<T[K], [...Array<Depth>, any]["length"]>;
    }
  : T;

// 良い例: 適切な深度制限
type GoodDeepType<T, Depth extends number = 0> = Depth extends 5
  ? T // 適切な制限
  : T extends object
  ? {
      [K in keyof T]: GoodDeepType<T[K], [...Array<Depth>, any]["length"]>;
    }
  : T;

// 型計算の最適化
type OptimizedPick<T, K extends keyof T> = {
  [P in K]: T[P];
}; // シンプルで高速

type SlowPick<T, K extends keyof T> = {
  [P in keyof T]: P extends K ? T[P] : never;
}[keyof T]; // 複雑で低速
```

**メモ化による最適化**

```typescript
// 型レベルメモ化の概念
interface TypeCache {
  [key: string]: any;
}

type Memoized<T, Cache extends TypeCache = {}> = T extends keyof Cache
  ? Cache[T]
  : ComputeExpensiveType<T>;

type ComputeExpensiveType<T> = /* 重い計算 */ T;
```

### 7. テンプレートリテラル型活用.md

#### 🎯 学習目標

- テンプレートリテラル型の構文を完全理解する
- 文字列操作の型レベル実装を身につける
- パターンマッチング手法を活用する
- 実用的な応用例を実装できる

#### 📚 理論基礎

**テンプレートリテラル型の基本構文**

```typescript
// 基本的なテンプレートリテラル型
type Greeting = `Hello, ${string}!`;

let greeting1: Greeting = "Hello, World!"; // OK
let greeting2: Greeting = "Hello, TypeScript!"; // OK
// let greeting3: Greeting = "Hi, World!"; // Error

// 型パラメータとの組み合わせ
type EventName<T extends string> = `on${Capitalize<T>}`;

type ClickEvent = EventName<"click">; // "onClick"
type HoverEvent = EventName<"hover">; // "onHover"
```

#### 🔍 詳細解説

**パターン 1: 文字列操作の型レベル実装**

```typescript
// 1. 文字列変換ユーティリティ
type Uppercase<S extends string> = Intrinsic; // 組み込み
type Lowercase<S extends string> = Intrinsic; // 組み込み
type Capitalize<S extends string> = Intrinsic; // 組み込み
type Uncapitalize<S extends string> = Intrinsic; // 組み込み

// カスタム文字列操作
type TrimLeft<S extends string> = S extends ` ${infer Rest}`
  ? TrimLeft<Rest>
  : S;
type TrimRight<S extends string> = S extends `${infer Rest} `
  ? TrimRight<Rest>
  : S;
type Trim<S extends string> = TrimLeft<TrimRight<S>>;

type Split<
  S extends string,
  D extends string
> = S extends `${infer T}${D}${infer U}` ? [T, ...Split<U, D>] : [S];

type Join<T extends readonly string[], D extends string> = T extends readonly [
  infer F,
  ...infer R
]
  ? F extends string
    ? R extends readonly string[]
      ? R["length"] extends 0
        ? F
        : `${F}${D}${Join<R, D>}`
      : never
    : never
  : "";

// 使用例
type Trimmed = Trim<"  hello world  ">; // "hello world"
type SplitResult = Split<"a,b,c", ",">; // ["a", "b", "c"]
type JoinResult = Join<["a", "b", "c"], "-">; // "a-b-c"

// 2. パスの操作
type PathSegments<T extends string> = Split<T, "/">;
type JoinPath<T extends readonly string[]> = Join<T, "/">;

type GetFileName<T extends string> = T extends `${string}/${infer Rest}`
  ? GetFileName<Rest>
  : T;

type GetDirectory<T extends string> = T extends `${infer Dir}/${string}`
  ? Dir
  : "";

type FilePath = "/home/user/documents/file.txt";
type FileName = GetFileName<FilePath>; // "file.txt"
type Directory = GetDirectory<FilePath>; // "/home/user/documents"
```

**パターン 2: API 型安全性の向上**

```typescript
// 1. REST API エンドポイント型
type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

type Endpoint<
  Method extends HttpMethod,
  Path extends string
> = `${Method} ${Path}`;

type UserEndpoints =
  | Endpoint<"GET", "/users">
  | Endpoint<"GET", "/users/${string}">
  | Endpoint<"POST", "/users">
  | Endpoint<"PUT", "/users/${string}">
  | Endpoint<"DELETE", "/users/${string}">;

// 2. SQL クエリビルダー型
type SelectQuery<
  Table extends string,
  Columns extends string = "*"
> = `SELECT ${Columns} FROM ${Table}`;

type WhereClause<Condition extends string> = ` WHERE ${Condition}`;

type OrderByClause<
  Column extends string,
  Direction extends "ASC" | "DESC" = "ASC"
> = ` ORDER BY ${Column} ${Direction}`;

type BuildQuery<
  Base extends string,
  Where extends string = "",
  OrderBy extends string = ""
> = `${Base}${Where}${OrderBy}`;

// 使用例
type UserQuery = BuildQuery<
  SelectQuery<"users", "id, name, email">,
  WhereClause<"active = 1">,
  OrderByClause<"created_at", "DESC">
>;
// "SELECT id, name, email FROM users WHERE active = 1 ORDER BY created_at DESC"

// 3. CSS-in-JS 型安全性
type CSSUnit = "px" | "rem" | "em" | "%" | "vh" | "vw" | "pt" | "pc";
type CSSValue<T extends CSSUnit> = `${number}${T}`;

type CSSProperty =
  | "width"
  | "height"
  | "margin"
  | "padding"
  | "font-size"
  | "line-height"
  | "border-radius";

type CSSRule<
  Property extends CSSProperty,
  Value extends string
> = `${Property}: ${Value};`;

type CSSDeclaration = {
  [K in CSSProperty]?: K extends "width" | "height" | "margin" | "padding"
    ? CSSValue<"px" | "rem" | "%">
    : K extends "font-size"
    ? CSSValue<"px" | "rem" | "em">
    : string;
};

// 使用例
const styles: CSSDeclaration = {
  width: "100px",
  height: "50rem",
  margin: "10%",
  "font-size": "16px",
};
```

**パターン 3: 型安全なイベントシステム**

```typescript
// 1. DOM イベント型
type DOMEventMap = {
  click: MouseEvent;
  keydown: KeyboardEvent;
  change: Event;
  submit: SubmitEvent;
  load: Event;
};

type EventListener<K extends keyof DOMEventMap> = (
  event: DOMEventMap[K]
) => void;

type AddEventListener = <K extends keyof DOMEventMap>(
  type: K,
  listener: EventListener<K>
) => void;

// 2. カスタムイベントシステム
type CustomEventMap = {
  "user:login": { userId: string; timestamp: Date };
  "user:logout": { userId: string };
  "data:update": { table: string; id: string; changes: Record<string, any> };
  "notification:show": { message: string; type: "info" | "warning" | "error" };
};

type EventEmitter = {
  on<K extends keyof CustomEventMap>(
    event: K,
    listener: (data: CustomEventMap[K]) => void
  ): void;

  emit<K extends keyof CustomEventMap>(event: K, data: CustomEventMap[K]): void;

  off<K extends keyof CustomEventMap>(
    event: K,
    listener: (data: CustomEventMap[K]) => void
  ): void;
};

// 3. 型安全なルーティング
type RouteParams<T extends string> =
  T extends `${string}:${infer Param}/${infer Rest}`
    ? { [K in Param]: string } & RouteParams<Rest>
    : T extends `${string}:${infer Param}`
    ? { [K in Param]: string }
    : {};

type ExtractRouteParams<T extends string> = RouteParams<T>;

// 使用例
type UserRouteParams = ExtractRouteParams<"/users/:userId/posts/:postId">;
// { userId: string; postId: string }

type ProductRouteParams = ExtractRouteParams<"/products/:productId">;
// { productId: string }

interface Router {
  get<T extends string>(
    path: T,
    handler: (params: ExtractRouteParams<T>) => void
  ): void;
}

declare const router: Router;

router.get("/users/:userId/posts/:postId", (params) => {
  // params は { userId: string; postId: string } として型推論される
  console.log(params.userId, params.postId);
});
```

#### ⚠️ 注意点・ベストプラクティス

**パフォーマンス考慮事項**

```typescript
// 悪い例: 過度に複雑な文字列操作
type BadComplexString<T extends string> =
  T extends `${infer A}${infer B}${infer C}${infer D}${infer E}${infer Rest}`
    ? `${Uppercase<A>}${Lowercase<B>}${Uppercase<C>}${Lowercase<D>}${Uppercase<E>}${BadComplexString<Rest>}`
    : T;

// 良い例: シンプルで効率的な操作
type GoodSimpleString<T extends string> =
  T extends `${infer First}${infer Rest}`
    ? `${Uppercase<First>}${Lowercase<Rest>}`
    : T;
```

**実用性の確保**

```typescript
// 実用的な例: フォームバリデーション
type ValidationRule = "required" | "email" | "min:number" | "max:number";

type ParseValidationRule<T extends string> = T extends "required"
  ? { required: true }
  : T extends "email"
  ? { email: true }
  : T extends `min:${infer N}`
  ? { min: N extends `${number}` ? number : never }
  : T extends `max:${infer N}`
  ? { max: N extends `${number}` ? number : never }
  : never;

type FormValidation<T extends Record<string, ValidationRule[]>> = {
  [K in keyof T]: {
    [R in T[K][number]]: ParseValidationRule<R>;
  }[T[K][number]];
};

// 使用例
type UserFormRules = {
  name: ["required"];
  email: ["required", "email"];
  age: ["required", "min:18", "max:120"];
};

type UserFormValidation = FormValidation<UserFormRules>;
// {
//     name: { required: true };
//     email: { required: true } & { email: true };
//     age: { required: true } & { min: number } & { max: number };
// }
```

## 🛠️ 実践準備・統合演習

### Week 5-6 統合課題

```typescript
// 課題1: 高度な型操作システムの実装
// 以下の要件を満たす型システムを実装せよ

// 1. データベーススキーマ型
interface DatabaseSchema {
    users: {
        id: number;
        name: string;
        email: string;
        created_at: Date;
        profile?: {
            bio: string;
            avatar: string;
        };
    };
    posts: {
        id: number;
        title: string;
        content: string;
        author_id: number;
        published: boolean;
        created_at: Date;
    };
    comments: {
        id: number;
        post_id: number;
        author_id: number;
        content: string;
        created_at: Date;
    };
}

// 2. クエリビルダー型の実装
type SelectColumns<T, K extends keyof T = keyof T> = /* 実装 */;
type WhereCondition<T> = /* 実装 */;
type JoinClause<T, U> = /* 実装 */;

// 3. 型安全なクエリインターフェース
interface QueryBuilder<Schema> {
    select<Table extends keyof Schema, Columns extends keyof Schema[Table]>(
        table: Table,
        columns: Columns[]
    ): SelectQuery<Schema, Table, Columns>;

    where<Condition>(
        condition: WhereCondition<Condition>
    ): this;

    join<JoinTable extends keyof Schema>(
        table: JoinTable,
        on: JoinClause<Schema[Table], Schema[JoinTable]>
    ): this;
}

// 課題2: 型レベルパーサーの実装
// JSON パスを解析して型安全なアクセサを生成する

type JSONPath = string; // "user.profile.name" のような形式

type ParseJSONPath<T, Path extends string> = /* 実装 */;

type GetValueByPath<T, Path extends string> = /* 実装 */;

type SetValueByPath<T, Path extends string, Value> = /* 実装 */;

// 使用例
interface AppState {
    user: {
        profile: {
            name: string;
            settings: {
                theme: "light" | "dark";
                notifications: boolean;
            };
        };
    };
    posts: Array<{
        id: number;
        title: string;
    }>;
}

type UserName = GetValueByPath<AppState, "user.profile.name">; // string
type Theme = GetValueByPath<AppState, "user.profile.settings.theme">; // "light" | "dark"

// 課題3: 型安全なイベントシステム
// テンプレートリテラル型を使用してイベント名を生成し、
// 型安全なイベントエミッターを実装せよ

type EventPattern = `${string}:${string}`;

type ParseEventName<T extends EventPattern> = /* 実装 */;

interface TypeSafeEventEmitter<Events extends Record<EventPattern, any>> {
    on<K extends keyof Events>(
        event: K,
        listener: (data: Events[K]) => void
    ): void;

    emit<K extends keyof Events>(
        event: K,
        data: Events[K]
    ): void;

    off<K extends keyof Events>(
        event: K,
        listener: (data: Events[K]) => void
    ): void;
}
```

### 理解度確認テスト

```typescript
// テスト1: 以下の型の動作を予測せよ
type Mystery1<T> = T extends `${infer A}${infer B}`
    ? B extends ""
        ? A
        : Mystery1<B>
    : never;

type Result1 = Mystery1<"hello">; // ?

// テスト2: 以下の型エラーの原因を特定し修正せよ
type Broken<T extends Record<string, any>> = {
    [K in keyof T as `get${K}`]: () => T[K]; // Error
};

// テスト3: パフォーマンスを考慮して以下の型を最適化せよ
type Slow<T> = T extends object
    ? { [K in keyof T]: Slow<T[K]> }
    : T;

// より効率的な実装を提案せよ
type Fast<T> = /* 実装 */;
```

## 📖 参考資料・次週への準備

### 推奨学習リソース

- [Template Literal Types - TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html)
- [Mapped Types - TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/2/mapped-types.html)
- [Conditional Types - TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html)

### Week 7-8 予習内容

- TypeScript Compiler API の基礎
- AST（抽象構文木）の概念
- コード変換の理論
- ESLint ルール作成の準備

### 実践プロジェクト準備

Week 7-8 で取り組む「型安全なライブラリ設計」プロジェクトの準備として、以下を検討しておく：

1. 作成したいライブラリのドメイン選択
2. 型安全性の要件定義
3. API 設計の方針
4. パフォーマンス目標の設定
