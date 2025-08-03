# Step07 補足資料: 専門用語集

> 📖 **目的**: Zod・バリデーション・型安全性の重要な概念と用語を詳しく解説
> 🎯 **対象**: Step07 学習者（Session1-3 全般）
> 📚 **活用方法**: 学習中の疑問解決・理解の深化・復習時の参照

---

## 📚 Zod 基本概念

### Zod（ゾッド）

**定義**: TypeScript ファーストなスキーマバリデーションライブラリ  
**特徴**:

- 実行時型安全性の提供
- TypeScript の型推論との完全統合
- ゼロ依存関係の軽量ライブラリ

**使用例**:

```typescript
import { z } from "zod";

const UserSchema = z.object({
  name: z.string(),
  age: z.number(),
});

type User = z.infer<typeof UserSchema>; // { name: string; age: number; }
```

### スキーマ（Schema）

**定義**: データの構造・型・バリデーションルールを定義するオブジェクト  
**役割**:

- データ検証の基準定義
- 型情報の提供
- エラー情報の生成

**階層**:

```typescript
// プリミティブスキーマ
z.string();
z.number();
z.boolean();

// 複合スキーマ
z.object({
  /* ... */
});
z.array(z.string());
z.union([z.string(), z.number()]);
```

### バリデーション（Validation）

**定義**: データが期待する形式・ルールに適合しているかを検証する処理  
**種類**:

- **構造バリデーション**: データ型・プロパティの存在確認
- **制約バリデーション**: 文字数・数値範囲・正規表現等のルール検証
- **ビジネスルールバリデーション**: 業務固有の複雑な条件検証

### 実行時型安全性（Runtime Type Safety）

**定義**: プログラム実行中にデータの型を検証し、型安全性を保証する仕組み  
**重要性**:

- TypeScript の型はコンパイル時にのみ有効
- 外部データ（API、ユーザー入力）は実行時検証が必要
- 予期しない型エラーによるアプリケーションクラッシュを防止

**比較**:

```typescript
// コンパイル時のみ（TypeScript標準）
interface User {
  name: string;
  age: number;
}

// 実行時も検証（Zod）
const UserSchema = z.object({
  name: z.string(),
  age: z.number(),
});

const userData = JSON.parse(apiResponse); // unknown型
const user = UserSchema.parse(userData); // 実行時検証 + 型安全
```

---

## 🔍 Zod の基本操作

### parse()と safeParse()

**parse()**:

- エラー時に例外をスロー
- 成功時に検証済みデータを返す
- try-catch 文でのエラーハンドリングが必要

**safeParse()**:

- エラー時も例外をスローしない
- 成功・失敗の情報を含む Result オブジェクトを返す
- より安全で推奨される方法

```typescript
// parse() - 例外スロー
try {
  const user = UserSchema.parse(data);
  console.log(user.name); // 型安全
} catch (error) {
  console.error("バリデーションエラー:", error);
}

// safeParse() - 結果オブジェクト
const result = UserSchema.safeParse(data);
if (result.success) {
  console.log(result.data.name); // 型安全
} else {
  console.error("エラー:", result.error.issues);
}
```

### z.infer<>（型推論）

**定義**: Zod スキーマから対応する TypeScript 型を自動生成する機能  
**利点**:

- 型定義の重複排除
- スキーマと型の同期保証
- 開発効率の向上

```typescript
const ProductSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100),
  price: z.number().positive(),
  inStock: z.boolean(),
  tags: z.array(z.string()),
  metadata: z.record(z.unknown()).optional(),
});

// 自動的に型が生成される
type Product = z.infer<typeof ProductSchema>;
/*
type Product = {
  id: string;
  name: string;
  price: number;
  inStock: boolean;
  tags: string[];
  metadata?: Record<string, unknown> | undefined;
}
*/
```

---

## 🛠️ 高度なバリデーション

### refine()

**定義**: カスタムバリデーションロジックを追加するメソッド  
**用途**: 単一値に対する複雑な条件検証

```typescript
const PasswordSchema = z
  .string()
  .min(8, "8文字以上で入力してください")
  .refine((password) => /[A-Z]/.test(password), {
    message: "大文字を含めてください",
  })
  .refine((password) => /[0-9]/.test(password), {
    message: "数字を含めてください",
  });
```

### superRefine()

**定義**: より柔軟で強力なカスタムバリデーション機能  
**特徴**:

- 複数の検証を一つの関数内で実行
- 詳細なエラー情報の設定
- 条件分岐を含む複雑なロジックの実装

```typescript
const UserRegistrationSchema = z
  .object({
    email: z.string().email(),
    password: z.string(),
    confirmPassword: z.string(),
  })
  .superRefine((data, ctx) => {
    // パスワード確認の検証
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["confirmPassword"],
        message: "パスワードが一致しません",
      });
    }

    // メールドメインの検証
    if (data.email.endsWith("@example.com")) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["email"],
        message: "このドメインは使用できません",
      });
    }
  });
```

### transform()

**定義**: バリデーション成功後にデータを変換する機能  
**用途**:

- データの正規化
- 型変換
- 計算値の追加

```typescript
const DateSchema = z
  .string()
  .datetime()
  .transform((str) => new Date(str));

const UserInputSchema = z.object({
  name: z.string().transform((name) => name.trim().toLowerCase()),
  age: z.string().transform((str) => parseInt(str, 10)),
  tags: z.string().transform((str) => str.split(",").map((tag) => tag.trim())),
});
```

---

## 🔗 スキーマ合成

### extend()

**定義**: 既存スキーマに新しいプロパティを追加  
**特徴**: 元のスキーマを変更せず、新しいスキーマを生成

```typescript
const BaseUserSchema = z.object({
  id: z.string(),
  name: z.string(),
});

const AdminUserSchema = BaseUserSchema.extend({
  role: z.literal("admin"),
  permissions: z.array(z.string()),
});
```

### merge()

**定義**: 複数のスキーマを統合  
**用途**: 共通スキーマの組み合わせ

```typescript
const TimestampSchema = z.object({
  createdAt: z.date(),
  updatedAt: z.date(),
});

const AuditSchema = z.object({
  createdBy: z.string(),
  modifiedBy: z.string(),
});

const BlogPostSchema = z
  .object({
    title: z.string(),
    content: z.string(),
  })
  .merge(TimestampSchema)
  .merge(AuditSchema);
```

### pick()と omit()

**pick()**: 指定したプロパティのみを選択  
**omit()**: 指定したプロパティを除外

```typescript
const FullUserSchema = z.object({
  id: z.string(),
  email: z.string(),
  password: z.string(),
  name: z.string(),
  createdAt: z.date(),
});

// IDと名前のみ
const UserSummarySchema = FullUserSchema.pick({
  id: true,
  name: true,
});

// パスワードを除外
const SafeUserSchema = FullUserSchema.omit({
  password: true,
});

// 作成用（IDと作成日時を除外）
const CreateUserSchema = FullUserSchema.omit({
  id: true,
  createdAt: true,
});
```

---

## 🌐 Angular 統合

### カスタムバリデータ

**定義**: Zod スキーマを Angular Reactive Forms で使用するための変換関数

```typescript
import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";
import { z } from "zod";

export function zodValidator(schema: z.ZodSchema<any>): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;

    const result = schema.safeParse(control.value);
    if (result.success) return null;

    const errors: ValidationErrors = {};
    result.error.errors.forEach((err) => {
      const key = err.path.length > 0 ? err.path.join(".") : "zodError";
      errors[key] = { message: err.message };
    });
    return errors;
  };
}
```

### 型安全な HTTP 通信

**定義**: API 通信で Zod スキーマによる応答検証を行う仕組み

```typescript
class ApiService {
  private apiCall<T>(url: string, schema: z.ZodSchema<T>): Observable<T> {
    return this.http.get(url).pipe(
      map((response) => {
        const result = schema.safeParse(response);
        if (result.success) {
          return result.data;
        } else {
          throw new Error(
            `API response validation failed: ${result.error.message}`
          );
        }
      })
    );
  }
}
```

---

## 🚨 エラーハンドリング

### ZodError

**定義**: Zod のバリデーション失敗時に生成されるエラーオブジェクト  
**構造**:

- `issues`: 個別のエラー情報の配列
- `message`: エラーの概要メッセージ

```typescript
interface ZodIssue {
  code: ZodIssueCode;
  path: (string | number)[];
  message: string;
  expected?: string;
  received?: string;
}
```

### エラーメッセージのカスタマイズ

```typescript
const CustomMessageSchema = z.object({
  email: z
    .string()
    .min(1, "メールアドレスは必須です")
    .email("正しいメールアドレス形式で入力してください"),
  age: z
    .number()
    .min(0, "年齢は0以上で入力してください")
    .max(150, "年齢は150以下で入力してください"),
});

// 日本語エラーメッセージのフォーマット関数
function formatZodError(error: z.ZodError): Record<string, string[]> {
  const fieldErrors: Record<string, string[]> = {};

  error.errors.forEach((err) => {
    const field = err.path.join(".");
    if (!fieldErrors[field]) {
      fieldErrors[field] = [];
    }
    fieldErrors[field].push(err.message);
  });

  return fieldErrors;
}
```

---

## 🏗️ 設計パターン

### スキーマファーストアプローチ

**定義**: スキーマ定義を起点とした開発手法  
**手順**:

1. データ構造を Zod スキーマで定義
2. z.infer で型を自動生成
3. バリデーション・API・UI で一貫してスキーマを使用

### CRUD スキーマパターン

```typescript
// ベーススキーマ
const BlogPostSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1).max(200),
  content: z.string().min(1),
  publishedAt: z.date().optional(),
  authorId: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// 用途別スキーマの生成
export const BlogPostSchemas = {
  // 作成用（ID、タイムスタンプを除外）
  create: BlogPostSchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  }),

  // 更新用（ID、タイムスタンプを除外、全て任意）
  update: BlogPostSchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  }).partial(),

  // 一覧表示用（詳細データを除外）
  list: BlogPostSchema.pick({
    id: true,
    title: true,
    publishedAt: true,
    authorId: true,
  }),

  // 詳細表示用（完全版）
  detail: BlogPostSchema,

  // 検索用
  search: z.object({
    query: z.string().optional(),
    authorId: z.string().uuid().optional(),
    published: z.boolean().optional(),
    limit: z.number().min(1).max(100).default(20),
    offset: z.number().min(0).default(0),
  }),
};

// 型の自動生成
export type BlogPost = z.infer<typeof BlogPostSchema>;
export type CreateBlogPost = z.infer<typeof BlogPostSchemas.create>;
export type UpdateBlogPost = z.infer<typeof BlogPostSchemas.update>;
export type BlogPostListItem = z.infer<typeof BlogPostSchemas.list>;
export type BlogPostSearchParams = z.infer<typeof BlogPostSchemas.search>;
```

---

## 📊 パフォーマンス考慮事項

### バリデーション最適化

**重要ポイント**:

- 早期バリデーション失敗による処理速度向上
- 複雑なスキーマでは段階的バリデーション
- キャッシュ活用によるスキーマ再利用

```typescript
// パフォーマンスを考慮したスキーマ設計
const OptimizedUserSchema = z.object({
  // 必須フィールドを先頭に配置（早期失敗）
  id: z.string().uuid(),
  email: z.string().email(),

  // 重い処理は後に配置
  profileImage: z
    .instanceof(File)
    .refine(async (file) => {
      // 重い画像バリデーション処理
      return await validateImageFile(file);
    })
    .optional(),
});
```

---

この用語集は、Step07 の Zod 学習における重要な概念を体系的に整理しています。学習中に不明な概念が出てきた際は、この用語集を参照して理解を深めてください。
