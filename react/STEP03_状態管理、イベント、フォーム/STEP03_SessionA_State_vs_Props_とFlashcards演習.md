# Session A: State vs. Props と Flashcards アプリ（演習）

## 学習目標

このセッションでは、State と Props の違いを明確に理解し、実践的な演習を通じて状態管理のスキルを深めることを目標とします：

- **State vs. Props の根本的な違いの完全理解**
- **状態管理による動的 UI の実装**
- **単一状態による複数要素の制御パターン**
- **条件付きレンダリングの実践的活用**
- **イベントハンドリングと状態更新の連携**

この演習は、メインプロジェクトの「Far Away」アプリで学習した基本概念を別の文脈で応用し、React 開発者として必要不可欠な状態管理スキルを定着させる重要な学習機会となります。

## State vs. Props：概念の完全整理

React 開発における最も重要な概念の一つである「State と Props の違い」について、実際のコード例を通じて詳しく解説します。

### State：コンポーネントの内部データ

**State の特徴**：

- **内部データ**: そのコンポーネントが所有し管理するデータ
- **メモリ機能**: 時間の経過とともにデータを保持
- **更新可能**: コンポーネント自身が値を変更可能
- **再レンダリング**: 更新時にコンポーネントの再レンダリングを引き起こす

**実装例**：

```javascript
function Question() {
  // State: このコンポーネント内部のデータ
  const [upVotes, setUpVotes] = useState(0);

  // このコンポーネントが状態を更新可能
  const handleUpVote = () => {
    setUpVotes(upVotes + 1);
  };

  return (
    <div>
      <p>Up votes: {upVotes}</p>
      <button onClick={handleUpVote}>👍 Up Vote</button>
    </div>
  );
}
```

### Props：外部から受け取るデータ

**Props の特徴**：

- **外部データ**: 親コンポーネントから渡されるデータ
- **関数パラメータ**: 関数の引数のような役割
- **読み取り専用**: 受け取ったコンポーネントでは変更不可
- **設定値**: 親コンポーネントが子の動作を設定

**実装例**：

```javascript
// 親コンポーネント
function Question() {
  const [upVotes, setUpVotes] = useState(0);

  return (
    <div>
      <p>Question: How does React work?</p>
      {/* Props として子コンポーネントにデータを渡す */}
      <Button upVotes={upVotes} onUpVote={() => setUpVotes(upVotes + 1)} />
    </div>
  );
}

// 子コンポーネント
function Button({ upVotes, onUpVote }) {
  // Props は読み取り専用 - 変更不可
  // upVotes の値を直接変更することはできない

  return <button onClick={onUpVote}>👍 Up Vote ({upVotes})</button>;
}
```

### State と Props の重要な関係

**状態の連鎖的更新**：

```javascript
function App() {
  const [upVotes, setUpVotes] = useState(0); // State

  const handleUpVote = () => {
    setUpVotes(upVotes + 1); // State 更新
  };

  return (
    <div>
      {/* State が更新されると、このコンポーネント（App）が再レンダリング */}
      <Question upVotes={upVotes} onUpVote={handleUpVote} />
      {/* Props として渡された upVotes が更新されると、
          子コンポーネント（Question）も再レンダリング */}
    </div>
  );
}
```

**重要なポイント**：

- **Parent State → Child Props**: 親の State が子の Props になる
- **連鎖的再レンダリング**: State が更新されると、その State を Props として受け取るすべての子コンポーネントも再レンダリングされる
- **同期メカニズム**: この仕組みにより、アプリケーション全体の状態が自動的に同期される

### 使い分けの基準

| 観点               | State                            | Props                                |
| ------------------ | -------------------------------- | ------------------------------------ |
| **データの所有者** | そのコンポーネント               | 親コンポーネント                     |
| **変更権限**       | そのコンポーネントのみ           | 変更不可（読み取り専用）             |
| **用途**           | インタラクティブ性の実現         | コンポーネントの設定・カスタマイズ   |
| **例**             | フォーム入力値、モーダル表示状態 | カラー設定、初期値、コールバック関数 |

## Flashcards アプリ：実践演習

それでは、State vs. Props の概念を実際のアプリケーション開発を通じて実践的に学習しましょう。Flashcards（フラッシュカード）アプリを構築します。

### アプリケーションの仕様

**機能要件**：

- **質問表示**: デフォルトで質問面を表示
- **回答表示**: クリックで答え面に切り替え
- **単一選択**: 一度に一つのカードのみ開く
- **開閉制御**: 開いているカードを再クリックで閉じる

**技術要件**：

- **単一 State**: `selectedId` 一つだけで全体を制御
- **条件付きレンダリング**: State と Props に基づく表示切り替え
- **動的スタイリング**: 選択状態に応じた CSS 適用

### データ構造の準備

まず、フラッシュカードのデータを準備します：

```javascript
const questions = [
  {
    id: 3457,
    question: "What language is React based on?",
    answer: "JavaScript",
  },
  {
    id: 7336,
    question: "What are the building blocks of React apps?",
    answer: "Components",
  },
  {
    id: 8832,
    question: "What's the name of the syntax we use to describe a UI in React?",
    answer: "JSX",
  },
  {
    id: 1297,
    question: "How to pass data from parent to child components?",
    answer: "Props",
  },
  {
    id: 9103,
    question: "How to give components memory?",
    answer: "useState hook",
  },
  {
    id: 2002,
    question:
      "What do we call an input element that is completely synchronized with state?",
    answer: "Controlled element",
  },
];
```

### FlashCards コンポーネントの実装

#### Step 1: 基本構造と状態管理

```javascript
import { useState } from "react";

function FlashCards() {
  // 単一のState：現在選択されているカードのID
  const [selectedId, setSelectedId] = useState(null);

  return <div className="flashcards">{/* ここにカードリストを実装 */}</div>;
}
```

**設計のポイント**：

- **`selectedId`**: 現在開いているカードの ID を管理
- **`null`**: 初期状態ではどのカードも開かない
- **単一責任**: 一つの State で全体の状態を管理

#### Step 2: カードリストのレンダリング

```javascript
function FlashCards() {
  const [selectedId, setSelectedId] = useState(null);

  return (
    <div className="flashcards">
      {questions.map((question) => (
        <div
          key={question.id}
          className={question.id === selectedId ? "selected" : ""}
          onClick={() => handleClick(question.id)}
        >
          <p>
            {question.id === selectedId ? question.answer : question.question}
          </p>
        </div>
      ))}
    </div>
  );
}
```

**実装の詳細解説**：

1. **map メソッド**：

   ```javascript
   questions.map((question) => (
     // 各質問オブジェクトをJSXに変換
   ))
   ```

2. **条件付きスタイリング**：

   ```javascript
   className={question.id === selectedId ? "selected" : ""}
   ```

   - 現在のカードが選択されている場合、`selected` クラスを適用
   - そうでなければ、空文字列（クラスなし）

3. **条件付きコンテンツ**：
   ```javascript
   {
     question.id === selectedId
       ? question.answer // 選択されている場合は答えを表示
       : question.question; // そうでなければ質問を表示
   }
   ```

#### Step 3: クリックハンドラーの実装

```javascript
function FlashCards() {
  const [selectedId, setSelectedId] = useState(null);

  function handleClick(id) {
    // 現在選択されているIDと同じ場合は閉じる（null）
    // 異なる場合は新しいIDを設定
    setSelectedId(id !== selectedId ? id : null);
  }

  return (
    <div className="flashcards">
      {questions.map((question) => (
        <div
          key={question.id}
          className={question.id === selectedId ? "selected" : ""}
          onClick={() => handleClick(question.id)}
        >
          <p>
            {question.id === selectedId ? question.answer : question.question}
          </p>
        </div>
      ))}
    </div>
  );
}
```

**クリック処理の詳細**：

```javascript
function handleClick(id) {
  setSelectedId(id !== selectedId ? id : null);
}
```

この一行のロジックは以下のように動作します：

1. **新しいカードをクリック**：

   - `id !== selectedId` → `true`
   - `setSelectedId(id)` → 新しいカードを開く

2. **同じカードを再クリック**：
   - `id !== selectedId` → `false`
   - `setSelectedId(null)` → カードを閉じる

### イベントハンドラーの適切な実装

**正しい実装**：

```javascript
onClick={() => handleClick(question.id)}
```

**よくある間違い**：

```javascript
// ❌ 関数を即座に実行してしまう
onClick={handleClick(question.id)}

// ❌ 引数を渡せない
onClick={handleClick}
```

**解説**：

- `() => handleClick(question.id)`: React に関数を渡し、クリック時に実行される
- `handleClick(question.id)`: コンポーネントレンダリング時に即座に実行される（間違い）

### CSS スタイリング

```css
.flashcards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin: 20px;
}

.flashcards > div {
  border: 1px solid #e7e7e7;
  border-radius: 8px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: #f8f9fa;
}

.flashcards > div:hover {
  background-color: #e9ecef;
  transform: translateY(-2px);
}

.flashcards > div.selected {
  border: 2px solid #e03131;
  background-color: #fff5f5;
  font-weight: bold;
  box-shadow: 0 4px 8px rgba(224, 49, 49, 0.2);
}

.flashcards p {
  margin: 0;
  font-size: 16px;
  line-height: 1.5;
}
```

### 完全なアプリケーション

```javascript
import React, { useState } from "react";
import "./FlashCards.css";

const questions = [
  {
    id: 3457,
    question: "What language is React based on?",
    answer: "JavaScript",
  },
  {
    id: 7336,
    question: "What are the building blocks of React apps?",
    answer: "Components",
  },
  {
    id: 8832,
    question: "What's the name of the syntax we use to describe a UI in React?",
    answer: "JSX",
  },
  {
    id: 1297,
    question: "How to pass data from parent to child components?",
    answer: "Props",
  },
  {
    id: 9103,
    question: "How to give components memory?",
    answer: "useState hook",
  },
  {
    id: 2002,
    question:
      "What do we call an input element that is completely synchronized with state?",
    answer: "Controlled element",
  },
];

function FlashCards() {
  const [selectedId, setSelectedId] = useState(null);

  function handleClick(id) {
    setSelectedId(id !== selectedId ? id : null);
  }

  return (
    <div className="flashcards">
      {questions.map((question) => (
        <div
          key={question.id}
          className={question.id === selectedId ? "selected" : ""}
          onClick={() => handleClick(question.id)}
        >
          <p>
            {question.id === selectedId ? question.answer : question.question}
          </p>
        </div>
      ))}
    </div>
  );
}

export default FlashCards;
```

## 状態管理パターンの分析

### 単一状態による複数要素制御

この FlashCards アプリの最も重要な学習ポイントは、**一つの State 変数で複数の要素を制御する**パターンです：

```javascript
const [selectedId, setSelectedId] = useState(null);
```

この単一の状態により：

- **6 枚すべてのカードの表示内容を制御**
- **6 枚すべてのカードのスタイリングを制御**
- **開閉の排他制御**（一度に一つだけ開く）

### 状態駆動 UI（State-Driven UI）

```javascript
// 表示内容の決定
{question.id === selectedId ? question.answer : question.question}

// スタイリングの決定
className={question.id === selectedId ? "selected" : ""}
```

**重要な概念**：

- **State が UI を決定する**: 状態の値によって UI の見た目と動作が完全に決まる
- **宣言的プログラミング**: 「何を表示するか」を宣言し、「どのように変更するか」は React に任せる

### React DevTools での状態確認

開発中は React DevTools を使用して状態の変化を確認しましょう：

1. **State の現在値**: `selectedId` の値を確認
2. **State の変化**: クリック時の値の変更を観察
3. **再レンダリング**: State 変更時のコンポーネント更新を確認

## 実践的な学習ポイント

### 1. 関数型 vs 命令型アプローチ

**React 的（宣言的）アプローチ**：

```javascript
// 「選択されているときの見た目」を宣言
{
  question.id === selectedId ? question.answer : question.question;
}
```

**従来の JavaScript（命令的）アプローチなら**：

```javascript
// DOM要素を直接操作する必要がある
if (selectedId === question.id) {
  element.textContent = question.answer;
  element.classList.add("selected");
} else {
  element.textContent = question.question;
  element.classList.remove("selected");
}
```

### 2. 状態設計の重要性

**良い状態設計**：

- **最小限**: `selectedId` 一つで全体を制御
- **単一責任**: 「どのカードが選択されているか」のみを管理
- **予測可能**: 状態の変化が UI の変化に直結

**避けるべき設計**：

```javascript
// ❌ 複雑すぎる状態
const [card1Open, setCard1Open] = useState(false);
const [card2Open, setCard2Open] = useState(false);
// ... 6枚分の状態が必要
```

### 3. イベント処理の最適化

```javascript
// 各カードに固有のIDを渡す仕組み
onClick={() => handleClick(question.id)}
```

この実装により：

- **クロージャー**: 各カードが固有の ID を「覚えている」
- **イベント委譲**: 複数要素のイベントを効率的に処理
- **引数の受け渡し**: イベントハンドラーに必要なデータを渡す

## まとめ

この FlashCards アプリの実装を通じて、以下の重要な概念を実践的に学習しました：

### State vs. Props の理解深化

1. **State**: コンポーネント内部のデータ、更新可能、再レンダリングを引き起こす
2. **Props**: 親から子への外部データ、読み取り専用、設定値として機能
3. **連携**: 親の State が子の Props になり、変更時は両方が再レンダリング

### 実践的状態管理パターン

1. **単一状態制御**: 複数要素を一つの状態で制御する効率性
2. **条件付きレンダリング**: 状態に基づく UI の動的変更
3. **状態駆動設計**: State が UI を完全に決定する設計思想

### React 開発のベストプラクティス

1. **宣言的プログラミング**: 「何を表示するか」に集中
2. **最小限の状態**: 必要最小限の State で最大の効果を実現
3. **予測可能な動作**: 状態の変化が UI の変化に直結する設計

これらの学習内容は、より複雑な React アプリケーション開発における状態管理の基盤となる重要なスキルです。次の演習でも、これらの概念をさらに発展させて学習していきます。
