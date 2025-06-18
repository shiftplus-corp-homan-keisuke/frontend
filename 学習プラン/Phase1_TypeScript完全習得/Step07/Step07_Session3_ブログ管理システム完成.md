# Session3: ブログ管理システム完成（60分）

> 💡 **対象**: Session1-2完了者（Entity・UseCase・Repository・Presenter層実装習得済み）
> 🎯 **形式**: 講師サポート付きシステム統合・完成
> ⏰ **時間**: 60分

## 📚 関連補足資料

システム完成をサポートする補足資料をご用意しています：

- 💻 **[実践コード例](./Step07_補足_実践コード例.md)** - 完全なシステム実装例とベストプラクティス
- 🚨 **[トラブルシューティング](./Step07_補足_トラブルシューティング.md)** - デバッグとエラー解決の完全ガイド
- 📖 **[専門用語集](./Step07_補足_専門用語集.md)** - 高度な概念と用語の詳細解説
- 🌐 **[参考リソース](./Step07_補足_参考リソース.md)** - 継続学習のためのリソース集
- 🔧 **[開発環境ガイド](./Step07_補足_開発環境ガイド.md)** - 効率的な開発環境の活用

> 💡 **活用方法**: 学習中に疑問が生じた際や、より深く理解したい場合に参照してね 🐰

## 📅 セッション概要

**学習目標**:

- [ ] 全レイヤーの統合とブログ管理システムの完成
- [ ] エラーハンドリングとバリデーションの実装
- [ ] システム全体のテストと動作確認
- [ ] クリーンアーキテクチャの利点の実感と振り返り

**前提知識**:

- Session1-2の内容（Entity・UseCase・Repository・Presenter層の設計と実装）
- 依存性注入（DI）コンテナの実装
- TypeScriptの実践的な活用経験

---

## ⏰ 詳細タイムテーブル

| 時間         | 内容                       | 講師の役割                 | 学習者の活動   | 成果物       |
| ------------ | -------------------------- | -------------------------- | -------------- | ------------ |
| **0-10分**   | 最終課題説明・目標設定     | 課題説明・期待値設定       | 理解・質問     | 実装計画     |
| **10-40分**  | システム統合・完成         | 個別サポート・デバッグ支援 | 開発・完成     | 完成システム |
| **40-60分**  | 成果発表・総括・次ステップ | 評価・フィードバック       | 発表・振り返り | 学習成果     |

---

## 🎯 最終課題：ブログ管理システム完成

> 📚 **実装サポート**: [実践コード例 - ブログ管理システム完全版](./Step07_補足_実践コード例.md#ブログ管理システム完全版) | [トラブルシューティング - デバッグガイド](./Step07_補足_トラブルシューティング.md#デバッグのコツ)

### 課題概要

Session1-2で作成したレイヤーを統合し、完全に動作するブログ管理システムを完成させてください。

### 必須実装機能

#### 1. システム統合とアプリケーション起動

```typescript
// main.ts - アプリケーションエントリーポイント
import { BlogApplication } from './infrastructure/BlogApplication';
import { BlogController } from './infrastructure/BlogController';
import { 
  AuthorId, 
  AuthorName, 
  Email, 
  CategoryId, 
  CategoryName 
} from './domain/valueObjects';
import { Author } from './domain/entities/Author';
import { Category } from './domain/entities/Category';

async function initializeApplication(): Promise<BlogApplication> {
  const app = new BlogApplication();
  
  // 初期データの投入
  await setupInitialData(app);
  
  return app;
}

async function setupInitialData(app: BlogApplication): Promise<void> {
  const authorRepo = app.getRepository<IAuthorRepository>('AuthorRepository');
  const categoryRepo = app.getRepository<ICategoryRepository>('CategoryRepository');

  // 著者データの作成
  const author1 = new Author(
    new AuthorId('author_1'),
    new AuthorName('山田太郎'),
    new Email('yamada@example.com'),
    'TypeScript愛好家。クリーンアーキテクチャの実践者。',
    new Date(),
    new Date()
  );

  const author2 = new Author(
    new AuthorId('author_2'),
    new AuthorName('佐藤花子'),
    new Email('sato@example.com'),
    'フロントエンド開発者。React、Vue.jsが得意。',
    new Date(),
    new Date()
  );

  await authorRepo.save(author1);
  await authorRepo.save(author2);

  // カテゴリデータの作成
  const category1 = new Category(
    new CategoryId('category_1'),
    new CategoryName('技術'),
    'プログラミングや開発に関する記事',
    new Date(),
    new Date()
  );

  const category2 = new Category(
    new CategoryId('category_2'),
    new CategoryName('設計'),
    'ソフトウェア設計やアーキテクチャに関する記事',
    new Date(),
    new Date()
  );

  await categoryRepo.save(category1);
  await categoryRepo.save(category2);

  console.log('✅ 初期データの投入が完了しました');
}

async function demonstrateSystem(): Promise<void> {
  console.log('🚀 ブログ管理システムのデモンストレーション開始\n');

  const app = await initializeApplication();
  const controller = new BlogController(app);

  try {
    // 1. ブログ記事の作成
    console.log('📝 ブログ記事を作成します...');
    await controller.createBlogPost(
      'クリーンアーキテクチャ入門',
      'クリーンアーキテクチャは、ソフトウェアの保守性・テスタビリティ・拡張性を向上させる設計手法です。この記事では、TypeScriptを使った実装方法について詳しく解説します。',
      'author_1',
      'category_2'
    );

    await controller.createBlogPost(
      'TypeScriptの型安全性',
      'TypeScriptの型システムを活用することで、実行時エラーを大幅に削減できます。特にクリーンアーキテクチャとの組み合わせは非常に強力です。',
      'author_1',
      'category_1'
    );

    await controller.createBlogPost(
      'Reactでの状態管理',
      'Reactアプリケーションにおける効果的な状態管理について、ReduxやuseReducerを使った実装例を紹介します。',
      'author_2',
      'category_1'
    );

    console.log('\n');

    // 2. ブログ記事の公開
    console.log('📢 ブログ記事を公開します...');
    const blogRepo = app.getRepository<IBlogPostRepository>('BlogPostRepository');
    const allPosts = await blogRepo.findAll();
    
    if (allPosts.length > 0) {
      await controller.publishBlogPost(allPosts[0].getId().getValue());
      await controller.publishBlogPost(allPosts[1].getId().getValue());
    }

    console.log('\n');

    // 3. 公開済み記事の一覧表示
    console.log('📚 公開済み記事の一覧を表示します...');
    await controller.getPublishedPosts();

    console.log('\n');

    // 4. 著者別記事の表示
    console.log('👤 著者別の記事を表示します...');
    await controller.getBlogPostsByAuthor('author_1');

    console.log('\n');

    // 5. カテゴリ別記事の表示
    console.log('🏷️ カテゴリ別の記事を表示します...');
    await controller.getBlogPostsByCategory('category_1');

    console.log('\n');

    // 6. 記事の更新
    console.log('✏️ 記事を更新します...');
    if (allPosts.length > 0) {
      await controller.updateBlogPost(
        allPosts[2].getId().getValue(),
        'Reactでの状態管理（改訂版）',
        'Reactアプリケーションにおける効果的な状態管理について、最新のHooksやContext APIを使った実装例を詳しく紹介します。'
      );
    }

    console.log('\n');

    // 7. システム統計の表示
    console.log('📊 システム統計を表示します...');
    await controller.getSystemStats();

  } catch (error) {
    console.error('❌ エラーが発生しました:', error);
  }

  console.log('\n🎉 デモンストレーション完了！');
}

// アプリケーション実行
demonstrateSystem().catch(console.error);
```

#### 2. 拡張されたBlogControllerの実装

```typescript
// infrastructure/BlogController.ts
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

  async updateBlogPost(blogPostId: string, title: string, content: string): Promise<void> {
    const useCase = this.app.getUseCase<UpdateBlogPostUseCase>('UpdateBlogPostUseCase');
    await useCase.execute({ blogPostId, title, content });
  }

  async deleteBlogPost(blogPostId: string): Promise<void> {
    const useCase = this.app.getUseCase<DeleteBlogPostUseCase>('DeleteBlogPostUseCase');
    await useCase.execute({ blogPostId });
  }

  async getPublishedPosts(): Promise<void> {
    const useCase = this.app.getUseCase<GetPublishedBlogPostsUseCase>('GetPublishedBlogPostsUseCase');
    await useCase.execute();
  }

  async getBlogPostsByAuthor(authorId: string): Promise<void> {
    const useCase = this.app.getUseCase<GetBlogPostsByAuthorUseCase>('GetBlogPostsByAuthorUseCase');
    await useCase.execute({ authorId });
  }

  async getBlogPostsByCategory(categoryId: string): Promise<void> {
    const useCase = this.app.getUseCase<GetBlogPostsByCategoryUseCase>('GetBlogPostsByCategoryUseCase');
    await useCase.execute({ categoryId });
  }

  async createCategory(name: string, description: string): Promise<void> {
    const useCase = this.app.getUseCase<CreateCategoryUseCase>('CreateCategoryUseCase');
    await useCase.execute({ name, description });
  }

  async createAuthor(name: string, email: string, bio: string): Promise<void> {
    const useCase = this.app.getUseCase<CreateAuthorUseCase>('CreateAuthorUseCase');
    await useCase.execute({ name, email, bio });
  }

  async getSystemStats(): Promise<void> {
    const useCase = this.app.getUseCase<GetSystemStatsUseCase>('GetSystemStatsUseCase');
    await useCase.execute();
  }
}
```

#### 3. 追加UseCaseの実装

```typescript
// application/usecases/UpdateBlogPostUseCase.ts
export interface UpdateBlogPostRequest {
  blogPostId: string;
  title: string;
  content: string;
}

export class UpdateBlogPostUseCase {
  constructor(
    private readonly blogPostRepository: IBlogPostRepository,
    private readonly presenter: IBlogPostPresenter
  ) {}

  async execute(request: UpdateBlogPostRequest): Promise<void> {
    try {
      const blogPostId = new BlogPostId(request.blogPostId);
      const title = new BlogTitle(request.title);
      const content = new BlogContent(request.content);

      // ブログ記事の取得
      const blogPost = await this.blogPostRepository.findById(blogPostId);
      if (!blogPost) {
        throw new BlogPostNotFoundError(blogPostId);
      }

      // 更新処理（ドメインロジック）
      blogPost.updateContent(title, content);

      // 保存
      await this.blogPostRepository.save(blogPost);

      // 成功レスポンス
      this.presenter.presentSuccess('ブログ記事を更新しました');
      await this.presenter.presentBlogPost(blogPost);
    } catch (error) {
      this.presenter.presentError(error as Error);
    }
  }
}

// application/usecases/GetBlogPostsByAuthorUseCase.ts
export interface GetBlogPostsByAuthorRequest {
  authorId: string;
}

export class GetBlogPostsByAuthorUseCase {
  constructor(
    private readonly blogPostRepository: IBlogPostRepository,
    private readonly authorRepository: IAuthorRepository,
    private readonly presenter: IBlogPostPresenter
  ) {}

  async execute(request: GetBlogPostsByAuthorRequest): Promise<void> {
    try {
      const authorId = new AuthorId(request.authorId);

      // 著者の存在確認
      const author = await this.authorRepository.findById(authorId);
      if (!author) {
        throw new AuthorNotFoundError(authorId);
      }

      // 著者の記事を取得
      const blogPosts = await this.blogPostRepository.findByAuthorId(authorId);

      // レスポンス
      console.log(`👤 ${author.getName().getValue()}さんの記事 (${blogPosts.length}件):`);
      await this.presenter.presentBlogPostList(blogPosts);
    } catch (error) {
      this.presenter.presentError(error as Error);
    }
  }
}

// application/usecases/GetSystemStatsUseCase.ts
export class GetSystemStatsUseCase {
  constructor(
    private readonly blogPostRepository: IBlogPostRepository,
    private readonly categoryRepository: ICategoryRepository,
    private readonly authorRepository: IAuthorRepository
  ) {}

  async execute(): Promise<void> {
    try {
      const totalPosts = await this.blogPostRepository.count();
      const publishedPosts = await this.blogPostRepository.countByStatus(BlogStatus.PUBLISHED);
      const draftPosts = await this.blogPostRepository.countByStatus(BlogStatus.DRAFT);
      const totalCategories = await this.categoryRepository.count();
      const totalAuthors = await this.authorRepository.count();

      console.log('📊 システム統計:');
      console.log(`   総記事数: ${totalPosts}件`);
      console.log(`   公開済み: ${publishedPosts}件`);
      console.log(`   下書き: ${draftPosts}件`);
      console.log(`   カテゴリ数: ${totalCategories}件`);
      console.log(`   著者数: ${totalAuthors}人`);
      console.log(`   公開率: ${totalPosts > 0 ? Math.round((publishedPosts / totalPosts) * 100) : 0}%`);
    } catch (error) {
      console.error('統計情報の取得に失敗しました:', error);
    }
  }
}
```

#### 4. エラーハンドリングとバリデーションの強化

```typescript
// domain/errors/DomainErrors.ts
export class DomainError extends Error {
  constructor(message: string, public readonly code: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class BlogPostNotFoundError extends DomainError {
  constructor(id: BlogPostId) {
    super(`Blog post not found: ${id.getValue()}`, 'BLOG_POST_NOT_FOUND');
  }
}

export class AuthorNotFoundError extends DomainError {
  constructor(id: AuthorId) {
    super(`Author not found: ${id.getValue()}`, 'AUTHOR_NOT_FOUND');
  }
}

export class CategoryNotFoundError extends DomainError {
  constructor(id: CategoryId) {
    super(`Category not found: ${id.getValue()}`, 'CATEGORY_NOT_FOUND');
  }
}

export class BlogPostAlreadyPublishedError extends DomainError {
  constructor(id: BlogPostId) {
    super(`Blog post is already published: ${id.getValue()}`, 'BLOG_POST_ALREADY_PUBLISHED');
  }
}

export class PublishedPostCannotBeEditedError extends DomainError {
  constructor(id: BlogPostId) {
    super(`Published blog post cannot be edited: ${id.getValue()}`, 'PUBLISHED_POST_CANNOT_BE_EDITED');
  }
}

export class InvalidEmailError extends DomainError {
  constructor(email: string) {
    super(`Invalid email format: ${email}`, 'INVALID_EMAIL');
  }
}

export class DuplicateEmailError extends DomainError {
  constructor(email: string) {
    super(`Email already exists: ${email}`, 'DUPLICATE_EMAIL');
  }
}

// バリデーションエラー
export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export class ValidationErrors extends Error {
  constructor(public readonly errors: ValidationError[]) {
    super('Validation failed');
    this.name = 'ValidationErrors';
  }
}
```

#### 5. 拡張されたDIコンテナ設定

```typescript
// infrastructure/BlogApplication.ts（拡張版）
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

    // 全UseCaseの登録
    this.registerUseCases();
  }

  private registerUseCases(): void {
    // ブログ記事関連UseCase
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
      'UpdateBlogPostUseCase',
      () => new UpdateBlogPostUseCase(
        this.container.resolve<IBlogPostRepository>('BlogPostRepository'),
        this.container.resolve<IBlogPostPresenter>('BlogPostPresenter')
      )
    );

    this.container.register(
      'DeleteBlogPostUseCase',
      () => new DeleteBlogPostUseCase(
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
      'GetBlogPostsByAuthorUseCase',
      () => new GetBlogPostsByAuthorUseCase(
        this.container.resolve<IBlogPostRepository>('BlogPostRepository'),
        this.container.resolve<IAuthorRepository>('AuthorRepository'),
        this.container.resolve<IBlogPostPresenter>('BlogPostPresenter')
      )
    );

    this.container.register(
      'GetBlogPostsByCategoryUseCase',
      () => new GetBlogPostsByCategoryUseCase(
        this.container.resolve<IBlogPostRepository>('BlogPostRepository'),
        this.container.resolve<ICategoryRepository>('CategoryRepository'),
        this.container.resolve<IBlogPostPresenter>('BlogPostPresenter')
      )
    );

    this.container.register(
      'GetSystemStatsUseCase',
      () => new GetSystemStatsUseCase(
        this.container.resolve<IBlogPostRepository>('BlogPostRepository'),
        this.container.resolve<ICategoryRepository>('CategoryRepository'),
        this.container.resolve<IAuthorRepository>('AuthorRepository')
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
}
```

### 実装のヒント

1. **段階的統合**: 一つずつ機能を統合し、動作確認を行う
2. **エラーハンドリング**: 想定される例外ケースを考慮する
3. **ログ出力**: 動作確認のための適切なログ出力
4. **テストデータ**: 実装した機能をテストするためのサンプルデータを用意

### 追加チャレンジ課題（時間に余裕がある場合）

- [ ] 記事の検索機能（タイトル・本文での部分一致検索）
- [ ] 記事のアーカイブ機能
- [ ] 記事の閲覧数カウント機能
- [ ] カテゴリの階層構造対応

---

## 👨‍🏫 学習ポイント

### 🤔 よくある統合時の問題と解決法

**Q: レイヤー間でのデータの受け渡しがうまくいきません**
A: インターフェースの定義を再確認し、依存関係の方向が正しいかチェックしましょう。また、DIコンテナの設定が適切かも確認が必要です。

**Q: エラーハンドリングが複雑になってしまいます**
A: ドメイン例外とアプリケーション例外を明確に分離し、各レイヤーで適切にキャッチして変換することが重要です。

**Q: テストが困難です**
A: 各レイヤーが適切に分離されていれば、モックオブジェクトを使って単体テストが可能です。DIコンテナを活用してテスト用の設定を作成しましょう。

---

## 📊 Step07総合評価

### 最終評価基準

#### アーキテクチャ理解（35%）

- [ ] **レイヤー分離**: 4つのレイヤーが適切に分離されている
- [ ] **依存関係**: 依存関係逆転の原則が正しく適用されている
- [ ] **責務分離**: 各レイヤーの責務が明確に分かれている

#### 実装品質（30%）

- [ ] **コードの可読性**: 変数名・関数名の適切性
- [ ] **型安全性**: TypeScriptの恩恵を活用
- [ ] **エラーハンドリング**: 適切な例外処理の実装
- [ ] **動作確認**: 実装した機能の正常動作

#### 設計思想の理解（25%）

- [ ] **ドメインモデリング**: ビジネスルールがEntityに適切に実装されている
- [ ] **依存性注入**: DIパターンが正しく実装されている
- [ ] **インターフェース分離**: 適切なインターフェース設計

#### 学習姿勢（10%）

- [ ] **積極性**: 質問・議論への参加
- [ ] **問題解決**: 自力でのデバッグ・調査
- [ ] **振り返り**: 学習内容の整理・次ステップの計画

---

## 成果物

- [ ] **ブログ管理システム**: クリーンアーキテクチャで設計された完全動作システム → [Step07成果物](./Step07_成果物.md)で詳細確認

---

## 🔄 Step08への準備

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
- クリーンアーキテクチャの4つのレイヤーの実装
- 依存関係逆転の原則（DIP）の実践
- Repository パターンとPresenter パターン
- 依存性注入（DI）の実装
- 実践的なTypeScriptアプリケーション開発

**クリーンアーキテクチャの利点を実感できたポイント**:
- **テスタビリティ**: 各レイヤーを独立してテスト可能
- **保守性**: 変更の影響範囲が限定される
- **拡張性**: 新機能の追加が容易
- **技術的負債の軽減**: 明確な責務分離により品質向上

**次のステップ**:
- 外部ライブラリとの統合
- 型定義ファイルの作成と活用
- より大規模なプロジェクトでの設計パターン

---

**🎉 お疲れ様でした！** Step07を通じてクリーンアーキテクチャの実践的な実装方法をマスターできました。

**🚀 次のStep08では、外部ライブラリとの統合と型定義について学習します！**