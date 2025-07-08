# Session2: ユーザー定義型ガード（40 分）

> 💡 **対象**: 他言語経験者（基本型ガード知識あり）
> 🎯 **形式**: 講師サポート付き学習
> ⏰ **時間**: 40 分

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

- Session1: 基本型ガード（typeof, instanceof, in 演算子）

---

## ⏰ 詳細タイムテーブル

| 時間         | 内容                         | 学習活動         | 成果物     |
| ------------ | ---------------------------- | ---------------- | ---------- |
| **0-15 分**  | ユーザー定義型ガード理論     | 理解・メモ       | 基本知識   |
| **15-32 分** | 段階的なオブジェクト検証実装 | ハンズオン・実践 | 実践コード |
| **32-40 分** | 実践的な練習問題             | 個人演習・確認   | 演習成果   |

---

## 📚 学習内容

---

### Section 1: ユーザー定義型ガードの実装

> 📚 **関連資料**: [実践コード例 - ユーザー定義型ガード](./Step04_補足_実践コード例.md#ユーザー定義型ガード) | [専門用語集 - value is Type](./Step04_補足_専門用語集.md#value-is-type)

#### 🎯 ユーザー定義型ガードとは

**💡 なぜユーザー定義型ガードが重要なのか**

ユーザー定義型ガードは、`value is Type`構文を使って独自の型チェック関数を作成する機能です。これにより、以下のメリットがあります：

- **再利用性**: 同じ型チェックロジックを複数箇所で使用
- **可読性**: 複雑な型チェックを分かりやすい関数名で表現
- **保守性**: 型チェックロジックの変更が一箇所で済む
- **型安全性**: TypeScript が型の絞り込みを理解

#### 1. 基本的なユーザー定義型ガード

```typescript
// 基本的なプリミティブ型ガード
// 文字列型で空文字でない場合はvalueはstring型だとコンパイラーに伝える
// value is Type 構文を使った型チェック関数はbooleanを返す trueを返したときTypeが確定する
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

#### 2. 配列型ガード

```typescript
// 配列の型ガード
function isStringArray(value: unknown): value is string[] {
  return (
    Array.isArray(value) && value.every((item) => typeof item === "string")
  );
}

function isUserProfileArray(value: unknown): value is UserProfile[] {
  return Array.isArray(value) && value.every((item) => isUserProfile(item));
}

// 使用例
function processUserList(data: unknown): string {
  if (isUserProfileArray(data)) {
    const activeUsers = data.filter((user) => user.isActive);
    return `${data.length}人中${activeUsers.length}人がアクティブです`;
  }
  return "無効なユーザーリストです";
}
```

#### 3. 型ガードの組み合わせパターン

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

#### 💡 「複雑な型チェックを分かりやすい関数名で表現」の具体例

ユーザー定義型ガードの大きな利点の一つは、複数の条件を組み合わせた複雑な型チェックを、意味のある関数名でカプセル化し、コードの可読性を大幅に向上させる点にあります。

**シナリオ：様々な種類の通知を処理するシステム**

あるシステムが、メール、SMS、プッシュ通知の 3 種類の通知を扱っているとします。それぞれの通知には異なるプロパティがあります。

```typescript
interface EmailNotification {
  type: "email";
  recipient: string;
  subject: string;
  body: string;
}

interface SMSNotification {
  type: "sms";
  phoneNumber: string;
  message: string;
}

interface PushNotification {
  type: "push";
  deviceId: string;
  title: string;
  content: string;
  priority: "high" | "normal" | "low";
}

type Notification = EmailNotification | SMSNotification | PushNotification;
```

ここで、「**緊急性の高いプッシュ通知**」であるかをチェックしたいとします。この「緊急性の高いプッシュ通知」とは、単に `type` が `'push'` であるだけでなく、アプリケーションのビジネスロジックとして以下の条件をすべて満たすものと定義します。

1.  通知のタイプが `'push'` である。
2.  `deviceId` が空文字列ではない。
3.  `title` が空文字列ではない。
4.  `priority` が `'high'` である。

**ユーザー定義型ガードなしの場合（複雑な型チェック）**

まず、ユーザー定義型ガードを使わずにこのチェックを行う場合を考えてみましょう。

```typescript
function sendNotification(notification: Notification) {
  // 緊急性の高いプッシュ通知であるかをチェック
  if (
    notification.type === "push" &&
    notification.deviceId !== "" &&
    notification.title !== "" &&
    notification.priority === "high"
  ) {
    // notification は PushNotification 型として扱われる
    // さらに、緊急性の高いプッシュ通知としての処理を行う
    console.log(
      `緊急プッシュ通知を送信: [${notification.title}] to ${notification.deviceId}`
    );
  } else {
    // ... 他の通知タイプの処理
  }
}
```

上記の `if` 文の条件式は、ビジネスロジックを直接表現していますが、複数の条件が並んでいるため、一見して「これは緊急性の高いプッシュ通知のチェックだ」と理解しにくい場合があります。

**ユーザー定義型ガードを使用した場合（分かりやすい関数名で表現）**

この複雑なビジネスルールを、ユーザー定義型ガードでカプセル化してみましょう。

```typescript
// ユーザー定義型ガード：複雑なビジネスルールを分かりやすい関数名で表現
function isHighPriorityPushNotification(
  notification: Notification
): notification is PushNotification {
  return (
    notification.type === "push" && // 判別プロパティによる型絞り込み
    notification.deviceId !== "" && // 値の条件1
    notification.title !== "" && // 値の条件2
    notification.priority === "high" // 値の条件3
  );
}

function sendNotification(notification: Notification) {
  if (isHighPriorityPushNotification(notification)) {
    // 非常に分かりやすい！
    // notification は PushNotification 型として扱われる
    // さらに、isHighPriorityPushNotification関数が保証する条件を満たしている
    console.log(
      `緊急プッシュ通知を送信: [${notification.title}] to ${notification.deviceId}`
    );
  } else {
    // ... 他の通知タイプの処理
  }
}
```

`if (isHighPriorityPushNotification(notification))` と書くことで、コードの意図が非常に明確になります。読み手は、この行が「通知が緊急性の高いプッシュ通知であるか」というビジネスルールをチェックしていることを一目で理解できます。

**💡 `parameter is Type` の動作に関する重要な補足**

ユーザー定義型ガードの `value is Type` 構文は、TypeScript コンパイラに対して「この関数が `true` を返した場合、引数 `value` は `Type` であると断言できる」と伝えます。

重要なのは、**この関数が `false` を返した場合でも、引数 `value` が `Type` ではないと自動的に推論するわけではない**という点です。単に、この型ガードの条件（ビジネスルール）を満たさなかった、という事実を伝えるだけです。

例えば、`isHighPriorityPushNotification` 関数が `false` を返した場合、それは `notification` が `PushNotification` ではないという意味ではありません。`notification` が `PushNotification` であっても、`priority` が `'high'` ではない、といった理由で `false` を返すことがあります。

この場合、`else` ブロック内では `notification` の型はまだ `Notification` のままです。必要であれば、`else` ブロック内でさらに `notification.type === 'push'` のようなチェックを行うことで、`PushNotification` 型に絞り込むことができます。

```typescript
function processNotification(notification: Notification) {
  if (isHighPriorityPushNotification(notification)) {
    // ここでは notification は PushNotification 型として扱われ、
    // かつ priority が 'high' であることが保証される
    console.log(`緊急プッシュ通知を処理: ${notification.title}`);
  } else {
    // ここでは notification は isHighPriorityPushNotification の条件を満たさなかったもの。
    // まだ Notification 型のままであり、PushNotification である可能性も残っている。
    if (notification.type === "push") {
      // ここでは notification は PushNotification 型として扱われるが、
      // priority は 'normal' または 'low' であることがわかる
      console.log(
        `通常のプッシュ通知を処理: ${notification.title} (Priority: ${notification.priority})`
      );
    } else if (notification.type === "email") {
      console.log(`メール通知を処理: ${notification.subject}`);
    }
  }
}
```

このように、ユーザー定義型ガードは、単に型を絞り込むだけでなく、**特定のビジネスロジックや状態を定義する複数の条件（値のチェックを含む）を、一つの分かりやすい関数名にカプセル化する**点に真の価値があります。

### Section2: カスタムバリデーション演習

> 📚 **関連資料**: [実践コード例 - カスタムバリデーション](./Step04_補足_実践コード例.md#カスタムバリデーション) | [トラブルシューティング - バリデーションエラー](./Step04_補足_トラブルシューティング.md#バリデーションエラー)

#### 🔧 実践的なバリデーションシステム

**💡 実際の開発でよく使われるパターン**

実際の Web アプリケーションでは、複数の型ガードを組み合わせて、段階的にデータを検証することが重要です。

#### 1. 段階的バリデーション

```typescript
// バリデーション結果の型定義（ContactForm専用）
interface ContactFormValidationResult {
  isValid: boolean;
  data?: ContactForm;
  errors: string[];
}

// 段階的バリデーション関数
function validateContactForm(input: unknown): ContactFormValidationResult {
  const errors: string[] = [];

  // 基本的なオブジェクトチェック
  if (typeof input !== "object" || input === null) {
    return {
      isValid: false,
      errors: ["入力データはオブジェクトである必要があります"],
    };
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
        phone: data.phone,
      },
      errors: [],
    };
  } else {
    return { isValid: false, errors };
  }
}
```

#### 2. 基本的なオブジェクト型ガード

```typescript
// シンプルなオブジェクト型ガード
interface Product {
  id: number;
  name: string;
  price: number;
}

function isProduct(value: unknown): value is Product {
  // まずオブジェクトかどうかチェック
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const obj = value as any;

  // 各プロパティの存在と型をチェック
  return (
    typeof obj.id === "number" &&
    typeof obj.name === "string" &&
    typeof obj.price === "number"
  );
}

// 使用例
function processProduct(data: unknown): string {
  if (isProduct(data)) {
    // この時点でdataはProduct型として扱われる
    return `商品: ${data.name} - ¥${data.price}`;
  }
  return "無効な商品データです";
}

// テスト
const validProduct = { id: 1, name: "ノートPC", price: 80000 };
const invalidProduct = { id: "1", name: "ノートPC" }; // priceがない

console.log(processProduct(validProduct)); // "商品: ノートPC - ¥80000"
console.log(processProduct(invalidProduct)); // "無効な商品データです"
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

### 練習問題 2.1: ユーザー定義型ガード（8 分） 🔰

```typescript
// 要件: 以下のユーザー定義型ガードを実装してください
function isValidEmail(value: unknown): value is string {
  /* ここを実装 */
}

// テスト用関数
function processEmail(input: unknown): string {
  if (isValidEmail(input)) {
    return `有効なメール: ${input}`;
  } else {
    return "無効なメールアドレス";
  }
}

// テストケース
console.log(processEmail("test@example.com")); // "有効なメール: test@example.com"
console.log(processEmail("invalid-email")); // "無効なメールアドレス"
```

---

## 📝 解答例

### 練習問題 2.1 解答

```typescript
function isValidEmail(value: unknown): value is string {
  if (typeof value !== "string") {
    return false;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value);
}

function isPositiveNumber(value: unknown): value is number {
  return typeof value === "number" && value > 0;
}
```

### 練習問題 2.2 解答

```typescript
function isProduct(value: unknown): value is Product {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    "name" in value &&
    "price" in value &&
    "inStock" in value &&
    typeof (value as any).id === "number" &&
    typeof (value as any).name === "string" &&
    typeof (value as any).price === "number" &&
    typeof (value as any).inStock === "boolean"
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
- [ ] Session3 で学習するアサーション関数の予習

**📌 重要**: Session2 では再利用可能な型ガード関数の作成に重点を置いています。完璧を目指さず、まずは動く型ガードを作ることを重視しましょう。

---

**🌟 次回（Session3）は、アサーション関数を学習し、フォーム処理システムを完成させます！**
