# Step02 実践コード例

> 💡 **このファイルについて**: Step02の型システムと型注釈の学習のための段階的なコード例集です。基本的な型から複雑な型システムまで段階的に学習できます。

## 📋 目次
1. [プリミティブ型の実践](#プリミティブ型の実践)
2. [型推論の活用例](#型推論の活用例)
3. [配列・タプル操作の実践](#配列タプル操作の実践)
4. [関数型の実践活用](#関数型の実践活用)
5. [実用的なアプリケーション例](#実用的なアプリケーション例)

---

## プリミティブ型の実践

### ステップ1: 基本型の活用
```typescript
// basic-types-practice.ts

// 1. 文字列型の活用
function formatUserName(firstName: string, lastName: string): string {
  return `${lastName}, ${firstName}`;
}

function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// 2. 数値型の活用
function calculateTax(price: number, taxRate: number = 0.1): number {
  return Math.round(price * (1 + taxRate) * 100) / 100;
}

function generateRandomId(): number {
  return Math.floor(Math.random() * 1000000);
}

// 3. 真偽値型の活用
function isAdult(age: number): boolean {
  return age >= 18;
}

function canVote(age: number, isCitizen: boolean): boolean {
  return isAdult(age) && isCitizen;
}

// 4. null/undefined の安全な処理
function getDisplayName(name: string | null | undefined): string {
  if (name === null || name === undefined) {
    return "Unknown User";
  }
  return name.trim() || "Unknown User";
}

function safeParseInt(value: string | null | undefined): number | null {
  if (!value) return null;
  
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? null : parsed;
}

// 使用例
console.log(formatUserName("太郎", "田中")); // "田中, 太郎"
console.log(validateEmail("test@example.com")); // true
console.log(calculateTax(1000, 0.08)); // 1080
console.log(canVote(20, true)); // true
console.log(getDisplayName(null)); // "Unknown User"
console.log(safeParseInt("123")); // 123
```

### ステップ2: リテラル型とユニオン型
```typescript
// literal-union-types.ts

// 1. 文字列リテラル型
type Theme = "light" | "dark" | "auto";
type Language = "ja" | "en" | "zh" | "ko";

function applyTheme(theme: Theme): void {
  document.body.className = `theme-${theme}`;
}

function getGreeting(lang: Language): string {
  switch (lang) {
    case "ja":
      return "こんにちは";
    case "en":
      return "Hello";
    case "zh":
      return "你好";
    case "ko":
      return "안녕하세요";
    default:
      // TypeScriptが全てのケースをチェック
      const exhaustiveCheck: never = lang;
      throw new Error(`Unsupported language: ${exhaustiveCheck}`);
  }
}

// 2. 数値リテラル型
type HttpStatus = 200 | 201 | 400 | 401 | 403 | 404 | 500;
type Priority = 1 | 2 | 3 | 4 | 5;

function handleResponse(status: HttpStatus): string {
  if (status >= 200 && status < 300) {
    return "Success";
  } else if (status >= 400 && status < 500) {
    return "Client Error";
  } else {
    return "Server Error";
  }
}

function getPriorityLabel(priority: Priority): string {
  const labels = {
    1: "Very Low",
    2: "Low", 
    3: "Medium",
    4: "High",
    5: "Critical"
  };
  return labels[priority];
}

// 3. 複雑なユニオン型
type ApiResponse<T> = 
  | { success: true; data: T }
  | { success: false; error: string };

function processApiResponse<T>(response: ApiResponse<T>): T | null {
  if (response.success) {
    return response.data;
  } else {
    console.error("API Error:", response.error);
    return null;
  }
}

// 使用例
applyTheme("dark");
console.log(getGreeting("ja")); // "こんにちは"
console.log(handleResponse(404)); // "Client Error"
console.log(getPriorityLabel(5)); // "Critical"

const userResponse: ApiResponse<{ name: string; age: number }> = {
  success: true,
  data: { name: "Alice", age: 30 }
};
console.log(processApiResponse(userResponse)); // { name: "Alice", age: 30 }
```

---

## 型推論の活用例

### ステップ3: 型推論を活用したコード
```typescript
// type-inference-examples.ts

// 1. 基本的な型推論の活用
function createUser(name: string, age: number) {
  // 戻り値の型は自動推論される: { name: string; age: number; id: number; createdAt: Date }
  return {
    name,
    age,
    id: Math.floor(Math.random() * 1000),
    createdAt: new Date()
  };
}

// 2. 配列操作での型推論
function processNumbers(numbers: number[]) {
  // 各操作で型が適切に推論される
  const doubled = numbers.map(n => n * 2); // number[]
  const evens = numbers.filter(n => n % 2 === 0); // number[]
  const sum = numbers.reduce((acc, n) => acc + n, 0); // number
  
  return {
    doubled,
    evens,
    sum,
    average: sum / numbers.length // number
  };
}

// 3. 条件分岐での型の絞り込み
function processValue(value: string | number | boolean) {
  if (typeof value === "string") {
    // この分岐内では value は string 型
    return value.toUpperCase();
  } else if (typeof value === "number") {
    // この分岐内では value は number 型
    return value.toFixed(2);
  } else {
    // この分岐内では value は boolean 型
    return value ? "TRUE" : "FALSE";
  }
}

// 4. オブジェクトの型推論
function createConfig(env: "development" | "production") {
  const baseConfig = {
    apiUrl: "https://api.example.com",
    timeout: 5000
  };
  
  if (env === "development") {
    // 型推論により適切な型が設定される
    return {
      ...baseConfig,
      debug: true,
      apiUrl: "http://localhost:3000"
    };
  }
  
  return {
    ...baseConfig,
    debug: false,
    minify: true
  };
}

// 5. 関数の型推論
const mathOperations = {
  add: (a: number, b: number) => a + b,
  multiply: (a: number, b: number) => a * b,
  // 戻り値の型は自動推論される
  calculate: function(operation: "add" | "multiply", a: number, b: number) {
    return operation === "add" ? this.add(a, b) : this.multiply(a, b);
  }
};

// 使用例
const user = createUser("Alice", 30);
console.log(user.createdAt.getFullYear()); // 型安全にアクセス可能

const stats = processNumbers([1, 2, 3, 4, 5]);
console.log(stats.average); // 3

console.log(processValue("hello")); // "HELLO"
console.log(processValue(3.14159)); // "3.14"

const devConfig = createConfig("development");
console.log(devConfig.debug); // true（型安全）
```

---

## 配列・タプル操作の実践

### ステップ4: 配列とタプルの高度な活用
```typescript
// array-tuple-advanced.ts

// 1. 型安全な配列操作
class TypeSafeArray<T> {
  private items: T[] = [];

  add(item: T): void {
    this.items.push(item);
  }

  get(index: number): T | undefined {
    return this.items[index];
  }

  filter(predicate: (item: T) => boolean): T[] {
    return this.items.filter(predicate);
  }

  map<U>(transform: (item: T) => U): U[] {
    return this.items.map(transform);
  }

  reduce<U>(reducer: (acc: U, item: T) => U, initial: U): U {
    return this.items.reduce(reducer, initial);
  }

  toArray(): readonly T[] {
    return [...this.items];
  }
}

// 2. 座標システム（タプル活用）
type Point2D = [x: number, y: number];
type Point3D = [x: number, y: number, z: number];
type Vector2D = [dx: number, dy: number];

class GeometryUtils {
  static distance2D([x1, y1]: Point2D, [x2, y2]: Point2D): number {
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  }

  static movePoint([x, y]: Point2D, [dx, dy]: Vector2D): Point2D {
    return [x + dx, y + dy];
  }

  static rotatePoint([x, y]: Point2D, angle: number): Point2D {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return [
      x * cos - y * sin,
      x * sin + y * cos
    ];
  }

  static centroid(points: Point2D[]): Point2D {
    const [sumX, sumY] = points.reduce(
      ([accX, accY], [x, y]) => [accX + x, accY + y],
      [0, 0] as Point2D
    );
    return [sumX / points.length, sumY / points.length];
  }

  static boundingBox(points: Point2D[]): [topLeft: Point2D, bottomRight: Point2D] {
    if (points.length === 0) {
      throw new Error("Cannot calculate bounding box for empty array");
    }

    const xs = points.map(([x]) => x);
    const ys = points.map(([, y]) => y);

    return [
      [Math.min(...xs), Math.min(...ys)],
      [Math.max(...xs), Math.max(...ys)]
    ];
  }
}

// 3. データ変換パイプライン
type ParseResult<T> = 
  | { success: true; value: T }
  | { success: false; error: string };

class DataProcessor {
  static parseNumbers(strings: string[]): ParseResult<number[]> {
    const results: number[] = [];
    
    for (const str of strings) {
      const num = parseFloat(str.trim());
      if (isNaN(num)) {
        return {
          success: false,
          error: `Invalid number: "${str}"`
        };
      }
      results.push(num);
    }
    
    return { success: true, value: results };
  }

  static calculateStatistics(numbers: number[]): {
    count: number;
    sum: number;
    mean: number;
    median: number;
    mode: number[];
    range: [min: number, max: number];
  } {
    if (numbers.length === 0) {
      throw new Error("Cannot calculate statistics for empty array");
    }

    const sorted = [...numbers].sort((a, b) => a - b);
    const sum = numbers.reduce((acc, num) => acc + num, 0);
    const mean = sum / numbers.length;

    // 中央値
    const median = sorted.length % 2 === 0
      ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
      : sorted[Math.floor(sorted.length / 2)];

    // 最頻値
    const frequency = new Map<number, number>();
    numbers.forEach(num => {
      frequency.set(num, (frequency.get(num) || 0) + 1);
    });
    
    const maxFreq = Math.max(...frequency.values());
    const mode = Array.from(frequency.entries())
      .filter(([, freq]) => freq === maxFreq)
      .map(([num]) => num);

    return {
      count: numbers.length,
      sum,
      mean,
      median,
      mode,
      range: [sorted[0], sorted[sorted.length - 1]]
    };
  }
}

// 使用例
const stringArray = new TypeSafeArray<string>();
stringArray.add("hello");
stringArray.add("world");
console.log(stringArray.toArray()); // ["hello", "world"]

const points: Point2D[] = [[0, 0], [3, 4], [6, 8]];
console.log("距離:", GeometryUtils.distance2D([0, 0], [3, 4])); // 5
console.log("重心:", GeometryUtils.centroid(points)); // [3, 4]

const parseResult = DataProcessor.parseNumbers(["1", "2.5", "3.7"]);
if (parseResult.success) {
  const stats = DataProcessor.calculateStatistics(parseResult.value);
  console.log("統計:", stats);
}
```

---

## 関数型の実践活用

### ステップ5: 高度な関数型パターン
```typescript
// advanced-function-types.ts

// 1. 関数型インターフェース
interface EventHandler<T = any> {
  (event: T): void;
}

interface Validator<T> {
  (value: T): boolean;
}

interface Transformer<T, U> {
  (input: T): U;
}

// 2. 高階関数の実装
class FunctionalUtils {
  // カリー化関数
  static curry<A, B, C>(fn: (a: A, b: B) => C): (a: A) => (b: B) => C {
    return (a: A) => (b: B) => fn(a, b);
  }

  // 関数合成
  static compose<A, B, C>(
    f: (b: B) => C,
    g: (a: A) => B
  ): (a: A) => C {
    return (a: A) => f(g(a));
  }

  // パイプライン
  static pipe<A, B, C>(
    value: A,
    f1: (a: A) => B,
    f2: (b: B) => C
  ): C {
    return f2(f1(value));
  }

  // メモ化
  static memoize<T extends (...args: any[]) => any>(fn: T): T {
    const cache = new Map();
    
    return ((...args: Parameters<T>): ReturnType<T> => {
      const key = JSON.stringify(args);
      
      if (cache.has(key)) {
        return cache.get(key);
      }
      
      const result = fn(...args);
      cache.set(key, result);
      return result;
    }) as T;
  }

  // デバウンス
  static debounce<T extends (...args: any[]) => any>(
    fn: T,
    delay: number
  ): (...args: Parameters<T>) => void {
    let timeoutId: NodeJS.Timeout;
    
    return (...args: Parameters<T>) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => fn(...args), delay);
    };
  }
}

// 3. バリデーション関数の組み合わせ
type ValidationResult = 
  | { isValid: true }
  | { isValid: false; errors: string[] };

class ValidationBuilder<T> {
  private validators: Array<{
    validator: Validator<T>;
    message: string;
  }> = [];

  addRule(validator: Validator<T>, message: string): this {
    this.validators.push({ validator, message });
    return this;
  }

  validate(value: T): ValidationResult {
    const errors: string[] = [];
    
    for (const { validator, message } of this.validators) {
      if (!validator(value)) {
        errors.push(message);
      }
    }
    
    return errors.length === 0
      ? { isValid: true }
      : { isValid: false, errors };
  }
}

// 4. 関数型プログラミングパターン
class Maybe<T> {
  constructor(private value: T | null | undefined) {}

  static of<T>(value: T | null | undefined): Maybe<T> {
    return new Maybe(value);
  }

  map<U>(fn: (value: T) => U): Maybe<U> {
    return this.value != null
      ? Maybe.of(fn(this.value))
      : Maybe.of(null);
  }

  flatMap<U>(fn: (value: T) => Maybe<U>): Maybe<U> {
    return this.value != null
      ? fn(this.value)
      : Maybe.of(null);
  }

  filter(predicate: (value: T) => boolean): Maybe<T> {
    return this.value != null && predicate(this.value)
      ? this
      : Maybe.of(null);
  }

  getOrElse(defaultValue: T): T {
    return this.value != null ? this.value : defaultValue;
  }

  isPresent(): boolean {
    return this.value != null;
  }
}

// 使用例
const add = (a: number, b: number) => a + b;
const curriedAdd = FunctionalUtils.curry(add);
console.log(curriedAdd(5)(3)); // 8

const double = (x: number) => x * 2;
const addOne = (x: number) => x + 1;
const doubleAndAddOne = FunctionalUtils.compose(addOne, double);
console.log(doubleAndAddOne(5)); // 11

// バリデーション例
const emailValidator = new ValidationBuilder<string>()
  .addRule(email => email.includes("@"), "メールアドレスに@が含まれていません")
  .addRule(email => email.length > 5, "メールアドレスが短すぎます")
  .addRule(email => !email.includes(" "), "メールアドレスにスペースが含まれています");

console.log(emailValidator.validate("test@example.com")); // { isValid: true }
console.log(emailValidator.validate("invalid")); // { isValid: false, errors: [...] }

// Maybe モナド例
const result = Maybe.of("hello")
  .map(s => s.toUpperCase())
  .map(s => s + " WORLD")
  .filter(s => s.length > 5)
  .getOrElse("DEFAULT");

console.log(result); // "HELLO WORLD"
```

---

## 実用的なアプリケーション例

### ステップ6: 型安全なタスク管理システム
```typescript
// task-management-system.ts

// 1. 基本的な型定義
type TaskId = string;
type UserId = string;
type Timestamp = number;

type TaskStatus = "todo" | "in_progress" | "review" | "done";
type TaskPriority = "low" | "medium" | "high" | "urgent";

type Task = {
  readonly id: TaskId;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId: UserId | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  dueDate: Timestamp | null;
  tags: readonly string[];
};

type User = {
  readonly id: UserId;
  name: string;
  email: string;
  role: "admin" | "member" | "viewer";
};

// 2. イベント型定義
type TaskEvent = 
  | { type: "task_created"; task: Task }
  | { type: "task_updated"; taskId: TaskId; changes: Partial<Omit<Task, "id" | "createdAt">> }
  | { type: "task_deleted"; taskId: TaskId }
  | { type: "task_assigned"; taskId: TaskId; assigneeId: UserId }
  | { type: "task_status_changed"; taskId: TaskId; oldStatus: TaskStatus; newStatus: TaskStatus };

// 3. タスク管理システムの実装
class TaskManager {
  private tasks = new Map<TaskId, Task>();
  private users = new Map<UserId, User>();
  private eventHandlers: Array<(event: TaskEvent) => void> = [];

  // ユーザー管理
  addUser(user: Omit<User, "id">): User {
    const newUser: User = {
      id: this.generateId(),
      ...user
    };
    this.users.set(newUser.id, newUser);
    return newUser;
  }

  getUser(userId: UserId): User | undefined {
    return this.users.get(userId);
  }

  // タスク作成
  createTask(
    taskData: Omit<Task, "id" | "createdAt" | "updatedAt">
  ): Task {
    const now = Date.now();
    const task: Task = {
      id: this.generateId(),
      createdAt: now,
      updatedAt: now,
      ...taskData
    };

    this.tasks.set(task.id, task);
    this.emitEvent({ type: "task_created", task });
    return task;
  }

  // タスク更新
  updateTask(
    taskId: TaskId,
    updates: Partial<Omit<Task, "id" | "createdAt">>
  ): Task | null {
    const existingTask = this.tasks.get(taskId);
    if (!existingTask) return null;

    const updatedTask: Task = {
      ...existingTask,
      ...updates,
      updatedAt: Date.now()
    };

    this.tasks.set(taskId, updatedTask);
    this.emitEvent({ type: "task_updated", taskId, changes: updates });

    // ステータス変更の特別なイベント
    if (updates.status && updates.status !== existingTask.status) {
      this.emitEvent({
        type: "task_status_changed",
        taskId,
        oldStatus: existingTask.status,
        newStatus: updates.status
      });
    }

    return updatedTask;
  }

  // タスク削除
  deleteTask(taskId: TaskId): boolean {
    const deleted = this.tasks.delete(taskId);
    if (deleted) {
      this.emitEvent({ type: "task_deleted", taskId });
    }
    return deleted;
  }

  // タスク検索・フィルタリング
  getTasks(filter?: {
    status?: TaskStatus;
    priority?: TaskPriority;
    assigneeId?: UserId;
    tags?: string[];
  }): Task[] {
    let tasks = Array.from(this.tasks.values());

    if (filter) {
      if (filter.status) {
        tasks = tasks.filter(task => task.status === filter.status);
      }
      if (filter.priority) {
        tasks = tasks.filter(task => task.priority === filter.priority);
      }
      if (filter.assigneeId) {
        tasks = tasks.filter(task => task.assigneeId === filter.assigneeId);
      }
      if (filter.tags && filter.tags.length > 0) {
        tasks = tasks.filter(task =>
          filter.tags!.every(tag => task.tags.includes(tag))
        );
      }
    }

    return tasks;
  }

  // 統計情報
  getStatistics(): {
    totalTasks: number;
    tasksByStatus: Record<TaskStatus, number>;
    tasksByPriority: Record<TaskPriority, number>;
    overdueTasks: number;
  } {
    const tasks = Array.from(this.tasks.values());
    const now = Date.now();

    const tasksByStatus = tasks.reduce((acc, task) => {
      acc[task.status] = (acc[task.status] || 0) + 1;
      return acc;
    }, {} as Record<TaskStatus, number>);

    const tasksByPriority = tasks.reduce((acc, task) => {
      acc[task.priority] = (acc[task.priority] || 0) + 1;
      return acc;
    }, {} as Record<TaskPriority, number>);

    const overdueTasks = tasks.filter(task =>
      task.dueDate && task.dueDate < now && task.status !== "done"
    ).length;

    return {
      totalTasks: tasks.length,
      tasksByStatus,
      tasksByPriority,
      overdueTasks
    };
  }

  // イベント処理
  addEventListener(handler: (event: TaskEvent) => void): void {
    this.eventHandlers.push(handler);
  }

  removeEventListener(handler: (event: TaskEvent) => void): void {
    const index = this.eventHandlers.indexOf(handler);
    if (index > -1) {
      this.eventHandlers.splice(index, 1);
    }
  }

  private emitEvent(event: TaskEvent): void {
    this.eventHandlers.forEach(handler => handler(event));
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}

// 使用例
const taskManager = new TaskManager();

// イベントリスナーの設定
taskManager.addEventListener((event) => {
  console.log("Task Event:", event);
});

// ユーザー作成
const user1 = taskManager.addUser({
  name: "田中太郎",
  email: "tanaka@example.com",
  role: "member"
});

const user2 = taskManager.addUser({
  name: "佐藤花子",
  email: "sato@example.com",
  role: "admin"
});

// タスク作成
const task1 = taskManager.createTask({
  title: "TypeScript学習",
  description: "Step02の内容を完了する",
  status: "todo",
  priority: "high",
  assigneeId: user1.id,
  dueDate: Date.now() + 7 * 24 * 60 * 60 * 1000, // 1週間後
  tags: ["学習", "TypeScript"]
});

const task2 = taskManager.createTask({
  title: "コードレビュー",
  description: "プルリクエストのレビューを行う",
  status: "in_progress",
  priority: "medium",
  assigneeId: user2.id,
  dueDate: null,
  tags: ["レビュー", "開発"]
});

// タスク更新
taskManager.updateTask(task1.id, {
  status: "in_progress",
  description: "Step02の演習問題に取り組み中"
});

// 統計情報の表示
console.log("統計情報:", taskManager.getStatistics());

// フィルタリング
const highPriorityTasks = taskManager.getTasks({ priority: "high" });
console.log("高優先度タスク:", highPriorityTasks);

const user1Tasks = taskManager.getTasks({ assigneeId: user1.id });
console.log("田中さんのタスク:", user1Tasks);
```

---

## 🎯 実行とテストの方法

### 基本的な実行方法
```bash
# TypeScriptファイルをコンパイルして実行
npx tsc filename.ts
node filename.js

# ts-nodeを使って直接実行
npx ts-node filename.ts
```

### 型チェックの確認
```bash
# 型チェックのみ実行（ファイル出力なし）
npx tsc --noEmit filename.ts

# 詳細なエラー情報を表示
npx tsc --noEmit --pretty filename.ts
```

### 開発用の設定
```json
// package.json にスクリプトを追加
{
  "scripts": {
    "dev": "ts-node src/index.ts",
    "build": "tsc",
    "type-check": "tsc --noEmit",
    "watch": "tsc --watch"
  }
}
```

---

## 📚 学習の進め方

1. **段階的に進める**: 基本的な型から始めて、徐々に複雑な型システムに挑戦
2. **実際に動かす**: コードをコピーして実際に実行してみる
3. **改造してみる**: 既存のコードを改造して理解を深める
4. **型エラーを確認**: 意図的に型エラーを発生させて、エラーメッセージを理解する
5. **実用例を作成**: 学習した内容を使って実用的なアプリケーションを作成する

---

**📌 重要**: これらのコード例は実際に動作するものです。コピーして実行し、改造して理解を深めてください。TypeScriptの型システムの強力さと柔軟性を実感できるはずです。