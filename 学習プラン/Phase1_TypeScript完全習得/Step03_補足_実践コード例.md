# Step03 実践コード例

> 💡 **このファイルについて**: インターフェースとオブジェクト型の段階的な学習のためのコード例集です。

## 📋 目次
1. [基本的なインターフェース設計](#基本的なインターフェース設計)
2. [型エイリアスとの使い分け](#型エイリアスとの使い分け)
3. [継承とコンポジションの実践](#継承とコンポジションの実践)
4. [実用的なデータモデル設計](#実用的なデータモデル設計)

---

## 基本的なインターフェース設計

### ステップ1: シンプルなインターフェース
```typescript
// user-basic.ts

// 基本的なユーザーインターフェース
interface User {
  id: number;
  name: string;
  email: string;
  createdAt: Date;
}

// 使用例
const user: User = {
  id: 1,
  name: "Alice",
  email: "alice@example.com",
  createdAt: new Date()
};

console.log(`User: ${user.name} (${user.email})`);
```

**実行方法**:
```bash
npx ts-node user-basic.ts
```

**学習ポイント**:
- インターフェースの基本的な定義方法
- オブジェクトリテラルでの実装
- 型安全性の確保

### ステップ2: オプショナルプロパティ
```typescript
// user-optional.ts

interface CreateUserRequest {
  name: string;
  email: string;
  age?: number; // オプショナル
  profile?: {
    bio?: string;
    avatar?: string;
    socialLinks?: {
      twitter?: string;
      github?: string;
    };
  };
}

// 最小限の情報でユーザー作成
const minimalUser: CreateUserRequest = {
  name: "Bob",
  email: "bob@example.com"
};

// 詳細情報付きでユーザー作成
const detailedUser: CreateUserRequest = {
  name: "Charlie",
  email: "charlie@example.com",
  age: 28,
  profile: {
    bio: "Software Developer",
    avatar: "avatar.jpg",
    socialLinks: {
      github: "charlie-dev"
    }
  }
};

// ユーザー作成関数
function createUser(request: CreateUserRequest): User {
  return {
    id: Math.floor(Math.random() * 1000),
    name: request.name,
    email: request.email,
    createdAt: new Date()
  };
}

console.log("Minimal user:", createUser(minimalUser));
console.log("Detailed user:", createUser(detailedUser));
```

**学習ポイント**:
- オプショナルプロパティ（?）の使用
- ネストしたオブジェクトの型定義
- 柔軟なデータ構造の設計

### ステップ3: 読み取り専用プロパティ
```typescript
// user-readonly.ts

interface ReadonlyUser {
  readonly id: number;
  readonly createdAt: Date;
  name: string; // 変更可能
  email: string; // 変更可能
  readonly metadata: {
    readonly version: number;
    readonly source: string;
  };
}

function createReadonlyUser(name: string, email: string): ReadonlyUser {
  return {
    id: Math.floor(Math.random() * 1000),
    createdAt: new Date(),
    name,
    email,
    metadata: {
      version: 1,
      source: "api"
    }
  };
}

const user = createReadonlyUser("David", "david@example.com");

// 変更可能なプロパティ
user.name = "David Smith"; // OK
user.email = "david.smith@example.com"; // OK

// 読み取り専用プロパティ（エラーになる）
// user.id = 999; // Error: Cannot assign to 'id'
// user.createdAt = new Date(); // Error: Cannot assign to 'createdAt'
// user.metadata.version = 2; // Error: Cannot assign to 'version'

console.log("User:", user);
```

**学習ポイント**:
- readonly修飾子の使用
- イミュータブルなデータ設計
- 変更可能・不可能なプロパティの使い分け

---

## 型エイリアスとの使い分け

### ステップ4: インターフェース vs 型エイリアス
```typescript
// interface-vs-type.ts

// インターフェース（オブジェクトの形状定義に適している）
interface UserInterface {
  id: number;
  name: string;
  email: string;
}

// 型エイリアス（ユニオン型、プリミティブ型に適している）
type UserType = {
  id: number;
  name: string;
  email: string;
};

type Status = "active" | "inactive" | "pending";
type ID = string | number;
type UserTuple = [string, string, number]; // [name, email, age]

// インターフェースの継承
interface AdminUser extends UserInterface {
  permissions: string[];
  lastLogin?: Date;
}

// 型エイリアスのインターセクション
type AdminUserType = UserType & {
  permissions: string[];
  lastLogin?: Date;
};

// ユニオン型（型エイリアスでのみ可能）
type Shape = 
  | { kind: "circle"; radius: number }
  | { kind: "rectangle"; width: number; height: number }
  | { kind: "triangle"; base: number; height: number };

function calculateArea(shape: Shape): number {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;
    case "rectangle":
      return shape.width * shape.height;
    case "triangle":
      return (shape.base * shape.height) / 2;
  }
}

// 使用例
const circle: Shape = { kind: "circle", radius: 5 };
const rectangle: Shape = { kind: "rectangle", width: 10, height: 20 };

console.log("Circle area:", calculateArea(circle));
console.log("Rectangle area:", calculateArea(rectangle));

// インターフェースマージ（インターフェースでのみ可能）
interface Config {
  apiUrl: string;
}

interface Config {
  timeout: number;
}

// 自動的にマージされる
const config: Config = {
  apiUrl: "https://api.example.com",
  timeout: 5000
};

console.log("Config:", config);
```

**学習ポイント**:
- インターフェースと型エイリアスの使い分け
- 判別ユニオン型の実装
- インターフェースマージの活用

---

## 継承とコンポジションの実践

### ステップ5: インターフェース継承
```typescript
// interface-inheritance.ts

// 基本エンティティ
interface Entity {
  id: number;
  createdAt: Date;
  updatedAt: Date;
}

// タイムスタンプ機能
interface Timestamped {
  createdAt: Date;
  updatedAt: Date;
}

// 識別可能
interface Identifiable {
  id: number;
}

// 単一継承
interface User extends Entity {
  name: string;
  email: string;
}

// 多重継承
interface Product extends Identifiable, Timestamped {
  name: string;
  price: number;
  category: string;
}

// 階層的継承
interface AdminUser extends User {
  permissions: string[];
  role: "admin" | "super-admin";
}

interface SuperAdminUser extends AdminUser {
  systemAccess: boolean;
  auditLog: string[];
}

// 実装例
class UserService {
  private users: User[] = [];
  private nextId = 1;

  createUser(name: string, email: string): User {
    const now = new Date();
    const user: User = {
      id: this.nextId++,
      name,
      email,
      createdAt: now,
      updatedAt: now
    };
    this.users.push(user);
    return user;
  }

  promoteToAdmin(userId: number, permissions: string[]): AdminUser | null {
    const user = this.users.find(u => u.id === userId);
    if (!user) return null;

    const adminUser: AdminUser = {
      ...user,
      permissions,
      role: "admin",
      updatedAt: new Date()
    };

    return adminUser;
  }
}

// 使用例
const userService = new UserService();
const user = userService.createUser("Alice", "alice@example.com");
const admin = userService.promoteToAdmin(user.id, ["read", "write"]);

console.log("User:", user);
console.log("Admin:", admin);
```

**学習ポイント**:
- 単一継承と多重継承
- 階層的なインターフェース設計
- 継承を活用したデータモデル

### ステップ6: コンポジション設計
```typescript
// composition-design.ts

// 小さなインターフェースに分割（Interface Segregation Principle）
interface Logger {
  log(level: "info" | "warn" | "error", message: string): void;
}

interface Database {
  save<T>(collection: string, data: T): Promise<string>;
  find<T>(collection: string, id: string): Promise<T | null>;
  update<T>(collection: string, id: string, data: Partial<T>): Promise<boolean>;
  delete(collection: string, id: string): Promise<boolean>;
}

interface EmailService {
  sendEmail(to: string, subject: string, body: string): Promise<boolean>;
}

interface Validator<T> {
  validate(data: T): { isValid: boolean; errors: string[] };
}

// ユーザーバリデーター
class UserValidator implements Validator<CreateUserRequest> {
  validate(data: CreateUserRequest): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!data.name || data.name.trim().length === 0) {
      errors.push("Name is required");
    }

    if (!data.email || !data.email.includes("@")) {
      errors.push("Valid email is required");
    }

    if (data.age !== undefined && data.age < 0) {
      errors.push("Age must be positive");
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

// コンポジションを使用したユーザーサービス
class CompositeUserService {
  constructor(
    private logger: Logger,
    private database: Database,
    private emailService: EmailService,
    private validator: Validator<CreateUserRequest>
  ) {}

  async createUser(request: CreateUserRequest): Promise<User | null> {
    this.logger.log("info", `Creating user: ${request.name}`);

    // バリデーション
    const validation = this.validator.validate(request);
    if (!validation.isValid) {
      this.logger.log("error", `Validation failed: ${validation.errors.join(", ")}`);
      return null;
    }

    try {
      // ユーザー作成
      const user: User = {
        id: Math.floor(Math.random() * 1000),
        name: request.name,
        email: request.email,
        createdAt: new Date()
      };

      // データベース保存
      const userId = await this.database.save("users", user);
      this.logger.log("info", `User saved with ID: ${userId}`);

      // ウェルカムメール送信
      await this.emailService.sendEmail(
        user.email,
        "Welcome!",
        `Hello ${user.name}, welcome to our service!`
      );

      this.logger.log("info", `Welcome email sent to: ${user.email}`);
      return user;

    } catch (error) {
      this.logger.log("error", `Failed to create user: ${error}`);
      return null;
    }
  }
}

// 具体的な実装
class ConsoleLogger implements Logger {
  log(level: "info" | "warn" | "error", message: string): void {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${level.toUpperCase()}: ${message}`);
  }
}

class MemoryDatabase implements Database {
  private data = new Map<string, Map<string, any>>();

  async save<T>(collection: string, data: T): Promise<string> {
    if (!this.data.has(collection)) {
      this.data.set(collection, new Map());
    }
    
    const id = Math.random().toString(36);
    this.data.get(collection)!.set(id, data);
    return id;
  }

  async find<T>(collection: string, id: string): Promise<T | null> {
    const collectionData = this.data.get(collection);
    return collectionData?.get(id) || null;
  }

  async update<T>(collection: string, id: string, data: Partial<T>): Promise<boolean> {
    const collectionData = this.data.get(collection);
    const existing = collectionData?.get(id);
    if (existing) {
      collectionData!.set(id, { ...existing, ...data });
      return true;
    }
    return false;
  }

  async delete(collection: string, id: string): Promise<boolean> {
    const collectionData = this.data.get(collection);
    return collectionData?.delete(id) || false;
  }
}

class MockEmailService implements EmailService {
  async sendEmail(to: string, subject: string, body: string): Promise<boolean> {
    console.log(`📧 Email sent to ${to}: ${subject}`);
    return true;
  }
}

// 使用例
async function demonstrateComposition() {
  const logger = new ConsoleLogger();
  const database = new MemoryDatabase();
  const emailService = new MockEmailService();
  const validator = new UserValidator();

  const userService = new CompositeUserService(
    logger,
    database,
    emailService,
    validator
  );

  // 正常なユーザー作成
  const validUser = await userService.createUser({
    name: "Alice",
    email: "alice@example.com",
    age: 30
  });

  // バリデーションエラーのケース
  const invalidUser = await userService.createUser({
    name: "",
    email: "invalid-email",
    age: -5
  });

  console.log("Valid user:", validUser);
  console.log("Invalid user:", invalidUser);
}

demonstrateComposition();
```

**学習ポイント**:
- 依存性注入（Dependency Injection）
- インターフェース分離原則の適用
- テスタブルな設計
- 関心の分離

---

## 実用的なデータモデル設計

### ステップ7: Eコマースシステムのデータモデル
```typescript
// ecommerce-model.ts

// 基本エンティティ
interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

// 商品関連
interface Product extends BaseEntity {
  name: string;
  description: string;
  price: number;
  category: Category;
  inventory: Inventory;
  images: ProductImage[];
  attributes: ProductAttribute[];
}

interface Category {
  id: string;
  name: string;
  parentId?: string;
  slug: string;
}

interface Inventory {
  quantity: number;
  reserved: number;
  available: number;
  reorderLevel: number;
}

interface ProductImage {
  id: string;
  url: string;
  alt: string;
  isPrimary: boolean;
  order: number;
}

interface ProductAttribute {
  name: string;
  value: string;
  type: "text" | "number" | "boolean" | "select";
}

// ユーザー関連
interface Customer extends BaseEntity {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  addresses: Address[];
  preferences: CustomerPreferences;
}

interface Address {
  id: string;
  type: "billing" | "shipping";
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

interface CustomerPreferences {
  newsletter: boolean;
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  language: string;
  currency: string;
}

// 注文関連
interface Order extends BaseEntity {
  orderNumber: string;
  customerId: string;
  status: OrderStatus;
  items: OrderItem[];
  shipping: ShippingInfo;
  billing: BillingInfo;
  totals: OrderTotals;
  notes?: string;
}

type OrderStatus = 
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";

interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  attributes?: ProductAttribute[];
}

interface ShippingInfo {
  address: Address;
  method: ShippingMethod;
  trackingNumber?: string;
  estimatedDelivery?: Date;
  actualDelivery?: Date;
}

interface ShippingMethod {
  id: string;
  name: string;
  price: number;
  estimatedDays: number;
}

interface BillingInfo {
  address: Address;
  paymentMethod: PaymentMethod;
  transactionId?: string;
}

interface PaymentMethod {
  type: "credit_card" | "debit_card" | "paypal" | "bank_transfer";
  last4?: string; // クレジットカードの場合
  expiryMonth?: number;
  expiryYear?: number;
}

interface OrderTotals {
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
}

// ショッピングカート
interface Cart {
  id: string;
  customerId?: string; // ゲストの場合はundefined
  items: CartItem[];
  totals: CartTotals;
  expiresAt: Date;
}

interface CartItem {
  productId: string;
  quantity: number;
  addedAt: Date;
  selectedAttributes?: ProductAttribute[];
}

interface CartTotals {
  itemCount: number;
  subtotal: number;
  estimatedTax: number;
  estimatedTotal: number;
}

// サービスインターフェース
interface ProductService {
  getProduct(id: string): Promise<Product | null>;
  searchProducts(query: ProductSearchQuery): Promise<ProductSearchResult>;
  updateInventory(productId: string, quantity: number): Promise<boolean>;
}

interface ProductSearchQuery {
  keyword?: string;
  categoryId?: string;
  priceRange?: {
    min: number;
    max: number;
  };
  attributes?: Record<string, string>;
  sortBy?: "price" | "name" | "popularity" | "newest";
  sortOrder?: "asc" | "desc";
  page: number;
  limit: number;
}

interface ProductSearchResult {
  products: Product[];
  totalCount: number;
  page: number;
  totalPages: number;
  filters: SearchFilter[];
}

interface SearchFilter {
  name: string;
  type: "range" | "select" | "checkbox";
  options: FilterOption[];
}

interface FilterOption {
  value: string;
  label: string;
  count: number;
}

interface OrderService {
  createOrder(cart: Cart, shipping: ShippingInfo, billing: BillingInfo): Promise<Order>;
  getOrder(id: string): Promise<Order | null>;
  updateOrderStatus(id: string, status: OrderStatus): Promise<boolean>;
  cancelOrder(id: string, reason: string): Promise<boolean>;
}

interface CartService {
  getCart(id: string): Promise<Cart | null>;
  addItem(cartId: string, productId: string, quantity: number): Promise<Cart>;
  removeItem(cartId: string, productId: string): Promise<Cart>;
  updateQuantity(cartId: string, productId: string, quantity: number): Promise<Cart>;
  clearCart(cartId: string): Promise<boolean>;
}

// 使用例
class EcommerceDemo {
  static createSampleData(): {
    product: Product;
    customer: Customer;
    cart: Cart;
  } {
    const product: Product = {
      id: "prod-001",
      name: "TypeScript Programming Book",
      description: "Learn TypeScript from basics to advanced",
      price: 29.99,
      createdAt: new Date(),
      updatedAt: new Date(),
      category: {
        id: "cat-books",
        name: "Programming Books",
        slug: "programming-books"
      },
      inventory: {
        quantity: 100,
        reserved: 5,
        available: 95,
        reorderLevel: 10
      },
      images: [
        {
          id: "img-001",
          url: "https://example.com/book-cover.jpg",
          alt: "TypeScript Programming Book Cover",
          isPrimary: true,
          order: 1
        }
      ],
      attributes: [
        { name: "Author", value: "John Doe", type: "text" },
        { name: "Pages", value: "350", type: "number" },
        { name: "Format", value: "Paperback", type: "select" }
      ]
    };

    const customer: Customer = {
      id: "cust-001",
      email: "alice@example.com",
      firstName: "Alice",
      lastName: "Johnson",
      phone: "+1-555-0123",
      createdAt: new Date(),
      updatedAt: new Date(),
      addresses: [
        {
          id: "addr-001",
          type: "shipping",
          street: "123 Main St",
          city: "Anytown",
          state: "CA",
          zipCode: "12345",
          country: "US",
          isDefault: true
        }
      ],
      preferences: {
        newsletter: true,
        notifications: {
          email: true,
          sms: false,
          push: true
        },
        language: "en",
        currency: "USD"
      }
    };

    const cart: Cart = {
      id: "cart-001",
      customerId: customer.id,
      items: [
        {
          productId: product.id,
          quantity: 2,
          addedAt: new Date(),
          selectedAttributes: [
            { name: "Format", value: "Paperback", type: "select" }
          ]
        }
      ],
      totals: {
        itemCount: 2,
        subtotal: 59.98,
        estimatedTax: 4.80,
        estimatedTotal: 64.78
      },
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24時間後
    };

    return { product, customer, cart };
  }
}

// デモ実行
const sampleData = EcommerceDemo.createSampleData();
console.log("Sample Product:", JSON.stringify(sampleData.product, null, 2));
console.log("Sample Customer:", JSON.stringify(sampleData.customer, null, 2));
console.log("Sample Cart:", JSON.stringify(sampleData.cart, null, 2));
```

**学習ポイント**:
- 複雑なドメインモデルの設計
- 関連エンティティの適切な分離
- 実用的なサービスインターフェース設計
- 型安全なデータ構造

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

### 開発用の設定
```bash
# package.jsonにスクリプトを追加
{
  "scripts": {
    "dev": "ts-node src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "test": "jest"
  }
}

# 実行
npm run dev
```

---

## 📚 学習の進め方

1. **段階的に進める**: 基本的なインターフェースから始めて、徐々に複雑な設計に挑戦
2. **実際に動かす**: コードをコピーして実際に実行してみる
3. **改造してみる**: 既存のコードを改造して理解を深める
4. **設計を考える**: なぜその設計にしたのかを考える
5. **他の方法を試す**: 同じ機能を異なる方法で実装してみる

---

**📌 重要**: これらのコード例は実際のプロジェクトで使用できる実用的なパターンです。インターフェース設計の考え方を身につけて、保守性の高いコードを書けるようになりましょう。