# Step03 専門用語集

> 💡 **このファイルについて**: Step03で出てくる重要な専門用語と概念の詳細解説集です。

## 📋 目次
1. [インターフェース関連用語](#インターフェース関連用語)
2. [クラス設計関連用語](#クラス設計関連用語)
3. [抽象クラス関連用語](#抽象クラス関連用語)
4. [オブジェクト指向設計関連用語](#オブジェクト指向設計関連用語)
5. [Storeシステム関連用語](#storeシステム関連用語)

---

## インターフェース関連用語

### インターフェース（Interface）
**定義**: オブジェクトの構造を定義する契約

**他言語との比較**:
- **Java/C#**: クラスが実装すべきメソッドの契約
- **TypeScript**: オブジェクトの形状（shape）を定義する構造的型付け

**コード例**:
```typescript
// TypeScript: 構造的型付け
interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
}

// Java風の実装（参考）
// interface ProductService {
//   Product findById(String id);
//   void save(Product product);
// }

// TypeScriptでは関数インターフェースも可能
interface PriceCalculator {
  (basePrice: number, discount: number): number;
}

const calculateDiscountedPrice: PriceCalculator = (base, discount) => base * (1 - discount);
```

**実用場面**: データモデル定義、API契約、ビジネスロジック設計

### 構造的型付け（Structural Typing）
**定義**: 型の互換性を構造（プロパティとメソッド）で判断する仕組み

**名前的型付けとの違い**:
```typescript
// 構造的型付け（TypeScript）
interface ProductInfo {
  name: string;
  price: number;
}

interface ItemDetails {
  name: string;
  price: number;
}

// 構造が同じなので互換性がある
let product: ProductInfo = { name: "商品A", price: 1000 };
let item: ItemDetails = product; // OK

// 名前的型付け（Java/C#風）では不可
// class ProductInfo { name: string; price: number; }
// class ItemDetails { name: string; price: number; }
// ProductInfo product = new ItemDetails(); // Error
```

**なぜ重要か**: TypeScriptの柔軟性の源泉、ダックタイピングの型安全版

### インターフェース継承（Interface Inheritance）
**定義**: 既存のインターフェースを拡張して新しいインターフェースを作成

**コード例**:
```typescript
// 基本インターフェース
interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

// 継承による拡張
interface Product extends BaseEntity {
  name: string;
  price: number;
  category: string;
}

interface DigitalProduct extends Product {
  downloadUrl: string;
  licenseKey: string;
}

// 多重継承も可能
interface Timestamped {
  createdAt: Date;
  updatedAt: Date;
}

interface Identifiable {
  id: string;
}

interface Order extends Identifiable, Timestamped {
  customerId: string;
  totalAmount: number;
  status: OrderStatus;
}
```

**実用場面**: 共通プロパティの抽象化、階層的なデータモデル設計

### インターフェースマージ（Interface Merging）
**定義**: 同名のインターフェースが自動的に結合される機能

**コード例**:
```typescript
// 最初の定義
interface StoreConfig {
  apiUrl: string;
  timeout: number;
}

// 同名インターフェースの追加定義
interface StoreConfig {
  retryCount: number;
  cacheEnabled: boolean;
}

// 自動的にマージされる
const config: StoreConfig = {
  apiUrl: "https://api.store.com",
  timeout: 5000,
  retryCount: 3,
  cacheEnabled: true
};
```

**実用場面**: ライブラリの型拡張、モジュール拡張

---

## クラス設計関連用語

### クラス（Class）
**定義**: オブジェクトの設計図となるテンプレート

**TypeScriptでの特徴**:
```typescript
class Product {
  // プロパティ宣言
  private _id: string;
  public name: string;
  protected price: number;

  // コンストラクタ
  constructor(id: string, name: string, price: number) {
    this._id = id;
    this.name = name;
    this.price = price;
  }

  // メソッド
  public getId(): string {
    return this._id;
  }

  public getPrice(): number {
    return this.price;
  }

  // 静的メソッド
  static createFromData(data: any): Product {
    return new Product(data.id, data.name, data.price);
  }
}
```

**実用場面**: ビジネスロジックの実装、データの封じ込め

### アクセス修飾子（Access Modifiers）
**定義**: クラスメンバーのアクセス可能性を制御する修飾子

**種類と使い分け**:
```typescript
class InventoryItem {
  public id: string;           // どこからでもアクセス可能
  protected quantity: number;  // 同じクラスと継承クラスからアクセス可能
  private _cost: number;       // 同じクラス内からのみアクセス可能

  constructor(id: string, quantity: number, cost: number) {
    this.id = id;
    this.quantity = quantity;
    this._cost = cost;
  }

  // publicメソッド - 外部から呼び出し可能
  public getInfo(): string {
    return `${this.id}: ${this.quantity}個`;
  }

  // protectedメソッド - 継承クラスから呼び出し可能
  protected calculateValue(): number {
    return this.quantity * this._cost;
  }

  // privateメソッド - このクラス内からのみ呼び出し可能
  private validateQuantity(qty: number): boolean {
    return qty >= 0;
  }
}
```

### コンストラクタパラメータプロパティ
**定義**: コンストラクタの引数を自動的にプロパティとして定義する機能

**コード例**:
```typescript
// 従来の書き方
class OrderTraditional {
  private id: string;
  private customerId: string;
  private amount: number;

  constructor(id: string, customerId: string, amount: number) {
    this.id = id;
    this.customerId = customerId;
    this.amount = amount;
  }
}

// パラメータプロパティを使用
class Order {
  constructor(
    private id: string,
    private customerId: string,
    private amount: number
  ) {}

  public getOrderInfo(): string {
    return `Order ${this.id}: Customer ${this.customerId}, Amount ${this.amount}`;
  }
}
```

### インターフェース実装（Interface Implementation）
**定義**: クラスがインターフェースの契約を満たすことを保証する仕組み

**コード例**:
```typescript
interface PaymentProcessor {
  processPayment(amount: number): Promise<PaymentResult>;
  validatePayment(paymentData: any): boolean;
}

interface RefundProcessor {
  processRefund(transactionId: string, amount: number): Promise<RefundResult>;
}

// 単一インターフェース実装
class CreditCardProcessor implements PaymentProcessor {
  async processPayment(amount: number): Promise<PaymentResult> {
    // クレジットカード決済処理
    return { success: true, transactionId: "cc_" + Date.now() };
  }

  validatePayment(paymentData: any): boolean {
    return paymentData.cardNumber && paymentData.expiryDate;
  }
}

// 複数インターフェース実装
class FullServiceProcessor implements PaymentProcessor, RefundProcessor {
  async processPayment(amount: number): Promise<PaymentResult> {
    return { success: true, transactionId: "fs_" + Date.now() };
  }

  validatePayment(paymentData: any): boolean {
    return true;
  }

  async processRefund(transactionId: string, amount: number): Promise<RefundResult> {
    return { success: true, refundId: "ref_" + Date.now() };
  }
}
```

---

## 抽象クラス関連用語

### 抽象クラス（Abstract Class）
**定義**: インスタンス化できないクラスで、継承されることを前提とした基底クラス

**特徴と使用場面**:
```typescript
abstract class BaseProduct {
  protected id: string;
  protected name: string;
  protected price: number;

  constructor(id: string, name: string, price: number) {
    this.id = id;
    this.name = name;
    this.price = price;
  }

  // 具象メソッド（共通実装）
  public getId(): string {
    return this.id;
  }

  public getName(): string {
    return this.name;
  }

  // 抽象メソッド（継承クラスで実装必須）
  abstract calculateShippingCost(): number;
  abstract getProductType(): string;

  // テンプレートメソッド
  public getFullInfo(): string {
    return `${this.getProductType()}: ${this.name} (${this.id}) - ¥${this.price} + 送料¥${this.calculateShippingCost()}`;
  }
}

// 物理商品
class PhysicalProduct extends BaseProduct {
  constructor(
    id: string,
    name: string,
    price: number,
    private weight: number
  ) {
    super(id, name, price);
  }

  calculateShippingCost(): number {
    return this.weight * 100; // 重量ベース
  }

  getProductType(): string {
    return "物理商品";
  }
}

// デジタル商品
class DigitalProduct extends BaseProduct {
  constructor(
    id: string,
    name: string,
    price: number,
    private downloadSize: number
  ) {
    super(id, name, price);
  }

  calculateShippingCost(): number {
    return 0; // デジタル商品は送料無料
  }

  getProductType(): string {
    return "デジタル商品";
  }
}
```

### 抽象メソッド（Abstract Method）
**定義**: 抽象クラス内で宣言されるが実装されないメソッド

**使用目的**:
- 継承クラスに特定のメソッドの実装を強制
- 共通のインターフェースを保証
- テンプレートメソッドパターンの実現

### テンプレートメソッドパターン
**定義**: アルゴリズムの骨格を定義し、具体的な処理を継承クラスに委譲するパターン

**コード例**:
```typescript
abstract class OrderProcessor {
  // テンプレートメソッド
  public processOrder(order: Order): OrderResult {
    if (!this.validateOrder(order)) {
      throw new Error("注文の検証に失敗しました");
    }

    const paymentResult = this.processPayment(order);
    if (!paymentResult.success) {
      throw new Error("決済処理に失敗しました");
    }

    this.updateInventory(order);
    this.sendConfirmation(order);

    return {
      success: true,
      orderId: order.id,
      transactionId: paymentResult.transactionId
    };
  }

  // 共通実装
  protected validateOrder(order: Order): boolean {
    return order.items.length > 0 && order.totalAmount > 0;
  }

  // 抽象メソッド（継承クラスで実装）
  protected abstract processPayment(order: Order): PaymentResult;
  protected abstract updateInventory(order: Order): void;
  protected abstract sendConfirmation(order: Order): void;
}

class OnlineOrderProcessor extends OrderProcessor {
  protected processPayment(order: Order): PaymentResult {
    // オンライン決済処理
    return { success: true, transactionId: "online_" + Date.now() };
  }

  protected updateInventory(order: Order): void {
    // リアルタイム在庫更新
    console.log("在庫をリアルタイム更新");
  }

  protected sendConfirmation(order: Order): void {
    // メール確認送信
    console.log("確認メールを送信");
  }
}
```

---

## オブジェクト指向設計関連用語

### SOLID原則

#### S - 単一責任原則（Single Responsibility Principle）
```typescript
// 悪い例：複数の責任を持つクラス
class ProductManager {
  saveProduct(product: Product): void { /* DB保存 */ }
  sendNotification(product: Product): void { /* 通知送信 */ }
  validateProduct(product: Product): boolean { /* バリデーション */ }
  calculatePrice(product: Product): number { /* 価格計算 */ }
}

// 良い例：責任を分離
class ProductRepository {
  save(product: Product): void { /* DB保存のみ */ }
}

class NotificationService {
  sendProductNotification(product: Product): void { /* 通知送信のみ */ }
}

class ProductValidator {
  validate(product: Product): boolean { /* バリデーションのみ */ }
}

class PriceCalculator {
  calculate(product: Product): number { /* 価格計算のみ */ }
}
```

#### O - 開放閉鎖原則（Open/Closed Principle）
```typescript
// 拡張に開放、修正に閉鎖
interface ShippingCalculator {
  calculate(order: Order): number;
}

class StandardShipping implements ShippingCalculator {
  calculate(order: Order): number {
    return order.weight * 100;
  }
}

class ExpressShipping implements ShippingCalculator {
  calculate(order: Order): number {
    return order.weight * 200;
  }
}

// 新しい配送方法を追加する際、既存コードを変更しない
class OvernightShipping implements ShippingCalculator {
  calculate(order: Order): number {
    return order.weight * 500;
  }
}
```

#### L - リスコフ置換原則（Liskov Substitution Principle）
```typescript
abstract class PaymentMethod {
  abstract process(amount: number): PaymentResult;
  
  // 基底クラスの契約
  protected validateAmount(amount: number): boolean {
    return amount > 0;
  }
}

class CreditCard extends PaymentMethod {
  process(amount: number): PaymentResult {
    // 基底クラスの契約を守る
    if (!this.validateAmount(amount)) {
      throw new Error("無効な金額");
    }
    return { success: true, method: "credit" };
  }
}

class BankTransfer extends PaymentMethod {
  process(amount: number): PaymentResult {
    // 基底クラスの契約を守る
    if (!this.validateAmount(amount)) {
      throw new Error("無効な金額");
    }
    return { success: true, method: "bank" };
  }
}

// どの継承クラスも基底クラスと置換可能
function processPayment(method: PaymentMethod, amount: number) {
  return method.process(amount); // どの実装でも正常に動作
}
```

#### I - インターフェース分離原則（Interface Segregation Principle）
```typescript
// 悪い例：大きすぎるインターフェース
interface ProductOperations {
  create(product: Product): void;
  read(id: string): Product;
  update(product: Product): void;
  delete(id: string): void;
  sendEmail(product: Product): void;
  generateReport(product: Product): string;
  calculateTax(product: Product): number;
}

// 良い例：小さく分離されたインターフェース
interface ProductRepository {
  create(product: Product): void;
  read(id: string): Product;
  update(product: Product): void;
  delete(id: string): void;
}

interface ProductNotificationService {
  sendEmail(product: Product): void;
}

interface ProductReportService {
  generateReport(product: Product): string;
}

interface ProductTaxService {
  calculateTax(product: Product): number;
}
```

#### D - 依存性逆転原則（Dependency Inversion Principle）
```typescript
// 悪い例：高レベルモジュールが低レベルモジュールに依存
class OrderService {
  private emailSender = new EmailSender(); // 具象クラスに依存
  private database = new MySQLDatabase();  // 具象クラスに依存

  processOrder(order: Order): void {
    this.database.save(order);
    this.emailSender.send(order.customerEmail, "注文確認");
  }
}

// 良い例：抽象に依存
interface NotificationService {
  send(to: string, message: string): void;
}

interface OrderRepository {
  save(order: Order): void;
}

class OrderService {
  constructor(
    private notificationService: NotificationService, // 抽象に依存
    private orderRepository: OrderRepository         // 抽象に依存
  ) {}

  processOrder(order: Order): void {
    this.orderRepository.save(order);
    this.notificationService.send(order.customerEmail, "注文確認");
  }
}
```

---

## Storeシステム関連用語

### 商品管理（Product Management）
**定義**: 商品の登録、更新、削除、検索などの機能

**主要概念**:
```typescript
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: ProductCategory;
  sku: string; // Stock Keeping Unit
  status: ProductStatus;
}

enum ProductStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  DISCONTINUED = "discontinued"
}

interface ProductCategory {
  id: string;
  name: string;
  parentId?: string;
}
```

### 在庫管理（Inventory Management）
**定義**: 商品の在庫数量の追跡と管理

**主要概念**:
```typescript
interface InventoryItem {
  productId: string;
  quantity: number;
  reservedQuantity: number; // 予約済み数量
  minimumStock: number;     // 最小在庫数
  maximumStock: number;     // 最大在庫数
  lastUpdated: Date;
}

interface StockMovement {
  id: string;
  productId: string;
  type: MovementType;
  quantity: number;
  reason: string;
  timestamp: Date;
}

enum MovementType {
  IN = "in",     // 入庫
  OUT = "out",   // 出庫
  ADJUST = "adjust" // 調整
}
```

### 注文処理（Order Processing）
**定義**: 顧客からの注文を受け付け、処理、配送までの一連の流れ

**主要概念**:
```typescript
interface Order {
  id: string;
  customerId: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  shippingAddress: Address;
  paymentMethod: PaymentMethod;
  createdAt: Date;
  updatedAt: Date;
}

interface OrderItem {
  productId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

enum OrderStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  PROCESSING = "processing",
  SHIPPED = "shipped",
  DELIVERED = "delivered",
  CANCELLED = "cancelled"
}
```

### ビジネスルール（Business Rules）
**定義**: Storeシステムで適用される業務ルール

**例**:
```typescript
class OrderBusinessRules {
  // 最小注文金額チェック
  static validateMinimumOrderAmount(order: Order): boolean {
    const MINIMUM_ORDER = 1000;
    return order.totalAmount >= MINIMUM_ORDER;
  }

  // 在庫チェック
  static validateInventoryAvailability(orderItems: OrderItem[], inventory: InventoryItem[]): boolean {
    return orderItems.every(item => {
      const stock = inventory.find(inv => inv.productId === item.productId);
      return stock && (stock.quantity - stock.reservedQuantity) >= item.quantity;
    });
  }

  // 配送可能地域チェック
  static validateShippingArea(address: Address): boolean {
    const SUPPORTED_PREFECTURES = ["東京都", "神奈川県", "千葉県", "埼玉県"];
    return SUPPORTED_PREFECTURES.includes(address.prefecture);
  }
}
```

### ドメインサービス（Domain Service）
**定義**: 複数のエンティティにまたがるビジネスロジックを実装するサービス

**例**:
```typescript
class PricingService {
  calculateOrderTotal(items: OrderItem[], customer: Customer): number {
    let total = items.reduce((sum, item) => sum + item.totalPrice, 0);
    
    // 顧客レベル割引
    if (customer.level === CustomerLevel.PREMIUM) {
      total *= 0.95; // 5%割引
    }
    
    // 大量注文割引
    if (total >= 10000) {
      total *= 0.9; // 10%割引
    }
    
    return Math.round(total);
  }
}

class InventoryService {
  reserveStock(productId: string, quantity: number): boolean {
    const inventory = this.getInventory(productId);
    const availableQuantity = inventory.quantity - inventory.reservedQuantity;
    
    if (availableQuantity >= quantity) {
      inventory.reservedQuantity += quantity;
      return true;
    }
    
    return false;
  }
  
  releaseReservedStock(productId: string, quantity: number): void {
    const inventory = this.getInventory(productId);
    inventory.reservedQuantity = Math.max(0, inventory.reservedQuantity - quantity);
  }
}
```

---

## 📚 参考リンク

### TypeScript公式ドキュメント
- [Interfaces](https://www.typescriptlang.org/docs/handbook/interfaces.html)
- [Classes](https://www.typescriptlang.org/docs/handbook/classes.html)
- [Advanced Types](https://www.typescriptlang.org/docs/handbook/advanced-types.html)

### 設計原則・パターン
- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)
- [Design Patterns](https://refactoring.guru/design-patterns)
- [Domain-Driven Design](https://martinfowler.com/bliki/DomainDrivenDesign.html)

### オブジェクト指向設計
- [Object-Oriented Programming](https://en.wikipedia.org/wiki/Object-oriented_programming)
- [Composition over Inheritance](https://en.wikipedia.org/wiki/Composition_over_inheritance)

---

**🌟 重要**: これらの用語と概念を理解することで、TypeScriptでの効果的なオブジェクト指向設計が可能になります。Storeシステムの実装を通じて、実践的なスキルを身につけましょう！