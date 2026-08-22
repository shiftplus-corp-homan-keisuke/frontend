# React 完全習得 STEP01-09 総復習

> 🎯 **対象**: Phase2 React 完全習得 STEP01-09 の学習を終えた人
> 📚 **形式**: 重要概念の整理・使い分けの確認
> ⏰ **推奨時間**: 90-120 分
> 🧭 **進め方**: 全体像を読む → 各 STEP の要点を確認する → 最後のチェックリストで理解度を確認する

## 📋 この総復習の目的

この資料は、React の API を一つずつ詳しく学び直すためのものではありません。
STEP01-09 で学んだ内容を一つの開発フローとしてつなげ、
「この問題には、どの React の仕組みを使うか」を判断できる状態に戻すことを目的とします。

復習では、次の順番を意識してください。

1. UI をコンポーネントに分解する
2. Props と State の責任範囲を決める
3. 一方向データフローを設計する
4. 必要な場所だけに Hooks やライブラリを導入する
5. TypeScript で契約を明確にする
6. ユーザーの操作と結果をテストする

---

## 🎓 React の全体像

### Phase2 の構成

| STEP | 主題 | この STEP の中心的な問い |
| --- | --- | --- |
| **STEP0** | React を学ぶ前提 | なぜ UI ライブラリが必要なのか |
| **STEP01** | 基礎 | UI をどうコンポーネントとして表現するか |
| **STEP02** | State の基本 | 変化するデータをどう UI に反映するか |
| **STEP03** | State・イベント・フォーム | データをどこに置き、どう受け渡すか |
| **STEP04** | Composition・再利用 | Props を増やさず UI をどう組み合わせるか |
| **STEP05** | Hooks | 副作用・DOM・共有ロジックをどう扱うか |
| **STEP06** | ライブラリ | Client State・Server State・UI をどう管理するか |
| **STEP07** | 設計パターン・TypeScript | 大きなアプリをどう保守可能にするか |
| **STEP08** | React Hook Form・Zod | フォーム入力と検証をどう安全に扱うか |
| **STEP09** | テスト | ユーザー価値のある動作をどう保証するか |

### React の基本式

React の UI は、概念的には次の式で表せます。

```text
UI = f(props, state)
```

- `props`: 親から渡される入力。コンポーネント自身では変更しない
- `state`: コンポーネントが管理する変化するデータ
- `f`: 入力から UI を宣言的に計算するコンポーネント関数

React では DOM を直接操作して画面を変更するのではなく、
「現在のデータなら UI はどう見えるべきか」を記述します。
データが変化すると React が再レンダリングし、必要な DOM 更新を行います。

### レンダリングの流れ

```text
初期レンダリング
  ↓
コンポーネント関数が実行される
  ↓
JSX から UI の結果が計算される
  ↓
DOM に反映される（commit）
  ↓
必要なら useEffect が実行される

ユーザー操作
  ↓
イベントハンドラー
  ↓
setState
  ↓
再レンダリング
```

レンダリング中のコンポーネントは、現在の Props と State から UI を計算する純粋な関数として考えます。
API 通信、タイマー、DOM 操作など、レンダリング以外の処理は適切な場所に分離します。

---

## STEP0: React を学ぶ前提

### React が解決する問題

Vanilla JavaScript で複雑な UI を作ると、次の処理を自分で管理する必要があります。

- DOM 要素の取得
- イベントリスナーの登録
- 状態変更後の DOM 更新
- 表示・非表示の切り替え
- 複数箇所にある UI の同期

React は、UI をコンポーネントに分割し、State と UI の関係を宣言的に記述します。
開発者は「どの DOM をどう書き換えるか」よりも、
「どの状態なら何を表示するか」に集中できます。

### 宣言的と命令的

| アプローチ | 考え方 |
| --- | --- |
| 命令的 | 「この要素を取得して、class を追加して、テキストを変更する」 |
| 宣言的 | 「`isOpen` が true なら開いた UI を表示する」 |

React を使うときは、DOM 操作を直接書く前に、
「この UI の違いを表す最小の State は何か」を考えます。

---

## STEP01: React 基礎

### コンポーネント

コンポーネントは、UI・データ・表示ロジックをまとめた再利用可能な関数です。
関数名は大文字で始めます。

```tsx
type GreetingProps = {
  name: string;
};

function Greeting({ name }: GreetingProps) {
  return <h1>こんにちは、{name}さん</h1>;
}
```

コンポーネント分割では、次の観点を使います。

- UI のまとまりとして意味があるか
- 独立して再利用・テストしたいか
- State やイベントの責任を分離したいか
- 1 つのコンポーネントが大きくなりすぎていないか

分割しすぎて Props の受け渡しだけになる場合は、Composition を検討します。

### JSX の基本

JSX は HTML 風に UI を記述する JavaScript の構文です。

```tsx
function Profile({ name, isOnline }: { name: string; isOnline: boolean }) {
  const status = isOnline ? "オンライン" : "オフライン";

  return (
    <section className="profile">
      <h2>{name}</h2>
      <p>{status}</p>
    </section>
  );
}
```

覚えておく JSX のルール:

- 返す JSX は 1 つのルート要素にまとめる。不要な DOM は Fragment (`<>...</>`) を使う
- JavaScript の式は `{}` の中に書く
- `class` ではなく `className`、`for` ではなく `htmlFor` を使う
- コンポーネントは `<Greeting />` のように大文字で呼び出す
- イベントは `onClick`、`onChange` のように React の形式で指定する
- イベントハンドラーは関数を渡し、レンダリング中に呼び出さない

```tsx
<button onClick={handleClick}>保存</button>
// ❌ <button onClick={handleClick()}>保存</button>
```

### Props

Props は親から子への入力です。子は Props を読み取りますが、直接変更しません。

```tsx
type ButtonProps = {
  label: string;
  variant?: "primary" | "secondary";
  onClick: () => void;
};

function Button({ label, variant = "primary", onClick }: ButtonProps) {
  return (
    <button className={`button button-${variant}`} onClick={onClick}>
      {label}
    </button>
  );
}
```

### リストレンダリングと `key`

配列を UI に変換するときは `map` を使います。

```tsx
{items.map((item) => (
  <li key={item.id}>{item.name}</li>
))}
```

`key` は React が同じ要素を識別するための安定した ID です。

- データ固有の ID を使う
- 並び替え・追加・削除があるリストで配列の index を使わない
- 画面に表示するだけの固定リスト以外では、index を安易に使わない
- `key` は子コンポーネントの Props として自動的には渡らない

### 条件付きレンダリング

```tsx
// 条件を満たすときだけ表示
{isLoggedIn && <UserMenu />}

// 2 つの表示を切り替え
{isLoading ? <Spinner /> : <Content />}
```

`&&` の左辺に数値を置くと、`0` が画面に表示されることがあります。
件数表示などでは `count > 0 && ...` のように明示します。
分岐が複雑な場合は、JSX の中に条件を詰め込まず、早期 `return` や変数に分けます。

---

## STEP02: State とイベントの基本

### State の役割

State は、変化したときに UI の再計算が必要なデータです。

```tsx
import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount((current) => current + 1)}>
      {count}
    </button>
  );
}
```

State の更新には必ず setter を使います。
通常の変数を変更しても React は再レンダリングを知りません。

### State はスナップショット

1 回のレンダリングで参照している State は、そのレンダリング時点のスナップショットです。
setter を呼んだ直後に、同じ関数内の変数が書き換わるわけではありません。

```tsx
function handleClick() {
  setCount(count + 1);
  setCount(count + 1);
  // 同じスナップショットを基準にするため、通常は 1 増える
}
```

現在の State を基準に複数回更新する場合は、関数型更新を使います。

```tsx
function handleClick() {
  setCount((current) => current + 1);
  setCount((current) => current + 1);
  // 2 増える
}
```

React はイベント中の更新をまとめて処理するため、
State 更新を「即時の代入」と考えないことが重要です。

### イベントハンドリング

```tsx
function SearchBox() {
  const [query, setQuery] = useState("");

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setQuery(event.target.value);
  }

  return <input value={query} onChange={handleChange} />;
}
```

基本の考え方:

- `onClick={handleClick}` は関数を渡す
- `onClick={() => handleDelete(id)}` は引数を渡したいときに使う
- State を変更する関数は `handle` + 動詞で命名する
- イベントから値を読み取り、State 更新を行う

### イミュータブルな更新

State のオブジェクトや配列を直接変更せず、新しい値を作成します。

```tsx
// オブジェクト
setUser((current) => ({ ...current, name: "Alice" }));

// 追加
setTodos((current) => [...current, newTodo]);

// 削除
setTodos((current) => current.filter((todo) => todo.id !== id));

// 更新
setTodos((current) =>
  current.map((todo) =>
    todo.id === id ? { ...todo, done: !todo.done } : todo
  )
);
```

直接 `push`、`splice`、プロパティへの代入をすると、
参照が変わらず React の比較・デバッグ・再利用に問題が起きます。

### State を作るかどうか

次の順番で判断します。

1. その値は時間とともに変化するか
2. Props や既存の State から計算できないか
3. 変更時に UI の再レンダリングが必要か
4. 複数コンポーネントで共有する必要があるか

既存の値から計算できるものは、重複した State にしません。

```tsx
const completedCount = todos.filter((todo) => todo.done).length;
const isEmpty = todos.length === 0;
```

### State の独立性と DevTools

同じコンポーネントを複数回表示しても、それぞれのインスタンスが独立した State を持ちます。
React Developer Tools では、コンポーネントツリー・Props・State・再レンダリングの状況を確認できます。
動作が想定と違うときは、まず State の所有者と現在値を確認します。

---

## STEP03: State 管理・親子通信・フォーム

### State と Props の違い

| 項目 | State | Props |
| --- | --- | --- |
| 所有者 | コンポーネント自身 | 親コンポーネント |
| 変更 | setter で更新 | 子から直接変更しない |
| 役割 | UI の変化を記録 | 親から子へ入力を渡す |
| 典型例 | 開閉、入力値、選択中の ID | 表示データ、コールバック、設定 |

### 一方向データフロー

React のデータは基本的に親から子へ流れます。
子から親へ直接 State を渡し戻すのではなく、親がコールバックを Props として渡します。

```tsx
function Parent() {
  const [selectedId, setSelectedId] = useState<number | null>(null);

  return (
    <List
      selectedId={selectedId}
      onSelect={setSelectedId}
    />
  );
}

type ListProps = {
  selectedId: number | null;
  onSelect: (id: number) => void;
};
```

### State のリフトアップ

兄弟コンポーネントが同じデータを読む・更新する場合、
共通の親まで State を持ち上げます。

```text
App
├─ Form       ← addItem を呼ぶ
└─ ItemList   ← items を表示する
```

`Form` と `ItemList` の両方が必要とする `items` は `App` が所有し、
`onAddItem`、`onDeleteItem`、`onToggleItem` などの操作を Props で渡します。

### Thinking in React の手順

1. UI を視覚的なまとまりに分解する
2. まず静的な UI を作る
3. UI の違いを生む最小限の State を洗い出す
4. State を使うコンポーネントの共通の親を探す
5. 親から子へデータ、子から親へイベントを流す
6. Props や State から計算できる値を派生値として作る

### 制御されたフォーム

入力値を React State で管理するフォームを制御されたコンポーネントと呼びます。

```tsx
function NameForm() {
  const [name, setName] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    console.log(name);
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="name">名前</label>
      <input
        id="name"
        value={name}
        onChange={(event) => setName(event.target.value)}
      />
      <button type="submit">保存</button>
    </form>
  );
}
```

ポイント:

- `value` と `onChange` をセットにする
- `submit` 時には `preventDefault()` でブラウザの再読み込みを防ぐ
- 入力の検証・送信・リセットの責任を整理する
- 送信データを親で管理するなら、フォームは `onSubmit` を呼ぶ役割にする

### 派生 State とデータ操作

合計数・完了数・フィルター後のリストなどは、元データから計算します。
別の State に保存すると、元データとの同期が必要になります。

```tsx
const filteredItems = items.filter((item) => {
  if (filter === "active") return !item.done;
  if (filter === "completed") return item.done;
  return true;
});
```

アイテムの追加・削除・更新は、配列を直接変更せず `...`、`filter`、`map` を使います。
これが Far Away、Flashcards、Tip Calculator で共通していた基本パターンです。

---

## STEP04: Component Composition と再利用

### Composition とは

Composition は、コンポーネントの内部を固定せず、
`children` や要素 Props を受け取って外側から組み合わせる設計です。

```tsx
type CardProps = {
  title: string;
  children: React.ReactNode;
};

function Card({ title, children }: CardProps) {
  return (
    <section className="card">
      <h2>{title}</h2>
      <div className="card-body">{children}</div>
    </section>
  );
}

<Card title="プロフィール">
  <Profile />
</Card>;
```

Composition の利点:

- 中間コンポーネントに不要な Props を渡さずに済む
- レイアウトと中身の責任を分離できる
- 使う場所ごとに異なる UI を組み立てられる
- 巨大な条件分岐を持つコンポーネントを避けられる

`children` だけでなく、`header`、`footer`、`content` のような要素 Props も使えます。

### Prop Drilling の判断

Props が数階層にわたって中継され、途中のコンポーネントが値を使っていない場合は Prop Drilling です。

ただし、親子 1〜2 階層の Props 受け渡しは普通の設計です。
何でも Context やグローバル State に移すのではなく、次の順で検討します。

1. その値を実際に使うコンポーネントの近くに State を置く
2. 親子間なら通常の Props を使う
3. 深いツリーで広く共有するなら Composition または Context を使う
4. アプリ全体の更新可能な Client State なら外部ストアを検討する

### 再利用可能なコンポーネントの設計

StarRating のような部品は、内部の表示ロジックを持ちながら、
次のような Props で利用側が設定できると再利用しやすくなります。

```tsx
type StarRatingProps = {
  max?: number;
  value?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
  readOnly?: boolean;
};
```

コンポーネントを再利用可能にするポイント:

- 外から変更したいものだけを Props にする
- 表示と状態の責任を明確にする
- 既定値を用意し、最小限の指定でも使えるようにする
- `onChange` のようなイベント契約を明確にする
- 見た目を固定しすぎず、className や Composition で拡張できるようにする

### コンポーネントの分類

| 分類 | 主な責任 |
| --- | --- |
| Presentational | Props を受け取り、見た目を表示する |
| Stateful / Container | State、データ取得、イベントの流れを管理する |
| Structural | レイアウトや画面の構造を管理する |

この分類は厳密なルールではありません。
「データを取得する部分」と「見た目を表示する部分」を分けると、テストや再利用が容易になります。

---

## STEP05: Hooks

### Hooks の共通ルール

1. Hooks はコンポーネントまたはカスタムフックのトップレベルで呼ぶ
2. 条件分岐・ループ・イベントハンドラーの中で呼ばない
3. 呼び出し順をレンダリングごとに変えない
4. カスタムフック名は `use` で始める

```tsx
// ❌ 条件の中で Hook を呼ばない
if (isEnabled) {
  useEffect(() => {}, []);
}
```

### `useEffect`: 外部システムとの同期

`useEffect` は、React のレンダリング以外のシステムと同期するときに使います。

- API 通信
- タイマー
- DOM API
- ブラウザイベント
- WebSocket や外部購読
- localStorage との同期

```tsx
useEffect(() => {
  const controller = new AbortController();

  async function load() {
    const response = await fetch(`/api/users?q=${query}`, {
      signal: controller.signal,
    });
    const data = await response.json();
    setUsers(data);
  }

  load();
  return () => controller.abort();
}, [query]);
```

依存配列の意味:

| 書き方 | 実行タイミング |
| --- | --- |
| 依存配列なし | すべてのレンダリング後 |
| `[]` | マウント後。開発時の StrictMode では確認のため複数回に見えることがある |
| `[value]` | `value` が変化した後 |

Effect 内で使う Props・State・関数などは、基本的に依存配列へ含めます。
タイマーやイベントリスナーを登録したら、必ず cleanup で解除します。

#### `useEffect` を使わない方がよい処理

- Props や State から計算できる値
- クリックされたときだけ行う処理
- 入力値を別 State にコピーする処理
- 単純な初期値の計算

これらはレンダリング中の計算、イベントハンドラー、初期値関数などで処理します。

### `useRef`: 再レンダリング不要の値

```tsx
const inputRef = useRef<HTMLInputElement>(null);

function focusInput() {
  inputRef.current?.focus();
}

return <input ref={inputRef} />;
```

`useRef` は `{ current: value }` を保持します。
`current` を変更しても再レンダリングされません。

| 目的 | 使うもの |
| --- | --- |
| 画面に表示する値 | `useState` |
| DOM 要素へのアクセス | `useRef` |
| タイマー ID、前回値など UI に直接表示しない値 | `useRef` |

### `useContext`: 深いツリーへの共有

Context は、テーマ・認証ユーザー・言語設定など、ツリー全体で読む値を共有する仕組みです。

```tsx
type Theme = "light" | "dark";
type ThemeContextValue = {
  theme: Theme;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  const toggleTheme = () =>
    setTheme((current) => (current === "light" ? "dark" : "light"));

  return (
    <ThemeContext value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext>
  );
}
```

利用側は `useContext(ThemeContext)` で値を取得します。
React 19 より前の書き方では `ThemeContext.Provider` を使います。

Context を使いすぎると、値の変更で広い範囲が再レンダリングされ、
依存関係も見えにくくなります。局所的なデータは Props、広い共有が必要なデータだけ Context にします。

### `useMemo`: 計算結果のメモ化

```tsx
const filteredItems = useMemo(
  () => items.filter((item) => item.name.includes(query)),
  [items, query]
);
```

`useMemo` は「計算結果を再利用する」ための最適化です。

- まず通常の計算で動かす
- 実際に重い計算や不要な再計算を計測する
- 依存配列を正しく設定する
- 参照の安定化だけを目的に乱用しない

React 19 と React Compiler の環境では、自動最適化される場面もあります。
`useMemo` は必須の設計要素ではなく、計測結果に基づく最適化として扱います。

### カスタムフック

カスタムフックは、State や Effect を含むロジックを再利用する関数です。

```tsx
function useToggle(initialValue = false) {
  const [isOn, setIsOn] = useState(initialValue);
  const toggle = () => setIsOn((current) => !current);

  return { isOn, toggle };
}
```

重要な点:

- カスタムフックを使ったコンポーネントごとに State は独立する
- State 自体を共有する仕組みではない
- 共有が必要なら親の State、Context、外部ストアを使う
- 1 つのフックは 1 つの責任にする
- Effect を使うフックは cleanup と依存配列を設計する

教材で扱った `useCounter`、`useToggle`、`useLocalStorage`、`useFetch`、
`useWindowSize`、`useDebounce` は、同じ処理の重複をコンポーネントから切り離す例です。

---

## STEP06: ライブラリの使い分け

### State の分類

| 種類 | 例 | 主な管理方法 |
| --- | --- | --- |
| Local UI State | モーダルの開閉、入力途中の値 | `useState` |
| Shared Client State | カート、認証、テーマ | Context、Zustand |
| Server State | API の商品一覧、ユーザー情報 | TanStack Query |
| Form State | 入力値、エラー、送信状態 | React Hook Form |
| URL State | 検索条件、ページ番号 | Router / URL |
| Derived State | 合計、件数、フィルター結果 | Props・State から計算 |

「何でも Zustand に入れる」「API データを手作りの State で管理する」前に、
データの種類を見極めます。

### Zustand

Zustand は、コンポーネントツリーをまたいで使う Client State を小さく管理できます。

```tsx
type CartItem = { id: number; quantity: number };

type CartStore = {
  items: CartItem[];
  add: (id: number) => void;
  remove: (id: number) => void;
};

const useCartStore = create<CartStore>((set) => ({
  items: [],
  add: (id) =>
    set((state) => ({
      items: [...state.items, { id, quantity: 1 }],
    })),
  remove: (id) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    })),
}));

function CartCount() {
  const count = useCartStore((state) => state.items.length);
  return <span>{count}</span>;
}
```

ポイント:

- State と更新アクションをストアにまとめる
- コンポーネントでは必要なスライスだけ selector で読む
- イミュータブルな更新を維持する
- 小さな局所 State までストアに移さない

### TanStack Query

TanStack Query は、サーバー由来のデータに必要な処理を管理します。

- ローディング・エラー・成功状態
- キャッシュ
- 再取得
- stale データの扱い
- query key によるデータの識別
- mutation 後の invalidation

```tsx
const { data, isPending, isError, error } = useQuery({
  queryKey: ["products", category],
  queryFn: () => fetchProducts(category),
});

if (isPending) return <Spinner />;
if (isError) return <ErrorMessage message={error.message} />;
return <ProductList products={data} />;
```

`category` のように取得結果を変える値は `queryKey` に含めます。
QueryClientProvider の設定、キーの設計、mutation 後のキャッシュ更新が重要です。

#### Zustand と TanStack Query

| 問題 | 適したもの |
| --- | --- |
| 「今、カートに何が入っているか」 | Zustand |
| 「サーバーの商品一覧を取得・キャッシュしたい」 | TanStack Query |
| 「API の結果を複数画面で同期したい」 | TanStack Query |
| 「テーマの切り替えを共有したい」 | Context または Zustand |

### shadcn/ui

shadcn/ui は、完成済みの巨大 UI ライブラリを import するのではなく、
プロジェクトにコンポーネントのソースコードを追加して利用する考え方です。

- アクセシブルな基本部品を利用できる
- 自分のプロジェクトに合わせてコードを変更できる
- Button、Dialog、Table などの土台を統一できる
- `cn` で条件付き className と外部 className を結合できる

ライブラリの見た目をそのまま増やすのではなく、
プロジェクトのデザイン・アクセシビリティ・責任範囲を確認して使います。

---

## STEP07: 設計パターンと TypeScript

### Props の型定義

React コンポーネントでは、TypeScript を「後からエラーを直すため」ではなく、
コンポーネントの契約を先に設計するために使います。

```tsx
type UserStatus = "online" | "offline" | "away";

type ProfileCardProps = {
  user: {
    id: number;
    name: string;
    status: UserStatus;
    avatarUrl?: string;
  };
  onSendMessage: (userId: number) => void;
};
```

### `children` とイベントの型

```tsx
type PanelProps = {
  title: string;
  children: React.ReactNode;
};

type SearchBarProps = {
  onSearch: (query: string) => void;
};
```

よく使うイベント型:

| 操作 | 型 |
| --- | --- |
| input の変更 | `React.ChangeEvent<HTMLInputElement>` |
| select の変更 | `React.ChangeEvent<HTMLSelectElement>` |
| button のクリック | `React.MouseEvent<HTMLButtonElement>` |
| form の送信 | `React.FormEvent<HTMLFormElement>` |
| キーボード入力 | `React.KeyboardEvent<HTMLInputElement>` |

### `useState` の型推論

初期値から明確に推論できる場合は型注釈を省略できます。

```tsx
const [count, setCount] = useState(0);
const [name, setName] = useState("");
```

初期値が `null` や空配列の場合は、型を明示します。

```tsx
type User = { id: number; name: string };

const [user, setUser] = useState<User | null>(null);
const [users, setUsers] = useState<User[]>([]);
const [theme, setTheme] = useState<"light" | "dark">("light");
```

### Union 型と `Record`

```tsx
type Filter = "all" | "active" | "completed";

const labels: Record<Filter, string> = {
  all: "すべて",
  active: "未完了",
  completed: "完了済み",
};
```

Union 型を使うと、利用できる値を限定できます。
`Record` と組み合わせると、Union のキーの定義漏れを TypeScript が検出します。

### 高度なコンポーネントパターン

| パターン | 概要 | 現代の判断 |
| --- | --- | --- |
| HOC | コンポーネントを関数で包んで機能を追加 | 既存コードの理解に必要。新規では慎重に使う |
| Render Props | 関数 Props で描画方法を利用側に渡す | 柔軟だがネストが深くなりやすい |
| Headless | ロジックと見た目を分離する | Hooks・Composition と相性がよく、現代的 |

再利用ロジックを作るときは、まずカスタムフック、Composition、通常の Props を検討します。
Headless コンポーネントは、キーボード操作や状態管理を提供し、
利用側が見た目を自由に描画できる設計です。

### TanStack Table

TanStack Table は Headless なテーブルライブラリです。
データ処理・行モデル・ソート・フィルター・ページネーションを提供し、
HTML や CSS の見た目はアプリケーション側で決めます。

```text
データ型
  ↓
columns 定義
  ↓
table instance
  ↓
header / row / cell を自分の JSX で描画
```

Headless の利点:

- デザインシステムに合わせられる
- 機能と表示を分離できる
- TypeScript で列とデータの不整合を検出できる
- ソート・フィルター・ページングを段階的に追加できる

### プロダクション向けの構成

機能単位でフォルダを分けると、関連する型・ロジック・UI を追いやすくなります。

```text
src/
├─ app/
├─ features/
│  └─ tasks/
│     ├─ components/
│     ├─ hooks/
│     ├─ api/
│     ├─ types.ts
│     └─ index.ts
├─ components/
│  └─ ui/
├─ lib/
└─ shared/
```

設計の要点:

- 技術名ではなく機能単位で分ける
- 型を先に設計し、コンポーネントの契約を明確にする
- `index.ts` から公開 API を定義し、内部構造への依存を減らす
- Container と Presentational の責任を必要に応じて分ける
- 何でも `utils` や `components` に置かない
- 循環 import と過剰なバレルエクスポートに注意する

---

## STEP08: React Hook Form + Zod

### なぜフォームライブラリを使うか

フォームでは、入力値だけでなく次の状態も管理します。

- 各フィールドの値
- エラー
- touched / dirty 状態
- 送信中・送信成功・送信失敗
- 動的フィールド
- 非同期バリデーション

入力数が増えると、すべてを `useState` で管理するコードは複雑になります。
React Hook Form はフォーム状態を効率よく扱い、Zod は入力データの契約と検証を担当します。

### 基本の連携

```tsx
const schema = z.object({
  name: z.string().min(1, "名前は必須です"),
  email: z.string().email("メール形式が正しくありません"),
  age: z.coerce.number().int().min(18, "18歳以上が必要です"),
});

type FormValues = z.infer<typeof schema>;

function UserForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormValues) => {
    await saveUser(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label htmlFor="name">名前</label>
      <input id="name" {...register("name")} />
      {errors.name && <p>{errors.name.message}</p>}

      <label htmlFor="email">メール</label>
      <input id="email" type="email" {...register("email")} />
      {errors.email && <p>{errors.email.message}</p>}

      <button disabled={isSubmitting} type="submit">
        {isSubmitting ? "送信中..." : "保存"}
      </button>
    </form>
  );
}
```

ブラウザの `<input>` の値は文字列として届くため、数値項目では `z.coerce.number()`、
`valueAsNumber`、または明示的な変換を検討します。

### `register` と `Controller`

| API | 用途 |
| --- | --- |
| `register` | input、select、textarea など標準 HTML 要素 |
| `Controller` | UI ライブラリや独自の Controlled コンポーネント |
| `watch` | 入力値を監視して表示を変える |
| `setValue` | 値をプログラムから設定する |
| `reset` | 初期値や編集後の値に戻す |
| `useFieldArray` | 行の追加・削除がある配列フィールド |

外部 UI コンポーネントは `value`、`onChange`、`onBlur`、`ref` の接続方法を確認します。
その橋渡しをするのが `Controller` です。

### Zod の役割

Zod は、TypeScript の型だけでは守れない実行時データを検証します。

```tsx
const registrationSchema = z
  .object({
    password: z.string().min(8),
    confirmPassword: z.string(),
    role: z.enum(["user", "admin"]),
    adminCode: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "パスワードが一致しません",
    path: ["confirmPassword"],
  });
```

`refine` でフィールド間の検証、`transform` や `coerce` で変換を行えます。
クライアント側で検証しても、API 側での検証は必ず必要です。

### フォーム設計の注意点

- label と input を正しく関連付ける
- エラーを該当フィールドの近くに表示する
- 送信中は二重送信を防ぐ
- 動的リストでは安定した ID を使う
- ファイルは `FileList` とサイズ・形式を検証する
- 非同期検証は通信中の状態と競合を扱う
- 検索フォームでは入力値・送信タイミング・URL の責任を分ける

---

## STEP09: テスト

### テストピラミッド

```text
        E2E / 少数の重要シナリオ
      Integration / 複数部品と API の境界
    Unit / 純粋関数・小さなロジックを多数
```

React アプリでは、次のバランスを意識します。

- 純粋な計算・バリデーションは Unit Test
- コンポーネントの表示と操作は React Testing Library
- API 通信を含む流れは MSW を使った統合テスト
- 本当に重要な利用シナリオだけ E2E

### Vitest と AAA

```tsx
describe("addTodo", () => {
  it("新しい Todo を追加する", () => {
    // Arrange
    const todos = [{ id: 1, title: "読む", done: false }];

    // Act
    const result = addTodo(todos, { id: 2, title: "書く", done: false });

    // Assert
    expect(result).toHaveLength(2);
    expect(result[1].title).toBe("書く");
  });
});
```

AAA は、準備・実行・検証を分けるパターンです。
1 テスト 1 目的にすると失敗原因が分かりやすくなります。

よく使う機能:

- `describe`、`it` / `test`
- `expect` と matcher
- `beforeEach`、`afterEach`
- `vi.fn()` による関数モック
- `vi.mock()` によるモジュールモック
- `async/await` による非同期テスト
- fake timer によるタイマーの制御

### React Testing Library

React Testing Library は、コンポーネント内部の State や実装ではなく、
ユーザーが見て操作できる結果をテストします。

```tsx
it("入力して送信できる", async () => {
  const user = userEvent.setup();
  const onSubmit = vi.fn();

  render(<ContactForm onSubmit={onSubmit} />);

  await user.type(screen.getByLabelText("名前"), "太郎");
  await user.click(screen.getByRole("button", { name: "送信" }));

  expect(onSubmit).toHaveBeenCalledWith({ name: "太郎" });
});
```

### クエリの優先順位

ユーザーが要素を見つける方法に近い順で選びます。

1. `getByRole`
2. `getByLabelText`
3. `getByPlaceholderText`
4. `getByText`
5. `getByDisplayValue`、`getByAltText`
6. `getByTestId` は最後の手段

同期・非同期・存在しないことの違い:

| クエリ | 用途 |
| --- | --- |
| `getBy...` | すぐ存在する要素 |
| `queryBy...` | 存在しないことの確認 |
| `findBy...` | 非同期で現れる要素 |
| `getAllBy...` | 同期的な複数要素 |
| `findAllBy...` | 非同期で現れる複数要素 |

ユーザー操作には `fireEvent` より `userEvent` を優先します。
`userEvent` はフォーカスやキーボード操作を含む、実際の操作に近い挙動を再現します。

### MSW による API モック

API を直接呼ぶテストは、サーバーの状態やネットワークに依存して不安定になります。
MSW は HTTP リクエストをネットワーク層で横取りし、成功・空結果・404・500 などを再現します。

```tsx
const handlers = [
  http.get("/api/users", () => {
    return HttpResponse.json([{ id: 1, name: "太郎" }]);
  }),
];
```

`vi.mock` は関数・モジュールを差し替える仕組み、MSW は HTTP 通信を差し替える仕組みです。
API との境界をテストしたい場合は MSW が適しています。

### 壊れにくいテスト

- className や内部 State ではなく、Role・Label・Text で探す
- 「クリックしたら表示される」「送信中はボタンが無効」などユーザー価値を検証する
- 実装を変更しても仕様が同じならテストが壊れないようにする
- 1 テストで多くを検証しすぎない
- カバレッジの数字だけを目標にしない
- API の成功だけでなく、ローディング・空・エラーも確認する

---

## 🔗 React の知識をつなげる

### 機能を作るときの判断フロー

```text
1. 画面をコンポーネントに分割する
        ↓
2. 静的 UI を作る
        ↓
3. 変化する最小データを State として決める
        ↓
4. State の所有者を決める
   ├─ 1 コンポーネントだけ       → useState
   ├─ 兄弟で共有                  → 親へリフトアップ
   ├─ 深いツリーで共有            → Composition / Context
   ├─ 複数画面の Client State      → Zustand
   ├─ サーバー由来のデータ         → TanStack Query
   └─ フォームの値・検証           → React Hook Form + Zod
        ↓
5. 親からデータ、子からイベントを流す
        ↓
6. 派生値は計算し、Effect を増やさない
        ↓
7. TypeScript で Props・State・API 契約を定義する
        ↓
8. ユーザー操作と成功・失敗状態をテストする
```

### 具体的な統合イメージ

```tsx
type TaskStatus = "todo" | "done";

type Task = {
  id: string;
  title: string;
  status: TaskStatus;
};

type TaskListProps = {
  tasks: Task[];
  onToggle: (id: string) => void;
};

function TaskList({ tasks, onToggle }: TaskListProps) {
  return (
    <ul>
      {tasks.map((task) => (
        <li key={task.id}>
          <button onClick={() => onToggle(task.id)}>
            {task.status === "done" ? "完了" : "未完了"}
          </button>
          {task.title}
        </li>
      ))}
    </ul>
  );
}
```

この小さな例にも、次の考え方が含まれています。

- TypeScript の Union 型で状態を限定する
- Props でデータとイベントの契約を定義する
- 親が State を所有し、子は表示とイベント通知を担当する
- `map` と安定した `key` でリストを表示する
- UI は `task.status` から宣言的に決まる
- State の更新は親でイミュータブルに行う

---

## 🧭 使い分けクイックリファレンス

| やりたいこと | 第一候補 | 注意点 |
| --- | --- | --- |
| ボタンの開閉を管理する | `useState` | State を最も近い所有者に置く |
| 兄弟で同じ値を使う | State のリフトアップ | 共通の親に置く |
| 深い子でテーマを読む | `useContext` | 広い更新範囲に注意 |
| カートをどこからでも更新する | Zustand | 局所 State まで入れない |
| API データを取得する | TanStack Query | query key とキャッシュを設計する |
| 入力フォームを管理する | React Hook Form | `register` と `Controller` を使い分ける |
| 入力値を検証する | Zod | クライアントとサーバーの両方で検証する |
| DOM にフォーカスする | `useRef` | UI の値には State を使う |
| 外部 API と同期する | `useEffect` | cleanup と依存配列を忘れない |
| 重い計算を再利用する | `useMemo` | まず計測し、必要な箇所だけ使う |
| ロジックを複数部品で再利用する | カスタムフック | State は呼び出し元ごとに独立する |
| UI の枠と中身を分離する | Composition | `children`、要素 Props を使う |
| テーブル機能を組み込む | TanStack Table | Headless なので表示は自分で作る |
| 純粋関数を検証する | Vitest | AAA で小さく書く |
| ユーザー操作を検証する | Testing Library + userEvent | Role・Label を優先する |
| API を再現する | MSW | 成功・空・エラーを用意する |

---

## ⚠️ よくある間違い

### 1. State を直接変更する

```tsx
// ❌
todos.push(todo);
user.name = "Alice";

// ✅
setTodos((current) => [...current, todo]);
setUser((current) => ({ ...current, name: "Alice" }));
```

### 2. 派生値を State に重複して保存する

`items` と `completedCount` を別々に管理すると同期漏れが起きます。
`items.filter(...).length` のように計算できる値は計算します。

### 3. すべてを `useEffect` に入れる

Effect は外部システムとの同期用です。
クリック時の処理はイベントハンドラー、派生値はレンダリング中の計算で行います。

### 4. `useMemo` とグローバル State を先に導入する

まずローカルな最小構成で作り、実際に共有や性能上の問題が出たときに導入します。
抽象化は問題を解決するために行い、流行しているからという理由だけで追加しません。

### 5. `key` に index を使う

並び替え・削除・追加があるリストでは、index が別のデータを指すようになります。
データ固有の安定した ID を使います。

### 6. Props を `any` にする

`any` は短期的には速く見えますが、コンポーネント間の契約を失います。
Union 型、`React.ReactNode`、コールバック型、ジェネリクスを適切に使います。

### 7. テストで実装の詳細を見る

内部 State や className の確認だけでは、ユーザーにとって重要な動作を保証できません。
`getByRole`、`getByLabelText`、`userEvent` を使って画面の振る舞いを確認します。

---

## ✅ 学習内容チェックリスト

### React の基礎

- [ ] React の宣言的 UI と Vanilla JavaScript の命令的 DOM 操作の違いを説明できる
- [ ] コンポーネントの責任を分割し、JSX のルールを守って書ける
- [ ] Props を読み取り専用の入力として扱える
- [ ] `map`、安定した `key`、条件付きレンダリングを使い分けられる
- [ ] `children` と Fragment を使って不要な DOM を減らせる

### State とデータフロー

- [ ] State と Props の役割を説明できる
- [ ] State 更新に setter と関数型更新を使える
- [ ] オブジェクト・配列をイミュータブルに更新できる
- [ ] 派生値を State にせず計算できる
- [ ] State のリフトアップと親子間コールバックを実装できる
- [ ] 制御されたフォームを作り、submit を処理できる
- [ ] React Developer Tools で State とコンポーネントツリーを確認できる

### Hooks とライブラリ

- [ ] Hooks をトップレベルで呼ぶルールを守れる
- [ ] `useEffect` の依存配列と cleanup の意味を説明できる
- [ ] `useEffect` を使うべき処理・使わない処理を判断できる
- [ ] `useRef` と `useState` を使い分けられる
- [ ] Context を使う範囲を判断できる
- [ ] カスタムフックの State が呼び出し元ごとに独立することを理解している
- [ ] Client State と Server State を区別できる
- [ ] Zustand、TanStack Query、shadcn/ui の役割を説明できる

### TypeScript と設計

- [ ] Props、children、コールバック、イベントを型定義できる
- [ ] `useState<User | null>`、`useState<Item[]>([])` の型を適切に書ける
- [ ] Union 型と `Record` で選択肢を安全に表現できる
- [ ] Composition、Headless、HOC、Render Props の違いを説明できる
- [ ] 機能単位のフォルダ構成と公開 API を設計できる
- [ ] TanStack Table が Headless である意味を説明できる

### フォームとテスト

- [ ] `register` と `Controller` の使い分けを説明できる
- [ ] Zod スキーマから `z.infer` で型を作れる
- [ ] クロスフィールド検証・変換・動的フィールドの考え方を理解している
- [ ] Vitest の AAA パターンで純粋関数をテストできる
- [ ] Testing Library で Role・Label を使って要素を探せる
- [ ] `getBy`、`queryBy`、`findBy` を使い分けられる
- [ ] `userEvent` でユーザー操作を再現できる
- [ ] MSW で API の成功・空・エラーを再現できる

---

## 🎯 最終整理

React の学習で最も重要なのは、API の暗記ではなく設計判断です。

```text
UI を分ける
  ↓
最小の State を決める
  ↓
State の所有者を決める
  ↓
Props とイベントで一方向に流す
  ↓
必要な問題にだけ Hook・Context・ライブラリを使う
  ↓
型で契約を守る
  ↓
ユーザーの操作と結果をテストする
```

迷ったときは、次の原則に戻ります。

1. State は最初はローカルに置く
2. Props はデータ、コールバックはイベントとして渡す
3. 計算できる値を State にしない
4. Effect は外部システムとの同期に限定する
5. 直接変更せず、新しい配列・オブジェクトを作る
6. 抽象化は重複や複雑さという具体的な問題に対して行う
7. テストは実装ではなくユーザーが経験する振る舞いを確認する

Phase2 の React 学習は、コンポーネントを書けるようになることから始まり、
最終的には「どこに責任を置き、どの仕組みを選び、どう変更に強くするか」を判断する学習です。
この総まとめを読み返した後、各 STEP の教材に戻るときは、
コードの書き方だけでなく、その設計判断がどの問題を解決しているかに注目してください。
