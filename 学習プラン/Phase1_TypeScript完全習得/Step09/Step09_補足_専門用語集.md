# Step09 専門用語集

> 💡 **このファイルについて**: Step09で出てくるエラーハンドリングとデバッグ関連の重要な専門用語と概念の詳細解説集です。

## 📋 目次
1. [エラーハンドリング用語](#エラーハンドリング用語)
2. [デバッグ用語](#デバッグ用語)
3. [型安全性用語](#型安全性用語)
4. [テスト用語](#テスト用語)

---

## エラーハンドリング用語

### Result型パターン
**定義**: 成功と失敗を型で表現するパターン

**実装例**:
```typescript
type Result<T, E> = 
  | { success: true; data: T }
  | { success: false; error: E };

function divide(a: number, b: number): Result<number, string> {
  if (b === 0) {
    return { success: false, error: "Division by zero" };
  }
  return { success: true, data: a / b };
}
```

### カスタムエラークラス
**定義**: 特定のエラー情報を持つエラークラス

**実装例**:
```typescript
class ValidationError extends Error {
  constructor(
    message: string,
    public field: string,
    public value: unknown
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

class NetworkError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public url: string
  ) {
    super(message);
    this.name = 'NetworkError';
  }
}
```

---

## デバッグ用語

### ソースマップ（Source Map）
**定義**: コンパイル後のコードと元のコードの対応関係を示すファイル

**設定例**:
```json
// tsconfig.json
{
  "compilerOptions": {
    "sourceMap": true,
    "inlineSourceMap": false,
    "sourceRoot": "./src"
  }
}
```

### デバッガー（Debugger）
**定義**: コードの実行を制御し、状態を調査するツール

**使用例**:
```typescript
function complexCalculation(data: number[]): number {
  debugger; // ブレークポイント
  
  let result = 0;
  for (const item of data) {
    result += item * 2;
    console.log(`Processing: ${item}, Current result: ${result}`);
  }
  
  return result;
}
```

---

## 型安全性用語

### 型ガード（Type Guard）
**定義**: 実行時に型を確認し、型安全性を保証する仕組み

**実装例**:
```typescript
function isString(value: unknown): value is string {
  return typeof value === 'string';
}

function isError(value: unknown): value is Error {
  return value instanceof Error;
}

// 使用例
function processValue(value: unknown): string {
  if (isString(value)) {
    return value.toUpperCase(); // valueはstring型として扱われる
  }
  
  if (isError(value)) {
    return value.message; // valueはError型として扱われる
  }
  
  return String(value);
}
```

### アサーション関数（Assertion Function）
**定義**: 条件が満たされない場合にエラーを投げる関数

**実装例**:
```typescript
function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

function assertIsNumber(value: unknown): asserts value is number {
  if (typeof value !== 'number') {
    throw new Error('Expected number');
  }
}

// 使用例
function processNumber(value: unknown): number {
  assertIsNumber(value);
  // この時点でvalueはnumber型として扱われる
  return value * 2;
}
```

---

## テスト用語

### 単体テスト（Unit Test）
**定義**: 個別の関数やクラスをテストする

**実装例**:
```typescript
// math.ts
export function add(a: number, b: number): number {
  return a + b;
}

// math.test.ts
import { add } from './math';

describe('add function', () => {
  test('should add two numbers correctly', () => {
    expect(add(2, 3)).toBe(5);
  });
  
  test('should handle negative numbers', () => {
    expect(add(-1, 1)).toBe(0);
  });
});
```

### モック（Mock）
**定義**: テスト用の偽の実装

**実装例**:
```typescript
// api.ts
export interface ApiClient {
  fetchUser(id: string): Promise<User>;
}

// user.service.test.ts
const mockApiClient: ApiClient = {
  fetchUser: jest.fn().mockResolvedValue({
    id: '1',
    name: 'Test User'
  })
};

test('should fetch user', async () => {
  const user = await mockApiClient.fetchUser('1');
  expect(user.name).toBe('Test User');
});
```

---

## 📚 実用的なパターン

### エラーバウンダリ
```typescript
class ErrorBoundary {
  private errorHandlers: Map<string, (error: Error) => void> = new Map();
  
  registerHandler(errorType: string, handler: (error: Error) => void): void {
    this.errorHandlers.set(errorType, handler);
  }
  
  handleError(error: Error): void {
    const handler = this.errorHandlers.get(error.name);
    if (handler) {
      handler(error);
    } else {
      console.error('Unhandled error:', error);
    }
  }
}
```

### ログシステム
```typescript
enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3
}

class Logger {
  constructor(private level: LogLevel = LogLevel.INFO) {}
  
  debug(message: string, data?: any): void {
    if (this.level <= LogLevel.DEBUG) {
      console.debug(`[DEBUG] ${message}`, data);
    }
  }
  
  info(message: string, data?: any): void {
    if (this.level <= LogLevel.INFO) {
      console.info(`[INFO] ${message}`, data);
    }
  }
  
  warn(message: string, data?: any): void {
    if (this.level <= LogLevel.WARN) {
      console.warn(`[WARN] ${message}`, data);
    }
  }
  
  error(message: string, error?: Error): void {
    if (this.level <= LogLevel.ERROR) {
      console.error(`[ERROR] ${message}`, error);
    }
  }
}
```

---

## 📚 参考リンク

- [TypeScript Error Handling](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)
- [Jest Testing Framework](https://jestjs.io/docs/getting-started)
- [Chrome DevTools](https://developers.google.com/web/tools/chrome-devtools)

---

**📌 重要**: エラーハンドリングとデバッグは、堅牢なアプリケーション開発において不可欠です。型安全性を活用して、予期しないエラーを防ぎ、効率的なデバッグを行いましょう。