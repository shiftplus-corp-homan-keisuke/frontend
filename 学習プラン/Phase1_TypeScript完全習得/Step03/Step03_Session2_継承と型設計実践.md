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

- **コードの再利用**:
  共通プロパティやメソッドを基底インターフェースで一度定義すれば、それを継承するインターフェースで重複して定義する必要がなくなります。これにより、コードの記述量が減り、一貫性が保たれます。
- **保守性の向上**:
  基底インターフェースの定義を変更すると、それを継承している全てのインターフェースにその変更が自動的に反映されます。これにより、大規模なシステムでも変更漏れを防ぎ、保守作業の負担を軽減できます。
- **設計の明確化**:
  継承を用いることで、オブジェクト間の「is-a」関係（例: 「犬は動物の一種である」）を明確に表現できます。これにより、システムの構造が理解しやすくなり、より論理的で整理された設計が可能になります。
- **拡張性**:
  新しい機能や要件が追加された場合でも、既存の基底インターフェースを継承して新しいインターフェースを作成することで、既存のコードに影響を与えることなく機能を追加できます。これは、システムの柔軟性と将来的な変更への対応力を高めます。

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

// 実際の使用例
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

### 練習問題 2.1: インターフェース継承の応用 🔰

**要件**:
以下の要件を満たすインターフェースを定義してください。

1.  **`Shape` インターフェースの定義**:

    - `id`: 数値型（読み取り専用）
    - `color`: 文字列型
    - `getArea()`: 数値を返すメソッド

2.  **`Circle` インターフェースの定義**:

    - `Shape` を継承します。
    - `radius`: 数値型

3.  **`Rectangle` インターフェースの定義**:

    - `Shape` を継承します。
    - `width`: 数値型
    - `height`: 数値型

4.  **`Drawable` インターフェースの定義**:

    - `draw()`: `void` を返すメソッド

5.  **`ComplexCircle` インターフェースの定義**:
    - `Circle` と `Drawable` を複数継承します。
    - `center`: `{ x: number; y: number; }` 型のオブジェクト

```typescript
// TODO: 以下の要件を満たすインターフェースを定義してください

// 1. Shapeインターフェースを定義

// 2. Circleインターフェースを定義

// 3. Rectangleインターフェースを定義

// 4. Drawableインターフェースを定義

// 5. ComplexCircleインターフェースを定義

// 使用例
const myCircle: ComplexCircle = {
  id: 1,
  color: "red",
  radius: 10,
  center: { x: 0, y: 0 },
  getArea: () => Math.PI * 10 * 10,
  draw: () => console.log("Drawing circle"),
};

const myRectangle: Rectangle = {
  id: 2,
  color: "blue",
  width: 20,
  height: 10,
  getArea: () => 20 * 10,
};

console.log(myCircle.getArea());
myCircle.draw();
console.log(myRectangle.getArea());
```

---

### 解答例 2.1

```typescript
// 解答例 2.1
interface Shape {
  readonly id: number;
  color: string;
  getArea(): number;
}

interface Circle extends Shape {
  radius: number;
}

interface Rectangle extends Shape {
  width: number;
  height: number;
}

interface Drawable {
  draw(): void;
}

interface ComplexCircle extends Circle, Drawable {
  center: { x: number; y: number };
}
```

---

### Section 3: 型エイリアスとの使い分け

> 📚 **関連資料**: [専門用語集 - 型エイリアス vs インターフェース](./Step03_補足_専門用語集.md#型エイリアス-vs-インターフェース) | [実践コード例 - 使い分けパターン](./Step03_補足_実践コード例.md#使い分けパターン)

#### 🎯 基本的な使い分けのガイドライン

**使い分けの判断基準**

| 場面                   | 使用する構文 | 理由                         |
| ---------------------- | ------------ | ---------------------------- |
| オブジェクトの構造定義 | `interface`  | 宣言マージ可能、継承しやすい |
| 継承が必要             | `interface`  | `extends` キーワードで直感的 |
| 基本型の別名定義       | `type`       | シンプルで読みやすい         |
| ユニオン型・交差型     | `type`       | `interface` では表現困難     |
| ライブラリ拡張         | `interface`  | 宣言マージで既存型を拡張可能 |

**💡 Step03 レベルでの使い分け**

```typescript
// ✅ インターフェース: オブジェクトの構造定義
// 理由: 将来的に継承やライブラリ拡張の可能性がある
interface User {
  id: number;
  name: string;
  email: string;
}

// ✅ 型エイリアス: 基本的な別名定義
// 理由: 単純な型の別名なので、typeで十分
type UserId = number;

// ✅ インターフェース: 継承が必要な場合
// 理由: extendsキーワードで継承関係が明確
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

### 練習問題 3.1: 型エイリアスとインターフェースの使い分け 🔰

**要件**:
以下のシナリオに基づいて、型エイリアスとインターフェースを適切に使い分けて型定義を行ってください。

1.  **ユーザー ID の型定義**:

    - `UserId` という名前で、数値型を表現する型エイリアスを定義してください。

2.  **ユーザーの役割の型定義**:

    - `UserRole` という名前で、"admin" | "editor" | "viewer" のいずれかの文字列リテラル型を許容する型エイリアスを定義してください。

3.  **基本ユーザー情報のインターフェース定義**:

    - `BaseUser` という名前で、以下のプロパティを持つインターフェースを定義してください。
      - `id`: `UserId` 型（読み取り専用）
      - `name`: 文字列型
      - `email`: 文字列型

4.  **管理者ユーザー情報のインターフェース定義**:
    - `AdminUser` という名前で、`BaseUser` を継承し、以下のプロパティを持つインターフェースを定義してください。
      - `role`: `UserRole` 型（"admin"に固定）
      - `permissions`: 文字列の配列型
      - `lastLogin`: Date 型（任意）

```typescript
// TODO: 以下の要件を満たす型エイリアスとインターフェースを定義してください

// 1. ユーザーIDの型定義

// 2. ユーザーの役割の型定義

// 3. 基本ユーザー情報のインターフェース定義

// 4. 管理者ユーザー情報のインターフェース定義

// 使用例 (実装は不要、型定義のみ)
const admin: AdminUser = {
  id: 1,
  name: "管理者A",
  email: "adminA@example.com",
  role: "admin",
  permissions: ["read", "write", "delete"],
  lastLogin: new Date(),
};

const editor: BaseUser = {
  id: 2,
  name: "編集者B",
  email: "editorB@example.com",
};

console.log(admin);
console.log(editor);
```

---

### 解答例 3.1

```typescript
// 解答例 3.1
type UserId = number;
type UserRole = "admin" | "editor" | "viewer";

interface BaseUser {
  readonly id: UserId;
  name: string;
  email: string;
}

interface AdminUser extends BaseUser {
  role: "admin";
  permissions: string[];
  lastLogin?: Date;
}
```

---

### 🤔 よくある質問と回答

**Q: インターフェースと型エイリアスはどう使い分けるべきですか？**
A: Step03 レベルでは、オブジェクトの構造定義にはインターフェース、基本的な型の別名には型エイリアスを使用します。インターフェースは`extends`キーワードで継承できるため、拡張性が必要な場合に適しています。

**Q: 継承を使うとコードが複雑になりませんか？**
A: 適切に使えばコードの再利用性と保守性を高めますが、過度な継承は避けるべきです。Step03 では基本的な継承パターンに集中し、複雑な設計は後のステップで学習します。

---

### Section 4: 学生管理システム実装（メイン演習）

> 📚 **サポート資料**: [実践コード例 - 学生管理システム完全版](./Step03_補足_実践コード例.md#学生管理システム完全版) | [トラブルシューティング - デバッグガイド](./Step03_補足_トラブルシューティング.md#デバッグガイド)

#### 🎯 メイン演習: 学生管理システム

Session1-2 で学習した内容を活用して、実際に動作する学生管理システムを作成します。

### 練習問題 4.1: 学生管理システム実装 🔰

**要件**:
以下の要件を満たす学生管理システムを実装してください。

1. **`Person` インターフェースの定義**:

   - `id`: 数値型（読み取り専用）
   - `name`: 文字列型
   - `email`: 文字列型
   - `birthDate`: Date 型

2. **`Student` インターフェースの定義**:

   - `Person` を継承します
   - `studentNumber`: 文字列型（読み取り専用）
   - `grade`: 数値型
   - `major`: 文字列型
   - `advisor`: 文字列型
   - `phone`: 文字列型（任意）
   - `club`: 文字列型（任意）

3. **`Grade` インターフェースの定義**:

   - `studentId`: 数値型
   - `courseCode`: 文字列型
   - `courseName`: 文字列型
   - `score`: 数値型
   - `semester`: 文字列型
   - `year`: 数値型

4. **`registerStudent` 関数の実装**:

   - 引数: 学生情報（id を除く）
   - 戻り値: `Student` 型
   - 機能: 自動で ID を生成して学生オブジェクトを作成

5. **`calculateGPA` 関数の実装**:

   - 引数: 成績配列(`Grade[]`)、学生 ID(`number`)
   - 戻り値: `number`
   - 機能: 指定された学生の GPA を計算（100 点満点を 4.0 満点に変換）

6. **`getStudentsByGrade` 関数の実装**:
   - 引数: 学生配列(`Student[]`)、学年(`number`)
   - 戻り値: `Student[]`
   - 機能: 指定された学年の学生を抽出

```typescript
// TODO: 以下の要件を満たすインターフェースと関数を実装してください

// 1. Personインターフェースを定義

// 2. Studentインターフェースを定義

// 3. Gradeインターフェースを定義

// 4. registerStudent関数を実装

// 5. calculateGPA関数を実装

// 6. getStudentsByGrade関数を実装

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
const grade1: Grade = {
  studentId: newStudent.id,
  courseCode: "CS101",
  courseName: "TypeScript入門",
  score: 95,
  semester: "春学期",
  year: 2024,
};

const grade2: Grade = {
  studentId: newStudent.id,
  courseCode: "CS102",
  courseName: "Web開発基礎",
  score: 88,
  semester: "春学期",
  year: 2024,
};

grades.push(grade1, grade2);

// GPA計算
const gpa = calculateGPA(grades, newStudent.id);
console.log(`${newStudent.name}のGPA: ${gpa.toFixed(2)}`);

// 学年別検索
const secondYearStudents = getStudentsByGrade(students, 2);
console.log("2年生一覧:", secondYearStudents);
```

---

### 解答例 4.1

```typescript
// 解答例 4.1
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
  phone?: string;
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

let nextStudentId = 1;

function registerStudent(studentData: Omit<Student, "id">): Student {
  return {
    id: nextStudentId++,
    ...studentData,
  };
}

function calculateGPA(grades: Grade[], studentId: number): number {
  const studentGrades = grades.filter((grade) => grade.studentId === studentId);

  if (studentGrades.length === 0) {
    return 0;
  }

  const totalPoints = studentGrades.reduce((sum, grade) => {
    // 100点満点を4.0満点に変換
    const gpaPoint = (grade.score / 100) * 4.0;
    return sum + gpaPoint;
  }, 0);

  return totalPoints / studentGrades.length;
}

function getStudentsByGrade(students: Student[], grade: number): Student[] {
  return students.filter((student) => student.grade === grade);
}
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
