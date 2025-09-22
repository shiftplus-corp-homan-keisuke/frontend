# STEP04 総復習：型ガード完全習得

## 📋 概要

このファイルは、STEP04「型ガード完全習得」の理論学習内容を総復習するためのドキュメントです。型ガードの基礎から高度なアサーション関数まで、実践的な理解を深めることを目的としています。

## 🎯 学習目標

- [ ] 基本型ガード（typeof、instanceof、in演算子）の完全理解
- [ ] ユーザー定義型ガードの実装と活用方法の習得

---

## 1. 型ガードの基礎復習

### 1.1 型ガードとは何か

**概念**
型ガードは、TypeScriptコンパイラが認識できる特定のパターンを使って、値の型を絞り込む仕組みです。

**重要性**
- **型安全性の確保**: ユニオン型の値を安全に扱える
- **実行時エラーの防止**: 型の不一致によるエラーを事前に防ぐ
- **開発効率の向上**: IDEの補完機能が正確に動作する

### 1.2 typeof型ガード

**概念**
`typeof`演算子を使用して、プリミティブ型を判定し、型を安全に絞り込みます。

```typescript
// 基本的なtypeof型ガード
function processValue(value: string | number | boolean): string {
  if (typeof value === "string") {
    return value.toUpperCase();
  } else if (typeof value === "number") {
    return value.toFixed(2);
  } else {
    return value ? "真" : "偽";
  }
}

// 実用例：フォーム入力値の処理
function validateFormValue(value: string | number | null): string {
  if (typeof value === "string") {
    return value.trim() === "" ? "入力が必要です" : "有効";
  } else if (typeof value === "number") {
    return isNaN(value) ? "無効な数値です" : "有効";
  } else {
    return "値が設定されていません";
  }
}
```

### 1.3 in演算子による型ガード

**概念**
`in`演算子を使用して、オブジェクトに特定のプロパティが存在するかを判定し、型を絞り込みます。

```typescript
interface Teacher {
  id: number;
  name: string;
  subject: string;
}

interface Student {
  id: number;
  name: string;
  grade: number;
}

type Person = Teacher | Student;

function getPersonInfo(person: Person): string {
  if ("subject" in person) {
    return `${person.name}先生は${person.subject}を教えています`;
  } else {
    return `${person.name}さんは${person.grade}年生です`;
  }
}

// API レスポンスの処理例
interface SuccessResponse {
  status: "success";
  data: any;
}

interface ErrorResponse {
  status: "error";
  message: string;
}

type ApiResponse = SuccessResponse | ErrorResponse;

function handleApiResponse(response: ApiResponse): string {
  if ("data" in response) {
    return `成功: データを取得しました`;
  } else {
    return `エラー: ${response.message}`;
  }
}
```

### 1.4 instanceof型ガード

**概念**
`instanceof`演算子を使用して、オブジェクトが特定のクラスのインスタンスかを判定します。

```typescript
class ValidationError extends Error {
  constructor(message: string, public field: string) {
    super(message);
    this.name = "ValidationError";
  }
}

class NetworkError extends Error {
  constructor(message: string, public statusCode: number) {
    super(message);
    this.name = "NetworkError";
  }
}

function handleError(error: Error): string {
  if (error instanceof ValidationError) {
    return `入力エラー: ${error.message} (フィールド: ${error.field})`;
  } else if (error instanceof NetworkError) {
    return `ネットワークエラー: ${error.message} (ステータス: ${error.statusCode})`;
  } else {
    return `一般エラー: ${error.message}`;
  }
}

// 日付オブジェクトの判定
function formatValue(value: string | number | Date): string {
  if (value instanceof Date) {
    return value.toLocaleDateString("ja-JP");
  } else if (typeof value === "number") {
    return value.toLocaleString();
  } else {
    return value;
  }
}
```

---

## 2. ユーザー定義型ガード

### 2.1 カスタム型ガード関数の作成方法

**概念**
独自の型ガード関数を作成して、複雑な型判定を行います。戻り値の型に`is`キーワードを使用します。

```typescript
// 基本的なユーザー定義型ガード
function isString(value: unknown): value is string {
  return typeof value === "string";
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isPositiveNumber(value: unknown): value is number {
  return typeof value === "number" && value > 0;
}

// 使用例
function processUserInput(input: unknown): string {
  if (isPositiveNumber(input)) {
    return `正の数値: ${input}`;
  } else if (isNonEmptyString(input)) {
    return `文字列: ${input}`;
  } else {
    return "無効な入力です";
  }
}
```

### 2.2 型述語（type predicate）の活用

**概念**
`value is Type`構文を使って、関数が`true`を返した場合に引数が特定の型であることをTypeScriptに伝えます。

```typescript
// 高度な型述語
function isValidEmail(value: unknown): value is string {
  if (typeof value !== "string") return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value);
}

// オブジェクトの型述語
interface User {
  id: number;
  name: string;
  email: string;
  isActive: boolean;
}

function isUser(value: unknown): value is User {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    "name" in value &&
    "email" in value &&
    "isActive" in value &&
    typeof (value as any).id === "number" &&
    isNonEmptyString((value as any).name) &&
    isValidEmail((value as any).email) &&
    typeof (value as any).isActive === "boolean"
  );
}

function processUserData(data: unknown): string {
  if (isUser(data)) {
    return `ユーザー: ${data.name} (${data.email}) - ${data.isActive ? "アクティブ" : "非アクティブ"}`;
  }
  return "無効なユーザーデータです";
}
```

### 2.3 複雑な型判定の実装

**概念**
複数の条件を組み合わせた複雑な型判定を、再利用可能な型ガード関数として実装します。

```typescript
interface Product {
  id: number;
  name: string;
  price: number;
  inStock: boolean;
}

function isProduct(value: unknown): value is Product {
  if (typeof value !== "object" || value === null) return false;
  
  const obj = value as any;
  return (
    typeof obj.id === "number" &&
    isNonEmptyString(obj.name) &&
    typeof obj.price === "number" &&
    obj.price > 0 &&
    typeof obj.inStock === "boolean"
  );
}

// 配列の型ガード
function isProductArray(value: unknown): value is Product[] {
  return Array.isArray(value) && value.every(isProduct);
}

// ジェネリック型ガード
function isArrayOf<T>(
  value: unknown,
  itemGuard: (item: unknown) => item is T
): value is T[] {
  return Array.isArray(value) && value.every(itemGuard);
}
```

---

## 

### 3.1 `asserts`キーワードの使用

**概念**
`asserts`キーワードを使用したアサーション関数は、条件が満たされない場合にエラーを投げ、満たされた場合はその後のコードで型が保証されることをTypeScriptに伝えます。

```typescript
// 基本的なアサーション関数
function assertIsString(value: unknown): asserts value is string {
  if (typeof value !== "string") {
    throw new Error("値は文字列である必要があります");
  }
}

function assertIsNumber(value: unknown): asserts value is number {
  if (typeof value !== "number") {
    throw new Error("値は数値である必要があります");
  }
}

// 使用例
function processUserData(name: unknown, age: unknown): string {
  assertIsString(name);
  assertIsNumber(age);
  
  // この時点でname、ageの型が確定している
  return `ユーザー: ${name} (${age}歳)`;
}
```
