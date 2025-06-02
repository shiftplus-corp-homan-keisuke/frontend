# Session2: TypeScript実践演習（90分）

> 💡 **対象**: Session1完了者（基本型注釈理解済み）  
> 🎯 **形式**: 講師サポート付き実践学習  
> ⏰ **時間**: 90分

## 📅 セッション概要

**学習目標**:
- [ ] 関数・オブジェクトの型注釈の実践
- [ ] 型エイリアスの活用
- [ ] 実用的なTypeScriptコードの作成
- [ ] 学生情報システムの実装

**前提知識**:
- Session1の内容（基本型注釈）
- JavaScript ES6+構文の理解

---

## ⏰ 詳細タイムテーブル

| 時間 | 内容 | 講師の役割 | 学習者の活動 | 成果物 |
|------|------|------------|--------------|--------|
| **0-10分** | 前回復習・今回目標 | 復習確認・目標提示 | 振り返り・質問 | 理解確認 |
| **10-50分** | 関数・オブジェクト型実践 | 実演・個別指導 | ハンズオン・実践 | 実践コード |
| **50-80分** | 学生情報システム演習 | コードレビュー・助言 | 個人開発 | システム実装 |
| **80-90分** | 成果共有・質疑応答 | ファシリテート | 発表・討論 | 学習成果 |

---

## 📚 学習内容

### Section 1: 関数の型注釈（実践編）

#### 🔍 より実用的な関数の型注釈

```typescript
// 基本的な関数
function calculateBMI(weight: number, height: number): number {
  return weight / (height * height);
}

// オプショナルパラメータ
function greetUser(name: string, title?: string): string {
  if (title) {
    return `Hello, ${title} ${name}!`;
  }
  return `Hello, ${name}!`;
}

// デフォルトパラメータ
function createMessage(text: string, prefix: string = "Info"): string {
  return `[${prefix}] ${text}`;
}

// 残余パラメータ
function sum(...numbers: number[]): number {
  return numbers.reduce((total, num) => total + num, 0);
}

// 関数型の変数
type Calculator = (a: number, b: number) => number;

const add: Calculator = (a, b) => a + b;
const subtract: Calculator = (a, b) => a - b;
const multiply: Calculator = (a, b) => a * b;
```

#### 🎯 練習問題 1: 関数の型注釈（15分）

以下の要件を満たす関数を作成してください：

```typescript
// 1. ユーザーの年齢から成人かどうかを判定する関数
// 2. 配列の平均値を計算する関数（空配列の場合は0を返す）
// 3. 文字列を指定回数繰り返す関数（デフォルトは1回）

// ここに実装してください
```

---

### Section 2: オブジェクトの型注釈（実践編）

#### 🔍 型エイリアスの活用

```typescript
// 基本的な型エイリアス
type UserID = number;
type UserName = string;
type UserEmail = string;

// オブジェクト型のエイリアス
type User = {
  id: UserID;
  name: UserName;
  email: UserEmail;
  age: number;
  isActive: boolean;
};

// オプショナルプロパティ
type UserProfile = {
  user: User;
  bio?: string;           // オプショナル
  avatar?: string;        // オプショナル
  lastLogin: Date;
};

// ネストしたオブジェクト
type Address = {
  street: string;
  city: string;
  country: string;
  zipCode: string;
};

type UserWithAddress = {
  id: UserID;
  name: UserName;
  email: UserEmail;
  address: Address;
};
```

#### 🔍 配列とオブジェクトの組み合わせ

```typescript
// ユーザーの配列
type Users = User[];

// 成績データ
type Grade = {
  subject: string;
  score: number;
  date: Date;
};

type Student = {
  id: number;
  name: string;
  email: string;
  grades: Grade[];
};

// 学生の配列
type Students = Student[];

// 関数での使用例
function findStudentById(students: Students, id: number): Student | null {
  const student = students.find(s => s.id === id);
  return student || null;
}

function calculateAverageGrade(student: Student): number {
  if (student.grades.length === 0) return 0;
  
  const total = student.grades.reduce((sum, grade) => sum + grade.score, 0);
  return total / student.grades.length;
}
```

#### 🎯 練習問題 2: オブジェクト型の設計（20分）

以下の要件を満たす型定義を作成してください：

```typescript
// 1. 商品情報を表す型（ID、名前、価格、在庫数、カテゴリ）
// 2. 注文情報を表す型（注文ID、商品リスト、合計金額、注文日）
// 3. 商品を検索する関数（名前またはカテゴリで検索）

// ここに実装してください
```

---

### Section 3: 学生情報システム実装

#### 🎯 メイン演習: 学生情報処理システム

以下のJavaScriptコードにTypeScriptの型注釈を追加し、型安全なシステムを作成してください。

```typescript
// 既存のJavaScriptコード（型注釈を追加してください）

// 学生データの型定義
// TODO: Student型を定義してください

// 成績データの型定義  
// TODO: Grade型を定義してください

// 学生リスト
let students = [];

// 学生を作成する関数
function createStudent(name, age, email) {
  return {
    id: Date.now(), // 簡易的なID生成
    name: name,
    age: age,
    email: email,
    grades: []
  };
}

// 学生を追加する関数
function addStudent(name, age, email) {
  const student = createStudent(name, age, email);
  students.push(student);
  return student;
}

// 成績を追加する関数
function addGrade(studentId, subject, score) {
  const student = students.find(s => s.id === studentId);
  if (!student) {
    throw new Error("Student not found");
  }
  
  const grade = {
    subject: subject,
    score: score,
    date: new Date()
  };
  
  student.grades.push(grade);
  return grade;
}

// 平均点を計算する関数
function calculateAverage(studentId) {
  const student = students.find(s => s.id === studentId);
  if (!student || student.grades.length === 0) {
    return 0;
  }
  
  const total = student.grades.reduce((sum, grade) => sum + grade.score, 0);
  return total / student.grades.length;
}

// 学生一覧を取得する関数
function getAllStudents() {
  return students;
}

// 学生を検索する関数
function findStudentByName(name) {
  return students.filter(student => 
    student.name.toLowerCase().includes(name.toLowerCase())
  );
}

// 成績優秀者を取得する関数（平均80点以上）
function getTopStudents() {
  return students.filter(student => {
    const average = calculateAverage(student.id);
    return average >= 80;
  });
}

// 使用例
console.log("=== 学生情報システム ===");

// 学生を追加
const student1 = addStudent("田中太郎", 20, "tanaka@example.com");
const student2 = addStudent("佐藤花子", 19, "sato@example.com");
const student3 = addStudent("鈴木次郎", 21, "suzuki@example.com");

// 成績を追加
addGrade(student1.id, "数学", 85);
addGrade(student1.id, "英語", 92);
addGrade(student1.id, "国語", 78);

addGrade(student2.id, "数学", 95);
addGrade(student2.id, "英語", 88);
addGrade(student2.id, "国語", 91);

addGrade(student3.id, "数学", 72);
addGrade(student3.id, "英語", 68);
addGrade(student3.id, "国語", 75);

// 結果表示
console.log("全学生:", getAllStudents());
console.log("田中の平均点:", calculateAverage(student1.id));
console.log("成績優秀者:", getTopStudents());
```

#### 🎯 実装のヒント

1. **型定義から始める**: まず必要な型を定義してから関数に適用
2. **段階的に進める**: 一つずつ関数に型注釈を追加
3. **エラーを確認**: TypeScriptコンパイラのエラーメッセージを読む
4. **テストしながら進める**: 各関数が正しく動作することを確認

---

## 👨‍🏫 講師サポートポイント

### 🔍 重点サポート箇所

1. **型エイリアスの理解**: いつ使うべきか、どう命名するか
2. **オプショナルプロパティ**: `?` の使い方と意味
3. **配列とオブジェクトの組み合わせ**: ネストした型の扱い
4. **エラーメッセージの読み方**: TypeScriptエラーの解釈

### 🤔 よくある質問と回答

**Q: 型エイリアスはいつ使うべきですか？**
A: 同じ型を複数箇所で使う場合、複雑な型を簡潔に表現したい場合、型に意味のある名前を付けたい場合に使用します。

**Q: オプショナルプロパティとundefinedの違いは？**
A: オプショナルプロパティ（`?`）はプロパティ自体が存在しない可能性があることを示し、`undefined`は値が未定義であることを示します。

**Q: 配列の型注釈で `Array<T>` と `T[]` の違いは？**
A: 機能的には同じですが、`T[]` の方が簡潔で一般的です。ジェネリクスを学習後は `Array<T>` の意味も理解できます。

### 🎯 個別サポート時の注意点

- 実装に詰まった学習者には段階的なヒントを提供
- エラーメッセージを一緒に読んで理解を促進
- 完成度より理解度を重視した指導
- 他の学習者の進度も考慮した時間配分

---

## 📊 Session2 評価基準

### 理解度チェックリスト

- [ ] 関数の型注釈を適切に書ける
- [ ] オブジェクトの型注釈を設計できる
- [ ] 型エイリアスを効果的に使える
- [ ] 実用的なTypeScriptコードを作成できる
- [ ] TypeScriptエラーを読んで修正できる

### 成果物

- [ ] 練習問題1の完成（関数の型注釈）
- [ ] 練習問題2の完成（オブジェクト型設計）
- [ ] 学生情報システムの型安全化

### 次回への準備

- [ ] 作成したコードの動作確認
- [ ] 理解できなかった部分の整理
- [ ] Session3で完成させるプロジェクトの構想

---

**📌 重要**: Session2では実践的なコーディングを通じてTypeScriptの型システムを体感します。完璧を目指さず、まずは動くコードを作ることを重視しましょう。

**🌟 次回（Session3）は、プロジェクトの完成と学習の総括を行います！**