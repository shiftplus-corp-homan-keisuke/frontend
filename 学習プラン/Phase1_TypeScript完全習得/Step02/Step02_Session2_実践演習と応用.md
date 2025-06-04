# Session2: 実践演習と応用（90分）

> 💡 **対象**: 他言語経験者（Session1完了者）
> 🎯 **形式**: 講師サポート付き学習
> ⏰ **時間**: 90分（休憩含む）

## 📚 関連補足資料

このセッションの学習をサポートする補足資料をご用意しています：

- 💻 **[実践コード例](./Step02_補足_実践コード例.md)** - より実践的な例とシステム実装
- 📖 **[専門用語集](./Step02_補足_専門用語集.md)** - 配列・タプル・オブジェクト型などの詳細解説
- 🚨 **[トラブルシューティング](./Step02_補足_トラブルシューティング.md)** - 複合型エラーの対処法
- 🌐 **[参考リソース](./Step02_補足_参考リソース.md)** - さらなる学習のためのリソース
- 📋 **[補足資料](./Step02_補足資料.md)** - 実践的な開発のヒント

> 💡 **活用方法**: 実装中に疑問が生じた際や、エラーが発生した場合にご参照ください。

## 📅 セッション概要

**学習目標**:
- [ ] 配列・タプル・オブジェクト型の実践的活用
- [ ] 関数型注釈の詳細理解
- [ ] 文脈的型推論の活用
- [ ] 複合型を使った実践的なコード作成

**前提知識**:
- Session1の完了（プリミティブ型・基本型推論の理解）
- 配列・オブジェクトの基本的なJavaScript操作

---

## ⏰ 詳細タイムテーブル

| 時間 | 内容 | 講師の役割 | 学習者の活動 | 成果物 |
|------|------|------------|--------------|--------|
| **0-10分** | 前回復習・今回目標設定 | 復習確認・目標提示 | 振り返り・質問 | 理解確認 |
| **10-50分** | 複合型の実践演習 | 実演・個別指導 | ハンズオン・実践 | 複合型コード |
| **50-80分** | 関数型の実践演習 | コードレビュー・助言 | 個人開発・実装 | 関数型コード |
| **80-90分** | 成果共有・質疑応答 | ファシリテート | 発表・討論 | 学習成果 |

---

## 📚 学習内容

### Section 1: 配列型とタプル型の実践活用

> 📚 **関連資料**: [専門用語集 - 配列・タプル関連用語](./Step02_補足_専門用語集.md#配列・タプル関連用語) | [実践コード例 - 配列・タプル操作の実践](./Step02_補足_実践コード例.md#配列・タプル操作の実践)

#### 🔧 配列型の詳細活用

**💡 なぜ配列型が重要なのか**

配列型は、同じ型の複数の値を安全に管理するための基本的な型です。TypeScriptでは配列操作時の型安全性が確保され、map、filter、reduceなどのメソッドでも適切な型推論が行われます。

##### 1. 基本的な配列型の実践

```typescript
// 基本的な配列型の定義
let userIds: number[] = [1, 2, 3, 4, 5];
let userNames: string[] = ["Alice", "Bob", "Charlie"];

// 代替記法（ジェネリクス形式）
let scores: Array<number> = [85, 92, 78, 96];
let tags: Array<string> = ["typescript", "javascript", "react"];

// 実用的な例：ユーザー管理
interface User {
  id: number;
  name: string;
  email: string;
  isActive: boolean;
}

let users: User[] = [
  { id: 1, name: "Alice", email: "alice@example.com", isActive: true },
  { id: 2, name: "Bob", email: "bob@example.com", isActive: false },
  { id: 3, name: "Charlie", email: "charlie@example.com", isActive: true },
];

// 配列の型安全な操作
function getActiveUsers(users: User[]): User[] {
  return users.filter((user) => user.isActive);
}

function getUserNames(users: User[]): string[] {
  return users.map((user) => user.name);
}

function getTotalUsers(users: User[]): number {
  return users.length;
}
```

##### 2. 読み取り専用配列の活用

```typescript
// 読み取り専用配列
let readonlyNumbers: readonly number[] = [1, 2, 3, 4, 5];
// readonlyNumbers.push(6); // Error: Property 'push' does not exist

// 代替記法
let readonlyNames: ReadonlyArray<string> = ["Alice", "Bob", "Charlie"];

// 実用例：設定値の管理
const SUPPORTED_LANGUAGES: readonly string[] = ["ja", "en", "fr", "de"];

function isValidLanguage(lang: string): boolean {
  return SUPPORTED_LANGUAGES.includes(lang);
}

// イミュータブルな操作
function addLanguage(languages: readonly string[], newLang: string): readonly string[] {
  return [...languages, newLang];
}
```

#### 🎯 タプル型の実践活用

**💡 なぜタプル型が重要なのか**

タプル型は、固定長で各要素の型が決まっている配列を表現します。座標、RGB値、関数の複数戻り値など、構造が決まっているデータの型安全な表現に重要です。

##### 1. 基本的なタプル型

```typescript
// 基本的なタプル型
let coordinate: [number, number] = [10, 20]; // [x, y]
let rgbColor: [number, number, number] = [255, 128, 0]; // [R, G, B]
let userInfo: [string, number, boolean] = ["Alice", 30, true]; // [name, age, isActive]

// 実用例：API レスポンス
type ApiResult<T> = [T, null] | [null, string]; // [data, null] or [null, error]

function fetchUserData(id: number): ApiResult<User> {
  try {
    // 実際のAPI呼び出し処理
    const user: User = { id, name: "Alice", email: "alice@example.com", isActive: true };
    return [user, null];
  } catch (error) {
    return [null, "Failed to fetch user"];
  }
}

// 使用例
const [userData, error] = fetchUserData(1);
if (error) {
  console.error("Error:", error);
} else {
  console.log("User:", userData.name);
}
```

##### 2. 名前付きタプルとオプショナル要素

```typescript
// 名前付きタプル（TypeScript 4.0+）
type Point3D = [x: number, y: number, z: number];
type UserRecord = [id: number, name: string, email?: string];

// オプショナル要素
let point: Point3D = [10, 20, 30];
let user1: UserRecord = [1, "Alice", "alice@example.com"];
let user2: UserRecord = [2, "Bob"]; // emailは省略可能

// 残余要素
type NumbersWithLabel = [string, ...number[]];
let scores: NumbersWithLabel = ["Math", 85, 92, 78, 96];
let temperatures: NumbersWithLabel = ["Tokyo", 25.5, 28.2, 22.1];
```

### Section 2: オブジェクト型の詳細設計

> 📚 **関連資料**: [専門用語集 - オブジェクト・インターフェース関連用語](./Step02_補足_専門用語集.md#オブジェクト・インターフェース関連用語) | [実践コード例 - オブジェクト型の実践活用](./Step02_補足_実践コード例.md#オブジェクト型の実践活用)

#### 🔧 オブジェクト型の実践パターン

##### 1. 基本的なオブジェクト型

```typescript
// インターフェースによる型定義
interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  inStock: boolean;
}

// オブジェクトリテラル型
type ProductLiteral = {
  id: number;
  name: string;
  price: number;
  category: string;
  inStock: boolean;
};

// 実用例：商品管理
function createProduct(productData: Product): Product {
  return {
    ...productData,
    id: Math.floor(Math.random() * 1000),
  };
}

function updateProductPrice(product: Product, newPrice: number): Product {
  return {
    ...product,
    price: newPrice,
  };
}
```

##### 2. オプショナルプロパティと読み取り専用プロパティ

```typescript
// オプショナルプロパティ
interface UserProfile {
  id: number;
  name: string;
  email: string;
  avatar?: string; // オプショナル
  bio?: string; // オプショナル
  socialLinks?: {
    twitter?: string;
    github?: string;
    linkedin?: string;
  };
}

// 読み取り専用プロパティ
interface ReadonlyUser {
  readonly id: number;
  readonly createdAt: Date;
  name: string;
  email: string;
}

// 実用例：設定管理
interface AppConfig {
  readonly version: string;
  readonly buildDate: Date;
  apiUrl: string;
  timeout?: number;
  retryCount?: number;
  features: {
    darkMode: boolean;
    notifications: boolean;
    analytics?: boolean;
  };
}

// 設定のオーバーライド用の型定義（Step02範囲内）
interface ConfigOverrides {
  apiUrl?: string;
  timeout?: number;
  retryCount?: number;
  features?: {
    darkMode?: boolean;
    notifications?: boolean;
    analytics?: boolean;
  };
}

function createConfig(overrides?: ConfigOverrides): AppConfig {
  const defaultConfig: AppConfig = {
    version: "1.0.0",
    buildDate: new Date(),
    apiUrl: "https://api.example.com",
    timeout: 5000,
    features: {
      darkMode: false,
      notifications: true,
    },
  };

  return {
    ...defaultConfig,
    ...overrides,
    // featuresは個別にマージ
    features: { ...defaultConfig.features, ...overrides?.features }
  };
}
```

### Section 3: 関数型の詳細活用

> 📚 **関連資料**: [専門用語集 - 関数型関連用語](./Step02_補足_専門用語集.md#関数型関連用語) | [実践コード例 - 関数型の実践活用](./Step02_補足_実践コード例.md#関数型の実践活用)

#### 🎯 関数型注釈の実践

##### 1. 基本的な関数型注釈

```typescript
// 関数宣言での型注釈
function add(a: number, b: number): number {
  return a + b;
}

// 関数式での型注釈
const multiply = (a: number, b: number): number => {
  return a * b;
};

// 関数型の型エイリアス
type MathOperation = (a: number, b: number) => number;

const divide: MathOperation = (a, b) => {
  if (b === 0) throw new Error("Division by zero");
  return a / b;
};

// 実用例：計算機
interface Calculator {
  add: MathOperation;
  subtract: MathOperation;
  multiply: MathOperation;
  divide: MathOperation;
}

const calculator: Calculator = {
  add: (a, b) => a + b,
  subtract: (a, b) => a - b,
  multiply: (a, b) => a * b,
  divide: (a, b) => {
    if (b === 0) throw new Error("Division by zero");
    return a / b;
  },
};
```

##### 2. オプショナルパラメータとデフォルトパラメータ

```typescript
// オプショナルパラメータ
function greet(name: string, title?: string): string {
  return title ? `Hello, ${title} ${name}` : `Hello, ${name}`;
}

// デフォルトパラメータ
function createUser(name: string, age: number = 18, isActive: boolean = true): User {
  return {
    id: Math.floor(Math.random() * 1000),
    name,
    email: `${name.toLowerCase()}@example.com`,
    isActive,
  };
}

// 実用例：API クライアント
interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  headers?: Record<string, string>;
  timeout?: number;
}

async function apiRequest(
  url: string,
  options: RequestOptions = {}
): Promise<any> {
  const {
    method = "GET",
    headers = { "Content-Type": "application/json" },
    timeout = 5000,
  } = options;

  // API リクエスト処理
  return fetch(url, { method, headers });
}
```

##### 3. 関数オーバーロードと高階関数

```typescript
// 関数オーバーロード
function processData(data: string): string;
function processData(data: number): number;
function processData(data: boolean): boolean;
function processData(data: string | number | boolean): string | number | boolean {
  if (typeof data === "string") {
    return data.toUpperCase();
  } else if (typeof data === "number") {
    return data * 2;
  } else {
    return !data;
  }
}

// 高階関数
type Predicate<T> = (item: T) => boolean;
type Transformer<T, U> = (item: T) => U;

function filterAndMap<T, U>(
  items: T[],
  predicate: Predicate<T>,
  transformer: Transformer<T, U>
): U[] {
  return items.filter(predicate).map(transformer);
}

// 使用例
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const evenDoubled = filterAndMap(
  numbers,
  (n) => n % 2 === 0, // 偶数のみ
  (n) => n * 2 // 2倍にする
);
```

---

## 🎯 実践演習

> 🛠️ **演習サポート**: [トラブルシューティング - 実践演習でのよくある問題](./Step02_補足_トラブルシューティング.md#実践演習でのよくある問題) | [実践コード例 - 演習解答例とヒント](./Step02_補足_実践コード例.md#演習解答例とヒント)

### 演習 1: ショッピングカート管理システム（30分）

以下の要件に従って、型安全なショッピングカートシステムを作成してください：

```typescript
// TODO: 以下の型定義と関数を完成させてください

// 1. 商品の型定義
interface Product {
  // 商品ID（数値）
  // 商品名（文字列）
  // 価格（数値）
  // カテゴリ（文字列）
  // 在庫状況（真偽値）
}

// 2. カートアイテムの型定義
interface CartItem {
  // 商品情報（Product型）
  // 数量（数値）
  // 追加日時（Date型）
}

// 3. カートの操作関数
class ShoppingCart {
  private items: CartItem[] = [];

  // 商品をカートに追加
  addItem(product: Product, quantity: number): void {
    // TODO: 実装
  }

  // 商品をカートから削除
  removeItem(productId: number): void {
    // TODO: 実装
  }

  // カート内の商品一覧を取得
  getItems(): readonly CartItem[] {
    // TODO: 実装
  }

  // 合計金額を計算
  getTotalPrice(): number {
    // TODO: 実装
  }

  // カート内の商品数を取得
  getItemCount(): number {
    // TODO: 実装
  }
}

// 4. 使用例のテストコード
const cart = new ShoppingCart();
const laptop: Product = {
  id: 1,
  name: "Gaming Laptop",
  price: 150000,
  category: "Electronics",
  inStock: true,
};

cart.addItem(laptop, 1);
console.log(`Total: ${cart.getTotalPrice()}円`);
console.log(`Items: ${cart.getItemCount()}個`);
```

### 演習 2: データ変換パイプライン（20分）

以下の要件に従って、型安全なデータ変換システムを作成してください：

```typescript
// TODO: 以下の型定義と関数を完成させてください

// 1. 生データの型定義
interface RawUserData {
  id: string; // 文字列のID
  full_name: string; // フルネーム
  email_address: string; // メールアドレス
  is_active: string; // "true" または "false"
  created_at: string; // ISO日付文字列
}

// 2. 変換後のデータ型定義
interface ProcessedUser {
  id: number; // 数値のID
  name: string; // 名前
  email: string; // メールアドレス
  isActive: boolean; // 真偽値
  createdAt: Date; // Date型
}

// 3. 変換関数
function transformUserData(rawData: RawUserData[]): ProcessedUser[] {
  // TODO: 実装
  // - IDを数値に変換
  // - full_nameをnameにリネーム
  // - email_addressをemailにリネーム
  // - is_activeを真偽値に変換
  // - created_atをDate型に変換
}

// 4. フィルタリング関数
function filterActiveUsers(users: ProcessedUser[]): ProcessedUser[] {
  // TODO: アクティブなユーザーのみを返す
}

// 5. ソート関数
function sortUsersByName(users: ProcessedUser[]): ProcessedUser[] {
  // TODO: 名前でソートして返す
}
```

---

## 📝 学習ポイント

### ✅ 今回のセッションで習得すべきこと

1. **配列型の実践活用**: 型安全な配列操作、読み取り専用配列の使用
2. **タプル型の理解**: 固定長配列、名前付きタプル、オプショナル要素
3. **オブジェクト型の設計**: インターフェース、オプショナルプロパティ、読み取り専用プロパティ
4. **関数型の詳細**: 関数型注釈、オプショナルパラメータ、関数オーバーロード

---

**📌 重要**: Session2 では実践的なコーディングを通じて型システムの活用を体感します。完璧を目指さず、まずは動くコードを作ることを重視しましょう。

**🌟 次回（Session3）は、プロジェクトの完成と学習の総括を行います！**
