# Step02 トラブルシューティング

> 💡 **このファイルについて**: Step02の型システムと型注釈学習でよくあるエラーと解決方法をまとめたガイドです。

## 📋 目次
1. [型エラーの基本的な読み方](#型エラーの基本的な読み方)
2. [プリミティブ型関連のエラー](#プリミティブ型関連のエラー)
3. [配列・タプル関連のエラー](#配列タプル関連のエラー)
4. [関数型関連のエラー](#関数型関連のエラー)
5. [型推論関連の問題](#型推論関連の問題)
6. [デバッグのコツ](#デバッグのコツ)

---

## 型エラーの基本的な読み方

### TypeScriptエラーメッセージの構造
```
error TS2322: Type 'string' is not assignable to type 'number'.
```

**構成要素**:
- `error`: エラーレベル
- `TS2322`: エラーコード（重要な識別子）
- `Type 'string' is not assignable to type 'number'`: エラーメッセージ

### よくあるエラーコードと意味

#### TS2322: Type Assignment Error
**意味**: 型の代入エラー
```typescript
// 問題のあるコード
let age: number = "25"; // Error: Type 'string' is not assignable to type 'number'

// 解決方法
let age: number = 25; // OK
let age: number = parseInt("25", 10); // OK
let age: string | number = "25"; // OK（ユニオン型を使用）
```

#### TS2339: Property does not exist
**意味**: プロパティが存在しない
```typescript
// 問題のあるコード
const user = { name: "Alice" };
console.log(user.age); // Error: Property 'age' does not exist

// 解決方法1: 型定義を修正
interface User {
  name: string;
  age?: number; // オプショナルプロパティ
}
const user: User = { name: "Alice" };
console.log(user.age); // OK（undefinedの可能性あり）

// 解決方法2: 型ガードを使用
if ('age' in user) {
  console.log(user.age);
}

// 解決方法3: オプショナルチェーン
console.log((user as any).age); // 型安全性は失われる
```

#### TS2345: Argument type mismatch
**意味**: 引数の型が一致しない
```typescript
// 問題のあるコード
function greet(name: string): string {
  return `Hello, ${name}!`;
}
greet(123); // Error: Argument of type 'number' is not assignable to parameter of type 'string'

// 解決方法
greet("Alice"); // OK
greet(String(123)); // OK
greet(`${123}`); // OK
```

---

## プリミティブ型関連のエラー

### 暗黙的型変換の問題
**症状**: JavaScriptでは動作するが、TypeScriptでエラーになる

```typescript
// 問題のあるコード
function add(a: number, b: number): number {
  return a + b;
}

add("5", "3"); // Error: Argument of type 'string' is not assignable to parameter of type 'number'

// 解決方法1: 明示的な型変換
add(Number("5"), Number("3")); // OK
add(parseInt("5", 10), parseInt("3", 10)); // OK

// 解決方法2: 関数のオーバーロード
function add(a: number, b: number): number;
function add(a: string, b: string): number;
function add(a: number | string, b: number | string): number {
  return Number(a) + Number(b);
}

add(5, 3); // OK
add("5", "3"); // OK
```

### null/undefined関連のエラー
**症状**: strictNullChecksが有効な場合のエラー

```typescript
// 問題のあるコード
function processName(name: string): string {
  return name.toUpperCase(); // 潜在的な問題
}

let userName: string | null = null;
processName(userName); // Error: Argument of type 'string | null' is not assignable to parameter of type 'string'

// 解決方法1: null チェック
if (userName !== null) {
  processName(userName); // OK
}

// 解決方法2: Non-null assertion operator（!）
processName(userName!); // 注意: userNameがnullでないことが確実な場合のみ

// 解決方法3: nullish coalescing
processName(userName ?? "Default Name"); // OK

// 解決方法4: オプショナルチェーンと組み合わせ
function processUser(user: { name?: string } | null) {
  return user?.name?.toUpperCase() ?? "Unknown";
}
```

### リテラル型の制約エラー
**症状**: リテラル型の値以外を代入しようとした場合

```typescript
// 問題のあるコード
type Status = "pending" | "approved" | "rejected";
let currentStatus: Status = "processing"; // Error: Type '"processing"' is not assignable to type 'Status'

// 解決方法1: 正しい値を使用
let currentStatus: Status = "pending"; // OK

// 解決方法2: 型定義を拡張
type Status = "pending" | "approved" | "rejected" | "processing";

// 解決方法3: const assertionを使用
const statusValues = ["pending", "approved", "rejected"] as const;
type Status = typeof statusValues[number];

// 解決方法4: 動的な値の場合は型ガード
function isValidStatus(value: string): value is Status {
  return ["pending", "approved", "rejected"].includes(value);
}

const userInput = "pending";
if (isValidStatus(userInput)) {
  let currentStatus: Status = userInput; // OK
}
```

---

## 配列・タプル関連のエラー

### 配列の型不一致エラー
**症状**: 配列の要素型が期待される型と異なる

```typescript
// 問題のあるコード
let numbers: number[] = [1, 2, "3", 4]; // Error: Type 'string' is not assignable to type 'number'

// 解決方法1: 正しい型の値を使用
let numbers: number[] = [1, 2, 3, 4]; // OK

// 解決方法2: ユニオン型を使用
let mixed: (number | string)[] = [1, 2, "3", 4]; // OK

// 解決方法3: 型変換を行う
let stringNumbers = ["1", "2", "3", "4"];
let numbers: number[] = stringNumbers.map(s => parseInt(s, 10)); // OK

// 解決方法4: 型ガードでフィルタリング
function isNumber(value: unknown): value is number {
  return typeof value === "number";
}

let mixedArray: unknown[] = [1, "2", 3, "4"];
let numbers: number[] = mixedArray.filter(isNumber); // OK
```

### タプルの長さ・型エラー
**症状**: タプルの要素数や型が定義と異なる

```typescript
// 問題のあるコード
type Coordinate = [number, number];
let point: Coordinate = [10, 20, 30]; // Error: Type '[number, number, number]' is not assignable to type '[number, number]'

// 解決方法1: 正しい要素数にする
let point: Coordinate = [10, 20]; // OK

// 解決方法2: 3D座標用の型を定義
type Coordinate3D = [number, number, number];
let point3D: Coordinate3D = [10, 20, 30]; // OK

// 解決方法3: 残余要素を使用
type FlexibleCoordinate = [number, number, ...number[]];
let flexPoint: FlexibleCoordinate = [10, 20, 30]; // OK

// タプルの型エラー
type PersonInfo = [string, number, boolean];
let person: PersonInfo = ["Alice", "30", true]; // Error: Type 'string' is not assignable to type 'number'

// 解決方法
let person: PersonInfo = ["Alice", 30, true]; // OK
```

### 読み取り専用配列の変更エラー
**症状**: readonly配列を変更しようとした場合

```typescript
// 問題のあるコード
let readonlyNumbers: readonly number[] = [1, 2, 3];
readonlyNumbers.push(4); // Error: Property 'push' does not exist on type 'readonly number[]'

// 解決方法1: 新しい配列を作成
readonlyNumbers = [...readonlyNumbers, 4]; // OK

// 解決方法2: 通常の配列として扱う（型安全性は失われる）
(readonlyNumbers as number[]).push(4); // 推奨されない

// 解決方法3: 変更可能な配列を使用
let mutableNumbers: number[] = [1, 2, 3];
mutableNumbers.push(4); // OK

// 解決方法4: 関数型アプローチ
function addToArray<T>(arr: readonly T[], item: T): T[] {
  return [...arr, item];
}

readonlyNumbers = addToArray(readonlyNumbers, 4); // OK
```

---

## 関数型関連のエラー

### 関数の引数・戻り値型エラー
**症状**: 関数の型シグネチャが一致しない

```typescript
// 問題のあるコード
function calculate(a: number, b: number): number {
  return `${a + b}`; // Error: Type 'string' is not assignable to type 'number'
}

// 解決方法1: 戻り値の型を修正
function calculate(a: number, b: number): string {
  return `${a + b}`; // OK
}

// 解決方法2: 戻り値を正しい型にする
function calculate(a: number, b: number): number {
  return a + b; // OK
}

// オプショナルパラメータのエラー
function greet(name: string, greeting?: string, punctuation: string = "!"): string {
  // Error: A required parameter cannot follow an optional parameter
  return `${greeting || "Hello"}, ${name}${punctuation}`;
}

// 解決方法: オプショナルパラメータを最後に配置
function greet(name: string, punctuation: string = "!", greeting?: string): string {
  return `${greeting || "Hello"}, ${name}${punctuation}`;
}
```

### 関数オーバーロードのエラー
**症状**: オーバーロードの実装が型シグネチャと一致しない

```typescript
// 問題のあるコード
function format(value: string): string;
function format(value: number): string;
function format(value: boolean): string;
function format(value: string | number): string { // Error: 実装シグネチャがオーバーロードと互換性がない
  return String(value);
}

// 解決方法: 実装シグネチャをすべてのオーバーロードと互換性があるようにする
function format(value: string): string;
function format(value: number): string;
function format(value: boolean): string;
function format(value: string | number | boolean): string {
  return String(value);
}
```

### 高階関数の型エラー
**症状**: 関数を引数として渡す際の型エラー

```typescript
// 問題のあるコード
function applyOperation(numbers: number[], operation: (n: number) => number): number[] {
  return numbers.map(operation);
}

function addOne(n: number): string { // 戻り値の型が異なる
  return `${n + 1}`;
}

applyOperation([1, 2, 3], addOne); // Error: Type '(n: number) => string' is not assignable to type '(n: number) => number'

// 解決方法1: 関数の戻り値型を修正
function addOne(n: number): number {
  return n + 1;
}

// 解決方法2: ジェネリクスを使用して柔軟にする
function applyOperation<T, U>(items: T[], operation: (item: T) => U): U[] {
  return items.map(operation);
}

applyOperation([1, 2, 3], (n: number) => `${n + 1}`); // OK
```

---

## 型推論関連の問題

### 型推論が期待通りにならない場合
**症状**: TypeScriptが期待と異なる型を推論する

```typescript
// 問題のあるコード
let value = null; // any型として推論される
value = "hello";
value = 42; // 型安全性が失われる

// 解決方法1: 明示的な型注釈
let value: string | null = null;
// value = 42; // Error

// 解決方法2: 初期値で型を推論させる
let value = ""; // string型として推論
// value = 42; // Error

// 配列の型推論の問題
let mixedArray = []; // any[]として推論される
mixedArray.push("hello");
mixedArray.push(42); // 型安全性が失われる

// 解決方法: 明示的な型注釈
let mixedArray: (string | number)[] = [];
mixedArray.push("hello"); // OK
mixedArray.push(42); // OK
// mixedArray.push(true); // Error
```

### 文脈的型推論の問題
**症状**: 文脈から型が推論されない場合

```typescript
// 問題のあるコード
const users = [
  { name: "Alice", age: 30 },
  { name: "Bob", age: 25 }
];

const processUser = (user) => { // Error: Parameter 'user' implicitly has an 'any' type
  return user.name.toUpperCase();
};

users.map(processUser);

// 解決方法1: 明示的な型注釈
const processUser = (user: { name: string; age: number }) => {
  return user.name.toUpperCase();
};

// 解決方法2: インライン関数で文脈的型推論を活用
users.map((user) => { // userの型は自動推論される
  return user.name.toUpperCase();
});

// 解決方法3: 型エイリアスを使用
type User = { name: string; age: number };
const processUser = (user: User) => {
  return user.name.toUpperCase();
};
```

### 型の絞り込みが効かない場合
**症状**: 型ガードが期待通りに動作しない

```typescript
// 問題のあるコード
function processValue(value: string | number | null) {
  if (value) { // nullは除外されるが、空文字列や0も除外される
    return value.toUpperCase(); // Error: Property 'toUpperCase' does not exist on type 'string | number'
  }
}

// 解決方法1: より具体的な型ガード
function processValue(value: string | number | null) {
  if (typeof value === "string") {
    return value.toUpperCase(); // OK
  } else if (typeof value === "number") {
    return value.toString();
  }
  return "null";
}

// 解決方法2: カスタム型ガード
function isString(value: unknown): value is string {
  return typeof value === "string";
}

function processValue(value: string | number | null) {
  if (isString(value)) {
    return value.toUpperCase(); // OK
  }
}
```

---

## デバッグのコツ

### 1. 型情報の確認方法
```typescript
// VS Codeでの型確認
// 変数にマウスオーバーすると型情報が表示される

// 型を明示的に確認するヘルパー関数
function checkType<T>(value: T): T {
  console.log("Type:", typeof value, "Value:", value);
  return value;
}

const result = checkType("hello"); // Type: string Value: hello

// TypeScript Playgroundでの確認
// https://www.typescriptlang.org/play で型の動作を確認
```

### 2. 段階的なデバッグ
```typescript
// 複雑な型エラーを段階的に解決
function complexFunction(data: unknown) {
  // ステップ1: 型ガードで基本的な型を確認
  if (typeof data !== "object" || data === null) {
    throw new Error("Data must be an object");
  }
  
  // ステップ2: 必要なプロパティの存在確認
  if (!("name" in data) || typeof data.name !== "string") {
    throw new Error("Data must have a string name property");
  }
  
  // ステップ3: 型アサーションまたは型ガード
  const typedData = data as { name: string; age?: number };
  
  // ステップ4: 安全に処理
  return {
    name: typedData.name.toUpperCase(),
    age: typedData.age ?? 0
  };
}
```

### 3. 型エラーの分離
```typescript
// エラーが発生している部分を分離して確認
function problematicFunction() {
  // 複雑な処理...
  
  // エラーが発生している部分を別関数に分離
  const result = separateFunction(data);
  
  // 残りの処理...
}

function separateFunction(data: SomeType): ReturnType {
  // 問題のある処理のみを分離
  // 型エラーの原因を特定しやすくする
}
```

### 4. TypeScriptコンパイラオプションの活用
```bash
# 詳細なエラー情報を表示
npx tsc --noEmit --pretty

# 特定のファイルのみチェック
npx tsc --noEmit filename.ts

# 型情報を詳細に表示
npx tsc --noEmit --listFiles

# 設定の確認
npx tsc --showConfig
```

---

## 🚨 緊急時の対処法

### 一時的な回避策（本番では推奨されない）
```typescript
// 1. any型を使用（型安全性は失われる）
const problematicValue: any = someComplexValue;

// 2. 型アサーション（確実な場合のみ）
const typedValue = unknownValue as ExpectedType;

// 3. Non-null assertion（nullでないことが確実な場合のみ）
const definitelyNotNull = possiblyNullValue!;

// 4. ESLintルールの一時的な無効化
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const temporaryAny: any = complexValue;
```

### 段階的な型安全性の向上
```typescript
// Phase 1: any型で動作させる
let data: any = complexApiResponse;

// Phase 2: 部分的な型定義
interface PartialData {
  id: string;
  // 他のプロパティは後で追加
}
let data: PartialData & Record<string, unknown>;

// Phase 3: 完全な型定義
interface CompleteData {
  id: string;
  name: string;
  age: number;
  // すべてのプロパティを定義
}
let data: CompleteData;
```

---

## 📚 参考リンク

- [TypeScript Error Reference](https://www.typescriptlang.org/docs/handbook/error-reference.html)
- [TypeScript FAQ](https://github.com/Microsoft/TypeScript/wiki/FAQ)
- [TypeScript Deep Dive - Common Errors](https://basarat.gitbook.io/typescript/type-system)
- [Stack Overflow - TypeScript](https://stackoverflow.com/questions/tagged/typescript)

---

## 💡 予防策

### 1. 段階的な型の厳密化
```json
// tsconfig.json で段階的に厳しくする
{
  "compilerOptions": {
    "strict": false,        // 最初は緩く
    "noImplicitAny": true,  // 徐々に厳しく
    "strictNullChecks": false // 後で有効化
  }
}
```

### 2. 型定義の整理
```typescript
// 型定義を別ファイルに整理
// types/user.ts
export interface User {
  id: string;
  name: string;
  age: number;
}

// types/api.ts
export interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}
```

### 3. 定期的な型チェック
```bash
# 型チェックのみ実行
npm run type-check

# 継続的インテグレーションに組み込む
# .github/workflows/ci.yml
- name: Type Check
  run: npm run type-check
```

---

**📌 重要**: エラーが発生した時は慌てずに、エラーメッセージをよく読んで原因を特定しましょう。TypeScriptのエラーメッセージは非常に親切で、多くの場合解決のヒントが含まれています。段階的に問題を解決していくことが重要です。