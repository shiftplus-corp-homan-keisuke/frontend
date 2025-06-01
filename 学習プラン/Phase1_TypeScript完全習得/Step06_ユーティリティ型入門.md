# Step 6: ユーティリティ型入門

> 💡 **補足資料**: 詳細な解説は以下の補足資料を見てね 🐰
>
> - 📖 [専門用語集](./Step06_補足_専門用語集.md) - ユーティリティ型・型変換・型レベルプログラミングの重要な概念と用語の詳細解説
> - 💻 [実践コード例](./Step06_補足_実践コード例.md) - 段階的な学習用コード集
> - 🚨 [トラブルシューティング](./Step06_補足_トラブルシューティング.md) - よくあるエラーと解決方法
> - 📚 [参考リソース](./Step06_補足_参考リソース.md) - 学習に役立つリンク集
> - 📋 [補足資料](./Step06_補足資料.md) - その他の重要な補足情報

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

### Section 1: 組み込みユーティリティ型

#### 🔍 基本ユーティリティ型の実践的価値

**💡 なぜユーティリティ型が重要なのか**

ユーティリティ型は、既存の型から新しい型を効率的に生成する TypeScript の強力な機能です。型変換による開発効率の向上、実際のプロジェクトでの型安全性確保、コード重複の削減と保守性向上を実現します。特に Web アプリケーション開発において、フォーム処理、API 設計、状態管理での型変換は必須のスキルとなります。

**🎯 どういう場面で使うのか**

- **フォーム処理**: 部分更新や段階的な入力での型安全性確保
- **API 設計**: リクエスト・レスポンス型の柔軟な変換
- **状態管理**: Redux、Zustand での型安全な状態変換
- **設定管理**: 環境別設定や動的設定での型管理
- **データ変換**: 外部データの内部型への安全な変換

##### 1. Partial<T> - フォーム処理での部分更新

> 💡 **詳細解説**: ユーティリティ型とPartial型の詳細と実践的な活用パターンは [Step06_補足_専門用語集.md#ユーティリティ型utility-types](./Step06_補足_専門用語集.md#ユーティリティ型utility-types) と [Step06_補足_専門用語集.md#partial型partial-type](./Step06_補足_専門用語集.md#partial型partial-type) を見てね 🐰

```typescript
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

// 実際のフォーム処理での活用
interface UserForm {
  personalInfo: Partial<Pick<User, "name" | "age">>;
  contactInfo: Partial<Pick<User, "email">>;
  isValid: boolean;
}

class FormManager<T> {
  private data: Partial<T> = {};
  private validators: Map<keyof T, (value: any) => boolean> = new Map();

  updateField<K extends keyof T>(field: K, value: T[K]): void {
    this.data[field] = value;
  }

  getPartialData(): Partial<T> {
    return { ...this.data };
  }

  isComplete(): this is { data: T } {
    // 実際の実装では全フィールドの存在をチェック
    return Object.keys(this.data).length > 0;
  }

  validate(): boolean {
    for (const [field, validator] of this.validators) {
      const value = this.data[field];
      if (value !== undefined && !validator(value)) {
        return false;
      }
    }
    return true;
  }
}

// 使用例
const userForm = new FormManager<User>();
userForm.updateField("name", "Alice");
userForm.updateField("email", "alice@example.com");

// 段階的なフォーム入力での型安全性
interface RegistrationStep1 {
  email: string;
  password: string;
}

interface RegistrationStep2 {
  firstName: string;
  lastName: string;
}

interface RegistrationStep3 {
  preferences: {
    newsletter: boolean;
    notifications: boolean;
  };
}

type RegistrationData = RegistrationStep1 &
  RegistrationStep2 &
  RegistrationStep3;

class MultiStepForm {
  private step1Data: Partial<RegistrationStep1> = {};
  private step2Data: Partial<RegistrationStep2> = {};
  private step3Data: Partial<RegistrationStep3> = {};

  updateStep1(data: Partial<RegistrationStep1>): void {
    this.step1Data = { ...this.step1Data, ...data };
  }

  updateStep2(data: Partial<RegistrationStep2>): void {
    this.step2Data = { ...this.step2Data, ...data };
  }

  updateStep3(data: Partial<RegistrationStep3>): void {
    this.step3Data = { ...this.step3Data, ...data };
  }

  getFinalData(): Partial<RegistrationData> {
    return {
      ...this.step1Data,
      ...this.step2Data,
      ...this.step3Data,
    };
  }
}
```

**📝 型変換の詳細解説**

- `Partial<T>` は全てのプロパティを `T[K] | undefined` に変換
- フォームの段階的入力や部分更新で威力を発揮
- 型安全性を保ちながら柔軟な更新処理を実現

**⚠️ よくある間違いと注意点**

```typescript
// ❌ 間違い: Partialを使わずに全プロパティを要求
function badUpdateUser(id: number, updates: User): User {
  // 部分更新なのに全プロパティが必要になってしまう
  return { ...getUserById(id), ...updates };
}

// ❌ 間違い: undefinedチェックを忘れる
function badProcessPartial(data: Partial<User>): string {
  return data.name.toUpperCase(); // data.nameがundefinedの可能性
}

// ✅ 正解: 適切なundefinedチェック
function goodProcessPartial(data: Partial<User>): string {
  return data.name ? data.name.toUpperCase() : "Unknown";
}
```

**🚀 実際のプロジェクトでの活用例**

```typescript
// React でのフォーム状態管理
interface ContactForm {
  name: string;
  email: string;
  message: string;
  phone?: string;
}

function useContactForm() {
  const [formData, setFormData] = useState<Partial<ContactForm>>({});
  const [errors, setErrors] = useState<
    Partial<Record<keyof ContactForm, string>>
  >({});

  const updateField = <K extends keyof ContactForm>(
    field: K,
    value: ContactForm[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // バリデーション
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ContactForm, string>> = {};

    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.message) newErrors.message = "Message is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return { formData, errors, updateField, validateForm };
}
```

##### 2. Required<T> - 全プロパティを必須に

> 💡 **詳細解説**: Required型の詳細と実践的な活用パターンは [Step06_補足_専門用語集.md#required型required-type](./Step06_補足_専門用語集.md#required型required-type) を見てね 🐰

```typescript
interface Config {
  apiUrl?: string;
  timeout?: number;
  retries?: number;
}

type RequiredConfig = Required<Config>;
// { apiUrl: string; timeout: number; retries: number; }
```

##### 3. Pick<T, K> - API 設計での特定プロパティ選択

> 💡 **詳細解説**: Pick型の詳細と実践的な活用パターンは [Step06_補足_専門用語集.md#pick型pick-type](./Step06_補足_専門用語集.md#pick型pick-type) を見てね 🐰

```typescript
type UserSummary = Pick<User, "id" | "name">;
// { id: number; name: string; }

type UserContact = Pick<User, "name" | "email">;
// { name: string; email: string; }

// 実際のAPI設計での活用
interface FullProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  inventory: {
    stock: number;
    reserved: number;
    available: number;
  };
  metadata: {
    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
  };
  internalNotes: string;
}

// 公開API用の型（内部情報を除外）
type PublicProduct = Pick<
  FullProduct,
  "id" | "name" | "description" | "price" | "category"
>;

// 在庫管理用の型
type InventoryProduct = Pick<FullProduct, "id" | "name" | "inventory">;

// 商品一覧表示用の型
type ProductListItem = Pick<FullProduct, "id" | "name" | "price" | "category">;

// 検索結果用の型
type SearchResult = Pick<
  FullProduct,
  "id" | "name" | "description" | "category"
>;

// API エンドポイント設計での活用
class ProductService {
  async getProducts(): Promise<ProductListItem[]> {
    // 一覧表示に必要な最小限の情報のみ返す
    const products = await this.fetchAllProducts();
    return products.map((product) => ({
      id: product.id,
      name: product.name,
      price: product.price,
      category: product.category,
    }));
  }

  async getProductDetails(id: string): Promise<PublicProduct> {
    // 詳細表示用の情報を返す（内部情報は除外）
    const product = await this.fetchProductById(id);
    return {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
    };
  }

  async getInventoryInfo(id: string): Promise<InventoryProduct> {
    // 在庫管理用の情報のみ返す
    const product = await this.fetchProductById(id);
    return {
      id: product.id,
      name: product.name,
      inventory: product.inventory,
    };
  }

  private async fetchAllProducts(): Promise<FullProduct[]> {
    // 実際のデータ取得処理
    return [];
  }

  private async fetchProductById(id: string): Promise<FullProduct> {
    // 実際のデータ取得処理
    return {} as FullProduct;
  }
}
```

##### 4. Omit<T, K> - 型安全なデータ変換での除外

> 💡 **詳細解説**: Omit型の詳細と実践的な活用パターンは [Step06_補足_専門用語集.md#omit型omit-type](./Step06_補足_専門用語集.md#omit型omit-type) を見てね 🐰

```typescript
type CreateUserRequest = Omit<User, "id">;
// { name: string; email: string; age: number; }

type PublicUser = Omit<User, "email">;
// { id: number; name: string; age: number; }

// 実際のデータ変換での活用
interface DatabaseUser {
  id: string;
  email: string;
  passwordHash: string;
  salt: string;
  name: string;
  age: number;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt: Date | null;
  isActive: boolean;
  role: "admin" | "user" | "moderator";
}

// 認証レスポンス用（機密情報を除外）
type AuthUser = Omit<DatabaseUser, "passwordHash" | "salt">;

// 公開プロフィール用（個人情報を除外）
type PublicProfile = Omit<
  DatabaseUser,
  "email" | "passwordHash" | "salt" | "lastLoginAt" | "isActive"
>;

// ユーザー作成リクエスト用（自動生成フィールドを除外）
type CreateUserRequest = Omit<
  DatabaseUser,
  "id" | "createdAt" | "updatedAt" | "lastLoginAt"
>;

// ユーザー更新リクエスト用（変更不可フィールドを除外）
type UpdateUserRequest = Partial<
  Omit<DatabaseUser, "id" | "createdAt" | "passwordHash" | "salt">
>;

// 実際のユーザーサービスでの活用
class UserService {
  async createUser(userData: CreateUserRequest): Promise<AuthUser> {
    const hashedPassword = await this.hashPassword(userData.passwordHash);
    const salt = await this.generateSalt();

    const newUser: DatabaseUser = {
      id: this.generateId(),
      ...userData,
      passwordHash: hashedPassword,
      salt,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastLoginAt: null,
    };

    await this.saveUser(newUser);

    // 機密情報を除外して返す
    const { passwordHash, salt: _, ...authUser } = newUser;
    return authUser;
  }

  async updateUser(id: string, updates: UpdateUserRequest): Promise<AuthUser> {
    const existingUser = await this.getUserById(id);
    const updatedUser: DatabaseUser = {
      ...existingUser,
      ...updates,
      updatedAt: new Date(),
    };

    await this.saveUser(updatedUser);

    // 機密情報を除外して返す
    const { passwordHash, salt, ...authUser } = updatedUser;
    return authUser;
  }

  async getPublicProfile(id: string): Promise<PublicProfile> {
    const user = await this.getUserById(id);

    // 個人情報を除外して返す
    const {
      email,
      passwordHash,
      salt,
      lastLoginAt,
      isActive,
      ...publicProfile
    } = user;
    return publicProfile;
  }

  private async hashPassword(password: string): Promise<string> {
    // パスワードハッシュ化処理
    return "";
  }

  private async generateSalt(): Promise<string> {
    // ソルト生成処理
    return "";
  }

  private generateId(): string {
    // ID生成処理
    return "";
  }

  private async saveUser(user: DatabaseUser): Promise<void> {
    // ユーザー保存処理
  }

  private async getUserById(id: string): Promise<DatabaseUser> {
    // ユーザー取得処理
    return {} as DatabaseUser;
  }
}
```

**📝 型変換の詳細解説**

- `Pick<T, K>` は指定したプロパティのみを含む新しい型を作成
- `Omit<T, K>` は指定したプロパティを除外した新しい型を作成
- API 設計において、必要な情報のみを公開する際に威力を発揮
- データベース型から API レスポンス型への安全な変換を実現

**⚠️ よくある間違いと注意点**

```typescript
// ❌ 間違い: 存在しないプロパティをPickしようとする
type BadPick = Pick<User, "id" | "nonExistent">; // Error

// ❌ 間違い: 全プロパティをOmitしてしまう
type EmptyType = Omit<User, "id" | "name" | "email" | "age">; // {}

// ✅ 正解: 適切なプロパティの選択・除外
type GoodPick = Pick<User, "id" | "name">;
type GoodOmit = Omit<User, "email">; // 機密情報のみ除外
```

**🚀 実際のプロジェクトでの活用例**

```typescript
// GraphQL スキーマでの活用
interface BlogPost {
  id: string;
  title: string;
  content: string;
  authorId: string;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  isDraft: boolean;
  tags: string[];
}

// 公開記事一覧用
type PublicPostSummary = Pick<
  BlogPost,
  "id" | "title" | "publishedAt" | "tags"
>;

// 記事作成リクエスト用
type CreatePostRequest = Omit<BlogPost, "id" | "createdAt" | "updatedAt">;

// 記事更新リクエスト用
type UpdatePostRequest = Partial<
  Omit<BlogPost, "id" | "authorId" | "createdAt">
>;

// 下書き記事用
type DraftPost = Omit<BlogPost, "publishedAt"> & { publishedAt: null };
```

##### 5. Record<K, T> - キーと値の型を指定

> 💡 **詳細解説**: Record型の詳細と実践的な活用パターンは [Step06_補足_専門用語集.md#record型record-type](./Step06_補足_専門用語集.md#record型record-type) を見てね 🐰

```typescript
type UserRoles = "admin" | "editor" | "viewer";
type Permissions = Record<UserRoles, string[]>;
// { admin: string[]; editor: string[]; viewer: string[]; }

const permissions: Permissions = {
  admin: ["read", "write", "delete"],
  editor: ["read", "write"],
  viewer: ["read"],
};
```

##### 6. Exclude<T, U> - ユニオン型から特定の型を除外

> 💡 **詳細解説**: Exclude型の詳細と実践的な活用パターンは [Step06_補足_専門用語集.md#exclude型exclude-type](./Step06_補足_専門用語集.md#exclude型exclude-type) を見てね 🐰

```typescript
type AllColors = "red" | "green" | "blue" | "yellow";
type PrimaryColors = Exclude<AllColors, "yellow">;
// 'red' | 'green' | 'blue'
```

##### 7. Extract<T, U> - ユニオン型から特定の型を抽出

> 💡 **詳細解説**: Extract型の詳細と実践的な活用パターンは [Step06_補足_専門用語集.md#extract型extract-type](./Step06_補足_専門用語集.md#extract型extract-type) を見てね 🐰

```typescript
type StringOrNumber = string | number | boolean;
type OnlyStringOrNumber = Extract<StringOrNumber, string | number>;
// string | number
```

##### 8. NonNullable<T> - null/undefined を除外

> 💡 **詳細解説**: NonNullable型の詳細と実践的な活用パターンは [Step06_補足_専門用語集.md#nonnullable型nonnullable-type](./Step06_補足_専門用語集.md#nonnullable型nonnullable-type) を見てね 🐰

```typescript
type MaybeString = string | null | undefined;
type DefiniteString = NonNullable<MaybeString>;
// string
```

#### 🎯 関数関連のユーティリティ型

> 💡 **詳細解説**: 関数関連のユーティリティ型の詳細と実践的な活用パターンは [Step06_補足_専門用語集.md#関数関連ユーティリティ型function-utility-types](./Step06_補足_専門用語集.md#関数関連ユーティリティ型function-utility-types) を見てね 🐰

##### 1. ReturnType<T> - 関数の戻り値型を取得

```typescript
function getUser(): { id: number; name: string } {
  return { id: 1, name: "Alice" };
}

type UserType = ReturnType<typeof getUser>;
// { id: number; name: string }
```

##### 2. Parameters<T> - 関数のパラメータ型を取得

```typescript
function createUser(name: string, age: number, email: string): User {
  return { id: Date.now(), name, age, email };
}

type CreateUserParams = Parameters<typeof createUser>;
// [string, number, string]
```

##### 3. ConstructorParameters<T> - コンストラクタのパラメータ型

```typescript
class ApiClient {
  constructor(baseUrl: string, timeout: number) {}
}

type ApiClientParams = ConstructorParameters<typeof ApiClient>;
// [string, number]
```

##### 4. InstanceType<T> - コンストラクタのインスタンス型

```typescript
type ApiClientInstance = InstanceType<typeof ApiClient>;
// ApiClient
```

##### 5. ThisParameterType<T> - this パラメータの型

```typescript
function greet(this: User, message: string): string {
  return `${this.name}: ${message}`;
}

type GreetThisType = ThisParameterType<typeof greet>;
// User
```

##### 6. OmitThisParameter<T> - this パラメータを除外

```typescript
type GreetFunction = OmitThisParameter<typeof greet>;
// (message: string) => string
```

### Section 2: カスタムユーティリティ型の作成

> 💡 **詳細解説**: カスタムユーティリティ型の作成方法と高度なパターンは [Step06_補足_実践コード例.md#カスタムユーティリティ型の実装](./Step06_補足_実践コード例.md#カスタムユーティリティ型の実装) を見てね 🐰

#### 🔧 高度なユーティリティ型

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
```

##### 2. DeepReadonly - ネストしたオブジェクトも含めて全て読み取り専用

```typescript
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

type ReadonlyConfig = DeepReadonly<NestedConfig>;
// 全てのプロパティがreadonlyになる
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
}

type StringKeys = KeysOfType<MixedObject, string>;
// 'name'

type NumberKeys = KeysOfType<MixedObject, number>;
// 'id' | 'count'
```

##### 4. RequireAtLeastOne - 最低 1 つのプロパティが必須

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
```

##### 5. Mutable - readonly を除去

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
```

##### 6. PickByType - 特定の型のプロパティのみを選択

```typescript
type PickByType<T, U> = Pick<T, KeysOfType<T, U>>;

type StringProperties = PickByType<MixedObject, string>;
// { name: string; }

type NumberProperties = PickByType<MixedObject, number>;
// { id: number; count: number; }
```

### Section 3: 実用的な型変換システム

> 💡 **詳細解説**: 実用的な型変換システムの設計と実装パターンは [Step06_補足_実践コード例.md#実用的な型変換システム](./Step06_補足_実践コード例.md#実用的な型変換システム) を見てね 🐰

#### 🔧 型安全なフォームシステム

##### 1. フォームバリデーションの型定義

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
```

##### 2. 型安全なフォームクラス

```typescript
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
```

##### 3. フォームシステムの使用例

```typescript
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

### 成果物

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
