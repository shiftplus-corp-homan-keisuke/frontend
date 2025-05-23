# Phase 1: TypeScript 完全習得 詳細学習プラン（1-3 ヶ月）

## 🎯 学習目標

Angular 経験の TypeScript 基礎から、エキスパートレベルまでの体系的学習

## 📅 12 週間学習スケジュール

### Week 1-2: 基礎固め（既存資料の深掘り活用）

#### 📖 学習内容

- `typescript/type errorの見方.md` の完全理解
- `typescript/thisについて.md` の実践応用
- `typescript/Enumのベストプラクティス.md` の現場適用

#### 🎯 週次目標

**Week 1:**

- [ ] TypeScript 設定ファイル（tsconfig.json）の完全理解
- [ ] 型エラーパターン 20 種類の理解と解決
- [ ] strict モードでの開発環境構築

**Week 2:**

- [ ] this キーワードの全パターン実装
- [ ] Enum と代替手法の使い分け
- [ ] 既存 Angular 型定義の分析・改善

#### 📝 実践演習

**演習 1-1: 型エラー解決チャレンジ**

```typescript
// 以下のコードの型エラーを全て修正せよ
interface User {
  id: number;
  name: string;
  email: string;
  profile?: UserProfile;
}

interface UserProfile {
  bio: string;
  avatar: string;
  preferences: UserPreferences;
}

interface UserPreferences {
  theme: "light" | "dark";
  language: string;
  notifications: boolean[];
}

// エラーが含まれるコード（意図的）
const users: User[] = [
  {
    id: "1", // Error: string should be number
    name: "Alice",
    email: "alice@example.com",
    profile: {
      bio: "Software Developer",
      preferences: {
        theme: "blue", // Error: invalid theme
        language: "en",
        notifications: [true, false, "email"], // Error: string in boolean array
      },
    }, // Error: missing avatar
  },
];

function getUserEmail(userId: string): string {
  const user = users.find((u) => u.id === userId); // Error: type mismatch
  return user.email; // Error: possibly undefined
}

// この関数でthisの問題を修正せよ
const userService = {
  users: users,
  findUser: function (id: number) {
    setTimeout(function () {
      console.log(this.users); // Error: this binding issue
    }, 1000);
  },
};
```

**演習 1-2: Enum vs 代替手法の実装**

```typescript
// 以下のEnumを3つの方法で実装せよ
// 1. 従来のEnum
// 2. const assertion を使ったオブジェクト
// 3. 文字列リテラルユニオン型

// 要件:
// - HTTP ステータスコード (200, 404, 500)
// - ユーザーロール (admin, editor, viewer)
// - API エンドポイント (/users, /posts, /comments)

// それぞれの実装でイテレーションと型安全性を確認すること
```

### Week 3-4: 中級 TypeScript（実践的な型システム）

#### 📖 学習内容

- ジェネリクスの完全理解と実践応用
- ユーティリティ型の組み合わせ活用
- 条件付き型・マップ型の実装パターン

#### 🎯 週次目標

**Week 3:**

- [ ] ジェネリクス制約の高度な活用
- [ ] ユーティリティ型の自作実装
- [ ] 型推論の最適化テクニック

**Week 4:**

- [ ] 条件付き型での型レベル計算
- [ ] マップ型を使った型変換
- [ ] 再帰的型定義の実装

#### 📝 実践演習

**演習 3-1: 高度なジェネリクス実装**

```typescript
// 型安全なAPIクライアントを実装せよ
// 要件:
// 1. レスポンス型の自動推論
// 2. エラーハンドリングの型安全性
// 3. ジェネリック制約による型チェック

interface ApiEndpoint {
  method: "GET" | "POST" | "PUT" | "DELETE";
  path: string;
  requestBody?: unknown;
  responseBody: unknown;
}

// ここにジェネリックを使ったAPIクライアントを実装
class ApiClient<T extends Record<string, ApiEndpoint>> {
  // 実装
}

// 使用例の型が正しく推論されることを確認
const endpoints = {
  getUsers: {
    method: "GET" as const,
    path: "/users",
    responseBody: {} as User[],
  },
  createUser: {
    method: "POST" as const,
    path: "/users",
    requestBody: {} as CreateUserRequest,
    responseBody: {} as User,
  },
} as const;

const client = new ApiClient(endpoints);
// client.getUsers() → Promise<User[]> が推論されること
// client.createUser(data) → data の型が CreateUserRequest であること
```

**演習 3-2: 型レベルプログラミング**

```typescript
// 以下の型ユーティリティを実装せよ

// 1. DeepReadonly<T>: ネストしたオブジェクトも含めて全てreadonlyにする
type DeepReadonly<T> = /* 実装 */;

// 2. PathsToProperty<T, U>: オブジェクト内で特定の型のプロパティへのパスを取得
type PathsToProperty<T, U> = /* 実装 */;

// 3. FunctionPropertyNames<T>: オブジェクト内の関数型プロパティの名前を取得
type FunctionPropertyNames<T> = /* 実装 */;

// テストケース
interface TestObject {
  name: string;
  age: number;
  address: {
    street: string;
    city: string;
    getFullAddress: () => string;
  };
  hobbies: string[];
  greet: (name: string) => string;
  settings: {
    theme: 'light' | 'dark';
    notifications: {
      email: boolean;
      push: boolean;
      getPreferences: () => object;
    };
  };
}

// 期待結果:
// DeepReadonly<TestObject> - 全プロパティがreadonlyになる
// PathsToProperty<TestObject, Function> - "address.getFullAddress" | "greet" | "settings.notifications.getPreferences"
// FunctionPropertyNames<TestObject> - "greet"
```

### Week 5-6: 上級 TypeScript（型レベルプログラミング）

#### 📖 学習内容

- テンプレートリテラル型の活用
- 型レベルプログラミングパターン
- 高度な条件付き型と infer 活用

#### 🎯 週次目標

**Week 5:**

- [ ] テンプレートリテラル型での文字列操作
- [ ] 型レベルでの数値計算実装
- [ ] 再帰的型定義の最適化

**Week 6:**

- [ ] 型パズルの解法パターン習得
- [ ] パフォーマンスを考慮した型設計
- [ ] TypeScript 5.x 新機能の活用

#### 📝 実践演習

**演習 5-1: テンプレートリテラル型マスター**

```typescript
// CSS-in-JS の型安全システムを実装せよ

// 1. CSS プロパティ名の型安全性
type CSSProperty =
  | "color"
  | "backgroundColor"
  | "fontSize"
  | "margin"
  | "padding";

// 2. CSS カスタムプロパティ（--variable）の型
type CSSCustomProperty = `--${string}`;

// 3. CSS 単位付き値の型
type CSSUnit = "px" | "rem" | "em" | "%" | "vh" | "vw";
type CSSValue<T extends string> = `${number}${T}` | "0";

// 4. レスポンシブブレイクポイントの型
type Breakpoint = "sm" | "md" | "lg" | "xl";
type ResponsiveProperty<T> = T | { [K in Breakpoint]?: T };

// 5. styled-components風の実装
interface StyledProps {
  [key: CSSProperty]:
    | ResponsiveProperty<string>
    | ResponsiveProperty<CSSValue<CSSUnit>>;
  [key: CSSCustomProperty]: string;
}

// 使用例で型チェックが正しく動作することを確認
const styles: StyledProps = {
  color: "red",
  fontSize: { sm: "14px", md: "16px", lg: "18px" },
  margin: "10px",
  "--primary-color": "#007bff",
  // 'invalidProperty': 'value',  // Error
  // fontSize: 'invalidValue',     // Error
};
```

**演習 5-2: 型パズル（type-challenges 風）**

```typescript
// 1. Reverse<T>: 配列を逆順にする型
type Reverse<T extends readonly unknown[]> = /* 実装 */;

// テスト
type Test1 = Reverse<[1, 2, 3]>; // [3, 2, 1]

// 2. Join<T, U>: 配列を指定の文字列で結合する型
type Join<T extends readonly string[], U extends string> = /* 実装 */;

// テスト
type Test2 = Join<['a', 'b', 'c'], '-'>; // "a-b-c"

// 3. DeepPick<T, K>: ネストしたオブジェクトから特定のパスをpickする型
type DeepPick<T, K extends string> = /* 実装 */;

// テスト
type Test3 = DeepPick<{
  user: {
    name: string;
    profile: {
      bio: string;
      avatar: string;
    };
  };
  posts: Post[];
}, 'user.profile.bio'>; // { user: { profile: { bio: string } } }

// 4. RequireAtLeastOne<T>: 最低1つのプロパティが必須の型
type RequireAtLeastOne<T> = /* 実装 */;

// テスト
type Test4 = RequireAtLeastOne<{
  name?: string;
  email?: string;
  phone?: string;
}>; // name | email | phone のうち最低1つは必須
```

### Week 7-8: TypeScript Compiler API & ツール開発

#### 📖 学習内容

- TypeScript Compiler API の基礎
- AST 操作とコード変換
- ESLint ルール作成実践

#### 🎯 週次目標

**Week 7:**

- [ ] TypeScript AST 構造の理解
- [ ] シンプルなコード変換の実装
- [ ] TypeScript Compiler API の活用

**Week 8:**

- [ ] ESLint カスタムルールの作成
- [ ] TypeScript Transformer の実装
- [ ] コードジェネレータの基礎

#### 📝 実践演習

**演習 7-1: ESLint カスタムルール開発**

```typescript
// 以下のESLintルールを実装せよ

// 1. no-any-type: any型の使用を禁止するルール
// 2. prefer-readonly-array: Array<T>の代わりにreadonly T[]を推奨するルール
// 3. no-implicit-return-type: 関数の戻り値型の明示を強制するルール

// ルールの実装テンプレート
import { ESLintUtils } from "@typescript-eslint/utils";

const createRule = ESLintUtils.RuleCreator(
  (name) => `https://your-docs.com/rule/${name}`
);

export const noAnyType = createRule({
  name: "no-any-type",
  meta: {
    type: "problem",
    docs: {
      description: "Disallow any type",
      recommended: "error",
    },
    messages: {
      noAnyType: "Avoid using `any` type. Use more specific type instead.",
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    // 実装
    return {
      // AST visitor methods
    };
  },
});
```

**演習 7-2: TypeScript Transformer 実装**

```typescript
// Decoratorを使った自動プロパティ初期化のTransformerを実装せよ

// 変換前:
class User {
  @AutoInit
  name: string;

  @AutoInit("default@example.com")
  email: string;
}

// 変換後:
class User {
  name: string = "";
  email: string = "default@example.com";
}

// Transformer実装
import * as ts from "typescript";

export function createAutoInitTransformer(): ts.TransformerFactory<ts.SourceFile> {
  return (context) => {
    return (sourceFile) => {
      // 実装
    };
  };
}
```

### Week 9-10: 実践応用・プロジェクト開発

#### 📖 学習内容

- 型安全なライブラリ設計
- d.ts ファイルの作成
- 実践プロジェクトの実装

#### 🎯 週次目標

**Week 9:**

- [ ] NPM パッケージの型定義作成
- [ ] 型安全な API クライアントライブラリ実装
- [ ] ドキュメント自動生成

**Week 10:**

- [ ] 型パズル 50 問の完全解決
- [ ] 実践プロジェクトの完成
- [ ] コードレビューとリファクタリング

#### 📝 最終プロジェクト

**プロジェクト: 型安全なフォームバリデーションライブラリ**

以下の要件を満たすライブラリを実装せよ：

```typescript
// 使用例
const userSchema = schema({
  name: string().required().min(2).max(50),
  email: string().required().email(),
  age: number().required().min(18).max(120),
  profile: object({
    bio: string().optional().max(500),
    website: string().optional().url(),
  }),
  hobbies: array(string()).min(1).max(10),
});

type UserFormData = InferType<typeof userSchema>;
// 型が自動推論されること:
// {
//   name: string;
//   email: string;
//   age: number;
//   profile?: {
//     bio?: string;
//     website?: string;
//   };
//   hobbies: string[];
// }

const result = userSchema.validate(formData);
if (result.success) {
  // result.data の型が UserFormData であること
  console.log(result.data.name);
} else {
  // result.errors の型が ValidationError[] であること
  console.log(result.errors);
}
```

### Week 11-12: 総合演習・評価

#### 📖 学習内容

- 総合的な型システム設計
- パフォーマンス最適化
- ベストプラクティスの確立

#### 🎯 週次目標

**Week 11:**

- [ ] 複雑な型システムの設計・実装
- [ ] 型レベル最適化の実践
- [ ] エラーハンドリングの型安全性

**Week 12:**

- [ ] 総合テストの実施
- [ ] 成果物のブラッシュアップ
- [ ] 次フェーズへの準備

## 📊 学習成果評価基準

### 🎯 理解度確認テスト

#### レベル 1: 基礎（Week 1-4）

- [ ] 型エラーの迅速な解決（20 パターン以上）
- [ ] this キーワードの正確な理解と実装
- [ ] Enum と代替手法の適切な選択

#### レベル 2: 中級（Week 5-8）

- [ ] ジェネリクスの高度な活用
- [ ] 条件付き型・マップ型の実装
- [ ] TypeScript Compiler API の基本操作

#### レベル 3: 上級（Week 9-12）

- [ ] 型レベルプログラミングの実践
- [ ] 型安全なライブラリの設計・実装
- [ ] 総合的な問題解決能力

### 📈 成果物チェックリスト

- [ ] **型エラー解決パターン集（20 パターン以上）**
- [ ] **TypeScript 設定ベストプラクティス集**
- [ ] **型パズル 50 問完全解決**
- [ ] **ESLint カスタムルール 3 個以上作成**
- [ ] **TypeScript 変換ツール作成**
- [ ] **型安全なライブラリ実装**

### 🏆 最終評価項目

| 項目       | 重み | 評価基準               |
| ---------- | ---- | ---------------------- |
| 基礎理解度 | 20%  | 型システムの正確な理解 |
| 実装能力   | 30%  | 複雑な型の実装・活用   |
| 問題解決力 | 25%  | 型エラーの迅速な解決   |
| 設計能力   | 15%  | 型安全なシステム設計   |
| 創造性     | 10%  | 独創的な型活用法       |

**合格基準: 各項目 70%以上、総合 80%以上**

## 📚 推奨学習リソース

### 必須教材

- TypeScript Handbook (公式)
- 既存資料の完全活用
- type-challenges (実践演習)

### 補助教材

- TypeScript Deep Dive
- TypeScript AST Explorer
- React TypeScript Cheatsheet

### 実践環境

- TypeScript Playground
- CodeSandbox
- GitHub Codespaces

## 🔄 継続学習計画

Phase1 完了後は即座に Phase2（TypeScript × React）に進み、習得した TypeScript 知識を React 開発で実践活用していきます。

---

**📌 重要**: 各週の学習は順次進めつつ、理解が不十分な部分は前の週に戻って復習することを推奨します。TypeScript の型システムは積み重ねが重要です。
