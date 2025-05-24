# Step 8: パフォーマンス最適化

## 📅 学習期間・目標

**期間**: Step 8
**総学習時間**: 6 時間
**学習スタイル**: 理論 20% + 実践コード 50% + 演習 30%

### 🎯 Step 8 到達目標

- [ ] React パフォーマンス測定・分析技術
- [ ] メモ化戦略の実践
- [ ] 仮想化技術の実装
- [ ] バンドル最適化とコード分割
- [ ] Web Vitals の改善

## 📚 理論学習内容

### Day 51-53: パフォーマンス測定・分析

#### 🎯 React DevTools Profiler の活用

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

  metricsRef.current.startTime = performance.now();

  React.useEffect(() => {
    const endTime = performance.now();
    const renderTime = endTime - metricsRef.current.startTime;

    metricsRef.current.renderCount++;
    metricsRef.current.renderTimes.push(renderTime);

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

// 3. Web Vitals測定
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
    getCLS((metric) => setMetrics((prev) => ({ ...prev, CLS: metric.value })));
    getFID((metric) => setMetrics((prev) => ({ ...prev, FID: metric.value })));
    getFCP((metric) => setMetrics((prev) => ({ ...prev, FCP: metric.value })));
    getLCP((metric) => setMetrics((prev) => ({ ...prev, LCP: metric.value })));
    getTTFB((metric) =>
      setMetrics((prev) => ({ ...prev, TTFB: metric.value }))
    );
  }, []);

  return metrics;
}
```

### Day 54-55: メモ化戦略の実践

#### 🎯 React.memo、useMemo、useCallback の最適化

```typescript
// 4. React.memoの効果的な使用
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

// 5. useMemo/useCallbackの最適化
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

  const handleEdit = React.useCallback((user: User) => {
    console.log("Editing user:", user.id);
  }, []);

  const handleDelete = React.useCallback((id: number) => {
    console.log("Deleting user:", id);
  }, []);

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
```

### Day 56-57: 仮想化技術の実装

#### 🎯 大量データの効率的表示

```typescript
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

// 7. 無限スクロールの実装
interface InfiniteScrollProps<T> {
  items: T[];
  hasMore: boolean;
  loadMore: () => Promise<void>;
  renderItem: (item: T, index: number) => React.ReactNode;
  threshold?: number;
  loading?: boolean;
}

function InfiniteScroll<T>({
  items,
  hasMore,
  loadMore,
  renderItem,
  threshold = 100,
  loading = false,
}: InfiniteScrollProps<T>): JSX.Element {
  const [isLoading, setIsLoading] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const handleScroll = React.useCallback(async () => {
    if (!containerRef.current || isLoading || !hasMore) return;

    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;

    if (scrollHeight - scrollTop - clientHeight < threshold) {
      setIsLoading(true);
      try {
        await loadMore();
      } finally {
        setIsLoading(false);
      }
    }
  }, [isLoading, hasMore, threshold, loadMore]);

  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <div ref={containerRef} style={{ height: "400px", overflow: "auto" }}>
      {items.map((item, index) => (
        <div key={index}>{renderItem(item, index)}</div>
      ))}
      {(isLoading || loading) && (
        <div style={{ padding: "20px", textAlign: "center" }}>
          Loading more items...
        </div>
      )}
      {!hasMore && items.length > 0 && (
        <div style={{ padding: "20px", textAlign: "center" }}>
          No more items to load
        </div>
      )}
    </div>
  );
}
```

### Day 58: バンドル最適化とコード分割

#### 🎯 動的インポートとコード分割

```typescript
// 8. React.lazyとSuspenseの活用
const UserManagement = React.lazy(() => import("./components/UserManagement"));
const ProductCatalog = React.lazy(() => import("./components/ProductCatalog"));
const Analytics = React.lazy(() => import("./components/Analytics"));

function LoadingSpinner(): JSX.Element {
  return (
    <div className="loading-spinner">
      <div className="spinner"></div>
      <p>Loading...</p>
    </div>
  );
}

function App(): JSX.Element {
  const [currentRoute, setCurrentRoute] = React.useState("users");

  const renderRoute = (): React.ReactNode => {
    switch (currentRoute) {
      case "users":
        return (
          <React.Suspense fallback={<LoadingSpinner />}>
            <UserManagement />
          </React.Suspense>
        );
      case "products":
        return (
          <React.Suspense fallback={<LoadingSpinner />}>
            <ProductCatalog />
          </React.Suspense>
        );
      case "analytics":
        return (
          <React.Suspense fallback={<LoadingSpinner />}>
            <Analytics />
          </React.Suspense>
        );
      default:
        return <div>Page not found</div>;
    }
  };

  return (
    <div>
      <nav>
        <button onClick={() => setCurrentRoute("users")}>Users</button>
        <button onClick={() => setCurrentRoute("products")}>Products</button>
        <button onClick={() => setCurrentRoute("analytics")}>Analytics</button>
      </nav>
      <main>{renderRoute()}</main>
    </div>
  );
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

### 演習 8-1: パフォーマンス最適化実装 🔰

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

// 要件:
// - 仮想化による表示最適化
// - 検索・フィルタリングの高速化
// - メモ化戦略の実装
// - 無限スクロール対応

// 2. リアルタイム更新の最適化
interface RealTimeDataProps {
  // WebSocketからの頻繁な更新を効率的に処理
  onDataUpdate: (data: any) => void;
  updateInterval: number; // ms
}

// 要件:
// - デバウンス・スロットリングの活用
// - 差分更新の実装
// - メモリリーク防止
// - バッチ更新の最適化
```

### 演習 8-2: Web Vitals 改善 🔶

```typescript
// 以下の要件を満たすWeb Vitals改善を実装せよ

// 1. LCP (Largest Contentful Paint) 改善
// 要件:
// - 画像の最適化
// - 重要なリソースのプリロード
// - レンダリングブロッキングの削除

// 2. CLS (Cumulative Layout Shift) 改善
// 要件:
// - レイアウトシフトの防止
// - 画像・動画のサイズ指定
// - 動的コンテンツの適切な処理

// 3. FID (First Input Delay) 改善
// 要件:
// - JavaScriptの最適化
// - メインスレッドのブロッキング削減
// - インタラクションの応答性向上
```

## 📊 Step 8 評価基準

### 理解度チェックリスト

#### パフォーマンス測定 (25%)

- [ ] React DevTools Profiler を活用できる
- [ ] Web Vitals を測定・改善できる
- [ ] カスタム測定ツールを作成できる
- [ ] ボトルネックを特定できる

#### メモ化戦略 (35%)

- [ ] React.memo を効果的に使用できる
- [ ] useMemo/useCallback を適切に活用できる
- [ ] 不要な再レンダリングを防止できる
- [ ] パフォーマンスを意識した設計ができる

#### 仮想化・最適化 (30%)

- [ ] 仮想化技術を実装できる
- [ ] 大量データを効率的に処理できる
- [ ] 無限スクロールを実装できる
- [ ] コード分割を活用できる

#### 実践応用 (10%)

- [ ] 実用的な最適化を実装できる
- [ ] Web Vitals を改善できる
- [ ] ユーザー体験を向上できる
- [ ] 保守性を保った最適化ができる

### 成果物チェックリスト

- [ ] **パフォーマンス測定ツール**: カスタム測定・監視システム
- [ ] **最適化実装例**: 仮想化、メモ化、コード分割の実践
- [ ] **大量データ処理**: 10,000 件以上のデータの効率的表示
- [ ] **Web Vitals 改善レポート**: 具体的な改善結果

## 🔄 Step 9 への準備

### 次週学習内容の予習

```typescript
// Step 9で学習する実践プロジェクトの基礎概念

// 1. プロジェクト設計
interface ProjectArchitecture {
  frontend: "React + TypeScript";
  stateManagement: "Zustand + TanStack Query";
  styling: "CSS Modules | Tailwind CSS";
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

---

**📌 重要**: Step 8 は React アプリケーションのパフォーマンスを最適化し、プロダクションレベルの品質を実現する重要な期間です。測定・分析・最適化のサイクルを確実に習得してください。
