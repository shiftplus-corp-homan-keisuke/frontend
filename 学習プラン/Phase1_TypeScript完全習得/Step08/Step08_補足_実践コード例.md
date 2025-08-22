# Step08 補足資料：実践コード例集

> 💡 **目的**: SOLID 原則の段階的実装例を通じた理解深化
> 🎯 **対象**: TypeScript 上級者・実践的設計パターン学習者  
> 💻 **活用方法**: 各原則の理論学習後の実装練習・参考実装として

---

## 📚 コード例の構成

各 SOLID 原則について、以下の 4 段階で実装例を提供します：

- **Level 1**: 基礎実装（概念理解重視）
- **Level 2**: 型安全な実装（TypeScript 型システム活用）
- **Level 3**: 実践的実装（実務レベル）
- **Level 4**: 高度な実装（上級者向けパターン）

---

## 🔍 SRP（単一責任の原則）実装例

### Level 1: 基礎実装

#### ❌ SRP 違反の例

```typescript
// 💩 SRP違反: ユーザークラスが複数の責任を持つ
class User {
  constructor(private name: string, private email: string) {}

  // 責任1: ユーザーデータの管理
  getName(): string {
    return this.name;
  }

  getEmail(): string {
    return this.email;
  }

  // 責任2: バリデーション（本来は別クラスの責任）
  validateEmail(): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(this.email);
  }

  // 責任3: データ永続化（本来は別クラスの責任）
  saveToDatabase(): void {
    console.log(`Saving user ${this.name} to database`);
    // データベース保存ロジック
  }

  // 責任4: 通知送信（本来は別クラスの責任）
  sendWelcomeEmail(): void {
    console.log(`Sending welcome email to ${this.email}`);
    // メール送信ロジック
  }
}
```

#### ✅ SRP 準拠の例

```typescript
// ✅ SRP準拠: 各クラスが単一の責任を持つ

// 責任1: ユーザーデータの管理のみ
class User {
  constructor(private readonly name: string, private readonly email: string) {}

  getName(): string {
    return this.name;
  }

  getEmail(): string {
    return this.email;
  }
}

// 責任2: バリデーション専門クラス
class UserValidator {
  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  validateName(name: string): boolean {
    return name.length >= 2 && name.length <= 50;
  }
}

// 責任3: データ永続化専門クラス
class UserRepository {
  save(user: User): void {
    console.log(`Saving user ${user.getName()} to database`);
    // データベース保存ロジック
  }

  findByEmail(email: string): User | null {
    // データベース検索ロジック
    return null;
  }
}

// 責任4: 通知送信専門クラス
class EmailService {
  sendWelcomeEmail(user: User): void {
    console.log(`Sending welcome email to ${user.getEmail()}`);
    // メール送信ロジック
  }
}
```

### Level 2: 型安全な実装

```typescript
// 🎯 型安全性を高めたSRP実装

// ドメインモデル
interface UserData {
  readonly name: string;
  readonly email: string;
  readonly id?: string;
}

// バリデーション結果型
type ValidationResult = {
  isValid: boolean;
  errors: string[];
};

// ユーザークラス（不変オブジェクト）
class User {
  private constructor(private readonly data: UserData) {}

  static create(name: string, email: string): User {
    return new User({ name, email });
  }

  getName(): string {
    return this.data.name;
  }

  getEmail(): string {
    return this.data.email;
  }

  getId(): string | undefined {
    return this.data.id;
  }
}

// 型安全なバリデーター
class UserValidator {
  validate(userData: Omit<UserData, "id">): ValidationResult {
    const errors: string[] = [];

    if (!this.isValidEmail(userData.email)) {
      errors.push("Invalid email format");
    }

    if (!this.isValidName(userData.name)) {
      errors.push("Name must be between 2 and 50 characters");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private isValidName(name: string): boolean {
    return name.length >= 2 && name.length <= 50;
  }
}

// 型安全なリポジトリ
interface IUserRepository {
  save(user: User): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
}

class UserRepository implements IUserRepository {
  async save(user: User): Promise<User> {
    // データベース保存の実装
    console.log(`Saving user ${user.getName()}`);
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    // データベース検索の実装
    return null;
  }

  async findById(id: string): Promise<User | null> {
    // データベース検索の実装
    return null;
  }
}
```

### Level 3: 実践的実装

```typescript
// 🚀 実務レベルのSRP実装

// エラー型の定義
class ValidationError extends Error {
  constructor(message: string, public readonly field: string) {
    super(message);
    this.name = "ValidationError";
  }
}

class PersistenceError extends Error {
  constructor(message: string, public readonly cause?: Error) {
    super(message);
    this.name = "PersistenceError";
  }
}

// Result型パターンの採用
type Result<T, E = Error> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      error: E;
    };

// ドメインモデル
class User {
  private constructor(
    private readonly id: string,
    private readonly name: string,
    private readonly email: string,
    private readonly createdAt: Date
  ) {}

  static create(name: string, email: string): User {
    return new User(crypto.randomUUID(), name, email, new Date());
  }

  getId(): string {
    return this.id;
  }
  getName(): string {
    return this.name;
  }
  getEmail(): string {
    return this.email;
  }
  getCreatedAt(): Date {
    return this.createdAt;
  }
}

// バリデーションサービス
class UserValidationService {
  validate(name: string, email: string): Result<void, ValidationError> {
    const nameResult = this.validateName(name);
    if (!nameResult.success) {
      return nameResult;
    }

    const emailResult = this.validateEmail(email);
    if (!emailResult.success) {
      return emailResult;
    }

    return { success: true, data: undefined };
  }

  private validateName(name: string): Result<void, ValidationError> {
    if (!name || name.trim().length === 0) {
      return {
        success: false,
        error: new ValidationError("Name is required", "name"),
      };
    }

    if (name.length > 50) {
      return {
        success: false,
        error: new ValidationError(
          "Name must be 50 characters or less",
          "name"
        ),
      };
    }

    return { success: true, data: undefined };
  }

  private validateEmail(email: string): Result<void, ValidationError> {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        success: false,
        error: new ValidationError("Invalid email format", "email"),
      };
    }

    return { success: true, data: undefined };
  }
}

// 永続化サービス
interface IUserRepository {
  save(user: User): Promise<Result<User, PersistenceError>>;
  findByEmail(email: string): Promise<Result<User | null, PersistenceError>>;
}

class UserRepository implements IUserRepository {
  async save(user: User): Promise<Result<User, PersistenceError>> {
    try {
      // 実際のデータベース操作
      console.log(`Saving user: ${user.getName()}`);
      return { success: true, data: user };
    } catch (error) {
      return {
        success: false,
        error: new PersistenceError("Failed to save user", error as Error),
      };
    }
  }

  async findByEmail(
    email: string
  ): Promise<Result<User | null, PersistenceError>> {
    try {
      // 実際のデータベース検索
      console.log(`Searching user by email: ${email}`);
      return { success: true, data: null };
    } catch (error) {
      return {
        success: false,
        error: new PersistenceError("Failed to find user", error as Error),
      };
    }
  }
}

// ユーザー作成サービス（複数の責任を統合）
class UserCreationService {
  constructor(
    private readonly validator: UserValidationService,
    private readonly repository: IUserRepository
  ) {}

  async createUser(
    name: string,
    email: string
  ): Promise<Result<User, ValidationError | PersistenceError>> {
    // バリデーション
    const validationResult = this.validator.validate(name, email);
    if (!validationResult.success) {
      return validationResult;
    }

    // 既存ユーザーチェック
    const existingUserResult = await this.repository.findByEmail(email);
    if (!existingUserResult.success) {
      return existingUserResult;
    }

    if (existingUserResult.data) {
      return {
        success: false,
        error: new ValidationError(
          "User with this email already exists",
          "email"
        ),
      };
    }

    // ユーザー作成と保存
    const user = User.create(name, email);
    return await this.repository.save(user);
  }
}
```

### Level 4: 高度な実装

```typescript
// ⚡ 高度なSRP実装（Domain Events + CQRS）

// ドメインイベント
abstract class DomainEvent {
  readonly occurredAt: Date;
  readonly eventId: string;

  constructor() {
    this.occurredAt = new Date();
    this.eventId = crypto.randomUUID();
  }
}

class UserCreatedEvent extends DomainEvent {
  constructor(
    public readonly userId: string,
    public readonly userName: string,
    public readonly userEmail: string
  ) {
    super();
  }
}

// 集約ルート
class User {
  private domainEvents: DomainEvent[] = [];

  private constructor(
    private readonly id: string,
    private readonly name: string,
    private readonly email: string,
    private readonly createdAt: Date
  ) {}

  static create(name: string, email: string): User {
    const user = new User(crypto.randomUUID(), name, email, new Date());

    // ドメインイベントの追加
    user.addDomainEvent(new UserCreatedEvent(user.id, user.name, user.email));

    return user;
  }

  getId(): string {
    return this.id;
  }
  getName(): string {
    return this.name;
  }
  getEmail(): string {
    return this.email;
  }
  getCreatedAt(): Date {
    return this.createdAt;
  }

  getDomainEvents(): DomainEvent[] {
    return [...this.domainEvents];
  }

  clearDomainEvents(): void {
    this.domainEvents = [];
  }

  private addDomainEvent(event: DomainEvent): void {
    this.domainEvents.push(event);
  }
}

// ドメインイベントハンドラー
interface IDomainEventHandler<T extends DomainEvent> {
  handle(event: T): Promise<void>;
}

class WelcomeEmailHandler implements IDomainEventHandler<UserCreatedEvent> {
  async handle(event: UserCreatedEvent): Promise<void> {
    console.log(`Sending welcome email to ${event.userEmail}`);
    // メール送信の実装
  }
}

class UserAnalyticsHandler implements IDomainEventHandler<UserCreatedEvent> {
  async handle(event: UserCreatedEvent): Promise<void> {
    console.log(`Recording user creation analytics for ${event.userId}`);
    // 分析データ記録の実装
  }
}

// イベント発行者
interface IEventDispatcher {
  dispatch<T extends DomainEvent>(event: T): Promise<void>;
}

class EventDispatcher implements IEventDispatcher {
  private handlers = new Map<string, IDomainEventHandler<any>[]>();

  register<T extends DomainEvent>(
    eventType: new (...args: any[]) => T,
    handler: IDomainEventHandler<T>
  ): void {
    const eventName = eventType.name;
    if (!this.handlers.has(eventName)) {
      this.handlers.set(eventName, []);
    }
    this.handlers.get(eventName)!.push(handler);
  }

  async dispatch<T extends DomainEvent>(event: T): Promise<void> {
    const eventName = event.constructor.name;
    const handlers = this.handlers.get(eventName) || [];

    await Promise.all(handlers.map((handler) => handler.handle(event)));
  }
}

// アプリケーションサービス
class UserApplicationService {
  constructor(
    private readonly validator: UserValidationService,
    private readonly repository: IUserRepository,
    private readonly eventDispatcher: IEventDispatcher
  ) {}

  async createUser(
    name: string,
    email: string
  ): Promise<Result<User, ValidationError | PersistenceError>> {
    // バリデーション
    const validationResult = this.validator.validate(name, email);
    if (!validationResult.success) {
      return validationResult;
    }

    // ユーザー作成
    const user = User.create(name, email);

    // 保存
    const saveResult = await this.repository.save(user);
    if (!saveResult.success) {
      return saveResult;
    }

    // ドメインイベント発行
    const events = user.getDomainEvents();
    for (const event of events) {
      await this.eventDispatcher.dispatch(event);
    }
    user.clearDomainEvents();

    return saveResult;
  }
}
```

---

## 🔓 OCP（オープン・クローズドの原則）実装例

### Level 1: 基礎実装

#### ❌ OCP 違反の例

```typescript
// 💩 OCP違反: 新しい図形を追加する度に既存コードを変更
class AreaCalculator {
  calculateArea(shapes: any[]): number {
    let totalArea = 0;

    for (const shape of shapes) {
      if (shape.type === "rectangle") {
        totalArea += shape.width * shape.height;
      } else if (shape.type === "circle") {
        totalArea += Math.PI * shape.radius * shape.radius;
      } else if (shape.type === "triangle") {
        // 新しい図形を追加するたびに修正が必要
        totalArea += 0.5 * shape.base * shape.height;
      }
      // 新しい図形が追加される度にここを修正する必要がある
    }

    return totalArea;
  }
}
```

#### ✅ OCP 準拠の例

```typescript
// ✅ OCP準拠: 抽象化により拡張に開放的、変更に閉鎖的

// 抽象化
abstract class Shape {
  abstract calculateArea(): number;
}

// 具体的な実装
class Rectangle extends Shape {
  constructor(private width: number, private height: number) {
    super();
  }

  calculateArea(): number {
    return this.width * this.height;
  }
}

class Circle extends Shape {
  constructor(private radius: number) {
    super();
  }

  calculateArea(): number {
    return Math.PI * this.radius * this.radius;
  }
}

// 新しい図形を追加（既存コードを変更せず）
class Triangle extends Shape {
  constructor(private base: number, private height: number) {
    super();
  }

  calculateArea(): number {
    return 0.5 * this.base * this.height;
  }
}

// 計算クラス（変更不要）
class AreaCalculator {
  calculateTotalArea(shapes: Shape[]): number {
    return shapes.reduce((total, shape) => total + shape.calculateArea(), 0);
  }
}
```

### Level 2: 型安全な実装

```typescript
// 🎯 TypeScript型システムを活用したOCP実装

// 図形の種類を型安全に定義
interface ShapeProperties {
  rectangle: { width: number; height: number };
  circle: { radius: number };
  triangle: { base: number; height: number };
}

type ShapeType = keyof ShapeProperties;

// 抽象基底クラス
abstract class Shape<T extends ShapeType> {
  constructor(
    protected readonly type: T,
    protected readonly properties: ShapeProperties[T]
  ) {}

  abstract calculateArea(): number;
  abstract calculatePerimeter(): number;

  getType(): T {
    return this.type;
  }
}

// 具体的な図形実装
class Rectangle extends Shape<"rectangle"> {
  constructor(width: number, height: number) {
    super("rectangle", { width, height });
  }

  calculateArea(): number {
    return this.properties.width * this.properties.height;
  }

  calculatePerimeter(): number {
    return 2 * (this.properties.width + this.properties.height);
  }
}

class Circle extends Shape<"circle"> {
  constructor(radius: number) {
    super("circle", { radius });
  }

  calculateArea(): number {
    return Math.PI * this.properties.radius ** 2;
  }

  calculatePerimeter(): number {
    return 2 * Math.PI * this.properties.radius;
  }
}

// 新しい図形を型安全に追加
class Triangle extends Shape<"triangle"> {
  constructor(base: number, height: number) {
    super("triangle", { base, height });
  }

  calculateArea(): number {
    return 0.5 * this.properties.base * this.properties.height;
  }

  calculatePerimeter(): number {
    // 正三角形と仮定
    return 3 * this.properties.base;
  }
}

// ジェネリクスを活用した計算サービス
interface ICalculationStrategy<T> {
  calculate(shapes: Shape<any>[]): T;
}

class AreaCalculationStrategy implements ICalculationStrategy<number> {
  calculate(shapes: Shape<any>[]): number {
    return shapes.reduce((total, shape) => total + shape.calculateArea(), 0);
  }
}

class PerimeterCalculationStrategy implements ICalculationStrategy<number> {
  calculate(shapes: Shape<any>[]): number {
    return shapes.reduce(
      (total, shape) => total + shape.calculatePerimeter(),
      0
    );
  }
}

// コンテキストクラス
class ShapeCalculator<T> {
  constructor(private strategy: ICalculationStrategy<T>) {}

  setStrategy(strategy: ICalculationStrategy<T>): void {
    this.strategy = strategy;
  }

  calculate(shapes: Shape<any>[]): T {
    return this.strategy.calculate(shapes);
  }
}
```

### Level 3: 実践的実装

```typescript
// 🚀 実務レベルのOCP実装（Plugin Architecture）

// 割引戦略の抽象化
interface DiscountStrategy {
  readonly name: string;
  readonly description: string;
  calculate(originalPrice: number, context: DiscountContext): number;
  isApplicable(context: DiscountContext): boolean;
}

// 割引計算のコンテキスト
interface DiscountContext {
  customerType: "regular" | "premium" | "vip";
  purchaseAmount: number;
  itemCategory: string;
  membershipDuration: number; // 月数
  couponCode?: string;
}

// 基本割引クラス
abstract class BaseDiscountStrategy implements DiscountStrategy {
  constructor(
    public readonly name: string,
    public readonly description: string
  ) {}

  abstract calculate(originalPrice: number, context: DiscountContext): number;
  abstract isApplicable(context: DiscountContext): boolean;

  protected validateContext(context: DiscountContext): void {
    if (context.purchaseAmount < 0) {
      throw new Error("Purchase amount must be positive");
    }
  }
}

// 具体的な割引戦略
class RegularCustomerDiscount extends BaseDiscountStrategy {
  constructor() {
    super("Regular Customer Discount", "5% discount for regular customers");
  }

  calculate(originalPrice: number, context: DiscountContext): number {
    this.validateContext(context);
    return originalPrice * 0.05;
  }

  isApplicable(context: DiscountContext): boolean {
    return context.customerType === "regular" && context.purchaseAmount >= 100;
  }
}

class PremiumMemberDiscount extends BaseDiscountStrategy {
  constructor() {
    super("Premium Member Discount", "10% discount for premium members");
  }

  calculate(originalPrice: number, context: DiscountContext): number {
    this.validateContext(context);
    return originalPrice * 0.1;
  }

  isApplicable(context: DiscountContext): boolean {
    return context.customerType === "premium";
  }
}

class LoyaltyDiscount extends BaseDiscountStrategy {
  constructor() {
    super(
      "Loyalty Discount",
      "Additional discount based on membership duration"
    );
  }

  calculate(originalPrice: number, context: DiscountContext): number {
    this.validateContext(context);
    const loyaltyRate = Math.min(context.membershipDuration * 0.005, 0.15); // 最大15%
    return originalPrice * loyaltyRate;
  }

  isApplicable(context: DiscountContext): boolean {
    return context.membershipDuration >= 12; // 1年以上のメンバー
  }
}

// 新しい割引戦略（既存コードを変更せずに追加）
class SeasonalDiscount extends BaseDiscountStrategy {
  constructor() {
    super("Seasonal Discount", "Special seasonal discounts");
  }

  calculate(originalPrice: number, context: DiscountContext): number {
    this.validateContext(context);
    return originalPrice * 0.2; // 20% off
  }

  isApplicable(context: DiscountContext): boolean {
    const currentMonth = new Date().getMonth();
    return currentMonth === 11 || currentMonth === 0; // December or January
  }
}

// 割引エンジン
class DiscountEngine {
  private strategies: DiscountStrategy[] = [];

  registerStrategy(strategy: DiscountStrategy): void {
    this.strategies.push(strategy);
  }

  calculateDiscount(
    originalPrice: number,
    context: DiscountContext
  ): {
    totalDiscount: number;
    appliedDiscounts: Array<{ name: string; amount: number }>;
  } {
    const appliedDiscounts: Array<{ name: string; amount: number }> = [];
    let totalDiscount = 0;

    for (const strategy of this.strategies) {
      if (strategy.isApplicable(context)) {
        const discountAmount = strategy.calculate(originalPrice, context);
        appliedDiscounts.push({
          name: strategy.name,
          amount: discountAmount,
        });
        totalDiscount += discountAmount;
      }
    }

    return { totalDiscount, appliedDiscounts };
  }

  getAvailableStrategies(): Array<{ name: string; description: string }> {
    return this.strategies.map((strategy) => ({
      name: strategy.name,
      description: strategy.description,
    }));
  }
}

// 使用例
const discountEngine = new DiscountEngine();

// 既存の割引戦略を登録
discountEngine.registerStrategy(new RegularCustomerDiscount());
discountEngine.registerStrategy(new PremiumMemberDiscount());
discountEngine.registerStrategy(new LoyaltyDiscount());

// 新しい割引戦略を追加（既存コードを変更せず）
discountEngine.registerStrategy(new SeasonalDiscount());
```

### Level 4: 高度な実装

```typescript
// ⚡ 高度なOCP実装（Decorator Pattern + Chain of Responsibility）

// コマンド実行の抽象化
interface Command<T = any> {
  execute(): Promise<T>;
}

// デコレーターの抽象基底クラス
abstract class CommandDecorator<T = any> implements Command<T> {
  constructor(protected command: Command<T>) {}

  abstract execute(): Promise<T>;
}

// 基本的なコマンド
class DatabaseQueryCommand implements Command<any[]> {
  constructor(private query: string) {}

  async execute(): Promise<any[]> {
    console.log(`Executing query: ${this.query}`);
    // 実際のデータベースクエリ
    return [{ id: 1, name: "Sample" }];
  }
}

// ロギングデコレーター
class LoggingDecorator<T> extends CommandDecorator<T> {
  async execute(): Promise<T> {
    console.log(`Starting execution of ${this.command.constructor.name}`);
    const startTime = Date.now();

    try {
      const result = await this.command.execute();
      const duration = Date.now() - startTime;
      console.log(`Command completed successfully in ${duration}ms`);
      return result;
    } catch (error) {
      console.error(`Command failed after ${Date.now() - startTime}ms:`, error);
      throw error;
    }
  }
}

// キャッシングデコレーター
class CachingDecorator<T> extends CommandDecorator<T> {
  private static cache = new Map<string, any>();

  constructor(
    command: Command<T>,
    private cacheKey: string,
    private ttl: number = 60000 // 1分
  ) {
    super(command);
  }

  async execute(): Promise<T> {
    const cached = CachingDecorator.cache.get(this.cacheKey);
    if (cached && Date.now() - cached.timestamp < this.ttl) {
      console.log(`Cache hit for key: ${this.cacheKey}`);
      return cached.data;
    }

    const result = await this.command.execute();
    CachingDecorator.cache.set(this.cacheKey, {
      data: result,
      timestamp: Date.now(),
    });

    console.log(`Cache miss for key: ${this.cacheKey}`);
    return result;
  }
}

// リトライデコレーター
class RetryDecorator<T> extends CommandDecorator<T> {
  constructor(
    command: Command<T>,
    private maxRetries: number = 3,
    private retryDelay: number = 1000
  ) {
    super(command);
  }

  async execute(): Promise<T> {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        return await this.command.execute();
      } catch (error) {
        lastError = error as Error;
        console.log(`Attempt ${attempt} failed: ${lastError.message}`);

        if (attempt < this.maxRetries) {
          await this.delay(this.retryDelay * attempt); // 指数バックオフ
        }
      }
    }

    throw lastError;
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

// バリデーションデコレーター
class ValidationDecorator<T> extends CommandDecorator<T> {
  constructor(
    command: Command<T>,
    private validator: (command: Command<T>) => boolean,
    private errorMessage: string = "Validation failed"
  ) {
    super(command);
  }

  async execute(): Promise<T> {
    if (!this.validator(this.command)) {
      throw new Error(this.errorMessage);
    }

    return await this.command.execute();
  }
}

// パフォーマンス監視デコレーター
class PerformanceMonitoringDecorator<T> extends CommandDecorator<T> {
  constructor(
    command: Command<T>,
    private performanceThreshold: number = 1000 // ms
  ) {
    super(command);
  }

  async execute(): Promise<T> {
    const startTime = performance.now();
    const startMemory = process.memoryUsage();

    const result = await this.command.execute();

    const endTime = performance.now();
    const endMemory = process.memoryUsage();

    const executionTime = endTime - startTime;
    const memoryDelta = endMemory.heapUsed - startMemory.heapUsed;

    if (executionTime > this.performanceThreshold) {
      console.warn(`Slow command detected: ${executionTime.toFixed(2)}ms`);
    }

    console.log(`Performance metrics:
      - Execution time: ${executionTime.toFixed(2)}ms
      - Memory delta: ${(memoryDelta / 1024 / 1024).toFixed(2)}MB`);

    return result;
  }
}

// コマンドビルダー（Fluent Interface）
class CommandBuilder<T> {
  private command: Command<T>;

  constructor(baseCommand: Command<T>) {
    this.command = baseCommand;
  }

  withLogging(): this {
    this.command = new LoggingDecorator(this.command);
    return this;
  }

  withCaching(cacheKey: string, ttl?: number): this {
    this.command = new CachingDecorator(this.command, cacheKey, ttl);
    return this;
  }

  withRetry(maxRetries?: number, retryDelay?: number): this {
    this.command = new RetryDecorator(this.command, maxRetries, retryDelay);
    return this;
  }

  withValidation(
    validator: (command: Command<T>) => boolean,
    errorMessage?: string
  ): this {
    this.command = new ValidationDecorator(
      this.command,
      validator,
      errorMessage
    );
    return this;
  }

  withPerformanceMonitoring(threshold?: number): this {
    this.command = new PerformanceMonitoringDecorator(this.command, threshold);
    return this;
  }

  build(): Command<T> {
    return this.command;
  }
}

// 使用例
const enhancedCommand = new CommandBuilder(
  new DatabaseQueryCommand("SELECT * FROM users")
)
  .withLogging()
  .withCaching("users-query", 30000)
  .withRetry(3, 500)
  .withPerformanceMonitoring(2000)
  .withValidation(
    () => true, // バリデーションロジック
    "Invalid database query"
  )
  .build();

// コマンド実行
enhancedCommand
  .execute()
  .then((result) => console.log("Result:", result))
  .catch((error) => console.error("Error:", error));
```

---

## 🔄 LSP（リスコフの置換原則）実装例

### Level 1: 基礎実装

#### ❌ LSP 違反の例

```typescript
// 💩 LSP違反: 派生クラスで前提条件を強化
class Bird {
  fly(): void {
    console.log("Flying...");
  }

  makeSound(): void {
    console.log("Chirp chirp");
  }
}

class Sparrow extends Bird {
  fly(): void {
    console.log("Sparrow is flying");
  }
}

class Penguin extends Bird {
  fly(): void {
    // LSP違反: ペンギンは飛べないのに例外を投げる
    throw new Error("Penguins cannot fly!");
  }
}

// 使用側のコード（LSP違反により実行時エラーが発生）
function makeBirdFly(bird: Bird): void {
  bird.fly(); // Penguinが渡されると例外が発生
}
```

#### ✅ LSP 準拠の例

```typescript
// ✅ LSP準拠: 適切な抽象化により置換可能性を保証

abstract class Bird {
  abstract makeSound(): void;

  // 共通の行動
  eat(): void {
    console.log("Eating...");
  }
}

// 飛べる鳥の抽象化
abstract class FlyingBird extends Bird {
  abstract fly(): void;
}

// 飛べない鳥の抽象化
abstract class FlightlessBird extends Bird {
  walk(): void {
    console.log("Walking...");
  }
}

// 具体的な実装
class Sparrow extends FlyingBird {
  fly(): void {
    console.log("Sparrow is flying");
  }

  makeSound(): void {
    console.log("Chirp chirp");
  }
}

class Eagle extends FlyingBird {
  fly(): void {
    console.log("Eagle is soaring high");
  }

  makeSound(): void {
    console.log("Screech!");
  }
}

class Penguin extends FlightlessBird {
  makeSound(): void {
    console.log("Honk honk");
  }

  swim(): void {
    console.log("Penguin is swimming");
  }
}

// 使用側のコード（LSP準拠）
function makeFlyingBirdFly(bird: FlyingBird): void {
  bird.fly(); // 全ての FlyingBird で正常に動作
}

function makeBirdSound(bird: Bird): void {
  bird.makeSound(); // 全ての Bird で正常に動作
}
```

### Level 2: 型安全な実装

```typescript
// 🎯 TypeScript型システムを活用したLSP実装

// 図形の基本契約
interface ShapeContract {
  readonly area: number;
  readonly perimeter: number;
  isValid(): boolean;
}

// 基底クラス
abstract class Shape implements ShapeContract {
  abstract get area(): number;
  abstract get perimeter(): number;

  // 基底クラスの不変条件
  isValid(): boolean {
    return this.area >= 0 && this.perimeter >= 0;
  }

  // テンプレートメソッド
  getInfo(): string {
    return `Area: ${this.area}, Perimeter: ${this.perimeter}`;
  }
}

// 四角形クラス（LSP準拠）
class Rectangle extends Shape {
  constructor(protected width: number, protected height: number) {
    super();
    if (width < 0 || height < 0) {
      throw new Error("Width and height must be non-negative");
    }
  }

  get area(): number {
    return this.width * this.height;
  }

  get perimeter(): number {
    return 2 * (this.width + this.height);
  }

  // 事後条件を満たす（面積は幅×高さ）
  isValid(): boolean {
    return super.isValid() && this.width >= 0 && this.height >= 0;
  }
}

// 正方形クラス（LSP準拠の慎重な設計）
class Square extends Shape {
  constructor(private side: number) {
    super();
    if (side < 0) {
      throw new Error("Side must be non-negative");
    }
  }

  get area(): number {
    return this.side * this.side;
  }

  get perimeter(): number {
    return 4 * this.side;
  }

  getSide(): number {
    return this.side;
  }
}

// 円クラス
class Circle extends Shape {
  constructor(private radius: number) {
    super();
    if (radius < 0) {
      throw new Error("Radius must be non-negative");
    }
  }

  get area(): number {
    return Math.PI * this.radius * this.radius;
  }

  get perimeter(): number {
    return 2 * Math.PI * this.radius;
  }
}

// LSP準拠の使用例
function calculateShapeArea(shapes: Shape[]): number {
  return shapes.reduce((total, shape) => {
    // 全ての Shape で正常に動作（LSP準拠）
    if (!shape.isValid()) {
      throw new Error("Invalid shape detected");
    }
    return total + shape.area;
  }, 0);
}

// 型安全な形状ファクトリー
type ShapeType = "rectangle" | "square" | "circle";

interface ShapeConfig {
  rectangle: { width: number; height: number };
  square: { side: number };
  circle: { radius: number };
}

class ShapeFactory {
  static create<T extends ShapeType>(type: T, config: ShapeConfig[T]): Shape {
    switch (type) {
      case "rectangle":
        const rectConfig = config as ShapeConfig["rectangle"];
        return new Rectangle(rectConfig.width, rectConfig.height);
      case "square":
        const squareConfig = config as ShapeConfig["square"];
        return new Square(squareConfig.side);
      case "circle":
        const circleConfig = config as ShapeConfig["circle"];
        return new Circle(circleConfig.radius);
      default:
        throw new Error(`Unknown shape type: ${type}`);
    }
  }
}
```

### Level 3: 実践的実装

```typescript
// 🚀 実務レベルのLSP実装（Repository Pattern）

// 基本的なエンティティ契約
interface Entity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

// リポジトリの基本契約
interface Repository<T extends Entity> {
  findById(id: string): Promise<T | null>;
  findAll(): Promise<T[]>;
  save(entity: T): Promise<T>;
  delete(id: string): Promise<boolean>;
  count(): Promise<number>;
}

// 基底リポジトリクラス
abstract class BaseRepository<T extends Entity> implements Repository<T> {
  abstract findById(id: string): Promise<T | null>;
  abstract findAll(): Promise<T[]>;
  abstract save(entity: T): Promise<T>;
  abstract delete(id: string): Promise<boolean>;

  async count(): Promise<number> {
    const entities = await this.findAll();
    return entities.length;
  }

  // 共通の検証ロジック
  protected validateEntity(entity: T): void {
    if (!entity.id) {
      throw new Error("Entity must have an ID");
    }
    if (!entity.createdAt) {
      throw new Error("Entity must have a creation date");
    }
  }
}

// ユーザーエンティティ
interface User extends Entity {
  name: string;
  email: string;
  isActive: boolean;
}

// ユーザーリポジトリ（LSP準拠の実装）
class UserRepository extends BaseRepository<User> {
  private users: User[] = [];

  async findById(id: string): Promise<User | null> {
    return this.users.find((user) => user.id === id) || null;
  }

  async findAll(): Promise<User[]> {
    return [...this.users];
  }

  async save(user: User): Promise<User> {
    this.validateEntity(user);
    this.validateUser(user); // 追加のバリデーション

    const existingIndex = this.users.findIndex((u) => u.id === user.id);
    const now = new Date();

    if (existingIndex >= 0) {
      // 更新
      this.users[existingIndex] = { ...user, updatedAt: now };
      return this.users[existingIndex];
    } else {
      // 新規作成
      const newUser = { ...user, createdAt: now, updatedAt: now };
      this.users.push(newUser);
      return newUser;
    }
  }

  async delete(id: string): Promise<boolean> {
    const initialLength = this.users.length;
    this.users = this.users.filter((user) => user.id !== id);
    return this.users.length < initialLength;
  }

  // ユーザー固有のメソッド
  async findByEmail(email: string): Promise<User | null> {
    return this.users.find((user) => user.email === email) || null;
  }

  async findActiveUsers(): Promise<User[]> {
    return this.users.filter((user) => user.isActive);
  }

  private validateUser(user: User): void {
    if (!user.name || user.name.trim().length === 0) {
      throw new Error("User name is required");
    }
    if (!user.email || !user.email.includes("@")) {
      throw new Error("Valid email is required");
    }
  }
}

// 商品エンティティ
interface Product extends Entity {
  name: string;
  price: number;
  category: string;
  inStock: boolean;
}

// 商品リポジトリ（LSP準拠の実装）
class ProductRepository extends BaseRepository<Product> {
  private products: Product[] = [];

  async findById(id: string): Promise<Product | null> {
    return this.products.find((product) => product.id === id) || null;
  }

  async findAll(): Promise<Product[]> {
    return [...this.products];
  }

  async save(product: Product): Promise<Product> {
    this.validateEntity(product);
    this.validateProduct(product); // 追加のバリデーション

    const existingIndex = this.products.findIndex((p) => p.id === product.id);
    const now = new Date();

    if (existingIndex >= 0) {
      // 更新
      this.products[existingIndex] = { ...product, updatedAt: now };
      return this.products[existingIndex];
    } else {
      // 新規作成
      const newProduct = { ...product, createdAt: now, updatedAt: now };
      this.products.push(newProduct);
      return newProduct;
    }
  }

  async delete(id: string): Promise<boolean> {
    const initialLength = this.products.length;
    this.products = this.products.filter((product) => product.id !== id);
    return this.products.length < initialLength;
  }

  // 商品固有のメソッド
  async findByCategory(category: string): Promise<Product[]> {
    return this.products.filter((product) => product.category === category);
  }

  async findInStockProducts(): Promise<Product[]> {
    return this.products.filter((product) => product.inStock);
  }

  private validateProduct(product: Product): void {
    if (!product.name || product.name.trim().length === 0) {
      throw new Error("Product name is required");
    }
    if (product.price < 0) {
      throw new Error("Product price must be non-negative");
    }
  }
}

// LSP準拠のサービスクラス
class EntityService<T extends Entity> {
  constructor(private repository: Repository<T>) {}

  // 全てのRepository実装で正常に動作（LSP準拠）
  async getEntityCount(): Promise<number> {
    return await this.repository.count();
  }

  async getAllEntities(): Promise<T[]> {
    return await this.repository.findAll();
  }

  async saveEntity(entity: T): Promise<T> {
    return await this.repository.save(entity);
  }

  async deleteEntity(id: string): Promise<boolean> {
    return await this.repository.delete(id);
  }
}

// 使用例（LSP準拠）
const userService = new EntityService(new UserRepository());
const productService = new EntityService(new ProductRepository());

// どちらのサービスでも同じインターフェースで操作可能
Promise.all([
  userService.getEntityCount(),
  productService.getEntityCount(),
]).then(([userCount, productCount]) => {
  console.log(`Users: ${userCount}, Products: ${productCount}`);
});
```

### Level 4: 高度な実装

```typescript
// ⚡ 高度なLSP実装（State Pattern + Template Method）

// ステートの基本契約
interface OrderState {
  readonly name: string;
  canTransitionTo(nextState: OrderState): boolean;
  handle(context: OrderContext): Promise<void>;
}

// 注文コンテキスト
interface OrderContext {
  readonly orderId: string;
  readonly amount: number;
  readonly customerId: string;
  setState(state: OrderState): void;
  getState(): OrderState;
  notifyCustomer(message: string): Promise<void>;
  processPayment(): Promise<boolean>;
  shipOrder(): Promise<boolean>;
  cancelOrder(): Promise<void>;
}

// 基底ステートクラス（Template Method + LSP）
abstract class BaseOrderState implements OrderState {
  abstract readonly name: string;

  // テンプレートメソッド（LSP準拠の骨格）
  async handle(context: OrderContext): Promise<void> {
    console.log(`Handling order ${context.orderId} in ${this.name} state`);

    // 前処理（派生クラスでオーバーライド可能）
    await this.beforeHandle(context);

    // メイン処理（派生クラスで実装必須）
    await this.doHandle(context);

    // 後処理（派生クラスでオーバーライド可能）
    await this.afterHandle(context);
  }

  // LSP準拠: 派生クラスで事前条件を強化してはならない
  canTransitionTo(nextState: OrderState): boolean {
    return this.getAllowedTransitions().includes(nextState.name);
  }

  // フックメソッド（LSP準拠のデフォルト実装）
  protected async beforeHandle(context: OrderContext): Promise<void> {
    // デフォルトでは何もしない（派生クラスで必要に応じて実装）
  }

  protected abstract doHandle(context: OrderContext): Promise<void>;

  protected async afterHandle(context: OrderContext): Promise<void> {
    // デフォルトでは何もしない（派生クラスで必要に応じて実装）
  }

  protected abstract getAllowedTransitions(): string[];
}

// 具体的なステート実装（全てLSP準拠）

class PendingOrderState extends BaseOrderState {
  readonly name = "Pending";

  protected async doHandle(context: OrderContext): Promise<void> {
    console.log("Processing pending order");
    // 注文確認処理
    await context.notifyCustomer("Your order has been confirmed");
    context.setState(new ConfirmedOrderState());
  }

  protected getAllowedTransitions(): string[] {
    return ["Confirmed", "Cancelled"];
  }
}

class ConfirmedOrderState extends BaseOrderState {
  readonly name = "Confirmed";

  protected async beforeHandle(context: OrderContext): Promise<void> {
    console.log("Validating payment information");
  }

  protected async doHandle(context: OrderContext): Promise<void> {
    console.log("Processing payment");
    const paymentSuccess = await context.processPayment();

    if (paymentSuccess) {
      context.setState(new PaidOrderState());
    } else {
      context.setState(new PaymentFailedOrderState());
    }
  }

  protected async afterHandle(context: OrderContext): Promise<void> {
    await context.notifyCustomer("Payment processing completed");
  }

  protected getAllowedTransitions(): string[] {
    return ["Paid", "PaymentFailed", "Cancelled"];
  }
}

class PaidOrderState extends BaseOrderState {
  readonly name = "Paid";

  protected async doHandle(context: OrderContext): Promise<void> {
    console.log("Preparing order for shipment");
    await context.notifyCustomer("Your order is being prepared for shipment");
    context.setState(new ShippingOrderState());
  }

  protected getAllowedTransitions(): string[] {
    return ["Shipping", "Cancelled"];
  }
}

class ShippingOrderState extends BaseOrderState {
  readonly name = "Shipping";

  protected async doHandle(context: OrderContext): Promise<void> {
    console.log("Shipping order");
    const shipmentSuccess = await context.shipOrder();

    if (shipmentSuccess) {
      context.setState(new DeliveredOrderState());
    } else {
      context.setState(new ShippingFailedOrderState());
    }
  }

  protected getAllowedTransitions(): string[] {
    return ["Delivered", "ShippingFailed"];
  }
}

class DeliveredOrderState extends BaseOrderState {
  readonly name = "Delivered";

  protected async doHandle(context: OrderContext): Promise<void> {
    console.log("Order delivered successfully");
    await context.notifyCustomer("Your order has been delivered");
  }

  protected getAllowedTransitions(): string[] {
    return []; // 最終状態
  }
}

class CancelledOrderState extends BaseOrderState {
  readonly name = "Cancelled";

  protected async doHandle(context: OrderContext): Promise<void> {
    console.log("Processing order cancellation");
    await context.cancelOrder();
    await context.notifyCustomer("Your order has been cancelled");
  }

  protected getAllowedTransitions(): string[] {
    return []; // 最終状態
  }
}

class PaymentFailedOrderState extends BaseOrderState {
  readonly name = "PaymentFailed";

  protected async doHandle(context: OrderContext): Promise<void> {
    console.log("Handling payment failure");
    await context.notifyCustomer(
      "Payment failed. Please update your payment information"
    );
    context.setState(new ConfirmedOrderState()); // 支払い再試行のため
  }

  protected getAllowedTransitions(): string[] {
    return ["Confirmed", "Cancelled"];
  }
}

class ShippingFailedOrderState extends BaseOrderState {
  readonly name = "ShippingFailed";

  protected async doHandle(context: OrderContext): Promise<void> {
    console.log("Handling shipping failure");
    await context.notifyCustomer("Shipping failed. We will retry delivery");
    context.setState(new ShippingOrderState()); // 配送再試行のため
  }

  protected getAllowedTransitions(): string[] {
    return ["Shipping", "Cancelled"];
  }
}

// コンテキスト実装
class Order implements OrderContext {
  private state: OrderState;

  constructor(
    public readonly orderId: string,
    public readonly amount: number,
    public readonly customerId: string
  ) {
    this.state = new PendingOrderState();
  }

  setState(state: OrderState): void {
    if (!this.state.canTransitionTo(state)) {
      throw new Error(
        `Invalid state transition from ${this.state.name} to ${state.name}`
      );
    }
    console.log(`Order ${this.orderId}: ${this.state.name} -> ${state.name}`);
    this.state = state;
  }

  getState(): OrderState {
    return this.state;
  }

  async processOrder(): Promise<void> {
    await this.state.handle(this);
  }

  async notifyCustomer(message: string): Promise<void> {
    console.log(`Notification to customer ${this.customerId}: ${message}`);
  }

  async processPayment(): Promise<boolean> {
    console.log(`Processing payment of $${this.amount}`);
    return Math.random() > 0.1; // 90%成功率
  }

  async shipOrder(): Promise<boolean> {
    console.log("Arranging shipment");
    return Math.random() > 0.05; // 95%成功率
  }

  async cancelOrder(): Promise<void> {
    console.log("Cancelling order and processing refund if necessary");
  }
}

// 使用例（全ての状態でLSP準拠）
const order = new Order("ORD-001", 99.99, "CUST-123");

async function processOrderWorkflow() {
  try {
    while (order.getState().getAllowedTransitions().length > 0) {
      await order.processOrder();
      await new Promise((resolve) => setTimeout(resolve, 1000)); // 1秒待機
    }
    console.log(
      `Order ${order.orderId} completed in ${order.getState().name} state`
    );
  } catch (error) {
    console.error("Order processing failed:", error);
  }
}
```

---

## 🗒️ 実践コード例の活用方法

### 📚 学習段階別活用法

#### **Level 1 → Level 2**: 基礎から型安全へ

1. Level 1 のコードを理解する
2. TypeScript 型システムの利点を確認
3. Level 2 のコードで型安全性の価値を実感

#### **Level 2 → Level 3**: 型安全から実践へ

1. エラーハンドリング・バリデーションの追加
2. 実務で遭遇する複雑性の対応
3. 保守性・拡張性の向上

#### **Level 3 → Level 4**: 実践から上級パターンへ

1. デザインパターンの組み合わせ
2. アーキテクチャレベルの考慮
3. パフォーマンス・スケーラビリティの向上

### 🔍 コード読解のコツ

#### **理解すべきポイント**

1. **なぜこの設計にしたのか**（設計意図）
2. **他の実装方法との比較**（代替案検討）
3. **実際の使用場面**（適用シーン）
4. **拡張・変更時の影響**（保守性評価）

#### **実践的な学習方法**

1. **コピー&ペースト後に改造**: 自分なりのバリエーションを試す
2. **他の原則との組み合わせ**: 複数原則の同時適用
3. **実際のプロジェクトに適用**: 学習内容の実践活用
4. **チームメンバーと議論**: 多様な視点からの検証

---

**🌟 重要**: これらのコード例は**理解のための手段**です。暗記ではなく、**設計思想と実装パターンの体得**を目指してください！
