# 練習問題 1.1: 基本ジェネリック関数 - 解答例

> 💡 **注意**: まず自分で実装してから解答を確認してください。学習効果を最大化するためです。

## ステップ1の解答例

```typescript
// 1. 数値配列の最後の要素を取得する関数
function getLastNumber(array: number[]): number | undefined {
  if (array.length === 0) {
    return undefined;
  }
  return array[array.length - 1];
}

// 2. 文字列配列の最後の要素を取得する関数
function getLastString(array: string[]): string | undefined {
  if (array.length === 0) {
    return undefined;
  }
  return array[array.length - 1];
}

// テスト
const numbers = [1, 2, 3, 4, 5];
const strings = ["apple", "banana", "cherry"];

console.log(getLastNumber(numbers)); // 5
console.log(getLastString(strings)); // "cherry"
```

**気づくべき問題点:**
- `getLastNumber` と `getLastString` の実装が全く同じ
- 新しい型（boolean[]、User[]など）のたびに新しい関数が必要
- コードの重複が発生している

## ステップ2の解答例

```typescript
// 3. ジェネリクスを使った汎用的な関数
function getLast<T>(array: T[]): T | undefined {
  if (array.length === 0) {
    return undefined;
  }
  return array[array.length - 1];
}

// テスト - 同じ関数で異なる型に対応
console.log(getLast(numbers)); // 5 (number | undefined)
console.log(getLast(strings)); // "cherry" (string | undefined)

// ボーナス: オブジェクト配列でもテスト
interface User {
  id: number;
  name: string;
}

const users: User[] = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" }
];

console.log(getLast(users)); // { id: 2, name: "Bob" } (User | undefined)
```

**重要なポイント:**
- `<T>` は「任意の型T」を表す型パラメータ
- `T[]` は「T型の配列」を意味する
- 戻り値の型 `T | undefined` により、型安全性が保たれる
- TypeScriptが自動的に型を推論するため、呼び出し時に `<number>` などの指定は不要

## ステップ3の解答例

```typescript
// 4. 配列の最初の要素を取得
function getFirst<T>(array: T[]): T | undefined {
  if (array.length === 0) {
    return undefined;
  }
  return array[0];
}

// 5. 値をそのまま返すアイデンティティ関数
function identity<T>(value: T): T {
  return value;
}

// 6. 2つの値を交換したタプルを返す
function swap<T, U>(first: T, second: U): [U, T] {
  return [second, first];
}

// 7. 配列を複製する
function clone<T>(array: T[]): T[] {
  return [...array]; // スプレッド演算子を使用
  // または: return array.slice(); でも可
}
```

**学習ポイント:**
- `identity<T>` は入力と出力が同じ型であることを保証
- `swap<T, U>` は2つの異なる型を扱う例
- `clone<T>` は元の配列の型を保持して新しい配列を作成

## ステップ4の解答例

```typescript
// 8. 2つの異なる型の配列を結合
function concat<T, U>(arr1: T[], arr2: U[]): (T | U)[] {
  return [...arr1, ...arr2];
}

// 9. キーと値のペアオブジェクトを作成
function createPair<K, V>(key: K, value: V): { key: K; value: V } {
  return { key, value };
}

// 10. 配列の要素を変換（map関数の簡易版）
function transform<T, U>(array: T[], transformer: (item: T) => U): U[] {
  const result: U[] = [];
  for (const item of array) {
    result.push(transformer(item));
  }
  return result;
}
```

**高度なポイント:**
- `concat<T, U>` の戻り値型 `(T | U)[]` はユニオン型の配列
- `createPair<K, V>` はキーと値で異なる型を許可
- `transform<T, U>` は関数型プログラミングの概念を取り入れた変換関数

## 完全なテストコード

```typescript
// === ステップ2のテスト ===
console.log("=== ジェネリック関数のテスト ===");
console.log(getLast([1, 2, 3])); // 3
console.log(getLast(["a", "b", "c"])); // "c"
console.log(getLast([])); // undefined

// === ステップ3のテスト ===
console.log("\n=== 基本ジェネリック関数 ===");
console.log(getFirst([1, 2, 3])); // 1
console.log(identity("hello")); // "hello"
console.log(identity(42)); // 42
console.log(swap("hello", 42)); // [42, "hello"]
console.log(clone([1, 2, 3])); // [1, 2, 3]

// === ステップ4のテスト ===
console.log("\n=== 複数型パラメータ ===");
console.log(concat([1, 2], ["a", "b"])); // [1, 2, "a", "b"]
console.log(createPair("name", "Alice")); // { key: "name", value: "Alice" }
console.log(transform([1, 2, 3], x => x * 2)); // [2, 4, 6]
console.log(transform(["a", "bb", "ccc"], s => s.length)); // [1, 2, 3]

// === 型安全性の確認 ===
console.log("\n=== 型安全性のテスト ===");

// 型推論の確認
const numberResult = getLast([1, 2, 3]); // number | undefined
const stringResult = getLast(["a", "b"]); // string | undefined

// 型安全性: 以下はコンパイルエラーになる
// numberResult.toFixed(); // Error: numberResult は undefined の可能性がある

// 正しい使い方
if (numberResult !== undefined) {
  console.log(numberResult.toFixed(2)); // OK: この時点で number 型が確定
}

// オブジェクト型でのテスト
interface Product {
  id: number;
  name: string;
  price: number;
}

const products: Product[] = [
  { id: 1, name: "Laptop", price: 1000 },
  { id: 2, name: "Mouse", price: 25 }
];

const lastProduct = getLast(products);
console.log(lastProduct); // { id: 2, name: "Mouse", price: 25 }

// 型変換のテスト
const productNames = transform(products, p => p.name);
console.log(productNames); // ["Laptop", "Mouse"] (string[])

const productPrices = transform(products, p => p.price);
console.log(productPrices); // [1000, 25] (number[])
```

## 重要な学習ポイントのまとめ

### 1. ジェネリクスの必要性
- コードの重複を避ける
- 型安全性を保ちながら汎用性を実現
- 保守性の向上

### 2. 基本構文
```typescript
function 関数名<T>(引数: T): T {
  // 実装
}
```

### 3. 複数の型パラメータ
```typescript
function 関数名<T, U>(引数1: T, 引数2: U): 戻り値の型 {
  // 実装
}
```

### 4. 型推論の活用
- 明示的な型指定は通常不要
- TypeScriptが自動的に適切な型を推論
- 型安全性が自動的に保たれる

### 5. 実用的な応用
- 配列操作関数
- データ変換関数
- ユーティリティ関数
- ライブラリ設計

この解答例を参考に、ジェネリクスの概念と実装方法をしっかりと理解してください。