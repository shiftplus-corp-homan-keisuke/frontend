/**
 * モックデータの初期化とローディング機能
 * 開発環境でのテスト用データを提供
 */

import type { 
  User, 
  Phase, 
  Task, 
  StudySession, 
  Progress, 
  Activity, 
  Artifact,
  Resource
} from '@/types';

// モックユーザーデータ
export const mockUser: User = {
  id: 'user-1',
  name: '学習者',
  email: 'learner@example.com',
  avatar: null,
  createdAt: new Date('2025-01-01T00:00:00.000Z'),
  updatedAt: new Date('2025-01-01T00:00:00.000Z'),
};

// モックフェーズデータ
export const mockPhases: Phase[] = [
  {
    id: 'phase-1',
    name: 'TypeScript完全習得',
    description: 'TypeScript基礎から上級まで包括的に学習し、型システムを完全にマスターする',
    duration: 12,
    order: 1,
    prerequisites: [],
    learningObjectives: [
      '型システムの完全理解',
      'ジェネリクスの実践的活用',
      '高度な型操作の習得',
      'Compiler APIの理解'
    ],
    tasks: [],
    resources: [],
    createdAt: new Date('2025-01-01T00:00:00.000Z'),
    updatedAt: new Date('2025-01-01T00:00:00.000Z'),
  },
  {
    id: 'phase-2',
    name: 'TypeScript×React完全習得',
    description: 'ReactとTypeScriptの統合開発をマスターし、実践的なアプリケーション開発を学習',
    duration: 10,
    order: 2,
    prerequisites: ['phase-1'],
    learningObjectives: [
      'React + TypeScriptの型安全な開発',
      '状態管理の最適化',
      'パフォーマンス最適化',
      'テスト駆動開発'
    ],
    tasks: [],
    resources: [],
    createdAt: new Date('2025-01-01T00:00:00.000Z'),
    updatedAt: new Date('2025-01-01T00:00:00.000Z'),
  },
  {
    id: 'phase-3',
    name: 'TypeScript×Next.js完全習得',
    description: 'Next.jsとTypeScriptを使用したフルスタック開発の習得',
    duration: 8,
    order: 3,
    prerequisites: ['phase-2'],
    learningObjectives: [
      'Next.js App Routerの活用',
      'SSR/SSGの実装',
      'API開発とデータベース連携',
      'デプロイメントとパフォーマンス最適化'
    ],
    tasks: [],
    resources: [],
    createdAt: new Date('2025-01-01T00:00:00.000Z'),
    updatedAt: new Date('2025-01-01T00:00:00.000Z'),
  },
];

// モックタスクデータ
export const mockTasks: Task[] = [
  {
    id: 'task-1-1',
    phaseId: 'phase-1',
    title: '型エラーの理解と解決',
    description: 'TypeScriptの型エラーを理解し、適切に解決する方法を学習',
    type: 'theory',
    status: 'completed',
    priority: 'high',
    estimatedHours: 4,
    actualHours: 3.5,
    dueDate: new Date('2025-01-07T00:00:00.000Z'),
    dependencies: [],
    requirements: ['TypeScript基礎知識'],
    artifacts: ['artifact-1'],
    createdAt: new Date('2025-01-01T00:00:00.000Z'),
    updatedAt: new Date('2025-01-03T16:00:00.000Z'),
  },
  {
    id: 'task-1-2',
    phaseId: 'phase-1',
    title: '基本型とユニオン型の実践',
    description: 'プリミティブ型、オブジェクト型、ユニオン型を使った実践的なコーディング',
    type: 'practice',
    status: 'in_progress',
    priority: 'high',
    estimatedHours: 6,
    actualHours: 2,
    dueDate: new Date('2025-01-10T00:00:00.000Z'),
    dependencies: ['task-1-1'],
    requirements: ['型エラーの理解'],
    artifacts: [],
    createdAt: new Date('2025-01-01T00:00:00.000Z'),
    updatedAt: new Date('2025-01-04T10:00:00.000Z'),
  },
  {
    id: 'task-1-3',
    phaseId: 'phase-1',
    title: 'ジェネリクスの基礎と応用',
    description: 'ジェネリクスを使った再利用可能な型定義の作成',
    type: 'theory',
    status: 'not_started',
    priority: 'medium',
    estimatedHours: 8,
    actualHours: null,
    dueDate: new Date('2025-01-15T00:00:00.000Z'),
    dependencies: ['task-1-2'],
    requirements: ['基本型の理解'],
    artifacts: [],
    createdAt: new Date('2025-01-01T00:00:00.000Z'),
    updatedAt: new Date('2025-01-01T00:00:00.000Z'),
  },
  {
    id: 'task-1-4',
    phaseId: 'phase-1',
    title: '型ガードとアサーション',
    description: '型の絞り込みと型アサーションの適切な使用方法',
    type: 'practice',
    status: 'not_started',
    priority: 'medium',
    estimatedHours: 5,
    actualHours: null,
    dueDate: new Date('2025-01-20T00:00:00.000Z'),
    dependencies: ['task-1-3'],
    requirements: ['ジェネリクスの理解'],
    artifacts: [],
    createdAt: new Date('2025-01-01T00:00:00.000Z'),
    updatedAt: new Date('2025-01-01T00:00:00.000Z'),
  },
  {
    id: 'task-1-5',
    phaseId: 'phase-1',
    title: 'TypeScript実践プロジェクト',
    description: '学習した内容を統合したミニプロジェクトの作成',
    type: 'project',
    status: 'not_started',
    priority: 'high',
    estimatedHours: 12,
    actualHours: null,
    dueDate: new Date('2025-01-30T00:00:00.000Z'),
    dependencies: ['task-1-4'],
    requirements: ['TypeScript基礎の完全理解'],
    artifacts: [],
    createdAt: new Date('2025-01-01T00:00:00.000Z'),
    updatedAt: new Date('2025-01-01T00:00:00.000Z'),
  },
  {
    id: 'task-2-1',
    phaseId: 'phase-2',
    title: 'React + TypeScript環境構築',
    description: 'TypeScriptを使用したReactプロジェクトのセットアップ',
    type: 'practice',
    status: 'not_started',
    priority: 'high',
    estimatedHours: 3,
    actualHours: null,
    dueDate: new Date('2025-02-03T00:00:00.000Z'),
    dependencies: [],
    requirements: ['TypeScript完全習得'],
    artifacts: [],
    createdAt: new Date('2025-01-01T00:00:00.000Z'),
    updatedAt: new Date('2025-01-01T00:00:00.000Z'),
  },
];

// モック学習セッションデータ
export const mockStudySessions: StudySession[] = [
  {
    id: 'session-1',
    userId: 'user-1',
    taskId: 'task-1-1',
    phaseId: 'phase-1',
    startTime: new Date('2025-01-02T09:00:00.000Z'),
    endTime: new Date('2025-01-02T10:30:00.000Z'),
    duration: 90,
    notes: '型エラーの基本概念を学習。まだ理解が浅い部分があるので復習が必要。',
    productivity: 4,
    createdAt: new Date('2025-01-02T10:30:00.000Z'),
  },
  {
    id: 'session-2',
    userId: 'user-1',
    taskId: 'task-1-1',
    phaseId: 'phase-1',
    startTime: new Date('2025-01-03T14:00:00.000Z'),
    endTime: new Date('2025-01-03T16:00:00.000Z'),
    duration: 120,
    notes: '実際のコードで型エラーを修正する練習。理解が深まった。',
    productivity: 5,
    createdAt: new Date('2025-01-03T16:00:00.000Z'),
  },
  {
    id: 'session-3',
    userId: 'user-1',
    taskId: 'task-1-2',
    phaseId: 'phase-1',
    startTime: new Date('2025-01-04T10:00:00.000Z'),
    endTime: new Date('2025-01-04T12:00:00.000Z'),
    duration: 120,
    notes: 'ユニオン型の実践的な使用方法を学習。',
    productivity: 4,
    createdAt: new Date('2025-01-04T12:00:00.000Z'),
  },
];

// モック進捗データ
export const mockProgress: Progress[] = [
  {
    id: 'progress-1',
    userId: 'user-1',
    phaseId: 'phase-1',
    taskId: null,
    completedTasks: 1,
    totalTasks: 5,
    completionRate: 20,
    totalStudyTime: 330, // 5.5時間
    lastActivityAt: new Date('2025-01-04T12:00:00.000Z'),
    streak: 3,
    createdAt: new Date('2025-01-01T00:00:00.000Z'),
    updatedAt: new Date('2025-01-04T12:00:00.000Z'),
  },
  {
    id: 'progress-2',
    userId: 'user-1',
    phaseId: 'phase-2',
    taskId: null,
    completedTasks: 0,
    totalTasks: 1,
    completionRate: 0,
    totalStudyTime: 0,
    lastActivityAt: new Date('2025-01-01T00:00:00.000Z'),
    streak: 0,
    createdAt: new Date('2025-01-01T00:00:00.000Z'),
    updatedAt: new Date('2025-01-01T00:00:00.000Z'),
  },
  {
    id: 'progress-3',
    userId: 'user-1',
    phaseId: 'phase-3',
    taskId: null,
    completedTasks: 0,
    totalTasks: 0,
    completionRate: 0,
    totalStudyTime: 0,
    lastActivityAt: new Date('2025-01-01T00:00:00.000Z'),
    streak: 0,
    createdAt: new Date('2025-01-01T00:00:00.000Z'),
    updatedAt: new Date('2025-01-01T00:00:00.000Z'),
  },
];

// モック活動データ
export const mockActivities: Activity[] = [
  {
    id: 'activity-1',
    userId: 'user-1',
    type: 'task_completed',
    description: 'タスク「型エラーの理解と解決」を完了しました',
    metadata: {
      taskId: 'task-1-1',
      taskTitle: '型エラーの理解と解決',
      phaseId: 'phase-1',
    },
    createdAt: new Date('2025-01-03T16:00:00.000Z'),
  },
  {
    id: 'activity-2',
    userId: 'user-1',
    type: 'session_ended',
    description: '学習セッションを完了しました（120分）',
    metadata: {
      sessionId: 'session-2',
      duration: 120,
      productivity: 5,
      taskId: 'task-1-1',
    },
    createdAt: new Date('2025-01-03T16:00:00.000Z'),
  },
  {
    id: 'activity-3',
    userId: 'user-1',
    type: 'artifact_uploaded',
    description: '成果物「型エラー解決サンプルコード」を作成しました',
    metadata: {
      artifactId: 'artifact-1',
      artifactTitle: '型エラー解決サンプルコード',
      taskId: 'task-1-1',
    },
    createdAt: new Date('2025-01-03T16:30:00.000Z'),
  },
  {
    id: 'activity-4',
    userId: 'user-1',
    type: 'session_started',
    description: 'タスク「基本型とユニオン型の実践」の学習を開始しました',
    metadata: {
      sessionId: 'session-3',
      taskId: 'task-1-2',
      taskTitle: '基本型とユニオン型の実践',
    },
    createdAt: new Date('2025-01-04T10:00:00.000Z'),
  },
  {
    id: 'activity-5',
    userId: 'user-1',
    type: 'session_ended',
    description: '学習セッションを完了しました（120分）',
    metadata: {
      sessionId: 'session-3',
      duration: 120,
      productivity: 4,
      taskId: 'task-1-2',
    },
    createdAt: new Date('2025-01-04T12:00:00.000Z'),
  },
  {
    id: 'activity-6',
    userId: 'user-1',
    type: 'milestone_reached',
    description: '学習継続3日を達成しました！',
    metadata: {
      streak: 3,
      milestone: 'streak_3_days',
    },
    createdAt: new Date('2025-01-04T12:00:00.000Z'),
  },
];

// モック成果物データ
export const mockArtifacts: Artifact[] = [
  {
    id: 'artifact-1',
    userId: 'user-1',
    taskId: 'task-1-1',
    phaseId: 'phase-1',
    title: '型エラー解決サンプルコード',
    description: 'よくある型エラーとその解決方法をまとめたサンプルコード集',
    type: 'code',
    fileUrl: null,
    externalUrl: 'https://github.com/example/typescript-error-samples',
    tags: ['typescript', 'error-handling', 'beginner'],
    isPublic: true,
    metadata: {
      language: 'typescript',
      framework: null,
      difficulty: 'beginner',
    },
    createdAt: new Date('2025-01-03T16:30:00.000Z'),
    updatedAt: new Date('2025-01-03T16:30:00.000Z'),
  },
];

// モックリソースデータ
export const mockResources: Resource[] = [
  {
    id: 'resource-1',
    title: 'TypeScript公式ドキュメント',
    description: 'TypeScriptの公式ドキュメント。基礎から上級まで網羅的に学習できる',
    url: 'https://www.typescriptlang.org/docs/',
    type: 'documentation',
    tags: ['official', 'comprehensive', 'reference'],
    difficulty: 'beginner',
    estimatedTime: 0,
    createdAt: new Date('2025-01-01T00:00:00.000Z'),
  },
  {
    id: 'resource-2',
    title: 'TypeScript Deep Dive',
    description: 'TypeScriptの詳細な解説書。実践的な内容が豊富',
    url: 'https://basarat.gitbook.io/typescript/',
    type: 'book',
    tags: ['deep-dive', 'practical', 'advanced'],
    difficulty: 'intermediate',
    estimatedTime: 480,
    createdAt: new Date('2025-01-01T00:00:00.000Z'),
  },
];

/**
 * モックデータを統合したオブジェクト
 */
export const mockData = {
  user: mockUser,
  phases: mockPhases,
  tasks: mockTasks,
  studySessions: mockStudySessions,
  progress: mockProgress,
  activities: mockActivities,
  artifacts: mockArtifacts,
  resources: mockResources,
};

/**
 * モックデータを初期化する関数
 * ストアにモックデータを設定する
 */
export const initializeMockData = () => {
  return mockData;
};

/**
 * フェーズにタスクを関連付ける
 */
export const getPhaseWithTasks = (phaseId: string): Phase | null => {
  const phase = mockPhases.find(p => p.id === phaseId);
  if (!phase) return null;

  const phaseTasks = mockTasks.filter(task => task.phaseId === phaseId);
  return {
    ...phase,
    tasks: phaseTasks,
  };
};

/**
 * すべてのフェーズにタスクを関連付けて返す
 */
export const getAllPhasesWithTasks = (): Phase[] => {
  return mockPhases.map(phase => ({
    ...phase,
    tasks: mockTasks.filter(task => task.phaseId === phase.id),
  }));
};