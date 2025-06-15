# Session1: 型システム理論と基本実践（90 分）

> 💡 **対象**: 他言語経験者（静的型付け言語の経験推奨）
> 🎯 **形式**: 講師サポート付き学習
> ⏰ **時間**: 90 分（休憩含む）

## 📚 関連補足資料

このセッションの学習をサポートする補足資料をご用意しています：

- 📖 **[専門用語集](./Step02_補足_専門用語集.md)** - 型システムの重要な概念と用語の詳細解説
- 💻 **[実践コード例](./Step02_補足_実践コード例.md)** - 段階的な学習のためのコード例集
- 🚨 **[トラブルシューティング](./Step02_補足_トラブルシューティング.md)** - よくあるエラーと解決方法
- 🌐 **[参考リソース](./Step02_補足_参考リソース.md)** - 学習に役立つリンク集とリソース
- 📋 **[補足資料](./Step02_補足資料.md)** - その他の重要な補足情報

> 💡 **活用方法**: 学習中に疑問が生じた際や、より深く理解したい場合に参照してね 🐰

## 📅 セッション概要

**学習目標**:

- [ ] TypeScript の基本型システムの完全理解
- [ ] 型推論の仕組みと活用方法の習得
- [ ] プリミティブ型の実践的活用

**前提知識**:

- JavaScript 基本構文の理解
- 他言語での型システム経験（php、javascript 等）
- Step01 の完了

---

## ⏰ 詳細タイムテーブル

| 時間         | 内容                       | 講師の役割               | 学習者の活動     | 成果物     |
| ------------ | -------------------------- | ------------------------ | ---------------- | ---------- |
| **0-10 分**  | 前 Step 復習・今回目標設定 | 復習確認・目標提示       | 振り返り・質問   | 理解確認   |
| **10-50 分** | 型システム理論学習         | 実演・解説・個別サポート | 理解・メモ・質問 | 理論理解   |
| **50-80 分** | 基本実践・練習問題         | 巡回サポート・ヒント     | ハンズオン・実践 | 基本コード |
| **80-90 分** | 振り返り・次回予告         | まとめ・予告             | 質問・確認       | 学習計画   |

---

## 📚 学習内容

### Section 1: TypeScript 型システムの基礎理解

> 📚 **関連資料**: [専門用語集 - 型システム関連用語](./Step02_補足_専門用語集.md#型システム関連用語) | [実践コード例 - 基本から始める段階的学習](./Step02_補足_実践コード例.md#基本から始める段階的学習)

#### 🔍 プリミティブ型の完全理解

**💡 なぜ型システムが重要なのか**

TypeScript の型システムは、JavaScript の動的な性質に静的型チェックを追加し、開発時にエラーを検出できます。

**🎯 TypeScript 特有の特徴**

- **構造的型付け**: 名前ではなく構造で型を判定
- **型推論**: 明示的な型注釈なしでも型を推論
- **Union 型**: 複数の型を組み合わせ可能
- **リテラル型**: 具体的な値そのものを型として使用

##### 1. string 型 - 文字列の型安全な管理

```typescript
// 基本的なstring型
let userName: string = "Alice";
let welcomeMessage: string = `Welcome, ${userName}!`;

// 文字列リテラル型（より厳密な型制御）
type Status = "pending" | "approved" | "rejected";
let orderStatus: Status = "pending";
```

##### 2. number 型 - 数値の型安全な処理

```typescript
// 基本的なnumber型
let age: number = 25;
let price: number = 99.99;
let discount: number = 0.15; // 15%割引

// 数値リテラル型
type DiceValue = 1 | 2 | 3 | 4 | 5 | 6;
let diceRoll: DiceValue = 3;
```

##### 3. boolean 型 - 論理値の明確な管理

```typescript
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

##### 4. null と undefined - 値の不在の適切な管理

```typescript
// null と undefined の使い分け
let explicitlyEmpty: null = null; // 意図的に空の値
let notYetInitialized: undefined = undefined; // まだ初期化されていない

// Union型での活用
let userName: string | null = null; 
let userAge: number | undefined = undefined;

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

### Section 2: 型推論の理解と活用

> 📚 **関連資料**: [専門用語集 - 型推論関連用語](./Step02_補足_専門用語集.md#型推論関連用語) | [実践コード例 - 型推論の活用例](./Step02_補足_実践コード例.md#型推論の活用例)

#### 🎯 型推論の基本メカニズム

**💡 なぜ型推論が重要なのか**

型推論により、冗長な型注釈を書かずに型安全性を確保できます。他言語（Java、C#等）と比較して、TypeScript の型推論は非常に強力です。

##### 1. 基本的な型推論

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
```

##### 2. オブジェクトと配列の型推論

```typescript
// オブジェクトの型推論
const config = {
  apiUrl: "https://api.example.com",
  timeout: 5000,
  retryCount: 3,
}; // { apiUrl: string; timeout: number; retryCount: number; }型として推論

// 配列の推論
const numbers = [1, 2, 3, 4, 5]; // number[]型として推論
const names = ["Alice", "Bob", "Charlie"] as const; // readonly ["Alice", "Bob", "Charlie"]型

// 混合配列での最適共通型
let mixedArray = [1, "hello", true]; // (string | number | boolean)[]
```

##### 3. 関数の戻り値推論

```typescript
// 関数の戻り値推論
function add(a: number, b: number) {
  return a + b; // number型として推論
}

function greet(name: string) {
  return `Hello, ${name}!`; // string型として推論
}

// 条件分岐での型推論
function getValue(condition: boolean) {
  return condition ? "success" : 404; // string | number として推論
}
```

---

## 🎯 実践演習

> 📚 **演習サポート資料**: [実践コード例 - 基本型の練習](./Step02_補足_実践コード例.md#基本型の練習) | [トラブルシューティング - 型システム関連エラー](./Step02_補足_トラブルシューティング.md#型システム関連エラー)

### 演習 1: 型推論の活用（10 分）

以下のコードで型推論がどのように働くかを確認し、コメントを追加してください：

```typescript
// 型推論の確認
const userConfig = {
  theme: "dark",
  fontSize: 14,
  autoSave: true,
}; // 型: ?

const statusList = ["pending", "approved", "rejected"] as const; // 型: ?

function processStatus(status: (typeof statusList)[number]) {
  // statusの型: ?
  return `Processing: ${status}`;
}

let result = processStatus("pending"); // resultの型: ?
```

---

## 📝 学習ポイント

### ✅ 今回のセッションで習得すべきこと

1. **プリミティブ型の理解**: string, number, boolean, null, undefined の適切な使い分け
2. **リテラル型の活用**: より厳密な型制御の方法
3. **型推論の仕組み**: let vs const、オブジェクト・配列での推論

---

**📌 重要**: Session1 は型システムの基礎固めです。焦らず確実に基本概念を理解しましょう。

**🌟 次回（Session2）は、より実践的な型システムコードの作成に挑戦します！**
