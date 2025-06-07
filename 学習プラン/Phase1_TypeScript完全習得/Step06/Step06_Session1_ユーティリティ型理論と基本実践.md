# Session1: ユーティリティ型理論と基本実践（90分）

> 💡 **対象**: Step01-05完了者（基本型・インターフェース・ユニオン型・型ガード・ジェネリクス習得済み）
> 🎯 **形式**: 講師サポート付き学習
> ⏰ **時間**: 90分（休憩含む）

## 📚 関連補足資料

このセッションの学習をサポートする補足資料をご用意しています：

- 📖 **[専門用語集](./Step06_補足_専門用語集.md)** - ユーティリティ型・型変換・型レベルプログラミングの重要な概念と用語の詳細解説
- 💻 **[実践コード例](./Step06_補足_実践コード例.md)** - 段階的な学習のためのコード例集
- 🔧 **[開発環境ガイド](./Step06_補足_開発環境ガイド.md)** - 効率的な開発環境の活用
- 🌐 **[参考リソース](./Step06_補足_参考リソース.md)** - 学習に役立つリンク集とリソース
- 🚨 **[トラブルシューティング](./Step06_補足_トラブルシューティング.md)** - よくあるエラーと解決方法

> 💡 **活用方法**: 学習中に疑問が生じた際や、より深く理解したい場合に参照してね 🐰

## 📅 セッション概要

**学習目標**:

- [ ] 組み込みユーティリティ型の基本概念と実践的価値の理解
- [ ] Partial、Required、Pick、Omitの活用方法習得
- [ ] Record、Exclude、Extract、NonNullableの基本使用法
- [ ] 関数関連ユーティリティ型の理解と活用

**前提知識**:

- Step01-05の内容（基本型、インターフェース、ユニオン型、型ガード、ジェネリクス）
- TypeScriptの型システムの基礎理解
- 実際のプロジェクトでの型定義経験

---

## ⏰ 詳細タイムテーブル

| 時間         | 内容                           | 講師の役割           | 学習者の活動   | 成果物     |
| ------------ | ------------------------------ | -------------------- | -------------- | ---------- |
| **0-10分**   | 全体概要・目標設定             | 説明・質疑応答       | 聞く・質問     | 理解確認   |
| **10-30分**  | ユーティリティ型基本概念       | 要点解説・補足       | 個人学習・確認 | 知識整理   |
| **30-60分**  | 基本ユーティリティ型実践       | 実演・個別サポート   | ハンズオン     | 基本コード |
| **60-80分**  | 練習問題1-2                    | 巡回サポート・ヒント | 個人作業       | 練習成果   |
| **80-90分**  | 振り返り・次回予告             | まとめ・予告         | 質問・確認     | 学習計画   |

---

## 📚 学習内容

### Section 1: ユーティリティ型基本概念

> 📚 **関連資料**: [専門用語集 - ユーティリティ型関連用語](./Step06_補足_専門用語集.md#ユーティリティ型utility-types) | [実践コード例 - 基本から始める段階的学習](./Step06_補足_実践コード例.md#基本から始める段階的学習)

#### 🔍 ユーティリティ型の実践的価値

**💡 なぜユーティリティ型が重要なのか**

ユーティリティ型は、既存の型から新しい型を効率的に生成するTypeScriptの強力な機能です。型変換による開発効率の向上、実際のプロジェクトでの型安全性確保、コード重複の削減と保守性向上を実現します。特にWebアプリケーション開発において、フォーム処理、API設計、状態管理での型変換は必須のスキルとなります。

**🎯 どういう場面で使うのか**

- **フォーム処理**: 部分更新や段階的な入力での型安全性確保
- **API設計**: リクエスト・レスポンス型の柔軟な変換
- **状態管理**: Redux、Zustandでの型安全な状態管理
- **設定管理**: 環境別設定や動的設定での型管理
- **データ変換**: 外部データの内部型への安全な変換

### Section 2: 基本ユーティリティ型実践

> 📚 **関連資料**: [実践コード例 - ユーティリティ型の実践](./Step06_補足_実践コード例.md#ユーティリティ型の実践) | [専門用語集 - 型変換](./Step06_補足_専門用語集.md#型変換)

#### 1. Partial<T> - フォーム処理での部分更新

> 💡 **詳細解説**: Partial型の詳細と実践的な活用パターンは [Step06_補足_専門用語集.md#partial型partial-type](./Step06_補足_専門用語集.md#partial型partial-type) を見てね 🐰

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  age: number;
}

type PartialUser = Partial<User>;
// { id?: number; name?: string; email?: string; age?: number; }

function updateUser(id: number, updates: Partial<User>): User {
  const existingUser = getUserById(id);
  return { ...existingUser, ...updates };
}

// 実際のフォーム処理での活用
interface UserForm {
  personalInfo: Partial<Pick<User, "name" | "age">>;
  contactInfo: Partial<Pick<User, "email">>;
  isValid: boolean;
}

class FormManager<T> {
  private data: Partial<T> = {};

  updateField<K extends keyof T>(field: K, value: T[K]): void {
    this.data[field] = value;
  }

  getPartialData(): Partial<T> {
    return { ...this.data };
  }

  isComplete(): this is { data: T } {
    // 実際の実装では全フィールドの存在をチェック
    return Object.keys(this.data).length > 0;
  }
}

// 使用例
const userForm = new FormManager<User>();
userForm.updateField("name", "Alice");
userForm.updateField("email", "alice@example.com");
```

**📝 型変換の詳細解説**

- `Partial<T>` は全てのプロパティを `T[K] | undefined` に変換
- フォームの段階的入力や部分更新で威力を発揮
- 型安全性を保ちながら柔軟な更新処理を実現

#### 2. Required<T> - 全プロパティを必須に

> 💡 **詳細解説**: Required型の詳細と実践的な活用パターンは [Step06_補足_専門用語集.md#required型required-type](./Step06_補足_専門用語集.md#required型required-type) を見てね 🐰

```typescript
interface Config {
  apiUrl?: string;
  timeout?: number;
  retries?: number;
}

type RequiredConfig = Required<Config>;
// { apiUrl: string; timeout: number; retries: number; }

function initializeApp(config: RequiredConfig): void {
  // 全ての設定が必須となり、undefinedチェックが不要
  console.log(`API URL: ${config.apiUrl}`);
  console.log(`Timeout: ${config.timeout}ms`);
  console.log(`Retries: ${config.retries}`);
}
```

#### 3. Pick<T, K> - API設計での特定プロパティ選択

> 💡 **詳細解説**: Pick型の詳細と実践的な活用パターンは [Step06_補足_専門用語集.md#pick型pick-type](./Step06_補足_専門用語集.md#pick型pick-type) を見てね 🐰

```typescript
type UserSummary = Pick<User, "id" | "name">;
// { id: number; name: string; }

type UserContact = Pick<User, "name" | "email">;
// { name: string; email: string; }

// 実際のAPI設計での活用
interface FullProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  inventory: {
    stock: number;
    reserved: number;
    available: number;
  };
  metadata: {
    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
  };
  internalNotes: string;
}

// 公開API用の型（内部情報を除外）
type PublicProduct = Pick<
  FullProduct,
  "id" | "name" | "description" | "price" | "category"
>;

// 商品一覧表示用の型
type ProductListItem = Pick<FullProduct, "id" | "name" | "price" | "category">;
```

#### 4. Omit<T, K> - 型安全なデータ変換での除外

> 💡 **詳細解説**: Omit型の詳細と実践的な活用パターンは [Step06_補足_専門用語集.md#omit型omit-type](./Step06_補足_専門用語集.md#omit型omit-type) を見てね 🐰

```typescript
type CreateUserRequest = Omit<User, "id">;
// { name: string; email: string; age: number; }

type PublicUser = Omit<User, "email">;
// { id: number; name: string; age: number; }

// 実際のデータ変換での活用
interface DatabaseUser {
  id: string;
  email: string;
  passwordHash: string;
  salt: string;
  name: string;
  age: number;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt: Date | null;
  isActive: boolean;
  role: "admin" | "user" | "moderator";
}

// 認証レスポンス用（機密情報を除外）
type AuthUser = Omit<DatabaseUser, "passwordHash" | "salt">;

// ユーザー作成リクエスト用（自動生成フィールドを除外）
type CreateUserRequest = Omit<
  DatabaseUser,
  "id" | "createdAt" | "updatedAt" | "lastLoginAt"
>;
```

#### 5. Record<K, T> - キーと値の型を指定

> 💡 **詳細解説**: Record型の詳細と実践的な活用パターンは [Step06_補足_専門用語集.md#record型record-type](./Step06_補足_専門用語集.md#record型record-type) を見てね 🐰

```typescript
type UserRoles = "admin" | "editor" | "viewer";
type Permissions = Record<UserRoles, string[]>;
// { admin: string[]; editor: string[]; viewer: string[]; }

const permissions: Permissions = {
  admin: ["read", "write", "delete"],
  editor: ["read", "write"],
  viewer: ["read"],
};

// 設定管理での活用
type Environment = "development" | "staging" | "production";
type EnvConfig = Record<Environment, {
  apiUrl: string;
  debugMode: boolean;
}>;

const envConfigs: EnvConfig = {
  development: {
    apiUrl: "http://localhost:3000",
    debugMode: true,
  },
  staging: {
    apiUrl: "https://staging-api.example.com",
    debugMode: false,
  },
  production: {
    apiUrl: "https://api.example.com",
    debugMode: false,
  },
};
```

#### 6. その他の基本ユーティリティ型

```typescript
// Exclude<T, U> - ユニオン型から特定の型を除外
type AllColors = "red" | "green" | "blue" | "yellow";
type PrimaryColors = Exclude<AllColors, "yellow">;
// 'red' | 'green' | 'blue'

// Extract<T, U> - ユニオン型から特定の型を抽出
type StringOrNumber = string | number | boolean;
type OnlyStringOrNumber = Extract<StringOrNumber, string | number>;
// string | number

// NonNullable<T> - null/undefined を除外
type MaybeString = string | null | undefined;
type DefiniteString = NonNullable<MaybeString>;
// string
```

### Section 3: 関数関連ユーティリティ型

> 📚 **関連資料**: [専門用語集 - 関数関連ユーティリティ型](./Step06_補足_専門用語集.md#関数関連ユーティリティ型function-utility-types)

#### 関数の型情報を活用する

```typescript
// ReturnType<T> - 関数の戻り値型を取得
function getUser(): { id: number; name: string } {
  return { id: 1, name: "Alice" };
}

type UserType = ReturnType<typeof getUser>;
// { id: number; name: string }

// Parameters<T> - 関数のパラメータ型を取得
function createUser(name: string, age: number, email: string): User {
  return { id: Date.now(), name, age, email };
}

type CreateUserParams = Parameters<typeof createUser>;
// [string, number, string]

// 実際の活用例
function processApiCall<T extends (...args: any[]) => any>(
  fn: T,
  ...args: Parameters<T>
): Promise<ReturnType<T>> {
  return new Promise((resolve) => {
    const result = fn(...args);
    resolve(result);
  });
}
```

---

## 🎯 練習問題

> 📚 **サポート資料**: [実践コード例 - ユーティリティ型の練習](./Step06_補足_実践コード例.md#ユーティリティ型の練習) | [トラブルシューティング](./Step06_補足_トラブルシューティング.md#ユーティリティ型エラー)

### 練習問題 1: フォーム型変換（15分）

以下のユーザー情報インターフェースを使って、フォーム処理用の型を作成してください。

```typescript
interface UserProfile {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  birthDate: Date;
  phoneNumber: string;
  address: {
    street: string;
    city: string;
    zipCode: string;
    country: string;
  };
  preferences: {
    newsletter: boolean;
    notifications: boolean;
    theme: "light" | "dark";
  };
}

// TODO: 以下の型を実装してください
// 1. ユーザー作成用の型（idを除外）
type CreateUserProfile = /* ここに実装 */;

// 2. プロフィール更新用の型（idと作成時刻を除外し、他は部分的）
type UpdateUserProfile = /* ここに実装 */;

// 3. 公開プロフィール用の型（個人情報を除外）
type PublicUserProfile = /* ここに実装 */;

// 4. 連絡先情報のみの型
type ContactInfo = /* ここに実装 */;
```

### 練習問題 2: API レスポンス型設計（15分）

以下のAPIレスポンス用の型を設計してください。

```typescript
interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  authorId: string;
  authorName: string;
  publishedAt: Date;
  updatedAt: Date;
  tags: string[];
  category: string;
  isPublished: boolean;
  viewCount: number;
  likeCount: number;
}

// TODO: 以下の型を実装してください
// 1. 記事一覧表示用（最小限の情報のみ）
type BlogPostSummary = /* ここに実装 */;

// 2. 記事作成リクエスト用
type CreateBlogPostRequest = /* ここに実装 */;

// 3. 記事更新リクエスト用（部分更新可能）
type UpdateBlogPostRequest = /* ここに実装 */;

// 4. 作者情報のみの型
type AuthorInfo = /* ここに実装 */;
```

---

## 👨‍🏫 学習ポイント

### 🤔 よくある質問

**Q: PartialとOptionalプロパティの違いは何ですか？**
A: Partialは既存の型の全プロパティをオプショナルにする型変換ですが、Optionalプロパティ（?:）は型定義時に直接指定するものです。Partialは既存の型を再利用して柔軟性を提供します。

**Q: PickとOmitはどちらを使うべきですか？**
A: 必要なプロパティが少ない場合はPick、除外したいプロパティが少ない場合はOmitを使います。可読性と保守性を考慮して選択しましょう。

**Q: Recordはいつ使うのですか？**
A: キーが決まっているオブジェクトの型を定義する際に使います。設定オブジェクト、マッピング、辞書的なデータ構造で威力を発揮します。

---

**📌 重要**: Session1はユーティリティ型の基礎固めです。焦らず確実に基本概念を理解しましょう。

**🌟 次回（Session2）は、より実践的なカスタムユーティリティ型の作成と複合的な型操作に挑戦します！**