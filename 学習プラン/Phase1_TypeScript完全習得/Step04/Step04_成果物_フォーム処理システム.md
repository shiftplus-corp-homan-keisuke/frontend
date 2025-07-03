# Step04 成果物：型安全なフォーム処理システム

---

## 🎯 課題の目的

**あなたが作成するもの**: 型ガード・ユーザー定義型ガード・アサーション関数を活用した型安全なフォーム処理システム

**なぜ作るのか**: Step04で学習した型ガード技術を実際のWebアプリケーションに適用し、**実用的な型安全システムを構築する力**を身につけるため

**学習目標**:

- 基本型ガード（typeof, instanceof, in演算子）を実装できる
- ユーザー定義型ガード（`value is Type`）を作成できる
- アサーション関数（`asserts`）を使ったエラーハンドリングができる
- 複数の型ガード技術を組み合わせた実用的なシステムを構築できる

---

## 📋 必須提出物

以下の1つのファイルのみ提出してください：

```
📁 提出物/
└── form-processor.ts    # 型安全なフォーム処理システム（必須）
```

---

## ⏰ 作成手順（推奨時間配分：合計40分）

### Phase 1: 基本設計（10分）

#### ステップ 1-1: 要件理解と型定義（10分）

以下の要件を満たすフォーム処理システムを設計してください：

**📋 システムの概要**
このシステムは**Webアプリケーションのフォーム処理**を型安全に行うシステムです。主な機能は以下の通りです：

- **ユーザー登録フォーム**: 名前・メール・パスワード・年齢・ロールの入力
- **お問い合わせフォーム**: 名前・メール・メッセージ・連絡方法の入力
- **型安全なバリデーション**: 各入力値の型と形式を厳密にチェック
- **エラーハンドリング**: 分かりやすいエラーメッセージの提供
- **型の保証**: バリデーション後の型安全性確保

**🎯 実装する型定義**

```typescript
// 基本的な型エイリアス
type UserRole = "admin" | "user" | "guest";
type ContactMethod = "email" | "phone" | "both";

// ユーザー登録フォームの型
interface UserRegistrationForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  age: number;
  role: UserRole;
  agreeToTerms: boolean;
}

// お問い合わせフォームの型
interface ContactForm {
  name: string;
  email: string;
  message: string;
  contactMethod: ContactMethod;
  phone?: string; // 連絡方法がphoneまたはbothの場合は必須
}

// エラークラス
class ValidationError extends Error {
  constructor(message: string, public field?: string) {
    super(message);
    this.name = "ValidationError";
  }
}
```

### Phase 2: 型ガード実装（20分）

#### ステップ 2-1: 基本型ガードの実装（5分）

```typescript
// TODO: 以下の基本型ガードを実装してください

// 空でない文字列かどうかを判定
function isNonEmptyString(value: unknown): value is string {
  /* ここを実装 */
}

// 有効なメールアドレスかどうかを判定
function isValidEmail(value: unknown): value is string {
  /* ここを実装 */
}

// 有効な年齢かどうかを判定（0-150の範囲）
function isValidAge(value: unknown): value is number {
  /* ここを実装 */
}
```

#### ステップ 2-2: ユーザー定義型ガードの実装（10分）

```typescript
// TODO: 以下のユーザー定義型ガードを実装してください

// 強いパスワードかどうかを判定（8文字以上、大文字・小文字・数字を含む）
function isStrongPassword(value: unknown): value is string {
  /* ここを実装 */
}

// 有効な電話番号かどうかを判定（日本の形式）
function isValidPhoneNumber(value: unknown): value is string {
  /* ここを実装 */
}

// UserRegistrationForm型かどうかを判定
function isUserRegistrationForm(value: unknown): value is UserRegistrationForm {
  /* ここを実装 */
}

// ContactForm型かどうかを判定
function isContactForm(value: unknown): value is ContactForm {
  /* ここを実装 */
}
```

#### ステップ 2-3: アサーション関数の実装（5分）

```typescript
// TODO: 以下のアサーション関数を実装してください

// ユーザー登録フォームのアサーション
function assertIsUserRegistrationForm(value: unknown): asserts value is UserRegistrationForm {
  /* ここを実装 */
}

// お問い合わせフォームのアサーション
function assertIsContactForm(value: unknown): asserts value is ContactForm {
  /* ここを実装 */
}
```

### Phase 3: フォーム処理システム完成（10分）

#### ステップ 3-1: フォーム処理クラスの実装（10分）

```typescript
// TODO: 以下のフォーム処理クラスを実装してください

interface FormProcessingResult<T> {
  success: boolean;
  data?: T;
  errors: ValidationError[];
}

class FormProcessor {
  // ユーザー登録フォームの処理
  static processUserRegistration(formData: unknown): FormProcessingResult<UserRegistrationForm> {
    /* ここを実装 */
  }

  // お問い合わせフォームの処理
  static processContactForm(formData: unknown): FormProcessingResult<ContactForm> {
    /* ここを実装 */
  }
}

// 使用例とテスト
function runTests(): void {
  /* ここを実装 */
}
```

---

## ✅ 最低合格要件

以下の要件を**すべて満たす**ことで合格とします：

### 🔧 技術要件

- [ ] TypeScriptでコンパイルエラーが発生しない
- [ ] **基本型ガードを3つ以上実装している**（最重要！）
- [ ] **ユーザー定義型ガード（`value is Type`）を3つ以上実装している**（最重要！）
- [ ] **アサーション関数（`asserts`）を2つ以上実装している**（最重要！）
- [ ] すべての関数に適切な型注釈が付いている

### 🎯 機能要件

- [ ] ユーザー登録フォームの処理ができる
- [ ] お問い合わせフォームの処理ができる
- [ ] 無効なデータに対して適切なエラーメッセージを表示する
- [ ] バリデーション成功時に型安全なデータを返す

### 💭 型ガード・アサーション関数要件

- [ ] 基本型ガードが正しく実装されている
- [ ] ユーザー定義型ガードが`value is Type`の形で正しく実装されている
- [ ] アサーション関数が`asserts`キーワードを使って正しく実装されている
- [ ] エラーハンドリングが適切に行われている

---

## 📊 評価基準

| 項目                     | 配点  | 評価ポイント                                   |
| ------------------------ | ----- | ---------------------------------------------- |
| **型ガード実装力**       | 40点  | 基本型ガード・ユーザー定義型ガードの正確な実装 |
| **アサーション関数実装力** | 30点  | `asserts`キーワードを使った適切な実装          |
| **システム統合力**       | 20点  | 複数の技術を組み合わせた実用的なシステム構築   |
| **エラーハンドリング**   | 10点  | 適切なエラーメッセージとエラー処理             |

**合格ライン**: 70点以上

---

## 💡 実装のヒント

### 🤔 型ガードを考える時の質問

1. **この値にはどんなパターンがある？**
   - 文字列 → 空文字列・有効な文字列・無効な形式
   - 数値 → 負の数・0・正の数・範囲外の数
   - オブジェクト → null・undefined・有効なオブジェクト・無効なオブジェクト

2. **どのような条件で有効とするか？**
   - メールアドレス → 正規表現でのパターンマッチ
   - パスワード → 長さ・文字種の組み合わせ
   - 年齢 → 数値かつ妥当な範囲

### 📝 型ガード関数の基本例

```typescript
// 基本的な型ガード関数
function isString(value: unknown): value is string {
  return typeof value === "string";
}

function isNumber(value: unknown): value is number {
  return typeof value === "number";
}

// 特定の値の型ガード
function isValidRole(value: unknown): value is UserRole {
  return value === "admin" || value === "user" || value === "guest";
}

// オブジェクトの型ガード
function hasRequiredProperties(value: unknown): value is { name: unknown; email: unknown } {
  return (
    typeof value === "object" &&
    value !== null &&
    "name" in value &&
    "email" in value
  );
}
```

### 🔍 アサーション関数の基本例

```typescript
// 基本的なアサーション関数
function assertIsString(value: unknown): asserts value is string {
  if (typeof value !== "string") {
    throw new ValidationError("値は文字列である必要があります");
  }
}

// カスタムエラーを使ったアサーション関数
function assertIsValidEmail(value: unknown): asserts value is string {
  if (!isValidEmail(value)) {
    throw new ValidationError("有効なメールアドレスを入力してください", "email");
  }
}

// 複雑なオブジェクトのアサーション
function assertIsValidForm(value: unknown): asserts value is UserRegistrationForm {
  if (!isUserRegistrationForm(value)) {
    throw new ValidationError("無効なフォームデータです");
  }
}
```

### ⚠️ よくある間違い

1. **型ガードの戻り値型注釈忘れ**

   ```typescript
   // ❌ 間違い：戻り値型注釈がない
   function isValidEmail(value: unknown) {
     return typeof value === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
   }

   // ✅ 正解：`value is Type`の形で指定
   function isValidEmail(value: unknown): value is string {
     return typeof value === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
   }
   ```

2. **アサーション関数の`asserts`キーワード忘れ**

   ```typescript
   // ❌ 間違い：assertsキーワードがない
   function assertIsString(value: unknown): value is string {
     if (typeof value !== "string") {
       throw new Error("文字列ではありません");
     }
   }

   // ✅ 正解：`asserts`キーワードを使用
   function assertIsString(value: unknown): asserts value is string {
     if (typeof value !== "string") {
       throw new Error("文字列ではありません");
     }
   }
   ```

3. **エラーハンドリングの不備**

   ```typescript
   // ❌ 間違い：エラーハンドリングなし
   function processForm(data: unknown) {
     assertIsUserRegistrationForm(data);
     return data; // エラーが発生する可能性
   }

   // ✅ 正解：try-catchでエラーハンドリング
   function processForm(data: unknown): FormProcessingResult<UserRegistrationForm> {
     try {
       assertIsUserRegistrationForm(data);
       return { success: true, data, errors: [] };
     } catch (error) {
       if (error instanceof ValidationError) {
         return { success: false, errors: [error] };
       }
       return { success: false, errors: [new ValidationError("予期しないエラー")] };
     }
   }
   ```

---

## 📚 参考：完成例（答えを見たい場合）

<details>
<summary>⚠️ 注意：まず自分で考えてから見てください</summary>

```typescript
// 型定義
type UserRole = "admin" | "user" | "guest";
type ContactMethod = "email" | "phone" | "both";

interface UserRegistrationForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  age: number;
  role: UserRole;
  agreeToTerms: boolean;
}

interface ContactForm {
  name: string;
  email: string;
  message: string;
  contactMethod: ContactMethod;
  phone?: string;
}

class ValidationError extends Error {
  constructor(message: string, public field?: string) {
    super(message);
    this.name = "ValidationError";
  }
}

// 基本型ガード
function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isValidEmail(value: unknown): value is string {
  if (typeof value !== "string") return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value);
}

function isValidAge(value: unknown): value is number {
  return typeof value === "number" && value >= 0 && value <= 150;
}

// ユーザー定義型ガード
function isStrongPassword(value: unknown): value is string {
  if (typeof value !== "string") return false;
  if (value.length < 8) return false;
  
  const hasUpperCase = /[A-Z]/.test(value);
  const hasLowerCase = /[a-z]/.test(value);
  const hasNumber = /\d/.test(value);
  
  return hasUpperCase && hasLowerCase && hasNumber;
}

function isValidPhoneNumber(value: unknown): value is string {
  if (typeof value !== "string") return false;
  const phoneRegex = /^(\+81|0)\d{1,4}-?\d{1,4}-?\d{4}$/;
  return phoneRegex.test(value.replace(/\s/g, ""));
}

function isUserRegistrationForm(value: unknown): value is UserRegistrationForm {
  if (typeof value !== "object" || value === null) return false;
  
  const obj = value as any;
  
  return (
    isNonEmptyString(obj.name) &&
    isValidEmail(obj.email) &&
    isStrongPassword(obj.password) &&
    isStrongPassword(obj.confirmPassword) &&
    isValidAge(obj.age) &&
    (obj.role === "admin" || obj.role === "user" || obj.role === "guest") &&
    typeof obj.agreeToTerms === "boolean"
  );
}

function isContactForm(value: unknown): value is ContactForm {
  if (typeof value !== "object" || value === null) return false;
  
  const obj = value as any;
  
  const basicValid = (
    isNonEmptyString(obj.name) &&
    isValidEmail(obj.email) &&
    isNonEmptyString(obj.message) &&
    (obj.contactMethod === "email" || obj.contactMethod === "phone" || obj.contactMethod === "both")
  );
  
  if (!basicValid) return false;
  
  // 電話番号が必要な場合のチェック
  if (obj.contactMethod === "phone" || obj.contactMethod === "both") {
    return obj.phone !== undefined && isValidPhoneNumber(obj.phone);
  }
  
  return true;
}

// アサーション関数
function assertIsUserRegistrationForm(value: unknown): asserts value is UserRegistrationForm {
  if (!isUserRegistrationForm(value)) {
    throw new ValidationError("無効なユーザー登録フォームです");
  }
  
  const form = value as UserRegistrationForm;
  if (form.password !== form.confirmPassword) {
    throw new ValidationError("パスワードが一致しません", "confirmPassword");
  }
  
  if (!form.agreeToTerms) {
    throw new ValidationError("利用規約に同意してください", "agreeToTerms");
  }
}

function assertIsContactForm(value: unknown): asserts value is ContactForm {
  if (!isContactForm(value)) {
    throw new ValidationError("無効なお問い合わせフォームです");
  }
}

// フォーム処理システム
interface FormProcessingResult<T> {
  success: boolean;
  data?: T;
  errors: ValidationError[];
}

class FormProcessor {
  static processUserRegistration(formData: unknown): FormProcessingResult<UserRegistrationForm> {
    try {
      assertIsUserRegistrationForm(formData);
      return {
        success: true,
        data: formData,
        errors: []
      };
    } catch (error) {
      if (error instanceof ValidationError) {
        return {
          success: false,
          errors: [error]
        };
      }
      return {
        success: false,
        errors: [new ValidationError("予期しないエラーが発生しました")]
      };
    }
  }

  static processContactForm(formData: unknown): FormProcessingResult<ContactForm> {
    try {
      assertIsContactForm(formData);
      return {
        success: true,
        data: formData,
        errors: []
      };
    } catch (error) {
      if (error instanceof ValidationError) {
        return {
          success: false,
          errors: [error]
        };
      }
      return {
        success: false,
        errors: [new ValidationError("予期しないエラーが発生しました")]
      };
    }
  }
}

// テスト実行
function runTests(): void {
  console.log("=== フォーム処理システムのテスト ===");

  // 有効なユーザー登録フォーム
  const validUserForm = {
    name: "田中太郎",
    email: "tanaka@example.com",
    password: "SecurePass123",
    confirmPassword: "SecurePass123",
    age: 25,
    role: "user",
    agreeToTerms: true
  };

  const result1 = FormProcessor.processUserRegistration(validUserForm);
  console.log("ユーザー登録結果:", result1.success ? "成功" : "失敗");

  // 有効なお問い合わせフォーム
  const validContactForm = {
    name: "佐藤花子",
    email: "sato@example.com",
    message: "お問い合わせ内容です。",
    contactMethod: "email"
  };

  const result2 = FormProcessor.processContactForm(validContactForm);
  console.log("お問い合わせ結果:", result2.success ? "成功" : "失敗");
}

runTests();
```

</details>

---

## 🚀 発展課題（任意）

基本課題が完了した方は、以下の発展課題にも挑戦してみてください：

1. **バリデーションルールの拡張**
   - パスワード強度の詳細チェック
   - 名前の文字種制限
   - メッセージの最大文字数制限

2. **エラーメッセージの国際化**
   - 英語・日本語対応
   - エラーコードの導入

3. **非同期バリデーション**
   - メールアドレスの重複チェック（模擬）
   - 外部APIとの連携（模擬）

---

**🎉 お疲れ様でした！** Step04を通じて型ガード技術の実践的な活用方法を身につけることができました。

**🚀 次のStep05では、ジェネリクスを学習し、より柔軟で再利用可能な型システムを構築します！**