# Session1: JavaScript 復習と TypeScript 基礎（90 分）

> 💡 **対象**: 他言語経験者（JavaScript 基礎知識あり）
> 🎯 **形式**: 講師サポート付き学習
> ⏰ **時間**: 90 分（休憩含む）

## 📚 関連補足資料

このセッションの学習をサポートする補足資料をご用意しています：

- 📖 **[専門用語集](./Step01_補足_専門用語集.md)** - 重要な概念と用語の詳細解説
- 💻 **[実践コード例](./Step01_補足_実践コード例.md)** - 段階的な学習のためのコード例集
- 🔧 **[開発環境ガイド](./Step01_補足_開発環境ガイド.md)** - TypeScript 開発環境の構築と設定
- 🌐 **[参考リソース](./Step01_補足_参考リソース.md)** - 学習に役立つリンク集とリソース
- 🚨 **[トラブルシューティング](./Step01_補足_トラブルシューティング.md)** - よくあるエラーと解決方法

> 💡 **活用方法**: 学習中に疑問が生じた際や、より深く理解したい場合に参照してね 🐰

## 📅 セッション概要

**学習目標**:

- [ ] JavaScript の型関連問題点の理解
- [ ] TypeScript 基本型注釈の習得
- [ ] 簡単な型安全コードの作成

**前提知識**:

- JavaScript 基本構文の理解
- 他言語での型システム経験（推奨）

---

## ⏰ 詳細タイムテーブル

| 時間         | 内容                  | 講師の役割           | 学習者の活動   | 成果物     |
| ------------ | --------------------- | -------------------- | -------------- | ---------- |
| **0-10 分**  | 全体概要・目標設定    | 説明・質疑応答       | 聞く・質問     | 理解確認   |
| **10-30 分** | JavaScript 要点復習   | 要点解説・補足       | 個人学習・確認 | 知識整理   |
| **30-60 分** | TypeScript 基本型注釈 | 実演・個別サポート   | ハンズオン     | 基本コード |
| **60-80 分** | 練習問題 1-2          | 巡回サポート・ヒント | 個人作業       | 練習成果   |
| **80-90 分** | 振り返り・次回予告    | まとめ・予告         | 質問・確認     | 学習計画   |

---

## 📚 学習内容

### Section 1: JavaScript 復習（要点のみ）

> 📚 **関連資料**: [専門用語集 - JavaScript 関連用語](./Step01_補足_専門用語集.md#javascript-関連用語) | [実践コード例 - Hello World から始める段階的学習](./Step01_補足_実践コード例.md#hello-world-から始める段階的学習)

#### 🔍 変数宣言の使い分け

**💡 なぜ重要なのか**

TypeScript では適切な変数宣言により、より正確な型推論が行われます。これは以下の理由で重要です：

**1. 型安全性の向上**

- `const` を使用することで、TypeScript は値が変更されないことを保証し、より厳密な型推論を行います
- `let` の場合、再代入の可能性を考慮した柔軟な型推論が行われます
- `var` は予期しないスコープの問題を引き起こし、型エラーの原因となることがあります

**2. コードの意図の明確化**

- `const` は「この値は変更されない」という意図を明確に示します
- `let` は「この値は後で変更される可能性がある」ことを示します
- これにより、コードレビューや保守が容易になります

```javascript
// 基本的な使い分け
const API_URL = "https://api.example.com"; // 再代入しない値
let userName = "Alice"; // 再代入が必要な値
// var は使用しない（レガシーコードでのみ遭遇）

// オブジェクトや配列の場合
const user = { name: "Alice", age: 30 };
user.age = 31; // オブジェクトの中身は変更可能

const numbers = [1, 2, 3];
numbers.push(4); // 配列の中身は変更可能
```

**🚀 TypeScript での改善点**

```typescript
const API_URL = "https://api.example.com"; // string literal型として推論
let userName = "Alice"; // string型として推論
userName = 123; // エラー！型が一致しない
```

#### 🔍 ES6+要点

> 📚 **詳細解説**: [専門用語集 - 分割代入](./Step01_補足_専門用語集.md#分割代入destructuring) | [スプレッド演算子](./Step01_補足_専門用語集.md#スプレッド演算子spread-operator) | [テンプレートリテラル](./Step01_補足_専門用語集.md#テンプレートリテラルtemplate-literals)

**分割代入**

分割代入（Destructuring Assignment）は、配列やオブジェクトから値を取り出して、個別の変数に代入する構文です。コードをより簡潔で読みやすくし、TypeScript では型推論の精度も向上させます。

**💡 主な利点**

- コードの簡潔性：複数の値を一度に取得できる
- 可読性の向上：必要な値だけを明示的に取り出せる
- TypeScript での型安全性：取り出した値の型が自動的に推論される

```javascript
// オブジェクトの分割代入
const user = { name: "Alice", age: 30, email: "alice@example.com" };
const { name, age } = user; // name: string, age: number として型推論される

// 配列の分割代入
const colors = ["red", "green", "blue"];
const [primary, secondary] = colors; // 両方とも string として型推論される

// 関数の引数での分割代入
function greetUser({ name, age }) {
  return `Hello, ${name}! You are ${age} years old.`;
}

// デフォルト値の設定
const { name, age, country = "Unknown" } = user;

// 変数名の変更
const { name: userName, age: userAge } = user;
```

**スプレッド演算子**

スプレッド演算子（`...`）は、配列やオブジェクトの要素を展開する構文です。イミュータブルなデータ操作を可能にし、TypeScript では型安全性を保ちながら効率的なデータ処理を実現します。

**💡 主な利点**

- イミュータブルな操作：元のデータを変更せずに新しいデータを作成
- 型安全性：TypeScript が展開後の型を正確に推論
- 可読性：配列やオブジェクトの操作が直感的に理解できる

```javascript
// 配列の結合
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];
const combined = [...arr1, ...arr2]; // number[] として型推論される

// オブジェクトのマージ
const baseConfig = { host: "localhost", port: 3000 };
const productionConfig = { ...baseConfig, host: "production.com" };
// { host: string, port: number } として型推論される

// 関数の引数として使用
function sum(...numbers: number[]) {
  return numbers.reduce((total, num) => total + num, 0);
}

// 配列のコピー
const originalArray = [1, 2, 3];
const copiedArray = [...originalArray]; // 浅いコピーを作成
```

**テンプレートリテラル**

テンプレートリテラル（バッククォート `` ` `` で囲む）は、文字列内に変数や式を埋め込むことができる構文です。従来の文字列連結よりも読みやすく、TypeScript では型安全な文字列操作を提供します。

**💡 主な利点**

- 可読性の向上：文字列内での変数展開が直感的
- 複数行対応：改行を含む文字列を自然に記述可能
- 型安全性：TypeScript が埋め込まれた式の型をチェック
- 式の評価：単純な変数だけでなく、計算式も埋め込み可能

```javascript
const name = "Alice";
const age = 30;
const message = `Hello, ${name}! You are ${age} years old.`;
// TypeScriptは ${name} が string、${age} が number であることを認識

// 複数行文字列
const htmlTemplate = `
  <div class="user-card">
    <h2>${name}</h2>
    <p>Age: ${age}</p>
  </div>
`;

// 式の埋め込み
const calculation = `The result is: ${10 + 20}`;
const conditional = `Status: ${age >= 18 ? "Adult" : "Minor"}`;

// 関数呼び出しの埋め込み
function formatDate(date: Date): string {
  return date.toLocaleDateString();
}
const dateMessage = `Today is ${formatDate(new Date())}`;
```

#### 🚨 JavaScript の型関連問題点

**なぜ TypeScript が必要なのか**

JavaScript は動的型付け言語であるため、実行時まで型エラーが発見されません。これにより、開発者が意図しない動作やランタイムエラーが発生しやすくなります。TypeScript は静的型付けを導入することで、これらの問題を開発時に解決します。

```javascript
// 1. 暗黙的型変換による予期しない動作
console.log("5" + 3); // "53" (文字列結合)
console.log("5" - 3); // 2 (数値減算)

// 2. undefined/null の混在
let data;
console.log(data.name); // TypeError: Cannot read property 'name' of undefined

// 3. 関数パラメータの型不明
function calculateArea(width, height) {
  return width * height; // width, heightが数値である保証がない
}
calculateArea("10", "20"); // "1020" (文字列結合)

// 4. オブジェクトプロパティの存在不明
function processUser(user) {
  return user.profile.avatar.url; // 各プロパティの存在が不明
}
```

---

### Section 2: TypeScript 基本型注釈

> 📚 **関連資料**: [開発環境ガイド](./Step01_補足_開発環境ガイド.md) | [参考リソース - TypeScript 関連](./Step01_補足_参考リソース.md#typescript関連) | [実践コード例 - 型注釈の練習](./Step01_補足_実践コード例.md#型注釈の練習)

#### 🎯 TypeScript の基本概念

TypeScript は JavaScript に型安全性を追加する言語です。型注釈により、変数や関数の期待される型を明示的に宣言できます。

> 💡 **詳細解説**: [専門用語集 - 型注釈](./Step01_補足_専門用語集.md#型注釈type-annotation) | [型推論](./Step01_補足_専門用語集.md#型推論type-inference)

#### 1. 基本的な型注釈

```typescript
// 基本型
let userName: string = "Alice";
let userAge: number = 30;
let isActive: boolean = true;
let userData: null = null;
let notDefined: undefined = undefined;
```

#### 2. 型推論の活用

```typescript
// TypeScript は型を自動推論します
let inferredString = "Hello"; // string型として推論
let inferredNumber = 42; // number型として推論
let inferredBoolean = true; // boolean型として推論

// 明示的な型注釈は必要に応じて使用
let explicitString: string = "Hello"; // 明示的な型注釈
```

#### 3. 配列の型注釈

```typescript
// 配列の型注釈
let numbers: number[] = [1, 2, 3, 4, 5];
let names: string[] = ["Alice", "Bob", "Charlie"];
let flags: boolean[] = [true, false, true];

// 代替記法
let scores: Array<number> = [85, 92, 78, 96];
```

#### 4. オブジェクトの型注釈

```typescript
// オブジェクトの型注釈
let user: {
  name: string;
  age: number;
  email: string;
} = {
  name: "Alice",
  age: 30,
  email: "alice@example.com",
};
```

#### 5. 関数の型注釈

```typescript
// 関数の型注釈
function greet(name: string): string {
  return `Hello, ${name}!`;
}

function add(a: number, b: number): number {
  return a + b;
}

function logMessage(message: string): void {
  console.log(message);
}

// アロー関数の型注釈
const multiply = (a: number, b: number): number => a * b;
const isEven = (num: number): boolean => num % 2 === 0;
```

---

## 🎯 練習問題

> 📚 **サポート資料**: [実践コード例 - 型注釈の練習](./Step01_補足_実践コード例.md#型注釈の練習) | [トラブルシューティング](./Step01_補足_トラブルシューティング.md#typescriptコンパイルエラー)

### 練習問題 1: 基本型の型注釈（10 分）

以下の変数に適切な型注釈を追加してください。

```typescript
// 以下の変数に型注釈を追加してください
let userName = "太郎";
let userAge = 25;
let isActive = true;
let score = 85.5;
let message = "こんにちは";
```

### 練習問題 2: 関数の型注釈（10 分）

以下の関数に適切な型注釈を追加してください。

```typescript
// 以下の関数に型注釈を追加してください
function greet(name) {
  return `こんにちは、${name}さん！`;
}

function add(a, b) {
  return a + b;
}

function isEven(num) {
  return num % 2 === 0;
}
```

---

## 👨‍🏫 学習ポイント

### 🤔 よくある質問

**Q: 型注釈は必須ですか？**
A: TypeScript は型推論があるので必須ではありませんが、明示的に書くことでコードの意図が明確になります。

**Q: JavaScript との互換性は？**
A: TypeScript は JavaScript のスーパーセットなので、既存の JavaScript コードはそのまま動作します。

---

**📌 重要**: Session1 は TypeScript の基礎固めです。焦らず確実に基本概念を理解しましょう。

**🌟 次回（Session2）は、より実践的な TypeScript コードの作成に挑戦します！**
