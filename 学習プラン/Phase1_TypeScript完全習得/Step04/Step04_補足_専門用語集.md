# Step04 専門用語集

> 💡 **このファイルについて**: Step04で出てくる重要な専門用語と概念の詳細解説集です。

## 📋 目次
1. [ユニオン型関連用語](#ユニオン型関連用語)
2. [型ガード関連用語](#型ガード関連用語)
3. [型アサーション関連用語](#型アサーション関連用語)
4. [判別可能なユニオン関連用語](#判別可能なユニオン関連用語)
5. [エラーハンドリング関連用語](#エラーハンドリング関連用語)

---

## ユニオン型関連用語

### ユニオン型（Union Types）
**定義**: 複数の型のうちいずれかを表現する型

**他言語との比較**:
- **Java**: Object型（型安全性なし）、Kotlin: sealed class
- **C#**: object型（型安全性なし）、F#: discriminated union
- **Rust**: enum、Go: interface{}
- **TypeScript**: 型安全なユニオン型

**コード例**:
```typescript
// 基本的なユニオン型
type StringOrNumber = string | number;
type Status = "loading" | "success" | "error";

function processValue(value: StringOrNumber): string {
  // 共通のメソッドのみアクセス可能
  return value.toString(); // OK: 両方の型に存在
  // return value.toUpperCase(); // Error: numberには存在しない
}

// リテラル型のユニオン
type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";
type ResponseCode = 200 | 201 | 400 | 401 | 404 | 500;

// オブジェクト型のユニオン
type ApiResponse = 
  | { success: true; data: any }
  | { success: false; error: string };
```

**実用場面**: API レスポンス、状態管理、設定値、エラーハンドリング

### インターセクション型（Intersection Types）
**定義**: 複数の型を組み合わせて新しい型を作成

**ユニオン型との違い**:
- **ユニオン型**: A または B（どちらか一方）
- **インターセクション型**: A かつ B（両方の特徴を持つ）

**コード例**:
```typescript
// 基本的なインターセクション型
type Timestamped = {
  createdAt: Date;
  updatedAt: Date;
};

type Identifiable = {
  id: string;
};

type Entity = Timestamped & Identifiable;
// { id: string; createdAt: Date; updatedAt: Date; }

// より複雑な例
type User = {
  name: string;
  email: string;
};

type AdminPermissions = {
  permissions: string[];
  role: "admin" | "super-admin";
};

type AdminUser = User & AdminPermissions;

const admin: AdminUser = {
  name: "Admin",
  email: "admin@example.com",
  permissions: ["read", "write", "delete"],
  role: "admin"
};

// 関数型のインターセクション
type Logger = {
  log: (message: string) => void;
};

type ErrorHandler = {
  handleError: (error: Error) => void;
};

type Service = Logger & ErrorHandler;
```

**実用場面**: ミックスイン、機能の組み合わせ、型の合成

### リテラル型（Literal Types）
**定義**: 特定の値のみを許可する型

**コード例**:
```typescript
// 文字列リテラル型
type Direction = "north" | "south" | "east" | "west";
type Theme = "light" | "dark" | "auto";

// 数値リテラル型
type DiceRoll = 1 | 2 | 3 | 4 | 5 | 6;
type HttpStatus = 200 | 201 | 400 | 401 | 404 | 500;

// 真偽値リテラル型
type AlwaysTrue = true;
type AlwaysFalse = false;

// テンプレートリテラル型（TypeScript 4.1+）
type EventName<T extends string> = `on${Capitalize<T>}`;
type ClickEvent = EventName<"click">; // "onClick"
type HoverEvent = EventName<"hover">; // "onHover"

// 実用例
function setTheme(theme: Theme): void {
  document.body.className = theme;
}

setTheme("light"); // OK
setTheme("dark");  // OK
// setTheme("blue"); // Error: Argument of type '"blue"' is not assignable
```

**なぜ重要か**: 型安全性の向上、自動補完の改善、実行時エラーの防止

---

## 型ガード関連用語

### 型ガード（Type Guards）
**定義**: 実行時に型を絞り込むための仕組み

**種類**:
1. **typeof型ガード**: プリミティブ型の判定
2. **instanceof型ガード**: クラスインスタンスの判定
3. **in演算子型ガード**: プロパティの存在確認
4. **カスタム型ガード**: ユーザー定義の型判定関数

**コード例**:
```typescript
// 1. typeof型ガード
function processValue(value: string | number): string {
  if (typeof value === "string") {
    // この分岐内ではvalueはstring型
    return value.toUpperCase();
  } else {
    // この分岐内ではvalueはnumber型
    return value.toFixed(2);
  }
}

// 2. instanceof型ガード
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

// 3. in演算子型ガード
type Fish = { swim: () => void };
type Bird = { fly: () => void };

function move(animal: Fish | Bird): void {
  if ("swim" in animal) {
    animal.swim(); // Fishのメソッドにアクセス可能
  } else {
    animal.fly(); // Birdのメソッドにアクセス可能
  }
}

// 4. カスタム型ガード
function isString(value: unknown): value is string {
  return typeof value === "string";
}

function isNumber(value: unknown): value is number {
  return typeof value === "number";
}

function processUnknown(value: unknown): string {
  if (isString(value)) {
    return value.toUpperCase(); // string型として扱われる
  } else if (isNumber(value)) {
    return value.toString(); // number型として扱われる
  } else {
    return "Unknown type";
  }
}
```

**実用場面**: API レスポンスの処理、ユーザー入力の検証、条件分岐での型安全性確保

### 型述語（Type Predicates）
**定義**: カスタム型ガード関数の戻り値型

**構文**: `parameter is Type`

**コード例**:
```typescript
// 基本的な型述語
function isUser(obj: any): obj is User {
  return obj && typeof obj.name === "string" && typeof obj.email === "string";
}

// より複雑な型述語
interface Admin {
  name: string;
  permissions: string[];
  role: "admin";
}

interface RegularUser {
  name: string;
  email: string;
  role: "user";
}

type User = Admin | RegularUser;

function isAdmin(user: User): user is Admin {
  return user.role === "admin";
}

function processUser(user: User): void {
  if (isAdmin(user)) {
    // userはAdmin型として扱われる
    console.log(`Admin ${user.name} has permissions: ${user.permissions.join(", ")}`);
  } else {
    // userはRegularUser型として扱われる
    console.log(`User ${user.name} email: ${user.email}`);
  }
}

// 配列の型ガード
function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every(item => typeof item === "string");
}

function processArray(input: unknown): void {
  if (isStringArray(input)) {
    // inputはstring[]型として扱われる
    input.forEach(str => console.log(str.toUpperCase()));
  }
}
```

### 網羅性チェック（Exhaustiveness Checking）
**定義**: すべてのケースが処理されていることをコンパイル時に確認する仕組み

**コード例**:
```typescript
type Shape = 
  | { kind: "circle"; radius: number }
  | { kind: "rectangle"; width: number; height: number }
  | { kind: "triangle"; base: number; height: number };

function getArea(shape: Shape): number {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;
    case "rectangle":
      return shape.width * shape.height;
    case "triangle":
      return (shape.base * shape.height) / 2;
    default:
      // 網羅性チェック
      const _exhaustive: never = shape;
      throw new Error(`Unhandled shape: ${_exhaustive}`);
  }
}

// 新しい形状を追加した場合
type ExtendedShape = Shape | { kind: "square"; side: number };

function getExtendedArea(shape: ExtendedShape): number {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;
    case "rectangle":
      return shape.width * shape.height;
    case "triangle":
      return (shape.base * shape.height) / 2;
    // case "square": を追加しないとコンパイルエラー
    default:
      const _exhaustive: never = shape; // Error: Type 'square' is not assignable to type 'never'
      throw new Error(`Unhandled shape: ${_exhaustive}`);
  }
}
```

---

## 型アサーション関連用語

### 型アサーション（Type Assertion）
**定義**: 開発者がTypeScriptコンパイラに対して「この値は特定の型である」と明示的に伝える仕組み

**構文**: `value as Type` または `<Type>value`

**コード例**:
```typescript
// 基本的な型アサーション
const someValue: unknown = "Hello World";
const strLength: number = (someValue as string).length;

// DOM要素の型アサーション
const canvas = document.getElementById("myCanvas") as HTMLCanvasElement;
const context = canvas.getContext("2d");

// APIレスポンスの型アサーション
interface ApiResponse {
  data: any;
  status: number;
}

async function fetchData(): Promise<ApiResponse> {
  const response = await fetch("/api/data");
  const data = await response.json();
  
  // APIレスポンスの形状を保証
  return {
    data: data,
    status: response.status
  } as ApiResponse;
}

// より安全な型アサーション（型ガードと組み合わせ）
function isApiResponse(obj: any): obj is ApiResponse {
  return obj && typeof obj.data !== "undefined" && typeof obj.status === "number";
}

async function safeFetchData(): Promise<ApiResponse | null> {
  try {
    const response = await fetch("/api/data");
    const data = await response.json();
    const result = { data, status: response.status };
    
    if (isApiResponse(result)) {
      return result;
    } else {
      console.error("Invalid API response format");
      return null;
    }
  } catch (error) {
    console.error("Fetch error:", error);
    return null;
  }
}
```

**注意点**: 型アサーションは型安全性を損なう可能性があるため、慎重に使用する

### Non-null アサーション演算子（!）
**定義**: 値がnullまたはundefinedでないことを明示的に伝える演算子

**コード例**:
```typescript
// 基本的な使用例
function processUser(user: User | null): void {
  // userがnullでないことが確実な場合
  console.log(user!.name); // Non-null assertion
}

// DOM要素の取得
const button = document.getElementById("myButton")!; // HTMLElementとして扱われる
button.addEventListener("click", () => {
  console.log("Button clicked");
});

// 配列の要素アクセス
const numbers = [1, 2, 3, 4, 5];
const firstNumber = numbers[0]!; // number型（undefinedの可能性を除外）

// より安全な代替案
function safeProcessUser(user: User | null): void {
  if (user) {
    console.log(user.name); // 型ガードを使用
  }
}

const safeButton = document.getElementById("myButton");
if (safeButton) {
  safeButton.addEventListener("click", () => {
    console.log("Button clicked");
  });
}
```

**使用指針**: 確実にnullでないことが保証される場合のみ使用

---

## 判別可能なユニオン関連用語

### 判別可能なユニオン（Discriminated Unions）
**定義**: 共通のプロパティ（判別子）を持つユニオン型

**別名**: Tagged Union、Variant、Sum Type

**コード例**:
```typescript
// 基本的な判別可能なユニオン
type LoadingState = {
  status: "loading";
};

type SuccessState = {
  status: "success";
  data: any;
};

type ErrorState = {
  status: "error";
  error: string;
};

type AsyncState = LoadingState | SuccessState | ErrorState;

function handleAsyncState(state: AsyncState): void {
  switch (state.status) {
    case "loading":
      console.log("Loading...");
      break;
    case "success":
      console.log("Data:", state.data); // dataプロパティにアクセス可能
      break;
    case "error":
      console.log("Error:", state.error); // errorプロパティにアクセス可能
      break;
  }
}

// より複雑な例：イベントシステム
type ClickEvent = {
  type: "click";
  x: number;
  y: number;
  button: "left" | "right";
};

type KeyEvent = {
  type: "keydown" | "keyup";
  key: string;
  ctrlKey: boolean;
  shiftKey: boolean;
};

type ScrollEvent = {
  type: "scroll";
  scrollX: number;
  scrollY: number;
};

type UIEvent = ClickEvent | KeyEvent | ScrollEvent;

function handleUIEvent(event: UIEvent): void {
  switch (event.type) {
    case "click":
      console.log(`Clicked at (${event.x}, ${event.y}) with ${event.button} button`);
      break;
    case "keydown":
    case "keyup":
      console.log(`Key ${event.key} ${event.type}`);
      if (event.ctrlKey) console.log("Ctrl was pressed");
      break;
    case "scroll":
      console.log(`Scrolled to (${event.scrollX}, ${event.scrollY})`);
      break;
  }
}
```

**実用場面**: 状態管理、イベント処理、API レスポンス、エラーハンドリング

---

## エラーハンドリング関連用語

### Result型パターン
**定義**: 成功と失敗を型で表現するパターン（RustのResult型に影響を受けた）

**コード例**:
```typescript
// Result型の定義
type Result<T, E> = 
  | { success: true; data: T }
  | { success: false; error: E };

// 使用例
function divide(a: number, b: number): Result<number, string> {
  if (b === 0) {
    return { success: false, error: "Division by zero" };
  }
  return { success: true, data: a / b };
}

function processResult(result: Result<number, string>): void {
  if (result.success) {
    console.log("Result:", result.data);
  } else {
    console.error("Error:", result.error);
  }
}

// より汎用的なResult型
class ResultClass<T, E> {
  private constructor(
    private readonly _success: boolean,
    private readonly _data?: T,
    private readonly _error?: E
  ) {}

  static ok<T, E>(data: T): ResultClass<T, E> {
    return new ResultClass<T, E>(true, data);
  }

  static err<T, E>(error: E): ResultClass<T, E> {
    return new ResultClass<T, E>(false, undefined, error);
  }

  isOk(): this is ResultClass<T, never> {
    return this._success;
  }

  isErr(): this is ResultClass<never, E> {
    return !this._success;
  }

  unwrap(): T {
    if (!this._success) {
      throw new Error("Called unwrap on an error result");
    }
    return this._data!;
  }

  unwrapOr(defaultValue: T): T {
    return this._success ? this._data! : defaultValue;
  }

  map<U>(fn: (data: T) => U): ResultClass<U, E> {
    if (this._success) {
      return ResultClass.ok(fn(this._data!));
    } else {
      return ResultClass.err(this._error!);
    }
  }
}
```

### Option型パターン
**定義**: 値の存在・非存在を型で表現するパターン

**コード例**:
```typescript
// Option型の定義
type Option<T> = 
  | { some: true; value: T }
  | { some: false };

// ヘルパー関数
function Some<T>(value: T): Option<T> {
  return { some: true, value };
}

function None<T>(): Option<T> {
  return { some: false };
}

// 使用例
function findUser(id: number): Option<User> {
  const user = users.find(u => u.id === id);
  return user ? Some(user) : None();
}

function processOption<T>(option: Option<T>): void {
  if (option.some) {
    console.log("Value:", option.value);
  } else {
    console.log("No value");
  }
}

// より高度なOption型
class OptionClass<T> {
  private constructor(private readonly _value?: T) {}

  static some<T>(value: T): OptionClass<T> {
    return new OptionClass(value);
  }

  static none<T>(): OptionClass<T> {
    return new OptionClass<T>();
  }

  isSome(): boolean {
    return this._value !== undefined;
  }

  isNone(): boolean {
    return this._value === undefined;
  }

  unwrap(): T {
    if (this._value === undefined) {
      throw new Error("Called unwrap on None");
    }
    return this._value;
  }

  unwrapOr(defaultValue: T): T {
    return this._value !== undefined ? this._value : defaultValue;
  }

  map<U>(fn: (value: T) => U): OptionClass<U> {
    return this._value !== undefined 
      ? OptionClass.some(fn(this._value))
      : OptionClass.none<U>();
  }

  flatMap<U>(fn: (value: T) => OptionClass<U>): OptionClass<U> {
    return this._value !== undefined 
      ? fn(this._value)
      : OptionClass.none<U>();
  }
}
```

---

## 📚 参考リンク

- [TypeScript Handbook - Union Types](https://www.typescriptlang.org/docs/handbook/unions-and-intersections.html)
- [TypeScript Handbook - Type Guards](https://www.typescriptlang.org/docs/handbook/advanced-types.html#type-guards-and-differentiating-types)
- [TypeScript Handbook - Type Assertions](https://www.typescriptlang.org/docs/handbook/basic-types.html#type-assertions)
- [Rust Book - Enums](https://doc.rust-lang.org/book/ch06-00-enums.html)

---

**📌 重要**: これらの概念を理解することで、より柔軟で型安全なTypeScriptコードを書けるようになります。特に判別可能なユニオンと型ガードの組み合わせは、実際の開発で非常に有用です。