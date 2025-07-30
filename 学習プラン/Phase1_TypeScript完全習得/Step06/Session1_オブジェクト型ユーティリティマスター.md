# Session1: オブジェクト型ユーティリティ（90分）

> 🎯 **対象**: Step01-05完了者（基本型・インターフェース・ユニオン型・ジェネリクス習得済み）
> 👥 **形式**: 1on1学習（講師と学習者）
> ⏰ **時間**: 90分

## 📅 セッション概要

**学習目標**:
- [ ] Partial型の理解と実践的な活用方法の習得
- [ ] Required型の理解と設定管理での活用
- [ ] Readonly型の理解とイミュータブルデータの作成
- [ ] Pick型の理解とAPI設計での活用
- [ ] Omit型の理解と機密情報の除外
- [ ] Record型の理解とマッピングオブジェクトの作成

**前提知識**:
- 基本型（string, number, boolean）の理解
- インターフェースの定義と使用
- ユニオン型の基本概念
- ジェネリクスの基本的な使用方法

---

## ⏰ 詳細タイムテーブル

| 時間 | 内容 | 講師の役割 | 学習者の活動 |
|------|------|------------|--------------|
| **0-10分** | 全体概要・目標設定 | 説明・質疑応答 | 聞く・質問 |
| **10-25分** | Partial型の学習・練習 | 解説・個別サポート | 理解・実践 |
| **25-40分** | Required型の学習・練習 | 解説・個別サポート | 理解・実践 |
| **40-55分** | Readonly型の学習・練習 | 解説・個別サポート | 理解・実践 |
| **55-70分** | Pick型の学習・練習 | 解説・個別サポート | 理解・実践 |
| **70-85分** | Omit・Record型の学習・練習 | 解説・個別サポート | 理解・実践 |
| **85-90分** | 振り返り・次回予告 | まとめ・予告 | 質問・確認 |

---

## 📚 学習内容

### 1. Partial<T> - 部分的なプロパティ

#### 🔍 基本概念

`Partial<T>`は、型Tの全てのプロパティをオプショナル（`?:`）にする型です。フォームの部分更新や段階的なデータ入力で威力を発揮します。

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  age: number;
}

// Partial<User>は以下と同じ意味
type PartialUser = {
  id?: number;
  name?: string;
  email?: string;
  age?: number;
}
```

#### 💡 実践的な使用例

```typescript
// ユーザー情報の部分更新
function updateUser(id: number, updates: Partial<User>): User {
  const existingUser = getUserById(id);
  return { ...existingUser, ...updates };
}

// 使用例
updateUser(1, { name: "新しい名前" }); // nameだけ更新
updateUser(1, { name: "太郎", age: 25 }); // nameとageを更新
```

#### 🎯 練習問題 1-1: Partial型の基本

以下のインターフェースを使って、Partial型を活用した関数を作成してください。

```typescript
interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  inStock: boolean;
}

// TODO: 商品情報を部分更新する関数を作成
function updateProduct(productId: string, updates: /* ここに型を記述 */): Product {
  // ここに実装
}

// 使用例（これらが正しく動作するように実装してください）
updateProduct("p1", { price: 1500 });
updateProduct("p1", { name: "新商品", inStock: false });
```

**解答例**:
```typescript
function updateProduct(productId: string, updates: Partial<Product>): Product {
  const existingProduct = getProductById(productId);
  return { ...existingProduct, ...updates };
}
```

---

### 2. Required<T> - 必須プロパティ

#### 🔍 基本概念

`Required<T>`は、型Tの全てのオプショナルプロパティを必須にする型です。設定の初期化や完全なデータが必要な場面で使用します。

```typescript
interface Config {
  apiUrl?: string;
  timeout?: number;
  retries?: number;
}

type RequiredConfig = Required<Config>;
// { apiUrl: string; timeout: number; retries: number; }
```

#### 💡 実践的な使用例

```typescript
// アプリケーションの初期化時に全ての設定が必要
function initializeApp(config: Required<Config>): void {
  console.log(`API URL: ${config.apiUrl}`);
  console.log(`Timeout: ${config.timeout}ms`);
  console.log(`Retries: ${config.retries}`);
}

// デフォルト設定を提供する関数
function getDefaultConfig(): Required<Config> {
  return {
    apiUrl: "https://api.example.com",
    timeout: 5000,
    retries: 3
  };
}
```

#### 🎯 練習問題 2-1: Required型の基本

以下のインターフェースを使って、Required型を活用してください。

```typescript
interface UserPreferences {
  theme?: "light" | "dark";
  language?: "ja" | "en";
  notifications?: boolean;
  autoSave?: boolean;
}

// TODO: 全ての設定が必須の型を作成
type CompleteUserPreferences = /* ここに型を記述 */;

// TODO: デフォルト設定を返す関数を作成
function getDefaultPreferences(): /* ここに戻り値の型を記述 */ {
  // ここに実装
}
```

**解答例**:
```typescript
type CompleteUserPreferences = Required<UserPreferences>;

function getDefaultPreferences(): CompleteUserPreferences {
  return {
    theme: "light",
    language: "ja",
    notifications: true,
    autoSave: true
  };
}
```

---

### 3. Readonly<T> - 読み取り専用プロパティ

#### 🔍 基本概念

`Readonly<T>`は、型Tの全てのプロパティを読み取り専用（`readonly`）にする型です。イミュータブルなデータ構造を作成する際に使用します。

```typescript
interface User {
  id: number;
  name: string;
  email: string;
}

type ReadonlyUser = Readonly<User>;
// { readonly id: number; readonly name: string; readonly email: string; }
```

#### 💡 実践的な使用例

```typescript
// 設定データを読み取り専用にして変更を防ぐ
function createImmutableConfig(config: Config): Readonly<Config> {
  return Object.freeze({ ...config });
}

// 使用例
const config = createImmutableConfig({ apiUrl: "https://api.example.com" });
// config.apiUrl = "https://other.com"; // エラー: 読み取り専用プロパティに代入できません
```

#### 🎯 練習問題 3-1: Readonly型の基本

以下のインターフェースを使って、Readonly型を活用してください。

```typescript
interface GameState {
  score: number;
  level: number;
  lives: number;
  isGameOver: boolean;
}

// TODO: 読み取り専用のゲーム状態を作成する関数
function createReadonlyGameState(state: GameState): /* ここに戻り値の型を記述 */ {
  // ここに実装
}

// TODO: ゲーム状態を表示する関数（読み取り専用の状態を受け取る）
function displayGameState(state: /* ここに引数の型を記述 */): string {
  // ここに実装
}
```

**解答例**:
```typescript
function createReadonlyGameState(state: GameState): Readonly<GameState> {
  return Object.freeze({ ...state });
}

function displayGameState(state: Readonly<GameState>): string {
  return `Score: ${state.score}, Level: ${state.level}, Lives: ${state.lives}`;
}
```

---

### 4. Pick<T, K> - プロパティの選択

#### 🔍 基本概念

`Pick<T, K>`は、型Tから指定したキーKのプロパティのみを選択して新しい型を作成します。APIレスポンスの一部だけを使用したい場合などに便利です。

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
}

type PublicUser = Pick<User, "id" | "name">;
// { id: number; name: string; }
```

#### 💡 実践的な使用例

```typescript
// 公開用のユーザー情報（機密情報を除外）
function getPublicUserInfo(user: User): Pick<User, "id" | "name" | "email"> {
  return {
    id: user.id,
    name: user.name,
    email: user.email
  };
}

// ユーザー一覧表示用（最小限の情報のみ）
type UserListItem = Pick<User, "id" | "name">;

function getUserList(): UserListItem[] {
  // 実装...
  return [];
}
```

#### 🎯 練習問題 4-1: Pick型の基本

以下のインターフェースを使って、Pick型を活用してください。

```typescript
interface Article {
  id: string;
  title: string;
  content: string;
  author: string;
  publishedAt: Date;
  updatedAt: Date;
  tags: string[];
  isPublished: boolean;
}

// TODO: 記事一覧表示用の型を作成（id, title, author, publishedAtのみ）
type ArticleListItem = /* ここに型を記述 */;

// TODO: 記事の概要用の型を作成（id, title, author, tagsのみ）
type ArticleSummary = /* ここに型を記述 */;

// TODO: 記事一覧を取得する関数
function getArticleList(): /* ここに戻り値の型を記述 */[] {
  // ここに実装
}
```

**解答例**:
```typescript
type ArticleListItem = Pick<Article, "id" | "title" | "author" | "publishedAt">;
type ArticleSummary = Pick<Article, "id" | "title" | "author" | "tags">;

function getArticleList(): ArticleListItem[] {
  // 実装例
  return [
    {
      id: "1",
      title: "TypeScript入門",
      author: "太郎",
      publishedAt: new Date()
    }
  ];
}
```

---

### 5. Omit<T, K> - プロパティの除外

#### 🔍 基本概念

`Omit<T, K>`は、型Tから指定したキーKのプロパティを除外して新しい型を作成します。機密情報を除外したり、作成時に不要なプロパティを除外する際に使用します。

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  password: string;
}

type CreateUserRequest = Omit<User, "id">;
// { name: string; email: string; password: string; }

type SafeUser = Omit<User, "password">;
// { id: number; name: string; email: string; }
```

#### 💡 実践的な使用例

```typescript
// ユーザー作成時（IDは自動生成されるため除外）
function createUser(userData: Omit<User, "id">): User {
  return {
    id: generateId(),
    ...userData
  };
}

// パスワードを除外した安全なユーザー情報
function getSafeUserInfo(user: User): Omit<User, "password"> {
  const { password, ...safeUser } = user;
  return safeUser;
}
```

#### 🎯 練習問題 5-1: Omit型の基本

以下のインターフェースを使って、Omit型を活用してください。

```typescript
interface BlogPost {
  id: string;
  title: string;
  content: string;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
  isPublished: boolean;
}

// TODO: ブログ投稿作成用の型（id, createdAt, updatedAtを除外）
type CreateBlogPostRequest = /* ここに型を記述 */;

// TODO: ブログ投稿更新用の型（id, authorId, createdAtを除外）
type UpdateBlogPostRequest = /* ここに型を記述 */;

// TODO: ブログ投稿を作成する関数
function createBlogPost(postData: /* ここに引数の型を記述 */): BlogPost {
  // ここに実装
}
```

**解答例**:
```typescript
type CreateBlogPostRequest = Omit<BlogPost, "id" | "createdAt" | "updatedAt">;
type UpdateBlogPostRequest = Omit<BlogPost, "id" | "authorId" | "createdAt">;

function createBlogPost(postData: CreateBlogPostRequest): BlogPost {
  const now = new Date();
  return {
    id: generateId(),
    createdAt: now,
    updatedAt: now,
    ...postData
  };
}
```

---

### 6. Record<K, T> - キー値ペアの型

#### 🔍 基本概念

`Record<K, T>`は、キーの型がK、値の型がTのオブジェクト型を作成します。設定オブジェクトやマッピングデータの型定義に便利です。

```typescript
type UserRole = "admin" | "editor" | "viewer";
type Permissions = Record<UserRole, string[]>;

// 以下と同じ意味
type Permissions = {
  admin: string[];
  editor: string[];
  viewer: string[];
}
```

#### 💡 実践的な使用例

```typescript
// 権限設定
const permissions: Record<UserRole, string[]> = {
  admin: ["read", "write", "delete"],
  editor: ["read", "write"],
  viewer: ["read"]
};

// 環境別設定
type Environment = "development" | "staging" | "production";
const envConfigs: Record<Environment, { apiUrl: string; debugMode: boolean }> = {
  development: {
    apiUrl: "http://localhost:3000",
    debugMode: true
  },
  staging: {
    apiUrl: "https://staging-api.example.com",
    debugMode: false
  },
  production: {
    apiUrl: "https://api.example.com",
    debugMode: false
  }
};
```

#### 🎯 練習問題 6-1: Record型の基本

以下の要件に基づいて、Record型を活用してください。

```typescript
// 言語コード
type LanguageCode = "ja" | "en" | "zh" | "ko";

// TODO: 各言語の翻訳テキストを管理する型を作成
type TranslationTexts = /* ここに型を記述 */;

// TODO: 翻訳データを作成
const translations: /* ここに型を記述 */ = {
  // ここに実装
};

// TODO: 指定した言語のテキストを取得する関数
function getTranslation(language: LanguageCode): string {
  // ここに実装
}
```

**解答例**:
```typescript
type TranslationTexts = Record<LanguageCode, string>;

const translations: Record<string, TranslationTexts> = {
  welcome: {
    ja: "ようこそ",
    en: "Welcome",
    zh: "欢迎",
    ko: "환영합니다"
  },
  goodbye: {
    ja: "さようなら",
    en: "Goodbye",
    zh: "再见",
    ko: "안녕히 가세요"
  }
};

function getTranslation(key: string, language: LanguageCode): string {
  return translations[key]?.[language] || translations[key]?.en || key;
}
```

---

## 🎯 総合練習問題

以下の要件を満たすユーザー管理システムの型を設計してください。

```typescript
interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  age: number;
  role: "admin" | "user" | "guest";
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// TODO: 以下の型を実装してください

// 1. ユーザー作成用（id, createdAt, updatedAtを除外）
type CreateUserData = /* 実装 */;

// 2. ユーザー更新用（id, createdAt, updatedAt, passwordを除外し、他は部分的）
type UpdateUserData = /* 実装 */;

// 3. 公開用ユーザー情報（password, email, createdAt, updatedAtを除外）
type PublicUserInfo = /* 実装 */;

// 4. ユーザー一覧表示用（id, username, role, isActiveのみ）
type UserListItem = /* 実装 */;

// 5. 読み取り専用のユーザー情報
type ReadonlyUserInfo = /* 実装 */;

// 6. ロール別の権限設定
type RolePermissions = /* 実装 */;
```

**解答例**:
```typescript
type CreateUserData = Omit<User, "id" | "createdAt" | "updatedAt">;
type UpdateUserData = Partial<Omit<User, "id" | "createdAt" | "updatedAt" | "password">>;
type PublicUserInfo = Omit<User, "password" | "email" | "createdAt" | "updatedAt">;
type UserListItem = Pick<User, "id" | "username" | "role" | "isActive">;
type ReadonlyUserInfo = Readonly<User>;
type RolePermissions = Record<User["role"], string[]>;
```

---

## 👨‍🏫 学習ポイント

### 🤔 よくある質問

**Q: PartialとOptionalプロパティの違いは何ですか？**
A: Partialは既存の型の全プロパティをオプショナルにする型変換ですが、Optionalプロパティ（?:）は型定義時に直接指定するものです。

**Q: PickとOmitはどちらを使うべきですか？**
A: 必要なプロパティが少ない場合はPick、除外したいプロパティが少ない場合はOmitを使います。

**Q: Recordはいつ使うのですか？**
A: キーが決まっているオブジェクトの型を定義する際に使います。設定オブジェクト、マッピング、辞書的なデータ構造で威力を発揮します。

---

**📌 重要**: Session1はオブジェクト型ユーティリティの基礎固めです。各型の特徴と使用場面をしっかり理解しましょう。

**🌟 次回（Session2）は、列挙型と関数型のユーティリティ型を学習します！**