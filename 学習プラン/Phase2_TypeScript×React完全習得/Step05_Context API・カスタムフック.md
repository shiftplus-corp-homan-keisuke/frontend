# Step 5: Context API・カスタムフック

## 📅 学習期間・目標

**期間**: Step 5
**総学習時間**: 6 時間
**学習スタイル**: 理論 20% + 実践コード 50% + 演習 30%

### 🎯 Step 5 到達目標

- [ ] Context API の型安全な実装
- [ ] カスタムフックの設計パターン
- [ ] 状態ロジックの抽象化
- [ ] Provider パターンの活用
- [ ] グローバル状態管理の基礎

## 📚 理論学習内容

### Day 29-31: Context API の型安全な実装

#### 🎯 基本的な Context 実装

```typescript
// 1. 型安全なContextの作成
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from "react";

// Theme Context
interface ThemeContextType {
  theme: "light" | "dark";
  toggleTheme: () => void;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
  };
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// カスタムフック for Context
function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

// Provider の実装
interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: "light" | "dark";
}

function ThemeProvider({
  children,
  defaultTheme = "light",
}: ThemeProviderProps): JSX.Element {
  const [theme, setTheme] = useState<"light" | "dark">(defaultTheme);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  }, []);

  const colors = useMemo(() => {
    return theme === "light"
      ? {
          primary: "#007bff",
          secondary: "#6c757d",
          background: "#ffffff",
          text: "#212529",
        }
      : {
          primary: "#0d6efd",
          secondary: "#6c757d",
          background: "#212529",
          text: "#ffffff",
        };
  }, [theme]);

  const value = useMemo<ThemeContextType>(
    () => ({
      theme,
      toggleTheme,
      colors,
    }),
    [theme, toggleTheme, colors]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

// 使用例
function App(): JSX.Element {
  return (
    <ThemeProvider defaultTheme="light">
      <Header />
      <MainContent />
    </ThemeProvider>
  );
}

function Header(): JSX.Element {
  const { theme, toggleTheme, colors } = useTheme();

  return (
    <header style={{ backgroundColor: colors.background, color: colors.text }}>
      <h1>My App</h1>
      <button onClick={toggleTheme}>
        Switch to {theme === "light" ? "dark" : "light"} mode
      </button>
    </header>
  );
}

// 2. 認証Context
interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (userData: RegisterData) => Promise<void>;
  loading: boolean;
  error: string | null;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(
    async (email: string, password: string): Promise<void> => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
          throw new Error("Login failed");
        }

        const userData = (await response.json()) as User;
        setUser(userData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const logout = useCallback(() => {
    setUser(null);
    setError(null);
  }, []);

  const register = useCallback(
    async (userData: RegisterData): Promise<void> => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userData),
        });

        if (!response.ok) {
          throw new Error("Registration failed");
        }

        const newUser = (await response.json()) as User;
        setUser(newUser);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      login,
      logout,
      register,
      loading,
      error,
    }),
    [user, login, logout, register, loading, error]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// 3. 複数Contextの組み合わせ
function AppProviders({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>{children}</NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

// 複数Contextを使用するカスタムフック
function useAppContext() {
  const theme = useTheme();
  const auth = useAuth();
  const notifications = useNotifications();

  return {
    theme,
    auth,
    notifications,
  };
}
```

#### 🔧 高度な Context パターン

```typescript
// 4. Reducer + Context パターン
interface TodoState {
  todos: Todo[];
  filter: "all" | "active" | "completed";
  loading: boolean;
  error: string | null;
}

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
}

type TodoAction =
  | { type: "ADD_TODO"; payload: { text: string } }
  | { type: "TOGGLE_TODO"; payload: { id: string } }
  | { type: "DELETE_TODO"; payload: { id: string } }
  | { type: "SET_FILTER"; payload: { filter: TodoState["filter"] } }
  | { type: "SET_LOADING"; payload: { loading: boolean } }
  | { type: "SET_ERROR"; payload: { error: string | null } };

function todoReducer(state: TodoState, action: TodoAction): TodoState {
  switch (action.type) {
    case "ADD_TODO":
      return {
        ...state,
        todos: [
          ...state.todos,
          {
            id: crypto.randomUUID(),
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

    case "SET_FILTER":
      return {
        ...state,
        filter: action.payload.filter,
      };

    case "SET_LOADING":
      return {
        ...state,
        loading: action.payload.loading,
      };

    case "SET_ERROR":
      return {
        ...state,
        error: action.payload.error,
      };

    default:
      return state;
  }
}

interface TodoContextType {
  state: TodoState;
  dispatch: React.Dispatch<TodoAction>;
  addTodo: (text: string) => void;
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
  setFilter: (filter: TodoState["filter"]) => void;
  filteredTodos: Todo[];
}

const TodoContext = createContext<TodoContextType | undefined>(undefined);

function useTodos(): TodoContextType {
  const context = useContext(TodoContext);
  if (context === undefined) {
    throw new Error("useTodos must be used within a TodoProvider");
  }
  return context;
}

function TodoProvider({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  const [state, dispatch] = React.useReducer(todoReducer, {
    todos: [],
    filter: "all",
    loading: false,
    error: null,
  });

  const addTodo = useCallback((text: string) => {
    dispatch({ type: "ADD_TODO", payload: { text } });
  }, []);

  const toggleTodo = useCallback((id: string) => {
    dispatch({ type: "TOGGLE_TODO", payload: { id } });
  }, []);

  const deleteTodo = useCallback((id: string) => {
    dispatch({ type: "DELETE_TODO", payload: { id } });
  }, []);

  const setFilter = useCallback((filter: TodoState["filter"]) => {
    dispatch({ type: "SET_FILTER", payload: { filter } });
  }, []);

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

  const value = useMemo<TodoContextType>(
    () => ({
      state,
      dispatch,
      addTodo,
      toggleTodo,
      deleteTodo,
      setFilter,
      filteredTodos,
    }),
    [state, addTodo, toggleTodo, deleteTodo, setFilter, filteredTodos]
  );

  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>;
}
```

### Day 32-34: カスタムフックの設計パターン

#### 🎯 実用的なカスタムフック

```typescript
// 5. データフェッチング用カスタムフック
interface UseApiOptions<T> {
  enabled?: boolean;
  refetchInterval?: number;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  dependencies?: React.DependencyList;
}

interface UseApiResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  mutate: (data: T) => void; // 楽観的更新用
}

function useApi<T>(
  fetcher: () => Promise<T>,
  options: UseApiOptions<T> = {}
): UseApiResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const {
    enabled = true,
    refetchInterval,
    onSuccess,
    onError,
    dependencies = [],
  } = options;

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetcher();
      setData(result);
      onSuccess?.(result);
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Unknown error");
      setError(error);
      onError?.(error);
    } finally {
      setLoading(false);
    }
  }, [fetcher, onSuccess, onError]);

  const mutate = useCallback((newData: T) => {
    setData(newData);
  }, []);

  useEffect(() => {
    if (enabled) {
      void fetchData();
    }
  }, [enabled, fetchData, ...dependencies]);

  useEffect(() => {
    if (refetchInterval && enabled) {
      const interval = setInterval(() => {
        void fetchData();
      }, refetchInterval);

      return () => clearInterval(interval);
    }
  }, [refetchInterval, enabled, fetchData]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
    mutate,
  };
}

// 使用例
function UserProfile({ userId }: { userId: string }): JSX.Element {
  const {
    data: user,
    loading,
    error,
    refetch,
  } = useApi<User>(
    () => fetch(`/api/users/${userId}`).then((res) => res.json()),
    {
      enabled: !!userId,
      onSuccess: (user) => console.log("User loaded:", user.name),
      dependencies: [userId],
    }
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!user) return <div>No user found</div>;

  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
      <button onClick={() => void refetch()}>Refresh</button>
    </div>
  );
}

// 6. ローカルストレージ用カスタムフック
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
    (value: T | ((prev: T) => T)) => {
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

// 7. デバウンス用カスタムフック
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// 8. 非同期処理用カスタムフック
interface UseAsyncResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  execute: (...args: any[]) => Promise<void>;
  reset: () => void;
}

function useAsync<T>(
  asyncFunction: (...args: any[]) => Promise<T>
): UseAsyncResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(
    async (...args: any[]) => {
      try {
        setLoading(true);
        setError(null);
        const result = await asyncFunction(...args);
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Unknown error"));
      } finally {
        setLoading(false);
      }
    },
    [asyncFunction]
  );

  const reset = useCallback(() => {
    setData(null);
    setLoading(false);
    setError(null);
  }, []);

  return {
    data,
    loading,
    error,
    execute,
    reset,
  };
}

// 9. インターバル用カスタムフック
function useInterval(callback: () => void, delay: number | null): void {
  const savedCallback = useRef<() => void>();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    function tick() {
      savedCallback.current?.();
    }

    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

// 10. 前の値を記憶するカスタムフック
function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>();

  useEffect(() => {
    ref.current = value;
  });

  return ref.current;
}
```

### Day 35: 状態ロジックの抽象化

#### 🎯 複雑な状態管理の抽象化

```typescript
// 11. カウンター用カスタムフック
interface UseCounterOptions {
  min?: number;
  max?: number;
  step?: number;
}

interface UseCounterResult {
  count: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
  set: (value: number) => void;
}

function useCounter(
  initialValue: number = 0,
  options: UseCounterOptions = {}
): UseCounterResult {
  const { min, max, step = 1 } = options;
  const [count, setCount] = useState(initialValue);

  const increment = useCallback(() => {
    setCount((prev) => {
      const newValue = prev + step;
      return max !== undefined ? Math.min(newValue, max) : newValue;
    });
  }, [step, max]);

  const decrement = useCallback(() => {
    setCount((prev) => {
      const newValue = prev - step;
      return min !== undefined ? Math.max(newValue, min) : newValue;
    });
  }, [step, min]);

  const reset = useCallback(() => {
    setCount(initialValue);
  }, [initialValue]);

  const set = useCallback((value: number) => {
    setCount(value);
  }, []);

  return {
    count,
    increment,
    decrement,
    reset,
    set,
  };
}

// 12. トグル用カスタムフック
function useToggle(
  initialValue: boolean = false
): [boolean, () => void, (value: boolean) => void] {
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback(() => {
    setValue((prev) => !prev);
  }, []);

  const set = useCallback((newValue: boolean) => {
    setValue(newValue);
  }, []);

  return [value, toggle, set];
}

// 13. 配列操作用カスタムフック
interface UseArrayResult<T> {
  array: T[];
  set: (array: T[]) => void;
  push: (item: T) => void;
  filter: (callback: (item: T) => boolean) => void;
  update: (index: number, item: T) => void;
  remove: (index: number) => void;
  clear: () => void;
}

function useArray<T>(initialArray: T[] = []): UseArrayResult<T> {
  const [array, setArray] = useState<T[]>(initialArray);

  const push = useCallback((item: T) => {
    setArray((prev) => [...prev, item]);
  }, []);

  const filter = useCallback((callback: (item: T) => boolean) => {
    setArray((prev) => prev.filter(callback));
  }, []);

  const update = useCallback((index: number, item: T) => {
    setArray((prev) =>
      prev.map((prevItem, i) => (i === index ? item : prevItem))
    );
  }, []);

  const remove = useCallback((index: number) => {
    setArray((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const clear = useCallback(() => {
    setArray([]);
  }, []);

  const set = useCallback((newArray: T[]) => {
    setArray(newArray);
  }, []);

  return {
    array,
    set,
    push,
    filter,
    update,
    remove,
    clear,
  };
}
```

## 🎯 実践演習

### 演習 5-1: Context システム構築 🔰

```typescript
// 以下の要件を満たすContext システムを実装せよ

// 1. ショッピングカート Context
interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartContextType {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

// 要件:
// - 型安全なカート操作
// - 自動計算（合計金額・個数）
// - ローカルストレージ同期
// - 楽観的更新

// 2. 通知システム Context
interface Notification {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, "id">) => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

// 要件:
// - 自動削除機能
// - アニメーション対応
// - 最大表示数制限
// - アクション付き通知
```

### 演習 5-2: カスタムフックライブラリ 🔶

```typescript
// 以下の要件を満たすカスタムフックライブラリを実装せよ

// 1. useInfiniteScroll
interface UseInfiniteScrollOptions {
  threshold?: number;
  hasMore: boolean;
  loading: boolean;
}

interface UseInfiniteScrollResult {
  ref: React.RefObject<HTMLDivElement>;
  loadMore: () => void;
}

function useInfiniteScroll(
  onLoadMore: () => void,
  options: UseInfiniteScrollOptions
): UseInfiniteScrollResult;

// 2. useClickOutside
function useClickOutside<T extends HTMLElement>(
  handler: () => void
): React.RefObject<T>;

// 3. useMediaQuery
function useMediaQuery(query: string): boolean;

// 4. useKeyPress
function useKeyPress(
  targetKey: string,
  handler: () => void,
  options?: { preventDefault?: boolean }
): void;

// 要件:
// - 完全な型安全性
// - メモリリーク防止
// - パフォーマンス最適化
// - 再利用性の確保
```

### 演習 5-3: 実用的な状態管理アプリ 🔥

```typescript
// 以下の要件を満たすブログ管理アプリを実装せよ

interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: User;
  tags: string[];
  publishedAt?: Date;
  updatedAt: Date;
  status: "draft" | "published" | "archived";
}

interface BlogContextType {
  posts: BlogPost[];
  currentPost: BlogPost | null;
  loading: boolean;
  error: string | null;

  // CRUD操作
  createPost: (post: Omit<BlogPost, "id" | "updatedAt">) => Promise<void>;
  updatePost: (id: string, updates: Partial<BlogPost>) => Promise<void>;
  deletePost: (id: string) => Promise<void>;
  publishPost: (id: string) => Promise<void>;

  // フィルタリング・検索
  searchPosts: (query: string) => void;
  filterByTag: (tag: string) => void;
  filterByStatus: (status: BlogPost["status"]) => void;

  // ページネーション
  loadMore: () => Promise<void>;
  hasMore: boolean;
}

// 要件:
// - リアルタイム更新
// - 楽観的更新
// - エラーハンドリング
// - キャッシュ管理
// - 検索・フィルタリング
// - 無限スクロール
// - 自動保存機能
```

## 📊 Step 5 評価基準

### 理解度チェックリスト

#### Context API (35%)

- [ ] 型安全な Context を作成できる
- [ ] Provider パターンを適切に実装できる
- [ ] 複数 Context の組み合わせができる
- [ ] パフォーマンスを考慮した実装ができる

#### カスタムフック (40%)

- [ ] 再利用可能なカスタムフックを設計できる
- [ ] 複雑な状態ロジックを抽象化できる
- [ ] 副作用を適切に管理できる
- [ ] 型安全な API を提供できる

#### 状態管理設計 (20%)

- [ ] 適切な状態管理パターンを選択できる
- [ ] グローバル状態とローカル状態を使い分けできる
- [ ] 状態の正規化ができる
- [ ] パフォーマンス最適化を実装できる

#### 実践応用 (5%)

- [ ] 実用的なアプリケーションを設計できる
- [ ] 保守性の高いコード設計ができる
- [ ] エラーハンドリングを適切に行える
- [ ] テスタブルなコードを書ける

### 成果物チェックリスト

- [ ] **Context システム**: テーマ・認証・通知等の統合システム
- [ ] **カスタムフックライブラリ**: 10 個以上の再利用可能フック
- [ ] **状態管理アプリ**: ブログ管理等の実用的アプリケーション
- [ ] **パフォーマンス最適化**: メモ化とレンダリング最適化

## 🔄 Step 6 への準備

### 次週学習内容の予習

```typescript
// Step 6で学習する状態管理ライブラリの基礎概念

// 1. Zustand の基本
import { create } from "zustand";

interface CounterStore {
  count: number;
  increment: () => void;
  decrement: () => void;
}

const useCounterStore = create<CounterStore>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
}));

// 2. TanStack Query の基本
import { useQuery, useMutation } from "@tanstack/react-query";

function useUsers() {
  return useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });
}
```

---

**📌 重要**: Step 5 は React の状態管理を完全に理解し、実践的なアプリケーション開発の基盤を築く重要な期間です。Context API とカスタムフックの習得により、後の高度な状態管理ライブラリ学習がスムーズに進みます。
