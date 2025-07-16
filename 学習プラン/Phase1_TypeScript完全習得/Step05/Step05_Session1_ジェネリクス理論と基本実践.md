# Session1: ジェネリクス理論と基本実践（90分）

> 💡 **対象**: Step01-04完了者（基本型・インターフェース・ユニオン型・型ガード習得済み）
> 🎯 **形式**: 講師サポート付き学習
> ⏰ **時間**: 90分（休憩含む）

## 📚 関連補足資料

このセッションの学習をサポートする補足資料をご用意しています：

- 📖 **[専門用語集](./Step05_補足_専門用語集.md)** - ジェネリクス・型制約・高度な型機能の重要な概念と用語の詳細解説
- 💻 **[実践コード例](./Step05_補足_実践コード例.md)** - 段階的な学習のためのコード例集
- 🔧 **[開発環境ガイド](./Step05_補足_開発環境ガイド.md)** - 効率的な開発環境の活用
- 🌐 **[参考リソース](./Step05_補足_参考リソース.md)** - 学習に役立つリンク集とリソース
- 🚨 **[トラブルシューティング](./Step05_補足_トラブルシューティング.md)** - よくあるエラーと解決方法

> 💡 **活用方法**: 学習中に疑問が生じた際や、より深く理解したい場合に参照してね 🐰

## 📅 セッション概要

**学習目標**:

- [ ] ジェネリクスの基本概念と実践的価値の理解
- [ ] 基本的なジェネリック関数・配列操作の実装
- [ ] ジェネリック制約（extends、keyof）の活用
- [ ] 型推論とジェネリクスの組み合わせ理解

**前提知識**:

- Step01-04の内容（基本型、インターフェース、ユニオン型、型ガード）
- 関数・クラスの基本的な実装経験
- TypeScriptの型システムの基礎理解

---

## ⏰ 詳細タイムテーブル

| 時間         | 内容                     | 講師の役割           | 学習者の活動   | 成果物     |
| ------------ | ------------------------ | -------------------- | -------------- | ---------- |
| **0-10分**   | 全体概要・目標設定       | 説明・質疑応答       | 聞く・質問     | 理解確認   |
| **10-30分**  | ジェネリクス基本概念     | 要点解説・補足       | 個人学習・確認 | 知識整理   |
| **30-60分**  | ジェネリック制約の基礎   | 実演・個別サポート   | ハンズオン     | 基本コード |
| **60-80分**  | 練習問題1-2              | 巡回サポート・ヒント | 個人作業       | 練習成果   |
| **80-90分**  | 振り返り・次回予告       | まとめ・予告         | 質問・確認     | 学習計画   |

---

## 📚 学習内容

### Section 1: ジェネリクスの基本概念

> 📚 **関連資料**: [専門用語集 - ジェネリクス関連用語](./Step05_補足_専門用語集.md#ジェネリクスgenerics) | [実践コード例 - 基本から始める段階的学習](./Step05_補足_実践コード例.md#基本から始める段階的学習)

#### 🔍 ジェネリクスの実践的価値

**💡 なぜジェネリクスが重要なのか**

ジェネリクスは、型安全性を保ちながらコードの再利用性を大幅に向上させるTypeScriptの核心機能です。同じロジックを異なる型で使い回すことで、コード重複を解決し、保守性を向上させます。特にライブラリ設計、APIクライアント開発、データ構造の実装において、ジェネリクスは堅牢で柔軟なコードベースの構築を可能にします。

**🎯 どういう場面で使うのか**

- **ライブラリ設計**: 再利用可能なユーティリティ関数・クラスの作成
- **APIクライアント**: 型安全なレスポンス処理とエンドポイント管理
- **データ構造**: 配列、リスト、ツリーなどの汎用的なデータ構造
- **状態管理**: Redux、Zustandなどでの型安全な状態管理
- **フォーム処理**: 型安全なバリデーションとデータ変換

#### 1. 基本的なジェネリクス

> 💡 **詳細解説**: ジェネリクスの詳細と実践的な活用パターンは [Step05_補足_専門用語集.md#ジェネリクスgenerics](./Step05_補足_専門用語集.md#ジェネリクスgenerics) を見てね 🐰

```typescript
// any を使った良くない例
function getFirstElement(arr: any[]): any {
  return arr[0];
}

const numbers = [10, 20, 30];
const firstNumber = getFirstElement(numbers);
// firstNumber は any 型になってしまう！
// この後、number型として使いたいのに、TypeScriptの恩恵を受けられない。
// 例えば、エディタで firstNumber. と入力しても、数値用のメソッド(toFixedなど)の補完が効かない。

const strings = ["apple", "banana", "cherry"];
const firstString = getFirstElement(strings);
// firstString も any 型。
```

any を使うと、せっかく配列が持っていた「これは数値の配列だ」「これは文字列の配列だ」という**型情報が失われてしま🐰**
また、`getFiirstElementメソッド`の引数の型を`(arr: number[])` のように具体的な型を指定すると指定した型でしか使えなくなります･。

**ジェネリクスを使った実践的な解決策**

ここでジェネリクスの出番です。
「**どんな型の配列でも受け取れるが、その配列の要素の型は失わない**」関数を作ることができます。

```ts
/**
 * 配列を受け取り、その最初の要素を返す。
 * 配列が空、または存在しない場合は undefined を返す。
 * @param arr - 任意の型の配列
 * @returns 配列の最初の要素、または undefined
 */
function getFirstElement<T>(arr: T[]): T | undefined {
  return arr[0];
}

// --- 使ってみよう！ ---

// (1) 数値の配列を渡した場合
const numbers = [10, 20, 30];
const firstNumber = getFirstElement<number>(numbers); // <number>がなkTypeScriptが T を `number` と推論

// firstNumber の型は `number | undefined` になる。
// 型がしっかりついている！
if (firstNumber !== undefined) {
  // このブロック内では、firstNumber は number型であることが確定する。
  console.log(firstNumber.toFixed(2)); // "10.00" (number型のメソッドが使える！)
}


// (2) 文字列の配列を渡した場合
const strings = ["apple", "banana", "cherry"];
const firstString = getFirstElement(strings); // TypeScriptが T を `string` と推論

// firstString の型は `string | undefined` になる。
if (firstString !== undefined) {
  // このブロック内では、firstString は string型であることが確定する。
  console.log(firstString.toUpperCase()); // "APPLE" (string型のメソッドが使える！)
}

// (3) オブジェクトの配列でもOK
const users = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" },
];
const firstUser = getFirstElement(users); // T を `{ id: number, name: string }` と推論

// firstUser の型は `{ id: number, name: string } | undefined` になる。
if (firstUser !== undefined) {
  console.log(firstUser.name); // "Alice" (プロパティに安全にアクセスできる！)
}

// (4) 空の配列を渡した場合
const emptyArray: string[] = [];
const nothing = getFirstElement(emptyArray);
// nothing の型は `string | undefined` になり、実際の値は undefined となる。
```



**📝 設計の詳細解説**

- ジェネリクス `<T>` により、任意の型を受け入れながら型安全性を保持
- 型推論により、明示的な型指定なしでも適切な型が推論される
- 同一のロジックを複数の型で再利用可能

**⚠️ よくある間違いと注意点**

```typescript
// ❌ 間違い: any型を使用（型安全性を失う）
function badIdentity(arg: any): any {
  return arg;
}

// ❌ 間違い: 型ごとに関数を重複作成
function stringIdentity(arg: string): string {
  return arg;
}
function numberIdentity(arg: number): number {
  return arg;
}

// ✅ 正解: ジェネリクスで型安全かつ再利用可能
function goodIdentity<T>(arg: T): T {
  return arg;
}
```

#### 2. 複数の型パラメータ

```typescript
function pair<T, U>(first: T, second: U): [T, U] {
  return [first, second];
}

const stringNumberPair = pair("hello", 42); // [string, number]
const booleanArrayPair = pair(true, [1, 2, 3]); // [boolean, number[]]
```

#### 3. ジェネリック配列操作での型安全性確保

```typescript
function getFirst<T>(array: T[]): T | undefined {
  return array.length > 0 ? array[0] : undefined;
}

function getLast<T>(array: T[]): T | undefined {
  return array.length > 0 ? array[array.length - 1] : undefined;
}

function reverse<T>(array: T[]): T[] {
  return [...array].reverse();
}

// 使用例
const numbers = [1, 2, 3, 4, 5];
const firstNumber = getFirst(numbers); // number | undefined
const lastNumber = getLast(numbers); // number | undefined
const reversedNumbers = reverse(numbers); // number[]

const strings = ["apple", "banana", "cherry"];
const firstString = getFirst(strings); // string | undefined
const reversedStrings = reverse(strings); // string[]
```

### 練習問題 1.1: 基本ジェネリック関数 🔰

以下の要件を満たすジェネリック関数を実装してください：

```typescript
// 1. 配列の最後の要素を取得する関数
function getLast<T>(array: T[]): T | undefined {
  // ここに実装
}

// 2. 2つの値を交換したタプルを返す関数
function swap<T, U>(first: T, second: U): [U, T] {
  // ここに実装
}

// テストケース
const numbers = [1, 2, 3, 4, 5];
console.log(getLast(numbers)); // 5

const swapped = swap("hello", 42);
console.log(swapped); // [42, "hello"]
```

### Section 2: ジェネリック制約の基礎

> 📚 **関連資料**: [実践コード例 - ジェネリック制約の実践](./Step05_補足_実践コード例.md#ジェネリック制約の実践) | [専門用語集 - ジェネリック制約](./Step05_補足_専門用語集.md#ジェネリック制約generic-constraints)

#### 🎯 ジェネリック制約の設計思想

**💡 なぜジェネリック制約が重要なのか**

ジェネリック制約（Generic Constraints）は、ジェネリクスの柔軟性を保ちながら、特定のプロパティやメソッドの存在を保証する仕組みです。`extends`キーワードを使用することで、型安全性を確保しつつ、より具体的な操作を可能にします。

**🎯 どういう場面で使うのか**

- **APIクライアント設計**: エンドポイント定義での型安全性確保
- **データ変換処理**: オブジェクトのプロパティアクセスでの安全性保証
- **ライブラリ開発**: 特定のインターフェースを満たす型のみを受け入れ
- **フォーム処理**: 特定のプロパティを持つオブジェクトの検証

#### 1. extends制約による安全なプロパティアクセス

```typescript
interface Lengthwise {
  length: number;
}

function loggingIdentity<T extends Lengthwise>(arg: T): T {
  console.log(arg.length); // lengthプロパティが保証される
  return arg;
}

// 使用例
loggingIdentity("hello"); // OK: string has length
loggingIdentity([1, 2, 3]); // OK: array has length
loggingIdentity({ length: 10, value: 3 }); // OK: object has length
// loggingIdentity(3); // Error: number doesn't have length
```

**📝 設計の詳細解説**

- `extends`制約により、特定のプロパティの存在を保証
- 型安全性を確保しながら、具体的な操作を可能にする
- 柔軟性と安全性のバランスを実現

#### 2. keyof制約

> 💡 **詳細解説**: keyof演算子の詳細と実践的な活用パターンは [Step05_補足_専門用語集.md#keyof演算子keyof-operator](./Step05_補足_専門用語集.md#keyof演算子keyof-operator) を見てね 🐰

```typescript
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

interface Person {
  name: string;
  age: number;
  email: string;
}

const person: Person = { name: "Alice", age: 30, email: "alice@example.com" };

const name = getProperty(person, "name"); // string型
const age = getProperty(person, "age"); // number型
// const invalid = getProperty(person, "invalid"); // Error
```

### 練習問題 1.2: ジェネリック制約 🔰

以下の要件を満たすジェネリック関数を実装してください：

```typescript
// 1. lengthプロパティを持つ型のみを受け入れ、長さを返す関数
function getLength<T extends { length: number }>(item: T): number {
  // ここに実装
}

// 2. オブジェクトから複数のプロパティを取得する関数
function pick<T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  // ここに実装
}

// テストケース
console.log(getLength("hello")); // 5
console.log(getLength([1, 2, 3])); // 3

const user = { name: "Alice", age: 30, email: "alice@example.com" };
const picked = pick(user, ["name", "age"]);
console.log(picked); // { name: "Alice", age: 30 }
```

---

## 🎯 練習問題

> 📚 **サポート資料**: [実践コード例 - ジェネリクスの練習](./Step05_補足_実践コード例.md#ジェネリクスの練習) | [トラブルシューティング](./Step05_補足_トラブルシューティング.md#ジェネリクス関連エラー)

### 練習問題 1: 配列ユーティリティ関数（10分）

以下のジェネリック配列ユーティリティ関数を実装してください：

```typescript
// 配列をn個ずつのチャンクに分割する関数
function chunk<T>(array: T[], size: number): T[][] {
  // 実装してください
  // ヒント: forループとsliceを使用
}

// 配列から重複を除去する関数
function unique<T>(array: T[]): T[] {
  // 実装してください
  // ヒント: Setを使用
}

// テストケース
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
console.log(chunk(numbers, 3)); // [[1, 2, 3], [4, 5, 6], [7, 8, 9]]

const duplicates = [1, 2, 2, 3, 3, 3, 4];
console.log(unique(duplicates)); // [1, 2, 3, 4]
```

### 練習問題 2: 型安全なプロパティアクセス（10分）

以下の要件を満たす関数を実装してください：

```typescript
// オブジェクトのプロパティを安全に更新する関数
function updateProperty<T, K extends keyof T>(
  obj: T,
  key: K,
  value: T[K]
): T {
  // 実装してください
  // ヒント: スプレッド演算子を使用して新しいオブジェクトを返す
}

// ネストしたプロパティの値を取得する関数（簡単版）
function getNestedProperty<T, K extends keyof T>(
  obj: T,
  key: K
): T[K] | undefined {
  // 実装してください
}

// テストケース
const user = { name: "Alice", age: 30, email: "alice@example.com" };
const updated = updateProperty(user, "age", 31);
console.log(updated); // { name: "Alice", age: 31, email: "alice@example.com" }

const name = getNestedProperty(user, "name");
console.log(name); // "Alice"
```

---

## 👨‍🏫 学習ポイント

### 🤔 よくある質問

**Q: ジェネリクスと any型の違いは何ですか？**
A: ジェネリクスは型安全性を保ちながら柔軟性を提供しますが、any型は型チェックを完全に無効にします。ジェネリクスを使用することで、コンパイル時に型エラーを検出でき、より安全なコードが書けます。

**Q: いつジェネリック制約を使うべきですか？**
A: 特定のプロパティやメソッドにアクセスする必要がある場合に使用します。制約なしでは、型パラメータTに対して何も仮定できないため、プロパティアクセスでエラーになります。

**Q: 型推論はいつ働きますか？**
A: 関数の引数から型が明確に推論できる場合に働きます。明示的な型指定と型推論のバランスを考えて使い分けましょう。

---

**📌 重要**: Session1はジェネリクスの基礎固めです。焦らず確実に基本概念を理解しましょう。

**🌟 次回（Session2）は、より実践的なジェネリッククラスの設計と実用的な活用に挑戦します！**