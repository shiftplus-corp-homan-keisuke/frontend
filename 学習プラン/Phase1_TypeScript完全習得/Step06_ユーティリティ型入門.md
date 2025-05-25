# Step 6: ユーティリティ型入門

> 💡 **補足資料**: 詳細な解説は以下の補足資料を見てね 🐰
>
> - 📖 [専門用語集](./Step06_補足_専門用語集.md) - ユーティリティ型・型変換・型レベルプログラミングの重要な概念と用語の詳細解説
> - 💻 [実践コード例](./Step06_補足_実践コード例.md) - 段階的な学習用コード集
> - 🚨 [トラブルシューティング](./Step06_補足_トラブルシューティング.md) - よくあるエラーと解決方法
> - 📚 [参考リソース](./Step06_補足_参考リソース.md) - 学習に役立つリンク集

## 📅 学習期間・目標

**期間**: Step 6  
**総学習時間**: 3 時間  
**学習スタイル**: 理論 20% + 実践コード 50% + 演習 30%

### 🎯 Step 6 到達目標

- [ ] 組み込みユーティリティ型の完全理解と活用
- [ ] カスタムユーティリティ型の作成
- [ ] 型変換パターンの習得
- [ ] 実用的な型操作システムの実装
- [ ] 高度な型レベルプログラミングの基礎

## 📚 理論学習内容

### Day 1-2: 組み込みユーティリティ型

#### 🔍 基本的なユーティリティ型

```typescript
// 1. Partial<T> - 全プロパティをオプショナルに
// 💡 詳細解説: ユーティリティ型 → Step06_補足_専門用語集.md#ユーティリティ型utility-types
// 💡 詳細解説: Partial型 → Step06_補足_専門用語集.md#partial型partial-type
interface User {
  id: number;
  name: string;
  email: string;
  age: number;
}

type PartialUser = Partial<User>;
// { id?: number; name?: string; email?: string; age?: number; }

function updateUser(id: number, updates: Partial<User>): User {
  const existingUser = getUserById(id);
  return { ...existingUser, ...updates };
}

// 2. Required<T> - 全プロパティを必須に
// 💡 詳細解説: Required型 → Step06_補足_専門用語集.md#required型required-type
interface Config {
  apiUrl?: string;
  timeout?: number;
  retries?: number;
}

type RequiredConfig = Required<Config>;
// { apiUrl: string; timeout: number; retries: number; }

// 3. Pick<T, K> - 特定プロパティを選択
// 💡 詳細解説: Pick型 → Step06_補足_専門用語集.md#pick型pick-type
type UserSummary = Pick<User, "id" | "name">;
// { id: number; name: string; }

type UserContact = Pick<User, "name" | "email">;
// { name: string; email: string; }

// 4. Omit<T, K> - 特定プロパティを除外
// 💡 詳細解説: Omit型 → Step06_補足_専門用語集.md#omit型omit-type
type CreateUserRequest = Omit<User, "id">;
// { name: string; email: string; age: number; }

type PublicUser = Omit<User, "email">;
// { id: number; name: string; age: number; }

// 5. Record<K, T> - キーと値の型を指定
// 💡 詳細解説: Record型 → Step06_補足_専門用語集.md#record型record-type
type UserRoles = "admin" | "editor" | "viewer";
type Permissions = Record<UserRoles, string[]>;
// { admin: string[]; editor: string[]; viewer: string[]; }

const permissions: Permissions = {
  admin: ["read", "write", "delete"],
  editor: ["read", "write"],
  viewer: ["read"],
};

// 6. Exclude<T, U> - ユニオン型から特定の型を除外
// 💡 詳細解説: Exclude型 → Step06_補足_専門用語集.md#exclude型exclude-type
type AllColors = "red" | "green" | "blue" | "yellow";
type PrimaryColors = Exclude<AllColors, "yellow">;
// 'red' | 'green' | 'blue'

// 7. Extract<T, U> - ユニオン型から特定の型を抽出
// 💡 詳細解説: Extract型 → Step06_補足_専門用語集.md#extract型extract-type
type StringOrNumber = string | number | boolean;
type OnlyStringOrNumber = Extract<StringOrNumber, string | number>;
// string | number

// 8. NonNullable<T> - null/undefinedを除外
// 💡 詳細解説: NonNullable型 → Step06_補足_専門用語集.md#nonnullable型nonnullable-type
type MaybeString = string | null | undefined;
type DefiniteString = NonNullable<MaybeString>;
// string
```

#### 🎯 関数関連のユーティリティ型

```typescript
// 1. ReturnType<T> - 関数の戻り値型を取得
function getUser(): { id: number; name: string } {
  return { id: 1, name: "Alice" };
}

type UserType = ReturnType<typeof getUser>;
// { id: number; name: string }

// 2. Parameters<T> - 関数のパラメータ型を取得
function createUser(name: string, age: number, email: string): User {
  return { id: Date.now(), name, age, email };
}

type CreateUserParams = Parameters<typeof createUser>;
// [string, number, string]

// 3. ConstructorParameters<T> - コンストラクタのパラメータ型
class ApiClient {
  constructor(baseUrl: string, timeout: number) {}
}

type ApiClientParams = ConstructorParameters<typeof ApiClient>;
// [string, number]

// 4. InstanceType<T> - コンストラクタのインスタンス型
type ApiClientInstance = InstanceType<typeof ApiClient>;
// ApiClient

// 5. ThisParameterType<T> - this パラメータの型
function greet(this: User, message: string): string {
  return `${this.name}: ${message}`;
}

type GreetThisType = ThisParameterType<typeof greet>;
// User

// 6. OmitThisParameter<T> - this パラメータを除外
type GreetFunction = OmitThisParameter<typeof greet>;
// (message: string) => string
```

### Day 3-4: カスタムユーティリティ型の作成

#### 🔧 高度なユーティリティ型

```typescript
// 1. DeepPartial - ネストしたオブジェクトも含めて全てオプショナル
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

// 2. DeepReadonly - ネストしたオブジェクトも含めて全て読み取り専用
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

type ReadonlyConfig = DeepReadonly<NestedConfig>;
// 全てのプロパティがreadonlyになる

// 3. KeysOfType - 特定の型のプロパティキーを取得
type KeysOfType<T, U> = {
  [K in keyof T]: T[K] extends U ? K : never;
}[keyof T];

interface MixedObject {
  id: number;
  name: string;
  active: boolean;
  tags: string[];
  count: number;
}

type StringKeys = KeysOfType<MixedObject, string>;
// 'name'

type NumberKeys = KeysOfType<MixedObject, number>;
// 'id' | 'count'

// 4. RequireAtLeastOne - 最低1つのプロパティが必須
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

// 5. Mutable - readonlyを除去
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

// 6. PickByType - 特定の型のプロパティのみを選択
type PickByType<T, U> = Pick<T, KeysOfType<T, U>>;

type StringProperties = PickByType<MixedObject, string>;
// { name: string; }

type NumberProperties = PickByType<MixedObject, number>;
// { id: number; count: number; }
```

### Day 5-7: 実用的な型変換システム

#### 🔧 型安全なフォームシステム

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

## 🎯 実践演習

### 演習 6-1: 型変換ライブラリ 🔰

```typescript
// 型変換ユーティリティライブラリの実装

// 1. 配列からオブジェクトへの変換
function arrayToObject<T, K extends keyof T>(
  array: T[],
  keyField: K
): Record<T[K] extends string | number | symbol ? T[K] : never, T> {
  return array.reduce((obj, item) => {
    const key = item[keyField] as any;
    obj[key] = item;
    return obj;
  }, {} as any);
}

// 2. オブジェクトのキー変換
type KeyMapping<T> = {
  [K in keyof T]: string;
};

function transformKeys<T, U extends Record<string, any>>(
  obj: T,
  mapping: KeyMapping<T>
): U {
  const result = {} as any;
  for (const [oldKey, newKey] of Object.entries(mapping)) {
    if (oldKey in obj) {
      result[newKey] = (obj as any)[oldKey];
    }
  }
  return result;
}

// 3. 型安全なオブジェクトマージ
function mergeObjects<T, U>(obj1: T, obj2: U): T & U {
  return { ...obj1, ...obj2 };
}

// 使用例
const users = [
  { id: 1, name: "Alice", email: "alice@example.com" },
  { id: 2, name: "Bob", email: "bob@example.com" },
];

const userMap = arrayToObject(users, "id");
// Record<number, User>

const transformed = transformKeys(
  { firstName: "Alice", lastName: "Smith" },
  { firstName: "name", lastName: "surname" }
);
// { name: string; surname: string; }
```

### 演習 6-2: API レスポンス変換システム 🔶

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

## 📊 Step 6 評価基準

### 理解度チェックリスト

#### 組み込みユーティリティ型 (30%)

- [ ] 基本的なユーティリティ型を適切に使用できる
- [ ] 関数関連のユーティリティ型を活用できる
- [ ] 複雑な型変換を実装できる
- [ ] 実用的な場面でユーティリティ型を選択できる

#### カスタムユーティリティ型 (30%)

- [ ] 独自のユーティリティ型を作成できる
- [ ] 条件付き型を活用できる
- [ ] マップ型を使った型変換を実装できる
- [ ] 再帰的な型定義を理解している

#### 実践応用 (25%)

- [ ] 型安全なフォームシステムを実装できる
- [ ] API レスポンス変換を型安全に実装できる
- [ ] 複雑なデータ変換を型安全に実装できる
- [ ] パフォーマンスを考慮した実装ができる

#### 型レベルプログラミング (15%)

- [ ] 高度な型操作を理解している
- [ ] 型パズルを解決できる
- [ ] 実用的な型システムを設計できる
- [ ] 型の制約を適切に設計できる

### 成果物チェックリスト

- [ ] **型変換ライブラリ**: 再利用可能なユーティリティ型群
- [ ] **フォームシステム**: 型安全なフォームバリデーション
- [ ] **API 変換システム**: 型安全なデータ変換処理
- [ ] **カスタムユーティリティ**: 独自の型操作ツール

## 🔄 Step 7 への準備

### 次週学習内容の予習

```typescript
// Step 7で学習する実践プロジェクトの基礎概念
// 以下のコードを読んで理解しておくこと

// 1. プロジェクト構造
interface TodoItem {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// 2. 状態管理
type AppState = {
  todos: TodoItem[];
  filter: "all" | "active" | "completed";
  loading: boolean;
};

// 3. アクション定義
type TodoAction =
  | { type: "ADD_TODO"; payload: { title: string } }
  | { type: "TOGGLE_TODO"; payload: { id: string } }
  | { type: "DELETE_TODO"; payload: { id: string } };
```

### 環境準備

- [ ] 実践プロジェクト用の開発環境準備
- [ ] TypeScript + HTML/CSS の環境構築
- [ ] 型定義ファイルの整理
- [ ] テストフレームワークの準備

### 学習継続のコツ

1. **実践重視**: 学んだユーティリティ型を実際のプロジェクトで活用
2. **型パズル**: type-challenges での継続的な練習
3. **パターン学習**: 良い型変換パターンの蓄積
4. **段階的理解**: 複雑な型から基本要素に分解して理解

---

**📌 重要**: Step 6 は TypeScript の型システムの真の力を発揮する重要な技術を学習します。ユーティリティ型により、柔軟で保守性の高い型システムが構築できるようになります。

**🌟 次週は、これまで学んだ知識を統合して実践的なプロジェクトを開始します！**
