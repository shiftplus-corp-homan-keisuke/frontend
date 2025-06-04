# Step02 トラブルシューティング

> 💡 **このファイルについて**: Step02の型システムと型注釈学習でよくあるエラーと解決方法をまとめたガイドです。

## 📋 目次
1. [型エラーの基本的な読み方](#型エラーの基本的な読み方)
2. [プリミティブ型関連のエラー](#プリミティブ型関連のエラー)
3. [配列・タプル関連のエラー](#配列タプル関連のエラー)
4. [関数型関連のエラー](#関数型関連のエラー)
5. [型推論関連の問題](#型推論関連の問題)
6. [型システム関連エラー](#型システム関連エラー)
7. [実践演習でのよくある問題](#実践演習でのよくある問題)
8. [プロジェクト実装でのよくある問題](#プロジェクト実装でのよくある問題)
9. [デバッグのコツ](#デバッグのコツ)

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
---

## 型システム関連エラー

### 基本型システムでよくあるエラー

#### 型注釈の不一致エラー
**症状**: 変数や関数の型注釈と実際の値が一致しない

```typescript
// 問題のあるコード
let userName: string = 123; // Error: Type 'number' is not assignable to type 'string'

function calculateAge(birthYear: number): string {
  return new Date().getFullYear() - birthYear; // Error: Type 'number' is not assignable to type 'string'
}

// 解決方法
let userName: string = "Alice"; // OK
// または
let userId: number = 123; // OK

function calculateAge(birthYear: number): number { // 戻り値の型を修正
  return new Date().getFullYear() - birthYear; // OK
}
// または
function calculateAge(birthYear: number): string { // 戻り値を文字列に変換
  return String(new Date().getFullYear() - birthYear); // OK
}
```

#### Union型の使用エラー
**症状**: Union型の値を適切に処理していない

```typescript
// 問題のあるコード
function processId(id: string | number) {
  return id.toUpperCase(); // Error: Property 'toUpperCase' does not exist on type 'string | number'
}

// 解決方法1: 型ガードを使用
function processId(id: string | number): string {
  if (typeof id === "string") {
    return id.toUpperCase();
  }
  return String(id);
}

// 解決方法2: 型アサーション（注意して使用）
function processId(id: string | number): string {
  return typeof id === "string" ? id.toUpperCase() : String(id);
}
```

#### リテラル型の制約エラー
**症状**: リテラル型で定義された値以外を使用しようとした場合

```typescript
// 問題のあるコード
type Theme = "light" | "dark";
let currentTheme: Theme = "blue"; // Error: Type '"blue"' is not assignable to type 'Theme'

// 解決方法1: 正しい値を使用
let currentTheme: Theme = "light"; // OK

// 解決方法2: 型定義を拡張
type Theme = "light" | "dark" | "blue";

// 解決方法3: 動的な値の場合は型ガード
function isValidTheme(theme: string): theme is Theme {
  return theme === "light" || theme === "dark";
}

const userTheme = "light";
if (isValidTheme(userTheme)) {
  let currentTheme: Theme = userTheme; // OK
}
```

### インターフェース関連のエラー

#### 必須プロパティの不足エラー
**症状**: インターフェースで定義された必須プロパティが不足している

```typescript
// 問題のあるコード
interface User {
  id: number;
  name: string;
  email: string;
}

const user: User = {
  id: 1,
  name: "Alice"
  // Error: Property 'email' is missing in type '{ id: number; name: string; }' but required in type 'User'
};

// 解決方法1: 不足しているプロパティを追加
const user: User = {
  id: 1,
  name: "Alice",
  email: "alice@example.com" // 追加
};

// 解決方法2: オプショナルプロパティに変更
interface User {
  id: number;
  name: string;
  email?: string; // オプショナルに変更
}

// 解決方法3: Partialユーティリティ型を使用
const partialUser: Partial<User> = {
  id: 1,
  name: "Alice"
  // emailは省略可能
};
```

#### 読み取り専用プロパティの変更エラー
**症状**: readonlyプロパティを変更しようとした場合

```typescript
// 問題のあるコード
interface Config {
  readonly apiUrl: string;
  readonly version: string;
}

const config: Config = {
  apiUrl: "https://api.example.com",
  version: "1.0.0"
};

config.apiUrl = "https://new-api.example.com"; // Error: Cannot assign to 'apiUrl' because it is a read-only property

// 解決方法1: 新しいオブジェクトを作成
const newConfig: Config = {
  ...config,
  apiUrl: "https://new-api.example.com"
};

// 解決方法2: readonlyを削除（設計を見直す）
interface Config {
  apiUrl: string; // readonlyを削除
  readonly version: string; // versionは読み取り専用のまま
}
```

---

## 実践演習でのよくある問題

### Session1演習でのよくあるエラー

#### 型注釈の書き方エラー
**症状**: 型注釈の構文が間違っている

```typescript
// 問題のあるコード
let userName string = "Alice"; // Error: ':' expected
let userAge: Number = 25; // Error: 'Number' should be 'number'
let isActive: Boolean = true; // Error: 'Boolean' should be 'boolean'

// 解決方法
let userName: string = "Alice"; // OK
let userAge: number = 25; // OK（小文字のnumber）
let isActive: boolean = true; // OK（小文字のboolean）
```

#### 関数の型注釈エラー
**症状**: 関数の引数や戻り値の型注釈が間違っている

```typescript
// 問題のあるコード
function createUser(name, email, role) { // Error: Parameter 'name' implicitly has an 'any' type
  return {
    id: Math.random(),
    name: name,
    email: email,
    role: role
  };
}

// 解決方法
function createUser(
  name: string, 
  email: string, 
  role: "admin" | "user" | "guest"
): {
  id: number;
  name: string;
  email: string;
  role: "admin" | "user" | "guest";
} {
  return {
    id: Math.random(),
    name: name,
    email: email,
    role: role
  };
}

// より良い解決方法: インターフェースを使用
interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "user" | "guest";
}

function createUser(name: string, email: string, role: User['role']): User {
  return {
    id: Math.random(),
    name,
    email,
    role
  };
}
```

### Session2演習でのよくあるエラー

#### 配列操作での型エラー
**症状**: 配列の型が期待される型と一致しない

```typescript
// 問題のあるコード
class ShoppingCart {
  private items = []; // any[]として推論される

  addItem(product: Product, quantity: number): void {
    this.items.push({ product, quantity }); // 型安全性が失われる
  }

  getItems() {
    return this.items; // any[]を返す
  }
}

// 解決方法
interface CartItem {
  product: Product;
  quantity: number;
  addedAt: Date;
}

class ShoppingCart {
  private items: CartItem[] = []; // 明示的な型注釈

  addItem(product: Product, quantity: number): void {
    this.items.push({
      product,
      quantity,
      addedAt: new Date()
    });
  }

  getItems(): readonly CartItem[] {
    return [...this.items]; // 読み取り専用のコピーを返す
  }
}
```

#### オブジェクトの型推論エラー
**症状**: オブジェクトの型が期待通りに推論されない

```typescript
// 問題のあるコード
function transformUserData(rawData: RawUserData[]) {
  return rawData.map(raw => {
    return {
      id: parseInt(raw.id),
      name: raw.full_name,
      email: raw.email_address,
      isActive: raw.is_active === "true"
    };
  }); // 戻り値の型が不明確
}

// 解決方法1: 戻り値の型を明示
interface ProcessedUser {
  id: number;
  name: string;
  email: string;
  isActive: boolean;
}

function transformUserData(rawData: RawUserData[]): ProcessedUser[] {
  return rawData.map(raw => ({
    id: parseInt(raw.id, 10),
    name: raw.full_name,
    email: raw.email_address,
    isActive: raw.is_active === "true"
  }));
}
```

### Session3演習でのよくあるエラー

#### 複雑な型定義でのエラー
**症状**: 複雑な型定義で循環参照や型の不整合が発生

```typescript
// 問題のあるコード
interface Product {
  id: number;
  category: Category; // Categoryがまだ定義されていない
}

interface Category {
  id: number;
  products: Product[]; // 循環参照
}

// 解決方法1: 循環参照を避ける
interface Product {
  id: number;
  categoryId: number; // IDのみを保持
}

interface Category {
  id: number;
  name: string;
}

// 解決方法2: 必要に応じて関連データを取得する関数を定義
interface ProductService {
  getProductsByCategory(categoryId: number): Promise<Product[]>;
  getCategoryById(categoryId: number): Promise<Category>;
}
```

---

## プロジェクト実装でのよくある問題

### 大規模な型定義での問題

#### 型定義ファイルの肥大化
**症状**: 一つのファイルに多くの型定義が集中し、管理が困難になる

```typescript
// 問題のあるコード（types.ts）
// 500行以上の型定義が一つのファイルに...
export interface User { /* ... */ }
export interface Product { /* ... */ }
export interface Order { /* ... */ }
export interface Category { /* ... */ }
// ... 多数の型定義

// 解決方法: ドメインごとにファイルを分割
// types/user.ts
export interface User { /* ... */ }
export interface UserProfile { /* ... */ }

// types/product.ts
export interface Product { /* ... */ }
export interface ProductCategory { /* ... */ }

// types/order.ts
export interface Order { /* ... */ }
export interface OrderItem { /* ... */ }

// types/index.ts
export * from './user';
export * from './product';
export * from './order';
```

#### 型の命名衝突
**症状**: 異なるドメインで同じ名前の型が定義され、衝突が発生

```typescript
// 問題のあるコード
// user.ts
export interface Status {
  active: boolean;
}

// order.ts
export interface Status { // 名前が衝突
  pending: boolean;
  shipped: boolean;
}

// 解決方法1: 名前空間を使用
// user.ts
export namespace User {
  export interface Status {
    active: boolean;
  }
}

// order.ts
export namespace Order {
  export interface Status {
    pending: boolean;
    shipped: boolean;
  }
}

// 解決方法2: より具体的な名前を使用
// user.ts
export interface UserStatus {
  active: boolean;
}

// order.ts
export interface OrderStatus {
  pending: boolean;
  shipped: boolean;
}
```

### パフォーマンス関連の問題

#### 型チェックの遅延
**症状**: 複雑な型定義により、TypeScriptの型チェックが遅くなる

```typescript
// 問題のあるコード
type DeepNested<T> = {
  [K in keyof T]: T[K] extends object 
    ? DeepNested<T[K]> 
    : T[K];
}; // 深い再帰型は型チェックを遅くする

// 解決方法1: 型の複雑さを制限
type DeepNested<T, Depth extends number = 5> = Depth extends 0
  ? T
  : {
      [K in keyof T]: T[K] extends object 
        ? DeepNested<T[K], Prev<Depth>>
        : T[K];
    };

type Prev<T extends number> = T extends 1 ? 0 : T extends 2 ? 1 : T extends 3 ? 2 : T extends 4 ? 3 : T extends 5 ? 4 : never;

// 解決方法2: より単純な型設計
interface SimpleNested {
  level1: {
    level2: {
      value: string;
    };
  };
}
```

#### メモリ使用量の増加
**症状**: 大量の型定義により、TypeScriptコンパイラのメモリ使用量が増加

```typescript
// 問題のあるコード
// 大量のリテラル型の組み合わせ
type AllCombinations = 
  | "a1" | "a2" | "a3" | /* ... 1000個の組み合わせ ... */
  | "z998" | "z999" | "z1000";

// 解決方法1: 動的な型生成を避ける
type Category = "electronics" | "books" | "clothing";
type SubCategory = string; // より柔軟な型を使用

// 解決方法2: 型の分割
type ElectronicsSubCategory = "phones" | "laptops" | "tablets";
type BooksSubCategory = "fiction" | "non-fiction" | "textbooks";
type ClothingSubCategory = "shirts" | "pants" | "shoes";

type SubCategoryMap = {
  electronics: ElectronicsSubCategory;
  books: BooksSubCategory;
  clothing: ClothingSubCategory;
};
```

### 実行時エラーの対策

#### 型安全性と実行時の不一致
**症状**: TypeScriptでは型安全だが、実行時にエラーが発生

```typescript
// 問題のあるコード
interface ApiResponse {
  data: User[];
  status: number;
}

async function fetchUsers(): Promise<ApiResponse> {
  const response = await fetch('/api/users');
  return response.json(); // 実行時に型が保証されない
}

// 解決方法1: 実行時バリデーション
import { z } from 'zod';

const UserSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email()
});

const ApiResponseSchema = z.object({
  data: z.array(UserSchema),
  status: z.number()
});

async function fetchUsers(): Promise<ApiResponse> {
  const response = await fetch('/api/users');
  const json = await response.json();
  
  // 実行時バリデーション
  const validatedData = ApiResponseSchema.parse(json);
  return validatedData;
}

// 解決方法2: 型ガード関数
function isUser(obj: unknown): obj is User {
  return typeof obj === 'object' && 
         obj !== null && 
         'id' in obj && 
         'name' in obj && 
         'email' in obj;
}

function isApiResponse(obj: unknown): obj is ApiResponse {
  return typeof obj === 'object' && 
         obj !== null && 
         'data' in obj && 
         'status' in obj &&
         Array.isArray((obj as any).data) &&
         (obj as any).data.every(isUser);
}
```

### デバッグとトラブルシューティングのベストプラクティス

1. **段階的な型定義**: 複雑な型は段階的に構築する
2. **型の分離**: 関連する型をグループ化し、適切にファイルを分割する
3. **実行時バリデーション**: 外部データには必ず実行時バリデーションを適用する
4. **型ガードの活用**: Union型や unknown型の処理には型ガードを使用する
5. **パフォーマンス監視**: 型チェックの時間を定期的に監視する
6. **ドキュメント化**: 複雑な型定義には適切なコメントを追加する

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