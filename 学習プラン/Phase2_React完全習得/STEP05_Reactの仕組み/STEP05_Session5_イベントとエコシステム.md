# Session 5: イベント処理と React エコシステム

## 学習目標

このセッションでは、ブラウザイベントが React 内でどのように処理されるかを学びます。また、React が「ライブラリ」である意味と、サードパーティ・エコシステムについて理解します。

- イベントの **Capturing** と **Bubbling**
- React による**イベント委譲（Event Delegation）**
- **Synthetic Event** とは
- **ライブラリ** vs **フレームワーク**
- React の**サードパーティ・エコシステム**

## ブラウザのイベント伝播

### Capturing と Bubbling

イベントが発生すると、以下のように伝播します：

1. **Capturing Phase（キャプチャ）**: ルート要素 → ターゲット要素へ下降
2. **Target Phase**: ターゲット要素で処理
3. **Bubbling Phase（バブリング）**: ターゲット要素 → ルート要素へ上昇

```
             ┌──────────────┐
             │   Document   │  ← イベント生成
             └──────┬───────┘
                    │
           Capturing ↓
                    │
             ┌──────┼───────┐
             │   <div>      │
             │      │       │
             │   <button>   │  ← ターゲット
             │      │       │
             └──────┼───────┘
                    │
           Bubbling ↑
                    │
             ┌──────┴───────┐
             │   Document   │
             └──────────────┘
```

### Event Delegation（イベント委譲）

多くの要素にイベントハンドラーを付ける代わりに、**親要素1つにハンドラーを設置**し、バブリングを利用してイベントを処理するテクニックです。

## React のイベント処理

### React はイベント委譲を自動で行う

React では `onClick` などを各要素に書きますが、内部的には**すべてのイベントハンドラーがルート要素に登録**されます。

```jsx
// このように書くと...
<button onClick={handleClick}>Click me</button>

// React は内部的にルート要素でイベントを監視し、
// 適切なハンドラーを呼び出す
```

これにより：
- パフォーマンスが向上
- メモリ使用量が削減

### Synthetic Event（合成イベント）

React が提供するイベントオブジェクトは、ブラウザネイティブのイベントオブジェクトを**ラップ**したものです。

```jsx
function handleClick(event) {
  // event は SyntheticEvent
  console.log(event.type); // 'click'
  console.log(event.nativeEvent); // ネイティブイベントにアクセス可能
}
```

**SyntheticEvent の特徴**:
- **ブラウザ間の差異を吸収**（クロスブラウザ対応）
- `stopPropagation()` / `preventDefault()` が使用可能
- 一部のイベント（focus, blur, change）も**バブリングする**

### イベントハンドラーの書き方（React vs Vanilla JS）

| 機能 | Vanilla JS | React |
|------|------------|-------|
| イベント名 | `onclick` / `'click'` | `onClick`（camelCase） |
| デフォルト動作の防止 | `return false` が有効 | `event.preventDefault()` のみ |
| キャプチャ時のハンドラー | `{ capture: true }` | `onClickCapture` |

## ライブラリ vs フレームワーク

### フレームワークとは

**Angular, Vue, Svelte** など。

- 「すべて入り」のキット
- ルーティング、状態管理、HTTP リクエストなどが**標準で組み込まれている**
- 使う技術が**決められている**

### ライブラリとは

**React** はライブラリです。

- React 単体は「**View ライブラリ**」
- ルーティング、状態管理などは**別途ライブラリが必要**
- 技術の選択は**自由**

### それぞれのメリット・デメリット

| | フレームワーク | ライブラリ（React） |
|---|---------------|---------------------|
| **メリット** | 迷わない、すぐ始められる | 自由度が高い、最適な組み合わせを選べる |
| **デメリット** | ツールが固定される | 選択肢が多く、迷う可能性がある |

## React エコシステム

React 単体は UI の描画のみを担当するため、実際のアプリ開発では**サードパーティ・ライブラリ**を使用します。

### 代表的なライブラリ

| カテゴリ | ライブラリ |
|----------|-----------|
| **ルーティング** | React Router, TanStack Router |
| **HTTP リクエスト** | axios, fetch（標準） |
| **リモート状態管理** | TanStack Query (React Query), SWR |
| **グローバル状態管理** | Redux Toolkit, Zustand, Jotai, Recoil |
| **スタイリング** | styled-components, Tailwind CSS, CSS Modules |
| **フォーム** | React Hook Form, Formik |
| **アニメーション** | Framer Motion, React Spring |
| **UI コンポーネント** | Material-UI, Chakra UI, shadcn/ui |

### React ベースのフレームワーク

React 自体はライブラリですが、React を基盤とした**フルスタック・フレームワーク**も存在します。

| フレームワーク | 特徴 |
|---------------|------|
| **Next.js** | SSR/SSG、ファイルベースルーティング、API ルート |
| **Remix** | Web 標準への回帰、データローディングの最適化 |
| **Gatsby** | 静的サイト生成に特化 |

これらは React の能力を拡張し、サーバーサイドレンダリングや静的サイト生成を容易にします。

## セクションのまとめ

このセクションで学んだ重要なポイント：

| トピック | ポイント |
|----------|----------|
| **コンポーネント** | 設計図。インスタンスは Props/State/ライフサイクルを持つ実体。 |
| **レンダリング** | Trigger → Render → Commit の3フェーズ |
| **Diffing** | 同じ位置・同じタイプ → State 保持。異なる → 破棄。 |
| **Key Prop** | リストの最適化、または State リセットに使用。 |
| **純粋性** | Render Logic はサイドエフェクトを持たない。 |
| **バッチ処理** | 複数の State 更新が1回の再レンダリングにまとまる。 |
| **イベント** | React はイベント委譲を自動で行い、SyntheticEvent を提供。 |
| **エコシステム** | React はライブラリ。必要に応じて他のライブラリを組み合わせる。 |

---

おめでとうございます！STEP05「Reactの仕組み」を完了しました。

次のステップでは、**useEffect** フックを使ったデータフェッチングなど、より実践的な内容に進みます。
