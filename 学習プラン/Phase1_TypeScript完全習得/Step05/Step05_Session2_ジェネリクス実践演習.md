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

ここからは実際に手を動かして学習しましょう！

**概要：**
スタックは「後入れ先出し（LIFO: Last-In, First-Out）」の原則で動作するデータ構造です。本を積み上げて、一番上から取っていくイメージです。
今回は、数値（`number`）専用や文字列（`string`）専用のスタックではなく、どんな型のデータでも扱える**再利用可能**な `Stack` クラスをジェネリクスを使って作成します。

**要件：**
以下の仕様を満たすジェネリッククラス `Stack<T>` を作成してください。

1.  **クラス定義**
    *   クラス名は `Stack` とし、ジェネリック型パラメータ `<T>` を受け取れるようにします。

2.  **プロパティ**
    *   スタックの要素を保持するための配列を、`private` なプロパティとして持ちます。外部から直接この配列を操作できないようにするためです。
        *   プロパティ名： `items`
        *   型： `T[]` （ジェネリック型 `T` の配列）

3.  **メソッド**
    *   `push(item: T): void`
        *   スタックの一番上に新しい要素 `item` を追加します。
    *   `pop(): T | undefined`
        *   スタックの一番上の要素を取り除き、その要素を返します。スタックが空の場合は `undefined` を返します。
    *   `peek(): T | undefined`
        *   スタックの一番上の要素を、取り除かずに**参照だけ**します（覗き見）。スタックが空の場合は `undefined` を返します。
    *   `isEmpty(): boolean`
        *   スタックが空の場合に `true`、そうでない場合に `false` を返します。
    *   `size(): number`
        *   スタック内の要素の数を返します。

**使用例：**
以下のように、`number`型と`string`型でそれぞれインスタンス化して、正しく動作することを確認します。

```typescript
// 数値型のスタックを作成
const numberStack = new Stack<number>();

numberStack.push(10);
numberStack.push(20);
console.log(numberStack.size());     // 出力: 2
console.log(numberStack.peek());     // 出力: 20
console.log(numberStack.pop());      // 出力: 20
console.log(numberStack.peek());     // 出力: 10
console.log(numberStack.isEmpty());  // 出力: false

// string型のスタックを作成
const stringStack = new Stack<string>();

stringStack.push("hello");
stringStack.push("world");

// 型安全性の確認（以下の行はコンパイルエラーになるはず）
// numberStack.push("this is a string"); // Error!
// stringStack.push(123);               // Error!

console.log(stringStack.pop()); // 出力: "world"
```

**チャレンジ：**
*   なぜ `items` プロパティを `private` にするのでしょうか？そのメリットを考えてみましょう。
*   `pop` メソッドと `peek` メソッドの違いを意識して実装してみましょう



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
