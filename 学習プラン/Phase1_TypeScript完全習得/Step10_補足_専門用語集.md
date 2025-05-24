# Step10 専門用語集

> 💡 **このファイルについて**: Step10で出てくる高度な型機能関連の重要な専門用語と概念の詳細解説集です。

## 📋 目次
1. [高度な型機能用語](#高度な型機能用語)
2. [型レベルプログラミング用語](#型レベルプログラミング用語)
3. [パフォーマンス関連用語](#パフォーマンス関連用語)
4. [実用パターン用語](#実用パターン用語)

---

## 高度な型機能用語

### 条件型（Conditional Types）
**定義**: 型レベルでの条件分岐を行う型

**実装例**:
```typescript
type IsString<T> = T extends string ? true : false;

type Test1 = IsString<string>; // true
type Test2 = IsString<number>; // false

// より実用的な例
type NonNullable<T> = T extends null | undefined ? never : T;
```

### 分散条件型（Distributive Conditional Types）
**定義**: ユニオン型に対して条件型が分散適用される仕組み

**実装例**:
```typescript
type ToArray<T> = T extends any ? T[] : never;

type Test = ToArray<string | number>; // string[] | number[]
```

### テンプレートリテラル型（Template Literal Types）
**定義**: 文字列リテラル型を組み合わせて新しい型を作成

**実装例**:
```typescript
type EventName<T extends string> = `on${Capitalize<T>}`;

type ClickEvent = EventName<"click">; // "onClick"
type HoverEvent = EventName<"hover">; // "onHover"

// より複雑な例
type CSSProperty<T extends string> = `--${T}`;
type Theme = CSSProperty<"primary" | "secondary">; // "--primary" | "--secondary"
```

### 再帰型（Recursive Types）
**定義**: 自分自身を参照する型定義

**実装例**:
```typescript
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

type NestedObject = {
  a: string;
  b: {
    c: number;
    d: {
      e: boolean;
    };
  };
};

type ReadonlyNested = DeepReadonly<NestedObject>;
```

---

## 型レベルプログラミング用語

### 型レベル関数（Type-Level Functions）
**定義**: 型を引数として受け取り、型を返す仕組み

**実装例**:
```typescript
// 配列の最初の要素の型を取得
type Head<T extends readonly unknown[]> = T extends readonly [infer H, ...unknown[]] ? H : never;

type FirstElement = Head<[string, number, boolean]>; // string

// 配列の末尾の型を取得
type Tail<T extends readonly unknown[]> = T extends readonly [unknown, ...infer Rest] ? Rest : [];

type RestElements = Tail<[string, number, boolean]>; // [number, boolean]
```

### 型レベル演算（Type-Level Operations）
**定義**: 型レベルでの計算や操作

**実装例**:
```typescript
// 数値の加算（型レベル）
type Add<A extends number, B extends number> = 
  [...Array<A>, ...Array<B>]['length'] extends number ? 
  [...Array<A>, ...Array<B>]['length'] : never;

type Sum = Add<2, 3>; // 5

// 文字列の長さ計算
type Length<S extends string> = S extends `${string}${infer Rest}` 
  ? 1 extends 0 ? never : 1 + Length<Rest>
  : 0;
```

### パターンマッチング（Pattern Matching）
**定義**: 型の構造に基づいた条件分岐

**実装例**:
```typescript
type ParseURL<T extends string> = T extends `${infer Protocol}://${infer Domain}/${infer Path}`
  ? {
      protocol: Protocol;
      domain: Domain;
      path: Path;
    }
  : T extends `${infer Protocol}://${infer Domain}`
  ? {
      protocol: Protocol;
      domain: Domain;
      path: never;
    }
  : never;

type URL = ParseURL<"https://example.com/path">; 
// { protocol: "https"; domain: "example.com"; path: "path" }
```

---

## パフォーマンス関連用語

### 型チェック最適化（Type Checking Optimization）
**定義**: TypeScriptコンパイラの型チェック性能を向上させる技法

**実装例**:
```typescript
// 悪い例：深い再帰
type BadDeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? BadDeepPartial<T[P]> : T[P];
};

// 良い例：制限付き再帰
type GoodDeepPartial<T, Depth extends number = 5> = Depth extends 0
  ? T
  : {
      [P in keyof T]?: T[P] extends object 
        ? GoodDeepPartial<T[P], Prev<Depth>>
        : T[P];
    };

type Prev<T extends number> = T extends 1 ? 0 : T extends 2 ? 1 : T extends 3 ? 2 : T extends 4 ? 3 : T extends 5 ? 4 : never;
```

### 遅延評価（Lazy Evaluation）
**定義**: 必要になるまで型の計算を遅延させる技法

**実装例**:
```typescript
// 遅延評価を使った効率的な型定義
type LazyPick<T, K extends keyof T> = K extends keyof T ? Pick<T, K> : never;

// 即座に評価される型
type EagerPick<T, K extends keyof T> = {
  [P in K]: T[P];
};
```

---

## 実用パターン用語

### ブランド型（Branded Types）
**定義**: 同じ基底型でも異なる意味を持つ型を区別する仕組み

**実装例**:
```typescript
type Brand<T, B> = T & { __brand: B };

type UserId = Brand<string, 'UserId'>;
type Email = Brand<string, 'Email'>;

function createUserId(id: string): UserId {
  return id as UserId;
}

function sendEmail(email: Email): void {
  // メール送信処理
}

const userId = createUserId("123");
const email = "user@example.com" as Email;

// sendEmail(userId); // エラー：UserId型はEmail型に代入できない
sendEmail(email); // OK
```

### ファントム型（Phantom Types）
**定義**: 実行時には存在しないが、型レベルでの制約に使用される型

**実装例**:
```typescript
type State<T> = {
  value: unknown;
  _phantom: T;
};

type Authenticated = { authenticated: true };
type Unauthenticated = { authenticated: false };

type AuthState<T> = State<T>;

function login(): AuthState<Authenticated> {
  return { value: "user-data", _phantom: undefined as any };
}

function getProtectedData(state: AuthState<Authenticated>): string {
  return state.value as string;
}

const authState = login();
getProtectedData(authState); // OK

// const unauthState: AuthState<Unauthenticated> = { value: null, _phantom: undefined as any };
// getProtectedData(unauthState); // エラー
```

### 型安全なビルダーパターン
**定義**: 段階的な構築過程を型で表現するパターン

**実装例**:
```typescript
type BuilderState = {
  hasName: boolean;
  hasAge: boolean;
  hasEmail: boolean;
};

type UserBuilder<S extends BuilderState> = {
  name: S['hasName'] extends true ? never : (name: string) => UserBuilder<S & { hasName: true }>;
  age: S['hasAge'] extends true ? never : (age: number) => UserBuilder<S & { hasAge: true }>;
  email: S['hasEmail'] extends true ? never : (email: string) => UserBuilder<S & { hasEmail: true }>;
  build: S extends { hasName: true; hasAge: true; hasEmail: true } ? () => User : never;
};

interface User {
  name: string;
  age: number;
  email: string;
}

// 使用例
const user = createUserBuilder()
  .name("Alice")
  .age(30)
  .email("alice@example.com")
  .build(); // すべてのプロパティが設定されるまでbuild()は呼べない
```

---

## 📚 参考リンク

- [TypeScript Advanced Types](https://www.typescriptlang.org/docs/handbook/2/types-from-types.html)
- [Template Literal Types](https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html)
- [Conditional Types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html)

---

**📌 重要**: 高度な型機能は強力ですが、適切に使用することが重要です。可読性とパフォーマンスのバランスを考慮して活用しましょう。