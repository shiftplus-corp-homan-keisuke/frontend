# Phase 3: Week 3-4 Repository・Use Case - アプリケーション層・インフラ層設計

## 📅 学習期間・目標

**期間**: Week 3-4（2週間）  
**総学習時間**: 40時間（週20時間）

### 🎯 Week 3-4 到達目標

- [ ] Repository パターンの型安全な抽象化と実装
- [ ] Use Case レイヤーの適切な設計と責任分離
- [ ] Application Service でのユースケース統合
- [ ] Domain Service パターンの実践的活用
- [ ] CQRS・Event Sourcing の基礎実装
- [ ] 依存性注入とテスタビリティの向上

## 📖 理論学習内容

### Day 15-18: Repository パターン完全理解

#### 🗄️ Repository パターンの設計原則

**Repository パターンの目的**

1. **ドメイン層の永続化からの分離**: ドメインロジックを永続化技術から独立
2. **テスタビリティの向上**: モックやスタブによるテスト容易性
3. **技術的関心事の分離**: ビジネスロジックとデータアクセスの分離
4. **コレクション風インターフェース**: ドメインオブジェクトのコレクション操作

```typescript
// Repository インターフェースの基本設計
interface Repository<TEntity, TId> {
  // 基本CRUD操作
  findById(id: TId): Promise<Option<TEntity>>;
  save(entity: TEntity): Promise<Result<void, RepositoryError>>;
  delete(id: TId): Promise<Result<void, RepositoryError>>;
  
  // コレクション操作
  findAll(criteria?: SearchCriteria): Promise<TEntity[]>;
  count(criteria?: SearchCriteria): Promise<number>;
  exists(id: TId): Promise<boolean>;
}

// Option型の実装（null安全性の確保）
abstract class Option<T> {
  abstract isSome(): this is Some<T>;
  abstract isNone(): this is None<T>;
  
  static some<T>(value: T): Option<T> {
    return new Some(value);
  }
  
  static none<T>(): Option<T> {
    return new None<T>();
  }

  map<U>(fn: (value: T) => U): Option<U> {
    return this.isSome() ? Option.some(fn(this.value)) : Option.none<U>();
  }

  flatMap<U>(fn: (value: T) => Option<U>): Option<U> {
    return this.isSome() ? fn(this.value) : Option.none<U>();
  }

  filter(predicate: (value: T) => boolean): Option<T> {
    return this.isSome() && predicate(this.value) ? this : Option.none<T>();
  }

  orElse(defaultValue: T): T {
    return this.isSome() ? this.value : defaultValue;
  }

  orElseGet(supplier: () => T): T {
    return this.isSome() ? this.value : supplier();
  }
}

class Some<T> extends Option<T> {
  constructor(public readonly value: T) {
    super();
  }

  isSome(): this is Some<T> {
    return true;
  }

  isNone(): this is None<T> {
    return false;
  }
}

class None<T> extends Option<T> {
  isSome(): this is Some<T> {
    return false;
  }

  isNone(): this is None<T> {
    return true;
  }
}
```

#### 🏪 具体的な Repository 実装

**ProductRepository の設計と実装**

```typescript
// ドメイン層：Repository インターフェース
interface ProductRepository {
  findById(id: ProductId): Promise<Option<Product>>;
  findByCategory(category: ProductCategory): Promise<Product[]>;
  findByPriceRange(min: Money, max: Money): Promise<Product[]>;
  findLowStockProducts(threshold: number): Promise<Product[]>;
  save(product: Product): Promise<Result<void, RepositoryError>>;
  delete(id: ProductId): Promise<Result<void, RepositoryError>>;
  findAll(criteria?: ProductSearchCriteria): Promise<Product[]>;
  count(criteria?: ProductSearchCriteria): Promise<number>;
}

// 検索条件の型定義
interface ProductSearchCriteria {
  name?: string;
  category?: ProductCategory;
  priceRange?: {
    min: Money;
    max: Money;
  };
  inStock?: boolean;
  isActive?: boolean;
  createdAfter?: Date;
  createdBefore?: Date;
  limit?: number;
  offset?: number;
  sortBy?: ProductSortField;
  sortOrder?: 'ASC' | 'DESC';
}

enum ProductSortField {
  Name = 'name',
  Price = 'price',
  CreatedAt = 'createdAt',
  UpdatedAt = 'updatedAt',
  StockQuantity = 'stockQuantity'
}

// インフラ層：Repository 実装
class PostgresProductRepository implements ProductRepository {
  constructor(
    private db: DatabaseConnection,
    private mapper: ProductMapper
  ) {}

  async findById(id: ProductId): Promise<Option<Product>> {
    try {
      const query = `
        SELECT p.*, pc.name as category_name
        FROM products p
        JOIN product_categories pc ON p.category_id = pc.id
        WHERE p.id = $1 AND p.deleted_at IS NULL
      `;
      
      const result = await this.db.query(query, [id.toString()]);
      
      if (result.rows.length === 0) {
        return Option.none<Product>();
      }

      const productResult = this.mapper.toDomain(result.rows[0]);
      return productResult.isOk() 
        ? Option.some(productResult.value)
        : Option.none<Product>();
    } catch (error) {
      throw new RepositoryError(`Failed to find product by id: ${error.message}`);
    }
  }

  async findByCategory(category: ProductCategory): Promise<Product[]> {
    try {
      const query = `
        SELECT p.*, pc.name as category_name
        FROM products p
        JOIN product_categories pc ON p.category_id = pc.id
        WHERE pc.name = $1 AND p.deleted_at IS NULL
        ORDER BY p.name ASC
      `;
      
      const result = await this.db.query(query, [category]);
      
      const products: Product[] = [];
      for (const row of result.rows) {
        const productResult = this.mapper.toDomain(row);
        if (productResult.isOk()) {
          products.push(productResult.value);
        }
      }
      
      return products;
    } catch (error) {
      throw new RepositoryError(`Failed to find products by category: ${error.message}`);
    }
  }

  async save(product: Product): Promise<Result<void, RepositoryError>> {
    try {
      const persistenceData = this.mapper.toPersistence(product);
      
      const query = `
        INSERT INTO products (
          id, name, description, price_amount, price_currency,
          category_id, stock_quantity, is_active, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          description = EXCLUDED.description,
          price_amount = EXCLUDED.price_amount,
          price_currency = EXCLUDED.price_currency,
          category_id = EXCLUDED.category_id,
          stock_quantity = EXCLUDED.stock_quantity,
          is_active = EXCLUDED.is_active,
          updated_at = EXCLUDED.updated_at
      `;

      await this.db.query(query, [
        persistenceData.id,
        persistenceData.name,
        persistenceData.description,
        persistenceData.priceAmount,
        persistenceData.priceCurrency,
        persistenceData.categoryId,
        persistenceData.stockQuantity,
        persistenceData.isActive,
        persistenceData.createdAt,
        persistenceData.updatedAt
      ]);

      return Result.ok(undefined);
    } catch (error) {
      return Result.err(
        new RepositoryError(`Failed to save product: ${error.message}`)
      );
    }
  }

  async findAll(criteria?: ProductSearchCriteria): Promise<Product[]> {
    try {
      const { query, params } = this.buildSearchQuery(criteria);
      const result = await this.db.query(query, params);
      
      const products: Product[] = [];
      for (const row of result.rows) {
        const productResult = this.mapper.toDomain(row);
        if (productResult.isOk()) {
          products.push(productResult.value);
        }
      }
      
      return products;
    } catch (error) {
      throw new RepositoryError(`Failed to find products: ${error.message}`);
    }
  }

  private buildSearchQuery(criteria?: ProductSearchCriteria): { query: string; params: any[] } {
    let query = `
      SELECT p.*, pc.name as category_name
      FROM products p
      JOIN product_categories pc ON p.category_id = pc.id
      WHERE p.deleted_at IS NULL
    `;
    
    const params: any[] = [];
    let paramIndex = 1;

    if (criteria) {
      if (criteria.name) {
        query += ` AND p.name ILIKE $${paramIndex}`;
        params.push(`%${criteria.name}%`);
        paramIndex++;
      }

      if (criteria.category) {
        query += ` AND pc.name = $${paramIndex}`;
        params.push(criteria.category);
        paramIndex++;
      }

      if (criteria.priceRange) {
        query += ` AND p.price_amount BETWEEN $${paramIndex} AND $${paramIndex + 1}`;
        params.push(criteria.priceRange.min.amount, criteria.priceRange.max.amount);
        paramIndex += 2;
      }

      if (criteria.inStock !== undefined) {
        if (criteria.inStock) {
          query += ` AND p.stock_quantity > 0`;
        } else {
          query += ` AND p.stock_quantity = 0`;
        }
      }

      if (criteria.isActive !== undefined) {
        query += ` AND p.is_active = $${paramIndex}`;
        params.push(criteria.isActive);
        paramIndex++;
      }

      if (criteria.sortBy) {
        const sortField = this.mapSortField(criteria.sortBy);
        const sortOrder = criteria.sortOrder || 'ASC';
        query += ` ORDER BY ${sortField} ${sortOrder}`;
      }

      if (criteria.limit) {
        query += ` LIMIT $${paramIndex}`;
        params.push(criteria.limit);
        paramIndex++;
      }

      if (criteria.offset) {
        query += ` OFFSET $${paramIndex}`;
        params.push(criteria.offset);
        paramIndex++;
      }
    }

    return { query, params };
  }

  private mapSortField(sortField: ProductSortField): string {
    switch (sortField) {
      case ProductSortField.Name:
        return 'p.name';
      case ProductSortField.Price:
        return 'p.price_amount';
      case ProductSortField.CreatedAt:
        return 'p.created_at';
      case ProductSortField.UpdatedAt:
        return 'p.updated_at';
      case ProductSortField.StockQuantity:
        return 'p.stock_quantity';
      default:
        return 'p.created_at';
    }
  }
}

// データマッパー（ドメイン ↔ 永続化）
interface ProductPersistenceData {
  id: string;
  name: string;
  description: string;
  priceAmount: number;
  priceCurrency: string;
  categoryId: string;
  categoryName: string;
  stockQuantity: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

class ProductMapper {
  toDomain(data: ProductPersistenceData): Result<Product, MappingError> {
    try {
      const priceResult = Money.create(data.priceAmount, data.priceCurrency as Currency);
      if (priceResult.isErr()) {
        return Result.err(new MappingError(`Invalid price: ${priceResult.error.message}`));
      }

      return Product.fromPersistence(
        data.id,
        {
          name: data.name,
          description: data.description,
          price: priceResult.value,
          category: data.categoryName as ProductCategory,
          stockQuantity: data.stockQuantity,
          isActive: data.isActive
        },
        data.createdAt
      );
    } catch (error) {
      return Result.err(new MappingError(`Failed to map to domain: ${error.message}`));
    }
  }

  toPersistence(product: Product): ProductPersistenceData {
    return {
      id: product.id.toString(),
      name: product.name,
      description: product.description,
      priceAmount: product.price.amount,
      priceCurrency: product.price.currency,
      categoryId: this.getCategoryId(product.category),
      categoryName: product.category,
      stockQuantity: product.stockQuantity,
      isActive: product.isActive,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt
    };
  }

  private getCategoryId(category: ProductCategory): string {
    // カテゴリ名からIDへのマッピング（実際の実装では別テーブルから取得）
    const categoryMap: Record<ProductCategory, string> = {
      [ProductCategory.Electronics]: 'cat_electronics',
      [ProductCategory.Clothing]: 'cat_clothing',
      [ProductCategory.Books]: 'cat_books',
      [ProductCategory.Sports]: 'cat_sports',
      [ProductCategory.Home]: 'cat_home'
    };
    return categoryMap[category];
  }
}

class RepositoryError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RepositoryError';
  }
}

class MappingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'MappingError';
  }
}
```

### Day 19-21: Use Case パターン実装

#### 🎯 Use Case レイヤーの責任と設計

**Use Case の特徴**

1. **アプリケーション固有のビジネスルール**: システム特有の業務フロー
2. **ドメインオブジェクトの調整**: 複数のドメインオブジェクトの協調
3. **トランザクション境界**: データ整合性の保証
4. **外部システム連携**: インフラ層サービスの利用

```typescript
// Use Case の基本構造
interface UseCase<TRequest, TResponse> {
  execute(request: TRequest): Promise<Result<TResponse, UseCaseError>>;
}

// CreateProduct Use Case
interface CreateProductRequest {
  name: string;
  description: string;
  price: {
    amount: number;
    currency: string;
  };
  category: string;
  initialStock: number;
}

interface CreateProductResponse {
  product: ProductDto;
  wasCreated: boolean;
}

class CreateProductUseCase implements UseCase<CreateProductRequest, CreateProductResponse> {
  constructor(
    private productRepository: ProductRepository,
    private productDomainService: ProductDomainService,
    private eventBus: EventBus,
    private logger: Logger
  ) {}

  async execute(request: CreateProductRequest): Promise<Result<CreateProductResponse, UseCaseError>> {
    try {
      // 1. 入力検証
      const validationResult = this.validateRequest(request);
      if (validationResult.isErr()) {
        return Result.err(validationResult.error);
      }

      // 2. Value Object 作成
      const priceResult = Money.create(request.price.amount, request.price.currency as Currency);
      if (priceResult.isErr()) {
        return Result.err(new UseCaseError(`Invalid price: ${priceResult.error.message}`));
      }

      // 3. ドメインサービスでビジネスルールチェック
      const uniquenessResult = await this.productDomainService.ensureProductNameUnique(request.name);
      if (uniquenessResult.isErr()) {
        return Result.err(new UseCaseError(uniquenessResult.error.message));
      }

      // 4. ドメインオブジェクト作成
      const productResult = Product.create({
        name: request.name,
        description: request.description,
        price: priceResult.value,
        category: request.category as ProductCategory,
        stockQuantity: request.initialStock
      });

      if (productResult.isErr()) {
        return Result.err(new UseCaseError(`Failed to create product: ${productResult.error.message}`));
      }

      // 5. 永続化
      const saveResult = await this.productRepository.save(productResult.value);
      if (saveResult.isErr()) {
        return Result.err(new UseCaseError(`Failed to save product: ${saveResult.error.message}`));
      }

      // 6. ドメインイベント発行
      const productCreatedEvent = new ProductCreatedEvent(
        productResult.value.id,
        productResult.value.name,
        productResult.value.category,
        new Date()
      );
      await this.eventBus.publish(productCreatedEvent);

      // 7. ログ記録
      this.logger.info('Product created successfully', {
        productId: productResult.value.id.toString(),
        productName: productResult.value.name
      });

      // 8. レスポンス作成
      const productDto = this.mapToDto(productResult.value);
      return Result.ok({
        product: productDto,
        wasCreated: true
      });

    } catch (error) {
      this.logger.error('Unexpected error in CreateProductUseCase', error);
      return Result.err(new UseCaseError('An unexpected error occurred'));
    }
  }

  private validateRequest(request: CreateProductRequest): Result<void, UseCaseError> {
    if (!request.name?.trim()) {
      return Result.err(new UseCaseError('Product name is required'));
    }
    if (request.name.length > 100) {
      return Result.err(new UseCaseError('Product name too long'));
    }
    if (!request.description?.trim()) {
      return Result.err(new UseCaseError('Product description is required'));
    }
    if (request.initialStock < 0) {
      return Result.err(new UseCaseError('Initial stock cannot be negative'));
    }
    if (!Object.values(ProductCategory).includes(request.category as ProductCategory)) {
      return Result.err(new UseCaseError('Invalid product category'));
    }
    return Result.ok(undefined);
  }

  private mapToDto(product: Product): ProductDto {
    return {
      id: product.id.toString(),
      name: product.name,
      description: product.description,
      price: {
        amount: product.price.amount,
        currency: product.price.currency,
        formatted: product.price.format()
      },
      category: product.category,
      stockQuantity: product.stockQuantity,
      isActive: product.isActive,
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString()
    };
  }
}

class UseCaseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UseCaseError';
  }
}
```

### Day 22-28: Application Service・Event Sourcing基礎

#### 🔧 Application Service パターン

**Application Service の役割**

1. **Use Case の統合**: 複数のユースケースを組み合わせたサービス提供
2. **トランザクション管理**: ユニットオブワークパターンの活用
3. **セキュリティ**: 認証・認可の横断的関心事
4. **キャッシュ・パフォーマンス**: 最適化の適用

```typescript
// Application Service の実装
interface ProductApplicationService {
  createProduct(request: CreateProductRequest): Promise<Result<ProductDto, ApplicationError>>;
  updateProduct(id: string, request: UpdateProductRequest): Promise<Result<ProductDto, ApplicationError>>;
  deleteProduct(id: string): Promise<Result<void, ApplicationError>>;
  getProduct(id: string): Promise<Result<ProductDto, ApplicationError>>;
  searchProducts(criteria: ProductSearchDto): Promise<Result<ProductListDto, ApplicationError>>;
  adjustStock(id: string, adjustment: StockAdjustmentDto): Promise<Result<ProductDto, ApplicationError>>;
}

class ProductApplicationServiceImpl implements ProductApplicationService {
  constructor(
    private createProductUseCase: CreateProductUseCase,
    private updateProductUseCase: UpdateProductUseCase,
    private deleteProductUseCase: DeleteProductUseCase,
    private getProductUseCase: GetProductUseCase,
    private searchProductsUseCase: SearchProductsUseCase,
    private adjustStockUseCase: AdjustStockUseCase,
    private authorizationService: AuthorizationService,
    private cacheService: CacheService,
    private logger: Logger
  ) {}

  async createProduct(request: CreateProductRequest): Promise<Result<ProductDto, ApplicationError>> {
    try {
      // 認可チェック
      const authResult = await this.authorizationService.canCreateProduct(request.userId);
      if (!authResult) {
        return Result.err(new ApplicationError('Unauthorized to create product'));
      }

      // Use Case実行
      const result = await this.createProductUseCase.execute(request);
      
      if (result.isErr()) {
        return Result.err(new ApplicationError(result.error.message));
      }

      // キャッシュ無効化
      await this.cacheService.invalidatePattern('products:*');

      return Result.ok(result.value.product);
    } catch (error) {
      this.logger.error('Error in ProductApplicationService.createProduct', error);
      return Result.err(new ApplicationError('Internal server error'));
    }
  }

  async getProduct(id: string): Promise<Result<ProductDto, ApplicationError>> {
    try {
      // キャッシュチェック
      const cacheKey = `product:${id}`;
      const cached = await this.cacheService.get<ProductDto>(cacheKey);
      if (cached) {
        return Result.ok(cached);
      }

      // Use Case実行
      const result = await this.getProductUseCase.execute({ id });
      
      if (result.isErr()) {
        return Result.err(new ApplicationError(result.error.message));
      }

      // キャッシュ保存
      await this.cacheService.set(cacheKey, result.value.product, 300); // 5分間

      return Result.ok(result.value.product);
    } catch (error) {
      this.logger.error('Error in ProductApplicationService.getProduct', error);
      return Result.err(new ApplicationError('Internal server error'));
    }
  }
}

class ApplicationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ApplicationError';
  }
}
```

#### ⚡ Event Sourcing 基礎実装

```typescript
// ドメインイベントの基本構造
interface DomainEvent {
  eventId: string;
  aggregateId: string;
  eventType: string;
  eventData: any;
  occurredAt: Date;
  version: number;
}

// 具体的なドメインイベント
class ProductCreatedEvent implements DomainEvent {
  constructor(
    public readonly aggregateId: string,
    public readonly productName: string,
    public readonly category: ProductCategory,
    public readonly price: Money,
    public readonly occurredAt: Date = new Date(),
    public readonly eventId: string = crypto.randomUUID(),
    public readonly version: number = 1
  ) {}

  get eventType(): string {
    return 'ProductCreated';
  }

  get eventData(): any {
    return {
      productName: this.productName,
      category: this.category,
      price: {
        amount: this.price.amount,
        currency: this.price.currency
      }
    };
  }
}

class ProductPriceChangedEvent implements DomainEvent {
  constructor(
    public readonly aggregateId: string,
    public readonly oldPrice: Money,
    public readonly newPrice: Money,
    public readonly reason: string,
    public readonly occurredAt: Date = new Date(),
    public readonly eventId: string = crypto.randomUUID(),
    public readonly version: number = 1
  ) {}

  get eventType(): string {
    return 'ProductPriceChanged';
  }

  get eventData(): any {
    return {
      oldPrice: {
        amount: this.oldPrice.amount,
        currency: this.oldPrice.currency
      },
      newPrice: {
        amount: this.newPrice.amount,
        currency: this.newPrice.currency
      },
      reason: this.reason
    };
  }
}

// Event Store インターフェース
interface EventStore {
  saveEvents(aggregateId: string, events: DomainEvent[], expectedVersion: number): Promise<Result<void, EventStoreError>>;
  getEvents(aggregateId: string, fromVersion?: number): Promise<DomainEvent[]>;
  getAllEvents(fromTimestamp?: Date): Promise<DomainEvent[]>;
}

// Event Store 実装
class PostgresEventStore implements EventStore {
  constructor(private db: DatabaseConnection) {}

  async saveEvents(
    aggregateId: string, 
    events: DomainEvent[], 
    expectedVersion: number
  ): Promise<Result<void, EventStoreError>> {
    try {
      const client = await this.db.getClient();
      await client.query('BEGIN');

      try {
        // 現在のバージョンチェック
        const versionResult = await client.query(
          'SELECT MAX(version) as current_version FROM events WHERE aggregate_id = $1',
          [aggregateId]
        );
        
        const currentVersion = versionResult.rows[0]?.current_version || 0;
        if (currentVersion !== expectedVersion) {
          await client.query('ROLLBACK');
          return Result.err(new EventStoreError('Concurrency conflict'));
        }

        // イベント保存
        for (let i = 0; i < events.length; i++) {
          const event = events[i];
          const version = expectedVersion + i + 1;
          
          await client.query(`
            INSERT INTO events (
              event_id, aggregate_id, event_type, event_data, 
              occurred_at, version
            ) VALUES ($1, $2, $3, $4, $5, $6)
          `, [
            event.eventId,
            aggregateId,
            event.eventType,
            JSON.stringify(event.eventData),
            event.occurredAt,
            version
          ]);
        }

        await client.query('COMMIT');
        return Result.ok(undefined);
      } catch (error) {
        await client.query('ROLLBACK');
        throw error;
      } finally {
        client.release();
      }
    } catch (error) {
      return Result.err(new EventStoreError(`Failed to save events: ${error.message}`));
    }
  }

  async getEvents(aggregateId: string, fromVersion: number = 0): Promise<DomainEvent[]> {
    try {
      const result = await this.db.query(`
        SELECT event_id, aggregate_id, event_type, event_data, 
               occurred_at, version
        FROM events 
        WHERE aggregate_id = $1 AND version > $2
        ORDER BY version ASC
      `, [aggregateId, fromVersion]);

      return result.rows.map(row => this.mapRowToEvent(row));
    } catch (error) {
      throw new EventStoreError(`Failed to get events: ${error.message}`);
    }
  }

  private mapRowToEvent(row: any): DomainEvent {
    const eventData = JSON.parse(row.event_data);
    
    switch (row.event_type) {
      case 'ProductCreated':
        return new ProductCreatedEvent(
          row.aggregate_id,
          eventData.productName,
          eventData.category,
          Money.create(eventData.price.amount, eventData.price.currency).getValue(),
          row.occurred_at,
          row.event_id,
          row.version
        );
      case 'ProductPriceChanged':
        return new ProductPriceChangedEvent(
          row.aggregate_id,
          Money.create(eventData.oldPrice.amount, eventData.oldPrice.currency).getValue(),
          Money.create(eventData.newPrice.amount, eventData.newPrice.currency).getValue(),
          eventData.reason,
          row.occurred_at,
          row.event_id,
          row.version
        );
      default:
        throw new EventStoreError(`Unknown event type: ${row.event_type}`);
    }
  }
}

class EventStoreError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'EventStoreError';
  }
}
```

## 🎯 実践演習

### 演習 3-1: Repository・Mapper 完全実装 🔶

**目標**: 型安全で堅牢な Repository パターンの実装

```typescript
// 以下の要件を満たすCustomerRepositoryシステムを実装せよ

// Customer Entity（Week 1-2で実装済みを拡張）
interface CustomerProps {
  name: string;
  email: Email;
  phoneNumber: PhoneNumber;
  addresses: Address[];
  tier: CustomerTier;
  totalOrderAmount: Money;
  isActive: boolean;
}

enum CustomerTier {
  Bronze = 'bronze',
  Silver = 'silver',
  Gold = 'gold',
  Platinum = 'platinum'
}

// Repository要件:
// 1. 顧客検索（名前、メール、電話番号、ティア別）
// 2. 複雑な検索条件（注文履歴、地域、アクティブ期間）
// 3. ページネーション対応
// 4. ソート機能（名前、登録日、総注文額）
// 5. 統計情報取得（ティア別顧客数、地域別分布）

interface CustomerRepository {
  findById(id: CustomerId): Promise<Option<Customer>>;
  findByEmail(email: Email): Promise<Option<Customer>>;
  findByTier(tier: CustomerTier): Promise<Customer[]>;
  save(customer: Customer): Promise<Result<void, RepositoryError>>;
  delete(id: CustomerId): Promise<Result<void, RepositoryError>>;
  findAll(criteria?: CustomerSearchCriteria): Promise<Customer[]>;
  count(criteria?: CustomerSearchCriteria): Promise<number>;
  getStatistics(): Promise<CustomerStatistics>;
}

interface CustomerSearchCriteria {
  name?: string;
  email?: string;
  tier?: CustomerTier;
  isActive?: boolean;
  registeredAfter?: Date;
  registeredBefore?: Date;
  minOrderAmount?: Money;
  maxOrderAmount?: Money;
  region?: string;
  limit?: number;
  offset?: number;
  sortBy?: CustomerSortField;
  sortOrder?: 'ASC' | 'DESC';
}

interface CustomerStatistics {
  totalCustomers: number;
  customersByTier: Record<CustomerTier, number>;
  customersByRegion: Record<string, number>;
  averageOrderAmount: Money;
  activeCustomersPercentage: number;
}

// 実装すべきクラス:
// 1. PostgresCustomerRepository
// 2. CustomerMapper
// 3. CustomerSearchQueryBuilder
// 4. CustomerStatisticsCalculator

// テストケース実装も含める
```

### 演習 3-2: 複雑な Use Case 実装チャレンジ 🔥

**目標**: 実際のビジネスシナリオに基づく複雑なユースケース実装

```typescript
// Eコマースの「注文キャンセル・返金」ユースケースを実装せよ

// ビジネスルール:
// 1. 注文は特定の状態でのみキャンセル可能
// 2. キャンセル理由の記録が必要
// 3. 在庫の復元処理
// 4. 返金処理（支払い方法によって異なる）
// 5. 顧客・販売者への通知
// 6. ポイント・クーポンの処理
// 7. 配送のキャンセル処理

interface CancelOrderRequest {
  orderId: string;
  customerId: string;
  reason: CancelReason;
  reasonDetails?: string;
  requestedBy: 'customer' | 'admin' | 'system';
}

enum CancelReason {
  CustomerRequest = 'customer_request',
  PaymentFailed = 'payment_failed',
  OutOfStock = 'out_of_stock',
  SystemError = 'system_error',
  FraudDetected = 'fraud_detected'
}

interface CancelOrderResponse {
  order: OrderDto;
  refundAmount: Money;
  refundMethod: string;
  estimatedRefundDate: Date;
  restoredItems: Array<{
    productId: string;
    quantity: number;
  }>;
}

class CancelOrderUseCase implements UseCase<CancelOrderRequest, CancelOrderResponse> {
  constructor(
    private orderRepository: OrderRepository,
    private customerRepository: CustomerRepository,
    private productRepository: ProductRepository,
    private paymentService: PaymentService,
    private inventoryService: InventoryService,
    private shippingService: ShippingService,
    private notificationService: NotificationService,
    private loyaltyService: LoyaltyService,
    private eventBus: EventBus,
    private unitOfWork: UnitOfWork,
    private logger: Logger
  ) {}

  async execute(request: CancelOrderRequest): Promise<Result<CancelOrderResponse, UseCaseError>> {
    // 複雑なビジネスロジックを段階的に実装:
    // 1. 注文・顧客の検証
    // 2. キャンセル可能性の判定
    // 3. 在庫復元処理
    // 4. 返金処理
    // 5. ポイント・クーポンの処理
    // 6. 配送キャンセル
    // 7. 通知送信
    // 8. イベント発行

    // 実装
  }
}

// 要件:
// - 全てのビジネスルールを適切に実装
// - エラーハンドリングとロールバック処理
// - ログ記録と監査証跡
// - イベント駆動アーキテクチャの活用
// - テスト容易性を考慮した設計
```

    public readonly productData: {
      name: string;
      description: string;
      price: { amount: number; currency: string };
      category: string;
      initialStock: number;
    },
    public readonly timestamp: Date = new Date()
  ) {}
}

class CreateProductCommandHandler implements CommandHandler<CreateProductCommand> {
  constructor(
    private createProductUseCase: CreateProductUseCase,
    private logger: Logger
  ) {}

  async handle(command: CreateProductCommand): Promise<Result<void, CommandError>> {
    try {
      this.logger.info('Handling CreateProductCommand', {
        commandId: command.commandId,
        productName: command.productData.name
      });

      const request: CreateProductRequest = {
        name: command.productData.name,
        description: command.productData.description,
        price: command.productData.price,
        category: command.productData.category,
        initialStock: command.productData.initialStock
      };

      const result = await this.createProductUseCase.execute(request);
      
      if (result.isErr()) {
        return Result.err(new CommandError(`Command failed: ${result.error.message}`));
      }

      this.logger.info('CreateProductCommand handled successfully', {
        commandId: command.commandId,
        productId: result.value.product.id
      });

      return Result.ok(undefined);
    } catch (error) {
      this.logger.error('Error handling CreateProductCommand', {
        commandId: command.commandId,
        error
      });
      return Result.err(new CommandError('Unexpected error occurred'));
    }
  }
}

// Query側（読み込み専用）
interface Query {
  readonly queryId: string;
  readonly timestamp: Date;
}

interface QueryHandler<TQuery extends Query, TResult> {
  handle(query: TQuery): Promise<Result<TResult, QueryError>>;
}

// GetProductsQuery
class GetProductsQuery implements Query {
  constructor(
    public readonly queryId: string,
    public readonly criteria: {
      category?: string;
      priceRange?: { min: number; max: number };
      searchTerm?: string;
      page?: number;
      pageSize?: number;
    },
    public readonly timestamp: Date = new Date()
  ) {}
}

class GetProductsQueryHandler implements QueryHandler<GetProductsQuery, ProductListResult> {
  constructor(
    private productReadRepository: ProductReadRepository,
    private logger: Logger
  ) {}

  async handle(query: GetProductsQuery): Promise<Result<ProductListResult, QueryError>> {
    try {
      this.logger.info('Handling GetProductsQuery', {
        queryId: query.queryId,
        criteria: query.criteria
      });

      const searchCriteria = this.buildSearchCriteria(query.criteria);
      const products = await this.productReadRepository.findByCriteria(searchCriteria);
      const totalCount = await this.productReadRepository.countByCriteria(searchCriteria);

      const productDtos: ProductDto[] = products.map(product => ({
        id: product.id,
        name: product.name,
        description: product.description,
        price: {
          amount: product.priceAmount,
          currency: product.priceCurrency,
          formatted: this.formatPrice(product.priceAmount, product.priceCurrency)
        },
        category: product.category,
        stockQuantity: product.stockQuantity,
        isActive: product.isActive,
        createdAt: product.createdAt.toISOString(),
        updatedAt: product.updatedAt.toISOString()
      }));

      const result: ProductListResult = {
        products: productDtos,
        totalCount,
        page: query.criteria.page || 1,
        pageSize: query.criteria.pageSize || 10,
        hasMore: (query.criteria.page || 1) * (query.criteria.pageSize || 10) < totalCount
      };

      return Result.ok(result);
    } catch (error) {
      this.logger.error('Error handling GetProductsQuery', {
        queryId: query.queryId,
        error
      });
      return Result.err(new QueryError('Failed to get products'));
    }
  }

  private buildSearchCriteria(criteria: any): ProductReadSearchCriteria {
    return {
      category: criteria.category,
      priceMin: criteria.priceRange?.min,
      priceMax: criteria.priceRange?.max,
      searchTerm: criteria.searchTerm,
      page: criteria.page || 1,
      pageSize: criteria.pageSize || 10
    };
  }

  private formatPrice(amount: number, currency: string): string {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency
    });
    return formatter.format(amount);
  }
}

// Read側のリポジトリ（クエリ最適化）
interface ProductReadRepository {
  findByCriteria(criteria: ProductReadSearchCriteria): Promise<ProductReadModel[]>;
  countByCriteria(criteria: ProductReadSearchCriteria): Promise<number>;
  findById(id: string): Promise<ProductReadModel | null>;
}

interface ProductReadSearchCriteria {
  category?: string;
  priceMin?: number;
  priceMax?: number;
  searchTerm?: string;
  page: number;
  pageSize: number;
}

interface ProductReadModel {
  id: string;
  name: string;
  description: string;
  priceAmount: number;
  priceCurrency: string;
  category: string;
  stockQuantity: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface ProductListResult {
  products: ProductDto[];
  totalCount: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

class CommandError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CommandError';
  }
}

class QueryError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'QueryError';
  }
}
```

## 🎯 実践演習

### 演習 3-1: Repository・Unit of Work 完全実装 🔶

**目標**: 型安全で拡張可能なRepository実装とトランザクション管理

```typescript
// 以下の要件を満たすRepositoryシステムを実装せよ

// 1. Unit of Work パターン
interface UnitOfWork {
  begin(): Promise<void>;
  commit(): Promise<void>;
  rollback(): Promise<void>;
  registerNew<T>(entity: T, repository: string): void;
  registerDirty<T>(entity: T, repository: string): void;
  registerRemoved<T>(entity: T, repository: string): void;
}

// 2. 型安全な Repository 基底クラス
abstract class BaseRepository<TEntity, TId> {
  constructor(protected unitOfWork: UnitOfWork) {}
  
  abstract findById(id: TId): Promise<Option<TEntity>>;
  abstract save(entity: TEntity): Promise<Result<void, RepositoryError>>;
  abstract delete(id: TId): Promise<Result<void, RepositoryError>>;
}

// 3. 検索機能付きRepository
interface SearchableRepository<TEntity, TCriteria> {
  search(criteria: TCriteria): Promise<SearchResult<TEntity>>;
  count(criteria?: TCriteria): Promise<number>;
}

interface SearchResult<T> {
  items: T[];
  totalCount: number;
  hasMore: boolean;
  nextCursor?: string;
}

// 実装例
class PostgresProductRepository extends BaseRepository<Product, ProductId>
  implements ProductRepository, SearchableRepository<Product, ProductSearchCriteria> {
  
  // 実装
}

// 使用例
const unitOfWork = new PostgresUnitOfWork(dbConnection);
const productRepo = new PostgresProductRepository(unitOfWork);
const orderRepo = new PostgresOrderRepository(unitOfWork);

// トランザクション処理
await unitOfWork.begin();
try {
  await productRepo.save(product);
  await orderRepo.save(order);
  await unitOfWork.commit();
} catch (error) {
  await unitOfWork.rollback();
  throw error;
}
```

### 演習 3-2: Use Case オーケストレーション実装 🔥

**目標**: 複雑なビジネスフローを管理するUse Case設計

```typescript
// マルチステップのビジネスプロセスを実装せよ

// ProcessOrderWorkflow Use Case
interface ProcessOrderWorkflowRequest {
  orderId: string;
  action: 'confirm' | 'cancel' | 'ship' | 'deliver';
  metadata?: Record<string, any>;
}

interface ProcessOrderWorkflowResponse {
  orderId: string;
  newStatus: OrderStatus;
  nextPossibleActions: string[];
  notifications: NotificationResult[];
}

class ProcessOrderWorkflowUseCase {
  constructor(
    private orderRepository: OrderRepository,
    private inventoryService: InventoryService,
    private paymentService: PaymentService,
    private shippingService: ShippingService,
    private notificationService: NotificationService,
    private workflowEngine: WorkflowEngine,
    private eventBus: EventBus,
    private logger: Logger
  ) {}

  async execute(request: ProcessOrderWorkflowRequest): Promise<Result<ProcessOrderWorkflowResponse, UseCaseError>> {
    // 複雑なワークフロー管理を実装
    // 1. 現在の注文状態の検証
    // 2. アクション実行可能性の判定
    // 3. ビジネスルールの適用
    // 4. 外部サービスとの連携
    // 5. 状態遷移の実行
    // 6. イベント発行
    // 7. 通知送信
    
    // 実装
  }
}

// ワークフローエンジン
interface WorkflowEngine {
  canTransition(fromStatus: OrderStatus, action: string): boolean;
  getNextStatus(currentStatus: OrderStatus, action: string): OrderStatus;
  getAvailableActions(status: OrderStatus): string[];
  validateTransition(order: Order, action: string): Result<void, WorkflowError>;
}

// 状態機械パターンの実装
class OrderStateMachine implements WorkflowEngine {
  private transitions: Map<string, Map<string, OrderStatus>>;
  
  constructor() {
    this.transitions = new Map([
      ['pending', new Map([
        ['confirm', OrderStatus.Confirmed],
        ['cancel', OrderStatus.Cancelled]
      ])],
      ['confirmed', new Map([
        ['ship', OrderStatus.Shipped],
        ['cancel', OrderStatus.Cancelled]
      ])],
      ['shipped', new Map([
        ['deliver', OrderStatus.Delivered]
      ])]
    ]);
  }
  
  // 実装
}
```

## 📊 Week 3-4 評価基準

### 理解度チェックリスト

#### Repository パターン (35%)

- [ ] Repository インターフェースを適切に設計できる
- [ ] Option型を使った null安全な実装ができる
- [ ] 検索条件を型安全に設計できる
- [ ] データマッパーパターンを実装できる
- [ ] Unit of Work パターンを活用できる

#### Use Case レイヤー (30%)

- [ ] Use Case の責任を適切に分離できる
- [ ] 複雑なビジネスフローを設計できる
- [ ] トランザクション境界を適切に設定できる
- [ ] エラーハンドリングを包括的に実装できる
- [ ] ドメインイベントを効果的に活用できる

#### Domain Service (20%)

- [ ] Domain Service の適用場面を判断できる
- [ ] ステートレスなドメイン操作を実装できる
- [ ] 複数エンティティのビジネスルールを管理できる
- [ ] 外部システムとの統合を適切に抽象化できる

#### CQRS・設計品質 (15%)

- [ ] Command と Query の分離を実装できる
- [ ] 読み書き最適化を適切に行える
- [ ] 型安全性を維持したアーキテクチャ設計
- [ ] テスタビリティの高い実装

### 成果物チェックリスト

- [ ] **Repository ライブラリ**: 型安全で再利用可能な実装
- [ ] **Use Case フレームワーク**: 標準化された Use Case パターン
- [ ] **Domain Service 実装例**: 実用的なドメインサービス
- [ ] **CQRS 基礎実装**: Command/Query 分離パターン
- [ ] **Unit of Work 実装**: トランザクション管理システム

## 🔄 Week 5-6 への準備

### 次週学習内容の予習

```typescript
// Week 5-6で学習するClean Architecture・関数型プログラミングの基礎概念
// 以下のパターンを読んで理解しておくこと

// Clean Architecture 層分離
interface DomainLayer {
  entities: 'Product | Order | Customer';
  valueObjects: 'Money | Email | Address';
  domainServices: 'ProductDomainService';
}

interface ApplicationLayer {
  useCases: 'CreateProductUseCase | PlaceOrderUseCase';
  applicationServices: 'ProductApplicationService';
}

interface InfrastructureLayer {
  repositories: 'PostgresProductRepository';
  externalServices: 'PaymentService | ShippingService';
}

interface InterfaceLayer {
  controllers: 'ProductController | OrderController';
  dto: 'ProductDto | OrderDto';
}

// 関数型プログラミングパターン
type Pipe = <T>(value: T) => <U>(fn: (value: T) => U) => U;
type Compose = <T, U, V>(f: (x: U) => V, g: (x: T) => U) => (x: T) => V;

// モナドパターン
interface Monad<T> {
  flatMap<U>(fn: (value: T) => Monad<U>): Monad<U>;
  map<U>(fn: (value: T) => U): Monad<U>;
}
```

### 環境準備

- [ ] 関数型ライブラリ（fp-ts, Ramda など）の調査
- [ ] Clean Architecture テンプレートの準備
- [ ] 依存性注入フレームワークの検討
- [ ] アーキテクチャテストツールの準備

### 学習継続のコツ

1. **アーキテクチャ思考**: 層の責任を意識した設計
2. **テスタビリティ重視**: モックしやすい設計の追求
3. **パフォーマンス考慮**: 読み書き分離による最適化
4. **段階的リファクタリング**: 既存コードの漸進的改善

---

**📌 重要**: Week 3-4 は アプリケーション層の設計パターンを確実に習得する重要な期間です。Repository と Use Case の適切な実装により、保守性とテスタビリティの高いシステムの基盤を構築しましょう。
