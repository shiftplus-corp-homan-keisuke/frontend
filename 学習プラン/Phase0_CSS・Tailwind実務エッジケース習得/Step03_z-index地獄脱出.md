# Step 2: z-index 地獄脱出

> 💡 **補足資料**: スタッキングコンテキストの深い理解と実践例 🚀
>
> - 📖 [スタッキングコンテキスト完全ガイド](./Step03_補足_スタッキングコンテキスト完全ガイド.md) - z-index の内部動作詳細
> - 🛠️ [Tailwind z-index 実践パターン](./Step03_補足_Tailwind_z-index実践.md) - Tailwind でのレイヤー管理手法
> - ⚙️ [ポータル・テレポート実装](./Step03_補足_ポータル実装ガイド.md) - モーダル・ドロップダウンの根本解決
> - 💻 [z-index デバッグ手法](./Step03_補足_z-indexデバッグ手法.md) - 重複問題の効率的な特定・解決
> - 🚨 [z-index 問題事例集](./Step03_補足_z-index問題事例集.md) - よくある重複パターンと解決法
> - 📚 [参考リソース](./Step03_補足_参考リソース.md) - スタッキング関連ツール・リンク集

## 📅 学習期間・目標

**期間**: Step 3  
**総学習時間**: 2.5 時間  
**学習スタイル**: 問題分析 40% + 解決実践 50% + システム設計 10%

### 🎯 Step 2 到達目標

- [ ] スタッキングコンテキストの仕組みを完全理解し、Tailwind で制御できる
- [ ] モーダル・ドロップダウン・ツールチップの重複問題を根本解決できる
- [ ] Tailwind を使ったレイヤー管理システムを設計・実装できる
- [ ] z-index 問題のデバッグ手法を体系的に実行できる

## 🚨 実務でよくある NG パターン分析

### NG パターン 1: モーダル内ドロップダウンの重複問題

#### 問題のコード例

```html
<!-- ❌ NG: モーダル内のドロップダウンが背景の下に隠れる -->

<!-- ページの通常コンテンツ -->
<div class="relative">
  <!-- この要素がスタッキングコンテキストを作成 -->
  <div class="absolute top-4 right-4 z-50">
    <!-- 高いz-indexを設定したナビゲーション -->
    <nav class="bg-white shadow-lg p-4 rounded-lg">ナビゲーション</nav>
  </div>
</div>

<!-- モーダル -->
<div class="fixed inset-0 bg-black bg-opacity-50 z-40">
  <!-- ↑ z-40でバックドロップ -->
  <div
    class="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-lg p-8"
  >
    <!-- ↑ z-50でモーダルコンテンツ -->

    <h2 class="text-2xl font-bold mb-4">モーダルタイトル</h2>

    <!-- この中のドロップダウンで問題発生 -->
    <div class="relative">
      <button class="px-4 py-2 bg-blue-500 text-white rounded">
        ドロップダウン ▼
      </button>

      <!-- 問題：モーダルのz-50より低い値では表示されない -->
      <div
        class="absolute top-full left-0 mt-1 w-48 bg-white border shadow-lg rounded z-10"
      >
        <!-- ↑ z-10では足りない -->
        <a href="#" class="block px-4 py-2 hover:bg-gray-100">オプション1</a>
        <a href="#" class="block px-4 py-2 hover:bg-gray-100">オプション2</a>
        <a href="#" class="block px-4 py-2 hover:bg-gray-100">オプション3</a>
      </div>
    </div>
  </div>
</div>
```

#### 🔍 問題が発生する理由

1. **スタッキングコンテキストの誤解**: モーダル要素自体が新しいスタッキングコンテキストを作成
2. **相対的 z-index の理解不足**: 同一コンテキスト内での z-index 比較が重要
3. **Tailwind の制限値**: デフォルトの z-index 値（10, 20, 30, 40, 50）では対応できない複雑なケース

#### 💡 解決策：段階的 Tailwind アプローチ

##### ステップ 1: z-index 値の体系的管理

```html
<!-- ✅ STEP1: Tailwind z-indexの拡張と体系的管理 -->

<!-- グローバルz-indexレベル定義（tailwind.config.js） -->
```

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      zIndex: {
        dropdown: "100",
        sticky: "200",
        fixed: "300",
        "modal-backdrop": "400",
        modal: "500",
        popover: "600",
        tooltip: "700",
        notification: "800",
        debug: "9999",
      },
    },
  },
};
```

```html
<!-- 修正されたHTML -->
<!-- ページコンテンツ -->
<div class="relative">
  <div class="absolute top-4 right-4 z-fixed">
    <!-- z-fixed (300) -->
    <nav class="bg-white shadow-lg p-4 rounded-lg">ナビゲーション</nav>
  </div>
</div>

<!-- モーダル -->
<div class="fixed inset-0 bg-black bg-opacity-50 z-modal-backdrop">
  <!-- z-modal-backdrop (400) -->
  <div
    class="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-modal bg-white rounded-lg p-8"
  >
    <!-- z-modal (500) -->

    <h2 class="text-2xl font-bold mb-4">モーダルタイトル</h2>

    <!-- ドロップダウンが正しく表示される -->
    <div class="relative">
      <button
        class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
      >
        ドロップダウン ▼
      </button>

      <!-- z-popover (600) でモーダルより前面に表示 -->
      <div
        class="absolute top-full left-0 mt-1 w-48 bg-white border shadow-lg rounded z-popover opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200"
      >
        <a href="#" class="block px-4 py-2 hover:bg-gray-100 transition-colors"
          >オプション1</a
        >
        <a href="#" class="block px-4 py-2 hover:bg-gray-100 transition-colors"
          >オプション2</a
        >
        <a href="#" class="block px-4 py-2 hover:bg-gray-100 transition-colors"
          >オプション3</a
        >
      </div>
    </div>
  </div>
</div>
```

##### ステップ 2: ポータルパターンの実装（根本解決）

```html
<!-- ✅ STEP2: React Portal風のTailwind + JavaScript実装 -->

<!-- モーダル本体：z-index問題を回避 -->
<div
  class="fixed inset-0 bg-black bg-opacity-50 z-modal-backdrop"
  id="modal-backdrop"
>
  <div
    class="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-modal bg-white rounded-lg p-8 max-w-md w-full mx-4"
  >
    <h2 class="text-2xl font-bold mb-4">モーダルタイトル</h2>

    <!-- ドロップダウンボタン：ポータル対象 -->
    <div class="relative">
      <button
        id="portal-dropdown-trigger"
        class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        data-dropdown-target="portal-dropdown"
      >
        ドロップダウン ▼
      </button>
    </div>

    <div class="mt-6 flex justify-end space-x-3">
      <button
        class="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
      >
        キャンセル
      </button>
      <button
        class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
      >
        実行
      </button>
    </div>
  </div>
</div>

<!-- ポータルコンテナ：bodyの直下に配置 -->
<div id="portal-container" class="fixed inset-0 pointer-events-none z-popover">
  <!-- ドロップダウンがここに動的に配置される -->
</div>

<script>
  // ポータルドロップダウンの実装
  class PortalDropdown {
    constructor(triggerId, dropdownId) {
      this.trigger = document.getElementById(triggerId);
      this.dropdownId = dropdownId;
      this.portal = document.getElementById("portal-container");
      this.dropdown = null;
      this.isOpen = false;

      this.init();
    }

    init() {
      this.trigger.addEventListener("click", (e) => {
        e.stopPropagation();
        this.toggle();
      });

      document.addEventListener("click", (e) => {
        if (this.isOpen && !this.dropdown?.contains(e.target)) {
          this.close();
        }
      });
    }

    toggle() {
      this.isOpen ? this.close() : this.open();
    }

    open() {
      if (this.dropdown) {
        this.dropdown.remove();
      }

      // トリガーの位置を取得
      const rect = this.trigger.getBoundingClientRect();

      // ドロップダウン要素を作成
      this.dropdown = document.createElement("div");
      this.dropdown.className =
        "absolute bg-white border shadow-lg rounded-lg min-w-48 pointer-events-auto transform transition-all duration-200 opacity-0 scale-95";
      this.dropdown.style.left = `${rect.left}px`;
      this.dropdown.style.top = `${rect.bottom + 4}px`;

      // コンテンツを追加
      this.dropdown.innerHTML = `
      <a href="#" class="block px-4 py-2 hover:bg-gray-100 transition-colors rounded-t-lg">オプション1</a>
      <a href="#" class="block px-4 py-2 hover:bg-gray-100 transition-colors">オプション2</a>
      <a href="#" class="block px-4 py-2 hover:bg-gray-100 transition-colors rounded-b-lg">オプション3</a>
    `;

      // ポータルに追加
      this.portal.appendChild(this.dropdown);

      // アニメーション
      requestAnimationFrame(() => {
        this.dropdown.classList.remove("opacity-0", "scale-95");
        this.dropdown.classList.add("opacity-100", "scale-100");
      });

      this.isOpen = true;
    }

    close() {
      if (this.dropdown) {
        this.dropdown.classList.add("opacity-0", "scale-95");
        this.dropdown.classList.remove("opacity-100", "scale-100");

        setTimeout(() => {
          this.dropdown?.remove();
          this.dropdown = null;
        }, 200);
      }
      this.isOpen = false;
    }
  }

  // 初期化
  document.addEventListener("DOMContentLoaded", () => {
    new PortalDropdown("portal-dropdown-trigger", "portal-dropdown");
  });
</script>
```

##### ステップ 3: CSS 変数によるスタッキング管理（大規模対応）

```html
<!-- ✅ STEP3: CSS変数 + Tailwind での動的z-index管理 -->

<style>
  :root {
    /* レイヤーレベルの定義 */
    --z-base: 0;
    --z-dropdown: 100;
    --z-sticky: 200;
    --z-fixed: 300;
    --z-modal-backdrop: 400;
    --z-modal: 500;
    --z-popover: 600;
    --z-tooltip: 700;
    --z-notification: 800;

    /* 動的z-indexスタック */
    --z-stack-modal: var(--z-modal);
    --z-stack-popover: var(--z-popover);
  }

  /* 動的z-indexクラス */
  .z-stack-modal {
    z-index: var(--z-stack-modal);
  }

  .z-stack-popover {
    z-index: var(--z-stack-popover);
  }

  /* レイヤー管理のためのユーティリティ */
  .layer-modal {
    --z-stack-modal: calc(var(--z-modal) + var(--modal-index, 0) * 100);
    --z-stack-popover: calc(var(--z-popover) + var(--modal-index, 0) * 100);
  }

  .layer-increment {
    --modal-index: 1;
  }
</style>

<!-- 実装例：複数モーダルの重複管理 -->
<div
  class="fixed inset-0 bg-black bg-opacity-50"
  style="z-index: var(--z-modal-backdrop)"
>
  <!-- 第1モーダル -->
  <div
    class="layer-modal fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-stack-modal bg-white rounded-lg p-8"
  >
    <h2 class="text-xl font-bold mb-4">第1モーダル</h2>

    <!-- 第2モーダルを開くボタン -->
    <button
      onclick="openSecondModal()"
      class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
    >
      第2モーダルを開く
    </button>

    <!-- このモーダルのドロップダウン -->
    <div class="relative mt-4">
      <button
        class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
      >
        ドロップダウン ▼
      </button>
      <div
        class="absolute top-full left-0 mt-1 w-48 bg-white border shadow-lg rounded z-stack-popover opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all"
      >
        <a href="#" class="block px-4 py-2 hover:bg-gray-100">オプション1</a>
        <a href="#" class="block px-4 py-2 hover:bg-gray-100">オプション2</a>
      </div>
    </div>
  </div>
</div>

<!-- 第2モーダル（より高いレイヤー） -->
<div
  id="second-modal"
  class="hidden fixed inset-0 bg-black bg-opacity-50"
  style="z-index: calc(var(--z-modal-backdrop) + 100)"
>
  <div
    class="layer-modal layer-increment fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-stack-modal bg-white rounded-lg p-8"
  >
    <!-- layer-increment で --modal-index: 1 が適用され、z-indexが自動的に上がる -->
    <h2 class="text-xl font-bold mb-4">第2モーダル</h2>

    <!-- このモーダルのドロップダウンも正しく表示される -->
    <div class="relative">
      <button
        class="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors"
      >
        第2モーダルのドロップダウン ▼
      </button>
      <div
        class="absolute top-full left-0 mt-1 w-48 bg-white border shadow-lg rounded z-stack-popover"
      >
        <!-- z-stack-popover が自動的に適切な値になる -->
        <a href="#" class="block px-4 py-2 hover:bg-gray-100"
          >第2のオプション1</a
        >
        <a href="#" class="block px-4 py-2 hover:bg-gray-100"
          >第2のオプション2</a
        >
      </div>
    </div>
  </div>
</div>

<script>
  function openSecondModal() {
    document.getElementById("second-modal").classList.remove("hidden");
  }
</script>
```

### NG パターン 2: ツールチップとモーダルの競合

#### 問題のコード例

```html
<!-- ❌ NG: ツールチップがモーダル背景の下に隠れる -->
<div class="relative p-8">
  <!-- ツールチップ付きボタン -->
  <div class="group relative inline-block">
    <button
      class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
    >
      ヘルプ
    </button>

    <!-- 問題：このツールチップがモーダル表示時に隠れる -->
    <div
      class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-sm rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50"
    >
      <!-- ↑ z-50でも足りない場合がある -->
      ヘルプメッセージがここに表示されます
      <div
        class="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"
      ></div>
    </div>
  </div>
</div>

<!-- モーダルが開くとツールチップが見えなくなる -->
<div class="fixed inset-0 bg-black bg-opacity-50 z-40">
  <div
    class="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-lg p-8"
  >
    モーダルコンテンツ
  </div>
</div>
```

#### 💡 解決策：ツールチップ専用ポータル

```html
<!-- ✅ 解決策: ツールチップポータルシステム -->

<!-- ツールチップトリガー -->
<div class="relative p-8">
  <div class="inline-block">
    <button
      class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
      data-tooltip="ヘルプメッセージがここに表示されます。長いテキストでも適切に表示されます。"
      data-tooltip-position="top"
    >
      ヘルプ
    </button>
  </div>

  <div class="inline-block ml-4">
    <button
      class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
      data-tooltip="右側に表示されるツールチップ"
      data-tooltip-position="right"
    >
      情報
    </button>
  </div>
</div>

<!-- ツールチップポータル：常に最前面 -->
<div id="tooltip-portal" class="fixed inset-0 pointer-events-none z-tooltip">
  <!-- ツールチップがここに動的配置される -->
</div>

<!-- モーダル（ツールチップより低いz-index） -->
<div class="fixed inset-0 bg-black bg-opacity-50 z-modal-backdrop">
  <div
    class="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-modal bg-white rounded-lg p-8"
  >
    <h2 class="text-xl font-bold mb-4">モーダル</h2>

    <!-- モーダル内でもツールチップが正常動作 -->
    <button
      class="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors"
      data-tooltip="モーダル内のツールチップも正常に表示されます"
      data-tooltip-position="bottom"
    >
      モーダル内ボタン
    </button>
  </div>
</div>

<script>
  class TooltipPortal {
    constructor() {
      this.portal = document.getElementById("tooltip-portal");
      this.currentTooltip = null;
      this.showDelay = 500;
      this.hideDelay = 100;
      this.showTimer = null;
      this.hideTimer = null;

      this.init();
    }

    init() {
      // すべてのツールチップトリガーにイベントリスナーを追加
      document.addEventListener(
        "mouseenter",
        (e) => {
          const tooltip = e.target.getAttribute("data-tooltip");
          if (tooltip) {
            this.scheduleShow(e.target, tooltip);
          }
        },
        true
      );

      document.addEventListener(
        "mouseleave",
        (e) => {
          if (e.target.hasAttribute("data-tooltip")) {
            this.scheduleHide();
          }
        },
        true
      );

      // ツールチップ自体のホバーでは非表示にしない
      this.portal.addEventListener("mouseenter", () => {
        this.cancelHide();
      });

      this.portal.addEventListener("mouseleave", () => {
        this.scheduleHide();
      });
    }

    scheduleShow(trigger, text) {
      this.cancelHide();

      this.showTimer = setTimeout(() => {
        this.show(trigger, text);
      }, this.showDelay);
    }

    scheduleHide() {
      this.cancelShow();

      this.hideTimer = setTimeout(() => {
        this.hide();
      }, this.hideDelay);
    }

    cancelShow() {
      if (this.showTimer) {
        clearTimeout(this.showTimer);
        this.showTimer = null;
      }
    }

    cancelHide() {
      if (this.hideTimer) {
        clearTimeout(this.hideTimer);
        this.hideTimer = null;
      }
    }

    show(trigger, text) {
      this.hide(); // 既存のツールチップをクリア

      const position = trigger.getAttribute("data-tooltip-position") || "top";
      const rect = trigger.getBoundingClientRect();

      // ツールチップ要素を作成
      this.currentTooltip = document.createElement("div");
      this.currentTooltip.className =
        "absolute px-3 py-2 bg-gray-800 text-white text-sm rounded shadow-lg pointer-events-auto max-w-xs opacity-0 scale-95 transition-all duration-200";
      this.currentTooltip.textContent = text;

      // 位置計算
      const positions = this.calculatePosition(rect, position);
      this.currentTooltip.style.left = `${positions.left}px`;
      this.currentTooltip.style.top = `${positions.top}px`;

      // 矢印を追加
      const arrow = this.createArrow(position);
      this.currentTooltip.appendChild(arrow);

      // ポータルに追加
      this.portal.appendChild(this.currentTooltip);

      // アニメーション
      requestAnimationFrame(() => {
        this.currentTooltip.classList.remove("opacity-0", "scale-95");
        this.currentTooltip.classList.add("opacity-100", "scale-100");
      });
    }

    hide() {
      if (this.currentTooltip) {
        this.currentTooltip.classList.add("opacity-0", "scale-95");
        this.currentTooltip.classList.remove("opacity-100", "scale-100");

        setTimeout(() => {
          this.currentTooltip?.remove();
          this.currentTooltip = null;
        }, 200);
      }
    }

    calculatePosition(triggerRect, position) {
      const spacing = 8;
      let left, top;

      switch (position) {
        case "top":
          left = triggerRect.left + triggerRect.width / 2;
          top = triggerRect.top - spacing;
          break;
        case "bottom":
          left = triggerRect.left + triggerRect.width / 2;
          top = triggerRect.bottom + spacing;
          break;
        case "left":
          left = triggerRect.left - spacing;
          top = triggerRect.top + triggerRect.height / 2;
          break;
        case "right":
          left = triggerRect.right + spacing;
          top = triggerRect.top + triggerRect.height / 2;
          break;
        default:
          left = triggerRect.left + triggerRect.width / 2;
          top = triggerRect.top - spacing;
      }

      return { left, top };
    }

    createArrow(position) {
      const arrow = document.createElement("div");
      arrow.className = "absolute w-0 h-0";

      const arrowClasses = {
        top: "top-full left-1/2 transform -translate-x-1/2 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800",
        bottom:
          "bottom-full left-1/2 transform -translate-x-1/2 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-800",
        left: "left-full top-1/2 transform -translate-y-1/2 border-t-4 border-b-4 border-l-4 border-transparent border-l-gray-800",
        right:
          "right-full top-1/2 transform -translate-y-1/2 border-t-4 border-b-4 border-r-4 border-transparent border-r-gray-800",
      };

      arrow.className += ` ${arrowClasses[position] || arrowClasses.top}`;
      return arrow;
    }
  }

  // 初期化
  document.addEventListener("DOMContentLoaded", () => {
    new TooltipPortal();
  });
</script>
```

### NG パターン 3: 通知・アラート・モーダルの競合

#### 問題のコード例

```html
<!-- ❌ NG: 通知がモーダルの下に隠れる -->
<div class="fixed top-4 right-4 z-50">
  <!-- 通知コンテナ -->
  <div class="bg-green-500 text-white p-4 rounded-lg shadow-lg">
    <!-- z-50でも足りない場合がある -->
    保存が完了しました
  </div>
</div>

<!-- モーダルが表示されると通知が見えなくなる -->
<div class="fixed inset-0 bg-black bg-opacity-50 z-50">
  <div
    class="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[60] bg-white rounded-lg p-8"
  >
    <!-- z-[60]で強制的に前面に -->
    モーダルコンテンツ
  </div>
</div>
```

#### 💡 解決策：グローバル通知システム

```html
<!-- ✅ 解決策: レイヤー管理された通知システム -->

<!-- 通知ポータル：最高レベルのz-index -->
<div
  id="notification-portal"
  class="fixed inset-0 pointer-events-none z-notification"
>
  <div class="absolute top-4 right-4 space-y-3">
    <!-- 通知がここに動的に追加される -->
  </div>
</div>

<!-- 例：成功通知をトリガー -->
<button
  onclick="showNotification('success', '保存が完了しました')"
  class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
>
  保存
</button>

<!-- 例：エラー通知をトリガー -->
<button
  onclick="showNotification('error', 'エラーが発生しました')"
  class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors ml-2"
>
  エラー
</button>

<!-- モーダル（通知より低いz-index） -->
<div class="fixed inset-0 bg-black bg-opacity-50 z-modal-backdrop">
  <div
    class="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-modal bg-white rounded-lg p-8"
  >
    <h2 class="text-xl font-bold mb-4">モーダル</h2>

    <!-- モーダル内からも通知を表示可能 -->
    <button
      onclick="showNotification('info', 'モーダル内からの通知')"
      class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
    >
      モーダル内通知
    </button>
  </div>
</div>

<script>
  class NotificationSystem {
    constructor() {
      this.portal = document.getElementById("notification-portal");
      this.container = this.portal.querySelector(".absolute");
      this.notifications = new Map(); // 通知の管理
      this.idCounter = 0;
    }

    show(type, message, options = {}) {
      const id = ++this.idCounter;
      const duration = options.duration || 5000;
      const persistent = options.persistent || false;

      // 通知要素を作成
      const notification = this.createElement(type, message, id, persistent);

      // コンテナに追加
      this.container.appendChild(notification);
      this.notifications.set(id, notification);

      // エントランスアニメーション
      requestAnimationFrame(() => {
        notification.classList.remove("opacity-0", "translate-x-full");
        notification.classList.add("opacity-100", "translate-x-0");
      });

      // 自動削除（persistentでない場合）
      if (!persistent) {
        setTimeout(() => {
          this.remove(id);
        }, duration);
      }

      return id;
    }

    createElement(type, message, id, persistent) {
      const notification = document.createElement("div");
      notification.className =
        "relative flex items-center p-4 rounded-lg shadow-lg pointer-events-auto transform transition-all duration-300 opacity-0 translate-x-full";

      // タイプ別のスタイル
      const typeStyles = {
        success: "bg-green-500 text-white",
        error: "bg-red-500 text-white",
        warning: "bg-yellow-500 text-gray-900",
        info: "bg-blue-500 text-white",
      };

      notification.className += ` ${typeStyles[type] || typeStyles.info}`;

      // アイコン
      const icons = {
        success: "✓",
        error: "✕",
        warning: "⚠",
        info: "ℹ",
      };

      notification.innerHTML = `
      <div class="flex items-center">
        <span class="text-lg mr-3">${icons[type] || icons.info}</span>
        <span class="flex-1">${message}</span>
        ${
          !persistent
            ? ""
            : `
          <button 
            onclick="notificationSystem.remove(${id})"
            class="ml-3 text-lg hover:bg-black hover:bg-opacity-20 rounded p-1 transition-colors"
          >
            ✕
          </button>
        `
        }
      </div>
    `;

      return notification;
    }

    remove(id) {
      const notification = this.notifications.get(id);
      if (notification) {
        notification.classList.add("opacity-0", "translate-x-full");
        notification.classList.remove("opacity-100", "translate-x-0");

        setTimeout(() => {
          notification.remove();
          this.notifications.delete(id);
        }, 300);
      }
    }

    clear() {
      this.notifications.forEach((_, id) => {
        this.remove(id);
      });
    }
  }

  // グローバルインスタンス
  const notificationSystem = new NotificationSystem();

  // ヘルパー関数
  function showNotification(type, message, options) {
    return notificationSystem.show(type, message, options);
  }

  // 使用例
  function saveData() {
    // 保存処理...
    showNotification("success", "データが保存されました");
  }

  function deleteData() {
    // 削除確認
    const id = showNotification("warning", "本当に削除しますか？", {
      persistent: true,
      duration: 0,
    });

    // 5秒後に自動削除
    setTimeout(() => {
      notificationSystem.remove(id);
    }, 5000);
  }
</script>
```

## 🛠️ z-index 問題のデバッグ手法

### 1. スタッキングコンテキスト可視化ツール

```javascript
// スタッキングコンテキストの可視化
function debugStackingContext() {
  const elements = document.querySelectorAll("*");
  const stackingElements = [];

  elements.forEach((el) => {
    const style = getComputedStyle(el);
    const createsContext =
      style.position !== "static" ||
      style.zIndex !== "auto" ||
      parseFloat(style.opacity) < 1 ||
      style.transform !== "none" ||
      style.filter !== "none" ||
      style.isolation === "isolate";

    if (createsContext) {
      stackingElements.push({
        element: el,
        zIndex: style.zIndex,
        position: style.position,
        transform: style.transform,
        opacity: style.opacity,
      });
    }
  });

  console.table(stackingElements);

  // 視覚的なハイライト
  stackingElements.forEach(({ element }, index) => {
    element.style.outline = `3px solid hsl(${index * 30}, 70%, 50%)`;
    element.style.outlineOffset = "2px";

    // ラベルを追加
    const label = document.createElement("div");
    label.textContent = `SC-${index}`;
    label.style.cssText = `
      position: absolute;
      top: -20px;
      left: 0;
      background: hsl(${index * 30}, 70%, 50%);
      color: white;
      padding: 2px 6px;
      font-size: 12px;
      border-radius: 3px;
      z-index: 10000;
    `;
    element.style.position = "relative";
    element.appendChild(label);
  });
}

// デバッグクリア
function clearStackingDebug() {
  document.querySelectorAll("*").forEach((el) => {
    el.style.outline = "";
    el.style.outlineOffset = "";
    const label = el.querySelector("[data-stacking-label]");
    if (label) label.remove();
  });
}

// 使用方法
console.log("🔍 スタッキングコンテキストをデバッグ:");
debugStackingContext();

// 3秒後にクリア
setTimeout(clearStackingDebug, 3000);
```

### 2. z-index 値の最適化提案

```javascript
// z-index最適化の提案
function optimizeZIndex() {
  const elements = Array.from(document.querySelectorAll("*"))
    .map((el) => ({
      element: el,
      zIndex: getComputedStyle(el).zIndex,
      className: el.className,
    }))
    .filter(({ zIndex }) => zIndex !== "auto" && zIndex !== "0")
    .sort((a, b) => parseInt(a.zIndex) - parseInt(b.zIndex));

  console.group("🎯 Z-Index最適化提案");

  const suggestions = {
    dropdown: 100,
    sticky: 200,
    fixed: 300,
    modalBackdrop: 400,
    modal: 500,
    popover: 600,
    tooltip: 700,
    notification: 800,
  };

  console.log("📋 推奨z-index値:");
  console.table(suggestions);

  console.log("📊 現在の使用状況:");
  elements.forEach(({ element, zIndex, className }) => {
    const current = parseInt(zIndex);
    let suggestion = "";

    if (className.includes("modal")) {
      suggestion = current > 600 ? "⚠️ 高すぎ" : "✅ 適切";
    } else if (className.includes("dropdown")) {
      suggestion = current > 200 ? "⚠️ 高すぎ" : "✅ 適切";
    } else if (current > 1000) {
      suggestion = "🚨 異常に高い";
    }

    console.log(`${zIndex}: ${className} ${suggestion}`);
  });

  console.groupEnd();
}
```

## ✅ Tailwind z-index 管理システムのベストプラクティス

### パターン 1: レイヤーシステムの完全版

```javascript
// tailwind.config.js の完全版設定
module.exports = {
  theme: {
    extend: {
      zIndex: {
        // 基本レイヤー
        base: "0",
        dropdown: "100",
        sticky: "200",
        fixed: "300",

        // モーダル系
        "modal-backdrop": "400",
        modal: "500",
        "modal-nested": "600",

        // オーバーレイ系
        popover: "700",
        tooltip: "800",
        notification: "900",

        // デバッグ・開発ツール
        debug: "9998",
        "dev-tools": "9999",
      },

      // z-indexのバリエーション
      spacing: {
        z: {
          "modal-1": "500",
          "modal-2": "600",
          "modal-3": "700",
        },
      },
    },
  },

  // カスタムユーティリティ
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        ".z-layer-modal": {
          "z-index": "var(--z-modal, 500)",
        },
        ".z-layer-popover": {
          "z-index": "var(--z-popover, 700)",
        },
        ".z-layer-tooltip": {
          "z-index": "var(--z-tooltip, 800)",
        },
      };
      addUtilities(newUtilities);
    },
  ],
};
```

### パターン 2: コンポーネント指向レイヤー管理

```html
<!-- レイヤー管理コンポーネント -->
<div class="layer-manager">
  <!-- ベースレイヤー：通常のコンテンツ -->
  <div class="layer-base z-base">
    <main class="p-8">
      <h1 class="text-2xl font-bold mb-4">メインコンテンツ</h1>

      <!-- ドロップダウン付きナビゲーション -->
      <nav class="relative">
        <div class="group">
          <button
            class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            メニュー ▼
          </button>
          <div
            class="absolute top-full left-0 mt-1 w-48 bg-white border shadow-lg rounded z-dropdown opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all"
          >
            <a href="#" class="block px-4 py-2 hover:bg-gray-100">項目1</a>
            <a href="#" class="block px-4 py-2 hover:bg-gray-100">項目2</a>
          </div>
        </div>
      </nav>
    </main>
  </div>

  <!-- 固定レイヤー：ヘッダー・フッター -->
  <div class="layer-fixed z-fixed">
    <header class="fixed top-0 left-0 right-0 bg-white border-b shadow-sm p-4">
      <div class="flex justify-between items-center">
        <h1 class="font-bold text-xl">サイトタイトル</h1>
        <button class="p-2 hover:bg-gray-100 rounded">🔔</button>
      </div>
    </header>
  </div>

  <!-- モーダルレイヤー -->
  <div class="layer-modal">
    <!-- 複数モーダル対応 -->
    <div id="modal-1" class="modal-container z-modal-backdrop">
      <div class="modal-content z-modal">
        <!-- モーダル1の内容 -->
      </div>
    </div>

    <div id="modal-2" class="modal-container z-modal-nested">
      <div class="modal-content">
        <!-- 入れ子モーダルの内容 -->
      </div>
    </div>
  </div>

  <!-- 通知レイヤー：最上位 -->
  <div class="layer-notification z-notification">
    <div id="notification-container" class="fixed top-4 right-4 space-y-3">
      <!-- 通知がここに表示 -->
    </div>
  </div>
</div>

<style>
  /* レイヤー管理のCSS変数 */
  .layer-manager {
    --z-base: 0;
    --z-dropdown: 100;
    --z-sticky: 200;
    --z-fixed: 300;
    --z-modal-backdrop: 400;
    --z-modal: 500;
    --z-modal-nested: 600;
    --z-popover: 700;
    --z-tooltip: 800;
    --z-notification: 900;
  }

  /* モーダルの入れ子対応 */
  .modal-container.active {
    --z-modal-backdrop: calc(
      var(--z-modal-backdrop) + var(--modal-level, 0) * 100
    );
    --z-modal: calc(var(--z-modal) + var(--modal-level, 0) * 100);
  }

  .modal-container[data-level="1"] {
    --modal-level: 1;
  }

  .modal-container[data-level="2"] {
    --modal-level: 2;
  }
</style>
```

## 🎯 実践演習

### 演習 2-1: z-index 競合修正チャレンジ 🔰

以下の z-index 競合を修正してください：

```html
<!-- バグを含むコード -->
<div class="fixed top-0 left-0 right-0 bg-white shadow z-50">ヘッダー</div>
<div class="fixed bottom-4 right-4 bg-blue-500 text-white p-4 rounded z-40">
  通知
</div>
<div class="fixed inset-0 bg-black bg-opacity-50 z-30">
  <div
    class="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded z-40"
  >
    <div class="relative">
      <button>ドロップダウン</button>
      <div class="absolute top-full left-0 bg-white border shadow z-10">
        メニュー
      </div>
    </div>
  </div>
</div>
```

**問題**: 通知・ドロップダウンが適切に表示されない

<details>
<summary>💡 解答例を表示</summary>

```html
<!-- 修正版：体系的z-index管理 -->
<div class="fixed top-0 left-0 right-0 bg-white shadow z-fixed">ヘッダー</div>

<div class="fixed inset-0 bg-black bg-opacity-50 z-modal-backdrop">
  <div
    class="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded z-modal"
  >
    <div class="relative">
      <button>ドロップダウン</button>
      <div class="absolute top-full left-0 bg-white border shadow z-popover">
        メニュー
      </div>
    </div>
  </div>
</div>

<div
  class="fixed bottom-4 right-4 bg-blue-500 text-white p-4 rounded z-notification"
>
  通知
</div>

<!-- tailwind.config.js -->
<!-- 
zIndex: {
  'fixed': '300',
  'modal-backdrop': '400', 
  'modal': '500',
  'popover': '600',
  'notification': '800'
}
-->
```

</details>

### 演習 2-2: ポータルドロップダウン実装 🔶

モーダル内で正常動作するドロップダウンをポータルパターンで実装してください。

<details>
<summary>💡 解答例を表示</summary>

```html
<!-- ポータルドロップダウンの完全実装 -->
<div class="modal z-modal">
  <button id="portal-trigger" class="px-4 py-2 bg-blue-500 text-white rounded">
    ドロップダウン ▼
  </button>
</div>

<div
  id="dropdown-portal"
  class="fixed inset-0 pointer-events-none z-popover"
></div>

<script>
  class PortalDropdown {
    constructor(triggerId, portalId) {
      this.trigger = document.getElementById(triggerId);
      this.portal = document.getElementById(portalId);
      this.dropdown = null;
      this.isOpen = false;
      this.init();
    }

    init() {
      this.trigger.addEventListener("click", () => this.toggle());
      document.addEventListener("click", (e) => {
        if (
          !this.trigger.contains(e.target) &&
          !this.dropdown?.contains(e.target)
        ) {
          this.close();
        }
      });
    }

    toggle() {
      this.isOpen ? this.close() : this.open();
    }

    open() {
      const rect = this.trigger.getBoundingClientRect();

      this.dropdown = document.createElement("div");
      this.dropdown.className =
        "absolute bg-white border shadow-lg rounded pointer-events-auto";
      this.dropdown.style.left = `${rect.left}px`;
      this.dropdown.style.top = `${rect.bottom + 4}px`;

      this.dropdown.innerHTML = `
      <a href="#" class="block px-4 py-2 hover:bg-gray-100">オプション1</a>
      <a href="#" class="block px-4 py-2 hover:bg-gray-100">オプション2</a>
    `;

      this.portal.appendChild(this.dropdown);
      this.isOpen = true;
    }

    close() {
      if (this.dropdown) {
        this.dropdown.remove();
        this.dropdown = null;
      }
      this.isOpen = false;
    }
  }

  new PortalDropdown("portal-trigger", "dropdown-portal");
</script>
```

</details>

### 演習 2-3: 複数モーダル管理システム 🔥

入れ子モーダルに対応した完全なレイヤー管理システムを実装してください。

<details>
<summary>💡 解答例を表示</summary>

```html
<!-- 複数モーダル管理システム -->
<div id="modal-manager" class="modal-manager">
  <!-- モーダルスタック表示エリア -->
</div>

<script>
  class ModalManager {
    constructor() {
      this.container = document.getElementById("modal-manager");
      this.modals = [];
      this.baseZIndex = 400;
    }

    open(content, options = {}) {
      const level = this.modals.length;
      const zIndex = this.baseZIndex + level * 100;

      const modal = this.createElement(content, zIndex, level);
      this.container.appendChild(modal);
      this.modals.push(modal);

      return {
        close: () => this.close(modal),
        level: level,
      };
    }

    createElement(content, zIndex, level) {
      const backdrop = document.createElement("div");
      backdrop.className =
        "fixed inset-0 bg-black transition-opacity duration-300";
      backdrop.style.backgroundColor = `rgba(0, 0, 0, ${0.3 + level * 0.1})`;
      backdrop.style.zIndex = zIndex;

      const modal = document.createElement("div");
      modal.className =
        "fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-8 transition-all duration-300";
      modal.style.zIndex = zIndex + 50;
      modal.innerHTML = content;

      backdrop.appendChild(modal);
      return backdrop;
    }

    close(modal) {
      const index = this.modals.indexOf(modal);
      if (index > -1) {
        modal.remove();
        this.modals.splice(index, 1);
      }
    }

    closeAll() {
      this.modals.forEach((modal) => modal.remove());
      this.modals = [];
    }
  }

  const modalManager = new ModalManager();

  // 使用例
  function openModal1() {
    modalManager.open(`
    <h2 class="text-xl font-bold mb-4">第1モーダル</h2>
    <button onclick="openModal2()" class="px-4 py-2 bg-blue-500 text-white rounded">
      第2モーダルを開く
    </button>
  `);
  }

  function openModal2() {
    modalManager.open(`
    <h2 class="text-xl font-bold mb-4">第2モーダル</h2>
    <p>入れ子モーダルです</p>
  `);
  }
</script>
```

</details>

## 📊 Step 2 評価基準

### 理解度チェックリスト

#### スタッキングコンテキスト理解 (35%)

- [ ] スタッキングコンテキストを作成する条件を全て理解している
- [ ] z-index の相対的な比較ルールを正確に説明できる
- [ ] transform、opacity 等の副作用を予測できる
- [ ] Tailwind でのスタッキング制御を適切に実装できる

#### 実践的問題解決 (40%)

- [ ] モーダル・ドロップダウンの重複問題を根本解決できる
- [ ] ポータルパターンを Tailwind + JS で実装できる
- [ ] 複数モーダルのレイヤー管理システムを設計できる
- [ ] 通知・ツールチップの優先度制御ができる

#### システム設計力 (25%)

- [ ] プロジェクト全体の z-index 戦略を設計できる
- [ ] Tailwind 設定での体系的なレイヤー管理ができる
- [ ] CSS 変数による動的 z-index 制御を実装できる
- [ ] デバッグツールで z-index 問題を効率的に解決できる

### 成果物チェックリスト

- [ ] **Tailwind z-index 管理システム**: 体系的なレイヤー設計
- [ ] **ポータルコンポーネント**: モーダル・ドロップダウン・ツールチップ
- [ ] **複数モーダル管理**: 入れ子・重複に対応したシステム
- [ ] **デバッグツール**: z-index 問題の可視化・最適化ツール

## 🔄 Step 3 への準備

### 次週学習内容の予習

```html
<!-- Step 3で扱うレスポンシブ問題の基礎 -->

<!-- 100vh問題：モバイルブラウザのアドレスバー -->
<div class="h-screen">
  <!-- iOSで問題：アドレスバー分短くなる -->
</div>

<!-- アスペクト比維持の課題 -->
<div class="aspect-video">
  <!-- 古いブラウザ対応、動的コンテンツ対応 -->
</div>

<!-- clamp()の複雑な使い方 -->
<div class="text-[clamp(1rem,4vw,2rem)]">
  <!-- フルードタイポグラフィの実装 -->
</div>
```

### 学習継続のコツ

1. **実際の問題で検証**: 実務で発生した z-index 問題をパターン化
2. **レイヤー設計の標準化**: チーム・プロジェクトでの一貫した z-index 戦略
3. **ツール活用**: ブラウザ DevTools でのスタッキング可視化
4. **ライブラリ対応**: 既存 UI ライブラリとの共存方法

---

**📌 重要**: Step 2 では z-index とスタッキングコンテキストの完全理解により、レイヤー重複問題を根本から解決する能力を身につけます。Tailwind を活用した体系的なレイヤー管理で、保守しやすい UI 実装を実現しましょう。

**🌟 次の Step 3 では、レスポンシブ設計で陥りがちな落とし穴（100vh 問題、アスペクト比等）を Tailwind で解決する手法を学習します！**
