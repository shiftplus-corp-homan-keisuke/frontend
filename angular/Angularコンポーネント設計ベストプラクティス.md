# Angularコンポーネント設計ベストプラクティス

## 目次

1. [基本原則](#1-基本原則)
2. [Smart/Dumbパターン](#2-smartdumbパターン)
   - [データフェッチ戦略](#25-データフェッチ戦略)
3. [コンポーネントの配置戦略](#3-コンポーネントの配置戦略)
4. [実践例：ユーザー一覧ページ](#4-実践例ユーザー一覧ページ)
5. [パフォーマンス最適化](#5-パフォーマンス最適化)
6. [まとめ](#6-まとめ)

---

## 1. 基本原則

### 単一責任の原則

コンポーネントは**1つの責任**のみを持つべきです。

```typescript
// ❌ 悪い例: 複数の責任を持つコンポーネント
@Component({ selector: 'app-user-dashboard' })
export class UserDashboardComponent {
  // ユーザー情報、注文履歴、通知... すべてが1つに
}

// ✅ 良い例: 責任を分割
@Component({ selector: 'app-user-profile' })
export class UserProfileComponent { }

@Component({ selector: 'app-order-history' })
export class OrderHistoryComponent { }
```

### 小さく焦点を絞ったコンポーネント

- コンポーネントは**小さく、再利用可能**に保つ
- テストとメンテナンスが容易になる

---

## 2. Smart/Dumbパターン

コンポーネント設計の最も重要なパターンです。

### 概要

| 種類 | 別名 | 責任 |
|------|------|------|
| **Smart** | Container / Stateful | 状態管理、API通信、ビジネスロジック |
| **Dumb** | Presentational / Stateless | UI表示のみ、`@Input`/`@Output`でデータ受け渡し |

### Smartコンポーネント

```typescript
@Component({
  selector: 'app-user-list-page',
  template: `
    <app-user-table 
      [users]="users()"
      (editClick)="onEdit($event)"
      (deleteClick)="onDelete($event)">
    </app-user-table>
  `
})
export class UserListPageComponent {
  private userService = inject(UserService);
  users = signal<User[]>([]);

  ngOnInit(): void {
    this.userService.getUsers().subscribe(data => this.users.set(data));
  }

  onEdit(user: User): void { /* 編集処理 */ }
  onDelete(user: User): void { /* 削除処理 */ }
}
```

### Dumbコンポーネント

```typescript
@Component({
  selector: 'app-user-table',
  template: `
    <table>
      @for (user of users; track user.id) {
        <tr>
          <td>{{ user.name }}</td>
          <td>
            <button (click)="editClick.emit(user)">編集</button>
            <button (click)="deleteClick.emit(user)">削除</button>
          </td>
        </tr>
      }
    </table>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserTableComponent {
  @Input() users: User[] = [];
  @Output() editClick = new EventEmitter<User>();
  @Output() deleteClick = new EventEmitter<User>();
}
```

---

## 2.5. データフェッチ戦略

### 問題：複数コンテナによるAPI重複呼び出し

同じページに複数のSmartコンポーネントがあり、それぞれがサービスを注入してデータフェッチすると、同じAPIが何度も呼ばれてしまいます。

```
❌ 各SmartコンポーネントがAPIを呼ぶと...

┌─────────────────────────────────────────────────┐
│ DashboardPageComponent                           │
│  ├── UserSummaryComponent → userService.getAll() │ ← API呼び出し1
│  ├── UserStatsComponent   → userService.getAll() │ ← API呼び出し2
│  ├── UserChartComponent   → userService.getAll() │ ← API呼び出し3
│  └── RecentUsersComponent → userService.getAll() │ ← API呼び出し4
└─────────────────────────────────────────────────┘
結果：同じAPIが4回呼ばれる！
```

### 解決策1：ページレベルでデータフェッチ（推奨）

**ページコンポーネント**でデータを取得し、子コンポーネントに渡します。

```
✅ ページレベルで一括取得

┌─────────────────────────────────────────────────┐
│ DashboardPageComponent → userService.getAll()    │ ← API呼び出し1回のみ
│  ├── UserSummaryComponent ← [users]="users()"   │
│  ├── UserStatsComponent   ← [users]="users()"   │
│  ├── UserChartComponent   ← [users]="users()"   │
│  └── RecentUsersComponent ← [users]="users()"   │
└─────────────────────────────────────────────────┘
```

```typescript
// dashboard-page.component.ts【Smart - ページレベル】
@Component({
  selector: 'app-dashboard-page',
  template: `
    <app-user-summary [users]="users()" />
    <app-user-stats [users]="users()" />
    <app-user-chart [users]="users()" />
    <app-recent-users [users]="users()" />
  `
})
export class DashboardPageComponent {
  private userService = inject(UserService);
  users = signal<User[]>([]);

  ngOnInit(): void {
    this.userService.getAll().subscribe(data => this.users.set(data));
  }
}

// user-summary.component.ts【Dumb】
@Component({ selector: 'app-user-summary' })
export class UserSummaryComponent {
  @Input() users: User[] = [];
  
  get activeCount(): number {
    return this.users.filter(u => u.status === 'active').length;
  }
}
```

### 解決策2：サービス層でキャッシュ

サービス内でデータをキャッシュし、複数回呼ばれても1回のAPI呼び出しで済むようにします。

```typescript
@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);
  
  // キャッシュ用Signal
  private usersCache = signal<User[] | null>(null);
  private loading = signal(false);

  // 公開用の読み取り専用データ
  readonly users = this.usersCache.asReadonly();

  getUsers(): Observable<User[]> {
    // キャッシュがあればそれを返す
    if (this.usersCache()) {
      return of(this.usersCache()!);
    }
    
    // ロード中なら待機
    if (this.loading()) {
      return this.waitForCache();
    }

    // 初回のみAPIを呼ぶ
    this.loading.set(true);
    return this.http.get<User[]>('/api/users').pipe(
      tap(data => {
        this.usersCache.set(data);
        this.loading.set(false);
      }),
      shareReplay(1)  // 複数のsubscribeで共有
    );
  }

  // キャッシュを無効化（データ更新後に呼ぶ）
  invalidateCache(): void {
    this.usersCache.set(null);
  }
}
```

### 解決策3：Facadeパターン + 状態管理

複雑な画面ではFacadeパターンで状態を一元管理します。

```typescript
// features/dashboard/dashboard.facade.ts
@Injectable()
export class DashboardFacade {
  private userService = inject(UserService);
  private orderService = inject(OrderService);

  // 状態
  users = signal<User[]>([]);
  orders = signal<Order[]>([]);
  isLoading = signal(false);

  // 初期化（1回だけAPI呼び出し）
  loadDashboardData(): void {
    this.isLoading.set(true);
    
    forkJoin({
      users: this.userService.getAll(),
      orders: this.orderService.getRecent()
    }).pipe(
      finalize(() => this.isLoading.set(false))
    ).subscribe(({ users, orders }) => {
      this.users.set(users);
      this.orders.set(orders);
    });
  }

  // 派生データ
  activeUsers = computed(() => 
    this.users().filter(u => u.status === 'active')
  );
  
  userStats = computed(() => ({
    total: this.users().length,
    active: this.activeUsers().length
  }));
}
```

```typescript
// dashboard-page.component.ts
@Component({
  selector: 'app-dashboard-page',
  providers: [DashboardFacade],  // ページ単位でFacadeを提供
  template: `
    <app-user-summary [stats]="facade.userStats()" />
    <app-user-chart [users]="facade.users()" />
    <app-recent-users [users]="facade.activeUsers()" />
  `
})
export class DashboardPageComponent {
  facade = inject(DashboardFacade);

  ngOnInit(): void {
    this.facade.loadDashboardData();  // 1回だけ呼ぶ
  }
}
```

### どの解決策を選ぶか？

| シナリオ | 推奨解決策 |
|---------|----------|
| シンプルなページ（1-2種類のデータ） | **解決策1**: ページレベルでフェッチ |
| 同じデータを複数画面で使う | **解決策2**: サービス層でキャッシュ |
| 複雑なダッシュボード（複数API） | **解決策3**: Facadeパターン |
| 大規模アプリ | NgRx / SignalStore などの状態管理 |

---

## 3. コンポーネントの配置戦略

### 配置レベル

コンポーネントは**再利用範囲**に応じて配置場所を決定します。

| レベル | 配置場所 | 再利用範囲 | 例 |
|-------|---------|----------|---|
| **ページ固有** | `feature/page/components/` | そのページでのみ使用 | `UserFilterComponent` |
| **機能内共有** | `feature/components/` | 同一機能の複数ページで共有 | `UserTableComponent` |
| **アプリ共有** | `shared/components/` | 複数機能で共有 | `PaginationComponent` |

### 配置判断フロー

```
コンポーネントを作成
        │
        ▼
他の機能でも使う可能性がある？ ─Yes→ shared/components/
        │
       No
        ▼
同じ機能の複数ページで使う？ ─Yes→ feature/components/
        │
       No
        ▼
feature/page/components/ （ページ固有）
```

### ディレクトリ構成

```
src/app/
│
├── shared/                              # 【アプリ共有】
│   └── components/
│       ├── page-header/
│       ├── pagination/
│       └── data-table/
│
└── features/
    └── users/
        │
        ├── users.component.ts           # 【Shell】シェルコンポーネント
        │
        ├── components/                  # 【機能内共有】
        │   ├── user-table/
        │   └── user-card/
        │
        ├── user-list/                   # /user ルート
        │   ├── user-list-page.component.ts   # 【Smart】
        │   └── components/              # 【ページ固有】
        │       └── user-filter/
        │
        ├── user-detail/                 # /user/:id ルート
        ├── user-edit/                   # /user/:id/edit ルート
        │
        ├── services/
        ├── models/
        └── users-routing.module.ts
```

---

## 4. 実践例：ユーザー一覧ページ

### ページ構造

```
┌─────────────────────────────────────────────────┐
│  PageHeaderComponent（タイトル、新規追加ボタン） │  ← shared/
├─────────────────────────────────────────────────┤
│  UserFilterComponent（検索、ロール、ステータス） │  ← page固有
├─────────────────────────────────────────────────┤
│  UserTableComponent（ユーザー一覧テーブル）      │  ← 機能内共有
├─────────────────────────────────────────────────┤
│  PaginationComponent（ページネーション）         │  ← shared/
└─────────────────────────────────────────────────┘
```

### コンポーネント役割分担

| コンポーネント | 種類 | 配置 | 責任 |
|--------------|------|------|------|
| `UserListPageComponent` | Smart | `user-list/` | 状態管理、API呼び出し |
| `PageHeaderComponent` | Dumb | `shared/` | タイトル表示、アクションボタン |
| `UserFilterComponent` | Dumb | `user-list/components/` | フィルター条件のUI |
| `UserTableComponent` | Dumb | `users/components/` | ユーザーテーブル表示 |
| `PaginationComponent` | Dumb | `shared/` | ページネーションUI |

### データフロー

```mermaid
flowchart TD
    subgraph Smart["UserListPageComponent（Smart）"]
        State["状態: users, filter, pageInfo"]
        Service["UserService"]
    end
    
    subgraph Dumb["Dumbコンポーネント"]
        Header["PageHeaderComponent"]
        Filter["UserFilterComponent"]
        Table["UserTableComponent"]
        Pagination["PaginationComponent"]
    end
    
    Service -->|APIレスポンス| State
    State -->|@Input| Header & Filter & Table & Pagination
    Header & Filter & Table & Pagination -->|@Output| State
```

### ルーティング設定

```typescript
// users-routing.module.ts
const routes: Routes = [
  {
    path: '',
    component: UsersComponent,  // シェル
    children: [
      { path: '', component: UserListPageComponent },
      { path: 'new', component: UserEditPageComponent },
      { path: ':id', component: UserDetailPageComponent },
      { path: ':id/edit', component: UserEditPageComponent }
    ]
  }
];
```

### 実装例

#### Smartコンポーネント

```typescript
// user-list-page.component.ts
@Component({
  selector: 'app-user-list-page',
  standalone: true,
  imports: [PageHeaderComponent, UserFilterComponent, UserTableComponent, PaginationComponent],
  templateUrl: './user-list-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserListPageComponent {
  private userService = inject(UserService);
  private router = inject(Router);

  users = signal<User[]>([]);
  filter = signal<UserFilter>({ name: '', role: null, status: null });
  pageInfo = signal<PageInfo>({ page: 1, pageSize: 10, total: 0 });
  isLoading = signal(false);

  ngOnInit(): void { this.loadUsers(); }

  onFilterChange(filter: UserFilter): void {
    this.filter.set(filter);
    this.pageInfo.update(p => ({ ...p, page: 1 }));
    this.loadUsers();
  }

  onPageChange(page: number): void {
    this.pageInfo.update(p => ({ ...p, page }));
    this.loadUsers();
  }

  onAddUser(): void { this.router.navigate(['/users', 'new']); }
  onEditUser(user: User): void { this.router.navigate(['/users', user.id, 'edit']); }
  
  onDeleteUser(user: User): void {
    if (confirm(`${user.name}を削除しますか？`)) {
      this.userService.deleteUser(user.id).subscribe(() => this.loadUsers());
    }
  }

  private loadUsers(): void {
    this.isLoading.set(true);
    this.userService.getUsers({ ...this.filter(), ...this.pageInfo() })
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe(res => {
        this.users.set(res.items);
        this.pageInfo.update(p => ({ ...p, total: res.total }));
      });
  }
}
```

```html
<!-- user-list-page.component.html -->
<app-page-header title="ユーザー管理" actionLabel="新規追加" (actionClick)="onAddUser()" />

<app-user-filter [filter]="filter()" (filterChange)="onFilterChange($event)" />

@if (isLoading()) {
  <div class="loading">読み込み中...</div>
} @else {
  <app-user-table
    [users]="users()"
    (editClick)="onEditUser($event)"
    (deleteClick)="onDeleteUser($event)" />
}

<app-pagination [pageInfo]="pageInfo()" (pageChange)="onPageChange($event)" />
```

#### 再利用可能なコンポーネント（機能内共有）

```typescript
// users/components/user-table/user-table.component.ts
@Component({
  selector: 'app-user-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserTableComponent {
  @Input({ required: true }) users: User[] = [];
  @Input() showActions = true;  // 柔軟性: 操作ボタンの表示/非表示
  @Input() columns: string[] = ['id', 'name', 'email', 'role', 'status'];
  
  @Output() editClick = new EventEmitter<User>();
  @Output() deleteClick = new EventEmitter<User>();
  @Output() rowClick = new EventEmitter<User>();
}
```

#### 別ページでの再利用

```typescript
// features/dashboard/dashboard-page.component.ts
@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [UserTableComponent, OrderTableComponent],
  template: `
    <h2>最近のユーザー</h2>
    <app-user-table 
      [users]="recentUsers()"
      [showActions]="false"
      [columns]="['name', 'email']" />
  `
})
export class DashboardPageComponent { /* ... */ }
```

---

## 5. パフォーマンス最適化

### OnPush変更検知

すべてのDumbコンポーネントで使用：

```typescript
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush
})
```

### trackBy（@for構文）

```typescript
@for (user of users; track user.id) {
  <app-user-card [user]="user" />
}
```

### 遅延読み込み

```typescript
// app-routing.module.ts
{
  path: 'users',
  loadChildren: () => import('./features/users/users.module').then(m => m.UsersModule)
}
```

### @deferブロック（Angular 17+）

```typescript
@defer (on viewport) {
  <app-heavy-component />
} @placeholder {
  <div>読み込み準備中...</div>
}
```

---

## 6. まとめ

### ✅ 推奨事項

| 項目 | 内容 |
|------|------|
| 単一責任 | 1コンポーネント = 1責任 |
| Smart/Dumb分離 | UIとロジックを分離 |
| 配置戦略 | 再利用範囲に応じて配置場所を決定 |
| OnPush | Dumbコンポーネントは必ずOnPush |
| Signals | 状態管理にSignalsを活用（Angular 16+） |

### ❌ 避けるべきこと

- 巨大なモノリシックコンポーネント
- Dumbコンポーネント内でのサービス呼び出し
- 過度なテンプレート内ロジック
- 循環依存の作成

---

## 参考リンク

- [Angular公式ドキュメント](https://angular.dev/)
- [Angular Style Guide](https://angular.dev/style-guide)
- [Angular Signals](https://angular.dev/guide/signals)
