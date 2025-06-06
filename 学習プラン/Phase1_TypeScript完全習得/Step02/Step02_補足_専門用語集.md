# Step02 専門用語集

> 💡 **このファイルについて**: Step02で出てくる型システム関連の重要な専門用語と概念の詳細解説集です。

## 📋 目次
1. [型システム関連用語](#型システム関連用語)
2. [型推論関連用語](#型推論関連用語)
3. [配列・タプル関連用語](#配列・タプル関連用語)
4. [関数型関連用語](#関数型関連用語)
5. [オブジェクト・インターフェース関連用語](#オブジェクトインターフェース関連用語)
6. [型定義関連用語](#型定義関連用語)
7. [統計・分析関連用語](#統計分析関連用語)
8. [API・サービス関連用語](#APIサービス関連用語)

---

## 型システム関連用語

### プリミティブ型（Primitive Types）
**定義**: TypeScriptに組み込まれている最も基本的なデータ型で、単一の値を表現します。これらはオブジェクトではなく、それ自体が値です。

**種類と特徴**:
```typescript
// 1. string型 - 文字列
let message: string = "Hello";
let template: string = `Hello ${message}`;

// 2. number型 - 数値（整数・浮動小数点）
let age: number = 25;
let price: number = 99.99;
let binary: number = 0b1010; // 2進数
let hex: number = 0xff; // 16進数

// 3. boolean型 - 真偽値
let isActive: boolean = true;

// 4. null型 - 意図的な空値
let nullValue: null = null;

// 5. undefined型 - 未定義値
let undefinedValue: undefined = undefined;

// 6. symbol型 - 一意識別子
let sym: symbol = Symbol("key");

// 7. bigint型 - 大きな整数
let bigNumber: bigint = 123n;
```

**他言語との比較**:
- **Java**: String, int, double, boolean, null
- **C#**: string, int, double, bool, null
- **Python**: str, int, float, bool, None
- **Go**: string, int, float64, bool, nil

### リテラル型（Literal Types）
**定義**: 特定のプリミティブ値（文字列、数値、真偽値）そのものを型として定義する機能です。これにより、変数が取りうる値を厳密に制限し、より具体的な型安全性を実現します。

**コード例**:
```typescript
// 文字列リテラル型
let status: "pending" | "approved" | "rejected" = "pending";

// 数値リテラル型
let diceRoll: 1 | 2 | 3 | 4 | 5 | 6 = 3;

// 真偽値リテラル型
let isTrue: true = true; // falseは代入不可

// オブジェクトリテラル型
let config: { readonly mode: "development" } = {
  mode: "development"
};
```

**実用場面**: 設定値、ステータス、フラグなどの限定された値の表現

### ユニオン型（Union Types）
**定義**: 複数の型を`|`（パイプ）で結合し、そのいずれかの型を持つ値を許可する型です。これにより、柔軟性を保ちつつ、変数が取りうる値の範囲を型システムで表現できます。

**コード例**:
```typescript
// 基本的なユニオン型
let value: string | number = "hello";
value = 42; // OK

// 複雑なユニオン型
let result: string | number | boolean = true;

// オブジェクトのユニオン型
type User = {
  type: "user";
  name: string;
} | {
  type: "admin";
  name: string;
  permissions: string[];
};

// 関数の引数でのユニオン型
function processId(id: string | number): string {
  return String(id);
}
```

**なぜ重要か**: 柔軟性と型安全性のバランスを取る重要な機能

### インターセクション型（Intersection Types）
**定義**: 複数の型を`&`（アンパサンド）で結合し、それら全ての型のプロパティを結合した新しい型を作成する機能です。これにより、既存の型を拡張したり、複数の特性を組み合わせた型を定義できます。

**コード例**:
```typescript
type Name = { name: string };
type Age = { age: number };

// インターセクション型
type Person = Name & Age;

const person: Person = {
  name: "Alice",
  age: 30
}; // 両方のプロパティが必要

// 関数型のインターセクション
type Logger = (message: string) => void;
type Counter = { count: number };

type LoggerWithCounter = Logger & Counter;
```

### 型エイリアス（Type Aliases）
**定義**: `type`キーワードを使用して、既存の型（プリミティブ型、ユニオン型、インターセクション型、オブジェクト型、関数型など）に別名を与える機能です。これにより、複雑な型定義に分かりやすい名前を付け、コードの可読性と再利用性を向上させます。

**コード例**:
```typescript
// 基本的な型エイリアス
type UserID = string;
type UserAge = number;

// 複雑な型エイリアス
type User = {
  id: UserID;
  name: string;
  age: UserAge;
};

// ユニオン型のエイリアス
type Status = "loading" | "success" | "error";

// 関数型のエイリアス
type EventHandler = (event: Event) => void;

// ジェネリック型エイリアス
type ApiResponse<T> = {
  data: T;
  status: number;
  message: string;
};
```

---

## 型推論関連用語

### 型推論（Type Inference）
**定義**: 変数宣言時や関数呼び出し時など、開発者が明示的に型注釈を記述しなくても、TypeScriptコンパイラがコードの文脈から自動的に型を判断する機能です。これにより、冗長な型記述を減らし、開発効率を高めます。

**推論の種類**:
```typescript
// 1. 基本的な型推論
let message = "Hello"; // string型として推論
let count = 42; // number型として推論

// 2. 最適共通型（Best Common Type）
let mixed = [1, "hello", true]; // (string | number | boolean)[]

// 3. 文脈的型推論（Contextual Typing）
window.addEventListener("click", function(event) {
  // eventは自動的にMouseEvent型として推論
  console.log(event.clientX);
});

// 4. 戻り値型推論
function add(a: number, b: number) {
  return a + b; // number型として推論
}

// 5. 条件分岐での型推論（Type Narrowing）
function processValue(value: string | number) {
  if (typeof value === "string") {
    // この分岐内ではvalueはstring型
    return value.toUpperCase();
  }
  // この分岐内ではvalueはnumber型
  return value.toFixed(2);
}
```

### 型の絞り込み（Type Narrowing）
**定義**: `if`文や`switch`文などの条件分岐、または特定の演算子（`typeof`, `instanceof`, `in`など）を使用することで、TypeScriptコンパイラがコードの特定のブロック内で変数の型をより具体的な型に絞り込む機能です。これにより、実行時の型チェックをコンパイル時に行い、型安全性を高めます。

**手法**:
```typescript
// 1. typeof ガード
function processValue(value: string | number) {
  if (typeof value === "string") {
    // string型として扱われる
    return value.length;
  }
  // number型として扱われる
  return value * 2;
}

// 2. instanceof ガード
function processError(error: Error | string) {
  if (error instanceof Error) {
    // Error型として扱われる
    return error.message;
  }
  // string型として扱われる
  return error;
}

// 3. in演算子ガード
type Fish = { swim: () => void };
type Bird = { fly: () => void };

function move(animal: Fish | Bird) {
  if ("swim" in animal) {
    // Fish型として扱われる
    animal.swim();
  } else {
    // Bird型として扱われる
    animal.fly();
  }
}

// 4. カスタム型ガード
function isString(value: unknown): value is string {
  return typeof value === "string";
}

function processUnknown(value: unknown) {
  if (isString(value)) {
    // string型として扱われる
    return value.toUpperCase();
  }
}
```

### 型アサーション（Type Assertion）
**定義**: 開発者がTypeScriptコンパイラに対し、ある値が特定の型であると「主張」する機能です。コンパイラは開発者の主張を信頼し、その型として扱います。これは、コンパイラが型を推測できない場合や、開発者がコンパイラよりも型について詳しい場合に利用されますが、誤用すると型安全性を損なう可能性があります。

**コード例**:
```typescript
// 1. as構文
let someValue: unknown = "hello world";
let strLength: number = (someValue as string).length;

// 2. <型>構文（JSXでは使用不可）
let strLength2: number = (<string>someValue).length;

// 3. 非null アサーション演算子（!）
function processElement(element: HTMLElement | null) {
  // elementがnullでないことを保証
  element!.style.color = "red";
}

// 4. const アサーション
let colors = ["red", "green", "blue"] as const;
// readonly ["red", "green", "blue"] 型

let config = {
  apiUrl: "https://api.example.com",
  timeout: 5000
} as const;
// readonly プロパティを持つ型
```

**注意点**: 型アサーションは型安全性を損なう可能性があるため、慎重に使用する

---

## 配列・タプル関連用語

### 配列型（Array Types）
**定義**: 複数の要素を順序付けて格納するデータ構造である配列の型を定義する機能です。TypeScriptでは、配列内の全ての要素が同じ型を持つことを強制することで、配列操作における型安全性を保証します。

**記法**:
```typescript
// 1. 基本記法
let numbers: number[] = [1, 2, 3];
let strings: string[] = ["a", "b", "c"];

// 2. ジェネリック記法
let scores: Array<number> = [85, 92, 78];
let names: Array<string> = ["Alice", "Bob"];

// 3. 多次元配列
let matrix: number[][] = [[1, 2], [3, 4]];
let cube: Array<Array<number>> = [[1, 2], [3, 4]];

// 4. 読み取り専用配列
let readonlyNumbers: readonly number[] = [1, 2, 3];
let readonlyStrings: ReadonlyArray<string> = ["a", "b"];
```

### タプル型（Tuple Types）
**定義**: 要素の数（長さ）が固定されており、かつ各要素が異なる型を持つことができる特殊な配列の型です。要素の順序と型が厳密に定義されるため、特定の構造を持つデータの表現に適しています。

**特徴と使用例**:
```typescript
// 1. 基本的なタプル
let coordinate: [number, number] = [10, 20];
let person: [string, number, boolean] = ["Alice", 30, true];

// 2. 名前付きタプル（TypeScript 4.0+）
let namedCoordinate: [x: number, y: number] = [10, 20];

// 3. オプショナル要素
let optionalTuple: [string, number?] = ["hello"];

// 4. 残余要素
let restTuple: [string, ...number[]] = ["prefix", 1, 2, 3];

// 5. 読み取り専用タプル
let readonlyTuple: readonly [string, number] = ["hello", 42];

// 6. 分割代入
let [name, age] = person;
let [x, y] = coordinate;
```

**配列との違い**:
- **配列**: 可変長、同じ型の要素
- **タプル**: 固定長、各位置で型が決まっている

### 読み取り専用型（Readonly Types）
**定義**: 一度値が代入された後に、そのプロパティや要素の変更が許可されない型です。データの不変性を保証することで、予期せぬ変更によるバグを防ぎ、コードの信頼性と予測可能性を高めます。

**コード例**:
```typescript
// 1. 読み取り専用配列
let readonlyArray: readonly number[] = [1, 2, 3];
// readonlyArray.push(4); // Error

// 2. ReadonlyArrayユーティリティ型
let readonlyArray2: ReadonlyArray<string> = ["a", "b"];

// 3. 読み取り専用オブジェクト
let readonlyObject: Readonly<{ name: string; age: number }> = {
  name: "Alice",
  age: 30
};
// readonlyObject.name = "Bob"; // Error

// 4. 読み取り専用タプル
let readonlyTuple: readonly [string, number] = ["hello", 42];
// readonlyTuple[0] = "world"; // Error
```

---

## 関数型関連用語

### 関数型（Function Types）
**定義**: 関数の引数の型と戻り値の型を定義することで、関数がどのような入力を受け取り、どのような出力を返すかを明示的に示す方法です。これにより、関数呼び出し時の型安全性を保証し、コードの意図を明確にします。

**記法**:
```typescript
// 1. 関数宣言の型注釈
function greet(name: string): string {
  return `Hello, ${name}!`;
}

// 2. 関数式の型注釈
const add = (a: number, b: number): number => a + b;

// 3. 関数型の変数
let calculator: (a: number, b: number) => number;
calculator = add;

// 4. 関数型エイリアス
type MathOperation = (a: number, b: number) => number;
let multiply: MathOperation = (a, b) => a * b;

// 5. オブジェクトのメソッド型
type Calculator = {
  add: (a: number, b: number) => number;
  subtract: (a: number, b: number) => number;
};
```

### オプショナルパラメータ（Optional Parameters）
**定義**: 関数を呼び出す際に、その引数を渡すことを省略できる機能です。引数名の後ろに`?`を付けることで定義され、呼び出し元に柔軟性を提供します。

**コード例**:
```typescript
// 1. 基本的なオプショナルパラメータ
function createUser(name: string, age?: number): object {
  return {
    name,
    age: age || 0
  };
}

// 2. 複数のオプショナルパラメータ
function greet(name: string, greeting?: string, punctuation?: string): string {
  return `${greeting || "Hello"}, ${name}${punctuation || "!"}`;
}

// 3. オプショナルパラメータの順序
// オプショナルパラメータは必須パラメータの後に配置
function processData(data: string, options?: { format: boolean }): string {
  if (options?.format) {
    return data.toUpperCase();
  }
  return data;
}
```

### デフォルトパラメータ（Default Parameters）
**定義**: 関数を呼び出す際に引数が渡されなかった場合に、あらかじめ設定された初期値が自動的に使用される引数です。これにより、関数の呼び出しをより簡潔にし、引数の欠落によるエラーを防ぎます。

**コード例**:
```typescript
// 1. 基本的なデフォルトパラメータ
function greet(name: string, greeting: string = "Hello"): string {
  return `${greeting}, ${name}!`;
}

// 2. 複雑なデフォルト値
function createConfig(
  host: string = "localhost",
  port: number = 3000,
  ssl: boolean = false
): object {
  return { host, port, ssl };
}

// 3. オブジェクトのデフォルト値
function processOptions(
  options: { timeout?: number; retries?: number } = {}
): void {
  const { timeout = 5000, retries = 3 } = options;
  console.log(`Timeout: ${timeout}, Retries: ${retries}`);
}
```

### 残余パラメータ（Rest Parameters）
**定義**: 関数が不定数の引数を配列として受け取ることを可能にする機能です。引数名の前に`...`（スプレッド構文）を付けることで定義され、引数の数が事前に決まっていない場合に柔軟な関数設計を可能にします。

**コード例**:
```typescript
// 1. 基本的な残余パラメータ
function sum(...numbers: number[]): number {
  return numbers.reduce((total, num) => total + num, 0);
}

// 2. 混合パラメータ
function logMessage(level: string, ...messages: string[]): void {
  console.log(`[${level}]`, ...messages);
}

// 3. タプルでの残余パラメータ
function processData(
  first: string,
  ...rest: [number, boolean]
): void {
  console.log(first, rest[0], rest[1]);
}

// 4. 関数型での残余パラメータ
type Logger = (message: string, ...args: unknown[]) => void;
```

### 関数オーバーロード（Function Overloads）
**定義**: 同じ関数名に対して、引数の型や数、戻り値の型が異なる複数の関数シグネチャ（宣言）を定義し、それらを単一の実装関数で処理する機能です。これにより、関数の利用者が異なる引数の組み合わせで関数を呼び出せるようになり、柔軟なAPI設計が可能になります。

**コード例**:
```typescript
// 1. 基本的なオーバーロード
function format(value: string): string;
function format(value: number): string;
function format(value: boolean): string;
function format(value: string | number | boolean): string {
  return String(value);
}

// 2. より複雑なオーバーロード
function createElement(tag: "div"): HTMLDivElement;
function createElement(tag: "span"): HTMLSpanElement;
function createElement(tag: "input"): HTMLInputElement;
function createElement(tag: string): HTMLElement {
  return document.createElement(tag);
}

// 3. 条件付きオーバーロード
function processArray(arr: string[]): string[];
function processArray(arr: number[]): number[];
function processArray(arr: (string | number)[]): (string | number)[] {
  return arr.map(item => item);
}
```

### 高階関数（Higher-Order Functions）
**定義**: 関数型プログラミングの重要な概念の一つで、関数をデータとして扱い、他の関数に渡したり、他の関数から返したりする関数です。これにより、コードの再利用性、抽象化、柔軟性が向上します。

**コード例**:
```typescript
// 1. 関数を引数として受け取る
function applyOperation(
  numbers: number[],
  operation: (num: number) => number
): number[] {
  return numbers.map(operation);
}

const doubled = applyOperation([1, 2, 3], x => x * 2);

// 2. 関数を戻り値として返す
function createMultiplier(factor: number): (num: number) => number {
  return (num: number) => num * factor;
}

const double = createMultiplier(2);
const triple = createMultiplier(3);

// 3. 複雑な高階関数
function createValidator<T>(
  predicate: (value: T) => boolean
): (value: T) => { isValid: boolean; value: T } {
  return (value: T) => ({
    isValid: predicate(value),
    value
  });
}

const isPositive = createValidator<number>(x => x > 0);
```

---

## 📚 参考リンク

- [TypeScript Handbook - Basic Types](https://www.typescriptlang.org/docs/handbook/basic-types.html)
- [TypeScript Handbook - Type Inference](https://www.typescriptlang.org/docs/handbook/type-inference.html)
- [TypeScript Handbook - Functions](https://www.typescriptlang.org/docs/handbook/functions.html)
---

## オブジェクト・インターフェース関連用語

### インターフェース（Interface）
**定義**: オブジェクトが持つべきプロパティとその型、およびメソッドのシグネチャを定義するための強力な機能です。TypeScriptの構造的型付け（Structural Typing）の核心であり、クラスが特定の構造を満たすことを強制したり、異なるオブジェクト間の互換性を定義したりする「契約」として機能します。

**基本的な使用例**:
```typescript
// 基本的なインターフェース
interface User {
  id: number;
  name: string;
  email: string;
}

// インターフェースを使用した変数宣言
const user: User = {
  id: 1,
  name: "Alice",
  email: "alice@example.com"
};

// 関数の引数としてインターフェースを使用
function greetUser(user: User): string {
  return `Hello, ${user.name}!`;
}
```

**他言語との比較**:
- **Java**: interface キーワードで定義、実装が必要
- **C#**: interface キーワードで定義、実装が必要
- **Go**: interface は暗黙的に実装される
- **TypeScript**: 構造的型付けで、形が合えば互換性がある

### オプショナルプロパティ（Optional Properties）
**定義**: オブジェクトの型定義において、そのプロパティがオブジェクトに存在しても、しなくても良いことを示す機能です。プロパティ名の後ろに`?`を付けることで定義され、オブジェクトの柔軟なデータ構造を表現するのに役立ちます。

**コード例**:
```typescript
interface UserProfile {
  id: number;
  name: string;
  email: string;
  avatar?: string; // オプショナルプロパティ
  bio?: string; // オプショナルプロパティ
  socialLinks?: {
    twitter?: string;
    github?: string;
  };
}

// 使用例
const user1: UserProfile = {
  id: 1,
  name: "Alice",
  email: "alice@example.com"
  // avatar, bio, socialLinks は省略可能
};

const user2: UserProfile = {
  id: 2,
  name: "Bob",
  email: "bob@example.com",
  avatar: "avatar.jpg",
  bio: "Developer"
};
```

### 読み取り専用プロパティ（Readonly Properties）
**定義**: オブジェクトのプロパティが、一度値が代入された後は再代入によって変更できないことを示す機能です。プロパティ名の前に`readonly`キーワードを付けることで定義され、データの不変性を保証し、意図しない変更を防ぎます。

**コード例**:
```typescript
interface ReadonlyUser {
  readonly id: number;
  readonly createdAt: Date;
  name: string; // 変更可能
  email: string; // 変更可能
}

const user: ReadonlyUser = {
  id: 1,
  createdAt: new Date(),
  name: "Alice",
  email: "alice@example.com"
};

// user.id = 2; // Error: Cannot assign to 'id' because it is a read-only property
user.name = "Alice Smith"; // OK
```

### インデックスシグネチャ（Index Signatures）
**定義**: オブジェクトのプロパティ名が事前に決まっておらず、実行時に動的に決定される可能性がある場合に、そのプロパティのキーの型と値の型を定義する機能です。これにより、辞書やマップのようなデータ構造を型安全に扱えます。

**コード例**:
```typescript
// 文字列インデックスシグネチャ
interface StringDictionary {
  [key: string]: string;
}

const translations: StringDictionary = {
  hello: "こんにちは",
  goodbye: "さようなら",
  thanks: "ありがとう"
};

// 数値インデックスシグネチャ
interface NumberArray {
  [index: number]: number;
}

const scores: NumberArray = [85, 92, 78, 96];

// 混合インデックスシグネチャ
interface MixedObject {
  name: string; // 固定プロパティ
  [key: string]: string | number; // 動的プロパティ
}
```

---

## 型定義関連用語

### 型定義（Type Definition）
**定義**: `type`キーワードや`interface`キーワードを用いて、既存の型を組み合わせたり、新しい構造を定義したりして、独自の型を定義することです。これにより、コードの意図が明確になり、再利用性が高まります。

**基本パターン**:
```typescript
// 型エイリアス
type UserID = string;
type UserAge = number;

// オブジェクト型の定義
type User = {
  id: UserID;
  name: string;
  age: UserAge;
};

// ユニオン型の定義
type Status = "pending" | "approved" | "rejected";

// 関数型の定義
type EventHandler = (event: Event) => void;
```

### 型宣言（Type Declaration）
**定義**: 主にJavaScriptで書かれた既存のコードや、型情報を持たない外部ライブラリに対して、TypeScriptコンパイラが型チェックを行えるように、その型情報を定義することです。`declare`キーワードを用いて行われ、`.d.ts`ファイルに記述されることが多いです。

**コード例**:
```typescript
// 外部ライブラリの型宣言
declare module "my-library" {
  export function doSomething(value: string): number;
  export const VERSION: string;
}

// グローバル変数の型宣言
declare global {
  interface Window {
    myCustomProperty: string;
  }
}

// 環境変数の型宣言
declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: "development" | "production" | "test";
    API_URL: string;
  }
}
```

### 型合成（Type Composition）
**定義**: 既存の複数の型を組み合わせて、より複雑で柔軟な新しい型を構築する手法です。ユニオン型（`|`）、インターセクション型（`&`）、条件付き型、マップ型などの機能を用いて行われ、コードの再利用性と表現力を高めます。

**コード例**:
```typescript
// インターセクション型による合成
type Name = { name: string };
type Age = { age: number };
type Person = Name & Age; // { name: string; age: number; }

// ユニオン型による合成
type StringOrNumber = string | number;

// 条件付き型による合成
type NonNullable<T> = T extends null | undefined ? never : T;

// マップ型による合成
type Partial<T> = {
  [P in keyof T]?: T[P];
};
```

### 型の互換性（Type Compatibility）
**定義**: ある型が別の型に代入可能であるか、または互換性があるかどうかの関係を指します。TypeScriptは「構造的型付け（Structural Typing）」を採用しており、型の名前ではなく、その構造（プロパティやメソッドの有無と型）に基づいて互換性を判断します。

**コード例**:
```typescript
// 構造的型付けによる互換性
interface Point2D {
  x: number;
  y: number;
}

interface Point3D {
  x: number;
  y: number;
  z: number;
}

let point2D: Point2D = { x: 1, y: 2 };
let point3D: Point3D = { x: 1, y: 2, z: 3 };

// Point3D は Point2D と互換性がある（より多くのプロパティを持つ）
point2D = point3D; // OK

// Point2D は Point3D と互換性がない（z プロパティが不足）
// point3D = point2D; // Error
```

---

## 統計・分析関連用語

### 統計型（Statistics Types）
**定義**: 統計計算に使用される型定義

**コード例**:
```typescript
// 基本統計データ型
interface BasicStatistics {
  count: number;
  sum: number;
  mean: number;
  median: number;
  mode: number[];
  min: number;
  max: number;
  range: number;
  variance: number;
  standardDeviation: number;
}

// 統計計算関数の型
type StatisticsCalculator<T> = (data: T[]) => BasicStatistics;

// 数値配列用の統計計算
const calculateNumberStats: StatisticsCalculator<number> = (numbers) => {
  const sorted = [...numbers].sort((a, b) => a - b);
  const sum = numbers.reduce((acc, num) => acc + num, 0);
  const mean = sum / numbers.length;
  
  return {
    count: numbers.length,
    sum,
    mean,
    median: sorted[Math.floor(sorted.length / 2)],
    mode: [], // 実装省略
    min: Math.min(...numbers),
    max: Math.max(...numbers),
    range: Math.max(...numbers) - Math.min(...numbers),
    variance: 0, // 実装省略
    standardDeviation: 0 // 実装省略
  };
};
```

**なぜ重要か**: 統計データを扱うアプリケーションにおいて、データの構造を明確にし、計算の正確性と保守性を高めるため。
**実用場面**: データ分析ツール、レポート生成システム、機械学習の前処理など。

### 集計型（Aggregation Types）
**定義**: データの集計処理に使用される型

**コード例**:
```typescript
// 集計結果の型
interface AggregationResult<T> {
  groupBy: string;
  data: T[];
  count: number;
  aggregatedValue: number;
}

// 集計関数の型
type AggregationFunction<T, K extends keyof T> = (
  data: T[],
  groupByKey: K,
  aggregateKey: keyof T
) => AggregationResult<T>[];

// 売上データの集計例
interface SalesData {
  date: string;
  product: string;
  amount: number;
  quantity: number;
}

const aggregateSales: AggregationFunction<SalesData, 'product'> = (
  data,
  groupByKey,
  aggregateKey
) => {
  // 実装省略
  return [];
};
```

**なぜ重要か**: 大量のデータを特定の基準でまとめ、要約する際に、集計結果の構造を型として定義することで、データの整合性を保ち、処理の信頼性を向上させるため。
**実用場面**: ダッシュボードのデータ表示、ビジネスインテリジェンスレポート、ログ分析など。

### 分析データ型（Analytics Data Types）
**定義**: データ分析に特化した型定義

**コード例**:
```typescript
// 時系列データ型
interface TimeSeriesData {
  timestamp: Date;
  value: number;
  metadata?: Record<string, unknown>;
}

// 分析結果型
interface AnalysisResult {
  trend: "increasing" | "decreasing" | "stable";
  correlation: number;
  seasonality: boolean;
  anomalies: TimeSeriesData[];
  forecast: TimeSeriesData[];
}

// 分析器の型
interface DataAnalyzer<T> {
  analyze(data: T[]): AnalysisResult;
  predict(data: T[], periods: number): T[];
  detectAnomalies(data: T[], threshold: number): T[];
}
```

**なぜ重要か**: 時系列データ、相関分析、異常検知、予測などの複雑な分析結果を構造化し、分析ロジックの明確化と再利用性を促進するため。
**実用場面**: リアルタイム監視システム、予測分析、A/Bテスト結果の管理など。

---

## API・サービス関連用語

### APIレスポンス型（API Response Types）
**定義**: API からのレスポンスデータの型定義

**コード例**:
```typescript
// 基本的なAPIレスポンス型
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  statusCode: number;
  timestamp: Date;
}

// ページネーション付きレスポンス
interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// 使用例
type UserListResponse = ApiResponse<PaginatedResponse<User>>;
type UserDetailResponse = ApiResponse<User>;
```

**なぜ重要か**: クライアントとサーバー間のデータ契約を明確にし、APIの利用者がどのようなデータを受け取るかを事前に把握できるようにするため。これにより、クライアント側の開発効率と型安全性が向上します。
**実用場面**: RESTful API、GraphQL API、マイクロサービス間の通信など、あらゆるAPI連携において必須。

### サービス層型（Service Layer Types）
**定義**: サービス層で使用される型定義

**コード例**:
```typescript
// サービスインターフェース
interface UserService {
  getUser(id: string): Promise<ApiResponse<User>>;
  createUser(userData: CreateUserRequest): Promise<ApiResponse<User>>;
  updateUser(id: string, userData: UpdateUserRequest): Promise<ApiResponse<User>>;
  deleteUser(id: string): Promise<ApiResponse<void>>;
  listUsers(params: ListUsersParams): Promise<UserListResponse>;
}

// リクエスト型
interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
}

interface UpdateUserRequest {
  name?: string;
  email?: string;
}

interface ListUsersParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: keyof User;
  sortOrder?: "asc" | "desc";
}
```

**なぜ重要か**: アプリケーションのビジネスロジックをカプセル化するサービス層において、入力と出力の型を明確にすることで、コードの可読性、保守性、テスト容易性を高めるため。
**実用場面**: ドメイン駆動設計（DDD）におけるアプリケーションサービス、ビジネスロジックを扱う層全般。

### HTTPステータス型（HTTP Status Types）
**定義**: HTTPステータスコードの型定義

**コード例**:
```typescript
// HTTPステータスコード型
type HttpStatusCode = 
  | 200 // OK
  | 201 // Created
  | 204 // No Content
  | 400 // Bad Request
  | 401 // Unauthorized
  | 403 // Forbidden
  | 404 // Not Found
  | 409 // Conflict
  | 422 // Unprocessable Entity
  | 500 // Internal Server Error
  | 502 // Bad Gateway
  | 503; // Service Unavailable

// ステータス別レスポンス型
interface HttpResponse<T = unknown> {
  status: HttpStatusCode;
  data?: T;
  headers: Record<string, string>;
}

// エラーレスポンス型
interface ErrorResponse {
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
}
```

**なぜ重要か**: HTTP通信における成功、エラー、リダイレクトなどの状態を数値で表現するステータスコードを型として定義することで、レスポンス処理の堅牢性を高め、エラーハンドリングを体系的に行うため。
**実用場面**: WebアプリケーションのバックエンドAPI、フロントエンドでのAPIレスポンス処理、エラーページ表示など。

### リクエスト・レスポンス型（Request/Response Types）
**定義**: HTTP リクエストとレスポンスの型定義

**コード例**:
```typescript
// 基本リクエスト型
interface BaseRequest {
  headers?: Record<string, string>;
  params?: Record<string, string>;
  query?: Record<string, string>;
}

// POST リクエスト型
interface PostRequest<T> extends BaseRequest {
  body: T;
}

// GET リクエスト型
interface GetRequest extends BaseRequest {
  // body は不要
}

// API エンドポイント型
interface ApiEndpoint<TRequest, TResponse> {
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  path: string;
  request: TRequest;
  response: TResponse;
}

// 使用例
type CreateUserEndpoint = ApiEndpoint<
  PostRequest<CreateUserRequest>,
  ApiResponse<User>
>;

type GetUserEndpoint = ApiEndpoint<
  GetRequest & { params: { id: string } },
  ApiResponse<User>
>;
```

**なぜ重要か**: HTTP通信におけるリクエストのペイロード、クエリパラメータ、ヘッダー、そしてそれに対応するレスポンスの構造を厳密に定義することで、APIの仕様を明確にし、クライアントとサーバー間の連携ミスを防ぐため。
**実用場面**: Web APIの設計と実装、APIクライアントライブラリの生成、APIドキュメンテーション。
- [MDN - JavaScript Data Types](https://developer.mozilla.org/ja/docs/Web/JavaScript/Data_structures)

---

**📌 重要**: 型システムの理解は TypeScript 習得の基礎となります。各用語の意味と使用場面を実際のコードで確認しながら学習を進めてください。