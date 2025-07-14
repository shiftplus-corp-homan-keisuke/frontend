# Step04 成果物：商品情報バリデーター

---

## 🎯 課題の目的

**あなたが作成するもの**: 型ガード・ユーザー定義型ガードを活用した商品情報バリデーター

**なぜ作るのか**: Step04 で学習した型ガード技術を実際の EC サイトの商品管理に適用し、**実用的な型安全システムを構築する力**を身につけるため

**学習目標**:

- 基本型ガード（typeof 演算子、値の範囲チェック）を実装できる
- ユーザー定義型ガード（`value is Type`）を作成できる
- 型ガード技術を組み合わせた実用的なシステムを構築できる
- 型安全なデータ検証ができる

---

## ⏰ 作成手順（推奨時間配分：合計 30 分）

### Phase 1: 基本設計（5 分）

#### ステップ 1-1: 要件理解と型定義（5 分）

以下の要件を満たす商品情報バリデーターを設計してください：

**📋 システムの概要**
このシステムは**EC サイトの商品情報**を型安全にチェックするシステムです。主な機能は以下の通りです：

- **商品名の検証**: 空でない文字列かどうかをチェック
- **価格の検証**: 正の数値かどうかをチェック
- **カテゴリの検証**: 指定されたカテゴリ値かどうかをチェック
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

### Phase 2: 型ガード実装（20 分）

#### ステップ 2-1: 基本型ガードの実装（10 分）

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

#### ステップ 2-2: ユーザー定義型ガードの実装（10 分）

```typescript
// TODO: 以下のユーザー定義型ガードを実装してください

// Product型かどうかを判定
// ヒント: 既に作成した基本型ガード関数を組み合わせて使用してください
// 1. まず value が object かつ null でないことを確認
// 2. 各プロパティ（name, price, category, inStock）が存在し、適切な型であることを確認
// 3. isValidProductName, isValidPrice, isValidCategory を活用しましょう
function isProduct(value: unknown): value is Product {
  /* ここを実装 */
}

// 使用例（実装後にテストしてみてください）:
// const testData = { name: "テスト商品", price: 1000, category: "electronics", inStock: true };
// console.log(isProduct(testData)); // true が期待される
// console.log(isProduct("invalid")); // false が期待される
```

### Phase 3: バリデーターシステム完成（5 分）

#### ステップ 3-1: バリデーター関数の実装（5 分）

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
    inStock: true,
  };

  const result1 = validateProduct(validProduct);
  console.log("有効な商品:", result1.isValid ? "✅ 成功" : "❌ 失敗");

  // 無効な商品データ（価格が負の値）
  const invalidProduct = {
    name: "無効商品",
    price: -100,
    category: "electronics",
    inStock: true,
  };

  const result2 = validateProduct(invalidProduct);
  console.log("無効な商品:", result2.isValid ? "✅ 成功" : "❌ 失敗");
  if (!result2.isValid) {
    console.log("エラー:", result2.errors);
  }

  // 不完全なデータ
  const incompleteData = {
    name: "不完全商品",
    price: 1000,
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
    errors.push(
      "カテゴリは 'electronics', 'clothing', 'books' のいずれかである必要があります"
    );
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
    inStock: true,
  };

  const result1 = validateProduct(validProduct);
  console.log("有効な商品:", result1.isValid ? "✅ 成功" : "❌ 失敗");

  // 無効な商品データ（価格が負の値）
  const invalidProduct = {
    name: "無効商品",
    price: -100,
    category: "electronics",
    inStock: true,
  };

  const result2 = validateProduct(invalidProduct);
  console.log("無効な商品:", result2.isValid ? "✅ 成功" : "❌ 失敗");
  if (!result2.isValid) {
    console.log("エラー:", result2.errors);
  }

  // 不完全なデータ
  const incompleteData = {
    name: "不完全商品",
    price: 1000,
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

**🎉 お疲れ様でした！** Step04 を通じて型ガード技術の実践的な活用方法を身につけることができました。

**🚀 次の Step05 では、より高度な TypeScript 機能を学習し、さらに堅牢な型システムを構築します！**
