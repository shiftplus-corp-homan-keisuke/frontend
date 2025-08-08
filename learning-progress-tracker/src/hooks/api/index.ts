/**
 * API関連のカスタムフックのエクスポート
 * すべてのAPIフックを一箇所からインポートできるようにする
 */

// Phase hooks
export * from './usePhases';

// Task hooks
export * from './useTasks';

// Progress hooks
export * from './useProgress';

// 他のAPIフックも今後追加予定
// export * from './useStudySessions';
// export * from './useArtifacts';
// export * from './useResources';

// 共通のユーティリティフック
import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

/**
 * キャッシュを無効化するユーティリティフック
 */
export const useInvalidateCache = () => {
  const queryClient = useQueryClient();

  const invalidateAll = useCallback(() => {
    queryClient.invalidateQueries();
  }, [queryClient]);

  const invalidatePhases = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['phases'] });
  }, [queryClient]);

  const invalidateTasks = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['tasks'] });
  }, [queryClient]);

  const invalidateProgress = useCallback((userId?: string) => {
    if (userId) {
      queryClient.invalidateQueries({ queryKey: ['progress', userId] });
    } else {
      queryClient.invalidateQueries({ queryKey: ['progress'] });
    }
  }, [queryClient]);

  const invalidateUserData = useCallback((userId: string) => {
    queryClient.invalidateQueries({ queryKey: ['progress', userId] });
    queryClient.invalidateQueries({ queryKey: ['stats', userId] });
    queryClient.invalidateQueries({ queryKey: ['studySessions', { userId }] });
    queryClient.invalidateQueries({ queryKey: ['artifacts', { userId }] });
  }, [queryClient]);

  return {
    invalidateAll,
    invalidatePhases,
    invalidateTasks,
    invalidateProgress,
    invalidateUserData,
  };
};

/**
 * オフライン状態を管理するフック
 */
export const useOfflineSync = () => {
  const queryClient = useQueryClient();

  const syncWhenOnline = useCallback(() => {
    // オンライン復帰時にすべてのクエリを再取得
    queryClient.invalidateQueries();
    queryClient.refetchQueries();
  }, [queryClient]);

  const getOfflineData = useCallback(() => {
    // オフライン時にキャッシュされたデータを取得
    const cachedData = {
      phases: queryClient.getQueryData(['phases']),
      tasks: queryClient.getQueriesData({ queryKey: ['tasks'] }),
      progress: queryClient.getQueriesData({ queryKey: ['progress'] }),
    };
    return cachedData;
  }, [queryClient]);

  return {
    syncWhenOnline,
    getOfflineData,
  };
};

/**
 * データの事前読み込みを行うフック
 */
export const usePrefetchData = () => {
  const queryClient = useQueryClient();

  const prefetchPhases = useCallback(async () => {
    await queryClient.prefetchQuery({
      queryKey: ['phases'],
      queryFn: async () => {
        const { getPhases } = await import('@/lib/api');
        return getPhases();
      },
      staleTime: 5 * 60 * 1000,
    });
  }, [queryClient]);

  const prefetchUserData = useCallback(async (userId: string) => {
    const promises = [
      queryClient.prefetchQuery({
        queryKey: ['progress', 'overall', userId],
        queryFn: async () => {
          const { getOverallProgress } = await import('@/lib/api');
          return getOverallProgress(userId);
        },
        staleTime: 2 * 60 * 1000,
      }),
      queryClient.prefetchQuery({
        queryKey: ['progress', 'streak', userId],
        queryFn: async () => {
          const { getStreakData } = await import('@/lib/api');
          return getStreakData(userId);
        },
        staleTime: 5 * 60 * 1000,
      }),
    ];

    await Promise.all(promises);
  }, [queryClient]);

  const prefetchPhaseData = useCallback(async (phaseId: string) => {
    const promises = [
      queryClient.prefetchQuery({
        queryKey: ['phases', phaseId],
        queryFn: async () => {
          const { getPhase } = await import('@/lib/api');
          return getPhase(phaseId);
        },
        staleTime: 5 * 60 * 1000,
      }),
      queryClient.prefetchQuery({
        queryKey: ['tasks', 'by-phase', phaseId],
        queryFn: async () => {
          const { getTasksByPhase } = await import('@/lib/api');
          return getTasksByPhase(phaseId);
        },
        staleTime: 3 * 60 * 1000,
      }),
    ];

    await Promise.all(promises);
  }, [queryClient]);

  return {
    prefetchPhases,
    prefetchUserData,
    prefetchPhaseData,
  };
};

/**
 * エラー状態を管理するフック
 */
export const useApiErrorHandler = () => {
  const handleError = useCallback((error: unknown, context?: string) => {
    console.error(`API Error${context ? ` in ${context}` : ''}:`, error);
    
    // エラーの種類に応じた処理
    if (error instanceof Error) {
      if (error.message.includes('network') || error.message.includes('fetch')) {
        // ネットワークエラーの場合
        console.warn('Network error detected, data may be stale');
        return {
          type: 'network',
          message: 'ネットワーク接続に問題があります。データが古い可能性があります。',
          retryable: true,
        };
      } else if (error.message.includes('timeout')) {
        // タイムアウトエラーの場合
        return {
          type: 'timeout',
          message: 'リクエストがタイムアウトしました。もう一度お試しください。',
          retryable: true,
        };
      } else {
        // その他のエラー
        return {
          type: 'unknown',
          message: 'エラーが発生しました。しばらく時間をおいてからお試しください。',
          retryable: false,
        };
      }
    }

    return {
      type: 'unknown',
      message: '不明なエラーが発生しました。',
      retryable: false,
    };
  }, []);

  return { handleError };
};