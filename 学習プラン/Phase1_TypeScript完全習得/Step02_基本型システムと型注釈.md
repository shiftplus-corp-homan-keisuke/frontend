# Step 2: 基本型システムと型注釈

> 💡 **補足資料**: 詳細な解説は以下の補足資料を見てね 🐰
>
> - 📖 [専門用語集](./Step02_補足_専門用語集.md) - 型システム関連の重要な概念と用語の詳細解説
> - 🛠️ [開発環境ガイド](./Step01_補足_開発環境ガイド.md) - 環境構築と設定方法
> - ⚙️ [設定ファイル解説](./Step01_補足_設定ファイル解説.md) - tsconfig.json 等の詳細設定
> - 💻 [実践コード例](./Step02_補足_実践コード例.md) - 段階的な学習用コード集
> - 🚨 [トラブルシューティング](./Step02_補足_トラブルシューティング.md) - よくあるエラーと解決方法
> - 📚 [参考リソース](./Step02_補足_参考リソース.md) - 学習に役立つリンク集
> - 📋 [補足資料](./Step02_補足資料.md) - その他の重要な補足情報

## 📅 学習期間・目標

**期間**: Step 2  
**総学習時間**: 4 時間  
**学習スタイル**: 理論 20% + 実践コード 50% + 演習 30%

### 🎯 Step 2 到達目標

- [ ] TypeScript の基本型システムを完全理解
- [ ] 型推論の仕組みと活用方法の習得
- [ ] 配列・タプル・オブジェクト型の実践的活用
- [ ] 関数型注釈の詳細理解
- [ ] 型安全なコード設計の基礎確立

## 📚 理論学習内容

### Section 1: プリミティブ型の完全理解

#### 🔍 基本型の詳細と実践的活用

##### 1. string 型 - 文字列の型安全な管理

> 💡 **詳細解説**: string 型の詳細と実用的な活用パターンは [Step02*補足*専門用語集.md#プリミティブ型 primitive-types](./Step02_補足_専門用語集.md#プリミティブ型primitive-types) を見てね 🐰

**💡 なぜこの型が重要なのか**

string 型は、JavaScript の文字列に型安全性を提供する基本的な型です。JavaScript では文字列と数値の暗黙的変換によるバグが頻発しますが、TypeScript の string 型により、これらの問題を開発時に検出できます。特に、API のレスポンス処理、ユーザー入力の検証、設定値の管理において、string 型の適切な使用は重要です。

**🎯 どういう場面で使うのか**

- **API レスポンス**: サーバーから受け取る文字列データの型安全な処理
- **ユーザー入力**: フォームの入力値やファイル名の検証
- **設定管理**: 環境変数や設定ファイルの値の管理
- **文字列操作**: テキスト処理やフォーマット処理での型安全性確保

```typescript
// 基本的な string 型の使用
let userName: string = "Alice";
let welcomeMessage: string = `Welcome, ${userName}!`;
let multilineText: string = `
  This is a multiline
  string for documentation
  or template purposes.
`;

// 文字列リテラル型（より厳密な型制御）
type Status = "pending" | "approved" | "rejected";
let orderStatus: Status = "pending";

// API レスポンスでの活用例
interface ApiResponse {
  message: string;
  status: Status;
  userId: string;
}

function processApiResponse(response: ApiResponse): string {
  return `Status: ${response.status}, Message: ${response.message}`;
}
```

**📝 コードの詳細解説**

- **基本的な string 型**: 文字列値を安全に格納し、文字列メソッドの使用を保証
- **テンプレートリテラル**: `${}` を使用した変数埋め込みも型安全に実行
- **文字列リテラル型**: 特定の文字列値のみを許可する厳密な型制御
- **インターフェースでの活用**: オブジェクトのプロパティとして型安全な文字列管理

**⚠️ よくある間違いと注意点**

```typescript
// ❌ 間違い: 数値との混同
let userId: string = "123";
let numericId: number = userId; // Error: Type 'string' is not assignable to type 'number'

// ✅ 正解: 適切な型変換
let numericId: number = parseInt(userId, 10);

// ❌ 間違い: null/undefined の混入
let optionalName: string = null; // Error (strictNullChecks有効時)

// ✅ 正解: Union型での適切な処理
let optionalName: string | null = null;
if (optionalName !== null) {
  console.log(optionalName.toUpperCase()); // 型安全
}
```

**🚀 実際の開発での活用例**

```typescript
// フォームバリデーション
function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// 設定管理
type Environment = "development" | "staging" | "production";
const API_ENDPOINTS: Record<Environment, string> = {
  development: "http://localhost:3000/api",
  staging: "https://staging-api.example.com",
  production: "https://api.example.com",
};

function getApiEndpoint(env: Environment): string {
  return API_ENDPOINTS[env];
}

// ログ管理
type LogLevel = "debug" | "info" | "warn" | "error";
function log(level: LogLevel, message: string): void {
  console.log(
    `[${level.toUpperCase()}] ${new Date().toISOString()}: ${message}`
  );
}
```

##### 2. number 型 - 数値の型安全な処理

> 💡 **詳細解説**: number 型の詳細と数値処理パターンは [Step02*補足*専門用語集.md#プリミティブ型 primitive-types](./Step02_補足_専門用語集.md#プリミティブ型primitive-types) を見てね 🐰

**💡 なぜこの型が重要なのか**

number 型は、JavaScript の数値（整数・浮動小数点）に型安全性を提供します。JavaScript では文字列と数値の暗黙的変換や、NaN・Infinity の扱いが複雑ですが、TypeScript の number 型により、数値計算の安全性が大幅に向上します。特に、金額計算、座標処理、統計計算において重要です。

**🎯 どういう場面で使うのか**

- **金額計算**: 価格、税金、割引などの正確な計算
- **座標・測定**: 位置情報、距離、角度などの数値処理
- **統計・分析**: データ集計、平均値、パーセンテージの計算
- **設定値**: タイムアウト、リミット、閾値などの数値設定

```typescript
// 基本的な number 型の使用
let age: number = 25;
let price: number = 99.99;
let discount: number = 0.15; // 15%割引

// 様々な数値表現
let binary: number = 0b1010; // 2進数 (10)
let octal: number = 0o744; // 8進数 (484)
let hex: number = 0xff; // 16進数 (255)

// 数値リテラル型（厳密な値制御）
type DiceValue = 1 | 2 | 3 | 4 | 5 | 6;
let diceRoll: DiceValue = 3;

// 実用的な数値処理
interface Product {
  id: number;
  name: string;
  price: number;
  taxRate: number;
}

function calculateTotalPrice(product: Product, quantity: number): number {
  const subtotal = product.price * quantity;
  const tax = subtotal * product.taxRate;
  return Math.round((subtotal + tax) * 100) / 100; // 小数点以下2桁で丸め
}
```

**📝 コードの詳細解説**

- **基本的な number 型**: 整数・浮動小数点を統一的に扱う
- **数値リテラル**: 2 進数、8 進数、16 進数の表現も型安全に管理
- **数値リテラル型**: 特定の数値のみを許可する厳密な型制御
- **計算処理**: 型安全な数値計算と適切な丸め処理

**⚠️ よくある間違いと注意点**

```typescript
// ❌ 間違い: 文字列との混同
let count: number = "5"; // Error: Type 'string' is not assignable to type 'number'

// ✅ 正解: 適切な型変換
let count: number = parseInt("5", 10);
let floatValue: number = parseFloat("3.14");

// ❌ 間違い: NaN の扱い
function divide(a: number, b: number): number {
  return a / b; // b が 0 の場合 Infinity が返される
}

// ✅ 正解: 適切なエラーハンドリング
function safeDivide(a: number, b: number): number | null {
  if (b === 0) return null;
  const result = a / b;
  return isNaN(result) ? null : result;
}
```

**🚀 実際の開発での活用例**

```typescript
// 座標計算システム
interface Point {
  x: number;
  y: number;
}

function calculateDistance(p1: Point, p2: Point): number {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.sqrt(dx * dx + dy * dy);
}

// 統計計算
function calculateStatistics(numbers: number[]): {
  mean: number;
  median: number;
  standardDeviation: number;
} {
  const sorted = [...numbers].sort((a, b) => a - b);
  const mean = numbers.reduce((sum, n) => sum + n, 0) / numbers.length;
  const median =
    sorted.length % 2 === 0
      ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
      : sorted[Math.floor(sorted.length / 2)];

  const variance =
    numbers.reduce((sum, n) => sum + Math.pow(n - mean, 2), 0) / numbers.length;
  const standardDeviation = Math.sqrt(variance);

  return { mean, median, standardDeviation };
}
```

##### 3. boolean 型 - 論理値の明確な管理

> 💡 **詳細解説**: boolean 型の詳細と論理判定パターンは [Step02*補足*専門用語集.md#プリミティブ型 primitive-types](./Step02_補足_専門用語集.md#プリミティブ型primitive-types) を見てね 🐰

**💡 なぜこの型が重要なのか**

boolean 型は、真偽値を明確に管理し、条件分岐やフラグ管理を型安全に行うための基本型です。JavaScript では truthy/falsy の概念により予期しない動作が発生することがありますが、TypeScript の boolean 型により、論理的な判定を明確に表現できます。

**🎯 どういう場面で使うのか**

- **状態管理**: コンポーネントやアプリケーションの状態フラグ
- **条件分岐**: 複雑な条件ロジックの明確な表現
- **設定管理**: 機能の有効/無効フラグ
- **バリデーション**: 検証結果の真偽値表現

```typescript
// 基本的な boolean 型の使用
let isActive: boolean = true;
let isCompleted: boolean = false;
let hasPermission: boolean = true;

// 状態管理での活用
interface UserState {
  isLoggedIn: boolean;
  isAdmin: boolean;
  hasNotifications: boolean;
  isDarkMode: boolean;
}

function updateUserInterface(state: UserState): void {
  if (state.isLoggedIn) {
    showUserDashboard();
    if (state.isAdmin) {
      showAdminPanel();
    }
  } else {
    showLoginForm();
  }

  if (state.hasNotifications) {
    showNotificationBadge();
  }

  applyTheme(state.isDarkMode ? "dark" : "light");
}
```

**📝 コードの詳細解説**

- **明確な真偽値**: true/false の明示的な値で状態を表現
- **状態管理**: オブジェクトのプロパティとして複数の boolean フラグを管理
- **条件分岐**: boolean 値による明確な条件判定
- **設定管理**: 環境や機能の有効/無効を boolean で制御

**⚠️ よくある間違いと注意点**

```typescript
// ❌ 間違い: truthy/falsy との混同
let isValid: boolean = "true"; // Error: Type 'string' is not assignable to type 'boolean'

// ✅ 正解: 明示的な boolean 変換
let isValid: boolean = Boolean("true"); // true

// ❌ 間違い: 条件式の結果を boolean として扱わない
function checkAge(age: number) {
  return age >= 18; // 戻り値の型が推論されるが明示的でない
}

// ✅ 正解: 明示的な boolean 戻り値
function checkAge(age: number): boolean {
  return age >= 18;
}
```

**🚀 実際の開発での活用例**

```typescript
// フォームバリデーション
interface ValidationResult {
  isValid: boolean;
  hasErrors: boolean;
  isRequired: boolean;
}

function validateForm(formData: Record<string, string>): ValidationResult {
  const requiredFields = ["name", "email"];
  const hasAllRequired = requiredFields.every(
    (field) => formData[field] && formData[field].trim().length > 0
  );

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email || "");

  return {
    isValid: hasAllRequired && emailValid,
    hasErrors: !hasAllRequired || !emailValid,
    isRequired: requiredFields.length > 0,
  };
}
```

##### 4. null と undefined - 値の不在の適切な管理

> 💡 **詳細解説**: null/undefined 型の詳細と安全な処理方法は [Step02*補足*専門用語集.md#プリミティブ型 primitive-types](./Step02_補足_専門用語集.md#プリミティブ型primitive-types) と [Step02*補足*トラブルシューティング.md#nullundefined 関連のエラー](./Step02_補足_トラブルシューティング.md#nullundefined関連のエラー) を見てね 🐰

**💡 なぜこの型が重要なのか**

null と undefined は、値の不在を表現する重要な型です。JavaScript では両者の区別が曖昧でバグの原因となることが多いですが、TypeScript では明確に区別し、適切な型安全性を提供します。特に、API レスポンスの処理、オプショナルなデータの管理、エラーハンドリングにおいて重要です。

**🎯 どういう場面で使うのか**

- **API レスポンス**: データが存在しない場合の適切な表現
- **オプショナルデータ**: 必須でない情報の管理
- **初期化処理**: 値が設定される前の状態表現
- **エラーハンドリング**: 処理失敗時の値の不在表現

```typescript
// null と undefined の基本的な使い分け
let explicitlyEmpty: null = null; // 意図的に空の値
let notYetInitialized: undefined = undefined; // まだ初期化されていない

// Union型での活用
let userName: string | null = null; // ユーザー名が設定されていない
let userAge: number | undefined = undefined; // 年齢が不明

// API レスポンスでの活用
interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string; // オプショナル（undefined の可能性）
  lastLoginAt: Date | null; // 明示的に null の可能性
}

async function fetchUser(id: number): Promise<User | null> {
  try {
    const response = await fetch(`/api/users/${id}`);
    if (!response.ok) {
      return null; // ユーザーが見つからない場合
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch user:", error);
    return null;
  }
}
```

**📝 コードの詳細解説**

- **null**: 意図的に「値が存在しない」ことを表現
- **undefined**: 「まだ値が設定されていない」ことを表現
- **Union 型**: `| null` や `| undefined` で値の不在を型レベルで表現
- **オプショナルプロパティ**: `?` を使用して undefined の可能性を表現

**⚠️ よくある間違いと注意点**

```typescript
// ❌ 間違い: null/undefined チェックの不備
function processUser(user: User | null): void {
  console.log(user.name); // Error: Object is possibly 'null'
}

// ✅ 正解: 適切な null チェック
function processUser(user: User | null): void {
  if (user !== null) {
    console.log(user.name); // 型安全
  }
}

// ❌ 間違い: == による曖昧な比較
if (value == null) {
  // null と undefined の両方にマッチ
  // 意図が不明確
}

// ✅ 正解: 厳密な比較
if (value === null) {
  // null のみ
} else if (value === undefined) {
  // undefined のみ
}
```

**🚀 実際の開発での活用例**

```typescript
// 設定管理システム
interface AppSettings {
  theme: "light" | "dark" | null; // null = システム設定に従う
  language: string | undefined; // undefined = ブラウザ設定に従う
  notifications: {
    email: boolean;
    push: boolean;
  } | null; // null = 通知設定未設定
}

function getEffectiveTheme(settings: AppSettings): "light" | "dark" {
  if (settings.theme !== null) {
    return settings.theme;
  }

  // システム設定を確認
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}
```

### Section 2: 型推論の完全理解

#### 🎯 型推論の詳細メカニズムと実践活用

> 💡 **詳細解説**: 型推論のメカニズムと活用方法は [Step02*補足*専門用語集.md#型推論関連用語](./Step02_補足_専門用語集.md#型推論関連用語) と [Step02*補足*実践コード例.md#型推論の活用例](./Step02_補足_実践コード例.md#型推論の活用例) を見てね 🐰

**💡 なぜ型推論が重要なのか**

型推論は、TypeScript の最も強力な機能の一つです。開発者が明示的に型を書かなくても、TypeScript が文脈から適切な型を自動的に推論します。これにより、コードの簡潔性を保ちながら型安全性を確保できます。特に、大規模なプロジェクトでは、型推論により開発効率が大幅に向上し、保守性も向上します。

**🎯 どういう場面で活用するのか**

- **変数宣言**: 初期値から型を自動推論
- **関数の戻り値**: 処理内容から戻り値の型を推論
- **配列・オブジェクト**: 要素やプロパティから構造を推論
- **条件分岐**: 型ガードによる型の絞り込み
- **ライブラリ使用**: 外部ライブラリの型定義から推論

##### 1. 基本的な型推論の仕組み

**💡 なぜこの機能が重要なのか**

基本的な型推論により、開発者は冗長な型注釈を書く必要がなくなります。TypeScript は初期値や代入される値から適切な型を推論し、その後の操作で型安全性を保証します。

**🎯 どういう場面で使うのか**

- **変数の初期化**: 値から型を自動推論
- **定数の定義**: リテラル値から厳密な型を推論
- **簡単な計算**: 演算結果の型を推論

```typescript
// 基本的な型推論（let使用）
let inferredString = "Hello TypeScript"; // string型として推論
let inferredNumber = 42; // number型として推論
let inferredBoolean = true; // boolean型として推論

// constによる厳密な型推論（リテラル型推論）
const userName = "Alice"; // "Alice"型（文字列リテラル型）
const userAge = 25; // 25型（数値リテラル型）
const isActive = true; // true型（真偽値リテラル型）

// let vs const の型推論の違い
let mutableStatus = "pending"; // string型（再代入可能）
const immutableStatus = "pending"; // "pending"型（厳密なリテラル型）

// 実践的な推論例
const config = {
  apiUrl: "https://api.example.com",
  timeout: 5000,
  retryCount: 3,
}; // { apiUrl: string; timeout: number; retryCount: number; }型として推論

// 配列の推論
const numbers = [1, 2, 3, 4, 5]; // readonly [1, 2, 3, 4, 5]型として推論
const names = ["Alice", "Bob", "Charlie"] as const; // readonly ["Alice", "Bob", "Charlie"]型

// 計算結果の推論
const total = 100 + 50; // 150型（リテラル型）
const message = `User: ${userName}`; // `User: Alice`型（テンプレートリテラル型）
```

**📝 コードの詳細解説**

- **let vs const の型推論の違い**: `let`は広い型（string, number）、`const`は厳密なリテラル型を推論
- **リテラル型推論**: `const`で定義された値は具体的な値そのものが型になる
- **オブジェクトの型推論**: プロパティの型から全体の構造を自動推論
- **as const アサーション**: 配列やオブジェクトを読み取り専用のリテラル型として推論
- **テンプレートリテラル型**: 文字列テンプレートから具体的な文字列型を推論
- **実用性の向上**: 型推論により冗長な型注釈を削減しつつ型安全性を確保

**⚠️ よくある間違いと注意点**

```typescript
// ❌ 間違い: 型推論に頼りすぎる
let data; // any型になってしまう
data = "string";
data = 123; // 型安全性が失われる

// ✅ 正解: 適切な初期化または明示的型注釈
let data: string | number; // Union型で明示
let initializedData = "initial value"; // 初期値で推論

// ❌ 間違い: 推論結果を理解せずに使用
let mixed = [1, "hello"]; // (string | number)[]として推論
mixed.push(true); // Error: Argument of type 'boolean' is not assignable

// ✅ 正解: 推論結果を理解した使用
let mixed: (string | number | boolean)[] = [1, "hello"];
mixed.push(true); // OK
```

**🚀 実際の開発での活用例**

```typescript
// 設定オブジェクトの推論
const appConfig = {
  apiUrl: "https://api.example.com",
  timeout: 5000,
  retries: 3,
  enableLogging: true,
}; // 型が自動推論される

// 関数の引数での推論活用
function processConfig(config: typeof appConfig) {
  // configの型は自動的に推論される
  console.log(`API URL: ${config.apiUrl}`);
  console.log(`Timeout: ${config.timeout}ms`);
  config.apiUrl = 1; // ERROR Type 'number' is not assignable to type 'string'.
}

// API レスポンスの推論
async function fetchUserData() {
  const response = await fetch("/api/user");
  const userData = await response.json(); // any型（注意が必要）

  // より安全なアプローチ
  const typedUserData: { name: string; age: number } = await response.json();
  return typedUserData; // 型安全な戻り値
}
```

##### 2. 最適共通型（Best Common Type）の理解

**💡 なぜこの機能が重要なのか**

最適共通型は、異なる型の値が混在する配列やオブジェクトで、TypeScript が最も適切な共通の型を推論する仕組みです。これにより、柔軟なデータ構造を型安全に扱うことができます。

**🎯 どういう場面で使うのか**

- **混合配列**: 異なる型の要素を含む配列
- **条件付き代入**: 条件によって異なる型の値を代入
- **API レスポンス**: 動的な構造を持つデータ
- **設定値**: 複数の型を許可する設定項目

```typescript
// 混合配列での最適共通型
let mixedArray = [1, "hello", true]; // (string | number | boolean)[]
let numberOrString = [1, "two", 3]; // (string | number)[]

// より複雑な例
let complexArray = [
  { type: "user", name: "Alice" },
  { type: "admin", permissions: ["read", "write"] },
  { type: "guest" },
]; // Union型のオブジェクト配列として推論

// 条件付き代入での推論
function getValue(condition: boolean) {
  return condition ? "success" : 404; // string | number として推論
}

// 関数の戻り値での最適共通型
function processData(data: unknown) {
  if (typeof data === "string") {
    return data.toUpperCase(); // string
  } else if (typeof data === "number") {
    return data * 2; // number
  } else {
    return null; // null
  }
  // 戻り値の型: string | number | null
}
```

**📝 コードの詳細解説**

- **Union 型の自動生成**: 複数の型から最適な Union 型を推論
- **構造的な推論**: オブジェクトの構造から共通の型を見つける
- **条件分岐での型合成**: 各分岐の戻り値から全体の型を推論
- **型の優先順位**: より具体的な型を優先した推論

**⚠️ よくある間違いと注意点**

```typescript
// ❌ 間違い: 推論結果を理解せずに使用
let values = [1, "two", true];
values.forEach((value) => {
  console.log(value.toUpperCase()); // Error: toUpperCase は string にのみ存在
});

// ✅ 正解: 型ガードを使用した安全な処理
values.forEach((value) => {
  if (typeof value === "string") {
    console.log(value.toUpperCase()); // 型安全
  } else {
    console.log(value.toString());
  }
});

// ❌ 間違い: 意図しない型の拡張
let config = {
  mode: "development", // string として推論（意図: "development" | "production"）
};

// ✅ 正解: 明示的な型制約
let config: { mode: "development" | "production" } = {
  mode: "development",
};
// または
let config = {
  mode: "development" as const, // "development" リテラル型として推論
};
```

**🚀 実際の開発での活用例**

```typescript
// イベントハンドラーでの活用
const eventHandlers = [
  { type: "click", handler: (e: MouseEvent) => console.log("Clicked") },
  {
    type: "keydown",
    handler: (e: KeyboardEvent) => console.log("Key pressed"),
  }
]; // 型が自動推論される

// データ変換パイプラインでの活用
function transformData(input: string | number | boolean) {
  if (typeof input === "string") {
    return { type: "text", value: input.trim(), length: input.length };
  } else if (typeof input === "number") {
    return { type: "numeric", value: input, isPositive: input > 0 };
  } else {
    return { type: "boolean", value: input, asString: input.toString() };
  }
  // 戻り値の型は自動的に Union型として推論される
}

// 設定管理での活用
const environmentConfig = {
  development: { apiUrl: "http://localhost:3000", debug: true },
  production: { apiUrl: "https://api.example.com", debug: false },
  testing: { apiUrl: "http://test.example.com", debug: true },
}; // 各環境の設定型が自動推論される

function getConfig(env: keyof typeof environmentConfig) {
  return environmentConfig[env]; // 適切な設定型が推論される
}
```

##### 3. 文脈的型推論（Contextual Typing）の活用

**💡 なぜこの機能が重要なのか**

文脈的型推論は、使用される文脈から型を推論する高度な機能です。特に、イベントハンドラー、コールバック関数、ライブラリの使用において、開発者が型を明示しなくても適切な型が推論されます。

**🎯 どういう場面で使うのか**

- **イベントハンドラー**: DOM イベントの型を自動推論
- **配列メソッド**: map、filter、reduce などのコールバック
- **Promise チェーン**: then、catch での型推論
- **ライブラリ使用**: 外部ライブラリの型定義から推論

```typescript
// DOM イベントでの文脈的型推論
const button = document.querySelector("button");
button?.addEventListener("click", function (event) {
  // eventは自動的にMouseEvent型として推論
  console.log(`Clicked at: ${event.clientX}, ${event.clientY}`);
  console.log(`Button: ${event.button}`); // MouseEvent特有のプロパティ
});

// 配列メソッドでの文脈的型推論
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map((num) => num * 2); // numはnumber型として推論
const evens = numbers.filter((num) => num % 2 === 0); // numはnumber型として推論

// より複雑な例
const users = [
  { name: "Alice", age: 30, role: "admin" },
  { name: "Bob", age: 25, role: "user" },
  { name: "Charlie", age: 35, role: "moderator" },
];

const userNames = users.map((user) => user.name); // userは自動推論される
const adults = users.filter((user) => user.age >= 18); // 型安全なフィルタリング

// Promise での文脈的型推論
fetch("/api/users")
  .then((response) => response.json()) // responseはResponse型
  .then((data) => {
    // dataの型は推論されるが、any型になる可能性があるため注意
    console.log(data);
  })
  .catch((error) => {
    // errorは自動的にany型として推論
    console.error("Error:", error);
  });
```

**📝 コードの詳細解説**

- **イベント型の推論**: DOM 要素とイベント名から適切なイベント型を推論
- **コールバック引数の推論**: 配列の要素型からコールバック引数の型を推論
- **戻り値の推論**: コールバックの戻り値から全体の型を推論
- **ライブラリ型の活用**: 外部ライブラリの型定義を活用した推論

**⚠️ よくある間違いと注意点**

```typescript
// ❌ 間違い: 文脈的型推論に過度に依存
fetch("/api/data")
  .then((response) => response.json())
  .then((data) => {
    // dataはany型になる可能性が高い
    console.log(data.someProperty); // 型安全性が失われる
  });

// ✅ 正解: 適切な型注釈の併用
interface ApiResponse {
  users: { name: string; age: number }[];
  total: number;
}

fetch("/api/data")
  .then((response) => response.json())
  .then((data: ApiResponse) => {
    // 型安全な処理
    console.log(`Total users: ${data.total}`);
    data.users.forEach((user) => console.log(user.name));
  });

// ❌ 間違い: 型推論の結果を理解せずに使用
const mixedData = [1, "hello", { name: "test" }];
mixedData.forEach((item) => {
  console.log(item.name); // Error: name プロパティが存在しない可能性
});

// ✅ 正解: 型ガードを使用した安全な処理
mixedData.forEach((item) => {
  if (typeof item === "object" && item !== null && "name" in item) {
    console.log(item.name); // 型安全
  }
});
```

**🚀 実際の開発での活用例**

```typescript
// React コンポーネントでの活用例
interface ButtonProps {
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  children: React.ReactNode;
}

function Button({ onClick, children }: ButtonProps) {
  return (
    <button
      onClick={onClick} // 文脈的型推論により適切な型が推論される
    >
      {children}
    </button>
  );
}

// 使用時
<Button
  onClick={(event) => {
    // eventは自動的にReact.MouseEvent<HTMLButtonElement>型として推論
    console.log("Button clicked:", event.currentTarget.textContent);
  }}
>
  Click me
</Button>;

// 非同期処理での活用
async function processUserData() {
  const users = await fetchUsers(); // 戻り値の型が推論される

  const processedUsers = users
    .filter((user) => user.isActive) // userの型が推論される
    .map((user) => ({
      // 戻り値の型が推論される
      id: user.id,
      displayName: `${user.firstName} ${user.lastName}`,
      email: user.email,
    }))
    .sort((a, b) => a.displayName.localeCompare(b.displayName)); // a, bの型が推論される

  return processedUsers;
}

// 高階関数での活用
function createValidator<T>(
  validationFn: (value: T) => boolean,
  errorMessage: string
) {
  return (value: T) => {
    // valueの型はTとして推論される
    if (!validationFn(value)) {
      throw new Error(errorMessage);
    }
    return value;
  };
}

const validateEmail = createValidator(
  (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
  "Invalid email format"
);

const validateAge = createValidator(
  (age: number) => age >= 0 && age <= 120,
  "Age must be between 0 and 120"
);
```

##### 4. 型推論の限界と明示的型注釈の使い分け

**💡 なぜ明示的型注釈が必要なのか**

型推論は強力ですが、すべての場面で適切な型を推論できるわけではありません。特に、初期値がない変数、複雑な型構造、外部からのデータなどでは、明示的な型注釈が必要です。適切な使い分けにより、型安全性と開発効率の両方を確保できます。

**🎯 どういう場面で明示的型注釈が必要か**

- **初期値のない変数**: 宣言時に値が決まらない場合
- **関数の引数**: 呼び出し元から型を推論できない場合
- **複雑な型構造**: Union 型、ジェネリクスなどの複雑な型
- **外部データ**: API レスポンス、ファイル読み込みなど

```typescript
// 型推論の限界例
let value; // any型（推論不可）
value = "string";
value = 42; // 型安全性が失われる

// 明示的型注釈による解決
let typedValue: string | number; // Union型で明示
typedValue = "string"; // OK
typedValue = 42; // OK
// typedValue = true; // Error: Type 'boolean' is not assignable

// 関数引数での明示的型注釈
function processData(data: unknown): string {
  // dataの型が不明なため、型ガードが必要
  if (typeof data === "string") {
    return data.toUpperCase();
  } else if (typeof data === "number") {
    return data.toString();
  } else {
    return "Invalid data";
  }
}

// 複雑な型構造での明示的型注釈
interface User {
  id: number;
  name: string;
  email: string;
  preferences?: {
    theme: "light" | "dark";
    notifications: boolean;
  };
}

let currentUser: User | null = null; // 明示的にnullの可能性を示す

// 配列の型制約
let userIds: number[] = []; // 空配列では型推論できない
userIds.push(1, 2, 3); // OK
// userIds.push("invalid"); // Error

// ジェネリクス関数での型注釈
function createArray<T>(length: number, value: T): T[] {
  return Array(length).fill(value);
}

const stringArray = createArray(3, "hello"); // string[]として推論
const numberArray = createArray<number>(5, 0); // 明示的な型指定
```

**📝 コードの詳細解説**

- **any 型の回避**: 明示的型注釈により型安全性を確保
- **Union 型の活用**: 複数の型を許可する柔軟な型定義
- **型ガードの併用**: 実行時の型チェックと静的型チェックの組み合わせ
- **ジェネリクスの活用**: 再利用可能な型安全な関数の作成

**⚠️ よくある間違いと注意点**

```typescript
// ❌ 間違い: 過度な明示的型注釈
let name: string = "Alice"; // 推論で十分
let age: number = 30; // 推論で十分
let isActive: boolean = true; // 推論で十分

// ✅ 正解: 推論を活用
let name = "Alice"; // string型として推論
let age = 30; // number型として推論
let isActive = true; // boolean型として推論

// ❌ 間違い: any型の乱用
let data: any = fetchDataFromAPI(); // 型安全性が失われる

// ✅ 正解: 適切な型定義
interface ApiData {
  users: User[];
  total: number;
  page: number;
}
let data: ApiData = await fetchDataFromAPI();

// ❌ 間違い: 型注釈の不一致
let count: string = 42; // Error: Type 'number' is not assignable to type 'string'

// ✅ 正解: 一致した型注釈
let count: number = 42;
let countString: string = count.toString();
```

**🚀 実際の開発での活用例**

```typescript
// API クライアントでの型注釈活用
class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json() as T; // 明示的な型アサーション
  }

  async post<T, U>(endpoint: string, data: T): Promise<U> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return response.json() as U;
  }
}

// 使用例
const apiClient = new ApiClient("https://api.example.com");

interface CreateUserRequest {
  name: string;
  email: string;
}

interface CreateUserResponse {
  id: number;
  name: string;
  email: string;
  createdAt: string;
}

async function createUser(userData: CreateUserRequest) {
  // 型安全なAPI呼び出し
  const newUser = await apiClient.post<CreateUserRequest, CreateUserResponse>(
    "/users",
    userData
  );

  console.log(`Created user with ID: ${newUser.id}`);
  return newUser;
}

// 状態管理での型注釈活用
type LoadingState = "idle" | "loading" | "success" | "error";

interface AppState {
  user: User | null;
  loadingState: LoadingState;
  error: string | null;
}

class StateManager {
  private state: AppState = {
    user: null,
    loadingState: "idle",
    error: null,
  };

  setState(partialState: Partial<AppState>): void {
    this.state = { ...this.state, ...partialState };
  }

  getState(): Readonly<AppState> {
    return { ...this.state };
  }
}
```

### Section 3: 配列とタプル型の実践活用

#### 🔧 配列型の詳細活用と実践パターン

> 💡 **詳細解説**: 配列型の詳細と活用パターンは [Step02*補足*専門用語集.md#配列タプル関連用語](./Step02_補足_専門用語集.md#配列タプル関連用語) と [Step02*補足*実践コード例.md#配列タプル操作の実践](./Step02_補足_実践コード例.md#配列タプル操作の実践) を見てね 🐰

##### 1. 基本的な配列型の理解と活用

**💡 なぜ配列型が重要なのか**

配列型は、同じ型の複数の値を安全に管理するための基本的な型です。JavaScript の配列は動的で型安全性がありませんが、TypeScript の配列型により、要素の型が保証され、配列操作時の型安全性が確保されます。特に、データ処理、リスト管理、API レスポンスの処理において重要です。

**🎯 どういう場面で使うのか**

- **データリスト**: ユーザーリスト、商品リスト、設定項目の管理
- **数値計算**: 統計処理、集計処理、数学的計算
- **文字列処理**: テキスト解析、検索結果、タグ管理
- **状態管理**: 複数の状態やイベントの管理

```typescript
// 基本的な配列型の定義
let userIds: number[] = [1, 2, 3, 4, 5];
let userNames: string[] = ["Alice", "Bob", "Charlie"];
let activeFlags: boolean[] = [true, false, true];

// 代替記法（ジェネリクス形式）
let scores: Array<number> = [85, 92, 78, 96];
let tags: Array<string> = ["typescript", "javascript", "react"];

// 実用的な例：ユーザー管理
interface User {
  id: number;
  name: string;
  email: string;
  isActive: boolean;
}

let users: User[] = [
  { id: 1, name: "Alice", email: "alice@example.com", isActive: true },
  { id: 2, name: "Bob", email: "bob@example.com", isActive: false },
  { id: 3, name: "Charlie", email: "charlie@example.com", isActive: true },
];

// 配列の型安全な操作
function getActiveUsers(users: User[]): User[] {
  return users.filter((user) => user.isActive);
}

function getUserNames(users: User[]): string[] {
  return users.map((user) => user.name);
}

function getTotalUsers(users: User[]): number {
  return users.length;
}
```

**📝 コードの詳細解説**

- **型安全性**: 配列の要素型が保証され、間違った型の要素の追加を防ぐ
- **メソッドの型推論**: map、filter、reduce などのメソッドで適切な型が推論される
- **インターフェースとの組み合わせ**: 複雑なオブジェクトの配列も型安全に管理
- **関数の引数・戻り値**: 配列を扱う関数の型安全性を確保

**⚠️ よくある間違いと注意点**

```typescript
// ❌ 間違い: 型の混在
let mixedData: number[] = [1, 2, "three"]; // Error: Type 'string' is not assignable

// ✅ 正解: Union型の使用
let mixedData: (number | string)[] = [1, 2, "three"];

// ❌ 間違い: 空配列の型推論
let emptyArray = []; // any[]として推論される
emptyArray.push("string");
emptyArray.push(123); // 型安全性が失われる

// ✅ 正解: 明示的な型注釈
let emptyNumbers: number[] = [];
let emptyStrings: string[] = [];

// ❌ 間違い: 配列メソッドの戻り値を理解しない
let numbers = [1, 2, 3, 4, 5];
let doubled = numbers.map((n) => n * 2);
doubled.push("invalid"); // Error: Argument of type 'string' is not assignable

// ✅ 正解: 戻り値の型を理解した使用
let doubled: number[] = numbers.map((n) => n * 2); // number[]として推論
```

**🚀 実際の開発での活用例**

```typescript
// ショッピングカート管理
interface CartItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
}

class ShoppingCart {
  private items: CartItem[] = [];

  addItem(item: CartItem): void {
    const existingItem = this.items.find((i) => i.productId === item.productId);
    if (existingItem) {
      existingItem.quantity += item.quantity;
    } else {
      this.items.push({ ...item });
    }
  }

  removeItem(productId: number): void {
    this.items = this.items.filter((item) => item.productId !== productId);
  }

  getTotalPrice(): number {
    return this.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  }

  getItems(): readonly CartItem[] {
    return [...this.items]; // イミュータブルなコピーを返す
  }

  getItemCount(): number {
    return this.items.reduce((count, item) => count + item.quantity, 0);
  }
}

// データ変換パイプライン
function processUserData(rawData: unknown[]): User[] {
  return rawData
    .filter((item): item is any => typeof item === "object" && item !== null)
    .filter(
      (item) => typeof item.id === "number" && typeof item.name === "string"
    )
    .map((item) => ({
      id: item.id,
      name: item.name,
      email: item.email || "",
      isActive: Boolean(item.isActive),
    }));
}

// 検索・フィルタリング機能
class UserSearchService {
  private users: User[];

  constructor(users: User[]) {
    this.users = users;
  }

  searchByName(query: string): User[] {
    const lowerQuery = query.toLowerCase();
    return this.users.filter((user) =>
      user.name.toLowerCase().includes(lowerQuery)
    );
  }

  filterByStatus(isActive: boolean): User[] {
    return this.users.filter((user) => user.isActive === isActive);
  }

  sortByName(ascending: boolean = true): User[] {
    return [...this.users].sort((a, b) => {
      const comparison = a.name.localeCompare(b.name);
      return ascending ? comparison : -comparison;
    });
  }

  paginate(page: number, pageSize: number): User[] {
    const startIndex = (page - 1) * pageSize;
    return this.users.slice(startIndex, startIndex + pageSize);
  }
}
```

##### 2. 多次元配列の実践的活用

> 💡 **詳細解説**: 多次元配列の活用例とパターンは [Step02*補足*実践コード例.md#多次元配列の操作](./Step02_補足_実践コード例.md#多次元配列の操作) と [Step02*補足*トラブルシューティング.md#配列タプル関連のエラー](./Step02_補足_トラブルシューティング.md#配列タプル関連のエラー) を見てね 🐰

**💡 なぜ多次元配列が重要なのか**

多次元配列は、表形式のデータ、行列計算、ゲームのマップ、画像データなど、2 次元以上の構造を持つデータを型安全に扱うために重要です。TypeScript では、ネストした配列の型も適切に推論・チェックされます。

**🎯 どういう場面で使うのか**

- **表形式データ**: CSV データ、スプレッドシートの処理
- **行列計算**: 数学的計算、統計処理
- **ゲーム開発**: マップデータ、ボードゲームの状態
- **画像処理**: ピクセルデータ、RGB 値の管理

```typescript
// 2次元配列（行列）
let matrix: number[][] = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
];

// 3次元配列（立体データ）
let cube: number[][][] = [
  [
    [1, 2],
    [3, 4],
  ],
  [
    [5, 6],
    [7, 8],
  ],
];

// 実用例：ゲームボード
type CellState = "empty" | "player1" | "player2";
type GameBoard = CellState[][];

class TicTacToe {
  private board: GameBoard;

  constructor() {
    this.board = [
      ["empty", "empty", "empty"],
      ["empty", "empty", "empty"],
      ["empty", "empty", "empty"],
    ];
  }

  makeMove(row: number, col: number, player: "player1" | "player2"): boolean {
    if (this.board[row][col] === "empty") {
      this.board[row][col] = player;
      return true;
    }
    return false;
  }

  checkWinner(): "player1" | "player2" | "draw" | "ongoing" {
    // 行のチェック
    for (let row of this.board) {
      if (row[0] !== "empty" && row[0] === row[1] && row[1] === row[2]) {
        return row[0];
      }
    }

    // 列のチェック
    for (let col = 0; col < 3; col++) {
      if (
        this.board[0][col] !== "empty" &&
        this.board[0][col] === this.board[1][col] &&
        this.board[1][col] === this.board[2][col]
      ) {
        return this.board[0][col];
      }
    }

    // 対角線のチェック
    if (
      this.board[0][0] !== "empty" &&
      this.board[0][0] === this.board[1][1] &&
      this.board[1][1] === this.board[2][2]
    ) {
      return this.board[0][0];
    }

    if (
      this.board[0][2] !== "empty" &&
      this.board[0][2] === this.board[1][1] &&
      this.board[1][1] === this.board[2][0]
    ) {
      return this.board[0][2];
    }

    // 引き分けまたは継続中の判定
    const isEmpty = this.board.some((row) =>
      row.some((cell) => cell === "empty")
    );
    return isEmpty ? "ongoing" : "draw";
  }

  getBoard(): readonly (readonly CellState[])[] {
    return this.board.map((row) => [...row]);
  }
}

// CSV データ処理
type CSVData = string[][];

function parseCSV(csvText: string): CSVData {
  return csvText
    .trim()
    .split("\n")
    .map((line) => line.split(",").map((cell) => cell.trim()));
}

function getColumn(data: CSVData, columnIndex: number): string[] {
  return data.map((row) => row[columnIndex] || "");
}

function getRow(data: CSVData, rowIndex: number): string[] {
  return data[rowIndex] || [];
}

// 行列計算
function multiplyMatrices(a: number[][], b: number[][]): number[][] {
  const result: number[][] = [];

  for (let i = 0; i < a.length; i++) {
    result[i] = [];
    for (let j = 0; j < b[0].length; j++) {
      let sum = 0;
      for (let k = 0; k < b.length; k++) {
        sum += a[i][k] * b[k][j];
      }
      result[i][j] = sum;
    }
  }

  return result;
}
```

**📝 コードの詳細解説**

- **ネストした型定義**: `number[][]` のような多次元配列の型定義
- **型安全なアクセス**: 各次元のインデックスアクセスも型チェックされる
- **実用的なデータ構造**: ゲームボード、CSV データなどの実際の用途
- **イミュータブルな操作**: 元の配列を変更せずに新しい配列を返す

**⚠️ よくある間違いと注意点**

```typescript
// ❌ 間違い: 不正な次元アクセス
let matrix: number[][] = [
  [1, 2],
  [3, 4],
];
console.log(matrix[0][0][0]); // Error: 3次元目は存在しない

// ✅ 正解: 適切な次元でのアクセス
console.log(matrix[0][0]); // 1

// ❌ 間違い: 配列の長さの不一致を考慮しない
function getElement(matrix: number[][], row: number, col: number): number {
  return matrix[row][col]; // 範囲外アクセスの可能性
}

// ✅ 正解: 境界チェックを含む安全なアクセス
function getElementSafely(
  matrix: number[][],
  row: number,
  col: number
): number | undefined {
  if (row >= 0 && row < matrix.length && col >= 0 && col < matrix[row].length) {
    return matrix[row][col];
  }
  return undefined;
}
```

**🚀 実際の開発での活用例**

```typescript
// 画像処理（RGB データ）
type RGBPixel = [number, number, number]; // [R, G, B]
type ImageData = RGBPixel[][];

class ImageProcessor {
  private imageData: ImageData;

  constructor(width: number, height: number) {
    this.imageData = Array(height)
      .fill(null)
      .map(() =>
        Array(width)
          .fill(null)
          .map((): RGBPixel => [0, 0, 0])
      );
  }

  setPixel(x: number, y: number, color: RGBPixel): void {
    if (
      y >= 0 &&
      y < this.imageData.length &&
      x >= 0 &&
      x < this.imageData[y].length
    ) {
      this.imageData[y][x] = color;
    }
  }

  getPixel(x: number, y: number): RGBPixel | null {
    if (
      y >= 0 &&
      y < this.imageData.length &&
      x >= 0 &&
      x < this.imageData[y].length
    ) {
      return this.imageData[y][x];
    }
    return null;
  }

  applyGrayscale(): ImageData {
    return this.imageData.map((row) =>
      row.map(([r, g, b]): RGBPixel => {
        const gray = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
        return [gray, gray, gray];
      })
    );
  }
}

// スプレッドシート処理
interface CellValue {
  value: string | number;
  formula?: string;
  format?: "text" | "number" | "currency" | "date";
}

type Spreadsheet = CellValue[][];

class SpreadsheetProcessor {
  private data: Spreadsheet;

  constructor(rows: number, cols: number) {
    this.data = Array(rows)
      .fill(null)
      .map(() =>
        Array(cols)
          .fill(null)
          .map((): CellValue => ({ value: "" }))
      );
  }

  setCellValue(row: number, col: number, value: string | number): void {
    if (this.isValidPosition(row, col)) {
      this.data[row][col] = { value };
    }
  }

  getCellValue(row: number, col: number): string | number | null {
    if (this.isValidPosition(row, col)) {
      return this.data[row][col].value;
    }
    return null;
  }

  getColumnSum(col: number): number {
    return this.data.reduce((sum, row) => {
      const cellValue = row[col]?.value;
      return sum + (typeof cellValue === "number" ? cellValue : 0);
    }, 0);
  }

  private isValidPosition(row: number, col: number): boolean {
    return (
      row >= 0 &&
      row < this.data.length &&
      col >= 0 &&
      col < this.data[0].length
    );
  }
}
```

##### 3. 読み取り専用配列の活用

> 💡 **詳細解説**: 読み取り専用配列と不変性の詳細は [Step02*補足*専門用語集.md#不変配列 readonly-arrays](./Step02_補足_専門用語集.md#不変配列readonly-arrays) と [Step02*補足*実践コード例.md#イミュータブルな配列操作](./Step02_補足_実践コード例.md#イミュータブルな配列操作) を見てね 🐰

**💡 なぜ読み取り専用配列が重要なのか**

読み取り専用配列は、データの不変性を保証し、意図しない変更を防ぐために重要です。特に、設定データ、定数配列、関数の戻り値などで、データの整合性を保つために使用されます。

**🎯 どういう場面で使うのか**

- **設定データ**: 変更されてはいけない設定値や定数
- **関数の戻り値**: 内部データを外部から変更されないように保護
- **イミュータブルな状態管理**: 状態の予期しない変更を防ぐ
- **API レスポンス**: 受け取ったデータの保護

```typescript
// 基本的な読み取り専用配列
let readonlyNumbers: readonly number[] = [1, 2, 3, 4, 5];
let readonlyStrings: ReadonlyArray<string> = ["apple", "banana", "cherry"];

// readonlyNumbers.push(6); // Error: Property 'push' does not exist
// readonlyNumbers[0] = 10; // Error: Index signature in type 'readonly number[]' only permits reading

// 設定データの保護
const API_ENDPOINTS: readonly string[] = [
  "https://api.example.com/users",
  "https://api.example.com/products",
  "https://api.example.com/orders",
];

const SUPPORTED_LANGUAGES: readonly string[] = ["en", "ja", "fr", "de", "es"];

// 関数の戻り値での活用
class UserRepository {
  private users: User[] = [];

  // 内部データを保護しつつ外部に提供
  getAllUsers(): readonly User[] {
    return [...this.users]; // 新しい配列を返すことで保護
  }

  // より厳密な保護（深いコピー）
  getUsersReadonly(): readonly (readonly User)[] {
    return this.users.map((user) => ({ ...user }));
  }

  addUser(user: User): void {
    this.users.push(user);
  }

  // 内部でのみ変更可能
  private updateUserList(users: User[]): void {
    this.users = users;
  }
}

// イミュータブルな状態管理
interface AppState {
  readonly users: readonly User[];
  readonly currentUser: User | null;
  readonly isLoading: boolean;
}

class StateManager {
  private state: AppState = {
    users: [],
    currentUser: null,
    isLoading: false,
  };

  getState(): AppState {
    return { ...this.state };
  }

  updateUsers(users: readonly User[]): void {
    this.state = {
      ...this.state,
      users: [...users], // 新しい配列として保存
    };
  }

  setCurrentUser(user: User | null): void {
    this.state = {
      ...this.state,
      currentUser: user ? { ...user } : null, // オブジェクトもコピー
    };
  }
}
```

**📝 コードの詳細解説**

- **変更メソッドの禁止**: push、pop、splice などの変更メソッドが使用不可
- **インデックス代入の禁止**: `array[index] = value` のような代入が不可
- **型安全性の向上**: 意図しない変更によるバグを防止
- **イミュータブルパターン**: 新しい配列を作成することでデータの整合性を保つ

**⚠️ よくある間違いと注意点**

```typescript
// ❌ 間違い: 読み取り専用配列の変更を試みる
const readonlyArray: readonly number[] = [1, 2, 3];
readonlyArray.push(4); // Error: Property 'push' does not exist
readonlyArray[0] = 10; // Error: Index signature only permits reading

// ✅ 正解: 新しい配列を作成
const newArray = [...readonlyArray, 4]; // [1, 2, 3, 4]
const updatedArray = readonlyArray.map((n) => (n === 1 ? 10 : n)); // [10, 2, 3]

// ❌ 間違い: 浅いコピーによる参照の共有
interface MutableUser {
  id: number;
  name: string;
  tags: string[];
}

const users: readonly MutableUser[] = [
  { id: 1, name: "Alice", tags: ["admin"] },
];

const firstUser = users[0];
firstUser.tags.push("moderator"); // 元の配列も変更される！

// ✅ 正解: 深いコピーによる完全な保護
const safeFirstUser = {
  ...users[0],
  tags: [...users[0].tags],
};
safeFirstUser.tags.push("moderator"); // 元の配列は変更されない
```

**🚀 実際の開発での活用例**

```typescript
// 設定管理システム
class ConfigManager {
  private static readonly DEFAULT_SETTINGS: readonly Setting[] = [
    { key: "theme", value: "light", type: "string" },
    { key: "language", value: "en", type: "string" },
    { key: "autoSave", value: true, type: "boolean" },
  ];

  private settings: Setting[];

  constructor() {
    // デフォルト設定をコピーして初期化
    this.settings = ConfigManager.DEFAULT_SETTINGS.map((setting) => ({
      ...setting,
    }));
  }

  getSettings(): readonly Setting[] {
    return [...this.settings];
  }

  getDefaultSettings(): readonly Setting[] {
    return ConfigManager.DEFAULT_SETTINGS;
  }

  updateSetting(key: string, value: unknown): void {
    const index = this.settings.findIndex((s) => s.key === key);
    if (index !== -1) {
      this.settings[index] = { ...this.settings[index], value };
    }
  }

  resetToDefaults(): void {
    this.settings = ConfigManager.DEFAULT_SETTINGS.map((setting) => ({
      ...setting,
    }));
  }
}

// キャッシュシステム
class CacheManager<T> {
  private cache: Map<string, readonly T[]> = new Map();

  set(key: string, data: readonly T[]): void {
    // データをコピーして保存
    this.cache.set(key, [...data]);
  }

  get(key: string): readonly T[] | undefined {
    const data = this.cache.get(key);
    return data ? [...data] : undefined; // コピーを返す
  }

  has(key: string): boolean {
    return this.cache.has(key);
  }

  clear(): void {
    this.cache.clear();
  }

  // すべてのキーを読み取り専用で返す
  getKeys(): readonly string[] {
    return Array.from(this.cache.keys());
  }
}

// イベント管理システム
interface EventListener<T> {
  readonly id: string;
  readonly callback: (data: T) => void;
  readonly once: boolean;
}

class EventEmitter<T> {
  private listeners: Map<string, EventListener<T>[]> = new Map();

  on(
    event: string,
    callback: (data: T) => void,
    once: boolean = false
  ): string {
    const id = Math.random().toString(36).substring(2);
    const listener: EventListener<T> = { id, callback, once };

    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }

    this.listeners.get(event)!.push(listener);
    return id;
  }

  emit(event: string, data: T): void {
    const eventListeners = this.listeners.get(event);
    if (!eventListeners) return;

    // リスナーのコピーを作成して安全に実行
    const listenersToCall = [...eventListeners];

    for (const listener of listenersToCall) {
      listener.callback(data);

      if (listener.once) {
        this.off(event, listener.id);
      }
    }
  }

  off(event: string, listenerId: string): void {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      const index = eventListeners.findIndex((l) => l.id === listenerId);
      if (index !== -1) {
        eventListeners.splice(index, 1);
      }
    }
  }

  getListeners(event: string): readonly EventListener<T>[] {
    const listeners = this.listeners.get(event);
    return listeners ? [...listeners] : [];
  }
}
```

#### 🎯 タプル型の実践活用と設計思想

> 💡 **詳細解説**: タプル型の詳細と実践的な活用法は [Step02*補足*専門用語集.md#配列タプル関連用語](./Step02_補足_専門用語集.md#配列タプル関連用語) と [Step02*補足*実践コード例.md#配列タプル操作の実践](./Step02_補足_実践コード例.md#配列タプル操作の実践) を見てね 🐰

**💡 なぜタプル型が重要なのか**

タプル型は、固定長で各位置に特定の型を持つ配列を表現する型です。配列とは異なり、要素数と各位置の型が厳密に定義されるため、座標、設定値、関数の複数戻り値など、構造化されたデータを型安全に扱うことができます。特に、関数型プログラミングのパターンや、複雑なデータ構造の表現において重要です。

**🎯 どういう場面で使うのか**

- **座標・位置情報**: 2D/3D 座標、RGB 値、サイズ情報
- **関数の複数戻り値**: エラーハンドリング、計算結果と状態の組み合わせ
- **設定値の組み合わせ**: 関連する複数の設定値をまとめて管理
- **データベースレコード**: 固定構造のレコードデータ
- **API レスポンス**: 構造化された応答データ

##### 1. 基本的なタプル型の理解と活用

**💡 なぜ配列ではなくタプルなのか**

タプル型は配列と異なり、要素数と各位置の型が固定されています。これにより、データの構造が明確になり、間違った位置へのアクセスや型の不一致を防ぐことができます。

```typescript
// 基本的なタプル型の定義
let coordinate: [number, number] = [10, 20]; // x, y座標
let person: [string, number, boolean] = ["Alice", 30, true]; // 名前, 年齢, アクティブ状態

// RGB色値の表現
type RGBColor = [number, number, number];
let red: RGBColor = [255, 0, 0];
let green: RGBColor = [0, 255, 0];
let blue: RGBColor = [0, 0, 255];

// サイズ情報の表現
type Size = [width: number, height: number];
let imageSize: Size = [1920, 1080];
let thumbnailSize: Size = [150, 150];

// 実用的な例：地理座標
type GeoCoordinate = [latitude: number, longitude: number];
let tokyoStation: GeoCoordinate = [35.6812, 139.7671];
let newYork: GeoCoordinate = [40.7128, -74.006];

function calculateDistance(
  coord1: GeoCoordinate,
  coord2: GeoCoordinate
): number {
  const [lat1, lon1] = coord1;
  const [lat2, lon2] = coord2;

  // ハーバーサイン公式による距離計算
  const R = 6371; // 地球の半径（km）
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

console.log(
  `Distance: ${calculateDistance(tokyoStation, newYork).toFixed(2)} km`
);
```

**📝 コードの詳細解説**

- **固定長構造**: 要素数が決まっているため、構造が明確
- **位置による型**: 各位置に特定の型が割り当てられ、型安全性を確保
- **分割代入の活用**: `const [x, y] = coordinate` のような直感的な値の取り出し
- **名前付きタプル**: TypeScript 4.0 以降で要素に名前を付けることが可能

**⚠️ よくある間違いと注意点**

```typescript
// ❌ 間違い: 配列として扱う
let coord: [number, number] = [10, 20];
coord.push(30); // Error: Property 'push' does not exist on type '[number, number]'

// ✅ 正解: タプルとして適切に扱う
let coord: [number, number] = [10, 20];
let [x, y] = coord; // 分割代入で値を取得

// ❌ 間違い: 要素数の不一致
let invalidCoord: [number, number] = [10]; // Error: Source has 1 element(s) but target requires 2

// ✅ 正解: 正確な要素数
let validCoord: [number, number] = [10, 20];

// ❌ 間違い: 型の不一致
let mixedCoord: [number, number] = [10, "20"]; // Error: Type 'string' is not assignable to type 'number'

// ✅ 正解: 適切な型
let correctCoord: [number, number] = [10, 20];
```

**🚀 実際の開発での活用例**

```typescript
// API レスポンスでの活用
type ApiResult<T> = [data: T | null, error: string | null];

async function fetchUser(id: number): Promise<ApiResult<User>> {
  try {
    const response = await fetch(`/api/users/${id}`);
    if (!response.ok) {
      return [null, `HTTP Error: ${response.status}`];
    }
    const user = await response.json();
    return [user, null];
  } catch (error) {
    return [null, error instanceof Error ? error.message : "Unknown error"];
  }
}

// 使用例
const [user, error] = await fetchUser(123);
if (error) {
  console.error("Failed to fetch user:", error);
} else if (user) {
  console.log("User:", user.name);
}

// 設定管理での活用
type DatabaseConfig = [host: string, port: number, database: string];
type RedisConfig = [host: string, port: number, password?: string];

const dbConfig: DatabaseConfig = ["localhost", 5432, "myapp"];
const redisConfig: RedisConfig = ["localhost", 6379, "secret"];

function connectToDatabase([host, port, database]: DatabaseConfig) {
  console.log(`Connecting to ${database} at ${host}:${port}`);
  // データベース接続ロジック
}

// 計算結果と状態の組み合わせ
type CalculationResult = [
  result: number,
  isValid: boolean,
  errorMessage?: string
];

function safeDivide(a: number, b: number): CalculationResult {
  if (b === 0) {
    return [0, false, "Division by zero"];
  }
  if (!Number.isFinite(a) || !Number.isFinite(b)) {
    return [0, false, "Invalid input: non-finite number"];
  }
  return [a / b, true];
}

const [result, isValid, errorMessage] = safeDivide(10, 2);
if (isValid) {
  console.log("Result:", result);
} else {
  console.error("Error:", errorMessage);
}
```

##### 2. 名前付きタプルの活用

**💡 なぜ名前付きタプルが重要なのか**

TypeScript 4.0 で導入された名前付きタプルにより、各要素の意味が明確になり、コードの可読性が大幅に向上します。特に、複雑なデータ構造や多くの要素を持つタプルで威力を発揮します。

**🎯 どういう場面で使うのか**

- **複雑なデータ構造**: 多くの要素を持つタプルの可読性向上
- **API 設計**: 関数の戻り値や引数の意味を明確化
- **ドキュメント化**: 型定義自体がドキュメントとして機能
- **チーム開発**: コードレビューや保守性の向上

```typescript
// 名前付きタプルの基本
type NamedCoordinate = [x: number, y: number];
type UserInfo = [name: string, age: number, isActive: boolean];

let coordinate: NamedCoordinate = [10, 20];
let user: UserInfo = ["Alice", 30, true];

// より複雑な例：HTTP レスポンス
type HttpResponse = [
  statusCode: number,
  headers: Record<string, string>,
  body: string,
  timestamp: Date
];

function createResponse(
  status: number,
  headers: Record<string, string>,
  body: string
): HttpResponse {
  return [status, headers, body, new Date()];
}

const response = createResponse(
  200,
  { "Content-Type": "application/json" },
  '{"message": "success"}'
);

const [statusCode, headers, body, timestamp] = response;
console.log(`Response ${statusCode} at ${timestamp.toISOString()}`);

// データベースクエリ結果
type QueryResult = [
  rows: any[],
  affectedRows: number,
  executionTime: number,
  queryId: string
];

async function executeQuery(sql: string): Promise<QueryResult> {
  const startTime = Date.now();
  const queryId = Math.random().toString(36).substring(2);

  // 模擬的なクエリ実行
  const rows = [
    { id: 1, name: "Alice" },
    { id: 2, name: "Bob" },
  ];
  const affectedRows = rows.length;
  const executionTime = Date.now() - startTime;

  return [rows, affectedRows, executionTime, queryId];
}

// 使用例
const [rows, affectedRows, executionTime, queryId] = await executeQuery(
  "SELECT * FROM users"
);
console.log(`Query ${queryId}: ${affectedRows} rows in ${executionTime}ms`);

// ファイル処理結果
type FileProcessResult = [
  success: boolean,
  processedBytes: number,
  errorCount: number,
  warnings: string[]
];

function processFile(filePath: string): FileProcessResult {
  // ファイル処理ロジック
  const success = true;
  const processedBytes = 1024;
  const errorCount = 0;
  const warnings: string[] = [];

  return [success, processedBytes, errorCount, warnings];
}

const [success, bytes, errors, warnings] = processFile("data.csv");
if (success) {
  console.log(`Processed ${bytes} bytes with ${errors} errors`);
  if (warnings.length > 0) {
    console.warn("Warnings:", warnings);
  }
}
```

**📝 コードの詳細解説**

- **可読性の向上**: 要素名により、各位置の意味が明確
- **IDE サポート**: エディタでの補完やヒントが改善
- **型安全性**: 位置と型の両方が保証される
- **ドキュメント効果**: 型定義自体が仕様書として機能

##### 3. オプショナル要素と残余要素の活用

**💡 なぜ柔軟なタプル構造が重要なのか**

オプショナル要素と残余要素により、固定的なタプルに柔軟性を持たせることができます。これにより、可変長の引数や、一部が省略可能なデータ構造を型安全に表現できます。

**🎯 どういう場面で使うのか**

- **設定値**: 一部が省略可能な設定項目
- **関数の引数**: 可変長引数の型安全な表現
- **ログデータ**: 基本情報＋可変長の追加情報
- **イベントデータ**: 固定フィールド＋動的フィールド

```typescript
// オプショナル要素の活用
type OptionalCoordinate = [x: number, y: number, z?: number];
let coord2D: OptionalCoordinate = [10, 20];
let coord3D: OptionalCoordinate = [10, 20, 30];

// 設定値での活用
type ServerConfig = [
  host: string,
  port: number,
  ssl?: boolean,
  timeout?: number
];

let basicConfig: ServerConfig = ["localhost", 3000];
let fullConfig: ServerConfig = ["example.com", 443, true, 5000];

function createServer(config: ServerConfig): void {
  const [host, port, ssl = false, timeout = 3000] = config;
  console.log(`Server: ${host}:${port}, SSL: ${ssl}, Timeout: ${timeout}ms`);
}

createServer(basicConfig); // Server: localhost:3000, SSL: false, Timeout: 3000ms
createServer(fullConfig); // Server: example.com:443, SSL: true, Timeout: 5000ms

// 残余要素の活用
type LogEntry = [
  timestamp: Date,
  level: string,
  message: string,
  ...details: string[]
];

function createLogEntry(
  level: string,
  message: string,
  ...details: string[]
): LogEntry {
  return [new Date(), level, message, ...details];
}

const errorLog = createLogEntry(
  "ERROR",
  "Database connection failed",
  "host: db.example.com",
  "port: 5432"
);
const infoLog = createLogEntry("INFO", "User logged in", "userId: 123");

// ログ処理関数
function processLog([timestamp, level, message, ...details]: LogEntry): void {
  console.log(`[${timestamp.toISOString()}] ${level}: ${message}`);
  if (details.length > 0) {
    console.log("Details:", details.join(", "));
  }
}

processLog(errorLog);
processLog(infoLog);

// 混合型の残余要素
type MixedData = [
  id: number,
  name: string,
  ...metadata: (string | number | boolean)[]
];

let userData: MixedData = [1, "Alice", "admin", 30, true, "premium"];

function processUserData([id, name, ...metadata]: MixedData): void {
  console.log(`User ${id}: ${name}`);
  console.log("Metadata:", metadata);
}

// 関数の可変長引数での活用
type FunctionCall = [functionName: string, ...args: unknown[]];

function logFunctionCall([functionName, ...args]: FunctionCall): void {
  console.log(`Calling ${functionName} with args:`, args);
}

logFunctionCall(["calculateTotal", 10, 20, 30]);
logFunctionCall([
  "sendEmail",
  "user@example.com",
  "Hello",
  { priority: "high" },
]);

// API エンドポイントの定義
type ApiEndpoint = [method: string, path: string, ...middleware: string[]];

const endpoints: ApiEndpoint[] = [
  ["GET", "/users", "auth", "rateLimit"],
  ["POST", "/users", "auth", "validation", "rateLimit"],
  ["GET", "/public/health"],
];

function registerEndpoint([method, path, ...middleware]: ApiEndpoint): void {
  console.log(`${method} ${path}`);
  if (middleware.length > 0) {
    console.log("Middleware:", middleware.join(" -> "));
  }
}

endpoints.forEach(registerEndpoint);
```

**📝 コードの詳細解説**

- **オプショナル要素**: `?` を使用して省略可能な要素を定義
- **残余要素**: `...` を使用して可変長の要素を表現
- **デフォルト値**: 分割代入時にデフォルト値を設定可能
- **型安全性**: 可変長でも各要素の型が保証される

**⚠️ よくある間違いと注意点**

```typescript
// ❌ 間違い: オプショナル要素の後に必須要素
type InvalidTuple = [a: string, b?: number, c: boolean]; // Error

// ✅ 正解: オプショナル要素は最後に配置
type ValidTuple = [a: string, c: boolean, b?: number];

// ❌ 間違い: 残余要素の位置
type InvalidRest = [...numbers: number[], last: string]; // Error

// ✅ 正解: 残余要素は最後に配置
type ValidRest = [first: string, ...numbers: number[]];

// ❌ 間違い: 複数の残余要素
type MultipleRest = [first: string, ...middle: number[], ...end: string[]]; // Error

// ✅ 正解: 残余要素は一つのみ
type SingleRest = [first: string, ...rest: (number | string)[]];
```

**🚀 実際の開発での活用例**

```typescript
// イベント管理システム
type EventData = [
  eventType: string,
  timestamp: Date,
  userId?: string,
  ...additionalData: unknown[]
];

class EventLogger {
  private events: EventData[] = [];

  log(eventType: string, userId?: string, ...additionalData: unknown[]): void {
    const event: EventData = [eventType, new Date(), userId, ...additionalData];
    this.events.push(event);
  }

  getEvents(): readonly EventData[] {
    return [...this.events];
  }

  filterByType(eventType: string): EventData[] {
    return this.events.filter(([type]) => type === eventType);
  }

  formatEvent([eventType, timestamp, userId, ...data]: EventData): string {
    const userInfo = userId ? ` (User: ${userId})` : "";
    const additionalInfo =
      data.length > 0 ? ` Data: ${JSON.stringify(data)}` : "";
    return `[${timestamp.toISOString()}] ${eventType}${userInfo}${additionalInfo}`;
  }
}

const logger = new EventLogger();
logger.log("user_login", "123");
logger.log("page_view", "123", "/dashboard", { referrer: "google" });
logger.log("error", undefined, "Database connection failed", { code: 500 });

// コマンドライン引数の処理
type CliCommand = [command: string, ...args: string[]];

function parseCommand(input: string): CliCommand {
  const parts = input.trim().split(/\s+/);
  const [command, ...args] = parts;
  return [command, ...args];
}

function executeCommand([command, ...args]: CliCommand): void {
  switch (command) {
    case "create":
      console.log(`Creating with args: ${args.join(", ")}`);
      break;
    case "delete":
      console.log(`Deleting: ${args[0]}`);
      break;
    case "list":
      console.log("Listing items...");
      break;
    default:
      console.log(`Unknown command: ${command}`);
  }
}

executeCommand(parseCommand("create user Alice admin"));
executeCommand(parseCommand("delete user123"));
executeCommand(parseCommand("list"));

// データベースクエリビルダー
type QueryParts = [
  table: string,
  operation: "SELECT" | "INSERT" | "UPDATE" | "DELETE",
  ...conditions: string[]
];

class QueryBuilder {
  build([table, operation, ...conditions]: QueryParts): string {
    let query = `${operation} `;

    switch (operation) {
      case "SELECT":
        query += `* FROM ${table}`;
        break;
      case "DELETE":
        query += `FROM ${table}`;
        break;
      case "INSERT":
        query += `INTO ${table}`;
        break;
      case "UPDATE":
        query += table;
        break;
    }

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(" AND ")}`;
    }

    return query;
  }
}

const builder = new QueryBuilder();
console.log(builder.build(["users", "SELECT", "age > 18", "active = true"]));
console.log(builder.build(["products", "DELETE", "stock = 0"]));
```

### Section 4: オブジェクト型と関数型の実践設計

#### 🔧 オブジェクト型の詳細設計と実践パターン

> 💡 **詳細解説**: オブジェクト型の詳細と実践的な活用パターンは [Step02*補足*専門用語集.md#オブジェクト型関連用語](./Step02_補足_専門用語集.md#オブジェクト型関連用語) と [Step02*補足*実践コード例.md#オブジェクト型の活用例](./Step02_補足_実践コード例.md#オブジェクト型の活用例) を見てね 🐰

**💡 なぜオブジェクト型が重要なのか**

オブジェクト型は、複雑なデータ構造を型安全に表現するための中核的な機能です。JavaScript のオブジェクトは動的で型安全性がありませんが、TypeScript のオブジェクト型により、プロパティの存在、型、アクセス権限が保証されます。特に、API レスポンス、設定オブジェクト、状態管理において重要です。

**🎯 どういう場面で使うのか**

- **API レスポンス**: サーバーから受け取るデータの構造定義
- **設定オブジェクト**: アプリケーションや機能の設定値管理
- **状態管理**: アプリケーションの状態やコンポーネントの状態
- **データモデル**: ビジネスロジックで扱うエンティティの表現

##### 1. 基本的なオブジェクト型の設計と活用

**💡 なぜ構造化された型定義が重要なのか**

オブジェクト型により、データの構造が明確になり、プロパティアクセス時の型安全性が確保されます。これにより、存在しないプロパティへのアクセスや型の不一致を防ぐことができます。

```typescript
// 基本的なオブジェクト型の定義
let user: {
  name: string;
  age: number;
  email: string;
} = {
  name: "Alice",
  age: 30,
  email: "alice@example.com",
};

// より実用的な例：商品情報
interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  inStock: boolean;
  description: string;
}

let laptop: Product = {
  id: 1,
  name: "MacBook Pro",
  price: 200000,
  category: "Electronics",
  inStock: true,
  description: "High-performance laptop for professionals",
};

// ネストしたオブジェクト型
interface Address {
  street: string;
  city: string;
  postalCode: string;
  country: string;
}

interface Customer {
  id: number;
  name: string;
  email: string;
  address: Address;
  orders: Order[];
}

interface Order {
  id: number;
  products: Product[];
  totalAmount: number;
  orderDate: Date;
  status: "pending" | "shipped" | "delivered" | "cancelled";
}

// 実用的な関数での活用
function calculateOrderTotal(order: Order): number {
  return order.products.reduce((total, product) => total + product.price, 0);
}

function formatCustomerInfo(customer: Customer): string {
  const { name, email, address } = customer;
  return `${name} (${email}) - ${address.city}, ${address.country}`;
}

function getActiveOrders(customer: Customer): Order[] {
  return customer.orders.filter(
    (order) => order.status === "pending" || order.status === "shipped"
  );
}
```

**📝 コードの詳細解説**

- **構造の明確化**: プロパティ名と型が明確に定義される
- **ネストした構造**: 複雑なデータ構造も型安全に表現
- **型安全なアクセス**: プロパティアクセス時の型チェック
- **インターフェースの活用**: 再利用可能な型定義

**⚠️ よくある間違いと注意点**

```typescript
// ❌ 間違い: 存在しないプロパティへのアクセス
let user = { name: "Alice", age: 30 };
console.log(user.email); // Error: Property 'email' does not exist

// ✅ 正解: 適切な型定義
interface User {
  name: string;
  age: number;
  email?: string; // オプショナルプロパティ
}

let user: User = { name: "Alice", age: 30 };
if (user.email) {
  console.log(user.email); // 型安全
}

// ❌ 間違い: 型の不一致
let product: Product = {
  id: "1", // Error: Type 'string' is not assignable to type 'number'
  name: "Product",
  price: 100,
  category: "Category",
  inStock: true,
  description: "Description",
};

// ✅ 正解: 適切な型
let product: Product = {
  id: 1, // number型
  name: "Product",
  price: 100,
  category: "Category",
  inStock: true,
  description: "Description",
};
```

**🚀 実際の開発での活用例**

```typescript
// API レスポンスの型定義
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  timestamp: Date;
  errors?: string[];
}

interface UserListResponse {
  users: User[];
  totalCount: number;
  page: number;
  pageSize: number;
}

async function fetchUsers(
  page: number = 1
): Promise<ApiResponse<UserListResponse>> {
  const response = await fetch(`/api/users?page=${page}`);
  const data = await response.json();

  return {
    success: response.ok,
    data: data,
    message: response.ok ? "Success" : "Failed to fetch users",
    timestamp: new Date(),
    errors: response.ok ? undefined : [data.error],
  };
}

// 設定管理システム
interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  ssl: boolean;
  connectionTimeout: number;
}

interface AppConfig {
  database: DatabaseConfig;
  server: {
    port: number;
    host: string;
    cors: {
      enabled: boolean;
      origins: string[];
    };
  };
  logging: {
    level: "debug" | "info" | "warn" | "error";
    file: string;
    maxSize: number;
  };
}

class ConfigManager {
  private config: AppConfig;

  constructor(configPath: string) {
    this.config = this.loadConfig(configPath);
  }

  private loadConfig(path: string): AppConfig {
    // 設定ファイルの読み込みロジック
    return {
      database: {
        host: "localhost",
        port: 5432,
        database: "myapp",
        username: "user",
        password: "password",
        ssl: false,
        connectionTimeout: 5000,
      },
      server: {
        port: 3000,
        host: "0.0.0.0",
        cors: {
          enabled: true,
          origins: ["http://localhost:3000"],
        },
      },
      logging: {
        level: "info",
        file: "app.log",
        maxSize: 10485760, // 10MB
      },
    };
  }

  getDatabaseConfig(): DatabaseConfig {
    return { ...this.config.database };
  }

  getServerPort(): number {
    return this.config.server.port;
  }

  isLoggingEnabled(level: string): boolean {
    const levels = ["debug", "info", "warn", "error"];
    const currentLevelIndex = levels.indexOf(this.config.logging.level);
    const checkLevelIndex = levels.indexOf(level);
    return checkLevelIndex >= currentLevelIndex;
  }
}
```

##### 2. オプショナルプロパティと読み取り専用プロパティ

**💡 なぜ柔軟で安全なプロパティ設計が重要なのか**

オプショナルプロパティと読み取り専用プロパティにより、データの柔軟性と安全性を両立できます。必須でないデータは適切にオプショナルとし、変更されてはいけないデータは読み取り専用として保護します。

```typescript
// オプショナルプロパティの実践的活用
interface UserProfile {
  id: number;
  username: string;
  email: string;
  firstName?: string; // オプショナル
  lastName?: string; // オプショナル
  avatar?: string; // オプショナル
  bio?: string; // オプショナル
  socialLinks?: {
    twitter?: string;
    github?: string;
    linkedin?: string;
  };
}

// 読み取り専用プロパティの活用
interface ImmutableConfig {
  readonly apiKey: string;
  readonly baseUrl: string;
  readonly version: string;
  retryCount: number; // 変更可能
  timeout: number; // 変更可能
}

let config: ImmutableConfig = {
  apiKey: "abc123",
  baseUrl: "https://api.example.com",
  version: "1.0.0",
  retryCount: 3,
  timeout: 5000,
};

// config.apiKey = "new key"; // Error: Cannot assign to 'apiKey'
config.retryCount = 5; // OK

// インデックスシグネチャの活用
interface Dictionary<T> {
  [key: string]: T;
}

interface LocalizedStrings extends Dictionary<string> {
  // 特定のキーは必須
  title: string;
  description: string;
  // その他のキーはオプショナル
}

let englishStrings: LocalizedStrings = {
  title: "Welcome",
  description: "Welcome to our application",
  buttonOk: "OK",
  buttonCancel: "Cancel",
  errorMessage: "An error occurred",
};

// 混合型のオブジェクト
let complexObject: {
  id: number;
  name: string;
  tags: string[];
  metadata: {
    created: Date;
    updated?: Date;
  };
  [key: string]: unknown; // 追加プロパティ許可
} = {
  id: 1,
  name: "Sample",
  tags: ["tag1", "tag2"],
  metadata: {
    created: new Date(),
  },
  customField: "custom value",
};
```

**📝 コードの詳細解説**

- **柔軟性**: オプショナルプロパティによる柔軟なデータ構造
- **不変性**: readonly による重要なプロパティの保護
- **動的プロパティ**: インデックスシグネチャによる拡張可能な構造
- **型安全性**: すべてのプロパティアクセスが型チェックされる

**⚠️ よくある間違いと注意点**

```typescript
// ❌ 間違い: オプショナルプロパティの不適切な使用
function formatUserName(user: UserProfile): string {
  return `${user.firstName} ${user.lastName}`; // Error: Object is possibly 'undefined'
}

// ✅ 正解: 適切なnullチェック
function formatUserName(user: UserProfile): string {
  if (user.firstName && user.lastName) {
    return `${user.firstName} ${user.lastName}`;
  } else if (user.firstName) {
    return user.firstName;
  } else {
    return user.username;
  }
}

// ❌ 間違い: 読み取り専用プロパティの変更を試みる
config.apiKey = "new key"; // Error: Cannot assign to 'apiKey'

// ✅ 正解: 変更可能なプロパティのみ変更
config.retryCount = 5; // OK
```

**🚀 実際の開発での活用例**

```typescript
// 設定管理システム
interface AppSettings {
  readonly environment: "development" | "staging" | "production";
  readonly features: {
    readonly [featureName: string]: boolean;
  };
  cache: {
    ttl: number;
    maxSize: number;
  };
  logging: {
    level: string;
    enabled: boolean;
  };
}

class SettingsManager {
  private settings: AppSettings;

  constructor(initialSettings: AppSettings) {
    this.settings = { ...initialSettings };
  }

  isFeatureEnabled(featureName: string): boolean {
    return this.settings.features[featureName] ?? false;
  }

  updateCacheSettings(newSettings: Partial<AppSettings["cache"]>): void {
    this.settings.cache = { ...this.settings.cache, ...newSettings };
  }

  getEnvironment(): string {
    return this.settings.environment;
  }
}
```

#### 🎯 関数型の詳細活用と実践パターン

**💡 なぜ関数型が重要なのか**

関数型により、関数の引数、戻り値、動作が明確に定義され、関数呼び出し時の型安全性が確保されます。特に、高階関数、コールバック、イベントハンドラーにおいて、型安全性と開発効率の向上に重要です。

**🎯 どういう場面で使うのか**

- **API 関数**: サーバーとの通信を行う関数
- **イベントハンドラー**: ユーザーインタラクションの処理
- **データ変換**: 配列やオブジェクトの変換処理
- **ビジネスロジック**: アプリケーションの核となる処理

##### 1. 基本的な関数型注釈の実践

**💡 なぜ明示的な関数型が重要なのか**

関数の型注釈により、引数と戻り値の型が明確になり、関数の使用方法と期待される動作が明確になります。これにより、関数の誤用を防ぎ、開発効率が向上します。

```typescript
// 基本的な関数型注釈
function calculateTax(amount: number, rate: number): number {
  return amount * rate;
}

function formatCurrency(amount: number, currency: string = "JPY"): string {
  return new Intl.NumberFormat("ja-JP", {
    style: "currency",
    currency: currency,
  }).format(amount);
}

function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// void 型の関数
function logError(message: string, error?: Error): void {
  console.error(`[ERROR] ${message}`);
  if (error) {
    console.error(error.stack);
  }
}

// アロー関数の型注釈
const multiply = (a: number, b: number): number => a * b;
const isEven = (num: number): boolean => num % 2 === 0;
const greetUser = (name: string): string => `Hello, ${name}!`;

// 関数型の変数
type MathOperation = (a: number, b: number) => number;

const add: MathOperation = (a, b) => a + b;
const subtract: MathOperation = (a, b) => a - b;
const divide: MathOperation = (a, b) => {
  if (b === 0) throw new Error("Division by zero");
  return a / b;
};
```

**📝 コードの詳細解説**

- **型安全性**: 引数と戻り値の型が保証される
- **関数の合成**: 型安全な関数の組み合わせ
- **再利用性**: 型定義により関数の再利用が容易
- **エラー防止**: 型不一致による実行時エラーを防止

**⚠️ よくある間違いと注意点**

```typescript
// ❌ 間違い: 戻り値の型を明示しない
function processData(data: string) {
  return data.length > 0 ? data.toUpperCase() : null; // 戻り値の型が不明確
}

// ✅ 正解: 明示的な戻り値の型
function processData(data: string): string | null {
  return data.length > 0 ? data.toUpperCase() : null;
}

// ❌ 間違い: 引数の型を省略
function calculate(a, b) {
  // any型になってしまう
  return a + b;
}

// ✅ 正解: 適切な型注釈
function calculate(a: number, b: number): number {
  return a + b;
}
```

**🚀 実際の開発での活用例**

```typescript
// データ処理パイプライン
type DataProcessor<T, U> = (data: T) => U;
type DataValidator<T> = (data: T) => boolean;

function createDataPipeline<T, U>(
  validator: DataValidator<T>,
  processor: DataProcessor<T, U>
): (data: T) => U | null {
  return (data: T) => {
    if (!validator(data)) {
      return null;
    }
    return processor(data);
  };
}

// API クライアントの実装
type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

interface RequestConfig {
  method: HttpMethod;
  headers?: Record<string, string>;
  body?: unknown;
  timeout?: number;
}

async function apiCall(url: string, config?: RequestConfig): Promise<unknown> {
  const defaultConfig: RequestConfig = {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    timeout: 5000,
  };

  const finalConfig = { ...defaultConfig, ...config };

  return fetch(url, {
    method: finalConfig.method,
    headers: finalConfig.headers,
    body: finalConfig.body ? JSON.stringify(finalConfig.body) : undefined,
  }).then((response) => response.json());
}
```

##### 2. オプショナルパラメータとデフォルトパラメータ

**💡 なぜ柔軟なパラメータ設計が重要なのか**

オプショナルパラメータとデフォルトパラメータにより、関数の使いやすさと柔軟性が向上します。必須でない引数は適切にオプショナルとし、よく使用される値はデフォルト値として設定します。

```typescript
// オプショナルパラメータの活用
function createUser(
  name: string,
  age?: number,
  email?: string
): {
  name: string;
  age: number;
  email: string;
} {
  return {
    name,
    age: age ?? 0,
    email: email ?? "",
  };
}

// デフォルトパラメータの活用
function greetWithDefault(name: string, greeting: string = "Hello"): string {
  return `${greeting}, ${name}!`;
}

function formatDate(
  date: Date,
  locale: string = "ja-JP",
  options: Intl.DateTimeFormatOptions = {}
): string {
  return new Intl.DateTimeFormat(locale, options).format(date);
}

// 残余パラメータの活用
function sum(...numbers: number[]): number {
  return numbers.reduce((total, num) => total + num, 0);
}

function createMessage(
  template: string,
  ...values: (string | number)[]
): string {
  return values.reduce((result, value, index) => {
    return result.replace(`{${index}}`, String(value));
  }, template);
}

// 実用的な例：ログ関数
type LogLevel = "debug" | "info" | "warn" | "error";

function log(
  level: LogLevel,
  message: string,
  context?: Record<string, unknown>,
  timestamp: Date = new Date()
): void {
  const logEntry = {
    timestamp: timestamp.toISOString(),
    level: level.toUpperCase(),
    message,
    ...(context && { context }),
  };

  console.log(JSON.stringify(logEntry));
}
```

**📝 コードの詳細解説**

- **柔軟性**: オプショナルパラメータによる使いやすい関数
- **デフォルト値**: よく使用される値の自動設定
- **可変長引数**: 残余パラメータによる柔軟な引数受け取り
- **型安全性**: すべてのパラメータが型チェックされる

##### 3. 関数オーバーロードと高階関数

**💡 なぜ高度な関数パターンが重要なのか**

関数オーバーロードと高階関数により、複雑な処理を型安全に実装できます。特に、ライブラリ開発や汎用的な処理において、柔軟性と型安全性を両立できます。

```typescript
// 関数オーバーロード
function format(value: string): string;
function format(value: number): string;
function format(value: boolean): string;
function format(value: Date): string;
function format(value: string | number | boolean | Date): string {
  if (value instanceof Date) {
    return value.toISOString();
  }
  return String(value);
}

// 高階関数の型注釈
type EventHandler<T> = (event: T) => void;
type EventFilter<T> = (event: T) => boolean;

function applyOperation(
  numbers: number[],
  operation: (num: number) => number
): number[] {
  return numbers.map(operation);
}

const doubled = applyOperation([1, 2, 3], (x) => x * 2);
const squared = applyOperation([1, 2, 3], (x) => x * x);

// 実用的な高階関数の例
function createValidator<T>(
  validationFn: (value: T) => boolean,
  errorMessage: string
) {
  return (value: T): { isValid: boolean; error?: string } => {
    const isValid = validationFn(value);
    return isValid
      ? { isValid: true }
      : { isValid: false, error: errorMessage };
  };
}

const emailValidator = createValidator(
  (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
  "Invalid email format"
);

const ageValidator = createValidator(
  (age: number) => age >= 0 && age <= 120,
  "Age must be between 0 and 120"
);

// 使用例
console.log(emailValidator("test@example.com")); // { isValid: true }
console.log(emailValidator("invalid-email")); // { isValid: false, error: "Invalid email format" }
```

**📝 コードの詳細解説**

- **関数オーバーロード**: 同じ関数名で異なる型の引数を受け取る
- **高階関数**: 関数を引数として受け取ったり戻り値として返す
- **型安全性**: 複雑な関数パターンでも型が保証される
- **再利用性**: 汎用的な処理を型安全に実装

**⚠️ よくある間違いと注意点**

```typescript
// ❌ 間違い: オーバーロードの実装が不適切
function process(value: string): string;
function process(value: number): number;
function process(value: string | number): string | number {
  // 実装が型と一致しない
  return String(value); // 常に string を返してしまう
}

// ✅ 正解: 適切なオーバーロード実装
function process(value: string): string;
function process(value: number): number;
function process(value: string | number): string | number {
  if (typeof value === "string") {
    return value.toUpperCase();
  } else {
    return value * 2;
  }
}

// ❌ 間違い: 高階関数の型が不適切
function createHandler(callback) {
  // any型
  return (data) => callback(data); // any型
}

// ✅ 正解: 適切な高階関数の型
function createHandler<T, U>(callback: (data: T) => U): (data: T) => U {
  return (data: T) => callback(data);
}
```

**🚀 実際の開発での活用例**

```typescript
// ミドルウェアシステム
type Middleware<T> = (data: T, next: (data: T) => T) => T;

function createMiddlewareChain<T>(...middlewares: Middleware<T>[]) {
  return (initialData: T): T => {
    let index = 0;

    function next(data: T): T {
      if (index >= middlewares.length) {
        return data;
      }

      const middleware = middlewares[index++];
      return middleware(data, next);
    }

    return next(initialData);
  };
}

// イベント管理システム
class EventManager<T> {
  private handlers: EventHandler<T>[] = [];
  private filters: EventFilter<T>[] = [];

  addHandler(handler: EventHandler<T>): void {
    this.handlers.push(handler);
  }

  addFilter(filter: EventFilter<T>): void {
    this.filters.push(filter);
  }

  emit(event: T): void {
    const shouldProcess = this.filters.every((filter) => filter(event));

    if (shouldProcess) {
      this.handlers.forEach((handler) => handler(event));
    }
  }

  createFilteredHandler(
    filter: EventFilter<T>,
    handler: EventHandler<T>
  ): EventHandler<T> {
    return (event: T) => {
      if (filter(event)) {
        handler(event);
      }
    };
  }
}
```

## 🎯 実践演習

> 💡 **演習サポート**: 演習中に困った時は以下の補足資料を活用してください
>
> - 🚨 [トラブルシューティング](./Step02_補足_トラブルシューティング.md) - エラーが発生した場合の解決方法
> - 💻 [実践コード例](./Step02_補足_実践コード例.md) - より詳細なコード例とパターン
> - 📖 [専門用語集](./Step02_補足_専門用語集.md) - 分からない用語の確認

### 演習 2-1: 型推論マスター 🔰

```typescript
// 以下のコードの型推論結果を予測し、実際に確認せよ

// 1. 基本的な型推論
let a = 42; // 型は？
let b = "hello"; // 型は？
let c = true; // 型は？
let d = [1, 2, 3]; // 型は？
let e = ["a", "b", "c"]; // 型は？

// 2. 複雑な型推論
let f = [1, "hello", true]; // 型は？
let g = { name: "Alice", age: 30 }; // 型は？
let h = [{ id: 1, name: "Bob" }]; // 型は？

// 3. 関数の型推論
function mystery1(x, y) {
  // パラメータの型は？
  return x + y;
}

function mystery2(arr) {
  // パラメータの型は？
  return arr.map((x) => x * 2);
}
```

#### 解答例と解説

- a: number
- b: string
- c: boolean
- d: number[]
- e: string[]
- f: (string | number | boolean)[]
- g: { name: string; age: number; }
- h: { id: number; name: string; }[]
- mystery1: パラメータはany型（型推論不可）
- mystery2: パラメータはany型（型推論不可）

### 演習 2-2: 商品管理システム 🔥

身近な商品管理システムを段階的に実装し、Step02で学習した型システムを総合的に活用せよ

#### 学習目標:
- Step02で学習した基本型システムの総合活用
- 実用的なデータ構造設計の体験
- 型安全なCRUD操作の実装
- 段階的な機能拡張の経験

#### Phase 1: 基本構造設計 (初学者レベル)

**要件:**
- 商品情報の型定義
- 基本的なCRUD操作の実装
- 型安全なデータ管理

```typescript
// 商品情報の型定義
interface Product {
  readonly id: number;        // 商品ID（変更不可）
  name: string;              // 商品名
  price: number;             // 価格
  category: string;          // カテゴリ
  inStock: boolean;          // 在庫状況
  description?: string;      // 商品説明（オプショナル）
}

// 商品管理クラス
class ProductManager {
  private products: Product[] = [];
  private nextId: number = 1;

  // 商品追加
  addProduct(
    name: string,
    price: number,
    category: string,
    description?: string
  ): Product {
    const newProduct: Product = {
      id: this.nextId++,
      name,
      price,
      category,
      inStock: true,
      description,
    };

    this.products.push(newProduct);
    return newProduct;
  }

  // 商品削除
  removeProduct(id: number): boolean {
    const index = this.products.findIndex(product => product.id === id);
    if (index !== -1) {
      this.products.splice(index, 1);
      return true;
    }
    return false;
  }

  // 商品更新
  updateProduct(id: number, updates: Partial<Omit<Product, 'id'>>): boolean {
    const product = this.products.find(p => p.id === id);
    if (product) {
      Object.assign(product, updates);
      return true;
    }
    return false;
  }

  // 全商品取得
  getAllProducts(): readonly Product[] {
    return [...this.products]; // イミュータブルなコピーを返す
  }
}
```

#### Phase 2: 検索・フィルタ機能 (中級レベル)

**要件:**
- カテゴリ別検索
- 価格範囲検索
- 在庫状況検索
- 名前による部分検索

```typescript
class ProductManager {
  // ... Phase 1のメソッドに加えて

  // カテゴリ別検索
  findProductsByCategory(category: string): Product[] {
    return this.products.filter(product =>
      product.category.toLowerCase() === category.toLowerCase()
    );
  }

  // 価格範囲検索
  findProductsByPriceRange(minPrice: number, maxPrice: number): Product[] {
    return this.products.filter(product =>
      product.price >= minPrice && product.price <= maxPrice
    );
  }

  // 在庫状況検索
  findProductsInStock(): Product[] {
    return this.products.filter(product => product.inStock);
  }

  findProductsOutOfStock(): Product[] {
    return this.products.filter(product => !product.inStock);
  }

  // 名前による部分検索
  searchProductsByName(searchTerm: string): Product[] {
    const lowerSearchTerm = searchTerm.toLowerCase();
    return this.products.filter(product =>
      product.name.toLowerCase().includes(lowerSearchTerm)
    );
  }

  // 複合検索（複数条件）
  searchProducts(criteria: {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    inStock?: boolean;
    nameSearch?: string;
  }): Product[] {
    return this.products.filter(product => {
      // カテゴリ条件
      if (criteria.category &&
          product.category.toLowerCase() !== criteria.category.toLowerCase()) {
        return false;
      }

      // 価格条件
      if (criteria.minPrice !== undefined && product.price < criteria.minPrice) {
        return false;
      }
      if (criteria.maxPrice !== undefined && product.price > criteria.maxPrice) {
        return false;
      }

      // 在庫条件
      if (criteria.inStock !== undefined && product.inStock !== criteria.inStock) {
        return false;
      }

      // 名前検索条件
      if (criteria.nameSearch &&
          !product.name.toLowerCase().includes(criteria.nameSearch.toLowerCase())) {
        return false;
      }

      return true;
    });
  }
}
```

#### Phase 3: 高度機能 (上級レベル)

**要件:**
- カテゴリ別統計
- 在庫総額計算
- 最高価格・最低価格商品検索
- 商品数カウント

```typescript
// 統計情報の型定義
interface CategoryStats {
  category: string;
  totalProducts: number;
  averagePrice: number;
  totalValue: number;
  inStockCount: number;
}

interface InventoryStats {
  total: number;
  inStock: number;
  outOfStock: number;
  totalValue: number;
  averagePrice: number;
}

class ProductManager {
  // ... Phase 1, 2のメソッドに加えて

  // カテゴリ別統計
  getCategoryStatistics(): CategoryStats[] {
    const categories = [...new Set(this.products.map(p => p.category))];
    
    return categories.map(category => {
      const categoryProducts = this.products.filter(p => p.category === category);
      const inStockProducts = categoryProducts.filter(p => p.inStock);
      
      return {
        category,
        totalProducts: categoryProducts.length,
        averagePrice: categoryProducts.length > 0
          ? categoryProducts.reduce((sum, p) => sum + p.price, 0) / categoryProducts.length
          : 0,
        totalValue: categoryProducts.reduce((sum, p) => sum + p.price, 0),
        inStockCount: inStockProducts.length,
      };
    });
  }

  // 在庫総額計算
  getTotalInventoryValue(): number {
    return this.products
      .filter(product => product.inStock)
      .reduce((total, product) => total + product.price, 0);
  }

  // 最高価格商品
  getMostExpensiveProduct(): Product | null {
    if (this.products.length === 0) return null;
    
    return this.products.reduce((max, current) =>
      current.price > max.price ? current : max
    );
  }

  // 最低価格商品
  getCheapestProduct(): Product | null {
    if (this.products.length === 0) return null;
    
    return this.products.reduce((min, current) =>
      current.price < min.price ? current : min
    );
  }

  // 商品数カウント
  getInventoryStats(): InventoryStats {
    const inStockProducts = this.products.filter(p => p.inStock);
    const outOfStockProducts = this.products.filter(p => !p.inStock);
    
    return {
      total: this.products.length,
      inStock: inStockProducts.length,
      outOfStock: outOfStockProducts.length,
      totalValue: this.getTotalInventoryValue(),
      averagePrice: this.products.length > 0
        ? this.products.reduce((sum, p) => sum + p.price, 0) / this.products.length
        : 0,
    };
  }

  // 価格帯別商品数
  getPriceRangeDistribution(ranges: [number, number][]): Record<string, number> {
    const distribution: Record<string, number> = {};
    
    ranges.forEach(([min, max]) => {
      const key = `${min}-${max}`;
      distribution[key] = this.products.filter(
        p => p.price >= min && p.price <= max
      ).length;
    });
    
    return distribution;
  }
}

// 使用例
const productManager = new ProductManager();

// Phase 1: 基本操作
const laptop = productManager.addProduct(
  "MacBook Pro",
  200000,
  "Electronics",
  "高性能ノートパソコン"
);
const book = productManager.addProduct("TypeScript入門", 3000, "Books");
const headphones = productManager.addProduct("ワイヤレスヘッドホン", 15000, "Electronics");

// Phase 2: 検索機能
console.log("Electronics商品:", productManager.findProductsByCategory("Electronics"));
console.log("1万円以下の商品:", productManager.findProductsByPriceRange(0, 10000));
console.log("在庫あり商品:", productManager.findProductsInStock());

// 複合検索
const searchResults = productManager.searchProducts({
  category: "Electronics",
  maxPrice: 50000,
  inStock: true
});
console.log("Electronics、5万円以下、在庫あり:", searchResults);

// Phase 3: 統計・分析
console.log("カテゴリ別統計:", productManager.getCategoryStatistics());
console.log("在庫総額:", productManager.getTotalInventoryValue());
console.log("最高価格商品:", productManager.getMostExpensiveProduct());
console.log("在庫統計:", productManager.getInventoryStats());

// 価格帯別分布
const priceRanges: [number, number][] = [
  [0, 5000],
  [5001, 20000],
  [20001, 100000],
  [100001, Infinity]
];
console.log("価格帯別商品数:", productManager.getPriceRangeDistribution(priceRanges));
```

#### 📝 学習ポイント

**Phase 1で学ぶこと:**
- `interface`による型定義
- `readonly`プロパティの活用
- オプショナルプロパティ（`?`）
- `Partial`型と`Omit`型の基本的な使用

**Phase 2で学ぶこと:**
- 配列の`filter`メソッドと型安全性
- 複雑な条件分岐の型安全な実装
- オブジェクトの型定義と活用

**Phase 3で学ぶこと:**
- より高度な型定義（`Record`型など）
- 統計計算の型安全な実装
- 配列の`reduce`メソッドの活用
- 複雑なデータ変換処理

## 📊 Step 2 評価基準

> 💡 **学習サポート**: 各評価項目の詳細な解説は以下の補足資料で確認できます
>
> - 📖 [専門用語集](./Step02_補足_専門用語集.md) - 型システム関連の重要な概念と用語
> - 💻 [実践コード例](./Step02_補足_実践コード例.md) - 段階的な学習用コード集
> - 🚨 [トラブルシューティング](./Step02_補足_トラブルシューティング.md) - よくあるエラーと解決方法
> - 📚 [参考リソース](./Step02_補足_参考リソース.md) - さらなる学習リソース

### 理解度チェックリスト

#### プリミティブ型 (25%)

- [ ] 基本型（string, number, boolean 等）を正しく使用できる → [専門用語集: プリミティブ型](./Step02_補足_専門用語集.md#プリミティブ型primitive-types)
- [ ] リテラル型の概念を理解している → [専門用語集: リテラル型](./Step02_補足_専門用語集.md#リテラル型literal-types)
- [ ] null/undefined の違いを説明できる → [トラブルシューティング: null/undefined 関連のエラー](./Step02_補足_トラブルシューティング.md#nullundefined関連のエラー)
- [ ] 他言語との型システムの違いを理解している → [参考リソース: 型システム学習サイト](./Step02_補足_参考リソース.md#型システム学習サイト)

#### 型推論 (25%)

- [ ] TypeScript の型推論メカニズムを理解している → [専門用語集: 型推論](./Step02_補足_専門用語集.md#型推論type-inference)
- [ ] 型推論の限界を把握している → [実践コード例: 型推論の活用例](./Step02_補足_実践コード例.md#型推論の活用例)
- [ ] 適切な場面で明示的型注釈を使用できる → [トラブルシューティング: 型推論関連の問題](./Step02_補足_トラブルシューティング.md#型推論関連の問題)
- [ ] 文脈的型推論を活用できる → [専門用語集: 型の絞り込み](./Step02_補足_専門用語集.md#型の絞り込みtype-narrowing)

#### 配列・タプル (25%)

- [ ] 配列型を適切に定義・使用できる → [専門用語集: 配列型](./Step02_補足_専門用語集.md#配列型array-types)
- [ ] タプル型の特徴と用途を理解している → [専門用語集: タプル型](./Step02_補足_専門用語集.md#タプル型tuple-types)
- [ ] 読み取り専用配列を活用できる → [専門用語集: 読み取り専用型](./Step02_補足_専門用語集.md#読み取り専用型readonly-types)
- [ ] 配列操作の型安全性を確保できる → [実践コード例: 配列・タプル操作の実践](./Step02_補足_実践コード例.md#配列タプル操作の実践)

#### オブジェクト・関数型 (25%)

- [ ] オブジェクト型を詳細に定義できる → [実践コード例: オブジェクト型の活用例](./Step02_補足_実践コード例.md#オブジェクト型の活用例)
- [ ] 関数の型注釈を適切に設定できる → [専門用語集: 関数型](./Step02_補足_専門用語集.md#関数型function-types)
- [ ] オプショナルプロパティを活用できる → [専門用語集: オプショナルパラメータ](./Step02_補足_専門用語集.md#オプショナルパラメータoptional-parameters)
- [ ] 高階関数の型を正しく定義できる → [実践コード例: 高度な関数型パターン](./Step02_補足_実践コード例.md#高度な関数型パターン)

### 成果物

- [ ] **図書管理システム**: Step02の学習内容を段階的に活用した4段階の図書管理システム → [Step02成果物: 図書管理システム](./Step02_成果物.md)

## 🔄 Step 3 への準備

> 💡 **Step 3 準備サポート**: 次のステップに向けた準備に役立つ補足資料
>
> - 🛠️ [開発環境ガイド](./Step01_補足_開発環境ガイド.md) - 環境設定の詳細手順
> - ⚙️ [設定ファイル解説](./Step01_補足_設定ファイル解説.md) - tsconfig.json 等の設定方法
> - 📚 [参考リソース](./Step02_補足_参考リソース.md) - 継続学習のためのリソース集

### 次週学習内容の予習

> 💡 **詳細解説**: インターフェース関連の概念については [専門用語集: インターフェース関連用語](./Step02_補足_専門用語集.md#インターフェース関連用語) を参照してください

```typescript
// Step 3で学習するインターフェースの基礎概念
// 以下のコードを読んで理解しておくこと

// 1. インターフェースの基本
interface User {
  name: string;
  age: number;
  email?: string; // オプショナル
}

// 2. インターフェースの継承
interface AdminUser extends User {
  permissions: string[];
}

// 3. 型エイリアス
type UserRole = "admin" | "user" | "guest";
type UserWithRole = User & { role: UserRole };

// 4. 関数インターフェース
interface Calculator {
  (a: number, b: number): number;
}
```

**関連リンク**:

- [専門用語集: オプショナルプロパティ](./Step02_補足_専門用語集.md#オプショナルパラメータoptional-parameters)
- [専門用語集: 型エイリアス](./Step02_補足_専門用語集.md#型エイリアスtype-aliases)
- [専門用語集: 関数型](./Step02_補足_専門用語集.md#関数型function-types)

### 環境準備

- [ ] TypeScript Playground での実験 → [参考リソース: オンラインツール](./Step02_補足_参考リソース.md#オンラインツール)
- [ ] VS Code での型情報表示の確認 → [開発環境ガイド](./Step01_補足_開発環境ガイド.md)
- [ ] ESLint 設定の調整 → [設定ファイル解説](./Step01_補足_設定ファイル解説.md)
- [ ] 型定義ファイルの理解 → [参考リソース: 型定義検索](./Step02_補足_参考リソース.md#型定義検索)

### 学習継続のコツ

1. **型推論を意識**: 明示的型注釈と型推論のバランス → [トラブルシューティング: 型推論関連の問題](./Step02_補足_トラブルシューティング.md#型推論関連の問題)
2. **実践重視**: 理論だけでなく実際のコード作成 → [実践コード例](./Step02_補足_実践コード例.md)
3. **エラーから学習**: 型エラーメッセージの理解 → [トラブルシューティング](./Step02_補足_トラブルシューティング.md)
4. **段階的理解**: 複雑な型から簡単な部分に分解 → [参考リソース: 効果的な学習方法](./Step02_補足_参考リソース.md#効果的な学習方法)

---

**📌 重要**: Step 2 は TypeScript の型システムの基礎を固める重要な期間です。型推論の仕組みを理解し、配列・オブジェクト・関数の型注釈を確実に身につけましょう。

**🌟 次週は、インターフェースとオブジェクト型設計について詳しく学習します！**
