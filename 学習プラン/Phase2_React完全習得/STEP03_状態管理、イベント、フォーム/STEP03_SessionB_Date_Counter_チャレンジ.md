# Session B: Date Counter アプリ（チャレンジ）

## 学習目標

このチャレンジセッションでは、より高度な状態管理と複数のインタラクティブ要素を組み合わせたアプリケーション開発を通じて、以下のスキルを習得します：

- **複数状態の協調動作による高度な UI 制御**
- **異なる HTML input 要素の制御されたコンポーネント化**
- **条件付きレンダリングによる動的 UI 要素の表示制御**
- **数値計算と JavaScript Date API の実践的活用**
- **ユーザビリティを考慮したリセット機能の実装**

このチャレンジは、前回の Flashcards アプリよりも複雑な状態管理を要求し、実際の Web アプリケーションで頻繁に使用される日付操作とフォーム制御の重要なパターンを学習する機会となります。

## アプリケーション仕様と設計目標

### Date Counter v2 の機能要件

**基本機能**：

- **日付計算**: 現在日時から指定日数後/前の日付を表示
- **ステップ制御**: スライダーによる日数増減の幅を設定
- **直接入力**: テキスト入力による正確な日数指定
- **リセット機能**: 初期状態への復帰（条件付き表示）

**UI 要件**：

- **直感的操作**: スライダー、テキスト入力、ボタンの組み合わせ
- **リアルタイム更新**: 入力変更に即座に反応する日付表示
- **視覚的フィードバック**: 変更状態の明確な表示

### 技術的な学習ポイント

1. **複数状態管理**: `step`と`count`の 2 つの独立した状態
2. **HTML フォーム要素**: `input[type="range"]`と`input[type="text"]`の制御
3. **JavaScript Date API**: 日付計算と表示フォーマット
4. **条件付き表示**: リセットボタンの表示制御ロジック

## アプリケーションの段階的実装

### Phase 1: 基本構造とデータ設計

#### 状態設計の分析

このアプリケーションでは 2 つの独立した状態を管理します：

```jsx
import { useState } from "react";

function DateCounter() {
  // ステップ：一度に増減する日数の幅
  const [step, setStep] = useState(1);

  // カウント：現在日から何日後/前かを表す
  const [count, setCount] = useState(0);

  // 計算された日付（派生状態）
  const date = new Date();
  date.setDate(date.getDate() + count);

  return <div className="date-counter">{/* UI要素をここに実装 */}</div>;
}
```

**状態設計の理由**：

- **`step`**: ボタンクリック時の増減幅を制御（1〜10 の範囲）
- **`count`**: 最終的な日数を管理（負の値も許可）
- **独立性**: 2 つの状態は互いに独立して変更可能

#### 日付計算の実装

```jsx
function DateCounter() {
  const [step, setStep] = useState(1);
  const [count, setCount] = useState(0);

  // 現在日時を基準とした日付計算
  const date = new Date();
  date.setDate(date.getDate() + count);

  return (
    <div className="date-counter">
      <div className="date-display">
        <span>
          {count === 0 ? "Today is " : `${count} days from today is `}
          {date.toDateString()}
        </span>
      </div>
    </div>
  );
}
```

**日付計算の詳細解説**：

1. **基準日の取得**:

   ```jsx
   const date = new Date(); // 現在の日時を取得
   ```

2. **日数加算**:

   ```jsx
   date.setDate(date.getDate() + count);
   ```

   - `date.getDate()`: 現在の日を取得
   - `+ count`: 指定された日数を加算（負の値なら過去の日付）
   - `date.setDate()`: 新しい日付を設定

3. **自動的な月・年調整**:
   ```jsx
   // 例：12月31日 + 1日 = 自動的に翌年1月1日になる
   ```

### Phase 2: ステップ制御（スライダー実装）

#### HTML range input の制御

```jsx
function DateCounter() {
  const [step, setStep] = useState(1);
  const [count, setCount] = useState(0);

  const date = new Date();
  date.setDate(date.getDate() + count);

  return (
    <div className="date-counter">
      {/* ステップ制御スライダー */}
      <div className="step-control">
        <input
          type="range"
          min="1"
          max="10"
          value={step}
          onChange={(e) => setStep(Number(e.target.value))}
        />
        <span>Step: {step}</span>
      </div>

      {/* 日付表示 */}
      <div className="date-display">
        <span>
          {count === 0 ? "Today is " : `${count} days from today is `}
          {date.toDateString()}
        </span>
      </div>
    </div>
  );
}
```

**range input の特徴**：

1. **HTML 属性**:

   - `type="range"`: スライダー形式の入力フィールド
   - `min="1"`: 最小値（1 日）
   - `max="10"`: 最大値（10 日）
   - `value={step}`: 制御されたコンポーネント

2. **値の型変換**:
   ```jsx
   onChange={(e) => setStep(Number(e.target.value))}
   ```
   - `e.target.value`: 常に文字列型
   - `Number()`: 数値型に明示的変換

### Phase 3: カウント制御（ボタンとテキスト入力）

#### ボタンによる増減機能

```jsx
function DateCounter() {
  const [step, setStep] = useState(1);
  const [count, setCount] = useState(0);

  const date = new Date();
  date.setDate(date.getDate() + count);

  // ボタンクリックハンドラー
  const handleDecrement = () => {
    setCount(count - step);
  };

  const handleIncrement = () => {
    setCount(count + step);
  };

  return (
    <div className="date-counter">
      {/* ステップ制御 */}
      <div className="step-control">
        <input
          type="range"
          min="1"
          max="10"
          value={step}
          onChange={(e) => setStep(Number(e.target.value))}
        />
        <span>Step: {step}</span>
      </div>

      {/* カウント制御 */}
      <div className="count-control">
        <button onClick={handleDecrement}>-</button>
        <span>Count: {count}</span>
        <button onClick={handleIncrement}>+</button>
      </div>

      {/* 日付表示 */}
      <div className="date-display">
        <span>
          {count === 0 ? "Today is " : `${count} days from today is `}
          {date.toDateString()}
        </span>
      </div>
    </div>
  );
}
```

#### テキスト入力による直接指定

```jsx
function DateCounter() {
  const [step, setStep] = useState(1);
  const [count, setCount] = useState(0);

  const date = new Date();
  date.setDate(date.getDate() + count);

  const handleDecrement = () => {
    setCount(count - step);
  };

  const handleIncrement = () => {
    setCount(count + step);
  };

  return (
    <div className="date-counter">
      {/* ステップ制御 */}
      <div className="step-control">
        <input
          type="range"
          min="1"
          max="10"
          value={step}
          onChange={(e) => setStep(Number(e.target.value))}
        />
        <span>Step: {step}</span>
      </div>

      {/* カウント制御 - 改良版 */}
      <div className="count-control">
        <button onClick={handleDecrement}>-</button>
        <input
          type="number"
          value={count}
          onChange={(e) => setCount(Number(e.target.value))}
          placeholder="Enter days..."
        />
        <button onClick={handleIncrement}>+</button>
      </div>

      {/* 日付表示 */}
      <div className="date-display">
        <span>
          {count === 0 ? "Today is " : `${count} days from today is `}
          {date.toDateString()}
        </span>
      </div>
    </div>
  );
}
```

**テキスト入力の改善点**：

1. **直接編集可能**: ユーザーが任意の数値を直接入力
2. **制御されたコンポーネント**: `value`と`onChange`の組み合わせ
3. **型安全性**: `Number()`による確実な数値変換

### Phase 4: リセット機能と条件付き表示

#### リセットボタンの実装

```jsx
function DateCounter() {
  const [step, setStep] = useState(1);
  const [count, setCount] = useState(0);

  const date = new Date();
  date.setDate(date.getDate() + count);

  const handleDecrement = () => {
    setCount(count - step);
  };

  const handleIncrement = () => {
    setCount(count + step);
  };

  // リセット機能
  const handleReset = () => {
    setCount(0);
    setStep(1);
  };

  // リセットボタンの表示条件
  const shouldShowReset = count !== 0 || step !== 1;

  return (
    <div className="date-counter">
      {/* ステップ制御 */}
      <div className="step-control">
        <input
          type="range"
          min="1"
          max="10"
          value={step}
          onChange={(e) => setStep(Number(e.target.value))}
        />
        <span>Step: {step}</span>
      </div>

      {/* カウント制御 */}
      <div className="count-control">
        <button onClick={handleDecrement}>-</button>
        <input
          type="number"
          value={count}
          onChange={(e) => setCount(Number(e.target.value))}
        />
        <button onClick={handleIncrement}>+</button>
      </div>

      {/* 日付表示 */}
      <div className="date-display">
        <span>
          {count === 0 ? "Today is " : `${count} days from today is `}
          {date.toDateString()}
        </span>
      </div>

      {/* 条件付きリセットボタン */}
      {shouldShowReset && (
        <button className="reset-button" onClick={handleReset}>
          Reset
        </button>
      )}
    </div>
  );
}
```

**条件付き表示の詳細解説**：

1. **表示条件の判定**:

   ```jsx
   const shouldShowReset = count !== 0 || step !== 1;
   ```

   - `count !== 0`: カウントがデフォルト値から変更されている
   - `step !== 1`: ステップがデフォルト値から変更されている
   - `||`: いずれかが true なら表示

2. **条件付きレンダリング**:
   ```jsx
   {
     shouldShowReset && (
       <button className="reset-button" onClick={handleReset}>
         Reset
       </button>
     );
   }
   ```

## 高度な機能とユーザビリティ改善

### エラーハンドリングと入力検証

```jsx
function DateCounter() {
  const [step, setStep] = useState(1);
  const [count, setCount] = useState(0);

  // 安全な数値変換
  const handleCountChange = (e) => {
    const value = e.target.value;
    // 空文字列の場合は0として処理
    const numericValue = value === "" ? 0 : Number(value);

    // NaNチェック
    if (!isNaN(numericValue)) {
      setCount(numericValue);
    }
  };

  // 日付計算の安全な実装
  const calculateDate = () => {
    try {
      const date = new Date();
      date.setDate(date.getDate() + count);
      return date.toDateString();
    } catch (error) {
      console.error("Date calculation error:", error);
      return "Invalid Date";
    }
  };

  // ... 他の実装
}
```

### アクセシビリティ改善

```jsx
return (
  <div className="date-counter">
    {/* ステップ制御 - ラベル付き */}
    <div className="step-control">
      <label htmlFor="step-slider">Step: {step}</label>
      <input
        id="step-slider"
        type="range"
        min="1"
        max="10"
        value={step}
        onChange={(e) => setStep(Number(e.target.value))}
        aria-label={`Step size: ${step} days`}
      />
    </div>

    {/* カウント制御 - ラベル付き */}
    <div className="count-control">
      <button onClick={handleDecrement} aria-label={`Decrease by ${step} days`}>
        -
      </button>
      <label htmlFor="count-input" className="sr-only">
        Number of days
      </label>
      <input
        id="count-input"
        type="number"
        value={count}
        onChange={handleCountChange}
        aria-label="Number of days from today"
      />
      <button onClick={handleIncrement} aria-label={`Increase by ${step} days`}>
        +
      </button>
    </div>

    {/* 日付表示 */}
    <div className="date-display" role="status" aria-live="polite">
      <span>
        {count === 0 ? "Today is " : `${count} days from today is `}
        {calculateDate()}
      </span>
    </div>

    {/* リセットボタン */}
    {shouldShowReset && (
      <button
        className="reset-button"
        onClick={handleReset}
        aria-label="Reset to default values"
      >
        Reset
      </button>
    )}
  </div>
);
```

### CSS スタイリング

```css
.date-counter {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

.step-control,
.count-control {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.step-control input[type="range"] {
  flex: 1;
  height: 6px;
  background: #ddd;
  outline: none;
  border-radius: 3px;
}

.step-control input[type="range"]::-webkit-slider-thumb {
  appearance: none;
  width: 20px;
  height: 20px;
  background: #007bff;
  border-radius: 50%;
  cursor: pointer;
}

.count-control button {
  width: 40px;
  height: 40px;
  border: 2px solid #007bff;
  background: white;
  color: #007bff;
  border-radius: 50%;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;
}

.count-control button:hover {
  background: #007bff;
  color: white;
  transform: scale(1.1);
}

.count-control input[type="number"] {
  width: 100px;
  height: 40px;
  border: 2px solid #ddd;
  border-radius: 6px;
  text-align: center;
  font-size: 16px;
}

.count-control input[type="number"]:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
}

.date-display {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px;
  border-radius: 12px;
  text-align: center;
  font-size: 18px;
  font-weight: 500;
  margin: 20px 0;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.reset-button {
  display: block;
  margin: 20px auto 0;
  padding: 10px 20px;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.reset-button:hover {
  background: #c82333;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

## 完全なアプリケーション実装

```jsx
import React, { useState } from "react";
import "./DateCounter.css";

function DateCounter() {
  const [step, setStep] = useState(1);
  const [count, setCount] = useState(0);

  // 日付計算
  const date = new Date();
  date.setDate(date.getDate() + count);

  // イベントハンドラー
  const handleDecrement = () => {
    setCount(count - step);
  };

  const handleIncrement = () => {
    setCount(count + step);
  };

  const handleCountChange = (e) => {
    const value = e.target.value;
    const numericValue = value === "" ? 0 : Number(value);

    if (!isNaN(numericValue)) {
      setCount(numericValue);
    }
  };

  const handleReset = () => {
    setCount(0);
    setStep(1);
  };

  // リセットボタンの表示条件
  const shouldShowReset = count !== 0 || step !== 1;

  return (
    <div className="date-counter">
      {/* ステップ制御 */}
      <div className="step-control">
        <label htmlFor="step-slider">Step: {step}</label>
        <input
          id="step-slider"
          type="range"
          min="1"
          max="10"
          value={step}
          onChange={(e) => setStep(Number(e.target.value))}
          aria-label={`Step size: ${step} days`}
        />
      </div>

      {/* カウント制御 */}
      <div className="count-control">
        <button
          onClick={handleDecrement}
          aria-label={`Decrease by ${step} days`}
        >
          -
        </button>
        <input
          type="number"
          value={count}
          onChange={handleCountChange}
          aria-label="Number of days from today"
        />
        <button
          onClick={handleIncrement}
          aria-label={`Increase by ${step} days`}
        >
          +
        </button>
      </div>

      {/* 日付表示 */}
      <div className="date-display" role="status" aria-live="polite">
        <span>
          {count === 0 ? "Today is " : `${count} days from today is `}
          {date.toDateString()}
        </span>
      </div>

      {/* 条件付きリセットボタン */}
      {shouldShowReset && (
        <button
          className="reset-button"
          onClick={handleReset}
          aria-label="Reset to default values"
        >
          Reset
        </button>
      )}
    </div>
  );
}

export default DateCounter;
```

## 学習成果と発展的応用

### このチャレンジで習得したスキル

1. **複雑な状態管理**:

   - 2 つの独立した状態の協調動作
   - 状態間の相互作用の設計

2. **多様な HTML 要素の制御**:

   - `input[type="range"]` - スライダー制御
   - `input[type="number"]` - 数値入力制御
   - `button` - クリックイベント処理

3. **条件付き UI 制御**:

   - 動的な要素の表示/非表示
   - 複合条件による表示制御

4. **日付操作**:

   - JavaScript Date API の実践的使用
   - 日数計算と表示フォーマット

5. **ユーザビリティ設計**:
   - リセット機能の適切な実装
   - 直感的なインターフェース設計

### 実際の Web アプリケーションへの応用

この DateCounter アプリで学習したパターンは、以下のような実用的アプリケーションで活用できます：

**予約システム**:

- 宿泊期間の選択
- 到着日・出発日の計算
- 料金計算（日数 × 単価）

**プロジェクト管理ツール**:

- タスクの期限設定
- プロジェクトスケジュールの計算
- 進捗状況の可視化

**フィットネス・健康管理アプリ**:

- 目標達成日の計算
- 習慣追跡の日数計算
- 記録の期間設定

### 次のステップへの準備

このチャレンジで習得した複数状態管理のスキルは、より高度な React アプリケーション開発の基盤となります：

- **状態設計パターン**: 独立した状態 vs 派生状態の使い分け
- **フォーム制御**: 様々な入力要素の制御されたコンポーネント化
- **条件付きロジック**: 複雑な条件による動的 UI 制御
- **ユーザー体験**: 直感的で使いやすいインターフェース設計

これらのスキルを基盤として、次のセクションではさらに高度な React 概念である「Thinking in React」について学習していきます。
