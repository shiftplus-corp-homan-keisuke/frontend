# Session 4: チャレンジ #1 - TextExpander コンポーネント

## チャレンジの概要

今回は、よくある UI パターンである「テキスト展開（Text Expander）」コンポーネントを自力で作成するチャレンジです。
長いテキストを最初は省略して表示し、「もっと見る」ボタンで全文を表示する機能を、汎用的で再利用可能なコンポーネントとして実装してください。

## 要件定義

`TextExpander` コンポーネントは、以下の Props を受け取り、柔軟にカスタマイズ可能である必要があります。

1.  **`children`**: 表示するテキスト本文（必須）。
2.  **`collapsedNumWords`**: 折りたたみ時に表示する単語数（デフォルト: 10）。
3.  **`expandButtonText`**: 展開ボタンのテキスト（デフォルト: "Show more"）。
4.  **`collapseButtonText`**: 折りたたみボタンのテキスト（デフォルト: "Show less"）。
5.  **`buttonColor`**: ボタンのテキスト色（デフォルト: "#1f09cd"）。
6.  **`expanded`**: 初期状態で展開されているかどうか（デフォルト: false）。
7.  **`className`**: コンポーネント全体に適用するクラス名。

## スターターコード

以下のコードを `App.js` に貼り付けて、`TextExpander` コンポーネントの実装を開始してください。

```jsx
import { useState } from "react";
import "./styles.css";

export default function App() {
  return (
    <div>
      <TextExpander>
        Space travel is the ultimate adventure! Imagine soaring past the stars
        and exploring new worlds. It's the stuff of dreams and science fiction,
        but believe it or not, space travel is a real thing. Humans and robots
        are constantly venturing out into the cosmos to uncover its secrets and
        push the boundaries of what's possible.
      </TextExpander>

      <TextExpander
        collapsedNumWords={20}
        expandButtonText="Show text"
        collapseButtonText="Collapse text"
        buttonColor="#ff6622"
      >
        Space travel requires some seriously amazing technology and
        collaboration between countries, private companies, and international
        space organizations. And while it's not always easy (or cheap), the
        results are out of this world. Think about the first time humans stepped
        foot on the moon or when rovers were sent to roam around on Mars.
      </TextExpander>

      <TextExpander expanded={true} className="box">
        Space missions have given us incredible insights into our universe and
        have inspired future generations to keep reaching for the stars. Space
        travel is a pretty cool thing to think about. Who knows what we'll
        discover next!
      </TextExpander>
    </div>
  );
}

function TextExpander({
  collapsedNumWords = 10,
  expandButtonText = "Show more",
  collapseButtonText = "Show less",
  buttonColor = "#1f09cd",
  expanded = false,
  className,
  children
}) {
  const [isExpanded, setIsExpanded] = useState(expanded);

  // ここにロジックを実装してください
  // ヒント: テキストを単語で分割するには children.split(' ') が使えます

  return (
    <div className={className}>
      {/* ここにテキストとボタンを表示 */}
    </div>
  );
}
```

## ヒント

1.  **ステート**: 展開状態（`isExpanded`）を管理する `useState` が必要です。初期値は `expanded` prop から取得します。
2.  **テキスト処理**:
    - `isExpanded` が `true` の場合は、`children` 全文を表示します。
    - `isExpanded` が `false` の場合は、`children` を単語ごとに分割し、最初の `collapsedNumWords` 個だけを取り出して結合し、末尾に "..." を付与します。
3.  **スタイリング**: ボタンには `buttonColor` prop を適用し、スタイルオブジェクトを使ってインラインスタイルを設定すると簡単です。ボタン背景は透明、枠線なしにするとテキストリンクのように見えます。

## 目指すべき挙動

- `TextExpander` をクリックすると、「Show more」と「Show less」が切り替わり、テキストの長さが変わる。
- 2つ目の例では、ボタン色がオレンジになり、デフォルトで20単語まで表示される。
- 3つ目の例では、最初から展開されており、枠線（`.box` クラス）がついている。

このコンポーネントが完成すれば、ブログ記事の要約表示や、商品説明の「もっと読む」機能など、あらゆる場所で再利用できる強力な資産になります。頑張ってください！

<br>
<br>
<br>

## 解答例

実装につまったら、以下の解答例を参考にしてください。

```jsx
function TextExpander({
  collapsedNumWords = 10,
  expandButtonText = "Show more",
  collapseButtonText = "Show less",
  buttonColor = "#1f09cd",
  expanded = false,
  className,
  children,
}) {
  const [isExpanded, setIsExpanded] = useState(expanded);

  const displayText = isExpanded
    ? children
    : children.split(" ").slice(0, collapsedNumWords).join(" ") + "...";

  const buttonStyle = {
    background: "none",
    border: "none",
    font: "inherit",
    cursor: "pointer",
    marginLeft: "6px",
    color: buttonColor,
  };

  return (
    <div className={className}>
      <span>{displayText}</span>
      <button onClick={() => setIsExpanded((exp) => !exp)} style={buttonStyle}>
        {isExpanded ? collapseButtonText : expandButtonText}
      </button>
    </div>
  );
}
```
