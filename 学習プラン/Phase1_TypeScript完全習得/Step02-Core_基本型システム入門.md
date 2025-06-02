# Step 2-Core: 基本型システム入門

> 💡 **学習目標**: TypeScript の基本的な型システムを理解し、実際のコードで型注釈を書けるようになる
>
> - 📖 [専門用語集](./Step02_補足_専門用語集.md) - 分からない用語はここで確認
> - 🚨 [トラブルシューティング](./Step02_補足_トラブルシューティング.md) - エラーが出た時の解決方法
> - 💻 [実践コード例](./Step02_補足_実践コード例.md) - より多くのコード例

## 📅 学習期間・目標

**期間**: 2 時間（基礎編）  
**学習スタイル**: 理論 30% + 実践コード 50% + 演習 20%

### 🎯 到達目標

- [ ] 基本型（string, number, boolean）を正しく使える
- [ ] 配列とオブジェクトの基本的な型注釈を書ける
- [ ] 関数の引数と戻り値に型を付けられる
- [ ] 型エラーの基本的な読み方がわかる

## 📚 Section 1: プリミティブ型の基礎（30 分）

### 🔍 基本型を覚えよう

TypeScript には 3 つの基本的な型があります。まずはこれらを確実に覚えましょう。

#### 1. string 型 - 文字列

```typescript
// 基本的な使い方
let userName: string = "太郎";
let message: string = "こんにちは";
let email: string = "taro@example.com";

// テンプレート文字列も使える
let greeting: string = `こんにちは、${userName}さん！`;

console.log(greeting); // "こんにちは、太郎さん！"
```

**💡 なぜ string 型が重要？**

- ユーザーの名前、メッセージ、URL など、文字列データを安全に扱える
- 文字列と数値を間違えるバグを防げる

#### 2. number 型 - 数値

```typescript
// 基本的な使い方
let age: number = 25;
let price: number = 1000;
let score: number = 85.5;

// 計算も型安全
let total: number = price * 2; // 2000
let average: number = (score + 90) / 2; // 87.75

console.log(`年齢: ${age}歳`);
console.log(`合計: ${total}円`);
```

**💡 なぜ number 型が重要？**

- 年齢、価格、スコアなど、数値データを正確に計算できる
- 文字列との混同を防げる

#### 3. boolean 型 - 真偽値

```typescript
// 基本的な使い方
let isStudent: boolean = true;
let isCompleted: boolean = false;
let hasPermission: boolean = true;

// 条件分岐で使用
if (isStudent) {
  console.log("学生です");
} else {
  console.log("学生ではありません");
}

// 関数の戻り値としても使用
function checkAge(age: number): boolean {
  return age >= 18;
}

let canVote: boolean = checkAge(20); // true
```

**💡 なぜ boolean 型が重要？**

- 条件分岐やフラグ管理で必須
- true/false が明確になる

### ⚠️ よくある間違い

```typescript
// ❌ 間違い: 型が合わない
let userName: string = 123; // Error!
let age: number = "25"; // Error!
let isActive: boolean = "true"; // Error!

// ✅ 正解: 正しい型を使う
let userName: string = "太郎";
let age: number = 25;
let isActive: boolean = true;
```

### 🎯 練習問題 1（5 分）

```typescript
// 以下の変数に適切な型注釈を追加してください
let productName = "ノートパソコン"; // ← 型注釈を追加
let productPrice = 50000; // ← 型注釈を追加
let inStock = true; // ← 型注釈を追加

// 答えは下にスクロール ↓
```

<details>
<summary>答えを見る</summary>

```typescript
let productName: string = "ノートパソコン";
let productPrice: number = 50000;
let inStock: boolean = true;
```

</details>

## 📚 Section 2: 配列とオブジェクトの基礎（45 分）

### 🔧 配列型の基本

配列は同じ型の値をまとめて管理するときに使います。

```typescript
// 文字列の配列
let fruits: string[] = ["りんご", "バナナ", "オレンジ"];
let colors: string[] = ["赤", "青", "緑"];

// 数値の配列
let scores: number[] = [85, 92, 78, 96];
let prices: number[] = [100, 200, 300];

// 配列の操作
fruits.push("ぶどう"); // 要素を追加
console.log(fruits.length); // 4

// 配列の各要素にアクセス
console.log(fruits[0]); // "りんご"
console.log(scores[1]); // 92
```

**💡 実用例：ユーザーリスト**

```typescript
let userNames: string[] = ["田中", "佐藤", "鈴木"];
let userAges: number[] = [25, 30, 28];

// 新しいユーザーを追加
userNames.push("高橋");
userAges.push(32);

console.log(`ユーザー数: ${userNames.length}人`);
```

### 🏗️ オブジェクト型の基本

オブジェクトは関連する情報をまとめて管理するときに使います。

```typescript
// 基本的なオブジェクト型
let user: {
  name: string;
  age: number;
  isStudent: boolean;
} = {
  name: "太郎",
  age: 20,
  isStudent: true,
};

// プロパティにアクセス
console.log(user.name); // "太郎"
console.log(user.age); // 20

// プロパティを変更
user.age = 21;
console.log(user.age); // 21
```

**💡 実用例：商品情報**

```typescript
let product: {
  name: string;
  price: number;
  inStock: boolean;
} = {
  name: "ワイヤレスマウス",
  price: 2500,
  inStock: true,
};

// 商品情報を表示
console.log(`商品名: ${product.name}`);
console.log(`価格: ${product.price}円`);
console.log(`在庫: ${product.inStock ? "あり" : "なし"}`);
```

### 📦 オブジェクトの配列

実際の開発では、オブジェクトの配列をよく使います。

```typescript
// ユーザー情報の配列
let users: {
  name: string;
  age: number;
  email: string;
}[] = [
  { name: "太郎", age: 25, email: "taro@example.com" },
  { name: "花子", age: 30, email: "hanako@example.com" },
  { name: "次郎", age: 28, email: "jiro@example.com" },
];

// 全ユーザーの名前を表示
for (let user of users) {
  console.log(user.name);
}

// 特定の条件でフィルタリング
let adults = users.filter((user) => user.age >= 30);
console.log(adults); // 30歳以上のユーザー
```

### 🎯 練習問題 2（10 分）

```typescript
// 1. 好きな食べ物の配列を作成してください（3つ以上）
let favoriteFoods: /* 型を書く */ = [/* 食べ物を書く */];

// 2. 自分の情報を表すオブジェクトを作成してください
let myInfo: {
  /* プロパティの型を定義 */
} = {
  /* 値を設定 */
};

// 3. 友達の情報を3人分の配列で作成してください
let friends: /* 型を書く */ = [
  /* 友達の情報 */
];
```

<details>
<summary>答えの例を見る</summary>

```typescript
// 1. 好きな食べ物の配列
let favoriteFoods: string[] = ["ラーメン", "寿司", "カレー"];

// 2. 自分の情報
let myInfo: {
  name: string;
  age: number;
  hobby: string;
} = {
  name: "太郎",
  age: 25,
  hobby: "読書",
};

// 3. 友達の情報
let friends: {
  name: string;
  age: number;
  hobby: string;
}[] = [
  { name: "花子", age: 24, hobby: "映画鑑賞" },
  { name: "次郎", age: 26, hobby: "ゲーム" },
  { name: "美咲", age: 23, hobby: "料理" },
];
```

</details>

## 📚 Section 3: 関数の型注釈（45 分）

### 🔧 関数の基本的な型注釈

関数では、引数と戻り値に型を付けます。

```typescript
// 基本的な関数の型注釈
function greet(name: string): string {
  return `こんにちは、${name}さん！`;
}

// 使用例
let message: string = greet("太郎");
console.log(message); // "こんにちは、太郎さん！"

// 数値を扱う関数
function add(a: number, b: number): number {
  return a + b;
}

let result: number = add(10, 20);
console.log(result); // 30
```

### 🎯 実用的な関数の例

```typescript
// 年齢から成人かどうかを判定
function isAdult(age: number): boolean {
  return age >= 18;
}

console.log(isAdult(20)); // true
console.log(isAdult(16)); // false

// 商品の税込み価格を計算
function calculateTotalPrice(price: number, taxRate: number): number {
  return price * (1 + taxRate);
}

let totalPrice: number = calculateTotalPrice(1000, 0.1);
console.log(totalPrice); // 1100

// ユーザー情報を文字列で表示
function formatUser(name: string, age: number): string {
  return `名前: ${name}, 年齢: ${age}歳`;
}

console.log(formatUser("太郎", 25)); // "名前: 太郎, 年齢: 25歳"
```

### 🔄 戻り値がない関数（void 型）

何も返さない関数には`void`型を使います。

```typescript
// コンソールに出力するだけの関数
function showMessage(message: string): void {
  console.log(message);
}

showMessage("Hello TypeScript!"); // "Hello TypeScript!"

// ユーザー情報を表示する関数
function displayUser(name: string, age: number): void {
  console.log(`ユーザー名: ${name}`);
  console.log(`年齢: ${age}歳`);
}

displayUser("花子", 28);
// ユーザー名: 花子
// 年齢: 28歳
```

### ❓ オプショナルパラメータ（省略可能な引数）

引数の後に`?`を付けると、その引数は省略できます。

```typescript
// 挨拶の時間帯は省略可能
function greetWithTime(name: string, timeOfDay?: string): string {
  if (timeOfDay) {
    return `${timeOfDay}、${name}さん！`;
  } else {
    return `こんにちは、${name}さん！`;
  }
}

console.log(greetWithTime("太郎")); // "こんにちは、太郎さん！"
console.log(greetWithTime("太郎", "おはよう")); // "おはよう、太郎さん！"

// デフォルト値を設定することもできる
function createUser(name: string, age: number = 20): string {
  return `ユーザー: ${name} (${age}歳)`;
}

console.log(createUser("太郎")); // "ユーザー: 太郎 (20歳)"
console.log(createUser("花子", 25)); // "ユーザー: 花子 (25歳)"
```

### 🎯 練習問題 3（15 分）

```typescript
// 1. 2つの数値を受け取って、大きい方を返す関数を作成
function getMax(/* 引数の型を書く */): /* 戻り値の型を書く */ {
  // 実装を書く
};

// 2. 商品名と価格を受け取って、商品情報を表示する関数を作成
function showProduct(/* 引数の型を書く */): /* 戻り値の型を書く */ {
  // 実装を書く
};

// 3. 名前と年齢（省略可能）を受け取って、自己紹介文を返す関数を作成
function introduce(/* 引数の型を書く */): /* 戻り値の型を書く */ {
  // 実装を書く
};

// テスト用のコード
console.log(getMax(10, 20)); // 20
showProduct("ノートパソコン", 80000); // 商品情報を表示
console.log(introduce("太郎")); // 年齢なしの自己紹介
console.log(introduce("花子", 25)); // 年齢ありの自己紹介
```

<details>
<summary>答えを見る</summary>

```typescript
// 1. 大きい方を返す関数
function getMax(a: number, b: number): number {
  return a > b ? a : b;
}

// 2. 商品情報を表示する関数
function showProduct(name: string, price: number): void {
  console.log(`商品名: ${name}`);
  console.log(`価格: ${price}円`);
}

// 3. 自己紹介文を返す関数
function introduce(name: string, age?: number): string {
  if (age) {
    return `私の名前は${name}です。${age}歳です。`;
  } else {
    return `私の名前は${name}です。`;
  }
}
```

</details>

## 📚 Section 4: 型推論の基本理解（20 分）

### 🤖 TypeScript が自動で型を推測してくれる

TypeScript は賢いので、値を見て自動的に型を推測してくれます。

```typescript
// 型注釈を書かなくても、TypeScriptが型を推測
let name = "太郎"; // string型として推測
let age = 25; // number型として推測
let isStudent = true; // boolean型として推測

// 配列も推測してくれる
let fruits = ["りんご", "バナナ"]; // string[]として推測
let numbers = [1, 2, 3]; // number[]として推測

// オブジェクトも推測してくれる
let user = {
  name: "太郎",
  age: 25,
}; // { name: string; age: number; }として推測
```

### 🎯 型推論を活用した実用例

```typescript
// 関数の戻り値も推測される
function createGreeting(name: string) {
  return `こんにちは、${name}さん！`; // string型として推測
}

// 配列の操作でも型が推測される
let scores = [85, 92, 78];
let doubled = scores.map((score) => score * 2); // number[]として推測

// 条件分岐でも型が推測される
function getStatus(score: number) {
  if (score >= 80) {
    return "合格"; // string型
  } else {
    return "不合格"; // string型
  }
  // 戻り値はstring型として推測される
}
```

### ⚠️ 型推論の限界

型推論は便利ですが、明示的に型を書いた方が良い場合もあります。

```typescript
// ❌ 型推論だけでは不十分な例
let data; // any型になってしまう（危険）
data = "文字列";
data = 123; // エラーにならない

// ✅ 明示的に型を指定
let data: string | number; // Union型で明示
data = "文字列"; // OK
data = 123; // OK
// data = true; // Error! boolean型は代入できない

// ❌ 空の配列は型が決まらない
let items = []; // any[]になってしまう

// ✅ 明示的に型を指定
let items: string[] = []; // string型の配列として明示
items.push("アイテム1"); // OK
// items.push(123); // Error! number型は追加できない
```

### 💡 型推論を活用するコツ

```typescript
// 1. 初期値がある場合は型推論を活用
let userName = "太郎"; // string型として推測（型注釈不要）

// 2. 初期値がない場合は明示的に型を指定
let userName: string; // 後で値を代入する場合

// 3. 複雑な型の場合は明示的に指定
let user: {
  name: string;
  age: number;
  hobbies: string[];
} = {
  name: "太郎",
  age: 25,
  hobbies: ["読書", "映画"],
};
```

## 🎯 総合演習：簡単な図書管理システム（20 分）

これまで学んだ内容を使って、簡単な図書管理システムを作ってみましょう。

```typescript
// 本の情報を表す型
let book: {
  title: string;
  author: string;
  pages: number;
  isAvailable: boolean;
} = {
  title: "TypeScript入門",
  author: "山田太郎",
  pages: 300,
  isAvailable: true,
};

// 本のリスト
let books: {
  title: string;
  author: string;
  pages: number;
  isAvailable: boolean;
}[] = [
  {
    title: "JavaScript基礎",
    author: "田中花子",
    pages: 250,
    isAvailable: true,
  },
  { title: "React入門", author: "佐藤次郎", pages: 400, isAvailable: false },
  {
    title: "TypeScript実践",
    author: "鈴木美咲",
    pages: 350,
    isAvailable: true,
  },
];

// 本の情報を表示する関数
function displayBook(book: {
  title: string;
  author: string;
  pages: number;
  isAvailable: boolean;
}): void {
  console.log(`タイトル: ${book.title}`);
  console.log(`著者: ${book.author}`);
  console.log(`ページ数: ${book.pages}ページ`);
  console.log(`貸出状況: ${book.isAvailable ? "貸出可能" : "貸出中"}`);
  console.log("---");
}

// 貸出可能な本を検索する関数
function findAvailableBooks(
  books: {
    title: string;
    author: string;
    pages: number;
    isAvailable: boolean;
  }[]
): { title: string; author: string; pages: number; isAvailable: boolean }[] {
  return books.filter((book) => book.isAvailable);
}

// 本を貸し出す関数
function borrowBook(
  books: {
    title: string;
    author: string;
    pages: number;
    isAvailable: boolean;
  }[],
  title: string
): boolean {
  let book = books.find((book) => book.title === title);
  if (book && book.isAvailable) {
    book.isAvailable = false;
    return true; // 貸出成功
  }
  return false; // 貸出失敗
}

// 使用例
console.log("=== 全ての本 ===");
for (let book of books) {
  displayBook(book);
}

console.log("=== 貸出可能な本 ===");
let availableBooks = findAvailableBooks(books);
for (let book of availableBooks) {
  console.log(book.title);
}

console.log("=== 本を借りる ===");
let success = borrowBook(books, "JavaScript基礎");
if (success) {
  console.log("貸出成功！");
} else {
  console.log("貸出失敗...");
}
```

### 🎯 チャレンジ課題

上記のコードを改良してみましょう：

1. 本を返却する`returnBook`関数を作成
2. 著者名で本を検索する`findBooksByAuthor`関数を作成
3. ページ数で本をソートする`sortBooksByPages`関数を作成

## ✅ Step 2-Core 完了チェック

以下の項目ができるようになったかチェックしてください：

### 基本型の理解

- [ ] string, number, boolean 型を正しく使える
- [ ] 基本的な型エラーを読んで修正できる

### 配列とオブジェクト

- [ ] 配列型（string[], number[]）を定義できる
- [ ] オブジェクトの型注釈を書ける
- [ ] オブジェクトの配列を扱える

### 関数の型注釈

- [ ] 関数の引数に型を付けられる
- [ ] 関数の戻り値に型を付けられる
- [ ] オプショナルパラメータを使える

### 型推論の理解

- [ ] 型推論の仕組みを理解している
- [ ] 型推論と明示的型注釈を使い分けられる

## 🔄 次のステップ

Step 2-Core お疲れさまでした！基本的な型システムが身についたら、次は**Step 2-Advanced**で以下の内容を学習します：

- より高度な型推論のパターン
- タプル型と名前付きタプル
- 読み取り専用配列
- 複雑なオブジェクト型設計
- 高階関数の型注釈

**📌 重要**: Step 2-Core の内容が完全に理解できてから、Step 2-Advanced に進むことをお勧めします。

---

**🌟 よくできました！TypeScript の基本的な型システムをマスターしました！**
