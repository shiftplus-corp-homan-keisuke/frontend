/**
 * APIクライアント関数のエクスポート
 * すべてのAPI関数を一箇所からインポートできるようにする
 */

// Base client
export { apiClient } from './client';

// Phase API
export * from './phases';

// Task API
export * from './tasks';

// Study Session API
export * from './study-sessions';

// Artifact API
export * from './artifacts';

// Progress API
export * from './progress';

// Resource API
export * from './resources';

// API endpoints configuration
export const API_ENDPOINTS = {
  phases: {
    list: '/phases',
    create: '/phases',
    get: (id: string) => `/phases/${id}`,
    update: (id: string) => `/phases/${id}`,
    delete: (id: string) => `/phases/${id}`,
    reorder: '/phases/reorder',
    prerequisites: (id: string) => `/phases/${id}/prerequisites`,
  },
  tasks: {
    list: '/tasks',
    create: '/tasks',
    get: (id: string) => `/tasks/${id}`,
    update: (id: string) => `/tasks/${id}`,
    delete: (id: string) => `/tasks/${id}`,
    status: (id: string) => `/tasks/${id}/status`,
    estimate: (id: string) => `/tasks/${id}/estimate`,
    time: (id: string) => `/tasks/${id}/time`,
    dependencies: (id: string) => `/tasks/${id}/dependencies`,
    bulkUpdate: '/tasks/bulk-update',
    bulkDelete: '/tasks/bulk-delete',
    overdue: '/tasks/overdue',
    today: '/tasks/today',
    week: '/tasks/week',
  },
  studySessions: {
    list: '/studySessions',
    create: '/studySessions',
    get: (id: string) => `/studySessions/${id}`,
    update: (id: string) => `/studySessions/${id}`,
    delete: (id: string) => `/studySessions/${id}`,
    end: (id: string) => `/studySessions/${id}/end`,
    stats: (userId: string) => `/studySessions/stats/${userId}`,
    phaseStats: (phaseId: string) => `/studySessions/stats/phase/${phaseId}`,
    taskStats: (taskId: string) => `/studySessions/stats/task/${taskId}`,
    streak: (userId: string) => `/studySessions/streak/${userId}`,
  },
  artifacts: {
    list: '/artifacts',
    create: '/artifacts',
    get: (id: string) => `/artifacts/${id}`,
    update: (id: string) => `/artifacts/${id}`,
    delete: (id: string) => `/artifacts/${id}`,
    upload: '/upload',
    portfolio: (userId: string) => `/artifacts/portfolio/${userId}`,
    portfolioSections: (userId: string) => `/artifacts/portfolio/${userId}/sections`,
    visibility: (id: string) => `/artifacts/${id}/visibility`,
    tags: (id: string) => `/artifacts/${id}/tags`,
    removeTags: (id: string) => `/artifacts/${id}/tags/remove`,
    stats: (userId: string) => `/artifacts/stats/${userId}`,
    download: (id: string) => `/artifacts/${id}/download`,
    duplicate: (id: string) => `/artifacts/${id}/duplicate`,
  },
  progress: {
    list: '/progress',
    user: (userId: string) => `/progress/${userId}`,
    phase: (userId: string, phaseId: string) => `/progress/${userId}/phase/${phaseId}`,
    overall: (userId: string) => `/progress/${userId}/overall`,
    taskCompleted: (userId: string) => `/progress/${userId}/task-completed`,
    sessionCompleted: (userId: string) => `/progress/${userId}/session-completed`,
    chart: (userId: string) => `/progress/${userId}/chart`,
    studyTimeChart: (userId: string) => `/progress/${userId}/study-time-chart`,
    phaseChart: (userId: string) => `/progress/${userId}/phase-chart`,
    planComparison: (userId: string) => `/progress/${userId}/plan-comparison`,
    efficiency: (userId: string) => `/progress/${userId}/efficiency`,
    goals: (userId: string) => `/progress/${userId}/goals`,
    streak: (userId: string) => `/progress/${userId}/streak`,
    forecast: (userId: string) => `/progress/${userId}/forecast`,
    scheduleSuggestions: (userId: string) => `/progress/${userId}/schedule-suggestions`,
    applyAdjustments: (userId: string) => `/progress/${userId}/apply-adjustments`,
    report: (userId: string) => `/progress/${userId}/report`,
  },
  resources: {
    list: '/resources',
    create: '/resources',
    get: (id: string) => `/resources/${id}`,
    update: (id: string) => `/resources/${id}`,
    delete: (id: string) => `/resources/${id}`,
    recommended: (userId: string) => `/resources/recommended/${userId}`,
    popular: '/resources/popular',
    recent: '/resources/recent',
    stats: '/resources/stats',
    usage: (id: string) => `/resources/${id}/usage`,
    bookmarks: (userId: string) => `/resources/bookmarks/${userId}`,
    bookmark: (id: string) => `/resources/${id}/bookmark`,
    complete: (id: string) => `/resources/${id}/complete`,
    completed: (userId: string) => `/resources/completed/${userId}`,
    rate: (id: string) => `/resources/${id}/rate`,
    ratings: (id: string) => `/resources/${id}/ratings`,
    checkUrl: '/resources/check-url',
    bulkImport: '/resources/bulk-import',
  },
} as const;

// Common API utilities
export const buildQueryString = (params: Record<string, any>): string => {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (Array.isArray(value)) {
        value.forEach(item => searchParams.append(key, String(item)));
      } else if (value instanceof Date) {
        searchParams.append(key, value.toISOString());
      } else {
        searchParams.append(key, String(value));
      }
    }
  });

  return searchParams.toString();
};

// API response transformers
export const transformDates = <T extends Record<string, any>>(obj: T): T => {
  const transformed = { ...obj } as any;
  
  Object.keys(transformed).forEach(key => {
    const value = transformed[key];
    
    if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)) {
      transformed[key] = new Date(value);
    } else if (Array.isArray(value)) {
      transformed[key] = value.map(item => 
        typeof item === 'object' && item !== null ? transformDates(item) : item
      );
    } else if (typeof value === 'object' && value !== null) {
      transformed[key] = transformDates(value);
    }
  });
  
  return transformed;
};

// Error classes
export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export class NetworkError extends Error {
  constructor(
    message: string,
    public retryable: boolean = true
  ) {
    super(message);
    this.name = 'NetworkError';
  }
}

// Error handling utilities
export const isApiError = (error: unknown): error is ApiError => {
  return error instanceof ApiError;
};

export const isNetworkError = (error: unknown): error is NetworkError => {
  return error instanceof NetworkError;
};

export const getErrorMessage = (error: unknown): string => {
  if (isApiError(error)) {
    return error.message;
  }
  
  if (isNetworkError(error)) {
    return error.message;
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return 'An unknown error occurred';
};

// Retry utilities
export const createRetryConfig = (maxRetries: number = 3, baseDelay: number = 1000) => ({
  retry: (failureCount: number, error: unknown) => {
    if (isNetworkError(error) && error.retryable) {
      return failureCount < maxRetries;
    }
    return false;
  },
  retryDelay: (attemptIndex: number) => Math.min(baseDelay * Math.pow(2, attemptIndex), 30000),
});

// Cache key generators for TanStack Query
export const createCacheKey = {
  phases: () => ['phases'] as const,
  phase: (id: string) => ['phases', id] as const,
  tasks: (filters?: Record<string, any>) => ['tasks', filters] as const,
  task: (id: string) => ['tasks', id] as const,
  studySessions: (filters?: Record<string, any>) => ['studySessions', filters] as const,
  studySession: (id: string) => ['studySessions', id] as const,
  artifacts: (filters?: Record<string, any>) => ['artifacts', filters] as const,
  artifact: (id: string) => ['artifacts', id] as const,
  progress: (userId: string, filters?: Record<string, any>) => ['progress', userId, filters] as const,
  resources: (filters?: Record<string, any>) => ['resources', filters] as const,
  resource: (id: string) => ['resources', id] as const,
  userStats: (userId: string, type: string) => ['stats', userId, type] as const,
};