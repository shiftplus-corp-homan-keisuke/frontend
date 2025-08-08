// Core entity types based on the design document

// ユニオン型とリテラル型の定義
export type TaskStatus = 'not_started' | 'in_progress' | 'completed';
export type TaskType = 'theory' | 'practice' | 'project' | 'assessment';
export type Priority = 'low' | 'medium' | 'high';
export type ArtifactType = 'code' | 'document' | 'design' | 'video' | 'other';
export type ResourceType = 'article' | 'video' | 'documentation' | 'tutorial' | 'book';
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';
export type ProductivityRating = 1 | 2 | 3 | 4 | 5;
export type ActivityType = 'task_completed' | 'session_started' | 'session_ended' | 'artifact_uploaded' | 'phase_completed' | 'milestone_reached';
export type NotificationType = 'info' | 'success' | 'warning' | 'error';
export type ViewType = 'dashboard' | 'tasks' | 'progress' | 'artifacts' | 'settings' | 'resources' | 'timer';
export type ThemeType = 'light' | 'dark' | 'system';
export type ChartType = 'line' | 'bar' | 'pie' | 'area';
export type TimeRange = 'day' | 'week' | 'month' | 'phase' | 'all';

export interface Phase {
  id: string;
  name: string;
  description: string;
  duration: number; // 週数
  order: number;
  prerequisites: string[]; // 前提フェーズID
  learningObjectives: string[];
  tasks: Task[];
  resources: Resource[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Task {
  id: string;
  phaseId: string;
  title: string;
  description: string;
  type: TaskType;
  status: TaskStatus;
  priority: Priority;
  estimatedHours: number;
  actualHours?: number;
  dueDate?: Date;
  dependencies: string[]; // 依存タスクID
  requirements: string[];
  artifacts: string[]; // 成果物ID
  createdAt: Date;
  updatedAt: Date;
}

export interface StudySession {
  id: string;
  userId: string;
  taskId?: string;
  phaseId: string;
  startTime: Date;
  endTime?: Date;
  duration: number; // 分
  notes?: string;
  productivity: ProductivityRating; // 集中度評価
  createdAt: Date;
}

export interface Artifact {
  id: string;
  userId: string;
  taskId: string;
  phaseId: string;
  title: string;
  description?: string;
  type: ArtifactType;
  fileUrl?: string;
  externalUrl?: string;
  tags: string[];
  isPublic: boolean;
  metadata: ArtifactMetadata;
  createdAt: Date;
  updatedAt: Date;
}

export interface ArtifactMetadata {
  fileSize?: number;
  mimeType?: string;
  language?: string; // プログラミング言語
  framework?: string;
  difficulty: DifficultyLevel;
}

export interface Progress {
  id: string;
  userId: string;
  phaseId: string;
  taskId?: string;
  completedTasks: number;
  totalTasks: number;
  completionRate: number;
  totalStudyTime: number; // 分
  lastActivityAt: Date;
  streak: number; // 連続学習日数
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Resource {
  id: string;
  title: string;
  description?: string;
  url: string;
  type: ResourceType;
  tags: string[];
  difficulty: DifficultyLevel;
  estimatedTime?: number; // 分
  createdAt: Date;
}

export interface Activity {
  id: string;
  userId: string;
  type: ActivityType;
  description: string;
  metadata?: Record<string, any>;
  createdAt: Date;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  createdAt: Date;
}

// 追加のUI関連型定義
export interface TimerState {
  isRunning: boolean;
  startTime: Date | null;
  elapsedTime: number;
  currentTaskId: string | null;
}

export interface FilterOptions {
  status?: TaskStatus[];
  type?: TaskType[];
  priority?: Priority[];
  phaseId?: string;
  search?: string;
}

export interface SortOptions {
  field: 'title' | 'dueDate' | 'priority' | 'createdAt' | 'updatedAt';
  direction: 'asc' | 'desc';
}

// Chart and visualization types
export interface ChartData {
  date: string;
  value: number;
  label?: string;
}

export interface ProgressData {
  phases: Phase[];
  currentPhase: Phase | null;
  overallProgress: number;
  totalStudyTime: number;
  streak: number;
  recentActivities: Activity[];
}

export interface ProgressVisualizationData {
  data: ChartData[];
  timeRange: TimeRange;
  chartType: ChartType;
}

export interface DashboardData {
  currentPhase: Phase;
  overallProgress: number;
  recentActivities: Activity[];
  upcomingDeadlines: Task[];
  learningStreak: number;
  todayStudyTime: number;
  weeklyGoal: number;
  completedTasksThisWeek: number;
}

// ポートフォリオ関連の型定義
export interface PortfolioData {
  artifacts: Artifact[];
  phases: Phase[];
  totalProjects: number;
  skillsAcquired: string[];
  completionRate: number;
}

export interface PortfolioSection {
  id: string;
  title: string;
  description: string;
  artifacts: Artifact[];
  phase: Phase;
}

// 学習計画調整関連の型定義
export interface ScheduleAdjustment {
  taskId: string;
  originalDueDate: Date;
  newDueDate: Date;
  reason: string;
  impact: 'low' | 'medium' | 'high';
}

export interface PlanComparison {
  planned: {
    completionRate: number;
    studyTime: number;
    tasksCompleted: number;
  };
  actual: {
    completionRate: number;
    studyTime: number;
    tasksCompleted: number;
  };
  variance: {
    completionRate: number;
    studyTime: number;
    tasksCompleted: number;
  };
}

// エラーハンドリング関連の型定義
export interface AppError {
  type: 'network' | 'validation' | 'application' | 'authentication';
  code: string;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  context?: Record<string, any>;
  timestamp: Date;
}

export interface ValidationError {
  field: string;
  value: any;
  constraint: string;
  message: string;
}

export interface FormErrors {
  [field: string]: string[];
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
  timestamp: Date;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
  timestamp: Date;
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, any>;
  };
  timestamp: Date;
}

// API Request types
export interface CreatePhaseRequest {
  name: string;
  description: string;
  duration: number;
  order: number;
  prerequisites: string[];
  learningObjectives: string[];
}

export interface UpdatePhaseRequest extends Partial<CreatePhaseRequest> {
  id: string;
}

export interface CreateTaskRequest {
  phaseId: string;
  title: string;
  description: string;
  type: TaskType;
  priority: Priority;
  estimatedHours: number;
  dueDate?: Date;
  dependencies: string[];
  requirements: string[];
}

export interface UpdateTaskRequest extends Partial<CreateTaskRequest> {
  id: string;
  status?: TaskStatus;
  actualHours?: number;
}

export interface CreateStudySessionRequest {
  userId: string;
  taskId?: string;
  phaseId: string;
  startTime: Date;
  endTime?: Date;
  duration: number;
  notes?: string;
  productivity: ProductivityRating;
}

export interface UpdateStudySessionRequest extends Partial<CreateStudySessionRequest> {
  id: string;
}

export interface CreateArtifactRequest {
  userId: string;
  taskId: string;
  phaseId: string;
  title: string;
  description?: string;
  type: ArtifactType;
  fileUrl?: string;
  externalUrl?: string;
  tags: string[];
  isPublic: boolean;
  metadata: ArtifactMetadata;
}

export interface UpdateArtifactRequest extends Partial<CreateArtifactRequest> {
  id: string;
}

export interface CreateResourceRequest {
  title: string;
  description?: string;
  url: string;
  type: ResourceType;
  tags: string[];
  difficulty: DifficultyLevel;
  estimatedTime?: number;
}

export interface UpdateResourceRequest extends Partial<CreateResourceRequest> {
  id: string;
}

// Query parameters for API endpoints
export interface GetTasksQuery {
  phaseId?: string;
  status?: TaskStatus;
  type?: TaskType;
  priority?: Priority;
  page?: number;
  limit?: number;
  sortBy?: 'title' | 'dueDate' | 'priority' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
  search?: string;
}

export interface GetStudySessionsQuery {
  userId?: string;
  taskId?: string;
  phaseId?: string;
  startDate?: Date;
  endDate?: Date;
  page?: number;
  limit?: number;
}

export interface GetArtifactsQuery {
  userId?: string;
  taskId?: string;
  phaseId?: string;
  type?: ArtifactType;
  isPublic?: boolean;
  tags?: string[];
  page?: number;
  limit?: number;
}

export interface GetProgressQuery {
  userId: string;
  phaseId?: string;
  timeRange?: TimeRange;
}

// Bulk operations
export interface BulkUpdateTasksRequest {
  taskIds: string[];
  updates: Partial<UpdateTaskRequest>;
}

export interface BulkDeleteRequest {
  ids: string[];
}

// バリデーション結果の型定義
export interface ValidationResult<T> {
  success: boolean;
  data?: T;
  errors?: string[];
}

export interface ValidationContext {
  userId?: string;
  phaseId?: string;
  taskId?: string;
}

// フォーム状態管理の型定義
export interface FormState<T> {
  data: Partial<T>;
  errors: FormErrors;
  isSubmitting: boolean;
  isDirty: boolean;
  isValid: boolean;
}

export interface FormFieldState {
  value: any;
  error?: string;
  touched: boolean;
  dirty: boolean;
}

// API エンドポイントの型定義
export interface ApiEndpoints {
  phases: {
    list: string;
    create: string;
    get: (id: string) => string;
    update: (id: string) => string;
    delete: (id: string) => string;
  };
  tasks: {
    list: string;
    create: string;
    get: (id: string) => string;
    update: (id: string) => string;
    delete: (id: string) => string;
    bulkUpdate: string;
    bulkDelete: string;
  };
  studySessions: {
    list: string;
    create: string;
    get: (id: string) => string;
    update: (id: string) => string;
    delete: (id: string) => string;
  };
  artifacts: {
    list: string;
    create: string;
    get: (id: string) => string;
    update: (id: string) => string;
    delete: (id: string) => string;
    upload: string;
  };
  progress: {
    get: string;
    update: string;
  };
  resources: {
    list: string;
    create: string;
    get: (id: string) => string;
    update: (id: string) => string;
    delete: (id: string) => string;
  };
}