# Session 4: TypeScript Generics × コンポーネント ― 型安全な汎用設計

## はじめに：「どんなデータでも使える」コンポーネントを作りたい

Session 1 で TypeScript の基本的な型定義を学びました。しかし、実務では次のような場面に直面します。

```tsx
// ドロップダウンのコンポーネントを作りたい
// でも、選択肢のデータ型は使う場面によって違う...

// ユーザー選択ドロップダウン: User 型のリスト
<Dropdown items={users} onSelect={handleSelectUser} />

// カテゴリ選択ドロップダウン: Category 型のリスト
<Dropdown items={categories} onSelect={handleSelectCategory} />

// 国選択ドロップダウン: Country 型のリスト
<Dropdown items={countries} onSelect={handleSelectCountry} />
```

これらは全て「リストから1つ選ぶ」という同じ機能ですが、データの型が違います。型を `any` にすれば動きますが、それでは TypeScript を使う意味がありません。

### Generics が解決すること

**Generics（ジェネリクス）** を使うと、**「使う時にデータ型が決まる」** コンポーネントを作れます。

```tsx
// T は「使う時に決まる型」のプレースホルダー
function Dropdown<T>({ items, onSelect }: { items: T[]; onSelect: (item: T) => void }) {
  // ...
}

// 使う時に T が具体的な型に置き換わる
<Dropdown<User> items={users} onSelect={(user) => console.log(user.name)} />
//        ^^^^
//        T = User に確定！
```

> **このセッションのゴール**: Generics を使って、型安全かつ再利用可能なコンポーネントとフックを設計できるようになる

---

## 1. Generics の基本 ― 「型のパラメータ」

### 1.1 関数の Generics

まず、コンポーネントの前に、普通の関数で Generics を理解しましょう。

```tsx
// ❌ Generics なし: 型ごとに別の関数が必要
function getFirstString(arr: string[]): string | undefined {
  return arr[0];
}
function getFirstNumber(arr: number[]): number | undefined {
  return arr[0];
}

// ✅ Generics あり: 1つの関数で全ての型に対応
function getFirst<T>(arr: T[]): T | undefined {
  return arr[0];
}
```

**コード解説:**

```tsx
function getFirst<T>(arr: T[]): T | undefined {
//               ^^^      ^^^    ^^^
//               |        |      |
//               |        |      戻り値も T（同じ型）
//               |        引数は T の配列
//               型パラメータ（「T はまだ決まっていない」）
```

**使う時:**

```tsx
// TypeScript が型を自動推論する（明示しなくてOK）
const firstUser = getFirst(users);        // User | undefined と推論
const firstNumber = getFirst([1, 2, 3]);  // number | undefined と推論
const firstName = getFirst(["a", "b"]);   // string | undefined と推論

// 明示的に指定することもできる
const first = getFirst<Product>(products);
```

### 1.2 なぜ `any` ではなく Generics なのか

```tsx
// ❌ any を使う（型安全性ゼロ）
function getFirst(arr: any[]): any {
  return arr[0];
}
const user = getFirst(users);
user.hogehoge;  // エラーにならない！実行時にクラッシュ

// ✅ Generics を使う（型安全性を維持）
function getFirst<T>(arr: T[]): T | undefined {
  return arr[0];
}
const user = getFirst(users);
user?.hogehoge;  // ❌ TypeScript エラー！User に hogehoge は存在しない
```

`any` は「型チェックをオフにする」。Generics は「型チェックを維持したまま柔軟にする」。全くの別物です。

---

## 2. React コンポーネントに Generics を適用する

### 2.1 汎用リストコンポーネント

最も基本的な例として、どんなデータでも表示できるリストコンポーネントを作ります。

```tsx
// ❌ 型が固定されている（User専用）
type UserListProps = {
  items: User[];
  renderItem: (item: User) => React.ReactNode;
};

function UserList({ items, renderItem }: UserListProps) {
  return <ul>{items.map((item, i) => <li key={i}>{renderItem(item)}</li>)}</ul>;
}
```

これを Generics で汎用化します:

```tsx
// ✅ どんな型のリストでも表示できる
type ListProps<T> = {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  keyExtractor: (item: T) => string | number;
};

function List<T>({ items, renderItem, keyExtractor }: ListProps<T>) {
  return (
    <ul>
      {items.map((item) => (
        <li key={keyExtractor(item)}>{renderItem(item)}</li>
      ))}
    </ul>
  );
}
```

**コード解説:**

```tsx
type ListProps<T> = {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  keyExtractor: (item: T) => string | number;
};
```

- `ListProps<T>` の `<T>` は型パラメータ。この型は「使う時に決まる」
- `items: T[]` → 配列の要素の型が T
- `renderItem: (item: T) => React.ReactNode` → T を受け取って JSX を返す関数
- `keyExtractor: (item: T) => string | number` → T から React の key を取り出す関数

```tsx
function List<T>(...) {
//           ^^^
// コンポーネント関数にも <T> を付ける
```

**使い方:**

```tsx
// ユーザー一覧
type User = { id: number; name: string; email: string };

<List<User>
  items={users}
  renderItem={(user) => (
    <div>
      <strong>{user.name}</strong>
      <span>{user.email}</span>
    </div>
  )}
  keyExtractor={(user) => user.id}
/>

// 商品一覧（同じ List コンポーネントを再利用！）
type Product = { sku: string; name: string; price: number };

<List<Product>
  items={products}
  renderItem={(product) => (
    <div>
      <span>{product.name}</span>
      <span>¥{product.price.toLocaleString()}</span>
    </div>
  )}
  keyExtractor={(product) => product.sku}
/>
```

**ポイント**: 同じ `List` コンポーネントが `User` にも `Product` にも型安全に対応しています。`renderItem` の引数が自動的に正しい型になるので、`user.name` や `product.price` とタイプすると補完が効きます。

### 2.2 型制約（`extends`）― 「最低限これは持っていてほしい」

上の `List` は何でも受け入れますが、「最低限 `id` を持っているデータだけ」に制限したい場合があります。

```tsx
// T は「最低限 id を持つオブジェクト」に制限
type ListProps<T extends { id: string | number }> = {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
};

function List<T extends { id: string | number }>({
  items,
  renderItem,
}: ListProps<T>) {
  return (
    <ul>
      {items.map((item) => (
        // keyExtractor が不要！id があることが保証されている
        <li key={item.id}>{renderItem(item)}</li>
      ))}
    </ul>
  );
}
```

**コード解説:**

```tsx
T extends { id: string | number }
//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
// 「T は { id: string | number } を拡張した型でなければならない」
// つまり「T は最低限 id プロパティを持っている」ことが保証される
```

```tsx
// ✅ OK - id を持っている
<List items={[{ id: 1, name: "太郎" }]} renderItem={(u) => <span>{u.name}</span>} />

// ❌ エラー - id を持っていない
<List items={[{ name: "太郎" }]} renderItem={(u) => <span>{u.name}</span>} />
// エラー: '{ name: string }' は '{ id: string | number }' の制約を満たしません
```

---

## 3. 汎用 Select コンポーネント ― 実践的な設計

ここまでの知識を組み合わせて、実務で使える汎用セレクト（ドロップダウン）コンポーネントを作ります。

### 3.1 要件

- どんなデータ型のリストでも使える
- 選択されたアイテムの型が正しく推論される
- 表示テキストのカスタマイズが自由にできる
- 型安全（不正な値を渡すとコンパイルエラー）

### 3.2 実装

```tsx
type SelectProps<T> = {
  items: T[];
  value: T | null;
  onChange: (item: T) => void;
  getLabel: (item: T) => string;
  getValue: (item: T) => string | number;
  placeholder?: string;
};

function Select<T>({
  items,
  value,
  onChange,
  getLabel,
  getValue,
  placeholder = "選択してください",
}: SelectProps<T>) {
  const selectedValue = value ? getValue(value) : "";

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = items.find(
      (item) => String(getValue(item)) === e.target.value
    );
    if (selected) onChange(selected);
  };

  return (
    <select value={String(selectedValue)} onChange={handleChange}>
      <option value="" disabled>
        {placeholder}
      </option>
      {items.map((item) => (
        <option key={String(getValue(item))} value={String(getValue(item))}>
          {getLabel(item)}
        </option>
      ))}
    </select>
  );
}
```

**コード解説:**

```tsx
getLabel: (item: T) => string;
getValue: (item: T) => string | number;
```

「T からラベルを取り出す方法」「T から値を取り出す方法」を関数として受け取ります。これにより、コンポーネント内部は T の具体的な構造を知らなくてもよくなります。

**使い方:**

```tsx
// ユーザー選択
type User = { id: number; name: string; department: string };

function UserSelect() {
  const [selected, setSelected] = useState<User | null>(null);
  const users: User[] = [
    { id: 1, name: "田中太郎", department: "開発部" },
    { id: 2, name: "鈴木花子", department: "デザイン部" },
  ];

  return (
    <Select<User>
      items={users}
      value={selected}
      onChange={setSelected}
      getLabel={(user) => `${user.name}（${user.department}）`}
      getValue={(user) => user.id}
      placeholder="担当者を選択"
    />
  );
}

// 国選択（同じ Select コンポーネント！）
type Country = { code: string; name: string; flag: string };

function CountrySelect() {
  const [selected, setSelected] = useState<Country | null>(null);
  const countries: Country[] = [
    { code: "JP", name: "日本", flag: "🇯🇵" },
    { code: "US", name: "アメリカ", flag: "🇺🇸" },
  ];

  return (
    <Select<Country>
      items={countries}
      value={selected}
      onChange={setSelected}
      getLabel={(country) => `${country.flag} ${country.name}`}
      getValue={(country) => country.code}
      placeholder="国を選択"
    />
  );
}
```

---

## 4. Discriminated Union ― 状態に応じた型の出し分け

### 4.1 問題：API レスポンスの状態管理

API からデータを取得するとき、3つの状態があります。

```tsx
// ❌ 素朴な型定義 - 矛盾が起きうる
type ApiState = {
  data: User[] | null;
  error: string | null;
  isLoading: boolean;
};

// これが許されてしまう（矛盾！）
const state: ApiState = {
  data: [{ id: 1, name: "太郎" }],
  error: "エラーが発生しました",  // data があるのにエラー？？
  isLoading: true,                 // ローディング中なのにデータがある？？
};
```

### 4.2 Discriminated Union で矛盾を防ぐ

```tsx
// ✅ Discriminated Union - 各状態を明確に区別
type ApiState<T> =
  | { status: "loading" }
  | { status: "error"; error: string }
  | { status: "success"; data: T };
```

**コード解説:**

```tsx
type ApiState<T> =
  | { status: "loading" }                    // ローディング中。data も error もない。
  | { status: "error"; error: string }       // エラー。error はあるが data はない。
  | { status: "success"; data: T };          // 成功。data はあるが error はない。
```

`status` プロパティが **判別子（discriminant）** です。この値で TypeScript はどの型かを判別できます。

### 4.3 コンポーネントで使う

```tsx
type User = { id: number; name: string };

function UserPage() {
  const [state, setState] = useState<ApiState<User[]>>({ status: "loading" });

  useEffect(() => {
    fetch("/api/users")
      .then((res) => res.json())
      .then((data) => setState({ status: "success", data }))
      .catch((err) => setState({ status: "error", error: err.message }));
  }, []);

  // TypeScript が状態ごとに型を絞り込んでくれる（型の絞り込み = narrowing）
  switch (state.status) {
    case "loading":
      return <p>読み込み中...</p>;

    case "error":
      return <p>エラー: {state.error}</p>;
      //                 ^^^^^^^^^^^
      // ✅ TypeScript が state.error の存在を保証

    case "success":
      return (
        <ul>
          {state.data.map((user) => (
            //   ^^^^^^^^^^
            // ✅ TypeScript が state.data の存在を保証
            <li key={user.id}>{user.name}</li>
          ))}
        </ul>
      );
  }
}
```

**核心的なポイント:**

```tsx
case "error":
  return <p>エラー: {state.error}</p>;
  // ここでは state は { status: "error"; error: string } 型に絞り込まれている
  // → state.error は string であることが保証される
  // → state.data にアクセスしようとするとエラーになる（存在しないから）
```

これが **型の絞り込み（narrowing）** です。`switch` の `case` で `status` を見ることで、TypeScript がその時点での型を正確に推論してくれます。

### 4.4 汎用カスタムフックに応用

```tsx
// useFetch.ts - Discriminated Union を使った汎用フック

function useFetch<T>(url: string): ApiState<T> {
  const [state, setState] = useState<ApiState<T>>({ status: "loading" });

  useEffect(() => {
    setState({ status: "loading" });

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data: T) => setState({ status: "success", data }))
      .catch((err) => setState({ status: "error", error: err.message }));
  }, [url]);

  return state;
}
```

**使い方:**

```tsx
function UserPage() {
  const state = useFetch<User[]>("/api/users");

  switch (state.status) {
    case "loading":
      return <Spinner />;
    case "error":
      return <ErrorMessage message={state.error} />;
    case "success":
      return <UserList users={state.data} />;
  }
}
```

---

## 5. ユーティリティ型 ― 既存の型を変換する

TypeScript には、既存の型を変換するための便利な **ユーティリティ型** があります。

### 5.1 よく使うユーティリティ型一覧

```tsx
type User = {
  id: number;
  name: string;
  email: string;
  age: number;
};

// Partial<T> - 全プロパティをオプショナルに
type PartialUser = Partial<User>;
// → { id?: number; name?: string; email?: string; age?: number }
// 用途: 更新フォーム（全フィールドの入力が必須ではない）

// Pick<T, K> - 特定のプロパティだけ取り出す
type UserSummary = Pick<User, "id" | "name">;
// → { id: number; name: string }
// 用途: 一覧表示（全フィールドは不要）

// Omit<T, K> - 特定のプロパティを除外する
type CreateUserInput = Omit<User, "id">;
// → { name: string; email: string; age: number }
// 用途: 新規作成（id はサーバーが自動付与）

// Record<K, V> - キーと値の型を指定したオブジェクト
type StatusLabels = Record<"active" | "inactive" | "pending", string>;
// → { active: string; inactive: string; pending: string }
```

### 5.2 実践：編集フォームでの活用

```tsx
type User = {
  id: number;
  name: string;
  email: string;
  role: "admin" | "user" | "guest";
};

// 編集フォームのProps - id以外を編集可能にする
type EditUserFormProps = {
  user: User;
  onSave: (updates: Partial<Omit<User, "id">>) => void;
  //                ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  // 「id以外のフィールドの、一部または全部」を受け取る関数
};

function EditUserForm({ user, onSave }: EditUserFormProps) {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 変更があったフィールドだけ送信
    const updates: Partial<Omit<User, "id">> = {};
    if (name !== user.name) updates.name = name;
    if (email !== user.email) updates.email = email;
    onSave(updates);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <input value={email} onChange={(e) => setEmail(e.target.value)} />
      <button type="submit">保存</button>
    </form>
  );
}
```

**コード解説:**

```tsx
Partial<Omit<User, "id">>
```

これは2段階の型変換です：
1. `Omit<User, "id">` → `{ name: string; email: string; role: "admin" | "user" | "guest" }`（id を除外）
2. `Partial<...>` → `{ name?: string; email?: string; role?: "admin" | "user" | "guest" }`（全てオプショナルに）

結果として「id 以外のフィールドを、一部だけ渡してもOK」な型になります。

---

## 6. 練習問題

### 課題: 汎用テーブルコンポーネント

Generics を使って、どんなデータでも表示できるテーブルコンポーネントを作ってください。

**使い方のイメージ:**

```tsx
type Column<T> = {
  header: string;
  accessor: keyof T;  // T のどのプロパティを表示するか
};

// ユーザーテーブル
<Table<User>
  data={users}
  columns={[
    { header: "名前", accessor: "name" },
    { header: "メール", accessor: "email" },
  ]}
  keyExtractor={(user) => user.id}
/>

// 商品テーブル（同じ Table コンポーネント！）
<Table<Product>
  data={products}
  columns={[
    { header: "商品名", accessor: "name" },
    { header: "価格", accessor: "price" },
  ]}
  keyExtractor={(product) => product.sku}
/>
```

**ヒント:**
- `T[keyof T]` でプロパティの値の型にアクセスできます
- `String(item[column.accessor])` で表示用の文字列に変換できます

---

## 7. セルフチェック

1. `<T>` は何を意味するか？`any` との違いは？
2. `T extends { id: number }` はどんな制約を表すか？
3. Discriminated Union の「判別子（discriminant）」とは何か？
4. `Partial<T>`, `Pick<T, K>`, `Omit<T, K>` はそれぞれどんな型変換を行うか？
5. 汎用 Select コンポーネントで `getLabel` と `getValue` を関数として受け取る理由は何か？

> **次のセッション**: 学んだ全てのパターンを組み合わせて、プロダクション品質のフォルダ構成と設計を実践します。
