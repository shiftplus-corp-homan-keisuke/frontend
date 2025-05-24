# Step 3: Props・State・Event 型管理

## 📅 学習期間・目標

**期間**: Step 3
**総学習時間**: 6 時間
**学習スタイル**: 理論 20% + 実践コード 50% + 演習 30%

### 🎯 Step 3 到達目標

- [ ] useState/useEffect の型安全な活用
- [ ] Event Handler の完全な型管理
- [ ] 条件付きレンダリングの型安全性
- [ ] State 更新パターンの最適化
- [ ] カスタムフックの基本設計

## 📚 理論学習内容

### Day 15-17: useState/useEffect の型安全な活用

#### 🎯 useState の高度な型管理

```typescript
// 1. 基本的なuseStateの型定義
import React, { useState, useEffect, useCallback, useMemo } from "react";

// プリミティブ型
const [count, setCount] = useState<number>(0);
const [message, setMessage] = useState<string>("");
const [isVisible, setIsVisible] = useState<boolean>(false);

// オブジェクト型
interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "user";
}

const [user, setUser] = useState<User | null>(null);

// 配列型
const [users, setUsers] = useState<User[]>([]);

// 2. 複雑な状態の型定義
interface FormState {
  values: Record<string, any>;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  isSubmitting: boolean;
}

const [formState, setFormState] = useState<FormState>({
  values: {},
  errors: {},
  touched: {},
  isSubmitting: false,
});

// 状態更新の型安全な実装
const updateFormValue = useCallback((field: string, value: any): void => {
  setFormState((prev) => ({
    ...prev,
    values: { ...prev.values, [field]: value },
    touched: { ...prev.touched, [field]: true },
  }));
}, []);

// 3. 非同期状態の管理
interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

function useAsyncState<T>(initialData: T | null = null): [
  AsyncState<T>,
  {
    setData: (data: T) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: Error | null) => void;
    reset: () => void;
  }
] {
  const [state, setState] = useState<AsyncState<T>>({
    data: initialData,
    loading: false,
    error: null,
  });

  const setData = useCallback((data: T) => {
    setState((prev) => ({ ...prev, data, loading: false, error: null }));
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    setState((prev) => ({ ...prev, loading }));
  }, []);

  const setError = useCallback((error: Error | null) => {
    setState((prev) => ({ ...prev, error, loading: false }));
  }, []);

  const reset = useCallback(() => {
    setState({ data: initialData, loading: false, error: null });
  }, [initialData]);

  return [state, { setData, setLoading, setError, reset }];
}

// 使用例
function UserProfile({ userId }: { userId: number }): JSX.Element {
  const [userState, { setData, setLoading, setError }] = useAsyncState<User>();

  useEffect(() => {
    const fetchUser = async (): Promise<void> => {
      try {
        setLoading(true);
        const response = await fetch(`/api/users/${userId}`);
        if (!response.ok) throw new Error("Failed to fetch user");
        const userData = (await response.json()) as User;
        setData(userData);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Unknown error"));
      }
    };

    void fetchUser();
  }, [userId, setData, setLoading, setError]);

  if (userState.loading) return <div>Loading...</div>;
  if (userState.error) return <div>Error: {userState.error.message}</div>;
  if (!userState.data) return <div>No user found</div>;

  return (
    <div>
      <h1>{userState.data.name}</h1>
      <p>{userState.data.email}</p>
      <span>{userState.data.role}</span>
    </div>
  );
}
```

#### 🔄 useEffect の型安全な実装

```typescript
// 4. useEffect の依存配列型管理
interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
}

function ProductList(): JSX.Element {
  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<keyof Product>("name");

  // 依存配列の型安全性
  useEffect(() => {
    const fetchProducts = async (): Promise<void> => {
      try {
        const params = new URLSearchParams();
        if (category !== "all") params.append("category", category);
        params.append("sortBy", String(sortBy));

        const response = await fetch(`/api/products?${params}`);
        const data = (await response.json()) as Product[];
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };

    void fetchProducts();
  }, [category, sortBy]); // 依存配列の型が自動的にチェックされる

  // クリーンアップ関数の型安全性
  useEffect(() => {
    const handleResize = (): void => {
      console.log("Window resized");
    };

    window.addEventListener("resize", handleResize);

    // クリーンアップ関数の戻り値型は void
    return (): void => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div>
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="all">All Categories</option>
        <option value="electronics">Electronics</option>
        <option value="clothing">Clothing</option>
      </select>

      <select
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value as keyof Product)}
      >
        <option value="name">Name</option>
        <option value="price">Price</option>
      </select>

      <div>
        {products.map((product) => (
          <div key={product.id}>
            <h3>{product.name}</h3>
            <p>${product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// 5. カスタムフックでのuseEffect活用
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return (): void => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T | ((prev: T) => T)): void => {
      try {
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  return [storedValue, setValue];
}
```

### Day 18-19: Event Handler の型安全性

#### 🎯 各種イベントハンドラーの型定義

```typescript
// 6. フォームイベントの型安全な処理
interface ContactFormData {
  name: string;
  email: string;
  message: string;
  subscribe: boolean;
}

function ContactForm(): JSX.Element {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    message: "",
    subscribe: false,
  });

  // 入力フィールドの変更処理
  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const { name, value, type } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? (event.target as HTMLInputElement).checked
          : value,
    }));
  };

  // セレクトボックスの変更処理
  const handleSelectChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ): void => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // フォーム送信処理
  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to submit form");

      // フォームリセット
      setFormData({
        name: "",
        email: "",
        message: "",
        subscribe: false,
      });
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  // ファイルアップロード処理
  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      console.log("Selected file:", file.name, file.size);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleInputChange}
        placeholder="Your Name"
        required
      />

      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleInputChange}
        placeholder="Your Email"
        required
      />

      <textarea
        name="message"
        value={formData.message}
        onChange={handleInputChange}
        placeholder="Your Message"
        rows={4}
        required
      />

      <label>
        <input
          type="checkbox"
          name="subscribe"
          checked={formData.subscribe}
          onChange={handleInputChange}
        />
        Subscribe to newsletter
      </label>

      <input type="file" onChange={handleFileChange} accept=".pdf,.doc,.docx" />

      <button type="submit">Send Message</button>
    </form>
  );
}

// 7. マウスイベントの型安全な処理
interface InteractiveButtonProps {
  children: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onDoubleClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onMouseEnter?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onMouseLeave?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

function InteractiveButton({
  children,
  onClick,
  onDoubleClick,
  onMouseEnter,
  onMouseLeave,
}: InteractiveButtonProps): JSX.Element {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [clickCount, setClickCount] = useState<number>(0);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
    setClickCount((prev) => prev + 1);
    onClick?.(event);
  };

  const handleDoubleClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ): void => {
    console.log("Double clicked at:", event.clientX, event.clientY);
    onDoubleClick?.(event);
  };

  const handleMouseEnter = (
    event: React.MouseEvent<HTMLButtonElement>
  ): void => {
    setIsHovered(true);
    onMouseEnter?.(event);
  };

  const handleMouseLeave = (
    event: React.MouseEvent<HTMLButtonElement>
  ): void => {
    setIsHovered(false);
    onMouseLeave?.(event);
  };

  return (
    <button
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        backgroundColor: isHovered ? "#007bff" : "#6c757d",
        color: "white",
        border: "none",
        padding: "8px 16px",
        borderRadius: "4px",
        cursor: "pointer",
      }}
    >
      {children} (Clicked: {clickCount})
    </button>
  );
}

// 8. キーボードイベントの型安全な処理
interface SearchBoxProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

function SearchBox({
  onSearch,
  placeholder = "Search...",
}: SearchBoxProps): JSX.Element {
  const [query, setQuery] = useState<string>("");

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ): void => {
    if (event.key === "Enter") {
      event.preventDefault();
      onSearch(query);
    } else if (event.key === "Escape") {
      setQuery("");
    }
  };

  const handleKeyPress = (
    event: React.KeyboardEvent<HTMLInputElement>
  ): void => {
    // 数字のみ許可する例
    if (!/[0-9]/.test(event.key) && event.key !== "Backspace") {
      event.preventDefault();
    }
  };

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
      />
      <button onClick={() => onSearch(query)}>Search</button>
    </div>
  );
}
```

### Day 20-21: 条件付きレンダリングと State 更新パターン

#### 🎯 型安全な条件付きレンダリング

```typescript
// 9. 条件付きレンダリングの型安全性
interface LoadingState {
  type: "loading";
}

interface SuccessState<T> {
  type: "success";
  data: T;
}

interface ErrorState {
  type: "error";
  error: string;
}

type AsyncState<T> = LoadingState | SuccessState<T> | ErrorState;

interface DataDisplayProps<T> {
  state: AsyncState<T>;
  renderData: (data: T) => React.ReactNode;
  renderError?: (error: string) => React.ReactNode;
  renderLoading?: () => React.ReactNode;
}

function DataDisplay<T>({
  state,
  renderData,
  renderError,
  renderLoading,
}: DataDisplayProps<T>): JSX.Element {
  switch (state.type) {
    case "loading":
      return (
        <div>{renderLoading ? renderLoading() : <div>Loading...</div>}</div>
      );

    case "success":
      return <div>{renderData(state.data)}</div>;

    case "error":
      return (
        <div>
          {renderError ? (
            renderError(state.error)
          ) : (
            <div>Error: {state.error}</div>
          )}
        </div>
      );

    default:
      // TypeScriptが全てのケースをチェック
      const _exhaustiveCheck: never = state;
      return _exhaustiveCheck;
  }
}

// 使用例
function UserList(): JSX.Element {
  const [state, setState] = useState<AsyncState<User[]>>({ type: "loading" });

  useEffect(() => {
    const fetchUsers = async (): Promise<void> => {
      try {
        setState({ type: "loading" });
        const response = await fetch("/api/users");
        if (!response.ok) throw new Error("Failed to fetch users");
        const users = (await response.json()) as User[];
        setState({ type: "success", data: users });
      } catch (error) {
        setState({
          type: "error",
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    };

    void fetchUsers();
  }, []);

  return (
    <DataDisplay
      state={state}
      renderData={(users) => (
        <div>
          {users.map((user) => (
            <div key={user.id}>
              <h3>{user.name}</h3>
              <p>{user.email}</p>
            </div>
          ))}
        </div>
      )}
      renderError={(error) => (
        <div style={{ color: "red" }}>
          <h3>Error occurred</h3>
          <p>{error}</p>
        </div>
      )}
      renderLoading={() => (
        <div style={{ textAlign: "center" }}>
          <div>Loading users...</div>
        </div>
      )}
    />
  );
}

// 10. 複雑な状態更新パターン
interface TodoState {
  todos: Todo[];
  filter: "all" | "active" | "completed";
  editingId: number | null;
}

interface Todo {
  id: number;
  text: string;
  completed: boolean;
  createdAt: Date;
}

type TodoAction =
  | { type: "ADD_TODO"; payload: { text: string } }
  | { type: "TOGGLE_TODO"; payload: { id: number } }
  | { type: "DELETE_TODO"; payload: { id: number } }
  | { type: "EDIT_TODO"; payload: { id: number; text: string } }
  | { type: "SET_FILTER"; payload: { filter: TodoState["filter"] } }
  | { type: "SET_EDITING"; payload: { id: number | null } };

function todoReducer(state: TodoState, action: TodoAction): TodoState {
  switch (action.type) {
    case "ADD_TODO":
      return {
        ...state,
        todos: [
          ...state.todos,
          {
            id: Date.now(),
            text: action.payload.text,
            completed: false,
            createdAt: new Date(),
          },
        ],
      };

    case "TOGGLE_TODO":
      return {
        ...state,
        todos: state.todos.map((todo) =>
          todo.id === action.payload.id
            ? { ...todo, completed: !todo.completed }
            : todo
        ),
      };

    case "DELETE_TODO":
      return {
        ...state,
        todos: state.todos.filter((todo) => todo.id !== action.payload.id),
      };

    case "EDIT_TODO":
      return {
        ...state,
        todos: state.todos.map((todo) =>
          todo.id === action.payload.id
            ? { ...todo, text: action.payload.text }
            : todo
        ),
        editingId: null,
      };

    case "SET_FILTER":
      return {
        ...state,
        filter: action.payload.filter,
      };

    case "SET_EDITING":
      return {
        ...state,
        editingId: action.payload.id,
      };

    default:
      const _exhaustiveCheck: never = action;
      return _exhaustiveCheck;
  }
}

function TodoApp(): JSX.Element {
  const [state, dispatch] = React.useReducer(todoReducer, {
    todos: [],
    filter: "all",
    editingId: null,
  });

  const filteredTodos = useMemo(() => {
    switch (state.filter) {
      case "active":
        return state.todos.filter((todo) => !todo.completed);
      case "completed":
        return state.todos.filter((todo) => todo.completed);
      default:
        return state.todos;
    }
  }, [state.todos, state.filter]);

  const addTodo = useCallback((text: string): void => {
    if (text.trim()) {
      dispatch({ type: "ADD_TODO", payload: { text: text.trim() } });
    }
  }, []);

  const toggleTodo = useCallback((id: number): void => {
    dispatch({ type: "TOGGLE_TODO", payload: { id } });
  }, []);

  return (
    <div>
      <TodoInput onAdd={addTodo} />
      <TodoFilters
        currentFilter={state.filter}
        onFilterChange={(filter) =>
          dispatch({ type: "SET_FILTER", payload: { filter } })
        }
      />
      <TodoList
        todos={filteredTodos}
        editingId={state.editingId}
        onToggle={toggleTodo}
        onDelete={(id) => dispatch({ type: "DELETE_TODO", payload: { id } })}
        onEdit={(id, text) =>
          dispatch({ type: "EDIT_TODO", payload: { id, text } })
        }
        onStartEdit={(id) => dispatch({ type: "SET_EDITING", payload: { id } })}
      />
    </div>
  );
}
```

## 🎯 実践演習

### 演習 3-1: 状態管理システム 🔰

```typescript
// 以下の要件を満たす状態管理システムを実装せよ

// 1. ショッピングカート管理
interface CartItem {
  id: number;
  productId: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
  discount: number;
  shipping: number;
  tax: number;
}

// 要件:
// - アイテムの追加・削除・数量変更
// - 合計金額の自動計算
// - 割引・送料・税金の適用
// - ローカルストレージとの同期
// - 型安全な状態更新

// 2. フォーム状態管理
interface FormField<T> {
  value: T;
  error?: string;
  touched: boolean;
  required: boolean;
}

interface FormState<T extends Record<string, any>> {
  fields: { [K in keyof T]: FormField<T[K]> };
  isValid: boolean;
  isSubmitting: boolean;
}

// 要件:
// - 動的フォームフィールド管理
// - バリデーション機能
// - エラー表示制御
// - 送信状態管理
```

### 演習 3-2: イベント処理システム 🔶

```typescript
// 以下の要件を満たすイベント処理システムを実装せよ

// 1. ドラッグ&ドロップ機能
interface DragDropProps<T> {
  items: T[];
  onReorder: (items: T[]) => void;
  renderItem: (item: T, index: number, isDragging: boolean) => React.ReactNode;
  keyExtractor: (item: T) => string | number;
}

// 要件:
// - 型安全なドラッグ&ドロップ
// - アイテムの並び替え
// - ドラッグ中の視覚的フィードバック
// - タッチデバイス対応

// 2. キーボードナビゲーション
interface KeyboardNavigationProps {
  items: string[];
  onSelect: (item: string, index: number) => void;
  onEscape?: () => void;
}

// 要件:
// - 矢印キーでのナビゲーション
// - Enterキーでの選択
// - Escapeキーでのキャンセル
// - 循環ナビゲーション
```

### 演習 3-3: 実用的なアプリケーション 🔥

```typescript
// 以下の要件を満たすタスク管理アプリを実装せよ

interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
  dueDate?: Date;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface TaskAppState {
  tasks: Task[];
  filter: {
    status: "all" | "active" | "completed";
    priority?: Task["priority"];
    tag?: string;
    search: string;
  };
  sorting: {
    field: keyof Task;
    direction: "asc" | "desc";
  };
  selectedTasks: number[];
}

// 要件:
// - タスクのCRUD操作
// - 複数条件でのフィルタリング
// - ソート機能
// - 一括操作（削除・完了）
// - 検索機能
// - ローカルストレージ永続化
// - エクスポート機能
```

## 📊 Step 3 評価基準

### 理解度チェックリスト

#### State 管理 (35%)

- [ ] useState を型安全に使用できる
- [ ] useEffect の依存配列を適切に管理できる
- [ ] 複雑な状態を効率的に管理できる
- [ ] カスタムフックを設計・実装できる

#### Event 処理 (30%)

- [ ] 各種イベントハンドラーを型安全に実装できる
- [ ] フォームイベントを適切に処理できる
- [ ] キーボード・マウスイベントを活用できる
- [ ] イベントの伝播制御ができる

#### 条件付きレンダリング (25%)

- [ ] 型安全な条件分岐を実装できる
- [ ] Union 型を活用した状態管理ができる
- [ ] エラー・ローディング状態を適切に表示できる
- [ ] パフォーマンスを考慮した実装ができる

#### 実践応用 (10%)

- [ ] 実用的なアプリケーションを作成できる
- [ ] 複雑な状態管理を設計できる
- [ ] ユーザーインタラクションを実装できる
- [ ] 保守性の高いコード設計ができる

### 成果物チェックリスト

- [ ] **状態管理システム**: カート・フォーム等の複雑な状態管理
- [ ] **イベント処理システム**: ドラッグ&ドロップ・キーボードナビゲーション
- [ ] **タスク管理アプリ**: フィルタリング・ソート・検索機能付き
- [ ] **カスタムフック集**: 再利用可能な状態管理ロジック

## 🔄 Step 4 への準備

### 次週学習内容の予習

```typescript
// Step 4で学習するRef・フォーム管理の基礎概念

// 1. useRef の型安全な使用
const inputRef = useRef<HTMLInputElement>(null);
const divRef = useRef<HTMLDivElement>(null);

// 2. forwardRef の実装
const CustomInput = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  return <input ref={ref} {...props} />;
});

// 3. フォームバリデーション
interface ValidationRule<T> {
  required?: boolean;
  min?: number;
  max?: number;
  pattern?: RegExp;
  custom?: (value: T) => string | null;
}
```

### 環境準備

- [ ] フォームライブラリの調査（React Hook Form 等）
- [ ] バリデーションライブラリの検討（Zod、Yup 等）
- [ ] テストケースの拡充
- [ ] パフォーマンス測定ツールの準備

---

**📌 重要**: Step 3 は React の状態管理とイベント処理の基盤を築く重要な期間です。型安全な状態管理パターンを確実に習得することで、後の高度な機能学習がスムーズに進みます。
