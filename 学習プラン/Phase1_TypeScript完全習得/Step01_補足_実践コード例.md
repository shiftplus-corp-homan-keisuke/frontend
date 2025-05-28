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

> 💡 **このセクションについて**: TypeScriptの基本的な型注釈を学んだ後の、実践的なアプリケーション開発を体験するセクションです。

### 🎯 学習目標と前提知識

**🎯 このセクションで身につけること**:
- 実際のアプリケーション開発での型注釈の活用
- クラス設計とオブジェクト指向プログラミングの基礎
- TypeScriptの型システムがもたらす開発効率の向上
- 実用的なコードパターンとベストプラクティス

**📋 前提知識**:
- 基本的な型注釈（string, number, boolean）
- 配列とオブジェクトの型定義
- 関数の型注釈
- Hello Worldから型推論の練習まで完了していること

**🚀 実践的価値**:
これらの例は単なる練習問題ではなく、実際の開発現場で使われるパターンを初心者向けに簡略化したものです。学習後は、より複雑なWebアプリケーションやライブラリ開発への基礎となります。

---

## 📋 システム概要・要件定義

### 🎓 学生管理システム

**🎯 システムの目的**:
教育機関（学校、塾、オンライン学習プラットフォーム）での学生の成績管理を効率化するシステム

**👥 対象ユーザー**:
- 教師・講師：学生の成績入力と分析
- 学生：自分の成績確認
- 管理者：全体統計の把握

**🔧 解決する問題**:
- 手動での成績管理によるミスの防止
- 学生の学習進捗の可視化
- 成績データの統計分析の自動化

**📋 主要機能**:
- 学生情報の登録・管理
- 成績の入力・更新
- 平均点の自動計算
- 成績上位者の抽出
- 統計情報の表示

### 📝 タスク管理システム

**🎯 システムの目的**:
チーム開発やプロジェクト管理での作業効率向上を支援するタスク追跡システム

**👥 対象ユーザー**:
- 開発者：自分のタスクの管理
- プロジェクトマネージャー：チーム全体の進捗把握
- チームリーダー：優先度の調整と割り当て

**🔧 解決する問題**:
- タスクの抜け漏れ防止
- 優先度の明確化
- 進捗状況の可視化
- 期限管理の自動化

**📋 主要機能**:
- タスクの作成・更新・削除
- ステータス管理（未着手・進行中・完了）
- 優先度設定（低・中・高・緊急）
- 期限管理と期限切れ検出
- 統計情報とレポート機能

---

## 🏗️ 設計思想・アーキテクチャ

### 💭 設計原則

**1. 型安全性の確保**:
- すべてのデータに適切な型注釈を付与
- null/undefinedの明示的な処理
- 実行時エラーの予防

**2. 単一責任の原則**:
- 各クラスは一つの明確な責任を持つ
- データ管理とビジネスロジックの分離
- 機能の追加・変更が容易な設計

**3. 拡張性の考慮**:
- 将来的な機能追加を見据えた設計
- インターフェースによる抽象化
- 設定可能なパラメータの活用

### 🎯 TypeScript活用方針

**型システムの活用**:
- `type`エイリアスによる意味のある型名の定義
- `enum`による定数の型安全な管理
- オプショナルプロパティ（`?`）による柔軟性

**エラー予防**:
- 戻り値の型を明示してAPIの意図を明確化
- 配列操作での型安全性の確保
- null許容型による安全なデータアクセス

**開発効率の向上**:
- IDEの型推論とオートコンプリートの活用
- コンパイル時の型チェックによる早期バグ発見
- リファクタリング時の型安全性

---

## 📝 段階的実装ガイド

### ステップ4: 学生管理システム

#### ステップ4-1: 基本型定義

**🎯 学習目標**: 実用的なデータ構造を型で表現する
```typescript
// student-types.ts

// 学生の基本情報を表す型
type Student = {
  id: number;           // 一意識別子
  name: string;         // 学生名
  age: number;          // 年齢
  grades: number[];     // 成績の配列
};

```

**📝 詳細解説**:
- `id`は学生を一意に識別するための数値
- `grades`は複数の成績を格納する配列
- すべてのプロパティが必須（オプショナルではない）

**⚠️ よくある間違い**:
```typescript
// ❌ 間違い: 型名が不明確
type Data = {
  id: number;
  name: string;
};

// ✅ 正解: 意味のある型名
type Student = {
  id: number;
  name: string;
  age: number;
  grades: number[];
};
```

#### ステップ4-2: 基本クラス実装

**🎯 学習目標**: TypeScriptでのクラス設計とprivateメンバーの活用

```typescript
// student-manager.ts

class StudentManager {
  // プライベートメンバーで内部データを保護
  private students: Student[] = [];
  private nextId: number = 1;

  // 学生を追加するメソッド
  addStudent(name: string, age: number): Student {
    // 入力値の検証
    if (!name.trim()) {
      throw new Error("学生名は必須です");
    }
    if (age < 0 || age > 150) {
      throw new Error("年齢は0-150の範囲で入力してください");
    }

    const newStudent: Student = {
      id: this.nextId++,
      name: name.trim(),
      age,
      grades: []
    };
    
    this.students.push(newStudent);
    console.log(`学生を追加しました: ${newStudent.name} (ID: ${newStudent.id})`);
    return newStudent;
  }

  // 全学生を取得（イミュータブルなコピーを返す）
  getAllStudents(): Student[] {
    return [...this.students];
  }
}
```

**📝 詳細解説**:
- `private`キーワードで内部データを外部から直接変更できないよう保護
- `nextId`で自動的にユニークなIDを生成
- 入力値の検証でデータの整合性を確保
- スプレッド演算子（`...`）でイミュータブルなコピーを作成

**⚠️ よくある間違い**:
```typescript
// ❌ 間違い: 内部データを直接公開
class StudentManager {
  students: Student[] = []; // publicなので外部から変更可能
}

// ✅ 正解: privateで保護
class StudentManager {
  private students: Student[] = [];
  
  getAllStudents(): Student[] {
    return [...this.students]; // コピーを返す
  }
}
```

#### ステップ4-3: CRUD操作の実装

**🎯 学習目標**: 基本的なデータ操作を型安全に実装する

```typescript
class StudentManager {
  private students: Student[] = [];
  private nextId: number = 1;

  // 学生を追加
  addStudent(name: string, age: number): Student {
    if (!name.trim()) {
      throw new Error("学生名は必須です");
    }
    if (age < 0 || age > 150) {
      throw new Error("年齢は0-150の範囲で入力してください");
    }

    const newStudent: Student = {
      id: this.nextId++,
      name: name.trim(),
      age,
      grades: []
    };
    
    this.students.push(newStudent);
    console.log(`学生を追加しました: ${newStudent.name} (ID: ${newStudent.id})`);
    return newStudent;
  }

  // 学生を検索
  findStudentById(id: number): Student | null {
    const student = this.students.find(s => s.id === id);
    return student || null;
  }

  // 成績を追加
  addGrade(studentId: number, grade: number): boolean {
    // 成績の妥当性チェック
    if (grade < 0 || grade > 100) {
      console.log("成績は0-100の範囲で入力してください");
      return false;
    }

    const student = this.findStudentById(studentId);
    if (student) {
      student.grades.push(grade);
      console.log(`${student.name}の成績を追加しました: ${grade}点`);
      return true;
    }
    console.log(`ID ${studentId}の学生が見つかりません`);
    return false;
  }

  // 学生を削除
  removeStudent(id: number): boolean {
    const index = this.students.findIndex(s => s.id === id);
    if (index !== -1) {
      const removedStudent = this.students.splice(index, 1)[0];
      console.log(`学生を削除しました: ${removedStudent.name}`);
      return true;
    }
    console.log(`ID ${id}の学生が見つかりません`);
    return false;
  }

  // 全学生を取得
  getAllStudents(): Student[] {
    return [...this.students];
  }
}
```

**📝 詳細解説**:
- `find`メソッドで条件に合う要素を検索
- `findIndex`と`splice`で配列から要素を削除
- 戻り値の型（`boolean`, `Student | null`）で操作結果を明確化
- 入力値の検証でデータの整合性を確保

**🚀 発展的な学習**:
- より複雑な検索条件（名前での部分一致検索など）
- 学生情報の更新機能
- バリデーション機能の強化

#### ステップ4-4: 統計・検索機能の実装

**🎯 学習目標**: 配列操作メソッドを活用した高度なデータ処理

```typescript
class StudentManager {
  // ... 前のメソッドは省略 ...

  // 平均点を計算
  getAverage(studentId: number): number {
    const student = this.findStudentById(studentId);
    if (student && student.grades.length > 0) {
      const sum = student.grades.reduce((acc, grade) => acc + grade, 0);
      return Math.round((sum / student.grades.length) * 100) / 100; // 小数点第2位まで
    }
    return 0;
  }

  // 成績上位者を取得
  getTopStudents(limit: number = 3): Student[] {
    return this.students
      .filter(student => student.grades.length > 0) // 成績がある学生のみ
      .sort((a, b) => this.getAverage(b.id) - this.getAverage(a.id)) // 平均点で降順ソート
      .slice(0, limit); // 上位N人を取得
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

  // 条件による学生検索
  searchStudents(criteria: {
    minAge?: number;
    maxAge?: number;
    minAverage?: number;
    nameContains?: string;
  }): Student[] {
    return this.students.filter(student => {
      // 年齢の条件チェック
      if (criteria.minAge !== undefined && student.age < criteria.minAge) {
        return false;
      }
      if (criteria.maxAge !== undefined && student.age > criteria.maxAge) {
        return false;
      }
      
      // 平均点の条件チェック
      if (criteria.minAverage !== undefined) {
        const average = this.getAverage(student.id);
        if (average < criteria.minAverage) {
          return false;
        }
      }
      
      // 名前の条件チェック
      if (criteria.nameContains !== undefined) {
        if (!student.name.toLowerCase().includes(criteria.nameContains.toLowerCase())) {
          return false;
        }
      }
      
      return true;
    });
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

// 統計情報を表示
manager.displayStatistics();

// 条件検索の例
console.log("20歳以上で平均点85点以上の学生:");
const topStudents = manager.searchStudents({
  minAge: 20,
  minAverage: 85
});
topStudents.forEach(student => {
  console.log(`- ${student.name} (${student.age}歳, 平均: ${manager.getAverage(student.id)}点)`);
});
```

**📝 詳細解説**:
- `reduce`メソッドで配列の合計を計算
- `filter`, `sort`, `slice`の組み合わせで複雑なデータ処理を実現
- オプショナルプロパティ（`?`）で柔軟な検索条件を実現
- 型安全な条件分岐でランタイムエラーを防止

**🚀 発展的な学習**:
- より複雑な統計処理（標準偏差、中央値など）
- データの永続化（ファイル保存、データベース連携）
- Webアプリケーションとしての実装

---

## 🎓 学習ポイント・まとめ

### 📚 習得した技術

**基本的な型システム**:
- `type`エイリアスによる意味のある型定義
- プリミティブ型（`string`, `number`, `boolean`）の活用
- 配列型（`number[]`）とオブジェクト型の定義

**クラス設計**:
- `private`メンバーによるカプセル化
- メソッドの型注釈（引数・戻り値）
- コンストラクタでの初期化処理

**配列操作メソッド**:
- `find` - 条件に合う要素の検索
- `filter` - 条件に合う要素の抽出
- `map` - 要素の変換
- `reduce` - 配列の集約処理
- `sort` - 要素のソート
- `slice` - 配列の部分取得

**エラーハンドリング**:
- 入力値の検証
- 戻り値による操作結果の通知
- null許容型（`Student | null`）の活用

### 🎯 実践での活用方法

**1. Webアプリケーション開発**:
```typescript
// React コンポーネントでの活用例
interface StudentListProps {
  students: Student[];
  onStudentSelect: (student: Student) => void;
}

const StudentList: React.FC<StudentListProps> = ({ students, onStudentSelect }) => {
  return (
    <div>
      {students.map(student => (
        <div key={student.id} onClick={() => onStudentSelect(student)}>
          {student.name} (平均: {calculateAverage(student.grades)}点)
        </div>
      ))}
    </div>
  );
};
```

**2. API開発**:
```typescript
// Express.js での活用例
app.post('/api/students', (req: Request, res: Response) => {
  const { name, age }: { name: string; age: number } = req.body;
  
  try {
    const student = studentManager.addStudent(name, age);
    res.status(201).json(student);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
```

**3. データ処理ライブラリ**:
```typescript
// 汎用的なデータ処理関数
function processData<T>(
  data: T[],
  filterFn: (item: T) => boolean,
  sortFn: (a: T, b: T) => number
): T[] {
  return data.filter(filterFn).sort(sortFn);
}
```
---

**📌 重要**: これらのコード例は実際に動作するものです。コピーして実行し、改造して理解を深めてください。TypeScriptの型システムの恩恵を実感できるはずです。
    