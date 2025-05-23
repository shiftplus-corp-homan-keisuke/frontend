# Phase 3: TypeScript 設計手法 詳細学習プラン（3-5 ヶ月）

## 🎯 学習目標

アーキテクチャレベルでの TypeScript 活用と Domain Driven Design 実装による、大規模アプリケーション設計力の習得

## 📅 8 週間学習スケジュール

### Week 1-2: Domain Driven Design 基礎・Value Object 実装

#### 📖 学習内容

- DDD 基本概念と TypeScript での実装パターン
- Value Object の型安全な実装
- Entity・Aggregate 設計パターン

#### 🎯 週次目標

**Week 1:**

- [ ] DDD 基本概念の理解と TypeScript 実装
- [ ] Value Object パターンの完全習得
- [ ] 型安全なドメインモデリング

**Week 2:**

- [ ] Entity・Aggregate の実装パターン
- [ ] Repository パターンの型安全実装
- [ ] ドメインサービスの設計

#### 📝 実践演習

**演習 3-1: Value Object 完全実装**

```typescript
// 堅牢なValue Objectシステムを実装せよ

// 基底Value Objectクラス
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
    return this.getValue() === other.getValue();
  }

  public getValue(): T {
    return this._value;
  }

  public toString(): string {
    return String(this._value);
  }
}

// 具体的なValue Object実装

// 1. Email Value Object
class Email extends ValueObject<string> {
  private static readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
  }

  protected normalize(value: string): string {
    return value.toLowerCase().trim();
  }

  getDomain(): string {
    return this._value.split("@")[1];
  }

  isBusinessEmail(): boolean {
    const businessDomains = ["gmail.com", "yahoo.com", "hotmail.com"];
    return !businessDomains.includes(this.getDomain());
  }
}

// 2. Money Value Object (複合型)
interface MoneyProps {
  amount: number;
  currency: "USD" | "EUR" | "JPY";
}

class Money extends ValueObject<MoneyProps> {
  private constructor(value: MoneyProps) {
    super(value);
  }

  static create(
    amount: number,
    currency: MoneyProps["currency"]
  ): Result<Money, MoneyError> {
    try {
      return Result.ok(new Money({ amount, currency }));
    } catch (error) {
      return Result.err(error as MoneyError);
    }
  }

  protected validate(value: MoneyProps): void {
    if (value.amount < 0) {
      throw new MoneyError("Amount cannot be negative");
    }
    if (!Number.isFinite(value.amount)) {
      throw new MoneyError("Amount must be a finite number");
    }
  }

  // ドメインメソッド
  add(other: Money): Result<Money, MoneyError> {
    if (this._value.currency !== other._value.currency) {
      return Result.err(new MoneyError("Cannot add different currencies"));
    }
    return Money.create(
      this._value.amount + other._value.amount,
      this._value.currency
    );
  }

  multiply(factor: number): Result<Money, MoneyError> {
    return Money.create(this._value.amount * factor, this._value.currency);
  }

  isGreaterThan(other: Money): boolean {
    if (this._value.currency !== other._value.currency) {
      throw new MoneyError("Cannot compare different currencies");
    }
    return this._value.amount > other._value.amount;
  }

  format(): string {
    const formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: this._value.currency,
    });
    return formatter.format(this._value.amount);
  }
}

// 3. DateRange Value Object
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

  protected validate(value: DateRangeProps): void {
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

  getDurationInDays(): number {
    const diffTime = this._value.end.getTime() - this._value.start.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
}

// Error型の実装
class EmailError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "EmailError";
  }
}

class MoneyError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "MoneyError";
  }
}

class DateRangeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DateRangeError";
  }
}

// Result型の実装（関数型エラーハンドリング）
abstract class Result<T, E> {
  abstract isOk(): this is Ok<T, E>;
  abstract isErr(): this is Err<T, E>;

  static ok<T, E>(value: T): Result<T, E> {
    return new Ok(value);
  }

  static err<T, E>(error: E): Result<T, E> {
    return new Err(error);
  }

  map<U>(fn: (value: T) => U): Result<U, E> {
    return this.isOk() ? Result.ok(fn(this.value)) : Result.err(this.error);
  }

  flatMap<U>(fn: (value: T) => Result<U, E>): Result<U, E> {
    return this.isOk() ? fn(this.value) : Result.err(this.error);
  }
}

class Ok<T, E> extends Result<T, E> {
  constructor(public readonly value: T) {
    super();
  }

  isOk(): this is Ok<T, E> {
    return true;
  }

  isErr(): this is Err<T, E> {
    return false;
  }
}

class Err<T, E> extends Result<T, E> {
  constructor(public readonly error: E) {
    super();
  }

  isOk(): this is Ok<T, E> {
    return false;
  }

  isErr(): this is Err<T, E> {
    return true;
  }
}
```

**演習 3-2: Entity・Aggregate 実装**

```typescript
// エコマースドメインのEntity・Aggregateを実装せよ

// ID型の実装
abstract class Id<T extends string> {
  constructor(protected readonly value: T) {
    if (!value) {
      throw new Error("ID cannot be empty");
    }
  }

  equals(other: Id<T>): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}

class UserId extends Id<string> {
  private constructor(value: string) {
    super(value);
  }

  static create(value?: string): UserId {
    return new UserId(value || this.generate());
  }

  private static generate(): string {
    return `user_${crypto.randomUUID()}`;
  }
}

class ProductId extends Id<string> {
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

// Entity基底クラス
abstract class Entity<T extends Id<string>> {
  constructor(
    protected readonly _id: T,
    protected readonly _createdAt: Date = new Date()
  ) {}

  get id(): T {
    return this._id;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  equals(other: Entity<T>): boolean {
    return this._id.equals(other._id);
  }
}

// Product Entity
interface ProductProps {
  name: string;
  description: string;
  price: Money;
  category: ProductCategory;
  stock: number;
  isActive: boolean;
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
    if (props.stock < 0) {
      return Result.err(new ProductError("Stock cannot be negative"));
    }
    return Result.ok(undefined);
  }

  // ドメインメソッド
  updatePrice(newPrice: Money): Result<void, ProductError> {
    if (newPrice.getValue().amount <= 0) {
      return Result.err(new ProductError("Price must be positive"));
    }

    this._props.price = newPrice;
    this._updatedAt = new Date();
    return Result.ok(undefined);
  }

  reduceStock(quantity: number): Result<void, ProductError> {
    if (quantity <= 0) {
      return Result.err(new ProductError("Quantity must be positive"));
    }
    if (this._props.stock < quantity) {
      return Result.err(new ProductError("Insufficient stock"));
    }

    this._props.stock -= quantity;
    this._updatedAt = new Date();
    return Result.ok(undefined);
  }

  deactivate(): void {
    this._props.isActive = false;
    this._updatedAt = new Date();
  }

  // Getters
  get name(): string {
    return this._props.name;
  }

  get price(): Money {
    return this._props.price;
  }

  get stock(): number {
    return this._props.stock;
  }

  get isActive(): boolean {
    return this._props.isActive;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }
}

// Order Aggregate
interface OrderProps {
  customerId: UserId;
  items: OrderItem[];
  status: OrderStatus;
  shippingAddress: Address;
  paymentMethod: PaymentMethod;
}

class Order extends Entity<OrderId> {
  private _props: OrderProps;
  private _updatedAt: Date;

  private constructor(id: OrderId, props: OrderProps, createdAt?: Date) {
    super(id, createdAt);
    this._props = { ...props };
    this._updatedAt = new Date();
  }

  static create(
    customerId: UserId,
    shippingAddress: Address,
    paymentMethod: PaymentMethod
  ): Order {
    const props: OrderProps = {
      customerId,
      items: [],
      status: OrderStatus.Pending,
      shippingAddress,
      paymentMethod,
    };

    return new Order(OrderId.create(), props);
  }

  // ドメインメソッド（Aggregateルート）
  addItem(product: Product, quantity: number): Result<void, OrderError> {
    if (!product.isActive) {
      return Result.err(new OrderError("Cannot add inactive product"));
    }

    const stockResult = product.reduceStock(quantity);
    if (stockResult.isErr()) {
      return Result.err(new OrderError("Insufficient stock"));
    }

    const existingItem = this._props.items.find((item) =>
      item.productId.equals(product.id)
    );

    if (existingItem) {
      existingItem.increaseQuantity(quantity);
    } else {
      this._props.items.push(
        new OrderItem(product.id, product.price, quantity)
      );
    }

    this._updatedAt = new Date();
    return Result.ok(undefined);
  }

  removeItem(productId: ProductId): Result<void, OrderError> {
    const itemIndex = this._props.items.findIndex((item) =>
      item.productId.equals(productId)
    );

    if (itemIndex === -1) {
      return Result.err(new OrderError("Item not found in order"));
    }

    this._props.items.splice(itemIndex, 1);
    this._updatedAt = new Date();
    return Result.ok(undefined);
  }

  confirm(): Result<void, OrderError> {
    if (this._props.items.length === 0) {
      return Result.err(new OrderError("Cannot confirm order with no items"));
    }
    if (this._props.status !== OrderStatus.Pending) {
      return Result.err(
        new OrderError("Order can only be confirmed from pending status")
      );
    }

    this._props.status = OrderStatus.Confirmed;
    this._updatedAt = new Date();
    return Result.ok(undefined);
  }

  calculateTotal(): Money {
    return this._props.items.reduce((total, item) => {
      const itemTotal = item.calculateSubtotal();
      return total.add(itemTotal).getValue(); // Assuming add returns Result<Money, Error>
    }, Money.create(0, "USD").getValue()); // Assuming create returns Result<Money, Error>
  }

  // Getters
  get customerId(): UserId {
    return this._props.customerId;
  }

  get items(): readonly OrderItem[] {
    return [...this._props.items];
  }

  get status(): OrderStatus {
    return this._props.status;
  }

  get totalAmount(): Money {
    return this.calculateTotal();
  }
}

// Supporting classes
class OrderItem {
  constructor(
    public readonly productId: ProductId,
    public readonly price: Money,
    private _quantity: number
  ) {}

  increaseQuantity(amount: number): void {
    this._quantity += amount;
  }

  calculateSubtotal(): Money {
    return this.price.multiply(this._quantity).getValue(); // Assuming multiply returns Result
  }

  get quantity(): number {
    return this._quantity;
  }
}

enum OrderStatus {
  Pending = "pending",
  Confirmed = "confirmed",
  Shipped = "shipped",
  Delivered = "delivered",
  Cancelled = "cancelled",
}

// Error classes
class ProductError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ProductError";
  }
}

class OrderError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "OrderError";
  }
}
```

### Week 3-4: Repository Pattern・Use Case 実装

#### 📖 学習内容

- Repository パターンの型安全実装
- Use Case レイヤーの設計
- Domain Service パターン

#### 🎯 週次目標

**Week 3:**

- [ ] Repository インターフェースの設計
- [ ] Use Case パターンの実装
- [ ] ドメインサービスの型安全実装

**Week 4:**

- [ ] Application Service の実装
- [ ] Event Sourcing 基礎
- [ ] CQRS パターンの理解

#### 📝 実践演習

**演習 4-1: Repository・Use Case 完全実装**

```typescript
// 型安全なRepository・Use Caseシステムを実装せよ

// Repository interfaces
interface UserRepository {
  findById(id: UserId): Promise<Option<User>>;
  findByEmail(email: Email): Promise<Option<User>>;
  save(user: User): Promise<Result<void, RepositoryError>>;
  delete(id: UserId): Promise<Result<void, RepositoryError>>;
  findAll(criteria?: UserSearchCriteria): Promise<User[]>;
}

interface ProductRepository {
  findById(id: ProductId): Promise<Option<Product>>;
  findByCategory(category: ProductCategory): Promise<Product[]>;
  save(product: Product): Promise<Result<void, RepositoryError>>;
  delete(id: ProductId): Promise<Result<void, RepositoryError>>;
  findByPriceRange(min: Money, max: Money): Promise<Product[]>;
}

interface OrderRepository {
  findById(id: OrderId): Promise<Option<Order>>;
  findByCustomerId(customerId: UserId): Promise<Order[]>;
  save(order: Order): Promise<Result<void, RepositoryError>>;
  findByStatus(status: OrderStatus): Promise<Order[]>;
  findByDateRange(range: DateRange): Promise<Order[]>;
}

// Use Case implementations

// 1. Create User Use Case
interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

interface CreateUserResponse {
  user: User;
  accessToken: string;
}

class CreateUserUseCase {
  constructor(
    private userRepository: UserRepository,
    private passwordHasher: PasswordHasher,
    private tokenGenerator: TokenGenerator,
    private emailService: EmailService,
    private logger: Logger
  ) {}

  async execute(
    request: CreateUserRequest
  ): Promise<Result<CreateUserResponse, CreateUserError>> {
    try {
      // 1. バリデーション
      const emailResult = Email.create(request.email);
      if (emailResult.isErr()) {
        return Result.err(
          new CreateUserError(`Invalid email: ${emailResult.error.message}`)
        );
      }

      const passwordResult = Password.create(request.password);
      if (passwordResult.isErr()) {
        return Result.err(
          new CreateUserError(
            `Invalid password: ${passwordResult.error.message}`
          )
        );
      }

      // 2. ビジネスルールチェック
      const existingUser = await this.userRepository.findByEmail(
        emailResult.value
      );
      if (existingUser.isSome()) {
        return Result.err(
          new CreateUserError("User with this email already exists")
        );
      }

      // 3. パスワードハッシュ化
      const hashedPassword = await this.passwordHasher.hash(
        passwordResult.value
      );

      // 4. ドメインオブジェクト作成
      const userResult = User.create({
        name: request.name,
        email: emailResult.value,
        hashedPassword,
        role: request.role,
      });

      if (userResult.isErr()) {
        return Result.err(
          new CreateUserError(
            `Failed to create user: ${userResult.error.message}`
          )
        );
      }

      // 5. 永続化
      const saveResult = await this.userRepository.save(userResult.value);
      if (saveResult.isErr()) {
        return Result.err(
          new CreateUserError(
            `Failed to save user: ${saveResult.error.message}`
          )
        );
      }

      // 6. アクセストークン生成
      const tokenResult = await this.tokenGenerator.generate(userResult.value);
      if (tokenResult.isErr()) {
        return Result.err(
          new CreateUserError(
            `Failed to generate token: ${tokenResult.error.message}`
          )
        );
      }

      // 7. ウェルカムメール送信（非同期）
      this.emailService
        .sendWelcomeEmail(userResult.value.email)
        .catch((error) => {
          this.logger.error("Failed to send welcome email", {
            userId: userResult.value.id.toString(),
            error,
          });
        });

      // 8. ログ記録
      this.logger.info("User created successfully", {
        userId: userResult.value.id.toString(),
      });

      return Result.ok({
        user: userResult.value,
        accessToken: tokenResult.value,
      });
    } catch (error) {
      this.logger.error("Unexpected error in CreateUserUseCase", error);
      return Result.err(new CreateUserError("An unexpected error occurred"));
    }
  }
}

// 2. Place Order Use Case
interface PlaceOrderRequest {
  customerId: string;
  items: Array<{
    productId: string;
    quantity: number;
  }>;
  shippingAddress: {
    street: string;
    city: string;
    zipCode: string;
    country: string;
  };
  paymentMethod: {
    type: "credit_card" | "paypal" | "bank_transfer";
    details: Record<string, any>;
  };
}

interface PlaceOrderResponse {
  order: Order;
  estimatedDeliveryDate: Date;
}

class PlaceOrderUseCase {
  constructor(
    private userRepository: UserRepository,
    private productRepository: ProductRepository,
    private orderRepository: OrderRepository,
    private paymentService: PaymentService,
    private shippingService: ShippingService,
    private inventoryService: InventoryService,
    private logger: Logger
  ) {}

  async execute(
    request: PlaceOrderRequest
  ): Promise<Result<PlaceOrderResponse, PlaceOrderError>> {
    try {
      // 1. 顧客検証
      const customerIdResult = UserId.create(request.customerId);
      const customer = await this.userRepository.findById(customerIdResult);
      if (customer.isNone()) {
        return Result.err(new PlaceOrderError("Customer not found"));
      }

      // 2. 住所・支払い方法検証
      const shippingAddressResult = Address.create(request.shippingAddress);
      if (shippingAddressResult.isErr()) {
        return Result.err(
          new PlaceOrderError(
            `Invalid shipping address: ${shippingAddressResult.error.message}`
          )
        );
      }

      const paymentMethodResult = PaymentMethod.create(request.paymentMethod);
      if (paymentMethodResult.isErr()) {
        return Result.err(
          new PlaceOrderError(
            `Invalid payment method: ${paymentMethodResult.error.message}`
          )
        );
      }

      // 3. 注文作成
      const order = Order.create(
        customerIdResult,
        shippingAddressResult.value,
        paymentMethodResult.value
      );

      // 4. 商品追加とイベントリソーシング
      for (const item of request.items) {
        const productId = ProductId.create(item.productId);
        const product = await this.productRepository.findById(productId);

        if (product.isNone()) {
          return Result.err(
            new PlaceOrderError(`Product not found: ${item.productId}`)
          );
        }

        // 在庫確認
        const inventoryResult = await this.inventoryService.reserve(
          productId,
          item.quantity
        );
        if (inventoryResult.isErr()) {
          return Result.err(
            new PlaceOrderError(
              `Insufficient inventory: ${inventoryResult.error.message}`
            )
          );
        }

        // 注文に商品追加
        const addItemResult = order.addItem(product.value, item.quantity);
        if (addItemResult.isErr()) {
          // 在庫予約をロールバック
          await this.inventoryService.release(productId, item.quantity);
          return Result.err(
            new PlaceOrderError(
              `Failed to add item: ${addItemResult.error.message}`
            )
          );
        }
      }

      // 5. 支払い処理
      const paymentResult = await this.paymentService.processPayment(
        order.totalAmount,
        paymentMethodResult.value
      );
      if (paymentResult.isErr()) {
        // 在庫予約をロールバック
        await this.rollbackInventoryReservations(order);
        return Result.err(
          new PlaceOrderError(`Payment failed: ${paymentResult.error.message}`)
        );
      }

      // 6. 注文確定
      const confirmResult = order.confirm();
      if (confirmResult.isErr()) {
        return Result.err(
          new PlaceOrderError(
            `Failed to confirm order: ${confirmResult.error.message}`
          )
        );
      }

      // 7. 注文保存
      const saveResult = await this.orderRepository.save(order);
      if (saveResult.isErr()) {
        return Result.err(
          new PlaceOrderError(
            `Failed to save order: ${saveResult.error.message}`
          )
        );
      }

      // 8. 配送予定日計算
      const estimatedDeliveryDate =
        await this.shippingService.calculateDeliveryDate(
          shippingAddressResult.value,
          order.items
        );

      // 9. ログ記録
      this.logger.info("Order placed successfully", {
        orderId: order.id.toString(),
        customerId: request.customerId,
        totalAmount: order.totalAmount.format(),
      });

      return Result.ok({
        order,
        estimatedDeliveryDate,
      });
    } catch (error) {
      this.logger.error("Unexpected error in PlaceOrderUseCase", error);
      return Result.err(new PlaceOrderError("An unexpected error occurred"));
    }
  }

  private async rollbackInventoryReservations(order: Order): Promise<void> {
    for (const item of order.items) {
      await this.inventoryService
        .release(item.productId, item.quantity)
        .catch((error) => {
          this.logger.error("Failed to rollback inventory reservation", {
            productId: item.productId.toString(),
            quantity: item.quantity,
            error,
          });
        });
    }
  }
}

// Application Service (Facade Pattern)
class OrderApplicationService {
  constructor(
    private placeOrderUseCase: PlaceOrderUseCase,
    private cancelOrderUseCase: CancelOrderUseCase,
    private updateOrderUseCase: UpdateOrderUseCase,
    private getOrderUseCase: GetOrderUseCase
  ) {}

  async placeOrder(
    request: PlaceOrderRequest
  ): Promise<Result<PlaceOrderResponse, PlaceOrderError>> {
    return this.placeOrderUseCase.execute(request);
  }

  async cancelOrder(
    orderId: string,
    reason: string
  ): Promise<Result<void, CancelOrderError>> {
    return this.cancelOrderUseCase.execute({ orderId, reason });
  }

  async getOrder(orderId: string): Promise<Result<Order, GetOrderError>> {
    return this.getOrderUseCase.execute({ orderId });
  }

  async getOrdersByCustomer(
    customerId: string
  ): Promise<Result<Order[], GetOrderError>> {
    return this.getOrderUseCase.executeForCustomer({ customerId });
  }
}

// Error types
class CreateUserError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CreateUserError";
  }
}

class PlaceOrderError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PlaceOrderError";
  }
}

class RepositoryError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "RepositoryError";
  }
}
```

### Week 5-6: Clean Architecture・Functional Programming

#### 📖 学習内容

- Clean Architecture 層設計
- 関数型プログラミングパターン
- モナドと Functor 実装

#### 🎯 週次目標

**Week 5:**

- [ ] Clean Architecture 層の完全分離
- [ ] 依存性逆転の実践
- [ ] インターフェース駆動設計

**Week 6:**

- [ ] Option/Result 型の高度活用
- [ ] 関数合成とパイプライン
- [ ] 不変性とイミュータブル設計

#### 📝 実践演習

**演習 6-1: Clean Architecture 完全実装**

```typescript
// Clean Architectureの全層を型安全に実装せよ

// ===============================
// Domain Layer (最内層)
// ===============================

// Entities & Value Objects (前回演習で実装済み)

// Domain Services
interface UserDomainService {
  isEmailUnique(email: Email, excludeUserId?: UserId): Promise<boolean>;
  calculateUserTier(user: User, orders: Order[]): UserTier;
  canUserPlaceOrder(user: User): Result<void, DomainError>;
}

class UserDomainServiceImpl implements UserDomainService {
  constructor(private userRepository: UserRepository) {}

  async isEmailUnique(email: Email, excludeUserId?: UserId): Promise<boolean> {
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser.isNone()) return true;

    if (excludeUserId && existingUser.value.id.equals(excludeUserId)) {
      return true;
    }

    return false;
  }

  calculateUserTier(user: User, orders: Order[]): UserTier {
    const totalSpent = orders.reduce((sum, order) => {
      return sum.add(order.totalAmount).getValue();
    }, Money.create(0, "USD").getValue());

    if (totalSpent.getValue().amount >= 10000) return UserTier.Premium;
    if (totalSpent.getValue().amount >= 5000) return UserTier.Gold;
    if (totalSpent.getValue().amount >= 1000) return UserTier.Silver;
    return UserTier.Bronze;
  }

  canUserPlaceOrder(user: User): Result<void, DomainError> {
    if (!user.isActive) {
      return Result.err(new DomainError("Inactive user cannot place orders"));
    }
    if (user.isBlocked) {
      return Result.err(new DomainError("Blocked user cannot place orders"));
    }
    return Result.ok(undefined);
  }
}

// ===============================
// Application Layer (Use Cases)
// ===============================

// Use Cases (前回演習で実装済み)

// Application Services
interface UserApplicationService {
  createUser(
    request: CreateUserRequest
  ): Promise<Result<CreateUserResponse, ApplicationError>>;
  updateUser(
    id: string,
    request: UpdateUserRequest
  ): Promise<Result<UpdateUserResponse, ApplicationError>>;
  deleteUser(id: string): Promise<Result<void, ApplicationError>>;
  getUser(id: string): Promise<Result<GetUserResponse, ApplicationError>>;
  getUsersByTier(
    tier: UserTier
  ): Promise<Result<GetUsersResponse, ApplicationError>>;
}

class UserApplicationServiceImpl implements UserApplicationService {
  constructor(
    private createUserUseCase: CreateUserUseCase,
    private updateUserUseCase: UpdateUserUseCase,
    private deleteUserUseCase: DeleteUserUseCase,
    private getUserUseCase: GetUserUseCase,
    private getUsersByTierUseCase: GetUsersByTierUseCase
  ) {}

  async createUser(
    request: CreateUserRequest
  ): Promise<Result<CreateUserResponse, ApplicationError>> {
    const result = await this.createUserUseCase.execute(request);
    return result.mapError((error) => new ApplicationError(error.message));
  }

  async updateUser(
    id: string,
    request: UpdateUserRequest
  ): Promise<Result<UpdateUserResponse, ApplicationError>> {
    const userIdResult = UserId.create(id);
    const result = await this.updateUserUseCase.execute({
      id: userIdResult,
      ...request,
    });
    return result.mapError((error) => new ApplicationError(error.message));
  }

  // ... 他のメソッドも同様に実装
}

// ===============================
// Infrastructure Layer (最外層)
// ===============================

// Repository implementations
class PostgresUserRepository implements UserRepository {
  constructor(private db: DatabaseConnection, private mapper: UserMapper) {}

  async findById(id: UserId): Promise<Option<User>> {
    try {
      const query = "SELECT * FROM users WHERE id = $1";
      const result = await this.db.query(query, [id.toString()]);

      if (result.rows.length === 0) {
        return Option.none();
      }

      const userResult = this.mapper.toDomain(result.rows[0]);
      return userResult.isOk() ? Option.some(userResult.value) : Option.none();
    } catch (error) {
      throw new RepositoryError(`Failed to find user by id: ${error.message}`);
    }
  }

  async findByEmail(email: Email): Promise<Option<User>> {
    try {
      const query = "SELECT * FROM users WHERE email = $1";
      const result = await this.db.query(query, [email.getValue()]);

      if (result.rows.length === 0) {
        return Option.none();
      }

      const userResult = this.mapper.toDomain(result.rows[0]);
      return userResult.isOk() ? Option.some(userResult.value) : Option.none();
    } catch (error) {
      throw new RepositoryError(
        `Failed to find user by email: ${error.message}`
      );
    }
  }

  async save(user: User): Promise<Result<void, RepositoryError>> {
    try {
      const persistenceData = this.mapper.toPersistence(user);

      const query = `
        INSERT INTO users (id, name, email, hashed_password, role, is_active, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          email = EXCLUDED.email,
          hashed_password = EXCLUDED.hashed_password,
          role = EXCLUDED.role,
          is_active = EXCLUDED.is_active,
          updated_at = EXCLUDED.updated_at
      `;

      await this.db.query(query, [
        persistenceData.id,
        persistenceData.name,
        persistenceData.email,
        persistenceData.hashedPassword,
        persistenceData.role,
        persistenceData.isActive,
        persistenceData.createdAt,
        persistenceData.updatedAt,
      ]);

      return Result.ok(undefined);
    } catch (error) {
      return Result.err(
        new RepositoryError(`Failed to save user: ${error.message}`)
      );
    }
  }

  // ... 他のメソッドも同様に実装
}

// Mappers (Domain ↔ Persistence)
interface UserPersistenceData {
  id: string;
  name: string;
  email: string;
  hashedPassword: string;
  role: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

class UserMapper {
  toDomain(persistenceData: UserPersistenceData): Result<User, MappingError> {
    try {
      const emailResult = Email.create(persistenceData.email);
      if (emailResult.isErr()) {
        return Result.err(
          new MappingError(`Invalid email: ${emailResult.error.message}`)
        );
      }

      const hashedPasswordResult = HashedPassword.create(
        persistenceData.hashedPassword
      );
      if (hashedPasswordResult.isErr()) {
        return Result.err(
          new MappingError(
            `Invalid password: ${hashedPasswordResult.error.message}`
          )
        );
      }

      return User.fromPersistence(
        persistenceData.id,
        {
          name: persistenceData.name,
          email: emailResult.value,
          hashedPassword: hashedPasswordResult.value,
          role: persistenceData.role as UserRole,
          isActive: persistenceData.isActive,
        },
        persistenceData.createdAt
      );
    } catch (error) {
      return Result.err(
        new MappingError(`Failed to map to domain: ${error.message}`)
      );
    }
  }

  toPersistence(user: User): UserPersistenceData {
    return {
      id: user.id.toString(),
      name: user.name,
      email: user.email.getValue(),
      hashedPassword: user.hashedPassword.getValue(),
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}

// ===============================
// Interface Layer (Controllers)
// ===============================

// DTOs
interface CreateUserRequestDto {
  name: string;
  email: string;
  password: string;
  role: "admin" | "user";
}

interface UserResponseDto {
  id: string;
  name: string;
  email: string;
  role: string;
  tier: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Controllers
class UserController {
  constructor(
    private userApplicationService: UserApplicationService,
    private userMapper: UserResponseMapper
  ) {}

  async createUser(req: Request, res: Response): Promise<void> {
    try {
      const requestDto: CreateUserRequestDto = req.body;

      // バリデーション
      const validationResult = this.validateCreateUserRequest(requestDto);
      if (validationResult.isErr()) {
        res.status(400).json({
          error: "Validation failed",
          message: validationResult.error.message,
        });
        return;
      }

      // Use Case実行
      const result = await this.userApplicationService.createUser({
        name: requestDto.name,
        email: requestDto.email,
        password: requestDto.password,
        role: requestDto.role as UserRole,
      });

      if (result.isErr()) {
        res.status(400).json({
          error: "Failed to create user",
          message: result.error.message,
        });
        return;
      }

      // レスポンス生成
      const responseDto = this.userMapper.toResponseDto(result.value.user);
      res.status(201).json({
        data: responseDto,
        accessToken: result.value.accessToken,
      });
    } catch (error) {
      res.status(500).json({
        error: "Internal server error",
        message: "An unexpected error occurred",
      });
    }
  }

  private validateCreateUserRequest(
    request: CreateUserRequestDto
  ): Result<void, ValidationError> {
    if (!request.name?.trim()) {
      return Result.err(new ValidationError("Name is required"));
    }
    if (!request.email?.trim()) {
      return Result.err(new ValidationError("Email is required"));
    }
    if (!request.password?.trim()) {
      return Result.err(new ValidationError("Password is required"));
    }
    if (!["admin", "user"].includes(request.role)) {
      return Result.err(new ValidationError("Invalid role"));
    }
    return Result.ok(undefined);
  }
}

// Response Mappers
class UserResponseMapper {
  toResponseDto(user: User): UserResponseDto {
    return {
      id: user.id.toString(),
      name: user.name,
      email: user.email.getValue(),
      role: user.role,
      tier: user.tier,
      isActive: user.isActive,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  }

  toListResponseDto(users: User[]): UserResponseDto[] {
    return users.map((user) => this.toResponseDto(user));
  }
}

// Error classes
class ApplicationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ApplicationError";
  }
}

class MappingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "MappingError";
  }
}

class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DomainError";
  }
}
```

### Week 7-8: 実践プロジェクト・総合演習

#### 📖 学習内容

- 複雑なドメインモデリング実践
- イベントソーシング・CQRS 実装
- マイクロサービス設計パターン

#### 🎯 週次目標

**Week 7:**

- [ ] 実践プロジェクト設計・開発
- [ ] イベントソーシングの実装
- [ ] CQRS パターンの適用

**Week 8:**

- [ ] パフォーマンス最適化
- [ ] 統合テスト実装
- [ ] ドキュメンテーション作成

#### 📝 最終プロジェクト: ブログプラットフォーム

**プロジェクト要件:**

- 複数著者によるブログ管理システム
- 記事の作成・編集・公開フロー
- コメント・いいね機能
- タグ・カテゴリ管理
- イベントソーシングによる変更履歴
- CQRS による読み書き分離

```typescript
// プロジェクト実装例の一部
interface BlogPost extends AggregateRoot {
  publishPost(): Result<void, BlogPostError>;
  addComment(comment: Comment): Result<void, BlogPostError>;
  updateContent(content: PostContent): Result<void, BlogPostError>;
}

// イベントソーシング
interface DomainEvent {
  eventId: string;
  aggregateId: string;
  eventType: string;
  eventData: any;
  occurredAt: Date;
  version: number;
}

class BlogPostCreated implements DomainEvent {
  constructor(
    public readonly eventId: string,
    public readonly aggregateId: string,
    public readonly eventData: {
      title: string;
      content: string;
      authorId: string;
    },
    public readonly occurredAt: Date,
    public readonly version: number
  ) {}

  get eventType(): string {
    return "BlogPostCreated";
  }
}
```

## 📊 学習成果評価基準

### 📈 成果物チェックリスト

- [ ] **DDD + TypeScript 実装例（3 ドメイン以上）**
- [ ] **Clean Architecture テンプレート**
- [ ] **関数型プログラミングライブラリ**
- [ ] **型安全なエラーハンドリングシステム**
- [ ] **アーキテクチャ設計ガイドライン**
- [ ] **実践プロジェクト（ブログプラットフォーム）**

### 🏆 最終評価項目

| 項目               | 重み | 評価基準                       |
| ------------------ | ---- | ------------------------------ |
| DDD 理解・実装     | 30%  | ドメインモデリングの適切性     |
| Clean Architecture | 25%  | 層分離と依存性管理             |
| 型安全性           | 20%  | TypeScript 活用の高度さ        |
| 設計品質           | 15%  | 保守性・拡張性・テスタビリティ |
| 実践応用力         | 10%  | 複雑な問題への適用能力         |

**合格基準: 各項目 75%以上、総合 85%以上**

---

**📌 重要**: この Phase では、単なる技術的実装だけでなく、ビジネス要件を適切にモデリングし、変更に強いアーキテクチャを設計する能力の習得が最重要目標です。
