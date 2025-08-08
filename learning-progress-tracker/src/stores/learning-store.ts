import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { storageManager, dataSyncManager } from '@/lib/storage';
import type { 
  Phase, 
  Task, 
  Progress, 
  StudySession, 
  User, 
  TaskStatus,
  Activity,
  ActivityType 
} from '@/types';

interface LearningStore {
  // State
  currentUser: User | null;
  phases: Phase[];
  currentPhase: Phase | null;
  tasks: Task[];
  progress: Progress[];
  studySessions: StudySession[];
  activities: Activity[];
  loading: boolean;
  error: string | null;
  isOnline: boolean;
  lastSyncTime: Date | null;
  
  // Actions
  setCurrentUser: (user: User) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  loadPhases: (phases: Phase[]) => void;
  setCurrentPhase: (phaseId: string) => void;
  updateTaskStatus: (taskId: string, status: TaskStatus) => void;
  canUpdateTaskStatus: (taskId: string, newStatus: TaskStatus) => { canUpdate: boolean; reason?: string };
  getDependentTasks: (taskId: string) => Task[];
  addStudySession: (session: Omit<StudySession, 'id' | 'createdAt'>) => void;
  updateStudySession: (sessionId: string, updates: Partial<StudySession>) => void;
  addActivity: (type: ActivityType, description: string, metadata?: Record<string, any>) => void;
  updateProgress: (phaseId: string) => void;
  
  // Sync actions
  syncToStorage: () => void;
  loadFromStorage: () => void;
  initializeWithMockData: () => void;
  setOnlineStatus: (isOnline: boolean) => void;
  manualSync: () => Promise<boolean>;
  exportData: () => string;
  importData: (data: string) => boolean;
  
  // Computed
  getCurrentPhaseProgress: () => number;
  getOverallProgress: () => number;
  getTotalStudyTime: () => number;
  getStreak: () => number;
  getTasksByPhase: (phaseId: string) => Task[];
  getCompletedTasksCount: (phaseId?: string) => number;
  getTotalTasksCount: (phaseId?: string) => number;
  getRecentActivities: (limit?: number) => Activity[];
  getUpcomingDeadlines: (limit?: number) => Task[];
  getSyncStatus: () => { isOnline: boolean; lastSync: Date | null; hasOfflineChanges: boolean };
}

export const useLearningStore = create<LearningStore>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        currentUser: null,
        phases: [],
        currentPhase: null,
        tasks: [],
        progress: [],
        studySessions: [],
        activities: [],
        loading: false,
        error: null,
        isOnline: navigator.onLine,
        lastSyncTime: null,
      
        // Actions
        setCurrentUser: (user) => {
          set({ currentUser: user }, false, 'setCurrentUser');
        },
        
        setLoading: (loading) => {
          set({ loading }, false, 'setLoading');
        },
        
        setError: (error) => {
          set({ error }, false, 'setError');
        },
        
        loadPhases: (phases) => {
          // フェーズをロードし、関連するタスクも設定
          const allTasks = phases.flatMap(phase => phase.tasks);
          set({ 
            phases, 
            tasks: allTasks,
            loading: false,
            error: null 
          }, false, 'loadPhases');
        },
        
        setCurrentPhase: (phaseId) => {
          const phase = get().phases.find(p => p.id === phaseId);
          if (phase) {
            set({ currentPhase: phase }, false, 'setCurrentPhase');
            get().addActivity('phase_completed', `フェーズ「${phase.name}」を開始しました`);
          }
        },
        
        updateTaskStatus: (taskId, status) => {
          const state = get();
          
          // ステータス更新が可能かチェック
          const canUpdate = get().canUpdateTaskStatus(taskId, status);
          if (!canUpdate.canUpdate) {
            get().setError(canUpdate.reason || 'タスクのステータスを更新できません');
            return;
          }
          
          const updatedTasks = state.tasks.map(task => {
            if (task.id === taskId) {
              const updatedTask = { ...task, status, updatedAt: new Date() };
              
              // アクティビティを追加
              if (status === 'completed') {
                get().addActivity('task_completed', `タスク「${task.title}」を完了しました`, {
                  taskId,
                  phaseId: task.phaseId
                });
              } else if (status === 'in_progress') {
                get().addActivity('session_started', `タスク「${task.title}」を開始しました`, {
                  taskId,
                  phaseId: task.phaseId
                });
              }
              
              return updatedTask;
            }
            return task;
          });
          
          // フェーズの進捗を更新
          const task = state.tasks.find(t => t.id === taskId);
          if (task) {
            set({ tasks: updatedTasks }, false, 'updateTaskStatus');
            get().updateProgress(task.phaseId);
            get().syncToStorage(); // 変更をストレージに同期
          }
        },

        canUpdateTaskStatus: (taskId, newStatus) => {
          const state = get();
          const task = state.tasks.find(t => t.id === taskId);
          
          if (!task) {
            return { canUpdate: false, reason: 'タスクが見つかりません' };
          }

          // 現在のステータスと同じ場合は更新不要
          if (task.status === newStatus) {
            return { canUpdate: false, reason: 'ステータスは既に同じ値です' };
          }

          // 完了済みタスクを未完了に戻すことはできない（特別な権限が必要）
          if (task.status === 'completed' && newStatus !== 'completed') {
            return { canUpdate: false, reason: '完了済みタスクのステータスを変更することはできません' };
          }

          // 依存関係のチェック
          if (newStatus === 'in_progress' || newStatus === 'completed') {
            const incompleteDependencies = task.dependencies.filter(depId => {
              const depTask = state.tasks.find(t => t.id === depId);
              return depTask && depTask.status !== 'completed';
            });

            if (incompleteDependencies.length > 0) {
              const depTaskNames = incompleteDependencies
                .map(depId => {
                  const depTask = state.tasks.find(t => t.id === depId);
                  return depTask?.title || depId;
                })
                .join(', ');
              
              return { 
                canUpdate: false, 
                reason: `依存タスクが未完了です: ${depTaskNames}` 
              };
            }
          }

          return { canUpdate: true };
        },

        getDependentTasks: (taskId) => {
          const state = get();
          return state.tasks.filter(task => task.dependencies.includes(taskId));
        },
        
        addStudySession: (sessionData) => {
          const newSession: StudySession = {
            ...sessionData,
            id: `session_${Date.now()}_${Math.random().toString(36).substring(2)}`,
            createdAt: new Date(),
          };
          
          set((state) => ({
            studySessions: [...state.studySessions, newSession]
          }), false, 'addStudySession');
          
          get().addActivity('session_started', `学習セッションを開始しました`, {
            sessionId: newSession.id,
            duration: newSession.duration,
            taskId: newSession.taskId
          });
        },
        
        updateStudySession: (sessionId, updates) => {
          set((state) => ({
            studySessions: state.studySessions.map(session =>
              session.id === sessionId 
                ? { ...session, ...updates }
                : session
            )
          }), false, 'updateStudySession');
        },
        
        addActivity: (type, description, metadata) => {
          const state = get();
          if (!state.currentUser) return;
          
          const newActivity: Activity = {
            id: `activity_${Date.now()}_${Math.random().toString(36).substring(2)}`,
            userId: state.currentUser.id,
            type,
            description,
            metadata: metadata || {},
            createdAt: new Date(),
          };
          
          set((state) => ({
            activities: [newActivity, ...state.activities].slice(0, 100) // 最新100件を保持
          }), false, 'addActivity');
        },
        
        updateProgress: (phaseId) => {
          const state = get();
          const phaseTasks = state.tasks.filter(task => task.phaseId === phaseId);
          const completedTasks = phaseTasks.filter(task => task.status === 'completed');
          const totalTasks = phaseTasks.length;
          const completionRate = totalTasks > 0 ? (completedTasks.length / totalTasks) * 100 : 0;
          
          // 該当フェーズの学習時間を計算
          const phaseStudyTime = state.studySessions
            .filter(session => session.phaseId === phaseId)
            .reduce((total, session) => total + session.duration, 0);
          
          const existingProgressIndex = state.progress.findIndex(p => p.phaseId === phaseId);
          const existingProgress = existingProgressIndex >= 0 ? state.progress[existingProgressIndex] : null;
          const progressData: Progress = {
            id: existingProgress?.id || `progress_${phaseId}_${Date.now()}`,
            userId: state.currentUser?.id || 'default',
            phaseId,
            completedTasks: completedTasks.length,
            totalTasks,
            completionRate,
            totalStudyTime: phaseStudyTime,
            lastActivityAt: new Date(),
            streak: get().getStreak(),
            createdAt: existingProgress?.createdAt || new Date(),
            updatedAt: new Date(),
          };
          
          const updatedProgress = existingProgressIndex >= 0
            ? state.progress.map((p, index) => index === existingProgressIndex ? progressData : p)
            : [...state.progress, progressData];
          
          set({ progress: updatedProgress }, false, 'updateProgress');
        },
        
        // Computed functions
        getCurrentPhaseProgress: () => {
          const state = get();
          if (!state.currentPhase) return 0;
          
          const phaseProgress = state.progress.find(p => p.phaseId === state.currentPhase!.id);
          return phaseProgress?.completionRate || 0;
        },
        
        getOverallProgress: () => {
          const state = get();
          if (state.phases.length === 0) return 0;
          
          const totalProgress = state.progress.reduce((sum, progress) => sum + progress.completionRate, 0);
          return totalProgress / state.phases.length;
        },
        
        getTotalStudyTime: () => {
          const state = get();
          return state.studySessions.reduce((total, session) => total + session.duration, 0);
        },
        
        getStreak: () => {
          const state = get();
          if (state.studySessions.length === 0) return 0;
          
          // 連続学習日数を計算（簡易実装）
          const today = new Date();
          const yesterday = new Date(today);
          yesterday.setDate(yesterday.getDate() - 1);
          
          const hasStudiedToday = state.studySessions.some(session => {
            const sessionDate = new Date(session.createdAt);
            return sessionDate.toDateString() === today.toDateString();
          });
          
          const hasStudiedYesterday = state.studySessions.some(session => {
            const sessionDate = new Date(session.createdAt);
            return sessionDate.toDateString() === yesterday.toDateString();
          });
          
          if (hasStudiedToday && hasStudiedYesterday) {
            // より詳細な連続日数計算が必要な場合はここで実装
            return 2; // 簡易実装
          } else if (hasStudiedToday) {
            return 1;
          }
          
          return 0;
        },
        
        getTasksByPhase: (phaseId) => {
          const state = get();
          return state.tasks.filter(task => task.phaseId === phaseId);
        },
        
        getCompletedTasksCount: (phaseId) => {
          const state = get();
          const tasks = phaseId 
            ? state.tasks.filter(task => task.phaseId === phaseId)
            : state.tasks;
          return tasks.filter(task => task.status === 'completed').length;
        },
        
        getTotalTasksCount: (phaseId) => {
          const state = get();
          const tasks = phaseId 
            ? state.tasks.filter(task => task.phaseId === phaseId)
            : state.tasks;
          return tasks.length;
        },
        
        getRecentActivities: (limit = 10) => {
          const state = get();
          return state.activities.slice(0, limit);
        },
        
        getUpcomingDeadlines: (limit = 5) => {
          const state = get();
          const now = new Date();
          return state.tasks
            .filter(task => task.dueDate && new Date(task.dueDate) > now && task.status !== 'completed')
            .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime())
            .slice(0, limit);
        },

        // Sync actions
        syncToStorage: () => {
          const state = get();
          try {
            if (state.currentUser) {
              storageManager.setUser(state.currentUser);
            }
            storageManager.setPhases(state.phases);
            storageManager.setTasks(state.tasks);
            storageManager.setProgress(state.progress);
            storageManager.setSessions(state.studySessions);
            storageManager.setActivities(state.activities);
            storageManager.setLastSyncTime(new Date());
            
            set({ lastSyncTime: new Date() }, false, 'syncToStorage');
          } catch (error) {
            console.error('Failed to sync to storage', error);
            get().setError('ローカルストレージへの同期に失敗しました');
          }
        },

        loadFromStorage: () => {
          try {
            const user = storageManager.getUser();
            const phases = storageManager.getPhases();
            const tasks = storageManager.getTasks();
            const progress = storageManager.getProgress();
            const sessions = storageManager.getSessions();
            const activities = storageManager.getActivities();
            const lastSync = storageManager.getLastSyncTime();

            // データが存在しない場合はモックデータで初期化
            if (!user || phases.length === 0) {
              get().initializeWithMockData();
              return;
            }

            set({
              currentUser: user,
              phases,
              tasks,
              progress,
              studySessions: sessions,
              activities,
              lastSyncTime: lastSync,
              loading: false,
              error: null,
            }, false, 'loadFromStorage');
          } catch (error) {
            console.error('Failed to load from storage', error);
            // エラーが発生した場合もモックデータで初期化
            get().initializeWithMockData();
          }
        },

        // モックデータで初期化する関数を追加
        initializeWithMockData: () => {
          try {
            const { initializeMockData, getAllPhasesWithTasks } = require('@/lib/mock-data');
            const mockData = initializeMockData();
            const phasesWithTasks = getAllPhasesWithTasks();

            set({
              currentUser: mockData.user,
              phases: phasesWithTasks,
              tasks: mockData.tasks,
              progress: mockData.progress,
              studySessions: mockData.studySessions,
              activities: mockData.activities,
              currentPhase: phasesWithTasks[0] || null, // 最初のフェーズを現在のフェーズに設定
              loading: false,
              error: null,
            }, false, 'initializeWithMockData');

            // モックデータをストレージに保存
            get().syncToStorage();
          } catch (error) {
            console.error('Failed to initialize with mock data', error);
            get().setError('モックデータの初期化に失敗しました');
          }
        },

        setOnlineStatus: (isOnline) => {
          set({ isOnline }, false, 'setOnlineStatus');
          
          // オンラインになったときに自動同期を試行
          if (isOnline) {
            dataSyncManager.processOfflineQueue().catch(error => {
              console.error('Auto sync failed', error);
            });
          }
        },

        manualSync: async () => {
          try {
            const success = await dataSyncManager.manualSync();
            if (success) {
              set({ lastSyncTime: new Date() }, false, 'manualSync');
            }
            return success;
          } catch (error) {
            console.error('Manual sync failed', error);
            get().setError('手動同期に失敗しました');
            return false;
          }
        },

        exportData: () => {
          try {
            return storageManager.exportData();
          } catch (error) {
            console.error('Failed to export data', error);
            get().setError('データのエクスポートに失敗しました');
            return '';
          }
        },

        importData: (data) => {
          try {
            const success = storageManager.importData(data);
            if (success) {
              get().loadFromStorage();
            }
            return success;
          } catch (error) {
            console.error('Failed to import data', error);
            get().setError('データのインポートに失敗しました');
            return false;
          }
        },

        getSyncStatus: () => {
          const state = get();
          const syncStatus = dataSyncManager.getSyncStatus();
          
          return {
            isOnline: state.isOnline,
            lastSync: state.lastSyncTime,
            hasOfflineChanges: syncStatus.queueLength > 0,
          };
        },
      }),
      {
        name: 'learning-store',
        // 重要なデータのみを永続化
        partialize: (state) => ({
          currentUser: state.currentUser,
          phases: state.phases,
          tasks: state.tasks,
          progress: state.progress,
          studySessions: state.studySessions,
          activities: state.activities,
          lastSyncTime: state.lastSyncTime,
        }),
      }
    ),
    {
      name: 'learning-store',
    }
  )
);