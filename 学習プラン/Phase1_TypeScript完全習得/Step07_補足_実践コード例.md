# Step07 実践コード例

> 💡 **このファイルについて**: 実践プロジェクト開発の段階的な学習のためのコード例集です。

## 📋 目次
1. [Todoアプリケーションの基本実装](#todoアプリケーションの基本実装)
2. [型安全な状態管理システム](#型安全な状態管理システム)
3. [コンポーネント設計パターン](#コンポーネント設計パターン)

---

## Todoアプリケーションの基本実装

### ステップ1: 基本的な型定義
```typescript
// types/todo.ts
export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type FilterType = 'all' | 'active' | 'completed';

export interface AppState {
  todos: Todo[];
  filter: FilterType;
  isLoading: boolean;
  error: string | null;
}
```

### ステップ2: Todoクラスの実装
```typescript
// models/Todo.ts
export class TodoModel implements Todo {
  public readonly id: string;
  public title: string;
  public completed: boolean;
  public readonly createdAt: Date;
  public updatedAt: Date;

  constructor(title: string, id?: string) {
    this.id = id || this.generateId();
    this.title = title.trim();
    this.completed = false;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  toggle(): void {
    this.completed = !this.completed;
    this.updatedAt = new Date();
  }

  updateTitle(newTitle: string): void {
    if (!newTitle.trim()) {
      throw new Error('Title cannot be empty');
    }
    this.title = newTitle.trim();
    this.updatedAt = new Date();
  }

  private generateId(): string {
    return `todo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
```

---

## 型安全な状態管理システム

### ステップ3: アクション定義
```typescript
// store/actions.ts
export type TodoAction = 
  | { type: 'ADD_TODO'; payload: { title: string } }
  | { type: 'TOGGLE_TODO'; payload: { id: string } }
  | { type: 'DELETE_TODO'; payload: { id: string } }
  | { type: 'UPDATE_TODO'; payload: { id: string; title: string } }
  | { type: 'SET_FILTER'; payload: { filter: FilterType } }
  | { type: 'SET_LOADING'; payload: { isLoading: boolean } }
  | { type: 'SET_ERROR'; payload: { error: string | null } };

export const todoActions = {
  addTodo: (title: string): TodoAction => ({
    type: 'ADD_TODO',
    payload: { title }
  }),
  
  toggleTodo: (id: string): TodoAction => ({
    type: 'TOGGLE_TODO',
    payload: { id }
  }),
  
  deleteTodo: (id: string): TodoAction => ({
    type: 'DELETE_TODO',
    payload: { id }
  }),
  
  updateTodo: (id: string, title: string): TodoAction => ({
    type: 'UPDATE_TODO',
    payload: { id, title }
  }),
  
  setFilter: (filter: FilterType): TodoAction => ({
    type: 'SET_FILTER',
    payload: { filter }
  })
};
```

### ステップ4: リデューサー実装
```typescript
// store/reducer.ts
export function todoReducer(state: AppState, action: TodoAction): AppState {
  switch (action.type) {
    case 'ADD_TODO':
      const newTodo = new TodoModel(action.payload.title);
      return {
        ...state,
        todos: [...state.todos, newTodo],
        error: null
      };

    case 'TOGGLE_TODO':
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.payload.id
            ? { ...todo, completed: !todo.completed, updatedAt: new Date() }
            : todo
        )
      };

    case 'DELETE_TODO':
      return {
        ...state,
        todos: state.todos.filter(todo => todo.id !== action.payload.id)
      };

    case 'UPDATE_TODO':
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.payload.id
            ? { ...todo, title: action.payload.title, updatedAt: new Date() }
            : todo
        )
      };

    case 'SET_FILTER':
      return {
        ...state,
        filter: action.payload.filter
      };

    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload.isLoading
      };

    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload.error,
        isLoading: false
      };

    default:
      return state;
  }
}
```

---

## コンポーネント設計パターン

### ステップ5: ベースコンポーネント
```typescript
// components/BaseComponent.ts
export abstract class BaseComponent<TProps = {}> {
  protected element: HTMLElement;
  protected props: TProps;

  constructor(props: TProps) {
    this.props = props;
    this.element = this.createElement();
    this.bindEvents();
  }

  protected abstract createElement(): HTMLElement;
  protected abstract bindEvents(): void;

  public render(): HTMLElement {
    return this.element;
  }

  public updateProps(newProps: Partial<TProps>): void {
    this.props = { ...this.props, ...newProps };
    this.update();
  }

  protected abstract update(): void;

  public destroy(): void {
    this.element.remove();
  }
}
```

### ステップ6: Todoアイテムコンポーネント
```typescript
// components/TodoItem.ts
interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, title: string) => void;
}

export class TodoItem extends BaseComponent<TodoItemProps> {
  private isEditing = false;

  protected createElement(): HTMLElement {
    const li = document.createElement('li');
    li.className = 'todo-item';
    li.innerHTML = this.getTemplate();
    return li;
  }

  private getTemplate(): string {
    const { todo } = this.props;
    return `
      <div class="todo-content ${todo.completed ? 'completed' : ''}">
        <input type="checkbox" class="todo-toggle" ${todo.completed ? 'checked' : ''}>
        <span class="todo-title">${this.escapeHtml(todo.title)}</span>
        <input type="text" class="todo-edit" value="${this.escapeHtml(todo.title)}" style="display: none;">
        <button class="todo-delete">削除</button>
      </div>
    `;
  }

  protected bindEvents(): void {
    const toggle = this.element.querySelector('.todo-toggle') as HTMLInputElement;
    const title = this.element.querySelector('.todo-title') as HTMLSpanElement;
    const edit = this.element.querySelector('.todo-edit') as HTMLInputElement;
    const deleteBtn = this.element.querySelector('.todo-delete') as HTMLButtonElement;

    toggle.addEventListener('change', () => {
      this.props.onToggle(this.props.todo.id);
    });

    title.addEventListener('dblclick', () => {
      this.startEditing();
    });

    edit.addEventListener('blur', () => {
      this.finishEditing();
    });

    edit.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        this.finishEditing();
      } else if (e.key === 'Escape') {
        this.cancelEditing();
      }
    });

    deleteBtn.addEventListener('click', () => {
      this.props.onDelete(this.props.todo.id);
    });
  }

  private startEditing(): void {
    this.isEditing = true;
    const title = this.element.querySelector('.todo-title') as HTMLSpanElement;
    const edit = this.element.querySelector('.todo-edit') as HTMLInputElement;
    
    title.style.display = 'none';
    edit.style.display = 'inline';
    edit.focus();
    edit.select();
  }

  private finishEditing(): void {
    if (!this.isEditing) return;
    
    const edit = this.element.querySelector('.todo-edit') as HTMLInputElement;
    const newTitle = edit.value.trim();
    
    if (newTitle && newTitle !== this.props.todo.title) {
      this.props.onUpdate(this.props.todo.id, newTitle);
    }
    
    this.cancelEditing();
  }

  private cancelEditing(): void {
    this.isEditing = false;
    const title = this.element.querySelector('.todo-title') as HTMLSpanElement;
    const edit = this.element.querySelector('.todo-edit') as HTMLInputElement;
    
    title.style.display = 'inline';
    edit.style.display = 'none';
    edit.value = this.props.todo.title;
  }

  protected update(): void {
    this.element.innerHTML = this.getTemplate();
    this.bindEvents();
  }

  private escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}
```

### ステップ7: アプリケーションコントローラー
```typescript
// App.ts
export class TodoApp {
  private state: AppState;
  private container: HTMLElement;
  private components: Map<string, BaseComponent> = new Map();

  constructor(container: HTMLElement) {
    this.container = container;
    this.state = this.getInitialState();
    this.init();
  }

  private getInitialState(): AppState {
    return {
      todos: [],
      filter: 'all',
      isLoading: false,
      error: null
    };
  }

  private init(): void {
    this.render();
    this.loadTodos();
  }

  private dispatch(action: TodoAction): void {
    this.state = todoReducer(this.state, action);
    this.render();
  }

  private render(): void {
    this.container.innerHTML = `
      <div class="todo-app">
        <header class="todo-header">
          <h1>Todo App</h1>
          <input type="text" class="todo-input" placeholder="新しいタスクを入力...">
        </header>
        <main class="todo-main">
          <ul class="todo-list"></ul>
        </main>
        <footer class="todo-footer">
          <div class="todo-filters">
            <button class="filter-btn ${this.state.filter === 'all' ? 'active' : ''}" data-filter="all">すべて</button>
            <button class="filter-btn ${this.state.filter === 'active' ? 'active' : ''}" data-filter="active">未完了</button>
            <button class="filter-btn ${this.state.filter === 'completed' ? 'active' : ''}" data-filter="completed">完了済み</button>
          </div>
          <div class="todo-stats">
            残り: ${this.getActiveTodoCount()}件
          </div>
        </footer>
      </div>
    `;

    this.bindEvents();
    this.renderTodos();
  }

  private bindEvents(): void {
    const input = this.container.querySelector('.todo-input') as HTMLInputElement;
    const filterBtns = this.container.querySelectorAll('.filter-btn');

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const title = input.value.trim();
        if (title) {
          this.dispatch(todoActions.addTodo(title));
          input.value = '';
        }
      }
    });

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const filter = btn.getAttribute('data-filter') as FilterType;
        this.dispatch(todoActions.setFilter(filter));
      });
    });
  }

  private renderTodos(): void {
    const todoList = this.container.querySelector('.todo-list') as HTMLUListElement;
    todoList.innerHTML = '';

    const filteredTodos = this.getFilteredTodos();
    
    filteredTodos.forEach(todo => {
      const todoItem = new TodoItem({
        todo,
        onToggle: (id) => this.dispatch(todoActions.toggleTodo(id)),
        onDelete: (id) => this.dispatch(todoActions.deleteTodo(id)),
        onUpdate: (id, title) => this.dispatch(todoActions.updateTodo(id, title))
      });
      
      todoList.appendChild(todoItem.render());
    });
  }

  private getFilteredTodos(): Todo[] {
    switch (this.state.filter) {
      case 'active':
        return this.state.todos.filter(todo => !todo.completed);
      case 'completed':
        return this.state.todos.filter(todo => todo.completed);
      default:
        return this.state.todos;
    }
  }

  private getActiveTodoCount(): number {
    return this.state.todos.filter(todo => !todo.completed).length;
  }

  private async loadTodos(): Promise<void> {
    try {
      this.dispatch({ type: 'SET_LOADING', payload: { isLoading: true } });
      
      // ローカルストレージから読み込み
      const savedTodos = localStorage.getItem('todos');
      if (savedTodos) {
        const todos = JSON.parse(savedTodos);
        todos.forEach((todoData: any) => {
          this.dispatch(todoActions.addTodo(todoData.title));
        });
      }
    } catch (error) {
      this.dispatch({ 
        type: 'SET_ERROR', 
        payload: { error: 'データの読み込みに失敗しました' } 
      });
    } finally {
      this.dispatch({ type: 'SET_LOADING', payload: { isLoading: false } });
    }
  }

  private saveTodos(): void {
    localStorage.setItem('todos', JSON.stringify(this.state.todos));
  }
}

// アプリケーションの起動
document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('app');
  if (container) {
    new TodoApp(container);
  }
});
```

---

## 🎯 実行とテストの方法

### 基本的な実行方法
```bash
# TypeScriptファイルをコンパイル
npx tsc

# 開発サーバーの起動
npx live-server dist/
```

### テストの作成
```typescript
// tests/TodoModel.test.ts
describe('TodoModel', () => {
  test('should create todo with title', () => {
    const todo = new TodoModel('Test Todo');
    expect(todo.title).toBe('Test Todo');
    expect(todo.completed).toBe(false);
  });

  test('should toggle completion status', () => {
    const todo = new TodoModel('Test Todo');
    todo.toggle();
    expect(todo.completed).toBe(true);
  });
});
```

---

**📌 重要**: 実践プロジェクトでは、型安全性を保ちながら保守性の高いコードを書くことが重要です。これらのコード例を参考に、段階的に機能を実装していきましょう。