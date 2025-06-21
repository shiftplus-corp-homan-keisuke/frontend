# Session1: インターフェース理論と基本実践（60 分）

> 💡 **対象**: 他言語経験者（JavaScript 基礎・TypeScript 基本型知識あり）
> 🎯 **形式**: 講師サポート付き学習
> ⏰ **時間**: 60 分（集中学習）

## 📚 関連補足資料

このセッションの学習をサポートする補足資料をご用意しています：

- 📖 **[専門用語集](./Step03_補足_専門用語集.md)** - インターフェース・型設計の詳細解説
- 💻 **[実践コード例](./Step03_補足_実践コード例.md)** - 段階的な実装例とベストプラクティス
- 🚨 **[トラブルシューティング](./Step03_補足_トラブルシューティング.md)** - インターフェース関連のエラー解決ガイド
- 🌐 **[参考リソース](./Step03_補足_参考リソース.md)** - TypeScript 型システム学習リソース集
- 📋 **[補足資料](./Step03_補足資料.md)** - その他の重要な補足情報

> 💡 **活用方法**: 学習中に疑問が生じた際や、より深く理解したい場合に参照してね 🐰

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

| 時間         | 内容                     | 講師の役割         | 学習者の活動   | 成果物     |
| ------------ | ------------------------ | ------------------ | -------------- | ---------- |
| **0-5 分**   | 前 Step 復習・今回目標   | 復習確認・目標提示 | 振り返り・質問 | 理解確認   |
| **5-35 分**  | インターフェース理論学習 | 実演・解説         | 理解・メモ     | 基本知識   |
| **35-55 分** | 基本実践・練習問題       | 個別サポート       | ハンズオン     | 基本コード |
| **55-60 分** | 振り返り・次回予告       | まとめ・予告       | 質問・確認     | 学習計画   |

---

## 📚 学習内容

### Section 1: 前 Step 復習（要点のみ）

#### 🔍 Step02 の重要ポイント確認

**基本型システムの復習**

```typescript
// Step02で学習した基本型
let userName: string = "Alice";
let userAge: number = 30;
let isActive: boolean = true;

// 型エイリアス
type UserId = number;
type UserStatus = "active" | "inactive" | "pending";

// 配列とオブジェクトの型注釈
let scores: number[] = [85, 92, 78];
let user: {
  id: UserId;
  name: string;
  status: UserStatus;
} = {
  id: 1,
  name: "Alice",
  status: "active",
};
```

---

### Section 2: インターフェースの基本概念

> 📚 **関連資料**: [専門用語集 - インターフェース基礎概念](./Step03_補足_専門用語集.md#インターフェース基礎概念) | [実践コード例 - 基本的なインターフェース設計](./Step03_補足_実践コード例.md#基本的なインターフェース設計)

#### 🎯 インターフェースとは何か

**💡 なぜインターフェースが重要なのか**

インターフェースは、TypeScript における「契約」の概念です。オブジェクトがどのような形状（プロパティとメソッド）を持つべきかを定義することで、以下の価値を提供します：

- **型安全性の確保**:
- インターフェースを使うことで、オブジェクトが「決められた構造」を持っているかどうかを TypeScript がコンパイル時に自動でチェックします。これにより、間違ったプロパティ名や型のミスを事前に防げます。
- **コードの可読性向上**:
- インターフェースを定義することで、「このオブジェクトはどんな形なのか？」が一目で分かります。複雑な型注釈を毎回書く必要がなくなり、コード全体がすっきりします。
- **チーム開発での契約**:
- インターフェースは「この形でデータをやり取りしよう」という“約束”です。API 設計やコンポーネント間の連携で、誰が見ても仕様が明確になり、認識のズレやバグを減らせます。
- **リファクタリングの安全性**:
- もしインターフェースの構造を変更した場合、影響を受ける箇所がすぐに分かります。型エラーとして検出されるので、修正漏れを防ぎやすくなります。

#### 1. 基本的なインターフェース定義

```typescript
// Step02のオブジェクト型注釈
let user: {
  id: number;
  name: string;
  email: string;
} = {
  id: 1,
  name: "Alice",
  email: "alice@example.com",
};

// ↓ インターフェースで改善

interface User {
  id: number;
  name: string;
  email: string;
}

let user: User = {
  id: 1,
  name: "Alice",
  email: "alice@example.com",
};

// 再利用可能
let anotherUser: User = {
  id: 2,
  name: "Bob",
  email: "bob@example.com",
};
```

**🚀 実際のプロジェクトでの活用例**

```typescript
// 商品情報の型定義
interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
}

// 商品一覧の表示
function displayProducts(products: Product[]): void {
  products.forEach((product) => {
    console.log(`${product.name}: ¥${product.price}`);
  });
}

// 商品検索
function findProduct(products: Product[], id: number): Product | undefined {
  return products.find((product) => product.id === id);
}
```

#### 2. インターフェースの継承

**💡 なぜインターフェース継承が重要なのか**

インターフェースの継承は、共通の構造を持つ型を効率的に設計するための強力な機能です。継承を使うことで、以下のメリットが得られます：

- **コードの重複削減**: 共通のプロパティを一度定義すれば、複数のインターフェースで再利用できます
- **型の階層構造**: 基本型から特化型への自然な関係を表現できます
- **保守性の向上**: 共通部分の変更が必要な場合、基底インターフェースを変更するだけで全体に反映されます

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

**🚀 実際のプロジェクトでの活用例**

```typescript
// 基本的なコンテンツ情報
interface BaseContent {
  id: string;
  title: string;
  createdAt: Date;
  author: string;
}

// 記事情報（BaseContentを継承）
interface Article extends BaseContent {
  content: string;
  tags: string[];
  category: string;
}

// 動画情報（BaseContentを継承）
interface Video extends BaseContent {
  duration: number;
  videoUrl: string;
  thumbnailUrl: string;
}

// コンテンツ管理関数
function displayContent(content: BaseContent): void {
  console.log(`${content.title} by ${content.author}`);
}

// 記事と動画の両方に使用可能
displayContent(article); // OK
displayContent(video); // OK
```

#### 3. 複数インターフェースの継承

```typescript
// 複数のインターフェースから継承
interface Timestamped {
  createdAt: Date;
  updatedAt: Date;
}

interface Categorized {
  category: string;
  tags: string[];
}

// 複数のインターフェースを継承
interface BlogPost extends BaseContent, Timestamped, Categorized {
  content: string;
  publishedAt?: Date;
}

let blogPost: BlogPost = {
  id: "post1",
  title: "TypeScript継承について",
  createdAt: new Date("2025-01-01"),
  author: "開発者",
  updatedAt: new Date("2025-01-15"),
  category: "技術",
  tags: ["TypeScript", "プログラミング"],
  content: "インターフェース継承は...",
  publishedAt: new Date("2025-01-10"),
};
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
// - id: 数値
// - title: 文字列
// - author: 文字列
// - publishedYear: 数値

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
図書館アイテムを操作する関数を作成してください。

```typescript
// TODO: 以下の関数を実装してください

// 1. 基本アイテム情報を表示する関数（BookとMagazine両方に対応）
// 期待される出力例:
// TypeScript入門 by 山田太郎 (2024年)
// 月刊プログラミング by 編集部 (2025年)
function displayItemInfo(item: BaseItem): void {
  // 実装してください
}

// 2. 著者で検索する関数（BookとMagazine両方を検索対象）
function findItemsByAuthor(items: BaseItem[], author: string): BaseItem[] {
  // 実装してください
}

// 3. 本のみをフィルタリングする関数
function filterBooks(items: (Book | Magazine)[]): Book[] {
  // 実装してください
  // ヒント: typeof演算子またはin演算子を使用
}
```

---

## 📝 解答例

### 練習問題 1 解答

```typescript
interface BaseItem {
  id: number;
  title: string;
  author: string;
  publishedYear: number;
}

interface Book extends BaseItem {
  isbn: string;
  pages: number;
  genre: string;
}

interface Magazine extends BaseItem {
  issueNumber: number;
  monthlyEdition: string;
}
```

### 練習問題 2 解答

```typescript
function displayItemInfo(item: BaseItem): void {
  console.log(`${item.title} by ${item.author} (${item.publishedYear}年)`);
}

function findItemsByAuthor(items: BaseItem[], author: string): BaseItem[] {
  return items.filter((item) => item.author === author);
}

function filterBooks(items: (Book | Magazine)[]): Book[] {
  return items.filter((item): item is Book => "isbn" in item);
}
```

---

### 振り返り

**確認ポイント**:

- [ ] インターフェースの基本概念を理解できた
- [ ] インターフェースの継承の仕組みを習得した
- [ ] 複数インターフェースの継承について理解した
- [ ] 継承を活用したインターフェース設計ができるようになった

### 質疑応答

**よくある質問**:

- Q: 「型エイリアスとインターフェースの違いは？」
- A: 「次回 Session2 で詳しく学習します。基本的にはオブジェクト型にはインターフェースを使用することが推奨されます」
- Q: 「継承の階層はどこまで深くできますか？」
- A: 「技術的な制限はありませんが、保守性を考えると 3-4 階層程度が実用的です」

---

**❗ 重要**: Session1 で学習した内容は、Session2 でクラス設計と実装に発展させます。基本概念をしっかりと理解して次回に臨みましょう！

**🌟 次回（Session2）は、クラス設計と実装（コンストラクタ、プロパティ、メソッド、アクセス修飾子）に挑戦します！**
