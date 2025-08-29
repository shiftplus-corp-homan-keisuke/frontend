# Session1: Zod 基本マスター（45 分）

> 💡 **対象**: Step01-06 完了者（ジェネリクス・ユーティリティ型習得済み）
> 🎯 **形式**: 講師サポート付き学習
> ⏰ **時間**: 45 分（実習中心）

## 📅 セッション概要

**学習目標**:

- [ ] Zod の基本概念と実行時型安全性の理解
- [ ] 基本的なスキーマ定義とバリデーション実行
- [ ] オブジェクト・配列スキーマの作成
- [ ] エラーハンドリングと型推論（z.infer）の活用

## Zod の基本概念

> 📚 **関連資料**: [専門用語集 - Zod 基本概念](./Step07_補足_専門用語集.md#Zod基本概念) | [実践コード例 - スキーマ基礎](./Step07_補足_実践コード例.md#スキーマ基礎)

Zod とは、TypeScript 向けのスキーマ宣言・検証ライブラリです。これにより、データの「型」や「形式」を定義し、その定義に基づいてデータが正しいかを検証（バリデーション）できます。

主な特徴は以下の通りです。

- **型安全性:** Zod で定義したスキーマから TypeScript の型を自動で推論できるため、静的解析の恩恵を受けつつ、実行時のデータの型も保証できます。
- **宣言的な API:** 「この値は 5 文字以上の文字列である」といったルールを直感的かつ簡潔に記述できます。
- **豊富なバリデーションルール:** 文字列、数値などの基本的な型に加え、メールアドレス形式、URL 形式、最小・最大値など、豊富な検証ルールが組み込まれています。

API からのレスポンスデータや、フォームからのユーザー入力など、信頼できないデータが期待通りの形式になっているかを検証する際に非常に役立ちます。

### 🔍 「スキーマ」って何？

Zod のスキーマとは、データがどのような「形」や「制約」を持つべきかを定義したものです。TypeScript 向けのスキーマ宣言・検証ライブラリである Zod の中核的な概念であり、これを使うことでデータのバリデーション（検証）を安全かつ効率的に行うことができます。

## スキーマの主な役割

- **データの検証 (Validation):** スキーマは、あるデータが期待通りの構造になっているか、例えば「この値は文字列で、メールアドレスの形式でなければならない」といったルールを検証します もしデータがスキーマの定義と一致しない場合、エラーを発生させて不正なデータが使われるのを防ぎます。
- **型安全性 (Type Safety):** Zod は TypeScript と非常に相性が良く、定義したスキーマから TypeScript の型を自動的に推論できます。これにより、開発中に型の不整合を検知しやすくなり、コードの品質と安全性が向上します。
- **宣言的な記述:** 「もしこの値が数値なら...」「もし文字列の長さが...」といった手続き的なコードを書く代わりに、「このデータはこういう形であるべき」という宣言的な方法でルールを記述できるため、コードが簡潔で読みやすくなります。

### 具体的なスキーマの例

Zod では、`z`オブジェクトを使って様々なスキーマを定義します。

**1. 基本的な型:**
文字列、数値、真偽値といった基本的なデータ型を定義します。

```typescript
import { z } from "zod";

// 文字列のスキーマ
const MyStringSchema = z.string();

// 数値のスキーマ
const MyNumberSchema = z.number();
```

**2. オブジェクト:**
複数のプロパティを持つオブジェクトの構造を定義できます。

```typescript
import { z } from "zod";

const UserSchema = z.object({
  name: z.string(),
  age: z.number().positive(), // 0より大きい数値
  email: z.email(), // メールアドレス形式の文字列
});
```

**3. 配列:**
特定のスキーマに準拠した要素を持つ配列を定義します。

```typescript
import { z } from "zod";

const StringArraySchema = z.array(z.string());
```

### スキーマの使い方

定義したスキーマは、主に`.parse()`または`.safeParse()`メソッドを使ってデータを検証します。

- `.parse()`: 検証が成功した場合はそのデータを返し、失敗した場合はエラーをスローします。
- `.safeParse()`: エラーをスローせず、検証結果をオブジェクト（`{ success: true, data: ... }` または `{ success: false, error: ... }`）として返します。

```typescript
import { z } from "zod";

const UserSchema = z.object({
  name: z.string(),
  age: z.number(),
});

// 検証したいデータ
const userData = {
  name: "John Doe",
  age: 30,
};

try {
  // スキーマを使ってデータをパース（検証）する
  const validatedUser = UserSchema.parse(userData);
  console.log("検証成功:", validatedUser);
} catch (error) {
  // 検証に失敗した場合
  console.error("検証失敗:", error);
}
```

このように、Zod のスキーマは、外部 API からのレスポンス、フォームからのユーザー入力など、信頼できないデータソースを扱う際に、アプリケーションの堅牢性を高めるための強力なツールです。

## 環境セットアップ

**🎓 学習のポイント**: まずは最小限のセットアップで Zod の基本動作を理解しましょ 🐰

```bash
# Zodのインストール
npm install zod

# TypeScript環境のセットアップ（まだの場合）
npm install -D typescript @types/node
```

**🔍 最初のスキーマを作成してみよう**

```typescript
// 基本的なインポート
import { z } from "zod";

// 🎯 スキーマ = データの設計図を作成
const UserSchema = z.object({
  name: z.string(), // 「名前は文字列でなければならない」というルール
  age: z.number(), // 「年齢は数値でなければならない」というルール
});

// 💡 スキーマから型を自動生成（これがZodの便利なところ！）
type User = z.infer<typeof UserSchema>;
// 結果: { name: string; age: number; }

// 📝 スキーマを使ってデータをチェックしてみよう
console.log("=== スキーマでデータをチェック ===");

// ✅ 設計図通りのデータ → OK
const correctData = { name: "太郎", age: 25 };
const result1 = UserSchema.safeParse(correctData);
console.log("正しいデータ:", result1.success); // true

// ❌ 設計図と違うデータ → エラー
const wrongData = { name: "太郎", age: "25歳" }; // 年齢が文字列！
const result2 = UserSchema.safeParse(wrongData);
console.log("間違ったデータ:", result2.success); // false

if (!result2.success) {
  console.log("何が間違っているか:", result2.error.errors);
  // → "age"は数値である必要があります、というエラーが出る
}
```

## 基本的なスキーマ定義

Zod では、z オブジェクトを使って様々なプリミティブ型のスキーマを定義できます。以下が主要なプリミティブスキーマです：

### 1. 文字列 (string)

最も基本的な文字列スキーマは `z.string()` で定義します。

```typescript
const stringSchema = z.string();

// 検証
stringSchema.parse("こんにちは"); // -> "こんにちは"
stringSchema.parse(""); // -> ""

// 数値などを渡すとエラーになる
// stringSchema.parse(123); // ZodError
```

さらに、メソッドチェーンで様々な制約を追加できます。

- `min(文字数)`: 最小文字数
- `max(文字数)`: 最大文字数
- `length(文字数)`: 指定した文字数と一致
- `email()`: メールアドレス形式
- `url()`: URL 形式
- `uuid()`: UUID 形式
- `startsWith(文字列)`: 指定した文字列で始まる
- `endsWith(文字列)`: 指定した文字列で終わる

**コード例:**

```typescript
// 5文字以上10文字以下の文字列
const usernameSchema = z.string().min(5).max(10);
usernameSchema.parse("user123"); // OK

// メールアドレス形式の文字列
const emailSchema = z.string().email("有効なメールアドレスを入力してください"); // エラーメッセージのカスタマイズも可能
emailSchema.parse("test@example.com"); // OK
```

### 2. 数値 (number)

基本的な数値スキーマは `z.number()` で定義します。

```typescript
const numberSchema = z.number();

// 検証
numberSchema.parse(123); // -> 123
numberSchema.parse(-3.14); // -> -3.14

// 文字列などを渡すとエラーになる
// numberSchema.parse("123"); // ZodError
```

数値にも便利な制約があります。

- `gt(数値)`: より大きい (greater than)
- `gte(数値)`: 以上 (greater than or equal)
- `lt(数値)`: より小さい (less than)
- `lte(数値)`: 以下 (less than or equal)
- `int()`: 整数
- `positive()`: 正の数 (`> 0`)
- `negative()`: 負の数 (`< 0`)
- `nonpositive()`: 0 以下 (`<= 0`)
- `nonnegative()`: 0 以上 (`>= 0`)

**コード例:**

```typescript
// 0以上の整数
const ageSchema = z.number().int().nonnegative();
ageSchema.parse(25); // OK
ageSchema.parse(0); // OK

// 1から5までの数値
const ratingSchema = z.number().gte(1).lte(5);
ratingSchema.parse(3); // OK
```

### 3. 真偽値 (boolean)

真偽値 (true/false) を表すスキーマは `z.boolean()` で定義します。

```typescript
const booleanSchema = z.boolean();

// 検証
booleanSchema.parse(true); // -> true
booleanSchema.parse(false); // -> false

// それ以外の値はエラー
// booleanSchema.parse(1); // ZodError
```

### 4. 日付 (Date)

JavaScript の`Date`オブジェクトを検証するには `z.date()` を使います。

```typescript
const dateSchema = z.date();

// 検証
dateSchema.parse(new Date()); // OK

// 文字列の日付はエラーになる
// dateSchema.parse("2023-10-27"); // ZodError
```

**ヒント:** 文字列形式の日付を`Date`オブジェクトに変換したい場合は、`z.coerce.date()`が便利です。

### 5. リテラル (literal)

特定の値そのものをスキーマとして定義したい場合は `z.literal()` を使います。検証対象がその値と厳密に一致する場合のみ成功します。

```typescript
const statusSchema = z.literal("success");

// 検証
statusSchema.parse("success"); // OK

// "success"以外の値はエラー
// statusSchema.parse("error"); // ZodError

const oneSchema = z.literal(1);
oneSchema.parse(1); // OK
```

### 6. Enum

複数のリテラルの中からいずれかの値を許可したい場合は `z.enum()` を使います。これは TypeScript の Enum の代わりのように使えます。

```typescript
const statusEnumSchema = z.enum(["success", "error", "pending"]);

// 検証
statusEnumSchema.parse("success"); // OK
statusEnumSchema.parse("pending"); // OK

// 配列に含まれない値はエラー
// statusEnumSchema.parse("unknown"); // ZodError
```

### その他のプリミティブ

- `z.null()`: `null`のみを許可
- `z.undefined()`: `undefined`のみを許可
- `z.nan()`: `NaN`のみを許可
- `z.any()`: あらゆる型を許可（型安全性が失われるため使用は慎重に）
- `z.unknown()`: あらゆる型を許可（`any`より安全で、利用前に型チェックが必要）

これらが Zod の最も基本的なスキーマです。これらのプリミティブを組み合わせて、オブジェクトや配列といった、より複雑なデータ構造を定義していくことになります。

## 基本的なオブジェクトスキーマ

`z.object()` を使い、その引数にキーと値のペアを持つオブジェクトを渡します。キーはプロパティ名（文字列）、値はそのプロパティが満たすべき Zod スキーマです。

```typescript
import { z } from "zod";

// ユーザー情報を検証するスキーマ
const UserSchema = z.object({
  // `id`プロパティは、UUID形式の文字列であるべき
  id: z.uuid(),

  // `username`プロパティは、3文字以上の文字列であるべき
  username: z.string().min(3, "ユーザー名は3文字以上で入力してください"),

  // `email`プロパティは、メールアドレス形式の文字列であるべき
  email: z.email(),

  // `isAdmin`プロパティは、真偽値であるべき
  isAdmin: z.boolean(),
});
```

このスキーマを使ってデータを検証（パース）します。

```typescript
const validUserData = {
  id: "a1b2c3d4-e5f6-7890-1234-567890abcdef",
  username: "JohnDoe",
  email: "john.doe@example.com",
  isAdmin: false,
};

const invalidUserData = {
  id: "not-a-uuid",
  username: "jo", // 3文字未満
  email: "john.doe", // メール形式ではない
  // isAdminプロパティが欠けている
};

try {
  // 検証成功
  const parsedUser = UserSchema.parse(validUserData);
  console.log("検証成功:", parsedUser);

  // 検証失敗 (エラーがスローされる)
  UserSchema.parse(invalidUserData);
} catch (e) {
  // ZodErrorオブジェクトが出力される
  console.error("検証失敗:", e.errors);
}
```

### 2. スキーマからの型推論 (z.infer)

Zod の非常に強力な機能の一つが、定義したスキーマから自動的に TypeScript の型を生成できることです。これにより、スキーマ定義と型定義を二重に管理する必要がなくなります。

`z.infer<typeof SchemaName>` を使います。

```typescript
// UserSchemaからTypeScriptの型を推論
type User = z.infer<typeof UserSchema>;

/*
`User`型は以下のようになります:
type User = {
    id: string;
    username: string;
    email: string;
    isAdmin: boolean;
}
*/

// 推論された型を使って、安全にコードを書ける
function displayUser(user: User) {
  console.log(user.username); // 型補完が効き、安全にアクセスできる
}
```

### 3. プロパティの修飾子

オブジェクトの各プロパティに対して、任意（optional）にしたり、デフォルト値を設定したりできます。

- `.optional()`: プロパティが存在しなくてもよい（`undefined`になることを許容する）
- `.nullable()`: プロパティの値が `null` であることを許容する
- `.default(value)`: プロパティが `undefined` の場合に、指定したデフォルト値で補完する

```typescript
const UserProfileSchema = z.object({
  userId: z.string(),

  // bioは省略可能 (string | undefined)
  bio: z.string().optional(),

  // websiteはnullを許容 (string | null)
  website: z.string().url().nullable(),

  // roleが指定されなかった場合、デフォルトで"user"になる
  role: z.enum(["user", "admin"]).default("user"),
});

// 検証例
const profileData = {
  userId: "12345",
  website: null,
  // bioとroleは省略
};

const parsedProfile = UserProfileSchema.parse(profileData);
console.log(parsedProfile);
/*
出力:
{
  userId: '12345',
  website: null,
  role: 'user' // デフォルト値が適用されている
}
*/
```

### 4. 未知のキーの扱い方

デフォルトでは、`z.object()`はスキーマに定義されていないプロパティを検証時に**除去**します。この挙動は変更可能です。

- `.strip()`: (デフォルト) 未知のキーを削除する。
- `.passthrough()`: 未知のキーをそのまま保持する。
- `.strict()`: 未知のキーが存在した場合、エラーをスローする。

```typescript
const strictSchema = z
  .object({
    name: z.string(),
  })
  .strict(); // 未知のキーを許さない

const passthroughSchema = z
  .object({
    name: z.string(),
  })
  .passthrough(); // 未知のキーを許可する

const data = {
  name: "Taro",
  age: 30, // 未知のキー
};

console.log(UserSchema.parse(data)); // { name: 'Taro', isAdmin: ... } のように、ageは除去される
console.log(passthroughSchema.parse(data)); // { name: 'Taro', age: 30 }
// strictSchema.parse(data); // ZodError: Unrecognized key(s) in object: 'age'
```

これらの基本的な概念を組み合わせることで、アプリケーションで扱う様々なオブジェクトのデータ構造を安全かつ宣言的に定義することができます。

## エラーハンドリング

Zod でバリデーションに失敗した際のエラーハンドリングには、主に 2 つの方法があります。

1.  **`parse()`** を使い、 `try...catch` ブロックでエラーを捕捉する方法
2.  **`safeParse()`** を使い、エラーを投げずに結果オブジェクトとして受け取る方法

どちらを使うかは、アプリケーションの要件やコーディングスタイルによって決まります。

---

### 1. `parse()` と `try...catch`

`parse()`メソッドは、バリデーションが成功した場合は検証済みのデータを返しますが、**失敗した場合は `ZodError` というエラーをスローします**。このエラーを `try...catch` で捕捉するのが最も基本的なエラーハンドリングです。

**特徴:**

- エラーが発生した時点で処理を中断させたい場合に適しています。
- Express のミドルウェアなどで、バリデーションエラーがあれば即座にエラーレスポンスを返したい場合などによく使われます。

**コード例:**

```typescript
import { z } from "zod";

const UserSchema = z.object({
  username: z.string().min(3, "ユーザー名は3文字以上必要です"),
  email: z.string().email("無効なメールアドレス形式です"),
});

const invalidData = {
  username: "ab", // 3文字未満
  email: "invalid-email",
};

try {
  // バリデーションを実行
  const user = UserSchema.parse(invalidData);
  console.log("バリデーション成功:", user);
} catch (e) {
  // e は ZodError のインスタンス
  if (e instanceof z.ZodError) {
    console.error("バリデーション失敗！");
    // 全てのエラー情報を表示
    console.log(e.errors);
    /*
    出力例:
    [
      {
        code: 'too_small',
        minimum: 3,
        type: 'string',
        inclusive: true,
        exact: false,
        message: 'ユーザー名は3文字以上必要です',
        path: [ 'username' ]
      },
      {
        validation: 'email',
        code: 'invalid_string',
        message: '無効なメールアドレス形式です',
        path: [ 'email' ]
      }
    ]
    */
  }
}
```

#### `ZodError` オブジェクト

`catch`ブロックで受け取る `ZodError` インスタンスには、エラーの詳細情報が含まれています。

- `e.errors` または `e.issues`: 各エラーの詳細（エラーコード、メッセージ、どのプロパティで発生したかを示す `path` など）が配列で格納されています。
- `e.format()`: エラーをネストしたオブジェクト形式に整形してくれる便利なメソッドです。UI のフォームエラー表示などで非常に役立ちます。

**`e.format()` の使用例:**

```typescript
// ... try-catchブロック内
if (e instanceof z.ZodError) {
  const formattedErrors = e.format();
  console.log(formattedErrors);
  /*
  出力例:
  {
    _errors: [],
    username: { _errors: [ 'ユーザー名は3文字以上必要です' ] },
    email: { _errors: [ '無効なメールアドレス形式です' ] }
  }
  */

  // フォームの各フィールドに対応するエラーメッセージを取得できる
  if (formattedErrors.username) {
    console.log("ユーザー名のエラー:", formattedErrors.username._errors[0]);
  }
}
```

---

### 2. `safeParse()`

`safeParse()` メソッドは、`parse()` とは異なり **エラーをスローしません**。代わりに、バリデーションの結果を格納したオブジェクトを返します。

**特徴:**

- `try...catch`構文を使わずに、条件分岐でスマートに処理を書きたい場合に最適です。
- エラーが発生してもプログラムを中断させず、エラー情報を値として扱いたい場合に便利です。

**返り値の型:**

- **成功時:** `{ success: true, data: (検証済みデータ) }`
- **失敗時:** `{ success: false, error: (ZodErrorインスタンス) }`

**コード例:**

```typescript
import { z } from "zod";

const UserSchema = z.object({
  username: z.string().min(3),
  email: z.string().email(),
});

const invalidData = {
  username: "ab",
  email: "invalid-email",
};

const result = UserSchema.safeParse(invalidData);

if (result.success) {
  // バリデーション成功
  console.log("成功しました:", result.data);
} else {
  // バリデーション失敗
  console.error("失敗しました");
  // result.error は ZodError インスタンスなので、.format() などが使える
  const formattedErrors = result.error.format();
  console.log(formattedErrors);
}
```

---

### 非同期のバリデーション

`.refine()` などで非同期の検証処理（例: データベースへの問い合わせ）を追加した場合、`parse()` や `safeParse()` の代わりに非同期版のメソッドを使います。

- **`parseAsync()`**: `Promise`を返します。失敗すると `Promise` が `reject` されます。`await` と `try...catch` を使ってハンドリングします。
- **`safeParseAsync()`**: `Promise`を返します。`resolve` される値が `safeParse` と同じ結果オブジェクト (`{ success, data/error }`) になります。

---

### まとめ

| メソッド          | 挙動                                       | 主なユースケース                                                      |
| :---------------- | :----------------------------------------- | :-------------------------------------------------------------------- |
| **`parse()`**     | 失敗時に **エラーをスロー** する           | エラー時に即座に処理を中断・分岐させたい場合 (例: API のミドルウェア) |
| **`safeParse()`** | 成功/失敗を示す **結果オブジェクトを返す** | エラーを値として扱い、`if`文などで柔軟に後続処理を制御したい場合      |

どちらの方法も最終的に同じ `ZodError` オブジェクトにアクセスできるため、取得できるエラー情報の質は同じです。プロジェクトのコーディング規約や、その場の状況に応じて最適なものを選択してください。一般的には、予期せぬエラーでプログラムを停止させない **`safeParse()` の方がより安全で扱いやすい** と考えられています。

---
