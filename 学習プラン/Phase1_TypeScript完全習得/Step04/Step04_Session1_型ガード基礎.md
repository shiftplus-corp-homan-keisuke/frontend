# Session1: 型ガード基礎（40 分）

> 💡 **対象**: 他言語経験者（TypeScript 基本型・インターフェース・ユニオン型知識あり）
> 🎯 **形式**: 講師サポート付き学習
> ⏰ **時間**: 40 分（休憩含む）

## 📚 関連補足資料

このセッションの学習をサポートする補足資料をご用意しています：

- 📖 **[専門用語集](./Step04_補足_専門用語集.md)** - 型ガード関連の重要な概念と用語の詳細解説
- 💻 **[実践コード例](./Step04_補足_実践コード例.md)** - 段階的な学習のためのコード例集
- 🔧 **[開発環境ガイド](./Step04_補足_開発環境ガイド.md)** - 効率的な開発環境の活用
- 🌐 **[参考リソース](./Step04_補足_参考リソース.md)** - 学習に役立つリンク集とリソース
- 🚨 **[トラブルシューティング](./Step04_補足_トラブルシューティング.md)** - よくあるエラーと解決方法

> 💡 **活用方法**: 学習中に疑問が生じた際や、より深く理解したい場合に参照してね 🐰

## 📅 セッション概要

**学習目標**:

- [ ] 基本型ガード（typeof, instanceof, in 演算子）の理解と実装
- [ ] フォーム入力値の基本検証パターンの習得
- [ ] 型ガードによる型安全性の確保
- [ ] 実践的な型ガードの活用方法の理解

**前提知識**:

- Step01: JavaScript 基礎、TypeScript 基本型注釈
- Step02: 基本型システム、型推論、型エイリアス
- Step03: インターフェース、オプショナルプロパティ、継承
- ユニオン型の基本概念（前提知識として）

---

## ⏰ 詳細タイムテーブル

| 時間         | 内容                     | 学習活動         | 成果物     |
| ------------ | ------------------------ | ---------------- | ---------- |
| **0-3 分**   | 前提知識確認・今回目標   | 振り返り・質問   | 理解確認   |
| **3-15 分**  | 基本型ガード理論         | 理解・メモ       | 基本知識   |
| **15-32 分** | 段階的な実例とコード演習 | ハンズオン・実践 | 実践コード |
| **32-40 分** | 基本練習問題             | 個人演習・確認   | 演習成果   |

---

## 📚 学習内容

### Section 1: 前提知識確認（要点のみ）

#### 🔍 ユニオン型の簡単な復習

**基本的なユニオン型**

```typescript
// Step02-03で学習した基本概念
type StringOrNumber = string | number;
type UserStatus = "active" | "inactive" | "pending";

interface User {
  id: number;
  name: string;
  status: UserStatus;
}

// ユニオン型の課題：共通プロパティのみアクセス可能
function processValue(value: StringOrNumber): string {
  // return value.toUpperCase(); // Error: numberにはtoUpperCase()がない
  return value.toString(); // OK: 両方の型に存在
}
```

**💡 今日学ぶ型ガードとの関係**

型ガードは、ユニオン型の値を安全に扱うための仕組みです。TypeScript コンパイラがコンパイル時に認識できる特定のパターン（typeof、instanceof、in など）を使用し、実行時には JavaScript コードとして値の性質をチェックします。コンパイラは事前にこれらのパターンを理解しており、条件分岐内で型を自動的に絞り込みます。

---

### Section 2: 基本型ガードの理論と実装

> 📚 **関連資料**: [専門用語集 - 型ガード](./Step04_補足_専門用語集.md#型ガード) | [実践コード例 - 基本型ガード](./Step04_補足_実践コード例.md#基本型ガード)

#### 🎯 型ガードとは何か

**💡 なぜ型ガードが重要なのか**

型ガードは、TypeScript コンパイラがコンパイル時に認識できる特定のパターンを使って、値の型を絞り込む仕組みです。コンパイラは`typeof`、`instanceof`、`in`演算子などの型ガードパターンを静的解析で認識し、その条件分岐内では型を自動的に絞り込みます。実行時には純粋な JavaScript コードとして動作し、実際に値の性質をチェックします。これにより、以下のメリットがあります：

- **型安全性の向上**: 実行時エラーの予防
- **コードの可読性**: 型が明確になることで理解しやすい
- **開発効率**: IDE の補完機能が正確に動作
- **保守性**: 型変更時の影響範囲が明確

#### 1. typeof 型ガード

```typescript
// 基本的なtypeof型ガード
function processStringOrNumber(value: string | number): string {
  if (typeof value === "string") {
    // この分岐内ではvalueはstring型
    return `文字列: ${value.toUpperCase()}`;
  } else {
    // この分岐内ではvalueはnumber型
    return `数値: ${value.toFixed(2)}`;
  }
}

// 使用例
console.log(processStringOrNumber("hello")); // "文字列: HELLO"
console.log(processStringOrNumber(42.567)); // "数値: 42.57"
```

#### 2. instanceof 型ガード

```typescript
// エラーオブジェクトの型ガード
function handleError(error: unknown): string {
  if (error instanceof Error) {
    // この分岐内ではerrorはError型
    return `エラー: ${error.message}`;
  } else {
    return "不明なエラー";
  }
}
```

#### 3. in 演算子型ガード

```typescript
interface User {
  id: number;
  name: string;
}

interface AdminUser extends User {
  permissions: string[];
}

function checkUserType(user: User | AdminUser): string {
  if ("permissions" in user) {
    // この分岐内ではuserはAdminUser型
    return `管理者: ${user.name}`;
  } else {
    // この分岐内ではuserはUser型
    return `一般ユーザー: ${user.name}`;
  }
}
```

---

### Section 3: 実践演習

> 📚 **サポート資料**: [実践コード例 - 型ガードの練習](./Step04_補足_実践コード例.md#型ガードの練習)

#### 🔧 基本型ガードの実装

```typescript
// 基本型ガードを使った安全な処理
function processValue(input: unknown): string {
  if (typeof input === "string") {
    return `文字列: ${input.toUpperCase()}`;
  } else if (typeof input === "number") {
    return `数値: ${input.toFixed(2)}`;
  } else {
    return "未対応の型です";
  }
}
```

---

---

## 🔧 練習問題

> 📚 **サポート資料**: [実践コード例 - 型ガードの練習](./Step04_補足_実践コード例.md#型ガードの練習) | [トラブルシューティング](./Step04_補足_トラブルシューティング.md#よくあるエラー)

### 練習問題 1.1: 基本型ガード（8分） 🔰

```typescript
// 要件: 以下の関数を基本型ガードを使って実装してください
function processInput(input: unknown): string {
  // typeof, instanceof, in演算子を使って型を判定し、適切な処理を行う
  /* ここを実装 */
}

// テストケース
console.log(processInput(42));     // "数値: 42"
console.log(processInput("hello")); // "文字列: HELLO"
console.log(processInput(true));   // "その他の型"
```

---

## 📝 解答例

### 練習問題 1.1 解答

```typescript
function isPositiveNumber(value: unknown): value is number {
  return typeof value === "number" && value > 0;
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}
```

### 練習問題 1.2 解答

```typescript
function isUser(value: unknown): value is User {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    "name" in value &&
    "email" in value &&
    typeof (value as any).id === "number" &&
    typeof (value as any).name === "string" &&
    typeof (value as any).email === "string"
  );
}
```

---

## 👨‍🏫 学習ポイント

### 🤔 よくある質問

**Q: 型ガードはいつ使うべきですか？**
A: 主に以下の場面で使用します：

- `unknown`型や`any`型の値を安全に扱いたい時
- ユニオン型の値を特定の型に絞り込みたい時
- 外部からのデータ（API、ユーザー入力）を検証したい時
- DOM 操作で要素の型を確認したい時

**Q: typeof、instanceof、in の使い分けが分かりません。**
A: 以下のように使い分けます：

- `typeof`: プリミティブ型（string, number, boolean 等）の判定
- `instanceof`: クラスのインスタンスや DOM 要素の判定
- `in`: オブジェクトのプロパティ存在チェック

---

## 🎯 Session1 の成果確認

### 理解度チェック

- [ ] typeof 型ガードを使ってプリミティブ型を判定できる
- [ ] instanceof 型ガードを使ってオブジェクトの型を判定できる
- [ ] in 演算子を使ってプロパティの存在をチェックできる
- [ ] フォーム入力値の基本的な検証ができる
- [ ] 型ガードを組み合わせて複雑な検証ができる

---

**📌 重要**: Session1 では型ガードの基礎をしっかりと理解することが重要です。次の Session2 では、これらの知識を基にユーザー定義型ガードを学習します。

**🌟 次回（Session2）は、より柔軟で再利用可能なユーザー定義型ガードの実装に挑戦します！**
