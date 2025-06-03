# Session3: プロジェクト完成（60分）

> 💡 **対象**: 他言語経験者（Session1・2完了者）  
> 🎯 **形式**: 講師サポート付き学習  
> ⏰ **時間**: 60分（休憩含む）

## 📅 セッション概要

**学習目標**:
- [ ] 型安全なデータ構造の設計
- [ ] 商品管理システムの型定義完成
- [ ] 型システムの総合活用
- [ ] 実践的な型設計パターンの習得

**前提知識**:
- Session1・2の完了（基本型・複合型の理解）
- TypeScript基本構文の理解

**重要**: このセッションでは**型の学習に特化**し、ロジックの実装は行いません。型定義とインターフェース設計に集中します。

---

## ⏰ 詳細タイムテーブル

| 時間 | 内容 | 講師の役割 | 学習者の活動 | 成果物 |
|------|------|------------|--------------|--------|
| **0-10分** | 最終課題説明 | 課題説明・期待値設定 | 理解・質問 | 要件理解 |
| **10-45分** | プロジェクト完成 | 個別サポート・デバッグ支援 | 開発・完成 | 型定義完成 |
| **45-60分** | 成果発表・次Step準備 | 評価・フィードバック | 発表・振り返り | 学習成果 |

---

## 🎯 最終課題：商品管理システムの型設計

### 📋 プロジェクト概要

**目標**: 型安全な商品管理システムの型定義を完成させる  
**重点**: ロジック実装ではなく、型定義とインターフェース設計に集中  
**成果物**: 完全な型定義ファイル（`.d.ts`形式でも可）

### Phase 1: 基本型定義の設計（15分）

#### 🔧 商品データの型定義

```typescript
// TODO: 以下の型定義を完成させてください

// 1. 商品カテゴリの型定義
type ProductCategory = // "Electronics" | "Books" | "Clothing" | "Home" | "Sports"

// 2. 商品ステータスの型定義
type ProductStatus = // "active" | "inactive" | "discontinued"

// 3. 商品の基本情報型
interface Product {
  // 商品ID（読み取り専用、数値）
  // 商品名（文字列）
  // 価格（数値）
  // カテゴリ（ProductCategory型）
  // ステータス（ProductStatus型）
  // 在庫数（数値）
  // 商品説明（オプショナル、文字列）
  // 作成日時（Date型）
  // 更新日時（Date型）
}

// 4. 商品作成時の入力データ型
interface CreateProductInput {
  // 商品名（必須）
  // 価格（必須）
  // カテゴリ（必須）
  // 在庫数（必須）
  // 商品説明（オプショナル）
  // ステータスはデフォルトで"active"なので入力不要
}

// 5. 商品更新時の入力データ型
interface UpdateProductInput {
  // 商品名（オプショナル）
  name?: string;
  // 価格（オプショナル）
  price?: number;
  // カテゴリ（オプショナル）
  category?: ProductCategory;
  // 在庫数（オプショナル）
  stock?: number;
  // 商品説明（オプショナル）
  description?: string;
  // ステータス（オプショナル）
  status?: ProductStatus;
  // idと作成日時・更新日時は更新対象外
}
```

#### 🎯 検索・フィルタ関連の型定義

```typescript
// TODO: 以下の型定義を完成させてください

// 1. 価格範囲の型定義
interface PriceRange {
  // 最小価格（オプショナル、数値）
  // 最大価格（オプショナル、数値）
}

// 2. 検索条件の型定義
interface SearchCriteria {
  // 商品名検索（オプショナル、文字列）
  // カテゴリフィルタ（オプショナル、ProductCategory型）
  // ステータスフィルタ（オプショナル、ProductStatus型）
  // 価格範囲（オプショナル、PriceRange型）
  // 在庫状況フィルタ（オプショナル、真偽値）
}

// 3. ソート条件の型定義
type SortField = // "name" | "price" | "createdAt" | "stock"
type SortOrder = // "asc" | "desc"

interface SortCriteria {
  // ソートフィールド（SortField型）
  // ソート順序（SortOrder型）
}
```

### Phase 2: 統計・分析用の型定義（15分）

#### 📊 統計データの型定義

```typescript
// TODO: 以下の型定義を完成させてください

// 1. カテゴリ別統計の型定義
interface CategoryStatistics {
  // カテゴリ名（ProductCategory型）
  // 商品総数（数値）
  // 平均価格（数値）
  // 総在庫数（数値）
  // アクティブ商品数（数値）
  // 総価値（価格×在庫数の合計、数値）
}

// 2. 在庫統計の型定義
interface InventoryStatistics {
  // 総商品数（数値）
  // アクティブ商品数（数値）
  // 非アクティブ商品数（数値）
  // 廃止商品数（数値）
  // 総在庫数（数値）
  // 在庫切れ商品数（数値）
  // 総在庫価値（数値）
  // 平均価格（数値）
}

// 3. 価格帯分析の型定義
interface PriceRangeAnalysis {
  // 価格帯（文字列、例："0-1000"）
  // 商品数（数値）
  // 割合（数値、パーセンテージ）
}

// 4. 売上予測データの型定義（将来の拡張を想定）
interface SalesForecast {
  // 商品ID（数値）
  // 予測期間（文字列、例："2024-Q1"）
  // 予測売上数量（数値）
  // 予測売上金額（数値）
  // 信頼度（数値、0-1の範囲）
}
```

### Phase 3: API・サービス層の型定義（15分）

#### 🔌 API レスポンスの型定義

```typescript
// TODO: 以下の型定義を完成させてください

// 1. 商品API レスポンスの型定義
interface ProductApiResponse {
  // 成功フラグ（真偽値）
  // データ（Product型、成功時のみ）
  // エラーメッセージ（文字列、失敗時のみ）
  // ステータスコード（数値）
  // タイムスタンプ（Date型）
}

// 2. 商品一覧API レスポンスの型定義
interface ProductListApiResponse {
  // 成功フラグ（真偽値）
  // データ（Product型の配列、成功時のみ）
  // エラーメッセージ（文字列、失敗時のみ）
  // ステータスコード（数値）
  // タイムスタンプ（Date型）
}

// 3. 統計API レスポンスの型定義
interface StatisticsApiResponse {
  // 成功フラグ（真偽値）
  // データ（InventoryStatistics型、成功時のみ）
  // エラーメッセージ（文字列、失敗時のみ）
  // ステータスコード（数値）
  // タイムスタンプ（Date型）
}

// 4. カテゴリ別統計API レスポンスの型定義
interface CategoryStatisticsApiResponse {
  // 成功フラグ（真偽値）
  // データ（CategoryStatistics型の配列、成功時のみ）
  // エラーメッセージ（文字列、失敗時のみ）
  // ステータスコード（数値）
  // タイムスタンプ（Date型）
}

// 5. ページネーション情報の型定義
interface PaginationInfo {
  // 現在のページ（数値）
  // 1ページあたりの件数（数値）
  // 総件数（数値）
  // 総ページ数（数値）
  // 前のページがあるか（真偽値）
  // 次のページがあるか（真偽値）
}

// 6. ページネーション付き商品一覧レスポンスの型定義
interface PaginatedProductResponse {
  // データ配列（Product型の配列）
  // ページネーション情報（PaginationInfo型）
}

// 7. 商品管理サービスのインターフェース
interface ProductService {
  // 商品作成（CreateProductInput → Promise<ProductApiResponse>）
  // 商品取得（id: number → Promise<ProductApiResponse>）
  // 商品一覧取得（criteria?: SearchCriteria, sort?: SortCriteria → Promise<ProductListApiResponse>）
  // 商品更新（id: number, input: UpdateProductInput → Promise<ProductApiResponse>）
  // 商品削除（id: number → Promise<{ success: boolean; error?: string }>）
  // 統計取得（→ Promise<StatisticsApiResponse>）
  // カテゴリ別統計取得（→ Promise<CategoryStatisticsApiResponse>）
}
```

#### 🎯 バリデーション関連の型定義

```typescript
// TODO: 以下の型定義を完成させてください

// 1. バリデーションエラーの型定義
interface ValidationError {
  // フィールド名（文字列）
  // エラーメッセージ（文字列）
  // エラーコード（文字列）
}

// 2. バリデーション結果の型定義
interface ValidationResult {
  // 有効かどうか（真偽値）
  // エラー一覧（ValidationError型の配列）
}

// 3. 商品名バリデータ関数の型定義
type NameValidator = // (name: string) => ValidationResult

// 4. 価格バリデータ関数の型定義
type PriceValidator = // (price: number) => ValidationResult

// 5. 在庫数バリデータ関数の型定義
type StockValidator = // (stock: number) => ValidationResult

// 6. カテゴリバリデータ関数の型定義
type CategoryValidator = // (category: ProductCategory) => ValidationResult

// 7. 商品バリデーションルールの型定義
interface ProductValidationRules {
  // 商品名バリデータ（NameValidator型）
  // 価格バリデータ（PriceValidator型）
  // 在庫数バリデータ（StockValidator型）
  // カテゴリバリデータ（CategoryValidator型）
}
```

---

## 🎯 実装チャレンジ

### チャレンジ 1: 基本型定義の完成（10分）

以下の型定義を完成させてください：

```typescript
// TODO: 以下の型定義を完成させてください

// 1. 商品IDの型定義
interface ProductId {
  // 商品ID（数値、読み取り専用）
}

// 2. 商品の表示用データ型
interface ProductDisplayData {
  // 商品ID（数値）
  // 商品名（文字列）
  // 価格（数値）
  // カテゴリ（ProductCategory型）
  // ステータス（ProductStatus型）
  // 在庫数（数値）
  // 商品説明（オプショナル、文字列）
  // 作成日時・更新日時は表示用では不要
}

// 3. 商品操作の結果型（Union型を活用）
type ProductOperationResult =
  | { success: true; data: Product }
  | { success: false; error: string }

// 4. カテゴリごとの商品配列型
interface ProductsByCategory {
  // Electronics（Product型の配列）
  // Books（Product型の配列）
  // Clothing（Product型の配列）
  // Home（Product型の配列）
  // Sports（Product型の配列）
}

// 5. 商品検索結果の型定義
interface ProductSearchResult {
  // 検索結果（Product型の配列）
  // 総件数（数値）
  // 検索条件（SearchCriteria型）
  // 実行時間（数値、ミリ秒）
}
```

### チャレンジ 2: 関数型定義（5分）

```typescript
// TODO: 以下の関数型定義を完成させてください

// 1. 商品作成関数の型
type CreateProductFunction = // (input: CreateProductInput) => Promise<ProductOperationResult>

// 2. 商品検索関数の型
type SearchProductFunction = // (criteria: SearchCriteria) => Promise<ProductSearchResult>

// 3. 商品バリデーション関数の型
type ValidateProductFunction = // (product: CreateProductInput) => ValidationResult

// 4. 価格計算関数の型
type CalculatePriceFunction = // (basePrice: number, discount?: number) => number

// 5. 在庫チェック関数の型
type CheckStockFunction = // (productId: number, requestedQuantity: number) => boolean
```

---

## 📝 学習ポイント

### ✅ 今回のセッションで習得すべきこと

1. **実践的な型設計**: 実際のアプリケーションで使用される型定義パターン
2. **型の組み合わせ**: Partial、Readonly、Pick、Omit等のユーティリティ型の活用
3. **インターフェース設計**: サービス層やAPI層の型安全な設計
4. **型の再利用性**: DRYの原則に従った型定義の設計

---

## 🎯 Session3 完了チェックリスト

### 型定義完了項目

- [ ] 基本型定義の設計（商品・カテゴリ・ステータス）
- [ ] 検索・フィルタ関連の型定義
- [ ] 統計・分析用の型定義
- [ ] API・サービス層の型定義
- [ ] バリデーション関連の型定義

### 学習成果

- [ ] TypeScript型システムの深い理解
- [ ] 実用的な型設計パターンの習得
- [ ] インターフェース設計能力の向上
- [ ] 型の再利用性を考慮した設計

### 今後の学習計画

- [ ] Step03 の学習準備（インターフェースとオブジェクト型）
- [ ] 型設計の実践練習計画
- [ ] 継続学習のスケジュール設定

---

## 📊 Step02 総合評価

### 最終評価基準

#### 型設計能力（60%）

- [ ] **基本型定義**: Union型、リテラル型、インターフェースの適切な使用
- [ ] **複合型設計**: 型の組み合わせとユーティリティ型の活用
- [ ] **型の再利用性**: DRYの原則に従った型定義の設計
- [ ] **型安全性**: 実行時エラーを防ぐ型設計の実装

#### 設計品質（25%）

- [ ] **インターフェース設計**: サービス層・API層の適切な型定義
- [ ] **型の一貫性**: プロジェクト全体での型定義の統一性
- [ ] **拡張性**: 将来の機能追加を考慮した設計
- [ ] **可読性**: 理解しやすい型定義とネーミング

#### 学習姿勢（15%）

- [ ] **積極性**: 質問・議論への参加
- [ ] **問題解決**: 型エラーの自力解決・調査
- [ ] **協調性**: 他の学習者との協力
- [ ] **振り返り**: 学習内容の整理・次ステップの計画

---

## 成果物

- [ ] **図書管理システム**: Step02の学習内容を段階的に活用した4段階の図書管理システム → [Step02成果物: 図書管理システム](./Step02_成果物.md)

---

**🎉 お疲れ様でした！** Step02 を通じて TypeScript の型システムを深く理解し、実践的な型設計能力を身につけることができました。

**🚀 次の Step03 では、インターフェースとオブジェクト型を学習し、より高度な型設計手法を習得します！**