# Session1: 型ガード基礎（40 分）

> 💡 **対象**: 他言語経験者（TypeScript 基本型・インターフェース・ユニオン型知識あり）
> 🎯 **形式**: 講師サポート付き学習
> ⏰ **時間**: 40 分（休憩含む）

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

- [ ] 基本型ガード（typeof, instanceof, in 演算子）の理解と実装
- [ ] 型ガードによる型安全性の確保
- [ ] 実践的な型ガードの活用方法の理解

**前提知識**:

- Step01: JavaScript 基礎、TypeScript 基本型注釈
- Step02: 基本型システム、型推論、型エイリアス
- Step03: インターフェース、オプショナルプロパティ、継承
- ユニオン型の基本概念（前提知識として）

---

## ⏰ 詳細タイムテーブル

| 時間         | 内容                   | 講師の役割         | 学習者の活動   | 成果物     |
| ------------ | ---------------------- | ------------------ | -------------- | ---------- |
| **0-5 分**   | 前提知識確認・今回目標 | 復習確認・目標提示 | 振り返り・質問 | 理解確認   |
| **5-25 分**  | 基本型ガード理論と実装 | 実演・解説         | 理解・メモ     | 基本知識   |
| **25-35 分** | 練習問題               | 個別サポート       | 実装・質問     | 実装コード |
| **35-40 分** | 振り返り・次回予告     | まとめ・予告       | 質問・確認     | 学習計画   |

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

型ガードは、ユニオン型の値を安全に扱うための仕組みです。型チェックを通じて、TypeScript に「この分岐内では特定の型である」ことを教えることができます。

---

### Section 2: 基本型ガードの理論と実装

> 📚 **関連資料**: [専門用語集 - 型ガード](./Step04_補足_専門用語集.md#型ガード) | [実践コード例 - 基本型ガード](./Step04_補足_実践コード例.md#基本型ガード)

#### 🎯 型ガードとは何か

**💡 なぜ型ガードが重要なのか**

型ガードは型チェックを通じて、TypeScript の型システムに実際の値の型を「教える」仕組みです。これにより、以下のメリットがあります：

- **型安全性の向上**: 実行時エラーの予防
- **コードの可読性**: 型が明確になることで理解しやすい
- **開発効率**: IDE の補完機能が正確に動作
- **保守性**: 型変更時の影響範囲が明確

#### 1. typeof 型ガード

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

- `typeof`演算子は JavaScript のランタイム型チェック
- TypeScript は型ガードの結果を理解し、分岐内で型を絞り込む
- プリミティブ型（string, number, boolean, undefined）の判定に最適
- 戻り値の型は `"string" | "number" | "boolean" | "undefined" | "object" | "function" | "bigint" | "symbol"`

**💡 typeof 型ガードの活用シーン**

- ユーザー入力値の検証
- API レスポンスの型チェック
- 関数の引数が期待する型かどうかの確認
- 条件付きロジックの実装

#### 2. instanceof 型ガード

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
```

**📝 実装の詳細解説**

- `instanceof`演算子はオブジェクトが特定のクラスのインスタンスかどうかをチェック
- クラスベースのオブジェクトや DOM 要素の型判定に最適
- 継承関係も考慮される（子クラスのインスタンスは親クラスの`instanceof`チェックにも合格）

**💡 instanceof 型ガードの活用シーン**

- DOM 操作時の要素タイプの判定
- エラーハンドリング
- ポリモーフィックな振る舞いの実装
- ライブラリやフレームワークのコンポーネント判定

#### 3. in 演算子型ガード

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

**📝 実装の詳細解説**

- `in`演算子はオブジェクトに特定のプロパティが存在するかをチェック
- インターフェースやタイプエイリアスで定義された型の判別に最適
- 判別可能なユニオン型（Discriminated Unions）と組み合わせると強力

**💡 in 演算子型ガードの活用シーン**

- 異なるプロパティを持つオブジェクト型の判別
- オプショナルプロパティの存在確認
- API レスポンスの構造チェック
- 設定オブジェクトの検証

#### 4. 型ガードの組み合わせ

```typescript
// 複数の型ガードを組み合わせた例
function processValue(value: unknown): string {
  // まずプリミティブ型をチェック
  if (typeof value === "string") {
    return `文字列: ${value.toUpperCase()}`;
  } else if (typeof value === "number") {
    return `数値: ${value.toFixed(2)}`;
  } else if (typeof value === "boolean") {
    return `真偽値: ${value ? "真" : "偽"}`;
  }

  // 次にオブジェクト型をチェック
  if (value === null) {
    return "null値";
  } else if (typeof value === "object") {
    // 配列かどうかをチェック
    if (Array.isArray(value)) {
      return `配列: 要素数=${value.length}`;
    }

    // 特定のプロパティを持つオブジェクトかチェック
    if ("name" in value && typeof (value as any).name === "string") {
      return `名前付きオブジェクト: ${(value as any).name}`;
    }

    // クラスのインスタンスかチェック
    if (value instanceof Date) {
      return `日付: ${value.toISOString()}`;
    }

    return "その他のオブジェクト";
  }

  return "未対応の型";
}
```

**📝 実装の詳細解説**

- 複数の型ガードを組み合わせることで、より複雑な型チェックが可能
- 型チェックの順序が重要（一般的なものから具体的なものへ）
- 網羅的なチェックにより、型安全性が向上

---

## 🔧 練習問題

> 📚 **サポート資料**: [実践コード例 - 型ガードの練習](./Step04_補足_実践コード例.md#型ガードの練習) | [トラブルシューティング](./Step04_補足_トラブルシューティング.md#よくあるエラー)

### 練習問題 1.1: 基本的な型ガード 🔰

以下の要件を満たす型チェック関数を実装してください。

```typescript
// 要件1: 正の数かどうかを判定する関数
function validatePositiveNumber(value: unknown): boolean {
  /* ここを実装 */
}

// 要件2: 空でない文字列かどうかを判定する関数
function validateNonEmptyString(value: unknown): boolean {
  /* ここを実装 */
}

// 要件3: 以下の関数で上記の型チェック関数を使用
function processInput(input: unknown): string {
  // 正の数の場合は"数値: {値}"を返す
  // 空でない文字列の場合は"文字列: {値}"を返す
  // それ以外は"無効な入力"を返す
  /* ここを実装 */
}
```

### 練習問題 1.2: DOM 要素の型ガード 🔰

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

---

## 📝 解答例

### 練習問題 1.1 解答

```typescript
function validatePositiveNumber(value: unknown): boolean {
  return typeof value === "number" && value > 0;
}

function validateNonEmptyString(value: unknown): boolean {
  return typeof value === "string" && value.trim().length > 0;
}

function processInput(input: unknown): string {
  if (validatePositiveNumber(input)) {
    return `数値: ${input as number}`;
  } else if (validateNonEmptyString(input)) {
    return `文字列: ${input as string}`;
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

---

## 👨‍🏫 学習ポイント

### 🤔 よくある質問

**Q: 型ガードはいつ使うべきですか？**
A: 主に以下の場面で使用します：

- `unknown`型や`any`型の値を安全に扱いたい時
- ユニオン型の値を特定の型に絞り込みたい時
- 外部からのデータ（API、ユーザー入力）を検証したい時
- DOM 操作で要素の型を確認したい時

**Q: typeof、instanceof、in の使い分けが分かりません。**
A: 以下のように使い分けます：

- `typeof`: プリミティブ型（string, number, boolean 等）の判定
- `instanceof`: クラスのインスタンスや DOM 要素の判定
- `in`: オブジェクトのプロパティ存在チェック

**Q: 型ガードを使わずに型アサーション（as）を使うのはダメですか？**
A: 型アサーションは時に必要ですが、型ガードの方が安全です：

- 型ガード: 実行時に実際の型をチェックする（安全）
- 型アサーション: コンパイラに型を「教える」だけで、実行時チェックはない（危険）

---

## 🎯 Session1 の成果確認

### 理解度チェック

- [ ] typeof 型ガードを使ってプリミティブ型を判定できる
- [ ] instanceof 型ガードを使ってオブジェクトの型を判定できる
- [ ] in 演算子を使ってプロパティの存在をチェックできる
- [ ] 型ガードを組み合わせて複雑な検証ができる

---

**📌 重要**: Session1 では基本型ガード（typeof, instanceof, in 演算子）の基礎をしっかりと理解することが重要です。次の Session2 では、これらの基本型ガードを活用した「ユーザー定義型ガード」（value is Type 構文）について学習します。ユーザー定義型ガードを使うと、より再利用性が高く、型安全なコードを書くことができます。

**🌟 次回（Session2）は、より柔軟で再利用可能なユーザー定義型ガードの実装に挑戦します！**
