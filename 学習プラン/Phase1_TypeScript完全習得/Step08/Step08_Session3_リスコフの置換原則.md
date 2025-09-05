# Session3: リスコフの置換原則（LSP）を TypeScript で理解する

リスコフの置換原則は、「**派生型（子クラス）は、その基底型（親クラス）と置換可能でなければならない**」という原則です。

これを、もっとかみ砕いて言うと、

**「親クラス型として宣言された変数に、子クラスのインスタンスを代入しても、プログラムの振る舞いが変わらず、正しく動き続けなければならない」**

ということです。

## より具体的な説明

親クラス型で宣言された変数に、どの子クラスを入れても正しく動く

**例えば：**

```typescript
// 親クラス型で宣言
let animal: Animal;

// どの子クラスを代入しても正しく動くべき
animal = new Dog(); // ← これが動く
animal = new Cat(); // ← これも動く
animal = new Bird(); // ← これも動く

animal.makeSound(); // どの子クラスでも期待通りに動作する
```

つまり、**子クラスは親クラスの「約束」を守り続けなければならない**という原則です。

子クラスは親クラスの機能を拡張したものであるべきで、親クラスが元々持っていた機能を勝手に変更したり、使えなくしたりしてはいけない、という「約束事」だと考えてください。

## なぜリスコフの置換原則が重要なのか？

この原則が破られると、一見正しいように見える継承関係が、実際には非常に扱いにくいものになってしまいます。

- **予期せぬバグの温床になる:** 親クラスのつもりで使っていたら、子クラスのせいで予期せぬ動作やエラーが発生します。
- **コードの信頼性が下がる:** 「この親クラスの型が指定されているけど、本当にどの子クラスが来ても大丈夫なんだろうか？」といちいち疑う必要が出てきます。
- **無駄な分岐処理が増える:** 結局、子クラスの種類を`if`文や`instanceof`で判別して処理を分ける、といったコードが必要になります。これは、前の原則である「オープン・クローズドの原則」にも違反します。

この原則を守ることで、継承とポリモーフィズム（多態性）が正しく機能し、安心してオブジェクトを扱えるようになります。

## TypeScript での具体例

最も有名で分かりやすい例が「長方形と正方形」の問題です。
数学的には「正方形は長方形の一種」ですが、プログラミングの世界では、この継承関係が LSP 違反を引き起こすことがあります。

### 違反している例：

まず、親クラスとなる`Rectangle`（長方形）を定義します。長方形は「幅」と「高さ」を別々に設定できるのが特徴です。

```typescript
class Rectangle {
  protected width: number = 0;
  protected height: number = 0;

  public setWidth(width: number): void {
    this.width = width;
  }

  public setHeight(height: number): void {
    this.height = height;
  }

  public getArea(): number {
    return this.width * this.height;
  }
}
```

次に、この`Rectangle`を継承して`Square`（正方形）を作ります。正方形は「幅と高さが常に等しい」という性質を持っています。

```typescript
class Square extends Rectangle {
  // 幅を設定したら、高さも同じ値にしなければならない
  public setWidth(width: number): void {
    this.width = width;
    this.height = width; // 親の振る舞いを変更している！
  }

  // 高さを設定したら、幅も同じ値にしなければならない
  public setHeight(height: number): void {
    this.width = height;
    this.height = height; // 親の振る舞いを変更している！
  }
}
```

さて、この`Rectangle`と`Square`を使うクライアント側のコードを見てみましょう。この関数は、引数として「長方形型」を受け取り、**親クラス型として使用**します。

```typescript
// 親クラス型（Rectangle）のパラメータを持つ関数
function printAreaDetails(rect: Rectangle) {
  console.log("--- 計算開始 ---");
  rect.setWidth(5);
  rect.setHeight(4);
  const area = rect.getArea();
  console.log(`期待する面積: 20`);
  console.log(`実際の面積: ${area}`);
  console.assert(area === 20, "面積が期待通りではありません！");
  console.log("--- 計算終了 ---\n");
}

// Rectangle型で宣言して、Rectangleインスタンスを渡す -> 期待通りに動く
const rect: Rectangle = new Rectangle();
printAreaDetails(rect);

// Rectangle型で宣言して、Squareインスタンスを渡す -> 期待通りに動かない！
const square: Rectangle = new Square(); // ← 子クラスを親クラス型に代入
printAreaDetails(square); // ← 親クラス型として使用しているが、子クラスのせいで破綻
```

**実行結果:**

```
--- 計算開始 ---
期待する面積: 20
実際の面積: 20
--- 計算終了 ---

--- 計算開始 ---
期待する面積: 20
実際の面積: 16
Assertion failed: 面積が期待通りではありません！
--- 計算終了 ---
```

`printAreaDetails`関数は、引数に`Rectangle`型を期待しています。リスコフの置換原則によれば、`Square`は`Rectangle`の子クラスなので、**親クラス型の変数に子クラスのインスタンスを代入して使えるはず**です。

しかし、実際に`Square`インスタンスを`Rectangle`型として使うと、`rect.setHeight(4)`を呼び出した瞬間に、`setWidth(5)`で設定したはずの`width`も`4`に上書きされてしまいます。その結果、面積が `4 * 4 = 16` となり、クライアント側の期待（`5 * 4 = 20`）を裏切ってしまいました。

これが典型的な**リスコフの置換原則違反**です。子クラス`Square`は、親クラス`Rectangle`型として使った時に期待通りに動作しませんでした。**親クラス型に子クラスのインスタンスを代入したときに置換可能ではありませんでした**。

### 準拠するための考え方：

この問題を解決するには、そもそも「`Square`は`Rectangle`を継承すべきではない」と判断します。振る舞いが異なるからです。

代わりに、より抽象的なインターフェース（または抽象クラス）を定義します。

```typescript
// 「面積を計算できる図形」という共通のインターフェース
interface Shape {
  getArea(): number;
}

// Shapeインターフェースを実装したRectangleクラス
class Rectangle implements Shape {
  private width: number;
  private height: number;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
  }

  getArea(): number {
    return this.width * this.height;
  }
}

// Shapeインターフェースを実装したSquareクラス
class Square implements Shape {
  private side: number;

  constructor(side: number) {
    this.side = side;
  }

  getArea(): number {
    return this.side * this.side;
  }
}
```

このように継承関係をやめることで、`Square`が`Rectangle`の振る舞いを壊すという問題自体が発生しなくなります。それぞれのクラスが、自身の性質に合った形で正しく実装されています。

### 新しい設計での使用例：

新しい設計では、`printAreaDetails`関数の役割そのものを見直す必要があります。

新しい設計では、`Rectangle`や`Square`は**生成時（コンストラクタ）に寸法が決まり、後から変更されることは想定していません**。

そのため、`printAreaDetails`関数は、オブジェクトの状態を変更する責任を持つべきではありません。関数の新しい責任は、**「すでに完成している図形（Shape）を受け取り、その面積に関する情報を表示する」**ことになります。

```typescript
/**
 * Shapeを受け取り、その面積と期待値を比較して表示する関数
 * @param shape - RectangleやSquareなど、Shapeインターフェースを実装した任意のオブジェクト
 * @param expectedArea - 期待される面積
 */
function printAreaDetails(
  shape: Shape,
  shapeName: string,
  expectedArea: number
) {
  console.log(`--- ${shapeName} の計算開始 ---`);
  const area = shape.getArea();
  console.log(`期待する面積: ${expectedArea}`);
  console.log(`実際の面積: ${area}`);
  console.assert(area === expectedArea, "面積が期待通りではありません！");
  console.log("--- 計算終了 ---\n");
}

// --- 使用例 ---

// 幅5、高さ4の長方形を作成
const rect = new Rectangle(5, 4);
// 長方形を渡して実行 -> 期待通りに動く
printAreaDetails(rect, "長方形", 20);

// 一辺が4の正方形を作成
const square = new Square(4);
// 正方形を渡して実行 -> こちらも期待通りに動く！
printAreaDetails(square, "正方形", 16);
```

**実行結果:**

```
--- 長方形 の計算開始 ---
期待する面積: 20
実際の面積: 20
--- 計算終了 ---

--- 正方形 の計算開始 ---
期待する面積: 16
実際の面積: 16
--- 計算終了 ---
```

この新しい設計では、`printAreaDetails`関数は、渡されたオブジェクトが`Rectangle`であろうと`Square`であろうと、全く同じように振る舞います。なぜなら、どちらも`Shape`インターフェースの「`getArea()`メソッドを持つ」という**契約**を守っているからです。

これが**リスコフの置換原則が守られた状態**です。親の型（この場合はインターフェース`Shape`）が使われている場所に、子の型（`Rectangle`や`Square`）を安心して「置換」することができるのです。

## Angular での具体例

Angular アプリケーションでも、リスコフの置換原則は重要です。特に、サービスクラスの継承やコンポーネントの基底クラス設計で役立ちます。

### 違反している例（Angular）：

データを取得する基底サービスクラスとその継承クラスを考えてみましょう。

```typescript
// services/base-data.service.ts - 基底データサービス
import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

@Injectable({
  providedIn: "root",
})
export abstract class BaseDataService<T> {
  abstract getData(): Observable<ApiResponse<T[]>>;

  // 基底クラスの契約: 必ずsuccessプロパティを含むApiResponseを返す
  protected formatResponse(data: T[], message = "Success"): ApiResponse<T[]> {
    return {
      data,
      success: true,
      message,
    };
  }
}

// services/user-data.service.ts - ユーザーデータサービス（正常な継承）
@Injectable({
  providedIn: "root",
})
export class UserDataService extends BaseDataService<User> {
  constructor(private http: HttpClient) {
    super();
  }

  getData(): Observable<ApiResponse<User[]>> {
    // 基底クラスの契約を守っている
    return this.http
      .get<User[]>("/api/users")
      .pipe(
        map((users) => this.formatResponse(users, "Users loaded successfully"))
      );
  }
}

// services/problematic-data.service.ts - 問題のあるサービス（LSP違反）
@Injectable({
  providedIn: "root",
})
export class ProblematicDataService extends BaseDataService<any> {
  getData(): Observable<ApiResponse<any[]>> {
    // ❌ LSP違反: 基底クラスの契約を破っている
    // ApiResponse形式ではなく、直接配列を返している
    return of([1, 2, 3] as any); // 型をごまかして返している
  }
}
```

### クライアント側のコード（LSP 違反により破綻）：

```typescript
// components/data-display.component.ts
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-data-display",
  template: `
    <div>
      <h2>データ表示</h2>
      <div *ngIf="loading">読み込み中...</div>
      <div *ngIf="error" class="error">{{ error }}</div>
      <div *ngIf="data">
        <p>成功: {{ successMessage }}</p>
        <pre>{{ data | json }}</pre>
      </div>
    </div>
  `,
})
export class DataDisplayComponent implements OnInit {
  data: any[] = [];
  loading = false;
  error = "";
  successMessage = "";

  constructor(
    private userService: UserDataService,
    private problematicService: ProblematicDataService
  ) {}

  ngOnInit() {
    this.loadUserData();
    this.loadProblematicData();
  }

  // BaseDataService型として扱う汎用的なメソッド
  private loadData(service: BaseDataService<any>, label: string) {
    this.loading = true;

    service.getData().subscribe({
      next: (response) => {
        // 基底クラスの契約に基づいた処理
        if (response.success) {
          // ← ProblematicDataServiceではundefinedになる！
          this.data = response.data; // ← ProblematicDataServiceではundefinedになる！
          this.successMessage = response.message || "Success";
        } else {
          this.error = response.message || "Unknown error";
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = `${label} loading failed: ${err.message}`;
        this.loading = false;
      },
    });
  }

  private loadUserData() {
    this.loadData(this.userService, "User"); // ← 正常に動作
  }

  private loadProblematicData() {
    this.loadData(this.problematicService, "Problematic"); // ← 破綻する！
  }
}
```

この例では、`ProblematicDataService`が基底クラス`BaseDataService`の契約を破っているため、`loadData`メソッドが期待通りに動作しません。

### 準拠している例（Angular）：

リスコフの置換原則を守る正しい設計にしてみましょう。

```typescript
// services/data.interface.ts - データサービスのインターフェース
export interface IDataService<T> {
  getData(): Observable<ApiResponse<T[]>>;
  getById(id: string | number): Observable<ApiResponse<T>>;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  timestamp?: Date;
}

// services/base-data.service.ts - 基底実装クラス
@Injectable()
export abstract class BaseDataService<T> implements IDataService<T> {
  abstract getData(): Observable<ApiResponse<T[]>>;
  abstract getById(id: string | number): Observable<ApiResponse<T>>;

  // 共通のヘルパーメソッド
  protected createSuccessResponse<U>(
    data: U,
    message = "Success"
  ): ApiResponse<U> {
    return {
      data,
      success: true,
      message,
      timestamp: new Date(),
    };
  }

  protected createErrorResponse<U>(message: string): ApiResponse<U> {
    return {
      data: null as U,
      success: false,
      message,
      timestamp: new Date(),
    };
  }
}

// services/user.service.ts - ユーザーサービス
export interface User {
  id: number;
  name: string;
  email: string;
}

@Injectable({
  providedIn: "root",
})
export class UserService extends BaseDataService<User> {
  constructor(private http: HttpClient) {
    super();
  }

  getData(): Observable<ApiResponse<User[]>> {
    return this.http.get<User[]>("/api/users").pipe(
      map((users) =>
        this.createSuccessResponse(users, "Users loaded successfully")
      ),
      catchError((error) =>
        of(
          this.createErrorResponse<User[]>(
            `Failed to load users: ${error.message}`
          )
        )
      )
    );
  }

  getById(id: string | number): Observable<ApiResponse<User>> {
    return this.http.get<User>(`/api/users/${id}`).pipe(
      map((user) =>
        this.createSuccessResponse(user, `User ${id} loaded successfully`)
      ),
      catchError((error) =>
        of(
          this.createErrorResponse<User>(
            `Failed to load user ${id}: ${error.message}`
          )
        )
      )
    );
  }
}

// services/product.service.ts - 商品サービス
export interface Product {
  id: number;
  name: string;
  price: number;
}

@Injectable({
  providedIn: "root",
})
export class ProductService extends BaseDataService<Product> {
  constructor(private http: HttpClient) {
    super();
  }

  getData(): Observable<ApiResponse<Product[]>> {
    return this.http.get<Product[]>("/api/products").pipe(
      map((products) =>
        this.createSuccessResponse(products, "Products loaded successfully")
      ),
      catchError((error) =>
        of(
          this.createErrorResponse<Product[]>(
            `Failed to load products: ${error.message}`
          )
        )
      )
    );
  }

  getById(id: string | number): Observable<ApiResponse<Product>> {
    return this.http.get<Product>(`/api/products/${id}`).pipe(
      map((product) =>
        this.createSuccessResponse(product, `Product ${id} loaded successfully`)
      ),
      catchError((error) =>
        of(
          this.createErrorResponse<Product>(
            `Failed to load product ${id}: ${error.message}`
          )
        )
      )
    );
  }
}
```

### 正しい設計でのコンポーネント（LSP 準拠）：

```typescript
// components/data-list.component.ts
@Component({
  selector: "app-data-list",
  template: `
    <div class="data-container">
      <h2>{{ title }}</h2>

      <div *ngIf="loading" class="loading">
        <mat-spinner diameter="40"></mat-spinner>
        読み込み中...
      </div>

      <div *ngIf="error" class="error-message">
        <mat-icon>error</mat-icon>
        {{ error }}
        <button mat-button (click)="retry()">再試行</button>
      </div>

      <div *ngIf="data && data.length > 0" class="success-content">
        <div class="success-message">
          <mat-icon>check_circle</mat-icon>
          {{ successMessage }}
        </div>
        <div class="data-list">
          <mat-card *ngFor="let item of data" class="data-item">
            <mat-card-content>
              <pre>{{ item | json }}</pre>
            </mat-card-content>
          </mat-card>
        </div>
      </div>

      <div *ngIf="data && data.length === 0" class="empty-message">
        データがありません
      </div>
    </div>
  `,
  styleUrls: ["./data-list.component.scss"],
})
export class DataListComponent<T> implements OnInit {
  @Input() title = "データ一覧";
  @Input() dataService!: IDataService<T>; // インターフェースに依存

  data: T[] = [];
  loading = false;
  error = "";
  successMessage = "";

  ngOnInit() {
    this.loadData();
  }

  // IDataServiceインターフェースの契約に基づいた汎用的な処理
  loadData() {
    if (!this.dataService) {
      this.error = "Data service not provided";
      return;
    }

    this.loading = true;
    this.error = "";

    this.dataService.getData().subscribe({
      next: (response: ApiResponse<T[]>) => {
        // インターフェースの契約により、必ずApiResponse形式で返ってくる
        if (response.success && response.data) {
          this.data = response.data;
          this.successMessage =
            response.message || "データを正常に読み込みました";
        } else {
          this.error = response.message || "不明なエラーが発生しました";
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = `データ読み込みエラー: ${err.message}`;
        this.loading = false;
      },
    });
  }

  retry() {
    this.loadData();
  }
}
```

### 使用例（親コンポーネント）：

```typescript
// components/app.component.ts
@Component({
  selector: "app-root",
  template: `
    <div class="app-container">
      <app-data-list title="ユーザー一覧" [dataService]="userService">
      </app-data-list>

      <app-data-list title="商品一覧" [dataService]="productService">
      </app-data-list>
    </div>
  `,
})
export class AppComponent {
  constructor(
    public userService: UserService,
    public productService: ProductService
  ) {}
}
```

### 分離後のメリット（Angular）：

1. **置換可能性の保証**: `DataListComponent`は、`IDataService`インターフェースを実装したどのサービスでも正しく動作する

2. **型安全性**: TypeScript のジェネリクスにより、型安全な置換が保証される

3. **テスタビリティ**: モックサービスを簡単に作成して注入できる

```typescript
// テスト用のモックサービス
@Injectable()
export class MockUserService extends BaseDataService<User> {
  getData(): Observable<ApiResponse<User[]>> {
    const mockUsers: User[] = [
      { id: 1, name: "Test User", email: "test@example.com" },
    ];
    return of(this.createSuccessResponse(mockUsers, "Mock data loaded"));
  }

  getById(id: string | number): Observable<ApiResponse<User>> {
    const mockUser: User = {
      id: 1,
      name: "Test User",
      email: "test@example.com",
    };
    return of(this.createSuccessResponse(mockUser, `Mock user ${id} loaded`));
  }
}
```

4. **拡張性**: 新しいデータタイプのサービスを追加しても、既存のコンポーネントをそのまま使用できる

この設計により、Angular アプリケーションでもリスコフの置換原則が守られ、保守性とテスト容易性の高いコードを実現できます。

## リスコフの置換原則のデメリットとトレードオフ

リスコフの置換原則は、堅牢で保守性の高いソフトウェアを構築するための非常に強力なガイドラインです。そのため、この原則自体に直接的な「デメリット」はほとんど存在しません。むしろ、**この原則を守らないことによるデメリット（バグの増加、保守性の低下など）の方がはるかに大きい**と言えます。

しかし、LSP を厳密に適用しようとすると、いくつかのトレードオフや設計上の課題が生じることがあります。

### 1. 継承関係の制約と設計の硬直化

LSP を遵守するということは、子クラスが親クラスの「契約（振る舞い）」を完全に守らなければならないことを意味します。これにより、継承の使い方が厳しく制限されます。

- **課題**: ちょっとした例外的な振る舞いを子クラスに追加したい場合でも、それが親クラスの契約を少しでも破る可能性があれば、継承自体を諦めなければならないことがあります。
- **トレードオフ**: これにより設計の「柔軟性」が失われ、硬直化していると感じられることがあります。開発者は、安易に継承を使うのではなく、より慎重にクラス間の関係（継承かすべきか、コンポジションにすべきかなど）を検討する必要があります。

### 2. 設計初期段階での負担増

LSP を正しく満たす階層を設計するには、将来の使われ方まで見越した深い洞察が求められます。

- **課題**: 親クラスを設計する時点で、その「契約」が何であるかを明確に定義し、将来どのような子クラスが作られても破綻しないように考慮する必要があります。
- **トレードオフ**: これにより、設計の初期段階でかかる時間と精神的なコストが増加します。特に、ドメイン（対象領域）の理解が浅い段階では、完璧な継承階層を築くことは困難です。

### 3. 過剰設計（Over-engineering）のリスク

原則を意識しすぎるあまり、不必要に複雑な設計をしてしまう可能性があります。

- **課題**: 例えば、明らかに置換されることなどない単純な内部クラスや、ごく限定的なスコープでしか使われないクラスに対してまで、厳密な LSP を適用しようとすると、抽象クラスやインターフェースが乱立し、かえってコードの可読性が下がることがあります。
- **トレードオフ**: LSP は万能薬ではありません。原則の目的を理解し、プロジェクトの規模や要件に応じて、どこまで厳密に適用するかを判断するバランス感覚が求められます。単純なケースでは、LSP を意識しない方がシンプルで良い設計になることもあります。

### トレードオフの理解とバランス

LSP を適用するかどうかは、常にトレードオフを考慮して判断する必要があります。

| メリット（適切に適用した場合）                                                   | デメリット（過剰または不適切に適用した場合）                           |
| :------------------------------------------------------------------------------- | :--------------------------------------------------------------------- |
| **置換可能性による信頼性向上**：クライアントは基底クラスの型で安心して操作できる | **設計の硬直化**：継承のルールが厳しくなり、柔軟性が失われることがある |
| **保守性の向上**：基底クラスの振る舞いが保証され、バグが減る                     | **初期設計コストの増加**：将来を見越した抽象化が必要になる             |
| **ポリモーフィズムの恩恵**：コードの重複が減り、クリーンなコードになる           | **過剰設計のリスク**：単純な場合に不要な複雑さを生む可能性がある       |

### 結論：安易な継承を避け、契約を守れる場面に限定する

リスコフの置換原則が示す最大の教訓は、**「継承は見た目以上に難しく、is-a（〜は〜の一種である）という関係だけで安易に使うべきではない」**という点にあります。

OCP が「変更されやすい箇所」に適用すべきであったのに対し、LSP は**「継承を使う場面すべて」**で考慮すべき原則です。しかし、その適用が困難な場合は、無理に継承を使うのではなく、**コンポジション（組み合わせ）**など、他の設計アプローチを検討するべきだというサインになります。

原則に固執するのではなく、LSP が破綻しそうな場面では「そもそも、この継承は本当に正しいのか？」と立ち止まることが、より良い設計への鍵となります。

## まとめ

リスコフの置換原則は、**「継承を使うなら、親の『振る舞いの契約』を破るな」**というメッセージです。

子クラスは、親クラスのメソッドをオーバーライドする際に、

- 親クラスよりも厳しい事前条件（例: 引数の型を限定するなど）を課してはいけない。
- 親クラスよりも緩い事後条件（例: 親が返すべきだった結果を返さないなど）を返してはいけない。
- 親クラスで発生しなかった種類の例外を投げてはいけない。

といった、より詳細なルールも内包しています。

この原則を守ることで、継承がもたらすポリモーフィズムの恩恵を最大限に活かした、信頼性の高いコードを書くことができます。
