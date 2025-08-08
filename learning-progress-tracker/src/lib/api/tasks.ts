/**
 * タスク関連のAPIクライアント関数
 * 学習タスクのCRUD操作とクエリ機能を提供
 */

import { apiClient } from './client';
import type {
  Task,
  CreateTaskRequest,
  UpdateTaskRequest,
  GetTasksQuery,
  BulkUpdateTasksRequest,
  BulkDeleteRequest,
  TaskStatus,
  ApiResponse,
  PaginatedResponse,
} from '@/types';

/**
 * タスク一覧を取得（フィルタリング・ソート・ページネーション対応）
 */
export const getTasks = async (query: GetTasksQuery = {}): Promise<PaginatedResponse<Task>> => {
  const searchParams = new URLSearchParams();
  
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, String(value));
    }
  });

  const queryString = searchParams.toString();
  const endpoint = queryString ? `/tasks?${queryString}` : '/tasks';
  
  const response = await apiClient.get<PaginatedResponse<Task>>(endpoint);
  return response;
};

/**
 * 特定のフェーズのタスクを取得
 */
export const getTasksByPhase = async (phaseId: string): Promise<Task[]> => {
  const response = await apiClient.get<Task[]>(`/tasks?phaseId=${phaseId}`);
  return response;
};

/**
 * 特定のタスクを取得
 */
export const getTask = async (id: string): Promise<Task> => {
  const response = await apiClient.get<Task>(`/tasks/${id}`);
  return response;
};

/**
 * 新しいタスクを作成
 */
export const createTask = async (data: CreateTaskRequest): Promise<Task> => {
  const response = await apiClient.post<Task>('/tasks', data);
  return response;
};

/**
 * タスクを更新
 */
export const updateTask = async (data: UpdateTaskRequest): Promise<Task> => {
  const { id, ...updateData } = data;
  const response = await apiClient.put<Task>(`/tasks/${id}`, updateData);
  return response;
};

/**
 * タスクのステータスを更新
 */
export const updateTaskStatus = async (id: string, status: TaskStatus): Promise<Task> => {
  const response = await apiClient.patch<Task>(`/tasks/${id}/status`, { status });
  return response;
};

/**
 * タスクを削除
 */
export const deleteTask = async (id: string): Promise<void> => {
  await apiClient.delete(`/tasks/${id}`);
};

/**
 * 複数のタスクを一括更新
 */
export const bulkUpdateTasks = async (data: BulkUpdateTasksRequest): Promise<Task[]> => {
  const response = await apiClient.patch<Task[]>('/tasks/bulk-update', data);
  return response;
};

/**
 * 複数のタスクを一括削除
 */
export const bulkDeleteTasks = async (data: BulkDeleteRequest): Promise<void> => {
  await apiClient.post('/tasks/bulk-delete', data);
};

/**
 * タスクの依存関係をチェック
 */
export const checkTaskDependencies = async (taskId: string): Promise<{
  canStart: boolean;
  pendingDependencies: Task[];
}> => {
  const response = await apiClient.get<{
    canStart: boolean;
    pendingDependencies: Task[];
  }>(`/tasks/${taskId}/dependencies`);
  return response;
};

/**
 * タスクの推定時間を更新
 */
export const updateTaskEstimate = async (id: string, estimatedHours: number): Promise<Task> => {
  const response = await apiClient.patch<Task>(`/tasks/${id}/estimate`, { estimatedHours });
  return response;
};

/**
 * タスクの実際の作業時間を記録
 */
export const recordTaskTime = async (id: string, actualHours: number): Promise<Task> => {
  const response = await apiClient.patch<Task>(`/tasks/${id}/time`, { actualHours });
  return response;
};

/**
 * 期限切れのタスクを取得
 */
export const getOverdueTasks = async (userId: string): Promise<Task[]> => {
  const response = await apiClient.get<Task[]>(`/tasks/overdue?userId=${userId}`);
  return response;
};

/**
 * 今日期限のタスクを取得
 */
export const getTodayTasks = async (userId: string): Promise<Task[]> => {
  const response = await apiClient.get<Task[]>(`/tasks/today?userId=${userId}`);
  return response;
};

/**
 * 今週期限のタスクを取得
 */
export const getWeekTasks = async (userId: string): Promise<Task[]> => {
  const response = await apiClient.get<Task[]>(`/tasks/week?userId=${userId}`);
  return response;
};