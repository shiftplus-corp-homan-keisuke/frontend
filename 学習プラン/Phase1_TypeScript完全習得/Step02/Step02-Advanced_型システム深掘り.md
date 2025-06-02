# Step 2-Advanced: 型システム深掘り

> 💡 **前提条件**: Step 2-Core を完了していること
>
> **学習目標**: TypeScript の型システムをより深く理解し、実践的なパターンを身につける
>
> - 📖 [専門用語集](./Step02_補足_専門用語集.md) - 高度な型システム用語の解説
> - 🚨 [トラブルシューティング](./Step02_補足_トラブルシューティング.md) - 複雑な型エラーの解決方法
> - 💻 [実践コード例](./Step02_補足_実践コード例.md) - 実際のプロジェクトで使える例

## 📅 学習期間・目標

**期間**: 2-4 時間（発展編）  
**学習スタイル**: 理論 20% + 実践コード 60% + 演習 20%

### 🎯 到達目標

- [ ] 型推論の高度なパターンを理解できる
- [ ] タプル型を実践的に活用できる
- [ ] 読み取り専用配列で安全なコード設計ができる
- [ ] 複雑なオブジェクト型を設計できる
- [ ] 高階関数の型注釈を正しく書ける

## 📚 Section 1: 高度な型推論パターン（30 分）

### 🤖 型推論をもっと活用しよう

Step 2-Core では基本的な型推論を学びました。ここではより実践的なパターンを学びます。

#### 1. 配列メソッドでの型推論

```typescript
// 基本的な配列操作での型推論
let numbers = [1, 2, 3, 4, 5];

// map: 各要素を変換（型も自動で推論される）
let doubled = numbers.map((n) => n * 2); // number[]
let strings = numbers.map((n) => n.toString()); // string[]

// filter: 条件に合う要素を抽出
let evens = numbers.filter((n) => n % 2 === 0); // number[]

// find: 条件に合う最初の要素を取得
let firstEven = numbers.find((n) => n % 2 === 0); // number | undefined
```

#### 2. オブジェクト配列での型推論

```typescript
// ユーザー情報の配列
let users = [
  { name: "太郎", age: 25, city: "東京" },
  { name: "花子", age: 30, city: "大阪" },
  { name: "次郎", age: 28, city: "名古屋" },
];

// 名前だけを抽出
let names = users.map((user) => user.name); // string[]

// 30歳以上のユーザーを抽出
let adults = users.filter((user) => user.age >= 30);
// { name: string; age: number; city: string; }[]

// 都市名だけのユニークなリスト
let cities = [...new Set(users.map((user) => user.city))]; // string[]
```

#### 3. 条件分岐での型推論

```typescript
// 関数の戻り値が条件によって決まる場合
function getDisplayText(isLoggedIn: boolean, userName?: string) {
  if (isLoggedIn && userName) {
    return `ようこそ、${userName}さん`; // string
  } else {
    return "ログインしてください"; // string
  }
  // 戻り値の型: string（自動推論）
}

// より複雑な例
function processData(data: unknown) {
  if (typeof data === "string") {
    return data.toUpperCase(); // string
  } else if (typeof data === "number") {
    return data * 2; // number
  } else {
    return null; // null
  }
  // 戻り値の型: string | number | null（自動推論）
}
```

### 💡 実用的な型推論の活用例

```typescript
// API レスポンスの処理
async function fetchUserData() {
  // 実際のAPIコールの代わり
  const response = {
    users: [
      { id: 1, name: "太郎", email: "taro@example.com" },
      { id: 2, name: "花子", email: "hanako@example.com" },
    ],
    total: 2,
  };

  return response; // 型が自動推論される
}

// 使用時も型推論が効く
fetchUserData().then((data) => {
  console.log(data.total); // number型として認識
  data.users.forEach((user) => {
    console.log(user.name); // string型として認識
  });
});
```

### 🎯 練習問題 1（10 分）

```typescript
// 商品データ
let products = [
  { name: "ノートPC", price: 80000, category: "電子機器" },
  { name: "マウス", price: 2000, category: "電子機器" },
  { name: "本", price: 1500, category: "書籍" }
];

// 以下の処理を実装してください（型推論を活用）
// 1. 価格が3000円以上の商品を抽出
let expensiveProducts = /* ここを実装 */;

// 2. 全商品の名前を配列で取得
let productNames = /* ここを実装 */;

// 3. カテゴリごとの商品数をカウント
function countByCategory(products: typeof products) {
  /* ここを実装 */
}
```

<details>
<summary>答えを見る</summary>

```typescript
// 1. 価格が3000円以上の商品を抽出
let expensiveProducts = products.filter((product) => product.price >= 3000);

// 2. 全商品の名前を配列で取得
let productNames = products.map((product) => product.name);

// 3. カテゴリごとの商品数をカウント
function countByCategory(products: typeof products) {
  let count: { [category: string]: number } = {};

  for (let product of products) {
    count[product.category] = (count[product.category] || 0) + 1;
  }

  return count;
}
```

</details>

## 📚 Section 2: タプル型の実践活用（40 分）

### 🎯 タプル型とは？

タプル型は、決まった数と順序の要素を持つ配列の型です。座標、設定値、関数の複数戻り値などに使います。

#### 1. 基本的なタプル型

```typescript
// 座標を表すタプル
let point: [number, number] = [10, 20]; // x, y座標
let [x, y] = point; // 分割代入で取得

console.log(`x: ${x}, y: ${y}`); // x: 10, y: 20

// RGB色値を表すタプル
let red: [number, number, number] = [255, 0, 0];
let green: [number, number, number] = [0, 255, 0];

// 名前付きタプル（TypeScript 4.0以降）
let coordinate: [x: number, y: number] = [100, 200];
let color: [red: number, green: number, blue: number] = [255, 128, 0];
```

#### 2. 関数の複数戻り値

```typescript
// 計算結果と成功/失敗を同時に返す
function safeDivide(a: number, b: number): [result: number, success: boolean] {
  if (b === 0) {
    return [0, false]; // 失敗
  }
  return [a / b, true]; // 成功
}

// 使用例
let [result, success] = safeDivide(10, 2);
if (success) {
  console.log(`結果: ${result}`); // 結果: 5
} else {
  console.log("計算に失敗しました");
}

// ユーザー検索の結果
function findUser(id: number): [user: object | null, error: string | null] {
  // 模擬的な検索処理
  if (id === 1) {
    return [{ name: "太郎", age: 25 }, null];
  } else {
    return [null, "ユーザーが見つかりません"];
  }
}

let [user, error] = findUser(1);
if (error) {
  console.log(`エラー: ${error}`);
} else if (user) {
  console.log("ユーザーが見つかりました:", user);
}
```

#### 3. 設定値の管理

```typescript
// データベース接続設定
type DatabaseConfig = [host: string, port: number, database: string];

let dbConfig: DatabaseConfig = ["localhost", 5432, "myapp"];
let [host, port, database] = dbConfig;

function connectToDatabase([host, port, database]: DatabaseConfig): void {
  console.log(`Connecting to ${database} at ${host}:${port}`);
}

connectToDatabase(dbConfig);

// API エンドポイント設定
type ApiEndpoint = [method: string, path: string, version: number];

let endpoints: ApiEndpoint[] = [
  ["GET", "/users", 1],
  ["POST", "/users", 1],
  ["PUT", "/users/:id", 2],
];

function registerEndpoint([method, path, version]: ApiEndpoint): void {
  console.log(`${method} ${path} (v${version})`);
}

endpoints.forEach(registerEndpoint);
```

### 🔧 オプショナル要素と残余要素

```typescript
// オプショナル要素（?を使用）
type Coordinate3D = [x: number, y: number, z?: number];

let point2D: Coordinate3D = [10, 20]; // z座標は省略可能
let point3D: Coordinate3D = [10, 20, 30]; // z座標あり

// 残余要素（...を使用）
type LogEntry = [
  timestamp: Date,
  level: string,
  message: string,
  ...details: string[]
];

function createLog(
  level: string,
  message: string,
  ...details: string[]
): LogEntry {
  return [new Date(), level, message, ...details];
}

let errorLog = createLog(
  "ERROR",
  "Database error",
  "Connection timeout",
  "Retry failed"
);
let infoLog = createLog("INFO", "User logged in");

// ログの処理
function processLog([timestamp, level, message, ...details]: LogEntry): void {
  console.log(`[${timestamp.toISOString()}] ${level}: ${message}`);
  if (details.length > 0) {
    console.log("詳細:", details.join(", "));
  }
}

processLog(errorLog);
processLog(infoLog);
```

### 🎯 練習問題 2（15 分）

```typescript
// 1. 商品情報をタプルで表現してください
// [商品名, 価格, 在庫数, カテゴリ（オプショナル）]
type ProductInfo = /* ここを定義 */;

// 2. 商品を作成する関数
function createProduct(name: string, price: number, stock: number, category?: string): ProductInfo {
  /* ここを実装 */
}

// 3. 商品情報を表示する関数
function displayProduct(product: ProductInfo): void {
  /* ここを実装 */
}

// 4. 複数の商品を一度に作成する関数（残余引数を使用）
function createProducts(...productData: [string, number, number][]): ProductInfo[] {
  /* ここを実装 */
}

// テスト
let laptop = createProduct("ノートPC", 80000, 5, "電子機器");
displayProduct(laptop);

let products = createProducts(
  ["マウス", 2000, 10],
  ["キーボード", 5000, 8]
);
```

<details>
<summary>答えを見る</summary>

```typescript
// 1. 商品情報のタプル型
type ProductInfo = [
  name: string,
  price: number,
  stock: number,
  category?: string
];

// 2. 商品を作成する関数
function createProduct(
  name: string,
  price: number,
  stock: number,
  category?: string
): ProductInfo {
  if (category) {
    return [name, price, stock, category];
  } else {
    return [name, price, stock];
  }
}

// 3. 商品情報を表示する関数
function displayProduct([name, price, stock, category]: ProductInfo): void {
  console.log(`商品名: ${name}`);
  console.log(`価格: ${price}円`);
  console.log(`在庫: ${stock}個`);
  if (category) {
    console.log(`カテゴリ: ${category}`);
  }
  console.log("---");
}

// 4. 複数の商品を一度に作成する関数
function createProducts(
  ...productData: [string, number, number][]
): ProductInfo[] {
  return productData.map(([name, price, stock]) =>
    createProduct(name, price, stock)
  );
}
```

</details>

## 📚 Section 3: 読み取り専用配列とイミュータブル設計（30 分）

### 🔒 読み取り専用配列で安全なコード設計

読み取り専用配列は、配列の内容を変更できないようにする型です。データの整合性を保つために重要です。

#### 1. 基本的な読み取り専用配列

```typescript
// 基本的な読み取り専用配列
let numbers: readonly number[] = [1, 2, 3, 4, 5];
let fruits: ReadonlyArray<string> = ["りんご", "バナナ", "オレンジ"];

// 読み取りは可能
console.log(numbers[0]); // 1
console.log(fruits.length); // 3

// 変更は不可能
// numbers.push(6); // Error!
// numbers[0] = 10; // Error!
// fruits.pop(); // Error!

// 新しい配列を作成する方法
let newNumbers = [...numbers, 6]; // [1, 2, 3, 4, 5, 6]
let newFruits = fruits.filter((fruit) => fruit !== "バナナ"); // ["りんご", "オレンジ"]
```

#### 2. 設定データの保護

```typescript
// アプリケーション設定（変更されてはいけない）
const APP_CONFIG: readonly string[] = [
  "https://api.example.com",
  "https://cdn.example.com",
  "https://auth.example.com",
];

const SUPPORTED_LANGUAGES: readonly string[] = ["ja", "en", "fr", "de"];

// 設定を使用する関数
function getApiUrl(): string {
  return APP_CONFIG[0];
}

function isSupportedLanguage(lang: string): boolean {
  return SUPPORTED_LANGUAGES.includes(lang);
}

// 新しい設定を作成（元の設定は変更しない）
function addLanguage(newLang: string): readonly string[] {
  return [...SUPPORTED_LANGUAGES, newLang];
}

console.log(getApiUrl()); // "https://api.example.com"
console.log(isSupportedLanguage("ja")); // true

let extendedLanguages = addLanguage("es");
console.log(extendedLanguages); // ["ja", "en", "fr", "de", "es"]
console.log(SUPPORTED_LANGUAGES); // 元の配列は変更されない
```

#### 3. 関数の戻り値での活用

```typescript
// ユーザー管理クラス
class UserManager {
  private users: { name: string; age: number }[] = [
    { name: "太郎", age: 25 },
    { name: "花子", age: 30 },
  ];

  // 読み取り専用でユーザーリストを返す
  getUsers(): readonly { name: string; age: number }[] {
    return [...this.users]; // コピーを返す
  }

  // ユーザーを追加（内部でのみ変更可能）
  addUser(name: string, age: number): void {
    this.users.push({ name, age });
  }

  // 条件に合うユーザーを検索
  findUsers(
    condition: (user: { name: string; age: number }) => boolean
  ): readonly { name: string; age: number }[] {
    return this.users.filter(condition);
  }
}

let userManager = new UserManager();
let users = userManager.getUsers();

// 読み取りは可能
console.log(users[0].name); // "太郎"

// 直接変更は不可能（コンパイルエラー）
// users.push({ name: "次郎", age: 28 }); // Error!

// 正しい方法でユーザーを追加
userManager.addUser("次郎", 28);

// 30歳以上のユーザーを検索
let adults = userManager.findUsers((user) => user.age >= 30);
console.log(adults); // [{ name: "花子", age: 30 }]
```

### 🎯 練習問題 3（10 分）

```typescript
// 1. 読み取り専用のタスクリストを管理するクラスを作成
type Task = {
  readonly id: number;
  readonly title: string;
  readonly completed: boolean;
};

class TaskManager {
  private tasks: readonly Task[] = [];

  // 全タスクを取得
  getAllTasks(): /* 戻り値の型を書く */ {
    /* 実装 */
  };

  // タスクを追加
  addTask(title: string): TaskManager {
    /* 実装 */
  }

  // タスクを完了にする
  completeTask(id: number): TaskManager {
    /* 実装 */
  }

  // 未完了のタスクを取得
  getPendingTasks(): /* 戻り値の型を書く */ {
    /* 実装 */
  };
}

// 2. 使用例を書いてください
let taskManager = new TaskManager();
// ここにテストコードを書く
```

<details>
<summary>答えを見る</summary>

```typescript
class TaskManager {
  private tasks: readonly Task[] = [];
  private nextId = 1;

  // 全タスクを取得
  getAllTasks(): readonly Task[] {
    return this.tasks;
  }

  // タスクを追加
  addTask(title: string): TaskManager {
    const newTask: Task = {
      id: this.nextId++,
      title,
      completed: false,
    };
    const newTasks = [...this.tasks, newTask];
    const newManager = new TaskManager();
    (newManager as any).tasks = newTasks;
    (newManager as any).nextId = this.nextId;
    return newManager;
  }

  // タスクを完了にする
  completeTask(id: number): TaskManager {
    const newTasks = this.tasks.map((task) =>
      task.id === id ? { ...task, completed: true } : task
    );
    const newManager = new TaskManager();
    (newManager as any).tasks = newTasks;
    (newManager as any).nextId = this.nextId;
    return newManager;
  }

  // 未完了のタスクを取得
  getPendingTasks(): readonly Task[] {
    return this.tasks.filter((task) => !task.completed);
  }
}

// 使用例
let taskManager = new TaskManager();
taskManager = taskManager.addTask("TypeScriptを学習する");
taskManager = taskManager.addTask("プロジェクトを完成させる");

console.log("全タスク:", taskManager.getAllTasks());
console.log("未完了タスク:", taskManager.getPendingTasks());

taskManager = taskManager.completeTask(1);
console.log("完了後の未完了タスク:", taskManager.getPendingTasks());
```

</details>

## 📚 Section 4: 高階関数の型注釈（40 分）

### 🔧 高階関数とは？

高階関数は、関数を引数として受け取ったり、関数を戻り値として返す関数です。TypeScript では、これらの関数の型も安全に定義できます。

#### 1. 関数を引数として受け取る

```typescript
// 基本的な高階関数
function applyOperation(
  numbers: number[],
  operation: (n: number) => number
): number[] {
  return numbers.map(operation);
}

// 使用例
let numbers = [1, 2, 3, 4, 5];

let doubled = applyOperation(numbers, (n) => n * 2); // [2, 4, 6, 8, 10]
let squared = applyOperation(numbers, (n) => n * n); // [1, 4, 9, 16, 25]

console.log("2倍:", doubled);
console.log("2乗:", squared);

// より実用的な例：配列のフィルタリング
function filterArray<T>(array: T[], predicate: (item: T) => boolean): T[] {
  return array.filter(predicate);
}

let users = [
  { name: "太郎", age: 25 },
  { name: "花子", age: 30 },
  { name: "次郎", age: 17 },
];

let adults = filterArray(users, (user) => user.age >= 18);
console.log("成人:", adults);
```

#### 2. 関数を戻り値として返す

```typescript
// 関数を返す関数
function createMultiplier(factor: number): (n: number) => number {
  return function (n: number): number {
    return n * factor;
  };
}

// 使用例
let double = createMultiplier(2);
let triple = createMultiplier(3);

console.log(double(5)); // 10
console.log(triple(5)); // 15

// より実用的な例：バリデーター作成
function createValidator(
  errorMessage: string
): (value: string) => { isValid: boolean; error?: string } {
  return function (value: string) {
    if (value.length === 0) {
      return { isValid: false, error: errorMessage };
    }
    return { isValid: true };
  };
}

let nameValidator = createValidator("名前は必須です");
let emailValidator = createValidator("メールアドレスは必須です");

console.log(nameValidator("")); // { isValid: false, error: "名前は必須です" }
console.log(nameValidator("太郎")); // { isValid: true }
```

#### 3. 複雑な高階関数の例

```typescript
// イベントハンドラーの型定義
type EventHandler<T> = (event: T) => void;
type EventFilter<T> = (event: T) => boolean;

// イベント管理システム
class EventManager<T> {
  private handlers: EventHandler<T>[] = [];
  private filters: EventFilter<T>[] = [];

  // ハンドラーを追加
  addHandler(handler: EventHandler<T>): void {
    this.handlers.push(handler);
  }

  // フィルターを追加
  addFilter(filter: EventFilter<T>): void {
    this.filters.push(filter);
  }

  // イベントを発火
  emit(event: T): void {
    // フィルターをすべて通過した場合のみ処理
    let shouldProcess = this.filters.every((filter) => filter(event));

    if (shouldProcess) {
      this.handlers.forEach((handler) => handler(event));
    }
  }

  // フィルター付きハンドラーを作成
  createFilteredHandler(
    filter: EventFilter<T>,
    handler: EventHandler<T>
  ): EventHandler<T> {
    return (event: T) => {
      if (filter(event)) {
        handler(event);
      }
    };
  }
}

// 使用例
type UserEvent = {
  type: "login" | "logout" | "purchase";
  userId: number;
  timestamp: Date;
};

let eventManager = new EventManager<UserEvent>();

// ログインイベントのハンドラー
eventManager.addHandler((event) => {
  if (event.type === "login") {
    console.log(`ユーザー ${event.userId} がログインしました`);
  }
});

// 購入イベントのハンドラー
eventManager.addHandler((event) => {
  if (event.type === "purchase") {
    console.log(`ユーザー ${event.userId} が購入しました`);
  }
});

// 営業時間内のイベントのみ処理するフィルター
eventManager.addFilter((event) => {
  let hour = event.timestamp.getHours();
  return hour >= 9 && hour <= 18; // 9時〜18時のみ
});

// イベントを発火
eventManager.emit({
  type: "login",
  userId: 123,
  timestamp: new Date(),
});
```

### 💡 実用的なパターン

```typescript
// データ変換パイプライン
type Transform<T, U> = (data: T) => U;

function createPipeline<T>(
  ...transforms: Transform<any, any>[]
): Transform<T, any> {
  return (data: T) => {
    return transforms.reduce((result, transform) => transform(result), data);
  };
}

// 使用例
let processUserData = createPipeline(
  (user: { name: string; age: number }) => ({
    ...user,
    name: user.name.toUpperCase(),
  }),
  (user: { name: string; age: number }) => ({
    ...user,
    isAdult: user.age >= 18,
  }),
  (user: { name: string; age: number; isAdult: boolean }) =>
    `${user.name} (${user.isAdult ? "成人" : "未成年"})`
);

let result = processUserData({ name: "太郎", age: 25 });
console.log(result); // "太郎 (成人)"

// 非同期処理の高階関数
type AsyncOperation<T, U> = (data: T) => Promise<U>;

async function retryOperation<T, U>(
  operation: AsyncOperation<T, U>,
  data: T,
  maxRetries: number = 3
): Promise<U> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation(data);
    } catch (error) {
      if (i === maxRetries - 1) {
        throw error;
      }
      console.log(`リトライ ${i + 1}/${maxRetries}`);
    }
  }
  throw new Error("最大リトライ回数に達しました");
}

// 使用例
async function fetchUserData(
  id: number
): Promise<{ name: string; age: number }> {
  // 模擬的なAPI呼び出し（時々失敗する）
  if (Math.random() < 0.7) {
    throw new Error("ネットワークエラー");
  }
  return { name: "太郎", age: 25 };
}

// リトライ機能付きでユーザーデータを取得
retryOperation(fetchUserData, 123)
  .then((user) => console.log("取得成功:", user))
  .catch((error) => console.error("取得失敗:", error));
```

### 🎯 練習問題 4（20 分）

```typescript
// 1. 配列の要素を変換する高階関数を作成
function transformArray<T, U>(
  array: T[],
  transformer: /* 型を定義 */
): U[] {
  /* 実装 */
}

// 2. 条件に合う要素のみを処理する高階関数を作成
function processIf<T>(
  array: T[],
  condition: /* 型を定義 */,
  processor: /* 型を定義 */
): void {
  /* 実装 */
}

// 3. 複数の条件をチェックする関数を作成する高階関数
function createMultiValidator<T>(
  ...validators: /* 型を定義 */
): (value: T) => { isValid: boolean; errors: string[] } {
  /* 実装 */
}

// 4. 使用例を書いてください
let numbers = [1, 2, 3, 4, 5];

// transformArrayのテスト
let strings = transformArray(/* 引数を書く */);

// processIfのテスト
processIf(/* 引数を書く */);

// createMultiValidatorのテスト
let userValidator = createMultiValidator(/* 引数を書く */);
```

<details>
<summary>答えを見る</summary>

```typescript
// 1. 配列の要素を変換する高階関数
function transformArray<T, U>(
  array: T[],
  transformer: (item: T) => U
): U[] {
  return array.map(transformer);
}

// 2. 条件に合う要素のみを処理する高階関数
function processIf<T>(
  array: T[],
  condition: (item: T) => boolean,
  processor: (item: T) => void
): void {
  array.filter(condition).forEach(processor);
}

// 3. 複数の条件をチェックする関数を作成する高階関数
function createMultiValidator<T>(
  ...validators: Array<(value: T) => { isValid: boolean; error?: string }>
): (value: T) => { isValid: boolean; errors: string[] } {
  return (value: T) => {
    let errors: string[] = [];

    for (let validator of validators) {
      let result = validator(value);
      if (!result.isValid && result.error) {
        errors.push(result.error);
      }
    }

    return {
      isValid: errors.length === 0,
      errors: errors,
    };
  };
}

// 使用例
const userValidator = createMultiValidator(
  (user: { name: string; age: number; email: string }) => ({
    isValid: user.name.length > 0,
    error: user.name.length > 0 ? undefined : "名前は必須です",
  }),
  (user: { name: string; age: number; email: string }) => ({
    isValid: user.age >= 0 && user.age <= 120,
    error: user.age >= 0 && user.age <= 120 ? undefined : "年齢は0-120の範囲で入力してください",
  }),
  (user: { name: string; age: number; email: string }) => ({
    isValid: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email),
    error: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email) ? undefined : "有効なメールアドレスを入力してください",
  })
);

const testUser = { name: "", age: 25, email: "invalid-email" };
const validationResult = userValidator(testUser);
console.log(validationResult);
// { isValid: false, errors: ["名前は必須です", "有効なメールアドレスを入力してください"] }
```

</details>

## 🎯 実践演習

> 💡 **演習サポート**: 演習中に困った時は以下の補足資料を活用してください
>
> - 🚨 [トラブルシューティング](./Step02_補足_トラブルシューティング.md) - エラーが発生した場合の解決方法
> - 💻 [実践コード例](./Step02_補足_実践コード例.md) - より詳細なコード例とパターン
> - 📖 [専門用語集](./Step02_補足_専門用語集.md) - 分からない用語の確認

### 演習 2-1: 型推論マスター 🔰

```typescript
// 以下のコードの型推論結果を予測し、実際に確認せよ

// 1. 基本的な型推論
let a = 42; // 型は？
let b = "hello"; // 型は？
let c = true; // 型は？
let d = [1, 2, 3]; // 型は？
let e = ["a", "b", "c"]; // 型は？

// 2. 複雑な型推論
let f = [1, "hello", true]; // 型は？
let g = { name: "Alice", age: 30 }; // 型は？
let h = [{ id: 1, name: "Bob" }]; // 型は？

// 3. 関数の型推論
function mystery1(x, y) {
  // パラメータの型は？
  return x + y;
}

function mystery2(arr) {
  // パラメータの型は？
  return arr.map((x) => x * 2);
}
```

#### 解答例と解説

- a: number
- b: string
- c: boolean
- d: number[]
- e: string[]
- f: (string | number | boolean)[]
- g: { name: string; age: number; }
- h: { id: number; name: string; }[]
- mystery1: パラメータはany型（型推論不可）
- mystery2: パラメータはany型（型推論不可）

### 演習 2-2: 商品管理システム 🔥

身近な商品管理システムを段階的に実装し、Step02で学習した型システムを総合的に活用せよ

#### 学習目標:
- Step02で学習した基本型システムの総合活用
- 実用的なデータ構造設計の体験
- 型安全なCRUD操作の実装
- 段階的な機能拡張の経験

#### Phase 1: 基本構造設計 (初学者レベル)

**要件:**
- 商品情報の型定義
- 基本的なCRUD操作の実装
- 型安全なデータ管理

```typescript
// 商品情報の型定義
interface Product {
  readonly id: number;        // 商品ID（変更不可）
  name: string;              // 商品名
  price: number;             // 価格
  category: string;          // カテゴリ
  inStock: boolean;          // 在庫状況
  description?: string;      // 商品説明（オプショナル）
}

// 商品管理クラス
class ProductManager {
  private products: Product[] = [];
  private nextId: number = 1;

  // 商品追加
  addProduct(
    name: string,
    price: number,
    category: string,
    description?: string
  ): Product {
    const newProduct: Product = {
      id: this.nextId++,
      name,
      price,
      category,
      inStock: true,
      description,
    };

    this.products.push(newProduct);
    return newProduct;
  }

  // 商品削除
  removeProduct(id: number): boolean {
    const index = this.products.findIndex(product => product.id === id);
    if (index !== -1) {
      this.products.splice(index, 1);
      return true;
    }
    return false;
  }

  // 商品更新
  updateProduct(id: number, updates: Partial<Omit<Product, 'id'>>): boolean {
    const product = this.products.find(p => p.id === id);
    if (product) {
      Object.assign(product, updates);
      return true;
    }
    return false;
  }

  // 全商品取得
  getAllProducts(): readonly Product[] {
    return [...this.products]; // イミュータブルなコピーを返す
  }
}
```

#### Phase 2: 検索・フィルタ機能 (中級レベル)

**要件:**
- カテゴリ別検索
- 価格範囲検索
- 在庫状況検索
- 名前による部分検索

```typescript
class ProductManager {
  // ... Phase 1のメソッドに加えて

  // カテゴリ別検索
  findProductsByCategory(category: string): Product[] {
    return this.products.filter(product =>
      product.category.toLowerCase() === category.toLowerCase()
    );
  }

  // 価格範囲検索
  findProductsByPriceRange(minPrice: number, maxPrice: number): Product[] {
    return this.products.filter(product =>
      product.price >= minPrice && product.price <= maxPrice
    );
  }

  // 在庫状況検索
  findProductsInStock(): Product[] {
    return this.products.filter(product => product.inStock);
  }

  findProductsOutOfStock(): Product[] {
    return this.products.filter(product => !product.inStock);
  }

  // 名前による部分検索
  searchProductsByName(searchTerm: string): Product[] {
    const lowerSearchTerm = searchTerm.toLowerCase();
    return this.products.filter(product =>
      product.name.toLowerCase().includes(lowerSearchTerm)
    );
  }

  // 複合検索（複数条件）
  searchProducts(criteria: {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    inStock?: boolean;
    nameSearch?: string;
  }): Product[] {
    return this.products.filter(product => {
      // カテゴリ条件
      if (criteria.category &&
          product.category.toLowerCase() !== criteria.category.toLowerCase()) {
        return false;
      }

      // 価格条件
      if (criteria.minPrice !== undefined && product.price < criteria.minPrice) {
        return false;
      }
      if (criteria.maxPrice !== undefined && product.price > criteria.maxPrice) {
        return false;
      }

      // 在庫条件
      if (criteria.inStock !== undefined && product.inStock !== criteria.inStock) {
        return false;
      }

      // 名前検索条件
      if (criteria.nameSearch &&
          !product.name.toLowerCase().includes(criteria.nameSearch.toLowerCase())) {
        return false;
      }

      return true;
    });
  }
}
```

#### Phase 3: 高度機能 (上級レベル)

**要件:**
- カテゴリ別統計
- 在庫総額計算
- 最高価格・最低価格商品検索
- 商品数カウント

```typescript
// 統計情報の型定義
interface CategoryStats {
  category: string;
  totalProducts: number;
  averagePrice: number;
  totalValue: number;
  inStockCount: number;
}

interface InventoryStats {
  total: number;
  inStock: number;
  outOfStock: number;
  totalValue: number;
  averagePrice: number;
}

class ProductManager {
  // ... Phase 1, 2のメソッドに加えて

  // カテゴリ別統計
  getCategoryStatistics(): CategoryStats[] {
    const categories = [...new Set(this.products.map(p => p.category))];
    
    return categories.map(category => {
      const categoryProducts = this.products.filter(p => p.category === category);
      const inStockProducts = categoryProducts.filter(p => p.inStock);
      
      return {
        category,
        totalProducts: categoryProducts.length,
        averagePrice: categoryProducts.length > 0
          ? categoryProducts.reduce((sum, p) => sum + p.price, 0) / categoryProducts.length
          : 0,
        totalValue: categoryProducts.reduce((sum, p) => sum + p.price, 0),
        inStockCount: inStockProducts.length,
      };
    });
  }

  // 在庫総額計算
  getTotalInventoryValue(): number {
    return this.products
      .filter(product => product.inStock)
      .reduce((total, product) => total + product.price, 0);
  }

  // 最高価格商品
  getMostExpensiveProduct(): Product | null {
    if (this.products.length === 0) return null;
    
    return this.products.reduce((max, current) =>
      current.price > max.price ? current : max
    );
  }

  // 最低価格商品
  getCheapestProduct(): Product | null {
    if (this.products.length === 0) return null;
    
    return this.products.reduce((min, current) =>
      current.price < min.price ? current : min
    );
  }

  // 商品数カウント
  getInventoryStats(): InventoryStats {
    const inStockProducts = this.products.filter(p => p.inStock);
    const outOfStockProducts = this.products.filter(p => !p.inStock);
    
    return {
      total: this.products.length,
      inStock: inStockProducts.length,
      outOfStock: outOfStockProducts.length,
      totalValue: this.getTotalInventoryValue(),
      averagePrice: this.products.length > 0
        ? this.products.reduce((sum, p) => sum + p.price, 0) / this.products.length
        : 0,
    };
  }

  // 価格帯別商品数
  getPriceRangeDistribution(ranges: [number, number][]): Record<string, number> {
    const distribution: Record<string, number> = {};
    
    ranges.forEach(([min, max]) => {
      const key = `${min}-${max}`;
      distribution[key] = this.products.filter(
        p => p.price >= min && p.price <= max
      ).length;
    });
    
    return distribution;
  }
}

// 使用例
const productManager = new ProductManager();

// Phase 1: 基本操作
const laptop = productManager.addProduct(
  "MacBook Pro",
  200000,
  "Electronics",
  "高性能ノートパソコン"
);
const book = productManager.addProduct("TypeScript入門", 3000, "Books");
const headphones = productManager.addProduct("ワイヤレスヘッドホン", 15000, "Electronics");

// Phase 2: 検索機能
console.log("Electronics商品:", productManager.findProductsByCategory("Electronics"));
console.log("1万円以下の商品:", productManager.findProductsByPriceRange(0, 10000));
console.log("在庫あり商品:", productManager.findProductsInStock());

// 複合検索
const searchResults = productManager.searchProducts({
  category: "Electronics",
  maxPrice: 50000,
  inStock: true
});
console.log("Electronics、5万円以下、在庫あり:", searchResults);

// Phase 3: 統計・分析
console.log("カテゴリ別統計:", productManager.getCategoryStatistics());
console.log("在庫総額:", productManager.getTotalInventoryValue());
console.log("最高価格商品:", productManager.getMostExpensiveProduct());
console.log("在庫統計:", productManager.getInventoryStats());

// 価格帯別分布
const priceRanges: [number, number][] = [
  [0, 5000],
  [5001, 20000],
  [20001, 100000],
  [100001, Infinity]
];
console.log("価格帯別商品数:", productManager.getPriceRangeDistribution(priceRanges));
```

#### 📝 学習ポイント

**Phase 1で学ぶこと:**
- `interface`による型定義
- `readonly`プロパティの活用
- オプショナルプロパティ（`?`）
- `Partial`型と`Omit`型の基本的な使用

**Phase 2で学ぶこと:**
- 配列の`filter`メソッドと型安全性
- 複雑な条件分岐の型安全な実装
- オブジェクトの型定義と活用

**Phase 3で学ぶこと:**
- より高度な型定義（`Record`型など）
- 統計計算の型安全な実装
- 配列の`reduce`メソッドの活用
- 複雑なデータ変換処理

## 📊 Step 2 評価基準

> 💡 **学習サポート**: 各評価項目の詳細な解説は以下の補足資料で確認できます
>
> - 📖 [専門用語集](./Step02_補足_専門用語集.md) - 型システム関連の重要な概念と用語
> - 💻 [実践コード例](./Step02_補足_実践コード例.md) - 段階的な学習用コード集
> - 🚨 [トラブルシューティング](./Step02_補足_トラブルシューティング.md) - よくあるエラーと解決方法
> - 📚 [参考リソース](./Step02_補足_参考リソース.md) - さらなる学習リソース

### 理解度チェックリスト

#### プリミティブ型 (25%)

- [ ] 基本型（string, number, boolean 等）を正しく使用できる → [専門用語集: プリミティブ型](./Step02_補足_専門用語集.md#プリミティブ型primitive-types)
- [ ] リテラル型の概念を理解している → [専門用語集: リテラル型](./Step02_補足_専門用語集.md#リテラル型literal-types)
- [ ] null/undefined の違いを説明できる → [トラブルシューティング: null/undefined 関連のエラー](./Step02_補足_トラブルシューティング.md#nullundefined関連のエラー)
- [ ] 他言語との型システムの違いを理解している → [参考リソース: 型システム学習サイト](./Step02_補足_参考リソース.md#型システム学習サイト)

#### 型推論 (25%)

- [ ] TypeScript の型推論メカニズムを理解している → [専門用語集: 型推論](./Step02_補足_専門用語集.md#型推論type-inference)
- [ ] 型推論の限界を把握している → [実践コード例: 型推論の活用例](./Step02_補足_実践コード例.md#型推論の活用例)
- [ ] 適切な場面で明示的型注釈を使用できる → [トラブルシューティング: 型推論関連の問題](./Step02_補足_トラブルシューティング.md#型推論関連の問題)
- [ ] 文脈的型推論を活用できる → [専門用語集: 型の絞り込み](./Step02_補足_専門用語集.md#型の絞り込みtype-narrowing)

#### 配列・タプル (25%)

- [ ] 配列型を適切に定義・使用できる → [専門用語集: 配列型](./Step02_補足_専門用語集.md#配列型array-types)
- [ ] タプル型の特徴と用途を理解している → [専門用語集: タプル型](./Step02_補足_専門用語集.md#タプル型tuple-types)
- [ ] 読み取り専用配列を活用できる → [専門用語集: 読み取り専用型](./Step02_補足_専門用語集.md#読み取り専用型readonly-types)
- [ ] 配列操作の型安全性を確保できる → [実践コード例: 配列・タプル操作の実践](./Step02_補足_実践コード例.md#配列タプル操作の実践)

#### オブジェクト・関数型 (25%)

- [ ] オブジェクト型を詳細に定義できる → [実践コード例: オブジェクト型の活用例](./Step02_補足_実践コード例.md#オブジェクト型の活用例)
- [ ] 関数の型注釈を適切に設定できる → [専門用語集: 関数型](./Step02_補足_専門用語集.md#関数型function-types)
- [ ] オプショナルプロパティを活用できる → [専門用語集: オプショナルパラメータ](./Step02_補足_専門用語集.md#オプショナルパラメータoptional-parameters)
- [ ] 高階関数の型を正しく定義できる → [実践コード例: 高度な関数型パターン](./Step02_補足_実践コード例.md#高度な関数型パターン)

### 成果物

- [ ] **商品管理システム**: Step02の学習内容を段階的に活用した3段階の商品管理システム → [Step02成果物: 商品管理システム](./Step02_成果物.md)

**📌 重要**: Step 2 は TypeScript の型システムの基礎を固める重要な期間です。型推論の仕組みを理解し、配列・オブジェクト・関数の型注釈を確実に身につけましょう。

**🌟 次週は、インターフェースとオブジェクト型設計について詳しく学習します！**
