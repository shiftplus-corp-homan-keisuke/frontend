/**
 * 学習セッション関連のAPIクライアント関数
 * 学習時間の記録と分析機能を提供
 */

import { apiClient } from './client';
import type {
  StudySession,
  CreateStudySessionRequest,
  UpdateStudySessionRequest,
  GetStudySessionsQuery,
  ApiResponse,
  PaginatedResponse,
  ProductivityRating,
} from '@/types';

/**
 * 学習セッション一覧を取得
 */
export const getStudySessions = async (query: GetStudySessionsQuery = {}): Promise<PaginatedResponse<StudySession>> => {
  const searchParams = new URLSearchParams();
  
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (value instanceof Date) {
        searchParams.append(key, value.toISOString());
      } else {
        searchParams.append(key, String(value));
      }
    }
  });

  const queryString = searchParams.toString();
  const endpoint = queryString ? `/studySessions?${queryString}` : '/studySessions';
  
  const response = await apiClient.get<PaginatedResponse<StudySession>>(endpoint);
  return response;
};

/**
 * 特定の学習セッションを取得
 */
export const getStudySession = async (id: string): Promise<StudySession> => {
  const response = await apiClient.get<StudySession>(`/studySessions/${id}`);
  return response;
};

/**
 * 新しい学習セッションを作成
 */
export const createStudySession = async (data: CreateStudySessionRequest): Promise<StudySession> => {
  const response = await apiClient.post<StudySession>('/studySessions', data);
  return response;
};

/**
 * 学習セッションを更新
 */
export const updateStudySession = async (data: UpdateStudySessionRequest): Promise<StudySession> => {
  const { id, ...updateData } = data;
  const response = await apiClient.put<StudySession>(`/studySessions/${id}`, updateData);
  return response;
};

/**
 * 学習セッションを削除
 */
export const deleteStudySession = async (id: string): Promise<void> => {
  await apiClient.delete(`/studySessions/${id}`);
};

/**
 * 学習セッションを開始
 */
export const startStudySession = async (data: {
  userId: string;
  taskId?: string;
  phaseId: string;
}): Promise<StudySession> => {
  const sessionData: CreateStudySessionRequest = {
    ...data,
    startTime: new Date(),
    duration: 0,
    productivity: 3, // デフォルト値
  };
  
  const response = await apiClient.post<StudySession>('/studySessions', sessionData);
  return response;
};

/**
 * 学習セッションを終了
 */
export const endStudySession = async (data: {
  id: string;
  endTime: Date;
  duration: number;
  notes?: string;
  productivity: ProductivityRating;
}): Promise<StudySession> => {
  const { id, ...updateData } = data;
  const response = await apiClient.patch<StudySession>(`/studySessions/${id}/end`, updateData);
  return response;
};

/**
 * ユーザーの学習統計を取得
 */
export const getUserStudyStats = async (userId: string, timeRange?: {
  startDate: Date;
  endDate: Date;
}): Promise<{
  totalSessions: number;
  totalStudyTime: number; // 分
  averageSessionLength: number; // 分
  averageProductivity: number;
  studyStreak: number; // 連続学習日数
  dailyStats: Array<{
    date: string;
    sessions: number;
    studyTime: number;
    productivity: number;
  }>;
}> => {
  let endpoint = `/studySessions/stats/${userId}`;
  
  if (timeRange) {
    const params = new URLSearchParams({
      startDate: timeRange.startDate.toISOString(),
      endDate: timeRange.endDate.toISOString(),
    });
    endpoint += `?${params.toString()}`;
  }
  
  const response = await apiClient.get(endpoint);
  return response as any; // 複雑な型のため一時的にanyを使用
};

/**
 * フェーズ別の学習統計を取得
 */
export const getPhaseStudyStats = async (phaseId: string, userId: string): Promise<{
  totalSessions: number;
  totalStudyTime: number;
  averageProductivity: number;
  taskBreakdown: Array<{
    taskId: string;
    taskTitle: string;
    studyTime: number;
    sessions: number;
  }>;
}> => {
  const response = await apiClient.get(`/studySessions/stats/phase/${phaseId}?userId=${userId}`);
  return response as any; // 複雑な型のため一時的にanyを使用
};

/**
 * タスク別の学習統計を取得
 */
export const getTaskStudyStats = async (taskId: string, userId: string): Promise<{
  totalSessions: number;
  totalStudyTime: number;
  averageProductivity: number;
  sessions: StudySession[];
}> => {
  const response = await apiClient.get(`/studySessions/stats/task/${taskId}?userId=${userId}`);
  return response as any; // 複雑な型のため一時的にanyを使用
};

/**
 * 今日の学習セッションを取得
 */
export const getTodayStudySessions = async (userId: string): Promise<StudySession[]> => {
  const today = new Date();
  const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
  
  const response = await getStudySessions({
    userId,
    startDate: startOfDay,
    endDate: endOfDay,
  });
  
  return response.data;
};

/**
 * 今週の学習セッションを取得
 */
export const getWeekStudySessions = async (userId: string): Promise<StudySession[]> => {
  const today = new Date();
  const startOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay());
  const endOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() + 6, 23, 59, 59);
  
  const response = await getStudySessions({
    userId,
    startDate: startOfWeek,
    endDate: endOfWeek,
  });
  
  return response.data;
};

/**
 * 学習継続日数を取得
 */
export const getStudyStreak = async (userId: string): Promise<{
  currentStreak: number;
  longestStreak: number;
  lastStudyDate: Date | null;
}> => {
  const response = await apiClient.get(`/studySessions/streak/${userId}`);
  return response as any; // 複雑な型のため一時的にanyを使用
};