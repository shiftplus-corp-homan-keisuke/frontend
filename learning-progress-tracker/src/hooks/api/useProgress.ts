/**
 * 進捗管理関連のTanStack Queryフック
 * 学習進捗の追跡と分析機能を管理
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getProgress,
  getPhaseProgress,
  getOverallProgress,
  updateProgress,
  updateProgressOnTaskCompletion,
  updateProgressOnSessionEnd,
  getProgressChartData,
  getStudyTimeChartData,
  getPhaseProgressChartData,
  getPlanComparison,
  getEfficiencyAnalysis,
  getGoalProgress,
  getStreakData,
  getProgressForecast,
  getScheduleAdjustmentSuggestions,
  applyScheduleAdjustments,
  generateProgressReport,
  createCacheKey,
  createRetryConfig,
} from '@/lib/api';
import type {
  Progress,
  GetProgressQuery,
  TimeRange,
  PlanComparison,
  ScheduleAdjustment,
  ChartData,
} from '@/types';

/**
 * ユーザーの進捗データを取得するフック
 */
export const useProgress = (query: GetProgressQuery) => {
  return useQuery({
    queryKey: createCacheKey.progress(query.userId, query),
    queryFn: () => getProgress(query),
    enabled: !!query.userId,
    staleTime: 2 * 60 * 1000, // 2分間キャッシュ
    ...createRetryConfig(),
  });
};

/**
 * 特定のフェーズの進捗を取得するフック
 */
export const usePhaseProgress = (userId: string, phaseId: string) => {
  return useQuery({
    queryKey: ['progress', 'phase', userId, phaseId],
    queryFn: () => getPhaseProgress(userId, phaseId),
    enabled: !!userId && !!phaseId,
    staleTime: 2 * 60 * 1000,
    ...createRetryConfig(),
  });
};

/**
 * 全体の進捗を取得するフック
 */
export const useOverallProgress = (userId: string) => {
  return useQuery({
    queryKey: ['progress', 'overall', userId],
    queryFn: () => getOverallProgress(userId),
    enabled: !!userId,
    staleTime: 2 * 60 * 1000,
    refetchInterval: 5 * 60 * 1000, // 5分ごとに自動更新
    ...createRetryConfig(),
  });
};

/**
 * 進捗を更新するミューテーションフック
 */
export const useUpdateProgress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, phaseId, updates }: {
      userId: string;
      phaseId: string;
      updates: {
        completedTasks?: number;
        totalTasks?: number;
        totalStudyTime?: number;
        lastActivityAt?: Date;
        streak?: number;
      };
    }) => updateProgress(userId, phaseId, updates),
    onSuccess: (updatedProgress, { userId, phaseId }) => {
      // 関連するキャッシュを更新
      queryClient.invalidateQueries({ queryKey: ['progress', userId] });
      queryClient.invalidateQueries({ queryKey: ['progress', 'phase', userId, phaseId] });
      queryClient.invalidateQueries({ queryKey: ['progress', 'overall', userId] });
      
      // 更新された進捗をキャッシュに設定
      queryClient.setQueryData(['progress', 'phase', userId, phaseId], updatedProgress);
    },
    onError: (error) => {
      console.error('Failed to update progress:', error);
    },
  });
};

/**
 * タスク完了時の進捗更新ミューテーションフック
 */
export const useUpdateProgressOnTaskCompletion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, taskId }: { userId: string; taskId: string }) =>
      updateProgressOnTaskCompletion(userId, taskId),
    onSuccess: (_, { userId }) => {
      // 進捗関連のキャッシュを無効化
      queryClient.invalidateQueries({ queryKey: ['progress', userId] });
      queryClient.invalidateQueries({ queryKey: ['progress', 'overall', userId] });
      
      // 統計データも更新
      queryClient.invalidateQueries({ queryKey: ['stats', userId] });
    },
    onError: (error) => {
      console.error('Failed to update progress on task completion:', error);
    },
  });
};

/**
 * 学習セッション終了時の進捗更新ミューテーションフック
 */
export const useUpdateProgressOnSessionEnd = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, sessionData }: {
      userId: string;
      sessionData: {
        phaseId: string;
        taskId?: string;
        studyTime: number;
      };
    }) => updateProgressOnSessionEnd(userId, sessionData),
    onSuccess: (_, { userId }) => {
      // 進捗関連のキャッシュを無効化
      queryClient.invalidateQueries({ queryKey: ['progress', userId] });
      queryClient.invalidateQueries({ queryKey: ['progress', 'overall', userId] });
      
      // 学習時間統計も更新
      queryClient.invalidateQueries({ queryKey: ['stats', userId, 'study-time'] });
      queryClient.invalidateQueries({ queryKey: ['stats', userId, 'streak'] });
    },
    onError: (error) => {
      console.error('Failed to update progress on session end:', error);
    },
  });
};

/**
 * 進捗チャートデータを取得するフック
 */
export const useProgressChartData = (userId: string, timeRange: TimeRange) => {
  return useQuery({
    queryKey: ['progress', 'chart', userId, timeRange],
    queryFn: () => getProgressChartData(userId, timeRange),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
    ...createRetryConfig(),
  });
};

/**
 * 学習時間チャートデータを取得するフック
 */
export const useStudyTimeChartData = (userId: string, timeRange: TimeRange) => {
  return useQuery({
    queryKey: ['progress', 'study-time-chart', userId, timeRange],
    queryFn: () => getStudyTimeChartData(userId, timeRange),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
    ...createRetryConfig(),
  });
};

/**
 * フェーズ別進捗チャートデータを取得するフック
 */
export const usePhaseProgressChartData = (userId: string) => {
  return useQuery({
    queryKey: ['progress', 'phase-chart', userId],
    queryFn: () => getPhaseProgressChartData(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
    ...createRetryConfig(),
  });
};

/**
 * 計画と実績の比較データを取得するフック
 */
export const usePlanComparison = (userId: string, phaseId?: string) => {
  return useQuery({
    queryKey: ['progress', 'plan-comparison', userId, phaseId],
    queryFn: () => getPlanComparison(userId, phaseId),
    enabled: !!userId,
    staleTime: 10 * 60 * 1000, // 10分間キャッシュ
    ...createRetryConfig(),
  });
};

/**
 * 学習効率の分析データを取得するフック
 */
export const useEfficiencyAnalysis = (userId: string, timeRange: TimeRange) => {
  return useQuery({
    queryKey: ['progress', 'efficiency', userId, timeRange],
    queryFn: () => getEfficiencyAnalysis(userId, timeRange),
    enabled: !!userId,
    staleTime: 10 * 60 * 1000,
    ...createRetryConfig(),
  });
};

/**
 * 学習目標の達成状況を取得するフック
 */
export const useGoalProgress = (userId: string) => {
  return useQuery({
    queryKey: ['progress', 'goals', userId],
    queryFn: () => getGoalProgress(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
    refetchInterval: 10 * 60 * 1000, // 10分ごとに自動更新
    ...createRetryConfig(),
  });
};

/**
 * 学習継続記録を取得するフック
 */
export const useStreakData = (userId: string) => {
  return useQuery({
    queryKey: ['progress', 'streak', userId],
    queryFn: () => getStreakData(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
    refetchInterval: 60 * 60 * 1000, // 1時間ごとに自動更新
    ...createRetryConfig(),
  });
};

/**
 * 進捗予測を取得するフック
 */
export const useProgressForecast = (userId: string, phaseId?: string) => {
  return useQuery({
    queryKey: ['progress', 'forecast', userId, phaseId],
    queryFn: () => getProgressForecast(userId, phaseId),
    enabled: !!userId,
    staleTime: 30 * 60 * 1000, // 30分間キャッシュ
    ...createRetryConfig(),
  });
};

/**
 * 学習計画の調整提案を取得するフック
 */
export const useScheduleAdjustmentSuggestions = (userId: string) => {
  return useQuery({
    queryKey: ['progress', 'schedule-suggestions', userId],
    queryFn: () => getScheduleAdjustmentSuggestions(userId),
    enabled: !!userId,
    staleTime: 15 * 60 * 1000, // 15分間キャッシュ
    ...createRetryConfig(),
  });
};

/**
 * 学習計画を調整するミューテーションフック
 */
export const useApplyScheduleAdjustments = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, adjustments }: {
      userId: string;
      adjustments: ScheduleAdjustment[];
    }) => applyScheduleAdjustments(userId, adjustments),
    onSuccess: (_, { userId }) => {
      // 関連するキャッシュを無効化
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['progress', userId] });
      queryClient.invalidateQueries({ queryKey: ['progress', 'schedule-suggestions', userId] });
      queryClient.invalidateQueries({ queryKey: ['progress', 'forecast', userId] });
    },
    onError: (error) => {
      console.error('Failed to apply schedule adjustments:', error);
    },
  });
};

/**
 * 進捗レポートを生成するミューテーションフック
 */
export const useGenerateProgressReport = () => {
  return useMutation({
    mutationFn: ({ userId, options }: {
      userId: string;
      options: {
        timeRange: TimeRange;
        includeCharts: boolean;
        includeRecommendations: boolean;
        format: 'json' | 'pdf';
      };
    }) => generateProgressReport(userId, options),
    onError: (error) => {
      console.error('Failed to generate progress report:', error);
    },
  });
};

/**
 * ダッシュボード用の統合進捗データを取得するフック
 */
export const useDashboardProgress = (userId: string) => {
  const { data: overallProgress, isLoading: overallLoading } = useOverallProgress(userId);
  const { data: streakData, isLoading: streakLoading } = useStreakData(userId);
  const { data: goalProgress, isLoading: goalLoading } = useGoalProgress(userId);
  const { data: todayChart } = useStudyTimeChartData(userId, 'day');

  const isLoading = overallLoading || streakLoading || goalLoading;

  const dashboardData = {
    overallProgress,
    streak: streakData?.currentStreak || 0,
    todayStudyTime: todayChart?.reduce((sum, data) => sum + data.value, 0) || 0,
    weeklyGoal: goalProgress?.weeklyGoal || { target: 0, achieved: 0, percentage: 0 },
    completedTasksThisWeek: 0, // 実際の実装では週間タスク完了数を計算
  };

  return {
    data: dashboardData,
    isLoading,
  };
};

/**
 * 進捗の統計情報を取得するフック
 */
export const useProgressStats = (userId: string, timeRange: TimeRange = 'month') => {
  const { data: overallProgress } = useOverallProgress(userId);
  const { data: chartData } = useProgressChartData(userId, timeRange);
  const { data: studyTimeData } = useStudyTimeChartData(userId, timeRange);
  const { data: phaseData } = usePhaseProgressChartData(userId);

  const stats = {
    overall: overallProgress,
    progressTrend: chartData || [],
    studyTimeTrend: studyTimeData || [],
    phaseBreakdown: phaseData || [],
    averageDailyStudyTime: studyTimeData ? studyTimeData.reduce((sum, data) => sum + data.value, 0) / (studyTimeData.length || 1) : 0,
    totalStudyTime: studyTimeData?.reduce((sum, data) => sum + data.value, 0) || 0,
  };

  return {
    data: stats,
    isLoading: !overallProgress,
  };
};