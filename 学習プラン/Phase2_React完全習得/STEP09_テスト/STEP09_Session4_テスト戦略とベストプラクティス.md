# Session 4: テスト戦略とベストプラクティス

## はじめに：テストを「書く」から「戦略」へ

Session 1〜3で「**どうやって**テストを書くか」を学びました。
このセッションは少し視点が変わります。「**何を**テストすべきか」「**どこまで**書くべきか」「**どのように保守するか**」という**戦略**の話です。

なぜ戦略が必要か。例を考えましょう：

あなたがプロジェクトに参加し、「全部のコンポーネントのあらゆる状態をテストして」と言われたとします。すべての Props の組み合わせ、すべてのクリック、すべてのエラー状態……。数週間で数百のテストを書きました。

しかし、**あなたのテストの8割は「何も壊さない変更」で壊れました**。CSSを1行直しただけで50個のテストが赤くなります。これは「壊れやすいテスト」と呼ばれる状況です。

良いテスト戦略を持つことで：
- **書くべきテスト** と **書かなくていいテスト** を判断できる
- **壊れにくいテスト** を書ける（些細な変更で赤くならない）
- **プロジェクトが成長しても** テストが負債にならない

このセッションでその感覚を掴みましょう。

---

## 1. 何をテストすべきか — 「優先順位」の原則

時間は有限です。すべてをテストするのは不可能です。どこに注力すべきか整理しましょう。

### 1.1 テストすべきもの

| 種類 | 例 | なぜ重要 |
|------|----|---------|
| **ビジネスロジック** | 計算、バリデーション、データ変換 | 間違えると金銭的損害・不具合につながる |
| **ユーザー操作** | クリック、入力、送信 | ユーザーが実際に使う道。壊れると失われる |
| **副作用** | API呼び出し、localStorage、URL変更 | 外部環境への影響。失敗するとデータ消失等に |
| **エッジケース** | 空配列、巨大データ、エラー時 | 通常では起きないが起きた時に致命的なやつ |

### 1.2 テストしなくてもよいもの

初心者は「これもテストしなきゃ！」と焦りがちです。しかし以下は無理にテストしなくて大丈夫です：

| 種類 | 例 | なぜテストしないか |
|------|----|------------------|
| **単純な Props の受け渡し** | `<Wrapper>{children}</Wrapper>` | 処理がない。React 自体を信用してよい |
| **ライブラリ内部の動作** | React、TanStack Query 内部 | ライブラリの責任範囲。彼らがテストしている |
| **視覚的なスタイル** | 色、余白、アニメーション | 目で見るべき。E2EやVisual Regressionで代替 |
| **実装の詳細** | 内部変数名、privateメソッド | リファクタリングで変わる。テストすると脆い |

> **重要な思考**: 「このテストは、ユーザーに**どういう意味**があるか？」を常に問いましょう。意味のないテストは書かない、メンテナンスの負債にしかならないからです。

### 1.3 テストピラミッドを**実践**する

Session 1でピラミッドの概念を学びました。実務ではこう配分します：

```
単体テスト（70%）
├── 純粋関数                  ← 最優先。速い・書きやすい・価値高い
├── ユーティリティ             ← 同上
├── カスタムフック             ← ロジックをここに押し込む
└── 小さなコンポーネント        ← できるだけ小さい単位で

統合テスト（20%）
├── フォーム送信フロー         ← 入力から送信完了までの確認
├── ページ遷移                 ← URL・状態・コンポーネント連携
└── データ取得 + 表示         ← API → キャッシュ → 描画

E2Eテスト（10%）
├── クリティカルパス           ← ログイン、決済など「ここが壊れると死ぬ」道
├── 認証フロー
└── 決済フロー
```

**なぜこの配分か？** 単体テストほど「速く・書くのが安い・壊れにくい」からです。E2Eは1つ起動するだけで数十秒かかり、メンテが重い。

逆に **「単体テストを少なくE2Eをたくさん」** にすると、テストを1回実行するのに10分かかるようになります。開発体験が悪化します。

---

## 2. テストしやすいコードの書き方 — 「設計」の視点

### 2.1 依存性の注入 — 外部依存を引数で受け取る

テストしやすさは**コードの設計**に依存します。これが一番重要な原則です。

#### 悪い例: テストしづらい

```tsx
function UserProfile({ userId }: { userId: number }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // コンポーネント内部で直接 fetch を呼んでいる
    // テスト時には MSW でモックしないといけない
    fetch(`/api/users/${userId}`)
      .then((r) => r.json())
      .then(setUser);
  }, [userId]);

  return <div>{user?.name}</div>;
}
```

このコードをテストするには MSW が必要です。テストがやや込み入ってきます。

#### 良い例: テストしやすい

```tsx
function UserProfile({ userId, fetchUser }: {
  userId: number;
  fetchUser?: (id: number) => Promise<User>;  // ← 外から注入できる
}) {
  const [user, setUser] = useState(null);
  const fetcher = fetchUser ?? defaultFetchUser;  // 指定なければデフォルト

  useEffect(() => {
    fetcher(userId).then(setUser);
  }, [userId, fetcher]);

  return <div>{user?.name}</div>;
}
```

```tsx
// テスト時
const mockFetchUser = vi.fn().mockResolvedValue({ id: 1, name: "Test" });
render(<UserProfile userId={1} fetchUser={mockFetchUser} />);

// MSW がいらない。関数を差し替えるだけで制御できる
```

**依存性の注入**とは、「外部依存（API呼び出しやDBアクセス）を関数の**引数** として外から受け取る」設計です。本番では本物を使い、テストではモックを渡す。これで柔軟に制御できます。

### 2.2 副作用を抽象化する

```tsx
// ❌ 副作用が混在: API、localStorage が関数内にべた書き
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
function useAuth(authService: AuthService = defaultAuthService) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    authService.getCurrentUser().then(setUser);  // 抽象的な1つの関数
  }, [authService]);

  return user;
}

// テスト用のモックサービス（fetchもlocalStorageも隠蔽）
const mockService = {
  getCurrentUser: vi.fn().mockResolvedValue({ id: 1, name: "Test" }),
};

// テストはスッキリ
const { result } = renderHook(() => useAuth(mockService));
```

**ポイント**: 複数の副作用を1つの「サービスオブジェクト」にまとめ、それを引数で渡すようにします。テストではモックサービスを渡すだけで OK。

> **初心者の疑問**: そこまで大変なことしないといけないの？
>
> 小さなプロジェクトなら不要かもしれません。しかし「外部依存が3つ以上混ざったコンポーネント」は急激にテストしづらくなります。中規模以上ではこの設計が効いてきます。最初は「**テストを書きづらい**」と感じたら、そのコードの設計を見直すサインだと思ってください。

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
1. テストを書く（実装がないから最初は必ず失敗 = Red）
2. テストを通す最小限の実装を書く（Green）
3. コードを改善する（Refactor）
```

この **Red → Green → Refactor** のサイクルを繰り返すのが TDD です。

### 3.2 なぜ TDD が嬉しいのか

| 通常の順番で起きる問題 | TDD が解決すること |
|------|------|
| 「テスト書こうとしたけど、実装が複雑すぎて難しい」 | テストを**先に**書くから、自然とテストしやすい設計になる |
| 「実装したけど、何を確認すればいいか忘れた」 | テストが「仕様」になる。何を確認すべきかが明確になる |
| 「実装後にテストを書くのは手間」 | テストを先に書けば、頭を切り替えずに済む。1つの流れで書ける |
| 「テストが通っても、ありとあらゆる入力で通るか不安」 | Red を見てから Green を書くことで、「**今書いた実装がテストを通した**」ことが確証できる |

逆に言えば、**「実装を先にして、後からテストを書く」時は、「テストが実装を反映しているか」の確証が持ちにくい**です。テストを通すために期待値を書き換えてしまうミスも起きがち。

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

この時点で `./TodoList` はまだ存在しません。実行すると「import できない」エラー、つまり **Red** です。

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

これでテストが緑（Green）になります。「**テストを通した実装**」であることが確証できます。

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
  // ...
}
```

テストはそのまま通ります。**テストがあるからリファクタリングに自信が持てる**。これが TDD の最大の恩恵です。

### 3.4 初心者が TDD を始める時のコツ

- 最初は **「1機能ごとに小さく」** やる。大きな機能を一気に TDD すると混乱する
- 「**まず1つのテストを書く**」→「**最小限の実装**」のサイクルを1回体験するだけでも価値あり
- 最初から完璧にやろうとしない。「テストを先に」を試すだけで十分

> **初心者のよくある誤解**: 「TDD しないとダメなの？」
> **現実**: 100% TDD でなくてもOKです。「**テストのしやすさ**」を考えながら実装する、ただそれだけでも雲泥の差。現実には「状況によって TDD」「状況によって後追い」を混ぜるのが普通。

---

## 4. カバレッジ — 「テストが網羅している割合」を測る

### 4.1 カバレッジとは何か

**カバレッジ**とは、「コードの**どれくらいをテストが実行したか**」の割合です。100% なら「すべてのコードがテストで1回以上実行された」という意味になります。

```bash
# カバレッジを測定しながらテスト実行
npm run test:coverage
```

### 4.2 カバレッジの設定

```ts
// vitest.config.ts
export default defineConfig({
  test: {
    coverage: {
      provider: "v8",                    // v8 が標準的なプロバイダー
      reporter: ["text", "json", "html"], // 結果をどう出力するか
      exclude: [
        "node_modules/",
        "src/test/",      // テスト自身は計測外
        "**/*.d.ts",       // 型定義ファイルは計測外
      ],
    },
  },
});
```

実行後、`coverage/index.html` をブラウザで開くと、ファイル単位でカバレッジが色分けされて表示されます。**緑の行**: 実行された、**赤の行**: 実行されなかった、一目で分かります。

### 4.3 4つの指標

カバレッジには4つの指標があります。初心者は「Lines」だけ気にすればOK、他は参考程度に：

| 指標 | 説明 | 初心者の理解 |
|------|------|-------------|
| **Lines** | 実行された**行**の割合 | 一番直感的。「コードの行のうち、何行動いたか」 |
| **Statements** | 実行された**文**の割合 | Lines と近いが、1行に複数文がある時に違いが出る |
| **Branches** | 実行された**分岐**の割合 | if 文の「true側」「false側」両方通ったか |
| **Functions** | 実行された**関数**の割合 | 「呼ばれた関数」の割合 |

### 4.4 目標値と注意点

- **現実的な目標**: 80% 前後。100% にこだわりすぎると無理なテストを書く羽目になる
- **Branches 80%** は特に重要。分岐を見落とすとバグが残りやすい
- **100% ≠ バグなし**。以下を見てください：

```tsx
// カバレッジ100% でもバグがある例
function divide(a: number, b: number): number {
  return a / b; // b=0 のテストがない → 実行時に Infinity を返すバグ
}

// テスト: expect(divide(10, 2)).toBe(5);  // これだと100%だが b=0 を見逃す
```

カバレッジは「**実行したか**」を測るだけで、「**正しい結果を返すか**」「**すべての入力パターンを試したか**」までは測りません。**カバレッジは品質の必要条件であって十分条件ではありません。**

> **初心者のつまずきポイント**: 「100% 目指した方がいいんじゃないの？」
>
> 割に合いません。最後の数%は「エラー処理のエラー処理」みたいな、ほぼ呼ばれないコードに対する無理なテストになりがち。80-90% が現実的なライン。**重要なロジックを確実にカバーすること**を優先。

---

## 5. テストパターン集 — よく使う「型」を知っておく

ここからは「こういう状況ではこう書く」というパターン集です。新しいプロジェクトに入った時によく見る形です。雰囲気だけ掴んで、必要になった時に見返してください。

### 5.1 パターン1: カスタム render 関数 — 共通設定を1関数にまとめる

TanStack Query を使うプロジェクトでは、毎回 `QueryClientProvider` で包むのは面倒です。プロジェクト共通の `render` 関数を作っておくと、テストごとに Provider を書かなくて済みます：

```tsx
// test/utils.tsx
import { render as rtlRender } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// rtlRender = 本物の render 関数。これを wrap したカスタム render を作る
export function render(ui: React.ReactElement, options = {}) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  return rtlRender(
    <QueryClientProvider client={queryClient}>
      {ui}
    </QueryClientProvider>,
    options
  );
}

// 本物の全機能を再 export して使えるようにする
export * from "@testing-library/react";
```

```tsx
// 各テストファイル: 自作 render を import するだけ
import { render, screen } from "../test/utils";
// これだけでいつも Provider 付きで描画される
```

### 5.2 パターン2: データファクトリー — テストデータを簡単に生成

テストデータを毎回手で書くと冗長です。「**基本形を用意して、必要なところだけ上書き**」するファクトリー関数を用意すると便利：

```ts
// test/factories.ts

// createUser: ユーザーオブジェクトを生成。引数で一部だけ上書き可能
export function createUser(overrides = {}) {
  return {
    id: 1,
    name: "太郎",
    email: "taro@example.com",
    role: "user",
    createdAt: new Date().toISOString(),
    ...overrides,  // 上書き部分を後で展開（後に書いたものが勝つ）
  };
}

// createProduct: 商品オブジェクトを生成
export function createProduct(overrides = {}) {
  return {
    id: 1,
    name: "商品A",
    price: 1000,
    stock: 10,
    ...overrides,
  };
}

// 使用例
const user1 = createUser();                            // デフォルトの太郎
const user2 = createUser({ name: "花子", role: "admin" }); // 名前と権限だけ変える
const products = [
  createProduct(),
  createProduct({ name: "商品B", price: 2000 }),
];
```

利点:
- **短く書ける**。毎回全フィールドを書かなくてよい
- **変更に強い**。User 型にフィールドが増えても、ファクトリーだけ直せば全テスト対応

### 5.3 パターン3: ページオブジェクト — 複雑な画面の操作を1クラスに

ログイン画面のテストで、毎回「email 入力→パスワード入力→ボタンクリック」を繰り返すのは面倒です。1つのクラスにまとめて、テストを簡潔にするパターンです：

```ts
// test/pages/LoginPage.ts
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

export class LoginPage {
  // ゲッター: 各要素にアクセスするショートカット
  get emailInput() {
    return screen.getByLabelText("メールアドレス");
  }

  get passwordInput() {
    return screen.getByLabelText("パスワード");
  }

  get submitButton() {
    return screen.getByRole("button", { name: "ログイン" });
  }

  get errorMessage() {
    // エラーがない時は null を返す（queryBy を使う）
    return screen.queryByRole("alert");
  }

  // 「ログインする」という一連の操作を1メソッドに
  async login(email: string, password: string) {
    const user = userEvent.setup();
    await user.type(this.emailInput, email);
    await user.type(this.passwordInput, password);
    await user.click(this.submitButton);
  }
}
```

```tsx
// テストはスッキリ書ける
it("正しい情報でログインできる", async () => {
  render(<Login />);
  const page = new LoginPage();

  await page.login("test@example.com", "password");
  expect(page.errorMessage).not.toBeInTheDocument();
});

it("パスワード間違いでエラー", async () => {
  render(<Login />);
  const page = new LoginPage();

  await page.login("test@example.com", "wrong");
  expect(page.errorMessage).toBeInTheDocument();
});
```

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

慣れてくればコメントは不要ですが、初心者のうちはこの区切りを見える化しておくと、テストの意図が明確になります。

---

## 6. 壊れやすいテストを避ける — 長く価値のあるテストを書く

### 6.1 壊れやすいテストとは

「CSS を1行変えただけでテスト50個が赤くなる」「文言を変えただけで20個が壊れる」……これが**壊れやすいテスト**です。メンテナンスの負債になります。

```tsx
// ❌ 壊れやすいテストの例

// クラス名で探す — CSS の都合で変わる
expect(screen.getByText("Submit")).toHaveClass("btn-primary");

// 内部構造に依存 — リファクタで即死
expect(wrapper.find("div > span > button").length).toBe(1);

// 正確すぎる文言 — i18n 変更で壊れる
expect(screen.getByText("Welcome to our application!")).toBeInTheDocument();
```

### 6.2 堅牢なテストの書き方

```tsx
// ✅ ロールで探す（ユーザー目線）
expect(screen.getByRole("button", { name: /送信/i })).toBeInTheDocument();

// ✅ 大文字小文字を無視 / 正規表現で部分一致
expect(screen.getByRole("heading")).toHaveTextContent(/welcome/i);

// ✅ どうしても探せない時だけ data-testid（最後の手段）
expect(screen.getByTestId("submit-button")).toBeEnabled();
```

### 6.3 何で「壊れにくく」なるのか — まとめ

| 壊れやすい | 壊れにくい | 理由 |
|-----------|-----------|------|
| クラス名で探す | role やLabelText で探す | CSS は「見た目」の都合で変わりやすい |
| 正確な文言一致 | 正規表現 / 部分一致 | 文言は文言改善・i18n で変わりやすい |
| 実装の詳細（内部変数、プライベート） | ユーザーから見える振る舞い | リファクタリングで内部は変えられる |
| DOM階層（`div > span > button`） | role や testid で直接 | 構造はリファクタで変わりやすい |

**核心原則**: 「**ユーザーが見る・操作する方法**」でテストを書けば壊れにくい。内部実装でテストすれば壊れやすい。Session 2 で学んだ Testing Library の哲学と同じです。

---

## 7. CI/CD でテストを自動実行 — Pull Request ごとに品質をチェック

ローカルで動かすだけでなく、**GitHub に push した時** に自動でテストが走る仕組みを入れると、誰かがバグを混入させた瞬間に気づけます。

### GitHub Actions の例

プロジェクトの `.github/workflows/test.yml` を作成します：

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
      - uses: actions/checkout@v3

      # 2. Node.js をセットアップ（npm のキャッシュを有効化）
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "18"
          cache: "npm"

      # 3. 依存パッケージをインストール
      # npm ci = package-lock.json に基づきクリーンインストール
      # （CI では npm install でなく npm ci が推奨。再現性が高い）
      - name: Install dependencies
        run: npm ci

      # 4. テストを1回実行（監視モードでなく1回勝負）
      - name: Run tests
        run: npm run test:run

      # 5. カバレッジも測定
      - name: Run coverage
        run: npm run test:coverage

      # 6. カバレッジ結果をCodecov に送信（任意、アカウントが必要）
      - name: Upload coverage
        uses: codecov/codecov-action@v3
```

これで、PR を作るたびに自動でテストが走り、結果が PR 上に表示されるようになります。テストが赤の PR はマージしない、というのが基本ルールです。

> **初心者の疑問**: これって最初からやるべき？
>
> 小さな個人プロジェクトでは不要。ただ**チーム開発**に入るなら必須。誰かが変更して壊したら、PR 上で即座に見える化されるので責任の所在が明確になります。本番デプロイ前の最後の砦です。

---

## 8. 実践演習 — テスト戦略を設計してみよう

これまでの道具を総動員して、**ECサイトのカート機能**を題材に「テスト戦略」を設計してみましょう。

### 8.1 機能要件

1. 商品をカートに追加
2. 数量を変更
3. カートから削除
4. 合計金額を計算
5. クーポン適用
6. 在庫チェック

### 8.2 課題：以下を設計する

#### 課題1: どのレイヤーで何をテストするか

考え方の例：

| レイヤー | 何をテストするか | ツール |
|---------|----------------|--------|
| ユーティリティ関数 | 合計金額計算、クーポン適用ロジック | Vitest のみ |
| カスタムフック | useCart（追加・数量変更・削除） | renderHook + Vitest |
| コンポーネント | CartItem 単体、数量ボタン | React Testing Library |
| ページ全体 | カート画面、決済画面の統合 | React Testing Library + MSW |
| E2E | ログイン→カート→決済完了 | Playwright |

**初心者のポイント**: 「**ロジックはフックや純粋関数に押し込む**」と、コンポーネントのテストは「表示さえされればOK」になりシンプルになります。コンポーネントに「重い計算」を書くと、コンポーネントのテストが複雑になります。

#### 課題2: 必要なテストケース一覧

```
正常系:
- 商品を追加するとカートに表示
- 数量を2に変更
- クーポンコード「SAVE10」で10%オフ
- 合計金額が正しい

異常系:
- 存在しない商品IDは追加できない
- 在庫超過の数量は追加できない
- 無効なクーポンはエラー

エッジケース:
- 空のカートの合計は0
- 数量0は追加できない（またはボタン無効化）
- 小数点以下のクーポン割引は丸められるか
```

#### 課題3: MSW でモックすべき API

| エンドポイント | レスポンス | 何のテストで使う |
|--------------|----------|-----------------|
| `GET /api/products` | 商品一覧 | 商品一覧画面 |
| `POST /api/cart` | カート内容 | カート追加 |
| `GET /api/coupon/:code` | クーポン情報 or 404 | クーポン適用 |
| `POST /api/checkout` | 注文ID | 決済 |

#### 課題4: 実際にテストを書く

`useCart` フックのテスト戦略を具体化してみましょう：

```tsx
describe("useCart", () => {
  // 追加機能
  describe("addItem", () => {
    it("商品を追加するとカートに1個入る");
    it("同じ商品を追加すると数量が増える");  // 既存 +1
    it("在庫を超える数量はエラーになる");
  });

  // 削除機能
  describe("removeItem", () => {
    it("商品を削除できる");
    it("存在しないIDを渡しても無視される");  // エラーにならない
  });

  // 合計
  describe("total", () => {
    it("空なら0");
    it("複数商品の合計が正しい");
    it("クーポン適用後の計算が正しい");
  });
});
```

このように「**describe グループごとに何を確認すべきか**」をリスト化するだけでも、テスト設計の8割終わります。いきなりコードを書かず、まず「何を確認するか」を整理する癖をつけましょう。

> **初心者の疑問**: このリストをどうやって作ればいいの？
> **ヒント**: 「**この機能に対して、ユーザーは何を期待するか？**」を考えます。「追加ボタンを押したら商品が増えるはず」「在庫切れは追加できないはず」「クーポンが効かないなら怒られるはず」。これを箇条書きで書き出すだけです。それがテストケースになります。

---

## まとめ

### テスト戦略のチェックリスト

- [ ] **何をテストするか**: ビジネスロジック、ユーザー操作、副作用、エッジケース
- [ ] **何をテストしないか**: Props受け渡し、ライブラリ内部、視覚スタイル
- [ ] **テストピラミッドに従っている**: 単体70% / 統合20% / E2E10%
- [ ] **テストしやすいコード**: 依存性の注入、副作用の抽象化
- [ ] **壊れにくいクエリ**: getByRole / getByLabelText / getByTestId
- [ ] **カバレッジ80%以上**: 過度に100%を追わない
- [ ] **テストは高速**: 単体は1秒以内、全体は数十秒以内
- [ ] **CIで自動実行**: push / PR で必ず走る
- [ ] **設計を整理する**: ロジックはフックや純粋関数に

### このSTEP全体の振り返り

| Session | テーマ | 重要な道具 |
|---------|--------|-----------|
| 1 | テストの基礎 | Vitest, Matcher, AAAパターン, モック |
| 2 | コンポーネントテスト | React Testing Library, userEvent |
| 3 | APIモックと統合 | MSW, server.use, findBy |
| 4 | 戦略とベストプラクティス | TDD, カバレッジ, 設計, CI |

### 次のステップ

テストスキルは**実践で磨く**しかありません。ここからは：
- ポートフォリオプロジェクトを作りながら「**テストファースト**」を習慣にする
- 新しい関数を書く時は、実装の前にテストを1つ書いてみる
- バグを見つけたら、再現するテストを書いてから直す
- PR を出す時に「テストあり」を習慣にする

最初は遅く感じますが、1ヶ月もすれば「テストがある安心感」が手放せなくなります。次のSTEP10では E2E テスト（Playwright）を学び、テストの旅を完成させましょう。