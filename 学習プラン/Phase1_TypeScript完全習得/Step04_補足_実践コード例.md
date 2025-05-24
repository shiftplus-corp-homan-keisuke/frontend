# Step04 実践コード例

> 💡 **このファイルについて**: ユニオン型と型ガードの段階的な学習のためのコード例集です。

## 📋 目次
1. [基本的なユニオン型の活用](#基本的なユニオン型の活用)
2. [型ガードの実装パターン](#型ガードの実装パターン)
3. [判別可能なユニオンの実践](#判別可能なユニオンの実践)
4. [実用的なエラーハンドリング](#実用的なエラーハンドリング)

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