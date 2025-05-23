# Phase 1: Week 5-6 上級 TypeScript - 型レベルプログラミング・テンプレートリテラル型

## 📅 学習期間・目標

**期間**: Week 5-6（2 週間）  
**総学習時間**: 40 時間（週 20 時間）

### 🎯 Week 5-6 到達目標

- [ ] テンプレートリテラル型の完全習得
- [ ] 型レベルプログラミングの実践
- [ ] 再帰的型定義の高度な活用
- [ ] 型パズル解決能力の向上
- [ ] TypeScript 5.x 新機能の理解

## 📖 理論学習内容

### Day 29-32: テンプレートリテラル型の活用

#### 基本的なテンプレートリテラル型

```typescript
// 1. 基本的な文字列テンプレート
type Greeting<T extends string> = `Hello, ${T}!`;
type WelcomeMessage = Greeting<"World">; // "Hello, World!"

// 2. 文字列操作ユーティリティ
type Uppercase<S extends string> = intrinsic;
type Lowercase<S extends string> = intrinsic;
type Capitalize<S extends string> = intrinsic;
type Uncapitalize<S extends string> = intrinsic;

type UpperHello = Uppercase<"hello">; // "HELLO"
type LowerHello = Lowercase<"HELLO">; // "hello"
type CapitalHello = Capitalize<"hello">; // "Hello"
type UncapitalHello = Uncapitalize<"Hello">; // "hello"

// 3. イベントハンドラー型の生成
type EventName<T extends string> = `on${Capitalize<T>}`;
type MouseEvents = "click" | "hover" | "focus" | "blur";
type MouseEventHandlers = EventName<MouseEvents>;
// "onClick" | "onHover" | "onFocus" | "onBlur"

// 4. CSS プロパティ型の生成
type CSSProperty = `--${string}`;
type ThemeProperty = `theme-${string}`;
type ColorProperty = `color-${string}`;

// 使用例
interface CSSVariables {
  "--primary-color": string;
  "--secondary-color": string;
  "--font-size": string;
}

// 5. パス型の生成
type ApiPath<T extends string> = `/api/${T}`;
type UserPaths = ApiPath<"users" | "posts" | "comments">;
// "/api/users" | "/api/posts" | "/api/comments"
```

#### 高度なテンプレートリテラル型

```typescript
// 6. 文字列の分割と結合
type Split<
  S extends string,
  D extends string
> = S extends `${infer T}${D}${infer U}` ? [T, ...Split<U, D>] : [S];

type SplitPath = Split<"user/profile/settings", "/">;
// ["user", "profile", "settings"]

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

type JoinedPath = Join<["user", "profile", "settings"], "/">;
// "user/profile/settings"

// 7. CamelCase 変換
type CamelCase<S extends string> =
  S extends `${infer P1}_${infer P2}${infer P3}`
    ? `${P1}${Capitalize<CamelCase<`${P2}${P3}`>>}`
    : S;

type CamelCased = CamelCase<"hello_world_example">;
// "helloWorldExample"

// 8. KebabCase 変換
type KebabCase<S extends string> = S extends `${infer T}${infer U}`
  ? `${T extends Capitalize<T> ? "-" : ""}${Lowercase<T>}${KebabCase<U>}`
  : S;

type KebabCased = KebabCase<"HelloWorldExample">;
// "hello-world-example"

// 9. SQL クエリビルダー型
type SelectClause<T extends string> = `SELECT ${T}`;
type FromClause<T extends string> = `FROM ${T}`;
type WhereClause<T extends string> = `WHERE ${T}`;

type SQLQuery<
  S extends string,
  F extends string,
  W extends string = ""
> = W extends ""
  ? `${SelectClause<S>} ${FromClause<F>}`
  : `${SelectClause<S>} ${FromClause<F>} ${WhereClause<W>}`;

type UserQuery = SQLQuery<"name, email", "users", "active = 1">;
// "SELECT name, email FROM users WHERE active = 1"
```

### Day 33-35: 型レベルプログラミングパターン

#### 再帰的型定義

```typescript
// 1. 配列の長さ計算
type Length<T extends readonly any[]> = T["length"];

type ArrayLength = Length<[1, 2, 3, 4, 5]>; // 5

// 2. 配列の逆順
type Reverse<T extends readonly any[]> = T extends readonly [
  ...infer Rest,
  infer Last
]
  ? [Last, ...Reverse<Rest>]
  : [];

type ReversedArray = Reverse<[1, 2, 3, 4, 5]>; // [5, 4, 3, 2, 1]

// 3. 配列の先頭要素取得
type Head<T extends readonly any[]> = T extends readonly [infer H, ...any[]]
  ? H
  : never;

type FirstElement = Head<[1, 2, 3]>; // 1

// 4. 配列の末尾要素取得
type Tail<T extends readonly any[]> = T extends readonly [...any[], infer L]
  ? L
  : never;

type LastElement = Tail<[1, 2, 3]>; // 3

// 5. 配列の結合
type Concat<T extends readonly any[], U extends readonly any[]> = [...T, ...U];

type ConcatenatedArray = Concat<[1, 2], [3, 4]>; // [1, 2, 3, 4]

// 6. 配列のフラット化
type Flatten<T extends readonly any[]> = T extends readonly [
  infer First,
  ...infer Rest
]
  ? First extends readonly any[]
    ? [...Flatten<First>, ...Flatten<Rest>]
    : [First, ...Flatten<Rest>]
  : [];

type FlattenedArray = Flatten<[[1, 2], [3, [4, 5]], 6]>; // [1, 2, 3, 4, 5, 6]
```

#### 数値計算の型実装

```typescript
// 7. Tuple を使った数値表現
type Tuple<
  N extends number,
  Result extends any[] = []
> = Result["length"] extends N ? Result : Tuple<N, [...Result, any]>;

// 8. 加算
type Add<A extends number, B extends number> = Length<
  [...Tuple<A>, ...Tuple<B>]
>;

type Sum = Add<3, 4>; // 7

// 9. 減算
type Subtract<A extends number, B extends number> = Tuple<A> extends [
  ...Tuple<B>,
  ...infer Rest
]
  ? Rest["length"]
  : never;

type Difference = Subtract<7, 3>; // 4

// 10. 比較
type GreaterThan<A extends number, B extends number> = Subtract<
  A,
  B
> extends never
  ? false
  : true;

type IsGreater = GreaterThan<5, 3>; // true

// 11. Fibonacci 数列
type Fibonacci<
  N extends number,
  Prev extends number = 0,
  Curr extends number = 1,
  Count extends any[] = []
> = Count["length"] extends N
  ? Prev
  : Fibonacci<N, Curr, Add<Prev, Curr>, [...Count, any]>;

type Fib10 = Fibonacci<10>; // 55
```

#### 高度な型パズル

```typescript
// 12. 型レベルソート（バブルソート）
type BubbleSort<T extends readonly number[]> = T extends readonly [
  infer First,
  infer Second,
  ...infer Rest
]
  ? First extends number
    ? Second extends number
      ? Rest extends readonly number[]
        ? GreaterThan<First, Second> extends true
          ? BubbleSort<[Second, First, ...Rest]>
          : [First, ...BubbleSort<[Second, ...Rest]>]
        : T
      : T
    : T
  : T;

type SortedArray = BubbleSort<[3, 1, 4, 1, 5, 9, 2, 6]>; // [1, 1, 2, 3, 4, 5, 6, 9]

// 13. 型レベル文字列検索
type Includes<
  T extends string,
  U extends string
> = T extends `${string}${U}${string}` ? true : false;

type HasHello = Includes<"Hello World", "Hello">; // true

// 14. 型レベル置換
type Replace<
  S extends string,
  From extends string,
  To extends string
> = S extends `${infer Prefix}${From}${infer Suffix}`
  ? `${Prefix}${To}${Suffix}`
  : S;

type Replaced = Replace<"Hello World", "World", "TypeScript">; // "Hello TypeScript"

// 15. 型レベル正規表現（簡易版）
type IsEmail<T extends string> = T extends `${string}@${string}.${string}`
  ? true
  : false;

type ValidEmail = IsEmail<"user@example.com">; // true
type InvalidEmail = IsEmail<"invalid-email">; // false
```

### Day 36-42: TypeScript 5.x 新機能と実践

#### const assertions と satisfies

```typescript
// 1. const assertions の活用
const colors = ["red", "green", "blue"] as const;
type Color = (typeof colors)[number]; // "red" | "green" | "blue"

const config = {
  apiUrl: "https://api.example.com",
  timeout: 5000,
  retries: 3,
} as const;

type Config = typeof config;
// { readonly apiUrl: "https://api.example.com"; readonly timeout: 5000; readonly retries: 3; }

// 2. satisfies オペレータ
interface ColorConfig {
  primary: string;
  secondary: string;
  accent?: string;
}

const themeColors = {
  primary: "#007bff",
  secondary: "#6c757d",
  accent: "#28a745",
  // hover: "#0056b3" // エラー: ColorConfig に存在しない
} satisfies ColorConfig;

// themeColors の型は推論されつつ、ColorConfig の制約も満たす

// 3. Template Literal Types with satisfies
type EventMap = {
  click: { x: number; y: number };
  keydown: { key: string };
  resize: { width: number; height: number };
};

const eventHandlers = {
  onClick: (event: EventMap["click"]) => console.log(event.x, event.y),
  onKeydown: (event: EventMap["keydown"]) => console.log(event.key),
  onResize: (event: EventMap["resize"]) =>
    console.log(event.width, event.height),
} satisfies {
  [K in keyof EventMap as `on${Capitalize<string & K>}`]: (
    event: EventMap[K]
  ) => void;
};
```

#### 高度な型推論パターン

```typescript
// 4. 関数オーバーロードの型安全実装
function createApi<T extends Record<string, any>>(
  config: T
): {
  [K in keyof T]: T[K] extends { method: "GET" }
    ? () => Promise<T[K]["response"]>
    : T[K] extends { method: "POST" }
    ? (data: T[K]["request"]) => Promise<T[K]["response"]>
    : never;
} {
  // 実装
  return {} as any;
}

// 5. 型安全なイベントエミッター
class TypedEventEmitter<TEvents extends Record<string, any[]>> {
  private listeners: {
    [K in keyof TEvents]?: Array<(...args: TEvents[K]) => void>;
  } = {};

  on<K extends keyof TEvents>(
    event: K,
    listener: (...args: TEvents[K]) => void
  ): this {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event]!.push(listener);
    return this;
  }

  emit<K extends keyof TEvents>(event: K, ...args: TEvents[K]): boolean {
    const eventListeners = this.listeners[event];
    if (!eventListeners) return false;

    eventListeners.forEach((listener) => listener(...args));
    return true;
  }

  off<K extends keyof TEvents>(
    event: K,
    listener: (...args: TEvents[K]) => void
  ): this {
    const eventListeners = this.listeners[event];
    if (!eventListeners) return this;

    const index = eventListeners.indexOf(listener);
    if (index > -1) {
      eventListeners.splice(index, 1);
    }
    return this;
  }
}

// 使用例
interface AppEvents {
  userLogin: [user: { id: string; name: string }];
  userLogout: [];
  dataUpdate: [data: any[], timestamp: number];
}

const emitter = new TypedEventEmitter<AppEvents>();

emitter.on("userLogin", (user) => {
  // user の型は { id: string; name: string } として推論される
  console.log(`User ${user.name} logged in`);
});

emitter.emit("userLogin", { id: "123", name: "Alice" });
// emitter.emit("userLogin", "invalid"); // エラー: 型が合わない
```

## 🎯 実践演習

### 演習 5-1: CSS-in-JS 型安全システム 🔥

**目標**: テンプレートリテラル型を活用した CSS 型システム

```typescript
// 以下の要件を満たすCSS-in-JS型システムを実装せよ

// 1. CSS プロパティの型安全性
type CSSProperties = {
  color?: string;
  backgroundColor?: string;
  fontSize?: string;
  margin?: string;
  padding?: string;
  width?: string;
  height?: string;
  display?: "block" | "inline" | "flex" | "grid" | "none";
  flexDirection?: "row" | "column" | "row-reverse" | "column-reverse";
  justifyContent?:
    | "flex-start"
    | "flex-end"
    | "center"
    | "space-between"
    | "space-around";
  alignItems?: "flex-start" | "flex-end" | "center" | "stretch" | "baseline";
};

// 2. CSS カスタムプロパティ（CSS Variables）
type CSSCustomProperty = `--${string}`;

// 3. CSS 単位の型安全性
type CSSUnit = "px" | "rem" | "em" | "%" | "vh" | "vw" | "vmin" | "vmax";
type CSSValue<T extends CSSUnit> = `${number}${T}` | "0";

// 4. レスポンシブブレイクポイント
type Breakpoint = "xs" | "sm" | "md" | "lg" | "xl";
type ResponsiveValue<T> = T | { [K in Breakpoint]?: T };

// 5. テーマシステム
interface Theme {
  colors: {
    primary: string;
    secondary: string;
    success: string;
    warning: string;
    error: string;
    text: string;
    background: string;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  typography: {
    fontFamily: string;
    fontSize: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
    };
  };
}

// 6. styled-components 風の実装
type StyledProps<T = {}> = T & {
  theme: Theme;
  css?: TemplateStringsArray;
};

type StyleFunction<T = {}> = (props: StyledProps<T>) => CSSProperties;

// 実装要件:
// - 型安全なCSS プロパティ
// - テーマ値の自動補完
// - レスポンシブ対応
// - CSS カスタムプロパティサポート
// - 条件付きスタイリング

interface StyledComponent<T = {}> {
  (props: T): JSX.Element;
  attrs<U>(attrs: U | ((props: T) => U)): StyledComponent<T & U>;
}

function styled<T = {}>(
  tag: keyof JSX.IntrinsicElements
): (
  template: TemplateStringsArray,
  ...interpolations: Array<string | StyleFunction<T>>
) => StyledComponent<T> {
  // 実装
  return () => null as any;
}

// 使用例
interface ButtonProps {
  variant?: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
}

const Button = styled<ButtonProps>("button")`
  padding: ${(props) => props.theme.spacing[props.size || "md"]};
  background-color: ${(props) =>
    props.variant === "primary"
      ? props.theme.colors.primary
      : props.theme.colors.secondary};
  color: ${(props) => props.theme.colors.text};
  border: none;
  border-radius: 4px;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  opacity: ${(props) => (props.disabled ? 0.6 : 1)};

  &:hover {
    opacity: ${(props) => (props.disabled ? 0.6 : 0.8)};
  }
`;
```

**評価基準**:

- [ ] 完全な型安全性が確保されている
- [ ] テーマシステムが適切に統合されている
- [ ] レスポンシブ対応が実装されている
- [ ] 実用的な CSS-in-JS ライブラリとして機能する

### 演習 5-2: 型パズル解決チャレンジ 💎

**目標**: type-challenges の上級問題解決

```typescript
// 以下の型パズルを解決せよ（type-challenges より）

// 1. DeepReadonly - ネストしたオブジェクトも含めて全てreadonlyにする
type DeepReadonly<T> = /* 実装 */;

// 2. TupleToUnion - タプルをユニオン型に変換
type TupleToUnion<T extends readonly any[]> = /* 実装 */;

// 3. Chainable Options - チェーン可能なオプション設定
type Chainable<T = {}> = {
  option<K extends string, V>(
    key: K extends keyof T ? never : K,
    value: V
  ): Chainable<T & { [P in K]: V }>;
  get(): T;
};

// 4. Last of Array - 配列の最後の要素の型を取得
type Last<T extends any[]> = /* 実装 */;

// 5. Pop - 配列の最後の要素を除いた型を取得
type Pop<T extends any[]> = /* 実装 */;

// 6. Promise.all の型実装
type PromiseAll<T extends readonly unknown[]> = /* 実装 */;

// 7. Type Lookup - ユニオン型から特定の型を検索
type LookUp<U, T> = /* 実装 */;

// 8. Trim Left - 文字列の左側の空白を除去
type TrimLeft<S extends string> = /* 実装 */;

// 9. Trim - 文字列の両端の空白を除去
type Trim<S extends string> = /* 実装 */;

// 10. Capitalize - 文字列の最初の文字を大文字に
type MyCapitalize<S extends string> = /* 実装 */;

// テストケース
type Test1 = DeepReadonly<{
  a: string;
  b: { c: number; d: { e: boolean } };
}>; // 全てのプロパティがreadonlyになること

type Test2 = TupleToUnion<[123, '456', true]>; // 123 | '456' | true

type Test3 = Last<[3, 2, 1]>; // 1

type Test4 = Pop<[3, 2, 1]>; // [3, 2]

type Test5 = LookUp<Cat | Dog, 'dog'>; // Dog

type Test6 = TrimLeft<'  Hello World  '>; // 'Hello World  '

type Test7 = Trim<'  Hello World  '>; // 'Hello World'

type Test8 = MyCapitalize<'hello world'>; // 'Hello world'
```

**評価基準**:

- [ ] 全ての型パズルが正しく解決されている
- [ ] エッジケースも適切に処理されている
- [ ] 効率的な型計算が実装されている
- [ ] 再利用可能な型ユーティリティとして設計されている

## 📊 Week 5-6 評価基準

### 理解度チェックリスト

#### テンプレートリテラル型 (30%)

- [ ] 基本的なテンプレートリテラル型を作成できる
- [ ] 文字列操作ユーティリティを活用できる
- [ ] 複雑な文字列変換を実装できる
- [ ] 実用的な API で活用できる

#### 型レベルプログラミング (35%)

- [ ] 再帰的型定義を理解している
- [ ] 型レベルでの数値計算ができる
- [ ] 配列操作の型を実装できる
- [ ] 高度な型パズルを解決できる

#### TypeScript 5.x 新機能 (20%)

- [ ] const assertions を適切に使用できる
- [ ] satisfies オペレータを理解している
- [ ] 新しい型推論パターンを活用できる

#### 実践応用 (15%)

- [ ] 型安全なライブラリを設計できる
- [ ] パフォーマンスを考慮した型設計ができる
- [ ] 実用的な型システムを構築できる

### 成果物チェックリスト

- [ ] **CSS-in-JS 型システム**: テンプレートリテラル型の実践活用
- [ ] **型パズル解決集**: 50 問以上の解決実績
- [ ] **型レベルライブラリ**: 再利用可能な型ユーティリティ集
- [ ] **TypeScript 5.x 活用例**: 新機能の実践的応用

## 🔄 Week 7-8 への準備

### 次週学習内容の予習

```typescript
// Week 7-8で学習するCompiler API・ツール開発の基礎概念

// 1. TypeScript AST の基本
import * as ts from "typescript";

// 2. ESLint ルール作成の基礎
import { ESLintUtils } from "@typescript-eslint/utils";

// 3. コード変換の基本パターン
const transformer: ts.TransformerFactory<ts.SourceFile> = (context) => {
  return (sourceFile) => {
    // AST変換ロジック
    return sourceFile;
  };
};
```

### 環境準備

- [ ] TypeScript Compiler API の環境構築
- [ ] ESLint プラグイン開発環境の準備
- [ ] AST Explorer の活用準備

---

**📌 重要**: Week 5-6 は TypeScript の上級レベルを習得し、型レベルプログラミングの実践力を身につける重要な期間です。これらの技術により、非常に高度で型安全なシステムを構築できるようになります。
