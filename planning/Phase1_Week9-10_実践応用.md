# Phase 1: Week 9-10 実践応用・プロジェクト開発

## 📅 学習期間・目標

**期間**: Week 9-10（2 週間）  
**総学習時間**: 40 時間（週 20 時間）

### 🎯 Week 9-10 到達目標

- [ ] 型安全なライブラリ設計・実装
- [ ] d.ts ファイルの作成技術
- [ ] NPM パッケージの公開
- [ ] 実践プロジェクトの完成
- [ ] TypeScript Expert 基礎の確立

## 📖 理論学習内容

### Day 57-60: ライブラリ設計・型定義作成

#### 型安全なライブラリ設計パターン

```typescript
// 1. ライブラリの基本構造
export interface LibraryConfig {
  strict: boolean;
  debug: boolean;
  version: string;
}

export class TypeSafeLibrary {
  private config: LibraryConfig;

  constructor(config: Partial<LibraryConfig> = {}) {
    this.config = {
      strict: true,
      debug: false,
      version: "1.0.0",
      ...config,
    };
  }

  // 型安全なメソッド設計
  public process<T extends Record<string, any>>(
    data: T,
    options?: ProcessOptions<T>
  ): ProcessResult<T> {
    // 実装
    return {
      success: true,
      data: data,
      metadata: {
        processedAt: new Date(),
        version: this.config.version,
      },
    };
  }
}

// 2. 高度な型定義パターン
export type ProcessOptions<T> = {
  [K in keyof T]?: {
    validate?: (value: T[K]) => boolean;
    transform?: (value: T[K]) => T[K];
    required?: boolean;
  };
};

export interface ProcessResult<T> {
  success: boolean;
  data: T;
  errors?: ProcessError[];
  metadata: {
    processedAt: Date;
    version: string;
  };
}

export interface ProcessError {
  field: string;
  message: string;
  code: string;
}
```

#### d.ts ファイル作成技術

```typescript
// 3. 型定義ファイルの構造
declare module "my-typescript-library" {
  // 基本的な型エクスポート
  export interface Config {
    apiKey: string;
    baseUrl: string;
    timeout?: number;
  }

  // クラスの型定義
  export class ApiClient {
    constructor(config: Config);

    get<T>(endpoint: string): Promise<T>;
    post<T, U>(endpoint: string, data: U): Promise<T>;
    put<T, U>(endpoint: string, data: U): Promise<T>;
    delete(endpoint: string): Promise<void>;
  }

  // 関数の型定義
  export function createClient(config: Config): ApiClient;
  export function validateConfig(config: Partial<Config>): config is Config;

  // 名前空間の型定義
  export namespace Utils {
    function formatUrl(base: string, endpoint: string): string;
    function parseResponse<T>(response: Response): Promise<T>;
  }

  // モジュール拡張
  declare global {
    interface Window {
      MyLibrary: typeof ApiClient;
    }
  }
}

// 4. 条件付きエクスポート
declare module "my-library/browser" {
  import { ApiClient, Config } from "my-typescript-library";

  export class BrowserApiClient extends ApiClient {
    constructor(config: Config & { enableCors?: boolean });
  }
}

declare module "my-library/node" {
  import { ApiClient, Config } from "my-typescript-library";

  export class NodeApiClient extends ApiClient {
    constructor(config: Config & { agent?: any });
  }
}
```

### Day 61-63: 実践プロジェクト開発

#### プロジェクト: 型安全なフォームバリデーションライブラリ

```typescript
// 5. フォームバリデーションライブラリの設計
export interface ValidationRule<T> {
  required?: boolean;
  min?: number;
  max?: number;
  pattern?: RegExp;
  custom?: (value: T) => string | null;
  message?: string;
}

export type ValidationSchema<T extends Record<string, any>> = {
  [K in keyof T]: ValidationRule<T[K]>;
};

export interface ValidationResult<T> {
  isValid: boolean;
  errors: Partial<Record<keyof T, string>>;
  data: T;
}

// 6. スキーマビルダーパターン
export class SchemaBuilder<T extends Record<string, any>> {
  private schema: Partial<ValidationSchema<T>> = {};

  field<K extends keyof T>(
    key: K,
    rule: ValidationRule<T[K]>
  ): SchemaBuilder<T> {
    this.schema[key] = rule;
    return this;
  }

  build(): ValidationSchema<T> {
    return this.schema as ValidationSchema<T>;
  }
}

// 7. バリデーター実装
export class TypeSafeValidator<T extends Record<string, any>> {
  constructor(private schema: ValidationSchema<T>) {}

  validate(data: Partial<T>): ValidationResult<T> {
    const errors: Partial<Record<keyof T, string>> = {};
    let isValid = true;

    for (const [key, rule] of Object.entries(this.schema) as Array<
      [keyof T, ValidationRule<T[keyof T]>]
    >) {
      const value = data[key];
      const error = this.validateField(value, rule);

      if (error) {
        errors[key] = error;
        isValid = false;
      }
    }

    return {
      isValid,
      errors,
      data: data as T,
    };
  }

  private validateField<K extends keyof T>(
    value: T[K],
    rule: ValidationRule<T[K]>
  ): string | null {
    // Required チェック
    if (
      rule.required &&
      (value === undefined || value === null || value === "")
    ) {
      return rule.message || "This field is required";
    }

    if (value === undefined || value === null) {
      return null;
    }

    // 最小値チェック
    if (rule.min !== undefined) {
      if (typeof value === "string" && value.length < rule.min) {
        return rule.message || `Minimum length is ${rule.min}`;
      }
      if (typeof value === "number" && value < rule.min) {
        return rule.message || `Minimum value is ${rule.min}`;
      }
    }

    // 最大値チェック
    if (rule.max !== undefined) {
      if (typeof value === "string" && value.length > rule.max) {
        return rule.message || `Maximum length is ${rule.max}`;
      }
      if (typeof value === "number" && value > rule.max) {
        return rule.message || `Maximum value is ${rule.max}`;
      }
    }

    // パターンチェック
    if (rule.pattern && typeof value === "string") {
      if (!rule.pattern.test(value)) {
        return rule.message || "Invalid format";
      }
    }

    // カスタムバリデーション
    if (rule.custom) {
      return rule.custom(value);
    }

    return null;
  }
}

// 8. 使用例とテスト
interface UserForm {
  name: string;
  email: string;
  age: number;
  password: string;
  confirmPassword: string;
}

const userSchema = new SchemaBuilder<UserForm>()
  .field("name", {
    required: true,
    min: 2,
    max: 50,
    message: "Name must be between 2 and 50 characters",
  })
  .field("email", {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: "Please enter a valid email address",
  })
  .field("age", {
    required: true,
    min: 18,
    max: 120,
    message: "Age must be between 18 and 120",
  })
  .field("password", {
    required: true,
    min: 8,
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    message:
      "Password must contain at least 8 characters with uppercase, lowercase, and number",
  })
  .field("confirmPassword", {
    required: true,
    custom: (value, data) => {
      if (value !== data?.password) {
        return "Passwords do not match";
      }
      return null;
    },
  })
  .build();

const validator = new TypeSafeValidator(userSchema);
```

### Day 64-70: 総合演習・評価

#### 最終プロジェクト統合

```typescript
// 9. ライブラリの完全な型定義
declare module "@your-org/form-validator" {
  export interface ValidationRule<T> {
    required?: boolean;
    min?: number;
    max?: number;
    pattern?: RegExp;
    custom?: (value: T, data?: any) => string | null;
    message?: string;
  }

  export type ValidationSchema<T extends Record<string, any>> = {
    [K in keyof T]: ValidationRule<T[K]>;
  };

  export interface ValidationResult<T> {
    isValid: boolean;
    errors: Partial<Record<keyof T, string>>;
    data: T;
  }

  export class SchemaBuilder<T extends Record<string, any>> {
    field<K extends keyof T>(
      key: K,
      rule: ValidationRule<T[K]>
    ): SchemaBuilder<T>;
    build(): ValidationSchema<T>;
  }

  export class TypeSafeValidator<T extends Record<string, any>> {
    constructor(schema: ValidationSchema<T>);
    validate(data: Partial<T>): ValidationResult<T>;
  }

  // ヘルパー関数
  export function createSchema<
    T extends Record<string, any>
  >(): SchemaBuilder<T>;
  export function validateEmail(email: string): boolean;
  export function validatePassword(password: string): boolean;
}
```

## 🎯 実践演習

### 演習 9-1: 型安全ライブラリ開発 💎

**目標**: 実用的な TypeScript ライブラリの完全実装

**要件**:

- [ ] 型安全なフォームバリデーションライブラリ
- [ ] 完全な型定義ファイル（d.ts）
- [ ] 包括的なテストスイート
- [ ] ドキュメント（README、API docs）
- [ ] NPM パッケージとして公開可能

### 演習 9-2: 型パズル 50 問チャレンジ 🔥

**目標**: type-challenges の問題を 50 問完全解決

**カテゴリ別目標**:

- [ ] Easy: 15 問
- [ ] Medium: 25 問
- [ ] Hard: 8 問
- [ ] Extreme: 2 問

### 演習 9-3: TypeScript 設定最適化 🔶

**目標**: プロジェクト別最適化設定集の作成

**要件**:

- [ ] ライブラリ開発用設定
- [ ] アプリケーション開発用設定
- [ ] 厳格モード設定
- [ ] パフォーマンス最適化設定

## 📊 Week 9-10 評価基準

### 最終評価項目

#### 技術的実装 (40%)

- [ ] ライブラリの完成度と品質
- [ ] 型安全性の確保
- [ ] エラーハンドリングの適切性
- [ ] パフォーマンスの考慮

#### 設計品質 (30%)

- [ ] API 設計の使いやすさ
- [ ] 拡張性の確保
- [ ] 保守性の向上
- [ ] テスタビリティ

#### ドキュメント・公開 (20%)

- [ ] 型定義の完全性
- [ ] ドキュメントの充実度
- [ ] 使用例の提供
- [ ] NPM 公開準備

#### 問題解決力 (10%)

- [ ] 型パズルの解決能力
- [ ] 複雑な型問題への対応
- [ ] 創造的な解決策
- [ ] 最適化の実装

### Phase 1 総合成果物

- [ ] **型エラー解決パターン集（20 パターン以上）**
- [ ] **TypeScript 設定ベストプラクティス集**
- [ ] **型パズル 50 問完全解決**
- [ ] **ESLint カスタムルール 3 個以上**
- [ ] **TypeScript 変換ツール**
- [ ] **型安全ライブラリ（NPM 公開準備完了）**

## 🎉 Phase 1 完了・Phase 2 準備

### Phase 1 達成確認

- [ ] 全ての週次目標達成
- [ ] 成果物の品質確認
- [ ] 自己評価の実施
- [ ] ポートフォリオ更新

### Phase 2 準備事項

- [ ] React 開発環境構築
- [ ] Phase 2 学習計画確認
- [ ] 必要なライブラリ調査
- [ ] 学習時間の再配分

---

**🌟 Phase 1 完了おめでとうございます！**

TypeScript の基礎から上級技術まで、包括的に習得できました。Phase 2 では、この知識を React と組み合わせて、より実践的なフロントエンド開発スキルを身につけていきます。

**📌 重要**: Phase 1 で習得した TypeScript の深い理解は、Phase 2 以降の全ての学習の基盤となります。継続的な復習と実践を心がけてください。
