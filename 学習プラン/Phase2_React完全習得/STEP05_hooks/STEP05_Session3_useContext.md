# Session 3: useContext フック

## はじめに：Prop Drilling の問題

STEP04 のセッション1で、「Prop Drilling（プロップのバケツリレー）」の問題に直面しましたね。復習してみましょう。

```jsx
function App() {
  const [user, setUser] = useState({ name: '太郎', theme: 'dark' });
  
  return <Layout user={user} />;
}

function Layout({ user }) {
  // Layout 自身は user を使わないが、子に渡すために受け取る
  return <Header user={user} />;
}

function Header({ user }) {
  // Header も user を使わないが、さらに子に渡す
  return <UserInfo user={user} />;
}

function UserInfo({ user }) {
  // やっとここで使う！
  return <div>こんにちは、{user.name}さん</div>;
}
```

このように、中間のコンポーネント（`Layout`、`Header`）は `user` を全く使わないのに、ただ下に渡すためだけに Props を受け取っています。

### この問題の影響:

- コードが冗長になる
- 中間コンポーネントが不要な Props に依存する
- リファクタリングが困難（Props の追加・削除が大変）

**Context API と useContext** は、この問題を解決するための仕組みです！

---

## 1. Context API とは？

Context API は、コンポーネントツリー全体でデータを共有するための仕組みです。

### 基本的な考え方:

```
App (データを提供)
 ├─ Layout
 │   └─ Header
 │       └─ UserInfo (データを直接受け取る)
 └─ Sidebar
     └─ UserMenu (データを直接受け取る)
```

中間のコンポーネント（`Layout`、`Header`）を経由せずに、必要なコンポーネントだけがデータにアクセスできます。

---

## 2. Context の作成と使用：3ステップ

### Step 1: Context を作成する

```jsx
import { createContext } from 'react';

// Context を作成（デフォルト値は null）
const UserContext = createContext(null);
```

### Step 2: Context でデータを提供する

```jsx
function App() {
  const [user, setUser] = useState({ name: '太郎', theme: 'dark' });
  
  return (
    <UserContext value={user}>
      <Layout />
    </UserContext>
  );
}
```

**ポイント:**
- Context コンポーネントそのもので子コンポーネントをラップ（React 19以降）
- `value` プロパティに共有したいデータを渡す

### Step 3: useContext でデータを取得する

```jsx
import { useContext } from 'react';

function UserInfo() {
  const user = useContext(UserContext);
  
  return <div>こんにちは、{user.name}さん</div>;
}
```

**ポイント:**
- `useContext(UserContext)` で Context の値を取得
- Provider の下にあるどのコンポーネントからでもアクセス可能

---

## 3. 完全な実装例：テーマ切り替え

よくある使用例として、ライト/ダークモードの切り替えを実装してみましょう。

```jsx
import { createContext, useContext, useState } from 'react';

// 1. Context を作成
const ThemeContext = createContext(null);

// 2. Provider コンポーネントを作成
function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };
  
  return (
    <ThemeContext value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext>
  );
}

// 3. 使用例
function App() {
  return (
    <ThemeProvider>
      <Header />
      <MainContent />
    </ThemeProvider>
  );
}

function Header() {
  // 直接 useContext を使う
  const { theme, toggleTheme } = useContext(ThemeContext);
  
  return (
    <header style={{ background: theme === 'light' ? '#fff' : '#333' }}>
      <button onClick={toggleTheme}>
        {theme === 'light' ? '🌙' : '☀️'} テーマ切り替え
      </button>
    </header>
  );
}

function MainContent() {
  // 直接 useContext を使う
  const { theme } = useContext(ThemeContext);
  
  return (
    <main style={{ 
      background: theme === 'light' ? '#f0f0f0' : '#222',
      color: theme === 'light' ? '#000' : '#fff'
    }}>
      <h1>メインコンテンツ</h1>
    </main>
  );
}
```


---

## 4. 実践例：認証情報の管理

ユーザー認証情報をアプリ全体で共有する例:

```jsx
import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  
  const login = (username, password) => {
    // 実際にはAPIを呼び出す
    setUser({ name: username, role: 'user' });
  };
  
  const logout = () => {
    setUser(null);
  };
  
  return (
    <AuthContext value={{ user, login, logout }}>
      {children}
    </AuthContext>
  );
}

// 使用例
function App() {
  return (
    <AuthProvider>
      <NavBar />
      <Dashboard />
    </AuthProvider>
  );
}

function NavBar() {
  const { user, logout } = useContext(AuthContext);
  
  return (
    <nav>
      {user ? (
        <>
          <span>ようこそ、{user.name}さん</span>
          <button onClick={logout}>ログアウト</button>
        </>
      ) : (
        <LoginButton />
      )}
    </nav>
  );
}

function Dashboard() {
  const { user } = useContext(AuthContext);
  
  if (!user) {
    return <div>ログインしてください</div>;
  }
  
  return <div>ダッシュボード - {user.name}</div>;
}

function LoginButton() {
  const { login } = useContext(AuthContext);
  
  return (
    <button onClick={() => login('太郎', 'password123')}>
      ログイン
    </button>
  );
}
```

---

## 5. 複数の Context を組み合わせる

アプリケーションでは複数の Context を使用することがよくあります。

```jsx
function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <MainApp />
      </ThemeProvider>
    </AuthProvider>
  );
}

function MainApp() {
  const { user } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  
  return <div>アプリケーション</div>;
}
```

**注意:** Provider のネストが深くなりすぎる場合は、以下のようにまとめることもできます:

```jsx
function AppProviders({ children }) {
  return (
    <AuthProvider>
      <ThemeProvider>
        {children}
      </ThemeProvider>
    </AuthProvider>
  );
}

function App() {
  return (
    <AppProviders>
      <MainApp />
    </AppProviders>
  );
}
```

---

## 6. Context 更新時のパフォーマンス考慮

Context の値が変更されると、その Context を使用している**全てのコンポーネント**が再レンダリングされます。

### ❌ パフォーマンスの問題例

```jsx
function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState('light');
  
  // テーマが変わるたびに新しいオブジェクトが作成される
  return (
    <AppContext value={{ user, setUser, theme, setTheme }}>
      {children}
    </AppContext>
  );
}

function UserProfile() {
  const { user } = useContext(AppContext);
  // theme が変わっても user しか使わないのに再レンダリングされる
  return <div>{user.name}</div>;
}
```

### ✅ 解決策1: Context を分割する

```jsx
// ユーザー用とテーマ用で Context を分ける
const UserContext = createContext(null);
const ThemeContext = createContext(null);

function UserProfile() {
  const { user } = useContext(UserContext);
  // これで theme の変更による再レンダリングを回避
  return <div>{user.name}</div>;
}
```

### ✅ 解決策2: useMemo で値をメモ化

```jsx
function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState('light');
  
  const userValue = useMemo(() => ({ user, setUser }), [user]);
  const themeValue = useMemo(() => ({ theme, setTheme }), [theme]);
  
  return (
    <UserContext value={userValue}>
      <ThemeContext value={themeValue}>
        {children}
      </ThemeContext>
    </UserContext>
  );
}
```

---

## 7. Context のベストプラクティス

### ✅ すべきこと

1. **Context を機能ごとに分割する**
   - AuthContext、ThemeContext、LanguageContext など

2. **Provider コンポーネントを分離する**
```jsx
function MyProvider({ children }) {
  // State とロジックをここにまとめる
  return <MyContext value={...}>{children}</MyContext>;
}
```

### ❌ 避けるべきこと

1. **全てのデータを1つの Context に詰め込む**
   - パフォーマンス問題の原因

2. **頻繁に変更される値を Context に入れる**
   - 入力フィールドの値など、ローカル State で十分なものは Context にしない

3. **Props で十分な場合に Context を使う**
   - 2～3階層程度の Props なら Prop Drilling で問題ない

---

## 8. Context を使うべき場面

### ✅ Context が適している

- **テーマ設定**: ライト/ダークモード
- **認証情報**: ログインユーザーの情報
- **言語設定**: 多言語対応
- **グローバルな設定**: アプリケーション全体の設定値

### ❌ Context が適していない

- **頻繁に変更される値**: フォームの入力値、検索クエリなど
- **少数のコンポーネント間の共有**: 親子2～3階層なら Props で十分
- **複雑な State 管理**: その場合は Redux や Zustand などを検討

---

## 9. よくある間違い

### ❌ 間違い: Provider の外で useContext を使用

```jsx
function App() {
  return (
    <>
      <ComponentOutside /> {/* ❌ Provider の外 */}
      <MyContext value={...}>
        <ComponentInside /> {/* ✅ Provider の中 */}
      </MyContext>
    </>
  );
}
```

---

## 10. まとめ

`useContext` は、コンポーネント間でデータを効率的に共有するための強力なツールです。

### 覚えておくべきポイント:

- **Context API の3ステップ**:
  1. `createContext` で Context を作成
  2. `<Context>` コンポーネントでデータを提供 (React 19以降)
  3. `useContext` でデータを取得
- **主な用途**: テーマ、認証、言語設定などグローバルなデータ
- **ベストプラクティス**:
  - Context を機能ごとに分割する
  - パフォーマンスを考慮する（不要な再レンダリングを避ける）
- **注意点**: すべてを Context にしない、Props で十分な場合は Props を使う

次のセッションでは、`useMemo` について学びます。パフォーマンス最適化の重要なテクニックを見ていきましょう！
