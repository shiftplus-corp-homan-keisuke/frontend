# Phase 2: TypeScript × React 詳細学習プラン（2-4 ヶ月）

## 🎯 学習目標

TypeScript と React を組み合わせた型安全な開発手法の習得と実践的なアプリケーション開発

## 📅 8 週間学習スケジュール

### Week 1-2: React TypeScript 基礎・コンポーネント型設計

#### 📖 学習内容

- React + TypeScript 環境構築とベストプラクティス
- 型安全なコンポーネント設計パターン
- Props 型設計と Generic Components

#### 🎯 週次目標

**Week 1:**

- [ ] React + TypeScript プロジェクトセットアップ
- [ ] 基本的なコンポーネント型設計
- [ ] Props 型と defaultProps の型安全な定義

**Week 2:**

- [ ] Generic Components の実装
- [ ] Compound Components パターン
- [ ] Ref 型安全性の確保

#### 📝 実践演習

**演習 2-1: 型安全な UI コンポーネント作成**

```typescript
// 以下の要件を満たすコンポーネントを実装せよ

// 1. 型安全なButtonコンポーネント
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant: "primary" | "secondary" | "danger";
  size: "sm" | "md" | "lg";
  loading?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant, size, loading, icon, children, ...props }, ref) => {
    // 実装
  }
);

// 2. 型安全なGeneric Tableコンポーネント
interface Column<T> {
  key: keyof T;
  title: string;
  width?: number;
  render?: (value: T[keyof T], record: T, index: number) => React.ReactNode;
  sorter?: (a: T, b: T) => number;
}

interface TableProps<T extends Record<string, any>> {
  data: T[];
  columns: Column<T>[];
  onRowClick?: (record: T, index: number) => void;
  loading?: boolean;
  pagination?: {
    current: number;
    pageSize: number;
    total: number;
    onChange: (page: number, pageSize: number) => void;
  };
}

function Table<T extends Record<string, any>>(props: TableProps<T>) {
  // 実装
}

// 使用例で型推論が正しく働くことを確認
interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "user";
}

const users: User[] = [
  /* ... */
];

<Table
  data={users}
  columns={[
    { key: "name", title: "Name" },
    {
      key: "role",
      title: "Role",
      render: (role) => <Badge variant={role}>{role}</Badge>, // roleの型が'admin' | 'user'として推論される
    },
  ]}
  onRowClick={(user) => console.log(user.id)} // userの型がUserとして推論される
/>;
```

**演習 2-2: Compound Components パターン実装**

```typescript
// SelectコンポーネントをCompound Componentsパターンで実装せよ

// 使用例:
<Select value={selectedValue} onChange={setSelectedValue}>
  <Select.Trigger placeholder="選択してください" />
  <Select.Options>
    <Select.Option value="option1">オプション1</Select.Option>
    <Select.Option value="option2">オプション2</Select.Option>
    <Select.Option value="option3">オプション3</Select.Option>
  </Select.Options>
</Select>;

// 要件:
// 1. 型安全なvalue/onChangeの制御
// 2. 子コンポーネント間での状態共有
// 3. 適切なContextの型定義
// 4. キーボードナビゲーション対応

interface SelectContextValue<T> {
  value: T | null;
  onChange: (value: T) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

interface SelectProps<T> {
  value: T | null;
  onChange: (value: T) => void;
  children: React.ReactNode;
}

// SelectContextの型安全な作成とuseSelectHookの実装
function createSelectContext<T>() {
  return React.createContext<SelectContextValue<T> | null>(null);
}

// 実装
```

### Week 3-4: Custom Hooks 型設計・Context 型安全性

#### 📖 学習内容

- 型安全な Custom Hooks の設計パターン
- Context API の型安全な活用
- State 型管理と Effect 依存型

#### 🎯 週次目標

**Week 3:**

- [ ] Generic Custom Hooks の実装
- [ ] Overloaded Hook Pattern の活用
- [ ] Hook 型推論の最適化

**Week 4:**

- [ ] 型安全な Context 設計
- [ ] グローバル状態管理の型安全性
- [ ] Effect 依存配列の型チェック

#### 📝 実践演習

**演習 3-1: 高度な Custom Hooks 実装**

```typescript
// 以下のCustom Hooksを型安全に実装せよ

// 1. useApiHook - Generic API フェッチフック
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
  options?: UseApiOptions<T>
): UseApiResult<T> {
  // 実装
}

// 2. useLocalStorage - オーバーロードパターン
function useLocalStorage<T>(key: string): [T | null, (value: T | null) => void];
function useLocalStorage<T>(
  key: string,
  defaultValue: T
): [T, (value: T) => void];
function useLocalStorage<T>(key: string, defaultValue?: T) {
  // 実装
}

// 3. useForm - 型安全なフォーム管理
interface UseFormOptions<T extends Record<string, any>> {
  initialValues: T;
  validationSchema?: ValidationSchema<T>;
  onSubmit: (values: T) => Promise<void> | void;
}

interface ValidationRule<T> {
  required?: boolean;
  min?: number;
  max?: number;
  pattern?: RegExp;
  custom?: (value: T) => string | null;
}

type ValidationSchema<T> = {
  [K in keyof T]?: ValidationRule<T[K]>;
};

interface UseFormResult<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  setValue: <K extends keyof T>(key: K, value: T[K]) => void;
  setError: <K extends keyof T>(key: K, error: string) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  reset: () => void;
  isValid: boolean;
  isSubmitting: boolean;
}

function useForm<T extends Record<string, any>>(
  options: UseFormOptions<T>
): UseFormResult<T> {
  // 実装
}

// 使用例
const { values, errors, setValue, handleSubmit } = useForm({
  initialValues: {
    name: "",
    email: "",
    age: 0,
  },
  validationSchema: {
    name: { required: true, min: 2 },
    email: { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
    age: { required: true, min: 18 },
  },
  onSubmit: async (values) => {
    // values の型が { name: string; email: string; age: number } として推論される
  },
});
```

**演習 3-2: 型安全な Context 設計**

```typescript
// アプリケーション全体のテーマ管理Contextを実装せよ

interface Theme {
  name: "light" | "dark";
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
    border: string;
  };
  typography: {
    fontFamily: string;
    fontSize: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
    };
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
}

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme["name"]) => void;

  // CSS-in-JS用のヘルパー
  getColor: (key: keyof Theme["colors"]) => string;
  getFontSize: (key: keyof Theme["typography"]["fontSize"]) => string;
  getSpacing: (key: keyof Theme["spacing"]) => string;
}

// 要件:
// 1. Contextの型安全な作成
// 2. Provider の実装
// 3. useTheme hook の型安全な実装
// 4. Theme切り替えの永続化（localStorage）
// 5. CSS custom properties との連携

const ThemeContext = React.createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // 実装
}

export function useTheme(): ThemeContextValue {
  const context = React.useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}

// 使用例でのスタイル型チェック
function StyledComponent() {
  const { getColor, getFontSize } = useTheme();

  return (
    <div
      style={{
        color: getColor("primary"), // 型安全
        fontSize: getFontSize("md"), // 型安全
        // color: getColor('invalid'), // Error
      }}
    >
      Content
    </div>
  );
}
```

### Week 5-6: 状態管理ライブラリ統合・パターン実装

#### 📖 学習内容

- Zustand + TypeScript 実装パターン
- TanStack Query + TypeScript 統合
- React Hook Form + Zod 統合

#### 🎯 週次目標

**Week 5:**

- [ ] Zustand での型安全な状態管理
- [ ] TanStack Query のキャッシュ型管理
- [ ] Optimistic Updates の型安全実装

**Week 6:**

- [ ] React Hook Form + Zod スキーマ統合
- [ ] フォームバリデーションの型安全性
- [ ] 複雑なフォーム状態の管理

#### 📝 実践演習

**演習 5-1: Zustand + TypeScript 実装**

```typescript
// エコマースアプリの状態管理をZustand + TypeScriptで実装せよ

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  stock: number;
  imageUrl: string;
}

interface CartItem {
  product: Product;
  quantity: number;
}

interface User {
  id: string;
  name: string;
  email: string;
  address?: Address;
}

interface Address {
  street: string;
  city: string;
  zipCode: string;
  country: string;
}

// CartStore
interface CartStore {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;

  // Actions
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;

  // Computed
  getItemQuantity: (productId: string) => number;
  isInCart: (productId: string) => boolean;
}

// UserStore
interface UserStore {
  user: User | null;
  loading: boolean;
  error: string | null;

  // Actions
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  updateAddress: (address: Address) => Promise<void>;
}

// ProductStore
interface ProductStore {
  products: Product[];
  categories: string[];
  loading: boolean;
  error: string | null;
  filters: {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    searchQuery?: string;
  };

  // Actions
  fetchProducts: () => Promise<void>;
  fetchCategories: () => Promise<void>;
  setFilters: (filters: Partial<ProductStore["filters"]>) => void;
  clearFilters: () => void;

  // Computed
  filteredProducts: Product[];
}

// 実装要件:
// 1. 各ストアの型安全な実装
// 2. ストア間の連携（例：ユーザーのカート情報の永続化）
// 3. localStorage との同期
// 4. 楽観的更新とエラーハンドリング
// 5. computed values の効率的な実装

const useCartStore = create<CartStore>((set, get) => ({
  // 実装
}));

const useUserStore = create<UserStore>((set, get) => ({
  // 実装
}));

const useProductStore = create<ProductStore>((set, get) => ({
  // 実装
}));
```

**演習 5-2: TanStack Query + TypeScript 統合**

```typescript
// APIクライアントとTanStack Queryの完全型安全統合を実装せよ

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

interface CreateUserRequest {
  name: string;
  email: string;
  role: "admin" | "user";
}

interface UpdateUserRequest {
  name?: string;
  email?: string;
  role?: "admin" | "user";
}

// Query Keys の型安全な定義
const queryKeys = {
  users: {
    all: ["users"] as const,
    lists: () => [...queryKeys.users.all, "list"] as const,
    list: (filters: UserFilters) =>
      [...queryKeys.users.lists(), filters] as const,
    details: () => [...queryKeys.users.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.users.details(), id] as const,
  },
  products: {
    all: ["products"] as const,
    lists: () => [...queryKeys.products.all, "list"] as const,
    list: (filters: ProductFilters) =>
      [...queryKeys.products.lists(), filters] as const,
  },
} as const;

// カスタムhooksの実装
interface UseUsersQueryOptions {
  filters?: UserFilters;
  enabled?: boolean;
  refetchInterval?: number;
}

function useUsersQuery(options: UseUsersQueryOptions = {}) {
  return useQuery({
    queryKey: queryKeys.users.list(options.filters || {}),
    queryFn: (): Promise<PaginatedResponse<User>> =>
      api.users.getAll(options.filters),
    ...options,
  });
}

function useUserQuery(id: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.users.detail(id),
    queryFn: (): Promise<ApiResponse<User>> => api.users.getById(id),
    enabled: enabled && !!id,
  });
}

function useCreateUserMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userData: CreateUserRequest): Promise<ApiResponse<User>> =>
      api.users.create(userData),
    onSuccess: (response) => {
      // 型安全なキャッシュ更新
      queryClient.setQueryData(
        queryKeys.users.detail(response.data.id),
        response
      );

      // リスト キャッシュの無効化
      queryClient.invalidateQueries({
        queryKey: queryKeys.users.lists(),
      });
    },
    onMutate: async (newUser) => {
      // 楽観的更新の実装
      await queryClient.cancelQueries({
        queryKey: queryKeys.users.lists(),
      });

      const previousUsers = queryClient.getQueryData(queryKeys.users.lists());

      // 楽観的更新
      queryClient.setQueryData(queryKeys.users.lists(), (old: any) => {
        // 型安全な楽観的更新の実装
      });

      return { previousUsers };
    },
    onError: (err, newUser, context) => {
      // エラー時のロールバック
      if (context?.previousUsers) {
        queryClient.setQueryData(
          queryKeys.users.lists(),
          context.previousUsers
        );
      }
    },
  });
}

// 実装要件:
// 1. Query Keys の型安全な定義
// 2. カスタムhooksの完全な型推論
// 3. 楽観的更新の型安全な実装
// 4. エラーハンドリングの型安全性
// 5. キャッシュ管理の最適化
```

### Week 7-8: 実践プロジェクト・統合実装

#### 📖 学習内容

- 大規模 React アプリケーションの型安全設計
- エラーバウンダリと Suspense の型活用
- パフォーマンス最適化の型安全実装

#### 🎯 週次目標

**Week 7:**

- [ ] プロジェクトアーキテクチャの設計
- [ ] 型安全なルーティング実装
- [ ] エラーハンドリングシステム構築

**Week 8:**

- [ ] パフォーマンス最適化実装
- [ ] テスト実装と CI/CD 統合
- [ ] プロジェクト完成とレビュー

#### 📝 最終プロジェクト: タスク管理アプリケーション

**プロジェクト要件:**

```typescript
// 実装する機能と型安全要件

// 1. 認証システム
interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: "admin" | "member";
}

interface AuthStore {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;

  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  register: (userData: RegisterData) => Promise<void>;
  updateProfile: (updates: Partial<AuthUser>) => Promise<void>;
}

// 2. タスク管理システム
interface Task {
  id: string;
  title: string;
  description?: string;
  status: "todo" | "in-progress" | "completed";
  priority: "low" | "medium" | "high";
  assigneeId?: string;
  projectId: string;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
}

interface Project {
  id: string;
  name: string;
  description?: string;
  color: string;
  ownerId: string;
  memberIds: string[];
  createdAt: Date;
}

// 3. リアルタイム更新システム
interface WebSocketStore {
  connected: boolean;
  lastPing: Date | null;

  connect: () => void;
  disconnect: () => void;
  subscribe: <T>(channel: string, handler: (data: T) => void) => () => void;
  emit: <T>(event: string, data: T) => void;
}

// 4. 通知システム
interface Notification {
  id: string;
  type: "info" | "success" | "warning" | "error";
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
}

interface NotificationStore {
  notifications: Notification[];
  unreadCount: number;

  addNotification: (
    notification: Omit<Notification, "id" | "timestamp" | "read">
  ) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

// 実装要件:
// 1. 完全な型安全性（any型の使用禁止）
// 2. Reactの最新機能活用（Suspense, Error Boundary, Concurrent Features）
// 3. パフォーマンス最適化（React.memo, useMemo, useCallback の適切な使用）
// 4. アクセシビリティ対応
// 5. レスポンシブデザイン
// 6. リアルタイム更新
// 7. オフライン対応
// 8. テストカバレッジ80%以上
```

**技術スタック:**

- React 18 + TypeScript
- Zustand (状態管理)
- TanStack Query (サーバー状態)
- React Hook Form + Zod (フォーム)
- Framer Motion (アニメーション)
- React Router v6 (ルーティング)
- Socket.io (リアルタイム通信)
- Vitest + Testing Library (テスト)

## 📊 学習成果評価基準

### 🎯 理解度確認テスト

#### レベル 1: 基礎（Week 1-2）

- [ ] React + TypeScript 環境構築
- [ ] 基本的なコンポーネント型設計
- [ ] Props 型の適切な定義

#### レベル 2: 中級（Week 3-4）

- [ ] Custom Hooks の型安全な実装
- [ ] Context API の型安全な活用
- [ ] State 管理の型設計

#### レベル 3: 上級（Week 5-6）

- [ ] 状態管理ライブラリとの統合
- [ ] 複雑なフォーム管理
- [ ] API との型安全な統合

#### レベル 4: エキスパート（Week 7-8）

- [ ] 大規模アプリケーションの設計
- [ ] パフォーマンス最適化
- [ ] 実践プロジェクトの完成

### 📈 成果物チェックリスト

- [ ] **型安全な React コンポーネントライブラリ（20 コンポーネント以上）**
- [ ] **カスタム Hooks 集（15 個以上）**
- [ ] **状態管理パターン実装集**
- [ ] **フォームバリデーション型安全システム**
- [ ] **Angular→React 移行ガイド**
- [ ] **最終プロジェクト（タスク管理アプリ）**

### 🏆 最終評価項目

| 項目              | 重み | 評価基準                               |
| ----------------- | ---- | -------------------------------------- |
| TypeScript 活用度 | 25%  | 型安全性の確保と advanced 型機能の活用 |
| React 設計力      | 25%  | コンポーネント設計とパターン活用       |
| 状態管理能力      | 20%  | 効率的で保守性の高い状態設計           |
| 実装品質          | 15%  | パフォーマンス・保守性・テスタビリティ |
| 問題解決力        | 15%  | 複雑な問題の型安全な解決               |

**合格基準: 各項目 75%以上、総合 85%以上**

## 📚 推奨学習リソース

### 必須教材

- React TypeScript Cheatsheet
- React 公式ドキュメント
- TypeScript + React Best Practices

### 実践環境

- Vite (開発環境)
- Storybook (コンポーネント開発)
- CodeSandbox (実験・共有)

## 🔄 次フェーズへの接続

Phase2 完了後は、習得した React + TypeScript 知識を基盤として、Phase3（TypeScript 設計手法）で更に高度なアーキテクチャ設計に進みます。

---

**📌 重要**: Angular 経験を活かし、Angular と React の設計思想の違いを理解しながら学習を進めることで、より深い理解が得られます。
