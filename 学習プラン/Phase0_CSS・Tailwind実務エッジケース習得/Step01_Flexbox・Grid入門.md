# Step01: Tailwind CSS Flexbox・Grid 入門

> 💡 **補足資料**: より詳細な解説と実践例は以下を参照 🚀
>
> - 📖 [Tailwind Flexbox 基礎ガイド](./Step01_補足_Tailwind_Flexbox基礎.md) - Tailwind での flexbox の基本から実践的な活用法
> - 🛠️ [Tailwind Grid 基礎ガイド](./Step01_補足_Tailwind_Grid基礎.md) - Grid + Tailwind の基本から実践的な活用法
> - 📱 [レスポンシブ設計入門](./Step01_補足_レスポンシブ設計入門.md) - モバイルファーストなレスポンシブ実装
> - 💻 [Tailwind 開発環境セットアップ](./Step01_補足_開発環境セットアップ.md) - 効率的な開発環境構築
> - 🎨 [Tailwind レイアウトパターン集](./Step01_補足_レイアウトパターン集.md) - よく使われるレイアウトの実装例
> - 📚 [参考リソース](./Step01_補足_参考リソース.md) - 学習に役立つツールとリンク集

## 📅 学習期間・目標

**期間**: Step 1
**総学習時間**: 3 時間
**学習スタイル**: 問題分析 40% + 解決実践 50% + パターン習得 10%

### 🎯 Step 1 到達目標

- [ ] Tailwind での Flexbox/Grid 基本操作を習得
- [ ] レスポンシブデザインの基本パターンを Tailwind で実装
- [ ] 実務でよく使われるレイアウトコンポーネントを作成できる
- [ ] Tailwind を使った効率的なレイアウト開発手法を身につける

---

## 📚 Flexbox・Grid 入門解説

### 🎨 Tailwind CSS とは

Tailwind CSS は **ユーティリティファースト** の CSS フレームワークです。従来の CSS の書き方と異なり、HTML に直接スタイリングクラスを適用してレイアウトを構築します。

#### 従来の CSS vs Tailwind CSS

```html
<!-- 従来の CSS -->
<div class="card">
  <h3 class="card-title">タイトル</h3>
  <p class="card-text">説明文</p>
</div>

<style>
  .card {
    padding: 1.5rem;
    background-color: white;
    border-radius: 0.5rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  .card-title {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }
</style>
```

```html
<!-- Tailwind CSS -->
<div class="p-6 bg-white rounded-lg shadow-md">
  <h3 class="text-xl font-semibold mb-2">タイトル</h3>
  <p class="text-gray-600">説明文</p>
</div>
```

**Tailwind のメリット:**

- CSS ファイルを書かずに済む
- クラス名を考える必要がない
- レスポンシブ対応が簡単
- 一貫性のあるデザインシステム

### 🔧 Flexbox 基本概念

Flexbox は **1 次元レイアウト**（横並び・縦並び）に最適なレイアウト手法です。

#### Flexbox の重要概念

1. **Flex Container（親要素）**: `flex` クラスを適用した要素
2. **Flex Items（子要素）**: Flex Container の直接の子要素
3. **Main Axis（主軸）**: Flex Items が並ぶ方向
4. **Cross Axis（交差軸）**: 主軸に垂直な方向

#### Tailwind の主要 Flexbox クラス

| クラス           | 説明                       | CSS 相当                  |
| ---------------- | -------------------------- | ------------------------- |
| `flex`           | Flex Container を作成      | `display: flex`           |
| `flex-col`       | 縦方向に配置               | `flex-direction: column`  |
| `flex-row`       | 横方向に配置（デフォルト） | `flex-direction: row`     |
| `justify-center` | 主軸方向の中央寄せ         | `justify-content: center` |
| `items-center`   | 交差軸方向の中央寄せ       | `align-items: center`     |
| `flex-1`         | 余った空間を埋める         | `flex: 1 1 0%`            |
| `flex-none`      | 伸縮しない                 | `flex: none`              |

#### 基本的な Flexbox 例

```html
<!-- 横並び（基本） -->
<div class="flex gap-4">
  <div class="bg-blue-200 p-4">項目1</div>
  <div class="bg-green-200 p-4">項目2</div>
  <div class="bg-red-200 p-4">項目3</div>
</div>

<!-- 中央寄せ -->
<div class="flex items-center justify-center h-64">
  <div class="bg-purple-200 p-4">中央に配置</div>
</div>

<!-- 伸縮性のあるレイアウト -->
<div class="flex gap-4">
  <div class="flex-none w-48 bg-blue-200 p-4">固定幅</div>
  <div class="flex-1 bg-green-200 p-4">可変幅</div>
  <div class="flex-none w-32 bg-red-200 p-4">固定幅</div>
</div>
```

### 🎯 Grid 基本概念

Grid は **2 次元レイアウト**（行と列の両方）に最適なレイアウト手法です。

#### Grid の重要概念

1. **Grid Container（親要素）**: `grid` クラスを適用した要素
2. **Grid Items（子要素）**: Grid Container の直接の子要素
3. **Grid Lines**: グリッドを区切る線
4. **Grid Tracks**: 列または行
5. **Grid Areas**: 複数のセルで構成される領域

#### Tailwind の主要 Grid クラス

| クラス        | 説明                  | CSS 相当                                           |
| ------------- | --------------------- | -------------------------------------------------- |
| `grid`        | Grid Container を作成 | `display: grid`                                    |
| `grid-cols-3` | 3 列のグリッド        | `grid-template-columns: repeat(3, minmax(0, 1fr))` |
| `grid-rows-2` | 2 行のグリッド        | `grid-template-rows: repeat(2, minmax(0, 1fr))`    |
| `col-span-2`  | 2 列分の幅を占める    | `grid-column: span 2 / span 2`                     |
| `row-span-3`  | 3 行分の高さを占める  | `grid-row: span 3 / span 3`                        |
| `gap-4`       | グリッド間隔          | `gap: 1rem`                                        |

#### 基本的な Grid 例

```html
<!-- 3列グリッド -->
<div class="grid grid-cols-3 gap-4">
  <div class="bg-blue-200 p-4">1</div>
  <div class="bg-green-200 p-4">2</div>
  <div class="bg-red-200 p-4">3</div>
  <div class="bg-yellow-200 p-4">4</div>
  <div class="bg-purple-200 p-4">5</div>
  <div class="bg-pink-200 p-4">6</div>
</div>

<!-- 複雑なグリッドレイアウト -->
<div class="grid grid-cols-4 grid-rows-3 gap-2">
  <div class="col-span-2 row-span-2 bg-blue-200 p-4">大きなエリア</div>
  <div class="bg-green-200 p-4">小エリア1</div>
  <div class="bg-red-200 p-4">小エリア2</div>
  <div class="bg-yellow-200 p-4">小エリア3</div>
  <div class="bg-purple-200 p-4">小エリア4</div>
  <div class="col-span-2 bg-pink-200 p-4">横長エリア</div>
</div>
```

### 📱 レスポンシブデザイン基本

Tailwind では **モバイルファースト** のアプローチを採用し、ブレークポイントごとにスタイルを指定できます。

#### ブレークポイント一覧

| プレフィックス | 最小幅 | 対象デバイス       |
| -------------- | ------ | ------------------ |
| （なし）       | 0px    | すべて（モバイル） |
| `sm:`          | 640px  | 小さなタブレット   |
| `md:`          | 768px  | タブレット         |
| `lg:`          | 1024px | デスクトップ       |
| `xl:`          | 1280px | 大きなデスクトップ |
| `2xl:`         | 1536px | 超大型画面         |

#### レスポンシブの基本例

```html
<!-- モバイル：縦並び、タブレット以上：横並び -->
<div class="flex flex-col md:flex-row gap-4">
  <div class="bg-blue-200 p-4">コンテンツ1</div>
  <div class="bg-green-200 p-4">コンテンツ2</div>
</div>

<!-- モバイル：1列、タブレット：2列、デスクトップ：3列 -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <div class="bg-blue-200 p-4">カード1</div>
  <div class="bg-green-200 p-4">カード2</div>
  <div class="bg-red-200 p-4">カード3</div>
</div>

<!-- レスポンシブな幅指定 -->
<div class="w-full md:w-1/2 lg:w-1/3 bg-purple-200 p-4">レスポンシブ幅</div>
```

### 🤔 Flexbox vs Grid 使い分けガイド

| 用途                    | 推奨    | 理由                                 |
| ----------------------- | ------- | ------------------------------------ |
| ナビゲーションバー      | Flexbox | 1 次元（横並び）で十分               |
| カードの横並び          | Flexbox | アイテム数が可変の場合               |
| 画像ギャラリー          | Grid    | 等間隔・等サイズが重要               |
| ページ全体構造          | Grid    | ヘッダー・メイン・フッターの配置     |
| 中央寄せ                | Flexbox | `items-center justify-center` が簡単 |
| 複雑な 2 次元レイアウト | Grid    | 行と列の両方を制御したい場合         |

### 💡 学習のコツ

1. **小さく始める**: まず基本的な横並び・縦並びから
2. **実際に試す**: ブラウザで確認しながら学習
3. **DevTools を活用**: Chrome・Firefox の Flexbox/Grid Inspector を使用
4. **段階的に複雑化**: 基本ができたら組み合わせパターンを試す

---

## 🔍 実務でよくある NG パターン分析

### NG パターン 1: Flexbox の基本概念の誤解

#### 問題のコード例

```html
<!-- ❌ 悪い例：Flexboxの仕組みを理解せずに使用 -->
<div class="flex">
  <div class="w-full">左コンテンツ</div>
  <div class="w-full">右コンテンツ</div>
</div>
```

#### 🔍 問題が発生する理由

1. **`w-full`の重複指定**: 複数要素に`w-full`を指定すると、予期しない幅計算になる
2. **Flex アイテムの伸縮性の誤解**: `flex-grow`, `flex-shrink`の動作を理解していない
3. **コンテナとアイテムの関係性**: Flex コンテナとアイテムの親子関係が曖昧

### NG パターン 2: Grid の不適切な使用

#### 問題のコード例

```html
<!-- ❌ 悪い例：Gridが必要ない場面でGrid使用 -->
<div class="grid grid-cols-1">
  <div>単一列なのにGrid使用</div>
</div>
```

#### 🔍 問題が発生する理由

1. **単純レイアウトでの Grid 使用**: 単純な縦並びに Grid を使用（Block で十分）
2. **使い分けの理解不足**: Grid と Flexbox の適切な使い分けができていない
3. **不必要な複雑化**: シンプルで済むレイアウトを無駄に複雑にしている

### NG パターン 3: レスポンシブ対応の不備

#### 問題のコード例

```html
<!-- ❌ 悪い例：レスポンシブ未考慮 -->
<div class="flex">
  <div class="w-1/3">項目1</div>
  <div class="w-1/3">項目2</div>
  <div class="w-1/3">項目3</div>
</div>
```

#### 🔍 問題が発生する理由

1. **レスポンシブ設計の欠如**: モバイルでも横並びのまま（画面幅不足）
2. **ブレークポイント未設計**: 適切なブレークポイント設計がされていない
3. **可読性の低下**: 小画面でのコンテンツ可読性が大幅に低下する

## 💡 段階的解決策実装

### ✅ Flexbox 基礎パターン

#### 1. 基本的な Flex コンテナ

```html
<!-- ✅ 良い例：Flexboxの基本的な使い方 -->
<div class="flex flex-col md:flex-row gap-4">
  <div class="flex-1 bg-blue-100 p-4">
    <h3 class="text-lg font-semibold">左コンテンツ</h3>
    <p>メインコンテンツエリア</p>
  </div>
  <div class="flex-none w-full md:w-64 bg-gray-100 p-4">
    <h3 class="text-lg font-semibold">サイドバー</h3>
    <p>固定幅サイドバー</p>
  </div>
</div>
```

**ポイント:**

- `flex-1`: 残りの空間を埋める
- `flex-none`: 伸縮しない
- レスポンシブでの方向変更（`flex-col md:flex-row`）

#### 2. 中央寄せパターン

```html
<!-- ✅ 水平・垂直中央寄せ -->
<div class="flex items-center justify-center min-h-screen">
  <div class="bg-white p-8 rounded-lg shadow-lg">
    <h2 class="text-2xl font-bold text-center">中央寄せコンテンツ</h2>
    <p class="mt-4">完全に中央に配置</p>
  </div>
</div>
```

#### 3. ナビゲーションパターン

```html
<!-- ✅ ヘッダーナビゲーション -->
<header class="flex items-center justify-between p-4 bg-gray-800 text-white">
  <div class="flex items-center space-x-2">
    <img src="logo.svg" alt="Logo" class="w-8 h-8" />
    <span class="font-bold">サイト名</span>
  </div>
  <nav class="hidden md:flex space-x-6">
    <a href="#" class="hover:text-gray-300">ホーム</a>
    <a href="#" class="hover:text-gray-300">製品</a>
    <a href="#" class="hover:text-gray-300">会社情報</a>
  </nav>
  <button class="md:hidden">
    <svg class="w-6 h-6" fill="none" stroke="currentColor">
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M4 6h16M4 12h16M4 18h16"
      />
    </svg>
  </button>
</header>
```

### ✅ Grid 基礎パターン

#### 1. 基本的な Grid レイアウト

```html
<!-- ✅ カードグリッドレイアウト -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <div class="bg-white rounded-lg shadow p-6">
    <h3 class="text-xl font-semibold mb-2">カード1</h3>
    <p class="text-gray-600">説明文</p>
  </div>
  <div class="bg-white rounded-lg shadow p-6">
    <h3 class="text-xl font-semibold mb-2">カード2</h3>
    <p class="text-gray-600">説明文</p>
  </div>
  <div class="bg-white rounded-lg shadow p-6">
    <h3 class="text-xl font-semibold mb-2">カード3</h3>
    <p class="text-gray-600">説明文</p>
  </div>
</div>
```

#### 2. 複雑な Grid レイアウト

```html
<!-- ✅ ヘッダー・メイン・サイドバー・フッターレイアウト -->
<div
  class="min-h-screen grid grid-rows-[auto_1fr_auto] lg:grid-cols-[1fr_300px]"
>
  <!-- ヘッダー（全幅） -->
  <header class="bg-gray-800 text-white p-4 lg:col-span-2">
    <h1 class="text-xl font-bold">サイトタイトル</h1>
  </header>

  <!-- メインコンテンツ -->
  <main class="p-6 bg-gray-50">
    <h2 class="text-2xl font-bold mb-4">メインコンテンツ</h2>
    <p>メインコンテンツがここに入ります。</p>
  </main>

  <!-- サイドバー -->
  <aside class="bg-white p-6 border-l">
    <h3 class="text-lg font-semibold mb-4">サイドバー</h3>
    <ul class="space-y-2">
      <li><a href="#" class="text-blue-600 hover:underline">リンク1</a></li>
      <li><a href="#" class="text-blue-600 hover:underline">リンク2</a></li>
    </ul>
  </aside>

  <!-- フッター（全幅） -->
  <footer class="bg-gray-800 text-white p-4 lg:col-span-2">
    <p class="text-center">&copy; 2025 サイト名</p>
  </footer>
</div>
```

#### 3. 画像ギャラリーパターン

```html
<!-- ✅ レスポンシブ画像ギャラリー -->
<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
  <div class="aspect-square bg-gray-200 rounded-lg overflow-hidden">
    <img src="image1.jpg" alt="画像1" class="w-full h-full object-cover" />
  </div>
  <div class="aspect-square bg-gray-200 rounded-lg overflow-hidden">
    <img src="image2.jpg" alt="画像2" class="w-full h-full object-cover" />
  </div>
  <div class="aspect-square bg-gray-200 rounded-lg overflow-hidden col-span-2">
    <img src="image3.jpg" alt="画像3" class="w-full h-full object-cover" />
  </div>
</div>
```

### ✅ 実践演習

#### 演習 1: レスポンシブナビゲーション

下記の HTML ファイルを作成してブラウザで確認してください：

```html
<!DOCTYPE html>
<html lang="ja">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Flexbox ナビゲーション演習</title>
    <script src="https://cdn.tailwindcss.com"></script>
  </head>
  <body class="bg-gray-100">
    <!-- TODO: ここにレスポンシブナビゲーションを実装 -->
    <!-- ヒント: flex, items-center, justify-between, hidden, md:flex を使用 -->
  </body>
</html>
```

#### 演習 2: カードレイアウト

```html
<!DOCTYPE html>
<html lang="ja">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Grid カードレイアウト演習</title>
    <script src="https://cdn.tailwindcss.com"></script>
  </head>
  <body class="bg-gray-100 p-6">
    <!-- TODO: ここに6つのカードをグリッドレイアウトで配置 -->
    <!-- ヒント: grid, grid-cols-1, md:grid-cols-2, lg:grid-cols-3, gap-6 を使用 -->
  </body>
</html>
```

---

## ✅ パターン化・体系化 (10%)

### 🔧 Flexbox vs Grid 使い分けガイド

| 用途                             | 推奨レイアウト | 理由                           |
| -------------------------------- | -------------- | ------------------------------ |
| **1 次元配置**（横並び・縦並び） | Flexbox        | 簡潔で直感的                   |
| **2 次元配置**（行と列の両方）   | Grid           | 複雑なレイアウト制御           |
| **ナビゲーション**               | Flexbox        | 要素間の配置・間隔調整         |
| **カードリスト**                 | Grid           | 等間隔・等サイズ配置           |
| **中央寄せ**                     | Flexbox        | `items-center justify-center`  |
| **ページ全体構造**               | Grid           | ヘッダー・メイン・フッター管理 |

### 📝 実装チェックリスト

#### Flexbox 実装時

- [ ] コンテナに`flex`クラスを指定
- [ ] 必要に応じて方向指定（`flex-col`, `flex-row`）
- [ ] アイテムの配置指定（`justify-center`, `items-center`等）
- [ ] アイテムの伸縮性指定（`flex-1`, `flex-none`等）
- [ ] レスポンシブ対応（`md:flex-row`等）
- [ ] 適切な`gap`で間隔調整

#### Grid 実装時

- [ ] コンテナに`grid`クラスを指定
- [ ] 列数指定（`grid-cols-1`, `grid-cols-3`等）
- [ ] 必要に応じて行数指定（`grid-rows-3`等）
- [ ] レスポンシブな列数変更（`md:grid-cols-2`等）
- [ ] `gap`で要素間隔調整
- [ ] 必要に応じて要素の配置指定（`col-span-2`等）

### 🎨 よく使う組み合わせパターン

#### パターン 1: レスポンシブヘッダー

```
flex + items-center + justify-between + hidden + md:flex
```

#### パターン 2: カードグリッド

```
grid + grid-cols-1 + md:grid-cols-2 + lg:grid-cols-3 + gap-6
```

#### パターン 3: 中央寄せモーダル

```
flex + items-center + justify-center + min-h-screen
```

#### パターン 4: サイドバー付きレイアウト

```
grid + grid-cols-1 + lg:grid-cols-[1fr_300px] + gap-6
```

---

## 🛠️ 実践課題

### 課題 1: 基本レイアウト作成

以下の要件を満たす HTML ページを作成してください：

1. **ヘッダー**: ロゴ（左）+ ナビゲーション（右）+ ハンバーガーメニュー（モバイル）
2. **メインエリア**:
   - ヒーローセクション（画像 + テキスト中央寄せ）
   - 特徴セクション（3 つのカード、レスポンシブグリッド）
3. **フッター**: シンプルなコピーライト表示

**必須条件:**

- Tailwind CDN を使用
- モバイルファースト設計
- ブレークポイント: `md`（768px 以上）、`lg`（1024px 以上）

### 課題 2: 複雑なグリッドレイアウト

以下のレイアウトを実装してください：

```
[ヘッダー　　　　　　] 全幅
[メイン][サイドバー] メイン:可変幅、サイドバー:300px固定
[フッター　　　　　　] 全幅
```

**追加要件:**

- メインエリア内に 2x3 のカードグリッド配置
- サイドバーに縦並びメニュー
- モバイルでは 1 列レイアウトに変更

### 課題 3: インタラクティブコンポーネント

以下の機能を持つコンポーネントを作成：

1. **タブ切り替え**: Flexbox でタブヘッダー、Grid でコンテンツエリア
2. **画像ギャラリー**: 不規則サイズのグリッドレイアウト
3. **カード フィルター**: ボタンでカードの表示・非表示切り替え

---

## 🔍 デバッグ・検証ツール

### ブラウザ DevTools での確認ポイント

1. **Flexbox Inspector**（Firefox）

   - Flex アイテムの伸縮状態確認
   - 主軸・交差軸の方向確認

2. **Grid Inspector**（Firefox/Chrome）

   - グリッドラインの可視化
   - グリッドエリアの確認

3. **Responsive Design Mode**
   - 各ブレークポイントでの表示確認
   - タッチデバイスでの操作性確認

### よくあるトラブルシューティング

| 問題                                | 確認点                           | 解決策                            |
| ----------------------------------- | -------------------------------- | --------------------------------- |
| Flex アイテムが期待通りに伸縮しない | `flex-grow`, `flex-shrink`の設定 | `flex-1`, `flex-none`等で明示指定 |
| Grid アイテムが期待位置にない       | `grid-template-columns`の確認    | 列数・サイズ指定を見直し          |
| モバイルでレイアウト崩れ            | ブレークポイント設定             | `md:`, `lg:`プレフィックス追加    |
| 要素が画面外に                      | `overflow`の確認                 | `overflow-hidden`等で制御         |

---

## 📚 参考リソース

### 公式ドキュメント

- [Tailwind CSS Flexbox](https://tailwindcss.com/docs/flex)
- [Tailwind CSS Grid](https://tailwindcss.com/docs/grid-template-columns)
- [Tailwind CSS Responsive Design](https://tailwindcss.com/docs/responsive-design)

### 学習リソース

- [Flexbox Froggy](https://flexboxfroggy.com/#ja) - Flexbox 学習ゲーム
- [Grid Garden](https://cssgridgarden.com/#ja) - Grid 学習ゲーム
- [MDN Flexbox](https://developer.mozilla.org/ja/docs/Web/CSS/CSS_Flexible_Box_Layout)
- [MDN Grid](https://developer.mozilla.org/ja/docs/Web/CSS/CSS_Grid_Layout)

---

## ✅ 学習完了チェック

以下の項目がすべてできるようになったら、次のステップに進んでください：

### Flexbox 関連

- [ ] 基本的な Flex コンテナとアイテムの概念を理解
- [ ] `justify-content`と`align-items`の違いを説明できる
- [ ] `flex-1`, `flex-none`の使い分けができる
- [ ] レスポンシブでの Flexbox 方向変更ができる
- [ ] ナビゲーション、カードレイアウトを Flexbox で実装できる

### Grid 関連

- [ ] 基本的な Grid コンテナとアイテムの概念を理解
- [ ] `grid-cols-*`でカラム数を適切に指定できる
- [ ] `col-span-*`, `row-span-*`でアイテム配置ができる
- [ ] レスポンシブでの Grid 列数変更ができる
- [ ] 複雑なページレイアウトを Grid で実装できる

### 実践応用

- [ ] Flexbox と Grid の使い分けができる
- [ ] モバイルファーストでレスポンシブ実装ができる
- [ ] ブラウザ DevTools でレイアウトデバッグができる
- [ ] 実務レベルのコンポーネント実装ができる

---

## 🎯 次のステップ

Step01 で基礎を身につけたら、Step02「複雑レイアウト問題解決」で以下を学習します：

- Flexbox/Grid の深層的な動作理解
- コンテナクエリ実装の落とし穴
- カードレイアウト・グリッドシステムの問題解決
- レスポンシブグリッドの実装パターン

**💡 重要**: 基礎をしっかり習得することで、複雑な実務問題への対応がスムーズになります！
