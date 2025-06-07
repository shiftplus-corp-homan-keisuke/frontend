# Session2: 型ガード実践演習（90 分）

> 💡 **対象**: 他言語経験者（ユニオン型・基本的な型ガード知識あり）
> 🎯 **形式**: 講師サポート付き学習
> ⏰ **時間**: 90 分（休憩含む）

## 📚 関連補足資料

このセッションの学習をサポートする補足資料をご用意しています：

- 💻 **[実践コード例](./Step04_補足_実践コード例.md)** - より実践的な例とシステム実装
- 📖 **[専門用語集](./Step04_補足_専門用語集.md)** - 高度な型ガード概念などの詳細解説
- 🚨 **[トラブルシューティング](./Step04_補足_トラブルシューティング.md)** - 型ガードエラーの対処法
- 🌐 **[参考リソース](./Step04_補足_参考リソース.md)** - さらなる学習のためのリソース
- 🔧 **[開発環境ガイド](./Step04_補足_開発環境ガイド.md)** - 開発効率を上げる設定

> 💡 **活用方法**: 学習中に疑問が生じた際や、より深く理解したい場合に参照してね 🐰

## � セッション概要

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

> 📚 **関連資料**: [実践コード例 - in演算子の実用的実装](./Step04_補足_実践コード例.md#in演算子の実用的実装) | [専門用語集 - in演算子](./Step04_補足_専門用語集.md#in演算子)

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

### 練習問題 2.3: オプショナルプロパティと `in` 演算子 🔰

以下のインターフェースとユニオン型を使って、オプショナルプロパティと `in` 演算子を組み合わせた型ガードを実装してください。

```typescript
interface UserProfile {
  id: number;
  name: string;
  email?: string; // オプショナル
  phone?: string; // オプショナル
}

// 要件: `UserProfile` 型を受け取り、`email` または `phone` プロパティが存在するかどうかで
// 連絡先情報を表示する関数 `displayContactInfo` を実装してください。
function displayContactInfo(profile: UserProfile): string {
  let contact = `${profile.name} (ID: ${profile.id})`;
  if ('email' in profile && profile.email) {
    contact += `, Email: ${profile.email}`;
  }
  if ('phone' in profile && profile.phone) {
    contact += `, Phone: ${profile.phone}`;
  }
  return contact;
}
```

---

### Section 3: 判別可能なユニオンの基本パターン

> 📚 **関連資料**: [実践コード例 - 判別可能なユニオン完全版](./Step04_補足_実践コード例.md#判別可能なユニオン完全版) | [専門用語集 - 判別可能なユニオン](./Step04_補足_専門用語集.md#判別可能なユニオン)

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

### 練習問題 2.1: in 演算子 🔰

以下のインターフェースとユニオン型を使って、`in` 演算子を用いた型ガードを実装してください。

```typescript
interface Car {
  type: "car";
  brand: string;
  drive(): void;
}

interface Bicycle {
  type: "bicycle";
  gears: number;
  pedal(): void;
}

type Vehicle = Car | Bicycle;

// 要件: `Vehicle` 型を受け取り、`drive()` または `pedal()` メソッドを呼び出す関数 `startVehicle` を実装してください。
function startVehicle(vehicle: Vehicle): void {
  /* ここを実装 */
}
```

### 練習問題 2.2: 判別可能なユニオン 🔰

以下の判別可能なユニオン型を使って、`switch` 文を用いた型ガードを実装してください。

```typescript
interface SuccessResult {
  status: "success";
  data: any;
}

interface ErrorResult {
  status: "error";
  message: string;
}

type Result = SuccessResult | ErrorResult;

// 要件: `Result` 型を受け取り、`status` に応じて異なるメッセージを返す関数 `processResult` を実装してください。
function processResult(result: Result): string {
  /* ここを実装 */
}
```

---

### Section 4: 実践演習プロジェクト

> 📚 **サポート資料**: [実践コード例 - 型ガード演習完全版](./Step04_補足_実践コード例.md#型ガード演習完全版) | [トラブルシューティング - 型ガードエラー対処](./Step04_補足_トラブルシューティング.md#型ガードエラー対処)

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

## 👨‍🏫 学習ポイント

### 🤔 よくある質問と回答

**Q: `in` 演算子と判別可能なユニオンは、どのような場合に使い分けるべきですか？**
A: `in` 演算子は、オブジェクトに特定のプロパティが存在するかどうかで型を絞り込む場合に便利です。一方、判別可能なユニオンは、共通の「判別プロパティ」（例: `type` や `status`）の値に基づいて型を絞り込む場合に非常に強力です。特に、複数の異なる型のオブジェクトを扱う際に、`switch` 文と組み合わせることでコードの可読性と安全性が向上します。

**Q: 型ガードを自作することはできますか？**
A: はい、TypeScriptではユーザー定義型ガードを作成できます。これは、関数が特定の条件を満たす場合に、その引数の型をより具体的な型に絞り込むことをTypeScriptコンパイラに伝える機能です。`parameterName is Type` の形式で戻り値の型を宣言することで実現できます。

---

## 🎯 Session2 の成果確認

### 理解度チェック

- [ ] in 演算子を使った型ガードを実装できる
- [ ] 判別可能なユニオンの基本パターンを理解している
- [ ] switch 文を使った型の分岐処理ができる
- [ ] 実践的な API レスポンス処理で型ガードを活用できる
- [ ] フォーム処理での型安全性を確保できる

### 次回への準備
> 📚 **準備資料**: [開発環境ガイド](./Step04_補足_開発環境ガイド.md) | [参考リソース - 継続学習](./Step04_補足_参考リソース.md#学習継続のコツ)

- [ ] 作成したコードの動作確認
- [ ] 理解できなかった部分の整理
- [ ] Session3で完成させるプロジェクトの構想

**📌 重要**: Session2では実践的なコーディングを通じて型ガードの活用を体感します。完璧を目指さず、まずは動くコードを作ることを重視しましょう。

---

**🌟 次回（Session3）は、プロジェクトの完成と学習の総括を行います！**
