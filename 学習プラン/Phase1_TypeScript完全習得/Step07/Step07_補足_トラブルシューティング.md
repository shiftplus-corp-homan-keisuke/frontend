# Step07 トラブルシューティング

> 💡 **このファイルについて**: クリーンアーキテクチャ実装でよくあるエラーと解決方法をまとめたガイドです。

## 📋 目次
1. [レイヤー分離エラー](#レイヤー分離エラー)
2. [依存性注入エラー](#依存性注入エラー)
3. [ドメインモデルエラー](#ドメインモデルエラー)
4. [リポジトリパターンエラー](#リポジトリパターンエラー)

---

## レイヤー分離エラー

### "Circular dependency detected" エラー
**原因**: レイヤー間の循環依存

**問題のあるコード**:
```typescript
// domain/entities/BlogPost.ts
import { BlogPostRepository } from '../repositories/BlogPostRepository';

export class BlogPost {
  // ドメインエンティティがリポジトリに依存している（間違い）
  constructor(private repository: BlogPostRepository) {}
}
```

**解決方法**:
```typescript
// 正しい依存関係の方向
// domain/entities/BlogPost.ts
export class BlogPost {
  // エンティティは他のレイヤーに依存しない
  constructor(
    private readonly _id: BlogPostId,
    private _title: Title,
    private _content: Content
  ) {}
}

// application/usecases/CreateBlogPostUseCase.ts
export class CreateBlogPostUseCase {
  // アプリケーション層がドメイン層に依存（正しい）
  constructor(private repository: BlogPostRepository) {}
}
```

### "Cannot import from higher layer" エラー
**原因**: 内側のレイヤーが外側のレイヤーに依存

**解決方法**:
```typescript
// 間違い：ドメイン層がアプリケーション層に依存
// domain/entities/User.ts
// import { CreateUserUseCase } from '../../application/usecases/CreateUserUseCase'; // NG

// 正しい：依存性逆転の原則を適用
// domain/services/UserDomainService.ts
export class UserDomainService {
  constructor(private userRepository: UserRepository) {} // インターフェースに依存
}

// infrastructure/repositories/TypeORMUserRepository.ts
export class TypeORMUserRepository implements UserRepository {
  // インフラ層がドメイン層のインターフェースを実装
}
```

---

## 依存性注入エラー

### "Service not found in container" エラー
**原因**: DIコンテナへの登録漏れ

**解決方法**:
```typescript
// infrastructure/di/containerSetup.ts
export function setupContainer(): DIContainer {
  const container = new DIContainer();

  // 依存関係の順序に注意して登録
  // 1. 最下層（リポジトリ）から登録
  container.register('BlogPostRepository', () => new InMemoryBlogPostRepository(), true);
  container.register('AuthorRepository', () => new InMemoryAuthorRepository(), true);
  
  // 2. ドメインサービス
  container.register('UserDomainService', () => 
    new UserDomainService(container.resolve('UserRepository'))
  );
  
  // 3. アプリケーションサービス（ユースケース）
  container.register('CreateBlogPostUseCase', () => 
    new CreateBlogPostUseCase(
      container.resolve('BlogPostRepository'),
      container.resolve('AuthorRepository'),
      container.resolve('EventPublisher')
    )
  );

  return container;
}
```

### "Cannot resolve circular dependencies" エラー
**解決方法**:
```typescript
// 問題：循環依存
class ServiceA {
  constructor(private serviceB: ServiceB) {}
}

class ServiceB {
  constructor(private serviceA: ServiceA) {}
}

// 解決策1：インターフェース分離
interface ServiceAInterface {
  doSomething(): void;
}

interface ServiceBInterface {
  doSomethingElse(): void;
}

class ServiceA implements ServiceAInterface {
  constructor(private serviceB: ServiceBInterface) {}
}

class ServiceB implements ServiceBInterface {
  constructor(private serviceA: ServiceAInterface) {}
}

// 解決策2：イベント駆動アーキテクチャ
class ServiceA {
  constructor(private eventPublisher: EventPublisher) {}
  
  doSomething(): void {
    // 直接依存せずイベントで通知
    this.eventPublisher.publish(new SomethingHappenedEvent());
  }
}
```

---

## ドメインモデルエラー

### "Value object validation failed" エラー
**原因**: 値オブジェクトのバリデーション不備

**解決方法**:
```typescript
// domain/valueObjects/Email.ts
export class Email {
  constructor(private readonly value: string) {
    this.validate(value);
  }

  private validate(email: string): void {
    if (!email) {
      throw new Error('メールアドレスは必須です');
    }
    
    if (!this.isValidFormat(email)) {
      throw new Error('メールアドレスの形式が正しくありません');
    }
    
    if (email.length > 254) {
      throw new Error('メールアドレスが長すぎます');
    }
  }

  private isValidFormat(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  toString(): string {
    return this.value;
  }

  equals(other: Email): boolean {
    return this.value === other.value;
  }
}

// 使用時のエラーハンドリング
try {
  const email = new Email('invalid-email');
} catch (error) {
  console.error('バリデーションエラー:', error.message);
  // ユーザーにフィードバックを提供
}
```

### "Entity invariant violation" エラー
**解決方法**:
```typescript
// domain/entities/BlogPost.ts
export class BlogPost {
  private constructor(
    private readonly _id: BlogPostId,
    private _title: Title,
    private _content: Content,
    private readonly _authorId: AuthorId,
    private _publishedAt: Date | null = null
  ) {
    this.validateInvariants();
  }

  private validateInvariants(): void {
    if (!this._id) {
      throw new Error('BlogPostIdは必須です');
    }
    
    if (!this._title) {
      throw new Error('タイトルは必須です');
    }
    
    if (!this._content) {
      throw new Error('コンテンツは必須です');
    }
    
    if (!this._authorId) {
      throw new Error('著者IDは必須です');
    }
  }

  publish(): void {
    if (this._publishedAt !== null) {
      throw new Error('この記事は既に公開されています');
    }
    
    // ビジネスルールの検証
    if (this._content.getWordCount() < 10) {
      throw new Error('記事は最低10語以上である必要があります');
    }
    
    this._publishedAt = new Date();
  }
}
```

---

## リポジトリパターンエラー

### "Repository method not implemented" エラー
**解決方法**:
```typescript
// domain/repositories/BlogPostRepository.ts
export interface BlogPostRepository {
  save(blogPost: BlogPost): Promise<void>;
  findById(id: BlogPostId): Promise<BlogPost | null>;
  findByAuthor(authorId: AuthorId): Promise<BlogPost[]>;
  findPublished(): Promise<BlogPost[]>;
  delete(id: BlogPostId): Promise<void>;
}

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
```

### "Data mapping error" エラー
**解決方法**:
```typescript
// infrastructure/repositories/TypeORMBlogPostRepository.ts
export class TypeORMBlogPostRepository implements BlogPostRepository {
  async save(blogPost: BlogPost): Promise<void> {
    try {
      const entity = this.toEntity(blogPost);
      await this.connection.getRepository(BlogPostEntity).save(entity);
    } catch (error) {
      throw new Error(`記事の保存に失敗しました: ${error.message}`);
    }
  }

  async findById(id: BlogPostId): Promise<BlogPost | null> {
    try {
      const entity = await this.connection
        .getRepository(BlogPostEntity)
        .findOne(id.toString());
      
      return entity ? this.toDomain(entity) : null;
    } catch (error) {
      throw new Error(`記事の取得に失敗しました: ${error.message}`);
    }
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
    try {
      return BlogPost.reconstruct(
        new BlogPostId(entity.id),
        new Title(entity.title),
        new Content(entity.content),
        new AuthorId(entity.authorId),
        entity.publishedAt,
        entity.createdAt,
        entity.updatedAt
      );
    } catch (error) {
      throw new Error(`ドメインオブジェクトの復元に失敗しました: ${error.message}`);
    }
  }
}
```

---

## 🚨 緊急時の対処法

### 大量のアーキテクチャエラーが発生した場合
```typescript
// 1. 依存関係の可視化
// package.json に依存関係分析ツールを追加
{
  "devDependencies": {
    "madge": "^5.0.1"
  },
  "scripts": {
    "analyze-deps": "madge --circular --extensions ts ./src"
  }
}

// 2. 段階的なリファクタリング
// まず最も内側のレイヤー（ドメイン層）から修正
// domain/entities/BlogPost.ts
export class BlogPost {
  // 外部依存を一切持たない純粋なドメインオブジェクト
}

// 3. インターフェースの明確化
// domain/repositories/BlogPostRepository.ts
export interface BlogPostRepository {
  // 抽象的なインターフェースのみ定義
}
```

### パフォーマンス問題の対処
```typescript
// 1. リポジトリでの効率的なクエリ
export class OptimizedBlogPostRepository implements BlogPostRepository {
  async findByAuthorWithPagination(
    authorId: AuthorId, 
    page: number, 
    limit: number
  ): Promise<BlogPost[]> {
    // ページネーション付きクエリ
    const offset = (page - 1) * limit;
    const entities = await this.connection
      .getRepository(BlogPostEntity)
      .find({
        where: { authorId: authorId.toString() },
        skip: offset,
        take: limit,
        order: { createdAt: 'DESC' }
      });
    
    return entities.map(entity => this.toDomain(entity));
  }
}

// 2. キャッシュ層の追加
export class CachedBlogPostRepository implements BlogPostRepository {
  constructor(
    private readonly repository: BlogPostRepository,
    private readonly cache: CacheService
  ) {}

  async findById(id: BlogPostId): Promise<BlogPost | null> {
    const cacheKey = `blogpost:${id.toString()}`;
    const cached = await this.cache.get(cacheKey);
    
    if (cached) {
      return this.deserialize(cached);
    }
    
    const blogPost = await this.repository.findById(id);
    if (blogPost) {
      await this.cache.set(cacheKey, this.serialize(blogPost), 300); // 5分キャッシュ
    }
    
    return blogPost;
  }
}
```

### テストでの問題対処
```typescript
// tests/testUtils/TestContainer.ts
export function createTestContainer(): DIContainer {
  const container = new DIContainer();
  
  // テスト用のモックを登録
  container.register('BlogPostRepository', () => new InMemoryBlogPostRepository(), true);
  container.register('EventPublisher', () => new MockEventPublisher(), true);
  
  return container;
}

// tests/domain/entities/BlogPost.test.ts
describe('BlogPost', () => {
  test('不正なデータでの作成はエラーになる', () => {
    expect(() => {
      new Title(''); // 空のタイトル
    }).toThrow('タイトルは必須です');
    
    expect(() => {
      new Content(''); // 空のコンテンツ
    }).toThrow('コンテンツは必須です');
  });
});
```

---

## 📚 デバッグのベストプラクティス

### ログ出力の活用
```typescript
// infrastructure/logging/Logger.ts
export interface Logger {
  info(message: string, context?: any): void;
  error(message: string, error?: Error, context?: any): void;
  debug(message: string, context?: any): void;
}

// application/usecases/CreateBlogPostUseCase.ts
export class CreateBlogPostUseCase {
  constructor(
    private readonly blogPostRepository: BlogPostRepository,
    private readonly logger: Logger
  ) {}

  async execute(command: CreateBlogPostCommand): Promise<BlogPostId> {
    this.logger.info('記事作成開始', { authorId: command.authorId });
    
    try {
      const blogPost = BlogPost.create(
        new Title(command.title),
        new Content(command.content),
        new AuthorId(command.authorId)
      );
      
      await this.blogPostRepository.save(blogPost);
      
      this.logger.info('記事作成完了', { 
        blogPostId: blogPost.id.toString(),
        title: command.title 
      });
      
      return blogPost.id;
    } catch (error) {
      this.logger.error('記事作成失敗', error, { command });
      throw error;
    }
  }
}
```

---

**📌 重要**: クリーンアーキテクチャでは、エラーが発生した時に各レイヤーの責任を明確にし、適切な境界でエラーハンドリングを行うことが重要です。依存関係の方向を常に意識して問題を解決しましょう。