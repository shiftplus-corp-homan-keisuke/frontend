# Week01 補足資料 - JavaScript復習とTypeScript導入

## 📋 目次
1. [専門用語集](#専門用語集)
2. [開発環境ガイド](#開発環境ガイド)
3. [設定ファイル解説](#設定ファイル解説)
4. [実践コード例](#実践コード例)
5. [トラブルシューティング](#トラブルシューティング)
6. [参考リソース](#参考リソース)

---

## 1. 専門用語集

### プロトタイプベースオブジェクト指向
**定義**: オブジェクトが他のオブジェクトを直接継承する仕組み

**他言語との比較**:
- **Java/C#**: クラスベース（設計図から作成）
- **JavaScript**: プロトタイプベース（既存オブジェクトから作成）

**コード例**:
```javascript
// プロトタイプベースの例
function Person(name) {
  this.name = name;
}
Person.prototype.greet = function() {
  return `Hello, I'm ${this.name}`;
};

const person = new Person("Alice");
console.log(person.greet()); // "Hello, I'm Alice"

// プロトタイプチェーンの確認
console.log(person.__proto__ === Person.prototype); // true
```

**なぜ重要か**: JavaScriptの継承システムを理解することで、オブジェクトの動作原理が分かります。

**参考リンク**: 
- [MDN - Object prototypes](https://developer.mozilla.org/ja/docs/Learn/JavaScript/Objects/Object_prototypes)

### 高階関数
**定義**: 関数を引数として受け取るか、関数を戻り値として返す関数

**具体例**: map, filter, reduce
```javascript
const numbers = [1, 2, 3, 4, 5];

// map: 配列の各要素を変換
const doubled = numbers.map(n => n * 2); // [2, 4, 6, 8, 10]

// filter: 条件に合う要素を抽出
const evens = numbers.filter(n => n % 2 === 0); // [2, 4]

// reduce: 配列を単一の値に集約
const sum = numbers.reduce((acc, n) => acc + n, 0); // 15

// 高階関数の自作例
function createMultiplier(factor) {
  return function(number) {
    return number * factor;
  };
}

const double = createMultiplier(2);
console.log(double(5)); // 10
```

**実用場面**: データの変換、フィルタリング、集計処理で頻繁に使用

**参考リンク**: 
- [MDN - 高階関数](https://developer.mozilla.org/ja/docs/Glossary/Higher-order_function)

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
    getCount: () => count
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
  contact: { email: "bob@example.com" }
};

const { personal: { name: personName }, contact: { email } } = userProfile;
console.log(personName); // "Bob"
```

**実用場面**: 関数の引数、APIレスポンスの処理、モジュールのインポート

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
const message1 = "Hello, my name is " + name + " and I'm " + age + " years old.";

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
const greeting = `Hello, ${user.name}${user.isAdmin ? ' (Admin)' : ''}`;
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
  .then(result => {
    console.log(result); // "処理が成功しました"
  })
  .catch(error => {
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
          email: "alice@example.com"
        });
      } else {
        reject(new Error("Invalid user ID"));
      }
    }, 500);
  });
}

// 複数のPromiseを並列実行
Promise.all([
  fetchUserData(1),
  fetchUserData(2),
  fetchUserData(3)
])
.then(users => {
  console.log("All users:", users);
})
.catch(error => {
  console.error("Error:", error);
});
```

### async/await
**定義**: Promiseをより読みやすく書くための構文糖衣

**基本的な使用**:
```javascript
// Promiseを使った書き方
function fetchDataWithPromise() {
  return fetch('/api/data')
    .then(response => response.json())
    .then(data => {
      console.log(data);
      return data;
    })
    .catch(error => {
      console.error(error);
      throw error;
    });
}

// async/awaitを使った書き方
async function fetchDataWithAsync() {
  try {
    const response = await fetch('/api/data');
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
```

### 型注釈（Type Annotation）
**定義**: TypeScriptで変数や関数の型を明示的に指定すること

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
  email: "alice@example.com"
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

**なぜ重要か**: コンパイル時にエラーを検出、IDEの支援機能向上、コードの自己文書化

### 型推論（Type Inference）
**定義**: TypeScriptが自動的に型を推測する機能

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
  age: 30
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

## 2. 開発環境ガイド

### Node.js LTS版について
**LTS (Long Term Support)**: 長期サポート版
- **安定性重視**: 本番環境での使用に適している
- **サポート期間**: 約30ヶ月間のサポート
- **バージョン**: 偶数バージョン（18.x, 20.x など）

**インストール方法**:
1. [Node.js公式サイト](https://nodejs.org/)にアクセス
2. LTSバージョンをダウンロード
3. インストーラーを実行
4. インストール確認: `node --version`

**バージョン管理ツール**:
```bash
# nvm (Node Version Manager) の使用
# インストール
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# 使用可能なバージョン確認
nvm list-remote

# LTS版のインストール
nvm install --lts

# バージョン切り替え
nvm use 18.17.0
```

### パッケージマネージャーの比較

#### npm (Node Package Manager)
```bash
# プロジェクト初期化
npm init -y

# パッケージインストール
npm install typescript
npm install -D @types/node

# スクリプト実行
npm run build
npm start
```

#### yarn
```bash
# プロジェクト初期化
yarn init -y

# パッケージインストール
yarn add typescript
yarn add -D @types/node

# スクリプト実行
yarn build
yarn start
```

#### pnpm
```bash
# プロジェクト初期化
pnpm init

# パッケージインストール
pnpm add typescript
pnpm add -D @types/node

# スクリプト実行
pnpm build
pnpm start
```

**選択の指針**:
- **npm**: 標準、最も広く使用されている
- **yarn**: 高速、yarn.lockファイル
- **pnpm**: 最も高速、ディスク容量節約

### VS Code拡張機能の推奨設定

**必須拡張機能**:
1. **TypeScript Importer**: 自動インポート
2. **ESLint**: コード品質チェック
3. **Prettier**: コードフォーマット
4. **TypeScript Hero**: TypeScript支援

**settings.json設定例**:
```json
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "typescript.suggest.autoImports": true,
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.updateImportsOnFileMove.enabled": "always"
}
```

### ターミナル/コマンドプロンプトの基本操作

**基本コマンド**:
```bash
# ディレクトリ移動
cd typescript-learning
cd ..  # 親ディレクトリに移動
cd ~   # ホームディレクトリに移動

# ディレクトリ作成
mkdir src
mkdir -p src/components  # 親ディレクトリも同時作成

# ファイル作成
touch index.ts  # Unix/Mac
echo. > index.ts  # Windows

# ファイル・ディレクトリ一覧
ls     # Unix/Mac
dir    # Windows
ls -la # 詳細表示

# ファイル削除
rm index.ts      # Unix/Mac
del index.ts     # Windows

# ディレクトリ削除
rm -rf node_modules  # Unix/Mac
rmdir /s node_modules  # Windows
---

## 3. 設定ファイル解説

### tsconfig.json詳細解説

#### 基本設定オプション

**target**:
```json
"target": "ES2020"
```
- **意味**: 出力するJavaScriptのバージョン
- **選択肢**: ES5, ES2015, ES2017, ES2018, ES2019, ES2020, ES2021, ES2022, ESNext
- **推奨**: ES2020（モダンブラウザ対応）

**module**:
```json
"module": "commonjs"
```
- **意味**: モジュールシステム
- **選択肢**: commonjs, amd, es6, es2015, es2020, esnext, node16, nodenext
- **推奨**: commonjs（Node.js）、es2020（ブラウザ）

**lib**:
```json
"lib": ["ES2020", "DOM"]
```
- **意味**: 使用可能なライブラリ
- **選択肢**: ES5, ES2015, ES2017, ES2018, ES2019, ES2020, DOM, WebWorker
- **推奨**: ES2020 + DOM（Webアプリ）

#### 型チェック設定

**strict**:
```json
"strict": true
```
- **意味**: 厳密な型チェックを有効化
- **含まれる設定**: noImplicitAny, strictNullChecks, strictFunctionTypes等
- **推奨**: true（段階的に有効化）

**noImplicitAny**:
```json
"noImplicitAny": true
```
- **意味**: any型の暗黙的使用を禁止
- **効果**: 型注釈の強制、型安全性向上

**strictNullChecks**:
```json
"strictNullChecks": true
```
- **意味**: null/undefinedの厳密チェック
- **効果**: null/undefinedエラーの防止

#### 出力設定

**outDir**:
```json
"outDir": "./dist"
```
- **意味**: 出力ディレクトリ
- **推奨**: ./dist, ./build

**rootDir**:
```json
"rootDir": "./src"
```
- **意味**: ソースディレクトリ
- **推奨**: ./src

**sourceMap**:
```json
"sourceMap": true
```
- **意味**: デバッグ用ソースマップ生成
- **推奨**: 開発時はtrue

#### プロジェクトタイプ別推奨設定

**Node.jsプロジェクト**:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

**Webアプリプロジェクト**:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "es2020",
    "lib": ["ES2020", "DOM"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "moduleResolution": "node",
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true
  }
}
```

### package.json設定

**基本構造**:
```json
{
  "name": "typescript-learning",
  "version": "1.0.0",
  "description": "TypeScript学習プロジェクト",
  "main": "dist/index.js",
  "scripts": {
    "build": "tsc",
    "build:watch": "tsc --watch",
    "start": "node dist/index.js",
    "dev": "ts-node src/index.ts",
    "clean": "rm -rf dist",
    "lint": "eslint src/**/*.ts",
    "lint:fix": "eslint src/**/*.ts --fix",
    "format": "prettier --write src/**/*.ts"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "@types/node": "^20.0.0",
    "ts-node": "^10.9.0",
    "eslint": "^8.0.0",
    "@typescript-eslint/parser": "^6.0.0",
    "@typescript-eslint/eslint-plugin": "^6.0.0",
    "prettier": "^3.0.0"
  }
}
```

---

## 4. 実践コード例

### Hello World から始める段階的学習

#### ステップ1: 最初のTypeScriptファイル
```typescript
// hello.ts
function greet(name: string): string {
  return `Hello, ${name}!`;
}

console.log(greet("TypeScript"));
```

**実行方法**:
```bash
# コンパイル
npx tsc hello.ts

# 実行
node hello.js
```

#### ステップ2: 型注釈の練習
```typescript
// types-practice.ts

// 基本型
let userName: string = "Alice";
let userAge: number = 30;
let isActive: boolean = true;

// 配列
let numbers: number[] = [1, 2, 3, 4, 5];
let names: string[] = ["Alice", "Bob", "Charlie"];

// オブジェクト
let user: {
  name: string;
  age: number;
  email: string;
} = {
  name: "Alice",
  age: 30,
  email: "alice@example.com"
};

// 関数
function calculateArea(width: number, height: number): number {
  return width * height;
}

function logMessage(message: string): void {
  console.log(message);
}

// 使用例
console.log(`User: ${user.name}, Age: ${user.age}`);
console.log(`Area: ${calculateArea(10, 20)}`);
logMessage("TypeScript is great!");
```

#### ステップ3: より実践的な例
```typescript
// student-manager.ts

// 型定義
type Student = {
  id: number;
  name: string;
  age: number;
  grades: number[];
};

// 学生管理クラス
class StudentManager {
  private students: Student[] = [];
  private nextId: number = 1;

  addStudent(name: string, age: number): Student {
    const newStudent: Student = {
      id: this.nextId++,
      name,
      age,
      grades: []
    };
    
    this.students.push(newStudent);
    return newStudent;
  }

  addGrade(studentId: number, grade: number): boolean {
    const student = this.students.find(s => s.id === studentId);
    if (student) {
      student.grades.push(grade);
      return true;
    }
    return false;
  }

  getAverage(studentId: number): number {
    const student = this.students.find(s => s.id === studentId);
    if (student && student.grades.length > 0) {
      const sum = student.grades.reduce((acc, grade) => acc + grade, 0);
      return sum / student.grades.length;
    }
    return 0;
  }

  getAllStudents(): Student[] {
    return [...this.students];
  }
}

// 使用例
const manager = new StudentManager();
const alice = manager.addStudent("Alice", 20);
const bob = manager.addStudent("Bob", 19);

manager.addGrade(alice.id, 85);
manager.addGrade(alice.id, 92);
manager.addGrade(bob.id, 78);

console.log(`Alice's average: ${manager.getAverage(alice.id)}`);
console.log("All students:", manager.getAllStudents());
```

---

## 5. トラブルシューティング

### よくあるエラーと解決方法

#### "tsc: command not found"
**原因**: TypeScriptがインストールされていない
**解決方法**:
```bash
# グローバルインストール
npm install -g typescript

# または、プロジェクト内でnpxを使用
npx tsc --version
```

#### "Cannot find module '@types/node'"
**原因**: Node.jsの型定義がインストールされていない
**解決方法**:
```bash
npm install -D @types/node
```

#### "Property 'xxx' does not exist on type 'yyy'"
**原因**: 型定義が正しくない、またはプロパティが存在しない
**解決方法**:
```typescript
// 型アサーションを使用（注意して使用）
const obj = someValue as SomeType;

// または、型ガードを使用
if ('property' in obj) {
  console.log(obj.property);
}

// または、オプショナルチェーンを使用
console.log(obj?.property);
```

#### "Argument of type 'string' is not assignable to parameter of type 'number'"
**原因**: 型が一致しない
**解決方法**:
```typescript
// 型変換を行う
const stringValue = "123";
const numberValue = parseInt(stringValue, 10);

// または、型ガードを使用
function isNumber(value: string | number): value is number {
  return typeof value === 'number';
}
```

#### コンパイルエラーの読み方
```
error TS2322: Type 'string' is not assignable to type 'number'.
```
- **TS2322**: エラーコード
- **Type 'string' is not assignable to type 'number'**: エラーメッセージ
- 型の不一致を示している

### 環境構築でよくある問題

#### Node.jsのバージョン問題
**症状**: 古いNode.jsバージョンでTypeScriptが動作しない
**解決方法**:
```bash
# Node.jsバージョン確認
node --version

# LTS版にアップデート
# nvmを使用している場合
nvm install --lts
nvm use --lts
```

#### パッケージインストールの問題
**症状**: npm installでエラーが発生
**解決方法**:
```bash
# キャッシュクリア
npm cache clean --force

# node_modulesとpackage-lock.jsonを削除して再インストール
rm -rf node_modules package-lock.json
npm install

# 権限問題の場合（Mac/Linux）
sudo npm install -g typescript
```

---

## 6. 参考リソース

### 公式ドキュメント
- [TypeScript Handbook](https://www.typescriptlang.org/docs/) - 公式ハンドブック
- [TypeScript Playground](https://www.typescriptlang.org/play) - オンライン実行環境
- [MDN JavaScript](https://developer.mozilla.org/ja/docs/Web/JavaScript) - JavaScript公式ドキュメント
- [Node.js Documentation](https://nodejs.org/docs/) - Node.js公式ドキュメント

### 学習サイト
- [TypeScript Deep Dive](https://basarat.gitbook.io/typescript/) - 詳細な解説書
- [TypeScript Tutorial](https://www.typescripttutorial.net/) - 初心者向けチュートリアル
- [Execute Program](https://www.executeprogram.com/) - インタラクティブ学習

### オンラインツール
- [TypeScript Playground](https://www.typescriptlang.org/play) - コード実行・共有
- [AST Explorer](https://astexplorer.net/) - AST（抽象構文木）の確認
- [TypeScript AST Viewer](https://ts-ast-viewer.com/) - TypeScript専用AST確認
- [Can I Use](https://caniuse.com/) - ブラウザ対応状況確認

### 便利なライブラリ・ツール
- [ts-node](https://github.com/TypeStrong/ts-node) - TypeScriptの直接実行
- [nodemon](https://nodemon.io/) - ファイル変更の自動検知・再起動
- [concurrently](https://github.com/open-cli-tools/concurrently) - 複数コマンドの並列実行
- [cross-env](https://github.com/kentcdodds/cross-env) - クロスプラットフォーム環境変数設定

### コミュニティ・質問サイト
- [Stack Overflow - TypeScript](https://stackoverflow.com/questions/tagged/typescript) - 質問・回答サイト
- [TypeScript GitHub](https://github.com/microsoft/TypeScript) - 公式リポジトリ
- [Reddit - TypeScript](https://www.reddit.com/r/typescript/) - コミュニティ
- [Discord - TypeScript Community](https://discord.gg/typescript) - リアルタイムチャット

### 推奨書籍
- 「プログラミングTypeScript」- Boris Cherny著
- 「実践TypeScript」- 吉井健文著
- 「TypeScript実践プログラミング」- 今村謙士著

### YouTube チャンネル
- [TypeScript公式チャンネル](https://www.youtube.com/c/TypeScriptTV)
- [Traversy Media](https://www.youtube.com/c/TraversyMedia) - Web開発全般
- [The Net Ninja](https://www.youtube.com/c/TheNetNinja) - TypeScriptチュートリアル

---

## 📝 まとめ

この補足資料では、Week01で出てくる専門用語や概念について詳しく解説しました。

**重要なポイント**:
1. **専門用語の理解**: プロトタイプベース、高階関数、クロージャなどの概念をしっかり理解する
2. **開発環境の構築**: Node.js LTS版、適切なパッケージマネージャーの選択
3. **設定ファイルの理解**: tsconfig.jsonの各オプションの意味と使い分け
4. **段階的な学習**: Hello Worldから始めて徐々に複雑なコードに挑戦
5. **トラブルシューティング**: よくあるエラーの原因と解決方法を把握

**学習のコツ**:
- 分からない用語が出てきたら、この補足資料を参照する
- 実際にコードを書いて動作を確認する
- エラーが出ても慌てず、エラーメッセージを読んで原因を特定する
- 公式ドキュメントや参考リソースを活用する

この補足資料を活用して、Week01の学習を効果的に進めてください！