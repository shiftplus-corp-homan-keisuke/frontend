import { z } from 'zod';
import type {
  TaskStatus,
  TaskType,
  Priority,
  ArtifactType,
  ResourceType,
  DifficultyLevel,
  ProductivityRating,
  ActivityType,
  NotificationType,
} from '@/types';

// 基本的なバリデーションスキーマ
export const taskStatusSchema = z.enum(['not_started', 'in_progress', 'completed'] as const);
export const taskTypeSchema = z.enum(['theory', 'practice', 'project', 'assessment'] as const);
export const prioritySchema = z.enum(['low', 'medium', 'high'] as const);
export const artifactTypeSchema = z.enum(['code', 'document', 'design', 'video', 'other'] as const);
export const resourceTypeSchema = z.enum(['article', 'video', 'documentation', 'tutorial', 'book'] as const);
export const difficultyLevelSchema = z.enum(['beginner', 'intermediate', 'advanced'] as const);
export const productivityRatingSchema = z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5)]);
export const activityTypeSchema = z.enum(['task_completed', 'session_started', 'session_ended', 'artifact_uploaded', 'phase_completed', 'milestone_reached'] as const);
export const notificationTypeSchema = z.enum(['info', 'success', 'warning', 'error'] as const);

// コアエンティティのバリデーションスキーマ
export const phaseSchema = z.object({
  id: z.string().min(1, '必須項目です'),
  name: z.string().min(1, 'フェーズ名は必須です').max(100, 'フェーズ名は100文字以内で入力してください'),
  description: z.string().min(1, '説明は必須です').max(1000, '説明は1000文字以内で入力してください'),
  duration: z.number().min(1, '期間は1週間以上である必要があります').max(52, '期間は52週間以内である必要があります'),
  order: z.number().min(1, '順序は1以上である必要があります'),
  prerequisites: z.array(z.string()),
  learningObjectives: z.array(z.string().min(1, '学習目標は空にできません')),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const taskSchema = z.object({
  id: z.string().min(1, '必須項目です'),
  phaseId: z.string().min(1, 'フェーズIDは必須です'),
  title: z.string().min(1, 'タスク名は必須です').max(200, 'タスク名は200文字以内で入力してください'),
  description: z.string().min(1, '説明は必須です').max(2000, '説明は2000文字以内で入力してください'),
  type: taskTypeSchema,
  status: taskStatusSchema,
  priority: prioritySchema,
  estimatedHours: z.number().min(0.5, '見積時間は0.5時間以上である必要があります').max(100, '見積時間は100時間以内である必要があります'),
  actualHours: z.number().min(0, '実際の時間は0以上である必要があります').optional(),
  dueDate: z.date().optional(),
  dependencies: z.array(z.string()),
  requirements: z.array(z.string()),
  artifacts: z.array(z.string()),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const studySessionSchema = z.object({
  id: z.string().min(1, '必須項目です'),
  userId: z.string().min(1, 'ユーザーIDは必須です'),
  taskId: z.string().optional(),
  phaseId: z.string().min(1, 'フェーズIDは必須です'),
  startTime: z.date(),
  endTime: z.date().optional(),
  duration: z.number().min(1, '学習時間は1分以上である必要があります').max(1440, '学習時間は24時間以内である必要があります'),
  notes: z.string().max(1000, 'メモは1000文字以内で入力してください').optional(),
  productivity: productivityRatingSchema,
  createdAt: z.date(),
});

export const artifactMetadataSchema = z.object({
  fileSize: z.number().min(0, 'ファイルサイズは0以上である必要があります').optional(),
  mimeType: z.string().optional(),
  language: z.string().optional(),
  framework: z.string().optional(),
  difficulty: difficultyLevelSchema,
});

export const artifactSchema = z.object({
  id: z.string().min(1, '必須項目です'),
  userId: z.string().min(1, 'ユーザーIDは必須です'),
  taskId: z.string().min(1, 'タスクIDは必須です'),
  phaseId: z.string().min(1, 'フェーズIDは必須です'),
  title: z.string().min(1, 'タイトルは必須です').max(200, 'タイトルは200文字以内で入力してください'),
  description: z.string().max(1000, '説明は1000文字以内で入力してください').optional(),
  type: artifactTypeSchema,
  fileUrl: z.string().url('有効なURLを入力してください').optional(),
  externalUrl: z.string().url('有効なURLを入力してください').optional(),
  tags: z.array(z.string().min(1, 'タグは空にできません')),
  isPublic: z.boolean(),
  metadata: artifactMetadataSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const progressSchema = z.object({
  id: z.string().min(1, '必須項目です'),
  userId: z.string().min(1, 'ユーザーIDは必須です'),
  phaseId: z.string().min(1, 'フェーズIDは必須です'),
  taskId: z.string().optional(),
  completedTasks: z.number().min(0, '完了タスク数は0以上である必要があります'),
  totalTasks: z.number().min(0, '総タスク数は0以上である必要があります'),
  completionRate: z.number().min(0, '完了率は0以上である必要があります').max(100, '完了率は100以下である必要があります'),
  totalStudyTime: z.number().min(0, '学習時間は0以上である必要があります'),
  lastActivityAt: z.date(),
  streak: z.number().min(0, '連続学習日数は0以上である必要があります'),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const userSchema = z.object({
  id: z.string().min(1, '必須項目です'),
  name: z.string().min(1, '名前は必須です').max(100, '名前は100文字以内で入力してください'),
  email: z.string().email('有効なメールアドレスを入力してください'),
  avatar: z.string().url('有効なURLを入力してください').optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const resourceSchema = z.object({
  id: z.string().min(1, '必須項目です'),
  title: z.string().min(1, 'タイトルは必須です').max(200, 'タイトルは200文字以内で入力してください'),
  description: z.string().max(1000, '説明は1000文字以内で入力してください').optional(),
  url: z.string().url('有効なURLを入力してください'),
  type: resourceTypeSchema,
  tags: z.array(z.string().min(1, 'タグは空にできません')),
  difficulty: difficultyLevelSchema,
  estimatedTime: z.number().min(1, '見積時間は1分以上である必要があります').max(1440, '見積時間は24時間以内である必要があります').optional(),
  createdAt: z.date(),
});

export const activitySchema = z.object({
  id: z.string().min(1, '必須項目です'),
  userId: z.string().min(1, 'ユーザーIDは必須です'),
  type: activityTypeSchema,
  description: z.string().min(1, '説明は必須です').max(500, '説明は500文字以内で入力してください'),
  metadata: z.record(z.string(), z.any()).optional(),
  createdAt: z.date(),
});

export const notificationSchema = z.object({
  id: z.string().min(1, '必須項目です'),
  userId: z.string().min(1, 'ユーザーIDは必須です'),
  title: z.string().min(1, 'タイトルは必須です').max(100, 'タイトルは100文字以内で入力してください'),
  message: z.string().min(1, 'メッセージは必須です').max(500, 'メッセージは500文字以内で入力してください'),
  type: notificationTypeSchema,
  read: z.boolean(),
  createdAt: z.date(),
});

// API リクエスト用のバリデーションスキーマ
export const createPhaseRequestSchema = z.object({
  name: z.string().min(1, 'フェーズ名は必須です').max(100, 'フェーズ名は100文字以内で入力してください'),
  description: z.string().min(1, '説明は必須です').max(1000, '説明は1000文字以内で入力してください'),
  duration: z.number().min(1, '期間は1週間以上である必要があります').max(52, '期間は52週間以内である必要があります'),
  order: z.number().min(1, '順序は1以上である必要があります'),
  prerequisites: z.array(z.string()),
  learningObjectives: z.array(z.string().min(1, '学習目標は空にできません')),
});

export const updatePhaseRequestSchema = createPhaseRequestSchema.partial().extend({
  id: z.string().min(1, 'IDは必須です'),
});

export const createTaskRequestSchema = z.object({
  phaseId: z.string().min(1, 'フェーズIDは必須です'),
  title: z.string().min(1, 'タスク名は必須です').max(200, 'タスク名は200文字以内で入力してください'),
  description: z.string().min(1, '説明は必須です').max(2000, '説明は2000文字以内で入力してください'),
  type: taskTypeSchema,
  priority: prioritySchema,
  estimatedHours: z.number().min(0.5, '見積時間は0.5時間以上である必要があります').max(100, '見積時間は100時間以内である必要があります'),
  dueDate: z.date().optional(),
  dependencies: z.array(z.string()),
  requirements: z.array(z.string()),
});

export const updateTaskRequestSchema = createTaskRequestSchema.partial().extend({
  id: z.string().min(1, 'IDは必須です'),
  status: taskStatusSchema.optional(),
  actualHours: z.number().min(0, '実際の時間は0以上である必要があります').optional(),
});

export const createStudySessionRequestSchema = z.object({
  userId: z.string().min(1, 'ユーザーIDは必須です'),
  taskId: z.string().optional(),
  phaseId: z.string().min(1, 'フェーズIDは必須です'),
  startTime: z.date(),
  endTime: z.date().optional(),
  duration: z.number().min(1, '学習時間は1分以上である必要があります').max(1440, '学習時間は24時間以内である必要があります'),
  notes: z.string().max(1000, 'メモは1000文字以内で入力してください').optional(),
  productivity: productivityRatingSchema,
});

export const updateStudySessionRequestSchema = createStudySessionRequestSchema.partial().extend({
  id: z.string().min(1, 'IDは必須です'),
});

export const createArtifactRequestSchema = z.object({
  userId: z.string().min(1, 'ユーザーIDは必須です'),
  taskId: z.string().min(1, 'タスクIDは必須です'),
  phaseId: z.string().min(1, 'フェーズIDは必須です'),
  title: z.string().min(1, 'タイトルは必須です').max(200, 'タイトルは200文字以内で入力してください'),
  description: z.string().max(1000, '説明は1000文字以内で入力してください').optional(),
  type: artifactTypeSchema,
  fileUrl: z.string().url('有効なURLを入力してください').optional(),
  externalUrl: z.string().url('有効なURLを入力してください').optional(),
  tags: z.array(z.string().min(1, 'タグは空にできません')),
  isPublic: z.boolean(),
  metadata: artifactMetadataSchema,
});

export const updateArtifactRequestSchema = createArtifactRequestSchema.partial().extend({
  id: z.string().min(1, 'IDは必須です'),
});

export const createResourceRequestSchema = z.object({
  title: z.string().min(1, 'タイトルは必須です').max(200, 'タイトルは200文字以内で入力してください'),
  description: z.string().max(1000, '説明は1000文字以内で入力してください').optional(),
  url: z.string().url('有効なURLを入力してください'),
  type: resourceTypeSchema,
  tags: z.array(z.string().min(1, 'タグは空にできません')),
  difficulty: difficultyLevelSchema,
  estimatedTime: z.number().min(1, '見積時間は1分以上である必要があります').max(1440, '見積時間は24時間以内である必要があります').optional(),
});

export const updateResourceRequestSchema = createResourceRequestSchema.partial().extend({
  id: z.string().min(1, 'IDは必須です'),
});

// クエリパラメータ用のバリデーションスキーマ
export const getTasksQuerySchema = z.object({
  phaseId: z.string().optional(),
  status: taskStatusSchema.optional(),
  type: taskTypeSchema.optional(),
  priority: prioritySchema.optional(),
  page: z.number().min(1, 'ページ番号は1以上である必要があります').optional(),
  limit: z.number().min(1, '取得件数は1以上である必要があります').max(100, '取得件数は100以下である必要があります').optional(),
  sortBy: z.enum(['title', 'dueDate', 'priority', 'createdAt']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  search: z.string().max(100, '検索キーワードは100文字以内で入力してください').optional(),
});

export const getStudySessionsQuerySchema = z.object({
  userId: z.string().optional(),
  taskId: z.string().optional(),
  phaseId: z.string().optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  page: z.number().min(1, 'ページ番号は1以上である必要があります').optional(),
  limit: z.number().min(1, '取得件数は1以上である必要があります').max(100, '取得件数は100以下である必要があります').optional(),
});

export const getArtifactsQuerySchema = z.object({
  userId: z.string().optional(),
  taskId: z.string().optional(),
  phaseId: z.string().optional(),
  type: artifactTypeSchema.optional(),
  isPublic: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
  page: z.number().min(1, 'ページ番号は1以上である必要があります').optional(),
  limit: z.number().min(1, '取得件数は1以上である必要があります').max(100, '取得件数は100以下である必要があります').optional(),
});

export const getProgressQuerySchema = z.object({
  userId: z.string().min(1, 'ユーザーIDは必須です'),
  phaseId: z.string().optional(),
  timeRange: z.enum(['day', 'week', 'month', 'phase', 'all']).optional(),
});

// バルク操作用のバリデーションスキーマ
export const bulkUpdateTasksRequestSchema = z.object({
  taskIds: z.array(z.string().min(1, 'タスクIDは必須です')).min(1, '少なくとも1つのタスクIDが必要です'),
  updates: updateTaskRequestSchema.omit({ id: true }),
});

export const bulkDeleteRequestSchema = z.object({
  ids: z.array(z.string().min(1, 'IDは必須です')).min(1, '少なくとも1つのIDが必要です'),
});

// API レスポンス用のバリデーションスキーマ
export const apiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    data: dataSchema,
    message: z.string().optional(),
    success: z.boolean(),
    timestamp: z.date(),
  });

export const paginatedResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    data: z.array(dataSchema),
    total: z.number().min(0, '総件数は0以上である必要があります'),
    page: z.number().min(1, 'ページ番号は1以上である必要があります'),
    limit: z.number().min(1, '取得件数は1以上である必要があります'),
    hasMore: z.boolean(),
    timestamp: z.date(),
  });

export const apiErrorSchema = z.object({
  success: z.literal(false),
  error: z.object({
    code: z.string(),
    message: z.string(),
    details: z.record(z.string(), z.any()).optional(),
  }),
  timestamp: z.date(),
});

// カスタムバリデーション関数
export const validateTaskDependencies = (task: z.infer<typeof taskSchema>, allTasks: z.infer<typeof taskSchema>[]) => {
  const errors: string[] = [];
  
  // 循環依存のチェック
  const checkCircularDependency = (taskId: string, visited: Set<string> = new Set()): boolean => {
    if (visited.has(taskId)) {
      return true; // 循環依存を検出
    }
    
    visited.add(taskId);
    const currentTask = allTasks.find(t => t.id === taskId);
    
    if (currentTask) {
      for (const depId of currentTask.dependencies) {
        if (checkCircularDependency(depId, new Set(visited))) {
          return true;
        }
      }
    }
    
    return false;
  };
  
  if (checkCircularDependency(task.id)) {
    errors.push('タスクの依存関係に循環参照があります');
  }
  
  // 存在しない依存タスクのチェック
  for (const depId of task.dependencies) {
    if (!allTasks.find(t => t.id === depId)) {
      errors.push(`依存タスク ${depId} が存在しません`);
    }
  }
  
  return errors;
};

export const validateStudySessionDuration = (session: z.infer<typeof studySessionSchema>) => {
  const errors: string[] = [];
  
  if (session.endTime && session.startTime) {
    const calculatedDuration = Math.floor((session.endTime.getTime() - session.startTime.getTime()) / (1000 * 60));
    
    if (Math.abs(calculatedDuration - session.duration) > 1) {
      errors.push('開始時間と終了時間から計算される時間と記録された時間が一致しません');
    }
  }
  
  return errors;
};

// 型推論のためのヘルパー型
export type PhaseSchema = z.infer<typeof phaseSchema>;
export type TaskSchema = z.infer<typeof taskSchema>;
export type StudySessionSchema = z.infer<typeof studySessionSchema>;
export type ArtifactSchema = z.infer<typeof artifactSchema>;
export type ProgressSchema = z.infer<typeof progressSchema>;
export type UserSchema = z.infer<typeof userSchema>;
export type ResourceSchema = z.infer<typeof resourceSchema>;
export type ActivitySchema = z.infer<typeof activitySchema>;
export type NotificationSchema = z.infer<typeof notificationSchema>;

export type CreatePhaseRequestSchema = z.infer<typeof createPhaseRequestSchema>;
export type UpdatePhaseRequestSchema = z.infer<typeof updatePhaseRequestSchema>;
export type CreateTaskRequestSchema = z.infer<typeof createTaskRequestSchema>;
export type UpdateTaskRequestSchema = z.infer<typeof updateTaskRequestSchema>;
export type CreateStudySessionRequestSchema = z.infer<typeof createStudySessionRequestSchema>;
export type UpdateStudySessionRequestSchema = z.infer<typeof updateStudySessionRequestSchema>;
export type CreateArtifactRequestSchema = z.infer<typeof createArtifactRequestSchema>;
export type UpdateArtifactRequestSchema = z.infer<typeof updateArtifactRequestSchema>;
export type CreateResourceRequestSchema = z.infer<typeof createResourceRequestSchema>;
export type UpdateResourceRequestSchema = z.infer<typeof updateResourceRequestSchema>;

export type GetTasksQuerySchema = z.infer<typeof getTasksQuerySchema>;
export type GetStudySessionsQuerySchema = z.infer<typeof getStudySessionsQuerySchema>;
export type GetArtifactsQuerySchema = z.infer<typeof getArtifactsQuerySchema>;
export type GetProgressQuerySchema = z.infer<typeof getProgressQuerySchema>;

export type BulkUpdateTasksRequestSchema = z.infer<typeof bulkUpdateTasksRequestSchema>;
export type BulkDeleteRequestSchema = z.infer<typeof bulkDeleteRequestSchema>;