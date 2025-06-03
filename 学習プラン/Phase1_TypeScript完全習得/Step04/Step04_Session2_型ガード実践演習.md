# Session2: 型ガード実践演習（90 分）

> 💡 **対象**: 他言語経験者（ユニオン型・基本的な型ガード知識あり）  
> 🎯 **形式**: 講師サポート付き学習  
> ⏰ **時間**: 90 分（休憩含む）

## 📅 セッション概要

**学習目標**:

- [ ] in 演算子による型ガードの実装
- [ ] 判別可能なユニオンの基本パターンの習得
- [ ] 実践的なフォーム処理での型安全性確保
- [ ] API レスポンス処理での型ガード活用

**継続知識**:

- Session1: ユニオン型、インターセクション型、typeof/instanceof 型ガード

---

## ⏰ 詳細タイムテーブル

| 時間         | 内容                   | 講師の役割           | 学習者の活動     | 成果物     |
| ------------ | ---------------------- | -------------------- | ---------------- | ---------- |
| **0-10 分**  | 前回復習・今回目標     | 復習確認・目標提示   | 振り返り・質問   | 理解確認   |
| **10-50 分** | 高度な型ガード実践     | 実演・個別指導       | ハンズオン・実践 | 実践コード |
| **50-80 分** | 判別可能なユニオン演習 | コードレビュー・助言 | 個人開発         | 演習成果   |
| **80-90 分** | 成果共有・質疑応答     | ファシリテート       | 発表・討論       | 学習確認   |

---

## 📚 学習内容

### Section 1: 前回復習（要点のみ）

#### 🔍 Session1 の重要ポイント確認

```typescript
// 基本的なユニオン型
type Status = "loading" | "success" | "error";
type StringOrNumber = string | number;

// インターセクション型
interface User {
  id: number;
  name: string;
}

interface Timestamps {
  createdAt: Date;
  updatedAt: Date;
}

type UserWithTimestamps = User & Timestamps;

// 基本的な型ガード
function processValue(value: string | number): string {
  if (typeof value === "string") {
    return value.toUpperCase();
  } else {
    return value.toString();
  }
}
```

**💡 今日学ぶ内容との関係**

今日は、より実践的な型ガードと、実際の開発でよく使われる判別可能なユニオンパターンを学習します。

---

### Section 2: in 演算子による型ガード

#### 🎯 in 演算子の実践活用

**💡 なぜ in 演算子が重要なのか**

in 演算子は、オブジェクトに特定のプロパティが存在するかをチェックし、その結果に基づいて型を絞り込む型ガードです。インターフェースを使ったユニオン型で特に有効です。

#### 1. 基本的な in 演算子型ガード

```typescript
// Step03で学んだインターフェースを活用
interface EmailUser {
  id: number;
  name: string;
  email: string;
}

interface PhoneUser {
  id: number;
  name: string;
  phone: string;
}

type User = EmailUser | PhoneUser;

function contactUser(user: User): string {
  if ("email" in user) {
    // この分岐内ではuserはEmailUser型
    return `メール送信: ${user.email}`;
  } else {
    // この分岐内ではuserはPhoneUser型
    return `電話発信: ${user.phone}`;
  }
}
```

#### 2. 複数プロパティでの型ガード

```typescript
interface RegularUser {
  id: number;
  name: string;
  email: string;
  subscription: string;
}

interface AdminUser {
  id: number;
  name: string;
  email: string;
  permissions: string[];
  lastLogin: Date;
}

interface GuestUser {
  sessionId: string;
  name: string;
}

type AppUser = RegularUser | AdminUser | GuestUser;

function getUserInfo(user: AppUser): string {
  if ("permissions" in user) {
    // AdminUser
    return `管理者: ${user.name} (権限: ${user.permissions.length}個)`;
  } else if ("email" in user) {
    // RegularUser (AdminUserは上で除外済み)
    return `一般ユーザー: ${user.name} (${user.email})`;
  } else {
    // GuestUser
    return `ゲスト: ${user.name} (セッション: ${user.sessionId})`;
  }
}
```

#### 3. オプショナルプロパティとの組み合わせ

```typescript
// Step03で学んだオプショナルプロパティと組み合わせ
interface BasicProfile {
  id: number;
  name: string;
  avatar?: string; // オプショナル
}

interface ExtendedProfile {
  id: number;
  name: string;
  avatar?: string;
  bio: string; // 必須
  socialLinks: string[];
}

type Profile = BasicProfile | ExtendedProfile;

function displayProfile(profile: Profile): string {
  let result = `${profile.name}`;

  if (profile.avatar) {
    result += ` (アバター: ${profile.avatar})`;
  }

  if ("bio" in profile) {
    // ExtendedProfile
    result += `\n自己紹介: ${profile.bio}`;
    result += `\nSNS: ${profile.socialLinks.join(", ")}`;
  }

  return result;
}
```

---

### Section 3: 判別可能なユニオンの基本パターン

#### 🎯 判別可能なユニオンとは

**💡 なぜ判別可能なユニオンが重要なのか**

判別可能なユニオンは、共通の「判別プロパティ」を持つことで、型ガードを簡潔に書けるパターンです。実際の開発では、状態管理や API レスポンス処理でよく使用されます。

#### 1. 基本的な判別可能なユニオン

```typescript
// 共通の"type"プロパティで判別
interface LoadingState {
  type: "loading";
  message: string;
}

interface SuccessState {
  type: "success";
  data: string[];
}

interface ErrorState {
  type: "error";
  errorMessage: string;
  errorCode: number;
}

type AppState = LoadingState | SuccessState | ErrorState;

function handleState(state: AppState): string {
  switch (state.type) {
    case "loading":
      return `読み込み中: ${state.message}`;
    case "success":
      return `成功: ${state.data.length}件のデータ`;
    case "error":
      return `エラー[${state.errorCode}]: ${state.errorMessage}`;
  }
}
```

#### 2. フォーム処理での判別可能なユニオン

```typescript
// フォームの入力タイプを判別
interface TextInput {
  type: "text";
  value: string;
  placeholder: string;
}

interface NumberInput {
  type: "number";
  value: number;
  min: number;
  max: number;
}

interface SelectInput {
  type: "select";
  value: string;
  options: string[];
}

type FormInput = TextInput | NumberInput | SelectInput;

function validateInput(input: FormInput): boolean {
  switch (input.type) {
    case "text":
      return input.value.length > 0 && input.value.length <= 100;
    case "number":
      return input.value >= input.min && input.value <= input.max;
    case "select":
      return input.options.includes(input.value);
  }
}

function getInputDisplay(input: FormInput): string {
  switch (input.type) {
    case "text":
      return `テキスト: "${input.value}" (${input.placeholder})`;
    case "number":
      return `数値: ${input.value} (${input.min}-${input.max})`;
    case "select":
      return `選択: ${input.value} (${input.options.length}個の選択肢)`;
  }
}
```

---

### Section 4: 実践演習

#### 🔧 演習 1: API レスポンス処理

以下の API レスポンス型を使って、型安全な処理を実装してください：

```typescript
interface SuccessResponse {
  status: "success";
  data: {
    id: number;
    name: string;
    email: string;
  };
}

interface ErrorResponse {
  status: "error";
  message: string;
  code: number;
}

type ApiResponse = SuccessResponse | ErrorResponse;

// 要件1: レスポンスを処理する関数を実装
function processApiResponse(response: ApiResponse): string {
  // successの場合: "ユーザー情報: {name} ({email})"
  // errorの場合: "エラー[{code}]: {message}"
  /* ここを実装 */
}

// 要件2: レスポンスが成功かどうかを判定する関数
function isSuccessResponse(response: ApiResponse): response is SuccessResponse {
  /* ここを実装 */
}
```

#### 🔧 演習 2: 商品データの型ガード

```typescript
interface PhysicalProduct {
  id: number;
  name: string;
  price: number;
  weight: number;
  shippingCost: number;
}

interface DigitalProduct {
  id: number;
  name: string;
  price: number;
  downloadUrl: string;
  fileSize: number;
}

type Product = PhysicalProduct | DigitalProduct;

// 要件1: 商品の総コストを計算する関数
function calculateTotalCost(product: Product): number {
  // 物理商品: price + shippingCost
  // デジタル商品: price のみ
  /* ここを実装 */
}

// 要件2: 商品情報を表示する関数
function displayProductInfo(product: Product): string {
  // 共通情報 + 商品タイプ固有の情報
  /* ここを実装 */
}
```

#### 🔧 演習 3: ユーザー権限システム

```typescript
interface ReadOnlyUser {
  role: "readonly";
  id: number;
  name: string;
}

interface EditorUser {
  role: "editor";
  id: number;
  name: string;
  editableResources: string[];
}

interface AdminUser {
  role: "admin";
  id: number;
  name: string;
  allPermissions: boolean;
}

type SystemUser = ReadOnlyUser | EditorUser | AdminUser;

// 要件1: ユーザーが特定のリソースにアクセス可能かチェック
function canAccessResource(user: SystemUser, resource: string): boolean {
  /* ここを実装 */
}

// 要件2: ユーザーの権限レベルを数値で返す関数
function getPermissionLevel(user: SystemUser): number {
  // readonly: 1, editor: 2, admin: 3
  /* ここを実装 */
}
```

---

## 📝 解答例

### 演習 1 解答

```typescript
function processApiResponse(response: ApiResponse): string {
  switch (response.status) {
    case "success":
      return `ユーザー情報: ${response.data.name} (${response.data.email})`;
    case "error":
      return `エラー[${response.code}]: ${response.message}`;
  }
}

function isSuccessResponse(response: ApiResponse): response is SuccessResponse {
  return response.status === "success";
}
```

### 演習 2 解答

```typescript
function calculateTotalCost(product: Product): number {
  if ("shippingCost" in product) {
    // PhysicalProduct
    return product.price + product.shippingCost;
  } else {
    // DigitalProduct
    return product.price;
  }
}

function displayProductInfo(product: Product): string {
  let info = `商品: ${product.name} (¥${product.price})`;

  if ("weight" in product) {
    // PhysicalProduct
    info += `\n重量: ${product.weight}kg, 送料: ¥${product.shippingCost}`;
  } else {
    // DigitalProduct
    info += `\nファイルサイズ: ${product.fileSize}MB`;
  }

  return info;
}
```

### 演習 3 解答

```typescript
function canAccessResource(user: SystemUser, resource: string): boolean {
  switch (user.role) {
    case "readonly":
      return false; // 読み取り専用は編集不可
    case "editor":
      return user.editableResources.includes(resource);
    case "admin":
      return user.allPermissions; // 管理者は全権限
  }
}

function getPermissionLevel(user: SystemUser): number {
  switch (user.role) {
    case "readonly":
      return 1;
    case "editor":
      return 2;
    case "admin":
      return 3;
  }
}
```

---

## 🎯 Session2 の成果確認

### 理解度チェック

- [ ] in 演算子を使った型ガードを実装できる
- [ ] 判別可能なユニオンの基本パターンを理解している
- [ ] switch 文を使った型の分岐処理ができる
- [ ] 実践的な API レスポンス処理で型ガードを活用できる
- [ ] フォーム処理での型安全性を確保できる

### 次回 Session3 の予告

**Session3 では以下を学習します**:

- Step04 の総合プロジェクト: ユーザー管理システムの型設計
- 複数の型ガードを組み合わせた実践的な実装
- エラーハンドリングでの型安全性確保
- Step05 への準備（ジェネリクスの基礎概念紹介）

**準備事項**:

- Session1-2 で学んだ型ガードの復習
- 演習問題の理解確認
- 実際のプロジェクトでの活用イメージの整理
