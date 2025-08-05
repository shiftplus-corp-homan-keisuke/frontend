# Step07 補足資料: 実践コード例

> 💻 **目的**: 段階的な学習のためのコード例集とベストプラクティス
> 🎯 **対象**: Step07 学習者（Session1-3 全般）
> 📚 **活用方法**: 学習進度に応じて参照・コピー&ペースト・カスタマイズ

---

## 📚 目次

1. [スキーマ基礎](#スキーマ基礎)
2. [バリデーション実装](#バリデーション実装)
3. [API 統合実装](#API統合実装)
4. [Angular 統合完全版](#Angular統合完全版)
5. [実用的なパターン集](#実用的なパターン集)

---

## 🎯 スキーマ基礎

### 基本的なスキーマ定義

```typescript
import { z } from "zod";

// プリミティブ型の基本スキーマ
export const BasicSchemas = {
  // 文字列関連
  requiredString: z.string().min(1, "この項目は必須です"),
  optionalString: z.string().optional(),
  emailString: z.string().email("正しいメールアドレスを入力してください"),
  urlString: z.string().url("正しいURLを入力してください"),

  // 数値関連
  positiveNumber: z.number().positive("正の数を入力してください"),
  integerNumber: z.number().int("整数を入力してください"),
  rangeNumber: z.number().min(0).max(100),

  // 日付関連
  dateString: z.string().datetime("ISO8601形式で入力してください"),
  dateObject: z.date(),

  // 真偽値
  requiredBoolean: z.boolean(),
  optionalBoolean: z.boolean().optional(),
};

// 使用例
const result = BasicSchemas.emailString.safeParse("user@example.com");
console.log(result.success ? result.data : result.error.issues);
```

### 配列とオブジェクトスキーマ

```typescript
// タグシステムのスキーマ例
const TagSchema = z
  .string()
  .min(1, "タグは1文字以上で入力してください")
  .max(20, "タグは20文字以内で入力してください")
  .regex(
    /^[a-zA-Z0-9_-]+$/,
    "タグは英数字、アンダースコア、ハイフンのみ使用可能です"
  );

const TagsArraySchema = z
  .array(TagSchema)
  .min(1, "少なくとも1つのタグを設定してください")
  .max(5, "タグは5個まで設定できます");

// ユーザープロフィールのスキーマ例
const UserProfileSchema = z.object({
  // 基本情報
  id: z.string().uuid(),
  username: z
    .string()
    .min(3, "ユーザー名は3文字以上で入力してください")
    .max(20, "ユーザー名は20文字以内で入力してください")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "ユーザー名は英数字とアンダースコアのみ使用可能です"
    ),
  email: z.string().email("正しいメールアドレスを入力してください"),

  // プロフィール情報
  displayName: z
    .string()
    .max(50, "表示名は50文字以内で入力してください")
    .optional(),
  bio: z
    .string()
    .max(500, "自己紹介は500文字以内で入力してください")
    .optional(),
  website: z.string().url("正しいURLを入力してください").optional(),

  // メタデータ
  tags: TagsArraySchema,
  isActive: z.boolean().default(true),
  lastLoginAt: z.date().optional(),

  // ネストしたオブジェクト
  preferences: z
    .object({
      language: z.enum(["ja", "en", "zh"]).default("ja"),
      timezone: z.string().default("Asia/Tokyo"),
      emailNotifications: z.boolean().default(true),
      theme: z.enum(["light", "dark", "auto"]).default("auto"),
    })
    .optional(),

  // 住所情報（更に複雑なネスト例）
  address: z
    .object({
      country: z.string().min(1),
      postalCode: z
        .string()
        .regex(/^\d{3}-\d{4}$/, "郵便番号は123-4567の形式で入力してください"),
      prefecture: z.string().min(1),
      city: z.string().min(1),
      streetAddress: z.string().min(1),
      building: z.string().optional(),
    })
    .optional(),
});

// 型の自動生成
export type UserProfile = z.infer<typeof UserProfileSchema>;

// 使用例
const sampleUserData = {
  id: "123e4567-e89b-12d3-a456-426614174000",
  username: "yamada_taro",
  email: "yamada@example.com",
  displayName: "山田太郎",
  tags: ["developer", "typescript", "react"],
  preferences: {
    language: "ja" as const,
    theme: "dark" as const,
  },
};

const validationResult = UserProfileSchema.safeParse(sampleUserData);
console.log("バリデーション結果:", validationResult);
```

### Enum とユニオン型

```typescript
// 列挙型の定義
const OrderStatusSchema = z.enum([
  "pending", // 保留中
  "confirmed", // 確認済み
  "processing", // 処理中
  "shipped", // 発送済み
  "delivered", // 配達完了
  "cancelled", // キャンセル
]);

const PaymentMethodSchema = z.enum([
  "credit_card",
  "debit_card",
  "paypal",
  "bank_transfer",
  "cash_on_delivery",
]);

// ユニオン型の活用
const ContactMethodSchema = z.union([
  z.object({
    type: z.literal("email"),
    value: z.string().email(),
  }),
  z.object({
    type: z.literal("phone"),
    value: z
      .string()
      .regex(/^[\d-+().\s]+$/, "正しい電話番号を入力してください"),
  }),
  z.object({
    type: z.literal("address"),
    value: z.object({
      street: z.string(),
      city: z.string(),
      postalCode: z.string(),
    }),
  }),
]);

// 判別ユニオン（Discriminated Union）
const NotificationSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("email"),
    subject: z.string(),
    body: z.string(),
    recipients: z.array(z.string().email()),
  }),
  z.object({
    type: z.literal("sms"),
    message: z.string().max(160),
    phoneNumbers: z.array(z.string()),
  }),
  z.object({
    type: z.literal("push"),
    title: z.string(),
    body: z.string(),
    deviceTokens: z.array(z.string()),
  }),
]);

export type Notification = z.infer<typeof NotificationSchema>;
```

---

## 🔧 バリデーション実装

### カスタムバリデーション関数

```typescript
// 日本の郵便番号バリデーション
const JapanesePostalCodeSchema = z
  .string()
  .regex(/^\d{3}-\d{4}$/, "郵便番号は123-4567の形式で入力してください")
  .refine((code) => {
    // より詳細な郵便番号バリデーション
    const [first, second] = code.split("-");
    return first !== "000" && second !== "0000";
  }, "無効な郵便番号です");

// パスワード強度チェック
const StrongPasswordSchema = z
  .string()
  .min(8, "パスワードは8文字以上で入力してください")
  .refine((password) => /[a-z]/.test(password), {
    message: "小文字を含める必要があります",
  })
  .refine((password) => /[A-Z]/.test(password), {
    message: "大文字を含める必要があります",
  })
  .refine((password) => /[0-9]/.test(password), {
    message: "数字を含める必要があります",
  })
  .refine((password) => /[^a-zA-Z0-9]/.test(password), {
    message: "特殊文字を含める必要があります",
  });

// 年齢計算バリデーション
const BirthDateSchema = z
  .date()
  .refine((date) => {
    const today = new Date();
    const age = today.getFullYear() - date.getFullYear();
    return age >= 0 && age <= 150;
  }, "有効な生年月日を入力してください")
  .transform((date) => {
    const today = new Date();
    let age = today.getFullYear() - date.getFullYear();
    if (
      today < new Date(today.getFullYear(), date.getMonth(), date.getDate())
    ) {
      age--;
    }
    return { birthDate: date, age };
  });
```

### 複雑なバリデーションロジック

```typescript
// イベント予約システムの複雑なバリデーション
const EventReservationSchema = z
  .object({
    eventName: z.string().min(1).max(100),
    eventDate: z.date(),
    capacity: z.number().min(1).max(1000),
    participants: z.array(
      z.object({
        name: z.string().min(1),
        email: z.string().email(),
        age: z.number().min(0).max(150),
      })
    ),
  })
  .superRefine((data, ctx) => {
    // 1. 参加者数が定員を超えていないかチェック
    if (data.participants.length > data.capacity) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["participants"],
        message: `参加者数(${data.participants.length})が定員(${data.capacity})を超えています`,
      });
    }

    // 2. イベント日時が未来の日時かチェック
    if (data.eventDate <= new Date()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["eventDate"],
        message: "イベント日時は現在より未来の日時を設定してください",
      });
    }

    // 3. 参加者のメールアドレス重複チェック
    const emails = data.participants.map((p) => p.email);
    const duplicateEmails = emails.filter(
      (email, index) => emails.indexOf(email) !== index
    );
    if (duplicateEmails.length > 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["participants"],
        message: `重複するメールアドレスがあります: ${duplicateEmails.join(
          ", "
        )}`,
      });
    }

    // 4. 未成年者が含まれる場合の特別処理
    const hasMinor = data.participants.some((p) => p.age < 18);
    if (hasMinor && !data.eventName.includes("[未成年者含む]")) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["eventName"],
        message:
          "18歳未満の参加者が含まれる場合、イベント名に「[未成年者含む]」を含めてください",
      });
    }
  });

// 財務データの複雑なバリデーション
const InvoiceSchema = z
  .object({
    invoiceNumber: z
      .string()
      .regex(/^INV-\d{4}-\d{6}$/, "請求書番号の形式が正しくありません"),
    issueDate: z.date(),
    dueDate: z.date(),
    items: z
      .array(
        z.object({
          name: z.string().min(1),
          quantity: z.number().positive(),
          unitPrice: z.number().positive(),
          taxRate: z.number().min(0).max(1),
        })
      )
      .min(1, "請求項目は1つ以上必要です"),
    discountRate: z.number().min(0).max(1).default(0),
    currency: z.enum(["JPY", "USD", "EUR"]).default("JPY"),
  })
  .superRefine((data, ctx) => {
    // 支払期限が発行日より後かチェック
    if (data.dueDate <= data.issueDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["dueDate"],
        message: "支払期限は発行日より後の日付を設定してください",
      });
    }

    // 合計金額の計算と検証
    const subtotal = data.items.reduce((sum, item) => {
      return sum + item.quantity * item.unitPrice;
    }, 0);

    const totalTax = data.items.reduce((sum, item) => {
      return sum + item.quantity * item.unitPrice * item.taxRate;
    }, 0);

    const discountAmount = subtotal * data.discountRate;
    const total = subtotal + totalTax - discountAmount;

    // 異常に高額な請求のチェック
    if (total > 10000000) {
      // 1000万円以上
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["items"],
        message: "請求金額が異常に高額です。確認してください",
      });
    }
  })
  .transform((data) => {
    // 計算結果を追加
    const subtotal = data.items.reduce((sum, item) => {
      return sum + item.quantity * item.unitPrice;
    }, 0);

    const totalTax = data.items.reduce((sum, item) => {
      return sum + item.quantity * item.unitPrice * item.taxRate;
    }, 0);

    const discountAmount = subtotal * data.discountRate;
    const total = subtotal + totalTax - discountAmount;

    return {
      ...data,
      calculations: {
        subtotal,
        totalTax,
        discountAmount,
        total,
      },
    };
  });

export type Invoice = z.infer<typeof InvoiceSchema>;
```

---

## 🌐 API 統合実装

### 基本的な API クライアント

```typescript
import { z } from "zod";

// 共通のAPIレスポンス形状
const ApiResponseSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
  timestamp: z.string().datetime(),
});

const ApiErrorResponseSchema = ApiResponseSchema.extend({
  success: z.literal(false),
  error: z.object({
    code: z.string(),
    message: z.string(),
    details: z.unknown().optional(),
  }),
});

const ApiSuccessResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  ApiResponseSchema.extend({
    success: z.literal(true),
    data: dataSchema,
  });

// ユーザー関連のスキーマ
const UserSchema = z.object({
  id: z.string().uuid(),
  username: z.string(),
  email: z.string().email(),
  displayName: z.string().optional(),
  isActive: z.boolean(),
  createdAt: z
    .string()
    .datetime()
    .transform((str) => new Date(str)),
  updatedAt: z
    .string()
    .datetime()
    .transform((str) => new Date(str)),
});

const CreateUserRequestSchema = UserSchema.omit({
  id: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
});

const UpdateUserRequestSchema = CreateUserRequestSchema.partial();

// APIクライアントの実装
class UserApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async getUsers(): Promise<z.infer<typeof UserSchema>[]> {
    const response = await fetch(`${this.baseUrl}/users`);
    const jsonData = await response.json();

    const UsersResponseSchema = ApiSuccessResponseSchema(z.array(UserSchema));
    const result = UsersResponseSchema.safeParse(jsonData);

    if (result.success) {
      return result.data.data;
    } else {
      throw new Error(
        `API response validation failed: ${result.error.message}`
      );
    }
  }

  async getUserById(id: string): Promise<z.infer<typeof UserSchema>> {
    const response = await fetch(`${this.baseUrl}/users/${id}`);
    const jsonData = await response.json();

    if (!response.ok) {
      const errorResult = ApiErrorResponseSchema.safeParse(jsonData);
      if (errorResult.success) {
        throw new Error(errorResult.data.error.message);
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    }

    const UserResponseSchema = ApiSuccessResponseSchema(UserSchema);
    const result = UserResponseSchema.safeParse(jsonData);

    if (result.success) {
      return result.data.data;
    } else {
      throw new Error(
        `API response validation failed: ${result.error.message}`
      );
    }
  }

  async createUser(
    userData: z.infer<typeof CreateUserRequestSchema>
  ): Promise<z.infer<typeof UserSchema>> {
    // リクエストデータの検証
    const validatedData = CreateUserRequestSchema.parse(userData);

    const response = await fetch(`${this.baseUrl}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(validatedData),
    });

    const jsonData = await response.json();

    if (!response.ok) {
      const errorResult = ApiErrorResponseSchema.safeParse(jsonData);
      if (errorResult.success) {
        throw new Error(errorResult.data.error.message);
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    }

    const UserResponseSchema = ApiSuccessResponseSchema(UserSchema);
    const result = UserResponseSchema.safeParse(jsonData);

    if (result.success) {
      return result.data.data;
    } else {
      throw new Error(
        `API response validation failed: ${result.error.message}`
      );
    }
  }

  async updateUser(
    id: string,
    userData: z.infer<typeof UpdateUserRequestSchema>
  ): Promise<z.infer<typeof UserSchema>> {
    const validatedData = UpdateUserRequestSchema.parse(userData);

    const response = await fetch(`${this.baseUrl}/users/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(validatedData),
    });

    const jsonData = await response.json();

    if (!response.ok) {
      const errorResult = ApiErrorResponseSchema.safeParse(jsonData);
      if (errorResult.success) {
        throw new Error(errorResult.data.error.message);
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    }

    const UserResponseSchema = ApiSuccessResponseSchema(UserSchema);
    const result = UserResponseSchema.safeParse(jsonData);

    if (result.success) {
      return result.data.data;
    } else {
      throw new Error(
        `API response validation failed: ${result.error.message}`
      );
    }
  }

  async deleteUser(id: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/users/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const jsonData = await response.json();
      const errorResult = ApiErrorResponseSchema.safeParse(jsonData);
      if (errorResult.success) {
        throw new Error(errorResult.data.error.message);
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    }
  }
}

// 使用例
const userClient = new UserApiClient("https://api.example.com");

// ユーザー作成
userClient
  .createUser({
    username: "new_user",
    email: "newuser@example.com",
    displayName: "新しいユーザー",
  })
  .then((user) => {
    console.log("作成されたユーザー:", user);
  })
  .catch((error) => {
    console.error("ユーザー作成エラー:", error);
  });
```

### 高度な API パターン

```typescript
// ページネーション対応
const PaginationSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
  total: z.number().min(0),
  totalPages: z.number().min(0),
  hasNext: z.boolean(),
  hasPrev: z.boolean(),
});

const PaginatedResponseSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
  ApiSuccessResponseSchema(
    z.object({
      items: z.array(itemSchema),
      pagination: PaginationSchema,
    })
  );

// 検索・フィルタリング対応
const UserSearchParamsSchema = z.object({
  query: z.string().optional(),
  isActive: z.boolean().optional(),
  createdAfter: z.string().datetime().optional(),
  createdBefore: z.string().datetime().optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
  sortBy: z
    .enum(["createdAt", "updatedAt", "username", "email"])
    .default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

class AdvancedUserApiClient extends UserApiClient {
  async searchUsers(params: z.infer<typeof UserSearchParamsSchema>) {
    const validatedParams = UserSearchParamsSchema.parse(params);

    const queryString = new URLSearchParams();
    Object.entries(validatedParams).forEach(([key, value]) => {
      if (value !== undefined) {
        queryString.append(key, String(value));
      }
    });

    const response = await fetch(`${this.baseUrl}/users/search?${queryString}`);
    const jsonData = await response.json();

    const SearchResponseSchema = PaginatedResponseSchema(UserSchema);
    const result = SearchResponseSchema.safeParse(jsonData);

    if (result.success) {
      return result.data.data;
    } else {
      throw new Error(
        `Search response validation failed: ${result.error.message}`
      );
    }
  }

  // バッチ操作
  async batchUpdateUsers(
    updates: Array<{
      id: string;
      data: z.infer<typeof UpdateUserRequestSchema>;
    }>
  ) {
    const BatchUpdateSchema = z.array(
      z.object({
        id: z.string().uuid(),
        data: UpdateUserRequestSchema,
      })
    );

    const validatedUpdates = BatchUpdateSchema.parse(updates);

    const response = await fetch(`${this.baseUrl}/users/batch`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ updates: validatedUpdates }),
    });

    const jsonData = await response.json();

    const BatchResponseSchema = ApiSuccessResponseSchema(
      z.object({
        updated: z.array(UserSchema),
        errors: z.array(
          z.object({
            id: z.string(),
            error: z.string(),
          })
        ),
      })
    );

    const result = BatchResponseSchema.safeParse(jsonData);

    if (result.success) {
      return result.data.data;
    } else {
      throw new Error(
        `Batch update response validation failed: ${result.error.message}`
      );
    }
  }
}
```

---

## 📱 Angular 統合完全版

### Zod バリデータの完全実装

```typescript
// validators/zod-validator.ts
import {
  AbstractControl,
  AsyncValidatorFn,
  ValidationErrors,
  ValidatorFn,
} from "@angular/forms";
import { Observable, of } from "rxjs";
import { map, catchError } from "rxjs/operators";
import { z } from "zod";

export function zodValidator(schema: z.ZodSchema<any>): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null; // 空の値は他のバリデータ（required等）に任せる
    }

    const result = schema.safeParse(control.value);

    if (result.success) {
      return null; // バリデーション成功
    } else {
      // Zodのエラーを Angular の ValidationErrors 形式に変換
      const errors: ValidationErrors = {};
      result.error.errors.forEach((err) => {
        const key = err.path.length > 0 ? err.path.join(".") : "zodError";
        errors[key] = {
          message: err.message,
          code: err.code,
          expected: err.expected,
          received: err.received,
        };
      });
      return errors;
    }
  };
}

export function zodAsyncValidator(schema: z.ZodSchema<any>): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    if (!control.value) {
      return of(null);
    }

    return new Observable((observer) => {
      schema
        .parseAsync(control.value)
        .then(() => {
          observer.next(null);
          observer.complete();
        })
        .catch((error: z.ZodError) => {
          const errors: ValidationErrors = {};
          error.errors.forEach((err) => {
            const key = err.path.length > 0 ? err.path.join(".") : "zodError";
            errors[key] = {
              message: err.message,
              code: err.code,
              expected: err.expected,
              received: err.received,
            };
          });
          observer.next(errors);
          observer.complete();
        });
    });
  };
}

// フォーム全体のZodバリデーション
export function zodFormValidator(schema: z.ZodSchema<any>): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const result = schema.safeParse(control.value);

    if (result.success) {
      return null;
    } else {
      const errors: ValidationErrors = {};
      result.error.errors.forEach((err) => {
        const path = err.path.join(".");
        if (!errors[path]) {
          errors[path] = [];
        }
        if (Array.isArray(errors[path])) {
          errors[path].push(err.message);
        } else {
          errors[path] = [err.message];
        }
      });
      return { zodForm: errors };
    }
  };
}
```

### 動的フォーム生成システム

```typescript
// services/dynamic-form.service.ts
import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { z } from "zod";
import { zodValidator } from "../validators/zod-validator";

interface FieldConfig {
  key: string;
  label: string;
  type:
    | "text"
    | "email"
    | "password"
    | "number"
    | "textarea"
    | "select"
    | "checkbox"
    | "date";
  placeholder?: string;
  options?: Array<{ value: any; label: string }>;
  schema: z.ZodSchema<any>;
  required?: boolean;
  disabled?: boolean;
  help?: string;
}

interface FormConfig {
  fields: FieldConfig[];
  schema: z.ZodSchema<any>;
}

@Injectable({
  providedIn: "root",
})
export class DynamicFormService {
  constructor(private fb: FormBuilder) {}

  createFormGroup(config: FormConfig): FormGroup {
    const group: { [key: string]: any } = {};

    config.fields.forEach((field) => {
      const validators = [];

      if (field.required) {
        validators.push(Validators.required);
      }

      validators.push(zodValidator(field.schema));

      group[field.key] = [
        {
          value: this.getDefaultValue(field),
          disabled: field.disabled || false,
        },
        validators,
      ];
    });

    const formGroup = this.fb.group(group);

    // フォーム全体のZodバリデーションを追加
    formGroup.setValidators(zodFormValidator(config.schema));

    return formGroup;
  }

  private getDefaultValue(field: FieldConfig): any {
    switch (field.type) {
      case "checkbox":
        return false;
      case "number":
        return null;
      case "select":
        return field.options?.[0]?.value || null;
      default:
        return "";
    }
  }

  getFieldError(formGroup: FormGroup, fieldKey: string): string | null {
    const field = formGroup.get(fieldKey);
    if (field && field.errors && field.touched) {
      // Zodエラーを優先
      for (const errorKey in field.errors) {
        if (field.errors[errorKey]?.message) {
          return field.errors[errorKey].message;
        }
      }

      // 標準エラー
      if (field.errors["required"]) {
        return "この項目は必須です";
      }
      if (field.errors["email"]) {
        return "正しいメールアドレスを入力してください";
      }
    }
    return null;
  }
}
```

### 完全なタスク管理コンポーネント

```typescript
// components/task-manager.component.ts
import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Subject } from "rxjs";
import { takeUntil, debounceTime, distinctUntilChanged } from "rxjs/operators";
import { z } from "zod";
import { zodValidator } from "../validators/zod-validator";
import { TaskService } from "../services/task.service";
import { DynamicFormService } from "../services/dynamic-form.service";

// タスクスキーマの定義
const TaskSchema = z.object({
  id: z.string().uuid(),
  title: z
    .string()
    .min(1, "タイトルは必須です")
    .max(100, "タイトルは100文字以内で入力してください"),
  description: z
    .string()
    .max(500, "説明は500文字以内で入力してください")
    .optional(),
  status: z.enum(["todo", "in-progress", "done"]),
  priority: z.enum(["low", "medium", "high"]),
  dueDate: z
    .string()
    .datetime()
    .transform((str) => new Date(str))
    .optional(),
  tags: z.array(z.string()).max(5, "タグは5個まで設定できます"),
  assigneeId: z.string().uuid().optional(),
  createdAt: z
    .string()
    .datetime()
    .transform((str) => new Date(str)),
  updatedAt: z
    .string()
    .datetime()
    .transform((str) => new Date(str)),
});

const CreateTaskSchema = TaskSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  status: z.enum(["todo", "in-progress", "done"]).default("todo"),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
  tags: z.array(z.string()).default([]),
});

const UpdateTaskSchema = TaskSchema.partial().omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

type Task = z.infer<typeof TaskSchema>;
type CreateTask = z.infer<typeof CreateTaskSchema>;
type UpdateTask = z.infer<typeof UpdateTaskSchema>;

@Component({
  selector: "app-task-manager",
  template: `
    <div class="task-manager">
      <!-- ヘッダー -->
      <header class="header">
        <h1>タスク管理</h1>
        <div class="header-actions">
          <button class="btn btn-primary" (click)="openCreateDialog()">
            <i class="icon-plus"></i>
            新しいタスクを作成
          </button>
        </div>
      </header>

      <!-- 検索・フィルター -->
      <div class="filters-section">
        <div class="search-box">
          <input
            type="text"
            placeholder="タスクを検索..."
            [(ngModel)]="searchQuery"
            (input)="onSearchChange($event)"
            class="search-input"
          />
        </div>

        <div class="filters">
          <select
            [(ngModel)]="statusFilter"
            (change)="applyFilters()"
            class="filter-select"
          >
            <option value="">すべてのステータス</option>
            <option value="todo">未着手</option>
            <option value="in-progress">進行中</option>
            <option value="done">完了</option>
          </select>

          <select
            [(ngModel)]="priorityFilter"
            (change)="applyFilters()"
            class="filter-select"
          >
            <option value="">すべての優先度</option>
            <option value="high">高</option>
            <option value="medium">中</option>
            <option value="low">低</option>
          </select>

          <button class="btn btn-secondary" (click)="clearFilters()">
            フィルターをクリア
          </button>
        </div>
      </div>

      <!-- 統計情報 -->
      <div class="stats">
        <div class="stat-card">
          <h3>{{ getTaskCount("todo") }}</h3>
          <p>未着手</p>
        </div>
        <div class="stat-card">
          <h3>{{ getTaskCount("in-progress") }}</h3>
          <p>進行中</p>
        </div>
        <div class="stat-card">
          <h3>{{ getTaskCount("done") }}</h3>
          <p>完了</p>
        </div>
        <div class="stat-card">
          <h3>{{ getOverdueTasks().length }}</h3>
          <p>期限切れ</p>
        </div>
      </div>

      <!-- タスクボード -->
      <div class="task-board">
        <div class="column" *ngFor="let status of statuses">
          <div class="column-header">
            <h3>{{ getStatusLabel(status) }}</h3>
            <span class="task-count">{{
              getTasksByStatus(status).length
            }}</span>
          </div>

          <div
            class="task-list"
            cdkDropList
            [cdkDropListData]="getTasksByStatus(status)"
            (cdkDropListDropped)="onTaskDrop($event)"
          >
            <div
              *ngFor="
                let task of getTasksByStatus(status);
                trackBy: trackByTaskId
              "
              class="task-card"
              [class.high-priority]="task.priority === 'high'"
              [class.medium-priority]="task.priority === 'medium'"
              [class.low-priority]="task.priority === 'low'"
              [class.overdue]="isOverdue(task)"
              cdkDrag
            >
              <div class="task-header">
                <h4 class="task-title">{{ task.title }}</h4>
                <div class="task-actions">
                  <button
                    class="btn-icon"
                    (click)="editTask(task)"
                    title="編集"
                  >
                    <i class="icon-edit"></i>
                  </button>
                  <button
                    class="btn-icon btn-danger"
                    (click)="deleteTask(task.id)"
                    title="削除"
                  >
                    <i class="icon-delete"></i>
                  </button>
                </div>
              </div>

              <p *ngIf="task.description" class="task-description">
                {{ task.description }}
              </p>

              <div class="task-meta">
                <span class="priority" [class]="task.priority">
                  {{ getPriorityLabel(task.priority) }}
                </span>
                <span
                  *ngIf="task.dueDate"
                  class="due-date"
                  [class.overdue]="isOverdue(task)"
                >
                  期限: {{ task.dueDate | date : "MM/dd HH:mm" }}
                </span>
              </div>

              <div class="tags" *ngIf="task.tags.length > 0">
                <span *ngFor="let tag of task.tags" class="tag">{{ tag }}</span>
              </div>

              <div class="task-footer">
                <small class="created-date">
                  作成: {{ task.createdAt | date : "MM/dd HH:mm" }}
                </small>
              </div>
            </div>

            <div
              *ngIf="getTasksByStatus(status).length === 0"
              class="empty-column"
            >
              <p>タスクがありません</p>
            </div>
          </div>
        </div>
      </div>

      <!-- タスクフォームモーダル -->
      <div *ngIf="showTaskForm" class="modal-overlay" (click)="closeTaskForm()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3>{{ editingTask ? "タスクを編集" : "新しいタスクを作成" }}</h3>
            <button class="btn-close" (click)="closeTaskForm()">&times;</button>
          </div>

          <form
            [formGroup]="taskForm"
            (ngSubmit)="submitTask()"
            class="task-form"
          >
            <div class="form-group">
              <label for="title">タイトル *</label>
              <input
                id="title"
                formControlName="title"
                type="text"
                class="form-control"
                [class.error]="hasFieldError('title')"
              />
              <div *ngIf="hasFieldError('title')" class="error-message">
                {{ getFieldError("title") }}
              </div>
            </div>

            <div class="form-group">
              <label for="description">説明</label>
              <textarea
                id="description"
                formControlName="description"
                rows="3"
                class="form-control"
                [class.error]="hasFieldError('description')"
              ></textarea>
              <div *ngIf="hasFieldError('description')" class="error-message">
                {{ getFieldError("description") }}
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="status">ステータス</label>
                <select
                  id="status"
                  formControlName="status"
                  class="form-control"
                >
                  <option value="todo">未着手</option>
                  <option value="in-progress">進行中</option>
                  <option value="done">完了</option>
                </select>
              </div>

              <div class="form-group">
                <label for="priority">優先度</label>
                <select
                  id="priority"
                  formControlName="priority"
                  class="form-control"
                >
                  <option value="low">低</option>
                  <option value="medium">中</option>
                  <option value="high">高</option>
                </select>
              </div>
            </div>

            <div class="form-group">
              <label for="dueDate">期限</label>
              <input
                id="dueDate"
                formControlName="dueDate"
                type="datetime-local"
                class="form-control"
                [class.error]="hasFieldError('dueDate')"
              />
              <div *ngIf="hasFieldError('dueDate')" class="error-message">
                {{ getFieldError("dueDate") }}
              </div>
            </div>

            <div class="form-group">
              <label for="tags">タグ (カンマ区切り)</label>
              <input
                id="tags"
                formControlName="tagsInput"
                type="text"
                class="form-control"
                placeholder="例: 重要, 緊急, レビュー"
                [class.error]="hasFieldError('tags')"
              />
              <div *ngIf="hasFieldError('tags')" class="error-message">
                {{ getFieldError("tags") }}
              </div>
              <small class="help-text">タグは5個まで設定できます</small>
            </div>

            <div class="form-actions">
              <button
                type="button"
                class="btn btn-secondary"
                (click)="closeTaskForm()"
              >
                キャンセル
              </button>
              <button
                type="submit"
                class="btn btn-primary"
                [disabled]="taskForm.invalid || isSubmitting"
              >
                <span *ngIf="isSubmitting" class="spinner"></span>
                {{ editingTask ? "更新" : "作成" }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- ローディング表示 -->
      <div *ngIf="isLoading" class="loading-overlay">
        <div class="spinner-large"></div>
        <p>読み込み中...</p>
      </div>
    </div>
  `,
  styleUrls: ["./task-manager.component.scss"],
})
export class TaskManagerComponent implements OnInit, OnDestroy {
  // データ
  tasks: Task[] = [];
  filteredTasks: Task[] = [];

  // フィルター
  searchQuery = "";
  statusFilter = "";
  priorityFilter = "";

  // UI状態
  showTaskForm = false;
  editingTask: Task | null = null;
  isLoading = false;
  isSubmitting = false;

  // フォーム
  taskForm: FormGroup;

  // その他
  readonly statuses: Task["status"][] = ["todo", "in-progress", "done"];
  private destroy$ = new Subject<void>();

  constructor(
    private taskService: TaskService,
    private fb: FormBuilder,
    private dynamicFormService: DynamicFormService
  ) {
    this.taskForm = this.createTaskForm();
  }

  ngOnInit() {
    this.loadTasks();
    this.setupSearch();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private createTaskForm(): FormGroup {
    return this.fb.group({
      title: [
        "",
        [Validators.required, zodValidator(CreateTaskSchema.shape.title)],
      ],
      description: ["", [zodValidator(CreateTaskSchema.shape.description)]],
      status: ["todo"],
      priority: ["medium"],
      dueDate: [""],
      tagsInput: [""], // カンマ区切りの文字列入力用
    });
  }

  private setupSearch() {
    // 検索クエリの変更を監視（デバウンス付き）
    this.taskForm
      .get("searchQuery")
      ?.valueChanges.pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.applyFilters();
      });
  }

  // データ読み込み
  loadTasks() {
    this.isLoading = true;
    this.taskService.getTasks().subscribe({
      next: (tasks) => {
        this.tasks = tasks;
        this.applyFilters();
        this.isLoading = false;
      },
      error: (error) => {
        console.error("Failed to load tasks:", error);
        this.isLoading = false;
        // エラー通知の表示
      },
    });
  }

  // フィルタリング
  onSearchChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchQuery = target.value;
    this.applyFilters();
  }

  applyFilters() {
    this.filteredTasks = this.tasks.filter((task) => {
      const searchMatch =
        !this.searchQuery ||
        task.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        (task.description &&
          task.description
            .toLowerCase()
            .includes(this.searchQuery.toLowerCase()));

      const statusMatch =
        !this.statusFilter || task.status === this.statusFilter;
      const priorityMatch =
        !this.priorityFilter || task.priority === this.priorityFilter;

      return searchMatch && statusMatch && priorityMatch;
    });
  }

  clearFilters() {
    this.searchQuery = "";
    this.statusFilter = "";
    this.priorityFilter = "";
    this.applyFilters();
  }

  // タスク操作
  getTasksByStatus(status: Task["status"]): Task[] {
    return this.filteredTasks.filter((task) => task.status === status);
  }

  getTaskCount(status: Task["status"]): number {
    return this.tasks.filter((task) => task.status === status).length;
  }

  getOverdueTasks(): Task[] {
    const now = new Date();
    return this.tasks.filter(
      (task) => task.dueDate && task.dueDate < now && task.status !== "done"
    );
  }

  isOverdue(task: Task): boolean {
    return task.dueDate
      ? task.dueDate < new Date() && task.status !== "done"
      : false;
  }

  // ラベル取得
  getStatusLabel(status: Task["status"]): string {
    const labels = {
      todo: "未着手",
      "in-progress": "進行中",
      done: "完了",
    };
    return labels[status];
  }

  getPriorityLabel(priority: Task["priority"]): string {
    const labels = {
      high: "高",
      medium: "中",
      low: "低",
    };
    return labels[priority];
  }

  // フォーム操作
  openCreateDialog() {
    this.editingTask = null;
    this.taskForm.reset({
      status: "todo",
      priority: "medium",
    });
    this.showTaskForm = true;
  }

  editTask(task: Task) {
    this.editingTask = task;
    this.taskForm.patchValue({
      title: task.title,
      description: task.description || "",
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate ? task.dueDate.toISOString().slice(0, 16) : "",
      tagsInput: task.tags.join(", "),
    });
    this.showTaskForm = true;
  }

  closeTaskForm() {
    this.showTaskForm = false;
    this.editingTask = null;
    this.taskForm.reset();
  }

  submitTask() {
    if (this.taskForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      const formValue = this.taskForm.value;

      // タグを文字列から配列に変換
      const tags = formValue.tagsInput
        ? formValue.tagsInput
            .split(",")
            .map((tag: string) => tag.trim())
            .filter((tag: string) => tag)
        : [];

      const taskData = {
        title: formValue.title,
        description: formValue.description || undefined,
        status: formValue.status,
        priority: formValue.priority,
        dueDate: formValue.dueDate
          ? new Date(formValue.dueDate).toISOString()
          : undefined,
        tags: tags,
      };

      const operation = this.editingTask
        ? this.taskService.updateTask(this.editingTask.id, taskData)
        : this.taskService.createTask(taskData as CreateTask);

      operation.subscribe({
        next: () => {
          this.loadTasks();
          this.closeTaskForm();
          this.isSubmitting = false;
          // 成功通知の表示
        },
        error: (error) => {
          console.error("Failed to save task:", error);
          this.isSubmitting = false;
          // エラー通知の表示
        },
      });
    }
  }

  deleteTask(taskId: string) {
    if (confirm("このタスクを削除しますか？")) {
      this.taskService.deleteTask(taskId).subscribe({
        next: () => {
          this.loadTasks();
          // 成功通知の表示
        },
        error: (error) => {
          console.error("Failed to delete task:", error);
          // エラー通知の表示
        },
      });
    }
  }

  // ドラッグ&ドロップ
  onTaskDrop(event: any) {
    // ドラッグ&ドロップによるステータス変更の実装
    // CdkDragDropを使用した実装
  }

  // ユーティリティ
  trackByTaskId(index: number, task: Task): string {
    return task.id;
  }

  // フォームバリデーション
  hasFieldError(fieldName: string): boolean {
    const field = this.taskForm.get(fieldName);
    return !!(field && field.errors && field.touched);
  }

  getFieldError(fieldName: string): string | null {
    return this.dynamicFormService.getFieldError(this.taskForm, fieldName);
  }
}
```

---

## 🎯 実用的なパターン集

### スキーマ設計パターン

```typescript
// 1. 継承パターン
class SchemaBuilder {
  static createEntitySchema<T extends Record<string, z.ZodTypeAny>>(
    fields: T,
    options?: {
      withTimestamps?: boolean;
      withAudit?: boolean;
      withSoftDelete?: boolean;
    }
  ) {
    let schema = z.object(fields);

    if (options?.withTimestamps) {
      schema = schema.extend({
        createdAt: z.date(),
        updatedAt: z.date(),
      });
    }

    if (options?.withAudit) {
      schema = schema.extend({
        createdBy: z.string().uuid(),
        updatedBy: z.string().uuid(),
      });
    }

    if (options?.withSoftDelete) {
      schema = schema.extend({
        deletedAt: z.date().optional(),
        deletedBy: z.string().uuid().optional(),
      });
    }

    return schema;
  }

  static createCrudSchemas<T extends z.ZodRawShape>(
    baseSchema: z.ZodObject<T>
  ) {
    const fieldsToOmit = [
      "id",
      "createdAt",
      "updatedAt",
      "createdBy",
      "updatedBy",
    ] as const;

    return {
      base: baseSchema,
      create: baseSchema.omit(
        Object.fromEntries(fieldsToOmit.map((f) => [f, true]))
      ),
      update: baseSchema
        .omit(Object.fromEntries(fieldsToOmit.map((f) => [f, true])))
        .partial(),
      list: baseSchema.pick({
        id: true,
        ...(baseSchema.shape.title && { title: true }),
        ...(baseSchema.shape.name && { name: true }),
        ...(baseSchema.shape.status && { status: true }),
        createdAt: true,
      } as any),
      search: z.object({
        query: z.string().optional(),
        limit: z.number().min(1).max(100).default(20),
        offset: z.number().min(0).default(0),
        sortBy: z.string().optional(),
        sortOrder: z.enum(["asc", "desc"]).default("desc"),
      }),
    };
  }
}

// 使用例
const UserSchema = SchemaBuilder.createEntitySchema(
  {
    id: z.string().uuid(),
    username: z.string(),
    email: z.string().email(),
    isActive: z.boolean().default(true),
  },
  {
    withTimestamps: true,
    withAudit: true,
  }
);

const UserSchemas = SchemaBuilder.createCrudSchemas(UserSchema);

export type User = z.infer<typeof UserSchema>;
export type CreateUser = z.infer<typeof UserSchemas.create>;
export type UpdateUser = z.infer<typeof UserSchemas.update>;
```

### エラーハンドリングパターン

```typescript
// カスタムエラークラス
export class ValidationError extends Error {
  constructor(
    public fieldErrors: Record<string, string[]>,
    message = "Validation failed"
  ) {
    super(message);
    this.name = "ValidationError";
  }

  static fromZodError(error: z.ZodError): ValidationError {
    const fieldErrors: Record<string, string[]> = {};

    error.errors.forEach((err) => {
      const field = err.path.join(".");
      if (!fieldErrors[field]) {
        fieldErrors[field] = [];
      }
      fieldErrors[field].push(err.message);
    });

    return new ValidationError(fieldErrors);
  }
}

// バリデーション結果の型安全な処理
export class Result<T, E = Error> {
  constructor(
    private readonly _success: boolean,
    private readonly _data?: T,
    private readonly _error?: E
  ) {}

  static success<T>(data: T): Result<T> {
    return new Result(true, data);
  }

  static failure<E>(error: E): Result<never, E> {
    return new Result(false, undefined, error);
  }

  get success(): boolean {
    return this._success;
  }

  get data(): T {
    if (!this._success || this._data === undefined) {
      throw new Error("Cannot access data of failed result");
    }
    return this._data;
  }

  get error(): E {
    if (this._success || this._error === undefined) {
      throw new Error("Cannot access error of successful result");
    }
    return this._error;
  }

  map<U>(fn: (data: T) => U): Result<U, E> {
    if (this._success && this._data !== undefined) {
      try {
        return Result.success(fn(this._data));
      } catch (error) {
        return Result.failure(error as E);
      }
    }
    return Result.failure(this._error!);
  }

  flatMap<U>(fn: (data: T) => Result<U, E>): Result<U, E> {
    if (this._success && this._data !== undefined) {
      return fn(this._data);
    }
    return Result.failure(this._error!);
  }
}

// 型安全なパーサー
export function safeParseWithResult<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): Result<T, ValidationError> {
  const result = schema.safeParse(data);

  if (result.success) {
    return Result.success(result.data);
  } else {
    return Result.failure(ValidationError.fromZodError(result.error));
  }
}

// 使用例
const userResult = safeParseWithResult(UserSchema, userData);

if (userResult.success) {
  const user = userResult.data; // 型安全にアクセス
  console.log("Valid user:", user);
} else {
  const validationError = userResult.error;
  console.error("Validation errors:", validationError.fieldErrors);
}
```

この実践コード例集は、Step07 の Zod 学習で必要となる実装パターンを網羅しています。学習進度に応じて参照し、実際のプロジェクトでカスタマイズして使用してください。
