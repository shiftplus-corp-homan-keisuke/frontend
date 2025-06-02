# Step 9: エラーハンドリングとデバッグ

> 💡 **補足資料**: 詳細な解説は以下の補足資料を見てね 🐰
>
> - 📖 [専門用語集](./Step09_補足_専門用語集.md) - エラーハンドリング・デバッグ・型安全性・テストの重要な概念と用語の詳細解説
> - 💻 [実践コード例](./Step09_補足_実践コード例.md) - 段階的な学習用コード集
> - 🚨 [トラブルシューティング](./Step09_補足_トラブルシューティング.md) - よくあるエラーと解決方法
> - 📚 [参考リソース](./Step09_補足_参考リソース.md) - 学習に役立つリンク集
> - 📋 [補足資料](./Step09_補足資料.md) - その他の重要な補足情報

## 📅 学習期間・目標

**期間**: Step 9  
**総学習時間**: 3 時間  
**学習スタイル**: 理論 25% + 実践コード 55% + 演習 20%

### 🎯 Step 9 到達目標

- [ ] TypeScript エラーの理解と効果的な解決方法
- [ ] 型安全なエラーハンドリングパターンの習得
- [ ] デバッグ技術とツールの活用
- [ ] テストの型安全性確保
- [ ] 堅牢なアプリケーション設計の実践

## 📚 理論学習内容

### Section 1: TypeScript エラーの理解

#### 🔍 型エラーの実践的解決

**💡 なぜ型安全なエラーハンドリング・デバッグが重要なのか**

TypeScript のエラーハンドリングとデバッグは、堅牢で保守性の高いアプリケーション開発の基盤です。開発効率向上と品質確保、実際のプロジェクトでの問題解決能力、チーム開発での効果を最大化します。特に型安全なエラーハンドリングにより、ランタイムエラーの予防、デバッグ時間の短縮、プロダクション環境での安定性確保を実現できます。

**🎯 どういう場面で使うのか**

- **開発時のエラー解決**: コンパイルエラーの効率的な解決
- **プロダクション環境**: 堅牢なエラーハンドリングによる安定性確保
- **デバッグ・監視**: 構造化ログによる効率的な問題特定
- **テスト駆動開発**: 型安全なテスト設計による品質向上
- **チーム開発**: エラーハンドリング統一による協業効率化
- **CI/CD パイプライン**: 自動化された品質チェック

##### 1. 型エラーの実践的解決パターン

> 💡 **詳細解説**: 型エラーの種類について [Step09\_補足\_専門用語集.md#型エラーの種類](./Step09_補足_専門用語集.md#型エラーの種類type-error-types) を見てね 🐰

```typescript
// 1. 基本的な型不一致エラーの実践的解決
// Type 'string' is not assignable to type 'number'
let count: number = "hello"; // ❌ エラー
let count2: number = 42; // ✅ 正解

// 実際のプロジェクトでの型変換パターン
function parseUserInput(input: string): number | null {
  const parsed = parseInt(input, 10);
  return isNaN(parsed) ? null : parsed;
}

// 型安全な環境変数処理
function getPort(): number {
  const port = process.env.PORT;
  if (!port) {
    throw new Error("PORT environment variable is required");
  }

  const parsed = parseInt(port, 10);
  if (isNaN(parsed)) {
    throw new Error(`Invalid PORT value: ${port}`);
  }

  return parsed;
}

// 2. null/undefined 安全性の実践的確保
// Object is possibly 'null'
```

> 💡 **詳細解説**: null安全性について [Step09\_補足\_専門用語集.md#null安全性](./Step09_補足_専門用語集.md#null安全性null-safety) を見てね 🐰

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  profile?: {
    avatar?: string;
    bio?: string;
  };
}

function processUser(user: User | null) {
  console.log(user.name); // ❌ エラー: user が null の可能性

  // 実践的な解決パターン
  if (!user) {
    console.log("User not found");
    return;
  }

  console.log(user.name); // ✅ 正解

  // ネストしたオプショナルプロパティの安全なアクセス
```

> 💡 **詳細解説**: オプショナルチェーンについて [Step09\_補足\_専門用語集.md#オプショナルチェーン](./Step09_補足_専門用語集.md#オプショナルチェーンoptional-chaining) を見てね 🐰

```typescript
  console.log(user.profile?.avatar ?? "default-avatar.png");

  // Null Coalescing を活用した実践的パターン
  const displayName = user.profile?.bio ?? `User ${user.name}`;
  console.log(displayName);
}

// 実際のAPI レスポンス処理での活用
async function fetchUser(id: string): Promise<User | null> {
  try {
    const response = await fetch(`/api/users/${id}`);
    if (!response.ok) {
      return null;
    }

    const userData = await response.json();

    // 型ガードによる安全な型チェック
```

> 💡 **詳細解説**: 型ガードについて [Step09\_補足\_専門用語集.md#型ガード](./Step09_補足_専門用語集.md#型ガードtype-guards) を見てね 🐰

```typescript
    if (isValidUser(userData)) {
      return userData;
    }

    return null;
  } catch (error) {
    console.error("Failed to fetch user:", error);
    return null;
  }
}

function isValidUser(data: unknown): data is User {
  return (
    typeof data === "object" &&
    data !== null &&
    typeof (data as User).id === "string" &&
    typeof (data as User).name === "string" &&
    typeof (data as User).email === "string"
  );
}

// 3. プロパティ存在エラーの実践的解決
// Property 'xyz' does not exist on type
interface BaseUser {
  name: string;
  email: string;
}

function getUser(): BaseUser {
  return {
    name: "Alice",
    email: "alice@example.com",
    age: 30, // ❌ エラー: 'age' は BaseUser 型に存在しない
  };
}

// 実践的な解決パターン
interface ExtendedUser extends BaseUser {
  age: number;
  role: "admin" | "user" | "moderator";
  lastLoginAt?: Date;
}

function getExtendedUser(): ExtendedUser {
  return {
    name: "Alice",
    email: "alice@example.com",
    age: 30,
    role: "user",
    lastLoginAt: new Date(),
  };
}

// 動的プロパティアクセスの型安全な実装
function getUserProperty<K extends keyof ExtendedUser>(
  user: ExtendedUser,
  key: K
): ExtendedUser[K] {
  return user[key];
}

// 使用例
const user = getExtendedUser();
const userName = getUserProperty(user, "name"); // string
const userAge = getUserProperty(user, "age"); // number
// const invalid = getUserProperty(user, 'invalid'); // ❌ コンパイルエラー

// 4. 実際のプロジェクトでの複合エラー解決
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
}

async function handleApiResponse<T>(response: ApiResponse<T>): Promise<T> {
  if (!response.success) {
    const error = response.error;
    if (!error) {
      throw new Error("API request failed with unknown error");
    }

    throw new Error(`API Error [${error.code}]: ${error.message}`);
  }

  if (!response.data) {
    throw new Error("API response missing data");
  }

  return response.data;
}

// 型安全なエラーハンドリングクラス
class TypedError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly details?: Record<string, unknown>
  ) {
    super(message);
    this.name = "TypedError";
  }
}

function createTypedError(
  code: string,
  message: string,
  details?: Record<string, unknown>
): TypedError {
  return new TypedError(message, code, details);
}
```

**📝 実装の詳細解説**

- **型変換パターン**: 実際のプロジェクトで頻出する文字列 → 数値変換の安全な実装
- **null 安全性**: オプショナルチェーンと Null Coalescing を活用した実践的パターン
- **型ガード活用**: API レスポンスの安全な型チェックと変換
- **動的プロパティアクセス**: keyof を活用した型安全なプロパティアクセス

**⚠️ よくある間違いと注意点**

```typescript
// ❌ 間違い: 型アサーションの乱用
function badApiCall(response: unknown): User {
  return response as User; // 危険：型チェックなし
}

// ❌ 間違い: null チェックの不備
function badUserProcess(user: User | null) {
  return user.name.toUpperCase(); // null の場合にランタイムエラー
}

// ❌ 間違い: エラー情報の不足
function badErrorHandling() {
  throw new Error("Something went wrong"); // 詳細情報なし
}

// ✅ 正解: 型ガードによる安全な変換
function goodApiCall(response: unknown): User | null {
  if (isValidUser(response)) {
    return response;
  }
  return null;
}

// ✅ 正解: 適切な null チェック
function goodUserProcess(user: User | null): string {
  if (!user) {
    return "Unknown User";
  }
  return user.name.toUpperCase();
}

// ✅ 正解: 詳細なエラー情報
function goodErrorHandling(context: string, details?: Record<string, unknown>) {
  throw createTypedError(
    "VALIDATION_ERROR",
    `Validation failed in ${context}`,
    details
  );
}
```

**🚀 実際のプロジェクトでの活用例**

```typescript
// React でのエラーハンドリング
interface UserProfileProps {
  userId: string;
}

function UserProfile({ userId }: UserProfileProps) {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser(userId)
      .then((userData) => {
        if (userData) {
          setUser(userData);
          setError(null);
        } else {
          setError("User not found");
        }
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Unknown error");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [userId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!user) return <div>User not found</div>;

  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
      {user.profile?.avatar && (
        <img src={user.profile.avatar} alt={`${user.name}'s avatar`} />
      )}
    </div>
  );
}

// Express.js でのエラーハンドリング
app.get("/api/users/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || typeof id !== "string") {
      return res.status(400).json({
        success: false,
        error: {
          code: "INVALID_USER_ID",
          message: "User ID is required and must be a string",
        },
      });
    }

    const user = await fetchUser(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: {
          code: "USER_NOT_FOUND",
          message: `User with ID ${id} not found`,
        },
      });
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Error fetching user:", error);

    res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "An unexpected error occurred",
      },
    });
  }
});
```

##### 2. 関数型エラーの解決

> 💡 **詳細解説**: 関数型エラーについて [Step09\_補足\_専門用語集.md#関数型エラー](./Step09_補足_専門用語集.md#関数型エラーfunction-type-errors) を見てね 🐰

```typescript
// Argument of type 'X' is not assignable to parameter of type 'Y'
function processNumbers(numbers: number[]): number {
  return numbers.reduce((sum, num) => sum + num, 0);
}

processNumbers(["1", "2", "3"]); // ❌ エラー: string[] は number[] に代入不可

// 正しい解決方法
```

> 💡 **詳細解説**: 型変換パターンについて [Step09\_補足\_専門用語集.md#型変換パターン](./Step09_補足_専門用語集.md#型変換パターンtype-conversion-patterns) を見てね 🐰

```typescript
const stringNumbers = ["1", "2", "3"];
const numbers = stringNumbers.map((str) => parseInt(str, 10));
processNumbers(numbers); // ✅ 正解
```

##### 3. ジェネリクスエラーの解決

> 💡 **詳細解説**: 制約による解決について [Step09\_補足\_専門用語集.md#制約による解決](./Step09_補足_専門用語集.md#制約による解決constraint-based-solutions) を見てね 🐰

```typescript
// 正しい解決方法
function processValue2<T extends { toString(): string }>(value: T): string {
return value.toString(); // ✅ 正解
}

// または
function processValue3<T>(value: T): string {
return String(value); // ✅ 正解
}

````

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
````

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

### Section 2: デバッグ技術とツール

> 💡 **詳細解説**: デバッグ技術について [Step09\_補足\_専門用語集.md#デバッグ技術](./Step09_補足_専門用語集.md#デバッグ技術debugging-techniques) を見てね 🐰

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

### Section 3: テストの型安全性

> 💡 **詳細解説**: 型安全なテストについて [Step09\_補足\_専門用語集.md#型安全なテスト](./Step09_補足_専門用語集.md#型安全なテストtype-safe-testing) を見てね 🐰

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

> 💡 **詳細解説**: 型安全なアサーションについて [Step09\_補足\_専門用語集.md#型安全なアサーション](./Step09_補足_専門用語集.md#型安全なアサーションtype-safe-assertions) を見てね 🐰

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

### 成果物

> 📝 **実践課題**: Step 9 の学習内容を実際のコードで実践してみましょう！
>
> **[📋 Step09 成果物：ユーザー管理システムのエラーハンドリング・デバッグ・テスト強化](./Step09_成果物.md)**
>
> 既存のJavaScriptコードにTypeScriptの型安全なエラーハンドリング、デバッグシステム、テストの型安全性を追加する実践的な課題です。Step 9 で学習した知識を統合して、堅牢で保守性の高いシステムを構築しましょう。


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
