# Session1: 型ガード基礎（40分）

> 💡 **対象**: 他言語経験者（TypeScript基本型・インターフェース・ユニオン型知識あり）
> 🎯 **形式**: 講師サポート付き学習
> ⏰ **時間**: 40分（休憩含む）

## 📚 関連補足資料

このセッションの学習をサポートする補足資料をご用意しています：

- 📖 **[専門用語集](./Step04_補足_専門用語集.md)** - 型ガード関連の重要な概念と用語の詳細解説
- 💻 **[実践コード例](./Step04_補足_実践コード例.md)** - 段階的な学習のためのコード例集
- 🔧 **[開発環境ガイド](./Step04_補足_開発環境ガイド.md)** - 効率的な開発環境の活用
- 🌐 **[参考リソース](./Step04_補足_参考リソース.md)** - 学習に役立つリンク集とリソース
- 🚨 **[トラブルシューティング](./Step04_補足_トラブルシューティング.md)** - よくあるエラーと解決方法

> 💡 **活用方法**: 学習中に疑問が生じた際や、より深く理解したい場合に参照してね 🐰

## 📅 セッション概要

**学習目標**:

- [ ] 基本型ガード（typeof, instanceof, in演算子）の理解と実装
- [ ] フォーム入力値の基本検証パターンの習得
- [ ] 型ガードによる型安全性の確保
- [ ] 実践的な型ガードの活用方法の理解

**前提知識**:

- Step01: JavaScript基礎、TypeScript基本型注釈
- Step02: 基本型システム、型推論、型エイリアス
- Step03: インターフェース、オプショナルプロパティ、継承
- ユニオン型の基本概念（前提知識として）

---

## ⏰ 詳細タイムテーブル

| 時間         | 内容                           | 講師の役割         | 学習者の活動   | 成果物     |
| ------------ | ------------------------------ | ------------------ | -------------- | ---------- |
| **0-5分**    | 前提知識確認・今回目標         | 復習確認・目標提示 | 振り返り・質問 | 理解確認   |
| **5-20分**   | 基本型ガード理論と実装         | 実演・解説         | 理解・メモ     | 基本知識   |
| **20-35分**  | フォーム入力値検証実践         | 個別サポート       | ハンズオン     | 実践コード |
| **35-40分**  | 振り返り・次回予告             | まとめ・予告       | 質問・確認     | 学習計画   |

---

## 📚 学習内容

### Section 1: 前提知識確認（要点のみ）

#### 🔍 ユニオン型の簡単な復習

**基本的なユニオン型**

```typescript
// Step02-03で学習した基本概念
type StringOrNumber = string | number;
type UserStatus = "active" | "inactive" | "pending";

interface User {
  id: number;
  name: string;
  status: UserStatus;
}

// ユニオン型の課題：共通プロパティのみアクセス可能
function processValue(value: StringOrNumber): string {
  // return value.toUpperCase(); // Error: numberにはtoUpperCase()がない
  return value.toString(); // OK: 両方の型に存在
}
```

**💡 今日学ぶ型ガードとの関係**

型ガードは、ユニオン型の値を安全に扱うための仕組みです。ランタイムでの型チェックを通じて、TypeScriptに「この分岐内では特定の型である」ことを教えることができます。

---

### Section 2: 基本型ガードの理論と実装

> 📚 **関連資料**: [専門用語集 - 型ガード](./Step04_補足_専門用語集.md#型ガード) | [実践コード例 - 基本型ガード](./Step04_補足_実践コード例.md#基本型ガード)

#### 🎯 型ガードとは何か

**💡 なぜ型ガードが重要なのか**

型ガードは、ランタイムでの型チェックを通じて、TypeScriptの型システムに実際の値の型を「教える」仕組みです。これにより、以下のメリットがあります：

- **型安全性の向上**: 実行時エラーの予防
- **コードの可読性**: 型が明確になることで理解しやすい
- **開発効率**: IDEの補完機能が正確に動作
- **保守性**: 型変更時の影響範囲が明確

#### 1. typeof型ガード

```typescript
// 基本的なtypeof型ガード
function processStringOrNumber(value: string | number): string {
  if (typeof value === "string") {
    // この分岐内ではvalueはstring型
    return value.toUpperCase(); // OK: stringのメソッドが使える
  } else {
    // この分岐内ではvalueはnumber型
    return value.toFixed(2); // OK: numberのメソッドが使える
  }
}

// 実際のフォーム処理での活用例
function validateFormInput(input: unknown): string | null {
  // まず基本的な型チェック
  if (typeof input !== "string") {
    return "入力値は文字列である必要があります";
  }

  // この時点でinputはstring型として扱われる
  if (input.trim().length === 0) {
    return "入力値は空にできません";
  }

  if (input.length > 100) {
    return "入力値は100文字以内にしてください";
  }

  return null; // バリデーション成功
}

// 使用例
const userInput: unknown = "Hello World";
const validationResult = validateFormInput(userInput);
if (validationResult === null) {
  console.log("入力値は有効です");
} else {
  console.log(`エラー: ${validationResult}`);
}
```

**📝 実装の詳細解説**

- `typeof`演算子はJavaScriptのランタイム型チェック
- TypeScriptは型ガードの結果を理解し、分岐内で型を絞り込む
- プリミティブ型（string, number, boolean, undefined）の判定に最適

#### 2. instanceof型ガード

```typescript
// DOM要素の型ガード
function handleElement(element: Element): void {
  if (element instanceof HTMLInputElement) {
    // この分岐内ではelementはHTMLInputElement型
    console.log(`入力値: ${element.value}`);
    element.focus(); // HTMLInputElementのメソッドが使える
  } else if (element instanceof HTMLButtonElement) {
    // この分岐内ではelementはHTMLButtonElement型
    console.log(`ボタンテキスト: ${element.textContent}`);
    element.click(); // HTMLButtonElementのメソッドが使える
  } else {
    console.log("未対応の要素タイプです");
  }
}

// エラーオブジェクトの型ガード
function handleError(error: unknown): string {
  if (error instanceof Error) {
    // この分岐内ではerrorはError型
    return `エラー: ${error.message}`;
  } else if (typeof error === "string") {
    return `エラー: ${error}`;
  } else {
    return "不明なエラーが発生しました";
  }
}

// 実際のフォーム処理での活用
function setupFormValidation(form: HTMLFormElement): void {
  const inputs = form.querySelectorAll("input, select, textarea");
  
  inputs.forEach(input => {
    if (input instanceof HTMLInputElement) {
      input.addEventListener("blur", () => {
        const result = validateFormInput(input.value);
        if (result !== null) {
          console.log(`入力エラー: ${result}`);
        }
      });
    } else if (input instanceof HTMLSelectElement) {
      input.addEventListener("change", () => {
        console.log(`選択値: ${input.value}`);
      });
    } else if (input instanceof HTMLTextAreaElement) {
      input.addEventListener("blur", () => {
        console.log(`テキストエリア: ${input.value}`);
      });
    }
  });
}
```

#### 3. in演算子型ガード

```typescript
// オブジェクトのプロパティ存在チェック
interface EmailContact {
  id: number;
  name: string;
  email: string;
}

interface PhoneContact {
  id: number;
  name: string;
  phone: string;
}

type Contact = EmailContact | PhoneContact;

function contactUser(contact: Contact): string {
  if ("email" in contact) {
    // この分岐内ではcontactはEmailContact型
    return `メール送信: ${contact.email}`;
  } else {
    // この分岐内ではcontactはPhoneContact型
    return `電話発信: ${contact.phone}`;
  }
}

// フォームデータの処理
function processFormData(data: unknown): string {
  // まずオブジェクトかどうかチェック
  if (typeof data !== "object" || data === null) {
    return "無効なデータ形式です";
  }

  // プロパティの存在チェック
  if ("email" in data && typeof (data as any).email === "string") {
    return `メールアドレス: ${(data as any).email}`;
  } else if ("phone" in data && typeof (data as any).phone === "string") {
    return `電話番号: ${(data as any).phone}`;
  } else {
    return "必要な情報が不足しています";
  }
}
```

---

### Section 3: フォーム入力値検証実践

> 📚 **関連資料**: [実践コード例 - フォーム検証](./Step04_補足_実践コード例.md#フォーム検証) | [トラブルシューティング - 型ガードエラー](./Step04_補足_トラブルシューティング.md#型ガードエラー)

#### 🔧 実践的なフォーム検証システム

**💡 実際の開発でよく使われるパターン**

フォーム処理は、型ガードが最も活用される場面の一つです。ユーザーからの入力は常に`unknown`型として扱い、段階的に型を絞り込んでいきます。

#### 1. 基本的な入力値検証

```typescript
// 基本的な型ガード関数群
function isString(value: unknown): value is string {
  return typeof value === "string";
}

function isNumber(value: unknown): value is number {
  return typeof value === "number";
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

// フォーム入力値の検証
function validateName(input: unknown): string | null {
  if (!isNonEmptyString(input)) {
    return "名前は必須です";
  }

  if (input.length > 50) {
    return "名前は50文字以内で入力してください";
  }

  return null;
}

function validateAge(input: unknown): string | null {
  // 文字列から数値への変換も考慮
  let age: number;
  
  if (typeof input === "string") {
    const parsed = parseInt(input, 10);
    if (isNaN(parsed)) {
      return "年齢は数値で入力してください";
    }
    age = parsed;
  } else if (typeof input === "number") {
    age = input;
  } else {
    return "年齢は数値で入力してください";
  }

  if (age < 0 || age > 150) {
    return "年齢は0-150の範囲で入力してください";
  }

  return null;
}

function validateEmail(input: unknown): string | null {
  if (!isString(input)) {
    return "メールアドレスは文字列で入力してください";
  }

  if (input.trim().length === 0) {
    return "メールアドレスは必須です";
  }

  // 簡単なメールアドレス形式チェック
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(input)) {
    return "有効なメールアドレスを入力してください";
  }

  return null;
}
```

#### 2. 統合的なフォーム検証

```typescript
// フォームデータの型定義
interface UserFormData {
  name: string;
  age: number;
  email: string;
}

// フォーム全体の検証
function validateUserForm(formData: unknown): { isValid: boolean; errors: string[]; data?: UserFormData } {
  const errors: string[] = [];

  // まずオブジェクトかどうかチェック
  if (typeof formData !== "object" || formData === null) {
    return { isValid: false, errors: ["無効なフォームデータです"] };
  }

  const data = formData as any;

  // 各フィールドの検証
  const nameError = validateName(data.name);
  if (nameError) errors.push(nameError);

  const ageError = validateAge(data.age);
  if (ageError) errors.push(ageError);

  const emailError = validateEmail(data.email);
  if (emailError) errors.push(emailError);

  // 検証結果の返却
  if (errors.length === 0) {
    return {
      isValid: true,
      errors: [],
      data: {
        name: data.name,
        age: typeof data.age === "string" ? parseInt(data.age, 10) : data.age,
        email: data.email
      }
    };
  } else {
    return { isValid: false, errors };
  }
}

// 使用例
function handleFormSubmit(formData: unknown): void {
  const validation = validateUserForm(formData);
  
  if (validation.isValid && validation.data) {
    console.log("フォーム送信成功:", validation.data);
    // この時点でvalidation.dataはUserFormData型として扱われる
    console.log(`ユーザー名: ${validation.data.name}`);
    console.log(`年齢: ${validation.data.age}`);
    console.log(`メール: ${validation.data.email}`);
  } else {
    console.log("フォーム送信失敗:");
    validation.errors.forEach(error => console.log(`- ${error}`));
  }
}
```

---

## 🔧 練習問題

> 📚 **サポート資料**: [実践コード例 - 型ガードの練習](./Step04_補足_実践コード例.md#型ガードの練習) | [トラブルシューティング](./Step04_補足_トラブルシューティング.md#よくあるエラー)

### 練習問題 1.1: 基本的な型ガード 🔰

以下の要件を満たす型ガード関数を実装してください。

```typescript
// 要件1: 正の数かどうかを判定する型ガード
function isPositiveNumber(value: unknown): value is number {
  /* ここを実装 */
}

// 要件2: 空でない文字列かどうかを判定する型ガード
function isNonEmptyString(value: unknown): value is string {
  /* ここを実装 */
}

// 要件3: 以下の関数で上記の型ガードを使用
function processInput(input: unknown): string {
  // 正の数の場合は"数値: {値}"を返す
  // 空でない文字列の場合は"文字列: {値}"を返す
  // それ以外は"無効な入力"を返す
  /* ここを実装 */
}
```

### 練習問題 1.2: DOM要素の型ガード 🔰

```typescript
// 要件: DOM要素の型に応じて適切な処理を行う関数を実装
function handleFormElement(element: Element): string {
  // HTMLInputElement: "入力フィールド: {value}"
  // HTMLSelectElement: "選択フィールド: {value}"
  // HTMLTextAreaElement: "テキストエリア: {value}"
  // その他: "未対応の要素"
  /* ここを実装 */
}
```

### 練習問題 1.3: オブジェクトの型ガード 🔰

```typescript
interface Product {
  id: number;
  name: string;
  price: number;
}

// 要件: unknownな値がProduct型かどうかを判定する型ガード
function isProduct(value: unknown): value is Product {
  /* ここを実装 */
}

// 要件: Product型の配列かどうかを判定する型ガード
function isProductArray(value: unknown): value is Product[] {
  /* ここを実装 */
}
```

---

## 📝 解答例

### 練習問題 1.1 解答

```typescript
function isPositiveNumber(value: unknown): value is number {
  return typeof value === "number" && value > 0;
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function processInput(input: unknown): string {
  if (isPositiveNumber(input)) {
    return `数値: ${input}`;
  } else if (isNonEmptyString(input)) {
    return `文字列: ${input}`;
  } else {
    return "無効な入力";
  }
}
```

### 練習問題 1.2 解答

```typescript
function handleFormElement(element: Element): string {
  if (element instanceof HTMLInputElement) {
    return `入力フィールド: ${element.value}`;
  } else if (element instanceof HTMLSelectElement) {
    return `選択フィールド: ${element.value}`;
  } else if (element instanceof HTMLTextAreaElement) {
    return `テキストエリア: ${element.value}`;
  } else {
    return "未対応の要素";
  }
}
```

### 練習問題 1.3 解答

```typescript
function isProduct(value: unknown): value is Product {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    "name" in value &&
    "price" in value &&
    typeof (value as any).id === "number" &&
    typeof (value as any).name === "string" &&
    typeof (value as any).price === "number"
  );
}

function isProductArray(value: unknown): value is Product[] {
  return Array.isArray(value) && value.every(item => isProduct(item));
}
```

---

## 👨‍🏫 学習ポイント

### 🤔 よくある質問

**Q: 型ガードはいつ使うべきですか？**
A: 主に以下の場面で使用します：
- `unknown`型や`any`型の値を安全に扱いたい時
- ユニオン型の値を特定の型に絞り込みたい時
- 外部からのデータ（API、ユーザー入力）を検証したい時
- DOM操作で要素の型を確認したい時

**Q: typeof、instanceof、inの使い分けが分かりません。**
A: 以下のように使い分けます：
- `typeof`: プリミティブ型（string, number, boolean等）の判定
- `instanceof`: クラスのインスタンスやDOM要素の判定
- `in`: オブジェクトのプロパティ存在チェック

---

## 🎯 Session1 の成果確認

### 理解度チェック

- [ ] typeof型ガードを使ってプリミティブ型を判定できる
- [ ] instanceof型ガードを使ってオブジェクトの型を判定できる
- [ ] in演算子を使ってプロパティの存在をチェックできる
- [ ] フォーム入力値の基本的な検証ができる
- [ ] 型ガードを組み合わせて複雑な検証ができる

---

**📌 重要**: Session1では型ガードの基礎をしっかりと理解することが重要です。次のSession2では、これらの知識を基にユーザー定義型ガードを学習します。

**🌟 次回（Session2）は、より柔軟で再利用可能なユーザー定義型ガードの実装に挑戦します！**