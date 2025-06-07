# Session3: データモデル設計完成（60 分）

> 💡 **対象**: 他言語経験者（Session1-2 完了者）  
> 🎯 **形式**: 講師サポート付き学習  
> ⏰ **時間**: 60 分（集中セッション）

## 📚 関連補足資料

プロジェクト完成をサポートする補足資料をご用意しています：

- 💻 **[実践コード例](./Step03_補足_実践コード例.md)** - 完全なシステム実装例とベストプラクティス
- 🚨 **[トラブルシューティング](./Step03_補足_トラブルシューティング.md)** - デバッグとエラー解決の完全ガイド
- 📖 **[専門用語集](./Step03_補足_専門用語集.md)** - インターフェース・継承の詳細解説
- 🌐 **[参考リソース](./Step03_補足_参考リソース.md)** - 継続学習のためのリソース集
- 📋 **[補足資料](./Step03_補足資料.md)** - その他の重要な補足情報

> 💡 **活用方法**: 学習中に疑問が生じた際や、より深く理解したい場合に参照してね 🐰

## 📅 セッション概要

**学習目標**:

- [ ] 学生管理システムの完成とデバッグ
- [ ] 型安全性の検証と品質向上
- [ ] 成果発表とコードレビュー体験

**前提知識**:

- Session1-2 の完了（インターフェース・継承の理解）
- TypeScript 基本構文の理解
- 学生管理システムの部分実装

---

## ⏰ 詳細タイムテーブル

| 時間         | 内容                           | 講師の役割                 | 学習者の活動   | 成果物       |
| ------------ | ------------------------------ | -------------------------- | -------------- | ------------ |
| **0-10 分**  | 最終課題説明・目標設定         | 課題説明・期待値設定       | 理解・質問     | 実装計画     |
| **10-45 分** | データモデル設計完成・デバッグ | 個別サポート・デバッグ支援 | 開発・完成     | 完成システム |
| **45-60 分** | 成果発表・総括・次ステップ     | 評価・フィードバック       | 発表・振り返り | 学習成果     |

---

## 🎯 最終課題：学生管理システム完成

> 📚 **実装サポート**: [実践コード例 - 学生管理システム完全版](./Step03_補足_実践コード例.md#学生管理システム完全版) | [トラブルシューティング - デバッグガイド](./Step03_補足_トラブルシューティング.md#デバッグのコツ)

### 課題概要

Session1-2 で学習した内容を統合し、実用的な学生管理システムを完成させてください。

### 必須実装機能

#### 1. 基本型定義の実装（Session2 からの継続）

```typescript
// Session2で学習した型定義を確認してください
interface Person {
  readonly id: number;
  name: string;
  email: string;
  birthDate: Date;
}

interface Student extends Person {
  readonly studentNumber: string;
  grade: number;
  major: string;
  advisor: string;
  club?: string;
}

// 学生登録用のインターフェース（idを除く）
interface CreateStudentRequest {
  studentNumber: string;
  name: string;
  email: string;
  birthDate: Date;
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
```

#### 2. 基本機能の実装

```typescript
// 学生管理システムの基本機能を実装してください
class StudentManagementSystem {
  private students: Student[] = [];
  private grades: Grade[] = [];
  private nextId: number = 1;

  // 学生登録
  registerStudent(studentData: CreateStudentRequest): Student {
    // TODO: 実装してください
  }

  // 学生検索
  findStudentByNumber(studentNumber: string): Student | undefined {
    // TODO: 実装してください
  }

  // 成績追加（学生番号で指定）
  addGrade(gradeData: {
    studentNumber: string;
    courseCode: string;
    courseName: string;
    score: number;
    semester: string;
    year: number;
  }): boolean {
    // TODO: 実装してください
  }

  // GPA計算
  calculateGPA(studentId: number): number {
    // TODO: 実装してください
  }
}
```

#### 3. エラーハンドリング

```typescript
// 型安全なエラーハンドリングを実装してください
interface StudentError {
  type: "NOT_FOUND" | "INVALID_DATA" | "DUPLICATE";
  message: string;
}

function registerStudentSafe(
  studentData: CreateStudentRequest
): Student | StudentError {
  // バリデーション処理を実装してください
}
```

### 実装のヒント

1. **段階的実装**: 一つずつ機能を追加し、動作確認を行う
2. **型安全性**: すべての関数に適切な型注釈を付ける
3. **エラーハンドリング**: 想定される例外ケースを考慮する
4. **テストデータ**: 実装した機能をテストするためのサンプルデータを用意

---

### 📝 解答例 (最終課題)

```typescript
// 解答例 (最終課題)

// StudentManagementSystem クラスの実装例
class StudentManagementSystem {
  private students: Student[] = [];
  private grades: Grade[] = [];
  private nextId: number = 1;

  registerStudent(studentData: CreateStudentRequest): Student {
    const newStudent: Student = {
      id: this.nextId++,
      ...studentData,
    };
    this.students.push(newStudent);
    return newStudent;
  }

  findStudentByNumber(studentNumber: string): Student | undefined {
    return this.students.find((s) => s.studentNumber === studentNumber);
  }

  addGrade(gradeData: {
    studentNumber: string;
    courseCode: string;
    courseName: string;
    score: number;
    semester: string;
    year: number;
  }): boolean {
    const student = this.findStudentByNumber(gradeData.studentNumber);
    if (!student) {
      console.error(`Error: Student with number ${gradeData.studentNumber} not found.`);
      return false;
    }
    const newGrade: Grade = {
      studentId: student.id,
      ...gradeData,
    };
    this.grades.push(newGrade);
    return true;
  }

  calculateGPA(studentId: number): number {
    const studentGrades = this.grades.filter((g) => g.studentId === studentId);
    if (studentGrades.length === 0) {
      return 0.0;
    }
    const totalScore = studentGrades.reduce((sum, grade) => sum + grade.score, 0);
    return totalScore / studentGrades.length / 100 * 4; // 仮のGPA計算 (100点満点から4段階評価へ)
  }
}

// エラーハンドリングの実装例
function registerStudentSafe(
  system: StudentManagementSystem, // StudentManagementSystemのインスタンスを引数に追加
  studentData: CreateStudentRequest
): Student | StudentError {
  // バリデーション処理を実装してください
  if (!studentData.name || !studentData.email || !studentData.studentNumber) {
    return { type: "INVALID_DATA", message: "Name, email, and student number are required." };
  }

  if (system.findStudentByNumber(studentData.studentNumber)) {
    return { type: "DUPLICATE", message: `Student with number ${studentData.studentNumber} already exists.` };
  }

  const newStudent = system.registerStudent(studentData);
  return newStudent;
}

// 使用例
const system = new StudentManagementSystem();

const studentData1: CreateStudentRequest = {
  studentNumber: "S2024001",
  name: "田中太郎",
  email: "tanaka@university.ac.jp",
  birthDate: new Date("2003-04-15"),
  grade: 2,
  major: "情報工学",
  advisor: "佐藤教授",
  club: "プログラミング研究会",
};

const result1 = registerStudentSafe(system, studentData1);
if ("type" in result1) {
  console.error(`Error: ${result1.message}`);
} else {
  console.log("登録成功:", result1);
}

const studentData2: CreateStudentRequest = {
  studentNumber: "S2024001", // 重複データ
  name: "田中太郎",
  email: "tanaka@university.ac.jp",
  birthDate: new Date("2003-04-15"),
  grade: 2,
  major: "情報工学",
  advisor: "佐藤教授",
  club: "プログラミング研究会",
};

const result2 = registerStudentSafe(system, studentData2);
if ("type" in result2) {
  console.error(`Error: ${result2.message}`);
} else {
  console.log("登録成功:", result2);
}

system.addGrade({
  studentNumber: "S2024001",
  courseCode: "CS101",
  courseName: "TypeScript入門",
  score: 95,
  semester: "春学期",
  year: 2024,
});

system.addGrade({
  studentNumber: "S2024001",
  courseCode: "MA201",
  courseName: "線形代数",
  score: 80,
  semester: "春学期",
  year: 2024,
});

const student1 = system.findStudentByNumber("S2024001");
if (student1) {
  const gpa = system.calculateGPA(student1.id);
  console.log(`${student1.name}のGPA: ${gpa.toFixed(2)}`);
}
```
---

## 🎯 成果発表・総括・次ステップ（45-60 分）

### 発表準備（5 分）

実装した学生管理システムについて、以下の観点で簡潔に発表準備を行ってください：

1. **実装した機能の説明**
2. **使用したインターフェース・継承の設計**
3. **遭遇した問題とその解決方法**

### 成果発表（10 分）

各自、実装した内容を 3 分程度で発表してください。

### 振り返りと次ステップ（残り時間）

- 今回学習したインターフェース・継承の理解度確認
- Step04以降の学習準備（より高度な型機能の学習）
- 質疑応答

---

## 成果物

- [ ] **学生管理システム**: インターフェース・継承を活用した実用的なデータモデル設計 → [Step03 成果物](./Step03_成果物.md)で詳細確認

---

## 📊 Step03 総合評価

### 最終評価基準

#### 技術習得度（60%）

- [ ] **インターフェース基本概念**: 定義・オプショナル・readonly の理解と実装
- [ ] **継承と型設計**: extends、複数継承、型エイリアス使い分けの習得
- [ ] **データモデル設計**: 実用的なシステム設計の実践
- [ ] **型安全性の実装**: TypeScript の恩恵を活用した安全なコード作成

#### 実装品質（25%）

- [ ] **コードの可読性**: 変数名・インターフェース名の適切性
- [ ] **型安全性**: TypeScript の型システムを効果的に活用
- [ ] **保守性**: 拡張しやすいインターフェース設計
- [ ] **動作確認**: 実装した機能の正常動作

#### 学習姿勢（15%）

- [ ] **積極性**: 質問・議論への参加
- [ ] **問題解決**: 自力でのデバッグ・調査
- [ ] **協調性**: 他の学習者との協力
- [ ] **振り返り**: 学習内容の整理・次ステップの計画

**よくある質問**:

- Q: 「実際のプロジェクトではどの程度まで型定義すべきですか？」
- A: 「チームの合意とプロジェクトの要件に応じて調整しますが、公開 API や重要なデータ構造は必ず型定義することを推奨します」

- Q: 「パフォーマンスへの影響はありますか？」
- A: 「TypeScript の型システムはコンパイル時のみで、実行時のパフォーマンスには影響しません」

---

**🎉 お疲れ様でした！** Step03 を通じて TypeScript のインターフェースと継承を深く理解し、実践的なデータモデル設計能力を身につけることができました。

**📌 重要**: Session3 ではデータモデル設計の総仕上げとして、実践的なプロジェクトを完成させます。これまでの学習を活かして、自信を持って取り組みましょう。

🚀 次の Step04 では、より高度な型機能と実践的な開発手法を学習します！
