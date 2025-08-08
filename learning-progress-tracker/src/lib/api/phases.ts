/**
 * フェーズ関連のAPIクライアント関数
 * 学習フェーズのCRUD操作とクエリ機能を提供
 */

import { apiClient } from './client';
import type {
  Phase,
  CreatePhaseRequest,
  UpdatePhaseRequest,
  ApiResponse,
  PaginatedResponse,
} from '@/types';

/**
 * すべてのフェーズを取得
 */
export const getPhases = async (): Promise<Phase[]> => {
  const response = await apiClient.get<Phase[]>('/phases');
  return response;
};

/**
 * 特定のフェーズを取得
 */
export const getPhase = async (id: string): Promise<Phase> => {
  const response = await apiClient.get<Phase>(`/phases/${id}`);
  return response;
};

/**
 * 新しいフェーズを作成
 */
export const createPhase = async (data: CreatePhaseRequest): Promise<Phase> => {
  const response = await apiClient.post<Phase>('/phases', data);
  return response;
};

/**
 * フェーズを更新
 */
export const updatePhase = async (data: UpdatePhaseRequest): Promise<Phase> => {
  const { id, ...updateData } = data;
  const response = await apiClient.put<Phase>(`/phases/${id}`, updateData);
  return response;
};

/**
 * フェーズを削除
 */
export const deletePhase = async (id: string): Promise<void> => {
  await apiClient.delete(`/phases/${id}`);
};

/**
 * フェーズの順序を更新
 */
export const updatePhaseOrder = async (phaseIds: string[]): Promise<Phase[]> => {
  const response = await apiClient.patch<Phase[]>('/phases/reorder', { phaseIds });
  return response;
};

/**
 * フェーズの前提条件をチェック
 */
export const checkPhasePrerequisites = async (phaseId: string, userId: string): Promise<{
  canStart: boolean;
  missingPrerequisites: string[];
}> => {
  const response = await apiClient.get<{
    canStart: boolean;
    missingPrerequisites: string[];
  }>(`/phases/${phaseId}/prerequisites?userId=${userId}`);
  return response;
};