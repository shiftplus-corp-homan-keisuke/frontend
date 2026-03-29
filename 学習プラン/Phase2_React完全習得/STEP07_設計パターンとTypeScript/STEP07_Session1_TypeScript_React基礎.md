# Session 1: TypeScript × React 基礎 ― 型で守るコンポーネント設計

## はじめに：なぜ React に TypeScript が必要なのか？

これまでの学習では、React コンポーネントを JavaScript（JSX）で書いてきました。小さなアプリでは問題なく動きますが、コードが増えてくると次のような「怖い瞬間」が増えていきます。

### JavaScript だけで起きる問題

```jsx
// ❌ こんな経験はありませんか？
function UserCard({ user }) {
  return (
    <div>
      <h2>{user.name}</h2>
      <p>{user.email}</p>
      <p>年齢: {user.age}</p>  {/* ← user に age があるか分からない！ */}
    </div>
  );
}

// 使う側
<UserCard user={{ name: "太郎" }} />
// → 「年齢: undefined」が画面に表示される。エラーにならない！
```

JavaScript は「何でも受け入れる」ため、間違いに気づくのが **実行時（ブラウザで確認した時）** になります。1人で開発しているうちは「覚えている」から大丈夫ですが、チームや3ヶ月後の自分にはそれが通用しません。

### TypeScript が解決すること

```tsx
// ✅ TypeScript なら「書いた瞬間」にエラーが分かる
type User = {
  name: string;
  email: string;
  age?: number;  // ← 「ある場合もない場合もある」を明示
};

function UserCard({ user }: { user: User }) {
  return (
    <div>
      <h2>{user.name}</h2>
      <p>{user.email}</p>
      {user.age !== undefined && <p>年齢: {user.age}</p>}
    </div>
  );
}

// 使う側 - email を忘れると赤線が出る！
<UserCard user={{ name: "太郎" }} />
//                ^^^^^^^^^^^^^^^^
// エラー: 'email' が必要です
```

TypeScript を使うと：

| 効果 | 説明 |
|------|------|
| **バグの早期発見** | 書いた瞬間にエディタが教えてくれる |
| **自己文書化** | 型が「このコンポーネントに何を渡すべきか」のドキュメントになる |
| **リファクタリングの安心感** | 変更の影響箇所をエディタが全て教えてくれる |
| **チーム開発の効率化** | 他の人のコードを読むときに型が手がかりになる |

> **このセッションのゴール**: React コンポーネントに TypeScript の型を付ける基本パターンを全て習得する

---

## 1. 開発環境の確認

STEP06 で Vite + React + TypeScript のプロジェクトを使っていたので、環境は整っています。新しいプロジェクトを作る場合は以下のコマンドを使います。

```bash
npm create vite@latest step07-patterns -- --template react-ts
cd step07-patterns
npm install
npm run dev
```

`--template react-ts` がポイントです。TypeScript 対応のテンプレートが使われ、`.tsx` ファイルが標準になります。

### JSX と TSX の違い

| | JSX（`.jsx`） | TSX（`.tsx`） |
|---|---|---|
| 拡張子 | `.jsx` | `.tsx` |
| 型チェック | なし | あり |
| コンポーネントの書き方 | `function App()` | `function App(): React.ReactElement` |
| Props の定義 | `{ name }` | `{ name }: { name: string }` |

実際のコードの書き方はほとんど同じです。違うのは **「型の注釈を追加できるかどうか」** だけです。

---

## 2. Props の型定義 ― 最も基本かつ最重要

React で TypeScript を使うとき、最初に学ぶべきは **Props の型定義** です。これがコンポーネントの「API仕様書」になります。

### 2.1 インライン型定義（小さなコンポーネント向け）

Props が少ない場合は、関数の引数に直接型を書けます。

```tsx
// Props が1〜2個の場合はこれで十分
function Greeting({ name, age }: { name: string; age: number }) {
  return (
    <p>
      こんにちは、{name}さん（{age}歳）
    </p>
  );
}
```

**コード解説:**

```tsx
{ name, age }: { name: string; age: number }
// ^^^^^^^^    ^^^^^^^^^^^^^^^^^^^^^^^^^^^^
// 分割代入      型注釈（nameはstring、ageはnumber）
```

- `{ name, age }` は JavaScript の分割代入（STEP01 で学びましたね）
- `:` の後ろが TypeScript の型注釈
- `string` と `number` は TypeScript の基本型

### 2.2 type で切り出す（推奨パターン）

Props が増えてきたら、`type` で切り出すのが一般的です。

```tsx
// Props の型を「コンポーネントの外」に定義する
type UserCardProps = {
  name: string;
  email: string;
  age: number;
  isAdmin: boolean;
};

function UserCard({ name, email, age, isAdmin }: UserCardProps) {
  return (
    <div className="user-card">
      <h2>{name} {isAdmin && "👑"}</h2>
      <p>{email}</p>
      <p>年齢: {age}</p>
    </div>
  );
}
```

**なぜ `type` を使うのか？**

1. **可読性**: Props が何であるか一目で分かる
2. **再利用**: 同じ型を複数の場所で使える
3. **慣習**: `コンポーネント名 + Props` が命名規則（`UserCardProps`, `ButtonProps` など）

### 2.3 `type` と `interface` ― どちらを使うべきか？

TypeScript には `type` と `interface` の2つの方法があります。

```tsx
// type で定義
type ButtonProps = {
  label: string;
  onClick: () => void;
};

// interface で定義
interface ButtonProps {
  label: string;
  onClick: () => void;
}
```

**結論: React の Props には `type` を使うのがおすすめ**

| | `type` | `interface` |
|---|---|---|
| ユニオン型（`A | B`） | ✅ できる | ❌ できない |
| 交差型（`A & B`） | ✅ できる | ✅ `extends` で可能 |
| マップ型 | ✅ できる | ❌ できない |
| 宣言のマージ | ❌ できない | ✅ できる |
| **React Props に使うなら** | **✅ 推奨** | ✅ 使えるが `type` で十分 |

`interface` は「宣言のマージ」（同じ名前で複数回定義すると自動的に合体する）ができますが、Props 定義ではこの機能は不要です。`type` の方がシンプルで柔軟なので、React コミュニティでは `type` が主流です。

---

## 3. オプショナルな Props と デフォルト値

### 3.1 オプショナル Props（`?` マーク）

「あってもなくてもいい」Props は `?` を付けます。

```tsx
type AlertProps = {
  message: string;        // 必須
  severity?: "info" | "warning" | "error";  // オプショナル
  closable?: boolean;     // オプショナル
};

function Alert({ message, severity = "info", closable = false }: AlertProps) {
  return (
    <div className={`alert alert-${severity}`}>
      <p>{message}</p>
      {closable && <button>×</button>}
    </div>
  );
}
```

**コード解説:**

```tsx
severity?: "info" | "warning" | "error"
//     ^   ^^^^^^^^^^^^^^^^^^^^^^^^^^
//     |   リテラル型のユニオン（3つの文字列のどれか）
//     オプショナル（渡さなくてもOK）
```

```tsx
severity = "info"
// ^^^^^^^^^^^^^^^^
// JavaScript のデフォルト引数。severity が undefined なら "info" になる
```

**使う側:**

```tsx
// 全部OK
<Alert message="保存しました" />
<Alert message="注意してください" severity="warning" />
<Alert message="エラーです" severity="error" closable />
```

### 3.2 リテラル型の威力

`severity` に `"info" | "warning" | "error"` とリテラル型を指定したことで：

```tsx
// ❌ TypeScript がエラーを出す！
<Alert message="test" severity="danger" />
//                             ^^^^^^^^
// 'danger' は 'info' | 'warning' | 'error' に割り当てられません
```

タイポや不正な値を**書いた瞬間に**防げます。これが TypeScript の最大の価値の1つです。

---

## 4. children の型定義

STEP04 で学んだ `children`（コンポーネントの中身を受け取る仕組み）にも型が必要です。

### 4.1 `React.ReactNode` ― 最も一般的

```tsx
type CardProps = {
  title: string;
  children: React.ReactNode;  // ← あらゆるJSXを受け取れる
};

function Card({ title, children }: CardProps) {
  return (
    <div className="card">
      <h3>{title}</h3>
      <div className="card-body">{children}</div>
    </div>
  );
}

// 使う側 - 何でも入れられる
<Card title="ユーザー情報">
  <p>太郎</p>
  <p>taro@example.com</p>
</Card>
```

### 4.2 `React.ReactNode` が受け入れるもの

`ReactNode` は以下の全てを含む「何でもあり」型です:

```tsx
type ReactNode =
  | ReactElement     // <div>, <MyComponent> など
  | string           // "hello"
  | number           // 42
  | boolean          // true（ただし何も表示しない）
  | null             // 何も表示しない
  | undefined        // 何も表示しない
  | ReactNode[];     // 上記の配列
```

**よくある疑問: `React.ReactElement` との違いは？**

```tsx
// ReactElement: JSX要素のみ
// ReactNode:    JSX要素 + 文字列 + 数値 + null + ...

// children に使うなら、基本は ReactNode でOK
// 「JSX要素だけ受け取りたい」場合のみ ReactElement を使う
```

### 4.3 `React.PropsWithChildren` ― ショートカット

`children` を含む Props を定義するショートカットもあります。

```tsx
// 手動で書く
type CardProps = {
  title: string;
  children: React.ReactNode;
};

// ショートカット（同じ結果）
type CardProps = React.PropsWithChildren<{
  title: string;
}>;
```

どちらを使うかは好みですが、**明示的に `children: React.ReactNode` と書く方が分かりやすい**ため、本教材ではそちらを推奨します。

---

## 5. イベントハンドラの型定義

STEP02-03 で学んだイベント処理にも型が必要です。

### 5.1 コールバック関数の基本型

```tsx
type SearchBarProps = {
  onSearch: (query: string) => void;
  //        ^^^^^^^^^^^^^^^^^^^^^^^^
  // 「string を受け取って、何も返さない関数」
};

function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState("");

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      onSearch(query);
    }}>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="検索..."
      />
      <button type="submit">検索</button>
    </form>
  );
}
```

**コード解説:**

```tsx
onSearch: (query: string) => void
// ^^^^^^^^                       Props名
//          ^^^^^^^^^^^^^         引数（string型のquery）
//                           ^^^^ 戻り値（何も返さない = void）
```

### 5.2 イベントオブジェクトの型

React のイベントオブジェクトにも型があります。

```tsx
function LoginForm() {
  // onChange イベント
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
  };

  // onClick イベント
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    console.log("クリックされました");
  };

  // onSubmit イベント
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("送信されました");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input onChange={handleChange} />
      <button onClick={handleClick}>送信</button>
    </form>
  );
}
```

### 5.3 よく使うイベント型一覧

| イベント | 型 | 用途 |
|---------|-----|------|
| `onChange` | `React.ChangeEvent<HTMLInputElement>` | input, select, textarea の変更 |
| `onClick` | `React.MouseEvent<HTMLButtonElement>` | クリック |
| `onSubmit` | `React.FormEvent<HTMLFormElement>` | フォーム送信 |
| `onKeyDown` | `React.KeyboardEvent<HTMLInputElement>` | キーボード入力 |
| `onFocus` | `React.FocusEvent<HTMLInputElement>` | フォーカス |

> **覚え方のコツ**: `React.○○Event<HTML○○Element>` のパターン。`○○Event` はイベントの種類、`HTML○○Element` はどのHTML要素かを指定する。

### 5.4 実践：型つき検索フィルター

学んだことを組み合わせた実践的な例を見てみましょう。

```tsx
type FilterOption = "all" | "active" | "completed";

type TodoFilterProps = {
  currentFilter: FilterOption;
  onFilterChange: (filter: FilterOption) => void;
  resultCount: number;
};

function TodoFilter({ currentFilter, onFilterChange, resultCount }: TodoFilterProps) {
  const filters: FilterOption[] = ["all", "active", "completed"];

  const labelMap: Record<FilterOption, string> = {
    all: "すべて",
    active: "未完了",
    completed: "完了済み",
  };

  return (
    <div className="filter-bar">
      {filters.map((filter) => (
        <button
          key={filter}
          className={currentFilter === filter ? "active" : ""}
          onClick={() => onFilterChange(filter)}
        >
          {labelMap[filter]}
        </button>
      ))}
      <span>{resultCount} 件</span>
    </div>
  );
}
```

**コード解説:**

```tsx
type FilterOption = "all" | "active" | "completed";
// ユニオン型のエイリアス。この3つしか許されない。
```

```tsx
const labelMap: Record<FilterOption, string> = { ... };
// Record<K, V> はユーティリティ型。
// 「FilterOption のすべてのキーに対して string の値を持つオブジェクト」
// もし "all" の定義を忘れたら、TypeScript がエラーを出す！
```

---

## 6. useState の型定義

STEP02 で学んだ `useState` にも型を付けましょう。

### 6.1 型推論が効く場合（明示不要）

```tsx
// TypeScript は初期値から型を自動推論する
const [count, setCount] = useState(0);           // number と推論
const [name, setName] = useState("太郎");         // string と推論
const [isOpen, setIsOpen] = useState(false);      // boolean と推論
```

初期値が明確なら、型を書く必要はありません。TypeScript が自動で推論してくれます。

### 6.2 型を明示すべき場合

初期値だけでは型が特定できない場合は、明示が必要です。

```tsx
// ケース1: 初期値が null の場合
type User = { id: number; name: string; email: string };

const [user, setUser] = useState<User | null>(null);
//                               ^^^^^^^^^^^
// 「User型 または null」の状態

// user を使う時は null チェックが必要
if (user) {
  console.log(user.name);  // ✅ TypeScript は user が User 型と分かる
}
```

```tsx
// ケース2: 配列の初期値が空の場合
type Todo = { id: number; text: string; done: boolean };

const [todos, setTodos] = useState<Todo[]>([]);
//                                 ^^^^^^
// 「Todoの配列」型。空配列 [] だけでは never[] と推論されてしまう

// これで安全に使える
setTodos([...todos, { id: 1, text: "買い物", done: false }]);
```

```tsx
// ケース3: リテラル型のユニオン
type Theme = "light" | "dark" | "system";

const [theme, setTheme] = useState<Theme>("light");
//                                 ^^^^^
// "light" | "dark" | "system" の3択。"light" だけだと string と推論される
```

### 6.3 よくある間違い

```tsx
// ❌ 初期値と型が矛盾
const [user, setUser] = useState<User>({});
// エラー: {} は User 型に必要なプロパティが欠けています

// ✅ null を許容する
const [user, setUser] = useState<User | null>(null);

// ✅ または初期値を完全に指定する
const [user, setUser] = useState<User>({
  id: 0,
  name: "",
  email: "",
});
```

---

## 7. 実践演習：型つきプロフィールカード

ここまで学んだことを全て使って、プロフィールカードコンポーネントを作ってみましょう。

### 要件

1. ユーザーの名前、メールアドレス、役職を表示する
2. オンラインかオフラインかのステータスを表示する
3. 「メッセージを送る」ボタンがあり、クリック時にユーザーIDを親に通知する
4. プロフィール画像はオプショナル

### まず型を設計する（コードの前に型を考える）

```tsx
// ステップ1: データの型を定義
type UserStatus = "online" | "offline" | "away";

type UserProfile = {
  id: number;
  name: string;
  email: string;
  role: string;
  status: UserStatus;
  avatarUrl?: string;  // オプショナル
};

// ステップ2: Props の型を定義
type ProfileCardProps = {
  user: UserProfile;
  onSendMessage: (userId: number) => void;
};
```

> **ポイント**: コンポーネントを書く前に、まず型を設計する。これが TypeScript × React の基本的なワークフローです。「型を先に考える → コンポーネントを実装する」の順番を癖にしましょう。

### コンポーネントを実装する

```tsx
function ProfileCard({ user, onSendMessage }: ProfileCardProps) {
  // ステータスに対応する色のマッピング
  const statusColor: Record<UserStatus, string> = {
    online: "#22c55e",  // 緑
    offline: "#94a3b8", // グレー
    away: "#f59e0b",    // 黄色
  };

  const statusLabel: Record<UserStatus, string> = {
    online: "オンライン",
    offline: "オフライン",
    away: "離席中",
  };

  return (
    <div className="profile-card">
      {/* アバター画像（あれば表示、なければデフォルト） */}
      <img
        src={user.avatarUrl ?? "/default-avatar.png"}
        alt={`${user.name}のアバター`}
        className="avatar"
      />

      <div className="profile-info">
        <h3>{user.name}</h3>
        <p className="role">{user.role}</p>
        <p className="email">{user.email}</p>

        {/* ステータス表示 */}
        <span
          className="status"
          style={{ color: statusColor[user.status] }}
        >
          ● {statusLabel[user.status]}
        </span>
      </div>

      <button onClick={() => onSendMessage(user.id)}>
        メッセージを送る
      </button>
    </div>
  );
}
```

**コード解説:**

```tsx
user.avatarUrl ?? "/default-avatar.png"
// ?? は Null合体演算子。
// 左辺が null または undefined の場合、右辺の値を使う
// avatarUrl はオプショナル（undefined の可能性がある）なので、この演算子が最適
```

```tsx
const statusColor: Record<UserStatus, string> = { ... };
// Record<UserStatus, string> によって、
// "online", "offline", "away" の全てにマッピングを書かないとエラーになる
// → 新しいステータスを追加した時に「ここも更新して」とTypeScriptが教えてくれる
```

### 使う側のコード

```tsx
function App() {
  const handleSendMessage = (userId: number) => {
    console.log(`ユーザー ${userId} にメッセージ画面を開く`);
  };

  return (
    <ProfileCard
      user={{
        id: 1,
        name: "田中太郎",
        email: "taro@example.com",
        role: "フロントエンドエンジニア",
        status: "online",
        // avatarUrl は省略可能
      }}
      onSendMessage={handleSendMessage}
    />
  );
}
```

---

## 8. まとめ：TypeScript × React の型定義チートシート

| 場面 | 型の書き方 | 例 |
|------|-----------|-----|
| **基本の Props** | `type XxxProps = { ... }` | `type ButtonProps = { label: string }` |
| **オプショナル** | `?` を付ける | `size?: "sm" \| "md" \| "lg"` |
| **children** | `React.ReactNode` | `children: React.ReactNode` |
| **コールバック** | `() => void` / `(arg: T) => void` | `onClick: () => void` |
| **イベント** | `React.○○Event<HTML○○Element>` | `React.ChangeEvent<HTMLInputElement>` |
| **useState（推論OK）** | 書かなくてよい | `useState(0)` → number |
| **useState（null許容）** | `useState<T \| null>(null)` | `useState<User \| null>(null)` |
| **useState（空配列）** | `useState<T[]>([])` | `useState<Todo[]>([])` |
| **リテラル制限** | ユニオン型 | `"info" \| "warning" \| "error"` |
| **全キー必須マップ** | `Record<K, V>` | `Record<Status, string>` |

---

## 9. セルフチェック

次のセッションに進む前に、以下の質問に答えられるか確認してください。

1. `type` と `interface` の違いは何か？React Props にはどちらを使うのが一般的か？
2. `React.ReactNode` と `React.ReactElement` の違いは？
3. `useState<User | null>(null)` の `<User | null>` は何を意味するか？
4. `Record<K, V>` はどんな時に便利か？
5. イベントハンドラの型で `React.ChangeEvent<HTMLInputElement>` の `<HTMLInputElement>` 部分は何を表しているか？

> **次のセッション**: コンポーネント設計パターン（Container/Presentational, Compound Components）に進みます。型定義の知識を使って、より良い設計を学びます。
