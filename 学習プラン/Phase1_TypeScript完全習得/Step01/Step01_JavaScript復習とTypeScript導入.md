# Step 1: JavaScript 復習と TypeScript 導入

## 📋 学習方式の選択

### 🎯 推奨：3セッション分割学習（他言語経験者・講師サポート付き）

**対象**: 他言語経験者（JavaScript基礎知識あり）
**形式**: 講師サポート付き学習
**総時間**: 240分（4時間）

#### 📚 セッション構成
- 🔰 **[Session1: JavaScript復習とTypeScript基礎](./Step01_Session1_JavaScript復習とTypeScript基礎.md)** (90分)
  - JavaScript要点復習・TypeScript基本型注釈・練習問題
- 🔧 **[Session2: TypeScript実践演習](./Step01_Session2_TypeScript実践演習.md)** (90分)
  - 関数・オブジェクト型・型エイリアス・学生情報システム実装
- 🎯 **[Session3: 型の総合演習](./Step01_Session3_型の総合演習.md)** (60分)
  - 型エイリアス応用・型安全性体験・型エラー修正・学習振り返り

---

### 📖 従来版：一括学習（自習・復習用）

**対象**: 自習者・復習者
**形式**: 個人学習
**総時間**: 3時間

> 💡 **補足資料**: 詳細な解説は以下の補足資料を見てね 🐰
>
> - 📖 [専門用語集](./Step01_補足_専門用語集.md) - 重要な概念と用語の詳細解説
> - 🛠️ [開発環境ガイド](./Step01_補足_開発環境ガイド.md) - 環境構築と設定方法
> - ⚙️ [設定ファイル解説](./Step01_補足_設定ファイル解説.md) - tsconfig.json 等の詳細設定
> - 💻 [実践コード例](./Step01_補足_実践コード例.md) - 段階的な学習用コード集
> - 🚨 [トラブルシューティング](./Step01_補足_トラブルシューティング.md) - よくあるエラーと解決方法
> - 📚 [参考リソース](./Step01_補足_参考リソース.md) - 学習に役立つリンク集

## 📅 学習期間・目標（従来版）

**期間**: Step 1
**総学習時間**: 3 時間
**学習スタイル**: 理論 20% + 実践コード 50% + 演習 30%

### 🎯 Step 1 到達目標

- [ ] JavaScript 基礎の復習と確認
- [ ] TypeScript 開発環境の構築
- [ ] 基本的な型注釈の理解と実践
- [ ] 簡単な TypeScript アプリケーションの作成

## 📚 理論学習内容

### Section 1: JavaScript 基礎復習

#### 🔍 JavaScript の基本概念

##### 1. 変数宣言の違いと使い分け

**💡 なぜこの概念が重要なのか**

JavaScript には `var`、`let`、`const` の 3 つの変数宣言方法があります。これらの違いを理解することは、バグの少ない安全なコードを書くために不可欠です。特に TypeScript では、適切な変数宣言がより良い型推論と型安全性につながります。

**🎯 どういう場面で使うのか**

- **const**: API の URL、設定値、関数など、再代入しない値（最も推奨）
- **let**: ループのカウンター、条件によって値が変わる変数
- **var**: 現代の開発では使用しない（レガシーコードでのみ遭遇）

```javascript
// let: ブロックスコープ、再代入可能
let userName = "Alice";
userName = "Bob"; // 再代入可能

// const: ブロックスコープ、再代入不可
const API_URL = "https://api.example.com";
// API_URL = "別のURL"; // エラー！

// オブジェクトや配列の場合
const user = { name: "Alice", age: 30 };
user.age = 31; // オブジェクトの中身は変更可能
user.email = "alice@example.com"; // プロパティ追加も可能

const numbers = [1, 2, 3];
numbers.push(4); // 配列の中身は変更可能
console.log(numbers); // [1, 2, 3, 4]
```

**📝 コードの詳細解説**

- `const` で宣言したオブジェクトや配列は、**参照先は変更できませんが、中身は変更可能**です
- これは `const user = { ... }` の `user` 変数が別のオブジェクトを指すことはできないが、`user.age` のようなプロパティは変更できることを意味します

**⚠️ よくある間違いと注意点**

```javascript
// ❌ 間違い: varの使用（スコープの問題）
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100); // 3, 3, 3 が出力される
}

// ✅ 正解: letの使用
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100); // 0, 1, 2 が出力される
}

// ❌ 間違い: constで再代入を試みる
const count = 0;
count = 1; // TypeError: Assignment to constant variable.

// ✅ 正解: 再代入が必要ならlet
let count = 0;
count = 1; // OK
```

**🚀 TypeScript での改善点**

TypeScript では適切な変数宣言により、より正確な型推論が行われます：

```typescript
const API_URL = "https://api.example.com"; // string literal型として推論
let userName = "Alice"; // string型として推論
userName = 123; // エラー！型が一致しない
```

**使い分けのルール**:

- 基本的に `const` を使用
- 再代入が必要な場合のみ `let` を使用
- `var` は使用しない

##### 2. ES6+ モダン構文

###### 分割代入（Destructuring）

> 💡 **詳細解説**: 分割代入の詳細と応用例は [Step01\_補足\_専門用語集.md#分割代入 destructuring](./Step01_補足_専門用語集.md#分割代入destructuring) を見てね 🐰

**💡 なぜこの概念が重要なのか**

分割代入は、配列やオブジェクトから値を取り出して変数に代入する簡潔な記法です。従来の方法と比べて、コードが読みやすく、書きやすくなります。特に API レスポンスの処理や、関数の引数として複雑なオブジェクトを受け取る際に威力を発揮します。

**🎯 どういう場面で使うのか**

- **API レスポンス**: サーバーから受け取ったデータの必要な部分だけを抽出
- **関数の引数**: オブジェクトの特定のプロパティのみを使用する関数
- **配列の処理**: 座標データ、RGB 値など、順序が決まっているデータの処理
- **設定オブジェクト**: デフォルト値を持つ設定の処理

```javascript
// 配列の分割代入
const colors = ["red", "green", "blue"];
const [primary, secondary, tertiary] = colors;
console.log(primary); // "red"

// 一部をスキップ
const [first, , third] = colors;
console.log(first, third); // "red" "blue"

// デフォルト値
const [a, b, c, d = "yellow"] = colors;
console.log(d); // "yellow"

// オブジェクトの分割代入
const user = {
  name: "Alice",
  age: 30,
  email: "alice@example.com",
  address: {
    city: "Tokyo",
    country: "Japan",
  },
};

const { name, age, email } = user;
console.log(name, age); // "Alice" 30

// 別名での代入
const { name: userName, age: userAge } = user;
console.log(userName); // "Alice"

// ネストしたオブジェクト
const {
  address: { city, country },
} = user;
console.log(city, country); // "Tokyo" "Japan"

// 関数の引数での分割代入
function greetUser({ name, age }) {
  return `Hello, ${name}! You are ${age} years old.`;
}

console.log(greetUser(user)); // "Hello, Alice! You are 30 years old."
```

**📝 コードの詳細解説**

- **配列の分割代入**: 順序に基づいて値を取り出し、不要な要素は `,` でスキップ可能
- **デフォルト値**: 値が `undefined` の場合に使用される代替値を設定
- **オブジェクトの分割代入**: プロパティ名に基づいて値を取り出し
- **別名代入**: `元の名前: 新しい名前` の形式で変数名を変更
- **ネストした分割代入**: 深い階層のプロパティも一度に取り出し可能

**⚠️ よくある間違いと注意点**

```javascript
// ❌ 間違い: 存在しないプロパティの分割代入
const { nonExistent } = user;
console.log(nonExistent); // undefined

// ✅ 正解: デフォルト値を設定
const { nonExistent = "デフォルト値" } = user;
console.log(nonExistent); // "デフォルト値"

// ❌ 間違い: nullやundefinedオブジェクトの分割代入
const nullUser = null;
// const { name } = nullUser; // TypeError: Cannot destructure property 'name' of 'null'

// ✅ 正解: デフォルトオブジェクトを設定
const { name } = nullUser || {};
console.log(name); // undefined（エラーにならない）
```

**🚀 TypeScript での改善点**

TypeScript では、分割代入に型注釈を付けることで、より安全なコードが書けます：

```typescript
// 型安全な分割代入
interface User {
  name: string;
  age: number;
  email: string;
  address?: {
    city: string;
    country: string;
  };
}

function processUser({ name, age, email }: User): string {
  return `${name} (${age}) - ${email}`;
}

// 配列の型安全な分割代入
const coordinates: [number, number] = [10, 20];
const [x, y]: [number, number] = coordinates;
```

###### スプレッド演算子

> 💡 **詳細解説**: スプレッド演算子の詳細と活用パターンは [Step01\_補足\_専門用語集.md#スプレッド演算子 spread-operator](./Step01_補足_専門用語集.md#スプレッド演算子spread-operator) を見てね 🐰

**💡 なぜこの概念が重要なのか**

スプレッド演算子（`...`）は、配列やオブジェクトを「展開」する強力な構文です。従来の方法と比べて、コードが簡潔で読みやすくなり、イミュータブル（不変）な操作を簡単に実現できます。特に React や Vue などのフレームワークでは、状態の更新時に元のデータを変更せずに新しいデータを作成する際に必須の技術です。

**🎯 どういう場面で使うのか**

- **配列の結合**: 複数の配列を一つにまとめる（API レスポンスの統合など）
- **配列のコピー**: 元の配列を変更せずに新しい配列を作成（状態管理）
- **オブジェクトのマージ**: 設定オブジェクトの組み合わせ（環境設定、テーマ設定）
- **関数の引数展開**: 配列の要素を個別の引数として渡す（数学計算、API 呼び出し）
- **プロパティの上書き**: デフォルト設定に個別設定を適用

```javascript
// 配列のスプレッド
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];
const combined = [...arr1, ...arr2]; // [1, 2, 3, 4, 5, 6]

// 配列のコピー
const originalArray = [1, 2, 3];
const copiedArray = [...originalArray];

// オブジェクトのスプレッド
const baseConfig = {
  host: "localhost",
  port: 3000,
  debug: true,
};

const productionConfig = {
  ...baseConfig,
  host: "production.com",
  debug: false,
};

// 関数の引数として展開
function sum(a, b, c) {
  return a + b + c;
}

const numbers = [1, 2, 3];
console.log(sum(...numbers)); // 6
```

###### テンプレートリテラル

> 💡 **詳細解説**: テンプレートリテラルの詳細と高度な使い方は [Step01\_補足\_専門用語集.md#テンプレートリテラル template-literals](./Step01_補足_専門用語集.md#テンプレートリテラルtemplate-literals) を見てね 🐰

**💡 なぜこの概念が重要なのか**

テンプレートリテラル（バッククォート `` ` `` を使用）は、従来の文字列連結と比べて格段に読みやすく、保守しやすい動的文字列を作成できます。変数や式を `${}` で直接埋め込めるため、複雑な文字列操作が直感的になります。特に HTML テンプレート、SQL クエリ、ログメッセージの生成において、エラーが起きにくく可読性の高いコードが書けます。

**🎯 どういう場面で使うのか**

- **動的メッセージ生成**: ユーザー向けの通知、エラーメッセージ、挨拶文
- **HTML テンプレート**: 動的な HTML 要素の生成（React、Vue 等でも活用）
- **URL の構築**: API エンドポイント、クエリパラメータ付き URL
- **SQL クエリ**: 動的な検索条件やフィルタリング
- **ログ出力**: デバッグ情報、エラーログの詳細記録
- **設定ファイル**: 環境変数を含む設定値の組み立て

```javascript
const name = "Alice";
const age = 30;
const score = 85.7;

// 基本的な使用
const message = `Hello, ${name}! You are ${age} years old.`;

// 式の埋め込み
const result = `Your score is ${score.toFixed(1)} points.`;

// 複数行文字列
const htmlTemplate = `
  <div class="user-card">
    <h2>${name}</h2>
    <p>Age: ${age}</p>
    <p>Score: ${score}</p>
  </div>
`;

// 条件演算子の使用
const status = `User is ${age >= 18 ? "adult" : "minor"}`;

// 関数の呼び出し
function formatCurrency(amount) {
  return `¥${amount.toLocaleString()}`;
}

const price = 1234567;
const priceMessage = `Price: ${formatCurrency(price)}`;
```

##### 3. 関数型プログラミングの基礎

> 💡 **詳細解説**: 高階関数とイミュータブル操作について [Step01\_補足\_専門用語集.md#高階関数](./Step01_補足_専門用語集.md#高階関数) を見てね 🐰

**💡 なぜこの概念が重要なのか**

関数型プログラミングの手法（`map`、`filter`、`reduce`など）は、データの変換を安全で予測可能な方法で行えます。元のデータを変更せず（イミュータブル）、副作用のない純粋な関数を使うことで、バグが起きにくく、テストしやすいコードが書けます。TypeScript では、これらの操作で型推論が正確に働き、より安全なデータ処理が可能になります。

**🎯 どういう場面で使うのか**

- **データ変換**: API レスポンスの整形、表示用データの加工
- **フィルタリング**: 検索機能、条件に基づくデータ抽出
- **集計処理**: 合計、平均、最大値などの計算
- **リスト操作**: ユーザー一覧、商品一覧の表示・操作
- **状態管理**: React の状態更新、Redux の reducer
- **バリデーション**: フォーム入力値のチェック、エラー収集

```javascript
// 高階関数の例
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// map: 各要素を変換
const doubled = numbers.map((n) => n * 2);
console.log(doubled); // [2, 4, 6, 8, 10, 12, 14, 16, 18, 20]

// filter: 条件に合う要素を抽出
const evens = numbers.filter((n) => n % 2 === 0);
console.log(evens); // [2, 4, 6, 8, 10]

// reduce: 配列を単一の値に集約
const sum = numbers.reduce((acc, n) => acc + n, 0);
console.log(sum); // 55

// 複数の操作を組み合わせ（メソッドチェーン）
const result = numbers
  .filter((n) => n % 2 === 0) // 偶数のみ
  .map((n) => n * n) // 二乗
  .reduce((acc, n) => acc + n, 0); // 合計

console.log(result); // 220 (4 + 16 + 36 + 64 + 100)

// 実用的な例：ユーザーデータの処理
const users = [
  { name: "Alice", age: 30, active: true },
  { name: "Bob", age: 25, active: false },
  { name: "Charlie", age: 35, active: true },
  { name: "Diana", age: 28, active: true },
];

// アクティブなユーザーの平均年齢を計算
const activeUsers = users.filter((user) => user.active);
const averageAge =
  activeUsers.reduce((sum, user) => sum + user.age, 0) / activeUsers.length;
console.log(`アクティブユーザーの平均年齢: ${averageAge}歳`);

// ユーザー名のリストを作成
const userNames = users.map((user) => user.name);
console.log(userNames); // ["Alice", "Bob", "Charlie", "Diana"]
```

##### 4. 非同期プログラミング

> 💡 **詳細解説**: JavaScript の非同期プログラミングについて [Step01\_補足\_専門用語集.md#promise](./Step01_補足_専門用語集.md#promise) および [Step01\_補足\_専門用語集.md#asyncawait](./Step01_補足_専門用語集.md#asyncawait) を見てね 🐰

**💡 なぜこの概念が重要なのか**

非同期プログラミングは、時間のかかる処理（API 通信、ファイル読み込み、データベースアクセス）を行う際に、アプリケーションをブロックせずに他の処理を継続できる重要な技術です。Promise と Async/Await を理解することで、コールバック地獄を避け、読みやすく保守しやすい非同期コードが書けるようになります。

**🎯 どういう場面で使うのか**

- **API 通信**: サーバーからのデータ取得、POST/PUT/DELETE 操作
- **ファイル操作**: 画像アップロード、CSV ダウンロード、ファイル読み込み
- **ユーザーインタラクション**: ボタンクリック後の処理、フォーム送信
- **タイマー処理**: 遅延実行、定期実行、アニメーション
- **データベース操作**: 検索、挿入、更新、削除
- **外部サービス連携**: 決済処理、メール送信、通知システム

###### Promise の基礎

> 💡 **詳細解説**: Promise の詳細と使いこなしテクニックは [Step01\_補足\_専門用語集.md#promise](./Step01_補足_専門用語集.md#promise) を見てね 🐰

```javascript
// Promise の作成
function fetchUserData(userId) {
  return new Promise((resolve, reject) => {
    // 模擬的なAPI呼び出し
    setTimeout(() => {
      if (userId > 0) {
        resolve({
          id: userId,
          name: `User ${userId}`,
          email: `user${userId}@example.com`,
        });
      } else {
        reject(new Error("Invalid user ID"));
      }
    }, 1000);
  });
}

// Promise の使用
fetchUserData(1)
  .then((user) => {
    console.log("ユーザー情報:", user);
    return user.id;
  })
  .then((userId) => {
    console.log("ユーザーID:", userId);
  })
  .catch((error) => {
    console.error("エラー:", error.message);
  });

// 複数のPromiseを並列実行
Promise.all([fetchUserData(1), fetchUserData(2), fetchUserData(3)])
  .then((users) => {
    console.log("全ユーザー:", users);
  })
  .catch((error) => {
    console.error("エラー:", error);
  });
```

###### async/await の使用

> 💡 **詳細解説**: async/await の詳細と非同期処理のパターンは [Step01\_補足\_専門用語集.md#asyncawait](./Step01_補足_専門用語集.md#asyncawait) を見てね 🐰

```javascript
// async/await を使った書き方
async function getUserInfo(userId) {
  try {
    const user = await fetchUserData(userId);
    console.log("取得したユーザー:", user);

    // 追加の処理
    const processedUser = {
      ...user,
      displayName: `${user.name} (ID: ${user.id})`,
    };

    return processedUser;
  } catch (error) {
    console.error("ユーザー取得エラー:", error.message);
    throw error;
  }
}

// 複数のユーザーを順次取得
async function getAllUsers() {
  const userIds = [1, 2, 3];
  const users = [];

  for (const id of userIds) {
    try {
      const user = await getUserInfo(id);
      users.push(user);
    } catch (error) {
      console.error(`ユーザー${id}の取得に失敗:`, error.message);
    }
  }

  return users;
}

// 使用例
getAllUsers().then((users) => {
  console.log("取得した全ユーザー:", users);
});
```

#### 🚨 JavaScript の型関連の問題点

> 💡 **詳細解説**: これらの問題への TypeScript の解決法については [Step01\_補足\_実践コード例.md](./Step01_補足_実践コード例.md) を見てね 🐰

##### 1. 暗黙的型変換による予期しない動作

```javascript
console.log("5" + 3); // "53" (文字列結合)
console.log("5" - 3); // 2 (数値減算)
console.log(true + 1); // 2
console.log([] + []); // "" (空文字列)
console.log({} + []); // "[object Object]"
```

##### 2. undefined/null の混在

```javascript
let data;
console.log(data); // undefined
console.log(data.name); // TypeError: Cannot read property 'name' of undefined

function getUser(id) {
  if (id > 0) {
    return { id, name: "User" };
  }
  // 暗黙的にundefinedを返す
}
```

##### 3. 関数パラメータの型不明

```javascript
function calculateArea(width, height) {
  return width * height; // width, heightが数値である保証がない
}

calculateArea("10", "20"); // "1020" (文字列結合)
calculateArea(10); // NaN (heightがundefined)
```

##### 4. オブジェクトプロパティの存在不明

```javascript
function processUser(user) {
  return user.profile.avatar.url; // 各プロパティの存在が不明
}
```

##### 5. 配列要素の型不統一

```javascript
const mixedArray = [1, "hello", true, { name: "test" }, null];
mixedArray.forEach((item) => {
  console.log(item.toUpperCase()); // 文字列以外でエラー
});
```

### Section 2: TypeScript 導入

#### 🎯 TypeScript の基本概念

TypeScript の型システムは、JavaScript の柔軟性を保ちながら、型安全性を提供する革新的な仕組みです。型注釈により、変数や関数の期待される型を明示的に宣言でき、開発時にエラーを早期発見できます。これにより、ランタイムエラーを大幅に減らし、リファクタリングやチーム開発での安全性が向上します。

##### 1. 型注釈の基本

```typescript
// JavaScript
let message = "Hello World";

// TypeScript
let message: string = "Hello World";
```

##### 2. 型推論の活用

> 💡 **詳細解説**: 型推論 → [Step01*補足*専門用語集.md#型推論 type-inference](./Step01_補足_専門用語集.md#型推論type-inference)

```typescript
let inferredString = "Hello"; // string型として推論
let inferredNumber = 42; // number型として推論
let inferredBoolean = true; // boolean型として推論
```

##### 3. 基本的な型

> 💡 **詳細解説**: TypeScript の基本型について詳しくは [Step02\_基本型システムと型注釈.md](./Step02_基本型システムと型注釈.md) を見てね 🐰

```typescript
let userName: string = "Alice";
let userAge: number = 30;
let isActive: boolean = true;
let userData: null = null;
let notDefined: undefined = undefined;
```

### 🎯 練習問題 1: 基本型の型注釈（5 分）

以下の変数に適切な型注釈を追加してください。

```typescript
// 以下の変数に型注釈を追加してください
let userName = "太郎";
let userAge = 25;
let isActive = true;
let score = 85.5;
let message = "こんにちは";

// 答えは下にスクロール ↓
```

回答例

```typescript
let userName: string = "太郎";
let userAge: number = 25;
let isActive: boolean = true;
let score: number = 85.5;
let message: string = "こんにちは";
```

##### 4. 配列の型注釈

> 💡 **詳細解説**: 配列とタプルの詳細は [Step02\_基本型システムと型注釈.md](./Step02_基本型システムと型注釈.md) で学習するよ 🐰

```typescript
let numbers: number[] = [1, 2, 3, 4, 5];
let names: string[] = ["Alice", "Bob", "Charlie"];
let flags: boolean[] = [true, false, true];

// 代替記法
let scores: Array<number> = [85, 92, 78, 96];
```

### 🎯 練習問題 2: 配列の型注釈（5 分）

以下の配列に適切な型注釈を追加してください。

```typescript
// 以下の配列に型注釈を追加してください
let fruits = ["りんご", "バナナ", "オレンジ"];
let numbers = [1, 2, 3, 4, 5];
let flags = [true, false, true];

// 答えは下にスクロール ↓
```

回答例

```typescript
let fruits: string[] = ["りんご", "バナナ", "オレンジ"];
let numbers: number[] = [1, 2, 3, 4, 5];
let flags: boolean[] = [true, false, true];
```

##### 5. オブジェクトの型注釈

```typescript
let user: {
  name: string;
  age: number;
  email: string;
} = {
  name: "Alice",
  age: 30,
  email: "alice@example.com",
};
```

### 🎯 練習問題 3: オブジェクトの型注釈（10 分）

以下のオブジェクトに適切な型注釈を追加してください。

```typescript
// 以下のオブジェクトに型注釈を追加してください
let user = {
  name: "太郎",
  age: 25,
  email: "taro@example.com",
};

let product = {
  name: "ノートパソコン",
  price: 80000,
  inStock: true,
};

// 答えは下にスクロール ↓
```

回答例

```typescript
let user: {
  name: string;
  age: number;
  email: string;
} = {
  name: "太郎",
  age: 25,
  email: "taro@example.com",
};

let product: {
  name: string;
  price: number;
  inStock: boolean;
} = {
  name: "ノートパソコン",
  price: 80000,
  inStock: true,
};
```

##### 6. 関数の型注釈

```typescript
function greet(name: string): string {
  return `Hello, ${name}!`;
}

function add(a: number, b: number): number {
  return a + b;
}

function logMessage(message: string): void {
  console.log(message);
}
```

##### 7. アロー関数の型注釈

```typescript
const multiply = (a: number, b: number): number => a * b;
const isEven = (num: number): boolean => num % 2 === 0;
```

### 🎯 練習問題 4: 関数の型注釈（10 分）

以下の関数に適切な型注釈を追加してください。

```typescript
// 以下の関数に型注釈を追加してください
function greet(name) {
  return `こんにちは、${name}さん！`;
}

function add(a, b) {
  return a + b;
}

function isEven(num) {
  return num % 2 === 0;
}

// 答えは下にスクロール ↓
```

回答例

```typescript
function greet(name: string): string {
  return `こんにちは、${name}さん！`;
}

function add(a: number, b: number): number {
  return a + b;
}

function isEven(num: number): boolean {
  return num % 2 === 0;
}
```

### Section 3: 実践的な TypeScript 活用

#### 🔧 型安全なプログラミングの実践

型安全なプログラミングは、TypeScript の最大の利点を活用する実践的なアプローチです。型エイリアス、インターフェース、ジェネリクスなどの機能を適切に使用することで、コードの可読性、保守性、安全性が大幅に向上します。特に大規模なアプリケーションでは、型システムがドキュメントとしても機能し、チーム開発の効率を高めます。

##### 1. 型エイリアスの活用

> 💡 **詳細解説**: 型エイリアスの詳細と応用は [Step02\_補足\_専門用語集.md#型エイリアス type-aliases](./Step02_補足_専門用語集.md#型エイリアスtype-aliases) を見てね 🐰

```typescript
// 基本的な型エイリアス
type UserName = string;
type UserAge = number;
type UserID = number;

// オブジェクト型のエイリアス
type User = {
  id: UserID;
  name: UserName;
  age: UserAge;
  email: string;
};

// 関数型のエイリアス
type Calculator = (a: number, b: number) => number;

const add: Calculator = (a, b) => a + b;
const subtract: Calculator = (a, b) => a - b;

// 使用例
const user: User = {
  id: 1,
  name: "Alice",
  age: 30,
  email: "alice@example.com",
};

function processUser(user: User): string {
  return `Processing user: ${user.name} (ID: ${user.id})`;
}
```

## 🎯 実践演習

### 演習 1-1: 基本的な型注釈練習 🔰

> 💡 **詳細解説**: 演習問題の解説と追加の練習問題は [Step01\_補足\_実践コード例.md](./Step01_補足_実践コード例.md) を見てね 🐰

```typescript
// 以下のJavaScriptコードにTypeScriptの型注釈を追加してください

// JavaScript版
function calculateBMI(weight, height) {
  return weight / (height * height);
}

function getGrade(score) {
  if (score >= 90) return "A";
  if (score >= 80) return "B";
  if (score >= 70) return "C";
  if (score >= 60) return "D";
  return "F";
}

function createUser(name, age, email) {
  return {
    name: name,
    age: age,
    email: email,
    createdAt: new Date(),
  };
}
```

```typescript
// TypeScript版（解答例）
function calculateBMI(weight: number, height: number): number {
  return weight / (height * height);
}

function getGrade(score: number): string {
  if (score >= 90) return "A";
  if (score >= 80) return "B";
  if (score >= 70) return "C";
  if (score >= 60) return "D";
  return "F";
}

function createUser(
  name: string,
  age: number,
  email: string
): {
  name: string;
  age: number;
  email: string;
  createdAt: Date;
} {
  return {
    name: name,
    age: age,
    email: email,
    createdAt: new Date(),
  };
}
```

### 演習 1-2: 簡単なユーザー情報管理 🔶

```typescript
// 以下の要件を満たすTypeScriptコードを作成してください

// 1. ユーザー情報を表す型を定義
// 2. ユーザーの挨拶メッセージを作成する関数
// 3. ユーザーのリストから名前で検索する関数
```

解答例

```typescript
// 1. ユーザー情報の型定義
type User = {
  name: string;
  age: number;
  email: string;
};

// 2. 挨拶メッセージを作成する関数
function createGreeting(user: User): string {
  return `こんにちは、${user.name}さん！年齢は${user.age}歳ですね。`;
}

// 3. 名前で検索する関数
function findUserByName(users: User[], name: string): User | null {
  const user = users.find((user) => user.name === name);
  return user || null;
}

// 使用例
const users: User[] = [
  { name: "太郎", age: 25, email: "taro@example.com" },
  { name: "花子", age: 30, email: "hanako@example.com" },
  { name: "次郎", age: 28, email: "jiro@example.com" },
];

console.log(createGreeting(users[0]));
console.log(findUserByName(users, "花子"));
```


### 演習 1-3: 簡単な計算機能 🔥

```typescript
// 以下の要件を満たすTypeScriptコードを作成してください

// 1. 数値の配列から合計を計算する関数
// 2. 数値の配列から平均を計算する関数
// 3. 数値の配列から最大値を見つける関数
```

解答例

```typescript
// 1. 合計を計算する関数
function calculateSum(numbers: number[]): number {
  return numbers.reduce((sum, num) => sum + num, 0);
}

// 2. 平均を計算する関数
function calculateAverage(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  return calculateSum(numbers) / numbers.length;
}

// 3. 最大値を見つける関数
function findMax(numbers: number[]): number | null {
  if (numbers.length === 0) return null;
  return Math.max(...numbers);
}

// 使用例
const scores: number[] = [85, 92, 78, 96, 88];

console.log("合計:", calculateSum(scores));
console.log("平均:", calculateAverage(scores));
console.log("最大値:", findMax(scores));
```


## 📊 Step 1 評価基準

> 💡 **詳細解説**: 学習の進め方とトラブルシューティングは [Step01\_補足\_参考リソース.md](./Step01_補足_参考リソース.md) にもまとめてあるよ 🐰

### 理解度チェックリスト

#### JavaScript 復習 (25%)

- [ ] ES6+のモダン構文を理解している
- [ ] 非同期プログラミング（Promise/async-await）を理解している
- [ ] 関数型プログラミングの基本を理解している
- [ ] JavaScript の型関連の問題点を説明できる

#### TypeScript 基礎 (35%)

- [ ] 基本的な型注釈を正しく書ける
- [ ] 型推論の仕組みを理解している
- [ ] 関数の型注釈を適切に設定できる
- [ ] 配列とオブジェクトの型を定義できる

#### 開発環境 (20%)

- [ ] TypeScript 開発環境を構築できる
- [ ] tsconfig.json の基本設定を理解している
- [ ] TypeScript コンパイルを実行できる
- [ ] 基本的なデバッグができる

#### 実践応用 (20%)

- [ ] 簡単なクラスを型安全に実装できる
- [ ] 実用的な関数を型注釈付きで作成できる
- [ ] 基本的なアプリケーションを作成できる
- [ ] TypeScript の利点と基本概念を説明できる

### 成果物

- [ ] **基本的な学生情報処理システム**: 型注釈練習に特化した初学者向けプロジェクト → [Step01 成果物](./Step01_成果物.md)で詳細確認

------

**📌 重要**: Step 1 は TypeScript の基礎固めの重要な期間です。JavaScript の基本をしっかり復習し、TypeScript の型システムの恩恵を実感できるようになります。焦らず確実に基礎を身につけましょう。

**🌟 次週は、より詳細な型システムと実践的な型注釈について学習します！**
