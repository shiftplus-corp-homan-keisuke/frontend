# Session1: 高度な型機能理論と基本実践（90 分）

> 💡 **対象**: Step01-07 完了者（ジェネリクス・ユーティリティ型・プロジェクト設計基礎習得済み）
> 🎯 **形式**: 講師サポート付き学習
> ⏰ **時間**: 90 分（休憩含む）

## 📚 関連補足資料

このセッションの学習をサポートする補足資料をご用意しています：

- 📖 **[専門用語集](./Step10_補足_専門用語集.md)** - 高度な型機能・条件型・マップ型の重要な概念と用語の詳細解説
- 💻 **[実践コード例](./Step10_補足_実践コード例.md)** - 段階的な学習のためのコード例集
- 🔧 **[開発環境ガイド](./Step10_補足_開発環境ガイド.md)** - 効率的な開発環境の活用
- 🌐 **[参考リソース](./Step10_補足_参考リソース.md)** - 学習に役立つリンク集とリソース
- 🚨 **[トラブルシューティング](./Step10_補足_トラブルシューティング.md)** - よくあるエラーと解決方法

> 💡 **活用方法**: 学習中に疑問が生じた際や、より深く理解したい場合に参照してね 🐰

## 📅 セッション概要

**学習目標**:

- [ ] 条件付き型（Conditional Types）の基本概念と構文を理解する
- [ ] infer キーワードの基本的な使用方法を習得する
- [ ] マップ型（Mapped Types）の高度なパターンを理解する
- [ ] 既習のジェネリクスとユーティリティ型を活用した型レベル操作を実践する

**前提知識**:

- Step05 で学習したジェネリクスの基礎（型パラメータ、制約、型推論）
- Step06 で学習したユーティリティ型（Pick、Omit、Partial、Required 等）
- Step07 で学習したプロジェクト設計の基礎（型設計、モジュール設計）

---

## ⏰ 詳細タイムテーブル

| 時間         | 内容                 | 講師の役割           | 学習者の活動   | 成果物     |
| ------------ | -------------------- | -------------------- | -------------- | ---------- |
| **0-10 分**  | 全体概要・目標設定   | 説明・質疑応答       | 聞く・質問     | 理解確認   |
| **10-30 分** | 条件付き型基本概念   | 要点解説・補足       | 個人学習・確認 | 知識整理   |
| **30-60 分** | infer キーワード実践 | 実演・個別サポート   | ハンズオン     | 基本コード |
| **60-80 分** | マップ型高度パターン | 巡回サポート・ヒント | 個人作業       | 練習成果   |
| **80-90 分** | 振り返り・次回予告   | まとめ・予告         | 質問・確認     | 学習計画   |

---

## 📚 学習内容

### Section 1: 条件付き型の基本概念

> 📚 **関連資料**: [専門用語集 - 条件付き型](./Step10_補足_専門用語集.md#条件付き型conditional-types) | [実践コード例 - 基本から始める段階的学習](./Step10_補足_実践コード例.md#基本から始める段階的学習)

#### 🔍 条件付き型とは何か

**💡 なぜ条件付き型が重要なのか**

条件付き型は、TypeScript の型システムにおいて「もし〜なら〜、そうでなければ〜」という条件分岐を型レベルで実現する機能です。これまで学習したジェネリクス（Step05）とユーティリティ型（Step06）の知識を組み合わせることで、より柔軟で表現力豊かな型システムを構築できます。

**🔬 条件付き型の詳細な仕組み**

条件付き型は、型システム内で動的な判定を可能にする高度な機能です：

1. **型レベルでの条件判定**: 実行時ではなく、コンパイル時に型の条件を評価
2. **型の継承関係の利用**: `extends` キーワードで型の代入可能性をチェック
3. **遅延評価**: ジェネリクス型パラメータが確定するまで評価を遅延
4. **分散条件型**: ユニオン型に対して自動的に分散処理を実行

**📊 従来の型システムとの違い**

```typescript
// 従来：静的な型定義のみ
interface ApiResponse {
  success: boolean;
  data: any; // 型安全性が低い
}

// 条件付き型：動的で型安全な定義
type ApiResponse<T> = T extends never
  ? { success: false; error: string }
  : { success: true; data: T };
```

**🎯 どういう場面で使うのか**

- **型の条件分岐**: 入力型に応じて異なる型を返したい場合
- **型安全な API 設計**: リクエストの種類に応じてレスポンス型を変える
- **ライブラリ設計**: 使用者の型に応じて適切な型を提供する
- **型レベルの計算**: 複雑な型変換やフィルタリング
- **エラーハンドリング**: 型レベルでのエラー状態の表現

**⚡ パフォーマンスとコンパイル時の最適化**

条件付き型はコンパイル時にのみ動作し、実行時のパフォーマンスには影響しません。TypeScript コンパイラーが型チェック時に条件を評価し、最適な型を決定します。

#### 基本的な条件付き型の構文

```typescript
// 基本構文: T extends U ? X : Y
// 「TがUに代入可能なら型X、そうでなければ型Y」

// 最もシンプルな例
type IsString<T> = T extends string ? true : false;

type Test1 = IsString<string>; // true
type Test2 = IsString<number>; // false
type Test3 = IsString<"hello">; // true（文字列リテラル型もstring型に代入可能）

// Step05のジェネリクス知識を活用した実用例
type ApiResponse<T> = T extends never
  ? { success: false; error: string }
  : { success: true; data: T };

// 使用例
interface User {
  id: number;
  name: string;
}

type UserResponse = ApiResponse<User>;
// { success: true; data: User }

type ErrorResponse = ApiResponse<never>;
// { success: false; error: string }
```

#### Step06 のユーティリティ型との組み合わせ

```typescript
// Step06で学習したPartialとの組み合わせ
type UpdatePayload<T, K extends keyof T> = T extends object
  ? Partial<Pick<T, K>> & Omit<T, K>
  : never;

interface UserProfile {
  id: number;
  name: string;
  email: string;
  avatar: string;
}

// nameとemailのみ更新可能にする
type UserUpdatePayload = UpdatePayload<UserProfile, "name" | "email">;
// { name?: string; email?: string; id: number; avatar: string; }
```

### 練習問題 1.1: 条件付き型基礎 🔰

以下の要件を満たす条件付き型を作成してください：

```typescript
// 要件: 配列型なら要素の型を、そうでなければneverを返す型
type ArrayElement<T> = /* ここを実装 */;

// テストケース
type Test1 = ArrayElement<string[]>;    // string
type Test2 = ArrayElement<number[]>;    // number
type Test3 = ArrayElement<string>;      // never
type Test4 = ArrayElement<boolean[]>;   // boolean
```

### Section 2: infer キーワードの基本活用

> 📚 **関連資料**: [実践コード例 - infer キーワードの活用](./Step10_補足_実践コード例.md#inferキーワードの活用) | [専門用語集 - infer キーワード](./Step10_補足_専門用語集.md#infer-キーワードinfer-keyword)

#### 🎯 infer キーワードの基本概念

infer キーワードは、条件付き型の中で「型を推論して変数に格納する」機能です。Step05 で学習した型推論の概念をより高度に活用できます。

```typescript
// 基本的なinferの使用例
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

// 関数の戻り値型を取得
function getUserData(): { id: number; name: string } {
  return { id: 1, name: "Alice" };
}

type UserData = ReturnType<typeof getUserData>;
// { id: number; name: string }

// Step05のジェネリクス制約と組み合わせ
type ExtractArrayType<T> = T extends (infer U)[] ? U : never;

type StringArrayElement = ExtractArrayType<string[]>; // string
type NumberArrayElement = ExtractArrayType<number[]>; // number
```

#### 関数パラメータの型抽出

```typescript
// 関数のパラメータ型を取得
type Parameters<T> = T extends (...args: infer P) => any ? P : never;

function createUser(name: string, age: number, email: string): void {}

type CreateUserParams = Parameters<typeof createUser>;
// [string, number, string]

// 最初のパラメータのみ取得
type FirstParameter<T> = T extends (first: infer F, ...rest: any[]) => any
  ? F
  : never;

type FirstParam = FirstParameter<typeof createUser>; // string
```

### 練習問題 1.2: infer キーワード基礎 🔰

以下の要件を満たす型を作成してください：

```typescript
// 要件: Promise型から中身の型を取り出す型
type Awaited<T> = /* ここを実装 */;

// テストケース
type Test1 = Awaited<Promise<string>>;    // string
type Test2 = Awaited<Promise<number>>;    // number
type Test3 = Awaited<string>;             // never
type Test4 = Awaited<Promise<User>>;      // User
```

### Section 3: マップ型の高度なパターン

> 📚 **関連資料**: [専門用語集 - マップ型](./Step10_補足_専門用語集.md#マップ型mapped-types) | [実践コード例 - 高度なマップ型パターン](./Step10_補足_実践コード例.md#高度なマップ型パターン)

#### 🔧 Step06 の知識を発展させたマップ型

Step06 で学習した Partial、Required、Pick などのユーティリティ型の仕組みを理解し、より高度なマップ型を作成します。

```typescript
// Step06の復習：基本的なマップ型
type MyPartial<T> = {
  [P in keyof T]?: T[P];
};

type MyRequired<T> = {
  [P in keyof T]-?: T[P]; // -? で必須プロパティに変換
};

// 条件付きマップ型の応用
type NullableProperties<T> = {
  [P in keyof T]: T[P] | null;
};

interface User {
  id: number;
  name: string;
  email: string;
}

type NullableUser = NullableProperties<User>;
// { id: number | null; name: string | null; email: string | null; }
```

#### 型によるフィルタリング

```typescript
// 特定の型のプロパティのみを抽出
type PickByType<T, U> = {
  [P in keyof T as T[P] extends U ? P : never]: T[P];
};

// 特定の型のプロパティを除外
type OmitByType<T, U> = {
  [P in keyof T as T[P] extends U ? never : P]: T[P];
};

interface MixedInterface {
  id: number;
  name: string;
  active: boolean;
  tags: string[];
  count: number;
}

type StringProperties = PickByType<MixedInterface, string>;
// { name: string; }

type NonArrayProperties = OmitByType<MixedInterface, any[]>;
// { id: number; name: string; active: boolean; count: number; }
```

### 練習問題 1.3: マップ型応用 🔰

以下の要件を満たすマップ型を作成してください：

```typescript
// 要件: 全てのプロパティを関数型に変換する型
type Functionalize<T> = /* ここを実装 */;

interface UserData {
  id: number;
  name: string;
  active: boolean;
}

type UserFunctions = Functionalize<UserData>;
// { id: () => number; name: () => string; active: () => boolean; }
```

---

## 🎯 練習問題

> 📚 **サポート資料**: [実践コード例 - 高度な型機能の練習](./Step10_補足_実践コード例.md#高度な型機能の練習) | [トラブルシューティング](./Step10_補足_トラブルシューティング.md#条件型関連エラー)

### 練習問題 1: HTTP メソッド型システム（15 分）

Step07 で学習した API 設計の知識を活用して、型安全な HTTP リクエスト設定を作成してください。

```typescript
type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

// 要件: GETとDELETEにはbodyを禁止、POSTとPUTにはbodyを必須にする型
type RequestConfig<M extends HttpMethod> = /* ここを実装 */;

// 使用例
const getConfig: RequestConfig<"GET"> = {
  method: "GET",
  url: "/api/users",
  // body: {} // ❌ エラーになるべき
};

const postConfig: RequestConfig<"POST"> = {
  method: "POST",
  url: "/api/users",
  body: { name: "Alice" }, // ✅ 必須
};
```

### 練習問題 2: 型安全なイベントハンドラー（15 分）

Step05 のジェネリクス知識を活用して、型安全なイベントシステムを設計してください。

```typescript
type EventMap = {
  click: { x: number; y: number };
  keydown: { key: string; ctrlKey: boolean };
  custom: { data: string };
};

// 要件: イベント名に応じて適切なハンドラー型を生成する型
type EventHandler<K extends keyof EventMap> = /* ここを実装 */;

// 使用例
const clickHandler: EventHandler<"click"> = (event) => {
  console.log(event.x, event.y); // ✅ x, y プロパティが利用可能
};

const keyHandler: EventHandler<"keydown"> = (event) => {
  console.log(event.key, event.ctrlKey); // ✅ key, ctrlKey プロパティが利用可能
};
```

---

## 👨‍🏫 学習ポイント

### 🤔 よくある質問

**Q: 条件付き型とジェネリクスの制約（extends）の違いは何ですか？**
A: ジェネリクスの制約は「型パラメータが特定の型に代入可能であることを保証」し、条件付き型は「型パラメータが特定の型に代入可能かどうかで分岐」します。制約は入力を限定し、条件付き型は出力を分岐させます。

**Q: infer はいつ使うべきですか？**
A: 型の一部を「取り出したい」場合に使用します。関数の戻り値型、配列の要素型、オブジェクトのプロパティ型など、既存の型から特定の部分を抽出する際に活用します。

**Q: マップ型で as 句を使う理由は？**
A: as 句を使うことで、キー名を変換したり、条件に応じてキーを除外したりできます。従来のマップ型では値の変換のみでしたが、as 句によりキーの変換も可能になりました。

---

**📌 重要**: Session1 は高度な型機能の基礎固めです。Step05-07 で学習した内容を基盤として、焦らず確実に基本概念を理解しましょう。

**🌟 次回（Session2）は、より実践的な型レベルプログラミングとテンプレートリテラル型に挑戦します！**
