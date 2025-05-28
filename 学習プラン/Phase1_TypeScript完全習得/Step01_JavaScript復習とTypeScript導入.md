# Step 1: JavaScript 復習と TypeScript 導入

> 💡 **補足資料**: 詳細な解説は以下の補足資料を見てね 🐰
>
> - 📖 [専門用語集](./Step01_補足_専門用語集.md) - 重要な概念と用語の詳細解説
> - 🛠️ [開発環境ガイド](./Step01_補足_開発環境ガイド.md) - 環境構築と設定方法
> - ⚙️ [設定ファイル解説](./Step01_補足_設定ファイル解説.md) - tsconfig.json 等の詳細設定
> - 💻 [実践コード例](./Step01_補足_実践コード例.md) - 段階的な学習用コード集
> - 🚨 [トラブルシューティング](./Step01_補足_トラブルシューティング.md) - よくあるエラーと解決方法
> - 📚 [参考リソース](./Step01_補足_参考リソース.md) - 学習に役立つリンク集

## 📅 学習期間・目標

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
// var: 関数スコープ、巻き上げあり（非推奨）
var oldStyle = "古い書き方";

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

##### 2. スコープとクロージャ

> 💡 **詳細解説**: クロージャの詳細と実践例は [Step01\_補足\_専門用語集.md#クロージャ](./Step01_補足_専門用語集.md#クロージャ) を見てね 🐰

**💡 なぜこの概念が重要なのか**

スコープとクロージャは JavaScript の核心的な概念です。スコープは変数がアクセス可能な範囲を決定し、クロージャは関数が定義された時の環境を「記憶」する仕組みです。これらを理解することで、予期しないバグを防ぎ、より安全で保守性の高いコードが書けるようになります。

**🎯 どういう場面で使うのか**

- **スコープ**: 変数の衝突を防ぎ、適切なカプセル化を実現
- **クロージャ**: プライベート変数の実現、モジュールパターン、イベントハンドラーでの状態保持

```javascript
// ブロックスコープの例
function demonstrateScope() {
  const outerVariable = "外側の変数";

  if (true) {
    const innerVariable = "内側の変数";
    console.log(outerVariable); // アクセス可能
    console.log(innerVariable); // アクセス可能
  }

  console.log(outerVariable); // アクセス可能
  // console.log(innerVariable); // エラー！スコープ外
}

// クロージャの実用例
function createCounter() {
  let count = 0; // プライベート変数

  return {
    increment: () => ++count,
    decrement: () => --count,
    getCount: () => count,
    reset: () => {
      count = 0;
    },
  };
}

const counter = createCounter();
console.log(counter.increment()); // 1
console.log(counter.increment()); // 2
console.log(counter.getCount()); // 2
counter.reset();
console.log(counter.getCount()); // 0
```

**📝 コードの詳細解説**

- **ブロックスコープ**: `{}` で囲まれた範囲内でのみ変数がアクセス可能
- **クロージャ**: `createCounter` 関数が終了しても、返された関数は `count` 変数にアクセス可能
- **プライベート変数**: 外部から直接 `count` にアクセスできず、提供されたメソッドを通してのみ操作可能

**⚠️ よくある間違いと注意点**

```javascript
// ❌ 間違い: グローバル変数の乱用
var globalCounter = 0; // どこからでもアクセス可能（危険）

function increment() {
  globalCounter++; // 他の関数からも変更される可能性
}

// ✅ 正解: クロージャを使ったカプセル化
const safeCounter = (() => {
  let count = 0; // 外部からアクセス不可
  return {
    increment: () => ++count,
    getCount: () => count,
  };
})();
```

**🚀 TypeScript での改善点**

TypeScript では、クロージャ内の変数にも型注釈を付けることで、より安全なコードが書けます：

```typescript
function createTypedCounter(): {
  increment: () => number;
  decrement: () => number;
  getCount: () => number;
  reset: () => void;
} {
  let count: number = 0; // 型注釈により意図が明確

  return {
    increment: (): number => ++count,
    decrement: (): number => --count,
    getCount: (): number => count,
    reset: (): void => {
      count = 0;
    },
  };
}
```

##### 3. ES6+ モダン構文

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

**実際の開発での活用例**

```javascript
// API レスポンスの処理
async function fetchUserProfile(userId) {
  const response = await fetch(`/api/users/${userId}`);
  const {
    data: { user, preferences },
    status,
  } = await response.json();

  // 必要なデータのみを抽出して使用
  return { user, preferences, status };
}

// React コンポーネントでの props の分割代入
function UserCard({ name, age, avatar, isOnline = false }) {
  return (
    <div className={`user-card ${isOnline ? "online" : "offline"}`}>
      <img src={avatar} alt={name} />
      <h3>{name}</h3>
      <p>Age: {age}</p>
    </div>
  );
}
```

###### スプレッド演算子

> 💡 **詳細解説**: スプレッド演算子の詳細と活用パターンは [Step01\_補足\_専門用語集.md#スプレッド演算子 spread-operator](./Step01_補足_専門用語集.md#スプレッド演算子spread-operator) を見てね 🐰

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

##### 4. 関数型プログラミングの基礎

> 💡 **詳細解説**: 高階関数とイミュータブル操作について [Step01\_補足\_専門用語集.md#高階関数](./Step01_補足_専門用語集.md#高階関数) を見てね 🐰

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

##### 5. 非同期プログラミング

> 💡 **詳細解説**: JavaScript の非同期プログラミングについて [Step01\_補足\_専門用語集.md#promise](./Step01_補足_専門用語集.md#promise) および [Step01\_補足\_専門用語集.md#asyncawait](./Step01_補足_専門用語集.md#asyncawait) を見てね 🐰

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

### Section 2: TypeScript 導入と環境構築

#### 🛠️ 開発環境構築

> 💡 **詳細解説**: 完全な環境構築手順は [Step01\_補足\_開発環境ガイド.md](./Step01_補足_開発環境ガイド.md) を見てね 🐰

##### 1. Node.js 確認（LTS 版推奨）

> 💡 **詳細解説**: Node.js のインストール方法と LTS 版について [Step01\_補足\_開発環境ガイド.md#nodejs-lts 版について](./Step01_補足_開発環境ガイド.md#nodejs-lts版について) を見てね 🐰

```bash
node --version  # v18.x.x以上
```

##### 2. TypeScript グローバルインストール

> 💡 **詳細解説**: TypeScript のインストール方法とトラブルシューティングは [Step01\_補足\_トラブルシューティング.md](./Step01_補足_トラブルシューティング.md) を見てね 🐰

```bash
npm install -g typescript
tsc --version   # 5.x.x以上
```

##### 3. プロジェクト初期化

```bash
mkdir typescript-learning
cd typescript-learning
npm init -y
```

##### 4. TypeScript 設定

```bash
npm install -D typescript @types/node ts-node
npx tsc --init
```

##### 5. 開発用ツール

> 💡 **詳細解説**: 開発用ツールの設定と推奨拡張機能は [Step01\_補足\_開発環境ガイド.md#vs-code 拡張機能の推奨設定](./Step01_補足_開発環境ガイド.md#vs-code拡張機能の推奨設定) を見てね 🐰

```bash
npm install -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
npm install -D prettier
npm install -D nodemon
```

#### 📝 tsconfig.json 設定（初心者向け）

> 💡 **詳細解説**: tsconfig.json の各オプションの詳細は [Step01\_補足\_設定ファイル解説.md#tsconfigjson 設定詳細](./Step01_補足_設定ファイル解説.md#tsconfigjson設定詳細) を見てね 🐰

```json
{
  "compilerOptions": {
    // 基本設定
    "target": "ES2020", // 出力するJavaScriptのバージョン
    "module": "commonjs", // モジュールシステム
    "lib": ["ES2020", "DOM"], // 使用可能なライブラリ
    "outDir": "./dist", // 出力ディレクトリ
    "rootDir": "./src", // ソースディレクトリ

    // 型チェック設定（段階的に厳しく）
    "strict": false, // Week1は緩い設定から開始
    "noImplicitAny": true, // any型の暗黙的使用を禁止
    "strictNullChecks": false, // Week2で有効化予定
    "strictFunctionTypes": false, // Week3で有効化予定

    // モジュール解決
    "moduleResolution": "node",
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "forceConsistentCasingInFileNames": true,

    // 開発支援
    "sourceMap": true, // デバッグ用ソースマップ
    "declaration": true, // 型定義ファイル生成
    "removeComments": false, // コメント保持
    "skipLibCheck": true // ライブラリの型チェックスキップ
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

#### 🎯 TypeScript の基本概念

##### 1. 型注釈の基本

```typescript
// JavaScript
let message = "Hello World";

// TypeScript
let message: string = "Hello World";
```

##### 2. 型推論の活用

```typescript
// 💡 詳細解説: 型推論 → [Step01_補足_専門用語集.md#型推論type-inference](./Step01_補足_専門用語集.md#型推論type-inference)
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

##### 4. 配列の型注釈

> 💡 **詳細解説**: 配列とタプルの詳細は [Step02\_基本型システムと型注釈.md](./Step02_基本型システムと型注釈.md) で学習するよ 🐰

```typescript
let numbers: number[] = [1, 2, 3, 4, 5];
let names: string[] = ["Alice", "Bob", "Charlie"];
let flags: boolean[] = [true, false, true];

// 代替記法
let scores: Array<number> = [85, 92, 78, 96];
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

### Section 3: 実践的な TypeScript 活用

#### 🔧 型安全なプログラミングの実践

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

##### 2. インターフェースの基礎

> 💡 **詳細解説**: インターフェースの詳細と応用例は [Step03\_インターフェースとオブジェクト型.md](./Step03_インターフェースとオブジェクト型.md) で学習するよ 🐰

```typescript
// インターフェースの定義
interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  inStock: boolean;
}

// インターフェースの使用
const laptop: Product = {
  id: 1,
  name: "MacBook Pro",
  price: 200000,
  category: "Electronics",
  inStock: true,
};

// オプショナルプロパティ
interface UserProfile {
  name: string;
  age: number;
  email: string;
  avatar?: string; // オプショナル
  bio?: string; // オプショナル
}

const profile: UserProfile = {
  name: "Bob",
  age: 25,
  email: "bob@example.com",
  // avatarとbioは省略可能
};

// メソッドを含むインターフェース
interface Calculator {
  add(a: number, b: number): number;
  subtract(a: number, b: number): number;
  multiply(a: number, b: number): number;
  divide(a: number, b: number): number;
}

const calc: Calculator = {
  add: (a, b) => a + b,
  subtract: (a, b) => a - b,
  multiply: (a, b) => a * b,
  divide: (a, b) => a / b,
};
```

##### 3. Union 型の基礎

> 💡 **詳細解説**: Union 型と型ガードについては [Step04\_ユニオン型と型ガード.md](./Step04_ユニオン型と型ガード.md) を見てね 🐰

```typescript
// 基本的なUnion型
type Status = "pending" | "approved" | "rejected";
type ID = string | number;

function processStatus(status: Status): string {
  switch (status) {
    case "pending":
      return "処理中です";
    case "approved":
      return "承認されました";
    case "rejected":
      return "拒否されました";
    default:
      return "不明なステータス";
  }
}

// Union型を使った柔軟な関数
function formatID(id: ID): string {
  if (typeof id === "string") {
    return `ID: ${id.toUpperCase()}`;
  } else {
    return `ID: ${id.toString().padStart(6, "0")}`;
  }
}

console.log(formatID("abc123")); // "ID: ABC123"
console.log(formatID(123)); // "ID: 000123"
```

##### 4. 実用的なアプリケーション例

> 💡 **詳細解説**: より実践的なコード例は [Step01\_補足\_実践コード例.md](./Step01_補足_実践コード例.md) で確認できるよ 🐰

```typescript
// タスク管理システムの例
type TaskStatus = "todo" | "in-progress" | "done";

interface Task {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  createdAt: Date;
  dueDate?: Date;
}

class TaskManager {
  private tasks: Task[] = [];
  private nextId: number = 1;

  addTask(title: string, description: string, dueDate?: Date): Task {
    const newTask: Task = {
      id: this.nextId++,
      title,
      description,
      status: "todo",
      createdAt: new Date(),
      dueDate,
    };

    this.tasks.push(newTask);
    return newTask;
  }

  updateTaskStatus(id: number, status: TaskStatus): boolean {
    const task = this.tasks.find((t) => t.id === id);
    if (task) {
      task.status = status;
      return true;
    }
    return false;
  }

  getTasksByStatus(status: TaskStatus): Task[] {
    return this.tasks.filter((task) => task.status === status);
  }

  getAllTasks(): Task[] {
    return [...this.tasks]; // イミュータブルなコピーを返す
  }
}

// 使用例
const taskManager = new TaskManager();
const task1 = taskManager.addTask("TypeScript学習", "基本的な型システムを学ぶ");
const task2 = taskManager.addTask("演習問題", "実践的なコードを書く");

taskManager.updateTaskStatus(task1.id, "in-progress");
console.log("進行中のタスク:", taskManager.getTasksByStatus("in-progress"));
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

<details>
<summary>💡 解答例を表示</summary>

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

</details>

### 演習 1-2: 配列とオブジェクトの型注釈 🔶

> 💡 **詳細解説**: より発展的な練習問題と解答例は [Step01\_補足\_実践コード例.md](./Step01_補足_実践コード例.md) を参考にしてね 🐰

```typescript
// 以下の要件を満たすTypeScriptコードを作成してください

// 1. 学生情報を管理するシステム
// 要件:
// - 学生は名前、年齢、成績（数値の配列）を持つ
// - 学生の平均点を計算する関数
// - 学生のリストから特定の条件で検索する関数
```

<details>
<summary>💡 解答例を表示</summary>

```typescript
// 解答例
type Student = {
  name: string;
  age: number;
  grades: number[];
};

function calculateAverage(grades: number[]): number {
  if (grades.length === 0) return 0;
  const sum = grades.reduce((acc, grade) => acc + grade, 0);
  return sum / grades.length;
}

function findStudentsByMinAge(students: Student[], minAge: number): Student[] {
  return students.filter((student) => student.age >= minAge);
}

function getTopStudent(students: Student[]): Student | null {
  if (students.length === 0) return null;

  return students.reduce((topStudent, currentStudent) => {
    const currentAvg = calculateAverage(currentStudent.grades);
    const topAvg = calculateAverage(topStudent.grades);
    return currentAvg > topAvg ? currentStudent : topStudent;
  });
}

// 使用例
const students: Student[] = [
  { name: "Alice", age: 20, grades: [85, 92, 78, 96] },
  { name: "Bob", age: 19, grades: [76, 84, 88, 92] },
  { name: "Charlie", age: 21, grades: [94, 89, 91, 87] },
];

console.log("平均点:", calculateAverage(students[0].grades));
console.log("20歳以上の学生:", findStudentsByMinAge(students, 20));
console.log("トップ学生:", getTopStudent(students));
```

</details>

### 演習 1-3: 実用的なアプリケーション作成 🔥

```typescript
// シンプルなタスク管理アプリケーションを作成してください
// 要件:
// 1. タスクの追加、完了、削除機能
// 2. タスクの一覧表示
// 3. 完了済みタスクのフィルタリング
```

<details>
<summary>💡 解答例を表示</summary>

```typescript
// 解答例
type Task = {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  createdAt: Date;
};

class TaskManager {
  private tasks: Task[] = [];
  private nextId: number = 1;

  addTask(title: string, description: string): Task {
    const newTask: Task = {
      id: this.nextId++,
      title: title,
      description: description,
      completed: false,
      createdAt: new Date(),
    };

    this.tasks.push(newTask);
    return newTask;
  }

  completeTask(id: number): boolean {
    const task = this.tasks.find((t) => t.id === id);
    if (task) {
      task.completed = true;
      return true;
    }
    return false;
  }

  deleteTask(id: number): boolean {
    const index = this.tasks.findIndex((t) => t.id === id);
    if (index !== -1) {
      this.tasks.splice(index, 1);
      return true;
    }
    return false;
  }

  getAllTasks(): Task[] {
    return [...this.tasks];
  }

  getCompletedTasks(): Task[] {
    return this.tasks.filter((task) => task.completed);
  }

  getPendingTasks(): Task[] {
    return this.tasks.filter((task) => !task.completed);
  }

  getTaskById(id: number): Task | null {
    return this.tasks.find((task) => task.id === id) || null;
  }
}

// 使用例
const taskManager = new TaskManager();

// タスク追加
taskManager.addTask("TypeScript学習", "Week1の内容を完了する");
taskManager.addTask("演習問題", "基本的な型注釈の練習");
taskManager.addTask("環境構築", "開発環境のセットアップ");

// タスク操作
taskManager.completeTask(1);
console.log("全タスク:", taskManager.getAllTasks());
console.log("完了済み:", taskManager.getCompletedTasks());
console.log("未完了:", taskManager.getPendingTasks());
```

</details>

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

### 成果物チェックリスト

> 💡 **成果物作成ガイド**: 以下の補足資料を参考に高品質な成果物を作成しましょう
>
> - 💻 [実践コード例](./Step01_補足_実践コード例.md) - 成果物作成の参考コード
> - 📖 [専門用語集](./Step01_補足_専門用語集.md) - 正確な型定義のための用語確認
> - 🚨 [トラブルシューティング](./Step01_補足_トラブルシューティング.md) - 開発中のエラー解決

- [ ] **学生管理システム**: 型安全な CRUD アプリケーション → [実践コード例: 学生管理システム](./Step01_補足_実践コード例.md#より実践的な例)を参考

## 🔄 Step 2 への準備

> 💡 **詳細解説**: 次のステップでの学習内容について [Step02\_基本型システムと型注釈.md](./Step02_基本型システムと型注釈.md) の概要を先に確認しておくとスムーズに学習を進められるよ 🐰

### 次週学習内容の予習

```typescript
// Step 2で学習する内容の基礎概念
// 以下のコードを読んで理解しておくこと

// 1. より詳細な型システム
let value: string | number = "hello"; // Union型
value = 42; // OK

// 2. オプショナルプロパティ
interface User {
  name: string;
  age?: number; // オプショナル
}

// 3. 型エイリアス
type ID = string | number;
type UserRole = "admin" | "user" | "guest";

// 4. 関数オーバーロード
function format(value: string): string;
function format(value: number): string;
function format(value: string | number): string {
  return String(value);
}
```

### 環境準備

- [ ] VS Code TypeScript 拡張機能の設定
- [ ] ESLint 設定の確認
- [ ] Prettier 設定の確認
- [ ] Git リポジトリの初期化

### 学習継続のコツ

1. **毎日コードを書く**: 理論だけでなく実際にコードを書く
2. **エラーを恐れない**: エラーメッセージから学ぶ
3. **段階的学習**: 基本から応用へ順序立てて学習
4. **小さく始める**: 複雑な機能より基本の確実な理解

---

**📌 重要**: Step 1 は TypeScript の基礎固めの重要な期間です。JavaScript の基本をしっかり復習し、TypeScript の型システムの恩恵を実感できるようになります。焦らず確実に基礎を身につけましょう。

**🌟 次週は、より詳細な型システムと実践的な型注釈について学習します！**
