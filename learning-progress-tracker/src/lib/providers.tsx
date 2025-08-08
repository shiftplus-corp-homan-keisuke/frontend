'use client';

/**
 * アプリケーション全体のプロバイダーコンポーネント
 * ストアの初期化、ネットワーク状態の監視、データ同期を管理
 */

import React, { useEffect, ReactNode, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useLearningStore } from '@/stores/learning-store';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';

interface ProvidersProps {
  children: ReactNode;
}

/**
 * ストア初期化プロバイダー
 * アプリケーション起動時にローカルストレージからデータを読み込む
 */
function StoreInitializer({ children }: ProvidersProps) {
  const loadFromStorage = useLearningStore(state => state.loadFromStorage);
  const syncToStorage = useLearningStore(state => state.syncToStorage);

  useEffect(() => {
    // アプリケーション起動時にローカルストレージからデータを読み込み
    loadFromStorage();

    // ページを離れる前にデータを同期
    const handleBeforeUnload = () => {
      syncToStorage();
    };

    // ページの可視性が変わったときにデータを同期
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        syncToStorage();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // 定期的にデータを同期（5分ごと）
    const syncInterval = setInterval(() => {
      syncToStorage();
    }, 5 * 60 * 1000);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearInterval(syncInterval);
      
      // クリーンアップ時に最終同期
      syncToStorage();
    };
  }, [loadFromStorage, syncToStorage]);

  return <>{children}</>;
}

/**
 * ネットワーク状態監視プロバイダー
 * オンライン/オフライン状態を監視し、自動同期を管理
 */
function NetworkStatusProvider({ children }: ProvidersProps) {
  // useNetworkStatus フックを使用してネットワーク状態を監視
  useNetworkStatus();

  return <>{children}</>;
}

/**
 * パフォーマンス監視プロバイダー
 * アプリケーションのパフォーマンスを監視し、必要に応じて最適化
 */
function PerformanceMonitor({ children }: ProvidersProps) {
  useEffect(() => {
    // Web Vitals の監視（開発環境でのみ）
    if (process.env.NODE_ENV === 'development') {
      // web-vitals は実際にはインストールされていないため、コメントアウト
      // import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      //   getCLS(console.log);
      //   getFID(console.log);
      //   getFCP(console.log);
      //   getLCP(console.log);
      //   getTTFB(console.log);
      // }).catch(error => {
      //   console.warn('Failed to load web-vitals', error);
      // });
    }

    // メモリ使用量の監視
    if ('memory' in performance) {
      const logMemoryUsage = () => {
        const memory = (performance as any).memory;
        console.log('Memory usage:', {
          used: Math.round(memory.usedJSHeapSize / 1024 / 1024) + ' MB',
          total: Math.round(memory.totalJSHeapSize / 1024 / 1024) + ' MB',
          limit: Math.round(memory.jsHeapSizeLimit / 1024 / 1024) + ' MB',
        });
      };

      // 開発環境でのみメモリ使用量をログ出力
      if (process.env.NODE_ENV === 'development') {
        const memoryInterval = setInterval(logMemoryUsage, 30000); // 30秒ごと
        return () => clearInterval(memoryInterval);
      }
    }

    // 何も返さない場合のためのundefinedを明示的に返す
    return undefined;
  }, []);

  return <>{children}</>;
}

/**
 * エラーバウンダリプロバイダー
 * アプリケーション全体のエラーをキャッチし、適切に処理
 */
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<ProvidersProps, ErrorBoundaryState> {
  constructor(props: ProvidersProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  override componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Application error caught by boundary:', error, errorInfo);
    
    // エラー情報をローカルストレージに保存（デバッグ用）
    try {
      const errorLog = {
        error: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        timestamp: new Date().toISOString(),
      };
      
      const existingLogs = JSON.parse(localStorage.getItem('error-logs') || '[]');
      existingLogs.push(errorLog);
      
      // 最新10件のエラーログのみ保持
      const recentLogs = existingLogs.slice(-10);
      localStorage.setItem('error-logs', JSON.stringify(recentLogs));
    } catch (storageError) {
      console.error('Failed to save error log:', storageError);
    }
  }

  override render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0">
                <svg className="h-8 w-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-gray-900">
                  アプリケーションエラー
                </h3>
              </div>
            </div>
            <div className="mb-4">
              <p className="text-sm text-gray-600">
                申し訳ございません。アプリケーションでエラーが発生しました。
                ページを再読み込みしてもう一度お試しください。
              </p>
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="mt-4">
                  <summary className="text-sm font-medium text-gray-700 cursor-pointer">
                    エラー詳細（開発環境）
                  </summary>
                  <pre className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded overflow-auto">
                    {this.state.error.message}
                    {'\n'}
                    {this.state.error.stack}
                  </pre>
                </details>
              )}
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => window.location.reload()}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                ページを再読み込み
              </button>
              <button
                onClick={() => this.setState({ hasError: false, error: null })}
                className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                再試行
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * TanStack Query プロバイダー
 * サーバー状態管理とキャッシュ機能を提供
 */
function QueryProvider({ children }: ProvidersProps) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        // デフォルトのキャッシュ時間: 5分
        staleTime: 5 * 60 * 1000,
        // データを保持する時間: 10分
        gcTime: 10 * 60 * 1000,
        // ウィンドウフォーカス時の自動再取得を無効化
        refetchOnWindowFocus: false,
        // ネットワーク再接続時の自動再取得を有効化
        refetchOnReconnect: true,
        // エラー時のリトライ設定
        retry: (failureCount, error) => {
          // ネットワークエラーの場合は3回まで、その他は1回まで
          if (error instanceof Error && error.message.includes('network')) {
            return failureCount < 3;
          }
          return failureCount < 1;
        },
        // リトライ間隔の設定
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      },
      mutations: {
        // ミューテーション失敗時のリトライ設定
        retry: 1,
        // エラー時のコールバック
        onError: (error) => {
          console.error('Mutation error:', error);
          // 必要に応じてエラー通知を表示
        },
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}

/**
 * メインプロバイダーコンポーネント
 * すべてのプロバイダーを組み合わせてアプリケーション全体を包む
 */
export function Providers({ children }: ProvidersProps) {
  return (
    <ErrorBoundary>
      <QueryProvider>
        <PerformanceMonitor>
          <StoreInitializer>
            <NetworkStatusProvider>
              {children}
            </NetworkStatusProvider>
          </StoreInitializer>
        </PerformanceMonitor>
      </QueryProvider>
    </ErrorBoundary>
  );
}

/**
 * 開発環境用のデバッグプロバイダー
 * Redux DevTools のような機能を提供
 */
export function DebugProvider({ children }: ProvidersProps) {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      // グローバルデバッグ関数を追加
      (window as any).__LEARNING_TRACKER_DEBUG__ = {
        stores: {
          learning: useLearningStore.getState,
        },
        clearStorage: () => {
          localStorage.clear();
          window.location.reload();
        },
        exportLogs: () => {
          const logs = localStorage.getItem('error-logs');
          if (logs) {
            const blob = new Blob([logs], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'error-logs.json';
            link.click();
            URL.revokeObjectURL(url);
          }
        },
      };

      console.log('🚀 Learning Tracker Debug Mode');
      console.log('Available debug functions:', Object.keys((window as any).__LEARNING_TRACKER_DEBUG__));
    }
  }, []);

  return <>{children}</>;
}

/**
 * 本番環境用の最適化プロバイダー
 * パフォーマンス最適化とエラー報告を行う
 */
export function ProductionProvider({ children }: ProvidersProps) {
  useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      // Service Worker の登録
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
          .then(registration => {
            console.log('SW registered: ', registration);
          })
          .catch(registrationError => {
            console.log('SW registration failed: ', registrationError);
          });
      }

      // 未処理のエラーをキャッチ
      window.addEventListener('error', (event) => {
        console.error('Unhandled error:', event.error);
        // 本番環境では外部エラー報告サービスに送信
      });

      window.addEventListener('unhandledrejection', (event) => {
        console.error('Unhandled promise rejection:', event.reason);
        // 本番環境では外部エラー報告サービスに送信
      });
    }
  }, []);

  return <>{children}</>;
}