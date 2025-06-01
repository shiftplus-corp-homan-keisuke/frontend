# Step05 成果物：データ処理システム

---

## 🎯 課題の目的

**あなたが作成するもの**: 既存のJavaScriptコードにTypeScriptのジェネリクスを追加する

**なぜ作るのか**: Step05で学習したジェネリクスの基礎を実際のコードに適用し、**既存コードを型安全で再利用可能にする力**を身につけるため

**学習目標**:
- 既存のJavaScriptコードを読んで適切なジェネリクスを設計できる
- ジェネリック関数（`<T>`）を正しく定義できる
- ジェネリック制約（`extends`）を使って型を制限できる
- 型推論を活用して実用的なジェネリック関数を作成できる

---

## 📋 必須提出物

以下の1つのファイルのみ提出してください：

```
📁 提出物/
└── data-processor.ts    # ジェネリクスを追加したプログラム（必須）
```

---

## ⏰ 作成手順（推奨時間配分：合計50分）

### Phase 1: 既存コードの理解（15分）

#### ステップ1-1: 提供されたJavaScriptコードを理解する（15分）

以下のJavaScriptコードを読んで、どんなジェネリクスが必要か考えてください：

```javascript
// 既存のJavaScriptコード（ジェネリクスなし）
let items = [];
let users = [];
let products = [];

function addItem(array, item) {
  array.push(item);
  return item;
}

function getFirst(array) {
  return array.length > 0 ? array[0] : undefined;
}

function getLast(array) {
  return array.length > 0 ? array[array.length - 1] : undefined;
}

function findItem(array, predicate) {
  for (let i = 0; i < array.length; i++) {
    if (predicate(array[i])) {
      return array[i];
    }
  }
  return undefined;
}

function filterItems(array, predicate) {
  const result = [];
  for (let i = 0; i < array.length; i++) {
    if (predicate(array[i])) {
      result.push(array[i]);
    }
  }
  return result;
}

function mapItems(array, transform) {
  const result = [];
  for (let i = 0; i < array.length; i++) {
    result.push(transform(array[i]));
  }
  return result;
}

function getProperty(obj, key) {
  return obj[key];
}

function updateProperty(obj, key, value) {
  return {
    ...obj,
    [key]: value
  };
}

function getLength(item) {
  return item.length;
}

function getName(item) {
  return item.name;
}

function getId(item) {
  return item.id;
}

function createPair(first, second) {
  return {
    first: first,
    second: second
  };
}

function swapPair(pair) {
  return {
    first: pair.second,
    second: pair.first
  };
}

function runExample() {
  console.log("=== データ処理システムのデモ ===");
  
  // ユーザーデータ
  const userData = [
    { id: 1, name: "田中太郎", age: 30, email: "tanaka@example.com" },
    { id: 2, name: "佐藤花子", age: 25, email: "sato@example.com" },
    { id: 3, name: "山田次郎", age: 35, email: "yamada@example.com" }
  ];
  
  // 商品データ
  const productData = [
    { id: "P001", name: "ノートPC", price: 80000, category: "電子機器" },
    { id: "P002", name: "マウス", price: 2000, category: "電子機器" },
    { id: "P003", name: "本", price: 1500, category: "書籍" }
  ];
  
  // 数値データ
  const numberData = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  
  // 文字列データ
  const stringData = ["apple", "banana", "cherry", "date"];
  
  // 基本的な配列操作
  console.log("最初のユーザー:", getFirst(userData));
  console.log("最後の商品:", getLast(productData));
  console.log("最初の数値:", getFirst(numberData));
  console.log("最後の文字列:", getLast(stringData));
  
  // 検索操作
  const youngUser = findItem(userData, user => user.age < 30);
  const expensiveProduct = findItem(productData, product => product.price > 5000);
  const evenNumber = findItem(numberData, num => num % 2 === 0);
  
  console.log("30歳未満のユーザー:", youngUser);
  console.log("5000円以上の商品:", expensiveProduct);
  console.log("最初の偶数:", evenNumber);
  
  // フィルタリング操作
  const activeUsers = filterItems(userData, user => user.age >= 25);
  const electronics = filterItems(productData, product => product.category === "電子機器");
  const bigNumbers = filterItems(numberData, num => num > 5);
  
  console.log("25歳以上のユーザー:", activeUsers);
  console.log("電子機器:", electronics);
  console.log("5より大きい数値:", bigNumbers);
  
  // マッピング操作
  const userNames = mapItems(userData, user => user.name);
  const productPrices = mapItems(productData, product => product.price);
  const doubledNumbers = mapItems(numberData, num => num * 2);
  const upperStrings = mapItems(stringData, str => str.toUpperCase());
  
  console.log("ユーザー名一覧:", userNames);
  console.log("商品価格一覧:", productPrices);
  console.log("2倍した数値:", doubledNumbers);
  console.log("大文字の文字列:", upperStrings);
  
  // プロパティアクセス
  const firstUser = getFirst(userData);
  if (firstUser) {
    console.log("最初のユーザーの名前:", getProperty(firstUser, "name"));
    console.log("最初のユーザーの年齢:", getProperty(firstUser, "age"));
  }
  
  // プロパティ更新
  if (firstUser) {
    const updatedUser = updateProperty(firstUser, "age", 31);
    console.log("年齢更新前:", firstUser.age);
    console.log("年齢更新後:", updatedUser.age);
  }
  
  // 長さ取得
  console.log("ユーザーデータの長さ:", getLength(userData));
  console.log("文字列の長さ:", getLength("hello"));
  console.log("配列の長さ:", getLength([1, 2, 3]));
  
  // 名前取得
  console.log("ユーザーの名前:", getName(userData[0]));
  console.log("商品の名前:", getName(productData[0]));
  
  // ID取得
  console.log("ユーザーのID:", getId(userData[0]));
  console.log("商品のID:", getId(productData[0]));
  
  // ペア操作
  const userProductPair = createPair(userData[0], productData[0]);
  console.log("ユーザーと商品のペア:", userProductPair);
  
  const swappedPair = swapPair(userProductPair);
  console.log("入れ替え後のペア:", swappedPair);
  
  const numberStringPair = createPair(123, "test");
  console.log("数値と文字列のペア:", numberStringPair);
}

// 実行
runExample();
```

### Phase 2: ジェネリクスの追加（30分）

#### ステップ2-1: 基本的なジェネリック関数の定義（15分）

上記のコードを見て、以下のジェネリック関数を定義してください：

1. **配列操作のジェネリック関数**
   - `getFirst`, `getLast`, `findItem`, `filterItems`, `mapItems`
   - どんな型でも使えるようにする

2. **ペア操作のジェネリック関数**
   - `createPair`, `swapPair`
   - 2つの異なる型を扱えるようにする

**🤔 考えてみましょう**:
- `<T>` を使って型パラメータを定義
- `<T, U>` を使って複数の型パラメータを定義

```typescript
// TODO: 以下の関数をジェネリック関数に変換してください

function getFirst(array) {
  // ↓ ジェネリック関数に変換
  // function getFirst<T>(array: T[]): T | undefined
}

function createPair(first, second) {
  // ↓ ジェネリック関数に変換
  // function createPair<T, U>(first: T, second: U): { first: T; second: U }
}
```

#### ステップ2-2: ジェネリック制約の実装（10分）

```typescript
// TODO: 以下の関数にジェネリック制約を追加してください

// length プロパティを持つ値の長さを取得
function getLength(item) {
  // ↓ ジェネリック制約を追加
  // function getLength<T extends { length: number }>(item: T): number
}

// name プロパティを持つオブジェクトの名前を取得
function getName(item) {
  // ↓ ジェネリック制約を追加
  // function getName<T extends { name: string }>(item: T): string
}

// keyof制約を使った安全なプロパティアクセス
function getProperty(obj, key) {
  // ↓ keyof制約を追加
  // function getProperty<T, K extends keyof T>(obj: T, key: K): T[K]
}
```

**🤔 考えてみましょう**:
- `extends { length: number }` で length プロパティを持つ型に制限
- `extends { name: string }` で name プロパティを持つ型に制限
- `K extends keyof T` でオブジェクトのキーに制限

#### ステップ2-3: 変数と関数に型注釈を追加（5分）

```typescript
// TODO: 以下の変数と関数に適切な型注釈を追加してください
let items = [];
let users = [];
let products = [];

function addItem(array, item) { /* ... */ }
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
- [ ] **ジェネリック関数を5つ以上定義している**（最重要！）
- [ ] **ジェネリック制約を3つ以上使用している**（最重要！）
- [ ] すべての変数に適切な型注釈が付いている
- [ ] すべての関数の引数と戻り値に適切な型注釈が付いている

### 🎯 機能要件
- [ ] 元のJavaScriptコードと同じ動作をする
- [ ] 配列の基本操作（取得、検索、フィルタ、マップ）ができる
- [ ] オブジェクトのプロパティアクセスができる
- [ ] ペアの作成と操作ができる

### 💭 ジェネリクス要件
- [ ] 基本的なジェネリック関数（`<T>`）が正しく定義されている
- [ ] 複数の型パラメータ（`<T, U>`）が適切に使われている
- [ ] ジェネリック制約（`extends`）が正しく実装されている
- [ ] keyof制約が適切に使われている
- [ ] 型推論が活用されている

---

## 📊 評価基準

| 項目 | 配点 | 評価ポイント |
|------|------|-------------|
| **ジェネリック関数設計力** | 40点 | 適切なジェネリック関数を自分で設計できている |
| **ジェネリック制約実装力** | 30点 | extends制約を正しく実装できている |
| **型注釈の正確性** | 20点 | 全ての変数・関数に適切な型注釈が付いている |
| **機能の完成度** | 10点 | 元のコードと同じ動作をする |

**合格ライン**: 70点以上

---

## 💡 ジェネリクスのヒント

### 🤔 ジェネリクスを考える時の質問

1. **この関数はどんな型でも使える？**
   - `getFirst` → 数値配列、文字列配列、オブジェクト配列など
   - `mapItems` → 任意の型から任意の型への変換

2. **複数の型が必要？**
   - `createPair` → 2つの異なる型を組み合わせ
   - `mapItems` → 入力型と出力型が異なる

3. **型に制限が必要？**
   - `getLength` → length プロパティが必要
   - `getName` → name プロパティが必要

### 📝 ジェネリクスの基本例

```typescript
// 基本的なジェネリック関数
function identity<T>(value: T): T {
  return value;
}

// 複数の型パラメータ
function pair<T, U>(first: T, second: U): [T, U] {
  return [first, second];
}

// ジェネリック制約
function getLength<T extends { length: number }>(item: T): number {
  return item.length;
}

// keyof制約
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

// 配列のジェネリック関数
function first<T>(array: T[]): T | undefined {
  return array[0];
}

function filter<T>(array: T[], predicate: (item: T) => boolean): T[] {
  return array.filter(predicate);
}

function map<T, U>(array: T[], transform: (item: T) => U): U[] {
  return array.map(transform);
}
```

### 🔍 ジェネリクスの使い方

```typescript
// 型推論を活用
const numbers = [1, 2, 3, 4, 5];
const firstNumber = first(numbers); // T は number として推論される

const names = ["Alice", "Bob", "Charlie"];
const firstName = first(names); // T は string として推論される

// 明示的な型指定
const result = map<number, string>(numbers, n => n.toString());

// 制約を使った安全な操作
const stringLength = getLength("hello"); // OK: string has length
const arrayLength = getLength([1, 2, 3]); // OK: array has length
// const numberLength = getLength(123); // Error: number doesn't have length

// keyof制約を使った安全なプロパティアクセス
const user = { name: "Alice", age: 30 };
const userName = getProperty(user, "name"); // OK: "name" is a key of user
const userAge = getProperty(user, "age"); // OK: "age" is a key of user
// const invalid = getProperty(user, "invalid"); // Error: "invalid" is not a key
```

### ⚠️ よくある間違い

1. **ジェネリック型パラメータの定義忘れ**
   ```typescript
   // ❌ 間違い：型パラメータがない
   function getFirst(array: any[]): any {
     return array[0];
   }
   
   // ✅ 正解：ジェネリック型パラメータを使用
   function getFirst<T>(array: T[]): T | undefined {
     return array[0];
   }
   ```

2. **制約なしで存在しないプロパティにアクセス**
   ```typescript
   // ❌ 間違い：制約なしでlengthにアクセス
   function getLength<T>(item: T): number {
     return item.length; // Error: T doesn't have length
   }
   
   // ✅ 正解：制約を使用
   function getLength<T extends { length: number }>(item: T): number {
     return item.length; // OK: T has length
   }
   ```

3. **複数の型パラメータが必要な場面で単一の型パラメータを使用**
   ```typescript
   // ❌ 間違い：入力と出力が同じ型に制限される
   function map<T>(array: T[], transform: (item: T) => T): T[] {
     return array.map(transform);
   }
   
   // ✅ 正解：入力と出力で異なる型を使用
   function map<T, U>(array: T[], transform: (item: T) => U): U[] {
     return array.map(transform);
   }
   ```

---

## 📚 参考：完成例（ジェネリクスの答えを見たい場合）

<details>
<summary>⚠️ 注意：まず自分で考えてから見てください</summary>

```typescript
// 基本的なジェネリック関数
function getFirst<T>(array: T[]): T | undefined {
  return array.length > 0 ? array[0] : undefined;
}

function getLast<T>(array: T[]): T | undefined {
  return array.length > 0 ? array[array.length - 1] : undefined;
}

function findItem<T>(array: T[], predicate: (item: T) => boolean): T | undefined {
  for (let i = 0; i < array.length; i++) {
    if (predicate(array[i])) {
      return array[i];
    }
  }
  return undefined;
}

function filterItems<T>(array: T[], predicate: (item: T) => boolean): T[] {
  const result: T[] = [];
  for (let i = 0; i < array.length; i++) {
    if (predicate(array[i])) {
      result.push(array[i]);
    }
  }
  return result;
}

function mapItems<T, U>(array: T[], transform: (item: T) => U): U[] {
  const result: U[] = [];
  for (let i = 0; i < array.length; i++) {
    result.push(transform(array[i]));
  }
  return result;
}

// ジェネリック制約を使った関数
function getLength<T extends { length: number }>(item: T): number {
  return item.length;
}

function getName<T extends { name: string }>(item: T): string {
  return item.name;
}

function getId<T extends { id: number | string }>(item: T): number | string {
  return item.id;
}

function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

function updateProperty<T, K extends keyof T>(obj: T, key: K, value: T[K]): T {
  return {
    ...obj,
    [key]: value
  };
}

// 複数の型パラメータを使った関数
function createPair<T, U>(first: T, second: U): { first: T; second: U } {
  return {
    first: first,
    second: second
  };
}

function swapPair<T, U>(pair: { first: T; second: U }): { first: U; second: T } {
  return {
    first: pair.second,
    second: pair.first
  };
}

// 変数の型注釈
let items: any[] = [];
let users: Array<{ id: number; name: string; age: number; email: string }> = [];
let products: Array<{ id: string; name: string; price: number; category: string }> = [];

function addItem<T>(array: T[], item: T): T {
  array.push(item);
  return item;
}
```

</details>

---

## 🚀 発展課題（任意）

余裕がある場合は以下にも挑戦してみてください：

- [ ] より複雑なジェネリック制約の組み合わせ
- [ ] 条件付き型の基礎的な使用
- [ ] ジェネリッククラスの実装
- [ ] ユーティリティ型との組み合わせ

---

**📌 重要**: この課題の目的は**既存のJavaScriptコードを読んで適切なジェネリクスを実装する力**を身につけることです。TypeScriptのジェネリクスシステムを実践的に学習しましょう。

**🌟 次のステップ**: Step06では、ユーティリティ型を使った高度な型操作について学習します！