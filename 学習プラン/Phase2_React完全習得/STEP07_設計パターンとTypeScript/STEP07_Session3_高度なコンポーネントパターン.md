# Session 3: 高度なコンポーネントパターン ― HOC, Render Props, Headless

## はじめに：「機能の横断的な再利用」という課題

Session 2 では、**Container/Presentational**（ロジックとUIの分離）と **Compound Components**（複数パーツの連携）を学びました。

このセッションでは、さらに一歩進んで「ある機能を、全く異なるコンポーネントに横断的に適用したい」という課題に取り組みます。

### 具体例で考える

例えば、以下のような機能を想像してください。

- **ツールチップ**: ホバーしたら表示される説明文。ボタンにもアイコンにもテキストにも付けたい
- **認証ガード**: ログイン済みかチェックして、未ログインならリダイレクト。どのページにも適用したい
- **アニメーション**: フェードイン/アウト。どんなコンポーネントにも付けたい

これらは「1つのコンポーネントの内部ロジック」ではなく、**複数の異なるコンポーネントに共通して追加したい機能**です。

| パターン | 解決方法 | 現在の推奨度 |
|---------|---------|------------|
| **HOC** | コンポーネントを包んで機能を追加 | ⭐⭐ 理解は必要だが新規では非推奨 |
| **Render Props** | 関数を通じてレンダリングを委譲 | ⭐⭐⭐ 特定の場面で有効 |
| **Headless Component** | ロジックだけ提供、UIは完全に自由 | ⭐⭐⭐⭐⭐ 現代のベストプラクティス |

> **重要**: HOC と Render Props は「歴史的に重要」なパターンです。多くの既存コードで使われているため理解は必須ですが、新しいコードでは Headless パターン（カスタムフックベース）が推奨されています。

---

## 1. Higher-Order Component（HOC）

### 1.1 HOCとは何か

HOC は **「コンポーネントを受け取って、新しいコンポーネントを返す関数」** です。

```
HOC = コンポーネントを引数に取る → 強化されたコンポーネントを返す

  InputComponent  →  [ withSomething() ]  →  EnhancedComponent
  (元のコンポーネント)   (HOC関数)             (機能追加されたコンポーネント)
```

日本語で言えば「ラッピング工場」です。元のコンポーネントを包んで、追加機能付きの新しいコンポーネントを生産します。

### 1.2 実例：ローディング表示を追加する HOC

データ取得中に「読み込み中...」を表示する機能を、どのコンポーネントにも追加できるようにします。

```tsx
// withLoading.tsx - HOC の定義

type WithLoadingProps = {
  isLoading: boolean;
};

// T は「元のコンポーネントの Props」を表す
function withLoading<T extends object>(
  WrappedComponent: React.ComponentType<T>
) {
  // 新しいコンポーネントを返す
  return function WithLoadingComponent(props: T & WithLoadingProps) {
    const { isLoading, ...restProps } = props;

    if (isLoading) {
      return (
        <div className="loading-overlay">
          <div className="spinner" />
          <p>読み込み中...</p>
        </div>
      );
    }

    return <WrappedComponent {...(restProps as T)} />;
  };
}
```

**コード解説:**

```tsx
function withLoading<T extends object>(
  WrappedComponent: React.ComponentType<T>
)
```

- `withLoading` は「関数を返す関数」（高階関数）
- `<T extends object>` は Generics（Session 4 で詳しく学びます）。今は「元のコンポーネントの Props の型」と理解してください
- `React.ComponentType<T>` は「Props が T のコンポーネント」を表す型

```tsx
return function WithLoadingComponent(props: T & WithLoadingProps) {
```

- 返されるのは新しいコンポーネント
- Props は `T & WithLoadingProps`（元の Props + `isLoading`）
- `&` は交差型（「AかつBの両方のプロパティを持つ」）

**使い方:**

```tsx
// 普通のコンポーネント
type UserListProps = {
  users: User[];
};

function UserList({ users }: UserListProps) {
  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}

// HOC でラップ → ローディング機能付きのコンポーネントになる
const UserListWithLoading = withLoading(UserList);

// 使う側
function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  return (
    <UserListWithLoading
      isLoading={loading}
      users={users}
    />
  );
}
```

### 1.3 HOC の命名規則

HOC は `with○○` という名前が慣習です。

```
withLoading  → ローディング機能を追加
withAuth     → 認証チェックを追加
withTheme    → テーマ情報を注入
withRouter   → ルーティング情報を注入（React Router v5 以前）
```

### 1.4 HOC の問題点（なぜ現代では非推奨か）

```tsx
// 問題1: ラッパー地獄（Wrapper Hell）
// HOCを重ねると、コンポーネントツリーがネストだらけになる
const EnhancedComponent = withLoading(withAuth(withTheme(withLogger(MyComponent))));

// React DevTools で見ると...
// <WithLoading>
//   <WithAuth>
//     <WithTheme>
//       <WithLogger>
//         <MyComponent />
//       </WithLogger>
//     </WithTheme>
//   </WithAuth>
// </WithLoading>
// → デバッグが困難

// 問題2: Props の衝突
// 複数のHOCが同じ名前の Props を使うと衝突する
withFeatureA(...)  // { data: ... } を注入
withFeatureB(...)  // { data: ... } を注入  ← 衝突！

// 問題3: 型が複雑になる
// TypeScript との相性が悪い
```

> **結論**: HOC は既存コード（特に React Router v5、Redux connect など）で頻出するため理解は必須ですが、新しいコードではカスタムフックを使いましょう。

---

## 2. Render Props パターン

### 2.1 Render Props とは何か

Render Props は **「何をレンダリングするかを、関数として外部から受け取る」** パターンです。

```tsx
// 概念的なイメージ
<DataProvider render={(data) => <MyView data={data} />} />

// または children を関数として使う
<DataProvider>
  {(data) => <MyView data={data} />}
</DataProvider>
```

「データや機能を提供するが、UIは使う側に完全に委ねる」という考え方です。

### 2.2 実例：マウス位置トラッカー

マウスの位置を追跡する機能を、どんなUIでも使えるようにします。

```tsx
// MouseTracker.tsx

type MousePosition = {
  x: number;
  y: number;
};

type MouseTrackerProps = {
  children: (position: MousePosition) => React.ReactNode;
  //        ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  // children が「関数」。位置情報を受け取ってJSXを返す関数。
};

function MouseTracker({ children }: MouseTrackerProps) {
  const [position, setPosition] = useState<MousePosition>({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: globalThis.MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // children を関数として「呼び出す」
  return <>{children(position)}</>;
}
```

**コード解説:**

```tsx
children: (position: MousePosition) => React.ReactNode
```

通常の `children` は `React.ReactNode`（JSX要素）ですが、Render Props パターンでは **関数** です。この関数は `position` を受け取り、JSXを返します。

```tsx
return <>{children(position)}</>;
```

`children` を関数として「呼び出して」います。`position` を引数に渡すことで、使う側がその値を使ってUIを自由に決められます。

**使い方:**

```tsx
// 使い方1: 座標を数値で表示
function CoordinateDisplay() {
  return (
    <MouseTracker>
      {({ x, y }) => (
        <p>マウス位置: ({x}, {y})</p>
      )}
    </MouseTracker>
  );
}

// 使い方2: マウスに追従する猫の画像
function CatChaser() {
  return (
    <MouseTracker>
      {({ x, y }) => (
        <img
          src="/cat.png"
          alt="猫"
          style={{
            position: "fixed",
            left: x - 25,
            top: y - 25,
            width: 50,
            height: 50,
          }}
        />
      )}
    </MouseTracker>
  );
}

// 使い方3: マウスの動きでグラデーションを変化
function GradientBackground() {
  return (
    <MouseTracker>
      {({ x, y }) => {
        const hue = Math.round((x / window.innerWidth) * 360);
        const lightness = Math.round((y / window.innerHeight) * 100);
        return (
          <div
            style={{
              width: "100vw",
              height: "100vh",
              background: `hsl(${hue}, 70%, ${lightness}%)`,
            }}
          />
        );
      }}
    </MouseTracker>
  );
}
```

**同じロジック（マウス追跡）を、全く異なるUIで再利用できる**のがこのパターンの強みです。

### 2.3 Render Props の問題点

```tsx
// 問題: ネストが深くなる（コールバック地獄に似ている）
<MouseTracker>
  {(mouse) => (
    <WindowSize>
      {(size) => (
        <ThemeProvider>
          {(theme) => (
            <MyComponent mouse={mouse} size={size} theme={theme} />
          )}
        </ThemeProvider>
      )}
    </WindowSize>
  )}
</MouseTracker>

// → 読みにくい！インデントが深すぎる
```

---

## 3. Headless Component パターン（現代のベストプラクティス）

### 3.1 HOC/Render Props の問題を解決する

HOC と Render Props の問題点を整理すると:

| パターン | 問題 |
|---------|------|
| HOC | ラッパー地獄、Props衝突、型が複雑 |
| Render Props | ネストが深くなる、読みにくい |

**Headless Component** はこれらを全て解決します。考え方はシンプルで「**ロジックだけをカスタムフックとして提供し、UIは一切持たない**」です。

```
HOC:          機能 → コンポーネント → 強化されたコンポーネント
Render Props: 機能提供コンポーネント → 子関数でUI決定
Headless:     カスタムフック → データ/操作を返す → UIは完全自由
```

### 3.2 実例：マウストラッカーを Headless に書き換える

先ほどの MouseTracker を、カスタムフックに書き換えます。

```tsx
// useMousePosition.ts - Headless（UIを持たない）

function useMousePosition() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: globalThis.MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return position;
}
```

**使い方:**

```tsx
// 使い方1: 座標表示
function CoordinateDisplay() {
  const { x, y } = useMousePosition();
  return <p>マウス位置: ({x}, {y})</p>;
}

// 使い方2: 猫追跡
function CatChaser() {
  const { x, y } = useMousePosition();
  return (
    <img
      src="/cat.png"
      alt="猫"
      style={{ position: "fixed", left: x - 25, top: y - 25 }}
    />
  );
}
```

Render Props 版と比較してみてください:

```tsx
// Render Props - ネストが必要
<MouseTracker>
  {({ x, y }) => <p>({x}, {y})</p>}
</MouseTracker>

// Headless - フラットで読みやすい
function Display() {
  const { x, y } = useMousePosition();
  return <p>({x}, {y})</p>;
}
```

### 3.3 実践的な Headless パターン：useToggle

実務でよく使う「トグル（ON/OFF切替）」を Headless で作ります。

```tsx
// useToggle.ts

type UseToggleReturn = {
  isOn: boolean;
  toggle: () => void;
  setOn: () => void;
  setOff: () => void;
};

function useToggle(initialState = false): UseToggleReturn {
  const [isOn, setIsOn] = useState(initialState);

  const toggle = () => setIsOn((prev) => !prev);
  const setOn = () => setIsOn(true);
  const setOff = () => setIsOn(false);

  return { isOn, toggle, setOn, setOff };
}
```

**この1つのフックが、全く異なるUIで再利用できます:**

```tsx
// 使い方1: ダークモード切替
function ThemeToggle() {
  const { isOn, toggle } = useToggle(false);

  return (
    <button onClick={toggle}>
      {isOn ? "🌙 ダークモード" : "☀️ ライトモード"}
    </button>
  );
}

// 使い方2: サイドバーの開閉
function Sidebar() {
  const { isOn: isOpen, toggle, setOff } = useToggle(true);

  return (
    <>
      <button onClick={toggle}>メニュー</button>
      {isOpen && (
        <nav className="sidebar">
          <button onClick={setOff}>閉じる</button>
          <ul>
            <li>ホーム</li>
            <li>設定</li>
          </ul>
        </nav>
      )}
    </>
  );
}

// 使い方3: パスワード表示切替
function PasswordInput() {
  const { isOn: showPassword, toggle } = useToggle(false);

  return (
    <div className="password-field">
      <input type={showPassword ? "text" : "password"} />
      <button onClick={toggle}>
        {showPassword ? "🙈" : "👁️"}
      </button>
    </div>
  );
}
```

---

## 4. パターンの進化と使い分け

### 4.1 歴史的な流れ

```
2015-2017: HOC が主流（Redux connect, React Router withRouter）
    ↓
2017-2019: Render Props が台頭（React 公式も推奨）
    ↓
2019-現在: Hooks + Headless が標準（カスタムフック）
```

### 4.2 実務での判断基準

| 状況 | 使うべきパターン | 理由 |
|------|---------------|------|
| 新しいコードを書く | **Headless (カスタムフック)** | 最もシンプルで型安全 |
| 既存のクラスコンポーネント | **HOC** | クラスコンポーネントではフックが使えない |
| ライブラリを作る | **Compound + Headless** | 使う側に最大限の柔軟性を提供 |
| 既存コードを読む | **全パターン理解が必要** | 過去のコードは様々なパターンで書かれている |

### 4.3 有名ライブラリでの使用例

| ライブラリ | パターン | 例 |
|-----------|---------|-----|
| React Router v5 | HOC | `withRouter(Component)` |
| React Router v6 | Headless | `useNavigate()`, `useParams()` |
| Redux (旧) | HOC | `connect(mapState, mapDispatch)(Component)` |
| Redux (新) | Headless | `useSelector()`, `useDispatch()` |
| Headless UI | Compound + Headless | `<Menu>`, `<Listbox>` |
| React Hook Form | Headless | `useForm()` |
| TanStack Table | Headless | `useReactTable()` |

> **注目**: 多くのライブラリが HOC から Headless に移行していることが分かります。

---

## 5. 練習問題

### 課題: Headless な useClipboard フックを作る

「テキストをクリップボードにコピーする」機能を Headless パターンで実装してください。

**要件:**
- `copy(text)` でクリップボードにコピーできる
- コピー成功後、一定時間（例: 2秒）`isCopied` が `true` になる
- エラーハンドリングがある

**使い方のイメージ:**

```tsx
function ShareLink({ url }: { url: string }) {
  const { copy, isCopied, error } = useClipboard();

  return (
    <div>
      <input value={url} readOnly />
      <button onClick={() => copy(url)}>
        {isCopied ? "✅ コピー済み!" : "📋 コピー"}
      </button>
      {error && <p className="error">{error}</p>}
    </div>
  );
}
```

**ヒント:**
- `navigator.clipboard.writeText()` でクリップボードに書き込めます
- `setTimeout` でコピー状態をリセットします
- `useEffect` のクリーンアップでタイマーを解除するのを忘れずに

---

## 6. セルフチェック

1. HOC の命名規則は何か？`with○○` の「○○」には何が入るか？
2. HOC が現代のReact開発で非推奨な理由を2つ挙げられるか？
3. Render Props パターンで `children` を「関数」として使うとはどういうことか？
4. Headless パターンが HOC/Render Props より優れている点は何か？
5. 既存コードで `connect(mapState, mapDispatch)(Component)` を見たら、これは何パターンか？

> **次のセッション**: TypeScript の Generics を使って、型安全な汎用コンポーネントを設計する方法を学びます。
