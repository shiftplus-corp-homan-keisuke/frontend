# Session3: ユーザー情報管理システムプロジェクト（90分）

> 🎯 **対象**: Session1-2完了者（オブジェクト型・列挙型・関数型ユーティリティ習得済み）
> 👥 **形式**: 1on1学習（講師と学習者）
> ⏰ **時間**: 90分

## 📅 セッション概要

**学習目標**:
- [ ] Session1-2で学習したユーティリティ型の実践的な活用
- [ ] ユーザー情報管理システムの型安全な設計と実装
- [ ] 型の組み合わせによる複雑なシステムの構築
- [ ] 実際の開発で使える型設計パターンの習得

**前提知識**:
- Session1の内容（Partial, Required, Readonly, Pick, Omit, Record）
- Session2の内容（Extract, Exclude, NonNullable, Parameters, ReturnType）
- 基本的なクラスとメソッドの実装

---

## ⏰ 詳細タイムテーブル

| 時間 | 内容 | 講師の役割 | 学習者の活動 |
|------|------|------------|--------------|
| **0-10分** | プロジェクト概要・要件説明 | 要件説明・質疑応答 | 理解・質問 |
| **10-30分** | 基本型定義・ユーザー作成機能 | 実演・個別サポート | 実装・確認 |
| **30-50分** | ユーザー更新・表示機能 | 実演・個別サポート | 実装・確認 |
| **50-70分** | バリデーション・エラーハンドリング | 実演・個別サポート | 実装・確認 |
| **70-85分** | 動作確認・テスト | 動作確認・デバッグ支援 | テスト・修正 |
| **85-90分** | 振り返り・総括 | 評価・フィードバック | 発表・質問 |

---

## 🎯 プロジェクト要件定義

### 📋 作成するシステムの概要

**「シンプルなユーザー管理システム」**を作成します。

このシステムは、Webアプリケーションでよく見られるユーザー管理機能を模擬したもので、以下のような場面で使用されることを想定しています：

- 管理者がユーザーアカウントを管理する
- ユーザー自身がプロフィール情報を更新する
- システムが安全にユーザーデータを処理する

### 🎯 具体的な機能要件

#### 1. ユーザー作成機能
- **目的**: 新しいユーザーアカウントを作成する
- **入力**: ユーザー名、メール、パスワード、基本情報
- **出力**: 作成されたユーザーの公開情報
- **制約**: バリデーション（メール形式、パスワード強度など）

#### 2. ユーザー更新機能
- **目的**: 既存ユーザーの情報を部分的に更新する
- **入力**: ユーザーID + 更新したい項目のみ
- **出力**: 更新されたユーザーの公開情報
- **制約**: 機密情報（パスワード、ロール）は更新不可

#### 3. ユーザー表示機能
- **目的**: ユーザー情報を安全に表示する
- **種類**:
  - 公開用（パスワードなどの機密情報を除外）
  - 管理用（より詳細な情報を含む）
- **出力**: 用途に応じて適切にフィルタリングされた情報

#### 4. データ検証機能
- **目的**: 入力データの妥当性を確認する
- **対象**: メールアドレス、年齢、パスワード強度など
- **出力**: 検証結果とエラーメッセージ

#### 5. エラーハンドリング
- **目的**: システムエラーを安全に処理する
- **対象**: バリデーションエラー、データ不整合、システムエラー
- **出力**: 統一されたエラーレスポンス

### 🔧 技術的な制約と方針

#### 使用するユーティリティ型とその理由

| ユーティリティ型 | 使用場面 | 理由 |
|------------------|----------|------|
| **Partial** | ユーザー更新 | 一部のフィールドのみ更新可能にする |
| **Required** | システム設定 | 必須設定を強制する |
| **Readonly** | 設定データ | 変更を防ぐ |
| **Pick** | 表示用データ | 必要なフィールドのみ選択 |
| **Omit** | 作成・公開用 | 不要・機密フィールドを除外 |
| **Record** | 設定・マッピング | キー値ペアの型安全性 |
| **Extract** | ロール管理 | 特定ロールのみ抽出 |
| **Exclude** | 状態管理 | 不要な状態を除外 |
| **NonNullable** | 安全性確保 | null/undefined を安全に処理 |
| **Parameters** | 関数型取得 | 関数の引数型を再利用 |
| **ReturnType** | 戻り値型取得 | 関数の戻り値型を再利用 |

### 📐 システム設計方針

#### 1. 型ファースト設計
- まず型を定義してから実装を行う
- 型によってデータの流れを明確にする

#### 2. 段階的実装
- Step1: 基本型定義
- Step2: 核となるクラス実装
- Step3: 使用例とテスト

#### 3. 実用性重視
- 実際の開発で使えるパターンを学習
- 過度に複雑にせず、理解しやすさを優先

---

## 🚀 実装の進め方

### Phase 1: 要件理解と設計（10分）
1. **要件の確認**: 上記の機能要件を理解する
2. **データ構造の検討**: どのような情報を管理するか考える
3. **型設計の方針**: どのユーティリティ型をどこで使うか計画する

### Phase 2: 基本型定義（20分）
1. **基本インターフェースの定義**: User, UserProfile, SystemSettings
2. **ユーティリティ型の活用**: 各用途に応じた型を作成
3. **練習問題**: 型定義の理解を深める

### Phase 3: 実装（40分）
1. **UserManagerクラスの実装**: 核となる機能を実装
2. **バリデーション機能**: 入力検証の実装
3. **エラーハンドリング**: 安全なエラー処理の実装

### Phase 4: テストと確認（15分）
1. **動作確認**: 実装した機能のテスト
2. **エラーケースの確認**: 異常系の動作確認
3. **型安全性の確認**: TypeScriptの型チェックが正しく働くか確認

### Phase 5: 振り返り（5分）
1. **学習内容の整理**: 使用したユーティリティ型の復習
2. **実用性の確認**: 実際の開発での応用方法を考える

---

## 📚 段階的実装ガイド

> 💡 **実装の進め方**: 以下の順序で段階的に実装していきます。各ステップで「なぜこの実装が必要なのか」を理解しながら進めましょう。

---

## Step 1: 基本型定義（Phase 2: 20分）

### 🎯 このステップの目的
- システムで扱うデータの構造を明確にする
- TypeScriptの型システムを活用してデータの整合性を保つ
- 後の実装で使用する型の基盤を作る

### 📝 実装する型の説明

まず、システムで扱うデータの構造を定義します。これらの型は後の実装で重要な役割を果たします。

```typescript
// ユーザーの基本情報
// 💡 なぜこの構造なのか：実際のWebアプリケーションでよく使われるユーザー情報を模擬
interface User {
  id: string;                    // 一意識別子
  username: string;              // ログイン用ユーザー名
  email: string;                 // メールアドレス（機密情報）
  password: string;              // パスワード（機密情報）
  firstName: string;             // 名前
  lastName: string;              // 姓
  age: number;                   // 年齢
  role: "admin" | "moderator" | "user" | "guest";  // ユーザーロール
  status: "active" | "inactive" | "suspended" | "pending";  // アカウント状態
  isEmailVerified: boolean;      // メール認証済みフラグ
  createdAt: Date;              // 作成日時（自動生成）
  updatedAt: Date;              // 更新日時（自動生成）
  lastLoginAt: Date | null;     // 最終ログイン日時（null許可）
}

// ユーザープロフィール情報（拡張情報）
// 💡 なぜ分離するのか：基本情報と拡張情報を分けることで管理しやすくする
interface UserProfile {
  userId: string;               // 対応するユーザーID
  bio: string;                  // 自己紹介
  avatar: string | null;        // プロフィール画像URL
  website: string | null;       // ウェブサイトURL
  location: string | null;      // 居住地
  birthDate: Date | null;       // 生年月日
  phoneNumber: string | null;   // 電話番号
}

// システム設定
// 💡 なぜ必要なのか：システムの動作を制御するパラメータを型安全に管理
// 💡 なぜオプショナル？：初期設定では一部の設定のみ提供され、残りはデフォルト値を使用するため
interface SystemSettings {
  maxLoginAttempts?: number;           // 最大ログイン試行回数
  sessionTimeout?: number;             // セッションタイムアウト（ミリ秒）
  passwordMinLength?: number;          // パスワード最小長
  requireEmailVerification?: boolean;  // メール認証必須フラグ
}

// 使用例1: 部分的な設定（一部のみ指定）
const partialConfig: SystemSettings = {
  maxLoginAttempts: 3  // 他の設定はデフォルト値を使用
};

// 使用例2: システム初期化時には全設定が必要
// Required型を使って全プロパティを必須にする
type RequiredSystemSettings = Required<SystemSettings>;

const fullConfig: RequiredSystemSettings = {
  maxLoginAttempts: 5,
  sessionTimeout: 1800000,
  passwordMinLength: 8,
  requireEmailVerification: true
};
```

#### 1-2. なぜこの型設計なのか？

**User型の設計理由：**
- `id`: システム内で一意に識別するため
- `email`, `password`: 機密情報として後で除外する対象
- `role`: 権限管理で特定のロールのみ抽出する対象
- `status`: 状態管理で不要な状態を除外する対象
- `lastLoginAt`: null許可でNonNullable型の練習対象

**型の分離理由：**
- 基本情報と拡張情報を分けることで、用途に応じて適切な型を選択可能
- 機密情報の管理を明確化
- システム設定は別管理で変更の影響範囲を限定

#### 🎯 練習問題 1: ユーティリティ型を使った型変換（15分）

> 💡 **この練習の目的**: 基本型から用途に応じた型を作成し、ユーティリティ型の実践的な使い方を学ぶ

**問題1-1: ユーザー作成用の型**
```typescript
// 🎯 目的: 新規ユーザー作成時に必要な情報のみの型を作成
// 💡 なぜ必要？: id, createdAt, updatedAt, lastLoginAtは自動生成されるため除外したい

type CreateUserData = /* ここに実装 */;

// 使用例: この型を使ってユーザー作成関数を定義
function createUser(userData: CreateUserData): User {
  return {
    id: generateId(),           // 自動生成
    createdAt: new Date(),      // 自動生成
    updatedAt: new Date(),      // 自動生成
    lastLoginAt: null,          // 初期値
    ...userData
  };
}
```

**問題1-2: ユーザー更新用の型**
```typescript
// 🎯 目的: ユーザー情報の部分更新用の型を作成
// 💡 なぜ必要？: id, createdAt, password, roleは更新不可、他は任意更新

type UpdateUserData = /* ここに実装 */;

// 使用例: 部分更新関数
function updateUser(id: string, updates: UpdateUserData): User {
  const existingUser = getUserById(id);
  return {
    ...existingUser,
    ...updates,
    updatedAt: new Date()  // 更新日時は自動設定
  };
}
```

**問題1-3: 公開用ユーザー情報の型**
```typescript
// 🎯 目的: 外部に公開しても安全なユーザー情報の型を作成
// 💡 なぜ必要？: password, email, lastLoginAtは機密情報なので除外

type PublicUserInfo = /* ここに実装 */;

// 使用例: API レスポンス用
function getUserProfile(id: string): PublicUserInfo {
  const user = getUserById(id);
  // 機密情報を自動的に除外した型で返される
  return omitSensitiveInfo(user);
}
```

**問題1-4: 管理者権限の型**
```typescript
// 🎯 目的: 管理者系のロールのみを抽出した型を作成
// 💡 なぜ必要？: 管理者機能で特定のロールのみを許可したい

type AdminRoles = /* ここに実装 */;

// 使用例: 管理者機能の権限チェック
function checkAdminPermission(userRole: User["role"]): userRole is AdminRoles {
  return userRole === "admin" || userRole === "moderator";
}
```

**問題1-5: アクティブ状態の型**
```typescript
// 🎯 目的: 非アクティブな状態を除外した型を作成
// 💡 なぜ必要？: アクティブユーザーのみを対象とした処理で使用

type ActiveStatus = /* ここに実装 */;

// 使用例: アクティブユーザーのフィルタリング
function getActiveUsers(users: User[]): User[] {
  return users.filter((user): user is User & { status: ActiveStatus } =>
    user.status === "active"
  );
}
```

---

#### ✅ 解答と解説

<details>
<summary>🔍 解答を見る（まず自分で考えてから開いてください）</summary>

```typescript
// 解答1-1: Omit型で自動生成フィールドを除外
type CreateUserData = Omit<User, "id" | "createdAt" | "updatedAt" | "lastLoginAt">;

// 解答1-2: Omit + Partial の組み合わせ
type UpdateUserData = Partial<Omit<User, "id" | "createdAt" | "password" | "role">>;

// 解答1-3: Omit型で機密情報を除外
type PublicUserInfo = Omit<User, "password" | "email" | "lastLoginAt">;

// 解答1-4: Extract型で特定の値のみ抽出
type AdminRoles = Extract<User["role"], "admin" | "moderator">;

// 解答1-5: Exclude型で不要な値を除外
type ActiveStatus = Exclude<User["status"], "inactive" | "suspended">;
```

**解説:**
- **Omit**: 不要なプロパティを除外する際に使用
- **Partial**: 全てのプロパティをオプショナルにする際に使用
- **Extract**: ユニオン型から特定の値のみを抽出する際に使用
- **Exclude**: ユニオン型から特定の値を除外する際に使用

</details>

---

#### 🧪 動作確認

実装した型が正しく動作するか確認してみましょう：

```typescript
// 型の動作確認用のテストコード
const testCreateUser: CreateUserData = {
  username: "testuser",
  email: "test@example.com",
  password: "password123",
  firstName: "太郎",
  lastName: "テスト",
  age: 25,
  role: "user",
  status: "active",
  isEmailVerified: false
  // id, createdAt, updatedAt, lastLoginAt は含まれない
};

const testUpdateUser: UpdateUserData = {
  firstName: "次郎",  // 部分更新可能
  age: 26            // 部分更新可能
  // password, role は更新不可
};

// TypeScriptが正しく型チェックしてくれることを確認
```

### Step 2: バリデーション機能の実装（Phase 2: 25分）

#### 🎯 学習目標
Step 1で作成した型を使って、実際にユーザーデータのバリデーション機能を実装します。ここでは**Required型**と**NonNullable型**を実践的に活用します。

#### 💡 なぜバリデーション機能から始めるのか？
- ユーザー管理システムでは、データの整合性が最も重要
- 型安全性を保ちながら、実際の業務ロジックを学習できる
- Step 1で学んだユーティリティ型を実践的に使用できる

---

#### 📝 実装する機能

まず、バリデーション機能に必要な型を定義しましょう。

**問題2-1: バリデーション結果の型定義**
```typescript
// 🎯 目的: バリデーション処理の結果を表現する型を作成
// 💡 なぜ必要？: エラーの有無と詳細なエラーメッセージを管理するため

interface ValidationResult {
  isValid: boolean;
  errors: /* ここに実装 */; // string配列 または null
}

// 使用例: バリデーション関数の戻り値として使用
function validateUser(data: CreateUserData): ValidationResult {
  // バリデーション処理...
  return {
    isValid: false,
    errors: ["ユーザー名が短すぎます", "メールアドレスが無効です"]
  };
}
```

**問題2-2: 必須設定項目の型定義**
```typescript
// 🎯 目的: システム設定で必須となる項目の型を作成
// 💡 なぜ必要？: 設定の不備によるシステムエラーを防ぐため

type RequiredSystemSettings = /* ここに実装 */; // SystemSettingsの全プロパティを必須に

// 使用例: システム初期化時の設定チェック
function initializeSystem(settings: Partial<SystemSettings>): RequiredSystemSettings {
  const defaultSettings: RequiredSystemSettings = {
    maxLoginAttempts: 5,
    sessionTimeout: 3600000,
    passwordMinLength: 8,
    requireEmailVerification: true
  };
  
  return { ...defaultSettings, ...settings };
}
```

**問題2-3: 非null値の型定義**
```typescript
// 🎯 目的: nullやundefinedを除外した安全な型を作成
// 💡 なぜ必要？: ログイン済みユーザーの最終ログイン時刻を安全に扱うため

type SafeLoginTime = /* ここに実装 */; // User["lastLoginAt"]からnullを除外

// 使用例: ログイン済みユーザーの情報表示
function formatLastLogin(loginTime: SafeLoginTime): string {
  // loginTimeは確実にDateなので、安全に操作できる
  return `最終ログイン: ${loginTime.toLocaleDateString()}`;
}
```

**問題2-4: バリデーション関数の実装**
```typescript
// 🎯 目的: CreateUserDataを検証する関数を実装
// 💡 なぜ必要？: 不正なデータでのユーザー作成を防ぐため

function validateCreateUserData(
  userData: CreateUserData,
  settings: RequiredSystemSettings
): ValidationResult {
  const errors: string[] = [];

  // ユーザー名の検証
  if (!userData.username || userData.username.length < 3) {
    errors.push("ユーザー名は3文字以上で入力してください");
  }

  // パスワードの検証
  if (!userData.password || userData.password.length < settings.passwordMinLength) {
    errors.push(`パスワードは${settings.passwordMinLength}文字以上で入力してください`);
  }

  // メールアドレスの検証
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!userData.email || !emailRegex.test(userData.email)) {
    errors.push("有効なメールアドレスを入力してください");
  }

  return {
    isValid: errors.length === 0,
    errors: errors.length > 0 ? errors : /* ここに実装 */ // エラーがない場合の値
  };
}
```

**問題2-5: 更新データのバリデーション**
```typescript
// 🎯 目的: UpdateUserDataを検証する関数を実装
// 💡 なぜ必要？: 部分更新時も適切なバリデーションが必要なため

function validateUpdateUserData(updateData: UpdateUserData): ValidationResult {
  const errors: string[] = [];

  // 年齢の検証（提供されている場合のみ）
  if (updateData.age !== undefined) {
    if (updateData.age < 0 || updateData.age > 150) {
      errors.push("年齢は0歳から150歳の間で入力してください");
    }
  }

  // 名前の検証（提供されている場合のみ）
  if (updateData.firstName !== undefined && updateData.firstName.trim().length === 0) {
    errors.push("名前は空文字にできません");
  }

  if (updateData.lastName !== undefined && updateData.lastName.trim().length === 0) {
    errors.push("姓は空文字にできません");
  }

  return {
    isValid: errors.length === 0,
    errors: errors.length > 0 ? errors : /* ここに実装 */ // エラーがない場合の値
  };
}
```

---

#### ✅ 解答と解説

<details>
<summary>🔍 解答を見る（まず自分で考えてから開いてください）</summary>

```typescript
// 解答2-1: NonNullable型でnullを除外
interface ValidationResult {
  isValid: boolean;
  errors: NonNullable<string[] | null>; // string[]型（nullは除外）
}

// 解答2-2: Required型で全プロパティを必須に
type RequiredSystemSettings = Required<SystemSettings>;

// 解答2-3: NonNullable型でnullとundefinedを除外
type SafeLoginTime = NonNullable<User["lastLoginAt"]>; // Date型

// 解答2-4: エラーがない場合はnullを返す
function validateCreateUserData(
  userData: CreateUserData,
  settings: RequiredSystemSettings
): ValidationResult {
  // ... バリデーション処理 ...
  
  return {
    isValid: errors.length === 0,
    errors: errors.length > 0 ? errors : null
  };
}

// 解答2-5: 同様にnullを返す
function validateUpdateUserData(updateData: UpdateUserData): ValidationResult {
  // ... バリデーション処理 ...
  
  return {
    isValid: errors.length === 0,
    errors: errors.length > 0 ? errors : null
  };
}
```

**解説:**
- **Required<T>**: 全てのプロパティを必須にする
- **NonNullable<T>**: null と undefined を除外する
- **実践的な使用**: 型安全性を保ちながら実際の業務ロジックを実装

</details>

---

#### 🧪 動作確認

実装したバリデーション機能をテストしてみましょう：

```typescript
// テスト用のシステム設定
const systemSettings: RequiredSystemSettings = {
  maxLoginAttempts: 5,
  sessionTimeout: 3600000,
  passwordMinLength: 8,
  requireEmailVerification: true
};

// 正常なデータのテスト
const validUserData: CreateUserData = {
  username: "testuser",
  email: "test@example.com",
  password: "password123",
  firstName: "太郎",
  lastName: "テスト",
  age: 25,
  role: "user",
  status: "active",
  isEmailVerified: false
};

const validResult = validateCreateUserData(validUserData, systemSettings);
console.log("正常データ:", validResult); // { isValid: true, errors: null }

// 不正なデータのテスト
const invalidUserData: CreateUserData = {
  username: "ab", // 短すぎる
  email: "invalid-email", // 無効なメール
  password: "123", // 短すぎる
  firstName: "太郎",
  lastName: "テスト",
  age: 25,
  role: "user",
  status: "active",
  isEmailVerified: false
};

const invalidResult = validateCreateUserData(invalidUserData, systemSettings);
console.log("不正データ:", invalidResult);
// { isValid: false, errors: ["ユーザー名は3文字以上...", "パスワードは8文字以上...", "有効なメールアドレス..."] }
```

---

#### 🤔 理解度確認

**Q**: なぜValidationResultのerrorsプロパティでNonNullable型を使ったのでしょうか？

**A**: エラーがある場合は配列、ない場合はnullという設計にしたかったのですが、NonNullable型を使うことで型レベルでnullが除外され、エラーがある場合は必ず配列になることが保証されるからです。

**Q**: Required型を使った理由も説明してください。

**A**: SystemSettingsは元々Partial型（全てオプショナル）でしたが、システム初期化時には全ての設定値が必要なので、Required型で全プロパティを必須にしました。これにより、設定の不備によるランタイムエラーを防げます。

---
### Step 3: ユーザー管理クラスの基本実装（Phase 3: 30分）

#### 🎯 学習目標
Step 2で作成したバリデーション機能を使って、実際のユーザー管理クラスを段階的に実装します。ここでは**Pick型**、**Readonly型**、**Parameters型**、**ReturnType型**を実践的に活用します。

#### 💡 なぜクラス実装に進むのか？
- バリデーション機能を実際のビジネスロジックで活用できる
- 複数のユーティリティ型を組み合わせた実践的な設計を学習できる
- 型安全性を保ちながら、実用的なシステムを構築できる

---

#### 📝 段階的な実装アプローチ

**まず最小限のUserManagerクラスから始めましょう**

**問題3-1: 基本的なUserManagerクラスの骨格**
```typescript
// 🎯 目的: ユーザー管理の基本機能を持つクラスを作成
// 💡 なぜ必要？: 型安全性を保ちながらユーザーデータを管理するため

class UserManager {
  private users: Map<string, User> = new Map();
  private settings: /* ここに実装 */; // SystemSettingsの全プロパティを必須に

  constructor(settings: Partial<SystemSettings> = {}) {
    // デフォルト設定と提供された設定をマージ
    this.settings = {
      maxLoginAttempts: 5,
      sessionTimeout: 3600000,
      passwordMinLength: 8,
      requireEmailVerification: true,
      ...settings
    };
  }

  // ID生成（簡易実装）
  private generateId(): string {
    return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// 使用例: システム初期化
const userManager = new UserManager({
  passwordMinLength: 10,
  requireEmailVerification: true
});
```

**問題3-2: ユーザー作成機能の実装**
```typescript
// 🎯 目的: バリデーション機能を使ったユーザー作成メソッドを実装
// 💡 なぜ必要？: 安全にユーザーを作成し、適切なレスポンスを返すため

// APIレスポンスの型定義
interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  error: string | null;
  timestamp: Date;
}

class UserManager {
  // ... 前の実装 ...

  async createUser(userData: CreateUserData): Promise</* ここに実装 */> {
    try {
      // Step 2で作成したバリデーション関数を使用
      const validation = validateCreateUserData(userData, this.settings);
      
      if (!validation.isValid) {
        return {
          success: false,
          data: null,
          error: validation.errors?.join(", ") || "バリデーションエラー",
          timestamp: new Date()
        };
      }

      // 新しいユーザーの作成
      const now = new Date();
      const newUser: User = {
        id: this.generateId(),
        createdAt: now,
        updatedAt: now,
        lastLoginAt: null,
        ...userData
      };

      this.users.set(newUser.id, newUser);

      // 公開用情報を返す（機密情報を除外）
      const publicInfo: PublicUserInfo = /* ここに実装 */; // passwordなどを除外

      return {
        success: true,
        data: publicInfo,
        error: null,
        timestamp: new Date()
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date()
      };
    }
  }
}
```

**問題3-3: ユーザー更新機能の実装**
```typescript
// 🎯 目的: 既存ユーザーの情報を安全に更新する機能を実装
// 💡 なぜ必要？: 部分更新を型安全に行い、適切なバリデーションを実施するため

class UserManager {
  // ... 前の実装 ...

  async updateUser(
    userId: string,
    updateData: UpdateUserData
  ): Promise<ApiResponse<PublicUserInfo>> {
    try {
      const existingUser = this.users.get(userId);
      if (!existingUser) {
        return {
          success: false,
          data: null,
          error: "ユーザーが見つかりません",
          timestamp: new Date()
        };
      }

      // Step 2で作成したバリデーション関数を使用
      const validation = validateUpdateUserData(updateData);
      if (!validation.isValid) {
        return {
          success: false,
          data: null,
          error: validation.errors?.join(", ") || "バリデーションエラー",
          timestamp: new Date()
        };
      }

      // ユーザー情報の更新
      const updatedUser: User = {
        ...existingUser,
        ...updateData,
        updatedAt: new Date()
      };

      this.users.set(userId, updatedUser);

      const publicInfo: PublicUserInfo = /* ここに実装 */; // 機密情報を除外

      return {
        success: true,
        data: publicInfo,
        error: null,
        timestamp: new Date()
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date()
      };
    }
  }
}
```

**問題3-4: ユーザー一覧取得機能（管理者用）**
```typescript
// 🎯 目的: 管理者が必要な情報のみを取得できる機能を実装
// 💡 なぜ必要？: 管理画面で表示する最小限の情報のみを提供するため

class UserManager {
  // ... 前の実装 ...

  getUsers(): /* ここに実装 */ {
    // Pick型を使って必要な情報のみを抽出
    const userList = Array.from(this.users.values());
    
    return userList.map(user => ({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      status: user.status
    }));
  }

  // アクティブユーザーのみを取得
  getActiveUsers(): PublicUserInfo[] {
    const activeUsers = Array.from(this.users.values())
      .filter(user => user.status === "active");
    
    return activeUsers.map(user => /* ここに実装 */); // 機密情報を除外
  }
}
```

**問題3-5: 設定取得とヘルパー関数**
```typescript
// 🎯 目的: システム設定を安全に取得し、ヘルパー関数を実装
// 💡 なぜ必要？: 設定の変更を防ぎ、型安全なヘルパー関数を提供するため

class UserManager {
  // ... 前の実装 ...

  // 設定の取得（読み取り専用）
  getSettings(): /* ここに実装 */ {
    // Readonly型で変更を防ぐ
    return Object.freeze({ ...this.settings });
  }

  // 公開用ユーザー情報の取得（プライベートヘルパー）
  private getPublicUserInfo(user: User): PublicUserInfo {
    // Omit型を使って機密情報を除外
    const { password, email, lastLoginAt, ...publicInfo } = user;
    return publicInfo;
  }
}

// 関数型ユーティリティの活用例
type CreateUserParams = /* ここに実装 */; // createUserメソッドの引数型
type UpdateUserResult = /* ここに実装 */; // updateUserメソッドの戻り値型
```

---

#### ✅ 解答と解説

<details>
<summary>🔍 解答を見る（まず自分で考えてから開いてください）</summary>

```typescript
// 解答3-1: Required型で全プロパティを必須に
class UserManager {
  private settings: Required<SystemSettings>;
  // ...
}

// 解答3-2: ApiResponse<PublicUserInfo>を返す
async createUser(userData: CreateUserData): Promise<ApiResponse<PublicUserInfo>> {
  // ...
  const publicInfo: PublicUserInfo = this.getPublicUserInfo(newUser);
  // ...
}

// 解答3-3: 同様にgetPublicUserInfoを使用
const publicInfo: PublicUserInfo = this.getPublicUserInfo(updatedUser);

// 解答3-4: Pick型で必要な情報のみ抽出
getUsers(): Pick<User, "id" | "username" | "email" | "role" | "status">[] {
  // ...
}

getActiveUsers(): PublicUserInfo[] {
  return activeUsers.map(user => this.getPublicUserInfo(user));
}

// 解答3-5: Readonly型で変更を防ぐ
getSettings(): Readonly<Required<SystemSettings>> {
  return Object.freeze({ ...this.settings });
}

// 関数型ユーティリティの活用
type CreateUserParams = Parameters<UserManager['createUser']>;
type UpdateUserResult = ReturnType<UserManager['updateUser']>;
```

**解説:**
- **Pick<T, K>**: 特定のプロパティのみを選択
- **Readonly<T>**: 全てのプロパティを読み取り専用に
- **Parameters<T>**: 関数の引数型を取得
- **ReturnType<T>**: 関数の戻り値型を取得

</details>

---

#### 🧪 動作確認

実装したUserManagerクラスをテストしてみましょう：

```typescript
// システムの使用例
async function demonstrateUserSystem() {
  // ユーザー管理システムの初期化
  const userManager = new UserManager({
    passwordMinLength: 10,
    requireEmailVerification: true
  });

  console.log("=== ユーザー管理システムのデモ ===");

  // 1. ユーザー作成
  console.log("\n1. ユーザー作成");
  const createResult = await userManager.createUser({
    username: "testuser",
    email: "test@example.com",
    password: "securepassword123",
    firstName: "太郎",
    lastName: "テスト",
    age: 25,
    role: "user",
    status: "active",
    isEmailVerified: false
  });

  if (createResult.success && createResult.data) {
    console.log("ユーザー作成成功:", createResult.data);
    
    // 2. ユーザー更新
    console.log("\n2. ユーザー更新");
    const updateResult = await userManager.updateUser(createResult.data.id, {
      firstName: "次郎",
      age: 26,
      isEmailVerified: true
    });

    if (updateResult.success) {
      console.log("ユーザー更新成功:", updateResult.data);
    }

    // 3. アクティブユーザー一覧取得
    console.log("\n3. アクティブユーザー一覧");
    const activeUsers = userManager.getActiveUsers();
    console.log("アクティブユーザー数:", activeUsers.length);

    // 4. システム設定確認
    console.log("\n4. システム設定");
    const settings = userManager.getSettings();
    console.log("設定:", settings);
  } else {
    console.log("ユーザー作成失敗:", createResult.error);
  }
}

// 実行
demonstrateUserSystem();
```

---

#### 🤔 理解度確認

**Q**: Pick型を使ってgetUsersメソッドで特定のプロパティのみを返すようにした理由を説明してください。

**A**: 管理者画面では全ての情報は必要なく、一覧表示に必要な最小限の情報（id、username、email、role、status）のみを提供することで、パフォーマンスの向上とセキュリティの強化を図れるからです。Pick型を使うことで、型レベルでこの制約を保証できます。

**Q**: Readonly型を使った理由も説明してください。

**A**: getSettingsメソッドで設定を返す際、呼び出し側で設定を変更されることを防ぐためです。Object.freezeと組み合わせることで、ランタイムでも変更を防げます。

---

### Step 4: 学習の振り返りと総合演習（Phase 4: 15分）

#### 🎯 学習目標
これまでのStep 1-3で学習したユーティリティ型を振り返り、実際のプロジェクトでどのように活用されているかを確認します。

#### 💡 なぜ振り返りが重要なのか？
- 学習した内容を整理し、理解を深めることができる
- 実際のプロジェクトでの活用方法を再確認できる
- 次のステップに向けた準備ができる

---

#### 📝 学習内容の振り返り

**Step 1で学習したオブジェクト型ユーティリティ**
- **Partial<T>**: SystemSettingsでオプショナルな設定を実現
- **Required<T>**: システム初期化時に全設定を必須に
- **Readonly<T>**: 設定の変更を防ぐ
- **Pick<T, K>**: 管理者用一覧で必要な情報のみ抽出
- **Omit<T, K>**: 機密情報を除外した公開用型を作成
- **Record<K, V>**: （今回は使用せず、次回以降で活用予定）

**Step 2で学習した列挙型・関数型ユーティリティ**
- **Extract<T, U>**: 管理者ロールのみを抽出（AdminRoles型）
- **Exclude<T, U>**: 非アクティブ状態を除外（ActiveStatus型）
- **NonNullable<T>**: null/undefinedを除外した安全な型
- **Parameters<T>**: 関数の引数型を取得
- **ReturnType<T>**: 関数の戻り値型を取得

**Step 3で学習した実践的な組み合わせ**
- 複数のユーティリティ型を組み合わせた実用的な設計
- 型安全性を保ちながらのビジネスロジック実装
- バリデーション機能との連携

---

#### 🧪 総合演習問題

**問題4-1: 型の理解度チェック**
```typescript
// 🎯 目的: 学習した型の理解度を確認
// 💡 以下の型がどのような型になるか予想してください

type Test1 = Partial<Required<SystemSettings>>; // これは何型？
type Test2 = Pick<Omit<User, "password">, "id" | "username">; // これは何型？
type Test3 = NonNullable<Extract<User["status"], "active" | null>>; // これは何型？

// 使用例で確認
const test1: Test1 = { /* どのようなプロパティが必要？ */ };
const test2: Test2 = { /* どのようなプロパティが必要？ */ };
const test3: Test3 = /* どのような値が入る？ */;
```

**問題4-2: 実践的な型設計**
```typescript
// 🎯 目的: 学習した型を使って新しい機能の型を設計
// 💡 ユーザー検索機能の型を設計してください

// 検索条件の型（部分的な条件指定を可能に）
type UserSearchCriteria = /* ここに実装 */;

// 検索結果の型（機密情報は除外）
type UserSearchResult = /* ここに実装 */;

// 検索機能のクラス
class UserSearchService {
  constructor(private userManager: UserManager) {}

  search(criteria: UserSearchCriteria): UserSearchResult[] {
    // 実装は省略
    return [];
  }
}
```

**問題4-3: エラーハンドリングの型設計**
```typescript
// 🎯 目的: 型安全なエラーハンドリングを設計
// 💡 様々なエラータイプを型安全に扱う仕組みを作成

type UserError =
  | { type: "VALIDATION_ERROR"; details: string[] }
  | { type: "NOT_FOUND_ERROR"; userId: string }
  | { type: "PERMISSION_ERROR"; requiredRole: AdminRoles };

// エラーハンドリング関数の型
type ErrorHandler<T> = /* ここに実装 */; // エラーまたは成功値を返す型

// 使用例
function handleUserOperation<T>(
  operation: () => T,
  onError: (error: UserError) => void
): T | null {
  // 実装は省略
  return null;
}
```

---

#### ✅ 解答と解説

<details>
<summary>🔍 解答を見る（まず自分で考えてから開いてください）</summary>

```typescript
// 解答4-1: 型の理解度チェック
type Test1 = Partial<Required<SystemSettings>>;
// = Partial<SystemSettings> (Required後にPartialなので元に戻る)

type Test2 = Pick<Omit<User, "password">, "id" | "username">;
// = { id: string; username: string } (passwordを除外後、idとusernameのみ選択)

type Test3 = NonNullable<Extract<User["status"], "active" | null>>;
// = "active" (activeのみ抽出後、nullを除外)

// 使用例
const test1: Test1 = { passwordMinLength: 8 }; // 全てオプショナル
const test2: Test2 = { id: "123", username: "test" }; // idとusernameのみ
const test3: Test3 = "active"; // "active"のみ

// 解答4-2: 実践的な型設計
type UserSearchCriteria = Partial<Pick<User, "username" | "email" | "role" | "status">>;
type UserSearchResult = Omit<User, "password" | "lastLoginAt">;

// 解答4-3: エラーハンドリングの型設計
type ErrorHandler<T> = T | { error: UserError };

function handleUserOperation<T>(
  operation: () => T,
  onError: (error: UserError) => void
): T | null {
  try {
    return operation();
  } catch (error) {
    const userError: UserError = {
      type: "VALIDATION_ERROR",
      details: ["Unknown error"]
    };
    onError(userError);
    return null;
  }
}
```

**解説:**
- **型の組み合わせ**: 複数のユーティリティ型を組み合わせることで、より複雑で実用的な型を作成できる
- **実践的な設計**: 実際のプロジェクトでは、ビジネス要件に応じて適切な型を選択・組み合わせする
- **エラーハンドリング**: 型安全なエラーハンドリングにより、実行時エラーを防げる

</details>

---

#### 🎓 学習の成果確認

**今回のSession3で身につけたスキル:**

1. **型設計スキル**
   - ビジネス要件に応じた適切な型の選択
   - 複数のユーティリティ型の組み合わせ
   - 型安全性とパフォーマンスのバランス

2. **実装スキル**
   - バリデーション機能の型安全な実装
   - クラス設計における型の活用
   - エラーハンドリングの型安全な実装

3. **設計思考**
   - セキュリティを考慮した型設計（機密情報の除外）
   - 保守性を考慮した型設計（変更に強い設計）
   - 可読性を考慮した型設計（意図が明確な型名）

---

#### 🚀 次のステップに向けて

**Q**: 今回学習したユーティリティ型の中で、最も実用的だと感じたものはどれですか？

**A**: Omit型が最も実用的だと感じました。機密情報を除外したPublicUserInfo型の作成や、自動生成フィールドを除外したCreateUserData型の作成など、実際のプロジェクトでよく使われるパターンを型安全に実現できるからです。

**次のステップ**: 次のStep07では、これらの型を使ってより複雑なシステムを構築していきます。今回学習した内容をしっかりと復習しておいてください。

---

#### 📚 復習のポイント

1. **各ユーティリティ型の特徴と使用場面を整理**
2. **実際のコードでの活用例を再確認**
3. **型の組み合わせパターンを理解**
4. **エラーハンドリングでの型活用を復習**

**お疲れさまでした！Step06のSession3はこれで完了です。**

  }
}

// 3. エクスポート機能
interface ExportOptions {
  format: "json" | "csv";
  fields: (keyof PublicUserInfo)[];
  includeInactive?: boolean;
}

class UserExporter {
  constructor(private userManager: UserManager) {}

  exportUsers(options: ExportOptions): string {
    // ここに実装
  }
}
```

---

## 🎯 最終課題

以下の要件を満たす完全なユーザー管理システムを実装してください：

### 必須機能
1. **ユーザー管理**: 作成・更新・削除・検索
2. **権限管理**: ロールベースのアクセス制御
3. **バリデーション**: 包括的な入力検証
4. **エラーハンドリング**: 型安全なエラー処理
5. **統計機能**: ユーザー統計の生成

### 型安全性の要件
- 全ての関数に適切な型注釈
- ユーティリティ型の効果的な活用
- null/undefined安全性の確保
- 型レベルでの制約の実装

### 実装のポイント
1. **段階的実装**: 一つずつ機能を追加し、動作確認
2. **型の再利用**: 共通の型パターンを抽出
3. **エラーハンドリング**: 想定される例外ケースを考慮
4. **テスト**: 実装した機能の動作確認

---

## 👨‍🏫 学習ポイント

### 🤔 よくある実装上の問題

**Q: 複雑な型定義でコンパイラが遅くなる場合は？**
A: 型エイリアスを使って複雑な型を分割し、再帰の深さを制限しましょう。

**Q: ユーティリティ型の組み合わせで予期しない型になる場合は？**
A: TypeScript Playgroundを使って段階的に型を確認し、中間結果を型エイリアスで保存して問題箇所を特定しましょう。

**Q: 実行時エラーと型エラーの関係は？**
A: TypeScriptの型システムは実行時の動作を完全には保証しません。重要な箇所では実行時バリデーションも併用しましょう。

### 💡 実践のコツ

1. **型ファースト設計**: 実装前に型を設計し、型から実装を導く
2. **段階的な型変換**: 複雑な型変換は段階的に行い、可読性を保つ
3. **型の文書化**: 複雑な型には適切なコメントを付ける
4. **実用性重視**: 過度に複雑な型は避け、実用性を重視する

---

## 📊 Step06総合評価

### 学習成果の確認

#### 技術習得度
- [ ] **オブジェクト型**: Partial、Required、Pick、Omit、Recordの適切な使用
- [ ] **列挙型**: Extract、Exclude、NonNullableの効果的な活用
- [ ] **関数型**: Parameters、ReturnTypeの実践的な使用
- [ ] **型の組み合わせ**: 複数のユーティリティ型の組み合わせ

#### 実装品質
- [ ] **型安全性**: 全ての操作が型安全に実装されている
- [ ] **エラーハンドリング**: 適切な例外処理の実装
- [ ] **可読性**: 理解しやすいコードとコメント
- [ ] **実用性**: 実際の開発で使える設計パターン

#### 学習姿勢
- [ ] **問題解決**: 自力でのデバッグと調査
- [ ] **応用力**: 学習内容の実践的な応用
- [ ] **継続学習**: さらなる学習への意欲

---

**🎉 お疲れ様でした！** Step06を通じてユーティリティ型の実践的な活用方法を身につけることができました。

**🚀 これで TypeScript の型システムの基礎が固まりました。次のステップでは、より高度な実践プロジェクトに挑戦しましょう！**