/**
 * 進捗管理関連のAPIクライアント関数
 * 学習進捗の追跡と分析機能を提供
 */

import { apiClient } from './client';
import type {
  Progress,
  GetProgressQuery,
  PlanComparison,
  ScheduleAdjustment,
  ChartData,
  TimeRange,
  ApiResponse,
} from '@/types';

/**
 * ユーザーの進捗データを取得
 */
export const getProgress = async (query: GetProgressQuery): Promise<Progress[]> => {
  const searchParams = new URLSearchParams();
  
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, String(value));
    }
  });

  const queryString = searchParams.toString();
  const endpoint = queryString ? `/progress?${queryString}` : '/progress';
  
  const response = await apiClient.get<Progress[]>(endpoint);
  return response;
};

/**
 * 特定のフェーズの進捗を取得
 */
export const getPhaseProgress = async (userId: string, phaseId: string): Promise<Progress> => {
  const response = await apiClient.get<Progress>(`/progress/${userId}/phase/${phaseId}`);
  return response;
};

/**
 * 全体の進捗を取得
 */
export const getOverallProgress = async (userId: string): Promise<{
  totalPhases: number;
  completedPhases: number;
  currentPhase: string | null;
  overallCompletionRate: number;
  totalStudyTime: number;
  currentStreak: number;
  totalTasks: number;
  completedTasks: number;
}> => {
  const response = await apiClient.get(`/progress/${userId}/overall`);
  return response as {
    totalPhases: number;
    completedPhases: number;
    currentPhase: string | null;
    overallCompletionRate: number;
    totalStudyTime: number;
    currentStreak: number;
    totalTasks: number;
    completedTasks: number;
  };
};

/**
 * 進捗を更新
 */
export const updateProgress = async (userId: string, phaseId: string, updates: {
  completedTasks?: number;
  totalTasks?: number;
  totalStudyTime?: number;
  lastActivityAt?: Date;
  streak?: number;
}): Promise<Progress> => {
  const response = await apiClient.patch<Progress>(`/progress/${userId}/phase/${phaseId}`, updates);
  return response;
};

/**
 * タスク完了時の進捗更新
 */
export const updateProgressOnTaskCompletion = async (userId: string, taskId: string): Promise<Progress> => {
  const response = await apiClient.post<Progress>(`/progress/${userId}/task-completed`, { taskId });
  return response;
};

/**
 * 学習セッション終了時の進捗更新
 */
export const updateProgressOnSessionEnd = async (userId: string, sessionData: {
  phaseId: string;
  taskId?: string;
  studyTime: number;
}): Promise<Progress> => {
  const response = await apiClient.post<Progress>(`/progress/${userId}/session-completed`, sessionData);
  return response;
};

/**
 * 進捗チャートデータを取得
 */
export const getProgressChartData = async (userId: string, timeRange: TimeRange): Promise<ChartData[]> => {
  const response = await apiClient.get<ChartData[]>(`/progress/${userId}/chart?timeRange=${timeRange}`);
  return response;
};

/**
 * 学習時間チャートデータを取得
 */
export const getStudyTimeChartData = async (userId: string, timeRange: TimeRange): Promise<ChartData[]> => {
  const response = await apiClient.get<ChartData[]>(`/progress/${userId}/study-time-chart?timeRange=${timeRange}`);
  return response;
};

/**
 * フェーズ別進捗チャートデータを取得
 */
export const getPhaseProgressChartData = async (userId: string): Promise<Array<{
  phaseId: string;
  phaseName: string;
  completionRate: number;
  studyTime: number;
  tasksCompleted: number;
  totalTasks: number;
}>> => {
  const response = await apiClient.get(`/progress/${userId}/phase-chart`);
  return response as Array<{
    phaseId: string;
    phaseName: string;
    completionRate: number;
    studyTime: number;
    tasksCompleted: number;
    totalTasks: number;
  }>;
};

/**
 * 計画と実績の比較データを取得
 */
export const getPlanComparison = async (userId: string, phaseId?: string): Promise<PlanComparison> => {
  let endpoint = `/progress/${userId}/plan-comparison`;
  if (phaseId) {
    endpoint += `?phaseId=${phaseId}`;
  }
  
  const response = await apiClient.get<PlanComparison>(endpoint);
  return response;
};

/**
 * 学習効率の分析データを取得
 */
export const getEfficiencyAnalysis = async (userId: string, timeRange: TimeRange): Promise<{
  averageProductivity: number;
  productivityTrend: ChartData[];
  mostProductiveHours: Array<{
    hour: number;
    productivity: number;
    sessions: number;
  }>;
  mostProductiveDays: Array<{
    dayOfWeek: number;
    productivity: number;
    sessions: number;
  }>;
  taskTypeEfficiency: Array<{
    taskType: string;
    averageTime: number;
    productivity: number;
  }>;
}> => {
  const response = await apiClient.get(`/progress/${userId}/efficiency?timeRange=${timeRange}`);
  return response as any; // 複雑な型のため一時的にanyを使用
};

/**
 * 学習目標の達成状況を取得
 */
export const getGoalProgress = async (userId: string): Promise<{
  dailyGoal: {
    target: number; // 分
    achieved: number;
    percentage: number;
  };
  weeklyGoal: {
    target: number;
    achieved: number;
    percentage: number;
  };
  monthlyGoal: {
    target: number;
    achieved: number;
    percentage: number;
  };
  phaseGoals: Array<{
    phaseId: string;
    phaseName: string;
    targetCompletionDate: Date;
    estimatedCompletionDate: Date;
    isOnTrack: boolean;
  }>;
}> => {
  const response = await apiClient.get(`/progress/${userId}/goals`);
  return response as any; // 複雑な型のため一時的にanyを使用
};

/**
 * 学習継続記録を取得
 */
export const getStreakData = async (userId: string): Promise<{
  currentStreak: number;
  longestStreak: number;
  streakHistory: Array<{
    date: string;
    hasStudied: boolean;
    studyTime: number;
  }>;
  streakMilestones: Array<{
    milestone: number;
    achievedAt: Date | null;
  }>;
}> => {
  const response = await apiClient.get(`/progress/${userId}/streak`);
  return response as any; // 複雑な型のため一時的にanyを使用
};

/**
 * 進捗予測を取得
 */
export const getProgressForecast = async (userId: string, phaseId?: string): Promise<{
  estimatedCompletionDate: Date;
  confidence: number; // 0-1
  factors: Array<{
    factor: string;
    impact: 'positive' | 'negative' | 'neutral';
    description: string;
  }>;
  recommendations: string[];
}> => {
  let endpoint = `/progress/${userId}/forecast`;
  if (phaseId) {
    endpoint += `?phaseId=${phaseId}`;
  }
  
  const response = await apiClient.get(endpoint);
  return response as any; // 複雑な型のため一時的にanyを使用
};

/**
 * 学習計画の調整提案を取得
 */
export const getScheduleAdjustmentSuggestions = async (userId: string): Promise<ScheduleAdjustment[]> => {
  const response = await apiClient.get<ScheduleAdjustment[]>(`/progress/${userId}/schedule-suggestions`);
  return response;
};

/**
 * 学習計画を調整
 */
export const applyScheduleAdjustments = async (userId: string, adjustments: ScheduleAdjustment[]): Promise<{
  success: boolean;
  updatedTasks: string[];
  conflicts: Array<{
    taskId: string;
    issue: string;
  }>;
}> => {
  const response = await apiClient.post(`/progress/${userId}/apply-adjustments`, { adjustments });
  return response as any; // 複雑な型のため一時的にanyを使用
};

/**
 * 進捗レポートを生成
 */
export const generateProgressReport = async (userId: string, options: {
  timeRange: TimeRange;
  includeCharts: boolean;
  includeRecommendations: boolean;
  format: 'json' | 'pdf';
}): Promise<{
  reportId: string;
  downloadUrl?: string;
  data?: any;
}> => {
  const response = await apiClient.post(`/progress/${userId}/report`, options);
  return response as any; // 複雑な型のため一時的にanyを使用
};