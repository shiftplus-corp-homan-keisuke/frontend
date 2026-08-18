# Session 4: テスト戦略とベストプラクティス

## はじめに：テストを「書く」から「戦略」へ

Session 1〜3で「**どうやって**テストを書くか」を学びました。
このセッションは少し視点が変わります。「**何を**テストすべきか」「**どこまで**書くべきか」「**どのように保守するか**」という**戦略**の話です。ここでいう保守とは、あとからテストやコードを直しやすくすることです。

なぜ戦略が必要か。例を考えましょう：

あなたがプロジェクトに参加し、「全部のコンポーネントのあらゆる状態をテストして」と言われたとします。すべての Props の組み合わせ、すべてのクリック、すべてのエラー状態……。数週間で数百のテストを書きました。

しかし、**「何も壊していない変更」でテストが壊れる**ことがあります。CSSを1行直しただけでテストが赤くなるなら、それは「壊れやすいテスト」です。

良いテスト戦略を持つことで：
- **書くべきテスト** と **優先度を下げるテスト** を判断できる
- **壊れにくいテスト** を書ける（些細な変更で赤くならない）
- **プロジェクトが成長しても** テストが負債（あとで直す負担）にならない

このセッションでその感覚を掴みましょう。

---

## 1. 何をテストすべきか — 「優先順位」の原則

時間は有限です。すべてをテストするのは不可能です。どこに注力すべきか整理しましょう。

### 1.1 テストすべきもの

| 種類 | 例 | なぜ重要 |
|------|----|---------|
| **ビジネスロジック**（アプリ固有の計算やルール） | 計算、バリデーション（入力チェック）、データ変換 | 間違えると金銭的損害・不具合につながる |
| **ユーザー操作** | クリック、入力、送信 | ユーザーが実際に使う操作。壊れると機能を使えなくなる |
| **副作用**（APIやブラウザ保存など、外部に影響する処理） | API呼び出し、localStorage、URL変更 | 外部環境への影響。失敗するとデータ消失等につながる |
| **エッジケース**（珍しい入力や状態） | 空配列、巨大データ、エラー時 | 通常では起きないが、起きた時に大きな問題になりやすい |

### 1.2 原則として優先度が低いもの

初心者は「これもテストしなきゃ！」と焦りがちです。しかし、単純なPropsの受け渡し、ライブラリの内部動作、色や余白などの見た目、内部変数名などは、重要なリスクがない限り無理にテストしなくて大丈夫です：

| 種類 | 例 | 基本方針 |
|------|----|------------------|
| **単純なPropsの受け渡し** | `<Wrapper>{children}</Wrapper>` | 追加の処理がない場合。追加の動きがあるならテストする |
| **ライブラリ内部の動作** | React、TanStack Query 内部 | 内部実装はテストしない。ただし自分の設定や使い方はテストする |
| **視覚的なスタイル** | 色、余白、アニメーション | 画面の見た目を比較するテスト（Visual Regression）や目視で確認する。ただし表示・非表示や無効状態などの動きはテストする |
| **実装の詳細** | 内部変数名、外から直接使わないメソッド | リファクタリング（動作を変えずにコードを整理すること）で変わるため、実際に使った時の動きをテストする |

> **重要な思考**: 「このテストは、ユーザーが使う機能の**何を守っているか**？」を常に問いましょう。意味のないテストは、あとで直す負担にしかならないからです。

### 1.3 テストピラミッドを**実践**する

Session 1でピラミッドの概念を学びました。まずは「速いテストを多め、遅いテストを少なめ」と覚えれば十分です。次の図は、テストの種類とおおまかな傾向を示しています：

```
単体テスト（多め）
├── 純粋関数                  ← 最優先。速い・書きやすい・価値高い
├── ユーティリティ             ← 同上
├── カスタムフック             ← 状態管理や処理を切り出す
└── 小さなコンポーネント        ← できるだけ小さい単位で

統合テスト（必要なところに）
├── フォーム送信フロー         ← 入力から送信完了までの確認
├── ページ遷移                 ← URL・状態・コンポーネント連携
└── データ取得 + 表示         ← API → キャッシュ → 描画

E2Eテスト（少数。ブラウザで最初から最後まで確認する）
├── 重要なユーザー操作         ← ログイン、決済など「ここが壊れると困る」流れ
├── 認証フロー
└── 決済フロー
```

**なぜこの傾向か？** 単体テストは「速く・短時間で書けて・壊れにくい」からです。E2Eはブラウザや外部環境の起動が必要になり、1本あたりの実行時間やあとで直す手間が大きくなりやすいです。

逆に **「単体テストを少なくE2Eをたくさん」** にすると、テスト全体の実行時間や失敗時の調査の手間が増え、開発中の負担が大きくなりやすいです。実際の組み合わせは、機能の重要度やチームの運用方法に合わせて決めましょう。数字を暗記する必要はありません。

---

## 2. テストしやすいコードの書き方 — 「設計」の視点

### 2.1 外部の処理を差し替えられる設計（依存性の注入）

テストしやすさは**コードの設計**にも左右されます。ここでは「APIやブラウザ保存などの処理を、テストの時だけ差し替えられるようにする」という考え方を覚えましょう。

#### 悪い例: テストしづらい

```tsx
import { useEffect, useState } from "react";

type User = { id: number; name: string };

export function UserProfile({ userId }: { userId: number }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // コンポーネント内部で直接 fetch を呼んでいる
    // API通信をテスト用の返事に置き換えるなら、MSWなどを使う
    fetch(`/api/users/${userId}`)
      .then((r) => r.json())
      .then(setUser);
  }, [userId]);

  return <div>{user?.name}</div>;
}
```

API通信の部分をそのまま確認するなら、MSWなどでテスト用の返事を用意します。MSWが唯一の方法ではありませんが、本物のAPIに近い形でテストできます。

#### 良い例: テストしやすい

コード全体を覚える必要はありません。ここで見るポイントは、`fetchUser`を外から渡せることです。

```tsx
import { useEffect, useState } from "react";

type User = { id: number; name: string };

async function defaultFetchUser(id: number): Promise<User> {
  const response = await fetch(`/api/users/${id}`);
  if (!response.ok) throw new Error("Failed to fetch user");
  return response.json();
}

export function UserProfile({ userId, fetchUser }: {
  userId: number;
  fetchUser?: (id: number) => Promise<User>;  // ← 外から注入できる
}) {
  const [user, setUser] = useState<User | null>(null);
  const fetcher = fetchUser ?? defaultFetchUser;  // 実際に使う関数を決める

  useEffect(() => {
    fetcher(userId).then(setUser);
  }, [userId, fetcher]);

  return <div>{user?.name}</div>;
}
```

```tsx
// テスト時
import { expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { UserProfile } from "./UserProfile";

it("ユーザー名を表示する", async () => {
  const mockFetchUser = vi.fn().mockResolvedValue({ id: 1, name: "Test" });
  render(<UserProfile userId={1} fetchUser={mockFetchUser} />);

  // 関数を差し替えるだけで、ネットワークを使わずにテストできる
  await waitFor(() => expect(mockFetchUser).toHaveBeenCalledWith(1));
  expect(await screen.findByText("Test")).toBeInTheDocument();
});
```

**依存性の注入**とは、「外部依存（API呼び出しやlocalStorageなど）を関数やサービスの**引数**として外から受け取る」設計です。本番では本物を使い、テストでは偽物を渡します。今は「外から差し替えられる」と理解できれば十分です。

テストのためだけにPropsを増やすのではなく、アプリの役割を分ける方法として自然な形になっているかを確認しましょう。APIとのやり取り自体を確認したい時は、Session 3で学んだMSWを使います。どちらを使うかは「どこまでを一緒に確認したいか」で決めます。

> **今は覚えなくてよいこと**: `useEffect`の依存配列や関数の参照が変わる場合の細かな注意は、まずReactの基本を優先しましょう。実際に再実行の問題が起きた時に見直せば大丈夫です。

### 2.2 発展: 副作用をサービスにまとめる

APIやlocalStorageなどの処理が増えてきたら、それらをサービス（外部処理をまとめた関数やオブジェクト）にまとめる方法があります。少し発展的な内容なので、まずは「副作用を1か所に集めるとテストしやすい」と理解できれば十分です。

```tsx
// ❌ 副作用が混在: APIやlocalStorageの処理が関数内に直接書かれている
import { useEffect, useState } from "react";

function useAuth() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // 直接API呼び出し
    fetch("/api/me").then((r) => r.json()).then(setUser);

    // 直接 localStorage 操作
    const token = localStorage.getItem("token");
    if (token) {
      // ...
    }
  }, []);

  return user;
}
```

これをテストするには、`fetch` と `localStorage` の両方をモックしないといけません。複雑です。

```tsx
// ✅ 副作用を一つの「サービス」にまとめる
import { useEffect, useState } from "react";
import { renderHook, waitFor } from "@testing-library/react";
import { expect, it, vi } from "vitest";

type AuthUser = { id: number; name: string };
type AuthService = {
  getCurrentUser: () => Promise<AuthUser | null>;
};

function useAuth(authService: AuthService = defaultAuthService) {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    authService.getCurrentUser().then(setUser);  // 外部処理を隠した1つの関数
  }, [authService]);

  return user;
}

it("現在のユーザーを取得する", async () => {
  // テスト用のモックサービス（fetchやlocalStorageの処理を隠している）
  const mockService = {
    getCurrentUser: vi.fn().mockResolvedValue({ id: 1, name: "Test" }),
  };

  const { result } = renderHook(() => useAuth(mockService));
  await waitFor(() => expect(result.current).toEqual({ id: 1, name: "Test" }));
});
```

`AuthService` と `defaultAuthService` は本番用のコードで定義する型と実装です。テストでは、同じ形の `mockService` を渡しています。

**ポイント**: 複数の副作用を1つのサービスにまとめ、それを引数で渡すようにします。テストではモックサービスを渡すだけでOKです。

> **初心者の疑問**: そこまで大変なことしないといけないの？
>
> 小さなプロジェクトなら不要かもしれません。しかし、複数の外部処理が1つのコンポーネントに混ざると、急激にテストしづらくなります。外部処理の数に明確な基準はありません。まずは「**テストを書きづらい**」と感じたら、そのコードの設計を見直すサインだと思ってください。

---

## 3. TDD（テスト駆動開発） — 逆の順番で書く

### 3.1 TDDとは何か

通常の開発は「**実装を書いてからテストを書く**」順番です：
```
1. コンポーネントを実装
2. コンポーネントのテストを書く
3. テストを走らせる
```

TDDは逆です。「**テストを先に書く**」：
```
1. テストを書く（実装がないので、最初はテストが失敗する状態にする = Red）
2. テストを通す最小限の実装を書く（Green）
3. コードを改善する（Refactor）
```

この **Red（失敗）→ Green（成功）→ Refactor（動作を変えずにコードを整理）** のサイクルを繰り返すのが TDD です。

### 3.2 なぜ TDD が嬉しいのか

| 通常の順番で起きる問題 | TDD が解決すること |
|------|------|
| 「テストを書こうとしたけど、実装が複雑すぎて難しい」 | テストを**先に**書くので、テストしやすい設計を考えやすい |
| 「実装したけど、何を確認すればいいか忘れた」 | テストが仕様の一部になる。何を確認するかが明確になる |
| 「実装後にテストを書くのは手間」 | 小さな実装とテストを交互に進めやすい |
| 「テストが通っても、ありとあらゆる入力で通るか不安」 | Red（失敗）を確認してからGreen（成功）にすることで、実装がテストの期待どおりに動くことを確認しやすい |

逆に言えば、**実装を先にして後からテストを書く場合は、テストの期待値が本当に仕様どおりかを意識して確認する必要があります**。ただし、後から書いたテストが悪いわけではありません。大切なのは、仕様と期待値を確認することです。

> **TDDの位置づけ**: TDDは、コードが期待どおりに動くかをすぐ確認しながら進める方法です。品質を自動的に保証するものではないので、テストの内容が正しいかも確認します。

### 3.3 実践例: Todo追加機能を TDD で作る

#### ステップ1: Red — 失敗するテストを書く

```tsx
// TodoList.test.tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import { TodoList } from "./TodoList";

describe("TodoList", () => {
  it("Todoを追加すると表示される", async () => {
    const user = userEvent.setup();
    render(<TodoList />);

    // 「追加」をクリックする前に input に打ち込む
    await user.type(screen.getByPlaceholderText("新しいTodo"), "買い物");
    await user.click(screen.getByRole("button", { name: "追加" }));

    // 「買い物」が表示されることを期待
    expect(screen.getByText("買い物")).toBeInTheDocument();
  });
});
```

この時点で `./TodoList` はまだ存在しません。実行すると「importできない」エラーになります。これはテストの準備がまだできていない状態です。Redの状態を確認するには、空の `TodoList` を先に用意し、「買い物」が表示されないためテストが失敗することを確認します。

#### ステップ2: Green — 最小限の実装で通す

```tsx
// TodoList.tsx
import { useState } from "react";

export function TodoList() {
  const [todos, setTodos] = useState<string[]>([]);
  const [input, setInput] = useState("");

  return (
    <div>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="新しいTodo"
      />
      <button onClick={() => {
        setTodos([...todos, input]);
        setInput("");
      }}>追加</button>
      <ul>
        {todos.map((todo, i) => <li key={i}>{todo}</li>)}
      </ul>
    </div>
  );
}
```

これでテストが緑（Green）になります。「**このテストで期待していた動き**」が実現できたと分かります。ただし、空文字や重複、削除など、まだテストしていない動きまで正しいとは限りません。

#### ステップ3: Refactor — 改善

```tsx
// useTodoList というカスタムフックに切り出して見通しを改善
function useTodoList() {
  const [todos, setTodos] = useState<string[]>([]);
  const [input, setInput] = useState("");

  const add = () => {
    setTodos((prev) => [...prev, input]);
    setInput("");
  };

  return { todos, input, setInput, add };
}

// コンポーネントはスッキリ
export function TodoList() {
  const { todos, input, setInput, add } = useTodoList();
  // 実際には、先ほどの input や button などをここに置く
}
```

テストはそのまま通ります。**テストがあるから、確認済みの動きが壊れていないかを確かめながらコードを整理できる**。これがTDDの大きな恩恵です。

### 3.4 初心者が TDD を始める時のコツ

- 最初は **「1機能ごとに小さく」** やる。大きな機能を一気に TDD すると混乱する
- 「**まず1つのテストを書く**」→「**最小限の実装**」のサイクルを1回体験するだけでも価値あり
- 最初から完璧にやろうとしない。「テストを先に」を試すだけで十分

> **初心者のよくある誤解**: 「すべての開発をTDDにしないとダメなの？」
> **現実**: すべてをTDDで進めなくてもOKです。「**テストのしやすさ**」を考えながら実装するだけでも効果があります。状況に応じて、TDDと後からテストを書く方法を使い分けます。

---

## 4. カバレッジ — テストの「通った範囲」を見る

### 4.1 カバレッジとは何か

**カバレッジ**とは、「テストを実行した時に、コードのどれくらいの範囲を通ったか」を表す数字です。

例えば、テストで「通常のログイン」しか確認していない場合、次のような処理は通っていないかもしれません。

- パスワードが間違っている場合
- 入力が空の場合
- APIがエラーを返した場合

カバレッジを見ると、まだテストしていない場所を見つけるヒントになります。Vitestの設定や実行方法は、Session 1で設定した方法に従えば大丈夫です。

### 4.2 初心者が覚えること

| 表示 | ざっくりした意味 |
|------|------------------|
| **Lines** | テストで実行された行の割合 |
| **Branches** | `if` などの分岐で、trueとfalseの両方を確認できた割合 |

最初は、レポートで実行されていない行を見つけて、「これは本当にテストが必要な処理か？」と考えるだけで十分です。

> **大切な注意**: カバレッジ100%でも、テストの期待値が間違っていればバグは残ります。カバレッジは「実行したか」を測るもので、「正しい結果か」までは判断しません。

カバレッジの数値目標はプロジェクトごとに決めます。80%や100%を機械的に目指すのではなく、重要なロジックやエラー処理を確認することを優先しましょう。設定の細かな書き方は、必要になった時にVitestのドキュメントを確認すれば大丈夫です。

---

## 5. テストパターン集 — よく使う「型」を知っておく

ここからは「こういう状況ではこう書く」というパターン集です。全部を今すぐ覚える必要はありません。まずはAAAパターンと、クエリ（画面から要素を探す方法）を優先し、ほかは必要になった時に見返してください。

### 5.1 発展パターン: カスタム render 関数 — 共通設定を1関数にまとめる

TanStack Query を使うプロジェクトでは、毎回 `QueryClientProvider`（子コンポーネントにデータを渡す仕組み）の中に入れるのは面倒です。プロジェクト共通の `render` 関数を作っておくと、テストごとにProviderを書く必要がなくなります。今は「共通の準備を関数にまとめるパターン」とだけ覚えれば十分です：

```tsx
// test/utils.tsx
import type { ReactElement } from "react";
import { render as rtlRender } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// rtlRender = 本物の render 関数。これを wrap したカスタム render を作る
export function render(ui: ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  return rtlRender(
    <QueryClientProvider client={queryClient}>
      {ui}
    </QueryClientProvider>
  );
}

// 本物の全機能を再 export して使えるようにする
export * from "@testing-library/react";
```

この例はTanStack Queryを使うテスト向けです。すべてのテストを無条件に同じProviderの中に入れる必要はありません。プロジェクトで共通して必要なProviderだけを組み合わせます。細かなオプションは、必要になった時に調べれば大丈夫です。

```tsx
// 各テストファイル: 自作 render を import するだけ
import { render, screen } from "../test/utils";
// これだけでいつも Provider 付きで描画される
```

### 5.2 発展パターン: テストデータを作る関数

同じようなテストデータを何度も書くようになったら、基本形を作る関数（ファクトリー）を用意できます。これはテストが増えてから使えばよい発展パターンです：

```ts
type User = {
  id: number;
  name: string;
  role: "user" | "admin";
};

function createUser(overrides: Partial<User> = {}): User {
  return {
    id: 1,
    name: "太郎",
    role: "user",
    ...overrides,
  };
}

const user1 = createUser();
const user2 = createUser({ id: 2, name: "花子", role: "admin" });
```

`createUser()`は基本形を作り、引数を渡した部分だけ上書きします。テストデータが増えた時に、毎回すべての項目を書く手間を減らせます。

### 5.3 パターン3: 操作ヘルパー — 繰り返す操作を関数にまとめる

ログイン画面のテストで、毎回「メール入力→パスワード入力→ボタンクリック」を書くのは面倒です。まずは、単純な関数にまとめるだけで十分です：

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, it } from "vitest";

it("正しい情報でログインできる", async () => {
  const user = userEvent.setup();

  render(<Login />);

  // テストの中で、繰り返す操作を小さな関数にまとめる
  const login = async (email: string, password: string) => {
    await user.type(screen.getByLabelText("メールアドレス"), email);
    await user.type(screen.getByLabelText("パスワード"), password);
    await user.click(screen.getByRole("button", { name: "ログイン" }));
  };

  await login("test@example.com", "password");
  expect(await screen.findByText("ログイン成功")).toBeInTheDocument();
});
```

同じ操作が何度も出てくるようになったら、E2Eで使うPage Objectというクラスに発展させる方法もあります。これは次のSTEP10で必要になった時に学べば大丈夫です。成功メッセージの文言は、実際のアプリの仕様に合わせて変更してください。

### 5.4 パターン4: AAAパターンの明示化

初心者ほど AAA パターン（Arrange-Act-Assert）を**コメントで**明示しておくと良いです：

```tsx
it("ユーザーを削除する", async () => {
  // --- Arrange (準備) ---
  const user = userEvent.setup();
  const onDelete = vi.fn();
  const mockUser = { id: 1, name: "太郎" };
  render(<UserCard user={mockUser} onDelete={onDelete} />);

  // --- Act (実行) ---
  await user.click(screen.getByRole("button", { name: "削除" }));

  // --- Assert (検証) ---
  expect(onDelete).toHaveBeenCalledWith(mockUser.id);
});
```

慣れてくればコメントは不要ですが、初心者のうちはこの区切りを見て分かるようにしておくと、テストの意図が明確になります。

---

## 6. 壊れやすいテストを避ける — 長く価値のあるテストを書く

### 6.1 壊れやすいテストとは

「CSS を1行変えただけでテスト50個が赤くなる」「文言を変えただけで20個が壊れる」……これが**壊れやすいテスト**です。あとで直す負担になります。

```tsx
// ❌ 壊れやすいテストの例

// クラス名で探す — CSS の都合で変わる
expect(screen.getByText("Submit")).toHaveClass("btn-primary");

// 内部構造に依存 — 「divの中のspanの中のbutton」のような構造を調べる
// DOMの構造を変えただけでテストが壊れる

// 文言そのものが仕様でないのに、正確な表示文言へ依存している
expect(screen.getByText("Welcome to our application!")).toBeInTheDocument();
```

### 6.2 壊れにくいテストの書き方

```tsx
// ✅ ロールで探す（ユーザー目線）
expect(screen.getByRole("button", { name: /送信/i })).toBeInTheDocument();

// ✅ 文言の細かな表記に依存しない確認には正規表現で部分一致
expect(screen.getByRole("heading")).toHaveTextContent(/welcome/i);

// ✅ どうしても探せない時だけ data-testid（最後の手段）
expect(screen.getByTestId("submit-button")).toBeEnabled();
```

### 6.3 なぜ「壊れにくく」なるのか — まとめ

| 壊れやすい | 壊れにくい | 理由 |
|-----------|-----------|------|
| クラス名で探す | `getByRole` や `getByLabelText` で探す | CSS は「見た目」の都合で変わりやすい |
| 仕様でない文言への完全一致 | 正規表現 / 部分一致 | 仕様でない文言は改善・i18nで変わりやすい |
| 実装の詳細（内部変数、プライベート） | ユーザーから見える動き | リファクタリングで内部は変えられる |
| DOM階層（`div > span > button`） | `getByRole` や `getByLabelText` で直接。必要なら `data-testid` | 構造はリファクタで変わりやすい |

**核心原則**: 「**ユーザーが見る・操作する方法**」でテストを書けば壊れにくい。内部実装でテストすれば壊れやすい。Session 2 で学んだReact Testing Libraryの考え方と同じです。

ただし、文言自体が仕様なら完全一致でテストして構いません。`data-testid` はユーザーから見えない属性なので、`getByRole`や`getByLabelText`などで探せない要素に限って使う最後の手段です。

---

## 7. 変更時にテストを自動実行する（CI）

ローカルで動かすだけでなく、**GitHub にコードを送った時** に自動でテストが走る仕組みを入れると、バグに早く気づけます。Pull Request（PR）は、変更を確認してもらうための依頼です。

### GitHub Actions の例

今は「PRを作ったら、自動でテストを実行できる」と理解できれば十分です。設定例は次のとおりです。プロジェクトの `.github/workflows/test.yml` に置きます：

```yaml
# .github/workflows/test.yml
name: Test

# push または PR 作成時に実行
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      # 1. リポジトリのコードを取得
      - uses: actions/checkout@v4

      # 2. Node.js をセットアップ（npm のキャッシュを有効化）
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "22"
          cache: "npm"

      # 3. 依存パッケージをインストール
      # npm ci = package-lock.json に基づきクリーンインストール
      # （CI では npm install でなく npm ci が推奨。再現性が高い）
      - name: Install dependencies
        run: npm ci

      # 4. テストを1回だけ実行（監視モードではない）
      - name: Run tests
        run: npm run test:run
```

`npm ci` は `package-lock.json` がコミットされていることが前提です。今はYAMLの細かな書き方を覚える必要はありません。大切なのは、PRのたびにテストを自動実行する考え方です。テストに失敗したPRは取り込まない、というのが基本ルールです。

> **初心者の疑問**: これって最初からやるべき？
>
> 小さな個人プロジェクトでは不要。ただ**チーム開発**に入るなら、導入すると便利です。誰かの変更で壊れた時に、PR上ですぐ分かります。本番にバグを出さないための最後の確認になります。

---

## 8. 実践演習 — テスト戦略を設計してみよう

これまでの道具を使って、**ECサイトのカート機能**を題材に「テスト戦略」を設計してみましょう。ここでは、いきなりコードを書くのではなく、まずテストする場所と期待する動きを整理します。

### 8.1 機能要件

1. 商品をカートに追加
2. 数量を変更
3. カートから削除
4. 合計金額を計算
5. クーポン適用
6. 在庫チェック

### 8.2 課題：以下を設計する

#### 課題1: どの場所・段階で何をテストするか

考え方の例：

| テストする場所・段階 | 何をテストするか | ツール |
|---------|----------------|--------|
| ユーティリティ関数 | 合計金額計算、クーポン適用ロジック | Vitest のみ |
| カスタムフック | useCart（追加・数量変更・削除） | renderHook + Vitest |
| コンポーネント | CartItem 単体、数量ボタン | React Testing Library |
| ページ全体 | カート画面、決済画面の統合 | React Testing Library + MSW |
| E2E | ログイン→カート→決済完了 | Playwright |

**初心者のポイント**: ビジネスロジックは純粋関数、状態管理はカスタムフック、外部通信はサービスに分けると、コンポーネントのテストがシンプルになります。コンポーネントに「重い計算」や外部通信を集中させると、テストの範囲が広がって複雑になります。

#### 課題2: 必要なテストケース一覧

この機能要件だけでは、まだ期待値が決まっていません。テストを書く前に、受け入れ条件（どの状態になれば完成とするか）を決めます。「または」のままでは、テストが成功すべき結果を1つに定められません。

| 先に決めること | 例 |
|---------------|-----|
| 数量のルール | 1以上の整数だけ許可する。0以下はエラー表示にするか、ボタンを無効化するか |
| 在庫超過時の動作 | カートを変更せず、エラーメッセージを表示する |
| クーポンの計算 | 「SAVE10」は10%引き。小数点以下を切り捨てるか、四捨五入するか |
| APIのやり取りの決まり | 送るデータ、成功・失敗を表す番号、返ってくるデータ |

以下は、受け入れ条件を決めた後に作るテストケースの例です。

```
正常系:
- 商品を追加するとカートに表示
- 数量を2に変更
- クーポンコード「SAVE10」で10%オフ
- 合計金額が正しい

異常系:
- 存在しない商品IDは追加できない
- 在庫超過の数量は追加できない
- 無効なクーポンではエラーメッセージが表示される

エッジケース:
- 空のカートの合計は0
- 数量0の扱いは、決めた仕様どおりになる
- 小数点以下のクーポン割引は、決めた丸め規則どおりになる
```

#### 課題3: MSWでテスト用の返事を用意するAPI

| URL（エンドポイント） | リクエスト例 | レスポンス（返事）例 | 何のテストで使う |
|--------------|-------------|-------------|-----------------|
| `GET /api/products` | なし | 商品一覧（200） | 商品一覧画面 |
| `POST /api/cart` | `{ productId, quantity }` | 更新後のカート（200）または在庫エラー | カート追加 |
| `GET /api/coupon/:code` | URLの `:code` | クーポン情報（200）または404 | クーポン適用 |
| `POST /api/checkout` | カート情報 | `{ orderId }`（201） | 決済 |

#### 課題4: 実際にテストを書く

`useCart` フックのテスト戦略を具体化してみましょう：

```tsx
// 擬似コード。実装時は各 it にテスト関数を渡す
describe("useCart", () => {
  // 追加機能
  describe("addItem", () => {
    it("商品を追加するとカートに1個入る");
    it("同じ商品を追加すると数量が増える");  // 既存 +1
    it("在庫を超える数量では追加せず、エラー状態になる");
  });

  // 削除機能
  describe("removeItem", () => {
    it("商品を削除できる");
    it("存在しないIDを渡しても無視される");  // その仕様を採用する場合
  });

  // 合計
  describe("total", () => {
    it("空なら0");
    it("複数商品の合計が正しい");
    it("クーポン適用後の計算が正しい");
  });
});
```

このように「**describe グループごとに何を確認すべきか**」をリスト化すると、テストに必要なことの大部分を整理できます。ただし、期待値やエラー時の状態まで決めて初めて、実際に書けるテストケースになります。いきなりコードを書かず、まず「何を確認するか」を整理する癖をつけましょう。

> **初心者の疑問**: このリストをどうやって作ればいいの？
> **ヒント**: 「**この機能に対して、ユーザーは何を期待するか？**」を考えます。「追加ボタンを押したら商品が増えるはず」「在庫切れは追加できないはず」「クーポンが効かないならエラーメッセージが表示されるはず」。これを箇条書きで書き出すだけです。それがテストケースになります。

---

## まとめ

### テスト戦略のチェックリスト

- [ ] **何をテストするか**: ビジネスロジック、ユーザー操作、副作用、エッジケース
- [ ] **優先度を下げるものを判断する**: 単純なProps受け渡し、ライブラリ内部、視覚スタイル
- [ ] **テストピラミッドを意識している**: 単体を多めにし、比率はリスクとコストに応じて調整する
- [ ] **テストしやすいコード**: 外部の処理を差し替えたり、まとめたりする
- [ ] **ユーザー視点のクエリ**: `getByRole` / `getByLabelText` / `getByText`を優先し、`data-testid`は最後の手段にする
- [ ] **カバレッジを活用している**: 数値だけでなく、重要なロジックと分岐を確認する
- [ ] **テストは高速**: プロジェクトで計測した実行時間の目標を守る
- [ ] **CIで自動実行**: GitHubへの送信 / PR で必ず走る
- [ ] **設計を整理する**: ビジネスロジック、状態管理、副作用を適切に分ける

### このSTEP全体の振り返り

| Session | テーマ | 重要な道具 |
|---------|--------|-----------|
| 1 | テストの基礎 | Vitest, Matcher, AAAパターン, モック |
| 2 | コンポーネントテスト | React Testing Library, userEvent |
| 3 | APIモックと統合 | MSW, server.use, findBy |
| 4 | 戦略とベストプラクティス | TDD, カバレッジ, 設計, CI |

### 次のステップ

テストスキルは**実践で磨く**しかありません。ここからは：
- ポートフォリオプロジェクトを作りながら「**テストを先に書く**」ことを試す
- 新しい関数を書く時は、実装の前にテストを1つ書いてみる
- バグを見つけたら、再現するテストを書いてから直す
- PR を出す時に「テストあり」を習慣にする

最初は遅く感じますが、少しずつ続けると「テストがある安心感」を持てるようになります。次のSTEP10では E2E テスト（Playwright）を学び、テストの学習を次の段階へ進めましょう。
