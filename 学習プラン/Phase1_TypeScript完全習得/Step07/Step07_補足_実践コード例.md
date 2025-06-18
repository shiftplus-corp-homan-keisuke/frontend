# Step07 実践コード例

> 💡 **このファイルについて**: クリーンアーキテクチャの段階的な学習のためのコード例集です。

## 📋 目次
1. [ブログ管理システムの基本実装](#ブログ管理システムの基本実装)
2. [レイヤー分離の実装](#レイヤー分離の実装)
3. [依存性注入とテスト](#依存性注入とテスト)

---

## ブログ管理システムの基本実装

### ステップ1: ドメイン層の基本型定義
```typescript
// domain/valueObjects/BlogPostId.ts
export class BlogPostId {
  constructor(private readonly value: string) {
    if (!value.trim()) {
      throw new Error('BlogPostIdは空にできません');
    }
  }

  static generate(): BlogPostId {
    return new BlogPostId(`post_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  }

  equals(other: BlogPostId): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }

  get value(): string {
    return this.value;
  }
}

// domain/valueObjects/Title.ts
export class Title {
  constructor(private readonly value: string) {
    if (!value.trim()) {
      throw new Error('タイトルは必須です');
    }
    if (value.length > 100) {
      throw new Error('タイトルは100文字以内で入力してください');
    }
  }

  toString(): string {
    return this.value;
  }
}

// domain/valueObjects/Content.ts
export class Content {
  constructor(private readonly value: string) {
    if (!value.trim()) {
      throw new Error('コンテンツは必須です');
    }
  }

  toString(): string {
    return this.value;
  }

  getWordCount(): number {
    return this.value.split(/\s+/).length;
  }
}

// domain/valueObjects/AuthorId.ts
export class AuthorId {
  constructor(private readonly value: string) {
    if (!value.trim()) {
      throw new Error('AuthorIdは空にできません');
    }
  }

  equals(other: AuthorId): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
```

### ステップ2: エンティティの実装
```typescript
// domain/entities/BlogPost.ts
export class BlogPost {
  private constructor(
    private readonly _id: BlogPostId,
    private _title: Title,
    private _content: Content,
    private readonly _authorId: AuthorId,
    private _publishedAt: Date | null = null,
    private readonly _createdAt: Date = new Date(),
    private _updatedAt: Date = new Date()
  ) {}

  // ファクトリーメソッド
  static create(title: Title, content: Content, authorId: AuthorId): BlogPost {
    const id = BlogPostId.generate();
    return new BlogPost(id, title, content, authorId);
  }

  // 復元用ファクトリーメソッド（データベースから読み込み時）
  static reconstruct(
    id: BlogPostId,
    title: Title,
    content: Content,
    authorId: AuthorId,
    publishedAt: Date | null,
    createdAt: Date,
    updatedAt: Date
  ): BlogPost {
    return new BlogPost(id, title, content, authorId, publishedAt, createdAt, updatedAt);
  }

  // ビジネスロジック
  publish(): void {
    if (this._publishedAt !== null) {
      throw new Error('この記事は既に公開されています');
    }
    this._publishedAt = new Date();
    this._updatedAt = new Date();
  }

  updateContent(title: Title, content: Content): void {
    this._title = title;
    this._content = content;
    this._updatedAt = new Date();
  }

  // ゲッター
  get id(): BlogPostId { return this._id; }
  get title(): Title { return this._title; }
  get content(): Content { return this._content; }
  get authorId(): AuthorId { return this._authorId; }
  get publishedAt(): Date | null { return this._publishedAt; }
  get createdAt(): Date { return this._createdAt; }
  get updatedAt(): Date { return this._updatedAt; }
  get isPublished(): boolean { return this._publishedAt !== null; }
  get isDraft(): boolean { return this._publishedAt === null; }
}
```

### ステップ3: リポジトリインターフェース
```typescript
// domain/repositories/BlogPostRepository.ts
export interface BlogPostRepository {
  save(blogPost: BlogPost): Promise<void>;
  findById(id: BlogPostId): Promise<BlogPost | null>;
  findByAuthor(authorId: AuthorId): Promise<BlogPost[]>;
  findPublished(): Promise<BlogPost[]>;
  delete(id: BlogPostId): Promise<void>;
}

// domain/repositories/AuthorRepository.ts
export interface AuthorRepository {
  findById(id: AuthorId): Promise<Author | null>;
  existsById(id: AuthorId): Promise<boolean>;
}
```

---

## レイヤー分離の実装

### ステップ4: アプリケーション層のコマンド・クエリ
```typescript
// application/commands/CreateBlogPostCommand.ts
export class CreateBlogPostCommand {
  constructor(
    public readonly title: string,
    public readonly content: string,
    public readonly authorId: string
  ) {}
}

// application/commands/PublishBlogPostCommand.ts
export class PublishBlogPostCommand {
  constructor(
    public readonly blogPostId: string
  ) {}
}

// application/queries/GetBlogPostQuery.ts
export class GetBlogPostQuery {
  constructor(
    public readonly blogPostId: string
  ) {}
}

// application/queries/GetBlogPostsByAuthorQuery.ts
export class GetBlogPostsByAuthorQuery {
  constructor(
    public readonly authorId: string
  ) {}
}
```

### ステップ5: ユースケースの実装
```typescript
// application/usecases/CreateBlogPostUseCase.ts
export class CreateBlogPostUseCase {
  constructor(
    private readonly blogPostRepository: BlogPostRepository,
    private readonly authorRepository: AuthorRepository,
    private readonly eventPublisher: EventPublisher
  ) {}

  async execute(command: CreateBlogPostCommand): Promise<BlogPostId> {
    // バリデーション
    const authorId = new AuthorId(command.authorId);
    if (!(await this.authorRepository.existsById(authorId))) {
      throw new Error('指定された著者が存在しません');
    }

    // ドメインオブジェクト作成
    const title = new Title(command.title);
    const content = new Content(command.content);
    const blogPost = BlogPost.create(title, content, authorId);

    // 永続化
    await this.blogPostRepository.save(blogPost);

    // イベント発行
    await this.eventPublisher.publish(
      new BlogPostCreatedEvent(blogPost.id, blogPost.title.toString(), authorId)
    );

    return blogPost.id;
  }
}

// application/usecases/PublishBlogPostUseCase.ts
export class PublishBlogPostUseCase {
  constructor(
    private readonly blogPostRepository: BlogPostRepository,
    private readonly eventPublisher: EventPublisher
  ) {}

  async execute(command: PublishBlogPostCommand): Promise<void> {
    const blogPostId = new BlogPostId(command.blogPostId);
    const blogPost = await this.blogPostRepository.findById(blogPostId);

    if (!blogPost) {
      throw new Error('指定された記事が見つかりません');
    }

    // ビジネスロジック実行
    blogPost.publish();

    // 永続化
    await this.blogPostRepository.save(blogPost);

    // イベント発行
    await this.eventPublisher.publish(
      new BlogPostPublishedEvent(blogPost.id, blogPost.title.toString())
    );
  }
}

// application/usecases/GetBlogPostUseCase.ts
export class GetBlogPostUseCase {
  constructor(
    private readonly blogPostRepository: BlogPostRepository
  ) {}

  async execute(query: GetBlogPostQuery): Promise<BlogPost | null> {
    const blogPostId = new BlogPostId(query.blogPostId);
    return await this.blogPostRepository.findById(blogPostId);
  }
}
```

### ステップ6: イベントシステム
```typescript
// domain/events/DomainEvent.ts
export abstract class DomainEvent {
  public readonly occurredAt: Date;

  constructor() {
    this.occurredAt = new Date();
  }
}

// domain/events/BlogPostCreatedEvent.ts
export class BlogPostCreatedEvent extends DomainEvent {
  constructor(
    public readonly blogPostId: BlogPostId,
    public readonly title: string,
    public readonly authorId: AuthorId
  ) {
    super();
  }
}

// domain/events/BlogPostPublishedEvent.ts
export class BlogPostPublishedEvent extends DomainEvent {
  constructor(
    public readonly blogPostId: BlogPostId,
    public readonly title: string
  ) {
    super();
  }
}

// application/services/EventPublisher.ts
export interface EventPublisher {
  publish(event: DomainEvent): Promise<void>;
}

// infrastructure/events/InMemoryEventPublisher.ts
export class InMemoryEventPublisher implements EventPublisher {
  private handlers: Map<string, ((event: DomainEvent) => Promise<void>)[]> = new Map();

  subscribe<T extends DomainEvent>(
    eventType: new (...args: any[]) => T,
    handler: (event: T) => Promise<void>
  ): void {
    const eventName = eventType.name;
    if (!this.handlers.has(eventName)) {
      this.handlers.set(eventName, []);
    }
    this.handlers.get(eventName)!.push(handler as any);
  }

  async publish(event: DomainEvent): Promise<void> {
    const eventName = event.constructor.name;
    const handlers = this.handlers.get(eventName) || [];
    
    await Promise.all(handlers.map(handler => handler(event)));
  }
}
```

---

## 依存性注入とテスト

### ステップ7: インフラストラクチャ層の実装
```typescript
// infrastructure/repositories/InMemoryBlogPostRepository.ts
export class InMemoryBlogPostRepository implements BlogPostRepository {
  private blogPosts: Map<string, BlogPost> = new Map();

  async save(blogPost: BlogPost): Promise<void> {
    this.blogPosts.set(blogPost.id.toString(), blogPost);
  }

  async findById(id: BlogPostId): Promise<BlogPost | null> {
    return this.blogPosts.get(id.toString()) || null;
  }

  async findByAuthor(authorId: AuthorId): Promise<BlogPost[]> {
    return Array.from(this.blogPosts.values())
      .filter(post => post.authorId.equals(authorId));
  }

  async findPublished(): Promise<BlogPost[]> {
    return Array.from(this.blogPosts.values())
      .filter(post => post.isPublished);
  }

  async delete(id: BlogPostId): Promise<void> {
    this.blogPosts.delete(id.toString());
  }
}

// infrastructure/repositories/TypeORMBlogPostRepository.ts
export class TypeORMBlogPostRepository implements BlogPostRepository {
  constructor(private readonly connection: Connection) {}

  async save(blogPost: BlogPost): Promise<void> {
    const entity = this.toEntity(blogPost);
    await this.connection.getRepository(BlogPostEntity).save(entity);
  }

  async findById(id: BlogPostId): Promise<BlogPost | null> {
    const entity = await this.connection
      .getRepository(BlogPostEntity)
      .findOne(id.toString());
    
    return entity ? this.toDomain(entity) : null;
  }

  private toEntity(blogPost: BlogPost): BlogPostEntity {
    return {
      id: blogPost.id.toString(),
      title: blogPost.title.toString(),
      content: blogPost.content.toString(),
      authorId: blogPost.authorId.toString(),
      publishedAt: blogPost.publishedAt,
      createdAt: blogPost.createdAt,
      updatedAt: blogPost.updatedAt
    };
  }

  private toDomain(entity: BlogPostEntity): BlogPost {
    return BlogPost.reconstruct(
      new BlogPostId(entity.id),
      new Title(entity.title),
      new Content(entity.content),
      new AuthorId(entity.authorId),
      entity.publishedAt,
      entity.createdAt,
      entity.updatedAt
    );
  }
}
```

### ステップ8: DIコンテナの設定
```typescript
// infrastructure/di/DIContainer.ts
export class DIContainer {
  private services = new Map<string, any>();
  private singletons = new Map<string, any>();

  register<T>(key: string, factory: () => T, singleton: boolean = false): void {
    this.services.set(key, { factory, singleton });
  }

  resolve<T>(key: string): T {
    const service = this.services.get(key);
    if (!service) {
      throw new Error(`Service not found: ${key}`);
    }

    if (service.singleton) {
      if (!this.singletons.has(key)) {
        this.singletons.set(key, service.factory());
      }
      return this.singletons.get(key);
    }

    return service.factory();
  }
}

// infrastructure/di/containerSetup.ts
export function setupContainer(): DIContainer {
  const container = new DIContainer();

  // リポジトリ
  container.register('BlogPostRepository', () => new InMemoryBlogPostRepository(), true);
  container.register('AuthorRepository', () => new InMemoryAuthorRepository(), true);

  // イベント
  container.register('EventPublisher', () => new InMemoryEventPublisher(), true);

  // ユースケース
  container.register('CreateBlogPostUseCase', () => 
    new CreateBlogPostUseCase(
      container.resolve('BlogPostRepository'),
      container.resolve('AuthorRepository'),
      container.resolve('EventPublisher')
    )
  );

  container.register('PublishBlogPostUseCase', () => 
    new PublishBlogPostUseCase(
      container.resolve('BlogPostRepository'),
      container.resolve('EventPublisher')
    )
  );

  return container;
}
```

### ステップ9: プレゼンテーション層
```typescript
// presentation/controllers/BlogPostController.ts
export class BlogPostController {
  constructor(
    private readonly createBlogPostUseCase: CreateBlogPostUseCase,
    private readonly publishBlogPostUseCase: PublishBlogPostUseCase,
    private readonly getBlogPostUseCase: GetBlogPostUseCase
  ) {}

  async createBlogPost(request: CreateBlogPostRequest): Promise<CreateBlogPostResponse> {
    try {
      const command = new CreateBlogPostCommand(
        request.title,
        request.content,
        request.authorId
      );

      const blogPostId = await this.createBlogPostUseCase.execute(command);

      return {
        success: true,
        blogPostId: blogPostId.toString()
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async publishBlogPost(request: PublishBlogPostRequest): Promise<PublishBlogPostResponse> {
    try {
      const command = new PublishBlogPostCommand(request.blogPostId);
      await this.publishBlogPostUseCase.execute(command);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async getBlogPost(request: GetBlogPostRequest): Promise<GetBlogPostResponse> {
    try {
      const query = new GetBlogPostQuery(request.blogPostId);
      const blogPost = await this.getBlogPostUseCase.execute(query);

      if (!blogPost) {
        return {
          success: false,
          error: '記事が見つかりません'
        };
      }

      return {
        success: true,
        blogPost: {
          id: blogPost.id.toString(),
          title: blogPost.title.toString(),
          content: blogPost.content.toString(),
          authorId: blogPost.authorId.toString(),
          isPublished: blogPost.isPublished,
          publishedAt: blogPost.publishedAt,
          createdAt: blogPost.createdAt,
          updatedAt: blogPost.updatedAt
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}
```

### ステップ10: テストの実装
```typescript
// tests/domain/entities/BlogPost.test.ts
describe('BlogPost', () => {
  test('新しい記事を作成できる', () => {
    const title = new Title('テスト記事');
    const content = new Content('これはテスト記事です');
    const authorId = new AuthorId('author-1');

    const blogPost = BlogPost.create(title, content, authorId);

    expect(blogPost.title.toString()).toBe('テスト記事');
    expect(blogPost.content.toString()).toBe('これはテスト記事です');
    expect(blogPost.authorId.toString()).toBe('author-1');
    expect(blogPost.isDraft).toBe(true);
    expect(blogPost.isPublished).toBe(false);
  });

  test('記事を公開できる', () => {
    const blogPost = BlogPost.create(
      new Title('テスト記事'),
      new Content('これはテスト記事です'),
      new AuthorId('author-1')
    );

    blogPost.publish();

    expect(blogPost.isPublished).toBe(true);
    expect(blogPost.publishedAt).not.toBeNull();
  });

  test('既に公開された記事は再公開できない', () => {
    const blogPost = BlogPost.create(
      new Title('テスト記事'),
      new Content('これはテスト記事です'),
      new AuthorId('author-1')
    );

    blogPost.publish();

    expect(() => blogPost.publish()).toThrow('この記事は既に公開されています');
  });
});

// tests/application/usecases/CreateBlogPostUseCase.test.ts
describe('CreateBlogPostUseCase', () => {
  let useCase: CreateBlogPostUseCase;
  let blogPostRepository: BlogPostRepository;
  let authorRepository: AuthorRepository;
  let eventPublisher: EventPublisher;

  beforeEach(() => {
    blogPostRepository = new InMemoryBlogPostRepository();
    authorRepository = new InMemoryAuthorRepository();
    eventPublisher = new InMemoryEventPublisher();
    useCase = new CreateBlogPostUseCase(blogPostRepository, authorRepository, eventPublisher);
  });

  test('記事を作成できる', async () => {
    // 著者を事前に作成
    const authorId = new AuthorId('author-1');
    await authorRepository.save(new Author(authorId, 'テスト著者'));

    const command = new CreateBlogPostCommand(
      'テスト記事',
      'これはテスト記事です',
      'author-1'
    );

    const blogPostId = await useCase.execute(command);

    const savedBlogPost = await blogPostRepository.findById(blogPostId);
    expect(savedBlogPost).not.toBeNull();
    expect(savedBlogPost!.title.toString()).toBe('テスト記事');
  });

  test('存在しない著者の場合はエラーになる', async () => {
    const command = new CreateBlogPostCommand(
      'テスト記事',
      'これはテスト記事です',
      'non-existent-author'
    );

    await expect(useCase.execute(command)).rejects.toThrow('指定された著者が存在しません');
  });
});
```

---

## 🎯 実行とテストの方法

### 基本的な実行方法
```bash
# TypeScriptファイルをコンパイル
npx tsc

# テストの実行
npm test

# 開発サーバーの起動
npm run dev
```

### アプリケーションの起動
```typescript
// main.ts
async function main() {
  // DIコンテナの設定
  const container = setupContainer();

  // イベントハンドラーの設定
  const eventPublisher = container.resolve<EventPublisher>('EventPublisher');
  eventPublisher.subscribe(BlogPostCreatedEvent, async (event) => {
    console.log(`新しい記事が作成されました: ${event.title}`);
  });

  // コントローラーの作成
  const blogPostController = new BlogPostController(
    container.resolve('CreateBlogPostUseCase'),
    container.resolve('PublishBlogPostUseCase'),
    container.resolve('GetBlogPostUseCase')
  );

  // サンプル実行
  const createResult = await blogPostController.createBlogPost({
    title: 'クリーンアーキテクチャ入門',
    content: 'クリーンアーキテクチャについて学びましょう',
    authorId: 'author-1'
  });

  if (createResult.success) {
    console.log('記事が作成されました:', createResult.blogPostId);

    const publishResult = await blogPostController.publishBlogPost({
      blogPostId: createResult.blogPostId!
    });

    if (publishResult.success) {
      console.log('記事が公開されました');
    }
  }
}

main().catch(console.error);
```

---

**📌 重要**: クリーンアーキテクチャでは、これらのレイヤー分離と依存性の管理を適切に行うことで、保守性が高く拡張可能なアプリケーションを構築することが重要です。