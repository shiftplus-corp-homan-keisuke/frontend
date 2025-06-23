# Step02 成果物：学生管理システム発展版

---

## 🎯 課題の目的

**あなたが作成するもの**: 既存の JavaScript コードに TypeScript の型注釈を追加する

**なぜ作るのか**: Step02 で学習した高度な型システム（const assertion、リテラル型、Union 型、タプル型、関数オーバーロード）を実際のコードに適用し、**既存コードを型安全にする力**を身につけるため

**学習目標**:

- 既存の JavaScript コードを読んで適切な型を判断できる
- 高度な型機能（const assertion、リテラル型、Union 型）を正しく注釈できる
- タプル型と関数オーバーロードを適切に活用できる
- 学生管理システムの複雑な型設計を実装できる

---

## 📋 必須提出物

以下の 1 つのファイルのみ提出してください：

```
📁 提出物/
└── student-management.ts    # 型注釈を追加したプログラム（必須）
```

---

## ⏰ 作成手順（推奨時間配分：合計 30 分）

### Phase 1: 既存コードの理解（6 分）

#### ステップ 1-1: 提供された JavaScript コードを理解する（6 分）

以下の JavaScript コードを読んで、どんな型が必要か考えてください：

```javascript
// 既存のJavaScriptコード（型注釈なし）
let students = [];
let nextId = 1;

// 学生の基本情報
const GRADES = [1, 2, 3, 4, 5, 6];
const STATUSES = ["active", "inactive"];

// 新しい学生を登録して学生配列に追加する
function addStudent(name, grade, status) {
  const student = {
    id: nextId++,
    name: name,
    grade: grade,
    status: status || "active",
    enrollmentDate: new Date(),
  };

  students.push(student);

  return {
    success: true,
    data: student,
    message: "学生が正常に登録されました",
  };
}

// IDで学生を検索する
function findStudent(id) {
  const student = students.find((s) => s.id === id);

  if (!student) {
    return {
      success: false,
      data: null,
      message: "該当する学生が見つかりませんでした",
    };
  }

  return {
    success: true,
    data: student,
    message: "検索が完了しました",
  };
}

// 指定されたIDの学生情報を更新する
function updateStudent(id, updates) {
  const studentIndex = students.findIndex((s) => s.id === id);

  if (studentIndex === -1) {
    return {
      success: false,
      data: null,
      message: "指定された学生が見つかりません",
    };
  }

  const student = students[studentIndex];
  const updatedStudent = {
    ...student,
    ...updates,
  };

  students[studentIndex] = updatedStudent;

  return {
    success: true,
    data: updatedStudent,
    message: "学生情報が更新されました",
  };
}

// 全学生を取得する
function getStudents() {
  return {
    success: true,
    data: students,
    message: "学生一覧を取得しました",
  };
}

// システムの動作確認用デモ関数
function runExample() {
  console.log("=== 学生管理システム基本版のデモ ===");

  // 学生登録
  console.log(addStudent("田中太郎", 3, "active"));
  console.log(addStudent("佐藤花子", 4, "active"));

  // 学生検索
  console.log(findStudent(1));

  // 学生情報更新
  console.log(updateStudent(1, { status: "inactive" }));

  // 全学生取得
  console.log(getStudents());
}

// 実行
runExample();
```

### Phase 2: 基本的な型注釈の追加（20 分）

#### ステップ 2-1: 必要な型を定義する（8 分）

上記のコードを見て、以下の基本的な型を定義してください：

1. **学生の基本型**

   - 学年、ステータスのリテラル型
   - 学生オブジェクトの型（シンプル版）

2. **操作結果の型**
   - 成功・失敗を表現する Union 型

#### ステップ 2-2: const assertion の活用（3 分）

```typescript
// TODO: 以下の定数にconst assertionを適用してください
const GRADES = [1, 2, 3, 4, 5, 6];
const STATUSES = ["active", "inactive"];
```

#### ステップ 2-3: 基本的な関数に型注釈を追加する（9 分）

```typescript
// TODO: 以下に適切な型注釈を追加してください
let students = [];
let nextId = 1;

function addStudent(name, grade, status) {
  /* ... */
}
function findStudent(id) {
  /* ... */
}
function updateStudent(id, updates) {
  /* ... */
}
function getStudents() {
  /* ... */
}
```

### Phase 3: 動作確認（4 分）

#### ステップ 3-1: 動作確認

TypeScript Playground またはローカル環境で実行して動作を確認

---

## ✅ 最低合格要件

以下の要件を**すべて満たす**ことで合格とします：

### 🔧 技術要件

- [ ] TypeScript でコンパイルエラーが発生しない
- [ ] **必要な型を 3 つ以上定義している**
- [ ] const assertion が適切に使用されている
- [ ] リテラル型と Union 型が適切に定義されている
- [ ] 基本的な関数に型注釈が追加されている

### 🎯 機能要件

- [ ] 元の JavaScript コードと同じ動作をする
- [ ] 学生の登録・検索・更新が正しく動作する

### 💭 基本的な型注釈要件

- [ ] 学生オブジェクトの型が正しく定義されている
- [ ] 操作結果の Union 型が適切に定義されている
- [ ] 基本的な関数に適切な型注釈が追加されている
- [ ] オプショナルプロパティ（`?`）が適切に使われている

---

## 📊 評価基準

| 項目                     | 配点  | 評価ポイント                                      |
| ------------------------ | ----- | ------------------------------------------------- |
| **基本的な型機能の活用** | 40 点 | const assertion、リテラル型、Union 型の適切な使用 |
| **型注釈の正確性**       | 35 点 | 主要な変数・関数に適切な型注釈が付いている        |
| **型設計の適切性**       | 20 点 | 必要な型が正しく定義されている                    |
| **機能の完成度**         | 5 点  | 元のコードと同じ動作をする                        |

**合格ライン**: 70 点以上

---

## 💡 基本的な型注釈のヒント

### 🤔 型を考える時の質問

1. **const assertion はどこで使う？**

   - `GRADES` → `const GRADES = [1, 2, 3, 4, 5, 6] as const`
   - 配列を読み取り専用として扱いたい場合

2. **リテラル型と Union 型の組み合わせ**

   - `type Grade = 1 | 2 | 3 | 4 | 5 | 6`
   - `type StudentStatus = "active" | "inactive" | "graduated" | "transferred"`

3. **基本的な型注釈**

   - 関数の引数と戻り値に適切な型を指定
   - オプショナルプロパティ（`?`）の活用

### 📝 基本的な型注釈の例

```typescript
// const assertion
const GRADES = [1, 2, 3, 4, 5, 6] as const;
type Grade = (typeof GRADES)[number]; // 1 | 2 | 3 | 4 | 5 | 6

// Union型
type OperationResult =
  | { success: true; data: Student | Student[]; message: string }
  | { success: false; data: null; message: string };

// 学生型
type Student = {
  id: number;
  name: string;
  grade: Grade;
  class: string;
  status: StudentStatus;
  birthDate: Date;
  guardianContact?: string;
  enrollmentDate: Date;
  updatedAt: Date;
};
```

### ⚠️ よくある間違い

1. **const assertion の忘れ**

   ```typescript
   // ❌ 間違い
   const GRADES = [1, 2, 3, 4, 5, 6]; // number[]型

   // ✅ 正解
   const GRADES = [1, 2, 3, 4, 5, 6] as const; // readonly [1, 2, 3, 4, 5, 6]型
   ```

2. **Union 型の定義ミス**

   ```typescript
   // ❌ 間違い：文字列リテラルではなく一般的なstring型
   type StudentStatus = string;

   // ✅ 正解：具体的なリテラル型
   type StudentStatus = "active" | "inactive";
   ```

3. **関数の戻り値型の不一致**

   ```typescript
   // ❌ 間違い：戻り値の型が実際の実装と一致しない
   function findStudent(id: number): Student {
     // 実際にはOperationResult<Student>を返している
   }
   
   // ✅ 正解
   function findStudent(id: number): OperationResult {
     // ...
   }
   ```

---

## 📚 参考：完成例（型注釈の答えを見たい場合）

<details>
<summary>⚠️ 注意：まず自分で考えてから見てください</summary>

```typescript
// const assertion（シンプル版）
const GRADES = [1, 2, 3, 4, 5, 6] as const;
const STATUSES = ["active", "inactive"] as const;

// 型定義
type Grade = (typeof GRADES)[number];
type StudentStatus = (typeof STATUSES)[number];

type Student = {
  id: number;
  name: string;
  grade: Grade;
  status: StudentStatus;
  enrollmentDate: Date;
};

type OperationResult =
  | { success: true; data: Student | Student[]; message: string }
  | { success: false; data: null; message: string };

// 変数の型注釈
let students: Student[] = [];
let nextId: number = 1;

// 新しい学生を登録する
function addStudent(
  name: string,
  grade: Grade,
  status?: StudentStatus
): OperationResult {
  // 実装
}

// 学生をIDで検索する
function findStudent(id: number): OperationResult {
  // 実装
}

// 学生情報を更新する
function updateStudent(
  id: number,
  updates: { name?: string; grade?: Grade; status?: StudentStatus }
): OperationResult {
  // 実装
}

// 全学生を取得する
function getStudents(): OperationResult {
  // 実装
}
```

</details>

---

## 🚀 発展課題（任意）

余裕がある場合は以下にも挑戦してみてください：

- [ ] より厳密な型ガードの実装
- [ ] 学年別フィルタリング機能の追加
- [ ] エラーハンドリングの強化
- [ ] より複雑な検索機能の実装

---

**📌 重要**: この課題の目的は**Step02 で学習した基本的な型機能を実際のコードに適用する力**を身につけることです。const assertion、リテラル型、Union 型を積極的に活用しましょう。

**🌟 次のステップ**: Step03 では、インターフェースとオブジェクト型について学習します！
