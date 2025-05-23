# Phase 2: Week 5-6 高度な React - TypeScript × React 高度なパターンとパフォーマンス最適化

## 📅 学習期間・目標

**期間**: Week 5-6（2 週間）  
**総学習時間**: 40 時間（週 20 時間）

### 🎯 Week 5-6 到達目標

- [ ] Higher-Order Components (HOC) の型安全な実装
- [ ] Render Props パターンの活用
- [ ] Compound Components パターンの習得
- [ ] React パフォーマンス最適化技術
- [ ] 高度な型パターンの実践応用

## 📖 理論学習内容

### Day 29-32: Higher-Order Components (HOC)

#### 型安全な HOC の実装

```typescript
// 1. 基本的な HOC パターン
import React, { ComponentType } from "react";

// HOC の型定義
type WithLoadingProps = {
  loading: boolean;
};

function withLoading<P extends object>(
  Component: ComponentType<P>
): ComponentType<P & WithLoadingProps> {
  return function WithLoadingComponent(props: P & WithLoadingProps) {
    const { loading, ...restProps } = props;

    if (loading) {
      return <div className="loading">Loading...</div>;
    }

    return <Component {...(restProps as P)} />;
  };
}

// 使用例
interface UserListProps {
  users: User[];
  onUserClick: (user: User) => void;
}

function UserList({ users, onUserClick }: UserListProps): JSX.Element {
  return (
    <div>
      {users.map((user) => (
        <div key={user.id} onClick={() => onUserClick(user)}>
          {user.name}
        </div>
      ))}
    </div>
  );
}

const UserListWithLoading = withLoading(UserList);

// 型安全な使用
function App(): JSX.Element {
  const [users, setUsers] = React.useState<User[]>([]);
  const [loading, setLoading] = React.useState(true);

  return (
    <UserListWithLoading
      users={users}
      loading={loading}
      onUserClick={(user) => console.log(user.name)}
    />
  );
}

// 2. 認証 HOC の実装
interface AuthProps {
  user: User | null;
  isAuthenticated: boolean;
}

function withAuth<P extends object>(
  Component: ComponentType<P>,
  options: {
    redirectTo?: string;
    requiredRole?: string;
  } = {}
): ComponentType<Omit<P, keyof AuthProps>> {
  return function WithAuthComponent(props: Omit<P, keyof AuthProps>) {
    const { user, isAuthenticated } = useAuth();

    if (!isAuthenticated) {
      return <div>Please log in to access this page.</div>;
    }

    if (options.requiredRole && user?.role !== options.requiredRole) {
      return <div>You don't have permission to access this page.</div>;
    }

    return (
      <Component
        {...(props as P)}
        user={user}
        isAuthenticated={isAuthenticated}
      />
    );
  };
}

// 使用例
interface AdminPanelProps extends AuthProps {
  title: string;
}

function AdminPanel({ title, user }: AdminPanelProps): JSX.Element {
  return (
    <div>
      <h1>{title}</h1>
      <p>Welcome, {user?.name}</p>
    </div>
  );
}

const ProtectedAdminPanel = withAuth(AdminPanel, { requiredRole: "admin" });

// 3. データフェッチング HOC
interface WithDataProps<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

function withData<T, P extends object>(
  Component: ComponentType<P & WithDataProps<T>>,
  fetcher: () => Promise<T>
): ComponentType<Omit<P, keyof WithDataProps<T>>> {
  return function WithDataComponent(props: Omit<P, keyof WithDataProps<T>>) {
    const [data, setData] = React.useState<T | null>(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<Error | null>(null);

    const fetchData = React.useCallback(async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await fetcher();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Unknown error"));
      } finally {
        setLoading(false);
      }
    }, []);

    React.useEffect(() => {
      void fetchData();
    }, [fetchData]);

    return (
      <Component
        {...(props as P)}
        data={data}
        loading={loading}
        error={error}
        refetch={fetchData}
      />
    );
  };
}
```

### Day 33-35: Render Props パターン

#### 型安全な Render Props の実装

```typescript
// 4. 基本的な Render Props パターン
interface MousePosition {
  x: number;
  y: number;
}

interface MouseTrackerProps {
  children: (position: MousePosition) => React.ReactNode;
}

function MouseTracker({ children }: MouseTrackerProps): JSX.Element {
  const [position, setPosition] = React.useState<MousePosition>({ x: 0, y: 0 });

  React.useEffect(() => {
    const handleMouseMove = (event: MouseEvent): void => {
      setPosition({ x: event.clientX, y: event.clientY });
    };

    document.addEventListener("mousemove", handleMouseMove);
    return () => document.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return <>{children(position)}</>;
}

// 使用例
function App(): JSX.Element {
  return (
    <MouseTracker>
      {({ x, y }) => (
        <div>
          Mouse position: ({x}, {y})
        </div>
      )}
    </MouseTracker>
  );
}

// 5. データフェッチング Render Props
interface FetchRenderProps<T> {
  children: (state: {
    data: T | null;
    loading: boolean;
    error: Error | null;
    refetch: () => void;
  }) => React.ReactNode;
  url: string;
}

function DataFetcher<T>({ children, url }: FetchRenderProps<T>): JSX.Element {
  const [data, setData] = React.useState<T | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);

  const fetchData = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = (await response.json()) as T;
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Unknown error"));
    } finally {
      setLoading(false);
    }
  }, [url]);

  React.useEffect(() => {
    void fetchData();
  }, [fetchData]);

  return <>{children({ data, loading, error, refetch: fetchData })}</>;
}

// 使用例
function UserProfile({ userId }: { userId: number }): JSX.Element {
  return (
    <DataFetcher<User> url={`/api/users/${userId}`}>
      {({ data: user, loading, error, refetch }) => {
        if (loading) return <div>Loading...</div>;
        if (error) return <div>Error: {error.message}</div>;
        if (!user) return <div>No user found</div>;

        return (
          <div>
            <h1>{user.name}</h1>
            <p>{user.email}</p>
            <button onClick={refetch}>Refresh</button>
          </div>
        );
      }}
    </DataFetcher>
  );
}

// 6. フォーム状態管理 Render Props
interface FormState<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isSubmitting: boolean;
}

interface FormRenderProps<T> {
  children: (
    formState: FormState<T> & {
      handleChange: (field: keyof T) => (value: any) => void;
      handleBlur: (field: keyof T) => () => void;
      handleSubmit: (e: React.FormEvent) => void;
      resetForm: () => void;
    }
  ) => React.ReactNode;
  initialValues: T;
  validate?: (values: T) => Partial<Record<keyof T, string>>;
  onSubmit: (values: T) => Promise<void> | void;
}

function Form<T extends Record<string, any>>({
  children,
  initialValues,
  validate,
  onSubmit,
}: FormRenderProps<T>): JSX.Element {
  const [values, setValues] = React.useState<T>(initialValues);
  const [errors, setErrors] = React.useState<Partial<Record<keyof T, string>>>(
    {}
  );
  const [touched, setTouched] = React.useState<
    Partial<Record<keyof T, boolean>>
  >({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleChange = React.useCallback(
    (field: keyof T) => (value: any) => {
      setValues((prev) => ({ ...prev, [field]: value }));
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      }
    },
    [errors]
  );

  const handleBlur = React.useCallback(
    (field: keyof T) => () => {
      setTouched((prev) => ({ ...prev, [field]: true }));
      if (validate) {
        const fieldErrors = validate(values);
        if (fieldErrors[field]) {
          setErrors((prev) => ({ ...prev, [field]: fieldErrors[field] }));
        }
      }
    },
    [values, validate]
  );

  const handleSubmit = React.useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (validate) {
        const formErrors = validate(values);
        setErrors(formErrors);
        if (Object.keys(formErrors).length > 0) {
          return;
        }
      }

      try {
        setIsSubmitting(true);
        await onSubmit(values);
      } finally {
        setIsSubmitting(false);
      }
    },
    [values, validate, onSubmit]
  );

  const resetForm = React.useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  return (
    <>
      {children({
        values,
        errors,
        touched,
        isSubmitting,
        handleChange,
        handleBlur,
        handleSubmit,
        resetForm,
      })}
    </>
  );
}
```

### Day 36-42: Compound Components パターン

#### 型安全な Compound Components の実装

```typescript
// 7. Tabs Compound Component
interface TabsContextType {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const TabsContext = React.createContext<TabsContextType | undefined>(undefined);

function useTabs(): TabsContextType {
  const context = React.useContext(TabsContext);
  if (!context) {
    throw new Error("Tabs compound components must be used within Tabs");
  }
  return context;
}

interface TabsProps {
  defaultTab?: string;
  children: React.ReactNode;
  onChange?: (tab: string) => void;
}

function Tabs({ defaultTab = "", children, onChange }: TabsProps): JSX.Element {
  const [activeTab, setActiveTab] = React.useState(defaultTab);

  const handleTabChange = React.useCallback(
    (tab: string) => {
      setActiveTab(tab);
      onChange?.(tab);
    },
    [onChange]
  );

  const value = React.useMemo<TabsContextType>(
    () => ({
      activeTab,
      setActiveTab: handleTabChange,
    }),
    [activeTab, handleTabChange]
  );

  return (
    <TabsContext.Provider value={value}>
      <div className="tabs">{children}</div>
    </TabsContext.Provider>
  );
}

interface TabListProps {
  children: React.ReactNode;
}

function TabList({ children }: TabListProps): JSX.Element {
  return (
    <div className="tab-list" role="tablist">
      {children}
    </div>
  );
}

interface TabProps {
  value: string;
  children: React.ReactNode;
  disabled?: boolean;
}

function Tab({ value, children, disabled = false }: TabProps): JSX.Element {
  const { activeTab, setActiveTab } = useTabs();
  const isActive = activeTab === value;

  return (
    <button
      className={`tab ${isActive ? "active" : ""} ${
        disabled ? "disabled" : ""
      }`}
      role="tab"
      aria-selected={isActive}
      disabled={disabled}
      onClick={() => !disabled && setActiveTab(value)}
    >
      {children}
    </button>
  );
}

interface TabPanelsProps {
  children: React.ReactNode;
}

function TabPanels({ children }: TabPanelsProps): JSX.Element {
  return <div className="tab-panels">{children}</div>;
}

interface TabPanelProps {
  value: string;
  children: React.ReactNode;
}

function TabPanel({ value, children }: TabPanelProps): JSX.Element {
  const { activeTab } = useTabs();

  if (activeTab !== value) {
    return null;
  }

  return (
    <div className="tab-panel" role="tabpanel">
      {children}
    </div>
  );
}

// Compound Component の組み立て
Tabs.List = TabList;
Tabs.Tab = Tab;
Tabs.Panels = TabPanels;
Tabs.Panel = TabPanel;

// 使用例
function App(): JSX.Element {
  return (
    <Tabs defaultTab="tab1" onChange={(tab) => console.log("Active tab:", tab)}>
      <Tabs.List>
        <Tabs.Tab value="tab1">Tab 1</Tabs.Tab>
        <Tabs.Tab value="tab2">Tab 2</Tabs.Tab>
        <Tabs.Tab value="tab3" disabled>
          Tab 3
        </Tabs.Tab>
      </Tabs.List>

      <Tabs.Panels>
        <Tabs.Panel value="tab1">
          <h2>Content for Tab 1</h2>
        </Tabs.Panel>
        <Tabs.Panel value="tab2">
          <h2>Content for Tab 2</h2>
        </Tabs.Panel>
        <Tabs.Panel value="tab3">
          <h2>Content for Tab 3</h2>
        </Tabs.Panel>
      </Tabs.Panels>
    </Tabs>
  );
}

// 8. Modal Compound Component
interface ModalContextType {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

const ModalContext = React.createContext<ModalContextType | undefined>(
  undefined
);

function useModal(): ModalContextType {
  const context = React.useContext(ModalContext);
  if (!context) {
    throw new Error("Modal compound components must be used within Modal");
  }
  return context;
}

interface ModalProps {
  children: React.ReactNode;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

function Modal({
  children,
  defaultOpen = false,
  onOpenChange,
}: ModalProps): JSX.Element {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);

  const openModal = React.useCallback(() => {
    setIsOpen(true);
    onOpenChange?.(true);
  }, [onOpenChange]);

  const closeModal = React.useCallback(() => {
    setIsOpen(false);
    onOpenChange?.(false);
  }, [onOpenChange]);

  const value = React.useMemo<ModalContextType>(
    () => ({
      isOpen,
      openModal,
      closeModal,
    }),
    [isOpen, openModal, closeModal]
  );

  return (
    <ModalContext.Provider value={value}>{children}</ModalContext.Provider>
  );
}

interface ModalTriggerProps {
  children: React.ReactNode;
}

function ModalTrigger({ children }: ModalTriggerProps): JSX.Element {
  const { openModal } = useModal();

  return <div onClick={openModal}>{children}</div>;
}

interface ModalContentProps {
  children: React.ReactNode;
}

function ModalContent({ children }: ModalContentProps): JSX.Element {
  const { isOpen, closeModal } = useModal();

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

// Compound Component の組み立て
Modal.Trigger = ModalTrigger;
Modal.Content = ModalContent;
```

## 🎯 実践演習

### 演習 5-1: 高度なコンポーネントパターン実装 🔥

**目標**: 複数のパターンを組み合わせた実用的なコンポーネント

```typescript
// 以下の要件を満たすコンポーネントシステムを実装せよ

// 1. DataTable Compound Component
interface DataTableProps<T> {
  data: T[];
  children: React.ReactNode;
  onSelectionChange?: (selectedItems: T[]) => void;
  loading?: boolean;
}

// 使用例:
// <DataTable data={users}>
//   <DataTable.Header>
//     <DataTable.Column field="name" sortable>Name</DataTable.Column>
//     <DataTable.Column field="email">Email</DataTable.Column>
//     <DataTable.Column field="role" filterable>Role</DataTable.Column>
//   </DataTable.Header>
//   <DataTable.Body>
//     {(user) => (
//       <DataTable.Row key={user.id}>
//         <DataTable.Cell>{user.name}</DataTable.Cell>
//         <DataTable.Cell>{user.email}</DataTable.Cell>
//         <DataTable.Cell>{user.role}</DataTable.Cell>
//       </DataTable.Row>
//     )}
//   </DataTable.Body>
//   <DataTable.Footer>
//     <DataTable.Pagination />
//   </DataTable.Footer>
// </DataTable>

// 2. Form Builder Compound Component
interface FormBuilderProps {
  onSubmit: (values: Record<string, any>) => void;
  children: React.ReactNode;
}

// 使用例:
// <FormBuilder onSubmit={handleSubmit}>
//   <FormBuilder.Field name="username" required>
//     <FormBuilder.Label>Username</FormBuilder.Label>
//     <FormBuilder.Input type="text" />
//     <FormBuilder.Error />
//   </FormBuilder.Field>
//   <FormBuilder.Field name="email" required>
//     <FormBuilder.Label>Email</FormBuilder.Label>
//     <FormBuilder.Input type="email" />
//     <FormBuilder.Error />
//   </FormBuilder.Field>
//   <FormBuilder.Submit>Submit</FormBuilder.Submit>
// </FormBuilder>

// 実装要件:
// - 完全な型安全性
// - アクセシビリティ対応
// - カスタマイズ可能なスタイリング
// - パフォーマンス最適化
// - テスト容易性
```

### 演習 5-2: パフォーマンス最適化実装 💎

**目標**: React パフォーマンス最適化技術の実践

```typescript
// 以下のパフォーマンス最適化を実装せよ

// 1. 仮想化リスト
interface VirtualListProps<T> {
  items: T[];
  itemHeight: number;
  containerHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  overscan?: number;
}

// 2. 無限スクロール
interface InfiniteScrollProps<T> {
  items: T[];
  hasMore: boolean;
  loadMore: () => Promise<void>;
  renderItem: (item: T, index: number) => React.ReactNode;
  threshold?: number;
}

// 3. メモ化戦略
// - React.memo の適切な使用
// - useMemo/useCallback の最適化
// - 不要な再レンダリングの防止

// 4. コード分割
// - 動的インポート
// - React.lazy + Suspense
// - ルートベースの分割

// 実装要件:
// - パフォーマンス測定
// - メモリ使用量の最適化
// - バンドルサイズの最適化
// - ユーザー体験の向上
```

## 📊 Week 5-6 評価基準

### 理解度チェックリスト

#### 高度なパターン (35%)

- [ ] HOC を型安全に実装できる
- [ ] Render Props パターンを活用できる
- [ ] Compound Components を設計できる
- [ ] 適切なパターンを選択できる

#### パフォーマンス最適化 (30%)

- [ ] React.memo を効果的に使用できる
- [ ] useMemo/useCallback を適切に活用できる
- [ ] 仮想化技術を実装できる
- [ ] コード分割を実装できる

#### 型安全性 (20%)

- [ ] 複雑な型パターンを実装できる
- [ ] ジェネリクスを効果的に活用できる
- [ ] 型推論を最適化できる
- [ ] 型安全な API を設計できる

#### 実践応用 (15%)

- [ ] 実用的なコンポーネントシステムを構築できる
- [ ] アクセシビリティを考慮できる
- [ ] テスタブルなコードを書ける
- [ ] 保守性の高い設計ができる

### 成果物チェックリスト

- [ ] **Compound Components ライブラリ**: 3 つ以上の実用的コンポーネント
- [ ] **HOC ライブラリ**: 認証、データフェッチ、ローディング等
- [ ] **パフォーマンス最適化例**: 仮想化、メモ化、コード分割
- [ ] **型安全パターン集**: 高度な型パターンの実装例

## 🔄 Week 7-8 への準備

### 次週学習内容の予習

```typescript
// Week 7-8で学習するパフォーマンス最適化の基礎概念

// 1. React DevTools Profiler
// 2. Bundle Analyzer
// 3. Web Vitals 測定
// 4. メモリリーク検出

// 5. 最適化技術
// - Tree Shaking
// - Code Splitting
// - Lazy Loading
// - Service Worker
```

### 環境準備

- [ ] パフォーマンス測定ツールの導入
- [ ] Bundle Analyzer の設定
- [ ] Lighthouse の活用準備
- [ ] React DevTools Profiler の習熟

---

**📌 重要**: Week 5-6 は React の高度なパターンとパフォーマンス最適化を習得し、プロダクションレベルのアプリケーション開発能力を身につける重要な期間です。
