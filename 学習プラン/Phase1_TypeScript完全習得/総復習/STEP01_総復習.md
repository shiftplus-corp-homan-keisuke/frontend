# STEP01 総復習：JavaScript復習とTypeScript導入

## 📋 概要

STEP01「JavaScript復習とTypeScript導入」の理論学習内容を総復習するためのドキュメントです。

## 🎯 学習目標

- [ ] JavaScript基礎の復習と確認
- [ ] JavaScriptの型関連問題点の理解
- [ ] TypeScriptの型安全性の重要性の理解
- [ ] 基本的な型注釈の理解と実践
- [ ] 関数の型定義の習得

---

## 1. JavaScript復習とTypeScript導入の基礎

### 1.1 ES6+構文の重要ポイント

#### 分割代入（Destructuring Assignment）
配列やオブジェクトから値を取り出して個別の変数に代入する構文。

```javascript
// 配列の分割代入
const [first, second, third] = ["red", "green", "blue"];

// オブジェクトの分割代入
const { name, age } = { name: "Alice", age: 30 };

// 関数の引数での分割代入
function greetUser({ name, age }) {
  return `Hello, ${name}! You are ${age} years old.`;
}

```

**活用場面**: API レスポンスの抽出、関数の引数処理、配列データの処理

#### スプレッド演算子（Spread Operator）
配列やオブジェクトを「展開」する構文（`...`）。イミュータブルな操作を簡単に実現。

```javascript
// 配列の結合・コピー
const combined = [...arr1, ...arr2];
const copied = [...originalArray];

// オブジェクトのマージ
const updated = { ...baseConfig, debug: false };

// 関数の引数展開
console.log(sum(...numbers));
```

**活用場面**: 配列の結合、オブジェクトのマージ、関数の引数展開

#### 残余パラメータ（Rest Parameters）
関数の引数で可変長の引数を配列として受け取る構文。

```javascript
function sum(...numbers) {
  return numbers.reduce((total, num) => total + num, 0);
}
```

#### テンプレートリテラル（Template Literals）
変数や式を `${}` で直接埋め込める動的文字列作成の構文。

```javascript
const message = `Hello, ${name}! You are ${age} years old.`;
const htmlTemplate = `
  <div class="user-card">
    <h2>${name}</h2>
    <p>Age: ${age}</p>
  </div>
`;
```

**活用場面**: 動的メッセージ生成、HTML テンプレート、URL 構築、ログ出力

### 1.2 JavaScriptの型関連問題点

#### 暗黙的型変換による予期しない動作
```javascript
console.log("5" + 3);     // "53" (文字列結合)
console.log("5" - 3);     // 2 (数値計算)
console.log("" == false); // true
```

#### undefined/null混在問題
```javascript
let undefinedValue;
console.log(undefinedValue == null);  // true (緩い比較)
console.log(undefinedValue === null); // false (厳密な比較)
```

#### 関数パラメータの型不明
```javascript
function calculateArea(width, height) {
  return width * height;
}
console.log(calculateArea("5", "3")); // "53" (意図しない結果)
```

### 1.3 TypeScriptの型安全性の重要性

**型安全性の利点**
1. **コンパイル時エラー検出** - 実行前に型エラーを発見
2. **コードの自己文書化** - 型情報がコードの仕様を表現
3. **IDE支援の向上** - 自動補完の精度向上
4. **保守性の向上** - 型情報による安全な変更

---

## 2. 基本型と変数の型注釈

### 2.1 プリミティブ型

```typescript
// 基本型
let userName: string = "Alice";
let age: number = 30;
let isActive: boolean = true;

// 型推論（推奨）
const greeting = "Hello, World!"; // string型として推論
const count = 42; // number型として推論
```

### 2.2 配列型

```typescript
// 配列型の記法
let numbers: number[] = [1, 2, 3, 4, 5];
let names: Array<string> = ["Alice", "Bob", "Charlie"];

// 多次元配列
let matrix: number[][] = [[1, 2], [3, 4]];

// 混合型配列（Union型）
let mixedArray: (string | number)[] = ["Alice", 30, "Bob", 25];
```

### 2.3 オブジェクト型

```typescript
// 基本的なオブジェクト型
let user: {
  name: string;
  age: number;
  email?: string; // オプショナル
  readonly id: number; // 読み取り専用
} = {
  id: 1,
  name: "Alice",
  age: 30
};

// インデックスシグネチャ
let dictionary: { [key: string]: string } = {
  hello: "こんにちは",
  goodbye: "さようなら"
};
```

---

## 3. 関数の型定義

### 3.1 関数の型注釈

```typescript
// 基本的な関数の型注釈
function add(a: number, b: number): number {
  return a + b;
}

// 戻り値の型推論（推奨）
function subtract(a: number, b: number) {
  return a - b; // number型として推論
}

// void型
function logMessage(message: string): void {
  console.log(message);
}
```

### 3.2 引数のデフォルト値とオプショナル引数

```typescript
// デフォルト値
function greet(name: string, greeting: string = "Hello"): string {
  return `${greeting}, ${name}!`;
}

// オプショナル引数
function formatName(firstName: string, lastName?: string): string {
  return lastName ? `${firstName} ${lastName}` : firstName;
}
```

### 3.3 アロー関数の型定義

```typescript
// アロー関数
const multiply = (x: number, y: number): number => x * y;

// 関数型の型注釈
let calculator: (x: number, y: number) => number;
calculator = (a, b) => a + b;

// 高階関数
function applyOperation(
  x: number,
  y: number,
  operation: (a: number, b: number) => number
): number {
  return operation(x, y);
}
```
