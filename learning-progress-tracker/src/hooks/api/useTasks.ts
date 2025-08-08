/**
 * タスク関連のTanStack Queryフック
 * タスクデータの取得、作成、更新、削除を管理
 */

import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import {
  getTasks,
  getTask,
  getTasksByPhase,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
  bulkUpdateTasks,
  bulkDeleteTasks,
  checkTaskDependencies,
  getOverdueTasks,
  getTodayTasks,
  getWeekTasks,
  createCacheKey,
  createRetryConfig,
} from '@/lib/api';
import type {
  Task,
  CreateTaskRequest,
  UpdateTaskRequest,
  GetTasksQuery,
  TaskStatus,
  BulkUpdateTasksRequest,
  BulkDeleteRequest,
} from '@/types';

/**
 * タスク一覧を取得するフック（ページネーション対応）
 */
export const useTasks = (query: GetTasksQuery = {}) => {
  return useQuery({
    queryKey: createCacheKey.tasks(query),
    queryFn: () => getTasks(query),
    staleTime: 3 * 60 * 1000, // 3分間キャッシュ
    ...createRetryConfig(),
  });
};

/**
 * 無限スクロール対応のタスク一覧取得フック
 */
export const useInfiniteTasks = (query: Omit<GetTasksQuery, 'page'> = {}) => {
  return useInfiniteQuery({
    queryKey: ['tasks-infinite', query],
    queryFn: ({ pageParam = 1 }) => getTasks({ ...query, page: pageParam }),
    getNextPageParam: (lastPage) => {
      return lastPage.hasMore ? (lastPage.page + 1) : undefined;
    },
    initialPageParam: 1,
    staleTime: 3 * 60 * 1000,
    ...createRetryConfig(),
  });
};

/**
 * 特定のタスクを取得するフック
 */
export const useTask = (id: string) => {
  return useQuery({
    queryKey: createCacheKey.task(id),
    queryFn: () => getTask(id),
    enabled: !!id,
    staleTime: 3 * 60 * 1000,
    ...createRetryConfig(),
  });
};

/**
 * フェーズ別のタスクを取得するフック
 */
export const useTasksByPhase = (phaseId: string) => {
  return useQuery({
    queryKey: ['tasks', 'by-phase', phaseId],
    queryFn: () => getTasksByPhase(phaseId),
    enabled: !!phaseId,
    staleTime: 3 * 60 * 1000,
    ...createRetryConfig(),
  });
};

/**
 * タスクを作成するミューテーションフック
 */
export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTask,
    onSuccess: (newTask) => {
      // タスク関連のキャッシュを無効化
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      
      // 新しいタスクをキャッシュに追加
      queryClient.setQueryData(createCacheKey.task(newTask.id), newTask);
      
      // 関連するフェーズの進捗も更新
      queryClient.invalidateQueries({ queryKey: ['progress'] });
    },
    onError: (error) => {
      console.error('Failed to create task:', error);
    },
  });
};

/**
 * タスクを更新するミューテーションフック
 */
export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateTask,
    onSuccess: (updatedTask) => {
      // タスク関連のキャッシュを無効化
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      
      // 更新されたタスクをキャッシュに設定
      queryClient.setQueryData(createCacheKey.task(updatedTask.id), updatedTask);
      
      // 進捗データも更新
      queryClient.invalidateQueries({ queryKey: ['progress'] });
    },
    onError: (error) => {
      console.error('Failed to update task:', error);
    },
  });
};

/**
 * タスクのステータスを更新するミューテーションフック
 */
export const useUpdateTaskStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: TaskStatus }) => 
      updateTaskStatus(id, status),
    onMutate: async ({ id, status }) => {
      // 楽観的更新
      await queryClient.cancelQueries({ queryKey: createCacheKey.task(id) });
      const previousTask = queryClient.getQueryData<Task>(createCacheKey.task(id));

      if (previousTask) {
        queryClient.setQueryData(createCacheKey.task(id), {
          ...previousTask,
          status,
          updatedAt: new Date(),
        });
      }

      return { previousTask };
    },
    onError: (error, { id }, context) => {
      // エラー時は前の状態に戻す
      if (context?.previousTask) {
        queryClient.setQueryData(createCacheKey.task(id), context.previousTask);
      }
      console.error('Failed to update task status:', error);
    },
    onSuccess: (updatedTask) => {
      // タスク一覧と進捗データを更新
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['progress'] });
      
      // タスク完了時は学習セッションも更新
      if (updatedTask.status === 'completed') {
        queryClient.invalidateQueries({ queryKey: ['studySessions'] });
      }
    },
  });
};

/**
 * タスクを削除するミューテーションフック
 */
export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTask,
    onSuccess: (_, deletedId) => {
      // タスク関連のキャッシュを無効化
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      
      // 削除されたタスクのキャッシュを削除
      queryClient.removeQueries({ queryKey: createCacheKey.task(deletedId) });
      
      // 関連データも更新
      queryClient.invalidateQueries({ queryKey: ['progress'] });
      queryClient.invalidateQueries({ queryKey: ['studySessions'] });
      queryClient.invalidateQueries({ queryKey: ['artifacts'] });
    },
    onError: (error) => {
      console.error('Failed to delete task:', error);
    },
  });
};

/**
 * 複数のタスクを一括更新するミューテーションフック
 */
export const useBulkUpdateTasks = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bulkUpdateTasks,
    onSuccess: () => {
      // すべてのタスク関連キャッシュを無効化
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['progress'] });
    },
    onError: (error) => {
      console.error('Failed to bulk update tasks:', error);
    },
  });
};

/**
 * 複数のタスクを一括削除するミューテーションフック
 */
export const useBulkDeleteTasks = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bulkDeleteTasks,
    onSuccess: (_, { ids }) => {
      // タスク関連のキャッシュを無効化
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      
      // 削除されたタスクのキャッシュを削除
      ids.forEach(id => {
        queryClient.removeQueries({ queryKey: createCacheKey.task(id) });
      });
      
      // 関連データも更新
      queryClient.invalidateQueries({ queryKey: ['progress'] });
      queryClient.invalidateQueries({ queryKey: ['studySessions'] });
      queryClient.invalidateQueries({ queryKey: ['artifacts'] });
    },
    onError: (error) => {
      console.error('Failed to bulk delete tasks:', error);
    },
  });
};

/**
 * タスクの依存関係をチェックするフック
 */
export const useTaskDependencies = (taskId: string) => {
  return useQuery({
    queryKey: ['task-dependencies', taskId],
    queryFn: () => checkTaskDependencies(taskId),
    enabled: !!taskId,
    staleTime: 1 * 60 * 1000, // 1分間キャッシュ
    ...createRetryConfig(),
  });
};

/**
 * 期限切れのタスクを取得するフック
 */
export const useOverdueTasks = (userId: string) => {
  return useQuery({
    queryKey: ['tasks', 'overdue', userId],
    queryFn: () => getOverdueTasks(userId),
    enabled: !!userId,
    staleTime: 1 * 60 * 1000,
    refetchInterval: 5 * 60 * 1000, // 5分ごとに自動更新
    ...createRetryConfig(),
  });
};

/**
 * 今日期限のタスクを取得するフック
 */
export const useTodayTasks = (userId: string) => {
  return useQuery({
    queryKey: ['tasks', 'today', userId],
    queryFn: () => getTodayTasks(userId),
    enabled: !!userId,
    staleTime: 30 * 1000, // 30秒間キャッシュ
    refetchInterval: 60 * 1000, // 1分ごとに自動更新
    ...createRetryConfig(),
  });
};

/**
 * 今週期限のタスクを取得するフック
 */
export const useWeekTasks = (userId: string) => {
  return useQuery({
    queryKey: ['tasks', 'week', userId],
    queryFn: () => getWeekTasks(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
    ...createRetryConfig(),
  });
};

/**
 * タスクの統計情報を取得するフック
 */
export const useTasksStats = (phaseId?: string) => {
  const query = phaseId ? { phaseId } : {};
  const { data: tasksResponse, isLoading } = useTasks(query);
  const tasks = tasksResponse?.data || [];

  const stats = {
    total: tasks.length,
    completed: tasks.filter(task => task.status === 'completed').length,
    inProgress: tasks.filter(task => task.status === 'in_progress').length,
    notStarted: tasks.filter(task => task.status === 'not_started').length,
    overdue: tasks.filter(task => 
      task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'completed'
    ).length,
    byType: tasks.reduce((acc, task) => {
      acc[task.type] = (acc[task.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    byPriority: tasks.reduce((acc, task) => {
      acc[task.priority] = (acc[task.priority] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    totalEstimatedHours: tasks.reduce((sum, task) => sum + task.estimatedHours, 0),
    totalActualHours: tasks.reduce((sum, task) => sum + (task.actualHours || 0), 0),
  };

  return {
    data: stats,
    isLoading,
  };
};

/**
 * フィルタリングされたタスクを取得するフック
 */
export const useFilteredTasks = (filters: {
  phaseId?: string;
  status?: TaskStatus[];
  type?: string[];
  priority?: string[];
  search?: string;
}) => {
  const query: GetTasksQuery = {};
  
  if (filters.phaseId) query.phaseId = filters.phaseId;
  if (filters.status?.length && filters.status[0]) query.status = filters.status[0]; // APIが単一値のみサポートの場合
  if (filters.search) query.search = filters.search;

  const { data: tasksResponse, ...rest } = useTasks(query);
  let tasks = tasksResponse?.data || [];

  // クライアントサイドでの追加フィルタリング
  if (filters.status && filters.status.length > 1) {
    tasks = tasks.filter(task => filters.status!.includes(task.status));
  }
  
  if (filters.type?.length) {
    tasks = tasks.filter(task => filters.type!.includes(task.type));
  }
  
  if (filters.priority?.length) {
    tasks = tasks.filter(task => filters.priority!.includes(task.priority));
  }

  return {
    data: tasks,
    ...rest,
  };
};