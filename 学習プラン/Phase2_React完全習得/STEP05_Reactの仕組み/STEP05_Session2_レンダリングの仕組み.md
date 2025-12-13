# Session 2: レンダリングの仕組み

## 学習目標

このセッションでは、React がどのようにコンポーネントを画面に表示するのか、その内部プロセスを深く理解します。

- レンダリングの**3つのフェーズ**: Trigger → Render → Commit
- **Virtual DOM** の真の意味
- **Fiber ツリー**とリコンシリエーション
- なぜ「レンダリング ≠ DOM 更新」なのか

## React における「レンダリング」の定義

> **重要**: React における「レンダリング」は、DOM を更新することでは**ありません**。

React のレンダリングとは、**コンポーネント関数を呼び出し、どのような DOM 変更が必要かを計算すること**です。実際の視覚的変更は「Commit フェーズ」で行われます。

## 3つのフェーズ

### Phase 1: Trigger（トリガー）

レンダリングがトリガーされるのは2つの場合のみです：

1. **初回レンダリング**: アプリが最初に起動したとき
2. **State 更新**: コンポーネント内の State が変更されたとき

```jsx
// State更新がレンダリングをトリガーする
const [count, setCount] = useState(0);
setCount(count + 1); // これがトリガーになる
```

> **注意**: レンダリングは即座にはトリガーされません。JavaScript エンジンが空いているときにスケジュールされます。また、同じ関数内の複数の `setState` は**バッチ処理**されます（Session 4で詳しく説明）。

### Phase 2: Render（レンダー）

このフェーズでは：
1. React はリレンダリングが必要なすべてのコンポーネント関数を呼び出します。
2. 各コンポーネントは React 要素を返します。
3. これらの要素が集まって **Virtual DOM** を形成します。

```
コンポーネント関数呼び出し
    ↓
React 要素が生成される
    ↓
Virtual DOM（React 要素ツリー）が構築される
```

#### Virtual DOM とは

Virtual DOM は、すべてのコンポーネントから生成された **React 要素のツリー** です。

- 単なる JavaScript オブジェクトなので、作成は**高速かつ軽量**です。
- React 公式ドキュメントでは「React Element Tree」と呼ばれています。

#### 子コンポーネントも再レンダリングされる

**非常に重要**: あるコンポーネントが再レンダリングされると、その**すべての子孫コンポーネントも再レンダリング**されます。Props が変わっていなくてもです。

```jsx
function Parent() { // ← これが再レンダリングされると...
  return <Child />; // ← これも再レンダリングされる
}
```

React は Props が変わったかどうかを事前に知ることができないため、安全策としてすべての子を再レンダリングします。

### Phase 3: Commit（コミット）

このフェーズで初めて**実際の DOM が更新**されます。

- 新しい要素が DOM に挿入される
- 既存の要素が更新される
- 不要な要素が削除される

> **重要**: Commit フェーズは**同期的**です（中断されません）。これにより、UI が一貫した状態を保ちます。

## Fiber とリコンシリエーション

### なぜ全ての DOM を書き換えないのか

Virtual DOM を毎回そのまま DOM に書き込むのは**非効率**です。

- DOM 操作は**高コスト**です。
- ほとんどの場合、State 更新で変わるのは DOM のごく一部だけです。

そこで React は **Reconciliation（リコンシリエーション）** を行います。

### Reconciliation とは

前の Virtual DOM と新しい Virtual DOM を比較し、**最小限の DOM 変更**だけを特定するプロセスです。

これを担当するのが **Fiber** というアーキテクチャです。

### Fiber ツリー

Fiber ツリーは、各コンポーネントインスタンスと DOM 要素に対応する **Fiber ノード** で構成されます。

Fiber ノードには以下が格納されます：
- 現在の State
- Props
- 使用されているフック
- 実行する必要がある「作業」のキュー

```
Fiber の特徴：
- Virtual DOM とは異なり、再作成されません（ミューテーションされます）
- 作業を「単位」として扱い、非同期に処理できます
- 優先順位付けが可能で、重要な更新を先に処理できます
```

### Render Phase は非同期

Fiber により、Render フェーズは**一時停止、再開、破棄**が可能です。

- 長い処理がメインスレッドをブロックしません。
- より重要な更新（ユーザー入力など）を優先できます。
- これが React 18 の並行機能（Concurrent Features）の基盤です。

## React と ReactDOM

**React** ライブラリ自体は DOM に直接書き込みません。

- **React**: Render フェーズを担当（Virtual DOM の構築、差分計算）
- **ReactDOM**: Commit フェーズを担当（実際の DOM 更新）

これにより、React は Web 以外（React Native、Remotion など）でも使用できます。

```jsx
// index.js
import React from 'react';
import ReactDOM from 'react-dom/client';

// React と ReactDOM は別々のパッケージ
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
```

## まとめ

| フェーズ | 担当 | 処理内容 |
|---------|------|----------|
| **Trigger** | React | State 更新または初回レンダリングを検知 |
| **Render** | React | コンポーネント関数を呼び出し、Virtual DOM を構築 |
| **Reconciliation** | Fiber | 前後の Virtual DOM を比較し、差分を計算 |
| **Commit** | ReactDOM | 計算された差分を実際の DOM に適用 |
| **Paint** | Browser | DOM の変更を画面に描画 |

次のセッションでは、リコンシリエーションの核心である「Diffing アルゴリズム」と、それを制御する「Key Prop」について学びます。
