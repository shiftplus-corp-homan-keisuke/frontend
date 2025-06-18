# Session1: クリーンアーキテクチャ理論と基本実践（90分）

> 💡 **対象**: Step01-06完了者（ジェネリクス・ユーティリティ型習得済み）
> 🎯 **形式**: 講師サポート付き学習
> ⏰ **時間**: 90分（休憩含む）

## 📚 関連補足資料

このセッションの学習をサポートする補足資料をご用意しています：

- 📖 **[専門用語集](./Step07_補足_専門用語集.md)** - クリーンアーキテクチャ・DDD・SOLID原則の重要な概念と用語の詳細解説
- 💻 **[実践コード例](./Step07_補足_実践コード例.md)** - 段階的な学習のためのコード例集
- 🔧 **[開発環境ガイド](./Step07_補足_開発環境ガイド.md)** - 効率的な開発環境の活用
- 🌐 **[参考リソース](./Step07_補足_参考リソース.md)** - 学習に役立つリンク集とリソース
- 🚨 **[トラブルシューティング](./Step07_補足_トラブルシューティング.md)** - よくあるエラーと解決方法

> 💡 **活用方法**: 学習中に疑問が生じた際や、より深く理解したい場合に参照してね 🐰

## 📅 セッション概要

**学習目標**:

- [ ] クリーンアーキテクチャの基本概念と4つのレイヤーの理解
- [ ] 依存関係逆転の原則（DIP）の実践的理解
- [ ] Entity層の設計とドメインロジックの実装
- [ ] UseCase層の設計とビジネスルールの実装

**前提知識**:

- Step01-06の内容（基本型、インターフェース、ユニオン型、型ガード、ジェネリクス、ユーティリティ型）
- TypeScriptの型システムの実践的理解
- 基本的なWebアプリケーション開発の知識

---

## ⏰ 詳細タイムテーブル

| 時間         | 内容                       | 講師の役割           | 学習者の活動   | 成果物     |
| ------------ | -------------------------- | -------------------- | -------------- | ---------- |
| **0-10分**   | 全体概要・目標設定         | 説明・質疑応答       | 聞く・質問     | 理解確認   |
| **10-30分**  | クリーンアーキテクチャ基本概念 | 要点解説・補足       | 個人学習・確認 | 知識整理   |
| **30-60分**  | Entity層設計実践           | 実演・個別サポート   | ハンズオン     | 基本コード |
| **60-80分**  | UseCase層設計実践          | 巡回サポート・ヒント | 個人作業       | 練習成果   |
| **80-90分**  | 振り返り・次回予告         | まとめ・予告         | 質問・確認     | 学習計画   |

---

## 📚 学習内容

### Section 1: クリーンアーキテクチャの基本概念

> 📚 **関連資料**: [専門用語集 - クリーンアーキテクチャ](./Step07_補足_専門用語集.md#クリーンアーキテクチャ) | [実践コード例 - アーキテクチャ基礎](./Step07_補足_実践コード例.md#アーキテクチャ基礎)

#### 🔍 クリーンアーキテクチャとは何か

**💡 なぜクリーンアーキテクチャが重要なのか**

クリーンアーキテクチャは、ソフトウェアの保守性・テスタビリティ・拡張性を向上させる設計手法です。ビジネスロジックを外部の詳細（UI、データベース、フレームワーク）から独立させることで、変更に強く、テストしやすいシステムを構築できます。特にTypeScriptの型システムと組み合わせることで、コンパイル時に依存関係の正しさを検証でき、より安全で保守しやすいコードを書くことができます。

**🎯 どういう場面で使うのか**

- **大規模Webアプリケーション開発**: 複雑なビジネスロジックを持つシステム
- **長期保守プロジェクト**: 数年にわたって開発・保守されるシステム
- **チーム開発**: 複数の開発者が協力して開発するプロジェクト
- **テスト駆動開発**: 高いテストカバレッジが求められるシステム
- **技術スタック変更**: UIフレームワークやデータベースの変更が予想されるシステム

#### 1. 4つのレイヤーの理解

> 💡 **詳細解説**: 4つのレイヤーの詳細は [Step07_補足_専門用語集.md#4つのレイヤー](./Step07_補足_専門用語集.md#4つのレイヤー) を見てね 🐰

```typescript
/**
 * クリーンアーキテクチャの4つのレイヤー
 * 
 * 1. Entity層（エンティティ層）
 *    - 最も内側のレイヤー
 *    - ビジネスルールとドメインロジック
 *    - 外部の変更に最も影響を受けにくい
 * 
 * 2. UseCase層（ユースケース層）
 *    - アプリケーション固有のビジネスルール
 *    - エンティティ間の協調を制御
 *    - 外部システムとの境界を定義
 * 
 * 3. Interface Adapter層（インターフェースアダプター層）
 *    - 外部システム（DB、UI）とのアダプター
 *    - データ形式の変換
 *    - Repository、Presenter、Controller
 * 
 * 4. Framework層（フレームワーク層）
 *    - 最も外側のレイヤー
 *    - 外部ライブラリ、フレームワーク
 *    - データベース、Web、UI
 */

// 依存関係の方向（重要！）
// Framework → Interface Adapter → UseCase → Entity
// 内側のレイヤーは外側のレイヤーを知らない
```

**📝 レイヤー設計の詳細解説**

- **依存関係の方向**: 外側から内側への一方向のみ
- **責務の分離**: 各レイヤーは明確な責務を持つ
- **変更の影響範囲**: 内側のレイヤーほど変更の影響が少ない
- **テスタビリティ**: 各レイヤーを独立してテスト可能

#### 2. 依存関係逆転の原則（DIP）

```typescript
// ❌ 悪い例：具象クラスに依存
class BadBlogService {
  private database: MySQLDatabase; // 具象クラスに依存

  constructor() {
    this.database = new MySQLDatabase(); // 直接インスタンス化
  }

  async saveBlogPost(post: BlogPost): Promise<void> {
    await this.database.insert('blog_posts', post); // 具体的な実装に依存
  }
}

// ✅ 良い例：抽象（インターフェース）に依存
interface IBlogPostRepository {
  save(post: BlogPost): Promise<void>;
  findById(id: string): Promise<BlogPost | null>;
}

class GoodBlogService {
  constructor(
    private repository: IBlogPostRepository // インターフェースに依存
  ) {}

  async saveBlogPost(post: BlogPost): Promise<void> {
    await this.repository.save(post); // 抽象に依存
  }
}

// 実装は外部で注入
const repository = new MySQLBlogPostRepository(); // または InMemoryBlogPostRepository
const service = new GoodBlogService(repository);
```

**📝 DIPの利点**

- **テスタビリティ**: モックオブジェクトを簡単に注入できる
- **柔軟性**: 実装を簡単に変更できる
- **保守性**: 変更の影響範囲を限定できる

### Section 2: Entity層の設計実践

> 📚 **関連資料**: [実践コード例 - Entity層設計](./Step07_補足_実践コード例.md#Entity層設計) | [専門用語集 - ドメイン駆動設計](./Step07_補足_専門用語集.md#ドメイン駆動設計)

#### 🔍 ブログドメインのモデリング

**💡 なぜEntity層が重要なのか**

Entity層は、ビジネスの核となるルールとロジックを含む最も重要なレイヤーです。ここに適切にドメインロジックを配置することで、ビジネスルールの一貫性を保ち、変更に強いシステムを構築できます。

```typescript
// ブログ記事エンティティの設計
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

  // ドメインロジック: 公開可能かチェック
  public canBePublished(): boolean {
    return this.status === BlogStatus.DRAFT && 
           this.title.getValue().length > 0 && 
           this.content.getValue().length > 0;
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
  
  public getWordCount(): number {
    return this.value.split(/\s+/).length;
  }
  
  public getPreview(length: number = 100): string {
    return this.value.length > length 
      ? this.value.substring(0, length) + '...'
      : this.value;
  }
}

// 列挙型
export enum BlogStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived'
}

// ドメイン例外
export class BlogPostAlreadyPublishedError extends Error {
  constructor(id: BlogPostId) {
    super(`Blog post ${id.getValue()} is already published`);
    this.name = 'BlogPostAlreadyPublishedError';
  }
}

export class PublishedPostCannotBeEditedError extends Error {
  constructor(id: BlogPostId) {
    super(`Published blog post ${id.getValue()} cannot be edited`);
    this.name = 'PublishedPostCannotBeEditedError';
  }
}
```

**📝 Entity設計のポイント**

- **不変性**: 値オブジェクトは不変（Immutable）に設計
- **バリデーション**: コンストラクタで不正な状態を防ぐ
- **ドメインロジック**: ビジネスルールをエンティティ内に実装
- **カプセル化**: 内部状態を適切に隠蔽

### 練習問題 1.1: Entity設計 🔰

以下の要件に基づいて、Categoryエンティティを設計してください：

**要件**:
- カテゴリには名前と説明が必要
- 名前は1-50文字の制限
- 説明は500文字以内
- カテゴリの情報更新機能

```typescript
// ここに実装してください
export class Category {
  // TODO: 適切なプロパティとメソッドを定義
}

export class CategoryId {
  // TODO: 値オブジェクトを実装
}

export class CategoryName {
  // TODO: 値オブジェクトを実装
}
```

### Section 3: UseCase層の設計実践

> 📚 **関連資料**: [実践コード例 - UseCase層設計](./Step07_補足_実践コード例.md#UseCase層設計) | [専門用語集 - ユースケース](./Step07_補足_専門用語集.md#ユースケース)

#### 🔍 ビジネスルールの実装

**💡 なぜUseCase層が重要なのか**

UseCase層は、アプリケーション固有のビジネスルールを実装し、エンティティ間の協調を制御します。外部システムとの境界を定義し、システムの入出力を管理する重要な役割を担います。

```typescript
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
      // 入力データの検証と変換
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

      // 公開可能かチェック
      if (!blogPost.canBePublished()) {
        throw new BlogPostCannotBePublishedError(blogPostId);
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
```

**📝 UseCase設計のポイント**

- **単一責任**: 1つのUseCaseは1つのビジネス機能のみを担当
- **依存関係逆転**: インターフェースに依存し、具象クラスに依存しない
- **エラーハンドリング**: 適切な例外処理とエラー通知
- **トランザクション境界**: データの整合性を保つ処理単位の定義

### 練習問題 1.2: UseCase設計 🔰

以下の要件に基づいて、UpdateBlogPostUseCaseを設計してください：

**要件**:
- ブログ記事のタイトルと本文を更新
- 公開済みの記事は更新不可
- 存在しない記事の場合はエラー
- 更新後の記事情報を返す

```typescript
// ここに実装してください
export interface UpdateBlogPostRequest {
  // TODO: 適切なプロパティを定義
}

export class UpdateBlogPostUseCase {
  constructor(
    // TODO: 必要な依存関係を定義
  ) {}

  async execute(request: UpdateBlogPostRequest): Promise<void> {
    // TODO: UseCase実装
  }
}
```

---

## 🎯 練習問題

> 📚 **サポート資料**: [実践コード例 - クリーンアーキテクチャ練習](./Step07_補足_実践コード例.md#クリーンアーキテクチャ練習) | [トラブルシューティング](./Step07_補足_トラブルシューティング.md#設計関連エラー)

### 練習問題 1: ブログドメインのEntity設計（15分）

ブログ管理システムのAuthorエンティティを設計してください。以下の機能を考慮してください：

- 著者の基本情報（名前、メール、プロフィール）
- メールアドレスの形式検証
- プロフィール更新機能
- 作成日時と更新日時の管理

### 練習問題 2: UseCase設計（15分）

ブログ管理システムで使用するGetBlogPostsByCategoryUseCaseを設計してください。以下の操作を考慮してください：

- カテゴリIDによるブログ記事の検索
- 公開済み記事のみを取得
- 作成日時の降順でソート
- 存在しないカテゴリの場合のエラーハンドリング

---

## 👨‍🏫 学習ポイント

### 🤔 よくある質問

**Q: Entity層にはどこまでのロジックを含めるべきですか？**
A: ドメインに関するビジネスルールのみを含めます。データベースアクセスやUI表示に関するロジックは含めません。「このルールはビジネス要件から来ているか？」を判断基準にしましょう。

**Q: UseCase層とEntity層の責務の違いは何ですか？**
A: Entity層は「何ができるか」（ドメインルール）を定義し、UseCase層は「いつ何をするか」（アプリケーションフロー）を定義します。Entityは単体で動作し、UseCaseは複数のEntityを協調させます。

**Q: 依存関係逆転の原則を適用する際の注意点は？**
A: インターフェースは使用する側（内側のレイヤー）で定義し、実装は提供する側（外側のレイヤー）で行います。これにより内側のレイヤーが外側のレイヤーに依存しない構造を作れます。

---

**📌 重要**: Session1はクリーンアーキテクチャの理論基盤です。焦らず確実に概念を理解しましょう。

**🌟 次回（Session2）は、Repository層とPresenter層の実装に挑戦します！**