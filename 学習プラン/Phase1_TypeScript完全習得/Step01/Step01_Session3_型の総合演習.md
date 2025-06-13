# Session3: 型の学習総仕上げ（60 分）

> 💡 **対象**: Session1-2 完了者（TypeScript 基本型注釈習得済み）
> 🎯 **形式**: 講師サポート付き型学習の総仕上げ
> ⏰ **時間**: 60 分

## 📚 関連補足資料

型学習の総仕上げをサポートする補足資料をご用意しています：

- 💻 **[実践コード例](./Step01_補足_実践コード例.md)** - 型定義の実践例とベストプラクティス
- 🚨 **[トラブルシューティング](./Step01_補足_トラブルシューティング.md)** - 型エラーの解決方法
- 📖 **[専門用語集](./Step01_補足_専門用語集.md)** - 型関連の概念と用語の詳細解説
- 🌐 **[参考リソース](./Step01_補足_参考リソース.md)** - 継続学習のためのリソース集
- 🔧 **[開発環境ガイド](./Step01_補足_開発環境ガイド.md)** - TypeScript開発環境の活用

> 💡 **活用方法**: 学習中に疑問が生じた際や、より深く理解したい場合に参照してね 🐰

## 📅 セッション概要

**学習目標**:

- [ ] Step01で学習した基本型注釈の統合・応用
- [ ] 型エイリアスとオプショナルプロパティの実践活用
- [ ] 型安全性の理解と体験
- [ ] 型エラーの読解と修正能力の習得

**前提知識**:

- Session1-2 の内容（基本型注釈・型エイリアス・オプショナルプロパティ）
- TypeScriptの基本的な型システムの理解

---

## ⏰ 詳細タイムテーブル

| 時間         | 内容                   | 講師の役割           | 学習者の活動     | 成果物         |
| ------------ | ---------------------- | -------------------- | ---------------- | -------------- |
| **0-20 分**  | 型エイリアスの応用実践 | 実演・個別サポート   | ハンズオン・実践 | 応用型定義     |
| **20-35 分** | 型安全性の体験         | コードレビュー・助言 | 実装・検証       | 型安全コード   |
| **35-45 分** | 型エラー修正演習       | デバッグ支援・ヒント | エラー修正作業   | 修正済みコード |
| **45-60 分** | 総合評価               | 評価・フィードバック | 発表・振り返り   | 学習まとめ     |

---

## 🎯 学習内容

### Section 1: 型エイリアスの応用実践（20分）

> 📚 **関連資料**: [実践コード例 - 型エイリアスの活用](./Step01_補足_実践コード例.md#ステップ3-型エイリアスの活用) | [専門用語集 - 型エイリアス](./Step01_補足_専門用語集.md#型エイリアスtype-alias)

#### 🔍 Step01で学習した基本型の組み合わせ

Session1-2で学習した基本的な型注釈を組み合わせて、より実用的な型定義を作成します。

```typescript
// 基本的な型エイリアス（Session2で学習済み）
type UserID = number;
type UserName = string;
type Email = string;
type Age = number;

// ユーザーの基本情報型
type User = {
  id: UserID;
  name: UserName;
  email: Email;
  age: Age;
};

// 商品情報の型
type ProductID = number;
type ProductName = string;
type Price = number;

type Product = {
  id: ProductID;
  name: ProductName;
  price: Price;
  description: string;
};
```

#### 🔍 オプショナルプロパティの実践活用

Session2で学習したオプショナルプロパティ（`?`）を使って、より柔軟な型定義を作成します。

```typescript
// ユーザープロフィール型（オプショナルプロパティを活用）
type UserProfile = {
  id: UserID;
  name: UserName;
  email: Email;
  age: Age;
  phone?: string;          // オプショナル（Session2で学習済み）
  address?: string;        // オプショナル
  bio?: string;            // 自己紹介文（オプショナル）
};

// 注文情報の型
type OrderStatus = "pending" | "confirmed" | "shipped" | "delivered";

type Order = {
  id: number;
  userId: UserID;
  products: Product[];
  status: OrderStatus;
  orderDate: Date;
  deliveryDate?: Date;     // 配送日はオプショナル
  notes?: string;          // 備考はオプショナル
};

// 設定情報の型（多くがオプショナル）
type AppSettings = {
  theme: "light" | "dark";
  language: "ja" | "en";
  notifications?: boolean;  // 通知設定（オプショナル）
  autoSave?: boolean;       // 自動保存（オプショナル）
  fontSize?: number;        // フォントサイズ（オプショナル）
};
```

#### 🎯 練習問題 1: 型定義の応用（15分）

以下の要件を満たす型定義を作成してください：

```typescript
// 1. 書籍情報の型を定義してください
// - ID（数値）、タイトル（文字列）、著者（文字列）、価格（数値）
// - ISBN（オプショナル）、出版年（オプショナル）
type Book = {
  // ここに実装してください
};

// 2. 図書館の会員情報の型を定義してください
// - 会員ID（数値）、名前（文字列）、メールアドレス（文字列）
// - 電話番号（オプショナル）、住所（オプショナル）
type LibraryMember = {
  // ここに実装してください
};

// 3. 貸出記録の型を定義してください
// - 貸出ID（数値）、会員（LibraryMember型）、書籍（Book型）
// - 貸出日（Date）、返却予定日（Date）、返却日（オプショナル）
type LoanRecord = {
  // ここに実装してください
};
```

---

### Section 2: 型安全性の体験（15分）

> 📚 **関連資料**: [実践コード例 - 型安全な関数](./Step01_補足_実践コード例.md#ステップ4-学生管理システム) | [専門用語集 - 型安全性](./Step01_補足_専門用語集.md#型安全性type-safety)

#### 🔍 型による制約の理解

TypeScriptの型システムがどのように安全性を提供するかを体験します。

```typescript
// 型安全なユーザー検索関数
function findUserByEmail(
  users: User[], 
  email: Email
): User | null {  // Session2で学習済みのユニオン型
  const user = users.find(u => u.email === email);
  return user || null;
}

// 型安全な価格計算関数
function calculateTotalPrice(products: Product[]): Price {
  return products.reduce((total, product) => total + product.price, 0);
}

// オプショナルプロパティの安全な使用
function getUserDisplayName(user: UserProfile): string {
  // オプショナルプロパティの存在チェック
  if (user.bio) {
    return `${user.name} - ${user.bio}`;
  }
  return user.name;
}

// 型による制約の例
function updateOrderStatus(
  order: Order, 
  newStatus: OrderStatus  // 特定の値のみ許可
): Order {
  return {
    ...order,
    status: newStatus
  };
}
```

#### 🔍 型安全な関数の実装

Step01で学習した型注釈を活用して、安全な関数を作成します。

```typescript
// ユーザーの年齢チェック関数
function isAdult(user: User): boolean {
  return user.age >= 18;
}

// 商品の割引価格計算関数
function calculateDiscountPrice(
  product: Product, 
  discountRate: number
): Price {
  return product.price * (1 - discountRate);
}

// 設定のデフォルト値適用関数
function applyDefaultSettings(
  userSettings: AppSettings
): Required<AppSettings> {  // 全プロパティを必須にする
  return {
    theme: userSettings.theme,
    language: userSettings.language,
    notifications: userSettings.notifications ?? true,
    autoSave: userSettings.autoSave ?? false,
    fontSize: userSettings.fontSize ?? 14
  };
}
```

#### 🎯 練習問題 2: 型安全な関数の実装（10分）

以下の関数に適切な型注釈を追加し、型安全な実装を行ってください：

```typescript
// 1. 書籍の検索関数
// 引数：書籍リスト、検索キーワード（タイトルまたは著者で検索）
// 戻り値：該当する書籍のリスト
function searchBooks(books, keyword) {
  // ここに実装してください
}

// 2. 会員の連絡先更新関数
// 引数：会員情報、新しい電話番号（オプショナル）、新しい住所（オプショナル）
// 戻り値：更新された会員情報
function updateMemberContact(member, phone, address) {
  // ここに実装してください
}

// 3. 貸出期限チェック関数
// 引数：貸出記録
// 戻り値：期限切れかどうか（boolean）
function isOverdue(loanRecord) {
  // ここに実装してください
}
```

---

### Section 3: 型エラー修正演習（10分）

> 📚 **関連資料**: [トラブルシューティング - TypeScriptエラー対処](./Step01_補足_トラブルシューティング.md#typescriptコンパイルエラー)

#### 🔍 Step01範囲内での典型的な型エラー

以下のコードには意図的に型エラーが含まれています。エラーを見つけて修正してください：

```typescript
// 問題1: 基本型の型エラー
let userAge: number = "25";  // エラー：文字列を数値型に代入

// 問題2: オブジェクト型の型エラー
type SimpleUser = {
  name: string;
  age: number;
  email: string;
};

let user: SimpleUser = {
  name: "田中太郎",
  age: "25",  // エラー：文字列を数値型に代入
  email: "tanaka@example.com"
};

// 問題3: 配列型の型エラー
let productPrices: number[] = [100, 200, "300"];  // エラー：文字列が数値配列に含まれている

// 問題4: オプショナルプロパティの型エラー
type UserInfo = {
  name: string;
  age: number;
  phone?: string;
};

let userInfo: UserInfo = {
  name: "山田花子",
  // age が不足している  // エラー：必須プロパティが不足
  phone: "090-1234-5678"
};

// 問題5: 関数の戻り値型エラー
function getUserName(user: SimpleUser): number {  // エラー：戻り値型が不適切
  return user.name;
}
```

#### 🎯 修正演習（5分）

上記の型エラーを修正し、正しいTypeScriptコードに変更してください。修正のポイント：

1. **型の一致**: 変数の型と代入する値の型を一致させる
2. **必須プロパティ**: オブジェクト型の必須プロパティは必ず含める
3. **戻り値型**: 関数の実際の戻り値と型注釈を一致させる
4. **配列の要素型**: 配列内の全要素が指定された型と一致するようにする

---

## 📊 Step01 総合評価

### 最終評価基準

#### 型注釈の理解度（40%）

- [x] **基本型**: string, number, boolean, 配列の型注釈
- [x] **オブジェクト型**: 型エイリアス・オプショナルプロパティ
- [x] **関数型**: 引数・戻り値の型定義
- [x] **型の組み合わせ**: 複数の型を組み合わせた定義

#### 型安全性の理解（30%）

- [x] **型による制約**: TypeScriptの型システムの恩恵を理解
- [x] **エラー対処**: 基本的な型エラーの読解と修正
- [x] **安全な実装**: 型を活用した安全なコードの作成

#### 実装品質（20%）

- [x] **コードの可読性**: 適切な型定義による意図の明確化
- [x] **型の活用**: 学習した型機能の実践的な使用
- [x] **動作確認**: 実装した型定義の正常動作

#### 学習姿勢（10%）

- [x] **積極性**: 質問・議論への参加
- [x] **問題解決**: 型エラーの自力解決への取り組み
- [x] **振り返り**: 学習内容の整理・理解度の確認

---

## 成果物

- [ ] **型定義の応用実践**: Step01の学習内容を統合した型定義 → [Step01 成果物](./Step01_成果物.md)で詳細確認

---

**🎉 お疲れ様でした！** Step01 を通じて TypeScript の基本的な型注釈をしっかりと身につけることができました。

**🚀 次の Step02 では、より高度な型システムと実践的な開発手法を学習します！**
