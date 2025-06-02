# Step05 実践コード例

> 💡 **このファイルについて**: ジェネリクスの段階的な学習のためのコード例集です。

## 📋 目次
1. [基本的なジェネリクス](#基本的なジェネリクス)
2. [ジェネリック制約の活用](#ジェネリック制約の活用)
3. [実用的なジェネリックライブラリ](#実用的なジェネリックライブラリ)
4. [高度なジェネリクスパターン](#高度なジェネリクスパターン)

---

## 基本的なジェネリクス

### ステップ1: 基本的なジェネリック関数
```typescript
// basic-generics.ts

// 1. 基本的なジェネリック関数
function identity<T>(arg: T): T {
  return arg;
}

// 使用例
const stringResult = identity<string>("hello");
const numberResult = identity<number>(42);
const autoInferred = identity("world"); // 型推論

// 2. 配列操作のジェネリクス
function getFirst<T>(array: T[]): T | undefined {
  return array.length > 0 ? array[0] : undefined;
}

function getLast<T>(array: T[]): T | undefined {
  return array.length > 0 ? array[array.length - 1] : undefined;
}

// 使用例
const numbers = [1, 2, 3, 4, 5];
const strings = ["a", "b", "c"];

console.log(getFirst(numbers)); // 1
console.log(getLast(strings)); // "c"

// 3. ペア作成関数
function createPair<T, U>(first: T, second: U): [T, U] {
  return [first, second];
}

const stringNumberPair = createPair("hello", 42);
const booleanArrayPair = createPair(true, [1, 2, 3]);

// 4. 配列変換関数
function map<T, U>(array: T[], transform: (item: T) => U): U[] {
  const result: U[] = [];
  for (const item of array) {
    result.push(transform(item));
  }
  return result;
}

// 使用例
const doubled = map([1, 2, 3], x => x * 2); // number[]
const lengths = map(["hello", "world"], s => s.length); // number[]
```

### ステップ2: ジェネリッククラス
```typescript
// generic-classes.ts

// 1. 基本的なジェネリッククラス
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
}

// 使用例
const stringBox = new Box<string>("hello");
const numberBox = new Box<number>(42);

console.log(stringBox.getValue()); // "hello"
console.log(numberBox.getValue()); // 42

// 2. スタック実装
class Stack<T> {
  private items: T[] = [];

  push(item: T): void {
    this.items.push(item);
  }

  pop(): T | undefined {
    return this.items.pop();
  }

  peek(): T | undefined {
    return this.items[this.items.length - 1];
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }

  size(): number {
    return this.items.length;
  }

  toArray(): T[] {
    return [...this.items];
  }
}

// 使用例
const numberStack = new Stack<number>();
numberStack.push(1);
numberStack.push(2);
numberStack.push(3);

console.log(numberStack.pop()); // 3
console.log(numberStack.peek()); // 2
console.log(numberStack.toArray()); // [1, 2]

// 3. キューの実装
class Queue<T> {
  private items: T[] = [];

  enqueue(item: T): void {
    this.items.push(item);
  }

  dequeue(): T | undefined {
    return this.items.shift();
  }

  front(): T | undefined {
    return this.items[0];
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }

  size(): number {
    return this.items.length;
  }
}

// 使用例
const stringQueue = new Queue<string>();
stringQueue.enqueue("first");
stringQueue.enqueue("second");
stringQueue.enqueue("third");

console.log(stringQueue.dequeue()); // "first"
console.log(stringQueue.front()); // "second"
```

---

## ジェネリック制約の活用

### ステップ3: extends制約
```typescript
// generic-constraints.ts

// 1. lengthプロパティを持つ型の制約
interface Lengthwise {
  length: number;
}

function logLength<T extends Lengthwise>(arg: T): T {
  console.log(`Length: ${arg.length}`);
  return arg;
}

// 使用例
logLength("hello"); // OK: string has length
logLength([1, 2, 3]); // OK: array has length
logLength({ length: 10, value: "test" }); // OK: object has length
// logLength(123); // Error: number doesn't have length

// 2. keyof制約
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

interface User {
  id: number;
  name: string;
  email: string;
}

const user: User = {
  id: 1,
  name: "Alice",
  email: "alice@example.com"
};

const name = getProperty(user, "name"); // string
const id = getProperty(user, "id"); // number
// const invalid = getProperty(user, "invalid"); // Error

// 3. 複数の制約
interface Identifiable {
  id: number;
}

interface Timestamped {
  createdAt: Date;
  updatedAt: Date;
}

function updateEntity<T extends Identifiable & Timestamped>(
  entity: T,
  updates: Partial<Omit<T, 'id' | 'createdAt'>>
): T {
  return {
    ...entity,
    ...updates,
    updatedAt: new Date()
  };
}

// 使用例
interface Article extends Identifiable, Timestamped {
  title: string;
  content: string;
  authorId: number;
}

const article: Article = {
  id: 1,
  title: "TypeScript Generics",
  content: "Learning generics...",
  authorId: 123,
  createdAt: new Date("2024-01-01"),
  updatedAt: new Date("2024-01-01")
};

const updatedArticle = updateEntity(article, {
  title: "Advanced TypeScript Generics",
  content: "Deep dive into generics..."
});
```

### ステップ4: 条件型の活用
```typescript
// conditional-types.ts

// 1. 基本的な条件型
type IsArray<T> = T extends any[] ? true : false;

type Test1 = IsArray<string[]>; // true
type Test2 = IsArray<number>; // false

// 2. 実用的な条件型
type NonNullable<T> = T extends null | undefined ? never : T;

type Result1 = NonNullable<string | null>; // string
type Result2 = NonNullable<number | undefined>; // number

// 3. 関数の戻り値型を取得
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

function getString(): string {
  return "hello";
}

function getNumber(): number {
  return 42;
}

type StringReturn = ReturnType<typeof getString>; // string
type NumberReturn = ReturnType<typeof getNumber>; // number

// 4. 配列の要素型を取得
type ElementType<T> = T extends (infer U)[] ? U : never;

type StringElement = ElementType<string[]>; // string
type NumberElement = ElementType<number[]>; // number

// 5. Promise の値型を取得
type Awaited<T> = T extends Promise<infer U> ? U : T;

type PromiseString = Awaited<Promise<string>>; // string
type DirectString = Awaited<string>; // string

// 実用例：非同期関数のラッパー
async function withLogging<T>(
  operation: () => Promise<T>,
  label: string
): Promise<T> {
  console.log(`Starting ${label}...`);
  try {
    const result = await operation();
    console.log(`Completed ${label}`);
    return result;
  } catch (error) {
    console.error(`Failed ${label}:`, error);
    throw error;
  }
}
```

---

## 実用的なジェネリックライブラリ

### ステップ5: データ変換ライブラリ
```typescript
// data-transform-library.ts

// 1. マッピング関数群
class DataTransformer {
  static map<T, U>(array: T[], transform: (item: T, index: number) => U): U[] {
    return array.map(transform);
  }

  static filter<T>(array: T[], predicate: (item: T, index: number) => boolean): T[] {
    return array.filter(predicate);
  }

  static reduce<T, U>(
    array: T[],
    reducer: (acc: U, current: T, index: number) => U,
    initialValue: U
  ): U {
    return array.reduce(reducer, initialValue);
  }

  static groupBy<T, K extends string | number | symbol>(
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

  static unique<T>(array: T[], keySelector?: (item: T) => any): T[] {
    if (!keySelector) {
      return [...new Set(array)];
    }

    const seen = new Set();
    return array.filter(item => {
      const key = keySelector(item);
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }
}

// 使用例
interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
}

const products: Product[] = [
  { id: 1, name: "Laptop", category: "Electronics", price: 1000 },
  { id: 2, name: "Mouse", category: "Electronics", price: 25 },
  { id: 3, name: "Book", category: "Education", price: 15 },
  { id: 4, name: "Keyboard", category: "Electronics", price: 75 }
];

// カテゴリ別にグループ化
const groupedByCategory = DataTransformer.groupBy(products, p => p.category);
console.log(groupedByCategory);

// 価格でフィルタリング
const expensiveProducts = DataTransformer.filter(products, p => p.price > 50);
console.log(expensiveProducts);

// 名前のリストに変換
const productNames = DataTransformer.map(products, p => p.name);
console.log(productNames);
```

### ステップ6: バリデーションライブラリ
```typescript
// validation-library.ts

// バリデーション結果の型
type ValidationResult<T> = {
  isValid: boolean;
  value?: T;
  errors: string[];
};

// バリデータの基底クラス
abstract class Validator<T> {
  abstract validate(value: unknown): ValidationResult<T>;

  and<U>(other: Validator<U>): Validator<T & U> {
    return new AndValidator(this, other);
  }

  or<U>(other: Validator<U>): Validator<T | U> {
    return new OrValidator(this, other);
  }
}

// 文字列バリデータ
class StringValidator extends Validator<string> {
  private minLength?: number;
  private maxLength?: number;
  private pattern?: RegExp;

  min(length: number): StringValidator {
    this.minLength = length;
    return this;
  }

  max(length: number): StringValidator {
    this.maxLength = length;
    return this;
  }

  matches(pattern: RegExp): StringValidator {
    this.pattern = pattern;
    return this;
  }

  validate(value: unknown): ValidationResult<string> {
    const errors: string[] = [];

    if (typeof value !== 'string') {
      return { isValid: false, errors: ['Value must be a string'] };
    }

    if (this.minLength !== undefined && value.length < this.minLength) {
      errors.push(`String must be at least ${this.minLength} characters`);
    }

    if (this.maxLength !== undefined && value.length > this.maxLength) {
      errors.push(`String must be at most ${this.maxLength} characters`);
    }

    if (this.pattern && !this.pattern.test(value)) {
      errors.push('String does not match required pattern');
    }

    return {
      isValid: errors.length === 0,
      value: errors.length === 0 ? value : undefined,
      errors
    };
  }
}

// 数値バリデータ
class NumberValidator extends Validator<number> {
  private minValue?: number;
  private maxValue?: number;

  min(value: number): NumberValidator {
    this.minValue = value;
    return this;
  }

  max(value: number): NumberValidator {
    this.maxValue = value;
    return this;
  }

  validate(value: unknown): ValidationResult<number> {
    const errors: string[] = [];

    if (typeof value !== 'number' || isNaN(value)) {
      return { isValid: false, errors: ['Value must be a number'] };
    }

    if (this.minValue !== undefined && value < this.minValue) {
      errors.push(`Number must be at least ${this.minValue}`);
    }

    if (this.maxValue !== undefined && value > this.maxValue) {
      errors.push(`Number must be at most ${this.maxValue}`);
    }

    return {
      isValid: errors.length === 0,
      value: errors.length === 0 ? value : undefined,
      errors
    };
  }
}

// オブジェクトバリデータ
class ObjectValidator<T extends Record<string, any>> extends Validator<T> {
  private schema: { [K in keyof T]: Validator<T[K]> };

  constructor(schema: { [K in keyof T]: Validator<T[K]> }) {
    super();
    this.schema = schema;
  }

  validate(value: unknown): ValidationResult<T> {
    if (!value || typeof value !== 'object') {
      return { isValid: false, errors: ['Value must be an object'] };
    }

    const obj = value as Record<string, any>;
    const result: Partial<T> = {};
    const errors: string[] = [];

    for (const key in this.schema) {
      const validator = this.schema[key];
      const fieldResult = validator.validate(obj[key]);

      if (fieldResult.isValid && fieldResult.value !== undefined) {
        result[key] = fieldResult.value;
      } else {
        errors.push(...fieldResult.errors.map(err => `${key}: ${err}`));
      }
    }

    return {
      isValid: errors.length === 0,
      value: errors.length === 0 ? result as T : undefined,
      errors
    };
  }
}

// And バリデータ
class AndValidator<T, U> extends Validator<T & U> {
  constructor(private first: Validator<T>, private second: Validator<U>) {
    super();
  }

  validate(value: unknown): ValidationResult<T & U> {
    const firstResult = this.first.validate(value);
    const secondResult = this.second.validate(value);

    const errors = [...firstResult.errors, ...secondResult.errors];

    return {
      isValid: firstResult.isValid && secondResult.isValid,
      value: errors.length === 0 ? { ...firstResult.value, ...secondResult.value } as T & U : undefined,
      errors
    };
  }
}

// Or バリデータ
class OrValidator<T, U> extends Validator<T | U> {
  constructor(private first: Validator<T>, private second: Validator<U>) {
    super();
  }

  validate(value: unknown): ValidationResult<T | U> {
    const firstResult = this.first.validate(value);
    if (firstResult.isValid) {
      return firstResult;
    }

    const secondResult = this.second.validate(value);
    if (secondResult.isValid) {
      return secondResult;
    }

    return {
      isValid: false,
      errors: [...firstResult.errors, ...secondResult.errors]
    };
  }
}

// ファクトリー関数
const V = {
  string: () => new StringValidator(),
  number: () => new NumberValidator(),
  object: <T extends Record<string, any>>(schema: { [K in keyof T]: Validator<T[K]> }) =>
    new ObjectValidator(schema)
};

// 使用例
interface User {
  name: string;
  email: string;
  age: number;
}

const userValidator = V.object<User>({
  name: V.string().min(2).max(50),
  email: V.string().matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
  age: V.number().min(0).max(120)
});

const userData = {
  name: "Alice",
  email: "alice@example.com",
  age: 30
};

const result = userValidator.validate(userData);
console.log(result);
```

---

## 高度なジェネリクスパターン

### ステップ7: 型安全なイベントシステム
```typescript
// event-system.ts

// イベント型の定義
interface EventMap {
  'user:created': { id: number; name: string; email: string };
  'user:updated': { id: number; changes: Partial<{ name: string; email: string }> };
  'user:deleted': { id: number };
  'order:placed': { orderId: string; userId: number; total: number };
  'order:shipped': { orderId: string; trackingNumber: string };
}

// イベントエミッター
class TypedEventEmitter<TEventMap extends Record<string, any>> {
  private listeners: {
    [K in keyof TEventMap]?: Array<(data: TEventMap[K]) => void>;
  } = {};

  on<K extends keyof TEventMap>(
    event: K,
    listener: (data: TEventMap[K]) => void
  ): void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event]!.push(listener);
  }

  off<K extends keyof TEventMap>(
    event: K,
    listener: (data: TEventMap[K]) => void
  ): void {
    const eventListeners = this.listeners[event];
    if (eventListeners) {
      const index = eventListeners.indexOf(listener);
      if (index > -1) {
        eventListeners.splice(index, 1);
      }
    }
  }

  emit<K extends keyof TEventMap>(event: K, data: TEventMap[K]): void {
    const eventListeners = this.listeners[event];
    if (eventListeners) {
      eventListeners.forEach(listener => listener(data));
    }
  }

  once<K extends keyof TEventMap>(
    event: K,
    listener: (data: TEventMap[K]) => void
  ): void {
    const onceListener = (data: TEventMap[K]) => {
      listener(data);
      this.off(event, onceListener);
    };
    this.on(event, onceListener);
  }
}

// 使用例
const eventEmitter = new TypedEventEmitter<EventMap>();

// 型安全なイベントリスナー
eventEmitter.on('user:created', (data) => {
  console.log(`User created: ${data.name} (${data.email})`);
});

eventEmitter.on('order:placed', (data) => {
  console.log(`Order placed: ${data.orderId} for user ${data.userId}`);
});

// 型安全なイベント発火
eventEmitter.emit('user:created', {
  id: 1,
  name: 'Alice',
  email: 'alice@example.com'
});

eventEmitter.emit('order:placed', {
  orderId: 'ORD-001',
  userId: 1,
  total: 99.99
});
```

### ステップ8: 型安全なAPIクライアント
```typescript
// api-client.ts

// API エンドポイントの定義
interface ApiEndpoints {
  'GET /users': {
    params: { page?: number; limit?: number };
    response: { users: User[]; total: number };
  };
  'GET /users/:id': {
    params: { id: number };
    response: User;
  };
  'POST /users': {
    body: { name: string; email: string };
    response: User;
  };
  'PUT /users/:id': {
    params: { id: number };
    body: Partial<{ name: string; email: string }>;
    response: User;
  };
  'DELETE /users/:id': {
    params: { id: number };
    response: { success: boolean };
  };
}

// HTTP メソッドの抽出
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

// エンドポイントからメソッドとパスを分離
type ExtractMethod<T extends string> = T extends `${infer M} ${string}` ? M : never;
type ExtractPath<T extends string> = T extends `${string} ${infer P}` ? P : never;

// パラメータの抽出
type ExtractParams<T extends string> = T extends `${string}:${infer Param}/${infer Rest}`
  ? { [K in Param]: string | number } & ExtractParams<Rest>
  : T extends `${string}:${infer Param}`
  ? { [K in Param]: string | number }
  : {};

// API クライアント
class TypedApiClient<TEndpoints extends Record<string, any>> {
  constructor(private baseUrl: string) {}

  async request<K extends keyof TEndpoints>(
    endpoint: K,
    options: TEndpoints[K] extends { params: infer P }
      ? TEndpoints[K] extends { body: infer B }
        ? { params: P; body: B }
        : { params: P }
      : TEndpoints[K] extends { body: infer B }
      ? { body: B }
      : {}
  ): Promise<TEndpoints[K] extends { response: infer R } ? R : never> {
    const [method, path] = (endpoint as string).split(' ');
    
    // パラメータをパスに埋め込み
    let url = path;
    if ('params' in options) {
      const params = options.params as Record<string, any>;
      for (const [key, value] of Object.entries(params)) {
        url = url.replace(`:${key}`, String(value));
      }
    }

    const requestOptions: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if ('body' in options) {
      requestOptions.body = JSON.stringify(options.body);
    }

    const response = await fetch(`${this.baseUrl}${url}`, requestOptions);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }
}

// 使用例
const apiClient = new TypedApiClient<ApiEndpoints>('https://api.example.com');

async function example() {
  // 型安全なAPI呼び出し
  const users = await apiClient.request('GET /users', {
    params: { page: 1, limit: 10 }
  });

  const user = await apiClient.request('GET /users/:id', {
    params: { id: 1 }
  });

  const newUser = await apiClient.request('POST /users', {
    body: { name: 'Alice', email: 'alice@example.com' }
  });

  const updatedUser = await apiClient.request('PUT /users/:id', {
    params: { id: 1 },
    body: { name: 'Alice Smith' }
  });
}
```

---

## 🎯 実行とテストの方法

### 基本的な実行方法
```bash
# TypeScriptファイルを直接実行
npx ts-node filename.ts

# コンパイルしてから実行
npx tsc filename.ts
node filename.js
```

### テストの作成
```typescript
// generics.test.ts
import { Stack, Queue, DataTransformer } from './generics-examples';

describe('Generic Data Structures', () => {
  test('Stack operations', () => {
    const stack = new Stack<number>();
    stack.push(1);
    stack.push(2);
    
    expect(stack.pop()).toBe(2);
    expect(stack.peek()).toBe(1);
    expect(stack.size()).toBe(1);
  });

  test('Queue operations', () => {
    const queue = new Queue<string>();
    queue.enqueue('first');
    queue.enqueue('second');
    
    expect(queue.dequeue()).toBe('first');
    expect(queue.front()).toBe('second');
  });
});
```

---

## 📚 学習の進め方

1. **基本から応用へ**: 簡単なジェネリック関数から複雑なライブラリまで段階的に学習
2. **実際に動かす**: コードをコピーして実際に実行してみる
3. **型エラーを体験**: 意図的に型エラーを発生させてジェネリクスの効果を実感
4. **ライブラリ設計**: 再利用可能なジェネリックライブラリの設計を練習
5. **他言語との比較**: Java、C#、Rustなどのジェネリクスと比較して理解を深める

---

**📌 重要**: ジェネリクスは TypeScript の最も強力な機能の一つです。これらのコード例を通じて、型安全で再利用可能なコードの書き方を身につけてください。