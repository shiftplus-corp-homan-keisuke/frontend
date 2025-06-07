# Session2: プロジェクト実践演習（90分）

> 💡 **対象**: Session1完了者（プロジェクト設計基礎理解済み）
> 🎯 **形式**: 講師サポート付き実践学習
> ⏰ **時間**: 90分

## 📚 関連補足資料

このセッションの学習をサポートする補足資料をご用意しています：

- 💻 **[実践コード例](./Step07_補足_実践コード例.md)** - より実践的な例とシステム実装
- 📖 **[専門用語集](./Step07_補足_専門用語集.md)** - 状態管理・コンポーネント設計などの詳細解説
- 🚨 **[トラブルシューティング](./Step07_補足_トラブルシューティング.md)** - プロジェクト実装エラーの対処法
- 🌐 **[参考リソース](./Step07_補足_参考リソース.md)** - さらなる学習のためのリソース
- 🔧 **[開発環境ガイド](./Step07_補足_開発環境ガイド.md)** - 開発効率を上げる設定

> 💡 **活用方法**: 学習中に疑問が生じた際や、より深く理解したい場合に参照してね 🐰

## 📅 セッション概要

**学習目標**:

- [ ] 型安全な状態管理システムの実装
- [ ] ビジネスロジック層の設計と実装
- [ ] コンポーネント設計パターンの実践
- [ ] イベントハンドリングの型安全な実装

**前提知識**:

- Session1の内容（プロジェクト設計基礎）
- データモデル設計の理解
- TypeScriptの高度な型機能の活用

---

## ⏰ 詳細タイムテーブル

| 時間         | 内容                     | 講師の役割           | 学習者の活動     | 成果物       |
| ------------ | ------------------------ | -------------------- | ---------------- | ------------ |
| **0-10分**   | 前回復習・今回目標       | 復習確認・目標提示   | 振り返り・質問   | 理解確認     |
| **10-50分**  | 状態管理システム実装     | 実演・個別指導       | ハンズオン・実践 | 実践コード   |
| **50-80分**  | Todoアプリ基盤構築演習   | コードレビュー・助言 | 個人開発         | システム実装 |
| **80-90分**  | 成果共有・質疑応答       | ファシリテート       | 発表・討論       | 学習成果     |

---

## 📚 学習内容

### Section 1: 状態管理システム実装

> 📚 **関連資料**: [実践コード例 - 状態管理の実用的実装](./Step07_補足_実践コード例.md#状態管理の実用的実装) | [専門用語集 - 状態管理設計](./Step07_補足_専門用語集.md#状態管理設計)

#### 🔧 TodoStore クラスの実装

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

      default:
        return state;
    }
  }

  private notifyListeners(): void {
    this.listeners.forEach((listener) => listener(this.state));
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}

// グローバルストアインスタンス
export const todoStore = new TodoStore();
```

### 練習問題 2.1: アクション実装 🔰

以下のアクション型を実装してください：

```typescript
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
  | { type: "SET_CATEGORY_FILTER"; payload: { categoryId: string | null } };

// TODO: 上記のアクション型に対応するアクションクリエーター関数を実装してください
```

### Section 2: ビジネスロジック層の実装

> 📚 **サポート資料**: [実践コード例 - ビジネスロジック完全版](./Step07_補足_実践コード例.md#ビジネスロジック完全版) | [トラブルシューティング - 状態管理エラー対処](./Step07_補足_トラブルシューティング.md#状態管理エラー対処)

#### 🎯 メイン演習: TodoService実装

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
}

export const todoService = new TodoService(todoStore);
```

### Section 3: コンポーネント設計の基礎

#### 🔧 BaseComponent クラスの実装

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

---

## 🎯 実践演習

> 📚 **実装サポート**: [実践コード例 - Todoアプリ完全版](./Step07_補足_実践コード例.md#Todoアプリ完全版) | [トラブルシューティング - デバッグガイド](./Step07_補足_トラブルシューティング.md#デバッグのコツ)

### 演習 1: TodoItemComponent実装（20分）

以下の要件に基づいて、TodoItemComponentを実装してください：

**要件**:
- BaseComponentを継承
- Todo項目の表示（タイトル、優先度、期限）
- チェックボックスによる完了状態の切り替え
- 編集・削除ボタンの実装

```typescript
interface TodoItemProps {
  todo: TodoItem;
  onToggle: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export class TodoItemComponent extends BaseComponent<TodoItemProps> {
  // TODO: 実装してください
}
```

### 演習 2: フィルタリング機能実装（20分）

TodoServiceのフィルタリング機能を拡張して、以下の機能を追加してください：

- 優先度による絞り込み
- 期限による絞り込み（今日、今週、期限切れ）
- 複数条件の組み合わせ

---

## 👨‍🏫 学習ポイント

### 🤔 よくある質問と回答

**Q: 状態管理でReducerパターンを使う理由は何ですか？**
A: 状態変更を予測可能にし、デバッグを容易にするためです。すべての状態変更が一箇所に集約され、時系列で追跡できるため、バグの原因特定が簡単になります。

**Q: コンポーネントの責任分離はどう考えるべきですか？**
A: 単一責任の原則に従い、表示ロジックとビジネスロジックを分離しましょう。コンポーネントは表示に専念し、データ操作はServiceクラスに委譲することで、保守性が向上します。

**Q: 型安全性を保ちながらDOMを操作するコツはありますか？**
A: TypeScriptの型システムを活用し、HTMLElementTagNameMapやHTMLElementEventMapを使って型安全なDOM操作を実現しましょう。また、型ガードを使って実行時の型チェックも行うことが重要です。

---

**📌 重要**: Session2では実践的なコーディングを通じてプロジェクト設計の活用を体感します。完璧を目指さず、まずは動くコードを作ることを重視しましょう。

**🌟 次回（Session3）は、プロジェクトの完成と学習の総括を行います！**