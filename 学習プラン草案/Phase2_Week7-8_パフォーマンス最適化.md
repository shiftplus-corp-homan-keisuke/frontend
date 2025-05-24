# Phase 2: Week 7-8 パフォーマンス最適化 - TypeScript × React パフォーマンス・チューニング

## 📅 学習期間・目標

**期間**: Week 7-8（2 週間）  
**総学習時間**: 40 時間（週 20 時間）

### 🎯 Week 7-8 到達目標

- [ ] React パフォーマンス測定・分析技術
- [ ] レンダリング最適化の実践
- [ ] バンドル最適化とコード分割
- [ ] メモリ管理とリーク防止
- [ ] Web Vitals の改善技術

## 📖 理論学習内容

### Day 43-46: パフォーマンス測定・分析

#### React DevTools Profiler の活用

```typescript
// 1. パフォーマンス測定の基本
import React, { Profiler, ProfilerOnRenderCallback } from "react";

const onRenderCallback: ProfilerOnRenderCallback = (
  id,
  phase,
  actualDuration,
  baseDuration,
  startTime,
  commitTime,
  interactions
) => {
  console.log("Profiler:", {
    id,
    phase,
    actualDuration,
    baseDuration,
    startTime,
    commitTime,
    interactions: Array.from(interactions),
  });
};

function App(): JSX.Element {
  return (
    <Profiler id="App" onRender={onRenderCallback}>
      <UserList />
      <ProductList />
    </Profiler>
  );
}

// 2. カスタムパフォーマンス測定フック
interface PerformanceMetrics {
  renderCount: number;
  lastRenderTime: number;
  averageRenderTime: number;
  maxRenderTime: number;
}

function usePerformanceMetrics(componentName: string): PerformanceMetrics {
  const metricsRef = React.useRef<{
    renderCount: number;
    renderTimes: number[];
    startTime: number;
  }>({
    renderCount: 0,
    renderTimes: [],
    startTime: 0,
  });

  // レンダリング開始時間を記録
  metricsRef.current.startTime = performance.now();

  React.useEffect(() => {
    const endTime = performance.now();
    const renderTime = endTime - metricsRef.current.startTime;

    metricsRef.current.renderCount++;
    metricsRef.current.renderTimes.push(renderTime);

    // 最新100回のレンダリング時間のみ保持
    if (metricsRef.current.renderTimes.length > 100) {
      metricsRef.current.renderTimes.shift();
    }

    console.log(`${componentName} render time: ${renderTime.toFixed(2)}ms`);
  });

  return React.useMemo(() => {
    const { renderCount, renderTimes } = metricsRef.current;
    const lastRenderTime = renderTimes[renderTimes.length - 1] || 0;
    const averageRenderTime =
      renderTimes.length > 0
        ? renderTimes.reduce((sum, time) => sum + time, 0) / renderTimes.length
        : 0;
    const maxRenderTime = Math.max(...renderTimes, 0);

    return {
      renderCount,
      lastRenderTime,
      averageRenderTime,
      maxRenderTime,
    };
  }, []);
}

// 使用例
function UserList(): JSX.Element {
  const metrics = usePerformanceMetrics("UserList");
  const [users] = React.useState<User[]>([]);

  return (
    <div>
      <div>Render Count: {metrics.renderCount}</div>
      <div>Average Render Time: {metrics.averageRenderTime.toFixed(2)}ms</div>
      {users.map((user) => (
        <UserItem key={user.id} user={user} />
      ))}
    </div>
  );
}

// 3. Web Vitals 測定
import { getCLS, getFID, getFCP, getLCP, getTTFB } from "web-vitals";

interface WebVitalsMetrics {
  CLS: number | null;
  FID: number | null;
  FCP: number | null;
  LCP: number | null;
  TTFB: number | null;
}

function useWebVitals(): WebVitalsMetrics {
  const [metrics, setMetrics] = React.useState<WebVitalsMetrics>({
    CLS: null,
    FID: null,
    FCP: null,
    LCP: null,
    TTFB: null,
  });

  React.useEffect(() => {
    getCLS((metric) => {
      setMetrics((prev) => ({ ...prev, CLS: metric.value }));
    });

    getFID((metric) => {
      setMetrics((prev) => ({ ...prev, FID: metric.value }));
    });

    getFCP((metric) => {
      setMetrics((prev) => ({ ...prev, FCP: metric.value }));
    });

    getLCP((metric) => {
      setMetrics((prev) => ({ ...prev, LCP: metric.value }));
    });

    getTTFB((metric) => {
      setMetrics((prev) => ({ ...prev, TTFB: metric.value }));
    });
  }, []);

  return metrics;
}
```

### Day 47-49: レンダリング最適化

#### メモ化戦略の実装

```typescript
// 4. React.memo の効果的な使用
interface UserItemProps {
  user: User;
  onEdit: (user: User) => void;
  onDelete: (id: number) => void;
  isSelected: boolean;
}

const UserItem = React.memo<UserItemProps>(
  ({ user, onEdit, onDelete, isSelected }) => {
    console.log(`UserItem ${user.id} rendered`);

    return (
      <div className={`user-item ${isSelected ? "selected" : ""}`}>
        <h3>{user.name}</h3>
        <p>{user.email}</p>
        <button onClick={() => onEdit(user)}>Edit</button>
        <button onClick={() => onDelete(user.id)}>Delete</button>
      </div>
    );
  },
  (prevProps, nextProps) => {
    // カスタム比較関数
    return (
      prevProps.user.id === nextProps.user.id &&
      prevProps.user.name === nextProps.user.name &&
      prevProps.user.email === nextProps.user.email &&
      prevProps.isSelected === nextProps.isSelected &&
      prevProps.onEdit === nextProps.onEdit &&
      prevProps.onDelete === nextProps.onDelete
    );
  }
);

// 5. useMemo/useCallback の最適化
interface UserListProps {
  users: User[];
  searchTerm: string;
  sortBy: "name" | "email" | "createdAt";
  sortOrder: "asc" | "desc";
}

function UserList({
  users,
  searchTerm,
  sortBy,
  sortOrder,
}: UserListProps): JSX.Element {
  // 重い計算のメモ化
  const filteredAndSortedUsers = React.useMemo(() => {
    console.log("Filtering and sorting users...");

    let filtered = users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    filtered.sort((a, b) => {
      let aValue: string | number | Date;
      let bValue: string | number | Date;

      switch (sortBy) {
        case "name":
          aValue = a.name;
          bValue = b.name;
          break;
        case "email":
          aValue = a.email;
          bValue = b.email;
          break;
        case "createdAt":
          aValue = a.createdAt;
          bValue = b.createdAt;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [users, searchTerm, sortBy, sortOrder]);

  // イベントハンドラーのメモ化
  const handleEdit = React.useCallback((user: User) => {
    console.log("Editing user:", user.id);
    // 編集ロジック
  }, []);

  const handleDelete = React.useCallback((id: number) => {
    console.log("Deleting user:", id);
    // 削除ロジック
  }, []);

  // 選択状態の管理
  const [selectedUserIds, setSelectedUserIds] = React.useState<Set<number>>(
    new Set()
  );

  const toggleUserSelection = React.useCallback((userId: number) => {
    setSelectedUserIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(userId)) {
        newSet.delete(userId);
      } else {
        newSet.add(userId);
      }
      return newSet;
    });
  }, []);

  return (
    <div>
      <div>Total users: {filteredAndSortedUsers.length}</div>
      {filteredAndSortedUsers.map((user) => (
        <UserItem
          key={user.id}
          user={user}
          onEdit={handleEdit}
          onDelete={handleDelete}
          isSelected={selectedUserIds.has(user.id)}
        />
      ))}
    </div>
  );
}

// 6. 仮想化リストの実装
interface VirtualListProps<T> {
  items: T[];
  itemHeight: number;
  containerHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  overscan?: number;
}

function VirtualList<T>({
  items,
  itemHeight,
  containerHeight,
  renderItem,
  overscan = 5,
}: VirtualListProps<T>): JSX.Element {
  const [scrollTop, setScrollTop] = React.useState(0);

  const visibleRange = React.useMemo(() => {
    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = Math.min(
      startIndex + Math.ceil(containerHeight / itemHeight),
      items.length - 1
    );

    return {
      start: Math.max(0, startIndex - overscan),
      end: Math.min(items.length - 1, endIndex + overscan),
    };
  }, [scrollTop, itemHeight, containerHeight, items.length, overscan]);

  const visibleItems = React.useMemo(() => {
    return items.slice(visibleRange.start, visibleRange.end + 1);
  }, [items, visibleRange]);

  const totalHeight = items.length * itemHeight;
  const offsetY = visibleRange.start * itemHeight;

  const handleScroll = React.useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  return (
    <div
      style={{ height: containerHeight, overflow: "auto" }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: "relative" }}>
        <div style={{ transform: `translateY(${offsetY}px)` }}>
          {visibleItems.map((item, index) => (
            <div
              key={visibleRange.start + index}
              style={{ height: itemHeight }}
            >
              {renderItem(item, visibleRange.start + index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

### Day 50-56: バンドル最適化とコード分割

#### 動的インポートとコード分割

```typescript
// 7. React.lazy とSuspenseの活用
const UserManagement = React.lazy(() => import("./components/UserManagement"));
const ProductCatalog = React.lazy(() => import("./components/ProductCatalog"));
const Analytics = React.lazy(() => import("./components/Analytics"));

// ローディングコンポーネント
function LoadingSpinner(): JSX.Element {
  return (
    <div className="loading-spinner">
      <div className="spinner"></div>
      <p>Loading...</p>
    </div>
  );
}

// エラーバウンダリ
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends React.Component<
  React.PropsWithChildren<{}>,
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
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h2>Something went wrong.</h2>
          <details>{this.state.error?.message}</details>
          <button onClick={() => this.setState({ hasError: false })}>
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// ルートベースのコード分割
function App(): JSX.Element {
  const [currentRoute, setCurrentRoute] = React.useState("users");

  const renderRoute = (): React.ReactNode => {
    switch (currentRoute) {
      case "users":
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <UserManagement />
          </Suspense>
        );
      case "products":
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <ProductCatalog />
          </Suspense>
        );
      case "analytics":
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <Analytics />
          </Suspense>
        );
      default:
        return <div>Page not found</div>;
    }
  };

  return (
    <ErrorBoundary>
      <nav>
        <button onClick={() => setCurrentRoute("users")}>Users</button>
        <button onClick={() => setCurrentRoute("products")}>Products</button>
        <button onClick={() => setCurrentRoute("analytics")}>Analytics</button>
      </nav>

      <main>{renderRoute()}</main>
    </ErrorBoundary>
  );
}

// 8. 動的インポートのカスタムフック
interface DynamicImportState<T> {
  component: T | null;
  loading: boolean;
  error: Error | null;
}

function useDynamicImport<T = React.ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>
): DynamicImportState<T> {
  const [state, setState] = React.useState<DynamicImportState<T>>({
    component: null,
    loading: true,
    error: null,
  });

  React.useEffect(() => {
    let isMounted = true;

    importFunc()
      .then((module) => {
        if (isMounted) {
          setState({
            component: module.default,
            loading: false,
            error: null,
          });
        }
      })
      .catch((error) => {
        if (isMounted) {
          setState({
            component: null,
            loading: false,
            error: error instanceof Error ? error : new Error("Import failed"),
          });
        }
      });

    return () => {
      isMounted = false;
    };
  }, [importFunc]);

  return state;
}

// 使用例
function DynamicComponent(): JSX.Element {
  const {
    component: HeavyComponent,
    loading,
    error,
  } = useDynamicImport(() => import("./HeavyComponent"));

  if (loading) return <LoadingSpinner />;
  if (error) return <div>Error loading component: {error.message}</div>;
  if (!HeavyComponent) return <div>Component not found</div>;

  return <HeavyComponent />;
}

// 9. プリロード戦略
interface PreloadableComponent<T> {
  component: React.LazyExoticComponent<T>;
  preload: () => Promise<{ default: T }>;
}

function createPreloadableComponent<T extends React.ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>
): PreloadableComponent<T> {
  let componentPromise: Promise<{ default: T }> | null = null;

  const preload = (): Promise<{ default: T }> => {
    if (!componentPromise) {
      componentPromise = importFunc();
    }
    return componentPromise;
  };

  const component = React.lazy(() => {
    if (!componentPromise) {
      componentPromise = importFunc();
    }
    return componentPromise;
  });

  return { component, preload };
}

// 使用例
const { component: UserManagementPreloadable, preload: preloadUserManagement } =
  createPreloadableComponent(() => import("./components/UserManagement"));

function Navigation(): JSX.Element {
  return (
    <nav>
      <button
        onMouseEnter={() => void preloadUserManagement()}
        onClick={() => {
          /* navigate to users */
        }}
      >
        Users
      </button>
    </nav>
  );
}
```

## 🎯 実践演習

### 演習 7-1: パフォーマンス最適化実装 🔥

**目標**: 実際のアプリケーションでのパフォーマンス最適化

```typescript
// 以下の要件を満たすパフォーマンス最適化を実装せよ

// 1. 大量データの効率的な表示
interface LargeDataSetProps {
  data: Array<{
    id: number;
    name: string;
    description: string;
    tags: string[];
    createdAt: Date;
  }>;
  // 10,000件以上のデータを効率的に表示
}

// 2. リアルタイム更新の最適化
interface RealTimeDataProps {
  // WebSocketからの頻繁な更新を効率的に処理
  onDataUpdate: (data: any) => void;
  updateInterval: number; // ms
}

// 3. 画像の遅延読み込み
interface ImageGalleryProps {
  images: Array<{
    id: string;
    src: string;
    alt: string;
    thumbnail: string;
  }>;
  // 100枚以上の画像を効率的に表示
}

// 4. 検索・フィルタリングの最適化
interface SearchableListProps<T> {
  items: T[];
  searchFields: (keyof T)[];
  filters: Record<string, any>;
  // 大量データでの高速検索・フィルタリング
}

// 実装要件:
// - 仮想化による表示最適化
// - デバウンス・スロットリングの活用
// - メモ化戦略の実装
// - バンドルサイズの最適化
// - Web Vitals の改善
```

### 演習 7-2: メモリ管理とリーク防止 💎

**目標**: メモリリークの防止と効率的なメモリ管理

```typescript
// 以下のメモリ管理を実装せよ

// 1. イベントリスナーの適切な管理
function useEventListener<T extends keyof WindowEventMap>(
  eventType: T,
  handler: (event: WindowEventMap[T]) => void,
  options?: AddEventListenerOptions
): void;

// 2. タイマーの管理
function useInterval(callback: () => void, delay: number | null): void;

function useTimeout(callback: () => void, delay: number): void;

// 3. 非同期処理のキャンセル
function useCancellablePromise<T>(promiseFactory: () => Promise<T>): {
  execute: () => void;
  cancel: () => void;
  data: T | null;
  loading: boolean;
  error: Error | null;
};

// 4. WeakMap/WeakSetの活用
interface CacheManager<K extends object, V> {
  set(key: K, value: V): void;
  get(key: K): V | undefined;
  has(key: K): boolean;
  delete(key: K): boolean;
  clear(): void;
}

// 実装要件:
// - 適切なクリーンアップ
// - メモリリークの検出・防止
// - ガベージコレクションの最適化
// - パフォーマンス監視
```

## 📊 Week 7-8 評価基準

### 理解度チェックリスト

#### パフォーマンス測定 (25%)

- [ ] React DevTools Profiler を活用できる
- [ ] Web Vitals を測定・改善できる
- [ ] カスタム測定ツールを作成できる
- [ ] ボトルネックを特定できる

#### レンダリング最適化 (30%)

- [ ] メモ化戦略を適切に実装できる
- [ ] 仮想化技術を活用できる
- [ ] 不要な再レンダリングを防止できる
- [ ] 大量データを効率的に処理できる

#### バンドル最適化 (25%)

- [ ] コード分割を実装できる
- [ ] 動的インポートを活用できる
- [ ] Tree Shaking を理解している
- [ ] バンドルサイズを最適化できる

#### メモリ管理 (20%)

- [ ] メモリリークを防止できる
- [ ] 適切なクリーンアップを実装できる
- [ ] リソース管理を効率化できる
- [ ] パフォーマンス監視を実装できる

### 成果物チェックリスト

- [ ] **パフォーマンス測定ツール**: カスタム測定・監視システム
- [ ] **最適化実装例**: 仮想化、メモ化、コード分割の実践
- [ ] **メモリ管理ライブラリ**: リーク防止とリソース管理
- [ ] **Web Vitals 改善レポート**: 具体的な改善結果

## 🔄 Week 9-10 への準備

### 次週学習内容の予習

```typescript
// Week 9-10で学習する実践プロジェクトの基礎概念

// 1. プロジェクト設計
interface ProjectArchitecture {
  frontend: "React + TypeScript";
  stateManagement: "Zustand + TanStack Query";
  styling: "CSS Modules | Styled Components";
  testing: "Vitest + Testing Library";
}

// 2. 機能要件
interface ProjectFeatures {
  authentication: boolean;
  dataVisualization: boolean;
  realTimeUpdates: boolean;
  fileUpload: boolean;
  responsiveDesign: boolean;
}
```

### 環境準備

- [ ] プロジェクトテンプレートの準備
- [ ] CI/CD パイプラインの設計
- [ ] デプロイメント戦略の検討
- [ ] 品質管理ツールの導入

---

**📌 重要**: Week 7-8 は React アプリケーションのパフォーマンスを最適化し、プロダクションレベルの品質を実現する重要な期間です。測定・分析・最適化のサイクルを確実に習得してください。
