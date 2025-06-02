# Step01 専門用語集

> 💡 **このファイルについて**: Step01 で出てくる重要な専門用語と概念の詳細解説集です。

## 📋 目次

1. [JavaScript 関連用語](#javascript関連用語)
2. [TypeScript 関連用語](#typescript関連用語)
3. [開発環境関連用語](#開発環境関連用語)

---

## JavaScript 関連用語

### プロトタイプベースオブジェクト指向

**定義**: オブジェクトが他のオブジェクトを直接継承する仕組み

**JavaScript の特徴**:

- クラスベースではなく、プロトタイプベースの継承
- 既存のオブジェクトから新しいオブジェクトを作成
- 動的にプロパティやメソッドを追加可能

**コード例**:

```javascript
// プロトタイプベースの例
function Person(name) {
  this.name = name;
}
Person.prototype.greet = function () {
  return `Hello, I'm ${this.name}`;
};

const person = new Person("Alice");
console.log(person.greet()); // "Hello, I'm Alice"

// プロトタイプチェーンの確認
console.log(person.__proto__ === Person.prototype); // true

// 動的にメソッドを追加
Person.prototype.sayGoodbye = function () {
  return `Goodbye from ${this.name}`;
};

console.log(person.sayGoodbye()); // "Goodbye from Alice"
```

**なぜ重要か**: JavaScript の継承システムを理解することで、オブジェクトの動作原理が分かり、TypeScript でのクラス設計にも活かせます。

### 高階関数

**定義**: 関数を引数として受け取るか、関数を戻り値として返す関数

**具体例**: map, filter, reduce

```javascript
const numbers = [1, 2, 3, 4, 5];

// map: 配列の各要素を変換
const doubled = numbers.map((n) => n * 2); // [2, 4, 6, 8, 10]

// filter: 条件に合う要素を抽出
const evens = numbers.filter((n) => n % 2 === 0); // [2, 4]

// reduce: 配列を単一の値に集約
const sum = numbers.reduce((acc, n) => acc + n, 0); // 15

// 高階関数の自作例
function createMultiplier(factor) {
  return function (number) {
    return number * factor;
  };
}

const double = createMultiplier(2);
console.log(double(5)); // 10
```

**実用場面**: データの変換、フィルタリング、集計処理で頻繁に使用

### クロージャ

**定義**: 関数とその関数が定義された環境（スコープ）の組み合わせ

**コード例**:

```javascript
function outerFunction(x) {
  // 外側の関数のスコープ

  function innerFunction(y) {
    // 内側の関数は外側の変数xにアクセス可能
    return x + y;
  }

  return innerFunction;
}

const addFive = outerFunction(5);
console.log(addFive(3)); // 8

// プライベート変数の実現
function createCounter() {
  let count = 0; // プライベート変数

  return {
    increment: () => ++count,
    decrement: () => --count,
    getCount: () => count,
  };
}

const counter = createCounter();
console.log(counter.increment()); // 1
console.log(counter.getCount()); // 1
// count変数に直接アクセスはできない
```

**実用場面**: プライベート変数の実現、モジュールパターン、イベントハンドラー

### イミュータブル操作

**定義**: 元のデータを変更せず、新しいデータを作成する操作

**コード例**:

```javascript
// ミュータブル（元の配列を変更）
const originalArray = [1, 2, 3];
originalArray.push(4); // 元の配列が変更される
console.log(originalArray); // [1, 2, 3, 4]

// イミュータブル（新しい配列を作成）
const originalArray2 = [1, 2, 3];
const newArray = [...originalArray2, 4]; // 新しい配列を作成
console.log(originalArray2); // [1, 2, 3] (元の配列は変更されない)
console.log(newArray); // [1, 2, 3, 4]

// オブジェクトのイミュータブル操作
const originalUser = { name: "Alice", age: 30 };
const updatedUser = { ...originalUser, age: 31 }; // 新しいオブジェクトを作成
console.log(originalUser); // { name: "Alice", age: 30 }
console.log(updatedUser); // { name: "Alice", age: 31 }
```

**なぜ重要か**: バグの防止、予測可能なコード、関数型プログラミングの基礎

### 分割代入（Destructuring）

**定義**: 配列やオブジェクトから値を取り出して、個別の変数に代入する構文

**配列の分割代入**:

```javascript
const numbers = [1, 2, 3, 4, 5];

// 従来の方法
const first = numbers[0];
const second = numbers[1];

// 分割代入
const [first, second, ...rest] = numbers;
console.log(first); // 1
console.log(second); // 2
console.log(rest); // [3, 4, 5]

// デフォルト値
const [a, b, c = 0] = [1, 2];
console.log(c); // 0
```

**オブジェクトの分割代入**:

```javascript
const user = { name: "Alice", age: 30, email: "alice@example.com" };

// 従来の方法
const name = user.name;
const age = user.age;

// 分割代入
const { name, age, email } = user;
console.log(name); // "Alice"

// 別名での代入
const { name: userName, age: userAge } = user;
console.log(userName); // "Alice"

// ネストしたオブジェクト
const userProfile = {
  personal: { name: "Bob", age: 25 },
  contact: { email: "bob@example.com" },
};

const {
  personal: { name: personName },
  contact: { email },
} = userProfile;
console.log(personName); // "Bob"
```

**実用場面**: 関数の引数、API レスポンスの処理、モジュールのインポート

### スプレッド演算子（Spread Operator）

**定義**: 配列やオブジェクトを展開する演算子（...）

**配列での使用**:

```javascript
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];

// 配列の結合
const combined = [...arr1, ...arr2]; // [1, 2, 3, 4, 5, 6]

// 配列のコピー
const copied = [...arr1]; // [1, 2, 3]

// 関数の引数として展開
function sum(a, b, c) {
  return a + b + c;
}
console.log(sum(...arr1)); // 6

// Math.maxで最大値を求める
const numbers = [1, 5, 3, 9, 2];
console.log(Math.max(...numbers)); // 9
```

**オブジェクトでの使用**:

```javascript
const obj1 = { a: 1, b: 2 };
const obj2 = { c: 3, d: 4 };

// オブジェクトの結合
const combined = { ...obj1, ...obj2 }; // { a: 1, b: 2, c: 3, d: 4 }

// オブジェクトのコピーと更新
const user = { name: "Alice", age: 30 };
const updatedUser = { ...user, age: 31 }; // { name: "Alice", age: 31 }

// プロパティの上書き
const config = { host: "localhost", port: 3000 };
const prodConfig = { ...config, host: "production.com" };
```

**実用場面**: 配列・オブジェクトのコピー、結合、関数の引数展開

### テンプレートリテラル（Template Literals）

**定義**: バッククォート（`）で囲んだ文字列で、変数の埋め込みや複数行文字列が可能

**基本的な使用**:

```javascript
const name = "Alice";
const age = 30;

// 従来の文字列結合
const message1 =
  "Hello, my name is " + name + " and I'm " + age + " years old.";

// テンプレートリテラル
const message2 = `Hello, my name is ${name} and I'm ${age} years old.`;

// 式の埋め込み
const price = 100;
const tax = 0.1;
const total = `Total: ${price * (1 + tax)} yen`;

// 複数行文字列
const html = `
  <div>
    <h1>${name}</h1>
    <p>Age: ${age}</p>
  </div>
`;
```

**高度な使用**:

```javascript
// 関数の呼び出し
function formatCurrency(amount) {
  return `¥${amount.toLocaleString()}`;
}

const price = 1234567;
const message = `Price: ${formatCurrency(price)}`; // "Price: ¥1,234,567"

// 条件演算子
const user = { name: "Bob", isAdmin: true };
const greeting = `Hello, ${user.name}${user.isAdmin ? " (Admin)" : ""}`;
```

### Promise

**定義**: 非同期処理の結果を表現するオブジェクト

**基本的な使用**:

```javascript
// Promiseの作成
const myPromise = new Promise((resolve, reject) => {
  const success = true;

  setTimeout(() => {
    if (success) {
      resolve("処理が成功しました");
    } else {
      reject("処理が失敗しました");
    }
  }, 1000);
});

// Promiseの使用
myPromise
  .then((result) => {
    console.log(result); // "処理が成功しました"
  })
  .catch((error) => {
    console.error(error);
  });
```

**実用例**:

```javascript
// APIからデータを取得
function fetchUserData(userId) {
  return new Promise((resolve, reject) => {
    // 模擬的なAPI呼び出し
    setTimeout(() => {
      if (userId > 0) {
        resolve({
          id: userId,
          name: "Alice",
          email: "alice@example.com",
        });
      } else {
        reject(new Error("Invalid user ID"));
      }
    }, 500);
  });
}

// 複数のPromiseを並列実行
Promise.all([fetchUserData(1), fetchUserData(2), fetchUserData(3)])
  .then((users) => {
    console.log("All users:", users);
  })
  .catch((error) => {
    console.error("Error:", error);
  });
```

### async/await

**定義**: Promise をより読みやすく書くための構文糖衣

**基本的な使用**:

```javascript
// Promiseを使った書き方
function fetchDataWithPromise() {
  return fetch("/api/data")
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      return data;
    })
    .catch((error) => {
      console.error(error);
      throw error;
    });
}

// async/awaitを使った書き方
async function fetchDataWithAsync() {
  try {
    const response = await fetch("/api/data");
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
```

---

## TypeScript 関連用語

### 型注釈（Type Annotation）

**定義**: TypeScript で変数や関数の型を明示的に指定すること

**基本的な使用**:

```typescript
// 変数の型注釈
let userName: string = "Alice";
let userAge: number = 30;
let isActive: boolean = true;

// 配列の型注釈
let numbers: number[] = [1, 2, 3, 4, 5];
let names: Array<string> = ["Alice", "Bob", "Charlie"];

// オブジェクトの型注釈
let user: {
  name: string;
  age: number;
  email: string;
} = {
  name: "Alice",
  age: 30,
  email: "alice@example.com",
};

// 関数の型注釈
function greet(name: string): string {
  return `Hello, ${name}!`;
}

function add(a: number, b: number): number {
  return a + b;
}

// 戻り値がない関数
function logMessage(message: string): void {
  console.log(message);
}
```

**なぜ重要か**: コンパイル時にエラーを検出、IDE の支援機能向上、コードの自己文書化

### 型推論（Type Inference）

**定義**: TypeScript が自動的に型を推測する機能

**コード例**:

```typescript
// 型推論の例
let message = "Hello"; // string型として推論
let count = 42; // number型として推論
let isValid = true; // boolean型として推論

// 配列の型推論
let numbers = [1, 2, 3]; // number[]として推論
let mixed = [1, "hello", true]; // (string | number | boolean)[]として推論

// 関数の戻り値型推論
function multiply(a: number, b: number) {
  return a * b; // number型として推論
}

// オブジェクトの型推論
let user = {
  name: "Alice",
  age: 30,
}; // { name: string; age: number; }として推論

// 型推論 vs 明示的型注釈
let value1 = "hello"; // 型推論: string
let value2: string = "hello"; // 明示的型注釈: string

// 型推論が困難な場合
let data; // any型として推論（推奨されない）
let data2: string; // 明示的にstring型を指定
```

**使い分けのガイドライン**:

- 型推論で十分な場合は型注釈を省略
- 型が明確でない場合は明示的に型注釈を追加
- 関数の引数は常に型注釈を追加

---

## 開発環境関連用語

### LTS (Long Term Support)

**定義**: 長期サポート版

- **安定性重視**: 本番環境での使用に適している
- **サポート期間**: 約 30 ヶ月間のサポート
- **バージョン**: 偶数バージョン（18.x, 20.x など）

### npm (Node Package Manager)

**定義**: Node.js のパッケージ管理ツール

- JavaScript ライブラリの管理
- プロジェクトの依存関係管理
- スクリプトの実行

### tsconfig.json

**定義**: TypeScript プロジェクトの設定ファイル

- コンパイルオプションの設定
- 対象ファイルの指定
- 型チェックの厳密さの設定

### ESLint

**定義**: JavaScript と TypeScript のコード品質チェックツール

- コーディング規約の強制
- 潜在的なバグの検出
- コードスタイルの統一

### Prettier

**定義**: コードフォーマッター

- 自動的なコード整形
- 一貫したコードスタイル
- 複数言語対応

---

## 📚 参考リンク

- [MDN - Object prototypes](https://developer.mozilla.org/ja/docs/Learn/JavaScript/Objects/Object_prototypes)
- [MDN - 高階関数](https://developer.mozilla.org/ja/docs/Glossary/Higher-order_function)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Node.js Documentation](https://nodejs.org/docs/)

---

**📌 重要**: 分からない用語が出てきたら、このファイルを参照して理解を深めてください。実際にコードを書いて動作を確認することも大切です。
