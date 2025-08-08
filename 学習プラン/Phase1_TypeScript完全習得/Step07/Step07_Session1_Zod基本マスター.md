# Session1: Zod 基本マスター（45 分）

> 💡 **対象**: Step01-06 完了者（ジェネリクス・ユーティリティ型習得済み）
> 🎯 **形式**: 講師サポート付き学習
> ⏰ **時間**: 45 分（実習中心）



## 📅 セッション概要

**学習目標**:

- [ ] Zod の基本概念と実行時型安全性の理解
- [ ] 基本的なスキーマ定義とバリデーション実行
- [ ] オブジェクト・配列スキーマの作成
- [ ] エラーハンドリングと型推論（z.infer）の活用

**前提知識**:

- Step01-06 の内容（基本型、インターフェース、ユニオン型、型ガード、ジェネリクス、ユーティリティ型）
- TypeScript の型システムの実践的理解
- 基本的な Web アプリケーション開発の知識

---

## ⏰ 詳細タイムテーブル

| 時間         | 内容                       | 講師の役割           | 学習者の活動   | 成果物     |
| ------------ | -------------------------- | -------------------- | -------------- | ---------- |
| **0-5 分**   | 概要・目標設定             | 簡潔な説明           | 聞く・質問     | 理解確認   |
| **5-20 分**  | 基本スキーマ実習           | 実演・個別サポート   | ハンズオン     | 基本スキーマ |
| **20-35 分** | オブジェクト・配列実習     | 個別サポート         | コーディング実習 | 複合スキーマ |
| **35-40 分** | 練習問題                   | 巡回サポート         | 個人作業       | 練習成果   |
| **40-45 分** | 振り返り・次回予告         | まとめ・予告         | 質問・確認     | 学習計画   |



---

## 📚 学習内容

### Section 1: Zod の基本概念

> 📚 **関連資料**: [専門用語集 - Zod 基本概念](./Step07_補足_専門用語集.md#Zod基本概念) | [実践コード例 - スキーマ基礎](./Step07_補足_実践コード例.md#スキーマ基礎)

#### 🔍 「スキーマ」って何？

**💡 身近な例で理解しよう**

コンビニでバイトの面接を受ける時を想像してください：

📝 **面接シート**
- 名前：田中太郎 ✅（文字で書けている）
- 年齢：25 ✅（数字で書けている）  
- 電話番号：090-1234-5678 ✅（正しい形式）

📝 **もしこんな書き方だったら？**
- 名前：123 ❌（数字で名前？）
- 年齢：二十五歳 ❌（計算できない）
- 電話番号：でんわばんごう ❌（電話できない）

この「正しい書き方のルール」が**スキーマ**です。

**💡 プログラムでも同じ問題が起きる**

```typescript
// ユーザー情報を受け取る関数
function calculateAge(user) {
  return user.age + 1; // 来年の年齢を計算
}

// 正常なデータ
const goodUser = { name: "太郎", age: 25 };
console.log(calculateAge(goodUser)); // 26 ✅

// おかしなデータが来たら？
const badUser = { name: "太郎", age: "二十五歳" };
console.log(calculateAge(badUser)); // "二十五歳1" ❌
```

**✅ Zodで「データのルール」をチェック**

```typescript
import { z } from "zod";

// ルール（スキーマ）を定義
const UserSchema = z.object({
  name: z.string(), // 名前は文字列
  age: z.number(),  // 年齢は数値
});

// データをチェック
const result = UserSchema.safeParse(badUser);
if (result.success) {
  console.log("安全に使える:", result.data);
} else {
  console.log("データがおかしい:", result.error.errors);
}
```

#### 1. 環境セットアップ

**🎓 学習のポイント**: まずは最小限のセットアップで Zod の基本動作を理解しましょう

```bash
# Zodのインストール
npm install zod

# TypeScript環境のセットアップ（まだの場合）
npm install -D typescript @types/node
```

**🔍 最初のスキーマを作成してみよう**

```typescript
// 基本的なインポート
import { z } from "zod";

// 🎯 スキーマ = データの設計図を作成
const UserSchema = z.object({
  name: z.string(), // 「名前は文字列でなければならない」というルール
  age: z.number(),  // 「年齢は数値でなければならない」というルール
});

// 💡 スキーマから型を自動生成（これがZodの便利なところ！）
type User = z.infer<typeof UserSchema>;
// 結果: { name: string; age: number; }

// 📝 スキーマを使ってデータをチェックしてみよう
console.log("=== スキーマでデータをチェック ===");

// ✅ 設計図通りのデータ → OK
const correctData = { name: "太郎", age: 25 };
const result1 = UserSchema.safeParse(correctData);
console.log("正しいデータ:", result1.success); // true

// ❌ 設計図と違うデータ → エラー
const wrongData = { name: "太郎", age: "25歳" }; // 年齢が文字列！
const result2 = UserSchema.safeParse(wrongData);
console.log("間違ったデータ:", result2.success); // false

if (!result2.success) {
  console.log("何が間違っているか:", result2.error.errors);
  // → "age"は数値である必要があります、というエラーが出る
}
```

**🎓 理解度チェック**

- スキーマとは「データの設計図」だということは理解できましたか？
- `z.object()` でオブジェクトの設計図を作れることは分かりますか？
- `safeParse()` でデータが設計図通りかチェックできることは理解できましたか？

**🎓 理解度チェック**

- `z.infer<typeof UserSchema>` が何をしているか説明できますか？
- なぜ `safeParse()` を使うのか理解していますか？
- TypeScript の型チェックと Zod のバリデーションの違いは何でしょうか？

#### 2. 基本的なスキーマ定義

**🎓 学習のポイント**: 各データ型のスキーマ定義方法と、バリデーションの段階的理解

```typescript
import { z } from "zod";

// === STEP 1: プリミティブ型のスキーマ ===
console.log("=== プリミティブ型スキーマの動作確認 ===");

const stringSchema = z.string();
const numberSchema = z.number();
const booleanSchema = z.boolean();
const dateSchema = z.date();

// 🔍 実際に各スキーマを試してみよう
console.log("文字列スキーマ:", stringSchema.safeParse("こんにちは"));
console.log("数値スキーマ:", numberSchema.safeParse(123));
console.log("真偽値スキーマ:", booleanSchema.safeParse(true));
console.log("日付スキーマ:", dateSchema.safeParse(new Date()));

// ❌ 不正なデータも試してみよう
console.log("不正な文字列:", stringSchema.safeParse(123));
console.log("不正な数値:", numberSchema.safeParse("123"));

// === STEP 2: バリデーションルールの追加 ===
console.log("=== バリデーションルール付きスキーマ ===");

// 🎯 重要：メッセージをカスタマイズしよう
const emailSchema = z.string().email("有効なメールアドレスを入力してください");
const positiveNumberSchema = z.number().positive("正の数を入力してください");
const lengthConstrainedString = z
  .string()
  .min(3, "3文字以上で入力してください")
  .max(20, "20文字以内で入力してください");

// 📝 実際に動作を確認
console.log("メールバリデーション:");
console.log("✅ 正常:", emailSchema.safeParse("user@example.com"));
console.log("❌ 不正:", emailSchema.safeParse("invalid-email"));

console.log("数値バリデーション:");
console.log("✅ 正常:", positiveNumberSchema.safeParse(10));
console.log("❌ 不正:", positiveNumberSchema.safeParse(-5));

console.log("文字列長バリデーション:");
console.log("✅ 正常:", lengthConstrainedString.safeParse("Hello"));
console.log("❌ 短すぎ:", lengthConstrainedString.safeParse("Hi"));
console.log(
  "❌ 長すぎ:",
  lengthConstrainedString.safeParse("This is way too long string")
);

// === STEP 3: オプショナルとnullable ===
console.log("=== オプショナル・nullable の理解 ===");

const optionalString = z.string().optional(); // string | undefined
const nullableString = z.string().nullable(); // string | null
const optionalNullableString = z.string().optional().nullable(); // string | null | undefined

// 🔍 それぞれの動作を確認
console.log("オプショナル:", optionalString.safeParse(undefined));
console.log("nullable:", nullableString.safeParse(null));
console.log("オプショナル+nullable:", optionalNullableString.safeParse(null));
```

**🎓 段階的理解のための演習**

```typescript
// 演習1: 以下のスキーマがどんなデータを受け入れるか予想してみよう
const mysterySchema1 = z.string().min(5).max(10).optional();
const mysterySchema2 = z.number().int().positive().nullable();

// 演習2: 以下のデータがバリデーションを通るかどうか予想してみよう
const testData = [
  "Hello", // mysterySchema1 で試す
  "Hi", // mysterySchema1 で試す
  undefined, // mysterySchema1 で試す
  5.5, // mysterySchema2 で試す
  -3, // mysterySchema2 で試す
  null, // mysterySchema2 で試す
];

// 実際に確認してみよう
console.log("=== 演習の答え合わせ ===");
testData.forEach((data, index) => {
  if (index < 3) {
    console.log(
      `Data ${index}: ${data} ->`,
      mysterySchema1.safeParse(data).success
    );
  } else {
    console.log(
      `Data ${index}: ${data} ->`,
      mysterySchema2.safeParse(data).success
    );
  }
});
```

**🎓 理解度チェック**

- `.min()`, `.max()`, `.positive()` などのメソッドチェーンの仕組みは理解できましたか？
- `optional()` と `nullable()` の違いを具体例で説明できますか？
- カスタムエラーメッセージの重要性は理解できましたか？

### Section 2: オブジェクトスキーマの定義

#### 🔍 基本的なオブジェクトスキーマ

**🎓 学習のポイント**: オブジェクトスキーマの構築方法と、複雑なデータ構造の段階的理解

```typescript
// === STEP 1: 基本的なオブジェクトスキーマの作成 ===
console.log("=== 基本オブジェクトスキーマ ===");

const UserSchema = z.object({
  id: z.string().uuid(), // UUID形式の文字列
  name: z.string().min(1), // 空でない文字列
  email: z.string().email(), // メール形式の文字列
  age: z.number().int().positive(), // 正の整数
  isActive: z.boolean(), // 真偽値
});

// 🎯 重要：型の自動生成を確認
type User = z.infer<typeof UserSchema>;
/*
生成される型:
type User = {
  id: string;
  name: string;
  email: string;
  age: number;
  isActive: boolean;
}
*/

// 📝 実際にバリデーションを試してみよう
const validUser = {
  id: "123e4567-e89b-12d3-a456-426614174000",
  name: "田中太郎",
  email: "tanaka@example.com",
  age: 28,
  isActive: true,
};

const invalidUser = {
  id: "invalid-uuid", // UUID形式でない
  name: "", // 空文字
  email: "invalid-email", // メール形式でない
  age: -5, // 負の数
  isActive: "true", // 文字列（真偽値でない）
};

console.log("✅ 正常なユーザー:", UserSchema.safeParse(validUser));
console.log("❌ 不正なユーザー:", UserSchema.safeParse(invalidUser));

// === STEP 2: 配列と列挙型の基本 ===
console.log("=== 配列と列挙型スキーマ ===");

// 配列スキーマ
const TagsSchema = z.array(z.string()); // 文字列の配列
console.log("タグ配列:", TagsSchema.safeParse(["TypeScript", "Zod"]));

// 列挙型スキーマ
const StatusSchema = z.enum(["draft", "published", "archived"]);
console.log("ステータス:", StatusSchema.safeParse("published"));

// 組み合わせ例
const SimplePostSchema = z.object({
  title: z.string().min(1),
  status: StatusSchema,
  tags: TagsSchema,
});

const postData = {
  title: "Zodの使い方",
  status: "draft",
  tags: ["TypeScript", "バリデーション"],
};

console.log("投稿データ:", SimplePostSchema.safeParse(postData));
```

**🎓 段階的理解のための演習**

```typescript
// 演習1: 以下のデータ構造に適したスキーマを作成してみよう
const sampleData = {
  company: {
    name: "株式会社例",
    employees: [
      { name: "田中", department: "開発" },
      { name: "佐藤", department: "営業" },
    ],
  },
  founded: new Date("2020-01-01"),
  isPublic: false,
};

// 演習2: このスキーマを自分で作成してみよう
const CompanySchema = z.object({
  // ここに実装してみよう
});

// 演習3: 作成したスキーマの型を確認してみよう
type Company = z.infer<typeof CompanySchema>;
```

**🎓 理解度チェック**

- オブジェクトのネストが深くなった場合の対処法は理解できましたか？
- `z.array()` と配列要素のバリデーションの関係は理解できましたか？
- `z.enum()` と `z.union()` + `z.literal()` の違いは分かりますか？
- 複雑なデータ構造を段階的に構築する方法は身についていますか？

### Section 3: エラーハンドリングと型推論

#### 🔍 バリデーション実行の詳細

```typescript
import { z } from "zod";

const UserSchema = z.object({
  name: z.string(),
  age: z.number(),
});

// parse() - エラー時に例外をスロー
try {
  const user = UserSchema.parse({ name: "太郎", age: 25 });
  console.log("パース成功:", user);
} catch (error) {
  console.error("パースエラー:", error);
}

// safeParse() - エラー情報を含むResultオブジェクトを返す（推奨）
const result = UserSchema.safeParse({ name: "太郎", age: "25歳" });

if (result.success) {
  // 成功時の処理
  console.log("有効なデータ:", result.data);
  // result.data の型は { name: string; age: number; }
} else {
  // エラー時の処理
  console.log("バリデーションエラー:");
  result.error.errors.forEach((err) => {
    console.log(`- ${err.path.join(".")}: ${err.message}`);
  });
}
```

#### 🔍 カスタムエラーメッセージ

```typescript
// 基本的なカスタムメッセージ
const UserSchema = z.object({
  name: z.string().min(1, "名前は必須です"),
  email: z.string().email("正しいメールアドレス形式で入力してください"),
  age: z
    .number({
      required_error: "年齢は必須です",
      invalid_type_error: "年齢は数値で入力してください",
    })
    .int("年齢は整数で入力してください")
    .min(0, "年齢は0以上で入力してください")
    .max(120, "年齢は120以下で入力してください"),
});

// 日本語対応のエラーハンドリング関数
function formatZodError(error: z.ZodError): Record<string, string[]> {
  const fieldErrors: Record<string, string[]> = {};

  error.errors.forEach((err) => {
    const fieldName = err.path.join(".");
    if (!fieldErrors[fieldName]) {
      fieldErrors[fieldName] = [];
    }
    fieldErrors[fieldName].push(err.message);
  });

  return fieldErrors;
}
```

#### 🔍 型推論（z.infer）の活用

```typescript
// 基本的な型推論
const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  age: z.number(),
  isActive: z.boolean(),
});

// スキーマから型を自動生成
type User = z.infer<typeof UserSchema>;
/*
type User = {
  id: string;
  name: string;
  age: number;
  isActive: boolean;
}
*/

// 実用的な使用例
const SimpleUserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
});

type SimpleUser = z.infer<typeof SimpleUserSchema>;

// 基本的な使用例
function processUser(data: unknown): SimpleUser {
  // バリデーション
  const validatedData = SimpleUserSchema.parse(data);
  return validatedData;
}
```



---

## 🎯 練習問題（5分）

**🎓 学習目標**: 学んだ内容の確実な定着

以下の要件に基づいて、シンプルなスキーマを作成してください：

```typescript
// 問題: 商品情報のスキーマ
// 要件:
// - name: 文字列、1文字以上
// - price: 数値、0以上
// - category: "electronics" | "books" | "clothing" のいずれか
// - tags: 文字列の配列（任意）
// - inStock: 真偽値

const ProductSchema = z.object({
  // ここに実装してみよう
  name: z.string().min(1, "商品名は必須です"),
  price: z.number().min(0, "価格は0以上である必要があります"),
  category: z.enum(["electronics", "books", "clothing"]),
  tags: z.array(z.string()).optional(),
  inStock: z.boolean()
});

// 型の生成
type Product = z.infer<typeof ProductSchema>;

// テストデータ
const testProduct = {
  name: "TypeScript入門書",
  price: 2500,
  category: "books",
  tags: ["プログラミング", "TypeScript"],
  inStock: true
};

console.log("商品データ:", ProductSchema.safeParse(testProduct));

// 🎓 確認ポイント：
// - スキーマが正しく動作するか
// - 型推論が期待通りに働くか
// - エラーメッセージが適切か
```

---

## 👨‍🏫 学習ポイント

### 🔄 復習のための確認項目

**基本概念の理解**

- [ ] Zod の役割と TypeScript との関係は理解できましたか？
- [ ] `z.infer<typeof Schema>` による型推論の仕組みは分かりますか？
- [ ] `safeParse()` と `parse()` の使い分けは理解できましたか？

**スキーマ設計**

- [ ] プリミティブ型から複雑なオブジェクトまで段階的に構築できますか？
- [ ] 適切なバリデーションルールの選択ができますか？
- [ ] ユーザーフレンドリーなエラーメッセージが書けますか？

**実践的スキル**

- [ ] 実際のフォームや API 仕様をスキーマに落とし込めますか？
- [ ] カスタムバリデーションのビジネスロジックが実装できますか？
- [ ] エラーハンドリングが適切に行えますか？

---

## 👨‍🏫 学習ポイント

### 🤔 よくある質問

**Q: TypeScript の型と Zod スキーマの使い分けは？**
A: TypeScript の型はコンパイル時の静的型チェック、Zod スキーマは実行時の動的バリデーションです。外部からのデータ（API、フォーム入力）には Zod を使い、内部処理には TypeScript の型を使います。

**Q: エラーハンドリングは parse()と safeParse()のどちらを使うべき？**
A: 一般的には safeParse()を推奨します。例外をスローしないため、より予測可能なエラーハンドリングが可能です。

**Q: カスタムバリデーションが複雑になった場合は？**
A: superRefine()を使うか、バリデーション関数を分割することを検討しましょう。複雑な業務ルールは専用の関数に切り出すと保守しやすくなります。

---

**📌 重要**: Session1 は Zod の基礎理論です。しっかりと理解してから次の Session2 に進みましょう。

**🌟 次回（Session2）は、より高度なバリデーション技法と API との統合を学習します！**

---

## 📋 Session1 完了チェックリスト（45分版）

学習を完了する前に、以下の項目をすべてチェックしてください：

### 💡 基本概念理解

- [ ] Zod の役割と実行時型安全性の重要性を説明できる
- [ ] TypeScript の静的型チェックと Zod の動的バリデーションの違いを理解している
- [ ] `z.infer<typeof Schema>` による型推論の仕組みを理解している

### 💻 実装スキル

- [ ] 基本的なプリミティブ型スキーマを作成できる
- [ ] オブジェクトスキーマとネストした構造を定義できる
- [ ] 配列と列挙型のスキーマを実装できる
- [ ] カスタムエラーメッセージを設定できる

### 🔧 実践能力

- [ ] `safeParse()` を使ったエラーハンドリングができる
- [ ] 基本的なバリデーションルールを組み合わせることができる
- [ ] 実際のデータ構造をスキーマに落とし込める

### 🧪 動作確認

- [ ] 提供されたコード例を実際に動かして結果を確認した
- [ ] 練習問題を解答し、動作確認を行った
- [ ] エラーケースとノーマルケースの両方をテストした

### 📚 知識の定着

- [ ] Zod の基本的な利点を説明できる
- [ ] 次のステップ（Session2）で学ぶ内容を理解している

**🎉 すべてチェックできましたか？** それでは Session2 でお会いしましょう！

**⚠️ チェックできない項目がある場合**: 該当する学習内容を再度確認し、不明点は講師に質問しましょう。
