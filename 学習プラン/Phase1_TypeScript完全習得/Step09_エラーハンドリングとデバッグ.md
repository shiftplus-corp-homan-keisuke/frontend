# Step 9: エラーハンドリングとデバッグ

> 💡 **補足資料**: 詳細な解説は以下の補足資料を見てね 🐰
>
> - 📖 [専門用語集](./Step09_補足_専門用語集.md) - エラーハンドリング・デバッグ・型安全性・テストの重要な概念と用語の詳細解説
> - 💻 [実践コード例](./Step09_補足_実践コード例.md) - 段階的な学習用コード集
> - 🚨 [トラブルシューティング](./Step09_補足_トラブルシューティング.md) - よくあるエラーと解決方法
> - 📚 [参考リソース](./Step09_補足_参考リソース.md) - 学習に役立つリンク集

## 📅 学習期間・目標

**期間**: Step 9  
**総学習時間**: 6 時間  
**学習スタイル**: 理論 25% + 実践コード 55% + 演習 20%

### 🎯 Step 9 到達目標

- [ ] TypeScript エラーの理解と効果的な解決方法
- [ ] 型安全なエラーハンドリングパターンの習得
- [ ] デバッグ技術とツールの活用
- [ ] テストの型安全性確保
- [ ] 堅牢なアプリケーション設計の実践

## 📚 理論学習内容

### Day 1-2: TypeScript エラーの理解

#### 🔍 コンパイルエラーの分析と解決

##### 1. 型エラーの基本パターン

```typescript
// 💡 詳細解説: 型エラーの種類 → Step09_補足_専門用語集.md#型エラーの種類type-error-types
// Type 'string' is not assignable to type 'number'
let count: number = "hello"; // ❌ エラー
let count2: number = 42; // ✅ 正解

// Object is possibly 'null'
// 💡 詳細解説: null安全性 → Step09_補足_専門用語集.md#null安全性null-safety
function processUser(user: User | null) {
  console.log(user.name); // ❌ エラー: user が null の可能性

  // 正しい解決方法
  if (user) {
    console.log(user.name); // ✅ 正解
  }

  // または
  // 💡 詳細解説: オプショナルチェーン → Step09_補足_専門用語集.md#オプショナルチェーンoptional-chaining
  console.log(user?.name); // ✅ 正解（オプショナルチェーン）
}

// Property 'xyz' does not exist on type
interface User {
  name: string;
  email: string;
}

function getUser(): User {
  return {
    name: "Alice",
    email: "alice@example.com",
    age: 30, // ❌ エラー: 'age' は User 型に存在しない
  };
}

// 正しい解決方法
interface ExtendedUser extends User {
  age: number;
}

function getExtendedUser(): ExtendedUser {
  return {
    name: "Alice",
    email: "alice@example.com",
    age: 30, // ✅ 正解
  };
}
```

##### 2. 関数型エラーの解決

```typescript
// 💡 詳細解説: 関数型エラー → Step09_補足_専門用語集.md#関数型エラーfunction-type-errors
// Argument of type 'X' is not assignable to parameter of type 'Y'
function processNumbers(numbers: number[]): number {
  return numbers.reduce((sum, num) => sum + num, 0);
}

processNumbers(["1", "2", "3"]); // ❌ エラー: string[] は number[] に代入不可

// 正しい解決方法
// 💡 詳細解説: 型変換パターン → Step09_補足_専門用語集.md#型変換パターンtype-conversion-patterns
const stringNumbers = ["1", "2", "3"];
const numbers = stringNumbers.map((str) => parseInt(str, 10));
processNumbers(numbers); // ✅ 正解
```

##### 3. ジェネリクスエラーの解決

// 正しい解決方法
// 💡 詳細解説: 制約による解決 → Step09_補足_専門用語集.md#制約による解決constraint-based-solutions
function processValue2<T extends { toString(): string }>(value: T): string {
  return value.toString(); // ✅ 正解
}

// または
function processValue3<T>(value: T): string {
  return String(value); // ✅ 正解
}
```

#### 🎯 実行時エラーハンドリング

##### 1. Result型パターンとカスタムエラークラス

```typescript
// Result型パターン
type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E };

// カスタムエラークラス
class ValidationError extends Error {
  constructor(public field: string, message: string, public value?: unknown) {
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
```

##### 2. 型安全なエラーハンドリング関数

```typescript
function safeParseInt(value: string): Result<number, ValidationError> {
  const parsed = parseInt(value, 10);

  if (isNaN(parsed)) {
    return {
      success: false,
      error: new ValidationError(
        "value",
        `"${value}" is not a valid number`,
        value
      ),
    };
  }

  return { success: true, data: parsed };
}

async function safeFetch<T>(url: string): Promise<Result<T, NetworkError>> {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      return {
        success: false,
        error: new NetworkError(
          `HTTP ${response.status}: ${response.statusText}`,
          response.status
        ),
      };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: new NetworkError(
        error instanceof Error ? error.message : "Unknown network error"
      ),
    };
  }
}
```

##### 3. エラーハンドリングユーティリティ

```typescript
class ErrorHandler {
  private static errorMap = new Map<string, (error: Error) => void>();

  static register<T extends Error>(
    errorType: new (...args: any[]) => T,
    handler: (error: T) => void
  ): void {
    this.errorMap.set(errorType.name, handler as (error: Error) => void);
  }

  static handle(error: Error): void {
    const handler = this.errorMap.get(error.constructor.name);

    if (handler) {
      handler(error);
    } else {
      console.error("Unhandled error:", error);
    }
  }

  static async withErrorHandling<T>(
    operation: () => Promise<T>,
    fallback?: T
  ): Promise<T | undefined> {
    try {
      return await operation();
    } catch (error) {
      this.handle(error instanceof Error ? error : new Error(String(error)));
      return fallback;
    }
  }
}

// エラーハンドラーの登録
ErrorHandler.register(ValidationError, (error) => {
  console.warn(
    `Validation failed for field "${error.field}": ${error.message}`
  );
});

ErrorHandler.register(NetworkError, (error) => {
  console.error(`Network error (${error.statusCode}): ${error.message}`);
});

ErrorHandler.register(BusinessLogicError, (error) => {
  console.error(
    `Business logic error [${error.code}]: ${error.message}`,
    error.context
  );
});
```

### Day 3-4: デバッグ技術とツール

#### 🔧 効果的なデバッグ手法

##### 1. 型安全なログシステム

```typescript
enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
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

  error(
    message: string,
    error?: Error,
    context?: Record<string, unknown>
  ): void {
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
      error,
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
      return this.logs.filter((log) => log.level >= level);
    }
    return [...this.logs];
  }

  clearLogs(): void {
    this.logs = [];
  }
}
```

##### 2. パフォーマンス測定

```typescript
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

  try {
    const result = fn();

    if (result instanceof Promise) {
      return result.finally(() => this.end(label));
    } else {
      this.end(label);
      return result;
    }
  } catch (error) {
    this.end(label);
    throw error;
  }
}
```

##### 3. デバッグ用ヘルパー関数と使用例

```typescript
// デバッグ用ヘルパー関数
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

// 使用例
const logger = TypeSafeLogger.getInstance();
logger.setLogLevel(LogLevel.DEBUG);

async function exampleFunction() {
  logger.info("Starting example function");

  const result = await PerformanceProfiler.measure(
    "data-processing",
    async () => {
      // 重い処理のシミュレーション
      await new Promise((resolve) => setTimeout(resolve, 100));
      return { processed: true, count: 42 };
    }
  );

  debugValue(result, "Processing result");

  try {
    assertType<number>(result.count, "number");
    logger.info("Type assertion passed", { count: result.count });
  } catch (error) {
    logger.error("Type assertion failed", error as Error);
  }
}
```

### Day 5-7: テストの型安全性

#### 🔧 型安全なテストフレームワーク

##### 1. テストユーティリティ型

```typescript
type TestCase<TInput, TExpected> = {
  name: string;
  input: TInput;
  expected: TExpected;
  setup?: () => void | Promise<void>;
  teardown?: () => void | Promise<void>;
};

type AsyncTestCase<TInput, TExpected> = TestCase<TInput, TExpected> & {
  timeout?: number;
};
```

##### 2. 型安全なモックシステム

```typescript
type MockFunction<T extends (...args: any[]) => any> = {
  (...args: Parameters<T>): ReturnType<T>;
  mockReturnValue(value: ReturnType<T>): void;
  mockResolvedValue(value: Awaited<ReturnType<T>>): void;
  mockRejectedValue(error: Error): void;
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
  let resolvedValue: Awaited<ReturnType<T>> | undefined;
  let rejectedError: Error | undefined;

  const mockFn = ((...args: Parameters<T>): ReturnType<T> => {
    calls.push(args);

    if (rejectedError) {
      const error = rejectedError;
      rejectedError = undefined;
      throw error;
    }

    if (resolvedValue !== undefined) {
      const value = resolvedValue;
      resolvedValue = undefined;
      results.push(Promise.resolve(value) as ReturnType<T>);
      return Promise.resolve(value) as ReturnType<T>;
    }

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

  mockFn.mockResolvedValue = (value: Awaited<ReturnType<T>>) => {
    resolvedValue = value;
  };

  mockFn.mockRejectedValue = (error: Error) => {
    rejectedError = error;
  };

  mockFn.mockImplementation = (fn: T) => {
    implementation = fn;
  };

  mockFn.mockClear = () => {
    calls.length = 0;
    results.length = 0;
    implementation = undefined;
    returnValue = undefined;
    resolvedValue = undefined;
    rejectedError = undefined;
  };

  mockFn.calls = calls;
  mockFn.results = results;

  return mockFn;
}
```

##### 3. 型安全なアサーション

```typescript
class TypeSafeAssert {
  static equal<T>(actual: T, expected: T, message?: string): void {
    if (actual !== expected) {
      throw new Error(message || `Expected ${expected}, but got ${actual}`);
    }
  }

  static deepEqual<T>(actual: T, expected: T, message?: string): void {
    if (JSON.stringify(actual) !== JSON.stringify(expected)) {
      throw new Error(
        message ||
          `Deep equality failed:\nActual: ${JSON.stringify(
            actual
          )}\nExpected: ${JSON.stringify(expected)}`
      );
    }
  }

  static throws(
    fn: () => void,
    expectedError?: string | RegExp,
    message?: string
  ): void {
    try {
      fn();
      throw new Error(message || "Expected function to throw");
    } catch (error) {
      if (expectedError) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        const matches =
          typeof expectedError === "string"
            ? errorMessage.includes(expectedError)
            : expectedError.test(errorMessage);

        if (!matches) {
          throw new Error(
            message ||
              `Expected error to match ${expectedError}, but got: ${errorMessage}`
          );
        }
      }
    }
  }

  static async rejects(
    fn: () => Promise<void>,
    expectedError?: string | RegExp,
    message?: string
  ): Promise<void> {
    try {
      await fn();
      throw new Error(message || "Expected promise to reject");
    } catch (error) {
      if (expectedError) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        const matches =
          typeof expectedError === "string"
            ? errorMessage.includes(expectedError)
            : expectedError.test(errorMessage);

        if (!matches) {
          throw new Error(
            message ||
              `Expected error to match ${expectedError}, but got: ${errorMessage}`
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

  static hasProperty<T, K extends PropertyKey>(
    obj: T,
    prop: K
  ): asserts obj is T & Record<K, unknown> {
    if (!(prop in (obj as any))) {
      throw new Error(`Expected object to have property ${String(prop)}`);
    }
  }
}

// 4. テストランナー
class TypeSafeTestRunner {
  private tests: Array<() => void | Promise<void>> = [];
  private beforeEachHooks: Array<() => void | Promise<void>> = [];
  private afterEachHooks: Array<() => void | Promise<void>> = [];

  describe(name: string, fn: () => void): void {
    console.log(`\n📋 ${name}`);
    fn();
  }

  it(name: string, fn: () => void | Promise<void>): void {
    this.tests.push(async () => {
      try {
        // beforeEach フック実行
        for (const hook of this.beforeEachHooks) {
          await hook();
        }

        // テスト実行
        await fn();

        console.log(`  ✅ ${name}`);
      } catch (error) {
        console.log(`  ❌ ${name}`);
        console.error(`     ${error instanceof Error ? error.message : error}`);
      } finally {
        // afterEach フック実行
        for (const hook of this.afterEachHooks) {
          await hook();
        }
      }
    });
  }

  beforeEach(fn: () => void | Promise<void>): void {
    this.beforeEachHooks.push(fn);
  }

  afterEach(fn: () => void | Promise<void>): void {
    this.afterEachHooks.push(fn);
  }

  async run(): Promise<void> {
    console.log("🧪 Running tests...\n");

    for (const test of this.tests) {
      await test();
    }

    console.log("\n✨ Tests completed");
  }
}

// 使用例
const testRunner = new TypeSafeTestRunner();

testRunner.describe("Calculator", () => {
  let calculator: Calculator;
  let mockLogger: MockFunction<(message: string) => void>;

  testRunner.beforeEach(() => {
    mockLogger = createMock<(message: string) => void>();
    calculator = new Calculator(mockLogger);
  });

  testRunner.it("should add two numbers correctly", () => {
    const result = calculator.add(2, 3);
    TypeSafeAssert.equal(result, 5);
    TypeSafeAssert.equal(mockLogger.calls.length, 1);
  });

  testRunner.it("should throw error for invalid input", () => {
    TypeSafeAssert.throws(() => calculator.divide(10, 0), "Division by zero");
  });
});

// テスト実行
testRunner.run();
```

## 📊 Step 9 評価基準

### 理解度チェックリスト

#### エラー理解・解決 (30%)

- [ ] TypeScript コンパイルエラーを理解し解決できる
- [ ] 型エラーの根本原因を特定できる
- [ ] 適切なエラーメッセージを解釈できる
- [ ] エラー解決のパターンを習得している

#### エラーハンドリング (30%)

- [ ] 型安全なエラーハンドリングを実装できる
- [ ] カスタムエラークラスを設計できる
- [ ] Result 型パターンを活用できる
- [ ] 適切なエラー伝播を実装できる

#### デバッグ技術 (25%)

- [ ] 効果的なデバッグ手法を使用できる
- [ ] ログシステムを型安全に実装できる
- [ ] パフォーマンス測定を実装できる
- [ ] デバッグツールを活用できる

#### テスト (15%)

- [ ] 型安全なテストを作成できる
- [ ] モックシステムを活用できる
- [ ] アサーションを適切に使用できる
- [ ] テストの保守性を確保できる

### 成果物チェックリスト

- [ ] **エラーハンドリングシステム**: 包括的なエラー処理
- [ ] **ログシステム**: 型安全なログ機能
- [ ] **テストスイート**: 型安全なテストフレームワーク
- [ ] **デバッグツール**: 実用的なデバッグユーティリティ

## 🔄 Step 10 への準備

### 次週学習内容の予習

```typescript
// Step 10で学習する高度な型機能の基礎概念
// 以下のコードを読んで理解しておくこと

// 1. 条件付き型
type IsString<T> = T extends string ? true : false;

// 2. infer キーワード
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

// 3. テンプレートリテラル型
type EventName<T extends string> = `on${Capitalize<T>}`;

// 4. 再帰的型定義
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};
```

---

**📌 重要**: Step 9 は TypeScript アプリケーションの品質と保守性を大幅に向上させる重要な技術を学習します。適切なエラーハンドリングとデバッグ技術により、実用的で堅牢なアプリケーションが構築できるようになります。

**🌟 次週は、TypeScript の最も高度な型機能について学習します！**
