# Session2: ユーザー定義型ガード（40分）

> 💡 **対象**: 他言語経験者（基本型ガード知識あり）
> 🎯 **形式**: 講師サポート付き学習
> ⏰ **時間**: 40分

## 📚 関連補足資料

このセッションの学習をサポートする補足資料をご用意しています：

- 📖 **[専門用語集](./Step04_補足_専門用語集.md)** - ユーザー定義型ガード・カスタムバリデーションの重要な概念と用語の詳細解説
- 💻 **[実践コード例](./Step04_補足_実践コード例.md)** - より実践的な例とシステム実装
- 🔧 **[開発環境ガイド](./Step04_補足_開発環境ガイド.md)** - 開発効率を上げる設定
- 🌐 **[参考リソース](./Step04_補足_参考リソース.md)** - さらなる学習のためのリソース
- 🚨 **[トラブルシューティング](./Step04_補足_トラブルシューティング.md)** - ユーザー定義型ガードエラーの対処法

> 💡 **活用方法**: 学習中に疑問が生じた際や、より深く理解したい場合に参照してね 🐰

## 📅 セッション概要

**学習目標**:

- [ ] ユーザー定義型ガード（`value is Type`構文）の実装
- [ ] 複雑なオブジェクト検証とバリデーション
- [ ] 型ガードの組み合わせパターンの習得
- [ ] 再利用可能なカスタムバリデーション関数の作成

**前提知識**:

- Session1: 基本型ガード（typeof, instanceof, in演算子）

---

## ⏰ 詳細タイムテーブル

| 時間         | 内容                           | 講師の役割           | 学習者の活動     | 成果物     |
| ------------ | ------------------------------ | -------------------- | ---------------- | ---------- |
| **0-5分**    | 前回復習・今回目標             | 復習確認・目標提示   | 振り返り・質問   | 理解確認   |
| **5-25分**   | ユーザー定義型ガード実装       | 実演・個別指導       | ハンズオン・実践 | 実践コード |
| **25-35分**  | カスタムバリデーション演習     | コードレビュー・助言 | 個人開発         | 演習成果   |
| **35-40分**  | 成果共有・次回予告             | ファシリテート       | 発表・討論       | 学習確認   |

---

## 📚 学習内容

### Section 1: 前回復習（要点のみ）

#### 🔍 Session1の重要ポイント確認

```typescript
// 基本的な型ガード
function isString(value: unknown): value is string {
  return typeof value === "string";
}

function isNumber(value: unknown): value is number {
  return typeof value === "number";
}

// DOM要素の型ガード
function isInputElement(element: Element): element is HTMLInputElement {
  return element instanceof HTMLInputElement;
}

// オブジェクトプロパティの型ガード
interface User {
  id: number;
  name: string;
}

function hasUserProperties(obj: unknown): obj is { id: unknown; name: unknown } {
  return typeof obj === "object" && obj !== null && "id" in obj && "name" in obj;
}
```

**💡 今日学ぶ内容との関係**

今日は、これらの基本型ガードを組み合わせて、より複雑で実用的なユーザー定義型ガード関数を作成します。

---

### Section 2: ユーザー定義型ガードの実装

> 📚 **関連資料**: [実践コード例 - ユーザー定義型ガード](./Step04_補足_実践コード例.md#ユーザー定義型ガード) | [専門用語集 - value is Type](./Step04_補足_専門用語集.md#value-is-type)

#### 🎯 ユーザー定義型ガードとは

**💡 なぜユーザー定義型ガードが重要なのか**

ユーザー定義型ガードは、`value is Type`構文を使って独自の型チェック関数を作成する機能です。これにより、以下のメリットがあります：

- **再利用性**: 同じ型チェックロジックを複数箇所で使用
- **可読性**: 複雑な型チェックを分かりやすい関数名で表現
- **保守性**: 型チェックロジックの変更が一箇所で済む
- **型安全性**: TypeScriptが型の絞り込みを理解

#### 1. 基本的なユーザー定義型ガード

```typescript
// 基本的なプリミティブ型ガード
function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isPositiveNumber(value: unknown): value is number {
  return typeof value === "number" && value > 0;
}

function isValidEmail(value: unknown): value is string {
  if (typeof value !== "string") {
    return false;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value);
}

// 使用例
function processUserInput(input: unknown): string {
  if (isValidEmail(input)) {
    // この時点でinputはstring型として扱われる
    return `有効なメールアドレス: ${input}`;
  } else if (isPositiveNumber(input)) {
    // この時点でinputはnumber型として扱われる
    return `正の数値: ${input}`;
  } else if (isNonEmptyString(input)) {
    // この時点でinputはstring型として扱われる
    return `文字列: ${input}`;
  } else {
    return "無効な入力です";
  }
}
```

#### 2. 複雑なオブジェクト型ガード

```typescript
// ユーザープロファイルの型定義
interface UserProfile {
  id: number;
  name: string;
  email: string;
  age?: number;
  isActive: boolean;
}

// 段階的な型ガード実装
function isUserProfile(value: unknown): value is UserProfile {
  // まず基本的なオブジェクトチェック
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const obj = value as any;

  // 必須プロパティの存在チェック
  if (!("id" in obj) || !("name" in obj) || !("email" in obj) || !("isActive" in obj)) {
    return false;
  }

  // 各プロパティの型チェック
  if (typeof obj.id !== "number" || obj.id <= 0) {
    return false;
  }

  if (!isNonEmptyString(obj.name)) {
    return false;
  }

  if (!isValidEmail(obj.email)) {
    return false;
  }

  if (typeof obj.isActive !== "boolean") {
    return false;
  }

  // オプショナルプロパティのチェック
  if (obj.age !== undefined && (typeof obj.age !== "number" || obj.age < 0 || obj.age > 150)) {
    return false;
  }

  return true;
}

// より堅牢なバリデーション関数
function isValidUserProfile(value: unknown): value is UserProfile {
  if (!isUserProfile(value)) {
    return false;
  }

  // 追加のビジネスロジック検証
  return (
    value.name.length >= 2 &&
    value.name.length <= 50 &&
    value.email.length <= 100
  );
}
```

#### 3. 配列型ガード

```typescript
// 配列の型ガード
function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every(item => typeof item === "string");
}

function isUserProfileArray(value: unknown): value is UserProfile[] {
  return Array.isArray(value) && value.every(item => isUserProfile(item));
}

// より複雑な配列型ガード
function isNonEmptyStringArray(value: unknown): value is [string, ...string[]] {
  return isStringArray(value) && value.length > 0 && value.every(str => str.trim().length > 0);
}

// 使用例
function processUserList(data: unknown): string {
  if (isUserProfileArray(data)) {
    const activeUsers = data.filter(user => user.isActive);
    return `${data.length}人中${activeUsers.length}人がアクティブです`;
  }
  return "無効なユーザーリストです";
}
```

#### 4. 型ガードの組み合わせパターン

```typescript
// フォームデータの型定義
interface ContactForm {
  name: string;
  email: string;
  message: string;
  phone?: string;
}

// 小さな型ガードを組み合わせる
function isContactForm(value: unknown): value is ContactForm {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const obj = value as any;

  // 必須フィールドのチェック
  if (!isNonEmptyString(obj.name) || obj.name.length > 50) {
    return false;
  }

  if (!isValidEmail(obj.email)) {
    return false;
  }

  if (!isNonEmptyString(obj.message) || obj.message.length > 1000) {
    return false;
  }

  // オプショナルフィールドのチェック
  if (obj.phone !== undefined) {
    if (!isValidPhoneNumber(obj.phone)) {
      return false;
    }
  }

  return true;
}

// 電話番号の型ガード
function isValidPhoneNumber(value: unknown): value is string {
  if (typeof value !== "string") {
    return false;
  }
  // 簡単な電話番号形式チェック（日本の形式）
  const phoneRegex = /^(\+81|0)\d{1,4}-?\d{1,4}-?\d{4}$/;
  return phoneRegex.test(value.replace(/\s/g, ""));
}
```

---

### Section 3: カスタムバリデーション演習

> 📚 **関連資料**: [実践コード例 - カスタムバリデーション](./Step04_補足_実践コード例.md#カスタムバリデーション) | [トラブルシューティング - バリデーションエラー](./Step04_補足_トラブルシューティング.md#バリデーションエラー)

#### 🔧 実践的なバリデーションシステム

**💡 実際の開発でよく使われるパターン**

実際のWebアプリケーションでは、複数の型ガードを組み合わせて、段階的にデータを検証することが重要です。

#### 1. 段階的バリデーション

```typescript
// バリデーション結果の型定義
interface ValidationResult<T> {
  isValid: boolean;
  data?: T;
  errors: string[];
}

// 段階的バリデーション関数
function validateContactForm(input: unknown): ValidationResult<ContactForm> {
  const errors: string[] = [];

  // 基本的なオブジェクトチェック
  if (typeof input !== "object" || input === null) {
    return { isValid: false, errors: ["入力データはオブジェクトである必要があります"] };
  }

  const data = input as any;

  // 名前のバリデーション
  if (!isNonEmptyString(data.name)) {
    errors.push("名前は必須です");
  } else if (data.name.length > 50) {
    errors.push("名前は50文字以内で入力してください");
  }

  // メールアドレスのバリデーション
  if (!isValidEmail(data.email)) {
    errors.push("有効なメールアドレスを入力してください");
  }

  // メッセージのバリデーション
  if (!isNonEmptyString(data.message)) {
    errors.push("メッセージは必須です");
  } else if (data.message.length > 1000) {
    errors.push("メッセージは1000文字以内で入力してください");
  }

  // 電話番号のバリデーション（オプショナル）
  if (data.phone !== undefined && !isValidPhoneNumber(data.phone)) {
    errors.push("有効な電話番号を入力してください");
  }

  // 結果の返却
  if (errors.length === 0) {
    return {
      isValid: true,
      data: {
        name: data.name,
        email: data.email,
        message: data.message,
        phone: data.phone
      },
      errors: []
    };
  } else {
    return { isValid: false, errors };
  }
}
```

#### 2. 型ガードファクトリー

```typescript
// 汎用的な型ガードファクトリー
function createStringValidator(
  minLength: number = 0,
  maxLength: number = Infinity,
  pattern?: RegExp
) {
  return function(value: unknown): value is string {
    if (typeof value !== "string") {
      return false;
    }

    if (value.length < minLength || value.length > maxLength) {
      return false;
    }

    if (pattern && !pattern.test(value)) {
      return false;
    }

    return true;
  };
}

function createNumberValidator(min: number = -Infinity, max: number = Infinity) {
  return function(value: unknown): value is number {
    return typeof value === "number" && value >= min && value <= max;
  };
}

// 使用例
const isValidName = createStringValidator(2, 50);
const isValidAge = createNumberValidator(0, 150);
const isValidZipCode = createStringValidator(7, 7, /^\d{3}-\d{4}$/);

// 商品データの型ガード
interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
}

function isProduct(value: unknown): value is Product {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const obj = value as any;

  return (
    createNumberValidator(1)(obj.id) &&
    createStringValidator(1, 100)(obj.name) &&
    createNumberValidator(0)(obj.price) &&
    createStringValidator(1, 50)(obj.category)
  );
}
```

#### 3. 条件付き型ガード

```typescript
// 条件付きプロパティを持つ型
interface BaseUser {
  id: number;
  name: string;
  type: "admin" | "user" | "guest";
}

interface AdminUser extends BaseUser {
  type: "admin";
  permissions: string[];
}

interface RegularUser extends BaseUser {
  type: "user";
  email: string;
}

interface GuestUser extends BaseUser {
  type: "guest";
  sessionId: string;
}

type User = AdminUser | RegularUser | GuestUser;

// 基本的なユーザー型ガード
function isBaseUser(value: unknown): value is BaseUser {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const obj = value as any;

  return (
    typeof obj.id === "number" &&
    isNonEmptyString(obj.name) &&
    (obj.type === "admin" || obj.type === "user" || obj.type === "guest")
  );
}

// 特定のユーザータイプの型ガード
function isAdminUser(value: unknown): value is AdminUser {
  if (!isBaseUser(value)) {
    return false;
  }

  return (
    value.type === "admin" &&
    "permissions" in value &&
    Array.isArray((value as any).permissions) &&
    (value as any).permissions.every((p: unknown) => typeof p === "string")
  );
}

function isRegularUser(value: unknown): value is RegularUser {
  if (!isBaseUser(value)) {
    return false;
  }

  return (
    value.type === "user" &&
    "email" in value &&
    isValidEmail((value as any).email)
  );
}

function isGuestUser(value: unknown): value is GuestUser {
  if (!isBaseUser(value)) {
    return false;
  }

  return (
    value.type === "guest" &&
    "sessionId" in value &&
    isNonEmptyString((value as any).sessionId)
  );
}

// 統合的なユーザー型ガード
function isUser(value: unknown): value is User {
  return isAdminUser(value) || isRegularUser(value) || isGuestUser(value);
}
```

---

## 🔧 練習問題

> 📚 **サポート資料**: [実践コード例 - ユーザー定義型ガード練習](./Step04_補足_実践コード例.md#ユーザー定義型ガード練習) | [トラブルシューティング](./Step04_補足_トラブルシューティング.md#よくあるエラー)

### 練習問題 2.1: 基本的なユーザー定義型ガード 🔰

以下の要件を満たすユーザー定義型ガードを実装してください。

```typescript
// 要件1: パスワードの強度をチェックする型ガード
// - 8文字以上
// - 大文字・小文字・数字を含む
function isStrongPassword(value: unknown): value is string {
  /* ここを実装 */
}

// 要件2: 日本の郵便番号形式をチェックする型ガード
// - "123-4567"の形式
function isValidJapaneseZipCode(value: unknown): value is string {
  /* ここを実装 */
}

// 要件3: 上記の型ガードを使用する関数
function validateUserRegistration(data: unknown): { isValid: boolean; errors: string[] } {
  /* ここを実装 */
}
```

### 練習問題 2.2: 複雑なオブジェクト型ガード 🔰

```typescript
interface BlogPost {
  id: number;
  title: string;
  content: string;
  author: string;
  tags: string[];
  publishedAt?: Date;
  isPublished: boolean;
}

// 要件: BlogPost型かどうかを判定するユーザー定義型ガードを実装
function isBlogPost(value: unknown): value is BlogPost {
  /* ここを実装 */
}

// 要件: BlogPost配列かどうかを判定する型ガード
function isBlogPostArray(value: unknown): value is BlogPost[] {
  /* ここを実装 */
}
```

### 練習問題 2.3: 条件付き型ガード 🔰

```typescript
interface PaymentMethod {
  type: "credit" | "debit" | "paypal";
}

interface CreditCardPayment extends PaymentMethod {
  type: "credit";
  cardNumber: string;
  expiryDate: string;
  cvv: string;
}

interface DebitCardPayment extends PaymentMethod {
  type: "debit";
  cardNumber: string;
  pin: string;
}

interface PayPalPayment extends PaymentMethod {
  type: "paypal";
  email: string;
}

type Payment = CreditCardPayment | DebitCardPayment | PayPalPayment;

// 要件: 各支払い方法の型ガードを実装
function isCreditCardPayment(value: unknown): value is CreditCardPayment {
  /* ここを実装 */
}

function isDebitCardPayment(value: unknown): value is DebitCardPayment {
  /* ここを実装 */
}

function isPayPalPayment(value: unknown): value is PayPalPayment {
  /* ここを実装 */
}
```

---

## 📝 解答例

### 練習問題 2.1 解答

```typescript
function isStrongPassword(value: unknown): value is string {
  if (typeof value !== "string") {
    return false;
  }

  if (value.length < 8) {
    return false;
  }

  const hasUpperCase = /[A-Z]/.test(value);
  const hasLowerCase = /[a-z]/.test(value);
  const hasNumber = /\d/.test(value);

  return hasUpperCase && hasLowerCase && hasNumber;
}

function isValidJapaneseZipCode(value: unknown): value is string {
  if (typeof value !== "string") {
    return false;
  }

  const zipCodeRegex = /^\d{3}-\d{4}$/;
  return zipCodeRegex.test(value);
}

function validateUserRegistration(data: unknown): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (typeof data !== "object" || data === null) {
    return { isValid: false, errors: ["無効なデータ形式です"] };
  }

  const obj = data as any;

  if (!isNonEmptyString(obj.email) || !isValidEmail(obj.email)) {
    errors.push("有効なメールアドレスが必要です");
  }

  if (!isStrongPassword(obj.password)) {
    errors.push("パスワードは8文字以上で、大文字・小文字・数字を含む必要があります");
  }

  if (!isValidJapaneseZipCode(obj.zipCode)) {
    errors.push("郵便番号は123-4567の形式で入力してください");
  }

  return { isValid: errors.length === 0, errors };
}
```

### 練習問題 2.2 解答

```typescript
function isBlogPost(value: unknown): value is BlogPost {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const obj = value as any;

  // 必須プロパティのチェック
  if (
    typeof obj.id !== "number" ||
    !isNonEmptyString(obj.title) ||
    !isNonEmptyString(obj.content) ||
    !isNonEmptyString(obj.author) ||
    !Array.isArray(obj.tags) ||
    typeof obj.isPublished !== "boolean"
  ) {
    return false;
  }

  // tagsの各要素が文字列かチェック
  if (!obj.tags.every((tag: unknown) => typeof tag === "string")) {
    return false;
  }

  // オプショナルプロパティのチェック
  if (obj.publishedAt !== undefined && !(obj.publishedAt instanceof Date)) {
    return false;
  }

  return true;
}

function isBlogPostArray(value: unknown): value is BlogPost[] {
  return Array.isArray(value) && value.every(item => isBlogPost(item));
}
```

### 練習問題 2.3 解答

```typescript
function isCreditCardPayment(value: unknown): value is CreditCardPayment {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const obj = value as any;

  return (
    obj.type === "credit" &&
    isNonEmptyString(obj.cardNumber) &&
    isNonEmptyString(obj.expiryDate) &&
    isNonEmptyString(obj.cvv)
  );
}

function isDebitCardPayment(value: unknown): value is DebitCardPayment {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const obj = value as any;

  return (
    obj.type === "debit" &&
    isNonEmptyString(obj.cardNumber) &&
    isNonEmptyString(obj.pin)
  );
}

function isPayPalPayment(value: unknown): value is PayPalPayment {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const obj = value as any;

  return (
    obj.type === "paypal" &&
    isValidEmail(obj.email)
  );
}
```

---

## 👨‍🏫 学習ポイント

### 🤔 よくある質問と回答

**Q: ユーザー定義型ガードが複雑になりがちです。良い設計方法はありますか？**
A: 以下のアプローチを推奨します：
1. **小さな型ガードの組み合わせ**: 基本的な型ガードを作成し、それらを組み合わせる
2. **段階的検証**: まず基本的な構造をチェックし、その後詳細をチェック
3. **ファクトリー関数**: 似たような型ガードは関数で生成する
4. **エラーメッセージの分離**: 型ガードは型チェックのみに集中し、エラーメッセージは別で管理

**Q: 型ガードのパフォーマンスが心配です。**
A: 型ガードは実行時に動作するため、以下の点に注意してください：
- 早期リターン: 最も可能性の高い失敗条件を最初にチェック
- キャッシュ: 同じデータを何度もチェックしない
- 必要最小限のチェック: 過度に厳密な検証は避ける

---

## 🎯 Session2 の成果確認

### 理解度チェック

- [ ] `value is Type`構文を使ったユーザー定義型ガードを実装できる
- [ ] 複雑なオブジェクトの型検証ができる
- [ ] 小さな型ガードを組み合わせて大きな型ガードを作成できる
- [ ] 条件付きプロパティを持つ型の検証ができる
- [ ] 段階的バリデーションシステムを構築できる

### 次回への準備
> 📚 **準備資料**: [開発環境ガイド](./Step04_補足_開発環境ガイド.md) | [参考リソース - 継続学習](./Step04_補足_参考リソース.md#学習継続のコツ)

- [ ] 作成した型ガード関数の動作確認
- [ ] 理解できなかった部分の整理
- [ ] Session3で学習するアサーション関数の予習

**📌 重要**: Session2では再利用可能な型ガード関数の作成に重点を置いています。完璧を目指さず、まずは動く型ガードを作ることを重視しましょう。

---

**🌟 次回（Session3）は、アサーション関数を学習し、フォーム処理システムを完成させます！**