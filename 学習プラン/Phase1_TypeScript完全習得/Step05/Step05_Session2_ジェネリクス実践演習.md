# Session2: ジェネリクス実践演習（90分）

> 💡 **対象**: Session1完了者（ジェネリクス基礎理解済み）
> 🎯 **形式**: 講師サポート付き実践学習
> ⏰ **時間**: 90分

## 📚 関連補足資料

このセッションの学習をサポートする補足資料をご用意しています：

- 💻 **[実践コード例](./Step05_補足_実践コード例.md)** - より実践的な例とシステム実装
- 📖 **[専門用語集](./Step05_補足_専門用語集.md)** - ジェネリッククラスなどの詳細解説
- 🚨 **[トラブルシューティング](./Step05_補足_トラブルシューティング.md)** - ジェネリクスエラーの対処法
- 🌐 **[参考リソース](./Step05_補足_参考リソース.md)** - さらなる学習のためのリソース
- 🔧 **[開発環境ガイド](./Step05_補足_開発環境ガイド.md)** - 開発効率を上げる設定

> 💡 **活用方法**: 学習中に疑問が生じた際や、より深く理解したい場合に参照してね 🐰

## 📅 セッション概要

**学習目標**:

- [ ] ジェネリッククラスの設計と実装
- [ ] 複数型パラメータを持つクラスの活用
- [ ] 実用的なジェネリック活用パターンの習得
- [ ] ジェネリック関数ライブラリの実装

**前提知識**:

- Session1の内容（ジェネリクス基礎・制約）
- 基本的なクラス設計の経験
- TypeScriptの型システムの理解

---

## ⏰ 詳細タイムテーブル

| 時間         | 内容                       | 講師の役割           | 学習者の活動     | 成果物       |
| ------------ | -------------------------- | -------------------- | ---------------- | ------------ |
| **0-10分**   | 前回復習・今回目標         | 復習確認・目標提示   | 振り返り・質問   | 理解確認     |
| **10-50分**  | ジェネリッククラス実装     | 実演・個別指導       | ハンズオン・実践 | 実践コード   |
| **50-80分**  | ジェネリック関数ライブラリ | コードレビュー・助言 | 個人開発         | システム実装 |
| **80-90分**  | 成果共有・質疑応答         | ファシリテート       | 発表・討論       | 学習成果     |

---

## 📚 学習内容

### Section 1: ジェネリッククラスの設計

> 📚 **関連資料**: [実践コード例 - ジェネリッククラスの実用的実装](./Step05_補足_実践コード例.md#ジェネリッククラスの実用的実装) | [専門用語集 - ジェネリッククラス](./Step05_補足_専門用語集.md#ジェネリッククラスgeneric-classes)

#### 🔧 基本的なジェネリッククラス

```typescript
class Box<T> {
  private value: T;

  constructor(value: T) {
    this.value = value;
  }

  getValue(): T {
    return this.value;
  }

  setValue(value: T): void {
    this.value = value;
  }

  map<U>(mapper: (value: T) => U): Box<U> {
    return new Box(mapper(this.value));
  }

  // 型安全なチェーン操作
  flatMap<U>(mapper: (value: T) => Box<U>): Box<U> {
    return mapper(this.value);
  }

  // 条件付き操作
  filter(predicate: (value: T) => boolean): Box<T | null> {
    return new Box(predicate(this.value) ? this.value : null);
  }
}

// 使用例
const stringBox = new Box("hello");
const numberBox = stringBox.map((str) => str.length); // Box<number>
const upperBox = stringBox.map((str) => str.toUpperCase()); // Box<string>

// チェーン操作
const result = stringBox
  .map((str) => str.length)
  .map((len) => len * 2)
  .getValue(); // number
```

#### 🔧 複数型パラメータのクラス

```typescript
class Pair<T, U> {
  constructor(private first: T, private second: U) {}

  getFirst(): T {
    return this.first;
  }

  getSecond(): U {
    return this.second;
  }

  swap(): Pair<U, T> {
    return new Pair(this.second, this.first);
  }

  map<V, W>(
    firstMapper: (value: T) => V,
    secondMapper: (value: U) => W
  ): Pair<V, W> {
    return new Pair(firstMapper(this.first), secondMapper(this.second));
  }

  // 両方の値を使った操作
  combine<R>(combiner: (first: T, second: U) => R): R {
    return combiner(this.first, this.second);
  }

  // 条件付き操作
  mapFirst<V>(mapper: (value: T) => V): Pair<V, U> {
    return new Pair(mapper(this.first), this.second);
  }

  mapSecond<W>(mapper: (value: U) => W): Pair<T, W> {
    return new Pair(this.first, mapper(this.second));
  }
}

// 使用例
const stringNumberPair = new Pair("hello", 42);
const swapped = stringNumberPair.swap(); // Pair<number, string>
const mapped = stringNumberPair.map(
  (str) => str.length,
  (num) => num.toString()
); // Pair<number, string>

const combined = stringNumberPair.combine((str, num) => `${str}: ${num}`);
console.log(combined); // "hello: 42"
```

### 練習問題 2.1: ジェネリッククラス設計 🔰

以下の要件を満たすジェネリッククラスを実装してください：

```typescript
// 1. スタック（LIFO）データ構造
class Stack<T> {
  private items: T[] = [];

  push(item: T): void {
    // 実装してください
  }

  pop(): T | undefined {
    // 実装してください
  }

  peek(): T | undefined {
    // 実装してください
  }

  isEmpty(): boolean {
    // 実装してください
  }

  size(): number {
    // 実装してください
  }
}

// 2. 結果を表現するクラス（成功/失敗）
class Result<T, E> {
  constructor(
    private value: T | null,
    private error: E | null,
    private isSuccess: boolean
  ) {}

  static success<T, E>(value: T): Result<T, E> {
    // 実装してください
  }

  static failure<T, E>(error: E): Result<T, E> {
    // 実装してください
  }

  isOk(): boolean {
    // 実装してください
  }

  isErr(): boolean {
    // 実装してください
  }

  getValue(): T | null {
    // 実装してください
  }

  getError(): E | null {
    // 実装してください
  }
}

// テストケース
const stack = new Stack<number>();
stack.push(1);
stack.push(2);
console.log(stack.pop()); // 2
console.log(stack.peek()); // 1

const success = Result.success<string, Error>("Hello");
const failure = Result.failure<string, Error>(new Error("Something went wrong"));
console.log(success.isOk()); // true
console.log(failure.isErr()); // true
```

### Section 2: 実用的なジェネリック活用

> 📚 **サポート資料**: [実践コード例 - 型安全なAPIクライアント完全版](./Step05_補足_実践コード例.md#型安全なAPIクライアント完全版) | [トラブルシューティング - ジェネリクスエラー対処](./Step05_補足_トラブルシューティング.md#ジェネリクスエラー対処)

#### 🎯 メイン演習: ジェネリック関数ライブラリ

実用的な配列操作ライブラリを作成します。以下の関数を実装してください：

```typescript
// 配列操作ユーティリティライブラリ
class ArrayUtils {
  // 配列をn個ずつのチャンクに分割
  static chunk<T>(array: T[], size: number): T[][] {
    if (size <= 0) throw new Error("Chunk size must be positive");
    
    const result: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size));
    }
    return result;
  }

  // 配列をキー関数でグループ化
  static groupBy<T, K extends string | number | symbol>(
    array: T[],
    keySelector: (item: T) => K
  ): Record<K, T[]> {
    return array.reduce((groups, item) => {
      const key = keySelector(item);
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(item);
      return groups;
    }, {} as Record<K, T[]>);
  }

  // 重複を除去（カスタムキー関数対応）
  static unique<T>(array: T[], keySelector?: (item: T) => unknown): T[] {
    if (!keySelector) {
      return [...new Set(array)];
    }

    const seen = new Set();
    return array.filter((item) => {
      const key = keySelector(item);
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }

  // 配列を条件で分割
  static partition<T>(
    array: T[],
    predicate: (item: T) => boolean
  ): [T[], T[]] {
    const truthy: T[] = [];
    const falsy: T[] = [];
    
    for (const item of array) {
      if (predicate(item)) {
        truthy.push(item);
      } else {
        falsy.push(item);
      }
    }
    
    return [truthy, falsy];
  }

  // 配列の要素を安全に取得
  static at<T>(array: T[], index: number): T | undefined {
    if (index < 0) {
      index = array.length + index;
    }
    return array[index];
  }

  // 配列をフラット化（1レベル）
  static flatten<T>(arrays: T[][]): T[] {
    return arrays.reduce((acc, arr) => acc.concat(arr), []);
  }

  // 配列の差集合
  static difference<T>(array1: T[], array2: T[]): T[] {
    const set2 = new Set(array2);
    return array1.filter(item => !set2.has(item));
  }

  // 配列の積集合
  static intersection<T>(array1: T[], array2: T[]): T[] {
    const set2 = new Set(array2);
    return array1.filter(item => set2.has(item));
  }
}

// 使用例とテストケース
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const chunked = ArrayUtils.chunk(numbers, 3);
console.log(chunked); // [[1, 2, 3], [4, 5, 6], [7, 8, 9], [10]]

const users = [
  { id: 1, name: "Alice", department: "Engineering", age: 30 },
  { id: 2, name: "Bob", department: "Marketing", age: 25 },
  { id: 3, name: "Charlie", department: "Engineering", age: 35 },
  { id: 4, name: "Diana", department: "Marketing", age: 28 },
];

const byDepartment = ArrayUtils.groupBy(users, (user) => user.department);
console.log(byDepartment);
// {
//   Engineering: [Alice, Charlie],
//   Marketing: [Bob, Diana]
// }

const uniqueAges = ArrayUtils.unique(users.map(user => user.age));
console.log(uniqueAges); // [30, 25, 35, 28]

const [adults, young] = ArrayUtils.partition(users, user => user.age >= 30);
console.log(adults); // [Alice, Charlie]
console.log(young); // [Bob, Diana]
```

#### 🔧 データ処理パイプライン

```typescript
// 関数型プログラミングスタイルのデータ処理
class DataProcessor<T> {
  constructor(private data: T[]) {}

  filter(predicate: (item: T) => boolean): DataProcessor<T> {
    return new DataProcessor(this.data.filter(predicate));
  }

  map<U>(transform: (item: T) => U): DataProcessor<U> {
    return new DataProcessor(this.data.map(transform));
  }

  reduce<U>(reducer: (acc: U, item: T) => U, initialValue: U): U {
    return this.data.reduce(reducer, initialValue);
  }

  sort(compareFn?: (a: T, b: T) => number): DataProcessor<T> {
    return new DataProcessor([...this.data].sort(compareFn));
  }

  take(count: number): DataProcessor<T> {
    return new DataProcessor(this.data.slice(0, count));
  }

  skip(count: number): DataProcessor<T> {
    return new DataProcessor(this.data.slice(count));
  }

  groupBy<K extends string | number | symbol>(
    keySelector: (item: T) => K
  ): Record<K, T[]> {
    return ArrayUtils.groupBy(this.data, keySelector);
  }

  toArray(): T[] {
    return [...this.data];
  }

  count(): number {
    return this.data.length;
  }

  first(): T | undefined {
    return this.data[0];
  }

  last(): T | undefined {
    return this.data[this.data.length - 1];
  }
}

// 使用例
const processedUsers = new DataProcessor(users)
  .filter((user) => user.age >= 25)
  .map((user) => ({ ...user, isAdult: user.age >= 30 }))
  .sort((a, b) => a.age - b.age)
  .toArray();

console.log(processedUsers);

// 統計情報の計算
const averageAge = new DataProcessor(users)
  .map(user => user.age)
  .reduce((sum, age) => sum + age, 0) / users.length;

console.log(`Average age: ${averageAge}`);
```

---

## 👨‍🏫 学習ポイント

### 🤔 よくある質問と回答

**Q: ジェネリッククラスのインスタンス化時に型を指定する必要がありますか？**
A: 多くの場合、TypeScriptの型推論により自動的に型が決定されます。ただし、明示的に指定することで、より明確な意図を示すことができます。

**Q: 複数の型パラメータを持つクラスで、一部の型だけを指定することはできますか？**
A: TypeScriptでは、型パラメータは順番に指定する必要があります。一部だけを指定したい場合は、デフォルト型パラメータを使用するか、設計を見直すことを検討してください。

**Q: ジェネリッククラスの継承はどのように行いますか？**
A: 基底クラスの型パラメータを適切に指定して継承します。派生クラスで新しい型パラメータを追加することも可能です。

**Q: パフォーマンスへの影響はありますか？**
A: ジェネリクスはコンパイル時の機能であり、実行時のパフォーマンスには影響しません。むしろ、型安全性により実行時エラーを防ぐことができます。

---

**📌 重要**: Session2では実践的なコーディングを通じてジェネリクスの活用を体感します。完璧を目指さず、まずは動くコードを作ることを重視しましょう。

**🌟 次回（Session3）は、プロジェクトの完成と学習の総括を行います！**