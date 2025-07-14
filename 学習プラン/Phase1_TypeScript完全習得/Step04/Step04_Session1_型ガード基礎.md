# Session1: 型ガード基礎（40 分）

> 💡 **対象**: 他言語経験者（TypeScript 基本型・インターフェース・ユニオン型知識あり）
> 🎯 **形式**: 講師サポート付き学習
> ⏰ **時間**: 40 分（休憩含む）

## 📚 関連補足資料

このセッションの学習をサポートする補足資料をご用意しています：

- 📖 **[専門用語集](./Step04_補足_専門用語集.md)** - 型ガード関連の重要な概念と用語の詳細解説
- 💻 **[実践コード例](./Step04_補足_実践コード例.md)** - 段階的な学習のためのコード例集
- 🔧 **[開発環境ガイド](./Step04_補足_開発環境ガイド.md)** - 効率的な開発環境の活用
- 🌐 **[参考リソース](./Step04_補足_参考リソース.md)** - 学習に役立つリンク集とリソース
- 🚨 **[トラブルシューティング](./Step04_補足_トラブルシューティング.md)** - よくあるエラーと解決方法

> 💡 **活用方法**: 学習中に疑問が生じた際や、より深く理解したい場合に参照してね 🐰

## 📅 セッション概要

**学習目標**:

- [ ] 基本型ガード（typeof, instanceof, in 演算子）の理解と実装
- [ ] フォーム入力値の基本検証パターンの習得
- [ ] 型ガードによる型安全性の確保
- [ ] 実践的な型ガードの活用方法の理解

**前提知識**:

- Step01: JavaScript 基礎、TypeScript 基本型注釈
- Step02: 基本型システム、型推論、型エイリアス
- Step03: インターフェース、オプショナルプロパティ、継承
- ユニオン型の基本概念（前提知識として）

---

## ⏰ 詳細タイムテーブル

| 時間         | 内容                     | 学習活動         | 成果物     |
| ------------ | ------------------------ | ---------------- | ---------- |
| **0-3 分**   | 前提知識確認・今回目標   | 振り返り・質問   | 理解確認   |
| **3-15 分**  | 基本型ガード理論         | 理解・メモ       | 基本知識   |
| **15-32 分** | 段階的な実例とコード演習 | ハンズオン・実践 | 実践コード |
| **32-40 分** | 基本練習問題             | 個人演習・確認   | 演習成果   |

---

## 📚 学習内容

### Section 1: 前提知識確認（要点のみ）

#### 🔍 ユニオン型の簡単な復習

**基本的なユニオン型**

```typescript
// Step02-03で学習した基本概念
type StringOrNumber = string | number;
type UserStatus = "active" | "inactive" | "pending";

interface User {
  id: number;
  name: string;
  status: UserStatus;
}

// ユニオン型の課題：共通プロパティのみアクセス可能
function processValue(value: StringOrNumber): string {
  // return value.toUpperCase(); // Error: numberにはtoUpperCase()がない
  return value.toString(); // OK: 両方の型に存在
}
```

**💡 今日学ぶ型ガードとの関係**

型ガードは、ユニオン型の値を安全に扱うための仕組みです。TypeScript コンパイラがコンパイル時に認識できる特定のパターン（typeof、instanceof、in など）を使用し、実行時には JavaScript コードとして値の性質をチェックします。コンパイラは事前にこれらのパターンを理解しており、条件分岐内で型を自動的に絞り込みます。

---

### Section 2: 基本型ガードの理論と実装

> 📚 **関連資料**: [専門用語集 - 型ガード](./Step04_補足_専門用語集.md#型ガード) | [実践コード例 - 基本型ガード](./Step04_補足_実践コード例.md#基本型ガード)

#### 🎯 型ガードとは何か

**💡 なぜ型ガードが重要なのか**

型ガードは、TypeScript コンパイラがコンパイル時に認識できる特定のパターンを使って、値の型を絞り込む仕組みです。コンパイラは`typeof`、`instanceof`、`in`演算子などの型ガードパターンを静的解析で認識し、その条件分岐内では型を自動的に絞り込みます。

#### 1. typeof 型ガード

```typescript
// 基本的なtypeof型ガード
function processStringOrNumber(value: string | number): string {
  if (typeof value === "string") {
    // この分岐内ではvalueはstring型
    return `文字列: ${value.toUpperCase()}`;
  } else {
    // この分岐内ではvalueはnumber型
    return `数値: ${value.toFixed(2)}`;
  }
}

// 使用例
console.log(processStringOrNumber("hello")); // "文字列: HELLO"
console.log(processStringOrNumber(42.567)); // "数値: 42.57"
```

#### 2. instanceof 型ガード

```typescript
// エラーオブジェクトの型ガード
function handleError(error: unknown): string {
  if (error instanceof Error) {
    // この分岐内ではerrorはError型
    return `エラー: ${error.message}`;
  } else {
    return "不明なエラー";
  }
}
```

#### 3. in 演算子型ガード

```typescript
interface User {
  id: number;
  name: string;
}

interface AdminUser extends User {
  permissions: string[];
}

function checkUserType(user: User | AdminUser): string {
  if ("permissions" in user) {
    // この分岐内ではuserはAdminUser型
    return `管理者: ${user.name}`;
  } else {
    // この分岐内ではuserはUser型
    return `一般ユーザー: ${user.name}`;
  }
}
```

---

### Section 3: 実践演習

> 📚 **サポート資料**: [実践コード例 - 型ガードの練習](./Step04_補足_実践コード例.md#型ガードの練習)

#### 🔧 基本型ガードの実装

```typescript
// 基本型ガードを使った安全な処理
function processValue(input: unknown): string {
  if (typeof input === "string") {
    return `文字列: ${input.toUpperCase()}`;
  } else if (typeof input === "number") {
    return `数値: ${input.toFixed(2)}`;
  } else {
    return "未対応の型です";
  }
}
```

---

---

## 🔧 練習問題

> 📚 **サポート資料**: [実践コード例 - 型ガードの練習](./Step04_補足_実践コード例.md#型ガードの練習) | [トラブルシューティング](./Step04_補足_トラブルシューティング.md#よくあるエラー)

### 練習問題 1.1: 基本型ガード（8 分） 🔰

```typescript
// 要件: 以下の関数を基本型ガードを使って実装してください。
// - inputがnumber型の場合: "数値: [数値]" の形式で返す。
// - inputがstring型の場合: "文字列: [文字列を大文字にしたもの]" の形式で返す。
// - inputがnumber型でもstring型でもない場合（例: boolean, object, null, undefinedなど）: "未対応の型です" という固定文字列を返す。
function processInput(input: unknown): string {
  /* ここを実装 */
}

// テストケース
console.log(processInput(42)); // "数値: 42"
console.log(processInput("hello")); // "文字列: HELLO"
console.log(processInput(true)); // "その他の型"
```

---

### 練習問題 1.2: instanceof 型ガード（8 分） 🚀

```typescript
// 要件: 以下のクラスと関数を定義し、instanceof 型ガードを使って適切なメッセージを返す関数を実装してください。
class Dog {
  constructor(public name: string) {}
  bark() {
    return `${this.name}がワンと吠えます！`;
  }
}

class Cat {
  constructor(public name: string) {}
  meow() {
    return `${this.name}がニャーと鳴きます。`;
  }
}

type Animal = Dog | Cat;

function describeAnimal(animal: Animal): string {
  /* ここを実装 */
}

// テストケース
console.log(describeAnimal(new Dog("ポチ"))); // "ポチがワンと吠えます！"
console.log(describeAnimal(new Cat("タマ"))); // "タマがニャーと鳴きます。"
```

---

### 練習問題 1.3: in 演算子型ガード（8 分） 🌟

```typescript
// 要件: 以下のインターフェースと関数を定義し、in 演算子型ガードを使って適切なメッセージを返す関数を実装してください。
interface Car {
  brand: string;
  model: string;
  drive(): string;
}

interface Bicycle {
  brand: string;
  pedal(): string;
}

type Vehicle = Car | Bicycle;

function getVehicleDetails(vehicle: Vehicle): string {
  /* ここを実装 */
}

// テストケース
const myCar: Car = {
  brand: "トヨタ",
  model: "プリウス",
  drive: () => "ドライブ中...",
};
const myBicycle: Bicycle = {
  brand: "ブリヂストン",
  pedal: () => "ペダルを漕いでいます...",
};
console.log(getVehicleDetails(myCar)); // "トヨタ プリウス: ドライブ中..."
console.log(getVehicleDetails(myBicycle)); // "ブリヂストン: ペダルを漕いでいます..."
```

---

### 練習問題 1.4: 複合型ガード（8 分） 💡

```typescript
// 要件: 以下の型と関数を定義し、複数の型ガード（typeof, instanceof, in）を組み合わせて、
// 複雑なユニオン型の値を安全に処理する関数を実装してください。
interface SuccessResponse {
  status: "success";
  data: string | number;
}

interface ErrorResponse {
  status: "error";
  message: string;
  code?: number;
}

class CustomError extends Error {
  constructor(message: string, public errorCode: number) {
    super(message);
    this.name = "CustomError";
  }
}

type ApiResponse = SuccessResponse | ErrorResponse | CustomError | string;

function handleApiResponse(response: ApiResponse): string {
  /* ここを実装 */
}

// テストケース
console.log(handleApiResponse({ status: "success", data: "データ取得成功" })); // "成功: データ取得成功"
console.log(handleApiResponse({ status: "success", data: 123 })); // "成功: 123"
console.log(
  handleApiResponse({ status: "error", message: "認証失敗", code: 401 })
); // "エラー (401): 認証失敗"
console.log(handleApiResponse(new CustomError("ネットワークエラー", 500))); // "カスタムエラー (500): ネットワークエラー"
console.log(handleApiResponse("不明なレスポンス")); // "不明なレスポンス形式"
```

---

### 練習問題 1.5: フォーム入力値の検証（8 分） 📝

```typescript
// 要件: 以下の関数を実装し、ユーザーからのフォーム入力値を型ガードを使って検証してください。
// inputが文字列、数値、真偽値のいずれかであるかを判定し、適切なメッセージを返します。
// - 文字列の場合: 空文字でなければその文字列を大文字にして返す。空文字なら「空の文字列です」
// - 数値の場合: 0より大きければ「有効な数値: [数値]」、そうでなければ「無効な数値です」
// - 真偽値の場合: trueなら「承認されました」、falseなら「拒否されました」
// - その他の型の場合: 「未対応の入力形式です」

function validateFormInput(input: unknown): string {
  /* ここを実装 */
}

// テストケース
console.log(validateFormInput("hello world")); // "HELLO WORLD"
console.log(validateFormInput("")); // "空の文字列です"
console.log(validateFormInput(123)); // "有効な数値: 123"
console.log(validateFormInput(0)); // "無効な数値です"
console.log(validateFormInput(true)); // "承認されました"
console.log(validateFormInput(false)); // "拒否されました"
console.log(validateFormInput(null)); // "未対応の入力形式です"
console.log(validateFormInput({})); // "未対応の入力形式です"
```

---

## 📝 解答例

### 練習問題 1.1 解答

```typescript
function processInput(input: unknown): string {
  if (typeof input === "number") {
    return `数値: ${input}`;
  } else if (typeof input === "string") {
    return `文字列: ${input.toUpperCase()}`;
  } else {
    return "未対応の型です";
  }
}
```

### 練習問題 1.2 解答

```typescript
class Dog {
  constructor(public name: string) {}
  bark() {
    return `${this.name}がワンと吠えます！`;
  }
}

class Cat {
  constructor(public name: string) {}
  meow() {
    return `${this.name}がニャーと鳴きます。`;
  }
}

type Animal = Dog | Cat;

function describeAnimal(animal: Animal): string {
  if (animal instanceof Dog) {
    return animal.bark();
  } else if (animal instanceof Cat) {
    return animal.meow();
  }
  // ここには到達しないはずだが、念のため
  return "不明な動物です。";
}
```

### 練習問題 1.3 解答

```typescript
interface Car {
  brand: string;
  model: string;
  drive(): string;
}

interface Bicycle {
  brand: string;
  pedal(): string;
}

type Vehicle = Car | Bicycle;

function getVehicleDetails(vehicle: Vehicle): string {
  if ("model" in vehicle) {
    // この分岐内では vehicle は Car 型
    return `${vehicle.brand} ${vehicle.model}: ${vehicle.drive()}`;
  } else {
    // この分岐内では vehicle は Bicycle 型
    return `${vehicle.brand}: ${vehicle.pedal()}`;
  }
}
```

### 練習問題 1.4 解答

```typescript
interface SuccessResponse {
  status: "success";
  data: string | number;
}

interface ErrorResponse {
  status: "error";
  message: string;
  code?: number;
}

class CustomError extends Error {
  constructor(message: string, public errorCode: number) {
    super(message);
    this.name = "CustomError";
  }
}

type ApiResponse = SuccessResponse | ErrorResponse | CustomError | string;

function handleApiResponse(response: ApiResponse): string {
  if (typeof response === "string") {
    return `不明なレスポンス形式: ${response}`;
  } else if (response instanceof CustomError) {
    return `カスタムエラー (${response.errorCode}): ${response.message}`;
  } else if ("status" in response) {
    if (response.status === "success") {
      return `成功: ${response.data}`;
    } else {
      // response.status === "error"
      const errorCode = response.code ? ` (${response.code})` : "";
      return `エラー${errorCode}: ${response.message}`;
    }
  }
  return "予期せぬレスポンスです。"; // ここには到達しないはず
}
```

### 練習問題 1.5 解答

```typescript
function validateFormInput(input: unknown): string {
  if (typeof input === "string") {
    if (input.trim().length > 0) {
      return input.toUpperCase();
    } else {
      return "空の文字列です";
    }
  } else if (typeof input === "number") {
    if (input > 0) {
      return `有効な数値: ${input}`;
    } else {
      return "無効な数値です";
    }
  } else if (typeof input === "boolean") {
    return input ? "承認されました" : "拒否されました";
  } else {
    return "未対応の入力形式です";
  }
}
```

---

## 👨‍🏫 学習ポイント

### 🤔 よくある質問

**Q: 型ガードはいつ使うべきですか？**
A: 主に以下の場面で使用します：

- `unknown`型や`any`型の値を安全に扱いたい時
- ユニオン型の値を特定の型に絞り込みたい時
- 外部からのデータ（API、ユーザー入力）を検証したい時
- DOM 操作で要素の型を確認したい時

**Q: typeof、instanceof、in の使い分けが分かりません。**
A: 以下のように使い分けます：

- `typeof`: プリミティブ型（string, number, boolean 等）の判定
- `instanceof`: クラスのインスタンスや DOM 要素の判定
- `in`: オブジェクトのプロパティ存在チェック

---

## 🎯 Session1 の成果確認

### 理解度チェック

- [x] typeof 型ガードを使ってプリミティブ型を判定できる
- [x] instanceof 型ガードを使ってオブジェクトの型を判定できる
- [x] in 演算子を使ってプロパティの存在をチェックできる
- [x] フォーム入力値の基本的な検証ができる
- [x] 型ガードを組み合わせて複雑な検証ができる

---

**📌 重要**: Session1 では型ガードの基礎をしっかりと理解することが重要です。次の Session2 では、これらの知識を基にユーザー定義型ガードを学習します。

**🌟 次回（Session2）は、より柔軟で再利用可能なユーザー定義型ガードの実装に挑戦します！**
