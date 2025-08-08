import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { storageManager, networkStatusManager } from '@/lib/storage';
import { TimerBackgroundManager } from '@/lib/timer-background';
import type { StudySession, ProductivityRating } from '@/types';

interface TimerStore {
  // State
  isRunning: boolean;
  isPaused: boolean;
  startTime: Date | null;
  pausedTime: number; // 一時停止された累積時間（秒）
  elapsedTime: number; // 現在のセッションの経過時間（秒）
  currentTaskId: string | null;
  currentPhaseId: string | null;
  sessions: StudySession[];
  intervalId: NodeJS.Timeout | null;
  backgroundManager: TimerBackgroundManager | null;
  
  // Actions
  startTimer: (taskId?: string, phaseId?: string) => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  stopTimer: (notes?: string, productivity?: ProductivityRating) => StudySession | null;
  resetTimer: () => void;
  updateElapsedTime: () => void;
  addSession: (session: StudySession) => void;
  removeSession: (sessionId: string) => void;
  updateSession: (sessionId: string, updates: Partial<StudySession>) => void;
  initializeBackgroundManager: () => void;
  handleBackgroundTimeUpdate: (backgroundSeconds: number) => void;
  saveTimerState: () => void;
  restoreTimerState: () => void;
  
  // Computed
  getFormattedTime: () => string;
  getFormattedElapsedTime: () => string;
  getTodaysTotalTime: () => number;
  getWeeklyTotalTime: () => number;
  getSessionsByDate: (date: Date) => StudySession[];
  getSessionsByTask: (taskId: string) => StudySession[];
  getSessionsByPhase: (phaseId: string) => StudySession[];
  getAverageSessionDuration: () => number;
  getTotalSessionsCount: () => number;
  getProductivityStats: () => { average: number; distribution: Record<ProductivityRating, number> };
}

export const useTimerStore = create<TimerStore>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        isRunning: false,
        isPaused: false,
        startTime: null,
        pausedTime: 0,
        elapsedTime: 0,
        currentTaskId: null,
        currentPhaseId: null,
        sessions: [],
        intervalId: null,
        backgroundManager: null,
        
        // Actions
        startTimer: (taskId, phaseId) => {
          const state = get();
          
          // 既に実行中の場合は何もしない
          if (state.isRunning && !state.isPaused) return;
          
          const now = new Date();
          
          // 新しいセッションを開始
          if (!state.isPaused) {
            set({
              isRunning: true,
              isPaused: false,
              startTime: now,
              elapsedTime: 0,
              pausedTime: 0,
              currentTaskId: taskId || null,
              currentPhaseId: phaseId || null,
            }, false, 'startTimer');
          } else {
            // 一時停止から再開
            get().resumeTimer();
            return;
          }
          
          // 1秒ごとに経過時間を更新
          const intervalId = setInterval(() => {
            get().updateElapsedTime();
          }, 1000);
          
          set({ intervalId }, false, 'setTimerInterval');
        },
        
        pauseTimer: () => {
          const state = get();
          if (!state.isRunning || state.isPaused) return;
          
          if (state.intervalId) {
            clearInterval(state.intervalId);
          }
          
          set({
            isPaused: true,
            pausedTime: state.elapsedTime,
            intervalId: null,
          }, false, 'pauseTimer');
        },
        
        resumeTimer: () => {
          const state = get();
          if (!state.isRunning || !state.isPaused) return;
          
          set({
            isPaused: false,
            startTime: new Date(),
          }, false, 'resumeTimer');
          
          // タイマーを再開
          const intervalId = setInterval(() => {
            get().updateElapsedTime();
          }, 1000);
          
          set({ intervalId }, false, 'setTimerInterval');
        },
        
        stopTimer: (notes, productivity = 3) => {
          const state = get();
          if (!state.isRunning) return null;
          
          if (state.intervalId) {
            clearInterval(state.intervalId);
          }
          
          const endTime = new Date();
          const totalDuration = Math.floor(state.elapsedTime / 60); // 分に変換
          
          // セッションが1分未満の場合は記録しない
          if (totalDuration < 1) {
            get().resetTimer();
            return null;
          }
          
          const session: StudySession = {
            id: `session_${Date.now()}_${Math.random().toString(36).substring(2)}`,
            userId: 'default', // 実際のユーザーIDに置き換える必要がある
            ...(state.currentTaskId && { taskId: state.currentTaskId }),
            phaseId: state.currentPhaseId || 'unknown',
            startTime: new Date(endTime.getTime() - (state.elapsedTime * 1000)),
            endTime,
            duration: totalDuration,
            ...(notes && { notes }),
            productivity,
            createdAt: new Date(),
          };
          
          // セッションを追加
          get().addSession(session);
          
          // タイマーをリセット
          set({
            isRunning: false,
            isPaused: false,
            startTime: null,
            elapsedTime: 0,
            pausedTime: 0,
            currentTaskId: null,
            currentPhaseId: null,
            intervalId: null,
          }, false, 'stopTimer');
          
          return session;
        },
        
        resetTimer: () => {
          const state = get();
          
          if (state.intervalId) {
            clearInterval(state.intervalId);
          }
          
          set({
            isRunning: false,
            isPaused: false,
            startTime: null,
            elapsedTime: 0,
            pausedTime: 0,
            currentTaskId: null,
            currentPhaseId: null,
            intervalId: null,
          }, false, 'resetTimer');
        },
        
        updateElapsedTime: () => {
          const state = get();
          if (!state.isRunning || state.isPaused || !state.startTime) return;
          
          const now = new Date();
          const currentElapsed = Math.floor((now.getTime() - state.startTime.getTime()) / 1000);
          const totalElapsed = state.pausedTime + currentElapsed;
          
          set({ elapsedTime: totalElapsed }, false, 'updateElapsedTime');
        },
        
        addSession: (session) => {
          set((state) => ({
            sessions: [session, ...state.sessions]
          }), false, 'addSession');
        },
        
        removeSession: (sessionId) => {
          set((state) => ({
            sessions: state.sessions.filter(s => s.id !== sessionId)
          }), false, 'removeSession');
        },
        
        updateSession: (sessionId, updates) => {
          set((state) => ({
            sessions: state.sessions.map(session =>
              session.id === sessionId 
                ? { ...session, ...updates }
                : session
            )
          }), false, 'updateSession');
        },

        // バックグラウンド処理関連
        initializeBackgroundManager: () => {
          const state = get();
          if (state.backgroundManager) return;

          const manager = TimerBackgroundManager.getInstance();
          
          // バックグラウンド時間更新のイベントリスナーを設定
          const handleBackgroundUpdate = (event: CustomEvent) => {
            get().handleBackgroundTimeUpdate(event.detail.backgroundSeconds);
          };

          // ページ離脱前の警告
          const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            const currentState = get();
            if (currentState.isRunning) {
              e.preventDefault();
              e.returnValue = 'タイマーが実行中です。ページを離れますか？';
              // タイマー状態を保存
              get().saveTimerState();
            }
          };

          manager.initialize(
            () => {
              // 可視性変更時の処理
              get().updateElapsedTime();
            },
            handleBeforeUnload
          );

          // カスタムイベントリスナーを追加
          window.addEventListener('timer-background-update', handleBackgroundUpdate as EventListener);

          set({ backgroundManager: manager }, false, 'initializeBackgroundManager');

          // 初期化時にタイマー状態を復元
          get().restoreTimerState();
        },

        handleBackgroundTimeUpdate: (backgroundSeconds) => {
          const state = get();
          if (!state.isRunning || state.isPaused) return;

          // バックグラウンド時間を現在の経過時間に追加
          set({
            elapsedTime: state.elapsedTime + backgroundSeconds
          }, false, 'handleBackgroundTimeUpdate');
        },

        saveTimerState: () => {
          const state = get();
          if (!state.backgroundManager) return;

          state.backgroundManager.saveTimerState({
            isRunning: state.isRunning,
            startTime: state.startTime,
            elapsedTime: state.elapsedTime,
            taskId: state.currentTaskId,
            phaseId: state.currentPhaseId
          });
        },

        restoreTimerState: () => {
          const state = get();
          if (!state.backgroundManager) return;

          const restoredState = state.backgroundManager.restoreTimerState();
          if (!restoredState || !restoredState.isRunning) return;

          // バックグラウンド時間を考慮してタイマーを復元
          const totalElapsedTime = restoredState.elapsedTime + (restoredState.backgroundDuration || 0);

          set({
            isRunning: restoredState.isRunning,
            isPaused: false,
            startTime: new Date(),
            elapsedTime: totalElapsedTime,
            pausedTime: totalElapsedTime,
            currentTaskId: restoredState.taskId,
            currentPhaseId: restoredState.phaseId
          }, false, 'restoreTimerState');

          // タイマーを再開
          const intervalId = setInterval(() => {
            get().updateElapsedTime();
          }, 1000);

          set({ intervalId }, false, 'restoreTimerInterval');

          // 復元後はバックアップをクリア
          state.backgroundManager.clearTimerState();
        },
        
        // Computed functions
        getFormattedTime: () => {
          const state = get();
          const totalSeconds = state.elapsedTime;
          const hours = Math.floor(totalSeconds / 3600);
          const minutes = Math.floor((totalSeconds % 3600) / 60);
          const seconds = totalSeconds % 60;
          
          if (hours > 0) {
            return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
          }
          return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        },
        
        getFormattedElapsedTime: () => {
          const state = get();
          const minutes = Math.floor(state.elapsedTime / 60);
          const seconds = state.elapsedTime % 60;
          return `${minutes}分${seconds}秒`;
        },
        
        getTodaysTotalTime: () => {
          const state = get();
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const tomorrow = new Date(today);
          tomorrow.setDate(tomorrow.getDate() + 1);
          
          return state.sessions
            .filter(session => {
              const sessionDate = new Date(session.createdAt);
              return sessionDate >= today && sessionDate < tomorrow;
            })
            .reduce((total, session) => total + session.duration, 0);
        },
        
        getWeeklyTotalTime: () => {
          const state = get();
          const now = new Date();
          const weekStart = new Date(now);
          weekStart.setDate(now.getDate() - now.getDay()); // 週の始まり（日曜日）
          weekStart.setHours(0, 0, 0, 0);
          
          return state.sessions
            .filter(session => {
              const sessionDate = new Date(session.createdAt);
              return sessionDate >= weekStart;
            })
            .reduce((total, session) => total + session.duration, 0);
        },
        
        getSessionsByDate: (date) => {
          const state = get();
          const targetDate = new Date(date);
          targetDate.setHours(0, 0, 0, 0);
          const nextDay = new Date(targetDate);
          nextDay.setDate(nextDay.getDate() + 1);
          
          return state.sessions.filter(session => {
            const sessionDate = new Date(session.createdAt);
            return sessionDate >= targetDate && sessionDate < nextDay;
          });
        },
        
        getSessionsByTask: (taskId) => {
          const state = get();
          return state.sessions.filter(session => session.taskId === taskId);
        },
        
        getSessionsByPhase: (phaseId) => {
          const state = get();
          return state.sessions.filter(session => session.phaseId === phaseId);
        },
        
        getAverageSessionDuration: () => {
          const state = get();
          if (state.sessions.length === 0) return 0;
          
          const totalDuration = state.sessions.reduce((sum, session) => sum + session.duration, 0);
          return Math.round(totalDuration / state.sessions.length);
        },
        
        getTotalSessionsCount: () => {
          const state = get();
          return state.sessions.length;
        },
        
        getProductivityStats: () => {
          const state = get();
          if (state.sessions.length === 0) {
            return {
              average: 0,
              distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
            };
          }
          
          const distribution: Record<ProductivityRating, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
          let totalProductivity = 0;
          
          state.sessions.forEach(session => {
            distribution[session.productivity]++;
            totalProductivity += session.productivity;
          });
          
          return {
            average: Math.round((totalProductivity / state.sessions.length) * 10) / 10,
            distribution
          };
        },
      }),
      {
        name: 'timer-store',
        // セッションデータのみを永続化（タイマー状態は永続化しない）
        partialize: (state) => ({
          sessions: state.sessions,
        }),
      }
    ),
    {
      name: 'timer-store',
    }
  )
);