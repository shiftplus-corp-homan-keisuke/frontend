# Step05 成果物：簡単なジェネリクス学習システム

---

## 📝 システム概要

### 🔧 基本的なジェネリクス学習システム

**目的**: Step05で学習したジェネリクスの基礎を、初学者にとって理解しやすい形で段階的に実装する

**主要機能**:
1. 基本的なジェネリック関数（身近な例）
2. 簡単なジェネリック制約
3. シンプルなジェネリッククラス
4. 実用的だが理解しやすい統合例

**使用するジェネリクス技術**:
- 基本ジェネリック関数: `<T>` を使った型安全な関数
- ジェネリック制約: `extends` キーワードによる型制限
- ジェネリッククラス: 再利用可能なクラス設計
- 型推論: TypeScriptの自動型推論の活用

---

## 🚀 段階的実装手順

### Phase 1: 基本ジェネリック関数 🔰

#### ステップ1-1: 身近な例でのジェネリック関数

```typescript
// generic-basics.ts

// 最も基本的なジェネリック関数
// 値をそのまま返すidentity関数
function identity<T>(value: T): T {
  return value;
}

// 配列の最初の要素を安全に取得
function first<T>(array: T[]): T | undefined {
  return array.length > 0 ? array[0] : undefined;
}

// 配列の最後の要素を安全に取得
function last<T>(array: T[]): T | undefined {
  return array.length > 0 ? array[array.length - 1] : undefined;
}

// 2つの値をペアにする関数
function makePair<T, U>(first: T, second: U): [T, U] {
  return [first, second];
}

// 基本的な配列フィルタリング
function simpleFilter<T>(array: T[], predicate: (item: T) => boolean): T[] {
  const result: T[] = [];
  for (const item of array) {
    if (predicate(item)) {
      result.push(item);
    }
  }
  return result;
}

// 基本的な配列マッピング
function simpleMap<T, U>(array: T[], transform: (item: T) => U): U[] {
  const result: U[] = [];
  for (const item of array) {
    result.push(transform(item));
  }
  return result;
}

// 使用例とテスト
console.log("=== Phase 1: 基本ジェネリック関数のテスト ===");

// identity関数のテスト
const numberValue = identity(42);        // number型
const stringValue = identity("hello");   // string型
const booleanValue = identity(true);     // boolean型

console.log("Identity関数:");
console.log(`数値: ${numberValue}`);
console.log(`文字列: ${stringValue}`);
console.log(`真偽値: ${booleanValue}`);

// 配列操作のテスト
const numbers = [1, 2, 3, 4, 5];
const names = ["Alice", "Bob", "Charlie"];

console.log("\n配列操作:");
console.log(`数値配列の最初: ${first(numbers)}`);      // 1
console.log(`数値配列の最後: ${last(numbers)}`);       // 5
console.log(`名前配列の最初: ${first(names)}`);        // "Alice"
console.log(`名前配列の最後: ${last(names)}`);         // "Charlie"

// 空配列のテスト
const emptyNumbers: number[] = [];
console.log(`空配列の最初: ${first(emptyNumbers)}`);   // undefined

// ペア作成のテスト
const numberStringPair = makePair(123, "test");
const booleanNumberPair = makePair(true, 456);

console.log("\nペア作成:");
console.log("数値と文字列のペア:", numberStringPair);
console.log("真偽値と数値のペア:", booleanNumberPair);

// フィルタリングとマッピングのテスト
const evenNumbers = simpleFilter(numbers, (n) => n % 2 === 0);
const doubledNumbers = simpleMap(numbers, (n) => n * 2);
const nameLengths = simpleMap(names, (name) => name.length);

console.log("\nフィルタリングとマッピング:");
console.log("偶数のみ:", evenNumbers);
console.log("2倍した数値:", doubledNumbers);
console.log("名前の長さ:", nameLengths);
```

### Phase 2: 簡単なジェネリック制約 🔶

#### ステップ2-1: extends制約の基本

```typescript
// generic-constraints.ts

// length プロパティを持つ値の長さを取得
function getLength<T extends { length: number }>(item: T): number {
  return item.length;
}

// name プロパティを持つオブジェクトの情報を表示
function printInfo<T extends { name: string }>(item: T): string {
  return `名前: ${item.name}`;
}

// id プロパティを持つオブジェクトのIDを取得
function getId<T extends { id: number | string }>(item: T): number | string {
  return item.id;
}

// keyof制約を使った安全なプロパティアクセス
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

// オブジェクトのプロパティを安全に更新
function updateProperty<T, K extends keyof T>(
  obj: T, 
  key: K, 
  value: T[K]
): T {
  return {
    ...obj,
    [key]: value
  };
}

// 複数のプロパティを持つオブジェクトの情報を取得
function getObjectInfo<T extends { name: string; age: number }>(
  person: T
): string {
  return `${person.name}さんは${person.age}歳です`;
}

// 使用例とテスト
console.log("=== Phase 2: ジェネリック制約のテスト ===");

// length制約のテスト
console.log("Length制約:");
console.log(`文字列の長さ: ${getLength("hello")}`);        // 5
console.log(`配列の長さ: ${getLength([1, 2, 3])}`);        // 3
console.log(`配列の長さ: ${getLength(["a", "b"])}`);       // 2

// 以下はエラーになる（コメントアウト）
// console.log(getLength(123)); // Error: number doesn't have length

// name制約のテスト
const user = { name: "田中太郎", age: 30 };
const product = { name: "商品A", price: 1000 };

console.log("\nName制約:");
console.log(printInfo(user));     // "名前: 田中太郎"
console.log(printInfo(product));  // "名前: 商品A"

// id制約のテスト
const userWithId = { id: 1, name: "佐藤花子" };
const productWithStringId = { id: "PROD-001", name: "商品B" };

console.log("\nID制約:");
console.log(`ユーザーID: ${getId(userWithId)}`);           // 1
console.log(`商品ID: ${getId(productWithStringId)}`);      // "PROD-001"

// keyof制約のテスト
interface Person {
  name: string;
  age: number;
  email: string;
}

const person: Person = {
  name: "山田次郎",
  age: 25,
  email: "yamada@example.com"
};

console.log("\nKeyof制約:");
console.log(`名前: ${getProperty(person, "name")}`);       // "山田次郎"
console.log(`年齢: ${getProperty(person, "age")}`);        // 25
console.log(`メール: ${getProperty(person, "email")}`);    // "yamada@example.com"

// 以下はエラーになる（コメントアウト）
// console.log(getProperty(person, "invalid")); // Error: invalid property

// プロパティ更新のテスト
const updatedPerson = updateProperty(person, "age", 26);
console.log("\nプロパティ更新:");
console.log("更新前の年齢:", person.age);        // 25
console.log("更新後の年齢:", updatedPerson.age); // 26

// 複合制約のテスト
const student = { name: "鈴木一郎", age: 20, grade: "A" };
console.log("\n複合制約:");
console.log(getObjectInfo(student)); // "鈴木一郎さんは20歳です"
```

### Phase 3: シンプルなジェネリッククラス 🔥

#### ステップ3-1: 基本的なジェネリッククラス

```typescript
// generic-classes.ts

// 値を包むシンプルなBoxクラス
class Box<T> {
  private value: T;

  constructor(value: T) {
    this.value = value;
  }

  // 値を取得
  getValue(): T {
    return this.value;
  }

  // 値を設定
  setValue(newValue: T): void {
    this.value = newValue;
  }

  // 値を変換して新しいBoxを作成
  map<U>(transform: (value: T) => U): Box<U> {
    return new Box(transform(this.value));
  }

  // 値の情報を文字列で取得
  toString(): string {
    return `Box(${this.value})`;
  }
}

// 2つの値を持つPairクラス
class Pair<T, U> {
  constructor(
    private first: T,
    private second: U
  ) {}

  // 最初の値を取得
  getFirst(): T {
    return this.first;
  }

  // 2番目の値を取得
  getSecond(): U {
    return this.second;
  }

  // 値を入れ替えた新しいPairを作成
  swap(): Pair<U, T> {
    return new Pair(this.second, this.first);
  }

  // 両方の値を変換
  map<V, W>(
    firstTransform: (value: T) => V,
    secondTransform: (value: U) => W
  ): Pair<V, W> {
    return new Pair(
      firstTransform(this.first),
      secondTransform(this.second)
    );
  }

  // 文字列表現
  toString(): string {
    return `Pair(${this.first}, ${this.second})`;
  }
}

// 配列のラッパークラス
class SimpleList<T> {
  private items: T[] = [];

  // アイテムを追加
  add(item: T): void {
    this.items.push(item);
  }

  // インデックスでアイテムを取得
  get(index: number): T | undefined {
    return this.items[index];
  }

  // 最初のアイテムを取得
  first(): T | undefined {
    return this.items[0];
  }

  // 最後のアイテムを取得
  last(): T | undefined {
    return this.items[this.items.length - 1];
  }

  // リストの長さを取得
  size(): number {
    return this.items.length;
  }

  // 条件に合うアイテムを検索
  find(predicate: (item: T) => boolean): T | undefined {
    return this.items.find(predicate);
  }

  // 条件に合うアイテムをすべて取得
  filter(predicate: (item: T) => boolean): T[] {
    return this.items.filter(predicate);
  }

  // すべてのアイテムを変換
  map<U>(transform: (item: T) => U): U[] {
    return this.items.map(transform);
  }

  // 配列として取得
  toArray(): T[] {
    return [...this.items];
  }

  // 文字列表現
  toString(): string {
    return `SimpleList[${this.items.join(", ")}]`;
  }
}

// 使用例とテスト
console.log("=== Phase 3: ジェネリッククラスのテスト ===");

// Boxクラスのテスト
console.log("Boxクラス:");
const numberBox = new Box(42);
const stringBox = new Box("hello");

console.log(`数値Box: ${numberBox.toString()}`);
console.log(`文字列Box: ${stringBox.toString()}`);

// 値の変更
numberBox.setValue(100);
console.log(`変更後の数値Box: ${numberBox.toString()}`);

// map操作
const doubledBox = numberBox.map(n => n * 2);
const upperBox = stringBox.map(s => s.toUpperCase());

console.log(`2倍したBox: ${doubledBox.toString()}`);
console.log(`大文字のBox: ${upperBox.toString()}`);

// Pairクラスのテスト
console.log("\nPairクラス:");
const namePair = new Pair("太郎", "花子");
const numberPair = new Pair(10, 20);

console.log(`名前のペア: ${namePair.toString()}`);
console.log(`数値のペア: ${numberPair.toString()}`);

// swap操作
const swappedNames = namePair.swap();
console.log(`入れ替え後: ${swappedNames.toString()}`);

// map操作
const transformedPair = numberPair.map(
  n => n * 2,      // 最初の値を2倍
  n => n.toString() // 2番目の値を文字列に
);
console.log(`変換後のペア: ${transformedPair.toString()}`);

// SimpleListクラスのテスト
console.log("\nSimpleListクラス:");
const numberList = new SimpleList<number>();
const nameList = new SimpleList<string>();

// 数値リストに追加
numberList.add(1);
numberList.add(2);
numberList.add(3);
numberList.add(4);
numberList.add(5);

console.log(`数値リスト: ${numberList.toString()}`);
console.log(`サイズ: ${numberList.size()}`);
console.log(`最初の要素: ${numberList.first()}`);
console.log(`最後の要素: ${numberList.last()}`);

// 名前リストに追加
nameList.add("Alice");
nameList.add("Bob");
nameList.add("Charlie");

console.log(`名前リスト: ${nameList.toString()}`);

// 検索とフィルタリング
const foundNumber = numberList.find(n => n > 3);
const evenNumbers = numberList.filter(n => n % 2 === 0);
const doubledNumbers = numberList.map(n => n * 2);

console.log(`3より大きい最初の数: ${foundNumber}`);
console.log(`偶数のみ: [${evenNumbers.join(", ")}]`);
console.log(`2倍した数値: [${doubledNumbers.join(", ")}]`);

// 名前の長さを取得
const nameLengths = nameList.map(name => name.length);
console.log(`名前の長さ: [${nameLengths.join(", ")}]`);
```

### Phase 4: 統合デモンストレーション 🌟

#### ステップ4-1: 全機能を統合した実用例

```typescript
// integrated-demo.ts

// ユーザー情報の型定義
interface User {
  id: number;
  name: string;
  email: string;
  age: number;
}

// 商品情報の型定義
interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
}

// データ管理クラス（統合例）
class DataManager<T extends { id: number | string }> {
  private items: SimpleList<T> = new SimpleList<T>();

  // アイテムを追加
  addItem(item: T): void {
    this.items.add(item);
  }

  // IDでアイテムを検索
  findById(id: number | string): T | undefined {
    return this.items.find(item => item.id === id);
  }

  // 条件でアイテムを検索
  findBy<K extends keyof T>(key: K, value: T[K]): T[] {
    return this.items.filter(item => item[key] === value);
  }

  // すべてのアイテムを取得
  getAllItems(): T[] {
    return this.items.toArray();
  }

  // アイテム数を取得
  getCount(): number {
    return this.items.size();
  }

  // 特定のプロパティの値を一覧取得
  getPropertyValues<K extends keyof T>(key: K): T[K][] {
    return this.items.map(item => item[key]);
  }
}

// 統合デモの実行
function runIntegratedDemo(): void {
  console.log("=== Phase 4: 統合デモンストレーション ===");

  // ユーザー管理システム
  const userManager = new DataManager<User>();
  
  // ユーザーデータの追加
  userManager.addItem({ id: 1, name: "田中太郎", email: "tanaka@example.com", age: 30 });
  userManager.addItem({ id: 2, name: "佐藤花子", email: "sato@example.com", age: 25 });
  userManager.addItem({ id: 3, name: "山田次郎", email: "yamada@example.com", age: 35 });

  console.log("ユーザー管理システム:");
  console.log(`総ユーザー数: ${userManager.getCount()}`);

  // IDで検索
  const user = userManager.findById(2);
  console.log(`ID 2のユーザー:`, user);

  // 年齢で検索
  const youngUsers = userManager.findBy("age", 25);
  console.log(`25歳のユーザー:`, youngUsers);

  // すべての名前を取得
  const allNames = userManager.getPropertyValues("name");
  console.log(`すべてのユーザー名: [${allNames.join(", ")}]`);

  // 商品管理システム
  const productManager = new DataManager<Product>();

  // 商品データの追加
  productManager.addItem({ id: "P001", name: "ノートPC", price: 80000, category: "電子機器" });
  productManager.addItem({ id: "P002", name: "マウス", price: 2000, category: "電子機器" });
  productManager.addItem({ id: "P003", name: "本", price: 1500, category: "書籍" });

  console.log("\n商品管理システム:");
  console.log(`総商品数: ${productManager.getCount()}`);

  // カテゴリで検索
  const electronics = productManager.findBy("category", "電子機器");
  console.log(`電子機器カテゴリの商品:`, electronics);

  // すべての価格を取得
  const allPrices = productManager.getPropertyValues("price");
  console.log(`すべての商品価格: [${allPrices.join(", ")}]`);

  // Boxを使った値の変換例
  console.log("\nBoxを使った価格計算:");
  const priceBox = new Box(80000);
  const taxIncludedBox = priceBox.map(price => Math.floor(price * 1.1));
  const formattedPriceBox = taxIncludedBox.map(price => `¥${price.toLocaleString()}`);
  
  console.log(`元の価格: ${priceBox.getValue()}`);
  console.log(`税込価格: ${taxIncludedBox.getValue()}`);
  console.log(`フォーマット済み: ${formattedPriceBox.getValue()}`);

  // Pairを使った関連データの管理
  console.log("\nPairを使った関連データ:");
  const userProductPair = new Pair(user, productManager.findById("P001"));
  console.log(`ユーザーと商品のペア:`, userProductPair.toString());

  // 型安全な操作の例
  console.log("\n型安全な操作の例:");
  
  // ジェネリック関数を使った安全な操作
  const userEmails = simpleMap(userManager.getAllItems(), user => user.email);
  console.log(`ユーザーのメールアドレス: [${userEmails.join(", ")}]`);

  const expensiveProducts = simpleFilter(
    productManager.getAllItems(), 
    product => product.price > 5000
  );
  console.log(`高額商品:`, expensiveProducts.map(p => p.name));

  // 制約を使った安全なプロパティアクセス
  const firstUser = first(userManager.getAllItems());
  if (firstUser) {
    console.log(`最初のユーザーの名前: ${getProperty(firstUser, "name")}`);
    console.log(`最初のユーザーの年齢: ${getProperty(firstUser, "age")}`);
  }
}

// デモの実行
runIntegratedDemo();
```

---

## 🎓 学習のヒント

### 💡 実装時のポイント

1. **ジェネリックの基本理解**: `<T>` は「型のプレースホルダー」として機能
2. **型推論の活用**: 明示的な型指定なしでも TypeScript が適切な型を推論
3. **制約の適切な使用**: `extends` で型の条件を指定し、安全性を確保
4. **再利用性の重視**: 同じロジックを異なる型で使い回せる設計
5. **段階的な学習**: 簡単な例から始めて徐々に複雑な例へ

### ⚠️ よくある間違い

- ジェネリック型パラメータの命名が不適切（`T`, `U`, `K` などの慣例を守る）
- 制約なしで存在しないプロパティにアクセスしようとする
- 型推論に頼りすぎて、明示的な型指定が必要な場面を見逃す
- ジェネリッククラスのインスタンス化時に型を指定し忘れる
- 複雑すぎるジェネリック設計で可読性を損なう

### 🚀 発展課題（任意）

余裕がある場合は以下にも挑戦してみてください：

- より複雑な制約の組み合わせ（`T extends U & V`）
- 条件付き型の基礎（`T extends string ? number : boolean`）
- ユーティリティ型との組み合わせ（`Partial<T>`, `Pick<T, K>`）
- 実際のライブラリ（lodash、Reactなど）でのジェネリクス活用例の調査
- 自分だけのジェネリックユーティリティライブラリの作成

---

**📌 重要**: この成果物はStep05の学習内容の総まとめです。ジェネリクスの基礎から実用的な活用まで、TypeScriptの型システムを段階的に理解しながら実装しましょう。

**🌟 次のステップ**: Step06では、ユーティリティ型を使った高度な型操作について学習します！