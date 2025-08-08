/**
 * バックグラウンドでのタイマー継続機能
 * ページが非表示になってもタイマーを継続し、復帰時に正確な時間を表示
 */

export class TimerBackgroundManager {
  private static instance: TimerBackgroundManager;
  private visibilityChangeHandler: (() => void) | null = null;
  private beforeUnloadHandler: ((e: BeforeUnloadEvent) => void) | null = null;
  private pageHideHandler: (() => void) | null = null;
  private pageShowHandler: (() => void) | null = null;

  private constructor() {}

  static getInstance(): TimerBackgroundManager {
    if (!TimerBackgroundManager.instance) {
      TimerBackgroundManager.instance = new TimerBackgroundManager();
    }
    return TimerBackgroundManager.instance;
  }

  /**
   * バックグラウンド処理の初期化
   */
  initialize(onVisibilityChange?: () => void, onBeforeUnload?: (e: BeforeUnloadEvent) => void) {
    this.cleanup(); // 既存のリスナーをクリーンアップ

    // ページの可視性変更を監視
    this.visibilityChangeHandler = () => {
      if (document.visibilityState === 'visible') {
        // ページが再び表示された時の処理
        this.handlePageVisible();
      } else {
        // ページが非表示になった時の処理
        this.handlePageHidden();
      }
      onVisibilityChange?.();
    };

    // ページリロード/閉じる前の警告
    this.beforeUnloadHandler = (e: BeforeUnloadEvent) => {
      onBeforeUnload?.(e);
    };

    // ページが隠れた時の処理（モバイル対応）
    this.pageHideHandler = () => {
      this.handlePageHidden();
    };

    // ページが表示された時の処理（モバイル対応）
    this.pageShowHandler = () => {
      this.handlePageVisible();
    };

    // イベントリスナーを追加
    document.addEventListener('visibilitychange', this.visibilityChangeHandler);
    window.addEventListener('beforeunload', this.beforeUnloadHandler);
    window.addEventListener('pagehide', this.pageHideHandler);
    window.addEventListener('pageshow', this.pageShowHandler);
  }

  /**
   * ページが非表示になった時の処理
   */
  private handlePageHidden() {
    const hiddenTime = Date.now();
    localStorage.setItem('timer_hidden_time', hiddenTime.toString());
    
    // デバッグログ
    console.log('Page hidden at:', new Date(hiddenTime).toISOString());
  }

  /**
   * ページが表示された時の処理
   */
  private handlePageVisible() {
    const hiddenTimeStr = localStorage.getItem('timer_hidden_time');
    if (hiddenTimeStr) {
      const hiddenTime = parseInt(hiddenTimeStr, 10);
      const visibleTime = Date.now();
      const backgroundDuration = Math.floor((visibleTime - hiddenTime) / 1000); // 秒単位

      // デバッグログ
      console.log('Page visible at:', new Date(visibleTime).toISOString());
      console.log('Background duration:', backgroundDuration, 'seconds');

      // バックグラウンド時間をタイマーストアに通知
      this.notifyBackgroundTime(backgroundDuration);

      // 保存された時間をクリア
      localStorage.removeItem('timer_hidden_time');
    }
  }

  /**
   * バックグラウンド時間をタイマーストアに通知
   */
  private notifyBackgroundTime(backgroundSeconds: number) {
    // カスタムイベントを発火してタイマーストアに通知
    const event = new CustomEvent('timer-background-update', {
      detail: { backgroundSeconds }
    });
    window.dispatchEvent(event);
  }

  /**
   * Web Workers を使用したバックグラウンドタイマー（オプション）
   */
  createBackgroundWorker(): Worker | null {
    if (typeof Worker === 'undefined') {
      console.warn('Web Workers are not supported in this environment');
      return null;
    }

    try {
      // インラインワーカーを作成
      const workerScript = `
        let timerId = null;
        let startTime = null;
        let elapsedTime = 0;

        self.onmessage = function(e) {
          const { type, data } = e.data;
          
          switch (type) {
            case 'start':
              if (timerId) clearInterval(timerId);
              startTime = Date.now();
              elapsedTime = data.elapsedTime || 0;
              
              timerId = setInterval(() => {
                const currentElapsed = elapsedTime + Math.floor((Date.now() - startTime) / 1000);
                self.postMessage({
                  type: 'tick',
                  elapsedTime: currentElapsed
                });
              }, 1000);
              break;
              
            case 'pause':
              if (timerId) {
                clearInterval(timerId);
                timerId = null;
              }
              elapsedTime = data.elapsedTime || 0;
              break;
              
            case 'stop':
              if (timerId) {
                clearInterval(timerId);
                timerId = null;
              }
              startTime = null;
              elapsedTime = 0;
              break;
              
            case 'sync':
              // 現在の経過時間を同期
              if (startTime && timerId) {
                const currentElapsed = elapsedTime + Math.floor((Date.now() - startTime) / 1000);
                self.postMessage({
                  type: 'sync',
                  elapsedTime: currentElapsed
                });
              }
              break;
          }
        };
      `;

      const blob = new Blob([workerScript], { type: 'application/javascript' });
      const worker = new Worker(URL.createObjectURL(blob));

      return worker;
    } catch (error) {
      console.error('Failed to create background worker:', error);
      return null;
    }
  }

  /**
   * ローカルストレージを使用したタイマー状態の永続化
   */
  saveTimerState(state: {
    isRunning: boolean;
    startTime: Date | null;
    elapsedTime: number;
    taskId: string | null;
    phaseId: string | null;
  }) {
    const timerState = {
      ...state,
      timestamp: Date.now(),
      startTime: state.startTime?.getTime() || null
    };
    
    localStorage.setItem('timer_state_backup', JSON.stringify(timerState));
  }

  /**
   * ローカルストレージからタイマー状態を復元
   */
  restoreTimerState(): {
    isRunning: boolean;
    startTime: Date | null;
    elapsedTime: number;
    taskId: string | null;
    phaseId: string | null;
    backgroundDuration?: number;
  } | null {
    try {
      const stateStr = localStorage.getItem('timer_state_backup');
      if (!stateStr) return null;

      const state = JSON.parse(stateStr);
      const now = Date.now();
      const backgroundDuration = Math.floor((now - state.timestamp) / 1000);

      return {
        isRunning: state.isRunning,
        startTime: state.startTime ? new Date(state.startTime) : null,
        elapsedTime: state.elapsedTime,
        taskId: state.taskId,
        phaseId: state.phaseId,
        backgroundDuration: state.isRunning ? backgroundDuration : 0
      };
    } catch (error) {
      console.error('Failed to restore timer state:', error);
      return null;
    }
  }

  /**
   * タイマー状態のバックアップをクリア
   */
  clearTimerState() {
    localStorage.removeItem('timer_state_backup');
  }

  /**
   * リスナーのクリーンアップ
   */
  cleanup() {
    if (this.visibilityChangeHandler) {
      document.removeEventListener('visibilitychange', this.visibilityChangeHandler);
      this.visibilityChangeHandler = null;
    }

    if (this.beforeUnloadHandler) {
      window.removeEventListener('beforeunload', this.beforeUnloadHandler);
      this.beforeUnloadHandler = null;
    }

    if (this.pageHideHandler) {
      window.removeEventListener('pagehide', this.pageHideHandler);
      this.pageHideHandler = null;
    }

    if (this.pageShowHandler) {
      window.removeEventListener('pageshow', this.pageShowHandler);
      this.pageShowHandler = null;
    }
  }
}

/**
 * タイマーの精度を向上させるためのユーティリティ
 */
export class TimerAccuracy {
  /**
   * 高精度タイマーを作成（requestAnimationFrame使用）
   */
  static createHighAccuracyTimer(callback: (elapsedMs: number) => void): {
    start: () => void;
    stop: () => void;
  } {
    let animationId: number | null = null;
    let startTime: number | null = null;

    const tick = (currentTime: number) => {
      if (startTime === null) {
        startTime = currentTime;
      }

      const elapsed = currentTime - startTime;
      callback(elapsed);

      animationId = requestAnimationFrame(tick);
    };

    return {
      start: () => {
        if (animationId === null) {
          startTime = null;
          animationId = requestAnimationFrame(tick);
        }
      },
      stop: () => {
        if (animationId !== null) {
          cancelAnimationFrame(animationId);
          animationId = null;
          startTime = null;
        }
      }
    };
  }

  /**
   * システム時刻の変更を検出
   */
  static detectTimeChange(callback: (timeDiff: number) => void): () => void {
    let lastTime = Date.now();
    let intervalId: NodeJS.Timeout;

    const check = () => {
      const currentTime = Date.now();
      const expectedTime = lastTime + 1000; // 1秒後の予想時刻
      const timeDiff = Math.abs(currentTime - expectedTime);

      // 2秒以上の差がある場合は時刻変更と判断
      if (timeDiff > 2000) {
        callback(timeDiff);
      }

      lastTime = currentTime;
    };

    intervalId = setInterval(check, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }
}