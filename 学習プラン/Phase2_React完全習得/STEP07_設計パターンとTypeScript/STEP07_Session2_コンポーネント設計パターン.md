# Session 2: コンポーネント設計パターン ― 責務を分けて保守性を上げる

## はじめに：なぜ「設計パターン」が必要なのか？

STEP04 でコンポーネントの分割と合成（Composition）を学びました。しかし、「分割する」こと自体は誰でもできます。問題は **「どう分割するか」** です。

### よくある初心者の悩み

> 「コンポーネントを分けたけど、結局どこに何を書けばいいか分からない…」
> 「API通信のコードとUIのコードが混ざって、テストが書きにくい…」
> 「似たようなドロップダウンが3つあって、全部微妙に違う実装になっている…」

これらは「設計パターン」を知らないことが原因です。このセッションでは、React コミュニティで広く使われている **2つの重要な設計パターン** を学びます。

| パターン | 解決する問題 | 一言で言うと |
|---------|------------|------------|
| **Container/Presentational** | ロジックとUIの混在 | 「考える部分」と「見せる部分」を分ける |
| **Compound Components** | 関連コンポーネントの連携 | 複数パーツを「セット」として設計する |

---

## 1. Container/Presentational パターン

### 1.1 問題：全部入りコンポーネント

まず、よくある「全部入り」コンポーネントを見てください。

```tsx
// ❌ 全部入りコンポーネント（ロジックとUIが混在）
function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // APIからデータ取得
  useEffect(() => {
    fetch("/api/users")
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  // フィルタリングロジック
  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // UI
  if (loading) return <p>読み込み中...</p>;
  if (error) return <p>エラー: {error}</p>;

  return (
    <div>
      <input
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="ユーザーを検索..."
      />
      <ul>
        {filteredUsers.map((user) => (
          <li key={user.id}>
            <img src={user.avatar} alt={user.name} />
            <span>{user.name}</span>
            <span>{user.email}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

**このコンポーネントの問題点:**

1. **テストしにくい**: UIのテストをしたいだけなのに、APIモックが必要
2. **再利用できない**: 同じ見た目のリストを別のデータで使いたい時に困る
3. **読みにくい**: 「何をしているか」を理解するのに全体を読む必要がある
4. **変更が怖い**: UIを変えたらロジックが壊れるかもしれない

### 1.2 解決策：「考える部分」と「見せる部分」を分ける

**Container/Presentational パターン**は、コンポーネントを2つの役割に分けます。

```
┌─────────────────────────────────┐
│  Container（考える部分）          │
│  ・データの取得                   │
│  ・状態の管理                    │
│  ・ビジネスロジック               │
│  ・「何のデータを見せるか」を決める  │
│                                 │
│  ┌───────────────────────────┐  │
│  │  Presentational（見せる部分）│  │
│  │  ・HTMLの構造              │  │
│  │  ・CSSのスタイリング        │  │
│  │  ・ユーザーの操作を受け取る  │  │
│  │  ・「データをどう見せるか」   │  │
│  └───────────────────────────┘  │
└─────────────────────────────────┘
```

### 1.3 実装：分離してみる

**ステップ1: Presentational コンポーネント（見た目だけ担当）**

```tsx
// UserListView.tsx - 見せる部分
// データをどう「表示するか」だけに集中する

type UserListViewProps = {
  users: User[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
};

function UserListView({ users, searchQuery, onSearchChange }: UserListViewProps) {
  return (
    <div>
      <input
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="ユーザーを検索..."
      />
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            <img src={user.avatar} alt={user.name} />
            <span>{user.name}</span>
            <span>{user.email}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

**このコンポーネントの特徴を見てください:**

- `useState` がない
- `useEffect` がない
- `fetch` がない
- **Props を受け取って、表示するだけ**

これは「純粋な表示コンポーネント」です。同じデータ構造であれば、どんな場面でも再利用できます。

**ステップ2: Container コンポーネント（ロジック担当）**

```tsx
// UserListContainer.tsx - 考える部分
// データの取得・加工に集中する

function UserListContainer() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetch("/api/users")
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  // フィルタリングロジック
  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ローディング・エラーの判断もContainerの責務
  if (loading) return <p>読み込み中...</p>;
  if (error) return <p>エラー: {error}</p>;

  // Presentational にデータを渡す
  return (
    <UserListView
      users={filteredUsers}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
    />
  );
}
```

### 1.4 分離の効果を実感する

**効果1: テストが簡単になる**

```tsx
// Presentational のテスト - APIモック不要！
test("ユーザー一覧が表示される", () => {
  const mockUsers = [
    { id: 1, name: "太郎", email: "taro@test.com", avatar: "/img.png" },
  ];

  render(
    <UserListView
      users={mockUsers}
      searchQuery=""
      onSearchChange={() => {}}
    />
  );

  expect(screen.getByText("太郎")).toBeInTheDocument();
});
```

**効果2: 再利用できる**

```tsx
// 同じ見た目で「管理者一覧」も作れる！
function AdminListContainer() {
  // 管理者だけを取得するロジック
  const [admins, setAdmins] = useState<User[]>([]);
  // ... 省略

  return (
    <UserListView  // ← 同じ Presentational を再利用！
      users={admins}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
    />
  );
}
```

### 1.5 現代的なアプローチ：カスタムフックとの組み合わせ

STEP05 で学んだカスタムフックを使うと、Container をさらにシンプルにできます。

```tsx
// useUsers.ts - ロジックをカスタムフックに抽出
function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/users")
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { users, loading, error };
}

// useSearch.ts - 検索ロジックをカスタムフックに
function useSearch<T>(items: T[], searchFn: (item: T, query: string) => boolean) {
  const [query, setQuery] = useState("");

  const filtered = items.filter((item) => searchFn(item, query));

  return { query, setQuery, filtered };
}
```

```tsx
// UserList.tsx - カスタムフックを使った簡潔なコンテナ
function UserList() {
  const { users, loading, error } = useUsers();
  const { query, setQuery, filtered } = useSearch(
    users,
    (user, q) => user.name.toLowerCase().includes(q.toLowerCase())
  );

  if (loading) return <p>読み込み中...</p>;
  if (error) return <p>エラー: {error}</p>;

  return (
    <UserListView
      users={filtered}
      searchQuery={query}
      onSearchChange={setQuery}
    />
  );
}
```

> **現代のベストプラクティス**: 「Container コンポーネント」を作る代わりに、「カスタムフック + Presentational コンポーネント」の組み合わせが主流です。ロジックをカスタムフックに、UIを Presentational コンポーネントに分けるという考え方は同じです。

---

## 2. Compound Components パターン

### 2.1 問題：Props地獄

次に、別の問題を見てみましょう。タブUIを作りたいとします。

```tsx
// ❌ Props が多すぎる（Props地獄）
<Tabs
  tabs={["概要", "スペック", "レビュー"]}
  contents={[<Overview />, <Specs />, <Reviews />]}
  activeIndex={0}
  onTabChange={handleTabChange}
  tabStyle="underline"
  contentPadding={16}
  showBorder={true}
/>
```

この設計の問題:

- Props が多すぎて読みにくい
- `tabs` と `contents` の順番を合わせる必要がある（ずれるとバグ）
- レイアウトの柔軟性がない（タブとコンテンツの間に何か入れたいとき困る）

### 2.2 理想：HTMLのように自然な書き方

こんな風に書けたら理想的ではないですか？

```tsx
// ✅ HTMLのように直感的
<Tabs defaultValue="overview">
  <TabList>
    <Tab value="overview">概要</Tab>
    <Tab value="specs">スペック</Tab>
    <Tab value="reviews">レビュー</Tab>
  </TabList>

  <TabPanels>
    <TabPanel value="overview"><Overview /></TabPanel>
    <TabPanel value="specs"><Specs /></TabPanel>
    <TabPanel value="reviews"><Reviews /></TabPanel>
  </TabPanels>
</Tabs>
```

これが **Compound Components パターン** です。`<select>` と `<option>` のように、複数のコンポーネントが「セット」として連携します。

### 2.3 仕組み：Context で状態を共有する

Compound Components は **Context**（STEP05 Session3 で学びましたね）を使って、親子間で暗黙的に状態を共有します。

```
┌──────────────────────────────┐
│  Tabs (Context Provider)      │
│  activeValue: "overview"      │
│  setActiveValue: (v) => ...   │
│                                │
│  ┌──────────────────────────┐ │
│  │ TabList                  │ │
│  │ ┌─────┐ ┌─────┐ ┌─────┐│ │
│  │ │ Tab │ │ Tab │ │ Tab ││ │
│  │ └─────┘ └─────┘ └─────┘│ │
│  └──────────────────────────┘ │
│                                │
│  ┌──────────────────────────┐ │
│  │ TabPanels                │ │
│  │ ┌────────┐               │ │
│  │ │TabPanel│               │ │
│  │ └────────┘               │ │
│  └──────────────────────────┘ │
└──────────────────────────────┘

Tab が Context の setActiveValue を呼ぶ
TabPanel が Context の activeValue を読む
→ Props のバケツリレーなしで連携できる！
```

### 2.4 実装：Accordion を Compound Components で作る

実際にアコーディオンUI（開閉パネル）を Compound Components で作ってみましょう。

**完成イメージ:**

```tsx
<Accordion>
  <AccordionItem value="faq-1">
    <AccordionTrigger>Reactとは何ですか？</AccordionTrigger>
    <AccordionContent>
      ReactはUIを構築するためのJavaScriptライブラリです。
    </AccordionContent>
  </AccordionItem>

  <AccordionItem value="faq-2">
    <AccordionTrigger>TypeScriptは必要ですか？</AccordionTrigger>
    <AccordionContent>
      プロダクション開発では強く推奨されます。
    </AccordionContent>
  </AccordionItem>
</Accordion>
```

**ステップ1: 型と Context を定義する**

```tsx
// accordion.tsx

// --- 型定義 ---
type AccordionContextType = {
  openItems: string[];
  toggle: (value: string) => void;
};

type AccordionItemContextType = {
  value: string;
  isOpen: boolean;
};

// --- Context 作成 ---
const AccordionContext = createContext<AccordionContextType | null>(null);
const AccordionItemContext = createContext<AccordionItemContextType | null>(null);
```

**コード解説:**

```tsx
const AccordionContext = createContext<AccordionContextType | null>(null);
// Context の初期値は null にする。
// これは「Provider の外で使われた場合はエラーにする」ためのパターン。
// （後で useAccordion カスタムフックで null チェックする）
```

なぜ2つの Context があるのか？
- `AccordionContext`: 全体の状態（どのアイテムが開いているか）
- `AccordionItemContext`: 個々のアイテムの情報（自分が開いているか）

**ステップ2: カスタムフック（Context を安全に使うためのラッパー）**

```tsx
// Context を安全に使うカスタムフック
function useAccordion() {
  const context = useContext(AccordionContext);
  if (!context) {
    throw new Error("useAccordion は <Accordion> の中で使ってください");
  }
  return context;
}

function useAccordionItem() {
  const context = useContext(AccordionItemContext);
  if (!context) {
    throw new Error("useAccordionItem は <AccordionItem> の中で使ってください");
  }
  return context;
}
```

**コード解説:**

```tsx
if (!context) {
  throw new Error("useAccordion は <Accordion> の中で使ってください");
}
```

これは **「誤った使い方をしたら、分かりやすいエラーメッセージを出す」** というプロダクション品質のパターンです。Context を null で初期化し、Provider の外で使われたらエラーにします。

**ステップ3: 各コンポーネントを実装**

```tsx
// --- Accordion（親: 全体の状態管理） ---
type AccordionProps = {
  children: React.ReactNode;
  defaultOpen?: string[];  // 最初から開いているアイテム
};

function Accordion({ children, defaultOpen = [] }: AccordionProps) {
  const [openItems, setOpenItems] = useState<string[]>(defaultOpen);

  const toggle = (value: string) => {
    setOpenItems((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)  // 閉じる
        : [...prev, value]                        // 開く
    );
  };

  return (
    <AccordionContext.Provider value={{ openItems, toggle }}>
      <div className="accordion">{children}</div>
    </AccordionContext.Provider>
  );
}
```

```tsx
// --- AccordionItem（個々のアイテム: 自分の状態を提供） ---
type AccordionItemProps = {
  value: string;
  children: React.ReactNode;
};

function AccordionItem({ value, children }: AccordionItemProps) {
  const { openItems } = useAccordion();
  const isOpen = openItems.includes(value);

  return (
    <AccordionItemContext.Provider value={{ value, isOpen }}>
      <div className="accordion-item">{children}</div>
    </AccordionItemContext.Provider>
  );
}
```

```tsx
// --- AccordionTrigger（クリックで開閉するボタン） ---
type AccordionTriggerProps = {
  children: React.ReactNode;
};

function AccordionTrigger({ children }: AccordionTriggerProps) {
  const { toggle } = useAccordion();
  const { value, isOpen } = useAccordionItem();

  return (
    <button
      className="accordion-trigger"
      onClick={() => toggle(value)}
      aria-expanded={isOpen}
    >
      {children}
      <span className={`chevron ${isOpen ? "open" : ""}`}>▼</span>
    </button>
  );
}
```

```tsx
// --- AccordionContent（開閉するコンテンツ） ---
type AccordionContentProps = {
  children: React.ReactNode;
};

function AccordionContent({ children }: AccordionContentProps) {
  const { isOpen } = useAccordionItem();

  if (!isOpen) return null;

  return <div className="accordion-content">{children}</div>;
}
```

### 2.5 なぜこの設計が優れているのか

**柔軟性**: 使う側がレイアウトを自由に決められます。

```tsx
// FAQ ページ - そのまま使う
<Accordion>
  <AccordionItem value="q1">
    <AccordionTrigger>質問1</AccordionTrigger>
    <AccordionContent>回答1</AccordionContent>
  </AccordionItem>
</Accordion>

// 設定画面 - 間にアイコンを挿入
<Accordion defaultOpen={["general"]}>
  <AccordionItem value="general">
    <div className="flex items-center gap-2">
      <SettingsIcon />
      <AccordionTrigger>一般設定</AccordionTrigger>
    </div>
    <AccordionContent>
      <GeneralSettings />
    </AccordionContent>
  </AccordionItem>
</Accordion>
```

1つの Props で全てを制御する設計では、こうした柔軟な使い方はできません。

---

## 3. パターンの使い分けガイド

| 状況 | 推奨パターン | 理由 |
|------|------------|------|
| APIデータ → UI表示 | Container/Presentational | ロジックとUIを分離 |
| タブ、アコーディオン、ドロップダウン | Compound Components | 複数パーツの連携 |
| フォーム入力 | Compound Components | Field, Label, Error の連携 |
| データ一覧表示 | Container/Presentational | データ取得と表示の分離 |
| モーダル、ダイアログ | Compound Components | Trigger, Content, Close の連携 |

> **判断基準**:
> - 「データを取って見せる」なら → Container/Presentational
> - 「複数パーツが連携する」なら → Compound Components
> - 両方に当てはまるなら → 組み合わせて使う

---

## 4. 練習問題

### 課題1: Container/Presentational で商品一覧を作る

以下の「全部入り」コンポーネントを、Container と Presentational に分離してください。

```tsx
type Product = { id: number; name: string; price: number; inStock: boolean };

function ProductPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [showOnlyInStock, setShowOnlyInStock] = useState(false);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then(setProducts);
  }, []);

  const displayed = showOnlyInStock
    ? products.filter((p) => p.inStock)
    : products;

  return (
    <div>
      <label>
        <input
          type="checkbox"
          checked={showOnlyInStock}
          onChange={(e) => setShowOnlyInStock(e.target.checked)}
        />
        在庫ありのみ
      </label>
      <ul>
        {displayed.map((p) => (
          <li key={p.id}>
            {p.name} - ¥{p.price.toLocaleString()}
            {!p.inStock && <span style={{ color: "red" }}> (品切れ)</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

**ヒント**: `ProductListView`（見せる部分）と `ProductListContainer`（考える部分）に分けましょう。

### 課題2: Compound Components でトグルグループを作る

以下のように使えるトグルグループを、Compound Components パターンで実装してください。

```tsx
// このように使えるように作る
<ToggleGroup defaultValue="monthly">
  <ToggleItem value="monthly">月額</ToggleItem>
  <ToggleItem value="yearly">年額</ToggleItem>
</ToggleGroup>
```

**ヒント**: `AccordionContext` と同様に `ToggleGroupContext` を作り、選択中の `value` を共有しましょう。

---

## 5. セルフチェック

1. Container/Presentational パターンでは、データ取得はどちらの責務か？
2. Presentational コンポーネントの特徴を3つ挙げられるか？
3. Compound Components パターンで Context を `null` 初期化する理由は何か？
4. カスタムフックは Container/Presentational パターンにどう関係するか？
5. `<select>` と `<option>` のように使えるコンポーネントを作るとき、どのパターンが適切か？

> **次のセッション**: HOC、Render Props、Headless Component など、さらに高度なコンポーネントパターンを学びます。
