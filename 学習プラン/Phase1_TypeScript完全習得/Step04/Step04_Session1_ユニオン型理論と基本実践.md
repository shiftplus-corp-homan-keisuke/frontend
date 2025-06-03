# Session1: ユニオン型理論と基本実践（90 分）

> 💡 **対象**: 他言語経験者（TypeScript 基本型・インターフェース知識あり）  
> 🎯 **形式**: 講師サポート付き学習  
> ⏰ **時間**: 90 分（休憩含む）

## 📅 セッション概要

**学習目標**:

- [ ] ユニオン型の基本概念と実践的活用の理解
- [ ] インターセクション型の基本的な使い方の習得
- [ ] 基本的な型ガード（typeof, instanceof）の実装
- [ ] Step01-03 の知識を活用した型安全なコード作成

**前提知識**:

- Step01: JavaScript 基礎、TypeScript 基本型注釈
- Step02: 基本型システム、型推論、型エイリアス
- Step03: インターフェース、オプショナルプロパティ、継承

---

## ⏰ 詳細タイムテーブル

| 時間         | 内容                                 | 講師の役割         | 学習者の活動   | 成果物     |
| ------------ | ------------------------------------ | ------------------ | -------------- | ---------- |
| **0-10 分**  | 前 Step 復習・今回目標               | 復習確認・目標提示 | 振り返り・質問 | 理解確認   |
| **10-50 分** | ユニオン型・インターセクション型理論 | 実演・解説         | 理解・メモ     | 基本知識   |
| **50-80 分** | 基本的な型ガード実践                 | 個別サポート       | ハンズオン     | 基本コード |
| **80-90 分** | 振り返り・次回予告                   | まとめ・予告       | 質問・確認     | 学習計画   |

---

## 📚 学習内容

### Section 1: 前 Step 復習（要点のみ）

#### 🔍 Step01-03 の重要ポイント確認

**基本型とインターフェースの復習**

```typescript
// Step01-02で学習した基本型
type UserId = number;
type UserStatus = "active" | "inactive" | "pending";

// Step03で学習したインターフェース
interface User {
  id: UserId;
  name: string;
  email: string;
  status: UserStatus;
  age?: number; // オプショナルプロパティ
}

interface AdminUser extends User {
  permissions: string[];
  lastLogin: Date;
}
```

**💡 今日学ぶユニオン型との関係**

ユニオン型は、複数の型を組み合わせて「A または B」という型を表現する仕組みです。これまで学んだ基本型やインターフェースを組み合わせて、より柔軟で安全な型定義を作成できます。

---

### Section 2: ユニオン型の基本概念

#### 🎯 ユニオン型とは何か

**💡 なぜユニオン型が重要なのか**

ユニオン型は、JavaScript の動的な性質を保ちながら、TypeScript の型安全性を実現する重要な機能です。実際の開発では、以下のような場面で「複数の可能性がある値」を安全に扱う必要があります：

- **API レスポンス**: 成功時とエラー時で異なる形状のデータ
- **ユーザー入力**: フォームで入力される様々な型の値
- **状態管理**: アプリケーションの複数の状態を表現
- **設定値**: 環境や条件によって変わる値の管理

#### 1. 基本的なユニオン型

```typescript
// プリミティブ型のユニオン
type StringOrNumber = string | number;
type Status = "loading" | "success" | "error";

function processValue(value: StringOrNumber): string {
  // TypeScriptは共通のプロパティのみアクセス可能
  return value.toString(); // OK: toString()は両方の型に存在
  // return value.toUpperCase(); // Error: numberにはtoUpperCase()がない
}

// 実際の使用例
let userId: StringOrNumber = 123;
userId = "user_abc"; // OK: どちらの型も代入可能

let currentStatus: Status = "loading";
currentStatus = "success"; // OK
// currentStatus = "failed"; // Error: "failed"は許可されていない
```

#### 2. インターフェースを使ったユニオン型

```typescript
// Step03で学んだインターフェースを活用
interface RegularUser {
  type: "regular";
  id: number;
  name: string;
  email: string;
}

interface GuestUser {
  type: "guest";
  sessionId: string;
  name: string;
}

// ユニオン型でどちらのユーザータイプも受け入れ
type User = RegularUser | GuestUser;

function greetUser(user: User): string {
  // 共通のプロパティにはアクセス可能
  return `Hello, ${user.name}!`;

  // 特定の型のプロパティにはアクセス不可
  // return user.email; // Error: GuestUserにはemailがない
}
```

#### 3. 配列とユニオン型

```typescript
// 配列の要素がユニオン型
type MixedArray = (string | number)[];
let scores: MixedArray = [85, "A", 92, "B+", 78];

// 配列自体がユニオン型
type NumberOrStringArray = number[] | string[];
let data: NumberOrStringArray = [1, 2, 3]; // OK
data = ["a", "b", "c"]; // OK
// data = [1, "a"]; // Error: 混在は不可
```

#### 4. null・undefined とのユニオン型

```typescript
// Step02で学んだ型エイリアスと組み合わせ
type NullableString = string | null;
type OptionalNumber = number | undefined;

interface UserProfile {
  id: number;
  name: string;
  avatar: string | null; // データベースでNULL許可
  bio?: string; // オプショナル（string | undefined）
}

function displayAvatar(avatar: string | null): string {
  if (avatar === null) {
    return "デフォルトアバター";
  }
  return avatar; // この時点でavatarはstring型
}
```

---

### Section 3: インターセクション型の基本

#### 🎯 インターセクション型とは

**💡 ユニオン型との違い**

- **ユニオン型（|）**: 「A または B」を表現
- **インターセクション型（&）**: 「A かつ B」を表現

#### 1. 基本的なインターセクション型

```typescript
// Step03で学んだインターフェースを組み合わせ
interface User {
  id: number;
  name: string;
  email: string;
}

interface Timestamps {
  createdAt: Date;
  updatedAt: Date;
}

// インターセクション型で両方の型を結合
type UserWithTimestamps = User & Timestamps;

// 結果: { id: number; name: string; email: string; createdAt: Date; updatedAt: Date; }
const user: UserWithTimestamps = {
  id: 1,
  name: "Alice",
  email: "alice@example.com",
  createdAt: new Date(),
  updatedAt: new Date(),
};
```

#### 2. 型エイリアスとの組み合わせ

```typescript
// Step02で学んだ型エイリアスと組み合わせ
type ContactInfo = {
  phone: string;
  address: string;
};

type UserWithContact = User & ContactInfo;

const fullUser: UserWithContact = {
  id: 1,
  name: "Bob",
  email: "bob@example.com",
  phone: "090-1234-5678",
  address: "東京都渋谷区",
};
```

---

### Section 4: 基本的な型ガード

#### 🔧 typeof 型ガードの実践

**💡 なぜ型ガードが必要なのか**

ユニオン型の値を使用する際、TypeScript は「すべての型に共通するプロパティ」のみアクセスを許可します。特定の型のプロパティにアクセスするには、型ガードを使って型を絞り込む必要があります。

#### 1. typeof 型ガード

```typescript
function processInput(input: string | number): string {
  if (typeof input === "string") {
    // この分岐内ではinputはstring型
    return input.toUpperCase();
  } else {
    // この分岐内ではinputはnumber型
    return input.toFixed(2);
  }
}

// 実用的な例：フォーム入力の処理
function validateAge(age: string | number): boolean {
  if (typeof age === "string") {
    const parsed = parseInt(age, 10);
    return !isNaN(parsed) && parsed >= 0 && parsed <= 120;
  } else {
    return age >= 0 && age <= 120;
  }
}
```

#### 2. instanceof 型ガード

```typescript
// Step01で学んだクラスの概念を活用
class Dog {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
  bark(): void {
    console.log("Woof!");
  }
}

class Cat {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
  meow(): void {
    console.log("Meow!");
  }
}

function makeSound(animal: Dog | Cat): void {
  if (animal instanceof Dog) {
    animal.bark(); // Dogのメソッドにアクセス可能
  } else {
    animal.meow(); // Catのメソッドにアクセス可能
  }
}
```

---

## 🔧 練習問題

### 練習問題 1: 基本的なユニオン型

以下の要件を満たす型定義を作成してください：

```typescript
// 要件1: 商品の価格は数値または"無料"という文字列
type ProductPrice = /* ここを実装 */;

// 要件2: ユーザーの年齢は数値またはnull（未設定）
type UserAge = /* ここを実装 */;

// 要件3: 以下の関数を実装
function formatPrice(price: ProductPrice): string {
  // priceが数値の場合は"¥{価格}"、"無料"の場合は"無料"を返す
  /* ここを実装 */
}
```

### 練習問題 2: インターフェースとユニオン型

```typescript
// 要件: 以下のインターフェースを使って、ユニオン型を作成
interface EmailContact {
  type: "email";
  email: string;
  name: string;
}

interface PhoneContact {
  type: "phone";
  phone: string;
  name: string;
}

// 要件1: どちらの連絡先も受け入れる型
type Contact = /* ここを実装 */;

// 要件2: 連絡先の情報を表示する関数
function displayContact(contact: Contact): string {
  // 共通のnameプロパティを使って基本情報を表示
  /* ここを実装 */
}
```

### 練習問題 3: 基本的な型ガード

```typescript
// 要件: typeof型ガードを使って以下の関数を実装
function processData(data: string | number | boolean): string {
  // string: そのまま返す
  // number: 文字列に変換して返す
  // boolean: "true"または"false"を返す
  /* ここを実装 */
}
```

---

## 📝 解答例

### 練習問題 1 解答

```typescript
type ProductPrice = number | "無料";
type UserAge = number | null;

function formatPrice(price: ProductPrice): string {
  if (typeof price === "number") {
    return `¥${price}`;
  } else {
    return "無料";
  }
}
```

### 練習問題 2 解答

```typescript
type Contact = EmailContact | PhoneContact;

function displayContact(contact: Contact): string {
  return `連絡先: ${contact.name} (${contact.type})`;
}
```

### 練習問題 3 解答

```typescript
function processData(data: string | number | boolean): string {
  if (typeof data === "string") {
    return data;
  } else if (typeof data === "number") {
    return data.toString();
  } else {
    return data ? "true" : "false";
  }
}
```

---

## 🎯 Session1 の成果確認

### 理解度チェック

- [ ] ユニオン型（|）の基本概念を理解している
- [ ] インターセクション型（&）の基本概念を理解している
- [ ] typeof 型ガードを使って型を絞り込める
- [ ] instanceof 型ガードの基本的な使い方を理解している
- [ ] Step01-03 の知識と組み合わせて型定義ができる

### 次回 Session2 の予告

**Session2 では以下を学習します**:

- より実践的な型ガード（in 演算子）
- 判別可能なユニオンの基本パターン
- 実際のフォーム処理での型安全性確保
- API レスポンス処理での型ガード活用

**準備事項**:

- 今日学んだユニオン型・型ガードの復習
- 練習問題の理解確認
