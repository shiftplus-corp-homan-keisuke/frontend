# Session2: ユーティリティ型実践演習（90分）

> 💡 **対象**: Session1完了者（ユーティリティ型基礎理解済み）
> 🎯 **形式**: 講師サポート付き実践学習
> ⏰ **時間**: 90分

## 📚 関連補足資料

このセッションの学習をサポートする補足資料をご用意しています：

- 💻 **[実践コード例](./Step06_補足_実践コード例.md)** - より実践的な例とシステム実装
- 📖 **[専門用語集](./Step06_補足_専門用語集.md)** - カスタムユーティリティ型などの詳細解説
- 🚨 **[トラブルシューティング](./Step06_補足_トラブルシューティング.md)** - ユーティリティ型エラーの対処法
- 🌐 **[参考リソース](./Step06_補足_参考リソース.md)** - さらなる学習のためのリソース
- 🔧 **[開発環境ガイド](./Step06_補足_開発環境ガイド.md)** - 開発効率を上げる設定

> 💡 **活用方法**: 学習中に疑問が生じた際や、より深く理解したい場合に参照してね 🐰

## 📅 セッション概要

**学習目標**:

- [ ] カスタムユーティリティ型の作成と活用
- [ ] 複合型操作と高度な型変換の実装
- [ ] 条件付き型とマップ型の理解と活用
- [ ] 実用的な型変換システムの構築

**前提知識**:

- Session1の内容（基本ユーティリティ型の理解）
- ジェネリクスの基本概念（Step05で学習済み）
- 型推論とkeyof演算子の理解

---

## ⏰ 詳細タイムテーブル

| 時間         | 内容                         | 講師の役割           | 学習者の活動     | 成果物       |
| ------------ | ---------------------------- | -------------------- | ---------------- | ------------ |
| **0-10分**   | 前回復習・今回目標           | 復習確認・目標提示   | 振り返り・質問   | 理解確認     |
| **10-50分**  | カスタムユーティリティ型実装 | 実演・個別指導       | ハンズオン・実践 | 実践コード   |
| **50-80分**  | 型変換システム演習           | コードレビュー・助言 | 個人開発         | システム実装 |
| **80-90分**  | 成果共有・質疑応答           | ファシリテート       | 発表・討論       | 学習成果     |

---

## 📚 学習内容

### Section 1: カスタムユーティリティ型実装

> 📚 **関連資料**: [実践コード例 - カスタムユーティリティ型の実装](./Step06_補足_実践コード例.md#カスタムユーティリティ型の実装) | [専門用語集 - 条件付き型](./Step06_補足_専門用語集.md#条件付き型)

#### 🔧 高度なユーティリティ型の作成

##### 1. DeepPartial - ネストしたオブジェクトも含めて全てオプショナル

```typescript
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

interface NestedConfig {
  database: {
    host: string;
    port: number;
    credentials: {
      username: string;
      password: string;
    };
  };
  api: {
    timeout: number;
    retries: number;
  };
}

type PartialNestedConfig = DeepPartial<NestedConfig>;
// 全てのプロパティがオプショナルになる

// 実際の使用例
function updateConfig(
  currentConfig: NestedConfig,
  updates: DeepPartial<NestedConfig>
): NestedConfig {
  return {
    database: {
      ...currentConfig.database,
      ...updates.database,
      credentials: {
        ...currentConfig.database.credentials,
        ...updates.database?.credentials,
      },
    },
    api: {
      ...currentConfig.api,
      ...updates.api,
    },
  };
}
```

##### 2. DeepReadonly - ネストしたオブジェクトも含めて全て読み取り専用

```typescript
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

type ReadonlyConfig = DeepReadonly<NestedConfig>;
// 全てのプロパティがreadonlyになる

// 実際の使用例
function createImmutableConfig(config: NestedConfig): DeepReadonly<NestedConfig> {
  return config as DeepReadonly<NestedConfig>;
}
```

##### 3. KeysOfType - 特定の型のプロパティキーを取得

```typescript
type KeysOfType<T, U> = {
  [K in keyof T]: T[K] extends U ? K : never;
}[keyof T];

interface MixedObject {
  id: number;
  name: string;
  active: boolean;
  tags: string[];
  count: number;
  metadata: object;
}

type StringKeys = KeysOfType<MixedObject, string>;
// 'name'

type NumberKeys = KeysOfType<MixedObject, number>;
// 'id' | 'count'

type ObjectKeys = KeysOfType<MixedObject, object>;
// 'tags' | 'metadata'

// 実際の使用例
function getStringProperties<T>(
  obj: T,
  keys: KeysOfType<T, string>[]
): string[] {
  return keys.map(key => String(obj[key]));
}
```

##### 4. RequireAtLeastOne - 最低1つのプロパティが必須

```typescript
type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = Pick<
  T,
  Exclude<keyof T, Keys>
> &
  {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>;
  }[Keys];

interface ContactInfo {
  email?: string;
  phone?: string;
  address?: string;
}

type ContactRequired = RequireAtLeastOne<ContactInfo>;
// email, phone, address のうち最低1つは必須

// 実際の使用例
function sendNotification(contact: ContactRequired, message: string): void {
  if (contact.email) {
    console.log(`Email sent to ${contact.email}: ${message}`);
  } else if (contact.phone) {
    console.log(`SMS sent to ${contact.phone}: ${message}`);
  } else if (contact.address) {
    console.log(`Mail sent to ${contact.address}: ${message}`);
  }
}
```

##### 5. PickByType - 特定の型のプロパティのみを選択

```typescript
type PickByType<T, U> = Pick<T, KeysOfType<T, U>>;

type StringProperties = PickByType<MixedObject, string>;
// { name: string; }

type NumberProperties = PickByType<MixedObject, number>;
// { id: number; count: number; }

// 実際の使用例
function extractStringFields<T>(obj: T): PickByType<T, string> {
  const result = {} as PickByType<T, string>;
  for (const key in obj) {
    if (typeof obj[key] === 'string') {
      (result as any)[key] = obj[key];
    }
  }
  return result;
}
```

##### 6. Mutable - readonly を除去

```typescript
type Mutable<T> = {
  -readonly [P in keyof T]: T[P];
};

interface ReadonlyUser {
  readonly id: number;
  readonly name: string;
  readonly email: string;
}

type MutableUser = Mutable<ReadonlyUser>;
// { id: number; name: string; email: string; }

// 実際の使用例
function createEditableUser(readonlyUser: ReadonlyUser): MutableUser {
  return { ...readonlyUser };
}
```

### 練習問題 2.1: カスタムユーティリティ型作成 🔰

以下のカスタムユーティリティ型を実装してください：

```typescript
// 1. OptionalExcept - 指定したキー以外をオプショナルにする
type OptionalExcept<T, K extends keyof T> = /* ここに実装 */;

interface User {
  id: string;
  name: string;
  email: string;
  age: number;
}

// idとnameは必須、他はオプショナル
type UserWithRequiredIdName = OptionalExcept<User, "id" | "name">;

// 2. NonEmptyArray - 空でない配列型
type NonEmptyArray<T> = /* ここに実装 */;

// 使用例
function processItems<T>(items: NonEmptyArray<T>): T {
  return items[0]; // 最初の要素は必ず存在
}
```

### Section 2: 実用的な型変換システム

> 📚 **サポート資料**: [実践コード例 - 実用的な型変換システム](./Step06_補足_実践コード例.md#実用的な型変換システム) | [トラブルシューティング - 型変換エラー対処](./Step06_補足_トラブルシューティング.md#型変換エラー対処)

#### 🎯 メイン演習: 型安全なフォームシステム

```typescript
// フォームバリデーションシステム
type ValidationRule<T> = {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: T) => string | null;
};

type FormSchema<T> = {
  [K in keyof T]: ValidationRule<T[K]>;
};

type FormErrors<T> = {
  [K in keyof T]?: string[];
};

type FormState<T> = {
  values: Partial<T>;
  errors: FormErrors<T>;
  touched: Partial<Record<keyof T, boolean>>;
  isValid: boolean;
  isSubmitting: boolean;
};

class TypeSafeForm<T extends Record<string, any>> {
  private state: FormState<T>;

  constructor(private schema: FormSchema<T>, initialValues: Partial<T> = {}) {
    this.state = {
      values: initialValues,
      errors: {},
      touched: {},
      isValid: false,
      isSubmitting: false,
    };
  }

  setValue<K extends keyof T>(field: K, value: T[K]): void {
    this.state.values[field] = value;
    this.state.touched[field] = true;
    this.validateField(field);
    this.updateValidState();
  }

  private validateField<K extends keyof T>(field: K): void {
    const value = this.state.values[field];
    const rule = this.schema[field];
    const errors: string[] = [];

    if (
      rule.required &&
      (value === undefined || value === null || value === "")
    ) {
      errors.push(`${String(field)} is required`);
    }

    if (value && typeof value === "string") {
      if (rule.minLength && value.length < rule.minLength) {
        errors.push(
          `${String(field)} must be at least ${rule.minLength} characters`
        );
      }
      if (rule.maxLength && value.length > rule.maxLength) {
        errors.push(
          `${String(field)} must be no more than ${rule.maxLength} characters`
        );
      }
      if (rule.pattern && !rule.pattern.test(value)) {
        errors.push(`${String(field)} format is invalid`);
      }
    }

    if (rule.custom && value !== undefined) {
      const customError = rule.custom(value);
      if (customError) {
        errors.push(customError);
      }
    }

    if (errors.length > 0) {
      this.state.errors[field] = errors;
    } else {
      delete this.state.errors[field];
    }
  }

  private updateValidState(): void {
    this.state.isValid = Object.keys(this.state.errors).length === 0;
  }

  getState(): FormState<T> {
    return { ...this.state };
  }

  getValues(): Partial<T> {
    return { ...this.state.values };
  }

  getErrors(): FormErrors<T> {
    return { ...this.state.errors };
  }

  isFieldValid<K extends keyof T>(field: K): boolean {
    return !this.state.errors[field];
  }

  reset(): void {
    this.state = {
      values: {},
      errors: {},
      touched: {},
      isValid: false,
      isSubmitting: false,
    };
  }
}

// 使用例
interface UserForm {
  name: string;
  email: string;
  age: number;
  password: string;
}

const userFormSchema: FormSchema<UserForm> = {
  name: {
    required: true,
    minLength: 2,
    maxLength: 50,
  },
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  age: {
    required: true,
    custom: (value) => {
      if (typeof value === "number" && (value < 18 || value > 120)) {
        return "Age must be between 18 and 120";
      }
      return null;
    },
  },
  password: {
    required: true,
    minLength: 8,
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
  },
};

const form = new TypeSafeForm(userFormSchema);

// 型安全な使用
form.setValue("name", "Alice");
form.setValue("email", "alice@example.com");
form.setValue("age", 25);
form.setValue("password", "SecurePass123");

console.log(form.getState());
```

#### API レスポンス変換システム

```typescript
// API レスポンス変換システムの実装
type ApiResponseTransformer<TInput, TOutput> = {
  transform(input: TInput): TOutput;
  validate?(input: unknown): input is TInput;
};

class ApiResponseProcessor<TSchema extends Record<string, any>> {
  private transformers = new Map<
    keyof TSchema,
    ApiResponseTransformer<any, any>
  >();

  registerTransformer<K extends keyof TSchema>(
    key: K,
    transformer: ApiResponseTransformer<any, TSchema[K]>
  ): void {
    this.transformers.set(key, transformer);
  }

  process<K extends keyof TSchema>(
    key: K,
    rawData: unknown
  ): { success: true; data: TSchema[K] } | { success: false; error: string } {
    const transformer = this.transformers.get(key);

    if (!transformer) {
      return {
        success: false,
        error: `No transformer found for ${String(key)}`,
      };
    }

    try {
      if (transformer.validate && !transformer.validate(rawData)) {
        return { success: false, error: "Invalid input data" };
      }

      const result = transformer.transform(rawData);
      return { success: true, data: result };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }
}

// 使用例
interface ApiSchema {
  user: { id: number; name: string; email: string };
  users: Array<{ id: number; name: string; email: string }>;
  profile: { userId: number; bio: string; avatar: string };
}

const processor = new ApiResponseProcessor<ApiSchema>();

processor.registerTransformer("user", {
  validate: (input): input is any => {
    return typeof input === "object" && input !== null;
  },
  transform: (input: any) => ({
    id: Number(input.id),
    name: String(input.name),
    email: String(input.email),
  }),
});

processor.registerTransformer("users", {
  validate: (input): input is any[] => Array.isArray(input),
  transform: (input: any[]) =>
    input.map((item) => ({
      id: Number(item.id),
      name: String(item.name),
      email: String(item.email),
    })),
});

// 型安全な使用
const userResult = processor.process("user", {
  id: "1",
  name: "Alice",
  email: "alice@example.com",
});

if (userResult.success) {
  console.log(userResult.data.name); // 型安全
}
```

---

## 👨‍🏫 学習ポイント

### 🤔 よくある質問と回答

**Q: カスタムユーティリティ型を作る際の注意点は？**
A: 型の複雑さと可読性のバランスを考慮しましょう。過度に複雑な型は保守性を損ないます。また、TypeScriptの型システムの制限を理解し、実用的な範囲で設計することが重要です。

**Q: 条件付き型（extends）の使い方のコツは？**
A: 型の絞り込みと分岐に使用します。`T extends U ? X : Y`の形で、Tがサブタイプの場合とそうでない場合で異なる型を返せます。再帰的な型定義でも威力を発揮します。

**Q: 型変換システムでパフォーマンスを考慮すべき点は？**
A: 型レベルの計算は実行時に影響しませんが、複雑な型は TypeScript コンパイラの処理時間に影響します。適度な複雑さに留め、必要に応じて型エイリアスで分割しましょう。

---

**📌 重要**: Session2では実践的なコーディングを通じてユーティリティ型の活用を体感します。完璧を目指さず、まずは動くコードを作ることを重視しましょう。

**🌟 次回（Session3）は、プロジェクトの完成と学習の総括を行います！**