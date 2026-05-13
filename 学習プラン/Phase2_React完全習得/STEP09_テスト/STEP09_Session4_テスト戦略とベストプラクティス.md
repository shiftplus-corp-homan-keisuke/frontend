# Session 4: テスト戦略とベストプラクティス

## はじめに：テストを「書く」から「戦略」へ

Session 1〜3でテストの書き方を学びました。このセッションでは、**どのようにテストを組み合わせるか**、**どこまでテストすべきか**、**どのように保守するか**といった戦略的な視点を学びます。

---

## 1. テスト戦略の基本

### 何をテストするか

**テストすべきもの**:
- ビジネスロジック（計算、バリデーション、変換）
- ユーザーインタラクション（クリック、入力、送信）
- 副作用（API呼び出し、localStorage、URL変更）
- エッジケース（空配列、エラー、境界値）

**テストしなくて良いもの**:
- 単純なPropsの受け渡し
- ライブラリ内部の動作
- スタイリング（視覚的テストで代替）
- 実装の詳細

### テストピラミッドの実践

```
単体テスト（70%）
├── 純粋関数
├── ユーティリティ
├── カスタムフック
└── 小さなコンポーネント

統合テスト（20%）
├── フォーム送信フロー
├── ページ遷移
└── データ取得 + 表示

E2Eテスト（10%）
├── クリティカルパス
├── 認証フロー
└── 決済フロー
```

---

## 2. テストしやすいコードの書き方

### 依存性の注入

```tsx
// ❌ テストしにくい（直接fetch）
function UserProfile({ userId }: { userId: number }) {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    fetch(`/api/users/${userId}`)
      .then((r) => r.json())
      .then(setUser);
  }, [userId]);
  
  return <div>{user?.name}</div>;
}

// ✅ テストしやすい（依存を注入）
function UserProfile({ userId, fetchUser }: {
  userId: number;
  fetchUser?: (id: number) => Promise<User>;
}) {
  const [user, setUser] = useState(null);
  const fetcher = fetchUser ?? defaultFetchUser;
  
  useEffect(() => {
    fetcher(userId).then(setUser);
  }, [userId, fetcher]);
  
  return <div>{user?.name}</div>;
}
```

### 副作用の分離

```tsx
// ❌ 副作用が混在
function useAuth() {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    // 直接API呼び出し
    fetch("/api/me")
      .then((r) => r.json())
      .then(setUser);
    
    // 直接localStorage操作
    const token = localStorage.getItem("token");
    if (token) {
      // ...
    }
  }, []);
  
  return user;
}

// ✅ 副作用を抽象化
function useAuth(
  authService: AuthService = defaultAuthService
) {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    authService.getCurrentUser().then(setUser);
  }, [authService]);
  
  return user;
}

// テスト用のモックサービス
const mockService = {
  getCurrentUser: vi.fn().mockResolvedValue({ id: 1, name: "Test" }),
};
```

---

## 3. TDD（テスト駆動開発）

### TDDのサイクル

```
1. Red: 失敗するテストを書く
2. Green: 最小限の実装でテストを通す
3. Refactor: コードを改善する
```

### 実践例: Todo追加機能

```tsx
// 1. Red - テストを書く
// TodoList.test.tsx
it("Todoを追加する", async () => {
  const user = userEvent.setup();
  render(<TodoList />);
  
  await user.type(screen.getByPlaceholderText("新しいTodo"), "買い物");
  await user.click(screen.getByRole("button", { name: "追加" }));
  
  expect(screen.getByText("買い物")).toBeInTheDocument();
});

// 2. Green - 最小限の実装
function TodoList() {
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

// 3. Refactor - 改善
// useTodoListフックを抽出、バリデーション追加など
```

### TDDのメリット

- **設計の改善** - テストを先に書くことで使いやすいAPIを設計
- **バグの削減** - 実装前に仕様を明確化
- **自信** - テストが通れば動作が保証される
- **リファクタリングの安全性** - テストがあるから大胆に改善できる

---

## 4. カバレッジ

### 測定方法

```bash
npm run test:coverage
```

```ts
// vitest.config.ts
export default defineConfig({
  test: {
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules/",
        "src/test/",
        "**/*.d.ts",
      ],
    },
  },
});
```

### カバレッジ指標

| 指標 | 説明 | 目標値 |
|------|------|--------|
| Statements | 実行された文の割合 | 80%以上 |
| Branches | 実行された分岐の割合 | 80%以上 |
| Functions | 実行された関数の割合 | 80%以上 |
| Lines | 実行された行の割合 | 80%以上 |

### 注意点

**カバレッジ100% ≠ バグなし**:

```tsx
// テストがあるが、バグがある例
function divide(a: number, b: number): number {
  return a / b; // b=0のテストがない
}

// 100%カバレッジでもb=0でクラッシュ
```

---

## 5. テストパターン集

### パターン1: テスト用のヘルパー

```tsx
// test/utils.tsx
import { render as rtlRender } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

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

export * from "@testing-library/react";
```

### パターン2: データファクトリー

```ts
// test/factories.ts
export function createUser(overrides = {}) {
  return {
    id: 1,
    name: "太郎",
    email: "taro@example.com",
    role: "user",
    createdAt: new Date().toISOString(),
    ...overrides,
  };
}

export function createProduct(overrides = {}) {
  return {
    id: 1,
    name: "商品A",
    price: 1000,
    stock: 10,
    ...overrides,
  };
}

// 使用
const user = createUser({ name: "花子", role: "admin" });
const products = [createProduct(), createProduct({ name: "商品B" })];
```

### パターン3: ページオブジェクトパターン

```ts
// test/pages/LoginPage.ts
export class LoginPage {
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
    return screen.queryByRole("alert");
  }
  
  async login(email: string, password: string) {
    const user = userEvent.setup();
    await user.type(this.emailInput, email);
    await user.type(this.passwordInput, password);
    await user.click(this.submitButton);
  }
}

// 使用
const page = new LoginPage();
await page.login("test@example.com", "password");
expect(page.errorMessage).not.toBeInTheDocument();
```

### パターン4: Arrange-Act-Assertの明確化

```tsx
it("ユーザーを削除する", async () => {
  // Arrange
  const user = userEvent.setup();
  const onDelete = vi.fn();
  render(<UserCard user={mockUser} onDelete={onDelete} />);
  
  // Act
  await user.click(screen.getByRole("button", { name: "削除" }));
  
  // Assert
  expect(onDelete).toHaveBeenCalledWith(mockUser.id);
});
```

---

## 6. テストの保守

### 壊れやすいテスト（避ける）

```tsx
// ❌ クラス名で検索（変更しやすい）
expect(screen.getByText("Submit")).toHaveClass("btn-primary");

// ❌ 内部構造に依存
expect(wrapper.find("div > span > button").length).toBe(1);

// ❌ 正確なテキストに依存（i18n変更で壊れる）
expect(screen.getByText("Welcome to our application!")).toBeInTheDocument();
```

### 堅牢なテスト（推奨）

```tsx
// ✅ ロールで検索
expect(screen.getByRole("button", { name: /送信/i })).toBeInTheDocument();

// ✅ ユーザーの視点
expect(screen.getByRole("heading")).toHaveTextContent(/welcome/i);

// ✅ データテストID（最後の手段）
expect(screen.getByTestId("submit-button")).toBeEnabled();
```

---

## 7. CI/CDでのテスト

### GitHub Actions

```yaml
# .github/workflows/test.yml
name: Test

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "18"
          cache: "npm"
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm run test:run
      
      - name: Run coverage
        run: npm run test:coverage
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
```

---

## 8. 実践演習: テスト戦略の設計

### シナリオ: ECサイトのカート機能

**機能**:
1. 商品をカートに追加
2. 数量を変更
3. カートから削除
4. 合計金額を計算
5. クーポン適用
6. 在庫チェック

### 課題

以下のテスト戦略を設計してください:

1. **どのレイヤーで何をテストするか**
   - ユーティリティ関数
   - カスタムフック
   - コンポーネント
   - ページ

2. **必要なテストケースの一覧**
   - 正常系
   - 異常系
   - エッジケース

3. **MSWでモックすべきAPI**
   - どのエンドポイント
   - どのようなレスポンス

4. **実際にテストを書く**
   - `useCart`フックのテスト
   - `CartItem`コンポーネントのテスト
   - `CartPage`の統合テスト

### ヒント

```tsx
// useCartのテスト戦略
describe("useCart", () => {
  describe("addItem", () => {
    it("商品を追加");
    it("同じ商品を追加すると数量増加");
    it("在庫超過でエラー");
  });
  
  describe("removeItem", () => {
    it("商品を削除");
    it("存在しないIDは無視");
  });
  
  describe("total", () => {
    it("空カートは0");
    it("複数商品の合計");
    it("クーポン適用後の計算");
  });
});
```

---

## まとめ

### テスト戦略のチェックリスト

- [ ] テストピラミッドに従っている
- [ ] ビジネスロジックは単体テストでカバー
- [ ] ユーザー操作は統合テストでカバー
- [ ] クリティカルパスはE2Eテストでカバー
- [ ] カバレッジ80%以上
- [ ] テストは高速（1秒以内）
- [ ] CIで自動実行
- [ ] 壊れにくいクエリを使用

### 次のステップ

テストスキルは実践で磨きます。ポートフォリオプロジェクトを作りながら、**テストファースト**で開発することを習慣にしましょう。
