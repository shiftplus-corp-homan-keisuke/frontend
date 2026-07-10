# Session 3: APIモックと統合テスト

## はじめに：APIを呼ぶコンポーネントのテストはムズカしい

Session 2までで、Reactコンポーネントのテストを学びました。ボタンをクリックして、入力して、表示が変わることをテストできます。

しかし、実務のコンポーネントの多くは**APIからデータを取得**します。`useEffect` の中で `fetch("/api/users")` を呼びたり、TanStack Query でデータを取得したり。

ここで問題が起きます：

1. **テストが不安定** — APIサーバーの調子に左右される。サーバーが止まるとテストが赤になる
2. **テストが遅い** — 実際のAPI通信を待つ必要がある
3. **外部依存** — テストを動かすためにバックエンドサーバーが必要
4. **再現性がない** — 本番DBのデータが変わると、テストも結果が変わってしまう

```
あなたのテスト   →   APIサーバー   →   データベース
                  ↑
                  ここが依存している部分
                  （壊れたらテストも壊れる）
```

これを解決するのが **MSW（Mock Service Worker）** です。MSWは「**APIサーバーのフリ**」をしてくれます。

```
あなたのテスト   →   MSW（偽のAPIサーバー）  ← ここで「フリ」をする
                  （実際のサーバーには行かない）
```

### MSWはどうやってAPIを乗っ取るのか

少しテクニカルですが、概念的に理解しておきましょう。

1. ブラウザ/Node.js 内で `fetch("/api/users")` が呼ばれる
2. MSW がそのリクエストを**途中で横取り（intercept）**する
3. 実際のネットワークに通信が行く前に「設定したレスポンス」を返す
4. あなたのコードは「APIからデータが来た」と思い込む

つまり、**本物のサーバーを立てることなく**、API通信をシミュレートできます。これを「モック」と呼びます。

### MSW vs vi.mock — どっちを使う？

Session 1で `vi.mock` を学びました。これも「モック」です。何が違うのでしょうか？

| ツール | 何をモックするか | 特徴 |
|--------|----------------|------|
| `vi.mock` | **関数やモジュール** | コード import を乗っ取る。シンプルだが「ネットワーク層」は見えない |
| MSW | **HTTPリクエスト** | `fetch` レベルで乗っ取る。本物のAPIに近い振る舞いを再現できる |

**どっちを使えばいいの？** コンポーネントが `fetch` や Axios でAPIを叩く場合は **MSWがおすすめ**。「成功」「404」「500」「タイムアウト」など、HTTPの現実的なシチュエーションを忠実に再現できるからです。本物のバックエンドとフロントエンドの「境界」でテストできるため、フロント書き換えに強いです。

---

## 1. MSWのセットアップ — 3つのファイル

MSWを使い始めるには、3つのファイルを準備します。最初は少し手間ですが、一度設定すればずっと使えます。

### ステップ1: インストール

```bash
npm install -D msw
```

### ステップ2: ハンドラーを作る — 「このURLに来たら、このデータを返す」の定義

`src/mocks/handlers.ts` を作成します。ここに「どのURLに、どんなリクエストが来たら、どんなレスポンスを返すか」を設定します：

```ts
// src/mocks/handlers.ts
import { http, HttpResponse } from "msw";

// http = HTTPメソッド別のハンドラーを作る関数（http.get, http.post 等）
// HttpResponse = レスポンスを作る関数（HttpResponse.json がよく使われる）

export const handlers = [
  // --- ハンドラー1: GET /api/users ---
  // 「/api/users に GET リクエストが来たら、ユーザー一覧のJSONを返す」
  http.get("/api/users", () => {
    return HttpResponse.json([
      { id: 1, name: "太郎", email: "taro@example.com" },
      { id: 2, name: "花子", email: "hanako@example.com" },
    ]);
  }),

  // --- ハンドラー2: パスパラメータ ---
  // 「:id」の部分はどんな値でもマッチする
  // params から取り出せる
  http.get("/api/users/:id", ({ params }) => {
    const { id } = params; // params.id = URL の :id 部分
    return HttpResponse.json({
      id: Number(id),
      name: "太郎",
      email: "taro@example.com",
    });
  }),

  // --- ハンドラー3: POST リクエスト ---
  // リクエストボディを受け取る場合は、request から取り出す
  http.post("/api/users", async ({ request }) => {
    // request.json() は非同期。送られてきた JSON を読み取る
    const body = await request.json();
    return HttpResponse.json(
      { id: 3, ...body }, // サーバーが新しいIDを振って返すイメージ
      { status: 201 }     // 201 = Created（新規作成）
    );
  }),

  // --- ハンドラー4: エラーレスポンス ---
  // エラー時のテスト用に、常に500を返すエンドポイント
  http.get("/api/error", () => {
    return HttpResponse.json(
      { message: "サーバーエラー" },
      { status: 500 }
    );
  }),

  // --- ハンドラー5: クエリパラメータ ---
  // URL の ?q=xxx 部分を読み取る
  http.get("/api/search", ({ request }) => {
    // request.url から URL オブジェクトを作る
    const url = new URL(request.url);
    // searchParams で ?q= の部分を取得
    const query = url.searchParams.get("q");

    return HttpResponse.json([
      { id: 1, name: `Result for ${query}` },
    ]);
  }),
];
```

> **初心者のここを理解する**:
>
> - `http.get(URL, handler)` = 「URL に GET が来たら handler を実行」
> - `HttpResponse.json(data)` = 「JSON として data を返す」
> - `{ status: 500 }` などをつければ HTTPステータスコードを変えられる（200 = 成功, 404 = Not Found, 500 = サーバーエラー）
> - 複数ハンドラーを配列にして export する

### ステップ3: サーバーを作る — ハンドラーを束ねる

`src/mocks/server.ts` を作ります。Node.js（テスト環境）用のサーバーを作るのが `setupServer` です：

```ts
// src/mocks/server.ts
import { setupServer } from "msw/node";
import { handlers } from "./handlers";

// setupServer にハンドラーを展開（...handlers = 配列を展開）
// これで「サーバー」オブジェクトができる。起動・停止・一時上書きが可能
export const server = setupServer(...handlers);
```

> **初心者の疑問**: `msw/node` と `msw` の違いは？
>
> - `msw/node` は **Node.js環境用**（テスト実行環境）で使う
> - `msw` （デフォルト）は**ブラウザ環境用**（開発時のデバッグモックなど）
>
> Vitest は Node.js で動くので、`msw/node` を import します。詳しくは後で。最初はそういうもんだと思って進めてOKです。

### ステップ4: テストのセットアップに追加する

`src/test/setup.ts`（Session 1で作ったファイル）に、サーバー起動/停止の処理を追記します：

```ts
// src/test/setup.ts
import "@testing-library/jest-dom";
import { beforeAll, afterAll, afterEach } from "vitest";
import { server } from "../mocks/server";

// beforeAll: すべてのテストが始まる前に1回だけ実行
// server.listen() で MSW を起動して「リクエストを横取り」開始
// onUnhandledRequest: "error" にしておくと、設定していないURLに通信した時に
// テストが失敗する（「まだモックしてないよ！」と教えてくれる安全弁）
beforeAll(() => server.listen({ onUnhandledRequest: "error" }));

// afterEach: 各テストの後に毎回実行
// resetHandlers() で「そのテストの中だけで追加したハンドラー」を削除
// 次のテストに影響しないようにクリーンアップする
afterEach(() => server.resetHandlers());

// afterAll: すべてのテストが終わった後に1回だけ実行
// server.close() で MSW を停止してリソースを解放
afterAll(() => server.close());
```

これで、すべてのテストでMSWが有効になります。各テストの後にはハンドラーがリセットされ、テスト同士が独立します。

### 全体の流れを整理すると

```
テスト開始
  ↓ beforeAll → server.listen() でMSW起動
  ↓
テスト1
  ↓ render(<UserList />)
  ↓ UserList が fetch("/api/users") を呼ぶ
  ↓ MSWが横取り → handlers.ts の「GET /api/users」が発火
  ↓ レスポンスが返る → UserList がデータを表示
  ↓ テスト検証
  ↓ afterEach → server.resetHandlers()
  ↓
テスト2（クリーンな状態で開始）
  ↓ ...
  ↓
全テスト終了
  ↓ afterAll → server.close() でMSW停止
```

---

## 2. MSWを使ったテストを1つ書いてみる

仕組みが分かったところで、具体的なテストを書きましょう。APIからユーザー一覧を取得して表示するコンポーネントです：

```tsx
// UserList.tsx
import { useEffect, useState } from "react";

function UserList() {
  // 3つの状態を管理する
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // コンポーネントが描画された時にAPIを呼ぶ
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

  // 1. ローディング中
  if (loading) return <div>Loading...</div>;

  // 2. エラー時
  if (error) return <div>Error: {error}</div>;

  // 3. データ取得成功
  return (
    <ul>
      {users.map((user: any) => (
        <li key={user.id}>{user.name} ({user.email})</li>
      ))}
    </ul>
  );
}
```

```tsx
// UserList.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { http, HttpResponse } from "msw";
import { server } from "../mocks/server";
import { UserList } from "./UserList";

describe("UserList", () => {
  it("ユーザーリストを表示する", async () => {
    render(<UserList />);

    // 1. 最初はローディング中（同期的に確認できる）
    expect(screen.getByText("Loading...")).toBeInTheDocument();

    // 2. データ取得が完了するまで「非同期で」待つ
    // findByText は要素が現れるまで待つクエリ（getByTextの非同期版）
    // HTTP通信は一瞬で終わらないので、findBy 系を使うのが基本
    const user1 = await screen.findByText("太郎 (taro@example.com)");
    expect(user1).toBeInTheDocument();

    // 3. 取得後は2人とも表示されている
    expect(screen.getByText("花子 (hanako@example.com)")).toBeInTheDocument();
  });

  it("APIエラー時はエラーメッセージを表示する", async () => {
    // server.use() で、このテストの中だけ「別のハンドラー」を追加できる
    // ここでは「/api/users が 500 を返す」状況を作る
    server.use(
      http.get("/api/users", () => {
        return HttpResponse.json({ message: "Server Error" }, { status: 500 });
      })
    );

    render(<UserList />);

    // 「Error:」から始まるテキストが表示されるまで待つ
    // 正規表現 /Error:/ で部分一致で探す
    const error = await screen.findByText(/Error:/);
    expect(error).toBeInTheDocument();
  });

  it("空のリストが返ってきたときはリストが空になる", async () => {
    // このテストだけ「空配列」を返すハンドラーを上書き
    server.use(
      http.get("/api/users", () => {
        return HttpResponse.json([]);
      })
    );

    render(<UserList />);

    // Loading が消えて <ul> が表示されるまで待つ
    await screen.findByRole("list");

    // listitem（<li>）が0個であることを確認
    // queryAllByRole は見つからなくても配列（空）を返す
    expect(screen.queryAllByRole("listitem")).toHaveLength(0);
  });
});
```

### 1つずつ丁寧に復習

このテストで何が起きているか、時系列で追ってみましょう：

1. `render(<UserList />)` が呼ばれる
2. `UserList` が描画される。初期状態は `loading: true`
3. `useEffect` が発火し、`fetch("/api/users")` が呼ばれる
4. MSW がこのリクエストを**横取り**する
5. `handlers.ts` の「GET /api/users」ハンドラーが実行され、JSONが返される
6. `UserList` がデータを受け取り、`setUsers(data)` `setLoading(false)` を呼ぶ
7. 再描画され、`<ul>` が画面に現れる
8. `await screen.findByText("太郎...")` が要素を検出して返す

重要なのは **ステップ4の「横取り」** です。MSWのおかげで実際のサーバー通信は発生せず、瞬時に固定データが返ります。

### 一時的なハンドラー上書き — 同じURLで違うテストをする

`server.use()` を使うと、**そのテストの中だけで** 別のハンドラーを追加できます。特定の条件（エラー、空データ、特定IDの404など）をテストしたい時に便利です：

```ts
it("存在しないIDだと404を返す", async () => {
  server.use(
    http.get("/api/users/:id", ({ params }) => {
      const { id } = params;
      if (id === "999") {
        return HttpResponse.json({ message: "Not Found" }, { status: 404 });
      }
      return HttpResponse.json({ id: Number(id), name: "Test" });
    })
  );

  // このテストの中では、id=999 の時だけ 404 が返る
  // ...

  // after が呼ばれて resetHandlers() されるので、他のテストには影響しない
});
```

> **初心者の疑問**: `server.use()` で上書きした後、元のハンドラーは消えちゃうの？
>
> 消えません。**上書きしたハンドラーが優先される**状態になります。元のハンドラー（`handlers.ts` に書いたもの）は生きていて、その上に「このテストだけの上書き」が積まれるイメージ。テストが終わると `afterEach` で `resetHandlers()` が呼ばれて、元の状態に戻ります。

---

## 3. TanStack Query（React Query）+ MSW

現代のReact開発では API取得ライブラリとして **TanStack Query** がよく使われます。ここでは「useQuery でデータ取得するフック」のテストを学びます。少し特殊な準備が必要です。

### なぜ TanStack Query のテストは特別か

TanStack Query は **内部にキャッシュ機構** を持っています。テストを複数回書くと「前のテストのキャッシュ」が残って、期待通り動かないことがあります。

これを防ぐために：
1. 各テストで **新しい QueryClient** を作る
2. **retry を無効化** する（エラー時に再試行するとテストが長くなる）
3. `QueryClientProvider` で包む

```tsx
// hooks/useUsers.ts
import { useQuery } from "@tanstack/react-query";

export function useUsers() {
  return useQuery({
    queryKey: ["users"],   // キャッシュのキー
    queryFn: async () => {  // 取得関数
      const res = await fetch("/api/users");
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
  });
}
```

```tsx
// hooks/useUsers.test.tsx
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { describe, it, expect } from "vitest";
import { http, HttpResponse } from "msw";
import { server } from "../mocks/server";
import { useUsers } from "./useUsers";

// createWrapper = テスト用に QueryClient を準備するヘルパー関数
// renderHook に wrapper として渡すことで、フックが Provider 内で実行される
function createWrapper() {
  // retry: false は「エラー時に再試行しない」設定
  // → テストが速く終わる。エラーを即座に検出したいので
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
  it("ユーザーを取得できる", async () => {
    // renderHook でフックを「仮想コンポーネント内」で実行
    // wrapper: テスト用 Provider で包む
    const { result } = renderHook(() => useUsers(), {
      wrapper: createWrapper(),
    });

    // 1. 最初はローディング中
    expect(result.current.isLoading).toBe(true);

    // 2. データ取得完了を待つ
    // waitFor = 「条件を満たすまで待つ」関数。非同期の状態変化を検知する
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    // 3. 取得したデータを確認
    expect(result.current.data).toEqual([
      { id: 1, name: "太郎", email: "taro@example.com" },
      { id: 2, name: "花子", email: "hanako@example.com" },
    ]);
  });

  it("APIエラー時は isError になる", async () => {
    // このテストだけ 500 エラーを返す
    server.use(
      http.get("/api/users", () => {
        return HttpResponse.json({ message: "Error" }, { status: 500 });
      })
    );

    const { result } = renderHook(() => useUsers(), {
      wrapper: createWrapper(),
    });

    // isError が true になるまで待つ
    await waitFor(() => expect(result.current.isError).toBe(true));
    // error プロパティに Error オブジェクトが入っている
    expect(result.current.error).toBeDefined();
  });
});
```

### 何をしているのか丁寧に

初心者には「`wrapper` って何？」が一番のつまずきポイントでしょう。

TanStack Query の `useQuery` は **`QueryClientProvider` の中でしか使えません**。通常のアプリでは `<App>` を Provider で包みますが、テストでは「テスト用 Provider」を都度用意する必要があります。

```tsx
// wrapper に渡すのは「コンポーネントを Provider で包む」関数
function Wrapper({ children }) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

// renderHook は、フックを「この Wrapper 内で」実行する
// つまり、children の位置にフックが置かれるイメージ
const { result } = renderHook(() => useUsers(), { wrapper: Wrapper });
```

`waitFor` の使い方も押さえておきましょう：

```ts
// waitForの例: 「result.current.isSuccess が true になるまで」待つ
await waitFor(() => expect(result.current.isSuccess).toBe(true));
```

`waitFor` は内部で「条件を満たすまで定期的に再評価」します（間隔を空けて何度も試す）。非同期の状態変化を、ポーリング的に待つのに便利です。

> **初心者の疑問**: `findByXxx` と `waitFor` は何が違うの？
>
> - `findByXxx` = 「**DOM にその要素が現れるまで**」待つ（コンポーネントテスト用）
> - `waitFor` = 「**任意の条件が満たされるまで**」待つ（フックの状態など、DOM 以外にも使える）
>
> コンポーネントのテストでは `findByXxx`、フックのテスト（DOM に描画されない）では `waitFor` を使います。

---

## 4. フォーム送信の統合テスト — 全体の流れを確認

これまで_session 1-3 の断片を組み合わせた「統合テスト」の例を見てみましょう。「フォームに入力 → 送信 → API を叩く → 成功画面を表示」という一連のフローを、1つのテストで確認します。

```tsx
// RegistrationForm.tsx
import { useState } from "react";
import { useForm } from "react-hook-form";

function RegistrationForm() {
  const [success, setSuccess] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = async (data: any) => {
    // API に POST で送信
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (res.ok) setSuccess(true);
  };

  // 登録成功時の画面
  if (success) return <div>登録完了！</div>;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("name", { required: true })} aria-label="名前" />
      <input {...register("email", { required: true })} type="email" aria-label="メール" />
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "送信中..." : "登録"}
      </button>
    </form>
  );
}
```

```tsx
// RegistrationForm.test.tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import { http, HttpResponse } from "msw";
import { server } from "../mocks/server";
import { RegistrationForm } from "./RegistrationForm";

describe("RegistrationForm", () => {
  it("正常に登録できると完了メッセージが表示される", async () => {
    const user = userEvent.setup();

    render(<RegistrationForm />);

    // 1. 入力（aria-label で探す）
    await user.type(screen.getByRole("textbox", { name: /名前/i }), "太郎");
    await user.type(screen.getByRole("textbox", { name: /メール/i }), "taro@example.com");

    // 2. 送信（「登録」ボタンをクリック）
    await user.click(screen.getByRole("button", { name: "登録" }));

    // 3. 成功メッセージが表示されるまで待つ
    // findByText は要素が現れるまで待つ（POST 処理は非同期なので）
    expect(await screen.findByText("登録完了！")).toBeInTheDocument();
  });

  it("未入力で送信するとバリデーションエラー", async () => {
    const user = userEvent.setup();

    render(<RegistrationForm />);

    // 何も入力せずに送信
    await user.click(screen.getByRole("button"));

    // React Hook Form の required で「無効」と判定される
    // toBeInvalid() は :invalid 状態の要素を検証する
    expect(screen.getByRole("textbox", { name: /名前/i })).toBeInvalid();
  });

  it("サーバーエラー時は完了メッセージが表示されない", async () => {
    // このテストだけ 400 を返す（メール重複エラーを想定）
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

    // 完了メッセージが表示されていないことを確認
    // queryByText は見つからなければ null を返す（getByTextだとエラー）
    // 一定時間待ってから確認したいので waitFor を使う
    expect(screen.queryByText("登録完了！")).not.toBeInTheDocument();
  });
});
```

### この統合テストが確認できること

1. **入力 → 送信 → 完了画面** の一連の流れが動くこと（正常系）
2. **未入力 → バリデーションエラー** となること（入力値のチェック）
3. **サーバーエラー時** は完了画面にならないこと（エラー処理）

統合テストは、こうした「複数の機能が連携する」シナリオを1つのテストで確認するのが特徴です。各機能を1つずつテストする単体テストと違い、「**ユーザーが本当にやること**」を再現します。

---

## 5. 実践演習 — 自分で書いてみよう

### 演習1: 商品一覧 + カート追加

以下のコンポーネントのテストを書いてみましょう：

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

**書くべきテストケース**:
1. ローディング中は "Loading..." と表示される
2. データ取得後に商品一覧が表示される
3. 「カートに追加」をクリックすると POST /api/cart が呼ばれる
4. APIエラー時の挙動（実装に応じて）

**必要なMSWハンドラー**:
- `GET /api/products` → 商品一覧を返す
- `POST /api/cart` → 成功レスポンスを返す

### 演習2: 検索機能（入力してから検索）

```tsx
function Search() {
  const [query, setQuery] = useState("");
  const { data: results } = useQuery({
    queryKey: ["search", query],
    queryFn: () =>
      fetch(`/api/search?q=${encodeURIComponent(query)}`).then((r) => r.json()),
    enabled: query.length > 0,  // ← query が空でない時だけ取得
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

**書くべきテストケース**:
1. 入力がない場合は検索結果が何も表示されない
2. 入力後に検索結果が表示される
3. 入力を変えると別の検索結果が表示される

<details>
<summary>回答例（演習1の一部）</summary>

```ts
// src/mocks/handlers.ts に追加
http.get("/api/products", () => {
  return HttpResponse.json([
    { id: 1, name: "商品A", price: 1000 },
    { id: 2, name: "商品B", price: 2000 },
  ]);
}),

http.post("/api/cart", async ({ request }) => {
  const body = await request.json();
  return HttpResponse.json({ success: true, productId: body.productId });
}),
```

```tsx
// ProductList.test.tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ProductList } from "./ProductList";

function renderWithQuery(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
  );
}

describe("ProductList", () => {
  it("ローディング中表示", () => {
    renderWithQuery(<ProductList />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("商品一覧を表示", async () => {
    renderWithQuery(<ProductList />);
    expect(await screen.findByText("商品A")).toBeInTheDocument();
    expect(screen.getByText("商品B")).toBeInTheDocument();
    expect(screen.getByText("1000円")).toBeInTheDocument();
  });

  it("カートに追加をクリック", async () => {
    const user = userEvent.setup();
    renderWithQuery(<ProductList />);

    // 商品が表示されるまで待つ
    const addButton = await screen.findByRole("button", { name: "カートに追加" });

    // クリック
    await user.click(addButton);

    // POST /api/cart が MSW によって正常に処理されることを確認
    // （実装に応じて成功メッセージの確認など）
  });
});
```
</details>

---

## まとめ

### MSWのポイント

| 概念 | 説明 | 初心者の理解 |
|------|------|-------------|
| `http.get(URL, handler)` | GET リクエストのモック | 「このURLにGET来たらこれ返す」の定義 |
| `HttpResponse.json(data)` | JSON レスポンスを生成 | API が返す JSON を作る |
| `setupServer(...handlers)` | テストサーバーを起動 | MSW の本体。ハンドラーを束ねる |
| `server.listen()` | サーバー起動 | テスト開始時に1回呼ぶ |
| `server.use(handler)` | 一時的な上書き | このテストだけ別のレスポンスを返す |
| `server.resetHandlers()` | 上書きをリセット | 各テスト後に呼んでクリーンアップ |
| `server.close()` | サーバー停止 | 全テスト終了時に1回呼ぶ |
| `findByText` | 非同期で要素を探す | API取得後に現れる要素を待つ |
| `waitFor` | 条件を満たすまで待つ | フックの状態変化などを待つ |

### 初心者が次に進む前に確認すること

- [ ] MSWのハンドラーを書ける（`http.get` / `http.post`）
- [ ] `render` したら MSW が API を横取りしてくれる仕組みを理解した
- [ ] `findByText` で非同期的に現れる要素を待てる
- [ ] `server.use()` で一時的にエラーレスポンスを返せる
- [ ] TanStack Query のテストに `QueryClientProvider` が必要な理由を理解した
- [ ] 演習1のテストを自分で書いてみた

### 次のセッション

Session 4では、これまで学んだ道具を「**どう組み合わせるか」「どこまでテストすべきか」「どう保守するか**」という**戦略的視点**を学びます。個別のテストは書けるようになったので、ここからは「プロジェクト全体でテストをどう設計するか」という上位数の話に入ります。