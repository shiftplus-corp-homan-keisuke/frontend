# Step09 トラブルシューティング

> 💡 **このファイルについて**: エラーハンドリングとデバッグでよくあるエラーと解決方法をまとめたガイドです。

## 📋 目次
1. [エラーハンドリング関連エラー](#エラーハンドリング関連エラー)
2. [デバッグ関連エラー](#デバッグ関連エラー)
3. [テスト関連エラー](#テスト関連エラー)
4. [パフォーマンス問題](#パフォーマンス問題)

---

## エラーハンドリング関連エラー

### "Unhandled Promise Rejection" エラー
**原因**: Promiseのエラーがキャッチされていない

**解決方法**:
```typescript
// 間違い
async function fetchData() {
  const response = await fetch('/api/data'); // エラーハンドリングなし
  return response.json();
}

// 正しい
async function fetchData(): Promise<Result<Data, Error>> {
  try {
    const response = await fetch('/api/data');
    if (!response.ok) {
      return ResultUtils.failure(new Error(`HTTP ${response.status}`));
    }
    const data = await response.json();
    return ResultUtils.success(data);
  } catch (error) {
    return ResultUtils.failure(error as Error);
  }
}
```

### カスタムエラーの型問題
**解決方法**:
```typescript
// 型ガードを使用
function isValidationError(error: unknown): error is ValidationError {
  return error instanceof ValidationError;
}

// エラーハンドリング
try {
  // 何らかの処理
} catch (error) {
  if (isValidationError(error)) {
    console.log(`Validation failed for field: ${error.field}`);
  } else {
    console.error('Unknown error:', error);
  }
}
```

---

## デバッグ関連エラー

### ソースマップが機能しない
**解決方法**:
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

### ログが出力されない
**解決方法**:
```typescript
// ログレベルを確認
const logger = new Logger(LogLevel.DEBUG); // DEBUGレベルに設定

// 環境変数での制御
const logLevel = process.env.LOG_LEVEL || 'INFO';
const logger = new Logger(LogLevel[logLevel as keyof typeof LogLevel]);
```

---

## テスト関連エラー

### "Cannot find module" in tests
**解決方法**:
```json
// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1'
  }
};
```

### 非同期テストのタイムアウト
**解決方法**:
```typescript
// タイムアウトを設定
test('async operation', async () => {
  await expect(longRunningOperation()).resolves.toBe(expected);
}, 10000); // 10秒のタイムアウト
```

---

## パフォーマンス問題

### メモリリーク
**解決方法**:
```typescript
// イベントリスナーの適切な削除
class Component {
  private cleanup: (() => void)[] = [];

  constructor() {
    const unsubscribe = eventEmitter.on('event', this.handleEvent);
    this.cleanup.push(unsubscribe);
  }

  destroy(): void {
    this.cleanup.forEach(fn => fn());
    this.cleanup = [];
  }
}
```

---

**📌 重要**: エラーハンドリングとデバッグでは、適切なログ出力と型安全なエラー処理が重要です。問題が発生した場合は、ログを確認し、段階的にデバッグを行いましょう。