# Session3: プロジェクト完成（60 分）

> 💡 **対象**: 他言語経験者（ユニオン型・型ガード知識あり）  
> 🎯 **形式**: 講師サポート付き学習  
> ⏰ **時間**: 60 分（休憩含む）

## 📅 セッション概要

**学習目標**:

- [ ] Step04 の総合プロジェクト: ユーザー管理システムの完成
- [ ] 複数の型ガードを組み合わせた実践的な実装
- [ ] エラーハンドリングでの型安全性確保
- [ ] Step05 への準備と Step04 の総復習

**成果物**:

- ユーザー管理システムの型安全な実装
- Step04 で学んだ概念の統合活用

---

## ⏰ 詳細タイムテーブル

| 時間         | 内容                   | 講師の役割                 | 学習者の活動   | 成果物           |
| ------------ | ---------------------- | -------------------------- | -------------- | ---------------- |
| **0-10 分**  | 最終課題説明           | 課題説明・期待値設定       | 理解・質問     | 実装計画         |
| **10-45 分** | プロジェクト完成       | 個別サポート・デバッグ支援 | 開発・完成     | 完成プロジェクト |
| **45-60 分** | 成果発表・次 Step 準備 | 評価・フィードバック       | 発表・振り返り | 学習成果         |

---

## 🎯 最終課題: ユーザー管理システム

### 📋 プロジェクト概要

Step01-04 で学んだ知識を統合して、型安全なユーザー管理システムを実装します。

**使用する技術・概念**:

- Step01: JavaScript 基礎、TypeScript 基本型注釈
- Step02: 基本型システム、型エイリアス、型推論
- Step03: インターフェース、オプショナルプロパティ、継承
- Step04: ユニオン型、インターセクション型、型ガード、判別可能なユニオン

### 🔧 実装要件

#### 1. 基本型定義

```typescript
// Step02で学んだ型エイリアスを活用
type UserId = number;
type UserRole = "admin" | "editor" | "viewer";
type UserStatus = "active" | "inactive" | "pending";

// Step03で学んだインターフェースを活用
interface BaseUser {
  id: UserId;
  name: string;
  email: string;
  status: UserStatus;
  createdAt: Date;
}

// Step03で学んだインターフェース継承を活用
interface AdminUser extends BaseUser {
  role: "admin";
  permissions: string[];
  lastLogin: Date;
}

interface EditorUser extends BaseUser {
  role: "editor";
  editableResources: string[];
  department: string;
}

interface ViewerUser extends BaseUser {
  role: "viewer";
  accessLevel: number;
}

// Step04で学んだユニオン型を活用
type User = AdminUser | EditorUser | ViewerUser;
```

#### 2. API レスポンス型定義

```typescript
// Step04で学んだ判別可能なユニオンを活用
interface SuccessResponse<T> {
  status: "success";
  data: T;
  message: string;
}

interface ErrorResponse {
  status: "error";
  message: string;
  code: number;
}

type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;

// 具体的なレスポンス型
type UserResponse = ApiResponse<User>;
type UserListResponse = ApiResponse<User[]>;
```

#### 3. 実装する関数

以下の関数を実装してください：

```typescript
// 要件1: ユーザーの権限レベルを取得
function getUserPermissionLevel(user: User): number {
  // admin: 3, editor: 2, viewer: 1
  /* ここを実装 */
}

// 要件2: ユーザーが特定のリソースにアクセス可能かチェック
function canUserAccessResource(user: User, resource: string): boolean {
  // admin: 全リソースアクセス可能
  // editor: editableResourcesに含まれるリソースのみ
  // viewer: アクセス不可
  /* ここを実装 */
}

// 要件3: APIレスポンスを処理
function processUserResponse(response: UserResponse): string {
  // 成功時: "ユーザー取得成功: {name} ({role})"
  // エラー時: "エラー[{code}]: {message}"
  /* ここを実装 */
}

// 要件4: ユーザーリストをフィルタリング
function filterActiveUsers(users: User[]): User[] {
  // statusが"active"のユーザーのみを返す
  /* ここを実装 */
}

// 要件5: ユーザー情報を表示用文字列に変換
function formatUserInfo(user: User): string {
  // 基本情報 + ロール固有の情報を含む文字列を返す
  /* ここを実装 */
}

// 要件6: ユーザーの更新可能なフィールドを取得
function getUpdatableFields(user: User): string[] {
  // admin: ["name", "email", "permissions"]
  // editor: ["name", "email", "department"]
  // viewer: ["name", "email"]
  /* ここを実装 */
}

// 要件7: エラーレスポンスかどうかを判定する型ガード
function isErrorResponse<T>(
  response: ApiResponse<T>
): response is ErrorResponse {
  /* ここを実装 */
}

// 要件8: 特定のロールのユーザーかどうかを判定
function isAdminUser(user: User): user is AdminUser {
  /* ここを実装 */
}

function isEditorUser(user: User): user is EditorUser {
  /* ここを実装 */
}
```

#### 4. 使用例とテストケース

実装した関数が正しく動作することを確認するテストケースも作成してください：

```typescript
// テスト用のサンプルデータ
const adminUser: AdminUser = {
  id: 1,
  name: "田中太郎",
  email: "tanaka@example.com",
  status: "active",
  createdAt: new Date(),
  role: "admin",
  permissions: ["user_management", "system_config"],
  lastLogin: new Date(),
};

const editorUser: EditorUser = {
  id: 2,
  name: "佐藤花子",
  email: "sato@example.com",
  status: "active",
  createdAt: new Date(),
  role: "editor",
  editableResources: ["articles", "images"],
  department: "編集部",
};

const viewerUser: ViewerUser = {
  id: 3,
  name: "鈴木一郎",
  email: "suzuki@example.com",
  status: "inactive",
  createdAt: new Date(),
  role: "viewer",
  accessLevel: 1,
};

// テストケースの実行例
console.log("=== 権限レベルテスト ===");
console.log(`Admin権限レベル: ${getUserPermissionLevel(adminUser)}`); // 3
console.log(`Editor権限レベル: ${getUserPermissionLevel(editorUser)}`); // 2
console.log(`Viewer権限レベル: ${getUserPermissionLevel(viewerUser)}`); // 1

console.log("\n=== リソースアクセステスト ===");
console.log(
  `Admin記事アクセス: ${canUserAccessResource(adminUser, "articles")}`
); // true
console.log(
  `Editor記事アクセス: ${canUserAccessResource(editorUser, "articles")}`
); // true
console.log(
  `Viewer記事アクセス: ${canUserAccessResource(viewerUser, "articles")}`
); // false

// 追加のテストケースを作成してください
```

---

## 📝 実装解答例

### 基本実装

```typescript
function getUserPermissionLevel(user: User): number {
  switch (user.role) {
    case "admin":
      return 3;
    case "editor":
      return 2;
    case "viewer":
      return 1;
  }
}

function canUserAccessResource(user: User, resource: string): boolean {
  switch (user.role) {
    case "admin":
      return true; // 管理者は全リソースアクセス可能
    case "editor":
      return user.editableResources.includes(resource);
    case "viewer":
      return false; // 閲覧者はアクセス不可
  }
}

function processUserResponse(response: UserResponse): string {
  if (response.status === "success") {
    return `ユーザー取得成功: ${response.data.name} (${response.data.role})`;
  } else {
    return `エラー[${response.code}]: ${response.message}`;
  }
}

function filterActiveUsers(users: User[]): User[] {
  return users.filter((user) => user.status === "active");
}

function formatUserInfo(user: User): string {
  let info = `${user.name} (${user.email}) - ${user.role} [${user.status}]`;

  switch (user.role) {
    case "admin":
      info += `\n権限: ${user.permissions.join(", ")}`;
      info += `\n最終ログイン: ${user.lastLogin.toLocaleDateString()}`;
      break;
    case "editor":
      info += `\n部署: ${user.department}`;
      info += `\n編集可能: ${user.editableResources.join(", ")}`;
      break;
    case "viewer":
      info += `\nアクセスレベル: ${user.accessLevel}`;
      break;
  }

  return info;
}

function getUpdatableFields(user: User): string[] {
  const baseFields = ["name", "email"];

  switch (user.role) {
    case "admin":
      return [...baseFields, "permissions"];
    case "editor":
      return [...baseFields, "department"];
    case "viewer":
      return baseFields;
  }
}

function isErrorResponse<T>(
  response: ApiResponse<T>
): response is ErrorResponse {
  return response.status === "error";
}

function isAdminUser(user: User): user is AdminUser {
  return user.role === "admin";
}

function isEditorUser(user: User): user is EditorUser {
  return user.role === "editor";
}
```

### 応用実装（チャレンジ課題）

```typescript
// ユーザー検索機能
function searchUsers(users: User[], query: string): User[] {
  return users.filter(
    (user) => user.name.includes(query) || user.email.includes(query)
  );
}

// ロール別ユーザー統計
function getUserStatsByRole(users: User[]): Record<UserRole, number> {
  return users.reduce((stats, user) => {
    stats[user.role] = (stats[user.role] || 0) + 1;
    return stats;
  }, {} as Record<UserRole, number>);
}

// ユーザーの最終アクティビティ取得
function getLastActivity(user: User): Date | null {
  if (isAdminUser(user)) {
    return user.lastLogin;
  }
  return user.createdAt; // 他のロールは作成日時を返す
}
```

---

## 🎯 成果発表

### 発表内容

1. **実装したシステムの概要説明**（3 分）

   - どのような機能を実装したか
   - 使用した TypeScript の機能

2. **技術的な工夫点**（2 分）

   - 型安全性をどのように確保したか
   - 型ガードをどのように活用したか

3. **学習の振り返り**（2 分）
   - Step04 で最も理解が深まった概念
   - 実際のプロジェクトでの活用イメージ

### 評価ポイント

- [ ] ユニオン型を適切に使用している
- [ ] 型ガードを正しく実装している
- [ ] 判別可能なユニオンを活用している
- [ ] インターフェース継承を適切に使用している
- [ ] エラーハンドリングが型安全に実装されている

---

## 🚀 次 Step 準備

### Step05 への準備

**Step05 で学習する内容**:

- ジェネリクス基礎
- 型パラメータの基本概念
- 再利用可能な型定義

**今日の学習との関係**:
Step04 で学んだユニオン型や型ガードは、Step05 のジェネリクスと組み合わせることで、より柔軟で再利用可能な型定義を作成できるようになります。

**準備事項**:

- Step04 の復習（特に型ガードと判別可能なユニオン）
- 今日作成したユーザー管理システムの理解確認
- 「再利用可能な型」という概念への興味を持つ

### Step04 総復習

**習得した重要概念**:

1. **ユニオン型（|）**: 複数の型から一つを選択
2. **インターセクション型（&）**: 複数の型を結合
3. **型ガード**: 実行時の型チェックによる型の絞り込み
4. **判別可能なユニオン**: 共通プロパティによる型の判別

**実践で活用できる場面**:

- API レスポンスの型安全な処理
- フォーム入力の検証
- 状態管理での型安全性確保
- ユーザー権限システムの実装

---

## 🎊 Step04 完了おめでとうございます！

TypeScript の型システムの重要な基礎を習得されました。次の Step05 では、より高度で柔軟な型定義を学習していきます。

**学習継続のコツ**:

- 今日学んだ概念を実際のプロジェクトで試してみる
- 型エラーが出た時に、型ガードで解決できないか考える
- 他の開発者の TypeScript コードで型ガードの使用例を探してみる
