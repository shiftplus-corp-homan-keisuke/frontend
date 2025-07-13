# Step05 トラブルシューティング

> 💡 **このファイルについて**: 高階関数・ジェネリクスでよくあるエラーと解決方法をまとめたガイドです。

## 📋 目次
1. [高階関数関連エラー](#高階関数関連エラー)
2. [コールバック関数エラー](#コールバック関数エラー)
3. [クロージャ関連問題](#クロージャ関連問題)
4. [ジェネリクス基本エラー](#ジェネリクス基本エラー)
5. [型制約関連エラー](#型制約関連エラー)
6. [型推論関連エラー](#型推論関連エラー)
7. [高度なジェネリクスエラー](#高度なジェネリクスエラー)
8. [パフォーマンス関連問題](#パフォーマンス関連問題)
## 高階関数関連エラー

### "This expression is not callable"
**原因**: 関数として呼び出そうとしているものが実際には関数ではない

**エラー例**:
```typescript
function createMultiplier(factor: number) {
  return (x: number) => x * factor;
}

const multiplier = createMultiplier; // 関数を呼び出していない
const result = multiplier(5); // Error: This expression is not callable
```

**解決方法**:
```typescript
// 解決方法1: 関数を正しく呼び出す
const multiplier = createMultiplier(2); // 関数を呼び出して戻り値を取得
const result = multiplier(5); // OK: 10

// 解決方法2: 型注釈で明確にする
const multiplier: (x: number) => number = createMultiplier(2);
const result = multiplier(5); // OK
```

### "Cannot invoke an expression whose type lacks a call signature"
**原因**: 呼び出し可能でない型に対して関数呼び出しを試みている

**エラー例**:
```typescript
function processCallback(callback: any) {
  return callback(5); // Error: Cannot invoke an expression whose type lacks a call signature
}
```

**解決方法**:
```typescript
// 解決方法1: 適切な関数型を指定
function processCallback(callback: (value: number) => number) {
  return callback(5); // OK
}

// 解決方法2: 型ガードを使用
function processCallback(callback: any) {
  if (typeof callback === 'function') {
    return callback(5); // OK
  }
  throw new Error('Callback must be a function');
}

// 解決方法3: ジェネリクスを使用
function processCallback<T>(
  callback: (value: number) => T
): T {
  return callback(5); // OK
}
```

### "Argument of type 'X' is not assignable to parameter of type 'Y'"
**原因**: 高階関数に渡すコールバック関数の型が期待される型と一致しない

**エラー例**:
```typescript
function map<T, U>(array: T[], callback: (item: T) => U): U[] {
  return array.map(callback);
}

const numbers = [1, 2, 3];
const result = map(numbers, (item: string) => item.length); 
// Error: Argument of type '(item: string) => number' is not assignable to parameter of type '(item: number) => unknown'
```

**解決方法**:
```typescript
// 解決方法1: コールバック関数の型を修正
const result = map(numbers, (item: number) => item * 2); // OK

// 解決方法2: 型推論を活用
const result = map(numbers, (item) => item * 2); // OK: itemはnumber型として推論

// 解決方法3: 明示的な型指定
const result = map<number, number>(numbers, (item) => item * 2); // OK
```

---

## コールバック関数エラー

### "Property 'X' does not exist on type 'Y'"
**原因**: コールバック関数内で存在しないプロパティにアクセスしようとしている

**エラー例**:
```typescript
interface User {
  id: number;
  name: string;
}

function processUsers(users: User[], callback: (user: any) => void) {
  users.forEach(callback);
}

processUsers(users, (user) => {
  console.log(user.email); // Error: Property 'email' does not exist on type 'any'
});
```

**解決方法**:
```typescript
// 解決方法1: 適切な型を指定
function processUsers(users: User[], callback: (user: User) => void) {
  users.forEach(callback);
}

processUsers(users, (user) => {
  console.log(user.name); // OK
  // console.log(user.email); // Error: Property 'email' does not exist on type 'User'
});

// 解決方法2: 型ガードを使用
processUsers(users, (user) => {
  if ('email' in user) {
    console.log(user.email); // OK
  }
});

// 解決方法3: インターフェースを拡張
interface UserWithEmail extends User {
  email?: string;
}

function processUsersWithEmail(
  users: UserWithEmail[], 
  callback: (user: UserWithEmail) => void
) {
  users.forEach(callback);
}
```

### "Type 'void' is not assignable to type 'T'"
**原因**: 戻り値を期待している高階関数に、戻り値のないコールバックを渡している

**エラー例**:
```typescript
function transform<T, U>(array: T[], callback: (item: T) => U): U[] {
  return array.map(callback);
}

const numbers = [1, 2, 3];
const result = transform(numbers, (item) => {
  console.log(item); // 戻り値なし（void）
}); // Error: Type 'void' is not assignable to type 'unknown'
```

**解決方法**:
```typescript
// 解決方法1: 戻り値を明示的に返す
const result = transform(numbers, (item) => {
  console.log(item);
  return item * 2; // 戻り値を追加
});

// 解決方法2: 副作用のみの処理には forEach を使用
numbers.forEach((item) => {
  console.log(item); // OK: forEachは戻り値を期待しない
});

// 解決方法3: 戻り値の型を明示
const result = transform(numbers, (item): number => {
  console.log(item);
  return item * 2;
});
```

---

## クロージャ関連問題

### メモリリークの問題
**原因**: クロージャが不要な参照を保持し続けている

**問題のあるコード**:
```typescript
function createEventHandler() {
  const largeData = new Array(1000000).fill('data'); // 大きなデータ
  
  return function(event: Event) {
    // largeDataを使用していないが、クロージャで参照が保持される
    console.log('Event handled');
  };
}

// 多数のイベントハンドラーを作成すると、largeDataがメモリに残り続ける
const handlers = Array.from({ length: 100 }, () => createEventHandler());
```

**解決方法**:
```typescript
// 解決方法1: 必要な部分のみを抽出
function createEventHandler() {
  const largeData = new Array(1000000).fill('data');
  const necessaryData = largeData.slice(0, 10); // 必要な部分のみ
  
  return function(event: Event) {
    console.log('Event handled with', necessaryData.length);
  };
}

// 解決方法2: WeakMapを使用
const handlerData = new WeakMap();

function createEventHandler() {
  const handler = function(event: Event) {
    const data = handlerData.get(handler);
    console.log('Event handled');
  };
  
  handlerData.set(handler, { /* 必要なデータ */ });
  return handler;
}

// 解決方法3: 明示的なクリーンアップ
function createEventHandler() {
  let largeData: any[] | null = new Array(1000000).fill('data');
  
  const handler = function(event: Event) {
    console.log('Event handled');
  };
  
  // クリーンアップ関数を提供
  handler.cleanup = () => {
    largeData = null;
  };
  
  return handler;
}
```

### "Cannot read property 'X' of undefined"
**原因**: クロージャ内で外部変数が予期しないタイミングで変更されている

**エラー例**:
```typescript
function createCounters() {
  const counters = [];
  
  for (var i = 0; i < 3; i++) {
    counters.push(() => {
      console.log(i); // すべて3を出力（期待値: 0, 1, 2）
    });
  }
  
  return counters;
}

const counters = createCounters();
counters.forEach(counter => counter()); // 3, 3, 3
```

**解決方法**:
```typescript
// 解決方法1: letを使用
function createCounters() {
  const counters = [];
  
  for (let i = 0; i < 3; i++) { // varをletに変更
    counters.push(() => {
      console.log(i); // 0, 1, 2を正しく出力
    });
  }
  
  return counters;
}

// 解決方法2: IIFE（即座に実行される関数式）を使用
function createCounters() {
  const counters = [];
  
  for (var i = 0; i < 3; i++) {
    counters.push(((index) => {
      return () => {
        console.log(index);
      };
    })(i));
  }
  
  return counters;
}

// 解決方法3: bindを使用
function createCounters() {
  const counters = [];
  
  for (var i = 0; i < 3; i++) {
    counters.push(function(index) {
      console.log(index);
    }.bind(null, i));
  }
  
  return counters;
}
```

### 型推論の問題
**原因**: クロージャ内での型推論が期待通りに動作しない

**エラー例**:
```typescript
function createProcessor<T>(initialValue: T) {
  let value = initialValue;
  
  return {
    process: (fn) => { // Error: Parameter 'fn' implicitly has an 'any' type
      value = fn(value);
      return value;
    },
    getValue: () => value
  };
}
```

**解決方法**:
```typescript
// 解決方法1: 明示的な型注釈
function createProcessor<T>(initialValue: T) {
  let value = initialValue;
  
  return {
    process: (fn: (val: T) => T) => {
      value = fn(value);
      return value;
    },
    getValue: () => value
  };
}

// 解決方法2: インターフェースを定義
interface Processor<T> {
  process: (fn: (val: T) => T) => T;
  getValue: () => T;
}

function createProcessor<T>(initialValue: T): Processor<T> {
  let value = initialValue;
  
  return {
    process: (fn) => {
      value = fn(value);
      return value;
    },
    getValue: () => value
  };
}

// 解決方法3: 型アサーションを使用（推奨されない）
function createProcessor<T>(initialValue: T) {
  let value = initialValue;
  
  return {
    process: (fn: any) => {
      value = fn(value);
      return value;
    },
    getValue: () => value
  } as {
    process: (fn: (val: T) => T) => T;
    getValue: () => T;
  };
}
```

---


---

## ジェネリクス基本エラー

### "Generic type 'T' requires 1 type argument(s)"
**原因**: ジェネリック型を使用する際に型引数を指定していない

**エラー例**:
```typescript
class Box<T> {
  value: T;
  constructor(value: T) {
    this.value = value;
  }
}

const box = new Box(); // Error: Generic type 'Box<T>' requires 1 type argument(s)
```

**解決方法**:
```typescript
// 解決方法1: 明示的に型を指定
const box = new Box<string>("hello");

// 解決方法2: 型推論を活用
const box = new Box("hello"); // string型として推論

// 解決方法3: デフォルト型パラメータを使用
class Box<T = any> {
  value: T;
  constructor(value: T) {
    this.value = value;
  }
}

const box = new Box(); // T = any として扱われる
```

### "Type 'T' is not assignable to type 'U'"
**原因**: ジェネリック型パラメータ間の型の不一致

**エラー例**:
```typescript
function convert<T, U>(value: T): U {
  return value; // Error: Type 'T' is not assignable to type 'U'
}
```

**解決方法**:
```typescript
// 解決方法1: 型アサーションを使用（注意して使用）
function convert<T, U>(value: T): U {
  return value as unknown as U;
}

// 解決方法2: 制約を追加
function convert<T extends U, U>(value: T): U {
  return value; // OK
}

// 解決方法3: 変換関数を受け取る
function convert<T, U>(value: T, converter: (value: T) => U): U {
  return converter(value);
}

// 使用例
const result = convert("123", (str) => parseInt(str, 10));
```

---

## 型制約関連エラー

### "Argument of type 'X' is not assignable to parameter of type 'T extends Y'"
**原因**: 型制約を満たさない型を渡している

**エラー例**:
```typescript
interface Lengthwise {
  length: number;
}

function logLength<T extends Lengthwise>(arg: T): T {
  console.log(arg.length);
  return arg;
}

logLength(123); // Error: Argument of type 'number' is not assignable
```

**解決方法**:
```typescript
// 解決方法1: 制約を満たす型を渡す
logLength("hello"); // OK: string has length
logLength([1, 2, 3]); // OK: array has length
logLength({ length: 10, value: "test" }); // OK: object has length

// 解決方法2: 型ガードを使用
function logLengthSafe<T>(arg: T): T {
  if (typeof arg === 'object' && arg !== null && 'length' in arg) {
    console.log((arg as any).length);
  }
  return arg;
}

// 解決方法3: オーバーロードを使用
function logLength(arg: string): string;
function logLength(arg: any[]): any[];
function logLength<T extends Lengthwise>(arg: T): T;
function logLength(arg: any): any {
  if ('length' in arg) {
    console.log(arg.length);
  }
  return arg;
}
```

### "Type 'keyof T' is not assignable to type 'string'"
**原因**: keyof演算子の結果を文字列として扱おうとしている

**エラー例**:
```typescript
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  const keyString: string = key; // Error: Type 'K' is not assignable to type 'string'
  return obj[key];
}
```

**解決方法**:
```typescript
// 解決方法1: string | number | symbol として扱う
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  const keyString: string | number | symbol = key; // OK
  return obj[key];
}

// 解決方法2: 文字列変換を明示的に行う
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  const keyString: string = String(key);
  return obj[key];
}

// 解決方法3: 制約を追加
function getProperty<T, K extends keyof T & string>(obj: T, key: K): T[K] {
  const keyString: string = key; // OK
  return obj[key];
}
```

---

## 型推論関連エラー

### "Type argument could not be inferred"
**原因**: TypeScriptが型を推論できない

**エラー例**:
```typescript
function createArray<T>(): T[] {
  return [];
}

const array = createArray(); // Error: Type argument could not be inferred
```

**解決方法**:
```typescript
// 解決方法1: 明示的に型を指定
const array = createArray<string>();

// 解決方法2: デフォルト型パラメータを使用
function createArray<T = any>(): T[] {
  return [];
}

const array = createArray(); // T = any

// 解決方法3: 初期値から推論させる
function createArray<T>(initialValue: T): T[] {
  return [initialValue];
}

const array = createArray("hello"); // string[]として推論

// 解決方法4: ファクトリー関数パターン
function createArrayFactory<T>() {
  return (): T[] => [];
}

const createStringArray = createArrayFactory<string>();
const array = createStringArray();
```

### "Cannot find name 'T'"
**原因**: ジェネリック型パラメータのスコープ外で使用している

**エラー例**:
```typescript
class Container<T> {
  private value: T;
  
  constructor(value: T) {
    this.value = value;
  }
}

// クラス外でTを使用
function processValue(value: T): void { // Error: Cannot find name 'T'
  console.log(value);
}
```

**解決方法**:
```typescript
// 解決方法1: 関数にもジェネリクスを追加
function processValue<T>(value: T): void {
  console.log(value);
}

// 解決方法2: クラスのメソッドとして定義
class Container<T> {
  private value: T;
  
  constructor(value: T) {
    this.value = value;
  }
  
  processValue(): void {
    console.log(this.value); // Tにアクセス可能
  }
}

// 解決方法3: 型を明示的に渡す
class Container<T> {
  private value: T;
  
  constructor(value: T) {
    this.value = value;
  }
  
  processWithFunction(processor: (value: T) => void): void {
    processor(this.value);
  }
}
```

---

## 高度なジェネリクスエラー

### "Type instantiation is excessively deep and possibly infinite"
**原因**: 再帰的な型定義が深すぎる

**エラー例**:
```typescript
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

// 循環参照のあるオブジェクト
interface Node {
  value: string;
  parent?: Node;
  children: Node[];
}

type ReadonlyNode = DeepReadonly<Node>; // Error: Type instantiation is excessively deep
```

**解決方法**:
```typescript
// 解決方法1: 再帰の深度を制限
type DeepReadonly<T, Depth extends number = 5> = Depth extends 0
  ? T
  : {
      readonly [P in keyof T]: T[P] extends object 
        ? DeepReadonly<T[P], Prev<Depth>>
        : T[P];
    };

type Prev<T extends number> = T extends 5 ? 4
  : T extends 4 ? 3
  : T extends 3 ? 2
  : T extends 2 ? 1
  : T extends 1 ? 0
  : never;

// 解決方法2: 特定の型を除外
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends Function
    ? T[P]
    : T[P] extends object
    ? DeepReadonly<T[P]>
    : T[P];
};

// 解決方法3: 段階的なアプローチ
type Readonly1<T> = { readonly [P in keyof T]: T[P] };
type Readonly2<T> = { readonly [P in keyof T]: Readonly1<T[P]> };
type Readonly3<T> = { readonly [P in keyof T]: Readonly2<T[P]> };
```

### "Conditional type 'T extends U ? X : Y' was not distributive"
**原因**: 条件型の分散が期待通りに動作しない

**エラー例**:
```typescript
type ToArray<T> = T extends any ? T[] : never;

// 期待: string[] | number[]
// 実際: (string | number)[]
type Result = ToArray<string | number>;
```

**解決方法**:
```typescript
// 解決方法1: 分散条件型を明示的に使用
type ToArray<T> = T extends any ? T[] : never;

// 正しく分散される
type Result = ToArray<string | number>; // string[] | number[]

// 解決方法2: 非分散にしたい場合
type ToArrayNonDistributive<T> = [T] extends [any] ? T[] : never;

type Result2 = ToArrayNonDistributive<string | number>; // (string | number)[]

// 解決方法3: ユーティリティ型を使用
type Distribute<T> = T extends any ? T : never;
type ToArrayDistributive<T> = Distribute<T> extends infer U ? U[] : never;
```

---

## パフォーマンス関連問題

### "TypeScript compilation is slow with complex generics"
**原因**: 複雑なジェネリック型による型チェックの遅延

**問題のあるコード**:
```typescript
// 非常に複雑なジェネリック型
type ComplexType<T> = T extends Record<string, any>
  ? {
      [K in keyof T]: T[K] extends Record<string, any>
        ? ComplexType<T[K]>
        : T[K] extends any[]
        ? ComplexType<T[K][number]>[]
        : T[K];
    }
  : T;

// 大量の型操作
type MassiveUnion = ComplexType<Type1> | ComplexType<Type2> | /* ... 100個以上 */;
```

**解決方法**:
```typescript
// 解決方法1: 型を簡素化
type SimpleType<T> = T extends Record<string, any>
  ? { [K in keyof T]: T[K] }
  : T;

// 解決方法2: 段階的な型定義
type Step1<T> = { [K in keyof T]: T[K] };
type Step2<T> = T extends Record<string, any> ? Step1<T> : T;
type FinalType<T> = Step2<T>;

// 解決方法3: 型エイリアスを活用
type BaseType = Record<string, any>;
type ProcessedType<T extends BaseType> = {
  [K in keyof T]: T[K];
};

// 解決方法4: コンパイラオプションの調整
// tsconfig.json
{
  "compilerOptions": {
    "skipLibCheck": true,
    "incremental": true,
    "tsBuildInfoFile": ".tsbuildinfo"
  }
}
```

### "Memory usage is high during compilation"
**原因**: 大量のジェネリック型インスタンス化

**解決方法**:
```typescript
// 解決方法1: 型の再利用
type CachedType<T> = T extends string ? string : T extends number ? number : T;

// 型キャッシュの活用
const typeCache = new Map<string, any>();

// 解決方法2: 条件型の最適化
type OptimizedType<T> = T extends string
  ? string
  : T extends number
  ? number
  : T extends boolean
  ? boolean
  : T;

// 解決方法3: バッチ処理
type ProcessBatch<T extends readonly any[]> = {
  [K in keyof T]: ProcessSingle<T[K]>;
};

type ProcessSingle<T> = T extends any ? Processed<T> : never;
```

---

## 🚨 緊急時の対処法

### 型エラーが大量に発生した場合
```typescript
// 一時的にany型を使用（本番では推奨されない）
function temporaryFix<T = any>(value: T): T {
  return value;
}

// 段階的に型を追加
type PartialGeneric<T> = Partial<T>; // 一部の型のみ
// 後で完全なジェネリック型に拡張
```

### コンパイル時間が長すぎる場合
```typescript
// 型チェックを一時的に無効化
// @ts-nocheck

// または特定の行のみ無効化
// @ts-ignore
const result = complexGenericOperation();

// skipLibCheckを有効化（tsconfig.json）
{
  "compilerOptions": {
    "skipLibCheck": true
  }
}
```

---

## 📚 デバッグのコツ

### 1. 型情報の確認
```typescript
// 型を確認するヘルパー
type TypeOf<T> = T;

// 使用例
type GenericType<T> = TypeOf<T[]>; // T[]を確認

// コンパイラに型を表示させる
const value: string | number = getValue();
// value. と入力してIDEで型情報を確認
```

### 2. 段階的な型構築
```typescript
// 複雑な型を段階的に構築
type Step1<T> = T extends any ? T : never;
type Step2<T> = Step1<T>[];
type Step3<T> = Step2<T> | null;

// 各ステップで型を確認
type Test1 = Step1<string>; // string
type Test2 = Step2<string>; // string[]
type Test3 = Step3<string>; // string[] | null
```

### 3. 型の互換性テスト
```typescript
// 型の互換性をテスト
type IsAssignable<T, U> = T extends U ? true : false;

type Test1 = IsAssignable<string, string | number>; // true
type Test2 = IsAssignable<string | number, string>; // false
```

---

## 📚 参考リンク

- [TypeScript Handbook - Generics](https://www.typescriptlang.org/docs/handbook/generics.html)
- [TypeScript Performance](https://github.com/microsoft/TypeScript/wiki/Performance)
- [TypeScript FAQ](https://github.com/Microsoft/TypeScript/wiki/FAQ)

---

**📌 重要**: ジェネリクスは強力な機能ですが、複雑になりすぎないよう注意が必要です。段階的に学習し、実際のプロジェクトで経験を積むことが重要です。