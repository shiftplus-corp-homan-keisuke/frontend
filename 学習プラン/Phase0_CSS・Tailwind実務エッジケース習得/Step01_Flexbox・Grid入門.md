# Step01: Tailwind CSS Flexbox・Grid 入門

## 📅 学習期間・目標

**期間**: Step 1
**総学習時間**: 1 時間

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
  class="min-h-screen grid grid-rows-[auto_1fr_auto_auto] lg:grid-cols-[1fr_300px]"
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
    <img
      src="https://picsum.photos/400/400?random=1"
      alt="画像1"
      class="w-full h-full object-cover"
    />
  </div>
  <div class="aspect-square bg-gray-200 rounded-lg overflow-hidden">
    <img
      src="https://picsum.photos/400/400?random=2"
      alt="画像2"
      class="w-full h-full object-cover"
    />
  </div>
  <div class="aspect-square bg-gray-200 rounded-lg overflow-hidden col-span-2">
    <img
      src="https://picsum.photos/800/400?random=3"
      alt="画像3"
      class="w-full h-full object-cover"
    />
  </div>
</div>
```

---

## ✅ パターン化・体系化

### 🔧 Flexbox vs Grid 使い分けガイド

| 用途                             | 推奨レイアウト | 理由                           |
| -------------------------------- | -------------- | ------------------------------ |
| **1 次元配置**（横並び・縦並び） | Flexbox        | 簡潔で直感的                   |
| **2 次元配置**（行と列の両方）   | Grid           | 複雑なレイアウト制御           |
| **ナビゲーション**               | Flexbox        | 要素間の配置・間隔調整         |
| **カードリスト**                 | Grid           | 等間隔・等サイズ配置           |
| **中央寄せ**                     | Flexbox        | `items-center justify-center`  |
| **ページ全体構造**               | Grid / Flexbox | ヘッダー・メイン・フッター管理 |

### 📝 実装チェックリスト

#### Flexbox 実装時

- [x] コンテナに`flex`クラスを指定
- [x] 必要に応じて方向指定（`flex-col`, `flex-row`）
- [x] アイテムの配置指定（`justify-center`, `items-center`等）
- [x] アイテムの伸縮性指定（`flex-1`, `flex-none`等）
- [x] レスポンシブ対応（`md:flex-row`等）
- [x] 適切な`gap`で間隔調整

#### Grid 実装時

- [x] コンテナに`grid`クラスを指定
- [x] 列数指定（`grid-cols-1`, `grid-cols-3`等）
- [x] 必要に応じて行数指定（`grid-rows-3`等）
- [x] レスポンシブな列数変更（`md:grid-cols-2`等）
- [x] `gap`で要素間隔調整
- [x] 必要に応じて要素の配置指定（`col-span-2`等）

## 🛠️ 実践課題

### 課題 1: 基本レイアウト作成

**🎯 目標**: Flexbox を使ったレスポンシブなヘッダーナビゲーションと Grid を使ったカードレイアウトを実装

**📝 実装手順**:

1. [Tailwind Playground](https://play.tailwindcss.com/) を開く
2. 以下の要件を満たすレイアウトを作成：
   - **ヘッダー**: ロゴ（左）+ ナビゲーション（右）+ ハンバーガーメニュー（モバイル）
   - **メインエリア**: 3 つのカードをレスポンシブグリッドで配置
   - **フッター**: シンプルなコピーライト表示

**📋 必須条件**:

- モバイルファースト設計
- ブレークポイント: `md`（768px 以上）、`lg`（1024px 以上）
- Flexbox でヘッダーナビゲーション
- Grid でカードレイアウト

**💡 解答例:**

```html
<!-- ヘッダー -->
<header class="bg-white shadow-md">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
            <!-- ロゴ -->
            <div class="flex items-center">
                <div class="text-xl font-bold text-gray-900">Logo</div>
            </div>

            <!-- デスクトップナビゲーション -->
            <nav class="hidden md:flex space-x-8">
                <a href="#" class="text-gray-700 hover:text-blue-600">ホーム</a>
                <a href="#" class="text-gray-700 hover:text-blue-600">サービス</a>
                <a href="#" class="text-gray-700 hover:text-blue-600">会社情報</a>
                <a href="#" class="text-gray-700 hover:text-blue-600">お問い合わせ</a>
            </nav>

            <!-- ハンバーガーメニュー（モバイル） -->
            <button class="md:hidden text-gray-700">
                <span class="text-2xl">三</span>
            </button>
        </div>
    </div>
</header>

<!-- メインコンテンツ -->
<main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-gray-50">
    <h1 class="text-3xl font-bold text-center mb-12">特徴セクション</h1>

    <!-- カードグリッド -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div class="bg-white rounded-lg shadow-md p-6">
            <div class="w-12 h-12 bg-blue-500 rounded-lg mb-4"></div>
            <h3 class="text-xl font-semibold mb-2">特徴 1</h3>
            <p class="text-gray-600">ここに特徴の説明が入ります。</p>
        </div>

        <div class="bg-white rounded-lg shadow-md p-6">
            <div class="w-12 h-12 bg-green-500 rounded-lg mb-4"></div>
            <h3 class="text-xl font-semibold mb-2">特徴 2</h3>
            <p class="text-gray-600">ここに特徴の説明が入ります。</p>
        </div>

        <div class="bg-white rounded-lg shadow-md p-6">
            <div class="w-12 h-12 bg-purple-500 rounded-lg mb-4"></div>
            <h3 class="text-xl font-semibold mb-2">特徴 3</h3>
            <p class="text-gray-600">ここに特徴の説明が入ります。</p>
        </div>
    </div>
</main>

<!-- フッター -->
<footer class="bg-gray-800 text-white py-8 mt-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p class="text-center">&copy; 2025 サンプルサイト. All rights reserved.</p>
    </div>
</footer>

</body>
</html>
```

**🔍 ポイント解説**:

- `flex items-center justify-between` でヘッダーの左右配置
- `hidden md:flex` でレスポンシブナビゲーション
- `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3` でレスポンシブグリッド
- `max-w-7xl mx-auto` でコンテンツ幅制限と中央寄せ

### 課題 2: 複雑なグリッドレイアウト

**🎯 目標**: CSS Grid を使った複雑なページレイアウトの実装

**📝 実装手順**:

1. [Tailwind Playground](https://play.tailwindcss.com/) を開く
2. 以下のレイアウト構造を実装：

```
[ヘッダー　　　　　　] 全幅
[メイン][サイドバー] メイン:可変幅、サイドバー:300px固定
[フッター　　　　　　] 全幅
```

**📋 追加要件**:

- メインエリア内に 2×3 のカードグリッド配置
- サイドバーに縦並びメニュー
- モバイルでは 1 列レイアウトに変更

**💡 解答例:**

```html
<!-- グリッドコンテナ -->
<div
  class="min-h-screen grid grid-rows-[auto_1fr_auto_auto] lg:grid-cols-[1fr_300px] bg-gray-50"
>
  <!-- ヘッダー（全幅） -->
  <header class="bg-blue-600 text-white p-4 lg:col-span-2">
    <div class="max-w-7xl mx-auto">
      <h1 class="text-2xl font-bold">複雑レイアウトサイト</h1>
    </div>
  </header>

  <!-- メインコンテンツ -->
  <main class="p-6 lg:p-8">
    <h2 class="text-2xl font-bold mb-6">メインコンテンツ</h2>

    <!-- 2×3 カードグリッド -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div class="bg-white rounded-lg shadow p-4">
        <h3 class="font-semibold mb-2">カード 1</h3>
        <p class="text-gray-600">コンテンツ</p>
      </div>
      <div class="bg-white rounded-lg shadow p-4">
        <h3 class="font-semibold mb-2">カード 2</h3>
        <p class="text-gray-600">コンテンツ</p>
      </div>
      <div class="bg-white rounded-lg shadow p-4">
        <h3 class="font-semibold mb-2">カード 3</h3>
        <p class="text-gray-600">コンテンツ</p>
      </div>
      <div class="bg-white rounded-lg shadow p-4">
        <h3 class="font-semibold mb-2">カード 4</h3>
        <p class="text-gray-600">コンテンツ</p>
      </div>
      <div class="bg-white rounded-lg shadow p-4">
        <h3 class="font-semibold mb-2">カード 5</h3>
        <p class="text-gray-600">コンテンツ</p>
      </div>
      <div class="bg-white rounded-lg shadow p-4">
        <h3 class="font-semibold mb-2">カード 6</h3>
        <p class="text-gray-600">コンテンツ</p>
      </div>
    </div>
  </main>

  <!-- サイドバー -->
  <aside class="bg-white border-l border-gray-200 p-6">
    <h3 class="text-lg font-semibold mb-4">サイドバー</h3>
    <nav class="space-y-2">
      <a
        href="#"
        class="block py-2 px-3 text-gray-700 hover:bg-gray-100 rounded"
        >メニュー 1</a
      >
      <a
        href="#"
        class="block py-2 px-3 text-gray-700 hover:bg-gray-100 rounded"
        >メニュー 2</a
      >
      <a
        href="#"
        class="block py-2 px-3 text-gray-700 hover:bg-gray-100 rounded"
        >メニュー 3</a
      >
      <a
        href="#"
        class="block py-2 px-3 text-gray-700 hover:bg-gray-100 rounded"
        >メニュー 4</a
      >
    </nav>
  </aside>

  <!-- フッター（全幅） -->
  <footer class="bg-gray-800 text-white p-4 lg:col-span-2">
    <div class="max-w-7xl mx-auto text-center">
      <p>&copy; 2025 複雑レイアウトサイト</p>
    </div>
  </footer>
</div>
```

**🔍 ポイント解説**:

- `grid-rows-[auto_1fr_auto_auto]` でヘッダー・メイン・フッターの高さ設定
- `lg:grid-cols-[1fr_300px]` でメイン・サイドバーの幅設定
- `lg:col-span-2` でヘッダー・フッターを全幅に
- `space-y-2` でサイドバーメニューの間隔調整
