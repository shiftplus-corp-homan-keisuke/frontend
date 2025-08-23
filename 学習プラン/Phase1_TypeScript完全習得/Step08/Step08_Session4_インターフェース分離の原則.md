# Session4: インターフェース分離の原則（ISP）を TypeScript で理解する

インターフェース分離の原則は、「**クライアントに、自身が利用しないメソッドへの依存を強制してはならない**」という原則です。

これを、もっとシンプルな言葉で言うと、

**「一つの巨大で多機能なインターフェースを作るのではなく、特定の役割に特化した、小さなインターフェースをたくさん作るべきだ」**

ということです。

この原則は、単一責任の原則（SRP）をインターフェースに適用したものと考えることもできます。SRP がクラスの責任を一つに保つことを目指すのに対し、ISP はインターフェースの責任を一つに保つことを目指します。

## なぜインターフェース分離の原則が重要なのか？

もし、一つのインターフェースにあらゆる機能が詰め込まれていると（このようなインターフェースは「ファット・インターフェース」と呼ばれます）、次のような問題が発生します。

- **不要な実装の強制:** クラスが、実際には使わない機能のメソッドまで実装しなければならなくなります。その結果、中身が空だったり、エラーをスローするだけの無意味なメソッドが生まれてしまいます。
- **システムの硬直化:** あるクライアントが使ってもいないメソッドのシグネチャ（引数や戻り値の型など）が変更されただけで、そのインターフェースを実装している全てのクラスが影響を受けてしまいます。
- **凝集度の低下:** インターフェースが「何でも屋」になってしまい、その役割や目的が曖昧になります。

この原則を守ることで、各クラスは本当に必要な機能だけを実装すればよくなり、システムの結合度を下げ、柔軟性を高めることができます。

## TypeScript での具体例

オフィスにある複合機を例に考えてみましょう。複合機には印刷、スキャン、FAX といった複数の機能があります。

### 違反している例：

まず、これらの機能をすべて詰め込んだ、一つの巨大なインターフェースを定義します。

```typescript
// 違反例: ファット・インターフェース
interface IMultiFunctionDevice {
  print(document: any): void;
  scan(document: any): void;
  fax(document: any): void;
}
```

このインターフェースを、高性能な複合機クラスに実装するのは簡単です。

```typescript
class AllInOnePrinter implements IMultiFunctionDevice {
  print(document: any): void {
    console.log("Printing document...");
  }
  scan(document: any): void {
    console.log("Scanning document...");
  }
  fax(document: any): void {
    console.log("Faxing document...");
  }
}
```

しかし、ここで「印刷機能しか持たない、安価なプリンター」のクラスを作りたくなったとします。`IMultiFunctionDevice`を実装しようとすると、問題が発生します。

```typescript
class SimplePrinter implements IMultiFunctionDevice {
  print(document: any): void {
    console.log("Printing document...");
  }

  // このプリンターにはスキャン機能がない！しかし、インターフェースを満たすために実装を強制される。
  scan(document: any): void {
    // どう実装すればいい？
    // 1. 何もしない（空のメソッド）-> 呼び出し元は機能が実行されたと勘違いするかも
    // 2. エラーをスローする -> 実行時まで問題が発覚しない
    throw new Error("This device does not support scanning.");
  }

  // FAX機能もない！
  fax(document: any): void {
    throw new Error("This device does not support faxing.");
  }
}
```

`SimplePrinter`は、持っていない機能（`scan`, `fax`）の実装まで強制されています。これが**インターフェース分離の原則違反**です。`SimplePrinter`というクライアントは、利用しない`scan`や`fax`メソッドに依存させられているのです。

### 準拠している例：

この問題を解決するために、インターフェースを機能（役割）ごとに細かく分割します。

```typescript
// 準拠例: 機能ごとにインターフェースを分割

interface IPrinter {
  print(document: any): void;
}

interface IScanner {
  scan(document: any): void;
}

interface IFax {
  fax(document: any): void;
}
```

このように分割すれば、各クラスは本当に必要なインターフェースだけを実装すればよくなります。

**高性能な複合機の場合:**
必要な機能をすべて実装します。

```typescript
class AllInOnePrinter implements IPrinter, IScanner, IFax {
  print(document: any): void {
    console.log("Printing document...");
  }
  scan(document: any): void {
    console.log("Scanning document...");
  }
  fax(document: any): void {
    console.log("Faxing document...");
  }
}
```

**安価なプリンターの場合:**
`IPrinter`インターフェースだけを実装します。不要なメソッドを実装する必要はもうありません。

```typescript
class SimplePrinter implements IPrinter {
  print(document: any): void {
    console.log("Printing document...");
  }
}
```

### クライアント側のメリット

この設計は、これらのクラスを利用するクライアント側にもメリットがあります。例えば、ドキュメントを印刷するだけの関数は、印刷機能（`IPrinter`）だけを要求すればよくなります。

```typescript
// この関数は、渡されたデバイスがスキャンやFAX機能を持つかどうかを一切気にする必要がない。
// printメソッドさえ持っていればOK。
function processPrintJob(printer: IPrinter, document: any) {
  console.log("Sending a document to the printer...");
  printer.print(document);
}

const allInOne = new AllInOnePrinter();
const simple = new SimplePrinter();

// どちらのプリンターも、問題なくこの関数に渡すことができる！
processPrintJob(allInOne, "My Report");
processPrintJob(simple, "My Shopping List");
```

**実行結果:**

```
Sending a document to the printer...
Printing document...
Sending a document to the printer...
Printing document...
```

この例では、`processPrintJob`関数は`IPrinter`インターフェースだけを必要としています。`AllInOnePrinter`がスキャンや FAX 機能を持っていても、この関数には全く影響しません。必要な機能（印刷）だけに依存しているからです。

## Angular での具体例

Angular アプリケーションでも、インターフェース分離の原則は非常に重要です。特に、サービスクラスの設計やコンポーネント間のやり取りで威力を発揮します。

### 違反している例（Angular）：

ユーザー管理機能を持つサービスクラスを例に見てみましょう。最初は全ての機能を一つのインターフェースに詰め込んでしまいました。

```typescript
// interfaces/user-service.interface.ts - 巨大なインターフェース（ISP違反）
import { Observable } from "rxjs";

export interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "user" | "guest";
  profileImage?: string;
}

export interface UserPermissions {
  canRead: boolean;
  canWrite: boolean;
  canDelete: boolean;
  canManageRoles: boolean;
}

// ❌ 巨大で多機能なインターフェース（ファット・インターフェース）
export interface IUserService {
  // ユーザー基本操作
  getUser(id: number): Observable<User>;
  getAllUsers(): Observable<User[]>;
  createUser(user: Partial<User>): Observable<User>;
  updateUser(id: number, user: Partial<User>): Observable<User>;
  deleteUser(id: number): Observable<boolean>;

  // 認証関連
  login(email: string, password: string): Observable<string>;
  logout(): Observable<boolean>;
  refreshToken(): Observable<string>;
  validateToken(token: string): Observable<boolean>;

  // 権限管理
  getUserPermissions(userId: number): Observable<UserPermissions>;
  updateUserRole(userId: number, role: string): Observable<boolean>;
  checkPermission(userId: number, action: string): Observable<boolean>;

  // プロフィール画像管理
  uploadProfileImage(userId: number, image: File): Observable<string>;
  deleteProfileImage(userId: number): Observable<boolean>;
  getProfileImageUrl(userId: number): Observable<string>;

  // 通知機能
  sendNotification(userId: number, message: string): Observable<boolean>;
  getNotifications(userId: number): Observable<any[]>;
  markNotificationAsRead(notificationId: number): Observable<boolean>;

  // 設定管理
  getUserSettings(userId: number): Observable<any>;
  updateUserSettings(userId: number, settings: any): Observable<boolean>;
  resetUserSettings(userId: number): Observable<boolean>;
}
```

この巨大なインターフェースを実装すると、問題が発生します：

```typescript
// services/basic-user.service.ts - 基本的なユーザー管理のみを提供したいサービス
@Injectable({
  providedIn: "root",
})
export class BasicUserService implements IUserService {
  constructor(private http: HttpClient) {}

  // 必要な機能
  getUser(id: number): Observable<User> {
    return this.http.get<User>(`/api/users/${id}`);
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>("/api/users");
  }

  createUser(user: Partial<User>): Observable<User> {
    return this.http.post<User>("/api/users", user);
  }

  updateUser(id: number, user: Partial<User>): Observable<User> {
    return this.http.put<User>(`/api/users/${id}`, user);
  }

  deleteUser(id: number): Observable<boolean> {
    return this.http.delete<boolean>(`/api/users/${id}`);
  }

  // ❌ 不要だが実装を強制される機能たち
  login(email: string, password: string): Observable<string> {
    throw new Error("This service does not support authentication");
  }

  logout(): Observable<boolean> {
    throw new Error("This service does not support authentication");
  }

  refreshToken(): Observable<string> {
    throw new Error("This service does not support authentication");
  }

  validateToken(token: string): Observable<boolean> {
    throw new Error("This service does not support authentication");
  }

  getUserPermissions(userId: number): Observable<UserPermissions> {
    throw new Error("This service does not support permission management");
  }

  updateUserRole(userId: number, role: string): Observable<boolean> {
    throw new Error("This service does not support permission management");
  }

  checkPermission(userId: number, action: string): Observable<boolean> {
    throw new Error("This service does not support permission management");
  }

  uploadProfileImage(userId: number, image: File): Observable<string> {
    throw new Error("This service does not support image management");
  }

  deleteProfileImage(userId: number): Observable<boolean> {
    throw new Error("This service does not support image management");
  }

  getProfileImageUrl(userId: number): Observable<string> {
    throw new Error("This service does not support image management");
  }

  // ... 他の不要なメソッドも全て実装が必要
  sendNotification(userId: number, message: string): Observable<boolean> {
    throw new Error("This service does not support notifications");
  }

  getNotifications(userId: number): Observable<any[]> {
    throw new Error("This service does not support notifications");
  }

  markNotificationAsRead(notificationId: number): Observable<boolean> {
    throw new Error("This service does not support notifications");
  }

  getUserSettings(userId: number): Observable<any> {
    throw new Error("This service does not support settings management");
  }

  updateUserSettings(userId: number, settings: any): Observable<boolean> {
    throw new Error("This service does not support settings management");
  }

  resetUserSettings(userId: number): Observable<boolean> {
    throw new Error("This service does not support settings management");
  }
}
```

この設計の問題点：

- 不要な機能まで実装を強制される
- エラーをスローするだけの無意味なメソッドが大量に生成される
- インターフェースが変更されると、全ての実装クラスが影響を受ける

### 準拠している例（Angular）：

インターフェース分離の原則に従って、機能ごとに小さなインターフェースに分割します。

**ステップ 1: 機能ごとにインターフェースを分離**

```typescript
// interfaces/user-data.interface.ts - ユーザーデータ操作
export interface IUserDataService {
  getUser(id: number): Observable<User>;
  getAllUsers(): Observable<User[]>;
  createUser(user: Partial<User>): Observable<User>;
  updateUser(id: number, user: Partial<User>): Observable<User>;
  deleteUser(id: number): Observable<boolean>;
}

// interfaces/user-auth.interface.ts - 認証機能
export interface IUserAuthService {
  login(email: string, password: string): Observable<string>;
  logout(): Observable<boolean>;
  refreshToken(): Observable<string>;
  validateToken(token: string): Observable<boolean>;
}

// interfaces/user-permissions.interface.ts - 権限管理
export interface IUserPermissionService {
  getUserPermissions(userId: number): Observable<UserPermissions>;
  updateUserRole(userId: number, role: string): Observable<boolean>;
  checkPermission(userId: number, action: string): Observable<boolean>;
}

// interfaces/user-profile.interface.ts - プロフィール管理
export interface IUserProfileService {
  uploadProfileImage(userId: number, image: File): Observable<string>;
  deleteProfileImage(userId: number): Observable<boolean>;
  getProfileImageUrl(userId: number): Observable<string>;
}

// interfaces/user-notifications.interface.ts - 通知機能
export interface IUserNotificationService {
  sendNotification(userId: number, message: string): Observable<boolean>;
  getNotifications(userId: number): Observable<any[]>;
  markNotificationAsRead(notificationId: number): Observable<boolean>;
}

// interfaces/user-settings.interface.ts - 設定管理
export interface IUserSettingsService {
  getUserSettings(userId: number): Observable<any>;
  updateUserSettings(userId: number, settings: any): Observable<boolean>;
  resetUserSettings(userId: number): Observable<boolean>;
}
```

**ステップ 2: 必要な機能だけを実装した専用サービス**

```typescript
// services/user-data.service.ts - ユーザーデータ操作専用
@Injectable({
  providedIn: "root",
})
export class UserDataService implements IUserDataService {
  constructor(private http: HttpClient) {}

  getUser(id: number): Observable<User> {
    return this.http.get<User>(`/api/users/${id}`);
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>("/api/users");
  }

  createUser(user: Partial<User>): Observable<User> {
    return this.http.post<User>("/api/users", user);
  }

  updateUser(id: number, user: Partial<User>): Observable<User> {
    return this.http.put<User>(`/api/users/${id}`, user);
  }

  deleteUser(id: number): Observable<boolean> {
    return this.http.delete<boolean>(`/api/users/${id}`);
  }
}

// services/user-auth.service.ts - 認証専用
@Injectable({
  providedIn: "root",
})
export class UserAuthService implements IUserAuthService {
  constructor(private http: HttpClient, private cookieService: CookieService) {}

  login(email: string, password: string): Observable<string> {
    return this.http
      .post<{ token: string }>("/api/auth/login", { email, password })
      .pipe(
        map((response) => response.token),
        tap((token) => this.cookieService.set("auth_token", token))
      );
  }

  logout(): Observable<boolean> {
    return this.http.post<{ success: boolean }>("/api/auth/logout", {}).pipe(
      map((response) => response.success),
      tap(() => this.cookieService.delete("auth_token"))
    );
  }

  refreshToken(): Observable<string> {
    return this.http.post<{ token: string }>("/api/auth/refresh", {}).pipe(
      map((response) => response.token),
      tap((token) => this.cookieService.set("auth_token", token))
    );
  }

  validateToken(token: string): Observable<boolean> {
    return this.http
      .post<{ valid: boolean }>("/api/auth/validate", { token })
      .pipe(map((response) => response.valid));
  }
}

// services/user-permissions.service.ts - 権限管理専用
@Injectable({
  providedIn: "root",
})
export class UserPermissionService implements IUserPermissionService {
  constructor(private http: HttpClient) {}

  getUserPermissions(userId: number): Observable<UserPermissions> {
    return this.http.get<UserPermissions>(`/api/users/${userId}/permissions`);
  }

  updateUserRole(userId: number, role: string): Observable<boolean> {
    return this.http
      .put<{ success: boolean }>(`/api/users/${userId}/role`, { role })
      .pipe(map((response) => response.success));
  }

  checkPermission(userId: number, action: string): Observable<boolean> {
    return this.http
      .get<{ hasPermission: boolean }>(
        `/api/users/${userId}/permissions/${action}`
      )
      .pipe(map((response) => response.hasPermission));
  }
}

// services/user-profile.service.ts - プロフィール管理専用
@Injectable({
  providedIn: "root",
})
export class UserProfileService implements IUserProfileService {
  constructor(private http: HttpClient) {}

  uploadProfileImage(userId: number, image: File): Observable<string> {
    const formData = new FormData();
    formData.append("image", image);

    return this.http
      .post<{ imageUrl: string }>(
        `/api/users/${userId}/profile-image`,
        formData
      )
      .pipe(map((response) => response.imageUrl));
  }

  deleteProfileImage(userId: number): Observable<boolean> {
    return this.http
      .delete<{ success: boolean }>(`/api/users/${userId}/profile-image`)
      .pipe(map((response) => response.success));
  }

  getProfileImageUrl(userId: number): Observable<string> {
    return this.http
      .get<{ imageUrl: string }>(`/api/users/${userId}/profile-image`)
      .pipe(map((response) => response.imageUrl));
  }
}
```

**ステップ 3: 必要な機能だけを組み合わせたコンポーネント**

```typescript
// components/user-list.component.ts - ユーザー一覧表示（データ操作のみ必要）
@Component({
  selector: "app-user-list",
  template: `
    <div class="user-list-container">
      <h2>ユーザー一覧</h2>

      <button mat-raised-button color="primary" (click)="loadUsers()">
        <mat-icon>refresh</mat-icon>
        更新
      </button>

      <mat-table [dataSource]="users" class="users-table">
        <ng-container matColumnDef="id">
          <mat-header-cell *matHeaderCellDef>ID</mat-header-cell>
          <mat-cell *matCellDef="let user">{{ user.id }}</mat-cell>
        </ng-container>

        <ng-container matColumnDef="name">
          <mat-header-cell *matHeaderCellDef>名前</mat-header-cell>
          <mat-cell *matCellDef="let user">{{ user.name }}</mat-cell>
        </ng-container>

        <ng-container matColumnDef="email">
          <mat-header-cell *matHeaderCellDef>メール</mat-header-cell>
          <mat-cell *matCellDef="let user">{{ user.email }}</mat-cell>
        </ng-container>

        <ng-container matColumnDef="actions">
          <mat-header-cell *matHeaderCellDef>操作</mat-header-cell>
          <mat-cell *matCellDef="let user">
            <button mat-icon-button (click)="editUser(user)">
              <mat-icon>edit</mat-icon>
            </button>
            <button mat-icon-button color="warn" (click)="deleteUser(user.id)">
              <mat-icon>delete</mat-icon>
            </button>
          </mat-cell>
        </ng-container>

        <mat-header-row *matHeaderRowDef="displayedColumns"></mat-header-row>
        <mat-row *matRowDef="let row; columns: displayedColumns"></mat-row>
      </mat-table>
    </div>
  `,
  styleUrls: ["./user-list.component.scss"],
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  displayedColumns = ["id", "name", "email", "actions"];

  // ユーザーデータ操作のみに依存（認証や権限管理は不要）
  constructor(
    private userDataService: IUserDataService, // 必要な機能のみを注入
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.userDataService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
      },
      error: (error) => {
        this.snackBar.open("ユーザー読み込みエラー", "閉じる", {
          duration: 3000,
        });
      },
    });
  }

  editUser(user: User) {
    // ユーザー編集ダイアログを開く
  }

  deleteUser(userId: number) {
    this.userDataService.deleteUser(userId).subscribe({
      next: (success) => {
        if (success) {
          this.loadUsers(); // 一覧を更新
          this.snackBar.open("ユーザーを削除しました", "閉じる", {
            duration: 3000,
          });
        }
      },
      error: (error) => {
        this.snackBar.open("削除エラー", "閉じる", { duration: 3000 });
      },
    });
  }
}

// components/login.component.ts - ログイン（認証のみ必要）
@Component({
  selector: "app-login",
  template: `
    <mat-card class="login-card">
      <mat-card-header>
        <mat-card-title>ログイン</mat-card-title>
      </mat-card-header>

      <mat-card-content>
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          <mat-form-field appearance="outline">
            <mat-label>メールアドレス</mat-label>
            <input matInput formControlName="email" type="email" />
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>パスワード</mat-label>
            <input matInput formControlName="password" type="password" />
          </mat-form-field>

          <button
            mat-raised-button
            color="primary"
            type="submit"
            [disabled]="loginForm.invalid"
          >
            ログイン
          </button>
        </form>
      </mat-card-content>
    </mat-card>
  `,
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent {
  loginForm: FormGroup;

  // 認証機能のみに依存（ユーザーデータ操作や権限管理は不要）
  constructor(
    private userAuthService: IUserAuthService, // 必要な機能のみを注入
    private router: Router,
    private snackBar: MatSnackBar,
    private fb: FormBuilder
  ) {
    this.loginForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", Validators.required],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;

      this.userAuthService.login(email, password).subscribe({
        next: (token) => {
          this.snackBar.open("ログインしました", "閉じる", { duration: 3000 });
          this.router.navigate(["/dashboard"]);
        },
        error: (error) => {
          this.snackBar.open("ログインに失敗しました", "閉じる", {
            duration: 3000,
          });
        },
      });
    }
  }
}

// components/admin-panel.component.ts - 管理者パネル（複数の機能が必要）
@Component({
  selector: "app-admin-panel",
  template: `
    <div class="admin-panel">
      <h2>管理者パネル</h2>

      <mat-tab-group>
        <mat-tab label="ユーザー管理">
          <app-user-list></app-user-list>
        </mat-tab>

        <mat-tab label="権限管理">
          <!-- 権限管理機能 -->
        </mat-tab>

        <mat-tab label="システム設定">
          <!-- システム設定機能 -->
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
})
export class AdminPanelComponent {
  // 管理者パネルでは複数の機能が必要だが、各機能は分離されているため管理しやすい
  constructor(
    private userDataService: IUserDataService,
    private userPermissionService: IUserPermissionService,
    private userSettingsService: IUserSettingsService
  ) {}

  // 必要に応じて各サービスを使い分け
}
```

### 分離後のメリット（Angular）：

1. **必要な依存関係のみ**: 各コンポーネントは本当に必要な機能のサービスのみを注入

2. **テスタビリティ向上**: 小さなインターフェースはモック作成が容易

```typescript
// user-list.component.spec.ts - テスト例
describe("UserListComponent", () => {
  let component: UserListComponent;
  let mockUserDataService: jasmine.SpyObj<IUserDataService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj("IUserDataService", [
      "getAllUsers",
      "deleteUser",
    ]);

    TestBed.configureTestingModule({
      declarations: [UserListComponent],
      providers: [
        { provide: IUserDataService, useValue: spy }, // 小さなインターフェースなので簡単にモック化
      ],
    });

    mockUserDataService = TestBed.inject(
      IUserDataService
    ) as jasmine.SpyObj<IUserDataService>;
  });

  it("ユーザー一覧を読み込む", () => {
    mockUserDataService.getAllUsers.and.returnValue(
      of([
        { id: 1, name: "Test User", email: "test@example.com", role: "user" },
      ])
    );

    component.loadUsers();

    expect(mockUserDataService.getAllUsers).toHaveBeenCalled();
    expect(component.users.length).toBe(1);
  });
});
```

3. **保守性**: 一つの機能変更が他の機能に影響しない

4. **再利用性**: 小さなサービスは他のプロジェクトでも再利用しやすい

5. **責任の明確化**: 各サービスの役割が明確で理解しやすい

この設計により、Angular アプリケーションでもインターフェース分離の原則が守られ、柔軟で保守しやすいアーキテクチャを実現できます。

## まとめ

インターフェース分離の原則は、**インターフェースをその利用者の視点から設計し、役割ごとに小さく保つ**ことを推奨する原則です。

これにより、クラスは不要な機能の実装を強制されなくなり、システム全体の疎結合性（依存関係の弱さ）が高まります。結果として、より柔軟で、変更しやすく、理解しやすいコードにつながるのです。
