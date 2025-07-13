# Step05 専門用語集

> 💡 **このファイルについて**: Step05で出てくる高階関数・ジェネリクス関連の重要な専門用語と概念の詳細解説集です。

## 📋 目次
1. [高階関数基本用語](#高階関数基本用語)
2. [関数型プログラミング用語](#関数型プログラミング用語)
3. [ジェネリクス基本用語](#ジェネリクス基本用語)
4. [型パラメータ関連用語](#型パラメータ関連用語)
5. [制約関連用語](#制約関連用語)
6. [高度なジェネリクス用語](#高度なジェネリクス用語)

---

## 高階関数基本用語

### 高階関数（Higher-Order Function）
**定義**: 関数を引数として受け取ったり、関数を戻り値として返したりする関数

**特徴**:
- 関数の抽象化レベルを向上させる
- コードの再利用性を高める
- 関数型プログラミングの基礎概念

**コード例**:
```typescript
// 関数を引数として受け取る高階関数
function executeOperation<T>(
  value: T,
  operation: (arg: T) => T
): T {
  return operation(value);
}

// 関数を戻り値として返す高階関数
function createMultiplier(factor: number): (x: number) => number {
  return (x: number) => x * factor;
}

// 使用例
const double = createMultiplier(2);
const result = executeOperation(5, double); // 10
```

### コールバック関数（Callback Function）
**定義**: 他の関数に引数として渡される関数

**用途**:
- 非同期処理の完了時の処理
- イベントハンドリング
- 配列操作（map、filter、reduceなど）

**コード例**:
```typescript
// 基本的なコールバック関数
function processData(
  data: string[],
  callback: (item: string) => string
): string[] {
  return data.map(callback);
}

// 非同期処理でのコールバック
function fetchData(
  url: string,
  onSuccess: (data: any) => void,
  onError: (error: Error) => void
): void {
  // 非同期処理の実装
}
```

### クロージャ（Closure）
**定義**: 関数が定義された時点のスコープを「記憶」し、そのスコープの変数にアクセスできる仕組み

**特徴**:
- プライベート変数の実現
- 状態を保持する関数の作成
- ファクトリーパターンの実装

**コード例**:
```typescript
// 基本的なクロージャ
function createCounter(initialValue: number = 0): () => number {
  let count = initialValue; // プライベート変数

  return function(): number {
    return ++count;
  };
}

// 使用例
const counter = createCounter(10);
console.log(counter()); // 11
console.log(counter()); // 12

// より複雑なクロージャ
function createBankAccount(initialBalance: number) {
  let balance = initialBalance;

  return {
    deposit: (amount: number) => {
      balance += amount;
      return balance;
    },
    withdraw: (amount: number) => {
      if (amount <= balance) {
        balance -= amount;
        return balance;
      }
      throw new Error('Insufficient funds');
    },
    getBalance: () => balance
  };
}
```

### カリー化（Currying）
**定義**: 複数の引数を取る関数を、一つの引数を取る関数の連鎖に変換する技法

**利点**:
- 関数の部分適用が可能
- 関数の合成が容易
- 再利用性の向上

**コード例**:
```typescript
// 通常の関数
function add(x: number, y: number, z: number): number {
  return x + y + z;
}

// カリー化された関数
function curriedAdd(x: number): (y: number) => (z: number) => number {
  return (y: number) => (z: number) => x + y + z;
}

// 使用例
const add5 = curriedAdd(5);
const add5And3 = add5(3);
const result = add5And3(2); // 10

// 汎用的なカリー化関数
function curry2<A, B, R>(fn: (a: A, b: B) => R): (a: A) => (b: B) => R {
  return (a: A) => (b: B) => fn(a, b);
}
```

### 部分適用（Partial Application）
**定義**: 関数の一部の引数を固定して、新しい関数を作成する技法

**カリー化との違い**:
- カリー化: 関数の構造を変換
- 部分適用: 引数の一部を固定

**コード例**:
```typescript
// 部分適用の実装
function partial<T extends any[], U extends any[], R>(
  fn: (...args: [...T, ...U]) => R,
  ...partialArgs: T
): (...args: U) => R {
  return (...remainingArgs: U) => fn(...partialArgs, ...remainingArgs);
}

// 使用例
function greet(greeting: string, name: string, punctuation: string): string {
  return `${greeting}, ${name}${punctuation}`;
}

const sayHello = partial(greet, "Hello");
const sayHelloToAlice = partial(sayHello, "Alice");

console.log(sayHelloToAlice("!")); // "Hello, Alice!"
```

---

## 関数型プログラミング用語

### 純粋関数（Pure Function）
**定義**: 同じ入力に対して常に同じ出力を返し、副作用を持たない関数

**特徴**:
- 予測可能な動作
- テストが容易
- 並列処理に適している

**コード例**:
```typescript
// 純粋関数の例
function add(x: number, y: number): number {
  return x + y; // 副作用なし、同じ入力で同じ出力
}

// 非純粋関数の例
let counter = 0;
function impureIncrement(): number {
  return ++counter; // 外部状態を変更（副作用あり）
}

// 純粋関数版
function pureIncrement(current: number): number {
  return current + 1; // 副作用なし
}
```

### 不変性（Immutability）
**定義**: データが作成後に変更されないという性質

**利点**:
- 予期しない変更を防ぐ
- 並行処理での安全性
- デバッグの容易さ

**コード例**:
```typescript
// 不変性を保つ配列操作
const originalArray = [1, 2, 3];

// ❌ 元の配列を変更（可変操作）
// originalArray.push(4);

// ✅ 新しい配列を作成（不変操作）
const newArray = [...originalArray, 4];

// 不変性を保つオブジェクト操作
const originalUser = { name: "Alice", age: 25 };

// ✅ 新しいオブジェクトを作成
const updatedUser = { ...originalUser, age: 26 };
```

### 関数合成（Function Composition）
**定義**: 複数の関数を組み合わせて新しい関数を作成する技法

**コード例**:
```typescript
// 基本的な関数合成
function compose<A, B, C>(
  f: (b: B) => C,
  g: (a: A) => B
): (a: A) => C {
  return (a: A) => f(g(a));
}

// 使用例
const addOne = (x: number) => x + 1;
const multiplyByTwo = (x: number) => x * 2;

const addOneThenMultiplyByTwo = compose(multiplyByTwo, addOne);
console.log(addOneThenMultiplyByTwo(3)); // (3 + 1) * 2 = 8

// パイプライン演算子風の実装
function pipe<T>(...fns: Array<(arg: T) => T>): (value: T) => T {
  return (value: T) => fns.reduce((acc, fn) => fn(acc), value);
}

const pipeline = pipe(addOne, multiplyByTwo);
console.log(pipeline(3)); // (3 + 1) * 2 = 8
```

---

## ジェネリクス基本用語

### ジェネリクス（Generics）
**定義**: 型を抽象化して、再利用可能なコンポーネントを作成する仕組み

**他言語との比較**:
- **Java**: `<T>` 記法、型消去（Type Erasure）
- **C#**: `<T>` 記法、実行時型情報保持
- **Rust**: `<T>` 記法、ゼロコスト抽象化
- **TypeScript**: 構造的型付けとの組み合わせ

**コード例**:
```typescript
// 基本的なジェネリック関数
function identity<T>(arg: T): T {
  return arg;
}

// 使用例
const stringResult = identity<string>("hello"); // 明示的
const numberResult = identity(42); // 型推論
```

### 型パラメータ（Type Parameter）
**定義**: ジェネリクスで使用される抽象的な型の変数

**命名規則**:
- `T`: Type（最も一般的）
- `U`, `V`: 複数の型パラメータ
- `K`: Key（オブジェクトのキー）
- `V`: Value（オブジェクトの値）
- `E`: Element（配列の要素）

**コード例**:
```typescript
// 複数の型パラメータ
function pair<T, U>(first: T, second: U): [T, U] {
  return [first, second];
}

// 意味のある名前を使用
interface Repository<TEntity, TKey> {
  findById(id: TKey): Promise<TEntity | null>;
  save(entity: TEntity): Promise<TEntity>;
}
```

### 型推論（Type Inference）
**定義**: TypeScriptが文脈から自動的に型を推測する機能

**コード例**:
```typescript
// 型推論の例
const numbers = [1, 2, 3]; // number[]として推論
const result = numbers.map(n => n * 2); // number[]として推論

// ジェネリクスでの型推論
function createArray<T>(item: T): T[] {
  return [item];
}

const stringArray = createArray("hello"); // string[]として推論
const numberArray = createArray(42); // number[]として推論
```

---

## 型パラメータ関連用語

### デフォルト型パラメータ（Default Type Parameters）
**定義**: 型パラメータに指定されなかった場合のデフォルト型

**コード例**:
```typescript
// デフォルト型パラメータ
interface ApiResponse<T = any> {
  data: T;
  status: number;
  message: string;
}

// 使用例
const response1: ApiResponse = { // T = any
  data: "anything",
  status: 200,
  message: "OK"
};

const response2: ApiResponse<User> = { // T = User
  data: { id: 1, name: "Alice" },
  status: 200,
  message: "OK"
};
```

### 型パラメータの制約（Type Parameter Constraints）
**定義**: 型パラメータが満たすべき条件を指定する仕組み

**コード例**:
```typescript
// extends制約
interface Lengthwise {
  length: number;
}

function logLength<T extends Lengthwise>(arg: T): T {
  console.log(arg.length); // lengthプロパティにアクセス可能
  return arg;
}

// 使用例
logLength("hello"); // OK: stringはlengthを持つ
logLength([1, 2, 3]); // OK: 配列はlengthを持つ
// logLength(123); // Error: numberはlengthを持たない
```

---

## 制約関連用語

### keyof演算子
**定義**: オブジェクト型のキーの型を取得する演算子

**コード例**:
```typescript
interface User {
  id: number;
  name: string;
  email: string;
}

type UserKeys = keyof User; // "id" | "name" | "email"

// ジェネリクスでの活用
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const user: User = { id: 1, name: "Alice", email: "alice@example.com" };
const name = getProperty(user, "name"); // string型
const id = getProperty(user, "id"); // number型
```

### インデックスアクセス型（Indexed Access Types）
**定義**: 型のプロパティの型を取得する仕組み

**コード例**:
```typescript
interface User {
  id: number;
  profile: {
    name: string;
    age: number;
  };
}

type UserId = User["id"]; // number
type UserProfile = User["profile"]; // { name: string; age: number; }
type UserName = User["profile"]["name"]; // string

// 配列要素の型を取得
type StringArray = string[];
type StringItem = StringArray[number]; // string
```

### 条件型（Conditional Types）
**定義**: 型の条件分岐を行う仕組み

**コード例**:
```typescript
// 基本的な条件型
type IsString<T> = T extends string ? true : false;

type Test1 = IsString<string>; // true
type Test2 = IsString<number>; // false

// 実用的な例
type NonNullable<T> = T extends null | undefined ? never : T;

type Result1 = NonNullable<string | null>; // string
type Result2 = NonNullable<number | undefined>; // number
```

---

## 高度なジェネリクス用語

### 分散条件型（Distributive Conditional Types）
**定義**: ユニオン型に対して条件型が分散適用される仕組み

**コード例**:
```typescript
// 分散条件型
type ToArray<T> = T extends any ? T[] : never;

type Result = ToArray<string | number>; // string[] | number[]

// 非分散にする場合
type ToArrayNonDistributive<T> = [T] extends [any] ? T[] : never;

type Result2 = ToArrayNonDistributive<string | number>; // (string | number)[]
```

### マップ型（Mapped Types）
**定義**: 既存の型から新しい型を生成する仕組み

**コード例**:
```typescript
// 基本的なマップ型
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};

type Partial<T> = {
  [P in keyof T]?: T[P];
};

// 使用例
interface User {
  id: number;
  name: string;
  email: string;
}

type ReadonlyUser = Readonly<User>;
// {
//   readonly id: number;
//   readonly name: string;
//   readonly email: string;
// }

type PartialUser = Partial<User>;
// {
//   id?: number;
//   name?: string;
//   email?: string;
// }
```

### テンプレートリテラル型（Template Literal Types）
**定義**: 文字列リテラル型を組み合わせて新しい型を生成

**コード例**:
```typescript
// テンプレートリテラル型
type EventName<T extends string> = `on${Capitalize<T>}`;

type ClickEvent = EventName<"click">; // "onClick"
type HoverEvent = EventName<"hover">; // "onHover"

// より複雑な例
type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";
type ApiEndpoint<T extends string> = `/api/${T}`;

type UserEndpoint = ApiEndpoint<"users">; // "/api/users"
type PostEndpoint = ApiEndpoint<"posts">; // "/api/posts"
```

### 再帰型（Recursive Types）
**定義**: 自分自身を参照する型定義

**コード例**:
```typescript
// 再帰型の例
type JsonValue = 
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

// ツリー構造
interface TreeNode<T> {
  value: T;
  children: TreeNode<T>[];
}

// 深いオブジェクトの型
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};
```

---

## 📚 実用的なパターン

### ファクトリーパターン
```typescript
interface Factory<T> {
  create(...args: any[]): T;
}

class UserFactory implements Factory<User> {
  create(name: string, email: string): User {
    return { id: Date.now(), name, email };
  }
}
```

### ビルダーパターン
```typescript
class QueryBuilder<T> {
  private conditions: string[] = [];
  
  where(condition: string): QueryBuilder<T> {
    this.conditions.push(condition);
    return this;
  }
  
  build(): string {
    return `SELECT * FROM table WHERE ${this.conditions.join(' AND ')}`;
  }
}
```

### リポジトリパターン
```typescript
interface Repository<T, K> {
  findById(id: K): Promise<T | null>;
  findAll(): Promise<T[]>;
  save(entity: T): Promise<T>;
  delete(id: K): Promise<void>;
}

class UserRepository implements Repository<User, number> {
  async findById(id: number): Promise<User | null> {
    // 実装
  }
  
  async findAll(): Promise<User[]> {
    // 実装
  }
  
  async save(user: User): Promise<User> {
    // 実装
  }
  
  async delete(id: number): Promise<void> {
    // 実装
  }
}
```

---

## 📚 参考リンク

- [TypeScript Handbook - Generics](https://www.typescriptlang.org/docs/handbook/generics.html)
- [TypeScript Handbook - Advanced Types](https://www.typescriptlang.org/docs/handbook/advanced-types.html)
- [TypeScript Handbook - Utility Types](https://www.typescriptlang.org/docs/handbook/utility-types.html)

---

**📌 重要**: ジェネリクスは TypeScript の最も強力な機能の一つです。これらの概念を理解することで、再利用可能で型安全なコードを書けるようになります。