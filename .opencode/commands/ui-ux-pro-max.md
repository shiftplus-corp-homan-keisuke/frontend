---
description: 50+スタイル、95+パレット、包括的UI/UXガイドを持つAIデザインシステム
---

**UI/UX PRO MAX** モードで包括的なデザインガイダンスを提供する。

## Task
$ARGUMENTS

## Overview

このワークフローは以下のデザイン DB にアクセスする:
- 50+ UI styles (minimalism, glassmorphism, brutalism など)
- 97 色パレット（プロダクト種別ごと）
- 57 フォントペア（Google Fonts）
- 99 UX ガイドライン
- 25 チャート種別
- 9 技術スタック対応

---

## Step 1: ユーザー要件分析

依頼から以下を抽出:

- **Product type**: SaaS, e-commerce, portfolio, dashboard, landing page など
- **Style keywords**: minimal, playful, professional, elegant, dark mode など
- **Industry**: healthcare, fintech, gaming, education など
- **Stack**: React/Vue/Next.js など。未指定なら `html-tailwind`

---

## Step 2: デザインシステム生成 (REQUIRED)

**必ず最初に包括的なデザインシステムを生成する**

UI/UX 検索スクリプトを実行:

```bash
!`python3 .agent/.shared/ui-ux-pro-max/scripts/search.py "$ARGUMENTS" --design-system -p "Project" 2>&1`
```

**動作:**
1. 5 ドメインを並列検索 (product/style/color/landing/typography)
2. 推論ルールで最適案を選択
3. pattern/style/colors/typography/effects を出力
4. anti-patterns も提示

**Example:**
```bash
python3 .agent/.shared/ui-ux-pro-max/scripts/search.py "beauty spa wellness" --design-system -p "Serenity Spa"
```

---

## Step 2b: デザインシステム保存 (Optional)

`--persist` を付ける:

```bash
!`python3 .agent/.shared/ui-ux-pro-max/scripts/search.py "$ARGUMENTS" --design-system --persist -p "Project Name" 2>&1`
```

生成されるもの:
- `design-system/MASTER.md`
- `design-system/pages/`

ページ指定:
```bash
!`python3 .agent/.shared/ui-ux-pro-max/scripts/search.py "$ARGUMENTS" --design-system --persist -p "Project" --page "dashboard" 2>&1`
```

---

## Step 3: 詳細検索で補完

### Available Domains

| Domain | Use For | Example |
|--------|---------|---------|
| `product` | Product type recommendations | `SaaS`, `e-commerce`, `portfolio` |
| `style` | UI styles, colors, effects | `glassmorphism`, `minimalism`, `dark mode` |
| `typography` | Font pairings | `elegant`, `playful`, `professional` |
| `color` | Palettes | `saas`, `ecommerce`, `healthcare` |
| `landing` | Page structure | `hero`, `testimonial`, `pricing` |
| `chart` | Chart types | `trend`, `comparison`, `timeline` |
| `ux` | Best practices | `animation`, `accessibility`, `z-index` |

**Usage:**
```bash
# Style options
!`python3 .agent/.shared/ui-ux-pro-max/scripts/search.py "glassmorphism dark" --domain style 2>&1`

# Chart recommendations
!`python3 .agent/.shared/ui-ux-pro-max/scripts/search.py "real-time dashboard" --domain chart 2>&1`

# UX guidelines
!`python3 .agent/.shared/ui-ux-pro-max/scripts/search.py "animation accessibility" --domain ux 2>&1`
```

---

## Step 4: Stack Guidelines (Default: html-tailwind)

スタック別ガイドを取得。未指定なら `html-tailwind`。

```bash
!`python3 .agent/.shared/ui-ux-pro-max/scripts/search.py "layout responsive form" --stack html-tailwind 2>&1`
```

### Available Stacks

`html-tailwind`, `react`, `nextjs`, `vue`, `svelte`, `swiftui`, `react-native`, `flutter`, `shadcn`, `jetpack-compose`

---

## Example Workflow

**User request:** "Create a landing page for a beauty spa service"

### Step 1: Analyze Requirements
- Product type: Beauty/Spa service
- Style keywords: elegant, professional, soft
- Industry: Beauty/Wellness
- Stack: html-tailwind (default)

### Step 2: Generate Design System

```bash
!`python3 .agent/.shared/ui-ux-pro-max/scripts/search.py "beauty spa wellness service elegant" --design-system -p "Serenity Spa" 2>&1`
```

**Output:** pattern/style/colors/typography/effects

### Step 3: Supplement with Details

```bash
# UX guidelines
!`python3 .agent/.shared/ui-ux-pro-max/scripts/search.py "animation accessibility" --domain ux 2>&1`

# Typography options
!`python3 .agent/.shared/ui-ux-pro-max/scripts/search.py "elegant luxury serif" --domain typography 2>&1`
```

### Step 4: Implementation

`Write`/`Edit` で実装。

---

## Common Rules for Professional UI

### Icons & Visual Elements

| Rule | Do | Don't |
|------|----|-----|
| **No emoji icons** | Use SVG icons | Use emojis like 🎨 🚀 |
| **Stable hover states** | Color/opacity transitions | scale transforms |
| **Correct brand logos** | Official SVG from Simple Icons | Guess logo paths |
| **Consistent icon sizing** | Fixed viewBox (24x24) | Mix sizes |

### Interaction

| Rule | Do | Don't |
|------|----|-----|
| **Cursor pointer** | `cursor-pointer` for clickable | Default cursor |
| **Hover feedback** | Visual feedback | No indication |
| **Smooth transitions** | `transition-colors duration-200` | Too slow (>500ms) |

### Light/Dark Mode

| Rule | Do | Don't |
|------|----|-----|
| **Glass light mode** | `bg-white/80`+ | `bg-white/10` |
| **Text contrast light** | `#0F172A` | `#94A3B8` |
| **Border visibility** | `border-gray-200` | `border-white/10` |

---

## Pre-Delivery Checklist

### Visual Quality
- [ ] No emojis as icons
- [ ] Icons from consistent set
- [ ] Brand logos are correct
- [ ] Hover states don't cause layout shift
- [ ] Use theme colors directly

### Interaction
- [ ] `cursor-pointer` on clickable
- [ ] Hover feedback
- [ ] Transitions 150-300ms
- [ ] Focus states visible

### Light/Dark Mode
- [ ] Contrast 4.5:1+
- [ ] Glass visible in light
- [ ] Borders visible
- [ ] Test both modes

### Layout
- [ ] Proper spacing
- [ ] No content hidden behind fixed nav
- [ ] Responsive at 375/768/1024/1440
- [ ] No horizontal scroll on mobile

### Accessibility
- [ ] Alt text
- [ ] Form labels
- [ ] Color not the only indicator
- [ ] `prefers-reduced-motion`

---

## Tips for Better Results

1. **Be specific** - "healthcare SaaS dashboard" > "app"
2. **Search multiple times** - 別キーワードで再検索
3. **Combine domains** - Style + Typography + Color
4. **Always check UX** - "animation", "z-index", "accessibility"
5. **Use stack flag** - 実装向けベストプラクティス
6. **Iterate** - 結果が合わなければ再試行

---

包括的なデザインシステムを生成し、プロ品質の UI/UX を実装する。
