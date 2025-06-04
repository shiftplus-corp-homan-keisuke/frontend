# Step02 専門用語集

> 💡 **このファイルについて**: Step02で出てくる型システム関連の重要な専門用語と概念の詳細解説集です。

## 📋 目次
1. [型システム関連用語](#型システム関連用語)
2. [型推論関連用語](#型推論関連用語)
3. [配列・タプル関連用語](#配列・タプル関連用語)
4. [関数型関連用語](#関数型関連用語)
5. [オブジェクト・インターフェース関連用語](#オブジェクトインターフェース関連用語)
6. [型定義関連用語](#型定義関連用語)
7. [統計・分析関連用語](#統計分析関連用語)
8. [API・サービス関連用語](#APIサービス関連用語)

---

## 型システム関連用語

### プリミティブ型（Primitive Types）
**定義**: TypeScriptの基本的なデータ型

**種類と特徴**:
```typescript
// 1. string型 - 文字列
let message: string = "Hello";
let template: string = `Hello ${message}`;

// 2. number型 - 数値（整数・浮動小数点）
let age: number = 25;
let price: number = 99.99;
let binary: number = 0b1010; // 2進数
let hex: number = 0xff; // 16進数

// 3. boolean型 - 真偽値
let isActive: boolean = true;

// 4. null型 - 意図的な空値
let nullValue: null = null;

// 5. undefined型 - 未定義値
let undefinedValue: undefined = undefined;

// 6. symbol型 - 一意識別子
let sym: symbol = Symbol("key");

// 7. bigint型 - 大きな整数
let bigNumber: bigint = 123n;
```

**他言語との比較**:
- **Java**: String, int, double, boolean, null
- **C#**: string, int, double, bool, null
- **Python**: str, int, float, bool, None
- **Go**: string, int, float64, bool, nil

### リテラル型（Literal Types）
**定義**: 特定の値のみを許可する型

**コード例**:
```typescript
// 文字列リテラル型
let status: "pending" | "approved" | "rejected" = "pending";

// 数値リテラル型
let diceRoll: 1 | 2 | 3 | 4 | 5 | 6 = 3;

// 真偽値リテラル型
let isTrue: true = true; // falseは代入不可

// オブジェクトリテラル型
let config: { readonly mode: "development" } = {
  mode: "development"
};
```

**実用場面**: 設定値、ステータス、フラグなどの限定された値の表現

### ユニオン型（Union Types）
**定義**: 複数の型のうちいずれかを許可する型

**コード例**:
```typescript
// 基本的なユニオン型
let value: string | number = "hello";
value = 42; // OK

// 複雑なユニオン型
let result: string | number | boolean = true;

// オブジェクトのユニオン型
type User = {
  type: "user";
  name: string;
} | {
  type: "admin";
  name: string;
  permissions: string[];
};

// 関数の引数でのユニオン型
function processId(id: string | number): string {
  return String(id);
}
```

**なぜ重要か**: 柔軟性と型安全性のバランスを取る重要な機能

### インターセクション型（Intersection Types）
**定義**: 複数の型を組み合わせた型

**コード例**:
```typescript
type Name = { name: string };
type Age = { age: number };

// インターセクション型
type Person = Name & Age;

const person: Person = {
  name: "Alice",
  age: 30
}; // 両方のプロパティが必要

// 関数型のインターセクション
type Logger = (message: string) => void;
type Counter = { count: number };

type LoggerWithCounter = Logger & Counter;
```

### 型エイリアス（Type Aliases）
**定義**: 既存の型に新しい名前を付ける機能

**コード例**:
```typescript
// 基本的な型エイリアス
type UserID = string;
type UserAge = number;

// 複雑な型エイリアス
type User = {
  id: UserID;
  name: string;
  age: UserAge;
};

// ユニオン型のエイリアス
type Status = "loading" | "success" | "error";

// 関数型のエイリアス
type EventHandler = (event: Event) => void;

// ジェネリック型エイリアス
type ApiResponse<T> = {
  data: T;
  status: number;
  message: string;
};
```

---

## 型推論関連用語

### 型推論（Type Inference）
**定義**: TypeScriptが自動的に型を推測する機能

**推論の種類**:
```typescript
// 1. 基本的な型推論
let message = "Hello"; // string型として推論
let count = 42; // number型として推論

// 2. 最適共通型（Best Common Type）
let mixed = [1, "hello", true]; // (string | number | boolean)[]

// 3. 文脈的型推論（Contextual Typing）
window.addEventListener("click", function(event) {
  // eventは自動的にMouseEvent型として推論
  console.log(event.clientX);
});

// 4. 戻り値型推論
function add(a: number, b: number) {
  return a + b; // number型として推論
}

// 5. 条件分岐での型推論（Type Narrowing）
function processValue(value: string | number) {
  if (typeof value === "string") {
    // この分岐内ではvalueはstring型
    return value.toUpperCase();
  }
  // この分岐内ではvalueはnumber型
  return value.toFixed(2);
}
```

### 型の絞り込み（Type Narrowing）
**定義**: 条件分岐によって型を絞り込む機能

**手法**:
```typescript
// 1. typeof ガード
function processValue(value: string | number) {
  if (typeof value === "string") {
    // string型として扱われる
    return value.length;
  }
  // number型として扱われる
  return value * 2;
}

// 2. instanceof ガード
function processError(error: Error | string) {
  if (error instanceof Error) {
    // Error型として扱われる
    return error.message;
  }
  // string型として扱われる
  return error;
}

// 3. in演算子ガード
type Fish = { swim: () => void };
type Bird = { fly: () => void };

function move(animal: Fish | Bird) {
  if ("swim" in animal) {
    // Fish型として扱われる
    animal.swim();
  } else {
    // Bird型として扱われる
    animal.fly();
  }
}

// 4. カスタム型ガード
function isString(value: unknown): value is string {
  return typeof value === "string";
}

function processUnknown(value: unknown) {
  if (isString(value)) {
    // string型として扱われる
    return value.toUpperCase();
  }
}
```

### 型アサーション（Type Assertion）
**定義**: 開発者が型を明示的に指定する機能

**コード例**:
```typescript
// 1. as構文
let someValue: unknown = "hello world";
let strLength: number = (someValue as string).length;

// 2. <型>構文（JSXでは使用不可）
let strLength2: number = (<string>someValue).length;

// 3. 非null アサーション演算子（!）
function processElement(element: HTMLElement | null) {
  // elementがnullでないことを保証
  element!.style.color = "red";
}

// 4. const アサーション
let colors = ["red", "green", "blue"] as const;
// readonly ["red", "green", "blue"] 型

let config = {
  apiUrl: "https://api.example.com",
  timeout: 5000
} as const;
// readonly プロパティを持つ型
```

**注意点**: 型アサーションは型安全性を損なう可能性があるため、慎重に使用する

---

## 配列・タプル関連用語

### 配列型（Array Types）
**定義**: 同じ型の要素を持つ配列の型

**記法**:
```typescript
// 1. 基本記法
let numbers: number[] = [1, 2, 3];
let strings: string[] = ["a", "b", "c"];

// 2. ジェネリック記法
let scores: Array<number> = [85, 92, 78];
let names: Array<string> = ["Alice", "Bob"];

// 3. 多次元配列
let matrix: number[][] = [[1, 2], [3, 4]];
let cube: Array<Array<number>> = [[1, 2], [3, 4]];

// 4. 読み取り専用配列
let readonlyNumbers: readonly number[] = [1, 2, 3];
let readonlyStrings: ReadonlyArray<string> = ["a", "b"];
```

### タプル型（Tuple Types）
**定義**: 固定長で各要素の型が決まっている配列の型

**特徴と使用例**:
```typescript
// 1. 基本的なタプル
let coordinate: [number, number] = [10, 20];
let person: [string, number, boolean] = ["Alice", 30, true];

// 2. 名前付きタプル（TypeScript 4.0+）
let namedCoordinate: [x: number, y: number] = [10, 20];

// 3. オプショナル要素
let optionalTuple: [string, number?] = ["hello"];

// 4. 残余要素
let restTuple: [string, ...number[]] = ["prefix", 1, 2, 3];

// 5. 読み取り専用タプル
let readonlyTuple: readonly [string, number] = ["hello", 42];

// 6. 分割代入
let [name, age] = person;
let [x, y] = coordinate;
```

**配列との違い**:
- **配列**: 可変長、同じ型の要素
- **タプル**: 固定長、各位置で型が決まっている

### 読み取り専用型（Readonly Types）
**定義**: 変更不可能な型

**コード例**:
```typescript
// 1. 読み取り専用配列
let readonlyArray: readonly number[] = [1, 2, 3];
// readonlyArray.push(4); // Error

// 2. ReadonlyArrayユーティリティ型
let readonlyArray2: ReadonlyArray<string> = ["a", "b"];

// 3. 読み取り専用オブジェクト
let readonlyObject: Readonly<{ name: string; age: number }> = {
  name: "Alice",
  age: 30
};
// readonlyObject.name = "Bob"; // Error

// 4. 読み取り専用タプル
let readonlyTuple: readonly [string, number] = ["hello", 42];
// readonlyTuple[0] = "world"; // Error
```

---

## 関数型関連用語

### 関数型（Function Types）
**定義**: 関数の型を表現する方法

**記法**:
```typescript
// 1. 関数宣言の型注釈
function greet(name: string): string {
  return `Hello, ${name}!`;
}

// 2. 関数式の型注釈
const add = (a: number, b: number): number => a + b;

// 3. 関数型の変数
let calculator: (a: number, b: number) => number;
calculator = add;

// 4. 関数型エイリアス
type MathOperation = (a: number, b: number) => number;
let multiply: MathOperation = (a, b) => a * b;

// 5. オブジェクトのメソッド型
type Calculator = {
  add: (a: number, b: number) => number;
  subtract: (a: number, b: number) => number;
};
```

### オプショナルパラメータ（Optional Parameters）
**定義**: 省略可能な関数の引数

**コード例**:
```typescript
// 1. 基本的なオプショナルパラメータ
function createUser(name: string, age?: number): object {
  return {
    name,
    age: age || 0
  };
}

// 2. 複数のオプショナルパラメータ
function greet(name: string, greeting?: string, punctuation?: string): string {
  return `${greeting || "Hello"}, ${name}${punctuation || "!"}`;
}

// 3. オプショナルパラメータの順序
// オプショナルパラメータは必須パラメータの後に配置
function processData(data: string, options?: { format: boolean }): string {
  if (options?.format) {
    return data.toUpperCase();
  }
  return data;
}
```

### デフォルトパラメータ（Default Parameters）
**定義**: デフォルト値を持つ関数の引数

**コード例**:
```typescript
// 1. 基本的なデフォルトパラメータ
function greet(name: string, greeting: string = "Hello"): string {
  return `${greeting}, ${name}!`;
}

// 2. 複雑なデフォルト値
function createConfig(
  host: string = "localhost",
  port: number = 3000,
  ssl: boolean = false
): object {
  return { host, port, ssl };
}

// 3. オブジェクトのデフォルト値
function processOptions(
  options: { timeout?: number; retries?: number } = {}
): void {
  const { timeout = 5000, retries = 3 } = options;
  console.log(`Timeout: ${timeout}, Retries: ${retries}`);
}
```

### 残余パラメータ（Rest Parameters）
**定義**: 可変長引数を受け取る機能

**コード例**:
```typescript
// 1. 基本的な残余パラメータ
function sum(...numbers: number[]): number {
  return numbers.reduce((total, num) => total + num, 0);
}

// 2. 混合パラメータ
function logMessage(level: string, ...messages: string[]): void {
  console.log(`[${level}]`, ...messages);
}

// 3. タプルでの残余パラメータ
function processData(
  first: string,
  ...rest: [number, boolean]
): void {
  console.log(first, rest[0], rest[1]);
}

// 4. 関数型での残余パラメータ
type Logger = (message: string, ...args: unknown[]) => void;
```

### 関数オーバーロード（Function Overloads）
**定義**: 同じ関数名で異なる型シグネチャを定義する機能

**コード例**:
```typescript
// 1. 基本的なオーバーロード
function format(value: string): string;
function format(value: number): string;
function format(value: boolean): string;
function format(value: string | number | boolean): string {
  return String(value);
}

// 2. より複雑なオーバーロード
function createElement(tag: "div"): HTMLDivElement;
function createElement(tag: "span"): HTMLSpanElement;
function createElement(tag: "input"): HTMLInputElement;
function createElement(tag: string): HTMLElement {
  return document.createElement(tag);
}

// 3. 条件付きオーバーロード
function processArray(arr: string[]): string[];
function processArray(arr: number[]): number[];
function processArray(arr: (string | number)[]): (string | number)[] {
  return arr.map(item => item);
}
```

### 高階関数（Higher-Order Functions）
**定義**: 関数を引数として受け取るか、関数を戻り値として返す関数

**コード例**:
```typescript
// 1. 関数を引数として受け取る
function applyOperation(
  numbers: number[],
  operation: (num: number) => number
): number[] {
  return numbers.map(operation);
}

const doubled = applyOperation([1, 2, 3], x => x * 2);

// 2. 関数を戻り値として返す
function createMultiplier(factor: number): (num: number) => number {
  return (num: number) => num * factor;
}

const double = createMultiplier(2);
const triple = createMultiplier(3);

// 3. 複雑な高階関数
function createValidator<T>(
  predicate: (value: T) => boolean
): (value: T) => { isValid: boolean; value: T } {
  return (value: T) => ({
    isValid: predicate(value),
    value
  });
}

const isPositive = createValidator<number>(x => x > 0);
```

---

## 📚 参考リンク

- [TypeScript Handbook - Basic Types](https://www.typescriptlang.org/docs/handbook/basic-types.html)
- [TypeScript Handbook - Type Inference](https://www.typescriptlang.org/docs/handbook/type-inference.html)
- [TypeScript Handbook - Functions](https://www.typescriptlang.org/docs/handbook/functions.html)
---

## オブジェクト・インターフェース関連用語

### インターフェース（Interface）
**定義**: オブジェクトの構造を定義する契約

**基本的な使用例**:
```typescript
// 基本的なインターフェース
interface User {
  id: number;
  name: string;
  email: string;
}

// インターフェースを使用した変数宣言
const user: User = {
  id: 1,
  name: "Alice",
  email: "alice@example.com"
};

// 関数の引数としてインターフェースを使用
function greetUser(user: User): string {
  return `Hello, ${user.name}!`;
}
```

**他言語との比較**:
- **Java**: interface キーワードで定義、実装が必要
- **C#**: interface キーワードで定義、実装が必要
- **Go**: interface は暗黙的に実装される
- **TypeScript**: 構造的型付けで、形が合えば互換性がある

### オプショナルプロパティ（Optional Properties）
**定義**: 存在しなくても良いプロパティ

**コード例**:
```typescript
interface UserProfile {
  id: number;
  name: string;
  email: string;
  avatar?: string; // オプショナルプロパティ
  bio?: string; // オプショナルプロパティ
  socialLinks?: {
    twitter?: string;
    github?: string;
  };
}

// 使用例
const user1: UserProfile = {
  id: 1,
  name: "Alice",
  email: "alice@example.com"
  // avatar, bio, socialLinks は省略可能
};

const user2: UserProfile = {
  id: 2,
  name: "Bob",
  email: "bob@example.com",
  avatar: "avatar.jpg",
  bio: "Developer"
};
```

### 読み取り専用プロパティ（Readonly Properties）
**定義**: 初期化後に変更できないプロパティ

**コード例**:
```typescript
interface ReadonlyUser {
  readonly id: number;
  readonly createdAt: Date;
  name: string; // 変更可能
  email: string; // 変更可能
}

const user: ReadonlyUser = {
  id: 1,
  createdAt: new Date(),
  name: "Alice",
  email: "alice@example.com"
};

// user.id = 2; // Error: Cannot assign to 'id' because it is a read-only property
user.name = "Alice Smith"; // OK
```

### インデックスシグネチャ（Index Signatures）
**定義**: 動的なプロパティ名を持つオブジェクトの型定義

**コード例**:
```typescript
// 文字列インデックスシグネチャ
interface StringDictionary {
  [key: string]: string;
}

const translations: StringDictionary = {
  hello: "こんにちは",
  goodbye: "さようなら",
  thanks: "ありがとう"
};

// 数値インデックスシグネチャ
interface NumberArray {
  [index: number]: number;
}

const scores: NumberArray = [85, 92, 78, 96];

// 混合インデックスシグネチャ
interface MixedObject {
  name: string; // 固定プロパティ
  [key: string]: string | number; // 動的プロパティ
}
```

---

## 型定義関連用語

### 型定義（Type Definition）
**定義**: 新しい型を作成すること

**基本パターン**:
```typescript
// 型エイリアス
type UserID = string;
type UserAge = number;

// オブジェクト型の定義
type User = {
  id: UserID;
  name: string;
  age: UserAge;
};

// ユニオン型の定義
type Status = "pending" | "approved" | "rejected";

// 関数型の定義
type EventHandler = (event: Event) => void;
```

### 型宣言（Type Declaration）
**定義**: 既存の値に対する型情報の宣言

**コード例**:
```typescript
// 外部ライブラリの型宣言
declare module "my-library" {
  export function doSomething(value: string): number;
  export const VERSION: string;
}

// グローバル変数の型宣言
declare global {
  interface Window {
    myCustomProperty: string;
  }
}

// 環境変数の型宣言
declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: "development" | "production" | "test";
    API_URL: string;
  }
}
```

### 型合成（Type Composition）
**定義**: 既存の型を組み合わせて新しい型を作成すること

**コード例**:
```typescript
// インターセクション型による合成
type Name = { name: string };
type Age = { age: number };
type Person = Name & Age; // { name: string; age: number; }

// ユニオン型による合成
type StringOrNumber = string | number;

// 条件付き型による合成
type NonNullable<T> = T extends null | undefined ? never : T;

// マップ型による合成
type Partial<T> = {
  [P in keyof T]?: T[P];
};
```

### 型の互換性（Type Compatibility）
**定義**: 異なる型同士が代入可能かどうかの関係

**コード例**:
```typescript
// 構造的型付けによる互換性
interface Point2D {
  x: number;
  y: number;
}

interface Point3D {
  x: number;
  y: number;
  z: number;
}

let point2D: Point2D = { x: 1, y: 2 };
let point3D: Point3D = { x: 1, y: 2, z: 3 };

// Point3D は Point2D と互換性がある（より多くのプロパティを持つ）
point2D = point3D; // OK

// Point2D は Point3D と互換性がない（z プロパティが不足）
// point3D = point2D; // Error
```

---

## 統計・分析関連用語

### 統計型（Statistics Types）
**定義**: 統計計算に使用される型定義

**コード例**:
```typescript
// 基本統計データ型
interface BasicStatistics {
  count: number;
  sum: number;
  mean: number;
  median: number;
  mode: number[];
  min: number;
  max: number;
  range: number;
  variance: number;
  standardDeviation: number;
}

// 統計計算関数の型
type StatisticsCalculator<T> = (data: T[]) => BasicStatistics;

// 数値配列用の統計計算
const calculateNumberStats: StatisticsCalculator<number> = (numbers) => {
  const sorted = [...numbers].sort((a, b) => a - b);
  const sum = numbers.reduce((acc, num) => acc + num, 0);
  const mean = sum / numbers.length;
  
  return {
    count: numbers.length,
    sum,
    mean,
    median: sorted[Math.floor(sorted.length / 2)],
    mode: [], // 実装省略
    min: Math.min(...numbers),
    max: Math.max(...numbers),
    range: Math.max(...numbers) - Math.min(...numbers),
    variance: 0, // 実装省略
    standardDeviation: 0 // 実装省略
  };
};
```

### 集計型（Aggregation Types）
**定義**: データの集計処理に使用される型

**コード例**:
```typescript
// 集計結果の型
interface AggregationResult<T> {
  groupBy: string;
  data: T[];
  count: number;
  aggregatedValue: number;
}

// 集計関数の型
type AggregationFunction<T, K extends keyof T> = (
  data: T[],
  groupByKey: K,
  aggregateKey: keyof T
) => AggregationResult<T>[];

// 売上データの集計例
interface SalesData {
  date: string;
  product: string;
  amount: number;
  quantity: number;
}

const aggregateSales: AggregationFunction<SalesData, 'product'> = (
  data,
  groupByKey,
  aggregateKey
) => {
  // 実装省略
  return [];
};
```

### 分析データ型（Analytics Data Types）
**定義**: データ分析に特化した型定義

**コード例**:
```typescript
// 時系列データ型
interface TimeSeriesData {
  timestamp: Date;
  value: number;
  metadata?: Record<string, unknown>;
}

// 分析結果型
interface AnalysisResult {
  trend: "increasing" | "decreasing" | "stable";
  correlation: number;
  seasonality: boolean;
  anomalies: TimeSeriesData[];
  forecast: TimeSeriesData[];
}

// 分析器の型
interface DataAnalyzer<T> {
  analyze(data: T[]): AnalysisResult;
  predict(data: T[], periods: number): T[];
  detectAnomalies(data: T[], threshold: number): T[];
}
```

---

## API・サービス関連用語

### APIレスポンス型（API Response Types）
**定義**: API からのレスポンスデータの型定義

**コード例**:
```typescript
// 基本的なAPIレスポンス型
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  statusCode: number;
  timestamp: Date;
}

// ページネーション付きレスポンス
interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// 使用例
type UserListResponse = ApiResponse<PaginatedResponse<User>>;
type UserDetailResponse = ApiResponse<User>;
```

### サービス層型（Service Layer Types）
**定義**: サービス層で使用される型定義

**コード例**:
```typescript
// サービスインターフェース
interface UserService {
  getUser(id: string): Promise<ApiResponse<User>>;
  createUser(userData: CreateUserRequest): Promise<ApiResponse<User>>;
  updateUser(id: string, userData: UpdateUserRequest): Promise<ApiResponse<User>>;
  deleteUser(id: string): Promise<ApiResponse<void>>;
  listUsers(params: ListUsersParams): Promise<UserListResponse>;
}

// リクエスト型
interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
}

interface UpdateUserRequest {
  name?: string;
  email?: string;
}

interface ListUsersParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: keyof User;
  sortOrder?: "asc" | "desc";
}
```

### HTTPステータス型（HTTP Status Types）
**定義**: HTTPステータスコードの型定義

**コード例**:
```typescript
// HTTPステータスコード型
type HttpStatusCode = 
  | 200 // OK
  | 201 // Created
  | 204 // No Content
  | 400 // Bad Request
  | 401 // Unauthorized
  | 403 // Forbidden
  | 404 // Not Found
  | 409 // Conflict
  | 422 // Unprocessable Entity
  | 500 // Internal Server Error
  | 502 // Bad Gateway
  | 503; // Service Unavailable

// ステータス別レスポンス型
interface HttpResponse<T = unknown> {
  status: HttpStatusCode;
  data?: T;
  headers: Record<string, string>;
}

// エラーレスポンス型
interface ErrorResponse {
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
}
```

### リクエスト・レスポンス型（Request/Response Types）
**定義**: HTTP リクエストとレスポンスの型定義

**コード例**:
```typescript
// 基本リクエスト型
interface BaseRequest {
  headers?: Record<string, string>;
  params?: Record<string, string>;
  query?: Record<string, string>;
}

// POST リクエスト型
interface PostRequest<T> extends BaseRequest {
  body: T;
}

// GET リクエスト型
interface GetRequest extends BaseRequest {
  // body は不要
}

// API エンドポイント型
interface ApiEndpoint<TRequest, TResponse> {
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  path: string;
  request: TRequest;
  response: TResponse;
}

// 使用例
type CreateUserEndpoint = ApiEndpoint<
  PostRequest<CreateUserRequest>,
  ApiResponse<User>
>;

type GetUserEndpoint = ApiEndpoint<
  GetRequest & { params: { id: string } },
  ApiResponse<User>
>;
```
- [MDN - JavaScript Data Types](https://developer.mozilla.org/ja/docs/Web/JavaScript/Data_structures)

---

**📌 重要**: 型システムの理解は TypeScript 習得の基礎となります。各用語の意味と使用場面を実際のコードで確認しながら学習を進めてください。