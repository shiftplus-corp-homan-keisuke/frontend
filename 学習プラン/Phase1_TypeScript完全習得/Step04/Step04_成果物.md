# Step04 成果物：信号機システム

---

## 🎯 課題の目的

**あなたが作成するもの**: 既存のJavaScriptコードにTypeScriptのユニオン型と型ガードを追加する

**なぜ作るのか**: Step04で学習したユニオン型と型ガードを実際のコードに適用し、**既存コードを型安全にする力**を身につけるため

**学習目標**:
- 既存のJavaScriptコードを読んで適切なユニオン型を設計できる
- ユニオン型（Union Types）を正しく定義できる
- 型ガード関数を実装できる
- 判別可能なユニオン（Discriminated Unions）を理解して使える

---

## 📋 必須提出物

以下の1つのファイルのみ提出してください：

```
📁 提出物/
└── traffic-light.ts    # ユニオン型と型ガードを追加したプログラム（必須）
```

---

## ⏰ 作成手順（推奨時間配分：合計40分）

### Phase 1: 既存コードの理解（10分）

#### ステップ1-1: 提供されたJavaScriptコードを理解する（10分）

以下のJavaScriptコードを読んで、どんなユニオン型と型ガードが必要か考えてください：

```javascript
// 既存のJavaScriptコード（ユニオン型・型ガードなし）
let lights = [];
let changeRecords = [];
let nextLightId = 1;
let nextRecordId = 1;

function addTrafficLight(type, location) {
  const light = {
    id: nextLightId++,
    currentColor: "red",
    status: "active",
    type: type,
    location: location
  };
  
  lights.push(light);
  return light;
}

function changeLight(lightId, newColor) {
  const light = lights.find(l => l.id === lightId);
  
  if (!light || light.status !== "active") {
    return false;
  }
  
  const oldColor = light.currentColor;
  light.currentColor = newColor;
  
  const record = {
    id: nextRecordId++,
    lightId: lightId,
    fromColor: oldColor,
    toColor: newColor,
    timestamp: new Date()
  };
  
  changeRecords.push(record);
  return true;
}

function processLightColor(color) {
  if (color === "red") {
    return "停止してください";
  } else if (color === "yellow") {
    return "注意してください";
  } else if (color === "green") {
    return "進行してください";
  } else {
    return "不明な信号色です";
  }
}

function processLightStatus(status) {
  if (status === "active") {
    return "信号機は正常に動作中です";
  } else if (status === "inactive") {
    return "信号機は停止中です";
  } else if (status === "maintenance") {
    return "信号機はメンテナンス中です";
  } else {
    return "不明な信号機状態です";
  }
}

function processLightType(type) {
  if (type === "vehicle") {
    return "車両用信号機";
  } else if (type === "pedestrian") {
    return "歩行者用信号機";
  } else if (type === "arrow") {
    return "矢印信号機";
  } else {
    return "不明な信号機種類です";
  }
}

function processUnknownData(data) {
  if (typeof data === "string") {
    return `文字列データ: ${data}`;
  } else if (typeof data === "number") {
    return `数値データ: ${data}`;
  } else if (data && typeof data === "object" && data.id && data.currentColor) {
    return `信号機データ: ID ${data.id}, 色 ${data.currentColor}`;
  } else {
    return "不明なデータ形式です";
  }
}

function getLightsByColor(color) {
  return lights.filter(light => light.currentColor === color);
}

function getLightsByType(type) {
  return lights.filter(light => light.type === type);
}

function getActiveLights() {
  return lights.filter(light => light.status === "active");
}

function runExample() {
  console.log("=== 信号機システムのデモ ===");
  
  // 信号機の追加
  addTrafficLight("vehicle", "交差点A - 車両用");
  addTrafficLight("pedestrian", "交差点A - 歩行者用");
  addTrafficLight("arrow", "交差点A - 右折用");
  
  // 信号の変更
  changeLight(1, "green");
  changeLight(2, "red");
  changeLight(3, "yellow");
  
  // 各種処理のテスト
  console.log("色の処理:", processLightColor("red"));
  console.log("状態の処理:", processLightStatus("active"));
  console.log("種類の処理:", processLightType("vehicle"));
  
  // データ処理のテスト
  console.log("データ処理1:", processUnknownData("test"));
  console.log("データ処理2:", processUnknownData(123));
  console.log("データ処理3:", processUnknownData(lights[0]));
  
  // 検索機能のテスト
  console.log("赤信号:", getLightsByColor("red"));
  console.log("車両用信号:", getLightsByType("vehicle"));
  console.log("アクティブな信号:", getActiveLights());
}

// 実行
runExample();
```

### Phase 2: ユニオン型と型ガードの追加（25分）

#### ステップ2-1: ユニオン型の定義（10分）

上記のコードを見て、以下のユニオン型を定義してください：

1. **信号の色を表現するユニオン型**
   - `processLightColor`関数で使われている色の値
   - どんな色が使われていますか？

2. **信号機の状態を表現するユニオン型**
   - `processLightStatus`関数で使われている状態の値
   - どんな状態が使われていますか？

3. **信号機の種類を表現するユニオン型**
   - `processLightType`関数で使われている種類の値
   - どんな種類が使われていますか？

**🤔 考えてみましょう**:
- `"red" | "yellow" | "green"` のような形で定義
- 文字列リテラル型のユニオンを作成

#### ステップ2-2: 型ガード関数の実装（10分）

```typescript
// TODO: 以下の型ガード関数を実装してください

// 信号の色の型ガード
function isRedLight(color: ?): color is ? {
  // 実装してください
}

function isYellowLight(color: ?): color is ? {
  // 実装してください
}

function isGreenLight(color: ?): color is ? {
  // 実装してください
}

// 信号機の状態の型ガード
function isActiveLight(status: ?): status is ? {
  // 実装してください
}

// 不明なデータの型ガード
function isValidTrafficLight(value: unknown): value is ? {
  // 実装してください
}
```

**🤔 考えてみましょう**:
- `value is Type` の形で戻り値の型を指定
- `typeof` や `===` を使った条件判定

#### ステップ2-3: 変数と関数に型注釈を追加（5分）

```typescript
// TODO: 以下の変数と関数に適切な型注釈を追加してください
let lights = [];
let changeRecords = [];

function addTrafficLight(type, location) { /* ... */ }
function changeLight(lightId, newColor) { /* ... */ }
function processLightColor(color) { /* ... */ }
// その他の関数...
```

### Phase 3: 動作確認（5分）

#### ステップ3-1: 動作確認
TypeScript Playgroundまたはローカル環境で実行して動作を確認

---

## ✅ 最低合格要件

以下の要件を**すべて満たす**ことで合格とします：

### 🔧 技術要件
- [ ] TypeScriptでコンパイルエラーが発生しない
- [ ] **ユニオン型を3つ以上定義している**（最重要！）
- [ ] **型ガード関数を3つ以上実装している**（最重要！）
- [ ] すべての変数に適切な型注釈が付いている
- [ ] すべての関数の引数と戻り値に適切な型注釈が付いている

### 🎯 機能要件
- [ ] 元のJavaScriptコードと同じ動作をする
- [ ] 信号機の追加・変更ができる
- [ ] 信号の色・状態・種類の処理ができる
- [ ] 不明なデータの安全な処理ができる

### 💭 ユニオン型・型ガード要件
- [ ] 信号の色のユニオン型が正しく定義されている
- [ ] 信号機の状態のユニオン型が正しく定義されている
- [ ] 信号機の種類のユニオン型が正しく定義されている
- [ ] 型ガード関数が `value is Type` の形で正しく実装されている
- [ ] 型ガード関数が実際に型の絞り込みに使われている

---

## 📊 評価基準

| 項目 | 配点 | 評価ポイント |
|------|------|-------------|
| **ユニオン型設計力** | 40点 | 適切なユニオン型を自分で設計できている |
| **型ガード実装力** | 40点 | 型ガード関数を正しく実装できている |
| **型注釈の正確性** | 20点 | 全ての変数・関数に適切な型注釈が付いている |

**合格ライン**: 70点以上

---

## 💡 ユニオン型と型ガードのヒント

### 🤔 ユニオン型を考える時の質問

1. **この値にはどんなパターンがある？**
   - 信号の色 → "red", "yellow", "green"
   - 信号機の状態 → "active", "inactive", "maintenance"
   - 信号機の種類 → "vehicle", "pedestrian", "arrow"

2. **文字列リテラル型のユニオンを作る**
   ```typescript
   type LightColor = "red" | "yellow" | "green";
   type LightStatus = "active" | "inactive" | "maintenance";
   ```

### 📝 型ガード関数の基本例

```typescript
// 基本的な型ガード関数
function isString(value: unknown): value is string {
  return typeof value === "string";
}

function isNumber(value: unknown): value is number {
  return typeof value === "number";
}

// 特定の値の型ガード
function isRedLight(color: LightColor): color is "red" {
  return color === "red";
}

// オブジェクトの型ガード
function isTrafficLight(value: unknown): value is TrafficLight {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    "currentColor" in value &&
    typeof (value as any).id === "number"
  );
}
```

### 🔍 型ガードの使い方

```typescript
// 型ガードを使った安全な処理
function processColor(color: LightColor): string {
  if (isRedLight(color)) {
    // ここでcolorは"red"型として扱われる
    return "停止してください";
  } else if (isYellowLight(color)) {
    // ここでcolorは"yellow"型として扱われる
    return "注意してください";
  } else if (isGreenLight(color)) {
    // ここでcolorは"green"型として扱われる
    return "進行してください";
  } else {
    // 全てのケースを処理済み
    throw new Error("未知の信号色です");
  }
}

// 不明なデータの安全な処理
function processUnknownData(data: unknown): string {
  if (isTrafficLight(data)) {
    // ここでdataはTrafficLight型として扱われる
    return `信号機ID: ${data.id}, 色: ${data.currentColor}`;
  } else if (isString(data)) {
    // ここでdataはstring型として扱われる
    return `文字列: ${data}`;
  } else {
    return "不明なデータ";
  }
}
```

### ⚠️ よくある間違い

1. **型ガードの戻り値型注釈忘れ**
   ```typescript
   // ❌ 間違い：戻り値型注釈がない
   function isRedLight(color: LightColor) {
     return color === "red";
   }
   
   // ✅ 正解：`value is Type`の形で指定
   function isRedLight(color: LightColor): color is "red" {
     return color === "red";
   }
   ```

2. **ユニオン型で存在しない値を使用**
   ```typescript
   // ❌ 間違い：定義されていない値
   type LightColor = "red" | "yellow" | "green";
   const color: LightColor = "blue"; // エラー！
   
   // ✅ 正解：定義された値のみ使用
   const color: LightColor = "red"; // OK
   ```

3. **型ガードを使わない不安全な処理**
   ```typescript
   // ❌ 間違い：型チェックなし
   function processData(data: unknown) {
     return data.id; // エラー！unknownにはidプロパティがない
   }
   
   // ✅ 正解：型ガードを使用
   function processData(data: unknown) {
     if (isTrafficLight(data)) {
       return data.id; // OK！型ガードで安全
     }
     return null;
   }
   ```

---

## 📚 参考：完成例（ユニオン型・型ガードの答えを見たい場合）

<details>
<summary>⚠️ 注意：まず自分で考えてから見てください</summary>

```typescript
// ユニオン型の定義
type LightColor = "red" | "yellow" | "green";
type LightStatus = "active" | "inactive" | "maintenance";
type LightType = "vehicle" | "pedestrian" | "arrow";

// インターフェースの定義
interface TrafficLight {
  id: number;
  currentColor: LightColor;
  status: LightStatus;
  type: LightType;
  location: string;
}

// 型ガード関数
function isRedLight(color: LightColor): color is "red" {
  return color === "red";
}

function isYellowLight(color: LightColor): color is "yellow" {
  return color === "yellow";
}

function isGreenLight(color: LightColor): color is "green" {
  return color === "green";
}

function isActiveLight(status: LightStatus): status is "active" {
  return status === "active";
}

function isValidTrafficLight(value: unknown): value is TrafficLight {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    "currentColor" in value &&
    "status" in value &&
    "type" in value &&
    "location" in value &&
    typeof (value as any).id === "number" &&
    typeof (value as any).location === "string"
  );
}

// 変数の型注釈
let lights: TrafficLight[] = [];
let changeRecords: ChangeRecord[] = [];

// 関数の型注釈
function processLightColor(color: LightColor): string {
  if (isRedLight(color)) {
    return "停止してください";
  } else if (isYellowLight(color)) {
    return "注意してください";
  } else if (isGreenLight(color)) {
    return "進行してください";
  } else {
    throw new Error("未知の信号色です");
  }
}
```

</details>

---

## 🚀 発展課題（任意）

余裕がある場合は以下にも挑戦してみてください：

- [ ] 判別可能なユニオン（Discriminated Unions）の実装
- [ ] より複雑な型ガード関数の作成
- [ ] インターセクション型（&）の活用

---

**📌 重要**: この課題の目的は**既存のJavaScriptコードを読んで適切なユニオン型と型ガードを実装する力**を身につけることです。TypeScriptのユニオン型と型ガードシステムを実践的に学習しましょう。

**🌟 次のステップ**: Step05では、ジェネリクスの基礎について学習します！
