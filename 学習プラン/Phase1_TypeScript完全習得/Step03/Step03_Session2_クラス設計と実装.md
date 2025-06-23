# Session2: クラス設計と実装（45 分）

> 💡 **対象**: 他言語経験者（Session1 完了者）
> 🎯 **形式**: 講師サポート付き学習
> ⏰ **時間**: 45 分（集中学習）

## 📚 関連補足資料

このセッションの学習をサポートする補足資料をご用意しています：

- 📖 **[専門用語集](./Step03_補足_専門用語集.md)** - クラス・オブジェクト指向の詳細解説
- 💻 **[実践コード例](./Step03_補足_実践コード例.md)** - クラス設計の実践パターン
- 🚨 **[トラブルシューティング](./Step03_補足_トラブルシューティング.md)** - クラス関連のエラー解決ガイド
- 🌐 **[参考リソース](./Step03_補足_参考リソース.md)** - TypeScript クラス学習リソース集
- 📋 **[補足資料](./Step03_補足資料.md)** - その他の重要な補足情報

> 💡 **活用方法**: 学習中に疑問が生じた際や、より深く理解したい場合に参照してね 🐰

## 📅 セッション概要

**学習目標**:

- [ ] TypeScript クラスの基本概念と実装方法の理解
- [ ] コンストラクタ、プロパティ、メソッドの定義と使用
- [ ] アクセス修飾子（public, private, protected）の習得
- [ ] インターフェースの実装（implements）の実践

**前提知識**:

- Session1: インターフェース基本概念、オプショナル・読み取り専用プロパティ
- Step01-02: TypeScript 基本型、型推論、型エイリアス

---

## ⏰ 詳細タイムテーブル

| 時間         | 内容                 | 講師の役割           | 学習者の活動     | 成果物     |
| ------------ | -------------------- | -------------------- | ---------------- | ---------- |
| **0-3 分**   | 前回復習・今回目標   | 復習確認・目標提示   | 振り返り・質問   | 理解確認   |
| **3-25 分**  | クラス基本概念と実装 | 実演・個別指導       | ハンズオン・実践 | クラス実装 |
| **25-42 分** | 実践演習・練習問題   | コードレビュー・助言 | 個人開発         | 実践コード |
| **42-45 分** | 振り返り・次回予告   | まとめ・予告         | 質問・確認       | 学習計画   |

---

## 📚 学習内容

### Section 1: 前回復習（要点確認）

#### 🔍 Session1 の重要ポイント確認

```typescript
// Session1で学習したインターフェース
interface Product {
  readonly id: number;
  name: string;
  price: number;
  category: string;
  description?: string;
}

// 今日はこれをクラスで実装します
```

---

### Section 2: TypeScript クラスの基本概念

> 📚 **関連資料**: [専門用語集 - クラス基礎概念](./Step03_補足_専門用語集.md#クラス基礎概念) | [実践コード例 - 基本的なクラス設計](./Step03_補足_実践コード例.md#基本的なクラス設計)

#### 🎯 クラスとは何か

**💡 なぜクラスが重要なのか**

クラスは、オブジェクト指向プログラミングの中核概念で、以下の価値を提供します：

- **データとロジックの統合**:
  関連するデータ（プロパティ）と処理（メソッド）を一つの単位にまとめることで、コードの構造が明確になり、保守性が向上します。
- **再利用性の向上**:
  一度定義したクラスから複数のインスタンス（オブジェクト）を作成できるため、同じ構造を持つオブジェクトを効率的に生成できます。
- **カプセル化による安全性**:
  アクセス修飾子を使ってデータの可視性を制御し、意図しない変更から重要なデータを保護できます。
- **型安全性の確保**:
  TypeScript のクラスは強力な型システムと組み合わさることで、コンパイル時にエラーを検出し、実行時エラーを防げます。

#### 1. 基本的なクラス定義

```typescript
// 基本的なクラス定義
class Product {
  // プロパティの定義
  id: number;
  name: string;
  price: number;
  category: string;
  description?: string;

  // コンストラクタ
  constructor(
    id: number,
    name: string,
    price: number,
    category: string,
    description?: string
  ) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.category = category;
    this.description = description;
  }

  // メソッド
  getDisplayName(): string {
    return `${this.name} (¥${this.price})`;
  }

  applyDiscount(percentage: number): void {
    this.price = this.price * (1 - percentage / 100);
  }

  getInfo(): string {
    const desc = this.description ? ` - ${this.description}` : "";
    return `${this.getDisplayName()}${desc}`;
  }
}

// クラスの使用例
const product1 = new Product(
  1,
  "TypeScript入門書",
  3000,
  "書籍",
  "初心者向けの解説書"
);
const product2 = new Product(2, "ワイヤレスマウス", 2500, "PC周辺機器");

console.log(product1.getInfo());
product1.applyDiscount(10); // 10%割引
console.log(product1.getDisplayName());
```

#### 2. アクセス修飾子

**💡 なぜアクセス修飾子が重要なのか**

アクセス修飾子により、クラスの内部実装を隠蔽し、外部からの不正なアクセスを防ぐことができます。

```typescript
class BankAccount {
  // public: どこからでもアクセス可能（デフォルト）
  public accountNumber: string;
  public ownerName: string;

  // private: クラス内部からのみアクセス可能
  private balance: number;
  private pin: string;

  // protected: クラス内部と継承先からアクセス可能
  protected accountType: string;

  constructor(
    accountNumber: string,
    ownerName: string,
    initialBalance: number,
    pin: string
  ) {
    this.accountNumber = accountNumber;
    this.ownerName = ownerName;
    this.balance = initialBalance;
    this.pin = pin;
    this.accountType = "savings";
  }

  // public メソッド: 外部インターフェース
  public deposit(amount: number): boolean {
    if (amount > 0) {
      this.balance += amount;
      return true;
    }
    return false;
  }

  public withdraw(amount: number, inputPin: string): boolean {
    if (this.validatePin(inputPin) && this.balance >= amount) {
      this.balance -= amount;
      return true;
    }
    return false;
  }

  public getBalance(inputPin: string): number | null {
    if (this.validatePin(inputPin)) {
      return this.balance;
    }
    return null;
  }

  // private メソッド: 内部実装
  private validatePin(inputPin: string): boolean {
    return this.pin === inputPin;
  }
}

// 使用例
const account = new BankAccount("123-456-789", "田中太郎", 10000, "1234");

// ✅ public プロパティ・メソッドにはアクセス可能
console.log(account.ownerName); // "田中太郎"
account.deposit(5000);

// ❌ private プロパティには直接アクセス不可
// console.log(account.balance); // エラー！
// account.balance = 1000000; // エラー！

// ✅ 適切なメソッドを通じてアクセス
const balance = account.getBalance("1234");
console.log(balance); // 15000
```

#### 3. インターフェースの実装（implements）

```typescript
// インターフェースの定義
interface Drawable {
  draw(): void;
  getArea(): number;
}

interface Movable {
  move(x: number, y: number): void;
  getPosition(): { x: number; y: number };
}

// インターフェースを実装するクラス
class Circle implements Drawable, Movable {
  private x: number;
  private y: number;
  private radius: number;

  constructor(x: number, y: number, radius: number) {
    this.x = x;
    this.y = y;
    this.radius = radius;
  }

  // Drawable インターフェースの実装
  draw(): void {
    console.log(`円を描画: 中心(${this.x}, ${this.y}), 半径${this.radius}`);
  }

  getArea(): number {
    return Math.PI * this.radius * this.radius;
  }

  // Movable インターフェースの実装
  move(x: number, y: number): void {
    this.x = x;
    this.y = y;
  }

  getPosition(): { x: number; y: number } {
    return { x: this.x, y: this.y };
  }

  // クラス独自のメソッド
  getRadius(): number {
    return this.radius;
  }
}

// 使用例
const circle = new Circle(10, 20, 5);
circle.draw();
console.log(`面積: ${circle.getArea()}`);
circle.move(30, 40);
console.log(`新しい位置: ${JSON.stringify(circle.getPosition())}`);
```

---

## 🎯 練習問題

> 💻 **実践サポート**: [実践コード例 - 練習問題の解法例](./Step03_補足_実践コード例.md#練習問題の解法例) | [トラブルシューティング - よくあるエラー](./Step03_補足_トラブルシューティング.md#よくあるエラー)

### 練習問題 1: 基本的なクラス設計 🔰

**要件**:
書籍管理システムの Book クラスを作成してください。

```typescript
// TODO: 以下の要件を満たすBookクラスを定義してください
// プロパティ:
// - id: 数値（private）
// - title: 文字列（public）
// - author: 文字列（public）
// - price: 数値（private）
// - publishedYear: 数値（public）
// - isAvailable: 真偽値（private、初期値はtrue）

// メソッド:
// - constructor(id, title, author, price, publishedYear)
// - getPrice(): 価格を返す
// - setPrice(newPrice): 価格を設定（正の値のみ）
// - borrow(): 貸出処理（利用可能な場合のみ）
// - return(): 返却処理
// - getInfo(): 書籍情報を文字列で返す

// ここにBookクラスを定義

// 使用例
const book1 = new Book(1, "TypeScript入門", "山田太郎", 3000, 2024);
console.log(book1.getInfo());
console.log(`価格: ¥${book1.getPrice()}`);

book1.borrow();
console.log(`貸出後の状態: ${book1.getInfo()}`);

book1.return();
console.log(`返却後の状態: ${book1.getInfo()}`);
```

### 練習問題 2: インターフェース実装 🔰

**要件**:
以下のインターフェースを実装するクラスを作成してください。

```typescript
// インターフェースの定義
interface Storable {
  save(): boolean;
  load(): boolean;
  delete(): boolean;
}

interface Searchable {
  search(keyword: string): boolean;
  getSearchResults(): string[];
}

// TODO: 以下の要件を満たすDocumentクラスを実装してください
// - Storable と Searchable インターフェースを実装
// - プロパティ: id(private), title(public), content(private), tags(private)
// - コンストラクタで初期化
// - 各インターフェースのメソッドを適切に実装

// ここにDocumentクラスを定義

// 使用例
const doc = new Document(1, "設計書", "システム設計の内容...", [
  "設計",
  "システム",
  "TypeScript",
]);
console.log(doc.save());
console.log(doc.search("TypeScript"));
console.log(doc.getSearchResults());
```

---

## 📝 解答例

### 練習問題 1 解答

```typescript
class Book {
  private id: number;
  public title: string;
  public author: string;
  private price: number;
  public publishedYear: number;
  private isAvailable: boolean;

  constructor(
    id: number,
    title: string,
    author: string,
    price: number,
    publishedYear: number
  ) {
    this.id = id;
    this.title = title;
    this.author = author;
    this.price = price;
    this.publishedYear = publishedYear;
    this.isAvailable = true;
  }

  getPrice(): number {
    return this.price;
  }

  setPrice(newPrice: number): boolean {
    if (newPrice > 0) {
      this.price = newPrice;
      return true;
    }
    return false;
  }

  borrow(): boolean {
    if (this.isAvailable) {
      this.isAvailable = false;
      return true;
    }
    return false;
  }

  return(): boolean {
    if (!this.isAvailable) {
      this.isAvailable = true;
      return true;
    }
    return false;
  }

  getInfo(): string {
    const status = this.isAvailable ? "利用可能" : "貸出中";
    return `${this.title} by ${this.author} (${this.publishedYear}) - ${status}`;
  }
}
```

### 練習問題 2 解答

```typescript
class Document implements Storable {
  private id: number;
  public title: string;
  private content: string;

  constructor(id: number, title: string, content: string) {
    this.id = id;
    this.title = title;
    this.content = content;
  }

  // Storable インターフェースの実装
  save(): boolean {
    console.log(`ドキュメント "${this.title}" を保存しました`);
    return true;
  }

  load(): boolean {
    console.log(`ドキュメント "${this.title}" を読み込みました`);
    return true;
  }
}
```

---

### 振り返り

**確認ポイント**:

- [ ] TypeScript クラスの基本概念を理解できた
- [ ] コンストラクタ、プロパティ、メソッドの定義方法を習得した
- [ ] アクセス修飾子の使い方と重要性を理解した
- [ ] インターフェースの実装（implements）ができるようになった

### 質疑応答

**よくある質問**:

- Q: 「private と protected の違いは？」
- A: 「private はクラス内部からのみアクセス可能、protected は継承先のクラスからもアクセス可能です。次回 Session3 で継承について詳しく学習します」

- Q: 「インターフェースとクラスの使い分けは？」
- A: 「インターフェースは契約（型定義）、クラスは実装です。インターフェースで『何ができるか』を定義し、クラスで『どう実装するか』を決めます」

---

**❗ 重要**: Session2 で学習したクラスの基本概念は、Session3 で抽象クラスと高度な設計パターンに発展させます。基本をしっかりと理解して次回に臨みましょう！

**🌟 次回（Session3）は、抽象クラスと高度な設計パターン（継承、ポリモーフィズム、デザインパターン）に挑戦します！**
