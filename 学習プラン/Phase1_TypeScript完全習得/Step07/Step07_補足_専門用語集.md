# Step07 専門用語集

> 💡 **このファイルについて**: Step07で出てくる実践プロジェクト開発関連の重要な専門用語と概念の詳細解説集です。

## 📋 目次
1. [プロジェクト設計用語](#プロジェクト設計用語)
2. [状態管理用語](#状態管理用語)
3. [コンポーネント設計用語](#コンポーネント設計用語)
4. [型安全性用語](#型安全性用語)

---

## プロジェクト設計用語

### アーキテクチャパターン（Architecture Pattern）
**定義**: アプリケーションの構造を決定する設計パターン

**主要パターン**:
- **MVC (Model-View-Controller)**: データ、表示、制御の分離
- **MVP (Model-View-Presenter)**: ビューとモデルの完全分離
- **MVVM (Model-View-ViewModel)**: データバインディング中心の設計
- **Component-Based**: コンポーネント単位での設計

### 関心の分離（Separation of Concerns）
**定義**: 異なる責任を持つコードを分離する設計原則

**実装例**:
```typescript
// データ層
interface TodoRepository {
  findAll(): Todo[];
  save(todo: Todo): void;
  delete(id: string): void;
}

// ビジネスロジック層
class TodoService {
  constructor(private repository: TodoRepository) {}
  
  createTodo(title: string): Todo {
    const todo = new Todo(generateId(), title);
    this.repository.save(todo);
    return todo;
  }
}

// プレゼンテーション層
class TodoController {
  constructor(private service: TodoService) {}
  
  handleCreateTodo(title: string): void {
    this.service.createTodo(title);
    this.updateView();
  }
}
```

---

## 状態管理用語

### 状態（State）
**定義**: アプリケーションの現在の状況を表すデータ

**状態の種類**:
```typescript
// アプリケーション状態
interface AppState {
  todos: Todo[];
  filter: FilterType;
  isLoading: boolean;
  error: string | null;
}

// コンポーネント状態
interface ComponentState {
  inputValue: string;
  isEditing: boolean;
  validationErrors: string[];
}
```

### イミュータブル更新（Immutable Update）
**定義**: 既存のオブジェクトを変更せず、新しいオブジェクトを作成する更新方法

**実装例**:
```typescript
// ミュータブル（避けるべき）
function addTodoMutable(state: AppState, todo: Todo): void {
  state.todos.push(todo); // 既存の配列を変更
}

// イミュータブル（推奨）
function addTodoImmutable(state: AppState, todo: Todo): AppState {
  return {
    ...state,
    todos: [...state.todos, todo] // 新しい配列を作成
  };
}
```

### アクション（Action）
**定義**: 状態変更を表現するオブジェクト

**実装例**:
```typescript
// アクションの型定義
type TodoAction = 
  | { type: 'ADD_TODO'; payload: { title: string } }
  | { type: 'TOGGLE_TODO'; payload: { id: string } }
  | { type: 'DELETE_TODO'; payload: { id: string } }
  | { type: 'SET_FILTER'; payload: { filter: FilterType } };

// アクションクリエーター
const todoActions = {
  addTodo: (title: string): TodoAction => ({
    type: 'ADD_TODO',
    payload: { title }
  }),
  
  toggleTodo: (id: string): TodoAction => ({
    type: 'TOGGLE_TODO',
    payload: { id }
  })
};
```

---

## コンポーネント設計用語

### コンポーネント（Component）
**定義**: 再利用可能なUI要素とその動作をカプセル化したもの

**コンポーネントの種類**:
```typescript
// プレゼンテーショナルコンポーネント
interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

class TodoItem {
  constructor(private props: TodoItemProps) {}
  
  render(): HTMLElement {
    // UIのレンダリングのみ
  }
}

// コンテナコンポーネント
class TodoContainer {
  constructor(private store: TodoStore) {}
  
  render(): HTMLElement {
    // 状態管理とデータの受け渡し
    const todos = this.store.getTodos();
    return new TodoList({
      todos,
      onToggle: this.handleToggle.bind(this)
    }).render();
  }
}
```

### Props（プロパティ）
**定義**: コンポーネントに渡される入力データ

**型安全なProps**:
```typescript
interface ButtonProps {
  text: string;
  variant: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  onClick: (event: MouseEvent) => void;
}

class Button {
  constructor(private props: ButtonProps) {
    this.validateProps();
  }
  
  private validateProps(): void {
    if (!this.props.text.trim()) {
      throw new Error('Button text is required');
    }
  }
}
```

---

## 型安全性用語

### 型ガード（Type Guard）
**定義**: 実行時に型を確認し、型安全性を保証する仕組み

**実装例**:
```typescript
// ユーザー定義型ガード
function isTodo(value: unknown): value is Todo {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'title' in value &&
    'completed' in value
  );
}

// 使用例
function processTodoData(data: unknown): Todo[] {
  if (Array.isArray(data)) {
    return data.filter(isTodo);
  }
  return [];
}
```

### 判別可能なユニオン（Discriminated Union）
**定義**: 共通のプロパティで区別できるユニオン型

**実装例**:
```typescript
// 判別可能なユニオン
type ApiResponse<T> = 
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: string };

// 型安全な処理
function handleTodoResponse(response: ApiResponse<Todo[]>): void {
  switch (response.status) {
    case 'loading':
      showLoadingSpinner();
      break;
    case 'success':
      displayTodos(response.data); // response.dataは確実にTodo[]
      break;
    case 'error':
      showError(response.error); // response.errorは確実にstring
      break;
  }
}
```

### 型アサーション（Type Assertion）
**定義**: 開発者が型を明示的に指定する仕組み

**適切な使用例**:
```typescript
// DOM要素の型アサーション
const todoInput = document.getElementById('todo-input') as HTMLInputElement;
const todoList = document.querySelector('.todo-list') as HTMLUListElement;

// APIレスポンスの型アサーション（型ガードと組み合わせ）
async function fetchTodos(): Promise<Todo[]> {
  const response = await fetch('/api/todos');
  const data = await response.json();
  
  // 型ガードで検証してからアサーション
  if (Array.isArray(data) && data.every(isTodo)) {
    return data as Todo[];
  }
  
  throw new Error('Invalid todo data format');
}
```

### 型の絞り込み（Type Narrowing）
**定義**: 条件分岐により型の範囲を狭める仕組み

**実装例**:
```typescript
type TodoFilter = 'all' | 'active' | 'completed';

function filterTodos(todos: Todo[], filter: TodoFilter): Todo[] {
  // 型の絞り込み
  if (filter === 'active') {
    return todos.filter(todo => !todo.completed);
  }
  
  if (filter === 'completed') {
    return todos.filter(todo => todo.completed);
  }
  
  // filter === 'all' の場合
  return todos;
}

// null チェックによる型の絞り込み
function getTodoTitle(todo: Todo | null): string {
  if (todo === null) {
    return 'No todo selected';
  }
  
  // この時点でtodoはTodo型として扱われる
  return todo.title;
}
```

---

## 📚 実用的なパターン

### ファクトリーパターン
```typescript
interface TodoFactory {
  createTodo(title: string): Todo;
  createTodoFromData(data: TodoData): Todo;
}

class DefaultTodoFactory implements TodoFactory {
  createTodo(title: string): Todo {
    return {
      id: generateId(),
      title: title.trim(),
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }
  
  createTodoFromData(data: TodoData): Todo {
    return {
      ...data,
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt)
    };
  }
}
```

### オブザーバーパターン
```typescript
interface Observer<T> {
  update(data: T): void;
}

class TodoStore {
  private observers: Observer<Todo[]>[] = [];
  private todos: Todo[] = [];
  
  subscribe(observer: Observer<Todo[]>): void {
    this.observers.push(observer);
  }
  
  private notify(): void {
    this.observers.forEach(observer => observer.update([...this.todos]));
  }
  
  addTodo(todo: Todo): void {
    this.todos.push(todo);
    this.notify();
  }
}
```

---

## 📚 参考リンク

- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Clean Code](https://clean-code-developer.com/)
- [Design Patterns](https://refactoring.guru/design-patterns)

---

**📌 重要**: 実践プロジェクトでは、これらの概念を組み合わせて、保守性が高く型安全なアプリケーションを構築することが重要です。