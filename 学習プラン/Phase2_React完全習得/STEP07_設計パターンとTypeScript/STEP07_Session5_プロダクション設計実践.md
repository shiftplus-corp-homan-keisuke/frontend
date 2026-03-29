# Session 5: プロダクション設計実践 ― フォルダ構成と総合演習

## はじめに：「動くコード」と「保守できるコード」の違い

Session 1〜4 で、TypeScript の型定義、コンポーネント設計パターン、Generics を学びました。個々のコンポーネントの書き方は分かったはずです。

しかし、実務のプロジェクトは 1 ファイルでは完結しません。数十〜数百のファイルを **どう整理するか** で、プロジェクトの保守性は大きく変わります。

### 初心者がよくやる失敗

```
src/
├── components/
│   ├── Button.tsx
│   ├── Header.tsx
│   ├── UserList.tsx
│   ├── UserCard.tsx
│   ├── ProductList.tsx
│   ├── ProductCard.tsx
│   ├── CartButton.tsx
│   ├── CartSummary.tsx
│   ├── LoginForm.tsx
│   ├── SignupForm.tsx
│   ├── Modal.tsx
│   ├── Dropdown.tsx
│   ├── ...（50ファイル以上が1フォルダに）
│   └── Tooltip.tsx
├── hooks/
│   ├── useUsers.ts
│   ├── useProducts.ts
│   ├── useCart.ts
│   └── useAuth.ts
└── types/
    └── index.ts  ← 全ての型が1ファイルに...
```

**問題点:**
- `components/` フォルダを開くと50ファイル以上が一覧される
- `UserList` と `UserCard` が「ユーザー機能」として関連していることが分からない
- 新しい開発者が「認証関連のコードはどこ？」と探すのに時間がかかる

---

## 1. フォルダ構成の基本原則

### 1.1 「技術」ではなく「機能」で分ける

```
❌ 技術で分ける（コンポーネント / フック / 型 で分割）
src/
├── components/  ← 全コンポーネントが1か所
├── hooks/       ← 全フックが1か所
└── types/       ← 全型が1か所

✅ 機能（Feature）で分ける
src/
├── features/
│   ├── users/      ← ユーザー関連が全部ここ
│   ├── products/   ← 商品関連が全部ここ
│   ├── cart/       ← カート関連が全部ここ
│   └── auth/       ← 認証関連が全部ここ
└── shared/         ← 複数機能で共有するもの
```

**なぜ機能で分けるのか？**

「ユーザー一覧の表示を修正したい」と言われたとき：
- **技術で分けた場合**: `components/UserList.tsx` → `hooks/useUsers.ts` → `types/index.ts` と3か所を行き来
- **機能で分けた場合**: `features/users/` フォルダの中を見るだけ

### 1.2 推奨フォルダ構成

```
src/
├── app/                     # アプリケーションのエントリポイント
│   ├── App.tsx
│   ├── main.tsx
│   └── routes.tsx           # ルーティング定義（将来使う）
│
├── features/                # 機能（Feature）ごとのモジュール
│   ├── users/
│   │   ├── components/      # この機能専用のコンポーネント
│   │   │   ├── UserList.tsx
│   │   │   ├── UserCard.tsx
│   │   │   └── UserFilter.tsx
│   │   ├── hooks/           # この機能専用のフック
│   │   │   └── useUsers.ts
│   │   ├── types.ts         # この機能の型定義
│   │   └── index.ts         # バレルエクスポート（公開API）
│   │
│   ├── cart/
│   │   ├── components/
│   │   │   ├── CartSummary.tsx
│   │   │   └── CartItem.tsx
│   │   ├── hooks/
│   │   │   └── useCart.ts
│   │   ├── store.ts         # Zustand ストア（STEP06で学んだ）
│   │   ├── types.ts
│   │   └── index.ts
│   │
│   └── auth/
│       ├── components/
│       │   ├── LoginForm.tsx
│       │   └── SignupForm.tsx
│       ├── hooks/
│       │   └── useAuth.ts
│       ├── types.ts
│       └── index.ts
│
├── shared/                  # 複数の機能で共有するもの
│   ├── components/          # 汎用UIコンポーネント
│   │   ├── Button.tsx
│   │   ├── Modal.tsx
│   │   ├── Select.tsx       # Session4で作った汎用Select
│   │   ├── List.tsx         # Session4で作った汎用List
│   │   └── index.ts
│   ├── hooks/               # 汎用カスタムフック
│   │   ├── useToggle.ts     # Session3で作ったuseToggle
│   │   ├── useForm.ts       # Session3で作ったuseForm
│   │   └── index.ts
│   └── types/               # 共通の型定義
│       └── index.ts
│
└── styles/                  # グローバルスタイル
    └── index.css
```

### 1.3 分類の判断基準

| ファイル | 置く場所 | 判断基準 |
|---------|---------|---------|
| `UserList.tsx` | `features/users/components/` | ユーザー機能専用 |
| `Button.tsx` | `shared/components/` | 複数の機能で使う |
| `useUsers.ts` | `features/users/hooks/` | ユーザーデータ専用 |
| `useToggle.ts` | `shared/hooks/` | どの機能でも使える汎用フック |
| `User` 型 | `features/users/types.ts` | ユーザー機能専用の型 |
| `ApiState<T>` 型 | `shared/types/index.ts` | 汎用的な型 |

> **迷ったら**: 「このファイルは1つの機能でしか使わないか？」→ Yes なら `features/`、No なら `shared/`

---

## 2. バレルエクスポート ― 公開APIを定義する

### 2.1 バレルエクスポートとは

各 feature フォルダの `index.ts` は **バレルエクスポート** と呼ばれます。そのフォルダから「外部に公開するもの」だけを選んで re-export します。

```tsx
// features/users/index.ts（バレルエクスポート）

// 公開するコンポーネント
export { UserList } from "./components/UserList";
export { UserCard } from "./components/UserCard";

// 公開するフック
export { useUsers } from "./hooks/useUsers";

// 公開する型
export type { User, UserFilter } from "./types";

// UserFilter.tsx は外部に公開しない（内部実装の詳細）
```

### 2.2 なぜバレルエクスポートが重要なのか

**バレルなしの場合:**

```tsx
// ❌ 内部の構造を知っている必要がある
import { UserList } from "../features/users/components/UserList";
import { useUsers } from "../features/users/hooks/useUsers";
import type { User } from "../features/users/types";
```

**バレルありの場合:**

```tsx
// ✅ フォルダのルートからインポートするだけ
import { UserList, useUsers } from "../features/users";
import type { User } from "../features/users";
```

**メリット:**

1. **インポートがシンプル**: 内部のフォルダ構成を知らなくていい
2. **リファクタリングが容易**: 内部でファイルを移動しても、`index.ts` を更新するだけで外部への影響なし
3. **カプセル化**: 公開しないものは外部からアクセスできない

### 2.3 注意点：循環参照を避ける

```tsx
// ❌ features 同士が直接参照し合うと循環参照のリスク
// features/cart/components/CartItem.tsx
import { ProductCard } from "../../products/components/ProductCard";

// ✅ shared を経由するか、バレルエクスポートを使う
// features/cart/components/CartItem.tsx
import { ProductCard } from "../../products";
```

---

## 3. 型定義ファイルの設計

### 3.1 Feature 内の型定義

```tsx
// features/users/types.ts

// --- エンティティ（データの型） ---
export type User = {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
};

export type UserRole = "admin" | "editor" | "viewer";

// --- API レスポンス ---
export type UsersResponse = {
  users: User[];
  total: number;
  page: number;
};

// --- フィルター ---
export type UserFilter = {
  search: string;
  role: UserRole | "all";
  sortBy: keyof Pick<User, "name" | "email" | "createdAt">;
  sortOrder: "asc" | "desc";
};

// --- フォーム用（新規作成時は id 不要） ---
export type CreateUserInput = Omit<User, "id" | "createdAt">;
export type UpdateUserInput = Partial<Omit<User, "id" | "createdAt">>;
```

**コード解説:**

```tsx
export type UserFilter = {
  sortBy: keyof Pick<User, "name" | "email" | "createdAt">;
  //      ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  // 「User の name, email, createdAt のどれか」
  // つまり "name" | "email" | "createdAt" と同じ
  // User 型が変わった時に自動で追従する利点がある
};
```

```tsx
export type CreateUserInput = Omit<User, "id" | "createdAt">;
// id と createdAt はサーバーが付与するので、入力フォームには不要
// Omit でこの2つを除外した型を作る
```

### 3.2 共有型定義

```tsx
// shared/types/index.ts

// API 状態（Session4 で学んだ Discriminated Union）
export type ApiState<T> =
  | { status: "loading" }
  | { status: "error"; error: string }
  | { status: "success"; data: T };

// ページネーション
export type PaginatedResponse<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

// ソート
export type SortDirection = "asc" | "desc";
export type SortConfig<T> = {
  key: keyof T;
  direction: SortDirection;
};
```

---

## 4. 総合演習：タスク管理機能を設計する

ここまで学んだ全てのパターンを使って、**タスク管理機能**を設計しましょう。

### 4.1 要件

- タスクの一覧表示（フィルター、ソート付き）
- タスクの作成
- タスクの完了/未完了の切り替え
- タスクの削除

### 4.2 ステップ1: フォルダ構成を作る

```
src/features/tasks/
├── components/
│   ├── TaskList.tsx          # タスク一覧（Presentational）
│   ├── TaskItem.tsx          # 個々のタスク（Presentational）
│   ├── TaskForm.tsx          # タスク作成フォーム
│   ├── TaskFilter.tsx        # フィルターUI
│   └── TaskPage.tsx          # ページ全体（Container）
├── hooks/
│   ├── useTasks.ts           # タスクCRUDロジック
│   └── useTaskFilter.ts     # フィルターロジック
├── types.ts                  # 型定義
└── index.ts                  # バレルエクスポート
```

### 4.3 ステップ2: 型を設計する（最初に型から！）

```tsx
// features/tasks/types.ts

export type TaskPriority = "low" | "medium" | "high";
export type TaskStatus = "todo" | "in_progress" | "done";

export type Task = {
  id: string;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  createdAt: string;
};

export type CreateTaskInput = Omit<Task, "id" | "createdAt" | "status">;
// 新規作成時は id, createdAt, status は不要（自動設定される）

export type TaskFilter = {
  search: string;
  status: TaskStatus | "all";
  priority: TaskPriority | "all";
};
```

### 4.4 ステップ3: Headless フック（ロジック）

```tsx
// features/tasks/hooks/useTasks.ts

import { useState } from "react";
import type { Task, CreateTaskInput } from "../types";

function useTasks(initialTasks: Task[] = []) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  const addTask = (input: CreateTaskInput) => {
    const newTask: Task = {
      ...input,
      id: crypto.randomUUID(),
      status: "todo",
      createdAt: new Date().toISOString(),
    };
    setTasks((prev) => [newTask, ...prev]);
  };

  const toggleStatus = (id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? { ...task, status: task.status === "done" ? "todo" : "done" }
          : task
      )
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  return { tasks, addTask, toggleStatus, deleteTask };
}

export { useTasks };
```

```tsx
// features/tasks/hooks/useTaskFilter.ts

import { useState, useMemo } from "react";
import type { Task, TaskFilter } from "../types";

function useTaskFilter(tasks: Task[]) {
  const [filter, setFilter] = useState<TaskFilter>({
    search: "",
    status: "all",
    priority: "all",
  });

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      // 検索フィルター
      const matchesSearch =
        filter.search === "" ||
        task.title.toLowerCase().includes(filter.search.toLowerCase());

      // ステータスフィルター
      const matchesStatus =
        filter.status === "all" || task.status === filter.status;

      // 優先度フィルター
      const matchesPriority =
        filter.priority === "all" || task.priority === filter.priority;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [tasks, filter]);

  const updateFilter = <K extends keyof TaskFilter>(
    key: K,
    value: TaskFilter[K]
  ) => {
    setFilter((prev) => ({ ...prev, [key]: value }));
  };

  return { filter, filteredTasks, updateFilter };
}

export { useTaskFilter };
```

**コード解説:**

```tsx
const updateFilter = <K extends keyof TaskFilter>(
  key: K,
  value: TaskFilter[K]
) => {
```

これは Session 4 で学んだ Generics の応用です:
- `K extends keyof TaskFilter` → K は `"search" | "status" | "priority"` のどれか
- `value: TaskFilter[K]` → K が `"status"` なら value は `TaskStatus | "all"`
- **キーと値の型が連動する**ので、型安全にフィルターを更新できる

### 4.5 ステップ4: Presentational コンポーネント（見た目）

```tsx
// features/tasks/components/TaskItem.tsx

import type { Task } from "../types";

type TaskItemProps = {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
};

function TaskItem({ task, onToggle, onDelete }: TaskItemProps) {
  const priorityEmoji: Record<Task["priority"], string> = {
    low: "🟢",
    medium: "🟡",
    high: "🔴",
  };

  return (
    <div className={`task-item ${task.status === "done" ? "completed" : ""}`}>
      <button
        className="toggle-btn"
        onClick={() => onToggle(task.id)}
        aria-label={task.status === "done" ? "未完了に戻す" : "完了にする"}
      >
        {task.status === "done" ? "✅" : "⬜"}
      </button>

      <div className="task-content">
        <span className="task-title">{task.title}</span>
        <span className="task-priority">{priorityEmoji[task.priority]}</span>
      </div>

      <button
        className="delete-btn"
        onClick={() => onDelete(task.id)}
        aria-label="削除"
      >
        🗑️
      </button>
    </div>
  );
}

export { TaskItem };
```

```tsx
// features/tasks/components/TaskList.tsx

import type { Task } from "../types";
import { TaskItem } from "./TaskItem";

type TaskListProps = {
  tasks: Task[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
};

function TaskList({ tasks, onToggle, onDelete }: TaskListProps) {
  if (tasks.length === 0) {
    return <p className="empty-message">タスクがありません</p>;
  }

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

export { TaskList };
```

### 4.6 ステップ5: Container（ページ全体の組み立て）

```tsx
// features/tasks/components/TaskPage.tsx

import { useTasks } from "../hooks/useTasks";
import { useTaskFilter } from "../hooks/useTaskFilter";
import { TaskList } from "./TaskList";
import { TaskForm } from "./TaskForm";
import { TaskFilter } from "./TaskFilter";

function TaskPage() {
  const { tasks, addTask, toggleStatus, deleteTask } = useTasks();
  const { filter, filteredTasks, updateFilter } = useTaskFilter(tasks);

  return (
    <div className="task-page">
      <h1>タスク管理</h1>

      <TaskForm onSubmit={addTask} />

      <TaskFilter filter={filter} onFilterChange={updateFilter} />

      <p className="task-count">
        {filteredTasks.length} / {tasks.length} 件
      </p>

      <TaskList
        tasks={filteredTasks}
        onToggle={toggleStatus}
        onDelete={deleteTask}
      />
    </div>
  );
}

export { TaskPage };
```

**この設計のポイントを整理:**

| レイヤー | ファイル | 責務 | パターン |
|---------|---------|------|---------|
| 型定義 | `types.ts` | データの構造を定義 | TypeScript, Discriminated Union |
| ロジック | `useTasks.ts` | CRUD 操作 | Headless (カスタムフック) |
| ロジック | `useTaskFilter.ts` | フィルタリング | Headless + Generics |
| 見た目 | `TaskItem.tsx` | 個々のタスク表示 | Presentational |
| 見た目 | `TaskList.tsx` | タスク一覧表示 | Presentational |
| 組立 | `TaskPage.tsx` | 全体の接続 | Container |

### 4.7 ステップ6: バレルエクスポート

```tsx
// features/tasks/index.ts

// 外部に公開するもの
export { TaskPage } from "./components/TaskPage";
export { useTasks } from "./hooks/useTasks";
export type { Task, TaskPriority, TaskStatus, CreateTaskInput } from "./types";

// TaskItem, TaskList, TaskFilter, useTaskFilter は公開しない
// → これらは TaskPage の内部実装の詳細
```

**使う側（App.tsx）:**

```tsx
// App.tsx
import { TaskPage } from "./features/tasks";

function App() {
  return (
    <div className="app">
      <TaskPage />
    </div>
  );
}
```

1行のインポートだけでタスク管理機能が使えます。内部の構造は一切知らなくてOKです。

---

## 5. 設計判断のチェックリスト

新しいコンポーネントやファイルを追加する時に、以下を自問してください。

### コンポーネント設計

- [ ] **型を先に定義したか？** → コードの前に型を考える
- [ ] **ロジックとUIは分離されているか？** → Container/Presentational or カスタムフック
- [ ] **Props は適切か？** → 多すぎたら Compound Components を検討
- [ ] **Generics が使えるか？** → 複数のデータ型で再利用できるなら Generics

### ファイル配置

- [ ] **feature 固有か、共有か？** → 1機能でしか使わないなら `features/`
- [ ] **バレルエクスポートを更新したか？** → 公開するものだけを export
- [ ] **循環参照はないか？** → feature 間は直接参照しない

### 型設計

- [ ] **`any` を使っていないか？** → Generics や unknown を検討
- [ ] **矛盾した状態が表現できてしまわないか？** → Discriminated Union を検討
- [ ] **ユーティリティ型で簡潔に書けないか？** → `Partial`, `Pick`, `Omit` を活用

---

## 6. STEP07 全体のまとめ

5セッションを通じて学んだことを振り返ります。

| Session | 学んだこと | 核心 |
|---------|-----------|------|
| Session 1 | TypeScript × React 基礎 | Props, State, Event に型を付ける |
| Session 2 | 設計パターン基本 | 「考える部分」と「見せる部分」を分ける |
| Session 3 | 高度なパターン | カスタムフック（Headless）で機能を再利用する |
| Session 4 | Generics | 「使う時に型が決まる」汎用コンポーネント |
| Session 5 | プロダクション設計 | 機能で分ける、バレルエクスポート、型ファーストで設計 |

### 実務で特に重要な3原則

1. **型ファースト**: コンポーネントを書く前に、必ず型を設計する
2. **関心の分離**: ロジック（カスタムフック）とUI（Presentational）を分ける
3. **機能で整理**: フォルダは技術ではなく機能（Feature）で分ける

---

## 7. 練習問題

### 課題: ブックマーク管理機能を設計・実装する

以下の要件で、`features/bookmarks/` フォルダ一式を設計してください。

**要件:**
- ブックマークの追加（URL, タイトル, タグ）
- ブックマーク一覧の表示
- タグでフィルター
- ブックマークの削除

**やること:**
1. `types.ts` を設計する（型ファースト！）
2. `useBookmarks.ts`（CRUD フック）を実装する
3. `BookmarkItem.tsx`（Presentational）を実装する
4. `BookmarkPage.tsx`（Container）を実装する
5. `index.ts`（バレルエクスポート）を書く

**追加チャレンジ:**
- 汎用 `List<T>` コンポーネント（Session 4）を使って一覧を表示する
- `useForm<T>` フック（Session 3）を使って入力フォームを作る

---

## 8. セルフチェック

1. 「技術で分ける」と「機能で分ける」の違いは何か？なぜ機能で分けるのが良いか？
2. バレルエクスポート（`index.ts`）の役割は何か？
3. `features/` と `shared/` の使い分けの基準は？
4. 新しいファイルを追加する時、最初にすべきことは何か？（ヒント: 型ファースト）
5. 5セッションで学んだパターンのうち、最も実務で頻繁に使うのはどれだと思うか？

---

> **STEP07 完了！** React の基本（STEP01〜06）と設計パターン（STEP07）を習得しました。次のステップとしては、React Router でのルーティング、パフォーマンス最適化（React.memo, useCallback）、Next.js フレームワークなどが考えられます。
