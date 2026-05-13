# Session 3: APIモックと統合テスト

## はじめに：なぜAPIモックが必要か

コンポーネントテストでAPIを呼び出す場合、以下の問題が生じます:

1. **テストが不安定** - ネットワーク状況に左右される
2. **テストが遅い** - 実際のAPI呼び出しを待つ必要がある
3. **外部依存** - テスト環境にAPIサーバーが必要
4. **再現性** - 同じデータが返ってこない場合がある

**Mock Service Worker（MSW）**は、これらの問題を解決するためのライブラリです。

---

## 1. MSWの基本

### インストール

```bash
npm install -D msw
```

### ハンドラーの作成

```ts
// src/mocks/handlers.ts
import { http, HttpResponse } from "msw";

export const handlers = [
  // GETリクエスト
  http.get("/api/users", () => {
    return HttpResponse.json([
      { id: 1, name: "太郎", email: "taro@example.com" },
      { id: 2, name: "花子", email: "hanako@example.com" },
    ]);
  }),
  
  // パスパラメータ
  http.get("/api/users/:id", ({ params }) => {
    const { id } = params;
    return HttpResponse.json({
      id: Number(id),
      name: "太郎",
      email: "taro@example.com",
    });
  }),
  
  // POSTリクエスト
  http.post("/api/users", async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json(
      { id: 3, ...body },
      { status: 201 }
    );
  }),
  
  // エラーレスポンス
  http.get("/api/error", () => {
    return HttpResponse.json(
      { message: "サーバーエラー" },
      { status: 500 }
    );
  }),
  
  // クエリパラメータ
  http.get("/api/search", ({ request }) => {
    const url = new URL(request.url);
    const query = url.searchParams.get("q");
    
    return HttpResponse.json([
      { id: 1, name: `Result for ${query}` },
    ]);
  }),
];
```

### サーバーのセットアップ

```ts
// src/mocks/server.ts
import { setupServer } from "msw/node";
import { handlers } from "./handlers";

export const server = setupServer(...handlers);
```

### テストのセットアップ

```ts
// src/test/setup.ts
import { beforeAll, afterAll, afterEach } from "vitest";
import { server } from "../mocks/server";

// 全テスト前にサーバー起動
beforeAll(() => server.listen({ onUnhandledRequest: "error" }));

// 各テスト後にハンドラーリセット
afterEach(() => server.resetHandlers());

// 全テスト後にサーバー停止
afterAll(() => server.close());
```

---

## 2. MSWを使ったテスト

### 基本パターン

```tsx
// UserList.tsx
import { useEffect, useState } from "react";

function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    fetch("/api/users")
      .then((res) => {
        if (!res.ok) throw new Error("Failed");
        return res.json();
      })
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <ul>
      {users.map((user: any) => (
        <li key={user.id}>{user.name} ({user.email})</li>
      ))}
    </ul>
  );
}

// UserList.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { http, HttpResponse } from "msw";
import { server } from "../mocks/server";
import { UserList } from "./UserList";

describe("UserList", () => {
  it("ユーザーリストを表示", async () => {
    render(<UserList />);
    
    expect(screen.getByText("Loading...")).toBeInTheDocument();
    
    // データがロードされるまで待つ
    const user1 = await screen.findByText("太郎 (taro@example.com)");
    expect(user1).toBeInTheDocument();
    
    expect(screen.getByText("花子 (hanako@example.com)")).toBeInTheDocument();
  });
  
  it("エラー時の表示", async () => {
    // 一時的にハンドラーを上書き
    server.use(
      http.get("/api/users", () => {
        return HttpResponse.json({ message: "Server Error" }, { status: 500 });
      })
    );
    
    render(<UserList />);
    
    const error = await screen.findByText(/Error:/);
    expect(error).toBeInTheDocument();
  });
  
  it("空のリスト", async () => {
    server.use(
      http.get("/api/users", () => {
        return HttpResponse.json([]);
      })
    );
    
    render(<UserList />);
    
    // Loadingが消えるまで待つ
    await screen.findByRole("list");
    
    expect(screen.queryAllByRole("listitem")).toHaveLength(0);
  });
});
```

### 一時的なハンドラー上書き

```ts
// 特定のテストだけ別のレスポンスを返す
it("特定ユーザーの詳細", async () => {
  server.use(
    http.get("/api/users/:id", ({ params }) => {
      const { id } = params;
      if (id === "999") {
        return HttpResponse.json({ message: "Not Found" }, { status: 404 });
      }
      return HttpResponse.json({ id: Number(id), name: "Test" });
    })
  );
  
  // ...
});
```

---

## 3. TanStack Query + MSW

### カスタムフックのテスト

```tsx
// hooks/useUsers.ts
import { useQuery } from "@tanstack/react-query";

export function useUsers() {
  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await fetch("/api/users");
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
  });
}

// hooks/useUsers.test.tsx
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { describe, it, expect } from "vitest";
import { useUsers } from "./useUsers";

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });
  
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    );
  };
}

describe("useUsers", () => {
  it("ユーザーを取得", async () => {
    const { result } = renderHook(() => useUsers(), {
      wrapper: createWrapper(),
    });
    
    // ローディング中
    expect(result.current.isLoading).toBe(true);
    
    // データ取得完了を待つ
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    
    expect(result.current.data).toEqual([
      { id: 1, name: "太郎", email: "taro@example.com" },
      { id: 2, name: "花子", email: "hanako@example.com" },
    ]);
  });
  
  it("エラー時", async () => {
    server.use(
      http.get("/api/users", () => {
        return HttpResponse.json({ message: "Error" }, { status: 500 });
      })
    );
    
    const { result } = renderHook(() => useUsers(), {
      wrapper: createWrapper(),
    });
    
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeDefined();
  });
});
```

---

## 4. フォーム送信の統合テスト

```tsx
// RegistrationForm.tsx
function RegistrationForm() {
  const [success, setSuccess] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  
  const onSubmit = async (data: any) => {
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    
    if (res.ok) {
      setSuccess(true);
    }
  };
  
  if (success) return <div>登録完了！</div>;
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("name", { required: true })} />
      <input {...register("email", { required: true })} type="email" />
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "送信中..." : "登録"}
      </button>
    </form>
  );
}

// RegistrationForm.test.tsx
describe("RegistrationForm", () => {
  it("正常に登録", async () => {
    const user = userEvent.setup();
    
    render(<RegistrationForm />);
    
    await user.type(screen.getByRole("textbox", { name: /名前/i }), "太郎");
    await user.type(screen.getByRole("textbox", { name: /メール/i }), "taro@example.com");
    await user.click(screen.getByRole("button", { name: "登録" }));
    
    // 成功メッセージ
    expect(await screen.findByText("登録完了！")).toBeInTheDocument();
  });
  
  it("バリデーションエラー", async () => {
    const user = userEvent.setup();
    
    render(<RegistrationForm />);
    await user.click(screen.getByRole("button"));
    
    // HTML5バリデーションまたはエラーメッセージ
    expect(screen.getByRole("textbox", { name: /名前/i })).toBeInvalid();
  });
  
  it("サーバーエラー", async () => {
    server.use(
      http.post("/api/register", () => {
        return HttpResponse.json({ message: "Email taken" }, { status: 400 });
      })
    );
    
    const user = userEvent.setup();
    render(<RegistrationForm />);
    
    await user.type(screen.getByRole("textbox", { name: /名前/i }), "太郎");
    await user.type(screen.getByRole("textbox", { name: /メール/i }), "taken@example.com");
    await user.click(screen.getByRole("button"));
    
    // エラー処理の確認（実装による）
  });
});
```

---

## 5. 実践演習

### 演習1: 商品一覧 + カート

以下のコンポーネントのテストを書いてください:

```tsx
function ProductList() {
  const { data: products, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: () => fetch("/api/products").then((r) => r.json()),
  });
  
  const addToCart = useMutation({
    mutationFn: (productId: number) =>
      fetch("/api/cart", {
        method: "POST",
        body: JSON.stringify({ productId }),
      }),
  });
  
  if (isLoading) return <div>Loading...</div>;
  
  return (
    <div>
      {products.map((product: any) => (
        <div key={product.id}>
          <h3>{product.name}</h3>
          <p>{product.price}円</p>
          <button onClick={() => addToCart.mutate(product.id)}>
            カートに追加
          </button>
        </div>
      ))}
    </div>
  );
}
```

**テストケース**:
1. 商品一覧が表示される
2. 「カートに追加」をクリック
3. ローディング状態
4. エラー状態

### 演習2: 検索機能

```tsx
function Search() {
  const [query, setQuery] = useState("");
  const { data: results } = useQuery({
    queryKey: ["search", query],
    queryFn: () =>
      fetch(`/api/search?q=${encodeURIComponent(query)}`).then((r) => r.json()),
    enabled: query.length > 0,
  });
  
  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="検索..."
      />
      {results?.map((item: any) => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  );
}
```

**テストケース**:
1. 入力がない場合は検索しない
2. 入力後に結果が表示される
3. デバウンス（ある場合）

---

## まとめ

### MSWのポイント

| 概念 | 説明 |
|------|------|
| `http.get` | GETリクエストのモック |
| `HttpResponse.json` | JSONレスポンス |
| `server.use` | 一時的なハンドラー上書き |
| `setupServer` | テストサーバー |
| `beforeAll/afterAll` | サーバーの起動/停止 |
| `afterEach` | ハンドラーのリセット |

### 次のセッション

Session 4では、**テスト戦略とベストプラクティス**（カバレッジ、TDD、テストパターン）を学びます。
