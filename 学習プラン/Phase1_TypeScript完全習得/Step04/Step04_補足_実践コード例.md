# Step04 実践コード例

> 💡 **このファイルについて**: ユニオン型と型ガードの段階的な学習のためのコード例集です。

## 📋 目次
1. [基本的なユニオン型の活用](#基本的なユニオン型の活用)
2. [型ガードの実装パターン](#型ガードの実装パターン)
3. [判別可能なユニオンの実践](#判別可能なユニオンの実践)
4. [実用的なエラーハンドリング](#実用的なエラーハンドリング)
5. [ユーザー管理システム完全版](#ユーザー管理システム完全版)

---

## 基本的なユニオン型の活用

### ステップ1: シンプルなユニオン型
```typescript
// basic-union.ts

// 基本的なユニオン型
type ID = string | number;
type Status = "pending" | "approved" | "rejected";

function formatID(id: ID): string {
  // 共通のメソッドのみ使用可能
  return `ID: ${id.toString()}`;
}

function processStatus(status: Status): string {
  switch (status) {
    case "pending":
      return "⏳ 処理中";
    case "approved":
      return "✅ 承認済み";
    case "rejected":
      return "❌ 却下";
  }
}

// 使用例
console.log(formatID(123));        // "ID: 123"
console.log(formatID("abc-123"));  // "ID: abc-123"
console.log(processStatus("approved")); // "✅ 承認済み"
```

**実行方法**:
```bash
npx ts-node basic-union.ts
```

**学習ポイント**:
- ユニオン型の基本的な定義方法
- 共通プロパティへのアクセス
- リテラル型のユニオン

### ステップ2: 型ガードの基本
```typescript
// type-guards.ts

type StringOrNumber = string | number;

// typeof型ガード
function processValue(value: StringOrNumber): string {
  if (typeof value === "string") {
    // この分岐内ではvalueはstring型
    return value.toUpperCase();
  } else {
    // この分岐内ではvalueはnumber型
    return value.toFixed(2);
  }
}

// 配列の型ガード
function processArray(arr: (string | number)[]): void {
  arr.forEach(item => {
    if (typeof item === "string") {
      console.log(`文字列: ${item.toUpperCase()}`);
    } else {
      console.log(`数値: ${item.toFixed(1)}`);
    }
  });
}

// カスタム型ガード
function isString(value: unknown): value is string {
  return typeof value === "string";
}

function isNumber(value: unknown): value is number {
  return typeof value === "number";
}

function safeProcess(value: unknown): string {
  if (isString(value)) {
    return `文字列: ${value}`;
  } else if (isNumber(value)) {
    return `数値: ${value}`;
  } else {
    return "不明な型";
  }
}

// 使用例
console.log(processValue("hello"));     // "HELLO"
console.log(processValue(3.14159));     // "3.14"

processArray(["hello", 42, "world", 3.14]);

console.log(safeProcess("test"));       // "文字列: test"
console.log(safeProcess(123));          // "数値: 123"
console.log(safeProcess(true));         // "不明な型"
```

**学習ポイント**:
- typeof型ガードの使用
- カスタム型ガードの実装
- 型述語（value is Type）の活用

### ステップ3: オブジェクト型のユニオン
```typescript
// object-union.ts

// オブジェクト型のユニオン
type User = {
  type: "user";
  name: string;
  email: string;
};

type Admin = {
  type: "admin";
  name: string;
  permissions: string[];
};

type Guest = {
  type: "guest";
  sessionId: string;
};

type Account = User | Admin | Guest;

// in演算子を使った型ガード
function getAccountInfo(account: Account): string {
  if ("email" in account) {
    // Userの場合
    return `ユーザー: ${account.name} (${account.email})`;
  } else if ("permissions" in account) {
    // Adminの場合
    return `管理者: ${account.name} (権限: ${account.permissions.join(", ")})`;
  } else {
    // Guestの場合
    return `ゲスト: セッション ${account.sessionId}`;
  }
}

// 判別プロパティを使った型ガード
function getAccountDetails(account: Account): string {
  switch (account.type) {
    case "user":
      return `ユーザー: ${account.name} - ${account.email}`;
    case "admin":
      return `管理者: ${account.name} - 権限数: ${account.permissions.length}`;
    case "guest":
      return `ゲスト: ${account.sessionId}`;
  }
}

// 使用例
const user: User = {
  type: "user",
  name: "Alice",
  email: "alice@example.com"
};

const admin: Admin = {
  type: "admin",
  name: "Bob",
  permissions: ["read", "write", "delete"]
};

const guest: Guest = {
  type: "guest",
  sessionId: "sess_123456"
};

console.log(getAccountInfo(user));
console.log(getAccountInfo(admin));
console.log(getAccountInfo(guest));

console.log(getAccountDetails(user));
console.log(getAccountDetails(admin));
console.log(getAccountDetails(guest));
```

**学習ポイント**:
- オブジェクト型のユニオン
- in演算子による型ガード
- 判別プロパティの活用

---

## 型ガードの実装パターン

### ステップ4: 高度な型ガード
```typescript
// advanced-type-guards.ts

// 複雑なオブジェクトの型ガード
interface ApiSuccessResponse {
  success: true;
  data: any;
  timestamp: number;
}

interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
  };
  timestamp: number;
}

type ApiResponse = ApiSuccessResponse | ApiErrorResponse;

// 型ガード関数
function isSuccessResponse(response: ApiResponse): response is ApiSuccessResponse {
  return response.success === true;
}

function isErrorResponse(response: ApiResponse): response is ApiErrorResponse {
  return response.success === false;
}

// より厳密な型ガード
function isValidSuccessResponse(obj: any): obj is ApiSuccessResponse {
  return (
    obj &&
    typeof obj === "object" &&
    obj.success === true &&
    obj.data !== undefined &&
    typeof obj.timestamp === "number"
  );
}

function isValidErrorResponse(obj: any): obj is ApiErrorResponse {
  return (
    obj &&
    typeof obj === "object" &&
    obj.success === false &&
    obj.error &&
    typeof obj.error.code === "string" &&
    typeof obj.error.message === "string" &&
    typeof obj.timestamp === "number"
  );
}

// API レスポンス処理
async function handleApiResponse(response: ApiResponse): Promise<void> {
  if (isSuccessResponse(response)) {
    console.log("成功:", response.data);
    console.log("タイムスタンプ:", new Date(response.timestamp));
  } else {
    console.error("エラー:", response.error.code);
    console.error("メッセージ:", response.error.message);
  }
}

// 安全なAPI呼び出し
async function safeApiCall(url: string): Promise<ApiResponse | null> {
  try {
    const response = await fetch(url);
    const data = await response.json();
    
    if (isValidSuccessResponse(data) || isValidErrorResponse(data)) {
      return data;
    } else {
      console.error("無効なレスポンス形式");
      return null;
    }
  } catch (error) {
    console.error("API呼び出しエラー:", error);
    return null;
  }
}

// 使用例
const successResponse: ApiSuccessResponse = {
  success: true,
  data: { users: ["Alice", "Bob"] },
  timestamp: Date.now()
};

const errorResponse: ApiErrorResponse = {
  success: false,
  error: {
    code: "NOT_FOUND",
    message: "ユーザーが見つかりません"
  },
  timestamp: Date.now()
};

handleApiResponse(successResponse);
handleApiResponse(errorResponse);
```

**学習ポイント**:
- 複雑なオブジェクトの型ガード
- 厳密な型検証
- 実用的なAPI処理パターン

### ステップ5: クラスベースの型ガード
```typescript
// class-type-guards.ts

// 基底クラス
abstract class Animal {
  constructor(public name: string) {}
  abstract makeSound(): string;
}

// 具象クラス
class Dog extends Animal {
  breed: string;
  
  constructor(name: string, breed: string) {
    super(name);
    this.breed = breed;
  }
  
  makeSound(): string {
    return "Woof!";
  }
  
  fetch(): string {
    return `${this.name} is fetching!`;
  }
}

class Cat extends Animal {
  indoor: boolean;
  
  constructor(name: string, indoor: boolean) {
    super(name);
    this.indoor = indoor;
  }
  
  makeSound(): string {
    return "Meow!";
  }
  
  climb(): string {
    return `${this.name} is climbing!`;
  }
}

class Bird extends Animal {
  canFly: boolean;
  
  constructor(name: string, canFly: boolean) {
    super(name);
    this.canFly = canFly;
  }
  
  makeSound(): string {
    return "Tweet!";
  }
  
  fly(): string {
    return this.canFly ? `${this.name} is flying!` : `${this.name} cannot fly`;
  }
}

// instanceof型ガード
function handleAnimal(animal: Animal): string {
  let result = `${animal.name} says: ${animal.makeSound()}\n`;
  
  if (animal instanceof Dog) {
    result += animal.fetch();
  } else if (animal instanceof Cat) {
    result += animal.climb();
  } else if (animal instanceof Bird) {
    result += animal.fly();
  }
  
  return result;
}

// カスタム型ガード（より柔軟）
function isDog(animal: Animal): animal is Dog {
  return animal instanceof Dog;
}

function isCat(animal: Animal): animal is Cat {
  return animal instanceof Cat;
}

function isBird(animal: Animal): animal is Bird {
  return animal instanceof Bird;
}

// プロパティベースの型ガード
function hasBreed(animal: Animal): animal is Dog {
  return "breed" in animal;
}

function isIndoorAnimal(animal: Animal): animal is Cat {
  return "indoor" in animal;
}

function canFlyCheck(animal: Animal): animal is Bird {
  return "canFly" in animal;
}

// 動物園シミュレーター
class Zoo {
  private animals: Animal[] = [];
  
  addAnimal(animal: Animal): void {
    this.animals.push(animal);
    console.log(`${animal.name} が動物園に追加されました`);
  }
  
  feedAllAnimals(): void {
    console.log("\n=== 餌やりタイム ===");
    this.animals.forEach(animal => {
      console.log(handleAnimal(animal));
    });
  }
  
  getAnimalsByType<T extends Animal>(
    typeGuard: (animal: Animal) => animal is T
  ): T[] {
    return this.animals.filter(typeGuard);
  }
  
  getDogInfo(): void {
    const dogs = this.getAnimalsByType(isDog);
    console.log("\n=== 犬の情報 ===");
    dogs.forEach(dog => {
      console.log(`${dog.name} - 品種: ${dog.breed}`);
    });
  }
  
  getCatInfo(): void {
    const cats = this.getAnimalsByType(isCat);
    console.log("\n=== 猫の情報 ===");
    cats.forEach(cat => {
      console.log(`${cat.name} - 室内飼い: ${cat.indoor ? "はい" : "いいえ"}`);
    });
  }
}

// 使用例
const zoo = new Zoo();

zoo.addAnimal(new Dog("ポチ", "柴犬"));
zoo.addAnimal(new Cat("タマ", true));
zoo.addAnimal(new Bird("ピーちゃん", true));
zoo.addAnimal(new Dog("ハチ", "秋田犬"));
zoo.addAnimal(new Bird("ペンペン", false));

zoo.feedAllAnimals();
zoo.getDogInfo();
zoo.getCatInfo();
```

**学習ポイント**:
- instanceof型ガード
- クラス継承と型ガード
- ジェネリクスと型ガードの組み合わせ

---

## 判別可能なユニオンの実践

### ステップ6: 状態管理システム
```typescript
// state-management.ts

// アプリケーション状態の定義
type LoadingState = {
  type: "loading";
  message?: string;
};

type SuccessState<T> = {
  type: "success";
  data: T;
  timestamp: number;
};

type ErrorState = {
  type: "error";
  error: {
    code: string;
    message: string;
    details?: any;
  };
};

type IdleState = {
  type: "idle";
};

type AsyncState<T> = LoadingState | SuccessState<T> | ErrorState | IdleState;

// 状態管理クラス
class StateManager<T> {
  private state: AsyncState<T> = { type: "idle" };
  private listeners: Array<(state: AsyncState<T>) => void> = [];
  
  getState(): AsyncState<T> {
    return this.state;
  }
  
  setState(newState: AsyncState<T>): void {
    this.state = newState;
    this.notifyListeners();
  }
  
  subscribe(listener: (state: AsyncState<T>) => void): () => void {
    this.listeners.push(listener);
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }
  
  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.state));
  }
  
  // 状態遷移メソッド
  setLoading(message?: string): void {
    this.setState({ type: "loading", message });
  }
  
  setSuccess(data: T): void {
    this.setState({
      type: "success",
      data,
      timestamp: Date.now()
    });
  }
  
  setError(code: string, message: string, details?: any): void {
    this.setState({
      type: "error",
      error: { code, message, details }
    });
  }
  
  setIdle(): void {
    this.setState({ type: "idle" });
  }
  
  // 状態チェックメソッド
  isLoading(): boolean {
    return this.state.type === "loading";
  }
  
  isSuccess(): boolean {
    return this.state.type === "success";
  }
  
  isError(): boolean {
    return this.state.type === "error";
  }
  
  isIdle(): boolean {
    return this.state.type === "idle";
  }
  
  // データ取得メソッド（型安全）
  getData(): T | null {
    if (this.state.type === "success") {
      return this.state.data;
    }
    return null;
  }
  
  getError(): { code: string; message: string; details?: any } | null {
    if (this.state.type === "error") {
      return this.state.error;
    }
    return null;
  }
}

// 状態表示コンポーネント
class StateDisplay<T> {
  constructor(private stateManager: StateManager<T>) {}
  
  render(): string {
    const state = this.stateManager.getState();
    
    switch (state.type) {
      case "idle":
        return "待機中...";
      
      case "loading":
        return `読み込み中... ${state.message || ""}`;
      
      case "success":
        return `成功: データを取得しました (${new Date(state.timestamp).toLocaleTimeString()})`;
      
      case "error":
        return `エラー [${state.error.code}]: ${state.error.message}`;
      
      default:
        // 網羅性チェック
        const _exhaustive: never = state;
        throw new Error(`未処理の状態: ${_exhaustive}`);
    }
  }
}

// 非同期データフェッチャー
class DataFetcher<T> {
  constructor(private stateManager: StateManager<T>) {}
  
  async fetchData(url: string): Promise<void> {
    this.stateManager.setLoading("データを取得中...");
    
    try {
      // 模擬的な遅延
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 模擬的なAPI呼び出し
      if (Math.random() > 0.3) {
        const mockData = { message: "データ取得成功", url } as T;
        this.stateManager.setSuccess(mockData);
      } else {
        throw new Error("ネットワークエラー");
      }
    } catch (error) {
      this.stateManager.setError(
        "FETCH_ERROR",
        error instanceof Error ? error.message : "不明なエラー",
        { url }
      );
    }
  }
}

// 使用例
interface UserData {
  id: number;
  name: string;
  email: string;
}

async function demonstrateStateManagement() {
  const stateManager = new StateManager<UserData>();
  const display = new StateDisplay(stateManager);
  const fetcher = new DataFetcher(stateManager);
  
  // 状態変更の監視
  const unsubscribe = stateManager.subscribe(state => {
    console.log("状態更新:", display.render());
    
    // 成功時の詳細表示
    if (state.type === "success") {
      console.log("取得データ:", state.data);
    }
    
    // エラー時の詳細表示
    if (state.type === "error") {
      console.log("エラー詳細:", state.error);
    }
  });
  
  console.log("初期状態:", display.render());
  
  // データ取得開始
  await fetcher.fetchData("/api/users/1");
  
  // 少し待ってから再試行
  setTimeout(async () => {
    console.log("\n=== 再試行 ===");
    await fetcher.fetchData("/api/users/2");
  }, 2000);
  
  // 5秒後にクリーンアップ
  setTimeout(() => {
    unsubscribe();
    console.log("監視を停止しました");
  }, 5000);
}

demonstrateStateManagement();
```

**学習ポイント**:
- 判別可能なユニオンによる状態管理
- 型安全な状態遷移
- 網羅性チェックの実装
- 観察者パターンとの組み合わせ

---

## 実用的なエラーハンドリング

### ステップ7: Result型パターンの実装
```typescript
// result-pattern.ts

// Result型の定義
type Result<T, E> = 
  | { success: true; data: T }
  | { success: false; error: E };

// Result型のヘルパー関数
const Result = {
  ok<T, E>(data: T): Result<T, E> {
    return { success: true, data };
  },
  
  err<T, E>(error: E): Result<T, E> {
    return { success: false, error };
  },
  
  isOk<T, E>(result: Result<T, E>): result is { success: true; data: T } {
    return result.success;
  },
  
  isErr<T, E>(result: Result<T, E>): result is { success: false; error: E } {
    return !result.success;
  }
};

// エラー型の定義
type ValidationError = {
  type: "validation";
  field: string;
  message: string;
};

type NetworkError = {
  type: "network";
  status: number;
  message: string;
};

type ParseError = {
  type: "parse";
  message: string;
  input: string;
};

type AppError = ValidationError | NetworkError | ParseError;

// バリデーション関数
function validateEmail(email: string): Result<string, ValidationError> {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!email) {
    return Result.err({
      type: "validation",
      field: "email",
      message: "メールアドレスは必須です"
    });
  }
  
  if (!emailRegex.test(email)) {
    return Result.err({
      type: "validation",
      field: "email",
      message: "有効なメールアドレスを入力してください"
    });
  }
  
  return Result.ok(email);
}

function validateAge(age: string): Result<number, ValidationError> {
  const numAge = parseInt(age, 10);
  
  if (isNaN(numAge)) {
    return Result.err({
      type: "validation",
      field: "age",
      message: "年齢は数値で入力してください"
    });
  }
  
  if (numAge < 0 || numAge > 150) {
    return Result.err({
      type: "validation",
      field: "age",
      message: "年齢は0から150の間で入力してください"
    });
  }
  
  return Result.ok(numAge);
}

// ユーザーデータの型
interface User {
  email: string;
  age: number;
}

// 複数のバリデーションを組み合わせ
function validateUser(email: string, age: string): Result<User, ValidationError> {
  const emailResult = validateEmail(email);
  if (!Result.isOk(emailResult)) {
    return emailResult;
  }
  
  const ageResult = validateAge(age);
  if (!Result.isOk(ageResult)) {
    return ageResult;
  }
  
  return Result.ok({
    email: emailResult.data,
    age: ageResult.data
  });
}

// API呼び出し関数
async function saveUser(user: User): Promise<Result<User, NetworkError>> {
  try {
    // 模擬的なAPI呼び出し
    const response = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user)
    });
    
    if (!response.ok) {
      return Result.err({
        type: "network",
        status: response.status,
        message: `HTTP ${response.status}: ${response.statusText}`
      });
    }
    
    const savedUser = await response.json();
    return Result.ok(savedUser);
  } catch (error) {
    return Result.err({
      type: "network",
      status: 0,
      message: error instanceof Error ? error.message : "ネットワークエラー"
    });
  }
}

// JSON解析関数
function parseUserData(jsonString: string): Result<any, ParseError> {
  try {
    const data = JSON.parse(jsonString);
    return Result.ok(data);
  } catch (error) {
    return Result.err({
      type: "parse",
      message: error instanceof Error ? error.message : "JSON解析エラー",
      input: jsonString
    });
  }
}

// エラーハンドリングのユーティリティ
function handleError(error: AppError): string {
  switch (error.type) {
    case "validation":
      return `入力エラー (${error.field}): ${error.message}`;
    
    case "network":
      return `ネットワークエラー (${error.status}): ${error.message}`;
    
    case "parse":
      return `解析エラー: ${error.message}`;
    
    default:
      // 網羅性チェック
      const _exhaustive: never = error;
      return `未知のエラー: ${_exhaustive}`;
  }
}

// 統合的なユーザー処理関数
async function processUserRegistration(
  email: string, 
  age: string
): Promise<Result<User, AppError>> {
  // バリデーション
  const validationResult = validateUser(email, age);
  if (!Result.isOk(validationResult)) {
    return validationResult;
  }
  
  // API呼び出し
  const saveResult = await saveUser(validationResult.data);
  if (!Result.isOk(saveResult)) {
    return saveResult;
  }
  
  return Result.ok(saveResult.data);
}

// 使用例
async function demonstrateErrorHandling() {
  console.log("=== ユーザー登録デモ ===\n");
  
  const testCases = [
    { email: "valid@example.com", age: "25" },
    { email: "invalid-email", age: "25" },
    { email: "valid@example.com", age: "invalid" },
    { email: "valid@example.com", age: "-5" },
  ];
  
  for (const testCase of testCases) {
    console.log(`テスト: email="${testCase.email}", age="${testCase.age}"`);
    
    const result = await processUserRegistration(testCase.email, testCase.age);
    
    if (Result.isOk(result)) {
      console.log("✅ 成功:", result.data);
    } else {
      console.log("❌ エラー:", handleError(result.error));
    }
    console.log();
  }
}

demonstrateErrorHandling();
```

**学習ポイント**:
- Result型パターンの実装
- 複数のエラー型の統合
- 型安全なエラーハンドリング
- 関数型プログラミングの要素

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

### 開発用の設定
```bash
# package.jsonにスクリプトを追加
{
  "scripts": {
    "dev": "ts-node src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "test": "jest"
  }
}

# 実行
npm run dev
```

---

## 📚 学習の進め方

1. **段階的に進める**: 基本的なユニオン型から始めて、徐々に複雑なパターンに挑戦
2. **実際に動かす**: コードをコピーして実際に実行してみる
3. **改造してみる**: 既存のコードを改造して理解を深める
4. **エラーを体験する**: 意図的にエラーを発生させて型ガードの重要性を理解
5. **実用例を考える**: 自分のプロジェクトでどう活用できるかを考える

---

**📌 重要**: これらのコード例は実際のプロジェクトで使用できる実用的なパターンです。ユニオン型と型ガードを組み合わせることで、型安全で保守性の高いコードを書けるようになります。
---

## ユーザー管理システム完全版

### Session3 最終プロジェクト: 統合ユーザー管理システム

Step01-04で学習した全ての概念を統合した実用的なユーザー管理システムの完全実装例です。

```typescript
// user-management-system.ts

// Step02で学んだ型エイリアス
type UserId = number;
type UserRole = "admin" | "editor" | "viewer";
type UserStatus = "active" | "inactive" | "pending";

// Step03で学んだインターフェース継承
interface BaseUser {
  id: UserId;
  name: string;
  email: string;
  status: UserStatus;
  createdAt: Date;
}

interface AdminUser extends BaseUser {
  role: "admin";
  permissions: string[];
  lastLogin: Date;
}

interface EditorUser extends BaseUser {
  role: "editor";
  editableResources: string[];
  department: string;
}

interface ViewerUser extends BaseUser {
  role: "viewer";
  accessLevel: number;
}

// Step04で学んだユニオン型
type User = AdminUser | EditorUser | ViewerUser;

// Step04で学んだ判別可能なユニオン（API レスポンス）
interface SuccessResponse<T> {
  status: "success";
  data: T;
  message: string;
}

interface ErrorResponse {
  status: "error";
  message: string;
  code: number;
}

type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;
type UserResponse = ApiResponse<User>;
type UserListResponse = ApiResponse<User[]>;

// ユーザー作成用の型（IDは自動生成のため除外）
type CreateUserRequest = Omit<User, "id" | "createdAt">;

// ユーザー更新用の型
type UpdateUserRequest = Partial<Pick<User, "name" | "email" | "status">>;

// Step04で学んだ型ガード関数群
function isSuccessResponse<T>(response: ApiResponse<T>): response is SuccessResponse<T> {
  return response.status === "success";
}

function isErrorResponse<T>(response: ApiResponse<T>): response is ErrorResponse {
  return response.status === "error";
}

function isAdminUser(user: User): user is AdminUser {
  return user.role === "admin";
}

function isEditorUser(user: User): user is EditorUser {
  return user.role === "editor";
}

function isViewerUser(user: User): user is ViewerUser {
  return user.role === "viewer";
}

// ユーザー管理システムのメインクラス
class UserManagementSystem {
  private users: User[] = [];
  private nextId: UserId = 1;

  // ユーザー登録
  registerUser(userData: CreateUserRequest): UserResponse {
    try {
      const newUser: User = {
        id: this.nextId++,
        createdAt: new Date(),
        ...userData
      };

      // バリデーション
      if (!this.validateUser(newUser)) {
        return {
          status: "error",
          message: "無効なユーザーデータです",
          code: 400
        };
      }

      // 重複チェック
      if (this.findUserByEmail(newUser.email)) {
        return {
          status: "error",
          message: "このメールアドレスは既に使用されています",
          code: 409
        };
      }

      this.users.push(newUser);

      return {
        status: "success",
        data: newUser,
        message: "ユーザーが正常に登録されました"
      };
    } catch (error) {
      return {
        status: "error",
        message: "ユーザー登録中にエラーが発生しました",
        code: 500
      };
    }
  }

  // ユーザー検索（ID）
  findUserById(id: UserId): UserResponse {
    const user = this.users.find(u => u.id === id);
    
    if (!user) {
      return {
        status: "error",
        message: "ユーザーが見つかりません",
        code: 404
      };
    }

    return {
      status: "success",
      data: user,
      message: "ユーザーが見つかりました"
    };
  }

  // ユーザー検索（メール）
  findUserByEmail(email: string): User | undefined {
    return this.users.find(u => u.email === email);
  }

  // 全ユーザー取得
  getAllUsers(): UserListResponse {
    return {
      status: "success",
      data: [...this.users],
      message: `${this.users.length}人のユーザーが見つかりました`
    };
  }

  // アクティブユーザーのフィルタリング
  getActiveUsers(): UserListResponse {
    const activeUsers = this.users.filter(user => user.status === "active");
    
    return {
      status: "success",
      data: activeUsers,
      message: `${activeUsers.length}人のアクティブユーザーが見つかりました`
    };
  }

  // ロール別ユーザー取得
  getUsersByRole<T extends User>(
    roleGuard: (user: User) => user is T
  ): T[] {
    return this.users.filter(roleGuard);
  }

  // ユーザー更新
  updateUser(id: UserId, updates: UpdateUserRequest): UserResponse {
    const userIndex = this.users.findIndex(u => u.id === id);
    
    if (userIndex === -1) {
      return {
        status: "error",
        message: "ユーザーが見つかりません",
        code: 404
      };
    }

    // 更新実行
    this.users[userIndex] = {
      ...this.users[userIndex],
      ...updates
    };

    return {
      status: "success",
      data: this.users[userIndex],
      message: "ユーザー情報が更新されました"
    };
  }

  // ユーザー削除
  deleteUser(id: UserId): ApiResponse<null> {
    const userIndex = this.users.findIndex(u => u.id === id);
    
    if (userIndex === -1) {
      return {
        status: "error",
        message: "ユーザーが見つかりません",
        code: 404
      };
    }

    this.users.splice(userIndex, 1);

    return {
      status: "success",
      data: null,
      message: "ユーザーが削除されました"
    };
  }

  // 権限レベル取得
  getUserPermissionLevel(user: User): number {
    switch (user.role) {
      case "admin":
        return 3;
      case "editor":
        return 2;
      case "viewer":
        return 1;
    }
  }

  // リソースアクセス権限チェック
  canUserAccessResource(user: User, resource: string): boolean {
    switch (user.role) {
      case "admin":
        return true; // 管理者は全リソースアクセス可能
      case "editor":
        return user.editableResources.includes(resource);
      case "viewer":
        return false; // 閲覧者はアクセス不可
    }
  }

  // ユーザー情報フォーマット
  formatUserInfo(user: User): string {
    let info = `${user.name} (${user.email}) - ${user.role} [${user.status}]`;
    info += `\n作成日: ${user.createdAt.toLocaleDateString()}`;

    switch (user.role) {
      case "admin":
        info += `\n権限: ${user.permissions.join(", ")}`;
        info += `\n最終ログイン: ${user.lastLogin.toLocaleDateString()}`;
        break;
      case "editor":
        info += `\n部署: ${user.department}`;
        info += `\n編集可能リソース: ${user.editableResources.join(", ")}`;
        break;
      case "viewer":
        info += `\nアクセスレベル: ${user.accessLevel}`;
        break;
    }

    return info;
  }

  // 更新可能フィールド取得
  getUpdatableFields(user: User): string[] {
    const baseFields = ["name", "email"];

    switch (user.role) {
      case "admin":
        return [...baseFields, "permissions"];
      case "editor":
        return [...baseFields, "department"];
      case "viewer":
        return baseFields;
    }
  }

  // ユーザー統計
  getUserStatistics(): {
    total: number;
    byRole: Record<UserRole, number>;
    byStatus: Record<UserStatus, number>;
  } {
    const stats = {
      total: this.users.length,
      byRole: { admin: 0, editor: 0, viewer: 0 } as Record<UserRole, number>,
      byStatus: { active: 0, inactive: 0, pending: 0 } as Record<UserStatus, number>
    };

    this.users.forEach(user => {
      stats.byRole[user.role]++;
      stats.byStatus[user.status]++;
    });

    return stats;
  }

  // バリデーション
  private validateUser(user: User): boolean {
    // 基本バリデーション
    if (!user.name || !user.email || !user.role) {
      return false;
    }

    // メール形式チェック
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(user.email)) {
      return false;
    }

    // ロール固有のバリデーション
    switch (user.role) {
      case "admin":
        return Array.isArray(user.permissions) && user.lastLogin instanceof Date;
      case "editor":
        return Array.isArray(user.editableResources) && typeof user.department === "string";
      case "viewer":
        return typeof user.accessLevel === "number" && user.accessLevel > 0;
    }
  }
}

// 使用例とテストケース
function demonstrateUserManagementSystem(): void {
  const userSystem = new UserManagementSystem();

  console.log("=== ユーザー管理システム デモ ===\n");

  // 1. ユーザー登録
  console.log("1. ユーザー登録");
  
  const adminData: CreateUserRequest = {
    role: "admin",
    name: "田中太郎",
    email: "tanaka@example.com",
    status: "active",
    permissions: ["user_management", "system_config"],
    lastLogin: new Date()
  };

  const editorData: CreateUserRequest = {
    role: "editor",
    name: "佐藤花子",
    email: "sato@example.com",
    status: "active",
    editableResources: ["articles", "images"],
    department: "編集部"
  };

  const viewerData: CreateUserRequest = {
    role: "viewer",
    name: "鈴木一郎",
    email: "suzuki@example.com",
    status: "inactive",
    accessLevel: 1
  };

  const adminResult = userSystem.registerUser(adminData);
  const editorResult = userSystem.registerUser(editorData);
  const viewerResult = userSystem.registerUser(viewerData);

  console.log("Admin登録:", processResponse(adminResult));
  console.log("Editor登録:", processResponse(editorResult));
  console.log("Viewer登録:", processResponse(viewerResult));

  // 2. ユーザー検索
  console.log("\n2. ユーザー検索");
  const foundUser = userSystem.findUserById(1);
  console.log("ID=1のユーザー:", processResponse(foundUser));

  // 3. 権限チェック
  console.log("\n3. 権限チェック");
  const allUsersResponse = userSystem.getAllUsers();
  if (isSuccessResponse(allUsersResponse)) {
    allUsersResponse.data.forEach(user => {
      const level = userSystem.getUserPermissionLevel(user);
      const canEditArticles = userSystem.canUserAccessResource(user, "articles");
      console.log(`${user.name}: 権限レベル=${level}, 記事編集=${canEditArticles}`);
    });
  }

  // 4. ユーザー情報表示
  console.log("\n4. ユーザー情報詳細");
  if (isSuccessResponse(allUsersResponse)) {
    allUsersResponse.data.forEach(user => {
      console.log(userSystem.formatUserInfo(user));
      console.log("---");
    });
  }

  // 5. フィルタリング
  console.log("\n5. アクティブユーザー一覧");
  const activeUsers = userSystem.getActiveUsers();
  console.log(processResponse(activeUsers));

  // 6. ロール別取得
  console.log("\n6. ロール別ユーザー");
  const admins = userSystem.getUsersByRole(isAdminUser);
  const editors = userSystem.getUsersByRole(isEditorUser);
  console.log(`管理者: ${admins.length}人`);
  console.log(`編集者: ${editors.length}人`);

  // 7. 統計情報
  console.log("\n7. ユーザー統計");
  const stats = userSystem.getUserStatistics();
  console.log("総ユーザー数:", stats.total);
  console.log("ロール別:", stats.byRole);
  console.log("ステータス別:", stats.byStatus);

  // 8. ユーザー更新
  console.log("\n8. ユーザー更新");
  const updateResult = userSystem.updateUser(1, { name: "田中太郎（更新済み）" });
  console.log("更新結果:", processResponse(updateResult));
}

// レスポンス処理ヘルパー関数
function processResponse<T>(response: ApiResponse<T>): string {
  if (isSuccessResponse(response)) {
    return `成功: ${response.message}`;
  } else {
    return `エラー[${response.code}]: ${response.message}`;
  }
}

// エラーハンドリングの実践例
function safeUserOperation<T>(
  operation: () => ApiResponse<T>,
  operationName: string
): void {
  try {
    const result = operation();
    
    if (isSuccessResponse(result)) {
      console.log(`✅ ${operationName} 成功: ${result.message}`);
    } else {
      console.error(`❌ ${operationName} 失敗[${result.code}]: ${result.message}`);
    }
  } catch (error) {
    console.error(`💥 ${operationName} 例外:`, error);
  }
}

// 高度な使用例
function advancedUserManagementDemo(): void {
  const userSystem = new UserManagementSystem();

  console.log("\n=== 高度なユーザー管理デモ ===\n");

  // バッチユーザー登録
  const usersToCreate: CreateUserRequest[] = [
    {
      role: "admin",
      name: "システム管理者",
      email: "admin@company.com",
      status: "active",
      permissions: ["all"],
      lastLogin: new Date()
    },
    {
      role: "editor",
      name: "コンテンツ編集者",
      email: "editor@company.com",
      status: "active",
      editableResources: ["articles", "images", "videos"],
      department: "コンテンツ部"
    },
    {
      role: "viewer",
      name: "一般ユーザー",
      email: "user@company.com",
      status: "pending",
      accessLevel: 2
    }
  ];

  // 安全なバッチ処理
  usersToCreate.forEach((userData, index) => {
    safeUserOperation(
      () => userSystem.registerUser(userData),
      `ユーザー${index + 1}登録`
    );
  });

  // 複雑な検索とフィルタリング
  const allUsers = userSystem.getAllUsers();
  if (isSuccessResponse(allUsers)) {
    // 高権限ユーザーの抽出
    const highPrivilegeUsers = allUsers.data.filter(user => 
      userSystem.getUserPermissionLevel(user) >= 2
    );

    console.log(`\n高権限ユーザー (${highPrivilegeUsers.length}人):`);
    highPrivilegeUsers.forEach(user => {
      console.log(`- ${user.name} (${user.role})`);
    });

    // 部門別編集者の抽出
    const editors = userSystem.getUsersByRole(isEditorUser);
    const departmentGroups = editors.reduce((groups, editor) => {
      const dept = editor.department;
      if (!groups[dept]) groups[dept] = [];
      groups[dept].push(editor);
      return groups;
    }, {} as Record<string, EditorUser[]>);

    console.log("\n部門別編集者:");
    Object.entries(departmentGroups).forEach(([dept, editors]) => {
      console.log(`${dept}: ${editors.map(e => e.name).join(", ")}`);
    });
  }
}

// デモ実行
if (require.main === module) {
  demonstrateUserManagementSystem();
  advancedUserManagementDemo();
}

export {
  UserManagementSystem,
  User,
  AdminUser,
  EditorUser,
  ViewerUser,
  ApiResponse,
  UserResponse,
  UserListResponse,
  isSuccessResponse,
  isErrorResponse,
  isAdminUser,
  isEditorUser,
  isViewerUser
};
```

### 実行方法

```bash
# TypeScriptファイルを直接実行
npx ts-node user-management-system.ts

# またはコンパイルしてから実行
npx tsc user-management-system.ts
node user-management-system.js
```

### 学習ポイント

この完全版では以下の概念を統合的に活用しています：

#### Step01-02の基礎概念
- **基本型注釈**: `UserId`, `UserRole`, `UserStatus`
- **型エイリアス**: 可読性と保守性の向上
- **型推論**: TypeScriptの自動型推論を活用

#### Step03のインターフェース設計
- **インターフェース継承**: `BaseUser`を継承した各ロール
- **オプショナルプロパティ**: 柔軟なデータ構造
- **読み取り専用プロパティ**: データの不変性保証

#### Step04のユニオン型と型ガード
- **ユニオン型**: `User = AdminUser | EditorUser | ViewerUser`
- **判別可能なユニオン**: `role`プロパティによる型判別
- **型ガード関数**: `isAdminUser`, `isEditorUser`, `isViewerUser`
- **API レスポンス型**: `ApiResponse<T>`の活用

#### 実践的なパターン
- **エラーハンドリング**: 型安全なエラー処理
- **バリデーション**: 実行時の値の性質チェック
- **ジェネリクス**: 再利用可能な型定義
- **ユーティリティ型**: `Omit`, `Partial`, `Pick`の活用

### 拡張課題

1. **認証機能の追加**: パスワードハッシュ化とJWT実装
2. **データベース連携**: 永続化レイヤーの実装
3. **ロールベースアクセス制御**: より細かい権限管理
4. **監査ログ**: ユーザー操作の記録機能
5. **バッチ処理**: 大量ユーザーの効率的な処理

この実装例を通じて、TypeScriptの型システムを活用した実用的なアプリケーション開発の基礎を習得できます。