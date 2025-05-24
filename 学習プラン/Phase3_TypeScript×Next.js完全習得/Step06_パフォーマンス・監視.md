# Step 6: パフォーマンス・監視

## 📅 学習期間・目標

**期間**: Step 6
**総学習時間**: 6 時間
**学習スタイル**: パフォーマンス最適化 50% + 監視・分析 30% + A/B テスト 20%

### 🎯 Step 6 到達目標

- [ ] バンドル分析とコード分割の最適化
- [ ] 監視・ログシステムの構築
- [ ] A/B テスト・Feature Flag の実装
- [ ] エラートラッキングとアラート設定
- [ ] パフォーマンス継続改善システム

## 📚 理論学習内容

### Day 36-38: バンドル最適化

#### 🎯 バンドル分析とコード分割

```typescript
// 1. バンドル分析設定
// next.config.js
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ["@heroicons/react", "lodash"],
  },

  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // バンドル分析（開発時のみ）
    if (process.env.ANALYZE === "true") {
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: "server",
          openAnalyzer: true,
        })
      );
    }

    // Tree Shaking最適化
    config.optimization = {
      ...config.optimization,
      usedExports: true,
      sideEffects: false,
    };

    // 動的インポート最適化
    config.optimization.splitChunks = {
      ...config.optimization.splitChunks,
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          chunks: "all",
          priority: 10,
        },
        common: {
          name: "common",
          minChunks: 2,
          chunks: "all",
          priority: 5,
          reuseExistingChunk: true,
        },
      },
    };

    return config;
  },

  // 画像最適化
  images: {
    formats: ["image/webp", "image/avif"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1年
  },

  // 圧縮設定
  compress: true,
  poweredByHeader: false,

  // ヘッダー最適化
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
        ],
      },
      {
        source: "/static/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;

// 2. 動的インポート最適化
// components/lazy-components.tsx
import dynamic from "next/dynamic";
import { Suspense } from "react";

// 重いコンポーネントの遅延読み込み
const HeavyChart = dynamic(() => import("./HeavyChart"), {
  loading: () => <ChartSkeleton />,
  ssr: false, // クライアントサイドでのみ読み込み
});

const DataVisualization = dynamic(
  () => import("./DataVisualization").then((mod) => mod.DataVisualization),
  {
    loading: () => <div>Loading visualization...</div>,
  }
);

// 条件付き読み込み
const AdminPanel = dynamic(() => import("./AdminPanel"), {
  loading: () => <div>Loading admin panel...</div>,
});

interface DashboardProps {
  user: User;
  showChart: boolean;
}

export function Dashboard({ user, showChart }: DashboardProps) {
  return (
    <div className="dashboard">
      <h1>Dashboard</h1>

      {/* 条件付きレンダリング */}
      {showChart && (
        <Suspense fallback={<ChartSkeleton />}>
          <HeavyChart />
        </Suspense>
      )}

      {/* 権限ベース読み込み */}
      {user.role === "admin" && (
        <Suspense fallback={<div>Loading...</div>}>
          <AdminPanel />
        </Suspense>
      )}

      <Suspense fallback={<div>Loading data visualization...</div>}>
        <DataVisualization />
      </Suspense>
    </div>
  );
}

// 3. パフォーマンス測定
// hooks/use-performance.ts
import { useEffect, useRef } from "react";

interface PerformanceMetrics {
  renderTime: number;
  componentName: string;
  timestamp: number;
}

export function usePerformanceMonitor(componentName: string) {
  const startTimeRef = useRef<number>();
  const renderCountRef = useRef(0);

  useEffect(() => {
    startTimeRef.current = performance.now();
    renderCountRef.current += 1;
  });

  useEffect(() => {
    if (startTimeRef.current) {
      const renderTime = performance.now() - startTimeRef.current;

      // パフォーマンスメトリクスを記録
      const metrics: PerformanceMetrics = {
        renderTime,
        componentName,
        timestamp: Date.now(),
      };

      // 閾値を超えた場合は警告
      if (renderTime > 100) {
        console.warn(
          `Slow render detected: ${componentName} took ${renderTime.toFixed(
            2
          )}ms`
        );
      }

      // アナリティクスに送信
      sendPerformanceMetrics(metrics);
    }
  });

  return {
    renderCount: renderCountRef.current,
  };
}

async function sendPerformanceMetrics(metrics: PerformanceMetrics) {
  try {
    await fetch("/api/analytics/performance", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(metrics),
    });
  } catch (error) {
    console.error("Failed to send performance metrics:", error);
  }
}

// 4. メモリリーク防止
// hooks/use-cleanup.ts
import { useEffect, useRef } from "react";

export function useCleanup() {
  const cleanupFunctionsRef = useRef<(() => void)[]>([]);

  const addCleanup = (cleanupFn: () => void) => {
    cleanupFunctionsRef.current.push(cleanupFn);
  };

  useEffect(() => {
    return () => {
      // コンポーネントアンマウント時にすべてのクリーンアップを実行
      cleanupFunctionsRef.current.forEach((cleanup) => {
        try {
          cleanup();
        } catch (error) {
          console.error("Cleanup error:", error);
        }
      });
      cleanupFunctionsRef.current = [];
    };
  }, []);

  return { addCleanup };
}

// 使用例
export function ComponentWithCleanup() {
  const { addCleanup } = useCleanup();

  useEffect(() => {
    const interval = setInterval(() => {
      console.log("Interval tick");
    }, 1000);

    // クリーンアップ関数を登録
    addCleanup(() => clearInterval(interval));

    const eventListener = () => {
      console.log("Window resized");
    };

    window.addEventListener("resize", eventListener);
    addCleanup(() => window.removeEventListener("resize", eventListener));
  }, [addCleanup]);

  return <div>Component with automatic cleanup</div>;
}
```

### Day 39-40: 監視・ログシステム

#### 🎯 Sentry 統合とエラートラッキング

```typescript
// 5. Sentry設定
// sentry.client.config.ts
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // パフォーマンス監視
  tracesSampleRate: 1.0,

  // セッションリプレイ
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,

  // 環境設定
  environment: process.env.NODE_ENV,

  // リリース情報
  release: process.env.NEXT_PUBLIC_APP_VERSION,

  // エラーフィルタリング
  beforeSend(event, hint) {
    // 開発環境では送信しない
    if (process.env.NODE_ENV === "development") {
      return null;
    }

    // 特定のエラーを除外
    if (event.exception) {
      const error = hint.originalException;
      if (error instanceof Error) {
        // ネットワークエラーを除外
        if (error.message.includes("Network Error")) {
          return null;
        }

        // 認証エラーを除外
        if (error.message.includes("401") || error.message.includes("403")) {
          return null;
        }
      }
    }

    return event;
  },

  // ユーザーコンテキスト
  initialScope: {
    tags: {
      component: "frontend",
    },
  },
});

// 6. カスタムログシステム
// lib/logger.ts
enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: Date;
  context?: Record<string, any>;
  userId?: string;
  sessionId?: string;
}

class Logger {
  private logLevel: LogLevel;
  private sessionId: string;

  constructor() {
    this.logLevel =
      process.env.NODE_ENV === "production" ? LogLevel.INFO : LogLevel.DEBUG;
    this.sessionId = this.generateSessionId();
  }

  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private shouldLog(level: LogLevel): boolean {
    return level >= this.logLevel;
  }

  private async sendLog(entry: LogEntry) {
    if (typeof window === "undefined") return;

    try {
      await fetch("/api/logs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(entry),
      });
    } catch (error) {
      console.error("Failed to send log:", error);
    }
  }

  private log(level: LogLevel, message: string, context?: Record<string, any>) {
    if (!this.shouldLog(level)) return;

    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date(),
      context,
      sessionId: this.sessionId,
    };

    // コンソール出力
    const logMethod =
      level === LogLevel.ERROR
        ? "error"
        : level === LogLevel.WARN
        ? "warn"
        : "log";
    console[logMethod](`[${LogLevel[level]}] ${message}`, context);

    // リモートログ送信
    this.sendLog(entry);

    // Sentryに送信（エラーレベルのみ）
    if (level === LogLevel.ERROR) {
      Sentry.captureException(new Error(message), {
        extra: context,
      });
    }
  }

  debug(message: string, context?: Record<string, any>) {
    this.log(LogLevel.DEBUG, message, context);
  }

  info(message: string, context?: Record<string, any>) {
    this.log(LogLevel.INFO, message, context);
  }

  warn(message: string, context?: Record<string, any>) {
    this.log(LogLevel.WARN, message, context);
  }

  error(message: string, context?: Record<string, any>) {
    this.log(LogLevel.ERROR, message, context);
  }

  setUserId(userId: string) {
    Sentry.setUser({ id: userId });
  }
}

export const logger = new Logger();

// 7. エラーバウンダリ
// components/error-boundary.tsx
("use client");

import React from "react";
import * as Sentry from "@sentry/nextjs";
import { logger } from "@/lib/logger";

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; reset: () => void }>;
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    // エラーログ記録
    logger.error("React Error Boundary caught an error", {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
    });

    // Sentryに送信
    Sentry.withScope((scope) => {
      scope.setTag("errorBoundary", true);
      scope.setContext("errorInfo", errorInfo);
      Sentry.captureException(error);
    });
  }

  render() {
    if (this.state.hasError && this.state.error) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback;

      return (
        <FallbackComponent
          error={this.state.error}
          reset={() => this.setState({ hasError: false })}
        />
      );
    }

    return this.props.children;
  }
}

function DefaultErrorFallback({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
        <div className="flex items-center mb-4">
          <div className="flex-shrink-0">
            <svg
              className="h-8 w-8 text-red-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-medium text-gray-900">
              エラーが発生しました
            </h3>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-500">
            申し訳ございません。予期しないエラーが発生しました。
          </p>
          {process.env.NODE_ENV === "development" && (
            <details className="mt-2">
              <summary className="cursor-pointer text-sm text-gray-600">
                エラー詳細
              </summary>
              <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
                {error.message}
                {error.stack}
              </pre>
            </details>
          )}
        </div>

        <div className="flex space-x-3">
          <button
            onClick={reset}
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
          >
            再試行
          </button>
          <button
            onClick={() => window.location.reload()}
            className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-400"
          >
            ページを再読み込み
          </button>
        </div>
      </div>
    </div>
  );
}
```

### Day 41-42: A/B テスト・Feature Flag

#### 🎯 実験・機能フラグシステム

```typescript
// 8. Feature Flag システム
// lib/feature-flags.ts
interface FeatureFlag {
  key: string;
  enabled: boolean;
  rolloutPercentage: number;
  conditions?: {
    userRole?: string[];
    userSegment?: string[];
    country?: string[];
  };
}

class FeatureFlagManager {
  private flags: Map<string, FeatureFlag> = new Map();
  private userId?: string;
  private userAttributes?: Record<string, any>;

  constructor() {
    this.loadFlags();
  }

  private async loadFlags() {
    try {
      const response = await fetch("/api/feature-flags");
      const flags: FeatureFlag[] = await response.json();

      flags.forEach((flag) => {
        this.flags.set(flag.key, flag);
      });
    } catch (error) {
      logger.error("Failed to load feature flags", { error });
    }
  }

  setUser(userId: string, attributes?: Record<string, any>) {
    this.userId = userId;
    this.userAttributes = attributes;
  }

  isEnabled(flagKey: string): boolean {
    const flag = this.flags.get(flagKey);
    if (!flag) {
      logger.warn(`Feature flag not found: ${flagKey}`);
      return false;
    }

    // 基本的な有効/無効チェック
    if (!flag.enabled) {
      return false;
    }

    // 条件チェック
    if (flag.conditions && this.userAttributes) {
      if (flag.conditions.userRole && this.userAttributes.role) {
        if (!flag.conditions.userRole.includes(this.userAttributes.role)) {
          return false;
        }
      }

      if (flag.conditions.userSegment && this.userAttributes.segment) {
        if (
          !flag.conditions.userSegment.includes(this.userAttributes.segment)
        ) {
          return false;
        }
      }

      if (flag.conditions.country && this.userAttributes.country) {
        if (!flag.conditions.country.includes(this.userAttributes.country)) {
          return false;
        }
      }
    }

    // ロールアウト率チェック
    if (flag.rolloutPercentage < 100 && this.userId) {
      const hash = this.hashUserId(this.userId + flagKey);
      const percentage = hash % 100;
      return percentage < flag.rolloutPercentage;
    }

    return true;
  }

  private hashUserId(input: string): number {
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
      const char = input.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // 32bit整数に変換
    }
    return Math.abs(hash);
  }

  // A/Bテスト用のバリアント取得
  getVariant(experimentKey: string, variants: string[]): string {
    if (!this.userId) {
      return variants[0]; // デフォルトバリアント
    }

    const hash = this.hashUserId(this.userId + experimentKey);
    const index = hash % variants.length;
    return variants[index];
  }
}

export const featureFlags = new FeatureFlagManager();

// 9. React Hook for Feature Flags
// hooks/use-feature-flag.ts
import { useEffect, useState } from "react";
import { featureFlags } from "@/lib/feature-flags";
import { useAuth } from "@/contexts/auth-context";

export function useFeatureFlag(flagKey: string): boolean {
  const [isEnabled, setIsEnabled] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      featureFlags.setUser(user.id, {
        role: user.role,
        segment: user.segment,
        country: user.country,
      });
    }

    const enabled = featureFlags.isEnabled(flagKey);
    setIsEnabled(enabled);

    // フラグの使用をログに記録
    logger.info("Feature flag checked", {
      flagKey,
      enabled,
      userId: user?.id,
    });
  }, [flagKey, user]);

  return isEnabled;
}

export function useABTest(experimentKey: string, variants: string[]): string {
  const [variant, setVariant] = useState(variants[0]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      featureFlags.setUser(user.id, {
        role: user.role,
        segment: user.segment,
        country: user.country,
      });

      const selectedVariant = featureFlags.getVariant(experimentKey, variants);
      setVariant(selectedVariant);

      // A/Bテストの参加をログに記録
      logger.info("A/B test assignment", {
        experimentKey,
        variant: selectedVariant,
        userId: user.id,
      });
    }
  }, [experimentKey, variants, user]);

  return variant;
}

// 10. A/Bテスト実装例
// components/ab-test-button.tsx
("use client");

import { useABTest } from "@/hooks/use-feature-flag";
import { Button } from "@/components/ui/button";

interface ABTestButtonProps {
  onClick: () => void;
  children: React.ReactNode;
}

export function ABTestButton({ onClick, children }: ABTestButtonProps) {
  const variant = useABTest("cta-button-test", [
    "control",
    "variant-a",
    "variant-b",
  ]);

  const getButtonProps = () => {
    switch (variant) {
      case "variant-a":
        return {
          className:
            "bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold",
          children: "今すぐ始める！",
        };
      case "variant-b":
        return {
          className:
            "bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-full",
          children: "Get Started",
        };
      default:
        return {
          className:
            "bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md",
          children,
        };
    }
  };

  const buttonProps = getButtonProps();

  const handleClick = () => {
    // クリックイベントをトラッキング
    logger.info("A/B test button clicked", {
      experiment: "cta-button-test",
      variant,
    });

    onClick();
  };

  return <Button {...buttonProps} onClick={handleClick} />;
}
```

## 🎯 実践演習

### 演習 6-1: パフォーマンス最適化実装 🔶

**目標**: 包括的なパフォーマンス最適化

```typescript
// 実装する最適化
interface PerformanceOptimizations {
  bundleOptimization: "バンドル分析・コード分割";
  imageOptimization: "画像最適化・遅延読み込み";
  memoryManagement: "メモリリーク防止";
  renderOptimization: "レンダリング最適化";
  cacheStrategy: "キャッシュ戦略最適化";
}
```

### 演習 6-2: 監視システム構築 🔥

**目標**: 完全な監視・ログシステム

```typescript
// 実装する監視機能
interface MonitoringSystem {
  errorTracking: "Sentry統合エラートラッキング";
  performanceMonitoring: "パフォーマンス監視";
  userBehaviorTracking: "ユーザー行動分析";
  alertSystem: "アラート・通知システム";
  dashboardReporting: "監視ダッシュボード";
}
```

## 📊 Step 6 評価基準

### 理解度チェックリスト

#### パフォーマンス最適化 (40%)

- [ ] バンドル分析を実行できる
- [ ] コード分割を適切に実装できる
- [ ] 画像最適化を実装できる
- [ ] メモリリークを防止できる

#### 監視・ログ (35%)

- [ ] Sentry を統合できる
- [ ] カスタムログシステムを構築できる
- [ ] エラーバウンダリを実装できる
- [ ] パフォーマンス監視を実装できる

#### A/B テスト・Feature Flag (15%)

- [ ] Feature Flag システムを実装できる
- [ ] A/B テストを設計・実行できる
- [ ] 実験結果を分析できる
- [ ] 段階的ロールアウトを実装できる

#### 実践応用 (10%)

- [ ] 継続的改善プロセスを構築できる
- [ ] データドリブンな意思決定ができる
- [ ] 運用監視を自動化できる
- [ ] インシデント対応を効率化できる

### 成果物チェックリスト

- [ ] **パフォーマンス最適化**: バンドル・画像・レンダリング最適化
- [ ] **監視システム**: Sentry 統合・ログ・アラートシステム
- [ ] **A/B テストシステム**: Feature Flag・実験管理
- [ ] **ダッシュボード**: 監視・分析ダッシュボード

## 🔄 Step 7 への準備

### 次週学習内容の予習

```typescript
// Step 7で学習するSaaSダッシュボード開発の基礎概念

// 1. データ可視化
import { Chart } from "react-chartjs-2";
import { ResponsiveContainer, LineChart, BarChart } from "recharts";

// 2. リアルタイムダッシュボード
const useRealtimeDashboard = (projectId: string) => {
  // リアルタイムデータ更新
};

// 3. 管理画面
interface AdminPanelProps {
  users: User[];
  projects: Project[];
  analytics: AnalyticsData;
}
```

---

**📌 重要**: Step 6 ではアプリケーションの監視・最適化システムを構築し、プロダクションレベルの品質管理を実現します。継続的な改善プロセスの基盤を確立できます。
