# Session2: 高度な型機能実践演習（90分）

> 💡 **対象**: Session1完了者（条件型・infer・マップ型基礎習得済み）
> 🎯 **形式**: 講師サポート付き実践学習
> ⏰ **時間**: 90分

## 📚 関連補足資料

このセッションの学習をサポートする補足資料をご用意しています：

- 💻 **[実践コード例](./Step10_補足_実践コード例.md)** - より実践的な例とシステム実装
- 📖 **[専門用語集](./Step10_補足_専門用語集.md)** - テンプレートリテラル型・再帰的型などの詳細解説
- 🚨 **[トラブルシューティング](./Step10_補足_トラブルシューティング.md)** - 高度な型機能エラーの対処法
- 🌐 **[参考リソース](./Step10_補足_参考リソース.md)** - さらなる学習のためのリソース
- 🔧 **[開発環境ガイド](./Step10_補足_開発環境ガイド.md)** - 開発効率を上げる設定

> 💡 **活用方法**: 学習中に疑問が生じた際や、より深く理解したい場合に参照してね 🐰

## 📅 セッション概要

**学習目標**:

- [ ] テンプレートリテラル型の実践的な活用方法を習得する
- [ ] 再帰的型定義による型レベルプログラミングを理解する
- [ ] 複雑な型操作を組み合わせた実用的なシステムを構築する
- [ ] 分散条件付き型と高度なマップ型パターンを実践する

**前提知識**:

- Session1の内容（条件型・infer・マップ型基礎）
- Step05のジェネリクス知識（型パラメータ、制約、型推論）
- Step06のユーティリティ型知識（Pick、Omit、Partial等）

---

## ⏰ 詳細タイムテーブル

| 時間         | 内容                           | 講師の役割           | 学習者の活動     | 成果物       |
| ------------ | ------------------------------ | -------------------- | ---------------- | ------------ |
| **0-10分**   | 前回復習・今回目標             | 復習確認・目標提示   | 振り返り・質問   | 理解確認     |
| **10-50分**  | テンプレートリテラル型実践     | 実演・個別指導       | ハンズオン・実践 | 実践コード   |
| **50-80分**  | 型レベルプログラミング演習     | コードレビュー・助言 | 個人開発         | システム実装 |
| **80-90分**  | 成果共有・質疑応答             | ファシリテート       | 発表・討論       | 学習成果     |

---

## 📚 学習内容

### Section 1: テンプレートリテラル型の実践活用

> 📚 **関連資料**: [実践コード例 - テンプレートリテラル型の実用的実装](./Step10_補足_実践コード例.md#基本的なテンプレートリテラル型) | [専門用語集 - テンプレートリテラル型](./Step10_補足_専門用語集.md#テンプレートリテラル型template-literal-types)

#### 🔧 文字列操作と型安全性

テンプレートリテラル型は、TypeScript 4.1で導入された機能で、文字列の型レベル操作を可能にします。Session1で学習した条件型と組み合わせることで、強力な型システムを構築できます。

```typescript
// 基本的なテンプレートリテラル型
type Greeting<T extends string> = `Hello, ${T}!`;
type PersonalGreeting = Greeting<"Alice">; // "Hello, Alice!"

// 文字列操作ユーティリティ（TypeScript組み込み）
type UpperName = Uppercase<"alice">; // "ALICE"
type LowerName = Lowercase<"ALICE">; // "alice"
type CapitalName = Capitalize<"alice">; // "Alice"
type UncapitalName = Uncapitalize<"Alice">; // "alice"

// 実用的なイベント名生成
type EventName<T extends string> = `on${Capitalize<T>}`;
type EventHandler<T extends string> = `handle${Capitalize<T>}`;

type ClickEvent = EventName<"click">; // "onClick"
type ClickHandler = EventHandler<"click">; // "handleClick"

// Step07のAPI設計知識を活用したエンドポイント型
type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";
type ApiEndpoint<Method extends HttpMethod, Path extends string> = `${Method} ${Path}`;

type UserEndpoints =
  | ApiEndpoint<"GET", "/users">
  | ApiEndpoint<"POST", "/users">
  | ApiEndpoint<"PUT", "/users/:id">
  | ApiEndpoint<"DELETE", "/users/:id">;
// "GET /users" | "POST /users" | "PUT /users/:id" | "DELETE /users/:id"
```

#### CSS型安全性とパス操作

```typescript
// CSS プロパティの型生成
type CSSProperty<Property extends string, Value extends string | number> = `${Property}: ${Value}`;

type ColorProperty = CSSProperty<"color", "red" | "blue" | "green">;
// "color: red" | "color: blue" | "color: green"

type SizeProperty = CSSProperty<"font-size", `${number}px` | `${number}rem`>;
// "font-size: 16px" | "font-size: 1rem" など

// パスの型安全な結合
type Join<T extends readonly string[], Separator extends string = "/"> = T extends readonly [
  infer First,
  ...infer Rest
]
  ? First extends string
    ? Rest extends readonly string[]
      ? Rest["length"] extends 0
        ? First
        : `${First}${Separator}${Join<Rest, Separator>}`
      : never
    : never
  : "";

type ApiPath = Join<["api", "v1", "users", "profile"]>; // "api/v1/users/profile"

// 文字列の分割
type Split<S extends string, Delimiter extends string> = S extends `${infer Head}${Delimiter}${infer Tail}`
  ? [Head, ...Split<Tail, Delimiter>]
  : [S];

type PathSegments = Split<"api/v1/users", "/">; // ["api", "v1", "users"]
```

### 練習問題 2.1: テンプレートリテラル型応用 🔰

以下の要件を満たすテンプレートリテラル型を作成してください：

```typescript
// 要件: SQLのSELECT文を型安全に生成する型
type SelectQuery<Table extends string, Columns extends string> = /* ここを実装 */;

// テストケース
type UserQuery = SelectQuery<"users", "id" | "name" | "email">;
// "SELECT id, name, email FROM users"

type ProductQuery = SelectQuery<"products", "id" | "title" | "price">;
// "SELECT id, title, price FROM products"
```

### Section 2: 再帰的型定義と型レベルプログラミング

> 📚 **関連資料**: [専門用語集 - 再帰的型](./Step10_補足_専門用語集.md#再帰的型recursive-types) | [実践コード例 - 配列の型レベル操作](./Step10_補足_実践コード例.md#配列の型レベル操作)

#### 🎯 配列操作の型レベル実装

再帰的型定義により、配列やオブジェクトの複雑な操作を型レベルで実現できます。

```typescript
// 配列の長さを型レベルで計算
type Length<T extends readonly any[]> = T["length"];
type ArrayLength = Length<[1, 2, 3, 4]>; // 4

// 配列の要素操作
type Head<T extends readonly any[]> = T extends readonly [infer H, ...any[]] ? H : never;
type Tail<T extends readonly any[]> = T extends readonly [any, ...infer T] ? T : never;

type FirstElement = Head<[1, 2, 3]>; // 1
type RestElements = Tail<[1, 2, 3]>; // [2, 3]

// 配列の反転（再帰的実装）
type Reverse<T extends readonly any[]> = T extends readonly [...infer Rest, infer Last]
  ? [Last, ...Reverse<Rest>]
  : [];

type ReversedArray = Reverse<[1, 2, 3, 4]>; // [4, 3, 2, 1]

// 型レベルでの数値計算（制限あり）
type Add<A extends number, B extends number> = [
  ...Array<A>,
  ...Array<B>
]["length"] extends number
  ? [...Array<A>, ...Array<B>]["length"]
  : never;

type Sum = Add<2, 3>; // 5（小さな数値のみ対応）
```

#### オブジェクトパスの型安全な操作

```typescript
// ネストしたオブジェクトのパス型を生成
type Paths<T> = T extends object
  ? {
      [K in keyof T]: K extends string
        ? T[K] extends object
          ? K | `${K}.${Paths<T[K]>}`
          : K
        : never;
    }[keyof T]
  : never;

interface NestedObject {
  user: {
    profile: {
      name: string;
      settings: {
        theme: string;
      };
    };
    id: number;
  };
  config: {
    api: string;
  };
}

type ObjectPaths = Paths<NestedObject>;
// "user" | "config" | "user.profile" | "user.id" | "user.profile.name" |
// "user.profile.settings" | "user.profile.settings.theme" | "config.api"

// パスによる型安全な値取得
type GetByPath<T, P extends string> = P extends keyof T
  ? T[P]
  : P extends `${infer K}.${infer Rest}`
  ? K extends keyof T
    ? GetByPath<T[K], Rest>
    : never
  : never;

// 型安全なget関数の実装
function get<T, P extends Paths<T>>(obj: T, path: P): GetByPath<T, P> {
  const keys = path.split(".");
  let result: any = obj;

  for (const key of keys) {
    result = result[key];
  }

  return result;
}

// 使用例
const nestedObj: NestedObject = {
  user: {
    profile: {
      name: "Alice",
      settings: {
        theme: "dark",
      },
    },
    id: 1,
  },
  config: {
    api: "https://api.example.com",
  },
};

const userName = get(nestedObj, "user.profile.name"); // string型
const theme = get(nestedObj, "user.profile.settings.theme"); // string型
// const invalid = get(nestedObj, "user.invalid"); // ❌ 型エラー
```

### 練習問題 2.2: 再帰的型実践 🔰

以下の要件を満たす再帰的型を作成してください：

```typescript
// 要件: 配列をフラット化する型
type Flatten<T extends readonly any[]> = /* ここを実装 */;

// テストケース
type Test1 = Flatten<[1, [2, 3], [4, [5, 6]]]>; // [1, 2, 3, 4, 5, 6]
type Test2 = Flatten<[string, [number, boolean]]>; // [string, number, boolean]
```

### Section 3: 高度な型システム設計

#### 🎯 メイン演習: 型安全なフォームシステム

Session1とSession2で学習した内容を統合して、型安全なフォームシステムを構築します。

```typescript
// フォームフィールドの基本型定義
type FieldType = "text" | "number" | "email" | "password" | "checkbox" | "select";

// 値の型をフィールドタイプから推論
type FieldValue<T extends FieldType> = T extends "text" | "email" | "password"
  ? string
  : T extends "number"
  ? number
  : T extends "checkbox"
  ? boolean
  : T extends "select"
  ? string
  : never;

// フィールド設定の型
type FieldConfig<T extends FieldType> = {
  type: T;
  label: string;
  required?: boolean;
  placeholder?: T extends "text" | "email" | "password" ? string : never;
  min?: T extends "number" ? number : never;
  max?: T extends "number" ? number : never;
  options?: T extends "select" ? readonly string[] : never;
};

// フォームスキーマの定義
type FormSchema = Record<string, FieldConfig<FieldType>>;

// フォーム値の型をスキーマから生成
type FormValues<T extends FormSchema> = {
  [K in keyof T]: T[K] extends FieldConfig<infer U> ? FieldValue<U> : never;
};

// バリデーションエラーの型
type ValidationErrors<T extends FormSchema> = {
  [K in keyof T]?: string[];
};

// フォームの状態管理型
type FormState<T extends FormSchema> = {
  values: FormValues<T>;
  errors: ValidationErrors<T>;
  touched: Partial<Record<keyof T, boolean>>;
  isValid: boolean;
  isSubmitting: boolean;
};

// 使用例
const userFormSchema = {
  name: {
    type: "text" as const,
    label: "名前",
    required: true,
    placeholder: "お名前を入力してください",
  },
  email: {
    type: "email" as const,
    label: "メールアドレス",
    required: true,
    placeholder: "email@example.com",
  },
  age: {
    type: "number" as const,
    label: "年齢",
    min: 0,
    max: 120,
  },
  newsletter: {
    type: "checkbox" as const,
    label: "ニュースレターを受け取る",
  },
  role: {
    type: "select" as const,
    label: "役職",
    options: ["developer", "designer", "manager"] as const,
  },
} as const;

type UserFormValues = FormValues<typeof userFormSchema>;
// {
//   name: string;
//   email: string;
//   age: number;
//   newsletter: boolean;
//   role: string;
// }

type UserFormState = FormState<typeof userFormSchema>;

// 型安全なフォームハンドラー
function createFormHandler<T extends FormSchema>(schema: T) {
  return {
    validate: (values: FormValues<T>): ValidationErrors<T> => {
      const errors: ValidationErrors<T> = {};
      
      for (const [key, config] of Object.entries(schema)) {
        const value = values[key as keyof T];
        const fieldErrors: string[] = [];

        if (config.required && (!value || value === "")) {
          fieldErrors.push(`${config.label}は必須です`);
        }

        if (config.type === "number" && typeof value === "number") {
          if (config.min !== undefined && value < config.min) {
            fieldErrors.push(`${config.label}は${config.min}以上である必要があります`);
          }
          if (config.max !== undefined && value > config.max) {
            fieldErrors.push(`${config.label}は${config.max}以下である必要があります`);
          }
        }

        if (fieldErrors.length > 0) {
          errors[key as keyof T] = fieldErrors;
        }
      }

      return errors;
    },

    submit: async (values: FormValues<T>): Promise<void> => {
      // 送信処理の実装
      console.log("Submitting:", values);
    },
  };
}

// 使用例
const userFormHandler = createFormHandler(userFormSchema);

const formValues: UserFormValues = {
  name: "Alice",
  email: "alice@example.com",
  age: 25,
  newsletter: true,
  role: "developer",
};

const errors = userFormHandler.validate(formValues);
```

---

## 👨‍🏫 学習ポイント

### 🤔 よくある質問と回答

**Q: テンプレートリテラル型はいつ使うべきですか？**
A: 文字列の型レベル操作が必要な場合に使用します。API エンドポイント、CSS プロパティ、イベント名の生成など、文字列パターンを型安全に扱いたい場面で威力を発揮します。

**Q: 再帰的型定義で無限ループになることはありますか？**
A: TypeScript には再帰の深度制限があるため、通常は無限ループにはなりません。ただし、複雑すぎる再帰型は型チェックのパフォーマンスに影響する可能性があります。

**Q: 型レベルプログラミングは実際の開発で使うべきですか？**
A: 適度に使用することで型安全性と開発体験が向上しますが、過度に複雑にすると保守性が下がります。チームの理解度と必要性を考慮して使用しましょう。

---

**📌 重要**: Session2では実践的なコーディングを通じて高度な型機能の活用を体感します。完璧を目指さず、まずは動くコードを作ることを重視しましょう。

**🌟 次回（Session3）は、型レベル設計プロジェクトの完成と学習の総括を行います！**