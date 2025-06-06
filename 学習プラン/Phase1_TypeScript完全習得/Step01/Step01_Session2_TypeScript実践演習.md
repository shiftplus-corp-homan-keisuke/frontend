# Session2: TypeScript 実践演習（90 分）

> 💡 **対象**: Session1 完了者（基本型注釈理解済み）
> 🎯 **形式**: 講師サポート付き実践学習
> ⏰ **時間**: 90 分

## 📚 関連補足資料

このセッションの学習をサポートする補足資料をご用意しています：

- 💻 **[実践コード例](./Step01_補足_実践コード例.md)** - より実践的な例とシステム実装
- 📖 **[専門用語集](./Step01_補足_専門用語集.md)** - 型エイリアス、オプショナルプロパティなどの詳細解説
- 🚨 **[トラブルシューティング](./Step01_補足_トラブルシューティング.md)** - TypeScript エラーの対処法
- 🌐 **[参考リソース](./Step01_補足_参考リソース.md)** - さらなる学習のためのリソース
- 🔧 **[開発環境ガイド](./Step01_補足_開発環境ガイド.md)** - 開発効率を上げる設定

> 💡 **活用方法**: 学習中に疑問が生じた際や、より深く理解したい場合に参照してね 🐰

## 📅 セッション概要

**学習目標**:

- [ ] 関数・オブジェクトの型注釈の実践
- [ ] 型エイリアスの活用
- [ ] 実用的な TypeScript コードの作成
- [ ] 学生情報システムの実装

**前提知識**:

- Session1 の内容（基本型注釈）
- JavaScript ES6+構文の理解

---

## ⏰ 詳細タイムテーブル

| 時間         | 内容                     | 講師の役割           | 学習者の活動     | 成果物       |
| ------------ | ------------------------ | -------------------- | ---------------- | ------------ |
| **0-10 分**  | 前回復習・今回目標       | 復習確認・目標提示   | 振り返り・質問   | 理解確認     |
| **10-50 分** | 関数・オブジェクト型実践 | 実演・個別指導       | ハンズオン・実践 | 実践コード   |
| **50-80 分** | 学生情報システム演習     | コードレビュー・助言 | 個人開発         | システム実装 |
| **80-90 分** | 成果共有・質疑応答       | ファシリテート       | 発表・討論       | 学習成果     |

---

## 📚 学習内容

### Section 1: 関数の型注釈（実践編）

> 📚 **関連資料**: [実践コード例 - 関数の型注釈](./Step01_補足_実践コード例.md#ステップ2-基本的な型注釈) | [専門用語集 - TypeScript関連用語](./Step01_補足_専門用語集.md#typescript-関連用語)

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

// 残余パラメータ（Rest Parameters）
// ...演算子を使って可変長の引数を配列として受け取る
// 任意の数の引数を渡すことができ、TypeScriptが型安全性を保証する
function sum(...numbers: number[]): number {
  return numbers.reduce((total, num) => total + num, 0);
}
// 使用例: sum(1, 2, 3, 4, 5) → 15

// 関数型の変数
type Calculator = (a: number, b: number) => number;

const add: Calculator = (a, b) => a + b;
const subtract: Calculator = (a, b) => a - b;
const multiply: Calculator = (a, b) => a * b;
```

#### 🎯 練習問題 1: 関数の型注釈（15 分）

以下の要件を満たす関数を作成してください：

```typescript
// 1. ユーザーの年齢から成人かどうかを判定する isAdult 関数をつくりましょう

// 2. 配列の平均値を計算する mean 関数をつくりましょう

// 3. 文字列を指定回数繰り返す repeatString 関数をつくりましょう

// 4. repeatString 関数の繰り返す回数を指定しなかった場合デフォルトで3回繰り返すように変更しましょう

// 5. 引数として渡された複数の数値の中から、最も大きい数値を返す findMax 関数をつくりましょう。引数が1つも渡されなかった場合は undefined を返すようにしましょう。

// 6. ユーザーのプロフィールを作成する関数 createProfile を作成してください。名前は必須ですが、年齢と国は任意（オプショナル）とします。この関数は、受け取った情報からプロフィールオブジェクトを返します。
type UserProfile = {
  name: string;
  age?: number;
  country?: string;
};

// 7. 学習内容で定義した Calculator 型を利用して、四則演算を行う operate 関数を作成してください。この関数は2つの数値と、演算の種類を表す文字列（'add', 'subtract', 'multiply'）を受け取り、対応する計算結果を返します。
type Calculator = (a: number, b: number) => number;
const add: Calculator = (a, b) => a + b;
const subtract: Calculator = (a, b) => a - b;
const multiply: Calculator = (a, b) => a * b;

type Operation = 'add' | 'subtract' | 'multiply';

```

---

### Section 2: オブジェクトの型注釈（実践編）

> 📚 **関連資料**: [実践コード例 - 学生管理システム](./Step01_補足_実践コード例.md#ステップ4-学生管理システム) | [専門用語集 - 型注釈](./Step01_補足_専門用語集.md#型注釈type-annotation)

#### 🔍 型エイリアスの活用
**型エイリアス（Type Alias）とは？**

型エイリアスは、既存の型に新しい名前を付ける機能です。`type` キーワードを使って、複雑な型定義を分かりやすい名前で表現したり、同じ型定義を再利用したりできます。

**なぜ使うのか？**
- **可読性の向上**: 複雑な型を分かりやすい名前で表現できる
- **再利用性**: 同じ型定義を複数の場所で使い回せる
- **保守性**: 型の変更が必要な時、一箇所を修正するだけで済む

**基本構文**
```typescript
type 新しい型名 = 既存の型;
```

**簡単な例**
```typescript
// プリミティブ型のエイリアス
type Age = number;
type Name = string;

// 使用例
let userAge: Age = 25;
let userName: Name = "田中太郎";
```

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
  bio?: string; // オプショナル
  avatar?: string; // オプショナル
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
  const student = students.find((s) => s.id === id);
  return student || null;
}

function calculateAverageGrade(student: Student): number {
  if (student.grades.length === 0) return 0;

  const total = student.grades.reduce((sum, grade) => sum + grade.score, 0);
  return total / student.grades.length;
}
```

#### 🎯 練習問題 2: オブジェクト型の設計（20 分）

以下の要件を満たす型定義を作成してください：

```typescript
// 1. 商品情報を表す型（ID、名前、価格、在庫数、カテゴリ）
type Product = ;

// 2. 注文情報を表す型（注文ID、商品リスト、合計金額、注文日）
type Order = ;

// 3. 商品を検索する関数（名前またはカテゴリで検索）
function searchProducts(){}

// 4. ユーザーのショッピングカートの型(ユーザーID、カート内のアイテム（Productと数量のペアの配列）)
type CartItem = ;
type ShoppingCart = ;

// 5. 商品レビューの型(レビューID、商品ID、ユーザーID、評価（1-5の数値）、コメント（オプショナル）、レビュー日)
type Rating = ; // 評価は1から5までの数値に限定
type ProductReview = ;

// 6. 特定のユーザーのレビューを取得する関数(ProductReview型の配列とユーザーIDを受け取り、そのユーザーが書いたレビューのリストを返す)
function getReviewsByUserId(){}

```

---

### Section 3: 学生情報システム実装

> 📚 **サポート資料**: [実践コード例 - 学生管理システム完全版](./Step01_補足_実践コード例.md#ステップ4-学生管理システム) | [トラブルシューティング - TypeScript エラー対処](./Step01_補足_トラブルシューティング.md#typescriptコンパイルエラー)

#### 🎯 メイン演習: 学生情報処理システム

以下の JavaScript コードに TypeScript の型注釈を追加し、型安全なシステムを作成してください。

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
    grades: [],
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
  const student = students.find((s) => s.id === studentId);
  if (!student) {
    throw new Error("Student not found");
  }

  const grade = {
    subject: subject,
    score: score,
    date: new Date(),
  };

  student.grades.push(grade);
  return grade;
}

// 平均点を計算する関数
function calculateAverage(studentId) {
  const student = students.find((s) => s.id === studentId);
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
  return students.filter((student) =>
    student.name.toLowerCase().includes(name.toLowerCase())
  );
}

// 成績優秀者を取得する関数（平均80点以上）
function getTopStudents() {
  return students.filter((student) => {
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
3. **エラーを確認**: TypeScript コンパイラのエラーメッセージを読む
4. **テストしながら進める**: 各関数が正しく動作することを確認

---

## 👨‍🏫 学習ポイント

### 🤔 よくある質問と回答

**Q: 型エイリアスはいつ使うべきですか？**
A: 同じ型を複数箇所で使う場合、複雑な型を簡潔に表現したい場合、型に意味のある名前を付けたい場合に使用します。

**Q: オプショナルプロパティと undefined の違いは？**
A: オプショナルプロパティ（`?`）はプロパティ自体が存在しない可能性があることを示し、`undefined`は値が未定義であることを示します。

**Q: 配列の型注釈で `Array<T>` と `T[]` の違いは？**
A: 機能的には同じですが、`T[]` の方が簡潔で一般的です。ジェネリクスを学習後は `Array<T>` の意味も理解できます。

---

**📌 重要**: Session2 では実践的なコーディングを通じて TypeScript の型システムを体感します。完璧を目指さず、まずは動くコードを作ることを重視しましょう。

**🌟 次回（Session3）は、プロジェクトの完成と学習の総括を行います！**
