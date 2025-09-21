# STEP07 総復習：Zodによるスキーマ駆動開発と実行時型安全性

## 📋 概要

このファイルは、STEP07「Zodによるスキーマ駆動開発と実行時型安全性」の理論学習内容を総復習するためのドキュメントです。既存のセッションファイルで学習した内容を体系的に整理し、理論的な理解を深めることを目的としています。

## 🎯 学習目標

- [ ] スキーマ駆動開発の基本概念と利点の理解
- [ ] Zodの基本機能とTypeScript型の自動推論の習得
- [ ] カスタムバリデーションとエラーハンドリングの詳細理解
- [ ] スキーマの合成と変換パターンの習得
- [ ] 実践での活用場面の把握と適切な使い分け

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

---

## 6. 実践での活用場面

### 6.1 APIバリデーション

```typescript
// API レスポンスの検証
const ApiResponseSchema = z.object({
  success: z.boolean(),
  data: z.array(UserSchema),
  pagination: z.object({
    page: z.number().int().positive(),
    limit: z.number().int().positive(),
    total: z.number().int().min(0),
  }),
});

// 型安全なAPI呼び出し
async function fetchUsers(page: number): Promise<z.infer<typeof ApiResponseSchema>> {
  const response = await fetch(`/api/users?page=${page}`);
  const rawData = await response.json();
  return ApiResponseSchema.parse(rawData);
}

// リクエストボディの検証
app.post('/api/users', (req, res) => {
  const result = CreateUserRequestSchema.safeParse(req.body);
  
  if (!result.success) {
    return res.status(400).json({
      error: "Validation failed",
      details: result.error.flatten()
    });
  }
  
  const userData = result.data;
  // 型安全なデータ処理
});
```

### 6.2 フォーム検証

```typescript
// 段階的フォームバリデーション
const MultiStepFormSchemas = {
  step1: z.object({
    email: z.string().email("正しいメールアドレスを入力してください"),
    password: z.string().min(8, "8文字以上で入力してください"),
  }),
  
  step2: z.object({
    firstName: z.string().min(1, "名前を入力してください"),
    lastName: z.string().min(1, "姓を入力してください"),
    birthDate: z.string().datetime("正しい日付形式で入力してください"),
  }),
  
  step3: z.object({
    preferences: z.object({
      newsletter: z.boolean().default(false),
      theme: z.enum(["light", "dark"]).default("light"),
    }),
    terms: z.boolean().refine(val => val === true, {
      message: "利用規約に同意してください",
    }),
  }),
};
```

### 6.3 環境変数・設定ファイルの検証

```typescript
// 環境変数の検証
const EnvSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.string().transform(val => parseInt(val, 10)).pipe(z.number().int().positive()),
  DATABASE_URL: z.string().url("正しいデータベースURLを設定してください"),
  JWT_SECRET: z.string().min(32, "JWT秘密鍵は32文字以上で設定してください"),
});

// 型安全な環境変数の読み込み
const env = EnvSchema.parse(process.env);
```

### 6.4 データベーススキーマとの連携

```typescript
// データベースエンティティのスキーマ定義
const DatabaseUserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  passwordHash: z.string(),
  name: z.string(),
  role: z.enum(["user", "admin"]),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// 用途別スキーマの派生
export const UserSchemas = {
  database: DatabaseUserSchema,
  public: DatabaseUserSchema.omit({ passwordHash: true }),
  create: DatabaseUserSchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  }),
  update: DatabaseUserSchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  }).partial(),
};

// 型の自動生成
export type DatabaseUser = z.infer<typeof UserSchemas.database>;
export type PublicUser = z.infer<typeof UserSchemas.public>;
export type CreateUserData = z.infer<typeof UserSchemas.create>;
export type UpdateUserData = z.infer<typeof UserSchemas.update>;
```

---

## 📚 重要な概念の整理

### スキーマファーストアプローチの利点
1. **一貫性の保証**: 単一のスキーマ定義から型、バリデーション、ドキュメントを生成
2. **開発効率の向上**: 型定義の重複排除と自動生成による工数削減
3. **実行時安全性**: TypeScriptの静的型チェックに加えて実行時検証を提供
4. **保守性の向上**: スキーマ変更時の影響範囲が明確で、一箇所の変更で全体に反映

### エラーハンドリングのベストプラクティス
1. **safeParse()の優先使用**: 例外処理よりも結果オブジェクトによる制御フローが推奨
2. **詳細なエラー情報の活用**: フィールド別エラーメッセージでユーザビリティ向上
3. **国際化対応**: 多言語環境でのエラーメッセージ管理
4. **ログ記録**: バリデーションエラーの適切な記録と監視

### パフォーマンス考慮事項
1. **スキーマの再利用**: 同一スキーマの再作成を避けるキャッシュ機能
2. **遅延評価**: 複雑な自己参照構造での`z.lazy()`活用
3. **適切な粒度**: 過度に複雑なスキーマの分割と組み合わせ

### 次のステップへの準備

STEP07で学習したZodによるスキーマ駆動開発は、以下の高度なTypeScript開発の基礎となります：
- **STEP08**: SOLID原則とTypeScript設計パターン
- 実践プロジェクトでのスキーマファーストアプローチの適用
- 大規模アプリケーションでの型安全性の確保

---

## 🔗 関連リソース

- [Zod公式ドキュメント](https://zod.dev/)
- [TypeScript Handbook - Type Inference](https://www.typescriptlang.org/docs/handbook/type-inference.html)
- 既存のセッションファイル：Session1_Zodスキーマ基礎.md、Session2_高度なバリデーション.md