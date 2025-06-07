# Session2: 継承と型設計実践（90 分）

> 💡 **対象**: 他言語経験者（Session1 完了者）  
> 🎯 **形式**: 講師サポート付き学習  
> ⏰ **時間**: 90 分（休憩含む）

## 📚 関連補足資料

このセッションの学習をサポートする補足資料をご用意しています：

- 📖 **[専門用語集](./Step03_補足_専門用語集.md)** - 継承・型設計の詳細解説
- 💻 **[実践コード例](./Step03_補足_実践コード例.md)** - 継承とコンポジションの実践パターン
- 🚨 **[トラブルシューティング](./Step03_補足_トラブルシューティング.md)** - 継承・実装関連のエラー解決ガイド
- 🌐 **[参考リソース](./Step03_補足_参考リソース.md)** - 設計パターン・SOLID 原則の学習リソース
- 📋 **[補足資料](./Step03_補足資料.md)** - その他の重要な補足情報

> 💡 **活用方法**: 学習中に疑問が生じた際や、より深く理解したい場合に参照してね 🐰

## 📅 セッション概要

**学習目標**:

- [ ] インターフェース継承の理解と実践
- [ ] 型エイリアスとインターフェースの使い分け習得
- [ ] 複合的なデータモデル設計の実践
- [ ] 学生管理システムの型設計実装

**継続知識**:

- Session1: インターフェース基本概念、オプショナル・読み取り専用プロパティ
- Step01-02: TypeScript 基本型、型推論、型エイリアス

---

## ⏰ 詳細タイムテーブル

| 時間         | 内容                   | 講師の役割           | 学習者の活動     | 成果物       |
| ------------ | ---------------------- | -------------------- | ---------------- | ------------ |
| **0-10 分**  | 前回復習・今回目標     | 復習確認・目標提示   | 振り返り・質問   | 理解確認     |
| **10-50 分** | 継承と型設計の実践演習 | 実演・個別指導       | ハンズオン・実践 | 継承コード   |
| **50-80 分** | 学生管理システム実装   | コードレビュー・助言 | 個人開発         | システム設計 |
| **80-90 分** | 成果共有・質疑応答     | ファシリテート       | 発表・討論       | 学習成果     |

---

## 📚 学習内容

### Section 1: 前回復習（要点確認）

#### 🔍 Session1 の重要ポイント確認

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

> 📚 **関連資料**: [専門用語集 - 継承と拡張](./Step03_補足_専門用語集.md#継承と拡張) | [実践コード例 - 継承パターン](./Step03_補足_実践コード例.md#継承パターン)

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
  club: "プログラミング研究会",
};

const teacher: Teacher = {
  id: 101,
  name: "佐藤教授",
  email: "sato@university.ac.jp",
  birthDate: new Date("1975-08-20"),
  employeeNumber: "T2020001",
  department: "情報工学科",
  position: "professor",
  courses: ["TypeScript入門", "Web開発実践"],
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

> 📚 **関連資料**: [専門用語集 - 型エイリアス vs インターフェース](./Step03_補足_専門用語集.md#型エイリアス-vs-インターフェース) | [実践コード例 - 使い分けパターン](./Step03_補足_実践コード例.md#使い分けパターン)

#### 🎯 基本的な使い分けのガイドライン

**💡 Step03レベルでの使い分け**

```typescript
// ✅ インターフェース: オブジェクトの構造定義
interface User {
  id: number;
  name: string;
  email: string;
}

// ✅ 型エイリアス: 基本的な別名定義
type UserId = number;

// ✅ インターフェース: 継承が必要な場合
interface Student extends User {
  studentNumber: string;
  grade: number;
}
```

**🚀 実践的な使い分け例**

```typescript
// 型エイリアス: 基本的な型の別名
type StudentId = number;
type CourseName = string;

// インターフェース: エンティティの構造定義
interface Course {
  readonly id: StudentId;
  readonly courseCode: string;
  courseName: CourseName;
  credits: number;
  instructor: string;
}

interface Enrollment {
  readonly studentId: StudentId;
  readonly courseId: StudentId;
  enrollmentDate: Date;
  status: string;
}
```

---

### 🤔 よくある質問と回答

**Q: インターフェースと型エイリアスはどう使い分けるべきですか？**
A: Step03レベルでは、オブジェクトの構造定義にはインターフェース、基本的な型の別名には型エイリアスを使用します。インターフェースは`extends`キーワードで継承できるため、拡張性が必要な場合に適しています。

**Q: 継承を使うとコードが複雑になりませんか？**
A: 適切に使えばコードの再利用性と保守性を高めますが、過度な継承は避けるべきです。Step03では基本的な継承パターンに集中し、複雑な設計は後のステップで学習します。

---

### Section 4: 学生管理システム実装（メイン演習）

> 📚 **サポート資料**: [実践コード例 - 学生管理システム完全版](./Step03_補足_実践コード例.md#学生管理システム完全版) | [トラブルシューティング - デバッグガイド](./Step03_補足_トラブルシューティング.md#デバッグガイド)

#### 🎯 メイン演習: 学生管理システム

Session1-2 で学習した内容を活用して、実際に動作する学生管理システムを作成します。

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
  club: "プログラミング研究会",
});

students.push(newStudent);

// 成績追加
const grade1 = {
  studentId: newStudent.id,
  courseCode: "CS101",
  courseName: "TypeScript入門",
  score: 95,
  semester: "春学期",
  year: 2024,
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

**📌 重要**: Session2 では実践的なコーディングを通じてインターフェース継承の活用を体感します。完璧を目指さず、まずは動くコードを作ることを重視しましょう。

**🌟 次回（Session3）は、プロジェクトの完成と学習の総括を行います！**

