/**
 * リソース管理関連のAPIクライアント関数
 * 学習リソースの管理と検索機能を提供
 */

import { apiClient } from './client';
import type {
  Resource,
  CreateResourceRequest,
  UpdateResourceRequest,
  ResourceType,
  DifficultyLevel,
  ApiResponse,
  PaginatedResponse,
} from '@/types';

/**
 * リソース一覧を取得
 */
export const getResources = async (query: {
  phaseId?: string;
  type?: ResourceType;
  difficulty?: DifficultyLevel;
  tags?: string[];
  search?: string;
  page?: number;
  limit?: number;
} = {}): Promise<PaginatedResponse<Resource>> => {
  const searchParams = new URLSearchParams();
  
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (Array.isArray(value)) {
        value.forEach(item => searchParams.append(key, String(item)));
      } else {
        searchParams.append(key, String(value));
      }
    }
  });

  const queryString = searchParams.toString();
  const endpoint = queryString ? `/resources?${queryString}` : '/resources';
  
  const response = await apiClient.get<PaginatedResponse<Resource>>(endpoint);
  return response;
};

/**
 * 特定のリソースを取得
 */
export const getResource = async (id: string): Promise<Resource> => {
  const response = await apiClient.get<Resource>(`/resources/${id}`);
  return response;
};

/**
 * 新しいリソースを作成
 */
export const createResource = async (data: CreateResourceRequest): Promise<Resource> => {
  const response = await apiClient.post<Resource>('/resources', data);
  return response;
};

/**
 * リソースを更新
 */
export const updateResource = async (data: UpdateResourceRequest): Promise<Resource> => {
  const { id, ...updateData } = data;
  const response = await apiClient.put<Resource>(`/resources/${id}`, updateData);
  return response;
};

/**
 * リソースを削除
 */
export const deleteResource = async (id: string): Promise<void> => {
  await apiClient.delete(`/resources/${id}`);
};

/**
 * フェーズ別のリソースを取得
 */
export const getResourcesByPhase = async (phaseId: string): Promise<Resource[]> => {
  const response = await getResources({ phaseId });
  return response.data;
};

/**
 * タイプ別のリソースを取得
 */
export const getResourcesByType = async (type: ResourceType): Promise<Resource[]> => {
  const response = await getResources({ type });
  return response.data;
};

/**
 * 難易度別のリソースを取得
 */
export const getResourcesByDifficulty = async (difficulty: DifficultyLevel): Promise<Resource[]> => {
  const response = await getResources({ difficulty });
  return response.data;
};

/**
 * タグでリソースを検索
 */
export const searchResourcesByTags = async (tags: string[]): Promise<Resource[]> => {
  const response = await getResources({ tags });
  return response.data;
};

/**
 * キーワードでリソースを検索
 */
export const searchResources = async (keyword: string): Promise<Resource[]> => {
  const response = await getResources({ search: keyword });
  return response.data;
};

/**
 * おすすめリソースを取得
 */
export const getRecommendedResources = async (userId: string, phaseId?: string): Promise<Resource[]> => {
  let endpoint = `/resources/recommended/${userId}`;
  if (phaseId) {
    endpoint += `?phaseId=${phaseId}`;
  }
  
  const response = await apiClient.get<Resource[]>(endpoint);
  return response;
};

/**
 * 人気のリソースを取得
 */
export const getPopularResources = async (timeRange: 'week' | 'month' | 'all' = 'month'): Promise<Resource[]> => {
  const response = await apiClient.get<Resource[]>(`/resources/popular?timeRange=${timeRange}`);
  return response;
};

/**
 * 最近追加されたリソースを取得
 */
export const getRecentResources = async (limit: number = 10): Promise<Resource[]> => {
  const response = await apiClient.get<Resource[]>(`/resources/recent?limit=${limit}`);
  return response;
};

/**
 * リソースの統計情報を取得
 */
export const getResourceStats = async (): Promise<{
  totalResources: number;
  resourcesByType: Record<ResourceType, number>;
  resourcesByDifficulty: Record<DifficultyLevel, number>;
  averageEstimatedTime: number;
  mostUsedTags: Array<{
    tag: string;
    count: number;
  }>;
}> => {
  const response = await apiClient.get('/resources/stats');
  return response as any; // 複雑な型のため一時的にanyを使用
};

/**
 * リソースの利用状況を記録
 */
export const recordResourceUsage = async (resourceId: string, userId: string, action: 'view' | 'bookmark' | 'complete'): Promise<void> => {
  await apiClient.post(`/resources/${resourceId}/usage`, {
    userId,
    action,
    timestamp: new Date(),
  });
};

/**
 * ユーザーのブックマークしたリソースを取得
 */
export const getBookmarkedResources = async (userId: string): Promise<Resource[]> => {
  const response = await apiClient.get<Resource[]>(`/resources/bookmarks/${userId}`);
  return response;
};

/**
 * リソースをブックマークに追加
 */
export const bookmarkResource = async (resourceId: string, userId: string): Promise<void> => {
  await apiClient.post(`/resources/${resourceId}/bookmark`, { userId });
};

/**
 * リソースをブックマークから削除
 */
export const unbookmarkResource = async (resourceId: string, userId: string): Promise<void> => {
  await apiClient.delete(`/resources/${resourceId}/bookmark?userId=${userId}`);
};

/**
 * リソースの完了状況を記録
 */
export const markResourceAsCompleted = async (resourceId: string, userId: string, completedAt?: Date): Promise<void> => {
  await apiClient.post(`/resources/${resourceId}/complete`, {
    userId,
    completedAt: completedAt || new Date(),
  });
};

/**
 * ユーザーの完了したリソースを取得
 */
export const getCompletedResources = async (userId: string): Promise<Array<Resource & {
  completedAt: Date;
}>> => {
  const response = await apiClient.get(`/resources/completed/${userId}`);
  return response as any; // 複雑な型のため一時的にanyを使用
};

/**
 * リソースの評価を追加
 */
export const rateResource = async (resourceId: string, userId: string, rating: number, review?: string): Promise<void> => {
  await apiClient.post(`/resources/${resourceId}/rate`, {
    userId,
    rating,
    review,
    createdAt: new Date(),
  });
};

/**
 * リソースの評価を取得
 */
export const getResourceRatings = async (resourceId: string): Promise<{
  averageRating: number;
  totalRatings: number;
  ratings: Array<{
    userId: string;
    rating: number;
    review?: string;
    createdAt: Date;
  }>;
}> => {
  const response = await apiClient.get(`/resources/${resourceId}/ratings`);
  return response as any; // 複雑な型のため一時的にanyを使用
};

/**
 * リソースのURLの有効性をチェック
 */
export const checkResourceUrl = async (url: string): Promise<{
  isValid: boolean;
  statusCode?: number;
  error?: string;
}> => {
  const response = await apiClient.post('/resources/check-url', { url });
  return response as any; // 複雑な型のため一時的にanyを使用
};

/**
 * リソースを一括インポート
 */
export const bulkImportResources = async (resources: CreateResourceRequest[]): Promise<{
  success: number;
  failed: number;
  errors: Array<{
    index: number;
    error: string;
  }>;
}> => {
  const response = await apiClient.post('/resources/bulk-import', { resources });
  return response as any; // 複雑な型のため一時的にanyを使用
};