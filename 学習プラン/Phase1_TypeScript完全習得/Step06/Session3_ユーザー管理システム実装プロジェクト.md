# Session3: ユーティリティ型実践演習（30 分）

> 🎯 **対象**: Session1-2 完了者（基本的なユーティリティ型を習得済み）
> 👥 **形式**: 1on1 学習（講師と学習者）
> ⏰ **時間**: 30 分

## 📅 セッション概要

**学習目標**:

- [ ] Partial, Pick, Omit の実践的な組み合わせ
- [ ] ユースケース別の型設計パターンの習得
- [ ] 型安全性を考慮した設計思考の身につけ

**前提知識**:

- Partial, Pick, Omit の基本的な使い方
- TypeScript の基本的なインターフェースの知識

---

## ⏰ 詳細タイムテーブル

| 時間         | 内容                           | 講師の役割               | 学習者の活動 |
| ------------ | ------------------------------ | ------------------------ | ------------ |
| **0-5 分**   | 型設計の基本原則説明           | 原則説明・質疑応答       | 理解・質問   |
| **5-20 分**  | ユーティリティ型組み合わせ演習 | 個別サポート・ヒント提供 | 型定義・確認 |
| **20-25 分** | 応用問題・型の検証             | 問題提示・解説           | 実装・検証   |
| **25-30 分** | 振り返り・型設計パターン整理   | 総括・フィードバック     | 質問・復習   |

---

## 🎯 型設計の基本原則

### 📋 なぜユーティリティ型が重要なのか？

実際の開発では、一つの基本型から用途に応じて様々な型を派生させる必要があります：

- **API 入力用**: 自動生成されるフィールドを除外
- **部分更新用**: 一部のフィールドのみ更新可能
- **表示用**: 機密情報を除外した安全な型
- **管理用**: 管理者のみ必要な最小限の情報

### 🔧 今回学習するユーティリティ型

| ユーティリティ型 | 用途                         | 実際の使用場面                       |
| ---------------- | ---------------------------- | ------------------------------------ |
| **Omit<T, K>**   | 不要なプロパティの除外       | 機密情報除外、自動生成フィールド除外 |
| **Partial<T>**   | 全プロパティをオプショナル化 | 部分更新、設定オブジェクト           |
| **Pick<T, K>**   | 必要なプロパティのみ選択     | 一覧表示、サマリー情報               |

### 💡 型設計の 3 つの原則

1. **セキュリティファースト**: 機密情報は型レベルで除外
2. **柔軟性の確保**: 部分更新など柔軟な操作を型安全に
3. **効率性の追求**: 必要最小限の情報のみを扱う

---

## 🚀 学習の進め方

### Phase 1: 型設計の基本原則理解（5 分）

1. ユーティリティ型の使い分けを理解
2. 型設計の 3 つの原則を確認

### Phase 2: 段階的な型定義演習（15 分）

1. 基本型からの派生型作成
2. 複数のユーティリティ型の組み合わせ
3. 型安全性の検証

### Phase 3: 応用問題と検証（5 分）

1. 複合的な型定義チャレンジ
2. TypeScript による型チェック確認

### Phase 4: 振り返りと型パターン整理（5 分）

1. 学習した型パターンの整理
2. 実務での応用方法の確認

---

## 📚 段階的な型定義演習

---

## Step 1: 基本型の理解（Phase 2: 5 分）

### 🎯 このステップの目的

- 基本となる User 型を理解する
- どの情報が機密情報か、自動生成されるかを把握する

### 📝 基本型の定義

```typescript
// ユーザーの基本情報
interface User {
  id: string; // 一意識別子（自動生成）
  username: string; // ユーザー名
  email: string; // メールアドレス（機密情報）
  password: string; // パスワード（機密情報）
  firstName: string; // 名前
  lastName: string; // 姓
  age: number; // 年齢
  role: "admin" | "user" | "guest"; // ユーザーロール
  createdAt: Date; // 作成日時（自動生成）
  updatedAt: Date; // 更新日時（自動生成）
}
```

### 💡 型の分類

- **機密情報**: `email`, `password` - 外部に公開してはいけない
- **自動生成**: `id`, `createdAt`, `updatedAt` - システムが自動で設定
- **更新可能**: `username`, `firstName`, `lastName`, `age`, `role` - ユーザーが更新可能

---

## Step 2: 基本的なユーティリティ型演習（Phase 2: 5 分）

### 🎯 演習 2-1: 型の基本的な変換

**問題 2-1-1: 新規ユーザー作成用の型**

```typescript
// 🎯 目的: 新規作成時は自動生成フィールドを除外したい
// 💡 ヒント: id, createdAt, updatedAtは自動生成される

type CreateUserInput = /* ここに実装 */;

// 検証用: この型でオブジェクトを作成してみてください
const newUserData: CreateUserInput = {
  // 必要なプロパティを記入
};
```

**問題 2-1-2: 公開用ユーザー情報の型**

```typescript
// 🎯 目的: 外部公開時は機密情報を除外したい
// 💡 ヒント: email, passwordは機密情報

type PublicUserInfo = /* ここに実装 */;

// 検証用: この型でオブジェクトを作成してみてください
const publicUser: PublicUserInfo = {
  // 必要なプロパティを記入
};
```

**問題 2-1-3: 管理者用一覧表示の型**

```typescript
// 🎯 目的: 一覧表示では必要最小限の情報のみ表示したい
// 💡 ヒント: id, username, role, createdAtのみ必要

type UserListItem = /* ここに実装 */;

// 検証用: この型でオブジェクトを作成してみてください
const listItem: UserListItem = {
  // 必要なプロパティを記入
};
```

#### ✅ 解答と解説

<details>
<summary>🔍 解答を見る（まず自分で考えてから開いてください）</summary>

```typescript
// 解答2-1-1: Omit型で自動生成フィールドを除外
type CreateUserInput = Omit<User, "id" | "createdAt" | "updatedAt">;

// 検証用
const newUserData: CreateUserInput = {
  username: "testuser",
  email: "test@example.com",
  password: "password123",
  firstName: "太郎",
  lastName: "テスト",
  age: 25,
  role: "user",
};

// 解答2-1-2: Omit型で機密情報を除外
type PublicUserInfo = Omit<User, "email" | "password">;

// 検証用
const publicUser: PublicUserInfo = {
  id: "user_123",
  username: "testuser",
  firstName: "太郎",
  lastName: "テスト",
  age: 25,
  role: "user",
  createdAt: new Date(),
  updatedAt: new Date(),
};

// 解答2-1-3: Pick型で必要な情報のみ選択
type UserListItem = Pick<User, "id" | "username" | "role" | "createdAt">;

// 検証用
const listItem: UserListItem = {
  id: "user_123",
  username: "testuser",
  role: "user",
  createdAt: new Date(),
};
```

**解説:**

- **Omit<T, K>**: 指定したプロパティを除外した新しい型を作成
- **Pick<T, K>**: 指定したプロパティのみを持つ新しい型を作成
- 用途に応じて適切なユーティリティ型を選択することが重要

</details>

---

## Step 3: 複合的なユーティリティ型演習（Phase 2: 5 分）

### 🎯 演習 3-1: 複数のユーティリティ型の組み合わせ

**問題 3-1-1: ユーザー更新用の型**

```typescript
// 🎯 目的: 更新時は一部フィールドのみ任意で更新可能にしたい
// 💡 ヒント: id, createdAtは更新不可、他は任意更新
// 💡 どのユーティリティ型を組み合わせますか？

type UpdateUserInput = /* ここに実装 */;

// 検証用: 部分的な更新データを作成してみてください
const updateData: UpdateUserInput = {
  // 一部のプロパティのみ更新
};
```

**問題 3-1-2: 管理者編集用の型**

```typescript
// 🎯 目的: 管理者は機密情報以外をすべて編集可能にしたい
// 💡 ヒント: password, email以外は編集可能、ただし任意

type AdminEditInput = /* ここに実装 */;

// 検証用
const adminUpdate: AdminEditInput = {
  // 管理者が編集可能なプロパティを記入
};
```

**問題 3-1-3: プロフィール表示用の型**

```typescript
// 🎯 目的: プロフィール画面では基本情報のみ表示したい
// 💡 ヒント: username, firstName, lastName, ageのみ必要

type ProfileInfo = /* ここに実装 */;

// 検証用
const profile: ProfileInfo = {
  // 必要なプロパティを記入
};
```

#### ✅ 解答と解説

<details>
<summary>🔍 解答を見る（まず自分で考えてから開いてください）</summary>

```typescript
// 解答3-1-1: Omit + Partial の組み合わせ
type UpdateUserInput = Partial<Omit<User, "id" | "createdAt">>;

// 検証用: 任意のフィールドのみ更新
const updateData: UpdateUserInput = {
  firstName: "次郎", // 名前のみ更新
  age: 26, // 年齢のみ更新
  // 他のフィールドは更新しない
};

// 解答3-1-2: Partial + Omit の組み合わせ
type AdminEditInput = Partial<Omit<User, "password" | "email">>;

// 検証用
const adminUpdate: AdminEditInput = {
  username: "newusername",
  role: "admin",
  // password, emailは編集不可
};

// 解答3-1-3: Pick型で必要な情報のみ
type ProfileInfo = Pick<User, "username" | "firstName" | "lastName" | "age">;

// 検証用
const profile: ProfileInfo = {
  username: "testuser",
  firstName: "太郎",
  lastName: "テスト",
  age: 25,
};
```

**解説:**

- **複合的な使用**: `Partial<Omit<T, K>>`のように組み合わせることで、より柔軟な型定義が可能
- **順序の重要性**: `Omit`で不要なフィールドを除外してから`Partial`でオプショナル化
- **型安全性**: 編集不可なフィールドや機密情報を型レベルで制御

</details>

---

## Step 4: 応用問題と型検証（Phase 3: 5 分）

### 🎯 チャレンジ問題: 複合的な型設計

**問題 4-1: API レスポンス用の型設計**

```typescript
// 🎯 目的: APIレスポンスで使用する包括的な型を設計
// 💡 以下の要件を満たす型を作成してください:
//
// 1. UserCreateResponse: ユーザー作成時のレスポンス（機密情報除外）
// 2. UserUpdateResponse: ユーザー更新時のレスポンス（機密情報除外）
// 3. UserListResponse: ユーザー一覧取得時のレスポンス（最小限の情報）
// 4. UserDetailResponse: ユーザー詳細取得時のレスポンス（role=adminの場合のみ全情報）

// ここに4つの型を定義してください
type UserCreateResponse = /* ここに実装 */;
type UserUpdateResponse = /* ここに実装 */;
type UserListResponse = /* ここに実装 */;
type UserDetailResponse = /* ここに実装 */;

// 型の検証用コード
declare const createResp: UserCreateResponse;
declare const updateResp: UserUpdateResponse;
declare const listResp: UserListResponse[];
declare const detailResp: UserDetailResponse;
```

#### ✅ 解答と解説

<details>
<summary>🔍 解答を見る</summary>

```typescript
// 包括的なAPIレスポンス型の設計例
type UserCreateResponse = Omit<User, "email" | "password">;
type UserUpdateResponse = Omit<User, "email" | "password">;
type UserListResponse = Pick<User, "id" | "username" | "role" | "createdAt">;
type UserDetailResponse = Omit<User, "password">; // 管理者用は email を含む

// より実践的な例（条件分岐を含む）
type UserDetailResponse<T extends User["role"]> = T extends "admin"
  ? Omit<User, "password"> // 管理者: password以外すべて
  : Omit<User, "email" | "password">; // 一般: email, password除外
```

**学習ポイント:**

- **一貫性**: 似たような用途の型は同じパターンで設計
- **拡張性**: 将来の要件変更に対応できる設計
- **型安全性**: 権限に応じた情報の制御

</details>

---

---

## Step 5: 振り返りと型パターン整理（Phase 4: 5 分）

### 📝 学習した型パターンの整理

**今回学習したユーティリティ型の使い分け:**

| パターン              | 用途               | 実装例                           |
| --------------------- | ------------------ | -------------------------------- |
| `Omit<T, K>`          | 不要フィールド除外 | `Omit<User, "password">`         |
| `Pick<T, K>`          | 必要フィールド選択 | `Pick<User, "id" \| "username">` |
| `Partial<T>`          | 全フィールド任意化 | `Partial<User>`                  |
| `Partial<Omit<T, K>>` | 除外後に任意化     | `Partial<Omit<User, "id">>`      |

**実践的な型設計パターン:**

1. **入力型パターン**

   - 新規作成: `Omit<T, 自動生成フィールド>`
   - 更新: `Partial<Omit<T, 不変フィールド>>`

2. **出力型パターン**

   - 公開用: `Omit<T, 機密フィールド>`
   - 一覧用: `Pick<T, 最小限フィールド>`

3. **権限別パターン**
   - 一般ユーザー: 機密情報を除外
   - 管理者: より多くの情報を含む

### 🎓 学習の成果

**身につけたスキル:**

- [ ] 基本的なユーティリティ型の理解と使い分け
- [ ] 複数のユーティリティ型の組み合わせ方法
- [ ] セキュリティを考慮した型設計思考
- [ ] 実務で使える型パターンの習得

**実際の開発での応用:**

- API 設計時の型安全性確保
- フォーム入力の型定義
- レスポンス情報の適切な制御
- 権限に応じた情報の表示制御

### 💡 次のステップに向けて

**今回の学習を活かして:**

- より複雑な型定義（条件付き型など）への準備
- 実際のプロジェクトでの型設計実践
- チーム開発での型安全性の向上

---

## 📊 総合評価

### 学習成果の確認

#### 技術習得度

- [ ] **Omit 型**: 不要な情報の除外パターン
- [ ] **Pick 型**: 必要な情報の選択パターン
- [ ] **Partial 型**: オプショナル化のパターン
- [ ] **組み合わせ**: 複数ユーティリティ型の組み合わせ

#### 設計思考

- [ ] **セキュリティ考慮**: 機密情報の型レベル制御
- [ ] **柔軟性確保**: 部分更新などの柔軟な操作
- [ ] **効率性追求**: 必要最小限の情報設計

---

**🎉 お疲れ様でした！** 30 分でユーティリティ型の実践的な使い分けを身につけることができました。

**🚀 型設計の基本パターンを習得し、実務で応用できる力が身につきました！**
