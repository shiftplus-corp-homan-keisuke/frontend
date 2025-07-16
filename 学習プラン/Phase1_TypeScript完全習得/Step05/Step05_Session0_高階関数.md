# Session0: 高階関数基礎（90 分）

> 💡 **対象**: Step01-04 完了者（基本型・インターフェース・ユニオン型・型ガード習得済み）
> 🎯 **形式**: 講師サポート付き学習
> ⏰ **時間**: 90 分（休憩含む）

## 📚 関連補足資料

このセッションの学習をサポートする補足資料をご用意しています：

- 📖 **[専門用語集](./Step05_補足_専門用語集.md)** - 高階関数・関数型プログラミングの重要な概念と用語の詳細解説
- 💻 **[実践コード例](./Step05_補足_実践コード例.md)** - 段階的な学習のためのコード例集
- 🔧 **[開発環境ガイド](./Step05_補足_開発環境ガイド.md)** - 効率的な開発環境の活用
- 🌐 **[参考リソース](./Step05_補足_参考リソース.md)** - 学習に役立つリンク集とリソース
- 🚨 **[トラブルシューティング](./Step05_補足_トラブルシューティング.md)** - よくあるエラーと解決方法

> 💡 **活用方法**: 学習中に疑問が生じた際や、より深く理解したい場合に参照してね 🐰

## 📅 セッション概要

**学習目標**:

- [ ] **高階関数の定義と基本概念の完全理解**
- [ ] **配列メソッド（map、filter）が高階関数である理由の理解**
- [ ] **コールバック関数の実践的活用方法の習得**
- [ ] **カリー化の基本概念と実装パターンの理解**
- [ ] **高階関数を使った実践的なコード作成能力の獲得**

**前提知識**:

- Step01-04 の内容（基本型、インターフェース、ユニオン型、型ガード）
- 関数・クラスの基本的な実装経験
- TypeScript の型システムの基礎理解

---

## ⏰ 詳細タイムテーブル

| 時間         | 内容                        | 講師の役割           | 学習者の活動   | 成果物     |
| ------------ | --------------------------- | -------------------- | -------------- | ---------- |
| **0-10 分**  | 全体概要・目標設定          | 説明・質疑応答       | 聞く・質問     | 理解確認   |
| **10-25 分** | 高階関数の定義と基本概念    | 要点解説・図解説明   | 個人学習・確認 | 知識整理   |
| **25-40 分** | 配列メソッド（map、filter） | 実演・個別サポート   | ハンズオン     | 基本コード |
| **40-55 分** | コールバック関数の実践      | 実演・個別サポート   | ハンズオン     | 応用コード |
| **55-70 分** | カリー化の基本理解          | 実演・個別サポート   | ハンズオン     | 応用コード |
| **70-85 分** | 練習問題 1-2                | 巡回サポート・ヒント | 個人作業       | 練習成果   |
| **85-90 分** | 振り返り・次回予告          | まとめ・予告         | 質問・確認     | 学習計画   |

---

## 📚 学習内容

### Section 1: 高階関数の定義と基本概念

> 📚 **関連資料**: [専門用語集 - 高階関数関連用語](./Step05_補足_専門用語集.md#高階関数higher-order-function) | [実践コード例 - 高階関数の基礎](./Step05_補足_実践コード例.md#高階関数の基礎)

#### 🎯 高階関数とは何か？

**💡 まず最初に理解すべきこと**

高階関数という名前は難しそうですが、実は普段使っている配列の`map`や`filter`も高階関数です。つまりすでに高階関数を使っています！

**🍎 身近な例で理解しよう**

まず、問題から始めましょう：

```typescript
// 毎回同じような処理を書いている...
function processNumber1(x: number): number {
  console.log(`数字${x}を処理中...`);
  return x * 2;
}

function processNumber2(x: number): number {
  console.log(`数字${x}を処理中...`);
  return x + 10;
}

function processNumber3(x: number): number {
  console.log(`数字${x}を処理中...`);
  return x * x;
}

// 処理の種類が増えるたびに同じようなコードを書く...😅
```

**🔧 高階関数の登場**

高階関数とは、簡単に言うと「**関数を受け取る関数**」または「**関数を返す関数**」のことです。

```typescript
// 高階関数：関数を受け取って数字を処理する
function processNumber(x: number, operation: (num: number) => number): number {
  console.log(`数字${x}を処理中...`);
  return operation(x);
}

// 使い方
console.log(processNumber(5, (x) => x * 2)); // 10
console.log(processNumber(5, (x) => x + 10)); // 15
console.log(processNumber(5, (x) => x * x)); // 25
```

#### 1. パターン 1：関数を引数として受け取る高階関数（詳細解説）

**🎯 上の例をもう少し詳しく**

さっき使った`processNumber`を詳しく見てみましょう：

```typescript
// この関数は「関数を引数として受け取る」高階関数
function processNumber(
  number: number,
  operation: (x: number) => number // ← ここで関数を受け取る
): number {
  console.log(`数字${number}を処理中...`);
  return operation(number); // ← 受け取った関数を実行
}

// 色々な処理方法を定義
const addFive = (x: number) => x + 5;
const square = (x: number) => x * x;
const negate = (x: number) => -x;

// 同じ高階関数で色々な処理を実行
console.log(processNumber(10, addFive)); // 15
console.log(processNumber(10, square)); // 100
console.log(processNumber(10, negate)); // -10
```

**🍕 レストランの例で理解しよう**

レストランで異なる調理方法を指定する例を見てみましょう：

```typescript
// レストランの高階関数
function cookFood(
  ingredient: string,
  cookingMethod: (food: string) => string
): string {
  console.log(`${ingredient}を調理します`);
  return cookingMethod(ingredient);
}

// 色々な調理方法
const grill = (food: string) => `${food}をグリルで焼きました`;
const steam = (food: string) => `${food}を蒸しました`;
const fry = (food: string) => `${food}を揚げました`;

// 使い方
console.log(cookFood("チキン", grill)); // "チキンをグリルで焼きました"
console.log(cookFood("野菜", steam)); // "野菜を蒸しました"
console.log(cookFood("エビ", fry)); // "エビを揚げました"
```

**🔢 配列でも使える**

```typescript
// 配列を処理する高階関数
function processArray(
  numbers: number[],
  processor: (x: number) => number
): number[] {
  const result: number[] = [];
  for (const num of numbers) {
    result.push(processor(num));
  }
  return result;
}

// 使い方
const numbers = [1, 2, 3, 4, 5];
console.log(processArray(numbers, (x) => x * 2)); // [2, 4, 6, 8, 10]
console.log(processArray(numbers, (x) => x + 5)); // [6, 7, 8, 9, 10]
console.log(processArray(numbers, (x) => x * x)); // [1, 4, 9, 16, 25]
```

#### 2. パターン 2：関数を戻り値として返す高階関数

**🏭 関数を作る工場**

今度は「関数を返す」高階関数を見てみましょう：

```typescript
// 高階関数：倍数を作る工場
function createMultiplier(factor: number): (x: number) => number {
  return (x: number) => x * factor; // ← 関数を返す
}

// 色々な倍数の関数を作る
const double = createMultiplier(2);
const triple = createMultiplier(3);
const tenTimes = createMultiplier(10);

// 作った関数を使う
console.log(double(5)); // 10
console.log(triple(4)); // 12
console.log(tenTimes(3)); // 30

// 配列にも使える
const numbers = [1, 2, 3, 4, 5];
console.log(numbers.map(double)); // [2, 4, 6, 8, 10]
console.log(numbers.map(triple)); // [3, 6, 9, 12, 15]
```

**💡 何が便利なの？**

似たような関数をいちいち作らなくて良くなります！

```typescript
// 従来の方法（面倒）
function double(x: number): number {
  return x * 2;
}
function triple(x: number): number {
  return x * 3;
}
function quadruple(x: number): number {
  return x * 4;
}

// 高階関数を使った方法（簡単）
const double = createMultiplier(2);
const triple = createMultiplier(3);
const quadruple = createMultiplier(4);
```

**🔍 文字列の例**

```typescript
// 挨拶を作る工場
function createGreeting(greeting: string): (name: string) => string {
  return (name: string) => `${greeting}、${name}さん！`;
}

// 色々な挨拶の道具を作る
const sayHello = createGreeting("こんにちは");
const sayGoodMorning = createGreeting("おはよう");

// 使い方
console.log(sayHello("田中")); // "こんにちは、田中さん！"
console.log(sayGoodMorning("佐藤")); // "おはよう、佐藤さん！"
```

#### 🎯 高階関数の重要なポイント

1. **再利用性**: 同じ処理の枠組みを異なる内容で使い回せる
2. **抽象化**: 具体的な処理内容を後から指定できる
3. **柔軟性**: 処理をカスタマイズ可能にできる
4. **型安全性**: TypeScript の型システムで安全に設計できる

---

### Section 2: 配列メソッド（map、filter）- 高階関数の実用例

> 📚 **関連資料**: [実践コード例 - 配列メソッドの活用](./Step05_補足_実践コード例.md#配列メソッドの活用)

#### 🎯 実は知ってる！普段使う高階関数

**💡 重要な発見**

普段よく使う`map`と`filter`は、実は高階関数です！

```typescript
const numbers = [1, 2, 3, 4, 5];

// mapは関数を受け取る高階関数
const doubled = numbers.map((x) => x * 2);
console.log(doubled); // [2, 4, 6, 8, 10]

// filterも関数を受け取る高階関数
const evens = numbers.filter((x) => x % 2 === 0);
console.log(evens); // [2, 4]
```

#### 1. map - 全部を変換する

**🎯 map の仕組み**

map は配列の**全部の要素**を、**同じ方法**で変換します。

```typescript
// 基本的な使い方
const numbers = [1, 2, 3, 4, 5];

// 全部を2倍に
const doubled = numbers.map((num) => num * 2);
console.log(doubled); // [2, 4, 6, 8, 10]

// 全部に10を足す
const addTen = numbers.map((num) => num + 10);
console.log(addTen); // [11, 12, 13, 14, 15]

// 全部を文字列に
const strings = numbers.map((num) => `数字: ${num}`);
console.log(strings); // ["数字: 1", "数字: 2", "数字: 3", "数字: 4", "数字: 5"]
```

**💡 高階関数を理解するためにmap関数を作ってみよ🐰**

map の中身を自分で作ると、こんな感じになります：

```typescript
// mapの中身（簡単版）
function myMap(array: number[], transform: (x: number) => number): number[] {
  const result: number[] = [];
  for (const item of array) {
    result.push(transform(item)); // ← 関数を使う
  }
  return result;
}

// 使い方
const numbers = [1, 2, 3];
const doubled = myMap(numbers, (x) => x * 2);
console.log(doubled); // [2, 4, 6]
```

**🔍 実用的な例**

```typescript
// 商品データ
const products = [
  { name: "りんご", price: 100 },
  { name: "バナナ", price: 80 },
  { name: "みかん", price: 120 },
];

// 値段だけを取り出す
const prices = products.map((product) => product.price);
console.log(prices); // [100, 80, 120]

// 表示用のテキストを作る
const displayTexts = products.map(
  (product) => `${product.name}: ${product.price}円`
);
console.log(displayTexts); // ["りんご: 100円", "バナナ: 80円", "みかん: 120円"]
```

#### 2. filter - 条件に合うものだけを残す

**🎯 filter の仕組み**

filter は配列から**条件に合うもの**だけを取り出します。

```typescript
// 基本的な使い方
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// 偶数だけを取り出す
const evens = numbers.filter((num) => num % 2 === 0);
console.log(evens); // [2, 4, 6, 8, 10]

// 5より大きい数だけを取り出す
const large = numbers.filter((num) => num > 5);
console.log(large); // [6, 7, 8, 9, 10]

// 1桁の数だけを取り出す
const singleDigit = numbers.filter((num) => num < 10);
console.log(singleDigit); // [1, 2, 3, 4, 5, 6, 7, 8, 9]
```

**💡 階関数を理解するためにfilter関数を作ってみよ🐰**

filter の中身を自分で作ると、こんな感じになります：

```typescript
// filterの中身（簡単版）
function myFilter(
  array: number[],
  pridicate: (x: number) => boolean
): number[] {
  const result: number[] = [];
  for (const item of array) {
    if (pridicate(item)) { // ← 関数を使う
      result.push(item);
    }
  }
  return result;
}

// 使い方
const numbers = [1, 2, 3, 4, 5];
const evens = myFilter(numbers, (x) => x % 2 === 0);
console.log(evens); // [2, 4]
```

**🔍 実用的な例**

```typescript
// ユーザーデータ
const users = [
  { name: "太郎", age: 25, active: true },
  { name: "花子", age: 17, active: false },
  { name: "次郎", age: 30, active: true },
  { name: "美咲", age: 16, active: true },
];

// 大人のユーザーだけを取り出す
const adults = users.filter((user) => user.age >= 18);
console.log(adults); // 太郎と次郎

// アクティブなユーザーだけを取り出す
const activeUsers = users.filter((user) => user.active);
console.log(activeUsers); // 太郎、次郎、美咲

// アクティブな大人だけを取り出す
const activeAdults = users.filter((user) => user.active && user.age >= 18);
console.log(activeAdults); // 太郎と次郎
```

**🔥練習問題**

配列の中から条件にあったものを除外する`reject関数`を作りましょう

```ts
// 配列と条件(pridicate)を受け取って条件にあったものを除外して返す
// ヒント: filterの逆の処理になるよね!
function reject(){}
```

配列の中から、条件に合う**最初の要素**を見つけて返す`find関数`を作りましょう

```ts
// 配列と条件(pridicate)を受け取って条件にあった最初の要素を返す。要素がなかったらundefinedを返す
function find(){}
```

配列の中の要素がすべて条件にあう場合trueを返す`every関数`を作りましょう

```ts
// 配列と条件(pridicate)を受け取ってすべての要素が条件にあった場合true,一つでも条件に合わない場合falseを返す
function every(){}
```

配列の中の要素を使って任意の処理を実行できる`forEach関数`をつくりましょう

```ts
// 配列とそれぞれの要素を使って実行したい処理(callback)を受け取ってすべての要素に対してcallbackを実行する
function forEach(){}
```

#### 3. map と filter を組み合わせる

**🎯 2 つの高階関数を連続で使う**

実際の開発では、filter と map を組み合わせることがよくあります。

```typescript
// 商品データ
const products = [
  { name: "りんご", price: 100, inStock: true },
  { name: "バナナ", price: 80, inStock: false },
  { name: "みかん", price: 120, inStock: true },
  { name: "ぶどう", price: 200, inStock: true },
  { name: "キウイ", price: 150, inStock: false },
];

// 1. 在庫があるもの（filter）
// 2. 表示用のテキストに変換（map）
const availableProducts = products
  .filter((product) => product.inStock) // 在庫があるもの
  .map((product) => `${product.name}: ${product.price}円`); // 表示用テキスト

console.log(availableProducts);
// ["りんご: 100円", "みかん: 120円", "ぶどう: 200円"]
```

**🔍 もう少し複雑な例**

```typescript
// 学生の成績データ
const students = [
  { name: "太郎", score: 85, subject: "数学" },
  { name: "花子", score: 92, subject: "英語" },
  { name: "次郎", score: 78, subject: "数学" },
  { name: "美咲", score: 95, subject: "英語" },
  { name: "健太", score: 65, subject: "数学" },
];

// 1. 80点以上の学生だけ（filter）
// 2. 表彰用のメッセージに変換（map）
const excellentStudents = students
  .filter((student) => student.score >= 80)
  .map(
    (student) =>
      `${student.name}さん（${student.subject}・${student.score}点）おめでとう！`
  );

console.log(excellentStudents);
// [
//   "太郎さん（数学・85点）おめでとう！",
//   "花子さん（英語・92点）おめでとう！",
//   "美咲さん（英語・95点）おめでとう！"
// ]
```

---

### Section 3: コールバック関数 - 「後で呼び出してもらう」関数

> 📚 **関連資料**: [実践コード例 - コールバック関数の実践](./Step05_補足_実践コード例.md#コールバック関数の実践)

#### 🎯 コールバック関数とは？

**💡 簡単に言うと**

コールバック関数は「**後で呼び出してもらう関数**」のことです。

**🏪 レストランの例**

```typescript
// レストランで注文する
function orderFood(food: string, whenReady: (food: string) => void): void {
  console.log(`${food}を調理中...`);

  // 料理ができたら、whenReady関数を呼び出す
  setTimeout(() => {
    whenReady(food);
  }, 1000);
}

// 使い方
orderFood("ハンバーガー", (food: string) => {
  console.log(`${food}ができました！いただきます！`);
});

// 出力:
// ハンバーガーを調理中...
// （1秒後）
// ハンバーガーができました！いただきます！
```

Angularのプロジェクトで確認してみましょ🐰
https://codesandbox.io/p/devbox/3p7jjh

#### 1. 基本的なコールバック関数

**🔍 シンプルな例**

```typescript
// 何かの処理をして、終わったら知らせる関数
function doSomething(task: string, onFinished: (result: string) => void): void {
  console.log(`${task}を開始します`);

  // 何かの処理（ここでは簡単な文字列作成）
  const result = `${task}が完了しました`;

  // 処理が終わったのでコールバック関数を呼び出す
  onFinished(result);
}

// 使い方
doSomething("データの保存", (result: string) => {
  console.log(result);
  console.log("次の処理に進みます");
});

// 出力:
// データの保存を開始します
// データの保存が完了しました
// 次の処理に進みます
```

**💡 なぜ便利なの？**

同じ処理で、終わった後の動作を自由に変えられます：

```typescript
// 同じ処理で異なる後処理
doSomething("ファイルの読み込み", (result: string) => {
  console.log("成功:", result);
});

doSomething("ファイルの読み込み", (result: string) => {
  console.log("処理完了！");
  console.log("メールで通知します");
});
```

#### 2. 成功とエラーの両方を扱う

**🔍 実用的なパターン**

```typescript
// 成功とエラーの両方を処理する関数
function saveData(
  data: string,
  onSuccess: (message: string) => void,
  onError: (error: string) => void
): void {
  console.log("データを保存中...");

  // 成功か失敗かをランダムに決める（実際にはサーバーとの通信など）
  const isSuccess = Math.random() > 0.5;

  if (isSuccess) {
    onSuccess("データの保存に成功しました");
  } else {
    onError("データの保存に失敗しました");
  }
}

// 使い方
saveData(
  "ユーザー情報",
  (message: string) => {
    console.log("✅", message);
    console.log("次の処理を続行します");
  },
  (error: string) => {
    console.log("❌", error);
    console.log("エラーログを記録します");
  }
);
```

#### 3. 配列処理でのコールバック

**🔍 自分で作る配列処理**

```typescript
// 配列の各要素に対して何かをする関数
function processEach(items: string[], processor: (item: string) => void): void {
  for (const item of items) {
    processor(item);
  }
}

// 使い方
const fruits = ["りんご", "バナナ", "みかん"];

processEach(fruits, (fruit: string) => {
  console.log(`${fruit}が好きです`);
});

// 出力:
// りんごが好きです
// バナナが好きです
// みかんが好きです
```

**💡 forEach と同じ仕組み**

実は、JavaScript の`forEach`も同じ仕組みです：

```typescript
// 自分で作った関数
processEach(fruits, (fruit: string) => {
  console.log(`${fruit}が好きです`);
});

// 標準のforEach（上と同じ）
fruits.forEach((fruit: string) => {
  console.log(`${fruit}が好きです`);
});
```

---

### Section 4: カリー化 - 関数を段階的に作る技法

> 📚 **関連資料**: [専門用語集 - カリー化](./Step05_補足_専門用語集.md#カリー化currying) | [実践コード例 - カリー化の実践](./Step05_補足_実践コード例.md#カリー化の実践)

#### 🎯 カリー化とは？

**💡 簡単に言うと**

カリー化は「複数の引数を一度に渡す関数」を「引数を一つずつ渡す関数の連続」に変えることです。

**🍰 ケーキ屋さんの例**

```typescript
// 普通の方法：一度に全部注文
function makeOrder(size: string, flavor: string, decoration: string): string {
  return `${size}の${flavor}ケーキに${decoration}をつけます`;
}

const order1 = makeOrder("大", "チョコ", "ろうそく");
console.log(order1); // "大のチョコケーキにろうそくをつけます"

// カリー化：段階的に注文
function makeOrderCurried(size: string) {
  return (flavor: string) => {
    return (decoration: string) => {
      return `${size}の${flavor}ケーキに${decoration}をつけます`;
    };
  };
}

const order2 = makeOrderCurried("大")("チョコ")("ろうそく");
console.log(order2); // 同じ結果
```

#### 1. 基本的なカリー化

**� 一番簡単な例**

```typescript
// 普通の足し算関数
function add(a: number, b: number): number {
  return a + b;
}

console.log(add(3, 5)); // 8

// カリー化した足し算関数
function addCurried(a: number): (b: number) => number {
  return (b: number) => a + b;
}

console.log(addCurried(3)(5)); // 8

// または、段階的に使う
const addThree = addCurried(3); // 3を足す専用関数
console.log(addThree(5)); // 8
console.log(addThree(10)); // 13
```

**� 何が便利なの？**

同じ設定の関数を何度も使えます：

```typescript
// 色々な数を足す関数を作る
const addOne = addCurried(1);
const addTen = addCurried(10);
const addHundred = addCurried(100);

console.log(addOne(5)); // 6
console.log(addTen(5)); // 15
console.log(addHundred(5)); // 105
```

#### 2. 実用的なカリー化

**🔍 文字列処理**

```typescript
// 挨拶を作る関数
function greet(greeting: string): (name: string) => string {
  return (name: string) => `${greeting}、${name}さん！`;
}

// 色々な挨拶を作る
const sayHello = greet("こんにちは");
const sayGoodMorning = greet("おはようございます");
const sayGoodEvening = greet("こんばんは");

// 使い方
console.log(sayHello("田中")); // "こんにちは、田中さん！"
console.log(sayGoodMorning("佐藤")); // "おはようございます、佐藤さん！"
console.log(sayGoodEvening("山田")); // "こんばんは、山田さん！"
```

**🔍 配列処理**

```typescript
// 配列の要素を変換する関数
function transformArray(
  transform: (x: number) => number
): (arr: number[]) => number[] {
  return (arr: number[]) => arr.map(transform);
}

// 色々な変換を作る
const doubleArray = transformArray((x) => x * 2);
const squareArray = transformArray((x) => x * x);
const addTenArray = transformArray((x) => x + 10);

// 使い方
const numbers = [1, 2, 3, 4, 5];
console.log(doubleArray(numbers)); // [2, 4, 6, 8, 10]
console.log(squareArray(numbers)); // [1, 4, 9, 16, 25]
console.log(addTenArray(numbers)); // [11, 12, 13, 14, 15]
```

#### 3. 3 つの引数のカリー化

**🔍 計算機の例**

```typescript
// 3つの数を使って計算する関数
function calculate(operation: string): (a: number) => (b: number) => number {
  return (a: number) => (b: number) => {
    if (operation === "add") {
      return a + b;
    } else if (operation === "multiply") {
      return a * b;
    } else {
      return a - b;
    }
  };
}

// 計算の種類を決める
const add = calculate("add");
const multiply = calculate("multiply");
const subtract = calculate("subtract");

// 使い方
console.log(add(5)(3)); // 8
console.log(multiply(5)(3)); // 15
console.log(subtract(5)(3)); // 2

// または段階的に
const addFive = add(5);
console.log(addFive(3)); // 8
console.log(addFive(7)); // 12
```

**� 実用的な例**

```typescript
// APIのURL作成
function createUrl(
  baseUrl: string
): (endpoint: string) => (params: string) => string {
  return (endpoint: string) => (params: string) => {
    return `${baseUrl}/${endpoint}?${params}`;
  };
}

// APIのベースを決める
const createApiUrl = createUrl("https://api.example.com");

// エンドポイントを決める
const createUserUrl = createApiUrl("users");
const createProductUrl = createApiUrl("products");

const createUserUrl = createUrl("https://api.example.com")("users")("id=123");

// 使い方
console.log(createUserUrl("id=123")); // "https://api.example.com/users?id=123"
console.log(createProductUrl("name=商品")); // "https://api.example.com/products?name=商品"
```

#### 🎯 カリー化のポイント

1. **段階的な設定**: 引数を一つずつ決めていける
2. **再利用**: 設定を途中まで決めた関数を何度も使える
3. **関数の組み合わせ**: 小さな関数を組み合わせて大きな処理を作れる
4. **コードの整理**: 似た処理をまとめて管理できる

---

### Section 5: 練習問題

> 📚 **サポート資料**: [実践コード例 - 高階関数の練習](./Step05_補足_実践コード例.md#高階関数の練習) | [トラブルシューティング](./Step05_補足_トラブルシューティング.md#高階関数関連エラー)

#### 練習問題 1: 基本的な高階関数

**🎯 問題**
以下の高階関数を完成させてください：

```typescript
// 1. 配列の各要素に処理をして、結果を文字列にする高階関数
function processToString(
  numbers: number[],
  processor: (x: number) => number
): string[] {
  // ここを完成させてください
}

// 2. 条件に合う要素の個数を数える高階関数
function countElements(
  items: string[],
  pridicate: (item: string) => boolean
): number {
  // ここを完成させてください
}

// テスト
const numbers = [1, 2, 3, 4, 5];
const double = (x: number) => x * 2;

console.log(processToString(numbers, double));
// 期待値: ["2", "4", "6", "8", "10"]

const fruits = ["りんご", "バナナ", "みかん", "ぶどう"];
const hasN = (fruit: string) => fruit.includes("ん");

console.log(countElements(fruits, hasN));
// 期待値: 2 (りんご、みかん)
```

**💡 解答例**

```typescript
function processToString(
  numbers: number[],
  processor: (x: number) => number
): string[] {
  return numbers.map(processor).map((num) => num.toString());
}

function countElements(
  items: string[],
  pridicate: (item: string) => boolean
): number {
  return items.filter(pridicate).length;
}
```

#### 練習問題 2: カリー化を使った関数

**🎯 問題**
カリー化を使った関数を完成させてください：

```typescript
// 1. 文字列の前後に文字を追加するカリー化関数
function addAround(
  before: string
): (after: string) => (text: string) => string {
  // ここを完成させてください
}

// 2. 数値を変換してから条件チェックするカリー化関数
function transformAndCheck(
  transformer: (x: number) => number
): (pridicate: (x: number) => boolean) => (value: number) => boolean {
  // ここを完成させてください
}

// テスト
const addBrackets = addAround("【")("】");
console.log(addBrackets("重要"));
// 期待値: "【重要】"

const doubleAndCheck = transformAndCheck((x) => x * 2);
const checkEven = doubleAndCheck((x) => x % 2 === 0);
console.log(checkEven(3));
// 期待値: true (3 → 6 → 6は偶数)
```

**💡 解答例**

```typescript
function addAround(
  before: string
): (after: string) => (text: string) => string {
  return (after: string) => (text: string) => `${before}${text}${after}`;
}

function transformAndCheck(
  transformer: (x: number) => number
): (pridicate: (x: number) => boolean) => (value: number) => boolean {
  return (pridicate: (x: number) => boolean) => (value: number) => {
    const transformed = transformer(value);
    return pridicate(transformed);
  };
}
```

#### 練習問題 3: 実用的な高階関数

**🎯 問題**
実用的な高階関数を作ってください：

```typescript
// 学生データ
const students = [
  { name: "太郎", math: 80, english: 70 },
  { name: "花子", math: 90, english: 85 },
  { name: "次郎", math: 75, english: 80 },
  { name: "美咲", math: 95, english: 90 },
];

// 1. 指定した科目の平均点以上の学生だけを取り出す関数
function getStudentsAboveAverage(
  students: Array<{ name: string; math: number; english: number }>,
  subject: "math" | "english"
): Array<{ name: string; math: number; english: number }> {
  // ここを完成させてください
}

// 2. 学生を指定した条件で並び替える高階関数
function sortStudents(
  students: Array<{ name: string; math: number; english: number }>,
  compareFn: (
    a: { name: string; math: number; english: number },
    b: { name: string; math: number; english: number }
  ) => number
): Array<{ name: string; math: number; english: number }> {
  // ここを完成させてください
}

// テスト
console.log(getStudentsAboveAverage(students, "math"));
// 期待値: 数学の平均以上の学生

const sortByMath = (a: any, b: any) => b.math - a.math; // 数学の点数で降順
console.log(sortStudents(students, sortByMath));
// 期待値: 数学の点数が高い順に並んだ学生
```

**💡 解答例**

```typescript
function getStudentsAboveAverage(
  students: Array<{ name: string; math: number; english: number }>,
  subject: "math" | "english"
): Array<{ name: string; math: number; english: number }> {
  const total = students.reduce((sum, student) => sum + student[subject], 0);
  const average = total / students.length;

  return students.filter((student) => student[subject] >= average);
}

function sortStudents(
  students: Array<{ name: string; math: number; english: number }>,
  compareFn: (
    a: { name: string; math: number; english: number },
    b: { name: string; math: number; english: number }
  ) => number
): Array<{ name: string; math: number; english: number }> {
  return [...students].sort(compareFn);
}
```

---

## 👨‍🏫 学習ポイント

### 🤔 よくある質問

**Q: 高階関数って結局何なの？**
A: 「関数を引数に取る関数」または「関数を返す関数」のことです。普段使っている`map`や`filter`も高階関数です！

**Q: いつ使うの？**
A: 似たような処理を繰り返し書くときや、処理をカスタマイズしたいときに使います。例：配列の全要素を変換、条件に合うものだけ抽出など。

**Q: カリー化って必要？**
A: 必須ではありませんが、同じ設定の関数を何度も使う場合にとても便利です。例：「10 を足す関数」「"こんにちは"で挨拶する関数」など。

**Q: 難しくない？**
A: 最初は慣れが必要ですが、基本パターンを覚えれば大丈夫です。まずは`map`と`filter`から始めて、徐々に自分で高階関数を作ってみましょう。

### 🔧 実践的なヒント

**高階関数を使うときのコツ**:

1. **小さく始める**: まずは簡単な例から始めて、徐々に複雑にする
2. **再利用を意識**: 同じような処理を何度も書いているなら、高階関数にできないか考える
3. **型を明確に**: TypeScript の型注釈を使って、どんな関数を受け取るか明確にする
4. **読みやすさを重視**: 複雑すぎる高階関数は避け、理解しやすいコードを書く

**学習を深めるための次のステップ**:

- JavaScript の他の高階関数（reduce、some、every など）を学ぶ
- 実際のプロジェクトで高階関数を使ってみる
- 関数型プログラミングの基礎を学ぶ

---

## 🌟 次回予告

**📌 重要**: Session0 で高階関数の基礎をしっかりと習得しました。これらの概念は次回のジェネリクス学習で重要な基盤となります。

**🎯 学習完了チェックリスト**

- [ ] 高階関数の定義を説明できる
- [ ] map、filter が高階関数である理由を理解している
- [ ] コールバック関数を実装できる
- [ ] カリー化の基本概念を理解している
- [ ] 練習問題を解くことができる

すべてチェックできたら、高階関数の学習完了です！🚀
