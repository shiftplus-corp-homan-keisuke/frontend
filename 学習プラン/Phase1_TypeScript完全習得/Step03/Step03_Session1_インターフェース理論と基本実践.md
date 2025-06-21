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
- [ ] オプショナルプロパティ・読み取り専用プロパティの習得
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

#### 2. オプショナルプロパティ

**💡 なぜオプショナルプロパティが重要なのか**

実際のアプリケーション開発では、「必須ではないデータ」を型安全に扱う必要があります。

例えば：

- ユーザーのプロフィール画像や自己紹介文など、「登録時には入力しなくてもよい」情報
- 商品の割引価格やレビューなど、「後から追加されるかもしれない」データ
- API のレスポンスで、状況によって含まれたり含まれなかったりする項目

このような場合、オプショナルプロパティ（?）を使うことで「そのプロパティがあってもなくても OK」と型で表現でき、柔軟かつ安全にデータを扱えます。

```typescript
interface UserProfile {
  id: number;
  name: string;
  email: string;
  age?: number; // オプショナル
  bio?: string; // オプショナル
  avatar?: string; // オプショナル
}

// 必須フィールドのみでも有効
let basicUser: UserProfile = {
  id: 1,
  name: "Alice",
  email: "alice@example.com",
};

// オプショナルフィールドありでも有効
let detailedUser: UserProfile = {
  id: 2,
  name: "Bob",
  email: "bob@example.com",
  age: 25,
  bio: "Web developer",
};
```

**🎯 実践的な使用例**

```typescript
// ユーザー登録フォームでの活用
interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  age?: number; // 任意項目
  newsletter?: boolean; // 任意項目
}

function createUser(userData: CreateUserRequest): User {
  return {
    id: generateId(),
    name: userData.name,
    email: userData.email,
    age: userData.age || 0, // デフォルト値
    newsletter: userData.newsletter || false,
  };
}
```

#### 3. 読み取り専用プロパティ

**💡 なぜ読み取り専用プロパティが重要なのか**

データの不変性を保証し、意図しない変更を防ぐための重要な仕組みです。

```typescript
interface ReadonlyUser {
  readonly id: number; // 変更不可
  readonly createdAt: Date; // 変更不可
  name: string; // 変更可能
  email: string; // 変更可能
}

let user: ReadonlyUser = {
  id: 1,
  createdAt: new Date(),
  name: "Alice",
  email: "alice@example.com",
};

// user.id = 2; // エラー！readonlyプロパティは変更不可
user.name = "Alice Smith"; // OK: 変更可能
```

**🚀 実際のプロジェクトでの活用例**

```typescript
// 注文情報の型定義
interface Order {
  readonly id: string;
  readonly orderNumber: string;
  readonly customerId: string;
  readonly createdAt: Date;
  readonly totalAmount: number; // 注文後は変更不可

  // 変更可能なプロパティ
  status: "pending" | "confirmed" | "shipped" | "delivered";
  notes?: string;
}

// 注文ステータス更新（安全な更新）
function updateOrderStatus(order: Order, newStatus: Order["status"]): Order {
  return {
    ...order,
    status: newStatus,
    // id, orderNumber等は自動的に保持される（readonly）
  };
}
```

---

## 🎯 練習問題

> 💻 **実践サポート**: [実践コード例 - 練習問題の解法例](./Step03_補足_実践コード例.md#練習問題の解法例) | [トラブルシューティング - よくあるエラー](./Step03_補足_トラブルシューティング.md#よくあるエラー)

### 練習問題 1: 基本的なインターフェース設計 🔰

**要件**:
学生情報を管理するシステムの型定義を作成してください。

```typescript
// TODO: 以下の要件を満たすStudentインターフェースを定義してください
// - id: 数値（変更不可）
// - studentNumber: 文字列（変更不可）
// - name: 文字列
// - email: 文字列
// - grade: 数値（1-4年生）
// - club: 文字列（任意）

// ここにStudentインターフェースを定義

// 使用例
const student1: Student = {
  id: 1,
  studentNumber: "S2024001",
  name: "田中太郎",
  email: "tanaka@university.ac.jp",
  grade: 2,
};

const student2: Student = {
  id: 2,
  studentNumber: "S2024002",
  name: "佐藤花子",
  email: "sato@university.ac.jp",
  grade: 3,
  club: "プログラミング研究会",
};
```

### 練習問題 2: 関数との組み合わせ 🔰

**要件**:
学生情報を操作する関数を作成してください。

```typescript
// TODO: 以下の関数を実装してください

// 1. 学生一覧を表示する関数
// 期待される出力例:
// 田中太郎 (2年生)
// 佐藤花子 (3年生) (プログラミング研究会)
function displayStudents(students: Student[]): void {
  // 実装してください
  // ヒント: 各学生の名前と学年を表示し、部活動があれば併せて表示する
}

// 2. 学生IDで検索する関数
function findStudentById(students: Student[], id: number): Student | undefined {
  // 実装してください
}

// 3. 学年でフィルタリングする関数
function filterStudentsByGrade(students: Student[], grade: number): Student[] {
  // 実装してください
}
```

---

## 📝 解答例

### 練習問題 1 解答

```typescript
interface Student {
  readonly id: number;
  readonly studentNumber: string;
  name: string;
  email: string;
  grade: number;
  club?: string;
}
```

### 練習問題 2 解答

```typescript
function displayStudents(students: Student[]): void {
  students.forEach((student) => {
    const clubInfo = student.club ? ` (${student.club})` : "";
    console.log(`${student.name} (${student.grade}年生)${clubInfo}`);
  });
}

function findStudentById(students: Student[], id: number): Student | undefined {
  return students.find((student) => student.id === id);
}

function filterStudentsByGrade(students: Student[], grade: number): Student[] {
  return students.filter((student) => student.grade === grade);
}
```

---

### 振り返り

**確認ポイント**:

- [ ] インターフェースの基本概念を理解できた
- [ ] オプショナルプロパティの使い方を習得した
- [ ] 読み取り専用プロパティの重要性を理解した
- [ ] 基本的なインターフェース設計ができるようになった

### 質疑応答

**よくある質問**:

- Q: 「型エイリアスとインターフェースの違いは？」
- A: 「次回 Session2 で詳しく学習します。基本的にはオブジェクト型にはインターフェースを使用することが推奨されます」

---

**❗ 重要**: Session1 で学習した内容は、Session2 でクラス設計と実装に発展させます。基本概念をしっかりと理解して次回に臨みましょう！

**🌟 次回（Session2）は、クラス設計と実装（コンストラクタ、プロパティ、メソッド、アクセス修飾子）に挑戦します！**
