# Session3: プロジェクト完成（60 分）

> 💡 **対象**: 他言語経験者（ユニオン型・型ガード知識あり）
> 🎯 **形式**: 講師サポート付き学習
> ⏰ **時間**: 60 分（休憩含む）

## 📚 関連補足資料

プロジェクト完成をサポートする補足資料をご用意しています：

- 💻 **[実践コード例](./Step04_補足_実践コード例.md)** - 完全なシステム実装例とベストプラクティス
- 🚨 **[トラブルシューティング](./Step04_補足_トラブルシューティング.md)** - デバッグとエラー解決の完全ガイド
- 📖 **[専門用語集](./Step04_補足_専門用語集.md)** - 高度な概念と用語の詳細解説
- 🌐 **[参考リソース](./Step04_補足_参考リソース.md)** - 継続学習のためのリソース集
- 🔧 **[開発環境ガイド](./Step04_補足_開発環境ガイド.md)** - 効率的な開発環境の活用

> 💡 **活用方法**: 学習中に疑問が生じた際や、より深く理解したい場合に参照してね 🐰

## 📅 セッション概要

**学習目標**:

- [ ] Step04 の総合プロジェクト: ユーザー管理システムの完成
- [ ] 複数の型ガードを組み合わせた実践的な実装
- [ ] エラーハンドリングでの型安全性確保
- [ ] Step05 への準備と Step04 の総復習

**前提知識チェック**:
- [ ] Session1-2: ユニオン型、インターセクション型、型ガード（typeof、instanceof、in演算子）
- [ ] Step01-03: JavaScript基礎、TypeScript基本型注釈、インターフェース

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

> 📚 **実装サポート**: [実践コード例 - ユーザー管理システム完全版](./Step04_補足_実践コード例.md#ユーザー管理システム完全版) | [トラブルシューティング - デバッグガイド](./Step04_補足_トラブルシューティング.md#デバッグのコツ)

### 📋 プロジェクト概要

Step01-04 で学んだ知識を統合して、型安全なユーザー管理システムを実装します。

**使用する技術・概念**:

- Step01: JavaScript 基礎、TypeScript 基本型注釈
- Step02: 基本型システム、型エイリアス、型推論
- Step03: インターフェース、オプショナルプロパティ、継承
- Step04: ユニオン型、インターセクション型、型ガード、判別可能なユニオン

### 🔧 実装要件

#### 1. 基本機能の完成（Session2 からの継続）

Session2で実装した機能に加え、以下の基本型定義とAPIレスポンス型定義を統合します。

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

#### 2. 新規追加機能

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

## 👨‍🏫 学習ポイント

### 🤔 よくある実装上の問題と解決法

**Q: 型ガードが期待通りに機能しないのはなぜですか？**
A: 型ガードが機能しない場合、以下の点を確認してください。
1.  **判別プロパティの不一致**: 判別可能なユニオンを使用している場合、`type` や `status` などの判別プロパティの値が正確に一致しているか確認してください。文字列リテラル型を使用している場合は、大文字・小文字の違いにも注意が必要です。
2.  **網羅性の欠如**: `switch` 文や `if/else if` チェーンで全てのユニオンメンバーを網羅しているか確認してください。網羅されていない型があると、TypeScriptは型を絞り込めません。
3.  **型アサーションの乱用**: 型アサーション (`as Type`) はコンパイラへの指示であり、実行時の型チェックは行いません。安易な型アサーションは型安全性を損なうため、可能な限り型ガードを使用しましょう。

**Q: 複雑なユニオン型で型ガードが煩雑になります。良い方法はありますか？**
A: 以下の方法を検討してください。
1.  **判別可能なユニオンの活用**: 共通の判別プロパティを持つオブジェクトのユニオン型は、`switch` 文で簡潔に型を絞り込めます。
2.  **ユーザー定義型ガードの作成**: 複雑な条件で型を絞り込む必要がある場合、カスタムの型ガード関数を作成すると、コードの再利用性と可読性が向上します。
3.  **ヘルパー関数の導入**: 型ガードロジックが複雑になる場合は、そのロジックを独立したヘルパー関数に切り出すことで、メインの処理を簡潔に保てます。

---

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

## 成果物

- [ ] **ユーザー管理システム**: ユニオン型と型ガード練習に特化した学習者向けプロジェクト → [Step04 成果物](../../Step04_成果物.md)で詳細確認

---

## 📊 Step04総合評価

### 最終評価基準

#### 技術習得度（60%）
- [ ] **ユニオン型基礎**: 基本的なユニオン型（|）の理解と活用
- [ ] **インターセクション型基礎**: 基本的なインターセクション型（&）の理解と活用
- [ ] **型ガード実践**: typeof、instanceof、in演算子の適切な使用
- [ ] **判別可能なユニオン**: 共通プロパティによる型判別の実装

#### 実装品質（25%）
- [ ] **コードの可読性**: 変数名・関数名の適切性
- [ ] **型安全性**: ユニオン型・型ガードの恩恵を活用
- [ ] **保守性**: 拡張しやすい設計
- [ ] **動作確認**: 実装した機能の正常動作

#### 学習姿勢（15%）
- [ ] **積極性**: 質問・議論への参加
- [ ] **問題解決**: 自力でのデバッグ・調査
- [ ] **協調性**: 他の学習者との協力
- [ ] **振り返り**: 学習内容の整理・次ステップの計画

---


**🎉 お疲れ様でした！** Step04 を通じてユニオン型と型ガードの基礎をしっかりと身につけることができました。

**🚀 次の Step05 では、より高度なジェネリクスと実践的な開発手法を学習します！**
