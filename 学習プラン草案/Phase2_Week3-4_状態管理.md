# Phase 2: Week 3-4 状態管理 - TypeScript × React 状態管理パターン

## 📅 学習期間・目標

**期間**: Week 3-4（2 週間）  
**総学習時間**: 40 時間（週 20 時間）

### 🎯 Week 3-4 到達目標

- [ ] React Hooks の型安全な活用
- [ ] Context API の完全理解と実践
- [ ] カスタムフックの設計・実装
- [ ] 状態管理ライブラリ（Zustand）の習得
- [ ] 非同期状態管理（TanStack Query）の実践

## 📖 理論学習内容

### Day 15-18: React Hooks の型安全な活用

#### useState の高度な型活用

```typescript
// 1. 基本的な useState の型定義
import React, { useState, useCallback, useMemo } from "react";

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
```

#### useReducer の型安全な実装

```typescript
// 3. useReducer の型定義
interface TodoState {
  todos: Todo[];
  filter: "all" | "active" | "completed";
  loading: boolean;
  error: string | null;
}

interface Todo {
  id: number;
  text: string;
  completed: boolean;
  createdAt: Date;
}

// Action の型定義
type TodoAction =
  | { type: "ADD_TODO"; payload: { text: string } }
  | { type: "TOGGLE_TODO"; payload: { id: number } }
  | { type: "DELETE_TODO"; payload: { id: number } }
  | { type: "SET_FILTER"; payload: { filter: TodoState["filter"] } }
  | { type: "SET_LOADING"; payload: { loading: boolean } }
  | { type: "SET_ERROR"; payload: { error: string | null } }
  | { type: "LOAD_TODOS_SUCCESS"; payload: { todos: Todo[] } };

// Reducer の実装
const todoReducer = (state: TodoState, action: TodoAction): TodoState => {
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

    default:
      return state;
  }
};
```

### Day 19-21: Context API の完全理解

#### 型安全な Context の実装

```typescript
// 4. Context の型定義
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

// Context の作成
const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

// カスタムフック for Context
function useAuth(): AuthContextType {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Provider の実装
interface AuthProviderProps {
  children: React.ReactNode;
}

function AuthProvider({ children }: AuthProviderProps): JSX.Element {
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

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      login,
      logout: () => setUser(null),
      register: async () => {},
      loading,
      error,
    }),
    [user, login, loading, error]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
```

### Day 22-28: カスタムフックとライブラリ活用

#### Zustand による状態管理

```typescript
// 5. Zustand Store の型安全な実装
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface UserStore {
  // State
  users: User[];
  currentUser: User | null;
  loading: boolean;
  error: string | null;

  // Actions
  setUsers: (users: User[]) => void;
  addUser: (user: User) => void;
  updateUser: (id: number, updates: Partial<User>) => void;
  deleteUser: (id: number) => void;
  setCurrentUser: (user: User | null) => void;

  // Async Actions
  fetchUsers: () => Promise<void>;
  createUser: (userData: Omit<User, "id">) => Promise<void>;
}

const useUserStore = create<UserStore>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial State
        users: [],
        currentUser: null,
        loading: false,
        error: null,

        // Sync Actions
        setUsers: (users) => set({ users }),

        addUser: (user) =>
          set((state) => ({
            users: [...state.users, user],
          })),

        updateUser: (id, updates) =>
          set((state) => ({
            users: state.users.map((user) =>
              user.id === id ? { ...user, ...updates } : user
            ),
          })),

        deleteUser: (id) =>
          set((state) => ({
            users: state.users.filter((user) => user.id !== id),
          })),

        setCurrentUser: (user) => set({ currentUser: user }),

        // Async Actions
        fetchUsers: async () => {
          try {
            set({ loading: true, error: null });
            const response = await fetch("/api/users");

            if (!response.ok) {
              throw new Error("Failed to fetch users");
            }

            const users = (await response.json()) as User[];
            set({ users, loading: false });
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : "Unknown error",
              loading: false,
            });
          }
        },

        createUser: async (userData) => {
          try {
            set({ loading: true, error: null });
            const response = await fetch("/api/users", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(userData),
            });

            if (!response.ok) {
              throw new Error("Failed to create user");
            }

            const newUser = (await response.json()) as User;
            set((state) => ({
              users: [...state.users, newUser],
              loading: false,
            }));
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : "Unknown error",
              loading: false,
            });
          }
        },
      }),
      {
        name: "user-store",
        partialize: (state) => ({
          currentUser: state.currentUser,
        }),
      }
    ),
    { name: "user-store" }
  )
);
```

## 🎯 実践演習

### 演習 3-1: 型安全な状態管理システム 🔶

**目標**: 複雑な状態管理の実装

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

// 2. ユーザー認証状態
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  permissions: string[];
  sessionExpiry: Date | null;
}

// 実装要件:
// - Context API または Zustand を使用
// - 型安全な Action/Mutation の実装
// - ローカルストレージとの同期
// - 楽観的更新の実装
// - エラーハンドリングの充実
// - パフォーマンス最適化
```

### 演習 3-2: カスタムフックライブラリ 🔥

**目標**: 再利用可能なカスタムフック集の作成

```typescript
// 以下のカスタムフックを実装せよ

// 1. useLocalStorage - ローカルストレージとの同期
function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void];

// 2. useDebounce - 値のデバウンス処理
function useDebounce<T>(value: T, delay: number): T;

// 3. useAsync - 非同期処理の状態管理
interface UseAsyncResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  execute: (...args: any[]) => Promise<void>;
  reset: () => void;
}

function useAsync<T>(
  asyncFunction: (...args: any[]) => Promise<T>
): UseAsyncResult<T>;

// 実装要件:
// - 完全な型安全性
// - メモリリークの防止
// - 適切なクリーンアップ
// - エラーハンドリング
// - テストの実装
```

## 📊 Week 3-4 評価基準

### 理解度チェックリスト

#### React Hooks (30%)

- [ ] useState/useReducer を型安全に使用できる
- [ ] useEffect の依存配列を適切に管理できる
- [ ] useCallback/useMemo を効果的に活用できる
- [ ] カスタムフックを設計・実装できる

#### Context API (25%)

- [ ] 型安全な Context を作成できる
- [ ] Provider パターンを適切に実装できる
- [ ] 複数 Context の組み合わせができる
- [ ] パフォーマンスを考慮した実装ができる

#### 状態管理ライブラリ (25%)

- [ ] Zustand を型安全に使用できる
- [ ] TanStack Query を活用できる
- [ ] 適切な状態設計ができる
- [ ] 非同期状態を効率的に管理できる

#### 実践応用 (20%)

- [ ] 複雑な状態管理システムを設計できる
- [ ] パフォーマンス最適化を実装できる
- [ ] エラーハンドリングを適切に行える
- [ ] テスタブルなコードを書ける

### 成果物チェックリスト

- [ ] **状態管理システム**: Context API + Zustand の統合実装
- [ ] **カスタムフックライブラリ**: 5 つ以上の再利用可能フック
- [ ] **非同期状態管理**: TanStack Query を活用したデータフェッチ
- [ ] **パフォーマンス最適化例**: メモ化とレンダリング最適化

## 🔄 Week 5-6 への準備

### 次週学習内容の予習

```typescript
// Week 5-6で学習する高度なReactパターンの基礎概念

// 1. Higher-Order Components
function withAuth<P extends object>(Component: React.ComponentType<P>) {
  return (props: P) => {
    // 実装
    return <Component {...props} />;
  };
}

// 2. Render Props パターン
interface RenderPropsExample {
  children: (data: any) => React.ReactNode;
}

// 3. Compound Components
interface TabsContextType {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}
```

### 環境準備

- [ ] パフォーマンス測定ツールの準備
- [ ] React DevTools Profiler の活用方法確認
- [ ] テストライブラリの拡張

---

**📌 重要**: Week 3-4 は React の状態管理を完全に理解し、実践的なアプリケーション開発の基盤を築く重要な期間です。型安全な状態管理パターンを確実に習得してください。
