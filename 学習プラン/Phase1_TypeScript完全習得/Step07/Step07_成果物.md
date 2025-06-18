# Step07 成果物：ブログ管理システム（クリーンアーキテクチャ実装）

---

## 🎯 課題の目的

**あなたが作成するもの**: クリーンアーキテクチャの4つのレイヤー（Entity、UseCase、Interface Adapter、Framework）を適切に分離したブログ管理システム

**なぜ作るのか**: Step07で学習したクリーンアーキテクチャの知識を実際のコードに適用し、**保守性・テスタビリティ・拡張性の高いアーキテクチャを設計・実装する力**を身につけるため

**学習目標**:
- クリーンアーキテクチャの4つのレイヤーを適切に分離して実装できる
- 依存関係逆転の原則（DIP）を実践できる
- Repository パターンとPresenter パターンを実装できる
- 依存性注入（DI）を活用した疎結合設計ができる
- ドメイン駆動設計（DDD）の基礎を理解し実装できる

---

## 📋 必須提出物

以下のファイル構成で提出してください：

```
📁 提出物/
├── domain/
│   ├── entities/
│   │   ├── BlogPost.ts          # ブログ記事エンティティ
│   │   ├── Category.ts          # カテゴリエンティティ
│   │   └── Author.ts            # 著者エンティティ
│   ├── valueObjects/
│   │   ├── BlogPostId.ts        # ブログ記事ID値オブジェクト
│   │   ├── BlogTitle.ts         # ブログタイトル値オブジェクト
│   │   ├── BlogContent.ts       # ブログ本文値オブジェクト
│   │   ├── CategoryId.ts        # カテゴリID値オブジェクト
│   │   ├── CategoryName.ts      # カテゴリ名値オブジェクト
│   │   ├── AuthorId.ts          # 著者ID値オブジェクト
│   │   ├── AuthorName.ts        # 著者名値オブジェクト
│   │   └── Email.ts             # メールアドレス値オブジェクト
│   └── errors/
│       └── DomainErrors.ts      # ドメイン例外定義
├── application/
│   ├── interfaces/
│   │   ├── IBlogPostRepository.ts    # ブログ記事リポジトリIF
│   │   ├── ICategoryRepository.ts    # カテゴリリポジトリIF
│   │   ├── IAuthorRepository.ts      # 著者リポジトリIF
│   │   └── IBlogPostPresenter.ts     # ブログ記事プレゼンターIF
│   └── usecases/
│       ├── CreateBlogPostUseCase.ts      # ブログ記事作成UC
│       ├── PublishBlogPostUseCase.ts     # ブログ記事公開UC
│       ├── UpdateBlogPostUseCase.ts      # ブログ記事更新UC
│       ├── GetPublishedBlogPostsUseCase.ts # 公開記事取得UC
│       └── GetBlogPostsByAuthorUseCase.ts  # 著者別記事取得UC
├── infrastructure/
│   ├── repositories/
│   │   ├── InMemoryBlogPostRepository.ts # ブログ記事リポジトリ実装
│   │   ├── InMemoryCategoryRepository.ts # カテゴリリポジトリ実装
│   │   └── InMemoryAuthorRepository.ts   # 著者リポジトリ実装
│   ├── presenters/
│   │   └── ConsoleBlogPostPresenter.ts   # コンソールプレゼンター実装
│   ├── DIContainer.ts                    # 依存性注入コンテナ
│   ├── BlogApplication.ts                # アプリケーション設定
│   └── BlogController.ts                 # アプリケーションコントローラー
└── main.ts                               # アプリケーションエントリーポイント
```

---

## ⏰ 作成手順（推奨時間配分：合計180分）

### Phase 1: Entity層とValue Object層の実装（60分）

#### ステップ1-1: ドメインエンティティの設計（30分）

ブログ管理システムの核となるエンティティを設計してください：

**要件**:
- BlogPost: ブログ記事の管理（作成、更新、公開、アーカイブ）
- Category: カテゴリの管理（作成、更新）
- Author: 著者の管理（プロフィール更新）

```typescript
// domain/entities/BlogPost.ts の例
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
    // TODO: ビジネスルールを実装
  }

  // ドメインロジック: 記事の更新
  public updateContent(title: BlogTitle, content: BlogContent): void {
    // TODO: ビジネスルールを実装
  }

  // その他のドメインロジックとゲッター
}
```

#### ステップ1-2: 値オブジェクトの実装（30分）

型安全性を確保する値オブジェクトを実装してください：

```typescript
// domain/valueObjects/BlogTitle.ts の例
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
```

### Phase 2: UseCase層とInterface層の実装（60分）

#### ステップ2-1: Repository・Presenterインターフェースの定義（20分）

依存関係逆転の原則に従ってインターフェースを定義してください：

```typescript
// application/interfaces/IBlogPostRepository.ts
export interface IBlogPostRepository {
  save(blogPost: BlogPost): Promise<void>;
  findById(id: BlogPostId): Promise<BlogPost | null>;
  findByAuthorId(authorId: AuthorId): Promise<BlogPost[]>;
  findPublishedPosts(): Promise<BlogPost[]>;
  delete(id: BlogPostId): Promise<void>;
}
```

#### ステップ2-2: UseCaseの実装（40分）

ビジネスロジックを含むUseCaseを実装してください：

```typescript
// application/usecases/CreateBlogPostUseCase.ts
export class CreateBlogPostUseCase {
  constructor(
    private readonly blogPostRepository: IBlogPostRepository,
    private readonly categoryRepository: ICategoryRepository,
    private readonly authorRepository: IAuthorRepository,
    private readonly presenter: IBlogPostPresenter
  ) {}

  async execute(request: CreateBlogPostRequest): Promise<void> {
    try {
      // TODO: バリデーション、ビジネスロジック、永続化を実装
    } catch (error) {
      this.presenter.presentError(error as Error);
    }
  }
}
```

### Phase 3: Infrastructure層とFramework層の実装（60分）

#### ステップ3-1: Repository実装（20分）

データアクセス層を実装してください：

```typescript
// infrastructure/repositories/InMemoryBlogPostRepository.ts
export class InMemoryBlogPostRepository implements IBlogPostRepository {
  private blogPosts: Map<string, BlogPost> = new Map();

  async save(blogPost: BlogPost): Promise<void> {
    // TODO: インメモリ実装
  }

  // その他のメソッド実装
}
```

#### ステップ3-2: Presenter実装（20分）

表示層を実装してください：

```typescript
// infrastructure/presenters/ConsoleBlogPostPresenter.ts
export class ConsoleBlogPostPresenter implements IBlogPostPresenter {
  async presentBlogPost(blogPost: BlogPost): Promise<BlogPostResponse> {
    // TODO: コンソール出力実装
  }

  // その他のメソッド実装
}
```

#### ステップ3-3: DI設定とアプリケーション統合（20分）

依存性注入コンテナとアプリケーション設定を実装してください：

```typescript
// infrastructure/BlogApplication.ts
export class BlogApplication {
  private container: DIContainer;

  constructor() {
    this.container = new DIContainer();
    this.setupDependencies();
  }

  private setupDependencies(): void {
    // TODO: 全ての依存関係を設定
  }
}
```

---

## ✅ 最低合格要件

以下の要件を**すべて満たす**ことで合格とします：

### 🔧 アーキテクチャ要件（最重要！）
- [ ] **4つのレイヤーが適切に分離されている**（Entity、UseCase、Interface Adapter、Framework）
- [ ] **依存関係の方向が正しい**（外側から内側への一方向のみ）
- [ ] **依存関係逆転の原則が適用されている**（インターフェースに依存、具象に依存しない）
- [ ] **各レイヤーの責務が明確に分かれている**

### 🎯 実装要件
- [ ] TypeScriptでコンパイルエラーが発生しない
- [ ] **Entity層にドメインロジックが適切に実装されている**
- [ ] **UseCase層でビジネスフローが管理されている**
- [ ] **Repository パターンが正しく実装されている**
- [ ] **Presenter パターンが正しく実装されている**
- [ ] **依存性注入（DI）が実装されている**

### 💭 機能要件
- [ ] ブログ記事の作成・更新・公開ができる
- [ ] 著者別・カテゴリ別の記事取得ができる
- [ ] 公開済み記事の一覧表示ができる
- [ ] 適切なエラーハンドリングが実装されている
- [ ] システム全体が正常に動作する

### 🏗️ 設計要件
- [ ] **値オブジェクトが適切に使用されている**
- [ ] **ドメイン例外が適切に定義されている**
- [ ] **インターフェース分離の原則が適用されている**
- [ ] **単一責任の原則が適用されている**

---

## 📊 評価基準

| 項目 | 配点 | 評価ポイント |
|------|------|-------------|
| **アーキテクチャ理解** | 35点 | 4つのレイヤーの適切な分離と依存関係の正しさ |
| **依存関係設計** | 25点 | DIPの実践とインターフェース設計の適切性 |
| **ドメインモデリング** | 20点 | Entity設計とドメインロジックの実装品質 |
| **実装品質** | 20点 | TypeScript活用、エラーハンドリング、コード品質 |

**合格ライン**: 70点以上

---

## 💡 実装のヒント

### 🤔 アーキテクチャ設計のポイント

1. **依存関係の方向を常に意識する**
   ```
   Framework → Interface Adapter → UseCase → Entity
   ```

2. **インターフェースは使用する側で定義する**
   ```typescript
   // ❌ 間違い: Repository層でインターフェース定義
   // ✅ 正解: UseCase層でインターフェース定義
   ```

3. **各レイヤーの責務を明確にする**
   - Entity: ドメインルールとビジネスロジック
   - UseCase: アプリケーションフロー
   - Interface Adapter: データ変換とアダプター
   - Framework: 外部システムとの統合

### 📝 実装パターンの例

```typescript
// Entity層: ドメインロジックの実装
export class BlogPost {
  public publish(): void {
    if (this.status === BlogStatus.DRAFT) {
      this.status = BlogStatus.PUBLISHED;
      this.publishedAt = new Date();
      this.updatedAt = new Date();
    } else {
      throw new BlogPostAlreadyPublishedError(this.id);
    }
  }
}

// UseCase層: ビジネスフローの管理
export class PublishBlogPostUseCase {
  async execute(request: PublishBlogPostRequest): Promise<void> {
    const blogPost = await this.repository.findById(new BlogPostId(request.id));
    if (!blogPost) {
      throw new BlogPostNotFoundError(new BlogPostId(request.id));
    }
    
    blogPost.publish(); // ドメインロジック呼び出し
    await this.repository.save(blogPost);
    this.presenter.presentSuccess('記事を公開しました');
  }
}

// Infrastructure層: 具象実装
export class InMemoryBlogPostRepository implements IBlogPostRepository {
  async save(blogPost: BlogPost): Promise<void> {
    this.blogPosts.set(blogPost.getId().getValue(), blogPost);
  }
}
```

### ⚠️ よくある間違い

1. **レイヤーの責務混在**
   ```typescript
   // ❌ 間違い: Entity層でデータベースアクセス
   export class BlogPost {
     async save(): Promise<void> {
       await database.save(this); // Entity層の責務ではない
     }
   }
   
   // ✅ 正解: Repository層でデータアクセス
   export class InMemoryBlogPostRepository {
     async save(blogPost: BlogPost): Promise<void> {
       this.blogPosts.set(blogPost.getId().getValue(), blogPost);
     }
   }
   ```

2. **依存関係の方向違反**
   ```typescript
   // ❌ 間違い: UseCase層が具象クラスに依存
   export class CreateBlogPostUseCase {
     constructor(private repository: InMemoryBlogPostRepository) {} // 具象に依存
   }
   
   // ✅ 正解: UseCase層がインターフェースに依存
   export class CreateBlogPostUseCase {
     constructor(private repository: IBlogPostRepository) {} // 抽象に依存
   }
   ```

3. **値オブジェクトの未使用**
   ```typescript
   // ❌ 間違い: プリミティブ型の直接使用
   export class BlogPost {
     constructor(private title: string) {} // バリデーションなし
   }
   
   // ✅ 正解: 値オブジェクトの使用
   export class BlogPost {
     constructor(private title: BlogTitle) {} // バリデーション済み
   }
   ```

---

## 📚 参考：完成例の構造

```typescript
// 完成したシステムの使用例
async function demonstrateSystem(): Promise<void> {
  const app = new BlogApplication();
  const controller = new BlogController(app);

  // 1. ブログ記事の作成
  await controller.createBlogPost(
    'クリーンアーキテクチャ入門',
    'クリーンアーキテクチャの実装方法について...',
    'author_1',
    'category_1'
  );

  // 2. ブログ記事の公開
  await controller.publishBlogPost('blog_post_1');

  // 3. 公開済み記事の取得
  await controller.getPublishedPosts();

  // 4. 著者別記事の取得
  await controller.getBlogPostsByAuthor('author_1');
}
```

---

## 🚀 発展課題（任意）

基本要件を満たした後、以下の機能追加にチャレンジしてください：

### レベル1: 基本機能拡張
- [ ] 記事の検索機能（タイトル・本文での部分一致）
- [ ] 記事のアーカイブ機能
- [ ] カテゴリの階層構造対応

### レベル2: 高度な機能
- [ ] 記事の下書き保存・復元機能
- [ ] 記事の閲覧数カウント機能
- [ ] 記事のタグ機能

### レベル3: アーキテクチャ拡張
- [ ] イベント駆動アーキテクチャの導入
- [ ] CQRS（Command Query Responsibility Segregation）パターンの実装
- [ ] ドメインイベントの実装

---

## 🎯 提出時のチェックリスト

提出前に以下の項目を確認してください：

### アーキテクチャチェック
- [ ] 4つのレイヤーが適切に分離されている
- [ ] 依存関係の方向が正しい（外側→内側）
- [ ] インターフェースが適切に定義されている
- [ ] DIコンテナが正しく設定されている

### 実装チェック
- [ ] すべてのファイルがTypeScriptでコンパイルできる
- [ ] ドメインロジックがEntity層に実装されている
- [ ] ビジネスフローがUseCase層で管理されている
- [ ] エラーハンドリングが適切に実装されている

### 動作チェック
- [ ] main.tsを実行してシステムが正常に動作する
- [ ] すべての必須機能が動作する
- [ ] エラーケースも適切に処理される

---

**🎉 完成おめでとうございます！** クリーンアーキテクチャの実装を通じて、保守性・テスタビリティ・拡張性の高いシステム設計の基礎を身につけることができました。

**🚀 次のStep08では、外部ライブラリとの統合について学習します！**