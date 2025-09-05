# Session5: 依存性逆転の原則（DIP）を TypeScript で理解する

依存性逆転の原則は、2 つのルールから構成されています。

1. **上位モジュールは、下位モジュールに依存してはならない。両者とも、抽象に依存すべきである。**
2. **抽象は、詳細に依存してはならない。詳細は、抽象に依存すべきである。**

この言葉は少し難解ですが、要点は非常にシンプルです。

**「具体的な実装（詳細）に直接依存するのではなく、抽象的なインターフェース（抽象）に依存しよう」**

ということです。

ここで言う「上位モジュール」とは、ビジネスロジックなど、システムの核となる部分を指し、「下位モジュール」とは、データベース操作や外部 API との通信など、具体的な実装の詳細を指します。

通常、私たちは「上位モジュールが下位モジュールを呼び出す」という依存関係を考えがちです。しかし、この原則は、その**依存性の方向を「逆転」させなさい**、と教えています。

## なぜ依存性逆転の原則が重要なのか？

もし、上位モジュールが下位モジュール（具体的な実装）に直接依存していると、次のような問題が起こります。

- **変更に弱い:** 下位モジュールの仕様変更（例：利用するデータベースを MySQL から PostgreSQL に変更する）が、上位モジュールに直接影響し、修正を強いることになります。
- **テストが困難:** 上位モジュールをテストする際に、下位モジュール（例：実際のデータベース）も一緒に動かす必要があり、テストの準備が大変になったり、テストが不安定になったりします。
- **再利用性の低下:** 上位モジュールが特定の下位モジュールと固く結びついているため、他の場所で再利用することが難しくなります。

この原則を守ることで、モジュール間の結合度を下げ、柔軟で交換可能、かつテストしやすいシステムを構築することができます。

## TypeScript での具体例

ユーザーのデータを取得し、レポートを作成する機能を考えてみましょう。

### 違反している例：

`ReportGenerator`（上位モジュール）が、具体的なデータベース実装である`MySQLDatabase`（下位モジュール）を直接利用しています。

```typescript
// 下位モジュール: 具体的なデータベース実装
class MySQLDatabase {
  fetchData(userId: string): string {
    // MySQLからデータを取得する具体的なロジック
    console.log("Fetching data from MySQL...");
    return `User data for ${userId} from MySQL`;
  }
}

// 上位モジュール: レポート生成ロジック
class ReportGenerator {
  private database: MySQLDatabase;

  constructor() {
    // ❌ 上位モジュールが下位モジュールを直接インスタンス化している（密結合）
    this.database = new MySQLDatabase();
  }

  generateReport(userId: string): void {
    const data = this.database.fetchData(userId);
    console.log(`Generating report with: ${data}`);
  }
}

// --- 使用例 ---
const reportGenerator = new ReportGenerator();
reportGenerator.generateReport("user-123");
```

このコードでは、`ReportGenerator`は`MySQLDatabase`の存在を完全に知ってしまっています。もし将来、「データベースを**PostgreSQL**に変えよう」となった場合、`ReportGenerator`クラスのコンストラクタを直接修正する必要があります。これは「オープン・クローズドの原則」にも違反します。

### 準拠している例：

この問題を解決するために、上位モジュールと下位モジュールの間に**抽象（インターフェース）**を挟みます。

**ステップ 1: 抽象（インターフェース）を定義する**
まず、上位モジュール（`ReportGenerator`）が「必要とする機能」をインターフェースとして定義します。

```typescript
// 抽象: データソースの振る舞いを定義するインターフェース
interface IDataSource {
  fetchData(userId: string): string;
}
```

**ステップ 2: 下位モジュールが抽象を実装する**
次に、具体的なデータベースクラスが、この`IDataSource`インターフェースを実装します。

```typescript
// 詳細: IDataSourceを実装したMySQLクラス
class MySQLDatabase implements IDataSource {
  fetchData(userId: string): string {
    console.log("Fetching data from MySQL...");
    return `User data for ${userId} from MySQL`;
  }
}

// 詳細: IDataSourceを実装したPostgreSQLクラス（将来の拡張）
class PostgreSQLDatabase implements IDataSource {
  fetchData(userId: string): string {
    console.log("Fetching data from PostgreSQL...");
    return `User data for ${userId} from PostgreSQL`;
  }
}
```

**ステップ 3: 上位モジュールが抽象に依存する**
最後に、`ReportGenerator`が具体的なクラスではなく、`IDataSource`インターフェースに依存するように変更します。このとき、外部から依存オブジェクトを注入する**依存性の注入（Dependency Injection, DI）**というテクニックを使います。

```typescript
// 上位モジュール: IDataSourceインターフェースに依存
class ReportGenerator {
  // 具体的なクラスではなく、インターフェースに依存
  private dataSource: IDataSource;

  // ✅ コンストラクタで外部から依存性を注入（DI）
  constructor(dataSource: IDataSource) {
    this.dataSource = dataSource;
  }

  generateReport(userId: string): void {
    const data = this.dataSource.fetchData(userId);
    console.log(`Generating report with: ${data}`);
  }
}
```

この`ReportGenerator`は、もはや`MySQLDatabase`や`PostgreSQLDatabase`の存在を全く知りません。ただ`IDataSource`という「契約」を満たすオブジェクトが渡されることだけを知っています。

**ステップ 4: 依存性を組み立てて注入する**
アプリケーションの起動時など、どこか一箇所で具体的なオブジェクトを生成し、上位モジュールに注入します。

```typescript
// --- 使用例 ---

// 1. MySQLを使いたい場合
const mySQL = new MySQLDatabase();
const reportGeneratorForMySQL = new ReportGenerator(mySQL);
reportGeneratorForMySQL.generateReport("user-123");

console.log("\n--- データベースを変更 --- \n");

// 2. PostgreSQLを使いたい場合
const postgreSQL = new PostgreSQLDatabase();
const reportGeneratorForPostgreSQL = new ReportGenerator(postgreSQL);
// ReportGeneratorクラスを一切変更することなく、データソースを差し替えられた！
reportGeneratorForPostgreSQL.generateReport("user-456");
```

**実行結果:**

```
Fetching data from MySQL...
Generating report with: User data for user-123 from MySQL

--- データベースを変更 ---

Fetching data from PostgreSQL...
Generating report with: User data for user-456 from PostgreSQL
```

### テストの例

この設計の大きなメリットの一つは、テストが非常に簡単になることです。

```typescript
// テスト用のモックデータソース
class MockDataSource implements IDataSource {
  fetchData(userId: string): string {
    return `Mock data for ${userId}`;
  }
}

// テストコード
function testReportGenerator() {
  console.log("--- テスト実行 ---");

  // モックデータソースを注入
  const mockDataSource = new MockDataSource();
  const reportGenerator = new ReportGenerator(mockDataSource);

  // 実際のデータベースに接続せずにテストできる！
  reportGenerator.generateReport("test-user");
}

testReportGenerator();
```

**実行結果:**

```
--- テスト実行 ---
Generating report with: Mock data for test-user
```

## Angular での具体例

Angular アプリケーションでは、依存性逆転の原則は依存性注入（DI）システムと組み合わせることで、非常に強力な設計パターンとなります。

### 違反している例（Angular）：

商品情報を表示するコンポーネントで、具体的な HTTP サービスに直接依存している例です。

```typescript
// services/http-product.service.ts - 具体的なHTTP実装
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { map, catchError } from "rxjs/operators";

export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
}

@Injectable({
  providedIn: "root",
})
export class HttpProductService {
  private apiUrl = "https://api.example.com/products";

  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl).pipe(
      catchError((error) => {
        console.error("HTTP Error:", error);
        return of([]);
      })
    );
  }

  getProduct(id: number): Observable<Product | null> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`).pipe(
      catchError((error) => {
        console.error("HTTP Error:", error);
        return of(null);
      })
    );
  }

  createProduct(product: Omit<Product, "id">): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product);
  }

  updateProduct(id: number, product: Partial<Product>): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, product);
  }

  deleteProduct(id: number): Observable<boolean> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      map(() => true),
      catchError(() => of(false))
    );
  }
}

// components/product-list.component.ts - 具体実装への依存（DIP違反）
import { Component, OnInit } from "@angular/core";
import { HttpProductService, Product } from "../services/http-product.service";

@Component({
  selector: "app-product-list",
  template: `
    <div class="product-list">
      <h2>商品一覧</h2>

      <div *ngIf="loading" class="loading">
        <mat-spinner></mat-spinner>
        読み込み中...
      </div>

      <div *ngIf="error" class="error">
        {{ error }}
      </div>

      <div class="products" *ngIf="!loading && !error">
        <mat-card *ngFor="let product of products" class="product-card">
          <mat-card-header>
            <mat-card-title>{{ product.name }}</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <p>価格: ¥{{ product.price | number }}</p>
            <p>{{ product.description }}</p>
          </mat-card-content>
          <mat-card-actions>
            <button mat-button (click)="editProduct(product)">編集</button>
            <button mat-button color="warn" (click)="deleteProduct(product.id)">
              削除
            </button>
          </mat-card-actions>
        </mat-card>
      </div>
    </div>
  `,
  styleUrls: ["./product-list.component.scss"],
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  loading = false;
  error = "";

  // ❌ 具体的なHTTP実装に直接依存（DIP違反）
  constructor(private httpProductService: HttpProductService) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.loading = true;
    this.error = "";

    // 具体的なHTTPサービスに直接依存
    this.httpProductService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.loading = false;
      },
      error: (error) => {
        this.error = "商品の読み込みに失敗しました";
        this.loading = false;
      },
    });
  }

  editProduct(product: Product) {
    // 編集機能 - HTTPサービスに直接依存
    console.log("編集:", product);
  }

  deleteProduct(id: number) {
    // 削除機能 - HTTPサービスに直接依存
    this.httpProductService.deleteProduct(id).subscribe({
      next: (success) => {
        if (success) {
          this.loadProducts(); // 一覧を再読み込み
        }
      },
      error: (error) => {
        this.error = "削除に失敗しました";
      },
    });
  }
}
```

この設計の問題点：

- コンポーネントが具体的な HTTP 実装に強く依存
- データソースを変更（例：ローカルストレージ、キャッシュ）したい場合、コンポーネントも修正が必要
- テスト時にモック HTTP サービスの作成が困難
- HTTP 通信の詳細がコンポーネントレイヤーまで漏れ出している

### 準拠している例（Angular）：

依存性逆転の原則に従って、抽象化（インターフェース）を導入します。

**ステップ 1: 抽象インターフェースを定義**

```typescript
// interfaces/product-repository.interface.ts - 抽象インターフェース
import { Observable } from "rxjs";

export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  category?: string;
  imageUrl?: string;
}

// 高レベル（ビジネス ロジック）が依存する抽象
export abstract class ProductRepository {
  abstract getProducts(): Observable<Product[]>;
  abstract getProduct(id: number): Observable<Product | null>;
  abstract getProductsByCategory(category: string): Observable<Product[]>;
  abstract createProduct(product: Omit<Product, "id">): Observable<Product>;
  abstract updateProduct(
    id: number,
    product: Partial<Product>
  ): Observable<Product>;
  abstract deleteProduct(id: number): Observable<boolean>;
  abstract searchProducts(query: string): Observable<Product[]>;
}
```

**ステップ 2: 具体的な実装クラス（詳細）**

```typescript
// repositories/http-product.repository.ts - HTTP実装（詳細）
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { map, catchError } from "rxjs/operators";
import {
  ProductRepository,
  Product,
} from "../interfaces/product-repository.interface";

@Injectable()
export class HttpProductRepository extends ProductRepository {
  private apiUrl = "https://api.example.com/products";

  constructor(private http: HttpClient) {
    super();
  }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl).pipe(
      catchError((error) => {
        console.error("HTTP Error:", error);
        return of([]);
      })
    );
  }

  getProduct(id: number): Observable<Product | null> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`).pipe(
      catchError((error) => {
        console.error("HTTP Error:", error);
        return of(null);
      })
    );
  }

  getProductsByCategory(category: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}?category=${category}`).pipe(
      catchError((error) => {
        console.error("HTTP Error:", error);
        return of([]);
      })
    );
  }

  createProduct(product: Omit<Product, "id">): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product);
  }

  updateProduct(id: number, product: Partial<Product>): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, product);
  }

  deleteProduct(id: number): Observable<boolean> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      map(() => true),
      catchError(() => of(false))
    );
  }

  searchProducts(query: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/search?q=${query}`).pipe(
      catchError((error) => {
        console.error("HTTP Search Error:", error);
        return of([]);
      })
    );
  }
}

// repositories/local-storage-product.repository.ts - ローカルストレージ実装（詳細）
@Injectable()
export class LocalStorageProductRepository extends ProductRepository {
  private storageKey = "products";

  getProducts(): Observable<Product[]> {
    const products = this.loadFromStorage();
    return of(products);
  }

  getProduct(id: number): Observable<Product | null> {
    const products = this.loadFromStorage();
    const product = products.find((p) => p.id === id) || null;
    return of(product);
  }

  getProductsByCategory(category: string): Observable<Product[]> {
    const products = this.loadFromStorage();
    const filtered = products.filter((p) => p.category === category);
    return of(filtered);
  }

  createProduct(product: Omit<Product, "id">): Observable<Product> {
    const products = this.loadFromStorage();
    const newProduct: Product = { ...product, id: Date.now() };
    products.push(newProduct);
    this.saveToStorage(products);
    return of(newProduct);
  }

  updateProduct(id: number, product: Partial<Product>): Observable<Product> {
    const products = this.loadFromStorage();
    const index = products.findIndex((p) => p.id === id);
    if (index !== -1) {
      products[index] = { ...products[index], ...product };
      this.saveToStorage(products);
      return of(products[index]);
    }
    throw new Error("Product not found");
  }

  deleteProduct(id: number): Observable<boolean> {
    const products = this.loadFromStorage();
    const index = products.findIndex((p) => p.id === id);
    if (index !== -1) {
      products.splice(index, 1);
      this.saveToStorage(products);
      return of(true);
    }
    return of(false);
  }

  searchProducts(query: string): Observable<Product[]> {
    const products = this.loadFromStorage();
    const filtered = products.filter(
      (p) =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.description.toLowerCase().includes(query.toLowerCase())
    );
    return of(filtered);
  }

  private loadFromStorage(): Product[] {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : [];
  }

  private saveToStorage(products: Product[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(products));
  }
}

// repositories/cache-product.repository.ts - キャッシュ付きHTTP実装（詳細）
@Injectable()
export class CacheProductRepository extends ProductRepository {
  private cache = new Map<string, { data: any; timestamp: number }>();
  private cacheTimeout = 5 * 60 * 1000; // 5分

  constructor(private http: HttpClient) {
    super();
  }

  getProducts(): Observable<Product[]> {
    const cacheKey = "all_products";
    const cached = this.getFromCache(cacheKey);

    if (cached) {
      return of(cached);
    }

    return this.http.get<Product[]>("https://api.example.com/products").pipe(
      map((products) => {
        this.setCache(cacheKey, products);
        return products;
      }),
      catchError((error) => {
        console.error("HTTP Error:", error);
        return of([]);
      })
    );
  }

  getProduct(id: number): Observable<Product | null> {
    const cacheKey = `product_${id}`;
    const cached = this.getFromCache(cacheKey);

    if (cached) {
      return of(cached);
    }

    return this.http
      .get<Product>(`https://api.example.com/products/${id}`)
      .pipe(
        map((product) => {
          this.setCache(cacheKey, product);
          return product;
        }),
        catchError((error) => {
          console.error("HTTP Error:", error);
          return of(null);
        })
      );
  }

  // その他のメソッドも同様にキャッシュ機能付きで実装
  getProductsByCategory(category: string): Observable<Product[]> {
    // キャッシュ機能付きの実装
    return this.http.get<Product[]>(
      `https://api.example.com/products?category=${category}`
    );
  }

  createProduct(product: Omit<Product, "id">): Observable<Product> {
    return this.http
      .post<Product>("https://api.example.com/products", product)
      .pipe(
        map((newProduct) => {
          this.clearCache(); // 新規作成時はキャッシュをクリア
          return newProduct;
        })
      );
  }

  updateProduct(id: number, product: Partial<Product>): Observable<Product> {
    return this.http
      .put<Product>(`https://api.example.com/products/${id}`, product)
      .pipe(
        map((updatedProduct) => {
          this.clearCache(); // 更新時はキャッシュをクリア
          return updatedProduct;
        })
      );
  }

  deleteProduct(id: number): Observable<boolean> {
    return this.http.delete(`https://api.example.com/products/${id}`).pipe(
      map(() => {
        this.clearCache(); // 削除時はキャッシュをクリア
        return true;
      }),
      catchError(() => of(false))
    );
  }

  searchProducts(query: string): Observable<Product[]> {
    return this.http.get<Product[]>(
      `https://api.example.com/products/search?q=${query}`
    );
  }

  private getFromCache(key: string): any {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }
    this.cache.delete(key);
    return null;
  }

  private setCache(key: string, data: any): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  private clearCache(): void {
    this.cache.clear();
  }
}
```

**ステップ 3: ビジネスロジック層（高レベル）**

```typescript
// services/product.service.ts - ビジネスロジック（高レベル）
import { Injectable } from "@angular/core";
import { Observable, BehaviorSubject } from "rxjs";
import { map, tap } from "rxjs/operators";
import {
  ProductRepository,
  Product,
} from "../interfaces/product-repository.interface";

@Injectable({
  providedIn: "root",
})
export class ProductService {
  private productsSubject = new BehaviorSubject<Product[]>([]);
  public products$ = this.productsSubject.asObservable();

  // 抽象に依存（DIP準拠）
  constructor(private productRepository: ProductRepository) {}

  loadProducts(): Observable<Product[]> {
    return this.productRepository
      .getProducts()
      .pipe(tap((products) => this.productsSubject.next(products)));
  }

  getProduct(id: number): Observable<Product | null> {
    return this.productRepository.getProduct(id);
  }

  getProductsByPriceRange(
    minPrice: number,
    maxPrice: number
  ): Observable<Product[]> {
    return this.productRepository
      .getProducts()
      .pipe(
        map((products) =>
          products.filter((p) => p.price >= minPrice && p.price <= maxPrice)
        )
      );
  }

  searchProducts(query: string): Observable<Product[]> {
    if (!query.trim()) {
      return this.loadProducts();
    }
    return this.productRepository.searchProducts(query);
  }

  createProduct(product: Omit<Product, "id">): Observable<Product> {
    return this.productRepository.createProduct(product).pipe(
      tap(() => this.loadProducts().subscribe()) // 作成後に一覧を更新
    );
  }

  updateProduct(id: number, product: Partial<Product>): Observable<Product> {
    return this.productRepository.updateProduct(id, product).pipe(
      tap(() => this.loadProducts().subscribe()) // 更新後に一覧を更新
    );
  }

  deleteProduct(id: number): Observable<boolean> {
    return this.productRepository.deleteProduct(id).pipe(
      tap((success) => {
        if (success) {
          this.loadProducts().subscribe(); // 削除後に一覧を更新
        }
      })
    );
  }

  // ビジネスルール: 高価格商品の判定
  isExpensiveProduct(product: Product): boolean {
    return product.price > 10000;
  }

  // ビジネスルール: 割引価格の計算
  calculateDiscountPrice(product: Product, discountRate: number): number {
    return product.price * (1 - discountRate);
  }

  // ビジネスルール: 商品のカテゴリ別集計
  getProductCountByCategory(): Observable<{ [category: string]: number }> {
    return this.products$.pipe(
      map((products) => {
        const counts: { [category: string]: number } = {};
        products.forEach((product) => {
          const category = product.category || "その他";
          counts[category] = (counts[category] || 0) + 1;
        });
        return counts;
      })
    );
  }
}
```

**ステップ 4: プレゼンテーション層（高レベル）**

```typescript
// components/product-list.component.ts - 抽象に依存（DIP準拠）
import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { ProductService } from "../services/product.service";
import { Product } from "../interfaces/product-repository.interface";

@Component({
  selector: "app-product-list",
  template: `
    <div class="product-list-container">
      <mat-toolbar>
        <span>商品管理</span>
        <span class="spacer"></span>
        <button mat-raised-button color="primary" (click)="addProduct()">
          <mat-icon>add</mat-icon>
          商品追加
        </button>
      </mat-toolbar>

      <div class="search-section">
        <mat-form-field appearance="outline">
          <mat-label>商品検索</mat-label>
          <input matInput [(ngModel)]="searchQuery" (input)="onSearch()" />
          <mat-icon matSuffix>search</mat-icon>
        </mat-form-field>
      </div>

      <div class="filter-section">
        <mat-form-field appearance="outline">
          <mat-label>価格範囲</mat-label>
          <mat-select (selectionChange)="onPriceRangeChange($event)">
            <mat-option value="all">すべて</mat-option>
            <mat-option value="0-1000">¥0 - ¥1,000</mat-option>
            <mat-option value="1000-5000">¥1,000 - ¥5,000</mat-option>
            <mat-option value="5000-10000">¥5,000 - ¥10,000</mat-option>
            <mat-option value="10000+">¥10,000以上</mat-option>
          </mat-select>
        </mat-form-field>
      </div>

      <div *ngIf="loading" class="loading-section">
        <mat-spinner></mat-spinner>
        <p>読み込み中...</p>
      </div>

      <div *ngIf="error" class="error-section">
        <mat-icon color="warn">error</mat-icon>
        <p>{{ error }}</p>
        <button mat-button (click)="retry()">再試行</button>
      </div>

      <div class="products-grid" *ngIf="!loading && !error">
        <mat-card *ngFor="let product of filteredProducts" class="product-card">
          <div class="product-image">
            <img
              [src]="product.imageUrl || 'assets/no-image.png'"
              [alt]="product.name"
            />
          </div>

          <mat-card-header>
            <mat-card-title>{{ product.name }}</mat-card-title>
            <mat-card-subtitle>{{ product.category }}</mat-card-subtitle>
          </mat-card-header>

          <mat-card-content>
            <div class="price-section">
              <span class="current-price">¥{{ product.price | number }}</span>
              <span *ngIf="isExpensive(product)" class="expensive-badge"
                >高額商品</span
              >
            </div>
            <p class="description">{{ product.description }}</p>
          </mat-card-content>

          <mat-card-actions align="end">
            <button mat-button (click)="editProduct(product)">
              <mat-icon>edit</mat-icon>
              編集
            </button>
            <button mat-button color="warn" (click)="deleteProduct(product)">
              <mat-icon>delete</mat-icon>
              削除
            </button>
          </mat-card-actions>
        </mat-card>
      </div>
    </div>
  `,
  styleUrls: ["./product-list.component.scss"],
})
export class ProductListComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  loading = false;
  error = "";
  searchQuery = "";

  private destroy$ = new Subject<void>();

  // ビジネスロジック層に依存（抽象に依存）
  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.loadProducts();

    // 商品一覧の状態を監視
    this.productService.products$
      .pipe(takeUntil(this.destroy$))
      .subscribe((products) => {
        this.products = products;
        this.filteredProducts = products;
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadProducts() {
    this.loading = true;
    this.error = "";

    this.productService.loadProducts().subscribe({
      next: (products) => {
        this.loading = false;
        // データは自動的にproducts$ストリームから受け取る
      },
      error: (error) => {
        this.error = "商品の読み込みに失敗しました";
        this.loading = false;
        console.error("Load products error:", error);
      },
    });
  }

  onSearch() {
    if (this.searchQuery.trim()) {
      this.productService.searchProducts(this.searchQuery).subscribe({
        next: (products) => {
          this.filteredProducts = products;
        },
        error: (error) => {
          this.error = "検索に失敗しました";
          console.error("Search error:", error);
        },
      });
    } else {
      this.filteredProducts = this.products;
    }
  }

  onPriceRangeChange(event: any) {
    const value = event.value;

    if (value === "all") {
      this.filteredProducts = this.products;
    } else if (value === "10000+") {
      this.filteredProducts = this.products.filter((p) => p.price >= 10000);
    } else {
      const [min, max] = value.split("-").map(Number);
      this.productService
        .getProductsByPriceRange(min, max || Infinity)
        .subscribe({
          next: (products) => {
            this.filteredProducts = products;
          },
        });
    }
  }

  addProduct() {
    // 商品追加ダイアログを開く
    console.log("商品追加");
  }

  editProduct(product: Product) {
    // 商品編集ダイアログを開く
    console.log("商品編集:", product);
  }

  deleteProduct(product: Product) {
    if (confirm(`「${product.name}」を削除しますか？`)) {
      this.productService.deleteProduct(product.id).subscribe({
        next: (success) => {
          if (success) {
            console.log("商品が削除されました");
          } else {
            this.error = "削除に失敗しました";
          }
        },
        error: (error) => {
          this.error = "削除処理でエラーが発生しました";
          console.error("Delete error:", error);
        },
      });
    }
  }

  isExpensive(product: Product): boolean {
    return this.productService.isExpensiveProduct(product);
  }

  retry() {
    this.loadProducts();
  }
}
```

**ステップ 5: 依存性注入の設定**

```typescript
// app.module.ts - 実装を切り替え可能
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { HttpClientModule } from "@angular/common/http";

import { ProductRepository } from "./interfaces/product-repository.interface";
import { HttpProductRepository } from "./repositories/http-product.repository";
import { LocalStorageProductRepository } from "./repositories/local-storage-product.repository";
import { CacheProductRepository } from "./repositories/cache-product.repository";

@NgModule({
  declarations: [
    // コンポーネント類
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    // その他のモジュール
  ],
  providers: [
    // 環境に応じて実装を切り替え
    {
      provide: ProductRepository,
      useClass: environment.production
        ? CacheProductRepository // 本番環境ではキャッシュ付き
        : LocalStorageProductRepository, // 開発環境ではローカルストレージ
    },

    // または、より細かい制御が必要な場合
    // {
    //   provide: ProductRepository,
    //   useFactory: (http: HttpClient) => {
    //     if (environment.production) {
    //       return new CacheProductRepository(http);
    //     } else if (environment.useLocalStorage) {
    //       return new LocalStorageProductRepository();
    //     } else {
    //       return new HttpProductRepository(http);
    //     }
    //   },
    //   deps: [HttpClient]
    // }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

### 分離後のメリット（Angular）：

1. **実装の切り替えが容易**: 設定だけで異なるデータソースに切り替え可能

2. **テスタビリティの大幅向上**:

```typescript
// product.service.spec.ts - テスト例
describe("ProductService", () => {
  let service: ProductService;
  let mockRepository: jasmine.SpyObj<ProductRepository>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj("ProductRepository", [
      "getProducts",
      "getProduct",
      "createProduct",
      "updateProduct",
      "deleteProduct",
    ]);

    TestBed.configureTestingModule({
      providers: [
        ProductService,
        { provide: ProductRepository, useValue: spy },
      ],
    });

    service = TestBed.inject(ProductService);
    mockRepository = TestBed.inject(
      ProductRepository
    ) as jasmine.SpyObj<ProductRepository>;
  });

  it("商品一覧を正しく読み込む", () => {
    const mockProducts: Product[] = [
      { id: 1, name: "Test Product", price: 1000, description: "Test" },
    ];

    mockRepository.getProducts.and.returnValue(of(mockProducts));

    service.loadProducts().subscribe((products) => {
      expect(products).toEqual(mockProducts);
      expect(mockRepository.getProducts).toHaveBeenCalled();
    });
  });

  it("高価格商品を正しく判定する", () => {
    const expensiveProduct: Product = {
      id: 1,
      name: "Expensive",
      price: 15000,
      description: "Test",
    };
    const cheapProduct: Product = {
      id: 2,
      name: "Cheap",
      price: 500,
      description: "Test",
    };

    expect(service.isExpensiveProduct(expensiveProduct)).toBe(true);
    expect(service.isExpensiveProduct(cheapProduct)).toBe(false);
  });
});
```

3. **環境別の柔軟な設定**: 開発、ステージング、本番で異なるデータソース戦略を採用可能

4. **ビジネスロジックの独立性**: データソースに関係なく、ビジネスルールを一貫して適用

5. **保守性**: 新しいデータソースの追加や既存のデータソース変更が他のレイヤーに影響しない

この設計により、Angular アプリケーションでも依存性逆転の原則が守られ、非常に柔軟で保守性の高いアーキテクチャを実現できます。

## 依存性逆転の原則のデメリットとトレードオフ

依存性逆転の原則（DIP）は、SOLID 原則の集大成とも言える非常に強力な設計原則であり、柔軟でテストしやすく、保守性の高いシステムを構築するための鍵となります。しかし、その適用は常にメリットばかりではありません。

### 1. 抽象化による複雑性の増大

DIP を適用するということは、必ずシステムに**抽象（インターフェースや抽象クラス）**のレイヤーを追加することを意味します。

- **コード量とファイル数の増加**: 単純な直接呼び出しに比べ、インターフェース定義、具象クラス、そしてそれらを結びつけるための DI コンテナの設定など、記述すべきコード量や管理すべきファイル数は確実に増加します。
- **間接性の増加による可読性の低下**: コードを追う際に、具体的な実装に直接たどり着けず、一度インターフェースを経由する必要があります。これにより、処理の全体像を把握するのが難しくなったり、デバッグが少し煩雑になったりすることがあります。

### 2. DI コンテナへの依存と学習コスト

現代的なアプリケーション開発では、DIP は**依存性の注入（DI）コンテナ**（または DI フレームワーク）と組み合わせて利用されるのが一般的です。Angular の DI システムなどがその代表例です。

- **フレームワークへの依存**: DI コンテナは非常に便利ですが、それは同時にアプリケーションがそのフレームワークの「魔法」に依存することを意味します。DI コンテナの仕組みや設定方法を学習する必要があり、これが初学者にとっては高いハードルとなることがあります。
- **設定の複雑化**: 依存関係が複雑になってくると、DI コンテナの設定（どのインターフェースにどの具象クラスを注入するか、ライフサイクルをどうするか等）が複雑化し、設定ファイルが肥大化することがあります。

### 3. 過剰設計のリスク

他の原則と同様に、DIP もまた過剰に適用されるリスクをはらんでいます。

- **あらゆるものにインターフェースを作成する**: 変更の可能性がほとんどない安定したクラス（例えば、フレームワークが提供する基本的なユーティリティなど）に対してまでインターフェースを作成するのは、明らかに過剰設計です。
- **単純なアプリケーションへの適用**: 数ページ程度の小規模なアプリケーションや、使い捨てのスクリプトなど、将来的な拡張や変更がほとんど想定されない場合に DIP を厳密に適用すると、そのメリットよりも抽象化レイヤーを追加するコストの方が大きくなってしまいます。

### トレードオフの理解とバランス

DIP を適用するかどうかは、常にトレードオフを考慮して判断する必要があります。

| メリット（適切に適用した場合）                                   | デメリット（過剰または不適切に適用した場合）            |
| :--------------------------------------------------------------- | :------------------------------------------------------ |
| **疎結合**：モジュールの交換が容易になる                         | **複雑性の増大**：抽象レイヤーと DI 設定が増える        |
| **テスト容易性の向上**：モックを使い、単体テストが容易になる     | **コードの追跡が困難**：実装が直接見えず、間接的になる  |
| **再利用性の向上**：モジュールが特定の文脈から独立する           | **学習コスト**：DI コンテナなど、追加の知識が必要になる |
| **並行開発の促進**：インターフェースを共有し、並行して開発できる | **過剰設計のリスク**：単純なケースでは冗長になる        |

### 結論：システムの境界線と変動しやすい箇所に適用する

依存性逆転の原則は、特に以下の様な箇所でその真価を発揮します。

- **システムの境界を越える部分**: データベース、外部 API、ファイルシステムなど、アプリケーションのコアロジックとは異なる関心事を扱う部分。これらの実装は将来変更される可能性が高いため、抽象化する価値が非常に高いです。
- **ビジネスロジックとインフラストラクチャの分離**: アプリケーションの「何をするか（What）」を定義するビジネスロジックと、「どうやってやるか（How）」を定義するインフラストラクチャ（具体的な技術）の間に明確な境界線を引くために DIP を適用します。これはクリーンアーキテクチャなどの設計思想の核となる考え方です。
- **頻繁な変更が予想されるモジュール**: 仕様変更が頻繁に起こりうるビジネスルールや、複数のバリエーションが考えられる機能（通知方法、決済方法など）は、DIP を適用する良い候補です。

DIP は、システムの「安定した中心部」を「不安定な周辺部」から保護するための強力な武器です。すべての依存関係を逆転させるのではなく、どこがシステムの「安定させるべきコア」で、どこが「変動しうる詳細」なのかを見極め、その境界線に賢く適用することが重要です.

## まとめ

依存性逆転の原則を適用することで、依存関係が以下のようになりました。

- **違反例:** `ReportGenerator` → `MySQLDatabase` （上位 → 詳細）
- **準拠例:** `ReportGenerator` → `IDataSource` ← `MySQLDatabase` （上位 → 抽象 ← 詳細）

このように、具体的な実装（詳細）への依存の方向が「逆転」し、両者とも抽象（インターフェース）に依存するようになりました。

この原則は SOLID 原則の集大成とも言え、他の原則（特にオープン・クローズドの原則）を支える重要な考え方です。これにより、システムは柔軟で、部品の交換が容易になり、非常にテストしやすい構造になるのです。
