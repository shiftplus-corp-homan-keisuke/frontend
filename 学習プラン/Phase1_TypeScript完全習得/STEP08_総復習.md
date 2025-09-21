# STEP08 総復習：SOLID原則によるTypeScript設計パターン

## 📋 概要

このファイルは、STEP08「SOLID原則によるTypeScript設計パターン」の理論学習内容を総復習するためのドキュメントです。既存のセッションファイルで学習した内容を体系的に整理し、理論的な理解を深めることを目的としています。

## 🎯 学習目標

- [ ] SOLID原則の5つの原則の理解と実践的な適用
- [ ] 各原則の違反例と準拠例の把握
- [ ] Angular/Reactでの具体的な適用パターンの習得
- [ ] デメリットとトレードオフの理解
- [ ] 実践での活用場面の判断基準の習得

---

## 1. 単一責任の原則（SRP - Single Responsibility Principle）

### 1.1 基本概念

**定義**: 一つのクラスは一つの責任だけを持つべきである

**核心**: 「変更するための理由が一つのクラスに対して一つ以上あってはならない」

```typescript
// ❌ 違反例：複数の責任を持つクラス
class User {
  constructor(public name: string, public email: string) {}
  
  getUserInfo() { return { name: this.name, email: this.email }; }
  saveToDatabase() { console.log(`Saving ${this.name} to database...`); }
}

// ✅ 準拠例：責任を分離
class User {
  constructor(public name: string, public email: string) {}
  getUserInfo() { return { name: this.name, email: this.email }; }
}

class UserRepository {
  save(user: User) { console.log(`Saving ${user.name} to database...`); }
}
```

### 1.2 Angular での適用

```typescript
// ✅ バリデーション専用サービス
@Injectable({ providedIn: 'root' })
export class UserValidationService {
  validateEmail(email: string): boolean {
    return email.includes('@') && email.includes('.');
  }
}

// ✅ API通信専用サービス
@Injectable({ providedIn: 'root' })
export class UserApiService {
  constructor(private http: HttpClient) {}
  
  saveUser(user: User): Observable<User> {
    return this.http.post<User>('/api/users', user);
  }
}
```

---

## 2. オープン・クローズドの原則（OCP - Open/Closed Principle）

### 2.1 基本概念

**定義**: ソフトウェアエンティティは拡張に対してオープン、修正に対してクローズドであるべき

**実現方法**: 抽象化とポリモーフィズムの活用

```typescript
// ✅ 抽象化による拡張可能な設計
interface PaymentProcessor {
  processPayment(amount: number): Promise<boolean>;
}

class CreditCardProcessor implements PaymentProcessor {
  async processPayment(amount: number): Promise<boolean> {
    console.log(`Processing credit card payment: $${amount}`);
    return true;
  }
}

class PayPalProcessor implements PaymentProcessor {
  async processPayment(amount: number): Promise<boolean> {
    console.log(`Processing PayPal payment: $${amount}`);
    return true;
  }
}

// 新しい支払い方法を追加する際、既存コードを変更する必要がない
class BitcoinProcessor implements PaymentProcessor {
  async processPayment(amount: number): Promise<boolean> {
    console.log(`Processing Bitcoin payment: $${amount}`);
    return true;
  }
}
```

---

## 3. リスコフの置換原則（LSP - Liskov Substitution Principle）

### 3.1 基本概念

**定義**: 派生クラスは基底クラスと置換可能であるべき

**核心**: 親クラス型として宣言された変数に子クラスのインスタンスを代入しても、プログラムの振る舞いが変わらない

```typescript
// ❌ 違反例：正方形と長方形の問題
class Rectangle {
  constructor(protected width: number, protected height: number) {}
  
  setWidth(width: number): void { this.width = width; }
  setHeight(height: number): void { this.height = height; }
  getArea(): number { return this.width * this.height; }
}

class Square extends Rectangle {
  setWidth(width: number): void {
    this.width = width;
    this.height = width; // 親の振る舞いを変更！
  }
  
  setHeight(height: number): void {
    this.width = height;
    this.height = height; // 親の振る舞いを変更！
  }
}

// ✅ 準拠例：共通インターフェースによる設計
interface Shape {
  getArea(): number;
}

class Rectangle implements Shape {
  constructor(private width: number, private height: number) {}
  getArea(): number { return this.width * this.height; }
}

class Square implements Shape {
  constructor(private side: number) {}
  getArea(): number { return this.side * this.side; }
}
```

---

## 4. インターフェース分離の原則（ISP - Interface Segregation Principle）

### 4.1 基本概念

**定義**: クライアントは使用しないメソッドに依存すべきでない

**実現方法**: 特定の役割に特化した小さなインターフェースを作成

```typescript
// ❌ 違反例：ファット・インターフェース
interface IMultiFunctionDevice {
  print(document: any): void;
  scan(document: any): void;
  fax(document: any): void;
}

// ✅ 準拠例：機能ごとに分離
interface IPrinter {
  print(document: any): void;
}

interface IScanner {
  scan(document: any): void;
}

interface IFax {
  fax(document: any): void;
}

// 必要な機能だけを実装
class SimplePrinter implements IPrinter {
  print(document: any): void {
    console.log("Printing document...");
  }
}

class AllInOnePrinter implements IPrinter, IScanner, IFax {
  print(document: any): void { console.log("Printing..."); }
  scan(document: any): void { console.log("Scanning..."); }
  fax(document: any): void { console.log("Faxing..."); }
}
```

### 4.2 Angular での適用

```typescript
// ✅ 機能ごとに分離されたサービスインターフェース
interface IUserDataService {
  getUser(id: number): Observable<User>;
  createUser(user: Partial<User>): Observable<User>;
}

interface IUserAuthService {
  login(email: string, password: string): Observable<string>;
  logout(): Observable<boolean>;
}

interface IUserPermissionService {
  checkPermission(userId: number, action: string): Observable<boolean>;
}
```

---

## 5. 依存性逆転の原則（DIP - Dependency Inversion Principle）

### 5.1 基本概念

**定義**: 
- 高レベルモジュールは低レベルモジュールに依存すべきでない
- 両方とも抽象に依存すべきである

```typescript
// ❌ 違反例：具象クラスに依存
class EmailService {
  sendEmail(message: string): void {
    console.log(`Sending email: ${message}`);
  }
}

class NotificationManager {
  private emailService = new EmailService(); // 具象クラスに依存
  
  notify(message: string): void {
    this.emailService.sendEmail(message);
  }
}

// ✅ 準拠例：抽象に依存
interface INotificationService {
  send(message: string): void;
}

class EmailService implements INotificationService {
  send(message: string): void {
    console.log(`Sending email: ${message}`);
  }
}

class SMSService implements INotificationService {
  send(message: string): void {
    console.log(`Sending SMS: ${message}`);
  }
}

class NotificationManager {
  constructor(private notificationService: INotificationService) {} // 抽象に依存
  
  notify(message: string): void {
    this.notificationService.send(message);
  }
}
```

### 5.2 依存性注入（DI）の活用

```typescript
// Angular での依存性注入
@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(
    private userRepository: IUserRepository, // 抽象に依存
    private logger: ILogger // 抽象に依存
  ) {}
  
  async createUser(userData: CreateUserDto): Promise<User> {
    this.logger.log('Creating new user');
    return await this.userRepository.save(userData);
  }
}
```

---

## 6. 実践的な設計パターン

### 6.1 サービス層の設計

```typescript
// ✅ SOLID原則を適用したサービス設計
interface IUserService {
  createUser(data: CreateUserDto): Promise<User>;
}

interface IUserRepository {
  save(user: User): Promise<User>;
  findById(id: string): Promise<User | null>;
}

interface IUserValidator {
  validate(data: CreateUserDto): ValidationResult;
}

@Injectable()
export class UserService implements IUserService {
  constructor(
    private repository: IUserRepository,
    private validator: IUserValidator,
    private logger: ILogger
  ) {}
  
  async createUser(data: CreateUserDto): Promise<User> {
    // SRP: 各責任が分離されている
    const validation = this.validator.validate(data);
    if (!validation.isValid) {
      throw new ValidationError(validation.errors);
    }
    
    const user = new User(data);
    const savedUser = await this.repository.save(user);
    
    this.logger.log(`User created: ${savedUser.id}`);
    return savedUser;
  }
}
```

### 6.2 コンポーネント間の疎結合

```typescript
// ✅ インターフェースを通じた疎結合
interface IDataProvider<T> {
  getData(): Observable<T[]>;
  getById(id: string): Observable<T>;
}

@Component({
  selector: 'app-data-list',
  template: `<div *ngFor="let item of items$ | async">{{ item.name }}</div>`
})
export class DataListComponent<T extends { name: string }> {
  items$: Observable<T[]>;
  
  constructor(@Inject('DATA_PROVIDER') private dataProvider: IDataProvider<T>) {
    this.items$ = this.dataProvider.getData();
  }
}
```

---

## 7. デメリットとトレードオフ

### 7.1 過度な抽象化の問題

**問題点**:
- コードの複雑性増加
- 開発初期段階での設計負荷
- パフォーマンスへの影響（間接参照の増加）

**対策**:
- YAGNI原則との バランス
- 段階的なリファクタリング
- 適用場面の慎重な判断

### 7.2 適用すべき場面の判断

**適用推奨**:
- 大規模アプリケーション
- チーム開発
- 長期保守が必要なシステム
- 要件変更が頻繁なプロジェクト

**適用注意**:
- 小規模なプロトタイプ
- 短期間のプロジェクト
- 要件が固定されたシステム

---

## 8. 実践での活用場面

### 8.1 大規模アプリケーションの設計

```typescript
// ✅ モジュラー設計の例
// feature/user/domain/user.entity.ts
export class User {
  constructor(
    private readonly id: UserId,
    private readonly email: Email,
    private readonly profile: UserProfile
  ) {}
}

// feature/user/infrastructure/user.repository.ts
@Injectable()
export class UserRepository implements IUserRepository {
  constructor(private db: DatabaseService) {}
  
  async save(user: User): Promise<void> {
    // データベース操作
  }
}

// feature/user/application/user.service.ts
@Injectable()
export class UserService {
  constructor(
    private userRepository: IUserRepository,
    private eventBus: IEventBus
  ) {}
  
  async createUser(command: CreateUserCommand): Promise<void> {
    const user = User.create(command);
    await this.userRepository.save(user);
    await this.eventBus.publish(new UserCreatedEvent(user.id));
  }
}
```

### 8.2 テスト駆動開発（TDD）との組み合わせ

```typescript
// ✅ テスタブルな設計
describe('UserService', () => {
  let userService: UserService;
  let mockRepository: jest.Mocked<IUserRepository>;
  let mockValidator: jest.Mocked<IUserValidator>;
  
  beforeEach(() => {
    mockRepository = createMock<IUserRepository>();
    mockValidator = createMock<IUserValidator>();
    userService = new UserService(mockRepository, mockValidator);
  });
  
  it('should create user when validation passes', async () => {
    // Given
    mockValidator.validate.mockReturnValue({ isValid: true });
    mockRepository.save.mockResolvedValue(mockUser);
    
    // When
    const result = await userService.createUser(userData);
    
    // Then
    expect(result).toEqual(mockUser);
    expect(mockRepository.save).toHaveBeenCalledWith(expect.any(User));
  });
});
```

---

## 9. まとめ

### 9.1 SOLID原則の相互関係

- **SRP**: 責任の分離により、他の原則の適用基盤を作る
- **OCP**: 抽象化により拡張性を確保
- **LSP**: 継承の正しい使用により置換可能性を保証
- **ISP**: インターフェースの分離により結合度を下げる
- **DIP**: 依存関係の逆転により柔軟性を向上

### 9.2 実践のポイント

1. **段階的適用**: 一度にすべてを適用せず、必要に応じて段階的に導入
2. **バランス感覚**: 過度な抽象化を避け、実用性とのバランスを保つ
3. **チーム合意**: 設計方針をチーム全体で共有し、一貫性を保つ
4. **継続的改善**: リファクタリングを通じて設計を継続的に改善

### 9.3 学習の次のステップ

- [ ] デザインパターンの学習（Strategy, Factory, Observer等）
- [ ] ドメイン駆動設計（DDD）の理解
- [ ] クリーンアーキテクチャの実践
- [ ] 実際のプロジェクトでの適用と検証

---

**注意**: SOLID原則は「銀の弾丸」ではありません。プロジェクトの規模、チームの経験、要件の複雑さを考慮して、適切に適用することが重要です。