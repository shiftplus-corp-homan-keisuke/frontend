# Session1: Zod 基本マスター（90 分）

> 💡 **対象**: Step01-06 完了者（ジェネリクス・ユーティリティ型習得済み）
> 🎯 **形式**: 講師サポート付き学習
> ⏰ **時間**: 90 分（休憩含む）

## 📚 関連補足資料

このセッションの学習をサポートする補足資料をご用意しています：

- 📖 **[専門用語集](./Step07_補足_専門用語集.md)** - Zod・バリデーション・型安全性の重要な概念と用語の詳細解説
- 💻 **[実践コード例](./Step07_補足_実践コード例.md)** - 段階的な学習のためのコード例集
- 🔧 **[開発環境ガイド](./Step07_補足_開発環境ガイド.md)** - 効率的な開発環境の活用
- 🌐 **[参考リソース](./Step07_補足_参考リソース.md)** - 学習に役立つリンク集とリソース
- 🚨 **[トラブルシューティング](./Step07_補足_トラブルシューティング.md)** - よくあるエラーと解決方法

> 💡 **活用方法**: 学習中に疑問が生じた際や、より深く理解したい場合に参照してね 🐰

## 📅 セッション概要

**学習目標**:

- [ ] Zod の基本概念と実行時型安全性の理解
- [ ] 基本的なスキーマ定義とバリデーション実行
- [ ] エラーハンドリングと型推論（z.infer）の活用
- [ ] カスタムバリデーションルールの作成

**前提知識**:

- Step01-06 の内容（基本型、インターフェース、ユニオン型、型ガード、ジェネリクス、ユーティリティ型）
- TypeScript の型システムの実践的理解
- 基本的な Web アプリケーション開発の知識

---

## ⏰ 詳細タイムテーブル

| 時間         | 内容                       | 講師の役割           | 学習者の活動   | 成果物     |
| ------------ | -------------------------- | -------------------- | -------------- | ---------- |
| **0-10 分**  | 全体概要・目標設定         | 説明・質疑応答       | 聞く・質問     | 理解確認   |
| **10-30 分** | Zod 基本概念とスキーマ定義 | 要点解説・補足       | 個人学習・確認 | 知識整理   |
| **30-60 分** | エラーハンドリング実践     | 実演・個別サポート   | ハンズオン     | 基本コード |
| **60-80 分** | カスタムバリデーション実践 | 巡回サポート・ヒント | 個人作業       | 練習成果   |
| **80-90 分** | 振り返り・次回予告         | まとめ・予告         | 質問・確認     | 学習計画   |

---

## 📚 学習内容

### Section 1: Zod の基本概念

> 📚 **関連資料**: [専門用語集 - Zod 基本概念](./Step07_補足_専門用語集.md#Zod基本概念) | [実践コード例 - スキーマ基礎](./Step07_補足_実践コード例.md#スキーマ基礎)

#### 🔍 Zod とは何か

**💡 なぜ Zod が重要なのか**

Zod は、TypeScript アプリケーションにおいて実行時型安全性を提供するライブラリです。TypeScript の型システムはコンパイル時にのみ有効で、実行時には型情報が失われます。そこで Zod を使うことで、API レスポンスの検証、フォーム入力の検証、設定ファイルの検証などを型安全に行うことができます。特にスキーマから型を自動生成する機能により、型定義の重容を防ぎ、開発効率を大幅に向上させることができます。

**🎯 どういう場面で使うのか**

- **Web アプリケーション開発**: フォームバリデーション、API 通信
- **設定管理**: 環境変数や設定ファイルの検証
- **データ変換**: 外部データを内部形式に安全に変換
- **型安全性の向上**: 実行時エラーの削減とバグの早期発見

**🎓 学習の進め方**

1. **理解確認**: なぜ実行時バリデーションが必要なのか、具体例で考えてみましょう
2. **実体験**: TypeScript の型チェックだけでは防げない問題を体験してみましょう
3. **比較学習**: 従来のバリデーション手法と Zod の違いを理解しましょう

```typescript
// 従来の方法の問題点を体験してみよう
interface User {
  name: string;
  age: number;
}

// APIから取得したデータ（実際は any 型）
const apiResponse = {
  name: "太郎",
  age: "25歳", // 文字列が来てしまった！
};

// TypeScript は静的にはエラーを検出できない
const user: User = apiResponse as User;
console.log(user.age + 1); // NaN になってしまう！

// この問題を Zod でどう解決するかを次のセクションで学びます
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

// Zodを使った最初のスキーマ
const UserSchema = z.object({
  name: z.string(), // 文字列型を期待
  age: z.number(), // 数値型を期待
});

// 🎯 重要：型の自動生成
type User = z.infer<typeof UserSchema>;
// 結果: { name: string; age: number; }

// 📝 実際に動作させてみよう
console.log("=== 基本的なスキーマの動作確認 ===");

// 正常なデータの場合
const validData = { name: "太郎", age: 25 };
const result1 = UserSchema.safeParse(validData);
console.log("✅ 正常データ:", result1.success, result1.data);

// 不正なデータの場合
const invalidData = { name: "太郎", age: "25歳" }; // age が文字列
const result2 = UserSchema.safeParse(invalidData);
console.log("❌ 不正データ:", result2.success);
if (!result2.success) {
  console.log("エラー詳細:", result2.error.errors);
}
```

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

// === STEP 2: ネストしたオブジェクトの理解 ===
console.log("=== ネストしたオブジェクトスキーマ ===");

const UserProfileSchema = z.object({
  user: z.object({
    id: z.string(),
    name: z.string(),
  }),
  profile: z.object({
    bio: z.string().optional(), // プロフィール文（任意）
    avatar: z.string().url().optional(), // アバターURL（任意）
    social: z.object({
      twitter: z.string().optional(), // Twitterアカウント（任意）
      github: z.string().optional(), // GitHubアカウント（任意）
    }),
  }),
});

// 📝 ネストしたデータの例
const userProfileData = {
  user: {
    id: "user123",
    name: "開発太郎",
  },
  profile: {
    bio: "フロントエンド開発者です",
    avatar: "https://example.com/avatar.jpg",
    social: {
      twitter: "@dev_taro",
      github: "dev-taro",
    },
  },
};

console.log(
  "プロフィールデータ:",
  UserProfileSchema.safeParse(userProfileData)
);

// === STEP 3: 配列スキーマの理解 ===
console.log("=== 配列スキーマ ===");

const TagSchema = z.string().min(1); // 空でない文字列タグ
const BlogPostSchema = z.object({
  title: z.string().min(1).max(100), // 1-100文字のタイトル
  content: z.string().min(1), // 空でないコンテンツ
  tags: z.array(TagSchema).min(1).max(10), // 1-10個のタグ配列
  publishedAt: z.date().optional(), // 公開日（任意）
});

// 📝 配列データの例
const blogPostData = {
  title: "Zodの使い方",
  content: "Zodは便利なバリデーションライブラリです...",
  tags: ["TypeScript", "Zod", "バリデーション"],
  publishedAt: new Date(),
};

console.log("ブログ投稿データ:", BlogPostSchema.safeParse(blogPostData));

// === STEP 4: 列挙型（enum）の理解 ===
console.log("=== 列挙型スキーマ ===");

const StatusSchema = z.enum(["draft", "published", "archived"]);
const PrioritySchema = z.union([
  z.literal("low"),
  z.literal("medium"),
  z.literal("high"),
]);

const TaskSchema = z.object({
  id: z.string(),
  title: z.string(),
  status: StatusSchema, // "draft" | "published" | "archived"
  priority: PrioritySchema, // "low" | "medium" | "high"
});

// 📝 列挙型の動作確認
console.log("正常なステータス:", StatusSchema.safeParse("published"));
console.log("不正なステータス:", StatusSchema.safeParse("invalid"));

const taskData = {
  id: "task123",
  title: "Zodを学習する",
  status: "draft",
  priority: "high",
};

console.log("タスクデータ:", TaskSchema.safeParse(taskData));
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

// 複雑なスキーマでの型推論
const BlogPostSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1).max(100),
  content: z.string(),
  status: z.enum(["draft", "published", "archived"]),
  tags: z.array(z.string()),
  author: z.object({
    id: z.string(),
    name: z.string(),
    email: z.string().email(),
  }),
  metadata: z.object({
    views: z.number().default(0),
    likes: z.number().default(0),
    createdAt: z.date(),
    updatedAt: z.date(),
  }),
});

type BlogPost = z.infer<typeof BlogPostSchema>;

// 実用的な使用例
class BlogPostService {
  async createBlogPost(data: unknown): Promise<BlogPost> {
    // バリデーション
    const validatedData = BlogPostSchema.parse(data);

    // この時点で validatedData は BlogPost 型として扱われる
    return this.saveToDB(validatedData);
  }

  private async saveToDB(blogPost: BlogPost): Promise<BlogPost> {
    // データベースに保存する処理
    console.log(`ブログ記事を保存: ${blogPost.title}`);
    return blogPost;
  }
}
```

### Section 4: カスタムバリデーションルール

#### 🔍 refine() を使ったカスタムバリデーション

```typescript
// 基本的なrefine()の使用
const EvenNumberSchema = z.number().refine((val) => val % 2 === 0, {
  message: "偶数を入力してください",
});

// 複数条件のバリデーション
const PasswordSchema = z
  .string()
  .min(8)
  .refine((val) => /[A-Z]/.test(val), "大文字を含めてください")
  .refine((val) => /[a-z]/.test(val), "小文字を含めてください")
  .refine((val) => /[0-9]/.test(val), "数字を含めてください")
  .refine((val) => /[^A-Za-z0-9]/.test(val), "特殊文字を含めてください");

// オブジェクトレベルでのバリデーション
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
const OrderSchema = z
  .object({
    type: z.enum(["digital", "physical"]),
    shippingAddress: z.string().optional(),
    downloadUrl: z.string().url().optional(),
  })
  .refine(
    (data) => {
      // 物理商品の場合は配送先住所が必須
      if (data.type === "physical") {
        return !!data.shippingAddress;
      }
      return true;
    },
    {
      message: "物理商品の場合、配送先住所は必須です",
      path: ["shippingAddress"],
    }
  )
  .refine(
    (data) => {
      // デジタル商品の場合はダウンロードURLが必須
      if (data.type === "digital") {
        return !!data.downloadUrl;
      }
      return true;
    },
    {
      message: "デジタル商品の場合、ダウンロードURLは必須です",
      path: ["downloadUrl"],
    }
  );
```

---

## 🎯 練習問題

### 📚 学習前の準備

各練習問題に取り組む前に、以下の点を確認してください：

- コード例を実際に動かして結果を確認していますか？
- エラーメッセージの内容を理解できていますか？
- なぜそのバリデーションが必要なのかを考えていますか？

### 練習問題 1: 基本スキーマ定義（20 分）

**🎓 学習目標**: 複雑な要件を持つスキーマの設計と実装

以下の要件に基づいてスキーマを定義してください：

```typescript
// 問題1: ユーザー登録フォームのスキーマ
// 要件:
// - username: 文字列、3-20文字、英数字とアンダースコアのみ
// - email: 正しいメールアドレス形式
// - password: 8文字以上、大文字・小文字・数字・特殊文字を含む
// - confirmPassword: passwordと一致する必要がある
// - age: 整数、13-120歳
// - termsAccepted: 真偽値、trueである必要がある

// 🎯 解答のヒント：
// 1. まず各フィールドの基本スキーマを作成
// 2. 正規表現を使ってパターンマッチング
// 3. superRefine()でパスワード一致をチェック
// 4. boolean().refine()で利用規約同意をチェック

const UserRegistrationSchema = /* ここに実装 */;

// 📝 テストデータで動作確認（段階的にテストしよう）
const validData = {
  username: "yamada_taro",
  email: "yamada@example.com",
  password: "SecurePass123!",
  confirmPassword: "SecurePass123!",
  age: 25,
  termsAccepted: true
};

const invalidData = {
  username: "ya", // 短すぎる
  email: "invalid-email",
  password: "weak", // 弱いパスワード
  confirmPassword: "different", // 一致しない
  age: 12, // 年齢制限未満
  termsAccepted: false // 利用規約未同意
};

console.log("=== 練習問題1の結果 ===");
console.log("✅ 正常データ:", UserRegistrationSchema.safeParse(validData));
console.log("❌ 不正データ:", UserRegistrationSchema.safeParse(invalidData));

// 🎓 学習のポイント：
// - エラーメッセージが分かりやすいか確認
// - 各バリデーションルールが期待通りに動作するか確認
// - superRefine()の使い方は理解できたか
```

### 練習問題 2: カスタムバリデーション（20 分）

**🎓 学習目標**: 実業務でよくあるビジネスルールの実装

以下の要件に基づいて、商品注文システムのスキーマを実装してください：

```typescript
// 問題2: 商品注文システムのスキーマ
// 要件:
// - 注文には商品リストと配送情報が含まれる
// - 商品の合計金額が1000円以上である必要がある
// - 配送先住所は日本国内のみ（郵便番号で判定: 3桁-4桁の形式）
// - 急ぎ配送の場合は追加料金が発生する

// 🎯 解答のヒント：
// 1. 商品アイテムのスキーマを先に定義
// 2. 配送情報のスキーマを定義
// 3. superRefine()で合計金額をチェック
// 4. 正規表現で郵便番号形式をチェック

const OrderItemSchema = z.object({
  name: z.string().min(1),
  price: z.number().positive(),
  quantity: z.number().int().positive()
});

const ShippingSchema = z.object({
  address: z.string().min(1),
  postalCode: z.string().regex(/^\d{3}-\d{4}$/, "郵便番号は XXX-XXXX 形式で入力してください"),
  isExpress: z.boolean()
});

const OrderSchema = /* ここに実装 */;

// 📝 テストデータ
const orderData = {
  items: [
    { name: "商品A", price: 800, quantity: 1 },
    { name: "商品B", price: 500, quantity: 2 }
  ],
  shipping: {
    address: "123-4567 東京都渋谷区...",
    postalCode: "123-4567",
    isExpress: true
  }
};

console.log("=== 練習問題2の結果 ===");
console.log(OrderSchema.safeParse(orderData));

// 🎓 学習のポイント：
// - ネストしたオブジェクトのバリデーションは理解できたか
// - ビジネスルール（最低注文金額）の実装は適切か
// - 正規表現を使ったパターンマッチングは理解できたか
```

### 練習問題 3: 発展課題（20 分）

**🎓 学習目標**: Zod の実践的活用と設計スキルの向上

```typescript
// 問題3: イベント管理システム
// 要件:
// - イベントタイプ（オンライン/オフライン）によって必要な情報が変わる
// - オンラインイベントの場合: 会議URL、最大参加者数が必要
// - オフラインイベントの場合: 会場住所、収容人数が必要
// - 開催日時は現在より未来である必要がある
// - 参加費は0円以上

// ここに自分でスキーマを設計してみよう！
const EventSchema = /* あなたの実装 */;

// 🎓 解答後の確認ポイント：
// - 条件分岐のロジックは適切か？
// - エラーメッセージは分かりやすいか？
// - 型推論は期待通りに動作するか？
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

## 📋 Session1 完了チェックリスト

学習を完了する前に、以下の項目をすべてチェックしてください：

### 💡 概念理解

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
- [ ] `refine()` を使ったカスタムバリデーションを実装できる
- [ ] 複雑なビジネスルールをバリデーションロジックに変換できる
- [ ] 実際のフォーム要件をスキーマ設計できる

### 🧪 動作確認

- [ ] 提供されたすべてのコード例を実際に動かして結果を確認した
- [ ] 練習問題をすべて解答し、動作確認を行った
- [ ] エラーケースとノーマルケースの両方をテストした

### 📚 知識の定着

- [ ] Zod の利点を具体例で説明できる
- [ ] どんな場面で Zod を使うべきか判断できる
- [ ] 次のステップ（Session2）で学ぶ内容を理解している

**🎉 すべてチェックできましたか？** それでは Session2 でお会いしましょう！

**⚠️ チェックできない項目がある場合**: 該当する学習内容を再度確認し、補足資料も活用してください。不明点は講師に質問しましょう。
