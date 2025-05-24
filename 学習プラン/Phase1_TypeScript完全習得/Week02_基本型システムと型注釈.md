# Week 2: 基本型システムと型注釈

## 📅 学習期間・目標

**期間**: Week 2（7日間）  
**総学習時間**: 12時間（平日1.5時間、週末3時間）  
**学習スタイル**: 理論20% + 実践コード50% + 演習30%

### 🎯 Week 2 到達目標

- [ ] TypeScriptの基本型システムを完全理解
- [ ] 型推論の仕組みと活用方法の習得
- [ ] 配列・タプル・オブジェクト型の実践的活用
- [ ] 関数型注釈の詳細理解
- [ ] 型安全なコード設計の基礎確立

## 📚 理論学習内容

### Day 1-2: プリミティブ型の完全理解

#### 🔍 基本型の詳細と他言語との比較

```typescript
// 1. string型 - 文字列
// Java: String, C#: string, Python: str, Go: string
let message: string = "Hello TypeScript";
let template: string = `User name is ${message}`;
let multiline: string = `
  This is a
  multiline string
`;

// 文字列リテラル型（より厳密な型）
let status: "pending" | "approved" | "rejected" = "pending";
// status = "invalid"; // Error: Type '"invalid"' is not assignable

// 2. number型 - 数値（整数・浮動小数点）
// Java: int/double, C#: int/double, Python: int/float, Go: int/float64
let age: number = 25;
let price: number = 99.99;
let binary: number = 0b1010;    // 2進数
let octal: number = 0o744;      // 8進数
let hex: number = 0xFF;         // 16進数

// 数値リテラル型
let diceRoll: 1 | 2 | 3 | 4 | 5 | 6 = 3;

// 3. boolean型 - 真偽値
// Java: boolean, C#: bool, Python: bool, Go: bool
let isActive: boolean = true;
let isCompleted: boolean = false;

// 4. null と undefined
// Java: null, C#: null, Python: None, Go: nil
let nullValue: null = null;
let undefinedValue: undefined = undefined;

// TypeScriptでは区別される
let maybeString: string | null = null;
let optionalString: string | undefined = undefined;

// 5. symbol型 - 一意識別子
// ES6で追加、他言語にはあまり類似概念なし
let sym1: symbol = Symbol("key");
let sym2: symbol = Symbol("key");
console.log(sym1 === sym2); // false（常に一意）

// 6. bigint型 - 大きな整数
// Java: BigInteger, C#: BigInteger, Python: int（自動拡張）
let bigNumber: bigint = 123456789012345678901234567890n;
let anotherBig: bigint = BigInt("123456789012345678901234567890");
```

#### 🎯 型推論の詳細メカニズム

```typescript
// 1. 基本的な型推論
let inferredString = "Hello";        // string型として推論
let inferredNumber = 42;             // number型として推論
let inferredBoolean = true;          // boolean型として推論

// 2. 最適共通型（Best Common Type）
let mixedArray = [1, "hello", true]; // (string | number | boolean)[]
let numbers = [1, 2, 3];             // number[]
let strings = ["a", "b", "c"];       // string[]

// 3. 文脈的型推論（Contextual Typing）
const button = document.querySelector('button');
button?.addEventListener('click', function(event) {
  // eventは自動的にMouseEvent型として推論
  console.log(event.clientX);
});

// 4. 型推論の限界と明示的型注釈の必要性
let value;                    // any型（推論不可）
value = "string";
value = 42;                   // 型安全性が失われる

let typedValue: string;       // 明示的型注釈で型安全性確保
// typedValue = 42;           // Error

// 5. 関数の戻り値型推論
function add(a: number, b: number) {
  return a + b;               // number型として推論
}

function getUser() {
  return {                    // オブジェクト型として推論
    name: "Alice",
    age: 30
  };
}

// 6. 条件分岐での型推論
function processValue(value: string | number) {
  if (typeof value === "string") {
    // この分岐内ではvalueはstring型として推論
    return value.toUpperCase();
  } else {
    // この分岐内ではvalueはnumber型として推論
    return value.toFixed(2);
  }
}
```

### Day 3-4: 配列とタプル型

#### 🔧 配列型の詳細活用

```typescript
// 1. 基本的な配列型
let numbers: number[] = [1, 2, 3, 4, 5];
let strings: Array<string> = ["apple", "banana", "cherry"];
let booleans: boolean[] = [true, false, true];

// 2. 多次元配列
let matrix: number[][] = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9]
];

let cube: number[][][] = [
  [[1, 2], [3, 4]],
  [[5, 6], [7, 8]]
];

// 3. 読み取り専用配列
let readonlyNumbers: readonly number[] = [1, 2, 3];
let readonlyStrings: ReadonlyArray<string> = ["a", "b", "c"];
// readonlyNumbers.push(4); // Error: Property 'push' does not exist

// 4. 配列の型ガード
function isNumberArray(value: unknown): value is number[] {
  return Array.isArray(value) && value.every(item => typeof item === "number");
}

function processArray(input: unknown) {
  if (isNumberArray(input)) {
    // inputはnumber[]型として扱われる
    return input.reduce((sum, num) => sum + num, 0);
  }
  return 0;
}

// 5. 配列操作の型安全性
const fruits: string[] = ["apple", "banana", "cherry"];

// map操作での型変換
const lengths: number[] = fruits.map(fruit => fruit.length);
const upperFruits: string[] = fruits.map(fruit => fruit.toUpperCase());

// filter操作での型絞り込み
const longFruits: string[] = fruits.filter(fruit => fruit.length > 5);

// reduce操作での型集約
const totalLength: number = fruits.reduce((total, fruit) => total + fruit.length, 0);
const fruitMap: Record<string, number> = fruits.reduce((map, fruit, index) => {
  map[fruit] = index;
  return map;
}, {} as Record<string, number>);
```

#### 🎯 タプル型の実践活用

```typescript
// 1. 基本的なタプル型
let coordinate: [number, number] = [10, 20];
let person: [string, number, boolean] = ["Alice", 30, true];

// 2. 名前付きタプル（TypeScript 4.0+）
let namedCoordinate: [x: number, y: number] = [10, 20];
let userInfo: [name: string, age: number, isActive: boolean] = ["Bob", 25, false];

// 3. オプショナル要素
let optionalTuple: [string, number?] = ["hello"];
optionalTuple = ["hello", 42];

// 4. 残余要素（Rest Elements）
let restTuple: [string, ...number[]] = ["prefix", 1, 2, 3, 4];
let mixedRest: [boolean, ...string[], number] = [true, "a", "b", "c", 42];

// 5. 読み取り専用タプル
let readonlyTuple: readonly [string, number] = ["hello", 42];
// readonlyTuple[0] = "world"; // Error: Cannot assign to '0'

// 6. タプルの分割代入
let [name, age, isActive] = person;
let [x, y] = coordinate;

// 7. 関数の戻り値としてのタプル
function getNameAndAge(): [string, number] {
  return ["Alice", 30];
}

function parseCoordinate(input: string): [number, number] | null {
  const parts = input.split(",");
  if (parts.length === 2) {
    const x = parseFloat(parts[0]);
    const y = parseFloat(parts[1]);
    if (!isNaN(x) && !isNaN(y)) {
      return [x, y];
    }
  }
  return null;
}

// 8. タプルとしての配列メソッド
function swapCoordinate([x, y]: [number, number]): [number, number] {
  return [y, x];
}

function distance([x1, y1]: [number, number], [x2, y2]: [number, number]): number {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}
```

### Day 5-7: オブジェクト型と関数型

#### 🔧 オブジェクト型の詳細設計

```typescript
// 1. 基本的なオブジェクト型
let user: {
  name: string;
  age: number;
  email: string;
} = {
  name: "Alice",
  age: 30,
  email: "alice@example.com"
};

// 2. オプショナルプロパティ
let partialUser: {
  name: string;
  age?: number;        // オプショナル
  email?: string;      // オプショナル
} = {
  name: "Bob"
};

// 3. 読み取り専用プロパティ
let config: {
  readonly apiUrl: string;
  readonly timeout: number;
  retries: number;     // 変更可能
} = {
  apiUrl: "https://api.example.com",
  timeout: 5000,
  retries: 3
};

// config.apiUrl = "new url"; // Error: Cannot assign to 'apiUrl'
config.retries = 5;           // OK

// 4. インデックスシグネチャ
let dictionary: {
  [key: string]: string;
} = {
  hello: "こんにちは",
  goodbye: "さようなら"
};

let scores: {
  [studentName: string]: number;
} = {
  alice: 95,
  bob: 87,
  charlie: 92
};

// 5. 混合型のオブジェクト
let complexObject: {
  id: number;
  name: string;
  tags: string[];
  metadata: {
    created: Date;
    updated?: Date;
  };
  [key: string]: unknown;  // 追加プロパティ許可
} = {
  id: 1,
  name: "Sample",
  tags: ["tag1", "tag2"],
  metadata: {
    created: new Date()
  },
  customField: "custom value"
};
```

#### 🎯 関数型の詳細活用

```typescript
// 1. 基本的な関数型注釈
function greet(name: string): string {
  return `Hello, ${name}!`;
}

function add(a: number, b: number): number {
  return a + b;
}

function logMessage(message: string): void {
  console.log(message);
}

// 2. アロー関数の型注釈
const multiply = (a: number, b: number): number => a * b;
const isEven = (num: number): boolean => num % 2 === 0;

// 3. 関数型の変数
let calculator: (a: number, b: number) => number;
calculator = add;
calculator = multiply;

// 4. オプショナルパラメータ
function createUser(name: string, age?: number, email?: string): object {
  return {
    name,
    age: age || 0,
    email: email || ""
  };
}

// 5. デフォルトパラメータ
function greetWithDefault(name: string, greeting: string = "Hello"): string {
  return `${greeting}, ${name}!`;
}

// 6. 残余パラメータ
function sum(...numbers: number[]): number {
  return numbers.reduce((total, num) => total + num, 0);
}

// 7. 関数オーバーロード
function format(value: string): string;
function format(value: number): string;
function format(value: boolean): string;
function format(value: string | number | boolean): string {
  return String(value);
}

// 8. 高階関数の型注釈
function applyOperation(
  numbers: number[],
  operation: (num: number) => number
): number[] {
  return numbers.map(operation);
}

const doubled = applyOperation([1, 2, 3], x => x * 2);
const squared = applyOperation([1, 2, 3], x => x * x);
```

## 🎯 実践演習

### 演習 2-1: 型推論マスター 🔰

```typescript
// 以下のコードの型推論結果を予測し、実際に確認せよ

// 1. 基本的な型推論
let a = 42;                    // 型は？
let b = "hello";               // 型は？
let c = true;                  // 型は？
let d = [1, 2, 3];            // 型は？
let e = ["a", "b", "c"];      // 型は？

// 2. 複雑な型推論
let f = [1, "hello", true];    // 型は？
let g = { name: "Alice", age: 30 }; // 型は？
let h = [{ id: 1, name: "Bob" }];   // 型は？

// 3. 関数の型推論
function mystery1(x, y) {      // パラメータの型は？
  return x + y;
}

function mystery2(arr) {       // パラメータの型は？
  return arr.map(x => x * 2);
}

// 解答例と解説
/*
a: number
b: string  
c: boolean
d: number[]
e: string[]
f: (string | number | boolean)[]
g: { name: string; age: number; }
h: { id: number; name: string; }[]

mystery1: パラメータはany型（型推論不可）
mystery2: パラメータはany型（型推論不可）
*/
```

### 演習 2-2: 配列・タプル操作マスター 🔶

```typescript
// 以下の要件を満たすTypeScriptコードを作成せよ

// 1. 座標計算システム
// 要件:
// - 2D座標をタプルで表現
// - 座標間の距離計算
// - 座標の移動・回転機能
// - 複数座標の重心計算

type Point2D = [x: number, y: number];
type Point3D = [x: number, y: number, z: number];

// 解答例
function distance2D([x1, y1]: Point2D, [x2, y2]: Point2D): number {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

function movePoint([x, y]: Point2D, [dx, dy]: Point2D): Point2D {
  return [x + dx, y + dy];
}

function rotatePoint([x, y]: Point2D, angle: number): Point2D {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return [
    x * cos - y * sin,
    x * sin + y * cos
  ];
}

function centroid(points: Point2D[]): Point2D {
  const sum = points.reduce(
    ([sumX, sumY], [x, y]) => [sumX + x, sumY + y],
    [0, 0] as Point2D
  );
  return [sum[0] / points.length, sum[1] / points.length];
}

// 2. データ変換パイプライン
// 要件:
// - 文字列配列を数値配列に変換
// - 無効な値のフィルタリング
// - 統計情報の計算

function parseNumbers(strings: string[]): number[] {
  return strings
    .map(str => parseFloat(str))
    .filter(num => !isNaN(num));
}

function calculateStats(numbers: number[]): {
  count: number;
  sum: number;
  average: number;
  min: number;
  max: number;
} {
  if (numbers.length === 0) {
    return { count: 0, sum: 0, average: 0, min: 0, max: 0 };
  }
  
  const sum = numbers.reduce((acc, num) => acc + num, 0);
  return {
    count: numbers.length,
    sum,
    average: sum / numbers.length,
    min: Math.min(...numbers),
    max: Math.max(...numbers)
  };
}

// 使用例
const coordinates: Point2D[] = [[0, 0], [3, 4], [6, 8]];
console.log("重心:", centroid(coordinates));

const stringNumbers = ["1", "2.5", "invalid", "3.7", ""];
const validNumbers = parseNumbers(stringNumbers);
console.log("統計:", calculateStats(validNumbers));
```

### 演習 2-3: 型安全なデータ管理システム 🔥

```typescript
// 学生管理システムを型安全に実装せよ
// 要件:
// 1. 学生情報の管理（名前、年齢、成績、履修科目）
// 2. 成績の統計計算
// 3. 履修科目の管理
// 4. 検索・フィルタリング機能

// 解答例
type Subject = "math" | "science" | "english" | "history" | "art";

type Grade = {
  subject: Subject;
  score: number;
  semester: 1 | 2;
  year: number;
};

type Student = {
  readonly id: number;
  name: string;
  age: number;
  grades: Grade[];
  enrolledSubjects: Subject[];
};

class StudentManager {
  private students: Student[] = [];
  private nextId: number = 1;

  addStudent(name: string, age: number, subjects: Subject[]): Student {
    const newStudent: Student = {
      id: this.nextId++,
      name,
      age,
      grades: [],
      enrolledSubjects: [...subjects]
    };
    
    this.students.push(newStudent);
    return newStudent;
  }

  addGrade(studentId: number, grade: Omit<Grade, 'subject'> & { subject: Subject }): boolean {
    const student = this.students.find(s => s.id === studentId);
    if (student && student.enrolledSubjects.includes(grade.subject)) {
      student.grades.push(grade);
      return true;
    }
    return false;
  }

  getStudentAverage(studentId: number, subject?: Subject): number {
    const student = this.students.find(s => s.id === studentId);
    if (!student) return 0;

    const relevantGrades = subject 
      ? student.grades.filter(g => g.subject === subject)
      : student.grades;

    if (relevantGrades.length === 0) return 0;

    const sum = relevantGrades.reduce((acc, grade) => acc + grade.score, 0);
    return sum / relevantGrades.length;
  }

  getTopStudents(subject: Subject, limit: number = 5): Student[] {
    return this.students
      .filter(student => student.enrolledSubjects.includes(subject))
      .map(student => ({
        ...student,
        average: this.getStudentAverage(student.id, subject)
      }))
      .sort((a, b) => b.average - a.average)
      .slice(0, limit);
  }

  getStudentsByAge(minAge: number, maxAge: number): Student[] {
    return this.students.filter(
      student => student.age >= minAge && student.age <= maxAge
    );
  }

  getSubjectStatistics(subject: Subject): {
    totalStudents: number;
    averageScore: number;
    highestScore: number;
    lowestScore: number;
  } {
    const relevantGrades = this.students
      .flatMap(student => student.grades)
      .filter(grade => grade.subject === subject);

    if (relevantGrades.length === 0) {
      return { totalStudents: 0, averageScore: 0, highestScore: 0, lowestScore: 0 };
    }

    const scores = relevantGrades.map(grade => grade.score);
    const sum = scores.reduce((acc, score) => acc + score, 0);

    return {
      totalStudents: new Set(relevantGrades.map(g => 
        this.students.find(s => s.grades.includes(g))?.id
      )).size,
      averageScore: sum / scores.length,
      highestScore: Math.max(...scores),
      lowestScore: Math.min(...scores)
    };
  }
}

// 使用例
const manager = new StudentManager();

// 学生追加
const alice = manager.addStudent("Alice", 20, ["math", "science"]);
const bob = manager.addStudent("Bob", 19, ["math", "english"]);

// 成績追加
manager.addGrade(alice.id, { subject: "math", score: 95, semester: 1, year: 2024 });
manager.addGrade(alice.id, { subject: "science", score: 88, semester: 1, year: 2024 });
manager.addGrade(bob.id, { subject: "math", score: 82, semester: 1, year: 2024 });

// 統計情報
console.log("数学の統計:", manager.getSubjectStatistics("math"));
console.log("数学のトップ学生:", manager.getTopStudents("math", 3));
```

## 📊 Week 2 評価基準

### 理解度チェックリスト

#### プリミティブ型 (25%)
- [ ] 基本型（string, number, boolean等）を正しく使用できる
- [ ] リテラル型の概念を理解している
- [ ] null/undefinedの違いを説明できる
- [ ] 他言語との型システムの違いを理解している

#### 型推論 (25%)
- [ ] TypeScriptの型推論メカニズムを理解している
- [ ] 型推論の限界を把握している
- [ ] 適切な場面で明示的型注釈を使用できる
- [ ] 文脈的型推論を活用できる

#### 配列・タプル (25%)
- [ ] 配列型を適切に定義・使用できる
- [ ] タプル型の特徴と用途を理解している
- [ ] 読み取り専用配列を活用できる
- [ ] 配列操作の型安全性を確保できる

#### オブジェクト・関数型 (25%)
- [ ] オブジェクト型を詳細に定義できる
- [ ] 関数の型注釈を適切に設定できる
- [ ] オプショナルプロパティを活用できる
- [ ] 高階関数の型を正しく定義できる

### 成果物チェックリスト

- [ ] **型推論練習集**: 20個以上の型推論例
- [ ] **配列操作ライブラリ**: 型安全な配列操作関数群
- [ ] **データ管理システム**: 学生管理システム
- [ ] **型定義集**: 実用的な型定義のコレクション

## 🔄 Week 3 への準備

### 次週学習内容の予習

```typescript
// Week 3で学習するインターフェースの基礎概念
// 以下のコードを読んで理解しておくこと

// 1. インターフェースの基本
interface User {
  name: string;
  age: number;
  email?: string;  // オプショナル
}

// 2. インターフェースの継承
interface AdminUser extends User {
  permissions: string[];
}

// 3. 型エイリアス
type UserRole = "admin" | "user" | "guest";
type UserWithRole = User & { role: UserRole };

// 4. 関数インターフェース
interface Calculator {
  (a: number, b: number): number;
}
```

### 環境準備

- [ ] TypeScript Playground での実験
- [ ] VS Code での型情報表示の確認
- [ ] ESLint設定の調整
- [ ] 型定義ファイルの理解

### 学習継続のコツ

1. **型推論を意識**: 明示的型注釈と型推論のバランス
2. **実践重視**: 理論だけでなく実際のコード作成
3. **エラーから学習**: 型エラーメッセージの理解
4. **段階的理解**: 複雑な型から簡単な部分に分解

---

**📌 重要**: Week 2はTypeScriptの型システムの基礎を固める重要な期間です。型推論の仕組みを理解し、配列・オブジェクト・関数の型注釈を確実に身につけましょう。

**🌟 次週は、インターフェースとオブジェクト型設計について詳しく学習します！**