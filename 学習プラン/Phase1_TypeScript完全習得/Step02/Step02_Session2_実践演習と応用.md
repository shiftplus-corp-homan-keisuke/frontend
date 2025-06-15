# Session2: 実践演習と応用（90分）

> 💡 **対象**: 他言語経験者（Session1完了者）
> 🎯 **形式**: 講師サポート付き学習
> ⏰ **時間**: 90分（休憩含む）

## 📚 関連補足資料

このセッションの学習をサポートする補足資料をご用意しています：

- 💻 **[実践コード例](./Step02_補足_実践コード例.md)** - より実践的な例とシステム実装
- 📖 **[専門用語集](./Step02_補足_専門用語集.md)** - 配列・タプル・オブジェクト型などの詳細解説
- 🚨 **[トラブルシューティング](./Step02_補足_トラブルシューティング.md)** - 複合型エラーの対処法
- 🌐 **[参考リソース](./Step02_補足_参考リソース.md)** - さらなる学習のためのリソース
- 📋 **[補足資料](./Step02_補足資料.md)** - 実践的な開発のヒント

> 💡 **活用方法**: 学習中に疑問が生じた際や、より深く理解したい場合に参照してね 🐰

## 📅 セッション概要

**学習目標**:
- [ ] タプル型の詳細活用と名前付きタプル
- [ ] 関数オーバーロードの理解と実装
- [ ] 高度な配列操作と型安全性
- [ ] 学生管理システムでの実践的な型活用

**前提知識**:
- Session1の完了（高度な型推論・const assertion・構造的型付けの理解）
- Step01の学生管理システムの理解
- 配列・オブジェクトの基本的なJavaScript操作

---

## ⏰ 詳細タイムテーブル

| 時間 | 内容 | 講師の役割 | 学習者の活動 | 成果物 |
|------|------|------------|--------------|--------|
| **0-10分** | 前回復習・今回目標設定 | 復習確認・目標提示 | 振り返り・質問 | 理解確認 |
| **10-50分** | 複合型の実践演習 | 実演・個別指導 | ハンズオン・実践 | 複合型コード |
| **50-80分** | 関数型の実践演習 | コードレビュー・助言 | 個人開発・実装 | 関数型コード |
| **80-90分** | 成果共有・質疑応答 | ファシリテート | 発表・討論 | 学習成果 |

---

## 📚 学習内容

### Section 1: タプル型の詳細活用

> 📚 **関連資料**: [専門用語集 - タプル関連用語](./Step02_補足_専門用語集.md#タプル関連用語) | [実践コード例 - タプル型の実践](./Step02_補足_実践コード例.md#タプル型の実践)

#### 🔧 タプル型の高度な活用

**💡 なぜタプル型が重要なのか**

タプル型は、固定長で各要素の型が決まっている配列を表現します。学生管理システムでは、成績データ、座標、複数戻り値など、構造が決まっているデータの型安全な表現に重要です。

##### 1. 学生管理システムでのタプル型活用

```typescript
// 学生の基本情報（Step01からの発展）
interface Student {
  readonly id: number;
  name: string;
  grade: 1 | 2 | 3 | 4 | 5 | 6;
  subjects: readonly string[];
}

// 成績データをタプルで表現
type SubjectScore = [subject: string, score: number, maxScore: number];
type StudentRecord = [studentId: number, name: string, scores: SubjectScore[]];

// 実用例：成績処理システム
const mathScore: SubjectScore = ["数学", 85, 100];
const englishScore: SubjectScore = ["英語", 92, 100];
const japaneseScore: SubjectScore = ["国語", 78, 100];

const studentRecord: StudentRecord = [
  1,
  "田中太郎",
  [mathScore, englishScore, japaneseScore]
];

// タプルの分割代入
const [studentId, studentName, scores] = studentRecord;
console.log(`学生ID: ${studentId}, 名前: ${studentName}`);

// 成績タプルの処理
function calculateAverage(scores: SubjectScore[]): number {
  const total = scores.reduce((sum, [, score]) => sum + score, 0);
  return total / scores.length;
}

function getSubjectNames(scores: SubjectScore[]): string[] {
  return scores.map(([subject]) => subject);
}
```

##### 2. 名前付きタプルとオプショナル要素

```typescript
// 名前付きタプル（TypeScript 4.0+）
type StudentGrade = [
  studentId: number,
  name: string,
  grade: number,
  semester?: "spring" | "fall"  // オプショナル要素
];

// 学生の位置情報（教室の座標）
type ClassroomPosition = [row: number, column: number, floor?: number];

// API レスポンスのタプル型
type ApiResult<T> = [data: T, error: null] | [data: null, error: string];

// 学生データ取得の例
async function fetchStudentData(id: number): Promise<ApiResult<Student>> {
  try {
    // 実際のAPI呼び出し処理
    const student: Student = {
      id,
      name: "田中太郎",
      grade: 3,
      subjects: ["数学", "英語", "国語"]
    };
    return [student, null];
  } catch (error) {
    return [null, "学生データの取得に失敗しました"];
  }
}

// 使用例
const [studentData, error] = await fetchStudentData(1);
if (error) {
  console.error("エラー:", error);
} else {
  console.log("学生:", studentData.name);
}
```

##### 3. 残余要素とスプレッド演算子

```typescript
// 残余要素を使ったタプル
type StudentScores = [name: string, mainSubject: number, ...otherSubjects: number[]];

const student1Scores: StudentScores = ["田中太郎", 85, 92, 78, 88, 90];
const student2Scores: StudentScores = ["佐藤花子", 95, 88, 91];

// 分割代入での活用
const [name, mainScore, ...otherScores] = student1Scores;
console.log(`${name}の主要科目: ${mainScore}, その他: ${otherScores}`);

// 複数の学生データを結合
type CombinedScores = [...StudentScores, ...StudentScores];

function combineStudentScores(
  scores1: StudentScores,
  scores2: StudentScores
): CombinedScores {
  return [...scores1, ...scores2];
}
```

// 代替記法
let readonlyNames: ReadonlyArray<string> = ["Alice", "Bob", "Charlie"];

// 実用例：設定値の管理
const SUPPORTED_LANGUAGES: readonly string[] = ["ja", "en", "fr", "de"];

function isValidLanguage(lang: string): boolean {
  return SUPPORTED_LANGUAGES.includes(lang);
}

// イミュータブルな操作
function addLanguage(languages: readonly string[], newLang: string): readonly string[] {
  return [...languages, newLang];
}
```

#### 🎯 タプル型の実践活用

**💡 なぜタプル型が重要なのか**

タプル型は、固定長で各要素の型が決まっている配列を表現します。座標、RGB値、関数の複数戻り値など、構造が決まっているデータの型安全な表現に重要です。

##### 1. 基本的なタプル型

```typescript
// 基本的なタプル型
let coordinate: [number, number] = [10, 20]; // [x, y]
let rgbColor: [number, number, number] = [255, 128, 0]; // [R, G, B]
let userInfo: [string, number, boolean] = ["Alice", 30, true]; // [name, age, isActive]

// 実用例：API レスポンス
type ApiResult<T> = [T, null] | [null, string]; // [data, null] or [null, error]

function fetchUserData(id: number): ApiResult<User> {
  try {
    // 実際のAPI呼び出し処理
    const user: User = { id, name: "Alice", email: "alice@example.com", isActive: true };
    return [user, null];
  } catch (error) {
    return [null, "Failed to fetch user"];
  }
}

// 使用例
const [userData, error] = fetchUserData(1);
if (error) {
  console.error("Error:", error);
} else {
  console.log("User:", userData.name);
}
```

##### 2. 名前付きタプルとオプショナル要素

```typescript
// 名前付きタプル（TypeScript 4.0+）
type Point3D = [x: number, y: number, z: number];
type UserRecord = [id: number, name: string, email?: string];

// オプショナル要素
let point: Point3D = [10, 20, 30];
let user1: UserRecord = [1, "Alice", "alice@example.com"];
let user2: UserRecord = [2, "Bob"]; // emailは省略可能

// 残余要素
type NumbersWithLabel = [string, ...number[]];
let scores: NumbersWithLabel = ["Math", 85, 92, 78, 96];
let temperatures: NumbersWithLabel = ["Tokyo", 25.5, 28.2, 22.1];
```

### Section 2: 関数オーバーロードの実践

> 📚 **関連資料**: [専門用語集 - 関数オーバーロード関連用語](./Step02_補足_専門用語集.md#関数オーバーロード関連用語) | [実践コード例 - 関数オーバーロードの実践](./Step02_補足_実践コード例.md#関数オーバーロードの実践)

#### 🔧 関数オーバーロードの高度な活用

**💡 なぜ関数オーバーロードが重要なのか**

関数オーバーロードにより、同じ関数名で異なる引数パターンを型安全に処理できます。学生管理システムでは、検索条件や処理方法に応じて異なる型の戻り値を返す場合に重要です。

##### 1. 学生検索システムでの関数オーバーロード

```typescript
// 学生データの型定義（Step01からの発展）
interface Student {
  readonly id: number;
  name: string;
  grade: 1 | 2 | 3 | 4 | 5 | 6;
  subjects: readonly string[];
  gpa: number;
  enrollmentDate: Date;
}

// 関数オーバーロードの定義
function findStudent(id: number): Student | null;
function findStudent(name: string): Student[];
function findStudent(criteria: { grade?: number; minGpa?: number }): Student[];
function findStudent(
  input: number | string | { grade?: number; minGpa?: number }
): Student | Student[] | null {
  const students: Student[] = [
    { id: 1, name: "田中太郎", grade: 3, subjects: ["数学", "英語"], gpa: 3.8, enrollmentDate: new Date("2022-04-01") },
    { id: 2, name: "佐藤花子", grade: 2, subjects: ["国語", "理科"], gpa: 3.9, enrollmentDate: new Date("2023-04-01") },
    { id: 3, name: "鈴木次郎", grade: 3, subjects: ["数学", "社会"], gpa: 3.2, enrollmentDate: new Date("2022-04-01") },
  ];

  if (typeof input === "number") {
    // IDで検索：単一の学生またはnullを返す
    return students.find(student => student.id === input) || null;
  } else if (typeof input === "string") {
    // 名前で検索：該当する学生の配列を返す
    return students.filter(student =>
      student.name.toLowerCase().includes(input.toLowerCase())
    );
  } else {
    // 条件で検索：条件に合う学生の配列を返す
    return students.filter(student => {
      if (input.grade && student.grade !== input.grade) return false;
      if (input.minGpa && student.gpa < input.minGpa) return false;
      return true;
    });
  }
}

// 使用例
const studentById = findStudent(1); // Student | null
const studentsByName = findStudent("田中"); // Student[]
const highPerformers = findStudent({ minGpa: 3.5 }); // Student[]
```

##### 2. 成績処理での関数オーバーロード

```typescript
// 成績データの型定義
interface SubjectGrade {
  subject: string;
  score: number;
  maxScore: number;
  date: Date;
}

// 成績計算の関数オーバーロード
function calculateGrade(scores: number[]): number;
function calculateGrade(grades: SubjectGrade[]): number;
function calculateGrade(student: Student): number;
function calculateGrade(
  input: number[] | SubjectGrade[] | Student
): number {
  if (Array.isArray(input)) {
    if (typeof input[0] === "number") {
      // 数値配列の場合
      const scores = input as number[];
      return scores.reduce((sum, score) => sum + score, 0) / scores.length;
    } else {
      // SubjectGrade配列の場合
      const grades = input as SubjectGrade[];
      const totalScore = grades.reduce((sum, grade) => sum + grade.score, 0);
      return totalScore / grades.length;
    }
  } else {
    // Student オブジェクトの場合
    const student = input as Student;
    return student.gpa;
  }
}

// 使用例
const avgFromScores = calculateGrade([85, 92, 78]); // number
const avgFromGrades = calculateGrade([
  { subject: "数学", score: 85, maxScore: 100, date: new Date() },
  { subject: "英語", score: 92, maxScore: 100, date: new Date() }
]); // number
const studentGPA = calculateGrade(students[0]); // number
```

##### 3. データ変換での関数オーバーロード

```typescript
// データ変換の関数オーバーロード
function formatStudentData(student: Student): string;
function formatStudentData(students: Student[]): string[];
function formatStudentData(student: Student, format: "detailed"): string;
function formatStudentData(students: Student[], format: "summary"): string;
function formatStudentData(
  input: Student | Student[],
  format?: "detailed" | "summary"
): string | string[] {
  if (Array.isArray(input)) {
    if (format === "summary") {
      // 複数学生のサマリー
      return `総学生数: ${input.length}人, 平均GPA: ${
        input.reduce((sum, s) => sum + s.gpa, 0) / input.length
      }`;
    } else {
      // 複数学生の個別フォーマット
      return input.map(student =>
        `${student.name} (学年: ${student.grade}, GPA: ${student.gpa})`
      );
    }
  } else {
    if (format === "detailed") {
      // 詳細フォーマット
      return `学生ID: ${input.id}, 名前: ${input.name}, 学年: ${input.grade}, ` +
             `履修科目: ${input.subjects.join(", ")}, GPA: ${input.gpa}, ` +
             `入学日: ${input.enrollmentDate.toLocaleDateString()}`;
    } else {
      // 基本フォーマット
      return `${input.name} (学年: ${input.grade}, GPA: ${input.gpa})`;
    }
  }
}

// 使用例
const singleFormat = formatStudentData(students[0]); // string
const multipleFormat = formatStudentData(students); // string[]
const detailedFormat = formatStudentData(students[0], "detailed"); // string
const summaryFormat = formatStudentData(students, "summary"); // string
```

// 実用例：設定管理
interface AppConfig {
  readonly version: string;
  readonly buildDate: Date;
  apiUrl: string;
  timeout?: number;
  retryCount?: number;
  features: {
    darkMode: boolean;
    notifications: boolean;
    analytics?: boolean;
  };
}

// 設定のオーバーライド用の型定義（Step02範囲内）
interface ConfigOverrides {
  apiUrl?: string;
---

## 🎯 実践演習

> 🛠️ **演習サポート**: [トラブルシューティング - 高度な型機能でのよくある問題](./Step02_補足_トラブルシューティング.md#高度な型機能でのよくある問題) | [実践コード例 - 演習解答例とヒント](./Step02_補足_実践コード例.md#演習解答例とヒント)

### 演習 1: タプル型を活用した学生成績システム（20分）

以下の要件に従って、タプル型を活用した成績管理システムを作成してください：

```typescript
// TODO: 以下の型定義と関数を完成させてください

// 1. 成績データのタプル型定義
type SubjectScore = [
  // 科目名（文字列）
  // 点数（数値）
  // 満点（数値）
  // 試験日（Date型）
];

// 2. 学生の成績記録タプル型
type StudentGradeRecord = [
  // 学生ID（数値）
  // 学生名（文字列）
  // 学年（1-6の数値）
  // 成績配列（SubjectScore[]）
];

// 3. 成績分析結果のタプル型
type GradeAnalysis = [
  // 平均点（数値）
  // 最高点（数値）
  // 最低点（数値）
  // 合格科目数（数値）
];

// 4. 成績処理関数（関数オーバーロード）
function analyzeGrades(scores: SubjectScore[]): GradeAnalysis;
function analyzeGrades(student: StudentGradeRecord): GradeAnalysis;
function analyzeGrades(
  input: SubjectScore[] | StudentGradeRecord
): GradeAnalysis {
  // TODO: 実装してください
  // - SubjectScore[]の場合：直接分析
  // - StudentGradeRecordの場合：成績部分を抽出して分析
  // - 合格基準は60点以上とする
}

// 5. 成績データの作成と分析
const mathScore: SubjectScore = ["数学", 85, 100, new Date("2024-06-01")];
const englishScore: SubjectScore = ["英語", 92, 100, new Date("2024-06-02")];
const scienceScore: SubjectScore = ["理科", 78, 100, new Date("2024-06-03")];

const studentRecord: StudentGradeRecord = [
  1,
  "田中太郎",
  3,
  [mathScore, englishScore, scienceScore]
];

// 使用例
const analysis1 = analyzeGrades([mathScore, englishScore, scienceScore]);
const analysis2 = analyzeGrades(studentRecord);
```

### 演習 2: 関数オーバーロードを活用した学生検索システム（15分）

以下の要件に従って、関数オーバーロードを活用した検索システムを作成してください：

```typescript
// TODO: 以下の関数オーバーロードを完成させてください

// 学生データ（サンプル）
const students: Student[] = [
  { id: 1, name: "田中太郎", grade: 3, subjects: ["数学", "英語"], gpa: 3.8, enrollmentDate: new Date("2022-04-01") },
  { id: 2, name: "佐藤花子", grade: 2, subjects: ["国語", "理科"], gpa: 3.9, enrollmentDate: new Date("2023-04-01") },
  { id: 3, name: "鈴木次郎", grade: 3, subjects: ["数学", "社会"], gpa: 3.2, enrollmentDate: new Date("2022-04-01") },
  { id: 4, name: "田中花子", grade: 1, subjects: ["国語", "算数"], gpa: 3.5, enrollmentDate: new Date("2024-04-01") },
];

// 1. 学生検索関数のオーバーロード定義
function searchStudents(id: number): Student | null;
function searchStudents(name: string): Student[];
function searchStudents(criteria: { grade?: number; minGpa?: number; subject?: string }): Student[];
function searchStudents(
  input: number | string | { grade?: number; minGpa?: number; subject?: string }
): Student | Student[] | null {
  // TODO: 実装してください
  // - number: IDで検索（単一学生またはnull）
  // - string: 名前で部分一致検索（学生配列）
  // - object: 条件で検索（学生配列）
}

// 2. 成績フォーマット関数のオーバーロード定義
function formatStudentInfo(student: Student): string;
function formatStudentInfo(students: Student[]): string[];
function formatStudentInfo(student: Student, format: "detailed"): string;
function formatStudentInfo(students: Student[], format: "summary"): string;
function formatStudentInfo(
  input: Student | Student[],
  format?: "detailed" | "summary"
): string | string[] {
  // TODO: 実装してください
  // - 単一学生: 基本情報または詳細情報
  // - 複数学生: 個別情報配列またはサマリー文字列
}

// 3. 使用例とテスト
console.log("=== 学生検索システムのテスト ===");

// ID検索
const studentById = searchStudents(1);
console.log("ID検索:", studentById);

// 名前検索
const studentsByName = searchStudents("田中");
console.log("名前検索:", studentsByName);

// 条件検索
const highPerformers = searchStudents({ minGpa: 3.5 });
console.log("高成績者:", highPerformers);

// フォーマット
const basicInfo = formatStudentInfo(students[0]);
const detailedInfo = formatStudentInfo(students[0], "detailed");
const summaryInfo = formatStudentInfo(students, "summary");

console.log("基本情報:", basicInfo);
console.log("詳細情報:", detailedInfo);
console.log("サマリー:", summaryInfo);
```

---

## 📝 学習ポイント

### ✅ 今回のセッションで習得すべきこと

1. **タプル型の実践活用**: 固定長配列、名前付きタプル、オプショナル要素の使い分け
2. **関数オーバーロード**: 同じ関数名で異なる引数パターンの型安全な処理
3. **高度な配列操作**: 残余要素、スプレッド演算子、分割代入の活用
4. **学生管理システムでの実践**: Step01からの継続的な発展と型設計の向上

---

**📌 重要**: Session2 では高度な型機能を学習しました。タプル型と関数オーバーロードを活用して、より柔軟で型安全なコードを書けるようになりましょう。

**🌟 次回（Session3）は、学生管理システムの発展版を完成させ、Step02の学習を総括します！**
  return (num: number) => num * factor;
}

const double = createMultiplier(2);
const triple = createMultiplier(3);
```

---

## 🎯 実践演習

> 🛠️ **演習サポート**: [トラブルシューティング - 実践演習でのよくある問題](./Step02_補足_トラブルシューティング.md#実践演習でのよくある問題) | [実践コード例 - 演習解答例とヒント](./Step02_補足_実践コード例.md#演習解答例とヒント)

### 演習 1: ショッピングカート管理システム（30分）

以下の要件に従って、型安全なショッピングカートシステムを作成してください：

```typescript
// TODO: 以下の型定義と関数を完成させてください

// 1. 商品の型定義
interface Product {
  // 商品ID（数値）
  // 商品名（文字列）
  // 価格（数値）
  // カテゴリ（文字列）
  // 在庫状況（真偽値）
}

// 2. カートアイテムの型定義
interface CartItem {
  // 商品情報（Product型）
  // 数量（数値）
  // 追加日時（Date型）
}

// 3. カートの操作関数
class ShoppingCart {
  private items: CartItem[] = [];

  // 商品をカートに追加
  addItem(product: Product, quantity: number): void {
    // TODO: 実装
  }

  // 商品をカートから削除
  removeItem(productId: number): void {
    // TODO: 実装
  }

  // カート内の商品一覧を取得
  getItems(): readonly CartItem[] {
    // TODO: 実装
  }

  // 合計金額を計算
  getTotalPrice(): number {
    // TODO: 実装
  }

  // カート内の商品数を取得
  getItemCount(): number {
    // TODO: 実装
  }
}

// 4. 使用例のテストコード
const cart = new ShoppingCart();
const laptop: Product = {
  id: 1,
  name: "Gaming Laptop",
  price: 150000,
  category: "Electronics",
  inStock: true,
};

cart.addItem(laptop, 1);
console.log(`Total: ${cart.getTotalPrice()}円`);
console.log(`Items: ${cart.getItemCount()}個`);
```

### 演習 2: データ変換パイプライン（20分）

以下の要件に従って、型安全なデータ変換システムを作成してください：

```typescript
// TODO: 以下の型定義と関数を完成させてください

// 1. 生データの型定義
interface RawUserData {
  id: string; // 文字列のID
  full_name: string; // フルネーム
  email_address: string; // メールアドレス
  is_active: string; // "true" または "false"
  created_at: string; // ISO日付文字列
}

// 2. 変換後のデータ型定義
interface ProcessedUser {
  id: number; // 数値のID
  name: string; // 名前
  email: string; // メールアドレス
  isActive: boolean; // 真偽値
  createdAt: Date; // Date型
}

// 3. 変換関数
function transformUserData(rawData: RawUserData[]): ProcessedUser[] {
  // TODO: 実装
  // - IDを数値に変換
  // - full_nameをnameにリネーム
  // - email_addressをemailにリネーム
  // - is_activeを真偽値に変換
  // - created_atをDate型に変換
}

// 4. フィルタリング関数
function filterActiveUsers(users: ProcessedUser[]): ProcessedUser[] {
  // TODO: アクティブなユーザーのみを返す
}

// 5. ソート関数
function sortUsersByName(users: ProcessedUser[]): ProcessedUser[] {
  // TODO: 名前でソートして返す
}
```

---

## 📝 学習ポイント

### ✅ 今回のセッションで習得すべきこと

1. **配列型の実践活用**: 型安全な配列操作、読み取り専用配列の使用
2. **タプル型の理解**: 固定長配列、名前付きタプル、オプショナル要素
3. **オブジェクト型の設計**: インターフェース、オプショナルプロパティ、読み取り専用プロパティ
4. **関数型の詳細**: 関数型注釈、オプショナルパラメータ、関数オーバーロード

---

**📌 重要**: Session2 では実践的なコーディングを通じて型システムの活用を体感します。完璧を目指さず、まずは動くコードを作ることを重視しましょう。

**🌟 次回（Session3）は、プロジェクトの完成と学習の総括を行います！**
