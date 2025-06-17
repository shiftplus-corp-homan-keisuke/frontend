# Step02 練習問題集

> 💡 **このファイルについて**: Step02のSession1〜3で学習する型システムと型注釈の練習問題集です。基本的な型から複雑な型システムまで段階的に練習できます。

## 📋 目次
1. [Session1 練習問題：型システム理論と基本実践](#session1-練習問題型システム理論と基本実践)
2. [Session2 練習問題：実践演習と応用](#session2-練習問題実践演習と応用)
3. [Session3 練習問題：プロジェクト完成](#session3-練習問題プロジェクト完成)
4. [総合演習問題](#総合演習問題)
5. [解答例とヒント](#解答例とヒント)

---

## Session1 練習問題：型システム理論と基本実践

### 練習問題1-1: const assertionの基本（10分）

以下のコードを完成させて、const assertionの動作を確認してください：

```typescript
// 問題1: 以下の変数にconst assertionを適用してください
let theme = "dark"; // string型 → "dark"型にしたい
let config = {
  apiUrl: "https://api.example.com",
  timeout: 5000,
  retryCount: 3,
}; // プロパティを読み取り専用のリテラル型にしたい

// 問題2: 学生の成績基準を定義してください（const assertionを使用）
const GRADE_STANDARDS = {
  // TODO: 各成績レベルの基準点を定義
  // EXCELLENT: 90, GOOD: 80, AVERAGE: 70, POOR: 60
} as const;

// 問題3: 学生のステータスを配列で定義してください（const assertionを使用）
const STUDENT_STATUSES = [
  // TODO: "active", "inactive", "graduated", "transferred"
] as const;

// 問題4: GRADE_STANDARDSから型を抽出してください
type GradeThreshold = // TODO: typeof GRADE_STANDARDS の値の型を抽出

// 問題5: STUDENT_STATUSESから型を抽出してください
type StudentStatus = // TODO: typeof STUDENT_STATUSES の要素の型を抽出
```

### 練習問題1-2: リテラル型とUnion型の実践（15分）

```typescript
// 問題1: 学年を表現するリテラル型を定義してください
type Grade = // TODO: 1 | 2 | 3 | 4 | 5 | 6

// 問題2: 通知の種類を表すリテラル型を定義してください
type NotificationType = // TODO: "info" | "warning" | "error" | "success"

// 問題3: IDの型（文字列または数値）を定義してください
type ID = // TODO: string | number

// 問題4: 設定値の型（真偽値または文字列"auto"）を定義してください
type SettingValue = // TODO: boolean | "auto"

// 問題5: 学生イベントの判別可能なUnion型を定義してください
type StudentEvent =
  | { type: "enrollment"; studentId: number; date: Date }
  | { type: "graduation"; studentId: number; date: Date; ceremony: boolean }
  | { type: "transfer"; studentId: number; newSchool: string; reason?: string }
  | // TODO: "suspension"タイプを追加（studentId, startDate, endDate, reasonを含む）

// 問題6: 学生イベントを処理する関数を作成してください
function processStudentEvent(event: StudentEvent): string {
  switch (event.type) {
    case "enrollment":
      // TODO: 入学メッセージを返す
    case "graduation":
      // TODO: 卒業メッセージを返す（ceremony情報も含む）
    case "transfer":
      // TODO: 転校メッセージを返す
    case "suspension":
      // TODO: 停学メッセージを返す
    default:
      // TODO: exhaustive checkを実装
  }
}
```

### 練習問題1-3: 構造的型付けの理解（10分）

```typescript
// 問題1: 基本的な座標型を定義してください
type Point2D = {
  // TODO: x, y プロパティ（number型）
};

type Point3D = {
  // TODO: x, y, z プロパティ（number型）
};

// 問題2: 2D座標の距離を計算する関数を作成してください
function calculateDistance2D(point: Point2D): number {
  // TODO: 原点からの距離を計算
}

// 問題3: 学生の基本情報型を定義してください
type BasicStudent = {
  // TODO: id（number）, name（string）
};

type DetailedStudent = {
  // TODO: BasicStudentのプロパティ + grade（Grade）, subjects（string[]）, gpa（number）
};

// 問題4: 学生の基本情報を表示する関数を作成してください
function displayStudentName(student: BasicStudent): string {
  // TODO: "Student: {name} (ID: {id})" 形式で返す
}

// 問題5: 構造的型付けの動作を確認してください
const detailedStudent: DetailedStudent = {
  // TODO: DetailedStudentのサンプルデータを作成
};

// この関数呼び出しがエラーにならないことを確認
console.log(displayStudentName(detailedStudent));
```

### 練習問題1-4: 文脈的型推論の活用（10分）

```typescript
// 問題1: 学生データの配列を定義してください
const students = [
  { id: 1, name: "田中太郎", grade: 3, gpa: 3.8 },
  { id: 2, name: "佐藤花子", grade: 2, gpa: 3.9 },
  { id: 3, name: "鈴木次郎", grade: 1, gpa: 3.2 },
] as const;

// 問題2: 文脈的型推論を活用して以下の処理を完成させてください
const studentNames = students.map(/* TODO: student引数の型が自動推測されることを確認 */);

const highPerformers = students.filter(/* TODO: GPA 3.5以上の学生を抽出 */);

const totalGPA = students.reduce(/* TODO: 全学生のGPA合計を計算 */, 0);

// 問題3: 高階関数での文脈的型推論を確認してください
type StudentProcessor = (student: typeof students[number]) => string;

function processStudentNames(
  students: typeof students,
  processor: StudentProcessor
): string[] {
  return students.map(processor);
}

// 使用例（student引数の型が自動推測されることを確認）
const names = processStudentNames(students, (student) => {
  // TODO: student.nameを返す
});
```

---

## Session2 練習問題：実践演習と応用

### 練習問題2-1: タプル型の基本活用（15分）

```typescript
// 問題1: 成績データをタプルで表現してください
type SubjectScore = // TODO: [subject: string, score: number, maxScore: number]

type StudentRecord = // TODO: [studentId: number, name: string, scores: SubjectScore[]]

// 問題2: 成績データのサンプルを作成してください
const mathScore: SubjectScore = // TODO: 数学の成績データ
const englishScore: SubjectScore = // TODO: 英語の成績データ
const japaneseScore: SubjectScore = // TODO: 国語の成績データ

const studentRecord: StudentRecord = // TODO: 学生レコードのサンプル

// 問題3: タプルの分割代入を使用してください
const [studentId, studentName, scores] = // TODO: studentRecordを分割代入

// 問題4: 成績配列から平均点を計算する関数を作成してください
function calculateAverage(scores: SubjectScore[]): number {
  // TODO: scoresから平均点を計算（分割代入を活用）
}

// 問題5: 成績配列から科目名の配列を取得する関数を作成してください
function getSubjectNames(scores: SubjectScore[]): string[] {
  // TODO: scoresから科目名のみを抽出
}
```

### 練習問題2-2: 名前付きタプルとオプショナル要素（10分）

```typescript
// 問題1: 名前付きタプルを定義してください
type StudentGrade = [
  // TODO: studentId: number, name: string, grade: number, semester?: "spring" | "fall"
];

// 問題2: 教室の座標を表すタプルを定義してください
type ClassroomPosition = // TODO: [row: number, column: number, floor?: number]

// 問題3: API結果のタプル型を定義してください
type StudentApiResult =
  | // TODO: 成功時: [data: Student, error: null]
  | // TODO: 失敗時: [data: null, error: string]

// 問題4: 学生データを非同期で取得する関数を作成してください
async function fetchStudentData(id: number): Promise<StudentApiResult> {
  try {
    // TODO: 成功時のレスポンスを返す
  } catch (error) {
    // TODO: 失敗時のレスポンスを返す
  }
}

// 問題5: 残余要素を使ったタプルを定義してください
type StudentScores = [
  // TODO: name: string, mainSubject: number, ...otherSubjects: number[]
];

const student1Scores: StudentScores = // TODO: サンプルデータ
const [name, mainScore, ...otherScores] = // TODO: 分割代入
```

### 練習問題2-3: 関数オーバーロードの実践（20分）

```typescript
// 問題1: 学生検索の関数オーバーロードを定義してください
// IDで検索: Student | null を返す
// 名前で検索: Student[] を返す
// 条件で検索: Student[] を返す
function findStudent(id: number): Student | null;
function findStudent(name: string): Student[];
function findStudent(criteria: { grade?: number; minGpa?: number }): Student[];
function findStudent(
  input: number | string | { grade?: number; minGpa?: number }
): Student | Student[] | null {
  // TODO: 実装を完成させてください
  const students: Student[] = [
    // サンプルデータ
  ];

  if (typeof input === "number") {
    // TODO: IDで検索
  } else if (typeof input === "string") {
    // TODO: 名前で検索
  } else {
    // TODO: 条件で検索
  }
}

// 問題2: 成績計算の関数オーバーロードを定義してください
function calculateGrade(scores: number[]): number;
function calculateGrade(grades: SubjectGrade[]): number;
function calculateGrade(student: Student): number;
function calculateGrade(input: number[] | SubjectGrade[] | Student): number {
  // TODO: 実装を完成させてください
}

// 問題3: データ変換の関数オーバーロードを定義してください
function formatStudentData(student: Student): string;
function formatStudentData(students: Student[]): string[];
function formatStudentData(student: Student, format: "detailed"): string;
function formatStudentData(students: Student[], format: "summary"): string;
function formatStudentData(
  input: Student | Student[],
  format?: "detailed" | "summary"
): string | string[] {
  // TODO: 実装を完成させてください
}
```

---

## Session3 練習問題：プロジェクト完成

### 練習問題3-1: 基本型定義の設計（20分）

```typescript
// 問題1: 学年の型定義を完成させてください
type Grade = // TODO: 1 | 2 | 3 | 4 | 5 | 6

// 問題2: 学生ステータスの型定義を完成させてください
type StudentStatus = // TODO: "active" | "inactive" | "graduated" | "transferred"

// 問題3: 学生の基本情報型を完成させてください
type Student = {
  // TODO: 以下のプロパティを定義
  // readonly id: number
  // name: string
  // grade: Grade
  // class: string
  // status: StudentStatus
  // birthDate: Date
  // guardianContact?: string
  // enrollmentDate: Date
  // updatedAt: Date
};

// 問題4: 学生登録時の入力データ型を完成させてください
type CreateStudentInput = // TODO: Studentから必要なプロパティのみを抽出

// 問題5: 学生情報更新時の入力データ型を完成させてください
type UpdateStudentInput = // TODO: 更新可能なプロパティのみをオプショナルで定義

// 問題6: 年齢範囲の型定義を完成させてください
type AgeRange = {
  // TODO: min?: number, max?: number
};

// 問題7: 検索条件の型定義を完成させてください
type SearchCriteria = {
  // TODO: name?, grade?, class?, status?, ageRange?
};

// 問題8: ソート条件の型定義を完成させてください
type SortField = // TODO: ソート可能なフィールド
type SortOrder = // TODO: "asc" | "desc"
type SortCriteria = {
  // TODO: field: SortField, order: SortOrder
};
```

### 練習問題3-2: 統計・分析用の型定義（15分）

```typescript
// 問題1: 学年別統計の型定義を完成させてください
type GradeStatistics = {
  // TODO: grade, totalStudents, averageAge, activeStudents, genderRatio, classCount
};

// 問題2: 学校統計の型定義を完成させてください
type SchoolStatistics = {
  // TODO: totalStudents, activeStudents, inactiveStudents, graduates, transfers, averageAge, gradeDistribution
};

// 問題3: 年齢分析の型定義を完成させてください
type AgeAnalysis = {
  // TODO: ageGroup, studentCount, percentage
};

// 問題4: 成績予測データの型定義を完成させてください
type AcademicForecast = {
  // TODO: studentId, period, predictedGrade, reasoning, confidence
};
```

### 練習問題3-3: API・サービス層の型定義（20分）

```typescript
// 問題1: 学生APIレスポンスの型定義を完成させてください
type StudentApiResponse = {
  // TODO: success, data?, error?, statusCode, timestamp
};

// 問題2: 学生一覧APIレスポンスの型定義を完成させてください
type StudentListApiResponse = {
  // TODO: success, data?, error?, statusCode, timestamp
};

// 問題3: ページネーション情報の型定義を完成させてください
type PaginationInfo = {
  // TODO: page, limit, total, totalPages, hasNext, hasPrev
};

// 問題4: ページネーション付きレスポンスの型定義を完成させてください
type PaginatedStudentResponse = {
  // TODO: data, pagination
};

// 問題5: 学生管理サービスの型定義を完成させてください
type StudentService = {
  // TODO: create, getById, list, update, delete, getStatistics, getGradeStatistics
};

// 問題6: バリデーションエラーの型定義を完成させてください
type ValidationError = {
  // TODO: field, message, code
};

// 問題7: バリデーション結果の型定義を完成させてください
type ValidationResult = {
  // TODO: isValid, errors
};

// 問題8: バリデータ関数の型定義を完成させてください
type NameValidator = // TODO: (name: string) => ValidationResult
type GradeValidator = // TODO: (grade: Grade) => ValidationResult
type ClassValidator = // TODO: (className: string) => ValidationResult
type BirthDateValidator = // TODO: (birthDate: Date) => ValidationResult

// 問題9: 学生バリデーションルールの型定義を完成させてください
type StudentValidationRules = {
  // TODO: nameValidator, gradeValidator, classValidator, birthDateValidator
};
```

---

## 総合演習問題

### 総合問題1: 型安全な学生管理システムの設計（30分）

以下の要件を満たす型定義を作成してください：

```typescript
// 要件1: 学生管理システムの名前空間を定義
namespace StudentManagement {
  // TODO: 基本型定義
  export type StudentId = // 学生ID（読み取り専用の数値）
  export type Grade = // 学年（1-6）
  export type StudentStatus = // ステータス

  // TODO: 学生型定義
  export type Student = {
    // 完全な学生情報
  };

  // TODO: 入力型定義
  export type CreateStudentInput = // 登録用
  export type UpdateStudentInput = // 更新用

  // TODO: 検索・フィルタ型定義
  export type SearchParams = {
    // 検索パラメータ
  };

  // TODO: 統計型定義
  export type StudentStatistics = {
    // 統計情報
  };

  // TODO: API型定義
  export type ApiResponse<T> = {
    // 汎用APIレスポンス
  };

  export type PaginatedResponse<T> = {
    // ページネーション付きレスポンス
  };

  // TODO: サービス型定義
  export type StudentService = {
    // 学生管理サービスのインターフェース
  };
}
```

### 総合問題2: 実践的な関数型定義（20分）

```typescript
// 問題1: 学生操作の結果型（Union型を活用）
type StudentOperationResult = 
  | // TODO: 成功時
  | // TODO: 失敗時

// 問題2: 学年ごとの学生配列型
type StudentsByGrade = {
  // TODO: 1年生から6年生までの学生配列
};

// 問題3: 学生検索結果の型定義
type StudentSearchResult = {
  // TODO: results, totalCount, searchCriteria, executionTime
};

// 問題4: 関数型定義
type CreateStudentFunction = // TODO: 学生登録関数
type SearchStudentFunction = // TODO: 学生検索関数
type ValidateStudentFunction = // TODO: 学生バリデーション関数
type CalculateAgeFunction = // TODO: 年齢計算関数
type CheckEnrollmentFunction = // TODO: 在籍チェック関数
```

---

## 解答例とヒント

### Session1 解答例

#### 練習問題1-1 解答例

```typescript
// 解答1: const assertionの適用
let theme = "dark" as const; // "dark"型
let config = {
  apiUrl: "https://api.example.com",
  timeout: 5000,
  retryCount: 3,
} as const; // 読み取り専用のリテラル型

// 解答2: 学生の成績基準
const GRADE_STANDARDS = {
  EXCELLENT: 90,
  GOOD: 80,
  AVERAGE: 70,
  POOR: 60,
} as const;

// 解答3: 学生のステータス
const STUDENT_STATUSES = [
  "active",
  "inactive", 
  "graduated",
  "transferred"
] as const;

// 解答4: 型の抽出
type GradeThreshold = (typeof GRADE_STANDARDS)[keyof typeof GRADE_STANDARDS]; // 90 | 80 | 70 | 60

// 解答5: 型の抽出
type StudentStatus = (typeof STUDENT_STATUSES)[number]; // "active" | "inactive" | "graduated" | "transferred"
```

#### 練習問題1-2 解答例

```typescript
// 解答1-5: 型定義
type Grade = 1 | 2 | 3 | 4 | 5 | 6;
type NotificationType = "info" | "warning" | "error" | "success";
type ID = string | number;
type SettingValue = boolean | "auto";

type StudentEvent =
  | { type: "enrollment"; studentId: number; date: Date }
  | { type: "graduation"; studentId: number; date: Date; ceremony: boolean }
  | { type: "transfer"; studentId: number; newSchool: string; reason?: string }
  | { type: "suspension"; studentId: number; startDate: Date; endDate: Date; reason: string };

// 解答6: イベント処理関数
function processStudentEvent(event: StudentEvent): string {
  switch (event.type) {
    case "enrollment":
      return `学生ID ${event.studentId} が ${event.date.toLocaleDateString()} に入学しました`;
    case "graduation":
      return `学生ID ${event.studentId} が ${event.date.toLocaleDateString()} に卒業しました${event.ceremony ? '（卒業式あり）' : ''}`;
    case "transfer":
      return `学生ID ${event.studentId} が ${event.newSchool} に転校しました${event.reason ? `。理由: ${event.reason}` : ''}`;
    case "suspension":
      return `学生ID ${event.studentId} が ${event.startDate.toLocaleDateString()} から ${event.endDate.toLocaleDateString()} まで停学です。理由: ${event.reason}`;
    default:
      const exhaustiveCheck: never = event;
      throw new Error(`未対応のイベントタイプ: ${exhaustiveCheck}`);
  }
}
```

### Session2 解答例

#### 練習問題2-1 解答例

```typescript
// 解答1-2: タプル型定義
type SubjectScore = [subject: string, score: number, maxScore: number];
type StudentRecord = [studentId: number, name: string, scores: SubjectScore[]];

// 解答2: サンプルデータ
const mathScore: SubjectScore = ["数学", 85, 100];
const englishScore: SubjectScore = ["英語", 92, 100];
const japaneseScore: SubjectScore = ["国語", 78, 100];

const studentRecord: StudentRecord = [
  1,
  "田中太郎",
  [mathScore, englishScore, japaneseScore]
];

// 解答3: 分割代入
const [studentId, studentName, scores] = studentRecord;

// 解答4: 平均点計算
function calculateAverage(scores: SubjectScore[]): number {
  const total = scores.reduce((sum, [, score]) => sum + score, 0);
  return total / scores.length;
}

// 解答5: 科目名抽出
function getSubjectNames(scores: SubjectScore[]): string[] {
  return scores.map(([subject]) => subject);
}
```

### Session3 解答例

#### 練習問題3-1 解答例

```typescript
// 解答1-8: 基本型定義
type Grade = 1 | 2 | 3 | 4 | 5 | 6;
type StudentStatus = "active" | "inactive" | "graduated" | "transferred";

type Student = {
  readonly id: number;
  name: string;
  grade: Grade;
  class: string;
  status: StudentStatus;
  birthDate: Date;
  guardianContact?: string;
  enrollmentDate: Date;
  updatedAt: Date;
};

type CreateStudentInput = Omit<Student, 'id' | 'status' | 'enrollmentDate' | 'updatedAt'>;

type UpdateStudentInput = Partial<Pick<Student, 'name' | 'grade' | 'class' | 'guardianContact' | 'status'>>;

type AgeRange = {
  min?: number;
  max?: number;
};

type SearchCriteria = {
  name?: string;
  grade?: Grade;
  class?: string;
  status?: StudentStatus;
  ageRange?: AgeRange;
};

type SortField = "name" | "grade" | "class" | "birthDate" | "enrollmentDate";
type SortOrder = "asc" | "desc";
type SortCriteria = {
  field: SortField;
  order: SortOrder;
};
```

## 🎯 学習のポイント

### ✅ 練習問題で習得すべきこと

1. **const assertion の活用**: より厳密な型推論の制御方法
2. **リテラル型と Union 型**: 具体的な値による型制約の実践
3. **構造的型付け**: 名前ではなく構造による型の互換性理解
4. **タプル型の実践**: 固定長配列の型安全な活用
5. **関数オーバーロード**: 引数に応じた戻り値型の制御
6. **実践的な型設計**: システム全体を見据えた型定義

### 📝 学習の進め方

1. **段階的に進める**: 各セッションの練習問題を順番に解く
2. **実際に動かす**: コードをコピーして実際に実行してみる
3. **エラーを確認**: 意図的に型エラーを発生させて、エラーメッセージを理解する
4. **解答と比較**: 自分の解答と解答例を比較して理解を深める
5. **応用に挑戦**: 総合演習問題で学習した内容を統合的に活用する

---

**📌 重要**: これらの練習問題は実際に動作するものです。コピーして実行し、改造して理解を深めてください。TypeScriptの型システムの強力さと柔軟性を実感できるはずです。