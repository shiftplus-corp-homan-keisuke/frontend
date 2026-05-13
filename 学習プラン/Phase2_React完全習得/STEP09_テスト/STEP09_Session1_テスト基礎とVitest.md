# Session 1: テスト基礎とVitest

## はじめに：なぜテストが必要なのか？

STEP01〜08でReactアプリケーションの実装スキルを学んできました。しかし、実務では**「動作するコードを書く」だけでは不十分**です。コードの品質を保証し、リファクタリングを安全に行うためには**テスト**が不可欠です。

### テストがないことのリスク

```
リファクタリング時: "この変更で壊れていないかどうか..."
バグ修正時: "この修正で他に影響が出ていないか..."
コードレビュー時: "この動作を手動で確認する必要がある..."
リリース前: "全機能を手動で回帰テストする必要がある..."
```

### テストがあることのメリット

| メリット | 説明 |
|----------|------|
| **自信を持ってリファクタリング** | 壊したらテストが教えてくれる |
| **バグの早期発見** | 開発時に発見 → 修正コストが低い |
| **仕様の文書化** | テストコードが「どう動作すべきか」の文書になる |
| **手動テストの削減** | 反復的な確認を自動化 |
| **設計の改善** | テストしやすいコードは良い設計 |

---

## 1. テストの種類

### テストピラミッド

```
        /\
       /  \     E2Eテスト（少数）
      /____\    - ブラウザ自動化
     /      \   - 高コスト、遅い
    /        \  
   /__________\ 統合テスト（中程度）
  /            \ - 複数コンポーネントの連携
 /              \ - APIとの連携
/________________\ 単体テスト（多数）
                   - 関数・コンポーネント単位
                   - 低コスト、高速
```

### 各テストの比較

| 種類 | 範囲 | 速度 | コスト | 信頼性 |
|------|------|------|--------|--------|
| 単体テスト | 1関数/コンポーネント | 速い | 低 | 中 |
| 統合テスト | 複数の連携 | 中 | 中 | 高 |
| E2Eテスト | 全体フロー | 遅い | 高 | 最高 |

### このSTEPで学ぶ範囲

- **単体テスト**: 純粋関数、ユーティリティ、カスタムフック
- **コンポーネントテスト**: React Testing Library
- **統合テスト**: APIモック（MSW）
- **E2Eテスト**: Playwright（STEP10で詳細）

---

## 2. 環境構築

### Vitestのインストール

```bash
# 既存プロジェクトに追加
npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event

# TypeScript型
npm install -D @types/testing-library__jest-dom
```

### 設定ファイル

```ts
// vitest.config.ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom", // ブラウザ環境をシミュレート
    globals: true, // describe, it, expect をグローバルに
    setupFiles: "./src/test/setup.ts", // セットアップファイル
  },
});
```

```ts
// src/test/setup.ts
import "@testing-library/jest-dom"; // toBeInTheDocument() など
```

### package.jsonのスクリプト

```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "test:run": "vitest run"
  }
}
```

### tsconfig.json

```json
{
  "compilerOptions": {
    "types": ["vitest/globals", "@testing-library/jest-dom"]
  }
}
```

---

## 3. Vitestの基本構文

### テストの構造

```ts
import { describe, it, expect } from "vitest";

// テストスイート
describe("計算関数", () => {
  // テストケース
  it("2つの数値を足し合わせる", () => {
    // Arrange（準備）
    const a = 1;
    const b = 2;
    
    // Act（実行）
    const result = add(a, b);
    
    // Assert（検証）
    expect(result).toBe(3);
  });
  
  it("負の数値でも正しく動作する", () => {
    expect(add(-1, -2)).toBe(-3);
  });
});

function add(a: number, b: number): number {
  return a + b;
}
```

### AAAパターン

すべてのテストは**Arrange-Act-Assert**の3ステップで構成します。

```ts
it("ユーザー名をフォーマットする", () => {
  // Arrange: 準備
  const user = { firstName: "太郎", lastName: "田中" };
  
  // Act: 実行
  const result = formatUserName(user);
  
  // Assert: 検証
  expect(result).toBe("田中 太郎");
});
```

### よく使うMatcher

```ts
// 等価性
expect(result).toBe(3);           // 厳密等価 (===)
expect(result).toEqual({ a: 1 });  // 深い等価
expect(result).toStrictEqual({});  // 型も含めた厳密等価

// 真偽値
expect(result).toBe(true);
expect(result).toBeTruthy();       // truthyな値
expect(result).toBeFalsy();        // falsyな値
expect(result).toBeNull();
expect(result).toBeUndefined();

// 数値
expect(result).toBeGreaterThan(5);
expect(result).toBeGreaterThanOrEqual(5);
expect(result).toBeLessThan(10);
expect(result).toBeCloseTo(0.3);   // 浮動小数点

// 文字列
expect(result).toContain("hello");
expect(result).toMatch(/hello/);
expect(result).toHaveLength(5);

// 配列・オブジェクト
expect(result).toContain("item");
expect(result).toHaveLength(3);
expect(result).toHaveProperty("name");
expect(result).toEqual(expect.arrayContaining(["a", "b"]));

// 例外
expect(() => throwError()).toThrow();
expect(() => throwError()).toThrow("エラーメッセージ");
```

### グループ化とスキップ

```ts
describe("数学関数", () => {
  describe("加算", () => {
    it("正の数", () => { /* ... */ });
    it("負の数", () => { /* ... */ });
  });
  
  describe.skip("減算", () => { // スキップ
    it("...", () => {});
  });
  
  it.only("このテストだけ実行", () => { // only
    /* ... */
  });
});
```

---

## 4. 非同期テスト

### Promise

```ts
it("データを取得する", async () => {
  const data = await fetchData();
  expect(data).toEqual({ id: 1, name: "Test" });
});
```

### resolves/rejects

```ts
it("正常に解決する", () => {
  expect(fetchData()).resolves.toEqual({ id: 1 });
});

it("エラーを投げる", () => {
  expect(fetchData()).rejects.toThrow("Network error");
});
```

### async/await + expect

```ts
it("エラーを投げる", async () => {
  await expect(fetchData()).rejects.toThrow("Network error");
});
```

---

## 5. テストの前後処理

```ts
describe("データベース操作", () => {
  // 各テスト前に実行
  beforeEach(() => {
    db.clear();
    db.seed({ users: [] });
  });
  
  // 各テスト後に実行
  afterEach(() => {
    db.clear();
  });
  
  // 全テスト前に1回実行
  beforeAll(() => {
    db.connect();
  });
  
  // 全テスト後に1回実行
  afterAll(() => {
    db.disconnect();
  });
  
  it("ユーザーを追加", () => {
    db.addUser({ name: "太郎" });
    expect(db.getUsers()).toHaveLength(1);
  });
  
  it("ユーザーが空", () => {
    // beforeEachでクリアされている
    expect(db.getUsers()).toHaveLength(0);
  });
});
```

---

## 6. モック（Mock）

### vi.fn()

```ts
import { vi } from "vitest";

it("コールバックが呼ばれる", () => {
  const callback = vi.fn();
  
  executeCallback(callback);
  
  expect(callback).toHaveBeenCalled();
  expect(callback).toHaveBeenCalledTimes(1);
  expect(callback).toHaveBeenCalledWith("arg1", "arg2");
});

it("モックの戻り値", () => {
  const mockFn = vi.fn().mockReturnValue(42);
  
  expect(mockFn()).toBe(42);
  expect(mockFn()).toBe(42); // 毎回同じ
});

it("連続した戻り値", () => {
  const mockFn = vi.fn()
    .mockReturnValueOnce(1)
    .mockReturnValueOnce(2)
    .mockReturnValue(3);
  
  expect(mockFn()).toBe(1);
  expect(mockFn()).toBe(2);
  expect(mockFn()).toBe(3);
  expect(mockFn()).toBe(3);
});

it("非同期モック", async () => {
  const mockFn = vi.fn().mockResolvedValue({ data: [] });
  
  const result = await mockFn();
  expect(result).toEqual({ data: [] });
});
```

### vi.mock()

```ts
// utils/api.ts のモック
vi.mock("../utils/api", () => ({
  fetchUser: vi.fn().mockResolvedValue({ id: 1, name: "Test" }),
  updateUser: vi.fn().mockResolvedValue(true),
}));
```

### 部分的なモック

```ts
vi.mock("../utils/api", async () => {
  const actual = await vi.importActual("../utils/api");
  return {
    ...actual,
    fetchUser: vi.fn().mockResolvedValue({ id: 1 }),
  };
});
```

### タイマーのモック

```ts
it("タイマーテスト", () => {
  vi.useFakeTimers();
  
  const callback = vi.fn();
  setTimeout(callback, 1000);
  
  // まだ呼ばれていない
  expect(callback).not.toHaveBeenCalled();
  
  // 時間を進める
  vi.advanceTimersByTime(1000);
  
  // 呼ばれた
  expect(callback).toHaveBeenCalled();
  
  vi.useRealTimers();
});
```

---

## 7. カスタムMatcher

```ts
// test/setup.ts
import { expect } from "vitest";

expect.extend({
  toBeWithinRange(received: number, floor: number, ceiling: number) {
    const pass = received >= floor && received <= ceiling;
    return {
      pass,
      message: () =>
        pass
          ? `expected ${received} not to be within range ${floor} - ${ceiling}`
          : `expected ${received} to be within range ${floor} - ${ceiling}`,
    };
  },
});

// 型定義
declare module "vitest" {
  interface Assertion<T = any> {
    toBeWithinRange(floor: number, ceiling: number): T;
  }
}
```

```ts
// 使用
expect(5).toBeWithinRange(1, 10);
```

---

## 8. 実践演習

### 演習1: 純粋関数のテスト

以下の関数のテストを書いてください:

```ts
// utils/calculator.ts
export function add(a: number, b: number): number {
  return a + b;
}

export function divide(a: number, b: number): number {
  if (b === 0) throw new Error("0で割ることはできません");
  return a / b;
}

export function calculateTotal(items: { price: number; quantity: number }[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}
```

### 演習2: バリデーション関数のテスト

```ts
// utils/validation.ts
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidPassword(password: string): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  if (password.length < 8) errors.push("8文字以上");
  if (!/[A-Z]/.test(password)) errors.push("大文字を含む");
  if (!/[a-z]/.test(password)) errors.push("小文字を含む");
  if (!/[0-9]/.test(password)) errors.push("数字を含む");
  
  return { valid: errors.length === 0, errors };
}
```

### 演習3: カスタムフックのテスト

```ts
// hooks/useCounter.ts
import { useState } from "react";

export function useCounter(initialValue = 0) {
  const [count, setCount] = useState(initialValue);
  
  const increment = () => setCount((c) => c + 1);
  const decrement = () => setCount((c) => c - 1);
  const reset = () => setCount(initialValue);
  const set = (value: number) => setCount(value);
  
  return { count, increment, decrement, reset, set };
}
```

### 回答例

```ts
// tests/useCounter.test.ts
import { renderHook, act } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { useCounter } from "../hooks/useCounter";

describe("useCounter", () => {
  it("初期値が0", () => {
    const { result } = renderHook(() => useCounter());
    expect(result.current.count).toBe(0);
  });
  
  it("初期値を設定できる", () => {
    const { result } = renderHook(() => useCounter(10));
    expect(result.current.count).toBe(10);
  });
  
  it("incrementで増加", () => {
    const { result } = renderHook(() => useCounter());
    
    act(() => {
      result.current.increment();
    });
    
    expect(result.current.count).toBe(1);
  });
  
  it("decrementで減少", () => {
    const { result } = renderHook(() => useCounter(5));
    
    act(() => {
      result.current.decrement();
    });
    
    expect(result.current.count).toBe(4);
  });
  
  it("resetで初期値に戻る", () => {
    const { result } = renderHook(() => useCounter(10));
    
    act(() => {
      result.current.increment();
      result.current.reset();
    });
    
    expect(result.current.count).toBe(10);
  });
});
```

---

## まとめ

### このセッションで学んだこと

| 概念 | 説明 |
|------|------|
| テストピラミッド | 単体 > 統合 > E2E |
| AAAパターン | Arrange-Act-Assert |
| Vitest | 高速なテストランナー |
| Matcher | `toBe`, `toEqual`, `toContain`など |
| 非同期テスト | `async/await`, `resolves/rejects` |
| ライフサイクル | `beforeEach`, `afterAll`など |
| モック | `vi.fn()`, `vi.mock()` |
| カスタムフックテスト | `renderHook` + `act` |

### 次のセッション

Session 2では、**React Testing Library**を使ったコンポーネントテストを学びます。
