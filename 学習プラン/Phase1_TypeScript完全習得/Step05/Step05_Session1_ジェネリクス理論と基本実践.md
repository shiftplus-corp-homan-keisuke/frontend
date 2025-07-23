# Session1: ジェネリクス理論と基本実践（90 分）

> 💡 **対象**: Step01-04 完了者（基本型・インターフェース・ユニオン型・型ガード習得済み）
> 🎯 **形式**: 講師サポート付き学習
> ⏰ **時間**: 90 分（休憩含む）

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

- Step01-04 の内容（基本型、インターフェース、ユニオン型、型ガード）
- 関数・クラスの基本的な実装経験
- TypeScript の型システムの基礎理解

---

## ⏰ 詳細タイムテーブル

| 時間         | 内容                   | 講師の役割           | 学習者の活動   | 成果物     |
| ------------ | ---------------------- | -------------------- | -------------- | ---------- |
| **0-10 分**  | 全体概要・目標設定     | 説明・質疑応答       | 聞く・質問     | 理解確認   |
| **10-30 分** | ジェネリクス基本概念   | 要点解説・補足       | 個人学習・確認 | 知識整理   |
| **30-60 分** | ジェネリック制約の基礎 | 実演・個別サポート   | ハンズオン     | 基本コード |
| **60-80 分** | 練習問題 1-2           | 巡回サポート・ヒント | 個人作業       | 練習成果   |
| **80-90 分** | 振り返り・次回予告     | まとめ・予告         | 質問・確認     | 学習計画   |

---

## 📚 学習内容

### Section 1: ジェネリクスの基本概念

> 📚 **関連資料**: [専門用語集 - ジェネリクス関連用語](./Step05_補足_専門用語集.md#ジェネリクスgenerics) | [実践コード例 - 基本から始める段階的学習](./Step05_補足_実践コード例.md#基本から始める段階的学習)

#### 🔍 ジェネリクスの実践的価値

**💡 なぜジェネリクスが重要なのか**

ジェネリクスは、型安全性を保ちながらコードの再利用性を大幅に向上させる TypeScript の核心機能です。同じロジックを異なる型で使い回すことで、コード重複を解決し、保守性を向上させます。特にライブラリ設計、API クライアント開発、データ構造の実装において、ジェネリクスは堅牢で柔軟なコードベースの構築を可能にします。

**🎯 どういう場面で使うのか**

- **ライブラリ設計**: 再利用可能なユーティリティ関数・クラスの作成
- **API クライアント**: 型安全なレスポンス処理とエンドポイント管理
- **データ構造**: 配列、リスト、ツリーなどの汎用的なデータ構造
- **フォーム処理**: 型安全なバリデーションとデータ変換

#### 1. 基本的なジェネリクス

> 💡 **詳細解説**: ジェネリクスの詳細と実践的な活用パターンは [Step05*補足*専門用語集.md#ジェネリクス generics](./Step05_補足_専門用語集.md#ジェネリクスgenerics) を見てね 🐰

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

any を使うと、せっかく配列が持っていた「これは数値の配列だ」「これは文字列の配列だ」という**型情報が失われてしま 🐰**
また、`getFiirstElementメソッド`の引数の型を `(arr: number[])` のように具体的な型を指定すると指定した型でしか使えなくなります。

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
const firstNumber = getFirstElement<number>(numbers); // <number>が無くてもTypeScriptが T を `number` と推論

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

**🍎 Session0 で作った高階関数をジェネリクスを使って汎用性を持たせてみよ 🐰**

https://codesandbox.io/p/devbox/sharp-carlos-3gzvk7

```ts
const arr = [21, 13, 47, 12, 45, 6, 7, 19, 23, 44];

function filter(arr: number[], predicate: (n: number) => boolean) {
  const array = [];
  for (let i = 0; i < arr.length; i++) {
    if (predicate(arr[i])) {
      array.push(arr[i]);
    }
  }
  return array;
}

const children = filter(arr, (n) => n < 19);
const odd = filter(arr, (n) => n % 2 !== 0);

console.log(odd);

function map(arr: number[], stringify: (n: number) => string): string[] {
  const array = [];
  for (const item of arr) {
    array.push(stringify(item));
  }
  return array;
}

const stringified = map(arr, (n) => `${n}`);

console.log(stringified);

// 配列と条件(pridicate)を受け取って条件にあったものを除外して返す
// ヒント: filterの逆の処理になるよね!
function reject(arr: number[], pridicate: (n: number) => boolean): number[] {
  const array: number[] = [];
  for (const item of arr) {
    if (!pridicate(item)) {
      array.push(item);
    }
  }
  return array;
}

// 配列と条件(pridicate)を受け取って条件にあった最初の要素を返す。要素がなかったらundefinedを返す
function find(
  arr: number[],
  pridicate: (n: number) => boolean
): number | undefined {
  for (const item of arr) {
    if (pridicate(item)) {
      return item;
    }
  }
  return undefined;
}

// 配列と条件(pridicate)を受け取ってすべての要素が条件にあった場合true,一つでも条件に合わない場合falseを返す
function every(arr: number[], pridicate: (n: number) => boolean): boolean {
  for (const item of arr) {
    if (!pridicate(item)) {
      return false;
    }
  }
  return true;
}

// 配列とそれぞれの要素を使って実行したい処理(callback)を受け取ってすべての要素に対してcallbackを実行する
function forEach(
  arr: number[],
  callback: (n: number, index: number, arr: number[]) => void
): void {
  for (let i = 0; i < arr.length; i++) {
    callback(arr[i], i, arr);
  }
}

console.log(
  forEach(arr, (n, index, arr) =>
    console.log(`${index}番目の人は${n}歳です。全体で${arr.length}人います。`)
  )
);
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

ジェネリクスでは、複数の型パラメータを定義することで、異なる型を同時に扱う関数やクラスを作成できます。

**基本構文**

```typescript
function functionName<T, U, V>(param1: T, param2: U): V {
  // 実装
}
```

**より実用的な例：API レスポンス処理**

```typescript
// APIレスポンスの共通構造を定義するジェネリックインターフェース
// Tは実際のデータの型を表す
interface ApiResponse<T> {
  data: T; // レスポンスデータ（型はTで決まる）
  status: number; // HTTPステータスコード
  message: string; // レスポンスメッセージ
}

// APIレスポンスを作成するジェネリック関数
// T: データの型、戻り値の型もTに基づいて決まる
function createApiResponse<T>(
  data: T,
  status: number,
  message: string
): ApiResponse<T> {
  return { data, status, message };
}

// 使用例1: ユーザー情報のレスポンス
const userResponse = createApiResponse(
  { id: 1, name: "Alice", email: "alice@example.com" }, // T = { id: number; name: string; email: string; }
  200,
  "Success"
);
// 型: ApiResponse<{ id: number; name: string; email: string; }>
// userResponse.data.name でアクセス可能（型安全）

// 使用例2: エラーレスポンス
const errorResponse = createApiResponse(
  null, // T = null
  404,
  "User not found"
);
// 型: ApiResponse<null>
// errorResponse.data は null として扱われる
```

**データ変換の実用例**

```typescript
// 2つの異なる型のデータを組み合わせて新しい型を作成する関数
// T: 最初のデータの型
// U: 2番目のデータの型
// 戻り値: TとUを組み合わせた新しいオブジェクト
function combineData<T, U>(data1: T, data2: U): T & U {
  return { ...data1, ...data2 }; // スプレッド演算子で2つのオブジェクトを結合
}

// 使用例のためのインターフェース定義
interface UserInfo {
  name: string;
  age: number;
}

interface UserSettings {
  theme: string;
  language: string;
}

// 使用例: データの結合
const userInfo: UserInfo = { name: "Alice", age: 25 };
const userSettings: UserSettings = { theme: "dark", language: "ja" };

const completeUser = combineData(userInfo, userSettings);
// 型: UserInfo & UserSettings
// 結果: { name: "Alice", age: 25, theme: "dark", language: "ja" }
// completeUser.name や completeUser.theme でアクセス可能
```

**重要なポイント**

- 型パラメータは慣例的に `T`, `U`, `V` の順で命名される
- より意味のある名前（`TKey`, `TValue`など）を使用することも可能
- 型推論により、呼び出し時に自動的に型が決定される
- 複数の型パラメータを使用することで、柔軟で型安全な関数を作成できる

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

> 💡 **学習目標**: ジェネリクスの必要性を理解し、段階的にジェネリクス構文を習得する

#### 🚀 ステップ 1: まずは普通の関数から始めよう

以下の関数を実装してください。最初はジェネリクスを使わずに、具体的な型で実装します：

```typescript
// 1. 数値配列の最後の要素を取得する関数
function getLastNumber(array: number[]): number | undefined {
  // ここに実装
}

// 2. 文字列配列の最後の要素を取得する関数
function getLastString(array: string[]): string | undefined {
  // ここに実装
}

// テスト
const numbers = [1, 2, 3, 4, 5];
const strings = ["apple", "banana", "cherry"];

console.log(getLastNumber(numbers)); // 5
console.log(getLastString(strings)); // "cherry"
```

#### 🤔 問題発見: コードの重複

上記の実装を完了したら、以下の問題に気づくはずです：

- `getLastNumber` と `getLastString` は実装がほぼ同じ
- 新しい型（boolean[]、User[]など）に対応するたびに新しい関数が必要
- コードの重複が発生している

#### 🚀 ステップ 2: ジェネリクスで解決しよう

今度は、上記の重複を解決するために、ジェネリクスを使って 1 つの関数で実装してください：

```typescript
// 3. ジェネリクスを使った汎用的な関数
// ヒント: <T> を使って型パラメータを定義する
function getLast(/* ここに型定義を追加 */) {
  // ここに実装（getLastNumberと同じロジック）
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
  { id: 2, name: "Bob" },
];

console.log(getLast(users)); // { id: 2, name: "Bob" } (User | undefined)
```

#### 🚀 ステップ 3: より多くのジェネリック関数を実装

ジェネリクスの概念を理解したら、以下の関数を実装してください：

```typescript
// 4. 配列の最初の要素を取得
function getFirst(/* 型定義を追加 */) {
  // 実装
}

// 5. 値をそのまま返すアイデンティティ関数
function identity(/* 型定義を追加 */) {
  // 実装
}

// 6. 2つの値を交換したタプルを返す
function swap(/* 型定義を追加 */) {
  // 実装
}

// 7. 配列を複製する
function clone(/* 型定義を追加 */) {
  // 実装
}
```

#### 🚀 ステップ 4: 複数の型パラメータに挑戦

```typescript
// 8. 2つの異なる型の配列を結合
function concat(/* 型定義を追加 */) {
  // 実装
}

// 9. キーと値のペアオブジェクトを作成
function createPair(/* 型定義を追加 */) {
  // 実装
}

// 10. 配列の要素を変換（map関数の簡易版）
function transform(/* 型定義を追加 */) {
  // 実装
}
```

### Section 2: ジェネリック制約の基礎

> 📚 **関連資料**: [実践コード例 - ジェネリック制約の実践](./Step05_補足_実践コード例.md#ジェネリック制約の実践) | [専門用語集 - ジェネリック制約](./Step05_補足_専門用語集.md#ジェネリック制約generic-constraints)

#### 🎯 ジェネリック制約の設計思想

**💡 なぜジェネリック制約が重要なのか**

ジェネリック制約（Generic Constraints）は、ジェネリクスの柔軟性を保ちながら、特定のプロパティやメソッドの存在を保証する仕組みです。`extends`キーワードを使用することで、型安全性を確保しつつ、より具体的な操作を可能にします。

#### 1. extends 制約による安全なプロパティアクセス

**🎯 基本概念**

extends 制約は、ジェネリクス型パラメータに対して「この型は特定の条件を満たす必要がある」という制約を課すメカニズムです。これにより、型安全性を保ちながら、特定のプロパティやメソッドへのアクセスが可能になります。

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

**🔍 より詳細な実践例**

##### 1-1. 複数プロパティを持つ制約

```typescript
interface Identifiable {
  id: string | number;
  name: string;
}

interface Timestamped {
  createdAt: Date;
  updatedAt: Date;
}

// 複数のインターフェースを組み合わせた制約
function processEntity<T extends Identifiable & Timestamped>(entity: T): T {
  console.log(`Processing ${entity.name} (ID: ${entity.id})`);
  console.log(`Created: ${entity.createdAt.toISOString()}`);

  // 元の型を保持しながら、必要なプロパティにアクセス可能
  return {
    ...entity,
    updatedAt: new Date(), // updatedAtを更新
  };
}

// 使用例
const user = {
  id: 1,
  name: "田中太郎",
  email: "tanaka@example.com", // 追加のプロパティも保持される
  createdAt: new Date("2024-01-01"),
  updatedAt: new Date("2024-01-01"),
};

const updatedUser = processEntity(user);
// updatedUserは元のuserの型（emailプロパティ含む）を保持
console.log(updatedUser.email); // OK: emailプロパティにアクセス可能
```

##### 1-2. メソッドを持つ制約

```typescript
interface Serializable {
  serialize(): string;
  deserialize(data: string): void;
}

interface Validatable {
  validate(): boolean;
  getErrors(): string[];
}

// メソッドを持つオブジェクトに対する制約
function saveToStorage<T extends Serializable & Validatable>(item: T): boolean {
  // バリデーション実行
  if (!item.validate()) {
    console.error("Validation failed:", item.getErrors());
    return false;
  }

  // シリアライズしてストレージに保存
  const serializedData = item.serialize();
  localStorage.setItem(`item_${Date.now()}`, serializedData);

  return true;
}

// 実装例
class UserProfile implements Serializable, Validatable {
  constructor(public name: string, public email: string, public age: number) {}

  serialize(): string {
    return JSON.stringify({
      name: this.name,
      email: this.email,
      age: this.age,
    });
  }

  deserialize(data: string): void {
    const parsed = JSON.parse(data);
    this.name = parsed.name;
    this.email = parsed.email;
    this.age = parsed.age;
  }

  validate(): boolean {
    return this.name.length > 0 && this.email.includes("@") && this.age >= 0;
  }

  getErrors(): string[] {
    const errors: string[] = [];
    if (this.name.length === 0) errors.push("名前は必須です");
    if (!this.email.includes("@"))
      errors.push("有効なメールアドレスを入力してください");
    if (this.age < 0) errors.push("年齢は0以上である必要があります");
    return errors;
  }
}

// 使用例
const profile = new UserProfile("山田花子", "yamada@example.com", 25);
const saved = saveToStorage(profile); // OK: 全ての制約を満たしている
```

##### 1-3. 配列操作での実践的な活用

```typescript
interface Comparable<T> {
  compareTo(other: T): number;
}

// Comparableを実装した要素の配列をソートする関数
function sortArray<T extends Comparable<T>>(items: T[]): T[] {
  return [...items].sort((a, b) => a.compareTo(b));
}

// 実装例：商品クラス
class Product implements Comparable<Product> {
  constructor(
    public name: string,
    public price: number,
    public rating: number
  ) {}

  compareTo(other: Product): number {
    // 評価順でソート（高い評価が先）
    if (this.rating !== other.rating) {
      return other.rating - this.rating;
    }
    // 評価が同じ場合は価格順（安い順）
    return this.price - other.price;
  }

  toString(): string {
    return `${this.name} (¥${this.price}, ★${this.rating})`;
  }
}

// 使用例
const products = [
  new Product("ノートPC", 80000, 4.2),
  new Product("マウス", 2000, 4.5),
  new Product("キーボード", 5000, 4.2),
  new Product("モニター", 30000, 4.8),
];

const sortedProducts = sortArray(products);
sortedProducts.forEach((product) => console.log(product.toString()));
// 出力:
// モニター (¥30000, ★4.8)
// マウス (¥2000, ★4.5)
// キーボード (¥5000, ★4.2)
// ノートPC (¥80000, ★4.2)
```

##### 1-4. 条件付き型との組み合わせ

```typescript
interface ApiResponse {
  success: boolean;
  message: string;
}

interface SuccessResponse extends ApiResponse {
  success: true;
  data: any;
}

interface ErrorResponse extends ApiResponse {
  success: false;
  error: string;
}

// 成功レスポンスのみを受け入れる関数
function processSuccessResponse<T extends SuccessResponse>(
  response: T
): T["data"] {
  console.log("処理成功:", response.message);
  return response.data;
}

// 使用例
const successResponse = {
  success: true as const, // const assertionで型を固定
  message: "データ取得成功",
  data: { users: ["田中", "佐藤", "鈴木"] },
  timestamp: new Date(),
};

const data = processSuccessResponse(successResponse);
console.log(data.users); // OK: dataの型が推論される

// エラーレスポンスは受け入れられない
const errorResponse = {
  success: false as const,
  message: "エラーが発生しました",
  error: "ネットワークエラー",
};

// processSuccessResponse(errorResponse); // Error: 制約を満たさない
```

**📝 設計の詳細解説**

- **型安全性の確保**: `extends`制約により、特定のプロパティやメソッドの存在を保証
- **柔軟性の維持**: 制約を満たす限り、任意の型を受け入れ可能
- **IntelliSense の向上**: IDE が制約されたプロパティを認識し、自動補完が効く
- **実行時エラーの防止**: コンパイル時に型チェックが行われ、実行時エラーを防ぐ
- **コードの再利用性**: 同じ制約を満たす異なる型に対して同じ関数を使用可能

#### 2. keyof 制約

> 💡 **詳細解説**: keyof 演算子の詳細と実践的な活用パターンは [Step05*補足*専門用語集.md#keyof 演算子 keyof-operator](./Step05_補足_専門用語集.md#keyof演算子keyof-operator) を見てね 🐰

**keyof 制約**は、オブジェクトのプロパティキーのみを受け入れるジェネリック制約です。これにより、存在しないプロパティへのアクセスを**コンパイル時**に防ぐことができます。

```typescript
// K extends keyof T: KはTのプロパティキーのいずれかでなければならない
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key]; // T[K]は該当プロパティの正確な型を返す
}

interface Person {
  name: string;
  age: number;
  email: string;
}

const person: Person = { name: "Alice", age: 30, email: "alice@example.com" };

// ✅ 正常なケース - 型安全性が保証される
const name = getProperty(person, "name"); // string型として推論
const age = getProperty(person, "age"); // number型として推論
const email = getProperty(person, "email"); // string型として推論

// ❌ エラーケース - 存在しないプロパティ
// const invalid = getProperty(person, "invalid");
// Error: Argument of type '"invalid"' is not assignable to parameter of type 'keyof Person'
```

**🔍 keyof 制約の仕組み**

```typescript
// keyof Personは "name" | "age" | "email" のユニオン型になる
type PersonKeys = keyof Person; // "name" | "age" | "email"

// 段階的に理解してみよう
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  // 1. T = Person の場合
  // 2. keyof T = "name" | "age" | "email"
  // 3. K extends keyof T = K は "name" | "age" | "email" のいずれか
  // 4. T[K] = Person["name"] | Person["age"] | Person["email"]
  //         = string | number | string
  return obj[key];
}
```

**🎯 実務での活用例**

```typescript
// 1. 動的プロパティアクセス（フォーム処理など）
function updateField<T, K extends keyof T>(obj: T, field: K, value: T[K]): T {
  return { ...obj, [field]: value };
}

// 2. オブジェクトの特定プロパティを抽出
function pick<T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  const result = {} as Pick<T, K>;
  keys.forEach((key) => {
    result[key] = obj[key];
  });
  return result;
}

// 使用例
const userProfile = {
  id: 1,
  name: "Alice",
  email: "alice@example.com",
  age: 30,
};
const publicInfo = pick(userProfile, ["name", "email"]); // { name: string, email: string }
```

**⚡ keyof 制約の利点**

- **型安全性**: 存在しないプロパティへのアクセスを防止
- **IntelliSense**: IDE で利用可能なプロパティが自動補完される
- **リファクタリング安全性**: プロパティ名変更時に関連箇所も自動更新
- **実行時エラー防止**: `undefined`の意図しない取得を防ぐ

### 練習問題 1.2: ジェネリック制約の総合復習 🔰

**Section 2 で学んだ内容を包括的に復習しましょう！**

以下の要件を満たすジェネリック関数を**ゼロから**実装してください。**型定義から関数の実装まで、すべて自分で考えて書いてください。**

```typescript
// 🎯 問題1: extends制約の実装
// 要件: lengthプロパティを持つ型のみを受け入れ、長さを返す関数を作成
// ヒント: string, Array, { length: number } などが対象
function getLength() {
  // 実装してください
}

// 🎯 問題2: インターフェース制約の実装
// 要件: idプロパティ（string または number）を持つオブジェクトのみを受け入れ、IDを返す関数
// まず必要なインターフェースを定義し、それを使った制約を実装してください
interface Id {
  // 定義してください
}
function getId() {
  // 実装してください
}

// 🎯 問題3: keyof制約の実装
// 要件: オブジェクトから指定されたプロパティの値を安全に取得する関数
// 存在しないプロパティを指定した場合はコンパイルエラーになるようにしてください
function getProperty() {
  // 実装してください
}

// 🎯 問題4: 複数プロパティの抽出
// 要件: オブジェクトから複数のプロパティを取得して新しいオブジェクトを返す関数
// TypeScriptの組み込み型 Pick<T, K> を戻り値の型として使用してください
function pick() {
  // 実装してください
}

// 🎯 問題5: 複合制約の実装
// 要件: nameプロパティを持つオブジェクトから、指定されたプロパティを更新する関数
// extends制約とkeyof制約を組み合わせて実装してください
interface ??? {
  // 定義してください
}
function updateProperty(???) {
  // 実装してください
}
```

**📝 テストケース - 実装後に以下がすべて正常に動作することを確認してください**

```typescript
// 問題1のテスト
console.log(getLength("hello")); // 5
console.log(getLength([1, 2, 3])); // 3
console.log(getLength({ length: 10 })); // 10
// getLength(123); // ❌ コンパイルエラーになるはず

// 問題2のテスト
const user1 = { id: "user123", name: "Alice" };
const product = { id: 1, title: "Book", price: 1000 };
console.log(getId(user1)); // "user123"
console.log(getId(product)); // 1
// getId({ title: "Book" }); // ❌ コンパイルエラーになるはず

// 問題3のテスト
const person = { name: "Bob", age: 25, city: "Tokyo" };
console.log(getProperty(person, "name")); // "Bob"
console.log(getProperty(person, "age")); // 25
// getProperty(person, "invalid"); // ❌ コンパイルエラーになるはず

// 問題4のテスト
const user2 = {
  name: "Charlie",
  age: 30,
  email: "charlie@example.com",
  role: "admin",
};
const picked = pick(user2, ["name", "email"]);
console.log(picked); // { name: "Charlie", email: "charlie@example.com" }
// pick(user2, ["name", "invalid"]); // ❌ コンパイルエラーになるはず

// 問題5のテスト
const employee = { name: "David", department: "Engineering", salary: 80000 };
const updated = updateProperty(employee, "salary", 85000);
console.log(updated); // { name: "David", department: "Engineering", salary: 85000 }
// updateProperty({ age: 30 }, "age", 31); // ❌ コンパイルエラーになるはず
```

---

## 🎯 練習問題

> 📚 **サポート資料**: [実践コード例 - ジェネリクスの練習](./Step05_補足_実践コード例.md#ジェネリクスの練習) | [トラブルシューティング](./Step05_補足_トラブルシューティング.md#ジェネリクス関連エラー)

### 練習問題 1: 配列ユーティリティ関数（10 分）

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

### 練習問題 2: 型安全なプロパティアクセス（10 分）

以下の要件を満たす関数を実装してください：

```typescript
// オブジェクトのプロパティを安全に更新する関数
function updateProperty<T, K extends keyof T>(obj: T, key: K, value: T[K]): T {
  // 実装してください
  // ヒント: スプレッド演算子を使用して新しいオブジェクトを返す
}

// ネストしたプロパティの値を取得する関数
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

**Q: ジェネリクスと any 型の違いは何ですか？**
A: ジェネリクスは型安全性を保ちながら柔軟性を提供しますが、any 型は型チェックを完全に無効にします。ジェネリクスを使用することで、コンパイル時に型エラーを検出でき、より安全なコードが書けます。

**Q: いつジェネリック制約を使うべきですか？**
A: 特定のプロパティやメソッドにアクセスする必要がある場合に使用します。制約なしでは、型パラメータ T に対して何も仮定できないため、プロパティアクセスでエラーになります。

**Q: 型推論はいつ働きますか？**
A: 関数の引数から型が明確に推論できる場合に働きます。明示的な型指定と型推論のバランスを考えて使い分けましょう。

---

**📌 重要**: Session1 はジェネリクスの基礎固めです。焦らず確実に基本概念を理解しましょう。

**🌟 次回（Session2）は、より実践的なジェネリッククラスの設計と実用的な活用に挑戦します！**
