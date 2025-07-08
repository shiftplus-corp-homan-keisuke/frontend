# Step04 成果物：商品情報バリデーター

---

## 🎯 課題の目的

**あなたが作成するもの**: 型ガード・ユーザー定義型ガードを活用した商品情報バリデーター

**なぜ作るのか**: Step04で学習した型ガード技術を実際のECサイトの商品管理に適用し、**実用的な型安全システムを構築する力**を身につけるため

**学習目標**:

- 基本型ガード（typeof演算子、値の範囲チェック）を実装できる
- ユーザー定義型ガード（`value is Type`）を作成できる
- 型ガード技術を組み合わせた実用的なシステムを構築できる
- 型安全なデータ検証ができる

---

## 📋 必須提出物

以下の1つのファイルのみ提出してください：

```
📁 提出物/
└── product-validator.ts    # 商品情報バリデーター（必須）
```

---

## ⏰ 作成手順（推奨時間配分：合計30分）

### Phase 1: 基本設計（5分）

#### ステップ 1-1: 要件理解と型定義（5分）

以下の要件を満たす商品情報バリデーターを設計してください：

**📋 システムの概要**
このシステムは**ECサイトの商品情報**を型安全にチェックするシステムです。主な機能は以下の通りです：

- **商品名の検証**: 空でない文字列かどうかをチェック
- **価格の検証**: 正の数値かどうかをチェック
- **カテゴリの検証**: 指定されたカテゴリ値かどうかをチェック
- **商品オブジェクトの検証**: 全体の整合性をチェック
- **エラーハンドリング**: 分かりやすいエラーメッセージの提供

**🎯 実装する型定義**

```typescript
// 商品カテゴリの型
type ProductCategory = "electronics" | "clothing" | "books";

// 商品情報の型
interface Product {
  name: string;
  price: number;
  category: ProductCategory;
  inStock: boolean;
}

// バリデーション結果の型
interface ValidationResult {
  isValid: boolean;
  data?: Product;
  errors: string[];
}
```

### Phase 2: 型ガード実装（20分）

#### ステップ 2-1: 基本型ガードの実装（10分）

```typescript
// TODO: 以下の基本型ガードを実装してください

// 有効な商品名かどうかを判定（空でない文字列）
function isValidProductName(value: unknown): value is string {
  /* ここを実装 */
}

// 有効な価格かどうかを判定（正の数値）
function isValidPrice(value: unknown): value is number {
  /* ここを実装 */
}

// 有効なカテゴリかどうかを判定
function isValidCategory(value: unknown): value is ProductCategory {
  /* ここを実装 */
}
```

#### ステップ 2-2: ユーザー定義型ガードの実装（10分）

```typescript
// TODO: 以下のユーザー定義型ガードを実装してください

// Product型かどうかを判定
function isProduct(value: unknown): value is Product {
  /* ここを実装 */
}
```

### Phase 3: バリデーターシステム完成（5分）

#### ステップ 3-1: バリデーター関数の実装（5分）

```typescript
// TODO: 以下のバリデーター関数を実装してください

// 商品情報を検証する関数
function validateProduct(input: unknown): ValidationResult {
  /* ここを実装 */
}

// テスト実行関数
function runTests(): void {
  console.log("=== 商品情報バリデーターのテスト ===");

  // 有効な商品データ
  const validProduct = {
    name: "MacBook Pro",
    price: 199800,
    category: "electronics",
    inStock: true
  };

  const result1 = validateProduct(validProduct);
  console.log("有効な商品:", result1.isValid ? "✅ 成功" : "❌ 失敗");

  // 無効な商品データ（価格が負の値）
  const invalidProduct = {
    name: "無効商品",
    price: -100,
    category: "electronics",
    inStock: true
  };

  const result2 = validateProduct(invalidProduct);
  console.log("無効な商品:", result2.isValid ? "✅ 成功" : "❌ 失敗");
  if (!result2.isValid) {
    console.log("エラー:", result2.errors);
  }

  // 不完全なデータ
  const incompleteData = {
    name: "不完全商品",
    price: 1000
    // categoryとinStockが不足
  };

  const result3 = validateProduct(incompleteData);
  console.log("不完全なデータ:", result3.isValid ? "✅ 成功" : "❌ 失敗");
  if (!result3.isValid) {
    console.log("エラー:", result3.errors);
  }
}

runTests();
```

---

## ✅ 最低合格要件

以下の要件を**すべて満たす**ことで合格とします：

### 🔧 技術要件

- [ ] TypeScriptでコンパイルエラーが発生しない
- [ ] **基本型ガードを3つ実装している**（最重要！）
- [ ] **ユーザー定義型ガード（`value is Type`）を1つ実装している**（最重要！）
- [ ] すべての関数に適切な型注釈が付いている

### 🎯 機能要件

- [ ] 商品名の検証ができる（空文字列を拒否）
- [ ] 価格の検証ができる（負の値を拒否）
- [ ] カテゴリの検証ができる（指定外の値を拒否）
- [ ] 商品オブジェクト全体の検証ができる
- [ ] 無効なデータに対して適切なエラーメッセージを表示する

### 💭 型ガード要件

- [ ] 基本型ガードが正しく実装されている
- [ ] ユーザー定義型ガードが`value is Type`の形で正しく実装されている
- [ ] 型ガードを組み合わせた検証システムが構築されている

---

## 📊 評価基準

| 項目                     | 配点  | 評価ポイント                                   |
| ------------------------ | ----- | ---------------------------------------------- |
| **型ガード実装力**       | 60点  | 基本型ガード・ユーザー定義型ガードの正確な実装 |
| **システム統合力**       | 25点  | 複数の技術を組み合わせた実用的なシステム構築   |
| **エラーハンドリング**   | 15点  | 適切なエラーメッセージとエラー処理             |

**合格ライン**: 70点以上

---

## 💡 実装のヒント

### 🤔 型ガードを考える時の質問

1. **この値にはどんなパターンがある？**
   - 文字列 → 空文字列・有効な文字列
   - 数値 → 負の数・0・正の数
   - カテゴリ → 指定された値・指定外の値

2. **どのような条件で有効とするか？**
   - 商品名 → 文字列かつ空でない
   - 価格 → 数値かつ正の値
   - カテゴリ → 指定された3つの値のいずれか

### 📝 型ガード関数の基本例

```typescript
// 基本的な型ガード関数
function isString(value: unknown): value is string {
  return typeof value === "string";
}

function isNumber(value: unknown): value is number {
  return typeof value === "number";
}

// 特定の値の型ガード
function isValidStatus(value: unknown): value is "active" | "inactive" {
  return value === "active" || value === "inactive";
}

// オブジェクトの型ガード
function hasRequiredProperties(value: unknown): value is { name: unknown; price: unknown } {
  return (
    typeof value === "object" &&
    value !== null &&
    "name" in value &&
    "price" in value
  );
}
```

### ⚠️ よくある間違い

1. **型ガードの戻り値型注釈忘れ**

   ```typescript
   // ❌ 間違い：戻り値型注釈がない
   function isValidPrice(value: unknown) {
     return typeof value === "number" && value > 0;
   }

   // ✅ 正解：`value is Type`の形で指定
   function isValidPrice(value: unknown): value is number {
     return typeof value === "number" && value > 0;
   }
   ```

2. **型ガードの組み合わせ不備**

   ```typescript
   // ❌ 間違い：型ガードを組み合わせていない
   function isProduct(value: unknown): value is Product {
     return typeof value === "object" && value !== null;
   }

   // ✅ 正解：複数の型ガードを組み合わせて厳密にチェック
   function isProduct(value: unknown): value is Product {
     if (typeof value !== "object" || value === null) return false;
     
     const obj = value as any;
     return (
       isValidProductName(obj.name) &&
       isValidPrice(obj.price) &&
       isValidCategory(obj.category) &&
       typeof obj.inStock === "boolean"
     );
   }
   ```

---

## 📚 参考：完成例（答えを見たい場合）

<details>
<summary>⚠️ 注意：まず自分で考えてから見てください</summary>

```typescript
// 型定義
type ProductCategory = "electronics" | "clothing" | "books";

interface Product {
  name: string;
  price: number;
  category: ProductCategory;
  inStock: boolean;
}

interface ValidationResult {
  isValid: boolean;
  data?: Product;
  errors: string[];
}

// 基本型ガード
function isValidProductName(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isValidPrice(value: unknown): value is number {
  return typeof value === "number" && value > 0;
}

function isValidCategory(value: unknown): value is ProductCategory {
  return value === "electronics" || value === "clothing" || value === "books";
}

// ユーザー定義型ガード
function isProduct(value: unknown): value is Product {
  if (typeof value !== "object" || value === null) return false;
  
  const obj = value as any;
  
  return (
    isValidProductName(obj.name) &&
    isValidPrice(obj.price) &&
    isValidCategory(obj.category) &&
    typeof obj.inStock === "boolean"
  );
}

// バリデーター関数
function validateProduct(input: unknown): ValidationResult {
  const errors: string[] = [];
  
  if (typeof input !== "object" || input === null) {
    errors.push("商品データはオブジェクトである必要があります");
    return { isValid: false, errors };
  }
  
  const obj = input as any;
  
  // 各フィールドの個別チェック
  if (!isValidProductName(obj.name)) {
    errors.push("商品名は空でない文字列である必要があります");
  }
  
  if (!isValidPrice(obj.price)) {
    errors.push("価格は正の数値である必要があります");
  }
  
  if (!isValidCategory(obj.category)) {
    errors.push("カテゴリは 'electronics', 'clothing', 'books' のいずれかである必要があります");
  }
  
  if (typeof obj.inStock !== "boolean") {
    errors.push("在庫状況はboolean値である必要があります");
  }
  
  // エラーがなければ成功（個別チェックで十分なため、isProductの重複チェック不要）
  return errors.length === 0
    ? { isValid: true, data: input as Product, errors: [] }
    : { isValid: false, errors };
}

// テスト実行
function runTests(): void {
  console.log("=== 商品情報バリデーターのテスト ===");

  // 有効な商品データ
  const validProduct = {
    name: "MacBook Pro",
    price: 199800,
    category: "electronics",
    inStock: true
  };

  const result1 = validateProduct(validProduct);
  console.log("有効な商品:", result1.isValid ? "✅ 成功" : "❌ 失敗");

  // 無効な商品データ（価格が負の値）
  const invalidProduct = {
    name: "無効商品",
    price: -100,
    category: "electronics",
    inStock: true
  };

  const result2 = validateProduct(invalidProduct);
  console.log("無効な商品:", result2.isValid ? "✅ 成功" : "❌ 失敗");
  if (!result2.isValid) {
    console.log("エラー:", result2.errors);
  }

  // 不完全なデータ
  const incompleteData = {
    name: "不完全商品",
    price: 1000
    // categoryとinStockが不足
  };

  const result3 = validateProduct(incompleteData);
  console.log("不完全なデータ:", result3.isValid ? "✅ 成功" : "❌ 失敗");
  if (!result3.isValid) {
    console.log("エラー:", result3.errors);
  }
}

runTests();
```

</details>

---

## 🚀 発展課題（任意）

基本課題が完了した方は、以下の発展課題にも挑戦してみてください：

1. **商品情報の拡張**
   - 商品説明（description）フィールドの追加
   - 割引率（discountRate）の検証

2. **より詳細なバリデーション**
   - 商品名の最大文字数制限
   - 価格の上限設定

3. **複数商品の処理**
   - 商品配列のバリデーション
   - 在庫切れ商品のフィルタリング

---

**🎉 お疲れ様でした！** Step04を通じて型ガード技術の実践的な活用方法を身につけることができました。

**🚀 次のStep05では、より高度なTypeScript機能を学習し、さらに堅牢な型システムを構築します！**