# Session 4: TanStack Table の基本 ― Headless UI で型安全なテーブルを作る

## はじめに：なぜ「テーブルライブラリ」が必要なのか

Session 3 で Headless パターンを学びました。「ロジックだけ提供し、UI は完全に自由」という考え方です。

テーブル（表）は一見シンプルですが、実務では次のような要件がすぐに発生します。

```
最初: 「データを表に表示して」
→ 「ソート機能もほしい」
→ 「フィルターも追加して」
→ 「ページネーションも必要」
→ 「列の表示/非表示を切り替えたい」
→ 「行を選択できるようにして」
```

これらを全て自作すると、**テーブルのロジックだけで数百行のコード**になります。しかもバグが出やすく、テストも大変です。

### TanStack Table とは

**TanStack Table**（旧 React Table）は、テーブルのロジックを全て提供する **Headless UI ライブラリ** です。

```
┌─────────────────────────────────────────────┐
│  TanStack Table が提供するもの（ロジック）      │
│  ・ソート                                     │
│  ・フィルタリング                              │
│  ・ページネーション                            │
│  ・行の選択                                   │
│  ・列の並び替え                               │
│  → UI は一切なし！                            │
└─────────────────────────────────────────────┘
         ↓ フックから状態と操作関数を返す
┌─────────────────────────────────────────────┐
│  あなたが自由に作る部分（UI）                  │
│  ・HTML の <table> でもOK                     │
│  ・Tailwind CSS でスタイリングしてもOK         │
│  ・Material UI のコンポーネントでもOK          │
│  ・div + CSS Grid でもOK                      │
└─────────────────────────────────────────────┘
```

> **このセッションのゴール**: TanStack Table の基本的な使い方を習得し、Headless UI の実践的な活用方法を理解する

---

## 1. セットアップ

### 1.1 インストール

```bash
npm install @tanstack/react-table
```

TanStack Table は **依存ライブラリがゼロ** です。React 以外に何もインストールする必要がありません。

### 1.2 基本のインポート

```tsx
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
```

| インポート           | 役割                                     |
| -------------------- | ---------------------------------------- |
| `useReactTable`      | テーブルインスタンスを作るメインのフック |
| `getCoreRowModel`    | 基本の行モデル（必須）                   |
| `flexRender`         | セルのレンダリングヘルパー               |
| `createColumnHelper` | 型安全にカラム定義を作るヘルパー         |

---

## 2. 最小構成のテーブル ― まず動かす

### 2.1 データの型とサンプルデータ

```tsx
// types.ts
type User = {
  id: number;
  name: string;
  email: string;
  role: "admin" | "editor" | "viewer";
};

// data.ts
const users: User[] = [
  { id: 1, name: "田中太郎", email: "tanaka@example.com", role: "admin" },
  { id: 2, name: "鈴木花子", email: "suzuki@example.com", role: "editor" },
  { id: 3, name: "佐藤次郎", email: "sato@example.com", role: "viewer" },
  { id: 4, name: "高橋美咲", email: "takahashi@example.com", role: "editor" },
  { id: 5, name: "伊藤健一", email: "ito@example.com", role: "admin" },
];
```

### 2.2 カラム定義

TanStack Table では、テーブルの各列を **カラム定義（Column Definition）** で宣言します。

```tsx
import { createColumnHelper } from "@tanstack/react-table";

const columnHelper = createColumnHelper<User>();

const columns = [
  columnHelper.accessor("name", {
    header: "名前",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("email", {
    header: "メールアドレス",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("role", {
    header: "権限",
    cell: (info) => {
      const labels = { admin: "管理者", editor: "編集者", viewer: "閲覧者" };
      return labels[info.getValue()];
    },
  }),
];
```

**コード解説:**

```tsx
const columnHelper = createColumnHelper<User>();
//                                      ^^^^^^
// User 型を渡すことで、accessor に指定できるプロパティが
// "id" | "name" | "email" | "role" に制限される（型安全！）

columnHelper.accessor("name", { ... });
//                    ^^^^^^
// "name" は User のプロパティ名。
// 存在しないプロパティ（例: "age"）を書くとコンパイルエラー

cell: (info) => info.getValue(),
//              ^^^^^^^^^^^^^^^
// info.getValue() は自動的に string 型（name の型）と推論される
```

### 2.3 テーブルコンポーネント

```tsx
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";

function UserTable() {
  const table = useReactTable({
    data: users,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <table>
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <th key={header.id}>
                {flexRender(
                  header.column.columnDef.header,
                  header.getContext(),
                )}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row) => (
          <tr key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <td key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

**コード解説:**

```tsx
const table = useReactTable({
  data: users, // 表示するデータ
  columns, // カラム定義
  getCoreRowModel: getCoreRowModel(), // 行モデル（必須）
});
```

`useReactTable` が返す `table` オブジェクトが **テーブルインスタンス** です。このインスタンスから全ての情報を取得します。

```tsx
table.getHeaderGroups(); // ヘッダー行の配列を取得
table.getRowModel().rows; // データ行の配列を取得
row.getVisibleCells(); // 各行のセルを取得
```

```tsx
flexRender(header.column.columnDef.header, header.getContext());
//         ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^  ^^^^^^^^^^^^^^^^^^
//         レンダリングする内容                コンテキスト情報
```

`flexRender` は「文字列でも関数でも JSX でも、何でもレンダリングできる」ヘルパーです。カラム定義の `header` や `cell` に書いた内容をそのまま描画してくれます。

### 2.4 Headless であることの確認

上のコードをよく見てください。**TanStack Table は `<table>` タグすら提供しません**。

```tsx
// 全てのHTML要素は自分で書いている
<table>           // ← 自分で書いた
  <thead>         // ← 自分で書いた
    <tr>          // ← 自分で書いた
      <th>        // ← 自分で書いた
```

TanStack Table が提供するのは `table.getHeaderGroups()` や `table.getRowModel()` などの **データとロジック** だけ。これが Session 3 で学んだ「Headless」の実例です。

---

## 3. ソート機能を追加する

### 3.1 ソートの有効化

TanStack Table では、機能を追加するときに対応する **Row Model** をインポートして渡します。

```tsx
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel, // ← ソート用の Row Model を追加
  flexRender,
  createColumnHelper,
  type SortingState, // ← ソート状態の型
} from "@tanstack/react-table";
```

```tsx
function UserTable() {
  // ソート状態を React state として管理
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data: users,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(), // ← 追加
    state: {
      sorting, // ← テーブルに現在のソート状態を渡す
    },
    onSortingChange: setSorting, // ← ソート状態が変わったら更新
  });

  // ... return は同じ
}
```

**コード解説:**

```tsx
const [sorting, setSorting] = useState<SortingState>([]);
```

`SortingState` は `{ id: string; desc: boolean }[]` 型です。例えば名前の昇順ソートなら `[{ id: "name", desc: false }]` になります。空の配列はソートなしの状態です。

```tsx
state: { sorting },
onSortingChange: setSorting,
```

TanStack Table は **状態を外部（React state）で管理する** 設計です。これにより、URL パラメータとの同期や、状態の永続化が容易にできます。

### 3.2 ヘッダーにソートUIを追加

```tsx
<thead>
  {table.getHeaderGroups().map((headerGroup) => (
    <tr key={headerGroup.id}>
      {headerGroup.headers.map((header) => (
        <th
          key={header.id}
          onClick={header.column.getToggleSortingHandler()}
          style={{ cursor: "pointer" }}
        >
          {flexRender(header.column.columnDef.header, header.getContext())}
          {/* ソート方向のインジケーター */}
          {{ asc: " 🔼", desc: " 🔽" }[header.column.getIsSorted() as string] ??
            ""}
        </th>
      ))}
    </tr>
  ))}
</thead>
```

**コード解説:**

```tsx
header.column.getToggleSortingHandler();
// クリックするたびに: なし → 昇順 → 降順 → なし とサイクル

header.column.getIsSorted();
// 現在のソート状態を返す: false | "asc" | "desc"
```

---

## 4. フィルター機能を追加する

### 4.1 グローバルフィルター（全列検索）

テーブル全体を横断して検索するフィルターを追加します。

```tsx
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel, // ← フィルター用の Row Model
  flexRender,
  createColumnHelper,
  type SortingState,
} from "@tanstack/react-table";
```

```tsx
function UserTable() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState(""); // ← 追加

  const table = useReactTable({
    data: users,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(), // ← 追加
    state: {
      sorting,
      globalFilter, // ← 追加
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter, // ← 追加
  });

  return (
    <div>
      {/* 検索ボックス */}
      <input
        value={globalFilter}
        onChange={(e) => setGlobalFilter(e.target.value)}
        placeholder="検索..."
      />
      <table>{/* ... thead, tbody は同じ */}</table>
    </div>
  );
}
```

### 4.2 カラムごとのフィルター

特定の列だけをフィルターすることもできます。

```tsx
function UserTable() {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data: users,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnFilters,
    },
    onColumnFiltersChange: setColumnFilters,
  });

  return (
    <div>
      {/* role 列のフィルター */}
      <select
        value={(table.getColumn("role")?.getFilterValue() as string) ?? ""}
        onChange={(e) =>
          table.getColumn("role")?.setFilterValue(e.target.value || undefined)
        }
      >
        <option value="">全ての権限</option>
        <option value="admin">管理者</option>
        <option value="editor">編集者</option>
        <option value="viewer">閲覧者</option>
      </select>

      <table>{/* ... */}</table>
    </div>
  );
}
```

**コード解説:**

```tsx
table.getColumn("role")?.setFilterValue(e.target.value || undefined);
//    ^^^^^^^^^^^^^^^^^  ^^^^^^^^^^^^^^
//    列オブジェクトを取得  その列にフィルター値をセット
```

`undefined` を渡すとフィルターが解除されます。

---

## 5. ページネーションを追加する

### 5.1 ページネーションの有効化

```tsx
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel, // ← ページネーション用の Row Model
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
```

```tsx
function UserTable() {
  const table = useReactTable({
    data: users,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(), // ← 追加
    initialState: {
      pagination: {
        pageSize: 10, // 1ページあたりの行数
      },
    },
  });

  return (
    <div>
      <table>{/* ... thead, tbody は同じ */}</table>

      {/* ページネーション UI */}
      <div>
        <button
          onClick={() => table.firstPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {"<<"}
        </button>
        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {"<"}
        </button>
        <span>
          {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}
        </span>
        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          {">"}
        </button>
        <button
          onClick={() => table.lastPage()}
          disabled={!table.getCanNextPage()}
        >
          {">>"}
        </button>
      </div>
    </div>
  );
}
```

**コード解説:**

```tsx
table.firstPage(); // 最初のページへ
table.previousPage(); // 前のページへ
table.nextPage(); // 次のページへ
table.lastPage(); // 最後のページへ
table.getCanPreviousPage(); // 前のページがあるか（boolean）
table.getCanNextPage(); // 次のページがあるか（boolean）
table.getPageCount(); // 総ページ数
table.getState().pagination.pageIndex; // 現在のページ（0始まり）
```

TanStack Table が全てのページネーション **ロジック** を処理します。ボタンの `disabled` 制御、ページ数の計算、表示するデータの切り出し — 全て自動です。あなたは UI を配置するだけ。

---

## 6. 全体を組み合わせた完成形

ここまで学んだ全ての機能を1つのコンポーネントにまとめます。

```tsx
import { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
  type SortingState,
  type ColumnFiltersState,
} from "@tanstack/react-table";

// --- 型定義 ---
type User = {
  id: number;
  name: string;
  email: string;
  role: "admin" | "editor" | "viewer";
};

// --- カラム定義 ---
const columnHelper = createColumnHelper<User>();

const columns = [
  columnHelper.accessor("name", {
    header: "名前",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("email", {
    header: "メールアドレス",
    cell: (info) => <a href={`mailto:${info.getValue()}`}>{info.getValue()}</a>,
  }),
  columnHelper.accessor("role", {
    header: "権限",
    cell: (info) => {
      const labels = { admin: "管理者", editor: "編集者", viewer: "閲覧者" };
      return labels[info.getValue()];
    },
    filterFn: "equals", // 完全一致フィルター
  }),
];

// --- テーブルコンポーネント ---
function UserTable({ data }: { data: User[] }) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data,
    columns,
    // Row Models
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    // State
    state: {
      sorting,
      globalFilter,
      columnFilters,
    },
    // State handlers
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    // Options
    initialState: {
      pagination: { pageSize: 10 },
    },
  });

  return (
    <div>
      {/* ツールバー */}
      <div style={{ marginBottom: 16, display: "flex", gap: 8 }}>
        <input
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder="検索..."
        />
        <select
          value={(table.getColumn("role")?.getFilterValue() as string) ?? ""}
          onChange={(e) =>
            table.getColumn("role")?.setFilterValue(e.target.value || undefined)
          }
        >
          <option value="">全ての権限</option>
          <option value="admin">管理者</option>
          <option value="editor">編集者</option>
          <option value="viewer">閲覧者</option>
        </select>
      </div>

      {/* テーブル */}
      <table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  onClick={header.column.getToggleSortingHandler()}
                  style={{ cursor: "pointer", userSelect: "none" }}
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext(),
                  )}
                  {{ asc: " 🔼", desc: " 🔽" }[
                    header.column.getIsSorted() as string
                  ] ?? ""}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* ページネーション */}
      <div
        style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 8 }}
      >
        <button
          onClick={() => table.firstPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {"<<"}
        </button>
        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {"<"}
        </button>
        <span>
          ページ {table.getState().pagination.pageIndex + 1} /{" "}
          {table.getPageCount()}
        </span>
        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          {">"}
        </button>
        <button
          onClick={() => table.lastPage()}
          disabled={!table.getCanNextPage()}
        >
          {">>"}
        </button>
        <span>（全 {table.getRowCount()} 件）</span>
      </div>
    </div>
  );
}
```

---

## 7. TanStack Table の設計思想 ― なぜ Headless なのか

### 7.1 従来のテーブルライブラリとの比較

```
従来のライブラリ（例: Ant Design Table）:
  ┌────────────────────────┐
  │  ロジック + UI が一体   │
  │  ・見た目が固定される   │
  │  ・カスタマイズが困難   │
  │  ・CSSの上書きが大変   │
  └────────────────────────┘

TanStack Table（Headless）:
  ┌────────────────────────┐    ┌────────────────────────┐
  │  ロジックのみ           │ +  │  UIは完全に自由         │
  │  ・ソート計算           │    │  ・Tailwind CSS         │
  │  ・フィルタリング       │    │  ・CSS Modules          │
  │  ・ページネーション     │    │  ・Styled Components    │
  │  ・状態管理             │    │  ・何でもOK             │
  └────────────────────────┘    └────────────────────────┘
```

### 7.2 Session 3 の復習：Headless パターンの3原則

| 原則               | TanStack Table での実現                         |
| ------------------ | ----------------------------------------------- |
| ロジックとUIの分離 | `useReactTable` はフックであり、HTML を返さない |
| 状態の外部管理     | `state` と `onXxxChange` で React state と連携  |
| 構成の自由度       | `<table>` でも `<div>` でも好きなHTML構造で描画 |

### 7.3 Row Model パターン ― 機能のプラグイン

TanStack Table は必要な機能だけをインポートする設計です。

```tsx
// 最小構成（表示のみ）
getCoreRowModel: getCoreRowModel(),

// + ソート
getSortedRowModel: getSortedRowModel(),

// + フィルター
getFilteredRowModel: getFilteredRowModel(),

// + ページネーション
getPaginationRowModel: getPaginationRowModel(),
```

使わない機能のコードはバンドルに含まれません（**Tree Shaking**）。これはバンドルサイズの最適化に直結します。

---

## 8. 練習問題

### 課題: 商品管理テーブル

以下のデータ型で、TanStack Table を使ったテーブルを作ってください。

```tsx
type Product = {
  id: string;
  name: string;
  price: number;
  category: "electronics" | "clothing" | "food";
  inStock: boolean;
};
```

**要件:**

1. 全カラムを表示する（`id` は非表示にしても可）
2. `price` は `¥1,000` のようにフォーマットして表示
3. `inStock` は `◯` / `✕` で表示
4. `category` でフィルターできるセレクトボックスを追加
5. 名前と価格でソートできるようにする
6. ページネーション（5件ずつ表示）

**ヒント:**

- `cell` で `info.getValue()` を使ってセルの値を取得し、加工して表示できます
- `filterFn: "equals"` でカテゴリの完全一致フィルターが使えます
- `price.toLocaleString()` で数値をカンマ区切りにフォーマットできます

### ボーナス課題

テーブルの UI 部分（`<table>`, `<thead>`, `<tbody>` の描画ループ）を再利用可能なコンポーネントとして分離してみましょう。Session 3 で学んだ Headless パターンの応用です。

```tsx
// 汎用テーブルUIコンポーネント
function DataTable<T>({ table }: { table: Table<T> }) {
  // table インスタンスを受け取って描画するだけ
}
```

---

## 9. セルフチェック

1. TanStack Table が「Headless UI」と呼ばれる理由は何か？
2. `createColumnHelper<T>()` で型パラメータを渡すメリットは何か？
3. `useReactTable` に渡す `state` と `onXxxChange` は何のためにあるか？
4. `flexRender` はどんな役割を果たしているか？
5. ソート・フィルター・ページネーションを追加するとき、共通する手順は何か？
6. 従来のUIライブラリ（例: Ant Design Table）と比較した場合のメリット・デメリットは？

> **次のセッション**: 学んだ全てのパターンを組み合わせて、プロダクション品質のフォルダ構成と設計を実践します。
