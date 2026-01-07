# Session 1: Zustand - シンプルで強力な状態管理

## はじめに：なぜ Zustand が必要なのか？

前回のセッションで、カスタムフックを使ってロジックを再利用する方法を学びました。しかし、カスタムフックには 1 つの制限があります：

> **状態は共有されない**

```jsx
function ComponentA() {
  const { count } = useCounter(0); // ComponentA 専用の count
  return <p>A: {count}</p>;
}

function ComponentB() {
  const { count } = useCounter(0); // ComponentB 専用の count（A とは別物！）
  return <p>B: {count}</p>;
}
```

複数のコンポーネントで同じ状態を共有したい場合、React 標準では **Context** を使いますが、Context には以下の課題があります：

| 課題                 | 説明                                                                   |
| -------------------- | ---------------------------------------------------------------------- |
| **ボイラープレート** | Provider でラップする必要がある                                        |
| **パフォーマンス**   | Context の値が変わると、すべての子コンポーネントが再レンダリングされる |
| **複雑さ**           | 大規模アプリでは Provider のネストが深くなる                           |

**Zustand** は、これらの課題を解決するシンプルな状態管理ライブラリです。

---

## 1. Zustand とは？

### 特徴

| 特徴                     | 説明                                       |
| ------------------------ | ------------------------------------------ |
| **シンプル**             | 最小限のボイラープレートで状態管理ができる |
| **軽量**                 | バンドルサイズが非常に小さい（約 1KB）     |
| **Provider 不要**        | コンポーネントツリーをラップする必要がない |
| **React 外でも使用可能** | どこからでも状態にアクセス・更新できる     |
| **TypeScript 対応**      | 型推論が優れている                         |

### Redux との比較

```jsx
// ❌ Redux: ボイラープレートが多い
// - Action の定義
// - Action Creator の定義
// - Reducer の定義
// - combineReducers
// - configureStore
// - Provider でラップ
// - useSelector + useDispatch

// ✅ Zustand: シンプル！
import { create } from "zustand";

const useStore = create((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
}));
```

---

## 2. 基本的な使い方

### インストール

```bash
npm install zustand
```

### Step 1: ストアを作成する

```jsx
// stores/useCounterStore.js
import { create } from "zustand";

// create() でストアを作成
const useCounterStore = create((set) => ({
  // =====================================
  // ① 状態（state）
  // =====================================
  count: 0,

  // =====================================
  // ② アクション（状態を更新する関数）
  // =====================================
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 }),
}));

export default useCounterStore;
```

**コード解説:**

```jsx
import { create } from "zustand";
```

- `create` は Zustand のストアを作成する関数
- この関数にコールバックを渡して、状態とアクションを定義する

```jsx
const useCounterStore = create((set) => ({
```

- `set` は状態を更新するための関数
- コールバックの戻り値がストアの初期状態になる
- 慣習として `use〇〇Store` という命名を使う（カスタムフックと同様）

```jsx
increment: () => set((state) => ({ count: state.count + 1 })),
```

- `set` には 2 つの使い方がある：
  1. `set({ count: 0 })` - 直接オブジェクトを渡す（マージされる）
  2. `set((state) => ({ count: state.count + 1 }))` - 現在の状態を使って更新

### Step 2: コンポーネントで使用する

```jsx
// components/Counter.jsx
import useCounterStore from "../stores/useCounterStore";

function Counter() {
  // ストアから必要な状態とアクションを取得
  const count = useCounterStore((state) => state.count);
  const increment = useCounterStore((state) => state.increment);
  const decrement = useCounterStore((state) => state.decrement);
  const reset = useCounterStore((state) => state.reset);

  return (
    <div>
      <p>カウント: {count}</p>
      <button onClick={increment}>+1</button>
      <button onClick={decrement}>-1</button>
      <button onClick={reset}>リセット</button>
    </div>
  );
}
```

**コード解説:**

```jsx
const count = useCounterStore((state) => state.count);
```

- ストアをフックとして呼び出す
- 引数にセレクター関数を渡して、必要な部分だけを取得
- **重要:** 必要な状態だけを選択することで、不要な再レンダリングを防げる

### セレクターの書き方（複数の値を取得する場合）

```jsx
// 方法1: 個別に取得（推奨）
const count = useCounterStore((state) => state.count);
const increment = useCounterStore((state) => state.increment);

// 方法2: オブジェクトで取得
const { count, increment } = useCounterStore((state) => ({
  count: state.count,
  increment: state.increment,
}));

// 方法3: ストア全体を取得（非推奨：不要な再レンダリングが発生）
const store = useCounterStore();
```

---

## 3. 状態の共有を確認しよう

Zustand の最大の利点は、**複数のコンポーネントで同じ状態を共有できる**ことです。

```jsx
// ComponentA.jsx
function ComponentA() {
  const count = useCounterStore((state) => state.count);
  const increment = useCounterStore((state) => state.increment);

  return (
    <div>
      <p>Component A: {count}</p>
      <button onClick={increment}>A から +1</button>
    </div>
  );
}

// ComponentB.jsx
function ComponentB() {
  const count = useCounterStore((state) => state.count);
  const increment = useCounterStore((state) => state.increment);

  return (
    <div>
      <p>Component B: {count}</p>
      <button onClick={increment}>B から +1</button>
    </div>
  );
}

// App.jsx
function App() {
  return (
    <div>
      <ComponentA />
      <ComponentB />
      {/* どちらのボタンを押しても、両方のカウントが更新される！ */}
    </div>
  );
}
```

**ポイント:**

- Provider でラップする必要がない
- どちらのコンポーネントからでも同じ `count` にアクセスできる
- 一方で更新すると、もう一方も自動的に更新される

---

## 4. 実践例: Todo リスト

より実践的な例として、Todo リストを作成してみましょう。

### ストアの作成

```jsx
// stores/useTodoStore.js
import { create } from "zustand";

const useTodoStore = create((set) => ({
  // =====================================
  // 状態
  // =====================================
  todos: [],

  // =====================================
  // アクション
  // =====================================

  // Todo を追加
  addTodo: (text) =>
    set((state) => ({
      todos: [
        ...state.todos,
        {
          id: Date.now(), // 簡易的なID生成
          text,
          completed: false,
        },
      ],
    })),

  // Todo を削除
  removeTodo: (id) =>
    set((state) => ({
      todos: state.todos.filter((todo) => todo.id !== id),
    })),

  // 完了状態を切り替え
  toggleTodo: (id) =>
    set((state) => ({
      todos: state.todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      ),
    })),

  // すべて削除
  clearAll: () => set({ todos: [] }),
}));

export default useTodoStore;
```

### コンポーネントの作成

```jsx
// components/TodoApp.jsx
import { useState } from "react";
import useTodoStore from "../stores/useTodoStore";

// =====================================
// Todo 入力フォーム
// =====================================
function TodoForm() {
  const [text, setText] = useState("");
  const addTodo = useTodoStore((state) => state.addTodo);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      addTodo(text.trim());
      setText("");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="新しいTodoを入力..."
      />
      <button type="submit">追加</button>
    </form>
  );
}

// =====================================
// Todo アイテム
// =====================================
function TodoItem({ todo }) {
  const toggleTodo = useTodoStore((state) => state.toggleTodo);
  const removeTodo = useTodoStore((state) => state.removeTodo);

  return (
    <li>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => toggleTodo(todo.id)}
      />
      <span
        style={{ textDecoration: todo.completed ? "line-through" : "none" }}
      >
        {todo.text}
      </span>
      <button onClick={() => removeTodo(todo.id)}>削除</button>
    </li>
  );
}

// =====================================
// Todo リスト
// =====================================
function TodoList() {
  const todos = useTodoStore((state) => state.todos);

  if (todos.length === 0) {
    return <p>Todoがありません</p>;
  }

  return (
    <ul>
      {todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </ul>
  );
}

// =====================================
// メインコンポーネント
// =====================================
function TodoApp() {
  const clearAll = useTodoStore((state) => state.clearAll);
  const todos = useTodoStore((state) => state.todos);

  return (
    <div>
      <h1>Todo リスト</h1>
      <TodoForm />
      <TodoList />
      {todos.length > 0 && <button onClick={clearAll}>すべて削除</button>}
    </div>
  );
}

export default TodoApp;
```

---

## 5. 派生状態（Computed Values）

状態から計算される値（派生状態）は、セレクター内で計算できます。

```jsx
// stores/useTodoStore.js
const useTodoStore = create((set, get) => ({
  todos: [],

  // ... 他のアクション

  // get() を使って現在の状態を取得
  getCompletedCount: () => {
    return get().todos.filter((todo) => todo.completed).length;
  },
}));

// コンポーネントで使用
function TodoStats() {
  // セレクター内で計算
  const totalCount = useTodoStore((state) => state.todos.length);
  const completedCount = useTodoStore(
    (state) => state.todos.filter((todo) => todo.completed).length
  );
  const pendingCount = totalCount - completedCount;

  return (
    <div>
      <p>全体: {totalCount}</p>
      <p>完了: {completedCount}</p>
      <p>未完了: {pendingCount}</p>
    </div>
  );
}
```

---

## 6. ミドルウェア: persist（永続化）

Zustand には便利なミドルウェアがあります。`persist` を使うと、状態を localStorage に自動保存できます。

```jsx
// stores/useTodoStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";

const useTodoStore = create(
  persist(
    (set) => ({
      todos: [],
      addTodo: (text) =>
        set((state) => ({
          todos: [...state.todos, { id: Date.now(), text, completed: false }],
        })),
      // ... 他のアクション
    }),
    {
      name: "todo-storage", // localStorage のキー名
    }
  )
);

export default useTodoStore;
```

**コード解説:**

```jsx
import { persist } from "zustand/middleware";
```

- `persist` は状態を永続化するミドルウェア
- デフォルトでは localStorage を使用

```jsx
persist(
  (set) => ({ ... }),
  { name: 'todo-storage' }
)
```

- 第 1 引数：通常のストア定義
- 第 2 引数：設定オブジェクト（`name` は必須）

これだけで、ページをリロードしても Todo が保持されます！

---

## 7. React 外からのアクセス

Zustand の強力な機能の 1 つは、React コンポーネント外からでも状態にアクセスできることです。

```jsx
// stores/useCounterStore.js
import { create } from "zustand";

const useCounterStore = create((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
}));

export default useCounterStore;

// =====================================
// React 外からアクセス
// =====================================

// 現在の状態を取得
const currentCount = useCounterStore.getState().count;

// 状態を更新
useCounterStore.getState().increment();

// または直接 setState を呼ぶ
useCounterStore.setState({ count: 100 });

// 状態の変化を購読
const unsubscribe = useCounterStore.subscribe((state) => {
  console.log("状態が変わりました:", state);
});
```

**使用例:**

```jsx
// utils/analytics.js（React コンポーネントではない）
import useCounterStore from "../stores/useCounterStore";

export function trackButtonClick() {
  const count = useCounterStore.getState().count;
  console.log(`ボタンがクリックされました。現在のカウント: ${count}`);
}
```

---

## 8. TypeScript での使用

TypeScript を使う場合、型を明示的に定義することで、より安全なコードが書けます。

```tsx
// stores/useCounterStore.ts
import { create } from "zustand";

// =====================================
// 型定義
// =====================================
interface CounterState {
  count: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
}

// =====================================
// ストア作成
// =====================================
const useCounterStore = create<CounterState>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 }),
}));

export default useCounterStore;
```

**ポイント:**

- `create<CounterState>` で型を指定
- これにより、`state.count` や `increment()` の型が自動的に推論される

---

## 9. ベストプラクティス

### 1. ストアを分割する

1 つのストアにすべてを詰め込まず、機能ごとに分割しましょう。

```jsx
// ❌ 1つの巨大なストア
const useStore = create((set) => ({
  // ユーザー関連
  user: null,
  login: () => {},
  logout: () => {},

  // Todo関連
  todos: [],
  addTodo: () => {},

  // 設定関連
  theme: 'light',
  language: 'ja',
  // ... 大量の状態とアクション
}));

// ✅ 機能ごとに分割
const useUserStore = create((set) => ({ ... }));
const useTodoStore = create((set) => ({ ... }));
const useSettingsStore = create((set) => ({ ... }));
```

### 2. セレクターで必要な部分だけ取得する

```jsx
// ❌ ストア全体を取得（todos が変わるとすべて再レンダリング）
const store = useTodoStore();

// ✅ 必要な部分だけ取得
const todos = useTodoStore((state) => state.todos);
const addTodo = useTodoStore((state) => state.addTodo);
```

### 3. アクション名は動詞で始める

```jsx
// ❌ 曖昧な名前
const useStore = create((set) => ({
  user: null,
  userData: (user) => set({ user }), // 何をする関数？
}));

// ✅ 動詞で始める
const useStore = create((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
  updateUserName: (name) =>
    set((state) => ({
      user: { ...state.user, name },
    })),
}));
```

---

## まとめ

| 概念       | 説明                                         |
| ---------- | -------------------------------------------- |
| `create`   | ストアを作成する関数                         |
| `set`      | 状態を更新する関数                           |
| `get`      | 現在の状態を取得する関数                     |
| セレクター | 必要な状態だけを選択する関数                 |
| `persist`  | 状態を localStorage に永続化するミドルウェア |

### Zustand を使うべき場面

- 複数のコンポーネントで状態を共有したい
- Context の Provider ネストを避けたい
- シンプルで軽量な状態管理が必要
- Redux のボイラープレートを避けたい

### 次のステップ

- 非同期処理（API 呼び出し）との組み合わせ
- `immer` ミドルウェアを使ったイミュータブルな更新
- `devtools` ミドルウェアを使ったデバッグ

---

## 練習問題

### 問題 1: ショッピングカート

以下の機能を持つショッピングカートのストアを作成してください：

- 商品の追加（`addItem`）
- 商品の削除（`removeItem`）
- 数量の変更（`updateQuantity`）
- 合計金額の計算

### 問題 2: テーマ切り替え

`persist` ミドルウェアを使って、ダークモード/ライトモードの設定を保存するストアを作成してください。

### 問題 3: 認証状態管理

以下の状態を管理する認証ストアを作成してください：

- ログイン状態（`isLoggedIn`）
- ユーザー情報（`user`）
- ログイン/ログアウト処理

---

次のセッションでは、**React Query（TanStack Query）** を使ったサーバー状態管理を学びます。Zustand と組み合わせることで、クライアント状態とサーバー状態を効率的に管理できるようになります。
