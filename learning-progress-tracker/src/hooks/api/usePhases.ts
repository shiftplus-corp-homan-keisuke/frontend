/**
 * フェーズ関連のTanStack Queryフック
 * フェーズデータの取得、作成、更新、削除を管理
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getPhases,
  getPhase,
  createPhase,
  updatePhase,
  deletePhase,
  updatePhaseOrder,
  checkPhasePrerequisites,
  createCacheKey,
  createRetryConfig,
} from '@/lib/api';
import type {
  Phase,
  CreatePhaseRequest,
  UpdatePhaseRequest,
} from '@/types';

/**
 * すべてのフェーズを取得するフック
 */
export const usePhases = () => {
  return useQuery({
    queryKey: createCacheKey.phases(),
    queryFn: getPhases,
    staleTime: 5 * 60 * 1000, // 5分間キャッシュ
    ...createRetryConfig(),
  });
};

/**
 * 特定のフェーズを取得するフック
 */
export const usePhase = (id: string) => {
  return useQuery({
    queryKey: createCacheKey.phase(id),
    queryFn: () => getPhase(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    ...createRetryConfig(),
  });
};

/**
 * フェーズを作成するミューテーションフック
 */
export const useCreatePhase = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPhase,
    onSuccess: (newPhase) => {
      // フェーズ一覧のキャッシュを無効化
      queryClient.invalidateQueries({ queryKey: createCacheKey.phases() });
      
      // 新しいフェーズをキャッシュに追加
      queryClient.setQueryData(createCacheKey.phase(newPhase.id), newPhase);
    },
    onError: (error) => {
      console.error('Failed to create phase:', error);
    },
  });
};

/**
 * フェーズを更新するミューテーションフック
 */
export const useUpdatePhase = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updatePhase,
    onSuccess: (updatedPhase) => {
      // フェーズ一覧のキャッシュを無効化
      queryClient.invalidateQueries({ queryKey: createCacheKey.phases() });
      
      // 更新されたフェーズをキャッシュに設定
      queryClient.setQueryData(createCacheKey.phase(updatedPhase.id), updatedPhase);
    },
    onError: (error) => {
      console.error('Failed to update phase:', error);
    },
  });
};

/**
 * フェーズを削除するミューテーションフック
 */
export const useDeletePhase = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePhase,
    onSuccess: (_, deletedId) => {
      // フェーズ一覧のキャッシュを無効化
      queryClient.invalidateQueries({ queryKey: createCacheKey.phases() });
      
      // 削除されたフェーズのキャッシュを削除
      queryClient.removeQueries({ queryKey: createCacheKey.phase(deletedId) });
      
      // 関連するタスクやプログレスのキャッシュも無効化
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['progress'] });
    },
    onError: (error) => {
      console.error('Failed to delete phase:', error);
    },
  });
};

/**
 * フェーズの順序を更新するミューテーションフック
 */
export const useUpdatePhaseOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updatePhaseOrder,
    onMutate: async (phaseIds) => {
      // 楽観的更新のために現在のデータを取得
      await queryClient.cancelQueries({ queryKey: createCacheKey.phases() });
      const previousPhases = queryClient.getQueryData<Phase[]>(createCacheKey.phases());

      // 楽観的更新を実行
      if (previousPhases) {
        const reorderedPhases = phaseIds.map((id, index) => {
          const phase = previousPhases.find(p => p.id === id);
          return phase ? { ...phase, order: index + 1 } : null;
        }).filter(Boolean) as Phase[];

        queryClient.setQueryData(createCacheKey.phases(), reorderedPhases);
      }

      return { previousPhases };
    },
    onError: (error, _, context) => {
      // エラー時は前の状態に戻す
      if (context?.previousPhases) {
        queryClient.setQueryData(createCacheKey.phases(), context.previousPhases);
      }
      console.error('Failed to update phase order:', error);
    },
    onSettled: () => {
      // 最終的にサーバーから最新データを取得
      queryClient.invalidateQueries({ queryKey: createCacheKey.phases() });
    },
  });
};

/**
 * フェーズの前提条件をチェックするフック
 */
export const usePhasePrerequisites = (phaseId: string, userId: string) => {
  return useQuery({
    queryKey: ['phase-prerequisites', phaseId, userId],
    queryFn: () => checkPhasePrerequisites(phaseId, userId),
    enabled: !!phaseId && !!userId,
    staleTime: 2 * 60 * 1000, // 2分間キャッシュ
    ...createRetryConfig(),
  });
};

/**
 * フェーズの統計情報を取得するフック
 */
export const usePhasesStats = () => {
  const { data: phases, isLoading } = usePhases();

  const stats = {
    totalPhases: phases?.length || 0,
    completedPhases: 0, // 実際の実装では進捗データから計算
    averageDuration: phases ? phases.reduce((sum, phase) => sum + phase.duration, 0) / (phases.length || 1) : 0,
    phasesByDuration: phases?.reduce((acc, phase) => {
      const range = phase.duration <= 4 ? 'short' : phase.duration <= 8 ? 'medium' : 'long';
      acc[range] = (acc[range] || 0) + 1;
      return acc;
    }, {} as Record<string, number>) || {},
  };

  return {
    data: stats,
    isLoading,
  };
};

/**
 * 現在のフェーズを取得するフック
 */
export const useCurrentPhase = (userId: string) => {
  const { data: phases } = usePhases();
  
  // 実際の実装では、ユーザーの進捗データから現在のフェーズを判定
  // ここでは簡単な例として最初の未完了フェーズを返す
  const currentPhase = phases?.find(phase => {
    // 進捗データから判定するロジックを実装
    return true; // 仮の実装
  });

  return {
    data: currentPhase || null,
    isLoading: !phases,
  };
};

/**
 * 次のフェーズを取得するフック
 */
export const useNextPhase = (currentPhaseId: string) => {
  const { data: phases } = usePhases();
  
  const nextPhase = phases?.find(phase => {
    const currentPhase = phases.find(p => p.id === currentPhaseId);
    return currentPhase && phase.order === currentPhase.order + 1;
  });

  return {
    data: nextPhase || null,
    isLoading: !phases,
  };
};