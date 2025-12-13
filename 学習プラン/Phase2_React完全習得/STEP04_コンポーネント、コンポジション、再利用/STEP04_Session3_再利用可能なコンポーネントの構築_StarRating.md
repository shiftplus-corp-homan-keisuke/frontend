# Session 3: 再利用可能なコンポーネントの構築 - StarRating

## 学習目標

このセッションでは、プロジェクトから独立して使える「再利用性の高い」コンポーネントの設計と実装を学習します。
`StarRating`（星評価）コンポーネントを一から作成し、以下のスキルを習得します：

- **柔軟なコンポーネント API の設計**（Props の活用）
- **複雑なステートとイベント管理**（ホバーとクリックのインタラクション）
- **`Array.from` を使った動的な要素生成**
- **PropTypes による型チェックとドキュメンテーション**

## 独立したコンポーネントの開発

これまでは `usePopcorn` アプリの一部としてコンポーネントを作ってきましたが、今回は「どのアプリでも使える汎用コンポーネント」を目指します。

### ステップ 1: ファイル作成と基本構造

`src/StarRating.js` という新しいファイルを作成しましょう。CSS ファイルには依存せず、スタイルはすべてインラインで定義します（これがポータビリティを高めるコツです）。

```jsx
import { useState } from "react";

const containerStyle = {
  display: "flex",
  alignItems: "center",
  gap: "16px",
};

const starContainerStyle = {
  display: "flex",
};

export default function StarRating({ maxRating = 5 }) {
  return (
    <div style={containerStyle}>
      <div style={starContainerStyle}>
        {Array.from({ length: maxRating }, (_, i) => (
          <span key={i}>S{i + 1}</span>
        ))}
      </div>
      <p>0</p>
    </div>
  );
}
```

`index.js` で一時的に `App` の代わりに `StarRating` をレンダリングして、開発中の表示を確認しましょう。

## ステート管理とインタラクション

星評価コンポーネントには 2 種類のステートが必要です。

1. **確定した評価 (`rating`)**: クリックして決定した星の数。
2. **一時的な評価 (`tempRating`)**: ホバーしている最中の星の数。

### ステップ 2: 星（Star）コンポーネントの作成

SVG を使った星コンポーネントを作成します。`full` プロパティを受け取り、塗りつぶしか空（枠線のみ）かを切り替えます。

```jsx
function Star({ onRate, full, onHoverIn, onHoverOut }) {
  return (
    <span
      role="button"
      style={{ cursor: "pointer" }}
      onClick={onRate}
      onMouseEnter={onHoverIn}
      onMouseLeave={onHoverOut}
    >
      {full ? (
        /* 塗りつぶされた星のSVG */
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" stroke="currentColor">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ) : (
        /* 空の星のSVG */
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="{2}" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      )}
    </span>
  );
}
```

### ステップ 3: ロジックの実装

`StarRating` コンポーネントでイベントを処理します。

```jsx
export default function StarRating({ maxRating = 5 }) {
  const [rating, setRating] = useState(0);
  const [tempRating, setTempRating] = useState(0);

  function handleRating(rating) {
    setRating(rating);
  }

  return (
    <div style={containerStyle}>
      <div style={starContainerStyle}>
        {Array.from({ length: maxRating }, (_, i) => (
          <Star
            key={i}
            onRate={() => handleRating(i + 1)}
            full={tempRating ? tempRating >= i + 1 : rating >= i + 1}
            onHoverIn={() => setTempRating(i + 1)}
            onHoverOut={() => setTempRating(0)}
          />
        ))}
      </div>
      <p style={textStyle}>{tempRating || rating || ""}</p>
    </div>
  );
}
```

**ポイント**:
- `tempRating`（ホバー値）がある場合はそれを優先して星を塗りつぶします（`full` の判定ロジック）。
- ホバーが外れたら `tempRating` を 0 に戻し、確定済みの `rating` が表示されるようにします。

## Reusability の向上：Props API の設計

このコンポーネントを他の人が使いやすくするために、カスタマイズ可能な Props (API) を追加します。

### 追加する Props

1.  **`color`**: 星とテキストの色（デフォルト: `#fcc419`）
2.  **`size`**: 星の大きさ（デフォルト: `48`）
3.  **`className`**: 外部からのスタイル上書き用
4.  **`messages`**: 数字の代わりに表示するテキスト配列（例: `['最悪', '悪い', '普通', '良い', '最高']`）
5.  **`defaultRating`**: 初期評価値
6.  **`onSetRating`**: 親コンポーネントに評価を伝えるコールバック関数

### 実装例

```jsx
export default function StarRating({
  maxRating = 5,
  color = "#fcc419",
  size = 48,
  className = "",
  messages = [],
  defaultRating = 0,
  onSetRating,
}) {
  const [rating, setRating] = useState(defaultRating); // 初期値をpropから設定
  // ...

  function handleRating(rating) {
    setRating(rating);
    if (onSetRating) onSetRating(rating); // 外部へ通知
  }

  const textStyle = {
    lineHeight: "1",
    margin: "0",
    color,    // propの色を使用
    fontSize: `${size / 1.5}px`,
  };

  // Starコンポーネントにも color, size を渡す必要があります
  // ...
}
```

特に `onSetRating` は重要です。これがないと、このコンポーネントはただ星を表示するだけで、親コンポーネント（アプリ本体）はユーザーが何点を入れたか知ることができません。

## PropTypes による型チェック

JavaScript は動的型付け言語ですが、コンポーネントの公開 API として Props を定義する場合、期待する型を明示することは非常に有益です。

```jsx
import PropTypes from "prop-types";

// ... コンポーネント定義 ...

StarRating.propTypes = {
  maxRating: PropTypes.number,
  defaultRating: PropTypes.number,
  color: PropTypes.string,
  size: PropTypes.number,
  messages: PropTypes.array,
  className: PropTypes.string,
  onSetRating: PropTypes.func, // 関数であることを期待
};
```

これにより、例えば `maxRating` に文字列を渡してしまった場合などに、ブラウザのコンソールで警告が表示され、バグの早期発見につながります。

## 実践課題

作成した `StarRating` コンポーネントを `App.js` に組み込み（インポートし）、`watched` 映画の評価入力に使用してみてください。

```jsx
// App.js での使用例
<StarRating 
  maxRating={10} 
  size={24} 
  onSetRating={setUserRating} 
/>
```

これで、あなたの星評価コンポーネントは、サイズも色も最大数も自由自在な、真に再利用可能な「部品」となりました。
