# Step 1: JavaScript 復習と TypeScript 導入

> 💡 **補足資料**: 詳細な解説は以下の補足資料を見てね 🐰
>
> - 📖 [専門用語集](./Step01_補足_専門用語集.md) - 重要な概念と用語の詳細解説
> - 🛠️ [開発環境ガイド](./Step01_補足_開発環境ガイド.md) - 環境構築と設定方法
> - ⚙️ [設定ファイル解説](./Step01_補足_設定ファイル解説.md) - tsconfig.json 等の詳細設定
> - 💻 [実践コード例](./Step01_補足_実践コード例.md) - 段階的な学習用コード集
> - 🚨 [トラブルシューティング](./Step01_補足_トラブルシューティング.md) - よくあるエラーと解決方法
> - 📚 [参考リソース](./Step01_補足_参考リソース.md) - 学習に役立つリンク集

## 📅 学習期間・目標

**期間**: Step 1
**総学習時間**: 3 時間
**学習スタイル**: 理論 20% + 実践コード 50% + 演習 30%

### 🎯 Step 1 到達目標

- [ ] JavaScript 基礎の復習と確認
- [ ] TypeScript 開発環境の構築
- [ ] 基本的な型注釈の理解と実践
- [ ] 簡単な TypeScript アプリケーションの作成
- [ ] 他言語との比較による TypeScript 特徴の理解

## 📚 理論学習内容

### Day 1-2: JavaScript 基礎復習

#### 🔍 多言語経験者向け JavaScript 特徴

```javascript
// 1. 動的型付けの特徴（他言語との比較）
// Java/C#: コンパイル時型チェック
// Python: 実行時型チェック
// JavaScript: 型チェックなし

let value = 42; // number
value = "hello"; // string (型変更可能)
value = true; // boolean (型変更可能)
value = [1, 2, 3]; // array (型変更可能)

// 2. プロトタイプベースオブジェクト指向
// Java/C#: クラスベース
// JavaScript: プロトタイプベース
// 💡 詳細解説: プロトタイプベースオブジェクト指向 → Step01_補足_専門用語集.md#プロトタイプベースオブジェクト指向

function Person(name) {
  this.name = name;
}
Person.prototype.greet = function () {
  return `Hello, I'm ${this.name}`;
};

const person = new Person("Alice");
console.log(person.greet()); // "Hello, I'm Alice"

// 3. 関数型プログラミング要素
// 高階関数、クロージャ、イミュータブル操作
// 💡 詳細解説: 高階関数 → Step01_補足_専門用語集.md#高階関数
// 💡 詳細解説: クロージャ → Step01_補足_専門用語集.md#クロージャ
// 💡 詳細解説: イミュータブル操作 → Step01_補足_専門用語集.md#イミュータブル操作
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map((n) => n * 2);
const evens = numbers.filter((n) => n % 2 === 0);
const sum = numbers.reduce((acc, n) => acc + n, 0);

// 4. 非同期プログラミング
// Promise、async/await
// 💡 詳細解説: Promise → Step01_補足_専門用語集.md#promise
// 💡 詳細解説: async/await → Step01_補足_専門用語集.md#asyncawait
async function fetchData(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

// 5. ES6+モダン構文
// 分割代入、スプレッド演算子、テンプレートリテラル
// 💡 詳細解説: 分割代入 → Step01_補足_専門用語集.md#分割代入destructuring
// 💡 詳細解説: スプレッド演算子 → Step01_補足_専門用語集.md#スプレッド演算子spread-operator
// 💡 詳細解説: テンプレートリテラル → Step01_補足_専門用語集.md#テンプレートリテラルtemplate-literals
const user = { name: "Bob", age: 30, email: "bob@example.com" };
const { name, age } = user;
const newUser = { ...user, age: 31 };
const message = `User ${name} is ${age} years old`;
```

#### 🚨 JavaScript の型関連の問題点

```javascript
// 1. 暗黙的型変換による予期しない動作
console.log("5" + 3); // "53" (文字列結合)
console.log("5" - 3); // 2 (数値減算)
console.log(true + 1); // 2
console.log([] + []); // "" (空文字列)
console.log({} + []); // "[object Object]"

// 2. undefined/nullの混在
let data;
console.log(data); // undefined
console.log(data.name); // TypeError: Cannot read property 'name' of undefined

function getUser(id) {
  if (id > 0) {
    return { id, name: "User" };
  }
  // 暗黙的にundefinedを返す
}

// 3. 関数パラメータの型不明
function calculateArea(width, height) {
  return width * height; // width, heightが数値である保証がない
}

calculateArea("10", "20"); // "1020" (文字列結合)
calculateArea(10); // NaN (heightがundefined)

// 4. オブジェクトプロパティの存在不明
function processUser(user) {
  return user.profile.avatar.url; // 各プロパティの存在が不明
}

// 5. 配列要素の型不統一
const mixedArray = [1, "hello", true, { name: "test" }, null];
mixedArray.forEach((item) => {
  console.log(item.toUpperCase()); // 文字列以外でエラー
});
```

### Day 3-4: TypeScript 導入と環境構築

#### 🛠️ 開発環境構築

```bash
# 1. Node.js確認（LTS版推奨）
node --version  # v18.x.x以上

# 2. TypeScript グローバルインストール
npm install -g typescript
tsc --version   # 5.x.x以上

# 3. プロジェクト初期化
mkdir typescript-learning
cd typescript-learning
npm init -y

# 4. TypeScript設定
npm install -D typescript @types/node ts-node
npx tsc --init

# 5. 開発用ツール
npm install -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
npm install -D prettier
npm install -D nodemon
```

#### 📝 tsconfig.json 設定（初心者向け）

> 💡 **詳細解説**: tsconfig.json の各オプションの詳細は [Step01\_補足\_設定ファイル解説.md#tsconfigjson 設定詳細](./Step01_補足_設定ファイル解説.md#tsconfigjson設定詳細) を見てね 🐰

```json
{
  "compilerOptions": {
    // 基本設定
    "target": "ES2020", // 出力するJavaScriptのバージョン
    "module": "commonjs", // モジュールシステム
    "lib": ["ES2020", "DOM"], // 使用可能なライブラリ
    "outDir": "./dist", // 出力ディレクトリ
    "rootDir": "./src", // ソースディレクトリ

    // 型チェック設定（段階的に厳しく）
    "strict": false, // Week1は緩い設定から開始
    "noImplicitAny": true, // any型の暗黙的使用を禁止
    "strictNullChecks": false, // Week2で有効化予定
    "strictFunctionTypes": false, // Week3で有効化予定

    // モジュール解決
    "moduleResolution": "node",
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "forceConsistentCasingInFileNames": true,

    // 開発支援
    "sourceMap": true, // デバッグ用ソースマップ
    "declaration": true, // 型定義ファイル生成
    "removeComments": false, // コメント保持
    "skipLibCheck": true // ライブラリの型チェックスキップ
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

#### 🎯 TypeScript の基本概念

```typescript
// 1. 型注釈の基本
// JavaScript
let message = "Hello World";

// TypeScript
let message: string = "Hello World";

// 2. 型推論の活用
// 💡 詳細解説: 型推論 → Step01_補足_専門用語集.md#型推論type-inference
let inferredString = "Hello"; // string型として推論
let inferredNumber = 42; // number型として推論
let inferredBoolean = true; // boolean型として推論

// 3. 基本的な型
let userName: string = "Alice";
let userAge: number = 30;
let isActive: boolean = true;
let userData: null = null;
let notDefined: undefined = undefined;

// 4. 配列の型注釈
let numbers: number[] = [1, 2, 3, 4, 5];
let names: string[] = ["Alice", "Bob", "Charlie"];
let flags: boolean[] = [true, false, true];

// 代替記法
let scores: Array<number> = [85, 92, 78, 96];

// 5. オブジェクトの型注釈
let user: {
  name: string;
  age: number;
  email: string;
} = {
  name: "Alice",
  age: 30,
  email: "alice@example.com",
};

// 6. 関数の型注釈
function greet(name: string): string {
  return `Hello, ${name}!`;
}

function add(a: number, b: number): number {
  return a + b;
}

function logMessage(message: string): void {
  console.log(message);
}

// 7. アロー関数の型注釈
const multiply = (a: number, b: number): number => a * b;
const isEven = (num: number): boolean => num % 2 === 0;
```

### Day 5-7: 実践的な TypeScript 活用

#### 🔧 他言語との比較学習

```typescript
// Java/C#との比較
// Java: 厳密なクラス定義が必要
// public class User {
//   private String name;
//   private int age;
//   public User(String name, int age) { ... }
//   public String getName() { return name; }
// }

// TypeScript: より柔軟な型システム
// 1. オブジェクトリテラル型でも表現可能
const user1: { name: string; age: number } = { name: "Alice", age: 30 };

// 2. インターフェースでも表現可能
interface IUser {
  name: string;
  age: number;
}
const user2: IUser = { name: "Bob", age: 25 };

// 3. クラスでも表現可能（Java/C#と同様）
class User {
  private name: string;
  private age: number;

  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }

  public getName(): string {
    return this.name;
  }

  public getAge(): number {
    return this.age;
  }
}

// 4. 型エイリアスでも表現可能
type UserType = {
  name: string;
  age: number;
};
const user3: UserType = { name: "Charlie", age: 35 };

// Java/C#では必ずクラス定義が必要だが、
// TypeScriptは用途に応じて最適な型定義方法を選択できる

// Python との比較
// Python: 実行時型チェック（型ヒントは任意）
// from typing import List
// def process_data(data: List[int]) -> int:
//     return sum(data)
//
// # Pythonでは以下も実行時エラーにならない
// process_data(["1", "2", "3"])  # 実行時にTypeErrorが発生

// TypeScript: コンパイル時型チェック（厳密）
function processData(data: number[]): number {
  return data.reduce((sum, num) => sum + num, 0);
}

// TypeScriptでは以下はコンパイル時にエラー
// processData(["1", "2", "3"]);  // Error: Argument of type 'string[]' is not assignable to parameter of type 'number[]'

// Pythonとの違い：
// 1. TypeScriptはコンパイル時に型エラーを検出
// 2. Pythonの型ヒントは実行時には無視される
// 3. TypeScriptは型安全性がより厳密に保証される

// Go との比較
// Go: 複数戻り値でエラーハンドリング
// func GetUser(id int) (*User, error) {
//     if id <= 0 {
//         return nil, errors.New("invalid id")
//     }
//     return &User{Name: "User"}, nil
// }
//
// user, err := GetUser(1)
// if err != nil {
//     // エラー処理
// }

// TypeScript: Union型やnull許容型でエラーハンドリング
function getUser(id: number): User | null {
  if (id > 0) {
    return new User("User", 25);
  }
  return null; // Goのnilに相当
}

// より明示的なエラーハンドリング（Goスタイルに近い）
function getUserWithError(id: number): {
  user: User | null;
  error: string | null;
} {
  if (id <= 0) {
    return { user: null, error: "invalid id" };
  }
  return { user: new User("User", 25), error: null };
}

// 使用例
const result = getUserWithError(1);
if (result.error) {
  // エラー処理（Goのif err != nilパターンに似ている）
  console.error(result.error);
} else {
  // 正常処理
  console.log(result.user?.getName());
}

// Rust との比較
// Rust: 型安全なOption<T>とResult<T, E>
// enum Option<T> { Some(T), None }
// enum Result<T, E> { Ok(T), Err(E) }
//
// fn divide(a: f64, b: f64) -> Result<f64, String> {
//     if b == 0.0 {
//         Err("Division by zero".to_string())
//     } else {
//         Ok(a / b)
//     }
// }

// TypeScript: Union型でRustのResult型を模倣
type Result<T, E> =
  | { success: true; data: T } // Rustの Ok(T) に相当
  | { success: false; error: E }; // Rustの Err(E) に相当

function divide(a: number, b: number): Result<number, string> {
  if (b === 0) {
    return { success: false, error: "Division by zero" };
  }
  return { success: true, data: a / b };
}

// Rustスタイルの使用（パターンマッチング風）
const divisionResult = divide(10, 2);
if (divisionResult.success) {
  console.log(`結果: ${divisionResult.data}`); // 型安全にアクセス
} else {
  console.error(`エラー: ${divisionResult.error}`);
}

// 違いの要点：
// Go: 複数戻り値による慣習的エラーハンドリング
// Rust: 型システムによる強制的エラーハンドリング
// TypeScript: 柔軟なUnion型による表現力の高いエラーハンドリング
```

## 🎯 実践演習

### 演習 1-1: 基本的な型注釈練習 🔰

```typescript
// 以下のJavaScriptコードにTypeScriptの型注釈を追加してください

// JavaScript版
function calculateBMI(weight, height) {
  return weight / (height * height);
}

function getGrade(score) {
  if (score >= 90) return "A";
  if (score >= 80) return "B";
  if (score >= 70) return "C";
  if (score >= 60) return "D";
  return "F";
}

function createUser(name, age, email) {
  return {
    name: name,
    age: age,
    email: email,
    createdAt: new Date(),
  };
}
```

<details>
<summary>💡 解答例を表示</summary>

```typescript
// TypeScript版（解答例）
function calculateBMI(weight: number, height: number): number {
  return weight / (height * height);
}

function getGrade(score: number): string {
  if (score >= 90) return "A";
  if (score >= 80) return "B";
  if (score >= 70) return "C";
  if (score >= 60) return "D";
  return "F";
}

function createUser(
  name: string,
  age: number,
  email: string
): {
  name: string;
  age: number;
  email: string;
  createdAt: Date;
} {
  return {
    name: name,
    age: age,
    email: email,
    createdAt: new Date(),
  };
}
```

</details>

### 演習 1-2: 配列とオブジェクトの型注釈 🔶

```typescript
// 以下の要件を満たすTypeScriptコードを作成してください

// 1. 学生情報を管理するシステム
// 要件:
// - 学生は名前、年齢、成績（数値の配列）を持つ
// - 学生の平均点を計算する関数
// - 学生のリストから特定の条件で検索する関数
```

<details>
<summary>💡 解答例を表示</summary>

```typescript
// 解答例
type Student = {
  name: string;
  age: number;
  grades: number[];
};

function calculateAverage(grades: number[]): number {
  if (grades.length === 0) return 0;
  const sum = grades.reduce((acc, grade) => acc + grade, 0);
  return sum / grades.length;
}

function findStudentsByMinAge(students: Student[], minAge: number): Student[] {
  return students.filter((student) => student.age >= minAge);
}

function getTopStudent(students: Student[]): Student | null {
  if (students.length === 0) return null;

  return students.reduce((topStudent, currentStudent) => {
    const currentAvg = calculateAverage(currentStudent.grades);
    const topAvg = calculateAverage(topStudent.grades);
    return currentAvg > topAvg ? currentStudent : topStudent;
  });
}

// 使用例
const students: Student[] = [
  { name: "Alice", age: 20, grades: [85, 92, 78, 96] },
  { name: "Bob", age: 19, grades: [76, 84, 88, 92] },
  { name: "Charlie", age: 21, grades: [94, 89, 91, 87] },
];

console.log("平均点:", calculateAverage(students[0].grades));
console.log("20歳以上の学生:", findStudentsByMinAge(students, 20));
console.log("トップ学生:", getTopStudent(students));
```

</details>

### 演習 1-3: 実用的なアプリケーション作成 🔥

```typescript
// シンプルなタスク管理アプリケーションを作成してください
// 要件:
// 1. タスクの追加、完了、削除機能
// 2. タスクの一覧表示
// 3. 完了済みタスクのフィルタリング
```

<details>
<summary>💡 解答例を表示</summary>

```typescript
// 解答例
type Task = {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  createdAt: Date;
};

class TaskManager {
  private tasks: Task[] = [];
  private nextId: number = 1;

  addTask(title: string, description: string): Task {
    const newTask: Task = {
      id: this.nextId++,
      title: title,
      description: description,
      completed: false,
      createdAt: new Date(),
    };

    this.tasks.push(newTask);
    return newTask;
  }

  completeTask(id: number): boolean {
    const task = this.tasks.find((t) => t.id === id);
    if (task) {
      task.completed = true;
      return true;
    }
    return false;
  }

  deleteTask(id: number): boolean {
    const index = this.tasks.findIndex((t) => t.id === id);
    if (index !== -1) {
      this.tasks.splice(index, 1);
      return true;
    }
    return false;
  }

  getAllTasks(): Task[] {
    return [...this.tasks];
  }

  getCompletedTasks(): Task[] {
    return this.tasks.filter((task) => task.completed);
  }

  getPendingTasks(): Task[] {
    return this.tasks.filter((task) => !task.completed);
  }

  getTaskById(id: number): Task | null {
    return this.tasks.find((task) => task.id === id) || null;
  }
}

// 使用例
const taskManager = new TaskManager();

// タスク追加
taskManager.addTask("TypeScript学習", "Week1の内容を完了する");
taskManager.addTask("演習問題", "基本的な型注釈の練習");
taskManager.addTask("環境構築", "開発環境のセットアップ");

// タスク操作
taskManager.completeTask(1);
console.log("全タスク:", taskManager.getAllTasks());
console.log("完了済み:", taskManager.getCompletedTasks());
console.log("未完了:", taskManager.getPendingTasks());
```

</details>

## 📊 Step 1 評価基準

### 理解度チェックリスト

#### JavaScript 復習 (25%)

- [ ] ES6+のモダン構文を理解している
- [ ] 非同期プログラミング（Promise/async-await）を理解している
- [ ] 関数型プログラミングの基本を理解している
- [ ] JavaScript の型関連の問題点を説明できる

#### TypeScript 基礎 (35%)

- [ ] 基本的な型注釈を正しく書ける
- [ ] 型推論の仕組みを理解している
- [ ] 関数の型注釈を適切に設定できる
- [ ] 配列とオブジェクトの型を定義できる

#### 開発環境 (20%)

- [ ] TypeScript 開発環境を構築できる
- [ ] tsconfig.json の基本設定を理解している
- [ ] TypeScript コンパイルを実行できる
- [ ] 基本的なデバッグができる

#### 実践応用 (20%)

- [ ] 簡単なクラスを型安全に実装できる
- [ ] 実用的な関数を型注釈付きで作成できる
- [ ] 基本的なアプリケーションを作成できる
- [ ] 他言語との違いを説明できる

### 成果物チェックリスト

- [ ] **開発環境**: TypeScript 開発環境の完全構築
- [ ] **基本アプリ**: タスク管理アプリケーション
- [ ] **型注釈練習集**: 20 個以上の関数に型注釈
- [ ] **比較ドキュメント**: 他言語との比較まとめ

## 🔄 Step 2 への準備

### 次週学習内容の予習

```typescript
// Step 2で学習する内容の基礎概念
// 以下のコードを読んで理解しておくこと

// 1. より詳細な型システム
let value: string | number = "hello"; // Union型
value = 42; // OK

// 2. オプショナルプロパティ
interface User {
  name: string;
  age?: number; // オプショナル
}

// 3. 型エイリアス
type ID = string | number;
type UserRole = "admin" | "user" | "guest";

// 4. 関数オーバーロード
function format(value: string): string;
function format(value: number): string;
function format(value: string | number): string {
  return String(value);
}
```

### 環境準備

- [ ] VS Code TypeScript 拡張機能の設定
- [ ] ESLint 設定の確認
- [ ] Prettier 設定の確認
- [ ] Git リポジトリの初期化

### 学習継続のコツ

1. **毎日コードを書く**: 理論だけでなく実際にコードを書く
2. **エラーを恐れない**: エラーメッセージから学ぶ
3. **他言語と比較**: 既存知識を活用した理解
4. **小さく始める**: 複雑な機能より基本の確実な理解

---

**📌 重要**: Step 1 は TypeScript の基礎固めの重要な期間です。JavaScript 経験を活かしながら、TypeScript の型システムの恩恵を実感できるようになります。焦らず確実に基礎を身につけましょう。

**🌟 次週は、より詳細な型システムと実践的な型注釈について学習します！**
