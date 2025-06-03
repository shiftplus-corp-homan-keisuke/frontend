# Session2: 継承と型設計実践（90分）

> 💡 **対象**: 他言語経験者（Session1完了者）  
> 🎯 **形式**: 講師サポート付き学習  
> ⏰ **時間**: 90分（休憩含む）

## 📅 セッション概要

**学習目標**:
- [ ] インターフェース継承の理解と実践
- [ ] 型エイリアスとインターフェースの使い分け習得
- [ ] 複合的なデータモデル設計の実践
- [ ] 学生管理システムの型設計実装

**継続知識**:
- Session1: インターフェース基本概念、オプショナル・読み取り専用プロパティ
- Step01-02: TypeScript基本型、型推論、型エイリアス

---

## ⏰ 詳細タイムテーブル

| 時間 | 内容 | 講師の役割 | 学習者の活動 | 成果物 |
|------|------|------------|--------------|--------|
| **0-10分** | 前回復習・今回目標 | 復習確認・目標提示 | 振り返り・質問 | 理解確認 |
| **10-50分** | 継承と型設計の実践演習 | 実演・個別指導 | ハンズオン・実践 | 継承コード |
| **50-80分** | 学生管理システム実装 | コードレビュー・助言 | 個人開発 | システム設計 |
| **80-90分** | 成果共有・質疑応答 | ファシリテート | 発表・討論 | 学習成果 |

---

## 📚 学習内容

### Section 1: 前回復習（要点確認）

#### 🔍 Session1の重要ポイント確認

```typescript
// Session1で学習した基本インターフェース
interface Student {
  readonly id: number;
  readonly studentNumber: string;
  name: string;
  email: string;
  grade: number;
  club?: string;
}

// 今日はこれを発展させます
```

---

### Section 2: インターフェース継承

#### 🎯 継承の基本概念

**💡 なぜ継承が重要なのか**

継承により、共通の構造を持つインターフェースを効率的に定義できます。これにより以下の利点があります：

- **コードの再利用**: 共通プロパティを重複して定義する必要がない
- **保守性の向上**: 基底インターフェースの変更が継承先に自動反映
- **設計の明確化**: オブジェクト間の関係性が明確になる
- **拡張性**: 新しい要件に対して既存構造を活用して対応

#### 1. 基本的な継承

```typescript
// 基本的な人物情報
interface Person {
  readonly id: number;
  name: string;
  email: string;
  birthDate: Date;
}

// 学生は人物を継承
interface Student extends Person {
  readonly studentNumber: string;
  grade: number;
  major: string;
  club?: string;
}

// 教員も人物を継承
interface Teacher extends Person {
  readonly employeeNumber: string;
  department: string;
  position: "assistant" | "associate" | "professor";
  courses: string[];
}
```

**🚀 実際の使用例**

```typescript
const student: Student = {
  id: 1,
  name: "田中太郎",
  email: "tanaka@university.ac.jp",
  birthDate: new Date("2003-04-15"),
  studentNumber: "S2024001",
  grade: 2,
  major: "情報工学",
  club: "プログラミング研究会"
};

const teacher: Teacher = {
  id: 101,
  name: "佐藤教授",
  email: "sato@university.ac.jp", 
  birthDate: new Date("1975-08-20"),
  employeeNumber: "T2020001",
  department: "情報工学科",
  position: "professor",
  courses: ["TypeScript入門", "Web開発実践"]
};
```

#### 2. 複数インターフェースの継承

```typescript
// 連絡先情報
interface ContactInfo {
  phone?: string;
  address?: string;
  emergencyContact?: string;
}

// 学習記録
interface AcademicRecord {
  gpa: number;
  credits: number;
  enrollmentDate: Date;
}

// 学生は複数のインターフェースを継承
interface DetailedStudent extends Person, ContactInfo, AcademicRecord {
  readonly studentNumber: string;
  grade: number;
  major: string;
  club?: string;
}
```

#### 3. インターフェースの拡張と上書き

```typescript
// 基本的なユーザー
interface BaseUser {
  id: number;
  name: string;
  status: "active" | "inactive";
}

// 管理者ユーザー（statusを拡張）
interface AdminUser extends BaseUser {
  status: "active" | "inactive" | "suspended"; // より具体的な型
  permissions: string[];
  lastLogin: Date;
}
```

---

### Section 3: 型エイリアスとの使い分け

#### 🎯 使い分けのガイドライン

**💡 いつインターフェースを使い、いつ型エイリアスを使うか**

```typescript
// ✅ インターフェース: オブジェクトの構造定義
interface User {
  id: number;
  name: string;
  email: string;
}

// ✅ 型エイリアス: ユニオン型、プリミティブ型の別名
type UserStatus = "active" | "inactive" | "pending";
type UserId = number;

// ✅ 型エイリアス: 関数型
type EventHandler = (event: string) => void;

// ✅ インターフェース: 継承が必要な場合
interface Student extends User {
  studentNumber: string;
  grade: number;
}

// ❌ 型エイリアスでは継承できない
// type Student = User & { studentNumber: string; grade: number; }
// type DetailedStudent extends Student { ... } // エラー！
```

**🚀 実践的な使い分け例**

```typescript
// 型エイリアス: 状態やステータスの定義
type OrderStatus = "pending" | "confirmed" | "shipped" | "delivered";
type PaymentMethod = "credit" | "debit" | "paypal" | "bank";

// インターフェース: エンティティの構造定義
interface Order {
  readonly id: string;
  readonly customerId: string;
  readonly createdAt: Date;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  items: OrderItem[];
  totalAmount: number;
}

interface OrderItem {
  readonly productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
}
```

---

## 🎯 実践演習

### 演習 1: 学生管理システムの型設計 🔧

**要件**:
大学の学生管理システムの型定義を設計してください。

```typescript
// TODO: 以下の要件を満たす型定義を作成してください

// 1. 基本的な人物情報（Person）
// - id: 数値（変更不可）
// - name: 文字列
// - email: 文字列
// - birthDate: 日付

// 2. 連絡先情報（ContactInfo）
// - phone: 文字列（任意）
// - address: 文字列（任意）
// - emergencyContactName: 文字列（任意）
// - emergencyContactPhone: 文字列（任意）

// 3. 学生情報（Student）
// - Personを継承
// - ContactInfoを継承
// - studentNumber: 文字列（変更不可）
// - grade: 数値（1-4）
// - major: 文字列
// - advisor: 文字列（指導教員名）
// - club: 文字列（任意）

// 4. 成績情報（Grade）
// - studentId: 数値
// - courseCode: 文字列
// - courseName: 文字列
// - score: 数値（0-100）
// - semester: 文字列
// - year: 数値

// ここに型定義を作成してください
```

### 演習 2: システム操作関数の実装 🔧

**要件**:
学生管理システムの基本操作を実装してください。

```typescript
// TODO: 以下の関数を実装してください

// 1. 学生登録関数
function registerStudent(studentData: /* 適切な型 */): Student {
  // 実装してください
}

// 2. 学生検索関数（学籍番号）
function findStudentByNumber(
  students: Student[], 
  studentNumber: string
): Student | undefined {
  // 実装してください
}

// 3. 学年別学生一覧取得
function getStudentsByGrade(students: Student[], grade: number): Student[] {
  // 実装してください
}

// 4. 学生の成績追加
function addGrade(
  grades: Grade[], 
  newGrade: Grade
): Grade[] {
  // 実装してください
}

// 5. 学生のGPA計算
function calculateGPA(grades: Grade[], studentId: number): number {
  // 実装してください（100点満点を4.0満点に変換）
}
```

---

## 📝 解答例

### 演習 1 解答

```typescript
// 基本的な人物情報
interface Person {
  readonly id: number;
  name: string;
  email: string;
  birthDate: Date;
}

// 連絡先情報
interface ContactInfo {
  phone?: string;
  address?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
}

// 学生情報
interface Student extends Person, ContactInfo {
  readonly studentNumber: string;
  grade: number;
  major: string;
  advisor: string;
  club?: string;
}

// 成績情報
interface Grade {
  studentId: number;
  courseCode: string;
  courseName: string;
  score: number;
  semester: string;
  year: number;
}

// 学生登録用の型（IDは自動生成のため除外）
interface CreateStudentRequest {
  studentNumber: string;
  name: string;
  email: string;
  birthDate: Date;
  grade: number;
  major: string;
  advisor: string;
  phone?: string;
  address?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  club?: string;
}
```

### 演習 2 解答

```typescript
function registerStudent(studentData: CreateStudentRequest): Student {
  return {
    id: generateId(), // ID自動生成
    ...studentData
  };
}

function findStudentByNumber(
  students: Student[], 
  studentNumber: string
): Student | undefined {
  return students.find(student => student.studentNumber === studentNumber);
}

function getStudentsByGrade(students: Student[], grade: number): Student[] {
  return students.filter(student => student.grade === grade);
}

function addGrade(grades: Grade[], newGrade: Grade): Grade[] {
  return [...grades, newGrade];
}

function calculateGPA(grades: Grade[], studentId: number): number {
  const studentGrades = grades.filter(grade => grade.studentId === studentId);
  
  if (studentGrades.length === 0) return 0;
  
  const totalPoints = studentGrades.reduce((sum, grade) => {
    // 100点満点を4.0満点に変換
    const gpaPoint = (grade.score / 100) * 4.0;
    return sum + gpaPoint;
  }, 0);
  
  return Math.round((totalPoints / studentGrades.length) * 100) / 100;
}

// ヘルパー関数
function generateId(): number {
  return Math.floor(Math.random() * 10000) + 1;
}
```

---

## 🚀 ミニプロジェクト: 学生管理システム実装

### プロジェクト概要

Session1-2で学習した内容を活用して、実際に動作する学生管理システムを作成します。

```typescript
// システムの使用例
const students: Student[] = [];
const grades: Grade[] = [];

// 学生登録
const newStudent = registerStudent({
  studentNumber: "S2024001",
  name: "田中太郎",
  email: "tanaka@university.ac.jp",
  birthDate: new Date("2003-04-15"),
  grade: 2,
  major: "情報工学",
  advisor: "佐藤教授",
  phone: "090-1234-5678",
  club: "プログラミング研究会"
});

students.push(newStudent);

// 成績追加
const grade1 = {
  studentId: newStudent.id,
  courseCode: "CS101",
  courseName: "TypeScript入門",
  score: 95,
  semester: "春学期",
  year: 2024
};

grades.push(grade1);

// GPA計算
const gpa = calculateGPA(grades, newStudent.id);
console.log(`${newStudent.name}のGPA: ${gpa}`);

// 学年別検索
const secondYearStudents = getStudentsByGrade(students, 2);
console.log("2年生一覧:", secondYearStudents);
```

---

### 振り返り

**確認ポイント**:
- [ ] インターフェース継承を理解し実践できた
- [ ] 型エイリアスとの使い分けを習得した
- [ ] 複合的なデータモデルを設計できた
- [ ] 学生管理システムの基本実装ができた

---

## 📊 Session2 評価基準

### 実践スキルチェックリスト

- [ ] **インターフェース継承**: `extends` を使った基本継承と複数継承の実装
- [ ] **型エイリアスとの使い分け**: オブジェクト型にはインターフェース、ユニオン型には型エイリアスの適切な選択
- [ ] **複合的なデータモデル設計**: Person、ContactInfo、Student等の関連性のある型設計
- [ ] **学生管理システム実装**: 継承を活用した実用的なシステムの基本実装

### 成果物確認

- [ ] **継承を使った型定義**: Person → Student の継承関係を正しく実装
- [ ] **実践演習の完成**: 演習1（型設計）と演習2（システム操作関数）の完了
- [ ] **ミニプロジェクト実装**: 学生管理システムの基本機能実装
- [ ] **Session1知識の活用**: インターフェース基本概念を継承設計に応用

### ⚠️ よくある間違いと注意点

**継承設計での注意点:**
- ❌ **継承の過度な使用**: 5階層以上の深い継承チェーン
- ✅ **適切な継承深度**: 2-3階層程度の理解しやすい継承関係

**型エイリアスとの使い分けミス:**
- ❌ **オブジェクト型に型エイリアス**: `type User = { id: number; name: string; }`
- ✅ **オブジェクト型にはインターフェース**: `interface User { id: number; name: string; }`

**複合型設計での注意点:**
- ❌ **循環参照の発生**: インターフェース間で相互に参照し合う設計
- ✅ **一方向の依存関係**: 明確な階層構造を持つ設計

---

**📌 重要**: Session2で学習した継承と型設計の概念は、Session3でより実践的なシステム完成に発展させます。今日の内容をしっかりと理解して次回に臨みましょう！

**🌟 次回（Session3）は、学生管理システムの完成とデバッグに挑戦します！**