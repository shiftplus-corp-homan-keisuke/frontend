# Session1: JavaScript復習とTypeScript基礎（90分）

> 💡 **対象**: 他言語経験者（JavaScript基礎知識あり）  
> 🎯 **形式**: 講師サポート付き学習  
> ⏰ **時間**: 90分（休憩含む）

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

| 時間 | 内容 | 講師の役割 | 学習者の活動 | 成果物 |
|------|------|------------|--------------|--------|
| **0-10分** | 全体概要・目標設定 | 説明・質疑応答 | 聞く・質問 | 理解確認 |
| **10-30分** | JavaScript要点復習 | 要点解説・補足 | 個人学習・確認 | 知識整理 |
| **30-60分** | TypeScript基本型注釈 | 実演・個別サポート | ハンズオン | 基本コード |
| **60-80分** | 練習問題1-2 | 巡回サポート・ヒント | 個人作業 | 練習成果 |
| **80-90分** | 振り返り・次回予告 | まとめ・予告 | 質問・確認 | 学習計画 |

---

## 📚 学習内容

### Section 1: JavaScript復習（要点のみ）

#### 🔍 変数宣言の使い分け

**💡 なぜ重要なのか**

TypeScript では適切な変数宣言により、より正確な型推論が行われます。

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

**分割代入**

```javascript
// オブジェクトの分割代入
const user = { name: "Alice", age: 30, email: "alice@example.com" };
const { name, age } = user;

// 配列の分割代入
const colors = ["red", "green", "blue"];
const [primary, secondary] = colors;

// 関数の引数での分割代入
function greetUser({ name, age }) {
  return `Hello, ${name}! You are ${age} years old.`;
}
```

**スプレッド演算子**

```javascript
// 配列の結合
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];
const combined = [...arr1, ...arr2];

// オブジェクトのマージ
const baseConfig = { host: "localhost", port: 3000 };
const productionConfig = { ...baseConfig, host: "production.com" };
```

**テンプレートリテラル**

```javascript
const name = "Alice";
const age = 30;
const message = `Hello, ${name}! You are ${age} years old.`;

// 複数行文字列
const htmlTemplate = `
  <div class="user-card">
    <h2>${name}</h2>
    <p>Age: ${age}</p>
  </div>
`;
```

#### 🚨 JavaScript の型関連問題点

**なぜ TypeScript が必要なのか**

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

### Section 2: TypeScript基本型注釈

#### 🎯 TypeScript の基本概念

TypeScript は JavaScript に型安全性を追加する言語です。型注釈により、変数や関数の期待される型を明示的に宣言できます。

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

### 練習問題 1: 基本型の型注釈（10分）

以下の変数に適切な型注釈を追加してください。

```typescript
// 以下の変数に型注釈を追加してください
let userName = "太郎";
let userAge = 25;
let isActive = true;
let score = 85.5;
let message = "こんにちは";
```

### 練習問題 2: 関数の型注釈（10分）

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

## 👨‍🏫 講師サポートポイント

### 🔍 よくあるつまずきポイント

1. **型注釈の書き方**: コロン（:）の位置と型名の大文字小文字
2. **型推論との使い分け**: いつ明示的に型を書くべきか
3. **エラーメッセージの読み方**: TypeScript コンパイラのエラー理解

### 🤔 よくある質問

**Q: 型注釈は必須ですか？**
A: TypeScript は型推論があるので必須ではありませんが、明示的に書くことでコードの意図が明確になります。

**Q: JavaScript との互換性は？**
A: TypeScript は JavaScript のスーパーセットなので、既存の JavaScript コードはそのまま動作します。

### 🎯 個別サポート時の注意点

- 他言語経験者は型システムの概念は理解しやすい
- JavaScript 特有の動的型付けとの違いを強調
- 実際のエラーを見せながら説明すると効果的

---

## 📊 Session1 評価基準

### 理解度チェックリスト

- [ ] JavaScript の型関連問題を説明できる
- [ ] 基本的な型注釈を正しく書ける
- [ ] 型推論の仕組みを理解している
- [ ] 関数の型注釈を適切に設定できる

### 次回への準備

- [ ] TypeScript 開発環境の確認
- [ ] 基本的な型注釈の復習
- [ ] Session2 で使用するエディタの準備

---

**📌 重要**: Session1 は TypeScript の基礎固めです。焦らず確実に基本概念を理解しましょう。

**🌟 次回（Session2）は、より実践的な TypeScript コードの作成に挑戦します！**