# Week 6: 状態管理ライブラリ統合

## 📅 学習期間・目標

**期間**: Week 6（7日間）
**総学習時間**: 12時間（平日1.5時間、週末3時間）
**学習スタイル**: 理論20% + 実践コード50% + 演習30%

### 🎯 Week 6 到達目標

- [ ] Zustand + TypeScriptの完全習得
- [ ] TanStack Query（React Query）の型安全な活用
- [ ] 状態管理ライブラリの適切な選択
- [ ] 楽観的更新とキャッシュ戦略
- [ ] 実用的な状態管理アーキテクチャの構築

## 📚 理論学習内容

### Day 36-38: Zustand + TypeScript

#### 🎯 Zustandの型安全な実装

```typescript
// 1. 基本的なZustandストア
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface CounterStore {
  count: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
  setCount: (count: number) => void;
}

const useCounterStore = create<CounterStore>()(
  devtools(
    (set) => ({
      count: 0,
      increment: () => set((state) => ({ count: state.count + 1 })),
      decrement: () => set((state) => ({ count: state.count - 1 })),
      reset: () => set({ count: 0 }),
      setCount: (count) => set({ count }),
    }),
    { name: 'counter-store' }
  )
);

// 2. 複雑な状態管理
interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

interface UserStore {
  users: User[];
  currentUser: User | null;
  loading: boolean;
  error: string | null;
  
  // Actions
  setUsers: (users: User[]) => void;
  addUser: (user: User) => void;
  updateUser: (id: string, updates: Partial<User>) => void;
  deleteUser: (id: string) => void;
  setCurrentUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Async Actions
  fetchUsers: () => Promise<void>;
  createUser: (userData: Omit<User, 'id'>) => Promise<void>;
}

const useUserStore = create<UserStore>()(
  devtools(
    persist(
      (set, get) => ({
        users: [],
        currentUser: null,
        loading: false,
        error: null,

        setUsers: (users) => set({ users }),
        addUser: (user) => set((state) => ({ users: [...state.users, user] })),
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
        setLoading: (loading) => set({ loading }),
        setError: (error) => set({ error }),

        fetchUsers: async () => {
          try {
            set({ loading: true, error: null });
            const response = await fetch('/api/users');
            if (!response.ok) throw new Error('Failed to fetch users');
            const users = await response.json() as User[];
            set({ users, loading: false });
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Unknown error',
              loading: false,
            });
          }
        },

        createUser: async (userData) => {
          try {
            set({ loading: true, error: null });
            const response = await fetch('/api/users', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(userData),
            });
            if (!response.ok) throw new Error('Failed to create user');
            const newUser = await response.json() as User;
            set((state) => ({
              users: [...state.users, newUser],
              loading: false,
            }));
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Unknown error',
              loading: false,
            });
          }
        },
      }),
      {
        name: 'user-store',
        partialize: (state) => ({ currentUser: state.currentUser }),
      }
    ),
    { name: 'user-store' }
  )
);

// 3. ストアの分割とセレクター
const useUserActions = () => useUserStore((state) => ({
  fetchUsers: state.fetchUsers,
  createUser: state.createUser,
  updateUser: state.updateUser,
  deleteUser: state.deleteUser,
}));

const useUserData = () => useUserStore((state) => ({
  users: state.users,
  currentUser: state.currentUser,
  loading: state.loading,
  error: state.error,
}));
```

### Day 39-41: TanStack Query + TypeScript

#### 🎯 TanStack Queryの型安全な実装

```typescript
// 4. TanStack Query基本設定
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// API型定義
interface ApiResponse<T> {
  data: T;
  message: string;
  status: number;
}

interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Query Keys の型安全な定義
const queryKeys = {
  users: {
    all: ['users'] as const,
    lists: () => [...queryKeys.users.all, 'list'] as const,
    list: (filters: UserFilters) => [...queryKeys.users.lists(), filters] as const,
    details: () => [...queryKeys.users.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.users.details(), id] as const,
  },
  posts: {
    all: ['posts'] as const,
    lists: () => [...queryKeys.posts.all, 'list'] as const,
    list: (filters: PostFilters) => [...queryKeys.posts.lists(), filters] as const,
  },
} as const;

interface UserFilters {
  role?: 'admin' | 'user';
  search?: string;
  page?: number;
  limit?: number;
}

// カスタムフック
function useUsers(filters: UserFilters = {}) {
  return useQuery({
    queryKey: queryKeys.users.list(filters),
    queryFn: (): Promise<PaginatedResponse<User>> => 
      fetch(`/api/users?${new URLSearchParams(filters as any)}`).then(res => res.json()),
    staleTime: 5 * 60 * 1000, // 5分
    gcTime: 10 * 60 * 1000, // 10分
  });
}

function useUser(id: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.users.detail(id),
    queryFn: (): Promise<ApiResponse<User>> =>
      fetch(`/api/users/${id}`).then(res => res.json()),
    enabled: enabled && !!id,
  });
}

// Mutation
function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userData: Omit<User, 'id'>): Promise<ApiResponse<User>> =>
      fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      }).then(res => res.json()),
    
    onSuccess: (response) => {
      // 詳細キャッシュを更新
      queryClient.setQueryData(
        queryKeys.users.detail(response.data.id),
        response
      );

      // リストキャッシュを無効化
      queryClient.invalidateQueries({
        queryKey: queryKeys.users.lists(),
      });
    },
    
    onMutate: async (newUser) => {
      // 楽観的更新
      await queryClient.cancelQueries({
        queryKey: queryKeys.users.lists(),
      });

      const previousUsers = queryClient.getQueryData(queryKeys.users.lists());

      queryClient.setQueryData(queryKeys.users.lists(), (old: any) => {
        if (!old) return old;
        return {
          ...old,
          data: [...old.data, { ...newUser, id: 'temp-id' }],
        };
      });

      return { previousUsers };
    },
    
    onError: (err, newUser, context) => {
      // エラー時のロールバック
      if (context?.previousUsers) {
        queryClient.setQueryData(queryKeys.users.lists(), context.previousUsers);
      }
    },
  });
}

// 5. 無限クエリ
interface PostFilters {
  category?: string;
  search?: string;
}

function useInfinitePosts(filters: PostFilters = {}) {
  return useInfiniteQuery({
    queryKey: queryKeys.posts.list(filters),
    queryFn: ({ pageParam = 1 }): Promise<PaginatedResponse<Post>> =>
      fetch(`/api/posts?page=${pageParam}&${new URLSearchParams(filters as any)}`)
        .then(res => res.json()),
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
    initialPageParam: 1,
  });
}
```

### Day 42: 統合アーキテクチャ

#### 🎯 Zustand + TanStack Query統合

```typescript
// 6. 統合状態管理アーキテクチャ
interface AppStore {
  // UI状態
  theme: 'light' | 'dark';
  sidebarOpen: boolean;
  notifications: Notification[];
  
  // UI Actions
  toggleTheme: () => void;
  toggleSidebar: () => void;
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
  
  // サーバー状態は TanStack Query で管理
  // ローカル状態のみ Zustand で管理
}

const useAppStore = create<AppStore>()(
  devtools(
    persist(
      (set) => ({
        theme: 'light',
        sidebarOpen: true,
        notifications: [],

        toggleTheme: () =>
          set((state) => ({
            theme: state.theme === 'light' ? 'dark' : 'light',
          })),
        
        toggleSidebar: () =>
          set((state) => ({ sidebarOpen: !state.sidebarOpen })),
        
        addNotification: (notification) =>
          set((state) => ({
            notifications: [
              ...state.notifications,
              { ...notification, id: crypto.randomUUID() },
            ],
          })),
        
        removeNotification: (id) =>
          set((state) => ({
            notifications: state.notifications.filter((n) => n.id !== id),
          })),
      }),
      {
        name: 'app-store',
        partialize: (state) => ({ theme: state.theme, sidebarOpen: state.sidebarOpen }),
      }
    )
  )
);

// 7. カスタムフックでの統合
function useAppData() {
  const appState = useAppStore();
  const usersQuery = useUsers();
  const postsQuery = useInfinitePosts();

  return {
    // UI状態
    theme: appState.theme,
    sidebarOpen: appState.sidebarOpen,
    notifications: appState.notifications,
    
    // UI Actions
    toggleTheme: appState.toggleTheme,
    toggleSidebar: appState.toggleSidebar,
    addNotification: appState.addNotification,
    removeNotification: appState.removeNotification,
    
    // サーバー状態
    users: usersQuery.data?.data || [],
    usersLoading: usersQuery.isLoading,
    usersError: usersQuery.error,
    
    posts: postsQuery.data?.pages.flatMap(page => page.data) || [],
    postsLoading: postsQuery.isLoading,
    postsError: postsQuery.error,
    loadMorePosts: postsQuery.fetchNextPage,
    hasMorePosts: postsQuery.hasNextPage,
  };
}
```

## 🎯 実践演習

### 演習 6-1: Eコマースアプリ状態管理 🔰

```typescript
// 以下の要件を満たすEコマースアプリの状態管理を実装せよ

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  stock: number;
  images: string[];
}

interface CartItem {
  product: Product;
  quantity: number;
}

interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered';
  createdAt: Date;
}

// 要件:
// - 商品一覧・詳細（TanStack Query）
// - カート管理（Zustand）
// - 注文履歴（TanStack Query）
// - 楽観的更新
// - オフライン対応
// - 検索・フィルタリング
```

### 演習 6-2: リアルタイムチャットアプリ 🔶

```typescript
// 以下の要件を満たすチャットアプリの状態管理を実装せよ

interface Message {
  id: string;
  content: string;
  senderId: string;
  roomId: string;
  timestamp: Date;
  type: 'text' | 'image' | 'file';
}

interface Room {
  id: string;
  name: string;
  members: User[];
  lastMessage?: Message;
  unreadCount: number;
}

// 要件:
// - WebSocket統合
// - メッセージ履歴管理
// - 未読カウント
// - タイピングインジケーター
// - ファイルアップロード
// - プッシュ通知
```

## 📊 Week 6 評価基準

### 理解度チェックリスト

#### Zustand (35%)
- [ ] 型安全なストアを作成できる
- [ ] ミドルウェアを適切に活用できる
- [ ] 状態の分割・セレクターを実装できる
- [ ] 非同期処理を適切に管理できる

#### TanStack Query (40%)
- [ ] 型安全なクエリを実装できる
- [ ] キャッシュ戦略を理解している
- [ ] 楽観的更新を実装できる
- [ ] 無限クエリを活用できる

#### 統合アーキテクチャ (20%)
- [ ] 適切な状態管理の分離ができる
- [ ] ライブラリの使い分けができる
- [ ] パフォーマンスを考慮した実装ができる
- [ ] 実用的なアーキテクチャを設計できる

#### 実践応用 (5%)
- [ ] 複雑なアプリケーションを設計できる
- [ ] エラーハンドリングを適切に行える
- [ ] テスタブルなコードを書ける
- [ ] 保守性の高い設計ができる

### 成果物チェックリスト

- [ ] **Zustand実装**: 複雑な状態管理システム
- [ ] **TanStack Query統合**: データフェッチ・キャッシュ戦略
- [ ] **統合アーキテクチャ**: Zustand + TanStack Query
- [ ] **実用アプリケーション**: Eコマース・チャット等

## 🔄 Week 7 への準備

### 次週学習内容の予習

```typescript
// Week 7で学習する高度なReactパターンの基礎概念

// 1. Higher-Order Components
function withAuth<P extends object>(Component: React.ComponentType<P>) {
  return (props: P) => {
    // 実装
    return <Component {...props} />;
  };
}

// 2. Render Props
interface RenderPropsExample {
  children: (data: any) => React.ReactNode;
}

// 3. Compound Components
interface TabsContextType {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}
```

---

**📌 重要**: Week 6 は実用的な状態管理ライブラリの習得により、プロダクションレベルのアプリケーション開発能力を身につける重要な期間です。