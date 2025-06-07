# Session3: プロジェクト完成（60分）

> 💡 **対象**: Session1-2完了者（ユーティリティ型基礎習得済み）
> 🎯 **形式**: 講師サポート付きプロジェクト完成・発表
> ⏰ **時間**: 60分

## 📚 関連補足資料

プロジェクト完成をサポートする補足資料をご用意しています：

- 💻 **[実践コード例](./Step06_補足_実践コード例.md)** - 完全なシステム実装例とベストプラクティス
- 🚨 **[トラブルシューティング](./Step06_補足_トラブルシューティング.md)** - デバッグとエラー解決の完全ガイド
- 📖 **[専門用語集](./Step06_補足_専門用語集.md)** - 高度な概念と用語の詳細解説
- 🌐 **[参考リソース](./Step06_補足_参考リソース.md)** - 継続学習のためのリソース集
- 🔧 **[開発環境ガイド](./Step06_補足_開発環境ガイド.md)** - 効率的な開発環境の活用

> 💡 **活用方法**: 学習中に疑問が生じた際や、より深く理解したい場合に参照してね 🐰

## 📅 セッション概要

**学習目標**:

- [ ] 型システム設計プロジェクトの完成
- [ ] ユーティリティ型コードのデバッグ・最適化
- [ ] 学習成果の発表・共有
- [ ] Step06全体の振り返りと次ステップの確認

**前提知識**:

- Session1-2の内容（ユーティリティ型基礎・実践演習）
- 型システム設計プロジェクトの部分実装

---

## ⏰ 詳細タイムテーブル

| 時間         | 内容                       | 講師の役割                 | 学習者の活動   | 成果物       |
| ------------ | -------------------------- | -------------------------- | -------------- | ------------ |
| **0-10分**   | 最終課題説明・目標設定     | 課題説明・期待値設定       | 理解・質問     | 実装計画     |
| **10-45分**  | プロジェクト完成・デバッグ | 個別サポート・デバッグ支援 | 開発・完成     | 完成システム |
| **45-60分**  | 成果発表・総括・次ステップ | 評価・フィードバック       | 発表・振り返り | 学習成果     |

---

## 🎯 最終課題：型システム設計プロジェクト完成

> 📚 **実装サポート**: [実践コード例 - 型システム設計プロジェクト完全版](./Step06_補足_実践コード例.md#型システム設計プロジェクト完全版) | [トラブルシューティング - デバッグガイド](./Step06_補足_トラブルシューティング.md#デバッグのコツ)

### 課題概要

Session2で作成した型変換システムを完成させ、以下の機能を追加実装してください。

### 必須実装機能

#### 1. 基本機能の完成（Session2からの継続）

- [ ] TypeSafeFormクラスの完全実装
- [ ] ApiResponseProcessorクラスの完全実装
- [ ] カスタムユーティリティ型の実装

#### 2. 新規追加機能

##### A. 型変換ライブラリの拡張

```typescript
// 型変換ユーティリティライブラリの完全版
namespace TypeTransformUtils {
  // 1. 配列からオブジェクトへの変換（改良版）
  export function arrayToObject<T, K extends keyof T>(
    array: T[],
    keyField: K
  ): Record<T[K] extends string | number | symbol ? T[K] : never, T> {
    return array.reduce((obj, item) => {
      const key = item[keyField] as any;
      obj[key] = item;
      return obj;
    }, {} as any);
  }

  // 2. オブジェクトのキー変換（型安全版）
  export function transformKeys<T, U extends Record<string, any>>(
    obj: T,
    mapping: { [K in keyof T]: keyof U }
  ): Pick<U, { [K in keyof T]: keyof U }[keyof T]> {
    const result = {} as any;
    for (const [oldKey, newKey] of Object.entries(mapping)) {
      if (oldKey in obj) {
        result[newKey] = (obj as any)[oldKey];
      }
    }
    return result;
  }

  // 3. 深いマージ機能
  export function deepMerge<T, U>(obj1: T, obj2: U): T & U {
    const result = { ...obj1 } as any;
    
    for (const key in obj2) {
      if (obj2.hasOwnProperty(key)) {
        if (
          typeof obj2[key] === 'object' &&
          obj2[key] !== null &&
          !Array.isArray(obj2[key]) &&
          typeof result[key] === 'object' &&
          result[key] !== null &&
          !Array.isArray(result[key])
        ) {
          result[key] = deepMerge(result[key], obj2[key]);
        } else {
          result[key] = obj2[key];
        }
      }
    }
    
    return result;
  }

  // 4. 型安全なフィルタリング
  export function filterByType<T, U>(
    obj: T,
    predicate: (value: T[keyof T]) => value is U
  ): { [K in keyof T]: T[K] extends U ? T[K] : never } {
    const result = {} as any;
    for (const key in obj) {
      if (obj.hasOwnProperty(key) && predicate(obj[key])) {
        result[key] = obj[key];
      }
    }
    return result;
  }
}
```

##### B. 高度なバリデーションシステム

```typescript
// 高度なバリデーションシステム
type ValidatorFunction<T> = (value: T) => ValidationResult;

type ValidationResult = {
  isValid: boolean;
  errors: string[];
  warnings?: string[];
};

type FieldValidator<T> = {
  validators: ValidatorFunction<T>[];
  required?: boolean;
  dependencies?: string[];
};

type ValidationSchema<T> = {
  [K in keyof T]: FieldValidator<T[K]>;
};

class AdvancedValidator<T extends Record<string, any>> {
  constructor(private schema: ValidationSchema<T>) {}

  validate(data: Partial<T>): {
    isValid: boolean;
    fieldResults: { [K in keyof T]?: ValidationResult };
    globalErrors: string[];
  } {
    const fieldResults: { [K in keyof T]?: ValidationResult } = {};
    const globalErrors: string[] = [];
    let isValid = true;

    // フィールドレベルのバリデーション
    for (const field in this.schema) {
      const fieldConfig = this.schema[field];
      const value = data[field];

      // 必須チェック
      if (fieldConfig.required && (value === undefined || value === null)) {
        fieldResults[field] = {
          isValid: false,
          errors: [`${field} is required`],
        };
        isValid = false;
        continue;
      }

      // 値が存在する場合のバリデーション
      if (value !== undefined && value !== null) {
        const errors: string[] = [];
        const warnings: string[] = [];

        for (const validator of fieldConfig.validators) {
          const result = validator(value);
          if (!result.isValid) {
            errors.push(...result.errors);
            isValid = false;
          }
          if (result.warnings) {
            warnings.push(...result.warnings);
          }
        }

        fieldResults[field] = {
          isValid: errors.length === 0,
          errors,
          warnings: warnings.length > 0 ? warnings : undefined,
        };
      }
    }

    // 依存関係チェック
    for (const field in this.schema) {
      const fieldConfig = this.schema[field];
      if (fieldConfig.dependencies) {
        for (const dependency of fieldConfig.dependencies) {
          if (data[field] && !data[dependency as keyof T]) {
            globalErrors.push(
              `${field} requires ${dependency} to be provided`
            );
            isValid = false;
          }
        }
      }
    }

    return { isValid, fieldResults, globalErrors };
  }
}

// バリデーター関数の例
const Validators = {
  email: (value: string): ValidationResult => ({
    isValid: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    errors: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? [] : ['Invalid email format'],
  }),

  minLength: (min: number) => (value: string): ValidationResult => ({
    isValid: value.length >= min,
    errors: value.length >= min ? [] : [`Must be at least ${min} characters`],
  }),

  range: (min: number, max: number) => (value: number): ValidationResult => ({
    isValid: value >= min && value <= max,
    errors: value >= min && value <= max ? [] : [`Must be between ${min} and ${max}`],
  }),

  custom: <T>(fn: (value: T) => boolean, message: string) => (value: T): ValidationResult => ({
    isValid: fn(value),
    errors: fn(value) ? [] : [message],
  }),
};
```

##### C. 実用的なデータ変換パイプライン

```typescript
// データ変換パイプライン
type TransformFunction<TInput, TOutput> = (input: TInput) => TOutput;

class DataPipeline<TInput> {
  private transformations: TransformFunction<any, any>[] = [];

  transform<TOutput>(fn: TransformFunction<TInput, TOutput>): DataPipeline<TOutput> {
    const newPipeline = new DataPipeline<TOutput>();
    newPipeline.transformations = [...this.transformations, fn];
    return newPipeline;
  }

  execute(input: TInput): any {
    return this.transformations.reduce((acc, transform) => transform(acc), input);
  }

  static create<T>(input?: T): DataPipeline<T> {
    return new DataPipeline<T>();
  }
}

// 使用例
interface RawUserData {
  id: string;
  full_name: string;
  email_address: string;
  birth_date: string;
  is_active: string;
}

interface ProcessedUserData {
  id: number;
  name: string;
  email: string;
  birthDate: Date;
  isActive: boolean;
}

const userDataPipeline = DataPipeline
  .create<RawUserData>()
  .transform((raw): Partial<ProcessedUserData> => ({
    id: parseInt(raw.id),
    name: raw.full_name,
    email: raw.email_address,
    birthDate: new Date(raw.birth_date),
    isActive: raw.is_active === 'true',
  }))
  .transform((partial): ProcessedUserData => {
    // バリデーションと完全性チェック
    if (!partial.id || !partial.name || !partial.email) {
      throw new Error('Invalid user data');
    }
    return partial as ProcessedUserData;
  });

// 実行
const rawData: RawUserData = {
  id: "123",
  full_name: "Alice Smith",
  email_address: "alice@example.com",
  birth_date: "1990-01-01",
  is_active: "true",
};

const processedData = userDataPipeline.execute(rawData);
```

#### 3. ユーティリティ型活用の強化

```typescript
// 実用的なユーティリティ型の組み合わせ
type ApiEndpoint<TRequest, TResponse> = {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  request: TRequest;
  response: TResponse;
};

type ApiSchema = {
  getUser: ApiEndpoint<{ id: string }, { id: string; name: string; email: string }>;
  createUser: ApiEndpoint<
    Omit<{ id: string; name: string; email: string }, 'id'>,
    { id: string; name: string; email: string }
  >;
  updateUser: ApiEndpoint<
    { id: string } & Partial<Omit<{ id: string; name: string; email: string }, 'id'>>,
    { id: string; name: string; email: string }
  >;
  deleteUser: ApiEndpoint<{ id: string }, { success: boolean }>;
};

// 型安全なAPIクライアント
class TypeSafeApiClient<TSchema extends Record<string, ApiEndpoint<any, any>>> {
  constructor(private baseUrl: string) {}

  async call<K extends keyof TSchema>(
    endpoint: K,
    request: TSchema[K]['request']
  ): Promise<TSchema[K]['response']> {
    // 実際のHTTPリクエスト実装
    const response = await fetch(`${this.baseUrl}/${String(endpoint)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });
    
    return response.json();
  }
}

// 使用例
const apiClient = new TypeSafeApiClient<ApiSchema>('https://api.example.com');

// 型安全な呼び出し
const user = await apiClient.call('getUser', { id: '123' });
const newUser = await apiClient.call('createUser', { 
  name: 'Alice', 
  email: 'alice@example.com' 
});
```

### 実装のヒント

1. **段階的実装**: 一つずつ機能を追加し、動作確認を行う
2. **型安全性**: すべての関数に適切な型注釈を付ける
3. **エラーハンドリング**: 想定される例外ケースを考慮する
4. **テストデータ**: 実装した機能をテストするためのサンプルデータを用意
5. **パフォーマンス**: 型レベルの計算が複雑になりすぎないよう注意

---

## 👨‍🏫 学習ポイント

### 🤔 よくある実装上の問題と解決法

**Q: 複雑な型定義でTypeScriptコンパイラが遅くなる場合は？**
A: 型エイリアスを使って複雑な型を分割し、再帰の深さを制限しましょう。また、`// @ts-ignore`を適切に使用して、必要に応じて型チェックをスキップすることも検討してください。

**Q: ユーティリティ型の組み合わせで予期しない型になる場合は？**
A: TypeScript Playgroundを使って段階的に型を確認し、中間結果を型エイリアスで保存して問題箇所を特定しましょう。

**Q: 実行時エラーと型エラーの関係は？**
A: TypeScriptの型システムは実行時の動作を完全には保証しません。重要な箇所では実行時バリデーションも併用しましょう。

---

## 成果物

- [ ] **型システム設計プロジェクト**: ユーティリティ型練習に特化した学習者向けプロジェクト → [Step06成果物](./Step06_成果物.md)で詳細確認

---

## 📊 Step06総合評価

### 最終評価基準

#### 技術習得度（60%）

- [ ] **ユーティリティ型基礎**: Partial、Required、Pick、Omit、Recordの適切な使用
- [ ] **ユーティリティ型実践**: カスタムユーティリティ型の作成と活用
- [ ] **ユーティリティ型応用**: 複合的な型操作と実用的なシステム設計
- [ ] **エラーハンドリング**: 型レベルでの適切な例外処理の実装

#### 実装品質（25%）

- [ ] **コードの可読性**: 変数名・関数名・型名の適切性
- [ ] **型安全性**: ユーティリティ型の恩恵を最大限活用
- [ ] **保守性**: 拡張しやすい型システム設計
- [ ] **動作確認**: 実装した機能の正常動作

#### 学習姿勢（15%）

- [ ] **積極性**: 質問・議論への参加
- [ ] **問題解決**: 自力でのデバッグ・調査
- [ ] **協調性**: 他の学習者との協力
- [ ] **振り返り**: 学習内容の整理・次ステップの計画

---

## 🔄 Step07への準備

### 次週学習内容の予習

```typescript
// Step07で学習する実践プロジェクトの基礎概念
// 以下のコードを読んで理解しておくこと

// 1. プロジェクト構造
interface TodoItem {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// 2. 状態管理
type AppState = {
  todos: TodoItem[];
  filter: "all" | "active" | "completed";
  loading: boolean;
};

// 3. アクション定義
type TodoAction =
  | { type: "ADD_TODO"; payload: { title: string } }
  | { type: "TOGGLE_TODO"; payload: { id: string } }
  | { type: "DELETE_TODO"; payload: { id: string } };

// 4. ユーティリティ型の活用
type TodoUpdate = Partial<Pick<TodoItem, "title" | "completed">>;
type CreateTodoRequest = Omit<TodoItem, "id" | "createdAt" | "updatedAt">;
```

### 環境準備

- [ ] 実践プロジェクト用の開発環境準備
- [ ] TypeScript + HTML/CSS の環境構築
- [ ] 型定義ファイルの整理
- [ ] テストフレームワークの準備

### 学習継続のコツ

1. **実践重視**: 学んだユーティリティ型を実際のプロジェクトで活用
2. **型パズル**: type-challengesでの継続的な練習
3. **パターン学習**: 良い型変換パターンの蓄積
4. **段階的理解**: 複雑な型から基本要素に分解して理解

---

**🎉 お疲れ様でした！** Step06を通じてユーティリティ型の基礎をしっかりと身につけることができました。

**🚀 次のStep07では、より高度な実践プロジェクトと実践的な開発手法を学習します！**