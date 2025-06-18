# Step 7: クリーンアーキテクチャ完全理解

> 💡 **補足資料**: 詳細な解説は以下の補足資料を見てね 🐰
>
> - 📖 [専門用語集](./Step07_補足_専門用語集.md) - クリーンアーキテクチャ・DDD・SOLID原則の重要な概念と用語の詳細解説
> - 💻 [実践コード例](./Step07_補足_実践コード例.md) - 段階的な学習用コード集
> - 🚨 [トラブルシューティング](./Step07_補足_トラブルシューティング.md) - よくあるエラーと解決方法
> - 📚 [参考リソース](./Step07_補足_参考リソース.md) - 学習に役立つリンク集
> - 📋 [補足資料](./Step07_補足資料.md) - その他の重要な補足情報

## 📅 学習期間・目標

**期間**: Step 7  
**総学習時間**: 3 時間  
**学習スタイル**: 理論 30% + 実践コード 50% + 演習 20%

### 🎯 Step 7 到達目標

- [ ] クリーンアーキテクチャの4つのレイヤーの理解と実装
- [ ] 依存関係逆転の原則（DIP）の実践的理解
- [ ] Entity層とUseCase層の設計・実装
- [ ] Repository パターンとPresenter パターンの実装
- [ ] 依存性注入（DI）を活用した疎結合設計
- [ ] TypeScriptでのクリーンアーキテクチャ実装

## 📚 クリーンアーキテクチャ概要

### 🎯 ブログ管理システム仕様

**💡 なぜクリーンアーキテクチャが重要なのか**

クリーンアーキテクチャは、ソフトウェアの保守性・テスタビリティ・拡張性を向上させる設計手法です。ビジネスロジックを外部の詳細（UI、データベース、フレームワーク）から独立させることで、変更に強く、テストしやすいシステムを構築できます。特にTypeScriptの型システムと組み合わせることで、コンパイル時に依存関係の正しさを検証でき、より安全で保守しやすいコードを書くことができます。

**🎯 どういう場面で使うのか**

- **大規模Webアプリケーション開発**: 複雑なビジネスロジックを持つシステム
- **長期保守プロジェクト**: 数年にわたって開発・保守されるシステム
- **チーム開発**: 複数の開発者が協力して開発するプロジェクト
- **テスト駆動開発**: 高いテストカバレッジが求められるシステム
- **技術スタック変更**: UIフレームワークやデータベースの変更が予想されるシステム

#### 1. クリーンアーキテクチャの4つのレイヤー

```typescript
// 💡 詳細解説: クリーンアーキテクチャ → Step07_補足_専門用語集.md#クリーンアーキテクチャ
// 💡 詳細解説: 依存関係逆転の原則 → Step07_補足_専門用語集.md#依存関係逆転の原則

/**
 * Entity層（エンティティ層）
 * - ビジネスルールとドメインロジックを含む
 * - 外部の変更に最も影響を受けにくい
 * - アプリケーション固有のビジネスルール
 */

// ブログ記事エンティティ
export class BlogPost {
  constructor(
    private readonly id: BlogPostId,
    private title: BlogTitle,
    private content: BlogContent,
    private status: BlogStatus,
    private readonly authorId: AuthorId,
    private categoryId: CategoryId,
    private readonly createdAt: Date,
    private updatedAt: Date,
    private publishedAt?: Date
  ) {}

  // ドメインロジック: 記事の公開
  public publish(): void {
    if (this.status === BlogStatus.DRAFT) {
      this.status = BlogStatus.PUBLISHED;
      this.publishedAt = new Date();
      this.updatedAt = new Date();
    } else {
      throw new BlogPostAlreadyPublishedError(this.id);
    }
  }

  // ドメインロジック: 記事の更新
  public updateContent(title: BlogTitle, content: BlogContent): void {
    if (this.status === BlogStatus.PUBLISHED) {
      throw new PublishedPostCannotBeEditedError(this.id);
    }
    
    this.title = title;
    this.content = content;
    this.updatedAt = new Date();
  }

  // ドメインロジック: カテゴリの変更
  public changeCategory(categoryId: CategoryId): void {
    this.categoryId = categoryId;
    this.updatedAt = new Date();
  }

  // ゲッター（読み取り専用アクセス）
  public getId(): BlogPostId { return this.id; }
  public getTitle(): BlogTitle { return this.title; }
  public getContent(): BlogContent { return this.content; }
  public getStatus(): BlogStatus { return this.status; }
  public getAuthorId(): AuthorId { return this.authorId; }
  public getCategoryId(): CategoryId { return this.categoryId; }
  public getCreatedAt(): Date { return this.createdAt; }
  public getUpdatedAt(): Date { return this.updatedAt; }
  public getPublishedAt(): Date | undefined { return this.publishedAt; }
}

// 値オブジェクト（Value Objects）
export class BlogPostId {
  constructor(private readonly value: string) {
    if (!value || value.trim().length === 0) {
      throw new InvalidBlogPostIdError(value);
    }
  }

  public getValue(): string { return this.value; }
  public equals(other: BlogPostId): boolean {
    return this.value === other.value;
  }
}

export class BlogTitle {
  constructor(private readonly value: string) {
    if (!value || value.trim().length === 0) {
      throw new InvalidBlogTitleError('タイトルは必須です');
    }
    if (value.length > 100) {
      throw new InvalidBlogTitleError('タイトルは100文字以内で入力してください');
    }
  }

  public getValue(): string { return this.value; }
}

export class BlogContent {
  constructor(private readonly value: string) {
    if (!value || value.trim().length === 0) {
      throw new InvalidBlogContentError('本文は必須です');
    }
    if (value.length > 10000) {
      throw new InvalidBlogContentError('本文は10000文字以内で入力してください');
    }
  }

  public getValue(): string { return this.value; }
}

// 列挙型
export enum BlogStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived'
}

// カテゴリエンティティ
export class Category {
  constructor(
    private readonly id: CategoryId,
    private name: CategoryName,
    private description: string,
    private readonly createdAt: Date,
    private updatedAt: Date
  ) {}

  public updateInfo(name: CategoryName, description: string): void {
    this.name = name;
    this.description = description;
    this.updatedAt = new Date();
  }

  // ゲッター
  public getId(): CategoryId { return this.id; }
  public getName(): CategoryName { return this.name; }
  public getDescription(): string { return this.description; }
  public getCreatedAt(): Date { return this.createdAt; }
  public getUpdatedAt(): Date { return this.updatedAt; }
}

// 著者エンティティ
export class Author {
  constructor(
    private readonly id: AuthorId,
    private name: AuthorName,
    private email: Email,
    private bio: string,
    private readonly createdAt: Date,
    private updatedAt: Date
  ) {}

  public updateProfile(name: AuthorName, bio: string): void {
    this.name = name;
    this.bio = bio;
    this.updatedAt = new Date();
  }

  // ゲッター
  public getId(): AuthorId { return this.id; }
  public getName(): AuthorName { return this.name; }
  public getEmail(): Email { return this.email; }
  public getBio(): string { return this.bio; }
  public getCreatedAt(): Date { return this.createdAt; }
  public getUpdatedAt(): Date { return this.updatedAt; }
}
```

**📝 Entity層の設計ポイント**

- **ビジネスルールの集約**: ドメインに関するすべてのルールをエンティティに集約
- **不変性の確保**: 値オブジェクトは不変（Immutable）に設計
- **バリデーションの実装**: 不正な状態を作らせない設計
- **外部依存の排除**: データベースやUIに依存しない純粋なビジネスロジック

#### 2. UseCase層（ユースケース層）の設計

```typescript
/**
 * UseCase層（ユースケース層）
 * - アプリケーション固有のビジネスルール
 * - エンティティ間の協調を制御
 * - 外部システムとの境界を定義
 */

// UseCase入力データ
export interface CreateBlogPostRequest {
  title: string;
  content: string;
  authorId: string;
  categoryId: string;
}

export interface PublishBlogPostRequest {
  blogPostId: string;
}

export interface UpdateBlogPostRequest {
  blogPostId: string;
  title: string;
  content: string;
}

// UseCase出力データ
export interface BlogPostResponse {
  id: string;
  title: string;
  content: string;
  status: string;
  authorId: string;
  categoryId: string;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
}

// Repository インターフェース（依存関係逆転）
export interface IBlogPostRepository {
  save(blogPost: BlogPost): Promise<void>;
  findById(id: BlogPostId): Promise<BlogPost | null>;
  findByAuthorId(authorId: AuthorId): Promise<BlogPost[]>;
  findByCategoryId(categoryId: CategoryId): Promise<BlogPost[]>;
  findPublishedPosts(): Promise<BlogPost[]>;
  delete(id: BlogPostId): Promise<void>;
}

export interface ICategoryRepository {
  findById(id: CategoryId): Promise<Category | null>;
  findAll(): Promise<Category[]>;
}

export interface IAuthorRepository {
  findById(id: AuthorId): Promise<Author | null>;
}

// Presenter インターフェース（依存関係逆転）
export interface IBlogPostPresenter {
  presentBlogPost(blogPost: BlogPost): BlogPostResponse;
  presentBlogPostList(blogPosts: BlogPost[]): BlogPostResponse[];
  presentError(error: Error): void;
  presentSuccess(message: string): void;
}

// UseCase実装
export class CreateBlogPostUseCase {
  constructor(
    private readonly blogPostRepository: IBlogPostRepository,
    private readonly categoryRepository: ICategoryRepository,
    private readonly authorRepository: IAuthorRepository,
    private readonly presenter: IBlogPostPresenter
  ) {}

  async execute(request: CreateBlogPostRequest): Promise<void> {
    try {
      // 入力データの検証
      const authorId = new AuthorId(request.authorId);
      const categoryId = new CategoryId(request.categoryId);
      const title = new BlogTitle(request.title);
      const content = new BlogContent(request.content);

      // 著者の存在確認
      const author = await this.authorRepository.findById(authorId);
      if (!author) {
        throw new AuthorNotFoundError(authorId);
      }

      // カテゴリの存在確認
      const category = await this.categoryRepository.findById(categoryId);
      if (!category) {
        throw new CategoryNotFoundError(categoryId);
      }

      // 新しいブログ記事の作成
      const blogPostId = new BlogPostId(this.generateId());
      const now = new Date();
      const blogPost = new BlogPost(
        blogPostId,
        title,
        content,
        BlogStatus.DRAFT,
        authorId,
        categoryId,
        now,
        now
      );

      // 保存
      await this.blogPostRepository.save(blogPost);

      // 成功レスポンス
      this.presenter.presentBlogPost(blogPost);
    } catch (error) {
      this.presenter.presentError(error as Error);
    }
  }

  private generateId(): string {
    return `blog_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

export class PublishBlogPostUseCase {
  constructor(
    private readonly blogPostRepository: IBlogPostRepository,
    private readonly presenter: IBlogPostPresenter
  ) {}

  async execute(request: PublishBlogPostRequest): Promise<void> {
    try {
      const blogPostId = new BlogPostId(request.blogPostId);
      
      // ブログ記事の取得
      const blogPost = await this.blogPostRepository.findById(blogPostId);
      if (!blogPost) {
        throw new BlogPostNotFoundError(blogPostId);
      }

      // 公開処理（ドメインロジック）
      blogPost.publish();

      // 保存
      await this.blogPostRepository.save(blogPost);

      // 成功レスポンス
      this.presenter.presentBlogPost(blogPost);
    } catch (error) {
      this.presenter.presentError(error as Error);
    }
  }
}

export class GetPublishedBlogPostsUseCase {
  constructor(
    private readonly blogPostRepository: IBlogPostRepository,
    private readonly presenter: IBlogPostPresenter
  ) {}

  async execute(): Promise<void> {
    try {
      const publishedPosts = await this.blogPostRepository.findPublishedPosts();
      this.presenter.presentBlogPostList(publishedPosts);
    } catch (error) {
      this.presenter.presentError(error as Error);
    }
  }
}
```

**📝 UseCase層の設計ポイント**

- **単一責任**: 1つのUseCaseは1つのビジネス機能のみを担当
- **依存関係逆転**: インターフェースに依存し、具象クラスに依存しない
- **エラーハンドリング**: 適切な例外処理とエラー通知
- **トランザクション境界**: データの整合性を保つ処理単位の定義

#### 3. Repository層とPresenter層の実装

```typescript
/**
 * Interface Adapter層
 * - 外部システム（DB、UI）とのアダプター
 * - データ形式の変換
 * - 外部ライブラリとの統合
 */

// Repository実装（データアクセス層）
export class InMemoryBlogPostRepository implements IBlogPostRepository {
  private blogPosts: Map<string, BlogPost> = new Map();

  async save(blogPost: BlogPost): Promise<void> {
    this.blogPosts.set(blogPost.getId().getValue(), blogPost);
  }

  async findById(id: BlogPostId): Promise<BlogPost | null> {
    return this.blogPosts.get(id.getValue()) || null;
  }

  async findByAuthorId(authorId: AuthorId): Promise<BlogPost[]> {
    return Array.from(this.blogPosts.values())
      .filter(post => post.getAuthorId().equals(authorId));
  }

  async findByCategoryId(categoryId: CategoryId): Promise<BlogPost[]> {
    return Array.from(this.blogPosts.values())
      .filter(post => post.getCategoryId().equals(categoryId));
  }

  async findPublishedPosts(): Promise<BlogPost[]> {
    return Array.from(this.blogPosts.values())
      .filter(post => post.getStatus() === BlogStatus.PUBLISHED)
      .sort((a, b) => b.getPublishedAt()!.getTime() - a.getPublishedAt()!.getTime());
  }

  async delete(id: BlogPostId): Promise<void> {
    this.blogPosts.delete(id.getValue());
  }
}

// Presenter実装（表示層）
export class ConsoleBlogPostPresenter implements IBlogPostPresenter {
  presentBlogPost(blogPost: BlogPost): BlogPostResponse {
    const response: BlogPostResponse = {
      id: blogPost.getId().getValue(),
      title: blogPost.getTitle().getValue(),
      content: blogPost.getContent().getValue(),
      status: blogPost.getStatus(),
      authorId: blogPost.getAuthorId().getValue(),
      categoryId: blogPost.getCategoryId().getValue(),
      createdAt: blogPost.getCreatedAt(),
      updatedAt: blogPost.getUpdatedAt(),
      publishedAt: blogPost.getPublishedAt()
    };

    console.log('ブログ記事:', JSON.stringify(response, null, 2));
    return response;
  }

  presentBlogPostList(blogPosts: BlogPost[]): BlogPostResponse[] {
    const responses = blogPosts.map(post => this.presentBlogPost(post));
    console.log(`${responses.length}件のブログ記事を取得しました`);
    return responses;
  }

  presentError(error: Error): void {
    console.error('エラーが発生しました:', error.message);
  }

  presentSuccess(message: string): void {
    console.log('成功:', message);
  }
}
```

#### 4. 依存性注入（DI）コンテナの実装

```typescript
/**
 * Framework層
 * - 依存性注入の設定
 * - アプリケーションの起動
 * - 外部フレームワークとの統合
 */

// DIコンテナ
export class DIContainer {
  private services: Map<string, any> = new Map();

  register<T>(key: string, service: T): void {
    this.services.set(key, service);
  }

  resolve<T>(key: string): T {
    const service = this.services.get(key);
    if (!service) {
      throw new Error(`Service not found: ${key}`);
    }
    return service;
  }
}

// アプリケーション設定
export class BlogApplication {
  private container: DIContainer;

  constructor() {
    this.container = new DIContainer();
    this.setupDependencies();
  }

  private setupDependencies(): void {
    // Repository の登録
    this.container.register<IBlogPostRepository>(
      'BlogPostRepository',
      new InMemoryBlogPostRepository()
    );

    this.container.register<ICategoryRepository>(
      'CategoryRepository',
      new InMemoryCategoryRepository()
    );

    this.container.register<IAuthorRepository>(
      'AuthorRepository',
      new InMemoryAuthorRepository()
    );

    // Presenter の登録
    this.container.register<IBlogPostPresenter>(
      'BlogPostPresenter',
      new ConsoleBlogPostPresenter()
    );

    // UseCase の登録
    this.container.register(
      'CreateBlogPostUseCase',
      new CreateBlogPostUseCase(
        this.container.resolve<IBlogPostRepository>('BlogPostRepository'),
        this.container.resolve<ICategoryRepository>('CategoryRepository'),
        this.container.resolve<IAuthorRepository>('AuthorRepository'),
        this.container.resolve<IBlogPostPresenter>('BlogPostPresenter')
      )
    );

    this.container.register(
      'PublishBlogPostUseCase',
      new PublishBlogPostUseCase(
        this.container.resolve<IBlogPostRepository>('BlogPostRepository'),
        this.container.resolve<IBlogPostPresenter>('BlogPostPresenter')
      )
    );
  }

  public getUseCase<T>(key: string): T {
    return this.container.resolve<T>(key);
  }
}

// アプリケーション実行例
export class BlogController {
  constructor(private app: BlogApplication) {}

  async createBlogPost(title: string, content: string, authorId: string, categoryId: string): Promise<void> {
    const useCase = this.app.getUseCase<CreateBlogPostUseCase>('CreateBlogPostUseCase');
    await useCase.execute({ title, content, authorId, categoryId });
  }

  async publishBlogPost(blogPostId: string): Promise<void> {
    const useCase = this.app.getUseCase<PublishBlogPostUseCase>('PublishBlogPostUseCase');
    await useCase.execute({ blogPostId });
  }
}
```

## 📊 Step 7 評価基準

#### アーキテクチャ理解 (35%)

- [ ] **レイヤー分離**: 4つのレイヤーが適切に分離されている
- [ ] **依存関係**: 依存関係逆転の原則が正しく適用されている
- [ ] **責務分離**: 各レイヤーの責務が明確に分かれている

#### 依存関係設計 (25%)

- [ ] **インターフェース設計**: 適切なインターフェースが定義されている
- [ ] **DI実装**: 依存性注入が正しく実装されている
- [ ] **疎結合**: 各コンポーネントが疎結合になっている

#### ドメインモデリング (20%)

- [ ] **Entity設計**: ビジネスルールがEntityに適切に実装されている
- [ ] **値オブジェクト**: 値オブジェクトが適切に使用されている
- [ ] **ドメインロジック**: ビジネスロジックが適切な場所に配置されている

#### 実装品質 (20%)

- [ ] **TypeScript活用**: 型安全性が確保されている
- [ ] **エラーハンドリング**: 適切な例外処理が実装されている
- [ ] **コード品質**: 可読性・保守性の高いコードが書かれている

### 成果物

- [ ] **ブログ管理システム**: クリーンアーキテクチャで設計された学習用プロジェクト → [Step07成果物](./Step07_成果物.md)で詳細確認

## 🔄 Step 8 への準備

### 次週学習内容の予習

```typescript
// Step08で学習するライブラリ統合の基礎概念
// 以下のコードを読んで理解しておくこと

// 1. 外部ライブラリの型定義
declare module "some-library" {
  export function someFunction(param: string): number;
}

// 2. d.tsファイルの基本
interface Window {
  customProperty: string;
}

// 3. DefinitelyTypedの活用
// npm install @types/lodash
import _ from "lodash";
```

### 学習の振り返り

**今回学んだこと**:
- クリーンアーキテクチャの4つのレイヤー
- 依存関係逆転の原則（DIP）
- Entity層とUseCase層の設計
- Repository パターンとPresenter パターン
- 依存性注入（DI）の実装

**次のステップ**:
- 外部ライブラリとの統合
- 型定義ファイルの作成と活用
- より大規模なプロジェクトでの設計パターン

---

**🎉 お疲れ様でした！** Step07を通じてクリーンアーキテクチャの基礎をしっかりと身につけることができました。

**🚀 次のStep08では、より高度なライブラリ統合と型定義について学習します！**