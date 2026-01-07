# Session 2: React Query（TanStack Query）- サーバー状態管理

## はじめに：クライアント状態 vs サーバー状態

前回のセッションで Zustand を使った状態管理を学びました。しかし、Web アプリケーションには **2 種類の状態** があります：

| 種類                 | 説明                       | 例                                      |
| -------------------- | -------------------------- | --------------------------------------- |
| **クライアント状態** | ブラウザ内で完結する状態   | UI の開閉状態、フォーム入力、テーマ設定 |
| **サーバー状態**     | サーバーから取得するデータ | ユーザー情報、商品一覧、記事データ      |

Zustand は**クライアント状態**の管理に適していますが、**サーバー状態**には特有の課題があります：

| 課題                     | 説明                                       |
| ------------------------ | ------------------------------------------ |
| **非同期処理**           | データ取得は非同期で行われる               |
| **キャッシュ**           | 同じデータを何度も取得するのは無駄         |
| **古いデータ**           | データは時間とともに古くなる（stale）      |
| **バックグラウンド更新** | ユーザーが操作中でもデータを最新に保ちたい |
| **エラーハンドリング**   | ネットワークエラーへの対処                 |
| **ローディング状態**     | データ取得中の表示                         |

**React Query（TanStack Query）** は、これらの課題を解決するライブラリです。

---

## 1. React Query とは？

### 特徴

| 特徴                        | 説明                                         |
| --------------------------- | -------------------------------------------- |
| **自動キャッシュ**          | 同じデータを再取得せず、キャッシュから返す   |
| **自動再フェッチ**          | 画面フォーカス時やネットワーク復帰時に再取得 |
| **ローディング/エラー状態** | 自動的に管理される                           |
| **楽観的更新**              | サーバー応答を待たずに UI を更新             |
| **無限スクロール**          | ページネーションのサポート                   |
| **DevTools**                | 強力なデバッグツール                         |

### なぜ React Query を使うのか？

```jsx
// ❌ 従来の方法: 毎回同じコードを書く
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch(`https://jsonplaceholder.typicode.com/users/${userId}`)
      .then((res) => res.json())
      .then((data) => setUser(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading) return <p>読み込み中...</p>;
  if (error) return <p>エラー: {error}</p>;
  return <div>{user.name}</div>;
}

// ✅ React Query: シンプルで強力
function UserProfile({ userId }) {
  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["user", userId],
    queryFn: () =>
      fetch(`https://jsonplaceholder.typicode.com/users/${userId}`).then(
        (res) => res.json()
      ),
  });

  if (isLoading) return <p>読み込み中...</p>;
  if (error) return <p>エラー: {error.message}</p>;
  return <div>{user.name}</div>;
}
```

---

## 2. 基本的な使い方

### インストール

```bash
npm install @tanstack/react-query
```

### Step 1: QueryClientProvider の設定

React Query を使うには、アプリケーション全体を `QueryClientProvider` でラップする必要があります。

```jsx
// main.jsx または App.jsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// QueryClient のインスタンスを作成
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* アプリケーション全体 */}
      <YourApp />
    </QueryClientProvider>
  );
}
```

### Step 2: useQuery でデータを取得する

```jsx
// components/UserList.jsx
import { useQuery } from "@tanstack/react-query";

function UserList() {
  const {
    data, // 取得したデータ
    isLoading, // 初回ローディング中かどうか
    isError, // エラーが発生したかどうか
    error, // エラーオブジェクト
    isFetching, // バックグラウンドでフェッチ中かどうか
  } = useQuery({
    queryKey: ["users"], // キャッシュのキー
    queryFn: fetchUsers, // データ取得関数
  });

  if (isLoading) return <p>読み込み中...</p>;
  if (isError) return <p>エラー: {error.message}</p>;

  return (
    <ul>
      {data.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}

// データ取得関数
async function fetchUsers() {
  const response = await fetch("https://jsonplaceholder.typicode.com/users");
  if (!response.ok) {
    throw new Error("データの取得に失敗しました");
  }
  return response.json();
}
```

**コード解説:**

```jsx
queryKey: ['users'],
```

- キャッシュを識別するためのキー
- 配列形式で指定（文字列やオブジェクトも含められる）
- 同じキーを使うと、キャッシュからデータを返す

```jsx
queryFn: fetchUsers,
```

- データを取得する関数（Promise を返す必要がある）
- エラー時は throw する

---

## 3. queryKey の設計

`queryKey` は React Query の最も重要な概念の 1 つです。

### 基本ルール

```jsx
// シンプルなキー
queryKey: ["users"];

// パラメータを含むキー
queryKey: ["users", userId];

// 複数のパラメータ
queryKey: ["users", { status: "active", page: 1 }];

// ネストした構造
queryKey: ["users", userId, "posts"];
```

### キーが変わると自動再フェッチ

```jsx
function UserProfile({ userId }) {
  const { data } = useQuery({
    queryKey: ["user", userId], // userId が変わるとキーも変わる
    queryFn: () => fetchUser(userId),
  });
  // userId が変わると、自動的に新しいデータを取得する
}
```

### 実践例: 検索とフィルタリング

> **💡 使用 API:** [DummyJSON](https://dummyjson.com/) - 商品検索 API を無料で提供しています

```jsx
// 商品を検索する関数
async function fetchProducts({ search, category }) {
  let url = "https://dummyjson.com/products";

  if (search) {
    url = `https://dummyjson.com/products/search?q=${search}`;
  } else if (category && category !== "all") {
    url = `https://dummyjson.com/products/category/${category}`;
  }

  const response = await fetch(url);
  if (!response.ok) throw new Error("商品の取得に失敗しました");
  const data = await response.json();
  return data.products;
}

function ProductList() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const { data: products, isLoading } = useQuery({
    queryKey: ["products", { search, category }], // 検索条件をキーに含める
    queryFn: () => fetchProducts({ search, category }),
  });

  return (
    <div>
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="検索..."
      />
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="all">すべて</option>
        <option value="smartphones">スマートフォン</option>
        <option value="laptops">ノートPC</option>
        <option value="fragrances">香水</option>
      </select>

      {isLoading ? (
        <p>読み込み中...</p>
      ) : (
        <ul>
          {products?.map((product) => (
            <li key={product.id}>
              {product.title} - ${product.price}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

---

## 4. useMutation でデータを更新する

`useQuery` は読み取り（GET）用、`useMutation` は書き込み（POST, PUT, DELETE）用です。

### 基本的な使い方

```jsx
import { useMutation, useQueryClient } from "@tanstack/react-query";

function CreateTodo() {
  const [text, setText] = useState("");
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (newTodo) => {
      return fetch("https://jsonplaceholder.typicode.com/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTodo),
      }).then((res) => res.json());
    },
    onSuccess: () => {
      // 成功時にキャッシュを無効化して再取得
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({ text }); // mutation を実行
    setText("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={text} onChange={(e) => setText(e.target.value)} />
      <button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? "追加中..." : "追加"}
      </button>
      {mutation.isError && <p>エラー: {mutation.error.message}</p>}
    </form>
  );
}
```

**コード解説:**

```jsx
const queryClient = useQueryClient();
```

- QueryClient インスタンスを取得
- キャッシュの操作に使用

```jsx
mutation.mutate({ text });
```

- mutation を実行
- 引数は `mutationFn` の引数として渡される

```jsx
queryClient.invalidateQueries({ queryKey: ["todos"] });
```

- 指定したキーのキャッシュを無効化
- 次にそのデータが必要になったとき、再フェッチされる

---

## 5. 実践例: Todo アプリ（完全版）

> **💡 使用 API:** [JSONPlaceholder](https://jsonplaceholder.typicode.com/) - 無料の Fake REST API です。POST/PUT/DELETE リクエストは受け付けられますが、実際にはデータは変更されません（レスポンスは返ってきます）。

### API 関数の定義

```jsx
// api/todos.js
const API_URL = "https://jsonplaceholder.typicode.com/todos";

export async function fetchTodos() {
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error("Todoの取得に失敗しました");
  return response.json();
}

export async function createTodo(todo) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(todo),
  });
  if (!response.ok) throw new Error("Todoの作成に失敗しました");
  return response.json();
}

export async function updateTodo(todo) {
  const response = await fetch(`${API_URL}/${todo.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(todo),
  });
  if (!response.ok) throw new Error("Todoの更新に失敗しました");
  return response.json();
}

export async function deleteTodo(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Todoの削除に失敗しました");
  return response.json();
}
```

### カスタムフック

```jsx
// hooks/useTodos.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchTodos, createTodo, updateTodo, deleteTodo } from "../api/todos";

// =====================================
// Todo一覧を取得
// =====================================
export function useTodos() {
  return useQuery({
    queryKey: ["todos"],
    queryFn: fetchTodos,
  });
}

// =====================================
// Todoを作成
// =====================================
export function useCreateTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });
}

// =====================================
// Todoを更新
// =====================================
export function useUpdateTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });
}

// =====================================
// Todoを削除
// =====================================
export function useDeleteTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });
}
```

### コンポーネント

```jsx
// components/TodoApp.jsx
import { useState } from "react";
import {
  useTodos,
  useCreateTodo,
  useUpdateTodo,
  useDeleteTodo,
} from "../hooks/useTodos";

function TodoApp() {
  const { data: todos, isLoading, error } = useTodos();
  const createMutation = useCreateTodo();
  const updateMutation = useUpdateTodo();
  const deleteMutation = useDeleteTodo();
  const [newTodoText, setNewTodoText] = useState("");

  const handleCreate = (e) => {
    e.preventDefault();
    if (newTodoText.trim()) {
      createMutation.mutate({ title: newTodoText, completed: false });
      setNewTodoText("");
    }
  };

  const handleToggle = (todo) => {
    updateMutation.mutate({ ...todo, completed: !todo.completed });
  };

  const handleDelete = (id) => {
    deleteMutation.mutate(id);
  };

  if (isLoading) return <p>読み込み中...</p>;
  if (error) return <p>エラー: {error.message}</p>;

  return (
    <div>
      <h1>Todo リスト</h1>

      {/* 新規作成フォーム */}
      <form onSubmit={handleCreate}>
        <input
          value={newTodoText}
          onChange={(e) => setNewTodoText(e.target.value)}
          placeholder="新しいTodo..."
        />
        <button type="submit" disabled={createMutation.isPending}>
          {createMutation.isPending ? "追加中..." : "追加"}
        </button>
      </form>

      {/* Todoリスト */}
      <ul>
        {todos.slice(0, 10).map((todo) => (
          <li key={todo.id}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => handleToggle(todo)}
            />
            <span
              style={{
                textDecoration: todo.completed ? "line-through" : "none",
              }}
            >
              {todo.title}
            </span>
            <button onClick={() => handleDelete(todo.id)}>削除</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TodoApp;
```

---

## 6. キャッシュの設定

React Query はデフォルトで賢いキャッシュ戦略を持っていますが、カスタマイズも可能です。

### staleTime と gcTime

```jsx
const { data } = useQuery({
  queryKey: ["users"],
  queryFn: fetchUsers,
  staleTime: 5 * 60 * 1000, // 5分間は「新鮮」とみなす
  gcTime: 30 * 60 * 1000, // 30分間キャッシュを保持
});
```

| 設定        | 説明                                             | デフォルト          |
| ----------- | ------------------------------------------------ | ------------------- |
| `staleTime` | データが「古い」とみなされるまでの時間           | 0（即座に古くなる） |
| `gcTime`    | 使用されていないキャッシュが削除されるまでの時間 | 5 分                |

### グローバル設定

```jsx
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // すべてのクエリで5分
      retry: 3, // 失敗時に3回リトライ
      refetchOnWindowFocus: true, // ウィンドウフォーカス時に再取得
    },
  },
});
```

---

## 7. 楽観的更新（Optimistic Updates）

サーバーの応答を待たずに UI を先に更新する手法です。

```jsx
export function useUpdateTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateTodo,

    // mutation 開始前に呼ばれる
    onMutate: async (newTodo) => {
      // 進行中のクエリをキャンセル
      await queryClient.cancelQueries({ queryKey: ["todos"] });

      // 現在のキャッシュを保存（ロールバック用）
      const previousTodos = queryClient.getQueryData(["todos"]);

      // キャッシュを楽観的に更新
      queryClient.setQueryData(["todos"], (old) =>
        old.map((todo) => (todo.id === newTodo.id ? newTodo : todo))
      );

      // ロールバック用のデータを返す
      return { previousTodos };
    },

    // エラー時にロールバック
    onError: (err, newTodo, context) => {
      queryClient.setQueryData(["todos"], context.previousTodos);
    },

    // 成功・失敗に関わらずキャッシュを再検証
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });
}
```

**フロー:**

1. ユーザーがチェックボックスをクリック
2. UI が即座に更新される（楽観的更新）
3. バックグラウンドでサーバーにリクエスト
4. 成功：キャッシュを再検証
5. 失敗：元の状態にロールバック

---

## 8. 無限スクロール（Infinite Queries）

ページネーションやスクロールでの追加読み込みに使用します。

> **💡 使用 API:** [DummyJSON](https://dummyjson.com/) - ページネーション対応の商品 API を提供しています

```jsx
import { useInfiniteQuery } from "@tanstack/react-query";

// ページごとに商品を取得する関数
async function fetchProducts(page) {
  const limit = 10;
  const skip = (page - 1) * limit;
  const response = await fetch(
    `https://dummyjson.com/products?limit=${limit}&skip=${skip}`
  );
  if (!response.ok) throw new Error("商品の取得に失敗しました");
  const data = await response.json();
  return {
    products: data.products,
    hasMore: skip + data.products.length < data.total,
  };
}

function InfiniteProductList() {
  const {
    data,
    fetchNextPage, // 次のページを取得する関数
    hasNextPage, // 次のページがあるかどうか
    isFetchingNextPage, // 次のページを取得中かどうか
    isLoading,
    error,
  } = useInfiniteQuery({
    queryKey: ["products"],
    queryFn: ({ pageParam = 1 }) => fetchProducts(pageParam),
    getNextPageParam: (lastPage, pages) => {
      // 次のページ番号を返す（なければ undefined）
      return lastPage.hasMore ? pages.length + 1 : undefined;
    },
  });

  if (isLoading) return <p>読み込み中...</p>;
  if (error) return <p>エラー: {error.message}</p>;

  return (
    <div>
      {data.pages.map((page, i) => (
        <div key={i}>
          {page.products.map((product) => (
            <div key={product.id}>
              {product.title} - ${product.price}
            </div>
          ))}
        </div>
      ))}

      <button
        onClick={() => fetchNextPage()}
        disabled={!hasNextPage || isFetchingNextPage}
      >
        {isFetchingNextPage
          ? "読み込み中..."
          : hasNextPage
          ? "もっと読み込む"
          : "これ以上ありません"}
      </button>
    </div>
  );
}
```

---

## 9. DevTools の活用

React Query DevTools を使うと、キャッシュの状態を視覚的に確認できます。

### インストール

```bash
npm install @tanstack/react-query-devtools
```

### 設定

```jsx
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <YourApp />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```

DevTools では以下を確認できます：

- すべてのクエリとその状態
- キャッシュされたデータ
- クエリの実行履歴
- 手動での再フェッチやキャッシュクリア

---

## 10. Zustand との組み合わせ

クライアント状態（Zustand）とサーバー状態（React Query）を組み合わせて使うのがベストプラクティスです。

```jsx
// stores/useUIStore.js（Zustand）
import { create } from "zustand";

const useUIStore = create((set) => ({
  selectedUserId: null,
  setSelectedUserId: (id) => set({ selectedUserId: id }),
}));

// components/UserDetail.jsx
function UserDetail() {
  // クライアント状態: 選択されたユーザーID
  const selectedUserId = useUIStore((state) => state.selectedUserId);

  // サーバー状態: ユーザーデータ
  const { data: user, isLoading } = useQuery({
    queryKey: ["user", selectedUserId],
    queryFn: () =>
      fetch(
        `https://jsonplaceholder.typicode.com/users/${selectedUserId}`
      ).then((res) => res.json()),
    enabled: !!selectedUserId, // selectedUserId がある場合のみ実行
  });

  if (!selectedUserId) return <p>ユーザーを選択してください</p>;
  if (isLoading) return <p>読み込み中...</p>;

  return <div>{user.name}</div>;
}
```

**役割分担:**

| ライブラリ  | 担当する状態                            |
| ----------- | --------------------------------------- |
| Zustand     | UI の状態、ユーザーの選択、フォーム入力 |
| React Query | API から取得したデータ、キャッシュ      |

---

## まとめ

| 概念                | 説明                         |
| ------------------- | ---------------------------- |
| `useQuery`          | データの取得（読み取り）     |
| `useMutation`       | データの更新（書き込み）     |
| `queryKey`          | キャッシュを識別するキー     |
| `queryFn`           | データ取得関数               |
| `invalidateQueries` | キャッシュを無効化して再取得 |
| `staleTime`         | データが古くなるまでの時間   |
| `enabled`           | クエリを条件付きで実行       |

### React Query を使うべき場面

- API からデータを取得する
- データのキャッシュが必要
- ローディング/エラー状態の管理
- ページネーションや無限スクロール
- 楽観的更新が必要

---

## 練習問題

> **💡 使用する API:**
>
> - JSONPlaceholder: https://jsonplaceholder.typicode.com
> - DummyJSON: https://dummyjson.com

### 問題 1: ユーザー一覧と詳細

1. `https://jsonplaceholder.typicode.com/users` からユーザー一覧を取得して表示
2. ユーザーをクリックすると、`https://jsonplaceholder.typicode.com/users/:id` から詳細を取得して表示

### 問題 2: 検索機能

1. `https://dummyjson.com/products/search?q=検索ワード` を使って商品検索を実装
2. debounce を使って、入力が止まってから検索を実行

### 問題 3: 楽観的更新

1. JSONPlaceholder の Todo API を使って、完了状態をトグルする機能を実装
2. 楽観的更新を使って、即座に UI を更新
3. エラー時にロールバック

---

次のセッションでは、**React Hook Form** を使ったフォーム管理を学びます。バリデーションやエラーハンドリングを効率的に行う方法を習得しましょう。
