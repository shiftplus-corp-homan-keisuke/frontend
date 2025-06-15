# Session1: 型システム理論と基本実践（90 分）

> 💡 **対象**: 他言語経験者（静的型付け言語の経験推奨）
> 🎯 **形式**: 講師サポート付き学習
> ⏰ **時間**: 90 分（休憩含む）

## 📚 関連補足資料

このセッションの学習をサポートする補足資料をご用意しています：

- 📖 **[専門用語集](./Step02_補足_専門用語集.md)** - 型システムの重要な概念と用語の詳細解説
- 💻 **[実践コード例](./Step02_補足_実践コード例.md)** - 段階的な学習のためのコード例集
- 🚨 **[トラブルシューティング](./Step02_補足_トラブルシューティング.md)** - よくあるエラーと解決方法
- 🌐 **[参考リソース](./Step02_補足_参考リソース.md)** - 学習に役立つリンク集とリソース
- 📋 **[補足資料](./Step02_補足資料.md)** - その他の重要な補足情報

> 💡 **活用方法**: 学習中に疑問が生じた際や、より深く理解したい場合に参照してね 🐰

## 📅 セッション概要

**学習目標**:

- [ ] 高度な型推論メカニズムの理解
- [ ] リテラル型とUnion型の実践活用
- [ ] 構造的型付けの概念理解
- [ ] const assertionと型の厳密化

**前提知識**:

- JavaScript 基本構文の理解
- 他言語での型システム経験（php、javascript 等）
- Step01 の完了

---

## ⏰ 詳細タイムテーブル

| 時間         | 内容                       | 講師の役割               | 学習者の活動     | 成果物     |
| ------------ | -------------------------- | ------------------------ | ---------------- | ---------- |
| **0-10 分**  | 前 Step 復習・今回目標設定 | 復習確認・目標提示       | 振り返り・質問   | 理解確認   |
| **10-50 分** | 型システム理論学習         | 実演・解説・個別サポート | 理解・メモ・質問 | 理論理解   |
| **50-80 分** | 基本実践・練習問題         | 巡回サポート・ヒント     | ハンズオン・実践 | 基本コード |
| **80-90 分** | 振り返り・次回予告         | まとめ・予告             | 質問・確認       | 学習計画   |

---

## 📚 学習内容

### Section 1: TypeScript 型システムの基礎理解

> 📚 **関連資料**: [専門用語集 - 型システム関連用語](./Step02_補足_専門用語集.md#型システム関連用語) | [実践コード例 - 基本から始める段階的学習](./Step02_補足_実践コード例.md#基本から始める段階的学習)

#### 🔍 高度な型推論メカニズムの理解

**💡 なぜ高度な型推論が重要なのか**

Step01で基本的な型注釈を学習しました。Step02では、TypeScriptの強力な型推論機能を活用して、より効率的で型安全なコードを書く方法を学習します。

**🎯 Step02で学習する高度な機能**

- **const assertion**: より厳密な型推論の制御
- **構造的型付け**: 名前ではなく構造による型の互換性
- **リテラル型とUnion型**: 具体的な値による型制約
- **型の厳密化**: widening の制御と型の精密化

##### 1. const assertion による型の厳密化

> 📚 **詳細解説**: [専門用語集 - const assertion](./Step02_補足_専門用語集.md#const-assertionconst-アサーション)

**💡 const assertionとは**: `as const`を使用して、TypeScriptの型推論をより厳密に制御し、値を具体的なリテラル型として保持する機能です。通常の型推論では値が汎用的な型（`string`、`number`など）に拡張されますが、const assertionによりこれを防ぎ、設定値や定数をより型安全に管理できます。

```typescript
// 通常の型推論（widening）
let theme = "dark"; // string型として推論（再代入可能）
let config = {
  apiUrl: "https://api.example.com",
  timeout: 5000,
  retryCount: 3,
}; // { apiUrl: string; timeout: number; retryCount: number; }

// const assertionによる厳密な型推論
const strictTheme = "dark" as const; // "dark"型（リテラル型）
const strictConfig = {
  apiUrl: "https://api.example.com",
  timeout: 5000,
  retryCount: 3,
} as const; // readonly { apiUrl: "https://api.example.com"; timeout: 5000; retryCount: 3; }

// 実用例：設定オブジェクトの型安全性
const STUDENT_GRADES = {
  EXCELLENT: 90,
  GOOD: 80,
  AVERAGE: 70,
  POOR: 60,
} as const;

type GradeThreshold = typeof STUDENT_GRADES[keyof typeof STUDENT_GRADES]; // 90 | 80 | 70 | 60
```

##### 2. リテラル型とUnion型の実践活用

```typescript
// 学生の学年を表現するリテラル型
type Grade = 1 | 2 | 3 | 4 | 5 | 6;  // 小学校1-6年生のみ
type StudentStatus = "enrolled" | "graduated" | "suspended" | "transferred";
// 入学 | 卒業 | 停学 | 転校

// 学生情報の型定義（Step01からの発展）
interface Student {
  readonly id: number;
  name: string;
  grade: Grade;
  status: StudentStatus;
  subjects: readonly string[];
}

// 小学校の学年レベルを取得する関数
function getElementaryLevel(grade: Grade): "lower" | "middle" | "upper" {
  if (grade <= 2) return "lower";    // 低学年 1-2年
  if (grade <= 4) return "middle";   // 中学年 3-4年
  return "upper";                    // 高学年 5-6年
}

// 判別可能なUnion型
type StudentEvent =
  | { type: "enrollment"; studentId: number }
  | { type: "graduation"; studentId: number; graduationDate: Date }
  | { type: "transfer"; studentId: number; newSchool: string }
  | { type: "suspension"; studentId: number; reason: string; duration: number };

function processStudentEvent(event: StudentEvent): string {
  switch (event.type) {
    case "enrollment":
      return `学生ID ${event.studentId} が入学しました`;
    case "graduation":
      return `学生ID ${event.studentId} が ${event.graduationDate.toLocaleDateString('ja-JP')} に卒業しました`;
    case "transfer":
      return `学生ID ${event.studentId} が ${event.newSchool} に転校しました`;
    case "suspension":
      return `学生ID ${event.studentId} が ${event.duration}日間の停学処分を受けました。理由: ${event.reason}`;
  }
}
```

##### 3. 構造的型付けの理解

```typescript
// 構造的型付けの例
interface Point2D {
  x: number;
  y: number;
}

interface Point3D {
  x: number;
  y: number;
  z: number;
}

// Point3DはPoint2Dと構造的に互換性がある
function calculateDistance2D(point: Point2D): number {
  return Math.sqrt(point.x * point.x + point.y * point.y);
}

const point3D: Point3D = { x: 1, y: 2, z: 3 };
const distance = calculateDistance2D(point3D); // エラーなし！

// 学生管理での構造的型付け
interface BasicStudent {
  id: number;
  name: string;
}

interface DetailedStudent {
  id: number;
  name: string;
  grade: Grade;
  subjects: string[];
  gpa: number;
}

function displayStudentName(student: BasicStudent): string {
  return `Student: ${student.name} (ID: ${student.id})`;
}

const detailedStudent: DetailedStudent = {
  id: 1,
  name: "田中太郎",
  grade: 3,
  subjects: ["数学", "英語", "国語"],
  gpa: 3.8,
};

// DetailedStudentはBasicStudentと構造的に互換性がある
console.log(displayStudentName(detailedStudent)); // エラーなし！
```

### Section 2: 高度な型推論と文脈的型付け

> 📚 **関連資料**: [専門用語集 - 型推論関連用語](./Step02_補足_専門用語集.md#型推論関連用語) | [実践コード例 - 型推論の活用例](./Step02_補足_実践コード例.md#型推論の活用例)

#### 🎯 文脈的型推論の活用

**💡 なぜ文脈的型推論が重要なのか**

TypeScriptは文脈から型を推論する能力があります。これにより、冗長な型注釈を避けながら、型安全性を保つことができます。

##### 1. 配列メソッドでの文脈的型推論

```typescript
// 学生データでの文脈的型推論
const students = [
  { id: 1, name: "田中太郎", grade: 3, gpa: 3.8 },
  { id: 2, name: "佐藤花子", grade: 2, gpa: 3.9 },
  { id: 3, name: "鈴木次郎", grade: 1, gpa: 3.2 },
] as const;

// map関数での文脈的型推論
const studentNames = students.map(student => student.name); // string[]として推論
const studentGrades = students.map(student => student.grade); // number[]として推論

// filter関数での型の絞り込み
const highPerformers = students.filter(student => student.gpa >= 3.5);
// typeof students[number][]として推論（元の型を保持）

// reduce関数での累積型推論
const totalGPA = students.reduce((sum, student) => sum + student.gpa, 0);
// numberとして推論
```

##### 2. 関数型での文脈的型推論

```typescript
// 高階関数での文脈的型推論
type StudentProcessor<T> = (student: Student) => T;

function processStudents<T>(
  students: Student[],
  processor: StudentProcessor<T>
): T[] {
  return students.map(processor);
}

// 使用時に型が推論される
const names = processStudents(students, student => student.name); // string[]
const isHonorRoll = processStudents(students, student => student.gpa >= 3.5); // boolean[]

// イベントハンドラーでの文脈的型推論
type EventHandler<T> = (event: T) => void;

interface StudentEvent {
  type: "grade_update" | "enrollment" | "graduation";
  studentId: number;
  timestamp: Date;
}

const handleStudentEvent: EventHandler<StudentEvent> = (event) => {
  // eventの型はStudentEventとして推論される
  console.log(`Processing ${event.type} for student ${event.studentId}`);
};
```

##### 3. 条件型での型推論

```typescript
// 条件型を使った型推論
type StudentGradeLevel<T extends number> =
  T extends 1 | 2 | 3 ? "elementary" :
  T extends 4 | 5 | 6 ? "middle" :
  T extends 7 | 8 | 9 ? "high" :
  "unknown";

// 使用例
type ElementaryLevel = StudentGradeLevel<2>; // "elementary"
type HighLevel = StudentGradeLevel<8>; // "high"

// 実用的な例：学生データの型安全な処理
function getStudentsByGradeLevel<T extends Grade>(
  students: Student[],
  targetGrade: T
): Array<Student & { gradeLevel: StudentGradeLevel<T> }> {
  return students
    .filter(student => student.grade === targetGrade)
    .map(student => ({
      ...student,
      gradeLevel: getElementaryLevelForCondition(student.grade) as StudentGradeLevel<T>
    }));
}

function getElementaryLevelForCondition(grade: Grade): string {
  if (grade <= 2) return "lower";     // 低学年 1-2年
  if (grade <= 4) return "middle";    // 中学年 3-4年
  return "upper";                     // 高学年 5-6年
}
```

---

## 🎯 実践演習

> 📚 **演習サポート資料**: [実践コード例 - 高度な型システム](./Step02_補足_実践コード例.md#高度な型システム) | [トラブルシューティング - 型推論エラー](./Step02_補足_トラブルシューティング.md#型推論エラー)

### 演習 1: const assertionと型推論（15 分）

以下のコードを完成させて、const assertionと型推論の動作を確認してください：

```typescript
// 1. 学生の成績基準を定義してください
const GRADE_STANDARDS = {
  // TODO: 各成績レベルの基準点を定義（const assertionを使用）
} as const;

// 2. 学生のステータスを定義してください
const STUDENT_STATUSES = [
  // TODO: 学生の状態を配列で定義（const assertionを使用）
] as const;

// 3. 型推論を活用した関数を作成してください
function evaluateStudent(score: number) {
  // TODO: scoreに基づいて成績レベルを返す関数
  // GRADE_STANDARDSを活用してください
}

// 4. 文脈的型推論を確認してください
const students = [
  { id: 1, name: "田中", scores: [85, 92, 78] },
  { id: 2, name: "佐藤", scores: [76, 84, 90] },
  { id: 3, name: "鈴木", scores: [94, 89, 91] },
];

// TODO: map関数を使って各学生の平均点を計算
const averageScores = students.map(/* ここを完成させてください */);

// TODO: filter関数を使って平均80点以上の学生を抽出
const highPerformers = students.filter(/* ここを完成させてください */);
```

### 演習 2: 構造的型付けの実践（10 分）

以下の型定義を完成させて、構造的型付けの動作を確認してください：

```typescript
// 1. 基本的な学生インターフェース
interface BasicStudent {
  // TODO: id, name, gradeを定義
}

// 2. 詳細な学生インターフェース
interface DetailedStudent {
  // TODO: BasicStudentを拡張して、subjects, gpa, enrollmentDateを追加
}

// 3. 構造的型付けを活用した関数
function displayBasicInfo(student: BasicStudent): string {
  // TODO: 学生の基本情報を表示する関数
}

// 4. 型の互換性を確認
const detailedStudent: DetailedStudent = {
  // TODO: DetailedStudentのサンプルデータを作成
};

// この関数呼び出しがエラーにならないことを確認
console.log(displayBasicInfo(detailedStudent));
```

---

## 📝 学習ポイント

### ✅ 今回のセッションで習得すべきこと

1. **const assertionの活用**: より厳密な型推論の制御方法
2. **リテラル型とUnion型**: 具体的な値による型制約の実践
3. **構造的型付け**: 名前ではなく構造による型の互換性理解
4. **文脈的型推論**: 関数型や配列メソッドでの型推論活用

---

**📌 重要**: Session1 では高度な型推論機能を学習しました。Step01の基礎知識を活用して、より効率的な型安全コードを書けるようになりましょう。

**🌟 次回（Session2）は、タプル型・関数オーバーロード等のより高度な型機能を学習します！**
