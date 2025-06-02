# Step09 実践コード例

> 💡 **このファイルについて**: エラーハンドリングとデバッグの段階的な学習のためのコード例集です。

## 📋 目次
1. [型安全なエラーハンドリング](#型安全なエラーハンドリング)
2. [デバッグ支援システム](#デバッグ支援システム)
3. [テスト駆動開発](#テスト駆動開発)

---

## 型安全なエラーハンドリング

### ステップ1: Result型パターンの実装
```typescript
// types/result.ts
export type Result<T, E = Error> = 
  | { success: true; data: T }
  | { success: false; error: E };

export class ResultUtils {
  static success<T>(data: T): Result<T, never> {
    return { success: true, data };
  }

  static failure<E>(error: E): Result<never, E> {
    return { success: false, error };
  }

  static isSuccess<T, E>(result: Result<T, E>): result is { success: true; data: T } {
    return result.success;
  }

  static isFailure<T, E>(result: Result<T, E>): result is { success: false; error: E } {
    return !result.success;
  }

  static map<T, U, E>(
    result: Result<T, E>,
    fn: (data: T) => U
  ): Result<U, E> {
    if (ResultUtils.isSuccess(result)) {
      return ResultUtils.success(fn(result.data));
    }
    return result;
  }

  static flatMap<T, U, E>(
    result: Result<T, E>,
    fn: (data: T) => Result<U, E>
  ): Result<U, E> {
    if (ResultUtils.isSuccess(result)) {
      return fn(result.data);
    }
    return result;
  }
}

// 使用例
function divide(a: number, b: number): Result<number, string> {
  if (b === 0) {
    return ResultUtils.failure("Division by zero");
  }
  return ResultUtils.success(a / b);
}

function processCalculation(x: number, y: number): Result<string, string> {
  return ResultUtils.flatMap(
    divide(x, y),
    result => ResultUtils.success(`Result: ${result.toFixed(2)}`)
  );
}
```

### ステップ2: カスタムエラークラス
```typescript
// errors/custom-errors.ts
export abstract class BaseError extends Error {
  abstract readonly code: string;
  abstract readonly statusCode: number;

  constructor(message: string, public readonly context?: Record<string, any>) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }

  toJSON() {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      statusCode: this.statusCode,
      context: this.context,
      stack: this.stack
    };
  }
}

export class ValidationError extends BaseError {
  readonly code = 'VALIDATION_ERROR';
  readonly statusCode = 400;

  constructor(
    message: string,
    public readonly field: string,
    public readonly value: unknown,
    context?: Record<string, any>
  ) {
    super(message, { ...context, field, value });
  }
}

export class NetworkError extends BaseError {
  readonly code = 'NETWORK_ERROR';
  readonly statusCode = 500;

  constructor(
    message: string,
    public readonly url: string,
    public readonly method: string,
    context?: Record<string, any>
  ) {
    super(message, { ...context, url, method });
  }
}

export class NotFoundError extends BaseError {
  readonly code = 'NOT_FOUND';
  readonly statusCode = 404;

  constructor(
    message: string,
    public readonly resource: string,
    public readonly id: string,
    context?: Record<string, any>
  ) {
    super(message, { ...context, resource, id });
  }
}

// エラーハンドラー
export class ErrorHandler {
  private handlers: Map<string, (error: BaseError) => void> = new Map();

  register(errorCode: string, handler: (error: BaseError) => void): void {
    this.handlers.set(errorCode, handler);
  }

  handle(error: Error): void {
    if (error instanceof BaseError) {
      const handler = this.handlers.get(error.code);
      if (handler) {
        handler(error);
        return;
      }
    }

    // デフォルトハンドラー
    console.error('Unhandled error:', error);
  }
}
```

---

## デバッグ支援システム

### ステップ3: ログシステム
```typescript
// utils/logger.ts
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3
}

export interface LogEntry {
  timestamp: Date;
  level: LogLevel;
  message: string;
  data?: any;
  context?: Record<string, any>;
}

export class Logger {
  private entries: LogEntry[] = [];
  private maxEntries = 1000;

  constructor(
    private level: LogLevel = LogLevel.INFO,
    private context: Record<string, any> = {}
  ) {}

  private log(level: LogLevel, message: string, data?: any): void {
    if (level < this.level) return;

    const entry: LogEntry = {
      timestamp: new Date(),
      level,
      message,
      data,
      context: { ...this.context }
    };

    this.entries.push(entry);
    if (this.entries.length > this.maxEntries) {
      this.entries.shift();
    }

    this.output(entry);
  }

  private output(entry: LogEntry): void {
    const levelName = LogLevel[entry.level];
    const timestamp = entry.timestamp.toISOString();
    const message = `[${timestamp}] [${levelName}] ${entry.message}`;

    switch (entry.level) {
      case LogLevel.DEBUG:
        console.debug(message, entry.data);
        break;
      case LogLevel.INFO:
        console.info(message, entry.data);
        break;
      case LogLevel.WARN:
        console.warn(message, entry.data);
        break;
      case LogLevel.ERROR:
        console.error(message, entry.data);
        break;
    }
  }

  debug(message: string, data?: any): void {
    this.log(LogLevel.DEBUG, message, data);
  }

  info(message: string, data?: any): void {
    this.log(LogLevel.INFO, message, data);
  }

  warn(message: string, data?: any): void {
    this.log(LogLevel.WARN, message, data);
  }

  error(message: string, data?: any): void {
    this.log(LogLevel.ERROR, message, data);
  }

  createChild(context: Record<string, any>): Logger {
    return new Logger(this.level, { ...this.context, ...context });
  }

  getEntries(level?: LogLevel): LogEntry[] {
    if (level !== undefined) {
      return this.entries.filter(entry => entry.level >= level);
    }
    return [...this.entries];
  }

  clear(): void {
    this.entries = [];
  }
}

// グローバルロガー
export const logger = new Logger();
```

### ステップ4: パフォーマンス測定
```typescript
// utils/performance.ts
export class PerformanceMonitor {
  private measurements: Map<string, number> = new Map();
  private timers: Map<string, number> = new Map();

  start(label: string): void {
    this.timers.set(label, performance.now());
  }

  end(label: string): number {
    const startTime = this.timers.get(label);
    if (startTime === undefined) {
      throw new Error(`Timer '${label}' was not started`);
    }

    const duration = performance.now() - startTime;
    this.measurements.set(label, duration);
    this.timers.delete(label);

    logger.debug(`Performance: ${label} took ${duration.toFixed(2)}ms`);
    return duration;
  }

  measure<T>(label: string, fn: () => T): T;
  measure<T>(label: string, fn: () => Promise<T>): Promise<T>;
  measure<T>(label: string, fn: () => T | Promise<T>): T | Promise<T> {
    this.start(label);
    
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

  getMeasurement(label: string): number | undefined {
    return this.measurements.get(label);
  }

  getAllMeasurements(): Record<string, number> {
    return Object.fromEntries(this.measurements);
  }

  clear(): void {
    this.measurements.clear();
    this.timers.clear();
  }
}

export const performanceMonitor = new PerformanceMonitor();

// デコレーター
export function measurePerformance(label?: string) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    const measureLabel = label || `${target.constructor.name}.${propertyKey}`;

    descriptor.value = function (...args: any[]) {
      return performanceMonitor.measure(measureLabel, () => {
        return originalMethod.apply(this, args);
      });
    };

    return descriptor;
  };
}
```

---

## テスト駆動開発

### ステップ5: テストユーティリティ
```typescript
// test/test-utils.ts
export class TestUtils {
  static async expectAsync<T>(
    promise: Promise<T>,
    expectedValue: T
  ): Promise<void> {
    const result = await promise;
    expect(result).toEqual(expectedValue);
  }

  static async expectAsyncError(
    promise: Promise<any>,
    expectedError: string | RegExp | Error
  ): Promise<void> {
    try {
      await promise;
      throw new Error('Expected promise to reject');
    } catch (error) {
      if (typeof expectedError === 'string') {
        expect(error.message).toBe(expectedError);
      } else if (expectedError instanceof RegExp) {
        expect(error.message).toMatch(expectedError);
      } else {
        expect(error).toEqual(expectedError);
      }
    }
  }

  static createMockFunction<T extends (...args: any[]) => any>(
    implementation?: T
  ): jest.MockedFunction<T> {
    return jest.fn(implementation) as jest.MockedFunction<T>;
  }

  static createMockObject<T>(partial: Partial<T>): T {
    return partial as T;
  }

  static wait(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// テストデータファクトリー
export class TestDataFactory {
  static createUser(overrides: Partial<User> = {}): User {
    return {
      id: 'test-user-id',
      name: 'Test User',
      email: 'test@example.com',
      createdAt: new Date(),
      ...overrides
    };
  }

  static createTodo(overrides: Partial<Todo> = {}): Todo {
    return {
      id: 'test-todo-id',
      title: 'Test Todo',
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...overrides
    };
  }
}
```

### ステップ6: 統合テスト例
```typescript
// services/user.service.test.ts
import { UserService } from './user.service';
import { TestUtils, TestDataFactory } from '../test/test-utils';
import { ValidationError, NotFoundError } from '../errors/custom-errors';

describe('UserService', () => {
  let userService: UserService;
  let mockRepository: jest.Mocked<UserRepository>;

  beforeEach(() => {
    mockRepository = {
      findById: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
      findAll: jest.fn()
    };
    userService = new UserService(mockRepository);
  });

  describe('createUser', () => {
    it('should create user successfully', async () => {
      const userData = { name: 'John Doe', email: 'john@example.com' };
      const expectedUser = TestDataFactory.createUser(userData);
      
      mockRepository.save.mockResolvedValue(expectedUser);

      const result = await userService.createUser(userData);

      expect(result).toEqual(expectedUser);
      expect(mockRepository.save).toHaveBeenCalledWith(
        expect.objectContaining(userData)
      );
    });

    it('should throw ValidationError for invalid email', async () => {
      const userData = { name: 'John Doe', email: 'invalid-email' };

      await TestUtils.expectAsyncError(
        userService.createUser(userData),
        new ValidationError('Invalid email format', 'email', 'invalid-email')
      );
    });
  });

  describe('getUserById', () => {
    it('should return user when found', async () => {
      const userId = 'test-id';
      const expectedUser = TestDataFactory.createUser({ id: userId });
      
      mockRepository.findById.mockResolvedValue(expectedUser);

      const result = await userService.getUserById(userId);

      expect(result).toEqual(expectedUser);
    });

    it('should throw NotFoundError when user not found', async () => {
      const userId = 'non-existent-id';
      
      mockRepository.findById.mockResolvedValue(null);

      await TestUtils.expectAsyncError(
        userService.getUserById(userId),
        new NotFoundError('User not found', 'user', userId)
      );
    });
  });
});
```

---

## 🎯 実行とテストの方法

### 基本的な実行方法
```bash
# テストの実行
npm test

# カバレッジ付きテスト
npm run test:coverage

# ウォッチモード
npm run test:watch

# デバッグモード
npm run test:debug
```

---

**📌 重要**: エラーハンドリングとデバッグは、堅牢なアプリケーション開発において不可欠です。型安全性を活用して、予期しないエラーを防ぎ、効率的なデバッグを行いましょう。