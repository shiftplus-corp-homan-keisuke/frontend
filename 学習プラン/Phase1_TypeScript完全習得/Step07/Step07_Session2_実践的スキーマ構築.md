# Session2: 実践的スキーマ構築（45 分）

> 💡 **対象**: Session1 完了者（Zod 基本概念・スキーマ定義習得済み）
> 🎯 **形式**: 講師サポート付き実装演習
> ⏰ **時間**: 45 分（実習中心）

## 📅 セッション概要

## ステップ 1：より複雑なデータ構造を学ぶ

プリミティブとオブジェクトを組み合わせ、さらに複雑なデータ構造を定義する方法です。

### 1. 配列 (`z.array()`)

特定のスキーマの要素を持つ配列を定義します。

```typescript
import { z } from "zod";

// 文字列の配列
const TagSchema = z.array(z.string().min(1));

// オブジェクトの配列
const UserSchema = z.object({ id: z.number(), name: z.string() });
const UserListSchema = z.array(UserSchema);

// 使用例
TagSchema.parse(["typescript", "zod"]); // OK
UserListSchema.parse([
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" },
]); // OK
```

### 2. Union (`z.union()` / `z.discriminatedUnion()`)

複数の型のうち、いずれか一つであることを許容するスキーマです。特に `discriminatedUnion` は非常に強力です。

- **`z.union()`**: 型のいずれかに一致すれば OK。
- **`z.discriminatedUnion()`**: オブジェクトの特定のプロパティ（discriminator）の値によって、どのスキーマで検証するかを判断します。これにより、TypeScript の型推論が非常に賢くなります。

```typescript
const EventSchema = z.union([
  z.object({ type: z.literal("click"), x: z.number(), y: z.number() }),
  z.object({ type: z.literal("keypress"), key: z.string() }),
]);

// discriminatedUnion の例
const EventSchema = z.discriminatedUnion([
  z.object({ type: z.literal("click"), x: z.number(), y: z.number() }),
  z.object({ type: z.literal("keypress"), key: z.string() }),
]);

type Event = z.infer<typeof EventSchema>;

function handleEvent(event: Event) {
  // event.type の値によって、他のプロパティの型が確定する！
  if (event.type === "click") {
    console.log(event.x, event.y); // OK
  } else {
    console.log(event.key); // OK
  }
}
```

---

## ステップ 2：カスタムバリデーションとデータ変換

Zod が提供するルールだけでは表現できない、独自のビジネスロジックを追加する方法です。

### 1. カスタム検証 (`.refine()`)

スキーマの検証が通った後で、さらに追加の検証ルールを定義できます。「パスワードと確認用パスワードが一致しているか」といったチェックによく使われます。

```typescript
const PasswordSchema = z
  .object({
    password: z.string().min(8),
    passwordConfirm: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "パスワードが一致しません",
    path: ["passwordConfirm"], // エラーメッセージをどのフィールドに関連付けるか
  });
```

### 2. データ変換 (`.transform()`)

検証が成功した後のデータを、別の形式に変換します。例えば、`firstName`と`lastName`から`fullName`を生成する、といった使い方ができます。

```typescript
const NameSchema = z
  .object({
    firstName: z.string(),
    lastName: z.string(),
  })
  .transform((data) => ({
    ...data,
    fullName: `${data.firstName} ${data.lastName}`,
  }));

const result = NameSchema.parse({ firstName: "Taro", lastName: "Yamada" });
console.log(result.fullName); // "Taro Yamada"
```

### 3. 型強制 (`z.coerce`)

入力データを検証前に特定の型に強制的に変換します。URL のクエリパラメータ（全て文字列）を数値や真偽値に変換する際に非常に便利です。

```typescript
const QuerySchema = z.object({
  // "123" という文字列を number 型の 123 に変換してから検証する
  page: z.coerce.number().int().positive().default(1),
});

const result = QuerySchema.parse({ page: "2" });
console.log(result.page); // number 型の 2
```

---

## ステップ 3：既存スキーマの操作

一度定義したスキーマを再利用して、新しいスキーマを効率的に作成する方法です。

### 1. 拡張 (`.extend()`) と 結合 (`.merge()`)

- `.extend()`: 既存のオブジェクトスキーマに新しいプロパティを追加します。
- `.merge()`: 2 つのオブジェクトスキーマを 1 つに結合します。

```typescript
const BaseUser = z.object({ id: z.string(), name: z.string() });
const UserWithRole = BaseUser.extend({
  role: z.enum(["user", "admin"]),
});
```

### 2. 部分的なスキーマ作成 (`.pick()`, `.omit()`, `.partial()`)

- `.pick()`: 特定のプロパティだけを抽出した新しいスキーマを作成します。
- `.omit()`: 特定のプロパティを除外した新しいスキーマを作成します。
- `.partial()`: 全てのプロパティをオプショナル (`.optional()`) にした新しいスキーマを作成します。これは更新処理（PATCH リクエストなど）のバリデーションに非常に役立ちます。

```typescript
const User = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
});

// idとnameだけを持つスキーマ
const UserIdentity = User.pick({ id: true, name: true });

// 全てのプロパティがオプショナルなスキーマ（ユーザー情報更新用）
const UserUpdateSchema = User.partial();
```
