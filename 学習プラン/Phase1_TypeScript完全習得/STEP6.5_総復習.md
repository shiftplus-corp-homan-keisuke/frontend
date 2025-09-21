# STEP6.5 総復習：テンプレートリテラル型による文字列パターンの型レベル操作

## 📋 概要

テンプレートリテラル型の理論学習内容を総復習し、文字列パターンの型レベル操作を体系的に理解するためのドキュメントです。

## 🎯 学習目標

- [ ] 文字列パターンの型レベル操作の完全理解
- [ ] 動的なキー生成パターンの習得
- [ ] 既存の文字列操作ユーティリティ型の理解
- [ ] 高度なテンプレートリテラル型パターンの習得
- [ ] 実践での活用場面の把握

---

## 1. 文字列パターンの型レベル操作

### 1.1 基本的なテンプレートリテラル型

```typescript
// 基本的な文字列結合
type Greeting = `hello ${"world"}`;  // "hello world"
type Px = `${number}px`;             // "0px" | "1px" | "2px" | ...

// ユニオン型との組み合わせ
type Color = "red" | "blue" | "green";
type Size = "small" | "large";
type ColorSize = `${Color}-${Size}`;
// "red-small" | "red-large" | "blue-small" | "blue-large" | "green-small" | "green-large"
```

### 1.2 型安全な文字列操作

```typescript
// CSS単位の型安全な定義
function setWidth(width: `${number}px`) {
  console.log(`Setting width to ${width}`);
}
setWidth("100px"); // ✅ OK
// setWidth("100em"); // ❌ エラー
```

## 2. 動的なキー生成

### 2.1 イベント名の型安全な生成

```typescript
// イベントハンドラー名の生成
type EventName = "Click" | "Change" | "Submit";
type EventHandler = `on${EventName}`;
// "onClick" | "onChange" | "onSubmit"

// React コンポーネントでの活用
interface ButtonProps {
  onClick?: () => void;
  onChange?: (value: string) => void;
  onSubmit?: () => void;
}
```

### 2.2 APIエンドポイントの型定義

```typescript
// REST APIパスの型安全な管理
type ApiVersion = "v1" | "v2";
type Resource = "users" | "posts" | "comments";
type ApiEndpoint = `/${ApiVersion}/${Resource}`;
// "/v1/users" | "/v1/posts" | "/v1/comments" | "/v2/users" | ...

// 動的なパスパラメータ
type UserEndpoint = `/api/users/${number}`;
// "/api/users/1" | "/api/users/2" | ...
```

### 2.3 プロパティ名の動的生成

```typescript
// 設定キーの型安全な管理
type ConfigSection = "database" | "cache" | "logging";
type ConfigKey = `${ConfigSection}.enabled`;
// "database.enabled" | "cache.enabled" | "logging.enabled"

// オブジェクトの型定義
type Config = {
  [K in ConfigKey]: boolean;
};
```

## 3. 既存の文字列操作ユーティリティ型

### 3.1 文字列変換ユーティリティ

```typescript
// 大文字・小文字変換
type UppercaseExample = Uppercase<"hello">;     // "HELLO"
type LowercaseExample = Lowercase<"WORLD">;     // "world"
type CapitalizeExample = Capitalize<"hello">;   // "Hello"
type UncapitalizeExample = Uncapitalize<"Hello">; // "hello"

// 実践例：定数名の生成
type ActionType = "user_login" | "user_logout";
type ConstantName = Uppercase<ActionType>;
// "USER_LOGIN" | "USER_LOGOUT"
```

### 3.2 組み合わせパターン

```typescript
// 複数のユーティリティ型の組み合わせ
type EventName = "click" | "change";
type HandlerName = `on${Capitalize<EventName>}`;
// "onClick" | "onChange"

// CSS-in-JSでの活用
type CssProperty = "margin" | "padding";
type CssDirection = "top" | "right" | "bottom" | "left";
type CssPropertyWithDirection = `${CssProperty}${Capitalize<CssDirection>}`;
// "marginTop" | "marginRight" | "paddingTop" | ...
```

## 4. 高度なテンプレートリテラル型パターン

### 4.1 条件付きテンプレートリテラル型

```typescript
// 条件に基づく文字列生成
type CreateEventName<T extends string> = T extends `${infer Prefix}Event`
  ? `handle${Capitalize<Prefix>}`
  : `handle${Capitalize<T>}`;

type ClickHandler = CreateEventName<"clickEvent">;  // "handleClick"
type SubmitHandler = CreateEventName<"submit">;     // "handleSubmit"
```

### 4.2 再帰的なテンプレートリテラル型

```typescript
// パスの分割と処理
type Split<S extends string, D extends string> = 
  S extends `${infer T}${D}${infer U}` 
    ? [T, ...Split<U, D>] 
    : [S];

type PathSegments = Split<"users/123/posts", "/">;
// ["users", "123", "posts"]
```

### 4.3 パターンマッチングとの組み合わせ

```typescript
// URLパラメータの抽出
type ExtractParams<T extends string> = 
  T extends `${string}:${infer Param}/${infer Rest}`
    ? { [K in Param]: string } & ExtractParams<Rest>
    : T extends `${string}:${infer Param}`
    ? { [K in Param]: string }
    : {};

type RouteParams = ExtractParams<"/users/:id/posts/:postId">;
// { id: string; postId: string; }
```

## 5. 実践での活用場面

### 5.1 CSS-in-JS

```typescript
// スタイルプロパティの型安全な生成
type ThemeColor = "primary" | "secondary" | "danger";
type ColorVariant = `text-${ThemeColor}` | `bg-${ThemeColor}`;
// "text-primary" | "text-secondary" | "bg-primary" | ...

// Tailwind CSS クラス名の型定義
type SpacingValue = "1" | "2" | "4" | "8";
type SpacingClass = `m-${SpacingValue}` | `p-${SpacingValue}`;
```

### 5.2 イベントハンドリング（React等）

```typescript
// React イベントハンドラーの型定義
type DomEvent = "click" | "change" | "submit" | "focus" | "blur";
type ReactEventHandler<T extends DomEvent> = `on${Capitalize<T>}`;

interface FormProps {
  onSubmit?: () => void;
  onChange?: (value: string) => void;
  onFocus?: () => void;
}
```

### 5.3 API パス定義

```typescript
// RESTful APIの型安全な管理
type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";
type ApiResource = "users" | "posts" | "comments";
type ApiPath = `/${ApiResource}` | `/${ApiResource}/${number}`;

// APIクライアントの型定義
interface ApiClient {
  get<T>(path: ApiPath): Promise<T>;
  post<T>(path: ApiPath, data: unknown): Promise<T>;
}
```

### 5.4 設定キーの型安全な管理

```typescript
// 階層的な設定キーの管理
type ConfigSection = "app" | "database" | "cache";
type ConfigProperty = "host" | "port" | "enabled";
type ConfigKey = `${ConfigSection}.${ConfigProperty}`;

// 設定オブジェクトの型定義
type AppConfig = {
  [K in ConfigKey]: K extends `${string}.port` 
    ? number 
    : K extends `${string}.enabled` 
    ? boolean 
    : string;
};
```

## 📚 学習のポイント

### 重要な概念
1. **型レベルでの文字列操作**: コンパイル時に文字列パターンを検証
2. **ユニオン型の展開**: 全ての組み合わせが自動生成される
3. **型安全性の向上**: 実行時エラーをコンパイル時に検出

### 実践での注意点
1. **パフォーマンス**: 大量の組み合わせは型チェックを遅くする可能性
2. **可読性**: 複雑すぎるテンプレートリテラル型は避ける
3. **メンテナンス性**: 適切な抽象化レベルを保つ

### 活用のベストプラクティス
1. **段階的な構築**: 単純なパターンから複雑なパターンへ
2. **型エイリアスの活用**: 再利用可能な型パターンを定義
3. **ドキュメント化**: 複雑な型パターンには適切なコメントを追加

---

## 🎯 次のステップ

STEP6.5の学習を完了したら、以下の内容に進みましょう：
- STEP07: Zodによるランタイム型検証
- STEP08: SOLID原則とTypeScript設計パターン
- 実践プロジェクトでのテンプレートリテラル型の活用