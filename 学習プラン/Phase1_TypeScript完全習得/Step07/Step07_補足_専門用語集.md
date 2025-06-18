# Step07 専門用語集

> 💡 **このファイルについて**: Step07で出てくるクリーンアーキテクチャ関連の重要な専門用語と概念の詳細解説集です。

## 📋 目次
1. [クリーンアーキテクチャ基本用語](#クリーンアーキテクチャ基本用語)
2. [レイヤー分離用語](#レイヤー分離用語)
3. [依存性管理用語](#依存性管理用語)
4. [設計原則用語](#設計原則用語)

---

## クリーンアーキテクチャ基本用語

### クリーンアーキテクチャ（Clean Architecture）
**定義**: ロバート・C・マーチンが提唱した、依存関係を内側に向けることで保守性と拡張性を高めるアーキテクチャパターン

**基本構造**:
```typescript
// 依存関係の方向: 外側 → 内側
// Infrastructure → Interface Adapters → Application Business Rules → Enterprise Business Rules
```

**特徴**:
- **依存性逆転**: 外側のレイヤーが内側のレイヤーに依存
- **フレームワーク独立**: 特定のフレームワークに依存しない
- **テスタブル**: ビジネスロジックを独立してテスト可能
- **UI独立**: UIを変更してもビジネスロジックに影響しない

### エンティティ（Entity）
**定義**: ビジネスルールをカプセル化したオブジェクト

**実装例**:
```typescript
// ドメインエンティティ
export class BlogPost {
  private constructor(
    private readonly _id: BlogPostId,
    private _title: string,
    private _content: string,
    private _authorId: AuthorId,
    private _publishedAt: Date | null = null
  ) {}

  static create(title: string, content: string, authorId: AuthorId): BlogPost {
    const id = BlogPostId.generate();
    return new BlogPost(id, title, content, authorId);
  }

  publish(): void {
    if (this._publishedAt !== null) {
      throw new Error('記事は既に公開されています');
    }
    this._publishedAt = new Date();
  }

  get id(): BlogPostId { return this._id; }
  get title(): string { return this._title; }
  get isPublished(): boolean { return this._publishedAt !== null; }
}
```

### ユースケース（Use Case）
**定義**: アプリケーション固有のビジネスルールを実装するレイヤー

**実装例**:
```typescript
// アプリケーションサービス（ユースケース）
export class PublishBlogPostUseCase {
  constructor(
    private readonly blogPostRepository: BlogPostRepository,
    private readonly eventPublisher: EventPublisher
  ) {}

  async execute(command: PublishBlogPostCommand): Promise<void> {
    const blogPost = await this.blogPostRepository.findById(command.blogPostId);
    if (!blogPost) {
      throw new Error('記事が見つかりません');
    }

    blogPost.publish();
    await this.blogPostRepository.save(blogPost);
    
    await this.eventPublisher.publish(
      new BlogPostPublishedEvent(blogPost.id, blogPost.title)
    );
  }
}
```

---

## レイヤー分離用語

### ドメイン層（Domain Layer）
**定義**: ビジネスロジックの中核を担うレイヤー

**構成要素**:
```typescript
// エンティティ
export class User {
  constructor(
    private readonly id: UserId,
    private email: Email,
    private name: UserName
  ) {}
}

// 値オブジェクト
export class Email {
  constructor(private readonly value: string) {
    if (!this.isValid(value)) {
      throw new Error('無効なメールアドレスです');
    }
  }

  private isValid(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  toString(): string {
    return this.value;
  }
}

// ドメインサービス
export class UserDomainService {
  constructor(private userRepository: UserRepository) {}

  async isDuplicateEmail(email: Email): Promise<boolean> {
    const existingUser = await this.userRepository.findByEmail(email);
    return existingUser !== null;
  }
}
```

### アプリケーション層（Application Layer）
**定義**: ユースケースを実装し、ドメイン層を調整するレイヤー

**実装例**:
```typescript
// アプリケーションサービス
export class CreateUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userDomainService: UserDomainService,
    private readonly eventPublisher: EventPublisher
  ) {}

  async execute(command: CreateUserCommand): Promise<CreateUserResult> {
    const email = new Email(command.email);
    const name = new UserName(command.name);

    // ドメインサービスを使用してビジネスルールをチェック
    if (await this.userDomainService.isDuplicateEmail(email)) {
      throw new Error('このメールアドレスは既に使用されています');
    }

    const user = User.create(email, name);
    await this.userRepository.save(user);

    await this.eventPublisher.publish(new UserCreatedEvent(user.id));

    return new CreateUserResult(user.id);
  }
}
```

### インフラストラクチャ層（Infrastructure Layer）
**定義**: 外部システムとの連携を担うレイヤー

**実装例**:
```typescript
// リポジトリの実装
export class TypeORMUserRepository implements UserRepository {
  constructor(private readonly connection: Connection) {}

  async save(user: User): Promise<void> {
    const userEntity = this.toEntity(user);
    await this.connection.getRepository(UserEntity).save(userEntity);
  }

  async findById(id: UserId): Promise<User | null> {
    const entity = await this.connection
      .getRepository(UserEntity)
      .findOne(id.value);
    
    return entity ? this.toDomain(entity) : null;
  }

  private toEntity(user: User): UserEntity {
    return {
      id: user.id.value,
      email: user.email.toString(),
      name: user.name.toString()
    };
  }

  private toDomain(entity: UserEntity): User {
    return new User(
      new UserId(entity.id),
      new Email(entity.email),
      new UserName(entity.name)
    );
  }
}
```

---

## 依存性管理用語

### 依存性逆転の原則（Dependency Inversion Principle）
**定義**: 高レベルモジュールは低レベルモジュールに依存してはならず、両方とも抽象に依存すべき

**実装例**:
```typescript
// 抽象（インターフェース）
export interface BlogPostRepository {
  save(blogPost: BlogPost): Promise<void>;
  findById(id: BlogPostId): Promise<BlogPost | null>;
  findByAuthor(authorId: AuthorId): Promise<BlogPost[]>;
}

// 高レベルモジュール（ユースケース）
export class GetBlogPostsByAuthorUseCase {
  constructor(
    private readonly blogPostRepository: BlogPostRepository // 抽象に依存
  ) {}

  async execute(query: GetBlogPostsByAuthorQuery): Promise<BlogPost[]> {
    return await this.blogPostRepository.findByAuthor(query.authorId);
  }
}

// 低レベルモジュール（実装）
export class InMemoryBlogPostRepository implements BlogPostRepository {
  private blogPosts: Map<string, BlogPost> = new Map();

  async save(blogPost: BlogPost): Promise<void> {
    this.blogPosts.set(blogPost.id.value, blogPost);
  }

  async findById(id: BlogPostId): Promise<BlogPost | null> {
    return this.blogPosts.get(id.value) || null;
  }

  async findByAuthor(authorId: AuthorId): Promise<BlogPost[]> {
    return Array.from(this.blogPosts.values())
      .filter(post => post.authorId.equals(authorId));
  }
}
```

### 依存性注入（Dependency Injection）
**定義**: オブジェクトの依存関係を外部から注入する設計パターン

**実装例**:
```typescript
// DIコンテナ
export class DIContainer {
  private services = new Map<string, any>();

  register<T>(key: string, factory: () => T): void {
    this.services.set(key, factory);
  }

  resolve<T>(key: string): T {
    const factory = this.services.get(key);
    if (!factory) {
      throw new Error(`Service not found: ${key}`);
    }
    return factory();
  }
}

// 設定
const container = new DIContainer();

container.register('BlogPostRepository', () => new InMemoryBlogPostRepository());
container.register('EventPublisher', () => new InMemoryEventPublisher());

container.register('PublishBlogPostUseCase', () => 
  new PublishBlogPostUseCase(
    container.resolve('BlogPostRepository'),
    container.resolve('EventPublisher')
  )
);
```

---

## 設計原則用語

### 単一責任の原則（Single Responsibility Principle）
**定義**: クラスは変更する理由を1つだけ持つべき

**実装例**:
```typescript
// 悪い例：複数の責任を持つクラス
class BadUserService {
  createUser(userData: any): void {
    // ユーザー作成
    // メール送信
    // ログ出力
    // データベース保存
  }
}

// 良い例：責任を分離
class UserFactory {
  create(email: string, name: string): User {
    return User.create(new Email(email), new UserName(name));
  }
}

class UserRepository {
  async save(user: User): Promise<void> {
    // データベース保存のみ
  }
}

class EmailService {
  async sendWelcomeEmail(user: User): Promise<void> {
    // メール送信のみ
  }
}

class CreateUserUseCase {
  constructor(
    private userFactory: UserFactory,
    private userRepository: UserRepository,
    private emailService: EmailService
  ) {}

  async execute(command: CreateUserCommand): Promise<void> {
    const user = this.userFactory.create(command.email, command.name);
    await this.userRepository.save(user);
    await this.emailService.sendWelcomeEmail(user);
  }
}
```

### 開放閉鎖の原則（Open/Closed Principle）
**定義**: ソフトウェアエンティティは拡張に対して開いており、修正に対して閉じているべき

**実装例**:
```typescript
// 抽象基底クラス
abstract class NotificationSender {
  abstract send(message: string, recipient: string): Promise<void>;
}

// 具体実装
class EmailNotificationSender extends NotificationSender {
  async send(message: string, recipient: string): Promise<void> {
    // メール送信実装
  }
}

class SMSNotificationSender extends NotificationSender {
  async send(message: string, recipient: string): Promise<void> {
    // SMS送信実装
  }
}

// 新しい通知方法を追加する場合、既存コードを変更せずに拡張
class SlackNotificationSender extends NotificationSender {
  async send(message: string, recipient: string): Promise<void> {
    // Slack送信実装
  }
}

// 使用側
class NotificationService {
  constructor(private senders: NotificationSender[]) {}

  async sendToAll(message: string, recipient: string): Promise<void> {
    for (const sender of this.senders) {
      await sender.send(message, recipient);
    }
  }
}
```

### 値オブジェクト（Value Object）
**定義**: 同一性ではなく値によって識別されるオブジェクト

**実装例**:
```typescript
export class Money {
  constructor(
    private readonly amount: number,
    private readonly currency: string
  ) {
    if (amount < 0) {
      throw new Error('金額は0以上である必要があります');
    }
  }

  add(other: Money): Money {
    if (this.currency !== other.currency) {
      throw new Error('異なる通貨同士は計算できません');
    }
    return new Money(this.amount + other.amount, this.currency);
  }

  equals(other: Money): boolean {
    return this.amount === other.amount && this.currency === other.currency;
  }

  toString(): string {
    return `${this.amount} ${this.currency}`;
  }
}

// 使用例
const price1 = new Money(100, 'JPY');
const price2 = new Money(200, 'JPY');
const total = price1.add(price2); // 300 JPY
```

---

## 📚 実用的なパターン

### リポジトリパターン
```typescript
export interface Repository<T, ID> {
  save(entity: T): Promise<void>;
  findById(id: ID): Promise<T | null>;
  delete(id: ID): Promise<void>;
}

export class BlogPostRepository implements Repository<BlogPost, BlogPostId> {
  async save(blogPost: BlogPost): Promise<void> {
    // 実装
  }

  async findById(id: BlogPostId): Promise<BlogPost | null> {
    // 実装
  }

  async delete(id: BlogPostId): Promise<void> {
    // 実装
  }
}
```

### ファクトリーパターン
```typescript
export class BlogPostFactory {
  static create(title: string, content: string, authorId: AuthorId): BlogPost {
    // バリデーション
    if (!title.trim()) {
      throw new Error('タイトルは必須です');
    }

    // エンティティ作成
    return BlogPost.create(title, content, authorId);
  }

  static reconstruct(
    id: BlogPostId,
    title: string,
    content: string,
    authorId: AuthorId,
    publishedAt: Date | null
  ): BlogPost {
    // データベースから復元する際に使用
    return BlogPost.reconstruct(id, title, content, authorId, publishedAt);
  }
}
```

---

## 📚 参考リンク

- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Domain-Driven Design](https://domainlanguage.com/ddd/)
- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)

---

**📌 重要**: クリーンアーキテクチャでは、これらの概念を組み合わせて、保守性が高く拡張可能なアプリケーションを構築することが重要です。