# Session 5: カスタムフック

## はじめに：なぜカスタムフックが必要なのか？

これまで学んできた `useState`、`useEffect`、`useRef`、`useContext`、`useMemo` は、すべて React が提供する**組み込みフック**でした。これらを使うと、状態管理や副作用の処理ができるようになりました。

しかし、実際の開発を進めると、ある問題に直面します:

> 「あれ？このコード、別のコンポーネントでも書いたな…」

例えば、以下のような場面を想像してください:

### 問題: コードの重複

**ページ A: ユーザー一覧を表示**

```jsx
function UserListPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch("/api/users")
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>読み込み中...</p>;
  if (error) return <p>エラー: {error}</p>;
  return (
    <ul>
      {users.map((u) => (
        <li key={u.id}>{u.name}</li>
      ))}
    </ul>
  );
}
```

**ページ B: 商品一覧を表示**

```jsx
function ProductListPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true); // 同じ！
  const [error, setError] = useState(null); // 同じ！

  useEffect(() => {
    setLoading(true); // 同じ！
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => setError(err.message)) // 同じ！
      .finally(() => setLoading(false)); // 同じ！
  }, []);

  if (loading) return <p>読み込み中...</p>; // 同じ！
  if (error) return <p>エラー: {error}</p>; // 同じ！
  return (
    <ul>
      {products.map((p) => (
        <li key={p.id}>{p.name}</li>
      ))}
    </ul>
  );
}
```

URL が違うだけで、**ほとんど同じコード**を書いていますね。これは:

- **保守が大変**: バグ修正時に複数箇所を直す必要がある
- **読みにくい**: 本来の目的（データの表示）がノイズに埋もれる
- **テストしにくい**: 同じロジックを何度もテストする羽目になる

### 解決策: カスタムフック

**カスタムフック**は、こうした「再利用したいロジック」を独立した関数として切り出す仕組みです。

```jsx
// ✅ 共通ロジックを1箇所にまとめる
function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ...ロジックは1回だけ書く
  useEffect(() => {
    setLoading(true);
    fetch(url)
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [url]);

  return { data, loading, error };
}

// ✅ 使う側はシンプルに
function UserListPage() {
  const { data: users, loading, error } = useFetch("/api/users");
  // 表示ロジックに集中できる！
}
```

---

## 1. カスタムフックとは？

### 定義

カスタムフックは、**`use` で始まる名前の関数**で、その中で他のフック（`useState`、`useEffect` など）を使う関数です。

```jsx
// これがカスタムフック！
function useMyCustomLogic() {
  const [value, setValue] = useState(0); // 組み込みフックを使用
  // ... 何かロジック
  return value;
}
```

### なぜ `use` で始める必要があるのか？

React には「フックのルール」があります:

1. フックはコンポーネントのトップレベルでのみ呼び出せる
2. フックは条件分岐やループの中で呼び出せない

`use` で始める命名規則を守ることで、**ESLint**（`eslint-plugin-react-hooks`）がその関数をフックとして認識し、ルール違反（条件分岐内での呼び出しなど）を開発中に警告してくれます。

> **補足:** React 本体は実行時にフックの呼び出し順序を追跡し、問題があればエラーを出しますが、関数名で「これはフック」と判断しているわけではありません。`use` で始める命名規則は、主に ESLint による静的解析のためのルールです。

```jsx
// ❌ useで始まらない → ESLintがフックと認識しない
function getCounter() {
  const [count, setCount] = useState(0); // ルール違反だがESLintが警告してくれない！
}

// ✅ useで始まる → ESLintがフックとして認識・検証してくれる
function useCounter() {
  const [count, setCount] = useState(0); // OK！ルール違反があれば警告される
}
```

### 基本ルールのまとめ

| ルール                   | 説明                                                               |
| ------------------------ | ------------------------------------------------------------------ |
| 命名規則                 | 関数名は必ず `use` で始める（例: `useCounter`, `useFetch`）        |
| 内部でフックを使用       | `useState` や `useEffect` などの組み込みフックを使用できる         |
| 通常の関数として呼び出す | コンポーネント内で普通の関数のように呼び出す                       |
| 状態は共有されない       | 同じカスタムフックを複数回呼び出しても、それぞれ独立した状態を持つ |

---

## 2. 最初のカスタムフック：useCounter

まずは、最もシンプルな例から始めましょう。カウンターのロジックをカスタムフックとして切り出します。

### Before: ロジックがコンポーネントに埋め込まれている

```jsx
function Counter() {
  const [count, setCount] = useState(0);

  const increment = () => setCount((prev) => prev + 1);
  const decrement = () => setCount((prev) => prev - 1);
  const reset = () => setCount(0);

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

このコードの問題点:

- 別のコンポーネントでも同じカウンターロジックが必要になったら、コピペするしかない
- カウンターのロジックと表示が混在している

### After: カスタムフックに切り出す

**Step 1: カスタムフックを作成する**

```jsx
// hooks/useCounter.js
import { useState } from "react";

function useCounter(initialValue = 0) {
  // ① 状態を管理
  const [count, setCount] = useState(initialValue);

  // ② 状態を操作する関数を定義
  const increment = () => setCount((prev) => prev + 1);
  const decrement = () => setCount((prev) => prev - 1);
  const reset = () => setCount(initialValue);

  // ③ 必要なものをオブジェクトとして返す
  return { count, increment, decrement, reset };
}

export default useCounter;
```

**コード解説:**

```jsx
function useCounter(initialValue = 0) {
```

- `use` で始まる名前にする（これが重要！）
- `initialValue = 0` は引数のデフォルト値。呼び出し側が値を渡さなければ 0 になる

```jsx
const [count, setCount] = useState(initialValue);
```

- 通常の `useState` を使う
- カスタムフック内でも組み込みフックは普通に使える

```jsx
return { count, increment, decrement, reset };
```

- 使う側が必要とする値・関数をオブジェクトで返す
- オブジェクトで返すと、使う側は必要なものだけ取り出せる

**Step 2: コンポーネントで使用する**

```jsx
// components/Counter.jsx
import useCounter from "../hooks/useCounter";

function Counter() {
  // カスタムフックを呼び出すだけ！
  const { count, increment, decrement, reset } = useCounter(0);

  // 表示ロジックに集中できる
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
const { count, increment, decrement, reset } = useCounter(0);
```

- オブジェクトの分割代入で、必要なものを取り出す
- `useCounter(0)` の `0` は初期値
- `useCounter(100)` にすれば 100 からスタートする

### 再利用の威力

同じフックを別のコンポーネントでも使えます:

```jsx
function GameScore() {
  const { count: score, increment: addPoint, reset: newGame } = useCounter(0);

  return (
    <div>
      <p>スコア: {score}</p>
      <button onClick={addPoint}>得点！</button>
      <button onClick={newGame}>新しいゲーム</button>
    </div>
  );
}
```

**ポイント:** `count: score` のように、分割代入時に名前を変更できます。これにより、文脈に合った変数名を使えます。

---

## 3. 重要な概念：状態は共有されない

初心者がよく誤解するポイントがあります:

> 「同じカスタムフックを使ったら、状態も共有されるの？」

**答え: いいえ、共有されません。**

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

### なぜ共有されないのか？

カスタムフックは「ロジックの再利用」であって、「状態の共有」ではありません。

`useCounter` を呼び出すたびに、内部で `useState(0)` が実行されます。`useState` は呼び出すたびに**新しい独立した状態**を作成します。

**イメージ:**

```
useCounter() 呼び出し → 新しい useState → 新しい count 変数が生まれる
useCounter() 呼び出し → 新しい useState → また別の count 変数が生まれる
```

### 状態を共有したい場合は？

複数のコンポーネントで同じ状態を共有したい場合は、**Context** を使います（Session 3 で学習済み）。

```jsx
// Context を使えば状態を共有できる
const CounterContext = createContext();

function App() {
  const counter = useCounter(0); // ここで1つだけ作成

  return (
    <CounterContext.Provider value={counter}>
      <ComponentA /> {/* 同じ counter を参照 */}
      <ComponentB /> {/* 同じ counter を参照 */}
    </CounterContext.Provider>
  );
}
```

---

## 4. 実践例 1: useToggle（真偽値の切り替え）

### どんな場面で使う？

- モーダルの開閉（開いている / 閉じている）
- メニューの表示/非表示
- ダークモードの ON/OFF
- チェックボックスの状態管理

### 問題: 毎回同じパターンを書いている

```jsx
// モーダルコンポーネント
const [isOpen, setIsOpen] = useState(false);
const openModal = () => setIsOpen(true);
const closeModal = () => setIsOpen(false);
const toggleModal = () => setIsOpen((prev) => !prev);

// サイドバーコンポーネント
const [isVisible, setIsVisible] = useState(false);
const showSidebar = () => setIsVisible(true);
const hideSidebar = () => setIsVisible(false);
const toggleSidebar = () => setIsVisible((prev) => !prev);

// ダークモード切り替え
const [isDark, setIsDark] = useState(false);
// ... 以下同様
```

毎回同じことを書いていますね。これをカスタムフックにしましょう。

### カスタムフック: useToggle

```jsx
// hooks/useToggle.js
import { useState, useCallback } from "react";

function useToggle(initialValue = false) {
  // ① 真偽値の状態
  const [value, setValue] = useState(initialValue);

  // ② 切り替え関数たち
  // useCallback でメモ化（毎回新しい関数を作らない）
  const toggle = useCallback(() => setValue((prev) => !prev), []);
  const setTrue = useCallback(() => setValue(true), []);
  const setFalse = useCallback(() => setValue(false), []);

  // ③ 状態と関数をまとめて返す
  return { value, toggle, setTrue, setFalse };
}

export default useToggle;
```

**コード解説:**

```jsx
const toggle = useCallback(() => setValue((prev) => !prev), []);
```

- `useCallback` は関数をメモ化するフック
- `prev => !prev` で現在の値を反転（`true` → `false`、`false` → `true`）
- `[]` は依存配列が空 = この関数は一度作ったら変わらない

なぜ `useCallback` を使うのか？

- 毎回新しい関数を作ると、子コンポーネントに渡したときに不要な再レンダリングが起きる可能性がある
- メモ化することで、同じ関数オブジェクトを使い回せる

### 使用例

```jsx
function Modal() {
  // value を isOpen という名前で受け取り、setFalse を close として受け取る
  const { value: isOpen, toggle, setFalse: close } = useToggle(false);

  return (
    <>
      <button onClick={toggle}>モーダルを開く</button>

      {isOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <p>モーダルの内容</p>
            <button onClick={close}>閉じる</button>
          </div>
        </div>
      )}
    </>
  );
}
```

**ポイント:** `{ value: isOpen, setFalse: close }` のように、分割代入で名前を変更できます。これにより、文脈に合った分かりやすい名前を使えます。

---

## 5. 実践例 2: useLocalStorage（ローカルストレージとの同期）

### どんな場面で使う？

- ユーザーの設定を保存（テーマ、言語など）
- フォームの入力内容を一時保存
- ログイン状態の永続化
- 買い物カートの内容を保持

### 問題: localStorage との同期が面倒

ローカルストレージは、ブラウザにデータを保存できる仕組みです。ページを閉じてもデータが残ります。

```jsx
function ThemeSelector() {
  // 初期値をローカルストレージから取得
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("theme");
    return saved ? JSON.parse(saved) : "light";
  });

  // 値が変わるたびにローカルストレージに保存
  useEffect(() => {
    localStorage.setItem("theme", JSON.stringify(theme));
  }, [theme]);

  return (
    <button onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
      現在: {theme}
    </button>
  );
}
```

これを毎回書くのは大変です。カスタムフックにしましょう。

### カスタムフック: useLocalStorage

```jsx
// hooks/useLocalStorage.js
import { useState, useEffect } from "react";

function useLocalStorage(key, initialValue) {
  // =====================================
  // ① 初期値の取得（遅延初期化）
  // =====================================
  const [storedValue, setStoredValue] = useState(() => {
    // サーバーサイドレンダリング対応: window が存在しない場合
    if (typeof window === "undefined") {
      return initialValue;
    }

    try {
      // ローカルストレージから値を取得
      const item = window.localStorage.getItem(key);
      // 値があればパース、なければ初期値を使用
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // パースに失敗した場合は初期値を使用
      console.error("localStorage の読み込みに失敗:", error);
      return initialValue;
    }
  });

  // =====================================
  // ② 値が変わったらローカルストレージに保存
  // =====================================
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error("localStorage への保存に失敗:", error);
    }
  }, [key, storedValue]); // key または storedValue が変わったら実行

  // =====================================
  // ③ useState と同じ形式で返す
  // =====================================
  return [storedValue, setStoredValue];
}

export default useLocalStorage;
```

**コード解説:**

```jsx
const [storedValue, setStoredValue] = useState(() => {
```

- `useState(() => ...)` の形は**遅延初期化**
- 関数を渡すと、初回レンダリング時だけその関数が実行される
- ローカルストレージからの読み込みは「重い処理」なので、初回だけ実行したい

```jsx
if (typeof window === "undefined") {
  return initialValue;
}
```

- Next.js などのサーバーサイドレンダリング環境では、サーバー側で `window` が存在しない
- その場合は初期値をそのまま返す

```jsx
return item ? JSON.parse(item) : initialValue;
```

- ローカルストレージには文字列しか保存できない
- `JSON.parse` で JavaScript のオブジェクトに戻す
- 値がなければ（`null` なら）初期値を使用

```jsx
return [storedValue, setStoredValue];
```

- `useState` と同じ `[値, セッター]` の形式で返す
- これにより、使う側は `useState` と同じ感覚で使える

### 使用例

```jsx
function ThemeSelector() {
  // useState と同じ使い方！
  const [theme, setTheme] = useLocalStorage("theme", "light");

  return (
    <div className={`app ${theme}`}>
      <button onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
        テーマを切り替え（現在: {theme}）
      </button>
    </div>
  );
}
```

**ポイント:**

- `useState` を `useLocalStorage` に置き換えるだけ
- 最初の引数はローカルストレージのキー名
- ページをリロードしても、設定が保持される

---

## 6. 実践例 3: useFetch（データフェッチング）

### どんな場面で使う？

- API からデータを取得する（ユーザー一覧、商品一覧など）
- ローディング状態の管理
- エラーハンドリング

### 問題: 毎回同じパターンを書く

```jsx
function UserList() {
  const [users, setUsers] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch("/api/users")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((data) => setUsers(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>読み込み中...</p>;
  if (error) return <p>エラー: {error}</p>;
  return (
    <ul>
      {users.map((u) => (
        <li key={u.id}>{u.name}</li>
      ))}
    </ul>
  );
}
```

この `loading`, `error`, `fetch`, `try-catch` のパターンは、どの API 呼び出しでも同じです。

### カスタムフック: useFetch

```jsx
// hooks/useFetch.js
import { useState, useEffect } from "react";

function useFetch(url) {
  // =====================================
  // ① 3つの状態を管理
  // =====================================
  const [data, setData] = useState(null); // 取得したデータ
  const [loading, setLoading] = useState(true); // 読み込み中かどうか
  const [error, setError] = useState(null); // エラーメッセージ

  // =====================================
  // ② url が変わるたびにデータを取得
  // =====================================
  useEffect(() => {
    // URL が空の場合は何もしない（条件付きフェッチ）
    if (!url) {
      setLoading(false);
      return;
    }

    // リクエストをキャンセルするための AbortController
    const abortController = new AbortController();

    async function fetchData() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(url, {
          signal: abortController.signal, // キャンセル用のシグナル
        });

        // HTTP エラー（404, 500 など）をチェック
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const json = await response.json();
        setData(json);
      } catch (err) {
        // AbortError（キャンセル）は無視する
        if (err.name !== "AbortError") {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchData();

    // =====================================
    // ③ クリーンアップ: コンポーネントがアンマウントされたらリクエストをキャンセル
    // =====================================
    return () => {
      abortController.abort();
    };
  }, [url]); // url が変わったら再実行

  return { data, loading, error };
}

export default useFetch;
```

**コード解説:**

```jsx
const abortController = new AbortController();
```

- `AbortController` は、fetch リクエストをキャンセルするための Web API
- コンポーネントがアンマウントされた後にデータが返ってきても、状態を更新しようとするとエラーになる
- それを防ぐために、アンマウント時にリクエストをキャンセルする

```jsx
signal: abortController.signal,
```

- fetch に `signal` を渡すことで、`abort()` が呼ばれたときにリクエストがキャンセルされる

```jsx
if (err.name !== "AbortError") {
  setError(err.message);
}
```

- キャンセルによるエラー（`AbortError`）は正常な動作なので、エラーとして扱わない

```jsx
return () => {
  abortController.abort();
};
```

- クリーンアップ関数で `abort()` を呼ぶ
- これにより、URL が変わったときや、コンポーネントがアンマウントされたときにリクエストがキャンセルされる

### 使用例

```jsx
function UserList() {
  const {
    data: users,
    loading,
    error,
  } = useFetch("https://jsonplaceholder.typicode.com/users");

  if (loading) return <p>読み込み中...</p>;
  if (error) return <p>エラー: {error}</p>;

  return (
    <ul>
      {users?.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

### 条件付きフェッチ

URL に `null` を渡すと、フェッチをスキップできます:

```jsx
function SearchResults({ query }) {
  // query が空文字の場合は null を渡して、フェッチをスキップ
  const { data, loading } = useFetch(
    query ? `https://api.example.com/search?q=${query}` : null
  );

  if (!query) return <p>検索キーワードを入力してください</p>;
  if (loading) return <p>検索中...</p>;
  return <ResultsList results={data} />;
}
```

---

## 7. 実践例 4: useWindowSize（ウィンドウサイズの監視）

### どんな場面で使う？

- レスポンシブなレイアウト切り替え
- 画面サイズに応じた表示の調整
- モバイル/デスクトップの判定

### カスタムフック: useWindowSize

```jsx
// hooks/useWindowSize.js
import { useState, useEffect } from "react";

function useWindowSize() {
  // =====================================
  // ① 現在のウィンドウサイズを状態として保持
  // =====================================
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
  });

  // =====================================
  // ② リサイズイベントを監視
  // =====================================
  useEffect(() => {
    // リサイズ時に状態を更新する関数
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    // イベントリスナーを登録
    window.addEventListener("resize", handleResize);

    // クリーンアップ: コンポーネントがアンマウントされたら解除
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []); // 空配列 = マウント時に1回だけ実行

  return windowSize;
}

export default useWindowSize;
```

**コード解説:**

```jsx
width: typeof window !== 'undefined' ? window.innerWidth : 0,
```

- サーバーサイドレンダリング対応
- サーバー側では `window` が存在しないので、0 をデフォルト値にする

```jsx
window.addEventListener("resize", handleResize);
```

- ウィンドウがリサイズされるたびに `handleResize` が呼ばれる
- `handleResize` 内で `setWindowSize` を呼ぶことで、状態が更新され、コンポーネントが再レンダリングされる

```jsx
return () => {
  window.removeEventListener("resize", handleResize);
};
```

- **非常に重要！** イベントリスナーは必ず解除する
- 解除しないと、コンポーネントがなくなってもリスナーが残り続け、メモリリークの原因になる

### 使用例

```jsx
function ResponsiveComponent() {
  const { width } = useWindowSize();

  return (
    <div>
      {width < 768 ? <MobileLayout /> : <DesktopLayout />}
      <p>現在の幅: {width}px</p>
    </div>
  );
}
```

---

## 8. 実践例 5: useDebounce（入力のデバウンス）

### デバウンスとは？

ユーザーが検索ボックスに「apple」と入力すると、1 文字ずつイベントが発火します:

```
a → ap → app → appl → apple
```

これを毎回 API に送信すると、5 回もリクエストが飛んでしまいます。

**デバウンス**は、「最後の入力から一定時間待って、それ以上入力がなければ処理を実行する」というテクニックです。

```
a → (待機) → ap → (待機) → app → (待機) → appl → (待機) → apple → (300ms待機) → API呼び出し！
```

### カスタムフック: useDebounce

```jsx
// hooks/useDebounce.js
import { useState, useEffect } from "react";

function useDebounce(value, delay = 500) {
  // =====================================
  // ① デバウンスされた値を保持
  // =====================================
  const [debouncedValue, setDebouncedValue] = useState(value);

  // =====================================
  // ② 値が変わるたびにタイマーをセット
  // =====================================
  useEffect(() => {
    // delay ミリ秒後に値を更新するタイマーをセット
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // クリーンアップ: 値が変わったら前のタイマーをキャンセル
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;
```

**コード解説:**

```jsx
const timer = setTimeout(() => {
  setDebouncedValue(value);
}, delay);
```

- `delay` ミリ秒後に `debouncedValue` を更新する

```jsx
return () => {
  clearTimeout(timer);
};
```

- **これが鍵！** `value` が変わると、このクリーンアップ関数が先に実行される
- つまり、新しい文字が入力されるたびに、前のタイマーがキャンセルされる
- 入力が止まって `delay` ミリ秒経過したときだけ、タイマーが完了して値が更新される

### 使用例

```jsx
function SearchInput() {
  const [searchTerm, setSearchTerm] = useState("");
  // 300ms デバウンス
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // debouncedSearchTerm を使って API を呼び出す
  const { data } = useFetch(
    debouncedSearchTerm
      ? `https://api.example.com/search?q=${debouncedSearchTerm}`
      : null
  );

  return (
    <div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="検索..."
      />
      {/* searchTerm は即座に更新される（入力欄はスムーズ） */}
      {/* debouncedSearchTerm は 300ms 後に更新される（API 呼び出しは抑制される） */}
    </div>
  );
}
```

**ポイント:**

- `searchTerm`（入力欄の値）は即座に更新 → 入力欄がスムーズに動く
- `debouncedSearchTerm`（API 呼び出しに使う値）は 300ms 後に更新 → 不要なリクエストを削減

---

## 9. カスタムフック設計のベストプラクティス

### 1. 単一責任の原則

一つのフックは**一つの目的**に集中させましょう。

```jsx
// ❌ 悪い例: 複数の責任を持つフック
function useUserAndSettings() {
  const [user, setUser] = useState(null);
  const [settings, setSettings] = useState({});
  // ユーザー取得のロジック...
  // 設定管理のロジック...
  // テーマ切り替えのロジック...
}

// ✅ 良い例: 責任を分割
function useUser() {
  /* ユーザー管理だけ */
}
function useSettings() {
  /* 設定管理だけ */
}
function useTheme() {
  /* テーマ管理だけ */
}
```

**理由:**

- テストしやすい
- 再利用しやすい
- 変更の影響範囲が小さい

### 2. 適切な戻り値の形式

| 形式                                    | 使う場面               | メリット                           |
| --------------------------------------- | ---------------------- | ---------------------------------- |
| 配列 `[value, setValue]`                | 2 つ程度の値を返す場合 | 呼び出し側で好きな名前をつけやすい |
| オブジェクト `{ data, loading, error }` | 多くの値を返す場合     | 必要なものだけ取り出せる           |

```jsx
// 配列で返す（useState と同じパターン）
function useToggle() {
  return [value, toggle];
}
const [isOpen, toggleOpen] = useToggle(); // 好きな名前で受け取れる
const [isVisible, toggleVisible] = useToggle();

// オブジェクトで返す（複数の値がある場合）
function useFetch() {
  return { data, loading, error, refetch };
}
const { data, loading } = useFetch(url); // 必要なものだけ取得
```

### 3. クリーンアップを忘れない

以下のリソースは、必ずクリーンアップが必要です:

| リソース           | クリーンアップ方法               |
| ------------------ | -------------------------------- |
| イベントリスナー   | `removeEventListener`            |
| タイマー           | `clearTimeout` / `clearInterval` |
| API リクエスト     | `AbortController.abort()`        |
| WebSocket          | `close()`                        |
| サブスクリプション | `unsubscribe()`                  |

```jsx
useEffect(() => {
  const subscription = someAPI.subscribe();

  // ✅ クリーンアップ関数を返す
  return () => {
    subscription.unsubscribe();
  };
}, []);
```

### 4. 依存配列を正しく設定

ESLint の `exhaustive-deps` ルールを有効にしましょう。依存関係の漏れを自動検出してくれます。

```jsx
// ESLint が警告してくれる例
useEffect(() => {
  fetchUser(userId); // userId を使っているのに...
}, []); // ← 依存配列に userId がない！警告が出る
```

---

## 10. よくある間違いと注意点

### 間違い 1: フック名が `use` で始まっていない

```jsx
// ❌ Reactはこれをフックとして認識しない
function getCounter() {
  const [count, setCount] = useState(0); // ルール違反だが検出されない
}

// ✅ 正しい命名
function useCounter() {
  const [count, setCount] = useState(0); // OK
}
```

### 間違い 2: 条件分岐内でフックを呼び出す

```jsx
// ❌ フックは常に同じ順序で呼ばれる必要がある
function useConditionalFetch(shouldFetch) {
  if (shouldFetch) {
    return useFetch(url); // 条件によってフックが呼ばれたり呼ばれなかったり
  }
  return null;
}

// ✅ 条件はフック内で処理
function useFetch(url) {
  useEffect(() => {
    if (!url) return; // ここで条件を処理
    // fetch処理...
  }, [url]);
}
```

### 間違い 3: 状態が共有されると思い込む

```jsx
function ComponentA() {
  const { count } = useCounter(); // A 専用の count
}

function ComponentB() {
  const { count } = useCounter(); // B 専用の count（A とは別！）
}

// 状態を共有したい場合は Context を使う
```

---

## 11. 演習問題

### 演習 1: usePrevious

前回の値を追跡するフックを作成してください。

**ヒント:** `useRef` は再レンダリングを起こさずに値を保持できます。`useEffect` はレンダリング後に実行されます。

```jsx
function usePrevious(value) {
  // TODO: 実装してください
}

// 使用例:
function Counter() {
  const [count, setCount] = useState(0);
  const prevCount = usePrevious(count);

  return (
    <div>
      <p>
        現在: {count}、前回: {prevCount}
      </p>
      <button onClick={() => setCount((c) => c + 1)}>+1</button>
    </div>
  );
}
// 0 → 1 にすると、「現在: 1、前回: 0」と表示される
```

### 演習 2: useOnClickOutside

要素の外側がクリックされたときにコールバックを実行するフックを作成してください。

**ヒント:** `document` に `mousedown` イベントを登録し、クリック位置が要素の外かどうかを `ref.current.contains(event.target)` で判定します。

```jsx
function useOnClickOutside(ref, handler) {
  // TODO: 実装してください
}

// 使用例:
function Dropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  useOnClickOutside(ref, () => setIsOpen(false));

  return (
    <div ref={ref}>
      <button onClick={() => setIsOpen(true)}>開く</button>
      {isOpen && <div className="dropdown-menu">メニュー内容</div>}
    </div>
  );
}
// 外側をクリックするとメニューが閉じる
```

### 演習 3: useMediaQuery

CSS メディアクエリの状態を監視するフックを作成してください。

**ヒント:** `window.matchMedia(query)` を使うと、メディアクエリにマッチするかどうかを取得できます。`change` イベントで変化を監視できます。

```jsx
function useMediaQuery(query) {
  // TODO: 実装してください
}

// 使用例:
function ResponsiveNav() {
  const isMobile = useMediaQuery("(max-width: 768px)");

  return isMobile ? <MobileNav /> : <DesktopNav />;
}
```

---

## まとめ

### カスタムフックとは

- `use` で始まる関数の中で、他のフックを使う関数
- **ロジックの再利用**を可能にする仕組み
- 状態は共有されない（共有したい場合は Context を使う）

### カスタムフックのメリット

| メリット       | 説明                                                    |
| -------------- | ------------------------------------------------------- |
| コードの再利用 | 同じロジックを複数のコンポーネントで使い回せる          |
| 関心の分離     | UI とロジックを分離し、コンポーネントをシンプルに保てる |
| テスト容易性   | フックを単独でテストできる                              |
| 可読性の向上   | 意図が明確な名前をつけることで、コードが読みやすくなる  |

### よく使うカスタムフックパターン

| フック名          | 用途                                       |
| ----------------- | ------------------------------------------ |
| `useToggle`       | 真偽値の切り替え（モーダル、メニューなど） |
| `useLocalStorage` | ローカルストレージとの同期                 |
| `useFetch`        | API データの取得                           |
| `useWindowSize`   | ウィンドウサイズの監視                     |
| `useDebounce`     | 入力のデバウンス                           |

### 学習のポイント

1. まずは組み込みフック（`useState`、`useEffect` など）をしっかり理解する
2. 繰り返し使うパターンを見つけたら、カスタムフックとして抽出する
3. 単一責任を意識し、シンプルなフックを組み合わせて使う
4. クリーンアップと依存配列を忘れずに

次のステップでは、これらの知識を活かして、より複雑な状態管理やパフォーマンス最適化に取り組んでいきましょう！
