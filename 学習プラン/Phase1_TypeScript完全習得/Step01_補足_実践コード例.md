# Step01 実践コード例

> 💡 **このファイルについて**: 段階的な学習のためのコード例集です。Hello Worldから始めて徐々に複雑なコードに挑戦できます。

## 📋 目次
1. [Hello World から始める段階的学習](#hello-world-から始める段階的学習)
2. [型注釈の練習](#型注釈の練習)
3. [より実践的な例](#より実践的な例)

---

## Hello World から始める段階的学習

### ステップ1: 最初のTypeScriptファイル
```typescript
// hello.ts
function greet(name: string): string {
  return `Hello, ${name}!`;
}

console.log(greet("TypeScript"));
```

**実行方法**:
```bash
# コンパイル
npx tsc hello.ts

# 実行
node hello.js
```

**学習ポイント**:
- 関数の引数に型注釈 `name: string`
- 戻り値の型注釈 `: string`
- テンプレートリテラルの使用

---

## 型注釈の練習

### ステップ2: 基本的な型注釈
```typescript
// types-practice.ts

// 基本型
let userName: string = "Alice";
let userAge: number = 30;
let isActive: boolean = true;

// 配列
let numbers: number[] = [1, 2, 3, 4, 5];
let names: string[] = ["Alice", "Bob", "Charlie"];

// 代替記法
let scores: Array<number> = [85, 92, 78, 96];

// オブジェクト
let user: {
  name: string;
  age: number;
  email: string;
} = {
  name: "Alice",
  age: 30,
  email: "alice@example.com"
};

// 関数
function calculateArea(width: number, height: number): number {
  return width * height;
}

function logMessage(message: string): void {
  console.log(message);
}

// アロー関数
const multiply = (a: number, b: number): number => a * b;
const isEven = (num: number): boolean => num % 2 === 0;

// 使用例
console.log(`User: ${user.name}, Age: ${user.age}`);
console.log(`Area: ${calculateArea(10, 20)}`);
logMessage("TypeScript is great!");
console.log(`5 * 3 = ${multiply(5, 3)}`);
console.log(`Is 4 even? ${isEven(4)}`);
```

**学習ポイント**:
- 基本型の型注釈（string, number, boolean）
- 配列の型注釈（2つの記法）
- オブジェクトの型注釈
- 関数の引数と戻り値の型注釈
- void型の使用

### ステップ3: 型推論の活用
```typescript
// type-inference.ts

// 型推論の例
let message = "Hello"; // string型として推論
let count = 42; // number型として推論
let isValid = true; // boolean型として推論

// 配列の型推論
let inferredNumbers = [1, 2, 3]; // number[]として推論
let mixedArray = [1, "hello", true]; // (string | number | boolean)[]として推論

// 関数の戻り値型推論
function add(a: number, b: number) {
  return a + b; // number型として推論
}

// オブジェクトの型推論
let inferredUser = {
  name: "Bob",
  age: 25
}; // { name: string; age: number; }として推論

// 型推論 vs 明示的型注釈の比較
let value1 = "hello"; // 型推論: string
let value2: string = "hello"; // 明示的型注釈: string

console.log("型推論の例:");
console.log(`message: ${message} (型: ${typeof message})`);
console.log(`count: ${count} (型: ${typeof count})`);
console.log(`isValid: ${isValid} (型: ${typeof isValid})`);
console.log(`add(5, 3): ${add(5, 3)}`);
console.log(`inferredUser:`, inferredUser);
```

**学習ポイント**:
- TypeScriptの型推論機能
- 明示的型注釈と型推論の使い分け
- Union型の自動推論

---

## より実践的な例

### ステップ4: 学生管理システム
```typescript
// student-manager.ts

// 型定義
type Student = {
  id: number;
  name: string;
  age: number;
  grades: number[];
};

// 学生管理クラス
class StudentManager {
  private students: Student[] = [];
  private nextId: number = 1;

  // 学生を追加
  addStudent(name: string, age: number): Student {
    const newStudent: Student = {
      id: this.nextId++,
      name,
      age,
      grades: []
    };
    
    this.students.push(newStudent);
    console.log(`学生を追加しました: ${newStudent.name} (ID: ${newStudent.id})`);
    return newStudent;
  }

  // 成績を追加
  addGrade(studentId: number, grade: number): boolean {
    const student = this.students.find(s => s.id === studentId);
    if (student) {
      student.grades.push(grade);
      console.log(`${student.name}の成績を追加しました: ${grade}点`);
      return true;
    }
    console.log(`ID ${studentId}の学生が見つかりません`);
    return false;
  }

  // 平均点を計算
  getAverage(studentId: number): number {
    const student = this.students.find(s => s.id === studentId);
    if (student && student.grades.length > 0) {
      const sum = student.grades.reduce((acc, grade) => acc + grade, 0);
      return Math.round((sum / student.grades.length) * 100) / 100; // 小数点第2位まで
    }
    return 0;
  }

  // 全学生を取得
  getAllStudents(): Student[] {
    return [...this.students]; // イミュータブルなコピーを返す
  }

  // 学生を検索
  findStudentById(id: number): Student | null {
    return this.students.find(student => student.id === id) || null;
  }

  // 成績上位者を取得
  getTopStudents(limit: number = 3): Student[] {
    return this.students
      .filter(student => student.grades.length > 0)
      .sort((a, b) => this.getAverage(b.id) - this.getAverage(a.id))
      .slice(0, limit);
  }

  // 統計情報を表示
  displayStatistics(): void {
    console.log("\n=== 学生管理システム統計 ===");
    console.log(`総学生数: ${this.students.length}人`);
    
    const studentsWithGrades = this.students.filter(s => s.grades.length > 0);
    console.log(`成績登録済み: ${studentsWithGrades.length}人`);
    
    if (studentsWithGrades.length > 0) {
      const allAverages = studentsWithGrades.map(s => this.getAverage(s.id));
      const overallAverage = allAverages.reduce((sum, avg) => sum + avg, 0) / allAverages.length;
      console.log(`全体平均点: ${Math.round(overallAverage * 100) / 100}点`);
      
      console.log("\n成績上位者:");
      this.getTopStudents().forEach((student, index) => {
        console.log(`${index + 1}位: ${student.name} (平均: ${this.getAverage(student.id)}点)`);
      });
    }
    console.log("========================\n");
  }
}

// 使用例
const manager = new StudentManager();

// 学生を追加
const alice = manager.addStudent("Alice", 20);
const bob = manager.addStudent("Bob", 19);
const charlie = manager.addStudent("Charlie", 21);

// 成績を追加
manager.addGrade(alice.id, 85);
manager.addGrade(alice.id, 92);
manager.addGrade(alice.id, 78);

manager.addGrade(bob.id, 90);
manager.addGrade(bob.id, 88);

manager.addGrade(charlie.id, 95);
manager.addGrade(charlie.id, 89);
manager.addGrade(charlie.id, 93);

// 結果を表示
console.log(`\nAliceの平均点: ${manager.getAverage(alice.id)}点`);
console.log(`Bobの平均点: ${manager.getAverage(bob.id)}点`);
console.log(`Charlieの平均点: ${manager.getAverage(charlie.id)}点`);

// 統計情報を表示
manager.displayStatistics();

// 全学生の情報を表示
console.log("全学生の詳細情報:");
manager.getAllStudents().forEach(student => {
  console.log(`- ${student.name} (${student.age}歳): 成績 [${student.grades.join(', ')}]`);
});
```

**学習ポイント**:
- type エイリアスの使用
- クラスの実装
- private メンバーの使用
- 配列操作メソッド（find, filter, sort, slice）
- イミュータブルな操作（スプレッド演算子）
- null 許容型の使用

### ステップ5: タスク管理アプリケーション
```typescript
// task-manager.ts

// タスクの状態を表すenum
enum TaskStatus {
  PENDING = "pending",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed"
}

// タスクの優先度を表すenum
enum Priority {
  LOW = 1,
  MEDIUM = 2,
  HIGH = 3,
  URGENT = 4
}

// タスクの型定義
type Task = {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  priority: Priority;
  createdAt: Date;
  updatedAt: Date;
  dueDate?: Date; // オプショナルプロパティ
};

// タスク管理クラス
class TaskManager {
  private tasks: Task[] = [];
  private nextId: number = 1;

  // タスクを作成
  createTask(
    title: string, 
    description: string, 
    priority: Priority = Priority.MEDIUM,
    dueDate?: Date
  ): Task {
    const now = new Date();
    const newTask: Task = {
      id: this.nextId++,
      title,
      description,
      status: TaskStatus.PENDING,
      priority,
      createdAt: now,
      updatedAt: now,
      dueDate
    };

    this.tasks.push(newTask);
    console.log(`タスクを作成しました: "${newTask.title}"`);
    return newTask;
  }

  // タスクのステータスを更新
  updateTaskStatus(id: number, status: TaskStatus): boolean {
    const task = this.findTaskById(id);
    if (task) {
      task.status = status;
      task.updatedAt = new Date();
      console.log(`タスク "${task.title}" のステータスを ${status} に更新しました`);
      return true;
    }
    console.log(`ID ${id} のタスクが見つかりません`);
    return false;
  }

  // タスクを削除
  deleteTask(id: number): boolean {
    const index = this.tasks.findIndex(task => task.id === id);
    if (index !== -1) {
      const deletedTask = this.tasks.splice(index, 1)[0];
      console.log(`タスク "${deletedTask.title}" を削除しました`);
      return true;
    }
    console.log(`ID ${id} のタスクが見つかりません`);
    return false;
  }

  // タスクを検索
  findTaskById(id: number): Task | undefined {
    return this.tasks.find(task => task.id === id);
  }

  // ステータス別にタスクを取得
  getTasksByStatus(status: TaskStatus): Task[] {
    return this.tasks.filter(task => task.status === status);
  }

  // 優先度別にタスクを取得
  getTasksByPriority(priority: Priority): Task[] {
    return this.tasks.filter(task => task.priority === priority);
  }

  // 期限切れのタスクを取得
  getOverdueTasks(): Task[] {
    const now = new Date();
    return this.tasks.filter(task => 
      task.dueDate && 
      task.dueDate < now && 
      task.status !== TaskStatus.COMPLETED
    );
  }

  // タスクを優先度順にソート
  getTasksSortedByPriority(): Task[] {
    return [...this.tasks].sort((a, b) => b.priority - a.priority);
  }

  // 全タスクを取得
  getAllTasks(): Task[] {
    return [...this.tasks];
  }

  // タスクの統計情報を表示
  displayStatistics(): void {
    console.log("\n=== タスク管理統計 ===");
    console.log(`総タスク数: ${this.tasks.length}`);
    
    Object.values(TaskStatus).forEach(status => {
      const count = this.getTasksByStatus(status).length;
      console.log(`${status}: ${count}件`);
    });

    const overdueTasks = this.getOverdueTasks();
    if (overdueTasks.length > 0) {
      console.log(`期限切れ: ${overdueTasks.length}件`);
    }
    console.log("==================\n");
  }

  // タスク一覧を表示
  displayTasks(): void {
    if (this.tasks.length === 0) {
      console.log("タスクがありません");
      return;
    }

    console.log("\n=== タスク一覧 ===");
    this.getTasksSortedByPriority().forEach(task => {
      const priorityText = this.getPriorityText(task.priority);
      const statusText = this.getStatusText(task.status);
      const dueDateText = task.dueDate ? 
        ` (期限: ${task.dueDate.toLocaleDateString()})` : '';
      
      console.log(`[${task.id}] ${task.title} - ${priorityText} - ${statusText}${dueDateText}`);
      console.log(`    ${task.description}`);
    });
    console.log("================\n");
  }

  // 優先度のテキスト表現を取得
  private getPriorityText(priority: Priority): string {
    switch (priority) {
      case Priority.LOW: return "低";
      case Priority.MEDIUM: return "中";
      case Priority.HIGH: return "高";
      case Priority.URGENT: return "緊急";
      default: return "不明";
    }
  }

  // ステータスのテキスト表現を取得
  private getStatusText(status: TaskStatus): string {
    switch (status) {
      case TaskStatus.PENDING: return "未着手";
      case TaskStatus.IN_PROGRESS: return "進行中";
      case TaskStatus.COMPLETED: return "完了";
      default: return "不明";
    }
  }
}

// 使用例
const taskManager = new TaskManager();

// タスクを作成
const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);

const nextWeek = new Date();
nextWeek.setDate(nextWeek.getDate() + 7);

taskManager.createTask(
  "TypeScript学習", 
  "Step01の内容を完了する", 
  Priority.HIGH, 
  tomorrow
);

taskManager.createTask(
  "演習問題", 
  "基本的な型注釈の練習", 
  Priority.MEDIUM
);

taskManager.createTask(
  "環境構築", 
  "開発環境のセットアップ", 
  Priority.URGENT,
  nextWeek
);

taskManager.createTask(
  "ドキュメント作成", 
  "学習ノートの整理", 
  Priority.LOW
);

// タスクの操作
taskManager.updateTaskStatus(1, TaskStatus.IN_PROGRESS);
taskManager.updateTaskStatus(3, TaskStatus.COMPLETED);

// 結果を表示
taskManager.displayTasks();
taskManager.displayStatistics();

// 特定の条件でタスクを検索
console.log("高優先度のタスク:");
taskManager.getTasksByPriority(Priority.HIGH).forEach(task => {
  console.log(`- ${task.title}`);
});

console.log("\n進行中のタスク:");
taskManager.getTasksByStatus(TaskStatus.IN_PROGRESS).forEach(task => {
  console.log(`- ${task.title}`);
});
```

**学習ポイント**:
- enum の使用
- オプショナルプロパティ（?）
- Date オブジェクトの操作
- private メソッドの使用
- switch 文の使用
- 配列の高度な操作（sort, filter の組み合わせ）
- デフォルト引数の使用

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

### 開発用の設定
```bash
# package.jsonにスクリプトを追加
{
  "scripts": {
    "dev": "ts-node src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js"
  }
}

# 実行
npm run dev
```

---

## 📚 学習の進め方

1. **段階的に進める**: Hello Worldから始めて、徐々に複雑なコードに挑戦
2. **実際に動かす**: コードをコピーして実際に実行してみる
3. **改造してみる**: 既存のコードを改造して理解を深める
4. **エラーを恐れない**: エラーメッセージから学ぶ
5. **型注釈を意識する**: 常に型を意識してコードを書く

---

**📌 重要**: これらのコード例は実際に動作するものです。コピーして実行し、改造して理解を深めてください。TypeScriptの型システムの恩恵を実感できるはずです。