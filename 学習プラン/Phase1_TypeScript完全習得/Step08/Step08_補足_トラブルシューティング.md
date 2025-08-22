# Step08 補足資料：トラブルシューティング

> 💡 **目的**: SOLID 原則学習・実装時によくあるエラーと解決方法
> 🎯 **対象**: TypeScript 上級者・実際にコードを書いて学習する人
> 🔧 **活用方法**: エラー発生時の即座な問題解決・予防策として

---

## 🚨 よくあるエラーパターン

### 📊 エラー分類

エラーを以下の 4 つのカテゴリに分類して解説します：

1. **コンパイルエラー**: TypeScript 型エラー
2. **実行時エラー**: ランタイムで発生するエラー
3. **設計エラー**: SOLID 原則違反による問題
4. **パフォーマンスエラー**: 性能に関する問題

---

## 🔍 SRP（単一責任の原則）関連エラー

### エラー 1: 責任の混在による型エラー

#### **エラーメッセージ**

```
Type 'UserService' is missing the following properties
from type 'EmailService': sendEmail, validateEmailFormat
```

#### **発生するコード例**

```typescript
// 💩 問題のあるコード
interface UserService {
  createUser(name: string, email: string): User;
  validateUser(user: User): boolean;
}

interface EmailService {
  sendEmail(to: string, subject: string, body: string): void;
  validateEmailFormat(email: string): boolean;
}

// 責任が混在したクラス（型エラーの原因）
class UserManager implements UserService, EmailService {
  createUser(name: string, email: string): User {
    return new User(name, email);
  }

  validateUser(user: User): boolean {
    return user.name.length > 0;
  }

  // EmailServiceのメソッドが実装されていない → 型エラー
  // sendEmail(to: string, subject: string, body: string): void {}
  // validateEmailFormat(email: string): boolean { return true; }
}
```

#### **原因**

複数の責任を 1 つのクラスに押し込めたため、型定義が複雑になりコンパイルエラーが発生。

#### **解決方法**

```typescript
// ✅ SRP準拠の解決方法
class User {
  constructor(public readonly name: string, public readonly email: string) {}
}

class UserService {
  createUser(name: string, email: string): User {
    return new User(name, email);
  }

  validateUser(user: User): boolean {
    return user.name.length > 0 && this.isValidEmail(user.email);
  }

  private isValidEmail(email: string): boolean {
    // 簡単なバリデーション（詳細は EmailValidator に委譲）
    return email.includes("@");
  }
}

class EmailService {
  sendEmail(to: string, subject: string, body: string): void {
    console.log(`Sending email to ${to}: ${subject}`);
  }

  validateEmailFormat(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

// 責任を分離して構成
class UserManager {
  constructor(
    private userService: UserService,
    private emailService: EmailService
  ) {}

  async registerUser(name: string, email: string): Promise<User> {
    const user = this.userService.createUser(name, email);

    if (this.userService.validateUser(user)) {
      this.emailService.sendEmail(
        user.email,
        "Welcome!",
        `Hello ${user.name}, welcome to our service!`
      );
      return user;
    }

    throw new Error("Invalid user data");
  }
}
```

#### **予防策**

- 🎯 **設計前に責任を明確化**: クラスが担う責任を 1 文で説明できるか確認
- 📝 **インターフェース分離**: 大きなインターフェースは複数に分割
- 🔄 **定期的なリファクタリング**: クラスが肥大化していないかレビュー

### エラー 2: 神クラス（God Class）による循環依存

#### **エラーメッセージ**

```
Circular dependency detected: UserManager -> DatabaseManager -> UserManager
```

#### **発生するコード例**

```typescript
// 💩 循環依存を引き起こすコード
class UserManager {
  constructor(private dbManager: DatabaseManager) {}

  createUser(user: User): void {
    // バリデーション、保存、メール送信など全て担当
    this.validateUser(user);
    this.dbManager.save(user);
    this.sendWelcomeEmail(user);
  }

  validateUser(user: User): boolean {
    // 複雑なバリデーション
    return user.name.length > 0;
  }

  sendWelcomeEmail(user: User): void {
    // メール送信処理
    console.log(`Welcome email sent to ${user.email}`);
  }
}

class DatabaseManager {
  constructor(private userManager: UserManager) {} // 循環依存

  save(user: User): void {
    // 保存前に再度バリデーション（循環依存の原因）
    if (this.userManager.validateUser(user)) {
      console.log("Saving user to database");
    }
  }
}
```

#### **解決方法**

```typescript
// ✅ 責任分離による循環依存解消
interface IUserValidator {
  validate(user: User): boolean;
}

interface IUserRepository {
  save(user: User): Promise<void>;
}

interface IEmailService {
  sendWelcomeEmail(user: User): Promise<void>;
}

class UserValidator implements IUserValidator {
  validate(user: User): boolean {
    return user.name.length > 0 && user.email.includes("@");
  }
}

class UserRepository implements IUserRepository {
  async save(user: User): Promise<void> {
    console.log(`Saving user ${user.name} to database`);
  }
}

class EmailService implements IEmailService {
  async sendWelcomeEmail(user: User): Promise<void> {
    console.log(`Sending welcome email to ${user.email}`);
  }
}

class UserRegistrationService {
  constructor(
    private validator: IUserValidator,
    private repository: IUserRepository,
    private emailService: IEmailService
  ) {}

  async registerUser(user: User): Promise<void> {
    if (!this.validator.validate(user)) {
      throw new Error("Invalid user data");
    }

    await this.repository.save(user);
    await this.emailService.sendWelcomeEmail(user);
  }
}
```

#### **予防策**

- 📐 **依存関係図の作成**: クラス間の依存を可視化
- 🔄 **インターフェースによる抽象化**: 具体クラスではなくインターフェースに依存
- ⚡ **依存性注入の活用**: コンストラクタ注入で依存関係を明確化

---

## 🔓 OCP（オープン・クローズドの原則）関連エラー

### エラー 3: Switch 文による拡張性の欠如

#### **エラーメッセージ**

```
Property 'triangle' does not exist on type 'ShapeType'.
Did you mean 'rectangle' or 'circle'?
```

#### **発生するコード例**

```typescript
// 💩 新しい図形追加時にエラーが発生
type ShapeType = "rectangle" | "circle"; // triangleが未定義

interface Rectangle {
  type: "rectangle";
  width: number;
  height: number;
}

interface Circle {
  type: "circle";
  radius: number;
}

type Shape = Rectangle | Circle;

class AreaCalculator {
  calculateArea(shape: Shape): number {
    switch (shape.type) {
      case "rectangle":
        return shape.width * shape.height;
      case "circle":
        return Math.PI * shape.radius ** 2;
      case "triangle": // TypeScriptエラー: triangleは存在しない
        return 0.5 * shape.base * shape.height; // baseとheightも未定義
      default:
        throw new Error(`Unknown shape type: ${(shape as any).type}`);
    }
  }
}
```

#### **原因**

新しい図形を追加する際に、型定義と switch 文の両方を変更する必要があり、OCP に違反。

#### **解決方法**

```typescript
// ✅ OCP準拠の解決方法
interface IShape {
  calculateArea(): number;
  getType(): string;
}

class Rectangle implements IShape {
  constructor(private width: number, private height: number) {}

  calculateArea(): number {
    return this.width * this.height;
  }

  getType(): string {
    return "rectangle";
  }
}

class Circle implements IShape {
  constructor(private radius: number) {}

  calculateArea(): number {
    return Math.PI * this.radius ** 2;
  }

  getType(): string {
    return "circle";
  }
}

// 新しい図形を既存コードを変更せずに追加
class Triangle implements IShape {
  constructor(private base: number, private height: number) {}

  calculateArea(): number {
    return 0.5 * this.base * this.height;
  }

  getType(): string {
    return "triangle";
  }
}

class AreaCalculator {
  calculateTotalArea(shapes: IShape[]): number {
    return shapes.reduce((total, shape) => total + shape.calculateArea(), 0);
  }

  // 個別の面積計算（型安全）
  calculateArea(shape: IShape): number {
    return shape.calculateArea();
  }
}
```

#### **予防策**

- 🎯 **抽象化の検討**: 条件分岐が多い場合は Strategy pattern の適用を検討
- 📝 **型システムの活用**: Union types よりもインターフェースベースの設計
- 🔄 **テストの充実**: 新しい実装追加時の既存動作の保証

### エラー 4: 設定値のハードコーディング

#### **発生するコード例**

```typescript
// 💩 設定値がハードコーディングされて拡張困難
class PaymentProcessor {
  processPayment(amount: number, method: string): boolean {
    let fee = 0;

    // ハードコーディングされた手数料計算（OCP違反）
    if (method === "credit_card") {
      fee = amount * 0.03; // 3%
    } else if (method === "paypal") {
      fee = amount * 0.025; // 2.5%
    } else if (method === "bank_transfer") {
      fee = amount * 0.01; // 1%
    }

    console.log(`Processing ${amount} with ${fee} fee via ${method}`);
    return true;
  }
}

// 新しい支払い方法を追加する際にクラスの修正が必要
```

#### **解決方法**

```typescript
// ✅ Strategy patternによる解決
interface PaymentFeeCalculator {
  calculateFee(amount: number): number;
  getMethodName(): string;
}

class CreditCardFeeCalculator implements PaymentFeeCalculator {
  calculateFee(amount: number): number {
    return amount * 0.03;
  }

  getMethodName(): string {
    return "credit_card";
  }
}

class PaypalFeeCalculator implements PaymentFeeCalculator {
  calculateFee(amount: number): number {
    return amount * 0.025;
  }

  getMethodName(): string {
    return "paypal";
  }
}

class BankTransferFeeCalculator implements PaymentFeeCalculator {
  calculateFee(amount: number): number {
    return amount * 0.01;
  }

  getMethodName(): string {
    return "bank_transfer";
  }
}

// 新しい支払い方法（既存コードを変更せずに追加）
class CryptoFeeCalculator implements PaymentFeeCalculator {
  calculateFee(amount: number): number {
    return amount * 0.005; // 0.5%
  }

  getMethodName(): string {
    return "cryptocurrency";
  }
}

class PaymentProcessor {
  private calculators = new Map<string, PaymentFeeCalculator>();

  registerCalculator(calculator: PaymentFeeCalculator): void {
    this.calculators.set(calculator.getMethodName(), calculator);
  }

  processPayment(amount: number, method: string): boolean {
    const calculator = this.calculators.get(method);
    if (!calculator) {
      throw new Error(`Unsupported payment method: ${method}`);
    }

    const fee = calculator.calculateFee(amount);
    console.log(`Processing ${amount} with ${fee} fee via ${method}`);
    return true;
  }
}

// 使用例
const processor = new PaymentProcessor();
processor.registerCalculator(new CreditCardFeeCalculator());
processor.registerCalculator(new PaypalFeeCalculator());
processor.registerCalculator(new BankTransferFeeCalculator());
processor.registerCalculator(new CryptoFeeCalculator()); // 新機能追加
```

---

## 🔄 LSP（リスコフの置換原則）関連エラー

### エラー 5: 派生クラスでの例外スロー

#### **エラーメッセージ**

```
UnhandledPromiseRejectionWarning: Error: ReadOnlyFile cannot be written to
```

#### **発生するコード例**

```typescript
// 💩 LSP違反：派生クラスで制約を強化
class File {
  constructor(protected content: string) {}

  read(): string {
    return this.content;
  }

  write(content: string): void {
    this.content = content;
    console.log("File content updated");
  }
}

class ReadOnlyFile extends File {
  write(content: string): void {
    // LSP違反：基底クラスで許可されている操作を拒否
    throw new Error("ReadOnlyFile cannot be written to");
  }
}

// 使用側のコード（LSP違反により実行時エラー）
function updateFiles(files: File[]): void {
  files.forEach((file) => {
    file.write("Updated content"); // ReadOnlyFileで例外発生
  });
}
```

#### **解決方法**

```typescript
// ✅ LSP準拠の解決方法
abstract class BaseFile {
  constructor(protected content: string) {}

  read(): string {
    return this.content;
  }

  abstract isWritable(): boolean;
}

class WritableFile extends BaseFile {
  isWritable(): boolean {
    return true;
  }

  write(content: string): void {
    this.content = content;
    console.log("File content updated");
  }
}

class ReadOnlyFile extends BaseFile {
  isWritable(): boolean {
    return false;
  }

  // writeメソッドを提供しない（LSP準拠）
}

// 型安全な使用パターン
function updateWritableFiles(files: BaseFile[]): void {
  files.forEach((file) => {
    if (file.isWritable() && file instanceof WritableFile) {
      file.write("Updated content"); // 型安全
    } else {
      console.log("Skipping read-only file");
    }
  });
}

// または、より明確なインターフェース分離
interface Readable {
  read(): string;
}

interface Writable {
  write(content: string): void;
}

class RegularFile implements Readable, Writable {
  constructor(private content: string) {}

  read(): string {
    return this.content;
  }

  write(content: string): void {
    this.content = content;
  }
}

class ImmutableFile implements Readable {
  constructor(private readonly content: string) {}

  read(): string {
    return this.content;
  }

  // writeメソッドは存在しない
}
```

#### **予防策**

- 🎯 **契約の明確化**: 基底クラスで定義した契約を派生クラスで強化しない
- 📝 **事前・事後条件の検証**: 前提条件を強化、事後条件を弱化しない
- 🧪 **置換テストの実施**: 派生クラスが基底クラスと完全に置換可能か確認

### エラー 6: 戻り値の型制約違反

#### **発生するコード例**

```typescript
// 💩 戻り値の制約を強化してLSP違反
class DataProcessor {
  process(data: any[]): any[] {
    return data.map((item) => ({ processed: true, ...item }));
  }
}

class StrictDataProcessor extends DataProcessor {
  process(data: any[]): string[] {
    // 戻り値の型を制限（LSP違反）
    return data.map((item) => JSON.stringify({ processed: true, ...item }));
  }
}

// 使用側での問題発生
function handleProcessedData(processor: DataProcessor, data: any[]): void {
  const result = processor.process(data);

  // 基底クラスの契約に基づいた操作
  result.forEach((item) => {
    console.log(item.processed); // StrictDataProcessorの場合は文字列になりundefined
  });
}
```

#### **解決方法**

```typescript
// ✅ ジェネリクスによるLSP準拠の設計
abstract class DataProcessor<T, R> {
  abstract process(data: T[]): R[];

  // 共通の後処理（テンプレートメソッド）
  processWithLogging(data: T[]): R[] {
    console.log(`Processing ${data.length} items`);
    const result = this.process(data);
    console.log(`Processed to ${result.length} items`);
    return result;
  }
}

class ObjectDataProcessor extends DataProcessor<any, object> {
  process(data: any[]): object[] {
    return data.map((item) => ({ processed: true, ...item }));
  }
}

class StringDataProcessor extends DataProcessor<any, string> {
  process(data: any[]): string[] {
    return data.map((item) => JSON.stringify({ processed: true, ...item }));
  }
}

// 型安全な使用
function handleObjectData(data: any[]): void {
  const processor = new ObjectDataProcessor();
  const result = processor.processWithLogging(data);

  result.forEach((item) => {
    console.log((item as any).processed); // 型安全にアクセス
  });
}

function handleStringData(data: any[]): void {
  const processor = new StringDataProcessor();
  const result = processor.processWithLogging(data);

  result.forEach((item) => {
    console.log(`Processed string: ${item}`); // 文字列として処理
  });
}
```

---

## 🔗 ISP（インターフェース分離の原則）関連エラー

### エラー 7: 肥大化したインターフェースによる実装強制

#### **エラーメッセージ**

```
Class 'ReadOnlyUserService' incorrectly implements interface 'IUserService'.
Property 'deleteUser' is missing in type 'ReadOnlyUserService'
```

#### **発生するコード例**

```typescript
// 💩 肥大化したインターフェース（ISP違反）
interface IUserService {
  // 読み取り操作
  getUser(id: string): Promise<User>;
  getAllUsers(): Promise<User[]>;
  searchUsers(query: string): Promise<User[]>;

  // 作成・更新操作
  createUser(user: User): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User>;

  // 削除操作
  deleteUser(id: string): Promise<boolean>;

  // 管理操作
  banUser(id: string): Promise<void>;
  unbanUser(id: string): Promise<void>;
  resetUserPassword(id: string): Promise<string>;

  // 統計操作
  getUserStats(): Promise<UserStats>;
  generateUserReport(): Promise<Report>;
}

// 読み取り専用のサービスで全メソッドの実装を強制される
class ReadOnlyUserService implements IUserService {
  async getUser(id: string): Promise<User> {
    // 実装
    return {} as User;
  }

  async getAllUsers(): Promise<User[]> {
    // 実装
    return [];
  }

  async searchUsers(query: string): Promise<User[]> {
    // 実装
    return [];
  }

  // 不要だが実装を強制される
  async createUser(user: User): Promise<User> {
    throw new Error("Not supported in read-only service");
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    throw new Error("Not supported in read-only service");
  }

  async deleteUser(id: string): Promise<boolean> {
    throw new Error("Not supported in read-only service");
  }

  // ... 他の不要なメソッドも実装必須
}
```

#### **解決方法**

```typescript
// ✅ ISP準拠の分離されたインターフェース
interface IUserReader {
  getUser(id: string): Promise<User>;
  getAllUsers(): Promise<User[]>;
  searchUsers(query: string): Promise<User[]>;
}

interface IUserWriter {
  createUser(user: User): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User>;
}

interface IUserDeleter {
  deleteUser(id: string): Promise<boolean>;
}

interface IUserAdministrator {
  banUser(id: string): Promise<void>;
  unbanUser(id: string): Promise<void>;
  resetUserPassword(id: string): Promise<string>;
}

interface IUserAnalytics {
  getUserStats(): Promise<UserStats>;
  generateUserReport(): Promise<Report>;
}

// 必要な機能のみ実装
class ReadOnlyUserService implements IUserReader {
  async getUser(id: string): Promise<User> {
    // 実装
    return {} as User;
  }

  async getAllUsers(): Promise<User[]> {
    // 実装
    return [];
  }

  async searchUsers(query: string): Promise<User[]> {
    // 実装
    return [];
  }
}

class FullUserService implements IUserReader, IUserWriter, IUserDeleter {
  // 必要な機能のみ実装
  async getUser(id: string): Promise<User> {
    return {} as User;
  }
  async getAllUsers(): Promise<User[]> {
    return [];
  }
  async searchUsers(query: string): Promise<User[]> {
    return [];
  }

  async createUser(user: User): Promise<User> {
    return user;
  }
  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    return {} as User;
  }

  async deleteUser(id: string): Promise<boolean> {
    return true;
  }
}

class AdminUserService implements IUserAdministrator {
  async banUser(id: string): Promise<void> {
    console.log(`User ${id} banned`);
  }

  async unbanUser(id: string): Promise<void> {
    console.log(`User ${id} unbanned`);
  }

  async resetUserPassword(id: string): Promise<string> {
    return "new-password";
  }
}
```

#### **予防策**

- 🎯 **役割ベースの分離**: クライアントの役割に応じてインターフェースを分離
- 📝 **依存関係の最小化**: 必要最小限のメソッドのみに依存
- 🔄 **定期的な見直し**: インターフェースが肥大化していないか確認

### エラー 8: Adapter パターンでの型不整合

#### **発生するコード例**

```typescript
// 💩 型不整合により実行時エラー
interface ModernAPI {
  fetchUserData(userId: string): Promise<{
    id: string;
    name: string;
    email: string;
    createdAt: Date;
  }>;
}

interface LegacyAPI {
  getUserInfo(userCode: number): {
    user_id: number;
    user_name: string;
    user_email: string;
    created_timestamp: string;
  };
}

// 不完全なAdapter（型安全性の欠如）
class LegacyAPIAdapter implements ModernAPI {
  constructor(private legacyAPI: LegacyAPI) {}

  async fetchUserData(userId: string): Promise<{
    id: string;
    name: string;
    email: string;
    createdAt: Date;
  }> {
    const userCode = parseInt(userId); // 文字列→数値変換でエラー可能性
    const legacyData = this.legacyAPI.getUserInfo(userCode);

    return {
      id: legacyData.user_id.toString(),
      name: legacyData.user_name,
      email: legacyData.user_email,
      createdAt: new Date(legacyData.created_timestamp), // 日付形式が不正でエラー可能性
    };
  }
}
```

#### **解決方法**

```typescript
// ✅ 型安全なAdapterの実装
interface ModernUser {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

interface LegacyUser {
  user_id: number;
  user_name: string;
  user_email: string;
  created_timestamp: string;
}

class ValidationError extends Error {
  constructor(message: string, public field: string) {
    super(message);
    this.name = "ValidationError";
  }
}

class LegacyAPIAdapter implements ModernAPI {
  constructor(private legacyAPI: LegacyAPI) {}

  async fetchUserData(userId: string): Promise<ModernUser> {
    try {
      const userCode = this.parseUserId(userId);
      const legacyData = this.legacyAPI.getUserInfo(userCode);
      return this.transformLegacyData(legacyData);
    } catch (error) {
      throw new Error(`Failed to fetch user data: ${(error as Error).message}`);
    }
  }

  private parseUserId(userId: string): number {
    const parsed = parseInt(userId, 10);
    if (isNaN(parsed) || parsed <= 0) {
      throw new ValidationError("Invalid user ID format", "userId");
    }
    return parsed;
  }

  private transformLegacyData(legacyData: LegacyUser): ModernUser {
    this.validateLegacyData(legacyData);

    const createdAt = this.parseTimestamp(legacyData.created_timestamp);

    return {
      id: legacyData.user_id.toString(),
      name: legacyData.user_name,
      email: legacyData.user_email,
      createdAt,
    };
  }

  private validateLegacyData(data: LegacyUser): void {
    if (!data.user_name || data.user_name.trim() === "") {
      throw new ValidationError("User name is required", "user_name");
    }

    if (!data.user_email || !data.user_email.includes("@")) {
      throw new ValidationError("Valid email is required", "user_email");
    }
  }

  private parseTimestamp(timestamp: string): Date {
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) {
      throw new ValidationError(
        "Invalid timestamp format",
        "created_timestamp"
      );
    }
    return date;
  }
}
```

---

## ⚡ DIP（依存性逆転の原則）関連エラー

### エラー 9: 循環依存による初期化エラー

#### **エラーメッセージ**

```
ReferenceError: Cannot access 'UserService' before initialization
```

#### **発生するコード例**

```typescript
// 💩 循環依存による初期化問題
class UserService {
  constructor(private orderService: OrderService) {}

  createUser(name: string): User {
    const user = new User(name);
    // 新規ユーザーに特典注文を作成
    this.orderService.createWelcomeOrder(user);
    return user;
  }
}

class OrderService {
  constructor(private userService: UserService) {} // 循環依存

  createWelcomeOrder(user: User): Order {
    // ユーザー情報の検証
    const validatedUser = this.userService.validateUser(user); // エラー発生箇所
    return new Order(validatedUser.id, "Welcome Package");
  }
}

// 初期化時にエラー発生
const orderService = new OrderService(new UserService(orderService)); // エラー
```

#### **解決方法**

```typescript
// ✅ 依存性逆転による循環依存解消
interface IUserValidator {
  validateUser(user: User): User;
}

interface IOrderCreator {
  createOrder(userId: string, description: string): Order;
}

interface IWelcomeOrderService {
  createWelcomeOrder(user: User): Order;
}

class UserService implements IUserValidator {
  constructor(private welcomeOrderService: IWelcomeOrderService) {}

  createUser(name: string): User {
    const user = new User(name);
    this.welcomeOrderService.createWelcomeOrder(user);
    return user;
  }

  validateUser(user: User): User {
    if (!user.name || user.name.trim() === "") {
      throw new Error("Invalid user name");
    }
    return user;
  }
}

class OrderService implements IOrderCreator {
  constructor(private userValidator: IUserValidator) {}

  createOrder(userId: string, description: string): Order {
    return new Order(userId, description);
  }

  private validateOrderRequest(user: User): User {
    return this.userValidator.validateUser(user);
  }
}

class WelcomeOrderService implements IWelcomeOrderService {
  constructor(
    private userValidator: IUserValidator,
    private orderCreator: IOrderCreator
  ) {}

  createWelcomeOrder(user: User): Order {
    const validatedUser = this.userValidator.validateUser(user);
    return this.orderCreator.createOrder(validatedUser.id, "Welcome Package");
  }
}

// 依存性注入により循環依存を解消
class ServiceContainer {
  private userValidator!: IUserValidator;
  private orderCreator!: IOrderCreator;
  private welcomeOrderService!: IWelcomeOrderService;
  private userService!: UserService;
  private orderService!: OrderService;

  initialize(): void {
    // まず基本的なサービスを作成
    this.userValidator = new UserService(null as any); // 後で設定
    this.orderCreator = new OrderService(this.userValidator);

    // 複合サービスを作成
    this.welcomeOrderService = new WelcomeOrderService(
      this.userValidator,
      this.orderCreator
    );

    // 最終的なサービスを作成
    this.userService = new UserService(this.welcomeOrderService);
    this.orderService = new OrderService(this.userValidator);
  }

  getUserService(): UserService {
    return this.userService;
  }

  getOrderService(): OrderService {
    return this.orderService;
  }
}
```

#### **予防策**

- 🎯 **依存関係グラフの作成**: サービス間の依存関係を可視化
- 📝 **インターフェースファースト設計**: 抽象に依存した設計
- 🔄 **DI コンテナの活用**: 自動的な依存解決の仕組み導入

### エラー 10: Mock 作成時の型エラー

#### **発生するコード例**

```typescript
// 💩 具象クラスに依存してMockが困難
class EmailSender {
  sendEmail(to: string, subject: string, body: string): boolean {
    // 実際のメール送信処理
    console.log(`Sending email to ${to}`);
    return true;
  }

  validateEmailAddress(email: string): boolean {
    return email.includes("@");
  }

  getEmailTemplate(templateName: string): string {
    // テンプレート取得処理
    return `<html>Template ${templateName}</html>`;
  }
}

class UserRegistrationService {
  constructor(private emailSender: EmailSender) {} // 具象クラスに依存

  async registerUser(user: User): Promise<void> {
    // ユーザー登録処理
    if (this.emailSender.validateEmailAddress(user.email)) {
      const template = this.emailSender.getEmailTemplate("welcome");
      this.emailSender.sendEmail(user.email, "Welcome!", template);
    }
  }
}

// テストでのMock作成が困難
describe("UserRegistrationService", () => {
  it("should register user and send email", async () => {
    // MockのEmailSenderを作成するが型エラーが発生
    const mockEmailSender = {
      sendEmail: jest.fn().mockReturnValue(true),
      // validateEmailAddressとgetEmailTemplateも全て実装必要
    } as EmailSender; // 型アサーションが必要（危険）

    const service = new UserRegistrationService(mockEmailSender);
    // テスト続行...
  });
});
```

#### **解決方法**

```typescript
// ✅ インターフェースベースの設計でテスト容易性向上
interface IEmailSender {
  sendEmail(to: string, subject: string, body: string): Promise<boolean>;
}

interface IEmailValidator {
  validateEmailAddress(email: string): boolean;
}

interface IEmailTemplateProvider {
  getEmailTemplate(templateName: string): Promise<string>;
}

class EmailService
  implements IEmailSender, IEmailValidator, IEmailTemplateProvider
{
  async sendEmail(to: string, subject: string, body: string): Promise<boolean> {
    console.log(`Sending email to ${to}`);
    return true;
  }

  validateEmailAddress(email: string): boolean {
    return email.includes("@");
  }

  async getEmailTemplate(templateName: string): Promise<string> {
    return `<html>Template ${templateName}</html>`;
  }
}

class UserRegistrationService {
  constructor(
    private emailSender: IEmailSender,
    private emailValidator: IEmailValidator,
    private templateProvider: IEmailTemplateProvider
  ) {}

  async registerUser(user: User): Promise<void> {
    if (this.emailValidator.validateEmailAddress(user.email)) {
      const template = await this.templateProvider.getEmailTemplate("welcome");
      await this.emailSender.sendEmail(user.email, "Welcome!", template);
    }
  }
}

// 型安全なMockを使ったテスト
describe("UserRegistrationService", () => {
  it("should register user and send email", async () => {
    // インターフェースベースのMock作成
    const mockEmailSender: IEmailSender = {
      sendEmail: jest.fn().mockResolvedValue(true),
    };

    const mockEmailValidator: IEmailValidator = {
      validateEmailAddress: jest.fn().mockReturnValue(true),
    };

    const mockTemplateProvider: IEmailTemplateProvider = {
      getEmailTemplate: jest.fn().mockResolvedValue("<html>Welcome</html>"),
    };

    const service = new UserRegistrationService(
      mockEmailSender,
      mockEmailValidator,
      mockTemplateProvider
    );

    const user = new User("test@example.com");
    await service.registerUser(user);

    expect(mockEmailValidator.validateEmailAddress).toHaveBeenCalledWith(
      "test@example.com"
    );
    expect(mockTemplateProvider.getEmailTemplate).toHaveBeenCalledWith(
      "welcome"
    );
    expect(mockEmailSender.sendEmail).toHaveBeenCalledWith(
      "test@example.com",
      "Welcome!",
      "<html>Welcome</html>"
    );
  });
});
```

---

## 🔧 パフォーマンス関連エラー

### エラー 11: 過度なオブジェクト生成によるメモリリーク

#### **発生するコード例**

```typescript
// 💩 不要なオブジェクト生成によるパフォーマンス問題
class DataProcessor {
  processLargeDataset(data: any[]): any[] {
    return data
      .map((item) => {
        // 毎回新しいValidatorを生成（無駄）
        const validator = new ItemValidator();
        const formatter = new ItemFormatter();
        const transformer = new ItemTransformer();

        if (validator.validate(item)) {
          const formatted = formatter.format(item);
          return transformer.transform(formatted);
        }

        return null;
      })
      .filter((item) => item !== null);
  }
}
```

#### **解決方法**

```typescript
// ✅ オブジェクトの再利用とSingleton pattern
class DataProcessor {
  private readonly validator: ItemValidator;
  private readonly formatter: ItemFormatter;
  private readonly transformer: ItemTransformer;

  constructor() {
    this.validator = new ItemValidator();
    this.formatter = new ItemFormatter();
    this.transformer = new ItemTransformer();
  }

  processLargeDataset(data: any[]): any[] {
    return data
      .filter((item) => this.validator.validate(item))
      .map((item) => {
        const formatted = this.formatter.format(item);
        return this.transformer.transform(formatted);
      });
  }
}

// さらに最適化：Factory pattern + Object Pool
class ProcessorPool {
  private static instance: ProcessorPool;
  private processors: DataProcessor[] = [];
  private availableProcessors: DataProcessor[] = [];

  static getInstance(): ProcessorPool {
    if (!ProcessorPool.instance) {
      ProcessorPool.instance = new ProcessorPool();
    }
    return ProcessorPool.instance;
  }

  getProcessor(): DataProcessor {
    if (this.availableProcessors.length === 0) {
      return new DataProcessor();
    }
    return this.availableProcessors.pop()!;
  }

  returnProcessor(processor: DataProcessor): void {
    this.availableProcessors.push(processor);
  }
}
```

---

## 📊 診断・デバッグのベストプラクティス

### 🔍 エラー診断のステップ

#### **1. エラー分類の特定**

```typescript
// エラー分類のヘルパー関数
function categorizeError(error: Error): string {
  if (error.name === "TypeError") return "Type Error";
  if (error.name === "ValidationError") return "Business Logic Error";
  if (error.message.includes("Cannot read property"))
    return "Null Reference Error";
  if (error.message.includes("is not a function")) return "Method Call Error";
  return "Unknown Error";
}
```

#### **2. コンテキスト情報の収集**

```typescript
// デバッグ情報付きエラー
class DetailedError extends Error {
  constructor(
    message: string,
    public readonly context: Record<string, any>,
    public readonly stackTrace?: string
  ) {
    super(message);
    this.stackTrace = this.stackTrace || this.stack;
  }

  toDebugString(): string {
    return JSON.stringify(
      {
        message: this.message,
        context: this.context,
        stackTrace: this.stackTrace,
      },
      null,
      2
    );
  }
}
```

#### **3. 段階的なデバッグ**

```typescript
// デバッグ用のロギング関数
class DebugLogger {
  static logMethodEntry(
    className: string,
    methodName: string,
    args: any[]
  ): void {
    console.log(`🔍 [${className}.${methodName}] Entry:`, args);
  }

  static logMethodExit(
    className: string,
    methodName: string,
    result: any
  ): void {
    console.log(`✅ [${className}.${methodName}] Exit:`, result);
  }

  static logError(className: string, methodName: string, error: Error): void {
    console.error(`❌ [${className}.${methodName}] Error:`, error);
  }
}

// デバッグを考慮したクラス設計例
class DebuggableUserService {
  createUser(name: string, email: string): User {
    DebugLogger.logMethodEntry("UserService", "createUser", [name, email]);

    try {
      const user = new User(name, email);
      DebugLogger.logMethodExit("UserService", "createUser", user);
      return user;
    } catch (error) {
      DebugLogger.logError("UserService", "createUser", error as Error);
      throw error;
    }
  }
}
```

### 🧪 テストによるエラー予防

#### **型安全性のテスト**

```typescript
// コンパイル時型チェックのテスト
type AssertTrue<T extends true> = T;
type AssertFalse<T extends false> = T;

// SOLID原則準拠の型チェック
type CanSubstitute<Base, Derived> = Derived extends Base ? true : false;

// LSP準拠チェック
type TestLSP = AssertTrue<CanSubstitute<Bird, Sparrow>>;
type TestLSP2 = AssertTrue<CanSubstitute<Shape, Rectangle>>;
```

---

## 🎯 エラー予防のチェックリスト

### 📋 設計段階でのチェック項目

#### **SRP 関連**

- [ ] クラス/関数の責任を 1 文で説明できるか
- [ ] 変更理由が 1 つに限定されているか
- [ ] 関連度の低いメソッドが混在していないか

#### **OCP 関連**

- [ ] 新機能追加時に既存コードの変更が必要ないか
- [ ] 抽象化により拡張ポイントが明確化されているか
- [ ] Strategy パターン等が適切に適用されているか

#### **LSP 関連**

- [ ] 派生クラスが基底クラスと完全に置換可能か
- [ ] 前提条件を強化していないか
- [ ] 事後条件を弱化していないか

#### **ISP 関連**

- [ ] インターフェースが役割別に分離されているか
- [ ] 不要なメソッド実装を強制していないか
- [ ] クライアント特化のインターフェースになっているか

#### **DIP 関連**

- [ ] 具象クラスではなく抽象に依存しているか
- [ ] 依存性注入が適切に実装されているか
- [ ] 循環依存が発生していないか

---

**🚀 重要ポイント**: エラーが発生したら、まず SOLID 原則のどの違反が原因かを特定してから修正に取り組むと、根本的な解決につながります！

**🔧 継続的改善**: 定期的なコードレビューとリファクタリングにより、エラーの根本原因を取り除いていきましょう！
