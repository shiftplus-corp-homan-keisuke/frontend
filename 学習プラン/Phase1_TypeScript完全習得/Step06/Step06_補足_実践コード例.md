# Step06 実践コード例

> 💡 **このファイルについて**: ユーティリティ型の段階的な学習のためのコード例集です。

## 📋 目次
1. [組み込みユーティリティ型の活用](#組み込みユーティリティ型の活用)
2. [カスタムユーティリティ型の作成](#カスタムユーティリティ型の作成)
3. [実用的な型変換システム](#実用的な型変換システム)

---

## 組み込みユーティリティ型の活用

### ステップ1: 基本的なユーティリティ型
```typescript
// utility-basics.ts

interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

// 1. Partial - 部分更新用
function updateUser(id: number, updates: Partial<User>): User {
  const currentUser = getUserById(id);
  return { ...currentUser, ...updates, updatedAt: new Date() };
}

// 2. Pick - 公開用データ
type PublicUser = Pick<User, 'id' | 'name' | 'email'>;

function getPublicUserInfo(id: number): PublicUser {
  const user = getUserById(id);
  return {
    id: user.id,
    name: user.name,
    email: user.email
  };
}

// 3. Omit - 作成用データ
type CreateUserRequest = Omit<User, 'id' | 'createdAt' | 'updatedAt'>;

function createUser(userData: CreateUserRequest): User {
  return {
    ...userData,
    id: generateId(),
    createdAt: new Date(),
    updatedAt: new Date()
  };
}

// 4. Required - 必須フィールド確保
interface PartialConfig {
  host?: string;
  port?: number;
  ssl?: boolean;
}

type CompleteConfig = Required<PartialConfig>;

function validateConfig(config: PartialConfig): CompleteConfig {
  return {
    host: config.host || 'localhost',
    port: config.port || 3000,
    ssl: config.ssl || false
  };
}

// 5. Record - 辞書型作成
type UserRole = 'admin' | 'user' | 'guest';
type RolePermissions = Record<UserRole, string[]>;

const permissions: RolePermissions = {
  admin: ['read', 'write', 'delete', 'manage'],
  user: ['read', 'write'],
  guest: ['read']
};
```

---

## カスタムユーティリティ型の作成

### ステップ2: 高度なユーティリティ型
```typescript
// custom-utilities.ts

// 1. DeepPartial - ネストしたオブジェクトも部分的に
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

interface DatabaseConfig {
  connection: {
    host: string;
    port: number;
    credentials: {
      username: string;
      password: string;
    };
  };
  pool: {
    min: number;
    max: number;
  };
}

function updateDatabaseConfig(updates: DeepPartial<DatabaseConfig>): void {
  // 深くネストしたオブジェクトも部分更新可能
}

// 2. DeepReadonly - ネストしたオブジェクトも読み取り専用
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

type ImmutableConfig = DeepReadonly<DatabaseConfig>;

// 3. NonNullableKeys - null許容でないキーのみ抽出
type NonNullableKeys<T> = {
  [K in keyof T]: null extends T[K] ? never : K;
}[keyof T];

interface MixedUser {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
}

type RequiredUserKeys = NonNullableKeys<MixedUser>; // 'id' | 'name'

// 4. FunctionPropertyNames - 関数プロパティ名のみ抽出
type FunctionPropertyNames<T> = {
  [K in keyof T]: T[K] extends Function ? K : never;
}[keyof T];

class UserService {
  private users: User[] = [];
  
  getUser(id: number): User | null { return null; }
  createUser(data: CreateUserRequest): User { return {} as User; }
  updateUser(id: number, data: Partial<User>): User { return {} as User; }
  deleteUser(id: number): boolean { return true; }
}

type UserServiceMethods = FunctionPropertyNames<UserService>;
// 'getUser' | 'createUser' | 'updateUser' | 'deleteUser'

// 5. Mutable - readonly修飾子を削除
type Mutable<T> = {
  -readonly [P in keyof T]: T[P];
};

interface ReadonlyUser {
  readonly id: number;
  readonly name: string;
  readonly email: string;
}

type EditableUser = Mutable<ReadonlyUser>;
// { id: number; name: string; email: string; }
```

### ステップ3: 型レベルプログラミング
```typescript
// type-level-programming.ts

// 1. 条件型を使った型変換
type ApiResponse<T> = T extends string 
  ? { message: T }
  : T extends number
  ? { code: T }
  : { data: T };

type StringResponse = ApiResponse<string>; // { message: string }
type NumberResponse = ApiResponse<number>; // { code: number }
type ObjectResponse = ApiResponse<User>; // { data: User }

// 2. テンプレートリテラル型
type EventName<T extends string> = `on${Capitalize<T>}`;
type EventHandler<T extends string> = (event: Event) => void;

type EventMap<T extends string> = {
  [K in EventName<T>]: EventHandler<T>;
};

type ButtonEvents = EventMap<'click' | 'hover' | 'focus'>;
// {
//   onClick: (event: Event) => void;
//   onHover: (event: Event) => void;
//   onFocus: (event: Event) => void;
// }

// 3. 再帰型
type JsonValue = 
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

type DeepStringify<T> = T extends string | number | boolean | null
  ? string
  : T extends any[]
  ? string[]
  : T extends object
  ? { [K in keyof T]: DeepStringify<T[K]> }
  : string;

// 4. 型レベル配列操作
type Head<T extends readonly any[]> = T extends readonly [infer H, ...any[]] ? H : never;
type Tail<T extends readonly any[]> = T extends readonly [any, ...infer T] ? T : [];
type Length<T extends readonly any[]> = T['length'];

type FirstElement = Head<[1, 2, 3]>; // 1
type RestElements = Tail<[1, 2, 3]>; // [2, 3]
type ArrayLength = Length<[1, 2, 3, 4]>; // 4

// 5. 型安全なパス操作
type PathKeys<T> = T extends object
  ? {
      [K in keyof T]: K extends string
        ? T[K] extends object
          ? K | `${K}.${PathKeys<T[K]>}`
          : K
        : never;
    }[keyof T]
  : never;

type UserPaths = PathKeys<User>;
// 'id' | 'name' | 'email' | 'password' | 'createdAt' | 'updatedAt'

function getNestedValue<T, P extends PathKeys<T>>(obj: T, path: P): any {
  // 型安全なネストしたプロパティアクセス
  return path.split('.').reduce((current, key) => current?.[key], obj);
}
```

---

## 実用的な型変換システム

### ステップ4: フォーム型システム
```typescript
// form-type-system.ts

// フォームフィールドの基本型
interface FormField<T> {
  value: T;
  error?: string;
  touched: boolean;
  dirty: boolean;
}

// オブジェクトをフォーム型に変換
type FormData<T> = {
  [K in keyof T]: FormField<T[K]>;
};

// バリデーションルール型
type ValidationRule<T> = (value: T) => string | undefined;

type FormValidation<T> = {
  [K in keyof T]?: ValidationRule<T[K]>[];
};

// フォーム管理クラス
class FormManager<T extends Record<string, any>> {
  private data: FormData<T>;
  private validation: FormValidation<T>;

  constructor(initialData: T, validation: FormValidation<T> = {}) {
    this.data = this.initializeFormData(initialData);
    this.validation = validation;
  }

  private initializeFormData(data: T): FormData<T> {
    const formData = {} as FormData<T>;
    for (const key in data) {
      formData[key] = {
        value: data[key],
        touched: false,
        dirty: false
      };
    }
    return formData;
  }

  setValue<K extends keyof T>(field: K, value: T[K]): void {
    this.data[field] = {
      ...this.data[field],
      value,
      dirty: true
    };
    this.validateField(field);
  }

  setTouched<K extends keyof T>(field: K): void {
    this.data[field] = {
      ...this.data[field],
      touched: true
    };
  }

  private validateField<K extends keyof T>(field: K): void {
    const rules = this.validation[field];
    if (rules) {
      for (const rule of rules) {
        const error = rule(this.data[field].value);
        if (error) {
          this.data[field].error = error;
          return;
        }
      }
    }
    this.data[field].error = undefined;
  }

  getFieldData<K extends keyof T>(field: K): FormField<T[K]> {
    return this.data[field];
  }

  getValues(): T {
    const values = {} as T;
    for (const key in this.data) {
      values[key] = this.data[key].value;
    }
    return values;
  }

  isValid(): boolean {
    return Object.values(this.data).every(field => !field.error);
  }

  isDirty(): boolean {
    return Object.values(this.data).some(field => field.dirty);
  }
}

// 使用例
interface UserRegistration {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const userForm = new FormManager<UserRegistration>(
  {
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  },
  {
    username: [
      (value) => value.length < 3 ? 'Username must be at least 3 characters' : undefined
    ],
    email: [
      (value) => !/\S+@\S+\.\S+/.test(value) ? 'Invalid email format' : undefined
    ],
    password: [
      (value) => value.length < 8 ? 'Password must be at least 8 characters' : undefined
    ]
  }
);
```

### ステップ5: API型システム
```typescript
// api-type-system.ts

// HTTP メソッド型
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

// API エンドポイント定義
interface ApiEndpoint {
  method: HttpMethod;
  path: string;
  params?: Record<string, any>;
  body?: any;
  response: any;
}

// API 定義マップ
interface ApiDefinition {
  'users.list': {
    method: 'GET';
    path: '/users';
    params: { page?: number; limit?: number };
    response: { users: User[]; total: number };
  };
  'users.get': {
    method: 'GET';
    path: '/users/:id';
    params: { id: number };
    response: User;
  };
  'users.create': {
    method: 'POST';
    path: '/users';
    body: CreateUserRequest;
    response: User;
  };
  'users.update': {
    method: 'PUT';
    path: '/users/:id';
    params: { id: number };
    body: Partial<User>;
    response: User;
  };
  'users.delete': {
    method: 'DELETE';
    path: '/users/:id';
    params: { id: number };
    response: { success: boolean };
  };
}

// 型安全なAPIクライアント
class TypedApiClient<TApiDef extends Record<string, ApiEndpoint>> {
  constructor(private baseUrl: string) {}

  async request<K extends keyof TApiDef>(
    endpoint: K,
    options: TApiDef[K] extends { params: infer P }
      ? TApiDef[K] extends { body: infer B }
        ? { params: P; body: B }
        : { params: P }
      : TApiDef[K] extends { body: infer B }
      ? { body: B }
      : {}
  ): Promise<TApiDef[K]['response']> {
    const def = this.getEndpointDefinition(endpoint);
    const url = this.buildUrl(def.path, 'params' in options ? options.params : {});
    
    const response = await fetch(`${this.baseUrl}${url}`, {
      method: def.method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: 'body' in options ? JSON.stringify(options.body) : undefined,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  private getEndpointDefinition(endpoint: keyof TApiDef): TApiDef[typeof endpoint] {
    // 実際の実装では設定から取得
    return {} as TApiDef[typeof endpoint];
  }

  private buildUrl(path: string, params: Record<string, any>): string {
    let url = path;
    for (const [key, value] of Object.entries(params)) {
      url = url.replace(`:${key}`, String(value));
    }
    return url;
  }
}

// 使用例
const apiClient = new TypedApiClient<ApiDefinition>('https://api.example.com');

async function example() {
  // 型安全なAPI呼び出し
  const users = await apiClient.request('users.list', {
    params: { page: 1, limit: 10 }
  });

  const user = await apiClient.request('users.get', {
    params: { id: 1 }
  });

  const newUser = await apiClient.request('users.create', {
    body: {
      name: 'Alice',
      email: 'alice@example.com',
      password: 'password123'
    }
  });
}
```

---

## 🎯 実行とテストの方法

### 基本的な実行方法
```bash
# TypeScriptファイルを直接実行
npx ts-node filename.ts

# コンパイルしてから実行
npx tsc filename.ts
node filename.js
```

### テストの作成
```typescript
// utility-types.test.ts
describe('Utility Types', () => {
  test('FormManager should handle form state', () => {
    const form = new FormManager({ name: '', email: '' });
    
    form.setValue('name', 'Alice');
    expect(form.getFieldData('name').value).toBe('Alice');
    expect(form.getFieldData('name').dirty).toBe(true);
  });

  test('TypedApiClient should provide type safety', () => {
    const client = new TypedApiClient<ApiDefinition>('http://localhost');
    // 型チェックのテスト
  });
});
```

---

## 📚 学習の進め方

1. **基本から応用へ**: 組み込みユーティリティ型から始めて、カスタム型へ
2. **実際に使用**: 実際のプロジェクトでユーティリティ型を活用
3. **型エラーを体験**: 意図的に型エラーを発生させて理解を深める
4. **ライブラリ設計**: 再利用可能な型システムの設計を練習
5. **パフォーマンス考慮**: 複雑な型操作のコンパイル時間への影響を理解

---

**📌 重要**: ユーティリティ型は TypeScript の型システムの真価を発揮する機能です。これらのコード例を通じて、より表現力豊かで保守性の高いコードの書き方を身につけてください。