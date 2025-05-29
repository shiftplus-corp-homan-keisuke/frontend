# Step 1: 複雑レイアウト問題解決

> 💡 **補足資料**: より詳細な解説と実践例は以下を参照 🚀
>
> - 📖 [Tailwind Flexbox 入門ガイド](./Step02_補足_Tailwind_Flexbox入門.md) - Tailwind での flexbox の入門から高度な活用法
> - 🛠️ [Tailwind Grid 入門](./Step02_補足_Tailwind_Grid入門.md) - Grid + Tailwind の入門から高度な活用法
> - ⚙️ [コンテナクエリ + Tailwind](./Step02_補足_コンテナクエリ_Tailwind.md) - 最新レスポンシブ技術の実装
> - 💻 [Tailwind デバッグ手法](./Step02_補足_Tailwindデバッグ手法.md) - 効率的な問題特定・解決手順
> - 🚨 [Tailwind レイアウト事例集](./Step02_補足_Tailwindレイアウト事例集.md) - よくある問題と Tailwind 解決例
> - 📚 [参考リソース](./Step01_補足_参考リソース.md) - 学習に役立つツールとリンク集

## 📅 学習期間・目標

**期間**: Step 2  
**総学習時間**: 3 時間  
**学習スタイル**: 問題分析 40% + 解決実践 50% + パターン習得 10%

### 🎯 Step 1 到達目標

- [ ] Tailwind での Flexbox/Grid 問題解決パターンを習得
- [ ] カードレイアウト・グリッドシステムの実装問題を Tailwind で解決
- [ ] Tailwind + コンテナクエリを使った最新レスポンシブ設計
- [ ] Tailwind プロジェクトでのレイアウトデバッグ手法を身につける

## 🚨 実務でよくある NG パターン分析

### NG パターン 1: Flexbox カードの高さ不揃い問題

#### 問題のコード例

```html
<!-- ❌ NG: カードの高さが揃わず、ボタンの位置がバラバラ -->
<div class="flex gap-4">
  <div class="flex-1 p-4 border border-gray-300 rounded-lg">
    <div class="flex flex-col">
      <h3 class="font-semibold text-lg mb-3">短いタイトル</h3>
      <p class="flex-1 text-gray-600 mb-4">短いテキスト</p>
      <!-- ↑ flex-1自体は正常動作。問題は親コンテナの高さ不足 -->
      <button
        class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        詳細を見る
      </button>
    </div>
  </div>

  <div class="flex-1 p-4 border border-gray-300 rounded-lg">
    <div class="flex flex-col">
      <h3 class="font-semibold text-lg mb-3">
        非常に長いタイトルで複数行になる場合
      </h3>
      <p class="flex-1 text-gray-600 mb-4">
        非常に長いテキストで、複数行にわたる説明文が入っています。
        この場合、隣のカードとの高さが揃わなくなり、レイアウトが崩れる原因となります。
        さらに長い説明が続いて、ボタンの位置が不揃いになります。
      </p>
      <button
        class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        詳細を見る
      </button>
    </div>
  </div>
</div>
```

#### 🔍 問題が発生する理由

1. **親コンテナの高さ不足**: 内側の`flex flex-col`コンテナが親の高さを占有していない
2. **高さの継承問題**: 外側の flex で高さは揃うが、内側の flex コンテナにその高さが正しく伝わっていない
3. **flex-1 の動作条件**: `flex-1`は親の flex コンテナが適切な高さを持っている場合のみ有効
4. **ボタン位置の不揃い**: 結果として、テキスト長が異なるとボタンの位置がバラバラになる

**注意**: `flex-1`自体は正常に動作している。問題は`flex-1`が動作する環境が整っていないこと。

#### 💡 解決策：段階的 Tailwind アプローチ

**核心**: 内側の flex コンテナが親の高さを正しく占有できるようにする

##### ステップ 1: 最小限の修正（h-full 追加）

```html
<!-- ✅ STEP1: h-fullで基本解決 -->
<div class="flex gap-4">
  <div class="flex-1 p-4 border border-gray-300 rounded-lg">
    <div class="flex flex-col h-full">
      <!-- ↑ 【重要】h-fullで親の高さを継承。これがないとflex-1が正しく動作しない -->
      <h3 class="font-semibold text-lg mb-3">短いタイトル</h3>
      <p class="flex-1 text-gray-600 mb-4">短いテキスト</p>
      <!-- ↑ h-fullがあれば、flex-1はそのまま使用可能 -->
      <button
        class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        詳細を見る
      </button>
    </div>
  </div>

  <div class="flex-1 p-4 border border-gray-300 rounded-lg">
    <div class="flex flex-col h-full">
      <h3 class="font-semibold text-lg mb-3">
        非常に長いタイトルで複数行になる場合
      </h3>
      <p class="grow text-gray-600 mb-4">
        非常に長いテキストで、複数行にわたる説明文が入っています。
        この場合も適切にレイアウトが維持されます。
      </p>
      <button
        class="mt-auto px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        詳細を見る
      </button>
    </div>
  </div>
</div>
```

##### ステップ 2: 堅牢な Grid 解決策

```html
<!-- ✅ STEP2: Grid + Tailwindでより堅牢な実装 -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
  <!-- ↑ items-startで上揃え、高さを独立化 -->

  <div
    class="grid grid-rows-[auto_1fr_auto] min-h-[320px] p-6 border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow"
  >
    <!-- ↑ grid-rows-[auto_1fr_auto] でヘッダー/コンテンツ/フッター構造 -->

    <div class="grid-row-start-1">
      <h3 class="font-semibold text-xl mb-4 text-gray-900">短いタイトル</h3>
    </div>

    <div class="grid-row-start-2 self-start">
      <!-- ↑ self-start で上詰め配置 -->
      <p class="text-gray-600 leading-relaxed mb-6">短いテキスト</p>
    </div>

    <div class="grid-row-start-3 self-end">
      <!-- ↑ self-end でボタンを下部に固定 -->
      <button
        class="w-full px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
      >
        詳細を見る
      </button>
    </div>
  </div>

  <div
    class="grid grid-rows-[auto_1fr_auto] min-h-[320px] p-6 border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow"
  >
    <div class="grid-row-start-1">
      <h3 class="font-semibold text-xl mb-4 text-gray-900">
        非常に長いタイトルで複数行になる場合
      </h3>
    </div>

    <div class="grid-row-start-2 self-start">
      <p class="text-gray-600 leading-relaxed mb-6">
        非常に長いテキストで、複数行にわたる説明文が入っています。
        この場合も適切にレイアウトが維持され、ボタンの位置も揃います。
      </p>
    </div>

    <div class="grid-row-start-3 self-end">
      <button
        class="w-full px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
      >
        詳細を見る
      </button>
    </div>
  </div>
</div>
```

##### ステップ 3: コンテナクエリ対応（最新手法）

```html
<!-- ✅ STEP3: Tailwind + コンテナクエリで動的レイアウト -->
<div class="@container">
  <!-- ↑ @containerでコンテナクエリを有効化 -->

  <div
    class="grid grid-cols-[repeat(auto-fill,minmax(min(320px,100%),1fr))] gap-6"
  >
    <div
      class="@container grid grid-rows-[auto_1fr_auto] p-4 @sm:p-6 @lg:p-8 border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all"
    >
      <!-- ↑ @container でカード自体もコンテナに、@sm @lgでコンテナベースのレスポンシブ -->

      <div class="grid-row-start-1">
        <h3
          class="font-semibold text-lg @sm:text-xl @lg:text-2xl mb-3 @sm:mb-4 text-gray-900"
        >
          コンテナクエリ対応タイトル
        </h3>
      </div>

      <div class="grid-row-start-2 self-start">
        <p
          class="text-gray-600 text-sm @sm:text-base @lg:text-lg leading-relaxed mb-4 @sm:mb-6"
        >
          カードの幅に応じてフォントサイズやスペーシングが自動調整されます。
          これにより、どのような画面サイズでも最適な表示を実現できます。
        </p>
      </div>

      <div class="grid-row-start-3 self-end">
        <button
          class="w-full px-3 py-2 @sm:px-4 @sm:py-3 text-sm @sm:text-base bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
        >
          詳細を見る
        </button>
      </div>
    </div>
  </div>
</div>
```

```javascript
// tailwind.config.js でコンテナクエリを有効化
module.exports = {
  content: ["./src/**/*.{html,js,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [require("@tailwindcss/container-queries")],
};
```

### NG パターン 2: CSS Grid 自動配置の制御問題

#### 問題のコード例

```html
<!-- ❌ NG: グリッドアイテムが予期しない位置に配置される -->
<div class="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4 p-4">
  <div class="aspect-square bg-gray-200 rounded-lg"></div>
  <div class="aspect-square bg-gray-300 rounded-lg"></div>

  <!-- 特徴アイテム：2倍サイズにしたいが期待した位置にならない -->
  <div class="col-span-2 row-span-2 bg-blue-200 rounded-lg"></div>
  <!-- ↑ この配置が予期しない場所に表示される -->

  <div class="aspect-square bg-gray-400 rounded-lg"></div>
  <div class="aspect-square bg-gray-500 rounded-lg"></div>
  <div class="aspect-square bg-gray-600 rounded-lg"></div>
</div>
```

#### 🔍 問題が発生する理由

1. **自動配置アルゴリズムの誤解**: CSS Grid は「隙間を埋める」配置はデフォルトでは行わない
2. **grid-auto-flow の未指定**: Tailwind のデフォルトは`row`で、隙間が生まれやすい
3. **レスポンシブ列数の未考慮**: 画面サイズが変わると配置が崩れる

#### 💡 解決策：Masonry 風 Grid の実現

```html
<!-- ✅ 解決策: 密度優先配置 + Tailwind -->
<div
  class="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] auto-rows-[200px] gap-4 p-4"
  style="grid-auto-flow: row dense;"
>
  <!-- ↑ auto-rows-[200px]で行高固定、grid-auto-flow: row denseで隙間を埋める -->

  <!-- 通常アイテム -->
  <div class="bg-gray-200 rounded-lg overflow-hidden">
    <img
      src="/api/placeholder/200/200"
      alt="画像1"
      class="w-full h-full object-cover"
    />
  </div>

  <div class="bg-gray-300 rounded-lg overflow-hidden">
    <img
      src="/api/placeholder/200/200"
      alt="画像2"
      class="w-full h-full object-cover"
    />
  </div>

  <!-- レスポンシブ特徴アイテム -->
  <div
    class="col-span-2 row-span-2 bg-blue-200 rounded-lg overflow-hidden featured-item"
  >
    <img
      src="/api/placeholder/400/400"
      alt="特徴画像"
      class="w-full h-full object-cover"
    />
  </div>

  <div class="bg-gray-400 rounded-lg overflow-hidden">
    <img
      src="/api/placeholder/200/200"
      alt="画像4"
      class="w-full h-full object-cover"
    />
  </div>

  <div class="bg-gray-500 rounded-lg overflow-hidden">
    <img
      src="/api/placeholder/200/200"
      alt="画像5"
      class="w-full h-full object-cover"
    />
  </div>

  <!-- たて長アイテム -->
  <div class="row-span-2 bg-green-200 rounded-lg overflow-hidden">
    <img
      src="/api/placeholder/200/400"
      alt="縦長画像"
      class="w-full h-full object-cover"
    />
  </div>
</div>

<style>
  /* レスポンシブ対応：小画面では特徴アイテムを通常サイズに */
  @media (max-width: 640px) {
    .featured-item {
      grid-column: span 1;
      grid-row: span 1;
    }
  }
</style>
```

##### JavaScript 連携での動的制御

```html
<!-- JavaScript連携版：完全動的制御 -->
<div id="responsive-gallery" class="grid gap-4 p-4">
  <!-- アイテムをJavaScriptで動的に制御 -->
</div>

<script>
  function initResponsiveGallery() {
    const gallery = document.getElementById("responsive-gallery");

    function updateGalleryLayout() {
      const width = gallery.offsetWidth;
      const minItemWidth = 200;
      const gap = 16;

      // 利用可能な列数を計算
      const columns = Math.floor((width + gap) / (minItemWidth + gap));

      // Tailwindクラスを動的に適用
      gallery.className = `grid gap-4 p-4 auto-rows-[200px]`;
      gallery.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
      gallery.style.gridAutoFlow = "row dense";

      // CSS変数で列数を共有
      gallery.style.setProperty("--columns", columns);

      // 特徴アイテムのレスポンシブ制御
      const featuredItems = gallery.querySelectorAll(".featured-item");
      featuredItems.forEach((item) => {
        if (columns >= 2) {
          item.className = item.className.replace(/col-span-\d+/, "col-span-2");
          item.className = item.className.replace(/row-span-\d+/, "row-span-2");
        } else {
          item.className = item.className.replace(/col-span-\d+/, "col-span-1");
          item.className = item.className.replace(/row-span-\d+/, "row-span-1");
        }
      });
    }

    // 初期化とリサイズ対応
    updateGalleryLayout();
    window.addEventListener("resize", updateGalleryLayout);
  }

  // ページロード時に初期化
  document.addEventListener("DOMContentLoaded", initResponsiveGallery);
</script>
```

### NG パターン 3: ナビゲーションの可変対応問題

#### 問題のコード例

```html
<!-- ❌ NG: メニュー項目数やテキスト長でレイアウトが崩れる -->
<nav class="flex w-full bg-white border-b">
  <a
    href="#"
    class="flex-1 px-8 py-4 text-center whitespace-nowrap hover:bg-gray-50"
  >
    ホーム
  </a>
  <a
    href="#"
    class="flex-1 px-8 py-4 text-center whitespace-nowrap hover:bg-gray-50"
  >
    製品・サービス案内
    <!-- ↑ 長いテキストで他のアイテムを圧迫 -->
  </a>
  <a
    href="#"
    class="flex-1 px-8 py-4 text-center whitespace-nowrap hover:bg-gray-50"
  >
    会社情報
  </a>
  <a
    href="#"
    class="flex-1 px-8 py-4 text-center whitespace-nowrap hover:bg-gray-50"
  >
    お問い合わせ
  </a>
</nav>
```

#### 🔍 問題が発生する理由

1. **flex-1 の基準サイズ問題**: Tailwind の`flex-1`は基準サイズ 0 で、コンテンツサイズを無視
2. **長いテキストへの未対応**: テキスト長が異なると配置が歪む
3. **モバイル対応不足**: 小画面でのオーバーフロー対策が必要

#### 💡 解決策：レスポンシブナビゲーション

```html
<!-- ✅ 解決策: レスポンシブ + コンテンツ対応ナビゲーション -->

<!-- デスクトップ版：等幅配置 -->
<nav class="hidden md:flex w-full bg-white border-b border-gray-200 shadow-sm">
  <a
    href="#"
    class="flex-1 max-w-[200px] px-4 py-4 text-center font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-200"
  >
    ホーム
  </a>
  <a
    href="#"
    class="flex-1 max-w-[200px] px-4 py-4 text-center font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-200"
  >
    <span class="lg:hidden">製品</span>
    <span class="hidden lg:inline">製品・サービス</span>
    <!-- ↑ レスポンシブテキスト表示 -->
  </a>
  <a
    href="#"
    class="flex-1 max-w-[200px] px-4 py-4 text-center font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-200"
  >
    会社情報
  </a>
  <a
    href="#"
    class="flex-1 max-w-[200px] px-4 py-4 text-center font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-200"
  >
    <span class="lg:hidden">問合せ</span>
    <span class="hidden lg:inline">お問い合わせ</span>
  </a>
</nav>

<!-- タブレット・モバイル版：スクロール対応 -->
<nav
  class="md:hidden flex w-full overflow-x-auto bg-white border-b border-gray-200 snap-x snap-mandatory scrollbar-hide"
>
  <!-- ↑ scrollbar-hideでスクロールバーを非表示 -->

  <a
    href="#"
    class="flex-none min-w-fit px-6 py-4 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 snap-start transition-colors whitespace-nowrap"
  >
    ホーム
  </a>
  <a
    href="#"
    class="flex-none min-w-fit px-6 py-4 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 snap-start transition-colors whitespace-nowrap"
  >
    製品・サービス
  </a>
  <a
    href="#"
    class="flex-none min-w-fit px-6 py-4 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 snap-start transition-colors whitespace-nowrap"
  >
    会社情報
  </a>
  <a
    href="#"
    class="flex-none min-w-fit px-6 py-4 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 snap-start transition-colors whitespace-nowrap"
  >
    お問い合わせ
  </a>
</nav>

<!-- スクロールバー非表示のカスタムCSS -->
<style>
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
</style>
```

## 🛠️ Tailwind プロジェクトでの実践デバッグ手法

### 1. Tailwind デバッグ用ユーティリティ

```html
<!-- デバッグ用の視覚化クラス -->
<div class="debug-layout">
  <!-- すべての要素に境界線とサイズ情報を表示 -->
</div>

<style>
  /* Tailwindプロジェクト用デバッグCSS */
  .debug-layout * {
    @apply outline outline-1 outline-red-300 bg-green-100 bg-opacity-10;
  }

  .debug-layout .flex {
    @apply outline-blue-500 outline-2;
  }

  .debug-layout .grid {
    @apply outline-green-500 outline-2;
  }

  /* サイズ情報の表示 */
  .debug-layout *::before {
    content: attr(class);
    @apply absolute -top-6 left-0 text-xs bg-black text-white px-1 py-0.5 rounded z-50;
    font-family: monospace;
    max-width: 300px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>
```

### 2. JavaScript 連携デバッグツール

```javascript
// Tailwindクラス情報を取得するデバッグ関数
function debugTailwindElement(selector) {
  const element = document.querySelector(selector);
  if (!element) return;

  const classes = element.className.split(" ");
  const computedStyle = getComputedStyle(element);

  console.group(`🎨 Tailwind Debug: ${selector}`);

  // Flexbox関連クラス
  const flexClasses = classes.filter(
    (c) => c.includes("flex") || c.includes("justify") || c.includes("items")
  );
  if (flexClasses.length > 0) {
    console.log("🔧 Flex Classes:", flexClasses);
    console.log("📐 Computed:", {
      display: computedStyle.display,
      flexDirection: computedStyle.flexDirection,
      justifyContent: computedStyle.justifyContent,
      alignItems: computedStyle.alignItems,
    });
  }

  // Grid関連クラス
  const gridClasses = classes.filter(
    (c) => c.includes("grid") || c.includes("col") || c.includes("row")
  );
  if (gridClasses.length > 0) {
    console.log("🔧 Grid Classes:", gridClasses);
    console.log("📐 Computed:", {
      display: computedStyle.display,
      gridTemplateColumns: computedStyle.gridTemplateColumns,
      gridTemplateRows: computedStyle.gridTemplateRows,
      gridAutoFlow: computedStyle.gridAutoFlow,
    });
  }

  // サイズ関連クラス
  const sizeClasses = classes.filter((c) =>
    c.match(/^(w-|h-|min-|max-|p-|m-)/)
  );
  if (sizeClasses.length > 0) {
    console.log("📏 Size Classes:", sizeClasses);
    console.log("📐 Computed Size:", {
      width: computedStyle.width,
      height: computedStyle.height,
      padding: computedStyle.padding,
      margin: computedStyle.margin,
    });
  }

  console.groupEnd();
}

// 使用例
debugTailwindElement(".card-container");
debugTailwindElement(".featured-item");
```

### 3. Tailwind 設定チェッカー

```javascript
// Tailwind設定の確認とレスポンシブブレークポイント検証
function checkTailwindConfig() {
  // ブレークポイントの確認
  const breakpoints = {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    "2xl": 1536,
  };

  const currentWidth = window.innerWidth;
  const activeBreakpoint =
    Object.entries(breakpoints)
      .filter(([_, width]) => currentWidth >= width)
      .pop()?.[0] || "base";

  console.log(`📱 Current Screen: ${currentWidth}px (${activeBreakpoint})`);

  // コンテナクエリの対応状況
  const supportsContainerQueries =
    "container" in document.documentElement.style;
  console.log(
    `🔧 Container Queries Support: ${supportsContainerQueries ? "✅" : "❌"}`
  );

  // Tailwind JIT モードの確認
  const hasArbitraryValue = document.querySelector('[class*="["]');
  console.log(
    `⚡ Arbitrary Values Detected: ${hasArbitraryValue ? "✅" : "❌"}`
  );
}

// リサイズ時の自動チェック
window.addEventListener("resize", checkTailwindConfig);
checkTailwindConfig(); // 初期実行
```

## ✅ 実装パターンの体系化

### パターン 1: レスポンシブカードグリッド

```html
<!-- 再利用可能なカードレイアウトコンポーネント -->
<div
  class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6"
>
  <div
    class="group grid grid-rows-[auto_1fr_auto] min-h-[320px] p-6 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
  >
    <!-- カードヘッダー -->
    <div class="grid-row-start-1 mb-4">
      <div class="w-full h-48 bg-gray-200 rounded-lg mb-4 overflow-hidden">
        <img
          src="/api/placeholder/300/200"
          alt="カード画像"
          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <h3 class="font-semibold text-xl text-gray-900 line-clamp-2">
        カードタイトルが長い場合の処理
      </h3>
    </div>

    <!-- カードコンテンツ -->
    <div class="self-start">
      <p class="text-gray-600 leading-relaxed line-clamp-3 mb-4">
        カードの説明文がここに入ります。長い場合は3行で切り捨てられます。
      </p>
      <div class="flex flex-wrap gap-2 mb-4">
        <span class="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
          >タグ1</span
        >
        <span class="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full"
          >タグ2</span
        >
      </div>
    </div>

    <!-- カードフッター -->
    <div class="self-end">
      <div class="flex items-center justify-between mb-4">
        <span class="text-sm text-gray-500">2024年1月15日</span>
        <span class="font-bold text-lg text-blue-600">¥1,980</span>
      </div>
      <button
        class="w-full px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
      >
        詳細を見る
      </button>
    </div>
  </div>
</div>

<!-- 注意：line-clamp-2、line-clamp-3はTailwind CSS v3.3以降で標準提供されています -->
<!-- カスタムCSSは不要です。必要に応じてtailwind.config.jsでline-clamp pluginを有効化してください -->
```

### パターン 2: 動的 Masonry ギャラリー

```html
<!-- JavaScript連携Masonryギャラリー -->
<div
  id="masonry-gallery"
  class="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 p-6"
>
  <div
    class="break-inside-avoid mb-6 bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
  >
    <img src="/api/placeholder/300/200" alt="画像1" class="w-full" />
    <div class="p-4">
      <h3 class="font-semibold mb-2">標準サイズ画像</h3>
      <p class="text-gray-600 text-sm">説明文がここに入ります。</p>
    </div>
  </div>

  <div
    class="break-inside-avoid mb-6 bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
  >
    <img src="/api/placeholder/300/400" alt="画像2" class="w-full" />
    <div class="p-4">
      <h3 class="font-semibold mb-2">縦長画像</h3>
      <p class="text-gray-600 text-sm">縦長の画像に対応したレイアウトです。</p>
    </div>
  </div>

  <div
    class="break-inside-avoid mb-6 bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
  >
    <img src="/api/placeholder/300/120" alt="画像3" class="w-full" />
    <div class="p-4">
      <h3 class="font-semibold mb-2">横長画像</h3>
      <p class="text-gray-600 text-sm">横長の画像も適切に配置されます。</p>
    </div>
  </div>
</div>
```

### パターン 3: アダプティブナビゲーション

```html
<!-- 完全レスポンシブナビゲーション -->
<nav class="bg-white border-b border-gray-200 sticky top-0 z-50">
  <!-- デスクトップ版 -->
  <div class="hidden lg:flex max-w-7xl mx-auto px-4">
    <div class="flex items-center space-x-8">
      <a href="#" class="font-bold text-xl text-blue-600">ロゴ</a>

      <div class="flex space-x-6">
        <a
          href="#"
          class="px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors font-medium"
        >
          ホーム
        </a>
        <a
          href="#"
          class="px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors font-medium"
        >
          製品・サービス
        </a>
        <a
          href="#"
          class="px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors font-medium"
        >
          会社情報
        </a>
        <a
          href="#"
          class="px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors font-medium"
        >
          お問い合わせ
        </a>
      </div>
    </div>
  </div>

  <!-- タブレット・モバイル版 -->
  <div class="lg:hidden">
    <div class="flex items-center justify-between px-4 py-3">
      <a href="#" class="font-bold text-lg text-blue-600">ロゴ</a>
      <button
        id="mobile-menu-button"
        class="p-2 text-gray-600 hover:text-gray-900"
      >
        <svg
          class="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h16M4 18h16"
          ></path>
        </svg>
      </button>
    </div>

    <!-- モバイルメニュー -->
    <div id="mobile-menu" class="hidden border-t border-gray-200">
      <div class="flex overflow-x-auto snap-x snap-mandatory">
        <a
          href="#"
          class="flex-none min-w-fit px-6 py-4 text-sm font-medium text-gray-700 hover:bg-gray-50 snap-start whitespace-nowrap"
        >
          ホーム
        </a>
        <a
          href="#"
          class="flex-none min-w-fit px-6 py-4 text-sm font-medium text-gray-700 hover:bg-gray-50 snap-start whitespace-nowrap"
        >
          製品・サービス
        </a>
        <a
          href="#"
          class="flex-none min-w-fit px-6 py-4 text-sm font-medium text-gray-700 hover:bg-gray-50 snap-start whitespace-nowrap"
        >
          会社情報
        </a>
        <a
          href="#"
          class="flex-none min-w-fit px-6 py-4 text-sm font-medium text-gray-700 hover:bg-gray-50 snap-start whitespace-nowrap"
        >
          お問い合わせ
        </a>
      </div>
    </div>
  </div>
</nav>

<script>
  // モバイルメニューの制御
  document
    .getElementById("mobile-menu-button")
    .addEventListener("click", function () {
      const menu = document.getElementById("mobile-menu");
      menu.classList.toggle("hidden");
    });
</script>
```

## 🎯 実践演習

### 演習 1-1: Tailwind カード修正チャレンジ 🔰

以下のバグを含む Tailwind コードを修正してください：

```html
<!-- バグを含むカードレイアウト -->
<div class="flex flex-wrap">
  <div class="flex-1 min-w-[300px] m-4 p-6 border border-gray-300">
    <div class="flex flex-col h-full">
      <h3 class="text-lg font-semibold mb-4">カードタイトル</h3>
      <p class="flex-1 text-gray-600">
        カードの内容がここに入ります。長さが異なるとレイアウトが崩れます。
      </p>
      <button class="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
        詳細
      </button>
    </div>
  </div>
</div>
```

**問題**: flex-wrap によりカードサイズが不安定で、ボタンの位置が不揃いになる

<details>
<summary>💡 解答例を表示</summary>

```html
<!-- 修正版：Grid + Tailwind -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
  <div
    class="grid grid-rows-[auto_1fr_auto] min-h-[320px] p-6 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
  >
    <div>
      <h3 class="text-lg font-semibold mb-4 text-gray-900">カードタイトル</h3>
    </div>

    <div class="self-start">
      <p class="text-gray-600 leading-relaxed mb-4">
        カードの内容がここに入ります。長さが異なってもレイアウトが保たれます。
      </p>
    </div>

    <div class="self-end">
      <button
        class="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
      >
        詳細
      </button>
    </div>
  </div>
</div>
```

</details>

### 演習 1-2: レスポンシブギャラリー実装 🔶

以下の要件を満たす Tailwind ギャラリーを実装してください：

- モバイル: 1 列、タブレット: 2-3 列、デスクトップ: 4 列
- 特定のアイテムは 2 倍サイズ（レスポンシブ対応）
- 隙間を埋める配置
- ホバーエフェクト付き

<details>
<summary>💡 解答例を表示</summary>

```html
<!-- レスポンシブギャラリー -->
<div
  class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4"
  style="grid-auto-flow: row dense;"
>
  <!-- 通常アイテム -->
  <div
    class="group aspect-square bg-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
  >
    <img
      src="/api/placeholder/300/300"
      alt="画像1"
      class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
    />
  </div>

  <div
    class="group aspect-square bg-gray-300 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
  >
    <img
      src="/api/placeholder/300/300"
      alt="画像2"
      class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
    />
  </div>

  <!-- 特徴アイテム（レスポンシブ） -->
  <div
    class="group col-span-1 sm:col-span-2 row-span-1 sm:row-span-2 bg-blue-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
  >
    <img
      src="/api/placeholder/600/600"
      alt="特徴画像"
      class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
    />
  </div>

  <div
    class="group aspect-square bg-gray-400 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
  >
    <img
      src="/api/placeholder/300/300"
      alt="画像4"
      class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
    />
  </div>

  <div
    class="group aspect-square bg-gray-500 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
  >
    <img
      src="/api/placeholder/300/300"
      alt="画像5"
      class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
    />
  </div>

  <!-- 縦長アイテム -->
  <div
    class="group row-span-2 bg-green-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
  >
    <img
      src="/api/placeholder/300/600"
      alt="縦長画像"
      class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
    />
  </div>
</div>
```

</details>

### 演習 1-3: 複雑なナビゲーション実装 🔥

以下の要件を満たす Tailwind ナビゲーションを実装してください：

- 可変数のメニューアイテム
- モバイルで横スクロール + スナップ対応
- デスクトップで等幅配置
- アクティブ状態とホバーエフェクト
- ドロップダウンメニュー（サブメニュー）対応

<details>
<summary>💡 解答例を表示</summary>

```html
<!-- 複雑なレスポンシブナビゲーション -->
<nav class="bg-white border-b border-gray-200 shadow-sm">
  <!-- デスクトップ版 -->
  <div class="hidden lg:flex max-w-7xl mx-auto">
    <div class="flex w-full">
      <a
        href="#"
        class="flex-1 max-w-[180px] px-4 py-4 text-center font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all relative group"
      >
        ホーム
        <div
          class="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform"
        ></div>
      </a>

      <!-- ドロップダウンメニュー付き -->
      <div class="flex-1 max-w-[180px] relative group">
        <a
          href="#"
          class="block px-4 py-4 text-center font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all"
        >
          製品・サービス
          <svg
            class="w-4 h-4 inline-block ml-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 9l-7 7-7-7"
            ></path>
          </svg>
        </a>

        <!-- ドロップダウンメニュー -->
        <div
          class="absolute top-full left-0 w-48 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50"
        >
          <a
            href="#"
            class="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600"
            >製品A</a
          >
          <a
            href="#"
            class="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600"
            >製品B</a
          >
          <a
            href="#"
            class="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600"
            >サービス一覧</a
          >
        </div>
      </div>

      <a
        href="#"
        class="flex-1 max-w-[180px] px-4 py-4 text-center font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all relative group"
      >
        会社情報
        <div
          class="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform"
        ></div>
      </a>

      <a
        href="#"
        class="flex-1 max-w-[180px] px-4 py-4 text-center font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors rounded-lg mx-2 my-2"
      >
        お問い合わせ
      </a>
    </div>
  </div>

  <!-- モバイル版：スクロール + スナップ -->
  <div
    class="lg:hidden flex overflow-x-auto snap-x snap-mandatory bg-white scrollbar-hide"
  >
    <a
      href="#"
      class="flex-none min-w-fit px-6 py-4 text-sm font-medium text-blue-600 bg-blue-50 snap-start whitespace-nowrap border-b-2 border-blue-600"
    >
      ホーム
    </a>
    <a
      href="#"
      class="flex-none min-w-fit px-6 py-4 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 snap-start whitespace-nowrap transition-colors"
    >
      製品・サービス
    </a>
    <a
      href="#"
      class="flex-none min-w-fit px-6 py-4 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 snap-start whitespace-nowrap transition-colors"
    >
      会社情報
    </a>
    <a
      href="#"
      class="flex-none min-w-fit px-6 py-4 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 snap-start whitespace-nowrap transition-colors"
    >
      お問い合わせ
    </a>
  </div>
</nav>

<style>
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
</style>
```

</details>

## 📊 Step 1 評価基準

### 理解度チェックリスト

#### Tailwind Flexbox 習得 (30%)

- [ ] Tailwind の flex 関連クラス（flex-1, grow, shrink 等）の違いを理解
- [ ] カードレイアウトの高さ揃え問題を Tailwind で解決できる
- [ ] レスポンシブな Flexbox レイアウトを設計できる
- [ ] mt-auto、self-start 等の配置制御を適切に使える

#### Tailwind Grid 活用 (30%)

- [ ] grid-template-*、grid-cols-*の使い分けができる
- [ ] grid-auto-flow と dense 配置を Tailwind で制御できる
- [ ] レスポンシブグリッドを Tailwind で実装できる
- [ ] 任意値（[]記法）を使った高度な Grid が作れる

#### 実践的問題解決 (25%)

- [ ] 既存の CSS を Tailwind クラスに変換できる
- [ ] コンテナクエリと Tailwind を組み合わせられる
- [ ] JavaScript 連携での Tailwind クラス動的制御ができる
- [ ] レスポンシブ設計を Tailwind で効率的に実装できる

#### デバッグ・最適化 (15%)

- [ ] Tailwind プロジェクトでのデバッグツールを使いこなせる
- [ ] 不要な Tailwind クラスを特定・最適化できる
- [ ] パフォーマンスを意識した Tailwind 設計ができる
- [ ] チームでの Tailwind 運用ルールを理解している

### 成果物チェックリスト

- [ ] **Tailwind カードシステム**: 高さ揃え、レスポンシブ、ホバーエフェクト
- [ ] **Tailwind ギャラリー**: Masonry 風、動的配置、画像最適化
- [ ] **Tailwind ナビゲーション**: 完全レスポンシブ、アクセシビリティ対応
- [ ] **Tailwind デバッグツール**: 効率的な問題特定手法

## 🔄 Step 2 への準備

### 次週学習内容の予習

```html
<!-- Step 2で扱うz-index問題の基礎 -->

<!-- モーダルのスタッキング問題 -->
<div class="fixed inset-0 bg-black bg-opacity-50 z-50">
  <!-- モーダルバックドロップ -->
</div>

<div
  class="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[60]"
>
  <!-- モーダルコンテンツ -->
  <div class="relative">
    <!-- この中にドロップダウンがあると重複問題が発生 -->
    <div class="absolute top-full left-0 z-10">
      <!-- z-10では表示されない場合がある -->
    </div>
  </div>
</div>
```

### 学習継続のコツ

1. **実際のプロジェクトで実践**: 学習した Tailwind パターンを実務で活用
2. **コンポーネント化**: 再利用可能な Tailwind パターンをライブラリ化
3. **設定最適化**: プロジェクトに応じた tailwind.config.js の最適化
4. **チーム標準化**: Tailwind クラスの命名ルール・設計パターンの統一

---

**📌 重要**: Step 1 では Tailwind を使った実務レベルのレイアウト問題解決能力を身につけます。従来の CSS よりも効率的で保守しやすい実装パターンを習得しましょう。

**🌟 次の Step 2 では、z-index とスタッキングコンテキストの複雑な重複問題を Tailwind で解決する手法を学習します！**
