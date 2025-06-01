# Step02 成果物：計算機システム

---

## 📝 システム概要

### 🧮 基本的な計算機システム

**目的**: Step02で学習した基本型システムと型注釈を活用して、型安全な計算機を実装する

**主要機能**:
1. 四則演算（足し算、引き算、掛け算、割り算）
2. 計算履歴の管理
3. 型安全な数値処理
4. エラーハンドリング

**使用する型システム**:
- プリミティブ型: number、string、boolean
- 配列型: number[]、string[]
- 関数型: 引数と戻り値の型注釈
- 型推論: letとconstの適切な使い分け
- リテラル型: 演算子の種類を厳密に定義

---

## 🚀 段階的実装手順

### Phase 1: 基本型定義と四則演算 🔰

#### ステップ1-1: 基本的な型定義

```typescript
// calculator.ts

// 演算子の種類（リテラル型）
type Operator = "+" | "-" | "*" | "/";

// 計算結果の型
interface CalculationResult {
  result: number;
  expression: string;
  isValid: boolean;
  errorMessage?: string;
}

// 計算履歴の型
interface CalculationHistory {
  id: number;
  expression: string;
  result: number;
  timestamp: Date;
}

// 基本的な計算機クラス
class BasicCalculator {
  private history: CalculationHistory[] = [];
  private nextId: number = 1;

  // 足し算
  add(a: number, b: number): CalculationResult {
    const result = a + b;
    const expression = `${a} + ${b} = ${result}`;
    
    this.addToHistory(expression, result);
    
    return {
      result,
      expression,
      isValid: true
    };
  }

  // 引き算
  subtract(a: number, b: number): CalculationResult {
    const result = a - b;
    const expression = `${a} - ${b} = ${result}`;
    
    this.addToHistory(expression, result);
    
    return {
      result,
      expression,
      isValid: true
    };
  }

  // 掛け算
  multiply(a: number, b: number): CalculationResult {
    const result = a * b;
    const expression = `${a} × ${b} = ${result}`;
    
    this.addToHistory(expression, result);
    
    return {
      result,
      expression,
      isValid: true
    };
  }

  // 割り算
  divide(a: number, b: number): CalculationResult {
    if (b === 0) {
      return {
        result: 0,
        expression: `${a} ÷ ${b}`,
        isValid: false,
        errorMessage: "0で割ることはできません"
      };
    }

    const result = a / b;
    const expression = `${a} ÷ ${b} = ${result}`;
    
    this.addToHistory(expression, result);
    
    return {
      result,
      expression,
      isValid: true
    };
  }

  // 履歴に追加
  private addToHistory(expression: string, result: number): void {
    const historyItem: CalculationHistory = {
      id: this.nextId++,
      expression,
      result,
      timestamp: new Date()
    };
    
    this.history.push(historyItem);
  }

  // 履歴を取得
  getHistory(): CalculationHistory[] {
    return [...this.history]; // 配列のコピーを返す
  }

  // 履歴をクリア
  clearHistory(): void {
    this.history = [];
    this.nextId = 1;
  }

  // 最後の計算結果を取得
  getLastResult(): number | null {
    if (this.history.length === 0) {
      return null;
    }
    return this.history[this.history.length - 1].result;
  }
}
```

### Phase 2: 文字列解析と型安全な処理 🔶

#### ステップ2-1: 文字列式の解析機能

```typescript
// 文字列解析機能を追加した計算機
class StringCalculator extends BasicCalculator {

  // 文字列式を解析して計算
  calculate(expression: string): CalculationResult {
    // 空白を除去
    const cleanExpression = expression.replace(/\s+/g, "");
    
    // 基本的な式のパターンをチェック
    const match = cleanExpression.match(/^(-?\d+(?:\.\d+)?)([\+\-\*\/])(-?\d+(?:\.\d+)?)$/);
    
    if (!match) {
      return {
        result: 0,
        expression: cleanExpression,
        isValid: false,
        errorMessage: "無効な式です。例: 10 + 5"
      };
    }

    const num1 = parseFloat(match[1]);
    const operator = match[2] as Operator;
    const num2 = parseFloat(match[3]);

    // 数値の妥当性チェック
    if (isNaN(num1) || isNaN(num2)) {
      return {
        result: 0,
        expression: cleanExpression,
        isValid: false,
        errorMessage: "無効な数値が含まれています"
      };
    }

    // 演算子に応じて計算
    switch (operator) {
      case "+":
        return this.add(num1, num2);
      case "-":
        return this.subtract(num1, num2);
      case "*":
        return this.multiply(num1, num2);
      case "/":
        return this.divide(num1, num2);
      default:
        return {
          result: 0,
          expression: cleanExpression,
          isValid: false,
          errorMessage: "サポートされていない演算子です"
        };
    }
  }

  // 複数の計算を一度に実行
  calculateMultiple(expressions: string[]): CalculationResult[] {
    const results: CalculationResult[] = [];
    
    for (const expression of expressions) {
      const result = this.calculate(expression);
      results.push(result);
    }
    
    return results;
  }

  // 計算結果の統計
  getStatistics(): {
    totalCalculations: number;
    successfulCalculations: number;
    averageResult: number;
    maxResult: number;
    minResult: number;
  } {
    const history = this.getHistory();
    
    if (history.length === 0) {
      return {
        totalCalculations: 0,
        successfulCalculations: 0,
        averageResult: 0,
        maxResult: 0,
        minResult: 0
      };
    }

    const results = history.map(h => h.result);
    const sum = results.reduce((acc, val) => acc + val, 0);
    
    return {
      totalCalculations: history.length,
      successfulCalculations: history.length,
      averageResult: sum / history.length,
      maxResult: Math.max(...results),
      minResult: Math.min(...results)
    };
  }
}
```

### Phase 3: 高度な計算機能 🔥

#### ステップ3-1: 科学計算機能

```typescript
// 科学計算機能を追加
class ScientificCalculator extends StringCalculator {

  // 累乗計算
  power(base: number, exponent: number): CalculationResult {
    const result = Math.pow(base, exponent);
    const expression = `${base} ^ ${exponent} = ${result}`;
    
    this.addToHistory(expression, result);
    
    return {
      result,
      expression,
      isValid: true
    };
  }

  // 平方根
  sqrt(value: number): CalculationResult {
    if (value < 0) {
      return {
        result: 0,
        expression: `√${value}`,
        isValid: false,
        errorMessage: "負の数の平方根は計算できません"
      };
    }

    const result = Math.sqrt(value);
    const expression = `√${value} = ${result}`;
    
    this.addToHistory(expression, result);
    
    return {
      result,
      expression,
      isValid: true
    };
  }

  // パーセント計算
  percentage(value: number, percent: number): CalculationResult {
    const result = (value * percent) / 100;
    const expression = `${value}の${percent}% = ${result}`;
    
    this.addToHistory(expression, result);
    
    return {
      result,
      expression,
      isValid: true
    };
  }

  // 絶対値
  abs(value: number): CalculationResult {
    const result = Math.abs(value);
    const expression = `|${value}| = ${result}`;
    
    this.addToHistory(expression, result);
    
    return {
      result,
      expression,
      isValid: true
    };
  }

  // 四捨五入
  round(value: number, decimals: number = 0): CalculationResult {
    const multiplier = Math.pow(10, decimals);
    const result = Math.round(value * multiplier) / multiplier;
    const expression = `round(${value}, ${decimals}) = ${result}`;
    
    this.addToHistory(expression, result);
    
    return {
      result,
      expression,
      isValid: true
    };
  }

  // 階乗計算
  factorial(n: number): CalculationResult {
    if (n < 0 || !Number.isInteger(n)) {
      return {
        result: 0,
        expression: `${n}!`,
        isValid: false,
        errorMessage: "階乗は0以上の整数でのみ計算できます"
      };
    }

    if (n > 20) {
      return {
        result: 0,
        expression: `${n}!`,
        isValid: false,
        errorMessage: "20以下の数値でのみ計算できます"
      };
    }

    let result = 1;
    for (let i = 2; i <= n; i++) {
      result *= i;
    }

    const expression = `${n}! = ${result}`;
    this.addToHistory(expression, result);
    
    return {
      result,
      expression,
      isValid: true
    };
  }

  // 履歴から特定の演算子の計算のみを取得
  getHistoryByOperator(operator: string): CalculationHistory[] {
    return this.getHistory().filter(h => h.expression.includes(operator));
  }

  // 履歴をCSV形式で出力
  exportHistoryToCSV(): string {
    const history = this.getHistory();
    const headers = "ID,式,結果,日時";
    const rows = history.map(h => 
      `${h.id},"${h.expression}",${h.result},"${h.timestamp.toISOString()}"`
    );
    
    return [headers, ...rows].join("\n");
  }

  // 履歴の検索
  searchHistory(keyword: string): CalculationHistory[] {
    return this.getHistory().filter(h => 
      h.expression.toLowerCase().includes(keyword.toLowerCase())
    );
  }

  // 私有メソッドを公開（継承のため）
  protected addToHistory(expression: string, result: number): void {
    super['addToHistory'](expression, result);
  }
}
```

### Phase 4: 実行例とテスト 🌟

#### ステップ4-1: 使用例とデモンストレーション

```typescript
// 使用例とテスト
function demonstrateCalculator(): void {
  const calc = new ScientificCalculator();

  console.log("=== 計算機システムのデモ ===");

  // 基本的な四則演算
  console.log("\n--- 基本演算 ---");
  console.log(calc.add(10, 5));
  console.log(calc.subtract(10, 3));
  console.log(calc.multiply(4, 7));
  console.log(calc.divide(15, 3));

  // エラーケースのテスト
  console.log("\n--- エラーケース ---");
  console.log(calc.divide(10, 0)); // 0除算エラー

  // 文字列式の計算
  console.log("\n--- 文字列式の計算 ---");
  console.log(calc.calculate("25 + 15"));
  console.log(calc.calculate("100 - 30"));
  console.log(calc.calculate("8 * 9"));
  console.log(calc.calculate("144 / 12"));

  // 無効な式のテスト
  console.log(calc.calculate("abc + 123")); // 無効な式

  // 科学計算
  console.log("\n--- 科学計算 ---");
  console.log(calc.power(2, 8));
  console.log(calc.sqrt(64));
  console.log(calc.percentage(200, 15));
  console.log(calc.abs(-42));
  console.log(calc.round(3.14159, 2));
  console.log(calc.factorial(5));

  // 複数計算の実行
  console.log("\n--- 複数計算 ---");
  const expressions = ["10 + 20", "50 - 15", "6 * 7", "100 / 4"];
  const results = calc.calculateMultiple(expressions);
  results.forEach(result => console.log(result));

  // 統計情報
  console.log("\n--- 統計情報 ---");
  console.log(calc.getStatistics());

  // 履歴の表示
  console.log("\n--- 計算履歴 ---");
  const history = calc.getHistory();
  history.slice(-5).forEach(h => {
    console.log(`${h.id}: ${h.expression} (${h.timestamp.toLocaleTimeString()})`);
  });

  // 履歴の検索
  console.log("\n--- 履歴検索 ---");
  const searchResults = calc.searchHistory("+");
  console.log(`足し算の履歴: ${searchResults.length}件`);

  // 最後の結果
  console.log("\n--- 最後の結果 ---");
  console.log(`最後の計算結果: ${calc.getLastResult()}`);
}

// 型推論のデモ
function demonstrateTypeInference(): void {
  console.log("\n=== 型推論のデモ ===");

  // 基本的な型推論
  const result = 10 + 5; // number型と推論
  const message = "計算結果: " + result; // string型と推論
  const isPositive = result > 0; // boolean型と推論

  console.log("推論された型:");
  console.log("result:", typeof result, "=", result);
  console.log("message:", typeof message, "=", message);
  console.log("isPositive:", typeof isPositive, "=", isPositive);

  // 配列の型推論
  const numbers = [1, 2, 3, 4, 5]; // number[]と推論
  const operations = ["+", "-", "*", "/"]; // string[]と推論

  console.log("配列の型推論:");
  console.log("numbers:", numbers);
  console.log("operations:", operations);

  // 関数の戻り値型推論
  const double = (x: number) => x * 2; // (x: number) => number と推論
  const format = (value: number) => `値: ${value}`; // (value: number) => string と推論

  console.log("関数の戻り値:");
  console.log("double(5):", double(5));
  console.log("format(42):", format(42));
}

// 型安全性のデモ
function demonstrateTypeSafety(): void {
  console.log("\n=== 型安全性のデモ ===");

  const calc = new BasicCalculator();

  // 正しい使用法
  const validResult = calc.add(10, 20);
  console.log("正しい使用:", validResult);

  // TypeScriptが防ぐエラー（コメントアウト）
  // calc.add("10", "20"); // Error: 文字列は受け付けない
  // calc.add(10); // Error: 引数が足りない
  // calc.add(10, 20, 30); // Error: 引数が多すぎる

  // 型ガードの例
  function processValue(value: string | number): string {
    if (typeof value === "string") {
      return `文字列: ${value.toUpperCase()}`;
    } else {
      return `数値: ${value.toFixed(2)}`;
    }
  }

  console.log("型ガードの例:");
  console.log(processValue("hello"));
  console.log(processValue(3.14159));
}

// 実行
demonstrateCalculator();
demonstrateTypeInference();
demonstrateTypeSafety();
```

---

## 🎓 学習のヒント

### 💡 実装時のポイント

1. **基本型の活用**: number、string、booleanの適切な使い分け
2. **型推論の理解**: letとconstで異なる型推論の動作
3. **関数の型注釈**: 引数と戻り値の型を明確に定義
4. **配列の型安全性**: 配列要素の型を統一して安全な操作
5. **エラーハンドリング**: 型安全なエラー処理の実装

### ⚠️ よくある間違い

- 数値と文字列を混同する
- 関数の引数や戻り値の型注釈を忘れる
- 配列の要素型を明示せずに使用する
- nullやundefinedの可能性を考慮しない
- 型推論に頼りすぎて明示的な型注釈を怠る

### 🚀 発展課題（任意）

余裕がある場合は以下にも挑戦してみてください：

- 三角関数の計算機能
- 進数変換機能（2進数、16進数）
- メモリ機能（値の保存・呼び出し）
- 計算式の妥当性チェック強化
- 計算結果のグラフ表示機能

---

**📌 重要**: この成果物はStep02の学習内容の総まとめです。基本型から関数型まで、TypeScriptの型システムの基礎を実践的に活用しながら実装しましょう。

**🌟 次のステップ**: Step03では、インターフェースとオブジェクト型について学習します！