# Step02 成果物：計算機システム

---

## 🎯 課題の目的

**あなたが作成するもの**: 既存のJavaScriptコードにTypeScriptの型注釈を追加する

**なぜ作るのか**: Step02で学習した基本型システムと型注釈を実際のコードに適用し、**既存コードを型安全にする力**を身につけるため

**学習目標**:
- 既存のJavaScriptコードを読んで適切な型を判断できる
- プリミティブ型（number、string、boolean）を正しく注釈できる
- 配列型とオブジェクト型を適切に注釈できる
- 関数の引数と戻り値の型を正しく推測して注釈できる

---

## 📋 必須提出物

以下の1つのファイルのみ提出してください：

```
📁 提出物/
└── calculator.ts    # 型注釈を追加したプログラム（必須）
```

---

## ⏰ 作成手順（推奨時間配分：合計40分）

### Phase 1: 既存コードの理解（10分）

#### ステップ1-1: 提供されたJavaScriptコードを理解する（10分）

以下のJavaScriptコードを読んで、どんな型が必要か考えてください：

```javascript
// 既存のJavaScriptコード（型注釈なし）
let history = [];
let nextId = 1;

function add(a, b) {
  const result = a + b;
  const expression = `${a} + ${b} = ${result}`;
  
  addToHistory(expression, result);
  
  return {
    result: result,
    expression: expression,
    isValid: true
  };
}

function subtract(a, b) {
  const result = a - b;
  const expression = `${a} - ${b} = ${result}`;
  
  addToHistory(expression, result);
  
  return {
    result: result,
    expression: expression,
    isValid: true
  };
}

function multiply(a, b) {
  const result = a * b;
  const expression = `${a} × ${b} = ${result}`;
  
  addToHistory(expression, result);
  
  return {
    result: result,
    expression: expression,
    isValid: true
  };
}

function divide(a, b) {
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
  
  addToHistory(expression, result);
  
  return {
    result: result,
    expression: expression,
    isValid: true
  };
}

function addToHistory(expression, result) {
  const historyItem = {
    id: nextId++,
    expression: expression,
    result: result
  };
  
  history.push(historyItem);
}

function getHistory() {
  return [...history];
}

function runExample() {
  console.log("=== 計算機システムのデモ ===");
  
  // 基本的な四則演算
  console.log(add(10, 5));
  console.log(subtract(10, 3));
  console.log(multiply(4, 7));
  console.log(divide(15, 3));
  
  // エラーケース
  console.log(divide(10, 0));
  
  // 履歴表示
  console.log("\n=== 計算履歴 ===");
  const calculationHistory = getHistory();
  calculationHistory.forEach(h => {
    console.log(`${h.id}: ${h.expression}`);
  });
}

// 実行
runExample();
```

### Phase 2: 型注釈の追加（25分）

#### ステップ2-1: 必要な型を定義する（10分）

上記のコードを見て、以下の型を定義してください：

1. **計算結果を表現する型**
   - 関数の戻り値として使われているオブジェクトの型
   - どんなプロパティが必要でしょうか？

2. **計算履歴を表現する型**
   - `addToHistory`で作成されているオブジェクトの型
   - どんなプロパティが必要でしょうか？

#### ステップ2-2: 変数に型注釈を追加する（5分）

```typescript
// TODO: 以下の変数に適切な型注釈を追加してください
let history = [];
let nextId = 1;
```

#### ステップ2-3: 関数に型注釈を追加する（10分）

各関数の引数と戻り値に適切な型注釈を追加してください：

```typescript
// TODO: 以下の関数に型注釈を追加してください
function add(a, b) { /* ... */ }
function subtract(a, b) { /* ... */ }
function multiply(a, b) { /* ... */ }
function divide(a, b) { /* ... */ }
function addToHistory(expression, result) { /* ... */ }
function getHistory() { /* ... */ }
function runExample() { /* ... */ }
```

### Phase 3: 動作確認（5分）

#### ステップ3-1: 動作確認
TypeScript Playgroundまたはローカル環境で実行して動作を確認

---

## ✅ 最低合格要件

以下の要件を**すべて満たす**ことで合格とします：

### 🔧 技術要件
- [ ] TypeScriptでコンパイルエラーが発生しない
- [ ] **必要な型を2つ以上定義している**
- [ ] すべての変数に適切な型注釈が付いている
- [ ] すべての関数の引数に適切な型注釈が付いている
- [ ] すべての関数の戻り値に適切な型注釈が付いている

### 🎯 機能要件
- [ ] 元のJavaScriptコードと同じ動作をする
- [ ] 四則演算が正しく動作する
- [ ] 0除算エラーが適切に処理される
- [ ] 計算履歴が正しく記録・取得される

### 💭 型注釈要件
- [ ] 計算結果のオブジェクトの型が正しく定義されている
- [ ] 計算履歴のオブジェクトの型が正しく定義されている
- [ ] 配列の型注釈が適切に付いている
- [ ] オプショナルプロパティ（`?`）が適切に使われている

---

## 📊 評価基準

| 項目 | 配点 | 評価ポイント |
|------|------|-------------|
| **型注釈の正確性** | 60点 | 全ての変数・関数に適切な型注釈が付いている |
| **型定義の適切性** | 30点 | 必要な型が正しく定義されている |
| **機能の完成度** | 10点 | 元のコードと同じ動作をする |

**合格ライン**: 70点以上

---

## 💡 型注釈のヒント

### 🤔 型を考える時の質問

1. **この変数には何が入る？**
   - `history` → 配列が入る → 何の配列？
   - `nextId` → 数値が入る → `number`

2. **この関数は何を受け取る？**
   - `add(a, b)` → 数値を2つ受け取る → `number, number`
   - `addToHistory(expression, result)` → 文字列と数値？

3. **この関数は何を返す？**
   - `add` → オブジェクトを返す → どんなオブジェクト？
   - `getHistory` → 配列を返す → 何の配列？

4. **このプロパティは必須？**
   - `errorMessage` → エラーの時だけ → オプショナル（`?`）

### 📝 型注釈の例

```typescript
// 基本的な型注釈
let count: number = 0;
let message: string = "hello";
let isValid: boolean = true;

// 配列の型注釈
let numbers: number[] = [1, 2, 3];
let names: string[] = ["Alice", "Bob"];

// オブジェクトの型注釈
let user: { name: string; age: number } = {
  name: "Alice",
  age: 30
};

// 関数の型注釈
function greet(name: string): string {
  return `Hello, ${name}!`;
}

// オプショナルプロパティ
type User = {
  name: string;
  age: number;
  email?: string;  // 任意のプロパティ
};
```

### ⚠️ よくある間違い

1. **配列の型注釈忘れ**
   ```typescript
   // ❌ 間違い
   let history = [];
   
   // ✅ 正解
   let history: HistoryItem[] = [];
   ```

2. **戻り値の型注釈忘れ**
   ```typescript
   // ❌ 間違い
   function add(a: number, b: number) {
     return { result: a + b };
   }
   
   // ✅ 正解
   function add(a: number, b: number): CalculationResult {
     return { result: a + b, expression: "...", isValid: true };
   }
   ```

3. **オプショナルプロパティの見落とし**
   ```typescript
   // ❌ 間違い：errorMessageは常に必要ではない
   type Result = {
     result: number;
     expression: string;
     isValid: boolean;
     errorMessage: string;
   };
   
   // ✅ 正解：errorMessageは任意
   type Result = {
     result: number;
     expression: string;
     isValid: boolean;
     errorMessage?: string;
   };
   ```

---

## 📚 参考：完成例（型注釈の答えを見たい場合）

<details>
<summary>⚠️ 注意：まず自分で考えてから見てください</summary>

```typescript
// 型定義
type CalculationResult = {
  result: number;
  expression: string;
  isValid: boolean;
  errorMessage?: string;
};

type CalculationHistory = {
  id: number;
  expression: string;
  result: number;
};

// 変数の型注釈
let history: CalculationHistory[] = [];
let nextId: number = 1;

// 関数の型注釈
function add(a: number, b: number): CalculationResult {
  const result = a + b;
  const expression = `${a} + ${b} = ${result}`;
  
  addToHistory(expression, result);
  
  return {
    result: result,
    expression: expression,
    isValid: true
  };
}

function addToHistory(expression: string, result: number): void {
  const historyItem: CalculationHistory = {
    id: nextId++,
    expression: expression,
    result: result
  };
  
  history.push(historyItem);
}

function getHistory(): CalculationHistory[] {
  return [...history];
}

function runExample(): void {
  // 実行例のコード
}
```

</details>

---

## 🚀 発展課題（任意）

余裕がある場合は以下にも挑戦してみてください：

- [ ] より厳密な型定義（リテラル型の使用）
- [ ] 型ガードの実装
- [ ] ジェネリクスの活用

---

**📌 重要**: この課題の目的は**既存のJavaScriptコードを読んで適切な型注釈を付ける力**を身につけることです。実際の開発現場でよくある作業を体験しましょう。

**🌟 次のステップ**: Step03では、インターフェースとオブジェクト型について学習します！