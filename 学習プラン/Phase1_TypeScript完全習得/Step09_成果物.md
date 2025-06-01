# Step09 成果物：ユーザー管理システムのエラーハンドリング・デバッグ・テスト強化

---

## 🎯 課題の目的

**あなたが作成するもの**: 既存のJavaScriptコードにTypeScriptの型安全なエラーハンドリング、デバッグシステム、テストの型安全性を追加する

**なぜ作るのか**: Step09で学習したエラーハンドリングとデバッグの知識を実際のコードに適用し、**既存コードを堅牢で保守性の高いシステムに変換する力**を身につけるため

**学習目標**:
- 既存のJavaScriptコードを読んで適切なエラーハンドリングシステムを設計できる
- 型安全なカスタムエラークラスとResult型パターンを実装できる
- 効果的なデバッグシステム（ログ、パフォーマンス測定）を構築できる
- 型安全なテストフレームワークとアサーションを作成できる

---

## 📋 必須提出物

以下の1つのファイルのみ提出してください：

```
📁 提出物/
└── user-management-system.ts    # エラーハンドリング・デバッグ・テスト強化システム（必須）
```

---

## ⏰ 作成手順（推奨時間配分：合計50分）

### Phase 1: 既存コードの理解とエラーハンドリング追加（20分）

#### ステップ1-1: 提供されたJavaScriptコードを理解する（5分）

以下のJavaScriptコードを読んで、どんなエラーハンドリングが必要か考えてください：

```javascript
// 既存のJavaScriptコード（エラーハンドリングなし）
let users = [];
let currentUserId = 1;

function createUser(userData) {
  const user = {
    id: currentUserId++,
    name: userData.name,
    email: userData.email,
    age: userData.age,
    role: userData.role || "user",
    createdAt: new Date(),
    isActive: true
  };
  
  users.push(user);
  console.log("User created:", user);
  return user;
}

function getUserById(id) {
  const user = users.find(u => u.id === id);
  if (!user) {
    throw new Error("User not found");
  }
  return user;
}

function updateUser(id, updates) {
  const userIndex = users.findIndex(u => u.id === id);
  if (userIndex === -1) {
    throw new Error("User not found");
  }
  
  users[userIndex] = { ...users[userIndex], ...updates };
  console.log("User updated:", users[userIndex]);
  return users[userIndex];
}

function deleteUser(id) {
  const userIndex = users.findIndex(u => u.id === id);
  if (userIndex === -1) {
    throw new Error("User not found");
  }
  
  users.splice(userIndex, 1);
  console.log("User deleted:", id);
  return true;
}

function validateUserData(userData) {
  if (!userData.name || userData.name.trim() === "") {
    throw new Error("Name is required");
  }
  
  if (!userData.email || !userData.email.includes("@")) {
    throw new Error("Valid email is required");
  }
  
  if (!userData.age || userData.age < 0 || userData.age > 150) {
    throw new Error("Valid age is required");
  }
  
  return true;
}

async function fetchUserFromAPI(id) {
  try {
    const response = await fetch(`/api/users/${id}`);
    const userData = await response.json();
    return userData;
  } catch (error) {
    console.error("API fetch failed:", error);
    throw error;
  }
}

function processUserBatch(userDataList) {
  const results = [];
  const errors = [];
  
  for (const userData of userDataList) {
    try {
      validateUserData(userData);
      const user = createUser(userData);
      results.push(user);
    } catch (error) {
      errors.push({ userData, error: error.message });
    }
  }
  
  return { results, errors };
}

function getUsersByRole(role) {
  return users.filter(user => user.role === role && user.isActive);
}

function calculateUserStats() {
  const total = users.length;
  const active = users.filter(u => u.isActive).length;
  const byRole = {};
  
  users.forEach(user => {
    if (!byRole[user.role]) {
      byRole[user.role] = 0;
    }
    byRole[user.role]++;
  });
  
  return {
    total,
    active,
    inactive: total - active,
    byRole
  };
}

// 使用例
function runExample() {
  console.log("=== ユーザー管理システムのデモ ===");
  
  // ユーザー作成
  const user1 = createUser({
    name: "田中太郎",
    email: "tanaka@example.com",
    age: 30,
    role: "admin"
  });
  
  const user2 = createUser({
    name: "佐藤花子",
    email: "sato@example.com",
    age: 25
  });
  
  // ユーザー取得
  const foundUser = getUserById(1);
  console.log("Found user:", foundUser);
  
  // ユーザー更新
  updateUser(1, { age: 31 });
  
  // 統計情報
  const stats = calculateUserStats();
  console.log("User stats:", stats);
  
  // バッチ処理
  const batchData = [
    { name: "山田次郎", email: "yamada@example.com", age: 28 },
    { name: "", email: "invalid", age: -5 }, // 無効なデータ
    { name: "鈴木三郎", email: "suzuki@example.com", age: 35 }
  ];
  
  const batchResult = processUserBatch(batchData);
  console.log("Batch result:", batchResult);
}

// 実行
runExample();
```

#### ステップ1-2: カスタムエラークラスの実装（8分）

```typescript
// TODO: 以下のカスタムエラークラスを実装してください

// バリデーションエラー
class ValidationError extends Error {
  // どんなプロパティが必要？
}

// ネットワークエラー
class NetworkError extends Error {
  // どんなプロパティが必要？
}

// ビジネスロジックエラー
class BusinessLogicError extends Error {
  // どんなプロパティが必要？
}
```

#### ステップ1-3: Result型パターンの実装（7分）

```typescript
// TODO: Result型パターンを実装してください

// 成功・失敗を表現する型
type Result<T, E = Error> = ?;

// Result型を使った関数の例
function safeCreateUser(userData: unknown): Result<User, ValidationError> {
  // 実装してください
}

function safeGetUserById(id: number): Result<User, BusinessLogicError> {
  // 実装してください
}
```

### Phase 2: デバッグシステムの実装（20分）

#### ステップ2-1: 型安全なログシステムの実装（10分）

```typescript
// TODO: 型安全なログシステムを実装してください

// ログレベルの定義
enum LogLevel {
  // どんなレベルが必要？
}

// ログエントリの型
interface LogEntry {
  // どんなプロパティが必要？
}

// ログシステムクラス
class TypeSafeLogger {
  // どんなメソッドが必要？
}
```

#### ステップ2-2: パフォーマンス測定システムの実装（5分）

```typescript
// TODO: パフォーマンス測定システムを実装してください

class PerformanceProfiler {
  // 測定開始
  static start(label: string): void {
    // 実装してください
  }
  
  // 測定終了
  static end(label: string): number {
    // 実装してください
  }
  
  // 関数の実行時間測定
  static measure<T>(label: string, fn: () => T): T {
    // 実装してください
  }
}
```

#### ステップ2-3: デバッグヘルパー関数の実装（5分）

```typescript
// TODO: デバッグヘルパー関数を実装してください

// 値のデバッグ出力
function debugValue<T>(value: T, label?: string): T {
  // 実装してください
}

// 型アサーション
function assertType<T>(value: unknown, typeName: string): asserts value is T {
  // 実装してください
}

// オブジェクト検査
function inspectObject(obj: unknown, depth?: number): void {
  // 実装してください
}
```

### Phase 3: テストの型安全性確保（10分）

#### ステップ3-1: 型安全なアサーションの実装（5分）

```typescript
// TODO: 型安全なアサーションクラスを実装してください

class TypeSafeAssert {
  // 等価性チェック
  static equal<T>(actual: T, expected: T, message?: string): void {
    // 実装してください
  }
  
  // 深い等価性チェック
  static deepEqual<T>(actual: T, expected: T, message?: string): void {
    // 実装してください
  }
  
  // エラーのテスト
  static throws(fn: () => void, expectedError?: string | RegExp, message?: string): void {
    // 実装してください
  }
  
  // 型チェック
  static isType<T>(value: unknown, typeName: string): asserts value is T {
    // 実装してください
  }
}
```

#### ステップ3-2: モックシステムの実装（5分）

```typescript
// TODO: 型安全なモックシステムを実装してください

// モック関数の型
type MockFunction<T extends (...args: any[]) => any> = {
  // どんなプロパティとメソッドが必要？
};

// モック作成関数
function createMock<T extends (...args: any[]) => any>(): MockFunction<T> {
  // 実装してください
}
```

---

## ✅ 最低合格要件

以下の要件を**すべて満たす**ことで合格とします：

### 🔧 技術要件
- [ ] TypeScriptでコンパイルエラーが発生しない
- [ ] **カスタムエラークラスを適切に実装している**（最重要！）
- [ ] **Result型パターンを活用している**（最重要！）
- [ ] **型安全なログシステムを実装している**（最重要！）
- [ ] パフォーマンス測定機能を実装している
- [ ] 型安全なアサーションとモックを実装している

### 🎯 機能要件
- [ ] 元のJavaScriptコードと同じ動作をする
- [ ] エラーハンドリングが適切に動作する
- [ ] ログ出力が構造化されている
- [ ] パフォーマンス測定ができる
- [ ] テストが型安全に実行できる

### 💭 設計要件
- [ ] エラー情報が詳細で有用である
- [ ] ログレベルによる出力制御ができる
- [ ] デバッグ情報が適切に出力される
- [ ] テストの保守性が確保されている

---

## 📊 評価基準

| 項目 | 配点 | 評価ポイント |
|------|------|-------------|
| **エラーハンドリング設計** | 40点 | カスタムエラークラスとResult型の適切な実装 |
| **デバッグシステム** | 30点 | ログシステムとパフォーマンス測定の実装 |
| **テストの型安全性** | 20点 | アサーションとモックの型安全な実装 |
| **機能の完成度** | 10点 | 元のコードと同じ動作の実現 |

**合格ライン**: 70点以上
---

## 💡 実装のヒント

### 🤔 エラーハンドリングを考える時の質問

1. **どんなエラーが発生する可能性がある？**
   - バリデーションエラー → 入力データの不正
   - ネットワークエラー → API通信の失敗
   - ビジネスロジックエラー → ユーザーが見つからない等

2. **エラー情報に何を含めるべき？**
   - エラーコード → 種類の識別
   - メッセージ → 人間が読める説明
   - コンテキスト → エラー発生時の状況

3. **Result型はどう使う？**
   - 成功時 → `{ success: true, data: T }`
   - 失敗時 → `{ success: false, error: E }`

### 📝 デバッグシステムの基本パターン

```typescript
// ログレベルの基本構造
enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3
}

// ログエントリの基本構造
interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: Date;
  context?: Record<string, unknown>;
  error?: Error;
}

// パフォーマンス測定の基本パターン
class PerformanceProfiler {
  private static measurements = new Map<string, number>();
  
  static start(label: string): void {
    this.measurements.set(label, performance.now());
  }
  
  static end(label: string): number {
    const startTime = this.measurements.get(label);
    if (!startTime) {
      throw new Error(`No measurement started for label: ${label}`);
    }
    
    const duration = performance.now() - startTime;
    this.measurements.delete(label);
    return duration;
  }
}
```

### 🔍 テストの型安全性のパターン

```typescript
// アサーションの基本パターン
class TypeSafeAssert {
  static equal<T>(actual: T, expected: T, message?: string): void {
    if (actual !== expected) {
      throw new Error(message || `Expected ${expected}, but got ${actual}`);
    }
  }
  
  static throws(fn: () => void, expectedError?: string | RegExp): void {
    try {
      fn();
      throw new Error("Expected function to throw");
    } catch (error) {
      if (expectedError) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        const matches = typeof expectedError === "string" 
          ? errorMessage.includes(expectedError)
          : expectedError.test(errorMessage);
        
        if (!matches) {
          throw new Error(`Expected error to match ${expectedError}, but got: ${errorMessage}`);
        }
      }
    }
  }
}

// モック関数の基本パターン
type MockFunction<T extends (...args: any[]) => any> = {
  (...args: Parameters<T>): ReturnType<T>;
  mockReturnValue(value: ReturnType<T>): void;
  mockImplementation(fn: T): void;
  calls: Parameters<T>[];
  results: ReturnType<T>[];
};
```

### ⚠️ よくある間違い

1. **エラー情報の不足**
   ```typescript
   // ❌ 間違い
   throw new Error("Something went wrong");
   
   // ✅ 正解
   throw new ValidationError("name", "Name is required", { value: userData.name });
   ```

2. **Result型の不適切な使用**
   ```typescript
   // ❌ 間違い
   function badFunction(): Result<User, string> {
     return { success: false, error: "error" }; // stringではなくErrorオブジェクト
   }
   
   // ✅ 正解
   function goodFunction(): Result<User, ValidationError> {
     return { 
       success: false, 
       error: new ValidationError("validation", "Invalid input") 
     };
   }
   ```

3. **ログレベルの不適切な使用**
   ```typescript
   // ❌ 間違い
   logger.error("User created successfully"); // ERRORレベルで成功ログ
   
   // ✅ 正解
   logger.info("User created successfully"); // INFOレベルで成功ログ
   ```

---

## 📚 参考：完成例（実装の答えを見たい場合）

<details>
<summary>⚠️ 注意：まず自分で考えてから見てください</summary>

```typescript
// 型定義
interface User {
  id: number;
  name: string;
  email: string;
  age: number;
  role: "admin" | "user" | "moderator";
  createdAt: Date;
  isActive: boolean;
}

// カスタムエラークラス
class ValidationError extends Error {
  constructor(
    public field: string,
    message: string,
    public value?: unknown
  ) {
    super(message);
    this.name = "ValidationError";
  }
}

class NetworkError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public response?: unknown
  ) {
    super(message);
    this.name = "NetworkError";
  }
}

class BusinessLogicError extends Error {
  constructor(
    message: string,
    public code: string,
    public context?: Record<string, unknown>
  ) {
    super(message);
    this.name = "BusinessLogicError";
  }
}

// Result型パターン
type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E };

// ログシステム
enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3
}

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: Date;
  context?: Record<string, unknown>;
  error?: Error;
}

class TypeSafeLogger {
  private static instance: TypeSafeLogger;
  private logLevel: LogLevel = LogLevel.INFO;
  private logs: LogEntry[] = [];

  static getInstance(): TypeSafeLogger {
    if (!this.instance) {
      this.instance = new TypeSafeLogger();
    }
    return this.instance;
  }

  setLogLevel(level: LogLevel): void {
    this.logLevel = level;
  }

  debug(message: string, context?: Record<string, unknown>): void {
    this.log(LogLevel.DEBUG, message, context);
  }

  info(message: string, context?: Record<string, unknown>): void {
    this.log(LogLevel.INFO, message, context);
  }

  warn(message: string, context?: Record<string, unknown>): void {
    this.log(LogLevel.WARN, message, context);
  }

  error(message: string, error?: Error, context?: Record<string, unknown>): void {
    this.log(LogLevel.ERROR, message, context, error);
  }

  private log(
    level: LogLevel,
    message: string,
    context?: Record<string, unknown>,
    error?: Error
  ): void {
    if (level < this.logLevel) return;

    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date(),
      context,
      error
    };

    this.logs.push(entry);
    this.output(entry);
  }

  private output(entry: LogEntry): void {
    const levelName = LogLevel[entry.level];
    const timestamp = entry.timestamp.toISOString();
    
    let output = `[${timestamp}] ${levelName}: ${entry.message}`;
    
    if (entry.context) {
      output += `\nContext: ${JSON.stringify(entry.context, null, 2)}`;
    }
    
    if (entry.error) {
      output += `\nError: ${entry.error.stack || entry.error.message}`;
    }

    switch (entry.level) {
      case LogLevel.DEBUG:
        console.debug(output);
        break;
      case LogLevel.INFO:
        console.info(output);
        break;
      case LogLevel.WARN:
        console.warn(output);
        break;
      case LogLevel.ERROR:
        console.error(output);
        break;
    }
  }

  getLogs(level?: LogLevel): LogEntry[] {
    if (level !== undefined) {
      return this.logs.filter(log => log.level >= level);
    }
    return [...this.logs];
  }
}

// パフォーマンス測定
class PerformanceProfiler {
  private static measurements = new Map<string, number>();

  static start(label: string): void {
    this.measurements.set(label, performance.now());
  }

  static end(label: string): number {
    const startTime = this.measurements.get(label);
    if (!startTime) {
      throw new Error(`No measurement started for label: ${label}`);
    }

    const duration = performance.now() - startTime;
    this.measurements.delete(label);
    
    console.log(`⏱️ ${label}: ${duration.toFixed(2)}ms`);
    return duration;
  }

  static measure<T>(label: string, fn: () => T): T {
    this.start(label);
    try {
      const result = fn();
      this.end(label);
      return result;
    } catch (error) {
      this.end(label);
      throw error;
    }
  }
}

// デバッグヘルパー
function debugValue<T>(value: T, label?: string): T {
  const logger = TypeSafeLogger.getInstance();
  logger.debug(label || "Debug value", { value, type: typeof value });
  return value;
}

function assertType<T>(value: unknown, typeName: string): asserts value is T {
  const actualType = typeof value;
  if (actualType !== typeName) {
    throw new Error(`Expected ${typeName}, but got ${actualType}`);
  }
}

function inspectObject(obj: unknown, depth: number = 2): void {
  console.log("🔍 Object inspection:");
  console.dir(obj, { depth, colors: true });
}

// テストシステム
class TypeSafeAssert {
  static equal<T>(actual: T, expected: T, message?: string): void {
    if (actual !== expected) {
      throw new Error(message || `Expected ${expected}, but got ${actual}`);
    }
  }

  static deepEqual<T>(actual: T, expected: T, message?: string): void {
    if (JSON.stringify(actual) !== JSON.stringify(expected)) {
      throw new Error(
        message || `Deep equality failed:\nActual: ${JSON.stringify(actual)}\nExpected: ${JSON.stringify(expected)}`
      );
    }
  }

  static throws(fn: () => void, expectedError?: string | RegExp, message?: string): void {
    try {
      fn();
      throw new Error(message || "Expected function to throw");
    } catch (error) {
      if (expectedError) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        const matches = typeof expectedError === "string"
          ? errorMessage.includes(expectedError)
          : expectedError.test(errorMessage);

        if (!matches) {
          throw new Error(
            message || `Expected error to match ${expectedError}, but got: ${errorMessage}`
          );
        }
      }
    }
  }

  static isType<T>(value: unknown, typeName: string): asserts value is T {
    if (typeof value !== typeName) {
      throw new Error(`Expected type ${typeName}, but got ${typeof value}`);
    }
  }
}

// モックシステム
type MockFunction<T extends (...args: any[]) => any> = {
  (...args: Parameters<T>): ReturnType<T>;
  mockReturnValue(value: ReturnType<T>): void;
  mockImplementation(fn: T): void;
  mockClear(): void;
  calls: Parameters<T>[];
  results: ReturnType<T>[];
};

function createMock<T extends (...args: any[]) => any>(): MockFunction<T> {
  const calls: Parameters<T>[] = [];
  const results: ReturnType<T>[] = [];
  let implementation: T | undefined;
  let returnValue: ReturnType<T> | undefined;

  const mockFn = ((...args: Parameters<T>): ReturnType<T> => {
    calls.push(args);

    if (implementation) {
      const result = implementation(...args);
      results.push(result);
      return result;
    }

    if (returnValue !== undefined) {
      results.push(returnValue);
      return returnValue;
    }

    throw new Error("Mock function called without implementation");
  }) as MockFunction<T>;

  mockFn.mockReturnValue = (value: ReturnType<T>) => {
    returnValue = value;
  };

  mockFn.mockImplementation = (fn: T) => {
    implementation = fn;
  };

  mockFn.mockClear = () => {
    calls.length = 0;
    results.length = 0;
    implementation = undefined;
    returnValue = undefined;
  };

  mockFn.calls = calls;
  mockFn.results = results;

  return mockFn;
}

// 強化されたユーザー管理システム（簡略版）
class UserManagementSystem {
  private users: User[] = [];
  private currentUserId: number = 1;
  private logger = TypeSafeLogger.getInstance();

  constructor() {
    this.logger.setLogLevel(LogLevel.DEBUG);
  }

  validateUserData(userData: unknown): Result<Omit<User, "id" | "createdAt" | "isActive">, ValidationError> {
    if (typeof userData !== "object" || userData === null) {
      return {
        success: false,
        error: new ValidationError("userData", "User data must be an object", userData)
      };
    }

    const data = userData as any;

    if (!data.name || typeof data.name !== "string" || data.name.trim() === "") {
      return {
        success: false,
        error: new ValidationError("name", "Name is required and must be a non-empty string", data.name)
      };
    }

    if (!data.email || typeof data.email !== "string" || !data.email.includes("@")) {
      return {
        success: false,
        error: new ValidationError("email", "Valid email is required", data.email)
      };
    }

    if (typeof data.age !== "number" || data.age < 0 || data.age > 150) {
      return {
        success: false,
        error: new ValidationError("age", "Age must be a number between 0 and 150", data.age)
      };
    }

    const role = data.role || "user";
    if (!["admin", "user", "moderator"].includes(role)) {
      return {
        success: false,
        error: new ValidationError("role", "Role must be admin, user, or moderator", role)
      };
    }

    return {
      success: true,
      data: {
        name: data.name.trim(),
        email: data.email.toLowerCase(),
        age: data.age,
        role: role as "admin" | "user" | "moderator"
      }
    };
  }

  createUser(userData: unknown): Result<User, ValidationError> {
    return PerformanceProfiler.measure("createUser", () => {
      this.logger.info("Creating user", { userData });

      const validationResult = this.validateUserData(userData);
      if (!validationResult.success) {
        this.logger.warn("User creation failed: validation error", { 
          error: validationResult.error.message 
        });
        return validationResult;
      }

      const user: User = {
        ...validationResult.data,
        id: this.currentUserId++,
        createdAt: new Date(),
        isActive: true
      };

      this.users.push(user);
      this.logger.info("User created successfully", { userId: user.id, userName: user.name });

      return { success: true, data: user };
    });
  }

  getUserById(id: number): Result<User, BusinessLogicError> {
    this.logger.debug("Getting user by ID", { id });

    const user = this.users.find(u => u.id === id);
    if (!user) {
      const error = new BusinessLogicError(
        `User with ID ${id} not found`,
        "USER_NOT_FOUND",
        { requestedId: id, availableIds: this.users.map(u => u.id) }
      );
      this.logger.warn("User not found", { id });
      return { success: false, error };
    }

    this.logger.debug("User found", { userId: user.id, userName: user.name });
    return { success: true, data: user };
  }

  // その他のメソッドも同様に実装...
}

// テスト例
function runTests() {
  const system = new UserManagementSystem();
  
  console.log("🧪 Running tests...\n");

  // ユーザー作成テスト
  const createResult = system.createUser({
    name: "テストユーザー",
    email: "test@example.com",
    age: 25,
    role: "user"
  });

  TypeSafeAssert.equal(createResult.success, true, "User creation should succeed");
  
  if (createResult.success) {
    TypeSafeAssert.equal(createResult.data.name, "テストユーザー", "User name should match");
    TypeSafeAssert.equal(createResult.data.email, "test@example.com", "User email should match");
  }

  // バリデーションエラーテスト
  const invalidResult = system.createUser({
    name: "",
    email: "invalid",
    age: -1
  });

  TypeSafeAssert.equal(invalidResult.success, false, "Invalid user creation should fail");

  console.log("✅ All tests passed!");
}

// 実行
const system = new UserManagementSystem();
runTests();
```

</details>

---

## 🚀 発展課題（任意）

余裕がある場合は以下にも挑戦してみてください：

- [ ] エラーハンドラーの登録システム（エラー種別による処理の分岐）
- [ ] 非同期処理のエラーハンドリング（Promise、async/await）
- [ ] ログの永続化機能（ファイル出力、外部サービス連携）
- [ ] より高度なテストランナー（describe、it、beforeEach等）
- [ ] パフォーマンス測定の可視化（グラフ、レポート生成）

---

**📌 重要**: この課題の目的は**既存のJavaScriptコードを読んで適切なエラーハンドリング、デバッグシステム、テストの型安全性を実装する力**を身につけることです。TypeScriptの堅牢性と保守性を実感しましょう。

**🌟 次のステップ**: Step10では、TypeScriptの最も高度な型機能について学習します！