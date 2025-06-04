# Step02 実践コード例

> 💡 **このファイルについて**: Step02の型システムと型注釈の学習のための段階的なコード例集です。基本的な型から複雑な型システムまで段階的に学習できます。

## 📋 目次
1. [基本から始める段階的学習](#基本から始める段階的学習)
2. [プリミティブ型の実践](#プリミティブ型の実践)
3. [基本型の練習](#基本型の練習)
4. [型推論の活用例](#型推論の活用例)
5. [配列・タプル操作の実践](#配列タプル操作の実践)
6. [オブジェクト型の実践活用](#オブジェクト型の実践活用)
7. [関数型の実践活用](#関数型の実践活用)
8. [プロジェクト型定義サンプル](#プロジェクト型定義サンプル)
9. [統計データ型定義](#統計データ型定義)
10. [API型定義パターン](#API型定義パターン)
11. [演習解答例とヒント](#演習解答例とヒント)
12. [プロジェクト完成例とヒント](#プロジェクト完成例とヒント)
13. [実用的なアプリケーション例](#実用的なアプリケーション例)

---
## 基本から始める段階的学習

### Step 1: TypeScript環境の確認

まず、TypeScriptが正しく動作することを確認しましょう。

```typescript
// hello-typescript.ts
console.log("Hello, TypeScript!");

// 基本的な型注釈
let message: string = "TypeScriptの学習を始めます";
let count: number = 1;
let isReady: boolean = true;

console.log(`${message} - Step ${count}`);
console.log(`準備完了: ${isReady}`);
```

### Step 2: 型推論の体験

TypeScriptの型推論機能を体験してみましょう。

```typescript
// type-inference-basics.ts

// 型推論の基本
let inferredString = "これは文字列として推論されます";
let inferredNumber = 42;
let inferredBoolean = true;

// VS Codeでマウスオーバーして型を確認してみてください
console.log(typeof inferredString); // "string"
console.log(typeof inferredNumber); // "number" 
console.log(typeof inferredBoolean); // "boolean"

// 配列の型推論
let numbers = [1, 2, 3, 4, 5]; // number[]として推論
let fruits = ["apple", "banana", "orange"]; // string[]として推論

// オブジェクトの型推論
let person = {
  name: "Alice",
  age: 30,
  isStudent: false
}; // { name: string; age: number; isStudent: boolean; }として推論
```

### Step 3: 基本型の組み合わせ

基本型を組み合わせて、より実用的なコードを書いてみましょう。

```typescript
// basic-types-combination.ts

// ユーザー情報の管理
function createUserProfile(
  name: string,
  age: number,
  isActive: boolean = true
): object {
  return {
    name: name,
    age: age,
    isActive: isActive,
    createdAt: new Date(),
    id: Math.floor(Math.random() * 1000)
  };
}

// 使用例
const user1 = createUserProfile("太郎", 25);
const user2 = createUserProfile("花子", 30, false);

console.log("ユーザー1:", user1);
console.log("ユーザー2:", user2);

// 簡単な計算関数
function calculateTotal(price: number, tax: number = 0.1): number {
  return Math.round(price * (1 + tax));
}

// 使用例
console.log("税込価格:", calculateTotal(1000)); // 1100
console.log("税込価格:", calculateTotal(1000, 0.08)); // 1080
```

### Step 4: エラーの体験と修正

意図的にエラーを発生させて、TypeScriptのエラーメッセージを理解しましょう。

```typescript
// error-examples.ts

// エラー例1: 型の不一致
let userName: string = "Alice";
// userName = 123; // Error: Type 'number' is not assignable to type 'string'

// エラー例2: 存在しないプロパティへのアクセス
const user = { name: "Bob", age: 25 };
// console.log(user.email); // Error: Property 'email' does not exist

// エラー例3: 引数の型エラー
function greet(name: string): string {
  return `Hello, ${name}!`;
}

// greet(123); // Error: Argument of type 'number' is not assignable to parameter of type 'string'
greet("Charlie"); // OK

// 修正版: Union型を使用
function flexibleGreet(name: string | number): string {
  return `Hello, ${name}!`;
}

flexibleGreet("David"); // OK
flexibleGreet(456); // OK
```

### Step 5: 実践的な小さなプロジェクト

学習した内容を組み合わせて、小さなプロジェクトを作成しましょう。

```typescript
// mini-calculator.ts

// 計算機の基本機能
class SimpleCalculator {
  private result: number = 0;

  // 加算
  add(value: number): SimpleCalculator {
    this.result += value;
    return this;
  }

  // 減算
  subtract(value: number): SimpleCalculator {
    this.result -= value;
    return this;
  }

  // 乗算
  multiply(value: number): SimpleCalculator {
    this.result *= value;
    return this;
  }

  // 除算
  divide(value: number): SimpleCalculator {
    if (value === 0) {
      throw new Error("0で割ることはできません");
    }
    this.result /= value;
    return this;
  }

  // 結果を取得
  getResult(): number {
    return this.result;
  }

  // リセット
  reset(): SimpleCalculator {
    this.result = 0;
    return this;
  }

  // 結果を表示
  display(): void {
    console.log(`計算結果: ${this.result}`);
  }
}

// 使用例
const calc = new SimpleCalculator();

calc
  .add(10)
  .multiply(2)
  .subtract(5)
  .divide(3)
  .display(); // 計算結果: 5

console.log("最終結果:", calc.getResult()); // 5

// 新しい計算
calc
  .reset()
  .add(100)
  .multiply(0.1)
  .display(); // 計算結果: 10
```

### 学習のポイント

1. **段階的に進める**: 一度に全てを理解しようとせず、一つずつ確実に
2. **実際に書く**: コードを読むだけでなく、必ず自分で書いて実行する
3. **エラーを恐れない**: エラーメッセージは学習の材料として活用する
4. **型を意識する**: VS Codeの型情報表示を積極的に活用する
5. **小さく始める**: 複雑なコードより、シンプルで理解しやすいコードから

---

## プリミティブ型の実践

### ステップ1: 基本型の活用
```typescript
// basic-types-practice.ts

// 1. 文字列型の活用
function formatUserName(firstName: string, lastName: string): string {
  return `${lastName}, ${firstName}`;
}

function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// 2. 数値型の活用
function calculateTax(price: number, taxRate: number = 0.1): number {
  return Math.round(price * (1 + taxRate) * 100) / 100;
}

function generateRandomId(): number {
  return Math.floor(Math.random() * 1000000);
}

// 3. 真偽値型の活用
function isAdult(age: number): boolean {
  return age >= 18;
}

function canVote(age: number, isCitizen: boolean): boolean {
  return isAdult(age) && isCitizen;
}

// 4. null/undefined の安全な処理
function getDisplayName(name: string | null | undefined): string {
  if (name === null || name === undefined) {
    return "Unknown User";
  }
  return name.trim() || "Unknown User";
}

function safeParseInt(value: string | null | undefined): number | null {
  if (!value) return null;
  
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? null : parsed;
}

// 使用例
console.log(formatUserName("太郎", "田中")); // "田中, 太郎"
console.log(validateEmail("test@example.com")); // true
console.log(calculateTax(1000, 0.08)); // 1080
console.log(canVote(20, true)); // true
console.log(getDisplayName(null)); // "Unknown User"
console.log(safeParseInt("123")); // 123
```

### ステップ2: リテラル型とユニオン型
```typescript
// literal-union-types.ts

// 1. 文字列リテラル型
type Theme = "light" | "dark" | "auto";
type Language = "ja" | "en" | "zh" | "ko";

function applyTheme(theme: Theme): void {
  document.body.className = `theme-${theme}`;
}

function getGreeting(lang: Language): string {
  switch (lang) {
    case "ja":
      return "こんにちは";
    case "en":
      return "Hello";
    case "zh":
      return "你好";
    case "ko":
      return "안녕하세요";
    default:
      // TypeScriptが全てのケースをチェック
      const exhaustiveCheck: never = lang;
      throw new Error(`Unsupported language: ${exhaustiveCheck}`);
  }
}

// 2. 数値リテラル型
type HttpStatus = 200 | 201 | 400 | 401 | 403 | 404 | 500;
type Priority = 1 | 2 | 3 | 4 | 5;

function handleResponse(status: HttpStatus): string {
  if (status >= 200 && status < 300) {
    return "Success";
  } else if (status >= 400 && status < 500) {
    return "Client Error";
  } else {
    return "Server Error";
  }
}

function getPriorityLabel(priority: Priority): string {
  const labels = {
    1: "Very Low",
    2: "Low", 
    3: "Medium",
    4: "High",
    5: "Critical"
  };
  return labels[priority];
}

// 3. 複雑なユニオン型
type ApiResponse<T> = 
  | { success: true; data: T }
  | { success: false; error: string };

function processApiResponse<T>(response: ApiResponse<T>): T | null {
  if (response.success) {
    return response.data;
  } else {
    console.error("API Error:", response.error);
    return null;
  }
}

// 使用例
applyTheme("dark");
console.log(getGreeting("ja")); // "こんにちは"
console.log(handleResponse(404)); // "Client Error"
console.log(getPriorityLabel(5)); // "Critical"

const userResponse: ApiResponse<{ name: string; age: number }> = {
  success: true,
  data: { name: "Alice", age: 30 }
};
console.log(processApiResponse(userResponse)); // { name: "Alice", age: 30 }
```

---

## 型推論の活用例

### ステップ3: 型推論を活用したコード
```typescript
// type-inference-examples.ts

// 1. 基本的な型推論の活用
function createUser(name: string, age: number) {
  // 戻り値の型は自動推論される: { name: string; age: number; id: number; createdAt: Date }
  return {
    name,
    age,
    id: Math.floor(Math.random() * 1000),
    createdAt: new Date()
  };
}

// 2. 配列操作での型推論
function processNumbers(numbers: number[]) {
  // 各操作で型が適切に推論される
  const doubled = numbers.map(n => n * 2); // number[]
  const evens = numbers.filter(n => n % 2 === 0); // number[]
  const sum = numbers.reduce((acc, n) => acc + n, 0); // number
  
  return {
    doubled,
    evens,
    sum,
    average: sum / numbers.length // number
  };
}

// 3. 条件分岐での型の絞り込み
function processValue(value: string | number | boolean) {
  if (typeof value === "string") {
    // この分岐内では value は string 型
    return value.toUpperCase();
  } else if (typeof value === "number") {
    // この分岐内では value は number 型
    return value.toFixed(2);
  } else {
    // この分岐内では value は boolean 型
    return value ? "TRUE" : "FALSE";
  }
}

// 4. オブジェクトの型推論
function createConfig(env: "development" | "production") {
  const baseConfig = {
    apiUrl: "https://api.example.com",
    timeout: 5000
  };
  
  if (env === "development") {
    // 型推論により適切な型が設定される
    return {
      ...baseConfig,
      debug: true,
      apiUrl: "http://localhost:3000"
    };
  }
  
  return {
    ...baseConfig,
    debug: false,
    minify: true
  };
}

// 5. 関数の型推論
const mathOperations = {
  add: (a: number, b: number) => a + b,
  multiply: (a: number, b: number) => a * b,
  // 戻り値の型は自動推論される
  calculate: function(operation: "add" | "multiply", a: number, b: number) {
    return operation === "add" ? this.add(a, b) : this.multiply(a, b);
  }
};

// 使用例
const user = createUser("Alice", 30);
console.log(user.createdAt.getFullYear()); // 型安全にアクセス可能

const stats = processNumbers([1, 2, 3, 4, 5]);
console.log(stats.average); // 3

console.log(processValue("hello")); // "HELLO"
console.log(processValue(3.14159)); // "3.14"

const devConfig = createConfig("development");
console.log(devConfig.debug); // true（型安全）
```

---
## 基本型の練習

### 練習問題1: 型注釈の基本

以下のコードに適切な型注釈を追加してください。

```typescript
// 練習1-1: 基本的な変数の型注釈
let studentName = "田中太郎";
let studentAge = 20;
let isEnrolled = true;
let graduationYear = null;

// 練習1-2: 関数の型注釈
function calculateGrade(score) {
  if (score >= 90) return "A";
  if (score >= 80) return "B";
  if (score >= 70) return "C";
  if (score >= 60) return "D";
  return "F";
}

// 練習1-3: オブジェクトの型注釈
let student = {
  id: 12345,
  name: "佐藤花子",
  email: "hanako@example.com",
  courses: ["数学", "物理", "化学"]
};
```

**解答例**:
```typescript
// 解答1-1: 基本的な変数の型注釈
let studentName: string = "田中太郎";
let studentAge: number = 20;
let isEnrolled: boolean = true;
let graduationYear: number | null = null;

// 解答1-2: 関数の型注釈
function calculateGrade(score: number): string {
  if (score >= 90) return "A";
  if (score >= 80) return "B";
  if (score >= 70) return "C";
  if (score >= 60) return "D";
  return "F";
}

// 解答1-3: オブジェクトの型注釈
let student: {
  id: number;
  name: string;
  email: string;
  courses: string[];
} = {
  id: 12345,
  name: "佐藤花子",
  email: "hanako@example.com",
  courses: ["数学", "物理", "化学"]
};
```

### 練習問題2: Union型とリテラル型

以下の要件に従って型定義を作成してください。

```typescript
// 練習2-1: ユーザーの役割を表すリテラル型
// "admin", "user", "guest" のいずれかの値のみ許可

// 練習2-2: 通知の種類を表すリテラル型
// "info", "warning", "error", "success" のいずれかの値のみ許可

// 練習2-3: IDの型（文字列または数値）

// 練習2-4: 設定値の型（真偽値または文字列"auto"）

// 練習2-5: これらの型を使った関数
function createNotification(type, message, userId) {
  return {
    id: Math.random().toString(36),
    type: type,
    message: message,
    userId: userId,
    timestamp: new Date()
  };
}
```

**解答例**:
```typescript
// 解答2-1: ユーザーの役割を表すリテラル型
type UserRole = "admin" | "user" | "guest";

// 解答2-2: 通知の種類を表すリテラル型
type NotificationType = "info" | "warning" | "error" | "success";

// 解答2-3: IDの型（文字列または数値）
type ID = string | number;

// 解答2-4: 設定値の型（真偽値または文字列"auto"）
type SettingValue = boolean | "auto";

// 解答2-5: これらの型を使った関数
function createNotification(
  type: NotificationType, 
  message: string, 
  userId: ID
): {
  id: string;
  type: NotificationType;
  message: string;
  userId: ID;
  timestamp: Date;
} {
  return {
    id: Math.random().toString(36),
    type: type,
    message: message,
    userId: userId,
    timestamp: new Date()
  };
}
```

### 練習問題3: 型推論の理解

以下のコードで、TypeScriptがどのような型を推論するかを予想してください。

```typescript
// 練習3-1: 基本的な型推論
let a = 42;
let b = "hello";
let c = true;
let d = null;

// 練習3-2: 配列の型推論
let numbers = [1, 2, 3];
let mixed = [1, "hello", true];
let empty = [];

// 練習3-3: オブジェクトの型推論
let config = {
  host: "localhost",
  port: 3000,
  ssl: false
};

// 練習3-4: 関数の戻り値推論
function add(x: number, y: number) {
  return x + y;
}

function getUser(id: number) {
  return {
    id: id,
    name: "User " + id,
    active: true
  };
}

// 練習3-5: const vs let の推論の違い
let mutableString = "hello";
const immutableString = "hello";

let mutableArray = [1, 2, 3];
const immutableArray = [1, 2, 3];
```

**解答例**:
```typescript
// 解答3-1: 基本的な型推論
let a = 42; // number
let b = "hello"; // string
let c = true; // boolean
let d = null; // null

// 解答3-2: 配列の型推論
let numbers = [1, 2, 3]; // number[]
let mixed = [1, "hello", true]; // (string | number | boolean)[]
let empty = []; // any[]

// 解答3-3: オブジェクトの型推論
let config = {
  host: "localhost",
  port: 3000,
  ssl: false
}; // { host: string; port: number; ssl: boolean; }

// 解答3-4: 関数の戻り値推論
function add(x: number, y: number) {
  return x + y; // 戻り値の型: number
}

function getUser(id: number) {
  return {
    id: id,
    name: "User " + id,
    active: true
  }; // 戻り値の型: { id: number; name: string; active: boolean; }
}

// 解答3-5: const vs let の推論の違い
let mutableString = "hello"; // string
const immutableString = "hello"; // "hello" (リテラル型)

let mutableArray = [1, 2, 3]; // number[]
const immutableArray = [1, 2, 3]; // number[] (配列の場合はletと同じ)
```

### 練習問題4: エラー修正

以下のコードにはTypeScriptエラーがあります。エラーを特定し、修正してください。

```typescript
// 練習4-1: 型の不一致
let userName: string = "Alice";
userName = 123;

// 練習4-2: 存在しないプロパティ
let user = { name: "Bob", age: 30 };
console.log(user.email);

// 練習4-3: 引数の型エラー
function multiply(a: number, b: number): number {
  return a * b;
}
let result = multiply("5", "10");

// 練習4-4: null/undefined エラー
function getLength(text: string): number {
  return text.length;
}
let message: string | null = null;
console.log(getLength(message));

// 練習4-5: 配列の型エラー
let scores: number[] = [85, 92, 78];
scores.push("96");
```

**解答例**:
```typescript
// 解答4-1: 型の不一致
let userName: string = "Alice";
// userName = 123; // エラー: 数値を文字列に代入できない
userName = "Charlie"; // 修正: 文字列を代入

// 解答4-2: 存在しないプロパティ
let user: { name: string; age: number; email?: string } = { 
  name: "Bob", 
  age: 30 
};
console.log(user.email); // 修正: emailをオプショナルプロパティとして定義

// または
if ('email' in user) {
  console.log(user.email);
}

// 解答4-3: 引数の型エラー
function multiply(a: number, b: number): number {
  return a * b;
}
// let result = multiply("5", "10"); // エラー: 文字列を数値の引数に渡せない
let result = multiply(5, 10); // 修正: 数値を渡す
// または
let result2 = multiply(Number("5"), Number("10")); // 修正: 文字列を数値に変換

// 解答4-4: null/undefined エラー
function getLength(text: string): number {
  return text.length;
}
let message: string | null = null;
// console.log(getLength(message)); // エラー: nullを文字列の引数に渡せない

// 修正方法1: null チェック
if (message !== null) {
  console.log(getLength(message));
}

// 修正方法2: デフォルト値
console.log(getLength(message ?? ""));

// 解答4-5: 配列の型エラー
let scores: number[] = [85, 92, 78];
// scores.push("96"); // エラー: 文字列を数値配列に追加できない
scores.push(96); // 修正: 数値を追加
```

### 練習問題5: 実践的な型設計

以下の要件に従って、型安全な図書管理システムの基本型を設計してください。

```typescript
// 要件:
// 1. 本には ID、タイトル、著者、出版年、ISBN、貸出状況がある
// 2. 著者は名前と国籍を持つ
// 3. 貸出状況は "available", "borrowed", "reserved" のいずれか
// 4. 利用者には ID、名前、メールアドレス、登録日がある
// 5. 貸出記録には 本のID、利用者のID、貸出日、返却予定日、返却日（未返却の場合はnull）がある

// TODO: 上記の要件に従って型定義を作成してください
```

**解答例**:
```typescript
// 貸出状況の型
type BookStatus = "available" | "borrowed" | "reserved";

// 著者の型
interface Author {
  name: string;
  nationality: string;
}

// 本の型
interface Book {
  id: number;
  title: string;
  author: Author;
  publishedYear: number;
  isbn: string;
  status: BookStatus;
}

// 利用者の型
interface User {
  id: number;
  name: string;
  email: string;
  registeredAt: Date;
}

// 貸出記録の型
interface BorrowRecord {
  bookId: number;
  userId: number;
  borrowedAt: Date;
  dueDate: Date;
  returnedAt: Date | null; // 未返却の場合はnull
}

// 使用例
const book: Book = {
  id: 1,
  title: "TypeScript入門",
  author: {
    name: "山田太郎",
    nationality: "日本"
  },
  publishedYear: 2023,
  isbn: "978-4-123456-78-9",
  status: "available"
};

const user: User = {
  id: 1,
  name: "佐藤花子",
  email: "hanako@example.com",
  registeredAt: new Date("2023-01-15")
};

const borrowRecord: BorrowRecord = {
  bookId: 1,
  userId: 1,
  borrowedAt: new Date("2023-06-01"),
  dueDate: new Date("2023-06-15"),
  returnedAt: null // まだ返却されていない
};
```

### 学習のポイント

1. **型注釈の習慣**: 最初は明示的に型を書いて、型システムに慣れる
2. **エラーメッセージの理解**: TypeScriptのエラーメッセージを読んで理解する
3. **型推論の活用**: 冗長な型注釈を避け、適切に型推論を活用する
4. **実践的な設計**: 実際のアプリケーションを想定した型設計を行う
5. **段階的な学習**: 簡単な問題から始めて、徐々に複雑な問題に挑戦する

---

## 配列・タプル操作の実践

### ステップ4: 配列とタプルの高度な活用
```typescript
// array-tuple-advanced.ts

// 1. 型安全な配列操作
class TypeSafeArray<T> {
  private items: T[] = [];

  add(item: T): void {
    this.items.push(item);
  }

  get(index: number): T | undefined {
    return this.items[index];
  }

  filter(predicate: (item: T) => boolean): T[] {
    return this.items.filter(predicate);
  }

  map<U>(transform: (item: T) => U): U[] {
    return this.items.map(transform);
  }

  reduce<U>(reducer: (acc: U, item: T) => U, initial: U): U {
    return this.items.reduce(reducer, initial);
  }

  toArray(): readonly T[] {
    return [...this.items];
  }
}

// 2. 座標システム（タプル活用）
type Point2D = [x: number, y: number];
type Point3D = [x: number, y: number, z: number];
type Vector2D = [dx: number, dy: number];

class GeometryUtils {
  static distance2D([x1, y1]: Point2D, [x2, y2]: Point2D): number {
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  }

  static movePoint([x, y]: Point2D, [dx, dy]: Vector2D): Point2D {
    return [x + dx, y + dy];
  }

  static rotatePoint([x, y]: Point2D, angle: number): Point2D {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return [
      x * cos - y * sin,
      x * sin + y * cos
    ];
  }

  static centroid(points: Point2D[]): Point2D {
    const [sumX, sumY] = points.reduce(
      ([accX, accY], [x, y]) => [accX + x, accY + y],
      [0, 0] as Point2D
    );
    return [sumX / points.length, sumY / points.length];
  }

  static boundingBox(points: Point2D[]): [topLeft: Point2D, bottomRight: Point2D] {
    if (points.length === 0) {
      throw new Error("Cannot calculate bounding box for empty array");
    }

    const xs = points.map(([x]) => x);
    const ys = points.map(([, y]) => y);

    return [
      [Math.min(...xs), Math.min(...ys)],
      [Math.max(...xs), Math.max(...ys)]
    ];
  }
}

// 3. データ変換パイプライン
type ParseResult<T> = 
  | { success: true; value: T }
  | { success: false; error: string };

class DataProcessor {
  static parseNumbers(strings: string[]): ParseResult<number[]> {
    const results: number[] = [];
    
    for (const str of strings) {
      const num = parseFloat(str.trim());
      if (isNaN(num)) {
        return {
          success: false,
          error: `Invalid number: "${str}"`
        };
      }
      results.push(num);
    }
    
    return { success: true, value: results };
  }

  static calculateStatistics(numbers: number[]): {
    count: number;
    sum: number;
    mean: number;
    median: number;
    mode: number[];
    range: [min: number, max: number];
  } {
    if (numbers.length === 0) {
      throw new Error("Cannot calculate statistics for empty array");
    }

    const sorted = [...numbers].sort((a, b) => a - b);
    const sum = numbers.reduce((acc, num) => acc + num, 0);
    const mean = sum / numbers.length;

    // 中央値
    const median = sorted.length % 2 === 0
      ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
      : sorted[Math.floor(sorted.length / 2)];

    // 最頻値
    const frequency = new Map<number, number>();
    numbers.forEach(num => {
      frequency.set(num, (frequency.get(num) || 0) + 1);
    });
    
    const maxFreq = Math.max(...frequency.values());
    const mode = Array.from(frequency.entries())
      .filter(([, freq]) => freq === maxFreq)
      .map(([num]) => num);

    return {
      count: numbers.length,
      sum,
      mean,
      median,
      mode,
      range: [sorted[0], sorted[sorted.length - 1]]
    };
  }
}

// 使用例
const stringArray = new TypeSafeArray<string>();
stringArray.add("hello");
stringArray.add("world");
console.log(stringArray.toArray()); // ["hello", "world"]

const points: Point2D[] = [[0, 0], [3, 4], [6, 8]];
console.log("距離:", GeometryUtils.distance2D([0, 0], [3, 4])); // 5
console.log("重心:", GeometryUtils.centroid(points)); // [3, 4]

const parseResult = DataProcessor.parseNumbers(["1", "2.5", "3.7"]);
if (parseResult.success) {
  const stats = DataProcessor.calculateStatistics(parseResult.value);
  console.log("統計:", stats);
}
```

---

## 関数型の実践活用

### ステップ5: 高度な関数型パターン
```typescript
// advanced-function-types.ts

// 1. 関数型インターフェース
interface EventHandler<T = any> {
  (event: T): void;
}

interface Validator<T> {
  (value: T): boolean;
}

interface Transformer<T, U> {
  (input: T): U;
}

// 2. 高階関数の実装
class FunctionalUtils {
  // カリー化関数
  static curry<A, B, C>(fn: (a: A, b: B) => C): (a: A) => (b: B) => C {
    return (a: A) => (b: B) => fn(a, b);
  }

  // 関数合成
  static compose<A, B, C>(
    f: (b: B) => C,
    g: (a: A) => B
  ): (a: A) => C {
    return (a: A) => f(g(a));
  }

  // パイプライン
  static pipe<A, B, C>(
    value: A,
    f1: (a: A) => B,
    f2: (b: B) => C
  ): C {
    return f2(f1(value));
  }

  // メモ化
  static memoize<T extends (...args: any[]) => any>(fn: T): T {
    const cache = new Map();
    
    return ((...args: Parameters<T>): ReturnType<T> => {
      const key = JSON.stringify(args);
      
      if (cache.has(key)) {
        return cache.get(key);
      }
      
      const result = fn(...args);
      cache.set(key, result);
      return result;
    }) as T;
  }

  // デバウンス
  static debounce<T extends (...args: any[]) => any>(
    fn: T,
    delay: number
  ): (...args: Parameters<T>) => void {
    let timeoutId: NodeJS.Timeout;
    
    return (...args: Parameters<T>) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => fn(...args), delay);
    };
  }
}

// 3. バリデーション関数の組み合わせ
type ValidationResult = 
  | { isValid: true }
  | { isValid: false; errors: string[] };

class ValidationBuilder<T> {
  private validators: Array<{
    validator: Validator<T>;
    message: string;
  }> = [];

  addRule(validator: Validator<T>, message: string): this {
    this.validators.push({ validator, message });
    return this;
  }

  validate(value: T): ValidationResult {
    const errors: string[] = [];
    
    for (const { validator, message } of this.validators) {
      if (!validator(value)) {
        errors.push(message);
      }
    }
    
    return errors.length === 0
      ? { isValid: true }
      : { isValid: false, errors };
  }
}

// 4. 関数型プログラミングパターン
class Maybe<T> {
  constructor(private value: T | null | undefined) {}

  static of<T>(value: T | null | undefined): Maybe<T> {
    return new Maybe(value);
  }

  map<U>(fn: (value: T) => U): Maybe<U> {
    return this.value != null
      ? Maybe.of(fn(this.value))
      : Maybe.of(null);
  }

  flatMap<U>(fn: (value: T) => Maybe<U>): Maybe<U> {
    return this.value != null
      ? fn(this.value)
      : Maybe.of(null);
  }

  filter(predicate: (value: T) => boolean): Maybe<T> {
    return this.value != null && predicate(this.value)
      ? this
      : Maybe.of(null);
  }

  getOrElse(defaultValue: T): T {
    return this.value != null ? this.value : defaultValue;
  }

  isPresent(): boolean {
    return this.value != null;
  }
}

// 使用例
const add = (a: number, b: number) => a + b;
const curriedAdd = FunctionalUtils.curry(add);
console.log(curriedAdd(5)(3)); // 8

const double = (x: number) => x * 2;
const addOne = (x: number) => x + 1;
const doubleAndAddOne = FunctionalUtils.compose(addOne, double);
console.log(doubleAndAddOne(5)); // 11

// バリデーション例
const emailValidator = new ValidationBuilder<string>()
  .addRule(email => email.includes("@"), "メールアドレスに@が含まれていません")
  .addRule(email => email.length > 5, "メールアドレスが短すぎます")
  .addRule(email => !email.includes(" "), "メールアドレスにスペースが含まれています");

console.log(emailValidator.validate("test@example.com")); // { isValid: true }
console.log(emailValidator.validate("invalid")); // { isValid: false, errors: [...] }

// Maybe モナド例
const result = Maybe.of("hello")
  .map(s => s.toUpperCase())
  .map(s => s + " WORLD")
  .filter(s => s.length > 5)
  .getOrElse("DEFAULT");

console.log(result); // "HELLO WORLD"
```

---

## 実用的なアプリケーション例

### ステップ6: 型安全なタスク管理システム
```typescript
// task-management-system.ts

// 1. 基本的な型定義
type TaskId = string;
type UserId = string;
type Timestamp = number;

type TaskStatus = "todo" | "in_progress" | "review" | "done";
type TaskPriority = "low" | "medium" | "high" | "urgent";

type Task = {
  readonly id: TaskId;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId: UserId | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  dueDate: Timestamp | null;
  tags: readonly string[];
};

type User = {
  readonly id: UserId;
  name: string;
  email: string;
  role: "admin" | "member" | "viewer";
};

// 2. イベント型定義
type TaskEvent = 
  | { type: "task_created"; task: Task }
  | { type: "task_updated"; taskId: TaskId; changes: Partial<Omit<Task, "id" | "createdAt">> }
  | { type: "task_deleted"; taskId: TaskId }
  | { type: "task_assigned"; taskId: TaskId; assigneeId: UserId }
  | { type: "task_status_changed"; taskId: TaskId; oldStatus: TaskStatus; newStatus: TaskStatus };

// 3. タスク管理システムの実装
class TaskManager {
  private tasks = new Map<TaskId, Task>();
  private users = new Map<UserId, User>();
  private eventHandlers: Array<(event: TaskEvent) => void> = [];

  // ユーザー管理
  addUser(user: Omit<User, "id">): User {
    const newUser: User = {
      id: this.generateId(),
      ...user
    };
    this.users.set(newUser.id, newUser);
    return newUser;
  }

  getUser(userId: UserId): User | undefined {
    return this.users.get(userId);
  }

  // タスク作成
  createTask(
    taskData: Omit<Task, "id" | "createdAt" | "updatedAt">
  ): Task {
    const now = Date.now();
    const task: Task = {
      id: this.generateId(),
      createdAt: now,
      updatedAt: now,
      ...taskData
    };

    this.tasks.set(task.id, task);
    this.emitEvent({ type: "task_created", task });
    return task;
  }

  // タスク更新
  updateTask(
    taskId: TaskId,
    updates: Partial<Omit<Task, "id" | "createdAt">>
  ): Task | null {
    const existingTask = this.tasks.get(taskId);
    if (!existingTask) return null;

    const updatedTask: Task = {
      ...existingTask,
      ...updates,
      updatedAt: Date.now()
    };

    this.tasks.set(taskId, updatedTask);
    this.emitEvent({ type: "task_updated", taskId, changes: updates });

    // ステータス変更の特別なイベント
    if (updates.status && updates.status !== existingTask.status) {
      this.emitEvent({
        type: "task_status_changed",
        taskId,
        oldStatus: existingTask.status,
        newStatus: updates.status
      });
    }

    return updatedTask;
  }

  // タスク削除
  deleteTask(taskId: TaskId): boolean {
    const deleted = this.tasks.delete(taskId);
    if (deleted) {
      this.emitEvent({ type: "task_deleted", taskId });
    }
    return deleted;
  }

  // タスク検索・フィルタリング
  getTasks(filter?: {
    status?: TaskStatus;
    priority?: TaskPriority;
    assigneeId?: UserId;
    tags?: string[];
  }): Task[] {
    let tasks = Array.from(this.tasks.values());

    if (filter) {
      if (filter.status) {
        tasks = tasks.filter(task => task.status === filter.status);
      }
      if (filter.priority) {
        tasks = tasks.filter(task => task.priority === filter.priority);
      }
      if (filter.assigneeId) {
        tasks = tasks.filter(task => task.assigneeId === filter.assigneeId);
      }
      if (filter.tags && filter.tags.length > 0) {
        tasks = tasks.filter(task =>
          filter.tags!.every(tag => task.tags.includes(tag))
        );
      }
    }

    return tasks;
  }

  // 統計情報
  getStatistics(): {
    totalTasks: number;
    tasksByStatus: Record<TaskStatus, number>;
    tasksByPriority: Record<TaskPriority, number>;
    overdueTasks: number;
  } {
    const tasks = Array.from(this.tasks.values());
    const now = Date.now();

    const tasksByStatus = tasks.reduce((acc, task) => {
      acc[task.status] = (acc[task.status] || 0) + 1;
      return acc;
    }, {} as Record<TaskStatus, number>);

    const tasksByPriority = tasks.reduce((acc, task) => {
      acc[task.priority] = (acc[task.priority] || 0) + 1;
      return acc;
    }, {} as Record<TaskPriority, number>);

    const overdueTasks = tasks.filter(task =>
      task.dueDate && task.dueDate < now && task.status !== "done"
    ).length;

    return {
      totalTasks: tasks.length,
      tasksByStatus,
      tasksByPriority,
      overdueTasks
    };
  }

  // イベント処理
  addEventListener(handler: (event: TaskEvent) => void): void {
    this.eventHandlers.push(handler);
  }

  removeEventListener(handler: (event: TaskEvent) => void): void {
    const index = this.eventHandlers.indexOf(handler);
    if (index > -1) {
      this.eventHandlers.splice(index, 1);
    }
  }

  private emitEvent(event: TaskEvent): void {
    this.eventHandlers.forEach(handler => handler(event));
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}

// 使用例
const taskManager = new TaskManager();

// イベントリスナーの設定
taskManager.addEventListener((event) => {
  console.log("Task Event:", event);
});

// ユーザー作成
const user1 = taskManager.addUser({
  name: "田中太郎",
  email: "tanaka@example.com",
  role: "member"
});

const user2 = taskManager.addUser({
  name: "佐藤花子",
  email: "sato@example.com",
  role: "admin"
});

// タスク作成
const task1 = taskManager.createTask({
  title: "TypeScript学習",
  description: "Step02の内容を完了する",
  status: "todo",
  priority: "high",
  assigneeId: user1.id,
  dueDate: Date.now() + 7 * 24 * 60 * 60 * 1000, // 1週間後
  tags: ["学習", "TypeScript"]
});

const task2 = taskManager.createTask({
  title: "コードレビュー",
  description: "プルリクエストのレビューを行う",
  status: "in_progress",
  priority: "medium",
  assigneeId: user2.id,
  dueDate: null,
  tags: ["レビュー", "開発"]
});

// タスク更新
taskManager.updateTask(task1.id, {
  status: "in_progress",
  description: "Step02の演習問題に取り組み中"
});

// 統計情報の表示
console.log("統計情報:", taskManager.getStatistics());

// フィルタリング
const highPriorityTasks = taskManager.getTasks({ priority: "high" });
console.log("高優先度タスク:", highPriorityTasks);

const user1Tasks = taskManager.getTasks({ assigneeId: user1.id });
console.log("田中さんのタスク:", user1Tasks);
```

---

## 🎯 実行とテストの方法

### 基本的な実行方法
```bash
# TypeScriptファイルをコンパイルして実行
npx tsc filename.ts
node filename.js

# ts-nodeを使って直接実行
npx ts-node filename.ts
```

### 型チェックの確認
```bash
# 型チェックのみ実行（ファイル出力なし）
npx tsc --noEmit filename.ts

# 詳細なエラー情報を表示
npx tsc --noEmit --pretty filename.ts
```

### 開発用の設定
```json
// package.json にスクリプトを追加
{
  "scripts": {
    "dev": "ts-node src/index.ts",
    "build": "tsc",
    "type-check": "tsc --noEmit",
    "watch": "tsc --watch"
  }
}
```

---
## オブジェクト型の実践活用

### インターフェースの基本設計

```typescript
// user-management.ts

// 基本的なユーザーインターフェース
interface User {
  id: number;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

// オプショナルプロパティを持つプロフィール
interface UserProfile {
  userId: number;
  avatar?: string;
  bio?: string;
  website?: string;
  socialLinks?: {
    twitter?: string;
    github?: string;
    linkedin?: string;
  };
}

// 読み取り専用プロパティ
interface ReadonlyConfig {
  readonly apiUrl: string;
  readonly version: string;
  readonly buildDate: Date;
}

// インデックスシグネチャ
interface Settings {
  [key: string]: string | number | boolean;
}

// 使用例
const user: User = {
  id: 1,
  name: "田中太郎",
  email: "tanaka@example.com",
  createdAt: new Date("2023-01-01"),
  updatedAt: new Date("2023-06-01")
};

const profile: UserProfile = {
  userId: 1,
  bio: "フロントエンドエンジニア",
  socialLinks: {
    github: "tanaka-dev"
  }
};
```

### 複雑なオブジェクト型の設計

```typescript
// e-commerce-types.ts

// 商品カテゴリ
interface Category {
  id: number;
  name: string;
  slug: string;
  parentId?: number;
  children?: Category[];
}

// 商品情報
interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  currency: string;
  category: Category;
  images: string[];
  specifications: Record<string, string>;
  availability: {
    inStock: boolean;
    quantity: number;
    restockDate?: Date;
  };
  ratings: {
    average: number;
    count: number;
    distribution: {
      [stars: number]: number;
    };
  };
}

// ショッピングカート
interface CartItem {
  product: Product;
  quantity: number;
  selectedOptions?: Record<string, string>;
}

interface ShoppingCart {
  id: string;
  userId: number;
  items: CartItem[];
  totals: {
    subtotal: number;
    tax: number;
    shipping: number;
    total: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

// 注文情報
interface Order {
  id: string;
  userId: number;
  items: CartItem[];
  shippingAddress: Address;
  billingAddress: Address;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  totals: ShoppingCart['totals'];
  timestamps: {
    ordered: Date;
    shipped?: Date;
    delivered?: Date;
  };
}

interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface PaymentMethod {
  type: "credit_card" | "paypal" | "bank_transfer";
  details: Record<string, unknown>;
}

type OrderStatus = "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
```

---

## プロジェクト型定義サンプル

### 商品管理システムの完全な型定義

```typescript
// product-management-system.ts

// 基本型定義
type ProductID = number;
type CategoryID = number;
type UserID = number;

// 商品ステータス
type ProductStatus = "draft" | "active" | "inactive" | "discontinued";

// 商品カテゴリ
interface ProductCategory {
  id: CategoryID;
  name: string;
  slug: string;
  description?: string;
  parentId?: CategoryID;
  level: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// 商品基本情報
interface Product {
  id: ProductID;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  sku: string;
  barcode?: string;
  categoryId: CategoryID;
  status: ProductStatus;
  pricing: ProductPricing;
  inventory: ProductInventory;
  media: ProductMedia;
  seo: ProductSEO;
  metadata: ProductMetadata;
  createdAt: Date;
  updatedAt: Date;
  createdBy: UserID;
  updatedBy: UserID;
}

// 価格情報
interface ProductPricing {
  basePrice: number;
  salePrice?: number;
  currency: string;
  taxClass: string;
  costPrice?: number;
  margin?: number;
}

// 在庫情報
interface ProductInventory {
  trackQuantity: boolean;
  quantity: number;
  reservedQuantity: number;
  availableQuantity: number;
  lowStockThreshold: number;
  allowBackorder: boolean;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
    unit: string;
  };
}

// メディア情報
interface ProductMedia {
  images: ProductImage[];
  videos?: ProductVideo[];
  documents?: ProductDocument[];
}

interface ProductImage {
  id: string;
  url: string;
  alt: string;
  isPrimary: boolean;
  sortOrder: number;
}

interface ProductVideo {
  id: string;
  url: string;
  title: string;
  thumbnail: string;
  duration: number;
}

interface ProductDocument {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
}

// SEO情報
interface ProductSEO {
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
}

// メタデータ
interface ProductMetadata {
  tags: string[];
  attributes: Record<string, unknown>;
  customFields: Record<string, unknown>;
}

// 商品作成・更新用の型
type CreateProductInput = Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy'>;
type UpdateProductInput = Partial<CreateProductInput>;

// 商品検索・フィルタ用の型
interface ProductSearchParams {
  query?: string;
  categoryId?: CategoryID;
  status?: ProductStatus;
  priceRange?: {
    min: number;
    max: number;
  };
  inStock?: boolean;
  tags?: string[];
  sortBy?: 'name' | 'price' | 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

// 商品一覧レスポンス
interface ProductListResponse {
  products: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  filters: {
    categories: ProductCategory[];
    priceRange: {
      min: number;
      max: number;
    };
    availableTags: string[];
  };
}
```

---

## 統計データ型定義

### 商品統計システム

```typescript
// product-statistics.ts

// 基本統計データ
interface BasicStatistics {
  count: number;
  sum: number;
  average: number;
  median: number;
  min: number;
  max: number;
  standardDeviation: number;
}

// 期間指定
interface DateRange {
  startDate: Date;
  endDate: Date;
}

// 商品統計
interface ProductStatistics {
  totalProducts: number;
  activeProducts: number;
  inactiveProducts: number;
  draftProducts: number;
  discontinuedProducts: number;
  averagePrice: number;
  priceRange: {
    min: number;
    max: number;
  };
  categoryDistribution: CategoryStatistics[];
  inventoryStatistics: InventoryStatistics;
  recentActivity: RecentActivityStatistics;
}

// カテゴリ別統計
interface CategoryStatistics {
  categoryId: CategoryID;
  categoryName: string;
  productCount: number;
  averagePrice: number;
  totalValue: number;
  percentage: number;
}

// 在庫統計
interface InventoryStatistics {
  totalItems: number;
  totalValue: number;
  lowStockItems: number;
  outOfStockItems: number;
  averageStockLevel: number;
  turnoverRate: number;
}

// 最近のアクティビティ統計
interface RecentActivityStatistics {
  period: DateRange;
  newProducts: number;
  updatedProducts: number;
  deletedProducts: number;
  priceChanges: number;
  stockMovements: StockMovement[];
}

// 在庫移動
interface StockMovement {
  productId: ProductID;
  productName: string;
  movementType: 'in' | 'out' | 'adjustment';
  quantity: number;
  reason: string;
  timestamp: Date;
}

// 売上統計（将来の拡張用）
interface SalesStatistics {
  period: DateRange;
  totalSales: number;
  totalOrders: number;
  averageOrderValue: number;
  topSellingProducts: TopSellingProduct[];
  salesByCategory: CategorySales[];
  salesTrend: SalesTrendData[];
}

interface TopSellingProduct {
  productId: ProductID;
  productName: string;
  quantitySold: number;
  revenue: number;
  rank: number;
}

interface CategorySales {
  categoryId: CategoryID;
  categoryName: string;
  totalSales: number;
  totalOrders: number;
  percentage: number;
}

interface SalesTrendData {
  date: Date;
  sales: number;
  orders: number;
}

// 統計レポート
interface StatisticsReport {
  generatedAt: Date;
  period: DateRange;
  productStatistics: ProductStatistics;
  salesStatistics?: SalesStatistics;
  summary: {
    totalRevenue: number;
    totalProducts: number;
    totalOrders: number;
    growthRate: number;
  };
}
```

---

## API型定義パターン

### RESTful API の型定義

```typescript
// api-types.ts

// HTTP メソッド
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

// HTTP ステータスコード
type HttpStatusCode = 200 | 201 | 204 | 400 | 401 | 403 | 404 | 409 | 422 | 500;

// 基本APIレスポンス
interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: ApiError;
  message?: string;
  timestamp: string;
  requestId: string;
}

// APIエラー
interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  field?: string;
}

// ページネーション
interface PaginationParams {
  page: number;
  limit: number;
  offset?: number;
}

interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

// 商品API エンドポイント
interface ProductApiEndpoints {
  // GET /api/products
  getProducts: {
    method: 'GET';
    params?: ProductSearchParams;
    response: ApiResponse<PaginatedResponse<Product>>;
  };

  // GET /api/products/:id
  getProduct: {
    method: 'GET';
    params: { id: ProductID };
    response: ApiResponse<Product>;
  };

  // POST /api/products
  createProduct: {
    method: 'POST';
    body: CreateProductInput;
    response: ApiResponse<Product>;
  };

  // PUT /api/products/:id
  updateProduct: {
    method: 'PUT';
    params: { id: ProductID };
    body: UpdateProductInput;
    response: ApiResponse<Product>;
  };

  // DELETE /api/products/:id
  deleteProduct: {
    method: 'DELETE';
    params: { id: ProductID };
    response: ApiResponse<void>;
  };
}

// API クライアント
interface ApiClient {
  get<T>(url: string, params?: Record<string, unknown>): Promise<ApiResponse<T>>;
  post<T>(url: string, data?: unknown): Promise<ApiResponse<T>>;
  put<T>(url: string, data?: unknown): Promise<ApiResponse<T>>;
  patch<T>(url: string, data?: unknown): Promise<ApiResponse<T>>;
  delete<T>(url: string): Promise<ApiResponse<T>>;
}

// リクエスト設定
interface RequestConfig {
  baseURL: string;
  timeout: number;
  headers: Record<string, string>;
  retries: number;
  retryDelay: number;
}

// WebSocket API
interface WebSocketMessage<T = unknown> {
  type: string;
  payload: T;
  timestamp: string;
  id: string;
}

interface ProductUpdateMessage {
  type: 'product.updated';
  payload: {
    productId: ProductID;
    changes: Partial<Product>;
    updatedBy: UserID;
  };
}

interface InventoryUpdateMessage {
  type: 'inventory.updated';
  payload: {
    productId: ProductID;
    oldQuantity: number;
    newQuantity: number;
    reason: string;
  };
}

type WebSocketMessageTypes = ProductUpdateMessage | InventoryUpdateMessage;
```

---

## 演習解答例とヒント

### Session1 演習の解答例

```typescript
// session1-exercise-solutions.ts

// 演習1: 基本型の実践 - 解答例
interface UserInfo {
  id: number;
  name: string;
  email: string;
  isActive: boolean;
  lastLoginAt: Date | null;
}

type UserRole = "admin" | "user" | "guest";

interface AppSettings {
  theme: "light" | "dark" | null;
  language: string | undefined;
  notifications: boolean;
}

function createUser(
  name: string, 
  email: string, 
  role: UserRole
): UserInfo & { role: UserRole } {
  return {
    id: Math.floor(Math.random() * 1000),
    name: name,
    email: email,
    role: role,
    isActive: true,
    lastLoginAt: null,
  };
}

function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// 演習2: 型推論の活用 - 解答例
const userConfig = {
  theme: "dark",
  fontSize: 14,
  autoSave: true,
}; // 型: { theme: string; fontSize: number; autoSave: boolean; }

const statusList = ["pending", "approved", "rejected"] as const; 
// 型: readonly ["pending", "approved", "rejected"]

function processStatus(status: (typeof statusList)[number]) {
  // statusの型: "pending" | "approved" | "rejected"
  return `Processing: ${status}`;
}

let result = processStatus("pending"); // resultの型: string
```

### Session2 演習の解答例

```typescript
// session2-exercise-solutions.ts

// 演習1: ショッピングカート管理システム - 解答例
interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  inStock: boolean;
}

interface CartItem {
  product: Product;
  quantity: number;
  addedAt: Date;
}

class ShoppingCart {
  private items: CartItem[] = [];

  addItem(product: Product, quantity: number): void {
    const existingItem = this.items.find(item => item.product.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.items.push({
        product,
        quantity,
        addedAt: new Date()
      });
    }
  }

  removeItem(productId: number): void {
    this.items = this.items.filter(item => item.product.id !== productId);
  }

  getItems(): readonly CartItem[] {
    return [...this.items];
  }

  getTotalPrice(): number {
    return this.items.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0);
  }

  getItemCount(): number {
    return this.items.reduce((count, item) => count + item.quantity, 0);
  }
}

// 演習2: データ変換パイプライン - 解答例
interface RawUserData {
  id: string;
  full_name: string;
  email_address: string;
  is_active: string;
  created_at: string;
}

interface ProcessedUser {
  id: number;
  name: string;
  email: string;
  isActive: boolean;
  createdAt: Date;
}

function transformUserData(rawData: RawUserData[]): ProcessedUser[] {
  return rawData.map(raw => ({
    id: parseInt(raw.id, 10),
    name: raw.full_name,
    email: raw.email_address,
    isActive: raw.is_active === "true",
    createdAt: new Date(raw.created_at)
  }));
}

function filterActiveUsers(users: ProcessedUser[]): ProcessedUser[] {
  return users.filter(user => user.isActive);
}

function sortUsersByName(users: ProcessedUser[]): ProcessedUser[] {
  return [...users].sort((a, b) => a.name.localeCompare(b.name));
}
```

### Session3 演習のヒント

```typescript
// session3-exercise-hints.ts

// プロジェクト完成のヒント

// 1. 型定義の段階的な構築
// まず基本的な型から始めて、徐々に複雑な型を構築する

// 2. 型の再利用性を考慮
// 共通の型は別途定義して再利用する
type ID = number;
type Timestamp = Date;

// 3. オプショナルプロパティの適切な使用
// 必須項目と任意項目を明確に区別する

// 4. Union型の効果的な活用
// 限定された値のセットにはUnion型を使用

// 5. インターフェースの継承
// 共通の構造は基底インターフェースとして定義

// 6. 型ガードの実装
function isValidStatus(value: string): value is ProductStatus {
  return ["draft", "active", "inactive", "discontinued"].includes(value);
}

// 7. ユーティリティ型の活用
type PartialProduct = Partial<Product>;
type RequiredProduct = Required<Product>;
type ProductKeys = keyof Product;
```

---

## プロジェクト完成例とヒント

### 完成した商品管理システム

```typescript
// complete-product-management.ts

// 完全な型定義システム
namespace ProductManagement {
  
  // 基本型
  export type ProductID = number;
  export type CategoryID = number;
  export type UserID = number;
  
  // 商品ステータス
  export type ProductStatus = "draft" | "active" | "inactive" | "discontinued";
  
  // 完全な商品型
  export interface Product {
    readonly id: ProductID;
    name: string;
    description: string;
    price: number;
    categoryId: CategoryID;
    status: ProductStatus;
    stock: number;
    readonly createdAt: Date;
    readonly updatedAt: Date;
  }
  
  // サービス層
  export interface ProductService {
    create(input: CreateProductInput): Promise<ApiResponse<Product>>;
    getById(id: ProductID): Promise<ApiResponse<Product>>;
    list(params: SearchParams): Promise<ApiResponse<PaginatedResponse<Product>>>;
    update(id: ProductID, input: UpdateProductInput): Promise<ApiResponse<Product>>;
    delete(id: ProductID): Promise<ApiResponse<void>>;
    getStatistics(): Promise<ApiResponse<ProductStatistics>>;
  }
  
  // 入力型
  export type CreateProductInput = Omit<Product, 'id' | 'createdAt' | 'updatedAt'>;
  export type UpdateProductInput = Partial<CreateProductInput>;
  
  // 検索パラメータ
  export interface SearchParams {
    query?: string;
    categoryId?: CategoryID;
    status?: ProductStatus;
    priceRange?: { min: number; max: number };
    page?: number;
    limit?: number;
  }
  
  // 統計情報
  export interface ProductStatistics {
    totalProducts: number;
    activeProducts: number;
    averagePrice: number;
    categoryDistribution: Array<{
      categoryId: CategoryID;
      count: number;
      percentage: number;
    }>;
  }
  
  // API レスポンス
  export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    timestamp: Date;
  }
  
  export interface PaginatedResponse<T> {
    items: T[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }
}

// 使用例
const productService: ProductManagement.ProductService = {
  async create(input) {
    // 実装
    return {
      success: true,
      data: {
        ...input,
        id: Math.floor(Math.random() * 1000),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      timestamp: new Date()
    };
  },
  
  async getById(id) {
    // 実装
    return {
      success: true,
      timestamp: new Date()
    };
  },
  
  // 他のメソッドの実装...
  async list(params) { return { success: true, timestamp: new Date() }; },
  async update(id, input) { return { success: true, timestamp: new Date() }; },
  async delete(id) { return { success: true, timestamp: new Date() }; },
  async getStatistics() { return { success: true, timestamp: new Date() }; }
};
```

### 実装のベストプラクティス

```typescript
// best-practices.ts

// 1. 型の命名規則
// - インターフェース: PascalCase
// - 型エイリアス: PascalCase  
// - 変数・関数: camelCase

// 2. 型の組織化
// 関連する型はnamespaceでグループ化
namespace UserManagement {
  export interface User { /* ... */ }
  export interface UserProfile { /* ... */ }
  export type UserRole = "admin" | "user";
}

// 3. 型ガードの実装
function isProduct(obj: unknown): obj is ProductManagement.Product {
  return typeof obj === 'object' && 
         obj !== null && 
         'id' in obj && 
         'name' in obj;
}

// 4. エラーハンドリング
type Result<T, E = Error> = 
  | { success: true; data: T }
  | { success: false; error: E };

// 5. 型の拡張性
interface BaseEntity {
  id: number;
  createdAt: Date;
  updatedAt: Date;
}

interface Product extends BaseEntity {
  name: string;
  price: number;
}

// 6. 設定の型安全性
interface AppConfig {
  readonly database: {
    readonly host: string;
    readonly port: number;
  };
  readonly api: {
    readonly baseUrl: string;
    readonly timeout: number;
  };
}

// 7. 環境変数の型定義
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test';
      DATABASE_URL: string;
      API_KEY: string;
    }
  }
}
```

### 学習の総まとめ

1. **型システムの理解**: TypeScriptの型システムを深く理解し、適切に活用できる
2. **実践的な設計**: 実際のアプリケーションで使用できる型設計ができる
3. **保守性の確保**: 変更に強く、拡張しやすい型設計ができる
4. **チーム開発**: 他の開発者が理解しやすい型定義を作成できる
5. **パフォーマンス**: 型チェックのパフォーマンスを考慮した設計ができる

---

## 📚 学習の進め方

1. **段階的に進める**: 基本的な型から始めて、徐々に複雑な型システムに挑戦
2. **実際に動かす**: コードをコピーして実際に実行してみる
3. **改造してみる**: 既存のコードを改造して理解を深める
4. **型エラーを確認**: 意図的に型エラーを発生させて、エラーメッセージを理解する
5. **実用例を作成**: 学習した内容を使って実用的なアプリケーションを作成する

---

**📌 重要**: これらのコード例は実際に動作するものです。コピーして実行し、改造して理解を深めてください。TypeScriptの型システムの強力さと柔軟性を実感できるはずです。