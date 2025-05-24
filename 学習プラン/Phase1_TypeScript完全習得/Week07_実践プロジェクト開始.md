# Week 7: 実践プロジェクト開始

## 📅 学習期間・目標

**期間**: Week 7（7日間）  
**総学習時間**: 12時間（平日1.5時間、週末3時間）  
**学習スタイル**: 理論10% + 実践コード70% + 演習20%

### 🎯 Week 7 到達目標

- [ ] TypeScript Todo アプリケーションの完全実装
- [ ] 型安全な状態管理システムの構築
- [ ] コンポーネント設計の実践
- [ ] イベントハンドリングの型安全な実装
- [ ] 実用的なWebアプリケーションの完成

## 📚 プロジェクト概要

### 🎯 Todo アプリケーション仕様

```typescript
// 1. データモデル定義
interface TodoItem {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
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

// 2. アプリケーション状態
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

type TodoFilter = 'all' | 'active' | 'completed';
type TodoSortBy = 'created' | 'updated' | 'priority' | 'dueDate' | 'title';

// 3. アクション定義
type TodoAction = 
  | { type: 'ADD_TODO'; payload: Omit<TodoItem, 'id' | 'createdAt' | 'updatedAt'> }
  | { type: 'UPDATE_TODO'; payload: { id: string; updates: Partial<TodoItem> } }
  | { type: 'DELETE_TODO'; payload: { id: string } }
  | { type: 'TOGGLE_TODO'; payload: { id: string } }
  | { type: 'SET_FILTER'; payload: { filter: TodoFilter } }
  | { type: 'SET_SORT'; payload: { sortBy: TodoSortBy } }
  | { type: 'SET_SEARCH'; payload: { query: string } }
  | { type: 'SET_CATEGORY_FILTER'; payload: { categoryId: string | null } }
  | { type: 'ADD_CATEGORY'; payload: Omit<TodoCategory, 'id'> }
  | { type: 'UPDATE_CATEGORY'; payload: { id: string; updates: Partial<TodoCategory> } }
  | { type: 'DELETE_CATEGORY'; payload: { id: string } }
  | { type: 'SET_LOADING'; payload: { isLoading: boolean } }
  | { type: 'SET_ERROR'; payload: { error: string | null } };
```

### Day 1-2: プロジェクト基盤構築

#### 🔧 状態管理システム

```typescript
// store.ts - 型安全な状態管理
class TodoStore {
  private state: AppState;
  private listeners: Array<(state: AppState) => void> = [];

  constructor() {
    this.state = {
      todos: [],
      categories: [
        { id: '1', name: 'Personal', color: '#3B82F6', icon: '👤' },
        { id: '2', name: 'Work', color: '#EF4444', icon: '💼' },
        { id: '3', name: 'Shopping', color: '#10B981', icon: '🛒' },
      ],
      filter: 'all',
      sortBy: 'created',
      searchQuery: '',
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
      case 'ADD_TODO':
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

      case 'UPDATE_TODO':
        return {
          ...state,
          todos: state.todos.map(todo =>
            todo.id === action.payload.id
              ? { ...todo, ...action.payload.updates, updatedAt: new Date() }
              : todo
          ),
        };

      case 'DELETE_TODO':
        return {
          ...state,
          todos: state.todos.filter(todo => todo.id !== action.payload.id),
        };

      case 'TOGGLE_TODO':
        return {
          ...state,
          todos: state.todos.map(todo =>
            todo.id === action.payload.id
              ? { ...todo, completed: !todo.completed, updatedAt: new Date() }
              : todo
          ),
        };

      case 'SET_FILTER':
        return { ...state, filter: action.payload.filter };

      case 'SET_SORT':
        return { ...state, sortBy: action.payload.sortBy };

      case 'SET_SEARCH':
        return { ...state, searchQuery: action.payload.query };

      case 'SET_CATEGORY_FILTER':
        return { ...state, selectedCategory: action.payload.categoryId };

      case 'ADD_CATEGORY':
        const newCategory: TodoCategory = {
          ...action.payload,
          id: this.generateId(),
        };
        return {
          ...state,
          categories: [...state.categories, newCategory],
        };

      case 'SET_LOADING':
        return { ...state, isLoading: action.payload.isLoading };

      case 'SET_ERROR':
        return { ...state, error: action.payload.error };

      default:
        return state;
    }
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.state));
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}

// グローバルストアインスタンス
export const todoStore = new TodoStore();
```

#### 🎯 ビジネスロジック層

```typescript
// services/todoService.ts - ビジネスロジック
export class TodoService {
  constructor(private store: TodoStore) {}

  // Todo操作
  addTodo(todoData: Omit<TodoItem, 'id' | 'createdAt' | 'updatedAt'>): void {
    this.store.dispatch({ type: 'ADD_TODO', payload: todoData });
  }

  updateTodo(id: string, updates: Partial<TodoItem>): void {
    this.store.dispatch({ type: 'UPDATE_TODO', payload: { id, updates } });
  }

  deleteTodo(id: string): void {
    this.store.dispatch({ type: 'DELETE_TODO', payload: { id } });
  }

  toggleTodo(id: string): void {
    this.store.dispatch({ type: 'TOGGLE_TODO', payload: { id } });
  }

  // フィルタリング・ソート
  getFilteredTodos(): TodoItem[] {
    const state = this.store.getState();
    let todos = [...state.todos];

    // フィルタリング
    if (state.filter === 'active') {
      todos = todos.filter(todo => !todo.completed);
    } else if (state.filter === 'completed') {
      todos = todos.filter(todo => todo.completed);
    }

    // カテゴリフィルタ
    if (state.selectedCategory) {
      todos = todos.filter(todo => todo.category === state.selectedCategory);
    }

    // 検索
    if (state.searchQuery) {
      const query = state.searchQuery.toLowerCase();
      todos = todos.filter(todo =>
        todo.title.toLowerCase().includes(query) ||
        (todo.description && todo.description.toLowerCase().includes(query))
      );
    }

    // ソート
    todos.sort((a, b) => {
      switch (state.sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case 'dueDate':
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return a.dueDate.getTime() - b.dueDate.getTime();
        case 'updated':
          return b.updatedAt.getTime() - a.updatedAt.getTime();
        case 'created':
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
      completed: todos.filter(todo => todo.completed).length,
      active: todos.filter(todo => !todo.completed).length,
      overdue: todos.filter(todo => 
        !todo.completed && 
        todo.dueDate && 
        todo.dueDate < now
      ).length,
    };
  }

  // カテゴリ操作
  addCategory(categoryData: Omit<TodoCategory, 'id'>): void {
    this.store.dispatch({ type: 'ADD_CATEGORY', payload: categoryData });
  }

  // 検索・フィルタ操作
  setFilter(filter: TodoFilter): void {
    this.store.dispatch({ type: 'SET_FILTER', payload: { filter } });
  }

  setSort(sortBy: TodoSortBy): void {
    this.store.dispatch({ type: 'SET_SORT', payload: { sortBy } });
  }

  setSearch(query: string): void {
    this.store.dispatch({ type: 'SET_SEARCH', payload: { query } });
  }

  setCategoryFilter(categoryId: string | null): void {
    this.store.dispatch({ type: 'SET_CATEGORY_FILTER', payload: { categoryId } });
  }
}

export const todoService = new TodoService(todoStore);
```

### Day 3-5: UI コンポーネント実装

#### 🔧 型安全なDOM操作

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
    this.element.className = 'todo-item';
    this.render();
  }

  protected render(): void {
    const { todo } = this.props;
    
    this.element.innerHTML = '';
    this.element.className = `todo-item ${todo.completed ? 'completed' : ''} priority-${todo.priority}`;

    // チェックボックス
    this.checkbox = this.createElement('input', {
      type: 'checkbox',
      checked: todo.completed,
      className: 'todo-checkbox'
    });

    // タイトル
    this.titleElement = this.createElement('span', {
      className: 'todo-title'
    }, todo.title);

    // 優先度インジケータ
    const priorityElement = this.createElement('span', {
      className: `priority-indicator priority-${todo.priority}`
    }, todo.priority.toUpperCase());

    // 期限表示
    const dueDateElement = this.createElement('span', {
      className: 'due-date'
    });
    
    if (todo.dueDate) {
      const isOverdue = !todo.completed && todo.dueDate < new Date();
      dueDateElement.textContent = todo.dueDate.toLocaleDateString();
      dueDateElement.className += isOverdue ? ' overdue' : '';
    }

    // アクションボタン
    this.editButton = this.createElement('button', {
      className: 'btn btn-edit',
      textContent: '編集'
    });

    this.deleteButton = this.createElement('button', {
      className: 'btn btn-delete',
      textContent: '削除'
    });

    // イベントリスナー
    this.addEventListeners(this.checkbox, {
      change: () => this.props.onToggle(todo.id)
    });

    this.addEventListeners(this.editButton, {
      click: () => this.props.onEdit(todo.id)
    });

    this.addEventListeners(this.deleteButton, {
      click: () => this.props.onDelete(todo.id)
    });

    // 要素の組み立て
    const contentDiv = this.createElement('div', { className: 'todo-content' });
    contentDiv.appendChild(this.checkbox);
    contentDiv.appendChild(this.titleElement);
    contentDiv.appendChild(priorityElement);
    contentDiv.appendChild(dueDateElement);

    const actionsDiv = this.createElement('div', { className: 'todo-actions' });
    actionsDiv.appendChild(this.editButton);
    actionsDiv.appendChild(this.deleteButton);

    this.element.appendChild(contentDiv);
    this.element.appendChild(actionsDiv);
  }
}
```

### Day 6-7: アプリケーション統合

#### 🔧 メインアプリケーション

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
    const searchInput = document.getElementById('search') as HTMLInputElement;
    searchInput.addEventListener('input', (e) => {
      const target = e.target as HTMLInputElement;
      this.todoService.setSearch(target.value);
    });

    // フィルタ
    const filterSelect = document.getElementById('filter') as HTMLSelectElement;
    filterSelect.addEventListener('change', (e) => {
      const target = e.target as HTMLSelectElement;
      this.todoService.setFilter(target.value as TodoFilter);
    });

    // ソート
    const sortSelect = document.getElementById('sort') as HTMLSelectElement;
    sortSelect.addEventListener('change', (e) => {
      const target = e.target as HTMLSelectElement;
      this.todoService.setSort(target.value as TodoSortBy);
    });

    // 新しいTodo追加
    const addButton = document.getElementById('add-todo-btn') as HTMLButtonElement;
    addButton.addEventListener('click', () => this.handleAddTodo());

    // Enterキーでの追加
    const titleInput = document.getElementById('new-todo-title') as HTMLInputElement;
    titleInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.handleAddTodo();
      }
    });
  }

  private handleAddTodo(): void {
    const titleInput = document.getElementById('new-todo-title') as HTMLInputElement;
    const prioritySelect = document.getElementById('new-todo-priority') as HTMLSelectElement;
    const categorySelect = document.getElementById('new-todo-category') as HTMLSelectElement;
    const dueInput = document.getElementById('new-todo-due') as HTMLInputElement;

    const title = titleInput.value.trim();
    if (!title) return;

    const todoData: Omit<TodoItem, 'id' | 'createdAt' | 'updatedAt'> = {
      title,
      completed: false,
      priority: prioritySelect.value as 'low' | 'medium' | 'high',
      category: categorySelect.value,
      dueDate: dueInput.value ? new Date(dueInput.value) : undefined,
    };

    this.todoService.addTodo(todoData);

    // フォームリセット
    titleInput.value = '';
    dueInput.value = '';
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
    const statsElement = document.getElementById('stats');
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
    const categorySelect = document.getElementById('new-todo-category') as HTMLSelectElement;
    const categories = todoStore.getState().categories;
    
    categorySelect.innerHTML = categories
      .map(cat => `<option value="${cat.id}">${cat.icon} ${cat.name}</option>`)
      .join('');
  }

  private renderTodoList(): void {
    const todoListElement = document.getElementById('todo-list');
    if (!todoListElement) return;

    // 既存のコンポーネントをクリア
    this.components.forEach(component => component.unmount());
    this.components.clear();
    todoListElement.innerHTML = '';

    const todos = this.todoService.getFilteredTodos();

    todos.forEach(todo => {
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
    const newTitle = prompt('新しいタイトルを入力してください:');
    if (newTitle && newTitle.trim()) {
      this.todoService.updateTodo(id, { title: newTitle.trim() });
    }
  }
}

// アプリケーション起動
document.addEventListener('DOMContentLoaded', () => {
  new TodoApp('app');
});
```

## 📊 Week 7 評価基準

### 理解度チェックリスト

#### プロジェクト設計 (25%)
- [ ] 適切なデータモデルを設計できる
- [ ] 型安全な状態管理を実装できる
- [ ] コンポーネント設計を理解している
- [ ] アーキテクチャパターンを適用できる

#### TypeScript活用 (30%)
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
- [ ] 基本的なCRUD操作を実装できる
- [ ] フィルタリング・ソート機能を実装できる
- [ ] ユーザビリティを考慮した設計ができる
- [ ] 実用的なアプリケーションを完成できる

### 成果物チェックリスト

- [ ] **Todo アプリケーション**: 完全に動作するWebアプリ
- [ ] **型定義ファイル**: 包括的な型定義
- [ ] **コンポーネントライブラリ**: 再利用可能なコンポーネント群
- [ ] **状態管理システム**: 型安全な状態管理の実装

## 🔄 Week 8 への準備

### 次週学習内容の予習

```typescript
// Week 8で学習するライブラリ統合の基礎概念
// 以下のコードを読んで理解しておくこと

// 1. 外部ライブラリの型定義
declare module 'some-library' {
  export function someFunction(param: string): number;
}

// 2. d.ts ファイルの基本
interface Window {
  customProperty: string;
}

// 3. DefinitelyTyped の活用
// npm install @types/lodash
import _ from 'lodash';
```

---

**📌 重要**: Week 7は今まで学んだTypeScriptの知識を統合して実践的なアプリケーションを構築する重要な週です。型安全性を保ちながら実用的な機能を実装することで、TypeScriptの真の価値を実感できます。

**🌟 次週は、外部ライブラリとの統合と型定義について学習します！**