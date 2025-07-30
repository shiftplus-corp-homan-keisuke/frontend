# Session2: 列挙型・関数型ユーティリティ（90分）

> 🎯 **対象**: Session1完了者（オブジェクト型ユーティリティ習得済み）
> 👥 **形式**: 1on1学習（講師と学習者）
> ⏰ **時間**: 90分

## 📅 セッション概要

**学習目標**:
- [ ] Extract型の理解とユニオン型からの型抽出
- [ ] Exclude型の理解とユニオン型からの型除外
- [ ] NonNullable型の理解とnull/undefined安全性の確保
- [ ] Parameters型の理解と関数の引数型取得
- [ ] ReturnType型の理解と関数の戻り値型取得

**前提知識**:
- Session1の内容（オブジェクト型ユーティリティの理解）
- ユニオン型の基本概念
- 関数の型定義の基本
- ジェネリクスの基本的な使用方法

---

## ⏰ 詳細タイムテーブル

| 時間 | 内容 | 講師の役割 | 学習者の活動 |
|------|------|------------|--------------|
| **0-10分** | 前回復習・今回目標 | 復習確認・目標提示 | 振り返り・質問 |
| **10-25分** | Extract型の学習・練習 | 解説・個別サポート | 理解・実践 |
| **25-40分** | Exclude型の学習・練習 | 解説・個別サポート | 理解・実践 |
| **40-55分** | NonNullable型の学習・練習 | 解説・個別サポート | 理解・実践 |
| **55-70分** | Parameters型の学習・練習 | 解説・個別サポート | 理解・実践 |
| **70-85分** | ReturnType型の学習・練習 | 解説・個別サポート | 理解・実践 |
| **85-90分** | 振り返り・次回予告 | まとめ・予告 | 質問・確認 |

---

## 📚 学習内容

### 1. Extract<T, U> - ユニオン型からの型抽出

#### 🔍 基本概念

`Extract<T, U>`は、ユニオン型Tから、型Uに代入可能な型のみを抽出します。特定の条件に合致する型だけを取り出したい場合に使用します。

```typescript
type AllTypes = "admin" | "user" | "guest" | 123 | true;
type StringTypes = Extract<AllTypes, string>;
// "admin" | "user" | "guest"

type NumberTypes = Extract<AllTypes, number>;
// 123
```

#### 💡 実践的な使用例

```typescript
// ユーザーロールから管理者系のロールのみを抽出
type UserRole = "admin" | "superAdmin" | "user" | "guest" | "moderator";
type AdminRoles = Extract<UserRole, "admin" | "superAdmin" | "moderator">;
// "admin" | "superAdmin" | "moderator"

// イベントタイプから特定のカテゴリのみを抽出
type EventType = "click" | "hover" | "focus" | "scroll" | "resize" | "load";
type MouseEvents = Extract<EventType, "click" | "hover">;
// "click" | "hover"

// 関数を使った実用例
function handleAdminAction(role: AdminRoles, action: string): void {
  console.log(`${role}が${action}を実行しました`);
}

// handleAdminAction("user", "delete"); // エラー: "user"は AdminRoles に含まれない
handleAdminAction("admin", "delete"); // OK
```

#### 🎯 練習問題 1-1: Extract型の基本

以下の要件に基づいて、Extract型を活用してください。

```typescript
// ファイルタイプの定義
type FileType = "image" | "video" | "audio" | "document" | "archive";
type MediaType = "jpg" | "png" | "mp4" | "mp3" | "pdf" | "zip";

// TODO: メディアファイルタイプのみを抽出
type MediaFileTypes = /* ここに型を記述 */;

// TODO: ドキュメントタイプのみを抽出
type DocumentTypes = /* ここに型を記述 */;

// TODO: メディアファイルを処理する関数
function processMediaFile(type: /* ここに型を記述 */): string {
  // ここに実装
}
```

**解答例**:
```typescript
type MediaFileTypes = Extract<FileType, "image" | "video" | "audio">;
type DocumentTypes = Extract<FileType, "document">;

function processMediaFile(type: MediaFileTypes): string {
  switch (type) {
    case "image":
      return "画像を処理中...";
    case "video":
      return "動画を処理中...";
    case "audio":
      return "音声を処理中...";
  }
}
```

---

### 2. Exclude<T, U> - ユニオン型からの型除外

#### 🔍 基本概念

`Exclude<T, U>`は、ユニオン型Tから、型Uに代入可能な型を除外します。特定の型を除いた残りの型を取得したい場合に使用します。

```typescript
type AllColors = "red" | "green" | "blue" | "yellow" | "purple";
type WarmColors = Exclude<AllColors, "blue" | "green">;
// "red" | "yellow" | "purple"

type AllNumbers = 1 | 2 | 3 | 4 | 5;
type OddNumbers = Exclude<AllNumbers, 2 | 4>;
// 1 | 3 | 5
```

#### 💡 実践的な使用例

```typescript
// 権限から特定の権限を除外
type AllPermissions = "read" | "write" | "delete" | "admin" | "super";
type UserPermissions = Exclude<AllPermissions, "admin" | "super">;
// "read" | "write" | "delete"

// HTTPメソッドから読み取り専用メソッドを除外
type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
type MutatingMethods = Exclude<HttpMethod, "GET">;
// "POST" | "PUT" | "DELETE" | "PATCH"

// 実用的な関数例
function executeUserAction(permission: UserPermissions): void {
  console.log(`ユーザーが${permission}権限を使用しました`);
}

// executeUserAction("admin"); // エラー: "admin"は UserPermissions に含まれない
executeUserAction("read"); // OK
```

#### 🎯 練習問題 2-1: Exclude型の基本

以下の要件に基づいて、Exclude型を活用してください。

```typescript
// 全ての状態
type AllStatus = "pending" | "processing" | "completed" | "failed" | "cancelled";

// TODO: 終了状態以外の状態を抽出
type ActiveStatus = /* ここに型を記述 */;

// TODO: エラー状態以外の状態を抽出
type SuccessStatus = /* ここに型を記述 */;

// TODO: アクティブな状態のタスクを処理する関数
function processActiveTask(status: /* ここに型を記述 */): string {
  // ここに実装
}
```

**解答例**:
```typescript
type ActiveStatus = Exclude<AllStatus, "completed" | "failed" | "cancelled">;
type SuccessStatus = Exclude<AllStatus, "failed">;

function processActiveTask(status: ActiveStatus): string {
  switch (status) {
    case "pending":
      return "タスクは待機中です";
    case "processing":
      return "タスクを処理中です";
  }
}
```

---

### 3. NonNullable<T> - null/undefined の除外

#### 🔍 基本概念

`NonNullable<T>`は、型Tから`null`と`undefined`を除外します。値が確実に存在することを保証したい場合に使用します。

```typescript
type MaybeString = string | null | undefined;
type DefiniteString = NonNullable<MaybeString>;
// string

type MaybeUser = { id: number; name: string } | null | undefined;
type DefiniteUser = NonNullable<MaybeUser>;
// { id: number; name: string }
```

#### 💡 実践的な使用例

```typescript
// APIレスポンスの安全な処理
interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}

function processApiData<T>(response: ApiResponse<T>): NonNullable<T> | never {
  if (response.data === null) {
    throw new Error(response.error || "データが見つかりません");
  }
  return response.data; // ここでは T は null ではないことが保証される
}

// 配列のフィルタリング
function filterNonNullable<T>(array: (T | null | undefined)[]): NonNullable<T>[] {
  return array.filter((item): item is NonNullable<T> => item != null);
}

// 使用例
const mixedArray = ["hello", null, "world", undefined, "!"];
const cleanArray = filterNonNullable(mixedArray);
// string[] 型で、null/undefined が除外される
```

#### 🎯 練習問題 3-1: NonNullable型の基本

以下の要件に基づいて、NonNullable型を活用してください。

```typescript
// ユーザー情報（null/undefinedの可能性あり）
type MaybeUserInfo = {
  id: number;
  name: string;
  email: string;
} | null | undefined;

// TODO: 確実に存在するユーザー情報の型
type ValidUserInfo = /* ここに型を記述 */;

// TODO: ユーザー情報を安全に処理する関数
function processUserInfo(user: MaybeUserInfo): /* ここに戻り値の型を記述 */ {
  // ここに実装（null/undefinedチェックを含む）
}

// TODO: 配列から有効なユーザーのみを抽出する関数
function getValidUsers(users: MaybeUserInfo[]): /* ここに戻り値の型を記述 */[] {
  // ここに実装
}
```

**解答例**:
```typescript
type ValidUserInfo = NonNullable<MaybeUserInfo>;

function processUserInfo(user: MaybeUserInfo): ValidUserInfo {
  if (user == null) {
    throw new Error("ユーザー情報が無効です");
  }
  return user;
}

function getValidUsers(users: MaybeUserInfo[]): ValidUserInfo[] {
  return users.filter((user): user is ValidUserInfo => user != null);
}
```

---

### 4. Parameters<T> - 関数の引数型取得

#### 🔍 基本概念

`Parameters<T>`は、関数型Tの引数の型をタプル型として取得します。関数の引数と同じ型の配列や、関数を動的に呼び出す際に使用します。

```typescript
function createUser(name: string, age: number, email: string): void {
  // 実装...
}

type CreateUserParams = Parameters<typeof createUser>;
// [string, number, string]

// 使用例
const userParams: CreateUserParams = ["太郎", 25, "taro@example.com"];
createUser(...userParams);
```

#### 💡 実践的な使用例

```typescript
// 関数のラッパーを作成
function logAndExecute<T extends (...args: any[]) => any>(
  fn: T,
  ...args: Parameters<T>
): ReturnType<T> {
  console.log(`関数 ${fn.name} を実行中...`, args);
  return fn(...args);
}

// APIコール関数
function fetchUser(id: number, includeProfile: boolean = false): Promise<User> {
  // 実装...
  return Promise.resolve({} as User);
}

// Parameters型を使用してAPIコールをラップ
type FetchUserParams = Parameters<typeof fetchUser>;

function cachedFetchUser(...args: FetchUserParams): Promise<User> {
  const [id, includeProfile] = args;
  console.log(`ユーザー ${id} を取得中... (プロフィール含む: ${includeProfile})`);
  return fetchUser(...args);
}
```

#### 🎯 練習問題 4-1: Parameters型の基本

以下の要件に基づいて、Parameters型を活用してください。

```typescript
// 商品を作成する関数
function createProduct(name: string, price: number, category: string, inStock: boolean): Product {
  return {
    id: generateId(),
    name,
    price,
    category,
    inStock,
    createdAt: new Date()
  };
}

// TODO: createProduct関数の引数型を取得
type CreateProductParams = /* ここに型を記述 */;

// TODO: 商品作成のバリデーション関数
function validateProductData(params: /* ここに型を記述 */): boolean {
  // ここに実装
}

// TODO: 商品作成をログ付きで実行する関数
function createProductWithLog(...args: /* ここに型を記述 */): Product {
  // ここに実装
}
```

**解答例**:
```typescript
type CreateProductParams = Parameters<typeof createProduct>;

function validateProductData(params: CreateProductParams): boolean {
  const [name, price, category, inStock] = params;
  return name.length > 0 && price > 0 && category.length > 0;
}

function createProductWithLog(...args: CreateProductParams): Product {
  console.log("商品を作成中...", args);
  if (!validateProductData(args)) {
    throw new Error("無効な商品データです");
  }
  return createProduct(...args);
}
```

---

### 5. ReturnType<T> - 関数の戻り値型取得

#### 🔍 基本概念

`ReturnType<T>`は、関数型Tの戻り値の型を取得します。関数の戻り値と同じ型の変数を定義したり、関数の戻り値を加工する際に使用します。

```typescript
function getUser(): { id: number; name: string; email: string } {
  return { id: 1, name: "太郎", email: "taro@example.com" };
}

type User = ReturnType<typeof getUser>;
// { id: number; name: string; email: string }

// 使用例
const user: User = getUser();
```

#### 💡 実践的な使用例

```typescript
// API関数の戻り値型を再利用
async function fetchUserProfile(id: number): Promise<{
  user: { id: number; name: string; email: string };
  profile: { bio: string; avatar: string };
  settings: { theme: string; language: string };
}> {
  // API呼び出しの実装...
  return {} as any;
}

type UserProfileData = ReturnType<typeof fetchUserProfile>;
// Promise<{ user: {...}, profile: {...}, settings: {...} }>

// Promiseの中身の型を取得
type UserProfileResult = Awaited<ReturnType<typeof fetchUserProfile>>;

// キャッシュシステムの実装
class ApiCache {
  private cache = new Map<string, any>();

  async getCachedResult<T extends (...args: any[]) => any>(
    key: string,
    fn: T,
    ...args: Parameters<T>
  ): Promise<ReturnType<T>> {
    if (this.cache.has(key)) {
      return this.cache.get(key);
    }
    
    const result = await fn(...args);
    this.cache.set(key, result);
    return result;
  }
}
```

#### 🎯 練習問題 5-1: ReturnType型の基本

以下の要件に基づいて、ReturnType型を活用してください。

```typescript
// 注文情報を取得する関数
function getOrderDetails(orderId: string): {
  id: string;
  items: Array<{ name: string; price: number; quantity: number }>;
  total: number;
  status: "pending" | "confirmed" | "shipped" | "delivered";
  customer: { name: string; email: string };
} {
  // 実装...
  return {} as any;
}

// TODO: 注文詳細の型を取得
type OrderDetails = /* ここに型を記述 */;

// TODO: 注文の概要情報のみを抽出する関数
function getOrderSummary(order: /* ここに型を記述 */): Pick<OrderDetails, "id" | "total" | "status"> {
  // ここに実装
}

// TODO: 注文情報を加工する関数
function processOrderData(orderId: string): /* ここに戻り値の型を記述 */ {
  // ここに実装
}
```

**解答例**:
```typescript
type OrderDetails = ReturnType<typeof getOrderDetails>;

function getOrderSummary(order: OrderDetails): Pick<OrderDetails, "id" | "total" | "status"> {
  return {
    id: order.id,
    total: order.total,
    status: order.status
  };
}

function processOrderData(orderId: string): OrderDetails {
  const orderDetails = getOrderDetails(orderId);
  // 必要に応じて加工処理
  return orderDetails;
}
```

---

## 🎯 総合練習問題

以下の要件を満たす型安全なイベントシステムを設計してください。

```typescript
// イベントタイプの定義
type EventType = "user_login" | "user_logout" | "page_view" | "button_click" | "form_submit" | "error_occurred";

// イベントハンドラー関数の定義
function handleUserLogin(userId: string, timestamp: Date): { success: boolean; message: string } {
  return { success: true, message: "ログイン成功" };
}

function handlePageView(path: string, userId?: string): { tracked: boolean } {
  return { tracked: true };
}

function handleError(error: Error, context: string): { logged: boolean; severity: "low" | "high" } {
  return { logged: true, severity: "high" };
}

// TODO: 以下の型を実装してください

// 1. ユーザー関連のイベントのみを抽出
type UserEvents = /* 実装 */;

// 2. エラー以外のイベントを抽出
type NonErrorEvents = /* 実装 */;

// 3. handleUserLogin関数の引数型を取得
type LoginParams = /* 実装 */;

// 4. handleError関数の戻り値型を取得
type ErrorResult = /* 実装 */;

// 5. null/undefinedを含む可能性のあるイベントデータから安全な型を作成
type MaybeEventData = { type: EventType; data: any } | null | undefined;
type SafeEventData = /* 実装 */;

// 6. イベントハンドラーの戻り値を統一する型
type EventHandlerResult = /* 実装 */;
```

**解答例**:
```typescript
type UserEvents = Extract<EventType, "user_login" | "user_logout">;
type NonErrorEvents = Exclude<EventType, "error_occurred">;
type LoginParams = Parameters<typeof handleUserLogin>;
type ErrorResult = ReturnType<typeof handleError>;
type SafeEventData = NonNullable<MaybeEventData>;
type EventHandlerResult = 
  | ReturnType<typeof handleUserLogin>
  | ReturnType<typeof handlePageView>
  | ReturnType<typeof handleError>;
```

---

## 👨‍🏫 学習ポイント

### 🤔 よくある質問

**Q: ExtractとExcludeの使い分けは？**
A: 必要な型が少ない場合はExtract、除外したい型が少ない場合はExcludeを使います。可読性を重視して選択しましょう。

**Q: NonNullableはいつ使うのですか？**
A: APIレスポンスや外部データなど、null/undefinedの可能性があるデータを安全に処理する際に使用します。

**Q: ParametersとReturnTypeの実用的な場面は？**
A: 関数のラッパー作成、キャッシュシステム、ログシステムなど、既存の関数を拡張する際に威力を発揮します。

### 💡 実践のコツ

1. **型の組み合わせ**: これらの型は組み合わせて使用することで、より強力な型システムを構築できます
2. **段階的な型変換**: 複雑な型変換は段階的に行い、中間結果を型エイリアスで保存しましょう
3. **実行時の安全性**: TypeScriptの型システムは実行時の動作を完全には保証しないため、重要な箇所では実行時チェックも併用しましょう

---

**📌 重要**: Session2では列挙型と関数型のユーティリティ型を学習しました。これらはSession1のオブジェクト型と組み合わせることで、より実用的な型システムを構築できます。

**🌟 次回（Session3）は、これまで学習した全ての型を使ってユーザー情報管理システムを作成します！**