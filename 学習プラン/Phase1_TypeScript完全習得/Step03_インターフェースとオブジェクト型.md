# Step 3: インターフェースとオブジェクト型

> 💡 **補足資料**: 詳細な解説は以下の補足資料を見てね 🐰
>
> - 📖 [専門用語集](./Step03_補足_専門用語集.md) - インターフェース・オブジェクト型設計の重要な概念と用語の詳細解説
> - 💻 [実践コード例](./Step03_補足_実践コード例.md) - 段階的な学習用コード集
> - 🚨 [トラブルシューティング](./Step03_補足_トラブルシューティング.md) - よくあるエラーと解決方法
> - 📚 [参考リソース](./Step03_補足_参考リソース.md) - 学習に役立つリンク集

## 📅 学習期間・目標

**期間**: Step 3  
**総学習時間**: 4 時間  
**学習スタイル**: 理論 20% + 実践コード 50% + 演習 30%

### 🎯 Step 3 到達目標

- [ ] インターフェースの設計と活用の完全理解
- [ ] 型エイリアスとの使い分けの習得
- [ ] 継承とコンポジションの実践的活用
- [ ] データモデル設計の基礎確立
- [ ] オブジェクト指向設計の型安全な実装

## 📚 理論学習内容

### Section 1: インターフェースの基礎と設計

#### 🔍 インターフェースの基本概念と他言語との比較

##### 1. 基本的なインターフェース定義

```typescript
// Java: interface User { String getName(); }
// C#: interface IUser { string Name { get; } }
// TypeScript: より柔軟な構造的型付け
// 💡 詳細解説: インターフェース → Step03_補足_専門用語集.md#インターフェースinterface
// 💡 詳細解説: 構造的型付け → Step03_補足_専門用語集.md#構造的型付けstructural-typing

interface User {
  id: number;
  name: string;
  email: string;
  createdAt: Date;
}
```

##### 2. オプショナルプロパティ

```typescript
// 💡 詳細解説: オプショナルプロパティ → Step02_補足_専門用語集.md#オプショナルプロパティoptional-properties
interface CreateUserRequest {
  name: string;
  email: string;
  age?: number; // オプショナル
  profile?: {
    bio?: string;
    avatar?: string;
  };
}
```

##### 3. 読み取り専用プロパティ

```typescript
// 💡 詳細解説: 読み取り専用型 → Step02_補足_専門用語集.md#読み取り専用型readonly-types
interface ReadonlyUser {
  readonly id: number;
  readonly createdAt: Date;
  name: string; // 変更可能
  email: string; // 変更可能
}
```

##### 4. インデックスシグネチャ

```typescript
// 💡 詳細解説: インデックスシグネチャ → Step02_補足_専門用語集.md#インデックスシグネチャindex-signatures
interface StringDictionary {
  [key: string]: string;
}

interface NumberDictionary {
  [key: string]: number;
  length: number; // 明示的プロパティも可能
}
```

##### 5. 関数型プロパティ

```typescript
interface Calculator {
  add: (a: number, b: number) => number;
  subtract: (a: number, b: number) => number;
  multiply: (a: number, b: number) => number;
  divide: (a: number, b: number) => number;
}
```

##### 6. メソッドシグネチャ（2 つの書き方）

```typescript
interface UserService {
  // 関数型プロパティ
  getUser: (id: number) => Promise<User>;

  // メソッドシグネチャ
  createUser(data: CreateUserRequest): Promise<User>;
  updateUser(id: number, data: Partial<User>): Promise<User>;
  deleteUser(id: number): Promise<boolean>;
}
```

#### 🎯 インターフェースの継承と拡張

##### 1. 基本的な継承

```typescript
interface Animal {
  name: string;
  age: number;
}

interface Dog extends Animal {
  breed: string;
  bark(): void;
}

interface Cat extends Animal {
  color: string;
  meow(): void;
}
```

##### 2. 複数インターフェースの継承

```typescript
interface Flyable {
  fly(): void;
  altitude: number;
}

interface Swimmable {
  swim(): void;
  depth: number;
}

interface Duck extends Animal, Flyable, Swimmable {
  quack(): void;
}
```

##### 3. ジェネリックインターフェース

```typescript
interface Repository<T, K> {
  findById(id: K): Promise<T | null>;
  findAll(): Promise<T[]>;
  create(entity: Omit<T, "id">): Promise<T>;
  update(id: K, entity: Partial<T>): Promise<T>;
  delete(id: K): Promise<boolean>;
}

// 使用例
interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
}

class ProductRepository implements Repository<Product, string> {
  async findById(id: string): Promise<Product | null> {
    // 実装
    return null;
  }

  async findAll(): Promise<Product[]> {
    // 実装
    return [];
  }

  async create(entity: Omit<Product, "id">): Promise<Product> {
    // 実装
    return { id: "generated-id", ...entity };
  }

  async update(id: string, entity: Partial<Product>): Promise<Product> {
    // 実装
    throw new Error("Not implemented");
  }

  async delete(id: string): Promise<boolean> {
    // 実装
    return false;
  }
}
```

### Section 2: 型エイリアスとの使い分け

#### 🔧 type vs interface の詳細比較

##### 1. 基本的な違い

```typescript
// interface: 拡張可能、宣言マージ可能
interface UserInterface {
  name: string;
  age: number;
}

interface UserInterface {
  email: string; // 自動的にマージされる
}

// type: より柔軟、ユニオン型・交差型対応
type UserType = {
  name: string;
  age: number;
};
```

##### 2. ユニオン型（type のみ可能）

```typescript
type Status = "pending" | "approved" | "rejected";
type ID = string | number;
```

##### 3. 交差型（type が得意）

```typescript
type Timestamped = {
  createdAt: Date;
  updatedAt: Date;
};

type UserWithTimestamp = UserType & Timestamped;
```

##### 4. 使い分けのガイドライン

```typescript
// interface: オブジェクトの形状定義、継承が必要、ライブラリAPI
interface DatabaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

interface User extends DatabaseEntity {
  name: string;
  email: string;
}

// type: ユニオン型、計算された型、複雑な型操作
type UserRole = "admin" | "editor" | "viewer";
type UserPermissions = Record<UserRole, string[]>;
type UserWithRole = User & { role: UserRole };
```

### Section 3: 実践的なデータモデル設計

#### 🔧 ドメインモデルの設計

##### 1. 基本エンティティの設計

```typescript
// ECサイトのデータモデル例
namespace ECommerce {
  // 基本エンティティ
  interface BaseEntity {
    readonly id: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
  }
}
```

##### 2. 商品関連のモデル

```typescript
namespace ECommerce {
  // 商品関連
  interface Product extends BaseEntity {
    name: string;
    description: string;
    price: number;
    category: Category;
    inventory: Inventory;
    images: ProductImage[];
    tags: string[];
  }

  interface Category extends BaseEntity {
    name: string;
    slug: string;
    parentId?: string;
    children?: Category[];
  }

  interface Inventory {
    quantity: number;
    reserved: number;
    available: number;
    lowStockThreshold: number;
  }

  interface ProductImage {
    url: string;
    alt: string;
    isPrimary: boolean;
    order: number;
  }
}
```

##### 3. ユーザー関連のモデル

```typescript
namespace ECommerce {
  // ユーザー関連
  interface User extends BaseEntity {
    email: string;
    profile: UserProfile;
    addresses: Address[];
    preferences: UserPreferences;
  }

  interface UserProfile {
    firstName: string;
    lastName: string;
    phone?: string;
    dateOfBirth?: Date;
    avatar?: string;
  }

  interface Address {
    id: string;
    type: "shipping" | "billing";
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    isDefault: boolean;
  }
}
```

##### 4. 注文関連のモデル

```typescript
namespace ECommerce {
  // 注文関連
  interface Order extends BaseEntity {
    orderNumber: string;
    userId: string;
    items: OrderItem[];
    shipping: ShippingInfo;
    payment: PaymentInfo;
    status: OrderStatus;
    totals: OrderTotals;
  }

  interface OrderItem {
    productId: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    product?: Product; // 参照データ
  }

  interface OrderTotals {
    subtotal: number;
    tax: number;
    shipping: number;
    discount: number;
    total: number;
  }
}
```

##### 5. 型定義とステータス管理

```typescript
namespace ECommerce {
  type OrderStatus =
    | "pending"
    | "confirmed"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled";

  type PaymentMethod =
    | "credit_card"
    | "paypal"
    | "bank_transfer"
    | "cash_on_delivery";

  type PaymentStatus = "pending" | "completed" | "failed" | "refunded";
}
```

## 🎯 実践演習

### 演習 3-1: インターフェース設計マスター 🔰

```typescript
// ブログシステムのデータモデルを設計せよ
// 要件:
// - 記事（タイトル、内容、作成者、タグ、公開状態）
// - 作成者（名前、メール、プロフィール、ソーシャルリンク）
// - コメント（内容、作成者、返信機能）
// - カテゴリ（階層構造対応）

// 解答例
interface BaseEntity {
  readonly id: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

interface Author extends BaseEntity {
  name: string;
  email: string;
  bio?: string;
  avatar?: string;
  socialLinks: {
    twitter?: string;
    github?: string;
    website?: string;
  };
}

interface Category extends BaseEntity {
  name: string;
  slug: string;
  description?: string;
  parentId?: string;
  children?: Category[];
}

interface Tag {
  id: string;
  name: string;
  color?: string;
}

interface Article extends BaseEntity {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  featuredImage?: string;
  authorId: string;
  categoryId: string;
  tags: Tag[];
  status: "draft" | "published" | "archived";
  publishedAt?: Date;
  viewCount: number;

  // 関連データ（オプショナル）
  author?: Author;
  category?: Category;
  comments?: Comment[];
}

interface Comment extends BaseEntity {
  content: string;
  authorName: string;
  authorEmail: string;
  articleId: string;
  parentId?: string; // 返信機能
  status: "pending" | "approved" | "rejected";

  // 関連データ
  replies?: Comment[];
}
```

### 演習 3-2: 型安全な API 設計 🔶

```typescript
// RESTful APIの型安全なクライアントを設計せよ

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
  meta?: {
    timestamp: Date;
    requestId: string;
    version: string;
  };
}

interface PaginatedData<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

interface ApiClient {
  get<T>(path: string, params?: Record<string, any>): Promise<ApiResponse<T>>;
  post<T, U>(path: string, body: T): Promise<ApiResponse<U>>;
  put<T, U>(path: string, body: T): Promise<ApiResponse<U>>;
  delete<T>(path: string): Promise<ApiResponse<T>>;
}

class TypeSafeApiClient implements ApiClient {
  constructor(
    private baseUrl: string,
    private defaultHeaders: Record<string, string> = {}
  ) {}

  async get<T>(
    path: string,
    params?: Record<string, any>
  ): Promise<ApiResponse<T>> {
    const url = new URL(path, this.baseUrl);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, String(value));
      });
    }

    try {
      const response = await fetch(url.toString(), {
        method: "GET",
        headers: this.defaultHeaders,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: {
            code: `HTTP_${response.status}`,
            message: data.message || response.statusText,
          },
        };
      }

      return {
        success: true,
        data,
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: "NETWORK_ERROR",
          message: error instanceof Error ? error.message : "Unknown error",
        },
      };
    }
  }

  async post<T, U>(path: string, body: T): Promise<ApiResponse<U>> {
    try {
      const response = await fetch(`${this.baseUrl}${path}`, {
        method: "POST",
        headers: {
          ...this.defaultHeaders,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: {
            code: `HTTP_${response.status}`,
            message: data.message || response.statusText,
          },
        };
      }

      return {
        success: true,
        data,
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: "NETWORK_ERROR",
          message: error instanceof Error ? error.message : "Unknown error",
        },
      };
    }
  }

  async put<T, U>(path: string, body: T): Promise<ApiResponse<U>> {
    // POST と同様の実装
    return this.post(path, body);
  }

  async delete<T>(path: string): Promise<ApiResponse<T>> {
    // GET と同様の実装（bodyなし）
    return this.get(path);
  }
}

// 使用例
const apiClient = new TypeSafeApiClient("https://api.example.com");

async function fetchArticles(): Promise<Article[]> {
  const response = await apiClient.get<PaginatedData<Article>>("/articles");

  if (response.success) {
    return response.data.items;
  } else {
    console.error("Error:", response.error?.message);
    return [];
  }
}
```

## 📊 Step 3 評価基準

### 理解度チェックリスト

#### インターフェース設計 (30%)

- [ ] 基本的なインターフェースを設計できる
- [ ] 継承を適切に活用できる
- [ ] ジェネリックインターフェースを実装できる
- [ ] 実用的なデータモデルを設計できる

#### 型エイリアス活用 (25%)

- [ ] interface と type の使い分けができる
- [ ] ユニオン型・交差型を活用できる
- [ ] 複雑な型操作を実装できる
- [ ] 適切な型設計パターンを選択できる

#### データモデル設計 (25%)

- [ ] ドメインモデルを型安全に設計できる
- [ ] 関連性を適切に表現できる
- [ ] 拡張性を考慮した設計ができる
- [ ] 実用的な API インターフェースを設計できる

#### 実践応用 (20%)

- [ ] 型安全なクラスを実装できる
- [ ] 複雑なオブジェクト操作を型安全に実装できる
- [ ] エラーハンドリングを型安全に実装できる
- [ ] 実用的なライブラリを設計できる

### 成果物チェックリスト

- [ ] **ブログシステム**: 完全なデータモデル設計
- [ ] **API クライアント**: 型安全な REST クライアント
- [ ] **ドメインモデル**: EC サイトのデータモデル
- [ ] **インターフェース集**: 再利用可能なインターフェース群

## 🔄 Step 4 への準備

### 次週学習内容の予習

```typescript
// Step 4で学習するユニオン型と型ガードの基礎概念
// 以下のコードを読んで理解しておくこと

// 1. ユニオン型
type StringOrNumber = string | number;
type Status = "loading" | "success" | "error";

// 2. 型ガード
function isString(value: unknown): value is string {
  return typeof value === "string";
}

// 3. 判別可能なユニオン
interface LoadingState {
  status: "loading";
}

interface SuccessState {
  status: "success";
  data: any;
}

interface ErrorState {
  status: "error";
  error: string;
}

type AppState = LoadingState | SuccessState | ErrorState;
```

### 環境準備

- [ ] 型定義ファイルの理解深化
- [ ] VS Code での型情報活用
- [ ] TypeScript Playground での実験
- [ ] 実践プロジェクトの準備

### 学習継続のコツ

1. **設計思考**: インターフェース設計時の考え方を身につける
2. **実践重視**: 実際のプロジェクトでの活用を意識
3. **パターン学習**: 良い設計パターンの蓄積
4. **段階的拡張**: 小さなインターフェースから複雑な設計へ

---

**📌 重要**: Step 3 は TypeScript での型安全なオブジェクト設計の基礎を確立する重要な期間です。インターフェースの活用により、保守性と拡張性の高いコードが書けるようになります。

**🌟 次週は、ユニオン型と型ガードを使った、より柔軟で安全な型システムについて学習します！**
