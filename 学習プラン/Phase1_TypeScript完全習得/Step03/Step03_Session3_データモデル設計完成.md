# Session3: データモデル設計完成（60分）

> 💡 **対象**: 他言語経験者（Session1-2完了者）  
> 🎯 **形式**: 講師サポート付き学習  
> ⏰ **時間**: 60分（集中セッション）

## 📅 セッション概要

**学習目標**:
- [ ] 学生管理システムの完成とデバッグ
- [ ] 型安全性の検証と品質向上
- [ ] 成果発表とコードレビュー体験
- [ ] Step04への準備と学習継続計画

**成果物**:
- 完成した学生管理システム
- 型安全なデータモデル設計
- Step03の学習成果まとめ

---

## ⏰ 詳細タイムテーブル

| 時間 | 内容 | 講師の役割 | 学習者の活動 | 成果物 |
|------|------|------------|--------------|--------|
| **0-10分** | 最終課題説明 | 課題説明・期待値設定 | 理解・質問 | 実装計画 |
| **10-45分** | プロジェクト完成・デバッグ | 個別サポート・デバッグ支援 | 開発・完成 | 完成システム |
| **45-60分** | 成果発表・次Step準備 | 評価・フィードバック | 発表・振り返り | 学習成果 |

---

## 📚 最終課題

### 🎯 学生管理システム完成課題

**課題概要**:
Session1-2で学習した内容を統合し、実用的な学生管理システムを完成させてください。

#### 必須実装機能

```typescript
// 1. 完全な型定義システム
interface Person {
  readonly id: number;
  name: string;
  email: string;
  birthDate: Date;
}

interface ContactInfo {
  phone?: string;
  address?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
}

interface Student extends Person, ContactInfo {
  readonly studentNumber: string;
  grade: number;
  major: string;
  advisor: string;
  club?: string;
}

interface Grade {
  studentId: number;
  courseCode: string;
  courseName: string;
  score: number;
  semester: string;
  year: number;
}

// 2. システム操作関数
class StudentManagementSystem {
  private students: Student[] = [];
  private grades: Grade[] = [];
  private nextId: number = 1;

  // 学生登録
  registerStudent(studentData: CreateStudentRequest): Student {
    // TODO: 実装してください
  }

  // 学生検索（学籍番号）
  findStudentByNumber(studentNumber: string): Student | undefined {
    // TODO: 実装してください
  }

  // 学生検索（ID）
  findStudentById(id: number): Student | undefined {
    // TODO: 実装してください
  }

  // 学年別学生一覧
  getStudentsByGrade(grade: number): Student[] {
    // TODO: 実装してください
  }

  // 専攻別学生一覧
  getStudentsByMajor(major: string): Student[] {
    // TODO: 実装してください
  }

  // 成績追加
  addGrade(gradeData: {
    studentNumber: string;
    courseCode: string;
    courseName: string;
    score: number;
    semester: string;
    year: number;
  }): boolean {
    // TODO: 実装してください（学籍番号からstudentIdを解決）
  }

  // 学生の成績一覧取得
  getStudentGrades(studentId: number): Grade[] {
    // TODO: 実装してください
  }

  // GPA計算
  calculateGPA(studentId: number): number {
    // TODO: 実装してください
  }

  // 学生情報更新
  updateStudent(id: number, updates: UpdateStudentRequest): boolean {
    // TODO: 実装してください
  }

  // 全学生一覧
  getAllStudents(): Student[] {
    // TODO: 実装してください
  }

  // システム統計情報
  getSystemStats(): {
    totalStudents: number;
    studentsByGrade: Record<number, number>;
    studentsByMajor: Record<string, number>;
    averageGPA: number;
  } {
    // TODO: 実装してください
  }
}
```

#### 追加実装（チャレンジ課題）

```typescript
// 3. 高度な機能（任意実装）

// 成績統計
interface GradeStatistics {
  average: number;
  highest: number;
  lowest: number;
  passRate: number; // 60点以上の割合
}

// コース情報
interface Course {
  readonly code: string;
  name: string;
  credits: number;
  department: string;
  instructor: string;
}

// 履修登録
interface Enrollment {
  studentId: number;
  courseCode: string;
  semester: string;
  year: number;
  status: "enrolled" | "completed" | "dropped";
}

// システム拡張
class AdvancedStudentSystem extends StudentManagementSystem {
  private courses: Course[] = [];
  private enrollments: Enrollment[] = [];

  // コース管理
  addCourse(course: Course): void {
    // TODO: 実装してください
  }

  // 履修登録
  enrollStudent(studentId: number, courseCode: string, semester: string, year: number): boolean {
    // TODO: 実装してください
  }

  // コース別成績統計
  getCourseStatistics(courseCode: string): GradeStatistics {
    // TODO: 実装してください
  }

  // 学生の履修履歴
  getStudentTranscript(studentId: number): {
    student: Student;
    grades: Grade[];
    gpa: number;
    totalCredits: number;
  } {
    // TODO: 実装してください
  }
}
```

---

## 💻 実装ガイド

### 🔧 実装のポイント

#### 1. 型安全性の確保

```typescript
// ✅ 良い例: 型安全な実装
function registerStudent(studentData: CreateStudentRequest): Student {
  const newStudent: Student = {
    id: this.nextId++,
    ...studentData
  };
  
  // バリデーション
  if (!newStudent.name.trim()) {
    throw new Error("名前は必須です");
  }
  
  if (!newStudent.email.includes("@")) {
    throw new Error("有効なメールアドレスを入力してください");
  }
  
  if (newStudent.grade < 1 || newStudent.grade > 4) {
    throw new Error("学年は1-4の範囲で入力してください");
  }
  
  this.students.push(newStudent);
  return newStudent;
}

// ❌ 悪い例: 型安全性が不十分
function registerStudent(studentData: any): any {
  // 型チェックなし、エラーが起きやすい
  return { id: Math.random(), ...studentData };
}
```

#### 2. エラーハンドリング

```typescript
// ✅ 適切なエラーハンドリング
function findStudentByNumber(studentNumber: string): Student | undefined {
  if (!studentNumber.trim()) {
    throw new Error("学籍番号は必須です");
  }
  
  return this.students.find(student => student.studentNumber === studentNumber);
}

function addGrade(gradeData: {
  studentNumber: string;
  courseCode: string;
  courseName: string;
  score: number;
  semester: string;
  year: number;
}): boolean {
  const student = this.findStudentByNumber(gradeData.studentNumber);
  
  if (!student) {
    console.error(`学籍番号 ${gradeData.studentNumber} の学生が見つかりません`);
    return false;
  }
  
  if (gradeData.score < 0 || gradeData.score > 100) {
    console.error("成績は0-100の範囲で入力してください");
    return false;
  }
  
  const grade: Grade = {
    studentId: student.id,
    courseCode: gradeData.courseCode,
    courseName: gradeData.courseName,
    score: gradeData.score,
    semester: gradeData.semester,
    year: gradeData.year
  };
  
  this.grades.push(grade);
  return true;
}
```

#### 3. 実用的な機能実装

```typescript
// GPA計算の実装例
function calculateGPA(studentId: number): number {
  const studentGrades = this.grades.filter(grade => grade.studentId === studentId);
  
  if (studentGrades.length === 0) {
    return 0;
  }
  
  const totalPoints = studentGrades.reduce((sum, grade) => {
    // 100点満点を4.0満点に変換
    let gpaPoint: number;
    if (grade.score >= 90) gpaPoint = 4.0;
    else if (grade.score >= 80) gpaPoint = 3.0;
    else if (grade.score >= 70) gpaPoint = 2.0;
    else if (grade.score >= 60) gpaPoint = 1.0;
    else gpaPoint = 0.0;
    
    return sum + gpaPoint;
  }, 0);
  
  return Math.round((totalPoints / studentGrades.length) * 100) / 100;
}

// システム統計の実装例
function getSystemStats(): {
  totalStudents: number;
  studentsByGrade: Record<number, number>;
  studentsByMajor: Record<string, number>;
  averageGPA: number;
} {
  const studentsByGrade: Record<number, number> = {};
  const studentsByMajor: Record<string, number> = {};
  
  this.students.forEach(student => {
    // 学年別集計
    studentsByGrade[student.grade] = (studentsByGrade[student.grade] || 0) + 1;
    
    // 専攻別集計
    studentsByMajor[student.major] = (studentsByMajor[student.major] || 0) + 1;
  });
  
  // 全体平均GPA計算
  const allGPAs = this.students.map(student => this.calculateGPA(student.id));
  const averageGPA = allGPAs.length > 0 
    ? allGPAs.reduce((sum, gpa) => sum + gpa, 0) / allGPAs.length 
    : 0;
  
  return {
    totalStudents: this.students.length,
    studentsByGrade,
    studentsByMajor,
    averageGPA: Math.round(averageGPA * 100) / 100
  };
}
```

---

## 🎯 デモンストレーション

### 使用例とテストケース

```typescript
// システムの使用例
const system = new StudentManagementSystem();

// 学生登録
const student1 = system.registerStudent({
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

const student2 = system.registerStudent({
  studentNumber: "S2024002",
  name: "佐藤花子",
  email: "sato@university.ac.jp",
  birthDate: new Date("2003-08-20"),
  grade: 2,
  major: "情報工学",
  advisor: "田中教授"
});

// 成績追加
system.addGrade({
  studentNumber: "S2024001",
  courseCode: "CS101",
  courseName: "TypeScript入門",
  score: 95,
  semester: "春学期",
  year: 2024
});

system.addGrade({
  studentNumber: "S2024001",
  courseCode: "CS102",
  courseName: "Web開発基礎",
  score: 88,
  semester: "春学期",
  year: 2024
});

// 結果確認
console.log("=== 学生管理システム デモ ===");
console.log("1. 全学生一覧:");
system.getAllStudents().forEach(student => {
  console.log(`  ${student.name} (${student.studentNumber}) - ${student.major} ${student.grade}年`);
});

console.log("\n2. 田中太郎のGPA:");
const taroGPA = system.calculateGPA(student1.id);
console.log(`  GPA: ${taroGPA}`);

console.log("\n3. 2年生一覧:");
const secondYearStudents = system.getStudentsByGrade(2);
secondYearStudents.forEach(student => {
  console.log(`  ${student.name} - ${student.major}`);
});

console.log("\n4. システム統計:");
const stats = system.getSystemStats();
console.log(`  総学生数: ${stats.totalStudents}`);
console.log(`  学年別: ${JSON.stringify(stats.studentsByGrade)}`);
console.log(`  専攻別: ${JSON.stringify(stats.studentsByMajor)}`);
console.log(`  平均GPA: ${stats.averageGPA}`);
```

---

## 🎤 成果発表

### 発表内容

**各学習者は以下の内容で5分間発表してください**:

1. **実装した機能の紹介**（2分）
   - 基本機能の動作デモ
   - 工夫した点や特徴的な実装

2. **学習成果の振り返り**（2分）
   - Step03で学んだ重要なポイント
   - 実装中に困った点と解決方法

3. **今後の活用予定**（1分）
   - 実際のプロジェクトでの応用アイデア
   - 次のStepで学びたいこと

### 評価ポイント

**講師による評価基準**:
- [ ] **型安全性**: 適切な型定義とエラーハンドリング
- [ ] **機能完成度**: 必須機能の実装状況
- [ ] **コード品質**: 可読性と保守性
- [ ] **理解度**: 概念の正確な理解と説明

---

## 🔄 Step04への準備

### 次Step学習内容の予告

**Step04で学ぶこと**:
- ユニオン型と型ガード
- より柔軟な型システムの活用
- 条件分岐での型安全性
- 実践的な型ガード実装

### Step03の学習成果確認

**達成目標チェックリスト**:
- [ ] インターフェースの基本概念を完全に理解した
- [ ] 継承を使った効率的な型設計ができる
- [ ] 型エイリアスとの使い分けを習得した
- [ ] 実用的なデータモデルを設計・実装できる
- [ ] 型安全なシステムを構築できる

### 継続学習のアドバイス

**今後の学習で重要なポイント**:
1. **実践での活用**: 学習した内容を実際のプロジェクトで積極的に使用
2. **型設計の習慣化**: 新しい機能を作る際は必ず型から設計
3. **コードレビューの活用**: 他の人のコードから学ぶ姿勢
4. **継続的な改善**: 既存コードの型安全性を段階的に向上

---

## 📋 最終確認事項

### 提出物

**Session3終了時に以下を確認**:
- [ ] 完成した学生管理システムのコード
- [ ] 実装した機能の動作確認
- [ ] 学習振り返りシート（任意）

### 質疑応答

**よくある質問**:
- Q: 「実際のプロジェクトではどの程度まで型定義すべきですか？」
- A: 「チームの合意とプロジェクトの要件に応じて調整しますが、公開APIや重要なデータ構造は必ず型定義することを推奨します」

- Q: 「パフォーマンスへの影響はありますか？」
- A: 「TypeScriptの型システムはコンパイル時のみで、実行時のパフォーマンスには影響しません」

---

**🎉 お疲れさまでした！** Step03の学習を通じて、TypeScriptの型システムの基礎をしっかりと身につけることができました。Step04では、さらに柔軟で実践的な型システムの活用方法を学習していきます！