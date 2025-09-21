# STEP02 総復習：高度な型システムと型推論メカニズム

## 📋 概要

STEP02「高度な型システムと型推論メカニズム」の理論学習内容を総復習するためのコンパクトなドキュメントです。

## 🎯 学習目標

- [ ] ユニオン型による柔軟な型定義の習得
- [ ] 型ガードによる安全な型の絞り込みの理解
- [ ] const assertion（`as const`）の重要ポイント
- [ ] 構造的型付けの概念
- [ ] タプル型の基本活用
- [ ] 関数オーバーロードの要点
- [ ] 実践での活用場面の把握

---

## 1. ユニオン型による柔軟な型定義

### 1.1 基本的なユニオン型

**概念**
複数の型のうちいずれか一つを表現する型。`|`記号で組み合わせる。

```typescript
// 基本的なリテラル型のユニオン
type Grade = 1 | 2 | 3 | 4 | 5 | 6;
type Status = "active" | "inactive" | "graduated";
type ID = string | number;

// 実用例
type Student = {
  id: number;
  name: string;
  grade: Grade;
  status: Status;
};
```

**活用場面**: 設定値の管理、状態の定義、APIレスポンスの型定義

### 1.2 オブジェクトのユニオン型

```typescript
type Circle = { kind: "circle"; radius: number };
type Rectangle = { kind: "rectangle"; width: number; height: number };
type Shape = Circle | Rectangle;

// 面積計算（型ガードと組み合わせ）
function calculateArea(shape: Shape): number {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;
    case "rectangle":
      return shape.width * shape.height;
  }
}
```

### 1.3 Discriminated Union パターン

**概念**
共通の判別プロパティを持つオブジェクトのユニオン。TypeScriptが型を自動的に絞り込む。

```typescript
type ApiResult<T> =
  | { success: true; data: T }
  | { success: false; error: string; code: number };

function handleApiResult<T>(result: ApiResult<T>): T | null {
  if (result.success) {
    return result.data;
  } else {
    console.error(`エラー ${result.code}: ${result.error}`);
    return null;
  }
}
```

**活用場面**: API レスポンス、状態管理、イベント処理

---

## 2. 型ガードによる安全な型の絞り込み

### 2.1 typeof型ガード

**概念**
`typeof`演算子でプリミティブ型を判定し、型を安全に絞り込む。

```typescript
function processValue(value: string | number | boolean): string {
  if (typeof value === "string") {
    return value.toUpperCase();
  } else if (typeof value === "number") {
    return value.toFixed(2);
  } else {
    return value ? "真" : "偽";
  }
}
```

### 2.2 in演算子による型ガード

**概念**
オブジェクトに特定のプロパティが存在するかを判定。

```typescript
type Teacher = { name: string; subject: string; experience: number };
type Student = { name: string; grade: number; subjects: string[] };
type Person = Teacher | Student;

function getPersonInfo(person: Person): string {
  if ("subject" in person) {
    // Teacher型として扱われる
    return `${person.name}先生は${person.subject}を教えています`;
  } else {
    // Student型として扱われる
    return `${person.name}さんは${person.grade}年生です`;
  }
}
```

### 2.3 instanceof型ガード

**概念**
オブジェクトが特定のクラスのインスタンスかを判定。

```typescript
class ValidationError extends Error {
  constructor(message: string, public field: string) {
    super(message);
  }
}

function handleError(error: Error | ValidationError): string {
  if (error instanceof ValidationError) {
    return `入力エラー: ${error.message} (フィールド: ${error.field})`;
  } else {
    return `一般エラー: ${error.message}`;
  }
}
```

### 2.4 カスタム型ガード関数の基礎

**概念**
独自の型ガード関数を作成。戻り値の型に`is`キーワードを使用。

```typescript
function isString(value: unknown): value is string {
  return typeof value === "string";
}

function isValidStudent(obj: unknown): obj is Student {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "name" in obj &&
    "grade" in obj &&
    typeof (obj as any).name === "string" &&
    typeof (obj as any).grade === "number"
  );
}
```

**活用場面**: API データの検証、unknown型の処理、配列の型ガード

---

## 3. 高度な型推論メカニズム

### 3.1 const assertion（`as const`）の重要ポイント

**概念**
TypeScriptの型推論をより厳密に制御し、値を具体的なリテラル型として保持。

```typescript
// 通常の型推論
let theme = "dark"; // string型

// const assertionによる厳密な型推論
const strictTheme = "dark" as const; // "dark"型（リテラル型）

// 配列での活用
const colors = ["red", "green", "blue"] as const; // readonly ["red", "green", "blue"]
type Color = typeof colors[number]; // "red" | "green" | "blue"

// 設定オブジェクトでの活用
const APP_CONFIG = {
  theme: "light",
  language: "ja",
  pageSize: 20,
} as const;

type Theme = typeof APP_CONFIG.theme; // "light"
```

**活用場面**: 設定値の管理、定数の定義、型の抽出

### 3.2 構造的型付け（Structural Typing）の概念

**概念**
型の名前ではなく構造（プロパティやメソッドの形）によって型の互換性を判断。

```typescript
type Point2D = { x: number; y: number };
type Point3D = { x: number; y: number; z: number };

function calculateDistance2D(point: Point2D): number {
  return Math.sqrt(point.x * point.x + point.y * point.y);
}

const point3D: Point3D = { x: 1, y: 2, z: 3 };
const distance = calculateDistance2D(point3D); // エラーなし！構造的に互換
```

**活用場面**: インターフェースの設計、ライブラリの型定義、API の型安全性

---

## 4. タプル型の基本活用

### 4.1 基本的なタプル型

**概念**
固定長で各要素の型が決まっている配列型。

```typescript
// 基本的なタプル型
type Coordinate = [number, number]; // [x, y]
type StudentRecord = [string, number, boolean]; // [name, grade, isActive]

// 関数の戻り値としての活用
function getStudentInfo(): [string, number] {
  return ["Alice", 3];
}

const [name, grade] = getStudentInfo();
```

### 4.2 名前付きタプル（TypeScript 4.0+）

```typescript
type NamedCoordinate = [x: number, y: number];
type StudentData = [name: string, grade: number, isActive: boolean];

// より読みやすい関数シグネチャ
function createStudent(...args: StudentData): Student {
  const [name, grade, isActive] = args;
  return { name, grade, isActive };
}
```

**活用場面**: 関数の複数戻り値、座標データ、設定値のペア

---

## 5. 関数オーバーロードの要点

### 5.1 基本的な関数オーバーロード

**概念**
同じ関数名で異なる引数の型や戻り値の型を持つ複数の関数シグネチャを定義。

```typescript
// オーバーロードシグネチャ
function format(value: string): string;
function format(value: number): string;
function format(value: Date): string;

// 実装シグネチャ
function format(value: string | number | Date): string {
  if (typeof value === "string") {
    return value.toUpperCase();
  } else if (typeof value === "number") {
    return value.toFixed(2);
  } else {
    return value.toLocaleDateString("ja-JP");
  }
}
```

### 5.2 条件付きオーバーロード

```typescript
function createElement(tag: "div"): HTMLDivElement;
function createElement(tag: "span"): HTMLSpanElement;
function createElement(tag: string): HTMLElement;

function createElement(tag: string): HTMLElement {
  return document.createElement(tag);
}
```

**活用場面**: ユーティリティ関数、DOM操作、型安全なAPI設計

---

## 6. 実践での活用場面（簡潔版）

### 6.1 状態管理
```typescript
type LoadingState = 
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: any }
  | { status: "error"; error: string };
```

### 6.2 API エラーハンドリング
```typescript
type ApiResponse<T> = 
  | { success: true; data: T }
  | { success: false; error: string };
```

### 6.3 条件分岐の型安全性
```typescript
function processData(data: unknown) {
  if (isValidData(data)) {
    // data は ValidData 型として扱われる
    return data.process();
  }
}
```

---

## 📝 まとめ

### 重要ポイント
1. **ユニオン型**: 柔軟な型定義でDiscriminated Unionパターンを活用
2. **型ガード**: typeof、in、instanceof、カスタム型ガードを使い分け
3. **const assertion**: `as const`で厳密な型推論を制御
4. **構造的型付け**: 型の構造による互換性を理解
5. **タプル型**: 固定長配列で型安全な複数値の管理
6. **関数オーバーロード**: 型に応じた適切な戻り値の提供

### 次のステップへの準備
- インターフェースとオブジェクト型の詳細学習
- より高度な型操作とユーティリティ型の習得
- 実践プロジェクトでの型設計パターンの適用

## 🔗 関連リソース

- [TypeScript Handbook - Union Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#union-types)
- [TypeScript Handbook - Type Guards](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)
- [TypeScript Handbook - const assertions](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-4.html#const-assertions)