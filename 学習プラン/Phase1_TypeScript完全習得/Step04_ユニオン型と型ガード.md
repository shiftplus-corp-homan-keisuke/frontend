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

### Section 1: ユニオン型の基礎と活用

#### 🔍 ユニオン型の実践的価値

**💡 なぜユニオン型が重要なのか**

ユニオン型は、JavaScript の動的型付けの柔軟性を保ちながら、TypeScript の型安全性を実現する重要な機能です。実際の開発では、API レスポンスの処理、ユーザー入力の検証、状態管理など、様々な場面で「複数の可能性がある値」を安全に扱う必要があります。ユニオン型により、ランタイムエラーを予防し、堅牢なアプリケーションを構築できます。

**🎯 どういう場面で使うのか**

- **API レスポンス処理**: サーバーから返される可能性のある複数の形式のデータ
- **ユーザー入力検証**: フォームで入力される様々な型の値
- **状態管理**: アプリケーションの複数の状態を型安全に表現
- **設定値管理**: 環境や条件によって変わる設定値の安全な管理
- **エラーハンドリング**: 成功・失敗の両方のケースを型安全に処理

##### 1. 基本的なユニオン型

```typescript
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

**📝 実装の詳細解説**

- ユニオン型では、すべての型に共通するプロパティ・メソッドのみアクセス可能
- 型ガードを使用することで、特定の型のプロパティにアクセス可能
- リテラル型のユニオンにより、許可される値を制限し、タイポを防止

**⚠️ よくある間違いと注意点**

```typescript
// ❌ 間違い: 型ガードなしで特定の型のメソッドを使用
function badExample(value: string | number): string {
  return value.toUpperCase(); // Error: numberにはtoUpperCase()がない
}

// ✅ 正解: 型ガードを使用
function goodExample(value: string | number): string {
  if (typeof value === "string") {
    return value.toUpperCase(); // OK: この分岐内ではstring型
  }
  return value.toString(); // OK: number型
}
```

##### 2. リテラル型のユニオンによる設定値管理

```typescript
// 💡 詳細解説: リテラル型 → Step04_補足_専門用語集.md#リテラル型literal-types
type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";
type ResponseStatus = 200 | 201 | 400 | 401 | 404 | 500;

function makeRequest(method: HttpMethod, url: string): Promise<Response> {
  return fetch(url, { method });
}

// 実際のAPI設定での活用例
type Environment = "development" | "staging" | "production";
type LogLevel = "debug" | "info" | "warn" | "error";

interface ApiConfig {
  baseUrl: string;
  timeout: number;
  retries: number;
  logLevel: LogLevel;
}

function createApiConfig(env: Environment): ApiConfig {
  switch (env) {
    case "development":
      return {
        baseUrl: "http://localhost:3000",
        timeout: 10000,
        retries: 1,
        logLevel: "debug",
      };
    case "staging":
      return {
        baseUrl: "https://staging-api.example.com",
        timeout: 5000,
        retries: 2,
        logLevel: "info",
      };
    case "production":
      return {
        baseUrl: "https://api.example.com",
        timeout: 3000,
        retries: 3,
        logLevel: "error",
      };
  }
}
```

**🚀 実際のプロジェクトでの活用例**

```typescript
// React での状態管理での活用
type LoadingState = "idle" | "loading" | "success" | "error";

interface UserState {
  status: LoadingState;
  user: User | null;
  error: string | null;
}

// Vue.js での props 型定義での活用
type ButtonVariant = "primary" | "secondary" | "danger" | "success";
type ButtonSize = "small" | "medium" | "large";

interface ButtonProps {
  variant: ButtonVariant;
  size: ButtonSize;
  disabled?: boolean;
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

##### 6. Nullable 型の実践的な使用場面

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

// 実際のデータベース操作での活用
interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string | null; // データベースでNULL許可
  bio: string | undefined; // オプショナルフィールド
  lastLoginAt: Date | null; // 初回ログイン前はnull
}

function formatUserProfile(profile: UserProfile): string {
  const avatarText = profile.avatar ? `Avatar: ${profile.avatar}` : "No avatar";

  const bioText = profile.bio ? `Bio: ${profile.bio}` : "No bio provided";

  const lastLoginText = profile.lastLoginAt
    ? `Last login: ${profile.lastLoginAt.toISOString()}`
    : "Never logged in";

  return `${profile.name} (${profile.email}) - ${avatarText}, ${bioText}, ${lastLoginText}`;
}
```

#### 🎯 インターセクション型の設計パターン

**💡 なぜインターセクション型が重要なのか**

インターセクション型は、複数の型を組み合わせて新しい型を作成する強力な機能です。Mixin パターンの実現、API 設計での型合成、再利用可能なコンポーネント設計において、コードの重複を避けながら型安全性を保つことができます。

**🎯 どういう場面で使うのか**

- **Mixin パターン**: 複数の機能を組み合わせたオブジェクトの作成
- **API 設計**: 基本型に追加情報を付与したレスポンス型の作成
- **コンポーネント設計**: 基本プロパティに特定の機能を追加
- **データベースモデル**: エンティティにタイムスタンプやメタデータを追加

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

// 実際の使用例
function createUser(userData: Omit<User, "id">): UserWithTimestamps {
  const now = new Date();
  return {
    id: Math.floor(Math.random() * 1000),
    ...userData,
    createdAt: now,
    updatedAt: now,
  };
}
```

##### 2. Mixin パターンの実際の使用場面

```typescript
type Serializable = {
  serialize(): string;
  deserialize(data: string): void;
};

type Cacheable = {
  cache(): void;
  invalidateCache(): void;
  getCacheKey(): string;
};

type Auditable = {
  getAuditLog(): AuditEntry[];
  addAuditEntry(action: string, userId: string): void;
};

// 実際のライブラリ設計での活用
type Entity = User & Serializable & Cacheable & Auditable;

class UserEntity implements Entity {
  constructor(
    public id: number,
    public name: string,
    public email: string,
    private auditLog: AuditEntry[] = []
  ) {}

  serialize(): string {
    return JSON.stringify({
      id: this.id,
      name: this.name,
      email: this.email,
    });
  }

  deserialize(data: string): void {
    const parsed = JSON.parse(data);
    this.id = parsed.id;
    this.name = parsed.name;
    this.email = parsed.email;
  }

  cache(): void {
    localStorage.setItem(this.getCacheKey(), this.serialize());
  }

  invalidateCache(): void {
    localStorage.removeItem(this.getCacheKey());
  }

  getCacheKey(): string {
    return `user:${this.id}`;
  }

  getAuditLog(): AuditEntry[] {
    return [...this.auditLog];
  }

  addAuditEntry(action: string, userId: string): void {
    this.auditLog.push({
      action,
      userId,
      timestamp: new Date(),
    });
  }
}

interface AuditEntry {
  action: string;
  userId: string;
  timestamp: Date;
}
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

### Section 2: 型ガードの実装パターン

#### 🔧 基本的な型ガードの実践活用

**💡 なぜ型ガードが重要なのか**

型ガードは、ランタイムでの型チェックを通じて、TypeScript の型システムに実際の値の型を「教える」仕組みです。これにより、`unknown` 型や ユニオン型の値を安全に扱い、実行時エラーを予防できます。特に、外部 API からのデータ、ユーザー入力、DOM 操作において、型ガードは堅牢なアプリケーション構築の要となります。

**🎯 どういう場面で使うのか**

- **外部 API データ検証**: サーバーから受け取ったデータの型確認
- **ユーザー入力検証**: フォーム入力値の型・形式チェック
- **DOM 操作**: HTML 要素の型確認と安全なアクセス
- **ファイル処理**: アップロードされたファイルの形式確認
- **設定値検証**: 環境変数や設定ファイルの値の検証

##### 1. typeof 型ガードによるランタイムエラー予防

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

// 実際のユーザー入力検証での活用
function validateFormInput(input: unknown): string | null {
  if (typeof input !== "string") {
    return "入力値は文字列である必要があります";
  }

  if (input.trim().length === 0) {
    return "入力値は空にできません";
  }

  if (input.length > 100) {
    return "入力値は100文字以内にしてください";
  }

  return null; // バリデーション成功
}
```

**📝 実装の詳細解説**

- `typeof` 演算子は JavaScript のランタイム型チェック
- TypeScript は型ガードの結果を理解し、分岐内で型を絞り込む
- プリミティブ型（string, number, boolean, undefined）の判定に最適

##### 2. instanceof 型ガードによる DOM 操作の安全性確保

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

// DOM操作での型安全性確保の重要性
function setupFormValidation(formId: string): void {
  const element = document.getElementById(formId);

  if (!(element instanceof HTMLFormElement)) {
    throw new Error(`Element with id "${formId}" is not a form`);
  }

  // この時点でelementはHTMLFormElement型として扱われる
  element.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(element);
    // 安全にフォームデータを処理
    processFormData(formData);
  });
}

function getInputValue(inputId: string): string | null {
  const element = document.getElementById(inputId);

  if (element instanceof HTMLInputElement) {
    return element.value;
  } else if (element instanceof HTMLTextAreaElement) {
    return element.value;
  } else if (element instanceof HTMLSelectElement) {
    return element.value;
  }

  return null; // 対応していない要素型
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

#### 🎯 判別可能なユニオンの状態管理での実践活用

**💡 なぜ判別可能なユニオンが重要なのか**

判別可能なユニオン（Discriminated Union）は、共通のプロパティ（判別子）を持つユニオン型で、TypeScript が各分岐で正確な型を推論できる仕組みです。状態管理、エラーハンドリング、API レスポンス処理において、型安全性を保ちながら複雑なロジックを実装できます。特に非同期処理の状態表現や、React/Vue.js での状態管理において威力を発揮します。

**🎯 どういう場面で使うのか**

- **状態管理ライブラリ**: Redux、Zustand での action や state の型安全な管理
- **非同期処理の状態表現**: loading、success、error の状態を型安全に表現
- **API レスポンス処理**: 成功・失敗レスポンスの型安全な処理
- **複雑なビジネスロジック**: 複数の条件分岐を型安全に実装
- **React/Vue.js での状態管理**: コンポーネントの状態を型安全に管理

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

### Section 3: 型アサーションと高度なパターン

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

##### 4. 非 null アサーション演算子（!）

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
