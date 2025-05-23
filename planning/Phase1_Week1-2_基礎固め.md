# Phase 1: Week 1-2 基礎固め - TypeScript 型システム完全理解

## 📅 学習期間・目標

**期間**: Week 1-2（2 週間）  
**総学習時間**: 40 時間（週 20 時間）

### 🎯 Week 1-2 到達目標

- [ ] TypeScript 型エラーの完全理解と迅速な解決
- [ ] `this`キーワードの全パターン習得
- [ ] Enum とその代替手法の適切な使い分け
- [ ] 型安全なコード設計の基礎確立
- [ ] 既存 Angular 経験の型安全性向上

## 📖 理論学習内容

### Day 1-3: 型エラーの見方と解決パターン

#### 🔍 既存資料の活用

[`typescript/type errorの見方.md`](../typescript/type%20errorの見方.md) を基盤として、実践的な型エラー解決スキルを習得

#### 基本的な型エラーパターン

```typescript
// 1. 型注釈不足エラー
// ❌ エラーが発生するコード
function processUser(user) {
  // Parameter 'user' implicitly has an 'any' type.
  return user.name.toUpperCase();
}

// ✅ 修正版
interface User {
  name: string;
  email: string;
}

function processUser(user: User): string {
  return user.name.toUpperCase();
}

// 2. null/undefined エラー
// ❌ エラーが発生するコード
function getUserName(users: User[], id: number): string {
  const user = users.find((u) => u.id === id);
  return user.name; // Object is possibly 'undefined'
}

// ✅ 修正版（型ガード使用）
function getUserName(users: User[], id: number): string | null {
  const user = users.find((u) => u.id === id);
  return user ? user.name : null;
}

// ✅ 修正版（Non-null assertion）
function getUserName(users: User[], id: number): string {
  const user = users.find((u) => u.id === id);
  if (!user) {
    throw new Error(`User with id ${id} not found`);
  }
  return user.name;
}

// 3. 型の互換性エラー
// ❌ エラーが発生するコード
interface ApiUser {
  id: number;
  name: string;
}

interface DatabaseUser {
  id: string; // 型が異なる
  name: string;
  email: string;
}

function saveUser(user: DatabaseUser): void {
  // 実装
}

const apiUser: ApiUser = { id: 1, name: "Alice" };
saveUser(apiUser); // Type 'number' is not assignable to type 'string'

// ✅ 修正版（型変換）
function convertApiUserToDbUser(apiUser: ApiUser): DatabaseUser {
  return {
    id: apiUser.id.toString(),
    name: apiUser.name,
    email: "", // デフォルト値
  };
}

saveUser(convertApiUserToDbUser(apiUser));
```

#### 高度な型エラー解決パターン

```typescript
// 4. ジェネリック型エラー
// ❌ エラーが発生するコード
function identity<T>(arg: T): T {
  return arg.length; // Property 'length' does not exist on type 'T'
}

// ✅ 修正版（制約付きジェネリック）
function identity<T extends { length: number }>(arg: T): T {
  console.log(arg.length);
  return arg;
}

// 5. 条件付き型エラー
// ❌ エラーが発生するコード
type ApiResponse<T> = T extends string ? { message: T } : { data: T };

function handleResponse<T>(response: ApiResponse<T>): void {
  console.log(response.message); // Property 'message' does not exist
}

// ✅ 修正版（型ガード使用）
function handleResponse<T>(response: ApiResponse<T>): void {
  if ("message" in response) {
    console.log(response.message);
  } else {
    console.log(response.data);
  }
}

// 6. インデックスシグネチャエラー
// ❌ エラーが発生するコード
interface Config {
  apiUrl: string;
  timeout: number;
}

function getConfigValue(config: Config, key: string): string | number {
  return config[key]; // Element implicitly has an 'any' type
}

// ✅ 修正版（keyof使用）
function getConfigValue<K extends keyof Config>(
  config: Config,
  key: K
): Config[K] {
  return config[key];
}
```

### Day 4-7: this キーワードの完全理解

#### 🔍 既存資料の活用

[`typescript/thisについて.md`](../typescript/thisについて.md) を基盤として、`this`の型安全な活用を習得

#### this の基本パターン

```typescript
// 1. クラス内でのthis
class Calculator {
  private value: number = 0;

  add(n: number): this {
    this.value += n;
    return this; // メソッドチェーン対応
  }

  multiply(n: number): this {
    this.value *= n;
    return this;
  }

  getValue(): number {
    return this.value;
  }
}

const calc = new Calculator();
const result = calc.add(5).multiply(2).getValue(); // 10

// 2. 関数内でのthis型注釈
interface ButtonElement {
  disabled: boolean;
  addEventListener(event: string, handler: (this: ButtonElement) => void): void;
}

function handleClick(this: ButtonElement): void {
  this.disabled = true; // 型安全
}

// 3. アロー関数とthis
class EventHandler {
  private count = 0;

  // ❌ 通常の関数（thisが変わる可能性）
  handleEvent1() {
    setTimeout(function () {
      this.count++; // Error: 'this' implicitly has type 'any'
    }, 1000);
  }

  // ✅ アロー関数（thisが保持される）
  handleEvent2() {
    setTimeout(() => {
      this.count++; // OK: thisはEventHandlerインスタンス
    }, 1000);
  }

  // ✅ bind使用
  handleEvent3() {
    setTimeout(
      function (this: EventHandler) {
        this.count++;
      }.bind(this),
      1000
    );
  }
}
```

#### 高度な this パターン

```typescript
// 4. Mixin パターンでのthis
type Constructor<T = {}> = new (...args: any[]) => T;

function Timestamped<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    timestamp = Date.now();

    getTimestamp(this: this): number {
      return this.timestamp;
    }
  };
}

class User {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
}

const TimestampedUser = Timestamped(User);
const user = new TimestampedUser("Alice");
console.log(user.getTimestamp()); // 型安全

// 5. Fluent Interface パターン
class QueryBuilder {
  private query: string = "";

  select(fields: string[]): this {
    this.query += `SELECT ${fields.join(", ")} `;
    return this;
  }

  from(table: string): this {
    this.query += `FROM ${table} `;
    return this;
  }

  where(condition: string): this {
    this.query += `WHERE ${condition} `;
    return this;
  }

  build(): string {
    return this.query.trim();
  }
}

const query = new QueryBuilder()
  .select(["name", "email"])
  .from("users")
  .where("active = 1")
  .build();

// 6. Conditional this types
class Animal {
  move(): this {
    console.log("Moving...");
    return this;
  }
}

class Dog extends Animal {
  bark(): this {
    console.log("Woof!");
    return this;
  }
}

const dog = new Dog();
dog.move().bark(); // 型安全なメソッドチェーン
```

### Day 8-14: Enum とベストプラクティス

#### 🔍 既存資料の活用

[`typescript/Enumのペストプラクティス.md`](../typescript/Enumのペストプラクティス.md) を基盤として、Enum の適切な使用法を習得

#### Enum の基本と問題点

```typescript
// 1. 数値Enum（基本）
enum Direction {
  Up, // 0
  Down, // 1
  Left, // 2
  Right, // 3
}

function move(direction: Direction): void {
  console.log(`Moving ${Direction[direction]}`);
}

move(Direction.Up); // OK
move(0); // OK（しかし型安全ではない）

// 2. 文字列Enum（推奨）
enum Status {
  Pending = "PENDING",
  Approved = "APPROVED",
  Rejected = "REJECTED",
}

function updateStatus(status: Status): void {
  console.log(`Status updated to ${status}`);
}

updateStatus(Status.Pending); // OK
updateStatus("PENDING"); // Error（型安全）

// 3. const Enum（パフォーマンス最適化）
const enum Color {
  Red = "red",
  Green = "green",
  Blue = "blue",
}

// コンパイル後はインライン化される
const primaryColor = Color.Red; // const primaryColor = 'red';
```

#### Enum の代替手法

```typescript
// 4. const assertion（推奨代替手法）
const UserRole = {
  ADMIN: "ADMIN",
  EDITOR: "EDITOR",
  VIEWER: "VIEWER",
} as const;

type UserRole = (typeof UserRole)[keyof typeof UserRole];
// type UserRole = 'ADMIN' | 'EDITOR' | 'VIEWER'

function checkPermission(role: UserRole): boolean {
  switch (role) {
    case UserRole.ADMIN:
      return true;
    case UserRole.EDITOR:
      return true;
    case UserRole.VIEWER:
      return false;
    default:
      // 網羅性チェック
      const _exhaustive: never = role;
      return false;
  }
}

// 5. 文字列リテラルユニオン型
type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

function makeRequest(method: HttpMethod, url: string): void {
  // 実装
}

makeRequest("GET", "/api/users"); // OK
makeRequest("PATCH", "/api/users"); // Error

// 6. 名前空間パターン
namespace ApiEndpoints {
  export const USERS = "/api/users" as const;
  export const POSTS = "/api/posts" as const;
  export const COMMENTS = "/api/comments" as const;
}

type ApiEndpoint = (typeof ApiEndpoints)[keyof typeof ApiEndpoints];

// 7. クラスベースのEnum（高度）
class HttpStatusCode {
  static readonly OK = new HttpStatusCode(200, "OK");
  static readonly NOT_FOUND = new HttpStatusCode(404, "Not Found");
  static readonly INTERNAL_ERROR = new HttpStatusCode(
    500,
    "Internal Server Error"
  );

  private constructor(
    public readonly code: number,
    public readonly message: string
  ) {}

  toString(): string {
    return `${this.code}: ${this.message}`;
  }

  isError(): boolean {
    return this.code >= 400;
  }
}

function handleResponse(status: HttpStatusCode): void {
  if (status.isError()) {
    console.error(status.toString());
  }
}

handleResponse(HttpStatusCode.NOT_FOUND);
```

## 🎯 実践演習

### 演習 1-1: 型エラー解決チャレンジ 🔰

**目標**: 基本的な型エラーの迅速な解決

```typescript
// 以下のコードの全ての型エラーを修正せよ
// 制約: any型の使用禁止、元の機能を維持すること

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  inStock: boolean;
}

interface CartItem {
  product: Product;
  quantity: number;
}

// エラーを含むコード（修正対象）
class ShoppingCart {
  private items: CartItem[] = [];

  addItem(product, quantity) {
    // Error: Parameter lacks type annotation
    const existingItem = this.items.find(
      (item) => item.product.id === product.id
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.items.push({ product, quantity });
    }
  }

  removeItem(productId: string): boolean {
    const index = this.items.findIndex((item) => item.product.id === productId);
    // Error: Type mismatch (number vs string)

    if (index !== -1) {
      this.items.splice(index, 1);
      return true;
    }
    return false;
  }

  getTotal(): number {
    return this.items.reduce((total, item) => {
      return total + item.product.price * item.quantity;
    }, 0);
  }

  getItemCount(): number {
    return this.items.reduce((count, item) => count + item.quantity, 0);
  }

  findItemsByCategory(category: string): Product[] {
    return this.items
      .filter((item) => item.product.category === category)
      .map((item) => item.product);
  }
}

// 使用例（これも修正が必要）
const cart = new ShoppingCart();
cart.addItem(
  {
    id: "1", // Error: string should be number
    name: "Laptop",
    price: 999.99,
    category: "Electronics",
    inStock: true,
  },
  "2"
); // Error: string should be number

const electronics = cart.findItemsByCategory("Electronics");
console.log(`Found ${electronics.length} electronics items`);
```

**評価基準**:

- [ ] 全ての型エラーが解決されている
- [ ] 適切な型注釈が追加されている
- [ ] 型の一貫性が保たれている
- [ ] 既存機能が保持されている

### 演習 1-2: this キーワード実践 🔶

**目標**: this の型安全な活用パターンの習得

```typescript
// 以下の要件を満たすEventEmitterクラスを実装せよ

interface EventListener<T = any> {
  (this: EventEmitter, data: T): void;
}

interface EventMap {
  [eventName: string]: any;
}

class EventEmitter<TEvents extends EventMap = EventMap> {
  private listeners: Map<keyof TEvents, EventListener[]> = new Map();

  // 1. イベントリスナーの登録（メソッドチェーン対応）
  on<K extends keyof TEvents>(
    event: K,
    listener: EventListener<TEvents[K]>
  ): this {
    // 実装
  }

  // 2. イベントの発火
  emit<K extends keyof TEvents>(event: K, data: TEvents[K]): boolean {
    // 実装
  }

  // 3. リスナーの削除
  off<K extends keyof TEvents>(
    event: K,
    listener: EventListener<TEvents[K]>
  ): this {
    // 実装
  }

  // 4. 一度だけ実行されるリスナー
  once<K extends keyof TEvents>(
    event: K,
    listener: EventListener<TEvents[K]>
  ): this {
    // 実装（thisの適切な処理が必要）
  }
}

// 使用例（型安全性を確認）
interface MyEvents {
  userLogin: { userId: string; timestamp: Date };
  userLogout: { userId: string };
  error: { message: string; code: number };
}

const emitter = new EventEmitter<MyEvents>();

emitter
  .on("userLogin", function (data) {
    // thisはEventEmitterインスタンス
    // dataは{ userId: string; timestamp: Date }型
    console.log(`User ${data.userId} logged in at ${data.timestamp}`);
  })
  .on("error", function (data) {
    // dataは{ message: string; code: number }型
    console.error(`Error ${data.code}: ${data.message}`);
  });

emitter.emit("userLogin", {
  userId: "user123",
  timestamp: new Date(),
});
```

**評価基準**:

- [ ] this の型が正しく推論される
- [ ] メソッドチェーンが型安全に動作
- [ ] イベントデータの型が適切に制約される
- [ ] 実行時エラーが発生しない

### 演習 1-3: Enum 代替手法の実装 🔥

**目標**: 様々な Enum 代替パターンの実装と比較

```typescript
// 以下の要件を満たす3つの実装方法を比較せよ

// 要件: HTTPステータスコードの管理
// - コード値とメッセージの組み合わせ
// - カテゴリ別の判定メソッド
// - 型安全性の確保
// - Tree-shakingの対応

// 1. 従来のEnum実装
enum HttpStatusEnum {
  // 実装
}

// 2. const assertion実装
const HttpStatusConst = {
  // 実装
} as const;

// 3. クラスベース実装
class HttpStatusClass {
  // 実装
}

// 各実装で以下の機能を提供すること:
interface HttpStatusInterface {
  code: number;
  message: string;
  isSuccess(): boolean;
  isClientError(): boolean;
  isServerError(): boolean;
}

// 使用例（全ての実装で動作すること）
function handleResponse(status: /* 適切な型 */) {
  console.log(`${status.code}: ${status.message}`);

  if (status.isSuccess()) {
    console.log('Request successful');
  } else if (status.isClientError()) {
    console.log('Client error');
  } else if (status.isServerError()) {
    console.log('Server error');
  }
}

// パフォーマンステスト
function benchmarkImplementations() {
  // 各実装のバンドルサイズとランタイム性能を比較
}
```

**評価基準**:

- [ ] 3 つの実装方法が正しく動作する
- [ ] 型安全性が確保されている
- [ ] パフォーマンス比較が実装されている
- [ ] 適切な使い分けの指針が示されている

## 📊 Week 1-2 評価基準

### 理解度チェックリスト

#### 型エラー解決 (30%)

- [ ] 基本的な型エラーを 5 分以内で解決できる
- [ ] null/undefined エラーの適切な対処法を理解している
- [ ] 型の互換性問題を解決できる
- [ ] ジェネリック関連のエラーを解決できる

#### this キーワード (25%)

- [ ] クラス内での this の動作を理解している
- [ ] アロー関数と this の関係を説明できる
- [ ] メソッドチェーンでの this 型を適切に設計できる
- [ ] Mixin パターンでの this を活用できる

#### Enum・代替手法 (25%)

- [ ] Enum の種類と特徴を理解している
- [ ] const assertion の適切な使用法を知っている
- [ ] 文字列リテラルユニオン型を活用できる
- [ ] 各手法の使い分けができる

#### 実践応用 (20%)

- [ ] 型安全なクラス設計ができる
- [ ] 既存コードの型安全性を向上できる
- [ ] Angular 経験を活かした型設計ができる
- [ ] エラーハンドリングが適切に実装できる

### 成果物チェックリスト

- [ ] **型エラー解決パターン集**: 10 パターン以上の解決例
- [ ] **this キーワード活用例**: 5 つの実践パターン
- [ ] **Enum 代替実装**: 3 つの手法比較
- [ ] **リファクタリング事例**: 既存コードの型安全化

## 🔄 Week 3-4 への準備

### 次週学習内容の予習

```typescript
// Week 3-4で学習するジェネリクスの基礎概念
// 以下のコードを読んで理解しておくこと

// 1. 基本的なジェネリック関数
function identity<T>(arg: T): T {
  return arg;
}

// 2. ジェネリック制約
interface Lengthwise {
  length: number;
}

function loggingIdentity<T extends Lengthwise>(arg: T): T {
  console.log(arg.length);
  return arg;
}

// 3. ジェネリッククラス
class GenericNumber<T> {
  zeroValue: T;
  add: (x: T, y: T) => T;
}
```

### 環境準備

- [ ] TypeScript 5.x の最新版インストール
- [ ] ESLint + TypeScript 設定
- [ ] Jest/Vitest テスト環境構築
- [ ] VS Code TypeScript 拡張機能設定

### 学習継続のコツ

1. **毎日の習慣化**: 平日 2 時間、週末 6 時間の学習リズム
2. **アウトプット重視**: 学んだことをブログや GitHub で共有
3. **質問の準備**: 理解できない部分を明確にしておく
4. **実践重視**: 理論学習後は必ず手を動かして確認

---

**📌 重要**: Week 1-2 は TypeScript Expert への基盤となる重要な期間です。焦らず確実に基礎を固めることで、後の高度な学習がスムーズに進みます。
