# Session2: 実践的スキーマ構築（45 分）

> 💡 **対象**: Session1 完了者（Zod 基本概念・スキーマ定義習得済み）
> 🎯 **形式**: 講師サポート付き実装演習
> ⏰ **時間**: 45 分（実習中心）



## 📅 セッション概要

**学習目標**:

- [ ] refine()を使ったカスタムバリデーション
- [ ] transform()を使ったデータ変換
- [ ] 実践的なスキーマ設計パターンの習得

**前提知識**:

- Session1 の内容（Zod 基本概念、基本スキーマ定義、エラーハンドリング）
- TypeScript の高度な型システム（ジェネリクス、ユーティリティ型）
- 非同期処理（Promise、async/await）の理解

---

## ⏰ 詳細タイムテーブル

| 時間         | 内容                     | 講師の役割           | 学習者の活動 | 成果物             |
| ------------ | ------------------------ | -------------------- | ------------ | ------------------ |
| **0-5 分**   | 前回復習・目標設定       | 簡潔な復習           | 理解・質問   | 理解確認           |
| **5-25 分**  | refine()カスタムバリデーション | 実演・個別サポート   | ハンズオン   | カスタムバリデーション |
| **25-40 分** | transform()データ変換実習 | 巡回サポート・ヒント | 個人作業     | データ変換実装     |
| **40-45 分** | 振り返り・次回予告       | まとめ・予告         | 質問・確認   | 学習計画           |

---

## 📚 学習内容

### Section 1: refine()を使ったカスタムバリデーション

**💡 カスタムバリデーションって何？**

Session1では基本的なスキーマ（データのルールブック）を学びました。コンビニバイトの面接シートで例えると、「名前は文字で書く」「年齢は数字で書く」という基本ルールでした。

しかし、実際のアプリケーションでは、もっと**細かい独自ルール**が必要になります：

📝 **より詳細なルール例**
- パスワード：「8文字以上で、大文字・小文字・数字を含む」
- 予約システム：「開始時間は終了時間より前である」
- 年齢制限：「18歳未満の場合は保護者の同意が必要」

これらの**独自ルール**を**カスタムバリデーション**と呼び、Zodでは`refine()`という機能で実現できます。

**💡 身近な例で理解しよう**

銀行口座開設の申込書を想像してください：

📝 **基本ルール（Session1で学んだ内容）**
- 名前：文字列 ✅
- 年齢：数値 ✅

📝 **独自ルール（今回学ぶカスタムバリデーション）**
- パスワード：「大文字・小文字・数字を含む8文字以上」
- 年齢：「18歳以上である」
- 連絡先：「平日9-17時に連絡可能である」

これらの複雑なルールを`refine()`で実装していきます。

**🎓 学習のポイント**: 基本的なrefine()から始めて、実践的なカスタムバリデーションを習得

```typescript
import { z } from "zod";

// === STEP 1: 基本的なrefine()の使用 ===
console.log("=== refine()の基本動作 ===");

// 偶数チェック
const EvenNumberSchema = z.number().refine((val) => val % 2 === 0, {
  message: "偶数を入力してください",
});

// パスワード強度チェック
const PasswordSchema = z
  .string()
  .min(8, "8文字以上で入力してください")
  .refine((val) => /[A-Z]/.test(val), "大文字を含めてください")
  .refine((val) => /[a-z]/.test(val), "小文字を含めてください")
  .refine((val) => /[0-9]/.test(val), "数字を含めてください");

// 📝 実際にテストしてみよう
console.log("偶数チェック:", EvenNumberSchema.safeParse(4));
console.log("奇数チェック:", EvenNumberSchema.safeParse(3));
console.log("強いパスワード:", PasswordSchema.safeParse("SecurePass123"));
console.log("弱いパスワード:", PasswordSchema.safeParse("weak"));

// === STEP 2: オブジェクトレベルでのバリデーション ===
console.log("=== オブジェクトバリデーション ===");

const DateRangeSchema = z
  .object({
    startDate: z.date(),
    endDate: z.date(),
  })
  .refine((data) => data.startDate < data.endDate, {
    message: "終了日は開始日より後である必要があります",
    path: ["endDate"], // エラーを特定のフィールドに関連付け
  });

// 条件付きバリデーション
const UserRegistrationSchema = z
  .object({
    name: z.string().min(1),
    email: z.string().email(),
    age: z.number().min(13).max(120),
    parentEmail: z.string().email().optional(),
  })
  .refine(
    (data) => {
      // 18歳未満の場合は保護者のメールが必須
      if (data.age < 18) {
        return !!data.parentEmail;
      }
      return true;
    },
    {
      message: "18歳未満の場合、保護者のメールアドレスは必須です",
      path: ["parentEmail"],
    }
  );

// 📝 テストデータ
const validRange = {
  startDate: new Date("2024-01-01"),
  endDate: new Date("2024-12-31"),
};

const invalidRange = {
  startDate: new Date("2024-12-31"),
  endDate: new Date("2024-01-01"),
};

const minorUser = {
  name: "田中花子",
  email: "hanako@example.com",
  age: 16,
  parentEmail: "parent@example.com",
};

console.log("正常な日付範囲:", DateRangeSchema.safeParse(validRange));
console.log("不正な日付範囲:", DateRangeSchema.safeParse(invalidRange));
console.log("未成年ユーザー:", UserRegistrationSchema.safeParse(minorUser));
```

**🎓 理解度チェック**

- `refine()` の基本的な使い方は理解できましたか？
- `path` パラメータでエラーの場所を指定する方法は分かりますか？
- 条件付きバリデーションの実装方法は身につきましたか？



### Section 2: transform()を使ったデータ変換

**💡 データ変換って何？**

カスタムバリデーションでルールをチェックした後、今度は**データを使いやすい形に整える**作業が必要になります。

**💡 身近な例で理解しよう**

コンビニでアルバイト応募の面接シートを受け取った店長を想像してください：

📝 **受け取った面接シート**
- 名前：「  田中太郎  」（前後に空白）
- メール：「TANAKA@EXAMPLE.COM」（大文字）
- 年齢：「25」（文字で書かれている）

📝 **システムに登録する前に整理したい**
- 名前：「田中太郎」（空白を除去）
- メール：「tanaka@example.com」（小文字に統一）
- 年齢：25（数値に変換）

この「データを整理して使いやすくする」作業が**データ変換**です。

**✅ Zodのtransform()で自動変換**

```typescript
// ルールチェック後に、データを自動で整理
const ApplicationSchema = z.object({
  name: z.string().transform(name => name.trim()), // 空白除去
  email: z.string().email().transform(email => email.toLowerCase()), // 小文字化
  age: z.string().transform(str => parseInt(str, 10)), // 数値変換
});

// 受け取ったデータ
const rawData = {
  name: "  田中太郎  ",
  email: "TANAKA@EXAMPLE.COM", 
  age: "25"
};

// 自動で整理される
const result = ApplicationSchema.safeParse(rawData);
// 結果: { name: "田中太郎", email: "tanaka@example.com", age: 25 }
```

Zodの`transform()`を使うと、**ルールチェック成功後に、データを自動で整理**してくれます。

**🎓 学習のポイント**: transform()でデータを変換し、より使いやすい形に整形

```typescript
// === STEP 1: 基本的なデータ変換 ===
console.log("=== 基本的なデータ変換 ===");

// 文字列を数値に変換
const StringToNumberSchema = z.string().transform((val) => parseInt(val, 10));

// 日時文字列をDateオブジェクトに変換
const DateStringSchema = z
  .string()
  .datetime()
  .transform((str) => new Date(str));

// 前後の空白を除去
const TrimmedStringSchema = z.string().transform((str) => str.trim());

// 📝 基本的な変換をテスト
console.log("数値変換:", StringToNumberSchema.safeParse("123"));
console.log("日付変換:", DateStringSchema.safeParse("2024-01-01T10:00:00Z"));
console.log("空白除去:", TrimmedStringSchema.safeParse("  Hello World  "));

// === STEP 2: 実用的なデータ変換 ===
console.log("=== 実用的なデータ変換 ===");

const UserInputSchema = z.object({
  name: z.string().transform((name) => name.trim().toLowerCase()),
  email: z.string().email().transform((email) => email.toLowerCase()),
  age: z
    .string()
    .transform((str) => parseInt(str, 10))
    .pipe(z.number().min(0).max(120)), // 変換後に数値バリデーション
  tags: z.string().transform((str) => 
    str.split(",").map(tag => tag.trim()).filter(tag => tag.length > 0)
  ),
});

// 📝 実用的な変換をテスト
const userData = {
  name: "  YAMADA Taro  ",
  email: "YAMADA@EXAMPLE.COM",
  age: "25",
  tags: "JavaScript, TypeScript, React, ",
};

console.log("ユーザーデータ変換:", UserInputSchema.safeParse(userData));

// === STEP 3: ビジネスロジックを含む変換 ===
console.log("=== ビジネスロジック変換 ===");

const ProductSchema = z
  .object({
    name: z.string(),
    price: z.number(),
    description: z.string(),
  })
  .transform((product) => ({
    ...product,
    // SEO用のスラッグ生成
    slug: product.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    // 価格帯の分類
    priceRange: product.price < 1000 ? "budget" : 
                product.price < 10000 ? "mid-range" : "premium",
    // 作成日時の追加
    createdAt: new Date(),
  }));

// 📝 商品データをテスト
const productData = {
  name: "TypeScript入門書",
  price: 2500,
  description: "TypeScriptの入門書です。",
};

console.log("商品データ変換:", ProductSchema.safeParse(productData));
```

**🎓 理解度チェック**

- `transform()` がバリデーション成功後に実行される仕組みは理解できましたか？
- `.pipe()` を使って変換後の値を再バリデーションする方法は分かりますか？
- ビジネスロジックとデータ変換を組み合わせる方法は身につきましたか？

## 🎯 練習問題（15分）

**🎓 学習目標**: refine()とtransform()の実践的な活用

以下の要件に基づいて、ユーザー登録システムのスキーマを作成してください：

```typescript
// 問題: ユーザー登録システムのスキーマ
// 要件:
// 1. name: 文字列、前後の空白を除去、1文字以上
// 2. email: メールアドレス、小文字に変換
// 3. age: 文字列で受け取り、数値に変換、13-120歳
// 4. password: 8文字以上、大文字・小文字・数字を含む
// 5. confirmPassword: passwordと一致する必要がある

const UserRegistrationSchema = z
  .object({
    name: z.string().transform(name => name.trim()).refine(name => name.length > 0, "名前は必須です"),
    email: z.string().email().transform(email => email.toLowerCase()),
    age: z.string().transform(str => parseInt(str, 10)).pipe(z.number().min(13).max(120)),
    password: z.string()
      .min(8, "8文字以上で入力してください")
      .refine(val => /[A-Z]/.test(val), "大文字を含めてください")
      .refine(val => /[a-z]/.test(val), "小文字を含めてください")
      .refine(val => /[0-9]/.test(val), "数字を含めてください"),
    confirmPassword: z.string()
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "パスワードが一致しません",
    path: ["confirmPassword"]
  });

// 型の生成
type UserRegistration = z.infer<typeof UserRegistrationSchema>;

// テストデータ
const testData = {
  name: "  山田太郎  ",
  email: "YAMADA@EXAMPLE.COM",
  age: "25",
  password: "SecurePass123",
  confirmPassword: "SecurePass123"
};

console.log("ユーザー登録データ:", UserRegistrationSchema.safeParse(testData));

// 🎓 確認ポイント：
// - データ変換が正しく動作するか
// - バリデーションが期待通りに働くか
// - エラーメッセージが適切か
```

---

## 👨‍🏫 学習ポイント

### 🤔 よくある質問

**Q: superRefine()と refine()の使い分けは？**
A: 単純な条件の場合は refine()、複数の条件や複雑なロジックの場合は superRefine()を使います。superRefine()では複数のエラーを一度に処理できます。

**Q: transform()でエラーが発生した場合は？**
A: transform()内でエラーが発生すると、Zod のバリデーションエラーとして扱われます。try-catch 文で適切にハンドリングしましょう。

**Q: スキーマの合成が複雑になった場合は？**
A: 機能ごとにスキーマを分割し、必要に応じて合成する設計にします。また、ファクトリ関数を使って動的にスキーマを生成することも検討しましょう。

---

**📌 重要**: Session2 は Zod の実践技術です。各技法の使い分けを理解し、実際の開発に活用できるレベルを目指しましょう。

**🌟 次回（Session3）は、Angular と Zod を統合して実践的な Web アプリケーションを構築します！**

---

## 📋 Session2 完了チェックリスト（45分版）

学習を完了する前に、以下の項目をすべてチェックしてください：

### 💡 カスタムバリデーション理解

- [ ] `refine()` の基本的な使い方を理解している
- [ ] オブジェクトレベルでのバリデーション方法を説明できる
- [ ] 条件付きバリデーションの実装方法を理解している
- [ ] エラーの `path` 指定によるフィールド別エラー表示ができる

### 💻 データ変換スキル

- [ ] `transform()` を使った基本的なデータ変換ができる
- [ ] `.pipe()` を使って変換後の値を再バリデーションできる
- [ ] 実用的なデータ正規化（trim、toLowerCase等）を実装できる
- [ ] ビジネスロジックを含むデータ変換を実装できる

### 🔧 実践能力

- [ ] 実際のフォーム要件をカスタムバリデーションで実装できる
- [ ] データ変換とバリデーションを組み合わせて使える
- [ ] エラーメッセージが分かりやすく設定できる

### 🧪 動作確認

- [ ] 提供されたコード例を実際に動かして結果を確認した
- [ ] 練習問題を解答し、動作確認を行った
- [ ] カスタムバリデーションとデータ変換の両方をテストした

### 📚 知識の定着

- [ ] refine()とtransform()の使い分けができる
- [ ] 次のステップ（Angular統合）への準備ができている

**🎉 すべてチェックできましたか？** それでは Session3 で Angular との統合に挑戦しましょう！

**⚠️ チェックできない項目がある場合**: 該当する学習内容を再度確認し、不明点は講師に質問しましょう。
