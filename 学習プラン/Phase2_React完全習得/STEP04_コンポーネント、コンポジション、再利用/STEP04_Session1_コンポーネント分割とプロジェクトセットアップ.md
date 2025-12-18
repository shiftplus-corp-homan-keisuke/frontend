# Session 1: コンポーネント分割とプロジェクトセットアップ

## はじめに：なぜコンポーネントを分割するのか？

これまで作成してきた小さなアプリでは、すべてのコードを `App` コンポーネント（`App.js`）に書いても管理できていました。しかし、アプリケーションが大きくなるにつれて、1つのファイルに全てのロジックやUIを詰め込むと、以下のような問題が発生します。

*   **読みにくい**: 何千行ものコードから修正箇所を探すのが大変。
*   **再利用できない**: 「このボタン、他の画面でも使いたいな」と思っても、巨大なコンポーネントの一部だと切り出せない。
*   **チーム開発が困難**: 複数人が同じファイルを編集することになり、競合（コンフリクト）が頻発する。

このセッションでは、**「巨大な1つのコンポーネント」を「小さく管理しやすい複数のコンポーネント」に分割するプロセス** を、実際に手を動かしながら体験します。

---

## 1. プロジェクトの準備

まずは新しいプロジェクト `usePopcorn` を作成しましょう。
（※学習プランでは `vite` を推奨していますが、ここでは講義の流れに沿ってセットアップします）

### A. プロジェクトの作成
ターミナルで以下のコマンドを実行します。

```bash
npm create vite@latest usepopcorn -- --template react
cd usepopcorn
npm install
```

### B. スターターファイルの適用
学習用資料の `STEP04_プロジェクト/starter` フォルダにあるファイルを、作成したプロジェクトの `src` フォルダにコピー（上書き）してください。

*   `App.js`: 初期状態の巨大なコンポーネント（今回のリファクタリング対象）
*   `index.css`: アプリ全体のスタイリング

その後、開発サーバーを起動して画面を確認しましょう。

```bash
npm run dev
```

ブラウザで開くと、映画検索アプリのUIが表示されます。検索バーに入力したり、リストを開閉したりできますが、コード（`App.js`）を見ると、すべてが1つの `App` 関数の中に書かれていることがわかります。これからこれを綺麗にしていきましょう。

---

## 2. コンポーネント分割の実践

ここからは、実際にコードを分割していきます。「どこで切るか？」を考えながら進めましょう。

### Step 1: `NavBar` の分離（論理的な分割）

まず、画面上部の「ナビゲーションバー（ロゴ、検索、件数表示）」は、メインのコンテンツとは明らかに役割が異なります。これを `NavBar` として切り出しましょう。

**Before (`App.js` の `App` コンポーネント内):**
```jsx
<nav className="nav-bar">
  <div className="logo">...</div>
  <input className="search" ... />
  <p className="num-results">...</p>
</nav>
```

**Action:**
1.  `App` コンポーネントの外側（下部など）に、新しい `NavBar` 関数を作成します。
2.  `nav` 要素全体をカットして、`NavBar` の `return` にペーストします。
3.  `App` コンポーネントの元の場所に `<NavBar />` を記述します。

この時点で、コードは以下のようになります。

```jsx
function App() {
  // ... state定義 ...
  return (
    <>
      <NavBar />
      <main className="main">...</main>
    </>
  );
}

function NavBar() {
  return (
    <nav className="nav-bar">
      {/* ... 中身 ... */}
    </nav>
  );
}
```

**⚠️ エラー発生！**
ここですぐにエラーが出るはずです。`query` や `movies` が `NavBar` 内で見つからないと言われます。
これらは `App` コンポーネントで定義された State なので、`NavBar` からは直接アクセスできません。まだそのままにしておいてください（後で直します）。

### Step 2: `Main` の分離

次に、画面下のメインエリア（映画リストと視聴リスト）も分離しましょう。

**Action:**
1.  `Main` コンポーネントを作成します。
2.  `<main className="main">...</main>` 全体をカット＆ペーストします。
3.  `App` 内で `<Main />` を呼び出します。

ここでも State (`movies`, `watched`, `isOpen1` など) の参照エラーが出ますが、一旦無視して分割を進めます。

### Step 3: さらに細かく！ (`Logo`, `Search`, `NumResults`)

`NavBar` はまだごちゃごちゃしています。中身をさらに3つのコンポーネントに分けましょう。

*   `Logo`: 🍿 usePopcorn の部分
*   `Search`: 検索ボックス
*   `NumResults`: 「X 件の結果」の部分

**Action:**
`NavBar` の中身をさらに分割し、最終的に `NavBar` が以下のようになるようにします。

```jsx
function NavBar() {
  return (
    <nav className="nav-bar">
      <Logo />
      <Search />
      <NumResults />
    </nav>
  );
}
```

これで `NavBar` は「レイアウトを決める役割」だけになり、中身の詳細に関知しなくなりました。すっきりしましたね！

### Step 4: メインエリアの分割 (`ListBox`, `WatchedBox`)

`Main` コンポーネントの中には、左側の「検索結果リスト」と、右側の「視聴済みリスト」の2つの箱 (`box`) があります。これらも分けましょう。

*   `ListBox`: 左側の箱（検索結果）
*   `WatchedBox`: 右側の箱（視聴済みリスト）

**重要なポイント:**
両方のボックスは「開閉ボタン」を持っています。開閉状態 (`isOpen`) を管理する **State** は、それぞれのボックスの中で管理すべきです。

**Action:**
1.  `ListBox` を作成し、左側の `box` のJSXを移動します。`isOpen1` State も `App` から `ListBox` へ移動し、名前を `isOpen` に変更しましょう（汎用的にするため）。
2.  `WatchedBox` を作成し、右側の `box` のJSXを移動します。`isOpen2` State も同様に移動し、`isOpen` に変更します。

---

## 3. エラーの修正と Props のバケツリレー

ここまで分割すると、画面はエラーだらけになっているはずです。なぜなら、子コンポーネントに必要なデータ（State）が渡されていないからです。

### データの流れを整理する

React の基本ルールは **「データは親から子へ流れる (Props)」** です。

#### A. `NavBar` へのデータ渡し
`NumResults` は検索結果の数 (`movies.length`) を表示する必要があります。`Search` は検索クエリ (`query`) を扱います。これらのデータは親の `App` にあります。

**修正手順:**
1.  `App` から `NavBar` へ `movies` を渡すのではなく… おっと、`NavBar` 内部の `Search` や `NumResults` がデータを必要としています。
2.  これを解決するには、「Props のバケツリレー (Prop Drilling)」を行います。
    *   `App` -> `NavBar` へ `movies` を渡す
    *   `NavBar` -> `NumResults` へ `movies` を渡す

```jsx
// App.js
<NavBar movies={movies} />

// NavBar
function NavBar({ movies }) {
  return (
    <nav className="nav-bar">
      <Logo />
      <Search />
      <NumResults movies={movies} /> 
    </nav>
  );
}

// NumResults
function NumResults({ movies }) {
  return (
     // ... movies.length を使う
  );
}
```
※ `Search` 用の `query`, `setQuery` も同様にリレーしてください。

#### B. `Main` 側へのデータ渡し
`ListBox` は `movies` を表示する必要があります。
`WatchedBox` は `watched` を表示する必要があります。

**修正手順:**
1.  `App` -> `Main` へ `movies` と `watched` を渡す。
2.  `Main` -> `ListBox` へ `movies` を渡す。
3.  `Main` -> `WatchedBox` へ `watched` を渡す。

これで、データが末端まで届き、アプリケーションが再び正常に動作するはずです。

---

## 4. コンポーネントカテゴリの理解

リファクタリングお疲れ様でした！ 出来上がったコンポーネントを眺めてみると、いくつかの種類に分類できることに気づきませんか？

### 1. ステートレス / プレゼンテーション (Stateless / Presentational)
*   **特徴**: Stateを持たない。Propsを受け取って表示するだけ。
*   **例**: `Logo`, `NumResults`, `Movie`, `WatchedMovie`
*   **役割**: UIの見た目を担当。再利用しやすい。

### 2. ステートフル (Stateful)
*   **特徴**: Stateを持つ。
*   **例**: `Search` (入力値), `ListBox` (開閉), `WatchedBox` (開閉)
*   **役割**: 機能やインタラクションを担当。

### 3. 構造 / レイアウト (Structural)
*   **特徴**: 画面の枠組みを作る。
*   **例**: `App`, `NavBar`, `Main`
*   **役割**: 他のコンポーネントを配置する場所。

この分類を意識すると、コンポーネント設計がスムーズになります。

---

## 5. 次のステップへ

今のコードを見て、少し「面倒だな」と思うことはありませんか？
`Main` コンポーネントを見てください。

```jsx
function Main({ movies, watched }) {
  return (
    <main className="main">
      <ListBox movies={movies} />
      <WatchedBox watched={watched} />
    </main>
  );
}
```

`Main` 自身は `movies` も `watched` も使っていません。ただ子コンポーネントに渡すためだけに受け取っています。これが **Prop Drilling (プロップのバケツリレー)** です。階層が深くなればなるほど、このリレーは大変になります。

次のセッションでは、この問題を **「コンポーネントの合成 (Composition)」** というテクニックを使って鮮やかに解決します！
