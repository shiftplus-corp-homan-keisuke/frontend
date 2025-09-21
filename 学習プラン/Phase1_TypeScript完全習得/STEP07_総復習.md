# STEP07 総復習：Zodによるスキーマ駆動開発と実行時型安全性

## 📋 概要

このファイルは、STEP07「Zodによるスキーマ駆動開発と実行時型安全性」の理論学習内容を総復習するためのドキュメントです。既存のセッションファイルで学習した内容を体系的に整理し、理論的な理解を深めることを目的としています。

## 🎯 学習目標

- [ ] スキーマ駆動開発の基本概念と利点の理解
- [ ] Zodの基本機能とTypeScript型の自動推論の習得
- [ ] カスタムバリデーションとエラーハンドリングの詳細理解
- [ ] スキーマの合成と変換パターンの習得

---

## 1. スキーマ駆動開発の基本概念

### 1.1 スキーマ駆動開発とは

**概念**: データの構造と制約をスキーマとして定義し、それを起点とした開発手法

**利点**:
- **型安全性とランタイム検証の統合**: コンパイル時と実行時の両方で型安全性を保証
- **単一の真実の源**: スキーマ定義から型、バリデーション、ドキュメントを自動生成
- **開発効率の向上**: 型定義の重複排除と一貫性の保証

```typescript
import { z } from "zod";

// スキーマ定義（単一の真実の源）
const UserSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100),
  email: z.string().email(),
  age: z.number().int().min(0).max(150),
});

// 型の自動推論
type User = z.infer<typeof UserSchema>;

// 実行時検証
const validateUser = (data: unknown): User => {
  return UserSchema.parse(data); // 型安全 + 実行時検証
};
```

### 1.2 従来のアプローチとの比較

```typescript
// 従来のアプローチ（型定義とバリデーションが分離）
interface User {
  id: string;
  name: string;
  email: string;
  age: number;
}

function validateUser(data: any): User {
  // 手動でバリデーションロジックを実装
  if (typeof data.name !== 'string' || data.name.length === 0) {
    throw new Error('Invalid name');
  }
  return data as User;
}

// スキーマ駆動アプローチ（統合された定義）
const UserSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  email: z.string().email(),
  age: z.number().int().min(0),
});

type User = z.infer<typeof UserSchema>; // 自動生成
const validateUser = UserSchema.parse; // 自動生成
```

---

## 2. Zodの基本機能

### 2.1 プリミティブ型とオブジェクトスキーマ

```typescript
// 基本型と制約
const emailSchema = z.string().email();
const positiveNumberSchema = z.number().positive();
const enumSchema = z.enum(["admin", "user", "guest"]);

// 文字列制約
const usernameSchema = z.string()
  .min(3, "3文字以上で入力してください")
  .max(20, "20文字以下で入力してください")
  .regex(/^[a-zA-Z0-9_]+$/, "英数字とアンダースコアのみ使用可能");

// オブジェクトスキーマ
const UserProfileSchema = z.object({
  id: z.string().uuid(),
  username: z.string().min(3).max(20),
  email: z.string().email(),
  bio: z.string().max(500).optional(),
  role: z.enum(["user", "admin"]).default("user"),
  preferences: z.object({
    theme: z.enum(["light", "dark"]).default("light"),
    notifications: z.boolean().default(true),
  }),
});
```

### 2.2 配列・タプル・Union型

```typescript
// 配列とタプル
const TagsSchema = z.array(z.string().min(1));
const CoordinateSchema = z.tuple([z.number(), z.number()]);

// Union型
const StatusSchema = z.union([
  z.literal("pending"),
  z.literal("processing"),
  z.literal("completed"),
  z.literal("failed")
]);

// Discriminated Union
const EventSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("click"), x: z.number(), y: z.number() }),
  z.object({ type: z.literal("keypress"), key: z.string() }),
]);
```

---

## 3. カスタムバリデーション

### 3.1 refine()メソッドの活用

```typescript
// パスワード強度チェック
const PasswordSchema = z.string()
  .min(8, "8文字以上で入力してください")
  .refine((password) => /[A-Z]/.test(password), {
    message: "大文字を1文字以上含めてください",
  })
  .refine((password) => /[0-9]/.test(password), {
    message: "数字を1文字以上含めてください",
  });

// 複数フィールド間の検証
const ProductSchema = z.object({
  name: z.string().min(1),
  price: z.number().positive(),
  discountPrice: z.number().positive().optional(),
}).refine((data) => {
  if (data.discountPrice && data.discountPrice >= data.price) {
    return false;
  }
  return true;
}, {
  message: "割引価格は元の価格より安く設定してください",
  path: ["discountPrice"],
});
```

### 3.2 superRefine()による高度な検証

```typescript
const UserRegistrationSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  confirmPassword: z.string(),
  birthDate: z.string().datetime(),
}).superRefine((data, ctx) => {
  // パスワード確認
  if (data.password !== data.confirmPassword) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["confirmPassword"],
      message: "パスワードが一致しません",
    });
  }

  // 年齢制限
  const age = new Date().getFullYear() - new Date(data.birthDate).getFullYear();
  if (age < 13) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["birthDate"],
      message: "13歳以上である必要があります",
    });
  }
});
```

---

## 4. スキーマの合成と変換

### 4.1 スキーマの継承と拡張

```typescript
// ベーススキーマ
const BaseEntitySchema = z.object({
  id: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// 拡張と結合
const UserSchema = BaseEntitySchema.extend({
  name: z.string().min(1),
  email: z.string().email(),
  role: z.enum(["user", "admin"]),
});

// 選択と除外
const PublicUserSchema = UserSchema.pick({
  id: true,
  name: true,
});

const UserUpdateSchema = UserSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).partial();
```

### 4.2 transform()とpreprocess()

```typescript
// データ変換
const UserInputSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  birthDate: z.string().datetime(),
}).transform((data) => ({
  ...data,
  fullName: `${data.firstName} ${data.lastName}`,
  age: new Date().getFullYear() - new Date(data.birthDate).getFullYear(),
}));

// 前処理
const CoercedNumberSchema = z.preprocess(
  (val) => {
    if (typeof val === "string") {
      const num = parseFloat(val);
      return isNaN(num) ? val : num;
    }
    return val;
  },
  z.number().positive()
);
```

---

## 5. エラーハンドリング

### 5.1 safeParse vs parse の使い分け

```typescript
// safeParse() - エラー時も例外をスローしない（推奨）
function safeValidation(data: unknown) {
  const result = UserSchema.safeParse(data);
  
  if (result.success) {
    return { success: true, data: result.data };
  } else {
    return {
      success: false,
      errors: result.error.errors.map(err => err.message)
    };
  }
}
```

### 5.2 エラー情報の処理

```typescript
// エラー情報の詳細な処理
function processValidationError(error: z.ZodError) {
  const flattened = error.flatten();
  
  return {
    formErrors: flattened.formErrors,
    fieldErrors: flattened.fieldErrors,
    detailedErrors: error.errors.map(issue => ({
      field: issue.path.join('.'),
      message: issue.message,
      code: issue.code,
    }))
  };
}

// カスタムエラーメッセージ
const CustomMessageSchema = z.object({
  email: z.string()
    .min(1, "メールアドレスは必須です")
    .email("正しいメールアドレス形式で入力してください"),
  password: z.string()
    .min(8, "パスワードは8文字以上で入力してください"),
});
```
