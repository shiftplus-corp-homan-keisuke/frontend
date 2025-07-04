# Session1: インターフェース理論と基本実践（45 分）

## 📅 セッション概要

**学習目標**:

- [ ] インターフェースの基本概念と設計原則の理解
- [ ] インターフェースの継承とポリモーフィズムの習得
- [ ] 基本的なインターフェース設計の実践
- [ ] 型安全なオブジェクト操作の実装

**前提知識**:

- Step01: JavaScript 基礎、TypeScript 基本型注釈
- Step02: 基本型システム、型推論、型エイリアス

---

## ⏰ 詳細タイムテーブル

| 時間         | 内容                     | 講師の役割   | 学習者の活動 | 成果物     |
| ------------ | ------------------------ | ------------ | ------------ | ---------- |
| **0-25 分**  | インターフェース理論学習 | 実演・解説   | 理解・メモ   | 基本知識   |
| **25-42 分** | 基本実践・練習問題       | 個別サポート | ハンズオン   | 基本コード |
| **42-45 分** | 振り返り・次回予告       | まとめ・予告 | 質問・確認   | 学習計画   |



---

## 📚 学習内容

### Section 1: インターフェースの基本概念

#### 🎯 インターフェースとは何か

インターフェースは、TypeScript における「契約」の概念です。オブジェクトがどのような形状（プロパティとメソッド）を持つべきかを定義することで、以下の価値を提供します：

- **型安全性の確保**:
  インターフェースを使うことで、オブジェクトが「決められた構造」を持っているかどうかを TypeScript がコンパイル時に自動でチェックします。これにより、間違ったプロパティ名や型のミスを事前に防げます。

```typescript
interface User {
  name: string;
  age: number;
}

const user: User = {
  name: "Taro",
  age: 25,
  // email: "taro@example.com" // ← これを追加すると型エラー
};

// 間違ったプロパティ名も検出される
const invalidUser: User = {
  name: "Hanako",
  // age: 30  // ← 必須プロパティが不足していると型エラー
};
```

- **コードの可読性向上**:
  インターフェースを定義することで、「このオブジェクトはどんな形なのか？」が一目で分かります。複雑な型注釈を毎回書く必要がなくなり、コード全体がすっきりします。

```typescript
interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
}

// インターフェースなしの場合（複雑で読みにくい）
function displayProduct(product: {
  id: number;
  title: string;
  price: number;
  description: string;
}) {
  console.log(`${product.title}: ¥${product.price}`);
}

// インターフェースありの場合（シンプルで分かりやすい）
function displayProductWithInterface(product: Product) {
  console.log(`${product.title}: ¥${product.price}`);
}
```

- **リファクタリングの安全性**:
  もしインターフェースの構造を変更した場合、影響を受ける箇所がすぐに分かります。型エラーとして検出されるので、修正漏れを防ぎやすくなります。

```typescript
interface Book {
  title: string;
  author: string;
  publishedYear: number;
}

const book: Book = {
  title: "TypeScript入門",
  author: "山田太郎",
  publishedYear: 2023,
};

function displayBook(book: Book) {
  console.log(`${book.title} by ${book.author} (${book.publishedYear})`);
}

// もしBookインターフェースを変更した場合...
interface Book {
  title: string;
  authorName: string; // author → authorName に変更
  publishedYear: number;
  isbn?: string; // 新しいプロパティを追加
}

// 上記の変更により、既存のコードで型エラーが発生
// → 修正が必要な箇所が一目で分かる
const updatedBook: Book = {
  title: "TypeScript入門",
  authorName: "山田太郎", // プロパティ名を修正
  publishedYear: 2023,
  isbn: "978-4-1234-5678-9", // 新しいプロパティは任意なので追加しなくてもOK
};
```

#### 1. インターフェースの継承

インターフェースの継承により、共通の構造を効率的に設計できます：

```typescript
// 基本的な人物情報
interface Person {
  id: number;
  name: string;
  email: string;
}

// 従業員情報（Personを継承）
interface Employee extends Person {
  employeeId: string;
  department: string;
  salary: number;
}

// 顧客情報（Personを継承）
interface Customer extends Person {
  customerId: string;
  membershipLevel: "bronze" | "silver" | "gold";
  purchaseHistory: string[];
}

// 使用例
let employee: Employee = {
  id: 1,
  name: "田中太郎",
  email: "tanaka@company.com",
  employeeId: "EMP001",
  department: "開発部",
  salary: 5000000,
};

let customer: Customer = {
  id: 2,
  name: "佐藤花子",
  email: "sato@example.com",
  customerId: "CUST001",
  membershipLevel: "gold",
  purchaseHistory: ["product1", "product2"],
};
```

**2. 複数インターフェースの継承**

```typescript
// 複数のインターフェースを組み合わせ
interface Timestamped {
  createdAt: Date;
  updatedAt: Date;
}

interface Categorized {
  category: string;
  tags: string[];
}

// 複数のインターフェースを継承
interface BlogPost extends Timestamped, Categorized {
  content: string;
}
```

---

## 🎯 練習問題

> 💻 **実践サポート**: [実践コード例 - 練習問題の解法例](./Step03_補足_実践コード例.md#練習問題の解法例) | [トラブルシューティング - よくあるエラー](./Step03_補足_トラブルシューティング.md#よくあるエラー)

### 練習問題 1: 基本的なインターフェース設計と継承 🔰

**要件**:
図書館システムの型定義を作成してください。

```typescript
// TODO: 以下の要件を満たすインターフェースを定義してください

// 1. BaseItemインターフェース（基本アイテム情報）
// 使用例を確認して基本アイテムとして定義すべきものを確認しましょう

// 2. Bookインターフェース（BaseItemを継承）
// - isbn: 文字列
// - pages: 数値
// - genre: 文字列

// 3. Magazineインターフェース（BaseItemを継承）
// - issueNumber: 数値
// - monthlyEdition: 文字列

// ここにインターフェースを定義

// 使用例
const book: Book = {
  id: 1,
  title: "TypeScript入門",
  author: "山田太郎",
  publishedYear: 2024,
  isbn: "978-4-123456-78-9",
  pages: 300,
  genre: "技術書",
};

const magazine: Magazine = {
  id: 2,
  title: "月刊プログラミング",
  author: "編集部",
  publishedYear: 2025,
  issueNumber: 123,
  monthlyEdition: "2025年6月号",
};
```

### 練習問題 2: 継承を活用した関数設計 🔰

**要件**:
図書館アイテムを操作する簡単な関数を作成してください。

```typescript
// TODO: 以下の関数を実装してください

// 1. 基本アイテム情報を表示する関数（BookとMagazine両方に対応）
function displayItemInfo(item: BaseItem): void {
  // 実装してください
  // 期待される出力例: "TypeScript入門 by 山田太郎 (2024年)"
}

// 2. 本のみをフィルタリングする関数
function filterBooks(items: (Book | Magazine)[]): Book[] {
  // 実装してください
  // ヒント: 'isbn' プロパティの存在で判定
}
```

---

## 📝 解答例

### 練習問題 1 解答

```typescript
// 1. BaseItemインターフェース（基本アイテム情報）
interface BaseItem {
  id: number;
  title: string;
  author: string;
  publishedYear: number;
}

// 2. Bookインターフェース（BaseItemを継承）
interface Book extends BaseItem {
  isbn: string;
  pages: number;
  genre: string;
}

// 3. Magazineインターフェース（BaseItemを継承）
interface Magazine extends BaseItem {
  issueNumber: number;
  monthlyEdition: string;
}
```

### 練習問題 2 解答

```typescript
// 1. 基本アイテム情報を表示する関数
function displayItemInfo(item: BaseItem): void {
  console.log(`${item.title} by ${item.author} (${item.publishedYear}年)`);
}

// 2. 本のみをフィルタリングする関数
function filterBooks(items: (Book | Magazine)[]): Book[] {
  return items.filter((item): item is Book => "isbn" in item);
}

// 使用例
const library: (Book | Magazine)[] = [book, magazine];

displayItemInfo(book); // TypeScript入門 by 山田太郎 (2024年)
displayItemInfo(magazine); // 月刊プログラミング by 編集部 (2025年)

const booksOnly = filterBooks(library);
console.log(booksOnly); // [book] （本のみ）
```

---

### 振り返り

**確認ポイント**:

- [x] インターフェースの基本概念を理解できた
- [x] インターフェースの継承の仕組みを習得した
- [x] 複数インターフェースの継承について理解した
- [x] 継承を活用したインターフェース設計ができるようになった

### 質疑応答

**よくある質問**:

- Q: 「型エイリアスとインターフェースの違いは？」
- A: 「次回 Session2 で詳しく学習します。基本的にはオブジェクト型にはインターフェースを使用することが推奨されます」
- Q: 「継承の階層はどこまで深くできますか？」
- A: 「技術的な制限はありませんが、保守性を考えると 3-4 階層程度が実用的です」

---

**❗ 重要**: Session1 で学習した内容は、Session2 でインターフェースの高度な機能（オプションプロパティ、読み取り専用、メソッド定義など）に発展させます。基本概念をしっかりと理解して次回に臨みましょう！

**🌟 次回（Session2）は、インターフェースの高度な機能（オプションプロパティ、readonly、メソッド定義、関数型インターフェース）に挑戦します！**
