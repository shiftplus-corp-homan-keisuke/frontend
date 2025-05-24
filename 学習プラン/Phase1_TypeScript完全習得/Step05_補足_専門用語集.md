# Step05 専門用語集

> 💡 **このファイルについて**: Step05で出てくるジェネリクス関連の重要な専門用語と概念の詳細解説集です。

## 📋 目次
1. [ジェネリクス基本用語](#ジェネリクス基本用語)
2. [型パラメータ関連用語](#型パラメータ関連用語)
3. [制約関連用語](#制約関連用語)
4. [高度なジェネリクス用語](#高度なジェネリクス用語)

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