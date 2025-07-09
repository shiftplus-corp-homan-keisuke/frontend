# Session2: ジェネリクス実践演習（90 分）

> 💡 **対象**: Session1 完了者（ジェネリクス基礎理解済み）
> 🎯 **形式**: 講師サポート付き実践学習
> ⏰ **時間**: 90 分

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

- Session1 の内容（ジェネリクス基礎・制約）
- 基本的なクラス設計の経験
- TypeScript の型システムの理解

---

## ⏰ 詳細タイムテーブル

| 時間         | 内容                       | 講師の役割           | 学習者の活動     | 成果物       |
| ------------ | -------------------------- | -------------------- | ---------------- | ------------ |
| **0-10 分**  | 前回復習・今回目標         | 復習確認・目標提示   | 振り返り・質問   | 理解確認     |
| **10-50 分** | ジェネリッククラス実装     | 実演・個別指導       | ハンズオン・実践 | 実践コード   |
| **50-80 分** | ジェネリック関数ライブラリ | コードレビュー・助言 | 個人開発         | システム実装 |
| **80-90 分** | 成果共有・質疑応答         | ファシリテート       | 発表・討論       | 学習成果     |

---

## 📚 学習内容

### Section 1: ジェネリッククラスの設計

> 📚 **関連資料**: [実践コード例 - ジェネリッククラスの実用的実装](./Step05_補足_実践コード例.md#ジェネリッククラスの実用的実装) | [専門用語集 - ジェネリッククラス](./Step05_補足_専門用語集.md#ジェネリッククラスgeneric-classes)

#### 🔧 基本的なジェネリッククラス

まず、値を「箱」に入れて操作できるシンプルなジェネリッククラスから始めましょう。

> 💡 **学習のポイント**:
>
> - `Box<T>`の`T`は「どんな型でも入れられる箱」を意味します
> - 一度型が決まると、その型に関連する操作のみが可能になります
> - 関数型プログラミングの重要な概念（map, flatMap, filter）を体験できます

```typescript
class Box<T> {
  private value: T; // Tは後で決まる型（string, number, booleanなど）

  constructor(value: T) {
    this.value = value;
  }

  // 箱の中身を取得
  getValue(): T {
    return this.value;
  }

  // 箱の中身を更新
  setValue(value: T): void {
    this.value = value;
  }

  // 🌟 重要：値を変換して新しい型の箱を作成
  // 例：文字列→文字列の長さ（string→number）
  map<U>(mapper: (value: T) => U): Box<U> {
    return new Box(mapper(this.value));
  }

  // 🌟 型安全なチェーン操作
  // mapとの違い：mapperが別のBoxを返す場合に使用
  flatMap<U>(mapper: (value: T) => Box<U>): Box<U> {
    return mapper(this.value);
  }

  // 🌟 条件付き操作
  // 条件を満たさない場合はnullを格納
  filter(predicate: (value: T) => boolean): Box<T | null> {
    return new Box(predicate(this.value) ? this.value : null);
  }
}

// 📖 使用例で理解を深めよう
// 1. 基本的な使用方法
const stringBox = new Box("hello"); // Box<string>型として推論される
const numberBox = stringBox.map((str) => str.length); // Box<number>型に変換
const upperBox = stringBox.map((str) => str.toUpperCase()); // Box<string>型を維持

// 2. 🌟 メソッドチェーンの威力
// 複数の変換を連続して実行できる
const result = stringBox
  .map((str) => str.length) // string → number
  .map((len) => len * 2) // number → number
  .getValue(); // number型の値を取得

// 💡 なぜこれが便利なのか？
// - 各ステップで型安全性が保証される
// - 中間変数を作らずに処理を連鎖できる
// - エラーが発生する可能性を減らせる
```

**🔍 理解チェック**:

- `stringBox.map((str) => str.length)`で、なぜ戻り値が`Box<number>`になるのでしょうか？
- メソッドチェーンで型が変わっていく様子を観察してみましょう！

#### 🔧 複数型パラメータのクラス

2 つの異なる型の値をペアで管理できるクラスを作ってみましょう。

> 💡 **学習のポイント**:
>
> - `Pair<T, U>`は 2 つの独立した型パラメータを持ちます
> - 各型パラメータは独立して操作できます
> - 実用的な例：座標(x, y)、キーと値のペア、エラー処理など

```typescript
class Pair<T, U> {
  constructor(private first: T, private second: U) {}

  // 基本的なアクセサー
  getFirst(): T {
    return this.first;
  }

  getSecond(): U {
    return this.second;
  }

  // 🌟 型パラメータを交換する操作
  // Pair<T, U> → Pair<U, T>
  swap(): Pair<U, T> {
    return new Pair(this.second, this.first);
  }

  // 🌟 両方の値を同時に変換
  // それぞれ異なる変換関数を適用できる
  map<V, W>(
    firstMapper: (value: T) => V,
    secondMapper: (value: U) => W
  ): Pair<V, W> {
    return new Pair(firstMapper(this.first), secondMapper(this.second));
  }

  // 🌟 両方の値を使った単一の結果を生成
  // 例：文字列と数値から「文字列: 数値」を作成
  combine<R>(combiner: (first: T, second: U) => R): R {
    return combiner(this.first, this.second);
  }

  // 🌟 片方だけを変換する便利メソッド
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
// 📖 Pairクラスの実用的な使用例
// 1. 基本的な使用方法
const stringNumberPair = new Pair("hello", 42); // Pair<string, number>

// 2. 🌟 型パラメータを交換
const swapped = stringNumberPair.swap(); // Pair<number, string>
// 元：("hello", 42) → 結果：(42, "hello")

// 3. 🌟 両方の値を同時に変換
const mapped = stringNumberPair.map(
  (str) => str.length, // string → number
  (num) => num.toString() // number → string
); // Pair<number, string>
// 元：("hello", 42) → 結果：(5, "42")

// 4. 🌟 両方の値を組み合わせて新しい値を作成
const combined = stringNumberPair.combine((str, num) => `${str}: ${num}`);
console.log(combined); // "hello: 42"

// 💡 実用的なケース
// - 座標系：Pair<number, number> で (x, y) 座標
// - キーバリュー：Pair<string, T> でキーと値のペア
// - エラー処理：Pair<Error | null, T | null> で成功/失敗の情報
```

**🔍 理解チェック**:

- `swap()`を 2 回呼び出すと、元の状態に戻るでしょうか？
- `map()`と`mapFirst()`の違いを説明できますか？

### 練習問題 2.1: ジェネリッククラス設計 🔰

ここからは実際に手を動かして学習しましょう！以下の 2 つのクラスを実装してください。

> 💡 **学習のポイント**:
>
> - **Stack**: データ構造の基本である「後入れ先出し（LIFO）」の実装
> - **Result**: エラーハンドリングの型安全な実装パターン

#### 🎯 実装のヒント

```typescript
// 1. 🥞 スタック（LIFO）データ構造
// 「皿を重ねる」ようなイメージ：最後に置いたものが最初に取り出される
class Stack<T> {
  private items: T[] = [];

  // 📝 実装のヒント：
  // - push: 配列の末尾に要素を追加
  // - pop: 配列の末尾から要素を取り出して返す
  // - peek: 配列の末尾を「見る」だけで取り出さない
  // - isEmpty: 配列の長さが0かどうかを確認
  // - size: 配列の長さを返す

  push(item: T): void {
    // 🔍 ヒント：Array.push()を使用
    // 実装してください
  }

  pop(): T | undefined {
    // 🔍 ヒント：Array.pop()を使用、空の場合はundefinedを返す
    // 実装してください
  }

  peek(): T | undefined {
    // 🔍 ヒント：最後の要素を取り出さずに確認
    // 実装してください
  }

  isEmpty(): boolean {
    // 🔍 ヒント：items.length === 0
    // 実装してください
  }

  size(): number {
    // 🔍 ヒント：items.length
    // 実装してください
  }
}

// 2. 🎯 結果を表現するクラス（成功/失敗の型安全な管理）
// Rustの Result<T, E> やFunctional Programmingの Either パターンを参考
class Result<T, E> {
  constructor(
    private value: T | null,
    private error: E | null,
    private isSuccess: boolean
  ) {}

  // 📝 実装のヒント：
  // - success: 成功時のResultを作成（valueを設定、errorはnull）
  // - failure: 失敗時のResultを作成（errorを設定、valueはnull）
  // - isOk/isErr: 成功/失敗の状態を確認
  // - getValue/getError: 値やエラーを取得

  // 🌟 静的メソッド：成功のResultを作成
  static success<T, E>(value: T): Result<T, E> {
    // 🔍 ヒント：new Result(value, null, true)
    // 実装してください
  }

  // 🌟 静的メソッド：失敗のResultを作成
  static failure<T, E>(error: E): Result<T, E> {
    // 🔍 ヒント：new Result(null, error, false)
    // 実装してください
  }

  isOk(): boolean {
    // 🔍 ヒント：isSuccessフィールドを返す
    // 実装してください
  }

  isErr(): boolean {
    // 🔍 ヒント：!isSuccessまたはisSuccess === false
    // 実装してください
  }

  getValue(): T | null {
    // 🔍 ヒント：valueフィールドを返す
    // 実装してください
  }

  getError(): E | null {
    // 🔍 ヒント：errorフィールドを返す
    // 実装してください
  }
}

// 📋 テストケースで動作を確認しよう
// 🥞 Stackのテスト
const stack = new Stack<number>();
stack.push(1); // [1]
stack.push(2); // [1, 2]
console.log(stack.pop()); // 2 （最後に入れたものが先に出る）
console.log(stack.peek()); // 1 （取り出さずに確認）
console.log(stack.size()); // 1 （残りの要素数）

// 🎯 Resultのテスト
const success = Result.success<string, Error>("Hello");
const failure = Result.failure<string, Error>(
  new Error("Something went wrong")
);

console.log(success.isOk()); // true
console.log(failure.isErr()); // true
console.log(success.getValue()); // "Hello"
console.log(failure.getError()); // Error: Something went wrong

// 💡 実用的な使用例
// ファイル読み込み関数のような、失敗する可能性のある操作
function readFile(filename: string): Result<string, Error> {
  if (filename === "valid.txt") {
    return Result.success("ファイル内容");
  } else {
    return Result.failure(new Error("ファイルが見つかりません"));
  }
}

const fileResult = readFile("valid.txt");
if (fileResult.isOk()) {
  console.log("読み込み成功:", fileResult.getValue());
} else {
  console.log("エラー:", fileResult.getError()?.message);
}
```

**🔍 実装後の理解チェック**:

- なぜ`Stack`のメソッドは`T | undefined`を返すのでしょうか？
- `Result`クラスで、なぜ`success`と`failure`を静的メソッドにしたのでしょうか？
- 実際のプロジェクトでこれらのクラスはどのように活用できるでしょうか？

### Section 2: 実用的なジェネリック活用

> 📚 **サポート資料**: [実践コード例 - 型安全な API クライアント完全版](./Step05_補足_実践コード例.md#型安全なAPIクライアント完全版) | [トラブルシューティング - ジェネリクスエラー対処](./Step05_補足_トラブルシューティング.md#ジェネリクスエラー対処)

#### 🎯 メイン演習: ジェネリック関数ライブラリ

実用的な配列操作ライブラリを作成します。実際の開発でよく使われるパターンを学びましょう。

> 💡 **学習のポイント**:
>
> - **静的メソッド**: インスタンスを作らずに呼び出せるユーティリティ関数
> - **型制約**: `K extends string | number | symbol`のような制約の使い方
> - **実用性**: Lodash や Ramda 等のライブラリで実際に使われているパターン

```typescript
// 🧰 配列操作ユーティリティライブラリ
// 実際のプロジェクトで使える実用的な関数群
class ArrayUtils {
  // 📦 配列を指定サイズのチャンクに分割
  // 例: [1,2,3,4,5] → [[1,2,3], [4,5]] (size=3)
  static chunk<T>(array: T[], size: number): T[][] {
    if (size <= 0) throw new Error("Chunk size must be positive");

    const result: T[][] = [];
    // 📝 実装のポイント：ループでsize分ずつ配列を切り取る
    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size));
    }
    return result;
  }

  // 🗂️ 配列をキー関数でグループ化
  // 例: ユーザーを部署ごとにグループ化
  static groupBy<T, K extends string | number | symbol>(
    array: T[],
    keySelector: (item: T) => K
  ): Record<K, T[]> {
    // 📝 実装のポイント：reduceでグループを蓄積
    return array.reduce((groups, item) => {
      const key = keySelector(item);
      if (!groups[key]) {
        groups[key] = []; // 初回は空配列を作成
      }
      groups[key].push(item);
      return groups;
    }, {} as Record<K, T[]>);
  }

  // 🔍 重複を除去（カスタムキー関数対応）
  // 例: オブジェクトのIDで重複除去
  static unique<T>(array: T[], keySelector?: (item: T) => unknown): T[] {
    if (!keySelector) {
      // 📝 プリミティブ型の場合：Setを使用
      return [...new Set(array)];
    }

    // 📝 オブジェクトの場合：カスタムキーで重複判定
    const seen = new Set();
    return array.filter((item) => {
      const key = keySelector(item);
      if (seen.has(key)) {
        return false; // 既に見たキーなら除外
      }
      seen.add(key);
      return true;
    });
  }

  // ⚡ 配列を条件で分割
  // 例: 成人と未成年に分割
  static partition<T>(array: T[], predicate: (item: T) => boolean): [T[], T[]] {
    const truthy: T[] = [];
    const falsy: T[] = [];

    // 📝 実装のポイント：1回のループで両方の配列を作成
    for (const item of array) {
      if (predicate(item)) {
        truthy.push(item);
      } else {
        falsy.push(item);
      }
    }

    return [truthy, falsy]; // タプル型で返す
  }

  // 🎯 配列の要素を安全に取得
  // 例: 負のインデックスで末尾からアクセス
  static at<T>(array: T[], index: number): T | undefined {
    // 📝 実装のポイント：負のインデックスをサポート
    if (index < 0) {
      index = array.length + index; // -1は最後の要素
    }
    return array[index];
  }

  // 🎯 配列をフラット化（1レベルのみ）
  // 例: [[1,2], [3,4]] → [1,2,3,4]
  static flatten<T>(arrays: T[][]): T[] {
    // 📝 実装のポイント：reduceとconcatで結合
    return arrays.reduce((acc, arr) => acc.concat(arr), []);
  }

  // 🔄 配列の差集合（array1にあってarray2にない要素）
  // 例: [1,2,3] - [2,3,4] = [1]
  static difference<T>(array1: T[], array2: T[]): T[] {
    const set2 = new Set(array2); // 📝 高速な検索のためSet使用
    return array1.filter((item) => !set2.has(item));
  }

  // 🔄 配列の積集合（両方の配列に存在する要素）
  // 例: [1,2,3] ∩ [2,3,4] = [2,3]
  static intersection<T>(array1: T[], array2: T[]): T[] {
    const set2 = new Set(array2); // 📝 高速な検索のためSet使用
    return array1.filter((item) => set2.has(item));
  }
}

// 📋 実用的な使用例で理解を深めよう
// 🎯 テストデータ
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// 1. 🔢 配列を3つずつのチャンクに分割
const chunked = ArrayUtils.chunk(numbers, 3);
console.log(chunked); // [[1, 2, 3], [4, 5, 6], [7, 8, 9], [10]]
// 💡 活用例：ページネーション、バッチ処理

// 2. 👥 ユーザーデータのグループ化
const users = [
  { id: 1, name: "Alice", department: "Engineering", age: 30 },
  { id: 2, name: "Bob", department: "Marketing", age: 25 },
  { id: 3, name: "Charlie", department: "Engineering", age: 35 },
  { id: 4, name: "Diana", department: "Marketing", age: 28 },
];

// 🗂️ 部署ごとにグループ化
const byDepartment = ArrayUtils.groupBy(users, (user) => user.department);
console.log(byDepartment);
// {
//   Engineering: [Alice, Charlie],
//   Marketing: [Bob, Diana]
// }
// 💡 活用例：レポート生成、データ分析

// 3. 🔍 重複する年齢を除去
const uniqueAges = ArrayUtils.unique(users.map((user) => user.age));
console.log(uniqueAges); // [30, 25, 35, 28]
// 💡 活用例：フィルター選択肢の生成

// 4. ⚡ 年齢で成人/未成年に分割
const [adults, young] = ArrayUtils.partition(users, (user) => user.age >= 30);
console.log(adults); // [Alice, Charlie]
console.log(young); // [Bob, Diana]
// 💡 活用例：条件別の処理、A/Bテスト

// 5. 🔄 配列の集合演算
const group1 = [1, 2, 3, 4];
const group2 = [3, 4, 5, 6];
const difference = ArrayUtils.difference(group1, group2); // [1, 2]
const intersection = ArrayUtils.intersection(group1, group2); // [3, 4]
console.log("差集合:", difference);
console.log("積集合:", intersection);
// 💡 活用例：権限管理、タグ管理
```

**🔍 理解チェック**:

- なぜ`groupBy`の戻り値が`Record<K, T[]>`なのでしょうか？
- `unique`関数で`keySelector`が省略可能なのはなぜでしょうか？
- 実際のプロジェクトで、これらの関数はどのような場面で使えるでしょうか？

---

## 🎯 実践チャレンジ

学習した内容を組み合わせて、実際のユースケースに挑戦してみましょう！

### チャレンジ 1: ショッピングカートシステム 🛒

```typescript
// 商品情報の型定義
interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
}

// カートアイテムの型定義
interface CartItem {
  product: Product;
  quantity: number;
}

// 課題：以下の機能を持つShoppingCartクラスを実装してください
// - 商品の追加/削除
// - 数量の変更
// - 合計金額の計算
// - カテゴリ別の集計
// - 在庫チェック機能

class ShoppingCart<T extends Product> {
  // 実装してください
}
```

### チャレンジ 2: 型安全な設定管理システム ⚙️

```typescript
// 設定の型定義
interface Config {
  database: {
    host: string;
    port: number;
  };
  cache: {
    enabled: boolean;
    ttl: number;
  };
  features: {
    newUI: boolean;
    analytics: boolean;
  };
}

// 課題：ネストしたオブジェクトの値を型安全に取得/設定できるクラスを実装
class ConfigManager<T extends Record<string, any>> {
  // 実装してください
  // ヒント：keyof演算子とdot notation（"database.host"）を活用
}
```

### チャレンジ 3: 非同期処理の型安全ラッパー 🔄

```typescript
// 課題：Promise<T>をラップして、エラーハンドリングを型安全に行うクラス
class AsyncResult<T, E = Error> {
  // 実装してください
  // 機能：
  // - Promise<T>をAsyncResult<T, E>に変換
  // - map, flatMap, catchなどの関数型メソッド
  // - 複数のAsyncResultを並列実行
}
```

**🔍 チャレンジのポイント**:

- 学習した全ての概念を統合して使用
- 実際のプロジェクトで遭遇する問題を解決
- 型安全性とコードの可読性を両立

---

## 👨‍🏫 学習ポイント

### 🤔 よくある質問と回答

**Q: ジェネリッククラスのインスタンス化時に型を指定する必要がありますか？**
A: 多くの場合、TypeScript の型推論により自動的に型が決定されます。ただし、明示的に指定することで、より明確な意図を示すことができます。

**Q: 複数の型パラメータを持つクラスで、一部の型だけを指定することはできますか？**
A: TypeScript では、型パラメータは順番に指定する必要があります。一部だけを指定したい場合は、デフォルト型パラメータを使用するか、設計を見直すことを検討してください。

**Q: ジェネリッククラスの継承はどのように行いますか？**
A: 基底クラスの型パラメータを適切に指定して継承します。派生クラスで新しい型パラメータを追加することも可能です。

**Q: パフォーマンスへの影響はありますか？**
A: ジェネリクスはコンパイル時の機能であり、実行時のパフォーマンスには影響しません。むしろ、型安全性により実行時エラーを防ぐことができます。

---

**📌 重要**: Session2 では実践的なコーディングを通じてジェネリクスの活用を体感します。完璧を目指さず、まずは動くコードを作ることを重視しましょう。

**🌟 次回（Session3）は、プロジェクトの完成と学習の総括を行います！**
