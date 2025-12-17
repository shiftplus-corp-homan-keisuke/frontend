# Session 2: コンポーネントの合成 (Composition) と Prop Drilling の解消

## まえがき：Prop Drilling の苦痛
Session 1 でコンポーネントを分割しましたが、その代償として「データ渡し（Props）」が複雑になりました。
`App` -> `Main` -> `ListBox` -> `MovieList` ... と、使わないコンポーネントを経由してデータをバケツリレーする状態。これを **Prop Drilling** と呼びます。

このセッションでは、React の強力な機能である **「コンポーネントの合成 (Component Composition)」** を使って、この問題を解決します。

---

## 1. Composition とは？
「合成」と聞くと難しそうですが、実は HTML で普通にやっていることです。

```html
<div>
  <p>Hello</p>
</div>
```

`div` の中に `p` が入っています。`div` は「中に何が入るか」を知りません。ただ「入れ物」として機能しています。
React でも `children` prop を使うことで、これと同じことができます。

---

## 2. `NavBar` の Prop Drilling を解消する

まずは簡単な `NavBar` から修正しましょう。

**現状の課題:**
`NavBar` は `movies` を受け取っていますが、自分では使わず `NumResults` に渡すためだけに持っています。

**修正方針:**
`NavBar` を「穴あきの枠」にして、中身 (`Logo`, `Search`, `NumResults`) は `App` コンポーネント側から「子供 (`children`)」として渡すようにします。

### Action:
1.  **`NavBar` コンポーネントを修正**:
    `movies` prop を受け取るのをやめ、代わりに `children` を受け取ります。そして、中身のコンポーネントの代わりに `{children}` をレンダリングします。

```jsx
// Before
function NavBar({ movies }) {
  return (
    <nav className="nav-bar">
      <Logo />
      <Search />
      <NumResults movies={movies} />
    </nav>
  );
}

// After
function NavBar({ children }) {
  return (
    <nav className="nav-bar">
      <Logo />
      {children}
    </nav>
  );
}
```

2.  **`App` コンポーネントを修正**:
    `NavBar` を呼び出す際、閉じタグ `</NavBar>` を使い、その間に中身を記述します。

```jsx
// App.js
function App() {
  // ...
  return (
    <>
      <NavBar>
        <Search />
        <NumResults movies={movies} />
      </NavBar>
      <Main ... />
    </>
  );
}
```

**解説:**
これで `NavBar` は「中に何が入るか」を知る必要がなくなりました。`movies` データも、`App` から直接 `NumResults` に渡せるようになりました！ プロップのバケツリレーが1つ解消されました。

---

## 3. `Main` と `ListBox` の修正

次はもっと深い Prop Drilling が起きている `Main` エリアです。

### A. `Main` の修正
`NavBar` と同様に、`Main` も `children` を受け取るように変更します。

```jsx
// Main
function Main({ children }) {
  return (
    <main className="main">
      {children}
    </main>
  );
}

// App.js
<Main>
  <ListBox movies={movies} />
  <WatchedBox watched={watched} />
</Main>
```

これで `Main` コンポーネントから `movies` や `watched` といった Props が不要になりました。

### B. `ListBox` の修正（`Box` コンポーネントへの進化）
`ListBox` を見ると、開閉ボタン (`+` / `-`) があり、開いている時にリストを表示しています。
一方、`WatchedBox` を見ると…全く同じ「開閉ロジック」と「見た目」を持っています！ 違うのは「中身」だけです。

これは **再利用可能なコンポーネント** を作るチャンスです。名前を `Box` にしましょう。

**Action:**
1.  `ListBox` をコピーして、名前を `Box` に変更します。
2.  中身（`MovieList`）の部分を `{children}` に置き換えます。
3.  `movies` などの不要な Props を削除します。

```jsx
function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="box">
      <button
        className="btn-toggle"
        onClick={() => setIsOpen((open) => !open)}
      >
        {isOpen ? "–" : "+"}
      </button>

      {isOpen && children}
    </div>
  );
}
```

4.  `App.js` 側で `Box` を使って書き換えます。

```jsx
// App.js (Mainの中)
<Main>
  {/* 左側のボックス */}
  <Box>
    <MovieList movies={movies} />
  </Box>

  {/* 右側のボックス */}
  <Box>
    <WatchedSummary watched={watched} />
    <WatchedMoviesList watched={watched} />
  </Box>
</Main>
```

**結果:**
`ListBox` と `WatchedBox` という2つのコンポーネントを削除し、汎用的な `Box` コンポーネント1つに統一できました。しかも、`isOpen` という State のロジックも一箇所にまとまり、バグ修正も楽になります。

---

## 4. 完成形の確認

ここまで修正すると、`App` コンポーネントを見るだけで、アプリの構造とデータの流れが手にとるように分かるはずです。

```jsx
<NavBar>
  <Search />
  <NumResults movies={movies} />
</NavBar>

<Main>
  <Box>
    <MovieList movies={movies} />
  </Box>

  <Box>
    <WatchedSummary watched={watched} />
    <WatchedMoviesList watched={watched} />
  </Box>
</Main>
```

**これが Component Composition の力です。**
Props を深く通す必要がなくなり（Prop Drilling の解消）、コンポーネントの再利用性も高まりました。

※ この時点のコードの完全な形は、参考ファイルの `App-v1.js` と同じになります。

---

## 5. （参考）Element Prop による合成

`children` を使うのが React の標準的な方法ですが、別の方法もあります。
Props に直接 コンポーネント（要素）を渡す方法です。

```jsx
// 定義側
function Box({ element }) {
  return <div>{element}</div>;
}

// 利用側
<Box element={<MovieList movies={movies} />} />
```

「左にリスト、右に詳細」のようなレイアウトコンポーネントを作る場合、`left={...}` `right={...}` のように名前付きで渡したい時に便利です。
（今回は `children` を使う方法がベストなので採用しませんが、知識として知っておきましょう）

---

次は最後のセッション、再利用可能な星評価コンポーネント `StarRating` の作成です！
