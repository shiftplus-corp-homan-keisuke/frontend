# Step01 成果物：学生情報処理システム

---

## 🎯 課題の目的

**あなたが作成するもの**: 既存のJavaScriptコードにTypeScriptの型注釈を追加する

**なぜ作るのか**: Step01で学習したTypeScriptの型注釈を実際のコードに適用し、**既存コードを型安全にする力**を身につけるため

**学習目標**:
- 既存のJavaScriptコードを読んで適切な型を判断できる
- 基本的な型注釈（string、number、boolean、配列）を正しく使える
- 関数の引数と戻り値に適切な型を付けられる
- TypeScriptの型システムの恩恵を実感できる

---

## 📋 必須提出物

以下の1つのファイルのみ提出してください：

```
📁 提出物/
└── student-system.ts    # 型注釈を追加したプログラム（必須）
```

---

## ⏰ 作成手順（推奨時間配分：合計40分）

### Phase 1: 既存コードの理解（10分）

#### ステップ1-1: 提供されたJavaScriptコードを理解する（10分）

以下のJavaScriptコードを読んで、どんな型が必要か考えてください：

```javascript
// 既存のJavaScriptコード（型注釈なし）
let students = [];

function createStudent(name, age, grades) {
  return {
    name: name,
    age: age,
    grades: grades
  };
}

function calculateAverage(grades) {
  if (grades.length === 0) {
    return 0;
  }
  
  const sum = grades.reduce((total, grade) => total + grade, 0);
  return Math.round(sum / grades.length * 10) / 10; // 小数点第1位まで
}

function displayStudentInfo(student) {
  return `名前: ${student.name}, 年齢: ${student.age}歳`;
}

function addStudent(name, age, grades) {
  const student = createStudent(name, age, grades);
  students.push(student);
  return student;
}

function getAllStudents() {
  return [...students]; // 配列のコピーを返す
}

function runExample() {
  console.log("=== 学生情報処理システムのデモ ===");
  
  // 学生データの追加
  addStudent("田中太郎", 20, [85, 92, 78, 88]);
  addStudent("佐藤花子", 19, [76, 84, 90, 82]);
  addStudent("鈴木一郎", 21, [94, 89, 91, 87]);
  
  // 全学生の情報表示
  console.log("\n=== 学生一覧 ===");
  const allStudents = getAllStudents();
  allStudents.forEach(student => {
    const info = displayStudentInfo(student);
    const average = calculateAverage(student.grades);
    console.log(`${info}, 平均点: ${average}`);
  });
  
  // 統計情報
  console.log("\n=== 統計情報 ===");
  const totalStudents = allStudents.length;
  const allGrades = allStudents.flatMap(student => student.grades);
  const overallAverage = calculateAverage(allGrades);
  console.log(`総学生数: ${totalStudents}人`);
  console.log(`全体平均点: ${overallAverage}`);
}

// 実行
runExample();
```

### Phase 2: 型注釈の追加（25分）

#### ステップ2-1: 必要な型を定義する（10分）

上記のコードを見て、以下の型を定義してください：

1. **学生情報を表現する型**
   - `createStudent`関数が返すオブジェクトの型
   - どんなプロパティが必要でしょうか？

**🤔 考えてみましょう**:
- 学生には「名前」「年齢」「成績」が必要
- 名前は何型？年齢は何型？成績は何型？

#### ステップ2-2: 変数に型注釈を追加する（5分）

```typescript
// TODO: 以下の変数に適切な型注釈を追加してください
let students = [];
```

**🤔 考えてみましょう**:
- `students`には何が入る？
- 学生の配列 → 何の配列？

#### ステップ2-3: 関数に型注釈を追加する（10分）

各関数の引数と戻り値に適切な型注釈を追加してください：

```typescript
// TODO: 以下の関数に型注釈を追加してください
function createStudent(name, age, grades) { /* ... */ }
function calculateAverage(grades) { /* ... */ }
function displayStudentInfo(student) { /* ... */ }
function addStudent(name, age, grades) { /* ... */ }
function getAllStudents() { /* ... */ }
function runExample() { /* ... */ }
```

**🤔 考えてみましょう**:
- 各関数は何を受け取って、何を返す？
- `name` → 文字列？
- `age` → 数値？
- `grades` → 数値の配列？

### Phase 3: 動作確認（5分）

#### ステップ3-1: 動作確認
TypeScript Playgroundまたはローカル環境で実行して動作を確認

---

## ✅ 最低合格要件

以下の要件を**すべて満たす**ことで合格とします：

### 🔧 技術要件
- [x] TypeScriptでコンパイルエラーが発生しない
- [x] **学生を表現する型を1つ以上定義している**（最重要！）
- [x] すべての変数に適切な型注釈が付いている
- [x] すべての関数の引数に適切な型注釈が付いている
- [x] すべての関数の戻り値に適切な型注釈が付いている

### 💭 型注釈要件
- [x] 学生情報のオブジェクトの型が正しく定義されている
- [x] 配列の型注釈が適切に付いている
- [x] 基本型（string、number、boolean）が適切に使われている

---

## 📊 評価基準

| 項目 | 配点 | 評価ポイント |
|------|------|-------------|
| **型注釈の正確性** | 60点 | 全ての変数・関数に適切な型注釈が付いている |
| **型定義の適切性** | 30点 | 学生の型が正しく定義されている |
| **機能の完成度** | 10点 | 元のコードと同じ動作をする |

**合格ライン**: 70点以上

---

## 💡 型注釈のヒント

### 🤔 型を考える時の質問

1. **この変数には何が入る？**
   - `students` → 学生の配列が入る → `Student[]`
   - `name` → 文字列が入る → `string`
   - `age` → 数値が入る → `number`

2. **この関数は何を受け取る？**
   - `createStudent(name, age, grades)` → 文字列、数値、数値の配列
   - `calculateAverage(grades)` → 数値の配列

3. **この関数は何を返す？**
   - `createStudent` → 学生オブジェクトを返す
   - `calculateAverage` → 数値を返す
   - `displayStudentInfo` → 文字列を返す

### 📝 基本的な型注釈の例

```typescript
// 基本的な型注釈
let studentName: string = "田中太郎";
let studentAge: number = 20;
let isActive: boolean = true;

// 配列の型注釈
let grades: number[] = [85, 92, 78, 88];
let names: string[] = ["田中", "佐藤", "鈴木"];

// オブジェクトの型注釈（型を定義してから使う）
type Student = {
  name: string;
  age: number;
  grades: number[];
};

let student: Student = {
  name: "田中太郎",
  age: 20,
  grades: [85, 92, 78, 88]
};

// 関数の型注釈
function greet(name: string): string {
  return `こんにちは、${name}さん！`;
}

function add(a: number, b: number): number {
  return a + b;
}
```

### ⚠️ よくある間違い

1. **配列の型注釈忘れ**
   ```typescript
   // ❌ 間違い
   let students = [];
   
   // ✅ 正解
   let students: Student[] = [];
   ```

2. **関数の戻り値の型注釈忘れ**
   ```typescript
   // ❌ 間違い
   function createStudent(name: string, age: number, grades: number[]) {
     return { name, age, grades };
   }
   
   // ✅ 正解
   function createStudent(name: string, age: number, grades: number[]): Student {
     return { name, age, grades };
   }
   ```

3. **型定義を忘れる**
   ```typescript
   // ❌ 間違い：型を定義していない
   function displayStudentInfo(student: { name: string; age: number; grades: number[] }): string {
     // ...
   }
   
   // ✅ 正解：型を定義してから使う
   type Student = {
     name: string;
     age: number;
     grades: number[];
   };
   
   function displayStudentInfo(student: Student): string {
     // ...
   }
   ```

---

## 📚 参考：完成例（型注釈の答えを見たい場合）

<details>
<summary>⚠️ 注意：まず自分で考えてから見てください</summary>

```typescript
// 型定義
type Student = {
  name: string;
  age: number;
  grades: number[];
};

// 変数の型注釈
let students: Student[] = [];

// 関数の型注釈
function createStudent(name: string, age: number, grades: number[]): Student {
  return {
    name: name,
    age: age,
    grades: grades
  };
}

function calculateAverage(grades: number[]): number {
  if (grades.length === 0) {
    return 0;
  }
  
  const sum = grades.reduce((total, grade) => total + grade, 0);
  return Math.round(sum / grades.length * 10) / 10;
}

function displayStudentInfo(student: Student): string {
  return `名前: ${student.name}, 年齢: ${student.age}歳`;
}

function addStudent(name: string, age: number, grades: number[]): Student {
  const student = createStudent(name, age, grades);
  students.push(student);
  return student;
}

function getAllStudents(): Student[] {
  return [...students];
}

function runExample(): void {
  // 実行例のコード
}
```

</details>

---

## 🚀 発展課題（任意）

余裕がある場合は以下にも挑戦してみてください：

- [ ] 成績評価関数（平均点から「優秀」「良好」等を返す）
- [ ] 学生検索関数（名前で検索）
- [ ] より詳細な学生情報の型（学籍番号、学部など）

---

**📌 重要**: この課題の目的は**既存のJavaScriptコードを読んで適切な型注釈を付ける力**を身につけることです。TypeScriptの基本的な型システムを実践的に学習しましょう。

**🌟 次のステップ**: Step02では、より高度な型システム（基本型システムと型注釈）について学習します！