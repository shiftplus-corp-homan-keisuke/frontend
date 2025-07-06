# Session3: アサーション関数（40 分）

> 💡 **対象**: 他言語経験者（型ガード・ユーザー定義型ガード知識あり）
> 🎯 **形式**: 講師サポート付き学習
> ⏰ **時間**: 40 分

## 📚 関連補足資料

このセッションの学習をサポートする補足資料をご用意しています：

- 📖 **[専門用語集](./Step04_補足_専門用語集.md)** - アサーション関数・エラーハンドリングの重要な概念と用語の詳細解説
- 💻 **[実践コード例](./Step04_補足_実践コード例.md)** - 完全なシステム実装例とベストプラクティス
- 🔧 **[開発環境ガイド](./Step04_補足_開発環境ガイド.md)** - 効率的な開発環境の活用
- 🌐 **[参考リソース](./Step04_補足_参考リソース.md)** - 継続学習のためのリソース集
- 🚨 **[トラブルシューティング](./Step04_補足_トラブルシューティング.md)** - デバッグとエラー解決の完全ガイド

> 💡 **活用方法**: 学習中に疑問が生じた際や、より深く理解したい場合に参照してね 🐰

## 📅 セッション概要

**学習目標**:

- [ ] アサーション関数（`asserts`キーワード）の理解と実装
- [ ] エラーハンドリングパターンの習得
- [ ] 型安全なフォーム処理システムの完成
- [ ] Step04 の総復習と学習成果の確認

**前提知識**:

- [ ] Session1-2: 基本型ガード、ユーザー定義型ガード
- [ ] Step01-03: JavaScript 基礎、TypeScript 基本型注釈、インターフェース

**成果物**:

- 型安全なフォーム処理システムの完成
- Step04 で学んだ概念の統合活用

---

## ⏰ 詳細タイムテーブル

| 時間         | 内容                   | 学習活動         | 成果物     |
| ------------ | ---------------------- | ---------------- | ---------- |
| **0-3 分**   | 前回復習・今回目標     | 振り返り・質問   | 理解確認   |
| **3-15 分**  | アサーション関数理論   | 理解・メモ       | 基本知識   |
| **15-32 分** | 簡単なフォーム処理実践 | ハンズオン・実践 | 実践コード |
| **32-40 分** | 練習問題と総復習       | 個人演習・確認   | 学習成果   |

---

## 📚 学習内容

### Section 1: 前回復習（要点のみ）

#### 🔍 Session1-2 の重要ポイント確認

```typescript
// Session1で学習した基本型ガード
function isString(value: unknown): value is string {
  return typeof value === "string";
}

function isNumber(value: unknown): value is number {
  return typeof value === "number";
}

// Session2で学習したユーザー定義型ガード
function isValidEmail(value: unknown): value is string {
  if (typeof value !== "string") return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

// 複雑なオブジェクト型ガード
interface UserProfile {
  id: number;
  name: string;
  email: string;
}

function isUserProfile(value: unknown): value is UserProfile {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    "name" in value &&
    "email" in value &&
    typeof (value as any).id === "number" &&
    isNonEmptyString((value as any).name) &&
    isValidEmail((value as any).email)
  );
}
```

**💡 今日学ぶアサーション関数との関係**

アサーション関数は、型ガードの結果が`false`の場合にエラーを投げることで、その後のコードで型が保証されることを TypeScript に伝える機能です。

---

### Section 2: アサーション関数の理論と実装

> 📚 **関連資料**: [専門用語集 - アサーション関数](./Step04_補足_専門用語集.md#アサーション関数) | [実践コード例 - アサーション関数](./Step04_補足_実践コード例.md#アサーション関数)

#### 🎯 アサーション関数とは

**💡 なぜアサーション関数が重要なのか**

アサーション関数は、条件が満たされない場合にエラーを投げることで、その後のコードで型が保証されることを TypeScript に伝える機能です。これにより、以下のメリットがあります：

- **型の保証**: エラーが投げられなければ、その後のコードで型が確定
- **早期エラー検出**: 問題のあるデータを早期に発見
- **コードの簡潔性**: 型ガードの条件分岐を減らせる
- **デバッグの容易さ**: エラーメッセージで問題箇所を特定しやすい

#### 1. 基本的なアサーション関数

```typescript
// 基本的なアサーション関数
function assertIsString(value: unknown): asserts value is string {
  if (typeof value !== "string") {
    throw new Error("値は文字列である必要があります");
  }
}

function assertIsNumber(value: unknown): asserts value is number {
  if (typeof value !== "number") {
    throw new Error("値は数値である必要があります");
  }
}

function assertIsNonEmptyString(value: unknown): asserts value is string {
  if (!isNonEmptyString(value)) {
    throw new Error("値は空でない文字列である必要があります");
  }
}

// 使用例
function processValue(input: unknown): string {
  assertIsString(input);
  // この時点でinputはstring型として扱われる
  return input.toUpperCase(); // エラーなし
}

function calculateArea(width: unknown, height: unknown): number {
  assertIsNumber(width);
  assertIsNumber(height);
  // この時点でwidth、heightはnumber型として扱われる
  return width * height; // エラーなし
}
```

#### 2. 複雑なアサーション関数

```typescript
// オブジェクトのアサーション関数
function assertIsUserProfile(value: unknown): asserts value is UserProfile {
  if (!isUserProfile(value)) {
    throw new Error("無効なユーザープロファイルです");
  }
}

// 配列のアサーション関数
function assertIsNonEmptyArray<T>(array: T[]): asserts array is [T, ...T[]] {
  if (array.length === 0) {
    throw new Error("配列は空にできません");
  }
}

function assertIsStringArray(value: unknown): asserts value is string[] {
  if (!Array.isArray(value)) {
    throw new Error("値は配列である必要があります");
  }

  if (!value.every((item) => typeof item === "string")) {
    throw new Error("配列の全ての要素は文字列である必要があります");
  }
}

// 使用例
function processUsers(data: unknown): string {
  assertIsUserProfile(data);
  // この時点でdataはUserProfile型として扱われる
  return `ユーザー: ${data.name} (${data.email})`;
}

function processFirstItem<T>(items: T[]): T {
  assertIsNonEmptyArray(items);
  // この時点でitemsは空でない配列として扱われる
  return items[0]; // エラーなし
}
```

#### 3. 基本的なアサーション関数の活用

```typescript
// 基本的なアサーション関数
function assertIsString(value: unknown): asserts value is string {
  if (typeof value !== "string") {
    throw new Error("値は文字列である必要があります");
  }
}

function assertIsNumber(value: unknown): asserts value is number {
  if (typeof value !== "number") {
    throw new Error("値は数値である必要があります");
  }
}

// 使用例
function processUserData(name: unknown, age: unknown): string {
  // アサーション関数で型を保証
  assertIsString(name);
  assertIsNumber(age);

  // この時点でname、ageの型が確定している
  return `ユーザー: ${name} (${age}歳)`;
}

// テスト
try {
  console.log(processUserData("田中太郎", 25)); // "ユーザー: 田中太郎 (25歳)"
  console.log(processUserData("佐藤花子", "30")); // エラーが発生
} catch (error) {
  console.log(`エラー: ${error.message}`);
}
```

#### 4. 条件付きアサーション関数

```typescript
// 条件付きアサーション関数
function assertIsDefined<T>(
  value: T | null | undefined,
  fieldName?: string
): asserts value is T {
  if (value === null || value === undefined) {
    const message = fieldName
      ? `${fieldName}は必須です`
      : "値はnullまたはundefinedにできません";
    throw new RequiredFieldError(fieldName || "値");
  }
}

function assertIsOneOf<T>(
  value: unknown,
  allowedValues: T[],
  fieldName?: string
): asserts value is T {
  if (!allowedValues.includes(value as T)) {
    const message = fieldName
      ? `${fieldName}は次のいずれかである必要があります: ${allowedValues.join(
          ", "
        )}`
      : `値は次のいずれかである必要があります: ${allowedValues.join(", ")}`;
    throw new ValidationError(message, fieldName);
  }
}

// 使用例
function processUserRole(role: unknown): string {
  assertIsOneOf(role, ["admin", "user", "guest"], "ユーザーロール");
  // この時点でroleは"admin" | "user" | "guest"型として扱われる

  switch (role) {
    case "admin":
      return "管理者権限";
    case "user":
      return "一般ユーザー権限";
    case "guest":
      return "ゲスト権限";
  }
}
```

---

### Section 3: 簡単なフォーム処理実践

> 📚 **関連資料**: [実践コード例 - 基本的なフォーム処理](./Step04_補足_実践コード例.md#基本的なフォーム処理)

#### 🔧 実践例: 基本的なフォーム処理

**💡 学習のポイント**

これまで学んだ型ガードとアサーション関数を組み合わせて、簡単なフォーム処理を実装してみましょう。

#### 1. フォームデータの型定義

```typescript
// Step02で学んだ型エイリアスを活用
type UserRole = "admin" | "user" | "guest";
type ContactMethod = "email" | "phone" | "both";

// Step03で学んだインターフェースを活用
interface BaseFormData {
  name: string;
  email: string;
  age: number;
}

interface UserRegistrationForm extends BaseFormData {
  password: string;
  confirmPassword: string;
  role: UserRole;
  agreeToTerms: boolean;
}

interface ContactForm extends BaseFormData {
  message: string;
  contactMethod: ContactMethod;
  phone?: string;
}

// Step04で学んだユニオン型を活用
type FormData = UserRegistrationForm | ContactForm;
```

#### 2. アサーション関数を使った統合バリデーション

```typescript
// 基本的なアサーション関数群
function assertIsValidName(value: unknown): asserts value is string {
  assertIsNonEmptyString(value);

  if (value.length < 2) {
    throw new ValidationError("名前は2文字以上で入力してください", "name");
  }

  if (value.length > 50) {
    throw new ValidationError("名前は50文字以内で入力してください", "name");
  }
}

function assertIsValidPassword(value: unknown): asserts value is string {
  assertIsNonEmptyString(value);

  if (value.length < 8) {
    throw new ValidationError(
      "パスワードは8文字以上で入力してください",
      "password"
    );
  }

  const hasUpperCase = /[A-Z]/.test(value);
  const hasLowerCase = /[a-z]/.test(value);
  const hasNumber = /\d/.test(value);

  if (!hasUpperCase || !hasLowerCase || !hasNumber) {
    throw new ValidationError(
      "パスワードは大文字・小文字・数字を含む必要があります",
      "password"
    );
  }
}

function assertIsValidMessage(value: unknown): asserts value is string {
  assertIsNonEmptyString(value);

  if (value.length > 1000) {
    throw new ValidationError(
      "メッセージは1000文字以内で入力してください",
      "message"
    );
  }
}

// フォーム全体のアサーション関数
function assertIsUserRegistrationForm(
  value: unknown
): asserts value is UserRegistrationForm {
  if (typeof value !== "object" || value === null) {
    throw new ValidationError("無効なフォームデータです");
  }

  const data = value as any;

  // 各フィールドのアサーション
  assertIsValidName(data.name);
  assertIsValidEmail(data.email, "メールアドレス");
  assertIsValidAge(data.age, "年齢");
  assertIsValidPassword(data.password);
  assertIsValidPassword(data.confirmPassword);
  assertIsOneOf(data.role, ["admin", "user", "guest"], "ユーザーロール");

  if (typeof data.agreeToTerms !== "boolean") {
    throw new ValidationError("利用規約への同意が必要です", "agreeToTerms");
  }

  if (!data.agreeToTerms) {
    throw new ValidationError("利用規約に同意してください", "agreeToTerms");
  }

  if (data.password !== data.confirmPassword) {
    throw new ValidationError("パスワードが一致しません", "confirmPassword");
  }
}

function assertIsContactForm(value: unknown): asserts value is ContactForm {
  if (typeof value !== "object" || value === null) {
    throw new ValidationError("無効なフォームデータです");
  }

  const data = value as any;

  // 各フィールドのアサーション
  assertIsValidName(data.name);
  assertIsValidEmail(data.email, "メールアドレス");
  assertIsValidAge(data.age, "年齢");
  assertIsValidMessage(data.message);
  assertIsOneOf(data.contactMethod, ["email", "phone", "both"], "連絡方法");

  // 条件付きバリデーション
  if (data.contactMethod === "phone" || data.contactMethod === "both") {
    if (!data.phone) {
      throw new RequiredFieldError("電話番号");
    }
    // 電話番号の形式チェック（簡易版）
    const phoneRegex = /^(\+81|0)\d{1,4}-?\d{1,4}-?\d{4}$/;
    if (!phoneRegex.test(data.phone.replace(/\s/g, ""))) {
      throw new InvalidFormatError("電話番号", "090-1234-5678");
    }
  }
}
```

#### 3. フォーム処理システムの実装

```typescript
// フォーム処理結果の型定義
interface FormProcessingResult<T> {
  success: boolean;
  data?: T;
  errors: ValidationError[];
}

// フォーム処理クラス
class FormProcessor {
  // ユーザー登録フォームの処理
  static processUserRegistration(
    formData: unknown
  ): FormProcessingResult<UserRegistrationForm> {
    try {
      assertIsUserRegistrationForm(formData);

      // この時点でformDataはUserRegistrationForm型として扱われる
      console.log(`新規ユーザー登録: ${formData.name} (${formData.role})`);

      return {
        success: true,
        data: formData,
        errors: [],
      };
    } catch (error) {
      if (error instanceof ValidationError) {
        return {
          success: false,
          errors: [error],
        };
      } else {
        return {
          success: false,
          errors: [new ValidationError("予期しないエラーが発生しました")],
        };
      }
    }
  }

  // お問い合わせフォームの処理
  static processContactForm(
    formData: unknown
  ): FormProcessingResult<ContactForm> {
    try {
      assertIsContactForm(formData);

      // この時点でformDataはContactForm型として扱われる
      console.log(`お問い合わせ: ${formData.name} - ${formData.contactMethod}`);

      return {
        success: true,
        data: formData,
        errors: [],
      };
    } catch (error) {
      if (error instanceof ValidationError) {
        return {
          success: false,
          errors: [error],
        };
      } else {
        return {
          success: false,
          errors: [new ValidationError("予期しないエラーが発生しました")],
        };
      }
    }
  }

  // 汎用フォーム処理
  static processForm(
    formData: unknown,
    formType: "registration" | "contact"
  ): FormProcessingResult<FormData> {
    switch (formType) {
      case "registration":
        return this.processUserRegistration(formData);
      case "contact":
        return this.processContactForm(formData);
      default:
        return {
          success: false,
          errors: [new ValidationError("未対応のフォームタイプです")],
        };
    }
  }
}
```

#### 4. 使用例とテストケース

```typescript
// テスト用のサンプルデータ
const validUserRegistration = {
  name: "田中太郎",
  email: "tanaka@example.com",
  age: 25,
  password: "SecurePass123",
  confirmPassword: "SecurePass123",
  role: "user",
  agreeToTerms: true,
};

const validContactForm = {
  name: "佐藤花子",
  email: "sato@example.com",
  age: 30,
  message: "お問い合わせ内容です。",
  contactMethod: "email",
};

const invalidUserRegistration = {
  name: "A", // 短すぎる
  email: "invalid-email", // 無効なメール
  age: -5, // 無効な年齢
  password: "weak", // 弱いパスワード
  confirmPassword: "different", // パスワード不一致
  role: "invalid", // 無効なロール
  agreeToTerms: false, // 利用規約未同意
};

// テストケースの実行
function runTests(): void {
  console.log("=== フォーム処理システムのテスト ===");

  // 有効なユーザー登録フォーム
  console.log("\n--- 有効なユーザー登録フォーム ---");
  const result1 = FormProcessor.processUserRegistration(validUserRegistration);
  console.log("結果:", result1.success ? "成功" : "失敗");
  if (result1.data) {
    console.log(`登録ユーザー: ${result1.data.name} (${result1.data.role})`);
  }

  // 有効なお問い合わせフォーム
  console.log("\n--- 有効なお問い合わせフォーム ---");
  const result2 = FormProcessor.processContactForm(validContactForm);
  console.log("結果:", result2.success ? "成功" : "失敗");
  if (result2.data) {
    console.log(
      `お問い合わせ者: ${result2.data.name} (${result2.data.contactMethod})`
    );
  }

  // 無効なユーザー登録フォーム
  console.log("\n--- 無効なユーザー登録フォーム ---");
  const result3 = FormProcessor.processUserRegistration(
    invalidUserRegistration
  );
  console.log("結果:", result3.success ? "成功" : "失敗");
  if (result3.errors.length > 0) {
    console.log("エラー:");
    result3.errors.forEach((error) => {
      console.log(`- ${error.message} (フィールド: ${error.field || "不明"})`);
    });
  }
}

// テスト実行
runTests();
```

---

## 🔧 練習問題

> 📚 **サポート資料**: [実践コード例 - アサーション関数練習](./Step04_補足_実践コード例.md#アサーション関数練習) | [トラブルシューティング](./Step04_補足_トラブルシューティング.md#よくあるエラー)

### 練習問題 3.1: アサーション関数（8分） 🔰

```typescript
// 要件: 以下のアサーション関数を実装してください
function assertIsString(value: unknown): asserts value is string {
  /* ここを実装 */
}

// テスト用関数
function processUserName(name: unknown): string {
  assertIsString(name);
  
  // この時点でnameはstring型として扱える
  return `ユーザー名: ${name.toUpperCase()}`;
}

// テストケース
try {
  console.log(processUserName("田中")); // "ユーザー名: 田中"
  console.log(processUserName(123));    // エラーが発生
} catch (error) {
  console.log(`エラー: ${error.message}`);
}
```

---

## 📝 解答例

### 練習問題 3.1 解答

```typescript
function assertIsString(value: unknown): asserts value is string {
  if (typeof value !== "string") {
    throw new Error("値は文字列である必要があります");
  }
}

function assertIsNumber(value: unknown): asserts value is number {
  if (typeof value !== "number") {
    throw new Error("値は数値である必要があります");
  }
}
```

### 練習問題 3.2 解答

```typescript
function assertIsUser(value: unknown): asserts value is User {
  if (typeof value !== "object" || value === null) {
    throw new Error("無効なユーザーデータです");
  }

  const obj = value as any;

  if (typeof obj.id !== "number") {
    throw new Error("ユーザーIDは数値である必要があります");
  }

  if (typeof obj.name !== "string" || obj.name.trim().length === 0) {
    throw new Error("ユーザー名は空でない文字列である必要があります");
  }

  if (typeof obj.email !== "string" || !obj.email.includes("@")) {
    throw new Error("有効なメールアドレスが必要です");
  }
}
```

### 練習問題 3.2 解答

```typescript
function assertIsValidProduct(value: unknown): asserts value is Product {
  if (typeof value !== "object" || value === null) {
    throw new ProductValidationError(
      "商品データはオブジェクトである必要があります"
    );
  }

  const obj = value as any;

  if (typeof obj.id !== "string" || obj.id.trim().length === 0) {
    throw new ProductValidationError(
      "商品IDは空でない文字列である必要があります",
      obj.id
    );
  }

  if (typeof obj.name !== "string" || obj.name.trim().length === 0) {
    throw new ProductValidationError(
      "商品名は空でない文字列である必要があります",
      obj.id
    );
  }

  if (obj.name.length > 100) {
    throw new ProductValidationError(
      "商品名は100文字以内である必要があります",
      obj.id
    );
  }

  if (typeof obj.price !== "number" || obj.price <= 0) {
    throw new ProductValidationError(
      "価格は正の数値である必要があります",
      obj.id
    );
  }

  if (typeof obj.category !== "string" || obj.category.trim().length === 0) {
    throw new ProductValidationError(
      "カテゴリは空でない文字列である必要があります",
      obj.id
    );
  }
}
```

---

## 👨‍🏫 学習ポイント

### 🤔 よくある質問と回答

**Q: アサーション関数と型ガードの使い分けが分かりません。**
A: 以下のように使い分けます：

- **型ガード**: 条件分岐で使用し、型が異なる場合の処理を分ける
- **アサーション関数**: 型が期待通りでない場合はエラーとして扱い、その後のコードで型を保証

**Q: アサーション関数でエラーが発生した場合の処理はどうすべきですか？**
A: try-catch 文で適切にエラーハンドリングを行い、ユーザーに分かりやすいエラーメッセージを表示することが重要です。また、カスタムエラークラスを使用することで、エラーの種類に応じた処理を行えます。

---

## 🎯 Step04 総合評価

### 最終評価基準

#### 技術習得度（60%）

- [ ] **基本型ガード**: typeof、instanceof、in 演算子の適切な使用
- [ ] **ユーザー定義型ガード**: `value is Type`構文の理解と実装
- [ ] **アサーション関数**: `asserts`キーワードを使ったエラーハンドリング
- [ ] **統合活用**: 複数の概念を組み合わせたシステム構築

#### 実装品質（25%）

- [ ] **コードの可読性**: 変数名・関数名の適切性
- [ ] **型安全性**: 型ガード・アサーション関数の恩恵を活用
- [ ] **保守性**: 拡張しやすい設計
- [ ] **動作確認**: 実装した機能の正常動作

#### 学習姿勢（15%）

- [ ] **積極性**: 質問・議論への参加
- [ ] **問題解決**: 自力でのデバッグ・調査
- [ ] **協調性**: 他の学習者との協力
- [ ] **振り返り**: 学習内容の整理・次ステップの計画

---

## 成果物

- [ ] **型安全なフォーム処理システム**: 型ガード・ユーザー定義型ガード・アサーション関数を統合した実用的なシステ
