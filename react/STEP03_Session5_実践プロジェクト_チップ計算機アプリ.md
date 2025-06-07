# STEP03 Session 5: 実践プロジェクト - チップ計算機アプリ

> ⏰ **セッション時間**: 120 分
> 🎯 **目標**: これまで学んだステート管理、イベント処理、フォーム管理、コンポーネント設計を統合し、完全なチップ計算機アプリを構築する
> 📋 **前提**: Session 1-4 での全ての概念の理解

## 📅 セッション構成

| 時間       | 内容                                     | 形式 | 成果物                         |
| ---------- | ---------------------------------------- | ---- | ------------------------------ |
| 0-20 分    | プロジェクト要件分析とコンポーネント設計 | 講義 | 設計ドキュメント               |
| 20-60 分   | コアコンポーネントの実装                 | 実践 | 基本計算ロジック               |
| 60-100 分  | UI 改善とユーザーエクスペリエンス向上    | 実践 | 完成したアプリケーション       |
| 100-120 分 | テスト・デバッグ・リファクタリング       | 実践 | 本格運用可能なアプリケーション |

## 🎯 学習目標の詳細

### 💡 このセッションで身につけること

- [ ] 複数のステートを効率的に管理する設計パターンの実装
- [ ] 制御されたコンポーネントとフォームバリデーションの統合
- [ ] ユーザーフレンドリーなインターフェースの構築
- [ ] エラーハンドリングとエッジケースの対応
- [ ] パフォーマンス最適化テクニックの適用

### 📝 最終成果物

- **チップ計算機アプリケーション**:
  - 料金とチップ率の入力機能
  - リアルタイム計算結果表示
  - 人数分の分割計算
  - 計算履歴機能
  - レスポンシブ対応 UI

## 📋 プロジェクト要件分析

### 🎯 機能要件

#### Level 1: 基本機能

- **料金入力**: 基本料金の入力と検証
- **チップ率選択**: プリセット率と カスタム率の選択
- **計算結果表示**: チップ額、合計額の表示
- **人数分割**: 人数による金額分割計算

#### Level 2: 高度な機能

- **計算履歴**: 過去の計算結果の保存と表示
- **設定保存**: ユーザー設定のローカルストレージ保存
- **エラーハンドリング**: 不正入力の検証とエラー表示
- **レスポンシブ UI**: モバイル・デスクトップ対応

### 🏗️ コンポーネント設計

#### アーキテクチャ概要

```typescript
// 🏗️ コンポーネント構造
App
├── Header (タイトル、設定アイコン)
├── Calculator (メイン計算エリア)
│   ├── BillInput (料金入力)
│   ├── TipSelector (チップ率選択)
│   ├── PeopleCounter (人数選択)
│   └── ResultDisplay (計算結果)
├── History (計算履歴)
│   └── HistoryItem (履歴アイテム)
└── Footer (情報、リンク)
```

#### データ構造設計

```typescript
// 📊 型定義
interface CalculationState {
  billAmount: number;
  tipPercentage: number;
  numberOfPeople: number;
  customTip: string;
}

interface CalculationResult {
  tipAmount: number;
  totalAmount: number;
  amountPerPerson: number;
  tipPerPerson: number;
}

interface HistoryItem {
  id: string;
  timestamp: Date;
  billAmount: number;
  tipPercentage: number;
  numberOfPeople: number;
  result: CalculationResult;
}

interface AppSettings {
  defaultTipPercentage: number;
  currency: string;
  saveHistory: boolean;
}
```

## 💻 実装フェーズ 1: コアコンポーネント

### 🚀 Step 1: メインアプリケーション構造

```typescript
// App.tsx
import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import Calculator from "./components/Calculator";
import History from "./components/History";
import Footer from "./components/Footer";

interface CalculationState {
  billAmount: number;
  tipPercentage: number;
  numberOfPeople: number;
  customTip: string;
}

interface CalculationResult {
  tipAmount: number;
  totalAmount: number;
  amountPerPerson: number;
  tipPerPerson: number;
}

interface HistoryItem {
  id: string;
  timestamp: Date;
  billAmount: number;
  tipPercentage: number;
  numberOfPeople: number;
  result: CalculationResult;
}

interface AppSettings {
  defaultTipPercentage: number;
  currency: string;
  saveHistory: boolean;
  theme: "light" | "dark";
}

function App() {
  // メインステート管理
  const [calculationState, setCalculationState] = useState<CalculationState>({
    billAmount: 0,
    tipPercentage: 15,
    numberOfPeople: 1,
    customTip: "",
  });

  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [settings, setSettings] = useState<AppSettings>({
    defaultTipPercentage: 15,
    currency: "¥",
    saveHistory: true,
    theme: "light",
  });

  const [showHistory, setShowHistory] = useState(false);

  // ローカルストレージからの設定読み込み
  useEffect(() => {
    const savedSettings = localStorage.getItem("tip-calculator-settings");
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings(parsed);
        setCalculationState((prev) => ({
          ...prev,
          tipPercentage: parsed.defaultTipPercentage,
        }));
      } catch (error) {
        console.error("設定の読み込みに失敗しました:", error);
      }
    }

    const savedHistory = localStorage.getItem("tip-calculator-history");
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory);
        setHistory(
          parsed.map((item: any) => ({
            ...item,
            timestamp: new Date(item.timestamp),
          }))
        );
      } catch (error) {
        console.error("履歴の読み込みに失敗しました:", error);
      }
    }
  }, []);

  // 設定の保存
  useEffect(() => {
    localStorage.setItem("tip-calculator-settings", JSON.stringify(settings));
  }, [settings]);

  // 履歴の保存
  useEffect(() => {
    if (settings.saveHistory) {
      localStorage.setItem("tip-calculator-history", JSON.stringify(history));
    }
  }, [history, settings.saveHistory]);

  // 計算結果の算出
  const calculateResult = React.useMemo((): CalculationResult => {
    const { billAmount, tipPercentage, numberOfPeople } = calculationState;

    const tipAmount = (billAmount * tipPercentage) / 100;
    const totalAmount = billAmount + tipAmount;
    const amountPerPerson = totalAmount / numberOfPeople;
    const tipPerPerson = tipAmount / numberOfPeople;

    return {
      tipAmount: Number(tipAmount.toFixed(2)),
      totalAmount: Number(totalAmount.toFixed(2)),
      amountPerPerson: Number(amountPerPerson.toFixed(2)),
      tipPerPerson: Number(tipPerPerson.toFixed(2)),
    };
  }, [calculationState]);

  // 計算結果を履歴に追加
  const addToHistory = () => {
    if (calculationState.billAmount > 0 && settings.saveHistory) {
      const historyItem: HistoryItem = {
        id: Date.now().toString(),
        timestamp: new Date(),
        billAmount: calculationState.billAmount,
        tipPercentage: calculationState.tipPercentage,
        numberOfPeople: calculationState.numberOfPeople,
        result: calculateResult,
      };

      setHistory((prev) => [historyItem, ...prev.slice(0, 19)]); // 最大20件
    }
  };

  // 履歴のクリア
  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem("tip-calculator-history");
  };

  // 計算ステートの更新
  const updateCalculationState = (updates: Partial<CalculationState>) => {
    setCalculationState((prev) => ({ ...prev, ...updates }));
  };

  return (
    <div className={`min-h-screen ${settings.theme === "dark" ? "dark" : ""}`}>
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
        <Header
          onToggleHistory={() => setShowHistory(!showHistory)}
          onSettingsChange={setSettings}
          settings={settings}
          showHistory={showHistory}
        />

        <main className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            {!showHistory ? (
              <>
                <Calculator
                  state={calculationState}
                  result={calculateResult}
                  onStateChange={updateCalculationState}
                  settings={settings}
                />

                <div className="mt-6 text-center">
                  <button
                    onClick={addToHistory}
                    disabled={calculationState.billAmount <= 0}
                    className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 
                             text-white px-6 py-2 rounded-lg transition-colors"
                  >
                    計算結果を保存
                  </button>
                </div>
              </>
            ) : (
              <History
                history={history}
                onClearHistory={clearHistory}
                onRestoreCalculation={(item) => {
                  setCalculationState({
                    billAmount: item.billAmount,
                    tipPercentage: item.tipPercentage,
                    numberOfPeople: item.numberOfPeople,
                    customTip: "",
                  });
                  setShowHistory(false);
                }}
                settings={settings}
              />
            )}
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}

export default App;
```

### 🚀 Step 2: 計算機コンポーネント

```typescript
// components/Calculator.tsx
import React from "react";
import BillInput from "./BillInput";
import TipSelector from "./TipSelector";
import PeopleCounter from "./PeopleCounter";
import ResultDisplay from "./ResultDisplay";

interface CalculatorProps {
  state: CalculationState;
  result: CalculationResult;
  onStateChange: (updates: Partial<CalculationState>) => void;
  settings: AppSettings;
}

function Calculator({
  state,
  result,
  onStateChange,
  settings,
}: CalculatorProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 space-y-8">
      {/* 料金入力セクション */}
      <BillInput
        value={state.billAmount}
        onChange={(billAmount) => onStateChange({ billAmount })}
        currency={settings.currency}
      />

      {/* チップ率選択セクション */}
      <TipSelector
        selectedPercentage={state.tipPercentage}
        customTip={state.customTip}
        onPercentageChange={(tipPercentage) =>
          onStateChange({ tipPercentage, customTip: "" })
        }
        onCustomTipChange={(customTip, tipPercentage) =>
          onStateChange({ customTip, tipPercentage })
        }
      />

      {/* 人数選択セクション */}
      <PeopleCounter
        numberOfPeople={state.numberOfPeople}
        onChange={(numberOfPeople) => onStateChange({ numberOfPeople })}
      />

      {/* 計算結果表示 */}
      <ResultDisplay
        result={result}
        currency={settings.currency}
        billAmount={state.billAmount}
      />
    </div>
  );
}

export default Calculator;
```

### 🚀 Step 3: 料金入力コンポーネント

```typescript
// components/BillInput.tsx
import React, { useState } from "react";

interface BillInputProps {
  value: number;
  onChange: (value: number) => void;
  currency: string;
}

function BillInput({ value, onChange, currency }: BillInputProps) {
  const [inputValue, setInputValue] = useState(value.toString());
  const [error, setError] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    // リアルタイムバリデーション
    if (newValue === "") {
      setError("");
      onChange(0);
      return;
    }

    const numericValue = parseFloat(newValue);

    if (isNaN(numericValue)) {
      setError("有効な数値を入力してください");
      return;
    }

    if (numericValue < 0) {
      setError("負の値は入力できません");
      return;
    }

    if (numericValue > 1000000) {
      setError("金額が大きすぎます");
      return;
    }

    setError("");
    onChange(numericValue);
  };

  const handleBlur = () => {
    // フォーカスが外れた時の処理
    if (value > 0) {
      setInputValue(value.toString());
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        料金を入力
      </label>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <span className="text-gray-500 dark:text-gray-400 text-lg">
            {currency}
          </span>
        </div>

        <input
          type="number"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleBlur}
          placeholder="0.00"
          step="0.01"
          min="0"
          className={`
            block w-full pl-8 pr-3 py-3 text-lg
            border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent
            bg-gray-50 dark:bg-gray-700 dark:border-gray-600
            text-gray-900 dark:text-white
            placeholder-gray-500 dark:placeholder-gray-400
            ${error ? "border-red-500" : "border-gray-300"}
          `}
        />
      </div>

      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

      {value > 0 && !error && (
        <p className="text-green-600 text-sm mt-1">
          ✓ 料金: {currency}
          {value.toLocaleString()}
        </p>
      )}
    </div>
  );
}

export default BillInput;
```

### 🚀 Step 4: チップ率選択コンポーネント

```typescript
// components/TipSelector.tsx
import React, { useState } from "react";

interface TipSelectorProps {
  selectedPercentage: number;
  customTip: string;
  onPercentageChange: (percentage: number) => void;
  onCustomTipChange: (customTip: string, percentage: number) => void;
}

const PRESET_PERCENTAGES = [10, 15, 18, 20, 25];

function TipSelector({
  selectedPercentage,
  customTip,
  onPercentageChange,
  onCustomTipChange,
}: TipSelectorProps) {
  const [showCustomInput, setShowCustomInput] = useState(false);

  const handlePresetClick = (percentage: number) => {
    setShowCustomInput(false);
    onPercentageChange(percentage);
  };

  const handleCustomClick = () => {
    setShowCustomInput(true);
  };

  const handleCustomInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numericValue = parseFloat(value) || 0;

    onCustomTipChange(value, numericValue);
  };

  const isPresetSelected = (percentage: number) => {
    return (
      selectedPercentage === percentage && !showCustomInput && customTip === ""
    );
  };

  const isCustomSelected = showCustomInput || customTip !== "";

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        チップ率を選択
      </label>

      {/* プリセットボタン */}
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
        {PRESET_PERCENTAGES.map((percentage) => (
          <button
            key={percentage}
            onClick={() => handlePresetClick(percentage)}
            className={`
              py-3 px-4 rounded-lg text-lg font-semibold transition-all
              ${
                isPresetSelected(percentage)
                  ? "bg-blue-500 text-white shadow-lg transform scale-105"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600"
              }
            `}
          >
            {percentage}%
          </button>
        ))}

        {/* カスタムボタン */}
        <button
          onClick={handleCustomClick}
          className={`
            py-3 px-4 rounded-lg text-lg font-semibold transition-all
            ${
              isCustomSelected
                ? "bg-green-500 text-white shadow-lg transform scale-105"
                : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600"
            }
          `}
        >
          カスタム
        </button>
      </div>

      {/* カスタム入力フィールド */}
      {showCustomInput && (
        <div className="mt-4">
          <div className="relative">
            <input
              type="number"
              value={customTip}
              onChange={handleCustomInputChange}
              placeholder="カスタム率を入力"
              min="0"
              max="100"
              step="0.1"
              className="
                block w-full pr-8 pl-3 py-3 text-lg
                border border-gray-300 dark:border-gray-600 rounded-lg
                focus:ring-2 focus:ring-green-500 focus:border-transparent
                bg-gray-50 dark:bg-gray-700
                text-gray-900 dark:text-white
                placeholder-gray-500 dark:placeholder-gray-400
              "
              autoFocus
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-500 dark:text-gray-400 text-lg">
                %
              </span>
            </div>
          </div>

          {customTip && parseFloat(customTip) > 50 && (
            <p className="text-yellow-600 text-sm mt-1">
              ⚠️ 高いチップ率が設定されています
            </p>
          )}
        </div>
      )}

      {/* 選択状態の表示 */}
      <div className="text-center">
        <p className="text-gray-600 dark:text-gray-400">
          選択中のチップ率:
          <span className="font-bold text-lg ml-1 text-blue-600 dark:text-blue-400">
            {selectedPercentage}%
          </span>
        </p>
      </div>
    </div>
  );
}

export default TipSelector;
```

## 💻 実装フェーズ 2: UI 改善とユーザーエクスペリエンス

### 🚀 Step 5: 計算結果表示コンポーネント

```typescript
// components/ResultDisplay.tsx
import React from "react";

interface ResultDisplayProps {
  result: CalculationResult;
  currency: string;
  billAmount: number;
}

function ResultDisplay({ result, currency, billAmount }: ResultDisplayProps) {
  const formatCurrency = (amount: number) => {
    return `${currency}${amount.toLocaleString()}`;
  };

  const isEmpty = billAmount <= 0;

  if (isEmpty) {
    return (
      <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 text-center">
        <p className="text-gray-500 dark:text-gray-400 text-lg">
          料金を入力して計算を開始してください
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600 rounded-xl p-6 space-y-6">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white text-center">
        計算結果
      </h3>

      {/* メイン結果 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center shadow">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
            チップ額
          </p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
            {formatCurrency(result.tipAmount)}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center shadow">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
            合計金額
          </p>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {formatCurrency(result.totalAmount)}
          </p>
        </div>
      </div>

      {/* 分割計算結果 */}
      <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 text-center">
          一人あたりの金額
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              チップ
            </p>
            <p className="text-xl font-bold text-green-600 dark:text-green-400">
              {formatCurrency(result.tipPerPerson)}
            </p>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              合計
            </p>
            <p className="text-xl font-bold text-purple-600 dark:text-purple-400">
              {formatCurrency(result.amountPerPerson)}
            </p>
          </div>
        </div>
      </div>

      {/* 詳細表示 */}
      <div className="text-xs text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 rounded-lg p-3">
        <p>料金: {formatCurrency(billAmount - result.tipAmount)}</p>
        <p>チップ: {formatCurrency(result.tipAmount)}</p>
        <p className="font-semibold border-t pt-1 mt-1">
          合計: {formatCurrency(result.totalAmount)}
        </p>
      </div>
    </div>
  );
}

export default ResultDisplay;
```

### 🚀 Step 6: 人数選択コンポーネント

```typescript
// components/PeopleCounter.tsx
import React from "react";

interface PeopleCounterProps {
  numberOfPeople: number;
  onChange: (count: number) => void;
}

function PeopleCounter({ numberOfPeople, onChange }: PeopleCounterProps) {
  const increment = () => {
    if (numberOfPeople < 20) {
      onChange(numberOfPeople + 1);
    }
  };

  const decrement = () => {
    if (numberOfPeople > 1) {
      onChange(numberOfPeople - 1);
    }
  };

  const handleDirectInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 1;
    if (value >= 1 && value <= 20) {
      onChange(value);
    }
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        人数を選択
      </label>

      <div className="flex items-center justify-center space-x-4">
        <button
          onClick={decrement}
          disabled={numberOfPeople <= 1}
          className="
            w-12 h-12 rounded-full bg-red-500 hover:bg-red-600 disabled:bg-gray-300
            text-white font-bold text-xl
            transition-colors flex items-center justify-center
            disabled:cursor-not-allowed
          "
        >
          −
        </button>

        <div className="flex flex-col items-center">
          <input
            type="number"
            value={numberOfPeople}
            onChange={handleDirectInput}
            min="1"
            max="20"
            className="
              w-20 h-12 text-2xl font-bold text-center
              border-2 border-gray-300 dark:border-gray-600 rounded-lg
              bg-white dark:bg-gray-700
              text-gray-900 dark:text-white
              focus:ring-2 focus:ring-blue-500 focus:border-transparent
            "
          />
          <span className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {numberOfPeople === 1 ? "人" : "人"}
          </span>
        </div>

        <button
          onClick={increment}
          disabled={numberOfPeople >= 20}
          className="
            w-12 h-12 rounded-full bg-green-500 hover:bg-green-600 disabled:bg-gray-300
            text-white font-bold text-xl
            transition-colors flex items-center justify-center
            disabled:cursor-not-allowed
          "
        >
          +
        </button>
      </div>

      {/* 人数表示とクイック選択 */}
      <div className="text-center">
        <p className="text-gray-600 dark:text-gray-400 mb-2">クイック選択</p>
        <div className="flex justify-center space-x-2">
          {[1, 2, 4, 6, 8, 10].map((count) => (
            <button
              key={count}
              onClick={() => onChange(count)}
              className={`
                w-8 h-8 rounded text-sm font-medium transition-colors
                ${
                  numberOfPeople === count
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500"
                }
              `}
            >
              {count}
            </button>
          ))}
        </div>
      </div>

      {numberOfPeople > 10 && (
        <p className="text-yellow-600 text-sm text-center">
          💡 大人数での利用ですね！各自で確認することをお勧めします。
        </p>
      )}
    </div>
  );
}

export default PeopleCounter;
```

### 🚀 Step 7: 履歴表示コンポーネント

```typescript
// components/History.tsx
import React, { useState } from "react";

interface HistoryProps {
  history: HistoryItem[];
  onClearHistory: () => void;
  onRestoreCalculation: (item: HistoryItem) => void;
  settings: AppSettings;
}

function History({
  history,
  onClearHistory,
  onRestoreCalculation,
  settings,
}: HistoryProps) {
  const [filter, setFilter] = useState<"all" | "recent" | "high-tip">("all");

  const formatCurrency = (amount: number) => {
    return `${settings.currency}${amount.toLocaleString()}`;
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("ja-JP", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const filteredHistory = React.useMemo(() => {
    switch (filter) {
      case "recent":
        return history.slice(0, 5);
      case "high-tip":
        return history.filter((item) => item.tipPercentage >= 20);
      default:
        return history;
    }
  }, [history, filter]);

  if (!settings.saveHistory) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 text-center">
        <p className="text-gray-500 dark:text-gray-400">
          履歴機能が無効になっています。設定から有効にしてください。
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          計算履歴
        </h2>

        {history.length > 0 && (
          <button
            onClick={onClearHistory}
            className="text-red-500 hover:text-red-700 text-sm"
          >
            すべてクリア
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            履歴がありません
          </p>
          <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
            計算結果を保存すると、ここに表示されます
          </p>
        </div>
      ) : (
        <>
          {/* フィルター */}
          <div className="mb-4">
            <div className="flex space-x-2">
              <button
                onClick={() => setFilter("all")}
                className={`px-3 py-1 rounded text-sm ${
                  filter === "all"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300"
                }`}
              >
                すべて ({history.length})
              </button>
              <button
                onClick={() => setFilter("recent")}
                className={`px-3 py-1 rounded text-sm ${
                  filter === "recent"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300"
                }`}
              >
                最近
              </button>
              <button
                onClick={() => setFilter("high-tip")}
                className={`px-3 py-1 rounded text-sm ${
                  filter === "high-tip"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300"
                }`}
              >
                高チップ率
              </button>
            </div>
          </div>

          {/* 履歴リスト */}
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredHistory.map((item) => (
              <div
                key={item.id}
                className="border dark:border-gray-600 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-2">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(item.timestamp)}
                      </span>
                      <span className="text-sm bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded">
                        {item.numberOfPeople}人
                      </span>
                      <span className="text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                        {item.tipPercentage}%
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">料金</p>
                        <p className="font-semibold">
                          {formatCurrency(item.billAmount)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">合計</p>
                        <p className="font-semibold">
                          {formatCurrency(item.result.totalAmount)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">
                          一人あたり
                        </p>
                        <p className="font-semibold text-blue-600 dark:text-blue-400">
                          {formatCurrency(item.result.amountPerPerson)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">
                          チップ
                        </p>
                        <p className="font-semibold text-green-600 dark:text-green-400">
                          {formatCurrency(item.result.tipAmount)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => onRestoreCalculation(item)}
                    className="ml-4 text-blue-500 hover:text-blue-700 text-sm"
                  >
                    復元
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default History;
```

## 🔗 セッション ナビゲーション

### 📚 STEP03 全体の学習フロー

**[メイン ページ](STEP03_ステート、イベント、フォーム_基礎とTypeScript統合.md)**に戻る

| 前のセッション                                                                                                | 現在のセッション                                        | 次のステップ                                      |
| ------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------- | ------------------------------------------------- |
| 📄 [Session 4: インタラクティブなコンポーネント設計](STEP03_Session4_インタラクティブなコンポーネント設計.md) | 📍 **Session 5: 実践プロジェクト - チップ計算機アプリ** | 🚀 **STEP04: コンポーネント設計とカスタムフック** |

### 🎯 Session 1-4 の統合学習

このセッションでは、以下の学習内容を統合的に活用します：

- **Session 1**: useState による基本的なステート管理
- **Session 2**: 制御されたコンポーネントとフォーム管理
- **Session 3**: 派生ステート、useMemo による最適化
- **Session 4**: ステートのリフトアップ、再利用可能なコンポーネント設計

### 🎯 STEP04 への準備

完成したチップ計算機アプリの経験は、STEP04 でのカスタムフック設計とより高度なコンポーネントパターンの基礎となります。

---

## 💯 最終調整とテスト

### 🔍 エラーハンドリングの改善

```typescript
// utils/validation.ts
export const validateBillAmount = (amount: number): string[] => {
  const errors: string[] = [];

  if (isNaN(amount)) {
    errors.push("有効な数値を入力してください");
  } else {
    if (amount < 0) {
      errors.push("負の値は入力できません");
    }
    if (amount > 1000000) {
      errors.push("金額が大きすぎます（上限: 1,000,000円）");
    }
    if (amount > 0 && amount < 1) {
      errors.push("金額が小さすぎます（最小: 1円）");
    }
  }

  return errors;
};

export const validateTipPercentage = (percentage: number): string[] => {
  const errors: string[] = [];

  if (isNaN(percentage)) {
    errors.push("有効な数値を入力してください");
  } else {
    if (percentage < 0) {
      errors.push("チップ率は負の値にできません");
    }
    if (percentage > 100) {
      errors.push("チップ率は100%を超えることはできません");
    }
  }

  return errors;
};

export const validateNumberOfPeople = (count: number): string[] => {
  const errors: string[] = [];

  if (isNaN(count) || !Number.isInteger(count)) {
    errors.push("有効な整数を入力してください");
  } else {
    if (count < 1) {
      errors.push("人数は1人以上である必要があります");
    }
    if (count > 20) {
      errors.push("人数は20人以下である必要があります");
    }
  }

  return errors;
};
```

### 🎨 アクセシビリティの改善

```typescript
// components/AccessibleButton.tsx
interface AccessibleButtonProps {
  onClick: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "danger";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
  ariaLabel?: string;
}

function AccessibleButton({
  onClick,
  disabled = false,
  variant = "primary",
  size = "md",
  children,
  ariaLabel,
}: AccessibleButtonProps) {
  const baseClasses =
    "font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";

  const variantClasses = {
    primary: "bg-blue-500 hover:bg-blue-600 text-white focus:ring-blue-500",
    secondary:
      "bg-gray-200 hover:bg-gray-300 text-gray-900 focus:ring-gray-500",
    danger: "bg-red-500 hover:bg-red-600 text-white focus:ring-red-500",
  };

  const sizeClasses = {
    sm: "px-2 py-1 text-sm",
    md: "px-4 py-2",
    lg: "px-6 py-3 text-lg",
  };

  const disabledClasses =
    "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-current";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${disabledClasses}
      `}
    >
      {children}
    </button>
  );
}
```

### 💻 実践演習

#### 演習 5-1: バリデーション強化

**🎯 演習目的**: より堅牢なバリデーション機能の実装

**📋 要件**:

- リアルタイムエラー表示
- 複数エラーの同時表示
- 親しみやすいエラーメッセージ

#### 演習 5-2: 追加機能実装

**🎯 演習目的**: 機能拡張による実践力向上

**📋 要件**:

- 計算履歴のエクスポート機能
- 設定画面の実装
- ダークモード切り替え

#### 演習 5-3: パフォーマンス最適化

**🎯 演習目的**: React の最適化技術の習得

**📋 要件**:

- memo、useMemo、useCallback の適切な使用
- 不要な再レンダリングの削除
- パフォーマンス測定とモニタリング

### 🔍 理解度チェック

最終チェックリスト：

1. **ステート管理**: 複雑なステートを効率的に管理できていますか？
2. **イベント処理**: 全てのユーザーインタラクションが適切に処理されていますか？
3. **フォーム管理**: バリデーションとエラーハンドリングが実装されていますか？
4. **コンポーネント設計**: 再利用可能で保守しやすいコンポーネントになっていますか？
5. **ユーザーエクスペリエンス**: 直感的で使いやすいインターフェースになっていますか？

## 🗒️ セッションまとめ

### ✅ 完成した機能

- **基本計算機能**: 料金、チップ率、人数による計算
- **高度な UI**: レスポンシブデザイン、ダークモード対応
- **履歴機能**: 計算結果の保存・復元・管理
- **バリデーション**: 包括的な入力検証とエラーハンドリング
- **設定機能**: ユーザー設定の永続化

### 📚 習得した技術

- **統合ステート管理**: useState、useMemo、Context API の実践的活用
- **高度なフォーム管理**: 制御されたコンポーネント、バリデーション、エラーハンドリング
- **コンポーネント設計**: 再利用性、保守性、テスタビリティを考慮した設計
- **パフォーマンス最適化**: メモ化、効率的な再レンダリング制御
- **ユーザーエクスペリエンス**: アクセシビリティ、レスポンシブ設計、直感的な UI

### 🚀 次のステップ

**STEP04: コンポーネント設計とカスタムフック**への準備完了です！

今回のプロジェクトで習得したスキル：

- ✅ 複合ステート管理の実装経験
- ✅ リアルタイム UI の構築技術
- ✅ 実用的な Web アプリケーション開発経験
- ✅ TypeScript 統合による型安全な開発

これらの経験は、STEP04 での以下の学習に直接活用されます：

- **カスタムフック**: ステートロジックの抽象化と再利用
- **高度なコンポーネントパターン**: Compound Components、Render Props
- **状態管理ライブラリ**: Context API から Zustand/Redux への発展
- **パフォーマンス最適化**: React.memo、useCallback、useMemo の実践的活用

---

🎉 **おめでとうございます！**
STEP03 のすべてのセッションを完了し、React における基本的なステート管理とインタラクティブなコンポーネント設計をマスターしました。

**📚 [STEP03 メイン ページ](STEP03_ステート、イベント、フォーム_基礎とTypeScript統合.md)**に戻って全体の振り返りを行い、次のステップに向けて準備を整えましょう。
