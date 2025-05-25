# Step 4: ユニオン型と型ガード

> 💡 **補足資料**: 詳細な解説は以下の補足資料を見てね 🐰
>
> - 📖 [専門用語集](./Step04_補足_専門用語集.md) - ユニオン型・型ガード・エラーハンドリングの重要な概念と用語の詳細解説
> - 💻 [実践コード例](./Step04_補足_実践コード例.md) - 段階的な学習用コード集
> - 🚨 [トラブルシューティング](./Step04_補足_トラブルシューティング.md) - よくあるエラーと解決方法
> - 📚 [参考リソース](./Step04_補足_参考リソース.md) - 学習に役立つリンク集

## 📅 学習期間・目標

**期間**: Step 4  
**総学習時間**: 3 時間  
**学習スタイル**: 理論 20% + 実践コード 50% + 演習 30%

### 🎯 Step 4 到達目標

- [ ] ユニオン型とインターセクション型の完全理解
- [ ] 型ガードの実装パターンの習得
- [ ] 型アサーションの適切な使用方法
- [ ] 判別可能なユニオンの実践的活用
- [ ] 型安全なエラーハンドリングの実装

## 📚 理論学習内容

### Day 1-2: ユニオン型の基礎と活用

#### 🔍 ユニオン型の基本概念と他言語との比較

##### 1. 基本的なユニオン型

```typescript
// Java: Object (型安全性なし), Kotlin: sealed class
// C#: object (型安全性なし), F#: discriminated union
// Rust: enum, Go: interface{}
// TypeScript: 型安全なユニオン型
// 💡 詳細解説: ユニオン型 → Step04_補足_専門用語集.md#ユニオン型union-types

type StringOrNumber = string | number;
type Status = "loading" | "success" | "error";
type Theme = "light" | "dark" | "auto";

function processValue(value: StringOrNumber): string {
  // TypeScriptは共通のプロパティのみアクセス可能
  return value.toString(); // OK: toString()は両方の型に存在
  // return value.toUpperCase(); // Error: numberにはtoUpperCase()がない
}
```

##### 2. リテラル型のユニオン

```typescript
// 💡 詳細解説: リテラル型 → Step04_補足_専門用語集.md#リテラル型literal-types
type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";
type ResponseStatus = 200 | 201 | 400 | 401 | 404 | 500;

function makeRequest(method: HttpMethod, url: string): Promise<Response> {
  return fetch(url, { method });
}
```

##### 3. オブジェクト型のユニオン

```typescript
type Circle = {
  kind: "circle";
  radius: number;
};

type Rectangle = {
  kind: "rectangle";
  width: number;
  height: number;
};

type Triangle = {
  kind: "triangle";
  base: number;
  height: number;
};

type Shape = Circle | Rectangle | Triangle;
```

##### 4. 関数型のユニオン

```typescript
type EventHandler =
  | ((event: MouseEvent) => void)
  | ((event: KeyboardEvent) => void)
  | ((event: TouchEvent) => void);
```

##### 5. 配列とユニオン型

```typescript
type MixedArray = (string | number | boolean)[];
type NumberOrStringArray = number[] | string[];
```

##### 6. null/undefinedとのユニオン（Nullable型）

```typescript
type NullableString = string | null;
type OptionalString = string | undefined;
type MaybeString = string | null | undefined;

function processNullableString(value: NullableString): string {
  if (value === null) {
    return "null value";
  }
  return value.toUpperCase(); // nullチェック後は安全にアクセス可能
}
```

#### 🎯 インターセクション型の活用

##### 1. 基本的なインターセクション型

```typescript
// 💡 詳細解説: インターセクション型 → Step04_補足_専門用語集.md#インターセクション型intersection-types
type User = {
  id: number;
  name: string;
  email: string;
};

type Timestamps = {
  createdAt: Date;
  updatedAt: Date;
};

type UserWithTimestamps = User & Timestamps;
// 結果: { id: number; name: string; email: string; createdAt: Date; updatedAt: Date; }
```

##### 2. Mixin パターン

```typescript
type Serializable = {
  serialize(): string;
  deserialize(data: string): void;
};

type Cacheable = {
  cache(): void;
  invalidateCache(): void;
};

type Entity = User & Serializable & Cacheable;
```

##### 3. 関数型のインターセクション

```typescript
type Logger = {
  log(message: string): void;
};

type ErrorHandler = {
  handleError(error: Error): void;
};

type Service = Logger &
  ErrorHandler & {
    process(data: unknown): Promise<unknown>;
  };
```

##### 4. 条件付きインターセクション

```typescript
type WithOptionalId<T> = T & { id?: number };
type WithRequiredId<T> = T & { id: number };

type CreateUserRequest = WithOptionalId<User>;
type UpdateUserRequest = WithRequiredId<Partial<User>>;
```

##### 5. 型の合成

```typescript
type ApiResponse<T> = {
  data: T;
  status: number;
  message: string;
};

type PaginationInfo = {
  page: number;
  limit: number;
  total: number;
  hasNext: boolean;
  hasPrev: boolean;
};

type PaginatedResponse<T> = ApiResponse<T[]> & {
  pagination: PaginationInfo;
};
```

### Day 3-4: 型ガードの実装パターン

#### 🔧 基本的な型ガード

##### 1. typeof 型ガード

```typescript
function processStringOrNumber(value: string | number): string {
  if (typeof value === "string") {
    // この分岐内ではvalueはstring型
    return value.toUpperCase();
  } else {
    // この分岐内ではvalueはnumber型
    return value.toFixed(2);
  }
}
```

##### 2. instanceof 型ガード

```typescript
class Dog {
  bark(): void {
    console.log("Woof!");
  }
}

class Cat {
  meow(): void {
    console.log("Meow!");
  }
}

function makeSound(animal: Dog | Cat): void {
  if (animal instanceof Dog) {
    animal.bark(); // Dogのメソッドにアクセス可能
  } else {
    animal.meow(); // Catのメソッドにアクセス可能
  }
}
```

##### 3. in 演算子による型ガード

```typescript
type Fish = {
  swim(): void;
  fins: number;
};

type Bird = {
  fly(): void;
  wings: number;
};

function move(animal: Fish | Bird): void {
  if ("swim" in animal) {
    animal.swim(); // Fishのメソッド
    console.log(`Fish has ${animal.fins} fins`);
  } else {
    animal.fly(); // Birdのメソッド
    console.log(`Bird has ${animal.wings} wings`);
  }
}
```

##### 4. カスタム型ガード関数

```typescript
function isString(value: unknown): value is string {
  return typeof value === "string";
}

function isNumber(value: unknown): value is number {
  return typeof value === "number" && !isNaN(value);
}

function isArray<T>(value: unknown): value is T[] {
  return Array.isArray(value);
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

// 使用例
function processUnknownValue(value: unknown): string {
  if (isString(value)) {
    return value.toUpperCase();
  } else if (isNumber(value)) {
    return value.toString();
  } else if (isArray(value)) {
    return `Array with ${value.length} items`;
  } else if (isObject(value)) {
    return `Object with keys: ${Object.keys(value).join(", ")}`;
  } else {
    return "Unknown type";
  }
}
```

##### 5. 複雑な型ガード

```typescript
interface User {
  id: number;
  name: string;
  email: string;
}

function isUser(value: unknown): value is User {
  return (
    isObject(value) &&
    typeof value.id === "number" &&
    typeof value.name === "string" &&
    typeof value.email === "string"
  );
}

function isUserArray(value: unknown): value is User[] {
  return isArray(value) && value.every(isUser);
}
```

##### 6. 非同期型ガード

```typescript
async function isValidUser(value: unknown): Promise<value is User> {
  if (!isUser(value)) {
    return false;
  }

  // 追加のバリデーション（例：メールアドレスの形式チェック）
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value.email);
}
```

#### 🎯 判別可能なユニオン（Discriminated Union）

##### 1. 基本的な判別可能なユニオン

```typescript
interface LoadingState {
  status: "loading";
  progress?: number;
}

interface SuccessState {
  status: "success";
  data: unknown;
  timestamp: Date;
}

interface ErrorState {
  status: "error";
  error: string;
  code?: number;
}

type AsyncState = LoadingState | SuccessState | ErrorState;

function handleAsyncState(state: AsyncState): string {
  switch (state.status) {
    case "loading":
      return `Loading... ${state.progress || 0}%`;

    case "success":
      return `Success: ${JSON.stringify(state.data)}`;

    case "error":
      return `Error ${state.code || "Unknown"}: ${state.error}`;

    default:
      // 網羅性チェック
      const _exhaustive: never = state;
      return "Unknown state";
  }
}
```

##### 2. 複雑な判別可能なユニオン

```typescript
type PaymentMethod =
  | {
      type: "credit_card";
      cardNumber: string;
      expiryDate: string;
      cvv: string;
    }
  | {
      type: "paypal";
      email: string;
    }
  | {
      type: "bank_transfer";
      accountNumber: string;
      routingNumber: string;
    }
  | {
      type: "crypto";
      walletAddress: string;
      currency: "BTC" | "ETH" | "USDC";
    };

function processPayment(method: PaymentMethod, amount: number): string {
  switch (method.type) {
    case "credit_card":
      return `Processing $${amount} via credit card ending in ${method.cardNumber.slice(
        -4
      )}`;

    case "paypal":
      return `Processing $${amount} via PayPal account ${method.email}`;

    case "bank_transfer":
      return `Processing $${amount} via bank transfer to ${method.accountNumber}`;

    case "crypto":
      return `Processing $${amount} in ${method.currency} to ${method.walletAddress}`;

    default:
      const _exhaustive: never = method;
      throw new Error("Unknown payment method");
  }
}
```

##### 3. ネストした判別可能なユニオン

```typescript
type ApiResult<T> =
  | {
      success: true;
      data: T;
      meta: {
        timestamp: Date;
        requestId: string;
      };
    }
  | {
      success: false;
      error: {
        type: "validation" | "network" | "server" | "auth";
        message: string;
        details?: Record<string, unknown>;
      };
    };

function handleApiResult<T>(result: ApiResult<T>): T | null {
  if (result.success) {
    console.log(
      `Request ${result.meta.requestId} succeeded at ${result.meta.timestamp}`
    );
    return result.data;
  } else {
    console.error(`${result.error.type} error: ${result.error.message}`);
    if (result.error.details) {
      console.error("Details:", result.error.details);
    }
    return null;
  }
}
```

### Day 5-7: 型アサーションと高度なパターン

#### 🔧 型アサーションの適切な使用

##### 1. 基本的な型アサーション

```typescript
// 注意: 型アサーションは型安全性を損なう可能性があるため慎重に使用

// DOM要素の型アサーション
const button = document.getElementById("submit-button") as HTMLButtonElement;
const input = document.querySelector('input[type="email"]') as HTMLInputElement;

// より安全なアプローチ
function getButtonElement(id: string): HTMLButtonElement | null {
  const element = document.getElementById(id);
  if (element instanceof HTMLButtonElement) {
    return element;
  }
  return null;
}
```

##### 2. unknown からの型アサーション

```typescript
function parseJsonSafely<T>(json: string): T | null {
  try {
    const parsed = JSON.parse(json) as T;
    return parsed;
  } catch {
    return null;
  }
}

// より安全なアプローチ（型ガードと組み合わせ）
function parseUserJson(json: string): User | null {
  try {
    const parsed = JSON.parse(json);
    if (isUser(parsed)) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}
```

##### 3. const アサーション

```typescript
const colors = ["red", "green", "blue"] as const;
// type: readonly ["red", "green", "blue"]

const config = {
  apiUrl: "https://api.example.com",
  timeout: 5000,
  retries: 3,
} as const;
// プロパティがreadonlyになる
```

##### 4. 非null アサーション演算子（!）

```typescript
function processUser(userId: string): void {
  const user = users.find((u) => u.id === userId);
  // userが確実に存在することが分かっている場合のみ使用
  console.log(user!.name);

  // より安全なアプローチ
  if (user) {
    console.log(user.name);
  }
}
```

##### 5. 型アサーション関数

```typescript
function assertIsNumber(value: unknown): asserts value is number {
  if (typeof value !== "number") {
    throw new Error("Expected number");
  }
}

function assertIsUser(value: unknown): asserts value is User {
  if (!isUser(value)) {
    throw new Error("Expected User object");
  }
}

// 使用例
function processValue(value: unknown): void {
  assertIsNumber(value);
  // この時点でvalueはnumber型として扱われる
  console.log(value.toFixed(2));
}
```

## 🎯 実践演習

### 演習 4-1: 型ガード実装マスター 🔰

```typescript
// 以下の要件を満たす型ガード関数を実装せよ

// 1. 基本的な型ガード
// 要件: 様々な型を判定する型ガード関数群

// 解答例
function isStringArray(value: unknown): value is string[] {
  return (
    Array.isArray(value) && value.every((item) => typeof item === "string")
  );
}

function isNumberArray(value: unknown): value is number[] {
  return (
    Array.isArray(value) && value.every((item) => typeof item === "number")
  );
}

function isEmail(value: unknown): value is string {
  if (typeof value !== "string") return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value);
}

function isUrl(value: unknown): value is string {
  if (typeof value !== "string") return false;
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

function isDateString(value: unknown): value is string {
  if (typeof value !== "string") return false;
  return !isNaN(Date.parse(value));
}

// 2. 複雑なオブジェクトの型ガード
interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  inStock: boolean;
}

function isProduct(value: unknown): value is Product {
  return (
    isObject(value) &&
    typeof value.id === "string" &&
    typeof value.name === "string" &&
    typeof value.price === "number" &&
    typeof value.category === "string" &&
    typeof value.inStock === "boolean"
  );
}

function isProductArray(value: unknown): value is Product[] {
  return Array.isArray(value) && value.every(isProduct);
}

// 3. 使用例
function processApiResponse(response: unknown): Product[] {
  if (isProductArray(response)) {
    return response.filter((product) => product.inStock);
  }

  if (isProduct(response)) {
    return response.inStock ? [response] : [];
  }

  throw new Error("Invalid API response format");
}
```

### 演習 4-2: 状態管理システム 🔶

```typescript
// 型安全な状態管理システムを実装せよ
// 要件:
// 1. 複数の状態タイプ（loading, success, error）
// 2. 型安全な状態遷移
// 3. 状態に応じた適切な処理

// 解答例
type RequestState<T> =
  | { status: "idle" }
  | { status: "loading"; progress?: number }
  | { status: "success"; data: T; timestamp: Date }
  | { status: "error"; error: string; retryCount: number };

class StateManager<T> {
  private state: RequestState<T> = { status: "idle" };
  private listeners: Array<(state: RequestState<T>) => void> = [];

  getState(): RequestState<T> {
    return this.state;
  }

  setState(newState: RequestState<T>): void {
    this.state = newState;
    this.notifyListeners();
  }

  subscribe(listener: (state: RequestState<T>) => void): () => void {
    this.listeners.push(listener);
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach((listener) => listener(this.state));
  }

  // 状態遷移メソッド
  startLoading(progress?: number): void {
    this.setState({ status: "loading", progress });
  }

  setSuccess(data: T): void {
    this.setState({
      status: "success",
      data,
      timestamp: new Date(),
    });
  }

  setError(error: string): void {
    const currentRetryCount =
      this.state.status === "error" ? this.state.retryCount + 1 : 0;

    this.setState({
      status: "error",
      error,
      retryCount: currentRetryCount,
    });
  }

  reset(): void {
    this.setState({ status: "idle" });
  }

  // 状態に基づく処理
  isLoading(): boolean {
    return this.state.status === "loading";
  }

  hasData(): boolean {
    return this.state.status === "success";
  }

  hasError(): boolean {
    return this.state.status === "error";
  }

  getData(): T | null {
    return this.state.status === "success" ? this.state.data : null;
  }

  getError(): string | null {
    return this.state.status === "error" ? this.state.error : null;
  }

  canRetry(): boolean {
    return this.state.status === "error" && this.state.retryCount < 3;
  }
}

// 使用例
interface User {
  id: string;
  name: string;
  email: string;
}

const userManager = new StateManager<User>();

// 状態変更の監視
const unsubscribe = userManager.subscribe((state) => {
  switch (state.status) {
    case "idle":
      console.log("Ready to load user");
      break;

    case "loading":
      console.log(`Loading user... ${state.progress || 0}%`);
      break;

    case "success":
      console.log(`User loaded: ${state.data.name} at ${state.timestamp}`);
      break;

    case "error":
      console.log(
        `Error loading user: ${state.error} (retry ${state.retryCount})`
      );
      break;
  }
});

// 非同期データ取得
async function fetchUser(id: string): Promise<void> {
  userManager.startLoading();

  try {
    userManager.startLoading(50);
    const response = await fetch(`/api/users/${id}`);
    userManager.startLoading(100);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const userData = await response.json();

    if (isUser(userData)) {
      userManager.setSuccess(userData);
    } else {
      throw new Error("Invalid user data format");
    }
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    userManager.setError(errorMessage);
  }
}
```

### 演習 4-3: 型安全なイベントシステム 🔥

```typescript
// 型安全なイベントエミッター/リスナーシステムを実装せよ
// 要件:
// 1. 型安全なイベント定義
// 2. 型安全なリスナー登録
// 3. 型安全なイベント発火

// 解答例
type EventMap = {
  [eventName: string]: unknown[];
};

type EventListener<T extends unknown[]> = (...args: T) => void;

class TypeSafeEventEmitter<TEventMap extends EventMap> {
  private listeners: {
    [K in keyof TEventMap]?: EventListener<TEventMap[K]>[];
  } = {};

  on<K extends keyof TEventMap>(
    event: K,
    listener: EventListener<TEventMap[K]>
  ): () => void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }

    this.listeners[event]!.push(listener);

    // unsubscribe function
    return () => {
      const listeners = this.listeners[event];
      if (listeners) {
        const index = listeners.indexOf(listener);
        if (index > -1) {
          listeners.splice(index, 1);
        }
      }
    };
  }

  once<K extends keyof TEventMap>(
    event: K,
    listener: EventListener<TEventMap[K]>
  ): void {
    const unsubscribe = this.on(event, (...args) => {
      unsubscribe();
      listener(...args);
    });
  }

  emit<K extends keyof TEventMap>(event: K, ...args: TEventMap[K]): void {
    const listeners = this.listeners[event];
    if (listeners) {
      listeners.forEach((listener) => listener(...args));
    }
  }

  off<K extends keyof TEventMap>(
    event: K,
    listener?: EventListener<TEventMap[K]>
  ): void {
    if (!listener) {
      delete this.listeners[event];
      return;
    }

    const listeners = this.listeners[event];
    if (listeners) {
      const index = listeners.indexOf(listener);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  removeAllListeners(): void {
    this.listeners = {};
  }

  listenerCount<K extends keyof TEventMap>(event: K): number {
    return this.listeners[event]?.length || 0;
  }
}

// 使用例
interface AppEvents {
  "user:login": [user: User];
  "user:logout": [];
  "data:update": [data: unknown, timestamp: Date];
  error: [error: Error, context?: string];
  notification: [message: string, type: "info" | "warning" | "error"];
}

const eventEmitter = new TypeSafeEventEmitter<AppEvents>();

// 型安全なリスナー登録
const unsubscribeLogin = eventEmitter.on("user:login", (user) => {
  console.log(`User ${user.name} logged in`);
});

eventEmitter.on("user:logout", () => {
  console.log("User logged out");
});

eventEmitter.on("data:update", (data, timestamp) => {
  console.log(`Data updated at ${timestamp}:`, data);
});

eventEmitter.on("error", (error, context) => {
  console.error(`Error in ${context || "unknown context"}:`, error.message);
});

eventEmitter.on("notification", (message, type) => {
  console.log(`[${type.toUpperCase()}] ${message}`);
});

// 型安全なイベント発火
eventEmitter.emit("user:login", {
  id: "1",
  name: "Alice",
  email: "alice@example.com",
});
eventEmitter.emit("user:logout");
eventEmitter.emit("data:update", { products: [] }, new Date());
eventEmitter.emit("error", new Error("Something went wrong"), "user-service");
eventEmitter.emit("notification", "Welcome to the app!", "info");

// 型エラーの例（コンパイル時にキャッチされる）
// eventEmitter.emit("user:login"); // Error: 引数が不足
// eventEmitter.emit("user:login", "invalid"); // Error: 型が一致しない
// eventEmitter.emit("invalid:event", "data"); // Error: 存在しないイベント
```

## 📊 Step 4 評価基準

### 理解度チェックリスト

#### ユニオン型・インターセクション型 (30%)

- [ ] ユニオン型の基本概念を理解している
- [ ] インターセクション型を適切に活用できる
- [ ] 複雑な型の組み合わせを実装できる
- [ ] 型の互換性を理解している

#### 型ガード (30%)

- [ ] 基本的な型ガードを実装できる
- [ ] カスタム型ガード関数を作成できる
- [ ] 複雑なオブジェクトの型ガードを実装できる
- [ ] 型ガードを活用した安全なコードを書ける

#### 判別可能なユニオン (25%)

- [ ] 判別可能なユニオンの概念を理解している
- [ ] 適切な判別プロパティを設計できる
- [ ] 網羅性チェックを実装できる
- [ ] 実用的な状態管理を実装できる

#### 型アサーション (15%)

- [ ] 型アサーションの適切な使用場面を理解している
- [ ] 型アサーション関数を実装できる
- [ ] 型安全性を保ちながら柔軟性を確保できる
- [ ] DOM 操作での型アサーションを適切に使用できる

### 成果物チェックリスト

- [ ] **型ガード関数集**: 再利用可能な型ガード関数群
- [ ] **状態管理システム**: 型安全な状態管理の実装
- [ ] **イベントシステム**: 型安全なイベントエミッター
- [ ] **API レスポンス処理**: 型安全なデータ処理システム

## 🔄 Step 5 への準備

### 次週学習内容の予習

```typescript
// Step 5で学習するジェネリクスの基礎概念
// 以下のコードを読んで理解しておくこと

// 1. 基本的なジェネリクス
function identity<T>(arg: T): T {
  return arg;
}

// 2. ジェネリック制約
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

// 3. ジェネリッククラス
class Container<T> {
  constructor(private value: T) {}

  getValue(): T {
    return this.value;
  }
}

// 4. 条件付きジェネリクス
type ApiResponse<T> = T extends string ? { message: T } : { data: T };
```

### 環境準備

- [ ] 型パズル練習サイトの準備
- [ ] TypeScript Playground での実験継続
- [ ] 実践プロジェクトでの型ガード活用
- [ ] エラーハンドリングパターンの整理

### 学習継続のコツ

1. **実践重視**: 実際のプロジェクトで型ガードを活用
2. **パターン学習**: 判別可能なユニオンの設計パターン習得
3. **安全性重視**: 型アサーションより型ガードを優先
4. **段階的理解**: 複雑な型から基本要素に分解して理解

---

**📌 重要**: Step 4 は TypeScript の型システムの柔軟性と安全性を両立させる重要な技術を学習します。ユニオン型と型ガードにより、実用的で堅牢なアプリケーションが構築できるようになります。

**🌟 次週は、ジェネリクスを使った再利用可能で型安全なコードの作成について学習します！**
