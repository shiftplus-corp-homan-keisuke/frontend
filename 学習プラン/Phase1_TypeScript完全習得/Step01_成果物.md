# Step01 成果物：基本的な学生情報処理システム

---

## 📝 システム概要

### 🎓 基本的な学生情報処理システム

**目的**: TypeScriptの型注釈を使って、学生の基本情報を安全に処理する

**主要機能**:
1. 学生情報の作成
2. 成績の計算（平均点）
3. 学生情報の表示
4. 基本的な検索・フィルタリング

**使用する型**:
- 基本型: string, number, boolean
- 配列型: number[], string[]
- オブジェクト型: Student型

---

## 🚀 段階的実装手順

### Phase 1: 型定義と基本関数 🔰

#### ステップ1-1: 学生型の定義

```typescript
// student-system.ts

// 学生の基本情報を表す型
type Student = {
  name: string;        // 学生名
  age: number;         // 年齢
  grades: number[];    // 成績の配列（0-100の数値）
  isActive: boolean;   // 在籍状況
};
```

#### ステップ1-2: 学生作成関数

```typescript
// 学生情報を作成する関数
function createStudent(
  name: string, 
  age: number, 
  grades: number[], 
  isActive: boolean = true
): Student {
  return {
    name: name,
    age: age,
    grades: grades,
    isActive: isActive
  };
}
```

#### ステップ1-3: 基本的な表示関数

```typescript
// 学生情報を文字列で表示する関数
function displayStudentInfo(student: Student): string {
  const status = student.isActive ? "在籍中" : "休学中";
  return `名前: ${student.name}, 年齢: ${student.age}歳, 状況: ${status}`;
}
```

### Phase 2: 成績処理関数 🔶

#### ステップ2-1: 平均点計算

```typescript
// 成績の平均を計算する関数
function calculateAverage(grades: number[]): number {
  if (grades.length === 0) {
    return 0;
  }
  
  const sum = grades.reduce((total, grade) => total + grade, 0);
  return Math.round(sum / grades.length * 10) / 10; // 小数点第1位まで
}
```

#### ステップ2-2: 学生の平均点取得

```typescript
// 特定の学生の平均点を取得する関数
function getStudentAverage(student: Student): number {
  return calculateAverage(student.grades);
}
```

#### ステップ2-3: 成績評価関数

```typescript
// 平均点から成績評価を返す関数
function getGradeLevel(average: number): string {
  if (average >= 90) return "優秀";
  if (average >= 80) return "良好";
  if (average >= 70) return "普通";
  if (average >= 60) return "要努力";
  return "要指導";
}
```

### Phase 3: 配列操作と検索 🔥

#### ステップ3-1: 学生検索

```typescript
// 名前で学生を検索する関数
function findStudentByName(students: Student[], name: string): Student | null {
  const found = students.find(student => student.name === name);
  return found || null;
}
```

#### ステップ3-2: 在籍学生フィルタ

```typescript
// 在籍中の学生のみを抽出する関数
function getActiveStudents(students: Student[]): Student[] {
  return students.filter(student => student.isActive);
}
```

#### ステップ3-3: 成績上位者抽出

```typescript
// 平均点が指定値以上の学生を抽出する関数
function getTopStudents(students: Student[], minAverage: number): Student[] {
  return students.filter(student => {
    const average = getStudentAverage(student);
    return average >= minAverage;
  });
}
```

### Phase 4: 実行例とテスト 🧪

#### ステップ4-1: サンプルデータの作成

```typescript
// サンプルデータを作成してテスト
function runExample(): void {
  // 学生データの作成
  const students: Student[] = [
    createStudent("田中太郎", 20, [85, 92, 78, 88]),
    createStudent("佐藤花子", 19, [76, 84, 90, 82]),
    createStudent("鈴木一郎", 21, [94, 89, 91, 87], false), // 休学中
    createStudent("山田美咲", 20, [88, 95, 83, 91])
  ];

  // 各学生の情報表示
  console.log("=== 学生一覧 ===");
  students.forEach(student => {
    const info = displayStudentInfo(student);
    const average = getStudentAverage(student);
    const level = getGradeLevel(average);
    console.log(`${info}, 平均点: ${average}, 評価: ${level}`);
  });

  // 在籍中の学生のみ表示
  console.log("\n=== 在籍中の学生 ===");
  const activeStudents = getActiveStudents(students);
  activeStudents.forEach(student => {
    console.log(displayStudentInfo(student));
  });

  // 成績上位者（平均85点以上）
  console.log("\n=== 成績上位者（平均85点以上） ===");
  const topStudents = getTopStudents(students, 85);
  topStudents.forEach(student => {
    const average = getStudentAverage(student);
    console.log(`${student.name}: ${average}点`);
  });

  // 学生検索
  console.log("\n=== 学生検索 ===");
  const foundStudent = findStudentByName(students, "田中太郎");
  if (foundStudent) {
    console.log(`見つかりました: ${displayStudentInfo(foundStudent)}`);
  } else {
    console.log("学生が見つかりませんでした");
  }
}

// 実行
runExample();
```

---

## 🎓 学習のヒント

### 💡 実装時のポイント

1. **型注釈を忘れずに**: すべての関数の引数と戻り値に型を付ける
2. **エラーメッセージを読む**: TypeScriptのエラーは親切なので、よく読んで理解する
3. **段階的に実装**: Phase 1から順番に実装し、動作確認しながら進める
4. **console.logで確認**: 各関数が期待通りに動作するか確認する

### ⚠️ よくある間違い

- 型注釈の書き忘れ
- 配列の空チェックを忘れる
- null/undefinedの処理を忘れる
- 関数の戻り値の型が実装と一致しない

### 🚀 発展課題（任意）

余裕がある場合は以下にも挑戦してみてください：

- 成績の最高点・最低点を取得する関数
- 学生の年齢でソートする関数
- 複数の条件で学生を検索する関数

---

**📌 重要**: この成果物はStep01の学習内容の総まとめです。TypeScriptの型システムの恩恵を実感しながら、確実に基礎を身につけましょう。

**🌟 次のステップ**: Step02では、より高度な型システム（Union型、インターフェース）について学習します！