# Step03 実践コード例

> 💡 **このファイルについて**: インターフェース、クラス設計、抽象クラスの段階的な学習のためのコード例集です。

## 📋 目次
1. [基本的なインターフェース設計](#基本的なインターフェース設計)
2. [クラス設計と実装](#クラス設計と実装)
3. [抽象クラスと高度な設計パターン](#抽象クラスと高度な設計パターン)
4. [Storeシステムの実装例](#storeシステムの実装例)

---

## 基本的なインターフェース設計

### ステップ1: 商品インターフェースの基本設計
```typescript
// product-basic.ts

// 基本的な商品インターフェース
interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  createdAt: Date;
}

// 使用例
const product: Product = {
  id: "prod_001",
  name: "TypeScript入門書",
  price: 2980,
  category: "書籍",
  createdAt: new Date()
};

console.log(`商品: ${product.name} - ¥${product.price}`);
```

**実行方法**:
```bash
npx ts-node product-basic.ts
```

**学習ポイント**:
- インターフェースの基本的な定義方法
- オブジェクトリテラルでの実装
- 型安全性の確保

### ステップ2: オプショナルプロパティと拡張
```typescript
// product-extended.ts

interface ProductCategory {
  id: string;
  name: string;
  description?: string;
}

interface CreateProductRequest {
  name: string;
  price: number;
  categoryId: string;
  description?: string;
  tags?: string[];
  specifications?: {
    weight?: number;
    dimensions?: {
      width: number;
      height: number;
      depth: number;
    };
  };
}

// 最小限の情報で商品作成
const minimalProduct: CreateProductRequest = {
  name: "シンプル商品",
  price: 1000,
  categoryId: "cat_001"
};

// 詳細情報付きで商品作成
const detailedProduct: CreateProductRequest = {
  name: "高機能ノートPC",
  price: 150000,
  categoryId: "cat_electronics",
  description: "最新のプロセッサを搭載した高性能ノートパソコン",
  tags: ["ノートPC", "高性能", "ビジネス"],
  specifications: {
    weight: 1.2,
    dimensions: {
      width: 30,
      height: 2,
      depth: 20
    }
  }
};

// 商品作成関数
function createProduct(request: CreateProductRequest): Product {
  return {
    id: "prod_" + Date.now(),
    name: request.name,
    price: request.price,
    category: request.categoryId,
    createdAt: new Date()
  };
}

console.log("最小商品:", createProduct(minimalProduct));
console.log("詳細商品:", createProduct(detailedProduct));
```

### ステップ3: インターフェース継承と多重継承
```typescript
// interface-inheritance.ts

// 基本エンティティ
interface BaseEntity {
  id: string;
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
  id: string;
}

// 単一継承
interface Product extends BaseEntity {
  name: string;
  price: number;
  category: string;
}

// 多重継承
interface InventoryItem extends Identifiable, Timestamped {
  productId: string;
  quantity: number;
  location: string;
}

// 階層的継承
interface DigitalProduct extends Product {
  downloadUrl: string;
  licenseKey: string;
  fileSize: number;
}

interface PhysicalProduct extends Product {
  weight: number;
  dimensions: {
    width: number;
    height: number;
    depth: number;
  };
  shippingRequired: boolean;
}

// 実装例
const digitalProduct: DigitalProduct = {
  id: "dig_001",
  name: "TypeScript完全ガイド（PDF版）",
  price: 1980,
  category: "電子書籍",
  createdAt: new Date(),
  updatedAt: new Date(),
  downloadUrl: "https://example.com/download/typescript-guide.pdf",
  licenseKey: "TS-GUIDE-2024-001",
  fileSize: 15728640 // 15MB
};

console.log("デジタル商品:", digitalProduct);
```

---

## クラス設計と実装

### ステップ4: 基本的なクラス設計
```typescript
// product-class.ts

class Product {
  private _id: string;
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor(
    public name: string,
    public price: number,
    public category: string
  ) {
    this._id = "prod_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);
    this._createdAt = new Date();
    this._updatedAt = new Date();
  }

  // Getter
  get id(): string {
    return this._id;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  // ビジネスロジック
  public updatePrice(newPrice: number): void {
    if (newPrice <= 0) {
      throw new Error("価格は0より大きい値である必要があります");
    }
    this.price = newPrice;
    this._updatedAt = new Date();
  }

  public applyDiscount(discountRate: number): number {
    if (discountRate < 0 || discountRate > 1) {
      throw new Error("割引率は0から1の間である必要があります");
    }
    return this.price * (1 - discountRate);
  }

  public getInfo(): string {
    return `${this.name} (${this.category}) - ¥${this.price}`;
  }

  // 静的メソッド
  static fromData(data: any): Product {
    return new Product(data.name, data.price, data.category);
  }
}

// 使用例
const product = new Product("TypeScript学習本", 2980, "書籍");
console.log("商品情報:", product.getInfo());
console.log("10%割引価格:", product.applyDiscount(0.1));

product.updatePrice(2500);
console.log("価格更新後:", product.getInfo());
```

### ステップ5: インターフェース実装とサービス層
```typescript
// product-service.ts

interface ProductRepository {
  save(product: Product): Promise<string>;
  findById(id: string): Promise<Product | null>;
  findByCategory(category: string): Promise<Product[]>;
  update(product: Product): Promise<boolean>;
  delete(id: string): Promise<boolean>;
}

interface ProductValidator {
  validate(product: Product): ValidationResult;
}

interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

class ProductValidatorImpl implements ProductValidator {
  validate(product: Product): ValidationResult {
    const errors: string[] = [];

    if (!product.name || product.name.trim().length === 0) {
      errors.push("商品名は必須です");
    }

    if (product.name && product.name.length > 100) {
      errors.push("商品名は100文字以内である必要があります");
    }

    if (product.price <= 0) {
      errors.push("価格は0より大きい値である必要があります");
    }

    if (product.price > 10000000) {
      errors.push("価格は1000万円以下である必要があります");
    }

    if (!product.category || product.category.trim().length === 0) {
      errors.push("カテゴリは必須です");
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

class InMemoryProductRepository implements ProductRepository {
  private products = new Map<string, Product>();

  async save(product: Product): Promise<string> {
    this.products.set(product.id, product);
    return product.id;
  }

  async findById(id: string): Promise<Product | null> {
    return this.products.get(id) || null;
  }

  async findByCategory(category: string): Promise<Product[]> {
    return Array.from(this.products.values())
      .filter(product => product.category === category);
  }

  async update(product: Product): Promise<boolean> {
    if (this.products.has(product.id)) {
      this.products.set(product.id, product);
      return true;
    }
    return false;
  }

  async delete(id: string): Promise<boolean> {
    return this.products.delete(id);
  }
}

class ProductService {
  constructor(
    private repository: ProductRepository,
    private validator: ProductValidator
  ) {}

  async createProduct(name: string, price: number, category: string): Promise<Product> {
    const product = new Product(name, price, category);
    
    const validation = this.validator.validate(product);
    if (!validation.isValid) {
      throw new Error(`商品の検証に失敗しました: ${validation.errors.join(", ")}`);
    }

    await this.repository.save(product);
    return product;
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return await this.repository.findByCategory(category);
  }
}

// 使用例
async function demonstrateProductService() {
  const repository = new InMemoryProductRepository();
  const validator = new ProductValidatorImpl();
  const productService = new ProductService(repository, validator);

  try {
    const product1 = await productService.createProduct("TypeScript入門", 2980, "書籍");
    const product2 = await productService.createProduct("JavaScript基礎", 2500, "書籍");
    
    console.log("作成された商品1:", product1.getInfo());
    console.log("作成された商品2:", product2.getInfo());

    const books = await productService.getProductsByCategory("書籍");
    console.log("書籍カテゴリの商品数:", books.length);
  } catch (error) {
    console.error("エラー:", error.message);
  }
}

demonstrateProductService();
```

---

## 抽象クラスと高度な設計パターン

### ステップ6: 抽象クラスによる共通処理の実装
```typescript
// abstract-product.ts

abstract class BaseProduct {
  protected _id: string;
  protected _createdAt: Date;
  protected _updatedAt: Date;

  constructor(
    public name: string,
    public price: number,
    public category: string
  ) {
    this._id = this.generateId();
    this._createdAt = new Date();
    this._updatedAt = new Date();
  }

  // 具象メソッド（共通実装）
  get id(): string {
    return this._id;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  protected generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  protected updateTimestamp(): void {
    this._updatedAt = new Date();
  }

  public updatePrice(newPrice: number): void {
    this.validatePrice(newPrice);
    this.price = newPrice;
    this.updateTimestamp();
  }

  protected validatePrice(price: number): void {
    if (price <= 0) {
      throw new Error("価格は0より大きい値である必要があります");
    }
  }

  // 抽象メソッド（継承クラスで実装必須）
  abstract calculateShippingCost(destination: string): number;
  abstract getProductType(): string;
  abstract canBeShipped(): boolean;

  // テンプレートメソッド
  public getFullInfo(): string {
    const shippingInfo = this.canBeShipped() ? 
      `送料: ¥${this.calculateShippingCost("東京都")}` : 
      "配送不要";
    
    return `${this.getProductType()}: ${this.name} - ¥${this.price} (${shippingInfo})`;
  }
}

// 物理商品
class PhysicalProduct extends BaseProduct {
  constructor(
    name: string,
    price: number,
    category: string,
    private weight: number,
    private fragile: boolean = false
  ) {
    super(name, price, category);
  }

  calculateShippingCost(destination: string): number {
    let baseCost = this.weight * 100;
    
    // 壊れやすい商品は追加料金
    if (this.fragile) {
      baseCost += 500;
    }
    
    // 地域による配送料金の違い
    const regionMultiplier = this.getRegionMultiplier(destination);
    return Math.round(baseCost * regionMultiplier);
  }

  private getRegionMultiplier(destination: string): number {
    const remoteAreas = ["沖縄県", "北海道"];
    return remoteAreas.includes(destination) ? 1.5 : 1.0;
  }

  getProductType(): string {
    return "物理商品";
  }

  canBeShipped(): boolean {
    return true;
  }
}

// デジタル商品
class DigitalProduct extends BaseProduct {
  constructor(
    name: string,
    price: number,
    category: string,
    private fileSize: number,
    private downloadUrl: string
  ) {
    super(name, price, category);
  }

  calculateShippingCost(destination: string): number {
    return 0; // デジタル商品は送料無料
  }

  getProductType(): string {
    return "デジタル商品";
  }

  canBeShipped(): boolean {
    return false; // 物理的な配送は不要
  }

  public getDownloadInfo(): { url: string; size: string } {
    return {
      url: this.downloadUrl,
      size: this.formatFileSize(this.fileSize)
    };
  }

  private formatFileSize(bytes: number): string {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  }
}

// 使用例
const physicalBook = new PhysicalProduct("TypeScript実践ガイド", 3500, "書籍", 0.8, false);
const digitalBook = new DigitalProduct("TypeScript完全マスター（PDF）", 2500, "電子書籍", 25165824, "https://example.com/download");

console.log("=== 商品情報 ===");
console.log(physicalBook.getFullInfo());
console.log(digitalBook.getFullInfo());

console.log("\n=== 詳細情報 ===");
console.log("デジタル商品ダウンロード情報:", digitalBook.getDownloadInfo());
```

### ステップ7: デザインパターンの実装
```typescript
// design-patterns.ts

// Strategy Pattern - 価格計算戦略
interface PricingStrategy {
  calculatePrice(basePrice: number, quantity: number): number;
}

class RegularPricing implements PricingStrategy {
  calculatePrice(basePrice: number, quantity: number): number {
    return basePrice * quantity;
  }
}

class BulkDiscountPricing implements PricingStrategy {
  constructor(private discountThreshold: number, private discountRate: number) {}

  calculatePrice(basePrice: number, quantity: number): number {
    const total = basePrice * quantity;
    if (quantity >= this.discountThreshold) {
      return total * (1 - this.discountRate);
    }
    return total;
  }
}

// Factory Pattern - 商品ファクトリー
abstract class ProductFactory {
  abstract createProduct(data: any): BaseProduct;
  
  // Template Method
  public processProductCreation(data: any): BaseProduct {
    this.validateData(data);
    const product = this.createProduct(data);
    this.logCreation(product);
    return product;
  }

  protected validateData(data: any): void {
    if (!data.name || !data.price || !data.category) {
      throw new Error("必須フィールドが不足しています");
    }
  }

  protected logCreation(product: BaseProduct): void {
    console.log(`商品が作成されました: ${product.getProductType()} - ${product.name}`);
  }
}

class PhysicalProductFactory extends ProductFactory {
  createProduct(data: any): PhysicalProduct {
    return new PhysicalProduct(
      data.name,
      data.price,
      data.category,
      data.weight || 1.0,
      data.fragile || false
    );
  }
}

class DigitalProductFactory extends ProductFactory {
  createProduct(data: any): DigitalProduct {
    return new DigitalProduct(
      data.name,
      data.price,
      data.category,
      data.fileSize || 1024,
      data.downloadUrl || "https://example.com/download"
    );
  }
}

// Observer Pattern - 在庫通知
interface StockObserver {
  onStockChanged(productId: string, newQuantity: number): void;
}

class EmailNotificationObserver implements StockObserver {
  onStockChanged(productId: string, newQuantity: number): void {
    if (newQuantity <= 5) {
      console.log(`📧 在庫警告メール送信: 商品 ${productId} の在庫が ${newQuantity} 個になりました`);
    }
  }
}

class InventoryManager {
  private inventory = new Map<string, number>();
  private observers: StockObserver[] = [];

  addObserver(observer: StockObserver): void {
    this.observers.push(observer);
  }

  private notifyObservers(productId: string, quantity: number): void {
    this.observers.forEach(observer => observer.onStockChanged(productId, quantity));
  }

  updateStock(productId: string, quantity: number): void {
    this.inventory.set(productId, quantity);
    this.notifyObservers(productId, quantity);
  }

  getStock(productId: string): number {
    return this.inventory.get(productId) || 0;
  }
}

// 使用例
console.log("=== Strategy Pattern Demo ===");
const regularPricing = new RegularPricing();
const bulkPricing = new BulkDiscountPricing(10, 0.1); // 10個以上で10%割引

console.log("通常価格 (5個):", regularPricing.calculatePrice(1000, 5));
console.log("大量割引 (15個):", bulkPricing.calculatePrice(1000, 15));

console.log("\n=== Factory Pattern Demo ===");
const physicalFactory = new PhysicalProductFactory();
const digitalFactory = new DigitalProductFactory();

const book = physicalFactory.processProductCreation({
  name: "TypeScript実践本",
  price: 3000,
  category: "書籍",
  weight: 0.5
});

console.log("\n=== Observer Pattern Demo ===");
const inventoryManager = new InventoryManager();
const emailObserver = new EmailNotificationObserver();

inventoryManager.addObserver(emailObserver);
inventoryManager.updateStock("prod_001", 10);
inventoryManager.updateStock("prod_001", 3); // 警告が発生
```

---

## Storeシステムの実装例

### ステップ8: 完全なStoreシステム
```typescript
// store-system.ts

// === ドメインエンティティ ===
interface Customer {
  id: string;
  name: string;
  email: string;
  membershipLevel: MembershipLevel;
  address: Address;
}

interface Address {
  prefecture: string;
  city: string;
  street: string;
  postalCode: string;
}

enum MembershipLevel {
  REGULAR = "regular",
  PREMIUM = "premium",
  VIP = "vip"
}

interface OrderItem {
  productId: string;
  quantity: number;
  unitPrice: number;
}

interface Order {
  id: string;
  customerId: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  createdAt: Date;
}

enum OrderStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  SHIPPED = "shipped",
  DELIVERED = "delivered",
  CANCELLED = "cancelled"
}

// === ビジネスルール ===
class StoreBusinessRules {
  static readonly MINIMUM_ORDER_AMOUNT = 1000;
  static readonly FREE_SHIPPING_THRESHOLD = 5000;

  static validateOrder(order: Order, inventory: Map<string, number>): ValidationResult {
    const errors: string[] = [];

    // 最小注文金額チェック
    if (order.totalAmount < this.MINIMUM_ORDER_AMOUNT) {
      errors.push(`最小注文金額は¥${this.MINIMUM_ORDER_AMOUNT}です`);
    }

    // 在庫チェック
    for (const item of order.items) {
      const availableStock = inventory.get(item.productId) || 0;
      if (availableStock < item.quantity) {
        errors.push(`商品 ${item.productId} の在庫が不足しています（在庫: ${availableStock}, 注文: ${item.quantity}）`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static calculateMembershipDiscount(amount: number, level: MembershipLevel): number {
    const discountRates = {
      [MembershipLevel.REGULAR]: 0,
      [MembershipLevel.PREMIUM]: 0.05,
      [MembershipLevel.VIP]: 0.1
    };

    return amount * discountRates[level];
  }

  static calculateShippingCost(order: Order, customer: Customer): number {
    if (order.totalAmount >= this.FREE_SHIPPING_THRESHOLD) {
      return 0; // 送料無料
    }

    // 地域による送料計算
    const baseCost = 500;
    const remoteAreas = ["沖縄県", "北海道"];
    
    if (remoteAreas.includes(customer.address.prefecture)) {
      return baseCost * 2;
    }

    return baseCost;
  }
}

// === サービス層 ===
interface CustomerRepository {
  findById(id: string): Promise<Customer | null>;
}

interface InventoryService {
  getAllInventory(): Promise<Map<string, number>>;
  reserveStock(productId: string, quantity: number): Promise<boolean>;
  releaseStock(productId: string, quantity: number): Promise<void>;
}

class OrderService {
  constructor(
    private productRepository: ProductRepository,
    private customerRepository: CustomerRepository,
    private inventoryService: InventoryService
  ) {}

  async createOrder(customerId: string, items: OrderItem[]): Promise<Order> {
    // 顧客情報取得
    const customer = await this.customerRepository.findById(customerId);
    if (!customer) {
      throw new Error("顧客が見つかりません");
    }

    // 商品情報と価格計算
    let totalAmount = 0;
    for (const item of items) {
      const product = await this.productRepository.findById(item.productId);
      if (!product) {
        throw new Error(`商品が見つかりません: ${item.productId}`);
      }
      totalAmount += item.unitPrice * item.quantity;
    }

    // 会員割引適用
    const discount = StoreBusinessRules.calculateMembershipDiscount(totalAmount, customer.membershipLevel);
    totalAmount -= discount;

    // 注文作成
    const order: Order = {
      id: "order_" + Date.now(),
      customerId,
      items,
      totalAmount,
      status: OrderStatus.PENDING,
      createdAt: new Date()
    };

    // ビジネスルール検証
    const inventory = await this.inventoryService.getAllInventory();
    const validation = StoreBusinessRules.validateOrder(order, inventory);
    
    if (!validation.isValid) {
      throw new Error(`注文の検証に失敗しました: ${validation.errors.join(", ")}`);
    }

    // 在庫予約
    for (const item of items) {
      const reserved = await this.inventoryService.reserveStock(item.productId, item.quantity);
      if (!reserved) {
        throw new Error(`在庫の予約に失敗しました: ${item.productId}`);
      }
    }

    return order;
  }

  async confirmOrder(orderId: string): Promise<void> {
    // 注文確認処理
    console.log(`注文 ${orderId} が確認されました`);
  }
}

// === 実装例 ===
class InMemoryCustomerRepository implements CustomerRepository {
  private customers = new Map<string, Customer>();

  constructor() {
    // サンプルデータ
    this.customers.set("cust_001", {
      id: "cust_001",
      name: "田中太郎",
      email: "tanaka@example.com",
      membershipLevel: MembershipLevel.PREMIUM,
      address: {
        prefecture: "東京都",
        city: "渋谷区",
        street: "渋谷1-1-1",
        postalCode: "150-0002"
      }
    });
  }

  async findById(id: string): Promise<Customer | null> {
    return this.customers.get(id) || null;
  }
}

class InMemoryInventoryService implements InventoryService {
  private inventory = new Map<string, number>();
  private reserved = new Map<string, number>();

  constructor() {
    // サンプル在庫データ
    this.inventory.set("prod_001", 100);
    this.inventory.set("prod_002", 50);
    this.inventory.set("prod_003", 25);
  }

  async getAllInventory(): Promise<Map<string, number>> {
    return new Map(this.inventory);
  }

  async reserveStock(productId: string, quantity: number): Promise<boolean> {
    const available = (this.inventory.get(productId) || 0) - (this.reserved.get(productId) || 0);
    if (available >= quantity) {
      const currentReserved = this.reserved.get(productId) || 0;
      this.reserved.set(productId, currentReserved + quantity);
      return true;
    }
    return false;
  }

  async releaseStock(productId: string, quantity: number): Promise<void> {
    const currentReserved = this.reserved.get(productId) || 0;
    this.reserved.set(productId, Math.max(0, currentReserved - quantity));
  }
}

// === 使用例 ===
async function demonstrateStoreSystem() {
  const productRepository = new InMemoryProductRepository();
  const customerRepository = new InMemoryCustomerRepository();
  const inventoryService = new InMemoryInventoryService();
  
  const orderService = new OrderService(
    productRepository,
    customerRepository,
    inventoryService
  );

  try {
    // 商品を事前に作成
    const productService = new ProductService(productRepository, new ProductValidatorImpl());
    await productService.createProduct("TypeScript入門書", 2980, "書籍");
    await productService.createProduct("JavaScript基礎", 2500, "書籍");

    // 注文作成
    const orderItems: OrderItem[] = [
      { productId: "prod_001", quantity: 2, unitPrice: 2980 },
      { productId: "prod_002", quantity: 1, unitPrice: 2500 }
    ];

    const order = await orderService.createOrder("cust_001", orderItems);
    console.log("注文が作成されました:", {
      orderId: order.id,
      totalAmount: order.totalAmount,
      status: order.status
    });

    await orderService.confirmOrder(order.id);
  } catch (error) {
    console.error("エラー:", error.message);
  }
}

demonstrateStoreSystem();
```

---

## 📚 学習の進め方

### 1. 段階的な実践
1. **基本**: インターフェースの定義から始める
2. **応用**: クラス設計とインターフェース実装
3. **発展**: 抽象クラスとデザインパターン
4. **統合**: 完全なシステム設計

### 2. コード実行とテスト
```bash
# TypeScriptコンパイラのインストール
npm install -g typescript

# コードの実行
npx ts-node filename.ts

# 型チェックのみ
tsc --noEmit filename.ts
```

### 3. 実践的な学習方法
- **写経**: コード例を実際に入力して動作確認
- **改造**: 既存コードを修正して動作の変化を確認
- **拡張**: 新しい機能を追加して理解を深める
- **設計**: 自分なりのシステムを設計してみる

### 4. デバッグとトラブルシューティング
- **型エラー**: Type
