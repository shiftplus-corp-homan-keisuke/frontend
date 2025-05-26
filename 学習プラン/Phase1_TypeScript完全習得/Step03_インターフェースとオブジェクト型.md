# Step 3: インターフェースとオブジェクト型

> 💡 **補足資料**: 詳細な解説は以下の補足資料を見てね 🐰
>
> - 📖 [専門用語集](./Step03_補足_専門用語集.md) - インターフェース・オブジェクト型設計の重要な概念と用語の詳細解説
> - 💻 [実践コード例](./Step03_補足_実践コード例.md) - 段階的な学習用コード集
> - 🚨 [トラブルシューティング](./Step03_補足_トラブルシューティング.md) - よくあるエラーと解決方法
> - 📚 [参考リソース](./Step03_補足_参考リソース.md) - 学習に役立つリンク集

## 📅 学習期間・目標

**期間**: Step 3  
**総学習時間**: 4 時間  
**学習スタイル**: 理論 20% + 実践コード 50% + 演習 30%

### 🎯 Step 3 到達目標

- [ ] インターフェースの設計と活用の完全理解
- [ ] 型エイリアスとの使い分けの習得
- [ ] 継承とコンポジションの実践的活用
- [ ] データモデル設計の基礎確立
- [ ] オブジェクト指向設計の型安全な実装

## 📚 理論学習内容

### Section 1: インターフェースの基礎と設計

#### 🔍 インターフェースの基本概念と他言語との比較

##### 1. 基本的なインターフェース定義

**💡 なぜインターフェース設計が重要なのか**

インターフェースは、TypeScript における「契約」の概念です。オブジェクトがどのような形状（プロパティとメソッド）を持つべきかを定義することで、以下の重要な価値を提供します：

- **型安全性の確保**: コンパイル時にオブジェクトの構造をチェックし、ランタイムエラーを防止
- **コードの可読性向上**: オブジェクトの期待される形状が明確になり、他の開発者が理解しやすい
- **チーム開発での契約**: API 設計やコンポーネント間の連携で、明確な仕様を共有
- **リファクタリングの安全性**: 構造変更時に影響範囲を正確に把握し、安全な変更が可能

**🎯 どういう場面で使うのか**

- **API レスポンスの型定義**: サーバーから受け取るデータの構造を明確化
- **コンポーネントの Props 定義**: React 等でのコンポーネント間のデータ受け渡し
- **データベースエンティティ**: データモデルの構造定義
- **設定オブジェクト**: アプリケーション設定やライブラリオプションの型定義
- **サービス層の契約**: ビジネスロジック層でのインターフェース定義

```typescript
// Java: interface User { String getName(); }
// C#: interface IUser { string Name { get; } }
// TypeScript: より柔軟な構造的型付け
// 💡 詳細解説: インターフェース → Step03_補足_専門用語集.md#インターフェースinterface
// 💡 詳細解説: 構造的型付け → Step03_補足_専門用語集.md#構造的型付けstructural-typing

interface User {
  id: number;
  name: string;
  email: string;
  createdAt: Date;
}

// 実際のAPI設計での活用例
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: Date;
}

// ユーザー情報取得APIのレスポンス型
type UserApiResponse = ApiResponse<User>;
```

**📝 設計の詳細解説**

- **構造的型付け**: TypeScript は名前ではなく構造で型の互換性を判断します。これにより、同じ形状を持つオブジェクトは自動的に互換性があると見なされます
- **プロパティの順序**: インターフェース内のプロパティの順序は型チェックに影響しません
- **拡張性**: 後から新しいプロパティを追加する際の影響範囲を最小限に抑える設計が重要

**⚠️ よくある設計ミスと注意点**

```typescript
// ❌ 間違い: 過度に詳細なインターフェース
interface OverDetailedUser {
  id: number;
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  // ... 50個のプロパティ
}

// ✅ 正解: 適切に分割されたインターフェース
interface User {
  id: number;
  name: UserName;
  email: string;
  address?: Address;
  profile?: UserProfile;
}

interface UserName {
  first: string;
  middle?: string;
  last: string;
}

interface Address {
  street1: string;
  street2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}
```

**🚀 実際のプロジェクトでの活用例**

```typescript
// ECサイトでの商品管理システム
interface Product {
  id: string;
  name: string;
  price: number;
  category: Category;
  inventory: Inventory;
}

interface Category {
  id: string;
  name: string;
  parentId?: string;
}

interface Inventory {
  quantity: number;
  reserved: number;
  available: number;
}

// 商品検索APIでの活用
async function searchProducts(query: string): Promise<Product[]> {
  const response = await fetch(`/api/products/search?q=${query}`);
  const data: ApiResponse<Product[]> = await response.json();

  if (data.success) {
    return data.data;
  }
  throw new Error(data.message || "Search failed");
}
```

##### 2. オプショナルプロパティ

**💡 なぜオプショナルプロパティが重要なのか**

オプショナルプロパティ（`?`）は、実際のアプリケーション開発で頻繁に遭遇する「必須ではないデータ」を型安全に扱うための仕組みです。これにより以下の利点があります：

- **柔軟なデータ構造**: 段階的なデータ入力や部分的な更新に対応
- **API 設計の現実性**: 実際の API では全てのフィールドが常に存在するとは限らない
- **ユーザビリティの向上**: フォーム入力で必須項目と任意項目を明確に区別
- **後方互換性**: 新しいプロパティを追加する際の既存コードへの影響を最小化

**🎯 どういう場面で使うのか**

- **ユーザー登録フォーム**: 必須項目（名前、メール）と任意項目（電話番号、住所）の区別
- **設定オブジェクト**: デフォルト値を持つ設定項目
- **API レスポンス**: サーバーサイドで条件によって含まれないフィールド
- **段階的データ入力**: ウィザード形式での入力プロセス
- **プロフィール情報**: 公開/非公開を選択できる項目

```typescript
// 💡 詳細解説: オプショナルプロパティ → Step02_補足_専門用語集.md#オプショナルプロパティoptional-properties
interface CreateUserRequest {
  name: string;
  email: string;
  age?: number; // オプショナル
  profile?: {
    bio?: string;
    avatar?: string;
    socialLinks?: {
      twitter?: string;
      github?: string;
      linkedin?: string;
    };
  };
}

// 実際のフォーム処理での活用
function createUser(userData: CreateUserRequest): Promise<User> {
  // 必須フィールドの検証は型システムが保証
  const user: User = {
    id: generateId(),
    name: userData.name,
    email: userData.email,
    createdAt: new Date(),
    // オプショナルフィールドは安全にアクセス
    age: userData.age, // number | undefined
    profile: userData.profile
      ? {
          bio: userData.profile.bio || "",
          avatar: userData.profile.avatar,
          socialLinks: userData.profile.socialLinks || {},
        }
      : undefined,
  };

  return saveUser(user);
}
```

**📝 設計の詳細解説**

- **オプショナル vs undefined**: `property?: type` は `property: type | undefined` と同等ですが、プロパティ自体が存在しない場合も許可
- **デフォルト値の設計**: オプショナルプロパティには適切なデフォルト値の戦略が必要
- **ネストしたオプショナル**: 深い階層でのオプショナルプロパティは慎重に設計

**⚠️ よくある設計ミスと注意点**

```typescript
// ❌ 間違い: オプショナルプロパティの不適切な使用
interface BadUserProfile {
  name?: string; // 名前は必須であるべき
  email?: string; // メールも必須であるべき
  id?: number; // IDは絶対に必須
}

// ✅ 正解: 適切なオプショナルプロパティの使用
interface GoodUserProfile {
  id: number; // 必須
  name: string; // 必須
  email: string; // 必須
  avatar?: string; // 任意
  bio?: string; // 任意
  lastLoginAt?: Date; // 任意（初回ログイン時は存在しない）
}

// ❌ 間違い: オプショナルチェーンを使わないアクセス
function displayUser(user: GoodUserProfile) {
  // return user.bio.length; // エラー！bioはundefinedの可能性
}

// ✅ 正解: 安全なオプショナルプロパティアクセス
function displayUser(user: GoodUserProfile) {
  return user.bio?.length || 0; // オプショナルチェーンを使用
}
```

**🚀 実際のプロジェクトでの活用例**

```typescript
// ブログ投稿システムでの記事作成
interface CreateArticleRequest {
  title: string;
  content: string;
  authorId: string;
  categoryId: string;
  tags?: string[];
  featuredImage?: string;
  publishedAt?: Date; // 下書きの場合は未設定
  seoMetadata?: {
    description?: string;
    keywords?: string[];
    ogImage?: string;
  };
}

interface Article extends CreateArticleRequest {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  viewCount: number;
  status: "draft" | "published" | "archived";
}

// 記事作成フォームでの使用
function createArticle(data: CreateArticleRequest): Promise<Article> {
  const article: Article = {
    ...data,
    id: generateId(),
    createdAt: new Date(),
    updatedAt: new Date(),
    viewCount: 0,
    status: data.publishedAt ? "published" : "draft",
    // オプショナルフィールドのデフォルト値設定
    tags: data.tags || [],
    seoMetadata: data.seoMetadata || {},
  };

  return saveArticle(article);
}
```

##### 3. 読み取り専用プロパティ

**💡 なぜ読み取り専用プロパティが重要なのか**

読み取り専用プロパティ（`readonly`）は、データの不変性を保証し、意図しない変更を防ぐための重要な仕組みです。これにより以下の価値を提供します：

- **データ整合性の保証**: 重要なデータ（ID、作成日時など）の意図しない変更を防止
- **バグの予防**: 読み取り専用であるべきプロパティの変更によるバグを防止
- **設計意図の明確化**: どのプロパティが変更可能で、どれが不変かを明確に示す
- **関数型プログラミングの支援**: イミュータブルなデータ構造の実現

**🎯 どういう場面で使うのか**

- **エンティティの ID**: データベースの主キーなど、変更されるべきでない識別子
- **タイムスタンプ**: 作成日時、更新日時など、履歴として保持すべき情報
- **設定値**: アプリケーション起動時に決定され、実行中は変更されない設定
- **計算結果**: 他のプロパティから算出される値で、直接変更されるべきでないもの
- **外部システムからの情報**: 外部 API から取得した、変更権限のないデータ

```typescript
// 💡 詳細解説: 読み取り専用型 → Step02_補足_専門用語集.md#読み取り専用型readonly-types
interface ReadonlyUser {
  readonly id: number;
  readonly createdAt: Date;
  name: string; // 変更可能
  email: string; // 変更可能
}

// 実際のエンティティ設計での活用
interface Order {
  readonly id: string;
  readonly orderNumber: string;
  readonly customerId: string;
  readonly createdAt: Date;
  readonly totalAmount: number; // 注文後は変更不可

  // 変更可能なプロパティ
  status: "pending" | "confirmed" | "shipped" | "delivered";
  shippingAddress: Address;
  notes?: string;
}

// 設定オブジェクトでの活用
interface AppConfig {
  readonly apiBaseUrl: string;
  readonly version: string;
  readonly environment: "development" | "staging" | "production";
  readonly features: {
    readonly enableAnalytics: boolean;
    readonly maxUploadSize: number;
  };
}
```

**📝 設計の詳細解説**

- **readonly の適用範囲**: プロパティレベルでの読み取り専用指定
- **深い読み取り専用**: ネストしたオブジェクトの読み取り専用化には `Readonly<T>` ユーティリティ型を使用
- **配列の読み取り専用**: `readonly T[]` または `ReadonlyArray<T>` を使用

**⚠️ よくある設計ミスと注意点**

```typescript
// ❌ 間違い: 変更されるべきプロパティをreadonlyにする
interface BadUser {
  readonly id: number;
  readonly name: string; // 名前は変更される可能性がある
  readonly email: string; // メールアドレスも変更される可能性がある
}

// ✅ 正解: 適切なreadonlyの使用
interface GoodUser {
  readonly id: number; // IDは絶対に変更されない
  readonly createdAt: Date; // 作成日時は変更されない
  name: string; // 名前は変更可能
  email: string; // メールアドレスは変更可能
  updatedAt: Date; // 更新日時は変更される
}

// ❌ 間違い: 浅いreadonlyの問題
interface ShallowReadonly {
  readonly config: {
    apiUrl: string; // これは変更可能
    timeout: number; // これも変更可能
  };
}

// ✅ 正解: 深いreadonlyの実現
interface DeepReadonly {
  readonly config: {
    readonly apiUrl: string;
    readonly timeout: number;
  };
}
```

**🚀 実際のプロジェクトでの活用例**

```typescript
// イベント管理システムでの活用
interface Event {
  readonly id: string;
  readonly createdAt: Date;
  readonly createdBy: string;
  readonly eventType: "conference" | "workshop" | "meetup";

  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  location: string;
  maxAttendees: number;
  status: "draft" | "published" | "cancelled";
}

// 金融取引システムでの活用
interface Transaction {
  readonly id: string;
  readonly accountId: string;
  readonly amount: number; // 取引金額は変更不可
  readonly currency: string;
  readonly timestamp: Date;
  readonly type: "deposit" | "withdrawal" | "transfer";

  description?: string; // 説明は後から変更可能
  status: "pending" | "completed" | "failed";
}

// 読み取り専用プロパティを持つオブジェクトの更新
function updateUser(
  user: GoodUser,
  updates: Partial<Omit<GoodUser, "id" | "createdAt">>
): GoodUser {
  return {
    ...user,
    ...updates,
    updatedAt: new Date(),
    // id と createdAt は自動的に保持される（readonly）
  };
}
```

##### 4. インデックスシグネチャ

**💡 なぜインデックスシグネチャが重要なのか**

インデックスシグネチャは、事前に全てのプロパティ名を知ることができない動的なオブジェクト構造を型安全に扱うための仕組みです。これにより以下の価値を提供します：

- **動的データの型安全性**: 実行時に決まるプロパティ名でも型チェックが可能
- **設定オブジェクトの柔軟性**: ユーザー定義の設定項目を型安全に扱える
- **辞書・マップ構造の実現**: キー・バリューペアのデータ構造を型安全に実装
- **API レスポンスの対応**: 動的なフィールドを含む API レスポンスの処理

**🎯 どういう場面で使うのか**

- **多言語対応**: 言語コードをキーとした翻訳データ
- **ユーザー設定**: ユーザーが自由に定義できる設定項目
- **動的フォーム**: フォームフィールドが実行時に決まるシステム
- **キャッシュシステム**: 任意のキーでデータを保存するキャッシュ
- **メタデータ**: オブジェクトに付加される任意の属性情報

```typescript
// 💡 詳細解説: インデックスシグネチャ → Step02_補足_専門用語集.md#インデックスシグネチャindex-signatures
interface StringDictionary {
  [key: string]: string;
}

interface NumberDictionary {
  [key: string]: number;
  length: number; // 明示的プロパティも可能
}

// 実際の多言語対応システムでの活用
interface Translations {
  [languageCode: string]: {
    [key: string]: string;
  };
}

const translations: Translations = {
  en: {
    welcome: "Welcome",
    goodbye: "Goodbye",
  },
  ja: {
    welcome: "ようこそ",
    goodbye: "さようなら",
  },
  fr: {
    welcome: "Bienvenue",
    goodbye: "Au revoir",
  },
};

// ユーザー設定システムでの活用
interface UserPreferences {
  // 固定の設定項目
  theme: "light" | "dark";
  language: string;

  // 動的な設定項目
  [customSetting: string]: string | number | boolean;
}

const userPrefs: UserPreferences = {
  theme: "dark",
  language: "ja",
  // ユーザーが自由に追加できる設定
  "notification.email": true,
  "dashboard.refreshInterval": 30,
  "editor.fontSize": 14,
};
```

**📝 設計の詳細解説**

- **キーの型制約**: `string`、`number`、`symbol` のみがインデックスキーとして使用可能
- **値の型統一**: インデックスシグネチャの値は同じ型である必要がある
- **明示的プロパティとの併用**: 特定のプロパティは明示的に定義し、その他を動的に扱うことが可能

**⚠️ よくある設計ミスと注意点**

```typescript
// ❌ 間違い: 過度に緩いインデックスシグネチャ
interface BadConfig {
  [key: string]: any; // any型は型安全性を失う
}

// ✅ 正解: 適切に制約されたインデックスシグネチャ
interface GoodConfig {
  // 固定プロパティ
  version: string;
  environment: "development" | "production";

  // 動的プロパティは適切な型で制約
  [key: string]: string | number | boolean;
}

// ❌ 間違い: 型の不整合
interface InconsistentTypes {
  length: number;
  [key: string]: string; // エラー！lengthがnumberなのにstringを要求
}

// ✅ 正解: 型の整合性を保つ
interface ConsistentTypes {
  length: number;
  [key: string]: string | number; // lengthの型も含む
}
```

**🚀 実際のプロジェクトでの活用例**

```typescript
// APIレスポンスのメタデータ処理
interface ApiResponseWithMeta<T> {
  data: T;
  success: boolean;
  message?: string;

  // 動的なメタデータ
  [metaKey: string]: unknown;
}

// フォームバリデーションシステム
interface ValidationErrors {
  [fieldName: string]: string[];
}

interface FormData {
  [fieldName: string]: string | number | boolean | File;
}

class FormValidator {
  validate(data: FormData, rules: ValidationRules): ValidationErrors {
    const errors: ValidationErrors = {};

    for (const [fieldName, value] of Object.entries(data)) {
      const fieldRules = rules[fieldName];
      if (fieldRules) {
        const fieldErrors = this.validateField(value, fieldRules);
        if (fieldErrors.length > 0) {
          errors[fieldName] = fieldErrors;
        }
      }
    }

    return errors;
  }

  private validateField(value: unknown, rules: FieldRule[]): string[] {
    // バリデーションロジック
    return [];
  }
}

// 設定管理システム
interface AppSettings {
  // 必須設定
  appName: string;
  version: string;

  // オプション設定
  debug?: boolean;

  // 動的設定（プラグインやモジュール固有）
  [moduleConfig: string]: unknown;
}

function loadSettings(): AppSettings {
  const baseSettings: AppSettings = {
    appName: "MyApp",
    version: "1.0.0",
  };

  // 環境変数から動的設定を読み込み
  for (const [key, value] of Object.entries(process.env)) {
    if (key.startsWith("APP_")) {
      const configKey = key.toLowerCase().replace("app_", "");
      baseSettings[configKey] = value;
    }
  }

  return baseSettings;
}
```

##### 5. 関数型プロパティとメソッドシグネチャ

**💡 なぜ関数型プロパティとメソッドシグネチャが重要なのか**

インターフェースで関数を定義する方法には 2 つのアプローチがあり、それぞれ異なる特性と用途があります。適切な選択により以下の価値を提供します：

- **設計意図の明確化**: 関数の役割と使用方法を型レベルで表現
- **型安全な関数呼び出し**: 引数と戻り値の型チェック
- **オーバーロードの対応**: 複数のシグネチャを持つ関数の定義
- **コールバック関数の型定義**: 高階関数やイベントハンドラーの型安全性

**🎯 どういう場面で使うのか**

- **サービス層の定義**: ビジネスロジックを提供するサービスクラスのインターフェース
- **イベントハンドラー**: ユーザーインタラクションやシステムイベントの処理
- **コールバック関数**: 非同期処理や高階関数での関数引数
- **ユーティリティ関数**: 計算や変換を行う純粋関数の集合
- **API クライアント**: 外部サービスとの通信を行う関数群

```typescript
interface Calculator {
  add: (a: number, b: number) => number;
  subtract: (a: number, b: number) => number;
  multiply: (a: number, b: number) => number;
  divide: (a: number, b: number) => number;
}

// メソッドシグネチャ（2つの書き方）
interface UserService {
  // 関数型プロパティ
  getUser: (id: number) => Promise<User>;

  // メソッドシグネチャ
  createUser(data: CreateUserRequest): Promise<User>;
  updateUser(id: number, data: Partial<User>): Promise<User>;
  deleteUser(id: number): Promise<boolean>;
}

// 実際のサービス実装での活用
class UserServiceImpl implements UserService {
  constructor(private apiClient: ApiClient) {}

  getUser = async (id: number): Promise<User> => {
    const response = await this.apiClient.get<User>(`/users/${id}`);
    return response.data;
  };

  async createUser(data: CreateUserRequest): Promise<User> {
    const response = await this.apiClient.post<CreateUserRequest, User>(
      "/users",
      data
    );
    return response.data;
  }

  async updateUser(id: number, data: Partial<User>): Promise<User> {
    const response = await this.apiClient.put<Partial<User>, User>(
      `/users/${id}`,
      data
    );
    return response.data;
  }

  async deleteUser(id: number): Promise<boolean> {
    const response = await this.apiClient.delete(`/users/${id}`);
    return response.success;
  }
}
```

**📝 設計の詳細解説**

- **関数型プロパティ**: `property: (args) => returnType` 形式。アロー関数として実装される
- **メソッドシグネチャ**: `methodName(args): returnType` 形式。通常のメソッドとして実装される
- **this バインディング**: 関数型プロパティはアロー関数なので `this` が固定される
- **オーバーロード**: メソッドシグネチャの方がオーバーロードに適している

**⚠️ よくある設計ミスと注意点**

```typescript
// ❌ 間違い: 一貫性のない関数定義
interface InconsistentService {
  getData: (id: string) => Promise<Data>; // 関数型プロパティ
  processData(data: Data): void; // メソッドシグネチャ
  saveData: (data: Data) => Promise<void>; // 関数型プロパティ
  validateData(data: Data): boolean; // メソッドシグネチャ
}

// ✅ 正解: 一貫した関数定義
interface ConsistentService {
  // 全て関数型プロパティで統一
  getData: (id: string) => Promise<Data>;
  processData: (data: Data) => void;
  saveData: (data: Data) => Promise<void>;
  validateData: (data: Data) => boolean;
}

// または、全てメソッドシグネチャで統一
interface ConsistentServiceAlt {
  getData(id: string): Promise<Data>;
  processData(data: Data): void;
  saveData(data: Data): Promise<void>;
  validateData(data: Data): boolean;
}

// ❌ 間違い: thisバインディングの問題
class BadEventHandler implements EventHandlerInterface {
  private count = 0;

  // 関数型プロパティ - thisが正しくバインドされる
  onClick = (event: MouseEvent) => {
    this.count++; // OK
  };

  // 通常のメソッド - thisバインディングに注意が必要
  onSubmit(event: SubmitEvent) {
    this.count++; // コンテキストによってはthisがundefinedになる可能性
  }
}
```

**🚀 実際のプロジェクトでの活用例**

```typescript
// イベント管理システムでの活用
interface EventManager {
  // イベントリスナー管理（関数型プロパティ）
  addEventListener: <T>(event: string, handler: (data: T) => void) => void;
  removeEventListener: (event: string, handler: Function) => void;

  // イベント発火（メソッドシグネチャ）
  emit<T>(event: string, data: T): void;
  once<T>(event: string, handler: (data: T) => void): void;
}

// データ処理パイプラインでの活用
interface DataProcessor<T, U> {
  // 変換関数（関数型プロパティ）
  transform: (data: T) => U;
  validate: (data: T) => boolean;

  // 処理メソッド（メソッドシグネチャ）
  process(input: T[]): Promise<U[]>;
  processStream(input: AsyncIterable<T>): AsyncIterable<U>;
}

class UserDataProcessor implements DataProcessor<RawUserData, User> {
  transform = (rawData: RawUserData): User => {
    return {
      id: rawData.user_id,
      name: `${rawData.first_name} ${rawData.last_name}`,
      email: rawData.email_address,
      createdAt: new Date(rawData.created_timestamp),
    };
  };

  validate = (rawData: RawUserData): boolean => {
    return !!(rawData.user_id && rawData.email_address);
  };

  async process(input: RawUserData[]): Promise<User[]> {
    return input.filter(this.validate).map(this.transform);
  }

  async *processStream(input: AsyncIterable<RawUserData>): AsyncIterable<User> {
    for await (const rawData of input) {
      if (this.validate(rawData)) {
        yield this.transform(rawData);
      }
    }
  }
}

// API クライアントでの活用
interface RestApiClient {
  // HTTP メソッド（関数型プロパティ）
  get: <T>(url: string, config?: RequestConfig) => Promise<ApiResponse<T>>;
  post: <T, U>(
    url: string,
    data: T,
    config?: RequestConfig
  ) => Promise<ApiResponse<U>>;
  put: <T, U>(
    url: string,
    data: T,
    config?: RequestConfig
  ) => Promise<ApiResponse<U>>;
  delete: <T>(url: string, config?: RequestConfig) => Promise<ApiResponse<T>>;

  // 設定管理（メソッドシグネチャ）
  setBaseURL(url: string): void;
  setDefaultHeaders(headers: Record<string, string>): void;
  addInterceptor(interceptor: RequestInterceptor): void;
}
```

#### 🎯 インターフェースの継承と拡張

##### 1. 基本的な継承

**💡 なぜインターフェース継承が重要なのか**

インターフェース継承は、共通の構造を持つオブジェクト間の関係を型レベルで表現し、コードの再利用性と保守性を大幅に向上させます。これにより以下の価値を提供します：

- **コードの再利用**: 共通のプロパティやメソッドを一度定義し、複数のインターフェースで活用
- **階層構造の表現**: 現実世界の「is-a」関係を型システムで正確に表現
- **保守性の向上**: 基底インターフェースの変更が派生インターフェースに自動的に反映
- **設計の明確化**: オブジェクト間の関係性と責任範囲を明確に定義

**🎯 どういう場面で使うのか**

- **エンティティの階層**: ユーザー、管理者、ゲストなどの役割ベースの継承
- **UI コンポーネント**: 基本コンポーネントから特化したコンポーネントへの拡張
- **API レスポンス**: 共通のレスポンス構造から特定のエンドポイント用への拡張
- **データモデル**: 基本エンティティから特化したエンティティへの継承
- **設定オブジェクト**: 基本設定から環境固有設定への拡張

```typescript
interface Animal {
  name: string;
  age: number;
}

interface Dog extends Animal {
  breed: string;
  bark(): void;
}

interface Cat extends Animal {
  color: string;
  meow(): void;
}

// 実際のエンティティ設計での活用
interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

interface User extends BaseEntity {
  email: string;
  name: string;
  role: "user" | "admin" | "moderator";
}

interface Product extends BaseEntity {
  name: string;
  price: number;
  categoryId: string;
  inStock: boolean;
}

// UI コンポーネントでの活用
interface BaseComponentProps {
  className?: string;
  style?: React.CSSProperties;
  testId?: string;
}

interface ButtonProps extends BaseComponentProps {
  variant: "primary" | "secondary" | "danger";
  size: "small" | "medium" | "large";
  onClick: (event: MouseEvent) => void;
  disabled?: boolean;
}

interface InputProps extends BaseComponentProps {
  type: "text" | "email" | "password" | "number";
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
}
```

**📝 設計の詳細解説**

- **継承チェーン**: 複数レベルの継承が可能で、深い階層構造を表現できる
- **プロパティの追加**: 派生インターフェースは基底インターフェースのプロパティに加えて新しいプロパティを追加
- **型の互換性**: 派生インターフェースのオブジェクトは基底インターフェースとして使用可能

**⚠️ よくある設計ミスと注意点**

```typescript
// ❌ 間違い: 過度に深い継承階層
interface A {
  a: string;
}
interface B extends A {
  b: string;
}
interface C extends B {
  c: string;
}
interface D extends C {
  d: string;
}
interface E extends D {
  e: string;
} // 5レベルの継承は複雑すぎる

// ✅ 正解: 適切な継承の深さ（通常2-3レベル）
interface BaseUser {
  id: string;
  email: string;
  name: string;
}

interface AdminUser extends BaseUser {
  permissions: string[];
  lastAdminAction?: Date;
}

// ❌ 間違い: 関連性のない継承
interface Vehicle {
  wheels: number;
  engine: string;
}

interface Bird extends Vehicle {
  // 鳥は乗り物ではない
  wingspan: number;
  canFly: boolean;
}

// ✅ 正解: 論理的な継承関係
interface LivingBeing {
  name: string;
  age: number;
}

interface Bird extends LivingBeing {
  wingspan: number;
  canFly: boolean;
}
```

**🚀 実際のプロジェクトでの活用例**

```typescript
// ECサイトでの商品管理システム
interface BaseProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  createdAt: Date;
  updatedAt: Date;
}

interface PhysicalProduct extends BaseProduct {
  weight: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  shippingClass: "standard" | "heavy" | "fragile";
  inventory: {
    quantity: number;
    warehouse: string;
  };
}

interface DigitalProduct extends BaseProduct {
  downloadUrl: string;
  fileSize: number;
  format: string;
  licenseType: "single" | "multi" | "enterprise";
  expirationDate?: Date;
}

// ブログシステムでの記事管理
interface BaseContent {
  id: string;
  title: string;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
  status: "draft" | "published" | "archived";
}

interface BlogPost extends BaseContent {
  content: string;
  excerpt: string;
  tags: string[];
  categoryId: string;
  featuredImage?: string;
  seoMetadata: {
    description: string;
    keywords: string[];
  };
}

interface NewsArticle extends BaseContent {
  content: string;
  source: string;
  location?: string;
  urgency: "low" | "medium" | "high" | "breaking";
  relatedArticles: string[];
}
```

##### 2. 複数インターフェースの継承

```typescript
interface Flyable {
  fly(): void;
  altitude: number;
}

interface Swimmable {
  swim(): void;
  depth: number;
}

interface Duck extends Animal, Flyable, Swimmable {
  quack(): void;
}
```

##### 3. ジェネリックインターフェース

```typescript
interface Repository<T, K> {
  findById(id: K): Promise<T | null>;
  findAll(): Promise<T[]>;
  create(entity: Omit<T, "id">): Promise<T>;
  update(id: K, entity: Partial<T>): Promise<T>;
  delete(id: K): Promise<boolean>;
}

// 使用例
interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
}

class ProductRepository implements Repository<Product, string> {
  async findById(id: string): Promise<Product | null> {
    // 実装
    return null;
  }

  async findAll(): Promise<Product[]> {
    // 実装
    return [];
  }

  async create(entity: Omit<Product, "id">): Promise<Product> {
    // 実装
    return { id: "generated-id", ...entity };
  }

  async update(id: string, entity: Partial<Product>): Promise<Product> {
    // 実装
    throw new Error("Not implemented");
  }

  async delete(id: string): Promise<boolean> {
    // 実装
    return false;
  }
}
```

### Section 2: 型エイリアスとの使い分け

#### 🔧 type vs interface の詳細比較

##### 1. 基本的な違い

```typescript
// interface: 拡張可能、宣言マージ可能
interface UserInterface {
  name: string;
  age: number;
}

interface UserInterface {
  email: string; // 自動的にマージされる
}

// type: より柔軟、ユニオン型・交差型対応
type UserType = {
  name: string;
  age: number;
};
```

##### 2. ユニオン型（type のみ可能）

```typescript
type Status = "pending" | "approved" | "rejected";
type ID = string | number;
```

##### 3. 交差型（type が得意）

```typescript
type Timestamped = {
  createdAt: Date;
  updatedAt: Date;
};

type UserWithTimestamp = UserType & Timestamped;
```

##### 4. 使い分けのガイドライン

```typescript
// interface: オブジェクトの形状定義、継承が必要、ライブラリAPI
interface DatabaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

interface User extends DatabaseEntity {
  name: string;
  email: string;
}

// type: ユニオン型、計算された型、複雑な型操作
type UserRole = "admin" | "editor" | "viewer";
type UserPermissions = Record<UserRole, string[]>;
type UserWithRole = User & { role: UserRole };
```

### Section 3: 実践的なデータモデル設計

#### 🔧 ドメインモデルの設計

##### 1. 基本エンティティの設計

```typescript
// ECサイトのデータモデル例
namespace ECommerce {
  // 基本エンティティ
  interface BaseEntity {
    readonly id: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
  }
}
```

##### 2. 商品関連のモデル

```typescript
namespace ECommerce {
  // 商品関連
  interface Product extends BaseEntity {
    name: string;
    description: string;
    price: number;
    category: Category;
    inventory: Inventory;
    images: ProductImage[];
    tags: string[];
  }

  interface Category extends BaseEntity {
    name: string;
    slug: string;
    parentId?: string;
    children?: Category[];
  }

  interface Inventory {
    quantity: number;
    reserved: number;
    available: number;
    lowStockThreshold: number;
  }

  interface ProductImage {
    url: string;
    alt: string;
    isPrimary: boolean;
    order: number;
  }
}
```

##### 3. ユーザー関連のモデル

```typescript
namespace ECommerce {
  // ユーザー関連
  interface User extends BaseEntity {
    email: string;
    profile: UserProfile;
    addresses: Address[];
    preferences: UserPreferences;
  }

  interface UserProfile {
    firstName: string;
    lastName: string;
    phone?: string;
    dateOfBirth?: Date;
    avatar?: string;
  }

  interface Address {
    id: string;
    type: "shipping" | "billing";
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    isDefault: boolean;
  }
}
```

##### 4. 注文関連のモデル

```typescript
namespace ECommerce {
  // 注文関連
  interface Order extends BaseEntity {
    orderNumber: string;
    userId: string;
    items: OrderItem[];
    shipping: ShippingInfo;
    payment: PaymentInfo;
    status: OrderStatus;
    totals: OrderTotals;
  }

  interface OrderItem {
    productId: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    product?: Product; // 参照データ
  }

  interface OrderTotals {
    subtotal: number;
    tax: number;
    shipping: number;
    discount: number;
    total: number;
  }
}
```

##### 5. 型定義とステータス管理

```typescript
namespace ECommerce {
  type OrderStatus =
    | "pending"
    | "confirmed"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled";

  type PaymentMethod =
    | "credit_card"
    | "paypal"
    | "bank_transfer"
    | "cash_on_delivery";

  type PaymentStatus = "pending" | "completed" | "failed" | "refunded";
}
```

## 🎯 実践演習

### 演習 3-1: インターフェース設計マスター 🔰

```typescript
// ブログシステムのデータモデルを設計せよ
// 要件:
// - 記事（タイトル、内容、作成者、タグ、公開状態）
// - 作成者（名前、メール、プロフィール、ソーシャルリンク）
// - コメント（内容、作成者、返信機能）
// - カテゴリ（階層構造対応）

// 解答例
interface BaseEntity {
  readonly id: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

interface Author extends BaseEntity {
  name: string;
  email: string;
  bio?: string;
  avatar?: string;
  socialLinks: {
    twitter?: string;
    github?: string;
    website?: string;
  };
}

interface Category extends BaseEntity {
  name: string;
  slug: string;
  description?: string;
  parentId?: string;
  children?: Category[];
}

interface Tag {
  id: string;
  name: string;
  color?: string;
}

interface Article extends BaseEntity {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  featuredImage?: string;
  authorId: string;
  categoryId: string;
  tags: Tag[];
  status: "draft" | "published" | "archived";
  publishedAt?: Date;
  viewCount: number;

  // 関連データ（オプショナル）
  author?: Author;
  category?: Category;
  comments?: Comment[];
}

interface Comment extends BaseEntity {
  content: string;
  authorName: string;
  authorEmail: string;
  articleId: string;
  parentId?: string; // 返信機能
  status: "pending" | "approved" | "rejected";

  // 関連データ
  replies?: Comment[];
}
```

### 演習 3-2: 型安全な API 設計 🔶

```typescript
// RESTful APIの型安全なクライアントを設計せよ

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
  meta?: {
    timestamp: Date;
    requestId: string;
    version: string;
  };
}

interface PaginatedData<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

interface ApiClient {
  get<T>(path: string, params?: Record<string, any>): Promise<ApiResponse<T>>;
  post<T, U>(path: string, body: T): Promise<ApiResponse<U>>;
  put<T, U>(path: string, body: T): Promise<ApiResponse<U>>;
  delete<T>(path: string): Promise<ApiResponse<T>>;
}

class TypeSafeApiClient implements ApiClient {
  constructor(
    private baseUrl: string,
    private defaultHeaders: Record<string, string> = {}
  ) {}

  async get<T>(
    path: string,
    params?: Record<string, any>
  ): Promise<ApiResponse<T>> {
    const url = new URL(path, this.baseUrl);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, String(value));
      });
    }

    try {
      const response = await fetch(url.toString(), {
        method: "GET",
        headers: this.defaultHeaders,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: {
            code: `HTTP_${response.status}`,
            message: data.message || response.statusText,
          },
        };
      }

      return {
        success: true,
        data,
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: "NETWORK_ERROR",
          message: error instanceof Error ? error.message : "Unknown error",
        },
      };
    }
  }

  async post<T, U>(path: string, body: T): Promise<ApiResponse<U>> {
    try {
      const response = await fetch(`${this.baseUrl}${path}`, {
        method: "POST",
        headers: {
          ...this.defaultHeaders,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: {
            code: `HTTP_${response.status}`,
            message: data.message || response.statusText,
          },
        };
      }

      return {
        success: true,
        data,
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: "NETWORK_ERROR",
          message: error instanceof Error ? error.message : "Unknown error",
        },
      };
    }
  }

  async put<T, U>(path: string, body: T): Promise<ApiResponse<U>> {
    // POST と同様の実装
    return this.post(path, body);
  }

  async delete<T>(path: string): Promise<ApiResponse<T>> {
    // GET と同様の実装（bodyなし）
    return this.get(path);
  }
}

// 使用例
const apiClient = new TypeSafeApiClient("https://api.example.com");

async function fetchArticles(): Promise<Article[]> {
  const response = await apiClient.get<PaginatedData<Article>>("/articles");

  if (response.success) {
    return response.data.items;
  } else {
    console.error("Error:", response.error?.message);
    return [];
  }
}
```

## 📊 Step 3 評価基準

### 理解度チェックリスト

#### インターフェース設計 (30%)

- [ ] 基本的なインターフェースを設計できる
- [ ] 継承を適切に活用できる
- [ ] ジェネリックインターフェースを実装できる
- [ ] 実用的なデータモデルを設計できる

#### 型エイリアス活用 (25%)

- [ ] interface と type の使い分けができる
- [ ] ユニオン型・交差型を活用できる
- [ ] 複雑な型操作を実装できる
- [ ] 適切な型設計パターンを選択できる

#### データモデル設計 (25%)

- [ ] ドメインモデルを型安全に設計できる
- [ ] 関連性を適切に表現できる
- [ ] 拡張性を考慮した設計ができる
- [ ] 実用的な API インターフェースを設計できる

#### 実践応用 (20%)

- [ ] 型安全なクラスを実装できる
- [ ] 複雑なオブジェクト操作を型安全に実装できる
- [ ] エラーハンドリングを型安全に実装できる
- [ ] 実用的なライブラリを設計できる

### 成果物チェックリスト

- [ ] **ブログシステム**: 完全なデータモデル設計
- [ ] **API クライアント**: 型安全な REST クライアント
- [ ] **ドメインモデル**: EC サイトのデータモデル
- [ ] **インターフェース集**: 再利用可能なインターフェース群

## 🔄 Step 4 への準備

### 次週学習内容の予習

```typescript
// Step 4で学習するユニオン型と型ガードの基礎概念
// 以下のコードを読んで理解しておくこと

// 1. ユニオン型
type StringOrNumber = string | number;
type Status = "loading" | "success" | "error";

// 2. 型ガード
function isString(value: unknown): value is string {
  return typeof value === "string";
}

// 3. 判別可能なユニオン
interface LoadingState {
  status: "loading";
}

interface SuccessState {
  status: "success";
  data: any;
}

interface ErrorState {
  status: "error";
  error: string;
}

type AppState = LoadingState | SuccessState | ErrorState;
```

### 環境準備

- [ ] 型定義ファイルの理解深化
- [ ] VS Code での型情報活用
- [ ] TypeScript Playground での実験
- [ ] 実践プロジェクトの準備

### 学習継続のコツ

1. **設計思考**: インターフェース設計時の考え方を身につける
2. **実践重視**: 実際のプロジェクトでの活用を意識
3. **パターン学習**: 良い設計パターンの蓄積
4. **段階的拡張**: 小さなインターフェースから複雑な設計へ

---

**📌 重要**: Step 3 は TypeScript での型安全なオブジェクト設計の基礎を確立する重要な期間です。インターフェースの活用により、保守性と拡張性の高いコードが書けるようになります。

**🌟 次週は、ユニオン型と型ガードを使った、より柔軟で安全な型システムについて学習します！**
