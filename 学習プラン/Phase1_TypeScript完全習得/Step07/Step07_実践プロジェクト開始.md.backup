# Step 7: 実践プロジェクト開始

> 💡 **補足資料**: 詳細な解説は以下の補足資料を見てね 🐰
>
> - 📖 [専門用語集](./Step07_補足_専門用語集.md) - プロジェクト設計・状態管理・コンポーネント設計・型安全性の重要な概念と用語の詳細解説
> - 💻 [実践コード例](./Step07_補足_実践コード例.md) - 段階的な学習用コード集
> - 🚨 [トラブルシューティング](./Step07_補足_トラブルシューティング.md) - よくあるエラーと解決方法
> - 📚 [参考リソース](./Step07_補足_参考リソース.md) - 学習に役立つリンク集
> - 📋 [補足資料](./Step07_補足資料.md) - その他の重要な補足情報

## 📅 学習期間・目標

**期間**: Step 7  
**総学習時間**: 3 時間  
**学習スタイル**: 理論 10% + 実践コード 70% + 演習 20%

### 🎯 Step 7 到達目標

- [ ] TypeScript Todo アプリケーションの完全実装
- [ ] 型安全な状態管理システムの構築
- [ ] コンポーネント設計の実践
- [ ] イベントハンドリングの型安全な実装
- [ ] 実用的な Web アプリケーションの完成

## 📚 プロジェクト概要

### 🎯 Todo アプリケーション仕様

**💡 なぜこのアーキテクチャが重要なのか**

実践プロジェクトでは、単なる機能実装ではなく、保守性・拡張性・テスタビリティを考慮したアーキテクチャ設計が重要です。型安全性がもたらす開発効率向上、バグ予防効果、チーム開発での意思疎通改善を実感できます。特に状態管理、コンポーネント設計、ビジネスロジック分離において、TypeScript の型システムは強力な設計支援ツールとなります。

**🎯 どういう場面で使うのか**

- **実際の Web アプリケーション開発**: React、Vue.js、Angular での型安全な開発
- **チーム開発**: 型定義による仕様共有と開発効率向上
- **大規模プロジェクト**: スケーラブルなアーキテクチャ設計
- **保守・運用**: 長期的な保守性を考慮した設計判断
- **テスト駆動開発**: 型安全性によるテスト効率向上

#### 1. データモデル設計の実践的価値

```typescript
// 💡 詳細解説: インターフェース設計 → Step07_補足_専門用語集.md#インターフェース設計interface-design
// 💡 詳細解説: リテラル型 → Step07_補足_専門用語集.md#リテラル型literal-types

// ドメイン駆動設計（DDD）を意識した型定義
interface TodoItem {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
  category: string;
  createdAt: Date;
  updatedAt: Date;
  dueDate?: Date;
}

interface TodoCategory {
  id: string;
  name: string;
  color: string;
  icon?: string;
}

// 実際のプロジェクトでの拡張を考慮した設計
interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface TodoItemWithUser extends TodoItem {
  assignedTo?: User;
  createdBy: User;
}

// バリデーション用の型定義
interface TodoValidationRules {
  title: {
    required: true;
    minLength: 1;
    maxLength: 100;
  };
  description: {
    maxLength: 500;
  };
  priority: {
    allowedValues: ["low", "medium", "high"];
  };
}

// API レスポンス用の型定義
interface TodoApiResponse {
  data: TodoItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  meta: {
    timestamp: Date;
    version: string;
  };
}

// エラーハンドリング用の型定義
interface TodoError {
  code: string;
  message: string;
  field?: keyof TodoItem;
  details?: Record<string, unknown>;
}

// 実際のプロジェクトでの使用を想定した型ガード
function isTodoItem(value: unknown): value is TodoItem {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as TodoItem).id === "string" &&
    typeof (value as TodoItem).title === "string" &&
    typeof (value as TodoItem).completed === "boolean" &&
    ["low", "medium", "high"].includes((value as TodoItem).priority) &&
    typeof (value as TodoItem).category === "string" &&
    (value as TodoItem).createdAt instanceof Date &&
    (value as TodoItem).updatedAt instanceof Date
  );
}

function isTodoItemArray(value: unknown): value is TodoItem[] {
  return Array.isArray(value) && value.every(isTodoItem);
}
```

**📝 設計の詳細解説**

- **ドメイン駆動設計（DDD）**: ビジネスドメインを反映した型定義により、要件と実装の乖離を防止
- **拡張性の考慮**: 将来的な機能追加（ユーザー管理、チーム機能等）を見据えた設計
- **バリデーション統合**: 型定義とバリデーションルールの一元管理
- **API 設計連携**: フロントエンド・バックエンド間の型共有による開発効率向上

**⚠️ よくある設計ミスと注意点**

```typescript
// ❌ 間違い: 型定義が不十分
interface BadTodoItem {
  id: any; // any型の使用
  title: string;
  completed: boolean;
  // 必要なプロパティが不足
}

// ❌ 間違い: 型の一貫性がない
interface InconsistentTodo {
  id: number; // 他の場所ではstring
  priority: string; // リテラル型を使わない
  createdAt: string; // Date型を使わない
}

// ✅ 正解: 一貫性のある型定義
interface ConsistentTodoItem {
  id: string; // 一貫してstring
  title: string;
  completed: boolean;
  priority: "low" | "medium" | "high"; // リテラル型で制限
  createdAt: Date; // 適切な型を使用
  updatedAt: Date;
}
```

**🚀 実際のプロジェクトでの活用例**

```typescript
// React での活用例
interface TodoProps {
  todo: TodoItem;
  onUpdate: (id: string, updates: Partial<TodoItem>) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
}

const TodoComponent: React.FC<TodoProps> = ({
  todo,
  onUpdate,
  onDelete,
  onToggle,
}) => {
  // 型安全なイベントハンドリング
  const handleTitleChange = (newTitle: string) => {
    onUpdate(todo.id, { title: newTitle, updatedAt: new Date() });
  };

  const handlePriorityChange = (newPriority: TodoItem["priority"]) => {
    onUpdate(todo.id, { priority: newPriority, updatedAt: new Date() });
  };

  return (
    <div className={`todo-item priority-${todo.priority}`}>
      <input
        type="text"
        value={todo.title}
        onChange={(e) => handleTitleChange(e.target.value)}
      />
      <select
        value={todo.priority}
        onChange={(e) =>
          handlePriorityChange(e.target.value as TodoItem["priority"])
        }
      >
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
    </div>
  );
};

// Vue.js での活用例
interface TodoComponentData {
  localTodo: TodoItem;
  isEditing: boolean;
  validationErrors: Partial<Record<keyof TodoItem, string>>;
}

// API クライアントでの活用例
class TodoApiClient {
  async getTodos(): Promise<TodoItem[]> {
    const response = await fetch("/api/todos");
    const data = await response.json();

    if (isTodoItemArray(data)) {
      return data;
    }

    throw new Error("Invalid todo data received from API");
  }

  async createTodo(
    todoData: Omit<TodoItem, "id" | "createdAt" | "updatedAt">
  ): Promise<TodoItem> {
    const response = await fetch("/api/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(todoData),
    });

    const data = await response.json();

    if (isTodoItem(data)) {
      return data;
    }

    throw new Error("Invalid todo data received from API");
  }
}
```

#### 2. 状態管理アーキテクチャの設計思想

**💡 なぜこの状態設計が重要なのか**

状態管理は Web アプリケーションの心臓部であり、適切な設計により予測可能で保守しやすいアプリケーションを構築できます。型安全な状態管理により、状態変更の追跡、デバッグの効率化、チーム開発での意思疎通改善を実現します。特に不変性（Immutability）の確保と状態の正規化により、パフォーマンスと保守性を両立できます。

```typescript
// 💡 詳細解説: 状態管理設計 → Step07_補足_専門用語集.md#状態管理設計state-management-design

// 基本的な状態定義
interface AppState {
  todos: TodoItem[];
  categories: TodoCategory[];
  filter: TodoFilter;
  sortBy: TodoSortBy;
  searchQuery: string;
  selectedCategory: string | null;
  isLoading: boolean;
  error: string | null;
}

type TodoFilter = "all" | "active" | "completed";
type TodoSortBy = "created" | "updated" | "priority" | "dueDate" | "title";

// 実際のプロジェクトでの拡張を考慮した状態設計
interface ExtendedAppState extends AppState {
  // UI 状態の管理
  ui: {
    sidebarOpen: boolean;
    theme: "light" | "dark";
    language: "en" | "ja" | "es";
    notifications: Notification[];
  };

  // ユーザー認証状態
  auth: {
    user: User | null;
    isAuthenticated: boolean;
    permissions: string[];
    sessionExpiry: Date | null;
  };

  // キャッシュ管理
  cache: {
    lastFetch: Date | null;
    invalidatedAt: Date | null;
    version: string;
  };

  // オフライン対応
  offline: {
    isOnline: boolean;
    pendingActions: TodoAction[];
    syncStatus: "idle" | "syncing" | "error";
  };
}

// 状態の正規化（大規模アプリケーション向け）
interface NormalizedAppState {
  entities: {
    todos: Record<string, TodoItem>;
    categories: Record<string, TodoCategory>;
    users: Record<string, User>;
  };

  // エンティティのID配列で関係を管理
  todoIds: string[];
  categoryIds: string[];

  // インデックス（検索・フィルタリング高速化）
  indexes: {
    todosByCategory: Record<string, string[]>;
    todosByPriority: Record<TodoItem["priority"], string[]>;
    todosByStatus: Record<"completed" | "active", string[]>;
  };

  // UI状態
  ui: AppState["ui"];
  auth: AppState["auth"];
  cache: AppState["cache"];
  offline: AppState["offline"];
}

// 状態セレクター（計算済み状態）
interface AppSelectors {
  // 基本セレクター
  getTodos: (state: AppState) => TodoItem[];
  getCategories: (state: AppState) => TodoCategory[];
  getFilter: (state: AppState) => TodoFilter;

  // 計算済みセレクター
  getFilteredTodos: (state: AppState) => TodoItem[];
  getSortedTodos: (state: AppState) => TodoItem[];
  getTodoStats: (state: AppState) => {
    total: number;
    completed: number;
    active: number;
    overdue: number;
  };

  // カテゴリ別統計
  getCategoryStats: (state: AppState) => Record<
    string,
    {
      total: number;
      completed: number;
      active: number;
    }
  >;
}

// 実際のセレクター実装例
const createAppSelectors = (): AppSelectors => ({
  getTodos: (state) => state.todos,
  getCategories: (state) => state.categories,
  getFilter: (state) => state.filter,

  getFilteredTodos: (state) => {
    const { todos, filter, selectedCategory, searchQuery } = state;

    return todos.filter((todo) => {
      // フィルター条件
      const matchesFilter =
        filter === "all" ||
        (filter === "completed" && todo.completed) ||
        (filter === "active" && !todo.completed);

      // カテゴリフィルター
      const matchesCategory =
        !selectedCategory || todo.category === selectedCategory;

      // 検索クエリ
      const matchesSearch =
        !searchQuery ||
        todo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        todo.description?.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesFilter && matchesCategory && matchesSearch;
    });
  },

  getSortedTodos: (state) => {
    const filteredTodos = createAppSelectors().getFilteredTodos(state);
    const { sortBy } = state;

    return [...filteredTodos].sort((a, b) => {
      switch (sortBy) {
        case "created":
          return b.createdAt.getTime() - a.createdAt.getTime();
        case "updated":
          return b.updatedAt.getTime() - a.updatedAt.getTime();
        case "priority":
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case "dueDate":
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return a.dueDate.getTime() - b.dueDate.getTime();
        case "title":
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });
  },

  getTodoStats: (state) => {
    const todos = state.todos;
    const now = new Date();

    return {
      total: todos.length,
      completed: todos.filter((todo) => todo.completed).length,
      active: todos.filter((todo) => !todo.completed).length,
      overdue: todos.filter(
        (todo) => todo.dueDate && todo.dueDate < now && !todo.completed
      ).length,
    };
  },

  getCategoryStats: (state) => {
    const todos = state.todos;
    const categories = state.categories;

    return categories.reduce((stats, category) => {
      const categoryTodos = todos.filter(
        (todo) => todo.category === category.id
      );

      stats[category.id] = {
        total: categoryTodos.length,
        completed: categoryTodos.filter((todo) => todo.completed).length,
        active: categoryTodos.filter((todo) => !todo.completed).length,
      };

      return stats;
    }, {} as Record<string, { total: number; completed: number; active: number }>);
  },
});
```

**📝 設計の詳細解説**

- **状態の正規化**: エンティティを ID で管理し、関係をインデックスで表現
- **セレクターパターン**: 計算済み状態の効率的な管理とメモ化
- **不変性の確保**: 状態変更時の予測可能性とデバッグ効率の向上
- **スケーラビリティ**: 大規模アプリケーションでの状態管理パターン

**⚠️ よくある設計ミスと注意点**

```typescript
// ❌ 間違い: 状態の直接変更
function badUpdateTodo(
  state: AppState,
  id: string,
  updates: Partial<TodoItem>
) {
  const todo = state.todos.find((t) => t.id === id);
  if (todo) {
    Object.assign(todo, updates); // 直接変更（危険）
  }
  return state;
}

// ❌ 間違い: 深いネストの状態構造
interface BadAppState {
  data: {
    todos: {
      items: {
        [categoryId: string]: {
          [priorityLevel: string]: TodoItem[];
        };
      };
    };
  };
}

// ✅ 正解: 不変性を保った状態更新
function goodUpdateTodo(
  state: AppState,
  id: string,
  updates: Partial<TodoItem>
): AppState {
  return {
    ...state,
    todos: state.todos.map((todo) =>
      todo.id === id ? { ...todo, ...updates, updatedAt: new Date() } : todo
    ),
  };
}

// ✅ 正解: フラットな状態構造
interface GoodAppState {
  todos: TodoItem[];
  categories: TodoCategory[];
  filter: TodoFilter;
  // フラットで管理しやすい構造
}
```

**🚀 実際のプロジェクトでの活用例**

```typescript
// Redux Toolkit での活用例
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const todoSlice = createSlice({
  name: "todos",
  initialState: {
    todos: [] as TodoItem[],
    filter: "all" as TodoFilter,
    isLoading: false,
    error: null as string | null,
  },
  reducers: {
    addTodo: (
      state,
      action: PayloadAction<Omit<TodoItem, "id" | "createdAt" | "updatedAt">>
    ) => {
      const newTodo: TodoItem = {
        ...action.payload,
        id: crypto.randomUUID(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      state.todos.push(newTodo); // Immer により不変性が保たれる
    },

    updateTodo: (
      state,
      action: PayloadAction<{ id: string; updates: Partial<TodoItem> }>
    ) => {
      const { id, updates } = action.payload;
      const todo = state.todos.find((t) => t.id === id);
      if (todo) {
        Object.assign(todo, updates, { updatedAt: new Date() });
      }
    },
  },
});

// Zustand での活用例
import { create } from "zustand";

interface TodoStore extends AppState {
  // アクション
  addTodo: (todo: Omit<TodoItem, "id" | "createdAt" | "updatedAt">) => void;
  updateTodo: (id: string, updates: Partial<TodoItem>) => void;
  deleteTodo: (id: string) => void;
  setFilter: (filter: TodoFilter) => void;

  // セレクター
  getFilteredTodos: () => TodoItem[];
  getTodoStats: () => ReturnType<AppSelectors["getTodoStats"]>;
}

const useTodoStore = create<TodoStore>((set, get) => ({
  // 初期状態
  todos: [],
  categories: [],
  filter: "all",
  sortBy: "created",
  searchQuery: "",
  selectedCategory: null,
  isLoading: false,
  error: null,

  // アクション
  addTodo: (todoData) =>
    set((state) => ({
      todos: [
        ...state.todos,
        {
          ...todoData,
          id: crypto.randomUUID(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
    })),

  updateTodo: (id, updates) =>
    set((state) => ({
      todos: state.todos.map((todo) =>
        todo.id === id ? { ...todo, ...updates, updatedAt: new Date() } : todo
      ),
    })),

  deleteTodo: (id) =>
    set((state) => ({
      todos: state.todos.filter((todo) => todo.id !== id),
    })),

  setFilter: (filter) => set({ filter }),

  // セレクター
  getFilteredTodos: () => {
    const state = get();
    return createAppSelectors().getFilteredTodos(state);
  },

  getTodoStats: () => {
    const state = get();
    return createAppSelectors().getTodoStats(state);
  },
}));
```

#### 3. アクション定義

```typescript
// 💡 詳細解説: 判別可能なユニオン → Step07_補足_専門用語集.md#判別可能なユニオンdiscriminated-unions
// 💡 詳細解説: Omit型の活用 → Step07_補足_専門用語集.md#omit型の活用omit-type-usage
type TodoAction =
  | {
      type: "ADD_TODO";
      payload: Omit<TodoItem, "id" | "createdAt" | "updatedAt">;
    }
  | { type: "UPDATE_TODO"; payload: { id: string; updates: Partial<TodoItem> } }
  | { type: "DELETE_TODO"; payload: { id: string } }
  | { type: "TOGGLE_TODO"; payload: { id: string } }
  | { type: "SET_FILTER"; payload: { filter: TodoFilter } }
  | { type: "SET_SORT"; payload: { sortBy: TodoSortBy } }
  | { type: "SET_SEARCH"; payload: { query: string } }
  | { type: "SET_CATEGORY_FILTER"; payload: { categoryId: string | null } }
  | { type: "ADD_CATEGORY"; payload: Omit<TodoCategory, "id"> }
  | {
      type: "UPDATE_CATEGORY";
      payload: { id: string; updates: Partial<TodoCategory> };
    }
  | { type: "DELETE_CATEGORY"; payload: { id: string } }
  | { type: "SET_LOADING"; payload: { isLoading: boolean } }
  | { type: "SET_ERROR"; payload: { error: string | null } };
```

### Section 1: プロジェクト基盤構築

#### 🔧 状態管理システム

##### 1. TodoStore クラスの基本構造

```typescript
// store.ts - 型安全な状態管理
class TodoStore {
  private state: AppState;
  private listeners: Array<(state: AppState) => void> = [];

  constructor() {
    this.state = {
      todos: [],
      categories: [
        { id: "1", name: "Personal", color: "#3B82F6", icon: "👤" },
        { id: "2", name: "Work", color: "#EF4444", icon: "💼" },
        { id: "3", name: "Shopping", color: "#10B981", icon: "🛒" },
      ],
      filter: "all",
      sortBy: "created",
      searchQuery: "",
      selectedCategory: null,
      isLoading: false,
      error: null,
    };
  }

  getState(): AppState {
    return { ...this.state };
  }

  dispatch(action: TodoAction): void {
    this.state = this.reducer(this.state, action);
    this.notifyListeners();
  }

  subscribe(listener: (state: AppState) => void): () => void {
    this.listeners.push(listener);
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }
}
```

##### 2. Reducer の実装

```typescript
private reducer(state: AppState, action: TodoAction): AppState {
  switch (action.type) {
    case "ADD_TODO":
      const newTodo: TodoItem = {
        ...action.payload,
        id: this.generateId(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      return {
        ...state,
        todos: [...state.todos, newTodo],
      };

    case "UPDATE_TODO":
      return {
        ...state,
        todos: state.todos.map((todo) =>
          todo.id === action.payload.id
            ? { ...todo, ...action.payload.updates, updatedAt: new Date() }
            : todo
        ),
      };

    case "DELETE_TODO":
      return {
        ...state,
        todos: state.todos.filter((todo) => todo.id !== action.payload.id),
      };

    case "TOGGLE_TODO":
      return {
        ...state,
        todos: state.todos.map((todo) =>
          todo.id === action.payload.id
            ? { ...todo, completed: !todo.completed, updatedAt: new Date() }
            : todo
        ),
      };

    case "SET_FILTER":
      return { ...state, filter: action.payload.filter };

    case "SET_SORT":
      return { ...state, sortBy: action.payload.sortBy };

    case "SET_SEARCH":
      return { ...state, searchQuery: action.payload.query };

    case "SET_CATEGORY_FILTER":
      return { ...state, selectedCategory: action.payload.categoryId };

    case "ADD_CATEGORY":
      const newCategory: TodoCategory = {
        ...action.payload,
        id: this.generateId(),
      };
      return {
        ...state,
        categories: [...state.categories, newCategory],
      };

    case "SET_LOADING":
      return { ...state, isLoading: action.payload.isLoading };

    case "SET_ERROR":
      return { ...state, error: action.payload.error };

    default:
      return state;
  }
}
```

##### 3. ヘルパーメソッドとエクスポート

```typescript
private notifyListeners(): void {
  this.listeners.forEach((listener) => listener(this.state));
}

private generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// グローバルストアインスタンス
export const todoStore = new TodoStore();
```

#### 🎯 ビジネスロジック層

##### 1. TodoService クラスの基本構造

```typescript
// services/todoService.ts - ビジネスロジック
export class TodoService {
  constructor(private store: TodoStore) {}

  // Todo操作
  addTodo(todoData: Omit<TodoItem, "id" | "createdAt" | "updatedAt">): void {
    this.store.dispatch({ type: "ADD_TODO", payload: todoData });
  }

  updateTodo(id: string, updates: Partial<TodoItem>): void {
    this.store.dispatch({ type: "UPDATE_TODO", payload: { id, updates } });
  }

  deleteTodo(id: string): void {
    this.store.dispatch({ type: "DELETE_TODO", payload: { id } });
  }

  toggleTodo(id: string): void {
    this.store.dispatch({ type: "TOGGLE_TODO", payload: { id } });
  }
}
```

##### 2. フィルタリング・ソート機能

```typescript
// フィルタリング・ソート
getFilteredTodos(): TodoItem[] {
  const state = this.store.getState();
  let todos = [...state.todos];

  // フィルタリング
  if (state.filter === "active") {
    todos = todos.filter((todo) => !todo.completed);
  } else if (state.filter === "completed") {
    todos = todos.filter((todo) => todo.completed);
  }

  // カテゴリフィルタ
  if (state.selectedCategory) {
    todos = todos.filter((todo) => todo.category === state.selectedCategory);
  }

  // 検索
  if (state.searchQuery) {
    const query = state.searchQuery.toLowerCase();
    todos = todos.filter(
      (todo) =>
        todo.title.toLowerCase().includes(query) ||
        (todo.description && todo.description.toLowerCase().includes(query))
    );
  }

  // ソート
  todos.sort((a, b) => {
    switch (state.sortBy) {
      case "title":
        return a.title.localeCompare(b.title);
      case "priority":
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      case "dueDate":
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return a.dueDate.getTime() - b.dueDate.getTime();
      case "updated":
        return b.updatedAt.getTime() - a.updatedAt.getTime();
      case "created":
      default:
        return b.createdAt.getTime() - a.createdAt.getTime();
    }
  });

  return todos;
}
```

##### 3. 統計情報とその他の機能

```typescript
// 統計情報
getStats(): {
  total: number;
  completed: number;
  active: number;
  overdue: number;
} {
  const todos = this.store.getState().todos;
  const now = new Date();

  return {
    total: todos.length,
    completed: todos.filter((todo) => todo.completed).length,
    active: todos.filter((todo) => !todo.completed).length,
    overdue: todos.filter(
      (todo) => !todo.completed && todo.dueDate && todo.dueDate < now
    ).length,
  };
}

// カテゴリ操作
addCategory(categoryData: Omit<TodoCategory, "id">): void {
  this.store.dispatch({ type: "ADD_CATEGORY", payload: categoryData });
}

// 検索・フィルタ操作
setFilter(filter: TodoFilter): void {
  this.store.dispatch({ type: "SET_FILTER", payload: { filter } });
}

setSort(sortBy: TodoSortBy): void {
  this.store.dispatch({ type: "SET_SORT", payload: { sortBy } });
}

setSearch(query: string): void {
  this.store.dispatch({ type: "SET_SEARCH", payload: { query } });
}

setCategoryFilter(categoryId: string | null): void {
  this.store.dispatch({
    type: "SET_CATEGORY_FILTER",
    payload: { categoryId },
  });
}

export const todoService = new TodoService(todoStore);
```

> 💡 **詳細解説**: より実践的なコード例は [Step07\_補足\_実践コード例.md](./Step07_補足_実践コード例.md) で確認できるよ 🐰

### Section2 : UI コンポーネント実装

#### 🔧 型安全な DOM 操作

##### 1. BaseComponent クラスの基本構造

```typescript
// components/BaseComponent.ts - 基底コンポーネント
export abstract class BaseComponent<TProps = {}> {
  protected element: HTMLElement;
  protected props: TProps;

  constructor(tagName: string, props: TProps = {} as TProps) {
    this.element = document.createElement(tagName);
    this.props = props;
    this.init();
  }

  protected abstract init(): void;
  protected abstract render(): void;

  protected createElement<K extends keyof HTMLElementTagNameMap>(
    tagName: K,
    attributes: Partial<HTMLElementTagNameMap[K]> = {},
    textContent?: string
  ): HTMLElementTagNameMap[K] {
    const element = document.createElement(tagName);

    Object.assign(element, attributes);

    if (textContent) {
      element.textContent = textContent;
    }

    return element;
  }

  protected addEventListeners<K extends keyof HTMLElementEventMap>(
    element: HTMLElement,
    events: Partial<Record<K, (event: HTMLElementEventMap[K]) => void>>
  ): void {
    Object.entries(events).forEach(([eventType, handler]) => {
      element.addEventListener(eventType, handler as EventListener);
    });
  }

  mount(parent: HTMLElement): void {
    parent.appendChild(this.element);
  }

  unmount(): void {
    if (this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
  }

  updateProps(newProps: Partial<TProps>): void {
    this.props = { ...this.props, ...newProps };
    this.render();
  }
}
```

##### 2. TodoItemComponent の型定義

```typescript
// components/TodoItem.ts - Todo項目コンポーネント
interface TodoItemProps {
  todo: TodoItem;
  onToggle: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export class TodoItemComponent extends BaseComponent<TodoItemProps> {
  private checkbox!: HTMLInputElement;
  private titleElement!: HTMLElement;
  private editButton!: HTMLButtonElement;
  private deleteButton!: HTMLButtonElement;

  protected init(): void {
    this.element.className = "todo-item";
    this.render();
  }
}
```

##### 3. TodoItemComponent のレンダリング実装

```typescript
protected render(): void {
  const { todo } = this.props;

  this.element.innerHTML = "";
  this.element.className = `todo-item ${
    todo.completed ? "completed" : ""
  } priority-${todo.priority}`;

  // チェックボックス
  this.checkbox = this.createElement("input", {
    type: "checkbox",
    checked: todo.completed,
    className: "todo-checkbox",
  });

  // タイトル
  this.titleElement = this.createElement(
    "span",
    {
      className: "todo-title",
    },
    todo.title
  );

  // 優先度インジケータ
  const priorityElement = this.createElement(
    "span",
    {
      className: `priority-indicator priority-${todo.priority}`,
    },
    todo.priority.toUpperCase()
  );

  // 期限表示
  const dueDateElement = this.createElement("span", {
    className: "due-date",
  });

  if (todo.dueDate) {
    const isOverdue = !todo.completed && todo.dueDate < new Date();
    dueDateElement.textContent = todo.dueDate.toLocaleDateString();
    dueDateElement.className += isOverdue ? " overdue" : "";
  }

  // アクションボタン
  this.editButton = this.createElement("button", {
    className: "btn btn-edit",
    textContent: "編集",
  });

  this.deleteButton = this.createElement("button", {
    className: "btn btn-delete",
    textContent: "削除",
  });

  // イベントリスナー
  this.addEventListeners(this.checkbox, {
    change: () => this.props.onToggle(todo.id),
  });

  this.addEventListeners(this.editButton, {
    click: () => this.props.onEdit(todo.id),
  });

  this.addEventListeners(this.deleteButton, {
    click: () => this.props.onDelete(todo.id),
  });

  // 要素の組み立て
  const contentDiv = this.createElement("div", { className: "todo-content" });
  contentDiv.appendChild(this.checkbox);
  contentDiv.appendChild(this.titleElement);
  contentDiv.appendChild(priorityElement);
  contentDiv.appendChild(dueDateElement);

  const actionsDiv = this.createElement("div", { className: "todo-actions" });
  actionsDiv.appendChild(this.editButton);
  actionsDiv.appendChild(this.deleteButton);

  this.element.appendChild(contentDiv);
  this.element.appendChild(actionsDiv);
}
```

### Section3 : アプリケーション統合

#### 🔧 メインアプリケーション

##### 1. TodoApp クラスの基本構造

```typescript
// app.ts - メインアプリケーション
export class TodoApp {
  private container: HTMLElement;
  private todoService: TodoService;
  private components: Map<string, BaseComponent> = new Map();

  constructor(containerId: string) {
    const container = document.getElementById(containerId);
    if (!container) {
      throw new Error(`Container with id "${containerId}" not found`);
    }
    this.container = container;
    this.todoService = todoService;
    this.init();
  }

  private init(): void {
    this.setupHTML();
    this.setupEventListeners();
    this.subscribeToStore();
    this.render();
  }
}
```

##### 2. HTML セットアップとイベントリスナー

```typescript
private setupHTML(): void {
  this.container.innerHTML = `
    <div class="todo-app">
      <header class="app-header">
        <h1>TypeScript Todo App</h1>
        <div class="stats" id="stats"></div>
      </header>

      <div class="app-controls">
        <input type="text" id="search" placeholder="検索..." />
        <select id="filter">
          <option value="all">すべて</option>
          <option value="active">未完了</option>
          <option value="completed">完了済み</option>
        </select>
        <select id="sort">
          <option value="created">作成日順</option>
          <option value="updated">更新日順</option>
          <option value="priority">優先度順</option>
          <option value="dueDate">期限順</option>
          <option value="title">タイトル順</option>
        </select>
      </div>

      <div class="add-todo-form">
        <input type="text" id="new-todo-title" placeholder="新しいタスク..." />
        <select id="new-todo-priority">
          <option value="low">低</option>
          <option value="medium">中</option>
          <option value="high">高</option>
        </select>
        <select id="new-todo-category">
          <!-- カテゴリは動的に生成 -->
        </select>
        <input type="date" id="new-todo-due" />
        <button id="add-todo-btn">追加</button>
      </div>

      <div class="todo-list" id="todo-list"></div>
    </div>
  `;
}

private setupEventListeners(): void {
  // 検索
  const searchInput = document.getElementById("search") as HTMLInputElement;
  searchInput.addEventListener("input", (e) => {
    const target = e.target as HTMLInputElement;
    this.todoService.setSearch(target.value);
  });

  // フィルタ
  const filterSelect = document.getElementById("filter") as HTMLSelectElement;
  filterSelect.addEventListener("change", (e) => {
    const target = e.target as HTMLSelectElement;
    this.todoService.setFilter(target.value as TodoFilter);
  });

  // ソート
  const sortSelect = document.getElementById("sort") as HTMLSelectElement;
  sortSelect.addEventListener("change", (e) => {
    const target = e.target as HTMLSelectElement;
    this.todoService.setSort(target.value as TodoSortBy);
  });

  // 新しいTodo追加
  const addButton = document.getElementById(
    "add-todo-btn"
  ) as HTMLButtonElement;
  addButton.addEventListener("click", () => this.handleAddTodo());

  // Enterキーでの追加
  const titleInput = document.getElementById(
    "new-todo-title"
  ) as HTMLInputElement;
  titleInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      this.handleAddTodo();
    }
  });
}
```

##### 3. Todo 操作とレンダリング

```typescript
private handleAddTodo(): void {
  const titleInput = document.getElementById(
    "new-todo-title"
  ) as HTMLInputElement;
  const prioritySelect = document.getElementById(
    "new-todo-priority"
  ) as HTMLSelectElement;
  const categorySelect = document.getElementById(
    "new-todo-category"
  ) as HTMLSelectElement;
  const dueInput = document.getElementById(
    "new-todo-due"
  ) as HTMLInputElement;

  const title = titleInput.value.trim();
  if (!title) return;

  const todoData: Omit<TodoItem, "id" | "createdAt" | "updatedAt"> = {
    title,
    completed: false,
    priority: prioritySelect.value as "low" | "medium" | "high",
    category: categorySelect.value,
    dueDate: dueInput.value ? new Date(dueInput.value) : undefined,
  };

  this.todoService.addTodo(todoData);

  // フォームリセット
  titleInput.value = "";
  dueInput.value = "";
}

private subscribeToStore(): void {
  todoStore.subscribe(() => {
    this.render();
  });
}

private render(): void {
  this.renderStats();
  this.renderCategories();
  this.renderTodoList();
}

private renderStats(): void {
  const stats = this.todoService.getStats();
  const statsElement = document.getElementById("stats");
  if (statsElement) {
    statsElement.innerHTML = `
      <span>総数: ${stats.total}</span>
      <span>完了: ${stats.completed}</span>
      <span>未完了: ${stats.active}</span>
      <span class="overdue">期限切れ: ${stats.overdue}</span>
    `;
  }
}

private renderCategories(): void {
  const categorySelect = document.getElementById(
    "new-todo-category"
  ) as HTMLSelectElement;
  const categories = todoStore.getState().categories;

  categorySelect.innerHTML = categories
    .map(
      (cat) => `<option value="${cat.id}">${cat.icon} ${cat.name}</option>`
    )
    .join("");
}

private renderTodoList(): void {
  const todoListElement = document.getElementById("todo-list");
  if (!todoListElement) return;

  // 既存のコンポーネントをクリア
  this.components.forEach((component) => component.unmount());
  this.components.clear();
  todoListElement.innerHTML = "";

  const todos = this.todoService.getFilteredTodos();

  todos.forEach((todo) => {
    const todoComponent = new TodoItemComponent({
      todo,
      onToggle: (id) => this.todoService.toggleTodo(id),
      onEdit: (id) => this.handleEditTodo(id),
      onDelete: (id) => this.todoService.deleteTodo(id),
    });

    todoComponent.mount(todoListElement);
    this.components.set(todo.id, todoComponent);
  });
}

private handleEditTodo(id: string): void {
  // 編集機能の実装（簡略化）
  const newTitle = prompt("新しいタイトルを入力してください:");
  if (newTitle && newTitle.trim()) {
    this.todoService.updateTodo(id, { title: newTitle.trim() });
  }
}

// アプリケーション起動
document.addEventListener("DOMContentLoaded", () => {
  new TodoApp("app");
});
```

> 💡 **詳細解説**: 実装中に問題が発生した場合は [Step07\_補足\_トラブルシューティング.md](./Step07_補足_トラブルシューティング.md) を参考にしてね 🐰

## 📊 Step 7 評価基準

> 💡 **詳細解説**: 学習の進め方とトラブルシューティングは [Step07\_補足\_参考リソース.md](./Step07_補足_参考リソース.md) にもまとめてあるよ 🐰

### 理解度チェックリスト

#### プロジェクト設計 (25%)

- [ ] 適切なデータモデルを設計できる
- [ ] 型安全な状態管理を実装できる
- [ ] コンポーネント設計を理解している
- [ ] アーキテクチャパターンを適用できる

#### TypeScript 活用 (30%)

- [ ] 高度な型定義を実装できる
- [ ] ジェネリクスを実践的に活用できる
- [ ] ユーティリティ型を適切に使用できる
- [ ] 型安全なイベントハンドリングを実装できる

#### 実装品質 (25%)

- [ ] クリーンなコード構造を維持できる
- [ ] エラーハンドリングを適切に実装できる
- [ ] パフォーマンスを考慮した実装ができる
- [ ] 保守性の高いコードを書ける

#### 機能完成度 (20%)

- [ ] 基本的な CRUD 操作を実装できる
- [ ] フィルタリング・ソート機能を実装できる
- [ ] ユーザビリティを考慮した設計ができる
- [ ] 実用的なアプリケーションを完成できる

### 成果物

> 📝 **実践課題**: Step 7 の学習内容を実際のコードで実践してみましょう！
>
> **[📋 Step07 成果物：Todoアプリケーション管理システム](./Step07_成果物.md)**
>
> 既存のJavaScriptコードにTypeScriptの型安全な状態管理、コンポーネント設計、イベントハンドリングを追加する実践的な課題です。Step 7 で学習した知識を統合して、実用的なWebアプリケーションを構築しましょう。

## 🔄 Step 8 への準備

> 💡 **詳細解説**: 次のステップでの学習内容について [Step08\_ライブラリ統合と型定義.md](./Step08_ライブラリ統合と型定義.md) の概要を先に確認しておくとスムーズに学習を進められるよ 🐰

### 次週学習内容の予習

```typescript
// Step 8で学習するライブラリ統合の基礎概念
// 以下のコードを読んで理解しておくこと

// 1. 外部ライブラリの型定義
declare module "some-library" {
  export function someFunction(param: string): number;
}

// 2. d.ts ファイルの基本
interface Window {
  customProperty: string;
}

// 3. DefinitelyTyped の活用
// npm install @types/lodash
import _ from "lodash";
```

---

**📌 重要**: Step 7 は今まで学んだ TypeScript の知識を統合して実践的なアプリケーションを構築する重要な週です。型安全性を保ちながら実用的な機能を実装することで、TypeScript の真の価値を実感できます。

**🌟 次週は、外部ライブラリとの統合と型定義について学習します！**
