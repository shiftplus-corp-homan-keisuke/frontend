# Step04: 型ガード完全習得

> 🚀 **2025年改良版**: 型ガード特化・40分セッション構成で効率的な学習を実現！

## 📋 学習方式の選択

### 🎯 推奨：3セッション分割学習（他言語経験者・講師サポート付き）

**対象**: 他言語経験者（TypeScript基本型・インターフェース・ユニオン型知識あり）
**形式**: 講師サポート付き学習
**総時間**: 120分（2時間）

#### 📚 セッション構成

- 🔰 **[Session1: 型ガード基礎](./Step04_Session1_型ガード基礎.md)** (40分)
  - 基本型ガード（typeof, instanceof, in演算子）の実装
  - フォーム入力値の基本検証実践
  - 型ガードの実践パターン習得

- 🔧 **[Session2: ユーザー定義型ガード](./Step04_Session2_ユーザー定義型ガード.md)** (40分)
  - カスタム型ガード関数（`value is Type`構文）
  - 複雑なオブジェクト検証とバリデーション
  - 型ガードの組み合わせパターン

- 🎯 **[Session3: アサーション関数](./Step04_Session3_アサーション関数.md)** (40分)
  - アサーション関数（`asserts`キーワード）の実装
  - エラーハンドリングパターン
  - 型安全なフォーム処理システム完成

#### 👨‍🏫 講師向けリソース

- 📖 **[講師用ガイド](./Step04_講師用ガイド.md)** - 詳細な指導方法・評価基準

---

### 📖 従来版：一括学習（自習・復習用）

**対象**: 自習者・復習者
**形式**: 個人学習
**総時間**: 2時間

#### 🎯 Step04 到達目標

- [ ] 基本型ガード（typeof, instanceof, in演算子）の実装
- [ ] ユーザー定義型ガード関数の作成
- [ ] アサーション関数を使ったエラーハンドリング
- [ ] 型安全なフォーム処理システムの構築

#### 💡 補足資料

詳細な解説は以下の補足資料をご参照ください：

- 📖 [専門用語集](./Step04_補足_専門用語集.md) - 型ガード・アサーション関数関連の重要概念
- 💻 [実践コード例](./Step04_補足_実践コード例.md) - 段階的な学習用コード集
- 🚨 [トラブルシューティング](./Step04_補足_トラブルシューティング.md) - よくあるエラーと解決方法
- 📚 [参考リソース](./Step04_補足_参考リソース.md) - 学習に役立つリンク集
- 📋 [補足資料](./Step04_補足資料.md) - その他の重要な補足情報

## 📅 学習期間・目標（従来版）

**期間**: Step04
**総学習時間**: 2時間
**学習スタイル**: 理論 30% + 実践コード 50% + 演習 20%

## 📚 理論学習内容

### Section 1: 型ガードの基礎理解

#### 🔍 型ガードの実践的価値

**💡 なぜ型ガードが重要なのか**

型ガードは、TypeScriptコンパイラがコンパイル時に認識できる特定のパターンを使って、値の型を絞り込む仕組みです。実行時にはJavaScriptコードとして値の性質をチェックし、コンパイラは事前にこれらのパターンを理解して条件分岐内で型を自動的に絞り込みます。これにより、`unknown`型やユニオン型の値を安全に扱い、実行時エラーを予防できます。特に、外部APIからのデータ、ユーザー入力、DOM操作において、型ガードは堅牢なアプリケーション構築の要となります。

**🎯 どういう場面で使うのか**

- **外部APIデータ検証**: サーバーから受け取ったデータの型確認
- **ユーザー入力検証**: フォーム入力値の型・形式チェック
- **DOM操作**: HTML要素の型確認と安全なアクセス
- **ファイル処理**: アップロードされたファイルの形式確認
- **設定値検証**: 環境変数や設定ファイルの値の検証

##### 1. typeof型ガードによるランタイムエラー予防

> 💡 **詳細解説**: typeof型ガードの詳細と実践的な活用パターンは [Step04_補足_専門用語集.md#typeof型ガード](./Step04_補足_専門用語集.md#typeof型ガード) を見てね 🐰

```typescript
function processStringOrNumber(value: string | number): string {
  if (typeof value === "string") {
    // この分岐内ではvalueはstring型
    return value.toUpperCase();
  } else {
    // この分岐内ではvalueはnumber型
    return value.toFixed(2);
  }
}

// 実際のユーザー入力検証での活用
function validateFormInput(input: unknown): string | null {
  if (typeof input !== "string") {
    return "入力値は文字列である必要があります";
  }

  if (input.trim().length === 0) {
    return "入力値は空にできません";
  }

  if (input.length > 100) {
    return "入力値は100文字以内にしてください";
  }

  return null; // バリデーション成功
}
```

**📝 実装の詳細解説**

- `typeof`演算子はJavaScriptの値の型を調べる演算子（実行時に動作）
- TypeScriptコンパイラは型ガードパターンを静的解析で認識し、分岐内で型を絞り込む
- プリミティブ型（string, number, boolean, undefined）の判定に最適

##### 2. instanceof型ガードによるDOM操作の安全性確保

```typescript
function handleElement(element: Element): void {
  if (element instanceof HTMLInputElement) {
    // この分岐内ではelementはHTMLInputElement型
    console.log(`入力値: ${element.value}`);
    element.focus();
  } else if (element instanceof HTMLButtonElement) {
    // この分岐内ではelementはHTMLButtonElement型
    console.log(`ボタンテキスト: ${element.textContent}`);
    element.click();
  } else {
    console.log("未対応の要素タイプです");
  }
}

// 実際のDOM操作での活用
function setupFormValidation(form: HTMLFormElement): void {
  const inputs = form.querySelectorAll("input, select, textarea");
  
  inputs.forEach(input => {
    if (input instanceof HTMLInputElement) {
      input.addEventListener("blur", () => validateInput(input.value));
    } else if (input instanceof HTMLSelectElement) {
      input.addEventListener("change", () => validateSelect(input.value));
    } else if (input instanceof HTMLTextAreaElement) {
      input.addEventListener("blur", () => validateTextArea(input.value));
    }
  });
}
```

##### 3. in演算子による型ガード

```typescript
interface EmailUser {
  id: number;
  name: string;
  email: string;
}

interface PhoneUser {
  id: number;
  name: string;
  phone: string;
}

type User = EmailUser | PhoneUser;

function contactUser(user: User): string {
  if ("email" in user) {
    // この分岐内ではuserはEmailUser型
    return `メール送信: ${user.email}`;
  } else {
    // この分岐内ではuserはPhoneUser型
    return `電話発信: ${user.phone}`;
  }
}

// 実際のフォーム処理での活用
function processFormData(data: unknown): string {
  if (typeof data === "object" && data !== null) {
    if ("email" in data && typeof (data as any).email === "string") {
      return `メールアドレス: ${(data as any).email}`;
    } else if ("phone" in data && typeof (data as any).phone === "string") {
      return `電話番号: ${(data as any).phone}`;
    }
  }
  return "不明なデータ形式です";
}
```

### Section 2: ユーザー定義型ガードの実装パターン

#### 🎯 カスタム型ガード関数の設計

**💡 なぜユーザー定義型ガードが重要なのか**

ユーザー定義型ガードは、複雑な型チェックロジックを再利用可能な関数として定義できる機能です。これにより、コードの可読性と保守性が向上し、一貫した型チェックを実現できます。

##### 1. 基本的なユーザー定義型ガード

```typescript
// 基本的な型ガード関数
function isString(value: unknown): value is string {
  return typeof value === "string";
}

function isNumber(value: unknown): value is number {
  return typeof value === "number";
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

// 使用例
function processUserInput(input: unknown): string {
  if (isNonEmptyString(input)) {
    return `処理対象: ${input}`;
  }
  return "無効な入力です";
}
```

##### 2. 複雑なオブジェクト型ガード

```typescript
interface UserProfile {
  id: number;
  name: string;
  email: string;
  age?: number;
}

function isUserProfile(value: unknown): value is UserProfile {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    "name" in value &&
    "email" in value &&
    typeof (value as any).id === "number" &&
    typeof (value as any).name === "string" &&
    typeof (value as any).email === "string" &&
    ((value as any).age === undefined || typeof (value as any).age === "number")
  );
}

// より堅牢なバリデーション
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidUserProfile(value: unknown): value is UserProfile {
  if (!isUserProfile(value)) {
    return false;
  }
  
  return (
    value.id > 0 &&
    value.name.trim().length > 0 &&
    isValidEmail(value.email) &&
    (value.age === undefined || (value.age >= 0 && value.age <= 150))
  );
}
```

##### 3. 配列型ガード

```typescript
function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every(item => typeof item === "string");
}

function isUserProfileArray(value: unknown): value is UserProfile[] {
  return Array.isArray(value) && value.every(item => isUserProfile(item));
}

// 使用例
function processUserList(data: unknown): string {
  if (isUserProfileArray(data)) {
    return `${data.length}人のユーザーを処理しました`;
  }
  return "無効なユーザーリストです";
}
```

### Section 3: アサーション関数の実装

#### 🔧 アサーション関数の基礎

**💡 なぜアサーション関数が重要なのか**

アサーション関数は、条件が満たされない場合にエラーを投げることで、その後のコードで型が保証されることをTypeScriptに伝える機能です。これにより、より安全で読みやすいコードを書くことができます。

##### 1. 基本的なアサーション関数

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

// 使用例
function processValue(input: unknown): string {
  assertIsString(input);
  // この時点でinputはstring型として扱われる
  return input.toUpperCase();
}
```

##### 2. 複雑なアサーション関数

```typescript
function assertIsUserProfile(value: unknown): asserts value is UserProfile {
  if (!isValidUserProfile(value)) {
    throw new Error("無効なユーザープロファイルです");
  }
}

function assertIsNonEmpty<T>(array: T[]): asserts array is [T, ...T[]] {
  if (array.length === 0) {
    throw new Error("配列は空にできません");
  }
}

// 使用例
function processUsers(data: unknown): string {
  assertIsUserProfileArray(data);
  assertIsNonEmpty(data);
  
  // この時点でdataは空でないUserProfile[]として扱われる
  const firstUser = data[0]; // エラーなし
  return `最初のユーザー: ${firstUser.name}`;
}
```

##### 3. フォーム処理でのアサーション関数

```typescript
interface FormData {
  name: string;
  email: string;
  age: number;
}

function assertIsValidFormData(value: unknown): asserts value is FormData {
  if (typeof value !== "object" || value === null) {
    throw new Error("フォームデータはオブジェクトである必要があります");
  }

  const data = value as any;

  if (!isNonEmptyString(data.name)) {
    throw new Error("名前は必須です");
  }

  if (!isNonEmptyString(data.email) || !isValidEmail(data.email)) {
    throw new Error("有効なメールアドレスが必要です");
  }

  if (!isNumber(data.age) || data.age < 0 || data.age > 150) {
    throw new Error("年齢は0-150の範囲で入力してください");
  }
}

// 使用例
function submitForm(formData: unknown): string {
  try {
    assertIsValidFormData(formData);
    // この時点でformDataはFormData型として扱われる
    return `フォーム送信成功: ${formData.name} (${formData.email})`;
  } catch (error) {
    return `フォーム送信失敗: ${error.message}`;
  }
}
```

---

## 🔧 練習問題

> 📚 **サポート資料**: [実践コード例 - 型ガードの練習](./Step04_補足_実践コード例.md#型ガードの練習) | [トラブルシューティング](./Step04_補足_トラブルシューティング.md#よくあるエラー)

### 練習問題 1: 基本的な型ガード

以下の要件を満たす型ガード関数を作成してください：

```typescript
// 要件1: 文字列かどうかを判定する型ガード
function isString(value: unknown): value is string {
  /* ここを実装 */
}

// 要件2: 正の数かどうかを判定する型ガード
function isPositiveNumber(value: unknown): value is number {
  /* ここを実装 */
}

// 要件3: 空でない文字列かどうかを判定する型ガード
function isNonEmptyString(value: unknown): value is string {
  /* ここを実装 */
}
```

### 練習問題 2: ユーザー定義型ガード

```typescript
interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
}

// 要件: Product型かどうかを判定する型ガード関数を実装
function isProduct(value: unknown): value is Product {
  /* ここを実装 */
}

// 要件: Product配列かどうかを判定する型ガード関数を実装
function isProductArray(value: unknown): value is Product[] {
  /* ここを実装 */
}
```

### 練習問題 3: アサーション関数

```typescript
// 要件: 値がnullまたはundefinedでないことをアサートする関数
function assertIsDefined<T>(value: T | null | undefined): asserts value is T {
  /* ここを実装 */
}

// 要件: 配列が空でないことをアサートする関数
function assertIsNonEmptyArray<T>(array: T[]): asserts array is [T, ...T[]] {
  /* ここを実装 */
}
```

---

## 📝 解答例

### 練習問題 1 解答

```typescript
function isString(value: unknown): value is string {
  return typeof value === "string";
}

function isPositiveNumber(value: unknown): value is number {
  return typeof value === "number" && value > 0;
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}
```

### 練習問題 2 解答

```typescript
function isProduct(value: unknown): value is Product {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    "name" in value &&
    "price" in value &&
    "category" in value &&
    typeof (value as any).id === "number" &&
    typeof (value as any).name === "string" &&
    typeof (value as any).price === "number" &&
    typeof (value as any).category === "string"
  );
}

function isProductArray(value: unknown): value is Product[] {
  return Array.isArray(value) && value.every(item => isProduct(item));
}
```

### 練習問題 3 解答

```typescript
function assertIsDefined<T>(value: T | null | undefined): asserts value is T {
  if (value === null || value === undefined) {
    throw new Error("値はnullまたはundefinedにできません");
  }
}

function assertIsNonEmptyArray<T>(array: T[]): asserts array is [T, ...T[]] {
  if (array.length === 0) {
    throw new Error("配列は空にできません");
  }
}
```

---

## 👨‍🏫 学習ポイント

### 🤔 よくある質問

**Q: 型ガードとアサーション関数の使い分けが難しいです。**
A: 型ガードは条件分岐で使用し、アサーション関数はエラーを投げることで型を保証します。型ガードは「もしかしたら違う型かもしれない」場合に、アサーション関数は「この型でなければエラー」という場合に使用します。

**Q: ユーザー定義型ガードが複雑になりがちです。**
A: 複雑な型ガードは小さな型ガード関数に分割し、それらを組み合わせることで可読性を向上させることができます。また、ライブラリ（zod、io-tsなど）の使用も検討してください。

---

## 🎯 Step04 の成果確認

### 理解度チェック

- [ ] typeof、instanceof、in演算子を使った基本型ガードを実装できる
- [ ] ユーザー定義型ガード関数（`value is Type`）を作成できる
- [ ] アサーション関数（`asserts`）を使ったエラーハンドリングができる
- [ ] 型安全なフォーム処理システムを構築できる
- [ ] 複雑なオブジェクトの型検証ができる

---

**📌 重要**: Step04は型ガードの実践的な活用に重点を置いています。理論だけでなく、実際のコードで型安全性を確保する技術を身につけましょう。

**🌟 次のStep05では、ジェネリクスを学習し、より柔軟で再利用可能な型システムを構築します！**