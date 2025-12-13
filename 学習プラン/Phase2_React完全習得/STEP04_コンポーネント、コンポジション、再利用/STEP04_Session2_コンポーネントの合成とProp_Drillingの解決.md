# Session 2: コンポーネントの合成と Prop Drilling の解決

## 学習目標

このセッションでは、コンポーネント分割によって生じる「Prop Drilling（プロップのバケツリレー）」問題を解決し、より柔軟で再利用可能なコンポーネント設計を学びます。

- **Prop Drilling** の問題点の理解
- **コンポーネントの合成 (Composition)** の概念とメリット
- `children` prop を使用したスロットパターン
- 汎用的な **Box コンポーネント** の作成

## Prop Drilling（バケツリレー）とは？

前回のセッションで `App` コンポーネントを `NavBar` や `Main` に分割しました。
これにより、映画データ（`movies`）を特定のコンポーネント（`NumResults` や `MovieList`）で使うために、中間のコンポーネントを経由して渡す必要が出てきました。

### 現状の問題点

例えば、`App` にある `movies` ステートを `MovieList` に渡す流れを見てみましょう。

`App` (movies state) -> `Main` (prop受け渡し) -> `ListBox` (prop受け渡し) -> `MovieList` (ここでやっと使用)

ここで、`Main` や `ListBox` は `movies` を自分自身では使っていません。単に下に渡すためだけに Props を受け取っています。
これを **Prop Drilling** と呼びます。

**Prop Drilling のデメリット**:
- 中間のコンポーネントが不要な Props で汚染される。
- データの流れを追うのが難しくなる。
- コンポーネントの独立性が下がる（`Main` が `movies` を知る必要があるなど）。

## 解決策：コンポーネントの合成 (Component Composition)

この問題を解決する強力な手法が「コンポーネントの合成」です。
「コンポーネントの中に別のコンポーネントを **穴（スロット）** として空けておく」という考え方です。

### `children` prop の活用

React では、コンポーネントのタグで囲んだ中身は、自動的に `children` という特別な prop として渡されます。

```jsx
// 定義側
function Box({ children }) {
  return <div className="box">{children}</div>;
}

// 使用側
<Box>
  <p>これが children として渡されます</p>
</Box>
```

これを使って、`NavBar` をリファクタリングしてみましょう。

### 実践 1: NavBar の Prop Drilling 解消

**変更前**:
`NavBar` は `NumResults` を直接レンダリングしているため、`movies` を受け取る必要がありました。

```jsx
// 変更前
<NavBar movies={movies} /> 
// 中で <NumResults movies={movies} /> を呼んでいる
```

**変更後**:
`NavBar` は中身（children）を受け取るだけにします。

```jsx
// NavBar コンポーネント
function NavBar({ children }) {
  return (
    <nav className="nav-bar">
      <Logo />
      {children}
    </nav>
  );
}

// App コンポーネントでの使用
<NavBar>
  <Search />
  <NumResults movies={movies} />
</NavBar>
```

**効果**:
1. `NavBar` から `movies` prop が消えました。
2. `NavBar` は中に何が入るかを知る必要がなくなりました。
3. `App` コンポーネントを見るだけで、ナビゲーションバーの構成が一目瞭然になりました。

### 実践 2: Main エリアの Prop Drilling 解消

同様に `Main` コンポーネントも修正しましょう。

```jsx
// App コンポーネント
<Main>
  <ListBox>
    <MovieList movies={movies} />
  </ListBox>
  <WatchedBox>
    <WatchedSummary watched={watched} />
    <WatchedMovieList watched={watched} />
  </WatchedBox>
</Main>
```

これにより、`Main` は単にレイアウト枠（`main`タグを持つだけなど）になり、データに関与しなくなります。

## 再利用可能な Box コンポーネントの作成

現在、`ListBox`（左側）と `WatchedBox`（右側）は、中身が違うだけで「右上のボタンで開閉できる箱」という機能は全く同じコードが重複しているはずです。
これも Composition を使って解決します。

### ステップ 1: 汎用 Box コンポーネントを作る

`ListBox` のコードをコピーして、`Box` という名前の新しいコンポーネントを作ります。
中身のリスト部分（`MovieList`など）を `children` に置き換えます。

```jsx
function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "–" : "+"}
      </button>
      {isOpen && children}
    </div>
  );
}
```

### ステップ 2: Box を利用する

`App` コンポーネントで、`ListBox` と `WatchedBox` の代わりに `Box` を使います。

```jsx
<Main>
  {/* 左側のボックス */}
  <Box>
    <MovieList movies={movies} />
  </Box>

  {/* 右側のボックス */}
  <Box>
    <WatchedSummary watched={watched} />
    <WatchedMovieList watched={watched} />
  </Box>
</Main>
```

これで、開閉ロジックを `Box` コンポーネント 1 箇所に集約できました。
`ListBox` と `WatchedBox` コンポーネントは不要になり、削除できます。

## （参考）Props として要素を渡す

`children` を使うのが最も一般的ですが、名前付きの prop としてコンポーネント（要素）を渡すことも可能です。
例えば、左右に分割するレイアウトコンポーネントなどでは、`left` と `right` という prop を使う方が明示的な場合があります。

```jsx
function SplitPane({ left, right }) {
  return (
    <div className="split">
      <div className="left">{left}</div>
      <div className="right">{right}</div>
    </div>
  );
}

// 使用時
<SplitPane 
  left={<MovieList movies={movies} />}
  right={<WatchedMovieList watched={watched} />}
/>
```

React ではコンポーネントの実体は単なるオブジェクトなので、このように数値や文字列と同じように Props として自由に受け渡しができます。

## まとめ

- **Prop Drilling** は、コンポーネントの合成 (**Composition**) で解決できることが多いです。
- **Composition** により、コンポーネントはより汎用的になり、コードの構造（レイアウト）が親コンポーネント（`App`）で可視化されやすくなります。
- `children` prop は、コンポーネントに「スロット（穴）」を開けておくための React の基本機能です。
