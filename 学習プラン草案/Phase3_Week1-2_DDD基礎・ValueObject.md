# Phase 3: Week 1-2 DDD 基礎・Value Object - Domain Driven Design 完全理解

## 📅 学習期間・目標

**期間**: Week 1-2（2 週間）  
**総学習時間**: 40 時間（週 10 時間）

### 🎯 Week 1-2 到達目標

- [ ] Domain Driven Design の基本概念と実践手法の完全理解
- [ ] Value Object の型安全な実装パターンの習得
- [ ] Entity・Aggregate Root の設計と実装
- [ ] 関数型エラーハンドリング（Result 型・Option 型）の活用
- [ ] TypeScript でのドメインモデリング能力の確立

## 📖 理論学習内容

### Day 1-3: Domain Driven Design 基本概念

#### 🔍 DDD の核心思想

**ドメイン駆動設計の 3 つの柱**

1. **ユビキタス言語（Ubiquitous Language）**

   - ドメインエキスパートと開発者が共有する言語
   - コードとドキュメントで一貫した用語使用
   - ビジネスロジックの正確な表現

2. **戦略的設計（Strategic Design）**

   - 境界付けられたコンテキスト（Bounded Context）
   - コンテキストマップ
   - ドメインとサブドメインの分離

3. **戦術的設計（Tactical Design）**
   - ドメインオブジェクトのパターン
   - Value Object, Entity, Aggregate
   - Repository, Service パターン

```typescript
// ユビキタス言語の例：Eコマースドメイン
interface Product {
  // 商品ID（ビジネス識別子）
  readonly productId: ProductId;

  // 商品名（ビジネス名称）
  readonly name: ProductName;

  // 価格（金額概念）
  readonly price: Money;

  // 在庫数（在庫管理概念）
  readonly stockQuantity: StockQuantity;

  // 商品カテゴリ（分類概念）
  readonly category: ProductCategory;
}

// ドメインメソッドはビジネスルールを表現
interface Order {
  // 注文に商品を追加する（ビジネスプロセス）
  addProduct(
    product: Product,
    quantity: OrderQuantity
  ): Result<void, OrderError>;

  // 注文を確定する（ビジネス状態変更）
  confirm(): Result<void, OrderError>;

  // 合計金額を計算する（ビジネス計算）
  calculateTotal(): Money;
}
```

#### 🏗️ 境界付けられたコンテキスト

```typescript
// Sales Context（販売コンテキスト）
namespace SalesContext {
  interface Product {
    id: ProductId;
    name: string;
    price: Money;
    isAvailable: boolean;
  }

  interface Customer {
    id: CustomerId;
    email: Email;
    creditLimit: Money;
  }
}

// Inventory Context（在庫コンテキスト）
namespace InventoryContext {
  interface Product {
    id: ProductId;
    sku: SKU;
    stockLevel: number;
    reorderPoint: number;
    supplier: Supplier;
  }

  interface StockMovement {
    productId: ProductId;
    quantity: number;
    movementType: "IN" | "OUT" | "ADJUSTMENT";
    timestamp: Date;
  }
}

// Shipping Context（配送コンテキスト）
namespace ShippingContext {
  interface Package {
    id: PackageId;
    weight: Weight;
    dimensions: Dimensions;
    destination: Address;
    trackingNumber: TrackingNumber;
  }
}
```

### Day 4-7: Value Object 完全実装

#### 📦 Value Object の特徴と設計原則

**Value Object の 4 つの特徴**

1. **Immutability（不変性）**: 一度作成されたら変更不可
2. **Equality by Value（値による等価性）**: 構造的等価性
3. **Self-Validation（自己検証）**: 作成時に妥当性を検証
4. **Side-Effect Free（副作用なし）**: 関数型メソッド

```typescript
// Value Object 基底クラス
abstract class ValueObject<T> {
  protected readonly _value: T;

  constructor(value: T) {
    this.validate(value);
    this._value = Object.freeze(this.normalize(value));
  }

  protected abstract validate(value: T): void;

  protected normalize(value: T): T {
    return value;
  }

  public equals(other: ValueObject<T>): boolean {
    if (!(other instanceof this.constructor)) return false;
    return JSON.stringify(this._value) === JSON.stringify(other._value);
  }

  public getValue(): T {
    return this._value;
  }

  public toString(): string {
    return String(this._value);
  }

  // 関数型メソッド（新しいインスタンスを返す）
  protected createNew<U extends ValueObject<T>>(
    value: T,
    constructor: new (value: T) => U
  ): U {
    return new constructor(value);
  }
}
```

#### 💰 実用的な Value Object 実装例

**1. Money Value Object（金額）**

```typescript
interface MoneyProps {
  amount: number;
  currency: Currency;
}

type Currency = "USD" | "EUR" | "JPY" | "GBP";

class Money extends ValueObject<MoneyProps> {
  private constructor(value: MoneyProps) {
    super(value);
  }

  static create(amount: number, currency: Currency): Result<Money, MoneyError> {
    try {
      return Result.ok(new Money({ amount, currency }));
    } catch (error) {
      return Result.err(error as MoneyError);
    }
  }

  static zero(currency: Currency): Money {
    return new Money({ amount: 0, currency });
  }

  protected validate(value: MoneyProps): void {
    if (!Number.isFinite(value.amount)) {
      throw new MoneyError("Amount must be a finite number");
    }
    if (value.amount < 0) {
      throw new MoneyError("Amount cannot be negative");
    }
    if (!["USD", "EUR", "JPY", "GBP"].includes(value.currency)) {
      throw new MoneyError("Unsupported currency");
    }
  }

  protected normalize(value: MoneyProps): MoneyProps {
    return {
      amount: Math.round(value.amount * 100) / 100, // 小数点2桁に正規化
      currency: value.currency,
    };
  }

  // ドメインメソッド（不変性を保持）
  add(other: Money): Result<Money, MoneyError> {
    if (this._value.currency !== other._value.currency) {
      return Result.err(new MoneyError("Cannot add different currencies"));
    }

    return Money.create(
      this._value.amount + other._value.amount,
      this._value.currency
    );
  }

  subtract(other: Money): Result<Money, MoneyError> {
    if (this._value.currency !== other._value.currency) {
      return Result.err(new MoneyError("Cannot subtract different currencies"));
    }

    const newAmount = this._value.amount - other._value.amount;
    if (newAmount < 0) {
      return Result.err(new MoneyError("Result would be negative"));
    }

    return Money.create(newAmount, this._value.currency);
  }

  multiply(factor: number): Result<Money, MoneyError> {
    if (!Number.isFinite(factor) || factor < 0) {
      return Result.err(
        new MoneyError("Factor must be a positive finite number")
      );
    }

    return Money.create(this._value.amount * factor, this._value.currency);
  }

  divide(divisor: number): Result<Money, MoneyError> {
    if (!Number.isFinite(divisor) || divisor <= 0) {
      return Result.err(
        new MoneyError("Divisor must be a positive finite number")
      );
    }

    return Money.create(this._value.amount / divisor, this._value.currency);
  }

  isGreaterThan(other: Money): boolean {
    this.assertSameCurrency(other);
    return this._value.amount > other._value.amount;
  }

  isLessThan(other: Money): boolean {
    this.assertSameCurrency(other);
    return this._value.amount < other._value.amount;
  }

  isZero(): boolean {
    return this._value.amount === 0;
  }

  format(): string {
    const formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: this._value.currency,
    });
    return formatter.format(this._value.amount);
  }

  private assertSameCurrency(other: Money): void {
    if (this._value.currency !== other._value.currency) {
      throw new MoneyError("Cannot compare different currencies");
    }
  }

  get amount(): number {
    return this._value.amount;
  }

  get currency(): Currency {
    return this._value.currency;
  }
}

class MoneyError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "MoneyError";
  }
}
```

**2. Email Value Object（メールアドレス）**

```typescript
class Email extends ValueObject<string> {
  private static readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  private static readonly BUSINESS_DOMAINS = new Set([
    "gmail.com",
    "yahoo.com",
    "hotmail.com",
    "outlook.com",
  ]);

  private constructor(value: string) {
    super(value);
  }

  static create(value: string): Result<Email, EmailError> {
    try {
      return Result.ok(new Email(value));
    } catch (error) {
      return Result.err(error as EmailError);
    }
  }

  protected validate(value: string): void {
    if (!value) {
      throw new EmailError("Email cannot be empty");
    }
    if (!Email.EMAIL_REGEX.test(value)) {
      throw new EmailError("Invalid email format");
    }
    if (value.length > 254) {
      throw new EmailError("Email too long");
    }
  }

  protected normalize(value: string): string {
    return value.toLowerCase().trim();
  }

  getDomain(): string {
    return this._value.split("@")[1];
  }

  getLocalPart(): string {
    return this._value.split("@")[0];
  }

  isBusinessEmail(): boolean {
    return !Email.BUSINESS_DOMAINS.has(this.getDomain());
  }

  isSameDomain(other: Email): boolean {
    return this.getDomain() === other.getDomain();
  }

  maskForDisplay(): string {
    const [local, domain] = this._value.split("@");
    const maskedLocal =
      local.length > 2
        ? local[0] + "*".repeat(local.length - 2) + local[local.length - 1]
        : local;
    return `${maskedLocal}@${domain}`;
  }
}

class EmailError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "EmailError";
  }
}
```

**3. DateRange Value Object（期間）**

```typescript
interface DateRangeProps {
  start: Date;
  end: Date;
}

class DateRange extends ValueObject<DateRangeProps> {
  private constructor(value: DateRangeProps) {
    super(value);
  }

  static create(start: Date, end: Date): Result<DateRange, DateRangeError> {
    try {
      return Result.ok(new DateRange({ start, end }));
    } catch (error) {
      return Result.err(error as DateRangeError);
    }
  }

  static fromDays(
    start: Date,
    days: number
  ): Result<DateRange, DateRangeError> {
    if (days < 0) {
      return Result.err(new DateRangeError("Days must be non-negative"));
    }

    const end = new Date(start);
    end.setDate(start.getDate() + days);

    return DateRange.create(start, end);
  }

  protected validate(value: DateRangeProps): void {
    if (!(value.start instanceof Date) || !(value.end instanceof Date)) {
      throw new DateRangeError("Both start and end must be valid dates");
    }
    if (isNaN(value.start.getTime()) || isNaN(value.end.getTime())) {
      throw new DateRangeError("Both start and end must be valid dates");
    }
    if (value.start >= value.end) {
      throw new DateRangeError("Start date must be before end date");
    }
  }

  contains(date: Date): boolean {
    return date >= this._value.start && date <= this._value.end;
  }

  overlaps(other: DateRange): boolean {
    return (
      this._value.start < other._value.end &&
      this._value.end > other._value.start
    );
  }

  isAdjacent(other: DateRange): boolean {
    return (
      this._value.end.getTime() === other._value.start.getTime() ||
      other._value.end.getTime() === this._value.start.getTime()
    );
  }

  merge(other: DateRange): Result<DateRange, DateRangeError> {
    if (!this.overlaps(other) && !this.isAdjacent(other)) {
      return Result.err(
        new DateRangeError("Cannot merge non-overlapping, non-adjacent ranges")
      );
    }

    const start = new Date(
      Math.min(this._value.start.getTime(), other._value.start.getTime())
    );
    const end = new Date(
      Math.max(this._value.end.getTime(), other._value.end.getTime())
    );

    return DateRange.create(start, end);
  }

  getDurationInDays(): number {
    const diffTime = this._value.end.getTime() - this._value.start.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  getDurationInHours(): number {
    const diffTime = this._value.end.getTime() - this._value.start.getTime();
    return diffTime / (1000 * 60 * 60);
  }

  split(date: Date): Result<[DateRange, DateRange], DateRangeError> {
    if (!this.contains(date)) {
      return Result.err(
        new DateRangeError("Split date must be within the range")
      );
    }
    if (
      date.getTime() === this._value.start.getTime() ||
      date.getTime() === this._value.end.getTime()
    ) {
      return Result.err(new DateRangeError("Cannot split at range boundaries"));
    }

    const firstRange = DateRange.create(this._value.start, date);
    const secondRange = DateRange.create(date, this._value.end);

    if (firstRange.isErr() || secondRange.isErr()) {
      return Result.err(new DateRangeError("Failed to create split ranges"));
    }

    return Result.ok([firstRange.value, secondRange.value]);
  }

  get start(): Date {
    return new Date(this._value.start);
  }

  get end(): Date {
    return new Date(this._value.end);
  }
}

class DateRangeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DateRangeError";
  }
}
```

### Day 8-14: Entity・Aggregate 設計

#### 🏷️ Entity の設計原則

**Entity の特徴**

1. **Identity（同一性）**: 一意の ID による識別
2. **Lifecycle（ライフサイクル）**: 作成・変更・削除の履歴
3. **Mutable State（可変状態）**: ビジネスルールに従った状態変更
4. **Business Behavior（ビジネス振る舞い）**: ドメインロジックをカプセル化

```typescript
// ID型の基底クラス
abstract class EntityId<T extends string> {
  constructor(protected readonly value: T) {
    if (!value) {
      throw new Error("ID cannot be empty");
    }
  }

  equals(other: EntityId<T>): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}

// 具体的なID型
class ProductId extends EntityId<string> {
  private constructor(value: string) {
    super(value);
  }

  static create(value?: string): ProductId {
    return new ProductId(value || this.generate());
  }

  private static generate(): string {
    return `product_${crypto.randomUUID()}`;
  }
}

// Entity 基底クラス
abstract class Entity<TId extends EntityId<string>> {
  constructor(
    protected readonly _id: TId,
    protected readonly _createdAt: Date = new Date()
  ) {}

  get id(): TId {
    return this._id;
  }

  get createdAt(): Date {
    return new Date(this._createdAt);
  }

  equals(other: Entity<TId>): boolean {
    return this._id.equals(other._id);
  }
}
```

#### 🛍️ Product Entity 実装

```typescript
interface ProductProps {
  name: string;
  description: string;
  price: Money;
  category: ProductCategory;
  stockQuantity: number;
  isActive: boolean;
}

enum ProductCategory {
  Electronics = "electronics",
  Clothing = "clothing",
  Books = "books",
  Sports = "sports",
  Home = "home",
}

class Product extends Entity<ProductId> {
  private _props: ProductProps;
  private _updatedAt: Date;

  private constructor(id: ProductId, props: ProductProps, createdAt?: Date) {
    super(id, createdAt);
    this._props = { ...props };
    this._updatedAt = new Date();
  }

  static create(
    props: Omit<ProductProps, "isActive">
  ): Result<Product, ProductError> {
    const productProps = { ...props, isActive: true };

    const validationResult = this.validate(productProps);
    if (validationResult.isErr()) {
      return validationResult;
    }

    return Result.ok(new Product(ProductId.create(), productProps));
  }

  static fromPersistence(
    id: string,
    props: ProductProps,
    createdAt: Date
  ): Result<Product, ProductError> {
    const validationResult = this.validate(props);
    if (validationResult.isErr()) {
      return validationResult;
    }

    return Result.ok(new Product(ProductId.create(id), props, createdAt));
  }

  private static validate(props: ProductProps): Result<void, ProductError> {
    if (!props.name.trim()) {
      return Result.err(new ProductError("Product name cannot be empty"));
    }
    if (props.name.length > 100) {
      return Result.err(new ProductError("Product name too long"));
    }
    if (props.stockQuantity < 0) {
      return Result.err(new ProductError("Stock quantity cannot be negative"));
    }
    if (props.price.isZero()) {
      return Result.err(new ProductError("Product price must be positive"));
    }
    return Result.ok(undefined);
  }

  // ビジネスメソッド
  updatePrice(newPrice: Money): Result<void, ProductError> {
    if (newPrice.isZero()) {
      return Result.err(new ProductError("Price must be positive"));
    }

    this._props.price = newPrice;
    this._updatedAt = new Date();
    return Result.ok(undefined);
  }

  adjustStock(quantity: number): Result<void, ProductError> {
    const newStock = this._props.stockQuantity + quantity;
    if (newStock < 0) {
      return Result.err(new ProductError("Insufficient stock"));
    }

    this._props.stockQuantity = newStock;
    this._updatedAt = new Date();
    return Result.ok(undefined);
  }

  deactivate(): void {
    this._props.isActive = false;
    this._updatedAt = new Date();
  }

  activate(): void {
    this._props.isActive = true;
    this._updatedAt = new Date();
  }

  updateDescription(description: string): Result<void, ProductError> {
    if (description.length > 1000) {
      return Result.err(new ProductError("Description too long"));
    }

    this._props.description = description;
    this._updatedAt = new Date();
    return Result.ok(undefined);
  }

  // ビジネスルール検証
  canBePurchased(quantity: number): boolean {
    return (
      this._props.isActive &&
      this._props.stockQuantity >= quantity &&
      quantity > 0
    );
  }

  isLowStock(threshold: number = 10): boolean {
    return this._props.stockQuantity <= threshold;
  }

  // Getters
  get name(): string {
    return this._props.name;
  }

  get description(): string {
    return this._props.description;
  }

  get price(): Money {
    return this._props.price;
  }

  get category(): ProductCategory {
    return this._props.category;
  }

  get stockQuantity(): number {
    return this._props.stockQuantity;
  }

  get isActive(): boolean {
    return this._props.isActive;
  }

  get updatedAt(): Date {
    return new Date(this._updatedAt);
  }
}

class ProductError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ProductError";
  }
}
```

## 🎯 実践演習

### 演習 1-1: Value Object 完全実装チャレンジ 🔰

**目標**: 実用的な Value Object を型安全に実装する

```typescript
// 以下の Value Object を完全実装せよ
// 要件: 不変性、自己検証、値による等価性、型安全性

// 1. PhoneNumber Value Object
// - 国際形式の電話番号（+81-90-1234-5678）
// - 国コードの検証
// - フォーマット正規化
// - マスク表示機能

class PhoneNumber extends ValueObject<string> {
  // 実装
}

// 2. Address Value Object（複合型）
// - 郵便番号、都道府県、市区町村、番地
// - 日本の住所形式に対応
// - 省略表示機能
// - 近隣住所判定

interface AddressProps {
  postalCode: string;
  prefecture: string;
  city: string;
  streetAddress: string;
  building?: string;
}

class Address extends ValueObject<AddressProps> {
  // 実装
}

// 3. SKU（Stock Keeping Unit）Value Object
// - 商品識別コード（ABC-123-XYZ形式）
// - チェックサム検証
// - カテゴリ情報抽出
// - バリエーション識別

class SKU extends ValueObject<string> {
  // 実装
}

// 使用例でテストすること
const phone = PhoneNumber.create("+81-90-1234-5678");
const address = Address.create({
  postalCode: "100-0001",
  prefecture: "東京都",
  city: "千代田区",
  streetAddress: "千代田1-1-1",
});
const sku = SKU.create("ELE-001-BLK");
```

### 演習 1-2: Entity・Aggregate 設計実践 🔶

**目標**: DDD パターンを活用した複雑なドメインモデルの実装

```typescript
// Eコマース注文システムのドメインモデルを実装せよ

// Order Aggregate Root
interface OrderProps {
  customerId: CustomerId;
  items: OrderItem[];
  status: OrderStatus;
  shippingAddress: Address;
  billingAddress: Address;
  paymentMethod: PaymentMethod;
  orderDate: Date;
}

class Order extends Entity<OrderId> {
  // 要件:
  // 1. 商品追加・削除・数量変更
  // 2. 注文確定・キャンセル・発送
  // 3. 合計金額計算（税込み・送料込み）
  // 4. 割引適用
  // 5. ビジネスルール検証
  // 実装
}

// OrderItem Value Object
interface OrderItemProps {
  productId: ProductId;
  productName: string;
  unitPrice: Money;
  quantity: number;
  discount?: Money;
}

class OrderItem extends ValueObject<OrderItemProps> {
  // 要件:
  // 1. 小計計算
  // 2. 割引適用
  // 3. 数量変更
  // 実装
}

// Customer Entity
interface CustomerProps {
  name: string;
  email: Email;
  phoneNumber: PhoneNumber;
  addresses: Address[];
  tier: CustomerTier;
  totalOrderAmount: Money;
}

enum CustomerTier {
  Bronze = "bronze",
  Silver = "silver",
  Gold = "gold",
  Platinum = "platinum",
}

class Customer extends Entity<CustomerId> {
  // 要件:
  // 1. 顧客ティア自動判定
  // 2. 住所管理
  // 3. 注文履歴反映
  // 4. 割引率計算
  // 実装
}

// 使用例
const customer = Customer.create({
  name: "John Doe",
  email: Email.create("john@example.com").value,
  phoneNumber: PhoneNumber.create("+81-90-1234-5678").value,
  addresses: [],
  tier: CustomerTier.Bronze,
  totalOrderAmount: Money.zero("USD"),
});

const order = Order.create({
  customerId: customer.id,
  shippingAddress: address,
  billingAddress: address,
  paymentMethod: PaymentMethod.CreditCard,
});

// ビジネスシナリオのテスト
order.addItem(product1, 2);
order.addItem(product2, 1);
order.applyDiscount(Money.create(10, "USD").value);
const confirmResult = order.confirm();
```

## 📊 Week 1-2 評価基準

### 理解度チェックリスト

#### DDD 基本概念 (30%)

- [ ] ユビキタス言語の重要性を理解している
- [ ] 境界付けられたコンテキストを設計できる
- [ ] 戦略的設計と戦術的設計を区別できる
- [ ] ドメイン・サブドメインを識別できる

#### Value Object 実装 (35%)

- [ ] 不変性を保持した実装ができる
- [ ] 適切な検証ロジックを実装できる
- [ ] 値による等価性を実装できる
- [ ] ドメインメソッドを設計できる
- [ ] 関数型エラーハンドリングを活用できる

#### Entity・Aggregate 設計 (25%)

- [ ] 適切な ID 設計ができる
- [ ] ライフサイクル管理を実装できる
- [ ] ビジネスルールをカプセル化できる
- [ ] Aggregate 境界を適切に設定できる

#### 型安全性・設計品質 (10%)

- [ ] TypeScript の型システムを効果的に活用
- [ ] エラーハンドリングが適切
- [ ] コードが読みやすく保守しやすい
- [ ] ビジネス要件が正確に表現されている

### 成果物チェックリスト

- [ ] **Value Object ライブラリ（5 種類以上）**: Money, Email, DateRange, PhoneNumber, Address
- [ ] **Entity 実装例（3 種類以上）**: Product, Customer, Order
- [ ] **Result 型・Option 型**: 関数型エラーハンドリング実装
- [ ] **ドメインモデル設計書**: ユビキタス言語とコンテキストマップ
- [ ] **実践演習コード**: 完全動作する E コマースドメインモデル

## 🔄 Week 3-4 への準備

### 次週学習内容の予習

```typescript
// Week 3-4で学習するRepository・Use Caseパターンの基礎概念
// 以下のインターフェースを読んで理解しておくこと

// Repository パターン
interface ProductRepository {
  findById(id: ProductId): Promise<Option<Product>>;
  findByCategory(category: ProductCategory): Promise<Product[]>;
  save(product: Product): Promise<Result<void, RepositoryError>>;
  delete(id: ProductId): Promise<Result<void, RepositoryError>>;
}

// Use Case パターン
interface CreateProductUseCase {
  execute(
    request: CreateProductRequest
  ): Promise<Result<CreateProductResponse, UseCaseError>>;
}

// Application Service パターン
interface ProductApplicationService {
  createProduct(
    request: CreateProductRequest
  ): Promise<Result<ProductDto, ApplicationError>>;
  updateProduct(
    id: string,
    request: UpdateProductRequest
  ): Promise<Result<ProductDto, ApplicationError>>;
  getProduct(id: string): Promise<Result<ProductDto, ApplicationError>>;
}
```

### 環境準備

- [ ] TypeScript 5.x 開発環境の確認
- [ ] テストフレームワーク（Jest/Vitest）の準備
- [ ] 関数型ライブラリ（fp-ts など）の調査
- [ ] DDD 参考書籍の準備

### 学習継続のコツ

1. **理論と実践のバランス**: 概念学習後は必ず実装で確認
2. **ドメイン理解の重視**: ビジネスルールを正確にモデリング
3. **型安全性の追求**: TypeScript の型システムを最大限活用
4. **リファクタリング習慣**: 継続的な設計改善

---

**📌 重要**: Week 1-2 は DDD の基礎を確実に習得する重要な期間です。Value Object と Entity の適切な実装により、堅牢なドメインモデルの基盤を構築しましょう。
