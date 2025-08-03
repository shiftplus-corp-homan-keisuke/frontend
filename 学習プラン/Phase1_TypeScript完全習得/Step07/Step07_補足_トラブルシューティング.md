# Step07 補足資料: トラブルシューティング

> 🚨 **目的**: Zod 学習と Angular 統合でよくあるエラーと解決方法の完全ガイド
> 🎯 **対象**: Step07 学習者（Session1-3 全般）
> 📚 **活用方法**: エラーが発生した際の迅速な問題解決

---

## 📚 目次

1. [Zod 基本エラー](#Zod基本エラー)
2. [スキーマ定義の問題](#スキーマ定義の問題)
3. [バリデーションエラー](#バリデーションエラー)
4. [Angular 統合エラー](#Angular統合エラー)
5. [パフォーマンス問題](#パフォーマンス問題)
6. [デバッグのコツ](#デバッグのコツ)

---

## 🔧 Zod 基本エラー

### エラー 1: "Cannot find module 'zod'"

**症状**:

```typescript
import { z } from "zod"; // Error: Cannot find module 'zod'
```

**原因**: Zod がインストールされていない

**解決方法**:

```bash
# npm使用の場合
npm install zod

# yarn使用の場合
yarn add zod

# pnpm使用の場合
pnpm add zod
```

**確認方法**:

```bash
# package.jsonの確認
cat package.json | grep zod

# インストール済みバージョンの確認
npm list zod
```

### エラー 2: "z is not defined"

**症状**:

```typescript
const schema = z.string(); // ReferenceError: z is not defined
```

**原因**: インポート文が不足している

**解決方法**:

```typescript
// 正しいインポート
import { z } from "zod";

const schema = z.string();
```

### エラー 3: TypeScript コンパイルエラー

**症状**:

```
error TS2304: Cannot find name 'z'
error TS7016: Could not find declaration file for module 'zod'
```

**原因**: TypeScript 設定や Zod の型定義の問題

**解決方法**:

```json
// tsconfig.json
{
  "compilerOptions": {
    "moduleResolution": "node",
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true
  }
}
```

```bash
# 型定義を明示的にインストール（通常は不要）
npm install @types/node
```

---

## 📋 スキーマ定義の問題

### エラー 4: "Expected object, received array"

**症状**:

```typescript
const schema = z.object({
  users: z.array(z.string()),
});

const result = schema.parse(["user1", "user2"]); // Error
```

**原因**: オブジェクトスキーマに配列データを渡している

**解決方法**:

```typescript
// 問題のあるコード
const schema = z.object({
  users: z.array(z.string()),
});

// 修正版1: データ構造に合わせてスキーマを修正
const correctSchema = z.array(z.string());
const result = correctSchema.parse(["user1", "user2"]); // OK

// 修正版2: データ構造を変更
const objectData = { users: ["user1", "user2"] };
const result2 = schema.parse(objectData); // OK
```

### エラー 5: "Invalid input: Expected string, received number"

**症状**:

```typescript
const schema = z.string();
const result = schema.parse(123); // Error: Expected string, received number
```

**原因**: 期待する型と実際のデータ型が異なる

**解決方法**:

```typescript
// 解決方法1: 型変換を含むスキーマ
const flexibleSchema = z.union([z.string(), z.number().transform(String)]);

// 解決方法2: coerce（強制変換）を使用
const coerceSchema = z.coerce.string();
const result = coerceSchema.parse(123); // "123"

// 解決方法3: 条件分岐
const dynamicSchema = z.union([z.string(), z.number()]);
```

### エラー 6: "Cannot read property 'min' of undefined"

**症状**:

```typescript
const schema = z.string.min(5); // Error: Cannot read property 'min' of undefined
```

**原因**: メソッドチェーンの記法エラー

**解決方法**:

```typescript
// 間違い
const schema = z.string.min(5);

// 正しい記法
const schema = z.string().min(5);
```

---

## ⚠️ バリデーションエラー

### エラー 7: "ZodError: Validation failed"

**症状**:

```typescript
const schema = z.object({
  email: z.string().email(),
  age: z.number().min(0),
});

const data = {
  email: "invalid-email",
  age: -5,
};

const result = schema.parse(data); // ZodError
```

**原因**: データがスキーマの制約に違反している

**解決方法**:

```typescript
// 解決方法1: safeParse()を使用した安全な解析
const result = schema.safeParse(data);

if (result.success) {
  console.log("有効なデータ:", result.data);
} else {
  console.log("バリデーションエラー:");
  result.error.errors.forEach((err) => {
    console.log(`- ${err.path.join(".")}: ${err.message}`);
  });
}

// 解決方法2: エラーハンドリング関数
function handleValidationError(error: z.ZodError) {
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

// 解決方法3: try-catch
try {
  const result = schema.parse(data);
  console.log("パース成功:", result);
} catch (error) {
  if (error instanceof z.ZodError) {
    const fieldErrors = handleValidationError(error);
    console.log("フィールドエラー:", fieldErrors);
  }
}
```

### エラー 8: カスタムバリデーションが機能しない

**症状**:

```typescript
const schema = z.string().refine((val) => {
  return val.length > 5; // この条件が評価されない
});
```

**原因**: refine()の実装や条件の問題

**解決方法**:

```typescript
// 問題の診断1: ログを追加
const schema = z.string().refine(
  (val) => {
    console.log("バリデーション実行:", val); // デバッグログ
    const isValid = val.length > 5;
    console.log("結果:", isValid);
    return isValid;
  },
  {
    message: "6文字以上で入力してください",
  }
);

// 問題の診断2: 段階的なバリデーション
const schema = z
  .string()
  .min(1, "文字列は必須です") // 最初に基本チェック
  .refine((val) => val.length > 5, {
    message: "6文字以上で入力してください",
  });

// 問題の診断3: 非同期バリデーション
const asyncSchema = z.string().refine(async (val) => {
  // 非同期処理が含まれる場合
  await new Promise((resolve) => setTimeout(resolve, 100));
  return val.length > 5;
});

// 使用時
const result = await asyncSchema.parseAsync("test");
```

### エラー 9: "Cannot access 'data' before initialization"

**症状**:

```typescript
const UserSchema = z.object({
  id: z.string(),
  profile: UserProfileSchema, // Error: 相互参照
});

const UserProfileSchema = z.object({
  userId: z.string(),
  user: UserSchema,
});
```

**原因**: スキーマの相互参照による初期化エラー

**解決方法**:

```typescript
// 解決方法1: lazy()を使用した遅延評価
const UserSchema: z.ZodSchema<User> = z.object({
  id: z.string(),
  profile: z.lazy(() => UserProfileSchema).optional(),
});

const UserProfileSchema: z.ZodSchema<UserProfile> = z.object({
  userId: z.string(),
  user: z.lazy(() => UserSchema).optional(),
});

// 型定義
type User = {
  id: string;
  profile?: UserProfile;
};

type UserProfile = {
  userId: string;
  user?: User;
};

// 解決方法2: 相互参照を避けた設計
const BaseUserSchema = z.object({
  id: z.string(),
  name: z.string(),
});

const UserProfileSchema = z.object({
  userId: z.string(),
  bio: z.string(),
});

const UserWithProfileSchema = BaseUserSchema.extend({
  profile: UserProfileSchema.optional(),
});
```

---

## 🅰️ Angular 統合エラー

### エラー 10: "ValidatorFn is not assignable"

**症状**:

```typescript
const validator = zodValidator(z.string()); // Type error
this.formControl = new FormControl("", validator);
```

**原因**: zodValidator 関数の型定義問題

**解決方法**:

```typescript
// 正しいzodValidator実装
import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";
import { z } from "zod";

export function zodValidator(schema: z.ZodSchema<any>): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }

    const result = schema.safeParse(control.value);

    if (result.success) {
      return null;
    } else {
      const errors: ValidationErrors = {};
      result.error.errors.forEach((err) => {
        const key = err.path.length > 0 ? err.path.join(".") : "zodError";
        errors[key] = { message: err.message };
      });
      return errors;
    }
  };
}

// 使用例
this.formControl = new FormControl("", [
  Validators.required,
  zodValidator(z.string().email()),
]);
```

### エラー 11: "Cannot read property 'errors' of null"

**症状**:

```typescript
// テンプレート内
<div *ngIf="formControl.errors.zodError">
  {{ formControl.errors.zodError.message }} <!-- Error -->
</div>
```

**原因**: フォームコントロールのエラーチェックが不適切

**解決方法**:

```typescript
// Angular Component
getFieldError(fieldName: string): string | null {
  const field = this.form.get(fieldName);
  if (field && field.errors && field.touched) {
    // Zodエラーを優先
    for (const errorKey in field.errors) {
      if (field.errors[errorKey]?.message) {
        return field.errors[errorKey].message;
      }
    }

    // 標準エラー
    if (field.errors['required']) {
      return 'この項目は必須です';
    }
  }
  return null;
}

hasFieldError(fieldName: string): boolean {
  const field = this.form.get(fieldName);
  return !!(field && field.errors && field.touched);
}
```

```html
<!-- テンプレート -->
<div class="form-group">
  <input formControlName="email" [class.error]="hasFieldError('email')" />
  <div *ngIf="hasFieldError('email')" class="error-message">
    {{ getFieldError('email') }}
  </div>
</div>
```

### エラー 12: "Http interceptor validation failed"

**症状**:

```typescript
// HTTP通信でレスポンスの型検証が失敗する
this.http.get("/api/users").subscribe((response) => {
  const users = UserSchema.parse(response); // Error: 予期しない型
});
```

**原因**: API レスポンスの形状とスキーマの不一致

**解決方法**:

```typescript
// デバッグ用のログ追加
this.http.get("/api/users").subscribe((response) => {
  console.log("APIレスポンス:", response); // 実際の形状を確認

  // 段階的な検証
  if (Array.isArray(response)) {
    const users = z.array(UserSchema).parse(response);
  } else if (response && typeof response === "object" && "data" in response) {
    const apiResponse = z
      .object({
        data: z.array(UserSchema),
      })
      .parse(response);
    const users = apiResponse.data;
  }
});

// より堅牢なAPI クライアント
class SafeApiClient {
  private handleApiResponse<T>(response: unknown, schema: z.ZodSchema<T>): T {
    // レスポンス形状の推測と検証
    if (response && typeof response === "object") {
      // 一般的なAPIレスポンス形状をチェック
      const possibleShapes = [
        schema, // 直接データ
        z.object({ data: schema }), // { data: ... }
        z.object({ result: schema }), // { result: ... }
        z.object({ success: z.boolean(), data: schema }), // { success, data }
      ];

      for (const shape of possibleShapes) {
        const result = shape.safeParse(response);
        if (result.success) {
          if ("data" in result.data) {
            return (result.data as any).data;
          }
          if ("result" in result.data) {
            return (result.data as any).result;
          }
          return result.data;
        }
      }
    }

    // 全て失敗した場合は詳細なエラー情報を提供
    throw new Error(
      `API response validation failed. Response: ${JSON.stringify(response)}`
    );
  }
}
```

---

## 📊 パフォーマンス問題

### エラー 13: "Memory leak in form validation"

**症状**: フォームバリデーションでメモリ使用量が増加し続ける

**原因**: Zod スキーマの不適切な再作成

**解決方法**:

```typescript
// 問題のあるコード（毎回スキーマを作成）
class BadComponent {
  validateEmail(email: string) {
    const schema = z.string().email(); // 毎回新しいスキーマを作成
    return schema.safeParse(email);
  }
}

// 修正版（スキーマを再利用）
class GoodComponent {
  private static readonly EMAIL_SCHEMA = z.string().email();

  validateEmail(email: string) {
    return GoodComponent.EMAIL_SCHEMA.safeParse(email);
  }
}

// さらに良い方法（スキーマファクトリーパターン）
class SchemaFactory {
  private static schemas = new Map<string, z.ZodSchema<any>>();

  static getEmailSchema(): z.ZodString {
    if (!this.schemas.has("email")) {
      this.schemas.set("email", z.string().email());
    }
    return this.schemas.get("email") as z.ZodString;
  }
}
```

### エラー 14: "Slow validation performance"

**症状**: 大量のデータや複雑なスキーマでバリデーションが遅い

**原因**: 非効率なスキーマ設計や検証方法

**解決方法**:

```typescript
// 問題のあるコード（重い処理を多用）
const SlowSchema = z.object({
  users: z
    .array(
      z.object({
        id: z.string(),
        email: z.string().email(),
      })
    )
    .refine(async (users) => {
      // 重い非同期処理
      for (const user of users) {
        await this.checkEmailUniqueness(user.email);
      }
      return true;
    }),
});

// 修正版1（早期バリデーション失敗）
const FastSchema = z.object({
  users: z
    .array(
      z.object({
        id: z.string().uuid(), // より具体的なバリデーション
        email: z.string().min(1).email(), // 段階的チェック
      })
    )
    .max(100, "一度に処理できるユーザーは100人までです"),
});

// 修正版2（バッチバリデーション）
const BatchSchema = z
  .object({
    users: z.array(
      z.object({
        id: z.string().uuid(),
        email: z.string().email(),
      })
    ),
  })
  .superRefine(async (data, ctx) => {
    // バッチでユニーク性をチェック
    const emails = data.users.map((u) => u.email);
    const duplicates = await this.findDuplicateEmails(emails);

    duplicates.forEach(({ email, indices }) => {
      indices.forEach((index) => {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["users", index, "email"],
          message: `重複するメールアドレス: ${email}`,
        });
      });
    });
  });
```

---

## 🐛 デバッグのコツ

### デバッグ技法 1: 段階的なスキーマ検証

```typescript
// 複雑なスキーマを段階的にデバッグ
const ComplexSchema = z.object({
  user: z.object({
    id: z.string().uuid(),
    profile: z.object({
      name: z.string().min(1),
      email: z.string().email(),
    }),
  }),
  settings: z.object({
    theme: z.enum(["light", "dark"]),
    notifications: z.boolean(),
  }),
});

// デバッグ用の段階的検証
function debugComplexValidation(data: unknown) {
  console.log("1. 基本的な型チェック");
  const basicCheck = z.object({}).safeParse(data);
  if (!basicCheck.success) {
    console.error("基本チェック失敗:", basicCheck.error);
    return;
  }

  console.log("2. ユーザー情報チェック");
  const userCheck = z
    .object({
      user: z.object({}),
    })
    .safeParse(data);
  if (!userCheck.success) {
    console.error("ユーザー情報チェック失敗:", userCheck.error);
    return;
  }

  console.log("3. 完全なスキーマチェック");
  const fullCheck = ComplexSchema.safeParse(data);
  if (!fullCheck.success) {
    console.error("完全チェック失敗:", fullCheck.error);
    return;
  }

  console.log("✅ 全てのチェックが成功");
}
```

### デバッグ技法 2: エラー詳細の可視化

```typescript
// エラー情報の詳細表示
function visualizeZodError(error: z.ZodError) {
  console.group("🚨 Zodバリデーションエラー詳細");

  error.errors.forEach((err, index) => {
    console.group(`エラー ${index + 1}:`);
    console.log("パス:", err.path.join(" → "));
    console.log("コード:", err.code);
    console.log("メッセージ:", err.message);

    if (err.expected) console.log("期待値:", err.expected);
    if (err.received) console.log("実際の値:", err.received);

    console.groupEnd();
  });

  console.log("\n📋 要約:");
  const summary = error.errors.reduce((acc, err) => {
    const path = err.path.join(".");
    acc[path] = err.message;
    return acc;
  }, {} as Record<string, string>);

  console.table(summary);
  console.groupEnd();
}

// 使用例
const result = schema.safeParse(data);
if (!result.success) {
  visualizeZodError(result.error);
}
```

### デバッグ技法 3: スキーマの可視化

```typescript
// スキーマ構造の可視化（開発用）
function describeSchema(schema: z.ZodSchema<any>, depth = 0): void {
  const indent = "  ".repeat(depth);

  if (schema instanceof z.ZodObject) {
    console.log(`${indent}Object {`);
    Object.entries(schema.shape).forEach(([key, value]) => {
      console.log(`${indent}  ${key}:`);
      describeSchema(value as z.ZodSchema<any>, depth + 2);
    });
    console.log(`${indent}}`);
  } else if (schema instanceof z.ZodArray) {
    console.log(`${indent}Array [`);
    describeSchema(schema.element, depth + 1);
    console.log(`${indent}]`);
  } else if (schema instanceof z.ZodString) {
    const checks = (schema as any)._def.checks || [];
    const constraints = checks.map((check: any) => check.kind).join(", ");
    console.log(`${indent}String${constraints ? ` (${constraints})` : ""}`);
  } else if (schema instanceof z.ZodNumber) {
    const checks = (schema as any)._def.checks || [];
    const constraints = checks.map((check: any) => check.kind).join(", ");
    console.log(`${indent}Number${constraints ? ` (${constraints})` : ""}`);
  } else {
    console.log(`${indent}${schema.constructor.name}`);
  }
}

// 使用例
console.log("スキーマ構造:");
describeSchema(UserSchema);
```

### デバッグ技法 4: テストデータ生成

```typescript
// スキーマからテストデータを生成（開発用）
function generateTestData(schema: z.ZodSchema<any>): any {
  if (schema instanceof z.ZodObject) {
    const result: any = {};
    Object.entries(schema.shape).forEach(([key, value]) => {
      result[key] = generateTestData(value as z.ZodSchema<any>);
    });
    return result;
  } else if (schema instanceof z.ZodArray) {
    return [generateTestData(schema.element)];
  } else if (schema instanceof z.ZodString) {
    return "test-string";
  } else if (schema instanceof z.ZodNumber) {
    return 42;
  } else if (schema instanceof z.ZodBoolean) {
    return true;
  } else if (schema instanceof z.ZodDate) {
    return new Date();
  } else if (schema instanceof z.ZodEnum) {
    const options = (schema as any)._def.values;
    return options[0];
  } else if (schema instanceof z.ZodOptional) {
    return Math.random() > 0.5 ? generateTestData(schema.unwrap()) : undefined;
  } else {
    return null;
  }
}

// 使用例
const testData = generateTestData(UserSchema);
console.log("生成されたテストデータ:", testData);

const validation = UserSchema.safeParse(testData);
console.log("テストデータの検証結果:", validation.success);
```

---

## 🔍 よくある質問と解決方法

### Q1: "スキーマが複雑になりすぎて管理しにくい"

**A**: スキーマを小さな単位に分割し、合成パターンを使用する

```typescript
// 悪い例：巨大なスキーマ
const MonolithicSchema = z.object({
  // 100行以上のスキーマ定義...
});

// 良い例：分割されたスキーマ
const AddressSchema = z.object({
  street: z.string(),
  city: z.string(),
  postalCode: z.string(),
});

const ContactSchema = z.object({
  email: z.string().email(),
  phone: z.string().optional(),
});

const UserSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  address: AddressSchema,
  contact: ContactSchema,
});
```

### Q2: "パフォーマンスが気になる場合の最適化方法は？"

**A**: スキーマのキャッシュ、早期リターン、バッチ処理を活用する

```typescript
class OptimizedValidator {
  private static schemaCache = new Map<string, z.ZodSchema<any>>();

  // スキーマキャッシュ
  static getSchema(key: string, factory: () => z.ZodSchema<any>) {
    if (!this.schemaCache.has(key)) {
      this.schemaCache.set(key, factory());
    }
    return this.schemaCache.get(key)!;
  }

  // 早期リターンパターン
  static quickValidate(data: unknown): boolean {
    // 基本チェックで早期リターン
    if (!data || typeof data !== "object") return false;

    // より詳細な検証
    return this.getSchema("user", () => UserSchema).safeParse(data).success;
  }
}
```

このトラブルシューティングガイドを参考に、Zod 学習中に遭遇する問題を効率的に解決してください。エラーが発生した際は、まず該当するセクションを確認し、段階的に問題を特定していくことが大切です。
