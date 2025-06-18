# Session2: レイヤー分離実装演習（90分）

> 💡 **対象**: Session1完了者（Entity層・UseCase層設計習得済み）
> 🎯 **形式**: 講師サポート付き実装演習
> ⏰ **時間**: 90分（休憩含む）

## 📚 関連補足資料

このセッションの学習をサポートする補足資料をご用意しています：

- 💻 **[実践コード例](./Step07_補足_実践コード例.md)** - Repository・Presenter・DI実装の完全ガイド
- 🚨 **[トラブルシューティング](./Step07_補足_トラブルシューティング.md)** - レイヤー分離でよくあるエラーと解決方法
- 📖 **[専門用語集](./Step07_補足_専門用語集.md)** - Repository・DI・SOLID原則の詳細解説
- 🌐 **[参考リソース](./Step07_補足_参考リソース.md)** - 学習に役立つリンク集とリソース
- 🔧 **[開発環境ガイド](./Step07_補足_開発環境ガイド.md)** - 効率的な開発環境の活用

> 💡 **活用方法**: 実装中に疑問が生じた際や、より深く理解したい場合に参照してね 🐰

## 📅 セッション概要

**学習目標**:

- [ ] Repository パターンの実装とデータアクセス層の抽象化
- [ ] Presenter パターンの実装と表示ロジックの分離
- [ ] 依存性注入（DI）コンテナの実装
- [ ] インターフェース分離の原則（ISP）の実践
- [ ] レイヤー間の疎結合設計の実現

**前提知識**:

- Session1の内容（クリーンアーキテクチャ基本概念、Entity層・UseCase層設計）
- TypeScriptのインターフェースとクラス設計
- 非同期処理（Promise、async/await）の理解

---

## ⏰ 詳細タイムテーブル

| 時間         | 内容                       | 講師の役割                 | 学習者の活動   | 成果物       |
| ------------ | -------------------------- | -------------------------- | -------------- | ------------ |
| **0-10分**   | 前回復習・目標設定         | 復習・説明・質疑応答       | 理解・質問     | 理解確認     |
| **10-40分**  | Repository層実装演習       | 実演・個別サポート         | ハンズオン     | Repository実装 |
| **40-70分**  | Presenter層・DI実装演習    | 巡回サポート・ヒント       | 個人作業       | Presenter・DI実装 |
| **70-90分**  | 統合テスト・振り返り       | デバッグ支援・まとめ       | テスト・確認   | 動作確認     |

---

## 📚 学習内容

### Section 1: Repository パターンの実装

> 📚 **関連資料**: [専門用語集 - Repository パターン](./Step07_補足_専門用語集.md#Repository-パターン) | [実践コード例 - Repository実装](./Step07_補足_実践コード例.md#Repository実装)

#### 🔍 データアクセス層の抽象化

**💡 なぜRepository パターンが重要なのか**

Repository パターンは、データアクセスロジックをビジネスロジックから分離し、データの永続化方法を抽象化します。これにより、データベースの種類や実装方法を変更しても、ビジネスロジックに影響を与えることなく、テストしやすく保守しやすいコードを書くことができます。

```typescript
// Repository インターフェース（UseCase層で定義）
export interface IBlogPostRepository {
  save(blogPost: BlogPost): Promise<void>;
  findById(id: BlogPostId): Promise<BlogPost | null>;
  findByAuthorId(authorId: AuthorId): Promise<BlogPost[]>;
  findByCategoryId(categoryId: CategoryId): Promise<BlogPost[]>;
  findPublishedPosts(): Promise<BlogPost[]>;
  findDraftsByAuthor(authorId: AuthorId): Promise<BlogPost[]>;
  delete(id: BlogPostId): Promise<void>;
  count(): Promise<number>;
  countByStatus(status: BlogStatus): Promise<number>;
}

export interface ICategoryRepository {
  save(category: Category): Promise<void>;
  findById(id: CategoryId): Promise<Category | null>;
  findAll(): Promise<Category[]>;
  findByName(name: CategoryName): Promise<Category | null>;
  delete(id: CategoryId): Promise<void>;
  count(): Promise<number>;
}

export interface IAuthorRepository {
  save(author: Author): Promise<void>;
  findById(id: AuthorId): Promise<Author | null>;
  findByEmail(email: Email): Promise<Author | null>;
  findAll(): Promise<Author[]>;
  delete(id: AuthorId): Promise<void>;
  count(): Promise<number>;
}

// InMemory実装（テスト・開発用）
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
      .filter(post => post.getAuthorId().equals(authorId))
      .sort((a, b) => b.getCreatedAt().getTime() - a.getCreatedAt().getTime());
  }

  async findByCategoryId(categoryId: CategoryId): Promise<BlogPost[]> {
    return Array.from(this.blogPosts.values())
      .filter(post => post.getCategoryId().equals(categoryId))
      .sort((a, b) => b.getCreatedAt().getTime() - a.getCreatedAt().getTime());
  }

  async findPublishedPosts(): Promise<BlogPost[]> {
    return Array.from(this.blogPosts.values())
      .filter(post => post.getStatus() === BlogStatus.PUBLISHED)
      .sort((a, b) => {
        const aPublished = a.getPublishedAt();
        const bPublished = b.getPublishedAt();
        if (!aPublished || !bPublished) return 0;
        return bPublished.getTime() - aPublished.getTime();
      });
  }

  async findDraftsByAuthor(authorId: AuthorId): Promise<BlogPost[]> {
    return Array.from(this.blogPosts.values())
      .filter(post => 
        post.getAuthorId().equals(authorId) && 
        post.getStatus() === BlogStatus.DRAFT
      )
      .sort((a, b) => b.getUpdatedAt().getTime() - a.getUpdatedAt().getTime());
  }

  async delete(id: BlogPostId): Promise<void> {
    this.blogPosts.delete(id.getValue());
  }

  async count(): Promise<number> {
    return this.blogPosts.size;
  }

  async countByStatus(status: BlogStatus): Promise<number> {
    return Array.from(this.blogPosts.values())
      .filter(post => post.getStatus() === status)
      .length;
  }

  // テスト用ヘルパーメソッド
  clear(): void {
    this.blogPosts.clear();
  }

  getAll(): BlogPost[] {
    return Array.from(this.blogPosts.values());
  }
}

export class InMemoryCategoryRepository implements ICategoryRepository {
  private categories: Map<string, Category> = new Map();

  async save(category: Category): Promise<void> {
    this.categories.set(category.getId().getValue(), category);
  }

  async findById(id: CategoryId): Promise<Category | null> {
    return this.categories.get(id.getValue()) || null;
  }

  async findAll(): Promise<Category[]> {
    return Array.from(this.categories.values())
      .sort((a, b) => a.getName().getValue().localeCompare(b.getName().getValue()));
  }

  async findByName(name: CategoryName): Promise<Category | null> {
    return Array.from(this.categories.values())
      .find(category => category.getName().getValue() === name.getValue()) || null;
  }

  async delete(id: CategoryId): Promise<void> {
    this.categories.delete(id.getValue());
  }

  async count(): Promise<number> {
    return this.categories.size;
  }

  // テスト用ヘルパーメソッド
  clear(): void {
    this.categories.clear();
  }
}

export class InMemoryAuthorRepository implements IAuthorRepository {
  private authors: Map<string, Author> = new Map();

  async save(author: Author): Promise<void> {
    this.authors.set(author.getId().getValue(), author);
  }

  async findById(id: AuthorId): Promise<Author | null> {
    return this.authors.get(id.getValue()) || null;
  }

  async findByEmail(email: Email): Promise<Author | null> {
    return Array.from(this.authors.values())
      .find(author => author.getEmail().getValue() === email.getValue()) || null;
  }

  async findAll(): Promise<Author[]> {
    return Array.from(this.authors.values())
      .sort((a, b) => a.getName().getValue().localeCompare(b.getName().getValue()));
  }

  async delete(id: AuthorId): Promise<void> {
    this.authors.delete(id.getValue());
  }

  async count(): Promise<number> {
    return this.authors.size;
  }

  // テスト用ヘルパーメソッド
  clear(): void {
    this.authors.clear();
  }
}
```

**📝 Repository実装のポイント**

- **インターフェース分離**: 各エンティティごとに専用のRepositoryを定義
- **非同期処理**: すべてのメソッドをPromiseで統一
- **エラーハンドリング**: 適切な例外処理の実装
- **テスタビリティ**: InMemory実装でテストを容易に

### 練習問題 2.1: Repository実装 🔰

以下の要件に基づいて、BlogPostRepositoryに検索機能を追加してください：

**要件**:
- タイトルでの部分一致検索
- 作成日時の範囲検索
- 複数条件での検索

```typescript
// ここに実装してください
export interface BlogPostSearchCriteria {
  // TODO: 検索条件を定義
}

// IBlogPostRepositoryに以下のメソッドを追加
// search(criteria: BlogPostSearchCriteria): Promise<BlogPost[]>;
```

### Section 2: Presenter パターンの実装

> 📚 **関連資料**: [実践コード例 - Presenter実装](./Step07_補足_実践コード例.md#Presenter実装) | [専門用語集 - Presenter パターン](./Step07_補足_専門用語集.md#Presenter-パターン)

#### 🔍 表示ロジックの分離

**💡 なぜPresenter パターンが重要なのか**

Presenter パターンは、ビジネスロジックと表示ロジックを分離し、データの表示形式を抽象化します。これにより、UI の変更がビジネスロジックに影響を与えることなく、異なる表示形式（Web、モバイル、API）に対応できます。

```typescript
// Presenter インターフェース（UseCase層で定義）
export interface IBlogPostPresenter {
  presentBlogPost(blogPost: BlogPost): BlogPostResponse;
  presentBlogPostList(blogPosts: BlogPost[]): BlogPostListResponse;
  presentBlogPostSummary(blogPost: BlogPost): BlogPostSummaryResponse;
  presentError(error: Error): ErrorResponse;
  presentSuccess(message: string): SuccessResponse;
  presentValidationErrors(errors: ValidationError[]): ValidationErrorResponse;
}

export interface ICategoryPresenter {
  presentCategory(category: Category): CategoryResponse;
  presentCategoryList(categories: Category[]): CategoryListResponse;
  presentCategoryWithStats(category: Category, postCount: number): CategoryWithStatsResponse;
  presentError(error: Error): ErrorResponse;
}

// レスポンス型定義
export interface BlogPostResponse {
  id: string;
  title: string;
  content: string;
  status: string;
  authorId: string;
  authorName: string;
  categoryId: string;
  categoryName: string;
  createdAt: string; // ISO文字列
  updatedAt: string; // ISO文字列
  publishedAt?: string; // ISO文字列
  wordCount: number;
  readingTime: number; // 分
}

export interface BlogPostListResponse {
  posts: BlogPostSummaryResponse[];
  totalCount: number;
  hasMore: boolean;
}

export interface BlogPostSummaryResponse {
  id: string;
  title: string;
  preview: string; // 本文の要約
  status: string;
  authorName: string;
  categoryName: string;
  publishedAt?: string;
  readingTime: number;
}

export interface CategoryResponse {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryWithStatsResponse extends CategoryResponse {
  postCount: number;
  publishedPostCount: number;
}

export interface ErrorResponse {
  error: {
    code: string;
    message: string;
    details?: any;
  };
}

export interface SuccessResponse {
  success: {
    message: string;
  };
}

export interface ValidationErrorResponse {
  validationErrors: {
    field: string;
    message: string;
  }[];
}

// Console Presenter実装（開発・デバッグ用）
export class ConsoleBlogPostPresenter implements IBlogPostPresenter {
  constructor(
    private categoryRepository: ICategoryRepository,
    private authorRepository: IAuthorRepository
  ) {}

  async presentBlogPost(blogPost: BlogPost): Promise<BlogPostResponse> {
    // 関連データの取得
    const author = await this.authorRepository.findById(blogPost.getAuthorId());
    const category = await this.categoryRepository.findById(blogPost.getCategoryId());

    const response: BlogPostResponse = {
      id: blogPost.getId().getValue(),
      title: blogPost.getTitle().getValue(),
      content: blogPost.getContent().getValue(),
      status: blogPost.getStatus(),
      authorId: blogPost.getAuthorId().getValue(),
      authorName: author?.getName().getValue() || 'Unknown',
      categoryId: blogPost.getCategoryId().getValue(),
      categoryName: category?.getName().getValue() || 'Unknown',
      createdAt: blogPost.getCreatedAt().toISOString(),
      updatedAt: blogPost.getUpdatedAt().toISOString(),
      publishedAt: blogPost.getPublishedAt()?.toISOString(),
      wordCount: blogPost.getContent().getWordCount(),
      readingTime: this.calculateReadingTime(blogPost.getContent().getWordCount())
    };

    console.log('📝 ブログ記事:');
    console.log(`   タイトル: ${response.title}`);
    console.log(`   ステータス: ${response.status}`);
    console.log(`   著者: ${response.authorName}`);
    console.log(`   カテゴリ: ${response.categoryName}`);
    console.log(`   文字数: ${response.wordCount}文字`);
    console.log(`   読了時間: ${response.readingTime}分`);
    console.log(`   作成日: ${response.createdAt}`);
    
    return response;
  }

  async presentBlogPostList(blogPosts: BlogPost[]): Promise<BlogPostListResponse> {
    const summaries: BlogPostSummaryResponse[] = [];
    
    for (const post of blogPosts) {
      const author = await this.authorRepository.findById(post.getAuthorId());
      const category = await this.categoryRepository.findById(post.getCategoryId());
      
      summaries.push({
        id: post.getId().getValue(),
        title: post.getTitle().getValue(),
        preview: post.getContent().getPreview(150),
        status: post.getStatus(),
        authorName: author?.getName().getValue() || 'Unknown',
        categoryName: category?.getName().getValue() || 'Unknown',
        publishedAt: post.getPublishedAt()?.toISOString(),
        readingTime: this.calculateReadingTime(post.getContent().getWordCount())
      });
    }

    const response: BlogPostListResponse = {
      posts: summaries,
      totalCount: blogPosts.length,
      hasMore: false // 簡略化
    };

    console.log(`📚 ブログ記事一覧 (${response.totalCount}件):`);
    response.posts.forEach((post, index) => {
      console.log(`   ${index + 1}. ${post.title} (${post.authorName})`);
    });

    return response;
  }

  async presentBlogPostSummary(blogPost: BlogPost): Promise<BlogPostSummaryResponse> {
    const author = await this.authorRepository.findById(blogPost.getAuthorId());
    const category = await this.categoryRepository.findById(blogPost.getCategoryId());

    return {
      id: blogPost.getId().getValue(),
      title: blogPost.getTitle().getValue(),
      preview: blogPost.getContent().getPreview(150),
      status: blogPost.getStatus(),
      authorName: author?.getName().getValue() || 'Unknown',
      categoryName: category?.getName().getValue() || 'Unknown',
      publishedAt: blogPost.getPublishedAt()?.toISOString(),
      readingTime: this.calculateReadingTime(blogPost.getContent().getWordCount())
    };
  }

  presentError(error: Error): ErrorResponse {
    const response: ErrorResponse = {
      error: {
        code: error.name || 'UNKNOWN_ERROR',
        message: error.message,
        details: error.stack
      }
    };

    console.error('❌ エラーが発生しました:');
    console.error(`   コード: ${response.error.code}`);
    console.error(`   メッセージ: ${response.error.message}`);

    return response;
  }

  presentSuccess(message: string): SuccessResponse {
    const response: SuccessResponse = {
      success: { message }
    };

    console.log(`✅ ${message}`);
    return response;
  }

  presentValidationErrors(errors: ValidationError[]): ValidationErrorResponse {
    const response: ValidationErrorResponse = {
      validationErrors: errors.map(error => ({
        field: error.field,
        message: error.message
      }))
    };

    console.error('⚠️ バリデーションエラー:');
    response.validationErrors.forEach(error => {
      console.error(`   ${error.field}: ${error.message}`);
    });

    return response;
  }

  private calculateReadingTime(wordCount: number): number {
    // 日本語の場合、1分間に約400-600文字読めると仮定
    const wordsPerMinute = 500;
    return Math.ceil(wordCount / wordsPerMinute);
  }
}

// JSON Presenter実装（API用）
export class JsonBlogPostPresenter implements IBlogPostPresenter {
  constructor(
    private categoryRepository: ICategoryRepository,
    private authorRepository: IAuthorRepository
  ) {}

  async presentBlogPost(blogPost: BlogPost): Promise<BlogPostResponse> {
    const author = await this.authorRepository.findById(blogPost.getAuthorId());
    const category = await this.categoryRepository.findById(blogPost.getCategoryId());

    return {
      id: blogPost.getId().getValue(),
      title: blogPost.getTitle().getValue(),
      content: blogPost.getContent().getValue(),
      status: blogPost.getStatus(),
      authorId: blogPost.getAuthorId().getValue(),
      authorName: author?.getName().getValue() || 'Unknown',
      categoryId: blogPost.getCategoryId().getValue(),
      categoryName: category?.getName().getValue() || 'Unknown',
      createdAt: blogPost.getCreatedAt().toISOString(),
      updatedAt: blogPost.getUpdatedAt().toISOString(),
      publishedAt: blogPost.getPublishedAt()?.toISOString(),
      wordCount: blogPost.getContent().getWordCount(),
      readingTime: Math.ceil(blogPost.getContent().getWordCount() / 500)
    };
  }

  // 他のメソッドも同様に実装...
}
```

**📝 Presenter実装のポイント**

- **データ変換**: エンティティから表示用データへの変換
- **関連データの取得**: 必要な関連情報の組み立て
- **表示形式の統一**: 日時のフォーマット、計算値の追加
- **複数実装**: Console、JSON、HTMLなど用途に応じた実装

### Section 3: 依存性注入（DI）コンテナの実装

> 📚 **関連資料**: [専門用語集 - 依存性注入](./Step07_補足_専門用語集.md#依存性注入) | [実践コード例 - DI実装](./Step07_補足_実践コード例.md#DI実装)

#### 🔍 疎結合設計の実現

**💡 なぜ依存性注入が重要なのか**

依存性注入（DI）は、オブジェクト間の依存関係を外部から注入することで、疎結合で柔軟なシステムを構築する手法です。テストしやすく、設定変更が容易で、拡張性の高いアーキテクチャを実現できます。

```typescript
// DIコンテナの実装
export interface IDIContainer {
  register<T>(key: string, factory: () => T): void;
  registerSingleton<T>(key: string, factory: () => T): void;
  resolve<T>(key: string): T;
  isRegistered(key: string): boolean;
}

export class DIContainer implements IDIContainer {
  private services: Map<string, () => any> = new Map();
  private singletons: Map<string, any> = new Map();
  private singletonFactories: Set<string> = new Set();

  register<T>(key: string, factory: () => T): void {
    this.services.set(key, factory);
  }

  registerSingleton<T>(key: string, factory: () => T): void {
    this.services.set(key, factory);
    this.singletonFactories.add(key);
  }

  resolve<T>(key: string): T {
    if (!this.services.has(key)) {
      throw new Error(`Service not registered: ${key}`);
    }

    // シングルトンの場合
    if (this.singletonFactories.has(key)) {
      if (!this.singletons.has(key)) {
        const factory = this.services.get(key)!;
        this.singletons.set(key, factory());
      }
      return this.singletons.get(key);
    }

    // 通常のインスタンス
    const factory = this.services.get(key)!;
    return factory();
  }

  isRegistered(key: string): boolean {
    return this.services.has(key);
  }

  // テスト用メソッド
  clear(): void {
    this.services.clear();
    this.singletons.clear();
    this.singletonFactories.clear();
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
    // Repository の登録（シングルトン）
    this.container.registerSingleton<IBlogPostRepository>(
      'BlogPostRepository',
      () => new InMemoryBlogPostRepository()
    );

    this.container.registerSingleton<ICategoryRepository>(
      'CategoryRepository',
      () => new InMemoryCategoryRepository()
    );

    this.container.registerSingleton<IAuthorRepository>(
      'AuthorRepository',
      () => new InMemoryAuthorRepository()
    );

    // Presenter の登録
    this.container.register<IBlogPostPresenter>(
      'BlogPostPresenter',
      () => new ConsoleBlogPostPresenter(
        this.container.resolve<ICategoryRepository>('CategoryRepository'),
        this.container.resolve<IAuthorRepository>('AuthorRepository')
      )
    );

    this.container.register<ICategoryPresenter>(
      'CategoryPresenter',
      () => new ConsoleCategoryPresenter()
    );

    // UseCase の登録
    this.container.register(
      'CreateBlogPostUseCase',
      () => new CreateBlogPostUseCase(
        this.container.resolve<IBlogPostRepository>('BlogPostRepository'),
        this.container.resolve<ICategoryRepository>('CategoryRepository'),
        this.container.resolve<IAuthorRepository>('AuthorRepository'),
        this.container.resolve<IBlogPostPresenter>('BlogPostPresenter')
      )
    );

    this.container.register(
      'PublishBlogPostUseCase',
      () => new PublishBlogPostUseCase(
        this.container.resolve<IBlogPostRepository>('BlogPostRepository'),
        this.container.resolve<IBlogPostPresenter>('BlogPostPresenter')
      )
    );

    this.container.register(
      'GetPublishedBlogPostsUseCase',
      () => new GetPublishedBlogPostsUseCase(
        this.container.resolve<IBlogPostRepository>('BlogPostRepository'),
        this.container.resolve<IBlogPostPresenter>('BlogPostPresenter')
      )
    );

    this.container.register(
      'CreateCategoryUseCase',
      () => new CreateCategoryUseCase(
        this.container.resolve<ICategoryRepository>('CategoryRepository'),
        this.container.resolve<ICategoryPresenter>('CategoryPresenter')
      )
    );
  }

  public getUseCase<T>(key: string): T {
    return this.container.resolve<T>(key);
  }

  public getRepository<T>(key: string): T {
    return this.container.resolve<T>(key);
  }

  public getPresenter<T>(key: string): T {
    return this.container.resolve<T>(key);
  }

  // 設定変更用メソッド
  public useJsonPresenter(): void {
    this.container.register<IBlogPostPresenter>(
      'BlogPostPresenter',
      () => new JsonBlogPostPresenter(
        this.container.resolve<ICategoryRepository>('CategoryRepository'),
        this.container.resolve<IAuthorRepository>('AuthorRepository')
      )
    );
  }

  // テスト用設定
  public setupForTesting(): void {
    // テスト用のモック実装に切り替え
    this.container.register<IBlogPostRepository>(
      'BlogPostRepository',
      () => new MockBlogPostRepository()
    );
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

  async getPublishedPosts(): Promise<void> {
    const useCase = this.app.getUseCase<GetPublishedBlogPostsUseCase>('GetPublishedBlogPostsUseCase');
    await useCase.execute();
  }

  async createCategory(name: string, description: string): Promise<void> {
    const useCase = this.app.getUseCase<CreateCategoryUseCase>('CreateCategoryUseCase');
    await useCase.execute({ name, description });
  }
}
```

**📝 DI実装のポイント**

- **ライフサイクル管理**: シングルトンと通常インスタンスの使い分け
- **循環依存の回避**: 適切な依存関係の設計
- **設定の集約**: 依存関係の設定を一箇所に集約
- **テスタビリティ**: テスト用の設定切り替え機能

### 練習問題 2.2: DI設定 🔰

以下の要件に基づいて、新しいUseCaseをDIコンテナに登録してください：

**要件**:
- UpdateBlogPostUseCase の登録
- DeleteBlogPostUseCase の登録
- GetBlogPostsByAuthorUseCase の登録

```typescript
// ここに実装してください
// BlogApplicationクラスのsetupDependencies()メソッドに追加
```

---

## 🎯 練習問題

> 📚 **サポート資料**: [実践コード例 - レイヤー分離練習](./Step07_補足_実践コード例.
id: post.getId().getValue(),
        title: post.getTitle().getValue(),
        preview: post.getContent().getPreview(150),
        status: post.getStatus(),
        authorName: author?.getName().getValue() || 'Unknown',
        categoryName: category?.getName().getValue() || 'Unknown',
        publishedAt: post.getPublishedAt()?.toISOString(),
        readingTime: this.calculateReadingTime(post.getContent().getWordCount())
      });
    }

    const response: BlogPostListResponse = {
      posts: summaries,
      totalCount: blogPosts.length,
      hasMore: false // 簡略化
    };

    console.log(`📚 ブログ記事一覧 (${response.totalCount}件):`);
    response.posts.forEach((post, index) => {
      console.log(`   ${index + 1}. ${post.title} (${post.authorName})`);
    });

    return response;
  }

  async presentBlogPostSummary(blogPost: BlogPost): Promise<BlogPostSummaryResponse> {
    const author = await this.authorRepository.findById(blogPost.getAuthorId());
    const category = await this.categoryRepository.findById(blogPost.getCategoryId());

    return {
      id: blogPost.getId().getValue(),
      title: blogPost.getTitle().getValue(),
      preview: blogPost.getContent().getPreview(150),
      status: blogPost.getStatus(),
      authorName: author?.getName().getValue() || 'Unknown',
      categoryName: category?.getName().getValue() || 'Unknown',
      publishedAt: blogPost.getPublishedAt()?.toISOString(),
      readingTime: this.calculateReadingTime(blogPost.getContent().getWordCount())
    };
  }

  presentError(error: Error): ErrorResponse {
    const response: ErrorResponse = {
      error: {
        code: error.name || 'UNKNOWN_ERROR',
        message: error.message,
        details: error.stack
      }
    };

    console.error('❌ エラーが発生しました:');
    console.error(`   コード: ${response.error.code}`);
    console.error(`   メッセージ: ${response.error.message}`);

    return response;
  }

  presentSuccess(message: string): SuccessResponse {
    const response: SuccessResponse = {
      success: { message }
    };

    console.log(`✅ ${message}`);
    return response;
  }

  presentValidationErrors(errors: ValidationError[]): ValidationErrorResponse {
    const response: ValidationErrorResponse = {
      validationErrors: errors.map(error => ({
        field: error.field,
        message: error.message
      }))
    };

    console.error('⚠️ バリデーションエラー:');
    response.validationErrors.forEach(error => {
      console.error(`   ${error.field}: ${error.message}`);
    });

    return response;
  }

  private calculateReadingTime(wordCount: number): number {
    // 日本語の場合、1分間に約400-600文字読めると仮定
    const wordsPerMinute = 500;
    return Math.ceil(wordCount / wordsPerMinute);
  }
}

// JSON Presenter実装（API用）
export class JsonBlogPostPresenter implements IBlogPostPresenter {
  constructor(
    private categoryRepository: ICategoryRepository,
    private authorRepository: IAuthorRepository
  ) {}

  async presentBlogPost(blogPost: BlogPost): Promise<BlogPostResponse> {
    const author = await this.authorRepository.findById(blogPost.getAuthorId());
    const category = await this.categoryRepository.findById(blogPost.getCategoryId());

    return {
      id: blogPost.getId().getValue(),
      title: blogPost.getTitle().getValue(),
      content: blogPost.getContent().getValue(),
      status: blogPost.getStatus(),
      authorId: blogPost.getAuthorId().getValue(),
      authorName: author?.getName().getValue() || 'Unknown',
      categoryId: blogPost.getCategoryId().getValue(),
      categoryName: category?.getName().getValue() || 'Unknown',
      createdAt: blogPost.getCreatedAt().toISOString(),
      updatedAt: blogPost.getUpdatedAt().toISOString(),
      publishedAt: blogPost.getPublishedAt()?.toISOString(),
      wordCount: blogPost.getContent().getWordCount(),
      readingTime: Math.ceil(blogPost.getContent().getWordCount() / 500)
    };
  }

  // 他のメソッドも同様に実装...
  async presentBlogPostList(blogPosts: BlogPost[]): Promise<BlogPostListResponse> {
    // 実装省略（ConsoleBlogPostPresenterと同様）
    return { posts: [], totalCount: 0, hasMore: false };
  }

  async presentBlogPostSummary(blogPost: BlogPost): Promise<BlogPostSummaryResponse> {
    // 実装省略
    return { id: '', title: '', preview: '', status: '', authorName: '', categoryName: '', readingTime: 0 };
  }

  presentError(error: Error): ErrorResponse {
    return {
      error: {
        code: error.name || 'UNKNOWN_ERROR',
        message: error.message
      }
    };
  }

  presentSuccess(message: string): SuccessResponse {
    return { success: { message } };
  }

  presentValidationErrors(errors: ValidationError[]): ValidationErrorResponse {
    return {
      validationErrors: errors.map(error => ({
        field: error.field,
        message: error.message
      }))
    };
  }
}
```

**📝 Presenter実装のポイント**

- **データ変換**: エンティティから表示用データへの変換
- **関連データの取得**: 必要な関連情報の組み立て
- **表示形式の統一**: 日時のフォーマット、計算値の追加
- **複数実装**: Console、JSON、HTMLなど用途に応じた実装

### Section 3: 依存性注入（DI）コンテナの実装

> 📚 **関連資料**: [専門用語集 - 依存性注入](./Step07_補足_専門用語集.md#依存性注入) | [実践コード例 - DI実装](./Step07_補足_実践コード例.md#DI実装)

#### 🔍 疎結合設計の実現

**💡 なぜ依存性注入が重要なのか**

依存性注入（DI）は、オブジェクト間の依存関係を外部から注入することで、疎結合で柔軟なシステムを構築する手法です。テストしやすく、設定変更が容易で、拡張性の高いアーキテクチャを実現できます。

```typescript
// DIコンテナの実装
export interface IDIContainer {
  register<T>(key: string, factory: () => T): void;
  registerSingleton<T>(key: string, factory: () => T): void;
  resolve<T>(key: string): T;
  isRegistered(key: string): boolean;
}

export class DIContainer implements IDIContainer {
  private services: Map<string, () => any> = new Map();
  private singletons: Map<string, any> = new Map();
  private singletonFactories: Set<string> = new Set();

  register<T>(key: string, factory: () => T): void {
    this.services.set(key, factory);
  }

  registerSingleton<T>(key: string, factory: () => T): void {
    this.services.set(key, factory);
    this.singletonFactories.add(key);
  }

  resolve<T>(key: string): T {
    if (!this.services.has(key)) {
      throw new Error(`Service not registered: ${key}`);
    }

    // シングルトンの場合
    if (this.singletonFactories.has(key)) {
      if (!this.singletons.has(key)) {
        const factory = this.services.get(key)!;
        this.singletons.set(key, factory());
      }
      return this.singletons.get(key);
    }

    // 通常のインスタンス
    const factory = this.services.get(key)!;
    return factory();
  }

  isRegistered(key: string): boolean {
    return this.services.has(key);
  }

  // テスト用メソッド
  clear(): void {
    this.services.clear();
    this.singletons.clear();
    this.singletonFactories.clear();
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
    // Repository の登録（シングルトン）
    this.container.registerSingleton<IBlogPostRepository>(
      'BlogPostRepository',
      () => new InMemoryBlogPostRepository()
    );

    this.container.registerSingleton<ICategoryRepository>(
      'CategoryRepository',
      () => new InMemoryCategoryRepository()
    );

    this.container.registerSingleton<IAuthorRepository>(
      'AuthorRepository',
      () => new InMemoryAuthorRepository()
    );

    // Presenter の登録
    this.container.register<IBlogPostPresenter>(
      'BlogPostPresenter',
      () => new ConsoleBlogPostPresenter(
        this.container.resolve<ICategoryRepository>('CategoryRepository'),
        this.container.resolve<IAuthorRepository>('AuthorRepository')
      )
    );

    // UseCase の登録
    this.container.register(
      'CreateBlogPostUseCase',
      () => new CreateBlogPostUseCase(
        this.container.resolve<IBlogPostRepository>('BlogPostRepository'),
        this.container.resolve<ICategoryRepository>('CategoryRepository'),
        this.container.resolve<IAuthorRepository>('AuthorRepository'),
        this.container.resolve<IBlogPostPresenter>('BlogPostPresenter')
      )
    );

    this.container.register(
      'PublishBlogPostUseCase',
      () => new PublishBlogPostUseCase(
        this.container.resolve<IBlogPostRepository>('BlogPostRepository'),
        this.container.resolve<IBlogPostPresenter>('BlogPostPresenter')
      )
    );

    this.container.register(
      'GetPublishedBlogPostsUseCase',
      () => new GetPublishedBlogPostsUseCase(
        this.container.resolve<IBlogPostRepository>('BlogPostRepository'),
        this.container.resolve<IBlogPostPresenter>('BlogPostPresenter')
      )
    );
  }

  public getUseCase<T>(key: string): T {
    return this.container.resolve<T>(key);
  }

  public getRepository<T>(key: string): T {
    return this.container.resolve<T>(key);
  }

  public getPresenter<T>(key: string): T {
    return this.container.resolve<T>(key);
  }

  // 設定変更用メソッド
  public useJsonPresenter(): void {
    this.container.register<IBlogPostPresenter>(
      'BlogPostPresenter',
      () => new JsonBlogPostPresenter(
        this.container.resolve<ICategoryRepository>('CategoryRepository'),
        this.container.resolve<IAuthorRepository>('AuthorRepository')
      )
    );
  }

  // テスト用設定
  public setupForTesting(): void {
    // テスト用のモック実装に切り替え
    this.container.register<IBlogPostRepository>(
      'BlogPostRepository',
      () => new MockBlogPostRepository()
    );
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

  async getPublishedPosts(): Promise<void> {
    const useCase = this.app.getUseCase<GetPublishedBlogPostsUseCase>('GetPublishedBlogPostsUseCase');
    await useCase.execute();
  }
}
```

**📝 DI実装のポイント**

- **ライフサイクル管理**: シングルトンと通常インスタンスの使い分け
- **循環依存の回避**: 適切な依存関係の設計
- **設定の集約**: 依存関係の設定を一箇所に集約
- **テスタビリティ**: テスト用の設定切り替え機能

### 練習問題 2.2: DI設定 🔰

以下の要件に基づいて、新しいUseCaseをDIコンテナに登録してください：

**要件**:
- UpdateBlogPostUseCase の登録
- DeleteBlogPostUseCase の登録
- GetBlogPostsByAuthorUseCase の登録

```typescript
// ここに実装してください
// BlogApplicationクラスのsetupDependencies()メソッドに追加
```

---

## 🎯 練習問題

> 📚 **サポート資料**: [実践コード例 - レイヤー分離練習](./Step07_補足_実践コード例.md#レイヤー分離練習) | [トラブルシューティング](./Step07_補足_トラブルシューティング.md#実装関連エラー)

### 練習問題 1: Repository層の拡張（20分）

ブログ管理システムのBlogPostRepositoryに以下の機能を追加してください：

- タイトルでの部分一致検索機能
- 作成日時の範囲検索機能
- 複数条件での複合検索機能
- ページネーション機能

### 練習問題 2: Presenter層の実装（20分）

ブログ管理システムで使用するHTMLBlogPostPresenterを実装してください。以下の機能を考慮してください：

- HTML形式での記事表示
- マークダウンからHTMLへの変換
- SEO用メタデータの生成
- レスポンシブ対応のHTML構造

---

## 👨‍🏫 学習ポイント

### 🤔 よくある質問

**Q: Repository層でビジネスロジックを含めてしまいがちです。どこまでがRepositoryの責務でしょうか？**
A: Repositoryは純粋にデータの永続化・取得のみを担当します。フィルタリングやソートは含めても良いですが、ビジネスルールに関する判定（例：公開可能かどうか）はEntity層で行います。

**Q: Presenterで関連データを取得するのは適切ですか？**
A: 表示に必要な関連データの取得は適切です。ただし、複雑なビジネスロジックは含めず、純粋にデータの変換と表示形式の調整に留めましょう。

**Q: DIコンテナが複雑になりがちです。どう管理すべきでしょうか？**
A: 設定を機能ごとに分割し、環境別の設定ファイルを用意することをお勧めします。また、循環依存を避けるため、依存関係の方向を常に意識しましょう。

---

**📌 重要**: Session2はレイヤー分離の実装技術です。各レイヤーの責務を明確に理解しましょう。

**🌟 次回（Session3）は、全レイヤーを統合してブログ管理システムを完成させます！**