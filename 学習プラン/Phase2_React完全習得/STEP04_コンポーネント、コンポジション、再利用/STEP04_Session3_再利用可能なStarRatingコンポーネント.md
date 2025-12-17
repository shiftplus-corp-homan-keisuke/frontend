# Session 3: 再利用可能な StarRating コンポーネントの構築

## はじめに
このセッションでは、映画アプリから少し離れて、完全に独立した「再利用可能なコンポーネント」を作る練習をします。
目指すのは、どんなアプリにもポイっとコピー＆ペーストするだけで使える、汎用的な **星評価（Star Rating）コンポーネント** です。

そのためには、外部の CSS ファイルに依存せず、コンポーネント自身がスタイルを持つ必要があります。

---

## 1. 開発環境の準備

`StarRating` コンポーネントの開発に集中するため、一時的に `index.js` を書き換えて、`App` の代わりに `StarRating` を表示するようにしましょう。

1.  `src` フォルダに `StarRating.js` を新規作成します。
2.  `src/index.js` を以下のように修正します。

```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
// import './index.css'; // スタイルも一旦オフ
// import App from './App';
import StarRating from './StarRating';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* <App /> */}
    <StarRating />
  </React.StrictMode>
);
```

これで、白い画面に `StarRating` だけが表示される環境が整いました。

---

## 2. コンポーネントの骨組みと星の表示

まずは星を並べるところから始めましょう。
星の数は可変にしたいので、`Array.from` を使って動的に生成します。

```jsx
// StarRating.js
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
          <Star key={i} />
        ))}
      </div>
      <p>10</p>
    </div>
  );
}

// 子供のStarコンポーネント（まずは仮置き）
function Star() {
  return <span>⭐️</span>;
}
```

これで星が5つ並びましたか？

---

## 3. SVG で星を描画する

絵文字の代わりに SVG アイコンを使って、色やサイズを細かく制御できるようにします。
`Star` コンポーネントを以下のように書き換えてください。

```jsx
function Star({ full }) {
  return (
    <span role="button" style={{ cursor: "pointer", display: "block", width: "48px", height: "48px" }}>
      {full ? (
        // 塗りつぶしの星 (Full)
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="#fcc419"
          stroke="#fcc419"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ) : (
        // 空の星 (Empty)
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="#fcc419"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="{2}"
            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
          />
        </svg>
      )}
    </span>
  );
}
```

親の `StarRating` から `full={true}` や `full={false}` を渡して、星が切り替わるか試してみましょう。

---

## 4. State によるインタラクションの実装

星をクリックしたりホバーしたりした時の動きを作ります。

### State の定義
`StarRating` に2つの State を用意します。
*   `rating`: 確定した評価（クリックした値）
*   `tempRating`: 一時的な評価（ホバー中の値）

```jsx
const [rating, setRating] = useState(0);
const [tempRating, setTempRating] = useState(0);
```

### イベントハンドラの作成
星にマウスが乗った時、離れた時、クリックした時の関数を作ります。

```jsx
// Starコンポーネントに Props を追加
<Star
  key={i}
  onRate={() => setRating(i + 1)}
  onHoverIn={() => setTempRating(i + 1)}
  onHoverOut={() => setTempRating(0)}
  full={tempRating ? tempRating >= i + 1 : rating >= i + 1} // ここがロジックの肝！
/>
```

「ホバー中 (`tempRating` がある) ならホバー位置まで塗りつぶす。ホバーしてないなら確定した評価 (`rating`) まで塗りつぶす」というロジックです。

---

## 5. Props でカスタマイズ可能にする

最後に、このコンポーネントをどこでも使えるように、色やサイズ、挙動を Props で変更できるようにします。

**受け取るべき Props:**
*   `color`: 星の色 (デフォルト: `#fcc419`)
*   `size`: 星の大きさ (デフォルト: `48`)
*   `messages`: 「最悪」「普通」「最高」などのラベル配列
*   `defaultRating`: 初期の星の数
*   `onSetRating`: 評価が決定した時に親に通知する関数

これらを実装し、`PropTypes` で型チェックを追加すれば完成です！

（完成コードは `final/src/StarRating.js` を参照してください）

---

## まとめ：何を作ったのか？

1.  **論理的な分割**と**Composition** で、`App` 内のデータを整理しました (Session 1 & 2)。
2.  **再利用可能な部品** (`Box`, `StarRating`) を抽出し、特定のデータ (`movies` など) に依存しない設計にしました (Session 2 & 3)。

これが「React的な思考 (Thinking in React)」の基礎です。
次のステップ（Session 4以降）では、いよいよ本物のデータを API から取得したり、useEffect を使ったりして、アプリに命を吹き込んでいきます！
