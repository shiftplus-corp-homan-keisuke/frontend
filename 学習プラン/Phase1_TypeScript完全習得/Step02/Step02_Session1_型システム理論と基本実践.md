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
- [ ] リテラル型と Union 型の実践活用
- [ ] 構造的型付けの概念理解
- [ ] const assertion と型の厳密化

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

Step01 で基本的な型注釈を学習しました。Step02 では、TypeScript の強力な型推論機能を活用して、より効率的で型安全なコードを書く方法を学習します。

**🎯 Step02 で学習する高度な機能**

- **const assertion**: より厳密な型推論の制御
- **構造的型付け**: 名前ではなく構造による型の互換性
- **リテラル型と Union 型**: 具体的な値による型制約
- **型の厳密化**: widening の制御と型の精密化

##### 1. const assertion による型の厳密化

> 📚 **詳細解説**: [専門用語集 - const assertion](./Step02_補足_専門用語集.md#const-assertionconst-アサーション)

**💡 const assertion とは**: `as const`を使用して、TypeScript の型推論をより厳密に制御し、値を具体的なリテラル型として保持する機能です。通常の型推論では値が汎用的な型（`string`、`number`など）に拡張されますが、const assertion によりこれを防ぎ、設定値や定数をより型安全に管理できます。

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

type GradeThreshold = (typeof STUDENT_GRADES)[keyof typeof STUDENT_GRADES]; // 90 | 80 | 70 | 60
```

##### 2. リテラル型と Union 型の実践活用

```typescript
// 学生の学年を表現するリテラル型
type Grade = 1 | 2 | 3 | 4 | 5 | 6; // 小学校1-6年生のみ
type StudentStatus = "active" | "inactive" | "graduated" | "transferred";
// 在籍中 | 休学中 | 卒業 | 転校

// 学生情報の型定義（Step01からの発展）
type Student = {
  readonly id: number;
  name: string;
  grade: Grade;
  status: StudentStatus;
  subjects: readonly string[];
};

// 小学校の学年レベルを取得する関数
function getElementaryLevel(grade: Grade): "lower" | "middle" | "upper" {
  if (grade <= 2) return "lower"; // 低学年 1-2年
  if (grade <= 4) return "middle"; // 中学年 3-4年
  return "upper"; // 高学年 5-6年
}

// 判別可能なUnion型（typeで判別できる）
type StudentEvent =
  | { type: "active"; studentId: number }
  | { type: "inactive"; studentId: number; reason?: string }
  | { type: "graduated"; studentId: number; graduationDate: Date }
  | { type: "transferred"; studentId: number; newSchool: string };

function processStudentEvent(event: StudentEvent): string {
  switch (event.type) {
    case "active":
      return `学生ID ${event.studentId} が在籍中になりました`;
    case "inactive":
      return `学生ID ${event.studentId} が休学中になりました${
        event.reason ? `。理由: ${event.reason}` : ""
      }`;
    case "graduated":
      return `学生ID ${
        event.studentId
      } が ${event.graduationDate.toLocaleDateString("ja-JP")} に卒業しました`;
    case "transferred":
      return `学生ID ${event.studentId} が ${event.newSchool} に転校しました`;
  }
}
```

##### 3. 構造的型付けの理解

**構造的型付け（Structural Typing）**とは、TypeScript が採用している型システムの仕組みで、**型の名前ではなく、型の構造（プロパティやメソッドの形）**によって型の互換性を判断する方式です。

**重要なポイント**：

- **名前的型付け**：型の名前が同じかどうかで互換性を判断（Java、C#など）
- **構造的型付け**：型の構造が同じかどうかで互換性を判断（TypeScript、Go）
- **Duck Typing**：「アヒルのように歩き、アヒルのように鳴くなら、それはアヒルである」という考え方

> 💡 **詳細情報**: [構造的型付けの詳細](Step02_補足_専門用語集.md#構造的型付けstructural-typing)

```typescript
// 構造的型付けの例
type Point2D = {
  x: number;
  y: number;
};

type Point3D = {
  x: number;
  y: number;
  z: number;
};

// Point3DはPoint2Dと構造的に互換性がある
function calculateDistance2D(point: Point2D): number {
  return Math.sqrt(point.x * point.x + point.y * point.y);
}

const point3D: Point3D = { x: 1, y: 2, z: 3 };
const distance = calculateDistance2D(point3D); // エラーなし！

// 学生管理での構造的型付け
type BasicStudent = {
  id: number;
  name: string;
};

type DetailedStudent = {
  id: number;
  name: string;
  grade: Grade;
  subjects: string[];
  gpa: number;
};

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

TypeScript は文脈から型を推論する能力があります。これにより、冗長な型注釈を避けながら、型安全性を保つことができます。

##### 1. 配列メソッドでの文脈的型推論

```typescript
// 学生データでの文脈的型推論
const students = [
  { id: 1, name: "田中太郎", grade: 3, gpa: 3.8 },
  { id: 2, name: "佐藤花子", grade: 2, gpa: 3.9 },
  { id: 3, name: "鈴木次郎", grade: 1, gpa: 3.2 },
] as const;

// map関数での文脈的型推論
const studentNames = students.map((student) => student.name); // string[]として推論
const studentGrades = students.map((student) => student.grade); // number[]として推論

// filter関数での型の絞り込み
const highPerformers = students.filter((student) => student.gpa >= 3.5);
// typeof students[number][]として推論（元の型を保持）

// reduce関数での累積型推論
const totalGPA = students.reduce((sum, student) => sum + student.gpa, 0);
// numberとして推論
```

##### 2. 関数型での文脈的型推論

```typescript
// 高階関数での文脈的型推論
type StudentProcessor = (student: Student) => string;

function processStudentNames(
  students: Student[],
  processor: StudentProcessor
): string[] {
  return students.map(processor);
}

// 使用時に型が推論される
const names = processStudentNames(students, (student) => student.name); // string[]

// イベントハンドラーでの文脈的型推論
type EventHandler = (event: StudentEvent) => void;

type StudentEvent = {
  type: "grade_update" | "enrollment" | "graduation";
  studentId: number;
  timestamp: Date;
};

const handleStudentEvent: EventHandler = (event) => {
  // eventの型はStudentEventとして推論される
  console.log(`Processing ${event.type} for student ${event.studentId}`);
};
```

##### 3. 関数オーバーロードの基本

```typescript
// 関数オーバーロードを使った型安全な処理
function getStudentInfo(id: number): Student | null;
function getStudentInfo(name: string): Student[];
function getStudentInfo(input: number | string): Student | Student[] | null {
  const students = [
    {
      id: 1,
      name: "田中太郎",
      grade: 3 as Grade,
      status: "active" as StudentStatus,
      subjects: ["数学", "英語"],
    },
    {
      id: 2,
      name: "佐藤花子",
      grade: 2 as Grade,
      status: "active" as StudentStatus,
      subjects: ["国語", "理科"],
    },
  ];

  if (typeof input === "number") {
    return students.find((student) => student.id === input) || null;
  } else {
    return students.filter((student) => student.name.includes(input));
  }
}

// 使用例
const studentById = getStudentInfo(1); // Student | null
const studentsByName = getStudentInfo("田中"); // Student[]

function getElementaryLevel(grade: Grade): "lower" | "middle" | "upper" {
  if (grade <= 2) return "lower"; // 低学年 1-2年
  if (grade <= 4) return "middle"; // 中学年 3-4年
  return "upper"; // 高学年 5-6年
}
```

---

## 🎯 実践演習

> 📚 **演習サポート資料**: [実践コード例 - 高度な型システム](./Step02_補足_実践コード例.md#高度な型システム) | [トラブルシューティング - 型推論エラー](./Step02_補足_トラブルシューティング.md#型推論エラー)

### 演習 1: const assertion と型推論（15 分）

以下のコードを完成させて、const assertion と型推論の動作を確認してください：

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
// 1. 基本的な学生型
type BasicStudent = {
  // TODO: id, name, gradeを定義
};

// 2. 詳細な学生型
type DetailedStudent = {
  // TODO: BasicStudentのプロパティに加えて、subjects, gpa, enrollmentDateを追加
};

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

1. **const assertion の活用**: より厳密な型推論の制御方法
2. **リテラル型と Union 型**: 具体的な値による型制約の実践
3. **構造的型付け**: 名前ではなく構造による型の互換性理解
4. **文脈的型推論**: 関数型や配列メソッドでの型推論活用

---

**📌 重要**: Session1 では高度な型推論機能を学習しました。Step01 の基礎知識を活用して、より効率的な型安全コードを書けるようになりましょう。

**🌟 次回（Session2）は、タプル型・関数オーバーロード等のより高度な型機能を学習します！**
