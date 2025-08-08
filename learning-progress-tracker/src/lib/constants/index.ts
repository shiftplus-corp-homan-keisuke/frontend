// Application constants

export const APP_CONFIG = {
  name: 'Learning Progress Tracker',
  version: '1.0.0',
  description: '2025年フロントエンドエンジニア育成プラン学習管理システム',
} as const;

export const API_CONFIG = {
  baseUrl: process.env.NODE_ENV === 'production' 
    ? 'https://api.learning-tracker.com' 
    : 'http://localhost:3001',
  timeout: 10000,
} as const;

export const STORAGE_KEYS = {
  user: 'learning-tracker-user',
  progress: 'learning-tracker-progress',
  preferences: 'learning-tracker-preferences',
  timer: 'learning-tracker-timer',
} as const;

export const TASK_STATUSES = {
  NOT_STARTED: 'not_started',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
} as const;

export const TASK_TYPES = {
  THEORY: 'theory',
  PRACTICE: 'practice',
  PROJECT: 'project',
  ASSESSMENT: 'assessment',
} as const;

export const PRIORITIES = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
} as const;

export const ARTIFACT_TYPES = {
  CODE: 'code',
  DOCUMENT: 'document',
  DESIGN: 'design',
  VIDEO: 'video',
  OTHER: 'other',
} as const;

export const RESOURCE_TYPES = {
  ARTICLE: 'article',
  VIDEO: 'video',
  DOCUMENTATION: 'documentation',
  TUTORIAL: 'tutorial',
  BOOK: 'book',
} as const;

export const DIFFICULTY_LEVELS = {
  BEGINNER: 'beginner',
  INTERMEDIATE: 'intermediate',
  ADVANCED: 'advanced',
} as const;

export const NOTIFICATION_TYPES = {
  INFO: 'info',
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR: 'error',
} as const;

export const ACTIVITY_TYPES = {
  TASK_COMPLETED: 'task_completed',
  SESSION_STARTED: 'session_started',
  SESSION_ENDED: 'session_ended',
  ARTIFACT_UPLOADED: 'artifact_uploaded',
} as const;

export const VIEW_TYPES = {
  DASHBOARD: 'dashboard',
  TASKS: 'tasks',
  PROGRESS: 'progress',
  ARTIFACTS: 'artifacts',
  SETTINGS: 'settings',
} as const;

export const THEME_TYPES = {
  LIGHT: 'light',
  DARK: 'dark',
} as const;

// Chart configuration
export const CHART_COLORS = {
  primary: '#3b82f6',
  secondary: '#10b981',
  accent: '#f59e0b',
  danger: '#ef4444',
  warning: '#f59e0b',
  info: '#06b6d4',
} as const;

// Time constants
export const TIME_CONSTANTS = {
  MINUTE: 60 * 1000,
  HOUR: 60 * 60 * 1000,
  DAY: 24 * 60 * 60 * 1000,
  WEEK: 7 * 24 * 60 * 60 * 1000,
} as const;

// Validation constants
export const VALIDATION_RULES = {
  MIN_PASSWORD_LENGTH: 8,
  MAX_TASK_TITLE_LENGTH: 100,
  MAX_DESCRIPTION_LENGTH: 500,
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
} as const;

// Query keys for TanStack Query
export const QUERY_KEYS = {
  phases: ['phases'] as const,
  phase: (id: string) => ['phase', id] as const,
  tasks: (phaseId?: string) => ['tasks', phaseId] as const,
  task: (id: string) => ['task', id] as const,
  progress: (userId: string) => ['progress', userId] as const,
  artifacts: (phaseId?: string) => ['artifacts', phaseId] as const,
  sessions: (userId: string) => ['sessions', userId] as const,
  resources: (phaseId?: string) => ['resources', phaseId] as const,
} as const;