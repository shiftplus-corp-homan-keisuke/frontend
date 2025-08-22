# Step08 実践プロジェクト：e コマースシステムで SOLID 原則実装

> 💡 **プロジェクト概要**: TypeScript で SOLID 原則を完全実装する e コマースシステム
> 🎯 **学習目標**: 5 つの SOLID 原則を段階的に適用し、設計の改善プロセスを体験
> 🛠️ **技術スタック**: TypeScript, Node.js, Jest, 設計パターン

---

## 🏗️ プロジェクト構成

### 📋 実装する e コマースシステムの機能

#### **コア機能**

1. **商品管理** - 商品の登録・更新・検索・在庫管理
2. **注文処理** - カート管理・注文作成・決済・配送
3. **ユーザー管理** - 登録・認証・プロフィール管理
4. **通知システム** - Email・SMS・プッシュ通知
5. **レポート機能** - 売上集計・在庫レポート・分析

#### **SOLID 原則適用ポイント**

- **SRP**: 各クラスは単一の責任のみ持つ
- **OCP**: 新機能追加時に既存コード変更なし
- **LSP**: 基底クラスは派生クラスで置換可能
- **ISP**: インターフェースは最小限の責任を持つ
- **DIP**: 高水準モジュールは抽象に依存

---

## 📁 プロジェクト構造

```
ecommerce-solid/
├── src/
│   ├── domain/                    # ドメイン層
│   │   ├── entities/             # エンティティ
│   │   │   ├── Product.ts
│   │   │   ├── Order.ts
│   │   │   ├── User.ts
│   │   │   └── index.ts
│   │   ├── value-objects/        # 値オブジェクト
│   │   │   ├── Money.ts
│   │   │   ├── Email.ts
│   │   │   └── ProductId.ts
│   │   ├── repositories/         # リポジトリインターフェース
│   │   │   ├── IProductRepository.ts
│   │   │   ├── IOrderRepository.ts
│   │   │   └── IUserRepository.ts
│   │   └── services/             # ドメインサービス
│   │       ├── PricingService.ts
│   │       └── InventoryService.ts
│   ├── application/              # アプリケーション層
│   │   ├── use-cases/           # ユースケース
│   │   │   ├── product/
│   │   │   ├── order/
│   │   │   └── user/
│   │   ├── services/            # アプリケーションサービス
│   │   │   ├── NotificationService.ts
│   │   │   └── ReportService.ts
│   │   └── dto/                 # データ転送オブジェクト
│   │       ├── ProductDto.ts
│   │       └── OrderDto.ts
│   ├── infrastructure/          # インフラストラクチャ層
│   │   ├── repositories/        # リポジトリ実装
│   │   │   ├── InMemoryProductRepository.ts
│   │   │   └── FileProductRepository.ts
│   │   ├── services/           # 外部サービス
│   │   │   ├── EmailService.ts
│   │   │   ├── SmsService.ts
│   │   │   └── PaymentService.ts
│   │   └── adapters/           # アダプター
│   │       ├── DatabaseAdapter.ts
│   │       └── FileAdapter.ts
│   ├── presentation/           # プレゼンテーション層
│   │   ├── controllers/        # コントローラー
│   │   │   ├── ProductController.ts
│   │   │   └── OrderController.ts
│   │   ├── middleware/         # ミドルウェア
│   │   │   └── ValidationMiddleware.ts
│   │   └── views/              # ビュー
│   │       └── ProductView.ts
│   ├── shared/                 # 共通
│   │   ├── interfaces/         # 共通インターフェース
│   │   ├── types/              # 型定義
│   │   ├── utils/              # ユーティリティ
│   │   └── constants/          # 定数
│   └── main.ts                 # エントリーポイント
├── tests/                      # テスト
│   ├── unit/                   # 単体テスト
│   ├── integration/            # 統合テスト
│   └── e2e/                    # E2Eテスト
├── docs/                       # ドキュメント
│   ├── architecture.md         # アーキテクチャ説明
│   ├── solid-principles.md     # SOLID原則適用説明
│   └── api.md                  # API仕様
└── examples/                   # 段階別実装例
    ├── step1-violation/        # 原則違反コード
    ├── step2-basic/            # 基本実装
    ├── step3-intermediate/     # 中級実装
    └── step4-advanced/         # 上級実装
```

---

## 🔨 段階的実装プロセス

### Phase 1: SOLID 原則違反版（アンチパターン）

#### **目的**: 原則に違反したコードを作成し、問題点を明確化

**Step 1-1: 巨大な Product クラス（SRP 違反）**

```typescript
// examples/step1-violation/Product.ts
export class Product {
  constructor(
    public id: string,
    public name: string,
    public price: number,
    public stock: number,
    public category: string,
    public description: string
  ) {}

  // SRP違反: 商品データ管理
  public updateProduct(data: Partial<Product>): void {
    Object.assign(this, data);
  }

  // SRP違反: 在庫管理
  public updateStock(quantity: number): boolean {
    if (this.stock + quantity < 0) {
      return false;
    }
    this.stock += quantity;
    return true;
  }

  // SRP違反: 価格計算
  public calculateDiscountPrice(discountPercent: number): number {
    return this.price * (1 - discountPercent / 100);
  }

  // SRP違反: データ永続化
  public saveToDatabase(): void {
    console.log(`Saving product ${this.id} to database`);
    // データベース操作のロジック
  }

  // SRP違反: バリデーション
  public validate(): boolean {
    return this.name.length > 0 && this.price > 0 && this.stock >= 0;
  }

  // SRP違反: 表示形式変換
  public toDisplayString(): string {
    return `${this.name} - ¥${this.price.toLocaleString()} (在庫: ${
      this.stock
    })`;
  }

  // SRP違反: レポート生成
  public generateInventoryReport(): string {
    return `商品ID: ${this.id}\n名前: ${this.name}\n在庫数: ${this.stock}`;
  }

  // SRP違反: 通知処理
  public notifyLowStock(): void {
    if (this.stock < 10) {
      console.log(`Low stock alert for ${this.name}`);
      // メール送信処理
      this.sendEmailAlert();
    }
  }

  private sendEmailAlert(): void {
    console.log(`Sending email alert for ${this.name}`);
  }
}
```

**Step 1-2: Switch 文による分岐処理（OCP 違反）**

```typescript
// examples/step1-violation/PaymentProcessor.ts
export class PaymentProcessor {
  public processPayment(amount: number, method: string): boolean {
    // OCP違反: 新しい決済方法追加時にこのメソッドの修正が必要
    switch (method) {
      case "credit":
        return this.processCreditCardPayment(amount);
      case "debit":
        return this.processDebitCardPayment(amount);
      case "paypal":
        return this.processPayPalPayment(amount);
      case "bitcoin":
        return this.processBitcoinPayment(amount);
      // 新しい決済方法を追加するたびにここを修正...
      default:
        throw new Error(`Unsupported payment method: ${method}`);
    }
  }

  private processCreditCardPayment(amount: number): boolean {
    console.log(`Processing credit card payment: ¥${amount}`);
    return true;
  }

  private processDebitCardPayment(amount: number): boolean {
    console.log(`Processing debit card payment: ¥${amount}`);
    return true;
  }

  private processPayPalPayment(amount: number): boolean {
    console.log(`Processing PayPal payment: ¥${amount}`);
    return true;
  }

  private processBitcoinPayment(amount: number): boolean {
    console.log(`Processing Bitcoin payment: ¥${amount}`);
    return true;
  }
}
```

**Step 1-3: 継承における契約違反（LSP 違反）**

```typescript
// examples/step1-violation/Birds.ts
export class Bird {
  public fly(): void {
    console.log("Flying in the sky");
  }

  public move(): void {
    this.fly();
  }
}

export class Duck extends Bird {
  public swim(): void {
    console.log("Swimming in water");
  }
}

// LSP違反: ペンギンは飛べないのに Bird を継承
export class Penguin extends Bird {
  public fly(): void {
    // LSP違反: 基底クラスの契約を破る
    throw new Error("Penguins cannot fly!");
  }

  public move(): void {
    // LSP違反: 基底クラスと異なる動作
    this.walk();
  }

  private walk(): void {
    console.log("Walking on ice");
  }
}

// 使用例でLSP違反が問題となる
export function makeBirdsMove(birds: Bird[]): void {
  birds.forEach((bird) => {
    try {
      bird.move(); // Penguinの場合、予期しない動作
    } catch (error) {
      console.error(`Error: ${error.message}`);
    }
  });
}
```

**Step 1-4: 肥大化したインターフェース（ISP 違反）**

```typescript
// examples/step1-violation/UserInterface.ts
// ISP違反: すべての機能を1つのインターフェースに詰め込み
export interface IUser {
  // 基本ユーザー情報
  getId(): string;
  getName(): string;
  getEmail(): string;

  // 認証関連
  authenticate(password: string): boolean;
  changePassword(oldPassword: string, newPassword: string): boolean;

  // プロフィール管理
  updateProfile(data: any): void;
  getProfile(): any;

  // 注文管理
  createOrder(items: any[]): string;
  getOrderHistory(): any[];
  cancelOrder(orderId: string): boolean;

  // 支払い管理
  addPaymentMethod(method: any): void;
  removePaymentMethod(methodId: string): boolean;
  getPaymentMethods(): any[];

  // 管理者機能
  deleteUser(userId: string): boolean;
  banUser(userId: string): boolean;
  viewAllUsers(): any[];

  // レポート機能
  generateUserReport(): string;
  exportUserData(): any;

  // 通知機能
  sendNotification(message: string): void;
  getNotificationPreferences(): any;
  updateNotificationPreferences(prefs: any): void;
}

// 一般ユーザークラスでも管理者機能を実装する必要がある（ISP違反）
export class RegularUser implements IUser {
  constructor(
    private id: string,
    private name: string,
    private email: string
  ) {}

  getId(): string {
    return this.id;
  }
  getName(): string {
    return this.name;
  }
  getEmail(): string {
    return this.email;
  }

  authenticate(password: string): boolean {
    return true; // 実装省略
  }

  changePassword(oldPassword: string, newPassword: string): boolean {
    return true; // 実装省略
  }

  updateProfile(data: any): void {
    // 実装
  }

  getProfile(): any {
    return {}; // 実装省略
  }

  createOrder(items: any[]): string {
    return "order-id"; // 実装省略
  }

  getOrderHistory(): any[] {
    return []; // 実装省略
  }

  cancelOrder(orderId: string): boolean {
    return true; // 実装省略
  }

  addPaymentMethod(method: any): void {
    // 実装省略
  }

  removePaymentMethod(methodId: string): boolean {
    return true; // 実装省略
  }

  getPaymentMethods(): any[] {
    return []; // 実装省略
  }

  // ISP違反: 一般ユーザーには不要な管理者機能を実装
  deleteUser(userId: string): boolean {
    throw new Error("Regular users cannot delete other users");
  }

  banUser(userId: string): boolean {
    throw new Error("Regular users cannot ban other users");
  }

  viewAllUsers(): any[] {
    throw new Error("Regular users cannot view all users");
  }

  generateUserReport(): string {
    throw new Error("Regular users cannot generate reports");
  }

  exportUserData(): any {
    throw new Error("Regular users cannot export data");
  }

  sendNotification(message: string): void {
    // 実装省略
  }

  getNotificationPreferences(): any {
    return {}; // 実装省略
  }

  updateNotificationPreferences(prefs: any): void {
    // 実装省略
  }
}
```

**Step 1-5: 具象クラスへの直接依存（DIP 違反）**

```typescript
// examples/step1-violation/OrderService.ts
import { MySqlUserRepository } from "./MySqlUserRepository";
import { EmailNotifier } from "./EmailNotifier";
import { CreditCardProcessor } from "./CreditCardProcessor";

// DIP違反: 高水準モジュールが具象クラスに直接依存
export class OrderService {
  private userRepository: MySqlUserRepository;
  private notifier: EmailNotifier;
  private paymentProcessor: CreditCardProcessor;

  constructor() {
    // DIP違反: 具象クラスを直接インスタンス化
    this.userRepository = new MySqlUserRepository();
    this.notifier = new EmailNotifier();
    this.paymentProcessor = new CreditCardProcessor();
  }

  public createOrder(userId: string, items: any[], paymentInfo: any): string {
    // DIP違反: 具象クラスのメソッドを直接使用
    const user = this.userRepository.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const orderId = this.generateOrderId();
    const totalAmount = this.calculateTotal(items);

    // DIP違反: 決済処理も具象クラスに依存
    const paymentSuccess = this.paymentProcessor.processCreditCard(
      paymentInfo.cardNumber,
      paymentInfo.expiryDate,
      paymentInfo.cvv,
      totalAmount
    );

    if (!paymentSuccess) {
      throw new Error("Payment failed");
    }

    // DIP違反: 通知も具象クラスに依存
    this.notifier.sendEmail(
      user.email,
      "Order Confirmation",
      `Your order ${orderId} has been confirmed.`
    );

    return orderId;
  }

  private generateOrderId(): string {
    return `ORDER-${Date.now()}`;
  }

  private calculateTotal(items: any[]): number {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  }
}

// 具象クラス例
export class MySqlUserRepository {
  public findById(id: string): any {
    console.log(`Finding user by ID: ${id} in MySQL database`);
    return { id, email: "user@example.com" };
  }
}

export class EmailNotifier {
  public sendEmail(to: string, subject: string, body: string): void {
    console.log(`Sending email to ${to}: ${subject}`);
  }
}

export class CreditCardProcessor {
  public processCreditCard(
    cardNumber: string,
    expiry: string,
    cvv: string,
    amount: number
  ): boolean {
    console.log(`Processing credit card payment: ¥${amount}`);
    return true;
  }
}
```

### Phase 2: SOLID 原則適用版（改善実装）

#### **目的**: 各原則を適用してコードを段階的に改善

**Step 2-1: SRP 適用 - 責任の分離**

```typescript
// examples/step2-basic/entities/Product.ts
export class Product {
  constructor(
    private readonly id: string,
    private name: string,
    private price: number,
    private stock: number,
    private readonly category: string,
    private description: string
  ) {}

  // SRP適用: 商品データのみ管理
  public getId(): string {
    return this.id;
  }
  public getName(): string {
    return this.name;
  }
  public getPrice(): number {
    return this.price;
  }
  public getStock(): number {
    return this.stock;
  }
  public getCategory(): string {
    return this.category;
  }
  public getDescription(): string {
    return this.description;
  }

  public updateName(name: string): void {
    this.name = name;
  }

  public updatePrice(price: number): void {
    if (price <= 0) {
      throw new Error("Price must be positive");
    }
    this.price = price;
  }

  public updateDescription(description: string): void {
    this.description = description;
  }
}

// SRP適用: 在庫管理の責任を分離
export class InventoryManager {
  public updateStock(product: Product, quantity: number): boolean {
    const currentStock = product.getStock();
    if (currentStock + quantity < 0) {
      return false;
    }
    // 在庫更新ロジック
    return true;
  }

  public isLowStock(product: Product, threshold: number = 10): boolean {
    return product.getStock() < threshold;
  }
}

// SRP適用: 価格計算の責任を分離
export class PriceCalculator {
  public calculateDiscountPrice(
    product: Product,
    discountPercent: number
  ): number {
    const basePrice = product.getPrice();
    return basePrice * (1 - discountPercent / 100);
  }

  public calculateTax(product: Product, taxRate: number): number {
    return product.getPrice() * (taxRate / 100);
  }
}

// SRP適用: バリデーションの責任を分離
export class ProductValidator {
  public validate(product: Product): boolean {
    return (
      this.validateName(product.getName()) &&
      this.validatePrice(product.getPrice()) &&
      this.validateStock(product.getStock())
    );
  }

  private validateName(name: string): boolean {
    return name.trim().length > 0;
  }

  private validatePrice(price: number): boolean {
    return price > 0;
  }

  private validateStock(stock: number): boolean {
    return stock >= 0;
  }
}

// SRP適用: 表示の責任を分離
export class ProductFormatter {
  public toDisplayString(product: Product): string {
    return `${product.getName()} - ¥${product
      .getPrice()
      .toLocaleString()} (在庫: ${product.getStock()})`;
  }

  public toJson(product: Product): object {
    return {
      id: product.getId(),
      name: product.getName(),
      price: product.getPrice(),
      stock: product.getStock(),
      category: product.getCategory(),
      description: product.getDescription(),
    };
  }
}
```

**Step 2-2: OCP 適用 - 戦略パターンによる拡張**

```typescript
// examples/step2-basic/payments/PaymentStrategy.ts
export interface PaymentStrategy {
  processPayment(amount: number): boolean;
  getPaymentType(): string;
}

export class CreditCardPayment implements PaymentStrategy {
  constructor(
    private cardNumber: string,
    private expiryDate: string,
    private cvv: string
  ) {}

  public processPayment(amount: number): boolean {
    console.log(`Processing credit card payment: ¥${amount}`);
    // クレジットカード決済ロジック
    return true;
  }

  public getPaymentType(): string {
    return "Credit Card";
  }
}

export class PayPalPayment implements PaymentStrategy {
  constructor(private email: string, private password: string) {}

  public processPayment(amount: number): boolean {
    console.log(`Processing PayPal payment: ¥${amount}`);
    // PayPal決済ロジック
    return true;
  }

  public getPaymentType(): string {
    return "PayPal";
  }
}

export class BankTransferPayment implements PaymentStrategy {
  constructor(private bankAccount: string, private routingNumber: string) {}

  public processPayment(amount: number): boolean {
    console.log(`Processing bank transfer payment: ¥${amount}`);
    // 銀行振込ロジック
    return true;
  }

  public getPaymentType(): string {
    return "Bank Transfer";
  }
}

// OCP適用: 新しい決済方法を追加してもPaymentProcessorは変更不要
export class PaymentProcessor {
  constructor(private strategy: PaymentStrategy) {}

  public processPayment(amount: number): boolean {
    console.log(`Payment method: ${this.strategy.getPaymentType()}`);
    return this.strategy.processPayment(amount);
  }

  public setStrategy(strategy: PaymentStrategy): void {
    this.strategy = strategy;
  }
}

// 使用例: 新しい決済方法（仮想通貨）を追加
export class CryptocurrencyPayment implements PaymentStrategy {
  constructor(private walletAddress: string, private currency: string) {}

  public processPayment(amount: number): boolean {
    console.log(
      `Processing ${this.currency} payment: ¥${amount} to ${this.walletAddress}`
    );
    // 仮想通貨決済ロジック
    return true;
  }

  public getPaymentType(): string {
    return `Cryptocurrency (${this.currency})`;
  }
}
```

**Step 2-3: LSP 適用 - 適切な継承設計**

```typescript
// examples/step2-basic/vehicles/Vehicle.ts
export abstract class Vehicle {
  constructor(
    protected readonly id: string,
    protected readonly model: string
  ) {}

  public getId(): string {
    return this.id;
  }
  public getModel(): string {
    return this.model;
  }

  // すべての乗り物が実装すべき基本操作
  public abstract startEngine(): void;
  public abstract stopEngine(): void;
  public abstract move(): void;
}

export class Car extends Vehicle {
  private isEngineRunning = false;

  public startEngine(): void {
    if (!this.isEngineRunning) {
      this.isEngineRunning = true;
      console.log(`Car ${this.model} engine started`);
    }
  }

  public stopEngine(): void {
    if (this.isEngineRunning) {
      this.isEngineRunning = false;
      console.log(`Car ${this.model} engine stopped`);
    }
  }

  public move(): void {
    if (this.isEngineRunning) {
      console.log(`Car ${this.model} is driving on roads`);
    } else {
      throw new Error("Cannot move: engine is not running");
    }
  }
}

export class Bicycle extends Vehicle {
  public startEngine(): void {
    // 自転車にはエンジンがないが、「準備」として解釈
    console.log(`Bicycle ${this.model} is ready to ride`);
  }

  public stopEngine(): void {
    // 自転車の「停止準備」として解釈
    console.log(`Bicycle ${this.model} stopped`);
  }

  public move(): void {
    console.log(`Bicycle ${this.model} is pedaling`);
  }
}

export class Boat extends Vehicle {
  private isEngineRunning = false;

  public startEngine(): void {
    this.isEngineRunning = true;
    console.log(`Boat ${this.model} engine started`);
  }

  public stopEngine(): void {
    this.isEngineRunning = false;
    console.log(`Boat ${this.model} engine stopped`);
  }

  public move(): void {
    if (this.isEngineRunning) {
      console.log(`Boat ${this.model} is sailing on water`);
    } else {
      throw new Error("Cannot move: engine is not running");
    }
  }
}

// LSP適用: どのVehicleサブクラスでも置換可能
export class VehicleManager {
  public operateVehicle(vehicle: Vehicle): void {
    vehicle.startEngine();
    vehicle.move();
    vehicle.stopEngine();
  }

  public operateMultipleVehicles(vehicles: Vehicle[]): void {
    vehicles.forEach((vehicle) => {
      this.operateVehicle(vehicle);
    });
  }
}

// 使用例: LSPが守られているため、どのサブクラスでも正常動作
const vehicles: Vehicle[] = [
  new Car("V001", "Toyota Camry"),
  new Bicycle("B001", "Giant Escape"),
  new Boat("S001", "Sea Ray 280"),
];

const manager = new VehicleManager();
manager.operateMultipleVehicles(vehicles);
```

**Step 2-4: ISP 適用 - インターフェース分離**

```typescript
// examples/step2-basic/interfaces/UserInterfaces.ts
// ISP適用: 機能ごとにインターフェースを分離

// 基本ユーザー情報
export interface IUserBasic {
  getId(): string;
  getName(): string;
  getEmail(): string;
}

// 認証機能
export interface IAuthenticatable {
  authenticate(password: string): boolean;
  changePassword(oldPassword: string, newPassword: string): boolean;
}

// プロフィール管理
export interface IProfileManageable {
  updateProfile(data: ProfileData): void;
  getProfile(): ProfileData;
}

// 注文管理
export interface IOrderManageable {
  createOrder(items: OrderItem[]): string;
  getOrderHistory(): Order[];
  cancelOrder(orderId: string): boolean;
}

// 支払い管理
export interface IPaymentManageable {
  addPaymentMethod(method: PaymentMethod): void;
  removePaymentMethod(methodId: string): boolean;
  getPaymentMethods(): PaymentMethod[];
}

// 管理者機能
export interface IAdministrative {
  deleteUser(userId: string): boolean;
  banUser(userId: string): boolean;
  viewAllUsers(): User[];
}

// 通知機能
export interface INotifiable {
  sendNotification(message: string): void;
  getNotificationPreferences(): NotificationPreferences;
  updateNotificationPreferences(prefs: NotificationPreferences): void;
}

// 型定義
export interface ProfileData {
  name: string;
  email: string;
  address?: string;
  phone?: string;
}

export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  items: OrderItem[];
  totalAmount: number;
  createdAt: Date;
}

export interface PaymentMethod {
  id: string;
  type: string;
  details: any;
}

export interface NotificationPreferences {
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

// ISP適用: 各ユーザータイプは必要なインターフェースのみ実装
export class RegularUser
  implements
    IUserBasic,
    IAuthenticatable,
    IProfileManageable,
    IOrderManageable,
    IPaymentManageable,
    INotifiable
{
  constructor(
    private id: string,
    private name: string,
    private email: string,
    private passwordHash: string
  ) {}

  // IUserBasic
  getId(): string {
    return this.id;
  }
  getName(): string {
    return this.name;
  }
  getEmail(): string {
    return this.email;
  }

  // IAuthenticatable
  authenticate(password: string): boolean {
    // パスワード検証ロジック
    return true;
  }

  changePassword(oldPassword: string, newPassword: string): boolean {
    // パスワード変更ロジック
    return true;
  }

  // IProfileManageable
  updateProfile(data: ProfileData): void {
    this.name = data.name;
    this.email = data.email;
  }

  getProfile(): ProfileData {
    return {
      name: this.name,
      email: this.email,
    };
  }

  // IOrderManageable
  createOrder(items: OrderItem[]): string {
    const orderId = `ORDER-${Date.now()}`;
    console.log(`Creating order ${orderId} for user ${this.id}`);
    return orderId;
  }

  getOrderHistory(): Order[] {
    return []; // 実装省略
  }

  cancelOrder(orderId: string): boolean {
    console.log(`Cancelling order ${orderId}`);
    return true;
  }

  // IPaymentManageable
  addPaymentMethod(method: PaymentMethod): void {
    console.log(`Adding payment method ${method.type}`);
  }

  removePaymentMethod(methodId: string): boolean {
    console.log(`Removing payment method ${methodId}`);
    return true;
  }

  getPaymentMethods(): PaymentMethod[] {
    return [];
  }

  // INotifiable
  sendNotification(message: string): void {
    console.log(`Notification to ${this.email}: ${message}`);
  }

  getNotificationPreferences(): NotificationPreferences {
    return {
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
    };
  }

  updateNotificationPreferences(prefs: NotificationPreferences): void {
    console.log("Updating notification preferences");
  }
}

export class AdminUser
  implements IUserBasic, IAuthenticatable, IAdministrative, INotifiable
{
  constructor(
    private id: string,
    private name: string,
    private email: string,
    private passwordHash: string
  ) {}

  // IUserBasic
  getId(): string {
    return this.id;
  }
  getName(): string {
    return this.name;
  }
  getEmail(): string {
    return this.email;
  }

  // IAuthenticatable
  authenticate(password: string): boolean {
    return true;
  }

  changePassword(oldPassword: string, newPassword: string): boolean {
    return true;
  }

  // IAdministrative（管理者のみ実装）
  deleteUser(userId: string): boolean {
    console.log(`Admin ${this.id} deleting user ${userId}`);
    return true;
  }

  banUser(userId: string): boolean {
    console.log(`Admin ${this.id} banning user ${userId}`);
    return true;
  }

  viewAllUsers(): User[] {
    console.log(`Admin ${this.id} viewing all users`);
    return [];
  }

  // INotifiable
  sendNotification(message: string): void {
    console.log(`Admin notification to ${this.email}: ${message}`);
  }

  getNotificationPreferences(): NotificationPreferences {
    return {
      emailNotifications: true,
      smsNotifications: true,
      pushNotifications: true,
    };
  }

  updateNotificationPreferences(prefs: NotificationPreferences): void {
    console.log("Admin updating notification preferences");
  }
}

// 読み取り専用ユーザー（最小限のインターフェース）
export class GuestUser implements IUserBasic {
  constructor(
    private id: string,
    private name: string,
    private email: string
  ) {}

  getId(): string {
    return this.id;
  }
  getName(): string {
    return this.name;
  }
  getEmail(): string {
    return this.email;
  }
}
```

**Step 2-5: DIP 適用 - 依存性逆転**

```typescript
// examples/step2-basic/services/OrderService.ts
// DIP適用: 抽象に依存する設計

// 抽象インターフェース定義
export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  save(user: User): Promise<void>;
}

export interface INotificationService {
  sendNotification(recipient: string, message: string): Promise<void>;
}

export interface IPaymentService {
  processPayment(paymentInfo: PaymentInfo, amount: number): Promise<boolean>;
}

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface PaymentInfo {
  method: string;
  details: any;
}

export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
}

// DIP適用: 高水準モジュールが抽象に依存
export class OrderService {
  constructor(
    private userRepository: IUserRepository,
    private notificationService: INotificationService,
    private paymentService: IPaymentService
  ) {}

  public async createOrder(
    userId: string,
    items: OrderItem[],
    paymentInfo: PaymentInfo
  ): Promise<string> {
    // 抽象インターフェースを通じて操作
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const orderId = this.generateOrderId();
    const totalAmount = this.calculateTotal(items);

    const paymentSuccess = await this.paymentService.processPayment(
      paymentInfo,
      totalAmount
    );

    if (!paymentSuccess) {
      throw new Error("Payment failed");
    }

    await this.notificationService.sendNotification(
      user.email,
      `Your order ${orderId} has been confirmed.`
    );

    return orderId;
  }

  private generateOrderId(): string {
    return `ORDER-${Date.now()}`;
  }

  private calculateTotal(items: OrderItem[]): number {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  }
}

// 具象実装クラス（低水準モジュール）
export class DatabaseUserRepository implements IUserRepository {
  async findById(id: string): Promise<User | null> {
    console.log(`Finding user by ID: ${id} in database`);
    // データベース操作
    return {
      id,
      email: "user@example.com",
      name: "John Doe",
    };
  }

  async save(user: User): Promise<void> {
    console.log(`Saving user ${user.id} to database`);
  }
}

export class InMemoryUserRepository implements IUserRepository {
  private users: Map<string, User> = new Map();

  async findById(id: string): Promise<User | null> {
    console.log(`Finding user by ID: ${id} in memory`);
    return this.users.get(id) || null;
  }

  async save(user: User): Promise<void> {
    console.log(`Saving user ${user.id} to memory`);
    this.users.set(user.id, user);
  }
}

export class EmailNotificationService implements INotificationService {
  async sendNotification(recipient: string, message: string): Promise<void> {
    console.log(`Sending email to ${recipient}: ${message}`);
    // メール送信ロジック
  }
}

export class SmsNotificationService implements INotificationService {
  async sendNotification(recipient: string, message: string): Promise<void> {
    console.log(`Sending SMS to ${recipient}: ${message}`);
    // SMS送信ロジック
  }
}

export class CreditCardPaymentService implements IPaymentService {
  async processPayment(
    paymentInfo: PaymentInfo,
    amount: number
  ): Promise<boolean> {
    console.log(`Processing credit card payment: ¥${amount}`);
    return true;
  }
}

export class PayPalPaymentService implements IPaymentService {
  async processPayment(
    paymentInfo: PaymentInfo,
    amount: number
  ): Promise<boolean> {
    console.log(`Processing PayPal payment: ¥${amount}`);
    return true;
  }
}

// DI Container（依存性注入）
export class DIContainer {
  private static instance: DIContainer;
  private services: Map<string, any> = new Map();

  private constructor() {}

  public static getInstance(): DIContainer {
    if (!DIContainer.instance) {
      DIContainer.instance = new DIContainer();
    }
    return DIContainer.instance;
  }

  public register<T>(key: string, implementation: T): void {
    this.services.set(key, implementation);
  }

  public get<T>(key: string): T {
    const service = this.services.get(key);
    if (!service) {
      throw new Error(`Service ${key} not registered`);
    }
    return service;
  }
}

// 使用例: 依存性注入による柔軟な構成
const container = DIContainer.getInstance();

// 開発環境用の設定
container.register<IUserRepository>(
  "userRepository",
  new InMemoryUserRepository()
);
container.register<INotificationService>(
  "notificationService",
  new EmailNotificationService()
);
container.register<IPaymentService>(
  "paymentService",
  new CreditCardPaymentService()
);

// 本番環境用の設定に簡単切り替え可能
// container.register<IUserRepository>('userRepository', new DatabaseUserRepository());
// container.register<INotificationService>('notificationService', new SmsNotificationService());
// container.register<IPaymentService>('paymentService', new PayPalPaymentService());

const orderService = new OrderService(
  container.get<IUserRepository>("userRepository"),
  container.get<INotificationService>("notificationService"),
  container.get<IPaymentService>("paymentService")
);
```

---

## 🧪 包括的テストスイート

### 単体テスト

```typescript
// tests/unit/Product.test.ts
import {
  Product,
  InventoryManager,
  PriceCalculator,
  ProductValidator,
} from "../../src/domain/entities/Product";

describe("Product", () => {
  let product: Product;
  let inventoryManager: InventoryManager;
  let priceCalculator: PriceCalculator;
  let validator: ProductValidator;

  beforeEach(() => {
    product = new Product(
      "P001",
      "Test Product",
      1000,
      50,
      "Electronics",
      "Test description"
    );
    inventoryManager = new InventoryManager();
    priceCalculator = new PriceCalculator();
    validator = new ProductValidator();
  });

  describe("SRP Tests", () => {
    test("Product should only manage product data", () => {
      expect(product.getId()).toBe("P001");
      expect(product.getName()).toBe("Test Product");
      expect(product.getPrice()).toBe(1000);
      expect(product.getStock()).toBe(50);
    });

    test("InventoryManager should handle stock operations", () => {
      const result = inventoryManager.updateStock(product, -10);
      expect(result).toBe(true);

      const lowStockResult = inventoryManager.isLowStock(product, 60);
      expect(lowStockResult).toBe(true);
    });

    test("PriceCalculator should handle price calculations", () => {
      const discountPrice = priceCalculator.calculateDiscountPrice(product, 10);
      expect(discountPrice).toBe(900);

      const tax = priceCalculator.calculateTax(product, 8);
      expect(tax).toBe(80);
    });

    test("ProductValidator should handle validation", () => {
      expect(validator.validate(product)).toBe(true);
    });
  });
});

// tests/unit/PaymentStrategy.test.ts
import {
  PaymentProcessor,
  CreditCardPayment,
  PayPalPayment,
} from "../../src/application/payments/PaymentStrategy";

describe("Payment Strategy (OCP)", () => {
  test("should process different payment methods without modifying PaymentProcessor", () => {
    const creditCardPayment = new CreditCardPayment(
      "1234-5678-9012-3456",
      "12/25",
      "123"
    );
    const paypalPayment = new PayPalPayment("user@example.com", "password");

    const processor = new PaymentProcessor(creditCardPayment);
    expect(processor.processPayment(1000)).toBe(true);

    // OCP: 新しい決済方法に変更してもPaymentProcessorは変更不要
    processor.setStrategy(paypalPayment);
    expect(processor.processPayment(1000)).toBe(true);
  });
});

// tests/unit/Vehicle.test.ts
import {
  Car,
  Bicycle,
  Boat,
  VehicleManager,
} from "../../src/domain/vehicles/Vehicle";

describe("Vehicle Inheritance (LSP)", () => {
  test("all vehicles should be substitutable", () => {
    const vehicles = [
      new Car("C001", "Toyota"),
      new Bicycle("B001", "Giant"),
      new Boat("S001", "SeaRay"),
    ];

    const manager = new VehicleManager();

    // LSP: すべての派生クラスが基底クラスと同じインターフェースで操作可能
    vehicles.forEach((vehicle) => {
      expect(() => manager.operateVehicle(vehicle)).not.toThrow();
    });
  });
});
```

### 統合テスト

```typescript
// tests/integration/OrderService.test.ts
import { OrderService } from "../../src/application/services/OrderService";
import {
  InMemoryUserRepository,
  EmailNotificationService,
  CreditCardPaymentService,
} from "../../src/infrastructure/services";

describe("OrderService Integration (DIP)", () => {
  let orderService: OrderService;
  let userRepository: InMemoryUserRepository;

  beforeEach(async () => {
    userRepository = new InMemoryUserRepository();
    const notificationService = new EmailNotificationService();
    const paymentService = new CreditCardPaymentService();

    // DIP: 依存性注入により具象実装を注入
    orderService = new OrderService(
      userRepository,
      notificationService,
      paymentService
    );

    // テスト用ユーザー作成
    await userRepository.save({
      id: "U001",
      email: "test@example.com",
      name: "Test User",
    });
  });

  test("should create order successfully", async () => {
    const items = [{ productId: "P001", quantity: 2, price: 1000 }];

    const paymentInfo = {
      method: "credit",
      details: { cardNumber: "1234-5678-9012-3456" },
    };

    const orderId = await orderService.createOrder("U001", items, paymentInfo);

    expect(orderId).toMatch(/^ORDER-\d+$/);
  });

  test("should throw error for non-existent user", async () => {
    const items = [{ productId: "P001", quantity: 1, price: 1000 }];
    const paymentInfo = { method: "credit", details: {} };

    await expect(
      orderService.createOrder("INVALID_USER", items, paymentInfo)
    ).rejects.toThrow("User not found");
  });
});
```

### E2E テスト

```typescript
// tests/e2e/EcommerceSystem.test.ts
import { EcommerceSystem } from "../../src/main";
import { DIContainer } from "../../src/infrastructure/di/DIContainer";

describe("Ecommerce System E2E", () => {
  let system: EcommerceSystem;

  beforeEach(() => {
    // システム全体の初期化
    const container = DIContainer.getInstance();
    system = new EcommerceSystem(container);
  });

  test("complete purchase flow", async () => {
    // 1. ユーザー登録
    const userId = await system.registerUser({
      name: "John Doe",
      email: "john@example.com",
      password: "password123",
    });

    // 2. 商品検索
    const products = await system.searchProducts("electronics");
    expect(products.length).toBeGreaterThan(0);

    // 3. カートに商品追加
    await system.addToCart(userId, products[0].id, 2);

    // 4. 注文作成
    const orderId = await system.createOrder(userId, {
      paymentMethod: "credit",
      cardDetails: {
        number: "1234-5678-9012-3456",
        expiry: "12/25",
        cvv: "123",
      },
    });

    expect(orderId).toBeDefined();

    // 5. 注文状況確認
    const orderStatus = await system.getOrderStatus(orderId);
    expect(orderStatus).toBe("confirmed");
  });
});
```

---

## 📊 メトリクス・品質測定

### コード品質メトリクス

```typescript
// tools/metrics-collector.ts
export interface QualityMetrics {
  cyclomaticComplexity: number;
  linesOfCode: number;
  classCouplingCount: number;
  methodsPerClass: number;
  testCoverage: number;
}

export class SOLIDMetricsCollector {
  // SRP違反検出: 1クラスあたりのメソッド数
  public calculateMethodsPerClass(filePath: string): number {
    // 実装省略
    return 0;
  }

  // OCP遵守度: Switch文の数
  public countSwitchStatements(filePath: string): number {
    // 実装省略
    return 0;
  }

  // LSP違反検出: throw文を含むoverride
  public detectLSPViolations(filePath: string): string[] {
    // 実装省略
    return [];
  }

  // ISP違反検出: インターフェースあたりのメソッド数
  public calculateInterfaceSize(filePath: string): number {
    // 実装省略
    return 0;
  }

  // DIP遵守度: 抽象への依存率
  public calculateAbstractionRatio(filePath: string): number {
    // 実装省略
    return 0;
  }
}
```

### パフォーマンス測定

```typescript
// tools/performance-monitor.ts
export class PerformanceMonitor {
  private static measurements: Map<string, number[]> = new Map();

  public static measure<T>(operation: string, fn: () => T): T {
    const start = performance.now();
    const result = fn();
    const end = performance.now();

    const duration = end - start;

    if (!this.measurements.has(operation)) {
      this.measurements.set(operation, []);
    }
    this.measurements.get(operation)!.push(duration);

    return result;
  }

  public static getReport(): Record<string, any> {
    const report: Record<string, any> = {};

    for (const [operation, times] of this.measurements.entries()) {
      const avg = times.reduce((a, b) => a + b, 0) / times.length;
      const min = Math.min(...times);
      const max = Math.max(...times);

      report[operation] = {
        average: avg,
        minimum: min,
        maximum: max,
        samples: times.length,
      };
    }

    return report;
  }
}
```

---

## 🎯 学習課題・演習問題

### 課題 1: SOLID 原則違反の特定

```typescript
// exercises/violation-detection.ts
/* 
以下のコードにはSOLID原則の違反が含まれています。
各違反を特定し、どの原則に違反しているかを説明してください。
*/

export class UserManager {
  private users: any[] = [];

  public addUser(userData: any): void {
    // バリデーション
    if (!userData.email || !userData.password) {
      throw new Error("Invalid user data");
    }

    // パスワードハッシュ化
    const hashedPassword = this.hashPassword(userData.password);

    // データベースに保存
    this.saveToDatabase({
      ...userData,
      password: hashedPassword,
      createdAt: new Date(),
    });

    // ウェルカムメール送信
    this.sendWelcomeEmail(userData.email);

    // ログ記録
    console.log(`User ${userData.email} added successfully`);
  }

  public authenticateUser(email: string, password: string): boolean {
    const user = this.findUserByEmail(email);
    if (!user) {
      return false;
    }

    return this.verifyPassword(password, user.password);
  }

  public generateUserReport(): string {
    let report = "User Report\n";
    report += "===========\n";

    this.users.forEach((user) => {
      report += `${user.name} - ${user.email} - ${user.createdAt}\n`;
    });

    return report;
  }

  private hashPassword(password: string): string {
    // 簡単なハッシュ処理
    return password.split("").reverse().join("");
  }

  private saveToDatabase(user: any): void {
    this.users.push(user);
  }

  private sendWelcomeEmail(email: string): void {
    console.log(`Sending welcome email to ${email}`);
  }

  private findUserByEmail(email: string): any {
    return this.users.find((user) => user.email === email);
  }

  private verifyPassword(password: string, hashedPassword: string): boolean {
    return this.hashPassword(password) === hashedPassword;
  }
}

/*
問題:
1. どのSOLID原則に違反していますか？
2. それぞれの違反について説明してください
3. 改善したコードを書いてください
*/
```

### 課題 2: 設計パターン適用

```typescript
// exercises/design-patterns.ts
/*
以下の要件を満たすシステムを設計してください：

要件:
1. 複数の配送業者（ヤマト、佐川、日本郵便）に対応
2. 各業者で配送料計算方法が異なる
3. 新しい配送業者を簡単に追加できる
4. 配送状況の追跡方法も業者によって異なる

SOLID原則を適用してください：
- SRP: 各クラスは単一の責任
- OCP: 新規配送業者追加時に既存コード変更不要
- LSP: すべての配送業者は同じインターフェースで扱える
- ISP: 必要な機能のみのインターフェース
- DIP: 具象クラスではなく抽象に依存

ヒント: Strategy Pattern, Factory Pattern の使用を検討してください
*/

// あなたの実装をここに書いてください
export interface DeliveryProvider {
  // TODO: インターフェース定義
}

export class DeliveryService {
  // TODO: 実装
}
```

### 課題 3: リファクタリング実践

```typescript
// exercises/refactoring-challenge.ts
/*
以下のレガシーコードを段階的にリファクタリングしてください：

段階1: SRP適用 - クラスの責任を分離
段階2: OCP適用 - 拡張性の向上
段階3: LSP適用 - 適切な継承設計
段階4: ISP適用 - インターフェース分離
段階5: DIP適用 - 依存性逆転

各段階でどのような改善を行ったかをコメントで説明してください。
*/

export class LegacyInventorySystem {
  private products: any[] = [];

  public processOrder(orderId: string, items: any[]): void {
    console.log(`Processing order: ${orderId}`);

    // 在庫チェック
    for (const item of items) {
      const product = this.products.find((p) => p.id === item.productId);
      if (!product || product.stock < item.quantity) {
        throw new Error(`Insufficient stock for product: ${item.productId}`);
      }
    }

    // 在庫更新
    for (const item of items) {
      const product = this.products.find((p) => p.id === item.productId);
      product.stock -= item.quantity;
    }

    // 価格計算
    let totalAmount = 0;
    for (const item of items) {
      const product = this.products.find((p) => p.id === item.productId);
      totalAmount += product.price * item.quantity;
    }

    // 割引適用
    if (totalAmount > 10000) {
      totalAmount *= 0.9; // 10%割引
    }

    // 決済処理
    this.processPayment(totalAmount);

    // 配送手配
    this.arrangeDelivery(orderId, items);

    // 通知送信
    this.sendNotifications(orderId, totalAmount);

    // ログ出力
    console.log(
      `Order ${orderId} processed successfully. Total: ¥${totalAmount}`
    );
  }

  private processPayment(amount: number): void {
    console.log(`Processing payment: ¥${amount}`);
    // クレジットカード決済のみ対応
  }

  private arrangeDelivery(orderId: string, items: any[]): void {
    console.log(`Arranging delivery for order: ${orderId}`);
    // ヤマト運輸のみ対応
  }

  private sendNotifications(orderId: string, amount: number): void {
    console.log(`Sending notifications for order: ${orderId}`);
    // メール通知のみ対応
  }
}

/*
リファクタリング課題:
1. 各段階でのリファクタリング内容を説明
2. 改善されたコードの利点を説明
3. テストコードも作成してください
*/
```

---

## 📚 学習リソース・参考文献

### 必読書籍

1. **Clean Architecture** - Robert C. Martin
2. **Design Patterns** - GoF
3. **Effective TypeScript** - Dan Vanderkam
4. **Clean Code** - Robert C. Martin

### オンラインリソース

1. [TypeScript 公式ドキュメント](https://www.typescriptlang.org/)
2. [SOLID Principles in TypeScript](https://blog.bitsrc.io/solid-principles-every-developer-should-know-b3bfa96bb688)
3. [Design Patterns in TypeScript](https://github.com/torokmark/design_patterns_in_typescript)

### 実践演習サイト

1. [Exercism TypeScript Track](https://exercism.io/tracks/typescript)
2. [TypeScript Challenges](https://github.com/type-challenges/type-challenges)

---

## 🏁 プロジェクト完了基準

### 最終評価チェックリスト

```markdown
## SOLID 原則実装チェックリスト

### SRP (Single Responsibility Principle)

- [ ] 各クラスが単一の責任のみ持つ
- [ ] クラス変更の理由が 1 つのみ
- [ ] メソッド数が適切（目安: 10 メソッド以下）

### OCP (Open/Closed Principle)

- [ ] 新機能追加時に既存コード変更不要
- [ ] 戦略パターンまたは継承による拡張
- [ ] Switch 文の使用を避けている

### LSP (Liskov Substitution Principle)

- [ ] 派生クラスが基底クラスと置換可能
- [ ] override 時に例外を追加で投げない
- [ ] 基底クラスの契約を守っている

### ISP (Interface Segregation Principle)

- [ ] インターフェースが最小限の責任
- [ ] クライアントが不要なメソッドに依存しない
- [ ] 複数の小さなインターフェースに分割

### DIP (Dependency Inversion Principle)

- [ ] 高水準モジュールが抽象に依存
- [ ] 依存性注入を使用
- [ ] 具象クラスの直接インスタンス化を避けている

### テスト

- [ ] 単体テストカバレッジ 90%以上
- [ ] 統合テストの実装
- [ ] E2E テストの実装

### コード品質

- [ ] ESLint ルール違反ゼロ
- [ ] TypeScript 型エラーゼロ
- [ ] ドキュメント完備
```

### 提出物

1. **ソースコード**: 全実装ファイル
2. **テストコード**: 包括的なテストスイート
3. **ドキュメント**: 設計説明・アーキテクチャ図
4. **学習レポート**: SOLID 原則の理解と適用経験

---

**🚀 プロジェクト完了おめでとうございます！**  
この e コマースシステム実装を通じて、SOLID 原則の実践的な適用方法を完全に習得できました。これらの原則は、保守性・拡張性・テスタビリティに優れたソフトウェア設計の基盤となります。
