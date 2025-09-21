# STEP05 総復習：ジェネリクスによる型の再利用と高度な型機能

## 📋 概要

STEP05「ジェネリクスによる型の再利用と高度な型機能」の理論学習内容を総復習するためのドキュメントです。

## 🎯 学習目標

- [ ] ジェネリクスによる型の再利用の完全理解と実践的活用
- [ ] 制約（constraints）による型の制限の習得
- [ ] 高階関数とジェネリクスの組み合わせパターンの理解
- [ ] 条件付き型と型推論の高度な活用方法の習得
- [ ] ジェネリクスの実践パターンの理解と応用

---

## 1. ジェネリクスによる型の再利用

### 1.1 基本的なジェネリクス

ジェネリクスは型安全性を保ちながらコードの再利用性を向上させるTypeScriptの核心機能です。

```typescript
// 基本的なジェネリック関数
function identity<T>(arg: T): T {
  return arg;
}

// ジェネリックインターフェース
interface Container<T> {
  value: T;
  getValue(): T;
}

// ジェネリッククラス
class Stack<T> {
  private items: T[] = [];
  
  push(item: T): void {
    this.items.push(item);
  }
  
  pop(): T | undefined {
    return this.items.pop();
  }
}
```

### 1.2 複数の型パラメータとデフォルト型

```typescript
// 複数の型パラメータ
function pair<T, U>(first: T, second: U): [T, U] {
  return [first, second];
}

// デフォルト型パラメータ
interface Result<T = string> {
  success: boolean;
  data: T;
}
```

---

## 2. 制約（constraints）による型の制限

### 2.1 extends による制約

```typescript
// 基本的な制約
interface Lengthwise {
  length: number;
}

function logLength<T extends Lengthwise>(arg: T): T {
  console.log(arg.length);
  return arg;
}

// keyof演算子との組み合わせ
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}
```

### 2.2 条件付き制約

```typescript
type StringOrNumber<T> = T extends string ? string : T extends number ? number : never;

function processValue<T extends string | number>(value: T): StringOrNumber<T> {
  if (typeof value === "string") {
    return value.toUpperCase() as StringOrNumber<T>;
  } else {
    return (value * 2) as StringOrNumber<T>;
  }
}
```

---

## 3. 高階関数とジェネリクス

### 3.1 関数型プログラミングパターン

```typescript
// 高階関数とジェネリクス
function createMapper<T, U>(transform: (item: T) => U) {
  return function(array: T[]): U[] {
    return array.map(transform);
  };
}

// 関数合成
function compose<T, U, V>(
  f: (x: U) => V,
  g: (x: T) => U
): (x: T) => V {
  return (x: T) => f(g(x));
}
```

### 3.2 型安全な配列操作

```typescript
// 型安全なmap, filter
function safeMap<T, U>(
  array: T[],
  transform: (item: T) => U
): U[] {
  return array.map(transform);
}

// 型ガード付きfilter
function safeFilterWithTypeGuard<T, U extends T>(
  array: T[],
  predicate: (item: T) => item is U
): U[] {
  return array.filter(predicate);
}
```

---

## 4. 条件付き型と型推論

### 4.1 条件付き型（Conditional Types）

```typescript
// 基本的な条件付き型
type IsString<T> = T extends string ? true : false;
type NonNullable<T> = T extends null | undefined ? never : T;

// 配列の要素型を取得
type ArrayElement<T> = T extends (infer U)[] ? U : never;

// Promise の値型を取得
type Awaited<T> = T extends Promise<infer U> ? U : T;
```

### 4.2 infer キーワードの活用

```typescript
// 関数の戻り値型を取得
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

// 関数の引数型を取得
type Parameters<T> = T extends (...args: infer P) => any ? P : never;

// タプルの先頭と末尾
type Head<T> = T extends [infer H, ...any[]] ? H : never;
type Tail<T> = T extends [any, ...infer T] ? T : never;
```

### 4.3 分散条件付き型

```typescript
// 分散条件付き型
type ToArray<T> = T extends any ? T[] : never;
type Test = ToArray<string | number>; // string[] | number[]

// 分散を防ぐ方法
type ToArrayNonDistributive<T> = [T] extends [any] ? T[] : never;
type Test2 = ToArrayNonDistributive<string | number>; // (string | number)[]
```

---

## 5. ジェネリクスの実践パターン

### 5.1 Repository パターン

```typescript
// 基本的なエンティティ
interface BaseEntity {
  id: number;
  createdAt: Date;
  updatedAt: Date;
}

// Repository インターフェース
interface IRepository<T extends BaseEntity> {
  findById(id: number): Promise<T | null>;
  findAll(): Promise<T[]>;
  create(entity: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<T>;
  update(id: number, entity: Partial<T>): Promise<T | null>;
  delete(id: number): Promise<boolean>;
}
```

### 5.2 ファクトリーパターン

```typescript
// ファクトリーインターフェース
interface IFactory<T> {
  create(...args: any[]): T;
}

// 設定可能なファクトリー
interface FactoryConfig<T> {
  validator?: (data: any) => boolean;
  transformer?: (data: any) => T;
  defaultValues?: Partial<T>;
}

class ConfigurableFactory<T> implements IFactory<T> {
  constructor(
    private createFn: (...args: any[]) => T,
    private config: FactoryConfig<T> = {}
  ) {}

  create(...args: any[]): T {
    return this.createFn(...args);
  }
}
```

### 5.3 イベントシステム

```typescript
// 型安全なイベントシステム
interface EventMap {
  'user:created': { userId: number; name: string };
  'user:updated': { userId: number; changes: Partial<User> };
  'user:deleted': { userId: number };
}

class EventEmitter<T extends Record<string, any>> {
  private listeners: { [K in keyof T]?: Array<(data: T[K]) => void> } = {};

  on<K extends keyof T>(event: K, listener: (data: T[K]) => void): void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event]!.push(listener);
  }

  emit<K extends keyof T>(event: K, data: T[K]): void {
    const eventListeners = this.listeners[event];
    if (eventListeners) {
      eventListeners.forEach(listener => listener(data));
    }
  }
}
```

---

## 6. 実践での活用場面

### 6.1 汎用的なユーティリティ関数

```typescript
// 型安全性を保ちながら再利用可能な関数
function pick<T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  const result = {} as Pick<T, K>;
  keys.forEach(key => {
    result[key] = obj[key];
  });
  return result;
}

function omit<T, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
  const result = { ...obj };
  keys.forEach(key => {
    delete result[key];
  });
  return result;
}
```

### 6.2 状態管理での型安全性

```typescript
// 型安全な状態管理
interface AppState {
  user: User | null;
  products: Product[];
  loading: boolean;
}

type Action<T extends string, P = void> = P extends void 
  ? { type: T } 
  : { type: T; payload: P };

type AppAction = 
  | Action<'SET_USER', User>
  | Action<'SET_PRODUCTS', Product[]>
  | Action<'SET_LOADING', boolean>
  | Action<'CLEAR_USER'>;

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_PRODUCTS':
      return { ...state, products: action.payload };
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

1. **ジェネリクスの活用パターン**
   - 基本的なジェネリクス（関数、インターフェース、クラス）
   - 複数の型パラメータとデフォルト型パラメータ
   - 型の再利用による保守性の向上

2. **制約による型の制限**
   - `extends`による制約で型安全性を確保
   - `keyof`演算子との組み合わせでプロパティアクセスを安全に
   - 条件付き制約で柔軟な型制御

3. **高階関数とジェネリクスの組み合わせ**
   - 関数型プログラミングパターンの型安全な実装
   - `map`、`filter`等の型安全な実装
   - 関数合成の活用

4. **条件付き型と型推論**
   - 条件付き型による動的な型生成
   - `infer`キーワードによる型の推論
   - 分散条件付き型の理解と活用

5. **実践パターンの理解**
   - Repository パターンでの統一的なデータアクセス
   - ファクトリーパターンによる型安全なオブジェクト生成
   - イベントシステムでの型安全な通信

### 次のステップへの準備

- ユーティリティ型の深い理解
- 高度な型操作の習得
- 実際のプロジェクトでの応用
- パフォーマンスを考慮した設計

---

## 🔗 関連リソース

- [TypeScript Handbook - Generics](https://www.typescriptlang.org/docs/handbook/2/generics.html)
- [TypeScript Handbook - Conditional Types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html)
- [TypeScript Handbook - Utility Types](https://www.typescriptlang.org/docs/handbook/utility-types.html)
- 既存のセッションファイル：Step05_Session0_高階関数.md、Step05_Session1_ジェネリクス理論と基本実践.md