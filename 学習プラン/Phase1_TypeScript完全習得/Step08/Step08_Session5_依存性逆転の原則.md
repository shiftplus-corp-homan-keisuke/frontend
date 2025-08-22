````markdown
# Session5: 依存性逆転の原則（DIP）マスター（45 分）

> 💡 **対象**: Session4 完了者（インターフェース分離の原則理解済み）
> 🎯 **形式**: 講師サポート付き学習
> ⏰ **時間**: 45 分（実装重視）

## 📅 セッション概要

**学習目標**:

- [ ] 依存性逆転の原則の深い理解と実践的適用
- [ ] 依存性注入（DI）パターンの完全習得
- [ ] 抽象に依存する設計の実践技法
- [ ] TypeScript での高度な DI 実装と SOLID 統合

**前提知識**:

- Session0-4 の内容（SOLID 原則全体、SRP、OCP、LSP、ISP）
- TypeScript のインターフェース、抽象クラス、ジェネリクスの深い理解
- 依存関係とカップリングの概念

---

## ⏰ 詳細タイムテーブル

| 時間         | 内容                           | 講師の役割             | 学習者の活動   | 成果物              |
| ------------ | ------------------------------ | ---------------------- | -------------- | ------------------- |
| **0-5 分**   | DIP 核心思想とパラダイム理解   | 原理説明・実例紹介     | 聞く・質問     | 概念理解確認        |
| **5-20 分**  | 依存性注入実装パターン実習     | 実演・個別指導         | ハンズオン     | DI 実装パターン習得 |
| **20-35 分** | 実践的 DI コンテナ設計         | コードレビュー         | 問題解決・実装 | 高度な DI 設計      |
| **35-40 分** | SOLID 統合とアーキテクチャ設計 | 巡回サポート           | 個人作業       | 総合的設計実践      |
| **40-45 分** | 総合振り返りと学習成果確認     | まとめ・フィードバック | 質問・確認     | SOLID 完全習得確認  |

---

## 📚 学習内容

### Section 1: 依存性逆転の原則の深い理解

> 📚 **関連資料**: [専門用語集 - DIP 詳細](./Step08_補足_専門用語集.md#DIP詳細) | [実践コード例 - DI 設計パターン](./Step08_補足_実践コード例.md#DI設計パターン)

#### 🔍 DIP の核心思想：パラダイムシフト

**💡 身近な例で理解する「逆転」の意味**

電気製品とコンセントの関係：

🔌 **従来の依存関係（DIP 違反）**

```
テレビ → 専用電源ケーブル → 専用コンセント
エアコン → 専用電源ケーブル → 専用コンセント
冷蔵庫 → 専用電源ケーブル → 専用コンセント

問題：
- 各製品が特定のコンセントに依存
- コンセントが変わると製品も変更が必要
- 拡張性・互換性が低い
```

🔌 **依存性逆転後（DIP 準拠）**

```
テレビ → 標準プラグ ← 標準コンセント規格
エアコン → 標準プラグ ← 標準コンセント規格
冷蔵庫 → 標準プラグ ← 標準コンセント規格

利点：
- 製品は抽象的な「標準規格」に依存
- コンセントの実装が変わっても製品は変更不要
- 新しい電源方式も規格に準拠すれば互換性維持
```

**🔍 プログラムでの DIP の定義**

ロバート・C・マーティンによる定義：

> **A. 上位モジュールは下位モジュールに依存してはならない。どちらも抽象に依存すべきである。** > **B. 抽象は実装の詳細に依存してはならない。実装の詳細が抽象に依存すべきである。**

**従来の依存関係 vs 逆転後の依存関係**

```typescript
// ❌ DIP違反：上位モジュールが下位モジュールに直接依存
class EmailService {
  sendEmail(to: string, message: string): void {
    console.log(`Sending email to ${to}: ${message}`);
  }
}

class SMSService {
  sendSMS(to: string, message: string): void {
    console.log(`Sending SMS to ${to}: ${message}`);
  }
}

class NotificationManager {
  private emailService: EmailService; // 具体的な実装に依存 ❌
  private smsService: SMSService; // 具体的な実装に依存 ❌

  constructor() {
    this.emailService = new EmailService(); // ハードコーディング ❌
    this.smsService = new SMSService(); // ハードコーディング ❌
  }

  sendNotification(to: string, message: string, type: "email" | "sms"): void {
    if (type === "email") {
      this.emailService.sendEmail(to, message); // 具体的な実装を呼び出し ❌
    } else {
      this.smsService.sendSMS(to, message); // 具体的な実装を呼び出し ❌
    }
  }
}

// 問題：新しい通知方法（プッシュ通知）を追加する場合
// → NotificationManager を変更する必要がある（OCP違反も）
// → テストが困難（依存関係がハードコーディング）
// → 拡張性が低い

// ✅ DIP準拠：抽象に依存する設計
interface NotificationProvider {
  send(to: string, message: string): Promise<void>;
  getProviderName(): string;
}

class EmailProvider implements NotificationProvider {
  async send(to: string, message: string): Promise<void> {
    console.log(`Sending email to ${to}: ${message}`);
    // 実際のメール送信ロジック
  }

  getProviderName(): string {
    return "Email";
  }
}

class SMSProvider implements NotificationProvider {
  async send(to: string, message: string): Promise<void> {
    console.log(`Sending SMS to ${to}: ${message}`);
    // 実際のSMS送信ロジック
  }

  getProviderName(): string {
    return "SMS";
  }
}

class PushNotificationProvider implements NotificationProvider {
  async send(to: string, message: string): Promise<void> {
    console.log(`Sending push notification to ${to}: ${message}`);
    // 実際のプッシュ通知送信ロジック
  }

  getProviderName(): string {
    return "Push";
  }
}

class NotificationManager {
  // 抽象に依存（DIP準拠）✅
  constructor(private providers: Map<string, NotificationProvider>) {}

  async sendNotification(
    to: string,
    message: string,
    type: string
  ): Promise<void> {
    const provider = this.providers.get(type);
    if (!provider) {
      throw new Error(`Unknown notification type: ${type}`);
    }

    await provider.send(to, message); // 抽象インターフェースを通じて呼び出し ✅
  }

  // 新しいプロバイダーを動的に追加可能
  addProvider(type: string, provider: NotificationProvider): void {
    this.providers.set(type, provider);
  }

  getAvailableProviders(): string[] {
    return Array.from(this.providers.keys());
  }
}

// 使用例：依存性注入による柔軟な構成
function setupNotificationSystem(): NotificationManager {
  const providers = new Map<string, NotificationProvider>();

  // 具体的な実装を注入
  providers.set("email", new EmailProvider());
  providers.set("sms", new SMSProvider());
  providers.set("push", new PushNotificationProvider());

  return new NotificationManager(providers);
}

// テストでの活用
class MockNotificationProvider implements NotificationProvider {
  public sentMessages: Array<{ to: string; message: string }> = [];

  async send(to: string, message: string): Promise<void> {
    this.sentMessages.push({ to, message });
    console.log(`Mock: Notification sent to ${to}`);
  }

  getProviderName(): string {
    return "Mock";
  }
}

function setupTestNotificationSystem(): NotificationManager {
  const providers = new Map<string, NotificationProvider>();
  providers.set("test", new MockNotificationProvider());
  return new NotificationManager(providers);
}
```

#### 1. 依存性注入（DI）のパターン

**🎓 学習のポイント**: DIP を実現するための具体的な実装パターンを習得しましょう

**パターン 1: コンストラクタ注入**

```typescript
// 最も基本的で推奨される方法

interface Logger {
  log(level: "info" | "warn" | "error", message: string): void;
}

interface DatabaseRepository {
  save<T>(entity: T): Promise<string>;
  find<T>(id: string): Promise<T | null>;
  delete(id: string): Promise<void>;
}

interface ValidationService {
  validate<T>(data: T, rules: ValidationRule[]): ValidationResult;
}

// ビジネスロジック層：抽象に依存
class UserService {
  // コンストラクタで依存性を注入 ✅
  constructor(
    private readonly repository: DatabaseRepository,
    private readonly logger: Logger,
    private readonly validator: ValidationService
  ) {}

  async createUser(userData: UserData): Promise<string> {
    // 入力検証
    const validationResult = this.validator.validate(
      userData,
      USER_VALIDATION_RULES
    );
    if (!validationResult.isValid) {
      this.logger.log(
        "warn",
        `User validation failed: ${validationResult.errors.join(", ")}`
      );
      throw new Error("Invalid user data");
    }

    try {
      // ユーザー作成
      const userId = await this.repository.save({
        ...userData,
        id: this.generateUserId(),
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      this.logger.log("info", `User created successfully: ${userId}`);
      return userId;
    } catch (error) {
      this.logger.log("error", `Failed to create user: ${error}`);
      throw error;
    }
  }

  async getUserById(id: string): Promise<UserData | null> {
    try {
      const user = await this.repository.find<UserData>(id);
      this.logger.log("info", `User retrieved: ${id}`);
      return user;
    } catch (error) {
      this.logger.log("error", `Failed to retrieve user ${id}: ${error}`);
      throw error;
    }
  }

  async deleteUser(id: string): Promise<void> {
    try {
      await this.repository.delete(id);
      this.logger.log("info", `User deleted: ${id}`);
    } catch (error) {
      this.logger.log("error", `Failed to delete user ${id}: ${error}`);
      throw error;
    }
  }

  private generateUserId(): string {
    return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// 実装クラス：詳細を抽象に適合
class ConsoleLogger implements Logger {
  log(level: "info" | "warn" | "error", message: string): void {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${level.toUpperCase()}: ${message}`);
  }
}

class FileLogger implements Logger {
  constructor(private filePath: string) {}

  log(level: "info" | "warn" | "error", message: string): void {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${level.toUpperCase()}: ${message}\n`;
    // ファイル書き込みロジック（簡略化）
    console.log(`Writing to ${this.filePath}: ${logEntry.trim()}`);
  }
}

class MongoRepository implements DatabaseRepository {
  async save<T>(entity: T): Promise<string> {
    // MongoDB保存ロジック（簡略化）
    console.log("Saving to MongoDB:", entity);
    return `mongo_${Date.now()}`;
  }

  async find<T>(id: string): Promise<T | null> {
    // MongoDB検索ロジック（簡略化）
    console.log(`Finding in MongoDB: ${id}`);
    return null; // 実際の実装では適切なデータを返す
  }

  async delete(id: string): Promise<void> {
    // MongoDB削除ロジック（簡略化）
    console.log(`Deleting from MongoDB: ${id}`);
  }
}

class PostgreSQLRepository implements DatabaseRepository {
  async save<T>(entity: T): Promise<string> {
    // PostgreSQL保存ロジック（簡略化）
    console.log("Saving to PostgreSQL:", entity);
    return `postgres_${Date.now()}`;
  }

  async find<T>(id: string): Promise<T | null> {
    // PostgreSQL検索ロジック（簡略化）
    console.log(`Finding in PostgreSQL: ${id}`);
    return null;
  }

  async delete(id: string): Promise<void> {
    // PostgreSQL削除ロジック（簡略化）
    console.log(`Deleting from PostgreSQL: ${id}`);
  }
}

class JSONValidationService implements ValidationService {
  validate<T>(data: T, rules: ValidationRule[]): ValidationResult {
    // JSON Schema バリデーション（簡略化）
    console.log("Validating with JSON Schema:", data);
    return {
      isValid: true,
      errors: [],
      warnings: [],
    };
  }
}

// 使用例：柔軟な構成
function createProductionUserService(): UserService {
  return new UserService(
    new MongoRepository(),
    new FileLogger("/var/log/app.log"),
    new JSONValidationService()
  );
}

function createDevelopmentUserService(): UserService {
  return new UserService(
    new PostgreSQLRepository(),
    new ConsoleLogger(),
    new JSONValidationService()
  );
}

function createTestUserService(): UserService {
  return new UserService(
    new MockRepository(),
    new MockLogger(),
    new MockValidationService()
  );
}

// モック実装（テスト用）
class MockRepository implements DatabaseRepository {
  private data: Map<string, any> = new Map();

  async save<T>(entity: any): Promise<string> {
    const id = `mock_${Date.now()}`;
    this.data.set(id, { ...entity, id });
    return id;
  }

  async find<T>(id: string): Promise<T | null> {
    return this.data.get(id) || null;
  }

  async delete(id: string): Promise<void> {
    this.data.delete(id);
  }
}

class MockLogger implements Logger {
  public logs: Array<{ level: string; message: string; timestamp: Date }> = [];

  log(level: "info" | "warn" | "error", message: string): void {
    this.logs.push({ level, message, timestamp: new Date() });
  }
}

class MockValidationService implements ValidationService {
  validate<T>(data: T, rules: ValidationRule[]): ValidationResult {
    return {
      isValid: true,
      errors: [],
      warnings: [],
    };
  }
}

// 型定義
interface UserData {
  id?: string;
  name: string;
  email: string;
  age: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ValidationRule {
  field: string;
  rule: string;
  params?: any;
}

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

const USER_VALIDATION_RULES: ValidationRule[] = [
  { field: "name", rule: "required" },
  { field: "name", rule: "minLength", params: { min: 2 } },
  { field: "email", rule: "required" },
  { field: "email", rule: "email" },
  { field: "age", rule: "required" },
  { field: "age", rule: "min", params: { min: 0 } },
];
```

**パターン 2: セッター注入**

```typescript
// 特定の状況で有用（オプション依存性など）

class ReportGenerator {
  private formatter?: ReportFormatter;
  private exporter?: ReportExporter;
  private notifier?: NotificationService;

  // セッターメソッドで依存性を注入
  setFormatter(formatter: ReportFormatter): void {
    this.formatter = formatter;
  }

  setExporter(exporter: ReportExporter): void {
    this.exporter = exporter;
  }

  setNotifier(notifier: NotificationService): void {
    this.notifier = notifier;
  }

  async generateReport(data: ReportData): Promise<Report> {
    // デフォルトのフォーマッターを使用
    const formatter = this.formatter || new DefaultReportFormatter();
    const formattedReport = await formatter.format(data);

    // オプション：レポートをエクスポート
    if (this.exporter) {
      await this.exporter.export(formattedReport);
    }

    // オプション：完了通知
    if (this.notifier) {
      await this.notifier.notify("Report generated successfully");
    }

    return formattedReport;
  }
}

interface ReportFormatter {
  format(data: ReportData): Promise<Report>;
}

interface ReportExporter {
  export(report: Report): Promise<void>;
}

interface NotificationService {
  notify(message: string): Promise<void>;
}

// 使用例：段階的な構成
const reportGenerator = new ReportGenerator();
reportGenerator.setFormatter(new PDFReportFormatter());
reportGenerator.setExporter(new EmailReportExporter());
reportGenerator.setNotifier(new SlackNotificationService());
```

**パターン 3: インターフェース注入**

```typescript
// 依存性注入を明示的にインターフェースで定義

interface DatabaseInjectable {
  injectDatabase(database: DatabaseConnection): void;
}

interface LoggerInjectable {
  injectLogger(logger: Logger): void;
}

interface CacheInjectable {
  injectCache(cache: CacheService): void;
}

class ProductService
  implements DatabaseInjectable, LoggerInjectable, CacheInjectable
{
  private database!: DatabaseConnection;
  private logger!: Logger;
  private cache?: CacheService;

  injectDatabase(database: DatabaseConnection): void {
    this.database = database;
  }

  injectLogger(logger: Logger): void {
    this.logger = logger;
  }

  injectCache(cache: CacheService): void {
    this.cache = cache;
  }

  async getProduct(id: string): Promise<Product | null> {
    // キャッシュチェック
    if (this.cache) {
      const cached = await this.cache.get(`product:${id}`);
      if (cached) {
        this.logger.log("info", `Product retrieved from cache: ${id}`);
        return cached;
      }
    }

    // データベース検索
    const product = await this.database.query(
      "SELECT * FROM products WHERE id = ?",
      [id]
    );

    // キャッシュに保存
    if (this.cache && product) {
      await this.cache.set(`product:${id}`, product, 3600); // 1時間キャッシュ
    }

    this.logger.log("info", `Product retrieved from database: ${id}`);
    return product;
  }
}

// 依存性注入器
class DependencyInjector {
  inject(target: any, dependencies: Map<string, any>): void {
    // データベース注入
    if (this.implementsInterface(target, "injectDatabase")) {
      const database = dependencies.get("database");
      if (database) {
        (target as DatabaseInjectable).injectDatabase(database);
      }
    }

    // ログ注入
    if (this.implementsInterface(target, "injectLogger")) {
      const logger = dependencies.get("logger");
      if (logger) {
        (target as LoggerInjectable).injectLogger(logger);
      }
    }

    // キャッシュ注入
    if (this.implementsInterface(target, "injectCache")) {
      const cache = dependencies.get("cache");
      if (cache) {
        (target as CacheInjectable).injectCache(cache);
      }
    }
  }

  private implementsInterface(obj: any, methodName: string): boolean {
    return typeof obj[methodName] === "function";
  }
}
```

#### 2. 高度な DI コンテナの実装

**🎓 学習のポイント**: 実用的な DI コンテナを設計・実装する方法を学びましょう

```typescript
// 高機能DIコンテナの実装

type ServiceFactory<T = any> = (...args: any[]) => T;
type ServiceLifetime = "singleton" | "scoped" | "transient";

interface ServiceDescriptor<T = any> {
  token: string | symbol | Function;
  factory: ServiceFactory<T>;
  lifetime: ServiceLifetime;
  dependencies?: (string | symbol | Function)[];
}

class DIContainer {
  private services: Map<string | symbol | Function, ServiceDescriptor> =
    new Map();
  private singletons: Map<string | symbol | Function, any> = new Map();
  private scopedInstances: Map<string | symbol | Function, any> = new Map();
  private isBuilding: Set<string | symbol | Function> = new Set();

  // サービス登録
  register<T>(descriptor: ServiceDescriptor<T>): void {
    this.services.set(descriptor.token, descriptor);
  }

  // シングルトン登録（簡易版）
  registerSingleton<T>(
    token: string | symbol | Function,
    factory: ServiceFactory<T>
  ): void {
    this.register({
      token,
      factory,
      lifetime: "singleton",
    });
  }

  // トランジェント登録（簡易版）
  registerTransient<T>(
    token: string | symbol | Function,
    factory: ServiceFactory<T>
  ): void {
    this.register({
      token,
      factory,
      lifetime: "transient",
    });
  }

  // インターフェース実装の登録
  registerImplementation<T>(
    interfaceToken: string | symbol,
    implementationClass: new (...args: any[]) => T,
    lifetime: ServiceLifetime = "singleton",
    dependencies: (string | symbol | Function)[] = []
  ): void {
    this.register({
      token: interfaceToken,
      factory: (...args) => new implementationClass(...args),
      lifetime,
      dependencies,
    });
  }

  // サービス解決
  resolve<T>(token: string | symbol | Function): T {
    // 循環依存チェック
    if (this.isBuilding.has(token)) {
      const buildingTokens = Array.from(this.isBuilding)
        .map((t) => t.toString())
        .join(" -> ");
      throw new Error(
        `Circular dependency detected: ${buildingTokens} -> ${token.toString()}`
      );
    }

    const descriptor = this.services.get(token);
    if (!descriptor) {
      throw new Error(`Service not found: ${token.toString()}`);
    }

    // ライフタイム別の解決
    switch (descriptor.lifetime) {
      case "singleton":
        return this.resolveSingleton(token, descriptor);
      case "scoped":
        return this.resolveScoped(token, descriptor);
      case "transient":
        return this.resolveTransient(descriptor);
      default:
        throw new Error(`Unknown lifetime: ${descriptor.lifetime}`);
    }
  }

  // オプション解決（サービスが存在しない場合はundefinedを返す）
  resolveOptional<T>(token: string | symbol | Function): T | undefined {
    try {
      return this.resolve<T>(token);
    } catch {
      return undefined;
    }
  }

  // 複数サービス解決
  resolveAll<T>(token: string | symbol | Function): T[] {
    const services: T[] = [];
    this.services.forEach((descriptor, key) => {
      if (key.toString().startsWith(token.toString())) {
        services.push(this.resolve<T>(key));
      }
    });
    return services;
  }

  private resolveSingleton<T>(
    token: string | symbol | Function,
    descriptor: ServiceDescriptor<T>
  ): T {
    if (this.singletons.has(token)) {
      return this.singletons.get(token);
    }

    const instance = this.createInstance(descriptor);
    this.singletons.set(token, instance);
    return instance;
  }

  private resolveScoped<T>(
    token: string | symbol | Function,
    descriptor: ServiceDescriptor<T>
  ): T {
    if (this.scopedInstances.has(token)) {
      return this.scopedInstances.get(token);
    }

    const instance = this.createInstance(descriptor);
    this.scopedInstances.set(token, instance);
    return instance;
  }

  private resolveTransient<T>(descriptor: ServiceDescriptor<T>): T {
    return this.createInstance(descriptor);
  }

  private createInstance<T>(descriptor: ServiceDescriptor<T>): T {
    this.isBuilding.add(descriptor.token);

    try {
      // 依存関係を解決
      const dependencies =
        descriptor.dependencies?.map((dep) => this.resolve(dep)) || [];

      // インスタンス作成
      const instance = descriptor.factory(...dependencies);

      this.isBuilding.delete(descriptor.token);
      return instance;
    } catch (error) {
      this.isBuilding.delete(descriptor.token);
      throw error;
    }
  }

  // スコープクリア（リクエスト終了時など）
  clearScope(): void {
    this.scopedInstances.clear();
  }

  // デバッグ用：登録されたサービス一覧
  getRegisteredServices(): string[] {
    return Array.from(this.services.keys()).map((token) => token.toString());
  }
}

// 実用例：Webアプリケーションでの使用
const container = new DIContainer();

// インターフェース定義
const IUserRepository = Symbol("IUserRepository");
const IEmailService = Symbol("IEmailService");
const ILogger = Symbol("ILogger");
const IAuthService = Symbol("IAuthService");

// 実装クラス
class UserRepository {
  constructor(private logger: Logger) {}

  async findById(id: string): Promise<User | null> {
    this.logger.log("info", `Finding user by ID: ${id}`);
    return { id, name: "John Doe", email: "john@example.com" };
  }

  async save(user: User): Promise<void> {
    this.logger.log("info", `Saving user: ${user.id}`);
  }
}

class EmailService {
  constructor(private logger: Logger) {}

  async sendEmail(to: string, subject: string, body: string): Promise<void> {
    this.logger.log("info", `Sending email to ${to}: ${subject}`);
  }
}

class AuthService {
  constructor(
    private userRepository: UserRepository,
    private emailService: EmailService,
    private logger: Logger
  ) {}

  async login(email: string, password: string): Promise<User | null> {
    this.logger.log("info", `Login attempt for: ${email}`);
    // 認証ロジック
    return await this.userRepository.findById("user-123");
  }

  async sendPasswordResetEmail(email: string): Promise<void> {
    this.logger.log("info", `Password reset requested for: ${email}`);
    await this.emailService.sendEmail(
      email,
      "Password Reset",
      "Click here to reset..."
    );
  }
}

// サービス登録
container.registerSingleton(ILogger, () => new ConsoleLogger());

container.registerImplementation(IUserRepository, UserRepository, "singleton", [
  ILogger,
]);

container.registerImplementation(IEmailService, EmailService, "singleton", [
  ILogger,
]);

container.registerImplementation(
  IAuthService,
  AuthService,
  "scoped", // リクエストスコープ
  [IUserRepository, IEmailService, ILogger]
);

// 使用例
async function handleLoginRequest(
  email: string,
  password: string
): Promise<void> {
  const authService = container.resolve<AuthService>(IAuthService);
  const user = await authService.login(email, password);

  if (user) {
    console.log(`User logged in: ${user.name}`);
  } else {
    console.log("Login failed");
  }

  // リクエスト終了時にスコープをクリア
  container.clearScope();
}

// デコレータベースの依存性注入
function Injectable(token: string | symbol) {
  return function <T extends new (...args: any[]) => any>(constructor: T) {
    // メタデータを保存
    Reflect.defineMetadata("injectable:token", token, constructor);
    return constructor;
  };
}

function Inject(token: string | symbol) {
  return function (
    target: any,
    propertyKey: string | symbol | undefined,
    parameterIndex: number
  ) {
    const existingTokens =
      Reflect.getMetadata("injectable:paramtypes", target) || [];
    existingTokens[parameterIndex] = token;
    Reflect.defineMetadata("injectable:paramtypes", existingTokens, target);
  };
}

// デコレータ使用例
@Injectable("UserController")
class UserController {
  constructor(
    @Inject(IAuthService) private authService: AuthService,
    @Inject(ILogger) private logger: Logger
  ) {}

  async login(email: string, password: string): Promise<any> {
    try {
      const user = await this.authService.login(email, password);
      return { success: true, user };
    } catch (error) {
      this.logger.log("error", `Login error: ${error}`);
      return { success: false, error: "Login failed" };
    }
  }
}

interface User {
  id: string;
  name: string;
  email: string;
}
```

### Section 2: SOLID 原則の統合とアーキテクチャ設計

#### 🔍 Clean Architecture での SOLID 実践

**🎓 学習のポイント**: SOLID 原則すべてを統合した実践的なアーキテクチャ設計を学びましょう

```typescript
// Clean Architecture + SOLID原則の実践例

// Domain Layer - ビジネスロジックの核心（依存関係なし）

// エンティティ（純粋なビジネスオブジェクト）
class User {
  constructor(
    private readonly _id: string,
    private _name: string,
    private _email: string,
    private readonly _createdAt: Date,
    private _updatedAt: Date
  ) {
    this.validateEmail(_email);
    this.validateName(_name);
  }

  get id(): string {
    return this._id;
  }
  get name(): string {
    return this._name;
  }
  get email(): string {
    return this._email;
  }
  get createdAt(): Date {
    return this._createdAt;
  }
  get updatedAt(): Date {
    return this._updatedAt;
  }

  updateName(newName: string): void {
    this.validateName(newName);
    this._name = newName;
    this._updatedAt = new Date();
  }

  updateEmail(newEmail: string): void {
    this.validateEmail(newEmail);
    this._email = newEmail;
    this._updatedAt = new Date();
  }

  private validateEmail(email: string): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error("Invalid email format");
    }
  }

  private validateName(name: string): void {
    if (!name || name.trim().length < 2) {
      throw new Error("Name must be at least 2 characters long");
    }
  }
}

// Use Cases - アプリケーションロジック（抽象に依存）

// 抽象インターフェース（DIP準拠）
interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  save(user: User): Promise<void>;
  delete(id: string): Promise<void>;
}

interface IEmailService {
  sendWelcomeEmail(user: User): Promise<void>;
  sendPasswordResetEmail(email: string): Promise<void>;
}

interface ILogger {
  info(message: string): void;
  error(message: string, error?: Error): void;
}

// Use Case実装（SRP準拠）
class CreateUserUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly emailService: IEmailService,
    private readonly logger: ILogger
  ) {}

  async execute(userData: CreateUserRequest): Promise<CreateUserResponse> {
    try {
      // 既存ユーザーチェック
      const existingUser = await this.userRepository.findByEmail(
        userData.email
      );
      if (existingUser) {
        throw new Error("User with this email already exists");
      }

      // 新しいユーザー作成
      const user = new User(
        this.generateUserId(),
        userData.name,
        userData.email,
        new Date(),
        new Date()
      );

      // 保存
      await this.userRepository.save(user);

      // ウェルカムメール送信
      await this.emailService.sendWelcomeEmail(user);

      this.logger.info(`User created successfully: ${user.id}`);

      return {
        success: true,
        userId: user.id,
        message: "User created successfully",
      };
    } catch (error) {
      this.logger.error("Failed to create user", error as Error);
      return {
        success: false,
        message:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }

  private generateUserId(): string {
    return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

class GetUserUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly logger: ILogger
  ) {}

  async execute(userId: string): Promise<GetUserResponse> {
    try {
      const user = await this.userRepository.findById(userId);

      if (!user) {
        return {
          success: false,
          message: "User not found",
        };
      }

      this.logger.info(`User retrieved successfully: ${userId}`);

      return {
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      };
    } catch (error) {
      this.logger.error(`Failed to get user: ${userId}`, error as Error);
      return {
        success: false,
        message: "Failed to retrieve user",
      };
    }
  }
}

class UpdateUserUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly logger: ILogger
  ) {}

  async execute(
    userId: string,
    updateData: UpdateUserRequest
  ): Promise<UpdateUserResponse> {
    try {
      const user = await this.userRepository.findById(userId);
      if (!user) {
        return {
          success: false,
          message: "User not found",
        };
      }

      // メールアドレスの重複チェック
      if (updateData.email && updateData.email !== user.email) {
        const existingUser = await this.userRepository.findByEmail(
          updateData.email
        );
        if (existingUser) {
          return {
            success: false,
            message: "Email already in use",
          };
        }
      }

      // ユーザー情報更新
      if (updateData.name) {
        user.updateName(updateData.name);
      }

      if (updateData.email) {
        user.updateEmail(updateData.email);
      }

      await this.userRepository.save(user);

      this.logger.info(`User updated successfully: ${userId}`);

      return {
        success: true,
        message: "User updated successfully",
      };
    } catch (error) {
      this.logger.error(`Failed to update user: ${userId}`, error as Error);
      return {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to update user",
      };
    }
  }
}

// Infrastructure Layer - 外部システムとの接続（実装詳細）

class PostgreSQLUserRepository implements IUserRepository {
  constructor(private readonly logger: ILogger) {}

  async findById(id: string): Promise<User | null> {
    this.logger.info(`Finding user by ID: ${id}`);
    // PostgreSQL実装（簡略化）
    // 実際にはSQLクエリを実行
    return null; // 実装例では null を返す
  }

  async findByEmail(email: string): Promise<User | null> {
    this.logger.info(`Finding user by email: ${email}`);
    // PostgreSQL実装（簡略化）
    return null;
  }

  async save(user: User): Promise<void> {
    this.logger.info(`Saving user: ${user.id}`);
    // PostgreSQL実装（簡略化）
  }

  async delete(id: string): Promise<void> {
    this.logger.info(`Deleting user: ${id}`);
    // PostgreSQL実装（簡略化）
  }
}

class SendGridEmailService implements IEmailService {
  constructor(private readonly logger: ILogger) {}

  async sendWelcomeEmail(user: User): Promise<void> {
    this.logger.info(`Sending welcome email to: ${user.email}`);
    // SendGrid API呼び出し（簡略化）
  }

  async sendPasswordResetEmail(email: string): Promise<void> {
    this.logger.info(`Sending password reset email to: ${email}`);
    // SendGrid API呼び出し（簡略化）
  }
}

class WinstonLogger implements ILogger {
  info(message: string): void {
    console.log(`[INFO] ${new Date().toISOString()}: ${message}`);
  }

  error(message: string, error?: Error): void {
    console.error(`[ERROR] ${new Date().toISOString()}: ${message}`);
    if (error) {
      console.error(error.stack);
    }
  }
}

// Interface Adapters Layer - コントローラーとプレゼンター

class UserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly getUserUseCase: GetUserUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly logger: ILogger
  ) {}

  async createUser(request: CreateUserRequest): Promise<any> {
    this.logger.info("Creating user via controller");
    const result = await this.createUserUseCase.execute(request);

    if (result.success) {
      return {
        status: 201,
        data: { userId: result.userId },
        message: result.message,
      };
    } else {
      return {
        status: 400,
        error: result.message,
      };
    }
  }

  async getUser(userId: string): Promise<any> {
    this.logger.info(`Getting user via controller: ${userId}`);
    const result = await this.getUserUseCase.execute(userId);

    if (result.success) {
      return {
        status: 200,
        data: result.user,
      };
    } else {
      return {
        status: 404,
        error: result.message,
      };
    }
  }

  async updateUser(
    userId: string,
    updateData: UpdateUserRequest
  ): Promise<any> {
    this.logger.info(`Updating user via controller: ${userId}`);
    const result = await this.updateUserUseCase.execute(userId, updateData);

    if (result.success) {
      return {
        status: 200,
        message: result.message,
      };
    } else {
      return {
        status: 400,
        error: result.message,
      };
    }
  }
}

// Dependency Injection Setup
class ApplicationBootstrap {
  private container: DIContainer;

  constructor() {
    this.container = new DIContainer();
    this.configureServices();
  }

  private configureServices(): void {
    // Infrastructure services
    this.container.registerSingleton("ILogger", () => new WinstonLogger());

    this.container.registerImplementation(
      "IUserRepository",
      PostgreSQLUserRepository,
      "singleton",
      ["ILogger"]
    );

    this.container.registerImplementation(
      "IEmailService",
      SendGridEmailService,
      "singleton",
      ["ILogger"]
    );

    // Use cases
    this.container.registerImplementation(
      "CreateUserUseCase",
      CreateUserUseCase,
      "transient",
      ["IUserRepository", "IEmailService", "ILogger"]
    );

    this.container.registerImplementation(
      "GetUserUseCase",
      GetUserUseCase,
      "transient",
      ["IUserRepository", "ILogger"]
    );

    this.container.registerImplementation(
      "UpdateUserUseCase",
      UpdateUserUseCase,
      "transient",
      ["IUserRepository", "ILogger"]
    );

    // Controllers
    this.container.registerImplementation(
      "UserController",
      UserController,
      "scoped",
      ["CreateUserUseCase", "GetUserUseCase", "UpdateUserUseCase", "ILogger"]
    );
  }

  getUserController(): UserController {
    return this.container.resolve<UserController>("UserController");
  }

  clearRequestScope(): void {
    this.container.clearScope();
  }
}

// 使用例
async function main() {
  const app = new ApplicationBootstrap();
  const userController = app.getUserController();

  // ユーザー作成
  const createResult = await userController.createUser({
    name: "John Doe",
    email: "john.doe@example.com",
  });
  console.log("Create result:", createResult);

  // リクエストスコープクリア
  app.clearRequestScope();
}

// 型定義
interface CreateUserRequest {
  name: string;
  email: string;
}

interface CreateUserResponse {
  success: boolean;
  userId?: string;
  message: string;
}

interface GetUserResponse {
  success: boolean;
  user?: {
    id: string;
    name: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
  };
  message?: string;
}

interface UpdateUserRequest {
  name?: string;
  email?: string;
}

interface UpdateUserResponse {
  success: boolean;
  message: string;
}

// テストでの活用
class MockUserRepository implements IUserRepository {
  private users: Map<string, User> = new Map();

  async findById(id: string): Promise<User | null> {
    return this.users.get(id) || null;
  }

  async findByEmail(email: string): Promise<User | null> {
    for (const user of this.users.values()) {
      if (user.email === email) {
        return user;
      }
    }
    return null;
  }

  async save(user: User): Promise<void> {
    this.users.set(user.id, user);
  }

  async delete(id: string): Promise<void> {
    this.users.delete(id);
  }
}

class MockEmailService implements IEmailService {
  public sentEmails: Array<{ type: string; recipient: string }> = [];

  async sendWelcomeEmail(user: User): Promise<void> {
    this.sentEmails.push({
      type: "welcome",
      recipient: user.email,
    });
  }

  async sendPasswordResetEmail(email: string): Promise<void> {
    this.sentEmails.push({
      type: "password-reset",
      recipient: email,
    });
  }
}

class MockLogger implements ILogger {
  public logs: Array<{ level: string; message: string }> = [];

  info(message: string): void {
    this.logs.push({ level: "info", message });
  }

  error(message: string, error?: Error): void {
    this.logs.push({ level: "error", message });
  }
}

// テスト用設定
function createTestApplication(): ApplicationBootstrap {
  const container = new DIContainer();

  // テスト用モック注入
  container.registerSingleton("ILogger", () => new MockLogger());
  container.registerSingleton(
    "IUserRepository",
    () => new MockUserRepository()
  );
  container.registerSingleton("IEmailService", () => new MockEmailService());

  // 他のサービスは同様に設定...

  return new ApplicationBootstrap();
}
```

---

## 🎯 総合実践練習問題（15 分）

**🎓 学習目標**: SOLID 原則すべてを統合した実践的な設計を行う

### 練習問題: オンライン書店システム（上級）

以下の要件を満たすオンライン書店システムを設計してください：

**機能要件**:

- 書籍の検索・表示・購入
- ユーザー認証・プロフィール管理
- 注文処理・在庫管理
- レビュー・評価システム
- 各種通知（メール、プッシュ等）

**技術要件**:

- SOLID 原則すべてを適用
- 依存性注入を活用
- テスタブルな設計
- 拡張可能なアーキテクチャ

**🎓 チャレンジ**: 以下の観点で設計してください：

1. 各クラスは単一責任（SRP）
2. 新機能追加時の変更最小化（OCP）
3. サブクラスでの置換可能性（LSP）
4. 適切なインターフェース分離（ISP）
5. 抽象への依存（DIP）

---

## 👨‍🏫 SOLID 原則 総合学習ポイント

### 🔄 最終復習チェック

**SOLID 原則の理解**

- [ ] SRP：各クラスが単一の責任を持つ重要性を理解している
- [ ] OCP：拡張に開放、変更に閉鎖の原則を実践できる
- [ ] LSP：サブクラスでの置換可能性を保つ設計ができる
- [ ] ISP：クライアント要求に応じたインターフェース分離ができる
- [ ] DIP：抽象に依存する設計で柔軟性を実現できる

**統合的設計能力**

- [ ] SOLID 原則相互の関連性を理解している
- [ ] 実際のプロジェクトで SOLID 原則を適用できる
- [ ] Clean Architecture との組み合わせができる
- [ ] テスタビリティを考慮した設計ができる

**実践的スキル**

- [ ] 依存性注入パターンを実装できる
- [ ] DI コンテナを活用できる
- [ ] SOLID 違反を識別・修正できる
- [ ] 段階的リファクタリング戦略を実行できる

### 🤔 最終 Q&A

**Q: SOLID 原則を完璧に守ることは現実的ですか？**
A: 完璧は目指しつつも、実用性とのバランスが重要です。プロジェクトの規模・期間・チームスキルを考慮して、段階的に適用しましょう。

**Q: SOLID 原則を学んだ後の次のステップは？**
A: デザインパターン、Clean Architecture、ドメイン駆動設計（DDD）など、より高度な設計手法を学習することをお勧めします。

**Q: 既存プロジェクトへの SOLID 適用はどう進めるべきですか？**
A: 段階的リファクタリング戦略を推奨します。まず新機能から SOLID を適用し、既存コードは必要に応じて少しずつ改善していきましょう。

---

**🎉 おめでとうございます！**
SOLID 原則の学習が完了しました。これらの原則を実践することで、保守性・拡張性・テスタビリティに優れたコードが書けるようになります。

**🌟 次のステップ**: 学んだ SOLID 原則を実際のプロジェクトで実践し、デザインパターンやアーキテクチャパターンの学習に進みましょう！

---

## 📋 Session5 完了チェックリスト（45 分版）

学習を完了する前に、以下の項目をすべてチェックしてください：

### 💡 DIP 基本理解

- [ ] 依存性逆転の原則の定義と重要性を理解している
- [ ] 抽象への依存の利点を説明できる
- [ ] 従来の依存関係との違いを理解している

### 💻 DI 実装スキル

- [ ] コンストラクタ注入を実装できる
- [ ] セッター注入とインターフェース注入を理解している
- [ ] DI コンテナの設計・実装ができる

### 🔧 高度な設計能力

- [ ] ライフサイム管理（singleton, scoped, transient）を理解している
- [ ] 循環依存の検出・回避ができる
- [ ] Clean Architecture での DI 活用ができる

### 📚 SOLID 統合理解

- [ ] 5 つの SOLID 原則すべてを理解している
- [ ] 原則間の相乗効果を理解している
- [ ] 実践的なアーキテクチャ設計ができる

### 🧪 総合実践力

- [ ] 複雑なシステムで SOLID 原則を適用できる
- [ ] テスタブルな設計を実現できる
- [ ] 段階的リファクタリング戦略を実行できる

**🎉 すべてチェックできましたか？**
SOLID 原則の学習が完了しました！実際のプロジェクトでの実践を通じて、さらにスキルを向上させていきましょう。

**⚠️ チェックできない項目がある場合**: 該当する学習内容を再度確認し、不明点は講師に質問しましょう。
````
