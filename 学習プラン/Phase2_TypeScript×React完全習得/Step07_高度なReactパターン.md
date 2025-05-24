# Step 7: 高度な React パターン

## 📅 学習期間・目標

**期間**: Step 7
**総学習時間**: 6 時間
**学習スタイル**: 理論 20% + 実践コード 50% + 演習 30%

### 🎯 Step 7 到達目標

- [ ] Higher-Order Components (HOC) の型安全な実装
- [ ] Render Props パターンの活用
- [ ] Compound Components パターンの習得
- [ ] Error Boundary と Suspense の実践
- [ ] React 19 新機能の活用

## 📚 理論学習内容

### Day 43-45: Higher-Order Components (HOC)

#### 🎯 型安全な HOC 実装

```typescript
// 1. 基本的なHOCパターン
import React, { ComponentType } from "react";

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

// 2. 認証HOC
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

// 3. データフェッチングHOC
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

### Day 46-47: Render Props パターン

#### 🎯 型安全な Render Props 実装

```typescript
// 4. 基本的なRender Propsパターン
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

// 5. データフェッチングRender Props
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
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
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

// 6. フォーム状態管理Render Props
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

### Day 48-49: Compound Components パターン

#### 🎯 型安全な Compound Components 実装

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

// Compound Componentの組み立て
Tabs.List = TabList;
Tabs.Tab = Tab;
```

### Day 50: Error Boundary と Suspense

#### 🎯 エラーハンドリングとローディング管理

```typescript
// 8. Error Boundary
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends React.Component<
  React.PropsWithChildren<{
    fallback?: React.ComponentType<{ error: Error; resetError: () => void }>;
    onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  }>,
  ErrorBoundaryState
> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    this.props.onError?.(error, errorInfo);
  }

  resetError = (): void => {
    this.setState({ hasError: false, error: undefined });
  };

  render(): React.ReactNode {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return (
          <FallbackComponent
            error={this.state.error}
            resetError={this.resetError}
          />
        );
      }

      return (
        <div className="error-boundary">
          <h2>Something went wrong.</h2>
          <details>{this.state.error.message}</details>
          <button onClick={this.resetError}>Try again</button>
        </div>
      );
    }

    return this.props.children;
  }
}

// 9. Suspense with Error Boundary
const LazyComponent = React.lazy(() => import("./LazyComponent"));

function App(): JSX.Element {
  return (
    <ErrorBoundary
      fallback={({ error, resetError }) => (
        <div>
          <h2>Error: {error.message}</h2>
          <button onClick={resetError}>Retry</button>
        </div>
      )}
    >
      <React.Suspense fallback={<div>Loading...</div>}>
        <LazyComponent />
      </React.Suspense>
    </ErrorBoundary>
  );
}
```

## 🎯 実践演習

### 演習 7-1: 高度なコンポーネントパターン実装 🔰

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
//   </DataTable.Header>
//   <DataTable.Body>
//     {(user) => (
//       <DataTable.Row key={user.id}>
//         <DataTable.Cell>{user.name}</DataTable.Cell>
//         <DataTable.Cell>{user.email}</DataTable.Cell>
//       </DataTable.Row>
//     )}
//   </DataTable.Body>
// </DataTable>

// 要件:
// - 完全な型安全性
// - ソート・フィルタリング機能
// - 行選択機能
// - 仮想化対応
```

### 演習 7-2: 実用的なパターン統合 🔶

```typescript
// 以下の要件を満たすダッシュボードシステムを実装せよ

// Widget System
interface WidgetProps {
  title: string;
  children: React.ReactNode;
  loading?: boolean;
  error?: Error;
  onRefresh?: () => void;
}

// 要件:
// - HOC + Render Props + Compound Components の統合
// - エラーハンドリング
// - ローディング状態管理
// - リアルタイム更新
// - カスタマイズ可能なレイアウト
```

## 📊 Step 7 評価基準

### 理解度チェックリスト

#### 高度なパターン (40%)

- [ ] HOC を型安全に実装できる
- [ ] Render Props パターンを活用できる
- [ ] Compound Components を設計できる
- [ ] 適切なパターンを選択できる

#### エラーハンドリング (30%)

- [ ] Error Boundary を実装できる
- [ ] Suspense を効果的に活用できる
- [ ] エラー状態を適切に管理できる
- [ ] ユーザー体験を考慮できる

#### 実践応用 (30%)

- [ ] 複数パターンを統合できる
- [ ] 実用的なコンポーネントシステムを構築できる
- [ ] パフォーマンスを考慮した実装ができる
- [ ] 保守性の高い設計ができる

### 成果物チェックリスト

- [ ] **HOC ライブラリ**: 認証・データフェッチ・ローディング等
- [ ] **Render Props コンポーネント**: マウス追跡・フォーム管理等
- [ ] **Compound Components ライブラリ**: Tabs・Modal・DataTable 等
- [ ] **統合ダッシュボード**: 全パターンを活用したシステム

## 🔄 Step 8 への準備

### 次週学習内容の予習

```typescript
// Step 8で学習するパフォーマンス最適化の基礎概念

// 1. React.memo
const MemoizedComponent = React.memo(Component);

// 2. useMemo/useCallback
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
const memoizedCallback = useCallback(() => doSomething(a, b), [a, b]);

// 3. 仮想化
interface VirtualListProps<T> {
  items: T[];
  itemHeight: number;
  containerHeight: number;
}
```

---

**📌 重要**: Step 7 は React の高度なパターンを習得し、プロダクションレベルのコンポーネント設計能力を身につける重要な期間です。
