# Step07 成果物：Todoアプリケーション管理システム

---

## 🎯 課題の目的

**あなたが作成するもの**: 既存のJavaScriptコードにTypeScriptの型安全な状態管理、コンポーネント設計、イベントハンドリングを追加する

**なぜ作るのか**: Step07で学習した実践プロジェクト開始の知識を実際のコードに適用し、**既存コードを型安全で保守性の高いアーキテクチャに変換する力**を身につけるため

**学習目標**:
- 既存のJavaScriptコードを読んで適切な状態管理システムを設計できる
- 型安全なコンポーネント設計パターンを実装できる
- ジェネリクスを活用した再利用可能なコンポーネントを作成できる
- 判別可能なユニオン型を使った堅牢なアクションシステムを構築できる

---

## 📋 必須提出物

以下の1つのファイルのみ提出してください：

```
📁 提出物/
└── todo-app.ts    # 型安全なTodoアプリケーション（必須）
```

---

## ⏰ 作成手順（推奨時間配分：合計50分）

### Phase 1: 既存コードの理解と基本型定義（10分）

#### ステップ1-1: 提供されたJavaScriptコードを理解する（10分）

以下のJavaScriptコードを読んで、どんな型定義と状態管理が必要か考えてください：

```javascript
// 既存のJavaScriptコード（型安全性なし）
let todos = [];
let currentFilter = "all";
let listeners = [];

function addTodo(title, priority) {
  const todo = {
    id: Date.now().toString(),
    title: title,
    completed: false,
    priority: priority || "medium",
    createdAt: new Date(),
    updatedAt: new Date()
  };
  todos.push(todo);
  notifyListeners();
  renderTodos();
}

function toggleTodo(id) {
  const todo = todos.find(t => t.id === id);
  if (todo) {
    todo.completed = !todo.completed;
    todo.updatedAt = new Date();
    notifyListeners();
    renderTodos();
  }
}

function deleteTodo(id) {
  todos = todos.filter(t => t.id !== id);
  notifyListeners();
  renderTodos();
}

function updateTodo(id, updates) {
  const todoIndex = todos.findIndex(t => t.id === id);
  if (todoIndex !== -1) {
    todos[todoIndex] = {
      ...todos[todoIndex],
      ...updates,
      updatedAt: new Date()
    };
    notifyListeners();
    renderTodos();
  }
}

function setFilter(filter) {
  currentFilter = filter;
  renderTodos();
}

function getFilteredTodos() {
  switch (currentFilter) {
    case "active":
      return todos.filter(t => !t.completed);
    case "completed":
      return todos.filter(t => t.completed);
    default:
      return todos;
  }
}

function getStats() {
  const total = todos.length;
  const completed = todos.filter(t => t.completed).length;
  const active = total - completed;
  
  return {
    total: total,
    completed: completed,
    active: active,
    completionRate: total > 0 ? Math.round((completed / total) * 100) : 0
  };
}

function subscribe(listener) {
  listeners.push(listener);
  return function unsubscribe() {
    const index = listeners.indexOf(listener);
    if (index > -1) {
      listeners.splice(index, 1);
    }
  };
}

function notifyListeners() {
  listeners.forEach(listener => listener());
}

function renderTodos() {
  const todoList = document.getElementById("todo-list");
  if (!todoList) return;
  
  const filteredTodos = getFilteredTodos();
  todoList.innerHTML = "";
  
  filteredTodos.forEach(todo => {
    const todoElement = createTodoElement(todo);
    todoList.appendChild(todoElement);
  });
  
  updateStats();
}

function createTodoElement(todo) {
  const div = document.createElement("div");
  div.className = `todo-item ${todo.completed ? "completed" : ""} priority-${todo.priority}`;
  
  div.innerHTML = `
    <input type="checkbox" ${todo.completed ? "checked" : ""} 
           onchange="toggleTodo('${todo.id}')">
    <span class="todo-title">${todo.title}</span>
    <span class="priority-badge">${todo.priority}</span>
    <button onclick="editTodo('${todo.id}')">編集</button>
    <button onclick="deleteTodo('${todo.id}')">削除</button>
  `;
  
  return div;
}

function editTodo(id) {
  const todo = todos.find(t => t.id === id);
  if (todo) {
    const newTitle = prompt("新しいタイトルを入力してください:", todo.title);
    if (newTitle && newTitle.trim()) {
      updateTodo(id, { title: newTitle.trim() });
    }
  }
}

function updateStats() {
  const statsElement = document.getElementById("stats");
  if (statsElement) {
    const stats = getStats();
    statsElement.innerHTML = `
      <span>総数: ${stats.total}</span>
      <span>完了: ${stats.completed}</span>
      <span>未完了: ${stats.active}</span>
      <span>完了率: ${stats.completionRate}%</span>
    `;
  }
}

function setupEventListeners() {
  const addButton = document.getElementById("add-todo-btn");
  const titleInput = document.getElementById("new-todo-title");
  const prioritySelect = document.getElementById("new-todo-priority");
  const filterSelect = document.getElementById("filter-select");
  
  if (addButton) {
    addButton.addEventListener("click", () => {
      const title = titleInput.value.trim();
      const priority = prioritySelect.value;
      
      if (title) {
        addTodo(title, priority);
        titleInput.value = "";
      }
    });
  }
  
  if (titleInput) {
    titleInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        addButton.click();
      }
    });
  }
  
  if (filterSelect) {
    filterSelect.addEventListener("change", (e) => {
      setFilter(e.target.value);
    });
  }
}

function initApp() {
  setupEventListeners();
  renderTodos();
  
  // サンプルデータの追加
  addTodo("TypeScriptの学習", "high");
  addTodo("プロジェクトの設計", "medium");
  addTodo("コードレビュー", "low");
}

// アプリケーション初期化
document.addEventListener("DOMContentLoaded", initApp);
```

### Phase 2: 型定義と状態管理の追加（25分）

#### ステップ2-1: 基本的な型定義を作成する（10分）

上記のコードを見て、以下の型を定義してください：

1. **Todo項目を表現する型**
   - `TodoItem`インターフェース
   - どんなプロパティが必要でしょうか？

2. **アプリケーション状態の型**
   - `AppState`インターフェース
   - 状態管理に必要な情報は？

3. **その他の基本型**
   - `TodoFilter`型（リテラル型）
   - `TodoPriority`型（リテラル型）

**🤔 考えてみましょう**:
```typescript
// TODO: 以下の型を定義してください

// Todo項目の型
interface TodoItem {
  // どんなプロパティが必要？
}

// フィルターの型
type TodoFilter = ?;

// 優先度の型  
type TodoPriority = ?;

// アプリケーション状態の型
interface AppState {
  // どんな状態が必要？
}
```

#### ステップ2-2: 状態管理システムの実装（15分）

**アクションシステムの実装**（8分）
```typescript
// TODO: 判別可能なユニオン型でアクションを定義してください
type TodoAction = 
  | { type: ?; payload: ? }
  | { type: ?; payload: ? }
  // 他のアクションも追加...
```

**TodoStoreクラスの実装**（7分）
```typescript
// TODO: 型安全な状態管理クラスを実装してください
class TodoStore {
  private state: AppState;
  private listeners: Array<(state: AppState) => void> = [];
  
  constructor() {
    // 初期状態の設定
  }
  
  getState(): AppState {
    // 状態の取得
  }
  
  dispatch(action: TodoAction): void {
    // アクションの処理
  }
  
  subscribe(listener: (state: AppState) => void): () => void {
    // リスナーの登録
  }
  
  private reducer(state: AppState, action: TodoAction): AppState {
    // リデューサーの実装
  }
}
```

### Phase 3: コンポーネント設計とイベントハンドリング（15分）

#### ステップ3-1: 基底コンポーネントクラスの実装（5分）

```typescript
// TODO: ジェネリクスを使った基底コンポーネントを実装してください
abstract class BaseComponent<TProps = {}> {
  protected element: HTMLElement;
  protected props: TProps;
  
  constructor(tagName: string, props: TProps = {} as TProps) {
    // 基底コンポーネントの実装
  }
  
  protected abstract init(): void;
  protected abstract render(): void;
  
  // その他のヘルパーメソッド
}
```

#### ステップ3-2: TodoItemComponentの実装（10分）

```typescript
// TODO: Todo項目コンポーネントを実装してください
interface TodoItemProps {
  todo: TodoItem;
  onToggle: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

class TodoItemComponent extends BaseComponent<TodoItemProps> {
  protected init(): void {
    // 初期化処理
  }
  
  protected render(): void {
    // レンダリング処理
  }
}
```

---

## ✅ 最低合格要件

以下の要件を**すべて満たす**ことで合格とします：

### 🔧 技術要件
- [ ] TypeScriptでコンパイルエラーが発生しない
- [ ] **状態管理システムを型安全に実装している**（最重要！）
- [ ] **コンポーネント設計パターンを適用している**（最重要！）
- [ ] ジェネリクスを実践的に活用している
- [ ] 判別可能なユニオン型を使用している
- [ ] すべての関数の引数と戻り値に適切な型注釈が付いている

### 🎯 機能要件
- [ ] 元のJavaScriptコードと同じ動作をする
- [ ] Todoの追加・削除・完了切り替えができる
- [ ] フィルタリング機能が動作する
- [ ] 統計情報を表示できる
- [ ] 編集機能が動作する

### 💭 設計要件
- [ ] 適切なインターフェースと型エイリアスを定義している
- [ ] 状態の不変性が保たれている
- [ ] コンポーネントが再利用可能な設計になっている
- [ ] イベントハンドリングが型安全に実装されている

---

## 📊 評価基準

| 項目 | 配点 | 評価ポイント |
|------|------|-------------|
| **状態管理設計** | 40点 | 型安全な状態管理システムの実装 |
| **コンポーネント設計** | 30点 | 再利用可能なコンポーネント設計 |
| **型定義の適切性** | 20点 | 適切なインターフェースと型の定義 |
| **機能の完成度** | 10点 | 元のコードと同じ動作の実現 |

**合格ライン**: 70点以上
---

## 💡 実装のヒント

### 🤔 型を考える時の質問

1. **この状態には何が含まれる？**
   - `todos` → Todo項目の配列 → `TodoItem[]`
   - `currentFilter` → フィルター状態 → `TodoFilter`
   - `listeners` → リスナー関数の配列 → `Array<(state: AppState) => void>`

2. **このアクションは何をする？**
   - `addTodo` → 新しいTodoを追加 → `{ type: "ADD_TODO"; payload: Omit<TodoItem, "id" | "createdAt" | "updatedAt"> }`
   - `toggleTodo` → Todoの完了状態を切り替え → `{ type: "TOGGLE_TODO"; payload: { id: string } }`

3. **このコンポーネントは何を受け取る？**
   - `TodoItemComponent` → Todo項目とイベントハンドラー → `TodoItemProps`

### 📝 状態管理の基本パターン

```typescript
// 状態管理の基本構造
interface AppState {
  todos: TodoItem[];
  filter: TodoFilter;
}

// アクションの基本構造
type TodoAction = 
  | { type: "ADD_TODO"; payload: CreateTodoData }
  | { type: "TOGGLE_TODO"; payload: { id: string } }
  | { type: "DELETE_TODO"; payload: { id: string } }
  | { type: "SET_FILTER"; payload: { filter: TodoFilter } };

// リデューサーの基本構造
function reducer(state: AppState, action: TodoAction): AppState {
  switch (action.type) {
    case "ADD_TODO":
      return {
        ...state,
        todos: [...state.todos, createTodoFromPayload(action.payload)]
      };
    // 他のケース...
    default:
      return state;
  }
}
```

### 🔍 コンポーネント設計のパターン

```typescript
// 基底コンポーネントの活用
abstract class BaseComponent<TProps = {}> {
  protected createElement<K extends keyof HTMLElementTagNameMap>(
    tagName: K,
    attributes?: Partial<HTMLElementTagNameMap[K]>,
    textContent?: string
  ): HTMLElementTagNameMap[K] {
    const element = document.createElement(tagName);
    if (attributes) {
      Object.assign(element, attributes);
    }
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
}

// 具体的なコンポーネントの実装
class TodoItemComponent extends BaseComponent<TodoItemProps> {
  protected render(): void {
    const { todo, onToggle, onEdit, onDelete } = this.props;
    
    // 型安全なDOM操作
    const checkbox = this.createElement("input", {
      type: "checkbox",
      checked: todo.completed
    });
    
    // 型安全なイベントハンドリング
    this.addEventListeners(checkbox, {
      change: () => onToggle(todo.id)
    });
  }
}
```

### ⚠️ よくある間違い

1. **状態の直接変更**
   ```typescript
   // ❌ 間違い
   function badToggleTodo(state: AppState, id: string) {
     const todo = state.todos.find(t => t.id === id);
     if (todo) {
       todo.completed = !todo.completed; // 直接変更
     }
     return state;
   }
   
   // ✅ 正解
   function goodToggleTodo(state: AppState, id: string): AppState {
     return {
       ...state,
       todos: state.todos.map(todo =>
         todo.id === id 
           ? { ...todo, completed: !todo.completed, updatedAt: new Date() }
           : todo
       )
     };
   }
   ```

2. **型注釈の不足**
   ```typescript
   // ❌ 間違い
   function createTodo(title, priority) {
     return {
       id: Date.now().toString(),
       title,
       priority,
       completed: false,
       createdAt: new Date(),
       updatedAt: new Date()
     };
   }
   
   // ✅ 正解
   function createTodo(
     title: string, 
     priority: TodoPriority
   ): TodoItem {
     return {
       id: Date.now().toString(),
       title,
       priority,
       completed: false,
       createdAt: new Date(),
       updatedAt: new Date()
     };
   }
   ```

3. **アクション型の設計ミス**
   ```typescript
   // ❌ 間違い: 型安全性がない
   interface BadAction {
     type: string;
     payload: any;
   }
   
   // ✅ 正解: 判別可能なユニオン型
   type GoodAction = 
     | { type: "ADD_TODO"; payload: CreateTodoData }
     | { type: "TOGGLE_TODO"; payload: { id: string } }
     | { type: "DELETE_TODO"; payload: { id: string } };
   ```

---

## 📚 参考：完成例（実装の答えを見たい場合）

<details>
<summary>⚠️ 注意：まず自分で考えてから見てください</summary>

```typescript
// 型定義
interface TodoItem {
  id: string;
  title: string;
  completed: boolean;
  priority: TodoPriority;
  createdAt: Date;
  updatedAt: Date;
}

type TodoFilter = "all" | "active" | "completed";
type TodoPriority = "low" | "medium" | "high";

interface AppState {
  todos: TodoItem[];
  filter: TodoFilter;
}

// アクション定義
type TodoAction = 
  | { type: "ADD_TODO"; payload: Omit<TodoItem, "id" | "createdAt" | "updatedAt"> }
  | { type: "TOGGLE_TODO"; payload: { id: string } }
  | { type: "DELETE_TODO"; payload: { id: string } }
  | { type: "UPDATE_TODO"; payload: { id: string; updates: Partial<Pick<TodoItem, "title" | "priority">> } }
  | { type: "SET_FILTER"; payload: { filter: TodoFilter } };

// 状態管理
class TodoStore {
  private state: AppState;
  private listeners: Array<(state: AppState) => void> = [];
  
  constructor() {
    this.state = {
      todos: [],
      filter: "all"
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
          id: Date.now().toString(),
          createdAt: new Date(),
          updatedAt: new Date()
        };
        return {
          ...state,
          todos: [...state.todos, newTodo]
        };
        
      case "TOGGLE_TODO":
        return {
          ...state,
          todos: state.todos.map(todo =>
            todo.id === action.payload.id
              ? { ...todo, completed: !todo.completed, updatedAt: new Date() }
              : todo
          )
        };
        
      case "DELETE_TODO":
        return {
          ...state,
          todos: state.todos.filter(todo => todo.id !== action.payload.id)
        };
        
      case "UPDATE_TODO":
        return {
          ...state,
          todos: state.todos.map(todo =>
            todo.id === action.payload.id
              ? { ...todo, ...action.payload.updates, updatedAt: new Date() }
              : todo
          )
        };
        
      case "SET_FILTER":
        return {
          ...state,
          filter: action.payload.filter
        };
        
      default:
        return state;
    }
  }
  
  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.state));
  }
}

// コンポーネント設計
abstract class BaseComponent<TProps = {}> {
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

interface TodoItemProps {
  todo: TodoItem;
  onToggle: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

class TodoItemComponent extends BaseComponent<TodoItemProps> {
  protected init(): void {
    this.element.className = "todo-item";
    this.render();
  }
  
  protected render(): void {
    const { todo, onToggle, onEdit, onDelete } = this.props;
    
    this.element.innerHTML = "";
    this.element.className = `todo-item ${todo.completed ? "completed" : ""} priority-${todo.priority}`;
    
    const checkbox = this.createElement("input", {
      type: "checkbox",
      checked: todo.completed,
      className: "todo-checkbox"
    });
    
    const titleSpan = this.createElement("span", {
      className: "todo-title"
    }, todo.title);
    
    const priorityBadge = this.createElement("span", {
      className: `priority-badge priority-${todo.priority}`
    }, todo.priority);
    
    const editButton = this.createElement("button", {
      className: "btn btn-edit"
    }, "編集");
    
    const deleteButton = this.createElement("button", {
      className: "btn btn-delete"
    }, "削除");
    
    this.addEventListeners(checkbox, {
      change: () => onToggle(todo.id)
    });
    
    this.addEventListeners(editButton, {
      click: () => onEdit(todo.id)
    });
    
    this.addEventListeners(deleteButton, {
      click: () => onDelete(todo.id)
    });
    
    this.element.appendChild(checkbox);
    this.element.appendChild(titleSpan);
    this.element.appendChild(priorityBadge);
    this.element.appendChild(editButton);
    this.element.appendChild(deleteButton);
  }
}

// アプリケーション統合（簡略版）
class TodoApp {
  private store: TodoStore;
  private components: Map<string, TodoItemComponent> = new Map();
  
  constructor() {
    this.store = new TodoStore();
    this.init();
  }
  
  private init(): void {
    this.setupEventListeners();
    this.subscribeToStore();
    this.addSampleData();
    this.render();
  }
  
  private setupEventListeners(): void {
    // イベントリスナーの設定
  }
  
  private subscribeToStore(): void {
    this.store.subscribe(() => {
      this.render();
    });
  }
  
  private addSampleData(): void {
    this.store.dispatch({
      type: "ADD_TODO",
      payload: { title: "TypeScriptの学習", priority: "high", completed: false }
    });
  }
  
  private render(): void {
    // レンダリング処理
  }
  
  private getFilteredTodos(state: AppState): TodoItem[] {
    switch (state.filter) {
      case "active":
        return state.todos.filter(t => !t.completed);
      case "completed":
        return state.todos.filter(t => t.completed);
      default:
        return state.todos;
    }
  }
  
  private getStats(state: AppState) {
    const total = state.todos.length;
    const completed = state.todos.filter(t => t.completed).length;
    const active = total - completed;
    
    return {
      total,
      completed,
      active,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0
    };
  }
}

// アプリケーション初期化
document.addEventListener("DOMContentLoaded", () => {
  new TodoApp();
});
```

</details>

---

## 🚀 発展課題（任意）

余裕がある場合は以下にも挑戦してみてください：

- [ ] カテゴリ機能の追加（Todo項目にカテゴリを設定）
- [ ] 期限機能の追加（期限切れの表示）
- [ ] ローカルストレージへの保存機能
- [ ] ドラッグ&ドロップでの並び替え機能
- [ ] より高度なフィルタリング（複数条件）

---

**📌 重要**: この課題の目的は**既存のJavaScriptコードを読んで適切な型安全な状態管理とコンポーネント設計を実装する力**を身につけることです。TypeScriptの実践的な活用方法を学習しましょう。

**🌟 次のステップ**: Step08では、外部ライブラリとの統合と型定義について学習します！