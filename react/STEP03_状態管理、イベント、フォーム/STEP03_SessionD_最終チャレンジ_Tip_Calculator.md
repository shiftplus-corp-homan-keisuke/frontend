# SessionD: 最終チャレンジ - Tip Calculator

## 🎯 チャレンジ概要

この Session では、STEP03 で学習した全ての概念を統合し、実用的な Tip Calculator（チップ計算機）アプリケーションを構築します。このチャレンジは、React 開発における重要なスキルを総合的に評価し、実践する機会を提供します。

### 学習目標

- **複数コンポーネントの協調設計**: 独立したコンポーネントが連携して動作するアプリケーションの構築
- **状態のリフトアップの実践**: 複数コンポーネント間で共有される状態の適切な管理
- **派生ステートの活用**: 既存の状態から計算される値の効率的な実装
- **制御されたコンポーネントの応用**: フォーム要素の完全な制御
- **条件付きレンダリングの活用**: 状態に応じた動的 UI 表示

## アプリケーション仕様

### 機能要件

1. **請求金額入力**: ユーザーが食事代などの基本料金を入力
2. **満足度評価**: 本人とお友達それぞれがサービスに対する評価を選択
3. **自動チップ計算**: 2 人の評価の平均からチップ金額を算出
4. **合計金額表示**: 基本料金＋チップの総額を表示
5. **リセット機能**: 全ての入力値を初期状態に戻す

### UI 要件

- **段階的表示**: 請求金額が入力されるまで計算結果を非表示
- **リアルタイム更新**: 入力値変更時に即座に結果を更新
- **直感的なインターフェース**: 分かりやすいラベルとプレースホルダー

### 計算ロジック

```
チップ金額 = 請求金額 × (評価1 + 評価2) / 2 / 100
最終金額 = 請求金額 + チップ金額
```

### 評価オプション

- **不満 (0%)**: サービスに不満があった場合
- **普通 (5%)**: 標準的なサービス
- **良かった (10%)**: 良いサービスを受けた場合
- **素晴らしい (20%)**: 期待を上回る優秀なサービス

## アーキテクチャ設計

### コンポーネント構成

```
TipCalculator (親コンポーネント)
├─ BillInput (請求金額入力)
├─ SelectPercentage (満足度選択) ×2
├─ Output (計算結果表示)
└─ Reset (リセットボタン)
```

### 状態管理戦略

**すべての状態を親コンポーネント（TipCalculator）で管理する理由**：

1. **計算の一元化**: チップ計算には全ての入力値が必要
2. **状態の整合性**: 複数の入力が相互に影響する場合の一貫性保持
3. **リセット機能**: 全ての状態を一括でリセットする必要性

### データフロー設計

```
TipCalculator
├─ [bill, setBill] → BillInput
├─ [percentage1, setPercentage1] → SelectPercentage
├─ [percentage2, setPercentage2] → SelectPercentage
├─ [tip] (派生ステート) → Output
└─ [handleReset] → Reset
```

## 実装ガイド

### Step 1: プロジェクトセットアップ

```bash
npx create-react-app@5 tip-calculator
cd tip-calculator
npm start
```

基本的なファイル構成：

- App.js: メインアプリケーションファイル
- index.js: React DOM レンダリング
- styles.css: 最小限のスタイリング（オプション）

### Step 2: 静的レイアウトの構築

まず、全てのコンポーネントを静的な状態で作成します：

```javascript
import { useState } from "react";

function TipCalculator() {
  return (
    <div>
      <BillInput />
      <SelectPercentage>How did you like the service?</SelectPercentage>
      <SelectPercentage>How did your friend like the service?</SelectPercentage>
      <Output />
      <Reset />
    </div>
  );
}

function BillInput() {
  return (
    <div>
      <label>How much was the bill?</label>
      <input type="text" placeholder="Bill value" />
    </div>
  );
}

function SelectPercentage({ children }) {
  return (
    <div>
      <label>{children}</label>
      <select>
        <option value="0">Dissatisfied (0%)</option>
        <option value="5">It was okay (5%)</option>
        <option value="10">It was good (10%)</option>
        <option value="20">Absolutely amazing! (20%)</option>
      </select>
    </div>
  );
}

function Output() {
  return <h3>You pay $X ($Y + $Z tip)</h3>;
}

function Reset() {
  return <button>Reset</button>;
}
```

### Step 3: 状態管理の実装

親コンポーネントに状態を追加し、制御されたコンポーネントを実装：

```javascript
function TipCalculator() {
  const [bill, setBill] = useState("");
  const [percentage1, setPercentage1] = useState(0);
  const [percentage2, setPercentage2] = useState(0);

  const tip = bill * ((percentage1 + percentage2) / 2 / 100);

  function handleReset() {
    setBill("");
    setPercentage1(0);
    setPercentage2(0);
  }

  return (
    <div>
      <BillInput bill={bill} onSetBill={setBill} />

      <SelectPercentage percentage={percentage1} onSelect={setPercentage1}>
        How did you like the service?
      </SelectPercentage>

      <SelectPercentage percentage={percentage2} onSelect={setPercentage2}>
        How did your friend like the service?
      </SelectPercentage>

      {bill > 0 && (
        <>
          <Output bill={bill} tip={tip} />
          <Reset onReset={handleReset} />
        </>
      )}
    </div>
  );
}
```

### Step 4: 個別コンポーネントの完成

各コンポーネントで props を受け取り、制御されたコンポーネントとして実装：

#### BillInput コンポーネント

```javascript
function BillInput({ bill, onSetBill }) {
  return (
    <div>
      <label>How much was the bill?</label>
      <input
        type="text"
        placeholder="Bill value"
        value={bill}
        onChange={(e) => onSetBill(Number(e.target.value))}
      />
    </div>
  );
}
```

**重要ポイント**：

- `Number(e.target.value)`: 文字列を数値に変換
- `value={bill}`: 制御されたコンポーネントとして状態と同期
- `onChange`: 状態更新関数を呼び出し

#### SelectPercentage コンポーネント

```javascript
function SelectPercentage({ children, percentage, onSelect }) {
  return (
    <div>
      <label>{children}</label>
      <select
        value={percentage}
        onChange={(e) => onSelect(Number(e.target.value))}
      >
        <option value="0">Dissatisfied (0%)</option>
        <option value="5">It was okay (5%)</option>
        <option value="10">It was good (10%)</option>
        <option value="20">Absolutely amazing! (20%)</option>
      </select>
    </div>
  );
}
```

**設計上の特徴**：

- `children` prop: コンポーネントの再利用性を向上
- 同じコンポーネントで 2 つの異なる選択肢を表示
- 制御された select 要素の実装

#### Output コンポーネント

```javascript
function Output({ bill, tip }) {
  return (
    <h3>
      You pay ${bill + tip} (${bill} + ${tip} tip)
    </h3>
  );
}
```

**計算の表示**：

- `bill + tip`: 総額の計算
- 分かりやすい形式での情報表示

#### Reset コンポーネント

```javascript
function Reset({ onReset }) {
  return <button onClick={onReset}>Reset</button>;
}
```

### Step 5: 派生ステートと条件付きレンダリング

#### 派生ステートの実装

```javascript
const tip = bill * ((percentage1 + percentage2) / 2 / 100);
```

**なぜ派生ステートが適切か**：

- チップは他の状態から完全に計算可能
- 独立した状態として管理する必要がない
- 常に最新の値が自動計算される

#### 条件付きレンダリングの活用

```javascript
{
  bill > 0 && (
    <>
      <Output bill={bill} tip={tip} />
      <Reset onReset={handleReset} />
    </>
  );
}
```

**UI/UX の改善効果**：

- 請求金額が未入力時は結果を非表示
- 段階的な情報開示によるユーザビリティ向上
- React Fragment による不要な DOM 要素の排除

## 完成版実装

### App.js

```javascript
import { useState } from "react";
import "./App.css";

export default function App() {
  return (
    <div className="App">
      <TipCalculator />
    </div>
  );
}

function TipCalculator() {
  const [bill, setBill] = useState("");
  const [percentage1, setPercentage1] = useState(0);
  const [percentage2, setPercentage2] = useState(0);

  const tip = bill * ((percentage1 + percentage2) / 2 / 100);

  function handleReset() {
    setBill("");
    setPercentage1(0);
    setPercentage2(0);
  }

  return (
    <div>
      <BillInput bill={bill} onSetBill={setBill} />

      <SelectPercentage percentage={percentage1} onSelect={setPercentage1}>
        How did you like the service?
      </SelectPercentage>

      <SelectPercentage percentage={percentage2} onSelect={setPercentage2}>
        How did your friend like the service?
      </SelectPercentage>

      {bill > 0 && (
        <>
          <Output bill={bill} tip={tip} />
          <Reset onReset={handleReset} />
        </>
      )}
    </div>
  );
}

function BillInput({ bill, onSetBill }) {
  return (
    <div>
      <label>How much was the bill? </label>
      <input
        type="text"
        placeholder="Bill value"
        value={bill}
        onChange={(e) => onSetBill(Number(e.target.value))}
      />
    </div>
  );
}

function SelectPercentage({ children, percentage, onSelect }) {
  return (
    <div>
      <label>{children} </label>
      <select
        value={percentage}
        onChange={(e) => onSelect(Number(e.target.value))}
      >
        <option value="0">Dissatisfied (0%)</option>
        <option value="5">It was okay (5%)</option>
        <option value="10">It was good (10%)</option>
        <option value="20">Absolutely amazing! (20%)</option>
      </select>
    </div>
  );
}

function Output({ bill, tip }) {
  return (
    <h3>
      You pay ${bill + tip} (${bill} + ${tip} tip)
    </h3>
  );
}

function Reset({ onReset }) {
  return <button onClick={onReset}>Reset</button>;
}
```

### 基本的な CSS（オプション）

```css
.App {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  max-width: 500px;
  margin: 50px auto;
  padding: 20px;
}

div {
  margin: 15px 0;
}

label {
  display: inline-block;
  width: 300px;
  font-weight: 500;
}

input,
select {
  padding: 8px 12px;
  border: 2px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

button:hover {
  background-color: #0056b3;
}

h3 {
  background-color: #f8f9fa;
  padding: 15px;
  border-radius: 4px;
  margin: 20px 0;
}
```

## 学習ポイント解説

### 1. 状態のリフトアップ

**課題**: 各コンポーネントで個別に状態を管理すると、チップ計算ができない

**解決**: 親コンポーネントで全状態を管理し、props で値と更新関数を渡す

```javascript
// ❌ 個別管理（計算不可能）
function BillInput() {
  const [bill, setBill] = useState(""); // この値を他コンポーネントで使えない
}

// ✅ リフトアップ（計算可能）
function TipCalculator() {
  const [bill, setBill] = useState(""); // 全コンポーネントからアクセス可能
  return <BillInput bill={bill} onSetBill={setBill} />;
}
```

### 2. 派生ステートの効果的活用

**課題**: チップを独立した状態として管理すると同期の問題が発生

**解決**: 既存の状態から計算される値として実装

```javascript
// ❌ 独立した状態（同期問題のリスク）
const [tip, setTip] = useState(0);
// bill, percentage1, percentage2が変更される度にsetTipを呼ぶ必要

// ✅ 派生ステート（自動同期）
const tip = bill * ((percentage1 + percentage2) / 2 / 100);
// 依存する状態が変わると自動的に再計算される
```

### 3. children prop による再利用性

**課題**: 似た機能の 2 つの select 要素を別々のコンポーネントで管理

**解決**: children prop を活用して 1 つのコンポーネントで 2 つの用途に対応

```javascript
// 同じコンポーネントで異なるラベルを表示
<SelectPercentage percentage={percentage1} onSelect={setPercentage1}>
  How did you like the service?
</SelectPercentage>

<SelectPercentage percentage={percentage2} onSelect={setPercentage2}>
  How did your friend like the service?
</SelectPercentage>
```

### 4. 制御されたコンポーネントの実践

**3 つのステップの実装例**：

```javascript
// 1. 状態の作成
const [bill, setBill] = useState("");

// 2. 要素のvalue属性に状態をバインド
<input value={bill} />

// 3. onChange イベントで状態を更新
<input
  value={bill}
  onChange={(e) => setBill(Number(e.target.value))}
/>
```

## チャレンジの拡張アイデア

### レベル 1: 基本機能の改善

1. **バリデーション追加**: 負の数や非数値入力の処理
2. **通貨フォーマット**: ドル記号と小数点以下 2 桁の表示
3. **キーボードサポート**: Enter キーでの操作対応

### レベル 2: 機能追加

1. **人数変更**: 2 人以外の人数にも対応
2. **カスタム評価**: ユーザー定義の評価パーセンテージ
3. **計算履歴**: 過去の計算結果の保存と表示

### レベル 3: UX/UI 改善

1. **アニメーション**: 結果表示時のスムーズな遷移
2. **レスポンシブデザイン**: モバイル端末での最適化
3. **ダークモード**: テーマ切替機能

## まとめ

この Tip Calculator チャレンジでは、STEP03 で学習した以下の重要概念を統合して実践しました：

### 技術的な習得内容

- **状態のリフトアップ**: 複数コンポーネント間でのデータ共有
- **制御されたコンポーネント**: フォーム要素の完全制御
- **派生ステート**: 効率的な計算値の管理
- **children prop**: コンポーネントの再利用性向上
- **条件付きレンダリング**: 動的 UI 制御

### 設計思考の発展

- **コンポーネント分割**: 単一責任の原則に基づく設計
- **データフロー設計**: 一方向データフローの実装
- **状態管理戦略**: 適切な状態配置の判断

### 実用的スキル

- **ユーザビリティ**: 段階的情報開示による使いやすさ向上
- **計算ロジック**: ビジネス要件の正確な実装
- **エラー処理**: 予期しない入力への対応

このチャレンジの完成により、実用的な React アプリケーションを独立して開発できる基盤が確立されました。これらのスキルは、より複雑な Web アプリケーション開発における重要な基礎となります。

次のステップでは、これらの基礎の上により高度な概念（ルーティング、グローバル状態管理、パフォーマンス最適化など）を学習し、プロダクション品質のアプリケーション開発に進むことができます。
